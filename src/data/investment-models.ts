
export interface InvestmentModel {
    slug: string;
    title: { es: string; en: string };
    heroImage: string;
    description: { es: string; en: string };
    longDescription: { es: string; en: string };
    keyBenefits: { icon?: string; title: { es: string; en: string }; text: { es: string; en: string } }[];
    roiStats: { value: string; label: { es: string; en: string } }[];
    contentSections: {
        title: { es: string; en: string };
        text: { es: string; en: string };
        image: string;
    }[];
}

export const investmentModels: InvestmentModel[] = [
    {
        slug: "pre-construction",
        title: { es: "Proyectos en Pre-construcción", en: "Pre-construction Projects" },
        heroImage: "/images/og-home-luxury.jpg",
        description: {
            es: "Maximice su plusvalía entrando en el momento cero. Comprar en planos es la estrategia número uno para obtener rendimientos inmediatos.",
            en: "Maximize appreciation by entering at ground zero. Buying off-plan is the number one strategy for immediate returns."
        },
        longDescription: {
            es: "La inversión inmobiliaria en pre-construcción ofrece una ventaja matemática simple: se compra al precio actual y se toma posesión de una propiedad valorada al precio futuro del mercado, capturando toda la apreciación durante el período de construcción. En Punta Cana, esta apreciación suele oscilar entre el 15% y el 25% antes de la entrega de llaves.",
            en: "Pre-construction real estate investment offers a simple mathematical advantage: you buy at current prices and take possession of a property valued at future market prices, capturing all appreciation during the construction period. In Punta Cana, this appreciation typically ranges between 15% and 25% before key delivery."
        },
        keyBenefits: [
            {
                title: { es: "Plusvalía Garantizada", en: "Guaranteed Appreciation" },
                text: { es: "Gane equidad instantánea a medida que avanza la construcción y suben los precios de lista.", en: "Gain instant equity as construction progresses and list prices rise." }
            },
            {
                title: { es: "Pagos Flexibles", en: "Flexible Payments" },
                text: { es: "Pague el inicial en cuotas mensuales sin intereses durante la construcción.", en: "Pay the down payment in interest-free monthly installments during construction." }
            },
            {
                title: { es: "Primera Selección", en: "Prime Selection" },
                text: { es: "Elija las mejores unidades (vistas, pisos altos) antes que el mercado general.", en: "Choose the best units (views, high floors) before the general market." }
            }
        ],
        roiStats: [
            { value: "15-25%", label: { es: "Plusvalía Media al Cierre", en: "Avg. Appreciation at Closing" } },
            { value: "0%", label: { es: "Interés durante Construcción", en: "Interest during Construction" } },
            { value: "100%", label: { es: "Selección Premium", en: "Premium Selection" } }
        ],
        contentSections: [
            {
                title: { es: "El Poder de Comprar Temprano", en: "The Power of Buying Early" },
                text: {
                    es: "Los desarrolladores ofrecen precios de 'Lista Cero' o 'Friends & Family' para financiar el inicio de obra. Al entrar aquí, usted está comprando al costo más bajo posible. A medida que se venden unidades y se construye, el desarrollador sube los precios gradualmente.",
                    en: "Developers offer 'Zero List' or 'Friends & Family' prices to fund the start of work. By entering here, you are buying at the lowest possible cost. As units are sold and construction progresses, the developer gradually raises prices."
                },
                image: "/images/og-home-luxury.jpg"
            }
        ]
    },
    {
        slug: "vacation-villas",
        title: { es: "Villas Premium Vacacionales", en: "Premium Vacation Villas" },
        heroImage: "/images/og-home-luxury.jpg",
        description: {
            es: "El pináculo del lujo y la rentabilidad. Propiedades exclusivas diseñadas para el mercado de alquiler a corto plazo de alto nivel.",
            en: "The pinnacle of luxury and profitability. Exclusive properties designed for the high-end short-term rental market."
        },
        longDescription: {
            es: "Las villas privadas en Punta Cana representan el activo más deseado para grupos familiares y viajeros de lujo. A diferencia de un apartamento, una villa ofrece privacidad total, piscinas privadas y espacios amplios, lo que permite cobrar tarifas por noche significativamente más altas.",
            en: "Private villas in Punta Cana represent the most desired asset for family groups and luxury travelers. Unlike an apartment, a villa offers total privacy, private pools, and ample spaces, allowing significantly higher nightly rates."
        },
        keyBenefits: [
            {
                title: { es: "Altos Ingresos Diarios", en: "High Daily Income" },
                text: { es: "Tarifas por noche superiores a $500-$1,000 USD en temporada alta.", en: "Nightly rates exceeding $500-$1,000 USD in high season." }
            },
            {
                title: { es: "Uso Personal Flexible", en: "Flexible Personal Use" },
                text: { es: "Disfrute de su propiedad cuando quiera y réntela cuando no la use.", en: "Enjoy your property whenever you want and rent it when you don't use it." }
            }
        ],
        roiStats: [
            { value: "8-12%", label: { es: "Retorno Neto Anual", en: "Net Annual Return" } },
            { value: "$750+", label: { es: "Tarifa Promedio Noche", en: "Avg. Nightly Rate" } }
        ],
        contentSections: [
            {
                title: { es: "Diseño Pensado para la Renta", en: "Design Built for Rental" },
                text: {
                    es: "Nuestras villas se seleccionan o construyen pensando en el huésped: habitaciones con baño privado (ensuite), áreas sociales abiertas y mantenimiento eficiente para maximizar las reseñas de 5 estrellas.",
                    en: "Our villas are selected or built with the guest in mind: ensuite bedrooms, open social areas, and efficient maintenance to maximize 5-star reviews."
                },
                image: "/images/og-home-luxury.jpg"
            }
        ]
    },
    {
        slug: "rent-pool",
        title: { es: "Rent Pool / Condo-Hotel", en: "Rent Pool / Condo-Hotel" },
        heroImage: "/images/og-home-luxury.jpg",
        description: {
            es: "Inversión sin preocupaciones. Entregue las llaves a un operador hotelero profesional y reciba sus dividendos trimestralmente.",
            en: "Worry-free investment. Hand the keys to a professional hotel operator and receive your dividends quarterly."
        },
        longDescription: {
            es: "El modelo Condo-Hotel convierte su propiedad en una suite de hotel de lujo. Un operador centralizado se encarga de todo: marketing, check-in, limpieza, mantenimiento y atención al huésped. Los ingresos de todas las unidades se agrupan (pool) y se distribuyen entre los propietarios según un coeficiente, garantizando ingresos incluso si su unidad específica no se alquiló esa noche.",
            en: "The Condo-Hotel model turns your property into a luxury hotel suite. A centralized operator handles everything: marketing, check-in, cleaning, maintenance, and guest services. Revenue from all units is pooled and distributed among owners based on a coefficient, guaranteeing income even if your specific unit wasn't rented that night."
        },
        keyBenefits: [
            {
                title: { es: "Gestión 100% Pasiva", en: "100% Passive Management" },
                text: { es: "Cero llamadas de mantenimiento, cero manejo de huéspedes. Solo reciba su depósito.", en: "Zero maintenance calls, zero guest handling. Just receive your deposit." }
            },
            {
                title: { es: "Mantenimiento Impecable", en: "Impeccable Maintenance" },
                text: { es: "La unidad se mantiene en estándares hoteleros constantemente para preservar su valor.", en: "The unit is consistently maintained to hotel standards to preserve its value." }
            }
        ],
        roiStats: [
            { value: "6-10%", label: { es: "Retorno Estable", en: "Stable Return" } },
            { value: "0", label: { es: "Horas de Trabajo Requeridas", en: "Work Hours Required" } }
        ],
        contentSections: [
            {
                title: { es: "La Fuerza de una Marca", en: "The Power of a Brand" },
                text: {
                    es: "Al invertir en proyectos respaldados por cadenas hoteleras o grandes operadores, usted se beneficia de sus canales de distribución globales y programas de lealtad, asegurando ocupaciones más altas que un Airbnb individual.",
                    en: "By investing in projects backed by hotel chains or major operators, you benefit from their global distribution channels and loyalty programs, ensuring higher occupancy than an individual Airbnb."
                },
                image: "/images/og-home-luxury.jpg"
            }
        ]
    },
    {
        slug: "development-participation",
        title: { es: "Participación en Desarrollos", en: "Development Participation" },
        heroImage: "/images/og-home-luxury.jpg",
        description: {
            es: "Conviértase en socio, no solo en propietario. Invierta capital directamente en la empresa desarrolladora a cambio de acciones y altos rendimientos.",
            en: "Become a partner, not just an owner. Invest capital directly in the development company in exchange for shares and high returns."
        },
        longDescription: {
            es: "Para el inversionista sofisticado, ofrecemos la oportunidad de entrar en la estructura de capital (Equity) de nuevos desarrollos. En lugar de comprar una unidad, usted compra una participación del proyecto completo, beneficiándose de las ganancias netas de la venta de todas las unidades.",
            en: "For the sophisticated investor, we offer the opportunity to enter the capital structure (Equity) of new developments. Instead of buying a unit, you buy a share of the entire project, benefiting from the net profits of the sale of all units."
        },
        keyBenefits: [
            {
                title: { es: "Rentabilidad Superior", en: "Superior Profitability" },
                text: { es: "Los retornos sobre Equity suelen superar el 20-30% anualizado.", en: "Returns on Equity typically exceed 20-30% annualized." }
            },
            {
                title: { es: "Respaldo Corporativo", en: "Corporate Backing" },
                text: { es: "Inversión asegurada por los activos inmobiliarios subyacentes.", en: "Investment secured by the underlying real estate assets." }
            }
        ],
        roiStats: [
            { value: "20%+", label: { es: "Retorno sobre Inversión", en: "Return on Investment" } },
            { value: "24-36", label: { es: "Meses de Plazo Promedio", en: "Avg. Term Months" } }
        ],
        contentSections: []
    },
    {
        slug: "passive-investments",
        title: { es: "Inversiones Pasivas", en: "Passive Investments" },
        heroImage: "/images/og-home-luxury.jpg",
        description: {
            es: "Instrumentos de deuda privada con retorno fijo garantizado, respaldados por garantías hipotecarias.",
            en: "Private debt instruments with guaranteed fixed returns, backed by mortgage collateral."
        },
        longDescription: {
            es: "Si prefiere seguridad y previsibilidad sobre especulación, nuestros modelos de deuda privada le permiten prestar capital a proyectos en desarrollo a una tasa de interés fija, pagadera mensual o trimestralmente, con la propiedad como colateral.",
            en: "If you prefer security and predictability over speculation, our private debt models allow you to lend capital to development projects at a fixed interest rate, payable monthly or quarterly, with the property as collateral."
        },
        keyBenefits: [
            {
                title: { es: "Ingreso Fijo Predecible", en: "Predictable Fixed Income" },
                text: { es: "Sepa exactamente cuánto ganará desde el primer día.", en: "Know exactly how much you will earn from day one." }
            }
        ],
        roiStats: [
            { value: "10-12%", label: { es: "Interés Fijo Anual", en: "Fixed Annual Interest" } },
            { value: "Bajo", label: { es: "Nivel de Riesgo", en: "Risk Level" } }
        ],
        contentSections: []
    },
    {
        slug: "strategic-buy-resale",
        title: { es: "Compra y Reventa Estratégica", en: "Strategic Buy & Resale" },
        heroImage: "/images/og-home-luxury.jpg",
        description: {
            es: "Detectar valor oculto, renovar y vender (Flipping). O comprar en zonas emergentes antes del boom.",
            en: "Detect hidden value, renovate, and sell (Flipping). Or buy in emerging zones before the boom."
        },
        longDescription: {
            es: "Analizamos el mercado para encontrar propiedades por debajo del valor de mercado o en zonas a punto de recibir grandes inversiones de infraestructura. Compramos, agregamos valor (ya sea mediante renovación física o re-zonificación) y vendemos para obtener una ganancia de capital rápida.",
            en: "We analyze the market to find properties below market value or in areas about to receive major infrastructure investments. We buy, add value (either through physical renovation or re-zoning), and sell for a quick capital gain."
        },
        keyBenefits: [],
        roiStats: [
            { value: "30%+", label: { es: "Margen Potencial", en: "Potential Margin" } }
        ],
        contentSections: []
    },
    {
        slug: "off-market",
        title: { es: "Oportunidades Off-Market", en: "Off-Market Opportunities" },
        heroImage: "/images/og-home-luxury.jpg",
        description: {
            es: "Acceso exclusivo a propiedades que nunca llegan a los portales públicos. El verdadero tesoro para inversionistas institucionales.",
            en: "Exclusive access to properties that never reach public portals. The true treasure for institutional investors."
        },
        longDescription: {
            es: "Muchas de las mejores transacciones en Punta Cana ocurren a puerta cerrada. Terrenos hoteleros, edificios completos o ventas de emergencia. Nuestra red de contactos nos da acceso privilegiado a estos activos antes que nadie.",
            en: "Many of the best transactions in Punta Cana happen behind closed doors. Hotel land, entire buildings, or distress sales. Our network gives us privileged access to these assets before anyone else."
        },
        keyBenefits: [],
        roiStats: [],
        contentSections: []
    }
];
