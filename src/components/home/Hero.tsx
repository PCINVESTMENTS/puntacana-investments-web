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
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 z-0 bg-gradient-to-b from-black/40 via-transparent to-primary-black/60"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
                <ScrollReveal delay={0.2} width="100%">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-0 text-luxury-gold leading-tight font-serif uppercase tracking-wider drop-shadow-lg">
                        {dict.title}
                    </h1>
                </ScrollReveal>
                <ScrollReveal delay={0.4} width="100%" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
                    <p className="text-lg md:text-2xl text-gray-200 font-serif italic max-w-4xl mx-auto leading-relaxed drop-shadow-md tracking-wider">
                        {dict.subtitle}
                    </p>
                </ScrollReveal>
            </div>
        </section>
    );
}
