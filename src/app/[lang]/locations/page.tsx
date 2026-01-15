import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer, LocationsSection } from "@/components/home/PageSections";

export default async function LocationsPage({ params }: { params: Promise<{ lang: 'es' | 'en' }> }) {
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
                <LocationsSection dict={dict.sections.locations} lang={lang} />
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
