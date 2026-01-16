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
        title: "Cruises on Land Punta Cana",
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
            en: [
                "High ROI & Managed Rental Program",
                "15,000m² Artificial Beach & Wave Pool",
                "100+ Resort Amenities & Theme Park",
                "15 mins from Punta Cana Airport",
                "Tennis, Paddle, Basketball & Soccer Courts",
                "Museum, Planetarium & Film Studio",
                "20+ Gourmet Theme Restaurants",
                "24/7 Gated Security & Heliport"
            ],
            es: [
                "Alta Rentabilidad y Programa de Gestión de Alquileres",
                "15,000m² Playa Artificial y Piscina de Olas",
                "Más de 100 Amenidades y Parque Temático",
                "A 15 minutos del Aeropuerto de Punta Cana",
                "Canchas de Tenis, Pádel, Básquet y Fútbol",
                "Museo, Planetario y Estudios de Cine",
                "Más de 20 Restaurantes Temáticos",
                "Seguridad 24/7 y Helipuerto"
            ]
        },
        description: {
            en: `Cruise On Land Project – Thematic Investment Resort in Punta Cana

Welcome aboard, Captain!
Prepare to discover one of the most innovative and disruptive real estate investment opportunities in the Caribbean.

Cruise On Land Project is the first resort with an integrated theme park in the Caribbean, a revolutionary real estate concept that combines entertainment, tourism, and real estate into a single ecosystem designed to maximize guest experience and investor profitability.

The project offers modern 1, 2, and 3-bedroom units, carefully designed to suit different traveler profiles—couples, families, and groups—and investors seeking high occupancy, income diversification, and long-term stability. This versatility guarantees constant rental demand throughout the year.

With over 100 attractions, Cruise On Land creates a unique experience in the region, encouraging longer stays, higher guest turnover, and above-average market occupancy, translating into sustained income and attractive returns on investment.

## An investment designed to maximize your profitability

This exclusive development has been structured to optimize the investor's financial performance, offering significant benefits, including:

- Professional rental management program, focused on maximizing passive income, eliminating the operational burden for the owner

Thanks to this structure, the investor can enjoy an efficient, secure, and result-oriented real estate investment without needing to manage the day-to-day operations of the property.

## Strategic location in Punta Cana

Cruise On Land is strategically located in one of the most solid and high-demand tourist areas in the Caribbean:

- Just 15 minutes from Punta Cana International Airport
- 10 minutes from Downtown Punta Cana
- Close to beaches, shopping centers, restaurants, entertainment zones, and key services

This privileged location guarantees high capital appreciation, excellent connectivity, and constant national and international tourist demand, key factors for a successful real estate investment.

## Ideal for investors seeking:
- Passive income in US dollars
- High occupancy in vacation rentals
- Tourism properties with excellent appreciation projection
- Highly demanded 1, 2, and 3-bedroom units
- A smart balance between investment, security, and personal enjoyment`,
            es: `Proyecto Cruise On Land – Resort Temático de Inversión en Punta Cana

¡Bienvenido a bordo, Capitán!
Prepárese para descubrir una de las oportunidades de inversión inmobiliaria más innovadoras y disruptivas del Caribe.

Proyecto Cruise On Land es el primer resort con parque temático integrado del Caribe, un concepto inmobiliario revolucionario que combina entretenimiento, turismo y bienes raíces en un solo ecosistema diseñado para maximizar la experiencia del huésped y la rentabilidad del inversionista.

El proyecto ofrece unidades modernas de 1, 2 y 3 habitaciones, cuidadosamente diseñadas para adaptarse a distintos perfiles de viajeros —parejas, familias y grupos— y a inversionistas que buscan alta ocupación, diversificación de ingresos y estabilidad a largo plazo. Esta versatilidad garantiza una demanda de alquiler constante durante todo el año.

Con más de 100 atracciones, Cruise On Land crea una experiencia única en la región, incentivando estancias más largas, mayor rotación de huéspedes y una ocupación superior al promedio del mercado, lo que se traduce en ingresos sostenidos y atractivos retornos de inversión.

## Una inversión diseñada para maximizar su rentabilidad

Este exclusivo desarrollo ha sido estructurado para optimizar el rendimiento financiero del inversionista, ofreciendo importantes beneficios, entre ellos:

- Programa profesional de gestión de alquileres, enfocado en maximizar los ingresos pasivos, eliminando la carga operativa para el propietario

Gracias a esta estructura, el inversionista puede disfrutar de una inversión inmobiliaria eficiente, segura y orientada a resultados, sin necesidad de gestionar el día a día de la propiedad.

## Ubicación estratégica en Punta Cana

Cruise On Land se encuentra estratégicamente ubicado en una de las zonas turísticas más sólidas y demandadas del Caribe:

- A solo 15 minutos del Aeropuerto Internacional de Punta Cana
- A 10 minutos de Downtown Punta Cana
- Cercano a playas, centros comerciales, restaurantes, zonas de entretenimiento y servicios clave

Esta ubicación privilegiada garantiza alta plusvalía, excelente conectividad y una demanda turística nacional e internacional constante, factores clave para una inversión inmobiliaria exitosa.

## Ideal para inversionistas que buscan:
- Ingresos pasivos en dólares
- Alta ocupación en rentas vacacionales
- Propiedades turísticas con excelente proyección de valorización
- Unidades de 1, 2 y 3 habitaciones altamente demandadas
- Un equilibrio inteligente entre inversión, seguridad y disfrute personal`
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
        title: "KERRI PLUS",
        location: "vistacana",
        locationLabel: "Vista Cana",
        type: "villa",
        status: "sale",
        price: 385000,
        image: "/images/kerry-plus-modern-villa-facade-punta-cana.jpg",
        beds: 3,
        baths: 3.5,
        area: 321.24,
        features: {
            en: ["Private Pool", "Artificial Beach", "Golf Course", "Clubhouse", "Eco Trails", "Double Parking", "Terrace", "Gated Security", "Airbnb Friendly"],
            es: ["Piscina Privada", "Playa Artificial", "Campo de Golf", "Casa Club", "Senderos Ecológicos", "Parqueo Doble", "Terraza", "Seguridad Cerrada", "Airbnb Amigable"]
        },
        description: {
            en: `KERRI PLUS – Luxury Villas in Vista Cana, Punta Cana

Welcome to KERRI PLUS, an exclusive luxury villa project located within Vista Cana, one of the most modern, complete, and high-growth urban communities in Punta Cana.

Vista Cana has been conceived as a planned city, designed to integrate quality of life, entertainment, nature, and high real estate profitability. In this privileged environment, KERRI PLUS is born, ideal for living with high standards as well as for investing in vacation rentals and Airbnb.

## A project designed to live, enjoy, and rent

KERRI PLUS has been developed to make the most of the Vista Cana ecosystem, combining modern design villas, private amenities, and direct access to one of the communities most demanded by residents, investors, and tourists.

Thanks to its location and characteristics, the project is highly attractive for short and long-term rentals, including platforms like Airbnb, guaranteeing high occupancy and excellent return on investment.

## Villa Features
- 2-level Villas
- Total Construction Area: 321.24 m²
- Land: 400 m²
- 3 Master-style bedrooms
- 3 full bathrooms + ½ guest bathroom
- Private pool
- Double covered parking
- All bedrooms with private terrace

These features make KERRI PLUS an ideal product for premium rentals, focused on guests seeking comfort, privacy, and high-level experiences within Vista Cana.

## Villa Layout
First Level:
- Living Room
- Dining Room
- Kitchen
- Terrace & BBQ Area
- ½ Guest Bathroom
- Laundry Area & Service Room
- Double-height Staircase

Second Level:
- Master Bedroom with walk-in closet, private bathroom, and terrace
- Bedroom 2 with closet, private bathroom, and terrace
- Bedroom 3 with closet, private bathroom, and terrace
- Double-height Staircase

## Exclusive Vista Cana Amenities
Being part of Vista Cana, KERRI PLUS owners enjoy world-class amenities:
- Artificial white sand beach
- Navigable artificial lake with recreational activities
- Illuminated golf course
- Clubhouse, Sports areas, and Ecological trails
- Commercial zones, restaurants, and services
- 24/7 Security and controlled access

## Strategic Location within Vista Cana
- 5 minutes from Downtown Punta Cana
- 10 minutes from Bavaro beaches
- 15 minutes from Punta Cana International Airport

## Investment Plan
- Reservation: USD $5,000.00
- Contract Signing: 20%
- During Construction: 30%
- Upon Delivery: 50%
- Delivery Term: between 12 and 18 months`,
            es: `KERRI PLUS – Villas de Lujo en Vista Cana, Punta Cana

Bienvenido a KERRI PLUS, un exclusivo proyecto de villas de lujo ubicado dentro de Vista Cana, una de las comunidades urbanísticas más modernas, completas y de mayor proyección de Punta Cana.

Vista Cana ha sido concebida como una ciudad planificada, diseñada para integrar calidad de vida, entretenimiento, naturaleza y alta rentabilidad inmobiliaria. En este entorno privilegiado nace KERRI PLUS, ideal tanto para vivir con alto estándar como para invertir en renta vacacional y Airbnb.

## Un proyecto pensado para vivir, disfrutar y rentar

KERRI PLUS ha sido desarrollado para aprovechar al máximo el ecosistema de Vista Cana, combinando villas de diseño moderno, amenidades privadas y acceso directo a una de las comunidades más demandadas por residentes, inversionistas y turistas.

Gracias a su ubicación y características, el proyecto es altamente atractivo para alquileres a corto y largo plazo, incluyendo plataformas como Airbnb, garantizando alta ocupación y excelente retorno de inversión.

## Características de la villa

- Villas de 2 niveles
- Área total de construcción: 321.24 m²
- Terreno: 400 m²
- 3 habitaciones tipo máster
- 3 baños completos + ½ baño de visitas
- Piscina privada
- Parqueo doble techado
- Todas las habitaciones con terraza privada

Estas características convierten a KERRI PLUS en un producto ideal para rentas premium, enfocado en huéspedes que buscan confort, privacidad y experiencias de alto nivel dentro de Vista Cana.

## Distribución de la villa

Primer Nivel:
- Sala, Comedor y Cocina
- Terraza y Área de BBQ
- ½ baño de visitas
- Área de lavado y Habitación de servicio
- Escalera con doble altura

Segundo Nivel:
- Habitación principal con walk-in closet, baño privado y terraza
- Habitación 2 con closet, baño privado y terraza
- Habitación 3 con closet, baño privado y terraza
- Escalera con doble altura

## Amenidades exclusivas de Vista Cana

Al formar parte de Vista Cana, los propietarios de KERRI PLUS disfrutan de un conjunto de amenidades de clase mundial:

- Playa artificial de arena blanca
- Lago artificial navegable
- Campo de golf iluminado
- Casa club, Áreas deportivas y Senderos ecológicos
- Zonas comerciales y restaurantes
- Seguridad 24/7

## Ubicación estratégica
- 5 minutos de Downtown Punta Cana
- 10 minutos de las playas de Bávaro
- 15 minutos del Aeropuerto Internacional de Punta Cana

## Plan de pago
- Reserva: USD $5,000.00
- Firma de contrato: 20 %
- Durante la construcción: 30 %
- Contra entrega: 50 %
- Plazo de entrega: entre 12 y 18 meses`
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
        title: "Proyecto Perla del Mar",
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
            en: ["Private Beach Access", "Golf Course", "Rooftop with Jacuzzi", "Private Pool", "Gated Security", "Airbnb Friendly", "Pet Friendly", "Clubhouse", "Bar", "Restaurant", "Mini Market"],
            es: ["Acceso Privado a Playa", "Campo de Golf", "Rooftop con Jacuzzi", "Piscina Privada", "Seguridad Cerrada", "Airbnb Amigable", "Pet Friendly", "Casa Club", "Bar", "Restaurante", "Mini Market"]
        },
        description: {
            en: `Perla del Mar – Exclusive Villas in White Sands, Punta Cana

Welcome to Perla del Mar, a boutique residential project located within the prestigious White Sands in Punta Cana.

Perla del Mar has been conceived as a high-level villa concept, where modern design, privacy, a resort environment, and high profitability potential converge, ideal for both residential use and vacation rental investment like Airbnb.

## An exclusive and low-density project

Perla del Mar consists of only 7 single-family villas, ensuring low density, exclusivity, and privacy, attributes highly valued by owners and guests in the premium segment.

## Villas and Sizes

The project offers 3-bedroom villas, some with a service room, designed to provide spaciousness, functionality, and comfort, ideal for families, groups, and high-level vacation stays.

- Construction area from approximately 155 m² to 250 m²
- Private terraces from 18.34 m² to 52.00 m²
- Three (3) exclusive villas with private rooftop of up to 65.05 m²
- Double parking

The combination of spacious interiors and private outdoor areas positions Perla del Mar as a highly competitive product for Airbnb in Punta Cana.

## Luxury Rooftop Villas – A Superior Experience

Within the project, only 3 villas feature a luxury private rooftop, conceived as a high-level terrace that elevates the living experience and maximizes premium vacation rental profitability.

Each rooftop includes:
- Private Jacuzzi
- Pergola area, providing elegance, shade, and comfort
- Spacious terrace, ideal for lounge, social gatherings, and exclusive outdoor experiences

These villas represent the most exclusive product of the project, highly demanded on platforms like Airbnb for their differentiation, privacy, and experiential value.

## Investment Concept and Airbnb

Thanks to its location within White Sands, its functional sizes, and its rooftop options, Perla del Mar is a highly Airbnb-friendly project, allowing for passive income generation in dollars, with high occupancy and premium rates.

The villas with spacious terraces and rooftop with Jacuzzi stand out for:
- Higher preference in searches
- Better positioning in listings
- Superior nightly rates
- More attractive return on investment

## White Sands Residential Amenities

Being part of White Sands, Perla del Mar owners enjoy a fully consolidated resort-style environment that elevates the quality of life and the project's appeal for residents and guests:

- Private beach access (approx. 300 linear meters)
- Golf course
- Semi-Olympic pool
- Clubhouse and restaurants
- Complete sports areas, including: Tennis, Paddle, and Basketball courts
- Social areas, terraces, and BBQ
- Pet park, ideal for sharing with your dog
- Children's playground
- School within the residential area
- Internal transport to the beach
- Double 24/7 security and controlled access

This set of amenities positions White Sands as one of the most complete residential and tourist communities in Bavaro–Punta Cana, significantly increasing appreciation and vacation demand.

## Strategic Location

Perla del Mar is surrounded by high-profile hotels and services:

- Close to hotels like Ocean Blue, Paradisus Punta Cana, VIK, Caribe Club Princess, and Punta Cana Princess
- Close to casinos, bars, and entertainment zones
- Health centers just 5 minutes away
- Surrounded by shopping centers
- 20 minutes from Punta Cana International Airport

## Payment Plan

- Reservation: USD $2,000
- Initial: 20%
- 10% within 15 days of reservation
- 10% within 30 days with contract signing
- During Construction: 40% (Payable in 12 or 14 equal installments)
- Upon Delivery: 40%

## Ideal for those seeking

- Exclusive villas within White Sands
- Airbnb-friendly project
- Villas with spacious terraces and luxury rooftop with Jacuzzi
- Private beach access and complete sports amenities
- Pet-friendly and family environment
- Low density and high privacy
- Solid real estate investment in Punta Cana`,
            es: `Perla del Mar – Villas Exclusivas en Residencial White Sands, Punta Cana

Bienvenido a Perla del Mar, un proyecto residencial boutique ubicado dentro del prestigioso White Sands, en Punta Cana.

Perla del Mar ha sido concebido como un concepto de villas de alto nivel, donde convergen diseño moderno, privacidad, entorno resort y alto potencial de rentabilidad, ideal tanto para uso residencial como para inversión en renta vacacional tipo Airbnb.

## Un proyecto exclusivo y de baja densidad

Perla del Mar está conformado por solo 7 villas unifamiliares, lo que garantiza baja densidad, exclusividad y privacidad, atributos altamente valorados por propietarios y huéspedes del segmento premium.

## Villas y metrajes

El proyecto ofrece villas de 3 habitaciones, algunas con cuarto de servicio, diseñadas para brindar amplitud, funcionalidad y confort, ideales para familias, grupos y estancias vacacionales de alto nivel.

- Área de construcción desde aproximadamente 155 m² hasta 250 m²
- Terrazas privadas desde 18.34 m² hasta 52.00 m²
- Tres (3) villas exclusivas con rooftop privado de hasta 65.05 m²
- Parqueo doble

La combinación de espacios interiores amplios y áreas exteriores privadas posiciona a Perla del Mar como un producto altamente competitivo para Airbnb en Punta Cana.

## Villas con Rooftop de Lujo – Una Experiencia Superior

Dentro del proyecto, solo 3 villas cuentan con un rooftop privado de lujo, concebido como una terraza de alto nivel que eleva la experiencia de vida y maximiza la rentabilidad en alquiler vacacional premium.

Cada rooftop incluye:
- Jacuzzi privado
- Área pergolada, que aporta elegancia, sombra y confort
- Amplia terraza, ideal para lounge, reuniones sociales y experiencias exclusivas al aire libre

Estas villas representan el producto más exclusivo del proyecto, altamente demandado en plataformas como Airbnb por su diferenciación, privacidad y valor experiencial.

## Concepto de inversión y Airbnb

Gracias a su ubicación dentro de White Sands, sus metrajes funcionales y sus opciones con rooftop, Perla del Mar es un proyecto altamente amigable con Airbnb, permitiendo generar ingresos pasivos en dólares, con alta ocupación y tarifas premium.

Las villas con terrazas amplias y rooftop con jacuzzi destacan por:
- Mayor preferencia en búsquedas
- Mejor posicionamiento en listados
- Tarifas nocturnas superiores
- Retorno de inversión más atractivo

## Amenidades del Residencial White Sands

Al formar parte de White Sands, los propietarios de Perla del Mar disfrutan de un entorno tipo resort completamente consolidado, que eleva la calidad de vida y el atractivo del proyecto para residentes y huéspedes:

- Acceso privado a la playa (aprox. 300 metros lineales)
- Campo de golf
- Piscina semi-olímpica
- Casa club y restaurantes
- Áreas deportivas completas, que incluyen: Cancha de tenis, Cancha de pádel, Cancha de baloncesto
- Áreas sociales, terrazas y BBQ
- Parque para mascotas, ideal para compartir con el perro
- Área de juegos para niños
- Colegio dentro del residencial
- Transporte interno hacia la playa
- Doble seguridad 24/7 y acceso controlado

Este conjunto de amenidades posiciona a White Sands como una de las comunidades residenciales y turísticas más completas de Bávaro–Punta Cana, incrementando significativamente la plusvalía y la demanda vacacional.

## Ubicación estratégica

Perla del Mar se encuentra rodeado de hoteles y servicios de alto perfil:

- Próximo a hoteles como Ocean Blue, Paradisus Punta Cana, VIK, Caribe Club Princess y Punta Cana Princess
- Cercano a casinos, bares y zonas de entretenimiento
- Centros de salud a solo 5 minutos
- Rodeado de centros comerciales
- 20 minutos del Aeropuerto Internacional de Punta Cana

## Plan de pago

- Reserva: USD $2,000
- Inicial: 20 %
- 10 % a los 15 días de la reserva
- 10 % a los 30 días con firma del contrato
- Durante la construcción: 40 % (Pagadero en 12 o 14 cuotas iguales)
- Contra entrega: 40 %

## Ideal para quienes buscan

- Villas exclusivas dentro de White Sands
- Proyecto amigable con Airbnb
- Villas con terrazas amplias y rooftop de lujo con jacuzzi
- Acceso privado a playa y amenidades deportivas completas
- Entorno pet-friendly y familiar
- Baja densidad y alta privacidad
- Inversión inmobiliaria sólida en Punta Cana`
        }
    },
    {
        id: 9,
        title: "Ocean Village Punta Cana",
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
            en: ["Private Beach Access", "Private Rooftop (80m²)", "Picuzzi or Pool", "Golf Course", "Clubhouse", "Sports Courts", "Double Parking", "Airbnb Friendly", "Pet Friendly", "Bar", "Restaurant", "Mini Market"],
            es: ["Acceso Privado a Playa", "Rooftop Privado (80m²)", "Picuzzi o Piscina", "Campo de Golf", "Casa Club", "Canchas Deportivas", "Parqueo Doble", "Airbnb Amigable", "Pet Friendly", "Bar", "Restaurante", "Mini Market"]
        },
        description: {
            en: `Ocean Village Punta Cana – Exclusive Villas in White Sands Residential
## Welcome to Ocean Village Punta Cana
An exclusive residential project located within the prestigious White Sands in Bávaro, Punta Cana. Ocean Village Punta Cana presents a modern concept of exclusive villas, designed for those seeking comfort, privacy, and a highly profitable real estate investment, ideal for both personal use and Airbnb-style vacation rentals.

## An exclusive and low-density project
The project consists of 8 villas in total, carefully designed to offer privacy, contemporary design, and a differentiated residential experience:
- Duplex villas with luxury private rooftop
- Single-family villas, with modern and functional design
This low-density format guarantees exclusivity and greater long-term appreciation.

## Sizes and distribution
The villas have been designed to maximize space and the living experience, combining spacious interior areas with high-value outdoor spaces for the vacation market.
- 163 m² of construction
- Private rooftop with an average of 80 m² (in duplex villas)
- Double parking
- Modern and functional distribution
The combination of these sizes positions Ocean Village Punta Cana as a highly competitive product on Airbnb, especially in the premium segment.

## Luxury Rooftop Duplex Villas
The duplex villas with rooftop represent the project's main attraction and are designed to offer an elevated luxury experience, both for owners and guests.
**Main features:**
- Three levels, including private rooftop
- 3 bedrooms
- 2 full bathrooms
- Open concept living room, dining room, and lounge
- Modern kitchen with island
- Guest bathroom
- Laundry area
- Picuzzi or private pool (depending on configuration)
- Semi-covered double parking

## Private Rooftop – Luxury Terrace
The rooftop, with an average of 80 m², has been conceived as a true luxury terrace, ideal for personal enjoyment and to maximize vacation rental profitability:
- Jacuzzi
- Pergola area
- BBQ
- Half bath
- Ideal space for lounge, private events, and Caribbean sunsets
This rooftop is a key differential value, highly demanded on platforms like Airbnb, allowing for higher rates and higher occupancy.

## Single-family villas
The single-family villas offer a modern, comfortable, and functional design, ideal for families or investors seeking a solid and easy-to-rent product:
- Spacious interior spaces
- Private pool
- Design focused on comfort and family life
- Excellent potential for vacation rental

## White Sands Residential Amenities
As part of White Sands, Ocean Village Punta Cana offers access to resort-style amenities that significantly elevate quality of life and the vacation experience:
- Private beach access
- Golf course
- Semi-Olympic pool
- Complete sports areas (Tennis, Padel, Basketball)
- Clubhouse with restaurants
- Internal transport to the beach
- Pet park
- Double 24/7 security

## Strategic location
- Surrounded by high-level hotels and tourist complexes
- Close to casinos, bars, and entertainment zones
- Easy road access
- Just 20 minutes from Punta Cana International Airport

## Investment and Airbnb
Thanks to its size, luxury rooftops, and location within White Sands, Ocean Village Punta Cana is a highly Airbnb-friendly project, ideal for:
- Generating passive income in dollars
- Achieving high occupancy
- Accessing premium rates
- Investing in a differentiated and exclusive product

## Payment Plan
- 30% down payment
- 30% during construction
- 40% upon delivery

## Estimated delivery date
May 30, 2026

## Ideal for those looking for
- Exclusive villas within White Sands
- Airbnb-friendly project
- Luxury rooftop villas with large footage
- Resort-style environment with private beach
- Complete sports and recreational amenities
- Solid real estate investment in Punta Cana`,
            es: `Ocean Village Punta Cana – Villas Exclusivas en Residencial White Sands
## Bienvenido a Ocean Village Punta Cana
Un exclusivo proyecto residencial ubicado dentro del prestigioso White Sands, en Bávaro, Punta Cana. Ocean Village Punta Cana presenta un concepto moderno de villas exclusivas, diseñado para quienes buscan confort, privacidad y una inversión inmobiliaria altamente rentable, ideal tanto para uso personal como para renta vacacional tipo Airbnb.

## Un proyecto exclusivo y de baja densidad
El proyecto está compuesto por 8 villas en total, cuidadosamente diseñadas para ofrecer privacidad, diseño contemporáneo y una experiencia residencial diferenciada:
- Villas dúplex con rooftop privado de lujo
- Villas unifamiliares, de diseño moderno y funcional
Este formato de baja densidad garantiza exclusividad y una mayor valorización a largo plazo.

## Metraje y distribución
Las villas han sido diseñadas para maximizar el espacio y la experiencia de vida, combinando áreas interiores amplias con espacios exteriores de alto valor para el mercado vacacional.
- 163 m² de construcción
- Rooftop privado con un promedio de 80 m² (en las villas dúplex)
- Parqueo doble
- Distribución moderna y funcional
La combinación de estos metrajes posiciona a Ocean Village Punta Cana como un producto altamente competitivo en Airbnb, especialmente en el segmento premium.

## Villas Dúplex con Rooftop de Lujo
Las villas dúplex con rooftop representan el mayor atractivo del proyecto y están diseñadas para ofrecer una experiencia de lujo elevada, tanto para propietarios como para huéspedes.
**Características principales:**
- Tres niveles, incluyendo rooftop privado
- 3 habitaciones
- 2 baños completos
- Sala, comedor y estar de concepto abierto
- Cocina moderna con isla
- Baño de visitas
- Área de lavado
- Piscuzi o piscina privada (según configuración)
- Parqueo doble semi-techado

## Rooftop privado – Terraza de lujo
El rooftop, con un promedio de 80 m², ha sido concebido como una verdadera terraza de lujo, ideal para el disfrute personal y para maximizar la rentabilidad en renta vacacional:
- Jacuzzi
- Área pergolada
- BBQ
- Medio baño
- Espacio ideal para lounge, eventos privados y atardeceres caribeños
Este rooftop es un valor diferencial clave, altamente demandado en plataformas como Airbnb, permitiendo tarifas superiores y mayor ocupación.

## Villas unifamiliares
Las villas unifamiliares ofrecen un diseño moderno, cómodo y funcional, ideales para familias o inversionistas que buscan un producto sólido y fácil de rentar:
- Amplios espacios interiores
- Piscina privada
- Diseño enfocado en confort y vida familiar
- Excelente potencial para renta vacacional

## Amenidades del Residencial White Sands
Como parte de White Sands, Ocean Village Punta Cana ofrece acceso a amenidades tipo resort, que elevan significativamente la calidad de vida y la experiencia vacacional:
- Acceso privado a la playa
- Campo de golf
- Piscina semi-olímpica
- Áreas deportivas completas (Tenis, Pádel, Baloncesto)
- Casa club con restaurantes
- Transporte interno a la playa
- Parque para mascotas
- Doble seguridad 24/7

## Ubicación estratégica
- Rodeado de hoteles y complejos turísticos de alto nivel
- Cercano a casinos, bares y zonas de entretenimiento
- Fácil acceso vial
- A solo 20 minutos del Aeropuerto Internacional de Punta Cana

## Inversión y Airbnb
Gracias a su metraje, rooftops de lujo y ubicación dentro de White Sands, Ocean Village Punta Cana es un proyecto altamente amigable con Airbnb, ideal para:
- Generar ingresos pasivos en dólares
- Lograr alta ocupación
- Acceder a tarifas premium
- Invertir en un producto diferenciado y exclusivo

## Plan de pago
- 30 % inicial
- 30 % durante la construcción
- 40 % contra entrega

## Fecha estimada de entrega
30 de mayo de 2026

## Ideal para quienes buscan
- Villas exclusivas dentro de White Sands
- Proyecto amigable con Airbnb
- Villas con rooftop de lujo de gran metraje
- Entorno tipo resort con playa privada
- Amenidades deportivas y recreativas completas
- Inversión inmobiliaria sólida en Punta Cana`
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
    {
        id: 11,
        title: "Villa de Lujo en la Marina de Cap Cana",
        location: "capcana",
        locationLabel: "Marina de Cap Cana",
        type: "villa",
        status: "sale",
        price: 850000,
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop",
        beds: 3,
        baths: 6,
        area: 255,
        features: {
            en: ["Marina Cap Cana", "Ocean 21", "Rooftop Terrace", "Private Pool", "24/7 Security", "Airbnb Friendly", "Jacuzzi", "BBQ Area"],
            es: ["Marina Cap Cana", "Ocean 21", "Terraza Rooftop", "Piscina Privada", "Seguridad 24/7", "Airbnb Amigable", "Jacuzzi", "Área de BBQ"]
        },
        description: {
            en: `Luxury Villa in Ocean 21 Project – Cap Cana Marina

Exclusive luxury villa located within the Ocean 21 project, in the Cap Cana Marina, inside Cap Cana, one of the most prestigious and best-planned residential and tourist destinations in the Caribbean.

This property combines contemporary architecture, spacious areas, and access to world-class amenities, positioning itself as a high-level residence and a premium real estate investment with excellent profitability.

## General Property Data

- Land: approx. 690 m²
- Construction: approx. 255 m²
- Bedrooms: 3
- Service Room: 1
- Bathrooms: 6
- Open Concept Living Room
- Modern Kitchen
- Private Pool
- Garden
- Parking: 2 vehicles

## Luxury Rooftop Terrace

The property features an exterior rooftop terrace, designed as a space of high aesthetic and functional value, highly demanded in the premium vacation rental market.

**Rooftop equipped with:**
- Jacuzzi
- BBQ Area
- Independent Bathroom
- Social area ideal for private events and relaxation

The rooftop allows for higher occupancy, better reviews, and superior rates on rental platforms.

## Profitability and Airbnb Performance

**Average nightly rate: USD $950**

This performance confirms:
- High destination demand
- Premium guest profile
- Passive income in dollars
- Excellent annual profitability projection

## Exclusive Cap Cana Amenities & Benefits

**Gastronomy & Entertainment ↔ Cap Cana Marina**
- Gourmet restaurants and international cuisine
- Bars, lounges, and social spaces
- Exclusive events for residents
- World-class Marina
- Capacity for large yachts
- Nautical, international atmosphere

**Services & Facilities ↔ Security & Urban Order**
- International School
- Nearby medical centers
- Commercial areas
- Concierge services
- 24/7 Private Security
- Controlled access
- Modern underground infrastructure

**World-Class Golf ↔ Sports & Wellness**
- Punta Espada Golf Club (Jack Nicklaus)
- Top Caribbean golf course
- High-level equestrian center
- Tennis and paddle courts
- Gym and wellness centers

## Key Benefits of Investing in Cap Cana

- Sustained high appreciation
- Consolidated international destination
- Active premium vacation rental market
- High purchasing power buyer/tenant profile
- Planned, exclusive, and safe environment
- Long-term real estate value protection

## Ideal For

- Investors seeking high returns
- Luxury villa buyers in Cap Cana
- Clients interested in premium vacation rentals
- Those valuing rooftop, marina, and world-class amenities
- Solid and exclusive real estate heritage`,
            es: `Villa de Lujo en el Proyecto Ocean 21 – Marina de Cap Cana

Exclusiva villa de lujo ubicada dentro del proyecto Ocean 21, en la Marina de Cap Cana, dentro de Cap Cana, uno de los destinos residenciales y turísticos más prestigiosos y mejor planificados del Caribe.

Esta propiedad combina arquitectura contemporánea, amplios espacios y acceso a amenidades de clase mundial, posicionándose como una residencia de alto nivel y una inversión inmobiliaria premium con excelente rentabilidad.

## Datos Generales de la Propiedad

- Terreno: aprox. 690 m²
- Construcción: aprox. 255 m²
- Habitaciones: 3
- Habitación de servicio: 1
- Baños: 6
- Sala de concepto abierto
- Cocina moderna
- Piscina privada
- Jardín
- Parqueo: 2 vehículos

## Terraza Exterior Tipo Rooftop – Terraza de Lujo

La propiedad cuenta con una terraza exterior tipo rooftop, diseñada como un espacio de alto valor estético y funcional, altamente demandado en el mercado de renta vacacional premium.

**Rooftop equipado con:**
- Jacuzzi
- Área de BBQ
- Baño independiente
- Área social ideal para eventos privados y relajación

El rooftop permite mayor ocupación, mejores reseñas y tarifas superiores en plataformas de alquiler.

## Rentabilidad y Desempeño en Airbnb

**Tarifa promedio por noche: USD $950**

Este desempeño confirma:
- Alta demanda del destino
- Perfil de huésped premium
- Ingresos pasivos en dólares
- Excelente proyección de rentabilidad anual

## Amenidades y Beneficios Exclusivos de Cap Cana

**Gastronomy & Entertainment ↔ Marina de Cap Cana**
- Restaurantes gourmet y cocina internacional
- Bares, lounges y espacios sociales
- Eventos exclusivos para residentes
- Marina de categoría internacional
- Capacidad para yates de gran eslora
- Ambiente náutico internacional

**Servicios y Facilidades ↔ Seguridad y Orden Urbano**
- Colegio internacional
- Centros médicos cercanos
- Áreas comerciales
- Servicios de concierge
- Seguridad privada 24/7
- Accesos controlados
- Infraestructura moderna y soterrada

**Golf de Nivel Mundial ↔ Deportes & Bienestar**
- Punta Espada Golf Club (Jack Nicklaus)
- Uno de los mejores campos del Caribe
- Centro ecuestre de alto nivel
- Canchas de tenis y pádel
- Gimnasio y centros de wellness

## Beneficios Clave de Invertir en Cap Cana

- Alta plusvalía sostenida
- Destino internacional consolidado
- Mercado activo de renta vacacional premium
- Perfil de comprador e inquilino de alto poder adquisitivo
- Entorno planificado, exclusivo y seguro
- Protección del valor inmobiliario a largo plazo

## Ideal Para

- Inversionistas que buscan alto retorno
- Compradores de villas de lujo en Cap Cana
- Clientes interesados en renta vacacional premium
- Quienes valoran rooftop, marina y amenidades de clase mundial
- Patrimonio inmobiliario sólido y exclusivo`
        }
    },
    },
{
    id: 12,
        title: "Plaza Comercial Downtown",
            location: "bavaro",
                locationLabel: "Bávaro",
                    type: "commercial",
                        status: "sale",
                            price: 185000,
                                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
                                    beds: 0,
                                        baths: 1,
                                            area: 65,
                                                features: {
        en: ["High Traffic", "Private Parking", "Security", "Power Plant"],
            es: ["Alto Tráfico", "Parqueo Privado", "Seguridad", "Planta Eléctrica"]
    },
    description: {
        en: "Strategic commercial premises in the center of Bavaro. Ideal for corporate office or luxury retail.",
            es: "Local comercial estratégico en el centro de Bávaro. Ideal para oficina corporativa o retail de lujo."
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
