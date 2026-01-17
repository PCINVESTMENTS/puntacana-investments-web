import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/PageSections";
import PropertyListings from "@/components/home/PropertyListings";
import { client } from "@/sanity/lib/client";
import { PROPERTIES_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty } from "@/sanity/lib/mappers";
import { Property, properties as localProperties } from "@/data/properties";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
    params,
    searchParams
}: {
    params: Promise<{ lang: 'es' | 'en' }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const resolvedSearchParams = await searchParams;
    const dict = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puntacanainvesment.com';

    // SEO LOGIC:
    // If ANY search params exist (filters), NOINDEX but FOLLOW.
    // Canonical ALWAYS points to the clean URL (without params).
    const hasFilters = Object.keys(resolvedSearchParams || {}).length > 0;

    return {
        title: dict.properties.title + ' | Punta Cana Investments',
        description: dict.properties.subtitle,
        robots: {
            index: !hasFilters,
            follow: true,
        },
        alternates: {
            canonical: `${baseUrl}/${lang}/properties`,
            languages: {
                es: `${baseUrl}/es/properties`,
                en: `${baseUrl}/en/properties`,
                'x-default': `${baseUrl}/en/properties`
            }
        }
    };
}

// Separate function for the component to keep it clean
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

    // Merge logic:
    // 1. Create a map of local properties for quick lookup
    const localMap = new Map(localProperties.map(p => [p.id, p]));

    // 2. Map fetched properties, overriding with local if exists
    const unitedProperties = fetchedProperties.map(p => {
        const local = localMap.get(p.id);
        if (local) {
            localMap.delete(p.id); // Remove from map so we know it's used
            return local;
        }
        return p;
    });

    // 3. Add remaining local properties that weren't in fetched
    const properties = [...unitedProperties, ...Array.from(localMap.values())].sort((a, b) => {
        // Optional: Sort by ID or some other criteria to keep stable order
        return a.id - b.id;
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
