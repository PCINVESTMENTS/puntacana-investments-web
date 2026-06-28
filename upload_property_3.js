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

const descEs = `Bienvenido a la grandeza clásica del Caribe. Esta imponente propiedad impresiona desde el primer instante con un majestuoso patio central adoquinado, rodeado de exuberante vegetación tropical y altos pórticos blancos que evocan la elegancia de las grandes haciendas. Su arquitectura simétrica de dos niveles destaca por sus profundas galerías envolventes, monumentales columnas cilíndricas y elegantes barandillas de hierro forjado que maximizan la brisa cruzada y la luz natural.

Entregada completamente amueblada, la residencia es un lienzo de sofisticación donde cada pieza ha sido cuidadosamente seleccionada, combinando el encanto clásico con el confort moderno para un estilo de vida de élite.

Interiores Eclécticos y Confort Absoluto

Salones de Doble Altura y Biblioteca: Las inmensas áreas sociales de concepto abierto están adornadas con estanterías hechas a medida, una colección de arte curada, esculturas metálicas y múltiples espacios de descanso. Los altos techos y las puertas de estilo francés permiten una transición perfecta hacia las terrazas.

Habitaciones (7 Suites): Refugios de serenidad con una personalidad única. Destacan detalles como hermosas camas con dosel de bambú, ropa de cama de alta costura, mobiliario clásico y puertas que se abren hacia balcones privados con vistas panorámicas a las copas de las palmeras y el horizonte.

Decoración Exquisita: Una mezcla perfecta de texturas naturales, maderas nobles, ratán y tonos blancos que resaltan sobre los prístinos pisos de piedra coralina que unifican toda la casa.

Exteriores de Ensueño: La Piscina Monumental y el Golf
El diseño exterior de esta villa está pensado para el entretenimiento a gran escala y la contemplación del paisaje.

Piscina Lap-Pool de Longitud Extraordinaria: Una característica arquitectónica verdaderamente única es su inmensa piscina rectangular que recorre casi toda la fachada trasera de la propiedad, flanqueada por una elegante línea de tumbonas blancas.

Terrazas y Comedores Al Fresco: Las profundas galerías techadas albergan sofisticados comedores de exterior y salas de estar de mimbre, ideales para disfrutar de la vista bajo la sombra.

Paisajismo Majestuoso: Un terreno de 4,652 m2 de césped perfectamente cuidado, adornado con imponentes palmeras Bismarck (de distintivo tono azul platinado) que guían la mirada hacia la serenidad del lago y los greens del campo de golf.

El Privilegio de la Ubicación: La Comunidad de Corales
Vivir en el vecindario de Corales es pertenecer a uno de los clubes más selectos del planeta. Es un santuario de tranquilidad que garantiza una privacidad expansiva, combinando la vida de ultra-lujo con el acceso directo a los hoyos del campo de golf PGA.`;

const descEn = `Welcome to the classic grandeur of the Caribbean. This imposing property impresses from the very first moment with a majestic cobblestone central courtyard, surrounded by lush tropical vegetation and high white porticos that evoke the elegance of grand haciendas. Its symmetrical two-level architecture is highlighted by deep wrap-around galleries, monumental cylindrical columns, and elegant wrought-iron railings that maximize cross breezes and natural light.

Delivered fully furnished, the residence is a canvas of sophistication where every piece has been carefully selected, blending classic charm with modern comfort for an elite lifestyle.

Eclectic Interiors and Absolute Comfort

Double-Height Lounges and Library: The immense open-concept social areas are adorned with custom-made bookshelves, a curated art collection, metal sculptures, and multiple seating areas. High ceilings and French-style doors allow a seamless transition to the terraces.

Bedrooms (7 Suites): Sanctuaries of serenity with a unique personality. Details such as beautiful bamboo canopy beds, haute couture bedding, classic furniture, and doors opening to private balconies with panoramic views of palm treetops and the horizon stand out.

Exquisite Decoration: A perfect blend of natural textures, noble woods, rattan, and white tones that stand out against the pristine coral stone floors unifying the entire house.

Dreamlike Exteriors: The Monumental Pool and Golf
The exterior design of this villa is intended for large-scale entertainment and landscape contemplation.

Extraordinary Lap-Pool: A truly unique architectural feature is its immense rectangular pool running almost the entire length of the property's rear facade, flanked by an elegant line of white loungers.

Terraces and Al Fresco Dining: The deep covered galleries house sophisticated outdoor dining areas and wicker living rooms, ideal for enjoying the view in the shade.

Majestic Landscaping: A perfectly manicured 4,652 m2 lawn, adorned with imposing Bismarck palms (with a distinctive platinum blue hue) that guide the eye towards the serenity of the lake and the golf course greens.

The Privilege of Location: The Corales Community
Living in the Corales neighborhood means belonging to one of the most select clubs on the planet. It is a sanctuary of tranquility that guarantees expansive privacy, combining ultra-luxury living with direct access to the holes of the PGA golf course.`;

