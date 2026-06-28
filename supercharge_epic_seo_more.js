const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

const propertyId = 'FAM7sl14R2NFN68aBYdcgc';

async function superchargeMoreSEO() {
  try {
    const property = await client.getDocument(propertyId);
    if (!property) return;

    // Titles
    const titleEs = "Exclusivo Apartamento de 1 Habitación en Epic Punta Cana";
    const titleEn = "Exclusive 1-Bedroom Condo in Epic Punta Cana";
    const titleFr = "Appartement Exclusif d'une Chambre à Epic Punta Cana";

    const keywordsEs = [
      ...property.seo?.keywords?.es || [],
      "inversión inmobiliaria punta cana", "bienes raíces republica dominicana", 
      "venta de apartamentos en bávaro", "comprar casa en el caribe",
      "oportunidad de inversión punta cana", "condominio en venta punta cana",
      "mercado inmobiliario republica dominicana", "extranjeros comprando en republica dominicana",
      "propiedades de lujo punta cana", "inversión de alto rendimiento",
      "rentabilidad airbnb republica dominicana", "inversión vacacional",
      "comprar propiedad para rentar", "proyecto epic residences punta cana",
      "apartamento economico en punta cana", "vivir en el caribe",
      "reubicarse en republica dominicana", "inversión para retiro",
      "casas y apartamentos en punta cana", "bienes raíces bávaro"
    ];

    const keywordsEn = [
      ...property.seo?.keywords?.en || [],
      "canadian investors dominican republic", "americans buying property in punta cana",
      "us citizens buying house in dominican republic", "best places to invest in the caribbean",
      "punta cana real estate listings", "affordable condos punta cana",
      "high roi real estate caribbean", "airbnb properties for sale dominican republic",
      "retire in punta cana", "relocate to dominican republic",
      "vacation home investment", "buy a condo in bavaro",
      "epic residences punta cana for sale", "turnkey investment property",
      "dominican republic property market", "buying a second home in punta cana",
      "canadian snowbirds dominican republic", "real estate agent punta cana",
      "luxury apartments punta cana", "profitable airbnb investment"
    ];

    const keywordsFr = [
      ...property.seo?.keywords?.fr || [],
      "québécois investissement immobilier république dominicaine", "français acheter maison punta cana",
      "retraités canadiens république dominicaine", "acheter un condo à bávaro",
      "immobilier caraïbes", "investissement locatif airbnb",
      "rentabilité immobilière république dominicaine", "maison secondaire caraïbes",
      "projet epic residences punta cana", "appartements pas chers punta cana",
      "vivre en république dominicaine", "agence immobilière francophone punta cana",
      "s'expatrier en république dominicaine", "investir au soleil",
      "propriétés à haut rendement", "achat appartement dominicain",
      "meilleurs investissements caraïbes", "snowbirds québécois punta cana",
      "marché immobilier punta cana", "condo de luxe à vendre"
    ];

    console.log('Patching property document for titles and massive SEO keywords...');
    const updatedProperty = await client
      .patch(propertyId)
      .set({ 
          titleEs, 
          titleEn, 
          titleFr,
          'seo.keywords.es': [...new Set(keywordsEs)],
          'seo.keywords.en': [...new Set(keywordsEn)],
          'seo.keywords.fr': [...new Set(keywordsFr)]
      })
      .commit();

    console.log('Property supercharged successfully:', updatedProperty._id);
  } catch (error) {
    console.error('Error updating property:', error);
  }
}

superchargeMoreSEO();
