import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import OffMarketForm from "@/components/investments/OffMarketForm";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({
    params
}: {
    params: Promise<{ lang: 'es' | 'en' | 'fr' }>;
}): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';
    const keywordsEs = "Hoteles en venta en República Dominicana, Venta de resorts operativos Punta Cana, Comprar hotel en Miches, Inversión hotelera en planos República Dominicana, Terrenos para desarrollo turístico Punta Cana, Macro lotes en venta Miches, Proyectos hoteleros Off Market Caribe, Adquisición de activos hoteleros RD, Inversiones inmobiliarias institucionales Punta Cana, Propiedades comerciales de lujo Off Market RD, Remates bancarios en Punta Cana, Propiedades adjudicadas por bancos República Dominicana, Villas de lujo en remate económico Punta Cana, Propiedades en liquidación urgente RD, Distressed assets real estate Punta Cana, Remates inmobiliarios de lujo República Dominicana, Venta de villas por urgencia económica Cap Cana, Penthouses en liquidación por reestructuración patrimonial RD, Oportunidades de inversión pre market Punta Cana, Cartera de activos adjudicados bancos RD, Propiedades Off Market Punta Cana, Inversiones inmobiliarias privadas República Dominicana, Portafolio inmobiliario confidencial RD, Mandato de gestión de búsqueda inmobiliaria Punta Cana, Acuerdo de confidencialidad inversión inmobiliaria RD, Auditoría privada de proyectos de inversión Punta Cana, Debida diligencia KYC inversiones inmobiliarias RD, Búsqueda de activos inmobiliarios bajo radar Caribe, Terrenos de macro desarrollo en Miches, Oportunidades Off Market en Cap Cana, Villas en liquidación Punta Espada Cap Cana, Remates inmobiliarios en Cocotal Golf Club, Proyectos comerciales en Playa Juanillo, Venta confidencial de propiedades en Uvero Alto, Inversiones en lotes hoteleros Vista Cana";
    const keywordsEn = "Hotels for sale in Dominican Republic, Boutique resorts for sale Punta Cana, Off market commercial real estate Dominican Republic, Macro land lots for hospitality development Miches, Hotel acquisition portfolio Punta Cana, Hotel mandate search services Dominican Republic, Bank foreclosures in Punta Cana, Bank owned luxury properties Dominican Republic, Distressed luxury real estate Punta Cana, Urgent property liquidation Cap Cana, Pre market luxury villas sale Punta Cana, Off market real estate investments Punta Cana, Private placement memorandum real estate DR, NDA protected property listings Punta Cana, Proof of funds requirement luxury real estate DR, Confidential real estate auditing Dominican Republic";
    const keywordsFr = "Hôtels à vendre en République Dominicaine, Vente de complexes hôteliers Punta Cana, Acheter un hôtel à Miches, Investissement hôtelier sur plan République Dominicaine, Terrains pour développement touristique Punta Cana, Macro lots à vendre Miches, Projets hôteliers Off Market Caraïbes, Acquisition d'actifs hôteliers RD, Investissements immobiliers institutionnels Punta Cana, Propriétés commerciales de luxe Off Market RD, Saisies bancaires à Punta Cana, Propriétés saisies par les banques République Dominicaine, Villas de luxe en saisie économique Punta Cana, Propriétés en liquidation urgente RD, Immobilier de luxe en difficulté Punta Cana, Saisies immobilières de luxe République Dominicaine, Vente de villas pour urgence économique Cap Cana, Penthouses en liquidation pour restructuration patrimoniale RD, Opportunités d'investissement pré-marché Punta Cana, Portefeuille d'actifs saisis banques RD, Propriétés Off Market Punta Cana, Investissements immobiliers privés République Dominicaine, Portefeuille immobilier confidentiel RD, Mandat de recherche immobilière Punta Cana, Accord de confidentialité investissement immobilier RD, Audit privé de projets d'investissement Punta Cana, Diligence raisonnable KYC investissements immobiliers RD, Recherche d'actifs immobiliers sous le radar Caraïbes, Terrains de macro-développement à Miches, Opportunités Off Market à Cap Cana, Villas en liquidation Punta Espada Cap Cana, Saisies immobilières à Cocotal Golf Club, Projets commerciaux à Playa Juanillo, Vente confidentielle de propriétés à Uvero Alto, Investissements dans des lots hôteliers Vista Cana";
    
    const keywords = lang === 'en' ? keywordsEn : lang === 'fr' ? keywordsFr : keywordsEs;

    return {
        title: 'Off-Market: Portafolio de Inversión Privado | Punta Cana Investments',
        description: 'Acceso exclusivo a activos de gran escala, complejos hoteleros y oportunidades de liquidación patrimonial bajo estricta reserva comercial en la República Dominicana.',
        keywords: keywords,
        alternates: {
            canonical: `${baseUrl}/${lang}/investments/off-market`,
            languages: {
                es: `${baseUrl}/es/investments/off-market`,
                en: `${baseUrl}/en/investments/off-market`,
                fr: `${baseUrl}/fr/investments/off-market`,
            }
        },
        openGraph: {
            title: 'Off-Market: Portafolio Inmobiliario Privado',
            description: 'Acceso exclusivo a activos de gran escala, complejos hoteleros y oportunidades de liquidación patrimonial bajo estricta reserva comercial.',
            images: ['/images/off-market-hero.jpg']
        }
    };
}

