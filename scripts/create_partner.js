import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function createPartner() {
  try {
    console.log('Creating partner: Global Real Estate Pro...');
    
    const partner = {
      _type: 'partner',
      name: 'Global Real Estate Pro',
      description_es: 'División internacional y red global de alianzas inmobiliarias estratégicas, facilitando transacciones de alta calidad y conectando inversiones globales.',
      description_en: 'International division and global network of strategic real estate alliances, facilitating high-quality transactions and connecting global investments.',
      description_fr: 'Division internationale et réseau mondial d\'alliances immobilières stratégiques, facilitant des transactions de haute qualité et connectant des investissements mondiaux.',
      website_url: 'https://www.globalrealestatepro.com',
      order: 1
    };

    const res = await client.create(partner);
    console.log('Partner created successfully. Document ID:', res._id);
    console.log('IMPORTANT: Please upload the golden logo image directly in the Sanity Studio for this partner.');
  } catch (err) {
    console.error('Error creating partner:', err);
  }
}

createPartner();
