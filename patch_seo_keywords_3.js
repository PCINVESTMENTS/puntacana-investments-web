const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const keywordsEs = [
  "villa estilo plantación Punta Cana", "casa colonial de lujo Caribe", "villa amueblada en venta Punta Cana", 
  "comprar villa amueblada República Dominicana", "mansión con piscina olímpica Punta Cana", 
  "villa con vista al lago Punta Cana", "villa frente al golf Punta Cana", "casas de lujo en campos de golf Punta Cana", 
  "Corales Puntacana Resort", "Puntacana Resort & Club", "bienes raíces de lujo Punta Cana", 
  "mansión en venta Punta Cana", "villa de ultra lujo Punta Cana", "comprar villa de lujo Punta Cana", 
  "propiedades exclusivas Punta Cana", "inversiones inmobiliarias Punta Cana", "Corales Golf Course", 
  "PGA Tour Corales", "Punta Cana Investments"
];

const keywordsEn = [
  "plantation style villa Punta Cana", "colonial luxury home Dominican Republic", "fully furnished villa Punta Cana", 
  "furnished luxury real estate Caribbean", "lake view villa Punta Cana", "golf front villa Punta Cana", 
  "luxury golf villas Caribbean", "Corales Golf Course real estate", "Punta Cana golf properties", 
  "Punta Cana luxury real estate", "luxury real estate Dominican Republic", "mansion for sale Punta Cana", 
  "ultra-luxury homes Caribbean", "Punta Cana luxury homes", "buy furnished luxury villa Punta Cana", 
  "Punta Cana real estate investments", "Caribbean luxury real estate", "Punta Cana Investments"
];

const keywordsFr = [
  "villa de style plantation Punta Cana", "maison coloniale de luxe Caraïbes", "villa meublée à vendre Punta Cana", 
  "villa avec vue sur le lac Punta Cana", "villa sur golf Punta Cana", "villas de luxe golf Caraïbes", 
  "immobilier golf Punta Cana", "Puntacana Resort & Club", "Corales Puntacana Resort", 
  "immobilier de luxe Punta Cana", "immobilier de luxe République Dominicaine", "manoir à vendre Punta Cana", 
  "acheter villa meublée Punta Cana", "propriétés exclusives Punta Cana", "investissements immobiliers Punta Cana", 
  "Punta Cana Investments"
];

async function updateKeywords() {
  const propertyId = 'n5Bc3T76FKVGXcpTPc816h';
  try {
    console.log(`Fetching property ${propertyId}...`);
    const property = await client.getDocument(propertyId);
    
    // Merge existing SEO object to not overwrite title and description
    const newSeo = {
      ...property.seo,
      keywords: {
        es: keywordsEs,
        en: keywordsEn,
        fr: keywordsFr
      }
    };

    console.log(`Patching keywords for ${propertyId}...`);
    await client.patch(propertyId)
      .set({ seo: newSeo })
      .commit();
      
    console.log(`Successfully updated keywords for ${propertyId}`);
  } catch (err) {
    console.error('Error updating keywords:', err);
  }
}

updateKeywords();
