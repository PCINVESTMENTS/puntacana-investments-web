export interface Property {
    id: number;
    slug: string;
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
        slug: "apartamentos-the-beach-punta-cana",
        title: "Apartamentos | The Beach Punta Cana City Place",
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
            en: `The Beach – Apartments with Crystal Lagoon in Punta Cana City Place

The Beach is a unique residential project located in Punta Cana City Place, offering a resort-style lifestyle centered around a private Crystal Lagoon. It is the only complex in the area with a world-class artificial beach, transforming the experience of living and investing in the Caribbean.

Conceived for comfort and sustainability, The Beach combines contemporary design with high-level amenities, creating a perfect environment for both permanent residence and vacation rentals.

## Property Features
- **Typologies:** Apartments from 1 to 3 bedrooms (Arena & Sole models)
- **Design:** Modern buildings with pool and lagoon views
- **Interior:** Open concept with high-quality finishes
- **Equipment:** Units include full appliances (Stove, Fridge, Washer/Dryer, AC)
- **Sustainability:** Eco-friendly operation with rainwater harvesting

## Investment Profile & Lifestyle
The Beach operates under the **CONFOTUR Law**, offering significant tax exemptions for 15 years.
- **Unique Attraction:** The Crystal Lagoon drives high demand for Airbnb rentals.
- **Strategic Location:** 10 minutes from the Airport and 3 minutes from Downtown.
- **Target Audience:** Ideal for families seeking security and activities, and investors looking for a differentiated asset.
- **Maintenance:** Includes access to Lagoon, pools, and sports areas (~$3/m²).

*Residents enjoy resort-style amenities including 5 pools, sports complex, spa, and beach shuttle.*`,
            es: `The Beach – Apartamentos con Crystal Lagoon en Punta Cana City Place

The Beach es un proyecto residencial único ubicado en Punta Cana City Place, que ofrece un estilo de vida tipo resort centrado en una Crystal Lagoon privada. Es el único complejo de la zona con una playa artificial de clase mundial, transformando la experiencia de vivir e invertir en el Caribe.

Concebido para el confort y la sostenibilidad, The Beach combina diseño contemporáneo con amenidades de alto nivel, creando un entorno perfecto tanto para residencia permanente como para renta vacacional.

## Características de la Propiedad
- **Tipologías:** Apartamentos de 1 a 3 habitaciones (Modelos Arena y Sole)
- **Design:** Edificios modernos con vistas a piscinas y laguna
- **Interior:** Concepto abierto con terminaciones de calidad
- **Equipamiento:** Unidades incluyen línea blanca completa (Estufa, Nevera, Lavadora/Secadora, Aires)
- **Sostenibilidad:** Operación ecológica con recolección de agua de lluvia

## Perfil de Inversión y Estilo de Vida
The Beach opera bajo la **Ley CONFOTUR**, ofreciendo importantes exenciones fiscales por 15 años.
- **Atracción Única:** La Crystal Lagoon impulsa una alta demanda en alquileres tipo Airbnb.
- **Ubicación Estratégica:** A 10 minutos del Aeropuerto y 3 minutos de Downtown.
- **Público Objetivo:** Ideal para familias que buscan seguridad y actividades, e inversionistas que buscan un activo diferenciado.
- **Mantenimiento:** Incluye acceso a Lagoon, piscinas y áreas deportivas (~$3/m²).

*Los residentes disfrutan de amenidades tipo resort incluyendo 5 piscinas, complejo deportivo, spa y transporte a la playa.*`
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
        slug: "apartamentos-city-place-downtown-punta-cana",
        title: "Apartamentos | City Place Downtown Punta Cana",
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
            en: `City Place – Modern Apartments in the Heart of Downtown Punta Cana

City Place is a modern residential development designed to offer a perfect combination of tropical exclusivity and urban sophistication. Located in the area with the highest real estate growth in Punta Cana, it represents a solid investment opportunity for both residence and Airbnb-style vacation rentals.

Its strategic location and contemporary design ensure high demand, making it an ideal option for those seeking a scalable and secure real estate asset in the Dominican Caribbean.

## Property Features
- **Typologies:** Studios (50 m²), 1 and 2 Bedroom Apartments
- **Design:** Urban contemporary with efficient distribution
- **Equipment:** Units include appliances (Range hood, Cooktop, Oven, ACs)
- **Amenities:** Rooftop pool, social area, lobby, and gym access
- **Parking:** Covered and underground options with elevator access

## Investment Profile & Lifestyle
City Place benefits from the **CONFOTUR Law** (Tax Exemptions) and its prime location.
- **Strategic Location:** 1 minute from Downtown Punta Cana and 10 mins from beaches.
- **Airbnb Friendly:** Designed for high rotation and short-term rentals.
- **Value Proposition:** Competitive entry price with high appreciation potential.
- **Target Audience:** Digital nomads, young professionals, and rental investors.

*Residents enjoy exclusive rooftop amenities and immediate connectivity to Punta Cana's main entertainment and service centers.*`,
            es: `City Place – Apartamentos Modernos en el Corazón de Downtown Punta Cana

City Place es un desarrollo residencial moderno diseñado para ofrecer una combinación perfecta entre exclusividad tropical y sofisticación urbana. Ubicado en la zona de mayor crecimiento inmobiliario de Punta Cana, representa una oportunidad sólida de inversión tanto para residencia como para renta vacacional tipo Airbnb.

Su ubicación estratégica y diseño contemporáneo aseguran una alta demanda, convirtiéndolo en una opción ideal para quienes buscan un activo inmobiliario escalable y seguro en el Caribe dominicano.

## Características de la Propiedad
- **Tipologías:** Estudios (50 m²), Apartamentos de 1 y 2 habitaciones
- **Diseño:** Urbano contemporáneo con distribución eficiente
- **Equipamiento:** Unidades incluyen línea blanca (Extractora, Placa, Horno, Aires)
- **Amenidades:** Piscina en rooftop, área social, lobby y acceso a gimnasio
- **Estacionamiento:** Opciones techadas y soterradas con acceso a ascensor

## Perfil de Inversión y Estilo de Vida
City Place se beneficia de la **Ley CONFOTUR** (Exenciones Fiscales) y su ubicación privilegiada.
- **Ubicación Estratégica:** A 1 minuto de Downtown Punta Cana y 10 mins de las playas.
- **Airbnb Friendly:** Diseñado para alta rotación y alquileres de corta estancia.
- **Propuesta de Valor:** Precio de entrada competitivo con alto potencial de plusvalía.
- **Público Objetivo:** Nómadas digitales, profesionales jóvenes e inversionistas de renta.

*Los residentes disfrutan de amenidades exclusivas en el rooftop y una conectividad inmediata a los principales centros de entretenimiento y servicios de Punta Cana.*`
        },
        gallery: [
            "/images/city-place-downtown-punta-cana.jpg"
        ],
        coordinates: { lat: 18.6650, lng: -68.4100 }, // Approx Downtown
        featured: true
    },
    {
        id: 3,
        slug: "villas-diana-tropical-village-brisas-punta-cana",
        title: "Villas | Diana Tropical Village Brisas Punta Cana",
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
            en: `Diana Tropical Village – Luxury Villas in Brisas de Punta Cana

Diana Tropical Village is an exclusive villa project located within the private community of Brisas de Punta Cana, conceived for those seeking a modern home and a secure investment. It offers a balance of privacy, comfort, and projection in one of the fastest-growing areas of Bávaro.

Each villa features a functional design and customizable plans, allowing spaces to be adapted to personal needs or Airbnb rental strategies, without sacrificing quality of life or security.

## Property Features
- **Project:** Private gated community with individual titles
- **Villas:** 3 Bedrooms, 224 m² of construction
- **Land:** Lots from 266 m² to 316 m²
- **Exterior:** Includes Private Pool and Bbq area
- **Customization:** Flexible plans during pre-construction

## Investment Profile & Lifestyle
Located in a consolidated residential area, Diana Tropical Village offers high appreciation potential.
- **Airbnb Friendly:** No restrictions on vacation rentals.
- **Strategic Location:** Minutes from Downtown and Bávaro beaches.
- **Financial Flexibility:** Attractive payment plans during construction.
- **Secure Heritage:** Individual titling guarantees your investment.

*Residents enjoy the tranquility of a private community with 24/7 security and low maintenance costs.*`,
            es: `Diana Tropical Village – Villas de Lujo en Brisas de Punta Cana

Diana Tropical Village es un exclusivo proyecto de villas ubicado dentro del residencial privado Brisas de Punta Cana, concebido para quienes buscan un hogar moderno y una inversión segura. Ofrece un equilibrio entre privacidad, confort y proyección en una de las zonas de mayor crecimiento de Bávaro.

Cada villa cuenta con un diseño funcional y planos personalizables, permitiendo adaptar los espacios a necesidades personales o estrategias de renta tipo Airbnb, sin sacrificar calidad de vida ni seguridad.

## Características de la Propiedad
- **Proyecto:** Comunidad cerrada privada con títulos individuales
- **Villas:** 3 Habitaciones, 224 m² de construcción
- **Terreno:** Solares desde 266 m² hasta 316 m²
- **Exterior:** Incluye Piscina Privada y Área de BBQ
- **Personalización:** Planos flexibles durante pre-construcción

## Perfil de Inversión y Estilo de Vida
Ubicado en una zona residencial consolidada, Diana Tropical Village ofrece alto potencial de plusvalía.
- **Airbnb Friendly:** Sin restricciones para renta vacacional.
- **Ubicación Estratégica:** A minutos de Downtown y las playas de Bávaro.
- **Flexibilidad Financiera:** Planes de pago atractivos durante la construcción.
- **Patrimonio Seguro:** Titulación individual garantiza su inversión.

*Los residentes disfrutan de la tranquilidad de una comunidad privada con seguridad 24/7 y bajos costos de mantenimiento.*`
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
        slug: "condos-cruise-on-land-resort-punta-cana",
        title: "Condos | Cruise On Land Resort Punta Cana",
        location: "punta_cana",
        locationLabel: "Punta Cana",
        type: "condo",
        status: "sale",
        price: 75000,
        image: "/images/cruises-on-land-resort-complex-overview-punta-cana.jpg",
        beds: 1,
        baths: 1,
        area: 45,
        gallery: [
            "/images/cruises-on-land-resort-complex-overview-punta-cana.jpg",
            "/images/cruises-on-land-crystal-lagoon-beach-view-punta-cana.jpg",
            "/images/cruises-on-land-aerial-waterpark-view-punta-cana.jpg",
            "/images/cruises-on-land-adventure-water-park-slides-punta-cana.jpg",
            "/images/cruises-on-land-kids-water-park-zone-punta-cana.jpg",
            "/images/cruises-on-land-wave-pool-event-stage-punta-cana.jpg",
            "/images/cruises-on-land-lighthouse-lake-attraction-punta-cana.jpg",
            "/images/cruises-on-land-spanish-plaza-restaurants-punta-cana.jpg",
            "/images/cruises-on-land-dining-plaza-lake-view-punta-cana.jpg",
            "/images/cruises-on-land-resort-amenities-lounge-punta-cana.jpg",
            "/images/cruises-on-land-supermarket-grocery-store-punta-cana.jpg",
            "/images/cruises-on-land-residences-aerial-view-punta-cana.jpg",
            "/images/cruises-on-land-modern-living-dining-room-punta-cana.jpg",
            "/images/cruises-on-land-luxury-living-room-interior-punta-cana.jpg",
            "/images/cruises-on-land-living-room-dining-area-punta-cana.jpg",
            "/images/cruises-on-land-living-area-sofa-detail-punta-cana.jpg",
            "/images/cruises-on-land-master-bedroom-suite-interior-punta-cana.jpg",
            "/images/cruises-on-land-bedroom-headboard-detail-punta-cana.jpg",
            "/images/cruises-on-land-twin-bedroom-interior-punta-cana.jpg",
            "/images/cruises-on-land-master-suite-balcony-view-punta-cana.jpg",
            "/images/cruises-on-land-patio-picuzzi-jacuzzi-punta-cana.jpg",
            "/images/cruises-on-land-villa-floor-plan-with-pool-punta-cana.jpg",
            "/images/cruises-on-land-two-bedroom-suite-floor-plan-punta-cana.jpg",
            "/images/cruises-on-land-garden-villa-floor-plan-punta-cana.jpg",
            "/images/cruises-on-land-master-plan-map-punta-cana.png"
        ],
        features: {
            en: ["Theme Park Resort", "Crystal Lagoon", "Water Park", "Airbnb Friendly", "High Tourism Traffic", "Restaurants & Bars", "Shuttle Service", "Investment Potential", "Confotur Tax Exemption"],
            es: ["Resort Parque Temático", "Crystal Lagoon", "Parque Acuático", "Airbnb Amigable", "Alto Tráfico Turístico", "Restaurantes y Bares", "Servicio de Transporte", "Potencial de Inversión", "Exención Fiscal Confotur"]
        },
        description: {
            en: `Cruise On Land – The First Theme Park Resort in Punta Cana
        
Cruise On Land is an innovative tourism real estate complex that integrates a high-end resort with a theme park, offering a unique entertainment experience in the Caribbean. Located strategically in Punta Cana, this project is designed to attract mass tourism and generate high occupancy rates for short-term rentals.

With over 100 attractions including water parks, mechanical games, and ecological trails, Cruise On Land redefines the vacation concept, making it a perfect investment for those seeking high profitability through platforms like Airbnb.

## Property Features
- **Concept:** Theme Park & Resort Suites
- **Attractions:** Water Park, Wave Pool, Mechanical Games
- **Amenities:** Crystal Lagoon, Artificial Beach, Eco-Trails
- **Services:** Hotel management, Shuttle to beaches/airport, Concierge
- **Dining:** Gastronomic Boulevard, Bars, and Restaurants

## Investment Profile & Lifestyle
- **High Occupancy:** Attracts families and tourists seeking entertainment.
- **Turnkey Investment:** Fully managed rental program available.
- **Tax Benefits:** CONFOTUR Law applies (Tax Exemptions).
- **Growth:** Located in a rapidly developing area of Punta Cana.

## Ideal For
- Investors seeking high-yield vacation rentals
- Families wanting a vacation home with endless activities
- First-time investors in the Caribbean market`,
            es: `Cruise On Land – El Primer Resort de Parque Temático en Punta Cana

Cruise On Land es un innovador complejo inmobiliario turístico que integra un resort de alta gama con un parque temático, ofreciendo una experiencia de entretenimiento única en el Caribe. Ubicado estratégicamente en Punta Cana, este proyecto está diseñado para atraer turismo masivo y generar altas tasas de ocupación en alquileres vacacionales.

Con más de 100 atracciones que incluyen parques acuáticos, juegos mecánicos y senderos ecológicos, Cruise On Land redefine el concepto vacacional, convirtiéndolo en una inversión perfecta para quienes buscan alta rentabilidad a través de plataformas como Airbnb.

## Características de la Propiedad
- **Concepto:** Suites en Resort de Parque Temático
- **Atracciones:** Parque Acuático, Piscina de Olas, Juegos Mecánicos
- **Amenidades:** Crystal Lagoon, Playa Artificial, Eco-Senderos
- **Servicios:** Gestión hotelera, Transporte a playas/aeropuerto, Concierge
- **Gastronomía:** Bulevar Gastronómico, Bares y Restaurantes

## Perfil de Inversión y Estilo de Vida
- **Alta Ocupación:** Atrae a familias y turistas que buscan entretenimiento.
- **Inversión Llave en Mano:** Programa de renta totalmente gestionado disponible.
- **Beneficios Fiscales:** Aplica Ley CONFOTUR (Exenciones de Impuestos).
- **Crecimiento:** Ubicado en una zona de rápido desarrollo en Punta Cana.

## Ideal Para
- Inversionistas que buscan altos rendimientos en renta vacacional
- Familias que desean una casa de vacaciones con actividades infinitas
- Primeros inversionistas en el mercado del Caribe`
        },
        featured: true,
        coordinates: { lat: 18.60, lng: -68.45 },
        completionPercent: 30
    },
    {
        id: 5,
        slug: "apartamentos-balcones-de-brisas-punta-cana",
        title: "Apartamentos | Balcones de Brisas Punta Cana",
        location: "bavaro",
        locationLabel: "Brisas de Punta Cana",
        type: "condo",
        status: "sale",
        price: 92000,
        image: "/images/balcones-de-brisas-punta-cana-modern-apartment-facade.jpg",
        beds: 2,
        baths: 2,
        area: 95,
        gallery: [
            "/images/balcones-de-brisas-punta-cana-building-facade-angle.jpg",
            "/images/balcones-de-brisas-punta-cana-pool-area-daytime.jpg",
            "/images/balcones-de-brisas-punta-cana-pool-lounge-area.jpg",
            "/images/balcones-de-brisas-punta-cana-rooftop-terrace-jacuzzi.jpg",
            "/images/balcones-de-brisas-punta-cana-exclusive-rooftop-amenities.jpg",
            "/images/balcones-de-brisas-punta-cana-building-entrance-elevator.jpg",
            "/images/balcones-de-brisas-punta-cana-gated-entrance-security.jpg",
            "/images/balcones-de-brisas-punta-cana-street-view-building.jpg",
            "/images/balcones-de-brisas-punta-cana-open-concept-living-dining-view.jpg",
            "/images/balcones-de-brisas-punta-cana-living-room-interior-design.jpg",
            "/images/balcones-de-brisas-punta-cana-living-room-tv-wall.jpg",
            "/images/balcones-de-brisas-punta-cana-dining-living-area.jpg",
            "/images/balcones-de-brisas-punta-cana-kitchen-side-view.jpg",
            "/images/balcones-de-brisas-punta-cana-kitchen-island-detail.jpg",
            "/images/balcones-de-brisas-punta-cana-master-bedroom-interior.jpg"
        ],
        features: {
            en: ["Rooftop Pool", "Elevator", "Gated Community", "Covered Parking", "Social Area", "Gym", "Airbnb Friendly", "Low Maintenance"],
            es: ["Piscina en Rooftop", "Ascensor", "Comunidad Cerrada", "Parqueo Techado", "Área Social", "Gimnasio", "Airbnb Amigable", "Bajo Mantenimiento"]
        },
        description: {
            en: `Balcones de Brisas – Modern Living in Punta Cana
        
Balcones de Brisas offers a contemporary urban living experience in the heart of Brisas de Punta Cana. This development stands out for its modern architectural design, functional layouts, and premium amenities typically found in higher-priced projects.

With a focus on comfort and convenience, residents enjoy easy access to downtown Punta Cana while residing in a secure, private community with exclusive rooftop social areas.

## Property Features
- **Design:** Modern apartments with high-quality finishes
- **Rooftop:** Exclusive social area with pool and gym
- **Accessibility:** Buildings equipped with elevators
- **Security:** 24/7 surveillance and controlled access
- **Parking:** Covered spaces for residents

## Investment Profile & Lifestyle
- **Affordability:** Excellent entry price for a quality product.
- **Rental Potential:** Appeals to long-term residents and vacationers.
- **Location:** Close to commercial centers and main avenues.
- **Value:** Appreciation potential in a growing residential sector.

## Ideal For
- Young professionals
- Small families
- Investors looking for steady rental income`,
            es: `Balcones de Brisas – Vida Moderna en Punta Cana

Balcones de Brisas ofrece una experiencia de vida urbana y contemporánea en el corazón de Brisas de Punta Cana. Este desarrollo se destaca por su diseño arquitectónico moderno, distribución funcional y amenidades premium típicamente encontradas en proyectos de mayor precio.

Con un enfoque en el confort y la conveniencia, los residentes disfrutan de fácil acceso al centro de Punta Cana mientras viven en una comunidad privada y segura con áreas sociales exclusivas en el rooftop.

## Características de la Propiedad
- **Diseño:** Apartamentos modernos con terminaciones de calidad
- **Rooftop:** Área social exclusiva con piscina y gimnasio
- **Accesibilidad:** Edificios equipados con ascensores
- **Seguridad:** Vigilancia 24/7 y acceso controlado
- **Estacionamiento:** Espacios techados para residentes

## Perfil de Inversión y Estilo de Vida
- **Asequibilidad:** Excelente precio de entrada para un producto de calidad.
- **Potencial de Renta:** Atractivo para residentes a largo plazo y vacacionistas.
- **Ubicación:** Cerca de centros comerciales y avenidas principales.
- **Valor:** Potencial de plusvalía en un sector residencial en crecimiento.`
        },
        featured: true,
        coordinates: { lat: 18.61, lng: -68.42 }
    },
    {
        id: 6,
        slug: "apartamentos-tropical-breeze-brisas-punta-cana",
        title: "Apartamentos | Tropical Breeze Brisas Punta Cana",
        location: "bavaro",
        locationLabel: "Brisas de Punta Cana",
        type: "condo",
        status: "sale",
        price: 95000,
        image: "/images/tropical-breeze-brisas-punta-cana-pool-area.jpg",
        beds: 2,
        baths: 2,
        area: 85,
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
            en: ["Adult & Kids Pool", "Gazebo", "BBQ Area", "Access Control", "Security Camera", "Airbnb Friendly", "Close to Downtown"],
            es: ["Piscina Adultos y Niños", "Gazebo", "Área de BBQ", "Control de Acceso", "Cámaras de Seguridad", "Airbnb Amigable", "Cerca de Downtown"]
        },
        description: {
            en: `Tropical Breeze – Modern Apartments in Brisas de Punta Cana

Tropical Breeze is a residential complex designed to offer functionality, location, and an excellent price-quality ratio. Located in Brisas de Punta Cana, it provides quick access to the main entertainment and service centers of the area.

With a practical design and family-oriented amenities, it is an ideal option for both a first home and an entry-level investment in the Punta Cana vacation rental market.

## Property Features
- **Typology:** 2 Bedroom Apartments
- **Area:** 85 m² with efficient distribution
- **Design:** Modern balconies and bright spaces
- **Security:** Gated project with controlled access
- **Parking:** Assigned parking for residents

## Investment Profile & Lifestyle
Tropical Breeze stands out for its accessible price point in a consolidated area.
- **Strategic Location:** 3 minutes from Downtown Punta Cana.
- **Airbnb Potential:** Highly rentable due to proximity to attractions.
- **Low Maintenance:** Efficient operational costs.
- **Target Audience:** Young families and entry-level investors.

*Residents enjoy common areas including a pool, gazebo, and BBQ area.*`,
            es: `Tropical Breeze – Apartamentos Modernos en Brisas de Punta Cana

Tropical Breeze es un complejo residencial diseñado para ofrecer funcionalidad, ubicación y una excelente relación calidad-precio. Situado en Brisas de Punta Cana, brinda acceso rápido a los principales centros de entretenimiento y servicios de la zona.

Con un diseño práctico y amenidades familiares, es una opción ideal tanto para primera vivienda como para una inversión inicial en el mercado de renta vacacional de Punta Cana.

## Características de la Propiedad
- **Tipología:** Apartamentos de 2 Habitaciones
- **Área:** 85 m² con distribución eficiente
- **Diseño:** Balcones modernos y espacios iluminados
- **Seguridad:** Proyecto cerrado con acceso controlado
- **Estacionamiento:** Parqueo asignado para residentes

## Perfil de Inversión y Estilo de Vida
Tropical Breeze destaca por su precio accesible en una zona consolidada.
- **Ubicación Estratégica:** A 3 minutos de Downtown Punta Cana.
- **Potencial Airbnb:** Altamente rentable por su cercanía a atracciones.
- **Bajo Mantenimiento:** Costos operativos eficientes.
- **Público Objetivo:** Familias jóvenes e inversionistas iniciales.

*Los residentes disfrutan de áreas comunes que incluyen piscina, gazebo y área de BBQ.*`
        },
        featured: true
    },
    {
        id: 7,
        slug: "villas-kerry-residences-brisas-punta-cana",
        title: "Villas | Kerry Residences Brisas Punta Cana",
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
- **Layout:** 3 bedrooms (Master with walk-in closet), 2 levels
- **Social Areas:** Integrated living room, dining room, and kitchen
- **Exterior:** Terrace, Picuzzi, BBQ Area, Balconies
- **Parking:** Double carport

## Investment Profile & Lifestyle
- **High Demand Zone:** Residential and vacation appeal
- **Airbnb Ideal:** Privacy and layout suited for rentals
- **Exclusivity:** Low density favors greater value
- **Appreciation:** Excellent growth projection

## Ideal For
- Families seeking tranquility and privacy
- Vacation rental investors
- Buyers valuing low density
- Modern villas in a private community`,
            es: `Kerry Residences – Villas Exclusivas en Brisas de Punta Cana

Kerry Residences es un proyecto residencial de baja densidad, ubicado en Brisas de Punta Cana, concebido para quienes buscan privacidad, confort y una inversión sólida, ideal tanto para uso residencial como para renta vacacional tipo Airbnb.

Su diseño prioriza los espacios abiertos, la conexión con áreas verdes y un estilo de vida tranquilo dentro de un entorno residencial privado y bien conectado.

## Características de la Propiedad
- **Residencial Exclusivo:** Solo 4 villas independientes
- **Área de Construcción:** 185 m²
- **Distribución:** 3 habitaciones (Principal con walk-in closet), 2 niveles
- **Áreas Sociales:** Sala, comedor y cocina integrados
- **Exterior:** Terraza exterior, Picuzzi, Área de BBQ, Balcones
- **Estacionamiento:** Marquesina doble

## Perfil de Inversión y Estilo de Vida
- **Zona con alta demanda:** Residencial y vacacional
- **Ideal para Airbnb:** Por su privacidad y distribución
- **Baja densidad:** Favorece mayor exclusividad
- **Excelente proyección:** De plusvalía

## Ideal Para
- Familias que buscan tranquilidad y privacidad
- Inversionistas en renta vacacional
- Compradores que valoran baja densidad
- Villas modernas en comunidad privada`
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
        slug: "villas-perla-del-mar-white-sands",
        title: "Villas | Perla del Mar White Sands Punta Cana",
        location: "bavaro",
        locationLabel: "White Sands, Bávaro",
        type: "villa",
        status: "sale",
        price: 261775,
        image: "/images/perla-del-mar-villas-white-sands/perla-del-mar-villas-white-sands-main-facade.jpg",
        beds: 3,
        baths: 3,
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
            en: ["Private Beach Access", "Golf Course Access", "Clubhouse", "Gated Community", "Private Pool", "Rooftop Terrace", "Picuzzi", "24/7 Security", "Airbnb Friendly"],
            es: ["Acceso Playa Privada", "Acceso Campo Golf", "Casa Club", "Residencial Cerrado", "Piscina Privada", "Terraza Rooftop", "Picuzzi", "Seguridad 24/7", "Airbnb Amigable"]
        },
        description: {
            en: `Perla del Mar – Exclusive Villas in White Sands, Punta Cana

Perla del Mar is an exclusive residential villa project located within the renowned White Sands in Punta Cana. Conceived for those seeking privacy, comfort, and a solid real estate investment, the project offers a highly attractive product for Airbnb-style vacation rentals and residential use.

Its modern design and strategic location within a golf community with beach access make it a premium asset with high appreciation potential.

## Property Features
- **Type:** Single-family Villas (3 Bedrooms, 2 Levels)
- **Size:** From 155 m² up to 250 m² (including rooftop)
- **Social Areas:** Integrated living room, dining room, and kitchen
- **Exterior:** Private Pool, Outdoor Terrace, BBQ Area
- **Premium Units:** 3 villas with private rooftop and Jacuzzi
- **Convenience:** Double Parking, Appliances Included

## Investment Profile & Lifestyle
Designed to maximize returns in the short and medium term.
- **High Performance:** Excellent potential for dollar-based passive income via Airbnb.
- **Premium Rates:** Villas with rooftop command superior nightly rates.
- **Strategic Location:** Inside White Sands, ensuring high demand and occupancy.
- **Target Audience:** Vacation rental investors and buyers seeking a consolidated real estate heritage.

*Residents enjoy full access to White Sands amenities including the private beach, golf course, and clubhouse.*`,
            es: `Perla del Mar – Villas Exclusivas en White Sands, Punta Cana

Perla del Mar es un proyecto residencial exclusivo de villas ubicado dentro del reconocido White Sands, en Punta Cana. Concebido para quienes buscan privacidad, confort y una inversión inmobiliaria sólida, el proyecto ofrece un producto altamente atractivo para renta vacacional tipo Airbnb y uso residencial.

Su diseño moderno y ubicación estratégica dentro de una comunidad de golf con acceso a playa lo convierten en un activo premium con alta plusvalía.

## Características de la Propiedad
- **Tipo:** Villas unifamiliares (3 Habitaciones, 2 Niveles)
- **Tamaño:** Desde 155 m² hasta 250 m² (incluyendo rooftop)
- **Áreas Sociales:** Sala, comedor y cocina integrados
- **Exterior:** Piscina privada, Terraza exterior, Área de BBQ
- **Unidades Premium:** 3 villas cuentan con rooftop privado y jacuzzi
- **Comodidad:** Parqueo doble, Línea blanca incluida

## Perfil de Inversión y Estilo de Vida
Diseñado para maximizar el retorno a corto y mediano plazo.
- **Alto Desempeño:** Excelente potencial de ingresos pasivos en dólares vía Airbnb.
- **Tarifas Premium:** Las villas con rooftop permiten precios superiores por noche.
- **Ubicación Estratégica:** Dentro de White Sands, garantizando alta demanda.
- **Público Objetivo:** Inversionistas de renta vacacional y compradores finales.

*Los propietarios disfrutan de acceso total a las amenidades de White Sands, incluyendo playa privada, campo de golf y casa club.*`
        },
    },
    {
        id: 9,
        slug: "villas-ocean-village-white-sands",
        title: "Villas | Ocean Village White Sands Punta Cana",
        location: "bavaro",
        locationLabel: "White Sands, Bávaro",
        type: "villa",
        status: "sale",
        price: 360000,
        image: "/images/ocean-village-villas-white-sands/ocean-village-villas-white-sands-main-view.jpg",
        beds: 3,
        baths: 2,
        area: 163,
        features: {
            en: ["Private Beach Access", "Golf Course Access", "Clubhouse", "Gated Community", "Private Pool", "Private Rooftop (Duplex)", "Double Parking", "Airbnb Friendly", "Modern Design"],
            es: ["Acceso Playa Privada", "Acceso Campo Golf", "Casa Club", "Residencial Cerrado", "Piscina Privada", "Rooftop Privado (Dúplex)", "Parqueo Doble", "Airbnb Amigable", "Diseño Moderno"]
        },
        description: {
            en: `Ocean Village – Exclusive Villas in White Sands, Punta Cana

Ocean Village is an exclusive, low-density residential project located within the prestigious White Sands in Punta Cana. Conceived for those seeking contemporary design, privacy, and a solid investment, the project is ideal for both residential use and Airbnb-style vacation rentals.

Its duplex villas with private rooftops represent the project's most attractive product, offering luxury amenities that drive higher occupancy and premium rates.

## Property Features
- **Total Units:** 8 Villas (Single-family & Duplex)
- **Concept:** Low-density project for maximum privacy
- **Layout:** 3 bedrooms, 2 full bathrooms, Open concept
- **Rooftop:** Private rooftop averaging 80 m² (in duplex villas)
- **Exterior:** Private Pool, Double Parking, Jacuzzi (on rooftop)

## Investment Profile & Lifestyle
Ocean Village is positioned as a **highly Airbnb-friendly project**, designed to generate passive income in dollars.
- **High Demand:** Location within White Sands attracts quality tourism.
- **Premium Segment:** Luxury rooftops and private pools allow for competitive nightly rates.
- **Strategic Value:** A key differentiator in the rental market.
- **Target Audience:** Investors seeking a differentiated product and families looking for a vacation home.

*Residents have full access to White Sands amenities, including private beach access, golf course, and clubhouse.*`,
            es: `Ocean Village – Villas Exclusivas en White Sands, Punta Cana

Ocean Village es un proyecto residencial exclusivo y de baja densidad ubicado dentro del reconocido White Sands, en Punta Cana. Concebido para quienes buscan diseño contemporáneo, privacidad y una inversión sólida, el proyecto es ideal tanto para uso residencial como para renta vacacional tipo Airbnb.

Sus villas dúplex con rooftop privado representan el producto más atractivo del proyecto, ofreciendo amenidades de lujo que impulsan una mayor ocupación y mejores tarifas.

## Características de la Propiedad
- **Total Unidades:** 8 Villas (Unifamiliares y Dúplex)
- **Concepto:** Proyecto de baja densidad para máxima privacidad
- **Distribución:** 3 habitaciones, 2 baños completos, concepto abierto
- **Rooftop:** Rooftop privado promedio de 80 m² (en villas dúplex)
- **Exterior:** Piscina privada, Parqueo doble, Jacuzzi (en rooftop)

## Perfil de Inversión y Estilo de Vida
Ocean Village se posiciona como un proyecto **altamente Airbnb-friendly**, diseñado para generar ingresos pasivos en dólares.
- **Alta Demanda:** Ubicación dentro de White Sands atrae turismo de calidad.
- **Segmento Premium:** Rooftops de lujo y piscinas privadas permiten tarifas competitivas.
- **Valor Estratégico:** Un diferenciador clave en el mercado de renta.
- **Público Objetivo:** Inversionistas buscando un producto diferenciado y familias.

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
        slug: "villa-en-renta-ocean-21-marina-cap-cana-amueblada",
        title: "Villa en Renta Ocean 21 Marina Cap Cana",
        location: "capcana",
        locationLabel: "Ocean 21, Marina Cap Cana",
        type: "villa",
        status: "rent",
        price: 8000,
        image: "/images/properties/cap-cana-ocean21/ocean-21-rental-main.jpg",
        beds: 3,
        baths: 6,
        area: 255,
        features: {
            en: ["US$8,000 / Month", "Furnished & Equipped", "1 Year Contract", "Private Pool", "Rooftop Jacuzzi", "Marina Access", "Gated Security", "High Speed Wifi", "Service Room"],
            es: ["US$8,000 / Mes", "Amueblada y Equipada", "Contrato 1 Año", "Piscina Privada", "Jacuzzi en Rooftop", "Acceso Marina", "Seguridad Cerrada", "Wifi Alta Vel", "Habitación Servicio"]
        },
        description: {
            en: `Luxury Villa Ocean 21 for Rent - Furnished & Equipped

Enjoy the exclusive lifestyle of Cap Cana in this fully furnished and equipped luxury villa in Ocean 21. Available for long-term rental (minimum 1 year) at US$8,000 per month.

Located in the prestigious Marina Cap Cana, this property offers privacy, luxury, and direct access to world-class amenities.

## Property Features
- **Rent:** US$8,000 / Month
- **Contract:** Minimum 1 Year
- **Layout:** 3 Bedrooms, 6 Bathrooms, Service Room
- **Amenities:** Private Pool, Rooftop Jacuzzi, BBQ Area
- **Condition:** Fully Furnished and Equipped

## Lifestyle & Location
- **Exclusive Access:** Minutes from Juanillo Beach and Punta Espada Golf.
- **Marina Life:** Restaurants and luxury shops steps away.
- **Security:** 24/7 private security in a gated community.`,
            es: `Villa Ocean 21 en Renta - Amueblada y Equipada

Disfrute del estilo de vida exclusivo de Cap Cana en esta villa de lujo totalmente amueblada y equipada en Ocean 21. Disponible para renta a largo plazo (mínimo 1 año) por US$8,000 mensuales.

Ubicada en la prestigiosa Marina de Cap Cana, esta propiedad ofrece privacidad, lujo y acceso directo a amenidades de clase mundial.

## Características de la Propiedad
- **Renta:** US$8,000 / Mes
- **Contrato:** Mínimo 1 Año
- **Distribución:** 3 Habitaciones, 6 Baños, Habitación de Servicio
- **Amenidades:** Piscina Privada, Jacuzzi en Rooftop, Área de BBQ
- **Condición:** Totalmente Amueblada y Equipada

## Estilo de Vida y Ubicación
- **Acceso Exclusivo:** A minutos de Playa Juanillo y Golf Punta Espada.
- **Vida en la Marina:** Restaurantes y tiendas de lujo a pasos.
- **Seguridad:** Seguridad privada 24/7 en comunidad cerrada.`
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
                en: "Furnished Luxury Villa for Rent Ocean 21 Cap Cana | $8,000/mo",
                es: "Villa de Lujo Amueblada en Renta Ocean 21 Cap Cana | US$8,000/mes"
            },
            description: {
                en: "Rent this fully furnished luxury villa in Ocean 21, Cap Cana. 3 bedrooms, private pool, rooftop jacuzzi. Long term rental $8,000/month.",
                es: "Rente esta villa de lujo totalmente amueblada en Ocean 21, Cap Cana. 3 habitaciones, piscina privada, jacuzzi. Renta larga estancia US$8,000/mes."
            },
            keywords: {
                en: ["Villa for Rent Cap Cana", "Ocean 21 Rental", "Furnished Villa Cap Cana", "Long Term Rental Punta Cana", "Luxury Rental Dominican Republic"],
                es: ["Villa en Renta Cap Cana", "Alquiler Ocean 21", "Villa Amueblada Cap Cana", "Renta Larga Estancia Punta Cana", "Alquiler Lujo Republica Dominicana"]
            }
        }
    },
    {
        id: 11,
        slug: "villa-ocean-21-marina-cap-cana",
        title: "Villas | Ocean 21 Marina Cap Cana",
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

Exclusive luxury villa located in the Ocean 21 project within Cap Cana Marina, one of the most prestigious and best-planned nautical destinations in the Caribbean. This property combines contemporary architecture, spacious areas, and world-class amenities, positioning itself as both a high-end residence and a premium investment asset.

Its strategic location allows for direct enjoyment of the nautical lifestyle, with immediate access to gourmet dining and luxury services.

## Property Features
- **Type:** Luxury Villa (Ocean 21)
- **Land:** Approx. 690 m²
- **Construction:** Approx. 255 m²
- **Layout:** 3 Bedrooms, 6 Bathrooms, Service Room
- **Social Areas:** Open concept living and dining with marina views
- **Exterior:** Private Pool, Garden, and Parking for 2 vehicles
- **Rooftop:** Equipped with Jacuzzi, BBQ, and Social Area

## Investment Profile & Lifestyle
Ocean 21 offers a unique lifestyle with direct access to the Marina, recognized for its international atmosphere.
- **High Return Potential:** Average nightly rates drive excellent annual profitability.
- **Consolidated Destination:** Cap Cana is the most exclusive destination in the Dominican Republic.
- **Target Audience:** Ideal for high-net-worth investors and buyers seeking a luxury vacation home.
- **Value Protection:** A property in Cap Cana guarantees long-term appreciation.

*Residents enjoy the exclusive lifestyle of Cap Cana, including access to Punta Espada Golf Club, Juanillo Beach, and the Marina.*`,
            es: `Ocean 21 – Villa de Lujo en Marina Cap Cana

Exclusiva villa de lujo ubicada en el proyecto Ocean 21 dentro de la Marina de Cap Cana, uno de los destinos náuticos más prestigiosos y mejor planificados del Caribe. Esta propiedad combina arquitectura contemporánea, amplios espacios y amenidades de clase mundial, posicionándose como una residencia de alto nivel y un activo de inversión premium.

Su ubicación estratégica permite disfrutar directamente del estilo de vida náutico, con acceso inmediato a gastronomía gourmet y servicios de lujo.

## Características de la Propiedad
- **Tipo:** Villa de Lujo (Ocean 21)
- **Terreno:** Aprox. 690 m²
- **Construcción:** Aprox. 255 m²
- **Distribución:** 3 Habitaciones, 6 Baños, Habitación de servicio
- **Áreas Sociales:** Sala y comedor de concepto abierto con vistas
- **Exterior:** Piscina privada, Jardín y Parqueo para 2 vehículos
- **Rooftop:** Equipado con Jacuzzi, BBQ y Área Social

## Perfil de Inversión y Estilo de Vida
Ocean 21 ofrece un estilo de vida único con acceso directo a la Marina de Cap Cana.
- **Alta Rentabilidad:** Tarifas promedio por noche impulsan un excelente retorno anual.
- **Destino Consolidado:** Cap Cana es el destino más exclusivo de República Dominicana.
- **Público Objetivo:** Inversionistas de alto patrimonio y compradores de segunda vivienda.
- **Protección de Valor:** La ubicación garantiza una plusvalía sólida a largo plazo.

*Los propietarios disfrutan de todas las amenidades de Cap Cana, incluyendo Punta Espada Golf Club, Playa Juanillo y la Marina.*`
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
                en: "Luxury Villa Ocean 21 Marina Cap Cana | Best Investment",
                es: "Villa de Lujo Ocean 21 Marina Cap Cana | Mejor Inversión"
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
        slug: "apartamento-loft-soto-grande-cap-cana",
        title: "Apartamentos | Loft Soto Grande Cap Cana",
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

Exclusive ocean-view loft apartment located in Soto Grande, Cap Cana, one of the most prestigious residential communities in the Caribbean. This loft combines contemporary design, spaciousness, and a premium location, making it ideal for both residential use and vacation rental investment.

With excellent performance on platforms like Airbnb, this property represents a smart investment in a consolidated destination.

## Property Features
- **Type:** Loft Apartment
- **Construction Area:** 106 m²
- **View:** Direct Ocean View
- **Layout:** Open concept with living-dining area, mezzanine bedroom
- **Design:** Double-height ceilings with abundant natural light

## Investment Profile & Lifestyle
Soto Grande is one of the most valued areas in Cap Cana due to its exclusive residential environment and direct access to private beaches.
- **High Airbnb Occupancy:** The loft concept with ocean view is highly demanded.
- **Premium Guest Profile:** Attracts high-value tourism seeking privacy.
- **Asset Value:** High preservation of value and continuous appreciation within Cap Cana.
- **Strategic Location:** Steps from the Marina, restaurants, and the beach.

## Ideal For
- Residential use
- Vacation rental investment
- Couples and digital nomads

*Residents enjoy all Cap Cana amenities, including the private Soto Grande beach, Punta Espada Golf Course, and equestrian center.*`,
            es: `Apartamento Tipo Loft con Vista al Mar – Soto Grande, Cap Cana

Exclusivo apartamento tipo loft con vista al mar, ubicado en Soto Grande, dentro de Cap Cana, una de las comunidades residenciales más prestigiosas del Caribe. Este loft combina diseño contemporáneo, amplitud y ubicación premium, siendo ideal tanto para uso residencial como para inversión en renta vacacional.

Con un excelente desempeño en plataformas como Airbnb, esta propiedad representa una inversión inteligente en un destino consolidado.

## Características de la Propiedad
- **Tipo:** Apartamento Loft
- **Área de construcción:** 106 m²
- **Vista:** Vista directa al mar
- **Distribución:** Espacio abierto con sala–comedor, habitación en mezzanine
- **Diseño:** Techos de doble altura con abundante iluminación natural

## Perfil de Inversión y Estilo de Vida
Soto Grande es una de las zonas más valoradas de Cap Cana por su ambiente residencial exclusivo y acceso directo a playas privadas.
- **Alta Ocupación Airbnb:** El concepto loft con vista al mar es altamente demandado.
- **Perfil de Huésped Premium:** Atrae un turismo de alto valor que busca privacidad.
- **Valor del Activo:** Alta preservación de valor y plusvalía continua dentro de Cap Cana.
- **Ubicación Estratégica:** A pasos de la Marina, restaurantes y la playa.

## Ideal Para
- Uso residencial
- Inversión en renta vacacional
- Parejas y nómadas digitales

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
        slug: "terreno-hotelero-miches-playa-esmeralda",
        title: "Terrenos | Terreno Hotelero Miches",
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

We present an exceptional investment opportunity in Miches, one of the Caribbean's most projected tourist destinations, currently transforming into a world-class hotel hub. This land represents a strategic beachfront gem, ideal for developers, investment funds, and hotel groups looking to position themselves in the Dominican Republic's next great tourist frontier.

Investing in Miches today is investing in the future of Caribbean tourism.

## Property Features
- **Approximate Area:** 1,185,000 m²
- **Beachfront:** More than 800 linear meters of natural beach
- **Location:** Miches, Dominican Republic
- **Condition:** Large, continuous land with high potential
- **Potential:** Large-scale tourist projects, mixed developments

## Investment Profile & Lifestyle
Miches is positioned as the new star destination for high-level tourist developments.
- **Large Hotel Complexes:** Major international brands are already developing in the area.
- **Support:** Country-level destination support ensures orderly growth.
- **Appreciation:** High projected appreciation in the short, medium, and long term.
- **Competitive Advantages:** Virgin beaches, low density, and sustainability focus.

## Ideal For
- International Hotel Groups
- Real Estate Investment Funds
- Tourism Developers
- Large-Scale Hotel Projects
- Long-Term Strategic Investments`,
            es: `Terreno Frente al Mar en Miches – Oportunidad Estratégica para Desarrollo Turístico de Gran Escala

Presentamos una oportunidad excepcional de inversión en Miches, uno de los destinos con mayor proyección turística y de desarrollo del Caribe, actualmente en plena transformación hacia un nuevo polo hotelero de clase mundial. Este terreno representa una joya estratégica frente al mar, ideal para desarrolladores, fondos de inversión y grupos hoteleros.

Invertir hoy en Miches es invertir en el futuro del turismo del Caribe.

## Características de la Propiedad
- **Superficie aproximada:** 1,185,000 m²
- **Frente de playa:** Más de 800 metros lineales de playa natural
- **Ubicación:** Miches, República Dominicana
- **Condición:** Terreno amplio, continuo y con alto potencial
- **Potencial:** Proyectos turísticos de gran escala, desarrollos mixtos

## Perfil de Inversión y Estilo de Vida
Miches se posiciona como el nuevo destino estrella para desarrollos turísticos de alto nivel.
- **Complejos Hoteleros:** Grandes marcas internacionales ya están desarrollando en la zona.
- **Respaldo:** Apoyo de destino nivel país asegura crecimiento ordenado.
- **Plusvalía:** Alta proyección de plusvalía a corto, mediano y largo plazo.
- **Ventajas:** Playas vírgenes, baja densidad y enfoque sostenible.

## Ideal Para
- Grupos hoteleros internacionales
- Fondos de inversión inmobiliaria
- Desarrolladores turísticos
- Proyectos hoteleros de gran escala
- Inversiones estratégicas a largo plazo`
        }
    },
    {
        id: 14,
        slug: "villa-en-renta-white-sands-punta-cana-amueblada",
        title: "Villa en Renta Amueblada en White Sands Punta Cana",
        location: "bavaro",
        locationLabel: "White Sands, Bávaro",
        type: "villa",
        status: "rent",
        price: 2000,
        image: "/images/properties/villa-white-sands-modern/white-sands-villa-rental-main.png",
        beds: 3,
        baths: 3.5,
        area: 180,
        gallery: [
            "/images/properties/villa-white-sands-modern/white-sands-villa-pool-terrace.jpg",
            "/images/properties/villa-white-sands-modern/white-sands-villa-terrace-dining.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-modern-kitchen.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-open-concept.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-pool-deck.jpg",
            "/images/properties/villa-white-sands-modern/white-sands-villa-kitchen-island-view.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-living-room-paradise.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-living-area-decor.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-kitchen-high-angle.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-coffee-table-detail.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-hallway-decor.jpg",
            "/images/properties/villa-white-sands-modern/white-sands-villa-staircase-lighting.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-master-balcony-view.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-living-room-tv-area.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-living-dining-wide.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-bedroom-tv.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-bathroom-modern.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-bedroom-angle-2.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-bedroom-wardrobe.png"
        ],
        seo: {
            title: {
                en: "Furnished Villa for Rent in White Sands Punta Cana | 1 Year Contract",
                es: "Villa Amueblada en Renta en White Sands Punta Cana | Contrato 1 Año"
            },
            description: {
                en: "Furnished 3-bedroom villa for rent in White Sands, Punta Cana. $2,000/month, 1-year contract. Private pool, beach access, and golf. Secure gated community.",
                es: "Villa amueblada de 3 habitaciones en renta en White Sands, Punta Cana. US$2,000/mes, contrato de 1 año. Piscina privada, acceso a playa y golf. Residencial cerrado."
            },
            keywords: {
                en: ["Villa for Rent Punta Cana", "White Sands Rental", "Furnished Villa Punta Cana", "Long Term Rental Punta Cana", "House for Rent Bavaro"],
                es: ["Villa en Renta Punta Cana", "Renta White Sands", "Villa Amueblada Punta Cana", "Alquiler Larga Estancia Punta Cana", "Casa en Renta Bavaro"]
            }
        },
        features: {
            en: ["US$2,000 / Month", "Furnished", "1 Year Contract", "Private Beach Access", "Golf Course Access", "Clubhouse", "Private Pool", "Gated Community", "Service Room", "24/7 Security", "Private Parking"],
            es: ["US$2,000 / Mes", "Amueblada", "Contrato 1 Año", "Acceso Playa Privada", "Acceso Campo Golf", "Casa Club", "Piscina Privada", "Residencial Cerrado", "Habitación de Servicio", "Seguridad 24/7", "Parqueo Privado"]
        },
        description: {
            en: `Furnished Villa for Rent in White Sands - 1 Year Contract
        
This fully furnished villa for rent in White Sands offers the perfect blend of comfort and luxury for long-term living. Located in one of Punta Cana's most prestigious gated communities, this property is available for a minimum 1-year contract at US$2,000 per month.

The villa features a modern open-concept design, private pool, and access to exclusive amenities like the private beach and golf course.

## Property Features
- **Type:** Residential Villa (Furnished)
- **Rent:** US$2,000 / Month
- **Contract:** Minimum 1 Year
- **Layout:** 3 Bedrooms + Service Room, 3.5 Bathrooms
- **Amenities:** Private Pool, Garden, BBQ Area
- **Security:** 24/7 Gated Security

## Lifestyle & Location
Living in White Sands means enjoying a resort-style life every day. You are minutes away from the beach, golf courses, and downtown Bávaro.
- **Convenience:** Close to supermarkets, restaurants, and schools.
- **Community:** Quiet, safe, and family-friendly environment.
- **Access:** Private access to the beautiful White Sands beach.`,
            es: `Villa Amueblada en Renta en White Sands - Contrato de 1 Año

Esta villa totalmente amueblada en renta en White Sands ofrece la combinación perfecta de confort y lujo para vivienda a largo plazo. Ubicada en uno de los residenciales cerrados más prestigiosos de Punta Cana, esta propiedad está disponible para contrato mínimo de 1 año a US$2,000 por mes.

La villa cuenta con un diseño moderno de concepto abierto, piscina privada y acceso a amenidades exclusivas como la playa privada y el campo de golf.

## Características de la Propiedad
- **Tipo:** Villa Residencial (Amueblada)
- **Renta:** US$2,000 / Mes
- **Contrato:** Mínimo 1 Año
- **Distribución:** 3 Habitaciones + Habitación de Servicio, 3.5 Baños
- **Amenidades:** Piscina Privada, Jardín, Área de BBQ
- **Seguridad:** Seguridad 24/7 con control de acceso

## Estilo de Vida y Ubicación
Vivir en White Sands significa disfrutar de una vida estilo resort todos los días. Está a minutos de la playa, campos de golf y el centro de Bávaro.
- **Conveniencia:** Cerca de supermercados, restaurantes y escuelas.
- **Comunidad:** Entorno tranquilo, seguro y familiar.
- **Acceso:** Acceso privado a la hermosa playa de White Sands.`
        }
    },
    {
        id: 15,
        slug: "villa-lujo-cap-cana-punta-espada",
        title: "Villa | Luxury Villa Cap Cana Punta Espada",
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
            en: `Luxury Villa Cap Cana – Exclusive Vacation Rental

Luxury experience in Cap Cana. Villa available for vacation rental with chef and cleaning service included. Experience the ultimate Caribbean getaway in this masterpiece of design.

Located in the heart of Cap Cana, offering privacy and exclusivity.

## Property Features
- **Type:** Luxury Villa
- **Beds:** 4 Spacious Suites
- **Baths:** 4.5
- **Staff:** Chef and Maid included
- **Exterior:** Private Pool and Marina View

## Rental Experience
- **Exclusive Access:** Access to Eden Roc Beach Club.
- **Golf:** Minutes from Punta Espada Golf Course.
- **Lifestyle:** Enjoy the luxury life of Cap Cana with a golf cart included.

## Ideal For
- Luxury vacationers
- Families or groups seeking exclusivity
- Golf enthusiasts

*Guests have access to private dock and all Cap Cana amenities.*`,
            es: `Villa de Lujo Cap Cana – Renta Vacacional Exclusiva

Experiencia de lujo en Cap Cana. Villa disponible para renta vacacional con servicio de chef y limpieza incluido. Viva la escapada caribeña definitiva en esta obra maestra del diseño.

Ubicada en el corazón de Cap Cana, ofreciendo privacidad y exclusividad.

## Características de la Propiedad
- **Tipo:** Villa de Lujo
- **Habitaciones:** 4 Suites Espaciosas
- **Baños:** 4.5
- **Personal:** Chef y Camarera incluidos
- **Exterior:** Piscina Privada y Vista a la Marina

## Experiencia de Alquiler
- **Acceso Exclusivo:** Acceso al Eden Roc Beach Club.
- **Golf:** A minutos del Campo de Golf Punta Espada.
- **Estilo de Vida:** Disfrute la vida de lujo de Cap Cana con carrito de golf incluido.

## Ideal Para
- Vacacionistas de lujo
- Familias o grupos que buscan exclusividad
- Entusiastas del golf

*Los huéspedes tienen acceso a muelle privado y todas las amenidades de Cap Cana.*`
        }
    },
    {
        id: 16,
        slug: "villa-en-venta-en-white-sands-punta-cana",
        title: "Villa en Venta en White Sands Punta Cana",
        location: "bavaro",
        locationLabel: "White Sands, Bávaro",
        type: "villa",
        status: "sale",
        price: 365900,
        image: "/images/villa-white-sands-modern-exterior.jpg",
        beds: 3,
        baths: 3.5,
        area: 180,
        gallery: [
            "/images/properties/villa-white-sands-modern/white-sands-villa-pool-terrace.jpg",
            "/images/properties/villa-white-sands-modern/white-sands-villa-terrace-dining.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-modern-kitchen.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-open-concept.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-pool-deck.jpg",
            "/images/properties/villa-white-sands-modern/white-sands-villa-kitchen-island-view.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-living-room-paradise.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-living-area-decor.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-kitchen-high-angle.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-coffee-table-detail.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-hallway-decor.jpg",
            "/images/properties/villa-white-sands-modern/white-sands-villa-staircase-lighting.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-master-balcony-view.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-living-room-tv-area.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-living-dining-wide.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-bedroom-tv.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-bathroom-modern.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-bedroom-angle-2.png",
            "/images/properties/villa-white-sands-modern/white-sands-villa-bedroom-wardrobe.png"
        ],
        seo: {
            title: {
                en: "Villa for Sale in White Sands Punta Cana | Private Pool",
                es: "Villa en Venta en White Sands Punta Cana | Piscina Privada"
            },
            description: {
                en: "Villa for sale in White Sands Punta Cana. 3 bedrooms, private pool, and access to beach/golf. Secure investment in a gated community.",
                es: "Villa en Venta en White Sands Punta Cana. 3 habitaciones, piscina privada, acceso a playa y golf. Inversión segura en residencial cerrado."
            },
            keywords: {
                en: ["White Sands Punta Cana", "Villa for Sale Punta Cana", "Punta Cana Real Estate", "Airbnb Investment Punta Cana", "Private Pool Villa"],
                es: ["White Sands Punta Cana", "Villas en Venta Punta Cana", "Inmobiliaria Punta Cana", "Inversión Airbnb Punta Cana", "Villa con Piscina Privada"]
            }
        },
        features: {
            en: ["Private Beach Access", "Golf Course Access", "Clubhouse", "Private Pool", "Gated Community", "Service Room", "Open Concept", "24/7 Security", "Private Parking"],
            es: ["Acceso Playa Privada", "Acceso Campo Golf", "Casa Club", "Piscina Privada", "Residencial Cerrado", "Habitación de Servicio", "Concepto Abierto", "Seguridad 24/7", "Parqueo Privado"]
        },
        description: {
            en: `Modern Villa with Private Pool in White Sands
        
This villa for sale in White Sands offers an excellent opportunity to live or invest within one of the most consolidated and sought-after residential areas in Punta Cana. Located in the exclusive White Sands community, the property combines comfort, privacy, and high potential for Airbnb-style vacation rentals.

Its design maximizes space and light, creating a perfect environment for families or tourists seeking a private retreat near the beach.

## Property Features
- **Type:** Residential Villa
- **Construction:** Approx. 180 m²
- **Layout:** 3 Bedrooms + Service Room, 3.5 Bathrooms
- **Social Areas:** Open concept living room, functional kitchen
- **Exterior:** Private pool that elevates the user experience
- **Convenience:** Comfortable and well-lit distribution

## Investment Profile & Lifestyle
- **Excellent Location:** Inside White Sands, a secure and prestigious community.
- **High Demand:** Ideal for short-term rentals due to amenities and security.
- **Value Add:** Private pool allows for higher nightly rates and occupancy.
- **Target Audience:** Families seeking a resort-style lifestyle and investors looking for solid returns.

## Ideal For
- Vacation rental investors
- Families looking for a safe, resort-style home
- Buyers valuing location and security`,
            es: `Villa Moderna con Piscina Privada en White Sands

Esta villa en venta en White Sands es una excelente oportunidad para vivir o invertir dentro de uno de los residenciales más consolidados y demandados de Punta Cana. Ubicada en el exclusivo White Sands, la propiedad combina confort, privacidad y alto potencial para renta vacacional tipo Airbnb.

Su diseño maximiza el espacio y la luz, creando un ambiente perfecto para familias o turistas que buscan un refugio privado cerca de la playa.

## Características de la Propiedad
- **Tipo:** Villa residencial
- **Construcción:** Aprox. 180 m²
- **Distribución:** 3 Habitaciones + Habitación de servicio, 3.5 Baños
- **Áreas Sociales:** Sala de concepto abierto, cocina funcional
- **Exterior:** Piscina privada que eleva la experiencia del usuario
- **Conveniencia:** Distribución cómoda y bien iluminada

## Perfil de Inversión y Estilo de Vida
- **Excelente ubicación:** Dentro de White Sands, comunidad segura y prestigiosa.
- **Alta demanda:** Ideal para Airbnb y renta corta por sus amenidades.
- **Valor Agregado:** La piscina privada permite mejores tarifas y ocupación.
- **Público Objetivo:** Familias que buscan vivir estilo resort e inversionistas que buscan retorno sólido.

## Ideal Para
- Inversionistas en renta vacacional
- Familias que buscan vivir en un residencial tipo resort
- Compradores que valoran ubicación y seguridad`
        },
    },
    {
        id: 17,
        slug: "villa-lujo-frente-marina-cap-cana",
        title: "Luxury Villa Marina Cap Cana",
        location: "capcana",
        locationLabel: "Marina Cap Cana",
        type: "villa",
        status: "sale",
        price: 1975000,
        image: "/images/properties/cap-cana-marina-villa/main-marina-view.jpg",
        beds: 4,
        baths: 4.5,
        area: 600,
        features: {
            en: ["Prime Corner Location", "Marina Front", "Private Pool", "Water Filtration System", "Service Room", "High Privacy", "Premium ROI Potential", "637 m² Lot", "24/7 Security"],
            es: ["Frente a la Marina", "Piscina Privada", "Sistema Filtración Agua", "Habitación Servicio", "Alta Privacidad", "Retorno Premium", "Solar 637 m²", "Seguridad 24/7"]
        },
        description: {
            en: `Luxury Villa Fronting Cap Cana Marina – Private Corner Lot
        
Exclusive villa located directly in front of the Cap Cana Marina, one of the most prestigious and sought-after areas in the Caribbean. This property combines a strategic location, superior privacy, and excellent profitability potential, making it an ideal option for both luxury residence and high-level real estate investment.

The villa is situated on a unique corner lot, with one side bordering only a green area, guaranteeing greater privacy, open views, and a sense of spaciousness rare within the marina.

## Property Features
- **Location:** Premium connection to the nautical lifestyle.
- **Lot:** 637 m² | **Construction:** 600 m²
- **Distribution:** 4 Main Bedrooms, Service Room with Bath.
- **Levels:** 2 Levels with functional design and natural light.
- **Water System:** Full property filtration + drinking water filter in kitchen.

## Investment Profile & Lifestyle
- **Estimated Monthly Rent:** From US$15,000
- **Nightly Rate:** US$1,300 - US$1,700 (depending on season)
- **Demand:** High year-round demand in the area.
- **Versatility:** Ideal for long-term or short-term luxury rental.

## Distribution
**First Level:** 2 Full Bedrooms, Guest Bath, Living Room with Terrace Access, Kitchen, Laundry, Service Room, Private Pool.
**Second Level:** 2 Additional Full Bedrooms.

*Located directly in front of the Marina, with privileged views of the gastronomic and social environment.*`,
            es: `Villa de Lujo Frente a la Marina de Cap Cana
        
Exclusiva villa ubicada frente a la Marina de Cap Cana, una de las zonas más prestigiosas y demandadas del Caribe. Esta propiedad combina ubicación estratégica, privacidad superior y excelente potencial de rentabilidad, convirtiéndose en una opción ideal tanto para residencia de lujo como para inversión inmobiliaria de alto nivel.

La villa se encuentra en una esquina única, con uno de sus laterales colindando únicamente con un área verde, sin construcciones vecinas, lo que garantiza mayor privacidad, vistas abiertas y una sensación de amplitud poco común dentro de la marina.

## Características Destacadas
- **Ubicación:** Conexión directa con el estilo de vida náutico.
- **Dimensiones:** Solar 637 m² | Construcción 600 m²
- **Distribución:** 4 Habitaciones principales, Habitación de servicio.
- **Niveles:** 2 Niveles con diseño funcional e iluminación natural.
- **Sistema de Agua:** Filtración en toda la propiedad + filtro potable en cocina.

## Potencial de Inversión
- **Renta mensual estimada:** Desde US$15,000
- **Renta por noche:** US$1,300 – US$1,700 (según temporada)
- **Demanda:** Alta demanda comprobada todo el año.
- **Versatilidad:** Ideal para renta de largo o corto plazo (vacacional premium).

## Distribución Detallada
**Primer Nivel:** 2 Habitaciones completas, Baño de visitas, Sala con acceso a terraza, Cocina, Área de lavado, Habitación de servicio, Piscina privada.
**Segundo Nivel:** 2 Habitaciones completas adicionales.

*Ubicada directamente frente a la Marina de Cap Cana, con una vista privilegiada hacia el entorno gastronómico y social.*`
        },
        gallery: [
            "/images/properties/cap-cana-marina-villa/main-marina-view.jpg"
        ]
    },
];
