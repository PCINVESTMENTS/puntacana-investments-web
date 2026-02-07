import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PropertyListings from "@/components/home/PropertyListings";
import { client } from "@/sanity/lib/client";
import { PROPERTIES_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty } from "@/sanity/lib/mappers";
import { Property } from "@/data/properties";
import type { Metadata } from "next";

// Restoring ISR to fix build panic. searchParams removed from generateMetadata to avoid dynamic bail-out issues in Turbopack.
export const revalidate = 60;

export async function generateMetadata({
    params
}: {
    params: Promise<{ lang: 'es' | 'en' }>;
}): Promise<Metadata> {
    const { lang } = await params;
    // searchParams removed to ensure static stability during build

    const dict = await getDictionary(lang);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';

    return {
        title: dict.properties.title + ' | Punta Cana Investments',
        description: dict.properties.subtitle,
        // Default robots allow index/follow
        robots: {
            index: true,
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

    // Use fetched properties directly
    const properties = fetchedProperties.sort((a, b) => {
        return a.id - b.id;
    });

    // Extract parameters for initial filtering
    const statusParam = typeof resolvedSearchParams?.status === 'string' ? resolvedSearchParams.status : undefined;
    const locationParam = typeof resolvedSearchParams?.location === 'string' ? resolvedSearchParams.location : undefined;
    const typeParam = typeof resolvedSearchParams?.type === 'string' ? resolvedSearchParams.type : undefined;

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
                    initialFilters={{
                        status: statusParam,
                        location: locationParam,
                        type: typeParam
                    }}
                    initialData={properties}
                />
            </div>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
