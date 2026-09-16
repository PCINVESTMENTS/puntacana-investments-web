import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/components/layout/Footer").then(mod => mod.Footer), { ssr: true });
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { FaCheck, FaArrowRight } from "react-icons/fa";

// Bidirectional slug mapping across all supported languages
export const SERVICE_SLUG_MAP: Record<string, { es: string; en: string; fr: string }> = {
    "asesoria-legal": { es: "asesoria-legal", en: "legal-advice", fr: "legal-advice" },
    "legal-advice": { es: "asesoria-legal", en: "legal-advice", fr: "legal-advice" },
    "arquitectura": { es: "arquitectura", en: "architecture", fr: "architecture" },
    "architecture": { es: "arquitectura", en: "architecture", fr: "architecture" },
    "diseno-interiores": { es: "diseno-interiores", en: "interior-design", fr: "interior-design" },
    "interior-design": { es: "diseno-interiores", en: "interior-design", fr: "interior-design" },
    "ingenieria-civil": { es: "ingenieria-civil", en: "civil-engineering", fr: "civil-engineering" },
    "civil-engineering": { es: "ingenieria-civil", en: "civil-engineering", fr: "civil-engineering" },
    "ingenieria-electrica": { es: "ingenieria-electrica", en: "electrical-engineering", fr: "electrical-engineering" },
    "electrical-engineering": { es: "ingenieria-electrica", en: "electrical-engineering", fr: "electrical-engineering" },
    "construccion": { es: "construccion", en: "construction", fr: "construction" },
    "construction": { es: "construccion", en: "construction", fr: "construction" },
    "desarrollo": { es: "desarrollo", en: "development", fr: "development" },
    "development": { es: "desarrollo", en: "development", fr: "development" },
    "monitoreo-de-inversion": { es: "monitoreo-de-inversion", en: "monitoreo-de-inversion", fr: "monitoreo-de-inversion" }
};

const KEYWORDS_BY_SERVICE: Record<string, { es: string; en: string; fr: string }> = {
    "arquitectura": {
        es: "Arquitectura en Punta Cana, Diseño de Villas de Lujo República Dominicana, Constructores de Casas Personalizadas, Firmas de Arquitectura Bávaro, Diseños Costeros DR, Modelos Arquitectónicos Modernos, Comprar Solar y Construir Villa en Cap Cana, Planificación y Construcción de Hoteles en Miches, Expertos en Arquitectura Tropical",
        en: "Punta Cana Architecture, Luxury Villa Design Dominican Republic, Custom Home Builders Punta Cana, Construction & Architecture Services Bavaro, Coastal Design Specialists DR, Modern High-End Real Estate Developments, Buy Land and Build Villa Punta Cana, Architectural Planning Miches",
        fr: "Architecture à Punta Cana, Design de Villas de Luxe République Dominicaine, Constructeurs de Maisons sur Mesure, Cabinets d'Architecture Bavaro, Designs Côtiers RD, Modèles Architecturaux Modernes, Acheter un Terrain et Construire une Villa à Cap Cana, Planification et Construction d'Hôtels à Miches, Experts en Architecture Tropicale"
    },
    "asesoria-legal": {
        es: "Asesoría Legal Inmobiliaria Punta Cana, Abogados Inmobiliarios República Dominicana, Títulos de Propiedad Cap Cana, Ley CONFOTUR Exención Impuestos, Debida Diligencia Inmobiliaria RD, Contratos de Compraventa Bávaro",
        en: "Real Estate Legal Advice Punta Cana, Property Lawyers Dominican Republic, Cap Cana Title Deeds, CONFOTUR Tax Exemptions Law, Real Estate Due Diligence DR, Purchase Contracts Bavaro",
        fr: "Conseil Juridique Immobilier Punta Cana, Avocats Immobiliers République Dominicaine, Titres de Propriété Cap Cana, Loi CONFOTUR Exemption Fiscale, Diligence Raisonnable Immobilière RD, Contrats de Vente Bavaro"
    },
    "diseno-interiores": {
        es: "Diseño de Interiores Punta Cana, Decoración Villas de Lujo Cap Cana, Interiorismo República Dominicana, Mobiliario FF&E Bávaro, Home Staging para Inversión",
        en: "Interior Design Punta Cana, Luxury Villa Decor Cap Cana, Interior Designers Dominican Republic, FF&E Furniture Bavaro, Investment Home Staging",
        fr: "Design d'Intérieur Punta Cana, Décoration Villas de Luxe Cap Cana, Architectes d'Intérieur République Dominicaine, Mobilier FF&E Bavaro, Home Staging Investissement"
    },
    "ingenieria-civil": {
        es: "Ingeniería Civil Punta Cana, Cálculo Estructural República Dominicana, Supervisión de Obra Cap Cana, Construcción Civil Bávaro, Estudio de Suelos RD",
        en: "Civil Engineering Punta Cana, Structural Analysis Dominican Republic, Construction Supervision Cap Cana, Civil Works Bavaro, Soil Testing DR",
        fr: "Génie Civil Punta Cana, Calcul Structurel République Dominicaine, Supervision de Chantier Cap Cana, Travaux Publics Bavaro, Étude de Sol RD"
    },
    "ingenieria-electrica": {
        es: "Ingeniería Eléctrica Punta Cana, Instalaciones Media y Baja Tensión, Energía Solar Paneles República Dominicana, Domótica Smart Home Villas Cap Cana",
        en: "Electrical Engineering Punta Cana, Power Distribution & Sub-stations, Solar Energy Panels Dominican Republic, Smart Home Automation Cap Cana",
        fr: "Génie Électrique Punta Cana, Installations Moyenne et Basse Tension, Panneaux Solaires République Dominicaine, Domotique Smart Home Cap Cana"
    },
    "construccion": {
        es: "Construcción en Punta Cana, Constructora Villas de Lujo República Dominicana, Contratista General Cap Cana, Edificación Residencial y Comercial Bávaro",
        en: "Construction in Punta Cana, Luxury Villa Builders Dominican Republic, General Contractor Cap Cana, Residential & Commercial Construction Bavaro",
        fr: "Construction à Punta Cana, Constructeur de Villas de Luxe République Dominicaine, Entrepreneur Général Cap Cana, Bâtiment Résidentiel et Commercial Bavaro"
    },
    "desarrollo": {
        es: "Desarrollo Inmobiliario Punta Cana, Proyectos Turísticos República Dominicana, Master Planning Cap Cana, Estructuración de Inversiones RD",
        en: "Real Estate Development Punta Cana, Tourism Projects Dominican Republic, Master Planning Cap Cana, Investment Structuring DR",
        fr: "Développement Immobilier Punta Cana, Projets Touristiques République Dominicaine, Master Planning Cap Cana, Structuration d'Investissement RD"
    }
};

