const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

const propertyId = 'FAM7sl14R2NFN68aBYdcgc';

async function updateToHeaders() {
  try {
    const property = await client.getDocument(propertyId);
    if (!property) return;

    // Convert bold text that takes up an entire line back to H3 headers (### )
    const fixDesc = (text) => {
        if (!text) return text;
        return text.replace(/^\*\*(.+?)\*\*$/gm, '### $1');
    };

    const descriptionEs = fixDesc(property.descriptionEs);
    const descriptionEn = fixDesc(property.descriptionEn);
    const descriptionFr = fixDesc(property.descriptionFr);

    console.log('Patching property document...');
    const updatedProperty = await client
      .patch(propertyId)
      .set({ 
          descriptionEs, 
          descriptionEn, 
          descriptionFr
      })
      .commit();

    console.log('Property headers updated successfully:', updatedProperty._id);
  } catch (error) {
    console.error('Error updating property:', error);
  }
}

updateToHeaders();
