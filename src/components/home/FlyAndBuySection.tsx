"use client";

import { FaArrowRight, FaPlane, FaCheck } from "react-icons/fa";
import { ScrollReveal } from "../ui/ScrollReveal";
import Link from "next/link";
import Image from "next/image";
import { flyAndBuyPrograms } from "@/data/fly-and-buy";

interface FlyAndBuySectionProps {
    dict: {
        title: string;
        subtitle: string;
        description: string;
        cta: string;
    };
    lang: string;
}

export default function FlyAndBuySection({ dict, lang }: FlyAndBuySectionProps) {
    return (
        <section id="fly-and-buy" className="py-20 bg-primary-black relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-luxury-gold/5 blur-3xl rounded-full translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <ScrollReveal width="100%">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <FaPlane aria-hidden="true" className="text-luxury-gold text-2xl" />
                            <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">
                                {dict.subtitle}
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-serif">
                            {dict.title}
                        </h2>
                        <div className="h-1 w-24 bg-luxury-gold mx-auto mb-8"></div>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                            {dict.description}
                        </p>
                    </ScrollReveal>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {flyAndBuyPrograms.map((program, index) => (
                        <ScrollReveal key={program.slug} delay={index * 0.2}>
                            <Link href={`/${lang}/fly-and-buy#${program.slug}`} className="group block h-full">
                                <div className="bg-primary-black border-2 border-luxury-gold/30 rounded-sm overflow-hidden h-full hover:border-luxury-gold transition-all duration-300 flex flex-col hover:shadow-2xl hover:-translate-y-2 relative">
                                    {/* Image Area */}
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={program.heroImage}
                                            alt={program.title[lang as 'es' | 'en']}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>

                                        {/* Duration Badge */}
                                        <div className="absolute bottom-4 left-4 bg-luxury-gold text-black text-xs font-bold px-3 py-1 uppercase tracking-widest shadow-lg">
                                            {program.duration[lang as 'es' | 'en']}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">
                                            {program.title[lang as 'es' | 'en']}
                                        </h3>
                                        <p className="text-luxury-gold text-sm font-semibold uppercase tracking-wider mb-4">
                                            {program.subtitle[lang as 'es' | 'en']}
                                        </p>

                                        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow border-b border-white/10 pb-6">
                                            {program.description[lang as 'es' | 'en']}
                                        </p>

                                        {/* Features Preview */}
                                        <ul className="space-y-3 mb-8">
                                            {program.includes.slice(0, 3).map((section, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                                                    <FaCheck aria-hidden="true" className="text-luxury-gold mt-1 flex-shrink-0 text-xs" />
                                                    <span>{section.title[lang as 'es' | 'en']}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-auto flex items-center justify-between text-white group-hover:text-luxury-gold transition-colors text-sm font-bold uppercase tracking-wider">
                                            <span>{dict.cta}</span>
                                            <FaArrowRight aria-hidden="true" className="transform group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
