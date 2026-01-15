"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaTimes, FaRegPaperPlane, FaUserTie, FaQuestionCircle } from "react-icons/fa";

export default function AIAssistant({ lang }: { lang: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const initialMsg = lang === "en"
                ? "Hello! I am your Punta Cana Investment Assistant. How can I help you today? I can tell you about ROI, CONFOTUR tax benefits, or the best areas to invest."
                : "¡Hola! Soy tu Asistente de Inversión en Punta Cana. ¿En qué puedo ayudarte hoy? Puedo informarte sobre ROI, beneficios de la ley CONFOTUR o las mejores zonas para invertir.";

            setMessages([{ role: "assistant", content: initialMsg }]);
        }
    }, [isOpen, lang, messages.length]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInput("");

        // Simulation logic
        setTimeout(() => {
            let response = "";
            const lowerMsg = userMsg.toLowerCase();

            if (lowerMsg.includes("roi") || lowerMsg.includes("retorno") || lowerMsg.includes("profit")) {
                response = lang === "en"
                    ? "In Punta Cana, average ROI ranges from 6% to 10% annually for short-term rentals. In premium areas like Cap Cana, it can go higher for luxury villas."
                    : "En Punta Cana, el ROI promedio oscila entre el 6% y el 10% anual para rentas a corto plazo. En zonas premium como Cap Cana, puede ser mayor en villas de lujo.";
            } else if (lowerMsg.includes("confotur") || lowerMsg.includes("tax") || lowerMsg.includes("impuesto")) {
                response = lang === "en"
                    ? "The CONFOTUR law offers 15 years of property tax (IPI) exemption and 0% transfer tax for approved projects. It's the most powerful tool for investors in DR."
                    : "La ley CONFOTUR ofrece 15 años de exención de impuesto a la propiedad (IPI) y 0% de impuesto de transferencia para proyectos aprobados. Es la herramienta más potente para inversores en RD.";
            } else if (lowerMsg.includes("area") || lowerMsg.includes("zona") || lowerMsg.includes("ubica")) {
                response = lang === "en"
                    ? "Top areas right now are Cap Cana (Exclusivity), Downtown Punta Cana (Convenience), and Vista Cana (Growth). Miches is also an emerging hotspot."
                    : "Las mejores zonas ahora son Cap Cana (Exclusividad), Downtown Punta Cana (Conveniencia) y Vista Cana (Crecimiento). Miches es también un punto emergente.";
            } else {
                response = lang === "en"
                    ? "That's a great question. For more specific details, I can connect you with one of our human expert advisors. Would you like to schedule a call?"
                    : "Esa es una excelente pregunta. Para detalles más específicos, puedo conectarte con uno de nuestros asesores expertos humanos. ¿Te gustaría programar una llamada?";
            }

            setMessages(prev => [...prev, { role: "assistant", content: response }]);
        }, 800);
    };

    return (
        <>
            {/* Bubble */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
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
                        className="fixed bottom-24 right-6 z-[1000] w-[350px] h-[500px] bg-dark-gray border border-luxury-gold/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="bg-luxury-gold p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-black p-2 rounded-full text-luxury-gold">
                                    <FaRobot />
                                </div>
                                <div className="text-black uppercase text-xs font-bold tracking-widest">
                                    AI Assistant
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-black" title="Cerrar chat" aria-label="Cerrar chat">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/40 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === "assistant" ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                                >
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "assistant"
                                        ? "bg-dark-gray text-gray-200 border border-white/5 rounded-tl-none"
                                        : "bg-luxury-gold text-black font-medium rounded-tr-none"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-dark-gray border-t border-white/5">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder={lang === "en" ? "Type a message..." : "Escribe un mensaje..."}
                                    className="flex-1 bg-black border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:border-luxury-gold outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    className="bg-luxury-gold text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                                    title="Enviar mensaje"
                                    aria-label="Enviar mensaje"
                                >
                                    <FaRegPaperPlane />
                                </button>
                            </div>
                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {["ROI", "CONFOTUR", "Areas"].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => { setInput(tag); }}
                                        className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:border-luxury-gold hover:text-luxury-gold whitespace-nowrap"
                                        title={`Preguntar sobre ${tag}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
