const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN
});

async function run() {
  const query = `*[_type == "property" && id == 999][0]{ _id, descriptionEn, descriptionFr }`;
  const data = await client.fetch(query);
  console.log(JSON.stringify(data, null, 2));
}
run().catch(console.error);
