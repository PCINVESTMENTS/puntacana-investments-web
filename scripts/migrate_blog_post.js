import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function migratePost() {
  try {
    const doc = {
      _type: 'post',
      title: "Master Guide to Investing in Punta Cana: How to Shield Your Capital and Avoid Real Estate Scams",
      slug: {
        _type: 'slug',
        current: "guia-invertir-seguro-punta-cana-evitar-estafas"
      },
      publishedAt: "2026-05-10T00:00:00.000Z",
      imageUrl: "/images/blog/guia_inversion_1.jpg",
      author: "Ulises Ubiera",
      authorRole: "CEO & Founder",
      authorBio: "Expert in luxury real estate and investments in the Caribbean.",
      authorImage: "/images/ceo-final.jpg",
      excerptEn: "Discover how to invest safely in Punta Cana. Learn to avoid real estate scams, verify legal security, and discover the advantage of PCI CONSTRUCTION GROUP PUNTA CANA.",
      excerptEs: "Descubre cómo invertir seguro en Punta Cana. Aprende a evitar estafas inmobiliarias, verificar la seguridad jurídica y descubre la ventaja de PCI CONSTRUCTION GROUP PUNTA CANA.",
      readTime: "8 min",
      category: { en: "Real Estate Investment / Tips", es: "Inversión Inmobiliaria / Consejos" },
      contentEn: [
        {
          _key: "block_en_1",
          _type: "block",
          style: "normal",
          children: [{ _key: "span_en_1", _type: "span", marks: [], text: "Investing in the Dominican Republic, and specifically in the tourist hub of Punta Cana, is one of the smartest financial decisions one can make today. However, the explosive real estate growth has brought with it both extraordinary opportunities and risks that cannot be ignored.\n\nIn recent months, news and social media in the country have echoed unfortunate cases of real estate scams that have affected hundreds of families and foreign funds. Ghost projects, lack of permits, and duplicate sales have put smart buyers on alert. That is why, before signing any contract, it is vital to understand the pillars of security and know how to choose the right allies." }]
        },
        {
          _key: "block_en_2",
          _type: "block",
          style: "h2",
          children: [{ _key: "span_en_2", _type: "span", marks: [], text: "📊 The Market in Numbers: Why Smart Capital Chooses Punta Cana" }]
        },
        {
          _key: "block_en_3",
          _type: "block",
          style: "normal",
          children: [{ _key: "span_en_3", _type: "span", marks: [], text: "- Return on Investment (ROI): Well-managed properties in the eastern zone generate annual returns ranging between 8% and 12%.\n- Tourist Occupancy: The region maintains an average annual occupancy rate of over 75%, ensuring a constant cash flow for vacation rental models.\n- Appreciation: The capital gain of premium land and properties continues to rise thanks to airport and infrastructure expansion." }]
        },
        {
          _key: "block_en_4",
          _type: "block",
          style: "h2",
          children: [{ _key: "span_en_4", _type: "span", marks: [], text: "1. Legal Security: The Shield of Your Investment" }]
        },
        {
          _key: "block_en_5",
          _type: "block",
          style: "normal",
          children: [{ _key: "span_en_5", _type: "span", marks: [], text: "In the Dominican Republic, legal security is based on the Real Estate Registration System. For your investment to be shielded, you must demand the verification of three non-negotiable points:\n\n- Certificate of Title: Must be in the name of the seller or developer, accompanied by a legal status certification proving it is free of liens or encumbrances.\n- CONFOTUR Law: Projects certified under this law not only offer unparalleled tax benefits (exemption from the 3% transfer tax and 15 years without property tax) but also pass a rigorous filter by the Dominican State.\n- Construction Permits: Never invest in a project that does not have a construction license approved by the MIVHED (Ministry of Housing) and the Ministry of Environment." }]
        },
        {
          _key: "img_en_1",
          _type: "legacyImage",
          url: "/images/blog/guia_inversion_2.png",
          caption: "Your shielded investment: We only work with verified titles and projects with full permits and approved CONFOTUR."
        },
        {
          _key: "block_en_6",
          _type: "block",
          style: "h2",
          children: [{ _key: "span_en_6", _type: "span", marks: [], text: "2. How to Detect (and Avoid) Real Estate Scams" }]
        },
        {
          _key: "block_en_7",
          _type: "block",
          style: "normal",
          children: [{ _key: "span_en_7", _type: "span", marks: [], text: "Recent scams in the DR have had a common pattern: promises of magical profitability and a total lack of transparency. Here is how to protect yourself:\n\n- Beware of unrealistic prices: If the price is drastically below market value in a prime area of Bavaro or Punta Cana, doubt it.\n- Demand a Trust (Fideicomiso): Investing in a project under a Trust guarantees that your money is managed by a fiduciary entity (a bank) and not directly by the developer. Funds are only released as the actual construction of the project progresses." }]
        },
        {
          _key: "block_en_8",
          _type: "block",
          style: "h2",
          children: [{ _key: "span_en_8", _type: "span", marks: [], text: "Conclusion: Don't Invest Blindly" }]
        },
        {
          _key: "block_en_9",
          _type: "block",
          style: "normal",
          children: [{ _key: "span_en_9", _type: "span", marks: [], text: "The success of your wealth depends on who accompanies you along the way. At Punta Cana Investments and PCI CONSTRUCTION GROUP PUNTA CANA, led by our CEO Ulises Ubiera Guerrero, we have an unwavering commitment to transparency, avant-garde design, and your financial peace of mind.\n\nYour security is the foundation upon which we build luxury." }]
        }
      ],
      contentEs: [
        {
          _key: "block_es_1",
          _type: "block",
          style: "normal",
          children: [{ _key: "span_es_1", _type: "span", marks: [], text: "Invertir en la República Dominicana, y específicamente en el polo turístico de Punta Cana, es una de las decisiones financieras más inteligentes que se pueden tomar hoy en día. Sin embargo, el explosivo crecimiento inmobiliario ha traído consigo tanto oportunidades extraordinarias como riesgos que no se pueden ignorar.\n\nEn los últimos meses, las noticias y redes sociales en el país se han hecho eco de lamentables casos de estafas inmobiliarias que han afectado a cientos de familias y fondos extranjeros. Proyectos fantasma, falta de permisos y duplicidad de ventas han puesto en alerta a los compradores inteligentes. Por eso, antes de firmar cualquier contrato, es vital entender los pilares de la seguridad y saber elegir a los aliados correctos." }]
        },
        {
          _key: "block_es_2",
          _type: "block",
          style: "h2",
          children: [{ _key: "span_es_2", _type: "span", marks: [], text: "📊 El Mercado en Números: Por qué el Capital Inteligente Elige Punta Cana" }]
        },
        {
          _key: "block_es_3",
          _type: "block",
          style: "normal",
          children: [{ _key: "span_es_3", _type: "span", marks: [], text: "- Retorno de Inversión (ROI): Las propiedades bien gestionadas en la zona este generan rendimientos anuales que oscilan entre el 8% y el 12%.\n- Ocupación Turística: La región mantiene un promedio de ocupación superior al 75% anual, asegurando un flujo de caja constante para los modelos de renta vacacional.\n- Revalorización: La plusvalía de los terrenos y propiedades premium continúa en alza gracias a la expansión aeroportuaria y de infraestructura." }]
        },
        {
          _key: "block_es_4",
          _type: "block",
          style: "h2",
          children: [{ _key: "span_es_4", _type: "span", marks: [], text: "1. La Seguridad Jurídica: El Escudo de tu Inversión" }]
        },
        {
          _key: "block_es_5",
          _type: "block",
          style: "normal",
          children: [{ _key: "span_es_5", _type: "span", marks: [], text: "En la República Dominicana, la seguridad jurídica se basa en el Sistema de Registro Inmobiliario. Para que tu inversión esté blindada, debes exigir la verificación de tres puntos innegociables:\n\n- Certificado de Título: Debe estar a nombre del vendedor o la desarrolladora, acompañado de una certificación de estado jurídico que compruebe que está libre de cargas o gravámenes.\n- Ley de CONFOTUR: Los proyectos certificados bajo esta ley no solo ofrecen beneficios fiscales inigualables (exención del 3% de transferencia y 15 años sin impuesto a la propiedad), sino que pasan por un riguroso filtro del Estado Dominicano.\n- Permisos de Construcción: Nunca inviertas en un proyecto que no tenga la licencia de construcción aprobada por el MIVHED (Ministerio de Vivienda) y Medio Ambiente." }]
        },
        {
          _key: "img_es_1",
          _type: "legacyImage",
          url: "/images/blog/guia_inversion_2.png",
          caption: "Tu inversión blindada: Solo trabajamos con títulos verificados y proyectos con permisos completos y CONFOTUR aprobado."
        },
        {
          _key: "block_es_6",
          _type: "block",
          style: "h2",
          children: [{ _key: "span_es_6", _type: "span", marks: [], text: "2. Cómo Detectar (y Esquivar) las Estafas Inmobiliarias" }]
        },
        {
          _key: "block_es_7",
          _type: "block",
          style: "normal",
          children: [{ _key: "span_es_7", _type: "span", marks: [], text: "Las estafas recientes en RD han tenido un patrón común: promesas de rentabilidades mágicas y total falta de transparencia. Aquí te decimos cómo protegerte:\n\n- Cuidado con los precios irreales: Si el precio está drásticamente por debajo del mercado en una zona prime de Bávaro o Punta Cana, duda.\n- Exige la figura del Fideicomiso: Invertir en un proyecto bajo Fideicomiso garantiza que tu dinero sea administrado por una entidad fiduciaria (un banco) y no directamente por el desarrollador. Los fondos solo se liberan conforme avanza la construcción real de la obra." }]
        },
        {
          _key: "block_es_8",
          _type: "block",
          style: "h2",
          children: [{ _key: "span_es_8", _type: "span", marks: [], text: "Conclusión: No inviertas a ciegas" }]
        },
        {
          _key: "block_es_9",
          _type: "block",
          style: "normal",
          children: [{ _key: "span_es_9", _type: "span", marks: [], text: "El éxito de tu patrimonio depende de quién te acompañe en el camino. En Punta Cana Investments y PCI CONSTRUCTION GROUP PUNTA CANA, liderados por nuestro CEO Ulises Ubiera Guerrero, tenemos un compromiso inquebrantable con la transparencia, el diseño de vanguardia y tu tranquilidad financiera.\n\nTu seguridad es la base sobre la que construimos el lujo." }]
        }
      ]
    };

    const res = await client.create(doc);
    console.log('Post migrated to Sanity successfully!');
    console.log('Document ID:', res._id);
  } catch (err) {
    console.error('Error migrating post:', err);
  }
}

migratePost();
