"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface ServiceItem {
    title: string;
    description: string;
    img?: string;
    slug?: string;
    details: readonly string[];
}

interface ServicesSectionProps {
    dict: {
        title: string;
        subtitle: string;
        description: string;
        cta: string;
        items: readonly ServiceItem[];
    };
    lang: string;
    limit?: number;
}

export default function ServicesSection({ dict, lang, limit }: ServicesSectionProps) {
    let items = dict.items;

    // Safety check for items
    if (!items || !Array.isArray(items)) {
        items = [];
    }

    if (limit) {
        items = items.slice(0, limit);
    }

    return (
        <section id="services" className="py-12 bg-primary-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">
                        {dict.subtitle}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6 font-serif">
                        {dict.title}
                    </h2>
                    <div className="h-1 w-24 bg-luxury-gold mx-auto"></div>
                    <p className="text-neutral-gray mt-6 max-w-2xl mx-auto">
                        {dict.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
                    {items.map((service, index) => (
                        <Link
                            key={index}
                            href={`/${lang}/services/${service.slug}`}
                            className="bg-primary-black border border-white/5 hover:border-luxury-gold/50 transition-all duration-300 group hover:-translate-y-2 cursor-pointer flex flex-col relative overflow-hidden h-[400px] rounded-sm"
                        >
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0 z-0">
                                {service.img ? (
                                    <img
                                        src={service.img}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-800" />
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                            </div>

                            <div className="relative z-10 p-8 flex flex-col h-full">
                                <h3 className="text-2xl text-white font-serif font-bold mb-4 group-hover:text-luxury-gold transition-colors mt-auto">
                                    {service.title}
                                </h3>
                                <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {service.description}
                                </p>
                                <span className="text-xs text-luxury-gold uppercase tracking-widest font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                                    {dict.cta} <FaArrowRight />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Explore More Button */}
                {limit && (
                    <div className="mt-12 text-center">
                        <Link
                            href={`/${lang}/services`}
                            className="inline-block bg-luxury-gold text-black font-bold py-4 px-10 rounded-sm hover:bg-white transition-colors uppercase tracking-widest text-sm shadow-lg hover:shadow-xl"
                        >
                            {lang === 'en' ? 'Explore All Services' : 'Explorar Todos los Servicios'}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
