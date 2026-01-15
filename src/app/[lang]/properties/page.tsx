import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/PageSections";
import PropertyListings from "@/components/home/PropertyListings";

export default async function PropertiesPage({ params }: { params: Promise<{ lang: 'es' | 'en' }> }) {
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
                <PropertyListings
                    dict={dict.properties}
                    lang={lang}
                    locations={dict.sections.locations.items}
                    initialFilters={{}} // Show all by default (or let params handle it)
                />
            </div>

            <Footer dict={dict} />
        </main>
    );
}