export async function generateStaticParams() {
    return [
        // Spanish
        { lang: "es", slug: "asesoria-legal" },
        { lang: "es", slug: "arquitectura" },
        { lang: "es", slug: "diseno-interiores" },
        { lang: "es", slug: "ingenieria-civil" },
        { lang: "es", slug: "ingenieria-electrica" },
        { lang: "es", slug: "construccion" },
        { lang: "es", slug: "desarrollo" },
        // English
        { lang: "en", slug: "legal-advice" },
        { lang: "en", slug: "architecture" },
        { lang: "en", slug: "interior-design" },
        { lang: "en", slug: "civil-engineering" },
        { lang: "en", slug: "electrical-engineering" },
        { lang: "en", slug: "construction" },
        { lang: "en", slug: "development" },
        // French
        { lang: "fr", slug: "legal-advice" },
        { lang: "fr", slug: "architecture" },
        { lang: "fr", slug: "interior-design" },
        { lang: "fr", slug: "civil-engineering" },
        { lang: "fr", slug: "electrical-engineering" },
        { lang: "fr", slug: "construction" },
        { lang: "fr", slug: "development" },
    ];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const currentLang = (lang === "es" || lang === "fr") ? lang : "en";
    const dict = await getDictionary(currentLang);

    const mapped = SERVICE_SLUG_MAP[slug];
    const targetSlug = mapped ? mapped[currentLang] : slug;
    const esSlug = mapped ? mapped.es : slug;
    const enSlug = mapped ? mapped.en : slug;
    const frSlug = mapped ? mapped.fr : slug;

    const service = dict.sections.services.items.find((s: any) => s.slug === targetSlug || s.slug === slug);

    if (!service) {
        return {
            title: "Service Not Found",
        };
    }

    const serviceKey = mapped ? mapped.es : slug;
    const customKeywords = KEYWORDS_BY_SERVICE[serviceKey]?.[currentLang] || 
        (currentLang === "es" 
            ? `${service.title} Punta Cana, ${service.title} República Dominicana, Servicios Inmobiliarios`
            : currentLang === "fr"
            ? `${service.title} Punta Cana, ${service.title} République Dominicaine, Services Immobiliers`
            : `${service.title} Punta Cana, ${service.title} Dominican Republic, Real Estate Services`);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.puntacanainvestmentsrd.com";
    const canonicalUrl = `${baseUrl}/${currentLang}/services/${targetSlug}`;

    return {
        title: `${service.title} | Punta Cana Investments`,
        description: service.description,
        keywords: customKeywords,
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
        openGraph: {
            title: `${service.title} | Punta Cana Investments`,
            description: service.description,
            url: canonicalUrl,
            images: [
                {
                    url: `${baseUrl}${service.img}`,
                    width: 1200,
                    height: 630,
                    alt: service.title,
                }
            ],
            locale: currentLang === "fr" ? "fr_FR" : currentLang === "es" ? "es_DO" : "en_US",
            siteName: "Punta Cana Investments",
            type: "website",
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                en: `${baseUrl}/en/services/${enSlug}`,
                es: `${baseUrl}/es/services/${esSlug}`,
                fr: `${baseUrl}/fr/services/${frSlug}`,
                "x-default": `${baseUrl}/en/services/${enSlug}`
            }
        }
    };
}

