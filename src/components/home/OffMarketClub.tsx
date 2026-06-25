"use client";

import { motion } from "framer-motion";
import { FaLock, FaUserSecret, FaGem } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function OffMarketClub({ lang }: { lang: string }) {
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
                            src="/images/og-home-luxury.webp"
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
                                    <FaLock aria-hidden="true" className="text-luxury-gold" /> {lang === "en" ? "Private Listings" : lang === "fr" ? "Annonces Privées" : "Listados Privados"}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <FaGem aria-hidden="true" className="text-luxury-gold" /> {lang === "en" ? "Priority Alerts" : lang === "fr" ? "Alertes Prioritaires" : "Alertas Prioritarias"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Side */}
                    <div className="lg:w-1/2 p-6 lg:p-12 bg-black/70 flex flex-col justify-center items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-sm mx-auto"
                        >
                            <div className="mb-8">
                                <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center text-luxury-gold text-2xl mx-auto mb-6">
                                    <FaUserSecret aria-hidden="true" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    {lang === "en" ? "Unlock the Secret Portfolio" : lang === "fr" ? "Déverrouillez le Portefeuille Secret" : "Desbloquea el Portafolio Secreto"}
                                </h3>
                                <p className="text-gray-400 text-sm italic mb-10 leading-relaxed">
                                    {lang === "en" ? "Looking to acquire an operational hotel, develop a macro-project, or capitalize on foreclosures and opportunity properties? You are in the right ecosystem." : lang === "fr" ? "Cherchez-vous à acquérir un complexe hôtelier, à développer un macro-projet ou à capitaliser sur des saisies et des propriétés d'opportunité ? Vous êtes dans le bon écosystème." : "¿Busca adquirir un complejo hotelero, desarrollar un macro-proyecto, o capitalizar sobre propiedades de oportunidad y remates bancarios? Está en el ecosistema correcto."}
                                </p>
                            </div>

                            <Link
                                href={`/${lang}/investments/off-market`}
                                className="block w-full bg-luxury-gold text-black font-bold py-5 px-6 uppercase tracking-[0.2em] text-sm hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                            >
                                {lang === "en" ? "Access Private Portfolio" : lang === "fr" ? "Accéder au Portefeuille Privé" : "Acceder al Portafolio Privado"}
                            </Link>
                            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mt-6">
                                {lang === "en" ? "Institutional Verification Required. 100% Confidential." : lang === "fr" ? "Vérification Institutionnelle Requise. 100% Confidentiel." : "Verificación Institucional Requerida. 100% Confidencial."}
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
