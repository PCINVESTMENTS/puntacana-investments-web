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
    const user = await client.users.get('me');
    console.log("SANITY_AUTH_SUCCESS:", user);
  } catch (error) {
    if (error.statusCode === 401) {
      console.log("SANITY_AUTH_FAILED: 401 Unauthorized");
    } else {
      console.log("SANITY_AUTH_ERROR:", error.message);
    }
  }
}

check();
