const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }
  return acc;
}, {});

const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: true,
});

async function check() {
  const query = `*[_type == "property" && title match "*Jaguey*"]{
    _id,
    title,
    "slug": slug.current,
    location,
    price,
    beds,
    baths,
    area
  }`;
  
  const properties = await client.fetch(query);
  console.log(JSON.stringify(properties, null, 2));
}

check().catch(console.error);
