const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

const propertyData = {
  _type: 'property',
  id: 1003, // Next local ID
  title: "Exclusivo Apartamento de 1 Habitación en Epic Punta Cana",
  slug: { _type: 'slug', current: 'apartamento-1-habitacion-epic-punta-cana' },
  type: "apartment",
  status: "sale",
  price: 105900,
  area: 60,
  bedrooms: 1,
  bathrooms: 1,
  parkings: 1,
  featured: true,
  locationLabel: "Epic Residences",
  descriptionEs: `Ubicado en el prestigioso proyecto residencial Epic Punta Cana, este apartamento de lujo de 1 habitación y 60 m2 representa la combinación perfecta entre diseño contemporáneo y rentabilidad estratégica. Con un precio altamente competitivo de US$105,900, es una oportunidad inmejorable para inversionistas que buscan alta plusvalía y un estilo de vida premium en el Caribe.

Bienvenido a una nueva definición de estilo de vida y rentabilidad en el corazón del Caribe. Este impecable apartamento de 60 metros cuadrados en Epic Punta Cana ha sido cuidadosamente diseñado para maximizar cada espacio, ofreciendo una experiencia residencial de lujo con líneas limpias, iluminación natural y acabados de primera categoría.

La propiedad cuenta con una distribución inteligente de concepto abierto que integra de manera fluida la sala de estar, el comedor y una cocina moderna de alta gama, creando un ambiente sofisticado y acogedor. La habitación principal está concebida como un refugio privado, complementada con un baño de diseño elegante y materiales cuidadosamente seleccionados para garantizar durabilidad y estética.

**Distribución Inteligente (60 m2)**
* **Habitación Principal:** Espaciosa, con excelente ventilación e iluminación natural.
* **Baño:** 1 Baño completo con acabados de lujo y grifería de alta calidad.
* **Espacios Sociales:** Concepto abierto de sala y comedor con acceso directo a la luz exterior.
* **Cocina:** Moderna, con topes de primera y diseño ergonómico.
* **Exteriores:** Balcón privado ideal para disfrutar del clima tropical.
* **Servicios:** Área de lavado integrada.
* **Estacionamiento:** 1 Parqueo asignado.

**Amenidades del Proyecto Epic Punta Cana:**
Vivir o invertir en Epic Punta Cana significa tener acceso a un entorno diseñado para el confort absoluto. El proyecto ofrece a sus residentes:
* Piscina estilo resort.
* Áreas de esparcimiento y zonas sociales exclusivas.
* Paisajismo impecable con áreas verdes.
* Seguridad 24/7 con control de acceso perimetral.

**Ubicación Estratégica y Distancias Clave**
Epic Punta Cana se encuentra estratégicamente ubicado en el corazón de Bávaro, una de las zonas de mayor desarrollo, crecimiento y demanda en la región este.
* **Downtown Punta Cana:** A solo 5 - 10 minutos. Todo el entretenimiento, gastronomía y vida nocturna a su alcance.
* **Supermercados y Comercio:** 5 a 10 minutos.
* **Playas de Bávaro:** 10 a 15 minutos de las mejores playas del destino.
* **Centros Médicos de Primer Nivel:** 10 a 15 minutos, garantizando seguridad y asistencia de salud internacional.
* **Aeropuerto Internacional de Punta Cana:** 10 a 15 minutos.

**Potencial de Inversión y Rentabilidad**
Adquirir esta propiedad garantiza la integración a un ecosistema de alto nivel. Gracias a su tamaño optimizado de 1 habitación, su competitivo precio de US$105,900 y su inmejorable ubicación, este apartamento es el producto ideal para la generación de ingresos a través de rentas a corto plazo (plataformas vacacionales) y largo plazo, asegurando un excelente Retorno de Inversión (ROI) y una constante revalorización.`,
  descriptionEn: `Located in the prestigious Epic Punta Cana residential project, this luxury 1-bedroom, 60 m2 apartment represents the perfect combination of contemporary design and strategic profitability. With a highly competitive price of US$105,900, it is an unbeatable opportunity for investors looking for high capital gains and a premium lifestyle in the Caribbean.

Welcome to a new definition of lifestyle and profitability in the heart of the Caribbean. This impeccable 60-square-meter apartment in Epic Punta Cana has been carefully designed to maximize every space, offering a luxury residential experience with clean lines, natural lighting, and top-tier finishes.

The property features a smart open-concept layout that seamlessly integrates the living room, dining room, and a high-end modern kitchen, creating a sophisticated and welcoming atmosphere. The master bedroom is conceived as a private retreat, complemented by an elegantly designed bathroom and carefully selected materials to ensure durability and aesthetics.

**Smart Layout (60 m2)**
* **Master Bedroom:** Spacious, with excellent ventilation and natural lighting.
* **Bathroom:** 1 Full bathroom with luxury finishes and high-quality fixtures.
* **Social Spaces:** Open concept living and dining area with direct access to natural light.
* **Kitchen:** Modern, with premium countertops and ergonomic design.
* **Exteriors:** Private balcony ideal for enjoying the tropical climate.
* **Services:** Integrated laundry area.
* **Parking:** 1 Assigned parking space.

**Amenities of the Epic Punta Cana Project:**
Living or investing in Epic Punta Cana means having access to an environment designed for absolute comfort. The project offers its residents:
* Resort-style pool.
* Exclusive recreation areas and social zones.
* Impeccable landscaping with green areas.
* 24/7 security with perimeter access control.

**Strategic Location and Key Distances**
Epic Punta Cana is strategically located in the heart of Bávaro, one of the areas with the highest development, growth, and demand in the eastern region.
* **Downtown Punta Cana:** Just 5 - 10 minutes away. All entertainment, dining, and nightlife at your fingertips.
* **Supermarkets and Commerce:** 5 to 10 minutes.
* **Bávaro Beaches:** 10 to 15 minutes from the best beaches in the destination.
* **Top-Tier Medical Centers:** 10 to 15 minutes, ensuring security and international healthcare assistance.
* **Punta Cana International Airport:** 10 to 15 minutes.

**Investment Potential and Profitability**
Acquiring this property guarantees integration into a high-level ecosystem. Thanks to its optimized 1-bedroom size, highly competitive price of US$105,900, and unbeatable location, this apartment is the ideal product for generating income through short-term rentals (vacation platforms) and long-term rentals, ensuring an excellent Return on Investment (ROI) and constant appreciation.`,
  descriptionFr: `Situé dans le prestigieux projet résidentiel Epic Punta Cana, cet appartement de luxe d'une chambre de 60 m2 représente la combinaison parfaite entre design contemporain et rentabilité stratégique. Avec un prix très compétitif de 105 900 $ US, c'est une opportunité imbattable pour les investisseurs à la recherche d'une forte plus-value et d'un style de vie premium dans les Caraïbes.

Bienvenue dans une nouvelle définition du style de vie et de la rentabilité au cœur des Caraïbes. Cet impeccable appartement de 60 mètres carrés à Epic Punta Cana a été soigneusement conçu pour maximiser chaque espace, offrant une expérience résidentielle de luxe avec des lignes épurées, un éclairage naturel et des finitions de premier ordre.

La propriété dispose d'un aménagement intelligent à aire ouverte qui intègre parfaitement le salon, la salle à manger et une cuisine moderne haut de gamme, créant une atmosphère sophistiquée et accueillante. La chambre principale est conçue comme une retraite privée, complétée par une salle de bain au design élégant et des matériaux soigneusement sélectionnés pour assurer durabilité et esthétique.

**Aménagement Intelligent (60 m2)**
* **Chambre Principale :** Spacieuse, avec une excellente ventilation et un éclairage naturel.
* **Salle de Bain :** 1 Salle de bain complète avec des finitions de luxe et des équipements de haute qualité.
* **Espaces Sociaux :** Salon et salle à manger à aire ouverte avec accès direct à la lumière extérieure.
* **Cuisine :** Moderne, avec des comptoirs haut de gamme et un design ergonomique.
* **Extérieurs :** Balcon privé idéal pour profiter du climat tropical.
* **Services :** Espace buanderie intégré.
* **Parking :** 1 Place de parking attribuée.

**Commodités du Projet Epic Punta Cana :**
Vivre ou investir à Epic Punta Cana signifie avoir accès à un environnement conçu pour un confort absolu. Le projet offre à ses résidents :
* Piscine de style complexe.
* Espaces de loisirs et zones sociales exclusifs.
* Aménagement paysager impeccable avec des espaces verts.
* Sécurité 24/7 avec contrôle d'accès périmétrique.

**Emplacement Stratégique et Distances Clés**
Epic Punta Cana est stratégiquement situé au cœur de Bávaro, l'une des zones au développement, à la croissance et à la demande les plus élevés de la région est.
* **Downtown Punta Cana :** À seulement 5 - 10 minutes. Tous les divertissements, la gastronomie et la vie nocturne à portée de main.
* **Supermarchés et Commerces :** 5 à 10 minutes.
* **Plages de Bávaro :** 10 à 15 minutes des meilleures plages de la destination.
* **Centres Médicaux de Premier Plan :** 10 à 15 minutes, garantissant sécurité et assistance médicale internationale.
* **Aéroport International de Punta Cana :** 10 à 15 minutes.

**Potentiel d'Investissement et Rentabilité**
L'acquisition de cette propriété garantit l'intégration dans un écosystème de haut niveau. Grâce à sa taille optimisée d'une chambre, à son prix hautement compétitif de 105 900 $ US et à son emplacement imbattable, cet appartement est le produit idéal pour générer des revenus grâce à des locations à court terme (plateformes de vacances) et à long terme, garantissant un excellent Retour sur Investissement (ROI) et une appréciation constante.`,
  featuresEs: ["Piscina estilo resort", "Áreas sociales exclusivas", "Paisajismo impecable", "Seguridad 24/7", "A 10 min de la playa", "Balcón privado", "Airbnb Friendly"],
  featuresEn: ["Resort-style pool", "Exclusive social areas", "Impeccable landscaping", "24/7 security", "10 min to the beach", "Private balcony", "Airbnb Friendly"],
  featuresFr: ["Piscine de style complexe", "Espaces sociaux exclusifs", "Aménagement paysager impeccable", "Sécurité 24/7", "À 10 min de la plage", "Balcon privé", "Airbnb Friendly"],
  seo: {
    title: {
      es: 'Exclusivo Apartamento de 1 Habitación en Epic Punta Cana | US$105,900',
      en: 'Exclusive 1-Bedroom Apartment in Epic Punta Cana | US$105,900',
      fr: 'Appartement Exclusif d\'une Chambre à Epic Punta Cana | 105 900 $ US'
    },
    description: {
      es: 'Apartamento de lujo de 60m2 en Epic Punta Cana. Ideal para inversión y rentabilidad en Bávaro. 1 habitación, piscina estilo resort y seguridad 24/7.',
      en: '60m2 luxury apartment in Epic Punta Cana. Ideal for investment and profitability in Bávaro. 1 bedroom, resort-style pool and 24/7 security.',
      fr: 'Appartement de luxe de 60m2 à Epic Punta Cana. Idéal pour investissement et rentabilité à Bávaro. 1 chambre, piscine de style complexe et sécurité 24/7.'
    },
    keywords: {
      es: ['Epic Punta Cana', 'apartamento en venta Bávaro', 'inversión inmobiliaria Punta Cana', 'Airbnb Punta Cana', 'apartamento 1 habitación Bávaro'],
      en: ['Epic Punta Cana', 'apartment for sale Bávaro', 'real estate investment Punta Cana', 'Airbnb Punta Cana', '1 bedroom apartment Bávaro'],
      fr: ['Epic Punta Cana', 'appartement à vendre Bávaro', 'investissement immobilier Punta Cana', 'Airbnb Punta Cana', 'appartement 1 chambre Bávaro']
    }
  }
};

const imagesPath = '/Users/puntacanainvestments/.gemini/antigravity-ide/brain/c28be8be-24af-4de1-9d28-7a7371d05056';
const files = [
  { name: 'media__1782648845467.jpg', alt: 'Piscina principal del proyecto Epic Punta Cana con hermosos jardines y flores rojas en primer plano.' },
  { name: 'media__1782648908246.jpg', alt: 'Vista aérea de la gran piscina rectangular estilo resort en Epic Punta Cana, rodeada de edificios modernos.' },
  { name: 'media__1782648940746.png', alt: 'Acogedoras cabañas y camas balinesas junto a la amplia piscina en el residencial Epic Punta Cana.' },
  { name: 'media__1782648976021.png', alt: 'Vista nocturna de la espectacular piscina iluminada de azul en Epic Punta Cana.' },
  { name: 'media__1782649032188.jpg', alt: 'Detalle de los escalones de acceso y aguas cristalinas de la piscina en Epic Residences.' }
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
