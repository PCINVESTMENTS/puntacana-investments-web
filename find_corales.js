const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function run() {
    const properties = await client.fetch(`*[_type == "property"]{id, "title": title.es, price, _id}`);
    properties.forEach(p => {
        if (p.title && (p.title.includes('Espectacular') || p.title.includes('Corales') || p.price === 6299000 || p.price === '6299000')) {
            console.log(p);
        }
    });
    console.log("Finished searching.");
}

run().catch(console.error);
