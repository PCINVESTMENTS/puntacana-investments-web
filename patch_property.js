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
    const res = await client.patch('rhCr873ocQgsT58wdCXhjd').set({ id: 99991 }).commit();
    console.log('Property patched successfully:', res._id);
  } catch (error) {
    console.error('Error patching property:', error);
  }
}

main();
