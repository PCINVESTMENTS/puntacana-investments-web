const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: 'skl6Z0wbE31alL85QYQ9hwvgoXQhPeVjZ1leD8y6p7lXbCgS33aELO5b9ovbArgcWB0fQ3CJiOmp17e6qsXR5E9vKALtNqMTiMhy9Jw28Ue546gIN9dHXYJHnKKU0qC81eEaYI2uUo1wP6j09s6C3t6B0D5d'
});

async function check() {
  try {
    const data = await client.fetch('*[_type == "property"][0...1]{_id}');
    console.log("SANITY_AUTH_SUCCESS! Second token works!");
  } catch (error) {
    console.log("SANITY_AUTH_ERROR:", error.message || error);
  }
}

check();
