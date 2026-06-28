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
  { name: 'media__1782650198706.jpg', alt: 'Vista desde el desayunador hacia la acogedora sala de estar en Epic Punta Cana.' },
  { name: 'media__1782650205725.jpg', alt: 'Detalle del montaje en el desayunador con elegantes platos de cerámica y elementos decorativos.' },
  { name: 'media__1782650212453.jpg', alt: 'Cocina completamente equipada mostrando nevera de acero inoxidable y estufa moderna.' },
  { name: 'media__1782650218589.jpg', alt: 'Rincón de la sala con un sofá cama gris, mesas de centro de diseño y decoración de pared texturizada.' },
  { name: 'media__1782650246439.jpg', alt: 'Divertida zona de juegos acuáticos infantiles con aros coloridos y fuentes de agua en Epic Residences.' }
];

async function updatePropertyAndAppendImages() {
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
    
    console.log('Patching property document...');
    const updatedProperty = await client
      .patch(propertyId)
      .setIfMissing({ gallery: [] })
      .append('gallery', newGalleryItems)
      .set({
          bedrooms: 1,
          bathrooms: 1,
          featuresEs: ["Piscina estilo resort", "Áreas sociales exclusivas", "Paisajismo impecable", "Seguridad 24/7", "Balcón privado", "Airbnb Friendly", "Juegos infantiles acuáticos"],
          featuresEn: ["Resort-style pool", "Exclusive social areas", "Impeccable landscaping", "24/7 security", "Private balcony", "Airbnb Friendly", "Kids splash pad"],
          featuresFr: ["Piscine de style complexe", "Espaces sociaux exclusifs", "Aménagement paysager impeccable", "Sécurité 24/7", "Balcon privé", "Airbnb Friendly", "Jeux d'eau pour enfants"]
      })
      .commit();

    console.log('Property gallery and amenities updated successfully:', updatedProperty._id);
  } catch (error) {
    console.error('Error appending images:', error);
  }
}

updatePropertyAndAppendImages();
