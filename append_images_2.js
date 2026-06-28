const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const propertyId = 'FAM7sl14R2NFN68aB3Bdus';
const imagesPath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056';
const files = [
  'media__1782430216360.jpg',
  'media__1782430226641.jpg',
  'media__1782430243276.jpg',
  'media__1782430252013.jpg',
  'media__1782430259975.jpg'
];

async function appendImages() {
  try {
    console.log('Uploading 5 additional images...');
    const uploadedImages = [];
    
    for (const file of files) {
      console.log('Uploading ' + file + '...');
      const stream = fs.createReadStream(path.join(imagesPath, file));
      const asset = await client.assets.upload('image', stream, {
        filename: file
      });
      uploadedImages.push({
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id }
      });
    }

    console.log('Images uploaded successfully. Appending to property...');
    
    // Patch property to append to gallery array
    await client.patch(propertyId)
      .setIfMissing({ gallery: [] })
      .append('gallery', uploadedImages)
      .commit({ autoGenerateArrayKeys: true });

    console.log('Successfully appended 5 images to the gallery of property', propertyId);
  } catch (error) {
    console.error('Error appending images:', error);
  }
}

appendImages();
