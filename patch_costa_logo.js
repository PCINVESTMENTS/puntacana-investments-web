const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const partnerId = 'DGlDn57Euy9w5oiahIQ8Jx';
const imagePath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/40cb42f2-3409-4d01-8b11-7be1026da440/media__1786143932378.png';

async function uploadLogo() {
  try {
    console.log('Uploading logo...');
    const stream = fs.createReadStream(imagePath);
    const asset = await client.assets.upload('image', stream, {
      filename: 'costa_hospitality_logo.png'
    });
    
    console.log('Logo uploaded successfully, patching partner document...');
    
    await client.patch(partnerId).set({
      logo: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      }
    }).commit();

    console.log('Partner document patched with logo successfully.');
  } catch (error) {
    console.error('Error uploading or patching:', error);
  }
}

uploadLogo();
