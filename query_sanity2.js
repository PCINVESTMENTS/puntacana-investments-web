const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function run() {
  const query = `*[_type == "property" && id == 999][0]{ _id, descriptionEs, area }`;
  const doc = await client.fetch(query);
  console.log("Area:", doc.area);
  console.log("Desc:", doc.descriptionEs.substring(doc.descriptionEs.indexOf('Dimensiones')));
}
run().catch(console.error);
