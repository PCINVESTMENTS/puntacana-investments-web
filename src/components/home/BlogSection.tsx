"use client";

import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { BlogPost } from "@/data/blog";
import Link from "next/link";
import Image from "next/image";

interface BlogSectionProps {
    dict: {
        title: string;
        latestNews: string;
        viewAll: string;
        readMore: string;
    };
    lang: string;
    initialPosts: BlogPost[];
}

export default function BlogSection({ dict, lang, initialPosts }: BlogSectionProps) {
    const recentPosts = initialPosts.slice(0, 3);

    const l = lang as 'es' | 'en';

    return (
        <section id="blog" className="py-16 bg-primary-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div className="max-w-2xl">
                        <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">
                            {dict.title}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 font-serif">
                            {dict.latestNews}
                        </h2>
                    </div>
                    <Link href={`/${lang}/blog`} className="hidden md:flex items-center gap-2 text-white hover:text-luxury-gold transition-colors uppercase tracking-widest text-sm font-bold mt-6 md:mt-0">
                        {dict.viewAll} <FaArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recentPosts.map((post, index) => (
                        <article
                            key={index}
                            className="group bg-dark-gray border border-white/5 overflow-hidden hover:border-luxury-gold/30 transition-all duration-300"
                        >
                            <Link href={`/${lang}/blog/${post.slug}`} className="block h-64 overflow-hidden relative">
                                <Image
                                    src={post.mainImage}
                                    alt={post.title[l]}
                                    fill
                                    className="object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-luxury-gold text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                                    {post.category[l]}
                                </div>
                            </Link>
                            <div className="p-8">
                                <div className="flex items-center gap-2 text-gray-400 text-xs mb-4 uppercase tracking-wider font-semibold">
                                    <FaCalendarAlt /> {post.date[l]}
                                </div>
                                <h3 className="text-xl text-white font-serif font-bold mb-4 group-hover:text-luxury-gold transition-colors leading-tight">
                                    <Link href={`/${lang}/blog/${post.slug}`}>
                                        {post.title[l]}
                                    </Link>
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt[l]}
                                </p>
                                <Link href={`/${lang}/blog/${post.slug}`} className="inline-flex items-center gap-2 text-luxury-gold uppercase text-xs font-bold tracking-widest hover:text-white transition-colors">
                                    {dict.readMore} <FaArrowRight className="text-[10px]" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 text-white hover:text-luxury-gold transition-colors uppercase tracking-widest text-sm font-bold">
                        {dict.viewAll} <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}
