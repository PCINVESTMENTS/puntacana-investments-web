const fs = require('fs');
let content = fs.readFileSync('src/data/properties.ts', 'utf8');

const newProperty = `
    {
        id: 522952,
        slug: "gran-villa-canoa-6-habitaciones-los-lagos-punta-cana",
        title: "Gran Villa Canoa | Mansión de 6 Habitaciones en Los Lagos, Punta Cana",
        titleEn: "Gran Villa Canoa | 6-Bedroom Mansion in Los Lagos, Punta Cana",
        titleFr: "Gran Villa Canoa | Manoir de 6 Chambres à Los Lagos, Punta Cana",
        location: "Sector Los Lagos (Laguna Honda), Puntacana Resort & Club, La Altagracia, Rep. Dom.",
        price: 0,
        currency: "USD",
        status: "for-sale",
        type: "villa",
        bedrooms: 6,
        bathrooms: 8,
        area: 0,
        lotSize: 0,
        yearBuilt: 2024,
        image: "/images/properties/gran-villa-canoa/1.jpg",
        gallery: [
            "/images/properties/gran-villa-canoa/1.jpg",
            "/images/properties/gran-villa-canoa/2.jpg",
            "/images/properties/gran-villa-canoa/3.jpg",
            "/images/properties/gran-villa-canoa/4.jpg",
            "/images/properties/gran-villa-canoa/5.jpg"
        ],
        features: {
            en: ["Lake View", "Infinity Pool", "Sunken Seating", "Double Height Ceilings", "Cold & Hot Kitchens", "Guest Room on 1st Floor", "Home Office / Gym", "Private Spa Bathrooms", "Maid's Quarters", "Access to 45 Holes of Golf", "Private Beach Access", "Gazebo with BBQ", "Covered Garage for 2 Vehicles", "Open Parking for 6 Vehicles"],
            es: ["Vista al Lago", "Piscina Infinity", "Estar Hundido", "Techos Doble Altura", "Cocina Fría y Caliente", "Habitación de Huéspedes en 1er Nivel", "Oficina / Gimnasio", "Baños de Lujo Privados", "Cuartos de Servicio", "Acceso a 45 Hoyos de Golf", "Acceso a Playa Privada", "Gazebo con BBQ", "Garaje Cerrado para 2 Vehículos", "Parqueo Abierto para 6 Vehículos"],
            fr: ["Vue sur le Lac", "Piscine à Débordement", "Salon Encaissé", "Plafonds à Double Hauteur", "Cuisines Froide et Chaude", "Chambre d'Amis au 1er Niveau", "Bureau / Salle de Sport", "Salles de Bain Spa Privées", "Chambres de Service", "Accès à 45 Trous de Golf", "Accès à la Plage Privée", "Gazebo avec Barbecue", "Garage Fermé pour 2 Véhicules", "Parking Ouvert pour 6 Véhicules"]
        },
        amenities: {
            en: ["Recreational Lake", "5 Miles of White Sand Beaches", "13 Freshwater Springs", "Championship Golf", "World-Class Restaurants", "Marina", "Equestrian Center", "Gated Community", "24/7 Security"],
            es: ["Lago Recreacional", "5 Millas de Playas de Arena Blanca", "13 Manantiales de Agua Dulce", "Golf de Campeonato", "Restaurantes de Clase Mundial", "Marina", "Centro Ecuestre", "Comunidad Cerrada", "Seguridad 24/7"],
            fr: ["Lac Récréatif", "5 Miles de Plages de Sable Blanc", "13 Sources d'Eau Douce", "Golf de Championnat", "Restaurants de Classe Mondiale", "Marina", "Centre Équestre", "Communauté Fermée", "Sécurité 24/7"]
        },
        description: {
            es: \`
Esta imponente villa compuesta se encuentra ubicada en una esquina estratégica del nuevo y exclusivo sector de Los Lagos en Punta Cana; específicamente en Laguna Honda. La propiedad se destaca por su diseño arquitectónico elegante y único, estructurado para aprovechar la forma del terreno y ofrecer vistas al lago en todo momento, tanto en las áreas sociales como en las habitaciones. Con 6 habitaciones panorámicas, acabados de ultra lujo y un diseño dividido magistralmente en tres secciones (Descanso, Social y de Servicio), esta residencia ofrece un estilo de vida sofisticado y lleno de comodidades.

### Arquitectura Imponente y Espacios Sociales

- **Recibidor de Gran Impacto:** La entrada cuenta con un vestíbulo de doble altura, una impresionante escalera con ventilación natural y decoración en aluminio perforado que conecta con el aire y la naturaleza.
- **Sala y Comedor Majestuosos:** Un área social luminosa con grandes ventanales y un comedor formal que deslumbran con una impresionante doble altura inclinada superior a 5 metros.
- **Estudio Hundido:** Un espacio privado y hundido en el interior de la casa que promete una experiencia única de confort.
- **Diseño de Tres Secciones:** Las áreas están divididas estratégicamente en zonas de Descanso, Social y de Servicio para garantizar la máxima privacidad y un flujo perfecto.

### Cocinas y Área de Servicio de Alto Nivel

- **Cocina Fría:** Equipada con una moderna isla, despensa independiente y un skylight (tragaluz) que permite la entrada de luz natural.
- **Cocina Caliente:** Totalmente funcional y separada para la preparación de alimentos fuertes.
- **Zona de Servicio Completa:** Incluye una amplia área de lavado y secado, un gran estar para empleados y dos cuartos de servicio con un baño completo.

### Santuario de Descanso (6 Habitaciones)

- **Habitaciones Principales (2):** La villa cuenta con una master suite en cada nivel, ambas con amplios clósets y baños de lujo. El baño principal del primer nivel incluye un jardín privado, mientras que el del segundo nivel ofrece vistas directas al lago.
- **Habitaciones Secundarias (4):** Todas con vistas al lago, baño propio y walk-in closet. Las del primer nivel conectan con una amplia terraza y el patio, mientras que las del segundo nivel cuentan con un balcón minimalista tipo Julieta con vistas panorámicas.
- **Oficina Privada / Gimnasio:** Una amplia oficina en el segundo nivel con vista panorámica al lago, la cual también puede ser utilizada como gimnasio.

### Exteriores y Amenidades al Aire Libre

- **Piscina Efecto Infinity:** Una gran piscina privada diseñada con la forma de la casa para crear un espectacular efecto infinity desde cualquier ángulo.
- **Terrazas y Lounges:** Amplias terrazas en el primer nivel y un elegante "estar hundido" en el área exterior, ideal para compartir socialmente.
- **Gazebo y Deck:** Rodeado de un exuberante jardín y un deck de madera, el exterior incluye un gazebo con área de BBQ y espacio de entretenimiento con TV.
- **Comodidades Exteriores:** Cuenta con un baño completo para el área de la piscina, un amplio cuarto de máquinas y almacén para jardinería.

### Capacidad de Estacionamiento Inigualable

- **Driveway:** para fácil acceso de entrada y salida.
- **Garaje privado cerrado:** para 2 vehículos con lockers de almacenamiento.
- **Marquesina abierta:** para 3 vehículos.
- **Marquesina semitechada:** con conexión al área social y de servicio para 3 vehículos.

### Conectividad, Comunidad Lagos y Amenidades del Resort

Los residentes tienen acceso exclusivo a un club de golf y playa, además de la cercanía a tiendas, restaurantes y centros comerciales de Punta Cana, ofreciendo un estilo de vida sofisticado. Al estar dentro de [Puntacana Resort & Club](https://www.puntacana.com/), usted disfrutará de:

- Conectividad inigualable: A tan solo minutos del [Aeropuerto Internacional de Punta Cana](https://www.puntacanainternationalairport.com/), el aeropuerto más concurrido de República Dominicana y el segundo más concurrido del Caribe.
- Lago recreacional para equipos no motorizados.
- 5 millas de espectaculares playas de arena blanca y costa.
- 13 impresionantes manantiales de agua dulce.
- 45 hoyos de [golf de campeonato](https://www.puntacana.com/golf).
- 8 restaurantes de clase mundial.\`,
            en: \`
This imposing compound villa is located in a strategic corner of the new and exclusive Los Lagos sector in Punta Cana; specifically in Laguna Honda. The property stands out for its elegant and unique architectural design, structured to take advantage of the shape of the land and offer lake views at all times, both in the social areas and in the bedrooms. With 6 panoramic bedrooms, ultra-luxury finishes, and a design masterfully divided into three sections (Rest, Social, and Service), this residence offers a sophisticated lifestyle full of amenities.

### Imposing Architecture and Social Spaces

- **High-Impact Foyer:** The entrance features a double-height lobby, an impressive staircase with natural ventilation, and perforated aluminum decor that connects with the air and nature.
- **Majestic Living and Dining Room:** A bright social area with large windows and a formal dining room that dazzle with an impressive slanted double height of over 5 meters.
- **Sunken Studio:** A private and sunken space inside the house that promises a unique experience of comfort.
- **Three-Section Design:** The areas are strategically divided into Rest, Social, and Service zones to ensure maximum privacy and perfect flow.

### High-End Kitchens and Service Area

- **Cold Kitchen:** Equipped with a modern island, independent pantry, and a skylight that allows natural light to enter.
- **Hot Kitchen:** Fully functional and separate for the preparation of heavy meals.
- **Complete Service Zone:** Includes a large laundry and drying area, a large living room for employees, and two maid's quarters with a full bathroom.

### Sanctuary of Rest (6 Bedrooms)

- **Master Bedrooms (2):** The villa has a master suite on each level, both with large closets and luxury bathrooms. The first-level master bathroom includes a private garden, while the second-level one offers direct lake views.
- **Secondary Bedrooms (4):** All with lake views, private bathroom, and walk-in closet. Those on the first level connect to a large terrace and the backyard, while those on the second level have a minimalist Juliet balcony with panoramic views.
- **Private Office / Gym:** A large office on the second level with a panoramic view of the lake, which can also be used as a gym.

### Outdoors and Open-Air Amenities

- **Infinity Effect Pool:** A large private pool designed with the shape of the house to create a spectacular infinity effect from any angle.
- **Terraces and Lounges:** Large terraces on the first level and an elegant "sunken lounge" in the outdoor area, ideal for socializing.
- **Gazebo and Deck:** Surrounded by lush gardens and a wooden deck, the exterior includes a gazebo with a BBQ area and entertainment space with a TV.
- **Outdoor Amenities:** Features a full bathroom for the pool area, a large machine room, and a gardening storage room.

### Unmatched Parking Capacity

- **Driveway:** for easy access in and out.
- **Closed private garage:** for 2 vehicles with storage lockers.
- **Open carport:** for 3 vehicles.
- **Semi-covered carport:** connecting to the social and service area for 3 vehicles.

### Connectivity, Lagos Community, and Resort Amenities

Residents have exclusive access to a golf and beach club, in addition to being close to shops, restaurants, and shopping centers in Punta Cana, offering a sophisticated lifestyle. Being inside [Puntacana Resort & Club](https://www.puntacana.com/), you will enjoy:

- Unmatched connectivity: Just minutes from [Punta Cana International Airport](https://www.puntacanainternationalairport.com/), the busiest airport in the Dominican Republic and the second busiest in the Caribbean.
- Recreational lake for non-motorized equipment.
- 5 miles of spectacular white sand beaches and coastline.
- 13 impressive freshwater springs.
- 45 holes of [championship golf](https://www.puntacana.com/golf).
- 8 world-class restaurants.\`,
            fr: \`
Cette imposante villa composée est située dans un coin stratégique du nouveau et exclusif secteur de Los Lagos à Punta Cana ; plus précisément à Laguna Honda. La propriété se distingue par son design architectural élégant et unique, structuré pour tirer parti de la forme du terrain et offrir une vue sur le lac à tout moment, tant dans les espaces sociaux que dans les chambres. Avec 6 chambres panoramiques, des finitions ultra-luxueuses et un design magistralement divisé en trois sections (Repos, Social et Service), cette résidence offre un style de vie sophistiqué et plein de commodités.

### Architecture Imposante et Espaces Sociaux

- **Foyer à Fort Impact:** L'entrée dispose d'un hall à double hauteur, d'un escalier impressionnant avec ventilation naturelle et d'un décor en aluminium perforé qui se connecte avec l'air et la nature.
- **Salon et Salle à Manger Majestueux:** Un espace social lumineux avec de grandes fenêtres et une salle à manger formelle qui éblouissent avec une hauteur double inclinée impressionnante de plus de 5 mètres.
- **Studio Encaissé:** Un espace privé et encaissé à l'intérieur de la maison qui promet une expérience de confort unique.
- **Design en Trois Sections:** Les zones sont stratégiquement divisées en zones de Repos, Social et Service pour garantir une intimité maximale et une circulation parfaite.

### Cuisines Haut de Gamme et Zone de Service

- **Cuisine Froide:** Équipée d'un îlot moderne, d'un garde-manger indépendant et d'un puits de lumière qui laisse entrer la lumière naturelle.
- **Cuisine Chaude:** Entièrement fonctionnelle et séparée pour la préparation des repas lourds.
- **Zone de Service Complète:** Comprend une grande zone de lavage et de séchage, un grand salon pour les employés et deux chambres de bonne avec une salle de bain complète.

### Sanctuaire de Repos (6 Chambres)

- **Chambres Principales (2):** La villa dispose d'une suite parentale à chaque niveau, toutes deux avec de grands placards et des salles de bains de luxe. La salle de bain principale du premier niveau comprend un jardin privé, tandis que celle du deuxième niveau offre une vue directe sur le lac.
- **Chambres Secondaires (4):** Toutes avec vue sur le lac, salle de bain privée et dressing. Celles du premier niveau s'ouvrent sur une grande terrasse et la cour, tandis que celles du deuxième niveau disposent d'un balcon Juliette minimaliste avec vue panoramique.
- **Bureau Privé / Salle de Sport:** Un grand bureau au deuxième niveau avec vue panoramique sur le lac, qui peut également être utilisé comme salle de sport.

### Extérieurs et Commodités en Plein Air

- **Piscine à Effet Débordement:** Une grande piscine privée conçue avec la forme de la maison pour créer un effet à débordement spectaculaire sous tous les angles.
- **Terrasses et Lounges:** De grandes terrasses au premier niveau et un élégant "salon encaissé" dans l'espace extérieur, idéal pour socialiser.
- **Gazebo et Terrasse:** Entouré de jardins luxuriants et d'une terrasse en bois, l'extérieur comprend un gazebo avec un espace barbecue et un espace de divertissement avec télévision.
- **Commodités Extérieures:** Dispose d'une salle de bain complète pour l'espace piscine, d'un grand local technique et d'un débarras pour le jardinage.

### Capacité de Stationnement Inégalée

- **Allée (Driveway):** pour un accès facile à l'entrée et à la sortie.
- **Garage privé fermé:** pour 2 véhicules avec casiers de rangement.
- **Abri d'auto ouvert:** pour 3 véhicules.
- **Abri d'auto semi-couvert:** relié à la zone sociale et de service pour 3 véhicules.

### Connectivité, Communauté Lagos et Commodités du Complexe

Les résidents ont un accès exclusif à un club de golf et de plage, en plus d'être proches des magasins, des restaurants et des centres commerciaux de Punta Cana, offrant un style de vie sophistiqué. En étant au sein du [Puntacana Resort & Club](https://www.puntacana.com/), vous profiterez de :

- Connectivité inégalée : À quelques minutes seulement de [l'Aéroport International de Punta Cana](https://www.puntacanainternationalairport.com/), l'aéroport le plus fréquenté de la République Dominicaine et le deuxième des Caraïbes.
- Lac récréatif pour équipements non motorisés.
- 5 miles de plages de sable blanc spectaculaires et de côtes.
- 13 sources d'eau douce impressionnantes.
- 45 trous de [golf de championnat](https://www.puntacana.com/golf).
- 8 restaurants de classe mondiale.\`
        },
        seo: {
            title: "Gran Villa Canoa | Mansión 6 Habs en Los Lagos, Punta Cana",
            description: "Descubra la Gran Villa Canoa en Los Lagos. Imponente mansión de 6 habitaciones, diseño único, piscina infinity, vistas al lago y acceso a playa y golf.",
            keywords: "Gran Villa Canoa Punta Cana, Los Lagos Puntacana Resort, Laguna Honda, mansión 6 habitaciones Punta Cana, casas de lujo con vista al lago, Punta Cana Investments, bienes raíces ultra lujo Caribe",
            en: {
                title: "Gran Villa Canoa | 6-Bed Mansion in Los Lagos, Punta Cana",
                description: "Discover Gran Villa Canoa in Los Lagos. Imposing 6-bedroom mansion, unique design, infinity pool, lake views, and beach & golf access.",
                keywords: "Gran Villa Canoa Punta Cana, Los Lagos Puntacana Resort, Laguna Honda, 6-bedroom mansion Punta Cana, luxury lake view homes, Punta Cana Investments, Caribbean ultra-luxury real estate"
            },
            fr: {
                title: "Gran Villa Canoa | Manoir 6 Chambres à Los Lagos, Punta Cana",
                description: "Découvrez Gran Villa Canoa à Los Lagos. Imposant manoir de 6 chambres, design unique, piscine à débordement, vue sur le lac, accès à la plage et au golf.",
                keywords: "Gran Villa Canoa Punta Cana, Los Lagos Puntacana Resort, Laguna Honda, manoir 6 chambres Punta Cana, maisons de luxe avec vue sur le lac, Punta Cana Investments, immobilier ultra-luxe Caraïbes"
            }
        }
    },
`;

const insertIndex = content.indexOf('export const properties: Property[] = [') + 'export const properties: Property[] = ['.length;
content = content.slice(0, insertIndex) + newProperty + content.slice(insertIndex);

fs.writeFileSync('src/data/properties.ts', content, 'utf8');
console.log('Property inserted successfully!');