export default async function OffMarketPage({
    params
}: {
    params: Promise<{ lang: 'es' | 'en' | 'fr' }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-[#050505]">
            <Navbar
                dict={dict.nav}
                lang={lang}
                servicesList={dict.sections.services.items}
                propertyTypes={dict.properties.types}
                variant="solid"
            />

            {/* 1. HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 overflow-hidden border-b border-luxury-gold/20">
                {/* Background Image Setup */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img 
                        src="/images/off-market-hero-v2.jpg" 
                        alt="Portafolio Privado Punta Cana Investments" 
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        fetchPriority="high"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex justify-center text-center">
                    <ScrollReveal>
                        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
                            <span className="text-luxury-gold uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold mb-4 block text-center">
                                Private Placement Memorandum
                            </span>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-4 uppercase tracking-tight leading-tight text-center">
                                Portafolio Inmobiliario Privado: <br className="hidden md:block"/>
                                <span className="text-luxury-gold">Operaciones Off-Market</span>
                            </h1>
                            <div className="h-0.5 w-16 bg-luxury-gold mb-6 mx-auto"></div>
                            <p className="text-gray-200 text-sm md:text-base leading-relaxed font-light text-center max-w-2xl mx-auto drop-shadow-md">
                                Acceso exclusivo a activos de gran escala, complejos hoteleros y oportunidades de liquidación patrimonial bajo estricta reserva comercial en la República Dominicana.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 2. SECTION: HOTELES, RESORTS Y MACRO-LOTES */}
            <section className="py-16 md:py-24 bg-black relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <h2 className="text-3xl md:text-4xl font-serif text-white mb-8 uppercase tracking-wide border-l-4 border-luxury-gold pl-6">
                            Adquisición de Activos Hoteleros y Tierras de Macro-Desarrollo
                        </h2>
                        
                        <div className="space-y-6 text-gray-300 text-lg font-light leading-relaxed mb-12">
                            <p>
                                El acceso a complejos hoteleros operativos, resorts en fase de reconversión y terrenos de escala macro en ubicaciones de altísimo interés exige un ecosistema de absoluta reserva. Por políticas de confidencialidad institucional y protección de las marcas operadoras, estos activos de gran envergadura jamás se exponen al escrutinio público ni a portales masivos.
                            </p>
                            <p>
                                <strong className="text-white font-medium">Punta Cana Investments</strong> actúa como el nexo estratégico en el terreno. Centralizamos un portafolio privado de propiedades comerciales premium y activos bajo radar, gestionando las transacciones bajo los más estrictos estándares globales de confidencialidad, análisis de factibilidad y rigor de ingeniería en conjunto con nuestro brazo técnico, <strong className="text-luxury-gold font-medium">PCI CONSTRUCTION GROUP PUNTA CANA</strong>.
                            </p>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-10 relative">
                            <h3 className="text-luxury-gold text-sm font-bold uppercase tracking-[0.2em] mb-4">Mandato de Gestión Exclusiva</h3>
                            <h4 className="text-xl text-white font-serif mb-4">Búsqueda y Negociación Bajo Encargo Corporativo:</h4>
                            <p className="text-gray-400 font-light leading-relaxed">
                                Para el segmento de hospitalidad, el inversor o la corporación interesada debe formalizar una <strong className="text-white">Carta Mandato de Gestión de Búsqueda</strong>. Este instrumento legal autoriza formalmente a nuestra firma a iniciar la prospección, análisis técnico de permisología y debida diligencia de activos que se ajusten con precisión quirúrgica a los requerimientos de ubicación, número de llaves, rentabilidad y especificaciones de su fondo de inversión.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 3. SECTION: PROPIEDADES EN REMATE (DISTRESSED ASSETS) */}
            <section className="py-16 md:py-24 bg-[#0a0a0a] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[500px] w-full rounded-sm overflow-hidden shadow-2xl border border-white/5">
                            <img 
                                src="/images/off-market-auction-v4.jpg" 
                                alt="Market Value vs Auction Price Analysis" 
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>

                        <ScrollReveal direction="right">
                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-8 uppercase tracking-wide">
                                Adquisición Estratégica de Activos en Liquidación, Adjudicados y Remates Bancarios <span className="text-luxury-gold block mt-2 text-2xl">(Distressed Assets)</span>
                            </h2>
                            
                            <div className="space-y-6 text-gray-300 text-lg font-light leading-relaxed">
                                <p>
                                    El mercado inmobiliario premium genera, en coyunturas específicas, oportunidades líquidas donde el factor tiempo prevalece sobre el valor comercial del activo. Centralizamos de forma estrictamente privada el acceso a propiedades de alta gama bajo condiciones de ejecución rápida: remates por urgencia económica de propietarios privados y carteras de activos adjudicados o en procesos de remate bancario.
                                </p>
                                <p>
                                    Estas propiedades —villas de lujo, estructuras residenciales inconclusas y parcelas preferenciales— son filtradas bajo un criterio riguroso: deben presentar un <strong className="text-luxury-gold">descuento sustancial respecto a su valor de tasación real en el mercado</strong>.
                                </p>
                                <p>
                                    Debido a la naturaleza legal y de velocidad de capital que exigen estas transacciones, estos activos se gestionan bajo estricto radar, protegiendo la identidad de las instituciones financieras involucradas.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* 4. SECTION: EL PROTOCOLO DE FILTRADO Y COMPLIANCE */}
            <section className="py-16 md:py-24 bg-black">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="border border-luxury-gold p-8 md:p-14 relative bg-[#050505]">
                            {/* Accent Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-luxury-gold"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-luxury-gold"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-luxury-gold"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-luxury-gold"></div>

                            <div className="text-center mb-12">
                                <h2 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest mb-4">
                                    Protocolo Obligatorio de Seguridad y Acceso a la Información
                                </h2>
                                <div className="h-0.5 w-24 bg-luxury-gold mx-auto"></div>
                            </div>

                            <p className="text-gray-300 text-center text-lg font-light leading-relaxed mb-12 max-w-4xl mx-auto">
                                Para salvaguardar la integridad de las operaciones bancarias, la privacidad de los desarrolladores y la seguridad jurídica de las transacciones, <strong className="text-white">Punta Cana Investments</strong> no proporciona dosieres financieros, ubicaciones exactas ni documentos técnicos a solicitantes no depurados.
                                <br/><br/>
                                El acceso a cualquier activo de nuestro portafolio Off-Market requiere el estricto cumplimiento del siguiente protocolo de cumplimiento legal y financiero:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-[#0a0a0a] p-6 border border-white/5 hover:border-luxury-gold/50 transition-colors">
                                    <h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">1. Acuerdo de Confidencialidad y No Divulgación (NDA)</h3>
                                    <p className="text-gray-400 font-light text-sm">Firma obligatoria de un acuerdo legal que penaliza el uso indebido o la filtración a terceros de la información suministrada sobre el activo.</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-6 border border-white/5 hover:border-luxury-gold/50 transition-colors">
                                    <h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">2. Prueba de Fondos (Proof of Funds - POF)</h3>
                                    <p className="text-gray-400 font-light text-sm">Certificación bancaria oficial o carta de líneas de crédito que demuestre la capacidad de liquidez inmediata para ejecutar la operación.</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-6 border border-white/5 hover:border-luxury-gold/50 transition-colors">
                                    <h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">3. Documentación de Identidad y Registro Corporativo</h3>
                                    <p className="text-gray-400 font-light text-sm">Copias de identificaciones oficiales de los beneficiarios finales, o el Registro Mercantil y actas corporativas vigentes si la adquisición se realiza a través de una empresa.</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-6 border border-white/5 hover:border-luxury-gold/50 transition-colors">
                                    <h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">4. Formulario KYC (Know Your Customer)</h3>
                                    <p className="text-gray-400 font-light text-sm">Cumplimentación de nuestro registro de transparencia, previniendo el lavado de activos y blindando la operación bajo los marcos regulatorios internacionales.</p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* 5. SECTION: FORMULARIO DE APLICACIÓN PRIVADA */}
            <section className="py-16 md:py-24 bg-black relative" id="application-form">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-transparent opacity-[0.03] pointer-events-none mix-blend-screen"></div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal>
                        <OffMarketForm lang={lang} />
                    </ScrollReveal>
                </div>
            </section>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
