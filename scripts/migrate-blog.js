
const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'w7gp05my',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

const blogPosts = [
    {
        slug: "5-razones-invertir-punta-cana-2026",
        title: {
            es: "5 Razones Irrefutables para Invertir en Punta Cana en 2026",
            en: "5 Irrefutable Reasons to Invest in Punta Cana in 2026"
        },
        date: "2026-01-14", // ISO date
        category: { es: "Inversión Estratégica", en: "Strategic Investment" },
        mainImage: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop",
        excerpt: {
            es: "Descubre por qué Punta Cana se ha convertido en el destino número uno para inversores inteligentes. Desde incentivos fiscales únicos hasta una rentabilidad que supera la media global.",
            en: "Discover why Punta Cana has become the number one destination for smart investors. From unique tax incentives to profitability that exceeds the global average."
        },
        author: "Ulises Ubiera",
        authorRole: { es: "CEO & Fundador", en: "CEO & Founder" },
        authorBio: {
            es: "Experto en inversiones inmobiliarias y mercado de lujo en el Caribe. Comprometido con encontrar las mejores oportunidades para nuestros clientes.",
            en: "Expert in luxury real estate and investments in the Caribbean. Committed to finding the best opportunities for our clients."
        },
        authorImage: "/images/ceo-final.jpg",
        content: [
            {
                text: {
                    es: "El mercado inmobiliario del Caribe está en auge, pero ningún destino brilla con tanta intensidad como Punta Cana. En 2026, las condiciones para la inversión no solo son favorables, son excepcionales. Si estás buscando diversificar tu patrimonio, proteger tu capital contra la inflación y generar ingresos pasivos en dólares, aquí te detallamos las 5 razones principales por las que Punta Cana debe ser tu próxima parada.",
                    en: "The Caribbean real estate market is booming, but no destination shines as brightly as Punta Cana. In 2026, investment conditions are not just favorable, they are exceptional. If you are looking to diversify your wealth, protect your capital against inflation, and generate passive income in dollars, here are the top 5 reasons why Punta Cana should be your next stop."
                }
            },
            {
                subtitle: { es: "1. Rentabilidad Superior y Flujo de Caja en Dólares", en: "1. Superior Profitability and Dollar Cash Flow" },
                text: {
                    es: "A diferencia de mercados saturados en Europa o Estados Unidos, donde el ROI (Retorno de Inversión) suele rondar el 3-4%, Punta Cana ofrece rendimientos netos que oscilan entre el **6% y el 10% anual**. \n\nEsto se debe a la demanda turística incesante. Con más de 8 millones de visitantes al año, la ocupación hotelera y de rentas vacacionales se mantiene alta durante todo el año. Al invertir aquí, no solo obtienes una propiedad, adquieres un negocio llave en mano que genera ingresos en moneda fuerte (USD) desde el primer día.",
                    en: "Unlike saturated markets in Europe or the United States, where ROI (Return on Investment) typically hovers around 3-4%, Punta Cana offers net yields ranging between **6% and 10% annually**. \n\nThis is due to ceaseless tourism demand. With over 8 million visitors annually, hotel and vacation rental occupancy remains high year-round. Investing here means acquiring not just a property, but a turnkey business generating hard currency (USD) income from day one."
                },
                image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop",
                imageCaption: { es: "Altos retornos de inversión en propiedades turísticas", en: "High investment returns on tourist properties" }
            },
            {
                subtitle: { es: "2. Incentivos Fiscales Únicos (Ley CONFOTUR)", en: "2. Unique Tax Incentives (CONFOTUR Law)" },
                text: {
                    es: "La República Dominicana posee una de las leyes de incentivo a la inversión extranjera más atractivas de la región: la Ley de CONFOTUR. \n\nAl comprar una propiedad bajo esta ley, estás **exento del impuesto de transferencia del 3%** y del **impuesto sobre la propiedad inmobiliaria (IPI) del 1% anual durante 15 años**. Esto se traduce en un ahorro directo de decenas de miles de dólares, aumentando significativamente tu margen de beneficio a largo plazo.",
                    en: "The Dominican Republic boasts one of the region's most attractive foreign investment incentive laws: the CONFOTUR Law. \n\nBuying under this law exempts you from the **3% transfer tax** and the **1% annual real estate property tax (IPI) for 15 years**. This translates to tens of thousands of dollars in direct savings, significantly boosting your long-term profit margin."
                },
                image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop",
                imageCaption: { es: "Beneficios fiscales que maximizan tu inversión", en: "Tax benefits that maximize your investment" }
            },
            {
                subtitle: { es: "3. Estabilidad Política y Crecimiento Económico", en: "3. Political Stability and Economic Growth" },
                text: {
                    es: "República Dominicana es la economía de más rápido crecimiento en América Latina y el Caribe. Su estabilidad política y jurídica brinda seguridad a los inversores extranjeros. El gobierno ha hecho del turismo y la inversión extranjera una prioridad nacional, garantizando infraestructura de primera clase, seguridad y un clima de negocios favorable.",
                    en: "The Dominican Republic is the fastest-growing economy in Latin America and the Caribbean. Its political and legal stability provides security for foreign investors. The government has made tourism and foreign investment a national priority, ensuring world-class infrastructure, security, and a favorable business climate."
                },
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
                imageCaption: { es: "Crecimiento económico y modernización constante", en: "Economic growth and constant modernization" }
            },
            {
                subtitle: { es: "4. Estilo de Vida de Lujo a Costos Accesibles", en: "4. Luxury Lifestyle at Accessible Costs" },
                text: {
                    es: "En Punta Cana, el lujo es asequible. Puedes adquirir un apartamento en un complejo con campo de golf, playa privada y seguridad 24/7 por una fracción de lo que costaría en Miami o el Mediterráneo. \n\nEl costo de vida es significativamente menor, permitiéndote disfrutar de cenas gourmet, golf de campeonato y actividades náuticas sin sacrificar tu presupuesto. Es el lugar ideal para un retiro dorado o para disfrutar de vacaciones de ensueño mientras tu activo se revaloriza.",
                    en: "In Punta Cana, luxury is affordable. You can acquire a condo in a complex with a golf course, private beach, and 24/7 security for a fraction of what it would cost in Miami or the Mediterranean. \n\nThe cost of living is significantly lower, allowing you to enjoy gourmet dining, championship golf, and nautical activities without breaking the bank. It's the ideal place for a golden retirement or dream vacations while your asset appreciates."
                },
                image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
                imageCaption: { es: "Villas de lujo con piscina y acceso a golf", en: "Luxury villas with pool and golf access" }
            },
            {
                subtitle: { es: "5. Conectividad Aérea Global", en: "5. Global Air Connectivity" },
                text: {
                    es: "El Aeropuerto Internacional de Punta Cana (PUJ) es el más conectado del Caribe, con vuelos directos a más de 26 países y 64 ciudades. \n\nEsta facilidad de acceso es crucial para mantener altas tasas de ocupación en propiedades de renta corta. Turistas de Estados Unidos, Canadá, Europa y Latinoamérica pueden llegar fácilmente, asegurando un flujo constante de huéspedes para tu propiedad.",
                    en: "Punta Cana International Airport (PUJ) is the most connected in the Caribbean, with direct flights to over 26 countries and 64 cities. \n\nThis ease of access is crucial for maintaining high occupancy rates in short-term rental properties. Tourists from the US, Canada, Europe, and Latin America can arrive easily, ensuring a steady stream of guests for your property."
                },
                image: "/images/punta-cana-airport-v4.png",
                imageCaption: { es: "Conexión directa con el mundo", en: "Direct connection to the world" }
            }
        ],
        relatedProperties: [1, 4, 8]
    },
    {
        slug: "guia-comprar-planos",
        title: {
            es: "Guía para comprar propiedades en planos",
            en: "Guide to Buying Off-Plan Properties"
        },
        date: "2026-01-05",
        category: { es: "Consejos", en: "Tips" },
        mainImage: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop",
        excerpt: {
            es: "Maximiza tu retorno de inversión aprovechando los precios de preventa con nuestra guía experta.",
            en: "Maximize your return on investment by taking advantage of pre-sale prices with our expert guide."
        },
        author: "Equipo PCI",
        authorRole: { es: "Asesores Inmobiliarios", en: "Real Estate Advisors" },
        authorBio: {
            es: "Nuestro equipo de expertos dedicados a brindarte la mejor asesoría para tu inversión.",
            en: "Our team of experts dedicated to providing you with the best advice for your investment."
        },
        authorImage: "/images/logo-footer-v2.png",
        content: [
            {
                text: {
                    es: "Comprar en planos (pre-construcción) es una de las estrategias más inteligentes para maximizar el capital en el mercado inmobiliario dominicano. Esta modalidad permite adquirir inmuebles a precios significativamente menores que el valor de mercado final, garantizando una plusvalía automática al momento de la entrega.",
                    en: "Buying off-plan (pre-construction) is one of the smartest strategies to maximize capital in the Dominican real estate market. This modality allows acquiring properties at significantly lower prices than the final market value, guaranteeing automatic appreciation at the time of delivery."
                },
                image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2089&auto=format&fit=crop",
                imageCaption: {
                    es: "Proyectos en fase de diseño ofrecen los mejores precios de entrada.",
                    en: "Projects in the design phase offer the best entry prices."
                }
            },
            {
                subtitle: { es: "Beneficios de la Plusvalía Inmediata", en: "Benefits of Immediate Appreciation" },
                text: {
                    es: "Desde el momento de la reserva hasta la entrega de llaves, la propiedad suele apreciarse entre un 15% y un 25%, dependiendo de la etapa en que se ingrese. Este 'equity' instantáneo es la clave del éxito para muchos inversionistas que buscan multiplicar su capital a mediano plazo.",
                    en: "From the moment of reservation to the handover of keys, the property typically appreciates between 15% and 25%, depending on the stage at which you enter. This instant equity is the key to success for many investors looking to multiply their capital in the medium term."
                }
            },
            {
                subtitle: { es: "Facilidades de Pago y Flujo de Caja", en: "Payment Flexibility and Cash Flow" },
                text: {
                    es: "A diferencia de la compra de propiedades listas que requieren el pago total inmediato o financiamiento bancario, la compra en planos permite fraccionar el inicial durante el periodo de construcción (usualmente 18-24 meses). Esto mejora el flujo de caja del inversionista y permite entrar al mercado con un capital inicial más bajo.",
                    en: "Unlike buying ready properties that require immediate full payment or bank financing, buying off-plan allows splitting the down payment during the construction period (usually 18-24 months). This improves the investor's cash flow and allows entering the market with lower initial capital."
                },
                image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop",
                imageCaption: {
                    es: "Planes de pago flexibles adaptados a tu capacidad de inversión.",
                    en: "Flexible payment plans adapted to your investment capacity."
                }
            },
            {
                subtitle: { es: "Mejor Selección de Unidades", en: "Better Unit Selection" },
                text: {
                    es: "Entrar temprano en un proyecto te da la ventaja de elegir las 'joyas' del desarrollo: aquellas unidades con mejores vistas, mejor distribución, terrazas más amplias o ubicaciones premium (esquinas, plantas bajas con jardín, o penthouses) que suelen ser las primeras en venderse y las más demandadas para renta futura.",
                    en: "Entering a project early gives you the advantage of choosing the 'jewels' of the development: those units with better views, better layout, larger terraces, or premium locations (corners, ground floors with gardens, or penthouses) that are visually the first to sell and the most in-demand for future rental."
                }
            }
        ]
    },
    {
        slug: "tendencias-diseno-tropical",
        title: {
            es: "Tendencias de diseño interior tropical",
            en: "Tropical Interior Design Trends"
        },
        date: "2025-12-28",
        category: { es: "Estilo de Vida", en: "Lifestyle" },
        mainImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop",
        excerpt: {
            es: "Materiales naturales, espacios abiertos y lujo sostenible: lo que se lleva en las villas modernas.",
            en: "Natural materials, open spaces, and sustainable luxury: what's trending in modern villas."
        },
        author: "Sarah Jenkins",
        authorRole: { es: "Diseñadora de Interiores", en: "Interior Designer" },
        authorBio: {
            es: "Especialista en diseño tropical y sostenible con más de 10 años de experiencia en el Caribe.",
            en: "Specialist in tropical and sustainable design with over 10 years of experience in the Caribbean."
        },
        authorImage: "/images/logo-footer-v2.png",
        content: [
            {
                text: {
                    es: "El diseño de interiores en el Caribe está evolucionando hacia un concepto de 'Lujo Descalzo', donde la elegancia se encuentra con la comodidad y la naturaleza. Ya no se trata de opulencia recargada, sino de espacios que respiran, que conectan con el entorno y que invitan a la relajación absoluta.",
                    en: "Interior design in the Caribbean is evolving towards a 'Barefoot Luxury' concept, where elegance meets comfort and nature. It is no longer about ornate opulence, but about spaces that breathe, connect with the environment, and invite absolute relaxation."
                },
                image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2000&auto=format&fit=crop",
                imageCaption: {
                    es: "Espacios abiertos que fusionan interior y exterior.",
                    en: "Open spaces that fuse interior and exterior."
                }
            },
            {
                subtitle: { es: "Materiales Autóctonos y Texturas", en: "Indigenous Materials and Textures" },
                text: {
                    es: "El uso de piedra coralina, madera preciosa local, fibras tejidas (ratán, mimbre) y lino está en auge. Estos materiales no solo son estéticamente hermosos y aportan calidez, sino que resisten mejor el clima salino y húmedo de la costa, reduciendo costos de mantenimiento a largo plazo.",
                    en: "The use of coral stone, local precious wood, woven fibers (rattan, wicker), and linen is booming. These materials are not only aesthetically beautiful and provide warmth, but they also better withstand the coastal saline and humid climate, reducing long-term maintenance costs."
                }
            },
            {
                subtitle: { es: "Integración Interior-Exterior", en: "Interior-Exterior Integration" },
                text: {
                    es: "Los límites entre adentro y afuera se desdibujan por completo. Grandes ventanales corredizos de piso a techo, duchas al aire libre, cocinas de verano y terrazas que funcionan como salas de estar son elementos estándar en las propiedades de lujo modernas en Punta Cana.",
                    en: "The boundaries between inside and outside are completely blurred. Large floor-to-ceiling sliding windows, outdoor showers, summer kitchens, and terraces that function as living rooms are standard elements in modern luxury properties in Punta Cana."
                },
                image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
                imageCaption: {
                    es: "La naturaleza como protagonista del diseño.",
                    en: "Nature as the protagonist of design."
                }
            },
            {
                subtitle: { es: "Sostenibilidad y Tecnología Invisible", en: "Sustainability and Invisible Technology" },
                text: {
                    es: "La domótica ahora se enfoca en la eficiencia energética y el confort sutil: control inteligente de aires acondicionados, iluminación solar automatizada y sistemas de recolección de agua. El comprador de lujo de hoy valora la sostenibilidad tanto como la estética.",
                    en: "Home automation now focuses on energy efficiency and subtle comfort: smart air conditioning control, automated solar lighting, and water harvesting systems. Today's luxury buyer values sustainability as much as aesthetics."
                }
            }
        ]
    }
];

