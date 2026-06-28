const { createClient } = require('@sanity/client');
const fs = require('fs');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function getPerla() {
  const property = await client.getDocument('villas-perla-del-mar-white-sands');
  fs.writeFileSync('perla_data.json', JSON.stringify(property, null, 2));
  console.log('Saved to perla_data.json');
}

getPerla().catch(console.error);
