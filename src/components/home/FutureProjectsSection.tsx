import Link from "next/link";
import Image from "next/image";
import { FaLeaf } from "react-icons/fa";

export default function FutureProjectsSection({ lang }: { lang: string }) {
    return (
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/miches-eco-resort-main.jpg"
                    alt="Coming Soon Miches"
                    fill
                    className="object-cover object-center"
                    quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-black/50 to-black/30"></div>
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
                <div className="flex items-center gap-3 mb-6 bg-luxury-gold/20 backdrop-blur-sm px-6 py-2 rounded-full border border-luxury-gold/30">
                    <FaLeaf className="text-luxury-gold" />
                    <span className="uppercase tracking-[0.3em] text-sm font-bold text-luxury-gold">
                        {lang === 'en' ? 'Eco-Luxury Development' : 'Desarrollo Eco-Luxury'}
                    </span>
                </div>
                
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 uppercase tracking-widest drop-shadow-2xl">
                    Coming Soon <br />
                    <span className="text-luxury-gold italic">Miches</span>
                </h2>
                
                <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mb-12 font-light leading-relaxed">
                    {lang === 'en' 
                        ? 'A new ecological destination is being born in the Caribbean. A place designed to live, invest, and connect deeply with nature.' 
                        : 'Un nuevo destino ecológico está naciendo en el Caribe. Un lugar diseñado para vivir, invertir y conectar profundamente con la naturaleza.'}
                </p>
                
                <Link 
                    href={`/${lang}/futuros-proyectos`}
                    className="inline-block bg-luxury-gold text-black font-bold text-sm md:text-base uppercase tracking-widest px-10 py-4 hover:bg-white transition-colors duration-300 shadow-xl"
                >
                    {lang === 'en' ? 'Discover the Future' : 'Explorar el Futuro'}
                </Link>
            </div>
        </section>
    );
}
