const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function run() {
    const properties = await client.fetch(`*[_type == "property"]{id, "es": title.es, _id, "galleryCount": count(gallery)}`);
    console.log(properties);
}

run().catch(console.error);
