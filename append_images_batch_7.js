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

const PROPERTY_ID = 99995;

const imagesToUpload = [
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577420869.png',
        alt: 'Punta Cana Investments - Luxury bedroom in modern villa at Corales Golf Course'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577429067.jpg',
        alt: 'Modern luxury home Dominican Republic - Bedroom details in Villa Jaguey'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577441205.jpg',
        alt: 'Contemporary villa Punta Cana - Outdoor pavilion and pool at Puntacana Resort'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577448969.png',
        alt: 'Corales Puntacana Resort - Elegant suite with golf views in modern mansion'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577461992.jpg',
        alt: 'Mansión moderna Punta Cana - Exterior entertainment areas and golf views'
    }
];

async function appendImages() {
    console.log(`Finding property with id ${PROPERTY_ID}...`);
    const property = await client.fetch(`*[_type == "property" && id == ${PROPERTY_ID}][0]`);
    
    if (!property) {
        console.error(`Property with id ${PROPERTY_ID} not found!`);
        return;
    }
    console.log(`Found property: ${property.title.es} (_id: ${property._id})`);
    
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
        
    console.log('Successfully appended the 7th batch of images!');
}

appendImages().catch(console.error);
