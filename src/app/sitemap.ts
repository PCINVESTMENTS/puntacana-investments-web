import { MetadataRoute } from 'next'
import { client } from "@/sanity/lib/client";
import { PROPERTIES_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty } from "@/sanity/lib/mappers";
import { Property } from "@/data/properties";

// In ISR mode, this will run at build time and revalidate every hour
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';

    // 1. Fetch Key Pages
    const staticRoutes = [
        '',
        '/properties',
        '/investments',
        '/investments/off-market',
        '/investments/due-diligence',
        '/blog',
        '/contact',
        '/about',
        '/locations',
        '/fly-and-buy',
        '/services',
    ];

    // 2. Fetch Properies from Sanity & Local
    const rawProperties = await client.fetch(PROPERTIES_QUERY);
    const fetchedProperties: Property[] = rawProperties.map(mapSanityProperty);

    // Use fetched properties directly
    const allProperties = fetchedProperties;

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
