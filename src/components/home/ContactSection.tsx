"use client";

import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { ScrollReveal } from "../ui/ScrollReveal";
import ContactForm from "@/components/contact/ContactForm";

interface ContactSectionProps {
    dict: {
        title: string;
        subtitle: string;
        form: {
            name: string;
            phone: string;
            email: string;
            message: string;
            send: string;
            sending: string;
            success: string;
            successText: string;
            placeholders: {
                name: string;
                email: string;
                message: string;
            };
        };
        info: {
            title: string;
            phone: string;
            email: string;
            office: string;
        };
    };
}

export function ContactSection({ dict }: ContactSectionProps) {
    // Reusing the same verified ContactForm component
    return (
        <section id="contact" className="pt-8 pb-10 lg:pt-12 lg:pb-24 bg-primary-black relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal width="100%">
                    <div className="text-center mb-8 lg:mb-16">
                        <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">
                            {dict.title}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6 font-serif">
                            {dict.subtitle}
                        </h2>
                        <div className="h-1 w-24 bg-luxury-gold mx-auto"></div>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info (unchanged visual) */}
                    <ScrollReveal delay={0.2} direction="right">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-8 font-serif">{dict.info.title}</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4 group">
                                    <div className="bg-white/5 p-4 rounded-full group-hover:bg-luxury-gold/20 transition-colors">
                                        <FaPhoneAlt className="text-luxury-gold text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">{dict.info.phone}</h4>
                                        <p className="text-gray-400 group-hover:text-white transition-colors">
                                            <a href="tel:+18294084322" className="text-luxury-gold hover:text-white transition-colors">+1 (829) 408-4322</a>
                                            <span className="mx-2 text-luxury-gold">/</span>
                                            <a href="tel:+18298044322" className="text-luxury-gold hover:text-white transition-colors">+1 (829) 804-4322</a>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="bg-white/5 p-4 rounded-full group-hover:bg-luxury-gold/20 transition-colors">
                                        <FaEnvelope className="text-luxury-gold text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">{dict.info.email}</h4>
                                        <p className="text-luxury-gold hover:text-white transition-colors">info@puntacanainvestmentsrd.com</p>
                                        <p className="text-luxury-gold hover:text-white transition-colors">ventas@puntacanainvestmentsrd.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="bg-white/5 p-4 rounded-full group-hover:bg-luxury-gold/20 transition-colors">
                                        <FaMapMarkerAlt className="text-luxury-gold text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-1">{dict.info.office}</h4>
                                        <p className="text-luxury-gold hover:text-white transition-colors">
                                            Avenida Barceló, Plaza Sol Bávaro,<br />
                                            2do Nivel, Suite 19,<br />
                                            Punta Cana, República Dominicana
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Contact Form */}
                    <ScrollReveal delay={0.4} direction="left">
                        <div className="bg-black/50 p-8 md:p-10 border border-white/10 rounded-lg shadow-2xl backdrop-blur-sm relative">
                            <ContactForm dict={dict.form} subject="Contact Section (Home)" />
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
