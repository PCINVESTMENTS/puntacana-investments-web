const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const keywordsEs = [
  "villa contemporánea Punta Cana",
  "villa moderna en venta Punta Cana",
  "villa frente al golf Punta Cana",
  "casas de lujo en campos de golf Punta Cana",
  "mansión moderna Punta Cana",
  "Corales Puntacana Resort",
  "Puntacana Resort & Club",
  "bienes raíces de lujo Punta Cana",
  "luxury real estate Dominican Republic",
  "mansión en venta Punta Cana",
  "mansion for sale Punta Cana",
  "villa de ultra lujo Punta Cana",
  "comprar villa de lujo Punta Cana",
  "propiedades exclusivas Punta Cana",
  "inversiones inmobiliarias Punta Cana",
  "Corales Golf Course",
  "PGA Tour Corales",
  "Punta Cana Investments",
  "inversión en eco-hoteles Caribe",
  "desarrollo de proyectos ecológicos Miches",
  "terrenos para proyectos ecológicos República Dominicana",
  "inversión en cabañas ecológicas",
  "lotes para eco-resorts Caribe",
  "desarrollo turístico de río República Dominicana",
  "terrenos con río para desarrollo turístico",
  "inversión inmobiliaria Miches",
  "terrenos en venta Miches República Dominicana"
];

const keywordsEn = [
  "contemporary villa Punta Cana",
  "modern luxury home Dominican Republic",
  "golf front villa Punta Cana",
  "luxury golf villas Caribbean",
  "Corales Golf Course real estate",
  "Punta Cana golf properties",
  "Punta Cana luxury real estate",
  "luxury real estate Dominican Republic",
  "modern mansion for sale Punta Cana",
  "ultra-luxury homes Caribbean",
  "Punta Cana luxury homes",
  "buy modern villa Punta Cana",
  "exclusive properties Punta Cana",
  "Punta Cana real estate investments",
  "Caribbean luxury real estate",
  "Punta Cana Investments",
  "eco-hotel development Caribbean",
  "eco-resort investment Dominican Republic",
  "Miches hotel development",
  "land for eco-projects DR",
  "ecological cabins investment",
  "riverfront tourism development DR",
  "Miches real estate investment",
  "land for sale Miches Dominican Republic"
];

const keywordsFr = [
  "villa contemporaine Punta Cana",
  "villa moderne Punta Cana",
  "villa sur golf Punta Cana",
  "villas de luxe golf Caraïbes",
  "immobilier golf Punta Cana",
  "Puntacana Resort & Club",
  "Corales Puntacana Resort",
  "immobilier de luxe Punta Cana",
  "immobilier de luxe République Dominicaine",
  "manoir moderne à vendre Punta Cana",
  "maisons ultra-luxe Caraïbes",
  "acheter villa contemporaine Punta Cana",
  "propriétés exclusives Punta Cana",
  "investissements immobiliers Punta Cana",
  "Punta Cana Investments",
  "investissement éco-hôtel Caraïbes",
  "développement de projets écologiques Miches",
  "terrains pour projets écologiques République Dominicaine",
  "investissement cabanes écologiques",
  "développement touristique fluvial République Dominicaine",
  "investissement immobilier Miches",
  "terrains à vendre Miches"
];

async function updateSEO() {
  const propertyId = 'n5Bc3T76FKVGXcpTQ1pKTb';
  try {
    console.log(`Patching SEO keywords for property ${propertyId}...`);
    await client.patch(propertyId)
      .set({ 
        'seo.keywords.es': keywordsEs,
        'seo.keywords.en': keywordsEn,
        'seo.keywords.fr': keywordsFr
      })
      .commit();
      
    console.log(`Successfully updated SEO keywords for ${propertyId}`);
  } catch (err) {
    console.error('Error updating SEO:', err);
  }
}

updateSEO();
