const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const propertyData = {
  _type: 'property',
  id: 99995, // Custom numeric ID
  title: 'Villa Jaguey 3: Refugio Tropical con Vistas al Golf y Alto Potencial de Expansión',
  titleEn: 'Villa Jaguey 3: Tropical Retreat with Golf Views and High Expansion Potential',
  titleEs: 'Villa Jaguey 3: Refugio Tropical con Vistas al Golf y Alto Potencial de Expansión',
  titleFr: 'Villa Jaguey 3 : Retraite Tropicale avec Vue sur le Golf et Fort Potentiel d\'Expansion',
  slug: {
    _type: 'slug',
    current: 'oportunidad-villa-jaguey-3-vistas-golf-puntacana-resort'
  },
  location: 'Jaguey, Puntacana Resort & Club',
  locationLabel: 'Punta Cana Resort',
  type: 'villa',
  status: 'sale',
  price: 2575000,
  area: 750,
  beds: 4, 
  baths: 4.5,
  bedrooms: 4,
  bathrooms: 4.5,
  isResale: true,
  descriptionEs: `Villa Jaguey 3 encapsula la esencia del lujo caribeño relajado. Su arquitectura se integra armoniosamente con el exuberante paisajismo tropical que la rodea, destacando por sus hermosos techos abovedados de madera vista, que aportan una calidez inigualable y una sensación de amplitud a cada espacio.

Esta residencia ha sido mantenida de manera impecable y decorada con un gusto exquisito, combinando mobiliario clásico, arte vibrante y texturas naturales que invitan al descanso absoluto.

### Interiores Acogedores, Fluidos y Arquitectura de Autor
* **Espacios de Estar Fluidos y Orgánicos:** La sala de estar principal es un oasis de luz natural y frescura, enmarcada por ventanales corredizos que conectan directamente con la terraza. Su diseño de concepto abierto integra confortables sofás blancos y elegantes sillas de ratán sobre pisos de piedra coralina, fluyendo armónicamente hacia un comedor formal decorado con arte tropical.
* **Cocina Contemporánea:** Un espacio moderno y totalmente equipado con una gran isla central de cuarzo blanco, electrodomésticos de acero inoxidable y campana extractora moderna, ideal para convivir y crear experiencias culinarias.
* **Detalles Arquitectónicos de Autor:** El diseño interior sorprende con transiciones mágicas. Pasillos bañados de luz natural están flanqueados por impresionantes paredes de piedra coralina con cascadas de agua y espejos reflectantes. Un elemento protagónico es su escultural escalera de troncos de madera maciza, que se eleva elegantemente sobre un sereno jardín zen de piedras blancas.
* **Habitaciones (4 Suites Actuales):** Amplias y luminosas, caracterizadas por sus imponentes techos altos de madera. Cada suite está completamente amueblada con camas de lujo, áreas de descanso privadas y acceso directo a los jardines o a terrazas superiores con vistas al golf.
* **Santuario de Bienestar en la Suite Principal:** Los baños han sido concebidos como auténticos spas privados con duchas exteriores de piedra. Destaca el baño de la suite principal, que incluye amplios tocadores dobles en maderas nobles y una espectacular bañera tipo jacuzzi elevada sobre una plataforma de madera, estratégicamente ubicada junto a un ventanal que enmarca el verdor del campo de golf.
* **Zona de Spa Privada:** Una de las joyas ocultas de esta propiedad es su exclusivo espacio dedicado al bienestar. Un cuarto de masajes y relajación enmarcado por una espectacular pared de piedra coralina rústica y pisos de cantos rodados, creando una atmósfera zen sin salir de casa.

### Potencial de Crecimiento (Value-Add)
* La huella de la propiedad y la distribución del terreno permiten la construcción de hasta 2 habitaciones adicionales. Esto representa una oportunidad brillante para capitalizar la inversión inicial, transformándola en una villa de 6 habitaciones con un valor de reventa y rentabilidad muy superior.

### Exteriores para el Disfrute al Máximo
* **Piscina y Solárium:** Una extensa piscina rectangular perfecta para nadar, rodeada por un solárium de piedra caliza con modernas camas balinesas y tumbonas.
* **Gran Gazebo de Madera:** Un majestuoso pabellón exterior con techos de madera artesanal sostenido por robustos pilares. Funciona como el corazón social al aire libre de la villa, albergando un comedor para múltiples comensales y confortables salas de estar lounge donde la brisa fluye sin interrupciones.
* **Vistas y Naturaleza:** El patio trasero se abre hacia la inmensidad del campo de golf, ofreciendo un paisaje verde continuo, privacidad y un ambiente de serenidad total.

### El Privilegio de la Ubicación: Puntacana Resort & Club
Adquirir una propiedad en este enclave garantiza un estilo de vida de élite y seguridad para su inversión.
* **Golf de Clase Mundial:** Acceso a los campos de golf *Corales* y *La Cana*.
* **Playa Serena y Club de Playa:** Disfrute de kilómetros de playas privadas de arena blanca.
* **Acceso VIP:** Beneficios exclusivos y servicio "Fast Track" en el Aeropuerto Internacional de Punta Cana.
* **Reserva Ecológica Ojos Indígenas:** Acceso a senderos y manantiales cristalinos.
* **Six Senses Spa:** Tratamientos de bienestar holístico a pocos minutos de su villa.`,
  descriptionEn: `Villa Jaguey 3 encapsulates the essence of relaxed Caribbean luxury. Its architecture integrates harmoniously with the lush tropical landscaping that surrounds it, standing out for its beautiful vaulted exposed wood ceilings, which provide unmatched warmth and a sense of spaciousness to every space.

This residence has been impeccably maintained and decorated with exquisite taste, combining classic furnishings, vibrant art, and natural textures that invite absolute rest.

### Cozy, Flowing Interiors and Signature Architecture
* **Flowing and Organic Living Spaces:** The main living room is an oasis of natural light and freshness, framed by sliding glass doors that connect directly to the terrace. Its open-concept design integrates comfortable white sofas and elegant rattan chairs on coralline stone floors, flowing harmoniously into a formal dining room decorated with tropical art.
* **Contemporary Kitchen:** A modern and fully equipped space with a large white quartz center island, stainless steel appliances, and a modern extractor hood, ideal for socializing and creating culinary experiences.
* **Signature Architectural Details:** The interior design surprises with magical transitions. Hallways bathed in natural light are flanked by impressive coralline stone walls with water cascades and reflecting mirrors. A striking feature is its sculptural solid wood log staircase, which rises elegantly above a serene zen garden of white stones.
* **Bedrooms (4 Current Suites):** Spacious and bright, characterized by their imposing high wooden ceilings. Each suite is fully furnished with luxury beds, private seating areas, and direct access to the gardens or upper terraces with golf views.
* **Wellness Sanctuary in the Master Suite:** The bathrooms have been conceived as true private spas with outdoor stone showers. The master suite bathroom stands out, featuring large double vanities in fine woods and a spectacular elevated jacuzzi tub on a wooden platform, strategically located next to a window that frames the greenery of the golf course.
* **Private Spa Area:** One of the hidden gems of this property is its exclusive space dedicated to wellness. A massage and relaxation room framed by a spectacular rustic coralline stone wall and river rock floors, creating a zen atmosphere without leaving home.

### Growth Potential (Value-Add)
* The property's footprint and land layout allow for the construction of up to 2 additional bedrooms. This represents a brilliant opportunity to capitalize on the initial investment, transforming it into a 6-bedroom villa with a much higher resale value and rental yield.

### Exteriors for Maximum Enjoyment
* **Pool and Solarium:** An extensive rectangular pool perfect for swimming, surrounded by a limestone solarium with modern Balinese beds and loungers.
* **Large Wooden Gazebo:** A majestic outdoor pavilion with handcrafted wood ceilings supported by robust pillars. It functions as the outdoor social heart of the villa, hosting a dining room for multiple guests and comfortable lounge seating areas where the breeze flows without interruption.
* **Views and Nature:** The backyard opens up to the vastness of the golf course, offering a continuous green landscape, privacy, and an atmosphere of total serenity.

### The Privilege of Location: Puntacana Resort & Club
Acquiring a property in this enclave guarantees an elite lifestyle and security for your investment.
* **World-Class Golf:** Access to *Corales* and *La Cana* golf courses.
* **Playa Serena and Beach Club:** Enjoy miles of private white sand beaches.
* **VIP Access:** Exclusive benefits and "Fast Track" service at Punta Cana International Airport.
* **Ojos Indígenas Ecological Reserve:** Access to trails and crystal-clear springs.
* **Six Senses Spa:** Holistic wellness treatments just minutes from your villa.`,
  descriptionFr: `La Villa Jaguey 3 incarne l'essence du luxe caribéen décontracté. Son architecture s'intègre harmonieusement à l'aménagement paysager tropical luxuriant qui l'entoure, se distinguant par ses magnifiques plafonds voûtés en bois apparent, qui apportent une chaleur inégalée et une sensation d'espace à chaque pièce.

Cette résidence a été impeccablement entretenue et décorée avec un goût exquis, alliant mobilier classique, art vibrant et textures naturelles qui invitent au repos absolu.

### Intérieurs Chaleureux, Fluides et Architecture Signature
* **Espaces de Vie Fluides et Organiques :** Le salon principal est une oasis de lumière naturelle et de fraîcheur, encadré par des baies vitrées coulissantes qui se connectent directement à la terrasse. Son concept ouvert intègre des canapés blancs confortables et d'élégantes chaises en rotin sur des sols en pierre coralline, s'écoulant harmonieusement vers une salle à manger formelle décorée d'art tropical.
* **Cuisine Contemporaine :** Un espace moderne et entièrement équipé avec un grand îlot central en quartz blanc, des appareils électroménagers en acier inoxydable et une hotte aspirante moderne, idéal pour socialiser et créer des expériences culinaires.
* **Détails Architecturaux Signature :** Le design intérieur surprend avec des transitions magiques. Les couloirs baignés de lumière naturelle sont flanqués d'impressionnants murs en pierre coralline avec des cascades d'eau et des miroirs réfléchissants. Un élément remarquable est son escalier sculptural en rondins de bois massif, qui s'élève avec élégance au-dessus d'un serein jardin zen de pierres blanches.
* **Chambres (4 Suites Actuelles) :** Spacieuses et lumineuses, caractérisées par leurs imposants hauts plafonds en bois. Chaque suite est entièrement meublée avec des lits de luxe, des coins salon privés et un accès direct aux jardins ou aux terrasses supérieures avec vue sur le golf.
* **Sanctuaire de Bien-être dans la Suite Principale :** Les salles de bains ont été conçues comme de véritables spas privés avec des douches extérieures en pierre. La salle de bain de la suite principale se distingue par de grandes doubles vasques en bois précieux et une spectaculaire baignoire jacuzzi surélevée sur une plate-forme en bois, stratégiquement située à côté d'une fenêtre qui encadre la verdure du parcours de golf.
* **Espace Spa Privé :** L'un des joyaux cachés de cette propriété est son espace exclusif dédié au bien-être. Une salle de massage et de relaxation encadrée par un spectaculaire mur de pierre coralline rustique et des sols en galets de rivière, créant une atmosphère zen sans quitter la maison.

### Potentiel de Croissance (Valeur Ajoutée)
* L'empreinte de la propriété et l'agencement du terrain permettent la construction de jusqu'à 2 chambres supplémentaires. Cela représente une brillante opportunité de capitaliser sur l'investissement initial, en la transformant en une villa de 6 chambres avec une valeur de revente et une rentabilité locative bien supérieures.

### Extérieurs pour un Plaisir Maximal
* **Piscine et Solarium :** Une vaste piscine rectangulaire parfaite pour nager, entourée d'un solarium en calcaire avec des lits balinais modernes et des chaises longues.
* **Grand Gazebo en Bois :** Un majestueux pavillon extérieur avec des plafonds en bois artisanal soutenus par de robustes piliers. Il fonctionne comme le cœur social extérieur de la villa, abritant une salle à manger pour de multiples convives et des coins salon confortables où la brise circule sans interruption.
* **Vues et Nature :** La cour arrière s'ouvre sur l'immensité du parcours de golf, offrant un paysage vert continu, de l'intimité et une atmosphère de sérénité totale.

### Le Privilège de l'Emplacement : Puntacana Resort & Club
L'acquisition d'une propriété dans cette enclave garantit un style de vie d'élite et la sécurité de votre investissement.
* **Golf de Classe Mondiale :** Accès aux parcours de golf *Corales* et *La Cana*.
* **Playa Serena et Beach Club :** Profitez de kilomètres de plages privées de sable blanc.
* **Accès VIP :** Avantages exclusifs et service "Fast Track" à l'Aéroport International de Punta Cana.
* **Réserve Écologique Ojos Indígenas :** Accès aux sentiers et aux sources d'eau cristalline.
* **Six Senses Spa :** Traitements de bien-être holistique à quelques minutes de votre villa.`,
  featuresEs: [
    "Techos abovedados de madera",
    "Gazebo exterior",
    "Cuarto de spa / masajes",
    "Jacuzzi con vista al golf",
    "Jardín zen con escalera de madera",
    "Potencial de expansión a 6 habs",
    "Piscina expansiva",
    "Acceso a Corales y La Cana Golf",
    "Playa Privada (Playa Serena)",
    "Servicio Fast Track VIP Aeropuerto"
  ],
  featuresEn: [
    "Vaulted wood ceilings",
    "Outdoor gazebo",
    "Spa / massage room",
    "Jacuzzi with golf views",
    "Zen garden with wooden staircase",
    "Expansion potential to 6 beds",
    "Expansive pool",
    "Access to Corales and La Cana Golf",
    "Private Beach (Playa Serena)",
    "VIP Fast Track Airport Service"
  ],
  featuresFr: [
    "Plafonds voûtés en bois",
    "Gazebo extérieur",
    "Salle de spa / massage",
    "Jacuzzi avec vue sur le golf",
    "Jardin zen avec escalier en bois",
    "Potentiel d'expansion à 6 chambres",
    "Vaste piscine",
    "Accès au Golf Corales et La Cana",
    "Plage Privée (Playa Serena)",
    "Service Fast Track VIP Aéroport"
  ],
  seo: {
    title: {
      en: 'Villa Jaguey 3 Opportunity | Golf Views | US$2.57M | Punta Cana',
      es: 'Villa Jaguey 3 de Oportunidad | Vistas al Golf | US$2.57M | Punta Cana',
      fr: 'Opportunité Villa Jaguey 3 | Vue sur le Golf | 2,57 M$ US | Punta Cana'
    },
    description: {
      en: 'Investment opportunity in Puntacana Resort. Furnished Villa Jaguey 3, 4 beds (expandable to 6), 750m2, pool and golf views for US$2.57M.',
      es: 'Oportunidad de inversión en Puntacana Resort. Villa Jaguey 3, amueblada, 4 habs (expansible a 6), 750m2, piscina y vistas al golf por US$2.57M.',
      fr: 'Opportunité d\'investissement à Puntacana Resort. Villa Jaguey 3 meublée, 4 chambres (extensible à 6), 750m2, piscine et vue sur le golf pour 2,57 M$ US.'
    },
    keywords: {
      es: [
        'Villa Jaguey Puntacana Resort', 'oportunidad de inversión Punta Cana', 'villa amueblada en venta', 
        'golf front villa Punta Cana', 'comprar propiedades de inversión República Dominicana', 
        'Punta Cana Investments', 'value add real estate Caribbean'
      ],
      en: [
        'Villa Jaguey Puntacana Resort', 'investment opportunity Punta Cana', 'furnished villa for sale', 
        'golf front villa Punta Cana', 'buy investment properties Dominican Republic', 
        'Punta Cana Investments', 'value add real estate Caribbean'
      ],
      fr: [
        'Villa Jaguey Puntacana Resort', 'opportunité d\'investissement Punta Cana', 'villa meublée à vendre', 
        'villa face au golf Punta Cana', 'acheter propriétés d\'investissement République Dominicaine', 
        'Punta Cana Investments', 'immobilier à valeur ajoutée Caraïbes'
      ]
    }
  }
};

