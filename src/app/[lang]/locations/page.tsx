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
