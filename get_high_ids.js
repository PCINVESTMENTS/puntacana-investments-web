const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
});

client.fetch(`*[_type == "property" && _id != "dummy" && !(_id in path("drafts.**")) && id > 1000] { id, title, featured, status }`).then(res => {
  console.log("High ID properties:", JSON.stringify(res, null, 2));
}).catch(console.error);
