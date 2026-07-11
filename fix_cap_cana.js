const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function fixCapCanaImage() {
  const propertyId = '44bf8cd8-fb45-4b10-be00-6644458f2730'; // I need the actual _id! 
  // Let's query by slug and then patch by _id.
  
  const properties = await client.fetch(`*[_type == 'property' && slug.current == 'villa-lujo-cap-cana-exclusividad-privacidad']{_id, gallery, image}`);
  
  if (properties.length === 0) {
      console.log("Not found");
      return;
  }
  
  const p = properties[0];
  const newGallery = p.gallery.map(img => {
      if (typeof img === 'string' && img === '/images/cap-cana-luxury-villa-facade.jpg') {
          return '/images/cap-cana-luxury-villa-facade.webp';
      }
      return img;
  });
  
  await client.patch(p._id)
    .set({
      image: p.image === '/images/cap-cana-luxury-villa-facade.jpg' ? '/images/cap-cana-luxury-villa-facade.webp' : p.image,
      gallery: newGallery
    })
    .commit();
    
  console.log("Fixed Cap Cana image format");
}

fixCapCanaImage().catch(console.error);
