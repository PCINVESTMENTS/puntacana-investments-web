const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function uploadImage(filePath) {
  console.log(`Uploading ${filePath}...`);
  try {
    const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
      filename: path.basename(filePath)
    });
    return {
      _type: 'image',
      asset: {
        _type: "reference",
        _ref: asset._id
      }
    };
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    throw error;
  }
}

async function createProperty() {
  const mediaDir = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056';
  
  // Rule 5: Gallery Completeness Verification
  // From the latest ls -t, the 5 images uploaded today at 09:44:
  const imageFiles = [
    'media__1782654214704.jpg',
    'media__1782654224796.jpg',
    'media__1782654236429.jpg',
    'media__1782654249134.jpg',
    'media__1782654261869.jpg'
  ].map(name => path.join(mediaDir, name));

  const uploadedImages = [];
  for (const file of imageFiles) {
    const uploaded = await uploadImage(file);
    uploadedImages.push(uploaded);
  }

  // Rule 1: Sanity Room Fields
  const beds = 2;
  const baths = 2.5;
  const area = 184.4;

  // Rule 2 & 3: Translation Completeness & Multilingual SEO
  const titleEs = "Espectacular Penthouse Amueblado con Rooftop Privado y Picuzzi en White Sands";
  const titleEn = "Spectacular Furnished Penthouse with Private Rooftop and Picuzzi in White Sands";
  const titleFr = "Spectaculaire Penthouse Meublé avec Rooftop Privé et Picuzzi à White Sands";

  const slug = "penthouse-amueblado-rooftop-picuzzi-white-sands";

  const keywordsEs = [
    "penthouse amueblado punta cana", "penthouse con picuzzi punta cana", "comprar penthouse en bávaro",
    "white sands punta cana", "bienes raíces punta cana", "inversión inmobiliaria republica dominicana",
    "apartamento con terraza privada", "rooftop privado punta cana", "penthouse llave en mano",
    "inversión vacacional punta cana", "rentabilidad airbnb republica dominicana", "extranjeros comprando en republica dominicana",
    "apartamentos de lujo bávaro", "comprar casa en el caribe", "apartamentos con acceso a la playa",
    "inversión de alto rendimiento", "retiro en el caribe", "vivir en punta cana", "mejores proyectos en white sands",
    "propiedades con club de playa", "bienes raíces bávaro", "comprar penthouse con jacuzzi", "apartamentos de 2 habitaciones punta cana",
    "comprar propiedad para rentar", "reubicarse en republica dominicana", "inversión inmobiliaria inteligente",
    "bienes raíces premium caribe", "inmuebles en venta república dominicana", "inversionistas latinoamericanos punta cana",
    "apartamentos exclusivos punta cana", "condominio en venta punta cana", "rooftop con vista punta cana",
    "penthouse de lujo punta cana", "inversión garantizada bávaro", "comprar casa en la playa", "apartamentos con seguridad 24 horas",
    "apartamentos frente al golf punta cana", "condos white sands", "inversión en preconstrucción punta cana"
  ];

  const keywordsEn = [
    "furnished penthouse punta cana", "penthouse with picuzzi bavaro", "buy penthouse white sands",
    "canadian investors dominican republic", "americans buying property in punta cana", "us citizens buying house in dominican republic",
    "retire in dominican republic", "punta cana real estate listings", "high roi real estate caribbean",
    "airbnb investment dominican republic", "turnkey investment property", "penthouse with private rooftop",
    "luxury apartments punta cana", "buy condo in bavaro", "canadian snowbirds dominican republic",
    "relocate to dominican republic", "best places to invest in the caribbean", "dominican republic property market",
    "vacation home investment", "buying a second home in punta cana", "private beach access condos",
    "golf course apartments punta cana", "profitable airbnb investment", "2 bedroom penthouse for sale punta cana",
    "real estate agent punta cana", "retiring in the caribbean", "safe communities punta cana",
    "white sands golf and beach resort", "condos with private jacuzzi", "luxury caribbean real estate",
    "buy property dominican republic", "invest in punta cana", "top real estate dominican republic",
    "affordable luxury condos punta cana", "turnkey condo for sale", "caribbean retirement properties",
    "condo for sale white sands", "bavaro real estate for sale", "dominican republic luxury homes"
  ];

  const keywordsFr = [
    "penthouse meublé punta cana", "penthouse avec picuzzi bávaro", "acheter penthouse white sands",
    "québécois investissement immobilier république dominicaine", "français acheter maison punta cana",
    "retraités canadiens république dominicaine", "snowbirds québécois punta cana", "immobilier caraïbes",
    "investissement locatif airbnb", "rentabilité immobilière république dominicaine", "maison secondaire caraïbes",
    "vivre en république dominicaine", "s'expatrier en république dominicaine", "acheter un condo à bávaro",
    "penthouse avec rooftop privé", "appartements de luxe punta cana", "investir au soleil",
    "agence immobilière francophone punta cana", "meilleurs investissements caraïbes", "marché immobilier punta cana",
    "condo avec accès plage privée", "appartements sur golf punta cana", "condo de luxe à vendre",
    "acheter propriété république dominicaine", "2 chambres penthouse punta cana", "retraite aux caraïbes",
    "communautés sécurisées punta cana", "white sands golf et plage", "condo avec jacuzzi privé",
    "immobilier de luxe caraïbes", "appartement clé en main", "investisseurs francophones punta cana",
    "appartement vue mer punta cana", "investissement haut rendement", "condo à vendre bávaro",
    "opportunité d'investissement punta cana", "acheter au paradis", "investir dans les caraïbes",
    "villas et penthouses république dominicaine"
  ];

  // Rule 4: Google-Compliant Markdown Styling for Subtitles (Using ### and empty lines)
  const descriptionEs = `Descubra la definición de inversión "llave en mano" con este deslumbrante penthouse de diseño contemporáneo ubicado en la codiciada comunidad de White Sands. Con un precio inigualable de US$249,900, esta propiedad de 184.4 m2 se entrega completamente amueblada y lista para generar ingresos o disfrutar de inmediato. Cuenta con 2 elegantes habitaciones, 2.5 baños, balcón y una impresionante terraza privada en la azotea coronada por un picuzzi.

### Interiores Modernos y de Concepto Abierto

El primer nivel cuenta con una sala de estar bañada en luz natural que se conecta directamente con un encantador balcón frontal. La cocina moderna estilo americana está totalmente equipada con isla central y barra desayunadora.

### Habitaciones Diseñadas para el Descanso

Una habitación principal tipo oasis con cama King y una habitación secundaria decorada con exquisito gusto, listas para brindar máximo confort.

### La Joya de la Propiedad: Rooftop Privado

El segundo nivel incluye una terraza expansiva con un picuzzi privado enmarcado en fina piedra coralina, lounge techado bajo pérgola y un medio baño para invitados.

### Beneficios de la Comunidad: White Sands

A solo 3 minutos de la playa con acceso exclusivo, además de campo de golf, majestuosa Casa Club y doble anillo de seguridad 24/7 en el corazón de Bávaro.`;

  const descriptionEn = `Discover the definition of a "turnkey" investment with this dazzling contemporary penthouse located in the highly sought-after White Sands community. Priced exceptionally at US$249,900, this 184.4 m2 property comes fully furnished and ready to generate income or enjoy immediately. It features 2 elegant bedrooms, 2.5 bathrooms, a balcony, and a stunning private rooftop terrace crowned by a picuzzi.

### Modern and Open-Concept Interiors

The first level boasts a sunlit living room directly connected to a charming front balcony. The modern American-style kitchen is fully equipped with a center island and breakfast bar.

### Bedrooms Designed for Relaxation

An oasis-style master bedroom with a King bed and a secondary bedroom decorated with exquisite taste, both ready to provide maximum comfort.

### The Crown Jewel: Private Rooftop

The second level features an expansive terrace with a private picuzzi framed in fine coral stone, a covered lounge area under a pergola, and a half bathroom for guests.

### Community Benefits: White Sands

Just 3 minutes from the beach with exclusive access, plus a golf course, majestic Clubhouse, and 24/7 double ring security in the heart of Bavaro.`;

  const descriptionFr = `Découvrez la définition d'un investissement "clé en main" avec cet éblouissant penthouse contemporain situé dans la communauté très prisée de White Sands. À un prix exceptionnel de 249 900 $US, cette propriété de 184,4 m2 est livrée entièrement meublée et prête à générer des revenus ou à être appréciée immédiatement. Elle comprend 2 chambres élégantes, 2,5 salles de bains, un balcon et une superbe terrasse privée sur le toit couronnée d'un picuzzi.

### Intérieurs Modernes et à Aire Ouverte

Le premier niveau dispose d'un salon baigné de lumière naturelle directement relié à un charmant balcon avant. La cuisine moderne de style américain est entièrement équipée avec un îlot central et un bar pour le petit-déjeuner.

### Chambres Conçues pour la Détente

Une chambre principale de type oasis avec un lit King et une chambre secondaire décorée avec un goût exquis, toutes deux prêtes à offrir un confort maximal.

### Le Joyau de la Couronne : Rooftop Privé

Le deuxième niveau comprend une vaste terrasse avec un picuzzi privé encadré de fine pierre coralline, un salon couvert sous une pergola et une demi-salle de bain pour les invités.

### Avantages de la Communauté : White Sands

À seulement 3 minutes de la plage avec un accès exclusif, ainsi qu'un terrain de golf, un majestueux Clubhouse et une double sécurité 24h/24 et 7j/7 au cœur de Bávaro.`;

  const newProperty = {
    _type: 'property',
    id: Math.floor(Math.random() * 1000000).toString(),
    title: titleEs,
    titleEs: titleEs,
    titleEn: titleEn,
    titleFr: titleFr,
    slug: {
      _type: 'slug',
      current: slug
    },
    location: "White Sands, Punta Cana",
    locationLabel: "White Sands Golf & Beach Resort, Punta Cana",
    type: "Penthouse",
    status: "sale",
    price: 249900,
    beds,
    baths,
    area,
    isResale: true,
    mainImage: uploadedImages[0],
    gallery: uploadedImages,
    featuresEn: ["Private Rooftop", "Picuzzi", "Fully Furnished", "Coral Stone Accents", "Covered Terrace", "Front Balcony", "Kitchen Island", "Glass Staircase", "3 Minutes from Beach", "Private Beach Access", "Golf Course", "Clubhouse", "Restaurants and Bars"],
    featuresEs: ["Rooftop Privado", "Picuzzi", "Completamente Amueblado", "Acabados en Piedra Coralina", "Terraza Techada", "Balcón Frontal", "Cocina con Isla", "Escalera de Cristal Templado", "A 3 Minutos de la Playa", "Acceso a Playa Privada", "Campo de Golf", "Casa Club", "Restaurantes y Bares"],
    featuresFr: ["Rooftop Privé", "Picuzzi", "Entièrement Meublé", "Finitions en Pierre Coralline", "Terrasse Couverte", "Balcon Avant", "Cuisine avec Îlot", "Escalier en Verre Trempé", "À 3 Minutes de la Plage", "Accès à la Plage Privée", "Parc de Golf", "Clubhouse", "Restaurants et Bars"],
    descriptionEn,
    descriptionEs,
    descriptionFr,
    seo: {
      title: {
        en: "Furnished Penthouse with Rooftop & Picuzzi in White Sands",
        es: "Penthouse Amueblado con Rooftop y Picuzzi en White Sands",
        fr: "Penthouse Meublé avec Rooftop et Picuzzi à White Sands"
      },
      description: {
        en: "Invest in this spectacular turnkey penthouse in White Sands, Punta Cana. Features 2 beds, private rooftop, picuzzi, and exclusive beach access. $249,900.",
        es: "Invierta en este penthouse llave en mano en White Sands, Punta Cana. 2 habs, rooftop privado, picuzzi y acceso a playa. Excelente ROI. US$249,900.",
        fr: "Investissez dans ce penthouse clé en main à White Sands, Punta Cana. 2 ch, rooftop privé, picuzzi et accès plage. Excellent ROI. 249 900 $US."
      },
      keywords: {
        en: keywordsEn,
        es: keywordsEs,
        fr: keywordsFr
      }
    }
  };

  console.log('Creating property document in Sanity...');
  const createdProperty = await client.create(newProperty);
  console.log('Property created successfully:', createdProperty._id);
}

createProperty().catch(console.error);
