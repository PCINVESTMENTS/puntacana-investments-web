const axios = require('axios');

const API_URL = 'https://puntacana-fortress-production.up.railway.app/api/properties/';
const API_KEY = '5831603befa06e295a98bdb4acfc3c65b777b89f52f267e62527e6557c591591';

async function main() {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'X-API-KEY': API_KEY
      }
    });
    console.log("Keys in response.data:", Object.keys(response.data));
    console.log("Count:", response.data.count);
    console.log("Next:", response.data.next);
    console.log("Previous:", response.data.previous);
    
    // If there is pagination, fetch all pages
    let url = response.data.next;
    let allProps = response.data.results || response.data;
    while (url) {
      console.log("Fetching next page:", url);
      const res = await axios.get(url, {
        headers: {
          'X-API-KEY': API_KEY
        }
      });
      allProps = allProps.concat(res.data.results);
      url = res.data.next;
    }
    
    console.log(`Fetched ${allProps.length} total properties:`);
    allProps.forEach(p => {
      console.log(`- ID: ${p.id}, Title: ${p.title}, Slug: ${p.slug}, Status: ${p.status}, Price: ${p.price}`);
      if ((p.title && p.title.toLowerCase().includes('epic')) || (p.slug && p.slug.toLowerCase().includes('epic'))) {
        console.log(`  ==> MATCHES EPIC!`);
      }
    });
  } catch (error) {
    console.error('Error fetching from Django:', error.response ? error.response.status : error.message);
  }
}

main();
