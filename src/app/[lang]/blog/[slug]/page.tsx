import { getDictionary } from "@/dictionaries/get-dictionary";
import { BlogPost, blogPosts } from "@/data/blog";
import {
    fetchLocalSandboxBlogPostBySlug,
    fetchLocalSandboxCatalog,
    isLocalSandboxEnabled,
} from "@/lib/localSandbox";
import { Property, properties as staticProperties } from "@/data/properties";
import { notFound } from "next/navigation";
import BlogArticleView from "@/components/blog/BlogArticleView";

// Sanity
import { client } from "@/sanity/lib/client";
import { POSTS_QUERY, POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { mapSanityPost } from "@/sanity/lib/mappers";

interface BlogPostPageProps {
    params: Promise<{
        lang: 'es' | 'en' | 'fr';
        slug: string;
    }>;
}

export const dynamic = "force-dynamic";

const getVal = (obj: any, key: 'es' | 'en' | 'fr'): string => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[key] || obj['en'] || obj['es'] || "";
};

function transformLegacyPost(localPost: BlogPost): BlogPost {
    const transformContent = (l: 'es' | 'en' | 'fr') => {
        if (Array.isArray(localPost.content)) {
            return localPost.content.flatMap((section: any) => {
                const blocks: any[] = [];
                const targetLang = section.text?.[l] ? l : (l === 'fr' ? 'en' : l);
                const textVal = section.text?.[targetLang] || (typeof section.text === 'string' ? section.text : '');
                if (textVal) {
                    blocks.push({ _type: 'markdownText', text: textVal });
                }
                const subtitleVal = section.subtitle?.[targetLang];
                if (subtitleVal) {
                    blocks.unshift({
                        _type: 'block',
                        style: 'h2',
                        children: [{ _type: 'span', text: subtitleVal }]
                    });
                }
                if (section.image) {
                    blocks.push({
                        _type: 'legacyImage',
                        url: section.image,
                        caption: section.imageCaption?.[targetLang]
                    });
                }
                return blocks;
            });
        }
        const contentObj = localPost.content as any;
        return contentObj?.[l] || contentObj?.en || contentObj?.es || [];
    };

    return {
        ...localPost,
        content: {
            es: transformContent('es'),
            en: transformContent('en'),
            fr: transformContent('fr'),
        },
    };
}

async function resolveBlogPost(slug: string): Promise<BlogPost | null> {
    if (isLocalSandboxEnabled()) {
        // Primary source in local sandbox: Fase 6 Blog Manager (recovers guia-invertir-seguro-punta-cana-evitar-estafas & serves live published posts)
        const sandboxPost = await fetchLocalSandboxBlogPostBySlug(slug);
        if (sandboxPost) return sandboxPost;

        const localFallback = blogPosts.find((p) => p.slug === slug);
        return localFallback ? transformLegacyPost(localFallback) : null;
    }

    const FORCE_LOCAL_SLUGS = ['tendencias-diseno-tropical'];
    const shouldForceLocal = FORCE_LOCAL_SLUGS.includes(slug);
    const rawPost = await client.fetch(POST_BY_SLUG_QUERY, { slug });
    if (rawPost && !shouldForceLocal) {
        return mapSanityPost(rawPost);
    }
    const localPost = blogPosts.find((p) => p.slug === slug);
    return localPost ? transformLegacyPost(localPost) : null;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
    const { lang, slug } = await params;
    const post = await resolveBlogPost(slug);

    if (!post) return { title: 'Post not found' };

    const siteUrl = 'https://www.puntacanainvestmentsrd.com';
    const canonicalUrl = `${siteUrl}/${lang}/blog/${post.slug}`;
    const seoTitle = getVal(post.seo?.title, lang) || getVal(post.title, lang);
    const seoDesc = getVal(post.seo?.description, lang) || getVal(post.excerpt, lang);
    const coverAlt = getVal(post.coverImageAlt, lang) || getVal(post.title, lang);
    const rawKw = getVal(post.seo?.keywords, lang) || getVal(post.seoKeywords, lang);
    const keywordsList = rawKw
        ? rawKw.split(',').map((k: string) => k.trim()).filter(Boolean)
        : [];

    return {
        title: seoTitle,
        description: seoDesc,
        openGraph: {
            title: `${seoTitle} | Punta Cana Investments`,
            description: seoDesc,
            url: canonicalUrl,
            locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_DO' : 'en_US',
            siteName: 'Punta Cana Investments',
            images: [
                {
                    url: post.mainImage || `${siteUrl}/images/og-home-luxury.webp`,
                    width: 1200,
                    height: 630,
                    alt: coverAlt,
                }
            ],
            type: 'article',
        },
        keywords: keywordsList,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'es': `${siteUrl}/es/blog/${post.slug}`,
                'en': `${siteUrl}/en/blog/${post.slug}`,
                'fr': `${siteUrl}/fr/blog/${post.slug}`,
                'x-default': `${siteUrl}/en/blog/${post.slug}`,
            },
        },
    };
}

export async function generateStaticParams() {
    if (isLocalSandboxEnabled()) {
        return blogPosts.map((post) => ({ slug: post.slug }));
    }
    const posts = await client.fetch(POSTS_QUERY);
    return posts
        .filter((post: any) => post && post.slug && post.slug.current)
        .map((post: any) => ({
            slug: post.slug.current,
        }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang);
    const post = await resolveBlogPost(slug);

    if (!post) {
        notFound();
    }

    // Resolve related properties from live local sandbox catalog (with static fallback)
    let relatedPropertiesList: Property[] = [];
    if (isLocalSandboxEnabled()) {
        const sb = await fetchLocalSandboxCatalog();
        const catalogProps = (sb?.properties || []) as unknown as Property[];
        const slugsWanted = post.relatedPropertySlugs || [];
        if (slugsWanted.length > 0) {
            relatedPropertiesList = slugsWanted
                .map((s) =>
                    catalogProps.find((p) => {
                        const ps = typeof p.slug === "object" && p.slug !== null ? (p.slug as any).current : p.slug;
                        return ps === s;
                    })
                )
                .filter((p): p is Property => Boolean(p));
        } else if (post.relatedProperties && post.relatedProperties.length > 0) {
            relatedPropertiesList = catalogProps.filter((p) => post.relatedProperties?.includes(p.id));
        }
    } else if (post.relatedProperties && post.relatedProperties.length > 0) {
        relatedPropertiesList = staticProperties.filter((p) => post.relatedProperties?.includes(p.id));
    }

    return (
        <BlogArticleView
            post={post}
            lang={lang}
            dict={dict}
            relatedPropertiesList={relatedPropertiesList}
            isPreviewMode={false}
        />
    );
}
