import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function uploadImage() {
  try {
    const documentId = 'SxD7A4pFC0uZMB7cecSWRA'; // Document ID from previous step
    const filePath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1783791479159.png';
    
    console.log(`Uploading image from ${filePath}...`);
    const imageAsset = await client.assets.upload('image', fs.createReadStream(filePath), {
      filename: 'global-real-estate-pro-logo.png'
    });
    console.log('Image uploaded. Asset ID:', imageAsset._id);

    console.log(`Patching document ${documentId}...`);
    await client.patch(documentId)
      .set({
        logo: {
          _type: 'image',
          asset: {
            _type: "reference",
            _ref: imageAsset._id
          }
        }
      })
      .commit();

    console.log('Document patched successfully with the golden logo!');
  } catch (err) {
    console.error('Error uploading image:', err);
  }
}

uploadImage();
