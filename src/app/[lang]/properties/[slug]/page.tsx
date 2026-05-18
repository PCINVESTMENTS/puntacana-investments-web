
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { FaBed, FaBath, FaRulerCombined, FaCheck, FaArrowLeft, FaWhatsapp } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getDictionary } from "@/dictionaries/get-dictionary";
import ContactForm from "@/components/contact/ContactForm";
import PropertyGallery from "@/components/property/PropertyGallery";
import VideoPlayer from "@/components/property/VideoPlayer";
import MortgageCalculator from "@/components/property/MortgageCalculator";
import ROICalculator from "@/components/property/ROICalculator";

import ConstructionProgress from "@/components/property/ConstructionProgress";
import PriceDropNotify from "@/components/property/PriceDropNotify";
import ShareButtons from "@/components/property/ShareButtons";

// Sanity imports
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PROPERTY_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { Property, properties } from "@/data/properties";

// Helper to map Sanity data to our app's Property interface
function mapSanityProperty(data: any): Property {
    if (!data) return null as any;

    const safeMainImage = data.mainImage ? urlFor(data.mainImage).url() : (data.imageUrl || "/images/og-home-luxury.webp");
    const safeGalleryUrls = data.gallery
        ? data.gallery.map((img: any) => urlFor(img).url())
        : (data.galleryUrls || []);

    const isEpic = data.title?.includes('Epic');
    
    let descriptionEs = data.descriptionEs || "";
    let descriptionEn = data.descriptionEn || "";

    if (isEpic) {
        descriptionEs = descriptionEs
            .replace(/Amenidades del Proyecto Epic Punta Cana:/g, "## Amenidades del Proyecto Epic Punta Cana:")
            .replace(/Distribución y Características Principales \(60 m2\):/g, "## Distribución y Características Principales (60 m2):")
            .replace(/Potencial de Inversión y Rentabilidad:/g, "## Potencial de Inversión y Rentabilidad:");
            
        descriptionEn = descriptionEn
            .replace(/Amenities of the Epic Punta Cana Project:/g, "## Amenities of the Epic Punta Cana Project:")
            .replace(/Distribution and Main Features \(60 m2\):/g, "## Distribution and Main Features (60 m2):")
            .replace(/Investment Potential and Profitability:/g, "## Investment Potential and Profitability:");
    }

    const epicFeaturesEs = ["Cancha de Tenis", "Cancha de Baloncesto", "Piscina Infinity", "Piscina", "Cocina Modular", "Seguridad 24/7", "Airbnb Friendly", "Restaurantes Exclusivos", "Shopping Mall", "Supermercado", "Centro de Diversión / Bares", "Hospital / Clínica", "Farmacia", "Colegios Internacionales", "Aeropuerto", "Club de Playa Privado"];
    const epicFeaturesEn = ["Tennis Court", "Basketball Court", "Infinity Pool", "Swimming Pool", "Modular Kitchen", "24/7 Security", "Airbnb Friendly", "Exclusive Restaurants", "Shopping Mall", "Supermarket", "Entertainment Center / Bars", "Hospital / Clinic", "Pharmacy", "International Schools", "Airport", "Private Beach Club"];

    return {
        ...data,
        image: safeMainImage,
        mainImage: data.mainImage,
        gallery: safeGalleryUrls,
        rawGallery: data.gallery,
        features: {
            en: isEpic ? epicFeaturesEn : (data.featuresEn || []),
            es: isEpic ? epicFeaturesEs : (data.featuresEs || [])
        },
        description: {
            en: descriptionEn,
            es: descriptionEs
        },
        constructionStages: data.constructionStages?.map((stage: any) => ({
            date: stage.date,
            title: { en: stage.titleEn, es: stage.titleEs },
            description: { en: stage.descriptionEn, es: stage.descriptionEs },
            status: stage.status
        })),
        detailedSections: data.detailedSections?.map((section: any) => ({
            title: { en: section.titleEn, es: section.titleEs },
            content: { en: section.contentEn, es: section.contentEs }
        })),
        hideFromLabel: data.hideFromLabel || false,
        locationLabel: data.locationLabel || (data.title?.includes('Epic') ? 'Epic Residences' : 'Punta Cana'),
        tagline: data.tagline?.includes('Error generating content') 
            ? "Exclusivo Apartamento de Lujo, Ideal para Inversión y Alta Rentabilidad (ROI)" 
            : data.tagline,
        seo: {
            title: {
                en: data.seo?.title?.en || data.title,
                es: data.seo?.title?.es || data.title
            },
            description: {
                en: data.seo?.description?.en || data.descriptionEn || "",
                es: data.seo?.description?.es || data.descriptionEs || ""
            },
            keywords: {
                en: data.seo?.keywords?.en?.some((k: string) => k.includes('Error')) ? [
                    "Real estate investment Punta Cana", "High ROI properties Punta Cana", "Airbnb investment properties Dominican Republic", "Buy condo for vacation rental Punta Cana", "Punta Cana luxury real estate", "Invest in Epic Residences Punta Cana", "Tax-free real estate Punta Cana (CONFOTUR)", "1 bedroom condo for sale Punta Cana", "Condos for sale Downtown Punta Cana", "Epic Residences Punta Cana project", "Affordable condos in Punta Cana", "Pre-construction condos Punta Cana City Place", "Condos near the beach Punta Cana", "Condos in Punta Cana City Place", "Downtown Punta Cana real estate", "Buy property in Punta Cana", "New construction condos Punta Cana", "Punta Cana real estate agent", "Best places to buy property in Punta Cana"
                ] : (data.seo?.keywords?.en || []),
                es: data.seo?.keywords?.es?.some((k: string) => k.includes('Error')) ? [
                    "Inversión inmobiliaria en Punta Cana", "Apartamentos rentables en Punta Cana", "Alta rentabilidad ROI Punta Cana", "Apartamentos para Airbnb en Punta Cana", "Comprar apartamento para alquilar Punta Cana", "Bienes raíces de lujo República Dominicana", "Invertir en Epic Residences Punta Cana", "Apartamento de 1 habitación en Punta Cana", "Apartamentos en venta Downtown Punta Cana", "Proyecto Epic Residences Punta Cana", "Apartamentos económicos Punta Cana", "Apartamentos en planos Punta Cana City Place", "Inmuebles cerca de la playa Punta Cana", "Apartamentos en Punta Cana City Place", "Bienes raíces Downtown Punta Cana", "Comprar propiedad en Punta Cana", "Apartamentos nuevos Punta Cana", "Real Estate Punta Cana", "Mejores apartamentos para comprar en Punta Cana"
                ] : (data.seo?.keywords?.es || [])
            }
        }
    };
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;

    // Check local data first for SEO consistency
    const localProperty = properties.find(p => p.slug === slug);
    let property: Property;

    if (localProperty) {
        property = localProperty;
    } else {
        const propertyData = await client.fetch(PROPERTY_BY_SLUG_QUERY, { slug });

        if (!propertyData) {
            return {
                title: 'Propiedad no encontrada',
            };
        }
        property = mapSanityProperty(propertyData);
    }

    const seo = property.seo;
    const title = seo?.title ? seo.title[lang as 'en' | 'es'] : `${property.title} | Punta Cana Investments`;
    const description = seo?.description ? seo.description[lang as 'en' | 'es'] : property.description[lang as 'en' | 'es'].substring(0, 160);
    
    let keywordList = seo?.keywords ? seo.keywords[lang as 'en' | 'es'] : [];
    if (!keywordList || keywordList.length === 0) {
        const loc = property.locationLabel || 'Punta Cana';
        
        if (lang === 'en') {
             keywordList = [
                 `Punta Cana ${property.type} for sale`,
                 `${property.title}`,
                 `${property.type} in ${loc}`,
                 `Dominican Republic Real Estate`,
                 `Buy property in Punta Cana`
             ];
             if (property.type === 'land') keywordList.push(`Land for hotel development ${loc}`, `Beachfront land for sale`, `Plots in ${loc}`);
             if (property.type === 'commercial') keywordList.push(`Commercial real estate ${loc}`, `Retail space Punta Cana`, `Invest in commercial properties DR`);
             if (property.type === 'condohotel') keywordList.push(`Condo hotel for sale ${loc}`, `Hotel investment Punta Cana`, `Resort for sale Dominican Republic`, `High ROI condo hotel`);
             if (property.type === 'resorts' || property.title.toLowerCase().includes('hotel')) keywordList.push(`Hotels for sale Dominican Republic`, `Resorts for sale in Punta Cana`);
             if (property.status === 'rent') keywordList.push(`Monthly rentals ${loc}`, `Long term rental Punta Cana`);
             if (loc.toLowerCase().includes('miches')) keywordList.push(`Invest in Miches`, `Hotels for sale in Miches`, `Land for hotel development Miches`);
        } else {
             keywordList = [
                 `${property.type === 'villa' ? 'Villa' : (property.type === 'land' ? 'Terreno' : (property.type === 'commercial' ? 'Local Comercial' : 'Apartamento'))} en venta en Punta Cana`,
                 `${property.title}`,
                 `${property.type === 'land' ? 'Comprar Terreno' : 'Comprar Propiedad'} en ${loc}`,
                 `Bienes Raíces República Dominicana`,
                 `Inversión en Punta Cana`
             ];
             if (property.type === 'land') keywordList.push(`Terrenos para construir hoteles en las playas`, `Solares en venta en ${loc}`, `Especialista en terrenos República Dominicana`, `Terreno para desarrollar hoteles`);
             if (property.type === 'commercial') keywordList.push(`Locales comerciales en ${loc}`, `Inversión comercial Punta Cana`);
             if (property.type === 'condohotel') keywordList.push(`Condo hotel en venta`, `Inversión hotelera Punta Cana`, `Apartahotel en venta`);
             if (property.type === 'resorts' || property.title.toLowerCase().includes('hotel')) keywordList.push(`Hoteles en ventas`, `Resort en venta en Punta Cana`);
             if (property.status === 'rent') keywordList.push(`Rentas mensual Punta Cana`, `Alquiler a largo plazo en ${loc}`);
             if (loc.toLowerCase().includes('miches')) keywordList.push(`Inversiones en Miches`, `Hoteles en Miches en ventas`, `Terreno para desarrollar hoteles en Miches`);
        }
    }
    const keywords = keywordList.join(', ');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';
    const canonicalUrl = `${baseUrl}/${lang}/properties/${slug}`;

    return {
        title: title,
        description: description,
        keywords: keywords,
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title: title,
            description: description,
            url: canonicalUrl,
            images: [
                {
                    url: property.image.includes('cdn.sanity.io') ? `${property.image}&w=1200&h=630&fit=crop` : property.image,
                    width: 1200,
                    height: 630,
                    alt: property.title,
                }
            ],
            locale: lang === 'es' ? 'es_DO' : 'en_US',
            type: 'website',
            siteName: 'Punta Cana Investments',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [property.image.includes('cdn.sanity.io') ? `${property.image}&w=1200&h=630&fit=crop` : property.image],
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                en: `${baseUrl}/en/properties/${slug}`,
                es: `${baseUrl}/es/properties/${slug}`,
                'x-default': `${baseUrl}/en/properties/${slug}`
            }
        }
    };
}

