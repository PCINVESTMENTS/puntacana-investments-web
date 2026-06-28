const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

const propertyId = 'FAM7sl14R2NFN68aBYdcgc';

async function superchargeSEO() {
  try {
    const property = await client.getDocument(propertyId);
    if (!property) return;

    const keywordsEs = [
      "comprar propiedad en punta cana", "bienes raíces punta cana", "apartamentos en venta punta cana", 
      "invertir en republica dominicana", "retiro en republica dominicana", "inversión airbnb punta cana", 
      "casa vacacional punta cana", "comprar apartamento bavaro", "epic punta cana en venta", 
      "mejor inversión en el caribe", "apartamento 1 habitacion punta cana", "inmobiliaria punta cana",
      "proyectos inmobiliarios en bavaro", "apartamento barato punta cana", "apartamento con piscina punta cana",
      "venta de apartamentos en republica dominicana", "comprar vivienda en punta cana", "inversión segura punta cana"
    ];

    const keywordsEn = [
      "buy property in punta cana", "punta cana real estate", "condos for sale punta cana", 
      "invest in dominican republic", "canadian buying property in dominican republic", 
      "punta cana apartments", "bavaro real estate", "retire in dominican republic", 
      "airbnb investment punta cana", "vacation home punta cana", "buy condo bavaro", 
      "epic punta cana for sale", "us citizen buying in dominican republic", 
      "best investment in the caribbean", "punta cana homes for sale", "dominican republic real estate for expats",
      "1 bedroom condo punta cana", "affordable apartments punta cana"
    ];

    const keywordsFr = [
      "acheter propriété à punta cana", "immobilier punta cana", "appartements à vendre punta cana", 
      "investir en république dominicaine", "québécois acheter maison république dominicaine", 
      "retraite en république dominicaine", "investissement airbnb punta cana", "maison de vacances punta cana", 
      "acheter condo bavaro", "epic punta cana à vendre", "investissement immobilier caraïbes",
      "acheter appartement république dominicaine francais", "agence immobilière punta cana",
      "condo abordable punta cana", "appartement 1 chambre bavaro", "rentabilité immobilière punta cana"
    ];

    const seo = {
        title: {
            es: "Apartamento en Venta en Epic Punta Cana | Inversión y Airbnb",
            en: "Condo for Sale in Epic Punta Cana | Real Estate Investment & Airbnb",
            fr: "Appartement à Vendre à Epic Punta Cana | Investissement Immobilier"
        },
        description: {
            es: "Descubre este exclusivo apartamento de 1 habitación en Epic Punta Cana. Ideal para invertir, generar ingresos por Airbnb o disfrutar de tu retiro en el Caribe. A solo minutos de las mejores playas de Bávaro.",
            en: "Discover this exclusive 1-bedroom condo in Epic Punta Cana. Perfect for real estate investment, Airbnb income, or your retirement in the Dominican Republic. Minutes away from Bavaro beaches.",
            fr: "Découvrez cet appartement exclusif d'une chambre à Epic Punta Cana. Idéal pour un investissement immobilier, des revenus Airbnb ou votre retraite en République Dominicaine. À quelques minutes des plages de Bavaro."
        },
        keywords: {
            es: keywordsEs,
            en: keywordsEn,
            fr: keywordsFr
        }
    };

    console.log('Patching property document for maximum SEO...');
    const updatedProperty = await client
      .patch(propertyId)
      .set({ seo })
      .commit();

    console.log('Property SEO supercharged successfully:', updatedProperty._id);
  } catch (error) {
    console.error('Error updating property SEO:', error);
  }
}

superchargeSEO();
