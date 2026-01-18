export interface FlyAndBuyProgram {
    slug: string;
    title: { es: string; en: string };
    subtitle: { es: string; en: string };
    heroImage: string;
    description: { es: string; en: string };
    duration: { es: string; en: string };
    includes: {
        title: { es: string; en: string };
        items: { es: string; en: string }[];
        icon?: string;
    }[];
    conditions: {
        clientCovers: { es: string; en: string }[];
        purchaseBenefit: { es: string; en: string };
        refundPolicy: { es: string; en: string };
    };
    idealFor: { es: string; en: string }[];
}

export const flyAndBuyPrograms: FlyAndBuyProgram[] = [
    {
        slug: "basic",
        title: { es: "Fly & Buy Básico", en: "Fly & Buy Basic" },
        subtitle: { es: "Exploración, validación y confianza", en: "Exploration, Validation, and Confidence" },
        heroImage: "/images/fly-and-buy/basic.jpg",
        description: {
            es: "Diseñado para clientes que están interesados, pero aún se encuentran en una fase de exploración y confirmación del destino, la zona y la empresa.",
            en: "Designed for clients who are interested but still in an exploration phase, confirming the destination, the area, and the company."
        },
        duration: { es: "3 días / 2 noches", en: "3 Days / 2 Nights" },
        includes: [
            {
                title: { es: "Alojamiento", en: "Accommodation" },
                items: [
                    { es: "Hotel seleccionado o propiedad modelo", en: "Selected hotel or model property" },
                    { es: "Ubicación estratégica según el proyecto de interés", en: "Strategic location according to the project of interest" }
                ],
                icon: "hotel"
            },
            {
                title: { es: "Acompañamiento personalizado", en: "Personalized Accompaniment" },
                items: [
                    { es: "Recepción por el equipo de Punta Cana Investments", en: "Reception by the Punta Cana Investments team" },
                    { es: "Asesor inmobiliario asignado durante toda la visita", en: "Assigned real estate advisor throughout the visit" }
                ],
                icon: "handshake"
            },
            {
                title: { es: "Recorridos inmobiliarios", en: "Real Estate Tours" },
                items: [
                    { es: "Visita a propiedades y proyectos de interés", en: "Visit to properties and projects of interest" },
                    { es: "Recorrido por la zona donde se ubican los inmuebles", en: "Tour of the area where the properties are located" }
                ],
                icon: "building"
            },
            {
                title: { es: "Conocimiento del entorno", en: "Area Knowledge" },
                items: [
                    { es: "Playas cercanas", en: "Nearby beaches" },
                    { es: "Áreas comerciales y Restaurantes", en: "Commercial areas and Restaurants" },
                    { es: "Hospitales, servicios y accesos", en: "Hospitals, services, and access" }
                ],
                icon: "map"
            },
            {
                title: { es: "Presentación corporativa", en: "Corporate Presentation" },
                items: [
                    { es: "Quién es Punta Cana Investments", en: "Who is Punta Cana Investments" },
                    { es: "Estructura, experiencia y modelo de negocio", en: "Structure, experience, and business model" },
                    { es: "Proceso de compra y seguridad legal", en: "Purchase process and legal security" }
                ],
                icon: "briefcase"
            }
        ],
        conditions: {
            clientCovers: [
                { es: "Vuelo", en: "Flight" },
                { es: "Hospedaje", en: "Lodging" },
                { es: "Gastos personales", en: "Personal expenses" }
            ],
            purchaseBenefit: {
                es: "Puede ser descontado del precio final, según el valor de la propiedad.",
                en: "Can be deducted from the final price, depending on the property value."
            },
            refundPolicy: {
                es: "No reembolsable si no se concreta la compra.",
                en: "Non-refundable if the purchase is not finalized."
            }
        },
        idealFor: [
            { es: "Clientes que visitan el país por primera vez", en: "First-time visitors to the country" },
            { es: "Compradores en etapa de evaluación", en: "Buyers in the evaluation stage" },
            { es: "Inversionistas que desean 'ver para creer' antes de decidir", en: "Investors who want to 'see to believe' before deciding" }
        ]
    },
    {
        slug: "premium",
        title: { es: "Fly & Buy Premium", en: "Fly & Buy Premium" },
        subtitle: { es: "Decisión, experiencia y cierre", en: "Decision, Experience, and Closing" },
        heroImage: "/images/fly-and-buy/premium.jpg",
        description: {
            es: "Diseñado para clientes altamente calificados, con clara intención de compra, que desean vivir una experiencia completa, confirmar su decisión y cerrar la inversión durante la visita.",
            en: "Designed for highly qualified clients with clear purchase intent who wish to live a complete experience, confirm their decision, and close the investment during the visit."
        },
        duration: { es: "4 días / 3 noches", en: "4 Days / 3 Nights" },
        includes: [
            {
                title: { es: "Alojamiento premium", en: "Premium Accommodation" },
                items: [
                    { es: "Hotel superior o propiedad modelo de alto nivel", en: "Superior hotel or high-end model property" },
                    { es: "Ubicación alineada al perfil de inversión del cliente", en: "Location aligned with the client's investment profile" }
                ],
                icon: "hotel"
            },
            {
                title: { es: "Atención VIP", en: "VIP Attention" },
                items: [
                    { es: "Traslados coordinados", en: "Coordinated transfers" },
                    { es: "Asesor senior dedicado durante toda la estadía", en: "Senior advisor dedicated throughout the stay" }
                ],
                icon: "car"
            },
            {
                title: { es: "Recorridos inmobiliarios avanzados", en: "Advanced Real Estate Tours" },
                items: [
                    { es: "Visitas privadas a proyectos y propiedades seleccionadas", en: "Private visits to selected projects and properties" },
                    { es: "Análisis comparativo de opciones", en: "Comparative analysis of options" },
                    { es: "Enfoque en retorno, plusvalía y uso", en: "Focus on return, appreciation, and use" }
                ],
                icon: "chart"
            },
            {
                title: { es: "Experiencia completa del destino", en: "Complete Destination Experience" },
                items: [
                    { es: "Visita a zonas clave de Punta Cana y alrededores", en: "Visit to key areas of Punta Cana and surroundings" },
                    { es: "Entorno real del estilo de vida como propietario", en: "Real environment of the lifestyle as an owner" }
                ],
                icon: "star"
            },
            {
                title: { es: "Presentación corporativa avanzada", en: "Advanced Corporate Presentation" },
                items: [
                    { es: "Estructura legal y Proceso de compra detallado", en: "Legal structure and detailed purchase process" },
                    { es: "Acompañamiento postventa y Escenarios de inversión", en: "After-sales support and investment scenarios" }
                ],
                icon: "briefcase"
            },
            {
                title: { es: "Soporte para cierre", en: "Closing Support" },
                items: [
                    { es: "Preparación de documentación", en: "Documentation preparation" },
                    { es: "Acompañamiento en reserva o firma inicial", en: "Support in reservation or initial signing" },
                    { es: "Coordinación legal y administrativa", en: "Legal and administrative coordination" }
                ],
                icon: "pen"
            }
        ],
        conditions: {
            clientCovers: [
                { es: "Vuelo", en: "Flight" },
                { es: "Hospedaje", en: "Lodging" },
                { es: "Gastos personales", en: "Personal expenses" }
            ],
            purchaseBenefit: {
                es: "Ser descontado parcial o totalmente del precio final, dependiendo del monto de la inversión.",
                en: "Partially or fully deducted from the final price, depending on the investment amount."
            },
            refundPolicy: {
                es: "No reembolsable si no se concreta la compra.",
                en: "Non-refundable if the purchase is not finalized."
            }
        },
        idealFor: [
            { es: "Inversionistas decididos", en: "Decided investors" },
            { es: "Compradores de propiedades de mayor valor", en: "Buyers of higher value properties" },
            { es: "Clientes que desean cerrar con seguridad y acompañamiento completo", en: "Clients who want to close with security and complete support" }
        ]
    }
];

