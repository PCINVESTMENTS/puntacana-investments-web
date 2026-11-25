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
  const next = [record, ...existing].slice(0, 100);
  const tmpFile = `${inboxFile}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(next, null, 2), "utf-8");
  fs.renameSync(tmpFile, inboxFile);
  return { id, count: next.length };
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
