const fs = require('fs');

// 1. Fix page.tsx distressed title
let pageContent = fs.readFileSync('src/app/[lang]/investments/off-market/page.tsx', 'utf8');
pageContent = pageContent.replace(
    /Adquisición Estratégica de Activos en Liquidación, Adjudicados y Remates Bancarios/g,
    '{t.distressed.title1}'
);
fs.writeFileSync('src/app/[lang]/investments/off-market/page.tsx', pageContent);

// 2. Fix OffMarketClub.tsx hardcoded texts
let clubContent = fs.readFileSync('src/components/home/OffMarketClub.tsx', 'utf8');
// Fix "Priority Alerts" etc. (though these are not in a dict, we can just inline the translations)
clubContent = clubContent.replace(
    /lang === "en" \? "Priority Alerts" : "Alertas Prioritarias"/g,
    'lang === "en" ? "Priority Alerts" : lang === "fr" ? "Alertes Prioritaires" : "Alertas Prioritarias"'
);
clubContent = clubContent.replace(
    /lang === "en" \? "Private Listings" : "Listados Privados"/g,
    'lang === "en" ? "Private Listings" : lang === "fr" ? "Annonces Privées" : "Listados Privados"'
);
clubContent = clubContent.replace(
    /lang === "en" \? "Unlock the Secret Portfolio" : "Desbloquea el Portafolio Secreto"/g,
    'lang === "en" ? "Unlock the Secret Portfolio" : lang === "fr" ? "Déverrouillez le Portefeuille Secret" : "Desbloquea el Portafolio Secreto"'
);
clubContent = clubContent.replace(
    /lang === "en"\s*\?\s*"Looking to acquire an operational hotel, develop a macro-project, or capitalize on foreclosures and opportunity properties\? You are in the right ecosystem."\s*:\s*"¿Busca adquirir un complejo hotelero, desarrollar un macro-proyecto, o capitalizar sobre propiedades de oportunidad y remates bancarios\? Está en el ecosistema correcto."/g,
    'lang === "en" ? "Looking to acquire an operational hotel, develop a macro-project, or capitalize on foreclosures and opportunity properties? You are in the right ecosystem." : lang === "fr" ? "Cherchez-vous à acquérir un complexe hôtelier, à développer un macro-projet ou à capitaliser sur des saisies et des propriétés d\'opportunité ? Vous êtes dans le bon écosystème." : "¿Busca adquirir un complejo hotelero, desarrollar un macro-proyecto, o capitalizar sobre propiedades de oportunidad y remates bancarios? Está en el ecosistema correcto."'
);
clubContent = clubContent.replace(
    /lang === "en" \? "Access Private Portfolio" : "Acceder al Portafolio Privado"/g,
    'lang === "en" ? "Access Private Portfolio" : lang === "fr" ? "Accéder au Portefeuille Privé" : "Acceder al Portafolio Privado"'
);
clubContent = clubContent.replace(
    /lang === "en" \? "Institutional Verification Required\. 100% Confidential\." : "Verificación Institucional Requerida\. 100% Confidencial\."/g,
    'lang === "en" ? "Institutional Verification Required. 100% Confidential." : lang === "fr" ? "Vérification Institutionnelle Requise. 100% Confidentiel." : "Verificación Institucional Requerida. 100% Confidencial."'
);
fs.writeFileSync('src/components/home/OffMarketClub.tsx', clubContent);

// 3. Fix OffMarketForm.tsx submit button text and disclaimer
let formContent = fs.readFileSync('src/components/investments/OffMarketForm.tsx', 'utf8');

formContent = formContent.replace(
    /Enviar requerimiento de búsqueda privada/g,
    '{t.fields.submit}'
);

formContent = formContent.replace(
    /Al enviar este requerimiento, recibirá una respuesta confidencial\. <strong className="text-white">Revise su carpeta de Spam o Correo no deseado<\/strong> para asegurar la recepción de nuestra respuesta\./g,
    '{t.fields.disclaimer}'
);
fs.writeFileSync('src/components/investments/OffMarketForm.tsx', formContent);

// 4. Update the dictionary to include the exact text for submit and disclaimer
let dictContent = fs.readFileSync('src/dictionaries/offMarket.ts', 'utf8');
dictContent = dictContent.replace(
    /submit: "Enviar Requerimiento Institucional",/g,
    `submit: "Enviar requerimiento de búsqueda privada",
        disclaimer: <>Al enviar este requerimiento, recibirá una respuesta confidencial. <strong className="text-white">Revise su carpeta de Spam o Correo no deseado</strong> para asegurar la recepción de nuestra respuesta.</>,`
);
dictContent = dictContent.replace(
    /submit: "Submit Institutional Requirement",/g,
    `submit: "Submit private search requirement",
        disclaimer: <>By submitting this requirement, you will receive a confidential response. <strong className="text-white">Check your Spam or Junk folder</strong> to ensure receipt of our response.</>,`
);
dictContent = dictContent.replace(
    /submit: "Soumettre la Demande Institutionnelle",/g,
    `submit: "Soumettre la demande de recherche privée",
        disclaimer: <>En soumettant cette demande, vous recevrez une réponse confidentielle. <strong className="text-white">Vérifiez votre dossier Spam ou Courrier indésirable</strong> pour vous assurer de la réception de notre réponse.</>,`
);

fs.writeFileSync('src/dictionaries/offMarket.ts', dictContent);

