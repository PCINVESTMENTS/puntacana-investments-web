const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const descEs = `Resumen de la Propiedad
Ubicada en el enclave más prestigioso y codiciado del Caribe, esta majestuosa villa de diseño contemporáneo-tropical en la comunidad de Corales es un verdadero santuario de elegancia. Destacando por sus impresionantes vistas panorámicas al campo de golf de campeonato y a un sereno lago, esta propiedad se erige sobre un extraordinario terreno de 4,060 m2 con 1,300 m2 de construcción impecable. Con 7 espaciosas habitaciones, 7.5 baños, un espectacular patio interior con espejo de agua, cocina de chef y un gazebo tradicional, esta residencia de US$6,950,000 representa una oportunidad de inversión inigualable para quienes exigen un estilo de vida de élite en el portafolio de Punta Cana Investments.

### Descripción Detallada
Bienvenido a una dimensión de lujo donde la arquitectura luminosa y la naturaleza caribeña convergen en perfecta armonía. Desde su imponente entrada, la villa le recibe con un diseño simétrico de fachadas blancas y contraventanas azules que invitan a la relajación. Al cruzar el umbral, se descubre el corazón arquitectónico de la casa: un deslumbrante patio interior a cielo abierto, protagonizado por un elegante espejo de agua y exuberante vegetación tropical, que inunda de luz natural todos los espacios.

A diferencia de las propiedades costeras tradicionales, esta residencia ofrece una atmósfera de paz absoluta. Toda la propiedad está unificada por impecables pisos de piedra coralina que aportan frescura y una estética atemporal a cada rincón.

### Interiores Llenos de Luz y Diseño de Vanguardia

### Salones de Estar Fluidos:
Los espacios sociales interiores están enmarcados por inmensas puertas corredizas de cristal que borran la línea entre el interior y el patio central. Destacan por su mobiliario de diseño curvo en tonos neutros y espectaculares jarrones de porcelana azul y blanca que acentúan la doble altura de los espacios.

### Cocina de Chef Audaz y Moderna:
Un espacio culinario de altísimo nivel que contrasta magistralmente inmaculados gabinetes blancos estilo shaker con una inmensa isla y topes de cuarzo o granito negro de alto brillo. Está totalmente equipada con electrodomésticos empotrados de acero inoxidable, incluyendo hornos dobles, coronada por eclécticas lámparas colgantes.

### Estudio / Home Office:
Un espacio dedicado y sereno para trabajar desde casa, equipado con estanterías de madera natural, mobiliario ergonómico y acceso a vestidores privados.

### Suites y Baños de Categoría Spa

### Habitaciones (7 Suites):
Diseñadas como retiros de tranquilidad, cada suite cuenta con una personalidad propia bajo un concepto coastal-chic. Presentan tonos neutros relajantes, toques náuticos refinados (arte de coral, tonos azules) y amplios ventanales que se abren directamente hacia los jardines o balcones privados con vistas al golf.

### Baños Principales (7.5 Baños):
Auténticos santuarios de bienestar. Cuentan con inmensas duchas walk-in acristaladas de formato abierto, largos tocadores dobles en color blanco, espejos circulares modernos y contrastante grifería de diseño en negro mate.

### Exteriores de Ensueño: El Gazebo, la Piscina y el Golf
El verdadero espectáculo visual se encuentra en sus exteriores, diseñados para el entretenimiento a gran escala y el disfrute del clima tropical durante todo el año.

### Piscina Infinity y Solárium:
Una inmensa piscina de borde infinito recubierta en tonos turquesa, que incluye amplias plataformas sumergidas (tanning ledges) ideales para descansar bajo el sol.

### El Gran Gazebo (Palapa):
Un monumental pabellón techado en cana tradicional, que alberga áreas de descanso lounge para disfrutar de la sombra y las vistas ininterrumpidas al jardín, el lago y el golf.

### Terrazas Panorámicas:
Extensas galerías techadas amuebladas con elegantes juegos de sala de exterior, ideales para sentir la brisa cruzada del Caribe.

### Terreno Expansivo:
Con más de 4,000 m2 de solar de césped impecable, la propiedad garantiza total privacidad.

### El Privilegio de la Ubicación: La Comunidad de Corales
Vivir en el vecindario de Corales es pertenecer a uno de los clubes más selectos del planeta. Es un santuario de tranquilidad que garantiza una privacidad expansiva entre propiedades, combinando la vida de ultra-lujo con el acceso directo a los hoyos del campo de golf PGA.

### Amenidades y Beneficios Exclusivos de Puntacana Resort & Club
Al adquirir esta joya inmobiliaria, usted obtiene acceso inmediato al estilo de vida inigualable del resort:

### Golf de Clase Mundial:
Acceso al Corales Golf Course (sede del PGA Tour) y al La Cana Golf Course.

### Playa Serena y Club de Playa:
Kilómetros de playas privadas de arena blanca.

### Acceso VIP:
Servicio "Fast Track" en el Aeropuerto Internacional de Punta Cana.

### Reserva Ecológica Ojos Indígenas:
Acceso privado a manantiales de agua dulce cristalina.

### Six Senses Spa:
Tratamientos de bienestar holístico de renombre mundial.

### Ficha Técnica

Precio: US$6,950,000
Tipo de Propiedad: Villa de Lujo Exclusiva
Ubicación: Corales, Puntacana Resort & Club
Vistas: Campo de Golf y Lago
Área de Construcción: 1,300 m2
Área de Solar: 4,060 m2
Habitaciones: 7
Baños: 7.5
Amenidades Destacadas: Patio interior con espejo de agua, cocina de chef, piscina infinity, gran gazebo de cana, estudio privado.
Estatus: Lista para entrega / Reventa de Lujo.`;

