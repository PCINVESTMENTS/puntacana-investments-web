"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaRegPaperPlane, FaUserTie, FaCheckCircle } from "react-icons/fa";

export default function AIAssistant({ lang }: { lang: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [showHandoffForm, setShowHandoffForm] = useState(false);
    const [handoffSending, setHandoffSending] = useState(false);
    const [handoffResult, setHandoffResult] = useState<{ code: string; message: string } | null>(null);
    const [handoffError, setHandoffError] = useState("");
    const [handoffForm, setHandoffForm] = useState({
        name: "",
        email: "",
        phone: "",
        budget: "",
        zone: "",
        property_query: "",
    });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const initialMsg = lang === "en"
                ? "Hello! I am your Punta Cana Investment Assistant. Tell me your budget, preferred zone, or property of interest and I can connect you with a human advisor with your full history."
                : lang === "fr"
                ? "Bonjour ! Je suis votre Assistant d'Investissement à Punta Cana. Indiquez-moi votre budget, zone ou propriété souhaitée pour vous connecter avec un conseiller."
                : "¡Hola! Soy tu Asistente de Inversión en Punta Cana. Cuéntame tu presupuesto, zona o propiedad de interés y, cuando desees, te conecto con un asesor humano con todo tu historial.";

            setMessages([{ role: "assistant", content: initialMsg }]);
        }
    }, [isOpen, lang, messages.length]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, showHandoffForm]);

    const extractContextFromUserText = (text: string) => {
        const updates: Partial<typeof handoffForm> = {};
        const budgetMatch = text.match(/(?:us\$|\$|usd|presupuesto|budget)[^0-9]{0,12}([0-9][0-9.,]{2,}(?:\s?[kmM])?)/i);
        if (budgetMatch) {
            updates.budget = budgetMatch[1].trim();
        }
        const lower = text.toLowerCase();
        if (lower.includes("puntacana resort") || lower.includes("punta cana resort")) updates.zone = "Puntacana Resort & Club";
        else if (lower.includes("cap cana")) updates.zone = "Cap Cana";
        else if (lower.includes("white sands") || lower.includes("bávaro") || lower.includes("bavaro")) updates.zone = "White Sands / Bávaro";
        else if (lower.includes("miches")) updates.zone = "Miches";
        else if (lower.includes("vista cana")) updates.zone = "Vista Cana";

        if (lower.includes("jaguey") || lower.includes("#35") || lower.includes("vil-pcr-vj3-35")) {
            updates.property_query = "Villa Jaguey #35 (VIL-PCR-VJ3-35)";
        } else if (lower.includes("perla del mar") || lower.includes("#36") || lower.includes("vil-ws-pmr-36")) {
            updates.property_query = "Villa Perla del Mar #36 (VIL-WS-PMR-36)";
        } else if (lower.includes("cruise on land") || lower.includes("#4")) {
            updates.property_query = "Condos Cruise On Land #4 (CH-PC-COL-4)";
        }
        if (Object.keys(updates).length > 0) {
            setHandoffForm((prev) => ({
                ...prev,
                budget: prev.budget || updates.budget || "",
                zone: prev.zone || updates.zone || "",
                property_query: prev.property_query || updates.property_query || "",
            }));
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        extractContextFromUserText(userMsg);
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInput("");

        setTimeout(() => {
            let response = "";
            const lowerMsg = userMsg.toLowerCase();

            if (lowerMsg.includes("asesor") || lowerMsg.includes("humano") || lowerMsg.includes("advisor") || lowerMsg.includes("conseiller")) {
                response = lang === "en"
                    ? "I am opening the advisor handoff form below so our human team receives your full conversation, budget, zone, and property immediately."
                    : "Perfecto. Abro el formulario de transferencia aquí abajo para que un asesor humano reciba de inmediato todo tu historial, presupuesto, zona y propiedad.";
                setShowHandoffForm(true);
            } else if (lowerMsg.includes("roi") || lowerMsg.includes("retorno") || lowerMsg.includes("profit")) {
                response = lang === "en"
                    ? "In Punta Cana, average ROI ranges from 6% to 10% annually for short-term rentals. In premium areas like Cap Cana, it can go higher for luxury villas."
                    : "En Punta Cana, el ROI promedio oscila entre el 6% y el 10% anual para rentas a corto plazo. En zonas premium como Cap Cana y Puntacana Resort, puede ser mayor en villas de lujo.";
            } else if (lowerMsg.includes("confotur") || lowerMsg.includes("tax") || lowerMsg.includes("impuesto")) {
                response = lang === "en"
                    ? "The CONFOTUR law offers 15 years of property tax (IPI) exemption and 0% transfer tax for approved projects."
                    : "La ley CONFOTUR ofrece 15 años de exención de impuesto a la propiedad (IPI) y 0% de impuesto de transferencia para proyectos aprobados.";
            } else if (lowerMsg.includes("presupuesto") || lowerMsg.includes("budget") || lowerMsg.includes("villa") || lowerMsg.includes("zona") || lowerMsg.includes("jaguey") || lowerMsg.includes("perla")) {
                response = lang === "en"
                    ? "Got it — I noted your budget, zone, and property interest. Click 'Talk to Human Advisor' below whenever you want an advisor to take over with this full context."
                    : "Excelente, ya registré tu presupuesto, zona y propiedad de interés. Pulsa «Hablar con un Asesor» aquí abajo cuando quieras que un asesor continúe con todo este historial.";
            } else {
                response = lang === "en"
                    ? "Great question. I can connect you with one of our human expert advisors with your chat context. Click 'Talk to Human Advisor' below."
                    : "Excelente consulta. Puedo transferir todo este historial a uno de nuestros asesores humanos. Pulsa «Hablar con un Asesor» para continuar.";
            }

            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        }, 400);
    };

    const handleHandoffSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!handoffForm.name.trim() || !handoffForm.email.trim()) return;
        setHandoffSending(true);
        setHandoffError("");
        try {
            const sessionId = `web-ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            const res = await fetch("/api/chatbot-handoff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: sessionId,
                    name: handoffForm.name.trim(),
                    email: handoffForm.email.trim(),
                    phone: handoffForm.phone.trim(),
                    budget: handoffForm.budget.trim(),
                    zone: handoffForm.zone.trim(),
                    property_query: handoffForm.property_query.trim(),
                    messages,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data?.error || "No se pudo transferir al asesor.");
            }
            const code = data?.inquiry?.inquiry_code || "INQ-AI";
            setHandoffResult({
                code,
                message: `Historial transferido al Centro de Mando bajo ${code}. Un asesor continuará desde este punto.`,
            });
            setShowHandoffForm(false);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `Tu conversación y contexto (presupuesto, zona y propiedad) fueron transferidos al asesor bajo la referencia ${code}.`,
                },
            ]);
        } catch (err: any) {
            setHandoffError(err?.message || "Error al conectar con un asesor.");
        } finally {
            setHandoffSending(false);
        }
    };

    return (
        <>
            {/* Bubble */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                data-ai-assistant-toggle="true"
                className="fixed bottom-6 right-6 z-[1000] w-16 h-16 bg-luxury-gold text-black rounded-full shadow-2xl flex items-center justify-center text-2xl border-2 border-black"
                title={isOpen ? "Cerrar asistente" : "Abrir asistente AI"}
                aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente AI"}
            >
                {isOpen ? <FaTimes /> : <FaRobot />}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-ping"></div>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        data-ai-assistant-window="true"
                        className="fixed bottom-24 right-6 z-[1000] w-[360px] max-w-[92vw] h-[540px] bg-dark-gray border border-luxury-gold/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="bg-luxury-gold p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-black p-2 rounded-full text-luxury-gold">
                                    <FaRobot />
                                </div>
                                <div className="text-black uppercase text-xs font-bold tracking-widest">
                                    AI Assistant · PCI
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-black" title="Cerrar chat" aria-label="Cerrar chat">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/50 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === "assistant" ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${msg.role === "assistant"
                                        ? "bg-dark-gray text-gray-200 border border-white/10 rounded-tl-none"
                                        : "bg-luxury-gold text-black font-medium rounded-tr-none"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {handoffResult && (
                                <div data-ai-handoff-confirmation={handoffResult.code} className="p-3 rounded-xl bg-green-950/70 border border-green-500/40 text-green-200 text-xs space-y-1">
                                    <div className="font-bold flex items-center gap-1.5 text-green-300">
                                        <FaCheckCircle /> Transferido · {handoffResult.code}
                                    </div>
                                    <p>{handoffResult.message}</p>
                                </div>
                            )}

                            {showHandoffForm && !handoffResult && (
                                <form onSubmit={handleHandoffSubmit} data-ai-handoff-form="true" className="p-3 rounded-xl bg-zinc-900 border border-luxury-gold/40 space-y-2 text-xs">
                                    <p className="font-bold text-luxury-gold uppercase tracking-wider text-[10px]">
                                        Transferir historial a un asesor humano
                                    </p>
                                    {handoffError && <p className="text-red-300 text-[11px]">{handoffError}</p>}
                                    <input
                                        type="text"
                                        required
                                        placeholder="Tu nombre completo"
                                        value={handoffForm.name}
                                        onChange={(e) => setHandoffForm({ ...handoffForm, name: e.target.value })}
                                        className="w-full bg-black border border-white/15 rounded px-2.5 py-1.5 text-white"
                                    />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Tu correo electrónico"
                                        value={handoffForm.email}
                                        onChange={(e) => setHandoffForm({ ...handoffForm, email: e.target.value })}
                                        className="w-full bg-black border border-white/15 rounded px-2.5 py-1.5 text-white"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Teléfono / WhatsApp"
                                        value={handoffForm.phone}
                                        onChange={(e) => setHandoffForm({ ...handoffForm, phone: e.target.value })}
                                        className="w-full bg-black border border-white/15 rounded px-2.5 py-1.5 text-white"
                                    />
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <input
                                            type="text"
                                            placeholder="Presupuesto (USD)"
                                            value={handoffForm.budget}
                                            onChange={(e) => setHandoffForm({ ...handoffForm, budget: e.target.value })}
                                            className="bg-black border border-white/15 rounded px-2 py-1.5 text-white"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Zona"
                                            value={handoffForm.zone}
                                            onChange={(e) => setHandoffForm({ ...handoffForm, zone: e.target.value })}
                                            className="bg-black border border-white/15 rounded px-2 py-1.5 text-white"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Propiedad de interés"
                                        value={handoffForm.property_query}
                                        onChange={(e) => setHandoffForm({ ...handoffForm, property_query: e.target.value })}
                                        className="w-full bg-black border border-white/15 rounded px-2.5 py-1.5 text-white"
                                    />
                                    <button
                                        type="submit"
                                        disabled={handoffSending}
                                        data-ai-handoff-submit="true"
                                        className="w-full bg-luxury-gold text-black font-bold py-2 rounded hover:bg-white transition-colors"
                                    >
                                        {handoffSending ? "Transfiriendo..." : "Enviar historial al asesor"}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-dark-gray border-t border-white/10 space-y-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    data-ai-assistant-input="true"
                                    placeholder={lang === "en" ? "Type budget, zone or property..." : "Indica presupuesto, zona o propiedad..."}
                                    className="flex-1 bg-black border border-white/10 rounded-full px-3.5 py-2 text-xs text-white focus:border-luxury-gold outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    data-ai-assistant-send="true"
                                    className="bg-luxury-gold text-black w-9 h-9 rounded-full flex items-center justify-center hover:bg-white transition-colors shrink-0"
                                    title="Enviar mensaje"
                                    aria-label="Enviar mensaje"
                                >
                                    <FaRegPaperPlane />
                                </button>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                                    {["ROI", "CONFOTUR"].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => { setInput(tag); }}
                                            className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 hover:border-luxury-gold hover:text-luxury-gold whitespace-nowrap"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                {!handoffResult && (
                                    <button
                                        onClick={() => setShowHandoffForm((v) => !v)}
                                        data-ai-handoff-trigger="true"
                                        className="text-[10px] uppercase font-bold text-black bg-luxury-gold px-2.5 py-1 rounded-full hover:bg-white transition-colors inline-flex items-center gap-1 whitespace-nowrap"
                                    >
                                        <FaUserTie /> {lang === "en" ? "Talk to Advisor" : "Hablar con Asesor"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
