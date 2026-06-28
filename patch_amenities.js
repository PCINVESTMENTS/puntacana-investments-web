const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const propertyId = 'FAM7sl14R2NFN68aB3Bdus';

const featuresEs = [
  'Campo de Golf Corales y La Cana',
  'Millas de playas privadas de arena blanca (Playa Serena)',
  'Servicio VIP "Fast Track" en el Aeropuerto de Punta Cana',
  'Reserva Ecológica Ojos Indígenas',
  'Six Senses Spa',
  'Seguridad 24/7 y acceso controlado',
  'Patio interior con espejo de agua',
  'Cocina de chef totalmente equipada',
  'Piscina infinity y solárium',
  'Gran gazebo tradicional de cana',
  'Estudio / Oficina privada'
];

const featuresEn = [
  'Corales & La Cana Golf Courses',
  'Miles of pristine private white sand beaches (Playa Serena)',
  'VIP "Fast Track" Service at Punta Cana Airport',
  'Ojos Indígenas Ecological Reserve',
  'Six Senses Spa',
  '24/7 Security and controlled access',
  'Interior courtyard with water feature',
  "Fully equipped chef's kitchen",
  'Infinity pool and sun deck',
  'Large traditional cana gazebo',
  'Private study / Home office'
];

const featuresFr = [
  'Parcours de Golf Corales & La Cana',
  'Des kilomètres de plages de sable blanc privées (Playa Serena)',
  "Service VIP \"Fast Track\" à l'Aéroport de Punta Cana",
  'Réserve Écologique Ojos Indígenas',
  'Six Senses Spa',
  'Sécurité 24/7 et accès contrôlé',
  "Cour intérieure avec miroir d'eau",
  'Cuisine de chef entièrement équipée',
  'Piscine à débordement et solarium',
  'Grand gazebo traditionnel en cana',
  'Bureau privé / Home office'
];

async function patchAmenities() {
  try {
    console.log('Patching amenities for property', propertyId);
    
    await client.patch(propertyId)
      .set({ 
        featuresEs, 
        featuresEn, 
        featuresFr 
      })
      .commit();

    console.log('Amenities successfully patched!');
  } catch (error) {
    console.error('Error patching amenities:', error);
  }
}

patchAmenities();
