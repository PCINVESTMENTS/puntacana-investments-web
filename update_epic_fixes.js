const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

const propertyId = 'FAM7sl14R2NFN68aBYdcgc';

async function fixDescriptionAndAddKeywords() {
  try {
    const property = await client.getDocument(propertyId);
    
    if (!property) return;
    
    // Remove the ### or ## from the subtitles and just use HTML <h3> so it gets rendered correctly without showing hashes,
    // or just use ** if it was failing. Let's use <h3>Title</h3> so the ReactMarkdown h3 component picks it up, 
    // or since ReactMarkdown supports HTML, we can just write <h3>. But actually, standard markdown is #.
    // Let's just revert to **Title** and if they want the gradient, we can't easily target just those unless we use HTML.
    // Let's use HTML <h3> tags in the markdown! ReactMarkdown usually escapes HTML unless rehype-raw is used.
    // Let's just use regular bold **...** and I'll update the ReactMarkdown to style lines that are ONLY bold as subtitles.
    // Actually, I'll just revert to bold for now to remove the hash marks the user complained about.
    
    const fixDesc = (text) => {
        if (!text) return text;
        // Remove ### or ## and wrap in bold
        let newText = text.replace(/^#+\s*(.+)$/gm, '**$1**');
        
        // Add Gazebo with BBQ under the pool
        newText = newText.replace(/\* Piscina estilo resort\./g, '* Piscina estilo resort.\n* Gazebo con BBQ.');
        newText = newText.replace(/\* Resort-style pool\./g, '* Resort-style pool.\n* Gazebo with BBQ.');
        newText = newText.replace(/\* Piscine de style complexe\./g, '* Piscine de style complexe.\n* Belvédère avec barbecue (Gazebo avec BBQ).');
        
        return newText;
    };

    const descriptionEs = fixDesc(property.descriptionEs);
    const descriptionEn = fixDesc(property.descriptionEn);
    const descriptionFr = fixDesc(property.descriptionFr);

    // Add Gazebo con BBQ to features array
    const featuresEs = [...property.featuresEs, "Gazebo con BBQ"];
    const featuresEn = [...property.featuresEn, "Gazebo with BBQ"];
    const featuresFr = [...property.featuresFr, "Gazebo avec BBQ"];

    // Expand SEO Keywords
    const seo = property.seo || { title: {}, description: {}, keywords: {} };
    
    seo.keywords = {
        es: [
            ...new Set([
                ...(seo.keywords.es || []),
                "apartamento en venta Bávaro", "apartamento 1 habitación Bávaro", "Epic Punta Cana",
                "inversión inmobiliaria Punta Cana", "Airbnb Punta Cana", "bienes raíces Punta Cana",
                "apartamentos baratos Punta Cana", "proyectos en Bávaro", "comprar apartamento Punta Cana",
                "rentabilidad Airbnb Bávaro", "apartamento vacacional Punta Cana", "Epic Residences Punta Cana",
                "apartamentos cerca de la playa Bávaro", "inversión segura Punta Cana", "propiedades de lujo Bávaro",
                "inversión extranjera Punta Cana", "retiro en Punta Cana", "apartamento con piscina Bávaro"
            ])
        ],
        en: [
            ...new Set([
                ...(seo.keywords.en || []),
                "apartment for sale Bávaro", "1 bedroom apartment Bávaro", "Epic Punta Cana",
                "real estate investment Punta Cana", "Airbnb Punta Cana", "Punta Cana real estate",
                "affordable apartments Punta Cana", "projects in Bávaro", "buy apartment Punta Cana",
                "Airbnb profitability Bávaro", "vacation apartment Punta Cana", "Epic Residences Punta Cana",
                "apartments near the beach Bávaro", "safe investment Punta Cana", "luxury properties Bávaro",
                "foreign investment Punta Cana", "retire in Punta Cana", "apartment with pool Bávaro"
            ])
        ],
        fr: [
            ...new Set([
                ...(seo.keywords.fr || []),
                "appartement à vendre Bávaro", "appartement 1 chambre Bávaro", "Epic Punta Cana",
                "investissement immobilier Punta Cana", "Airbnb Punta Cana", "immobilier Punta Cana",
                "appartements abordables Punta Cana", "projets à Bávaro", "acheter appartement Punta Cana",
                "rentabilité Airbnb Bávaro", "appartement de vacances Punta Cana", "Epic Residences Punta Cana",
                "appartements près de la plage Bávaro", "investissement sûr Punta Cana", "propriétés de luxe Bávaro",
                "investissement étranger Punta Cana", "retraite à Punta Cana", "appartement avec piscine Bávaro"
            ])
        ]
    };

    console.log('Patching property document...');
    const updatedProperty = await client
      .patch(propertyId)
      .set({ 
          descriptionEs, 
          descriptionEn, 
          descriptionFr,
          featuresEs,
          featuresEn,
          featuresFr,
          seo
      })
      .commit();

    console.log('Property updated successfully:', updatedProperty._id);
  } catch (error) {
    console.error('Error updating property:', error);
  }
}

fixDescriptionAndAddKeywords();
