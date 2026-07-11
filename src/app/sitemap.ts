import { MetadataRoute } from 'next'
import { client } from "@/sanity/lib/client";
import { PROPERTIES_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty, mapSanityPost } from "@/sanity/lib/mappers";
import { Property, properties as localProperties } from "@/data/properties";
import { BlogPost, blogPosts as localPosts } from "@/data/blog";

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
    const fetchedProperties: Property[] = rawProperties
        .map(mapSanityProperty)
        .filter((p: any): p is Property => p && typeof p.id === 'number' && !isNaN(p.id));

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

    // 2.5. Fetch Blog Posts from Sanity & Local
    const rawPosts = await client.fetch(POSTS_QUERY);
    const fetchedPosts: BlogPost[] = rawPosts.map(mapSanityPost);

    // Merge logic for posts
    const localPostMap = new Map(localPosts.map(p => [p.slug, p]));
    const unitedPosts = fetchedPosts.map(p => {
        const local = localPostMap.get(p.slug);
        if (local) {
            localPostMap.delete(p.slug);
            return { ...local, ...p }; // Sanity takes precedence
        }
        return p;
    });
    const allPosts = [...unitedPosts, ...Array.from(localPostMap.values())];

    // 3. Generate Entries for Languages (ES / EN / FR)
    const languages = ['es', 'en', 'fr'];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Static Pages
    staticRoutes.forEach(route => {
        languages.forEach(lang => {
            const alternateLanguages: Record<string, string> = {
                'x-default': `${baseUrl}/en${route}`,
            };
            languages.forEach(l => {
                alternateLanguages[l] = `${baseUrl}/${l}${route}`;
            });

            sitemapEntries.push({
                url: `${baseUrl}/${lang}${route}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: route === '' ? 1.0 : 0.8,
                alternates: {
                    languages: alternateLanguages
                }
            });
        });
    });

    // Property Pages
    allProperties.forEach(property => {
        languages.forEach(lang => {
            const alternateLanguages: Record<string, string> = {
                'x-default': `${baseUrl}/en/properties/${property.slug}`,
            };
            languages.forEach(l => {
                alternateLanguages[l] = `${baseUrl}/${l}/properties/${property.slug}`;
            });

            sitemapEntries.push({
                url: `${baseUrl}/${lang}/properties/${property.slug}`,
                lastModified: new Date(), // Ideal if we had updatedAt from Sanity
                changeFrequency: 'daily',
                priority: 0.8,
                alternates: {
                    languages: alternateLanguages
                }
            });
        });
    });

    // Blog Post Pages
    allPosts.forEach(post => {
        languages.forEach(lang => {
            const alternateLanguages: Record<string, string> = {
                'x-default': `${baseUrl}/en/blog/${post.slug}`,
            };
            languages.forEach(l => {
                alternateLanguages[l] = `${baseUrl}/${l}/blog/${post.slug}`;
            });

            sitemapEntries.push({
                url: `${baseUrl}/${lang}/blog/${post.slug}`,
                lastModified: new Date(post.publishedAt || new Date()),
                changeFrequency: 'weekly',
                priority: 0.7,
                alternates: {
                    languages: alternateLanguages
                }
            });
        });
    });

    return sitemapEntries;
}
