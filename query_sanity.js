const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-02-17'
});

async function main() {
  const query = `*[_type == "property" && !(_id in path("drafts.**")) && status != "draft"] {
    _id,
    id,
    title,
    "slug": slug.current,
    status,
    price,
    is_rental_active,
    rental_price
  }`;
  
  try {
    const results = await client.fetch(query);
    console.log(`Fetched ${results.length} properties from Sanity:`);
    results.forEach(p => {
      console.log(`- _id: ${p._id}, id: ${p.id}, title: ${p.title}, slug: ${p.slug}, status: ${p.status}, price: ${p.price}`);
    });
  } catch (error) {
    console.error('Error fetching from Sanity:', error);
  }
}

main();
