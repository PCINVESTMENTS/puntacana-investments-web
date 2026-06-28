const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

const expandedKeywords = [
  // General & Location (Spanish)
  "bienes raices punta cana", "inversión inmobiliaria bávaro", "penthouse en venta white sands", 
  "apartamento amueblado república dominicana", "propiedad llave en mano caribe", 
  "comprar casa en punta cana", "inmuebles exclusivos bávaro",
  
  // Property Features (Spanish)
  "penthouse con rooftop privado", "apartamento con picuzzi punta cana", 
  "terraza techada", "diseño contemporáneo", "decoración moderna", "piedra coralina",
  "cocina americana con isla", "escalera de cristal",
  
  // Investment & ROI (Spanish)
  "propiedad airbnb friendly punta cana", "alta rentabilidad vacacional", "retorno de inversión ROI",
  "generar ingresos pasivos", "alquiler vacacional bávaro",
  
  // Surrounding Amenities (Spanish)
  "cerca de la playa arena blanca", "residencial con campo de golf", 
  "colegio bilingüe white sands", "centro médico punta cana", "cerca de casino y discotecas",
  "vecino grand bávaro princess", "vecino ocean blue and sand", "vecino vik hotel arena blanca",
  
  // General & Location (English - Target: USA/Canada)
  "real estate punta cana", "bavaro investment property", "penthouse for sale white sands",
  "fully furnished condo dominican republic", "turnkey property caribbean",
  "buy home in punta cana", "exclusive real estate bavaro", "retirement home dominican republic",
  
  // Property Features (English)
  "penthouse with private rooftop", "condo with picuzzi punta cana",
  "covered terrace", "contemporary design", "modern decor", "coral stone",
  
  // Investment & ROI (English)
  "airbnb friendly property punta cana", "high vacation rental yield", "ROI real estate caribbean",
  "passive income property", "vacation rental bavaro",
  
  // Surrounding Amenities (English)
  "near arena blanca beach", "golf course community", "near punta cana international airport",
  "close to princess hotels",
  
  // General & Location (French - Target: Quebec/France)
  "immobilier punta cana", "investissement immobilier bavaro", "penthouse à vendre white sands",
  "appartement meublé république dominicaine", "propriété clé en main caraïbes",
  "acheter maison punta cana", "retraite au soleil république dominicaine",
  
  // Investment & Features (French)
  "propriété airbnb friendly", "rentabilité locative", "rooftop privé", "jacuzzi picuzzi"
];

async function updateKeywords() {
  const propertyId = 'FAM7sl14R2NFN68aBZ6IGJ';
  console.log('Expanding keywords for property...');
  
  // Removing duplicates just in case
  const uniqueKeywords = [...new Set(expandedKeywords)];

  await client.patch(propertyId)
    .set({ keywords: uniqueKeywords })
    .commit();
    
  console.log(`Successfully updated property with ${uniqueKeywords.length} highly optimized keywords.`);
}

updateKeywords().catch(console.error);
