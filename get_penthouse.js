const { createClient } = require('@sanity/client');
const fs = require('fs');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function checkPenthouse() {
  const property = await client.getDocument('FAM7sl14R2NFN68aBZ6IGJ');
  fs.writeFileSync('penthouse_desc.json', JSON.stringify({
    descriptionEs: property.descriptionEs,
    descriptionEn: property.descriptionEn,
    descriptionFr: property.descriptionFr
  }, null, 2));
  console.log("Saved penthouse descriptions");
}

checkPenthouse().catch(console.error);
