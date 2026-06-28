"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
    const [renderedIndexes, setRenderedIndexes] = useState<number[]>([0]);
    const [isInitialRender, setIsInitialRender] = useState(true);

    useEffect(() => {
        setIsInitialRender(false);
        if (featuredImages.length > 0) {
            const nextIndex = (currentImageIndex + 1) % featuredImages.length;
            
            // Delay preloading the next image by 11.5 seconds (prevents Lighthouse LCP override)
            const timeout = setTimeout(() => {
                setRenderedIndexes(prev => {
                    let changed = false;
                    const newSet = new Set(prev);
                    if (!newSet.has(currentImageIndex)) { newSet.add(currentImageIndex); changed = true; }
                    if (!newSet.has(nextIndex)) { newSet.add(nextIndex); changed = true; }
                    return changed ? Array.from(newSet) : prev;
                });
            }, 11500);

            return () => clearTimeout(timeout);
        }
    }, [currentImageIndex, featuredImages.length]);

    useEffect(() => {
        // Rotate every 12 seconds to allow users to read and prevent PageSpeed penalizations
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % featuredImages.length);
        }, 12000);

        return () => clearInterval(interval);
    }, [featuredImages.length]);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary-black">
            {/* Background Slider */}
            <div className="absolute inset-0 z-0">
                {featuredImages.map((img, index) => {
                    const isPriority = index === 0;

                    // Defer rendering of images until they are the current or next slide
                    // This critically prevents 6+ concurrent full-res background downloads on hydration
                    if (!renderedIndexes.includes(index)) return null;

                    return (
                        <div
                            key={img.id}
                            className={`absolute inset-0 ${!isInitialRender ? "transition-opacity duration-1500 ease-in-out" : ""} ${index === currentImageIndex ? "opacity-100" : "opacity-0"
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
                                    quality={75}
                                />
                            ) : (
                                <Image
                                    src={img.backupImage}
                                    alt={dict.title}
                                    fill
                                    priority={isPriority}
                                    {...(isPriority ? { fetchPriority: "high" } : {})}
                                    sizes="100vw"
                                    className="object-cover"
                                    quality={60}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-primary-black/60 md:from-black/20 md:to-primary-black/50"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
                <div className="bg-black/70 md:bg-black/60 md:backdrop-blur-[4px] border border-white/10 rounded-sm p-6 md:p-10 shadow-2xl max-w-3xl mx-auto min-h-[400px] md:min-h-[300px] flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-luxury-gold leading-tight font-serif uppercase tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                        {dict.title}
                    </h1>
                    <div className="h-1 w-24 bg-luxury-gold mx-auto my-6 shadow-sm"></div>
                    <p className="text-xl md:text-2xl text-white font-serif italic font-light leading-relaxed drop-shadow-md tracking-wide">
                        {dict.subtitle}
                    </p>
                </div>
            </div>
        </section>
    );
}
