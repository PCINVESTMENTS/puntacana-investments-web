import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ServicesSection from "@/components/home/ServicesSection";
import { fetchLocalSandboxPhase8, resolvePhase8MediaUrl } from "@/lib/localSandbox";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';
    const canonicalUrl = `${baseUrl}/${lang}/services`;

    const title = lang === 'en'
        ? "Real Estate Legal Advice & Property Management in Punta Cana"
        : lang === 'fr'
        ? "Conseil Juridique Immobilier et Gestion de Propriétés à Punta Cana"
        : "Asesoría Legal Inmobiliaria y Administración de Propiedades en Punta Cana";

    const description = lang === 'en'
        ? "Comprehensive real estate services in Punta Cana. Expert property management, real estate lawyers, and legal advice for a secure investment in the Dominican Republic."
        : lang === 'fr'
        ? "Services immobiliers complets à Punta Cana. Gestion de propriétés, avocats spécialisés en immobilier et conseils juridiques pour un investissement sûr."
        : "Servicios inmobiliarios integrales en Punta Cana. Administración de propiedades, abogados inmobiliarios y asesoría legal para asegurar tu inversión en la República Dominicana.";

    return {
        title: title,
        description,
        keywords: lang === 'es'
            ? ['Administración de propiedades Punta Cana', 'Asesoría legal inmobiliaria República Dominicana', 'Abogados inmobiliarios Punta Cana']
            : lang === 'fr'
            ? ['Gestion immobilière Punta Cana', 'Avocat immobilier Punta Cana', 'Conseil juridique immobilier République Dominicaine']
            : ['Punta Cana property management', 'Punta Cana real estate lawyer', 'Dominican Republic real estate legal advice'],
        openGraph: {
            title: `${title} | Punta Cana Investments`,
            description,
            url: canonicalUrl,
            images: [
                {
                    url: `${baseUrl}/images/services-team-horizontal.webp`,
                    width: 1200,
                    height: 630,
                    alt: dict.sections.services.title,
                }
            ],
            locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_DO' : 'en_US',
            siteName: 'Punta Cana Investments',
            type: 'website',
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                en: `${baseUrl}/en/services`,
                es: `${baseUrl}/es/services`,
                fr: `${baseUrl}/fr/services`,
                'x-default': `${baseUrl}/en/services`
            }
        }
    };
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const phase8Data = await fetchLocalSandboxPhase8();
    const p8Services = phase8Data?.services;
    const pick = (obj: any, fallback: string) =>
        obj && typeof obj === "object" ? obj[lang] || obj.es || obj.en || fallback : fallback;

    const effectiveServicesDict = p8Services
        ? {
            ...dict.sections.services,
            title: pick(p8Services.title, dict.sections.services.title),
            subtitle: pick(p8Services.subtitle, dict.sections.services.subtitle),
            description: pick(p8Services.description, dict.sections.services.description),
            cta: pick(p8Services.cta, dict.sections.services.cta),
            items: Array.isArray(p8Services.items)
                ? [...p8Services.items]
                    .filter((s: any) => s && s.is_active !== false)
                    .sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999))
                    .map((s: any) => ({
                        title: pick(s.title, s.slug),
                        description: pick(s.description, ""),
                        img: resolvePhase8MediaUrl(s.img, "/images/services-team-horizontal.webp"),
                        slug: (lang === "en" ? s.slug_en : lang === "fr" ? s.slug_fr : s.slug) || s.slug,
                        details: Array.isArray(s.details?.[lang]) ? s.details[lang] : [],
                    }))
                : dict.sections.services.items,
        }
        : dict.sections.services;

    return (
        <main className="min-h-screen bg-primary-black">
            <Navbar
                dict={dict.nav}
                lang={lang}
                servicesList={effectiveServicesDict.items}
                propertyTypes={dict.properties.types}
            />

            <div className="pt-20">
                {/* Reusing ServicesSection but without a limit to show all */}
                <ServicesSection 
                    dict={effectiveServicesDict} 
                    lang={lang} 
                    heroImage="/images/services-team-horizontal.webp"
                    isPage={true}
                />
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
