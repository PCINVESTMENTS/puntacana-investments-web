export interface Property {
    id: number;
    title: string;
    location: string;
    locationLabel: string;
    type: string;
    status: 'sale' | 'rent';
    price: number;
    image: string;
    beds: number;
    baths: number;
    area: number;
    features: {
        en: string[];
        es: string[];
    };
    specs?: {
        en: string[];
        es: string[];
    };
    detailedSections?: {
        title: { en: string; es: string };
        content: { en: string; es: string };
    }[];
    description: {
        en: string;
        es: string;
    };
    gallery?: string[];
    videoUrl?: string;
    virtualTourUrl?: string;
    featured?: boolean;
    coordinates?: {
        lat: number;
        lng: number;
    };
    constructionStages?: {
        date: string;
        title: { es: string; en: string };
        description: { es: string; en: string };
        status: "completed" | "in-progress" | "pending";
    }[];
    completionPercent?: number;
    seo?: {
        title: { en: string; es: string };
        description: { en: string; es: string };
        keywords: { en: string[]; es: string[] };
    };
}

export const properties: Property[] = [
    {
        id: 1,
        title: "The Beach – Punta Cana",
        location: "puntacana",
        locationLabel: "Punta Cana City Place",
        type: "condo",
        status: "sale",
        price: 170000,
        image: "/images/the-beach-punta-cana-crystal-lagoon.jpg",
        beds: 1,
        baths: 1,
        area: 65,
        features: {
            en: ["Crystal Lagoon (Private Beach)", "CONFOTUR Tax Exemption (15 Years)", "5 Resort Pools", "Airbnb Friendly", "Sports Zone (Tennis, Padel, Soccer)", "Gym & Spa", "24/7 Security", "Shuttle to Beach/Malls"],
            es: ["Crystal Lagoon (Playa Privada)", "Exención Fiscal CONFOTUR (15 años)", "5 Piscinas Resort", "Airbnb Amigable", "Zona Deportiva (Tenis, Pádel, Fútbol)", "Gimnasio y Spa", "Seguridad 24/7", "Transporte a Playa/Malls"]
        },
        description: {
            en: `The Beach – Vida Resort with Crystal Lagoon in Punta Cana City Place
## Welcome to The Beach
A unique residential project located in Punta Cana City Place, where comfort, sustainability, and a resort-style lifestyle come together to create one of the best real estate investment opportunities in Punta Cana.

The Beach is the only residential complex in the area with a private Crystal Lagoon, a world-class artificial beach that transforms the experience of living and investing in the Caribbean.

## A Unique Residential Concept in the Caribbean
The Beach has been conceived to offer a comfortable, modern, and sustainable living experience, combining nature, contemporary design, and high-level amenities.

Its main differentiator is the Crystal Lagoon, an artificial beach with crystal-clear waters and white sands, already in operation and visible even on Google Maps, allowing you to enjoy a beach-like experience every day right in front of your residence.

## Strategic Location – Downtown Punta Cana
Located in the heart of Downtown Punta Cana, The Beach offers exceptional connectivity:
- 7 minutes from Punta Cana International Airport
- 3 minutes from shops, restaurants, and entertainment centers
- 1 minute from Coco Bongo and main nightlife attractions

This location makes the project a highly demanded option for Airbnb-style vacation rentals as well as for permanent residence.

## Tax Benefits – CONFOTUR
The Beach benefits from the CONFOTUR Law, representing a significant benefit for investors:
- Up to 15 years of tax exemption
- No transfer tax payment
- Higher long-term net profitability

## Sustainability and Responsible Design
The Beach has been developed under an environmental sustainability approach, incorporating advanced ecological technology:
- Crystal Lagoon with minimal chemical use
- Closed-circuit operation
- Rainwater harvesting
- Extensive green areas promoting biodiversity

This approach not only reduces maintenance costs but also increases the project's appeal to environmentally conscious residents and guests.

## Resort-Style Amenities
The Beach offers a set of amenities that elevate the residential experience and maximize vacation rental demand:
- Private Crystal Lagoon (the first and largest in the Caribbean)
- Complex of 5 pools
- Resort-style social area with bars, restaurants, and spa
- Beachfront snack bar
- 5 sand oases with direct access to the lagoon
- Children's play area
- Sports zone, including:
    - Sand volleyball
    - Tennis
    - Padel
    - Soccer
    - Gym
- Controlled access and 24/7 security
- Rental management program (optional)

## Residential Typologies
The Beach offers different apartment options, adapted to different buyer and investor profiles:

**Arena – From USD $170,000**
Buildings with spacious and illuminated spaces, pool views, and functional design, ideal for couples, small families, and investors.

**Sole – From USD $161,200**
Modern elegance units, designed for vacation use or permanent residence, with privileged views and a high level of comfort.

## Included Equipment
All apartments include full appliances, facilitating immediate rental:
- Stove
- Fridge
- Heater
- Kitchen extractor
- Washer and dryer
- Air conditioning

## Ideal for Living or Investing
The Beach is ideal for:
- **Families:** Safe environment, children's areas, water and recreational activities, green spaces.
- **Investors:** High rental demand, unique amenity (Crystal Lagoon), CONFOTUR tax benefits, strategic location in constant growth.
- **Retirees:** Relaxed lifestyle, resort amenities, quick access to services and entertainment, quiet and safe environment.

**Maintenance:**
- Maintenance fee: USD $3 per m²
- Includes: Crystal Lagoon, Pools, Green areas, Security, and Common areas.

## Conclusion
Choosing The Beach in Punta Cana City Place is choosing a resort-style lifestyle, a safe investment, and a property in one of the Caribbean's most innovative projects.`,
            es: `The Beach – Vida Resort con Crystal Lagoon en Punta Cana City Place
## Bienvenido a The Beach
Un proyecto residencial único ubicado en Punta Cana City Place, donde el confort, la sostenibilidad y el estilo de vida tipo resort se unen para crear una de las mejores oportunidades de inversión inmobiliaria en Punta Cana.

The Beach es el único complejo residencial de la zona con una Crystal Lagoon privada, una playa artificial de clase mundial que transforma la experiencia de vivir e invertir en el Caribe.

## Un concepto residencial único en el Caribe
The Beach ha sido concebido para ofrecer una experiencia de vida cómoda, moderna y sostenible, combinando naturaleza, diseño contemporáneo y amenidades de alto nivel.

Su principal diferencial es la Crystal Lagoon, una playa artificial de aguas cristalinas y arenas blancas, ya en funcionamiento, visible incluso en Google Maps, que permite disfrutar todos los días de una experiencia tipo playa justo frente a tu residencia.

## Ubicación estratégica – Downtown Punta Cana
Ubicado en el corazón de Downtown Punta Cana, The Beach ofrece una conectividad excepcional:
- 7 minutos del Aeropuerto Internacional de Punta Cana
- 3 minutos de tiendas, restaurantes y centros de entretenimiento
- 1 minuto de Coco Bongo y principales atracciones nocturnas

Esta ubicación convierte al proyecto en una opción altamente demandada para renta vacacional tipo Airbnb, así como para residencia permanente.

## Beneficios fiscales – CONFOTUR
The Beach está acogido a la Ley CONFOTUR, lo que representa un importante beneficio para inversionistas:
- Hasta 15 años de exención de impuestos
- No pago de impuesto de transferencia
- Mayor rentabilidad neta a largo plazo

## Sostenibilidad y diseño responsable
The Beach ha sido desarrollado bajo un enfoque de sostenibilidad ambiental, incorporando tecnología ecológica avanzada:
- Crystal Lagoon con uso mínimo de químicos
- Operación en circuitos cerrados
- Recolección de agua de lluvia
- Amplias áreas verdes que fomentan la biodiversidad

Este enfoque no solo reduce costos de mantenimiento, sino que incrementa el atractivo del proyecto para residentes y huéspedes conscientes del medio ambiente.

## Amenidades tipo resort
The Beach ofrece un conjunto de amenidades que elevan la experiencia residencial y maximizan la demanda en renta vacacional:
- Crystal Lagoon privada (la primera y más grande del Caribe)
- Complejo de 5 piscinas
- Área social estilo resort con bares, restaurantes y spa
- Snack bar frente a la playa
- 5 oasis de arena con acceso directo a la laguna
- Zona de juegos infantiles
- Zona deportiva, que incluye:
    - Voleibol de arena
    - Tenis
    - Pádel
    - Fútbol
    - Gimnasio
- Acceso controlado y seguridad 24/7
- Programa de gestión de alquileres (opcional)

## Tipologías residenciales
The Beach ofrece diferentes opciones de apartamentos, adaptadas a distintos perfiles de compradores e inversionistas:

**Arena – Desde USD $170,000**
Edificios con espacios amplios e iluminados, vistas a piscinas y diseño funcional, ideales para parejas, familias pequeñas e inversionistas.

**Sole – Desde USD $161,200**
Unidades de elegancia moderna, diseñadas para uso vacacional o residencia permanente, con vistas privilegiadas y alto nivel de confort.

## Equipamiento incluido
Todos los apartamentos incluyen línea blanca completa, lo que facilita la renta inmediata:
- Estufa
- Nevera
- Calentador
- Extractor de cocina
- Lavadora y secadora
- Aire acondicionado

## Ideal para vivir o invertir
The Beach es ideal para:
- **Familias:** Entorno seguro, áreas infantiles, actividades acuáticas y recreativas, espacios verdes.
- **Inversionistas:** Alta demanda de alquiler, amenidad única (Crystal Lagoon), beneficios fiscales CONFOTUR, ubicación estratégica en crecimiento.
- **Jubilados:** Estilo de vida relajado, comodidades tipo resort, acceso rápido a servicios y entretenimiento, ambiente tranquilo y seguro.

**Mantenimiento:**
- Cuota de mantenimiento: USD $3 por m²
- Incluye: Crystal Lagoon, Piscinas, Áreas verdes, Seguridad y áreas comunes.

## Conclusión
Elegir The Beach en Punta Cana City Place es elegir un estilo de vida tipo resort, una inversión segura y una propiedad en uno de los proyectos más innovadores del Caribe.`
        },
        gallery: [
            "/images/the-beach-punta-cana-crystal-lagoon.jpg",
            "/images/the-beach-resort-pool-view-punta-cana.jpg",
            "/images/the-beach-artificial-beach-lagoon-punta-cana.jpg",
            "/images/the-beach-long-pool-amenities-punta-cana.jpg",
            "/images/the-beach-wellness-yoga-deck-punta-cana.jpg",
            "/images/the-beach-master-plan-layout-punta-cana.jpg",
            "/images/the-beach-rooftop-jacuzzi-terrace-punta-cana.jpg",
            "/images/the-beach-penthouse-terrace-dining-punta-cana.jpg",
            "/images/the-beach-building-exterior-gardens-punta-cana.jpg",
            "/images/the-beach-aerial-view-complex-punta-cana.jpg",
            "/images/the-beach-aerial-view-pools-amenities-punta-cana.jpg",
            "/images/the-beach-evening-pool-view-punta-cana.jpg",
            "/images/the-beach-building-facade-large-pool-punta-cana.jpg",
            "/images/the-beach-lagoon-beach-lounge-area-punta-cana.jpg",
            "/images/the-beach-outdoor-lounge-pergola-punta-cana.jpg",
            "/images/the-beach-balcony-view-pool-punta-cana.jpg",
            "/images/the-beach-interior-living-room-design-punta-cana.jpg",
            "/images/the-beach-bedroom-suite-terrace-view-punta-cana.jpg",
            "/images/the-beach-ground-floor-terrace-jacuzzi-punta-cana.jpg",
            "/images/the-beach-dining-area-kitchen-punta-cana.jpg",
            "/images/the-beach-kitchen-island-view-punta-cana.jpg",
            "/images/the-beach-modern-living-room-interior-punta-cana.jpg"
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        virtualTourUrl: "https://my.matterport.com/show/?m=aRGoTozjtCa",
        featured: true,
        coordinates: { lat: 18.6658, lng: -68.4112 },
        completionPercent: 45,
        constructionStages: [
            {
                date: "Jan 2024",
                title: { es: "Lanzamiento y Diseño", en: "Launch & Design" },
                description: { es: "Diseño arquitectónico urbano y master plan finalizado.", en: "Urban architectural design and master plan finalized." },
                status: "completed"
            },
            {
                date: "Apr 2024",
                title: { es: "Movimiento de Tierra", en: "Earth Movement" },
                description: { es: "Limpieza del terreno y preparación para cimentación.", en: "Site clearing and foundation preparation." },
                status: "completed"
            },
            {
                date: "Oct 2024",
                title: { es: "Estructura de Edificios", en: "Building Structure" },
                description: { es: "Inicio de construcción del esqueleto de los primeros 5 bloques.", en: "Start of skeleton construction for the first 5 blocks." },
                status: "in-progress"
            },
            {
                date: "Jun 2025",
                title: { es: "Fase de Acabados", en: "Finishes Phase" },
                description: { es: "Instalación de interiores y áreas sociales en rooftop.", en: "Interior installation and rooftop social areas." },
                status: "pending"
            }
        ]
    },
    {
        id: 2,
        title: "City Place – Downtown Punta Cana",
        location: "puntacana",
        locationLabel: "Downtown Punta Cana",
        type: "condo",
        status: "sale",
        price: 115500,
        image: "/images/city-place-downtown-punta-cana.jpg",
        beds: 1,
        baths: 1,
        area: 50,
        features: {
            en: ["Rooftop Pool", "Social Area", "Lobby", "Covered Parking", "Underground Parking", "Elevator", "24/7 Security", "CONFOTUR Tax Exemption", "Airbnb Friendly"],
            es: ["Piscina en Rooftop", "Área Social", "Lobby", "Estacionamiento Techado", "Estacionamiento Soterrado", "Ascensor", "Seguridad 24/7", "Exención Fiscal CONFOTUR", "Airbnb Amigable"]
        },
        description: {
            en: `City Place – Apartments for Sale in the Heart of Punta Cana
## Welcome to City Place
A modern residential development located in Punta Cana City Place, designed to offer a perfect combination of tropical exclusivity and urban sophistication, in one of the areas with the highest real estate growth and demand in Punta Cana.

City Place represents a solid real estate investment opportunity, ideal for both residence and Airbnb-style vacation rentals, thanks to its strategic location, contemporary design, and tax benefits.

## Strategic Location
City Place is located in the very heart of Punta Cana, with immediate access to main points of interest:
- 1 minute from Downtown Punta Cana
- 10 minutes from Punta Cana beaches
- 12 minutes from Punta Cana International Airport

This connectivity makes City Place a highly attractive project for the short and long-term rental market.

## Apartments for Sale
City Place offers modern and functional apartments, designed to adapt to different buyer and investor profiles. Dimensions may vary depending on unit location.

**Available Typologies:**
- Studios approx. 50 m² (1 Bedroom, 1 Bath) – From USD $115,500
- 1-Bedroom Apartments from 70 m²
- 2-Bedroom Apartments from 100 m²

These typologies allow excellent flexibility for both personal use and vacation rentals, with high demand on platforms like Airbnb.

## Design and Equipment
City Place apartments stand out for their contemporary design, well-distributed spaces, and finishes thought out for modern urban life.

**Includes Appliances:**
- Range hood
- Sink with faucet
- Water heater
- Oven
- Cooktop
- Air conditioners in bedrooms

This equipment facilitates delivery ready to inhabit or rent, optimizing investment return time.

## Exclusive Amenities for Residents
City Place residents enjoy amenities designed to elevate the residential experience and increase the project's appeal for vacation rentals:
- Rooftop Pool
- Social Area on Rooftop
- Lobby
- Covered Parking
- Underground Parking with direct elevator access
- Maintenance and Security Staff

## Tax Benefits – CONFOTUR
City Place is covered under Law 158-01 (CONFOTUR), representing a key advantage for investors:
- Transfer Tax Exemption
- Property Tax (IPI) Exemption for up to 15 years

These benefits significantly increase the net profitability of the investment.

## Ideal for those seeking
- Modern apartments in the center of Punta Cana
- Airbnb-friendly project
- CONFOTUR tax benefits
- High rental demand
- Immediate connectivity to beaches, airport, and entertainment
- Solid and scalable real estate investment

## Payment Plan
City Place offers a structured and accessible payment plan:
- Reservation: USD $3,000
- Inicial: 20 %
- Durante la construcción: 40 %
- Contra entrega: 40 %`,
            es: `City Place – Apartamentos en Venta en el Corazón de Punta Cana
## Bienvenido a City Place
Un desarrollo residencial moderno ubicado en Punta Cana City Place, concebido para ofrecer una combinación perfecta entre exclusividad tropical y sofisticación urbana, en una de las zonas con mayor crecimiento y demanda inmobiliaria de Punta Cana.

City Place representa una oportunidad sólida de inversión inmobiliaria, ideal tanto para residencia como para renta vacacional tipo Airbnb, gracias a su ubicación estratégica, diseño contemporáneo y beneficios fiscales.

## Ubicación estratégica
City Place se encuentra en el propio corazón de Punta Cana, con acceso inmediato a los principales puntos de interés:
- 1 minuto de Downtown Punta Cana
- 10 minutos de las playas de Punta Cana
- 12 minutos del Aeropuerto Internacional de Punta Cana

Esta conectividad convierte a City Place en un proyecto altamente atractivo para el mercado de alquiler a corto y largo plazo.

## Apartamentos en venta
City Place ofrece apartamentos modernos y funcionales, diseñados para adaptarse a distintos perfiles de compradores e inversionistas. Las dimensiones pueden variar según la ubicación de la unidad.

**Tipologías disponibles:**
- Estudios aprox. 50 m² (1 Habitación, 1 Baño) – Desde USD $115,500
- Apartamentos de 1 habitación desde 70 m²
- Apartamentos de 2 habitaciones desde 100 m²

Estas tipologías permiten una excelente flexibilidad tanto para uso personal como para renta vacacional, con alta demanda en plataformas como Airbnb.

## Diseño y equipamiento
Los apartamentos de City Place destacan por su diseño contemporáneo, espacios bien distribuidos y acabados pensados para la vida urbana moderna.

**Incluyen línea blanca:**
- Campana extractora
- Fregadero con grifería
- Calentador de agua
- Horno
- Placa de cocina
- Aires acondicionados en las habitaciones

Este equipamiento facilita la entrega lista para habitar o rentar, optimizando el tiempo de retorno de inversión.

## Amenidades exclusivas para residentes
Los residentes de City Place disfrutan de amenidades diseñadas para elevar la experiencia residencial y aumentar el atractivo del proyecto para renta vacacional:
- Piscina en la terraza (rooftop pool)
- Área social en rooftop
- Lobby
- Estacionamiento techado
- Estacionamiento subterráneo con acceso directo por elevador
- Personal de mantenimiento y seguridad

## Beneficios fiscales – CONFOTUR
City Place está amparado bajo la Ley 158-01 (CONFOTUR), lo que representa una ventaja clave para inversionistas:
- Exoneración del impuesto de transferencia
- Exención del Impuesto a la Propiedad Inmobiliaria (IPI) por hasta 15 años

Estos beneficios incrementan significativamente la rentabilidad neta de la inversión.

## Ideal para quienes buscan
- Apartamentos modernos en el centro de Punta Cana
- Proyecto amigable con Airbnb
- Beneficios fiscales CONFOTUR
- Alta demanda de alquiler
- Conectividad inmediata a playas, aeropuerto y entretenimiento
- Inversión inmobiliaria sólida y escalable

## Plan de pago
City Place ofrece un plan de pago estructurado y accesible:
- Reserva: USD $3,000
- Banco: 20 %
- Durante la construcción: 40 %
- Contra entrega: 40 %`
        },
        gallery: [
            "/images/city-place-downtown-punta-cana.jpg"
        ],
        coordinates: { lat: 18.6650, lng: -68.4100 }, // Approx Downtown
        featured: true
    },
    {
        id: 3,
        title: "Diana Tropical Village",
        location: "bavaro",
        locationLabel: "Brisas de Punta Cana",
        type: "villa",
        status: "sale",
        price: 246000,
        image: "/images/diana-tropical-village-villas-brisas-punta-cana.jpg",
        beds: 3,
        baths: 3,
        area: 224,
        features: {
            en: ["Private Pool Included", "Gated Community", "Customizable Plan", "Individual Title", "Low HOA", "Airbnb Friendly", "24/7 Security", "Picuzzi"],
            es: ["Piscina Privada Incluida", "Residencial Cerrado", "Plan Personalizable", "Título Individual", "Bajo Mantenimiento", "Airbnb Amigable", "Seguridad 24/7", "Picuzzi"]
        },
        description: {
            en: `Diana Tropical Village – Luxury Villas in Punta Cana

Welcome to Diana Tropical Village, an exclusive villa project that redefines comfort, privacy, and real estate investment in one of the areas with the highest growth and projection in Punta Cana.

Located within the private residential community of Brisas de Punta Cana, this development has been conceived for those seeking a modern, functional villa highly attractive for vacation rentals, without sacrificing quality of life or security.

## A project designed for living and renting

Diana Tropical Village offers villas designed to maximize well-being, privacy, and profitability potential, becoming an excellent option for both personal use and Airbnb-friendly investment.

Each villa integrates spacious, well-distributed spaces and outdoor areas ideal for short and long stays, a key factor for the area's high tourist demand.

## Villa Features

- Construction Area: 224.22 m²
- Private Land: from 266 m² to 316.16 m² (client's choice)
- Private pool included in the villa price
- Functional design favoring privacy and comfort

## Location & Benefits

Located in Brisas de Punta Cana, the project offers multiple advantages:
- Controlled access within a private residential area
- High appreciation potential
- Excellent location, just minutes from Downtown Punta Cana and Bavaro beaches
- Ideal environment for living, vacationing, or renting

## Flexibility & Personalization

During the pre-construction stage, the owner has the possibility to customize or modify their villa's plans, allowing spaces to be adapted to personal needs or specific vacation rental strategies.

## Secure Titling

- Individual titles for each villa
- Project with all corresponding licenses and permits

## Flexible Investment Plan

- Reservation: USD $5,000 (non-refundable)
- Initial: 20%
- Installments: 30%, distributed according to the agreed term
- Upon Delivery: 50%, with bank financing option

## Delivery Terms

- Phase I: 12 months after construction start
- Phase IV: 30 months after construction start`,
            es: `Diana Tropical Village – Villas de Lujo en Punta Cana

Bienvenido a Diana Tropical Village, un exclusivo proyecto de villas que redefine el confort, la privacidad y la inversión inmobiliaria en una de las zonas de mayor crecimiento y proyección de Punta Cana.

Ubicado dentro del residencial privado Brisas de Punta Cana, este desarrollo ha sido concebido para quienes buscan una villa moderna, funcional y altamente atractiva para renta vacacional, sin sacrificar calidad de vida ni seguridad.

## Un proyecto pensado para vivir y rentar

Diana Tropical Village ofrece villas diseñadas para maximizar el bienestar, la privacidad y el potencial de rentabilidad, convirtiéndose en una excelente opción tanto para uso personal como para inversión amigable con Airbnb y alquiler vacacional.

Cada villa integra espacios amplios, bien distribuidos y áreas exteriores ideales para estancias cortas y largas, un factor clave para la alta demanda turística de la zona.

## Características de la villa

- Área de construcción: 224.22 m²
- Terreno privado: desde 266 m² hasta 316.16 m², a elección del cliente
- Piscina privada incluida en el precio de la villa
- Diseño funcional que favorece la privacidad y el confort

## Ubicación y beneficios

Ubicado en Brisas de Punta Cana, el proyecto ofrece múltiples ventajas:
- Acceso controlado dentro de un residencial privado
- Alta plusvalía en crecimiento
- Excelente ubicación, a solo minutos de Downtown Punta Cana y de las playas de Bávaro
- Entorno ideal para vivir, vacacionar o rentar

## Flexibilidad y personalización

Durante la etapa de preconstrucción, el propietario tiene la posibilidad de personalizar o modificar los planos de su villa, permitiendo adaptar los espacios a sus necesidades personales o a estrategias específicas de alquiler vacacional.

## Titulación segura

- Títulos individuales para cada villa
- Proyecto con todas las licencias y permisos correspondientes

## Plan de inversión flexible

- Reserva: USD $5,000 (no reembolsable)
- Inicial: 20 %
- Cuotas: 30 %, distribuidas según el plazo acordado
- Contra entrega: 50 %, con opción a financiamiento bancario

## Plazos de entrega

- Fase I: 12 meses después del inicio de obra
- Fase IV: 30 meses después del inicio de obra`
        },
        gallery: [
            "/images/diana-tropical-village-villas-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-living-room-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-dining-room-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-exterior-view-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-facade-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-interior-living-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-pool-bbq-area-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-terrace-view-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-modern-kitchen-brisas-punta-cana.png",
            "/images/diana-tropical-village-dining-space-brisas-punta-cana.png",
            "/images/diana-tropical-village-kitchen-design-brisas-punta-cana.png",
            "/images/diana-tropical-village-kitchen-island-brisas-punta-cana.png",
            "/images/diana-tropical-village-open-concept-living-brisas-punta-cana.png",
            "/images/diana-tropical-village-kitchen-bar-view-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-bedroom-tv-wall-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-master-bedroom-design-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-modern-bathroom-vanity-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-bedroom-wardrobe-art-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-bedroom-balcony-view-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-bedroom-wood-paneling-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-minimalist-bedroom-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-pool-lounge-detail-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-walk-in-closet-brisas-punta-cana.jpg",
            "/images/diana-tropical-village-outdoor-bbq-kitchen-brisas-punta-cana.jpg"
        ],
        featured: true,
        coordinates: { lat: 18.6825, lng: -68.4110 }
    },
    {
        id: 4,
        title: "Proyecto Cruise On Land – Resort Temático de Inversión en Punta Cana",
        location: "puntacana",
        locationLabel: "Punta Cana",
        type: "condohotel",
        status: "sale",
        price: 71717,
        image: "/images/cruises-on-land-main-exterior-punta-cana.jpg",
        beds: 1,
        baths: 1,
        area: 45,
        features: {
            en: ["Theme Park Resort", "100+ Attractions", "1, 2 & 3 Bedrooms", "Rental Management Program", "Airbnb Friendly", "CONFOTUR Tax Exemptions", "15,000m² Artificial Beach", "Wave Pool", "Sports Complex", "Theme Restaurants", "24/7 Security", "Strategic Location"],
            es: ["Resort con Parque Temático", "Más de 100 Atracciones", "1, 2 y 3 Habitaciones", "Programa de Gestión de Rentas", "Airbnb Amigable", "Exención Impuestos CONFOTUR", "Playa Artificial 15,000m²", "Piscina de Olas", "Complejo Deportivo", "Restaurantes Temáticos", "Seguridad 24/7", "Ubicación Estratégica"]
        },
        description: {
            en: `Cruise On Land Project – Thematic Investment Resort in Punta Cana

Welcome aboard, Captain!
Prepare to discover one of the most innovative real estate investment opportunities in the Caribbean, strategically located in Punta Cana.

Cruise On Land is the first resort with an integrated theme park in the Caribbean, a revolutionary concept designed to maximize vacation rental profitability, combining entertainment, strategic location, and unique tax benefits.

## General Data
- **Type:** Thematic Resort
- **Units:** 1, 2, and 3 Bedrooms
- **Attractions:** Over 100 integrated attractions
- **Concept:** Designed for high occupancy and extended stays
- **Management:** Professional rental management program available
- **Benefits:** CONFOTUR (Tax Exemptions)
  - 15 years 1% Property Tax exemption
  - 0% Transfer Tax

## Profitability & Investment Profile
The project design allows for passive income generation in US dollars, reducing seasonality and ensuring a constant flow of guests year-round.

**Key Highlights:**
- High continuous tourist demand
- Highly differentiated product in the market
- Excellent performance in short and medium-term rentals
- Professional management optimizing income
- Ideal for investors seeking constant flow and stability

## Location & Value
Strategically located to ensure high connectivity and demand:
- 15 minutes from Punta Cana International Airport
- 10 minutes from Downtown Punta Cana

## Ideal For
- Vacation rental investors
- Buyers seeking passive income
- Tourism real estate portfolios
- Projects with tax benefits
- High occupancy and turnover assets`,
            es: `Proyecto Cruise On Land – Resort Temático de Inversión en Punta Cana

¡Bienvenido a bordo, Capitán!
Prepárese para descubrir una de las oportunidades de inversión inmobiliaria más innovadoras del Caribe, ubicada estratégicamente en Punta Cana.

Cruise On Land es el primer resort con parque temático integrado del Caribe, un concepto revolucionario diseñado para maximizar la rentabilidad en renta vacacional, combinando entretenimiento, ubicación estratégica y beneficios fiscales únicos.

## Datos Generales
- **Tipo:** Resort Temático
- **Unidades:** 1, 2 y 3 Habitaciones
- **Atracciones:** Más de 100 atracciones integradas
- **Concepto:** Diseñado para alta ocupación y estancias prolongadas
- **Gestión:** Programa profesional de gestión de alquileres
- **Beneficios:** Ley CONFOTUR
  - Hasta 15 años de exención del IPI
  - 0 % de impuesto de transferencia

## Rentabilidad y Perfil de Inversión
El diseño del proyecto está orientado a generar ingresos pasivos en dólares, reduciendo la estacionalidad y asegurando un flujo constante de huéspedes durante todo el año.

**Puntos Clave:**
- Alta demanda turística continua
- Producto altamente diferenciado en el mercado
- Excelente desempeño en renta corta y media
- Gestión profesional que optimiza ingresos
- Ideal para inversionistas que buscan flujo constante y estabilidad

## Ubicación Estratégica
- 15 minutos del Aeropuerto Internacional de Punta Cana
- 10 minutos de Downtown Punta Cana

## Ideal Para
- Inversionistas en renta vacacional
- Compradores que buscan ingresos pasivos
- Portafolios inmobiliarios turísticos
- Proyectos con beneficios fiscales
- Activos de alta ocupación y rotación`
        },
        gallery: [
            "/images/cruises-on-land-main-exterior-punta-cana.jpg",
            "/images/cruises-on-land-resort-complex-overview-punta-cana.jpg",
            "/images/cruises-on-land-water-park-attractions-punta-cana.jpg",
            "/images/cruises-on-land-cruise-ship-building-punta-cana.jpg",
            "/images/cruises-on-land-master-plan-map-punta-cana.png",
            "/images/cruises-on-land-wave-pool-event-stage-punta-cana.jpg",
            "/images/cruises-on-land-adventure-water-park-slides-punta-cana.jpg",
            "/images/cruises-on-land-crystal-lagoon-beach-view-punta-cana.jpg",
            "/images/cruises-on-land-resort-amenities-lounge-punta-cana.jpg",
            "/images/cruises-on-land-ship-building-side-view-punta-cana.jpg",
            "/images/cruises-on-land-water-park-slides-detail-punta-cana.jpg",
            "/images/cruises-on-land-kids-water-park-zone-punta-cana.jpg",
            "/images/cruises-on-land-residences-aerial-view-punta-cana.jpg",
            "/images/cruises-on-land-dining-plaza-lake-view-punta-cana.jpg",
            "/images/cruises-on-land-lighthouse-lake-attraction-punta-cana.jpg",
            "/images/cruises-on-land-villa-floor-plan-with-pool-punta-cana.jpg",
            "/images/cruises-on-land-supermarket-grocery-store-punta-cana.jpg",
            "/images/cruises-on-land-two-bedroom-suite-floor-plan-punta-cana.jpg",
            "/images/cruises-on-land-luxury-living-room-interior-punta-cana.jpg",
            "/images/cruises-on-land-master-bedroom-suite-interior-punta-cana.jpg",
            "/images/cruises-on-land-twin-bedroom-interior-punta-cana.jpg",
            "/images/cruises-on-land-garden-villa-floor-plan-punta-cana.jpg",
            "/images/cruises-on-land-bedroom-headboard-detail-punta-cana.jpg",
            "/images/cruises-on-land-master-suite-balcony-view-punta-cana.jpg",
            "/images/cruises-on-land-modern-living-dining-room-punta-cana.jpg",
            "/images/cruises-on-land-living-room-dining-area-punta-cana.jpg",
            "/images/cruises-on-land-patio-picuzzi-jacuzzi-punta-cana.jpg",
            "/images/cruises-on-land-living-area-sofa-detail-punta-cana.jpg",
            "/images/cruises-on-land-spanish-plaza-restaurants-punta-cana.jpg",
            "/images/cruises-on-land-lake-aerial-overview-punta-cana.jpg"
        ],
        virtualTourUrl: "https://kuula.co/share/collection/7JrND?logo=1&info=0&logosize=137&fs=1&vr=1&sd=1&initload=0&autorotate=0.24&autop=10&thumbs=1",
        coordinates: { lat: 18.5700, lng: -68.3600 }
    },
    {
        id: 5,
        title: "Balcones de Brisas de Punta Cana",
        location: "bavaro",
        locationLabel: "Brisas de Punta Cana",
        type: "condo",
        status: "sale",
        price: 132000,
        image: "/images/balcones-de-brisas-punta-cana-building-facade-angle.jpg",
        beds: 2,
        baths: 2,
        area: 80,
        features: {
            en: ["Pool", "Gym", "Gazebo", "Lobby", "Access Control", "Parking", "Rooftop (some units)", "BBQ Pre-installation", "Jacuzzi Pre-installation", "Airbnb Friendly"],
            es: ["Piscina", "Gimnasio", "Gazebo", "Lobby", "Acceso Controlado", "Estacionamientos", "Rooftop (algunas unidades)", "Preinstalación BBQ", "Preinstalación Jacuzzi", "Airbnb Amigable"]
        },
        description: {
            en: `Balcones de Brisas de Punta Cana – Exclusive Apartments in Brisas de Punta Cana
## Welcome to Balcones de Brisas de Punta Cana
An exclusive residential project designed for those seeking tranquility, comfort, and a secure investment in a private and well-connected environment in Punta Cana.

This development combines Caribbean charm with a carefully thought-out contemporary design to offer a relaxed lifestyle, ideal for both living and investing in Airbnb-style vacation rentals.

## Project Concept and Philosophy
Balcones de Brisas de Punta Cana has been conceived under a low-density philosophy, prioritizing privacy, comfort, and harmony with the environment.

Its architecture reflects a contemporary Caribbean style, with details and finishes that create a sophisticated and welcoming atmosphere, perfect for those seeking a serene, safe, and functional space.

## Strategic Location and Security
The project is located within the private residential community of Brisas de Punta Cana, a planned and consolidated community offering security, accessibility, and high appreciation projection.

**Key Distances:**
- 3 minutes from Downtown Punta Cana
- 10 minutes from the beach
- 10 minutes from medical centers
- 12 minutes from Punta Cana International Airport

**Security:**
- Private residential area
- 24/7 controlled access, guaranteeing tranquility and protection for residents and investors

## Residential Units
The project consists of 24 two-bedroom apartments, designed to offer comfort, functionality, and an excellent experience for both residents and guests.

**2-Bedroom Apartments:**
- 8 exclusive units with private rooftop, equipped with:
    - Pre-installation for BBQ
    - Pre-installation for Jacuzzi

These rooftop units represent the most attractive product of the project, highly demanded on platforms like Airbnb, thanks to their differentiation and experiential value.

## Amenities and Common Areas
Balcones de Brisas de Punta Cana offers amenities designed to elevate quality of life and increase the project's profitability:
- Social area with pool
- Gym
- Gazebo
- Air-conditioned lobby
- Controlled access
- Parking for residents and visitors

These amenities increase the project's attractiveness for vacation rentals, favoring higher occupancy and better rates.

## Investment and Airbnb
Thanks to its location, unit typology, and rooftop options, Balcones de Brisas de Punta Cana is an Airbnb-friendly project, ideal for those seeking:
- Passive income in dollars
- High occupancy in vacation rentals
- Functional and well-located apartments
- Premium options with private rooftop

## Payment Plan
The project offers an accessible and flexible payment plan:
- Reservation: US$1,000 (non-refundable)
- Contract Signing: 20% (30 days after reservation)
- During Construction: 30%, divided into monthly installments
- Upon Delivery: 50%
- Or with bank financing option with the entity of your preference

## Ideal for those seeking
- Modern apartments in Brisas de Punta Cana
- Low-density project
- Airbnb-friendly units
- Options with private rooftop
- 24/7 security and private residential environment
- Strategic location in Punta Cana
- Solid and profitable real estate investment`,
            es: `Balcones de Brisas de Punta Cana – Apartamentos Exclusivos en Brisas de Punta Cana
## Bienvenido a Balcones de Brisas de Punta Cana
Un proyecto residencial exclusivo diseñado para quienes buscan tranquilidad, confort y una inversión segura en un entorno privado y bien conectado en Punta Cana.

Este desarrollo combina el encanto del Caribe con un diseño contemporáneo cuidadosamente pensado para ofrecer un estilo de vida relajado, ideal tanto para vivir como para invertir en renta vacacional tipo Airbnb.

## Concepto y filosofía del proyecto
Balcones de Brisas de Punta Cana ha sido concebido bajo una filosofía de baja densidad, priorizando la privacidad, el confort y la armonía con el entorno.

Su arquitectura refleja un estilo caribeño contemporáneo, con detalles y acabados que crean un ambiente sofisticado y acogedor, perfecto para quienes buscan un espacio sereno, seguro y funcional.

## Ubicación estratégica y seguridad
El proyecto se encuentra ubicado dentro del residencial privado Brisas de Punta Cana, una comunidad planificada y consolidada que ofrece seguridad, accesibilidad y alta proyección de valorización.

**Distancias clave:**
- 3 minutos de Downtown Punta Cana
- 10 minutos de la playa
- 10 minutos de centros médicos
- 12 minutos del Aeropuerto Internacional de Punta Cana

**Seguridad:**
- Residencial privado
- Acceso controlado 24/7, garantizando tranquilidad y protección para residentes e inversionistas

## Unidades residenciales
El proyecto está compuesto por 24 apartamentos de dos (2) habitaciones, diseñados para ofrecer comodidad, funcionalidad y una excelente experiencia tanto para residentes como para huéspedes.

**Apartamentos de 2 habitaciones:**
- 8 unidades exclusivas con rooftop privado, equipadas con:
    - Preinstalación para BBQ
    - Preinstalación para Jacuzzi

Estas unidades con rooftop representan el producto más atractivo del proyecto, altamente demandado en plataformas como Airbnb, gracias a su diferenciación y valor experiencial.

## Amenidades y áreas comunes
Balcones de Brisas de Punta Cana ofrece amenidades diseñadas para elevar la calidad de vida y aumentar la rentabilidad del proyecto:
- Área social con piscina
- Gimnasio
- Gazebo
- Lobby climatizado
- Acceso controlado
- Estacionamientos para residentes y visitantes

Estas amenidades incrementan la atractividad del proyecto para renta vacacional, favoreciendo una mayor ocupación y mejores tarifas.

## Inversión y Airbnb
Gracias a su ubicación, tipología de unidades y opciones con rooftop, Balcones de Brisas de Punta Cana es un proyecto amigable con Airbnb, ideal para quienes buscan:
- Ingresos pasivos en dólares
- Alta ocupación en alquiler vacacional
- Apartamentos funcionales y bien ubicados
- Opciones premium con rooftop privado

## Plan de pago
El proyecto ofrece un plan de pago accesible y flexible:
- Reserva: US$1,000 (no reembolsable)
- Firma de contrato: 20 % (30 días después de la reserva)
- Durante la construcción: 30 %, dividido en cuotas mensuales
- Contra entrega: 50 %
- O con opción de financiamiento bancario con la entidad de su preferencia

## Ideal para quienes buscan
- Apartamentos modernos en Brisas de Punta Cana
- Proyecto de baja densidad
- Unidades amigables con Airbnb
- Opciones con rooftop privado
- Seguridad 24/7 y entorno residencial privado
- Ubicación estratégica en Punta Cana
- Inversión inmobiliaria sólida y rentable`
        },
        gallery: [
            "/images/balcones-de-brisas-punta-cana-building-facade-angle.jpg",
            "/images/balcones-de-brisas-punta-cana-rooftop-terrace-jacuzzi.jpg",
            "/images/balcones-de-brisas-punta-cana-pool-area-daytime.jpg",
            "/images/balcones-de-brisas-punta-cana-pool-lounge-area.jpg",
            "/images/balcones-de-brisas-punta-cana-street-view-building.jpg",
            "/images/balcones-de-brisas-punta-cana-gated-entrance-security.jpg",
            "/images/balcones-de-brisas-punta-cana-exclusive-rooftop-amenities.jpg",
            "/images/balcones-de-brisas-punta-cana-modern-apartment-facade.jpg",
            "/images/balcones-de-brisas-punta-cana-living-room-interior-design.jpg",
            "/images/balcones-de-brisas-punta-cana-building-entrance-elevator.jpg",
            "/images/balcones-de-brisas-punta-cana-dining-living-area.jpg",
            "/images/balcones-de-brisas-punta-cana-kitchen-side-view.jpg",
            "/images/balcones-de-brisas-punta-cana-living-room-tv-wall.jpg",
            "/images/balcones-de-brisas-punta-cana-kitchen-island-detail.jpg",
            "/images/balcones-de-brisas-punta-cana-master-bedroom-interior.jpg",
            "/images/balcones-de-brisas-punta-cana-open-concept-living-dining-view.jpg"
        ],
        featured: true
    },
    {
        id: 6,
        title: "Tropical Breeze",
        location: "bavaro",
        locationLabel: "Brisas de Punta Cana",
        type: "condo",
        status: "sale",
        price: 128500,
        image: "/images/tropical-breezes-main-facade-punta-cana.jpg",
        beds: 2,
        baths: 2,
        area: 90,
        gallery: [
            "/images/tropical-breezes-main-facade-punta-cana.jpg",
            "/images/tropical-breezes-pool-bbq-area-punta-cana.jpg",
            "/images/tropical-breezes-internal-courtyard-pool-punta-cana.jpg",
            "/images/tropical-breezes-modern-apartments-exterior-punta-cana.jpg",
            "/images/tropical-breezes-gated-entrance-street-punta-cana.jpg",
            "/images/tropical-breezes-gym-interior-punta-cana.png",
            "/images/tropical-breezes-gym-pool-view-punta-cana.jpg",
            "/images/tropical-breezes-top-down-courtyard-view-punta-cana.jpg",
            "/images/tropical-breezes-floor-plan-level-1-2-punta-cana.jpg",
            "/images/tropical-breezes-floor-plan-patio-garden-punta-cana.jpg",
            "/images/tropical-breezes-floor-plan-2-punta-cana.jpg",
            "/images/tropical-breezes-ground-floor-plan-garden-punta-cana.jpg",
            "/images/tropical-breezes-living-room-interior-design-punta-cana.jpg",
            "/images/tropical-breezes-dining-living-area-punta-cana.jpg",
            "/images/tropical-breezes-modern-kitchen-interior-punta-cana.jpg",
            "/images/tropical-breezes-interior-dining-living-punta-cana.jpg",
            "/images/tropical-breezes-bedroom-wardrobe-tv-punta-cana.jpg",
            "/images/tropical-breezes-living-room-modern-lighting-punta-cana.jpg",
            "/images/tropical-breezes-master-bedroom-suite-punta-cana.jpg",
            "/images/tropical-breezes-twin-bedroom-suite-punta-cana.jpg",
            "/images/tropical-breezes-outdoor-dining-pergola-terrace-punta-cana.jpg"
        ],
        features: {
            en: ["Gated Community", "Pool", "Jacuzzi", "BBQ Area", "Gym", "Airbnb Friendly", "24/7 Security", "Private Parking"],
            es: ["Proyecto Cerrado", "Piscina", "Jacuzzi", "Área de BBQ", "Gimnasio", "Airbnb Amigable", "Seguridad 24/7", "Parqueo Privado"]
        },
        description: {
            en: `Tropical Breeze – Modern Apartments in Brisas de Punta Cana

Welcome to Tropical Breeze, a real estate project designed for those seeking tranquility, comfort, and a smart investment in one of the fastest-growing residential areas of Punta Cana.

Located within the private residential community of Brisas de Punta Cana, Tropical Breeze combines contemporary architecture with the natural charm of the Caribbean, offering a secure, modern, and highly attractive environment for both living and vacation rentals like Airbnb.

## A Project Designed for Living and Renting

Tropical Breeze has been conceived to respond to current market needs, integrating functional apartments, well-distributed spaces, and common amenities ideal for short and long-term rentals.

Its strategic location and design make it a solid option for investors seeking passive income, high occupancy, and sustained appreciation, as well as for residents desiring quality of life in Punta Cana.

## Residential Environment & Security

- Gated Project
- 24/7 Security and controlled access
- Planned community with modern entrance
- Growing commercial development
- Clubhouse under construction

These elements strengthen the project's value and constant demand.

## Exclusive Amenities

Tropical Breeze offers common areas designed to elevate the experience of residents and guests:

- Pool & Jacuzzi
- BBQ Area
- Gym

Key amenities to increase the project's attractiveness on platforms like Airbnb.

## Apartments

The project features 2-bedroom apartments designed to offer comfort, functionality, and efficiency, ideal for both residential use and vacation rentals.

- Apartments from 90 m²
- Penthouse from 183 m²

These dimensions allow for a comfortable experience for couples, families, and vacation stays, as well as premium options for higher-ticket Airbnb rentals.

## Strategic Location & Connectivity

Tropical Breeze offers excellent access to the area's main points of interest:

- 3 minutes from Downtown Punta Cana
- 3 minutes from Coco Bongo
- 12 minutes from Punta Cana International Airport
- Quick access from Avenida Barceló

A key location to guarantee high tourist demand and ease of mobility.

## Flexible Payment Plan

- Reservation: US$2,000
- Contract Signing: 20%
- During Construction: 30%
- Upon Delivery: 50%

A scheme designed to facilitate investment and optimize payment flow.`,
            es: `Tropical Breeze – Apartamentos Modernos en Brisas de Punta Cana

Bienvenido a Tropical Breeze, un proyecto inmobiliario diseñado para quienes buscan tranquilidad, confort y una inversión inteligente en una de las zonas residenciales con mayor crecimiento y proyección de Punta Cana.

Ubicado dentro del residencial privado Brisas de Punta Cana, Tropical Breeze combina arquitectura contemporánea con el encanto natural del Caribe, ofreciendo un entorno seguro, moderno y altamente atractivo tanto para vivir como para renta vacacional tipo Airbnb.

## Un proyecto pensado para vivir y rentar

Tropical Breeze ha sido concebido para responder a las necesidades del mercado actual, integrando apartamentos funcionales, bien distribuidos y con amenidades comunes, ideales para alquileres a corto y largo plazo.

Su ubicación estratégica y su diseño lo convierten en una opción sólida para inversionistas que buscan ingresos pasivos, alta ocupación y plusvalía sostenida, así como para residentes que desean calidad de vida en Punta Cana.

## Seguridad y entorno residencial

- Proyecto cerrado
- Seguridad y acceso controlado
- Comunidad planificada con entrada moderna
- Desarrollo comercial en crecimiento
- Casa club en proceso de construcción

Estos elementos fortalecen la valorización del proyecto y la demanda constante.

## Amenidades exclusivas

Tropical Breeze ofrece áreas comunes diseñadas para elevar la experiencia de residentes y huéspedes:

- Piscina
- Jacuzzi
- Área de BBQ
- Gimnasio

Amenidades clave para incrementar la atractividad del proyecto en plataformas como Airbnb.

## Apartamentos

El proyecto cuenta con apartamentos de 2 habitaciones, diseñados para ofrecer comodidad, funcionalidad y eficiencia, ideales tanto para uso residencial como para renta vacacional.

- Apartamentos desde 90 m²
- Penthouse desde 183 m²

Estas dimensiones permiten una experiencia cómoda para parejas, familias y estancias vacacionales, así como opciones premium para Airbnb de mayor ticket.

## Ubicación estratégica y conectividad

Tropical Breeze ofrece excelente acceso a los principales puntos de interés de la zona:

- 3 minutos de Downtown Punta Cana
- 3 minutos de Downtown Punta Cana (Coco Bongo)
- 12 minutos del Aeropuerto Internacional de Punta Cana
- Acceso rápido desde la Avenida Barceló

Una ubicación clave para garantizar alta demanda turística y facilidad de movilidad.

## Plan de pago flexible

- Reserva: US$2,000
- Firma de contrato: 20 %
- Durante la construcción: 30 %
- Contra entrega: 50 %

Un esquema pensado para facilitar la inversión y optimizar el flujo de pagos.`
        },
        featured: true
    },
    {
        id: 7,
        title: "Kerry Residences – Villas Exclusivas en Brisas de Punta Cana",
        location: "bavaro",
        locationLabel: "Brisas de Punta Cana",
        type: "villa",
        status: "sale",
        price: 385000,
        image: "/images/kerry-plus-modern-villa-facade-punta-cana.jpg",
        beds: 3,
        baths: 3.5,
        area: 185,
        features: {
            en: ["Brisas de Punta Cana Private Community", "Gated Security", "Close to Downtown Punta Cana", "Easy Beach Access", "Nearby Commercial Areas", "Private Picuzzi", "BBQ Area", "Double Parking", "Open Concept Design", "Terrace & Balconies", "Low Density (Only 4 Villas)"],
            es: ["Residencial Privado Brisas de Punta Cana", "Seguridad y Acceso Controlado", "Cercanía a Downtown Punta Cana", "Fácil Acceso a Playas", "Áreas Comerciales Cercanas", "Picuzzi Privado", "Área de BBQ", "Marquesina Doble", "Diseño Concepto Abierto", "Terraza y Balcones", "Baja Densidad (Solo 4 Villas)"]
        },
        description: {
            en: `Kerry Residences – Exclusive Villas in Brisas de Punta Cana

Kerry Residences is a low-density residential project located in Brisas de Punta Cana, conceived for those seeking privacy, comfort, and a solid investment, ideal for both residential use and Airbnb-style vacation rentals.

Its design prioritizes open spaces, connection with green areas, and a quiet lifestyle within a private and well-connected residential environment.

## Property Features
- **Exclusive Residential:** Only 4 independent villas
- **Construction Area:** 185 m²
- **Design:** Open concept architectural design
- **Layout:** 3 bedrooms (Master with walk-in closet), 2 levels
- **Social Areas:** Integrated living room, dining room, and kitchen
- **Exterior:** Terrace, Picuzzi, BBQ Area, Balconies
- **Parking:** Double carport
- **Security:** Private residential with controlled access

The project design seeks to create an experience of relaxation, spaciousness, and privacy, highly valued by residents and guests.

## Rentabilidad y Perfil de Inversión
- **High Demand Zone:** Residential and vacation appeal
- **Airbnb Ideal:** Privacy and layout suited for rentals
- **Exclusivity:** Low density favors greater value
- **Appreciation:** Excellent growth projection
- **Stability:** Investment in a consolidated community

## Ideal For
- Families seeking tranquility and privacy
- Vacation rental investors
- Buyers valuing low density
- Modern villas in a private community
- Solid and functional real estate heritage`,
            es: `Kerry Residences – Villas Exclusivas en Brisas de Punta Cana

Kerry Residences es un proyecto residencial de baja densidad, ubicado en Brisas de Punta Cana, concebido para quienes buscan privacidad, confort y una inversión sólida, ideal tanto para uso residencial como para renta vacacional tipo Airbnb.

Su diseño prioriza los espacios abiertos, la conexión con áreas verdes y un estilo de vida tranquilo dentro de un entorno residencial privado y bien conectado.

## Características de la Propiedad
- **Residencial Exclusivo:** Solo 4 villas independientes
- **Área de Construcción:** 185 m²
- **Diseño:** Arquitectónico de concepto abierto
- **Distribución:** 3 habitaciones (Principal con walk-in closet), 2 niveles
- **Áreas Sociales:** Sala, comedor y cocina integrados
- **Exterior:** Terraza exterior, Picuzzi, Área de BBQ, Balcones
- **Estacionamiento:** Marquesina doble
- **Seguridad:** Residencial privado con acceso controlado

El diseño del proyecto busca crear una experiencia de relajación, amplitud y privacidad, altamente valorada por residentes y huéspedes.

## Rentabilidad y Perfil de Inversión
- Zona con alta demanda residencial y vacacional
- Ideal para Airbnb por su privacidad y distribución
- Baja densidad que favorece mayor exclusividad
- Excelente proyección de plusvalía
- Inversión estable en una comunidad consolidada

## Ubicación y Amenidades del Entorno
- Residencial privado Brisas de Punta Cana
- Seguridad y acceso controlado
- Cercanía a Downtown Punta Cana
- Fácil acceso a playas
- Áreas comerciales cercanas
- Entorno tranquilo y residencial

## Ideal Para
- Familias que buscan tranquilidad y privacidad
- Inversionistas en renta vacacional
- Compradores que valoran baja densidad
- Villas modernas en comunidad privada
- Patrimonio inmobiliario sólido y funcional`
        },
        gallery: [
            "/images/kerry-plus-modern-villa-facade-punta-cana.jpg",
            "/images/kerry-plus-villa-backyard-pool-punta-cana.jpg",
            "/images/kerry-plus-villa-pool-terrace-night-punta-cana.jpg",
            "/images/kerry-plus-modern-kitchen-island-punta-cana.jpg",
            "/images/kerry-plus-kitchen-dining-concept-punta-cana.jpg",
            "/images/kerry-plus-kitchen-bar-stools-detail-punta-cana.jpg",
            "/images/kerry-plus-kitchen-breakfast-bar-punta-cana.jpg",
            "/images/kerry-plus-open-concept-living-dining-punta-cana.jpg",
            "/images/kerry-plus-master-bedroom-lighting-design-punta-cana.jpg",
            "/images/kerry-plus-kitchen-island-pendant-lights-punta-cana.jpg"
        ],
        featured: true
    },
    {
        id: 8,
        title: "Proyecto Perla del Mar White Sands",
        location: "whitesands",
        locationLabel: "White Sands",
        type: "villa",
        status: "sale",
        price: 265000,
        image: "/images/perla-del-mar-modern-facade-dusk.jpg",
        beds: 3,
        baths: 3.5,
        area: 155,
        gallery: [
            "/images/perla-del-mar-modern-facade-dusk.jpg",
            "/images/perla-del-mar-aerial-view-house-pool.jpg",
            "/images/perla-del-mar-backyard-pool-patio.jpg",
            "/images/perla-del-mar-living-room-stairs-interior.jpg",
            "/images/perla-del-mar-street-view-exterior.jpg",
            "/images/perla-del-mar-living-room-stairs-wide-punta-cana.jpg",
            "/images/perla-del-mar-dining-kitchen-chandelier-punta-cana.jpg",
            "/images/perla-del-mar-modern-kitchen-island-punta-cana.jpg",
            "/images/perla-del-mar-open-concept-kitchen-living-punta-cana.jpg",
            "/images/perla-del-mar-dining-table-kitchen-view-punta-cana.jpg",
            "/images/perla-del-mar-rooftop-model-night-street-view.jpg",
            "/images/perla-del-mar-rooftop-model-modern-facade.jpg",
            "/images/perla-del-mar-rooftop-model-front-exterior.jpg",
            "/images/perla-del-mar-rooftop-model-aerial-day-view.jpg",
            "/images/perla-del-mar-rooftop-model-aerial-night-view.jpg",
            "/images/perla-del-mar-rooftop-model-pool-waterfall.jpg",
            "/images/perla-del-mar-rooftop-model-terrace-lounge.jpg",
            "/images/perla-del-mar-rooftop-model-living-tv-room.jpg",
            "/images/perla-del-mar-rooftop-model-pool-deck-top-view.jpg",
            "/images/perla-del-mar-rooftop-model-rooftop-terrace-jacuzzi-aerial.jpg",
            "/images/perla-del-mar-rooftop-model-modern-kitchen-black-stove.jpg",
            "/images/perla-del-mar-rooftop-model-living-room-top-view.jpg",
            "/images/perla-del-mar-rooftop-model-dining-area-stairs.jpg",
            "/images/perla-del-mar-rooftop-model-kitchen-island-dining.jpg",
            "/images/perla-del-mar-rooftop-model-rooftop-jacuzzi-closeup.jpg",
            "/images/perla-del-mar-rooftop-model-master-bedroom-design.jpg",
            "/images/perla-del-mar-rooftop-model-bedroom-tv-wall.jpg",
            "/images/perla-del-mar-rooftop-model-dining-stairs-staircase.jpg",
            "/images/perla-del-mar-rooftop-model-bedroom-side-view.jpg",
            "/images/perla-del-mar-rooftop-model-terrace-patio-lounge.jpg",
            "/images/perla-del-mar-floor-plan-ground-floor.jpg",
            "/images/perla-del-mar-floor-plan-rooftop-level.jpg",
            "/images/perla-del-mar-floor-plan-terrace-distribution.jpg",
            "/images/perla-del-mar-community-aerial-street-view.jpg",
            "/images/perla-del-mar-rooftop-aerial-sunset.jpg"
        ],
        features: {
            en: ["Private Beach Access", "Golf Course", "Semi-Olympic Pool", "Sports Courts (Tennis, Paddle, Basketball)", "Clubhouse & Restaurant", "Internal Beach Transport", "Pet Park", "Social Area & BBQ", "School", "24/7 Private Security"],
            es: ["Acceso privado a la playa", "Campo de Golf", "Piscina semi-olímpica", "Canchas deportivas (Tenis, Pádel, Baloncesto)", "Casa club y Restaurante", "Transporte interno a la playa", "Parque para mascotas", "Área social y BBQ", "Colegio", "Seguridad privada 24/7"]
        },
        description: {
            en: `Perla del Mar – Exclusive Villas in White Sands, Punta Cana

Perla del Mar is an exclusive residential villa project located within the renowned White Sands in Punta Cana.
Conceived for those seeking privacy, comfort, and a solid real estate investment, the project offers a highly attractive product for Airbnb-style vacation rentals and residential use.

## Project Features
- **Project Type:** 7 Single-family Villas
- **Layout:** 2 Levels, 3 Bedrooms
- **Design:** Modern and Functional Architectural Design
- **Interior:** Integrated living room, dining room, and kitchen
- **Exterior:** Private Pool, Outdoor Terrace, BBQ Area
- **Convenience:** Double Parking, Appliances Included (Stove, Fridge, Extractor)

## Premium Rooftop Villas
- **Exclusivity:** 3 villas with private rooftop
- **Amenities:** Luxury terraces with Jacuzzi and pergola area, spaces designed for entertainment and relaxation
- **Size:** From 155 m² up to 250 m² (including terraces and rooftop)
- **Value:** *These units represent the most exclusive and profitable segment of the project.*

## Investment Profile & Appreciation
Designed to maximize returns in the short and medium term, Perla del Mar stands out for its **high performance on Airbnb** and potential for dollar-based passive income.
- **Strategic Location:** Inside White Sands, ensuring high demand and occupancy.
- **Premium Rates:** Villas with rooftop command superior nightly rates.
- **Resort Lifestyle:** Access to private beach and golf course drives value.
- **Target Audience:** Ideal for vacation rental investors and buyers seeking a consolidated real estate heritage.

*Residents enjoy full access to White Sands amenities including the private beach, golf course, and clubhouse.*`,
            es: `Perla del Mar – Villas Exclusivas en White Sands, Punta Cana

Perla del Mar es un proyecto residencial exclusivo de villas ubicado dentro del reconocido White Sands, en Punta Cana.
Concebido para quienes buscan privacidad, confort y una inversión inmobiliaria sólida, el proyecto ofrece un producto altamente atractivo para renta vacacional tipo Airbnb y uso residencial.

## Características del Proyecto
- **Tipo de Proyecto:** 7 villas unifamiliares
- **Distribución:** Villas de 2 niveles, 3 habitaciones
- **Diseño:** Arquitectónico moderno y funcional
- **Interior:** Sala, comedor y cocina integrados
- **Exterior:** Piscina privada, Terraza exterior, Área de BBQ
- **Comodidad:** Parqueo doble, Línea blanca incluida (estufa, nevera y extractor)

## Villas Premium con Rooftop
- **Exclusividad:** 3 villas cuentan con rooftop privado
- **Amenidades:** Terrazas de lujo con jacuzzi y área pergolada, espacios diseñados para entretenimiento y descanso
- **Metraje:** Desde 155 m² hasta 250 m² (incluyendo terrazas y rooftop)
- **Valor:** *Estas unidades representan el segmento más exclusivo y rentable del proyecto.*

## Perfil de Inversión y Plusvalía
Diseñado para maximizar el retorno a corto y mediano plazo, Perla del Mar destaca por su **alto desempeño en Airbnb** y potencial de ingresos pasivos en dólares.
- **Ubicación Estratégica:** Dentro de White Sands, garantizando alta demanda y ocupación.
- **Tarifas Premium:** Las villas con rooftop permiten establecer precios por noche superiores.
- **Estilo de Vida Resort:** El acceso a playa privada y campo de golf impulsa la plusvalía.
- **Público Objetivo:** Ideal para inversionistas de renta vacacional y quienes buscan un patrimonio inmobiliario consolidado.

*Los propietarios disfrutan de acceso total a las amenidades de White Sands, incluyendo playa privada, campo de golf y casa club.*`
        },
    },
    {
        id: 9,
        title: "Ocean Village – Villas Exclusivas en White Sands, Punta Cana",
        location: "whitesands",
        locationLabel: "White Sands",
        type: "villa",
        status: "sale",
        price: 360000,
        image: "/images/ocean-village-punta-cana-modern-facade.jpg",
        beds: 3,
        baths: 2.5,
        area: 163,
        features: {
            en: ["White Sands Private Access", "Golf Course", "Large Rooftops (Duplex)", "Private Pool", "Double Parking", "Clubhouse & Restaurant", "Sports Courts", "Pet Park", "24/7 Security", "Airbnb Friendly", "Close to Casinos & Nightlife", "Internal Beach Transport"],
            es: ["Acceso Privado White Sands", "Campo de Golf", "Rooftops Amplios (Dúplex)", "Piscina Privada", "Parqueo Doble", "Casa Club y Restaurante", "Canchas Deportivas", "Parque de Mascotas", "Seguridad 24/7", "Airbnb Amigable", "Cerca Casinos y Vida Nocturna", "Transporte Interno a Playa"]
        },
        description: {
            en: `Ocean Village – Exclusive Villas in White Sands, Punta Cana

Ocean Village es un proyecto residencial exclusivo y de baja densidad ubicado dentro del prestigioso White Sands en Punta Cana.
Concebido para quienes buscan diseño contemporáneo, privacidad, y una inversión sólida, el proyecto es ideal tanto para uso residencial como para renta vacacional tipo Airbnb.

## Project Features
- **Total Units:** 8 Villas (Single-family & Duplex)
- **Concept:** Low-density project for maximum privacy
- **Design:** Modern and Functional Architectural Design
- **Construction:** 163 m²
- **Rooftop:** Private rooftop averaging 80 m² (in duplex villas)
- **Layout:** 3 bedrooms, 2 full bathrooms
- **Social Areas:** Open concept living room, dining room, and kitchen
- **Exterior:** Private Pool, Double Parking

## Duplex Villas with Private Rooftop
The duplex villas with rooftop represent the project's most attractive product for the rental market.
- **Luxury Terrace:** 80 m² rooftop conceived as a social area.
- **Amenities:** Includes Jacuzzi, pergola area, and BBQ space.
- **Value:** A key differentiator that drives higher occupancy and premium rates on platforms like Airbnb.

## Investment Profile & Appreciation
Ocean Village is positioned as a **highly Airbnb-friendly project**, designed to generate passive income in dollars.
- **High Demand:** Its location within White Sands attracts quality tourism.
- **Premium Segment:** The combination of luxury rooftops and private pools allows for competitive nightly rates.
- **Target Audience:** Perfect for investors seeking a differentiated product and families looking for a vacation home with resort amenities.

*Residents have full access to White Sands amenities, including private beach access, golf course, and clubhouse.*`,
            es: `Ocean Village – Villas Exclusivas en White Sands, Punta Cana

Ocean Village es un proyecto residencial exclusivo y de baja densidad ubicado dentro del prestigioso White Sands, en Punta Cana.
Concebido para quienes buscan diseño contemporáneo, privacidad y una inversión sólida, el proyecto es ideal tanto para uso residencial como para renta vacacional tipo Airbnb.

## Características del Proyecto
- **Total Unidades:** 8 Villas (Unifamiliares y Dúplex)
- **Concepto:** Proyecto de baja densidad para máxima privacidad
- **Diseño:** Arquitectónico moderno y funcional
- **Construcción:** 163 m²
- **Rooftop:** Rooftop privado con un promedio de 80 m² (en villas dúplex)
- **Distribución:** 3 habitaciones, 2 baños completos
- **Áreas Sociales:** Sala, comedor y cocina de concepto abierto
- **Exterior:** Piscina privada, Parqueo doble

## Villas Dúplex con Rooftop Privado
Las villas dúplex con rooftop representan el producto más atractivo del proyecto para el mercado de renta.
- **Terraza de Lujo:** Rooftop de 80 m² concebido como área social.
- **Amenidades:** Incluye Jacuzzi, área pergolada y espacio para BBQ.
- **Valor:** Un diferenciador clave que impulsa mayor ocupación y tarifas premium en plataformas como Airbnb.

## Perfil de Inversión y Plusvalía
Ocean Village se posiciona como un proyecto **altamente Airbnb-friendly**, diseñado para generar ingresos pasivos en dólares.
- **Alta Demanda:** Su ubicación dentro de White Sands atrae turismo de calidad.
- **Segmento Premium:** La combinación de rooftops de lujo y piscina privada permite tarifas por noche competitivas.
- **Público Objetivo:** Perfecto para inversionistas que buscan un producto diferenciado y familias que desean una casa vacacional con amenidades de resort.

*Los residentes tienen acceso total a las amenidades de White Sands, incluyendo acceso privado a la playa, campo de golf y casa club.*`
        },
        gallery: [
            "/images/ocean-village-punta-cana-modern-facade.jpg",
            "/images/ocean-village-punta-cana-modern-townhomes.jpg",
            "/images/ocean-village-punta-cana-rooftop-jacuzzi-terrace.jpg",
            "/images/ocean-village-punta-cana-duplex-facade.jpg",
            "/images/ocean-village-punta-cana-corner-view.jpg",
            "/images/ocean-village-punta-cana-aerial-rooftops.jpg",
            "/images/ocean-village-punta-cana-interior-living-room-tv-wall.jpg",
            "/images/ocean-village-punta-cana-modern-kitchen-island-dining.jpg",
            "/images/ocean-village-punta-cana-open-concept-living-dining.jpg",
            "/images/ocean-village-punta-cana-living-room-stairs-garden-view.jpg",
            "/images/ocean-village-punta-cana-interior-layout-overhead.jpg",
            "/images/ocean-village-punta-cana-kitchen-pool-waterfall-view.jpg",
            "/images/ocean-village-punta-cana-rooftop-jacuzzi-top-view.jpg",
            "/images/ocean-village-punta-cana-modern-living-room-entertainment.jpg",
            "/images/ocean-village-punta-cana-living-room-stairs-wood-detail.jpg",
            "/images/ocean-village-punta-cana-kitchen-stainless-steel-appliances.jpg",
            "/images/ocean-village-punta-cana-pool-waterfall-detail.jpg",
            "/images/ocean-village-punta-cana-rooftop-aerial-terrace-view.jpg",
            "/images/ocean-village-punta-cana-rooftop-jacuzzi-lounge-overhead.jpg",
            "/images/ocean-village-punta-cana-rooftop-jacuzzi-water-level.jpg",
            "/images/ocean-village-punta-cana-street-view-facade.jpg",
            "/images/ocean-village-punta-cana-modern-bathroom-shower.jpg",
            "/images/ocean-village-punta-cana-pool-stone-waterfall-feature.jpg",
            "/images/ocean-village-punta-cana-exterior-spiral-staircase-aerial.jpg",
            "/images/ocean-village-punta-cana-master-bedroom-modern-design.jpg",
            "/images/ocean-village-punta-cana-upstairs-hallway-glass-railing.jpg",
            "/images/ocean-village-punta-cana-master-bedroom-balcony-view.jpg",
            "/images/ocean-village-punta-cana-bedroom-tv-wall-design.jpg",
            "/images/ocean-village-punta-cana-modern-bathroom-gray-stone.jpg",
            "/images/ocean-village-punta-cana-bedroom-closet-mirror.jpg",
            "/images/ocean-village-punta-cana-bedroom-large-rug-design.jpg"
        ],
        featured: true
    },
    {
        id: 10,
        title: "Rental Villa Paradise",
        location: "puntacana",
        locationLabel: "Punta Cana",
        type: "villa",
        status: "rent",
        price: 5000,
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop",
        beds: 5,
        baths: 5,
        area: 400,
        features: {
            en: ["Vacation Rental", "Chef Included", "Beachfront", "Concierge"],
            es: ["Alquiler Vacacional", "Chef Incluido", "Frente al Mar", "Concierge"]
        },
        description: {
            en: "Perfect for family vacations. Luxury villa available for rent by the night or season.",
            es: "Perfecta para vacaciones familiares. Villa de lujo disponible para renta por noche o temporada."
        }
    },
    {
        id: 11,
        title: "Villa de Lujo en la Marina de Cap Cana",
        location: "capcana",
        locationLabel: "Marina de Cap Cana",
        type: "villa",
        status: "sale",
        price: 1300000,
        image: "/images/properties/cap-cana-ocean21/cap-cana-luxury-villa-ocean21-main-pool.jpg",
        beds: 3,
        baths: 6,
        area: 255,
        features: {
            en: ["Land: 690 m²", "Construction: 255 m²", "3 Bedrooms", "6 Bathrooms", "Private Pool & Garden", "Rooftop Terrace with Jacuzzi", "BBQ & Social Area", "Cap Cana Marina Access", "Punta Espada Golf Club", "24/7 Security", "Private Parking (2)", "High ROI Potential"],
            es: ["Terreno: 690 m²", "Construcción: 255 m²", "3 Habitaciones", "6 Baños", "Piscina y Jardín Privados", "Terraza Rooftop con Jacuzzi", "Área de BBQ y Social", "Acceso Marina Cap Cana", "Punta Espada Golf Club", "Seguridad 24/7", "Parqueo Privado (2)", "Alto Potencial de Retorno"]
        },
        description: {
            en: `Ocean 21 – Luxury Villa in Cap Cana Marina

Exclusive luxury villa located in the Ocean 21 project within Cap Cana Marina, one of the most prestigious and best-planned nautical destinations in the Caribbean.
This property combines contemporary architecture, spacious areas, and world-class amenities, positioning itself as both a high-end residence and a premium investment asset.

## Property Features
- **Type:** Luxury Villa
- **Land:** Approx. 690 m²
- **Construction:** Approx. 255 m²
- **Layout:** 3 Bedrooms, 6 Bathrooms, Service Room
- **Social Areas:** Open concept living and dining with marina views
- **Exterior:** Private Pool, Garden, and Parking for 2 vehicles
- **Rooftop:** Equipped with Jacuzzi, BBQ, and Social Area

## Investment Profile & Lifestyle
Ocean 21 offers a unique lifestyle with direct access to the Marina, recognized for its international atmosphere and gourmet dining.
- **High Return Potential:** Average nightly rates (~$950 USD) drive excellent annual profitability.
- **Consolidated Destination:** Cap Cana is the most exclusive destination in the Dominican Republic.
- **Target Audience:** Ideal for high-net-worth investors and buyers seeking a luxury vacation home with marina access.
- **Value Protection:** A property in Cap Cana guarantees long-term appreciation.

*Residents enjoy the exclusive lifestyle of Cap Cana, including access to Punta Espada Golf Club, Juanillo Beach, and the Marina.*`,
            es: `Ocean 21 – Villa de Lujo en Marina Cap Cana

Exclusiva villa de lujo ubicada en el proyecto Ocean 21 dentro de la Marina de Cap Cana, uno de los destinos náuticos más prestigiosos y mejor planificados del Caribe.
Esta propiedad combina arquitectura contemporánea, amplios espacios y amenidades de clase mundial, posicionándose como una residencia de alto nivel y un activo de inversión premium.

## Características de la Propiedad
- **Tipo:** Villa de Lujo
- **Terreno:** Aprox. 690 m²
- **Construcción:** Aprox. 255 m²
- **Distribución:** 3 Habitaciones, 6 Baños, Habitación de servicio
- **Exterior:** Piscina privada, Jardín y Parqueo para 2 vehículos
- **Rooftop:** Equipado con Jacuzzi, BBQ y Área Social

## Ubicación y Valor: Marina de Cap Cana
Ocean 21 ofrece un estilo de vida único con acceso directo a la Marina, reconocida por su ambiente internacional, gastronomía gourmet y capacidad para yates de gran eslora.

**Beneficios Clave de Inversión:**
- Alta proyección de rentabilidad anual (Tarifa promedio ~$950 USD/noche)
- Destino internacional consolidado
- Mercado activo de renta vacacional premium
- Protección de valor y plusvalía a largo plazo

## Ideal Para
- Inversionistas que buscan alto retorno
- Compradores de villas de lujo en Cap Cana
- Clientes interesados en renta vacacional premium
- Quienes valoran privacidad, rooftop y estilo de vida de marina
- Patrimonio inmobiliario sólido y exclusivo`
        },
        gallery: [
            "/images/properties/cap-cana-ocean21/cap-cana-luxury-villa-ocean21-main-pool.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-luxury-villa-ocean21-pool-lounge.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-luxury-villa-ocean21-exterior-facade.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-luxury-villa-ocean21-pool-terrace.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-luxury-villa-ocean21-garden-view.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-rooftop-jacuzzi-aerial.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-marina-yacht-view.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-rooftop-social-area.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-rooftop-bbq-kitchen.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-aerial-complex-overview.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-interior-dining-room.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-interior-living-kitchen-view.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-interior-living-room-tv.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-interior-living-room-sofa.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-interior-open-concept-living.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-dining-table-setup.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-kitchen-island-stools.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-kitchen-appliances-view.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-living-room-sofas.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-modern-kitchen-full.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-laundry-service-room.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-living-dining-open-space.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-dining-living-connection.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-living-room-seating-detail.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-guest-bedroom-blue.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-walk-in-closet-shelves.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-walk-in-closet-drawers.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-bedroom-coral-bedding-wardrobe.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-bedroom-coral-bedding-window.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-bathroom-double-vanity-shower.jpg",
            "/images/properties/cap-cana-ocean21/cap-cana-ocean21-twin-bedroom-guest.jpg"
        ],
        seo: {
            title: {
                en: "Luxury Villa Ocean 21 Cap Cana Marina | Best Investment 2024",
                es: "Villa de Lujo Ocean 21 Marina Cap Cana | Mejor Inversión 2024"
            },
            description: {
                en: "Exclusive 3BR villa in Ocean 21, Cap Cana. Features private rooftop, pool, and marina access. High ROI vacation rental. Invest in Punta Cana luxury real estate.",
                es: "Exclusiva villa de 3 hab en Ocean 21, Cap Cana. Con rooftop privado, piscina y acceso a marina. Alta rentabilidad en alquiler vacacional. Invierta en lujo Punta Cana."
            },
            keywords: {
                en: ["Cap Cana Real Estate", "Ocean 21 Villa", "Luxury Villa Punta Cana", "Marina Cap Cana Investment", "Dominican Republic Property", "Vacation Rental Investment"],
                es: ["Bienes Raíces Cap Cana", "Villa Ocean 21", "Villa Lujo Punta Cana", "Inversión Marina Cap Cana", "Propiedades República Dominicana", "Inversión Alquiler Vacacional"]
            }
        }
    },
    {
        id: 12,
        title: "Apartamento Tipo Loft con Vista al Mar en Soto Grande – Cap Cana",
        location: "capcana",
        locationLabel: "Soto Grande, Cap Cana",
        type: "condo",
        status: "sale",
        price: 410000,
        image: "/images/properties/soto-grande-loft/soto-grande-loft-ocean-view-main.jpg",
        beds: 1,
        baths: 1,
        area: 106,
        features: {
            en: ["Soto Grande Private Beach", "Cap Cana Marina", "Gourmet Restaurants & Beach Clubs", "Punta Espada Golf Club", "Tennis & Paddle Courts", "Equestrian Center", "Gym & Wellness", "Hiking & Biking Trails", "International School", "Commercial Areas", "24/7 Private Security", "Controlled Access"],
            es: ["Playa Privada Soto Grande", "Marina de Cap Cana", "Restaurantes Gourmet y Beach Clubs", "Punta Espada Golf Club", "Canchas de Tenis y Pádel", "Centro Ecuestre", "Gimnasio y Wellness", "Senderos para Caminatas y Ciclismo", "Colegio Internacional", "Áreas Comerciales", "Seguridad Privada 24/7", "Accesos Controlados"]
        },
        description: {
            en: `Ocean View Loft Apartment – Soto Grande, Cap Cana

Exclusive ocean-view loft apartment located in Soto Grande, Cap Cana, one of the most prestigious residential communities in the Caribbean.
This loft combines contemporary design, spaciousness, and a premium location, making it ideal for both residential use and vacation rental investment, with excellent Airbnb performance.

## Property Features
- **Type:** Loft Apartment
- **Construction Area:** 106 m²
- **View:** Direct Ocean View
- **Layout:** Open concept with living-dining area, modern kitchen, and mezzanine sleeping area
- **Design:** Double-height ceilings with abundant natural light

## Investment Profile & Lifestyle
Soto Grande is one of the most valued areas in Cap Cana due to its exclusive residential environment and direct access to private beaches.
- **High Airbnb Occupancy:** The loft concept with ocean view is highly demanded by couples and digital nomads.
- **Premium Guest Profile:** Attracts high-value tourism seeking privacy and luxury.
- **Asset Value:** High preservation of value and continuous appreciation within Cap Cana.
- **Strategic Location:** Steps from the Marina, restaurants, and the beach.

*Residents enjoy all Cap Cana amenities, including the private Soto Grande beach, Punta Espada Golf Course, and equestrian center.*`,
            es: `Apartamento Tipo Loft con Vista al Mar – Soto Grande, Cap Cana

Exclusivo apartamento tipo loft con vista al mar, ubicado en Soto Grande, dentro de Cap Cana, una de las comunidades residenciales más prestigiosas del Caribe.
Este loft combina diseño contemporáneo, amplitud y ubicación premium, siendo ideal tanto para uso residencial como para inversión en renta vacacional, con muy buen desempeño en Airbnb.

## Características de la Propiedad
- **Tipo:** Apartamento Loft
- **Área de construcción:** 106 m²
- **Vista:** Vista directa al mar
- **Distribución:** Espacio abierto con sala–comedor, cocina moderna y área de descanso en mezzanine
- **Diseño:** Techos de doble altura con abundante iluminación natural

## Perfil de Inversión y Estilo de Vida
Soto Grande es una de las zonas más valoradas de Cap Cana por su ambiente residencial exclusivo y acceso directo a playas privadas.
- **Alta Ocupación Airbnb:** El concepto loft con vista al mar es altamente demandado por parejas y nómadas digitales.
- **Perfil de Huésped Premium:** Atrae un turismo de alto valor que busca privacidad y lujo.
- **Valor del Activo:** Alta preservación de valor y plusvalía continua dentro de Cap Cana.
- **Ubicación Estratégica:** A pasos de la Marina, restaurantes y la playa.

*Los propietarios disfrutan de todas las amenidades de Cap Cana, incluyendo la playa privada de Soto Grande, el campo de golf Punta Espada y el centro ecuestre.*`
        },
        gallery: [
            "/images/properties/soto-grande-loft/soto-grande-loft-ocean-view-main.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-master-bedroom-yellow-art.png",
            "/images/properties/soto-grande-loft/soto-grande-loft-bedroom-high-ceiling-shutters.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-mezzanine-bedroom-view.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-dining-room-mirror.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-kitchen-stairs-glass-railing.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-stairs-wooden-steps.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-kitchen-island-stools.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-open-concept-kitchen-dining.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-dining-area-wall-mirror.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-bathroom-entrance-decor.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-bathroom-shower-closet.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-bathroom-bathtub-gold-tiles.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-bedroom-blue-bedding-art.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-bathroom-vanity-striped-wall.jpg",
            "/images/properties/soto-grande-loft/soto-grande-loft-bathroom-bathtub-chandelier.jpg"
        ],
        seo: {
            title: {
                en: "Loft Apartment Ocean View Soto Grande Cap Cana | For Sale",
                es: "Apartamento Loft Vista al Mar Soto Grande Cap Cana | Venta"
            },
            description: {
                en: "Exclusive 106m² Loft in Soto Grande, Cap Cana. Direct ocean view, modern design, private beach, and marina access. Ideal for Airbnb investment.",
                es: "Exclusivo Loft de 106m² en Soto Grande, Cap Cana. Vista directa al mar, diseño moderno, playa privada y acceso a marina. Ideal para inversión Airbnb."
            },
            keywords: {
                en: ["Soto Grande Cap Cana", "Loft for Sale Punta Cana", "Ocean View Apartment", "Cap Cana Real Estate", "Luxury Loft Caribbean", "Investment Property"],
                es: ["Soto Grande Cap Cana", "Loft en Venta Punta Cana", "Apartamento Vista Mar", "Bienes Raíces Cap Cana", "Loft de Lujo Caribe", "Inversión Inmobiliaria"]
            }
        }
    },
    {
        id: 13,
        title: "Terreno Hotelero Miches",
        location: "miches",
        locationLabel: "Miches",
        type: "resorts",
        status: "sale",
        price: 154000000,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
        featured: true,
        beds: 0,
        baths: 0,
        area: 1185000,
        gallery: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
            "/images/terreno-hotelero-miches-beachfront-aerial.png"
        ],
        features: {
            en: ["800m Linear Beachfront", "Hotel Zoning", "High Density Approved", "Pier/Marina Feasibility", "Access Roads", "Electricity/Water Access", "Tax Exemptions (CONFOTUR)", "Eco-Tourism Potential"],
            es: ["800m Lineales de Playa", "Zonificación Hotelera", "Alta Densidad Aprobada", "Factibilidad Muelle/Marina", "Vías de Acceso", "Acceso Luz/Agua", "Exenciones Fiscales (CONFOTUR)", "Potencial Eco-Turístico"]
        },
        description: {
            en: `Beachfront Land in Miches – Strategic Opportunity for Large-Scale Tourist Development

We present an exceptional investment opportunity in Miches, one of the Caribbean's most projected tourist destinations, currently transforming into a world-class hotel hub.

This land represents a strategic beachfront gem, ideal for developers, investment funds, and hotel groups looking to position themselves in the Dominican Republic's next great tourist frontier.

## Main Land Features
- **Approximate Area:** 1,185,000 m²
- **Beachfront:** More than 800 linear meters of natural beach
- **Location:** Miches, Dominican Republic
- **Condition:** Large, continuous land with high potential for comprehensive planning

These dimensions allow for the development of large-scale tourist projects, with multiple phases and a wide diversity of uses.

## Development Potential
Thanks to its extension and beachfront, the terrain is ideal for:
- Large-format hotel resorts
- International brand hotel complexes
- Mixed developments (hotel + branded residences + villas)
- Luxury eco-resorts
- Sustainable tourist projects
- Master-planned resorts with multiple products

The geometry and maritime front offer total flexibility in design, allowing to maximize views, controlled densities, and premium beachfront experiences.

## Strategic Value Environment
Large hotel complexes of internationally recognized brands are already being developed on the same coastline and surrounding areas, confirming:
- Institutional market confidence
- Country-level destination support
- Orderly and sustained growth
- High projected appreciation in the short, medium, and long term

Miches is positioned as the new star destination for high-level tourist developments, following the path of Punta Cana, but with lower saturation and greater future valuation potential.

## Miches Competitive Advantages
- Virgin beaches of great extension and natural beauty
- Current low density, ideal for exclusive projects
- Focus on sustainable and luxury tourism
- Growing public and private investment
- Active interest from large international hotel chains
- High land revaluation potential

## Investment with Future Vision
This land is not just a beachfront property: it is a high-impact tourist development platform, designed for those who understand the value of anticipating growth and positioning themselves before the destination's total consolidation.

Investing in Miches today is investing in the future of Caribbean tourism.

## Ideal For:
- International Hotel Groups
- Real Estate Investment Funds
- Tourism Developers
- Large-Scale Hotel Projects
- Long-Term Strategic Investments`,
            es: `Terreno Frente al Mar en Miches – Oportunidad Estratégica para Desarrollo Turístico de Gran Escala

Presentamos una oportunidad excepcional de inversión en Miches, uno de los destinos con mayor proyección turística y de desarrollo del Caribe, actualmente en plena transformación hacia un nuevo polo hotelero de clase mundial.

Este terreno representa una joya estratégica frente al mar, ideal para desarrolladores, fondos de inversión y grupos hoteleros que buscan posicionarse en la próxima gran frontera turística de República Dominicana.

## Características principales del terreno
- **Superficie aproximada:** 1,185,000 m²
- **Frente de playa:** más de 800 metros lineales de playa natural
- **Ubicación:** Miches, República Dominicana
- **Condición:** Terreno amplio, continuo y con alto potencial de planificación integral

Estas dimensiones permiten el desarrollo de proyectos turísticos de gran escala, con múltiples fases y una amplia diversidad de usos.

## Potencial de desarrollo
Gracias a su extensión y frente de playa, el terreno es ideal para:
- Resorts hoteleros de gran formato
- Complejos hoteleros de marcas internacionales
- Desarrollos mixtos (hotel + branded residences + villas)
- Eco-resorts de lujo
- Proyectos turísticos sostenibles
- Master planned resorts con múltiples productos

La geometría y el frente marítimo ofrecen flexibilidad total en el diseño, permitiendo maximizar vistas, densidades controladas y experiencias premium frente al mar.

## Entorno de alto valor estratégico
En la misma línea de playa y zonas colindantes ya se están desarrollando grandes complejos hoteleros de marcas reconocidas a nivel internacional, lo que confirma:
- La confianza del mercado institucional
- El respaldo del destino a nivel país
- Un crecimiento ordenado y sostenido
- Una alta proyección de plusvalía a corto, mediano y largo plazo

Miches se posiciona como el nuevo destino estrella para desarrollos turísticos de alto nivel, siguiendo el camino de Punta Cana, pero con menor saturación y mayor potencial de valorización futura.

## Ventajas competitivas de Miches
- Playas vírgenes de gran extensión y belleza natural
- Baja densidad actual, ideal para proyectos exclusivos
- Enfoque en turismo sostenible y de lujo
- Creciente inversión pública y privada
- Interés activo de grandes cadenas hoteleras internacionales
- Alto potencial de revalorización del suelo

## Una inversión con visión de futuro
Este terreno no es solo una propiedad frente al mar: es una plataforma de desarrollo turístico de alto impacto, diseñada para quienes entienden el valor de anticiparse al crecimiento y posicionarse antes de la consolidación total del destino.

Invertir hoy en Miches es invertir en el futuro del turismo del Caribe.

## Ideal para:
- Grupos hoteleros internacionales
- Fondos de inversión inmobiliaria
- Desarrolladores turísticos
- Proyectos hoteleros de gran escala
- Inversiones estratégicas a largo plazo`
        }
    },
    {
        id: 14,
        title: "Beachfront Condo Rental",
        location: "bavaro",
        locationLabel: "Bávaro",
        type: "condo",
        status: "rent",
        price: 3500,
        image: "/images/rental-condo-generated.png",
        beds: 2,
        baths: 2,
        area: 110,
        features: {
            en: ["Beach Access", "Furnished", "High Speed Wifi", "Security"],
            es: ["Acceso Playa", "Amueblado", "Wifi Alta Vel", "Seguridad"]
        },
        description: {
            en: "Fully equipped vacation apartment steps from the beach. Ideal for short or medium stays.",
            es: "Apartamento vacacional totalmente equipado a pasos de la playa. Ideal para estancias cortas o medianas."
        }
    },
    {
        id: 15,
        title: "Luxury Villa Cap Cana",
        location: "capcana",
        locationLabel: "Cap Cana",
        type: "villa",
        status: "rent",
        price: 8000,
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
        beds: 4,
        baths: 4.5,
        area: 500,
        features: {
            en: ["Private Pool", "Chef", "Golf Cart", "Marina View", "Eden Roc Beach Club Access", "Punta Espada Golf", "Private Dock Access"],
            es: ["Piscina Privada", "Chef", "Carrito de Golf", "Vista Marina", "Acceso Eden Roc Beach Club", "Golf Punta Espada", "Acceso Muelle Privado"]
        },
        description: {
            en: "Luxury experience in Cap Cana. Villa available for vacation rental with chef and cleaning service included.",
            es: "Experiencia de lujo en Cap Cana. Villa disponible para renta vacacional con servicio de chef y limpieza incluido."
        }
    },

];
