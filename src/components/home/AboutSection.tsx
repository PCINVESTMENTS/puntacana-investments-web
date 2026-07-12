"use client";

import { FaGem, FaHandshake, FaChartLine, FaLinkedin } from "react-icons/fa";
import { ScrollReveal } from "../ui/ScrollReveal";
import Image from "next/image";

interface AboutSectionProps {
    dict: {
        title: string;
        mission: string;
        missionText: string;
        vision: string;
        visionText: string;
        values: string;
        essence: string;
        ceoRole: string;
        valuesList: readonly {
            title: string;
            description: string;
        }[];
    };
}

export function AboutSection({ dict }: AboutSectionProps) {
    return (
        <section id="about" className="pt-20 pb-20 bg-primary-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Left Column: Image (5 cols) */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative">
                            {/* Gold Border & offset frame */}
                            <div className="absolute top-4 -left-4 w-full h-full border-2 border-luxury-gold/30 z-0"></div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-luxury-gold/10 z-0 hidden md:block"></div>

                            {/* Image Container */}
                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-2xl">
                                <Image
                                    src="/images/ceo-final.jpg"
                                    alt="Ulises Ubiera - CEO Punta Cana Investments"
                                    fill
                                    quality={60}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />

                                {/* Name Overlay (Bottom) */}
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-8 pt-24 text-center">
                                    <h3 className="text-3xl font-serif font-bold text-white tracking-wide">Ulises Ubiera</h3>
                                    <p className="text-luxury-gold text-sm font-bold uppercase tracking-[0.2em] mt-2 mb-4">{dict.ceoRole}</p>
                                    <a
                                        href="https://www.linkedin.com/in/ulises-ubiera-b442b685"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-luxury-gold hover:text-black transition-all duration-300"
                                        aria-label="LinkedIn Profile"
                                    >
                                        <FaLinkedin aria-hidden="true" size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content (7 cols) */}
                    <div className="lg:col-span-7 space-y-16">

                        {/* Header & Intro */}
                        <ScrollReveal>
                            <div>
                                <span className="text-luxury-gold uppercase tracking-[0.2em] text-xs font-semibold mb-3 block">{dict.essence}</span>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">{dict.title}</h2>
                                <div className="h-1 w-20 bg-luxury-gold mb-8"></div>
                            </div>
                        </ScrollReveal>

                        {/* Mission & Vision - Side by Side Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ScrollReveal delay={0.2} direction="up">
                                <div className="p-6 bg-white/5 border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300 rounded-sm h-full">
                                    <h3 className="text-2xl font-serif font-bold text-white mb-4 flex items-center gap-3">
                                        <span className="text-luxury-gold">✦</span> {dict.mission}
                                    </h3>
                                    <p className="text-gray-300 text-sm leading-relaxed text-justify opacity-90">
                                        {dict.missionText}
                                    </p>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={0.3} direction="up">
                                <div className="p-6 bg-white/5 border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300 rounded-sm h-full">
                                    <h3 className="text-2xl font-serif font-bold text-white mb-4 flex items-center gap-3">
                                        <span className="text-luxury-gold">✦</span> {dict.vision}
                                    </h3>
                                    <p className="text-gray-300 text-sm leading-relaxed text-justify opacity-90">
                                        {dict.visionText}
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Values Section */}
                        <ScrollReveal delay={0.4}>
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4 inline-block">{dict.values}</h3>

                                <div className="grid grid-cols-1 gap-6">
                                    {(dict.valuesList || []).map((value, index) => {
                                        // Assign icons based on index
                                        const Icon = index === 0 ? FaChartLine : index === 1 ? FaHandshake : FaGem;

                                        return (
                                            <div key={index} className="flex gap-4 group">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/30 group-hover:bg-luxury-gold group-hover:text-black transition-all duration-300 text-luxury-gold">
                                                        <Icon aria-hidden="true" size={18} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">{value.title}</h4>
                                                    <p className="text-gray-400 text-sm leading-relaxed text-justify">
                                                        {value.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </ScrollReveal>

                    </div>
                </div>
            </div>
        </section>
    );
}
