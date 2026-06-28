const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const phrases = [
  "Detalles Clásicos y Antigüedades:",
  "Cocina de Chef:",
  "Exteriores de Ensueño:",
  "Piscinas y Solárium Frente al Mar:",
  "El Privilegio de la Ubicación:",
  "Golf de Clase Mundial en su Puerta:",
  "Playa Serena y Club de Playa:",
  "Acceso VIP:",
  "Reserva Ecológica Ojos Indígenas:"
];

async function fixDescription() {
  const documentId = 'rhCr873ocQgsT58wdCXhjd';
  
  try {
    const doc = await client.getDocument(documentId);
    let desc = doc.descriptionEs;

    if (!desc) {
      console.log('No descriptionEs found.');
      return;
    }

    phrases.forEach(phrase => {
      // Replace the space after the phrase with a newline character
      desc = desc.replace(`### ${phrase} `, `### ${phrase}\n`);
    });

    await client.patch(documentId)
      .set({ descriptionEs: desc })
      .commit();
      
    console.log('Description formatting fixed successfully!');
  } catch (err) {
    console.error('Error updating description:', err);
  }
}

fixDescription();
