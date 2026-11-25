/**
 * Isolated Local Properties Sandbox loader for puntacana-investments-web.
 * Reads directly from the atomic local JSON mirror written by the isolated Django sandbox
 * (.local-properties-sandbox/public_catalog_live.json), with HTTP fallback when configured.
 * Activates ONLY in local sandbox mode; never mutates production Sanity, Railway, or Vercel.
 */
import fs from "fs";
import path from "path";
import type { Property } from "@/data/properties";
import type { BlogPost } from "@/data/blog";

export interface LocalSandboxCatalogResponse {
  sandbox_mode: boolean;
  count: number;
  properties: (Property & {
    catalog_position?: number;
    home_positions?: {
      hero_position?: number | null;
      sale_position?: number | null;
      rent_position?: number | null;
      featured_position?: number | null;
    };
  })[];
  ordering_by_language?: Record<string, any>;
  blog_posts?: any[];
}

export function isLocalSandboxEnabled(): boolean {
  return Boolean(
    process.env.LOCAL_PROPERTIES_SANDBOX_FILE || process.env.LOCAL_PROPERTIES_SANDBOX_URL
  );
}

export async function fetchLocalSandboxCatalog(): Promise<LocalSandboxCatalogResponse | null> {
  const filePath = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (filePath) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw) as LocalSandboxCatalogResponse;
      }
    } catch (err) {
      console.error("Local Sandbox JSON mirror read error:", err);
    }
  }

  const baseUrl = process.env.LOCAL_PROPERTIES_SANDBOX_URL;
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/properties-sandbox/public-catalog/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as LocalSandboxCatalogResponse;
  } catch (err) {
    console.error("Local Sandbox catalog fetch error:", err);
    return null;
  }
}

export async function fetchLocalSandboxPropertyBySlug(slug: string): Promise<Property | null> {
  const data = await fetchLocalSandboxCatalog();
  if (!data) return null;
  const found = data.properties.find((p) => p.slug === slug);
  return (found as Property) || null;
}

