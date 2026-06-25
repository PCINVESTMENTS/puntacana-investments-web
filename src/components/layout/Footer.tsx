"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaCheckCircle, FaSpinner, FaArrowRight } from "react-icons/fa";
import { submitNewsletter } from "@/app/actions/newsletter";
import { useActionState, startTransition } from "react";

interface FooterProps {
    dict: any;
    lang: string;
}

export function Footer({ dict, lang }: FooterProps) {
    const [state, formAction, isPending] = useActionState(submitNewsletter, { success: false, message: '' });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <footer className="bg-black text-white pt-10 lg:pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8 lg:mb-16">
                    {/* Brand & Address */}
                    <div className="space-y-6">
                        <Link
                            href={`/${lang}`}
                            onClick={() => {
                                if (window.location.pathname === `/${lang}`) {
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
                            />
                            <Image
                                src="/images/logo-pci-construction-gold.webp"
                                alt="PCI Construction Group"
                                width={140}
                                height={140}
                                className="w-1/2 h-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Navigation - Column 1 */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                            {dict.footer.explore}
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-400">
                            <li><Link href={`/${lang}/properties`} className="block py-2 text-luxury-gold hover:text-white transition-colors">{dict.footer.links.properties}</Link></li>
                            <li><Link prefetch={false} href={`/${lang}/projects`} className="block py-2 text-luxury-gold hover:text-white transition-colors">{dict.footer.links.projects}</Link></li>
                            <li><Link href={`/${lang}/investments`} className="block py-2 text-luxury-gold hover:text-white transition-colors">{dict.footer.links.investments}</Link></li>
                            <li><Link prefetch={false} href={`/${lang}/hotels`} className="block py-2 text-luxury-gold hover:text-white transition-colors">{dict.footer.links.hotels}</Link></li>
                        </ul>
                    </div>

                    {/* Navigation - Column 2 */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                            {dict.footer.company}
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-400">
                            <li><Link href={`/${lang}/services`} className="block py-2 text-luxury-gold hover:text-white transition-colors">{dict.footer.links.services}</Link></li>
                            <li><Link prefetch={false} href={`/${lang}/about`} className="block py-2 text-luxury-gold hover:text-white transition-colors">{dict.footer.links.about}</Link></li>
                            <li><Link href={`/${lang}/contact`} className="block py-2 text-luxury-gold hover:text-white transition-colors">{dict.footer.links.contact}</Link></li>
                            <li><Link prefetch={false} href={`/${lang}/blog`} className="block py-2 text-luxury-gold hover:text-white transition-colors">{dict.footer.links.blog}</Link></li>
                        </ul>
                    </div>

                    {/* Socials & Newsletter */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                            {dict.footer.socials}
                        </h4>
                        <div className="flex gap-4 mb-8">
                            {[
                                { Icon: FaInstagram, url: "https://www.instagram.com/puntacanainvestmentsrd/", label: "Instagram" },
                                { Icon: FaFacebookF, url: "#", label: "Facebook" },
                                { Icon: FaLinkedinIn, url: "https://www.linkedin.com/in/ulises-ubiera-b442b685", label: "LinkedIn" },
                                { Icon: FaYoutube, url: "#", label: "YouTube" }
                            ].map(({ Icon, url, label }, i) => (
                                <a
                                    key={i}
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

                        <h4 className="text-white font-bold uppercase tracking-widest mb-4 text-sm">
                            {dict.footer.newsletter}
                        </h4>

                        {state.success ? (
                            <div className="text-green-400 text-sm animate-fade-in flex items-center gap-2">
                                <FaCheckCircle /> Subscribed!
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex border border-white/20 p-1">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder={dict.footer.emailPlaceholder}
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
                        )}
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-4 md:mb-0">
                        © {new Date().getFullYear()} Punta Cana Investments. {dict.footer.rights}
                    </p>
                    <div className="text-gray-400 text-xs uppercase tracking-wider space-x-4">
                        <Link href={`/${lang}/privacy-policy`} className="hover:text-white transition-colors">{dict.footer.legal?.privacy || "Privacy Policy"}</Link>
                        <span>|</span>
                        <Link href={`/${lang}/terms-of-service`} className="hover:text-white transition-colors">{dict.footer.legal?.terms || "Terms of Service"}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
