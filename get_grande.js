const { createClient } = require('@sanity/client');
const fs = require('fs');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function checkGrande() {
  const property = await client.getDocument('a9e144a1-0947-4976-9051-fb54de2ed776'); // wait, I don't know the exact ID for sure.
  // Query by slug
  const properties = await client.fetch(`*[_type == 'property' && slug.current == 'villas-perla-del-mar-white-sands']`);
  fs.writeFileSync('grande_desc.json', JSON.stringify(properties[0], null, 2));
  console.log("Saved grande descriptions");
}

checkGrande().catch(console.error);
