/**
 * Isolated Local Properties Sandbox loader for puntacana-investments-web.
 * Reads directly from the atomic local JSON mirror written by the isolated Django sandbox
 * (.local-properties-sandbox/public_catalog_live.json), with HTTP fallback when configured.
 * Activates ONLY in local sandbox mode; never mutates production Sanity, Railway, or Vercel.
 */
import fs from "fs";
import path from "path";
import { cache } from "react";
import { cookies } from "next/headers";
import type { Property } from "@/data/properties";
import type { BlogPost } from "@/data/blog";
import { buildOffMarketEmails, normalizeLang, type RenderedEmailPayload } from "@/lib/formEmails";

export const CLEAN_PREVIEW_COOKIE = "pci_clean_preview";
export const CLEAN_CABEZADETORO_COOKIE = "pci_clean_cabezadetoro";

export interface CleanPreviewFlags {
  enabled: boolean;
  includeCabezaDeToro: boolean;
}

const EXCLUDED_TEST_PROPERTY_SLUGS = new Set([
  "apartamento-mirador-marina-2-hab-cap-cana",
  "apartamento-prueba-hoa-fase-5",
]);

const EXCLUDED_TEST_BLOG_SLUGS = new Set([
  "guia-prueba-inversion-fase-6",
]);

export async function getCleanPreviewFlags(): Promise<CleanPreviewFlags> {
  if (!isLocalSandboxEnabled()) {
    return { enabled: false, includeCabezaDeToro: false };
  }
  try {
    const store = await cookies();
    const enabled = store.get(CLEAN_PREVIEW_COOKIE)?.value === "1";
    const includeCabezaDeToro = store.get(CLEAN_CABEZADETORO_COOKIE)?.value === "1";
    return { enabled, includeCabezaDeToro };
  } catch {
    return { enabled: false, includeCabezaDeToro: false };
  }
}

function isDemoMediaUrl(url: unknown): boolean {
  const s = String(url || "").trim().toLowerCase();
  return s.includes("/demo-media/");
}

function applyCleanCatalogFilter(
  data: LocalSandboxCatalogResponse,
  clean: CleanPreviewFlags
): LocalSandboxCatalogResponse {
  if (!clean.enabled) return data;
  const filteredProps = (data.properties || [])
    .filter((p: any) => {
      if (!p) return false;
      const slug = typeof p.slug === "object" && p.slug !== null ? p.slug.current : p.slug;
      if (EXCLUDED_TEST_PROPERTY_SLUGS.has(String(slug || ""))) return false;
      const pos = Number(p.catalog_position ?? 999);
      return pos >= 1 && pos <= 39;
    })
    .map((p: any) => {
      const next: any = { ...p };
      // Exclude test advisor and any demo media from public clean preview
      next.advisor = null;
      next.show_advisor = false;
      if (next.display && typeof next.display === "object") {
        next.display = { ...next.display, show_advisor: false };
      }
      if (next.specs && typeof next.specs === "object") {
        next.specs = {
          ...next.specs,
          advisor_id: null,
          display: { ...(next.specs.display || {}), show_advisor: false },
        };
      }
      if (isDemoMediaUrl(next.videoUrl)) next.videoUrl = "";
      if (isDemoMediaUrl(next.virtualTourUrl)) next.virtualTourUrl = "";
      return next;
    });

  const filteredBlogs = (data.blog_posts || []).filter((b: any) => {
    if (!b) return false;
    const slug = String(b.slug || "");
    if (EXCLUDED_TEST_BLOG_SLUGS.has(slug)) return false;
    return String(b.status || "published").toLowerCase() === "published";
  });

  return {
    ...data,
    count: filteredProps.length,
    properties: filteredProps,
    blog_posts: filteredBlogs,
  };
}

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

export function getPhase4BackendBaseUrl(): string {
  const raw =
    process.env.PHASE4_BACKEND_URL ||
    process.env.LOCAL_PROPERTIES_SANDBOX_URL ||
    process.env.NEXT_PUBLIC_SANDBOX_API_URL ||
    "";
  return raw.trim().replace(/\/+$/, "");
}

/**
 * True ONLY in isolated local Mac disk sandbox (where test_inbox.json & local JSON files exist).
 * Used to intercept forms into local disk test_inbox.json without sending real emails.
 */
export function isLocalFileSandbox(): boolean {
  return Boolean(process.env.LOCAL_PROPERTIES_SANDBOX_FILE);
}

/**
 * True in Cloud Staging Stage 1 (Vercel Web Staging -> Railway Staging Backend over HTTPS,
 * FORM_EMAILS_SIMULATED_MODE=true, ZERO local disk files, ZERO external HubSpot/Resend sends).
 * Fails closed against the production Railway hostname.
 */
export function isCloudStagingSimulatedMode(): boolean {
  const sim = String(process.env.FORM_EMAILS_SIMULATED_MODE || "").trim().toLowerCase() === "true";
  const base = getPhase4BackendBaseUrl();
  if (!sim || isLocalFileSandbox() || !base) return false;
  if (base.toLowerCase().includes("puntacana-fortress-production.up.railway.app")) {
    return false;
  }
  return true;
}

