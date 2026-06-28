const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function run() {
    const property = await client.fetch(`*[_type == "property" && id == 99993][0]`);
    console.log("Slug:", property.slug);
    console.log("SEO Title:", property.seo?.title);
    console.log("SEO Description:", property.seo?.description);
    console.log("SEO Keywords (ES length):", property.seo?.keywords?.es?.length);
    console.log("SEO Keywords (EN length):", property.seo?.keywords?.en?.length);
}

run().catch(console.error);
