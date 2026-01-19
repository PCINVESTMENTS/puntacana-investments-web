

import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { flyAndBuyPrograms, flyAndBuyComparison } from "@/data/fly-and-buy";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/PageSections";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { FaCheck, FaBuilding, FaHandshake, FaMapMarkedAlt, FaBriefcase, FaHotel, FaCar, FaChartLine, FaStar, FaPen, FaPlane, FaChevronDown } from "react-icons/fa";

// Icon mapping helper
const getIcon = (iconName: string) => {
    switch (iconName) {
        case "hotel": return <FaHotel />;
        case "handshake": return <FaHandshake />;
        case "building": return <FaBuilding />;
        case "map": return <FaMapMarkedAlt />;
        case "briefcase": return <FaBriefcase />;
        case "car": return <FaCar />;
        case "chart": return <FaChartLine />;
        case "star": return <FaStar />;
        case "pen": return <FaPen />;
        default: return <FaCheck />;
    }
};

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' }> }): Promise<Metadata> {
    const { lang } = await params;
    const isEs = lang === 'es';

    return {
        title: `Fly & Buy | Punta Cana Investments`,
        description: isEs
            ? "Fly & Buy no es un viaje, es una decisión inteligente. Venga, confirme y compre con Punta Cana Investments."
            : "Fly & Buy is not just a trip, it's a smart decision. Come, confirm, and buy with Punta Cana Investments.",
        openGraph: {
            images: ['/images/fly-and-buy/premium.jpg'],
        }
    };
}