// Helper for JSON-LD
function generateJsonLd(property: Property, lang: string, baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': ['Product', 'RealEstateListing'],
        name: property.title,
        description: property.description?.[lang as 'en' | 'es']?.substring(0, 160) || '',
        image: property.image ? [property.image, ...(property.gallery || [])] : [],
        url: `${baseUrl}/${lang}/properties/${property.slug}`,
        datePosted: new Date().toISOString(), // Ideal if we had createdAt
        offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'USD',
            availability: property.status === 'sale' || property.status === 'rent' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
        },
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'DO',
            addressLocality: property.locationLabel || 'Punta Cana',
            addressRegion: 'La Altagracia'
        }
    };
}

// Restoring ISR
export const revalidate = 60;

export default async function PropertyPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang as "es" | "en");

    // Check local data first
    const localProperty = properties.find(p => p.slug === slug);
    let property: Property;

    if (localProperty) {
        property = localProperty;
    } else {
        const propertyData = await client.fetch(PROPERTY_BY_SLUG_QUERY, { slug });
        if (!propertyData) notFound();
        property = mapSanityProperty(propertyData);
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';
    const jsonLd = generateJsonLd(property, lang, baseUrl);
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const galleryImages = property.gallery && property.gallery.length > 0 ? property.gallery : [property.image];

    return (
        <main className="min-h-screen bg-primary-black text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar dict={dict.nav} lang={lang} />

            {/* Extended Hero / Header */}
            <div className="relative h-[60vh] md:h-[70vh]">
                <div className="absolute inset-0">
                    <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="max-w-7xl mx-auto">
                        <Link href={`/${lang}#properties`} className="inline-flex items-center text-luxury-gold hover:text-white mb-6 uppercase tracking-widest text-xs font-bold transition-colors min-h-[44px]">
                            <FaArrowLeft aria-hidden="true" className="mr-2" /> {dict.properties.filters.allLocations}
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <span className="bg-luxury-gold text-black px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                                    {property.type ? `${property.type} • ` : ''}{property.status === 'sale' ? 'Venta' : 'Renta'}
                                </span>
                                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-2 shadow-black drop-shadow-lg">
                                    {property.title}
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-200 font-light">
                                    {property.locationLabel}
                                </p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-luxury-gold text-3xl md:text-5xl font-bold font-serif">
                                    {(!property.hideFromLabel && (property.preConstruction || property.preLaunch) && property.status !== 'rent' && property.type !== 'land' && property.type !== 'commercial') && (
                                        <span className="text-lg md:text-2xl align-top mr-1">{lang === 'en' ? 'From' : 'Desde'}</span>
                                    )} {formatPrice(property.price)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Key Stats */}
                        <div className="bg-dark-gray p-8 border border-white/5 grid grid-cols-2 md:grid-cols-3 gap-8 text-center rounded-lg">
                            <div className="flex flex-col items-center">
                                <FaBed aria-hidden="true" className="text-4xl text-luxury-gold mb-3" />
                                <span className="text-2xl font-bold">{property.beds}</span>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">{dict.properties.beds || 'Beds'}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <FaBath aria-hidden="true" className="text-4xl text-luxury-gold mb-3" />
                                <span className="text-2xl font-bold">{property.baths}</span>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">{dict.properties.baths || 'Baths'}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <FaRulerCombined className="text-4xl text-luxury-gold mb-3" />
                                <span className="text-2xl font-bold">{property.area} m² / {Math.round(property.area * 10.764).toLocaleString()} ft²</span>
                                <span className="text-gray-400 text-xs uppercase tracking-wider">Área</span>
                            </div>
                        </div>

                        {/* Description Intro */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-luxury-gold mb-6 uppercase tracking-wider">
                                {lang === 'en' ? 'Description' : 'Descripción'}
                            </h2>
                            <div className="text-gray-300 leading-relaxed text-lg">
                                <ReactMarkdown
                                    components={{
                                        p: ({ node, ...props }) => <p className="mb-4 whitespace-pre-line text-gray-300" {...props} />,
                                        h1: ({ node, ...props }) => <h1 className="text-3xl font-serif font-bold text-luxury-gold mt-8 mb-4" {...props} />,
                                        h2: ({ node, ...props }) => <h2 className="text-2xl font-serif font-bold text-luxury-gold mt-8 mb-4" {...props} />,
                                        h3: ({ node, ...props }) => <h3 className="text-xl font-serif font-bold text-luxury-gold mt-6 mb-3" {...props} />,
                                        h4: ({ node, ...props }) => <h4 className="text-lg font-serif font-bold text-white mt-4 mb-2" {...props} />,
                                        strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 text-gray-300" {...props} />,
                                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                        a: ({ node, ...props }) => <a className="text-luxury-gold hover:underline transition-all" {...props} />,
                                    }}
                                >
                                    {property.description[lang as 'en' | 'es']}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Detailed Sections (e.g. Growth Developments) */}
                        {property.detailedSections && property.detailedSections.length > 0 && (
                            <div className="space-y-8">
                                {property.detailedSections.map((section, idx) => (
                                    <div key={idx} className="bg-white/5 p-8 rounded border border-luxury-gold/20">
                                        <h2 className="text-2xl font-serif font-bold text-luxury-gold mb-4 uppercase tracking-wider">
                                            {section.title[lang as 'en' | 'es']}
                                        </h2>
                                        <p className="text-gray-300 leading-relaxed text-lg">
                                            {section.content[lang as 'en' | 'es']}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Gallery Section */}
                        {galleryImages.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-luxury-gold mb-6 uppercase tracking-wider">
                                    Galería
                                </h2>
                                <PropertyGallery images={galleryImages} />
                            </div>
                        )}

                        {/* Video Section */}
                        {(property.videoUrl || property.virtualTourUrl) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {property.videoUrl && (
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-luxury-gold mb-6 uppercase tracking-wider">
                                            Video Tour
                                        </h2>
                                        <VideoPlayer url={property.videoUrl} title="Video Tour" />
                                    </div>
                                )}
                                {property.virtualTourUrl && (
                                    <div>
                                        <h2 className="text-2xl font-serif font-bold text-luxury-gold mb-6 uppercase tracking-wider">
                                            Tour Virtual 360°
                                        </h2>
                                        <VideoPlayer url={property.virtualTourUrl} title="Virtual Tour" />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Calculations Section */}
                        <div className="space-y-8">
                            {property.status === 'sale' && (
                                <MortgageCalculator price={property.price} />
                            )}

                            {/* ROI Calculator only for sale properties */}
                            {property.status === 'sale' && (
                                <ROICalculator
                                    price={property.price}
                                    dict={dict.calculator}
                                    propertyType={property.type}
                                />
                            )}



                            {/* Construction Progress - Simulation for specific project status or just as premium feature */}
                            {property.status === 'sale' && property.constructionStages && (
                                <ConstructionProgress
                                    lang={lang}
                                    stages={property.constructionStages}
                                    completionPercent={property.completionPercent || 0}
                                />
                            )}
                        </div>

                        {/* Features */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-luxury-gold mb-6 uppercase tracking-wider">
                                Amenidades
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {property.features[lang as 'en' | 'es'].map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded hover:bg-white/10 transition-colors">
                                        <div className="bg-luxury-gold/20 p-2 rounded-full">
                                            <FaCheck aria-hidden="true" className="text-luxury-gold" />
                                        </div>
                                        <span className="text-gray-200">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Contact */}
                    <div className="lg:col-span-1">
                        <div className="bg-dark-gray p-8 border-t-4 border-luxury-gold sticky top-24 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-2">{dict.contact.title}</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                {dict.contact.subtitle}
                            </p>

                            <ContactForm
                                dict={dict.contact.form}
                                subject={`${lang === 'en' ? 'Inquiry about' : 'Consulta sobre'}: ${property.title}`}
                                className="mt-4"
                                lang={lang}
                                propertyData={JSON.stringify({
                                    title: property.title,
                                    location: property.locationLabel,
                                    price: property.price,
                                    area: property.area,
                                    type: property.type
                                })}
                            />

                            <div className="mt-8 text-center pt-8 border-t border-white/10">
                                <p className="text-sm text-gray-500 mb-4">WhatsApp:</p>
                                <a href="https://wa.me/18294084322" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-green-500 hover:text-green-400 font-bold text-lg transition-colors min-h-[48px]">
                                    <FaWhatsapp aria-hidden="true" className="text-2xl" /> Chat Directo
                                </a>
                            </div>

                            {/* Social Share Buttons */}
                            <ShareButtons
                                title={`Mira esta propiedad: ${property.title}`}
                                url={`https://puntacanainvesment.com/${lang}/properties/${property.slug}`}
                            />

                            <PriceDropNotify lang={lang} propertyTitle={property.title} />
                        </div>
                    </div>
                </div>
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
