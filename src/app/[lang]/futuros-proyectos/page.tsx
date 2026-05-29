import Image from "next/image";

import { FaLeaf, FaSeedling, FaTree, FaGlassMartiniAlt, FaHome, FaLock } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import FounderInvestmentForm from "@/components/forms/FounderInvestmentForm";
import ReadMore from "@/components/ui/ReadMore";
import { getDictionary } from "@/dictionaries/get-dictionary";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';
  const url = `${baseUrl}/${lang}/futuros-proyectos`;
  
  const title = lang === 'en' 
    ? "Miches Eco-Resort Project | High-Yield Capital Investments | Punta Cana" 
    : "Proyecto Eco-Resort Miches | Inversión de Capital y Alta Rentabilidad | Punta Cana";
    
  const description = lang === 'en' 
    ? "Exclusive pre-construction access: Eco-luxury villas & condo-hotels in Miches, Dominican Republic. SIMA Madrid 2026 featured project. Secure your investment." 
    : "Acceso exclusivo en preventa: Villas de eco-lujo y condo-hoteles en Miches, República Dominicana. Proyecto destacado rumbo a SIMA Madrid 2026. Invierte ahora.";

  const keywords = lang === 'en' 
    ? [
        "Miches real estate projects", "Capital investments Punta Cana", "Eco-resort Miches pre-construction", 
        "Sustainable investment Caribbean", "Eco-friendly villas Miches", "Luxury real estate Dominican Republic", 
        "Hotel pool system Miches", "Founder investors Miches", "Ecological development Punta Cana", 
        "SIMA Madrid 2026 Dominican Republic", "Dominican Republic property investment", "High yield real estate Caribbean",
        "Miches land for sale", "Punta Cana Investments", "PCI Construction Group", "Off-plan property Miches"
      ] 
    : [
        "Proyectos inmobiliarios en Miches", "Inversiones de capital Punta Cana", "Eco-resort Miches preventa", 
        "Inversión sostenible Caribe", "Villas ecológicas en Miches", "Bienes raíces de lujo República Dominicana", 
        "Pool hotelero Miches", "Inversionistas fundadores Miches", "Desarrollo ecológico Punta Cana", 
        "SIMA Madrid 2026 República Dominicana", "Invertir en bienes raíces República Dominicana", "Alta rentabilidad inmobiliaria Caribe",
        "Terrenos en Miches", "Punta Cana Investments", "PCI Construction Group", "Proyectos sobre plano Miches"
      ];

  return {
    title,
    description,
    keywords,
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title,
        description,
        url,
        images: [{
            url: `${baseUrl}/images/miches-eco-resort-main.jpg`,
            width: 1200,
            height: 630,
            alt: "Miches Eco Resort Masterplan"
        }],
        locale: lang === 'es' ? 'es_DO' : 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${baseUrl}/images/miches-eco-resort-main.jpg`],
    },
    alternates: {
        canonical: url,
        languages: {
            'en': `${baseUrl}/en/futuros-proyectos`,
            'es': `${baseUrl}/es/futuros-proyectos`,
        },
    }
  };
}

export default async function FuturosProyectosPage({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    "name": lang === 'en' ? "Miches Eco-Resort Project" : "Proyecto Eco-Resort en Miches",
    "description": lang === 'en' 
        ? "Pre-construction eco-luxury villas and condo-hotel pool system in Miches, Dominican Republic. Featured for SIMA Madrid 2026. Developed by Punta Cana Investments and PCI Construction Group."
        : "Preventa de villas de eco-lujo y sistema de pool hotelero en Miches, República Dominicana. Destacado para SIMA Madrid 2026. Desarrollado por Punta Cana Investments y PCI Construction Group.",
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com'}/${lang}/futuros-proyectos`,
    "image": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com'}/images/miches-eco-resort-main.jpg`,
    "provider": {
        "@type": "RealEstateAgent",
        "name": "Punta Cana Investments",
        "image": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com'}/images/logo-pci-investments-gold.webp`,
        "url": "https://www.puntacanainvestmentsrd.com"
    },
    "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/PreOrder",
        "itemCondition": "https://schema.org/NewCondition",
        "priceCurrency": "USD"
    }
  };

  return (
    <main className="min-h-screen bg-primary-black text-white font-sans overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar dict={dict.nav} lang={lang} variant="solid" />

      {/* Hero Full Width */}
      <section className="relative h-[100svh] min-h-[500px] md:min-h-[700px] flex items-center justify-center pt-16 md:pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/miches-eco-resort-main.jpg"
            alt="Vista principal del Masterplan del Eco-Resort en Miches, Inversión de Capital en el Caribe"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/30 to-transparent"></div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-16 md:mt-20">
          <div className="inline-flex items-center gap-3 mb-4 md:mb-6 bg-white/10 backdrop-blur-md px-4 py-2 md:px-6 rounded-full border border-luxury-gold/50">
            <FaLeaf className="text-luxury-gold text-sm md:text-base" />
            <span className="uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm font-bold text-luxury-gold">{lang === 'en' ? '🌿 Coming Soon' : lang === 'fr' ? '🌿 Bientôt' : '🌿 Próximamente'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-4 md:mb-6 uppercase tracking-widest drop-shadow-2xl leading-tight">
            {lang === 'en' ? 'The Future of' : lang === 'fr' ? "L’Avenir de la" : 'El Futuro de la'} <br className="hidden sm:block" /> <span className="text-luxury-gold italic">{lang === 'en' ? 'Ecological Life' : lang === 'fr' ? 'Vie Écologique' : 'Vida Ecológica'}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl text-gray-200 font-light max-w-4xl mx-auto drop-shadow-md">
            {lang === 'en' ? 'and Experience Tourism in the Caribbean' : lang === 'fr' ? "et du Tourisme d’Expérience dans les Caraïbes" : 'y el Turismo de Experiencias en el Caribe'}
          </p>
        </div>
      </section>

      {/* Section 1: Intro (Zig-Zag Left) */}
      <section className="py-8 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
          <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-sm overflow-hidden shadow-2xl">
            <Image src="/images/miches-eco-resort-main.jpg" alt="Entorno natural ecológico del proyecto inmobiliario en Miches, República Dominicana" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 border-2 md:border-4 border-luxury-gold/20 m-2 md:m-4"></div>
          </div>
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
            <ReadMore 
              preview={
                <>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-gold uppercase tracking-wider mb-4 md:mb-6 leading-tight">
                      {lang === 'en' ? 'A Next-Generation Ecological Development' : lang === 'fr' ? 'Un Développement Écologique de Nouvelle Génération' : 'Un Desarrollo Ecológico de Nueva Generación'}
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      {lang === 'en' ? 'Very soon, a project designed to transform the way you live, invest, and connect with nature will arrive.' : lang === 'fr' ? 'Très bientôt, un projet conçu pour transformer votre façon de vivre, d\'investir et de vous connecter avec la nature verra le jour.' : 'Muy pronto llegará un proyecto concebido para transformar la manera de vivir, invertir y conectar con la naturaleza.'}
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {lang === 'en' ? 'Designed to integrate modern tropical architecture, sustainability, wellness, and premium hotel experiences in a truly extraordinary natural environment.' : lang === 'fr' ? 'Conçu pour intégrer une architecture tropicale moderne, la durabilité, le bien-être et des expériences hôtelières premium dans un environnement naturel véritablement extraordinaire.' : 'Diseñado para integrar arquitectura moderna tropical, sostenibilidad, bienestar y experiencias hoteleras premium en un entorno natural verdaderamente extraordinario.'}
                    </p>
                </>
              }
            >
              <div className="space-y-4 text-gray-400 mt-4">
                <p>
                  {lang === 'en' ? 'Located on an impressive property of approximately 50,000 m² surrounded by lush vegetation and a natural river running along the entire back of the project, this concept is born with a clear vision:' : lang === 'fr' ? 'Situé sur une impressionnante propriété d\'environ 50 000 m² entourée d\'une végétation luxuriante et d\'une rivière naturelle traversant toute la partie arrière du projet, ce concept est né avec une vision claire :' : 'Ubicado sobre una impresionante propiedad de aproximadamente 50,000 m² rodeada de exuberante vegetación y un río natural que recorre toda la parte posterior del proyecto, este concepto nace con una visión clara:'}
                </p>
                <blockquote className="border-l-4 border-luxury-gold pl-6 text-xl italic text-white font-serif mt-6">
                  {lang === 'en' ? '"Create a tropical sanctuary where nature and luxury coexist in perfect harmony."' : lang === 'fr' ? '"Créer un sanctuaire tropical où nature et luxe coexistent en parfaite harmonie."' : '"Crear un santuario tropical donde la naturaleza y el lujo convivan en perfecta armonía."'}
                </blockquote>
              </div>
            </ReadMore>
          </div>
        </div>
      </section>

      {/* Section 2: Full Width Image Divider */}
      <section className="relative h-[50vh] min-h-[350px] md:min-h-[400px] flex items-center justify-center my-4 md:my-12">
         <Image src="/images/miches-eco-resort-concepto.jpg" alt="Concepto ecológico y preservación natural del terreno de inversión en Miches" fill className="object-cover" />
         <div className="absolute inset-0 bg-black/60"></div>
         <div className="relative z-10 text-center max-w-4xl px-4">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif font-bold text-luxury-gold mb-4 md:mb-6 leading-tight">
                {lang === 'en' ? '🌴 A REAL ECOLOGICAL CONCEPT' : lang === 'fr' ? '🌴 UN CONCEPT ÉCOLOGIQUE RÉEL' : '🌴 UN CONCEPTO ECOLÓGICO REAL'}
            </h2>
            <p className="text-lg sm:text-xl text-white font-light">
                {lang === 'en' ? 'This will not be a traditional project. The essence of the development is based on the preservation of the natural environment and an authentic ecological living experience.' : lang === 'fr' ? "Ce ne sera pas un projet traditionnel. L’essence du développement est basée sur la préservation de l’environnement naturel et une expérience de vie écologique authentique." : 'Este no será un proyecto tradicional. La esencia del desarrollo está basada en la preservación del entorno natural y en una experiencia de vida ecológica auténtica.'}
            </p>
         </div>
      </section>

      {/* Section 3: Zig-Zag Right */}
      <section className="py-8 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 md:gap-16">
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wider mb-4 md:mb-6">
              {lang === 'en' ? 'Respect for the Environment' : lang === 'fr' ? 'Respect de l\'Environnement' : 'Respeto por el Entorno'}
            </h3>
            <ReadMore
                preview={
                    <>
                        <ul className="space-y-4">
                            {[
                                lang === 'en' ? 'The natural topography of the land' : lang === 'fr' ? 'La topographie naturelle du terrain' : 'La topografía natural del terreno',
                                lang === 'en' ? 'The existing vegetation' : lang === 'fr' ? 'La végétation existante' : 'La vegetación existente',
                                lang === 'en' ? 'Visual integration with the river' : lang === 'fr' ? 'Intégration visuelle avec la rivière' : 'La integración visual con el río',
                                lang === 'en' ? 'Ecological pedestrian circulation' : lang === 'fr' ? 'Circulation piétonne écologique' : 'La circulación ecológica peatonal',
                                lang === 'en' ? 'Harmony between architecture and landscape' : lang === 'fr' ? 'Harmonie entre architecture et paysage' : 'La armonía entre arquitectura y paisaje'
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-4 text-gray-300 text-lg">
                                    <FaLeaf className="text-luxury-gold flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                }
            >
                <div className="space-y-4 text-gray-400 mt-6">
                    <p>
                      {lang === 'en' ? 'Every space has been designed to generate a direct connection with nature:' : lang === 'fr' ? 'Chaque espace a été conçu pour générer une connexion directe avec la nature :' : 'Cada espacio ha sido pensado para generar una conexión directa con la naturaleza:'}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{lang === 'en' ? 'Ecological trails among tropical trees.' : lang === 'fr' ? 'Sentiers écologiques parmi les arbres tropicaux.' : 'Senderos ecológicos entre árboles tropicales.'}</li>
                        <li>{lang === 'en' ? 'Strategic viewpoints and decks facing the river.' : lang === 'fr' ? 'Points de vue stratégiques et terrasses face à la rivière.' : 'Miradores y decks estratégicos frente al río.'}</li>
                        <li>{lang === 'en' ? 'Open spaces for relaxation, meditation, and wellness.' : lang === 'fr' ? 'Espaces ouverts pour la relaxation, la méditation et le bien-être.' : 'Espacios abiertos para relajación, meditación y bienestar.'}</li>
                        <li>{lang === 'en' ? 'Preserved green areas and native reforestation plans.' : lang === 'fr' ? 'Espaces verts préservés et plans de reforestation indigène.' : 'Áreas verdes preservadas y planes de reforestación nativa.'}</li>
                        <li>{lang === 'en' ? 'Sustainable and contemporary tropical design with organic minimalist finishes.' : lang === 'fr' ? 'Design tropical contemporain et durable avec des finitions minimalistes organiques.' : 'Diseño sostenible y tropical contemporáneo con acabados minimalistas orgánicos.'}</li>
                    </ul>
                    <p className="font-bold text-luxury-gold italic mt-4 text-lg">
                        {lang === 'en' ? 'Here, nature will not be an accessory. It will be the heart of the project.' : lang === 'fr' ? 'Ici, la nature ne sera pas un accessoire. Ce sera le cœur du projet.' : 'Aquí, la naturaleza no será un complemento. Será el corazón del proyecto.'}
                    </p>
                </div>
            </ReadMore>
          </div>
          <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-sm overflow-hidden shadow-2xl">
            <Image src="/images/miches-eco-resort-entorno.jpg" alt="Diseño sostenible y senderos ecológicos del Eco-Resort en el Caribe" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 border-2 md:border-4 border-luxury-gold/20 m-2 md:m-4"></div>
          </div>
        </div>
      </section>

      {/* Section 4: Zig-Zag Left - Agriculture */}
      <section className="py-8 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-dark-gray/30 rounded-3xl border border-white/5 my-4 md:my-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
          <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
            <Image src="/images/miches-eco-resort-agricultura.jpg" alt="Agricultura ecológica y huertos sostenibles en el proyecto inmobiliario de Miches" fill className="object-cover" />
          </div>
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
            <ReadMore
                preview={
                    <>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-gold uppercase tracking-wider mb-4 md:mb-6 leading-tight">
                          {lang === 'en' ? '🌱 Organic Farming and Sustainable Consumption' : lang === 'fr' ? '🌱 Agriculture Biologique et Consommation Durable' : '🌱 Agricultura Ecológica y Consumo Sostenible'}
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {lang === 'en' ? 'As a fundamental part of the ecological concept, the project will have areas specially designated for growing vegetables, fruits, aromatic herbs, and some of the food to be consumed within the complex.' : lang === 'fr' ? 'Élément fondamental du concept écologique, le projet comprendra des zones spécialement désignées pour la culture de légumes, fruits, herbes aromatiques et une partie des aliments qui seront consommés dans le complexe.' : 'Como parte fundamental del concepto ecológico del desarrollo, el proyecto contará con áreas especialmente destinadas al cultivo de vegetales, frutas, hierbas aromáticas y algunos de los alimentos que serán consumidos dentro del complejo.'}
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed mt-4">
                            {lang === 'en' ? 'The goal is to integrate a healthier, more sustainable lifestyle connected to the earth, allowing part of the project\'s gastronomic experience to come directly from its own crops.' : lang === 'fr' ? 'L\'objectif est d\'intégrer un mode de vie plus sain, durable et connecté à la terre, permettant à une partie de l\'expérience gastronomique du projet de provenir directement de ses propres cultures.' : 'El objetivo es integrar un modelo de vida más saludable, sostenible y conectado con la tierra, permitiendo que parte de la experiencia gastronómica del proyecto provenga directamente de sus propios cultivos.'}
                        </p>
                    </>
                }
            >
                <div className="space-y-6 text-gray-400 mt-4">
                    <div>
                        <p className="mb-3 text-white font-bold">
                          {lang === 'en' ? 'These areas will include:' : lang === 'fr' ? 'Ces zones comprendront :' : 'Estas áreas incluirán:'}
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <li className="flex items-center gap-2"><FaSeedling className="text-green-500"/> {lang === 'en' ? 'Organized organic orchards.' : lang === 'fr' ? 'Vergers biologiques organisés.' : 'Huertos ecológicos organizados.'}</li>
                            <li className="flex items-center gap-2"><FaSeedling className="text-green-500"/> {lang === 'en' ? 'Fresh vegetable farming.' : lang === 'fr' ? 'Culture de légumes frais.' : 'Cultivo de vegetales frescos.'}</li>
                            <li className="flex items-center gap-2"><FaTree className="text-green-500"/> {lang === 'en' ? 'Herb and spice gardens.' : lang === 'fr' ? 'Jardins d\'herbes et d\'épices.' : 'Jardines de hierbas y especias.'}</li>
                            <li className="flex items-center gap-2"><FaTree className="text-green-500"/> {lang === 'en' ? 'Selective tropical production.' : lang === 'fr' ? 'Production tropicale sélective.' : 'Producción tropical selectiva.'}</li>
                            <li className="flex items-center gap-2 sm:col-span-2"><FaHome className="text-luxury-gold"/> {lang === 'en' ? 'Agricultural spaces for internal consumption.' : lang === 'fr' ? 'Espaces agricoles pour consommation interne.' : 'Espacios agrícolas para consumo interno.'}</li>
                        </ul>
                    </div>
                    
                    <div>
                        <p className="mb-3 text-white font-bold">
                          {lang === 'en' ? 'Part of these products may be used in:' : lang === 'fr' ? 'Une partie de ces produits pourra être utilisée dans :' : 'Parte de estos productos podrán ser utilizados en:'}
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>{lang === 'en' ? 'The main restaurant.' : lang === 'fr' ? 'Le restaurant principal.' : 'El restaurante principal.'}</li>
                            <li>{lang === 'en' ? 'The sales room, bar, and lounge of the vacation club, enhancing an organic mixology concept.' : lang === 'fr' ? 'La salle des ventes, le bar et le salon du club de vacances, renforçant un concept de mixologie biologique.' : 'La Sala de venta, bar y lounge del club de vacaciones, potenciando un concepto de mixología orgánica.'}</li>
                            <li>{lang === 'en' ? 'Farm-to-table culinary experiences.' : lang === 'fr' ? 'Expériences culinaires de la ferme à la table.' : 'Experiencias culinarias farm-to-table (de la tierra a la mesa).'}</li>
                            <li>{lang === 'en' ? 'Ecological and educational activities for guests and residents.' : lang === 'fr' ? 'Activités écologiques et éducatives pour invités et résidents.' : 'Actividades ecológicas y educativas para huéspedes y residentes.'}</li>
                        </ul>
                    </div>

                    <p className="font-bold text-luxury-gold text-lg mt-6 border-l-2 border-luxury-gold pl-4">
                        {lang === 'en' ? 'This approach seeks to promote healthy eating, sustainable production, and authentic ecological experiences. More than a tourism project, it will be a lifestyle focused on sustainability and comprehensive wellness.' : lang === 'fr' ? 'Cette approche vise à promouvoir une alimentation saine, une production durable et des expériences écologiques authentiques. Plus qu\'un projet touristique, ce sera un style de vie axé sur la durabilité et le bien-être global.' : 'Este enfoque busca promover la alimentación saludable, la producción sostenible y experiencias ecológicas auténticas. Más que un proyecto turístico, será un estilo de vida enfocado en la sostenibilidad y el bienestar integral.'}
                    </p>
                </div>
            </ReadMore>
          </div>
        </div>
      </section>

      {/* Section 4.5: Un Nuevo Estilo de Vida */}
      <section className="py-8 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white uppercase tracking-wider">
                {lang === 'en' ? '🏡 A New Lifestyle' : lang === 'fr' ? '🏡 Un Nouveau Style de Vie' : '🏡 Un Nuevo Estilo de Vida'}
            </h2>
            <ReadMore
                preview={
                    <>
                        <p className="text-xl text-gray-300 leading-relaxed mb-6">
                            {lang === 'en' ? 'The project will masterfully combine exclusive vacation residences, a boutique hotel concept, world-class wellness spaces, eco-luxury experiences, and premium amenities integrated into nature.' : lang === 'fr' ? 'Le projet combinera de manière magistrale des résidences de vacances exclusives, un concept d\'hôtel-boutique, des espaces de bien-être de classe mondiale, des expériences éco-luxe et des commodités haut de gamme intégrées à la nature.' : 'El proyecto combinará de forma magistral residencias vacacionales exclusivas, concepto hotelero boutique, espacios wellness de clase mundial, experiencias eco-luxury y amenidades premium integradas a la naturaleza.'}
                        </p>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            {lang === 'en' ? 'The future units will consist of modern tropical cabins with a unique architectural design, surrounded by gardens, nature trails, and privileged views of the river and green areas.' : lang === 'fr' ? 'Les futures unités seront composées de cabines tropicales modernes au design architectural unique, entourées de jardins, de sentiers naturels et offrant des vues privilégiées sur la rivière et les espaces verts.' : 'Las futuras unidades estarán conformadas por modernas cabañas tropicales de diseño arquitectónico único, rodeadas de jardines, senderos naturales y vistas privilegiadas hacia el río y las áreas verdes.'}
                        </p>
                    </>
                }
            >
                <div className="bg-black/40 p-8 rounded-xl border border-white/10 mt-6 text-left">
                    <p className="text-gray-400 leading-relaxed mb-6">
                        {lang === 'en' ? 'To ensure agile, efficient development perfectly integrated into the environment, the structural modulation of the cabins and villas is planned using 6-inch blocks, achieving clean, lightweight walls with an impeccable organic minimalist aesthetic.' : lang === 'fr' ? 'Pour garantir un développement agile, efficace et parfaitement intégré à l\'environnement, la modulation structurelle des cabines et des villas est prévue à l\'aide de blocs de 6 pouces, obtenant ainsi des murs épurés et légers avec une esthétique minimaliste organique impeccable.' : 'Para garantizar un desarrollo ágil, eficiente y perfectamente integrado al entorno, la modulación estructural de las cabañas y villas está proyectada utilizando bloques de 6 pulgadas, logrando muros limpios, ligeros y de una estética minimalista orgánica impecable.'}
                    </p>
                    <p className="text-white font-bold mb-4 uppercase tracking-wider text-sm">
                      {lang === 'en' ? 'Every detail will seek to offer:' : lang === 'fr' ? 'Chaque détail cherchera à offrir :' : 'Cada detalle buscará ofrecer:'}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-center text-sm md:text-base">
                        <div className="bg-zinc-900 p-3 md:p-4 rounded-lg border border-luxury-gold/20 text-luxury-gold font-bold">{lang === 'en' ? 'Privacy and Peace' : lang === 'fr' ? 'Intimité et Paix' : 'Privacidad y Paz'}</div>
                        <div className="bg-zinc-900 p-3 md:p-4 rounded-lg border border-luxury-gold/20 text-luxury-gold font-bold">{lang === 'en' ? 'Natural Connection' : lang === 'fr' ? 'Connexion Naturelle' : 'Conexión Natural'}</div>
                        <div className="bg-zinc-900 p-3 md:p-4 rounded-lg border border-luxury-gold/20 text-luxury-gold font-bold">{lang === 'en' ? 'High Profitability' : lang === 'fr' ? 'Haute Rentabilité' : 'Alta Rentabilidad'}</div>
                        <div className="bg-zinc-900 p-3 md:p-4 rounded-lg border border-luxury-gold/20 text-luxury-gold font-bold">{lang === 'en' ? 'Experiences' : lang === 'fr' ? 'Expériences' : 'Experiencias'}</div>
                    </div>
                </div>
            </ReadMore>
        </div>
      </section>

      {/* Section 5: Full Width Grid - Amenities */}
      <section className="py-8 md:py-24 bg-black relative border-t border-b border-luxury-gold/20">
        <div className="absolute inset-0 opacity-20">
             <Image src="/images/the-beach-wellness-yoga-deck-punta-cana.jpg" alt="Textura de bienestar y yoga representativa de la vida sustentable en Punta Cana" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif font-bold text-white mb-10 md:mb-16 uppercase leading-tight">
                {lang === 'en' ? '🌊 AMENITIES AND EXPERIENCES' : lang === 'fr' ? '🌊 COMMODITÉS ET EXPÉRIENCES' : '🌊 AMENIDADES Y EXPERIENCIAS'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                    <div className="w-full h-32 sm:h-40 md:h-48 relative mb-3 md:mb-4 rounded-lg overflow-hidden border-2 border-luxury-gold/30 shadow-xl">
                        <Image src="/images/miches-eco-resort-cabana.jpg" alt="Diseño arquitectónico de cabañas ecológicas tropicales de lujo" fill className="object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="font-bold text-gray-200 uppercase text-xs md:text-sm tracking-wider">Cabañas Tropicales</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-full h-32 sm:h-40 md:h-48 relative mb-3 md:mb-4 rounded-lg overflow-hidden border-2 border-luxury-gold/30 shadow-xl">
                        <Image src="/images/miches-eco-resort-casaclub.jpg" alt="Casa Club panorámica con vistas al ecosistema natural en República Dominicana" fill className="object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="font-bold text-gray-200 uppercase text-xs md:text-sm tracking-wider">Casa Club Panorámica</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-full h-32 sm:h-40 md:h-48 relative mb-3 md:mb-4 rounded-lg overflow-hidden border-2 border-luxury-gold/30 shadow-xl">
                        <Image src="/images/miches-eco-resort-piscina.jpg" alt="Piscinas infinity integradas a la naturaleza para residentes e inversionistas" fill className="object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="font-bold text-gray-200 uppercase text-xs md:text-sm tracking-wider">Piscinas Infinity</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-full h-32 sm:h-40 md:h-48 relative mb-3 md:mb-4 rounded-lg overflow-hidden border-2 border-luxury-gold/30 shadow-xl">
                        <Image src="/images/miches-eco-resort-spa.jpg" alt="Área Wellness y Spa de lujo al aire libre en Miches" fill className="object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="font-bold text-gray-200 uppercase text-xs md:text-sm tracking-wider">Área Wellness &amp; Spa</p>
                </div>
            </div>
            </div>
            <div className="mt-8 md:mt-12 max-w-3xl mx-auto text-left px-4">
                <ReadMore
                    preview={
                        <p className="text-gray-300 text-lg text-center">
                            {lang === 'en' ? 'The project will include a portfolio of first-class amenities integrated into a carefully designed tropical environment.' : lang === 'fr' ? 'Le projet comprendra un portefeuille de commodités de premier ordre intégrées dans un environnement tropical soigneusement conçu.' : 'El proyecto incluirá un portafolio de amenidades de primer nivel integrado en un ambiente tropical cuidadosamente diseñado.'}
                        </p>
                    }
                    moreText={lang === 'en' ? 'See all Amenities' : lang === 'fr' ? 'Voir toutes les Commodités' : 'Ver todas las Amenidades'}
                >
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-gray-300 mt-6 bg-white/5 p-4 sm:p-6 md:p-8 rounded-xl border border-white/10 text-sm md:text-base">
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Modern design tropical cabins' : lang === 'fr' ? 'Cabines tropicales au design moderne' : 'Cabañas tropicales de diseño moderno'}</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Eco-boutique hotel' : lang === 'fr' ? 'Hôtel-boutique écologique' : 'Hotel boutique ecológico'}</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Panoramic Clubhouse' : lang === 'fr' ? 'Clubhouse Panoramique' : 'Casa Club panorámica'}</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Sales room and Restaurant' : lang === 'fr' ? 'Salle de vente et Restaurant' : 'Sala de venta y Restaurante'}</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Natural infinity pools' : lang === 'fr' ? 'Piscines infinity naturelles' : 'Piscinas infinity naturales'}</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Ecological trails in the forest' : lang === 'fr' ? 'Sentiers écologiques dans la forêt' : 'Senderos ecológicos en el bosque'}</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Outdoor wellness & spa area' : lang === 'fr' ? 'Espace bien-être et spa en plein air' : 'Área wellness & spa al aire libre'}</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Sports amenities and recreation' : lang === 'fr' ? 'Commodités sportives et loisirs' : 'Amenidades deportivas y recreación'}</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Coworking for digital nomads' : lang === 'fr' ? 'Espace de coworking pour nomades numériques' : 'Coworking para nómadas digitales'}</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Viewpoints and social areas' : lang === 'fr' ? 'Points de vue et espaces sociaux' : 'Miradores y áreas sociales'}</li>
                        <li className="flex items-center gap-3 md:col-span-2"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Orchards and organic farming areas' : lang === 'fr' ? 'Vergers et zones de culture biologique' : 'Huertos y áreas de cultivo orgánico'}</li>
                    </ul>
                    <p className="text-center text-luxury-gold font-bold italic mt-6 text-sm md:text-base">
                        {lang === 'en' ? 'Conveys exclusivity, tranquility, and connection with the surroundings.' : lang === 'fr' ? 'Transmet exclusivité, tranquillité et connexion avec l\'environnement.' : 'Transmite exclusividad, tranquilidad y conexión con el entorno.'}
                    </p>
                </ReadMore>
            </div>
      </section>

      {/* Section 6: Zig-Zag Right - Hotel & Investment */}
      <section className="py-8 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 md:gap-16">
          <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-gold uppercase tracking-wider leading-tight">
                {lang === 'en' ? '🏨 Hotel Experience + Investment' : lang === 'fr' ? '🏨 Expérience Hôtelière + Investissement' : '🏨 Experiencia Hotelera + Inversión'}
            </h2>
            <ReadMore
                preview={
                    <p className="text-gray-300 text-lg leading-relaxed">
                        {lang === 'en' ? 'In addition to being a destination to live and disconnect, the project has been conceived under an innovative tourism investment model.' : lang === 'fr' ? 'En plus d\'être une destination pour vivre et se déconnecter, le projet a été conçu selon un modèle d\'investissement touristique innovant.' : 'Además de ser un destino para vivir y desconectarse, el proyecto ha sido concebido bajo un innovador modelo de inversión turística.'}
                    </p>
                }
            >
                <div className="bg-dark-gray p-6 rounded-lg border-l-4 border-luxury-gold mt-6">
                    <h3 className="text-2xl font-bold text-white mb-4">🔑 Sistema Pool Hotelero</h3>
                    <p className="text-gray-300 mb-4">{lang === 'en' ? 'Units can be integrated into a hotel operation system allowing owners to:' : lang === 'fr' ? 'Les unités pourront être intégrées à un système d\'exploitation hôtelière permettant aux propriétaires :' : 'Las unidades podrán integrarse a un sistema de operación hotelera permitiendo a los propietarios:'}</p>
                    <ul className="space-y-3 text-gray-300 pl-4 border-l border-white/10 ml-2">
                        <li className="flex items-start gap-2"><span className="text-luxury-gold font-bold">✓</span> {lang === 'en' ? 'Generate consistent passive income through vacation rentals.' : lang === 'fr' ? 'Générer des revenus constants grâce aux locations de vacances.' : 'Generar ingresos constantes mediante rentas vacacionales.'}</li>
                        <li className="flex items-start gap-2"><span className="text-luxury-gold font-bold">✓</span> {lang === 'en' ? 'Participate in a professionally managed model with no operational complications.' : lang === 'fr' ? 'Participer à un modèle géré par des professionnels sans complications opérationnelles.' : 'Participar en un modelo administrado profesionalmente sin complicaciones operativas.'}</li>
                        <li className="flex items-start gap-2"><span className="text-luxury-gold font-bold">✓</span> {lang === 'en' ? 'Enjoy your vacation property while it produces high profitability.' : lang === 'fr' ? 'Profiter de votre propriété de vacances pendant qu\'elle produit une forte rentabilité.' : 'Disfrutar de su propiedad vacacional mientras produce alta rentabilidad.'}</li>
                        <li className="flex items-start gap-2"><span className="text-luxury-gold font-bold">✓</span> {lang === 'en' ? 'Access an organized, premium hotel experience with international standards.' : lang === 'fr' ? 'Accéder à une expérience hôtelière organisée, haut de gamme et de standard international.' : 'Acceder a una experiencia hotelera organizada, premium y de estándar internacional.'}</li>
                    </ul>
                    <p className="text-gray-400 mt-6 italic">
                        {lang === 'en' ? 'This model combines personal use, real estate investment, tourism operation, and centralized administration, creating a highly attractive and secure proposition for national and international investors.' : lang === 'fr' ? 'Ce modèle combine l\'utilisation personnelle, l\'investissement immobilier, l\'exploitation touristique et l\'administration centralisée, créant une proposition hautement attrayante et sécurisée pour les investisseurs nationaux et internationaux.' : 'Este modelo combina el uso personal, la inversión inmobiliaria, la operación turística y la administración centralizada, creando una propuesta altamente atractiva y segura para inversionistas nacionales e internacionales.'}
                    </p>
                </div>
                
                <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg mt-8">
                    <p className="text-white font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span>⚠️</span> {lang === 'en' ? 'Note for Investors' : lang === 'fr' ? 'Note aux Investisseurs' : 'Nota para Inversionistas'}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {lang === 'en' ? 'In order to guarantee maximum financial stability, asset protection, and ease in international transactions, pre-sale prices and Hotel Pool return projections will be handled exclusively in US Dollars (USD).' : lang === 'fr' ? 'Afin de garantir une stabilité financière maximale, la protection du patrimoine et la facilité des transactions internationales, les prix de prévente et les projections de rendement du Pool Hôtelier seront gérés exclusivement en dollars américains (USD).' : 'Con el fin de garantizar la máxima estabilidad financiera, protección patrimonial y facilidad en las transacciones internacionales, los precios de preventa y proyecciones de retorno del Pool Hotelero se manejarán exclusivamente en Dólares Estadounidenses (USD).'}
                    </p>
                </div>
            </ReadMore>
          </div>
          <div className="w-full lg:w-1/2 relative h-[350px] sm:h-[450px] lg:h-[600px] rounded-sm overflow-hidden shadow-2xl">
            <Image src="/images/miches-eco-resort-inversion-interior.jpg" alt="Experiencia hotelera premium y alta rentabilidad por inversión en bienes raíces" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 border-2 md:border-4 border-luxury-gold/20 m-2 md:m-4"></div>
          </div>
        </div>
      </section>

      {/* Section 7: Developer & Current Phase */}
      <section className="py-8 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-4 md:space-y-6">
                <h2 className="text-3xl font-serif font-bold text-white uppercase tracking-wider text-center md:text-left">
                  {lang === 'en' ? '🏗️ Developed By:' : lang === 'fr' ? '🏗️ Développé Par:' : '🏗️ Desarrollado Por:'}
                </h2>
                <div className="flex flex-row items-center justify-center md:justify-start gap-4 sm:gap-8 mb-6 bg-white/5 p-4 rounded-xl w-full sm:w-fit mx-auto md:mx-0">
                    <Image src="/images/logo-pci-investments-gold.webp" alt="Punta Cana Investments" width={160} height={80} className="object-contain drop-shadow-md w-[110px] sm:w-[160px]" />
                    <div className="h-10 sm:h-16 w-px bg-luxury-gold/30 shrink-0"></div>
                    <Image src="/images/logo-pci-construction-gold.webp" alt="PCI Construction Group" width={160} height={80} className="object-contain drop-shadow-md w-[110px] sm:w-[160px]" />
                </div>
                <ReadMore
                    preview={
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {lang === 'en' ? 'This future project will be jointly developed by Punta Cana Investments and PCI CONSTRUCTION GROUP PUNTA CANA, companies focused on the development of modern, sustainable, and high architectural value projects in the Dominican Republic.' : lang === 'fr' ? 'Ce futur projet sera développé conjointement par Punta Cana Investments et PCI CONSTRUCTION GROUP PUNTA CANA, des entreprises axées sur le développement de projets modernes, durables et à haute valeur architecturale en République Dominicaine.' : 'Este futuro proyecto será desarrollado conjuntamente por Punta Cana Investments y PCI CONSTRUCTION GROUP PUNTA CANA, empresas enfocadas en el desarrollo de proyectos modernos, sostenibles y de alto valor arquitectónico en la República Dominicana.'}
                        </p>
                    }
                >
                    <div className="mt-4">
                        <p className="text-white font-bold mb-4">{lang === 'en' ? 'The corporate vision is to create spaces that perfectly combine:' : lang === 'fr' ? 'La vision de l\'entreprise est de créer des espaces qui combinent parfaitement :' : 'La visión corporativa es crear espacios que combinen a la perfección:'}</p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-300"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Design and Innovation' : lang === 'fr' ? 'Design et Innovation' : 'Diseño e Innovación'}</li>
                            <li className="flex items-center gap-3 text-gray-300"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Strict Construction Quality' : lang === 'fr' ? 'Qualité de Construction Stricte' : 'Calidad Constructiva Estricta'}</li>
                            <li className="flex items-center gap-3 text-gray-300"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Absolute Respect for Nature' : lang === 'fr' ? 'Respect Absolu de la Nature' : 'Respeto Absoluto a la Naturaleza'}</li>
                            <li className="flex items-center gap-3 text-gray-300"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'Elevated Tourism Experience' : lang === 'fr' ? 'Expérience Touristique Élevée' : 'Experiencia Turística Elevada'}</li>
                            <li className="flex items-center gap-3 text-gray-300"><span className="text-luxury-gold">✓</span> {lang === 'en' ? 'High Investment Value' : lang === 'fr' ? 'Haute Valeur d\'Investissement' : 'Alto Valor de Inversión'}</li>
                        </ul>
                    </div>
                </ReadMore>
            </div>
            <div className="bg-dark-gray p-6 sm:p-8 md:p-10 rounded-2xl relative overflow-hidden mt-8 md:mt-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-full blur-3xl"></div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-luxury-gold uppercase tracking-wider mb-6 md:mb-8 text-center md:text-left">{lang === 'en' ? '🚧 Conceptualization Phase' : lang === 'fr' ? '🚧 Phase de Conceptualisation' : '🚧 Fase de Conceptualización'}</h2>
                <p className="text-gray-300 mb-4 md:mb-6 text-base md:text-lg text-center md:text-left">{lang === 'en' ? 'We are currently actively working on:' : lang === 'fr' ? 'Nous travaillons actuellement activement sur :' : 'Actualmente nos encontramos trabajando activamente en:'}</p>
                <ul className="space-y-3 text-gray-200 mb-8 list-disc pl-5">
                    <li>{lang === 'en' ? 'Project Master Plan' : lang === 'fr' ? 'Plan Directeur du Projet (Master Plan)' : 'Diseño maestro del proyecto (Master Plan)'}</li>
                    <li>{lang === 'en' ? 'Architectural development and sustainable engineering' : lang === 'fr' ? 'Développement architectural et ingénierie durable' : 'Desarrollo arquitectónico e ingenierías sostenibles'}</li>
                    <li>{lang === 'en' ? 'Ecological integration and environmental mitigation' : lang === 'fr' ? 'Intégration écologique et atténuation environnementale' : 'Integración ecológica y mitigación ambiental'}</li>
                    <li>{lang === 'en' ? 'Hotel and hospitality conceptualization' : lang === 'fr' ? 'Conceptualisation de l\'hôtel et de l\'hospitalité' : 'Conceptualización hotelera y de hospitalidad'}</li>
                    <li>{lang === 'en' ? 'Urban and land sustainability studies' : lang === 'fr' ? 'Études d\'urbanisme et de durabilité des sols' : 'Estudios urbanísticos y de sostenibilidad del terreno'}</li>
                    <li>{lang === 'en' ? 'Design of exclusive experiences and amenities' : lang === 'fr' ? 'Conception d\'expériences et de commodités exclusives' : 'Diseño de experiencias y amenidades exclusivas'}</li>
                </ul>
                <div className="bg-white/5 p-4 rounded-lg border border-luxury-gold/20">
                    <p className="text-white font-bold italic mb-2 text-sm text-luxury-gold uppercase tracking-widest">{lang === 'en' ? 'Very soon we will be revealing:' : lang === 'fr' ? 'Très bientôt nous dévoilerons :' : 'Muy pronto estaremos revelando:'}</p>
                    <p className="text-gray-300 text-sm">{lang === 'en' ? 'Official renders and 3D tours, final Master Plan design, financial information and price lists (USD), launch stages and construction schedule, and exclusive pre-sale benefits for founders.' : lang === 'fr' ? 'Rendus officiels et visites 3D, conception finale du plan directeur, informations financières et listes de prix (USD), étapes de lancement et calendrier de construction, et avantages exclusifs de prévente pour les fondateurs.' : 'Renders oficiales y recorridos 3D, Diseño definitivo del Master Plan, Información financiera y listas de precios (USD), Etapas de lanzamiento y cronograma de obra, y Beneficios exclusivos de preventa para fundadores.'}</p>
                </div>
            </div>
        </div>
      </section>

      {/* Founder Access Section */}
      <section className="py-8 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-zinc-900 to-black border border-luxury-gold/30 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl hidden md:block"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl hidden md:block"></div>
            
            <div className="text-center mb-10 md:mb-12 relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-luxury-gold/10 text-luxury-gold mb-6 border border-luxury-gold/20 shadow-lg">
                    <FaLock className="text-xl md:text-2xl" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 uppercase tracking-wider leading-tight">{lang === 'en' ? 'Exclusive Access:' : lang === 'fr' ? 'Accès Exclusif:' : 'Acceso Exclusivo:'} <br className="hidden sm:block" /><span className="text-luxury-gold">{lang === 'en' ? 'Phase Zero Launch' : lang === 'fr' ? 'Lancement Phase Zéro' : 'Fase de Lanzamiento Cero'}</span></h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    {lang === 'en' ? 'The success of real estate investments lies in getting in first. By registering today, you gain absolute priority before the project is released to the mass international market.' : lang === 'fr' ? 'Le succès des investissements immobiliers réside dans le fait d\'y entrer en premier. En vous inscrivant aujourd\'hui, vous obtenez la priorité absolue avant que le projet ne soit diffusé sur le marché international de masse.' : 'El éxito de las inversiones inmobiliarias radica en entrar primero. Al registrarte hoy, obtienes prioridad absoluta antes de que el proyecto sea liberado al mercado internacional masivo.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 relative z-10">
                <div className="bg-black/40 p-6 md:p-8 rounded-xl border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300">
                    <div className="text-luxury-gold text-3xl mb-4">🏷️</div>
                    <h3 className="text-white font-bold text-lg mb-3 uppercase tracking-wider">{lang === 'en' ? 'Zero Price' : lang === 'fr' ? 'Prix Zéro' : 'Precio Cero'}</h3>
                    <p className="text-gray-400 leading-relaxed">{lang === 'en' ? 'Guaranteed discount from "Founder Price List" (the lowest value per sq. meter of the entire project cycle).' : lang === 'fr' ? 'Remise garantie sur la "Liste de Prix Fondateur" (la valeur par m² la plus basse de tout le cycle du projet).' : 'Descuento garantizado de "Lista de Precios de Fundador" (el valor por m² más bajo de todo el ciclo del proyecto).'}</p>
                </div>
                <div className="bg-black/40 p-6 md:p-8 rounded-xl border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300">
                    <div className="text-luxury-gold text-3xl mb-4">🗺️</div>
                    <h3 className="text-white font-bold text-lg mb-3 uppercase tracking-wider">{lang === 'en' ? 'Master Plan Choice' : lang === 'fr' ? 'Choix du Master Plan' : 'Elección de Master Plan'}</h3>
                    <p className="text-gray-400 leading-relaxed">{lang === 'en' ? 'Priority to choose the best cabin locations (riverfront or near the Clubhouse) before anyone else.' : lang === 'fr' ? 'Priorité pour choisir les meilleurs emplacements de cabines (face à la rivière ou près du Clubhouse) avant tout le monde.' : 'Prioridad para elegir las mejores ubicaciones de cabañas (frente al río o cercanas a la Casa Club) antes que nadie.'}</p>
                </div>
                <div className="bg-black/40 p-6 md:p-8 rounded-xl border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300">
                    <div className="text-luxury-gold text-3xl mb-4">📄</div>
                    <h3 className="text-white font-bold text-lg mb-3 uppercase tracking-wider">{lang === 'en' ? 'Financial Dossier' : lang === 'fr' ? 'Dossier Financier' : 'Dossier Financiero'}</h3>
                    <p className="text-gray-400 leading-relaxed">{lang === 'en' ? 'Immediate delivery of the exclusive estimated ROI projections of the Hotel Pool for investors (USD).' : lang === 'fr' ? 'Envoi immédiat des projections de ROI estimées exclusives du Pool Hôtelier pour les investisseurs (USD).' : 'Envío inmediato de las proyecciones estimadas de ROI del Pool Hotelero exclusivo para inversionistas (USD).'}</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto bg-black/60 p-4 sm:p-6 md:p-10 rounded-2xl border border-luxury-gold/40 shadow-2xl relative z-10">
                <div className="text-center mb-6 md:mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3">{lang === 'en' ? 'I Want to Be a Founding Investor' : lang === 'fr' ? 'Je Veux Devenir Investisseur Fondateur' : 'Quiero Ser Inversionista Fundador'}</h3>
                    <div className="inline-block bg-red-900/40 border border-red-500/50 px-4 py-2 rounded-full">
                        <p className="text-red-200 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            {lang === 'en' ? 'Priority spots limited to the first 15 units.' : lang === 'fr' ? 'Places prioritaires limitées aux 15 premières unités.' : 'Cupos prioritarios limitados a las primeras 15 unidades.'}
                        </p>
                    </div>
                </div>
                <FounderInvestmentForm 
                    dict={dict.contact.form} 
                    lang={lang} 
                />
            </div>
        </div>
      </section>

      <Footer dict={dict} lang={lang} />
    </main>
  );
}
