'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface ReadMoreProps {
    preview: ReactNode;
    children: ReactNode;
    moreText?: string;
    lessText?: string;
}

export default function ReadMore({ preview, children, moreText = "Leer Más", lessText = "Leer Menos" }: ReadMoreProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative">
            {/* Contenido Siempre Visible */}
            <div className="mb-4">
                {preview}
            </div>

            {/* Contenido Expandible */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botón de Acción */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 text-luxury-gold hover:text-white font-bold uppercase tracking-widest text-xs md:text-sm transition-colors mt-2"
            >
                {isExpanded ? lessText : moreText}
                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
        </div>
    );
}
