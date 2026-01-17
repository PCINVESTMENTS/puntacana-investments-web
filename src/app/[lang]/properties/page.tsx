import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/PageSections";
import PropertyListings from "@/components/home/PropertyListings";
import { client } from "@/sanity/lib/client";
import { PROPERTIES_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty } from "@/sanity/lib/mappers";
import { Property, properties as localProperties } from "@/data/properties";

export const revalidate = 60;

export default async function PropertiesPage({
    params,
    searchParams
}: {
    params: Promise<{ lang: 'es' | 'en' }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { lang } = await params;
    const resolvedSearchParams = await searchParams;
    const dict = await getDictionary(lang);

    // Fetch properties
    const rawProperties = await client.fetch(PROPERTIES_QUERY);
    const fetchedProperties: Property[] = rawProperties.map(mapSanityProperty);

    // Merge with local overrides
    const properties = fetchedProperties.map(p => {
        const local = localProperties.find(lp => lp.id === p.id);
        return local || p;
    });

    // Extract status for initial filtering
    const statusParam = typeof resolvedSearchParams?.status === 'string' ? resolvedSearchParams.status : undefined;

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
                    initialFilters={{ status: statusParam }}
                    initialData={properties}
                />
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
