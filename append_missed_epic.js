const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

const propertyId = 'FAM7sl14R2NFN68aBYdcgc';
const imagesPath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056';

const files = [
  { name: 'media__1782649815655.jpg', alt: 'Vista adicional de los elegantes espacios interiores de Epic Punta Cana.' },
  { name: 'media__1782649825345.jpg', alt: 'Detalles de los acabados de primera categoría en el apartamento.' },
  { name: 'media__1782649832408.jpg', alt: 'Área confortable que destaca el diseño contemporáneo de la propiedad.' },
  { name: 'media__1782649838416.jpg', alt: 'Perspectiva del concepto abierto y la excelente iluminación natural.' },
  { name: 'media__1782649845916.jpg', alt: 'Detalles exclusivos de las amenidades y espacios del apartamento en Bávaro.' }
];

async function appendMissedImages() {
  try {
    const property = await client.getDocument(propertyId);
    
    if (!property) {
      console.error('Property not found in Sanity.');
      return;
    }

    console.log('Uploading 5 missed images...');
    const newGalleryItems = [];
    
    for (const fileObj of files) {
      console.log('Uploading ' + fileObj.name + '...');
      const stream = fs.createReadStream(path.join(imagesPath, fileObj.name));
      const asset = await client.assets.upload('image', stream, {
        filename: fileObj.name
      });
      newGalleryItems.push({
        _type: 'image',
        _key: 'img_' + Math.random().toString(36).substring(7),
        asset: { _type: 'reference', _ref: asset._id },
        alt: fileObj.alt
      });
    }

    console.log('Images uploaded successfully.');
    
    console.log('Patching property document...');
    const updatedProperty = await client
      .patch(propertyId)
      .setIfMissing({ gallery: [] })
      .append('gallery', newGalleryItems)
      .commit();

    console.log('Property gallery updated successfully:', updatedProperty._id);
  } catch (error) {
    console.error('Error appending missed images:', error);
  }
}

appendMissedImages();
