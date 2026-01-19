import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import ServicesSection from "@/components/home/ServicesSection";

export default async function ServicesPage({ params }: { params: Promise<{ lang: 'es' | 'en' }> }) {
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
                <ServicesSection dict={dict.sections.services} lang={lang} />
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
