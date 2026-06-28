const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const newKeywordsES = [
  "villas de lujo en la playa Punta Cana",
  "casas de playa en Punta Cana",
  "mansión en la playa Punta Cana",
  "casas de playa exclusivas República Dominicana",
  "villa frente al mar Punta Cana",
  "Puntacana Resort & Club",
  "Corales Puntacana Resort",
  "villa frente al golf Punta Cana",
  "bienes raíces de lujo Punta Cana",
  "mansión en venta Punta Cana",
  "villa de ultra lujo Punta Cana",
  "casas millonarias Punta Cana",
  "comprar villa de lujo Punta Cana",
  "propiedades exclusivas Punta Cana",
  "inversiones inmobiliarias Punta Cana",
  "propiedades frente al acantilado Punta Cana",
  "Punta Cana Investments"
];

const newKeywordsEN = [
  "beachfront mansion Punta Cana",
  "Punta Cana beachfront real estate",
  "oceanfront villa Punta Cana",
  "golf front villa Punta Cana",
  "luxury real estate Dominican Republic",
  "mansion for sale Punta Cana",
  "ultra-luxury homes Caribbean",
  "Punta Cana luxury homes",
  "buy luxury villa Punta Cana",
  "Caribbean luxury real estate",
  "Corales Golf Course",
  "cliffside villa Punta Cana",
  "luxury beach villas Punta Cana",
  "Punta Cana beach houses",
  "exclusive beach homes Dominican Republic",
  "ocean view properties Punta Cana",
  "million dollar homes Punta Cana",
  "exclusive properties Punta Cana",
  "Punta Cana real estate investments",
  "Punta Cana Investments"
];

const newKeywordsFR = [
  "villas de luxe sur la plage Punta Cana",
  "maisons de plage Punta Cana",
  "manoir sur la plage Punta Cana",
  "maisons de plage exclusives République Dominicaine",
  "immobilier bord de mer Punta Cana",
  "villa front de mer Punta Cana",
  "propriétés vue mer Punta Cana",
  "Puntacana Resort & Club",
  "Corales Puntacana Resort",
  "villa sur golf Punta Cana",
  "immobilier de luxe Punta Cana",
  "immobilier de luxe République Dominicaine",
  "manoir à vendre Punta Cana",
  "maisons ultra-luxe Caraïbes",
  "maisons de luxe Punta Cana",
  "maisons de millionnaires Punta Cana",
  "acheter villa de luxe Punta Cana",
  "propriétés exclusives Punta Cana",
  "investissements immobiliers Punta Cana",
  "immobilier de luxe Caraïbes",
  "Corales Golf Course",
  "villa sur falaise Punta Cana",
  "Punta Cana Investments"
];

async function updateSEO() {
  const documentId = 'rhCr873ocQgsT58wdCXhjd';
  
  try {
    const doc = await client.getDocument(documentId);
    
    // Merge existing keywords with new ones, avoiding duplicates
    const currentES = doc.seo?.keywords?.es || [];
    const currentEN = doc.seo?.keywords?.en || [];
    const currentFR = doc.seo?.keywords?.fr || [];
    
    const uniqueES = Array.from(new Set([...currentES, ...newKeywordsES]));
    const uniqueEN = Array.from(new Set([...currentEN, ...newKeywordsEN]));
    const uniqueFR = Array.from(new Set([...currentFR, ...newKeywordsFR]));
    
    await client.patch(documentId)
      .set({
        'seo.keywords.es': uniqueES,
        'seo.keywords.en': uniqueEN,
        'seo.keywords.fr': uniqueFR
      })
      .commit();
      
    console.log('SEO keywords successfully updated!');
  } catch (err) {
    console.error('Error updating SEO keywords:', err);
  }
}

updateSEO();
