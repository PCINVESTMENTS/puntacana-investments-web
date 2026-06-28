const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const updates = [
  {
    id: 'rhCr873ocQgsT58wdCXhjd', // Property 1
    title: 'Mansión Frente al Mar en Corales: Propiedad de Ultra-Lujo en Punta Cana',
    titleEs: 'Mansión Frente al Mar en Corales: Propiedad de Ultra-Lujo en Punta Cana',
    titleEn: 'Oceanfront Mansion in Corales: Ultra-Luxury Property in Punta Cana',
    titleFr: "Manoir en Bord de Mer à Corales : Propriété d'Ultra-Luxe à Punta Cana"
  },
  {
    id: 'FAM7sl14R2NFN68aB3Bdus', // Property 2
    title: 'Villa Contemporánea con Vistas al Lago en Corales, Punta Cana',
    titleEs: 'Villa Contemporánea con Vistas al Lago en Corales, Punta Cana',
    titleEn: 'Contemporary Villa with Lake Views in Corales, Punta Cana',
    titleFr: 'Villa Contemporaine avec Vue sur le Lac à Corales, Punta Cana'
  },
  {
    id: 'n5Bc3T76FKVGXcpTPc816h', // Property 3
    title: 'Palacio Colonial con Vistas al Lago en Puntacana Resort & Club',
    titleEs: 'Palacio Colonial con Vistas al Lago en Puntacana Resort & Club',
    titleEn: 'Colonial Palace with Lake Views at Puntacana Resort & Club',
    titleFr: 'Palais Colonial avec Vue sur le Lac au Puntacana Resort & Club'
  }
];

async function updateTitles() {
  for (const update of updates) {
    try {
      console.log(`Fetching property ${update.id}...`);
      const property = await client.getDocument(update.id);
      
      const newSeo = {
        ...(property.seo || {}),
        title: {
          es: update.titleEs + ' | Punta Cana Investments',
          en: update.titleEn + ' | Punta Cana Investments',
          fr: update.titleFr + ' | Punta Cana Investments'
        }
      };

      console.log(`Patching property ${update.id}...`);
      await client.patch(update.id)
        .set({
          title: update.title,
          titleEs: update.titleEs,
          titleEn: update.titleEn,
          titleFr: update.titleFr,
          seo: newSeo
        })
        .commit();
      
      console.log(`Successfully updated ${update.id}`);
    } catch (error) {
      console.error(`Error updating property ${update.id}:`, error);
    }
  }
}

updateTitles();
