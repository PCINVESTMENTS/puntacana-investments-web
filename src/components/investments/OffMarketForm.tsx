"use client";

import { useState, useRef } from "react";
import { FaCheckCircle, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { FormAntispamFields } from "@/components/forms/FormAntispamFields";
import { offMarketDict } from "@/dictionaries/offMarket";

export default function OffMarketForm({ lang, isSandbox = false }: { lang: string; isSandbox?: boolean }) {
    const l = (lang === "en" || lang === "fr" ? lang : "es") as "es" | "en" | "fr";
    const t = offMarketDict[l].form;
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [referenceCode, setReferenceCode] = useState<string>("");
    const [emailFailedWarning, setEmailFailedWarning] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<"oportunidad" | "hoteles">("oportunidad");
    const inFlightRef = useRef(false);
    const idemKeyRef = useRef<string | null>(null);

    // Continuous budget brackets (zero gap between $50M and $100M)
    const budgets = [
        "USD $1,000,000 - USD $5,000,000",
        "USD $5,000,000 - USD $20,000,000",
        "USD $20,000,000 - USD $50,000,000",
        "USD $50,000,000 - USD $100,000,000",
        l === "en"
            ? "USD $100,000,000 or more"
            : l === "fr"
            ? "USD $100,000,000 ou plus"
            : "USD $100,000,000 o más",
    ];

    const selectPrompt =
        l === "en" ? "Select an option" : l === "fr" ? "Sélectionner une option" : "Seleccione una opción";

    const placeholders = {
        es: { name: "Ej. Juan Pérez", company: "Ej. Global Holdings LLC", email: "contacto@empresa.com" },
        en: { name: "e.g. John Doe", company: "e.g. Global Holdings LLC", email: "contact@company.com" },
        fr: { name: "Ex. Jean Dupont", company: "Ex. Global Holdings SAS", email: "contact@entreprise.com" },
    }[l];

    const regions = [
        "Punta Cana",
        "Cap Cana",
        "Miches",
        "Uvero Alto",
        "Las Terrenas",
        "Santo Domingo",
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        setStatus("loading");
        setMessage("");
        setEmailFailedWarning(false);

        const formEl = e.currentTarget;
        const formData = new FormData(formEl);

        const fullName = String(formData.get("fullName") || "").trim();
        const companyName = String(formData.get("companyName") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const phone = String(formData.get("phone") || "").trim();

        const selectedRegions = regions.filter((r) => formData.get(`region_${r}`) === "on");
        const regionString = selectedRegions.length > 0 ? selectedRegions.join(", ") : "No especificada";
        const additionalNotes = String(formData.get("additionalNotes") || "").trim();

        const budget =
            activeTab === "oportunidad"
                ? String(formData.get("opp_budget") || "").trim()
                : String(formData.get("hotel_budget") || "").trim();

        const details: Record<string, string> =
            activeTab === "oportunidad"
                ? {
                      property_type: String(formData.get("opp_type") || ""),
                      physical_state: String(formData.get("opp_state") || ""),
                      discount: String(formData.get("opp_discount") || ""),
                      strategy: String(formData.get("opp_strategy") || ""),
                  }
                : {
                      environment: String(formData.get("hotel_environment") || ""),
                      rooms: String(formData.get("hotel_rooms") || ""),
                      operator: String(formData.get("hotel_operator") || ""),
                      objective: String(formData.get("hotel_objective") || ""),
                  };

        let compiledMessage = `[REQUERIMIENTO DE BÚSQUEDA PRIVADA OFF-MARKET]\n`;
        compiledMessage += `Nombre: ${fullName}\n`;
        compiledMessage += `Empresa: ${companyName || "No especificada"}\n`;
        compiledMessage += `Email: ${email}\n`;
        compiledMessage += `Teléfono: ${phone}\n\n`;

        if (activeTab === "oportunidad") {
            compiledMessage += `--- PROPIEDADES DE OPORTUNIDAD Y REMATES ---\n`;
            compiledMessage += `Presupuesto: ${budget}\n`;
            compiledMessage += `Tipo de Propiedad: ${details.property_type}\n`;
            compiledMessage += `Estado Físico: ${details.physical_state}\n`;
            compiledMessage += `Descuento Exigido: ${details.discount}\n`;
            compiledMessage += `Estrategia: ${details.strategy}\n`;
        } else {
            compiledMessage += `--- HOTELES, RESORTS Y TERRENOS ---\n`;
            compiledMessage += `Presupuesto: ${budget}\n`;
            compiledMessage += `Entorno / Naturaleza: ${details.environment}\n`;
            compiledMessage += `Cantidad de Habitaciones: ${details.rooms}\n`;
            compiledMessage += `Preferencia de Operadora: ${details.operator}\n`;
            compiledMessage += `Objetivo Principal: ${details.objective}\n`;
        }
        compiledMessage += `\nRegiones de Interés: ${regionString}\n`;
        if (additionalNotes) {
            compiledMessage += `Comentarios: ${additionalNotes}\n`;
        }

        const idemKey = idemKeyRef.current || `om-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        idemKeyRef.current = idemKey;

        const simulateEmailFailure =
            typeof window !== "undefined" &&
            new URLSearchParams(window.location.search).get("simulate_email_failure") === "1";

        try {
            const res = await fetch("/api/off-market", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Idempotency-Key": idemKey,
                },
                body: JSON.stringify({
                    fullName,
                    companyName,
                    email,
                    phone,
                    activeTab,
                    budget,
                    regions: selectedRegions,
                    details,
                    freeText: additionalNotes,
                    compiledMessage,
                    lang: l,
                    website_url: String(formData.get("website_url") || ""),
                    form_loaded_at: String(formData.get("form_loaded_at") || ""),
                    idempotency_key: idemKey,
                    simulate_email_failure: simulateEmailFailure,
                }),
            });

            const result = await res.json().catch(() => ({}));
            if (res.ok && result?.success) {
                idemKeyRef.current = null;
                setStatus("success");
                setReferenceCode(result.reference_code || "");
                setEmailFailedWarning(Boolean(result.email_failed));
                setMessage(result.message || t.successMsg);
                formEl.reset();
            } else {
                setStatus("error");
                setMessage(result?.message || "Ocurrió un error. Por favor intente nuevamente.");
            }
        } catch {
            setStatus("error");
            setMessage("Ocurrió un error de conexión. Por favor intente nuevamente.");
        } finally {
            inFlightRef.current = false;
        }
    };

    const selectClassName =
        "w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none cursor-pointer";
    const labelClassName = "block text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2";

    return (
        <div className="w-full">
            {status === "success" && (
                <div
                    data-offmarket-confirmation="true"
                    data-offmarket-ref={referenceCode}
                    data-offmarket-email-failed={emailFailedWarning ? "true" : "false"}
                    className="bg-zinc-900 border border-[#d4af37]/30 p-8 md:p-12 rounded-xl text-center shadow-2xl"
                >
                    <div className="flex justify-center mb-6 text-[#d4af37]">
                        <FaCheckCircle aria-hidden="true" size={56} />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-4 uppercase tracking-widest">{t.received}</h3>
                    {referenceCode && (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37] font-mono text-sm font-bold mb-4">
                            <span>{l === "en" ? "Reference:" : l === "fr" ? "Référence :" : "Referencia:"}</span>
                            <span data-offmarket-ref-code="true">{referenceCode}</span>
                        </div>
                    )}
                    <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed max-w-2xl mx-auto">{message}</p>
                    {emailFailedWarning && (
                        <div
                            data-offmarket-email-warning="true"
                            className="max-w-xl mx-auto mb-6 p-4 rounded-lg bg-amber-950/60 border border-amber-500/50 text-amber-200 text-sm flex items-start gap-3 text-left"
                        >
                            <FaExclamationTriangle className="shrink-0 mt-0.5 text-amber-400" />
                            <span>
                                {l === "en"
                                    ? "Email delivery failed (simulated), but your Off-Market mandate request is safely persisted in the internal dashboard."
                                    : l === "fr"
                                    ? "L'envoi de l'e-mail a échoué (simulation), mais votre demande Off-Market a bien été enregistrée dans le tableau de bord interne."
                                    : "El envío de correo falló (simulación), pero tu solicitud Off-Market quedó resguardada correctamente en el panel interno."}
                            </span>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            setStatus("idle");
                            setMessage("");
                            setReferenceCode("");
                            setEmailFailedWarning(false);
                        }}
                        className="px-8 py-3 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-colors rounded-full font-semibold uppercase tracking-wider text-sm"
                    >
                        {t.sendAnother}
                    </button>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className={
                    status === "success"
                        ? "absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
                        : "bg-[#000000] border border-[#d4af37]/30 p-8 md:p-12 shadow-2xl relative overflow-hidden"
                }
            >
                <FormAntispamFields />
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                <div className="text-center mb-10">
                    <h3 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest mb-3">
                        {t.title}
                    </h3>
                    <div className="h-0.5 w-16 bg-[#d4af37] mx-auto mb-4"></div>
                    <p className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">{t.subtitle}</p>
                </div>

                {status === "error" && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-8 text-center text-sm">
                        {message}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 mb-10 relative z-10">
                    <button
                        type="button"
                        data-offmarket-tab="oportunidad"
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
                        data-offmarket-tab="hoteles"
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
                            <input
                                type="text"
                                name="fullName"
                                required
                                className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                                placeholder={placeholders.name}
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.company}</label>
                            <input
                                type="text"
                                name="companyName"
                                className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                                placeholder={placeholders.company}
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.email}</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                                placeholder={placeholders.email}
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.phone}</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                className="w-full bg-[#111111] border border-white/20 px-4 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <hr className="border-[#d4af37]/20" />

                    <div className={`space-y-8 ${activeTab === "oportunidad" ? "block" : "hidden"}`}>
                        <div>
                            <label className={labelClassName}>{t.fields.budget.label}</label>
                            <select
                                aria-label={t.fields.budget.label}
                                name="opp_budget"
                                required={activeTab === "oportunidad"}
                                className={selectClassName}
                            >
                                <option value="">{selectPrompt}</option>
                                {budgets.map((b, i) => (
                                    <option key={i} value={b}>
                                        {b}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.opportunityType.label}</label>
                            <select
                                aria-label={t.fields.opportunityType.label}
                                name="opp_type"
                                required={activeTab === "oportunidad"}
                                className={selectClassName}
                            >
                                {t.fields.opportunityType.options.map((opt: string, i: number) => (
                                    <option key={i} value={i === 0 ? "" : opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.oppPhysicalState.label}</label>
                            <select
                                aria-label={t.fields.oppPhysicalState.label}
                                name="opp_state"
                                required={activeTab === "oportunidad"}
                                className={selectClassName}
                            >
                                {t.fields.oppPhysicalState.options.map((s: string, i: number) => (
                                    <option key={i} value={i === 0 ? "" : s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.oppDiscount.label}</label>
                            <select
                                aria-label={t.fields.oppDiscount.label}
                                name="opp_discount"
                                required={activeTab === "oportunidad"}
                                className={selectClassName}
                            >
                                {t.fields.oppDiscount.options.map((d: string, i: number) => (
                                    <option key={i} value={i === 0 ? "" : d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.oppStrategy.label}</label>
                            <select
                                aria-label={t.fields.oppStrategy.label}
                                name="opp_strategy"
                                required={activeTab === "oportunidad"}
                                className={selectClassName}
                            >
                                {t.fields.oppStrategy.options.map((s: string, i: number) => (
                                    <option key={i} value={i === 0 ? "" : s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={`space-y-8 ${activeTab === "hoteles" ? "block" : "hidden"}`}>
                        <div>
                            <label className={labelClassName}>{t.fields.hotelBudgetLabel}</label>
                            <select
                                aria-label={t.fields.hotelBudgetLabel}
                                name="hotel_budget"
                                required={activeTab === "hoteles"}
                                className={selectClassName}
                            >
                                <option value="">{selectPrompt}</option>
                                {budgets.map((b, i) => (
                                    <option key={i} value={b}>
                                        {b}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.hotelEnvironment.label}</label>
                            <select
                                aria-label={t.fields.hotelEnvironment.label}
                                name="hotel_environment"
                                required={activeTab === "hoteles"}
                                className={selectClassName}
                            >
                                {t.fields.hotelEnvironment.options.map((e: string, i: number) => (
                                    <option key={i} value={i === 0 ? "" : e}>
                                        {e}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.hotelRooms.label}</label>
                            <select
                                aria-label={t.fields.hotelRooms.label}
                                name="hotel_rooms"
                                required={activeTab === "hoteles"}
                                className={selectClassName}
                            >
                                {t.fields.hotelRooms.options.map((r: string, i: number) => (
                                    <option key={i} value={i === 0 ? "" : r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.hotelOperator.label}</label>
                            <select
                                aria-label={t.fields.hotelOperator.label}
                                name="hotel_operator"
                                required={activeTab === "hoteles"}
                                className={selectClassName}
                            >
                                {t.fields.hotelOperator.options.map((o: string, i: number) => (
                                    <option key={i} value={i === 0 ? "" : o}>
                                        {o}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClassName}>{t.fields.hotelObjective.label}</label>
                            <select
                                aria-label={t.fields.hotelObjective.label}
                                name="hotel_objective"
                                required={activeTab === "hoteles"}
                                className={selectClassName}
                            >
                                {t.fields.hotelObjective.options.map((o: string, i: number) => (
                                    <option key={i} value={i === 0 ? "" : o}>
                                        {o}
                                    </option>
                                ))}
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
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="3"
                                                d="M5 13l4 4L19 7"
                                            ></path>
                                        </svg>
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                        {region}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="offmarket-notes" className={labelClassName}>
                            {l === "en"
                                ? "Additional Specifications / Message (Optional)"
                                : l === "fr"
                                ? "Spécifications Supplémentaires / Message (Optionnel)"
                                : "Especificaciones Adicionales / Mensaje Libre (Opcional)"}
                        </label>
                        <textarea
                            id="offmarket-notes"
                            name="additionalNotes"
                            data-offmarket-notes="true"
                            rows={3}
                            placeholder={
                                l === "en"
                                    ? "Share target ROI, timing, financing structure, or any confidential criteria..."
                                    : l === "fr"
                                    ? "Précisez votre objectif de rendement, calendrier, financement ou critères confidentiels..."
                                    : "Indique criterios de retorno, plazo de cierre, estructura o notas confidenciales..."
                            }
                            className="w-full bg-[#111111] border border-white/20 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors resize-none text-sm"
                        />
                    </div>

                    <div className="pt-8">
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            data-offmarket-submit="true"
                            className="w-full bg-[#d4af37] hover:bg-white text-black font-bold py-5 px-8 uppercase tracking-[0.2em] text-sm md:text-base transition-all duration-300 disabled:opacity-70 flex justify-center items-center shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                        >
                            {status === "loading" ? <FaSpinner className="animate-spin text-xl" /> : t.fields.submit}
                        </button>
                        {isSandbox ? (
                            <p
                                data-offmarket-local-disclaimer="true"
                                className="text-center text-xs text-gray-300 mt-6 leading-relaxed bg-[#111111] border border-[#d4af37]/30 px-4 py-3"
                            >
                                {l === "en" ? (
                                    <>
                                        <strong className="text-[#d4af37]">Isolated local mode:</strong> upon submission, your request is recorded with a tracking reference directly in the Dashboard local test inbox (no real emails are sent to clients or production).
                                    </>
                                ) : l === "fr" ? (
                                    <>
                                        <strong className="text-[#d4af37]">Mode local isolé :</strong> lors de l&apos;envoi, votre demande est enregistrée avec une référence de suivi directement dans la boîte de test locale du tableau de bord (aucun e-mail réel n&apos;est envoyé aux clients ni en production).
                                    </>
                                ) : (
                                    <>
                                        <strong className="text-[#d4af37]">Modo local aislado:</strong> al enviar este requerimiento, su solicitud queda registrada con código de referencia directamente en el buzón local de pruebas del Dashboard (sin envío de correos reales a clientes ni a producción).
                                    </>
                                )}
                            </p>
                        ) : (
                            <p className="text-center text-xs text-gray-400 mt-6">{t.fields.disclaimer}</p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
