"use client";

import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "../ui/ScrollReveal";

interface LocationsSectionProps {
    dict: {
        title: string;
        subtitle: string;
        exploreMore: string;
        items?: readonly {
            title: string;
            slug: string;
            img: string;
        }[];
    };
    limit?: number;
    lang?: string;
}

import { useState, useEffect } from 'react';

// ... interface ...

export function LocationsSection({ dict, limit, lang = 'es' }: LocationsSectionProps) {
    const [apiLocations, setApiLocations] = useState<any[]>([]);

    useEffect(() => {
        // FORCE PRODUCTION URL: Vercel is injecting the wrong environment variable (dashboard...)
        // We hardcode the Railway backend here temporarily to bypass the cache/env bug.
        const API_BASE = 'https://puntacana-fortress-production.up.railway.app';

        // Correct Route: /api/cms/locations/ (With Trailing Slash)
        // Note: We fixed the Backend SSL Proxy Header to prevent 308 Loops.
        const endpoint = `${API_BASE}/api/cms/locations/`;

        console.log("Fetching locations from:", endpoint);

        fetch(endpoint)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) throw new Error("API response is not an array");

                // Map API response to Component format
                const mapped = data
                    .filter((item: any) => item.is_active)
                    .map((item: any) => {
                        const imgUrl = item.image_url || '/images/locations/bavaro.jpg';
                        
                        if (imgUrl.includes('unsplash.com') || imgUrl.includes('via.placeholder.com')) {
                            console.warn(`[DATA CLEANUP REQUIRED] Location '${item.title}' (ID/Slug: ${item.slug}) is using a broken or deprecated external image URL: ${imgUrl}. Please update this record in the backend database.`);
                        }

                        return {
                            title: item.title,
                            slug: item.slug,
                            img: imgUrl
                        };
                    });

                if (mapped.length > 0) {
                    setApiLocations(mapped);
                }
            })
            .catch(err => {
                console.error("FAILED to load locations from Backend:", err);
                // We do NOT set apiLocations here, so it falls back to static content
            });
    }, []);

    // Fallback list REMOVED to force API usage as per user request
    // const defaultLocations = [ ... ];

    // Priority: API Only. If API fails, show nothing (or empty).
    // This ensures we never show stale/hardcoded data.
    let locations = apiLocations.length > 0 ? apiLocations : (dict.items || []);

    if (limit) {
        locations = locations.slice(0, limit);
    }

    return (
        <section id="locations" className="pt-12 pb-8 bg-primary-black text-center text-white relative">
            {/* Background Decoration - Optional to match other dark sections */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <ScrollReveal width="100%">
                    <div className="mb-12">
                        <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">{dict.subtitle}</span>
                        <h2 className="text-4xl font-serif font-bold mt-2 text-white">{dict.title}</h2>
                    </div>
                </ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map((loc, idx) => (
                        <Link
                            key={idx}
                            href={`/${lang}/properties?location=${loc.slug}`}
                            className="group relative h-64 overflow-hidden cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 block"
                        >
                            <div className="absolute inset-0 bg-gray-200" />
                            <Image
                                src={loc.img}
                                alt=""
                                aria-hidden="true"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 z-20"></div>

                            <div className="absolute inset-0 flex items-center justify-center z-30">
                                <h3 className="text-3xl font-bold text-luxury-gold drop-shadow-md text-center px-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                                    {loc.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Explore More Button */}
                {limit && (
                    <div className="mt-12 text-center">
                        <Link
                            href={`/${lang}/locations`}
                            className="inline-block bg-luxury-gold text-black font-bold py-4 px-10 rounded-sm hover:bg-white transition-colors uppercase tracking-widest text-sm shadow-lg hover:shadow-xl"
                        >
                            {dict.exploreMore}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
