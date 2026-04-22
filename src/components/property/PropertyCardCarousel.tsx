"use client";

import { useState } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { sanityLoader } from "@/sanity/lib/image";

interface PropertyCardCarouselProps {
    images: string[];
    rawImages?: any[];
    title: string;
}

export default function PropertyCardCarousel({ images, rawImages, title }: PropertyCardCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const nextStep = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevStep = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="relative w-full h-full overflow-hidden group">
            {images.map((img, idx) => {
                const isActive = idx === currentIndex;
                const srcImage = rawImages && rawImages[idx] ? rawImages[idx] : img;
                const useSanity = !!(rawImages && rawImages[idx]);

                return (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}
                    >
                        <Image
                            loader={useSanity ? sanityLoader : undefined}
                            src={srcImage}
                            alt={`${title} - Image ${idx + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            quality={60}
                            loading={idx === 0 ? "eager" : "lazy"}
                        />
                    </div>
                );
            })}

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevStep}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white p-3 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-luxury-gold hover:text-black shadow-md border border-white/20"
                        aria-label="Previous image"
                        title="Anterior"
                    >
                        <FaChevronLeft aria-hidden="true" size={20} />
                    </button>
                    <button
                        onClick={nextStep}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white p-3 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-luxury-gold hover:text-black shadow-md border border-white/20"
                        aria-label="Next image"
                        title="Siguiente"
                    >
                        <FaChevronRight aria-hidden="true" size={20} />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5" aria-hidden="true">
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-luxury-gold w-4" : "bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent h-24 opacity-80 pointer-events-none z-20"></div>
        </div>
    );
}
