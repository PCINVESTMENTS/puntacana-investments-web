"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaCheckCircle, FaSpinner, FaArrowRight, FaGlobe } from "react-icons/fa";
import { submitNewsletter } from "@/app/actions/newsletter";
import { FormAntispamFields } from "@/components/forms/FormAntispamFields";
import { useActionState, startTransition } from "react";
import { useSiteConfig } from "@/components/layout/SiteConfigContext";

interface FooterProps {
    dict: any;
    lang: string;
}

const SOCIAL_ICON_MAP: Record<string, any> = {
    instagram: FaInstagram,
    facebook: FaFacebookF,
    linkedin: FaLinkedinIn,
    youtube: FaYoutube,
};

export function Footer({ dict, lang }: FooterProps) {
    const siteConfig = useSiteConfig();
    const fCfg = siteConfig?.footer || null;
    const [state, formAction, isPending] = useActionState(submitNewsletter, { success: false, message: '' });

    const pickLoc = (obj: any, fallback: string) => {
        if (!obj || typeof obj !== "object") return fallback;
        return obj[lang] || obj.es || obj.en || fallback;
    };

    const resolveHref = (rawHref: string) => {
        const h = String(rawHref || "").trim();
        if (!h) return `/${lang}`;
        if (h.startsWith("http://") || h.startsWith("https://")) return h;
        if (h.startsWith(`/${lang}/`) || h === `/${lang}` || h.startsWith(`/${lang}#`)) return h;
        if (h.startsWith("#")) return `/${lang}${h}`;
        if (h.startsWith("/")) return `/${lang}${h}`;
        return `/${lang}/${h}`;
    };

    const exploreTitle = pickLoc(fCfg?.explore_title, dict.footer.explore);
    const companyTitle = pickLoc(fCfg?.company_title, dict.footer.company);
    const socialsTitle = pickLoc(fCfg?.socials_title, dict.footer.socials);
    const newsletterTitle = pickLoc(fCfg?.newsletter_title, dict.footer.newsletter);
    const emailPlaceholder = pickLoc(fCfg?.email_placeholder, dict.footer.emailPlaceholder);
    const rightsText = pickLoc(fCfg?.rights, dict.footer.rights);
    const legalPrivacy = pickLoc(fCfg?.legal_privacy, dict.footer.legal?.privacy || "Privacy Policy");
    const legalTerms = pickLoc(fCfg?.legal_terms, dict.footer.legal?.terms || "Terms of Service");
    const showSocials = fCfg?.show_socials !== false;
    const showNewsletter = fCfg?.show_newsletter !== false;

    const exploreLinks = Array.isArray(fCfg?.explore_links) && fCfg.explore_links.length > 0
        ? [...fCfg.explore_links]
            .filter((item: any) => item && item.is_active !== false)
            .sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999))
            .map((item: any) => ({ id: item.id, href: resolveHref(item.href), label: pickLoc(item.label, item.href) }))
        : [
            { id: "properties", href: `/${lang}/properties`, label: dict.footer.links.properties },
            { id: "projects", href: `/${lang}/futuros-proyectos`, label: dict.footer.links.projects },
            { id: "investments", href: `/${lang}/investments`, label: dict.footer.links.investments },
            { id: "hotels", href: `/${lang}/properties?type=commercial`, label: dict.footer.links.hotels },
        ];

    const companyLinks = Array.isArray(fCfg?.company_links) && fCfg.company_links.length > 0
        ? [...fCfg.company_links]
            .filter((item: any) => item && item.is_active !== false)
            .sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999))
            .map((item: any) => ({ id: item.id, href: resolveHref(item.href), label: pickLoc(item.label, item.href) }))
        : [
            { id: "services", href: `/${lang}/services`, label: dict.footer.links.services },
            { id: "about", href: `/${lang}#about`, label: dict.footer.links.about },
            { id: "contact", href: `/${lang}/contact`, label: dict.footer.links.contact },
            { id: "blog", href: `/${lang}/blog`, label: dict.footer.links.blog },
        ];

    const socialLinks = Array.isArray(fCfg?.social_links) && fCfg.social_links.length > 0
        ? [...fCfg.social_links]
            .filter((item: any) => item && item.is_active !== false)
            .sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999))
            .map((item: any) => ({
                id: item.id || item.network,
                Icon: SOCIAL_ICON_MAP[String(item.network || "").toLowerCase()] || FaGlobe,
                url: item.url || "#",
                label: item.label || item.network || "Social",
            }))
        : [
            { id: "instagram", Icon: FaInstagram, url: "https://www.instagram.com/puntacanainvestmentsrd/", label: "Instagram" },
            { id: "facebook", Icon: FaFacebookF, url: "#", label: "Facebook" },
            { id: "linkedin", Icon: FaLinkedinIn, url: "https://www.linkedin.com/in/ulises-ubiera-b442b685", label: "LinkedIn" },
            { id: "youtube", Icon: FaYoutube, url: "#", label: "YouTube" },
        ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <footer data-site-footer="true" className="bg-black text-white pt-10 lg:pt-20 pb-10 border-t border-white/10 min-h-[500px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8 lg:mb-16">
                    {/* Brand & Address */}
                    <div className="space-y-6">
                        <Link
                            href={`/${lang}`}
                            prefetch={false}
                            onClick={(e) => {
                                if (window.location.pathname === `/${lang}` || window.location.pathname === `/${lang}/`) {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                            }}
                            className="flex justify-center md:justify-start items-center w-full max-w-[240px] xl:max-w-[280px] mx-auto md:mx-0"
                        >
                            <Image
                                src="/images/logo-pci-investments-gold.webp"
                                alt="Punta Cana Investments"
                                width={140}
                                height={140}
                                className="w-1/2 h-auto object-contain"
                                sizes="140px"
                            />
                            <Image
                                src="/images/logo-pci-construction-gold.webp"
                                alt="PCI Construction Group"
                                width={140}
                                height={140}
                                className="w-1/2 h-auto object-contain"
                                sizes="140px"
                            />
                        </Link>
                    </div>

                    {/* Navigation - Column 1 */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                            {exploreTitle}
                        </h3>
                        <ul className="space-y-1 text-sm text-gray-400">
                            {exploreLinks.map((lnk) => (
                                <li key={lnk.id}>
                                    <Link prefetch={false} href={lnk.href} className="block py-2 text-luxury-gold hover:text-white transition-colors">
                                        {lnk.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Navigation - Column 2 */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                            {companyTitle}
                        </h3>
                        <ul className="space-y-1 text-sm text-gray-400">
                            {companyLinks.map((lnk) => (
                                <li key={lnk.id}>
                                    <Link prefetch={false} href={lnk.href} className="block py-2 text-luxury-gold hover:text-white transition-colors">
                                        {lnk.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials & Newsletter */}
                    <div>
                        {showSocials && socialLinks.length > 0 && (
                            <>
                                <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                                    {socialsTitle}
                                </h3>
                                <div className="flex gap-4 mb-8 flex-wrap">
                                    {socialLinks.map(({ id, Icon, url, label }) => (
                                        <a
                                            key={id}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-luxury-gold hover:text-black transition-all duration-300"
                                            aria-label={`Visit our ${label} page`}
                                        >
                                            <Icon aria-hidden="true" size={20} />
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}

                        {showNewsletter && (
                            <>
                                <h3 className="text-white font-bold uppercase tracking-widest mb-4 text-sm">
                                    {newsletterTitle}
                                </h3>

                                {state.success ? (
                                    <div className="text-green-400 text-sm animate-fade-in flex items-center gap-2">
                                        <FaCheckCircle /> Subscribed!
                                    </div>
                                ) : (
                                    <>
                                        <form onSubmit={handleSubmit} className="flex border border-white/20 p-1 relative">
                                            <input type="hidden" name="lang" value={lang} />
                                            <FormAntispamFields />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                aria-label={emailPlaceholder || "Email address"}
                                                placeholder={emailPlaceholder}
                                                className="bg-transparent text-white px-4 py-2 w-full focus:outline-none placeholder-gray-400 text-sm"
                                            />
                                            <button
                                                type="submit"
                                                disabled={isPending}
                                                aria-label={dict.footer.newsletterButton || "Subscribe to newsletter"}
                                                className="bg-white/10 text-luxury-gold px-6 py-3 hover:bg-luxury-gold hover:text-black transition-colors disabled:opacity-50 min-h-[48px]"
                                            >
                                                {isPending ? <FaSpinner aria-hidden="true" className="animate-spin" /> : <FaArrowRight aria-hidden="true" />}
                                            </button>
                                        </form>
                                        {state.message && !state.success && (
                                            <p className="text-red-300 text-xs mt-2">{state.message}</p>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-4 md:mb-0">
                        © {new Date().getFullYear()} Punta Cana Investments. {rightsText}
                    </p>
                    <div className="text-gray-400 text-xs uppercase tracking-wider space-x-4">
                        <Link href={`/${lang}/privacy-policy`} className="hover:text-white transition-colors">{legalPrivacy}</Link>
                        <span>|</span>
                        <Link href={`/${lang}/terms-of-service`} className="hover:text-white transition-colors">{legalTerms}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
