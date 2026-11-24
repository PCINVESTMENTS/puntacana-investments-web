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
