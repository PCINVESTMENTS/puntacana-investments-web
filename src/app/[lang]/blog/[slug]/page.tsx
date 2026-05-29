import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogPost, blogPosts } from "@/data/blog";
import { properties } from "@/data/properties";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag } from "react-icons/fa";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import ShareButtons from "@/components/property/ShareButtons";

// Sanity
import { client } from "@/sanity/lib/client";
import { POSTS_QUERY, POST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { mapSanityPost } from "@/sanity/lib/mappers";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

interface BlogPostPageProps {
    params: Promise<{
        lang: 'es' | 'en' | 'fr';
        slug: string;
    }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
    const { lang, slug } = await params;
    let post: any = null;

    const rawPost = await client.fetch(POST_BY_SLUG_QUERY, { slug });
    const FORCE_LOCAL_SLUGS = ['tendencias-diseno-tropical', 'guia-invertir-seguro-punta-cana-evitar-estafas'];
    const shouldForceLocal = FORCE_LOCAL_SLUGS.includes(slug);

    if (rawPost && !shouldForceLocal) {
        post = mapSanityPost(rawPost);
    } else {
        post = blogPosts.find(p => p.slug === slug);
    }

    if (!post) return { title: 'Post not found' };

    const siteUrl = 'https://www.puntacanainvestmentsrd.com';
    const canonicalUrl = `${siteUrl}/${lang}/blog/${post.slug}`;

    const getVal = (obj: any, key: 'es' | 'en' | 'fr') => {
        if (!obj) return "";
        return obj[key] || obj['en'] || obj['es'] || "";
    };

    return {
        title: `${getVal(post.title, lang)} | Punta Cana Investments`,
        description: typeof post.excerpt === 'string' ? post.excerpt : getVal(post.excerpt, lang),
        openGraph: {
            title: `${getVal(post.title, lang)} | Punta Cana Investments`,
            description: typeof post.excerpt === 'string' ? post.excerpt : getVal(post.excerpt, lang),
            url: canonicalUrl,
            images: [
                {
                    url: post.mainImage,
                    width: 1200,
                    height: 630,
                    alt: getVal(post.title, lang),
                }
            ],
            type: 'article',
        },
        keywords: post.slug === 'guia-invertir-seguro-punta-cana-evitar-estafas' 
            ? (lang === 'es' 
                ? ['invertir en Punta Cana 2026', 'bienes raíces Punta Cana', 'evitar estafas inmobiliarias República Dominicana', 'cómo invertir seguro en Punta Cana', 'Ley de CONFOTUR beneficios', 'fideicomiso inmobiliario República Dominicana', 'diseño de lujo sostenible Punta Cana', 'minimalismo orgánico propiedades Caribe']
                : lang === 'fr'
                ? ['investir à Punta Cana 2026', 'immobilier de luxe Punta Cana', 'éviter les arnaques immobilières République Dominicaine', 'comment investir en toute sécurité à Punta Cana', 'avantages de la loi CONFOTUR pour les investisseurs étrangers', 'fiducie immobilière République Dominicaine', 'design de luxe durable Punta Cana', 'minimalisme organique propriétés Caraïbes']
                : ['invest in Punta Cana 2026', 'Punta Cana real estate for sale', 'avoid real estate scams Dominican Republic', 'how to invest safely in Punta Cana', 'CONFOTUR Law benefits foreign investors', 'Dominican Republic real estate trust fund', 'sustainable luxury design Punta Cana', 'organic minimalism Caribbean properties'])
            : [],
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'es': `${siteUrl}/es/blog/${post.slug}`,
                'en': `${siteUrl}/en/blog/${post.slug}`,
                'fr': `${siteUrl}/fr/blog/${post.slug}`,
            },
        },
    };
}

// Restoring ISR
export const revalidate = 60;

