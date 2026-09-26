import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com'

    return {
        rules: [
            // 1. Authorized AI Search & Discovery and User-Initiated Fetchers
            {
                userAgent: [
                    'OAI-SearchBot',
                    'ChatGPT-User',
                    'ChatGPT',
                    'Claude-SearchBot',
                    'Claude-User',
                    'PerplexityBot',
                    'Perplexity-User',
                    'Applebot'
                ],
                allow: ['/'],
                disallow: ['/api/', '/studio/'],
            },
            // 2. Block Model Training and Bulk Scrapers
            {
                userAgent: [
                    'GPTBot',
                    'Google-Extended',
                    'Applebot-Extended',
                    'CCBot'
                ],
                disallow: ['/'],
            },
            // 3. General Policy for Traditional Search Engines and Standard Clients
            {
                userAgent: '*',
                allow: ['/'],
                disallow: ['/api/', '/studio/'],
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
