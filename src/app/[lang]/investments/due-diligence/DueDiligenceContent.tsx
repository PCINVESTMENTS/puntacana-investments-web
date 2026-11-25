"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { User, Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useParams } from "next/navigation";

function LocalizedFormLoader() {
    const params = useParams();
    const lang = (params?.lang as "es" | "en" | "fr") || "es";
    const loadingText =
        lang === "fr"
            ? "Chargement du formulaire..."
            : lang === "en"
            ? "Loading form..."
            : "Cargando formulario...";
    return (
        <div
            data-kyc-form-loading={lang}
            className="min-h-[500px] flex items-center justify-center text-luxury-gold"
        >
            <div className="animate-pulse">{loadingText}</div>
        </div>
    );
}

// Dynamically import heavy form components to reduce initial JS payload and CPU time
const PersonaFisicaForm = dynamic(() => import("@/components/forms/PersonaFisicaForm").then(mod => mod.PersonaFisicaForm), {
    loading: () => <LocalizedFormLoader />
});

const PersonaJuridicaForm = dynamic(() => import("@/components/forms/PersonaJuridicaForm").then(mod => mod.PersonaJuridicaForm), {
    loading: () => <LocalizedFormLoader />
});

export default function DueDiligenceContent({ ddConfig }: { ddConfig?: Record<string, any> | null }) {
    const enableFisica = ddConfig?.enable_persona_fisica !== false;
    const enableJuridica = ddConfig?.enable_persona_juridica !== false;
    const [formType, setFormType] = useState<"fisica" | "juridica">(enableFisica ? "fisica" : "juridica");
    const params = useParams();
    const lang = (params.lang as "es" | "en" | "fr") || 'es';
    const customTitle = ddConfig?.title?.[lang] || (lang === 'es' ? 'Debida Diligencia' : lang === 'fr' ? 'Diligence Raisonnable' : 'Due Diligence');
    const customSubtitle = ddConfig?.subtitle?.[lang] || (
        lang === 'es'
            ? 'Complete el formulario correspondiente para iniciar su proceso de inversión. Seleccione el tipo de persona para continuar.'
            : lang === 'fr'
            ? 'Veuillez remplir le formulaire correspondant pour initier votre processus d\'investissement. Sélectionnez le type de personne pour continuer.'
            : 'Please complete the corresponding form to initiate your investment process. Select the type of entity to continue.'
    );

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
                <div className="text-center space-y-6 pt-12 pb-8 print:hidden">
                    <div className="flex justify-center mb-6">
                        <div className="mb-6">
                            <Image
                                src="/form-logo.webp"
                                alt="Punta Cana Investments"
                                width={301}
                                height={168}
                                className="object-contain"
                                priority
                                fetchPriority="high"
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-luxury-gold via-yellow-200 to-luxury-gold bg-clip-text text-transparent">
                        {customTitle}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        {customSubtitle}
                    </p>
                    <div className="h-1 w-24 bg-luxury-gold mx-auto rounded-full mt-6 mb-8" />
                </div>

                {/* Form Type Selector */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 print:hidden">
                    {enableFisica && (
                    <Button
                        onClick={() => setFormType("fisica")}
                        variant={formType === "fisica" ? "default" : "outline"}
                        className={`
              h-16 px-8 text-lg gap-3 border-luxury-gold transition-all duration-300
              ${formType === "fisica"
                                ? "bg-luxury-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105"
                                : "bg-black/70 text-luxury-gold hover:bg-luxury-gold/10"
                            }
            `}
                    >
                        <User className="w-6 h-6" />
                        {lang === 'es' ? 'Persona Física' : lang === 'fr' ? 'Personne Physique' : 'Individual'}
                    </Button>
                    )}

                    {enableJuridica && (
                    <Button
                        onClick={() => setFormType("juridica")}
                        variant={formType === "juridica" ? "default" : "outline"}
                        className={`
              h-16 px-8 text-lg gap-3 border-luxury-gold transition-all duration-300
              ${formType === "juridica"
                                ? "bg-luxury-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105"
                                : "bg-black/70 text-luxury-gold hover:bg-luxury-gold/10"
                            }
            `}
                    >
                        <Building2 className="w-6 h-6" />
                        {lang === 'es' ? 'Persona Jurídica' : lang === 'fr' ? 'Personne Morale' : 'Legal Entity'}
                    </Button>
                    )}
                </div>

                {/* Form Container */}
                <div className="relative min-h-[500px] animate-in fade-in duration-500">
                    {formType === "fisica" ? (
                        <PersonaFisicaForm />
                    ) : (
                        <PersonaJuridicaForm />
                    )}
                </div>

            </div>
        </div>
    );
}
