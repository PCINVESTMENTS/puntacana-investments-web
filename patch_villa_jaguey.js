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
  { name: 'media__1782574117097.jpg', alt: 'Exclusivo cuarto de spa y masajes con pared de piedra coralina rústica y luz natural en mansión de Punta Cana.' },
  { name: 'media__1782574125393.jpg', alt: 'Bañera tipo jacuzzi sobre plataforma de madera con vistas panorámicas al campo de golf en baño principal de lujo.' },
  { name: 'media__1782574138241.jpg', alt: 'Impresionante escalera de troncos de madera sobre jardín zen interior con piedras decorativas y paredes de coralina en Villa Jaguey.' },
  { name: 'media__1782574146222.jpg', alt: 'Lujosa habitación amueblada con impresionantes techos abovedados de madera y acceso directo a terraza en Puntacana Resort.' },
  { name: 'media__1782574156180.jpg', alt: 'Sereno patio interior con espejo de agua, fuente de pared en piedra rústica y paisajismo tropical en Punta Cana.' }
];

async function updateProperty() {
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
        _key: asset._id, // Add a key to prevent array append warnings
        asset: { _type: 'reference', _ref: asset._id },
        alt: fileObj.alt
      });
    }

    console.log('Images uploaded successfully. Patching property...');

    // Replace "3:" with "un" in all language titles
    const newTitleEs = property.titleEs.replace('3:', 'un').replace('3 :', 'un');
    const newTitleEn = property.titleEn.replace('3:', 'a').replace('3 :', 'a'); // Translate "un" to "a" for English
    const newTitleFr = property.titleFr.replace('3:', 'une').replace('3 :', 'une'); // Translate "un" to "une" for French (Retraite is feminine)
    
    // Also fix the main title
    const newTitle = property.title.replace('3:', 'un').replace('3 :', 'un');

    await client
      .patch(property._id)
      .set({
        title: newTitle,
        titleEs: newTitleEs,
        titleEn: newTitleEn,
        titleFr: newTitleFr
      })
      // If gallery doesn't exist, create it. Otherwise, append.
      .setIfMissing({ gallery: [] })
      .append('gallery', uploadedImages)
      .commit();

    console.log('Property updated successfully.');
  } catch (error) {
    console.error('Error updating property:', error);
  }
}

updateProperty();
