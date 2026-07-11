const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function addMissingWhiteSandsInfo() {
  const propertyIds = ['villas-perla-del-mar-rooftop-white-sands', 'villas-perla-del-mar-white-sands'];

  const missingEs = `
### Beneficios de la Comunidad: White Sands Golf & Beach Resort
Vivir o invertir en White Sands significa tener un resort completo a su disposición. Esta propiedad le otorga acceso a un estilo de vida inigualable:
* **Playa Privada:** Acceso exclusivo a la hermosa Playa Arena Blanca, una de las costas más cristalinas de Bávaro, con servicio de transporte (shuttle) disponible.
* **Campo de Golf:** Disfrute de rondas en el pintoresco campo de golf del complejo, diseñado para integrarse con la naturaleza tropical.
* **Casa Club y Gastronomía:** Acceso a una majestuosa Casa Club que incluye restaurantes de primera categoría, bares vibrantes para el entretenimiento nocturno y un conveniente deli/minimarket para todas sus necesidades diarias.
* **Seguridad y Ubicación:** Doble anillo de seguridad 24/7 y una ubicación estratégica en el corazón de Bávaro.`;

  const missingEn = `
### Community Benefits: White Sands Golf & Beach Resort
Living or investing in White Sands means having a complete resort at your disposal. This property grants you access to an unparalleled lifestyle:
* **Private Beach:** Exclusive access to the beautiful Arena Blanca Beach, one of the most crystalline coasts in Bavaro, with shuttle service available.
* **Golf Course:** Enjoy rounds on the complex's picturesque golf course, designed to integrate with the tropical nature.
* **Clubhouse and Gastronomy:** Access to a majestic Clubhouse featuring top-notch restaurants, vibrant bars for evening entertainment, and a convenient deli/minimarket for all your daily needs.
* **Security and Location:** 24/7 double security ring and a strategic location in the heart of Bavaro.`;

  const missingFr = `
### Avantages de la Communauté : White Sands Golf & Beach Resort
Vivre ou investir à White Sands signifie avoir un complexe complet à votre disposition. Cette propriété vous donne accès à un style de vie inégalé :
* **Plage Privée :** Accès exclusif à la magnifique plage Arena Blanca, l'une des côtes les plus cristallines de Bavaro, avec service de navette disponible.
* **Parc de Golf :** Profitez de parties sur le pittoresque terrain de golf du complexe, conçu pour s'intégrer à la nature tropicale.
* **Clubhouse et Gastronomie :** Accès à un majestueux Clubhouse proposant des restaurants de premier ordre, des bars animés pour les divertissements en soirée et un dépanneur pratique pour tous vos besoins quotidiens.
* **Sécurité et Emplacement :** Double anneau de sécurité 24h/24 et 7j/7 et un emplacement stratégique au cœur de Bavaro.`;

  for (const pid of propertyIds) {
    const doc = await client.getDocument(pid);
    if (!doc) continue;

    let descEs = doc.descriptionEs;
    let descEn = doc.descriptionEn;
    let descFr = doc.descriptionFr;

    if (!descEs.includes("Beneficios de la Comunidad: White Sands")) {
      // Find the position of "Entorno Exclusivo: Cadenas Hoteleras" to insert before it
      descEs = descEs.replace("### Entorno Exclusivo: Cadenas Hoteleras", missingEs + "\n\n### Entorno Exclusivo: Cadenas Hoteleras");
    }

    if (!descEn.includes("Community Benefits: White Sands")) {
      descEn = descEn.replace("### Exclusive Environment: Hotel Chains", missingEn + "\n\n### Exclusive Environment: Hotel Chains");
    }

    if (!descFr.includes("Avantages de la Communauté : White Sands")) {
      descFr = descFr.replace("### Environnement Exclusif : Chaînes Hôtelières", missingFr + "\n\n### Environnement Exclusif : Chaînes Hôtelières");
    }

    await client.patch(pid)
      .set({
        descriptionEs: descEs,
        descriptionEn: descEn,
        descriptionFr: descFr
      })
      .commit();
      
    console.log("Updated " + pid);
  }
}

addMissingWhiteSandsInfo().catch(console.error);
