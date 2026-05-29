
import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { investmentModels } from "@/data/investment-models";
import { FaCheck, FaArrowRight, FaChartPie, FaRegCheckCircle } from "react-icons/fa";

export async function generateStaticParams() {
    return investmentModels.flatMap((model) => [
        { lang: 'es', model: model.slug },
        { lang: 'en', model: model.slug },
        { lang: 'fr', model: model.slug }
    ]);
}

export const revalidate = 60;

import ShareButtons from "@/components/property/ShareButtons";

export async function generateMetadata({ params }: { params: Promise<{ lang: string, model: string }> }) {
    const { lang, model } = await params;
    const modelData = investmentModels.find(m => m.slug === model);

    if (!modelData) return { title: 'Not Found' };

    const getVal = (obj: any, key: string) => {
        if (!obj) return "";
        return obj[key] || obj['en'] || obj['es'] || "";
    };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';
    const canonicalUrl = `${baseUrl}/${lang}/investments/${model}`;

    const titleText = getVal(modelData.title, lang);
    const descText = getVal(modelData.description, lang);

    const keywordList = lang === 'en'
        ? [`Punta Cana ${modelData.slug} investments`, `${titleText}`, 'Dominican Republic real estate investments', 'High ROI condo hotel', 'Beachfront properties Cap Cana']
        : lang === 'fr'
        ? [`Investissements ${modelData.slug} Punta Cana`, `${titleText}`, 'Investissement immobilier République Dominicaine', 'Condo-hôtel rentabilité élevée', 'Propriétés en bord de mer Cap Cana']
        : [`Inversiones ${modelData.slug} Punta Cana`, `${titleText}`, 'Inversiones inmobiliarias República Dominicana', 'Condo hotel alta rentabilidad', 'Propiedades frente al mar Cap Cana'];

    return {
        title: `${titleText} | Punta Cana Investments`,
        description: descText,
        keywords: keywordList.join(', '),
        openGraph: {
            title: `${titleText} | Punta Cana Investments`,
            description: descText,
            url: canonicalUrl,
            images: [
                {
                    url: modelData.heroImage.startsWith('http') ? modelData.heroImage : `${baseUrl}${modelData.heroImage}`,
                    width: 1200,
                    height: 630,
                    alt: titleText,
                }
            ],
            locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_DO' : 'en_US',
            siteName: 'Punta Cana Investments',
            type: 'website',
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                en: `${baseUrl}/en/investments/${model}`,
                es: `${baseUrl}/es/investments/${model}`,
                fr: `${baseUrl}/fr/investments/${model}`,
                'x-default': `${baseUrl}/en/investments/${model}`
            }
        }
    };
}

export default async function InvestmentModelPage({ params }: { params: Promise<{ lang: string, model: string }> }) {
    const { lang, model } = await params;
    const dict = await getDictionary(lang as "es" | "en" | "fr");
    const data = investmentModels.find(m => m.slug === model);

    if (!data) return notFound();

    const getVal = (obj: any, key: string) => {
        if (!obj) return "";
        return obj[key] || obj['en'] || obj['es'] || "";
    };

    return (
        <main className="min-h-screen bg-primary-black text-white">
            <Navbar
                dict={dict.nav}
                lang={lang}
                servicesList={dict.sections.services.items}
                propertyTypes={dict.properties.types}
            />

            {/* Hero Section */}
            <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={data.heroImage}
                        alt={getVal(data.title, lang)}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/60 to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <span className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-sm mb-6 block animate-fade-in-up">
                        {lang === 'en' ? "Investment Strategy" : lang === 'fr' ? "Stratégie d'Investissement" : "Estrategia de Inversión"}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 drop-shadow-2xl animate-fade-in-up animation-delay-200">
                        {getVal(data.title, lang)}
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-200 font-light leading-relaxed animate-fade-in-up animation-delay-400">
                        {getVal(data.description, lang)}
                    </p>
                </div>
            </div>

            {/* ROI Stats Bar */}
            {data.roiStats && data.roiStats.length > 0 && (
                <div className="bg-luxury-gold text-black py-12 relative z-20 -mt-20 mx-4 md:mx-auto max-w-6xl rounded-xl shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-black/10">
                        {data.roiStats.map((stat, idx) => (
                            <div key={idx} className="p-4">
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="uppercase tracking-widest text-xs font-semibold opacity-80">{getVal(stat.label, lang)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Deep Dive Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-8 border-l-4 border-luxury-gold pl-6">
                            {lang === 'en' ? "Understanding the Model" : lang === 'fr' ? "Comprendre le Modèle" : "Entendiendo el Modelo"}
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8 whitespace-pre-line">
                            {getVal(data.longDescription, lang)}
                        </p>

                        <div className="space-y-6">
                            {(data.keyBenefits || []).map((benefit, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="bg-dark-gray p-3 rounded-full h-fit text-luxury-gold border border-white/10 shadow-lg">
                                        <FaRegCheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg mb-1">{getVal(benefit.title, lang)}</h4>
                                        <p className="text-sm text-gray-400">{getVal(benefit.text, lang)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[600px] rounded-lg overflow-hidden border-8 border-white/5 shadow-2xl">
                        <Image
                            src={data.contentSections?.[0]?.image || data.heroImage}
                            alt="Investment Detail"
                            fill
                            className="object-cover"
                        />
                        {/* Overlay Card */}
                        <div className="absolute bottom-8 right-8 bg-black/90 p-8 rounded backdrop-blur-md max-w-sm border border-white/10">
                            <h3 className="text-xl font-bold text-luxury-gold mb-4 font-serif">
                                {lang === 'en' ? "Why this works?" : lang === 'fr' ? "Pourquoi cela fonctionne ?" : "¿Por qué funciona esto?"}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                {getVal(data.contentSections?.[0]?.text, lang) || getVal(data.description, lang)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <ShareButtons
                        title={getVal(data.title, lang)}
                        url={`https://www.puntacanainvestmentsrd.com/${lang}/investments/${model}`}
                    />
                </div>
            </div>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-r from-dark-gray to-black border-t border-white/5">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">
                        {lang === 'en' ? "Explore Opportunities in this Model" : lang === 'fr' ? "Explorer les Opportunités de ce Modèle" : "Explore Oportunidades en este Modelo"}
                    </h2>
                    <p className="text-xl mb-10 text-gray-400 font-light">
                        {lang === 'en'
                            ? "Our team has a curated list of properties that fit this exact investment profile."
                            : lang === 'fr'
                            ? "Notre équipe dispose d'une liste sélectionnée de propriétés qui correspondent exactement à ce profil d'investissement."
                            : "Nuestro equipo tiene una lista curada de propiedades que encajan exactamente en este perfil de inversión."}
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <Link
                            href={`/${lang}#contact`}
                            className="bg-luxury-gold text-black px-10 py-4 rounded uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl inline-flex items-center gap-3"
                        >
                            {lang === 'en' ? "Schedule Consultation" : lang === 'fr' ? "Planifier un Rendez-vous" : "Agendar Consulta"} <FaArrowRight />
                        </Link>
                        <Link
                            href={`/${lang}/investments`}
                            className="px-10 py-4 rounded uppercase tracking-widest font-bold border border-white text-white hover:bg-white hover:text-black transition-all"
                        >
                            {lang === 'en' ? "View All Models" : lang === 'fr' ? "Voir Tous les Modèles" : "Ver Tous los Modèles"}
                        </Link>
                    </div>
                </div>
            </section>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
