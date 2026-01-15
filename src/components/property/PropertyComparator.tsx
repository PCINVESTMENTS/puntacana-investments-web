"use client";

import { useState } from "react";
import { useCompare } from "./CompareContext";
import Image from "next/image";
import { FaTimes, FaExchangeAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function PropertyComparator({ lang }: { lang: string }) {
    const { selectedProperties, removeFromCompare, clearCompare } = useCompare();
    const [isOpen, setIsOpen] = useState(false);

    if (selectedProperties.length === 0) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            {/* Floating Bar */}
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-dark-gray border border-luxury-gold/30 shadow-2xl p-4 flex items-center gap-6 rounded-xl backdrop-blur-md"
            >
                <div className="flex -space-x-3">
                    {selectedProperties.map((prop) => (
                        <div key={prop.id} className="relative w-12 h-12 rounded-full border-2 border-black overflow-hidden group">
                            <Image src={prop.image} alt={prop.title} fill className="object-cover" />
                            <button
                                onClick={() => removeFromCompare(prop.id)}
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                                <FaTimes className="text-white text-xs" />
                            </button>
                        </div>
                    ))}
                    {selectedProperties.length < 4 && (
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-gray-500 text-xs">
                            {selectedProperties.length}/4
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-white/10"></div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-luxury-gold text-black px-6 py-2 rounded font-bold text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
                    >
                        <FaExchangeAlt /> {lang === "en" ? "Compare" : "Comparar"}
                    </button>
                    <button
                        onClick={clearCompare}
                        className="text-gray-400 hover:text-white transition-colors p-2"
                        title={lang === "en" ? "Clear All" : "Limpiar Todo"}
                    >
                        <FaTimes />
                    </button>
                </div>
            </motion.div>

            {/* Comparison Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 md:p-12 overflow-y-auto"
                    >
                        <div className="w-full max-w-7xl relative">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute -top-12 right-0 text-white text-3xl hover:text-luxury-gold transition-colors"
                            >
                                <FaTimes />
                            </button>

                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-luxury-gold mb-12 text-center uppercase tracking-widest">
                                {lang === "en" ? "Property Comparison" : "Comparación de Propiedades"}
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-4 text-left border-b border-white/10 w-48 italic text-gray-400 font-light">
                                                {lang === "en" ? "Property" : "Propiedad"}
                                            </th>
                                            {selectedProperties.map(prop => (
                                                <th key={prop.id} className="p-4 border-b border-white/10 min-w-[250px]">
                                                    <div className="relative h-48 w-full mb-4">
                                                        <Image src={prop.image} alt={prop.title} fill className="object-cover rounded-sm" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white text-center">{prop.title}</h3>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        <tr>
                                            <td className="p-6 border-b border-white/5 text-left text-luxury-gold font-bold uppercase tracking-wider text-xs">
                                                {lang === "en" ? "Price" : "Precio"}
                                            </td>
                                            {selectedProperties.map(prop => (
                                                <td key={prop.id} className="p-6 border-b border-white/5 text-2xl font-bold font-serif">
                                                    {formatPrice(prop.price)}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="p-6 border-b border-white/5 text-left text-luxury-gold font-bold uppercase tracking-wider text-xs">
                                                {lang === "en" ? "Location" : "Ubicación"}
                                            </td>
                                            {selectedProperties.map(prop => (
                                                <td key={prop.id} className="p-6 border-b border-white/5 text-gray-300">
                                                    {prop.locationLabel}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="p-6 border-b border-white/5 text-left text-luxury-gold font-bold uppercase tracking-wider text-xs">
                                                {lang === "en" ? "Beds / Baths" : "Hab. / Baños"}
                                            </td>
                                            {selectedProperties.map(prop => (
                                                <td key={prop.id} className="p-6 border-b border-white/5">
                                                    <div className="flex justify-center items-center gap-4 text-white">
                                                        <span className="flex items-center gap-1"><FaBed className="text-luxury-gold" /> {prop.beds}</span>
                                                        <span className="flex items-center gap-1"><FaBath className="text-luxury-gold" /> {prop.baths}</span>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="p-6 border-b border-white/5 text-left text-luxury-gold font-bold uppercase tracking-wider text-xs">
                                                {lang === "en" ? "Area" : "Área"}
                                            </td>
                                            {selectedProperties.map(prop => (
                                                <td key={prop.id} className="p-6 border-b border-white/5">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className="text-white font-bold">{prop.area} m²</span>
                                                        <span className="text-gray-500 text-xs">{Math.round(prop.area * 10.764)} ft²</span>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="p-6 border-b border-white/5 text-left text-luxury-gold font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                                                {lang === "en" ? "Type" : "Tipo"}
                                            </td>
                                            {selectedProperties.map(prop => (
                                                <td key={prop.id} className="p-6 border-b border-white/5 uppercase tracking-widest text-xs font-bold text-gray-400">
                                                    {prop.type}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="p-6 p-6 text-left text-luxury-gold font-bold uppercase tracking-wider text-xs">
                                                {lang === "en" ? "Action" : "Acción"}
                                            </td>
                                            {selectedProperties.map(prop => (
                                                <td key={prop.id} className="p-6">
                                                    <a
                                                        href={`/${lang}/properties/${prop.id}`}
                                                        className="inline-block bg-white text-black font-bold px-6 py-2 uppercase text-xs tracking-widest hover:bg-luxury-gold transition-colors"
                                                    >
                                                        {lang === "en" ? "View Details" : "Ver Detalles"}
                                                    </a>
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
