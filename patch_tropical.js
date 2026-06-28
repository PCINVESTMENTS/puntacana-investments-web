const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: process.env.SANITY_API_TOKEN
});

async function run() {
  try {
    const res = await client
      .patch('apartamentos-tropical-breeze-brisas-punta-cana')
      .set({ image: '/images/tropical-breezes-main-facade-punta-cana.jpg' })
      .commit();
    console.log('Success:', res._id);
  } catch (e) {
    console.error('Error:', e);
  }
}
run();
