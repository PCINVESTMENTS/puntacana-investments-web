
const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: '1j4o2xyf',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function run() {
  const query = `*[_type == "property" && id == 999][0]{ _id }`;
  const doc = await client.fetch(query);
  
  if (!doc) {
    console.error("Document not found");
    return;
  }

  const patch = client.patch(doc._id);
  patch.set({ price: 1545000 });

  const result = await patch.commit();
  console.log("Patched successfully:", result._id);
}
run().catch(console.error);
