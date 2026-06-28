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

const imagesPath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056';
const filesToAppend = [
  { name: 'media__1782574844460.png', alt: 'Cocina moderna totalmente equipada con isla central blanca, taburetes tejidos y electrodomésticos de acero inoxidable.' },
  { name: 'media__1782574862216.jpg', alt: 'Diseño arquitectónico único con patio interior privado que conecta los espacios de Villa Jaguey en Punta Cana.' },
  { name: 'media__1782574871454.png', alt: 'Espaciosa sala de estar principal con decoración tropical contemporánea y amplia entrada de luz natural.' },
  { name: 'media__1782574882792.jpg', alt: 'Elegantes interiores de concepto abierto en Villa Jaguey con puertas corredizas de cristal hacia el jardín.' },
  { name: 'media__1782574902215.jpg', alt: 'Impresionante vista desde el balcón superior hacia la piscina privada y los exuberantes campos de golf de Puntacana Resort.' }
];

async function appendImagesAndPrice() {
  try {
    console.log('Fetching property by ID...');
    const query = '*[_type == "property" && id == 99995][0]';
    const property = await client.fetch(query);

    if (!property) {
      console.log('Property not found!');
      return;
    }

    console.log('Property found:', property._id);
    console.log('Uploading new images...');
    const uploadedImages = [];

    for (const fileObj of filesToAppend) {
      console.log('Uploading ' + fileObj.name + '...');
      const stream = fs.createReadStream(path.join(imagesPath, fileObj.name));
      const asset = await client.assets.upload('image', stream, {
        filename: fileObj.name
      });
      uploadedImages.push({
        _type: 'image',
        _key: asset._id,
        asset: { _type: 'reference', _ref: asset._id },
        alt: fileObj.alt
      });
    }

    console.log('Images uploaded successfully. Appending to property gallery and updating price...');

    await client
      .patch(property._id)
      .setIfMissing({ gallery: [] })
      .append('gallery', uploadedImages)
      .set({ price: 2675000 })
      .commit();

    console.log('Property gallery and price updated successfully.');
  } catch (error) {
    console.error('Error updating property:', error);
  }
}

appendImagesAndPrice();