const imagesPath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056';
const files = [
  { name: 'media__1782573471001.jpg', alt: 'Vista aérea espectacular de Villa Jaguey rodeada de naturaleza y el campo de golf de campeonato en Puntacana Resort.' },
  { name: 'media__1782573495372.jpg', alt: 'Vista panorámica aérea de la comunidad de Jaguey y campos de golf en Punta Cana.' },
  { name: 'media__1782573523781.jpg', alt: 'Amplia piscina y fachada exterior con gazebo de madera en villa de lujo con vistas al golf en Punta Cana.' },
  { name: 'media__1782573532063.jpg', alt: 'Hermoso gazebo exterior de madera con gran mesa de comedor al aire libre y vistas al campo de golf en Villa Jaguey.' },
  { name: 'media__1782573543178.jpg', alt: 'Piscina infinita con vistas directas al campo de golf y exuberante vegetación en Puntacana Resort.' }
];

async function uploadProperty() {
  try {
    console.log('Uploading images...');
    const uploadedImages = [];
    
    for (const fileObj of files) {
      console.log('Uploading ' + fileObj.name + '...');
      const stream = fs.createReadStream(path.join(imagesPath, fileObj.name));
      const asset = await client.assets.upload('image', stream, {
        filename: fileObj.name
      });
      uploadedImages.push({
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
        alt: fileObj.alt
      });
    }

    console.log('Images uploaded successfully.');
    
    propertyData.mainImage = uploadedImages[0];
    propertyData.gallery = uploadedImages;

    console.log('Creating property document...');
    const createdProperty = await client.create(propertyData);
    console.log('Property created successfully:', createdProperty._id);
  } catch (error) {
    console.error('Error uploading property:', error);
  }
}

uploadProperty();
