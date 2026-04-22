"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    style?: React.CSSProperties;
}

export const ScrollReveal = ({ children, width = "fit-content", delay = 0.25, direction = "up", style }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(currentRef);
                }
            },
            {
                rootMargin: "-50px 0px",
                threshold: 0
            }
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    const getTransform = () => {
        if (isVisible) return "translate(0, 0) scale(1)";
        
        const distance = "75px";
        switch (direction) {
            case "up": return `translateY(${distance})`;
            case "down": return `translateY(-${distance})`;
            case "left": return `translateX(${distance})`;
            case "right": return `translateX(-${distance})`;
            case "none": return "scale(0.9)";
            default: return "translate(0, 0)";
        }
    };

    return (
        <div ref={ref} className={`relative overflow-hidden ${width === "100%" ? "w-full" : "w-fit"}`} style={style}>
            <div
                style={{
                    opacity: isVisible ? 1 : 0,
                    transform: getTransform(),
                    transition: `opacity 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s, transform 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`
                }}
            >
                {children}
            </div>
        </div>
    );
};
