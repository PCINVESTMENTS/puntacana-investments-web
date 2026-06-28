const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const phrasesToHeading = [
  "Descripción Detallada",
  "Interiores de Diseño, Arte y Confort Absoluto",
  "Detalles Clásicos y Antigüedades:",
  "Cocina de Chef:",
  "Exteriores de Ensueño:",
  "Piscinas y Solárium Frente al Mar:",
  "El Privilegio de la Ubicación:",
  "Amenidades y Beneficios Exclusivos de Puntacana Resort & Club",
  "Golf de Clase Mundial en su Puerta:",
  "Playa Serena y Club de Playa:",
  "Acceso VIP:",
  "Reserva Ecológica Ojos Indígenas:"
];

async function updateDescription() {
  const documentId = 'rhCr873ocQgsT58wdCXhjd';
  
  try {
    const doc = await client.getDocument(documentId);
    let desc = doc.descriptionEs;

    if (!desc) {
      console.log('No descriptionEs found.');
      return;
    }

    phrasesToHeading.forEach(phrase => {
      // Escape special characters for regex
      const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match the phrase either at the beginning of a line or preceded by newlines/spaces, 
      // but ensure we don't double-replace if it already has ###
      // We can just globally replace the phrase with ### phrase, being careful not to replace it if it already has ###
      const regex = new RegExp(`(?<!###\\s)${escapedPhrase}`, 'g');
      desc = desc.replace(regex, `### ${phrase}`);
    });

    await client.patch(documentId)
      .set({ descriptionEs: desc })
      .commit();
      
    console.log('Description successfully updated with H3 headers!');
  } catch (err) {
    console.error('Error updating description:', err);
  }
}

updateDescription();
