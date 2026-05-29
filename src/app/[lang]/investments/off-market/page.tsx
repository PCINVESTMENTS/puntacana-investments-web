import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FaLock, FaEnvelope, FaShieldAlt, FaKey } from "react-icons/fa";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
    params
}: {
    params: Promise<{ lang: 'es' | 'en' | 'fr' }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';

    return {
        title: (lang === 'en' ? 'Off-Market Opportunities' : lang === 'fr' ? 'Opportunités Hors Marché' : 'Oportunidades Off-Market') + ' | Punta Cana Investments',
        description: lang === 'en'
            ? 'Exclusive access to private real estate listings in Punta Cana. High-value off-market investments for sophisticated buyers.'
            : lang === 'fr'
            ? 'Accès exclusif à des annonces immobilières privées à Punta Cana. Investissements hors marché de grande valeur.'
            : 'Acceso exclusivo a listados privados en Punta Cana. Inversiones off-market de alto valor para compradores sofisticados.',
        alternates: {
            canonical: `${baseUrl}/${lang}/investments/off-market`,
            languages: {
                es: `${baseUrl}/es/investments/off-market`,
                en: `${baseUrl}/en/investments/off-market`,
                fr: `${baseUrl}/fr/investments/off-market`,
            }
        },
        openGraph: {
            title: lang === 'en' ? 'Private Off-Market Listings' : lang === 'fr' ? 'Annonces Privées Hors Marché' : 'Listados Privados Off-Market',
            description: lang === 'en' ? 'Request access to our exclusive private portfolio.' : lang === 'fr' ? 'Demandez l\'accès à notre portefeuille privé exclusif.' : 'Solicite acceso a nuestro portafolio privado exclusivo.',
            images: ['/images/og-offmarket.jpg']
        }
    };
}

export default async function OffMarketPage({
    params
}: {
    params: Promise<{ lang: 'es' | 'en' | 'fr' }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-primary-black">
            <Navbar
                dict={dict.nav}
                lang={lang}
                servicesList={dict.sections.services.items}
                propertyTypes={dict.properties.types}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/10 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal>
                        <div className="text-center">
                            <span className="text-luxury-gold uppercase tracking-[0.3em] text-sm font-bold mb-4 block">
                                {lang === 'en' ? 'Private Collections' : lang === 'fr' ? 'Collections Privées' : 'Colecciones Privadas'}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 uppercase tracking-tight">
                                Off-Market <span className="text-luxury-gold">Opportunities</span>
                            </h1>
                            <div className="h-1 w-24 bg-luxury-gold mx-auto mb-8"></div>
                            <p className="text-neutral-gray text-xl max-w-3xl mx-auto leading-relaxed">
                                {lang === 'en'
                                    ? 'Exclusive access to properties and land developments that are not listed on the public market. High-privacy transactions for sophisticated investors.'
                                    : lang === 'fr'
                                    ? 'Accès exclusif à des propriétés et des développements fonciers qui ne sont pas répertoriés sur le marché public. Transactions hautement confidentielles pour les investisseurs sophistiqués.'
                                    : 'Acceso exclusivo a propiedades y desarrollos de terrenos que no figuran en el mercado público. Transacciones de alta privacidad para inversores sofisticados.'}
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-dark-gray/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <ScrollReveal direction="left">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-luxury-gold/5 blur-2xl rounded-full"></div>
                                <FaLock aria-hidden="true" className="text-[12rem] text-luxury-gold/20 mx-auto" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FaKey aria-hidden="true" className="text-5xl text-luxury-gold" />
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right">
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-luxury-gold/10 flex items-center justify-center flex-shrink-0">
                                        <FaShieldAlt aria-hidden="true" className="text-luxury-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {lang === 'en' ? 'Confidentiality' : lang === 'fr' ? 'Confidentialité' : 'Confidencialidad'}
                                        </h3>
                                        <p className="text-neutral-gray">
                                            {lang === 'en'
                                                ? 'We handle every transaction with absolute discretion, protecting the privacy of both buyers and sellers.'
                                                : lang === 'fr'
                                                ? 'Nous traitons chaque transaction avec une discrétion absolue, protégeant la vie privée des acheteurs et des vendeurs.'
                                                : 'Manejamos cada transacción con absoluta discreción, protegiendo la privacidad tanto de compradores como de vendedores.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-luxury-gold/10 flex items-center justify-center flex-shrink-0">
                                        <FaEnvelope aria-hidden="true" className="text-luxury-gold" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {lang === 'en' ? 'Private Invitations' : lang === 'fr' ? 'Invitations Privées' : 'Invitaciones Privadas'}
                                        </h3>
                                        <p className="text-neutral-gray">
                                            {lang === 'en'
                                                ? 'Our off-market portfolio is shared only with registered clients who match specific investment profiles.'
                                                : lang === 'fr'
                                                ? 'Notre portefeuille hors marché n’est partagé qu’avec des clients enregistrés correspondant à des profils d’investissement spécifiques.'
                                                : 'Nuestro portafolio off-market se comparte solo con clientes registrados que coinciden con perfiles de inversión específicos.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <Link
                                        href={`/${lang}/contact?reason=off-market`}
                                        className="inline-block bg-luxury-gold text-black font-bold py-5 px-10 rounded-sm hover:bg-white transition-all duration-300 uppercase tracking-[0.2em] text-sm shadow-2xl hover:scale-105"
                                    >
                                        {lang === 'en' ? 'Request Private Access' : lang === 'fr' ? 'Demander un Accès Privé' : 'Solicitar Acceso Privado'}
                                    </Link>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
