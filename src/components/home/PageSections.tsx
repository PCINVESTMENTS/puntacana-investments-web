"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCrown, FaArrowRight, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { ScrollReveal } from "../ui/ScrollReveal";

interface AboutSectionProps {
    dict: {
        title: string;
        mission: string;
        missionText: string;
        vision: string;
        visionText: string;
        values: string;
        essence: string;
        ceoRole: string;
        valuesList: readonly {
            title: string;
            description: string;
        }[];
    };
}

// Basic icons for values
import { FaGem, FaHandshake, FaChartLine } from "react-icons/fa";

export function AboutSection({ dict }: AboutSectionProps) {
    return (
        <section id="about" className="pt-20 pb-20 bg-primary-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Left Column: Image (5 cols) */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative">
                            {/* Gold Border & offset frame */}
                            <div className="absolute top-4 -left-4 w-full h-full border-2 border-luxury-gold/30 z-0"></div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-luxury-gold/10 z-0 hidden md:block"></div>

                            {/* Image Container */}
                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm shadow-2xl">
                                <img
                                    src="/images/ceo-final.jpg"
                                    alt="Ulises Ubiera - CEO Punta Cana Investments"
                                    className="object-cover hover:scale-105 transition-transform duration-700 w-full h-full"
                                />

                                {/* Name Overlay (Bottom) */}
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-8 pt-24 text-center">
                                    <h3 className="text-3xl font-serif font-bold text-white tracking-wide">Ulises Ubiera</h3>
                                    <p className="text-luxury-gold text-sm font-bold uppercase tracking-[0.2em] mt-2">{dict.ceoRole}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content (7 cols) */}
                    <div className="lg:col-span-7 space-y-16">

                        {/* Header & Intro */}
                        <ScrollReveal>
                            <div>
                                <span className="text-luxury-gold uppercase tracking-[0.2em] text-xs font-semibold mb-3 block">{dict.essence}</span>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">{dict.title}</h2>
                                <div className="h-1 w-20 bg-luxury-gold mb-8"></div>
                            </div>
                        </ScrollReveal>

                        {/* Mission & Vision - Side by Side Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ScrollReveal delay={0.2} direction="up">
                                <div className="p-6 bg-white/5 border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300 rounded-sm h-full">
                                    <h3 className="text-2xl font-serif font-bold text-white mb-4 flex items-center gap-3">
                                        <span className="text-luxury-gold">✦</span> {dict.mission}
                                    </h3>
                                    <p className="text-gray-300 text-sm leading-relaxed text-justify opacity-90">
                                        {dict.missionText}
                                    </p>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={0.3} direction="up">
                                <div className="p-6 bg-white/5 border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300 rounded-sm h-full">
                                    <h3 className="text-2xl font-serif font-bold text-white mb-4 flex items-center gap-3">
                                        <span className="text-luxury-gold">✦</span> {dict.vision}
                                    </h3>
                                    <p className="text-gray-300 text-sm leading-relaxed text-justify opacity-90">
                                        {dict.visionText}
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Values Section */}
                        <ScrollReveal delay={0.4}>
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4 inline-block">{dict.values}</h3>

                                <div className="grid grid-cols-1 gap-6">
                                    {(dict.valuesList || []).map((value, index) => {
                                        // Assign icons based on index
                                        const Icon = index === 0 ? FaChartLine : index === 1 ? FaHandshake : FaGem;

                                        return (
                                            <div key={index} className="flex gap-4 group">
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/30 group-hover:bg-luxury-gold group-hover:text-black transition-all duration-300 text-luxury-gold">
                                                        <Icon size={18} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">{value.title}</h4>
                                                    <p className="text-gray-400 text-sm leading-relaxed text-justify">
                                                        {value.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </ScrollReveal>

                    </div>
                </div>
            </div>
        </section>
    );
}


interface LocationsSectionProps {
    dict: {
        title: string;
        subtitle: string;
        exploreMore: string;
        items?: readonly {
            title: string;
            slug: string;
            img: string;
        }[];
    };
    limit?: number;
    lang?: string;
}

export function LocationsSection({ dict, limit, lang = 'es' }: LocationsSectionProps) {
    // Fallback list to ensure content always renders
    const defaultLocations = [
        { title: "Punta Cana", slug: "puntacana", img: "/images/locations/bavaro.jpg" },
        { title: "Cap Cana", slug: "capcana", img: "/images/locations/cap_cana.jpg" },
        { title: "Bávaro", slug: "bavaro", img: "/images/locations/bavaro.jpg" },
        { title: "La Romana", slug: "laromana", img: "/images/locations/la_romana.png" },
        { title: "Casa de Campo", slug: "casacampo", img: "/images/locations/casa_de_campo.jpg" },
        { title: "Juan Dolio", slug: "juandolio", img: "/images/locations/juan_dolio.jpg" },
        { title: "Miches", slug: "miches", img: "/images/locations/miches.jpg" },
        { title: "El Seibo", slug: "elseibo", img: "/images/locations/el_seibo.jpg" },
        { title: "Higüey", slug: "higuey", img: "/images/locations/higuey.jpg" },
        { title: "Santo Domingo", slug: "santodomingo", img: "/images/locations/santo_domingo.jpg" },
        { title: "Las Terrenas", slug: "lasterrenas", img: "/images/locations/las_terrenas.jpg" },
        { title: "Samaná", slug: "samana", img: "/images/locations/samana.jpg" },
        { title: "Puerto Plata", slug: "puertoplata", img: "https://upcrealestate.com/wp-content/uploads/2023/02/1.jpg" }
    ];

    let locations = (dict.items && dict.items.length > 0) ? dict.items : defaultLocations;

    if (limit) {
        locations = locations.slice(0, limit);
    }

    return (
        <section id="locations" className="pt-12 pb-8 bg-primary-black text-center text-white relative">
            {/* Background Decoration - Optional to match other dark sections */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern.png')] opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <ScrollReveal width="100%">
                    <div className="mb-12">
                        <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">{dict.subtitle}</span>
                        <h2 className="text-4xl font-serif font-bold mt-2 text-white">{dict.title}</h2>
                    </div>
                </ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map((loc, idx) => (
                        <Link
                            key={idx}
                            href={`/${lang}/properties?location=${loc.slug}`}
                            className="group relative h-64 overflow-hidden cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 block"
                        >
                            <div className="absolute inset-0 bg-gray-200" />
                            <Image
                                src={loc.img}
                                alt={loc.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 z-20"></div>

                            <div className="absolute inset-0 flex items-center justify-center z-30">
                                <h3 className="text-3xl font-bold text-luxury-gold drop-shadow-md text-center px-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                                    {loc.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Explore More Button */}
                {limit && (
                    <div className="mt-12 text-center">
                        <Link
                            href={`/${lang}/locations`}
                            className="inline-block bg-luxury-gold text-black font-bold py-4 px-10 rounded-sm hover:bg-white transition-colors uppercase tracking-widest text-sm shadow-lg hover:shadow-xl"
                        >
                            {dict.exploreMore}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

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

// ... imports
import ContactForm from "@/components/contact/ContactForm";
import { submitNewsletter } from "@/app/actions/newsletter";
import { useActionState } from "react";

// ... (AboutSection and LocationsSection remain unchanged)

export function ContactSection({ dict }: ContactSectionProps) {
    // Reusing the same verified ContactForm component
    return (
        <section id="contact" className="pt-12 pb-24 bg-primary-black relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal width="100%">
                    <div className="text-center mb-16">
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
                                        <p className="text-luxury-gold hover:text-white transition-colors">info@puntacanainvesment.com</p>
                                        <p className="text-luxury-gold hover:text-white transition-colors">ventas@puntacanainvesment.com</p>
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

interface FooterProps {
    dict: any;
    lang: string;
}

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export function Footer({ dict, lang }: FooterProps) {
    const [state, formAction, isPending] = useActionState(submitNewsletter, { success: false, message: '' });

    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Address */}
                    <div className="space-y-6">
                        <Image
                            src="/images/pci-logo-new.png"
                            alt="Punta Cana Investments"
                            width={280}
                            height={280}
                            className="object-contain"
                        />
                    </div>

                    {/* Navigation - Column 1 */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                            Explorar
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href={`/${lang}/properties`} className="text-luxury-gold hover:text-white transition-colors">{dict.footer.links.properties}</Link></li>
                            <li><Link href={`/${lang}/projects`} className="text-luxury-gold hover:text-white transition-colors">{dict.footer.links.projects}</Link></li>
                            <li><Link href={`/${lang}/investments`} className="text-luxury-gold hover:text-white transition-colors">{dict.footer.links.investments}</Link></li>
                            <li><Link href={`/${lang}/hotels`} className="text-luxury-gold hover:text-white transition-colors">{dict.footer.links.hotels}</Link></li>
                        </ul>
                    </div>

                    {/* Navigation - Column 2 */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                            Empresa
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href={`/${lang}/services`} className="text-luxury-gold hover:text-white transition-colors">{dict.footer.links.services}</Link></li>
                            <li><Link href={`/${lang}/about`} className="text-luxury-gold hover:text-white transition-colors">{dict.footer.links.about}</Link></li>
                            <li><Link href={`/${lang}/contact`} className="text-luxury-gold hover:text-white transition-colors">{dict.footer.links.contact}</Link></li>
                            <li><Link href={`/${lang}/blog`} className="text-luxury-gold hover:text-white transition-colors">{dict.footer.links.blog}</Link></li>
                        </ul>
                    </div>

                    {/* Socials & Newsletter */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                            {dict.footer.socials}
                        </h4>
                        <div className="flex gap-4 mb-8">
                            {[FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-luxury-gold hover:text-black transition-all duration-300"
                                    aria-label={`Visit our ${Icon.name.replace('Fa', '')} page`}
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>

                        <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-sm">
                            {dict.footer.newsletter}
                        </h4>

                        {state.success ? (
                            <div className="text-green-400 text-sm animate-fade-in flex items-center gap-2">
                                <FaCheckCircle /> Subscribed!
                            </div>
                        ) : (
                            <form action={formAction} className="flex border border-white/20 p-1">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder={dict.footer.emailPlaceholder}
                                    className="bg-transparent text-white px-4 py-2 w-full focus:outline-none placeholder-gray-600 text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="bg-white/10 text-luxury-gold px-4 py-2 hover:bg-luxury-gold hover:text-black transition-colors disabled:opacity-50"
                                >
                                    {isPending ? <FaSpinner className="animate-spin" /> : <FaArrowRight />}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-4 md:mb-0">
                        © {new Date().getFullYear()} Punta Cana Investments. {dict.footer.rights}
                    </p>
                    <div className="text-gray-600 text-xs uppercase tracking-wider space-x-4">
                        <Link href={`/${lang}/privacy-policy`} className="hover:text-gray-400">{dict.footer.legal?.privacy || "Privacy Policy"}</Link>
                        <span>|</span>
                        <Link href={`/${lang}/terms-of-service`} className="hover:text-gray-400">{dict.footer.legal?.terms || "Terms of Service"}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
