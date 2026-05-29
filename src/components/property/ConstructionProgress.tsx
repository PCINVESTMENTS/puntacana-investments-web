"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaHammer, FaHardHat, FaHome, FaDraftingCompass, FaClock } from "react-icons/fa";

interface Stage {
    date: string;
    title: { es: string; en: string };
    description: { es: string; en: string };
    status: "completed" | "in-progress" | "pending";
}

interface ConstructionProgressProps {
    lang: string;
    stages?: Stage[];
    completionPercent?: number;
}

export default function ConstructionProgress({ lang, stages, completionPercent }: ConstructionProgressProps) {
    if (!stages || stages.length === 0) return null;

    const t = {
        en: {
            title: "Construction Progress",
            subtitle: "Live status of the development.",
            completion: "Completion",
            reportLabel: "Want a photo update of this property?",
            reportButton: "Request Monthly Report"
        },
        es: {
            title: "Progreso de Obra",
            subtitle: "Estado en vivo del desarrollo.",
            completion: "Completado",
            reportLabel: "¿Quieres una actualización fotográfica de esta propiedad?",
            reportButton: "Solicitar Reporte Mensual"
        },
        fr: {
            title: "Progression du Chantier",
            subtitle: "État d'avancement en temps réel du projet.",
            completion: "Avancement",
            reportLabel: "Vous souhaitez une mise à jour photo de cette propriété ?",
            reportButton: "Demander le Rapport Mensuel"
        }
    };

    const d = t[lang as 'en' | 'es' | 'fr'] || t.en;

    const getVal = (obj: any, key: string) => {
        if (!obj) return "";
        return obj[key] || obj['en'] || obj['es'] || "";
    };

    const getIcon = (title: string) => {
        const tVal = title.toLowerCase();
        if (tVal.includes("launch") || tVal.includes("lanzamiento") || tVal.includes("disen")) return <FaDraftingCompass />;
        if (tVal.includes("ground") || tVal.includes("excava") || tVal.includes("cimientos")) return <FaHammer />;
        if (tVal.includes("structural") || tVal.includes("obra gris") || tVal.includes("estructura")) return <FaHardHat />;
        if (tVal.includes("finish") || tVal.includes("acabado") || tVal.includes("interiores")) return <FaHome />;
        if (tVal.includes("delivery") || tVal.includes("entrega")) return <FaCheckCircle />;
        return <FaClock />;
    };

    return (
        <div className="bg-dark-gray p-8 border border-white/5 rounded-lg">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-2xl font-serif font-bold text-luxury-gold mb-2 uppercase tracking-wider flex items-center gap-3">
                        {d.title}
                    </h3>
                    <p className="text-gray-400 text-sm font-light">
                        {d.subtitle}
                    </p>
                </div>
                {completionPercent !== undefined && (
                    <div className="text-right">
                        <span className="text-4xl font-bold text-white font-serif">{completionPercent}%</span>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{d.completion}</div>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {completionPercent !== undefined && (
                <div className="w-full h-2 bg-black rounded-full mb-12 overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${completionPercent}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-luxury-gold/50 to-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    ></motion.div>
                </div>
            )}

            {/* Timeline */}
            <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[23px] top-2 bottom-8 w-px bg-white/10 hidden md:block"></div>

                {stages.map((stage, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col md:flex-row gap-6 items-start"
                    >
                        <div className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg transition-colors ${stage.status === "completed" ? "bg-luxury-gold border-luxury-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]" :
                                stage.status === "in-progress" ? "bg-black border-luxury-gold text-luxury-gold animate-pulse" :
                                    "bg-black border-white/10 text-gray-600"
                            }`}>
                            {getIcon(getVal(stage.title, 'en'))}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                                <h4 className={`text-lg font-bold ${stage.status === "pending" ? "text-gray-500" : "text-white"}`}>
                                    {getVal(stage.title, lang)}
                                </h4>
                                <span className="text-xs font-bold text-luxury-gold/60 uppercase tracking-widest">{stage.date}</span>
                            </div>
                            <p className="text-gray-400 text-sm font-light">
                                {getVal(stage.description, lang)}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-4">
                    {d.reportLabel}
                </p>
                <button className="text-luxury-gold text-xs font-bold uppercase tracking-widest hover:text-white transition-colors border border-luxury-gold/20 px-6 py-3 rounded hover:border-luxury-gold">
                    {d.reportButton}
                </button>
            </div>
        </div>
    );
}
