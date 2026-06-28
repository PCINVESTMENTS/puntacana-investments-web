const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function updateRooftop() {
  const propertyId = 'villas-perla-del-mar-rooftop-white-sands';
  const doc = await client.getDocument(propertyId);
  if(!doc) { console.error("Doc not found"); return; }
  
  // Set main image to image #23 (index 22)
  const newMainImage = doc.gallery[22] || doc.gallery[doc.gallery.length - 1];

  // Amenities and SEO text to inject
  const amenitiesEs = `
### Entorno Exclusivo: Cadenas Hoteleras y Prestigio
Ubicada estratégicamente en White Sands, ser propietario aquí significa ser vecino de complejos de renombre mundial. Dentro del mismo residencial y a pocos pasos de distancia, se encuentran majestuosas cadenas hoteleras como el **Grand Bávaro Princess All Suites Resort, Spa & Casino**, el **Caribe Deluxe Princess**, el exclusivo **Punta Cana Princess Adults Only**, el prestigioso **Ocean Blue & Sand Beach Resort** y el **VIK Hotel Arena Blanca**. Esta ubicación premium no solo eleva el prestigio de la propiedad, sino que garantiza una altísima plusvalía y demanda de alquiler.

### Amenidades Externas y Conectividad Inigualable
Diseñada como una máquina de rentabilidad, esta villa es **100% Airbnb Friendly**, perfecta para maximizar el flujo de caja. La conveniencia es absoluta:
* **Salud y Bienestar:** El Centro Médico Punta Cana se encuentra a tan solo 3 minutos de distancia.
* **Educación Premium:** Un reconocido colegio bilingüe se encuentra dentro de las instalaciones del mismo residencial White Sands.
* **Entretenimiento Vibrante:** El Casino está literalmente al lado de la entrada principal, y la vibrante zona de discotecas, bares, restaurantes de primera clase y tiendas de Bávaro está en su entorno inmediato.
* **Conectividad Global:** A tan solo 20 minutos de distancia del Aeropuerto Internacional de Punta Cana, facilitando la llegada de huéspedes internacionales.`;

  const amenitiesEn = `
### Exclusive Environment: Hotel Chains and Prestige
Strategically located in White Sands, owning property here means being neighbors with world-renowned resorts. Within the same residential community and just steps away are majestic hotel chains such as the **Grand Bávaro Princess All Suites Resort, Spa & Casino**, the **Caribe Deluxe Princess**, the exclusive **Punta Cana Princess Adults Only**, the prestigious **Ocean Blue & Sand Beach Resort**, and the **VIK Hotel Arena Blanca**. This premium location not only elevates the property's prestige but also guarantees immense appreciation and rental demand.

### External Amenities and Unmatched Connectivity
Designed as a profitability machine, this villa is **100% Airbnb Friendly**, perfect for maximizing cash flow. Convenience is absolute:
* **Health and Wellness:** Centro Médico Punta Cana is just 3 minutes away.
* **Premium Education:** A renowned bilingual school is located right inside the White Sands residential community.
* **Vibrant Entertainment:** The Casino is literally next to the main entrance, and Bavaro's vibrant nightlife, top-tier restaurants, bars, and shopping areas are in the immediate surroundings.
* **Global Connectivity:** Just 20 minutes away from the Punta Cana International Airport, ensuring seamless arrival for international guests.`;

  const amenitiesFr = `
### Environnement Exclusif : Chaînes Hôtelières et Prestige
Stratégiquement située à White Sands, posséder une propriété ici signifie être voisin de complexes de renommée mondiale. Au sein de la même communauté résidentielle et à quelques pas se trouvent de majestueuses chaînes hôtelières telles que le **Grand Bávaro Princess All Suites Resort, Spa & Casino**, le **Caribe Deluxe Princess**, l'exclusif **Punta Cana Princess Adults Only**, le prestigieux **Ocean Blue & Sand Beach Resort** et le **VIK Hotel Arena Blanca**. Cet emplacement privilégié élève non seulement le prestige de la propriété, mais garantit également une plus-value et une demande locative immenses.

### Commodités Externes et Connectivité Inégalée
Conçue comme une machine à rentabilité, cette villa est **100% Airbnb Friendly**, parfaite pour maximiser les flux de trésorerie. La commodité est absolue :
* **Santé et Bien-être :** Le Centro Médico Punta Cana se trouve à seulement 3 minutes.
* **Éducation Premium :** Une école bilingue renommée est située directement dans la communauté résidentielle de White Sands.
* **Divertissement Vibrant :** Le casino est littéralement à côté de l'entrée principale, et la vie nocturne animée de Bavaro, ses restaurants de premier ordre, ses bars et ses boutiques se trouvent dans les environs immédiats.
* **Connectivité Mondiale :** À seulement 20 minutes de l'Aéroport International de Punta Cana, garantissant une arrivée sans faille pour les clients internationaux.`;

  // Fix sizes
  // Spanish
  let descEs = doc.descriptionEs.replace(
    "- **Tamaño:** 155 m² de construcción más terraza rooftop en terreno de 205 m² promedio", 
    "- **Construcción:** 155 m² de área cerrada.\n- **Terraza Rooftop:** 65 m² (aprox) de espacio abierto.\n- **Terreno:** 205 m² promedio de solar."
  );
  if (!descEs.includes("Cadenas Hoteleras y Prestigio")) descEs += "\n\n" + amenitiesEs;

  // English
  let descEn = doc.descriptionEn.replace(
    "- **Size:** 155 m² built area plus rooftop terrace on 205 m² average lots",
    "- **Built Area:** 155 m² enclosed area.\n- **Rooftop Terrace:** Approx 65 m² open space.\n- **Lot Size:** 205 m² average land area."
  );
  if (!descEn.includes("Hotel Chains and Prestige")) descEn += "\n\n" + amenitiesEn;

  // French
  let descFr = doc.descriptionFr.replace(
    "- **Superficie :** 155 m² de construction plus terrasse sur le toit sur des terrains de 205 m² en moyenne",
    "- **Surface Construite:** 155 m² d'espace clos.\n- **Terrasse Rooftop:** Env. 65 m² d'espace ouvert.\n- **Terrain:** 205 m² de terrain en moyenne."
  );
  if (!descFr.includes("Chaînes Hôtelières et Prestige")) descFr += "\n\n" + amenitiesFr;

  await client.patch(propertyId)
    .set({
      image: newMainImage,
      descriptionEs: descEs,
      descriptionEn: descEn,
      descriptionFr: descFr
    })
    .commit();
    
  console.log("Updated Rooftop Property: Main image and massive SEO amenities added.");
}

updateRooftop().catch(console.error);
