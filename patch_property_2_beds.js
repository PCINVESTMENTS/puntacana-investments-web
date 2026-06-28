const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function updateBedsBaths() {
  const propertyId = 'FAM7sl14R2NFN68aB3Bdus';
  try {
    console.log(`Patching beds and baths for ${propertyId}...`);
    await client.patch(propertyId)
      .set({ beds: 7, baths: 7.5 })
      .commit();
      
    console.log(`Successfully updated beds and baths for ${propertyId}`);
  } catch (err) {
    console.error('Error updating property:', err);
  }
}

updateBedsBaths();
