import { createClient } from '@sanity/client';
import fs from 'fs';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function createPartnerAndUploadImage() {
  try {
    const filePath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1783792664307.png';
    
    console.log(`Uploading logo from ${filePath}...`);
    const imageAsset = await client.assets.upload('image', fs.createReadStream(filePath), {
      filename: 'prive-real-estate-logo.png'
    });
    console.log('Logo uploaded successfully. Asset ID:', imageAsset._id);

    console.log('Creating partner: Privé Real Estate...');
    const partner = {
      _type: 'partner',
      name: 'Privé Real Estate',
      description_es: 'Firma inmobiliaria internacional especializada en el mercado mexicano, enfocada en ofrecer propiedades exclusivas y destacando en la captación y venta de hoteles y resorts.',
      description_en: 'International real estate firm specialized in the Mexican market, focused on offering exclusive properties and excelling in the acquisition and sale of hotels and resorts.',
      description_fr: 'Cabinet immobilier international spécialisé dans le marché mexicain, axé sur l\'offre de propriétés exclusives et se distinguant dans l\'acquisition et la vente d\'hôtels et de complexes.',
      website_url: 'https://priverealestate.mx/',
      order: 2,
      logo: {
        _type: 'image',
        asset: {
          _type: "reference",
          _ref: imageAsset._id
        }
      }
    };

    const res = await client.create(partner);
    console.log('Partner Privé Real Estate created successfully! Document ID:', res._id);
  } catch (err) {
    console.error('Error:', err);
  }
}

createPartnerAndUploadImage();
