"use client";

import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function OffMarketForm({ lang }: { lang: string }) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const assetTypes = [
        "Hoteles y Resorts Operativos",
        "Macro-Lotes para Desarrollo Turístico/Inmobiliario",
        "Propiedades en Remate Bancario / Urgencia Económica",
        "Villas de Ultra-Lujo / Penthouses Privados"
    ];

    const investmentCapacities = [
        "USD $1M - USD $5M",
        "USD $5M - USD $20M",
        "Más de USD $20M"
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        const formData = new FormData(e.currentTarget);
        
        // Extract specialized fields
        const companyName = formData.get("companyName") as string;
        const region = formData.get("region") as string;
        
        // Get all checked asset types
        const selectedAssets = assetTypes.filter(asset => formData.get(`asset_${asset}`) === "on");
        
        // Get selected investment capacity
        const capacity = formData.get("capacity") as string;

        // Compile custom message for the backend & CRM
        const compiledMessage = `
[OFF-MARKET PORTFOLIO APPLICATION]
Empresa / Fondo: ${companyName || 'No especificado'}
Región de Interés Principal: ${region || 'No especificada'}

Tipos de Activos Seleccionados:
${selectedAssets.length > 0 ? selectedAssets.map(a => `- ${a}`).join('\n') : '- Ninguno seleccionado'}

Capacidad de Inversión:
${capacity || 'No especificada'}
        `.trim();

        // Prepare formData for submitContactForm
        const finalFormData = new FormData();
        finalFormData.append("name", formData.get("fullName") as string);
        finalFormData.append("email", formData.get("email") as string);
        finalFormData.append("phone", formData.get("phone") as string);
        finalFormData.append("message", compiledMessage);
        finalFormData.append("subject", "Aplicación a Portafolio Privado Off-Market");
        finalFormData.append("lang", lang);

        try {
            const result = await submitContactForm(null, finalFormData);
            if (result?.success) {
                setStatus("success");
                setMessage("Su solicitud ha sido enviada con éxito. Nuestro comité de inversiones se pondrá en contacto en breve.");
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus("error");
                setMessage(result?.message || "Ocurrió un error. Por favor intente nuevamente.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Ocurrió un error en el sistema. Por favor intente nuevamente.");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-primary-black border border-luxury-gold p-10 text-center rounded-sm">
                <FaCheckCircle className="text-luxury-gold text-6xl mx-auto mb-6" />
                <h3 className="text-2xl font-serif text-white mb-4 uppercase tracking-widest">Protocolo Iniciado</h3>
                <p className="text-neutral-gray text-lg">{message}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Elegant Corner Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>

            <div className="text-center mb-10">
                <h3 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest mb-3">
                    Solicitud de Admisión al Portafolio Off-Market
                </h3>
                <div className="h-0.5 w-16 bg-luxury-gold mx-auto mb-4"></div>
                <p className="text-sm text-neutral-gray max-w-2xl mx-auto leading-relaxed">
                    Complete el siguiente registro confidencial. Un director de nuestro comité de inversiones evaluará su perfil y se pondrá en contacto con usted mediante una vía segura en menos de 24 horas para iniciar el proceso de depuración.
                </p>
            </div>

            {status === "error" && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-8 text-center text-sm">
                    {message}
                </div>
            )}

            <div className="space-y-8 relative z-10">
                {/* Personal Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2">
                            Nombre Completo / Representante Legal *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            className="w-full bg-primary-black border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder-white/30"
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2">
                            Nombre de la Empresa o Fondo (Si aplica)
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            className="w-full bg-primary-black border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder-white/30"
                            placeholder="Ej. Global Holdings LLC"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2">
                            Correo Electrónico Corporativo *
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full bg-primary-black border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder-white/30"
                            placeholder="contacto@empresa.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2">
                            Teléfono / WhatsApp Directo *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="w-full bg-primary-black border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder-white/30"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                </div>

                <hr className="border-white/10" />

                {/* Investment Interests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-4">
                            Tipo de Activo de Interés *
                        </label>
                        <div className="space-y-3">
                            {assetTypes.map((asset, idx) => (
                                <label key={idx} className="flex items-start gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center mt-0.5">
                                        <input
                                            type="checkbox"
                                            name={`asset_${asset}`}
                                            className="peer appearance-none w-5 h-5 border border-white/30 bg-primary-black checked:bg-luxury-gold checked:border-luxury-gold transition-all cursor-pointer shrink-0"
                                        />
                                        <svg
                                            className="absolute w-3 h-3 text-black pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                        {asset}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-4">
                            Capacidad de Inversión Estimada *
                        </label>
                        <div className="space-y-3">
                            {investmentCapacities.map((cap, idx) => (
                                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center shrink-0">
                                        <input
                                            type="radio"
                                            name="capacity"
                                            value={cap}
                                            required
                                            className="peer appearance-none w-5 h-5 rounded-full border border-white/30 bg-primary-black checked:border-[5px] checked:border-luxury-gold transition-all cursor-pointer"
                                        />
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                        {cap}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-luxury-gold uppercase tracking-wider mb-2 mt-4">
                        Región de Interés Principal
                    </label>
                    <input
                        type="text"
                        name="region"
                        className="w-full bg-primary-black border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-luxury-gold transition-colors placeholder-white/30"
                        placeholder="Ej. Punta Cana, Miches, Las Terrenas..."
                    />
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-luxury-gold hover:bg-white text-black font-bold py-5 px-8 uppercase tracking-[0.2em] text-sm md:text-base transition-all duration-300 disabled:opacity-70 flex justify-center items-center shadow-[0_0_20px_rgba(201,174,93,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    >
                        {status === "loading" ? (
                            <FaSpinner className="animate-spin text-xl" />
                        ) : (
                            "INICIAR PROTOCOLO DE CONFIDENCIALIDAD Y DEPURACIÓN"
                        )}
                    </button>
                    <p className="text-center text-[10px] text-gray-500 uppercase tracking-wider mt-4">
                        Al enviar esta solicitud, usted acepta estar sujeto a nuestro protocolo de verificación institucional.
                    </p>
                </div>
            </div>
        </form>
    );
}
