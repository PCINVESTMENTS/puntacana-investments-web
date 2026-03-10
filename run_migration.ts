// run_migration.js
const fs = require('fs');
const axios = require('axios');

const API_URL = 'https://puntacana-fortress-production.up.railway.app/api/properties/';
const API_KEY = '5831603befa06e295a98bdb4acfc3c65b777b89f52f267e62527e6557c591591';

async function migrate() {
    try {
        console.log("🚀 Bypassing TS modules. Reading raw properties.ts...");
        const fileContent = fs.readFileSync('./src/data/properties.ts', 'utf8');

        // Extract just the array portion
        const arrayStrMatch = fileContent.match(/export const properties: Property\[\] = (\[[\s\S]*\]);/);
        if (!arrayStrMatch) {
            console.error("❌ Failed to parse properties array from file.");
            return;
        }

        // Evaluate the string into a valid JS array
        // We have to be careful as it contains unquoted keys. eval() works here for a local safe script.
        const properties = eval(arrayStrMatch[1]);

        console.log(`✅ Successfully parsed ${properties.length} properties via Regex/Eval. Starting Migration...`);

        let success = 0;
        let index = 0;
        for (const prop of properties) {
            try {
                index++;
                console.log(`⏳ Migrating [${prop.id}] ${prop.title}...`);

                let rawImageUrl = prop.image || '';
                if (rawImageUrl && rawImageUrl.startsWith('/')) {
                    rawImageUrl = `https://puntacanainvestmentsrd.com${rawImageUrl}`;
                } else if (!rawImageUrl) {
                    rawImageUrl = 'https://puntacanainvestmentsrd.com/images/default-property.jpg';
                }

                let seoDesc = prop.seo?.description?.es || prop.description?.es?.substring(0, 150) || '';
                if (seoDesc.length > 158) seoDesc = seoDesc.substring(0, 155) + '...';

                // Guarantee uniqueness
                const safeSlug = (prop.slug?.toLowerCase().replace(/[^a-z0-9-]+/g, '-') || `prop-${Date.now()}`) + `-${index}`;

                const payload = {
                    title: prop.title?.substring(0, 100) || 'Untitled',
                    slug: safeSlug,
                    description: prop.description?.es || 'Sin descripción',
                    description_en: prop.description?.en || '',
                    price: parseFloat(prop.price) || 0,
                    is_rental_active: prop.status === 'rent',
                    rental_price: prop.status === 'rent' ? (parseFloat(prop.price) || 0) : null,
                    bedrooms: parseInt(prop.beds) || 0,
                    bathrooms: parseInt(prop.baths) || 0,
                    area_sqm: parseFloat(prop.area) || 0,
                    location_label: prop.locationLabel?.substring(0, 100) || 'Punta Cana',
                    status: prop.status === 'rent' ? 'Disponible' : 'Disponible',
                    is_featured: prop.featured || false,
                    main_image_url: rawImageUrl,
                    gallery_urls: [rawImageUrl],
                    seo_title: (prop.seo?.title?.es || prop.title)?.substring(0, 60),
                    seo_description: seoDesc,
                    latitude: prop.coordinates?.lat || 18.582,
                    longitude: prop.coordinates?.lng || -68.405,
                    features: prop.features || { es: [], en: [] },
                    detailed_sections: prop.detailedSections || [],
                    construction_stages: prop.constructionStages || [],
                    completion_percent: prop.completionPercent || 0
                };

                try {
                    await axios.post(API_URL, payload, {
                        headers: {
                            'X-API-KEY': API_KEY,
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log(`✅ Success: ${prop.title}`);
                    success++;
                } catch (firstError) {
                    if (firstError.response?.status === 500 || firstError.response?.status === 400) {
                        console.warn(`⚠️ Slug conflict for ${prop.title}. Retrying with unique suffix...`);
                        payload.slug = `${payload.slug}-${Date.now().toString().slice(-4)}`;

                        await axios.post(API_URL, payload, {
                            headers: {
                                'X-API-KEY': API_KEY,
                                'Content-Type': 'application/json'
                            }
                        });
                        console.log(`✅ Success (Suffixed): ${prop.title}`);
                        success++;
                    } else {
                        throw firstError;
                    }
                }
            } catch (e) {
                console.error(`❌ Failed to migrate ${prop.title}: HTTP ${e.response?.status}`);
                if (e.response?.data) {
                    const html = typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data);
                    // Extract Traceback from Django's HTML
                    const tracebackMatch = html.match(/<div class="traceback">([\s\S]*?)<\/div>/i);
                    const exceptionMatch = html.match(/<th>Exception Value:<\/th>\s*<td><pre>([^<]+)<\/pre><\/td>/i);
                    const exceptionLocationMatch = html.match(/<th>Exception Location:<\/th>\s*<td>([^<]+)<\/td>/i);

                    console.log("------------------------");
                    if (exceptionMatch) console.log("Exception:", exceptionMatch[1].trim());
                    if (exceptionLocationMatch) console.log("Location:", exceptionLocationMatch[1].trim());

                    // Simple text extraction of the inner traceback lines
                    if (tracebackMatch) {
                        const lines = tracebackMatch[1].replace(/<[^>]+>/g, '').split('\n').map(l => l.trim()).filter(l => l);
                        console.log("Traceback:");
                        console.log(lines.slice(-15).join('\n'));
                    } else {
                        console.log("No traceback block found in HTML. Check last_django_error.html");
                    }
                    console.log("------------------------");

                    fs.writeFileSync('last_django_error.html', html);
                } else {
                    console.error(e.message);
                }
                break; // Stop on first failure to debug
            }
        }
        console.log(`🎉 Migration Complete! Successfully migrated ${success}/${properties.length} properties.`);

    } catch (e) {
        console.error("❌ Fatal Error in migration script:", e);
    }
}

migrate();
