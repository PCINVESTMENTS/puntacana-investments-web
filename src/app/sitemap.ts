import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { defineQuery } from 'next-sanity';

const BASE_URL = 'https://puntacanainvesment.com';

const SITEMAP_QUERY = defineQuery(`
  {
    "properties": *[_type == "property"] { "id": id, "_updatedAt": _updatedAt },
    "posts": *[_type == "post"] { "slug": slug.current, "publishedAt": publishedAt }
  }
`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { properties, posts } = await client.fetch(SITEMAP_QUERY);

    const staticRoutes = [
        '',
        '/blog',
        '/contact',
        '/privacy-policy',
        '/terms-of-service',
    ];

    const languages = ['es', 'en'];

    const routes: MetadataRoute.Sitemap = [];

    // Static Routes
    languages.forEach((lang) => {
        staticRoutes.forEach((route) => {
            routes.push({
                url: `${BASE_URL}/${lang}${route}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: route === '' ? 1 : 0.8,
            });
        });
    });

    // Dynamic Property Routes
    properties.forEach((property: any) => {
        languages.forEach((lang) => {
            routes.push({
                url: `${BASE_URL}/${lang}/properties/${property.id}`,
                lastModified: new Date(property._updatedAt),
                changeFrequency: 'weekly',
                priority: 0.9,
            });
        });
    });

    // Dynamic Blog Routes
    posts.forEach((post: any) => {
        languages.forEach((lang) => {
            routes.push({
                url: `${BASE_URL}/${lang}/blog/${post.slug}`,
                lastModified: new Date(post.publishedAt),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        });
    });

    return routes;
}