export async function fetchLocalSandboxDraftPreview(slug: string): Promise<(Property & { is_draft_preview?: boolean; internal_code?: string; catalog_position?: number; specs?: Record<string, any> }) | null> {
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (catalogFile) {
    const safeSlug = slug.replace(/[^a-z0-9-]/gi, "");
    const previewFile = path.join(path.dirname(catalogFile), "preview_drafts", `${safeSlug}.json`);
    try {
      if (fs.existsSync(previewFile)) {
        const raw = fs.readFileSync(previewFile, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("Draft preview read error:", err);
    }
  }
  const pub = await fetchLocalSandboxPropertyBySlug(slug);
  return pub as any;
}

export function appendSandboxTestInboxEntry(entry: Record<string, any>): { id: string; count: number } | null {
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (!catalogFile) return null;
  const inboxFile = path.join(path.dirname(catalogFile), "test_inbox.json");
  let existing: Record<string, any>[] = [];
  try {
    if (fs.existsSync(inboxFile)) {
      const parsed = JSON.parse(fs.readFileSync(inboxFile, "utf-8"));
      if (Array.isArray(parsed)) existing = parsed;
    }
  } catch {
    existing = [];
  }
  const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const record = {
    id,
    received_at_iso: new Date().toISOString(),
    delivery_mode: "LOCAL_TEST_INBOX_INTERCEPTED",
    real_email_sent: false,
    ...entry,
  };
  const next = [record, ...existing].slice(0, 150);
  const tmpFile = `${inboxFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(next, null, 2), "utf-8");
  fs.renameSync(tmpFile, inboxFile);
  return { id, count: next.length };
}

export function upsertSandboxFounderLead(params: {
  name: string;
  email: string;
  phone: string;
  modality: string;
  message?: string;
  lang?: string;
  project_slug?: string;
  idempotency_key?: string;
}): {
  id: string;
  sequence_number: string;
  deduplicated: boolean;
  duplicate_attempts_blocked: number;
  count: number;
} | null {
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (!catalogFile) return null;
  const inboxFile = path.join(path.dirname(catalogFile), "test_inbox.json");
  let existing: Record<string, any>[] = [];
  try {
    if (fs.existsSync(inboxFile)) {
      const parsed = JSON.parse(fs.readFileSync(inboxFile, "utf-8"));
      if (Array.isArray(parsed)) existing = parsed;
    }
  } catch {
    existing = [];
  }

  const normEmail = String(params.email || "").trim().toLowerCase();
  const normProject = String(params.project_slug || "miches-eco-resort").trim().toLowerCase();
  const normModality = String(params.modality || "unidades").trim().toLowerCase() === "capital" ? "capital" : "unidades";
  const idemKey = String(params.idempotency_key || "").trim();
  const lang = ["es", "en", "fr"].includes(String(params.lang || "").toLowerCase())
    ? String(params.lang).toLowerCase()
    : "es";
  const nowIso = new Date().toISOString();

  // First normalize any historical duplicate founder entries in chronological order
  const nonFounder: Record<string, any>[] = [];
  const founderEntries: Record<string, any>[] = [];
  for (const item of existing) {
    if (item && item.form_type === "founder_investor") {
      founderEntries.push(item);
    } else if (item) {
      nonFounder.push(item);
    }
  }

  // Sort chronological (oldest first) so sequence_number is deterministic and stable
  founderEntries.sort((a, b) =>
    String(a.received_at_iso || "").localeCompare(String(b.received_at_iso || ""))
  );

  const canonicalFounders: Record<string, any>[] = [];
  const bySemanticKey = new Map<string, Record<string, any>>();
  let maxSeq = 0;

  for (const fe of founderEntries) {
    const feEmail = String(fe.lead?.email || fe.client_autoresponder_to || "").trim().toLowerCase();
    const feProj = String(fe.project_slug || "miches-eco-resort").trim().toLowerCase();
    const semKey = `${feEmail}::${feProj}`;
    const existingCanon = feEmail ? bySemanticKey.get(semKey) : undefined;
    if (existingCanon) {
      existingCanon.duplicate_attempts_blocked = Number(existingCanon.duplicate_attempts_blocked || 0) + 1 + Number(fe.duplicate_attempts_blocked || 0);
      existingCanon.last_attempt_at_iso = fe.received_at_iso || nowIso;
      const mergedIds = Array.isArray(existingCanon.merged_duplicate_ids) ? existingCanon.merged_duplicate_ids : [];
      if (fe.id && !mergedIds.includes(fe.id)) mergedIds.push(fe.id);
      existingCanon.merged_duplicate_ids = mergedIds;
      const keys = Array.isArray(existingCanon.seen_idempotency_keys) ? existingCanon.seen_idempotency_keys : [];
      if (fe.idempotency_key && !keys.includes(fe.idempotency_key)) keys.push(fe.idempotency_key);
      existingCanon.seen_idempotency_keys = keys;
      continue;
    }
    const m = /^FND-LOC-(\d+)$/i.exec(String(fe.sequence_number || ""));
    const seqNum = m ? parseInt(m[1], 10) : maxSeq + 1;
    if (seqNum > maxSeq) maxSeq = seqNum;
    fe.sequence_number = `FND-LOC-${String(seqNum).padStart(3, "0")}`;
    fe.project_slug = feProj;
    fe.duplicate_attempts_blocked = Number(fe.duplicate_attempts_blocked || 0);
    if (!Array.isArray(fe.seen_idempotency_keys)) {
      fe.seen_idempotency_keys = fe.idempotency_key ? [fe.idempotency_key] : [];
    }
    canonicalFounders.push(fe);
    if (feEmail) bySemanticKey.set(semKey, fe);
  }

  // Match incoming request by idempotency_key OR (normalized_email + project_slug)
  let matched: Record<string, any> | undefined;
  if (idemKey) {
    matched = canonicalFounders.find(
      (f) => f.idempotency_key === idemKey || (Array.isArray(f.seen_idempotency_keys) && f.seen_idempotency_keys.includes(idemKey))
    );
  }
  if (!matched && normEmail) {
    matched = bySemanticKey.get(`${normEmail}::${normProject}`);
  }

  let resultRecord: Record<string, any>;
  let deduplicated = false;

  if (matched) {
    deduplicated = true;
    matched.duplicate_attempts_blocked = Number(matched.duplicate_attempts_blocked || 0) + 1;
    matched.last_attempt_at_iso = nowIso;
    if (idemKey && !matched.seen_idempotency_keys.includes(idemKey)) {
      matched.seen_idempotency_keys.push(idemKey);
    }
    if (params.message && !matched.lead?.message) {
      matched.lead = { ...(matched.lead || {}), message: params.message };
    }
    resultRecord = matched;
  } else {
    const nextSeq = maxSeq + 1;
    const sequenceNumber = `FND-LOC-${String(nextSeq).padStart(3, "0")}`;
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    resultRecord = {
      id,
      sequence_number: sequenceNumber,
      project_slug: normProject,
      modality: normModality,
      idempotency_key: idemKey || `${normEmail}::${normProject}`,
      seen_idempotency_keys: idemKey ? [idemKey] : [],
      duplicate_attempts_blocked: 0,
      received_at_iso: nowIso,
      last_attempt_at_iso: nowIso,
      delivery_mode: "LOCAL_TEST_INBOX_INTERCEPTED",
      real_email_sent: false,
      form_type: "founder_investor",
      form_label: "Lista Cero / Inversor Fundador",
      lang,
      configured_from: "Web Punta Cana Investments <info@puntacanainvestmentsrd.com>",
      configured_pci_recipient: "info@puntacanainvestmentsrd.com",
      client_autoresponder_to: params.email.trim(),
      admin_subject: `NUEVO INVERSOR FUNDADOR: ${params.name.trim()} (${normModality}) [${sequenceNumber}]`,
      client_subject:
        lang === "en"
          ? `Zero List Confirmation (${sequenceNumber}) — Punta Cana Investments`
          : lang === "fr"
          ? `Confirmation Liste Zéro (${sequenceNumber}) — Punta Cana Investments`
          : `Confirmación Lista Cero (${sequenceNumber}) — Punta Cana Investments`,
      property_reference: { title: `Proyecto Fundador (${normModality})`, type: "founder_investor" },
      lead: {
        name: params.name.trim(),
        email: params.email.trim(),
        phone: params.phone.trim(),
        modality: normModality,
        message: (params.message || "").trim() || normModality,
      },
      deduplication_note: "Deduplicación activa por idempotency_key y correo+proyecto (1 interesado = 1 registro).",
    };
    canonicalFounders.push(resultRecord);
  }

  // Merge back newest first for inbox readability
  const mergedInbox = [...canonicalFounders, ...nonFounder]
    .sort((a, b) => String(b.received_at_iso || "").localeCompare(String(a.received_at_iso || "")))
    .slice(0, 150);

  const tmpFile = `${inboxFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(mergedInbox, null, 2), "utf-8");
  fs.renameSync(tmpFile, inboxFile);

  return {
    id: String(resultRecord.id),
    sequence_number: String(resultRecord.sequence_number),
    deduplicated,
    duplicate_attempts_blocked: Number(resultRecord.duplicate_attempts_blocked || 0),
    count: canonicalFounders.length,
  };
}

export function upsertSandboxOffMarketApplication(params: {
  name: string;
  company?: string;
  email: string;
  phone: string;
  tab: "oportunidad" | "hoteles";
  budget: string;
  regions: string[];
  details: Record<string, string>;
  compiledMessage: string;
  lang?: string;
  idempotency_key?: string;
  simulate_email_failure?: boolean;
}): {
  id: string;
  reference_code: string;
  deduplicated: boolean;
  email_status: "intercepted_local" | "failed_simulated";
  email_error: string | null;
} | null {
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (!catalogFile) return null;
  const inboxFile = path.join(path.dirname(catalogFile), "test_inbox.json");
  let existing: Record<string, any>[] = [];
  try {
    if (fs.existsSync(inboxFile)) {
      const parsed = JSON.parse(fs.readFileSync(inboxFile, "utf-8"));
      if (Array.isArray(parsed)) existing = parsed;
    }
  } catch {
    existing = [];
  }

  const nowIso = new Date().toISOString();
  const idemKey = String(params.idempotency_key || "").trim();
  const lang = ["es", "en", "fr"].includes(String(params.lang || "").toLowerCase())
    ? String(params.lang).toLowerCase()
    : "es";
  const emailFailed = Boolean(params.simulate_email_failure);
  const emailStatus: "intercepted_local" | "failed_simulated" = emailFailed ? "failed_simulated" : "intercepted_local";
  const emailError = emailFailed
    ? "Fallo simulado de envío de correo (proveedor SMTP/Resend no disponible); solicitud preservada localmente."
    : null;

  const existingOm = existing.filter((e) => e && e.form_type === "off_market_application");
  let maxSeq = 0;
  for (const item of existingOm) {
    const m = /^OM-LOC-(\d+)$/i.exec(String(item.reference_code || ""));
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > maxSeq) maxSeq = n;
    }
  }

  const dup = idemKey ? existingOm.find((e) => e.idempotency_key === idemKey) : undefined;
  if (dup) {
    dup.last_attempt_at_iso = nowIso;
    dup.duplicate_attempts_blocked = Number(dup.duplicate_attempts_blocked || 0) + 1;
    const tmpFile = `${inboxFile}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(existing, null, 2), "utf-8");
    fs.renameSync(tmpFile, inboxFile);
    return {
      id: String(dup.id),
      reference_code: String(dup.reference_code),
      deduplicated: true,
      email_status: dup.email_status || emailStatus,
      email_error: dup.email_error || null,
    };
  }

  const referenceCode = `OM-LOC-${String(maxSeq + 1).padStart(3, "0")}`;
  const id = `om-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const record = {
    id,
    reference_code: referenceCode,
    idempotency_key: idemKey || `${params.email.trim().toLowerCase()}::${params.tab}::${Date.now()}`,
    received_at_iso: nowIso,
    last_attempt_at_iso: nowIso,
    duplicate_attempts_blocked: 0,
    delivery_mode: emailFailed ? "LOCAL_SANDBOX_SAVED_EMAIL_FAILED_SIMULATED" : "LOCAL_TEST_INBOX_INTERCEPTED",
    real_email_sent: false,
    email_status: emailStatus,
    email_error: emailError,
    form_type: "off_market_application",
    form_label: "Solicitud Búsqueda Privada Off-Market",
    lang,
    configured_from: "Web Punta Cana Investments <info@puntacanainvestmentsrd.com>",
    configured_pci_recipient: "info@puntacanainvestmentsrd.com",
    client_autoresponder_to: params.email.trim(),
    admin_subject: `SOLICITUD OFF-MARKET [${referenceCode}]: ${params.name.trim()} (${params.budget})`,
    client_subject:
      lang === "en"
        ? `Off-Market Request Received (${referenceCode}) — Punta Cana Investments`
        : lang === "fr"
        ? `Demande Off-Market Reçue (${referenceCode}) — Punta Cana Investments`
        : `Requerimiento Off-Market Recibido (${referenceCode}) — Punta Cana Investments`,
    off_market_data: {
      tab: params.tab,
      company: (params.company || "").trim(),
      budget: params.budget,
      regions: params.regions,
      details: params.details,
    },
    lead: {
      name: params.name.trim(),
      company: (params.company || "").trim(),
      email: params.email.trim(),
      phone: params.phone.trim(),
      budget: params.budget,
      regions: params.regions,
      message: params.compiledMessage,
    },
  };

  const next = [record, ...existing].slice(0, 150);
  const tmpFile = `${inboxFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(next, null, 2), "utf-8");
  fs.renameSync(tmpFile, inboxFile);

  return {
    id,
    reference_code: referenceCode,
    deduplicated: false,
    email_status: emailStatus,
    email_error: emailError,
  };
}

function resolveSandboxMediaUrl(url: any, fallback = ""): string {
  const s = typeof url === "string" ? url.trim() : "";
  if (!s) return fallback;
  if (s.startsWith("/media/")) return `http://127.0.0.1:8110${s}`;
  return s;
}

function normalizeLocalizedText(val: any, fallbackEs = "", fallbackEn = "", fallbackFr = "") {
  if (val && typeof val === "object") {
    return {
      es: String(val.es || fallbackEs || ""),
      en: String(val.en || fallbackEn || ""),
      fr: String(val.fr || fallbackFr || ""),
    };
  }
  const s = typeof val === "string" ? val : "";
  return {
    es: s || fallbackEs,
    en: s || fallbackEn,
    fr: s || fallbackFr,
  };
}

export function mapSandboxBlogPosts(rawPosts: any[] = []): BlogPost[] {
  return rawPosts.map((p: any) => {
    const titleLoc = p.titleLocalized || p.title;
    const titleEs = (typeof titleLoc === "object" ? titleLoc?.es : "") || p.titleEs || (typeof p.title === "string" ? p.title : "") || "";
    const titleEn = (typeof titleLoc === "object" ? titleLoc?.en : "") || p.titleEn || (typeof p.title === "string" ? p.title : "") || titleEs;
    const titleFr = (typeof titleLoc === "object" ? titleLoc?.fr : "") || p.titleFr || titleEn || titleEs;

    const excerptLoc = p.excerptLocalized || p.excerpt;
    const excerptEs = (typeof excerptLoc === "object" ? excerptLoc?.es : "") || p.excerptEs || "";
    const excerptEn = (typeof excerptLoc === "object" ? excerptLoc?.en : "") || p.excerptEn || excerptEs;
    const excerptFr = (typeof excerptLoc === "object" ? excerptLoc?.fr : "") || p.excerptFr || excerptEn || excerptEs;

    const cat = normalizeLocalizedText(p.category, "General", "General", "Général");
    const altLoc = normalizeLocalizedText(p.coverImageAlt || p.cover_image_alt, titleEs, titleEn, titleFr);
    const authorRole = normalizeLocalizedText(p.authorRole || p.author_role, "Autor", "Author", "Auteur");
    const authorBio = normalizeLocalizedText(p.authorBio || p.author_bio, "", "", "");

    const pubDate = p.publishedAt || p.published_at || "";
    const dateObj = pubDate ? new Date(pubDate) : null;
    const validDate = dateObj && !Number.isNaN(dateObj.getTime()) ? dateObj : null;

    const seoIn = p.seo && typeof p.seo === "object" ? p.seo : {};
    const seoTitle = normalizeLocalizedText(seoIn.title, titleEs, titleEn, titleFr);
    const seoDesc = normalizeLocalizedText(seoIn.description, excerptEs, excerptEn, excerptFr);
    const seoKw = {
      es: String(seoIn.keywords?.es || p.seoKeywordsEs || ""),
      en: String(seoIn.keywords?.en || p.seoKeywordsEn || ""),
      fr: String(seoIn.keywords?.fr || p.seoKeywordsFr || ""),
    };

    const contentEs = Array.isArray(p.contentEs)
      ? p.contentEs
      : Array.isArray(p.content_blocks?.es)
      ? p.content_blocks.es
      : p.body?.es
      ? [{ _type: "markdownText", text: p.body.es }]
      : [];
    const contentEn = Array.isArray(p.contentEn)
      ? p.contentEn
      : Array.isArray(p.content_blocks?.en)
      ? p.content_blocks.en
      : p.body?.en
      ? [{ _type: "markdownText", text: p.body.en }]
      : [];
    const contentFr = Array.isArray(p.contentFr)
      ? p.contentFr
      : Array.isArray(p.content_blocks?.fr)
      ? p.content_blocks.fr
      : p.body?.fr
      ? [{ _type: "markdownText", text: p.body.fr }]
      : [];

    return {
      slug: p.slug || "",
      title: { es: titleEs, en: titleEn, fr: titleFr },
      date: {
        en: validDate ? validDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "",
        es: validDate ? validDate.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }) : "",
        fr: validDate ? validDate.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) : "",
      },
      publishedAt: pubDate || undefined,
      category: cat,
      mainImage: resolveSandboxMediaUrl(p.mainImageUrl || p.cover_image, "/images/og-home-luxury.webp"),
      coverImageAlt: altLoc,
      excerpt: { es: excerptEs, en: excerptEn, fr: excerptFr },
      author: p.author || "Ulises Ubiera",
      authorRole,
      authorBio,
      authorImage: resolveSandboxMediaUrl(p.authorImageUrl || p.author_image, "/images/ceo-final.jpg"),
      content: { es: contentEs, en: contentEn, fr: contentFr },
      seo: {
        title: seoTitle,
        description: seoDesc,
        keywords: seoKw,
      },
      seoKeywords: seoKw,
      relatedProperties: Array.isArray(p.relatedProperties) ? p.relatedProperties : [],
      relatedPropertySlugs: Array.isArray(p.relatedPropertySlugs || p.related_property_slugs)
        ? (p.relatedPropertySlugs || p.related_property_slugs)
        : [],
      linkedGuides: [],
      status: p.status || "published",
      isDraftPreview: Boolean(p.is_draft_preview),
    } as BlogPost;
  });
}

