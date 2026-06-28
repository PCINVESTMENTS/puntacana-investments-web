const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function uploadImage(filePath) {
  console.log(`Uploading ${filePath}...`);
  try {
    const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
      filename: path.basename(filePath)
    });
    return {
      _type: 'image',
      asset: {
        _type: "reference",
        _ref: asset._id
      }
    };
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    throw error;
  }
}

async function appendGallery() {
  const mediaDir = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056';
  
  const imageFiles = [
    'media__1782655403831.jpg',
    'media__1782655391548.jpg',
    'media__1782655385169.jpg'
  ].map(name => path.join(mediaDir, name));

  const newImages = [];
  for (const file of imageFiles) {
    const uploaded = await uploadImage(file);
    newImages.push(uploaded);
  }

  const propertyId = 'FAM7sl14R2NFN68aBZ6IGJ';

  console.log('Appending 3 new images to gallery in Sanity...');
  const updatedProperty = await client
    .patch(propertyId)
    .append('gallery', newImages)
    .commit();

  console.log('Gallery updated successfully:', updatedProperty._id);
}

appendGallery().catch(console.error);
