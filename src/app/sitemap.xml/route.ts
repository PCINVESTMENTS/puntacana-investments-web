export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puntacanainvesment.com';

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemaps/properties-es.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemaps/properties-en.xml</loc>
  </sitemap>
</sitemapindex>`;

    return new Response(sitemapIndex, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
