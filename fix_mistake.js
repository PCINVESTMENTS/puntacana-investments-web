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

const PROPERTY_ID_ACTUAL = 99994;
const PROPERTY_ID_DUMMY = 99996;

const imagesToUpload = [
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577441205.jpg',
        alt: 'villa moderna en venta Punta Cana - Exterior and pool at Corales Puntacana Resort' 
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577461992.jpg',
        alt: 'mansión moderna Punta Cana - Outdoor entertainment pavilion with golf views' 
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577734617.png',
        alt: 'villa contemporánea Punta Cana - Modern living room interior design'
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577448969.png',
        alt: 'casas de lujo en campos de golf Punta Cana - Elegant suite with golf views' 
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577420869.png',
        alt: 'villa de ultra lujo Punta Cana - Master bedroom with wood ceiling fan' 
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577429067.jpg',
        alt: 'Puntacana Resort & Club - Modern bedroom rattan headboard details' 
    }
];

async function run() {
    // 1. Delete dummy
    try {
        const dummyQuery = await client.fetch(`*[_type == "property" && id == ${PROPERTY_ID_DUMMY}][0]`);
        if (dummyQuery) {
            console.log(`Deleting dummy property ${PROPERTY_ID_DUMMY}...`);
            await client.delete(dummyQuery._id);
            console.log('Dummy deleted.');
        }
    } catch (e) {
        console.log('Error deleting dummy', e.message);
    }

    // 2. Upload images and append to 99994
    console.log(`Finding actual property 99994...`);
    const actualProperty = await client.fetch(`*[_type == "property" && id == ${PROPERTY_ID_ACTUAL}][0]`);
    
    if (!actualProperty) {
        console.error('Actual property not found!');
        return;
    }
    
    console.log(`Uploading ${imagesToUpload.length} images...`);
    const newGalleryItems = [];
    
    for (const img of imagesToUpload) {
        console.log(`Uploading ${path.basename(img.filepath)}...`);
        const buffer = fs.readFileSync(img.filepath);
        const asset = await client.assets.upload('image', buffer, { filename: path.basename(img.filepath) });
        newGalleryItems.push({
            _key: Math.random().toString(36).substring(7),
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
            alt: img.alt
        });
    }
    
    console.log(`Appending ${newGalleryItems.length} images to property 99994...`);
    await client.patch(actualProperty._id)
        .setIfMissing({ gallery: [] })
        .append('gallery', newGalleryItems)
        .commit();
        
    console.log('Successfully updated the actual Corales Villa property!');
}

run().catch(console.error);