export function getServerStagingApiKey(): string {
  return String(process.env.API_SHARED_SECRET || process.env.DASHBOARD_AUTH_API_KEY || "").trim();
}

export async function recordCloudStagingOutboxEvent(entry: Record<string, any>): Promise<void> {
  if (!isCloudStagingSimulatedMode()) return;
  const base = getPhase4BackendBaseUrl();
  const key = getServerStagingApiKey();
  if (!base || !key) return;
  try {
    await fetch(`${base}/api/crm-v2/staging/simulated-outbox/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": key,
      },
      body: JSON.stringify({
        source_app: "web_staging",
        external_provider_called: false,
        ...entry,
      }),
      cache: "no-store",
    });
  } catch {
    // Non-blocking audit log
  }
}

/**
 * True whenever the Web runs in Fases 1-8 Backend-driven mode (local file sandbox OR Cloud Staging/Production HTTP backend).
 */
export function isLocalSandboxEnabled(): boolean {
  return Boolean(process.env.LOCAL_PROPERTIES_SANDBOX_FILE || getPhase4BackendBaseUrl());
}

interface RemotePublicBundleResponse {
  catalog?: LocalSandboxCatalogResponse | null;
  web_manager?: LocalWebManagerPayload | null;
  phase7?: Record<string, any> | null;
  phase8?: Record<string, any> | null;
}

const fetchRemotePublicBundleCached = cache(async (): Promise<RemotePublicBundleResponse | null> => {
  const baseUrl = getPhase4BackendBaseUrl();
  if (!baseUrl) return null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${baseUrl}/api/properties-sandbox/public-bundle/`, {
        cache: "no-store",
      });
      if (res.ok) {
        return (await res.json()) as RemotePublicBundleResponse;
      }
    } catch (err) {
      if (attempt === 1) {
        console.error("Phase 4 public-bundle fetch error:", err);
      }
    }
    if (attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
  }
  return null;
});

function resolveBackendMediaUrl(url: any, fallback = ""): string {
  const s = typeof url === "string" ? url.trim() : "";
  if (!s) return fallback;
  const apiOrigin = getPhase4BackendBaseUrl() || "http://127.0.0.1:8110";
  if (s.startsWith("/media/")) return `${apiOrigin}${s}`;
  const localMediaMatch = s.match(/^https?:\/\/(?:127\.0\.0\.1|localhost):\d+(\/media\/.*)$/i);
  if (localMediaMatch) {
    return `${apiOrigin}${localMediaMatch[1]}`;
  }
  return s;
}

function normalizeCatalogMediaOrigins(
  data: LocalSandboxCatalogResponse
): LocalSandboxCatalogResponse {
  if (!data || !Array.isArray(data.properties)) return data;
  return {
    ...data,
    properties: data.properties.map((p: any) => {
      if (!p || typeof p !== "object") return p;
      const next: any = { ...p };
      if (typeof next.image === "string") next.image = resolveBackendMediaUrl(next.image);
      if (typeof next.mainImage === "string") next.mainImage = resolveBackendMediaUrl(next.mainImage);
      if (typeof next.cover_image === "string") next.cover_image = resolveBackendMediaUrl(next.cover_image);
      if (Array.isArray(next.images)) {
        next.images = next.images.map((u: any) => (typeof u === "string" ? resolveBackendMediaUrl(u) : u));
      }
      if (Array.isArray(next.gallery)) {
        next.gallery = next.gallery.map((u: any) => (typeof u === "string" ? resolveBackendMediaUrl(u) : u));
      }
      if (Array.isArray(next.gallery_urls)) {
        next.gallery_urls = next.gallery_urls.map((u: any) => (typeof u === "string" ? resolveBackendMediaUrl(u) : u));
      }
      return next;
    }),
  };
}

export async function fetchLocalSandboxCatalog(
  cleanOverride?: CleanPreviewFlags
): Promise<LocalSandboxCatalogResponse | null> {
  const clean = cleanOverride ?? (await getCleanPreviewFlags());
  const filePath = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (filePath) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = normalizeCatalogMediaOrigins(JSON.parse(raw) as LocalSandboxCatalogResponse);
        return applyCleanCatalogFilter(parsed, clean);
      }
    } catch (err) {
      console.error("Local Sandbox JSON mirror read error:", err);
    }
  }

  const bundle = await fetchRemotePublicBundleCached();
  if (bundle?.catalog) {
    return applyCleanCatalogFilter(normalizeCatalogMediaOrigins(bundle.catalog), clean);
  }

  const baseUrl = getPhase4BackendBaseUrl();
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/api/properties-sandbox/public-catalog/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const parsed = normalizeCatalogMediaOrigins((await res.json()) as LocalSandboxCatalogResponse);
    return applyCleanCatalogFilter(parsed, clean);
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
  const clean = await getCleanPreviewFlags();
  if (clean.enabled) return null;
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

