const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const featuresEs = [
  "Pabellón Exterior / Gazebo",
  "Piscina Expansiva",
  "Cocina de Exterior & BBQ",
  "Vistas Ininterrumpidas al Golf",
  "Solárium de Piedra Caliza",
  "Acceso al Corales Golf Course (PGA)",
  "Playa Privada (Playa Serena)",
  "Servicio Fast Track VIP Aeropuerto",
  "Reserva Ecológica Ojos Indígenas",
  "Six Senses Spa"
];

const featuresEn = [
  "Outdoor Pavilion / Gazebo",
  "Expansive Pool",
  "Outdoor Kitchen & BBQ",
  "Uninterrupted Golf Views",
  "Limestone Solarium",
  "Access to Corales Golf Course (PGA)",
  "Private Beach (Playa Serena)",
  "VIP Fast Track Airport Service",
  "Ojos Indígenas Ecological Reserve",
  "Six Senses Spa"
];

const featuresFr = [
  "Pavillon Extérieur / Gazebo",
  "Vaste Piscine",
  "Cuisine Extérieure & BBQ",
  "Vue Imprenable sur le Golf",
  "Solarium en Calcaire",
  "Accès au Parcours de Golf Corales (PGA)",
  "Plage Privée (Playa Serena)",
  "Service Fast Track VIP Aéroport",
  "Réserve Écologique Ojos Indígenas",
  "Six Senses Spa"
];

async function updateProperty() {
  const propertyId = 'n5Bc3T76FKVGXcpTQ1pKTb';
  try {
    console.log(`Patching property ${propertyId}...`);
    await client.patch(propertyId)
      .set({ 
        price: 6299000,
        featuresEs: featuresEs,
        featuresEn: featuresEn,
        featuresFr: featuresFr
      })
      .commit();
      
    console.log(`Successfully updated price and amenities for ${propertyId}`);
  } catch (err) {
    console.error('Error updating property:', err);
  }
}

updateProperty();
