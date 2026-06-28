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
  id: 99994, // Custom numeric ID
  title: 'Espectacular Villa de Diseño Contemporáneo-Tropical con Vistas al Golf en Corales – Puntacana Resort & Club',
  titleEn: 'Spectacular Contemporary-Tropical Design Villa with Golf Views in Corales – Puntacana Resort & Club',
  titleEs: 'Espectacular Villa de Diseño Contemporáneo-Tropical con Vistas al Golf en Corales – Puntacana Resort & Club',
  titleFr: 'Spectaculaire Villa au Design Contemporain-Tropical avec Vue sur le Golf à Corales – Puntacana Resort & Club',
  slug: {
    _type: 'slug',
    current: 'villa-contemporanea-corales-vistas-golf-puntacana-resort'
  },
  location: 'Corales, Puntacana Resort & Club',
  locationLabel: 'Corales, Punta Cana',
  type: 'villa',
  status: 'sale',
  price: 6200000,
  area: 1100,
  beds: 7, // CRITICAL: Added beds specifically
  baths: 7.5,
  bedrooms: 7,
  bathrooms: 7.5,
  isResale: true,
  descriptionEs: `Bienvenido a un oasis donde la elegancia arquitectónica se encuentra con la naturaleza. La experiencia de llegada es verdaderamente monumental: un inmaculado patio frontal en forma de "U" recibe a los visitantes, flanqueado por imponentes palmeras y una fachada simétrica de líneas limpias, paredes blancas y techos oscuros que establecen un tono de lujo moderno desde el primer instante.

Diseñada para maximizar la ventilación cruzada y la entrada de luz natural, la propiedad cuenta con inmensas puertas de cristal de piso a techo que borran los límites entre los espacios interiores y el exuberante entorno tropical.

### Interiores Luminosos y Cocina de Diseño
* **Espacios Sociales Abiertos:** Los interiores gozan de una paleta de colores serena, dominada por blancos puros y acentos de madera natural, creando un lienzo perfecto para la relajación o el entretenimiento.
* **Cocina Lujosa y Funcional:** Un espacio radiante diseñado para inspirar. Destaca por sus impecables gabinetes blancos a medida que contrastan elegantemente con herrajes de estilo moderno en negro mate. Cuenta con una gran isla central, topes de granito, electrodomésticos de acero inoxidable de primera línea y acceso directo a las terrazas, permitiendo que la preparación de alimentos se disfrute con vistas al jardín.
* **Habitaciones (7 Suites):** Refugios privados de generosas proporciones. Las suites del segundo nivel cuentan con acceso a balcones panorámicos con barandillas de hierro, ofreciendo vistas inigualables a los *greens* del campo de golf y a los atardeceres caribeños.

### Exteriores para el Entretenimiento de Alto Nivel
La fachada trasera de la propiedad es un espectáculo de simetría y grandeza, diseñada para disfrutar del clima perfecto durante todo el año.

* **Terrazas y Comedor Al Fresco:** Una profunda y extensa galería techada se extiende a lo largo de la casa, finamente amueblada con piezas de madera natural, confortables sofás de exterior y coronada por hermosas lámparas colgantes de ratán. Incluye un largo comedor exterior ideal para banquetes con la brisa del mar.
* **Piscina Expansiva y Solárium:** En el centro del jardín trasero descansa una hermosa piscina rectangular revestida en tonos claros, rodeada por un solárium de piedra caliza con elegantes tumbonas blancas.
* **Pabellón / Gazebo Independiente:** Una de las joyas de esta propiedad es su gran pabellón techado junto a la piscina. Este espacio es el sueño de cualquier anfitrión: está totalmente equipado con una cocina exterior, área de barbacoa, barra con taburetes, sala de estar lounge y pantalla de TV, todo con vistas ininterrumpidas a la inmensidad del campo de golf.

### El Privilegio de la Ubicación: La Comunidad de Corales
Vivir en el vecindario de Corales es pertenecer a uno de los clubes más selectos del planeta. Es un santuario de tranquilidad que garantiza una privacidad expansiva entre propiedades, combinando la vida de ultra-lujo con el acceso directo a los hoyos del campo de golf PGA.

### Amenidades y Beneficios Exclusivos de Puntacana Resort & Club
Al adquirir esta joya inmobiliaria, usted obtiene acceso inmediato al estilo de vida inigualable del resort:
* **Golf de Clase Mundial:** Acceso al *Corales Golf Course* (sede del PGA Tour) y al *La Cana Golf Course*.
* **Playa Serena y Club de Playa:** Kilómetros de playas privadas de arena blanca.
* **Acceso VIP:** Servicio "Fast Track" en el Aeropuerto Internacional de Punta Cana.
* **Reserva Ecológica Ojos Indígenas:** Acceso privado a manantiales de agua dulce cristalina.
* **Six Senses Spa:** Tratamientos de bienestar holístico de renombre mundial.`,
  descriptionEn: `Welcome to an oasis where architectural elegance meets nature. The arrival experience is truly monumental: an immaculate U-shaped front courtyard welcomes visitors, flanked by towering palm trees and a symmetrical facade with clean lines, white walls, and dark roofs that set a tone of modern luxury from the very first moment.

Designed to maximize cross ventilation and natural light, the property features massive floor-to-ceiling glass doors that blur the lines between indoor spaces and the lush tropical surroundings.

### Luminous Interiors and Designer Kitchen
* **Open Social Spaces:** The interiors enjoy a serene color palette, dominated by pure whites and natural wood accents, creating a perfect canvas for relaxation or entertainment.
* **Luxurious and Functional Kitchen:** A radiant space designed to inspire. It stands out for its impeccable custom white cabinetry that elegantly contrasts with matte black modern hardware. It features a large center island, granite countertops, top-of-the-line stainless steel appliances, and direct access to the terraces, allowing food preparation to be enjoyed with garden views.
* **Bedrooms (7 Suites):** Generously proportioned private retreats. The second-level suites have access to panoramic balconies with iron railings, offering unparalleled views of the golf course greens and Caribbean sunsets.

### Exteriors for High-Level Entertainment
The rear facade of the property is a spectacle of symmetry and grandeur, designed to enjoy the perfect climate year-round.

* **Terraces and Al Fresco Dining:** A deep and extensive covered gallery runs the length of the house, finely furnished with natural wood pieces, comfortable outdoor sofas, and crowned by beautiful rattan pendant lights. It includes a long outdoor dining area ideal for banquets with the ocean breeze.
* **Expansive Pool and Solarium:** In the center of the backyard rests a beautiful rectangular pool lined in light tones, surrounded by a limestone solarium with elegant white loungers.
* **Independent Pavilion / Gazebo:** One of the jewels of this property is its large covered pavilion next to the pool. This space is a host's dream: it is fully equipped with an outdoor kitchen, BBQ area, bar with stools, lounge seating area, and TV screen, all with uninterrupted views of the vastness of the golf course.

### The Privilege of the Location: The Corales Community
Living in the Corales neighborhood means belonging to one of the most exclusive clubs on the planet. It is a sanctuary of tranquility that guarantees expansive privacy between properties, combining ultra-luxury living with direct access to PGA golf course holes.

### Exclusive Amenities and Benefits of Puntacana Resort & Club
By acquiring this real estate jewel, you gain immediate access to the resort's unparalleled lifestyle:
* **World-Class Golf:** Access to the *Corales Golf Course* (home of the PGA Tour) and *La Cana Golf Course*.
* **Playa Serena and Beach Club:** Miles of private white sand beaches.
* **VIP Access:** "Fast Track" service at Punta Cana International Airport.
* **Ojos Indígenas Ecological Reserve:** Private access to crystal clear freshwater springs.
* **Six Senses Spa:** World-renowned holistic wellness treatments.`,
  descriptionFr: `Bienvenue dans une oasis où l'élégance architecturale rencontre la nature. L'expérience d'arrivée est véritablement monumentale : une cour avant immaculée en forme de « U » accueille les visiteurs, flanquée de palmiers imposants et d'une façade symétrique aux lignes épurées, murs blancs et toits sombres qui donnent le ton du luxe moderne dès le premier instant.

Conçue pour maximiser la ventilation croisée et l'apport de lumière naturelle, la propriété est dotée d'immenses baies vitrées du sol au plafond qui effacent les frontières entre les espaces intérieurs et l'environnement tropical luxuriant.

### Intérieurs Lumineux et Cuisine de Créateur
* **Espaces Sociaux Ouverts :** Les intérieurs bénéficient d'une palette de couleurs sereine, dominée par des blancs purs et des accents de bois naturel, créant une toile de fond parfaite pour la détente ou le divertissement.
* **Cuisine Luxueuse et Fonctionnelle :** Un espace radieux conçu pour inspirer. Elle se distingue par ses armoires blanches sur mesure impeccables qui contrastent élégamment avec la quincaillerie moderne noire mate. Elle dispose d'un grand îlot central, de plans de travail en granit, d'appareils électroménagers en acier inoxydable haut de gamme et d'un accès direct aux terrasses, permettant de cuisiner tout en profitant de la vue sur le jardin.
* **Chambres (7 Suites) :** Des retraites privées aux proportions généreuses. Les suites du deuxième niveau ont accès à des balcons panoramiques avec des balustrades en fer, offrant une vue imprenable sur les greens du parcours de golf et les couchers de soleil des Caraïbes.

### Extérieurs pour Divertissement de Haut Niveau
La façade arrière de la propriété est un spectacle de symétrie et de grandeur, conçue pour profiter d'un climat parfait tout au long de l'année.

* **Terrasses et Salle à Manger en Plein Air :** Une vaste galerie couverte et profonde s'étend sur toute la longueur de la maison, finement meublée avec des pièces en bois naturel, des canapés d'extérieur confortables et couronnée de magnifiques suspensions en rotin. Elle comprend une longue salle à manger extérieure idéale pour les banquets avec la brise marine.
* **Piscine Vaste et Solarium :** Au centre du jardin arrière se trouve une belle piscine rectangulaire revêtue de tons clairs, entourée d'un solarium en calcaire avec d'élégantes chaises longues blanches.
* **Pavillon / Gazebo Indépendant :** L'un des joyaux de cette propriété est son grand pavillon couvert à côté de la piscine. Cet espace est le rêve de tout hôte : il est entièrement équipé d'une cuisine extérieure, d'un espace barbecue, d'un bar avec tabourets, d'un coin salon et d'un écran de télévision, le tout avec une vue imprenable sur l'immensité du parcours de golf.

### Le Privilège de l'Emplacement : La Communauté de Corales
Vivre dans le quartier de Corales, c'est appartenir à l'un des clubs les plus sélects de la planète. C'est un sanctuaire de tranquillité qui garantit une grande intimité entre les propriétés, alliant une vie ultra-luxueuse avec un accès direct aux trous du parcours de golf PGA.

### Commodités et Avantages Exclusifs de Puntacana Resort & Club
En acquérant ce joyau immobilier, vous obtenez un accès immédiat au style de vie incomparable du complexe :
* **Golf de Classe Mondiale :** Accès au parcours de golf de *Corales* (siège du PGA Tour) et au parcours de golf de *La Cana*.
* **Playa Serena et Beach Club :** Des kilomètres de plages privées de sable blanc.
* **Accès VIP :** Service « Fast Track » à l'Aéroport International de Punta Cana.
* **Réserve Écologique Ojos Indígenas :** Accès privé aux sources d'eau douce cristalline.
* **Six Senses Spa :** Traitements de bien-être holistique de renommée mondiale.`,
  seo: {
    title: {
      en: 'Contemporary Villa in Corales | Golf Views | US$6.2M | Punta Cana Investments',
      es: 'Villa Contemporánea en Corales | Vistas al Golf | US$6.2M | Punta Cana Investments',
      fr: 'Villa Contemporaine à Corales | Vue sur le Golf | 6,2 M$ US | Punta Cana Investments'
    },
    description: {
      en: 'Discover this dazzling 7-bedroom villa in Corales, Puntacana Resort. 1,100m2 of contemporary luxury, outdoor pavilion, and pool with golf views for US$6.2M.',
      es: 'Descubra esta deslumbrante villa de 7 habs en Corales, Puntacana Resort. 1,100m2 de lujo contemporáneo, pabellón exterior y piscina con vistas al golf por US$6.2M.',
      fr: 'Découvrez cette éblouissante villa de 7 chambres à Corales, Puntacana Resort. 1 100 m2 de luxe contemporain, pavillon extérieur et piscine avec vue sur le golf pour 6,2 M$ US.'
    },
    keywords: {
      es: [
        'Corales Puntacana Resort', 'villa contemporánea Punta Cana', 'golf front villa Punta Cana', 
        'pabellón exterior lujo', 'luxury real estate Dominican Republic', 'propiedades exclusivas Punta Cana', 
        'Punta Cana Investments', 'casas en campos de golf Caribe'
      ],
      en: [
        'Corales Puntacana Resort', 'contemporary villa Punta Cana', 'golf front villa Punta Cana', 
        'luxury outdoor pavilion', 'luxury real estate Dominican Republic', 'exclusive properties Punta Cana', 
        'Punta Cana Investments', 'Caribbean golf course homes'
      ],
      fr: [
        'Corales Puntacana Resort', 'villa contemporaine Punta Cana', 'villa face au golf Punta Cana', 
        'pavillon extérieur de luxe', 'immobilier de luxe République Dominicaine', 'propriétés exclusives Punta Cana', 
        'Punta Cana Investments', 'maisons sur terrain de golf Caraïbes'
      ]
    }
  }
};

