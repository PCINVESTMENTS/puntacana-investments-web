"use client";

import { useState } from "react";
import { PersonaFisicaForm } from "@/components/forms/PersonaFisicaForm";
import { PersonaJuridicaForm } from "@/components/forms/PersonaJuridicaForm";
import { Button } from "@/components/ui/button";
import { User, Building2 } from "lucide-react";

export default function DueDiligencePage() {
    const [formType, setFormType] = useState<"fisica" | "juridica">("fisica");

    return (
        <div className="bg-zinc-950 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Debida Diligencia
                        <span className="block text-luxury-gold text-lg md:text-xl font-normal mt-2 font-serif italic">
                            Conozca a su Cliente / Know Your Customer
                        </span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Por favor, seleccione el tipo de persona y complete el formulario correspondiente.
                        Todos los campos son obligatorios para cumplir con las regulaciones vigentes.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
                    <Button
                        variant={formType === "fisica" ? "default" : "outline"}
                        onClick={() => setFormType("fisica")}
                        className={`w-full sm:w-auto min-w-[200px] h-14 text-lg gap-3 ${formType === "fisica"
                                ? "bg-luxury-gold text-black hover:bg-white border-luxury-gold"
                                : "border-white/20 text-white hover:bg-white/5 hover:text-luxury-gold"
                            }`}
                    >
                        <User size={24} />
                        Persona Física
                    </Button>
                    <Button
                        variant={formType === "juridica" ? "default" : "outline"}
                        onClick={() => setFormType("juridica")}
                        className={`w-full sm:w-auto min-w-[200px] h-14 text-lg gap-3 ${formType === "juridica"
                                ? "bg-luxury-gold text-black hover:bg-white border-luxury-gold"
                                : "border-white/20 text-white hover:bg-white/5 hover:text-luxury-gold"
                            }`}
                    >
                        <Building2 size={24} />
                        Persona Jurídica
                    </Button>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    {formType === "fisica" ? (
                        <div className="space-y-4">
                            <div className="bg-luxury-gold/10 border border-luxury-gold/20 rounded-lg p-4 mb-6">
                                <p className="text-sm text-luxury-gold text-center">
                                    Está visualizando el formulario para <span className="font-bold">Persona Física</span>.
                                    Si representa una empresa, por favor seleccione "Persona Jurídica".
                                </p>
                            </div>
                            <PersonaFisicaForm />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-luxury-gold/10 border border-luxury-gold/20 rounded-lg p-4 mb-6">
                                <p className="text-sm text-luxury-gold text-center">
                                    Está visualizando el formulario para <span className="font-bold">Persona Jurídica</span> (Empresas).
                                </p>
                            </div>
                            <PersonaJuridicaForm />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