export function appendSandboxTestInboxEntry(
  entry: Record<string, any>,
  buildEmailOverrides?: (referenceCode: string) => {
    admin_subject?: string;
    client_subject?: string;
    admin_email?: RenderedEmailPayload;
    client_email?: RenderedEmailPayload | null;
    property_reference?: Record<string, any>;
  }
): { id: string; reference_code: string; email_status: string; count: number } | null {
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
  const formType = String(entry.form_type || "general_contact");
  const prefix =
    formType === "hotel_inquiry"
      ? "HTL-LOC-"
      : formType === "property_inquiry"
      ? "INQ-LOC-"
      : "CNT-LOC-";
  const sameType = existing.filter((e) => e && e.form_type === formType);
  let maxSeq = sameType.length;
  const rx = new RegExp(`^${prefix}(\\d+)$`, "i");
  for (const item of sameType) {
    const m = rx.exec(String(item.reference_code || ""));
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > maxSeq) maxSeq = n;
    }
  }
  const reference_code = String(entry.reference_code || `${prefix}${String(maxSeq + 1).padStart(3, "0")}`);
  const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const email_status = String(entry.email_status || "intercepted_local");
  const overrides = buildEmailOverrides ? buildEmailOverrides(reference_code) : {};
  const record = {
    id,
    reference_code,
    received_at_iso: new Date().toISOString(),
    delivery_mode: "LOCAL_TEST_INBOX_INTERCEPTED",
    email_status,
    real_email_sent: false,
    ...entry,
    ...overrides,
    property_reference: overrides.property_reference
      ? { ...(entry.property_reference || {}), ...overrides.property_reference }
      : entry.property_reference,
  };
  const next = [record, ...existing].slice(0, 150);
  const tmpFile = `${inboxFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(next, null, 2), "utf-8");
  fs.renameSync(tmpFile, inboxFile);
  return { id, reference_code, email_status, count: next.length };
}

export interface FounderSequenceCodeEntry {
  code: string;
  seq: number;
  status: "active" | "retired_reserved";
  owner_id?: string;
  original_owner_id?: string;
  email?: string;
  original_email?: string;
  name?: string;
  original_name?: string;
  project_slug?: string;
  assigned_at_iso?: string;
  retired_at_iso?: string;
  merged_into?: string;
  merged_historical_codes?: string[];
  merged_duplicate_ids?: string[];
  migrated_from_reused_code?: string;
  collision_reassigned_owner_id?: string;
  collision_reassigned_email?: string;
  collision_reassigned_to?: string;
  retired_reason?: string;
  note?: string;
}

export interface FounderSequenceRegistry {
  schema_version: number;
  prefix: string;
  next_sequence: number;
  off_market_next_sequence?: number;
  updated_at_iso: string;
  codes: Record<string, FounderSequenceCodeEntry>;
}

function parseFounderSeq(code: unknown): number {
  const m = /^FND-LOC-(\d+)$/i.exec(String(code || "").trim());
  return m ? parseInt(m[1], 10) : 0;
}

function formatFounderCode(seq: number): string {
  return `FND-LOC-${String(seq).padStart(3, "0")}`;
}

function loadOrInitFounderSequenceRegistry(
  sandboxDir: string,
  existingEntries: Record<string, any>[],
  nowIso: string
): FounderSequenceRegistry {
  const regFile = path.join(sandboxDir, "founder_sequence_registry.json");
  let reg: FounderSequenceRegistry | null = null;
  try {
    if (fs.existsSync(regFile)) {
      const parsed = JSON.parse(fs.readFileSync(regFile, "utf-8"));
      if (parsed && typeof parsed === "object" && parsed.codes && typeof parsed.codes === "object") {
        reg = parsed as FounderSequenceRegistry;
      }
    }
  } catch {
    reg = null;
  }

  if (!reg) {
    reg = {
      schema_version: 1,
      prefix: "FND-LOC-",
      next_sequence: 1,
      off_market_next_sequence: 1,
      updated_at_iso: nowIso,
      codes: {},
    };
  }

  // Ensure monotonic high-water mark never regresses below any active, merged, or retired code
  let maxSeen = Math.max(0, Number(reg.next_sequence || 1) - 1);
  for (const [k, v] of Object.entries(reg.codes)) {
    const n = Math.max(parseFounderSeq(k), Number(v?.seq || 0));
    if (n > maxSeen) maxSeen = n;
  }
  for (const item of existingEntries) {
    if (!item || item.form_type !== "founder_investor") continue;
    const n1 = parseFounderSeq(item.sequence_number);
    if (n1 > maxSeen) maxSeen = n1;
    for (const hc of Array.isArray(item.merged_historical_codes) ? item.merged_historical_codes : []) {
      const n2 = parseFounderSeq(hc);
      if (n2 > maxSeen) maxSeen = n2;
    }
    const n3 = parseFounderSeq(item.previous_reused_code);
    if (n3 > maxSeen) maxSeen = n3;
  }
  if (Number(reg.next_sequence || 1) <= maxSeen) {
    reg.next_sequence = maxSeen + 1;
  }
  return reg;
}

function allocateUnusedFounderCode(reg: FounderSequenceRegistry): { seq: number; code: string } {
  let seq = Math.max(1, Number(reg.next_sequence || 1));
  while (reg.codes[formatFounderCode(seq)]) {
    seq += 1;
  }
  const code = formatFounderCode(seq);
  reg.next_sequence = seq + 1;
  return { seq, code };
}

function saveFounderSequenceRegistryAtomic(sandboxDir: string, reg: FounderSequenceRegistry, nowIso: string) {
  reg.updated_at_iso = nowIso;
  const regFile = path.join(sandboxDir, "founder_sequence_registry.json");
  const tmpFile = `${regFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(reg, null, 2), "utf-8");
  fs.renameSync(tmpFile, regFile);
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
  merged_historical_codes: string[];
  previous_reused_code?: string;
  count: number;
} | null {
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (!catalogFile) return null;
  const sandboxDir = path.dirname(catalogFile);
  const inboxFile = path.join(sandboxDir, "test_inbox.json");
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

  // Load persistent monotonic code registry so retired/merged codes are NEVER reused
  const registry = loadOrInitFounderSequenceRegistry(sandboxDir, existing, nowIso);

  // Separate founder entries from other forms
  const nonFounder: Record<string, any>[] = [];
  const founderEntries: Record<string, any>[] = [];
  for (const item of existing) {
    if (item && item.form_type === "founder_investor") {
      founderEntries.push(item);
    } else if (item) {
      nonFounder.push(item);
    }
  }

  // Sort chronological (oldest first) for deterministic canonical preservation
  founderEntries.sort((a, b) =>
    String(a.received_at_iso || "").localeCompare(String(b.received_at_iso || ""))
  );

  const canonicalFounders: Record<string, any>[] = [];
  const bySemanticKey = new Map<string, Record<string, any>>();

  for (const fe of founderEntries) {
    const feEmail = String(fe.lead?.email || fe.client_autoresponder_to || "").trim().toLowerCase();
    const feProj = String(fe.project_slug || "miches-eco-resort").trim().toLowerCase();
    const feMod = String(fe.modality || fe.lead?.modality || "").trim().toLowerCase() === "capital" ? "capital" : "unidades";
    const semKey = `${feEmail}::${feProj}::${feMod}`;
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

      // Permanently retire and reserve any distinct historical code assigned to the merged duplicate
      const dupCode = String(fe.sequence_number || "").trim();
      const dupSeq = parseFounderSeq(dupCode);
      if (dupSeq > 0 && dupCode !== existingCanon.sequence_number) {
        const histCodes = Array.isArray(existingCanon.merged_historical_codes) ? existingCanon.merged_historical_codes : [];
        if (!histCodes.includes(dupCode)) histCodes.push(dupCode);
        existingCanon.merged_historical_codes = histCodes;
        registry.codes[dupCode] = {
          ...(registry.codes[dupCode] || {}),
          code: dupCode,
          seq: dupSeq,
          status: "retired_reserved",
          original_owner_id: String(fe.id || ""),
          original_email: feEmail,
          original_name: String(fe.lead?.name || ""),
          project_slug: feProj,
          assigned_at_iso: String(fe.received_at_iso || nowIso),
          retired_at_iso: nowIso,
          merged_into: String(existingCanon.sequence_number),
          retired_reason: `Duplicado fusionado en ${existingCanon.sequence_number}; código reservado permanentemente para trazabilidad.`,
        };
        if (registry.codes[existingCanon.sequence_number]) {
          registry.codes[existingCanon.sequence_number].merged_historical_codes = histCodes;
          registry.codes[existingCanon.sequence_number].merged_duplicate_ids = mergedIds;
        }
        if (registry.next_sequence <= dupSeq) {
          registry.next_sequence = dupSeq + 1;
        }
      }
      continue;
    }

    let seqNum = parseFounderSeq(fe.sequence_number);
    let assignedCode = seqNum > 0 ? formatFounderCode(seqNum) : "";
    if (!assignedCode) {
      const alloc = allocateUnusedFounderCode(registry);
      seqNum = alloc.seq;
      assignedCode = alloc.code;
    } else if (!registry.codes[assignedCode]) {
      registry.codes[assignedCode] = {
        code: assignedCode,
        seq: seqNum,
        status: "active",
        owner_id: String(fe.id || ""),
        email: feEmail,
        name: String(fe.lead?.name || ""),
        project_slug: feProj,
        assigned_at_iso: String(fe.received_at_iso || nowIso),
        merged_historical_codes: Array.isArray(fe.merged_historical_codes) ? fe.merged_historical_codes : [],
        merged_duplicate_ids: Array.isArray(fe.merged_duplicate_ids) ? fe.merged_duplicate_ids : [],
      };
      if (registry.next_sequence <= seqNum) {
        registry.next_sequence = seqNum + 1;
      }
    }

    fe.sequence_number = assignedCode;
    fe.project_slug = feProj;
    fe.duplicate_attempts_blocked = Number(fe.duplicate_attempts_blocked || 0);
    if (!Array.isArray(fe.merged_historical_codes)) {
      fe.merged_historical_codes = [];
    }
    if (!Array.isArray(fe.seen_idempotency_keys)) {
      fe.seen_idempotency_keys = fe.idempotency_key ? [fe.idempotency_key] : [];
    }
    canonicalFounders.push(fe);
    if (feEmail) bySemanticKey.set(semKey, fe);
  }

  // Match incoming request by idempotency_key OR (normalized_email + project_slug + modality)
  // so a retry returns the exact same FND-LOC code, while a second legitimate request
  // (different modality or different future project) preserves its own history & reference.
  let matched: Record<string, any> | undefined;
  if (idemKey) {
    matched = canonicalFounders.find(
      (f) => f.idempotency_key === idemKey || (Array.isArray(f.seen_idempotency_keys) && f.seen_idempotency_keys.includes(idemKey))
    );
  }
  if (!matched && normEmail) {
    matched = bySemanticKey.get(`${normEmail}::${normProject}::${normModality}`);
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
    // Allocate a brand-new, never-previously-issued monotonic sequence code
    const { seq, code: sequenceNumber } = allocateUnusedFounderCode(registry);
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    resultRecord = {
      id,
      sequence_number: sequenceNumber,
      project_slug: normProject,
      modality: normModality,
      idempotency_key: idemKey || `${normEmail}::${normProject}`,
      seen_idempotency_keys: idemKey ? [idemKey] : [],
      duplicate_attempts_blocked: 0,
      merged_duplicate_ids: [],
      merged_historical_codes: [],
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
      deduplication_note: "Deduplicación activa por idempotency_key y correo+proyecto con secuencia monotónica permanente (sin reutilización de códigos).",
    };
    registry.codes[sequenceNumber] = {
      code: sequenceNumber,
      seq,
      status: "active",
      owner_id: id,
      email: normEmail,
      name: params.name.trim(),
      project_slug: normProject,
      assigned_at_iso: nowIso,
      merged_historical_codes: [],
      merged_duplicate_ids: [],
      note: "Código inédito asignado por contador monotónico permanente.",
    };
    canonicalFounders.push(resultRecord);
  }

  // Persist permanent sequence registry FIRST, then test_inbox atomically
  saveFounderSequenceRegistryAtomic(sandboxDir, registry, nowIso);

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
    merged_historical_codes: Array.isArray(resultRecord.merged_historical_codes) ? resultRecord.merged_historical_codes : [],
    previous_reused_code: resultRecord.previous_reused_code ? String(resultRecord.previous_reused_code) : undefined,
    crm_inquiry_id: resultRecord.crm_inquiry_id || null,
    crm_inquiry_code: resultRecord.crm_inquiry_code || "",
    count: canonicalFounders.length,
  };
}

