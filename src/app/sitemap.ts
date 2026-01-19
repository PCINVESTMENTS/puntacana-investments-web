import { MetadataRoute } from 'next'
import { client } from "@/sanity/lib/client";
import { PROPERTIES_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty } from "@/sanity/lib/mappers";
import { Property, properties as localProperties } from "@/data/properties";

// In ISR mode, this will run at build time and revalidate every hour
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';

    // 1. Fetch Key Pages
    const staticRoutes = [
        '',
        '/properties',
        '/investments',
        '/blog',
        '/contact',
        '/about',
        '/locations',
    ];

    // 2. Fetch Properies from Sanity & Local
    const rawProperties = await client.fetch(PROPERTIES_QUERY);
    const fetchedProperties: Property[] = rawProperties.map(mapSanityProperty);

    // Merge logic
    const localMap = new Map(localProperties.map(p => [p.id, p]));
    const unitedProperties = fetchedProperties.map(p => {
        const local = localMap.get(p.id);
        if (local) {
            localMap.delete(p.id);
            return local;
        }
        return p;
    });
    const allProperties = [...unitedProperties, ...Array.from(localMap.values())];

    // 3. Generate Entries for Languages (ES / EN)
    const languages = ['es', 'en'];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Static Pages
    staticRoutes.forEach(route => {
        languages.forEach(lang => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}${route}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: route === '' ? 1.0 : 0.8,
            });
        });
    });

    // Property Pages
    allProperties.forEach(property => {
        languages.forEach(lang => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}/properties/${property.slug}`,
                lastModified: new Date(), // Ideal if we had updatedAt from Sanity
                changeFrequency: 'daily',
                priority: 0.8,
            });
        });
    });

    return sitemapEntries;
}