export default async function FlyAndBuyPage({ params }: { params: Promise<{ lang: 'es' | 'en' }> }) {
    const { lang } = await params;
    const isEs = lang === 'es';
    const dict = await getDictionary(lang);

    return (
        <main className="min-h-screen bg-primary-black text-white">
            <Navbar dict={dict.nav} lang={lang} servicesList={dict.sections.services.items} propertyTypes={dict.properties.types} variant="solid" />

            {/* Hero Section */}
            <div className="relative h-[60vh] max-h-[800px] overflow-hidden">
                <Image
                    src="/images/fly-and-buy/premium.jpg" // Using Premium image as main hero or a general one
                    alt="Fly & Buy Punta Cana"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-primary-black/50 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <ScrollReveal>
                        <span className="text-luxury-gold uppercase tracking-[0.2em] font-bold text-sm md:text-base mb-4 block">
                            {isEs ? "Modalidades Oficiales" : "Official Modalities"}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                            Fly & Buy
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light">
                            {isEs
                                ? "Fly & Buy no es un viaje, es una decisión inteligente. Venga, confirme y compre con Punta Cana Investments."
                                : "Fly & Buy is not just a trip, it's a smart decision. Come, confirm, and buy with Punta Cana Investments."}
                        </p>
                    </ScrollReveal>
                </div>
            </div>

            {/* Programs Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20 lg:space-y-32">
                {flyAndBuyPrograms.map((program, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <section key={program.slug} id={program.slug} className="scroll-mt-32">
                            <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-stretch`}>

                                {/* Image Column */}
                                <div className="lg:w-1/2 relative min-h-[500px] lg:min-h-full">
                                    <div className="sticky top-32 h-full max-h-[80vh] w-full rounded-sm overflow-hidden border border-white/10 shadow-2xl group">
                                        <Image
                                            src={program.heroImage}
                                            alt={program.title[isEs ? 'es' : 'en']}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>

                                        {/* Floating Badge */}
                                        <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2 uppercase tracking-widest text-sm font-bold">
                                            {program.duration[isEs ? 'es' : 'en']}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className="lg:w-1/2 flex flex-col justify-center">
                                    <ScrollReveal>
                                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-gold mb-2">
                                            {program.title[isEs ? 'es' : 'en']}
                                        </h2>
                                        <h3 className="text-xl text-white/90 font-medium mb-6 uppercase tracking-wide">
                                            {program.subtitle[isEs ? 'es' : 'en']}
                                        </h3>
                                        <p className="text-gray-300 text-lg leading-relaxed mb-10 border-l-2 border-luxury-gold/50 pl-6">
                                            {program.description[isEs ? 'es' : 'en']}
                                        </p>

                                        {/* Includes Grid */}
                                        <div className="grid grid-cols-1 gap-8 mb-10">
                                            {program.includes.map((section, idx) => (
                                                <div key={idx} className="bg-white/5 p-6 rounded-sm border border-white/5 hover:border-luxury-gold/30 transition-colors">
                                                    <div className="flex items-center gap-3 mb-4 text-luxury-gold">
                                                        <span className="text-xl">{getIcon(section.icon || 'check')}</span>
                                                        <h4 className="font-bold uppercase tracking-wider text-sm">
                                                            {section.title[isEs ? 'es' : 'en']}
                                                        </h4>
                                                    </div>
                                                    <ul className="space-y-2">
                                                        {section.items.map((item, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-gray-400 text-sm">
                                                                <FaCheck className="mt-1 flex-shrink-0 text-luxury-gold/50 text-xs" />
                                                                <span>{item[isEs ? 'es' : 'en']}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Conditions & Pricing */}
                                        <div className="bg-luxury-gold/10 border border-luxury-gold/20 p-8 rounded-sm">
                                            <h4 className="text-luxury-gold font-bold uppercase tracking-wider text-sm mb-4">
                                                {isEs ? "Condiciones Económicas" : "Economic Conditions"}
                                            </h4>
                                            <ul className="space-y-3 text-gray-300 text-sm mb-6">
                                                <li className="flex gap-2">
                                                    <span className="font-semibold text-white">{isEs ? "Cliente Cubre:" : "Client Covers:"}</span>
                                                    {program.conditions.clientCovers.map(c => c[isEs ? 'es' : 'en']).join(", ")}
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-semibold text-white">{isEs ? "Beneficio Compra:" : "Purchase Benefit:"}</span>
                                                    {program.conditions.purchaseBenefit[isEs ? 'es' : 'en']}
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-semibold text-white">{isEs ? "Política:" : "Policy:"}</span>
                                                    {program.conditions.refundPolicy[isEs ? 'es' : 'en']}
                                                </li>
                                            </ul>

                                            <div className="pt-6 border-t border-luxury-gold/20">
                                                <h5 className="text-white font-bold mb-2 text-sm uppercase">
                                                    {isEs ? "Ideal Para:" : "Ideal For:"}
                                                </h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {program.idealFor.map((ideal, i) => (
                                                        <span key={i} className="bg-black/40 text-gray-300 px-3 py-1 text-xs rounded-full border border-white/10">
                                                            {ideal[isEs ? 'es' : 'en']}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-10">
                                            <Link
                                                href={`/${lang}/fly-and-buy/form`}
                                                className="inline-block bg-luxury-gold text-black hover:bg-white px-8 py-4 uppercase tracking-widest text-sm font-bold transition-all shadow-lg hover:shadow-xl w-full text-center md:w-auto"
                                            >
                                                {isEs ? "Consultar sobre el programa" : "Inquire about program"}
                                            </Link>
                                        </div>
                                    </ScrollReveal>
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Comparison Table */}
            <section className="bg-dark-gray py-20 border-t border-white/10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                            {isEs ? "Comparativa de Programas" : "Program Comparison"}
                        </h2>
                        <p className="text-gray-400">
                            {isEs ? "Encuentre la modalidad que mejor se adapta a su perfil de inversión" : "Find the modality that best suits your investment profile"}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 text-left text-gray-500 font-medium uppercase tracking-wider text-sm border-b border-white/10 w-1/3">
                                        {flyAndBuyComparison.headers.feature[isEs ? 'es' : 'en']}
                                    </th>
                                    <th className="p-4 text-center text-white font-bold uppercase tracking-wider text-sm border-b border-white/10 w-1/3 bg-white/5">
                                        {flyAndBuyComparison.headers.basic[isEs ? 'es' : 'en']}
                                    </th>
                                    <th className="p-4 text-center text-luxury-gold font-bold uppercase tracking-wider text-sm border-b border-white/10 w-1/3 bg-luxury-gold/10">
                                        {flyAndBuyComparison.headers.premium[isEs ? 'es' : 'en']}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {flyAndBuyComparison.rows.map((row, idx) => (
                                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-gray-300 font-medium">
                                            {row.feature[isEs ? 'es' : 'en']}
                                        </td>
                                        <td className="p-4 text-center text-gray-400">
                                            {row.basic[isEs ? 'es' : 'en']}
                                        </td>
                                        <td className="p-4 text-center text-luxury-gold font-semibold bg-luxury-gold/5">
                                            {row.premium[isEs ? 'es' : 'en']}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-primary-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <FaPlane className="text-5xl text-luxury-gold mx-auto mb-8 animate-pulse" />
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight">
                        &quot;{isEs
                            ? "Fly & Buy no es un viaje, es una decisión inteligente."
                            : "Fly & Buy is not just a trip, it's a smart decision."}&quot;
                    </h2>
                    <p className="text-xl text-gray-300 mb-12">
                        {isEs
                            ? "Venga, confirme y compre con Punta Cana Investments."
                            : "Come, confirm, and buy with Punta Cana Investments."}
                    </p>
                    <Link
                        href={`/${lang}/fly-and-buy/form`}
                        className="inline-block bg-white text-black hover:bg-luxury-gold px-10 py-4 uppercase tracking-widest text-sm font-bold transition-all shadow-xl hover:scale-105"
                    >
                        {isEs ? "Agendar Mi Visita Ahora" : "Schedule My Visit Now"}
                    </Link>
                </div>
            </section>

            <Footer dict={dict} lang={lang} />
        </main >
    );
}
