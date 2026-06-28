import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function uploadImage(filePath) {
  console.log(`Uploading ${filePath}...`);
  const imageAsset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: path.basename(filePath)
  });
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: imageAsset._id
    }
  };
}

async function main() {
  const images = [
    '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782422800816.jpg',
    '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782422826900.jpg',
    '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782422844724.jpg',
    '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782422873610.jpg',
    '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056/media__1782422894094.jpg'
  ];

  try {
    const uploadedImages = [];
    for (const img of images) {
      if (fs.existsSync(img)) {
        uploadedImages.push(await uploadImage(img));
      } else {
        console.warn(`File not found: ${img}`);
      }
    }

    if (uploadedImages.length === 0) {
      console.error("No images found to upload.");
      return;
    }

    const mainImage = uploadedImages[0];
    const gallery = uploadedImages.slice(1);

    const doc = {
      _type: 'property',
      title: 'Majestuosa Villa de Ultra-Lujo Frente al Mar y Campo de Golf en Corales – Puntacana Resort & Club',
      titleEs: 'Majestuosa Villa de Ultra-Lujo Frente al Mar y Campo de Golf en Corales',
      titleEn: 'Majestic Ultra-Luxury Oceanfront and Golf Course Villa in Corales',
      titleFr: "Majestueuse Villa Ultra-Luxe Face à l'Océan et au Golf à Corales",
      slug: {
        _type: 'slug',
        current: 'majestuosa-villa-ultra-lujo-corales-puntacana-resort-club'
      },
      location: 'puntacana',
      locationLabel: 'Corales, Puntacana Resort & Club',
      type: 'villa',
      status: 'sale',
      price: 11800000,
      beds: 7,
      baths: 9,
      area: 1580,
      mainImage: mainImage,
      gallery: gallery,
      featured: true,
      
      featuresEs: [
        "Frente al Mar (Acantilados)",
        "Frente al Campo de Golf",
        "7 Habitaciones (Suites)",
        "9 Baños",
        "1,580 m2 de Construcción",
        "5,042 m2 de Solar",
        "Cine Privado Inmersivo",
        "Cocina de Chef (Industrial Viking)",
        "Gran Gazebo Privado",
        "Comedor Exterior de Piedra Natural",
        "Piscina con Solárium de Coralina",
        "Arquitectura Colonial (Estilo Plantación)",
        "Mobiliario de Diseño y Antigüedades",
        "Cuartos de Servicio"
      ],
      featuresEn: [
        "Oceanfront (Cliffs)",
        "Golf Course Front",
        "7 Bedrooms (Suites)",
        "9 Bathrooms",
        "17,006 sq ft Construction",
        "54,271 sq ft Lot",
        "Private Immersive Cinema",
        "Chef's Kitchen (Industrial Viking)",
        "Large Private Gazebo",
        "Natural Stone Outdoor Dining",
        "Pool with Coral Stone Solarium",
        "Colonial Architecture (Plantation Style)",
        "Designer Furniture and Antiques",
        "Maid's Quarters"
      ],
      featuresFr: [
        "Face à l'Océan (Falaises)",
        "Face au Terrain de Golf",
        "7 Chambres (Suites)",
        "9 Salles de Bains",
        "1 580 m2 de Construction",
        "5 042 m2 de Terrain",
        "Cinéma Privé Immersif",
        "Cuisine de Chef (Viking Industriel)",
        "Grand Gazebo Privé",
        "Salle à Manger Extérieure en Pierre Naturelle",
        "Piscine avec Solarium en Pierre de Corail",
        "Architecture Coloniale (Style Plantation)",
        "Meubles Design et Antiquités",
        "Quartiers du Personnel"
      ],

      descriptionEs: `Resumen de la Propiedad\nUbicada en el enclave más exclusivo y codiciado de todo el Caribe, esta majestuosa villa dentro de Puntacana Resort & Club redefine el concepto de ultra-lujo. Esta propiedad goza de una ubicación inigualable y dramática: se erige imponente frente al mar, donde las olas rompen contra majestuosos acantilados de coral, flanqueada por el impecable verde del campo de golf de campeonato. Situada sobre un imponente solar de 5,042 m2 y con 1,580 m2 de construcción, esta residencia de arquitectura colonial estilo plantación, con 7 habitaciones y 9 baños, es una verdadera obra maestra. Con un valor de US$11,800,000, representa el pináculo del estatus, la privacidad y el estilo de vida de élite en el portafolio de Punta Cana Investments.\n\nDescripción Detallada\nBienvenido a la máxima expresión de opulencia en el Caribe. La grandiosidad de esta propiedad comienza desde su imponente entrada, donde un sólido portón doble de madera se abre hacia un patio simétrico de piedra coralina, rodeado de altas palmeras. La fachada principal es un espectáculo visual: una estructura simétrica de dos niveles con profundas galerías, majestuosas columnas blancas, techos oscuros a cuatro aguas y clásicas contraventanas de celosía verde.\n\nSeparada del océano solo por un inmenso y prístino jardín de césped y los greens del campo de golf, la propiedad ofrece un espectáculo natural inigualable: el contraste entre la tranquilidad del jardín tropical y la fuerza del mar Caribe rompiendo contra la escarpada costa de coral.\n\nInteriores de Diseño, Arte y Confort Absoluto\nDetalles Clásicos y Antigüedades: Los espacios interiores están adornados con mobiliario tallado a mano, piezas de arte clásico y maderas nobles que aportan calidez y sofisticación a cada rincón.\nHabitaciones: 7 espectaculares suites diseñadas como refugios de serenidad. Las puertas de celosía blanca se abren hacia balcones privados, enmarcando vistas despejadas del campo de golf y el océano como si fueran pinturas vivas.\nCocina de Chef: Un espacio de proporciones extraordinarias con gabinetes blancos a medida, hermosos pisos de baldosas geométricas, topes de mármol y una masiva estufa doble Viking de grado industrial, ideal para la más alta exigencia gastronómica.\nCine Privado: Una sala de proyección inmersiva de última generación, completamente oscura para máxima acústica, equipada con amplios sofás lounge distribuidos en múltiples niveles.\n\nExteriores de Ensueño: Terrazas, Comedores y Vistas Panorámicas\nComedor Al Fresco Espectacular: Una extensa galería techada alberga una monumental mesa de comedor tallada en piedra natural, rodeada de elegantes sillas de ratán oscuro. Coronada por faroles de hierro forjado y decorada con cristalería verde, ofrece una vista panorámica en primera fila de las palmeras y el campo de golf.\nPiscinas y Solárium Frente al Mar: Descansando sobre inmaculados pisos de piedra coralina, elegantes tumbonas dobles de madera con cojines blancos bordean las áreas de piscina. Es el rincón perfecto para relajarse y observar cómo el horizonte verde del campo de golf se funde con el azul profundo de los acantilados marinos.\nEl Gazebo Privado: Un pabellón columnado independiente que alberga una sofisticada sala de estar al aire libre, ideal para recibir invitados con la brisa del mar como telón de fondo.\n\nEl Privilegio de la Ubicación: La Comunidad de Corales\nVivir en el vecindario de Corales es pertenecer a uno de los clubes más selectos del planeta. Famoso por haber sido el refugio de figuras globales, es un santuario de tranquilidad que garantiza una privacidad expansiva entre propiedades, combinando la vida frente al mar con el acceso directo a los hoyos costeros del campo de golf.\n\nAmenidades y Beneficios Exclusivos de Puntacana Resort & Club\nGolf de Clase Mundial en su Puerta: Acceso inmediato al Corales Golf Course (sede del PGA Tour) y al La Cana Golf Course.\nPlaya Serena y Club de Playa: Kilómetros de playas privadas de arena blanca.\nAcceso VIP: Privilegios exclusivos y servicio "Fast Track" en el Aeropuerto Internacional de Punta Cana.\nReserva Ecológica Ojos Indígenas: Acceso privado a manantiales de agua dulce cristalina.\nSix Senses Spa y Gastronomía: Tratamientos de bienestar holístico de renombre mundial y acceso a restaurantes de alta cocina galardonados.`,

      descriptionEn: `Property Overview\nLocated in the most exclusive and coveted enclave in the entire Caribbean, this majestic villa within Puntacana Resort & Club redefines the concept of ultra-luxury. This property boasts an unparalleled and dramatic location: it stands imposingly facing the sea, where the waves crash against majestic coral cliffs, flanked by the impeccable green of the championship golf course. Situated on an imposing plot of 54,271 sq ft (5,042 m2) with 17,006 sq ft (1,580 m2) of construction, this plantation-style colonial architecture residence, featuring 7 bedrooms and 9 bathrooms, is a true masterpiece. Priced at US$11,800,000, it represents the pinnacle of status, privacy, and elite lifestyle in the Punta Cana Investments portfolio.\n\nDetailed Description\nWelcome to the ultimate expression of opulence in the Caribbean. The grandeur of this property begins from its imposing entrance, where solid double wooden doors open onto a symmetrical coral stone courtyard, surrounded by tall palm trees. The main facade is a visual spectacle: a symmetrical two-level structure with deep galleries, majestic white columns, dark hipped roofs, and classic green louvered shutters.\n\nSeparated from the ocean only by an immense and pristine lawn garden and the golf course greens, the property offers an unparalleled natural spectacle: the contrast between the tranquility of the tropical garden and the force of the Caribbean Sea crashing against the rugged coral coast.\n\nDesign Interiors, Art, and Absolute Comfort\nClassic Details and Antiques: The interior spaces are adorned with hand-carved furniture, classic art pieces, and noble woods that bring warmth and sophistication to every corner.\nBedrooms: 7 spectacular suites designed as havens of serenity. White louvered doors open onto private balconies, framing unobstructed views of the golf course and the ocean as if they were living paintings.\nChef's Kitchen: A space of extraordinary proportions with custom white cabinetry, beautiful geometric tile floors, marble countertops, and a massive industrial-grade Viking double stove, ideal for the highest gastronomic demands.\nPrivate Cinema: A state-of-the-art immersive screening room, completely darkened for maximum acoustics, equipped with spacious lounge sofas distributed across multiple levels.\n\nDream Exteriors: Terraces, Dining Rooms, and Panoramic Views\nSpectacular Al Fresco Dining: An extensive covered gallery houses a monumental dining table carved in natural stone, surrounded by elegant dark rattan chairs. Crowned by wrought-iron lanterns and decorated with green glassware, it offers a front-row panoramic view of the palm trees and the golf course.\nOceanfront Pools and Solarium: Resting on immaculate coral stone floors, elegant double wooden loungers with white cushions border the pool areas. It is the perfect spot to relax and watch the green horizon of the golf course merge with the deep blue of the sea cliffs.\nThe Private Gazebo: An independent columned pavilion housing a sophisticated outdoor living room, ideal for entertaining guests with the sea breeze as a backdrop.\n\nThe Privilege of Location: The Corales Community\nLiving in the Corales neighborhood means belonging to one of the most exclusive clubs on the planet. Famous for having been the refuge of global figures, it is a sanctuary of tranquility that guarantees expansive privacy between properties, combining oceanfront living with direct access to the coastal holes of the golf course.\n\nExclusive Amenities and Benefits of Puntacana Resort & Club\nWorld-Class Golf at Your Doorstep: Immediate access to the Corales Golf Course (home of the PGA Tour) and the La Cana Golf Course.\nPlaya Serena and Beach Club: Miles of private white sand beaches.\nVIP Access: Exclusive privileges and "Fast Track" service at the Punta Cana International Airport.\nOjos Indígenas Ecological Reserve: Private access to crystal-clear freshwater springs.\nSix Senses Spa and Gastronomy: World-renowned holistic wellness treatments and access to award-winning fine dining restaurants.`,
      
      descriptionFr: `Aperçu de la Propriété\nSituée dans l'enclave la plus exclusive et convoitée de toutes les Caraïbes, cette majestueuse villa au sein du Puntacana Resort & Club redéfinit le concept de l'ultra-luxe. Cette propriété bénéficie d'un emplacement spectaculaire et sans pareil : elle se dresse majestueusement face à la mer, où les vagues se brisent contre d'imposantes falaises de corail, flanquée par le vert impeccable du terrain de golf de championnat. Établie sur un vaste terrain de 5 042 m2 avec 1 580 m2 de construction, cette résidence à l'architecture coloniale de style plantation, comprenant 7 chambres et 9 salles de bains, est un véritable chef-d'œuvre. Évaluée à 11 800 000 $ US, elle représente le summum du statut, de l'intimité et du style de vie de l'élite dans le portefeuille de Punta Cana Investments.\n\nDescription Détaillée\nBienvenue à l'expression ultime de l'opulence dans les Caraïbes. La grandeur de cette propriété commence dès son entrée imposante, où une solide double porte en bois s'ouvre sur une cour symétrique en pierre de corail, entourée de grands palmiers. La façade principale est un spectacle visuel : une structure symétrique à deux niveaux avec de profondes galeries, de majestueuses colonnes blanches, des toits en croupe foncés et des volets persiennes verts classiques.\n\nSéparée de l'océan uniquement par un immense jardin de pelouse immaculé et les greens du terrain de golf, la propriété offre un spectacle naturel inégalé : le contraste entre la tranquillité du jardin tropical et la force de la mer des Caraïbes se brisant contre la côte corallienne escarpée.\n\nIntérieurs Design, Art et Confort Absolu\nDétails Classiques et Antiquités : Les espaces intérieurs sont ornés de meubles sculptés à la main, de pièces d'art classique et de bois nobles qui apportent chaleur et sophistication à chaque coin.\nChambres : 7 suites spectaculaires conçues comme des havres de sérénité. Des portes à persiennes blanches s'ouvrent sur des balcons privés, encadrant des vues imprenables sur le terrain de golf et l'océan comme si c'étaient des tableaux vivants.\nCuisine de Chef : Un espace aux proportions extraordinaires avec des armoires blanches sur mesure, de magnifiques sols en carreaux géométriques, des plans de travail en marbre et une imposante cuisinière double Viking de qualité industrielle, idéale pour les plus hautes exigences gastronomiques.\nCinéma Privé : Une salle de projection immersive ultramoderne, complètement obscurcie pour une acoustique maximale, équipée de vastes canapés lounge répartis sur plusieurs niveaux.\n\nExtérieurs de Rêve : Terrasses, Salles à Manger et Vues Panoramiques\nSalle à Manger Al Fresco Spectaculaire : Une vaste galerie couverte abrite une table à manger monumentale sculptée en pierre naturelle, entourée d'élégantes chaises en rotin foncé. Couronnée par des lanternes en fer forgé et décorée de verrerie verte, elle offre une vue panoramique au premier rang sur les palmiers et le terrain de golf.\nPiscines Face à la Mer et Solarium : Reposant sur des sols en pierre de corail immaculés, d'élégantes chaises longues doubles en bois avec des coussins blancs bordent les espaces piscine. C'est l'endroit parfait pour se détendre et observer l'horizon vert du terrain de golf se fondre avec le bleu profond des falaises marines.\nLe Gazebo Privé : Un pavillon à colonnes indépendant abritant un salon extérieur sophistiqué, idéal pour recevoir des invités avec la brise marine en toile de fond.\n\nLe Privilège de l'Emplacement : La Communauté de Corales\nVivre dans le quartier de Corales, c'est appartenir à l'un des clubs les plus sélects de la planète. Célèbre pour avoir été le refuge de personnalités mondiales, c'est un sanctuaire de tranquillité qui garantit une grande intimité entre les propriétés, alliant la vie en bord de mer à un accès direct aux trous côtiers du terrain de golf.\n\nCommodités et Avantages Exclusifs du Puntacana Resort & Club\nGolf de Classe Mondiale à votre Porte : Accès immédiat au parcours de golf Corales (siège du PGA Tour) et au parcours de golf La Cana.\nPlaya Serena et Club de Plage : Des kilomètres de plages privées de sable blanc.\nAccès VIP : Privilèges exclusifs et service "Fast Track" à l'aéroport international de Punta Cana.\nRéserve Écologique Ojos Indígenas : Accès privé à des sources d'eau douce cristalline.\nSix Senses Spa et Gastronomie : Traitements de bien-être holistique de renommée mondiale et accès à des restaurants gastronomiques primés.`
    };

    const res = await client.create(doc);
    console.log('Property created successfully:', res._id);
  } catch (error) {
    console.error('Error creating property:', error);
  }
}

main();
