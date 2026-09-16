
import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import FlyAndBuyForm from "@/components/fly-and-buy/FlyAndBuyForm";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.puntacanainvestmentsrd.com";
    const canonicalUrl = `${baseUrl}/${lang}/fly-and-buy/form`;

    return {
        title: `${dict.flyAndBuyForm.title} | Punta Cana Investments`,
        description: dict.flyAndBuyForm.subtitle,
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                es: `${baseUrl}/es/fly-and-buy/form`,
                en: `${baseUrl}/en/fly-and-buy/form`,
                fr: `${baseUrl}/fr/fly-and-buy/form`,
                "x-default": `${baseUrl}/en/fly-and-buy/form`,
            }
        },
        openGraph: {
            title: `${dict.flyAndBuyForm.title} | Punta Cana Investments`,
            description: dict.flyAndBuyForm.subtitle,
            url: canonicalUrl,
            images: [`${baseUrl}/images/fly-and-buy/premium.jpg`],
        }
    };
}

export default async function FlyAndBuyFormPage({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-primary-black text-white">
            <Navbar dict={dict.nav} lang={lang} servicesList={dict.sections.services.items} propertyTypes={dict.properties.types} variant="solid" />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-gold mb-4">
                        {dict.flyAndBuyForm.title}
                    </h1>
                    <p className="text-xl text-gray-300 font-light">
                        {dict.flyAndBuyForm.subtitle}
                    </p>
                </div>

                <FlyAndBuyForm dict={dict.flyAndBuyForm} lang={lang} />
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