const descEn = `Property Summary
Located in the most prestigious and coveted enclave of the Caribbean, this majestic contemporary-tropical design villa in the Corales community is a true sanctuary of elegance. Standing out for its breathtaking panoramic views of the championship golf course and a serene lake, this property sits on an extraordinary plot of 4,060 sq_m with 1,300 sq_m of impeccable construction. With 7 spacious bedrooms, 7.5 bathrooms, a spectacular central courtyard with a water mirror, a chef's kitchen, and a traditional gazebo, this US$6,950,000 residence represents an unparalleled investment opportunity for those who demand an elite lifestyle in the Punta Cana Investments portfolio.

### Detailed Description
Welcome to a dimension of luxury where luminous architecture and Caribbean nature converge in perfect harmony. From its imposing entrance, the villa welcomes you with a symmetrical design of white facades and blue shutters that invite relaxation. Upon crossing the threshold, the architectural heart of the house is revealed: a dazzling open-air central courtyard, featuring an elegant water mirror and lush tropical vegetation, which floods all spaces with natural light.

Unlike traditional coastal properties, this residence offers an atmosphere of absolute peace. The entire property is unified by impeccable coral stone floors that bring freshness and a timeless aesthetic to every corner.

### Interiors Full of Light and Avant-garde Design

### Fluid Living Rooms:
The interior social spaces are framed by huge sliding glass doors that blur the line between the inside and the central courtyard. They stand out for their curved design furniture in neutral tones and spectacular blue and white porcelain vases that accentuate the double height of the spaces.

### Bold and Modern Chef's Kitchen:
A culinary space of the highest level that masterfully contrasts immaculate shaker-style white cabinets with a huge island and high-gloss black quartz or granite countertops. It is fully equipped with built-in stainless steel appliances, including double ovens, crowned by eclectic pendant lamps.

### Studio / Home Office:
A dedicated and serene space to work from home, equipped with natural wood shelving, ergonomic furniture, and access to private dressing rooms.

### Spa-Category Suites and Bathrooms

### Bedrooms (7 Suites):
Designed as retreats of tranquility, each suite has its own personality under a coastal-chic concept. They feature relaxing neutral tones, refined nautical touches (coral art, blue tones), and large windows that open directly out to the gardens or private balconies overlooking the golf course.

### Main Bathrooms (7.5 Baths):
Authentic wellness sanctuaries. They feature huge open-format glass walk-in showers, long double white vanities, modern circular mirrors, and contrasting matte black design faucets.

### Dreamy Exteriors: The Gazebo, Pool, and Golf
The true visual spectacle is found in its exteriors, designed for large-scale entertainment and enjoyment of the tropical climate all year round.

### Infinity Pool and Solarium:
A huge infinity-edge pool covered in turquoise tones, which includes large submerged platforms (tanning ledges) ideal for lounging under the sun.

### The Great Gazebo (Palapa):
A monumental pavilion roofed in traditional cana, which houses lounge seating areas to enjoy the shade and uninterrupted views of the garden, lake, and golf course.

### Panoramic Terraces:
Extensive roofed galleries furnished with elegant outdoor living sets, ideal for feeling the cross breeze of the Caribbean.

### Expansive Grounds:
With over 4,000 sq_m of impeccable lawn plot, the property guarantees total privacy.

### The Privilege of Location: The Corales Community
Living in the Corales neighborhood means belonging to one of the most exclusive clubs on the planet. It is a sanctuary of tranquility that guarantees expansive privacy between properties, combining ultra-luxury living with direct access to the holes of the PGA golf course.

### Exclusive Amenities and Benefits of Puntacana Resort & Club
By acquiring this real estate jewel, you get immediate access to the resort's unparalleled lifestyle:

### World-Class Golf:
Access to the Corales Golf Course (PGA Tour host) and La Cana Golf Course.

### Serena Beach and Beach Club:
Kilometers of private white sand beaches.

### VIP Access:
"Fast Track" service at Punta Cana International Airport.

### Ojos Indígenas Ecological Reserve:
Private access to crystal-clear freshwater springs.

### Six Senses Spa:
World-renowned holistic wellness treatments.

### Technical File

Price: US$6,950,000
Property Type: Exclusive Luxury Villa
Location: Corales, Puntacana Resort & Club
Views: Golf Course and Lake
Construction Area: 1,300 sq_m
Lot Area: 4,060 sq_m
Bedrooms: 7
Bathrooms: 7.5
Featured Amenities: Central courtyard with water mirror, chef's kitchen, infinity pool, large cana gazebo, private studio.
Status: Ready for Delivery / Luxury Resale.`;

