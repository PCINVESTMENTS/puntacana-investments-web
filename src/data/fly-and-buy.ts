export interface FlyAndBuyProgram {
    slug: string;
    title: { es: string; en: string };
    subtitle: { es: string; en: string };
    heroImage: string;
    description: { es: string; en: string };
    duration: { es: string; en: string };
    features: { es: string; en: string }[];
    priceDetails: { es: string; en: string };
    idealFor: { es: string; en: string };
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
        features: [
            { es: "Alojamiento en hotel seleccionado o propiedad modelo", en: "Accommodation in selected hotel or model property" },
            { es: "Asesor inmobiliario asignado durante toda la visita", en: "Assigned real estate advisor throughout the visit" },
            { es: "Recorrido por la zona y proyectos de interés", en: "Tour of the area and projects of interest" },
            { es: "Presentación corporativa y legal", en: "Corporate and legal presentation" }
        ],
        priceDetails: {
            es: "El cliente cubre vuelo y hospedaje. En caso de compra, parte del costo puede ser descontado.",
            en: "Client covers flight and lodging. If a purchase is made, part of the cost may be deducted."
        },
        idealFor: {
            es: "Clientes que visitan el país por primera vez.",
            en: "First-time visitors to the country."
        }
    },
    {
        slug: "premium",
        title: { es: "Fly & Buy Premium", en: "Fly & Buy Premium" },
        subtitle: { es: "Decisión, experiencia y cierre", en: "Decision, Experience, and Closing" },
        heroImage: "/images/fly-and-buy/premium.jpg",
        description: {
            es: "Diseñado para clientes altamente calificados, con clara intención de compra, que desean vivir una experiencia completa y cerrar la inversión.",
            en: "Designed for highly qualified clients with clear purchase intent who wish to live a complete experience and close the investment."
        },
        duration: { es: "4 días / 3 noches", en: "4 Days / 3 Nights" },
        features: [
            { es: "Alojamiento premium en hotel superior", en: "Premium accommodation in superior hotel" },
            { es: "Atención VIP con traslados coordinados", en: "VIP service with coordinated transfers" },
            { es: "Visitas privadas y análisis comparativo", en: "Private visits and comparative analysis" },
            { es: "Soporte legal y administrativo para cierre", en: "Legal and administrative support for closing" }
        ],
        priceDetails: {
            es: "El cliente cubre gastos. En caso de compra, costo descontado parcial o totalmente.",
            en: "Client covers expenses. If purchased, cost partially or fully deducted."
        },
        idealFor: {
            es: "Inversionistas decididos y compradores de alto valor.",
            en: "Decided investors and high-value buyers."
        }
    }
];
