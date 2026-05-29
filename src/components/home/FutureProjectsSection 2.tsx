import Link from "next/link";
import Image from "next/image";
import { FaLeaf, FaArrowRight } from "react-icons/fa";
import { ScrollReveal } from "../ui/ScrollReveal";

export default function FutureProjectsSection({ lang }: { lang: string }) {
    return (
        <section className="py-8 md:py-24 px-4 sm:px-6 lg:px-8 bg-primary-black relative overflow-hidden text-white">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-8 md:mb-16">
                    <ScrollReveal width="100%">
                        <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">
                            {lang === 'en' ? 'Exclusive Opportunity for Investors' : 'Oportunidad Exclusiva para Inversores'}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6 font-serif">
                            {lang === 'en' ? 'The Future of Ecological Investment' : 'El Futuro de la Inversión Ecológica'}
                        </h2>
                        <div className="h-1 w-24 bg-luxury-gold mx-auto mb-8"></div>
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                            {lang === 'en' 
                                ? "Position yourself ahead of the market. Join our exclusive founders list and secure entry-level pricing in the Caribbean's most promising luxury and sustainability destination." 
                                : "Posiciónese antes que el mercado. Únase a nuestra selecta lista de fundadores y asegure precios de entrada en el destino de lujo y sostenibilidad con mayor proyección del Caribe."}
                        </p>
                    </ScrollReveal>
                </div>

                {/* Main Card */}
            <Link href={`/${lang}/futuros-proyectos`} className="group block max-w-4xl mx-auto h-full">
                <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden h-full hover:border-luxury-gold/50 transition-all duration-300 flex flex-col group-hover:-translate-y-2 group-hover:shadow-2xl">
                    {/* Image Area */}
                    <div className="relative h-64 md:h-96 overflow-hidden">
                        <Image
                            src="/images/miches-eco-resort-main.jpg"
                            alt="Coming Soon Miches"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            quality={90}
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>

                        {/* Top Left Title Badge */}
                        <div className="absolute top-4 left-4 bg-black/70 text-luxury-gold backdrop-blur-md border border-luxury-gold/30 text-[10px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 z-10">
                            <FaLeaf className="text-xs" /> {lang === 'en' ? 'Eco-Luxury Development' : 'Desarrollo Eco-Luxury'}
                        </div>

                        {/* Top Right / Bottom Right Badge */}
                        <div className="absolute bottom-4 right-4 sm:bottom-auto sm:top-4 sm:right-4 bg-luxury-gold text-black text-[10px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest z-10 shadow-lg">
                            COMING SOON
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8 md:p-12 flex flex-col flex-grow bg-[#0a0a0a]">
                        <h3 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-white mb-4 whitespace-nowrap sm:whitespace-normal tracking-tight sm:tracking-normal group-hover:text-luxury-gold transition-colors">
                            Miches Eco-Resort
                        </h3>
                        <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 flex-grow">
                            {lang === 'en' 
                                ? 'A new ecological destination is being born in the Caribbean. A place designed to live, invest, and connect deeply with nature.' 
                                : 'Un nuevo destino ecológico está naciendo en el Caribe. Un lugar diseñado para vivir, invertir y conectar profundamente con la naturaleza.'}
                        </p>

                        <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between text-luxury-gold text-sm font-bold uppercase tracking-wider">
                            <span>{lang === 'en' ? 'Discover the Future' : 'Explorar el Futuro'}</span>
                            <FaArrowRight aria-hidden="true" className="transform group-hover:translate-x-2 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>
            </div>
        </section>
    );
}
