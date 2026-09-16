import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/components/layout/Footer").then(mod => mod.Footer), { ssr: true });
import DueDiligenceContent from "./DueDiligenceContent";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: "es" | "en" | "fr" }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.puntacanainvestmentsrd.com";
    const canonicalUrl = `${baseUrl}/${lang}/investments/due-diligence`;

    const title = lang === "es" 
        ? "Debida Diligencia | Punta Cana Investments" 
        : lang === "fr" 
        ? "Diligence Raisonnable | Punta Cana Investments" 
        : "Due Diligence | Punta Cana Investments";

    const description = lang === "es"
        ? "Complete los formularios oficiales de debida diligencia para Personas Físicas y Jurídicas antes de invertir en República Dominicana."
        : lang === "fr"
        ? "Remplissez les formulaires officiels de diligence raisonnable pour les personnes physiques et morales avant d'investir en République Dominicaine."
        : "Complete the official due diligence forms for Individuals and Legal Entities before investing in the Dominican Republic.";

    const keywords = lang === "es"
        ? "Debida diligencia Punta Cana, KYC inversiones República Dominicana, Formulario persona física Cap Cana, Formulario persona jurídica Bávaro, Seguridad jurídica inmobiliaria RD"
        : lang === "fr"
        ? "Diligence raisonnable Punta Cana, KYC investissement République Dominicaine, Formulaire personne physique Cap Cana, Sécurité juridique immobilière RD"
        : "Due diligence Punta Cana, Real estate KYC Dominican Republic, Individual due diligence form Cap Cana, Legal security investments DR";

    return {
        title,
        description,
        keywords,
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                es: `${baseUrl}/es/investments/due-diligence`,
                en: `${baseUrl}/en/investments/due-diligence`,
                fr: `${baseUrl}/fr/investments/due-diligence`,
                "x-default": `${baseUrl}/en/investments/due-diligence`,
            }
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            images: [
                {
                    url: `${baseUrl}/images/og-home-luxury.webp`,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
            locale: lang === "fr" ? "fr_FR" : lang === "es" ? "es_DO" : "en_US",
            siteName: "Punta Cana Investments",
            type: "website",
        }
    };
}

export default async function DueDiligencePage({ params }: { params: Promise<{ lang: "es" | "en" | "fr" }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.puntacanainvestmentsrd.com";
    const canonicalUrl = `${baseUrl}/${lang}/investments/due-diligence`;

    const title = lang === "es" 
        ? "Debida Diligencia" 
        : lang === "fr" 
        ? "Diligence Raisonnable" 
        : "Due Diligence";

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": lang === "en" ? "Home" : lang === "fr" ? "Accueil" : "Inicio",
                        "item": `${baseUrl}/${lang}`
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": dict.nav.investments,
                        "item": `${baseUrl}/${lang}/investments`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": title,
                        "item": canonicalUrl
                    }
                ]
            }
        ]
    };

    return (
        <main className="min-h-screen bg-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar
                dict={dict.nav}
                lang={lang}
                servicesList={dict.sections.services.items}
                propertyTypes={dict.properties.types}
                variant="solid"
            />
            <DueDiligenceContent />
            <Footer dict={dict} lang={lang} />
        </main>
    );
}
