
import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { FaChartLine, FaHandHoldingUsd, FaFileContract, FaArrowRight, FaCity, FaUmbrellaBeach, FaPlane, FaCheck } from "react-icons/fa";
import PropertyListings from "@/components/home/PropertyListings";
import { client } from "@/sanity/lib/client";
import { PROPERTIES_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty } from "@/sanity/lib/mappers";
import { Property } from "@/data/properties";



export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "es" | "en");

    return {
        title: `${dict.nav.investments} | Punta Cana Investments`,
        description: dict.sections.investments.description,
        openGraph: {
            title: `${dict.nav.investments} | Punta Cana Investments`,
            description: dict.sections.investments.description,
            images: [
                {
                    url: '/images/og/investment-opportunities-og.png',
                    width: 1200,
                    height: 630,
                    alt: dict.sections.investments.title,
                }
            ],
        },
    };
}

// Restoring ISR
export const revalidate = 60;

export default async function InvestmentsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "es" | "en");

    // Fetch properties for listings
    const rawProperties = await client.fetch(PROPERTIES_QUERY);
    const properties: Property[] = rawProperties.map(mapSanityProperty);

    const benefits = [
        {
            icon: <FaChartLine className="text-4xl text-luxury-gold" />,
            title: lang === 'en' ? "High Appreciation" : "Alta Plusvalía",
            text: lang === 'en'
                ? "Punta Cana property values have consistently risen by 5-8% annually over the last decade."
                : "El valor de las propiedades en Punta Cana ha aumentado constantemente un 5-8% anual en la última década."
        },
        {
            icon: <FaHandHoldingUsd className="text-4xl text-luxury-gold" />,
            title: lang === 'en' ? "Dollarized Income" : "Ingresos en Dólares",
            text: lang === 'en'
                ? "Generate stable income in USD through vacation rentals with high occupancy rates year-round."
                : "Genere ingresos estables en USD a través de alquileres vacacionales con alta ocupación todo el año."
        },
        {
            icon: <FaFileContract className="text-4xl text-luxury-gold" />,
            title: "CONFOTUR",
            text: lang === 'en'
                ? "Tax exemptions for 15 years on property tax (1% annual) and transfer tax (3%)."
                : "Exenciones fiscales por 15 años sobre el IPI (1% anual) y el impuesto de transferencia (3%)."
        },
        {
            icon: <FaPlane className="text-4xl text-luxury-gold" />,
            title: lang === 'en' ? "Connectivity" : "Conectividad",
            text: lang === 'en'
                ? "The busiest airport in the Caribbean (PUJ) with direct flights from over 26 countries."
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
                        src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2649&auto=format&fit=crop"
                        alt="Investments in Punta Cana"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/40 to-transparent"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
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
                                        {lang === 'en' ? "Transparency & Security" : "Transparencia y Seguridad"}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {lang === 'en'
                                            ? "We ensure clear processes, well-structured contracts, and complete legal accompaniment. We guarantee that every transaction complies with Dominican Republic legal standards, protecting our investors' interests."
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
                                        {lang === 'en' ? "Innovation & Profitability" : "Innovación y Rentabilidad"}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {lang === 'en'
                                            ? "We integrate modern tools, data analysis, and advanced financial models to offer strategic investments with superior returns. We create innovative proposals that allow our investors to diversify and maximize their returns."
                                            : "Integramos herramientas modernas, análisis de datos y modelos financieros avanzados para ofrecer inversiones estratégicas con rendimientos superiores. Creamos propuestas innovadoras que permiten a nuestros inversionistas diversificar y maximizar sus retornos."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual for Philosophy */}
                        <div className="relative h-[500px] rounded-lg overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/20 to-transparent z-10"></div>
                            <Image
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                                alt="Financial Growth"
                                fill
                                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-8 left-8 z-20 bg-black/80 p-6 border-l-4 border-luxury-gold backdrop-blur-sm max-w-xs">
                                <div className="text-3xl font-bold text-white mb-1">+12%</div>
                                <div className="text-xs uppercase tracking-widest text-gray-300">
                                    {lang === 'en' ? "Avg. Annual Return" : "Retorno Anual Prom."}
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
                            {lang === 'en' ? "Our Focus" : "Nuestro Enfoque"}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-3 mb-6">
                            {lang === 'en' ? "Investment Models" : "Modelos de Inversión"}
                        </h2>
                        <p className="max-w-3xl mx-auto text-gray-400 text-lg">
                            {lang === 'en'
                                ? "We focus on attracting capital towards real and carefully evaluated opportunities."
                                : "Nos enfocamos en atraer capital hacia oportunidades reales y cuidadosamente evaluadas."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FaCity />,
                                title: lang === 'en' ? "Pre-construction Projects" : "Proyectos en Pre-construcción",
                                desc: lang === 'en' ? "High appreciation potential entering at early stages." : "Alta plusvalía entrando en etapas iniciales."
                            },
                            {
                                icon: <FaUmbrellaBeach />,
                                title: lang === 'en' ? "Premium Vacation Villas" : "Villas Premium Vacacionales",
                                desc: lang === 'en' ? "High-end properties for short-term rental income." : "Propiedades de alto nivel para renta vacacional."
                            },
                            {
                                icon: <FaHandHoldingUsd />,
                                title: "Rent Pool / Condo-Hotel",
                                desc: lang === 'en' ? "Hassle-free management models optimized for occupancy." : "Modelos de gestión sin complicaciones optimizados para ocupación."
                            },
                            {
                                icon: <FaChartLine />,
                                title: lang === 'en' ? "Development Participation" : "Participación en Desarrollos",
                                desc: lang === 'en' ? "Equity sharing with corporate backing." : "Equity sharing con acciones y respaldo corporativo."
                            },
                            {
                                icon: <FaFileContract />,
                                title: lang === 'en' ? "Passive Investments" : "Inversiones Pasivas",
                                desc: lang === 'en' ? "Fixed guaranteed returns." : "Retorno garantizado sin gestión activa."
                            },
                            {
                                icon: <FaArrowRight />,
                                title: lang === 'en' ? "Strategic Buy & Resale" : "Compra y Reventa Estratégica",
                                desc: lang === 'en' ? "Capitalizing on high-growth zones." : "En zonas de crecimiento acelerado."
                            },
                            {
                                icon: <FaCheck />,
                                title: lang === 'en' ? "Off-Market Opportunities" : "Oportunidades Off-Market",
                                desc: lang === 'en' ? "Exclusive properties not listed publicly." : "Propiedades exclusivas no listadas públicamente."
                            }
                        ].map((model, idx) => {
                            // Map titles to slugs properly matching the data file
                            const slugMap: Record<string, string> = {
                                "Proyectos en Pre-construcción": "pre-construction",
                                "Pre-construction Projects": "pre-construction",
                                "Villas Premium Vacacionales": "vacation-villas",
                                "Premium Vacation Villas": "vacation-villas",
                                "Rent Pool / Condo-Hotel": "rent-pool",
                                "Participación en Desarrollos": "development-participation",
                                "Development Participation": "development-participation",
                                "Inversiones Pasivas": "passive-investments",
                                "Passive Investments": "passive-investments",
                                "Compra y Reventa Estratégica": "strategic-buy-resale",
                                "Strategic Buy & Resale": "strategic-buy-resale",
                                "Oportunidades Off-Market": "off-market",
                                "Off-Market Opportunities": "off-market"
                            };

                            const slug = slugMap[model.title] || "#";

                            return (
                                <Link
                                    href={`/${lang}/investments/${slug}`}
                                    key={idx}
                                    className="bg-white/5 p-8 rounded-xl border border-white/5 hover:border-luxury-gold/50 transition-all group hover:-translate-y-2 block"
                                >
                                    <div className="text-4xl text-luxury-gold mb-6 group-hover:scale-110 transition-transform">
                                        {model.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 font-serif flex justify-between items-center">
                                        {model.title}
                                        <FaArrowRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-sm" />
                                    </h3>
                                    <p className="text-gray-400 text-sm">{model.desc}</p>
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

            {/* Featured Investment Opportunities */}
            <div className="bg-primary-black pt-24">
                <PropertyListings
                    dict={dict.properties}
                    lang={lang}
                    locations={dict.sections.locations.items}
                    featured={true}
                    featuredCategory="sale"
                    featuredLimit={3}
                    sectionId="investment-opportunities"
                    sectionTitle={lang === 'en' ? 'Curated Investment Opportunities' : 'Oportunidades de Inversión Curadas'}
                    initialData={properties}
                />
            </div>

            <Footer dict={dict} lang={lang as 'es' | 'en'} />
        </main>
    );
}
