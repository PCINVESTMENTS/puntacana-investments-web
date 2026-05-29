const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-02-17',
  token: process.env.SANITY_API_TOKEN // I need to get the token! Wait, do I have a token?
});
