import { client } from "@/sanity/lib/client";
import { PROPERTIES_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty } from "@/sanity/lib/mappers";
import { Property, properties as localProperties } from "@/data/properties";

// Force dynamic to avoid Turbopack build panic
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check if valid sitemap id
  if (!['properties-es.xml', 'properties-en.xml'].includes(id)) {
    return new Response('Not found', { status: 404 });
  }

  const lang = id.includes('-es') ? 'es' : 'en';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puntacanainvesment.com';

  // Fetch data
  const rawProperties = await client.fetch(PROPERTIES_QUERY);
  const fetchedProperties: Property[] = rawProperties.map(mapSanityProperty);

  // Merge logic (same as in pages)
  const localMap = new Map(localProperties.map(p => [p.id, p]));
  const unitedProperties = fetchedProperties.map(p => {
    const local = localMap.get(p.id);
    if (local) {
      localMap.delete(p.id);
      return local;
    }
    return p;
  });
  const properties = [...unitedProperties, ...Array.from(localMap.values())];

  const urls = properties.map(property => {
    return `
  <url>
    <loc>${baseUrl}/${lang}/properties/${property.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('');

  // Add list page
  const listPage = `
  <url>
    <loc>${baseUrl}/${lang}/properties</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${listPage}
  ${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
