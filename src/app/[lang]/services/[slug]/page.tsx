
import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/PageSections";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaCheck, FaArrowRight, FaWhatsapp } from "react-icons/fa";

// Valid slugs for static generation
const VALID_SLUGS = [
    "legal-advice", "asesoria-legal",
    "architecture", "arquitectura",
    "interior-design", "diseno-interiores",
    "civil-engineering", "ingenieria-civil",
    "electrical-engineering", "ingenieria-electrica",
    "construction", "construccion",
    "development", "desarrollo"
];

export async function generateStaticParams() {
    return VALID_SLUGS.flatMap((slug) => [
        { lang: 'es', slug },
        { lang: 'en', slug }
    ]);
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang as "es" | "en");
    const service = dict.sections.services.items.find((s: any) => s.slug === slug);

    if (!service) {
        return {
            title: 'Service Not Found',
        };
    }

    return {
        title: `${service.title} | Punta Cana Investments`,
        description: service.description,
        openGraph: {
            images: [service.img],
        },
    };
}

export default async function ServicePage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang as "es" | "en");

    // Find service by slug
    const service = dict.sections.services.items.find((s: any) => s.slug === slug);

    if (!service) {
        return notFound();
    }

    // Type casting for robust access to extended fields
    const extendedService = service as any;

    return (
        <main className="min-h-screen bg-primary-black text-white">
            <Navbar
                dict={dict.nav}
                lang={lang}
                servicesList={dict.sections.services.items}
                propertyTypes={dict.properties.types}
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={service.img}
                        alt={service.title}
                        fill
                        className="object-cover opacity-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/50 to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <span className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-sm mb-4 block animate-fade-in-up">
                        {dict.sections.services.subtitle}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg shadow-black animate-fade-in-up animation-delay-200">
                        {service.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-200 font-light leading-relaxed animate-fade-in-up animation-delay-400">
                        {service.description}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* Left Column: Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Intro */}
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-luxury-gold mb-6">
                                {lang === 'en' ? 'Overview' : 'Visión General'}
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                                {extendedService.longDescription || service.description}
                            </p>
                        </div>

                        {/* Detailed Sections (if available) */}
                        {extendedService.contentSections && extendedService.contentSections.map((section: any, idx: number) => (
                            <div key={idx} className="bg-white/5 rounded-lg overflow-hidden border border-white/5 hover:border-luxury-gold/30 transition-colors">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className={`relative h-64 md:h-auto ${idx % 2 === 1 ? 'md:order-last' : ''}`}>
                                        <Image
                                            src={section.image || service.img}
                                            alt={section.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-8 flex flex-col justify-center">
                                        <h3 className="text-xl font-bold text-white mb-4 font-serif">{section.title}</h3>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            {section.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Feature List */}
                        <div className="bg-dark-gray p-8 rounded-xl border border-white/5">
                            <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">
                                {lang === 'en' ? 'What We Offer' : 'Lo Que Ofrecemos'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(extendedService.details || []).map((detail: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="bg-luxury-gold/20 p-2 rounded-full mt-1 flex-shrink-0">
                                            <FaCheck className="text-luxury-gold text-xs" />
                                        </div>
                                        <span className="text-gray-300">{detail}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar / Contact */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">

                            {/* CTA Box */}
                            <div className="bg-gradient-to-br from-luxury-gold to-yellow-600 p-8 rounded-xl text-black shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-white/30 transition-all"></div>
                                <h3 className="text-2xl font-bold mb-4 font-serif relative z-10">
                                    {lang === 'en' ? 'Interested in this service?' : '¿Le interesa este servicio?'}
                                </h3>
                                <p className="mb-8 font-medium relative z-10 opacity-90">
                                    {lang === 'en'
                                        ? 'Contact our specialists for a personalized quote.'
                                        : 'Contacte a nuestros especialistas para una cotización personalizada.'}
                                </p>
                                <Link
                                    href={`/${lang}#contact`}
                                    className="bg-black text-white px-6 py-3 rounded uppercase text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all inline-flex items-center gap-2 shadow-lg"
                                >
                                    {dict.sections.services.modalCta} <FaArrowRight />
                                </Link>
                            </div>

                            {/* Navigation */}
                            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                                <h4 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-4">
                                    {lang === 'en' ? 'Other Services' : 'Otros Servicios'}
                                </h4>
                                <nav className="space-y-2">
                                    {dict.sections.services.items.map((s: any) => (
                                        <Link
                                            key={s.slug}
                                            href={`/${lang}/services/${s.slug}`}
                                            className={`block p-3 rounded transition-colors ${s.slug === slug ? 'bg-luxury-gold text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {s.title}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
