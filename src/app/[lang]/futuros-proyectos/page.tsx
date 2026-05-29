import Image from "next/image";

import { FaLeaf, FaSeedling, FaTree, FaGlassMartiniAlt, FaHome, FaLock } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import FounderInvestmentForm from "@/components/forms/FounderInvestmentForm";
import ReadMore from "@/components/ui/ReadMore";
import { getDictionary } from "@/dictionaries/get-dictionary";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' }> }): Promise<Metadata> {
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

export default async function FuturosProyectosPage({ params }: { params: Promise<{ lang: 'es' | 'en' }> }) {
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
            {lang === 'en' ? 'The Future of' : lang === 'fr' ? "L'Avenir de la" : 'El Futuro de la'} <br className="hidden sm:block" /> <span className="text-luxury-gold italic">{lang === 'en' ? 'Ecological Life' : lang === 'fr' ? 'Vie Écologique' : 'Vida Ecológica'}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-3xl text-gray-200 font-light max-w-4xl mx-auto drop-shadow-md">
            {lang === 'en' ? 'and Experience Tourism in the Caribbean' : lang === 'fr' ? "et du Tourisme d'Expérience dans les Caraïbes" : 'y el Turismo de Experiencias en el Caribe'}
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
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-gold uppercase tracking-wider mb-4 md:mb-6 leading-tight">Un Desarrollo Ecológico de Nueva Generación</h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      Muy pronto llegará un proyecto concebido para transformar la manera de vivir, invertir y conectar con la naturaleza.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      Diseñado para integrar arquitectura moderna tropical, sostenibilidad, bienestar y experiencias hoteleras premium en un entorno natural verdaderamente extraordinario.
                    </p>
                </>
              }
            >
              <div className="space-y-4 text-gray-400 mt-4">
                <p>
                  Ubicado sobre una impresionante propiedad de aproximadamente 50,000 m² rodeada de exuberante vegetación y un río natural que recorre toda la parte posterior del proyecto, este concepto nace con una visión clara:
                </p>
                <blockquote className="border-l-4 border-luxury-gold pl-6 text-xl italic text-white font-serif mt-6">
                  &quot;Crear un santuario tropical donde la naturaleza y el lujo convivan en perfecta armonía.&quot;
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
                {lang === 'en' ? 'This will not be a traditional project. The essence of the development is based on the preservation of the natural environment and an authentic ecological living experience.' : lang === 'fr' ? "Ce ne sera pas un projet traditionnel. L'essence du développement est basée sur la préservation de l'environnement naturel et une expérience de vie écologique authentique." : 'Este no será un proyecto tradicional. La esencia del desarrollo está basada en la preservación del entorno natural y en una experiencia de vida ecológica auténtica.'}
            </p>
         </div>
      </section>

      {/* Section 3: Zig-Zag Right */}
      <section className="py-8 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 md:gap-16">
          <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wider mb-4 md:mb-6">Respeto por el Entorno</h3>
            <ReadMore
                preview={
                    <>
                        <ul className="space-y-4">
                            {[
                                "La topografía natural del terreno",
                                "La vegetación existente",
                                "La integración visual con el río",
                                "La circulación ecológica peatonal",
                                "La armonía entre arquitectura y paisaje"
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
                    <p>Cada espacio ha sido pensado para generar una conexión directa con la naturaleza:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Senderos ecológicos entre árboles tropicales.</li>
                        <li>Miradores y decks estratégicos frente al río.</li>
                        <li>Espacios abiertos para relajación, meditación y bienestar.</li>
                        <li>Áreas verdes preservadas y planes de reforestación nativa.</li>
                        <li>Diseño sostenible y tropical contemporáneo con acabados minimalistas orgánicos.</li>
                    </ul>
                    <p className="font-bold text-luxury-gold italic mt-4 text-lg">
                        Aquí, la naturaleza no será un complemento. Será el corazón del proyecto.
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
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-gold uppercase tracking-wider mb-4 md:mb-6 leading-tight">🌱 Agricultura Ecológica y Consumo Sostenible</h2>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Como parte fundamental del concepto ecológico del desarrollo, el proyecto contará con áreas especialmente destinadas al cultivo de vegetales, frutas, hierbas aromáticas y algunos de los alimentos que serán consumidos dentro del complejo.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed mt-4">
                            El objetivo es integrar un modelo de vida más saludable, sostenible y conectado con la tierra, permitiendo que parte de la experiencia gastronómica del proyecto provenga directamente de sus propios cultivos.
                        </p>
                    </>
                }
            >
                <div className="space-y-6 text-gray-400 mt-4">
                    <div>
                        <p className="mb-3 text-white font-bold">Estas áreas incluirán:</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <li className="flex items-center gap-2"><FaSeedling className="text-green-500"/> Huertos ecológicos organizados.</li>
                            <li className="flex items-center gap-2"><FaSeedling className="text-green-500"/> Cultivo de vegetales frescos.</li>
                            <li className="flex items-center gap-2"><FaTree className="text-green-500"/> Jardines de hierbas y especias.</li>
                            <li className="flex items-center gap-2"><FaTree className="text-green-500"/> Producción tropical selectiva.</li>
                            <li className="flex items-center gap-2 sm:col-span-2"><FaHome className="text-luxury-gold"/> Espacios agrícolas para consumo interno.</li>
                        </ul>
                    </div>
                    
                    <div>
                        <p className="mb-3 text-white font-bold">Parte de estos productos podrán ser utilizados en:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>El restaurante principal.</li>
                            <li>La Sala de venta, bar y lounge del club de vacaciones, potenciando un concepto de mixología orgánica.</li>
                            <li>Experiencias culinarias farm-to-table (de la tierra a la mesa).</li>
                            <li>Actividades ecológicas y educativas para huéspedes y residentes.</li>
                        </ul>
                    </div>

                    <p className="font-bold text-luxury-gold text-lg mt-6 border-l-2 border-luxury-gold pl-4">
                        Este enfoque busca promover la alimentación saludable, la producción sostenible y experiencias ecológicas auténticas. Más que un proyecto turístico, será un estilo de vida enfocado en la sostenibilidad y el bienestar integral.
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
                            El proyecto combinará de forma magistral residencias vacacionales exclusivas, concepto hotelero boutique, espacios wellness de clase mundial, experiencias eco-luxury y amenidades premium integradas a la naturaleza.
                        </p>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            Las futuras unidades estarán conformadas por modernas cabañas tropicales de diseño arquitectónico único, rodeadas de jardines, senderos naturales y vistas privilegiadas hacia el río y las áreas verdes.
                        </p>
                    </>
                }
            >
                <div className="bg-black/40 p-8 rounded-xl border border-white/10 mt-6 text-left">
                    <p className="text-gray-400 leading-relaxed mb-6">
                        Para garantizar un desarrollo ágil, eficiente y perfectamente integrado al entorno, la modulación estructural de las cabañas y villas está proyectada utilizando bloques de 6 pulgadas, logrando muros limpios, ligeros y de una estética minimalista orgánica impecable.
                    </p>
                    <p className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Cada detalle buscará ofrecer:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 text-center text-sm md:text-base">
                        <div className="bg-zinc-900 p-3 md:p-4 rounded-lg border border-luxury-gold/20 text-luxury-gold font-bold">Privacidad y Paz</div>
                        <div className="bg-zinc-900 p-3 md:p-4 rounded-lg border border-luxury-gold/20 text-luxury-gold font-bold">Conexión Natural</div>
                        <div className="bg-zinc-900 p-3 md:p-4 rounded-lg border border-luxury-gold/20 text-luxury-gold font-bold">Alta Rentabilidad</div>
                        <div className="bg-zinc-900 p-3 md:p-4 rounded-lg border border-luxury-gold/20 text-luxury-gold font-bold">Experiencias</div>
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
                            El proyecto incluirá un portafolio de amenidades de primer nivel integrado en un ambiente tropical cuidadosamente diseñado.
                        </p>
                    }
                    moreText="Ver todas las Amenidades"
                >
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-gray-300 mt-6 bg-white/5 p-4 sm:p-6 md:p-8 rounded-xl border border-white/10 text-sm md:text-base">
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> Cabañas tropicales de diseño moderno</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> Hotel boutique ecológico</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> Casa Club panorámica</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> Sala de venta y Restaurante</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> Piscinas infinity naturales</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> Senderos ecológicos en el bosque</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> Área wellness &amp; spa al aire libre</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> Amenidades deportivas y recreación</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> Coworking para nómadas digitales</li>
                        <li className="flex items-center gap-3"><span className="text-luxury-gold">✓</span> Miradores y áreas sociales</li>
                        <li className="flex items-center gap-3 md:col-span-2"><span className="text-luxury-gold">✓</span> Huertos y áreas de cultivo orgánico</li>
                    </ul>
                    <p className="text-center text-luxury-gold font-bold italic mt-6 text-sm md:text-base">
                        Transmite exclusividad, tranquilidad y conexión con el entorno.
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
                        Además de ser un destino para vivir y desconectarse, el proyecto ha sido concebido bajo un innovador modelo de inversión turística.
                    </p>
                }
            >
                <div className="bg-dark-gray p-6 rounded-lg border-l-4 border-luxury-gold mt-6">
                    <h3 className="text-2xl font-bold text-white mb-4">🔑 Sistema Pool Hotelero</h3>
                    <p className="text-gray-300 mb-4">Las unidades podrán integrarse a un sistema de operación hotelera permitiendo a los propietarios:</p>
                    <ul className="space-y-3 text-gray-300 pl-4 border-l border-white/10 ml-2">
                        <li className="flex items-start gap-2"><span className="text-luxury-gold font-bold">✓</span> Generar ingresos constantes mediante rentas vacacionales.</li>
                        <li className="flex items-start gap-2"><span className="text-luxury-gold font-bold">✓</span> Participar en un modelo administrado profesionalmente sin complicaciones operativas.</li>
                        <li className="flex items-start gap-2"><span className="text-luxury-gold font-bold">✓</span> Disfrutar de su propiedad vacacional mientras produce alta rentabilidad.</li>
                        <li className="flex items-start gap-2"><span className="text-luxury-gold font-bold">✓</span> Acceder a una experiencia hotelera organizada, premium y de estándar internacional.</li>
                    </ul>
                    <p className="text-gray-400 mt-6 italic">
                        Este modelo combina el uso personal, la inversión inmobiliaria, la operación turística y la administración centralizada, creando una propuesta altamente atractiva y segura para inversionistas nacionales e internacionales.
                    </p>
                </div>
                
                <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg mt-8">
                    <p className="text-white font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span>⚠️</span> Nota para Inversionistas
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Con el fin de garantizar la máxima estabilidad financiera, protección patrimonial y facilidad en las transacciones internacionales, los precios de preventa y proyecciones de retorno del Pool Hotelero se manejarán exclusivamente en Dólares Estadounidenses (USD).
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
                <h2 className="text-3xl font-serif font-bold text-white uppercase tracking-wider text-center md:text-left">🏗️ Desarrollado Por:</h2>
                <div className="flex flex-row items-center justify-center md:justify-start gap-4 sm:gap-8 mb-6 bg-white/5 p-4 rounded-xl w-full sm:w-fit mx-auto md:mx-0">
                    <Image src="/images/logo-pci-investments-gold.webp" alt="Punta Cana Investments" width={160} height={80} className="object-contain drop-shadow-md w-[110px] sm:w-[160px]" />
                    <div className="h-10 sm:h-16 w-px bg-luxury-gold/30 shrink-0"></div>
                    <Image src="/images/logo-pci-construction-gold.webp" alt="PCI Construction Group" width={160} height={80} className="object-contain drop-shadow-md w-[110px] sm:w-[160px]" />
                </div>
                <ReadMore
                    preview={
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Este futuro proyecto será desarrollado conjuntamente por Punta Cana Investments y PCI CONSTRUCTION GROUP PUNTA CANA, empresas enfocadas en el desarrollo de proyectos modernos, sostenibles y de alto valor arquitectónico en la República Dominicana.
                        </p>
                    }
                >
                    <div className="mt-4">
                        <p className="text-white font-bold mb-4">La visión corporativa es crear espacios que combinen a la perfección:</p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-300"><span className="text-luxury-gold">✓</span> Diseño e Innovación</li>
                            <li className="flex items-center gap-3 text-gray-300"><span className="text-luxury-gold">✓</span> Calidad Constructiva Estricta</li>
                            <li className="flex items-center gap-3 text-gray-300"><span className="text-luxury-gold">✓</span> Respeto Absoluto a la Naturaleza</li>
                            <li className="flex items-center gap-3 text-gray-300"><span className="text-luxury-gold">✓</span> Experiencia Turística Elevada</li>
                            <li className="flex items-center gap-3 text-gray-300"><span className="text-luxury-gold">✓</span> Alto Valor de Inversión</li>
                        </ul>
                    </div>
                </ReadMore>
            </div>
            <div className="bg-dark-gray p-6 sm:p-8 md:p-10 rounded-2xl relative overflow-hidden mt-8 md:mt-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-full blur-3xl"></div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-luxury-gold uppercase tracking-wider mb-6 md:mb-8 text-center md:text-left">🚧 Fase de Conceptualización</h2>
                <p className="text-gray-300 mb-4 md:mb-6 text-base md:text-lg text-center md:text-left">Actualmente nos encontramos trabajando activamente en:</p>
                <ul className="space-y-3 text-gray-200 mb-8 list-disc pl-5">
                    <li>Diseño maestro del proyecto (Master Plan)</li>
                    <li>Desarrollo arquitectónico e ingenierías sostenibles</li>
                    <li>Integración ecológica y mitigación ambiental</li>
                    <li>Conceptualización hotelera y de hospitalidad</li>
                    <li>Estudios urbanísticos y de sostenibilidad del terreno</li>
                    <li>Diseño de experiencias y amenidades exclusivas</li>
                </ul>
                <div className="bg-white/5 p-4 rounded-lg border border-luxury-gold/20">
                    <p className="text-white font-bold italic mb-2 text-sm text-luxury-gold uppercase tracking-widest">Muy pronto estaremos revelando:</p>
                    <p className="text-gray-300 text-sm">Renders oficiales y recorridos 3D, Diseño definitivo del Master Plan, Información financiera y listas de precios (USD), Etapas de lanzamiento y cronograma de obra, y Beneficios exclusivos de preventa para fundadores.</p>
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
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 uppercase tracking-wider leading-tight">Acceso Exclusivo: <br className="hidden sm:block" /><span className="text-luxury-gold">Fase de Lanzamiento Cero</span></h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    El éxito de las inversiones inmobiliarias radica en entrar primero. Al registrarte hoy, obtienes prioridad absoluta antes de que el proyecto sea liberado al mercado internacional masivo.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 relative z-10">
                <div className="bg-black/40 p-6 md:p-8 rounded-xl border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300">
                    <div className="text-luxury-gold text-3xl mb-4">🏷️</div>
                    <h3 className="text-white font-bold text-lg mb-3 uppercase tracking-wider">Precio Cero</h3>
                    <p className="text-gray-400 leading-relaxed">Descuento garantizado de &quot;Lista de Precios de Fundador&quot; (el valor por m² más bajo de todo el ciclo del proyecto).</p>
                </div>
                <div className="bg-black/40 p-6 md:p-8 rounded-xl border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300">
                    <div className="text-luxury-gold text-3xl mb-4">🗺️</div>
                    <h3 className="text-white font-bold text-lg mb-3 uppercase tracking-wider">Elección de Master Plan</h3>
                    <p className="text-gray-400 leading-relaxed">Prioridad para elegir las mejores ubicaciones de cabañas (frente al río o cercanas a la Casa Club) antes que nadie.</p>
                </div>
                <div className="bg-black/40 p-6 md:p-8 rounded-xl border border-white/5 hover:border-luxury-gold/30 transition-colors duration-300">
                    <div className="text-luxury-gold text-3xl mb-4">📄</div>
                    <h3 className="text-white font-bold text-lg mb-3 uppercase tracking-wider">Dossier Financiero</h3>
                    <p className="text-gray-400 leading-relaxed">Envío inmediato de las proyecciones estimadas de ROI del Pool Hotelero exclusivo para inversionistas (USD).</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto bg-black/60 p-4 sm:p-6 md:p-10 rounded-2xl border border-luxury-gold/40 shadow-2xl relative z-10">
                <div className="text-center mb-6 md:mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-3">Quiero Ser Inversionista Fundador</h3>
                    <div className="inline-block bg-red-900/40 border border-red-500/50 px-4 py-2 rounded-full">
                        <p className="text-red-200 text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Cupos prioritarios limitados a las primeras 15 unidades.
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