const imagesPath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056';
const files = [
  { name: 'media__1782569456496.jpg', alt: 'Majestuosa fachada trasera iluminada al atardecer de villa contemporánea con piscina expansiva en Corales, Puntacana Resort.' }, // Fachada Trasera Atardecer
  { name: 'media__1782569465476.jpg', alt: 'Lujosa área de piscina con solárium y gran pabellón techado equipado con cocina de exterior y vistas al campo de golf en Punta Cana.' }, // Pabellón y Piscina
  { name: 'media__1782569475942.jpg', alt: 'Imponente entrada principal simétrica con patio adoquinado en forma de U y palmeras en villa de lujo en Corales.' }, // Patio Frontal
  { name: 'media__1782569485624.png', alt: 'Luminosa cocina de diseño en blanco con isla central de granito, electrodomésticos de acero inoxidable y ventanales al jardín en Punta Cana.' }, // Cocina Moderna
  { name: 'media__1782569673712.jpg', alt: 'Elegante y extensa terraza techada con mobiliario de madera, lámparas de ratán y gran comedor al fresco en mansión del Caribe.' } // Terraza Techada
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
    
    // Set first image as main
    propertyData.mainImage = uploadedImages[0];
    // Set all images as gallery
    propertyData.gallery = uploadedImages;

    console.log('Creating property document...');
    const createdProperty = await client.create(propertyData);
    console.log('Property created successfully:', createdProperty._id);
  } catch (error) {
    console.error('Error uploading property:', error);
  }
}

uploadProperty();