const descFr = `Résumé de la Propriété
Située dans l'enclave la plus prestigieuse et convoitée des Caraïbes, cette majestueuse villa au design contemporain-tropical dans la communauté de Corales est un véritable sanctuaire d'élégance. Se distinguant par ses vues panoramiques imprenables sur le parcours de golf de championnat et un lac serein, cette propriété s'érige sur un terrain extraordinaire de 4 060 m2 avec 1 300 m2 de construction impeccable. Avec 7 chambres spacieuses, 7,5 salles de bains, une cour intérieure spectaculaire avec miroir d'eau, une cuisine de chef et un gazebo traditionnel, cette résidence de 6 950 000 $ US représente une opportunité d'investissement inégalée pour ceux qui exigent un style de vie d'élite dans le portefeuille de Punta Cana Investments.

### Description Détaillée
Bienvenue dans une dimension de luxe où l'architecture lumineuse et la nature caribéenne convergent en parfaite harmonie. Dès son entrée imposante, la villa vous accueille avec un design symétrique de façades blanches et de volets bleus qui invitent à la détente. En franchissant le seuil, le cœur architectural de la maison se révèle : une cour intérieure à ciel ouvert éblouissante, mettant en vedette un élégant miroir d'eau et une végétation tropicale luxuriante, qui inonde tous les espaces de lumière naturelle.

Contrairement aux propriétés côtières traditionnelles, cette résidence offre une atmosphère de paix absolue. L'ensemble de la propriété est unifié par des sols impeccables en pierre de corail qui apportent fraîcheur et esthétique intemporelle à chaque recoin.

### Intérieurs Pleins de Lumière et Design Avant-gardiste

### Salons Fluides :
Les espaces sociaux intérieurs sont encadrés par d'immenses portes coulissantes en verre qui effacent la ligne entre l'intérieur et la cour centrale. Ils se distinguent par leurs meubles aux lignes courbes dans des tons neutres et leurs spectaculaires vases en porcelaine bleue et blanche qui accentuent la double hauteur des espaces.

### Cuisine de Chef Audacieuse et Moderne :
Un espace culinaire du plus haut niveau qui contraste magistralement des armoires blanches immaculées de style shaker avec un immense îlot et des comptoirs en quartz ou en granit noir brillant. Elle est entièrement équipée d'électroménagers encastrés en acier inoxydable, y compris des fours doubles, couronnée de lampes suspendues éclectiques.

### Bureau / Home Office :
Un espace dédié et serein pour travailler à domicile, équipé d'étagères en bois naturel, d'un mobilier ergonomique et d'un accès à des dressings privés.

### Suites et Salles de Bains Catégorie Spa

### Chambres (7 Suites) :
Conçues comme des retraites de tranquillité, chaque suite possède sa propre personnalité sous un concept coastal-chic. Elles présentent des tons neutres relaxants, des touches nautiques raffinées (art corallien, tons bleus) et de grandes fenêtres qui s'ouvrent directement sur les jardins ou les balcons privés donnant sur le golf.

### Salles de Bains Principales (7,5 Salles de Bains) :
Authentiques sanctuaires de bien-être. Elles disposent d'immenses douches à l'italienne vitrées à format ouvert, de longs lavabos doubles blancs, de miroirs circulaires modernes et d'une robinetterie design noir mat contrastante.

### Extérieurs de Rêve : Le Gazebo, la Piscine et le Golf
Le véritable spectacle visuel se trouve dans ses extérieurs, conçus pour le divertissement à grande échelle et pour profiter du climat tropical tout au long de l'année.

### Piscine à Débordement et Solarium :
Une immense piscine à débordement recouverte de tons turquoise, qui comprend de vastes plates-formes immergées (tanning ledges) idéales pour se détendre sous le soleil.

### Le Grand Gazebo (Palapa) :
Un pavillon monumental couvert de cana traditionnel, qui abrite des espaces de détente pour profiter de l'ombre et de la vue ininterrompue sur le jardin, le lac et le golf.

### Terrasses Panoramiques :
De vastes galeries couvertes meublées d'élégants ensembles de salon d'extérieur, idéales pour ressentir la brise croisée des Caraïbes.

### Vaste Terrain :
Avec plus de 4 000 m2 de terrain gazonné impeccable, la propriété garantit une intimité totale.

### Le Privilège de l'Emplacement : La Communauté de Corales
Vivre dans le quartier de Corales, c'est appartenir à l'un des clubs les plus sélects de la planète. C'est un sanctuaire de tranquillité qui garantit une grande intimité entre les propriétés, alliant la vie d'ultra-luxe à l'accès direct aux trous du parcours de golf PGA.

### Commodités et Avantages Exclusifs de Puntacana Resort & Club
En acquérant ce joyau immobilier, vous obtenez un accès immédiat au style de vie incomparable du complexe :

### Golf de Classe Mondiale :
Accès au parcours de golf de Corales (hôte du PGA Tour) et au parcours de golf de La Cana.

### Plage Serena et Club de Plage :
Des kilomètres de plages privées de sable blanc.

### Accès VIP :
Service "Fast Track" à l'aéroport international de Punta Cana.

### Réserve Écologique Ojos Indígenas :
Accès privé à des sources d'eau douce cristalline.

### Six Senses Spa :
Traitements de bien-être holistique de renommée mondiale.

### Fiche Technique

Prix : 6 950 000 $ US
Type de Propriété : Villa de Luxe Exclusive
Emplacement : Corales, Puntacana Resort & Club
Vues : Parcours de Golf et Lac
Surface de Construction : 1 300 m2
Surface du Terrain : 4 060 m2
Chambres : 7
Salles de Bains : 7,5
Commodités Mises en Évidence : Cour intérieure avec miroir d'eau, cuisine de chef, piscine à débordement, grand gazebo en cana, bureau privé.
Statut : Prête à être livrée / Revente de Luxe.`;


