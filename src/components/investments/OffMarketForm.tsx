"use client";

import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function OffMarketForm({ lang }: { lang: string }) {
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
    const oppPropertyTypes = [
        "Remates Bancarios / Activos Adjudicados",
        "Villas y Propiedades por Urgencia Económica",
        "Estructuras Residenciales Inconclusas / Proyectos Paralizados",
        "Parcelas / Lotes Preferenciales (Frente al Mar o Campo de Golf)",
        "Penthouses Privados y Unidades Singulares"
    ];

    const oppPhysicalStates = [
        "Terminada / Llave en mano (Para uso o explotación inmediata)",
        "Terminada / Requiere remodelación o mejoras estéticas",
        "En fase de construcción gris / Ejecución pendiente"
    ];

    const oppDiscounts = [
        "Entre un 20% y un 30% por debajo del mercado",
        "Entre un 30% y un 50% por debajo del mercado (Remates agresivos)"
    ];

    const oppStrategies = [
        "Flipping Inmobiliario (Remodelación y reventa rápida)",
        "Explotación de rentas vacacionales (Flujo de caja)",
        "Retención del activo a largo plazo (Plusvalía / Land Banking)"
    ];

    // Hoteles options
    const hotelEnvironments = [
        "Hotel / Resort con línea de playa directa (Beachfront)",
        "Hotel de Ciudad / Corporativo / Urbano",
        "Eco-Resort / Desarrollo de Montaña o Río",
        "Macro-Lote virgen para desarrollo turístico desde cero"
    ];

    const hotelRooms = [
        "De 50 a 100 habitaciones",
        "De 100 a 200 habitaciones",
        "De 200 a 300 habitaciones",
        "De 300 a 400 habitaciones",
        "De 400 a 500 habitaciones",
        "500 habitaciones o más"
    ];

    const hotelOperators = [
        "Con operadora internacional vigente (Asset con contrato de bandera)",
        "Sin operadora / Libre de bandera (Listo para marca propia o reconversión)"
    ];

    const hotelObjectives = [
        "Compra del activo inmobiliario (Adquisición total de la propiedad)",
        "Solo gestionar y administrar (Operación hotelera / Management)",
        "Joint Venture (Inyección de capital y desarrollo conjunto)"
    ];

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
                setMessage("Su requerimiento de búsqueda ha sido enviado con éxito. Por favor, asegúrese de revisar su carpeta de Spam o Correo no deseado en las próximas horas para recibir nuestra respuesta.");
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
                    <h3 className="text-2xl font-serif text-white mb-4 uppercase tracking-widest">Requerimiento Recibido</h3>
                    <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">{message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors rounded-full font-semibold uppercase tracking-wider text-sm"
                    >
                        Enviar otro requerimiento
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className={status === 'success' ? 'absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none' : 'bg-[#000000] border border-[#d4af37]/30 p-8 md:p-12 shadow-2xl relative overflow-hidden'}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>

            <div className="text-center mb-10">
                <h3 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest mb-3">
                    Formulario Técnico de Búsqueda Off-Market
                </h3>
                <div className="h-0.5 w-16 bg-[#d4af37] mx-auto mb-4"></div>
                <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Complete el siguiente requerimiento confidencial. Esto nos permitirá depurar y enviar los activos exactos que encajan en su tesis de inversión.
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
                    Propiedades de Oportunidad y Remates
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
                    Hoteles, Resorts y Terrenos
                </button>
            </div>

            <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClassName}>Nombre Completo / Representante Legal *</label>
                        <input type="text" name="fullName" required className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="Ej. Juan Pérez" />
                    </div>
                    <div>
                        <label className={labelClassName}>Nombre de la Empresa o Fondo (Si aplica)</label>
                        <input type="text" name="companyName" className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="Ej. Global Holdings LLC" />
                    </div>
                    <div>
                        <label className={labelClassName}>Correo Electrónico Corporativo *</label>
                        <input type="email" name="email" required className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="contacto@empresa.com" />
                    </div>
                    <div>
                        <label className={labelClassName}>Teléfono / WhatsApp Directo *</label>
                        <input type="tel" name="phone" required className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="+1 (555) 000-0000" />
                    </div>
                </div>

                <hr className="border-[#d4af37]/20" />

                <div className={`space-y-8 ${activeTab === "oportunidad" ? "block" : "hidden"}`}>
                    <div>
                        <label className={labelClassName}>¿Cuál es el presupuesto asignado para la adquisición? *</label>
                        <select name="opp_budget" required={activeTab === "oportunidad"} className={selectClassName}>
                            <option value="">Seleccione un presupuesto...</option>
                            {budgets.map((b, i) => <option key={i} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>¿Qué tipo de propiedad busca? *</label>
                        <select name="opp_type" required={activeTab === "oportunidad"} className={selectClassName}>
                            <option value="">Seleccione un tipo de propiedad...</option>
                            {oppPropertyTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>¿En qué estado físico prefiere la propiedad? *</label>
                        <select name="opp_state" required={activeTab === "oportunidad"} className={selectClassName}>
                            <option value="">Seleccione un estado físico...</option>
                            {oppPhysicalStates.map((s, i) => <option key={i} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>¿Qué margen de descuento mínimo exige respecto al valor real de mercado? *</label>
                        <select name="opp_discount" required={activeTab === "oportunidad"} className={selectClassName}>
                            <option value="">Seleccione margen de descuento...</option>
                            {oppDiscounts.map((d, i) => <option key={i} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>¿Cuál es su estrategia con esta propiedad? *</label>
                        <select name="opp_strategy" required={activeTab === "oportunidad"} className={selectClassName}>
                            <option value="">Seleccione su estrategia...</option>
                            {oppStrategies.map((s, i) => <option key={i} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className={`space-y-8 ${activeTab === "hoteles" ? "block" : "hidden"}`}>
                    <div>
                        <label className={labelClassName}>¿Cuál es el presupuesto o monto de inversión destinado al activo hotelero? *</label>
                        <select name="hotel_budget" required={activeTab === "hoteles"} className={selectClassName}>
                            <option value="">Seleccione un presupuesto...</option>
                            {budgets.map((b, i) => <option key={i} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>¿Cuál es el entorno o naturaleza del hotel/terreno que busca? *</label>
                        <select name="hotel_environment" required={activeTab === "hoteles"} className={selectClassName}>
                            <option value="">Seleccione el entorno...</option>
                            {hotelEnvironments.map((e, i) => <option key={i} value={e}>{e}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>¿Qué cantidad de habitaciones / llaves requiere? *</label>
                        <select name="hotel_rooms" required={activeTab === "hoteles"} className={selectClassName}>
                            <option value="">Seleccione cantidad de habitaciones...</option>
                            {hotelRooms.map((r, i) => <option key={i} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>¿Cuál es su preferencia respecto a la operadora del hotel? *</label>
                        <select name="hotel_operator" required={activeTab === "hoteles"} className={selectClassName}>
                            <option value="">Seleccione preferencia de operadora...</option>
                            {hotelOperators.map((o, i) => <option key={i} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelClassName}>¿Cuál es el objetivo principal de la transacción? *</label>
                        <select name="hotel_objective" required={activeTab === "hoteles"} className={selectClassName}>
                            <option value="">Seleccione objetivo de la transacción...</option>
                            {hotelObjectives.map((o, i) => <option key={i} value={o}>{o}</option>)}
                        </select>
                    </div>
                </div>

                <hr className="border-[#d4af37]/20" />

                <div>
                    <label className={labelClassName}>¿En qué región estratégica debe estar ubicado el activo? (Seleccione todas las que apliquen) *</label>
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
                            "ENVIAR REQUERIMIENTO DE BÚSQUEDA PRIVADA"
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Al enviar este requerimiento, recibirá una respuesta confidencial. <strong>Revise su carpeta de Spam o Correo no deseado</strong> para asegurar la recepción de nuestra respuesta.
                    </p>
                </div>
            </div>
        </form>
    </div>
    );
}
