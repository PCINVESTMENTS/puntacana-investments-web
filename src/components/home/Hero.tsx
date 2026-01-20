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
