"use client";

import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { ScrollReveal } from "../ui/ScrollReveal";
import Image from "next/image";

interface TestimonialsSectionProps {
    dict: {
        title: string;
        subtitle: string;
        reviews: readonly {
            id: number;
            name: string;
            role: string;
            content: string;
        }[];
    };
}

export default function TestimonialsSection({ dict }: TestimonialsSectionProps) {
    const images = [
        "https://via.placeholder.com/150/1c1c1c/E4CA7C?text=CR",
        "https://via.placeholder.com/150/1c1c1c/E4CA7C?text=SJ",
        "https://via.placeholder.com/150/1c1c1c/E4CA7C?text=MT"
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
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6 font-serif">
                            {dict.subtitle}
                        </h2>
                        <div className="h-1 w-24 bg-luxury-gold mx-auto"></div>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {dict.reviews.map((testim, index) => (
                        <ScrollReveal key={testim.id} delay={index * 0.1}>
                            <div className="bg-primary-black p-8 border border-white/5 relative group hover:border-luxury-gold/30 transition-colors h-full">
                                <FaQuoteLeft aria-hidden="true" className="text-4xl text-luxury-gold/20 mb-6 group-hover:text-luxury-gold/40 transition-colors" />

                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} aria-hidden="true" className="text-luxury-gold text-sm" />
                                    ))}
                                </div>

                                <p className="text-gray-300 mb-8 italic leading-relaxed text-sm">
                                    &quot;{testim.content}&quot;
                                </p>

                                <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-6">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-luxury-gold/50">
                                        <Image
                                            src={images[index % images.length]}
                                            alt={testim.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm tracking-wide">{testim.name}</h4>
                                        <p className="text-xs text-luxury-gold uppercase tracking-wider">{testim.role}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
