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

const PROPERTY_ID = 99996;

const imagesToUpload = [
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577441205.jpg',
        alt: 'villa moderna en venta Punta Cana - Exterior and pool at Corales Puntacana Resort' // Exterior main
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577461992.jpg',
        alt: 'mansión moderna Punta Cana - Outdoor entertainment pavilion with golf views' // Outdoor terrace
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577734617.png',
        alt: 'villa contemporánea Punta Cana - Modern living room interior design' // Living room (NEW)
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577448969.png',
        alt: 'casas de lujo en campos de golf Punta Cana - Elegant suite with golf views' // Bedroom with door
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577420869.png',
        alt: 'villa de ultra lujo Punta Cana - Master bedroom with wood ceiling fan' // Bedroom with fan
    },
    {
        filepath: '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782577429067.jpg',
        alt: 'Puntacana Resort & Club - Modern bedroom rattan headboard details' // Headboard close up
    }
];

async function run() {
    console.log('Uploading images...');
    const uploadedImages = [];
    
    for (const img of imagesToUpload) {
        console.log(`Uploading ${path.basename(img.filepath)}...`);
        const buffer = fs.readFileSync(img.filepath);
        const asset = await client.assets.upload('image', buffer, { filename: path.basename(img.filepath) });
        uploadedImages.push({
            _key: Math.random().toString(36).substring(7),
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
            alt: img.alt
        });
    }
    
    console.log('Creating new property in Sanity...');
    const newProperty = {
        _type: 'property',
        id: PROPERTY_ID,
        slug: { _type: 'slug', current: 'villa-contemporanea-tropical-golf-corales' },
        title: {
            es: 'Espectacular Villa de Diseño Contemporáneo-Tropical con Vistas al Golf en Corales',
            en: 'Spectacular Contemporary-Tropical Design Villa with Golf Views in Corales',
            fr: 'Spectaculaire Villa de Design Contemporain-Tropical avec Vue sur le Golf à Corales'
        },
        type: 'villa',
        status: 'sale',
        location: 'puntacana-resort',
        featured: true,
        image: '', // Will be replaced by nextjs fallback to mainImage or gallery[0]
        mainImage: uploadedImages[0],
        gallery: uploadedImages,
        description: {
            es: 'Una obra maestra arquitectónica que combina el diseño contemporáneo con la calidez del trópico. Ubicada en la exclusiva comunidad de Corales dentro del Puntacana Resort & Club, esta impresionante villa ofrece vistas directas al famoso campo de golf del PGA Tour, un majestuoso pabellón de entretenimiento exterior y acabados de ultra lujo en cada rincón.',
            en: 'An architectural masterpiece combining contemporary design with tropical warmth. Located in the exclusive Corales community within Puntacana Resort & Club, this stunning villa offers direct views of the famous PGA Tour golf course, a majestic outdoor entertainment pavilion, and ultra-luxury finishes throughout.',
            fr: 'Un chef-d\'œuvre architectural combinant un design contemporain avec la chaleur des tropiques. Située dans la communauté exclusive de Corales au Puntacana Resort & Club, cette superbe villa offre une vue directe sur le célèbre parcours de golf du PGA Tour, un majestueux pavillon de divertissement extérieur et des finitions ultra-luxueuses.'
        }
    };
    
    const result = await client.create(newProperty);
    console.log(`Successfully created new property! _id: ${result._id}`);
}

run().catch(console.error);
