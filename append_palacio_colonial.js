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
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782578659617.jpg',
        alt: 'Biblioteca y oficina de lujo en palacio colonial Puntacana Resort'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782578669856.png',
        alt: 'Cocina moderna de chef con estufa La Cornue en mansión Punta Cana'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782578677769.jpg',
        alt: 'Imponente fachada con columnas en palacio colonial Corales Punta Cana'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782578685788.png',
        alt: 'Suite principal con cama de bambú y vistas al golf en villa de lujo'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782578694600.jpg',
        alt: 'Amplios jardines tropicales con vistas al lago y campo de golf Corales'
    }
];

async function appendImages() {
    console.log(`Finding property with id ${PROPERTY_ID}...`);
    const property = await client.fetch(`*[_type == "property" && id == ${PROPERTY_ID}][0]`);
    
    if (!property) {
        console.error(`Property with id ${PROPERTY_ID} not found!`);
        return;
    }
    console.log(`Found property: ${property.title} (_id: ${property._id})`);
    
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
        
    console.log('Successfully appended the images for Palacio Colonial!');
}

appendImages().catch(console.error);
