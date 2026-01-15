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
        title: "City Place Condos",
        location: "puntacana",
        locationLabel: "Punta Cana",
        type: "condo",
        status: "sale",
        price: 114500,
        image: "https://upcrealestate.com/wp-content/uploads/2025/03/Cityplace_desdepiscina1-scaled.jpg",
        beds: 2,
        baths: 2,
        area: 85,
        features: {
            en: [
                "CONFOTUR Tax Exemption (15 Years)",
                "Equipped Kitchen (Stove, Oven, Fridge, Washer/Dryer)",
                "Air Conditioning in Bedrooms",
                "P-92 Profile Windows & High-Quality Locks",
                "Adjacent to Downtown Punta Cana",
                "Rooftop Pool & Social Area per building",
                "Elevator & Covered Parking",
                "Airbnb & Booking Friendly"
            ],
            es: [
                "Exención Fiscal CONFOTUR (15 años)",
                "Cocina Equipada (Estufa, Horno, Nevera, Lavadora/Secadora)",
                "Aire Acondicionado en Habitaciones",
                "Ventanas Perfil P-92 y Cerraduras de Alta Calidad",
                "Adyacente a Downtown Punta Cana",
                "Piscina en Rooftop y Área Social por edificio",
                "Ascensor y Parqueo Techado",
                "Apto para Airbnb y Booking"
            ]
        },
        description: {
            en: "An integrated urban center designed for a vibrant lifestyle. City Place Condos combines chic residential units with commercial convenience, featuring 19 buildings with rooftop pools, a lush central park, and a location just 1 minute from Downtown Mall and 12 minutes from the airport.",
            es: "Un centro urbano integrado diseñado para un estilo de vida vibrante. City Place Condos combina unidades residenciales chic con conveniencia comercial, contando con 19 edificios con piscinas en el rooftop, un exuberante parque central, y una ubicación a solo 1 minuto de Downtown Mall y 12 minutos del aeropuerto."
        },
        gallery: [
            "https://upcrealestate.com/wp-content/uploads/2025/03/Cityplace_desdepiscina1-scaled.jpg",
            "https://upcrealestate.com/wp-content/uploads/2025/03/12.jpg",
            "https://upcrealestate.com/wp-content/uploads/2023/12/1.jpg",
            "https://upcrealestate.com/wp-content/uploads/2024/01/1.jpg",
            "https://upcrealestate.com/wp-content/uploads/2023/10/1.jpg"
        ],
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
        virtualTourUrl: "https://my.matterport.com/show/?m=example",
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
        title: "Makai Residences",
        location: "capcana",
        locationLabel: "Cap Cana",
        type: "condo",
        status: "sale",
        price: 180500,
        image: "https://upcrealestate.com/wp-content/uploads/2025/03/12.jpg",
        beds: 2,
        baths: 2.5,
        area: 120,
        features: {
            en: ["Ocean View", "Beach Club", "Golf Course", "Marina", "Punta Espada Golf Access", "Juanillo Beach Nearby", "Scape Park Access", "24/7 Gated Security"],
            es: ["Vista al Mar", "Club de Playa", "Campo de Golf", "Marina", "Acceso Punta Espada Golf", "Cerca de Playa Juanillo", "Acceso Scape Park", "Seguridad 24/7"]
        },
        description: {
            en: "Exclusivity in Cap Cana with ocean views. A project designed to connect with nature without sacrificing modern luxury.",
            es: "Exclusividad en Cap Cana con vistas al océano. Un proyecto diseñado para conectar con la naturaleza sin renunciar al lujo moderno."
        },
        gallery: [
            "https://upcrealestate.com/wp-content/uploads/2025/03/12.jpg",
            "https://upcrealestate.com/wp-content/uploads/2025/03/Cityplace_desdepiscina1-scaled.jpg",
            "https://upcrealestate.com/wp-content/uploads/2023/12/1.jpg"
        ],
        coordinates: { lat: 18.4950, lng: -68.3735 }
    },
    {
        id: 3,
        title: "Royal Beach Villa",
        location: "bavaro",
        locationLabel: "Bávaro",
        type: "villa",
        status: "sale",
        price: 2500000,
        image: "https://upcrealestate.com/wp-content/uploads/2023/12/1.jpg",
        beds: 6,
        baths: 7,
        area: 850,
        features: {
            en: ["Beachfront", "Private Pool", "Home Cinema", "Private Chef"],
            es: ["Frente al Mar", "Piscina Privada", "Cine en Casa", "Chef Privado"]
        },
        description: {
            en: "Majestic beachfront villa in the best area of Bavaro beach. Italian finishes, complete domotics, and absolute privacy.",
            es: "Majestuosa villa frente al mar en la mejor zona de playa de Bávaro. Acabados italianos, domótica completa y privacidad absoluta."
        },
        gallery: [
            "https://upcrealestate.com/wp-content/uploads/2023/12/1.jpg",
            "https://upcrealestate.com/wp-content/uploads/2025/03/12.jpg",
            "https://upcrealestate.com/wp-content/uploads/2025/03/Cityplace_desdepiscina1-scaled.jpg"
        ],
        featured: true,
        coordinates: { lat: 18.6825, lng: -68.4110 }
    },
    {
        id: 4,
        title: "Cruise On Land",
        location: "puntacana",
        locationLabel: "Punta Cana",
        type: "condohotel",
        status: "sale",
        price: 71717,
        image: "https://upcrealestate.com/wp-content/uploads/2024/01/1.jpg",
        beds: 1,
        baths: 1,
        area: 45,
        features: {
            en: [
                "CONFOTUR Tax Exemption (15 Years No Property Tax)",
                "No 3% Title Transfer Tax",
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
                "Exención Fiscal CONFOTUR (15 años sin IPI)",
                "Sin Impuesto de Transferencia (3%)",
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
            en: "Discover the ultimate investment in the Caribbean's first theme park resort. Cruise On Land offers a revolutionary lifestyle concept with over 100 attractions. Benefit from CONFOTUR tax exemptions (no property tax for 15 years), 0% transfer tax, and a professional rental management pool designed for maximum passive income. Located strategicially just 15 minutes from the airport and 10 minutes from Downtown Punta Cana.",
            es: "Descubra la mejor inversión en el primer resort con parque temático del Caribe. Cruise On Land ofrece un concepto de estilo de vida revolucionario con más de 100 atracciones. Benefíciese de las exenciones fiscales de CONFOTUR (15 años sin IPI), 0% de impuesto de transferencia y un programa de gestión de alquileres diseñado para maximizar sus ingresos pasivos. Ubicado estratégicamente a solo 15 minutos del aeropuerto y 10 minutos de Downtown Punta Cana."
        },
        gallery: [
            "https://upcrealestate.com/wp-content/uploads/2024/01/1.jpg",
            "https://upcrealestate.com/wp-content/uploads/2023/12/1.jpg",
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop"
        ],
        coordinates: { lat: 18.5700, lng: -68.3600 }
    },
    {
        id: 5,
        title: "Cap Cana Sky Penthouse",
        location: "capcana",
        locationLabel: "Cap Cana",
        type: "penthouse",
        status: "sale",
        price: 1200000,
        image: "/images/property-penthouse-generated.png",
        beds: 3,
        baths: 3.5,
        area: 320,
        features: {
            en: ["Panoramic Terrace", "Jacuzzi", "Private Elevator", "Marina View", "Cap Cana Marina Access", "Fine Dining Nearby", "Punta Espada Golf", "Exclusive Beach Club"],
            es: ["Terraza Panorámica", "Jacuzzi", "Elevador Privado", "Marina View", "Acceso Marina Cap Cana", "Restaurantes de Lujo", "Golf Punta Espada", "Club de Playa Exclusivo"]
        },
        description: {
            en: "Panoramic views of the Cap Cana marina. This double-height penthouse defines tropical luxury with marble finishes and precious woods.",
            es: "Vistas panorámicas a la marina de Cap Cana. Este penthouse de doble altura define el lujo tropical con acabados de mármol y maderas preciosas."
        },
        featured: true
    },
    {
        id: 6,
        title: "Saona Private Estate",
        location: "laromana",
        locationLabel: "La Romana",
        type: "villa",
        status: "sale",
        price: 8500000,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
        beds: 8,
        baths: 10,
        area: 2500,
        features: {
            en: ["Heliport", "Private Dock", "Staff House", "Spa"],
            es: ["Heliipuerto", "Muelle Privado", "Staff House", "Spa"]
        },
        description: {
            en: "The jewel in the crown. A trophy property for the ultra-high-net-worth individual seeking total privacy and uncompromising exclusivity.",
            es: "La joya de la corona. Una propiedad trofeo para el ultra-high-net-worth individual que busca privacidad total y exclusividad sin compromisos."
        },
        featured: true
    },
    {
        id: 7,
        title: "Golf Garden Villa",
        location: "casacampo",
        locationLabel: "Casa de Campo",
        type: "villa",
        status: "sale",
        price: 1750000,
        image: "/images/golf-villa-generated.png",
        beds: 5,
        baths: 5.5,
        area: 600,
        features: {
            en: ["Golf Front", "Infinity Pool", "Gazebo", "Minitas Beach Access"],
            es: ["Golf Front", "Piscina Infinity", "Gazebo", "Acceso Playa Minitas"]
        },
        description: {
            en: "Located in the Caribbean's most prestigious resort. This villa offers direct views of the Teeth of the Dog golf course.",
            es: "Ubicada en el resort más prestigioso del Caribe. Esta villa ofrece vistas directas al campo de golf Teeth of the Dog."
        }
    },
    {
        id: 8,
        title: "Blue Lake Condo",
        location: "puntacana",
        locationLabel: "Punta Cana",
        type: "condo",
        status: "sale",
        price: 135000,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
        beds: 2,
        baths: 2,
        area: 95,
        features: {
            en: ["Artificial Lake", "Clubhouse", "Eco Trail", "Confotur"],
            es: ["Lago Artificial", "Casa Club", "Sendero Ecológico", "Confotur"]
        },
        description: {
            en: "Modern apartments surrounded by nature and a huge artificial lake. Close to the airport and main attractions.",
            es: "Apartamentos modernos rodeados de naturaleza y un inmenso lago artificial. Cerca del aeropuerto y de las principales atracciones."
        }
    },
    {
        id: 9,
        title: "Ocean Bay Luxury",
        location: "bavaro",
        locationLabel: "Bávaro",
        type: "penthouse",
        status: "sale",
        price: 890000,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        beds: 4,
        baths: 4,
        area: 280,
        features: {
            en: ["Beachfront", "Private Rooftop", "Hotel Service", "Gym"],
            es: ["Primera Línea", "Rooftop Privado", "Hotel Service", "Gym"]
        },
        description: {
            en: "The most exclusive project in Bavaro Beach. 5-star luxury with hotel service and top quality finishes.",
            es: "El proyecto más exclusivo de Playa Bávaro. Lujo 5 estrellas con servicio hotelero y terminaciones de primera calidad."
        },
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
        title: "Lote Residencial Cap Cana",
        location: "capcana",
        locationLabel: "Cap Cana",
        type: "land",
        status: "sale",
        price: 450000,
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2232&auto=format&fit=crop",
        beds: 0,
        baths: 0,
        area: 2500,
        features: {
            en: ["Residential Use", "Near Golf", "Private Security", "Underground Services", "Punta Espada Golf Views", "Los Establos Equestrian City", "Scape Park Adventure"],
            es: ["Uso Residencial", "Cerca del Golf", "Seguridad Privada", "Servicios Soterrados", "Vistas Golf Punta Espada", "Los Establos Ciudad Ecuestre", "Aventura Scape Park"]
        },
        description: {
            en: "Large lot ready to build the villa of your dreams in one of the most exclusive communities in the Caribbean.",
            es: "Amplio terreno listo para construir la villa de tus sueños en una de las comunidades más exclusivas del Caribe."
        }
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
        price: 3500000,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
        beds: 0,
        baths: 0,
        area: 50000,
        features: {
            en: ["Beachfront", "Tourism Vocation", "Tax Incentives", "Road Access"],
            es: ["Primera Línea de Playa", "Vocación Turística", "Incentivos Fiscales", "Acceso Carretera"]
        },
        description: {
            en: "Unique opportunity for hotel development in the new tourist hub of Miches. 500 linear meters of virgin beach.",
            es: "Oportunidad única para desarrollo hotelero en el nuevo polo turístico de Miches. 500 metros lineales de playa virgen."
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
    }
];