export function attachM04LinkToInboxEntry(
  entryId: string,
  link: { crm_inquiry_id?: number | null; crm_inquiry_code?: string; crm_client_id?: number | null }
): boolean {
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (!catalogFile || !entryId) return false;
  const inboxFile = path.join(path.dirname(catalogFile), "test_inbox.json");
  if (!fs.existsSync(inboxFile)) return false;
  try {
    const parsed = JSON.parse(fs.readFileSync(inboxFile, "utf-8"));
    if (!Array.isArray(parsed)) return false;
    let changed = false;
    for (const item of parsed) {
      if (item && String(item.id) === String(entryId)) {
        if (link.crm_inquiry_id) item.crm_inquiry_id = link.crm_inquiry_id;
        if (link.crm_inquiry_code) item.crm_inquiry_code = link.crm_inquiry_code;
        if (link.crm_client_id) item.crm_client_id = link.crm_client_id;
        changed = true;
        break;
      }
    }
    if (!changed) return false;
    const tmpFile = `${inboxFile}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(parsed, null, 2), "utf-8");
    fs.renameSync(tmpFile, inboxFile);
    return true;
  } catch {
    return false;
  }
}

export function upsertSandboxMonitoringRequest(params: {
  name: string;
  email: string;
  phone: string;
  country?: string;
  project: string;
  location: string;
  investment?: string;
  date?: string;
  lang?: string;
  idempotency_key?: string;
}): {
  id: string;
  reference_code: string;
  deduplicated: boolean;
  duplicate_attempts_blocked: number;
  crm_inquiry_id?: number | null;
  crm_inquiry_code?: string;
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
  const normProject = String(params.project || "").trim().toLowerCase().replace(/\s+/g, " ");
  const normLocation = String(params.location || "").trim().toLowerCase().replace(/\s+/g, " ");
  const idemKey = String(params.idempotency_key || "").trim();
  const lang = ["es", "en", "fr"].includes(String(params.lang || "").toLowerCase())
    ? String(params.lang).toLowerCase()
    : "es";
  const nowIso = new Date().toISOString();

  const monEntries = existing.filter((e) => e && e.form_type === "investment_monitoring");
  let maxSeq = 0;
  for (const item of existing) {
    const m = /^CNT-LOC-(\d+)$/i.exec(String(item?.reference_code || ""));
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > maxSeq) maxSeq = n;
    }
  }

  // Deduplicate retries by idempotency_key OR (email + project + location)
  // A second legitimate request for a different project/location gets its own CNT-LOC code & history.
  let matched: Record<string, any> | undefined;
  if (idemKey) {
    matched = monEntries.find(
      (e) =>
        e.idempotency_key === idemKey ||
        (Array.isArray(e.seen_idempotency_keys) && e.seen_idempotency_keys.includes(idemKey))
    );
  }
  if (!matched && normEmail && normProject) {
    matched = monEntries.find((e) => {
      const eEmail = String(e.lead?.email || e.client_autoresponder_to || "").trim().toLowerCase();
      const eProj = String(e.monitoring_data?.project || e.property_reference?.title || "").trim().toLowerCase().replace(/\s+/g, " ");
      const eLoc = String(e.monitoring_data?.location || e.property_reference?.location || "").trim().toLowerCase().replace(/\s+/g, " ");
      return eEmail === normEmail && eProj === normProject && (!normLocation || !eLoc || eLoc === normLocation);
    });
  }

  let resultRecord: Record<string, any>;
  let deduplicated = false;
  if (matched) {
    deduplicated = true;
    matched.duplicate_attempts_blocked = Number(matched.duplicate_attempts_blocked || 0) + 1;
    matched.last_attempt_at_iso = nowIso;
    const seen = Array.isArray(matched.seen_idempotency_keys) ? matched.seen_idempotency_keys : [];
    if (idemKey && !seen.includes(idemKey)) seen.push(idemKey);
    matched.seen_idempotency_keys = seen;
    resultRecord = matched;
  } else {
    const reference_code = `CNT-LOC-${String(maxSeq + 1).padStart(3, "0")}`;
    const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    resultRecord = {
      id,
      reference_code,
      idempotency_key: idemKey || `${normEmail}::${normProject}::${normLocation}`,
      seen_idempotency_keys: idemKey ? [idemKey] : [],
      duplicate_attempts_blocked: 0,
      received_at_iso: nowIso,
      last_attempt_at_iso: nowIso,
      delivery_mode: "LOCAL_TEST_INBOX_INTERCEPTED",
      email_status: "intercepted_local",
      real_email_sent: false,
      form_type: "investment_monitoring",
      form_label: "Plan de Monitoreo de Inversión",
      lang,
      configured_from: "Web Punta Cana Investments <info@puntacanainvestmentsrd.com>",
      configured_pci_recipient: "info@puntacanainvestmentsrd.com",
      client_autoresponder_to: params.email.trim(),
      admin_subject: `LEAD MONITOREO: ${params.name.trim()} - ${params.project.trim() || "Proyecto"} [${reference_code}]`,
      client_subject:
        lang === "en"
          ? `Monitoring Request Confirmation (${reference_code}) — Punta Cana Investments`
          : lang === "fr"
          ? `Confirmation Demande de Suivi (${reference_code}) — Punta Cana Investments`
          : `Confirmación Plan de Monitoreo (${reference_code}) — Punta Cana Investments`,
      property_reference: {
        title: params.project.trim() || "Monitoreo de Inversión",
        location: params.location.trim() || "Punta Cana",
        type: "investment_monitoring",
      },
      monitoring_data: {
        country: (params.country || "").trim(),
        project: params.project.trim(),
        location: params.location.trim(),
        investment: (params.investment || "").trim(),
        date: (params.date || "").trim(),
      },
      lead: {
        name: params.name.trim(),
        email: params.email.trim(),
        phone: params.phone.trim(),
        message: `${params.project.trim()} · ${params.location.trim()} · ${(params.investment || "").trim()} · ${(params.date || "").trim()}`,
      },
      deduplication_note: "1 solicitud Monitoreo = 1 aviso PCI + 1 confirmación cliente (idempotente por correo+proyecto en buzón local y M04).",
    };
    existing = [resultRecord, ...existing].slice(0, 150);
  }

  const tmpFile = `${inboxFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(existing, null, 2), "utf-8");
  fs.renameSync(tmpFile, inboxFile);

  return {
    id: String(resultRecord.id),
    reference_code: String(resultRecord.reference_code),
    deduplicated,
    duplicate_attempts_blocked: Number(resultRecord.duplicate_attempts_blocked || 0),
    crm_inquiry_id: resultRecord.crm_inquiry_id || null,
    crm_inquiry_code: resultRecord.crm_inquiry_code || "",
    count: existing.filter((e) => e && e.form_type === "investment_monitoring").length,
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
  freeText?: string;
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
  const lang = normalizeLang(params.lang, "es");
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
  const built = buildOffMarketEmails({
    referenceCode,
    lang,
    name: params.name.trim(),
    company: (params.company || "").trim(),
    email: params.email.trim(),
    phone: params.phone.trim(),
    tab: params.tab,
    budget: params.budget,
    regions: params.regions,
    details: params.details,
    freeText: (params.freeText || "").trim(),
  });
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
    configured_from: built.adminEmail.from,
    configured_pci_recipient: built.adminEmail.to,
    client_autoresponder_to: built.clientEmail.to,
    admin_subject: built.adminEmail.subject,
    client_subject: built.clientEmail.subject,
    admin_email: built.adminEmail,
    client_email: built.clientEmail,
    off_market_data: {
      tab: params.tab,
      company: (params.company || "").trim(),
      budget: params.budget,
      regions: params.regions,
      details: params.details,
      free_text: (params.freeText || "").trim(),
    },
    lead: {
      name: params.name.trim(),
      company: (params.company || "").trim(),
      email: params.email.trim(),
      phone: params.phone.trim(),
      budget: params.budget,
      regions: params.regions,
      free_text: (params.freeText || "").trim(),
      message: params.compiledMessage,
    },
    deduplication_note: "1 solicitud Off-Market = 1 aviso PCI (opciones en español + mensaje libre original) + 1 confirmación cliente en su idioma (buzón local)",
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
  return resolveBackendMediaUrl(url, fallback);
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
  const clean = await getCleanPreviewFlags();
  if (clean.enabled) return null;
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

function applyCleanWebManagerFilter(
  parsed: LocalWebManagerPayload,
  clean?: CleanPreviewFlags
): LocalWebManagerPayload {
  if (!clean?.enabled) return parsed;
  const nextLocations = (parsed.locations || []).filter((loc) => {
    if (!loc) return false;
    if (loc.slug === "cabezadetoro" || loc.is_baseline === false) {
      return Boolean(clean.includeCabezaDeToro);
    }
    return true;
  });
  const cleanSlugs = (arr: string[] = []) =>
    arr.filter((s) => !EXCLUDED_TEST_PROPERTY_SLUGS.has(String(s || "")));
  const rawPl = parsed.placements;
  const nextPlacements = rawPl
    ? {
        ...rawPl,
        hero_slider: cleanSlugs(rawPl.hero_slider),
        sale: cleanSlugs(rawPl.sale),
        rent: cleanSlugs(rawPl.rent),
        featured: cleanSlugs(rawPl.featured),
        suggested: cleanSlugs(rawPl.suggested),
        location_placements: Object.fromEntries(
          Object.entries(rawPl.location_placements || {}).map(([k, v]) => [k, cleanSlugs(v)])
        ),
      }
    : undefined;
  return {
    ...parsed,
    locations: nextLocations,
    placements: nextPlacements,
  };
}

export async function fetchLocalSandboxWebManager(
  clean?: CleanPreviewFlags
): Promise<LocalWebManagerPayload | null> {
  if (!isLocalSandboxEnabled()) return null;
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (catalogFile) {
    const wmFile = path.join(path.dirname(catalogFile), "web_manager_live.json");
    try {
      if (fs.existsSync(wmFile)) {
        const parsed = JSON.parse(fs.readFileSync(wmFile, "utf-8")) as LocalWebManagerPayload;
        return applyCleanWebManagerFilter(parsed, clean);
      }
    } catch (err) {
      console.error("Local web manager read error:", err);
    }
  }
  const bundle = await fetchRemotePublicBundleCached();
  if (bundle?.web_manager) {
    return applyCleanWebManagerFilter(bundle.web_manager, clean);
  }
  return null;
}

export function appendSandboxFlyAndBuyLead(
  entry: Record<string, any>,
  buildEmailOverrides?: (referenceCode: string) => {
    admin_subject?: string;
    client_subject?: string;
    admin_email?: RenderedEmailPayload;
    client_email?: RenderedEmailPayload | null;
    questionnaire_es?: Array<{ label: string; value: string }>;
  }
): { id: string; reference_code: string; count: number } | null {
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
  const existingFb = existing.filter((e) => e && e.form_type === "fly_and_buy");
  let maxSeq = existingFb.length;
  for (const item of existingFb) {
    const m = /^FB-LOC-(\d+)$/i.exec(String(item.reference_code || ""));
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > maxSeq) maxSeq = n;
    }
  }
  const reference_code = `FB-LOC-${String(maxSeq + 1).padStart(3, "0")}`;
  const id = `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const overrides = buildEmailOverrides ? buildEmailOverrides(reference_code) : {};
  const record = {
    id,
    reference_code,
    received_at_iso: new Date().toISOString(),
    delivery_mode: "LOCAL_TEST_INBOX_INTERCEPTED",
    email_status: "intercepted_local",
    real_email_sent: false,
    ...entry,
    ...overrides,
  };
  const next = [record, ...existing].slice(0, 150);
  const tmpFile = `${inboxFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(next, null, 2), "utf-8");
  fs.renameSync(tmpFile, inboxFile);
  return { id, reference_code, count: next.length };
}

export function linkSandboxFlyAndBuyCrmInquiry(
  fbId: string,
  crmInquiryId: number | null,
  crmInquiryCode: string | null,
  fullFormattedMessage?: string
): boolean {
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (!catalogFile || !fbId) return false;
  const inboxFile = path.join(path.dirname(catalogFile), "test_inbox.json");
  try {
    if (!fs.existsSync(inboxFile)) return false;
    const parsed = JSON.parse(fs.readFileSync(inboxFile, "utf-8"));
    if (!Array.isArray(parsed)) return false;
    let updated = false;
    for (const item of parsed) {
      if (item && item.id === fbId) {
        item.crm_inquiry_id = crmInquiryId;
        item.crm_inquiry_code = crmInquiryCode;
        if (fullFormattedMessage && item.lead && typeof item.lead === "object") {
          item.lead.full_questionnaire_text = fullFormattedMessage;
        }
        updated = true;
        break;
      }
    }
    if (!updated) return false;
    const tmpFile = `${inboxFile}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(parsed, null, 2), "utf-8");
    fs.renameSync(tmpFile, inboxFile);
    return true;
  } catch {
    return false;
  }
}

export function recordLocalServerOutboundEvent(event: {
  flow: string;
  provider: "local_crm_v2" | "hubspot" | "resend" | "external";
  target_url: string;
  method?: string;
  blocked?: boolean;
  simulated?: boolean;
  status_code?: number;
  reference_code?: string;
  crm_inquiry_code?: string;
  reason?: string;
}): void {
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (!catalogFile) return;
  try {
    const outboxDir = path.resolve(path.dirname(catalogFile), "..", "outbox-simulated");
    fs.mkdirSync(outboxDir, { recursive: true });
    const auditFile = path.join(outboxDir, "server_outbound_audit.json");
    let existing: Record<string, any>[] = [];
    if (fs.existsSync(auditFile)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(auditFile, "utf-8"));
        if (Array.isArray(parsed)) existing = parsed;
      } catch {
        existing = [];
      }
    }
    const entry = {
      id: `out-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      recorded_at_iso: new Date().toISOString(),
      method: event.method || "POST",
      blocked: Boolean(event.blocked),
      simulated: Boolean(event.simulated),
      ...event,
    };
    const next = [entry, ...existing].slice(0, 300);
    const tmpFile = `${auditFile}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(next, null, 2), "utf-8");
    fs.renameSync(tmpFile, auditFile);
  } catch {
    // Non-blocking audit logger
  }
}

function applyCleanPhase8Filter(parsed: Record<string, any>, clean?: CleanPreviewFlags): Record<string, any> {
  if (!clean?.enabled) return parsed;
  const rawPartners = Array.isArray(parsed?.partners?.items) ? parsed.partners.items : [];
  const cleanPartners = rawPartners.filter((pt: any) => {
    if (!pt) return false;
    const name = String(pt.name || "").toLowerCase();
    const url = String(pt.website_url || "").toLowerCase();
    if (name.includes("caribe legal") || url.includes(".example.invalid") || url.includes(".example.test")) {
      return false;
    }
    return true;
  });
  return {
    ...parsed,
    partners: {
      ...(parsed.partners || {}),
      items: cleanPartners,
    },
    advisors: [],
    fly_and_buy_leads: [],
  };
}

export async function fetchLocalSandboxPhase8(
  clean?: CleanPreviewFlags
): Promise<Record<string, any> | null> {
  if (!isLocalSandboxEnabled()) return null;
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (catalogFile) {
    const p8File = path.join(path.dirname(catalogFile), "phase8_site_live.json");
    try {
      if (fs.existsSync(p8File)) {
        const parsed = JSON.parse(fs.readFileSync(p8File, "utf-8"));
        return applyCleanPhase8Filter(parsed, clean);
      }
    } catch (err) {
      console.error("Local phase8 read error:", err);
    }
  }
  const bundle = await fetchRemotePublicBundleCached();
  if (bundle?.phase8) {
    return applyCleanPhase8Filter(bundle.phase8, clean);
  }
  return null;
}

export function resolvePhase8MediaUrl(url: any, fallback = "/images/og-home-luxury.webp"): string {
  return resolveBackendMediaUrl(url, fallback);
}

function applyCleanPhase7Filter(parsed: Record<string, any>, clean?: CleanPreviewFlags): Record<string, any> {
  if (!clean?.enabled) return parsed;
  return {
    ...parsed,
    founder_leads: [],
    off_market_applications: [],
    off_market: {
      ...(parsed.off_market || {}),
      show_public_teasers: false,
    },
    due_diligence: {
      ...(parsed.due_diligence || {}),
      submissions: [],
    },
  };
}

export async function fetchLocalSandboxPhase7(
  clean?: CleanPreviewFlags
): Promise<Record<string, any> | null> {
  if (!isLocalSandboxEnabled()) return null;
  const catalogFile = process.env.LOCAL_PROPERTIES_SANDBOX_FILE;
  if (catalogFile) {
    const p7File = path.join(path.dirname(catalogFile), "phase7_investments_live.json");
    try {
      if (fs.existsSync(p7File)) {
        const parsed = JSON.parse(fs.readFileSync(p7File, "utf-8"));
        return applyCleanPhase7Filter(parsed, clean);
      }
    } catch (err) {
      console.error("Local phase7 read error:", err);
    }
  }
  const bundle = await fetchRemotePublicBundleCached();
  if (bundle?.phase7) {
    return applyCleanPhase7Filter(bundle.phase7, clean);
  }
  return null;
}

export function resolvePhase7MediaUrl(url: any, fallback = "/images/og-home-luxury.webp"): string {
  return resolveBackendMediaUrl(url, fallback);
}

export function mapWebManagerLocations(
  rawLocations: LocalWebManagerLocation[] = [],
  lang: "es" | "en" | "fr" = "es",
  flagKey: "show_in_homepage" | "show_in_locations_page" | "show_in_property_filters" = "show_in_homepage"
) {
  return [...rawLocations]
    .filter((loc) => loc && loc[flagKey] !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((loc) => {
      const rawImg = loc.img || "/images/locations/punta_cana.jpg";
      const resolvedImg = resolveBackendMediaUrl(rawImg, "/images/locations/punta_cana.jpg");
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
