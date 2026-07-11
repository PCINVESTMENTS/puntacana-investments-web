"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { User, Building2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Dynamically import heavy form components to reduce initial JS payload and CPU time
const PersonaFisicaForm = dynamic(() => import("@/components/forms/PersonaFisicaForm").then(mod => mod.PersonaFisicaForm), {
    loading: () => <div className="min-h-[500px] flex items-center justify-center text-luxury-gold"><div className="animate-pulse">Cargando formulario... / Loading form...</div></div>
});

const PersonaJuridicaForm = dynamic(() => import("@/components/forms/PersonaJuridicaForm").then(mod => mod.PersonaJuridicaForm), {
    loading: () => <div className="min-h-[500px] flex items-center justify-center text-luxury-gold"><div className="animate-pulse">Cargando formulario... / Loading form...</div></div>
});
import { useParams } from "next/navigation";

export default function DueDiligenceContent() {
    const [formType, setFormType] = useState<"fisica" | "juridica">("fisica");
    const params = useParams();
    const lang = params.lang as string || 'es';

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 md:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Back Button */}
                <div className="flex justify-start print:hidden">
                    <Link
                        href={`/${lang}/investments`}
                        className="flex items-center gap-2 text-luxury-gold hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-lg font-medium">
                            {lang === 'es' ? 'Volver a Inversiones' : lang === 'fr' ? 'Retour aux Investissements' : 'Back to Investments'}
                        </span>
                    </Link>
                </div>

                {/* Header Section */}
                <div className="text-center space-y-4 pt-4 print:hidden">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-64 h-24">
                            <Image
                                src="/form-logo.jpg"
                                alt="Punta Cana Investments"
                                fill
                                sizes="256px"
                                className="object-contain"
                                priority
                                fetchPriority="high"
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-luxury-gold via-yellow-200 to-luxury-gold bg-clip-text text-transparent">
                        {lang === 'es' ? 'Debida Diligencia' : lang === 'fr' ? 'Diligence Raisonnable' : 'Due Diligence'}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        {lang === 'es'
                            ? 'Complete el formulario correspondiente para iniciar su proceso de inversión. Seleccione el tipo de persona para continuar.'
                            : lang === 'fr'
                            ? 'Veuillez remplir le formulaire correspondant pour initier votre processus d\'investissement. Sélectionnez le type de personne pour continuer.'
                            : 'Please complete the corresponding form to initiate your investment process. Select the type of entity to continue.'}
                    </p>
                    <div className="h-1 w-24 bg-luxury-gold mx-auto rounded-full mt-6 mb-8" />
                </div>

                {/* Form Type Selector */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 print:hidden">
                    <Button
                        onClick={() => setFormType("fisica")}
                        variant={formType === "fisica" ? "default" : "outline"}
                        className={`
              h-16 px-8 text-lg gap-3 border-luxury-gold transition-all duration-300
              ${formType === "fisica"
                                ? "bg-luxury-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105"
                                : "text-luxury-gold hover:bg-luxury-gold/10"
                            }
            `}
                    >
                        <User className="w-6 h-6" />
                        {lang === 'es' ? 'Persona Física' : lang === 'fr' ? 'Personne Physique' : 'Individual'}
                    </Button>

                    <Button
                        onClick={() => setFormType("juridica")}
                        variant={formType === "juridica" ? "default" : "outline"}
                        className={`
              h-16 px-8 text-lg gap-3 border-luxury-gold transition-all duration-300
              ${formType === "juridica"
                                ? "bg-luxury-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105"
                                : "text-luxury-gold hover:bg-luxury-gold/10"
                            }
            `}
                    >
                        <Building2 className="w-6 h-6" />
                        {lang === 'es' ? 'Persona Jurídica' : lang === 'fr' ? 'Personne Morale' : 'Legal Entity'}
                    </Button>
                </div>

                {/* Form Container */}
                <div className="relative min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={formType}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {formType === "fisica" ? (
                                <PersonaFisicaForm />
                            ) : (
                                <PersonaJuridicaForm />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
