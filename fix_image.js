const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function fixImage() {
  const propertyId = 'FAM7sl14R2NFN68aB3Bdus';
  try {
    const doc = await client.getDocument(propertyId);
    if (doc.image && !doc.mainImage) {
      await client.patch(propertyId)
        .set({ mainImage: doc.image })
        .unset(['image'])
        .commit();
      console.log('Fixed mainImage for second property!');
    } else {
      console.log('mainImage already exists or image is missing.');
    }
  } catch (err) {
    console.error(err);
  }
}

fixImage();
