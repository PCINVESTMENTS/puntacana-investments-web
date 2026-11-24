"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { sanityLoader } from "@/sanity/lib/image";

export interface HeroSlideItem {
    id: number | string;
    mainImage: any;
    backupImage: string;
    slug?: string;
    internalCode?: string;
    title?: string;
    lang?: string;
}

interface HeroCarouselProps {
    featuredImages: HeroSlideItem[];
    altText: string;
    showSlideBadge?: boolean;
}

export default function HeroCarousel({ featuredImages, altText, showSlideBadge = false }: HeroCarouselProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [renderedIndexes, setRenderedIndexes] = useState<number[]>([0]);

    useEffect(() => {
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
        if (featuredImages.length <= 1) return;
        // Rotate every 12 seconds to allow users to read and prevent PageSpeed penalizations
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % featuredImages.length);
        }, 12000);

        return () => clearInterval(interval);
    }, [featuredImages.length]);

    const activeSlide = featuredImages[currentImageIndex] || featuredImages[0];

    return (
        <div
            className="absolute inset-0 z-0"
            data-hero-active-index={currentImageIndex}
            data-hero-active-slug={activeSlide?.slug || ""}
            data-hero-active-code={activeSlide?.internalCode || ""}
            data-hero-slides-order={featuredImages.map((s) => s.slug || String(s.id)).join(",")}
        >
            {featuredImages.map((img, index) => {
                const isPriority = index === 0;

                // Defer rendering of images until they are the current or next slide
                if (!renderedIndexes.includes(index) && index !== currentImageIndex) return null;

                const isActive = index === currentImageIndex;
                const transitionClass = (isPriority && currentImageIndex === 0) ? "" : "transition-opacity duration-1000 ease-in-out";
                const slideAlt = img.title ? `${img.title} — ${altText}` : altText;

                return (
                    <div
                        key={`${img.id}-${img.slug || index}`}
                        data-hero-slide={index + 1}
                        data-hero-slug={img.slug || ""}
                        className={`absolute inset-0 ${transitionClass} ${isActive ? "opacity-100" : "opacity-0"}`}
                    >
                        {img.mainImage ? (
                            <Image
                                loader={sanityLoader}
                                src={img.mainImage}
                                alt={slideAlt}
                                fill
                                priority={isPriority}
                                {...(isPriority ? { fetchPriority: "high" } : {})}
                                sizes="100vw"
                                className="object-cover"
                                quality={65}
                            />
                        ) : (
                            <Image
                                src={img.backupImage}
                                alt={slideAlt}
                                fill
                                priority={isPriority}
                                fetchPriority={isPriority ? "high" : "auto"}
                                sizes="(max-width: 768px) 100vw, 100vw"
                                className="object-cover"
                                quality={50}
                            />
                        )}
                    </div>
                );
            })}

            {showSlideBadge && activeSlide?.slug && activeSlide?.title && (
                <div className="absolute bottom-36 md:bottom-40 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-black/75 backdrop-blur-md border border-luxury-gold/50 px-4 py-2 rounded-full shadow-2xl max-w-[92vw]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-luxury-gold shrink-0">
                        #{currentImageIndex + 1}
                    </span>
                    <Link
                        href={`/${activeSlide.lang || "es"}/properties/${activeSlide.slug}`}
                        className="text-xs font-semibold text-white hover:text-luxury-gold transition-colors truncate"
                    >
                        {activeSlide.title}
                    </Link>
                    {featuredImages.length > 1 && (
                        <div className="flex items-center gap-1.5 pl-2 border-l border-white/20">
                            {featuredImages.slice(0, 6).map((s, i) => (
                                <button
                                    key={`${s.id}-${i}`}
                                    type="button"
                                    aria-label={`Slide ${i + 1}`}
                                    onClick={() => {
                                        setRenderedIndexes((prev) => (prev.includes(i) ? prev : [...prev, i]));
                                        setCurrentImageIndex(i);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                                        i === currentImageIndex ? "bg-luxury-gold w-4" : "bg-white/40 hover:bg-white/80"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