export async function fetchLocalSandboxBlogPosts(): Promise<BlogPost[]> {
  const sb = await fetchLocalSandboxCatalog();
  if (sb?.blog_posts && Array.isArray(sb.blog_posts) && sb.blog_posts.length > 0) {
    return mapSandboxBlogPosts(sb.blog_posts);
  }
  return [];
}

export async function fetchLocalSandboxBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await fetchLocalSandboxBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function fetchLocalSandboxBlogPreviewBySlug(slug: string): Promise<BlogPost | null> {
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (catalogFile) {
    const safeSlug = slug.replace(/[^a-z0-9-]/gi, "");
    const previewFile = path.join(path.dirname(catalogFile), "blog_preview_drafts", `${safeSlug}.json`);
    try {
      if (fs.existsSync(previewFile)) {
        const raw = JSON.parse(fs.readFileSync(previewFile, "utf-8"));
        const mapped = mapSandboxBlogPosts([raw]);
        if (mapped[0]) return mapped[0];
      }
    } catch (err) {
      console.error("Blog draft preview read error:", err);
    }
  }
  return fetchLocalSandboxBlogPostBySlug(slug);
}

export interface LocalWebManagerLocation {
  order: number;
  slug: string;
  code_abbrev: string;
  title_es: string;
  title_en: string;
  title_fr: string;
  img: string;
  lat?: number;
  lng?: number;
  show_in_homepage?: boolean;
  show_in_locations_page?: boolean;
  show_in_property_filters?: boolean;
  show_in_property_wizard?: boolean;
  is_baseline?: boolean;
}

