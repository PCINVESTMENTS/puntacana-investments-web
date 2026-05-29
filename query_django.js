const axios = require('axios');

const API_URL = 'https://puntacana-fortress-production.up.railway.app/api/public/properties/';

async function main() {
  try {
    const response = await axios.get(API_URL);
    const properties = response.data.results || response.data;
    console.log(`Fetched ${properties.length} properties from Django:`);
    properties.forEach(p => {
      console.log(`- ID: ${p.id}, Title: ${p.title}, Slug: ${p.slug}, Status: ${p.status}`);
    });
  } catch (error) {
    console.error('Error fetching from Django:', error);
  }
}

main();
