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
  { name: 'media__1782649448422.jpg', alt: 'Cocina moderna totalmente equipada con desayunador y electrodomésticos de acero inoxidable en Epic Punta Cana.' },
  { name: 'media__1782649473153.jpg', alt: 'Habitación principal con cama queen size, excelente iluminación natural y decoración contemporánea.' },
  { name: 'media__1782649487452.jpg', alt: 'Cómoda sala de estar de concepto abierto con sofá gris y detalles decorativos modernos.' },
  { name: 'media__1782649497186.jpg', alt: 'Baño completo con ducha de cristal, revestimiento cerámico de alta calidad y diseño elegante.' },
  { name: 'media__1782649505380.jpg', alt: 'Detalle del desayunador integrado a la cocina con topes de granito y diseño ergonómico.' }
];

async function appendImages() {
  try {
    console.log('Fetching property document...', propertyId);
    const property = await client.getDocument(propertyId);
    
    if (!property) {
      console.error('Property not found in Sanity.');
      return;
    }

    console.log('Uploading new images...');
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
    
    // Check if gallery exists, otherwise initialize it
    const existingGallery = property.gallery || [];
    
    // Append the new images to the existing gallery array
    console.log('Patching property document...');
    const updatedProperty = await client
      .patch(propertyId)
      .setIfMissing({ gallery: [] })
      .append('gallery', newGalleryItems)
      .commit();

    console.log('Property gallery updated successfully:', updatedProperty._id);
  } catch (error) {
    console.error('Error appending images:', error);
  }
}

appendImages();
