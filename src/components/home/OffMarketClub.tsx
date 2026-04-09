"use client";

import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaUserSecret, FaGem, FaArrowRight, FaCheckCircle, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import { submitNewsletter } from "@/app/actions/newsletter";

export default function OffMarketClub({ lang }: { lang: string }) {
    const [state, formAction, isPending] = useActionState(submitNewsletter, { success: false, message: '' });

    return (
        <section className="py-10 lg:py-24 bg-black relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-luxury-gold/5 blur-[120px] rounded-full -ml-64 -mb-64"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-dark-gray border border-luxury-gold/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">

                    {/* Visual Side */}
                    <div className="lg:w-1/2 relative min-h-[400px]">
                        <Image
                            src="/images/og-home-luxury.jpg"
                            alt="Luxury Interior"
                            fill
                            className="object-cover opacity-60 grayscale-[40%]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-dark-gray/90 to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col justify-center p-6 lg:p-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="mb-6 flex items-center gap-3"
                            >
                                <div className="h-px w-8 bg-luxury-gold"></div>
                                <span className="text-luxury-gold uppercase tracking-[0.3em] text-xs font-bold leading-none">VIP Access</span>
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                                {lang === "en" ? "Off-Market Investment Club" : "Club de Inversores Off-Market"}
                            </h2>
                            <p className="text-gray-300 text-lg font-light max-w-md">
                                {lang === "en"
                                    ? "Access exclusive properties and pre-construction deals that never hit the public market."
                                    : "Accede a propiedades exclusivas y oportunidades de preventa que nunca llegan al mercado público."}
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <FaLock aria-hidden="true" className="text-luxury-gold" /> {lang === "en" ? "Private Listings" : "Listados Privados"}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <FaGem aria-hidden="true" className="text-luxury-gold" /> {lang === "en" ? "Priority Alerts" : "Alertas Prioritarias"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:w-1/2 p-6 lg:p-12 bg-black/70 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {!state.success ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="mb-8">
                                        <div className="w-12 h-12 bg-luxury-gold/10 rounded-full flex items-center justify-center text-luxury-gold text-xl mb-4">
                                            <FaUserSecret aria-hidden="true" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {lang === "en" ? "Unlock the Secret Portfolio" : "Desbloquea el Portafolio Secreto"}
                                        </h3>
                                        <p className="text-gray-400 text-sm italic">
                                            {lang === "en"
                                                ? "Join our elite circle of investors in the Dominican Republic."
                                                : "Únete a nuestro círculo élite de inversores en República Dominicana."}
                                        </p>
                                    </div>

                                    <form action={formAction} className="space-y-4">
                                        <input type="hidden" name="source" value="Off Market Club" />
                                        <div>
                                            <label htmlFor="email-offmarket" className="block text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-2">
                                                {lang === "en" ? "Professional Email" : "Email Profesional"}
                                            </label>
                                            <input
                                                id="email-offmarket"
                                                type="email"
                                                name="email"
                                                required
                                                autoComplete="email"
                                                placeholder="investor@domain.com"
                                                className="w-full bg-black border border-white/10 rounded p-4 text-white focus:border-luxury-gold outline-none transition-all placeholder:text-gray-500"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full bg-luxury-gold text-black font-bold py-4 uppercase tracking-[0.2em] text-sm hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50"
                                        >
                                            {isPending ? <FaSpinner aria-hidden="true" className="animate-spin mx-auto" /> : (lang === "en" ? "Get Instant Access" : "Obtener Acceso Instantáneo")}
                                        </button>
                                        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                                            {lang === "en" ? "No commitment required. 100% Confidential." : "Sin compromiso. 100% Confidencial."}
                                        </p>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                                        <FaCheckCircle aria-hidden="true" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">
                                        {lang === "en" ? "Welcome to the Club" : "Bienvenido al Club"}
                                    </h3>
                                    <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                                        {lang === "en"
                                            ? "We've sent the current off-market catalog to your email. An investment advisor will reach out shortly."
                                            : "Hemos enviado el catálogo off-market actual a tu email. Un asesor de inversión se pondrá en contacto pronto."}
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="text-luxury-gold uppercase tracking-widest text-xs font-bold hover:text-white transition-colors"
                                    >
                                        {lang === "en" ? "Return to Home" : "Volver al Inicio"}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}
