import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ServicesSection from "@/components/home/ServicesSection";

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';
    const canonicalUrl = `${baseUrl}/${lang}/services`;

    return {
        title: `${dict.sections.services.title} | Punta Cana Investments`,
        description: dict.sections.services.description,
        keywords: lang === 'es'
            ? ['Administración de propiedades Punta Cana', 'Asesoría legal inmobiliaria República Dominicana', 'Abogados inmobiliarios Punta Cana']
            : lang === 'fr'
            ? ['Gestion immobilière Punta Cana', 'Avocat immobilier Punta Cana', 'Conseil juridique immobilier République Dominicaine']
            : ['Punta Cana property management', 'Punta Cana real estate lawyer', 'Dominican Republic real estate legal advice'],
        openGraph: {
            title: `${dict.sections.services.title} | Punta Cana Investments`,
            description: dict.sections.services.description,
            url: canonicalUrl,
            images: [
                {
                    url: `${baseUrl}/images/services-team-horizontal.jpg`,
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

    return (
        <main className="min-h-screen bg-primary-black">
            <Navbar
                dict={dict.nav}
                lang={lang}
                servicesList={dict.sections.services.items}
                propertyTypes={dict.properties.types}
            />

            <div className="pt-20">
                {/* Reusing ServicesSection but without a limit to show all */}
                <ServicesSection 
                    dict={dict.sections.services} 
                    lang={lang} 
                    heroImage="/images/services-team-horizontal.jpg"
                />
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