const propertyData = {
  _type: 'property',
  titleEn: 'Exclusive Luxury Villa with Golf and Lake Views in Corales – Puntacana Resort & Club',
  titleEs: 'Exclusiva Villa de Lujo con Vistas al Golf y al Lago en Corales – Puntacana Resort & Club',
  titleFr: 'Villa de Luxe Exclusive avec Vue sur le Golf et le Lac à Corales – Puntacana Resort & Club',
  slug: { current: 'exclusiva-villa-corales-golf-lago' },
  price: 6950000,
  status: 'sale',
  category: 'villas',
  location: 'corales',
  locationLabel: 'Corales, Puntacana Resort & Club',
  bedrooms: 7,
  bathrooms: 7.5,
  area: 1300,
  lotArea: 4060,
  isResale: true,
  descriptionEn: descEn,
  descriptionEs: descEs,
  descriptionFr: descFr,
  seo: {
    metaTitle: 'Exclusiva Villa de Lujo Corales | Punta Cana Investments',
    metaDescription: 'Adquiere esta exclusiva villa de diseño contemporáneo-tropical en Corales. 7 habitaciones, piscina infinity, vistas al golf y al lago por US$6,950,000.',
    keywords: [
      'villas de lujo en la playa Punta Cana',
      'casas de playa en Punta Cana',
      'mansión en la playa Punta Cana',
      'casas de playa exclusivas República Dominicana',
      'beachfront mansion Punta Cana',
      'Punta Cana beachfront real estate',
      'villa frente al mar Punta Cana',
      'oceanfront villa Punta Cana',
      'Puntacana Resort & Club',
      'Corales Puntacana Resort',
      'villa frente al golf Punta Cana',
      'golf front villa Punta Cana',
      'bienes raíces de lujo Punta Cana',
      'luxury real estate Dominican Republic',
      'mansión en venta Punta Cana',
      'mansion for sale Punta Cana',
      'villa de ultra lujo Punta Cana',
      'ultra-luxury homes Caribbean',
      'Punta Cana luxury homes',
      'casas millonarias Punta Cana',
      'comprar villa de lujo Punta Cana',
      'buy luxury villa Punta Cana',
      'propiedades exclusivas Punta Cana',
      'inversiones inmobiliarias Punta Cana',
      'Caribbean luxury real estate',
      'Corales Golf Course',
      'propiedades frente al acantilado Punta Cana',
      'cliffside villa Punta Cana',
      'Punta Cana Investments',
      'luxury beach villas Punta Cana',
      'Punta Cana beach houses',
      'beachfront real estate Dominican Republic',
      'oceanfront mansion Punta Cana',
      'golf course villa for sale Punta Cana',
      'million dollar homes Punta Cana',
      'buy exclusive property Punta Cana',
      'Caribbean luxury property investments',
      'cliff front villas Punta Cana'
    ]
  }
};

const imagesPath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056';
const files = [
  'media__1782428780239.jpg', // Main image
  'media__1782428799427.jpg',
  'media__1782428810676.jpg',
  'media__1782428829864.jpg',
  'media__1782428845044.jpg'
];

async function uploadProperty() {
  try {
    console.log('Uploading images...');
    const uploadedImages = [];
    
    for (const file of files) {
      console.log('Uploading ' + file + '...');
      const stream = fs.createReadStream(path.join(imagesPath, file));
      const asset = await client.assets.upload('image', stream, {
        filename: file
      });
      uploadedImages.push({
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id }
      });
    }

    console.log('Images uploaded successfully.');
    
    // Set first image as main
    propertyData.image = uploadedImages[0];
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
