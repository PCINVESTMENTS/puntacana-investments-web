import { getDictionary } from "@/dictionaries/get-dictionary";
import {
  fetchLocalSandboxBlogPreviewBySlug,
  fetchLocalSandboxCatalog,
  isLocalSandboxEnabled,
} from "@/lib/localSandbox";
import { Property } from "@/data/properties";
import { notFound } from "next/navigation";
import BlogArticleView from "@/components/blog/BlogArticleView";

export const dynamic = "force-dynamic";

interface BlogPreviewPageProps {
  params: Promise<{
    lang: "es" | "en" | "fr";
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPreviewPageProps) {
  const { lang, slug } = await params;
  const post = await fetchLocalSandboxBlogPreviewBySlug(slug);
  if (!post) return { title: "Vista Previa no encontrada", robots: { index: false, follow: false } };
  const title = post.title?.[lang] || post.title?.es || post.title?.en || slug;
  return {
    title: `[VISTA PREVIA] ${title} | Punta Cana Investments`,
    robots: { index: false, follow: false },
  };
}

export default async function BlogDraftPreviewPage({ params }: BlogPreviewPageProps) {
  const { lang, slug } = await params;
  if (!isLocalSandboxEnabled()) {
    notFound();
  }
  const dict = await getDictionary(lang);
  const post = await fetchLocalSandboxBlogPreviewBySlug(slug);
  if (!post) {
    notFound();
  }

  const sb = await fetchLocalSandboxCatalog();
  const catalogProps = (sb?.properties || []) as unknown as Property[];
  const slugsWanted = post.relatedPropertySlugs || [];
  const relatedPropertiesList = slugsWanted
    .map((s) =>
      catalogProps.find((p) => {
        const ps = typeof p.slug === "object" && p.slug !== null ? (p.slug as any).current : p.slug;
        return ps === s;
      })
    )
    .filter((p): p is Property => Boolean(p));

  return (
    <BlogArticleView
      post={post}
      lang={lang}
      dict={dict}
      relatedPropertiesList={relatedPropertiesList}
      isPreviewMode={true}
    />
  );
}
