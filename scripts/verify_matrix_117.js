const http = require('http');
const fs = require('fs');
const { createClient } = require('@sanity/client');

function fetchUrl(url) {
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
            res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    console.log("=== INICIANDO VALIDACIÓN EXHAUSTIVA DE MATRIZ DE PROPIEDADES ===");
    const client = createClient({
        projectId: 'w7gp05my',
        dataset: 'production',
        useCdn: false,
        apiVersion: '2024-01-01'
    });

    const localContent = fs.readFileSync('src/data/properties.ts', 'utf8');
    const localSlugs = [...localContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
    const sanityProps = await client.fetch('*[_type == "property" && defined(slug.current)]{ "slug": slug.current }');
    const allSlugs = Array.from(new Set([...sanityProps.map(p => p.slug), ...localSlugs]));

    const languages = ['es', 'en', 'fr'];
    const totalUrlsExpected = allSlugs.length * languages.length;
    console.log(`Propiedades identificadas: ${allSlugs.length}`);
    console.log(`Idiomas evaluados: ${languages.join(', ')}`);
    console.log(`Total URLs a verificar: ${totalUrlsExpected}\n`);

    const results = [];
    let failureCount = 0;

    for (const slug of allSlugs) {
        for (const lang of languages) {
            const localUrl = `http://localhost:3001/${lang}/properties/${slug}`;
            const publicExpectedUrl = `https://www.puntacanainvestmentsrd.com/${lang}/properties/${slug}`;

            let res;
            try {
                res = await fetchUrl(localUrl);
            } catch (err) {
                console.error(`FATAL: No se pudo conectar a ${localUrl}:`, err.message);
                failureCount++;
                continue;
            }

            if (res.status !== 200) {
                console.error(`ERROR HTTP ${res.status} en ${localUrl}`);
                failureCount++;
            }

            // Canonical validation
            const canonicalMatch = res.body.match(/<link rel="canonical" href="([^"]+)"/);
            const canonicalFound = canonicalMatch ? canonicalMatch[1] : null;
            const canonicalOk = canonicalFound === publicExpectedUrl;

            // Title validation
            const titleMatch = res.body.match(/<title>([^<]+)<\/title>/);
            const titleFound = titleMatch ? titleMatch[1] : '';
            const brandMatches = (titleFound.match(/Punta Cana Investments/g) || []).length;
            const brandOk = brandMatches === 1;

            // H1 validation
            const h1Elements = [...res.body.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
            const h1Count = h1Elements.length;
            const h1Ok = h1Count === 1;

            // Hreflang validation
            const hreflangMatches = [...res.body.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/gi)];
            const hreflangMap = {};
            for (const hm of hreflangMatches) {
                hreflangMap[hm[1].toLowerCase()] = hm[2];
            }

            const expectedEs = `https://www.puntacanainvestmentsrd.com/es/properties/${slug}`;
            const expectedEn = `https://www.puntacanainvestmentsrd.com/en/properties/${slug}`;
            const expectedFr = `https://www.puntacanainvestmentsrd.com/fr/properties/${slug}`;
            const expectedXDefault = expectedEn;

            const hreflangEsOk = hreflangMap['es'] === expectedEs;
            const hreflangEnOk = hreflangMap['en'] === expectedEn;
            const hreflangFrOk = hreflangMap['fr'] === expectedFr;
            const hreflangXDefaultOk = hreflangMap['x-default'] === expectedXDefault;

            const hreflangComplete = hreflangEsOk && hreflangEnOk && hreflangFrOk && hreflangXDefaultOk;
            const isReciprocal = hreflangComplete; // Points strictly to the matching property across all 3 locales and x-default

            const isPassed = res.status === 200 && canonicalOk && brandOk && h1Ok && hreflangComplete;
            if (!isPassed) {
                failureCount++;
                console.error(`FALLO en ${publicExpectedUrl}:`, {
                    httpStatus: res.status,
                    canonicalOk,
                    brandMatches,
                    h1Count,
                    hreflangComplete
                });
            }

            results.push({
                slug,
                lang,
                localUrl,
                publicExpectedUrl,
                httpStatus: res.status,
                canonical: canonicalFound,
                canonicalOk,
                title: titleFound,
                brandOccurrences: brandMatches,
                brandOk,
                h1Count,
                h1Text: h1Elements[0] || '',
                h1Ok,
                hreflangTargets: hreflangMap,
                hreflangComplete,
                isReciprocal,
                passed: isPassed
            });
        }
    }

    console.log(`\n=================================================`);
    console.log(`          RESUMEN EJECUTIVO DE LA MATRIZ         `);
    console.log(`=================================================`);
    console.log(`Total URLs verificadas: ${results.length}`);
    console.log(`URLs 100% conformes: ${results.filter(r => r.passed).length}`);
    console.log(`URLs fallidas: ${failureCount}`);

    // Persist JSON artifact
    fs.writeFileSync('scripts/matrix_results.json', JSON.stringify(results, null, 2), 'utf8');
    console.log(`Archivo JSON preservado: scripts/matrix_results.json`);

    // Persist CSV artifact
    const csvHeader = "slug,lang,publicUrl,httpStatus,canonical,canonicalOk,title,brandCount,h1Count,h1Text,hreflangEs,hreflangEn,hreflangFr,hreflangXDefault,isReciprocal,passed\n";
    const csvRows = results.map(r => {
        const escapeCsv = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
        return [
            escapeCsv(r.slug),
            escapeCsv(r.lang),
            escapeCsv(r.publicExpectedUrl),
            r.httpStatus,
            escapeCsv(r.canonical),
            r.canonicalOk,
            escapeCsv(r.title),
            r.brandOccurrences,
            r.h1Count,
            escapeCsv(r.h1Text),
            escapeCsv(r.hreflangTargets['es']),
            escapeCsv(r.hreflangTargets['en']),
            escapeCsv(r.hreflangTargets['fr']),
            escapeCsv(r.hreflangTargets['x-default']),
            r.isReciprocal,
            r.passed
        ].join(',');
    }).join('\n');

    fs.writeFileSync('scripts/matrix_results.csv', csvHeader + csvRows, 'utf8');
    console.log(`Archivo CSV preservado: scripts/matrix_results.csv`);

    if (failureCount > 0) {
        console.error(`ERROR: La matriz contiene ${failureCount} URLs con anomalías.`);
        process.exit(1);
    } else {
        console.log(`ÉXITO: Todas las ${results.length} URLs superaron el 100% de las pruebas estrictas.`);
        process.exit(0);
    }
}

main().catch(err => {
    console.error("Fatal:", err);
    process.exit(1);
});
