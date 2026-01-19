"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ScrollReveal } from "../ui/ScrollReveal";

interface HeroProps {
    dict: {
        subtitle: string;
        title: string;
        cta: string;
        scroll: string;
    };
    featuredImages: string[];
}

export default function Hero({ dict, featuredImages }: HeroProps) {
    // Featured images are now passed as props


    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % featuredImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [featuredImages.length]);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary-black">
            {/* Background Slider */}
            <div className="absolute inset-0 z-0">
                {featuredImages.map((src, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={src}
                            alt="Background"
                            fill
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, 100vw"
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/10 via-transparent to-primary-black/40"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
                <ScrollReveal delay={0.2} width="100%">
                    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-sm p-4 md:p-8 shadow-2xl max-w-2xl mx-auto">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-luxury-gold leading-tight font-serif uppercase tracking-wider drop-shadow-md">
                            {dict.title}
                        </h1>
                        <div className="h-1 w-16 bg-luxury-gold mx-auto my-3"></div>
                        <p className="text-base md:text-xl text-gray-100 font-serif italic leading-relaxed drop-shadow-sm tracking-wide">
                            {dict.subtitle}
                        </p>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