const descFr = `Bienvenue dans la grandeur classique des Caraïbes. Cette imposante propriété impressionne dès le premier instant avec une majestueuse cour centrale pavée, entourée d'une végétation tropicale luxuriante et de hauts portiques blancs qui évoquent l'élégance des grandes haciendas. Son architecture symétrique à deux niveaux est mise en valeur par de profondes galeries enveloppantes, des colonnes cylindriques monumentales et d'élégantes balustrades en fer forgé qui maximisent la brise croisée et la lumière naturelle.

Livrée entièrement meublée, la résidence est une toile de sophistication où chaque pièce a été soigneusement sélectionnée, alliant charme classique et confort moderne pour un style de vie d'élite.

Intérieurs Éclectiques et Confort Absolu

Salons à Double Hauteur et Bibliothèque : Les immenses espaces sociaux à aire ouverte sont ornés d'étagères sur mesure, d'une collection d'art soignée, de sculptures métalliques et de multiples espaces de détente. Les hauts plafonds et les portes à la française permettent une transition parfaite vers les terrasses.

Chambres (7 Suites) : Refuges de sérénité avec une personnalité unique. Des détails tels que de magnifiques lits à baldaquin en bambou, une literie de haute couture, des meubles classiques et des portes s'ouvrant sur des balcons privés avec vue panoramique sur la cime des palmiers et l'horizon se distinguent.

Décoration Exquise : Un mélange parfait de textures naturelles, de bois nobles, de rotin et de tons blancs qui ressortent sur les sols immaculés en pierre de corail unifiant toute la maison.

Extérieurs de Rêve : La Piscine Monumentale et le Golf
Le design extérieur de cette villa est conçu pour des divertissements à grande échelle et la contemplation du paysage.

Piscine Lap-Pool Extraordinaire : Une caractéristique architecturale vraiment unique est son immense piscine rectangulaire qui s'étend sur presque toute la façade arrière de la propriété, flanquée d'une élégante rangée de chaises longues blanches.

Terrasses et Salle à Manger Al Fresco : Les profondes galeries couvertes abritent des salles à manger extérieures sophistiquées et des salons en osier, idéaux pour profiter de la vue à l'ombre.

Aménagement Paysager Majestueux : Un terrain parfaitement entretenu de 4 652 m2, orné d'imposants palmiers Bismarck (à la teinte bleu platine distinctive) qui guident le regard vers la sérénité du lac et les greens du parcours de golf.

Le Privilège de l'Emplacement : La Communauté de Corales
Vivre dans le quartier de Corales signifie appartenir à l'un des clubs les plus sélects de la planète. C'est un sanctuaire de tranquillité qui garantit une grande intimité, alliant la vie d'ultra-luxe à un accès direct aux trous du parcours de golf PGA.`;

