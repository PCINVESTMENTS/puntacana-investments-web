"use client";

import { FaArrowRight } from "react-icons/fa";
import { ScrollReveal } from "../ui/ScrollReveal";
import Link from "next/link";
import Image from "next/image";
import { investmentModels, InvestmentModel } from "@/data/investment-models";

interface InvestmentsSectionProps {
    dict: {
        title: string;
        subtitle: string;
        description: string;
        exploreModel: string;
        features: readonly {
            title: string;
            description: string;
        }[];
    };
    lang: string;
}

export default function InvestmentsSection({ dict, lang }: InvestmentsSectionProps) {
    // Select the top 3 models to display
    const featuredSlugs = ['pre-construction', 'vacation-villas', 'rent-pool'];
    const displayedModels = investmentModels.filter(m => featuredSlugs.includes(m.slug));

    return (
        <section id="investments" className="py-8 md:py-16 bg-primary-black relative overflow-hidden text-white">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8),rgba(0,0,0,0.95))] opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-8 md:mb-16">
                    <ScrollReveal width="100%">
                        <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">
                            {dict.subtitle}
                        </span>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mt-3 mb-6 font-serif whitespace-nowrap sm:whitespace-normal tracking-tighter sm:tracking-normal">
                            {dict.title}
                        </h2>
                        <div className="h-1 w-24 bg-luxury-gold mx-auto mb-8"></div>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                            {dict.description}
                        </p>
                    </ScrollReveal>
                </div>

                {/* Investment Models Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayedModels.map((model, index) => (
                        <ScrollReveal key={model.slug} delay={index * 0.1}>
                            <Link href={`/${lang}/investments/${model.slug}`} className="group block h-full">
                                <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden h-full hover:border-luxury-gold/50 transition-all duration-300 flex flex-col group-hover:-translate-y-2 group-hover:shadow-2xl">
                                    {/* Image Area */}
                                    <div className="relative h-56 overflow-hidden">
                                        <Image
                                            src={model.heroImage}
                                            alt={model.title[lang as 'es' | 'en']}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>

                                        {/* Badge */}
                                        <div className="absolute top-4 right-4 bg-luxury-gold text-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                                            ROI: {model.roiStats?.[0]?.value || "High"}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-[1.1rem] sm:text-xl md:text-2xl font-serif font-bold text-white mb-4 whitespace-nowrap sm:whitespace-normal tracking-tighter sm:tracking-normal group-hover:text-luxury-gold transition-colors">
                                            {model.title[lang as 'es' | 'en']}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                            {model.description[lang as 'es' | 'en']}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between text-luxury-gold text-sm font-bold uppercase tracking-wider">
                                            <span>{dict.exploreModel}</span>
                                            <FaArrowRight aria-hidden="true" className="transform group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-10 md:mt-16 text-center">
                    <Link
                        href={`/${lang}/investments`}
                        className="inline-block bg-luxury-gold text-black hover:bg-white px-8 py-3 rounded-sm uppercase tracking-widest text-sm font-bold transition-all shadow-lg hover:shadow-xl"
                    >
                        {lang === 'en' ? 'View All Opportunities' : 'Ver Todas las Oportunidades'}
                    </Link>
                </div>
            </div>
        </section>
    );
}
