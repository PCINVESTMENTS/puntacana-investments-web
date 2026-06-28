const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function run() {
    const PROPERTY_ID = 99995;
    const property = await client.fetch(`*[_type == "property" && id == ${PROPERTY_ID}][0]`);
    
    if (property && property.gallery && property.gallery.length > 30) {
        console.log(`Current gallery count: ${property.gallery.length}. Slicing to 30...`);
        const updatedGallery = property.gallery.slice(0, 30);
        
        await client.patch(property._id)
            .set({ gallery: updatedGallery })
            .commit();
        console.log('Successfully reverted Villa Jaguey to 30 images.');
    } else {
        console.log('Villa Jaguey does not have more than 30 images.');
    }
}

run().catch(console.error);
