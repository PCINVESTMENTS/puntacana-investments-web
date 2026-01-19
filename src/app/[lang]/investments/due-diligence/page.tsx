"use client";

import { useState } from "react";
import { PersonaFisicaForm } from "@/components/forms/PersonaFisicaForm";
import { PersonaJuridicaForm } from "@/components/forms/PersonaJuridicaForm";
import { Button } from "@/components/ui/button";
import { User, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DueDiligencePage() {
    const [formType, setFormType] = useState<"fisica" | "juridica">("fisica");

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 md:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-luxury-gold via-yellow-200 to-luxury-gold bg-clip-text text-transparent">
                        Debida Diligencia
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Complete el formulario correspondiente para iniciar su proceso de inversión.
                        Seleccione el tipo de persona para continuar.
                    </p>
                    <div className="h-1 w-24 bg-luxury-gold mx-auto rounded-full mt-6 mb-8" />
                </div>

                {/* Form Type Selector */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
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
                        Persona Física
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
                        Persona Jurídica
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
