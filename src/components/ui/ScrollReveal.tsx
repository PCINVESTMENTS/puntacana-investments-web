"use client";

import { motion, useInView, useAnimation, Variant } from "framer-motion";
import { useRef, useEffect } from "react";

interface Props {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    style?: React.CSSProperties;
}

export const ScrollReveal = ({ children, width = "fit-content", delay = 0.25, direction = "up", style }: Props) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const getVariants = (): { hidden: Variant; visible: Variant } => {
        const distance = 75;
        let hidden: any = { opacity: 0 };

        switch (direction) {
            case "up": hidden = { ...hidden, y: distance }; break;
            case "down": hidden = { ...hidden, y: -distance }; break;
            case "left": hidden = { ...hidden, x: distance }; break;
            case "right": hidden = { ...hidden, x: -distance }; break;
            case "none": hidden = { ...hidden, scale: 0.9 }; break;
        }

        return {
            hidden,
            visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.5, delay: delay } },
        };
    };

    return (
        <div ref={ref} className={`relative overflow-hidden ${width === "100%" ? "w-full" : "w-fit"}`} style={style}>
            <motion.div
                variants={getVariants()}
                initial="hidden"
                animate={mainControls}
            >
                {children}
            </motion.div>
        </div>
    );
};
