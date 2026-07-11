import { client } from "@/sanity/lib/client";
import { PARTNERS_QUERY } from "@/sanity/lib/queries";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getDictionary } from "@/dictionaries/get-dictionary";
import Image from "next/image";
import Link from "next/link";
import { FaGlobe, FaHandshake, FaExternalLinkAlt } from "react-icons/fa";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    
    const titles: Record<string, string> = {
        es: "Asociados y Partners Globales | Punta Cana Investments",
        en: "Global Partners & Associates | Punta Cana Investments",
        fr: "Partenaires Mondiaux | Punta Cana Investments",
    };
    const descriptions: Record<string, string> = {
        es: "Conoce nuestra exclusiva red de asociaciones estratégicas globales. Trabajamos con los mejores para garantizar inversiones de alta calidad en Punta Cana.",
        en: "Discover our exclusive network of global strategic partnerships. We work with the best to ensure high-quality investments in Punta Cana.",
        fr: "Découvrez notre réseau exclusif de partenariats stratégiques mondiaux. Nous travaillons avec les meilleurs pour garantir des investissements de haute qualité à Punta Cana.",
    };

    return {
        title: titles[lang] || titles.en,
        description: descriptions[lang] || descriptions.en,
        keywords: [
            "Punta Cana real estate partners",
            "global real estate alliances",
            "inversiones inmobiliarias Punta Cana",
            "asociados internacionales bienes raices",
            "luxury real estate network"
        ],
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
        alternates: {
            canonical: `https://www.puntacanainvestmentsrd.com/${lang}/partners`,
            languages: {
                'es': 'https://www.puntacanainvestmentsrd.com/es/partners',
                'en': 'https://www.puntacanainvestmentsrd.com/en/partners',
                'fr': 'https://www.puntacanainvestmentsrd.com/fr/partners',
            },
        },
        openGraph: {
            title: titles[lang] || titles.en,
            description: descriptions[lang] || descriptions.en,
            url: `https://www.puntacanainvestmentsrd.com/${lang}/partners`,
            siteName: 'Punta Cana Investments',
            images: [
                {
                    url: '/images/pci-golden-logo.jpg',
                    width: 800,
                    height: 800,
                    alt: 'Punta Cana Investments Global Partners',
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: titles[lang] || titles.en,
            description: descriptions[lang] || descriptions.en,
            images: ['/images/pci-golden-logo.jpg'],
        },
    };
}

export default async function PartnersPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "es" | "en" | "fr");
    const partners = await client.fetch(PARTNERS_QUERY);

    const translations = {
        es: {
            heroTitle: "Nuestra Red Global de Asociados",
            heroSubtitle: "Alianzas estratégicas para inversiones seguras y rentables",
            heroText: "En Punta Cana Investments, creemos que la grandeza se logra a través de la colaboración. Hemos forjado sólidas alianzas con las organizaciones líderes del sector para ofrecerte propiedades de lujo y transacciones impecables a nivel mundial.",
            visitWebsite: "Visitar Sitio Web",
            noPartners: "Próximamente estaremos anunciando nuestros nuevos aliados globales."
        },
        en: {
            heroTitle: "Our Global Partner Network",
            heroSubtitle: "Strategic alliances for secure and profitable investments",
            heroText: "At Punta Cana Investments, we believe greatness is achieved through collaboration. We have forged strong partnerships with leading organizations in the industry to bring you luxury properties and seamless transactions worldwide.",
            visitWebsite: "Visit Website",
            noPartners: "We will be announcing our new global allies soon."
        },
        fr: {
            heroTitle: "Notre Réseau de Partenaires Mondiaux",
            heroSubtitle: "Des alliances stratégiques pour des investissements sûrs et rentables",
            heroText: "Chez Punta Cana Investments, nous croyons que l'excellence s'atteint par la collaboration. Nous avons forgé de solides partenariats avec des organisations de premier plan de l'industrie pour vous offrir des propriétés de luxe et des transactions sans faille dans le monde entier.",
            visitWebsite: "Visiter le Site Web",
            noPartners: "Nous annoncerons bientôt nos nouveaux alliés mondiaux."
        }
    };

    const t = translations[lang as keyof typeof translations] || translations.en;

    return (
        <main className="min-h-screen bg-primary-black text-white selection:bg-luxury-gold selection:text-black">
            <Navbar 
                dict={dict.nav} 
                lang={lang} 
                variant="solid" 
                servicesList={dict.sections?.services?.items || []} 
                propertyTypes={dict.properties?.types || {}} 
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-8 md:pt-40 md:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-black via-zinc-900 to-primary-black opacity-90 z-0"></div>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-luxury-gold rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
                
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <div className="flex justify-center mb-4 md:mb-8 animate-fade-in-up">
                        <div className="relative w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden border border-luxury-gold/20 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                            <Image 
                                src="/images/pci-golden-logo.jpg" 
                                alt="Punta Cana Investments Global Network" 
                                fill 
                                className="object-cover" 
                                priority
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-wide animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        {t.heroTitle}
                    </h1>
                    <h2 className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        {t.heroSubtitle}
                    </h2>
                    <p className="text-base md:text-lg text-gray-400 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        {t.heroText}
                    </p>
                </div>
            </section>

            {/* Partners Grid */}
            <section className="pt-8 pb-20 md:pt-12 px-4 sm:px-6 lg:px-8 bg-zinc-950">
                <div className="max-w-7xl mx-auto">
                    {partners.length === 0 ? (
                        <div className="text-center py-20 border border-luxury-gold/20 rounded-xl bg-zinc-900/50">
                            <FaHandshake className="text-6xl text-luxury-gold mx-auto mb-4 opacity-50" />
                            <p className="text-gray-400 text-lg">{t.noPartners}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
                            {partners.map((partner: any, index: number) => {
                                const description = partner[`description_${lang}`] || partner.description_en || '';
                                return (
                                    <div 
                                        key={partner._id} 
                                        className="group relative bg-zinc-900 border border-luxury-gold/20 hover:border-luxury-gold/60 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col h-full animate-fade-in-up"
                                        style={{ animationDelay: `${(index + 1) * 150}ms` }}
                                    >
                                        {/* Golden Top Line */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-luxury-gold/50 via-luxury-gold to-luxury-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        <div className="p-8 sm:p-10 flex-grow flex flex-col items-center text-center">
                                            {/* Logo Container */}
                                            <div className="w-48 h-48 mb-8 relative flex items-center justify-center p-4 bg-black/50 rounded-full border border-luxury-gold/10 group-hover:border-luxury-gold/30 transition-colors shadow-inner">
                                                {partner.logoUrl ? (
                                                    <Image 
                                                        src={partner.logoUrl} 
                                                        alt={partner.name} 
                                                        fill 
                                                        className="object-contain p-2" 
                                                    />
                                                ) : (
                                                    <FaHandshake className="text-6xl text-luxury-gold/40" />
                                                )}
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:text-luxury-gold transition-colors">
                                                {partner.name}
                                            </h3>
                                            
                                            <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                                                {description}
                                            </p>
                                        </div>

                                        {/* CTA Button */}
                                        {partner.website_url && (
                                            <div className="p-6 border-t border-luxury-gold/10 bg-black/20">
                                                <a 
                                                    href={partner.website_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all duration-300 font-bold tracking-wide rounded-md text-sm uppercase"
                                                >
                                                    <span>{t.visitWebsite}</span>
                                                    <FaExternalLinkAlt className="text-xs" />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