export interface LocalWebManagerPayload {
  sandbox_mode: boolean;
  phase: string;
  version: number;
  updated_at_iso: string;
  locations: LocalWebManagerLocation[];
  homepage: {
    hero: {
      title: { es: string; en: string; fr: string };
      subtitle: { es: string; en: string; fr: string };
      cta: { es: string; en: string; fr: string };
      scroll: { es: string; en: string; fr: string };
      hero_image?: string;
      hero_slider_custom?: boolean;
    };
    locations_section: {
      title: { es: string; en: string; fr: string };
      subtitle: { es: string; en: string; fr: string };
      exploreMore: { es: string; en: string; fr: string };
      homepage_limit?: number;
    };
    sections_order?: string[];
    sections_visibility: Record<string, boolean>;
  };
  placements?: {
    hero_slider: string[];
    sale: string[];
    rent: string[];
    featured: string[];
    suggested: string[];
    location_placements: Record<string, string[]>;
  };
}

export function fetchLocalSandboxWebManager(): LocalWebManagerPayload | null {
  if (!isLocalSandboxEnabled()) return null;
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (!catalogFile) return null;
  const wmFile = path.join(path.dirname(catalogFile), "web_manager_live.json");
  try {
    if (fs.existsSync(wmFile)) {
      return JSON.parse(fs.readFileSync(wmFile, "utf-8"));
    }
  } catch (err) {
    console.error("Local web manager read error:", err);
  }
  return null;
}