export async function generateStaticParams() {
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

    let post: any = null; // Use any to allow mixed structure map

    const rawPost = await client.fetch(POST_BY_SLUG_QUERY, { slug });

    // FIX: Force local override for specific posts with issues or manual updates that are not in Sanity yet
    const FORCE_LOCAL_SLUGS = ['tendencias-diseno-tropical', 'guia-invertir-seguro-punta-cana-evitar-estafas'];
    const shouldForceLocal = FORCE_LOCAL_SLUGS.includes(slug);

    const getVal = (obj: any, key: 'es' | 'en' | 'fr') => {
        if (!obj) return "";
        return obj[key] || obj['en'] || obj['es'] || "";
    };

    if (rawPost && !shouldForceLocal) {
        post = mapSanityPost(rawPost);
    } else {
        // Fallback to local data
        const localPost = blogPosts.find(p => p.slug === slug);
        if (localPost) {
            // Transform local content to simulate PortableText structure
            const transformContent = (l: 'es' | 'en' | 'fr') => {
                const targetLang = (l === 'fr' && !localPost.content[l]) ? 'en' : l;
                if (Array.isArray(localPost.content)) {
                    return localPost.content.flatMap((section: any) => {
                        const blocks = [];

                        // Add text block
                        const textVal = section.text?.[targetLang] || (typeof section.text === 'string' ? section.text : '');
                        if (textVal) {
                            blocks.push({
                                _type: 'markdownText',
                                text: textVal
                            });
                        }

                        // Add subtitle as h2 if exists
                        const subtitleVal = section.subtitle?.[targetLang];
                        if (subtitleVal) {
                            blocks.unshift({
                                _type: 'block',
                                style: 'h2',
                                children: [{ _type: 'span', text: subtitleVal }]
                            });
                        }

                        // Add image block (legacyImage type defined in ptComponents)
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
                return contentObj[targetLang] || contentObj['en'] || contentObj['es'] || [];
            };

            post = {
                ...localPost,
                content: {
                    es: transformContent('es'),
                    en: transformContent('en'),
                    fr: transformContent('fr')
                }
            };
        }
    }

    if (!post) {
        notFound();
    }

    // Portable Text Components Definition
    const ptComponents: PortableTextComponents = {
        types: {
            markdownText: ({ value }: any) => {
                const ReactMarkdown = require('react-markdown').default || require('react-markdown');
                return (
                    <div className="text-gray-300 leading-8 text-lg text-justify mb-6 space-y-4">
                        <ReactMarkdown
                            components={{
                                strong: ({node, ...props}: any) => <strong className="text-luxury-gold font-bold" {...props} />,
                                a: ({node, ...props}: any) => <a className="text-luxury-gold underline hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                ul: ({node, ...props}: any) => <ul className="list-disc pl-6 space-y-2" {...props} />,
                                li: ({node, ...props}: any) => <li {...props} />
                            }}
                        >
                            {value.text}
                        </ReactMarkdown>
                    </div>
                );
            },
            image: ({ value }: any) => {
                if (!value?.asset?._ref) {
                    return null;
                }
                return (
                    <figure className="my-12">
                        <div className="relative aspect-video w-full overflow-hidden rounded-sm shadow-2xl border border-white/10 group">
                            <Image
                                src={urlFor(value).url()}
                                alt={value.alt || 'Blog Image'}
                                fill
                                sizes="(max-width: 768px) 100vw, 800px"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </figure>
                );
            },
            legacyImage: ({ value }: any) => {
                if (!value?.url) return null;
                return (
                    <figure className="my-12">
                        <div className="relative aspect-video w-full overflow-hidden rounded-sm shadow-2xl border border-white/10 group">
                            <Image
                                src={value.url}
                                alt={value.caption || getVal(post.title, lang)}
                                fill
                                sizes="(max-width: 768px) 100vw, 800px"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {value.caption && (
                            <figcaption className="mt-4 text-center text-sm text-gray-400 italic">
                                {value.caption}
                            </figcaption>
                        )}
                    </figure>
                );
            }
        },
        block: {
            h1: ({ children }) => <h1 className="text-4xl font-serif font-bold text-luxury-gold pt-8 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-3xl font-serif font-bold text-luxury-gold pt-8 mb-4">{children}</h2>,
            h3: ({ children }) => <h3 className="text-2xl font-serif font-bold text-luxury-gold pt-6 mb-3">{children}</h3>,
            normal: ({ children }) => <p className="text-gray-300 leading-8 text-lg text-justify whitespace-pre-line mb-6">{children}</p>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-luxury-gold pl-4 italic text-gray-400 my-6">{children}</blockquote>,
        },
        list: {
            bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">{children}</ul>,
            number: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-gray-300 space-y-2">{children}</ol>,
        },
    };

    // Cast content to any to avoid strict type issues with mapped interface
    const content = (post.content as any)[lang] || (post.content as any)['en'] || (post.content as any)['es'] || [];

    return (
        <main className="min-h-screen bg-black text-white selection:bg-luxury-gold selection:text-black">
            <Navbar dict={dict.nav} lang={lang} servicesList={dict.sections.services.items} propertyTypes={dict.properties.types} />

            {/* Hero Section with Main Image */}
            <div className="relative h-[60vh] w-full mt-20">
                <Image
                    src={post.mainImage}
                    alt={getVal(post.title, lang)}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <ScrollReveal>
                            <div className="inline-flex items-center gap-2 bg-luxury-gold/90 text-black px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest mb-6">
                                <FaTag size={10} />
                                {getVal(post.category, lang)}
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2} direction="up">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                                {getVal(post.title, lang)}
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal delay={0.3} direction="up">
                            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300 text-sm font-medium tracking-wide">
                                <span className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-luxury-gold" />
                                    {getVal(post.date, lang)}
                                </span>
                                <span className="flex items-center gap-2">
                                    <FaUser className="text-luxury-gold" />
                                    {post.author}
                                </span>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">

                {/* Back Link */}
                <Link
                    href={`/${lang}/blog`}
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-luxury-gold transition-colors mb-12 uppercase text-xs font-bold tracking-widest group"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    {dict.blog.back}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content */}
                    <article className="lg:col-span-8">
                        {/* Excerpt */}
                        <div className="text-xl md:text-2xl text-white font-serif italic mb-12 leading-relaxed opacity-90 border-l-4 border-luxury-gold pl-6">
                            "{getVal(post.excerpt, lang)}"
                        </div>

                        <div className="blog-content">
                            <PortableText value={content} components={ptComponents} />
                        </div>

                        {/* Social Share */}
                        <div className="mt-20 pt-10 border-t border-white/10">
                            <h3 className="text-white text-lg font-bold mb-6">
                                {dict.blog.share}
                            </h3>
                            <ShareButtons
                                title={getVal(post.title, lang)}
                                url={`https://www.puntacanainvestmentsrd.com/${lang}/blog/${post.slug}`}
                            />
                        </div>

                        {/* Related Properties (kept logical but currently using static property list, ideally should fetch these too but out of scope for strict blog refactor, assume property list is still static or hybrid) */}
                        {/* Actually, properties are fetched in Home, not here. We need to import properties or fetch them. 
                           The previous code imported 'properties' from '@data/properties'. 
                           We should stick to that for now for related properties to avoid over-fetching or refactoring EVERYTHING.
                           However, Property IDs might change if migrated. But for now IDs are 1, 2, 3... which match.
                        */}
                        {post.relatedProperties && post.relatedProperties.length > 0 && (
                            <div className="mt-24">
                                <h3 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
                                    {dict.blog.related}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {properties
                                        .filter(p => post.relatedProperties?.includes(p.id))
                                        .map((property) => (
                                            <Link
                                                key={property.id}
                                                href={`/${lang}/properties/${property.slug}`}
                                                className="group bg-dark-gray border border-white/5 rounded-sm overflow-hidden hover:border-luxury-gold/30 transition-all duration-300 block"
                                            >
                                                <div className="relative h-64 overflow-hidden">
                                                    <Image
                                                        src={property.image}
                                                        alt={property.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 text-xs font-bold uppercase tracking-wider border border-white/10">
                                                        {property.locationLabel}
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/60 to-transparent p-6 pt-12">
                                                        <p className="text-luxury-gold text-lg font-bold">
                                                            ${property.price.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <h4 className="text-xl text-white font-serif font-bold mb-2 group-hover:text-luxury-gold transition-colors">
                                                        {property.title}
                                                    </h4>
                                                    <div className="flex gap-4 text-gray-400 text-xs uppercase tracking-wider font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <span className="text-luxury-gold">•</span> {property.beds} Beds
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="text-luxury-gold">•</span> {property.baths} Baths
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="text-luxury-gold">•</span> {property.area} m²
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </article>

                    {/* Sidebar / Author */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* Author Card */}
                        <div className="bg-dark-gray p-8 border border-white/5 rounded-sm sticky top-32">
                            <div className="text-center">
                                <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-luxury-gold p-1">
                                    <div className="relative w-full h-full rounded-full overflow-hidden">
                                        <Image
                                            src={post.authorImage}
                                            alt={post.author}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <h4 className="text-white font-serif font-bold text-xl mb-1">{post.author}</h4>
                                <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-6">{getVal(post.authorRole, lang)}</p>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    {getVal(post.authorBio, lang)}
                                </p>
                                <Link
                                    href={`/${lang}#contact`}
                                    className="block w-full text-center bg-white/5 hover:bg-luxury-gold hover:text-black py-3 px-4 text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    {dict.blog.contactAuthor}
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
