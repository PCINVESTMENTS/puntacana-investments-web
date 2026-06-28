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
  { name: 'media__1782575309676.jpg', alt: 'Alojamiento principal con llamativo mueble de televisión rojo y elegante techo de madera a dos aguas en Punta Cana.' },
  { name: 'media__1782575346928.jpg', alt: 'Habitación doble con techo rústico de madera, cama oscura y detalles de diseño vibrantes en Villa Jaguey.' },
  { name: 'media__1782575355598.jpg', alt: 'Terraza exterior soleada con comedor bajo sombrilla y asientos de madera, ideal para disfrutar del clima tropical.' },
  { name: 'media__1782575368567.jpg', alt: 'Exclusivo pabellón de spa privado en Villa Jaguey con camilla de masajes, detalles zen y rústica piedra coralina.' },
  { name: 'media__1782575377765.jpg', alt: 'Mesa de comedor formal bellamente decorada bajo el imponente techo del gazebo con espectaculares vistas al golf.' }
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
