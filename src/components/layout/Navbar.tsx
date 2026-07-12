"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

interface NavbarProps {
    dict: {
        home: string;
        properties: string;
        projects: string;
        locations: string;
        about: string;
        blog: string;
        contact: string;
        services: string;
        investments: string;
        flyAndBuy: string;
        rent: string;
        sale: string;
        // Add minimal types for safety, though full dict is passed
        [key: string]: any;
    };
    lang: string;
    servicesList?: readonly { title: string; slug: string }[];
    propertyTypes?: {
        condo: string;
        villa: string;
        land: string;
        commercial: string;
        [key: string]: string; // Fallback
    };
    variant?: 'transparent' | 'solid';
}

export default function Navbar({ dict, lang, servicesList = [], propertyTypes, variant = 'transparent' }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fallback if not passed
    const types = propertyTypes || {
        condo: "Condos",
        villa: "Villas",
        land: "Land",
        commercial: "Commercial",
        condohotel: "Condo-Hotel",
        resorts: "Hotels & Resorts"
    };

    const menuItems = [
        {
            name: dict.properties,
            hasDropdown: true,
            href: `/${lang}/properties`,
            subItems: [
                { label: types.villa, href: `/${lang}/properties?type=villa` },
                { label: types.condo, href: `/${lang}/properties?type=condo` },
                { label: types.land_beach || (lang === 'en' ? "Beachfront Land" : lang === 'fr' ? "Terrains avec Plage" : "Terrenos con Playa"), href: `/${lang}/properties?type=land-beach` },
                { label: types.land, href: `/${lang}/properties?type=land` },
                { label: types.commercial, href: `/${lang}/properties?type=commercial` },
                { label: dict.rent, href: `/${lang}/properties?status=rent` },
            ]
        },
        {
            name: dict.projects,
            hasDropdown: true,
            href: `/${lang}/properties?project=true`,
            subItems: [
                { label: types.projects_villas || (lang === 'en' ? "Villa Projects" : lang === 'fr' ? "Projets de Villas" : "Proyectos de Villas"), href: `/${lang}/properties?type=villa&project=true` },
                { label: types.projects_apartments || (lang === 'en' ? "Apartment Projects" : lang === 'fr' ? "Projets d'Appartements" : "Proyectos de Apartamentos"), href: `/${lang}/properties?type=condo&project=true` },
                { label: types.projects_land || (lang === 'en' ? "Land Projects" : lang === 'fr' ? "Projets de Terrains" : "Proyectos de Terrenos"), href: `/${lang}/properties?type=land&project=true` },
                { label: types.condohotel, href: `/${lang}/properties?type=condohotel&project=true` },
                { label: types.resorts, href: `/${lang}/properties?type=resorts&project=true` },
                { label: lang === 'en' ? "Future Projects" : lang === 'fr' ? "Projets Futurs" : "Futuros Proyectos", href: `/${lang}/futuros-proyectos` },
            ]
        },
        {
            name: dict.investments,
            hasDropdown: true,
            href: `/${lang}/investments`,
            subItems: [
                { label: dict.investments, href: `/${lang}/investments` },
                { label: dict.offMarket || "Off-Market", href: `/${lang}/investments/off-market` },
                { label: dict.dueDiligence, href: `/${lang}/investments/due-diligence` },
                { label: dict.flyAndBuy, href: `/${lang}/fly-and-buy` }
            ]
        },
        {
            name: dict.services,
            hasDropdown: true,
            href: `/${lang}/services`,
            subItems: servicesList.length > 0 ? servicesList.map(s => ({
                label: s.title,
                href: `/${lang}/services/${s.slug}`
            })) : []
        },
        { 
            name: dict.about, 
            hasDropdown: false, 
            href: `/${lang}#about` 
        },
        {
            name: lang === 'es' ? 'Partners' : 'Partners',
            hasDropdown: false,
            href: `/${lang}/partners`
        },
        { name: dict.contact, hasDropdown: false, href: `/${lang}/contact` },
        { name: dict.blog, hasDropdown: false, href: `/${lang}/blog` },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 print:hidden ${scrolled || isOpen || variant === 'solid'
                ? "bg-primary-black/95 backdrop-blur-md border-b border-white/10 shadow-2xl"
                : "bg-gradient-to-b from-black/[0.17] to-transparent border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 lg:h-24">
                    {/* Unified Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <Link
                            href={`/${lang}`}
                            onClick={() => {
                                if (window.location.pathname === `/${lang}`) {
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                                setIsOpen(false);
                            }}
                            className="flex items-center justify-start transition-all duration-300 hover:opacity-90 group gap-2"
                        >
                            <Image
                                src="/images/logo-pci-investments-gold.webp"
                                alt="Punta Cana Investments"
                                width={120}
                                height={120}
                                className="w-[60px] h-[60px] sm:w-20 sm:h-20 xl:w-24 xl:h-24 object-contain"
                                priority={true}
                                fetchPriority="high"
                                sizes="(max-width: 640px) 60px, (max-width: 1280px) 80px, 96px"
                            />
                            <Image
                                src="/images/logo-pci-construction-gold.webp"
                                alt="PCI Construction Group"
                                width={120}
                                height={120}
                                className="w-[60px] h-[60px] sm:w-20 sm:h-20 xl:w-24 xl:h-24 object-contain"
                                priority={true}
                                fetchPriority="high"
                                sizes="(max-width: 640px) 60px, (max-width: 1280px) 80px, 96px"
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu - Pushed to right by flex spacer or justify-between */}
                    {/* We need to ensure the layout still works. Default was justify-between. */}
                    {/* The logo is now absolute on mobile, static on desktop. 
                        On desktop, it takes space. On mobile, it floats.
                    */}

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-x-2 xl:gap-x-6">
                        {menuItems.map((item) => {
                            const shouldDisablePrefetch = ['projects', 'hotels', 'services', 'investments', 'about', 'blog'].some(p => item.href.includes(p));
                            return (
                            <div key={item.name} className="relative group">
                                <Link
                                    href={item.href || "#"}
                                    prefetch={false}
                                    className="text-white hover:text-luxury-gold px-1 py-4 text-[10px] xl:text-xs font-bold transition-colors uppercase tracking-wider flex items-center gap-1 group-hover:text-luxury-gold whitespace-nowrap"
                                >
                                    {item.name}
                                    {item.hasDropdown && <FaChevronDown aria-hidden="true" className="text-[10px] transition-transform group-hover:rotate-180" />}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.hasDropdown && item.subItems && (
                                    <div className="absolute top-full left-0 w-56 bg-primary-black border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 pt-2">
                                        <div className="bg-primary-black border-t-2 border-luxury-gold flex flex-col">
                                            {item.subItems.map((subItem) => {
                                                const subShouldDisable = ['projects', 'hotels', 'services', 'investments', 'about', 'blog'].some(p => subItem.href.includes(p));
                                                return (
                                                <Link
                                                    key={subItem.label}
                                                    href={subItem.href}
                                                    prefetch={false}
                                                    className="px-6 py-3 text-sm text-gray-300 hover:bg-luxury-gold hover:text-black transition-colors uppercase tracking-wider font-semibold border-b border-white/5 last:border-0"
                                                >
                                                    {subItem.label}
                                                </Link>
                                            )})}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )})}
                        {/* Language Switcher */}
                        <div className="flex gap-2 text-xs font-bold text-white border-l border-white/20 pl-4 ml-2">
                            <Link href="/es" className={`hover:text-luxury-gold ${lang === 'es' ? 'text-luxury-gold' : ''}`}>ES</Link>
                            <Link href="/en" className={`hover:text-luxury-gold ${lang === 'en' ? 'text-luxury-gold' : ''}`}>EN</Link>
                            <Link href="/fr" className={`hover:text-luxury-gold ${lang === 'fr' ? 'text-luxury-gold' : ''}`}>FR</Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            className="text-luxury-gold hover:text-white focus:outline-none text-2xl transition-transform p-3 -mr-3"
                        >
                            {isOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden bg-dark-gray border-t border-white/10 absolute w-full left-0 transition-all duration-300 ease-in-out transform ${isOpen ? "translate-y-0 opacity-100 visible h-screen overflow-y-auto" : "-translate-y-10 opacity-0 invisible h-0 overflow-hidden"
                    }`}
            >
                <div className="px-4 pt-2 pb-24 space-y-1">
                    {menuItems.map((item) => {
                        const shouldDisablePrefetch = ['projects', 'hotels', 'services', 'investments', 'about', 'blog'].some(p => item.href.includes(p));
                        return (
                        <div key={item.name} className="border-b border-white/5 last:border-0">
                            <Link
                                href={item.href || "#"}
                                prefetch={false}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-5 text-base font-bold text-gray-300 hover:text-luxury-gold uppercase tracking-wider flex justify-between items-center"
                            >
                                {item.name}
                                {item.hasDropdown && <FaChevronDown aria-hidden="true" className="text-xs" />}
                            </Link>
                            {item.hasDropdown && item.subItems && (
                                <div className="pl-6 bg-black/20 pb-2">
                                    {item.subItems.map((subItem) => {
                                        return (
                                        <Link
                                            key={subItem.label}
                                            href={subItem.href}
                                            prefetch={false}
                                            onClick={() => setIsOpen(false)}
                                            className="block py-4 text-sm text-gray-400 hover:text-luxury-gold uppercase tracking-wide min-h-[48px] flex items-center"
                                        >
                                            {subItem.label}
                                        </Link>
                                    )})}
                                </div>
                            )}
                        </div>
                    )})}
                    <div className="p-4 flex gap-8 justify-center mt-6">
                        <Link href="/es" className={`text-lg font-bold p-4 ${lang === 'es' ? 'text-luxury-gold' : 'text-white'}`}>ESPAÑOL</Link>
                        <Link href="/en" className={`text-lg font-bold p-4 ${lang === 'en' ? 'text-luxury-gold' : 'text-white'}`}>ENGLISH</Link>
                        <Link href="/fr" className={`text-lg font-bold p-4 ${lang === 'fr' ? 'text-luxury-gold' : 'text-white'}`}>FRANÇAIS</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
