const axios = require('axios');

const API_URL = 'https://puntacana-fortress-production.up.railway.app/api/properties/';
const API_KEY = '5831603befa06e295a98bdb4acfc3c65b777b89f52f267e62527e6557c591591';

async function nukeAll() {
    try {
        console.log("🔥 Fetching all Django Properties...");
        const response = await axios.get(API_URL, {
            headers: { 'X-API-KEY': API_KEY }
        });

        const properties = response.data.results || response.data;
        console.log(`Found ${properties.length} properties to obliterate.`);

        for (const prop of properties) {
            console.log(`🧨 Nuking [${prop.id}] ${prop.slug || prop.title}...`);
            await axios.delete(`${API_URL}${prop.id}/`, {
                headers: { 'X-API-KEY': API_KEY }
            });
            console.log(`💥 Destroyed ${prop.id}`);
        }

        console.log("☢️ Nuke complete. Django is clean.");
    } catch (e) {
        console.error("❌ Nuke failed:", e.response?.data || e.message);
    }
}

nukeAll();
