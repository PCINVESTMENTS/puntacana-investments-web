
import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { FaChartLine, FaHandHoldingUsd, FaFileContract, FaArrowRight, FaCity, FaUmbrellaBeach, FaPlane, FaCheck } from "react-icons/fa";
import { investmentModels } from "@/data/investment-models";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "es" | "en" | "fr");

    const title = lang === 'en'
        ? "Invest in Punta Cana Real Estate | High ROI & Pre-Construction"
        : lang === 'fr'
        ? "Investir dans l'Immobilier à Punta Cana | Fort ROI et Sur Plan"
        : "Invertir en Bienes Raíces en República Dominicana | Alto ROI";

    const description = lang === 'en'
        ? "Discover the best real estate investment opportunities in Punta Cana. High ROI properties, pre-construction condos, and Airbnb investment models."
        : lang === 'fr'
        ? "Découvrez les meilleures opportunités d'investissement immobilier à Punta Cana. Propriétés à fort retour sur investissement, appartements sur plan et modèles d'investissement Airbnb."
        : "Descubre las mejores oportunidades de inversión en bienes raíces en Punta Cana. Propiedades de alto ROI, proyectos en plano y modelos de inversión para Airbnb.";

    return {
        title: `${title} | Punta Cana Investments`,
        description,
        keywords: lang === 'es'
            ? ['Invertir en bienes raíces en República Dominicana', 'Proyectos rentables en Punta Cana', 'Comprar apartamento para Airbnb en Punta Cana', 'Proyectos en plano Punta Cana', 'Nuevos desarrollos inmobiliarios Punta Cana']
            : lang === 'fr'
            ? ['Projets immobiliers rentables', 'Acheter sur plan Punta Cana', 'Investissement locatif Punta Cana', 'Investir à Punta Cana']
            : ['High ROI properties Punta Cana', 'Punta Cana Airbnb investment properties', 'Pre-construction condos Punta Cana', 'Off-plan properties for sale Punta Cana', 'New real estate developments Punta Cana'],
        openGraph: {
            title: `${title} | Punta Cana Investments`,
            description,
            images: [
                {
                    url: 'https://www.puntacanainvestmentsrd.com/images/investments/modern-investments-hero.jpg?v=6',
                    width: 1200,
                    height: 630,
                    alt: dict.sections.investments.title,
                }
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | Punta Cana Investments`,
            description,
            images: ['https://www.puntacanainvestmentsrd.com/images/investments/modern-investments-hero.jpg?v=6'],
        },
    };
}

// Restoring ISR
export const revalidate = 60;

export default async function InvestmentsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "es" | "en" | "fr");

    const benefits = [
        {
            icon: <FaChartLine className="text-4xl text-luxury-gold" />,
            title: lang === 'en' ? "High Appreciation" : lang === 'fr' ? "Forte Plus-value" : "Alta Plusvalía",
            text: lang === 'en'
                ? "Punta Cana property values have consistently risen by 5-8% annually over the last decade."
                : lang === 'fr'
                ? "La valeur des propriétés à Punta Cana a augmenté régulièrement de 5 à 8 % par an au cours de la dernière décennie."
                : "El valor de las propiedades en Punta Cana ha aumentado constantemente un 5-8% anual en la última década."
        },
        {
            icon: <FaHandHoldingUsd className="text-4xl text-luxury-gold" />,
            title: lang === 'en' ? "Dollarized Income" : lang === 'fr' ? "Revenus Dollarisés" : "Ingresos en Dólares",
            text: lang === 'en'
                ? "Generate stable income in USD through vacation rentals with high occupancy rates year-round."
                : lang === 'fr'
                ? "Générez des revenus stables en USD grâce aux locations saisonnières avec un taux d'occupation élevé toute l'année."
                : "Genere ingresos estables en USD a través de alquileres vacacionales con alta ocupación todo el año."
        },
        {
            icon: <FaFileContract className="text-4xl text-luxury-gold" />,
            title: "CONFOTUR",
            text: lang === 'en'
                ? "Tax exemptions for 15 years on property tax (1% annual) and transfer tax (3%)."
                : lang === 'fr'
                ? "Exonérations fiscales pendant 15 ans sur la taxe foncière (1 % annuel) et les droits de mutation (3 %)."
                : "Exenciones fiscales por 15 años sobre el IPI (1% anual) y el impuesto de transferencia (3%)."
        },
        {
            icon: <FaPlane className="text-4xl text-luxury-gold" />,
            title: lang === 'en' ? "Connectivity" : lang === 'fr' ? "Connectivité" : "Conectividad",
            text: lang === 'en'
                ? "The busiest airport in the Caribbean (PUJ) with direct flights from over 26 countries."
                : lang === 'fr'
                ? "L'aéroport le plus fréquenté des Caraïbes (PUJ) avec des vols directs depuis plus de 26 pays."
                : "El aeropuerto más transitado del Caribe (PUJ) con vuelos directos desde más de 26 países."
        }
    ];

    return (
        <main className="min-h-screen bg-primary-black text-white">
            <Navbar
                dict={dict.nav}
                lang={lang}
                servicesList={dict.sections.services.items}
                propertyTypes={dict.properties.types}
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/investments/modern-investments-hero.jpg"
                        alt="Investments in Punta Cana"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Subtle overlay for text readability only at the bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-black/80 via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mt-32">
                    <span className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-sm mb-4 block animate-fade-in-up">
                        {dict.sections.investments.subtitle}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg shadow-black animate-fade-in-up animation-delay-200">
                        {dict.sections.investments.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-200 font-light leading-relaxed animate-fade-in-up animation-delay-400">
                        {dict.sections.investments.description}
                    </p>
                </div>
            </div>

            {/* Philosophy Section - Transparency & Innovation */}
            <section className="py-20 bg-dark-gray/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-12">
                            {/* Transparency */}
                            <div className="flex gap-6">
                                <div className="bg-luxury-gold/10 p-4 rounded-full h-fit flex-shrink-0">
                                    <FaFileContract className="text-3xl text-luxury-gold" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-white mb-3">
                                        {lang === 'en' ? "Transparency & Security" : lang === 'fr' ? "Transparence & Sécurité" : "Transparencia y Seguridad"}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {lang === 'en'
                                            ? "We ensure clear processes, well-structured contracts, and complete legal accompaniment. We guarantee that every transaction complies with Dominican Republic legal standards, protecting our investors' interests."
                                            : lang === 'fr'
                                            ? "Nous assurons des processus clairs, des contrats bien structurés et un accompagnement juridique complet. Nous garantissons que chaque transaction est conforme aux normes légales de la République Dominicaine, protégeant ainsi les intérêts de nos investisseurs."
                                            : "Velamos por procesos claros, contratos bien estructurados y un acompañamiento legal completo. Garantizamos que cada transacción cumpla con los estándares legales de la República Dominicana, protegiendo los intereses de nuestros inversionistas."}
                                    </p>
                                </div>
                            </div>

                            {/* Innovation */}
                            <div className="flex gap-6">
                                <div className="bg-luxury-gold/10 p-4 rounded-full h-fit flex-shrink-0">
                                    <FaChartLine className="text-3xl text-luxury-gold" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-white mb-3">
                                        {lang === 'en' ? "Innovation & Profitability" : lang === 'fr' ? "Innovation & Rentabilité" : "Innovación y Rentabilidad"}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {lang === 'en'
                                            ? "We integrate modern tools, data analysis, and advanced financial models to offer strategic investments with superior returns. We create innovative proposals that allow our investors to diversify and maximize their returns."
                                            : lang === 'fr'
                                            ? "Nous intégrons des outils modernes, des analyses de données et des modèles financiers avancés pour proposer des investissements stratégiques aux rendements supérieurs. Nous créons des propositions innovantes qui permettent à nos investisseurs de se diversifier et de maximiser leurs gains."
                                            : "Integramos herramientas modernas, análisis de datos y modelos financieros avanzados para ofrecer inversiones estratégicas con rendimientos superiores. Creamos propuestas innovadoras que permiten a nuestros inversionistas diversificar y maximizar sus retornos."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual for Philosophy */}
                        <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/20 to-transparent z-10"></div>
                            <Image
                                src="/images/og-home-luxury.webp"
                                alt="Financial Growth"
                                fill
                                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-8 left-8 z-20 bg-black/80 p-6 border-l-4 border-luxury-gold backdrop-blur-sm max-w-xs">
                                <div className="text-3xl font-bold text-white mb-1">+12%</div>
                                <div className="text-xs uppercase tracking-widest text-gray-300">
                                    {lang === 'en' ? "Avg. Annual Return" : lang === 'fr' ? "Rendement Annuel Moyen" : "Retorno Anual Prom."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Investment Models Grid */}
            <section className="py-24 bg-primary-black relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-sm">
                            {lang === 'en' ? "Our Focus" : lang === 'fr' ? "Notre Approche" : "Nuestro Enfoque"}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-3 mb-6">
                            {lang === 'en' ? "Investment Models" : lang === 'fr' ? "Modèles d'Investissement" : "Modelos de Inversión"}
                        </h2>
                        <p className="max-w-3xl mx-auto text-gray-400 text-lg">
                            {lang === 'en'
                                ? "We focus on attracting capital towards real and carefully evaluated opportunities."
                                : lang === 'fr'
                                ? "Nous nous efforçons d'orienter les capitaux vers des opportunités réelles et rigoureusement évaluées."
                                : "Nos enfocamos en atraer capital hacia oportunidades reales y cuidadosamente evaluadas."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {investmentModels.map((model, idx) => {
                            const getVal = (obj: any, key: string) => {
                                if (!obj) return "";
                                return obj[key] || obj['en'] || obj['es'] || "";
                            };

                            const iconMap: Record<string, React.ReactNode> = {
                                "pre-construction": <FaCity />,
                                "vacation-villas": <FaUmbrellaBeach />,
                                "rent-pool": <FaHandHoldingUsd />,
                                "development-participation": <FaChartLine />,
                                "passive-investments": <FaFileContract />,
                                "strategic-buy-resale": <FaArrowRight />,
                                "off-market": <FaCheck />
                            };

                            const icon = iconMap[model.slug] || <FaCheck />;

                            return (
                                <Link
                                    href={`/${lang}/investments/${model.slug}`}
                                    key={idx}
                                    className="bg-white/5 p-8 rounded-xl border border-white/5 hover:border-luxury-gold/50 transition-all group hover:-translate-y-2 block"
                                >
                                    <div className="text-4xl text-luxury-gold mb-6 group-hover:scale-110 transition-transform">
                                        {icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 font-serif flex justify-between items-center">
                                        {getVal(model.title, lang)}
                                        <FaArrowRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-sm" />
                                    </h3>
                                    <p className="text-gray-400 text-sm">{getVal(model.description, lang)}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Services Checklist / Why Us */}
            <section className="py-24 bg-gradient-to-b from-dark-gray to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-luxury-gold rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                        <div className="w-full md:w-1/2 relative z-10">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-6">
                                {lang === 'en' ? "Comprehensive Solutions" : "Soluciones Integrales"}
                            </h2>
                            <p className="text-black/80 font-medium text-lg mb-8">
                                {lang === 'en'
                                    ? "Our goal is to connect every investor with solid, transparent, and profitable opportunities in the heart of the Caribbean."
                                    : "Nuestro objetivo es conectar a cada inversionista con oportunidades sólidas, transparentes y rentables en el corazón del Caribe."}
                            </p>
                            <Link href={`/${lang}#contact`} className="inline-block bg-black text-white px-8 py-4 uppercase font-bold tracking-widest hover:bg-white hover:text-black transition-colors shadow-xl">
                                {dict.contact.subtitle}
                            </Link>
                        </div>

                        <div className="w-full md:w-1/2 bg-black/10 p-8 rounded-xl backdrop-blur-sm border border-black/5 relative z-10">
                            <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wider border-b border-black/10 pb-4">
                                {lang === 'en' ? "We Offer:" : "Ofrecemos:"}
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    lang === 'en' ? "Feasibility Studies" : "Estudios de factibilidad",
                                    lang === 'en' ? "ROI & Appreciation Analysis" : "Análisis de retorno y plusvalía",
                                    lang === 'en' ? "Legal Due Diligence" : "Due diligence legal",
                                    lang === 'en' ? "Investment Model Structuring" : "Estructuración de modelos de inversión",
                                    lang === 'en' ? "Full Accompaniment (Prospecting to Delivery)" : "Acompañamiento desde la prospección hasta la entrega"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="bg-black text-white p-1 rounded-full text-xs">
                                            <FaCheck />
                                        </div>
                                        <span className="text-black font-semibold">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
