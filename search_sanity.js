const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function run() {
    const properties = await client.fetch(`*[_type == "property"]{id, price, "title": title.es, bedrooms, bathrooms}`);
    console.log(properties.filter(p => p.price === 6299000 || p.price === '6299000' || p.bedrooms === 7));
}

run().catch(console.error);
