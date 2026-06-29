"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { sanityLoader } from "@/sanity/lib/image";

interface HeroCarouselProps {
    featuredImages: {
        id: number;
        mainImage: any;
        backupImage: string;
    }[];
    altText: string;
}

export default function HeroCarousel({ featuredImages, altText }: HeroCarouselProps) {
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
        // Rotate every 12 seconds to allow users to read and prevent PageSpeed penalizations
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % featuredImages.length);
        }, 12000);

        return () => clearInterval(interval);
    }, [featuredImages.length]);

    return (
        <div className="absolute inset-0 z-0">
            {featuredImages.map((img, index) => {
                const isPriority = index === 0;

                // Defer rendering of images until they are the current or next slide
                if (!renderedIndexes.includes(index)) return null;

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
                                alt={altText}
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
                                alt={altText}
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
    );
}
