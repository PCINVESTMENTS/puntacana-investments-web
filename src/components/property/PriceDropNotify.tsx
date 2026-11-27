"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBell, FaCheck, FaTimes } from "react-icons/fa";

export default function PriceDropNotify({ lang, propertyTitle }: { lang: string; propertyTitle: string }) {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setTimeout(() => setShowModal(false), 2000);
        }
    };

    const l = lang === "en" || lang === "fr" ? lang : "es";
    const copy =
        l === "en"
            ? {
                  button: "Notify me of price drops",
                  active: "Alert Active",
                  close: "Close",
                  modalTitle: "Price Drop Alert",
                  modalDesc: `We will email you immediately if "${propertyTitle}" has a price reduction.`,
                  placeholder: "your-email@example.com",
                  confirm: "Confirm Alert",
                  footer: "Private VIP Insights • No Spam",
              }
            : l === "fr"
            ? {
                  button: "M'alerter si le prix baisse",
                  active: "Alerte Activée",
                  close: "Fermer",
                  modalTitle: "Alerte de Baisse de Prix",
                  modalDesc: `Nous vous informerons immédiatement par e-mail si le prix de « ${propertyTitle} » baisse.`,
                  placeholder: "votre-email@exemple.com",
                  confirm: "Confirmer l'Alerte",
                  footer: "Alertes VIP Privées • Sans Spam",
              }
            : {
                  button: "Avísame si baja de precio",
                  active: "Alerta Activada",
                  close: "Cerrar",
                  modalTitle: "Alerta de Precio",
                  modalDesc: `Te avisaremos por email de inmediato si "${propertyTitle}" tiene una reducción de precio.`,
                  placeholder: "tu-correo@ejemplo.com",
                  confirm: "Confirmar Alerta",
                  footer: "Alertas VIP Privadas • Sin Spam",
              };

    return (
        <div className="mt-8 border-t border-white/10 pt-8" data-price-drop-notify="true" data-lang={l}>
            {!isSubscribed ? (
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full flex items-center justify-center gap-2 text-luxury-gold hover:text-white transition-colors text-sm font-bold uppercase tracking-widest border border-luxury-gold/30 p-4 rounded hover:border-luxury-gold"
                >
                    <FaBell /> {copy.button}
                </button>
            ) : (
                <div className="flex items-center justify-center gap-2 text-green-500 text-sm font-bold uppercase tracking-widest bg-green-500/10 p-4 rounded border border-green-500/30">
                    <FaCheck /> {copy.active}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-dark-gray border border-luxury-gold/30 p-8 rounded-2xl w-full max-w-md shadow-2xl"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white"
                                title={copy.close}
                                aria-label={copy.close}
                            >
                                <FaTimes />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-luxury-gold/20 text-luxury-gold rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                                    <FaBell />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                                    {copy.modalTitle}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {copy.modalDesc}
                                </p>
                            </div>

                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={copy.placeholder}
                                    className="w-full bg-black border border-white/10 p-4 rounded text-white focus:border-luxury-gold outline-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-luxury-gold text-black font-bold py-4 uppercase tracking-widest hover:bg-white transition-colors shadow-lg"
                                >
                                    {copy.confirm}
                                </button>
                            </form>

                            <p className="text-[10px] text-gray-600 uppercase text-center mt-6 tracking-widest font-bold">
                                {copy.footer}
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
