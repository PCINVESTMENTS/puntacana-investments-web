const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function fixGrandeFeatures() {
  const _id = 'villas-perla-del-mar-white-sands';
  
  const doc = await client.getDocument(_id);
  if (!doc) return;

  const featuresEn = (doc.features?.en || doc.featuresEn || []).filter(f => !f.toLowerCase().includes('rooftop') && !f.toLowerCase().includes('picuzzi'));
  const featuresEs = (doc.features?.es || doc.featuresEs || []).filter(f => !f.toLowerCase().includes('rooftop') && !f.toLowerCase().includes('picuzzi'));
  const featuresFr = (doc.features?.fr || doc.featuresFr || []).filter(f => !f.toLowerCase().includes('rooftop') && !f.toLowerCase().includes('picuzzi') && !f.toLowerCase().includes('toit'));

  await client.patch(_id)
    .set({
      featuresEn: featuresEn,
      featuresEs: featuresEs,
      featuresFr: featuresFr
    })
    // Unset the old nested object to avoid confusion if possible, but let's just leave it or unset it
    .unset(['features'])
    .commit();
    
  console.log("Fixed Grande Villa features fields to match GROQ query.");
}

fixGrandeFeatures().catch(console.error);
