import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const mediaPaths = [
  '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782425064815.jpg',
  '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782425074977.jpg',
  '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782425099461.jpg',
  '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782425194177.png'
];

async function main() {
  try {
    const documentId = 'rhCr873ocQgsT58wdCXhjd';
    
    console.log('Uploading 4 new images to Sanity (Batch 8)...');
    const uploadedAssets = [];
    
    for (const filePath of mediaPaths) {
      if (fs.existsSync(filePath)) {
        console.log(`Uploading ${filePath}...`);
        const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
          filename: path.basename(filePath)
        });
        uploadedAssets.push({
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        });
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    }
    
    if (uploadedAssets.length > 0) {
      console.log(`Patching property ${documentId} to append ${uploadedAssets.length} images...`);
      // We append to the existing gallery using `insert` or `setIfMissing`
      const res = await client.patch(documentId)
        .setIfMissing({ gallery: [] })
        .insert('after', 'gallery[-1]', uploadedAssets)
        .commit();
        
      console.log('Gallery updated successfully! Total images added:', uploadedAssets.length);
    } else {
      console.log('No images uploaded.');
    }
  } catch (error) {
    console.error('Error appending images:', error);
  }
}

main();
