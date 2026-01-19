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
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
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
            subItems: [
                { label: dict.rent, href: `/${lang}/properties?status=rent` },
                { label: dict.sale, href: `/${lang}/properties?status=sale` }
            ]
        },
        {
            name: dict.projects,
            hasDropdown: true,
            subItems: [
                { label: types.condo, href: `/${lang}?type=condo#properties` },
                { label: types.condohotel, href: `/${lang}?type=condohotel#properties` },
                { label: types.villa, href: `/${lang}?type=villa#properties` },
                { label: types.resorts, href: `/${lang}?type=resorts#properties` },
                { label: types.land, href: `/${lang}?type=land#properties` },
                { label: types.commercial, href: `/${lang}?type=commercial#properties` },
            ]
        },
        {
            name: dict.investments,
            hasDropdown: true,
            subItems: [
                { label: dict.investments, href: `/${lang}/investments` },
                { label: dict.dueDiligence, href: `/${lang}/investments/due-diligence` }
            ]
        },
        {
            name: dict.flyAndBuy,
            hasDropdown: false,
            href: `/${lang}/fly-and-buy`
        },
        {
            name: dict.services,
            hasDropdown: true,
            subItems: servicesList.length > 0 ? servicesList.map(s => ({
                label: s.title,
                href: `/${lang}/services/${s.slug}`
            })) : []
        },
        { name: dict.about, hasDropdown: false, href: `/${lang}#about` },
        { name: dict.contact, hasDropdown: false, href: `/${lang}/contact` },
        { name: dict.blog, hasDropdown: false, href: `/${lang}/blog` },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled || isOpen || variant === 'solid'
                ? "bg-primary-black/95 backdrop-blur-md border-b border-white/10 shadow-2xl"
                : "bg-gradient-to-b from-black/[0.17] to-transparent border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Mobile Menu Button - Left aligned on mobile for balance or keep right? 
                        User wants logo centered. Standard is often burger left or right. 
                        Let's put burger right (standard) and logo center.
                    */}

                    {/* Logo - Centered on Mobile, Left on Desktop */}
                    {/* Mobile Logo - Centered and Big */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:hidden">
                        <Link href={`/${lang}`} className="block relative h-20 w-[80vw] transition-all duration-300">
                            <Image
                                src="/images/pci-logo-new.png"
                                alt="Punta Cana Investments"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Logo - Original Layout (Left aligned, standard size) */}
                    <Link href={`/${lang}`} className="hidden lg:flex flex-shrink-0 items-center justify-start group relative h-24 w-80">
                        <Image
                            src="/images/pci-logo-new.png"
                            alt="Punta Cana Investments"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </Link>

                    {/* Desktop Menu - Pushed to right by flex spacer or justify-between */}
                    {/* We need to ensure the layout still works. Default was justify-between. */}
                    {/* The logo is now absolute on mobile, static on desktop. 
                        On desktop, it takes space. On mobile, it floats.
                    */}

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-x-2 xl:gap-x-6">
                        {menuItems.map((item) => (
                            <div key={item.name} className="relative group">
                                <Link
                                    href={item.href || "#"}
                                    className="text-white hover:text-luxury-gold px-1 py-4 text-[10px] xl:text-xs font-bold transition-colors uppercase tracking-wider flex items-center gap-1 group-hover:text-luxury-gold whitespace-nowrap"
                                >
                                    {item.name}
                                    {item.hasDropdown && <FaChevronDown className="text-[10px] transition-transform group-hover:rotate-180" />}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.hasDropdown && item.subItems && (
                                    <div className="absolute top-full left-0 w-56 bg-primary-black border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 pt-2">
                                        <div className="bg-primary-black border-t-2 border-luxury-gold flex flex-col">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.label}
                                                    href={subItem.href}
                                                    className="px-6 py-3 text-sm text-gray-300 hover:bg-luxury-gold hover:text-black transition-colors uppercase tracking-wider font-semibold border-b border-white/5 last:border-0"
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {/* Language Switcher */}
                        <div className="flex gap-2 text-xs font-bold text-white border-l border-white/20 pl-4 ml-2">
                            <Link href="/es" className={`hover:text-luxury-gold ${lang === 'es' ? 'text-luxury-gold' : ''}`}>ES</Link>
                            <Link href="/en" className={`hover:text-luxury-gold ${lang === 'en' ? 'text-luxury-gold' : ''}`}>EN</Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            className="text-luxury-gold hover:text-white focus:outline-none text-2xl transition-transform"
                        >
                            {isOpen ? <FaTimes /> : <FaBars />}
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
                    {menuItems.map((item) => (
                        <div key={item.name} className="border-b border-white/5 last:border-0">
                            <Link
                                href={item.href || "#"}
                                onClick={() => !item.hasDropdown && setIsOpen(false)}
                                className="block px-3 py-4 text-base font-bold text-gray-300 hover:text-luxury-gold uppercase tracking-wider flex justify-between items-center"
                            >
                                {item.name}
                                {item.hasDropdown && <FaChevronDown className="text-xs" />}
                            </Link>
                            {item.hasDropdown && item.subItems && (
                                <div className="pl-6 bg-black/20 pb-2">
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.label}
                                            href={subItem.href}
                                            onClick={() => setIsOpen(false)}
                                            className="block py-2 text-sm text-gray-400 hover:text-luxury-gold uppercase tracking-wide"
                                        >
                                            {subItem.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="p-4 flex gap-4 justify-center">
                        <Link href="/es" className={`text-lg font-bold ${lang === 'es' ? 'text-luxury-gold' : 'text-white'}`}>ESPAÑOL</Link>
                        <Link href="/en" className={`text-lg font-bold ${lang === 'en' ? 'text-luxury-gold' : 'text-white'}`}>ENGLISH</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
