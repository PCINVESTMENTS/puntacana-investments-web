export interface FlyAndBuyProgram {
    slug: string;
    title: { es: string; en: string; fr: string };
    subtitle: { es: string; en: string; fr: string };
    heroImage: string;
    description: { es: string; en: string; fr: string };
    duration: { es: string; en: string; fr: string };
    includes: {
        title: { es: string; en: string; fr: string };
        items: { es: string; en: string; fr: string }[];
        icon?: string;
    }[];
    conditions: {
        clientCovers: { es: string; en: string; fr: string }[];
        purchaseBenefit: { es: string; en: string; fr: string };
        refundPolicy: { es: string; en: string; fr: string };
    };
    idealFor: { es: string; en: string; fr: string }[];
}

export const flyAndBuyPrograms: FlyAndBuyProgram[] = [
    {
        slug: "basic",
        title: { es: "Fly & Buy Básico", en: "Fly & Buy Basic", fr: "Fly & Buy Basique" },
        subtitle: { es: "Exploración, validación y confianza", en: "Exploration, Validation, and Confidence", fr: "Exploration, validation et confiance" },
        heroImage: "/images/fly-and-buy/basic.jpg",
        description: {
            es: "Diseñado para clientes que están interesados, pero aún se encuentran en una fase de exploración y confirmación del destino, la zona y la empresa.",
            en: "Designed for clients who are interested but still in an exploration phase, confirming the destination, the area, and the company.",
            fr: "Conçu pour les clients intéressés, mais qui en sont encore à une phase d'exploration et de validation de la destination, de la région et de l'entreprise."
        },
        duration: { es: "3 días / 2 noches", en: "3 Days / 2 Nights", fr: "3 jours / 2 nuits" },
        includes: [
            {
                title: { es: "Alojamiento", en: "Accommodation", fr: "Hébergement" },
                items: [
                    { es: "Hotel seleccionado o propiedad modelo", en: "Selected hotel or model property", fr: "Hôtel sélectionné ou propriété modèle" },
                    { es: "Ubicación estratégica según el proyecto de interés", en: "Strategic location according to the project of interest", fr: "Emplacement stratégique selon le projet d'intérêt" }
                ],
                icon: "hotel"
            },
            {
                title: { es: "Acompañamiento personalizado", en: "Personalized Accompaniment", fr: "Accompagnement personnalisé" },
                items: [
                    { es: "Recepción por el equipo de Punta Cana Investments", en: "Reception by the Punta Cana Investments team", fr: "Réception par l'équipe de Punta Cana Investments" },
                    { es: "Asesor inmobiliario asignado durante toda la visita", en: "Assigned real estate advisor throughout the visit", fr: "Conseiller immobilier attribué pendant toute la visite" }
                ],
                icon: "handshake"
            },
            {
                title: { es: "Recorridos inmobiliarios", en: "Real Estate Tours", fr: "Visites immobilières" },
                items: [
                    { es: "Visita a propiedades y proyectos de interés", en: "Visit to properties and projects of interest", fr: "Visite des propriétés et des projets d'intérêt" },
                    { es: "Recorrido por la zona donde se ubican los inmuebles", en: "Tour of the area where the properties are located", fr: "Visite de la zone où se situent les propriétés" }
                ],
                icon: "building"
            },
            {
                title: { es: "Conocimiento del entorno", en: "Area Knowledge", fr: "Connaissance de la région" },
                items: [
                    { es: "Playas cercanas", en: "Nearby beaches", fr: "Plages à proximité" },
                    { es: "Áreas comerciales y Restaurantes", en: "Commercial areas and Restaurants", fr: "Zones commerciales et restaurants" },
                    { es: "Hospitales, servicios y accesos", en: "Hospitals, services, and access", fr: "Hôpitaux, services et accès" }
                ],
                icon: "map"
            },
            {
                title: { es: "Presentación corporativa", en: "Corporate Presentation", fr: "Présentation de l'entreprise" },
                items: [
                    { es: "Quién es Punta Cana Investments", en: "Who is Punta Cana Investments", fr: "Qui est Punta Cana Investments" },
                    { es: "Estructura, experiencia y modelo de negocio", en: "Structure, experience, and business model", fr: "Structure, expérience et modèle d'affaires" },
                    { es: "Proceso de compra y seguridad legal", en: "Purchase process and legal security", fr: "Processus d'achat et sécurité juridique" }
                ],
                icon: "briefcase"
            }
        ],
        conditions: {
            clientCovers: [
                { es: "Vuelo", en: "Flight", fr: "Vol" },
                { es: "Hospedaje", en: "Lodging", fr: "Hébergement" },
                { es: "Gastos personales", en: "Personal expenses", fr: "Dépenses personnelles" }
            ],
            purchaseBenefit: {
                es: "Puede ser descontado del precio final, según el valor de la propiedad.",
                en: "Can be deducted from the final price, depending on the property value.",
                fr: "Peut être déduit du prix final, selon la valeur de la propriété."
            },
            refundPolicy: {
                es: "No reembolsable si no se concreta la compra.",
                en: "Non-refundable if the purchase is not finalized.",
                fr: "Non remboursable si l'achat n'est pas finalisé."
            }
        },
        idealFor: [
            { es: "Clientes que visitan el país por primera vez", en: "First-time visitors to the country", fr: "Clients visitant le pays pour la première fois" },
            { es: "Compradores en etapa de evaluación", en: "Buyers in the evaluation stage", fr: "Acheteurs en phase d'évaluation" },
            { es: "Inversionistas que desean 'ver para creer' antes de decidir", en: "Investors who want to 'see to believe' before deciding", fr: "Investisseurs souhaitant 'voir pour y croire' avant de decidir" }
        ]
    },
    {
        slug: "premium",
        title: { es: "Fly & Buy Premium", en: "Fly & Buy Premium", fr: "Fly & Buy Premium" },
        subtitle: { es: "Decisión, experiencia y cierre", en: "Decision, Experience, and Closing", fr: "Décision, expérience et clôture" },
        heroImage: "/images/fly-and-buy/premium.jpg",
        description: {
            es: "Diseñado para clientes altamente calificados, con clara intención de compra, que desean vivir una experiencia completa, confirmar su decisión y cerrar la inversión durante la visita.",
            en: "Designed for highly qualified clients with clear purchase intent who wish to live a complete experience, confirm their decision, and close the investment during the visit.",
            fr: "Conçu pour les clients hautement qualifiés, avec une intention d'achat claire, qui souhaitent vivre une expérience complète, confirmer leur décision et finaliser leur investissement pendant la visite."
        },
        duration: { es: "4 días / 3 noches", en: "4 Days / 3 Nights", fr: "4 jours / 3 nuits" },
        includes: [
            {
                title: { es: "Alojamiento premium", en: "Premium Accommodation", fr: "Hébergement de luxe" },
                items: [
                    { es: "Hotel superior o propiedad modelo de alto nivel", en: "Superior hotel or high-end model property", fr: "Hôtel supérieur ou propriété modèle haut de gamme" },
                    { es: "Ubicación alineada al perfil de inversión del cliente", en: "Location aligned with the client's investment profile", fr: "Emplacement aligné sur le profil d'investissement du client" }
                ],
                icon: "hotel"
            },
            {
                title: { es: "Atención VIP", en: "VIP Attention", fr: "Service VIP" },
                items: [
                    { es: "Traslados coordinados", en: "Coordinated transfers", fr: "Transferts coordonnés" },
                    { es: "Asesor senior dedicado durante toda la estadía", en: "Senior advisor dedicated throughout the stay", fr: "Conseiller senior dédié pendant toute la durée du séjour" }
                ],
                icon: "car"
            },
            {
                title: { es: "Recorridos inmobiliarios avanzados", en: "Advanced Real Estate Tours", fr: "Visites immobilières avancées" },
                items: [
                    { es: "Visitas privadas a proyectos y propiedades seleccionadas", en: "Private visits to selected projects and properties", fr: "Visites privées de projets et propriétés sélectionnés" },
                    { es: "Análisis comparativo de opciones", en: "Comparative analysis of options", fr: "Analyse comparative des options" },
                    { es: "Enfoque en retorno, plusvalía y uso", en: "Focus on return, appreciation, and use", fr: "Focus sur le rendement, la plus-value et l'usage" }
                ],
                icon: "chart"
            },
            {
                title: { es: "Experiencia completa del destino", en: "Complete Destination Experience", fr: "Expérience complète de la destination" },
                items: [
                    { es: "Visita a zonas clave de Punta Cana y alrededores", en: "Visit to key areas of Punta Cana and surroundings", fr: "Visite des zones clés de Punta Cana et de ses environs" },
                    { es: "Entorno real del estilo de vida como propietario", en: "Real environment of the lifestyle as an owner", fr: "Environnement réel du style de vie en tant que propriétaire" }
                ],
                icon: "star"
            },
            {
                title: { es: "Presentación corporativa avanzada", en: "Advanced Corporate Presentation", fr: "Présentation d'entreprise avancée" },
                items: [
                    { es: "Estructura legal y Proceso de compra detallado", en: "Legal structure and detailed purchase process", fr: "Structure juridique et processus d'achat détaillé" },
                    { es: "Acompañamiento postventa y Escenarios de inversión", en: "After-sales support and investment scenarios", fr: "Accompagnement après-vente et scénarios d'investissement" }
                ],
                icon: "briefcase"
            },
            {
                title: { es: "Soporte para cierre", en: "Closing Support", fr: "Soutien pour la clôture" },
                items: [
                    { es: "Preparación de documentación", en: "Documentation preparation", fr: "Préparation des documents" },
                    { es: "Acompañamiento en reserva o firma inicial", en: "Support in reservation or initial signing", fr: "Accompagnement lors de la réservation ou signature initiale" },
                    { es: "Coordinación legal y administrativa", en: "Legal and administrative coordination", fr: "Coordination juridique et administrative" }
                ],
                icon: "pen"
            }
        ],
        conditions: {
            clientCovers: [
                { es: "Vuelo", en: "Flight", fr: "Vol" },
                { es: "Hospedaje", en: "Lodging", fr: "Hébergement" },
                { es: "Gastos personales", en: "Personal expenses", fr: "Dépenses personnelles" }
            ],
            purchaseBenefit: {
                es: "Ser descontado parcial o totalmente del precio final, dependiendo del monto de la inversión.",
                en: "Partially or fully deducted from the final price, depending on the investment amount.",
                fr: "Peut être déduit partiellement ou totalement du prix final, selon le montant de l'investissement."
            },
            refundPolicy: {
                es: "No reembolsable si no se concreta la compra.",
                en: "Non-refundable if the purchase is not finalized.",
                fr: "Non remboursable si l'achat n'est pas finalisé."
            }
        },
        idealFor: [
            { es: "Inversionistas decididos", en: "Decided investors", fr: "Investisseurs décidés" },
            { es: "Compradores de propiedades de mayor valor", en: "Buyers of higher value properties", fr: "Acheteurs de propriétés de grande valeur" },
            { es: "Clientes que desean cerrar con seguridad y acompañamiento completo", en: "Clients who want to close with security and complete support", fr: "Clients souhaitant clôturer en toute sécurité et avec un accompagnement complet" }
        ]
    }
];

