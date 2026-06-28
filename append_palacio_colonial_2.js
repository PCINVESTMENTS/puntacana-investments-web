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

const PROPERTY_ID = 99993;

const imagesToUpload = [
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782578861506.jpg',
        alt: 'Fachada principal y piscina infinita del Palacio Colonial en Puntacana Resort'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782578869166.jpg',
        alt: 'Arquitectura colonial de ultra lujo con piscina y jardines en Corales Punta Cana'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782578879515.png',
        alt: 'Excéntrico diseño interior de sala de estar en mansión Punta Cana Investments'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782578893910.jpg',
        alt: 'Patio interior adoquinado con exuberante paisajismo tropical en villa de lujo'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782578907783.jpg',
        alt: 'Larga piscina con diseño elegante bordeando fachada trasera en Corales Golf Course'
    }
];

async function appendImages() {
    console.log(`Finding property with id ${PROPERTY_ID}...`);
    const property = await client.fetch(`*[_type == "property" && id == ${PROPERTY_ID}][0]`);
    
    if (!property) {
        console.error(`Property with id ${PROPERTY_ID} not found!`);
        return;
    }
    console.log(`Found property: ${property.title || property.titleEs} (_id: ${property._id})`);
    
    const newGalleryItems = [];
    
    for (const img of imagesToUpload) {
        console.log(`Uploading ${path.basename(img.filepath)}...`);
        const buffer = fs.readFileSync(img.filepath);
        
        const asset = await client.assets.upload('image', buffer, {
            filename: path.basename(img.filepath)
        });
        
        console.log(`Uploaded asset: ${asset._id}`);
        
        newGalleryItems.push({
            _key: Math.random().toString(36).substring(7),
            _type: 'image',
            asset: {
                _type: 'reference',
                _ref: asset._id
            },
            alt: img.alt
        });
    }
    
    console.log(`Appending ${newGalleryItems.length} images to the gallery...`);
    
    await client.patch(property._id)
        .setIfMissing({ gallery: [] })
        .append('gallery', newGalleryItems)
        .commit();
        
    console.log('Successfully appended the 2nd batch of images for Palacio Colonial!');
}

appendImages().catch(console.error);
