const http = require('http');
const fs = require('fs');

function fetch(url) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const req = http.request({
            hostname: u.hostname,
            port: u.port,
            path: u.pathname + u.search,
            method: 'GET',
            headers: { 'user-agent': 'Googlebot/2.1' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    const samples = [
        { type: "terreno", slug: "solar-lujo-caleton-cap-cana", lang: "es" },
        { type: "villa", slug: "villa-contemporanea-corales-vistas-golf-puntacana-resort", lang: "es" },
        { type: "apartamento", slug: "apartamento-1-habitacion-epic-punta-cana", lang: "es" },
        { type: "alquiler", slug: "villa-en-renta-white-sands-punta-cana-amueblada", lang: "es" },
        { type: "condohotel", slug: "condos-cruise-on-land-resort-punta-cana", lang: "es" }
    ];

    fs.mkdirSync('scripts/schema_samples', { recursive: true });
    const summary = {};

    for (const item of samples) {
        const url = `http://localhost:3001/${item.lang}/properties/${item.slug}`;
        const res = await fetch(url);
        const scripts = [...res.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
        let listingJsonLd = null;
        for (const s of scripts) {
            try {
                const parsed = JSON.parse(s[1]);
                if (parsed['@type'] === 'RealEstateListing') listingJsonLd = parsed;
            } catch(e){}
        }

        const outPath = `scripts/schema_samples/${item.type}.json`;
        fs.writeFileSync(outPath, JSON.stringify(listingJsonLd, null, 2), 'utf8');
        summary[item.type] = {
            slug: item.slug,
            url: `https://www.puntacanainvestmentsrd.com/${item.lang}/properties/${item.slug}`,
            jsonLd: listingJsonLd,
            file: outPath
        };
        console.log(`Extraído JSON-LD para ${item.type} -> ${outPath}`);
    }

    fs.writeFileSync('scripts/schema_samples/all_samples.json', JSON.stringify(summary, null, 2), 'utf8');
    console.log("Todos los esquemas extraídos y guardados en scripts/schema_samples/");
}

main().catch(console.error);
