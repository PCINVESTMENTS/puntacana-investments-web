"use client";

import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { ScrollReveal } from "../ui/ScrollReveal";
import Image from "next/image";

interface TestimonialsSectionProps {
    dict: {
        title: string;
        subtitle: string;
        reviews: readonly {
            id: number | string;
            name: string;
            role: string;
            content: string;
            avatar?: string;
            rating?: number;
        }[];
    };
}

export default function TestimonialsSection({ dict }: TestimonialsSectionProps) {
    const images = [
        "/images/avatar-carlos.png",
        "/images/avatar-sarah.png",
        "/images/avatar-miguel.png"
    ];

    return (
        <section id="testimonials" className="pt-12 pb-8 bg-primary-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute right-0 top-0 w-96 h-96 bg-luxury-gold/20 rounded-full blur-3xl"></div>
                <div className="absolute left-0 bottom-0 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal width="100%">
                    <div className="text-center mb-16">
                        <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">
                            {dict.title}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6 font-serif" data-testimonials-subtitle="true">
                            {dict.subtitle}
                        </h2>
                        <div className="h-1 w-24 bg-luxury-gold mx-auto"></div>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {dict.reviews.map((testim, index) => {
                        const avatarUrl = testim.avatar || images[index % images.length];
                        const stars = Math.max(1, Math.min(5, Number(testim.rating || 5)));
                        return (
                        <ScrollReveal key={testim.id} delay={index * 0.1}>
                            <div className="bg-primary-black p-8 border border-white/5 relative group hover:border-luxury-gold/30 transition-colors h-full">
                                <FaQuoteLeft aria-hidden="true" className="text-4xl text-luxury-gold/20 mb-6 group-hover:text-luxury-gold/40 transition-colors" />

                                <div className="flex gap-1 mb-6">
                                    {[...Array(stars)].map((_, i) => (
                                        <FaStar key={i} aria-hidden="true" className="text-luxury-gold text-sm" />
                                    ))}
                                </div>

                                <p className="text-gray-300 mb-8 italic leading-relaxed text-sm">
                                    &quot;{testim.content}&quot;
                                </p>

                                <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-6">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-luxury-gold/50">
                                        <Image
                                            src={avatarUrl}
                                            alt={testim.name}
                                            fill
                                            unoptimized={avatarUrl.startsWith("http://127.0.0.1")}
                                            sizes="96px"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm tracking-wide">{testim.name}</h3>
                                        <p className="text-xs text-luxury-gold uppercase tracking-wider">{testim.role}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    )})}
                </div>
            </div>
        </section>
    );
}
