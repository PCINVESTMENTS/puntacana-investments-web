const fs = require('fs');

function addFooterKeys(file, exploreStr, companyStr) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
        /footer:\s*\{/,
        `footer: {\n        explore: "${exploreStr}",\n        company: "${companyStr}",`
    );
    fs.writeFileSync(file, content);
}

addFooterKeys('src/dictionaries/es.ts', 'Explorar', 'Empresa');
addFooterKeys('src/dictionaries/en.ts', 'Explore', 'Company');
addFooterKeys('src/dictionaries/fr.ts', 'Explorer', 'Entreprise');

let footerContent = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');
footerContent = footerContent.replace(
    /<h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white\/10 pb-2 inline-block">\s*Explorar\s*<\/h4>/,
    `<h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                            {dict.footer.explore}
                        </h4>`
);

footerContent = footerContent.replace(
    /<h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white\/10 pb-2 inline-block">\s*Empresa\s*<\/h4>/,
    `<h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/10 pb-2 inline-block">
                            {dict.footer.company}
                        </h4>`
);

fs.writeFileSync('src/components/layout/Footer.tsx', footerContent);

