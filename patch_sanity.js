const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function run() {
  const query = `*[_type == "property" && id == 999][0]{ _id, descriptionEn, descriptionEs, descriptionFr }`;
  const doc = await client.fetch(query);
  
  if (!doc) {
    console.error("Document not found");
    return;
  }

  const patch = client.patch(doc._id).set({ area: 475 });

  if (doc.descriptionEs) {
    let newEs = doc.descriptionEs.replace('Área de construcción:** 927.22 m²', 'Área de construcción:** 450 m² – 500 m²');
    newEs = newEs.replace('Área de solar:** 450 m² – 500 m²', 'Área de solar:** 927.22 m²');
    patch.set({ descriptionEs: newEs });
  }

  if (doc.descriptionEn) {
    let newEn = doc.descriptionEn.replace('Construction Area:** 927.22 m²', 'Construction Area:** 450 m² – 500 m²');
    newEn = newEn.replace('Lot Area:** 450 m² – 500 m²', 'Lot Area:** 927.22 m²');
    patch.set({ descriptionEn: newEn });
  }

  if (doc.descriptionFr) {
    let newFr = doc.descriptionFr.replace('Superficie de construction\\u00A0:** 927,22 m²', 'Superficie de construction\\u00A0:** 450 m² – 500 m²');
    newFr = newFr.replace('Superficie du terrain\\u00A0:** 450 m² – 500 m²', 'Superficie du terrain\\u00A0:** 927,22 m²');
    newFr = newFr.replace('Superficie de construction :** 927,22 m²', 'Superficie de construction :** 450 m² – 500 m²');
    newFr = newFr.replace('Superficie du terrain :** 450 m² – 500 m²', 'Superficie du terrain :** 927,22 m²');
    patch.set({ descriptionFr: newFr });
  }

  const result = await patch.commit();
  console.log("Patched successfully:", result._id);
}
run().catch(console.error);
