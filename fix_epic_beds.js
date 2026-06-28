const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

const propertyId = 'FAM7sl14R2NFN68aBYdcgc';

async function fixBedsBaths() {
  try {
    console.log('Patching property document...');
    const updatedProperty = await client
      .patch(propertyId)
      .set({ 
          beds: 1, 
          baths: 1 
      })
      .unset(['bedrooms', 'bathrooms'])
      .commit();

    console.log('Property beds/baths updated successfully:', updatedProperty._id);
  } catch (error) {
    console.error('Error updating property:', error);
  }
}

fixBedsBaths();
