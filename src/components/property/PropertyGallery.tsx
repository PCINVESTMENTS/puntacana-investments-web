"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTimes, FaChevronLeft, FaChevronRight, FaImages } from "react-icons/fa";

interface PropertyGalleryProps {
    images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openGallery = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeGallery = () => {
        setIsOpen(false);
        document.body.style.overflow = "auto";
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // Main grid logic: first image large, others smaller
    const displayImages = images.slice(0, 5);
    const remainingCount = images.length - 5;

    return (
        <div className="relative">
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[600px]">
                <div
                    className="md:col-span-2 md:row-span-2 relative h-full cursor-pointer group overflow-hidden"
                    onClick={() => openGallery(0)}
                >
                    <Image
                        src={images[0]}
                        alt="Property Main"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                </div>
                {displayImages.slice(1).map((img, idx) => (
                    <div
                        key={idx}
                        className="relative h-full cursor-pointer group overflow-hidden hidden md:block"
                        onClick={() => openGallery(idx + 1)}
                    >
                        <Image
                            src={img}
                            alt={`Property Image ${idx + 2}`}
                            fill
                            sizes="25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        {idx === 3 && remainingCount > 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white font-bold text-xl flex items-center gap-2">
                                    <FaImages aria-hidden="true" /> +{remainingCount}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Lightbox / Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
                    <button
                        onClick={closeGallery}
                        className="absolute top-4 right-4 text-white hover:text-luxury-gold text-3xl z-20 p-2"
                        aria-label="Close gallery"
                    >
                        <FaTimes aria-hidden="true" />
                    </button>

                    <button
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 text-white hover:text-luxury-gold text-4xl z-20 bg-black/40 p-3 rounded-full md:bg-transparent"
                        aria-label="Previous image"
                    >
                        <FaChevronLeft aria-hidden="true" />
                    </button>

                    <div className="relative w-full max-w-6xl h-[80vh]">
                        <Image
                            src={images[currentIndex]}
                            alt={`Gallery Image ${currentIndex + 1}`}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            priority
                        />
                    </div>

                    <button
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 text-white hover:text-luxury-gold text-4xl z-20 bg-black/40 p-3 rounded-full md:bg-transparent"
                        aria-label="Next image"
                    >
                        <FaChevronRight aria-hidden="true" />
                    </button>

                    {/* Bottom strip / counter */}
                    <div className="absolute bottom-4 left-0 w-full text-center text-white font-bold">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Thumbnails (optional enhancement) */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 overflow-x-auto max-w-[90vw] flex gap-2 p-2 hidden md:flex">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                className={`relative w-16 h-16 flex-shrink-0 border-2 ${idx === currentIndex ? 'border-luxury-gold' : 'border-transparent'}`}
                                aria-label={`View image ${idx + 1}`}
                            >
                                <Image src={img} alt={`Property thumbnail ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
