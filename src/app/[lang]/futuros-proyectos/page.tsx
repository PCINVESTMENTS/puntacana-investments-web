import Image from "next/image";
import Link from "next/link";
import { FaLeaf, FaSeedling, FaTree, FaSwimmer, FaGlassMartiniAlt, FaHome, FaWater } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getDictionary } from "@/dictionaries/get-dictionary";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';
  const url = `${baseUrl}/${lang}/futuros-proyectos`;
  
  const title = lang === 'en' 
    ? "Miches Eco-Resort Project | Future Projects | Punta Cana Investments" 
    : "Proyecto Eco-Resort en Miches | Futuros Proyectos | Punta Cana Investments";
    
  const description = lang === 'en' 
    ? "Coming Soon: A new ecological destination in Miches, Caribbean. Invest in eco-luxury villas, condo-hotels, and sustainable living in the Dominican Republic." 
    : "Próximamente: Un nuevo destino ecológico en Miches, Caribe. Invierte en villas de eco-lujo, condo-hoteles y vida sostenible en la República Dominicana.";

  const keywords = lang === 'en' 
    ? ["Miches real estate", "Eco-resort Punta Cana", "Sustainable living Dominican Republic", "Invest in Miches", "Hotel pool system investment", "Pre-construction Miches", "Eco-luxury villas Miches"] 
    : ["Bienes raíces Miches", "Eco-resort Punta Cana", "Vida sostenible República Dominicana", "Invertir en Miches", "Inversión sistema pool hotelero", "Preventa Miches", "Villas eco-lujo Miches"];

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

  return (
    <main className="min-h-screen bg-primary-black text-white font-sans overflow-hidden">
      <Navbar dict={dict.nav} lang={lang} variant="solid" />

      {/* Hero Full Width */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/miches-eco-resort-main.jpg"
            alt="Miches Eco Luxury"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/30 to-transparent"></div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-20">
          <div className="inline-flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-luxury-gold/50">
            <FaLeaf className="text-luxury-gold" />
            <span className="uppercase tracking-[0.3em] text-sm font-bold text-luxury-gold">🌿 Coming Soon</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 uppercase tracking-widest drop-shadow-2xl leading-tight">
            El Futuro de la <br/> <span className="text-luxury-gold italic">Vida Ecológica</span>
          </h1>
          <p className="text-xl md:text-3xl text-gray-200 font-light max-w-4xl mx-auto drop-shadow-md">
            y el Turismo de Experiencias en el Caribe
          </p>
        </div>
      </section>

      {/* Section 1: Intro (Zig-Zag Left) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative h-[500px] rounded-sm overflow-hidden shadow-2xl">
            <Image src="/images/miches-eco-resort-main.jpg" alt="Miches Landscape" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 border-4 border-luxury-gold/20 m-4"></div>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-luxury-gold uppercase tracking-wider">Un Desarrollo Ecológico de Nueva Generación</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Muy pronto llegará un proyecto concebido para transformar la manera de vivir, invertir y conectar con la naturaleza. Diseñado para integrar arquitectura moderna tropical, sostenibilidad, bienestar y experiencias hoteleras premium en un entorno natural verdaderamente extraordinario.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Ubicado sobre una impresionante propiedad de aproximadamente 50,000 m² rodeada de exuberante vegetación y un río natural que recorre toda la parte posterior del proyecto, este concepto nace con una visión clara:
            </p>
            <blockquote className="border-l-4 border-luxury-gold pl-6 text-xl italic text-white font-serif">
              "Crear un santuario tropical donde la naturaleza y el lujo convivan en perfecta armonía."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Section 2: Full Width Image Divider */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center my-12">
         <Image src="/images/miches-eco-resort-concepto.jpg" alt="Miches Nature" fill className="object-cover" />
         <div className="absolute inset-0 bg-black/60"></div>
         <div className="relative z-10 text-center max-w-4xl px-4">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-luxury-gold mb-6">🌴 UN CONCEPTO ECOLÓGICO REAL</h2>
            <p className="text-xl text-white font-light">Este no será un proyecto tradicional. La esencia del desarrollo está basada en la preservación del entorno natural y en una experiencia de vida ecológica auténtica.</p>
         </div>
      </section>

      {/* Section 3: Zig-Zag Right */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-6">
            <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wider mb-6">Respeto por el Entorno</h3>
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
            <p className="text-gray-300 text-lg leading-relaxed mt-6">
              Cada espacio ha sido pensado para generar una conexión directa con la naturaleza: Senderos ecológicos, miradores frente al río, y espacios abiertos para relajación. Aquí, la naturaleza no será un complemento. Será el corazón del proyecto.
            </p>
          </div>
          <div className="w-full lg:w-1/2 relative h-[500px] rounded-sm overflow-hidden shadow-2xl">
            <Image src="/images/miches-eco-resort-entorno.jpg" alt="Eco Pool" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 border-4 border-luxury-gold/20 m-4"></div>
          </div>
        </div>
      </section>

      {/* Section 4: Zig-Zag Left - Agriculture */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-dark-gray/30 rounded-3xl border border-white/5 my-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative h-[500px] rounded-xl overflow-hidden shadow-2xl">
            <Image src="/images/miches-eco-resort-agricultura.jpg" alt="Sustainable Gardens" fill className="object-cover" />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-luxury-gold uppercase tracking-wider">🌱 AGRICULTURA ECOLÓGICA Y CONSUMO SOSTENIBLE</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Como parte fundamental del concepto, el proyecto contará con áreas destinadas al cultivo de vegetales, frutas y hierbas que serán consumidos dentro del complejo. Un modelo de vida más saludable y conectado con la tierra (Farm-to-table).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-black/40 p-4 rounded-lg flex items-center gap-3 border border-white/10"><FaSeedling className="text-green-500 text-xl"/> <span className="text-gray-200 font-bold">Huertos Ecológicos</span></div>
                <div className="bg-black/40 p-4 rounded-lg flex items-center gap-3 border border-white/10"><FaTree className="text-green-500 text-xl"/> <span className="text-gray-200 font-bold">Producción Selectiva</span></div>
                <div className="bg-black/40 p-4 rounded-lg flex items-center gap-3 border border-white/10"><FaGlassMartiniAlt className="text-luxury-gold text-xl"/> <span className="text-gray-200 font-bold">Mixología Orgánica</span></div>
                <div className="bg-black/40 p-4 rounded-lg flex items-center gap-3 border border-white/10"><FaHome className="text-luxury-gold text-xl"/> <span className="text-gray-200 font-bold">Consumo Interno</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Full Width Grid - Amenities */}
      <section className="py-24 bg-black relative border-t border-b border-luxury-gold/20">
        <div className="absolute inset-0 opacity-20">
             <Image src="/images/the-beach-wellness-yoga-deck-punta-cana.jpg" alt="Wellness Texture" fill className="object-cover" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-16 uppercase">🌊 AMENIDADES Y EXPERIENCIAS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center">
                    <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden border-2 border-luxury-gold/30 shadow-xl">
                        <Image src="/images/miches-eco-resort-cabana.jpg" alt="Cabañas" fill className="object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <p className="font-bold text-gray-200 uppercase text-sm tracking-wider">Cabañas Tropicales</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden border-2 border-luxury-gold/30">
                        <Image src="/images/luxury-villa-marina-cap-cana-patio-area-bbq.jpg" alt="Casa Club" fill className="object-cover" />
                    </div>
                    <p className="font-bold text-gray-200 uppercase text-sm tracking-wider">Casa Club Panorámica</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden border-2 border-luxury-gold/30">
                        <Image src="/images/perla-del-mar-rooftop-model-pool-deck-top-view.jpg" alt="Piscinas" fill className="object-cover" />
                    </div>
                    <p className="font-bold text-gray-200 uppercase text-sm tracking-wider">Piscinas Infinity</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden border-2 border-luxury-gold/30">
                        <Image src="/images/the-beach-lagoon-beach-lounge-area-punta-cana.jpg" alt="Wellness" fill className="object-cover" />
                    </div>
                    <p className="font-bold text-gray-200 uppercase text-sm tracking-wider">Área Wellness & Spa</p>
                </div>
            </div>
        </div>
      </section>

      {/* Section 6: Zig-Zag Right - Hotel & Investment */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-luxury-gold uppercase tracking-wider">🏨 EXPERIENCIA HOTELERA + INVERSIÓN</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Además de ser un destino para vivir y desconectarse, el proyecto ha sido concebido bajo un innovador modelo de inversión turística.
            </p>
            <div className="bg-dark-gray p-6 rounded-lg border-l-4 border-luxury-gold">
                <h3 className="text-2xl font-bold text-white mb-4">🔑 Sistema Pool Hotelero</h3>
                <p className="text-gray-300 mb-4">Las unidades podrán integrarse a un sistema de operación hotelera permitiendo a los propietarios:</p>
                <ul className="space-y-2 text-gray-300">
                    <li>✓ Generar ingresos constantes mediante rentas vacacionales.</li>
                    <li>✓ Disfrutar de su propiedad vacacional mientras produce alta rentabilidad.</li>
                    <li>✓ Acceder a una experiencia hotelera de estándar internacional.</li>
                </ul>
            </div>
            
            <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg mt-8">
                <p className="text-white font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span>⚠️</span> Nota para Inversionistas
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                    Con el fin de garantizar la máxima estabilidad financiera, protección patrimonial y facilidad en las transacciones internacionales, los precios de preventa y proyecciones de retorno del Pool Hotelero se manejarán exclusivamente en Dólares Estadounidenses (USD).
                </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2 relative h-[600px] rounded-sm overflow-hidden shadow-2xl">
            <Image src="/images/cruises-on-land-resort-amenities-lounge-punta-cana.jpg" alt="Hotel Experience" fill className="object-cover" />
            <div className="absolute inset-0 border-4 border-luxury-gold/20 m-4"></div>
          </div>
        </div>
      </section>

      {/* Section 7: Developer & Current Phase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
                <h2 className="text-3xl font-serif font-bold text-white uppercase tracking-wider">🏗️ Desarrollado Por:</h2>
                <div className="mb-6">
                    <Image src="/images/logo-pci-construction-gold.webp" alt="PCI Construction Group" width={200} height={100} className="object-contain" />
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                    Este futuro proyecto será desarrollado por PCI CONSTRUCTION GROUP PUNTA CANA, una empresa enfocada en el desarrollo de proyectos modernos, sostenibles y de alto valor arquitectónico en la República Dominicana.
                </p>
                <ul className="space-y-3 mt-6">
                    <li className="text-luxury-gold font-bold uppercase tracking-widest text-sm">✓ Diseño e Innovación</li>
                    <li className="text-luxury-gold font-bold uppercase tracking-widest text-sm">✓ Calidad Constructiva Estricta</li>
                    <li className="text-luxury-gold font-bold uppercase tracking-widest text-sm">✓ Respeto Absoluto a la Naturaleza</li>
                </ul>
            </div>
            <div className="bg-dark-gray p-10 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-full blur-3xl"></div>
                <h2 className="text-3xl font-serif font-bold text-luxury-gold uppercase tracking-wider mb-8">🚧 Fase de Conceptualización</h2>
                <p className="text-gray-300 mb-6">Actualmente nos encontramos trabajando activamente en:</p>
                <ul className="space-y-3 text-gray-200 mb-8 list-disc pl-5">
                    <li>Diseño maestro del proyecto (Master Plan)</li>
                    <li>Desarrollo arquitectónico e ingenierías sostenibles</li>
                    <li>Integración ecológica y mitigación ambiental</li>
                    <li>Conceptualización hotelera y de hospitalidad</li>
                </ul>
                <p className="text-white font-bold italic">Muy pronto estaremos revelando Renders oficiales, Listas de precios (USD) y Beneficios exclusivos para fundadores.</p>
            </div>
        </div>
      </section>

      {/* Final Full Width Image */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
         <Image src="/images/cruises-on-land-lake-aerial-overview-punta-cana.jpg" alt="The Future" fill className="object-cover" />
         <div className="absolute inset-0 bg-black/60"></div>
         <div className="relative z-10 text-center max-w-3xl px-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 uppercase tracking-widest">✨ COMING SOON</h2>
            <p className="text-2xl text-luxury-gold italic mb-8">Un nuevo destino ecológico está naciendo en el Caribe.</p>
            <Link href="/es/contact" className="inline-block border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors font-bold uppercase tracking-widest px-8 py-4">
                Regístrate para Actualizaciones
            </Link>
         </div>
      </section>

      <Footer dict={dict} lang={lang} />
    </main>
  );
}
