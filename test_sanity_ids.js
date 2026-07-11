const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
});

client.fetch(`*[_type == "property" && !(_id in path("drafts.**"))] { id }`).then(res => {
  const ids = res.map(p => p.id).sort((a,b) => b - a);
  console.log("Sanity IDs:", ids);
}).catch(console.error);
