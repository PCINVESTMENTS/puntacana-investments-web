import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PropertyListings from "@/components/home/PropertyListings";
import { client } from "@/sanity/lib/client";
import { PROPERTIES_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty } from "@/sanity/lib/mappers";
import { Property, properties as localProperties } from "@/data/properties";
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

    // Fetch properties with Fallback Strategy
    let rawProperties: any[] = [];
    let source = "sanity";

    try {
        // 1. Try Sanity
        rawProperties = await client.fetch(PROPERTIES_QUERY);

        // 2. If Sanity is empty (and not just a filter issue), try Django
        if (!rawProperties || rawProperties.length === 0) {
            console.warn("⚠️ Sanity returned 0 properties. Switching to Django Web Fallback...");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-60b36.up.railway.app';
            const res = await fetch(`${apiUrl}/api/public/properties/`, { next: { revalidate: 60 } });

            if (res.ok) {
                const djangoData = await res.json();
                // Map Django Data to Sanity Interface Structure
                rawProperties = djangoData.map((d: any) => ({
                    _id: `django-${d.id}`,
                    title: d.title,
                    slug: d.slug,
                    price: parseFloat(d.price),
                    beds: d.bedrooms,
                    baths: d.bathrooms,
                    area: parseFloat(d.area_sqm),
                    locationLabel: d.location_label,
                    status: d.status === 'Disponible' ? 'sale' : 'sold', // Basic mapping
                    descriptionEs: d.description,
                    descriptionEn: d.description_en,
                    featured: d.is_featured,
                    main_image_url: d.main_image || d.main_image_url,
                    gallery_urls: d.gallery_urls || [], // Prefer raw URLs if available
                    features: d.features || { en: [], es: [] },
                    videoUrl: d.video_url,
                    virtualTourUrl: d.virtual_tour_url,
                    coordinates: { lat: parseFloat(d.latitude), lng: parseFloat(d.longitude) },
                    detailedSections: d.detailed_sections,
                    constructionStages: d.construction_stages,
                    completionPercent: d.completion_percent,
                    seo: {
                        title: { es: d.seo_title, en: d.seo_title },
                        description: { es: d.seo_description, en: d.seo_description },
                        keywords: { es: d.seo_keywords?.split(',') || [], en: d.seo_keywords?.split(',') || [] }
                    }
                }));
                source = "django";
                console.log(`✅ Loaded ${rawProperties.length} properties from Django Fallback.`);
            } else {
                console.error("❌ Django Fallback failed:", res.status, res.statusText);
            }
        }
    } catch (error) {
        console.error("❌ Sanity Fetch Error:", error);
        // Retry Django in catch block
        try {
            console.warn("⚠️ Retrying with Django Fallback after Sanity error...");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-60b36.up.railway.app';
            const res = await fetch(`${apiUrl}/api/public/properties/`, { next: { revalidate: 60 } });
            if (res.ok) {
                const djangoData = await res.json();
                rawProperties = djangoData.map((d: any) => ({
                    _id: `django-${d.id}`,
                    title: d.title,
                    slug: d.slug,
                    price: parseFloat(d.price),
                    beds: d.bedrooms,
                    baths: d.bathrooms,
                    area: parseFloat(d.area_sqm),
                    locationLabel: d.location_label,
                    status: d.status === 'Disponible' ? 'sale' : 'sold',
                    descriptionEs: d.description,
                    descriptionEn: d.description_en,
                    featured: d.is_featured,
                    main_image_url: d.main_image || d.main_image_url,
                    gallery_urls: d.gallery_urls || [],
                    features: d.features || { en: [], es: [] },
                    videoUrl: d.video_url,
                    virtualTourUrl: d.virtual_tour_url,
                    coordinates: { lat: parseFloat(d.latitude), lng: parseFloat(d.longitude) },
                    detailedSections: d.detailed_sections,
                    constructionStages: d.construction_stages,
                    completionPercent: d.completion_percent,
                    seo: {
                        title: { es: d.seo_title, en: d.seo_title },
                        description: { es: d.seo_description, en: d.seo_description },
                        keywords: { es: d.seo_keywords?.split(',') || [], en: d.seo_keywords?.split(',') || [] }
                    }
                }));
                source = "django";
            }
        } catch (e) {
            console.error("❌ Fatal: Both Sanity and Django failed.", e);
        }
    }

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