export const flyAndBuyComparison = {
    headers: {
        feature: { es: "Característica", en: "Feature" },
        basic: { es: "Básico", en: "Basic" },
        premium: { es: "Premium", en: "Premium" }
    },
    rows: [
        { feature: { es: "Objetivo", en: "Objective" }, basic: { es: "Explorar", en: "Explore" }, premium: { es: "Decidir", en: "Decide" } },
        { feature: { es: "Duración", en: "Duration" }, basic: { es: "3D / 2N", en: "3D / 2N" }, premium: { es: "4D / 3N", en: "4D / 3N" } },
        { feature: { es: "Nivel de atención", en: "Attention Level" }, basic: { es: "Personalizada", en: "Personalized" }, premium: { es: "VIP", en: "VIP" } },
        { feature: { es: "Enfoque", en: "Focus" }, basic: { es: "Conocer y validar", en: "Know and validate" }, premium: { es: "Cerrar inversión", en: "Close investment" } },
        { feature: { es: "Reembolso/descuento", en: "Refund/Discount" }, basic: { es: "Parcial", en: "Partial" }, premium: { es: "Parcial o total", en: "Partial or total" } },
        { feature: { es: "Perfil", en: "Profile" }, basic: { es: "Evaluación", en: "Evaluation" }, premium: { es: "Alta intención", en: "High intent" } }
    ]
};
