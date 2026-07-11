const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  }
  return acc;
}, {});

const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: env.SANITY_API_TOKEN
});

async function check() {
  try {
    const data = await client.fetch('*[_type == "property"][0...1]{_id}');
    console.log("SANITY_AUTH_SUCCESS! Token is valid and can query data.");
  } catch (error) {
    if (error.statusCode === 401) {
      console.log("SANITY_AUTH_FAILED: 401 Unauthorized (Token is invalid, expired, or deleted)");
    } else {
      console.log("SANITY_AUTH_ERROR:", error.message);
    }
  }
}

check();
