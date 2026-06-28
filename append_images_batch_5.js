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
  { name: 'media__1782575118026.jpg', alt: 'Lujoso baño principal con tocador doble de madera y elegante pared decorativa de piedra coralina en Punta Cana.' },
  { name: 'media__1782575128093.jpg', alt: 'Amplia habitación secundaria con techos altos de madera, ventilador de aspas y decoración tropical elegante.' },
  { name: 'media__1782575136093.jpg', alt: 'Espacioso dormitorio principal con sala de estar integrada, muebles modernos y hermosos techos de madera artesanal.' },
  { name: 'media__1782575145605.jpg', alt: 'Acogedora habitación de huéspedes en Villa Jaguey con encantadora decoración de arte local en las paredes.' },
  { name: 'media__1782575153396.jpg', alt: 'Suite principal de lujo con techos abovedados, área de estar privada y puertas corredizas hacia balcón con vistas.' }
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

    console.log('Property gallery updated successfully. Total items in gallery now should be larger.');
  } catch (error) {
    console.error('Error updating property:', error);
  }
}

appendImages();
