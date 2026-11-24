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

export function mapSandboxBlogPosts(rawPosts: any[] = []): BlogPost[] {
  return rawPosts.map((p: any) => ({
    slug: p.slug || "",
    title: {
      en: p.titleEn || p.title || "",
      es: p.titleEs || p.title || "",
      fr: p.titleEn || p.title || "",
    },
    date: {
      en: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "",
      es: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }) : "",
      fr: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }) : "",
    },
    category: {
      es: p.category?.es || "General",
      en: p.category?.en || "General",
      fr: p.category?.en || "Général",
    },
    mainImage: p.mainImageUrl || "",
    excerpt: {
      en: p.excerptEn || "",
      es: p.excerptEs || "",
      fr: p.excerptEn || "",
    },
    author: p.author || "Admin",
    authorRole: p.authorRole || { es: "Autor", en: "Author", fr: "Auteur" },
    authorBio: p.authorBio || { es: "", en: "", fr: "" },
    authorImage: p.authorImageUrl || "/images/logo-footer-v2.png",
    content: { es: "", en: "", fr: "" },
    seoKeywords: { es: "", en: "", fr: "" },
    relatedProperties: [],
  })) as unknown as BlogPost[];
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
    };
    locations_section: {
      title: { es: string; en: string; fr: string };
      subtitle: { es: string; en: string; fr: string };
      exploreMore: { es: string; en: string; fr: string };
      homepage_limit?: number;
    };
    sections_visibility: Record<string, boolean>;
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
