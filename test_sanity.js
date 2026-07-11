const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function main() {
  const result = await client.fetch('*[_type == "property"]{ _id, id, title }');
  console.log(result);
}
main();
