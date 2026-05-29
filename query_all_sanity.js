const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-02-17',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function main() {
  const query = `*[_type == "property"] {
    _id,
    id,
    title,
    "slug": slug.current,
    status,
    price,
    description
  }`;
  
  try {
    const results = await client.fetch(query);
    console.log(`Fetched ${results.length} total properties from Sanity (including drafts):`);
    results.forEach(p => {
      console.log(`- _id: ${p._id}, id: ${p.id}, title: ${p.title}, slug: ${p.slug}, status: ${p.status}, price: ${p.price}`);
      if ((p.title && p.title.toLowerCase().includes('epic')) || (p.slug && p.slug.toLowerCase().includes('epic'))) {
        console.log(`  ==> MATCHES EPIC!`);
      }
    });
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
  }
}

main();
