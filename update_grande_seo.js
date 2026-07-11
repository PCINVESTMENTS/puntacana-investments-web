const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function updateGrandeVilla() {
  const pid = 'a9e144a1-0947-4976-9051-fb54de2ed776'; // Found in grande_desc.json _id (wait, the _id is villas-perla-del-mar-white-sands? Ah, yes, I set _id to slug for new properties sometimes. Let me use the slug query to be safe, but wait, grande_desc.json says _id: "villas-perla-del-mar-white-sands").
  const _id = 'villas-perla-del-mar-white-sands';
  
  const doc = await client.getDocument(_id);
  if (!doc) {
      console.log("Document not found");
      return;
  }

  const featuresEn = (doc.features?.en || []).filter(f => !f.toLowerCase().includes('rooftop') && !f.toLowerCase().includes('picuzzi'));
  const featuresEs = (doc.features?.es || []).filter(f => !f.toLowerCase().includes('rooftop') && !f.toLowerCase().includes('picuzzi'));
  const featuresFr = (doc.features?.fr || []).filter(f => !f.toLowerCase().includes('rooftop') && !f.toLowerCase().includes('picuzzi') && !f.toLowerCase().includes('toit'));

  const communityEs = `### Beneficios de la Comunidad: White Sands Golf & Beach Resort
Vivir o invertir en White Sands significa tener un resort completo a su disposición. Esta propiedad se encuentra a corta distancia de la playa y le otorga acceso a un estilo de vida inigualable:
* **Playa Privada:** Acceso exclusivo a la hermosa Playa Arena Blanca, una de las costas más cristalinas de Bávaro, con servicio de transporte (shuttle) disponible.
* **Campo de Golf:** Disfrute de rondas en el pintoresco campo de golf del complejo, diseñado para integrarse con la naturaleza tropical.
* **Casa Club y Gastronomía:** Acceso a una majestuosa Casa Club que incluye restaurantes de primera categoría, bares vibrantes para el entretenimiento nocturno y un conveniente deli/minimarket para todas sus necesidades diarias.
* **Seguridad y Ubicación:** Doble anillo de seguridad 24/7 y una ubicación estratégica en el corazón de Bávaro.

### Entorno Exclusivo: Cadenas Hoteleras y Prestigio
Ubicada estratégicamente en White Sands, ser propietario aquí significa ser vecino de complejos de renombre mundial. Dentro del mismo residencial y a pocos pasos de distancia, se encuentran majestuosas cadenas hoteleras como el **Grand Bávaro Princess All Suites Resort, Spa & Casino**, el **Caribe Deluxe Princess**, el exclusivo **Punta Cana Princess Adults Only**, el prestigioso **Ocean Blue & Sand Beach Resort** y el **VIK Hotel Arena Blanca**. Esta ubicación premium no solo eleva el prestigio de la propiedad, sino que garantiza una altísima plusvalía y demanda de alquiler.

### Amenidades Externas y Conectividad Inigualable
Diseñada como una máquina de rentabilidad, esta villa es **100% Airbnb Friendly**, perfecta para maximizar el flujo de caja. La conveniencia es absoluta:
* **Salud y Bienestar:** El Centro Médico Punta Cana se encuentra a tan solo 3 minutos de distancia.
* **Educación Premium:** Un reconocido colegio bilingüe se encuentra dentro de las instalaciones del mismo residencial White Sands.
* **Entretenimiento Vibrante:** El Casino está literalmente al lado de la entrada principal, y la vibrante zona de discotecas, bares, restaurantes de primera clase y tiendas de Bávaro está en su entorno inmediato.
* **Conectividad Global:** A tan solo 20 minutos de distancia del Aeropuerto Internacional de Punta Cana, facilitando la llegada de huéspedes internacionales.`;

  const communityEn = `### Community Benefits: White Sands Golf & Beach Resort
Living or investing in White Sands means having a complete resort at your disposal. This property grants you access to an unparalleled lifestyle:
* **Private Beach:** Exclusive access to the beautiful Arena Blanca Beach, one of the most crystalline coasts in Bavaro, with shuttle service available.
* **Golf Course:** Enjoy rounds on the complex's picturesque golf course, designed to integrate with the tropical nature.
* **Clubhouse and Gastronomy:** Access to a majestic Clubhouse featuring top-notch restaurants, vibrant bars for evening entertainment, and a convenient deli/minimarket for all your daily needs.
* **Security and Location:** 24/7 double security ring and a strategic location in the heart of Bavaro.

### Exclusive Environment: Hotel Chains and Prestige
Strategically located in White Sands, owning property here means being neighbors with world-renowned resorts. Within the same residential community and just steps away are majestic hotel chains such as the **Grand Bávaro Princess All Suites Resort, Spa & Casino**, the **Caribe Deluxe Princess**, the exclusive **Punta Cana Princess Adults Only**, the prestigious **Ocean Blue & Sand Beach Resort**, and the **VIK Hotel Arena Blanca**. This premium location not only elevates the property's prestige but also guarantees immense appreciation and rental demand.

### External Amenities and Unmatched Connectivity
Designed as a profitability machine, this villa is **100% Airbnb Friendly**, perfect for maximizing cash flow. Convenience is absolute:
* **Health and Wellness:** Centro Médico Punta Cana is just 3 minutes away.
* **Premium Education:** A renowned bilingual school is located right inside the White Sands residential community.
* **Vibrant Entertainment:** The Casino is literally next to the main entrance, and Bavaro's vibrant nightlife, top-tier restaurants, bars, and shopping areas are in the immediate surroundings.
* **Global Connectivity:** Just 20 minutes away from the Punta Cana International Airport, ensuring seamless arrival for international guests.`;

  const communityFr = `### Avantages de la Communauté : White Sands Golf & Beach Resort
Vivre ou investir à White Sands signifie avoir un complexe complet à votre disposition. Cette propriété vous donne accès à un style de vie inégalé :
* **Plage Privée :** Accès exclusif à la magnifique plage Arena Blanca, l'une des côtes les plus cristallines de Bavaro, avec service de navette disponible.
* **Parc de Golf :** Profitez de parties sur le pittoresque terrain de golf du complexe, conçu pour s'intégrer à la nature tropicale.
* **Clubhouse et Gastronomie :** Accès à un majestueux Clubhouse proposant des restaurants de premier ordre, des bars animés pour les divertissements en soirée et un dépanneur pratique pour tous vos besoins quotidiens.
* **Sécurité et Emplacement :** Double anneau de sécurité 24h/24 et 7j/7 et un emplacement stratégique au cœur de Bavaro.

### Environnement Exclusif : Chaînes Hôtelières et Prestige
Stratégiquement située à White Sands, posséder une propriété ici signifie être voisin de complexes de renommée mondiale. Au sein de la même communauté résidentielle et à quelques pas se trouvent de majestueuses chaînes hôtelières telles que le **Grand Bávaro Princess All Suites Resort, Spa & Casino**, le **Caribe Deluxe Princess**, l'exclusif **Punta Cana Princess Adults Only**, le prestigieux **Ocean Blue & Sand Beach Resort** et le **VIK Hotel Arena Blanca**. Cet emplacement privilégié élève non seulement le prestige de la propriété, mais garantit également une plus-value et une demande locative immenses.

### Commodités Externes et Connectivité Inégalée
Conçue comme une machine à rentabilité, cette villa est **100% Airbnb Friendly**, parfaite pour maximiser les flux de trésorerie. La commodité est absolue :
* **Santé et Bien-être :** Le Centro Médico Punta Cana se trouve à seulement 3 minutes.
* **Éducation Premium :** Une école bilingue renommée est située directement dans la communauté résidentielle de White Sands.
* **Divertissement Vibrant :** Le casino est littéralement à côté de l'entrée principale, et la vie nocturne animée de Bavaro, ses restaurants de premier ordre, ses bars et ses boutiques se trouvent dans les environs immédiats.
* **Connectivité Mondiale :** À seulement 20 minutes de l'Aéroport International de Punta Cana, garantissant une arrivée sans faille pour les clients internationaux.`;

  const descEs = `Descubra el máximo esplendor de Punta Cana con esta magistral **Villa Grande de 2 Niveles** en el exclusivo residencial Perla del Mar. Diseñada para un estilo de vida de élite, cuenta con espacios sumamente amplios, perfectos para residir a tiempo completo o generar altos ingresos vacacionales.

### Diseño Arquitectónico y Distribución
Esta imponente villa ha sido conceptualizada bajo un formato de concepto abierto que privilegia la luz natural y la conexión con el entorno tropical:
* **Área Social Expansiva:** Una amplia sala de estar que fluye orgánicamente hacia un majestuoso comedor y una cocina moderna con isla central.
* **Habitaciones y Confort:** Consta de **3 grandes habitaciones** principales, cada una concebida como un santuario privado, complementadas por **4.5 baños** de finos acabados y **una habitación de servicio** adicional para mayor conveniencia.
* **Oasis Exterior:** El patio trasero es un verdadero paraíso privado, dominado por una exquisita piscina, área de terraza para BBQ y un exuberante jardín ideal para el clima caribeño.
* **Metraje:** 240 m² (aprox) de lujosa construcción distribuidos inteligentemente sobre un solar privado de 285 m² en promedio.

${communityEs}`;

  const descEn = `Discover the ultimate splendor of Punta Cana with this masterful **Large 2-Level Villa** in the exclusive Perla del Mar residential community. Designed for an elite lifestyle, it boasts immensely spacious areas, perfect for full-time living or generating high vacation rental income.

### Architectural Design and Layout
This imposing villa has been conceptualized under an open-concept format that privileges natural light and connection with the tropical surroundings:
* **Expansive Social Area:** A spacious living room that flows organically into a majestic dining area and a modern kitchen with a center island.
* **Bedrooms and Comfort:** It features **3 large primary bedrooms**, each conceived as a private sanctuary, complemented by **4.5 exquisitely finished bathrooms** and an additional **service room (maid's quarter)** for added convenience.
* **Outdoor Oasis:** The backyard is a true private paradise, dominated by an exquisite swimming pool, a BBQ terrace area, and a lush garden ideal for the Caribbean climate.
* **Measurements:** Approx. 240 m² of luxurious construction intelligently distributed over an average private lot of 285 m².

${communityEn}`;

  const descFr = `Découvrez la splendeur ultime de Punta Cana avec cette magistrale **Grande Villa de 2 Niveaux** dans la communauté résidentielle exclusive de Perla del Mar. Conçue pour un style de vie d'élite, elle bénéficie d'espaces immensément spacieux, parfaits pour y vivre à temps plein ou générer des revenus locatifs saisonniers élevés.

### Conception Architecturale et Agencement
Cette imposante villa a été conceptualisée selon un format à aire ouverte qui privilégie la lumière naturelle et la connexion avec l'environnement tropical :
* **Espace Social Expansif :** Un salon spacieux qui s'ouvre harmonieusement sur une salle à manger majestueuse et une cuisine moderne avec îlot central.
* **Chambres et Confort :** Elle comprend **3 grandes chambres principales**, chacune conçue comme un sanctuaire privé, complétées par **4,5 salles de bains** aux finitions exquises et une **chambre de service** supplémentaire pour plus de commodité.
* **Oasis Extérieur :** La cour arrière est un véritable paradis privé, dominée par une piscine exquise, une terrasse pour barbecue et un jardin luxuriant idéal pour le climat caribéen.
* **Dimensions :** Environ 240 m² de construction luxueuse intelligemment répartis sur un terrain privé de 285 m² en moyenne.

${communityFr}`;

  await client.patch(_id)
    .set({
      baths: 4.5,
      beds: 4, // 3 + 1 service
      descriptionEs: descEs,
      descriptionEn: descEn,
      descriptionFr: descFr,
      features: {
          en: featuresEn,
          es: featuresEs,
          fr: featuresFr
      }
    })
    .commit();
    
  console.log("Updated Grande Villa: 4.5 baths, 4 beds, expanded description, removed rooftop amenities.");
}

updateGrandeVilla().catch(console.error);
