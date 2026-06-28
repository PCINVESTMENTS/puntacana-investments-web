const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function run() {
    const property = await client.fetch(`*[_type == "property" && id == 99994][0]`);
    console.log("Slug:", property.slug);
    console.log("SEO Title:", property.seo?.title);
    console.log("SEO Description:", property.seo?.description);
    console.log("SEO Keywords (ES):", property.seo?.keywords?.es);
    console.log("SEO Keywords (EN):", property.seo?.keywords?.en);
}

run().catch(console.error);
