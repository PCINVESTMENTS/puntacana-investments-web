
import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/PageSections";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { investmentModels } from "@/data/investment-models";
import { FaCheck, FaArrowRight, FaChartPie, FaRegCheckCircle } from "react-icons/fa";

export async function generateStaticParams() {
    return investmentModels.flatMap((model) => [
        { lang: 'es', model: model.slug },
        { lang: 'en', model: model.slug }
    ]);
}

import ShareButtons from "@/components/property/ShareButtons";

export async function generateMetadata({ params }: { params: Promise<{ lang: string, model: string }> }) {
    const { lang, model } = await params;
    const modelData = investmentModels.find(m => m.slug === model);

    if (!modelData) return { title: 'Not Found' };

    return {
        title: `${modelData.title[lang as 'es' | 'en']} | Punta Cana Investments`,
        description: modelData.description[lang as 'es' | 'en'],
        openGraph: {
            images: [modelData.heroImage],
        },
    };
}

export default async function InvestmentModelPage({ params }: { params: Promise<{ lang: string, model: string }> }) {
    const { lang, model } = await params;
    const dict = await getDictionary(lang as "es" | "en");
    const data = investmentModels.find(m => m.slug === model);
    const l = lang as 'es' | 'en';

    if (!data) return notFound();

    return (
        <main className="min-h-screen bg-primary-black text-white">
            <Navbar
                dict={dict.nav}
                lang={lang as 'es' | 'en'}
                servicesList={dict.sections.services.items}
                propertyTypes={dict.properties.types}
            />

            {/* Hero Section */}
            <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={data.heroImage}
                        alt={data.title[l]}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/60 to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <span className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-sm mb-6 block animate-fade-in-up">
                        {lang === 'en' ? "Investment Strategy" : "Estrategia de Inversión"}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 drop-shadow-2xl animate-fade-in-up animation-delay-200">
                        {data.title[l]}
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-200 font-light leading-relaxed animate-fade-in-up animation-delay-400">
                        {data.description[l]}
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
                                <div className="uppercase tracking-widest text-xs font-semibold opacity-80">{stat.label[l]}</div>
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
                            {lang === 'en' ? "Understanding the Model" : "Entendiendo el Modelo"}
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8 whitespace-pre-line">
                            {data.longDescription[l]}
                        </p>

                        <div className="space-y-6">
                            {(data.keyBenefits || []).map((benefit, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="bg-dark-gray p-3 rounded-full h-fit text-luxury-gold border border-white/10 shadow-lg">
                                        <FaRegCheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg mb-1">{benefit.title[l]}</h4>
                                        <p className="text-sm text-gray-400">{benefit.text[l]}</p>
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
                                {lang === 'en' ? "Why this works?" : "¿Por qué funciona esto?"}
                            </h3>
                            <p className="text-gray-300 text-sm">
                                {data.contentSections?.[0]?.text?.[l] || data.description[l]}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <ShareButtons
                        title={data.title[l]}
                        url={`https://puntacanainvesment.com/${lang}/investments/${model}`}
                    />
                </div>
            </div>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-r from-dark-gray to-black border-t border-white/5">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">
                        {lang === 'en' ? "Explore Opportunities in this Model" : "Explore Oportunidades en este Modelo"}
                    </h2>
                    <p className="text-xl mb-10 text-gray-400 font-light">
                        {lang === 'en'
                            ? "Our team has a curated list of properties that fit this exact investment profile."
                            : "Nuestro equipo tiene una lista curada de propiedades que encajan exactamente en este perfil de inversión."}
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <Link
                            href={`/${lang}#contact`}
                            className="bg-luxury-gold text-black px-10 py-4 rounded uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl inline-flex items-center gap-3"
                        >
                            {lang === 'en' ? "Schedule Consultation" : "Agendar Consulta"} <FaArrowRight />
                        </Link>
                        <Link
                            href={`/${lang}/investments`}
                            className="px-10 py-4 rounded uppercase tracking-widest font-bold border border-white text-white hover:bg-white hover:text-black transition-all"
                        >
                            {lang === 'en' ? "View All Models" : "Ver Todos los Modelos"}
                        </Link>
                    </div>
                </div>
            </section>

            <Footer dict={dict} lang={lang as 'es' | 'en'} />
        </main>
    );
}
