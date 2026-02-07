
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
import { Property } from "@/data/properties";

// Helper to map Sanity data to our app's Property interface
function mapSanityProperty(data: any): Property {
    if (!data) return null as any;

    return {
        ...data,
        image: data.mainImage ? urlFor(data.mainImage).url() : (data.imageUrl || ""),
        gallery: data.gallery
            ? data.gallery.map((img: any) => urlFor(img).url())
            : (data.galleryUrls || []),
        features: {
            en: data.featuresEn || [],
            es: data.featuresEs || []
        },
        description: {
            en: data.descriptionEn || "",
            es: data.descriptionEs || ""
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
        hideFromLabel: data.hideFromLabel || false
    };
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;

    const propertyData = await client.fetch(PROPERTY_BY_SLUG_QUERY, { slug });

    if (!propertyData) {
        return {
            title: 'Propiedad no encontrada',
        };
    }
    const property = mapSanityProperty(propertyData);

    const seo = property.seo;
    const title = seo?.title ? seo.title[lang as 'en' | 'es'] : `${property.title} | Punta Cana Investments`;
    const description = seo?.description ? seo.description[lang as 'en' | 'es'] : property.description[lang as 'en' | 'es'].substring(0, 160);
    const keywords = (seo?.keywords ? seo.keywords[lang as 'en' | 'es'] : []).join(', ');

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
                    url: property.image,
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
            images: [property.image],
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
        '@type': 'RealEstateListing',
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

    const propertyData = await client.fetch(PROPERTY_BY_SLUG_QUERY, { slug });
    if (!propertyData) notFound();
    const property = mapSanityProperty(propertyData);

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
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="max-w-7xl mx-auto">
                        <Link href={`/${lang}#properties`} className="inline-flex items-center text-luxury-gold hover:text-white mb-6 uppercase tracking-widest text-xs font-bold transition-colors min-h-[44px]">
                            <FaArrowLeft aria-hidden="true" className="mr-2" /> {dict.properties.filters.allLocations}
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <span className="bg-luxury-gold text-black px-4 py-1 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                                    {property.type} • {property.status === 'sale' ? 'Venta' : 'Renta'}
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
                                    {(!property.hideFromLabel && property.status !== 'rent' && property.type !== 'land' && property.type !== 'commercial') && (
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
                                        p: ({ node, ...props }) => <p className="mb-4 whitespace-pre-line" {...props} />,
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
