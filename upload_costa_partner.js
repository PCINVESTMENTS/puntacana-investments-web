const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const partnerData = {
  _type: 'partner',
  name: 'Costa Hospitality Caribbean LLC',
  description_es: 'Costa Hospitality Caribbean LLC es una firma especializada en asesoría para el desarrollo hotelero, adquisición de activos inmobiliarios turísticos y representación de propietarios en proyectos de hospitalidad de lujo en el Caribe.\n\nLa empresa acompaña a propietarios, inversionistas y desarrolladores durante todo el ciclo de vida de un proyecto, desde la evaluación inicial de oportunidades hasta la preparación operativa previa a la apertura, aportando una visión estratégica enfocada en proteger el valor de la inversión y optimizar el desempeño de los activos.\n\nSu experiencia combina más de 30 años de liderazgo en hospitalidad, un equipo con más de 115 años de experiencia acumulada, presencia en más de 11 territorios del Caribe y conocimiento especializado en desarrollo de resorts, coordinación de proyectos y representación independiente del propietario.\n\nBajo el liderazgo de Shawn DaCosta, la firma proporciona una perspectiva operativa que ayuda a alinear las decisiones de desarrollo con el rendimiento comercial de largo plazo de cada proyecto hotelero.',
  description_en: 'Costa Hospitality Caribbean LLC is a firm specializing in hotel development advisory, acquisition of tourism real estate assets, and owner representation in luxury hospitality projects in the Caribbean.\n\nThe company accompanies owners, investors, and developers throughout the entire life cycle of a project, from the initial evaluation of opportunities to pre-opening operational readiness, providing a strategic vision focused on protecting the value of the investment and optimizing asset performance.\n\nTheir expertise combines over 30 years of hospitality leadership, a team with more than 115 years of accumulated experience, a presence in over 11 Caribbean territories, and specialized knowledge in resort development, project coordination, and independent owner representation.\n\nUnder the leadership of Shawn DaCosta, the firm provides an operational perspective that helps align development decisions with the long-term commercial performance of each hotel project.',
  description_fr: 'Costa Hospitality Caribbean LLC est un cabinet spécialisé dans le conseil en développement hôtelier, l\'acquisition d\'actifs immobiliers touristiques et la représentation de propriétaires dans des projets d\'hôtellerie de luxe dans les Caraïbes.\n\nL\'entreprise accompagne les propriétaires, les investisseurs et les développeurs tout au long du cycle de vie d\'un projet, de l\'évaluation initiale des opportunités jusqu\'à la préparation opérationnelle avant l\'ouverture, en apportant une vision stratégique axée sur la protection de la valeur de l\'investissement et l\'optimisation des performances des actifs.\n\nLeur expertise combine plus de 30 ans de leadership dans l\'hôtellerie, une équipe avec plus de 115 ans d\'expérience cumulée, une présence dans plus de 11 territoires des Caraïbes et des connaissances spécialisées dans le développement de complexes hôteliers, la coordination de projets et la représentation indépendante de propriétaires.\n\nSous la direction de Shawn DaCosta, le cabinet offre une perspective opérationnelle qui aide à aligner les décisions de développement avec la performance commerciale à long terme de chaque projet hôtelier.',
  website_url: 'https://costahospitality.com', // fallback as no url was provided
  order: 99
};

async function upload() {
    try {
        const res = await client.create(partnerData);
        console.log('Partner created with ID:', res._id);
    } catch (err) {
        console.error('Error creating partner:', err);
    }
}

upload();
