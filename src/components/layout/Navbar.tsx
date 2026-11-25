"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaChevronDown, FaHeart } from "react-icons/fa";
import { useSiteConfig } from "@/components/layout/SiteConfigContext";
import { useFavorites } from "@/components/property/FavoritesContext";

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
    const pathname = usePathname();
    const siteConfig = useSiteConfig();
    const { count: favCount, setDrawerOpen } = useFavorites();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [querySuffix, setQuerySuffix] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setQuerySuffix(window.location.search || "");
        }
    }, [pathname]);

    const getLocalizedHref = (targetLang: "es" | "en" | "fr") => {
        if (!pathname) return `/${targetLang}${querySuffix}`;
        if (/^\/(es|en|fr)(\/|$)/.test(pathname)) {
            return `${pathname.replace(/^\/(es|en|fr)(\/|$)/, `/${targetLang}$2`)}${querySuffix}`;
        }
        return `/${targetLang}${pathname.startsWith("/") ? pathname : `/${pathname}`}${querySuffix}`;
    };

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

    // Resolve active ordered services from Fase 8 Gestor Web if configured
    const phase8Services = siteConfig?.services?.items;
    const effectiveServicesList =
        Array.isArray(phase8Services) && phase8Services.length > 0
            ? [...phase8Services]
                  .filter((s: any) => s && s.is_active !== false)
                  .sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999))
                  .map((s: any) => ({
                      title: s.title?.[lang] || s.title?.es || s.slug,
                      slug: (lang === 'en' ? s.slug_en : lang === 'fr' ? s.slug_fr : s.slug) || s.slug,
                  }))
            : servicesList;

    const baseMenuByKey: Record<string, { name: string; hasDropdown: boolean; href: string; subItems?: { label: string; href: string }[] }> = {
        properties: {
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
        projects: {
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
        investments: {
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
        services: {
            name: dict.services,
            hasDropdown: true,
            href: `/${lang}/services`,
            subItems: effectiveServicesList.length > 0 ? effectiveServicesList.map(s => ({
                label: s.title,
                href: `/${lang}/services/${s.slug}`
            })) : []
        },
        about: {
            name: dict.about,
            hasDropdown: false,
            href: `/${lang}#about`
        },
        partners: {
            name: 'Partners',
            hasDropdown: false,
            href: `/${lang}/partners`
        },
        contact: { name: dict.contact, hasDropdown: false, href: `/${lang}/contact` },
        blog: { name: dict.blog, hasDropdown: false, href: `/${lang}/blog` },
    };

    const resolveLocalizedMenuHref = (rawHref: string, fallbackHref: string) => {
        const h = String(rawHref || "").trim();
        if (!h) return fallbackHref;
        if (h.startsWith("http://") || h.startsWith("https://")) return h;
        if (h.startsWith(`/${lang}/`) || h === `/${lang}` || h.startsWith(`/${lang}#`)) return h;
        if (h.startsWith("#")) return `/${lang}${h}`;
        if (h.startsWith("/")) return `/${lang}${h}`;
        return `/${lang}/${h}`;
    };

    const configuredMenuItems = siteConfig?.menu?.items;
    const menuItems =
        Array.isArray(configuredMenuItems) && configuredMenuItems.length > 0
            ? [...configuredMenuItems]
                  .filter((item: any) => item && item.is_active !== false)
                  .sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999))
                  .map((item: any) => {
                      const base = baseMenuByKey[item.key] || baseMenuByKey[item.id];
                      const localizedLabel = item.label?.[lang] || item.label?.es || base?.name || item.key || "Link";
                      return {
                          id: item.id || item.key || localizedLabel,
                          name: localizedLabel,
                          hasDropdown: base ? base.hasDropdown : Boolean(item.hasDropdown),
                          href: resolveLocalizedMenuHref(item.href, base?.href || `/${lang}`),
                          subItems: base?.subItems,
                      };
                  })
            : Object.entries(baseMenuByKey).map(([k, v]) => ({ id: k, ...v }));

    const showLanguageSwitcher = siteConfig?.menu?.show_language_switcher !== false;
    const showFavoritesButton = siteConfig?.menu?.show_favorites_button !== false;
    const favLabel = lang === 'en' ? 'My Favorites' : lang === 'fr' ? 'Mes Favoris' : 'Mis Favoritas';

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
                            prefetch={false}
                            onClick={(e) => {
                                if (window.location.pathname === `/${lang}` || window.location.pathname === `/${lang}/`) {
                                    e.preventDefault();
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
                                sizes="(max-width: 640px) 60px, (max-width: 1280px) 80px, 96px"
                            />
                            <Image
                                src="/images/logo-pci-construction-gold.webp"
                                alt="PCI Construction Group"
                                width={120}
                                height={120}
                                className="w-[60px] h-[60px] sm:w-20 sm:h-20 xl:w-24 xl:h-24 object-contain"
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
                    <div className="hidden lg:flex items-center gap-x-2 xl:gap-x-5" data-navbar-menu="true">
                        {menuItems.map((item) => {
                            return (
                            <div key={item.id || item.name} className="relative group" data-nav-item={item.id}>
                                <Link
                                    href={item.href || "#"}
                                    prefetch={false}
                                    className="text-white hover:text-luxury-gold px-1 py-4 text-[10px] xl:text-xs font-bold transition-colors uppercase tracking-wider flex items-center gap-1 group-hover:text-luxury-gold whitespace-nowrap"
                                >
                                    {item.name}
                                    {item.hasDropdown && <FaChevronDown aria-hidden="true" className="text-[10px] transition-transform group-hover:rotate-180" />}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.hasDropdown && item.subItems && item.subItems.length > 0 && (
                                    <div className="absolute top-full left-0 w-56 bg-primary-black border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 pt-2">
                                        <div className="bg-primary-black border-t-2 border-luxury-gold flex flex-col">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.label}
                                                    href={subItem.href}
                                                    prefetch={false}
                                                    className="px-6 py-3 text-sm text-gray-300 hover:bg-luxury-gold hover:text-black transition-colors uppercase tracking-wider font-semibold border-b border-white/5 last:border-0"
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )})}

                        {/* Favorites Heart Drawer Button */}
                        {showFavoritesButton && (
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(true)}
                                aria-label={`${favLabel} (${favCount})`}
                                title={favLabel}
                                data-favorites-nav-btn="true"
                                data-favorites-count={favCount}
                                className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ml-1 ${
                                    favCount > 0
                                        ? "bg-rose-600/20 border-rose-500/70 text-rose-300 hover:bg-rose-600 hover:text-white"
                                        : "bg-white/5 border-white/15 text-white hover:border-luxury-gold hover:text-luxury-gold"
                                }`}
                            >
                                <FaHeart aria-hidden="true" className={favCount > 0 ? "text-rose-500 text-xs" : "text-luxury-gold text-xs"} />
                                <span data-favorites-badge-desktop="true">{favCount}</span>
                            </button>
                        )}

                        {/* Language Switcher (preserves current property/route and query params across ES/EN/FR) */}
                        {showLanguageSwitcher && (
                            <div className="flex gap-2 text-xs font-bold text-white border-l border-white/20 pl-3 ml-1">
                                <Link href={getLocalizedHref("es")} className={`hover:text-luxury-gold ${lang === 'es' ? 'text-luxury-gold' : ''}`}>ES</Link>
                                <Link href={getLocalizedHref("en")} className={`hover:text-luxury-gold ${lang === 'en' ? 'text-luxury-gold' : ''}`}>EN</Link>
                                <Link href={getLocalizedHref("fr")} className={`hover:text-luxury-gold ${lang === 'fr' ? 'text-luxury-gold' : ''}`}>FR</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Actions: Favorites Heart + Menu Button */}
                    <div className="lg:hidden flex items-center gap-1.5">
                        {showFavoritesButton && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    setDrawerOpen(true);
                                }}
                                aria-label={`${favLabel} (${favCount})`}
                                data-favorites-nav-btn-mobile="true"
                                data-favorites-count={favCount}
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                                    favCount > 0
                                        ? "bg-rose-600/25 border-rose-500/70 text-rose-200"
                                        : "bg-white/5 border-white/15 text-white"
                                }`}
                            >
                                <FaHeart aria-hidden="true" className={favCount > 0 ? "text-rose-500 text-xs" : "text-luxury-gold text-xs"} />
                                <span>{favCount}</span>
                            </button>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            className="text-luxury-gold hover:text-white focus:outline-none text-2xl transition-transform p-3 -mr-2"
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
                    {showLanguageSwitcher && (
                        <div className="p-4 flex gap-6 justify-center mt-6 flex-wrap">
                            <Link href={getLocalizedHref("es")} onClick={() => setIsOpen(false)} className={`text-base font-bold p-3 ${lang === 'es' ? 'text-luxury-gold' : 'text-white'}`}>ESPAÑOL</Link>
                            <Link href={getLocalizedHref("en")} onClick={() => setIsOpen(false)} className={`text-base font-bold p-3 ${lang === 'en' ? 'text-luxury-gold' : 'text-white'}`}>ENGLISH</Link>
                            <Link href={getLocalizedHref("fr")} onClick={() => setIsOpen(false)} className={`text-base font-bold p-3 ${lang === 'fr' ? 'text-luxury-gold' : 'text-white'}`}>FRANÇAIS</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