export const flyAndBuyComparison = {
    headers: {
        feature: { es: "Característica", en: "Feature", fr: "Caractéristique" },
        basic: { es: "Básico", en: "Basic", fr: "Basique" },
        premium: { es: "Premium", en: "Premium", fr: "Premium" }
    },
    rows: [
        { feature: { es: "Objetivo", en: "Objective", fr: "Objectif" }, basic: { es: "Explorar", en: "Explore", fr: "Explorer" }, premium: { es: "Decidir", en: "Decide", fr: "Décider" } },
        { feature: { es: "Duración", en: "Duration", fr: "Durée" }, basic: { es: "3D / 2N", en: "3D / 2N", fr: "3J / 2N" }, premium: { es: "4D / 3N", en: "4D / 3N", fr: "4J / 3N" } },
        { feature: { es: "Nivel de atención", en: "Attention Level", fr: "Niveau d'attention" }, basic: { es: "Personalizada", en: "Personalized", fr: "Personnalisé" }, premium: { es: "VIP", en: "VIP", fr: "VIP" } },
        { feature: { es: "Enfoque", en: "Focus", fr: "Approche" }, basic: { es: "Conocer y validar", en: "Know and validate", fr: "Connaître et valider" }, premium: { es: "Cerrar inversión", en: "Close investment", fr: "Finaliser l'investissement" } },
        { feature: { es: "Reembolso/descuento", en: "Refund/Discount", fr: "Remboursement/Remise" }, basic: { es: "Parcial", en: "Partial", fr: "Partiel" }, premium: { es: "Parcial o total", en: "Partial or total", fr: "Partiel ou total" } },
        { feature: { es: "Perfil", en: "Profile", fr: "Profil" }, basic: { es: "Evaluación", en: "Evaluation", fr: "Évaluation" }, premium: { es: "Alta intención", en: "High intent", fr: "Forte intention" } }
    ]
};
