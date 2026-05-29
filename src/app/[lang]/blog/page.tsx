import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { mapSanityPost } from "@/sanity/lib/mappers";
import { BlogPost, blogPosts } from "@/data/blog";
import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaArrowRight, FaSearch } from "react-icons/fa";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface BlogListingPageProps {
    params: Promise<{
        lang: 'es' | 'en' | 'fr';
    }>;
}

// Restoring ISR
export const revalidate = 60;

export default async function BlogListingPage({ params }: BlogListingPageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const rawPosts = await client.fetch(POSTS_QUERY);
    const sanityPosts: BlogPost[] = rawPosts.map(mapSanityPost);
    
    // Merge local posts that are not in Sanity
    const localPosts = blogPosts.filter(localPost => !sanityPosts.some(p => p.slug === localPost.slug));
    const posts = [...sanityPosts, ...localPosts];

    const getVal = (obj: any, key: 'es' | 'en' | 'fr') => {
        if (!obj) return "";
        return obj[key] || obj['en'] || obj['es'] || "";
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar dict={dict.nav} lang={lang} servicesList={dict.sections.services.items} propertyTypes={dict.properties.types} />

            {/* Header */}
            <div className="pt-32 pb-16 bg-primary-black relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto">
                            <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold mb-4 block">
                                {dict.sections.blog.title}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6">
                                {dict.sections.blog.latestNews}
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {lang === 'en'
                                    ? 'Insights, guides, and news about the luxury real estate market in Punta Cana.'
                                    : lang === 'fr'
                                    ? 'Analyses, guides et actualités sur le marché immobilier de luxe à Punta Cana.'
                                    : 'Análisis, guías y noticias sobre el mercado inmobiliario de lujo en Punta Cana.'}
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Content */}
            <div className="pb-32 bg-primary-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.filter(post => post && post.slug && post.slug !== "undefined").map((post, index) => (
                            <ScrollReveal key={index} delay={index * 0.1}>
                                <article className="group bg-dark-gray border border-white/5 overflow-hidden hover:border-luxury-gold/30 transition-all duration-300 h-full flex flex-col">
                                    <Link href={`/${lang}/blog/${post.slug}`} className="block aspect-[4/3] overflow-hidden relative">
                                        <Image
                                            src={post.mainImage}
                                            alt={getVal(post.title, lang)}
                                            fill
                                            className="object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                        />
                                        <div className="absolute top-4 left-4 bg-luxury-gold text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                            {getVal(post.category, lang)}
                                        </div>
                                    </Link>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-4 uppercase tracking-wider font-semibold">
                                            <FaCalendarAlt /> {getVal(post.date, lang)}
                                        </div>
                                        <h3 className="text-xl text-white font-serif font-bold mb-4 group-hover:text-luxury-gold transition-colors leading-tight">
                                            <Link href={`/${lang}/blog/${post.slug}`}>
                                                {getVal(post.title, lang)}
                                            </Link>
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {getVal(post.excerpt, lang)}
                                        </p>
                                        <div className="mt-auto">
                                            <Link href={`/${lang}/blog/${post.slug}`} className="inline-flex items-center gap-2 text-luxury-gold uppercase text-xs font-bold tracking-widest hover:text-white transition-colors">
                                                {dict.sections.blog.readMore} <FaArrowRight className="text-[10px]" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