function generateBlockKey() {
    return Math.random().toString(36).substring(2, 10);
}

function convertToBlocks(sections, lang) {
    const blocks = [];

    sections.forEach(section => {
        // Subtitle -> H2
        if (section.subtitle && section.subtitle[lang]) {
            blocks.push({
                _key: generateBlockKey(),
                _type: 'block',
                style: 'h2',
                children: [
                    { _key: generateBlockKey(), _type: 'span', text: section.subtitle[lang], marks: [] }
                ]
            });
        }

        // Text -> Normal Paragraph
        if (section.text && section.text[lang]) {
            blocks.push({
                _key: generateBlockKey(),
                _type: 'block',
                style: 'normal',
                children: [
                    { _key: generateBlockKey(), _type: 'span', text: section.text[lang], marks: [] }
                ]
            });
        }

        // Image -> Legacy Image Object
        if (section.image) {
            blocks.push({
                _key: generateBlockKey(),
                _type: 'legacyImage',
                url: section.image,
                caption: section.imageCaption ? section.imageCaption[lang] : ''
            });
        }
    });

    return blocks;
}

async function migrate() {
    console.log('Starting blog migration...');

    for (const post of blogPosts) {
        const doc = {
            _type: 'post',
            title: post.title.en, // Use English title as main title for Studio list
            slug: { _type: 'slug', current: post.slug },
            publishedAt: new Date(post.date).toISOString(),
            imageUrl: post.mainImage, // Fallback main image
            excerptEn: post.excerpt.en,
            excerptEs: post.excerpt.es,
            contentEn: convertToBlocks(post.content, 'en'),
            contentEs: convertToBlocks(post.content, 'es'),
            author: post.author,
            readTime: '5 min' // Default
        };

        try {
            const res = await client.create(doc);
            console.log(`Created post: ${post.title.en} (${res._id})`);
        } catch (err) {
            console.error(`Failed to create ${post.title.en}:`, err.message);
        }
    }
}

migrate();