export function fetchLocalSandboxPhase7(): Record<string, any> | null {
  if (!isLocalSandboxEnabled()) return null;
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (!catalogFile) return null;
  const p7File = path.join(path.dirname(catalogFile), "phase7_investments_live.json");
  try {
    if (fs.existsSync(p7File)) {
      return JSON.parse(fs.readFileSync(p7File, "utf-8"));
    }
  } catch (err) {
    console.error("Local phase7 read error:", err);
  }
  return null;
}

export function resolvePhase7MediaUrl(url: any, fallback = "/images/og-home-luxury.webp"): string {
  const s = typeof url === "string" ? url.trim() : "";
  if (!s) return fallback;
  if (s.startsWith("/media/")) return `http://127.0.0.1:8110${s}`;
  return s;
}

export function mapWebManagerLocations(
  rawLocations: LocalWebManagerLocation[] = [],
  lang: "es" | "en" | "fr" = "es",
  flagKey: "show_in_homepage" | "show_in_locations_page" | "show_in_property_filters" = "show_in_homepage"
) {
  const apiOrigin = "http://127.0.0.1:8110";
  return [...rawLocations]
    .filter((loc) => loc && loc[flagKey] !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((loc) => {
      const rawImg = loc.img || "/images/locations/punta_cana.jpg";
      const resolvedImg = rawImg.startsWith("/media/") ? `${apiOrigin}${rawImg}` : rawImg;
      const localizedTitle =
        lang === "en"
          ? loc.title_en || loc.title_es
          : lang === "fr"
          ? loc.title_fr || loc.title_es
          : loc.title_es;
      return {
        title: localizedTitle,
        slug: loc.slug,
        img: resolvedImg,
        is_baseline: Boolean(loc.is_baseline),
      };
    });
}
