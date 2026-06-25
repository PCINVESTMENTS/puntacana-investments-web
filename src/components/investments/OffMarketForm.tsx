"use client";

import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

import { offMarketDict } from "@/dictionaries/offMarket";

export default function OffMarketForm({ lang }: { lang: string }) {
    const t = offMarketDict[lang as "es" | "en" | "fr"].form;
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState<"oportunidad" | "hoteles">("oportunidad");

    // Common Dropdowns
    const budgets = [
        "USD $1,000,000 - USD $5,000,000",
        "USD $5,000,000 - USD $20,000,000",
        "USD $20,000,000 - USD $50,000,000",
        "USD $60,000,000 - USD $100,000,000",
        "USD $100,000,000 o más"
    ];

    const regions = [
        "Punta Cana",
        "Cap Cana",
        "Miches",
        "Uvero Alto",
        "Las Terrenas",
        "Santo Domingo"
    ];

    // Oportunidad options
    // oppPropertyTypes is now pulled dynamically

    // oppPhysicalStates is now pulled dynamically below

    // oppDiscounts is now pulled dynamically below

    // oppStrategies is now pulled dynamically below

    // Hoteles options
    // hotelEnvironments is now pulled dynamically below

    // hotelRooms is now pulled dynamically below

    // hotelOperators is now pulled dynamically below

    // hotelObjectives is now pulled dynamically below

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        const formData = new FormData(e.currentTarget);
        
        const fullName = formData.get("fullName") as string;
        const companyName = formData.get("companyName") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;

        // Get selected regions
        const selectedRegions = regions.filter(r => formData.get(`region_${r}`) === "on");
        const regionString = selectedRegions.length > 0 ? selectedRegions.join(", ") : "No especificada";

        let compiledMessage = `[REQUERIMIENTO DE BÚSQUEDA PRIVADA OFF-MARKET]\n`;
        compiledMessage += `Nombre: ${fullName}\n`;
        compiledMessage += `Empresa: ${companyName || 'No especificada'}\n`;
        compiledMessage += `Email: ${email}\n`;
        compiledMessage += `Teléfono: ${phone}\n\n`;

        if (activeTab === "oportunidad") {
            compiledMessage += `--- PROPIEDADES DE OPORTUNIDAD Y REMATES ---\n`;
            compiledMessage += `Presupuesto: ${formData.get("opp_budget")}\n`;
            compiledMessage += `Tipo de Propiedad: ${formData.get("opp_type")}\n`;
            compiledMessage += `Estado Físico: ${formData.get("opp_state")}\n`;
            compiledMessage += `Descuento Exigido: ${formData.get("opp_discount")}\n`;
            compiledMessage += `Estrategia: ${formData.get("opp_strategy")}\n`;
        } else {
            compiledMessage += `--- HOTELES, RESORTS Y TERRENOS ---\n`;
            compiledMessage += `Presupuesto: ${formData.get("hotel_budget")}\n`;
            compiledMessage += `Entorno / Naturaleza: ${formData.get("hotel_environment")}\n`;
            compiledMessage += `Cantidad de Habitaciones: ${formData.get("hotel_rooms")}\n`;
            compiledMessage += `Preferencia de Operadora: ${formData.get("hotel_operator")}\n`;
            compiledMessage += `Objetivo Principal: ${formData.get("hotel_objective")}\n`;
        }

        compiledMessage += `\nRegiones de Interés: ${regionString}\n`;

        const finalFormData = new FormData();
        finalFormData.append("name", fullName);
        finalFormData.append("email", email);
        finalFormData.append("phone", phone);
        finalFormData.append("message", compiledMessage);
        finalFormData.append("subject", "Aplicación a Búsqueda Privada Off-Market");
        finalFormData.append("lang", lang);

        try {
            const result = await submitContactForm(null, finalFormData);
            if (result?.success) {
                setStatus("success");
                setMessage(t.successMsg);
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

    const selectClassName = "w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none cursor-pointer";
    const labelClassName = "block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2";

    return (
        <div className="w-full">
            {status === "success" && (
                <div className="bg-zinc-900 border border-[#d4af37]/30 p-8 md:p-12 rounded-xl text-center shadow-2xl">
                    <div className="flex justify-center mb-6 text-[#d4af37]">
                        <FaCheckCircle aria-hidden="true" size={56} />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-4 uppercase tracking-widest">{t.received}</h3>
                    <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">{message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors rounded-full font-semibold uppercase tracking-wider text-sm"
                    >
                        {t.sendAnother}
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className={status === 'success' ? 'absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none' : 'bg-[#000000] border border-[#d4af37]/30 p-8 md:p-12 shadow-2xl relative overflow-hidden'}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>

            <div className="text-center mb-10">
                <h3 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest mb-3">
                    {t.title}
                </h3>
                <div className="h-0.5 w-16 bg-[#d4af37] mx-auto mb-4"></div>
                <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    {t.subtitle}
                </p>
            </div>

            {status === "error" && (
                <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-8 text-center text-sm">
                    {message}
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 mb-10 relative z-10">
                <button
                    type="button"
                    onClick={() => setActiveTab("oportunidad")}
                    className={`flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                        activeTab === "oportunidad" 
                            ? "bg-[#d4af37] text-black border-[#d4af37]" 
                            : "bg-[#000000] text-[#d4af37] border-[#d4af37]/30 hover:border-[#d4af37]"
                    }`}
                >
                    {t.tabs.opportunities}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("hoteles")}
                    className={`flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                        activeTab === "hoteles" 
                            ? "bg-[#d4af37] text-black border-[#d4af37]" 
                            : "bg-[#000000] text-[#d4af37] border-[#d4af37]/30 hover:border-[#d4af37]"
                    }`}
                >
                    {t.tabs.hotels}
                </button>
            </div>

            <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClassName}>{t.fields.name}</label>
                        <input type="text" name="fullName" required className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="Ej. Juan Pérez" />
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.company}</label>
                        <input type="text" name="companyName" className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="Ej. Global Holdings LLC" />
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.email}</label>
                        <input type="email" name="email" required className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="contacto@empresa.com" />
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.phone}</label>
                        <input type="tel" name="phone" required className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="+1 (555) 000-0000" />
                    </div>
                </div>

                <hr className="border-[#d4af37]/20" />

                <div className={`space-y-8 ${activeTab === "oportunidad" ? "block" : "hidden"}`}>
                    <div>
                        <label className={labelClassName}>{t.fields.budget.label}</label>
                        <select name="opp_budget" required={activeTab === "oportunidad"} className={selectClassName}>
                            <option value="">Seleccione / Select</option>
                            {budgets.map((b, i) => <option key={i} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.opportunityType.label}</label>
                        <select name="opp_type" required={activeTab === "oportunidad"} className={selectClassName}>
                            <option value="">Seleccione / Select</option>
                            {t.fields.opportunityType.options.map((opt: string, i: number) => <option key={i} value={i === 0 ? "" : opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.oppPhysicalState.label}</label>
                        <select name="opp_state" required={activeTab === "oportunidad"} className={selectClassName}>
                            {t.fields.oppPhysicalState.options.map((s: string, i: number) => <option key={i} value={i === 0 ? "" : s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.oppDiscount.label}</label>
                        <select name="opp_discount" required={activeTab === "oportunidad"} className={selectClassName}>
                            {t.fields.oppDiscount.options.map((d: string, i: number) => <option key={i} value={i === 0 ? "" : d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.oppStrategy.label}</label>
                        <select name="opp_strategy" required={activeTab === "oportunidad"} className={selectClassName}>
                            {t.fields.oppStrategy.options.map((s: string, i: number) => <option key={i} value={i === 0 ? "" : s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className={`space-y-8 ${activeTab === "hoteles" ? "block" : "hidden"}`}>
                    <div>
                        <label className={labelClassName}>{t.fields.hotelBudgetLabel}</label>
                        <select name="hotel_budget" required={activeTab === "hoteles"} className={selectClassName}>
                            <option value="">Seleccione / Select</option>
                            {budgets.map((b, i) => <option key={i} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.hotelEnvironment.label}</label>
                        <select name="hotel_environment" required={activeTab === "hoteles"} className={selectClassName}>
                            {t.fields.hotelEnvironment.options.map((e: string, i: number) => <option key={i} value={i === 0 ? "" : e}>{e}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.hotelRooms.label}</label>
                        <select name="hotel_rooms" required={activeTab === "hoteles"} className={selectClassName}>
                            {t.fields.hotelRooms.options.map((r: string, i: number) => <option key={i} value={i === 0 ? "" : r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.hotelOperator.label}</label>
                        <select name="hotel_operator" required={activeTab === "hoteles"} className={selectClassName}>
                            {t.fields.hotelOperator.options.map((o: string, i: number) => <option key={i} value={i === 0 ? "" : o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>{t.fields.hotelObjective.label}</label>
                        <select name="hotel_objective" required={activeTab === "hoteles"} className={selectClassName}>
                            {t.fields.hotelObjective.options.map((o: string, i: number) => <option key={i} value={i === 0 ? "" : o}>{o}</option>)}
                        </select>
                    </div>
                </div>

                <hr className="border-[#d4af37]/20" />

                <div>
                    <label className={labelClassName}>{t.fields.regionLabel}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {regions.map((region, idx) => (
                            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center mt-0.5">
                                    <input
                                        type="checkbox"
                                        name={`region_${region}`}
                                        className="peer appearance-none w-5 h-5 border border-[#d4af37]/50 bg-[#111111] checked:bg-[#d4af37] checked:border-[#d4af37] transition-all cursor-pointer shrink-0"
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
                                    {region}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-[#d4af37] hover:bg-white text-black font-bold py-5 px-8 uppercase tracking-[0.2em] text-sm md:text-base transition-all duration-300 disabled:opacity-70 flex justify-center items-center shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    >
                        {status === "loading" ? (
                            <FaSpinner className="animate-spin text-xl" />
                        ) : (
                            t.fields.submit
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-6">
                        {t.fields.disclaimer}
                    </p>
                </div>
            </div>
        </form>
    </div>
    );
}