export default async function ServicePage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const currentLang = (lang === "es" || lang === "fr") ? lang : "en";
    const dict = await getDictionary(currentLang);

    const mapped = SERVICE_SLUG_MAP[slug];
    const targetSlug = mapped ? mapped[currentLang] : slug;

    // If accessed with a cross-language slug, redirect to the canonical slug for this language
    if (mapped && slug !== targetSlug) {
        permanentRedirect(`/${currentLang}/services/${targetSlug}`);
    }

    // Find service by targetSlug or slug
    const service = dict.sections.services.items.find((s: any) => s.slug === targetSlug || s.slug === slug);

    if (!service) {
        return notFound();
    }

    const extendedService = service as any;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.puntacanainvestmentsrd.com";
    const canonicalUrl = `${baseUrl}/${currentLang}/services/${targetSlug}`;

    // Structured Data (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": service.title,
                "description": service.description,
                "provider": {
                    "@type": "RealEstateAgent",
                    "name": "Punta Cana Investments",
                    "url": baseUrl,
                    "telephone": "+1-829-408-4322",
                    "priceRange": "$$$$"
                },
                "areaServed": {
                    "@type": "AdministrativeArea",
                    "name": "Punta Cana, Dominican Republic"
                },
                "url": canonicalUrl,
                "image": `${baseUrl}${service.img}`
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": currentLang === "en" ? "Home" : currentLang === "fr" ? "Accueil" : "Inicio",
                        "item": `${baseUrl}/${currentLang}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": dict.nav.services,
                        "item": `${baseUrl}/${currentLang}/services`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": service.title,
                        "item": canonicalUrl
                    }
                ]
            }
        ]
    };

    return (
        <main className="min-h-screen bg-primary-black text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar
                dict={dict.nav}
                lang={currentLang}
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
                        sizes="100vw"
                        quality={60}
                        className="object-cover object-[center_30%]"
                        priority
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-black/90 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <span className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-sm mb-4 block animate-fade-in-up drop-shadow-md">
                        {dict.sections.services.subtitle}
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-xl animate-fade-in-up animation-delay-200">
                        {service.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-100 font-medium leading-relaxed drop-shadow-md animate-fade-in-up animation-delay-400">
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
                                {currentLang === "en" ? "Overview" : currentLang === "fr" ? "Vue d'ensemble" : "Visión General"}
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                                {extendedService.longDescription || service.description}
                            </p>
                        </div>

                        {/* Detailed Sections (if available) */}
                        {extendedService.contentSections && extendedService.contentSections.map((section: any, idx: number) => (
                            <div key={idx} className="bg-white/5 rounded-lg overflow-hidden border border-white/5 hover:border-luxury-gold/30 transition-colors">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className={`relative h-64 md:h-auto ${idx % 2 === 1 ? "md:order-last" : ""}`}>
                                        <Image
                                            src={section.image || service.img}
                                            alt={section.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            quality={50}
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
                                {currentLang === "en" ? "What We Offer" : currentLang === "fr" ? "Ce Que Nous Proposons" : "Lo Que Ofrecemos"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(extendedService.details || []).map((detail: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="bg-luxury-gold/20 p-2 rounded-full mt-1 flex-shrink-0">
                                            <FaCheck aria-hidden="true" className="text-luxury-gold text-xs" />
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
                            <div className="bg-dark-gray p-8 rounded-xl text-white shadow-2xl relative overflow-hidden group border border-luxury-gold/20">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-luxury-gold/20 transition-all"></div>
                                <h3 className="text-2xl font-bold mb-4 font-serif relative z-10 text-luxury-gold">
                                    {currentLang === "en" ? "Interested in this service?" : currentLang === "fr" ? "Ce service vous intéresse ?" : "¿Le interesa este servicio?"}
                                </h3>
                                <p className="mb-8 font-medium relative z-10 opacity-90 text-gray-300">
                                    {currentLang === "en"
                                        ? "Contact our specialists for a personalized quote."
                                        : currentLang === "fr"
                                        ? "Contactez nos spécialistes pour un devis personnalisé."
                                        : "Contacte a nuestros especialistas para una cotización personalizada."}
                                </p>
                                <Link
                                    href={`/${currentLang}#contact`}
                                    className="bg-luxury-gold text-black px-6 py-3 rounded uppercase text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all inline-flex items-center gap-2 shadow-lg transform group-hover:scale-105"
                                >
                                    {dict.sections.services.modalCta} <FaArrowRight aria-hidden="true" />
                                </Link>
                            </div>

                            {/* Navigation */}
                            <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                                <h4 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-4">
                                    {currentLang === "en" ? "Other Services" : currentLang === "fr" ? "Autres Services" : "Otros Servicios"}
                                </h4>
                                <nav className="space-y-2">
                                    {dict.sections.services.items.map((s: any) => (
                                        <Link
                                            key={s.slug}
                                            href={`/${currentLang}/services/${s.slug}`}
                                            className={`block p-3 rounded transition-colors ${s.slug === targetSlug ? "bg-luxury-gold text-black font-bold" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
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

            <Footer dict={dict} lang={currentLang} />
        </main>
    );
}
