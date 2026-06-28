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
  { name: 'media__1782574448750.jpg', alt: 'Amplia sala de estar de concepto abierto con sofás blancos, sillas de ratán y vistas a la piscina en Villa Jaguey.' },
  { name: 'media__1782574460206.jpg', alt: 'Majestuoso gazebo de madera con mesa de comedor al aire libre para múltiples comensales en Punta Cana.' },
  { name: 'media__1782574468711.jpg', alt: 'Elegante zona de descanso y comedor bajo el techo artesanal de madera del gazebo con vistas al jardín.' },
  { name: 'media__1782574476474.jpg', alt: 'Vista desde el interior del gazebo hacia la piscina privada y el exuberante patio tropical en Villa Jaguey.' },
  { name: 'media__1782574485758.jpg', alt: 'Acogedora entrada techada en madera artesanal con paredes de piedra coralina y paisajismo tropical en Punta Cana Resort.' }
];

async function appendImages() {
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

    console.log('Images uploaded successfully. Appending to property gallery...');

    await client
      .patch(property._id)
      .setIfMissing({ gallery: [] })
      .append('gallery', uploadedImages)
      .commit();

    console.log('Property gallery updated successfully.');
  } catch (error) {
    console.error('Error updating property:', error);
  }
}

appendImages();
