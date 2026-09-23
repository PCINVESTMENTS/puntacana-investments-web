import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: "es" | "en" | "fr" }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.puntacanainvestmentsrd.com";
    const title = lang === "en"
        ? "Prime Real Estate Locations in Punta Cana & Dominican Republic"
        : lang === "fr"
        ? "Meilleurs Emplacements Immobiliers à Punta Cana et République Dominicaine"
        : "Zonas Inmobiliarias Exclusivas en Punta Cana y República Dominicana";
    const description = lang === "en"
        ? "Explore luxury properties in Cap Cana, Punta Cana Resort, Bávaro, Cocotal, White Sands, Vista Cana, and Miches."
        : lang === "fr"
        ? "Explorez les propriétés de luxe à Cap Cana, Punta Cana Resort, Bávaro, Cocotal, White Sands, Vista Cana et Miches."
        : "Explore propiedades de lujo en Cap Cana, Punta Cana Resort, Bávaro, Cocotal, White Sands, Vista Cana y Miches.";

    return {
        title: `${title} | Punta Cana Investments`,
        description,
        alternates: {
            canonical: `${baseUrl}/${lang}/locations`,
            languages: {
                es: `${baseUrl}/es/locations`,
                en: `${baseUrl}/en/locations`,
                fr: `${baseUrl}/fr/locations`,
                "x-default": `${baseUrl}/en/locations`,
            },
        },
        openGraph: {
            title: `${title} | Punta Cana Investments`,
            description,
            url: `${baseUrl}/${lang}/locations`,
            images: [`${baseUrl}/images/og-home-luxury.webp`],
        },
    };
}

import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LocationsSection } from "@/components/home/LocationsSection";

export default async function LocationsPage({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
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

            <div className="pt-20">
                {/* Reusing LocationsSection but without a limit to show all */}
                <LocationsSection dict={dict.sections.locations} lang={lang} prioritizeImages={true} />
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
