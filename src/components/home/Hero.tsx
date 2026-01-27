"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ScrollReveal } from "../ui/ScrollReveal";

import { urlFor, sanityLoader } from "@/sanity/lib/image";

interface HeroProps {
    dict: {
        subtitle: string;
        title: string;
        cta: string;
        scroll: string;
    };
    featuredImages: {
        id: number;
        mainImage: any;
        backupImage: string;
    }[];
}

export default function Hero({ dict, featuredImages }: HeroProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % featuredImages.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [featuredImages.length]);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary-black">
            {/* Background Slider */}
            <div className="absolute inset-0 z-0">
                {featuredImages.map((img, index) => {
                    const isPriority = index === 0;

                    // Defer rendering of non-priority images until client-side hydration
                    // This ensures the LCP image gets full bandwidth
                    if (!isPriority && !mounted) return null;

                    return (
                        <div
                            key={img.id}
                            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            {img.mainImage ? (
                                <Image
                                    loader={sanityLoader}
                                    src={img.mainImage}
                                    alt={dict.title}
                                    fill
                                    priority={isPriority}
                                    {...(isPriority ? { fetchPriority: "high" } : {})}
                                    sizes="100vw"
                                    className="object-cover"
                                    quality={85}
                                />
                            ) : (
                                <Image
                                    src={img.backupImage}
                                    alt={dict.title}
                                    fill
                                    priority={isPriority}
                                    sizes="100vw"
                                    className="object-cover"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-transparent to-primary-black/50"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
                <ScrollReveal delay={0.2} width="100%">
                    <div className="bg-black/20 backdrop-blur-[2px] border border-white/10 rounded-sm p-6 md:p-10 shadow-2xl max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-luxury-gold leading-tight font-serif uppercase tracking-widest drop-shadow-md">
                            {dict.title}
                        </h1>
                        <div className="h-1 w-24 bg-luxury-gold mx-auto my-6 shadow-sm"></div>
                        <p className="text-xl md:text-2xl text-white font-serif italic font-light leading-relaxed drop-shadow-md tracking-wide">
                            {dict.subtitle}
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
