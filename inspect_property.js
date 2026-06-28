import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function main() {
  try {
    const existing = await client.fetch('*[_type == "property" && id != 99991][0]');
    console.log("Existing Property Sample:");
    console.log(JSON.stringify(existing, null, 2));

    const mine = await client.fetch('*[_type == "property" && id == 99991][0]');
    console.log("\nMy Property:");
    console.log(JSON.stringify(mine, null, 2));
  } catch (error) {
    console.error('Error fetching properties:', error);
  }
}

main();