const propertyData = {
  _type: 'property',
  title: 'Majestuosa Villa Estilo Plantación con Vistas al Golf y Lago en Corales – Puntacana Resort & Club',
  titleEs: 'Majestuosa Villa Estilo Plantación con Vistas al Golf y Lago en Corales – Puntacana Resort & Club',
  titleEn: 'Majestic Plantation-Style Villa with Golf and Lake Views in Corales – Puntacana Resort & Club',
  titleFr: 'Majestueuse Villa de Style Plantation avec Vue sur le Golf et le Lac à Corales – Puntacana Resort & Club',
  slug: { current: 'majestuosa-villa-plantacion-golf-lago-corales' },
  price: 6200000,
  status: 'sale',
  category: 'villas',
  location: 'corales',
  locationLabel: 'Corales, Puntacana Resort & Club',
  bedrooms: 7,
  baths: 7.5,
  area: 1393,
  lotArea: 4652,
  isResale: true,
  descriptionEn: descEn,
  descriptionEs: descEs,
  descriptionFr: descFr,
  featuresEs: [
    'Piscina monumental tipo Lap-Pool',
    'Profundas galerías envolventes',
    'Majestuoso patio central adoquinado',
    'Diseño de interiores curado (Amueblada Full)',
    'Campo de Golf Corales y La Cana',
    'Millas de playas privadas de arena blanca (Playa Serena)',
    'Servicio VIP "Fast Track" en el Aeropuerto de Punta Cana',
    'Reserva Ecológica Ojos Indígenas',
    'Six Senses Spa'
  ],
  featuresEn: [
    'Monumental Lap-Pool',
    'Deep wrap-around galleries',
    'Majestic cobblestone central courtyard',
    'Curated interior design (Fully Furnished)',
    'Corales & La Cana Golf Courses',
    'Miles of pristine private white sand beaches (Playa Serena)',
    'VIP "Fast Track" Service at Punta Cana Airport',
    'Ojos Indígenas Ecological Reserve',
    'Six Senses Spa'
  ],
  featuresFr: [
    'Piscine monumentale Lap-Pool',
    'Profondes galeries enveloppantes',
    'Majestueuse cour centrale pavée',
    "Design d'intérieur soigné (Entièrement Meublé)",
    'Parcours de Golf Corales & La Cana',
    'Des kilomètres de plages de sable blanc privées (Playa Serena)',
    "Service VIP \"Fast Track\" à l'Aéroport de Punta Cana",
    'Réserve Écologique Ojos Indígenas',
    'Six Senses Spa'
  ],
  seo: {
    title: {
      es: 'Majestuosa Villa Estilo Plantación en Corales | Punta Cana Investments',
      en: 'Majestic Plantation-Style Villa in Corales | Punta Cana Investments',
      fr: 'Majestueuse Villa de Style Plantation à Corales | Punta Cana Investments'
    },
    description: {
      es: 'Invierte en esta imponente villa estilo plantación en Corales, Punta Cana. 7 habitaciones, lap-pool, vistas despejadas al golf y lago por US$6,200,000.',
      en: 'Invest in this imposing plantation-style villa in Corales, Punta Cana. 7 bedrooms, lap-pool, unobstructed golf and lake views for US$6,200,000.',
      fr: 'Investissez dans cette imposante villa de style plantation à Corales, Punta Cana. 7 chambres, lap-pool, vues dégagées sur le golf et le lac pour 6 200 000 $ US.'
    },
    keywords: {
      es: [
        'villa con vista al lago Punta Cana',
        'villa frente al golf Punta Cana',
        'casas de lujo en campos de golf Punta Cana',
        'Corales Puntacana Resort',
        'Puntacana Resort & Club',
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
        'PGA Tour Corales',
        'villa estilo plantación Punta Cana',
        'Punta Cana Investments'
      ],
      en: [
        'lake view villa Punta Cana',
        'golf front villa Punta Cana',
        'luxury golf villas Caribbean',
        'Corales Golf Course real estate',
        'Punta Cana golf properties',
        'exclusive homes Dominican Republic',
        'Punta Cana luxury real estate',
        'luxury real estate Dominican Republic',
        'mansion for sale Punta Cana',
        'ultra-luxury homes Caribbean',
        'Punta Cana luxury homes',
        'million dollar homes Punta Cana',
        'buy luxury villa Punta Cana',
        'exclusive properties Punta Cana',
        'Punta Cana real estate investments',
        'Caribbean luxury real estate',
        'Punta Cana Investments'
      ],
      fr: [
        'villa avec vue sur le lac Punta Cana',
        'villa sur golf Punta Cana',
        'villas de luxe golf Caraïbes',
        'immobilier golf Punta Cana',
        'Puntacana Resort & Club',
        'Corales Puntacana Resort',
        'immobilier de luxe Punta Cana',
        'immobilier de luxe République Dominicaine',
        'manoir à vendre Punta Cana',
        'maisons ultra-luxe Caraïbes',
        'maisons de luxe Punta Cana',
        'maisons de millionnaires Punta Cana',
        'acheter villa de luxe Punta Cana',
        'propriétés exclusives Punta Cana',
        'investissements immobiliers Punta Cana',
        'immobilier de luxe Caraïbes',
        'Corales Golf Course',
        'Punta Cana Investments'
      ]
    }
  }
};

const imagesPath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056';
const files = [
  'media__1782435210518.jpg', // Main image
  'media__1782435224848.jpg',
  'media__1782435237282.jpg',
  'media__1782435253276.jpg',
  'media__1782435263552.png'
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
