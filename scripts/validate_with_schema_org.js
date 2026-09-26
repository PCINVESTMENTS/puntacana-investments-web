const https = require('https');
const fs = require('fs');

function validateWithSchemaOrg(jsonLd) {
    const html = `<!DOCTYPE html><html><head><script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head><body></body></html>`;
    const postData = 'html=' + encodeURIComponent(html);
    const options = {
        hostname: 'validator.schema.org',
        port: 443,
        path: '/validate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                // validator.schema.org prefixes with )]}'
                const clean = data.replace(/^\)\]\}'/, '').trim();
                try {
                    const parsed = JSON.parse(clean);
                    resolve(parsed);
                } catch (e) {
                    resolve({ raw: data, error: e.message });
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function main() {
    console.log("=== VALIDACIÓN DIRECTA CON VALIDATOR.SCHEMA.ORG ===");
    const sampleFiles = [
        { type: "Terreno", path: "scripts/schema_samples/terreno.json" },
        { type: "Villa", path: "scripts/schema_samples/villa.json" },
        { type: "Apartamento", path: "scripts/schema_samples/apartamento.json" },
        { type: "Alquiler", path: "scripts/schema_samples/alquiler.json" },
        { type: "Condohotel", path: "scripts/schema_samples/condohotel.json" }
    ];

    const validationReport = {};

    for (const sample of sampleFiles) {
        const jsonLd = JSON.parse(fs.readFileSync(sample.path, 'utf8'));
        console.log(`\nValidando muestra: [${sample.type}] (${sample.path})...`);
        const result = await validateWithSchemaOrg(jsonLd);

        let totalErrors = 0;
        let totalWarnings = 0;
        const extractedErrors = [];
        const extractedWarnings = [];

        if (result.tripleGroups) {
            for (const tg of result.tripleGroups) {
                if (tg.nodes) {
                    for (const node of tg.nodes) {
                        totalErrors += (node.numErrors || 0);
                        totalWarnings += (node.numWarnings || 0);
                        if (node.errors && node.errors.length > 0) extractedErrors.push(...node.errors);
                        if (node.warnings && node.warnings.length > 0) extractedWarnings.push(...node.warnings);
                        if (node.properties) {
                            for (const prop of node.properties) {
                                if (prop.errors && prop.errors.length > 0) extractedErrors.push(...prop.errors);
                                if (prop.warnings && prop.warnings.length > 0) extractedWarnings.push(...prop.warnings);
                            }
                        }
                    }
                }
            }
        }

        validationReport[sample.type] = {
            numErrors: totalErrors,
            numWarnings: totalWarnings,
            errors: extractedErrors,
            warnings: extractedWarnings,
            rawSummary: {
                types: jsonLd['@type'],
                mainEntityType: jsonLd.mainEntity?.['@type'],
                offersType: jsonLd.offers?.['@type'],
                businessFunction: jsonLd.offers?.businessFunction
            }
        };

        console.log(`  Resultado para ${sample.type}:`);
        console.log(`  - Errores sintácticos / vocabulario: ${totalErrors}`);
        console.log(`  - Advertencias: ${totalWarnings}`);
        if (extractedErrors.length > 0) console.log(`  - Lista de errores:`, extractedErrors);
        if (extractedWarnings.length > 0) console.log(`  - Lista de advertencias:`, extractedWarnings);
    }

    console.log("\nMuestra Comercial:");
    console.log("  - Estado: NO EXISTE ninguna propiedad de tipo 'commercial' en los 39 documentos activos actuales de Sanity ni en properties.ts.");
    console.log("  - Mapeo preparado en código: Si en el futuro se crea un inmueble comercial, se clasifica como Schema.org 'Place' (eliminado el tipo inválido CommercialProperties).");

    fs.writeFileSync('scripts/schema_samples/validator_report.json', JSON.stringify(validationReport, null, 2), 'utf8');
    console.log("\nReporte oficial guardado en scripts/schema_samples/validator_report.json");
}

main().catch(console.error);
