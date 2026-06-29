import HeroCarousel from "./HeroCarousel";

interface HeroProps {
    dict: {
        subtitle: string;
        title: string;
        cta: string;
        scroll: string;
    };
    featuredImages: {
        id: number;
        mainImage: any;
        backupImage: string;
    }[];
}

export default function Hero({ dict, featuredImages }: HeroProps) {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary-black">
            {/* Background Slider - Fully Client Side */}
            <HeroCarousel featuredImages={featuredImages} altText={dict.title} />

            {/* Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-primary-black/60 md:from-black/20 md:to-primary-black/50 pointer-events-none"></div>

            {/* Content - Fully Server Rendered to bypass Hydration and avoid LCP delay */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pointer-events-none">
                <div className="bg-black/70 md:bg-black/60 md:backdrop-blur-[4px] border border-white/10 rounded-sm p-6 md:p-10 md:shadow-2xl max-w-3xl mx-auto min-h-[400px] md:min-h-[300px] flex flex-col justify-center pointer-events-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-luxury-gold leading-tight font-serif uppercase tracking-widest md:drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                        {dict.title}
                    </h1>
                    <div className="h-1 w-24 bg-luxury-gold mx-auto my-6 shadow-sm"></div>
                    <p className="text-xl md:text-2xl text-white font-serif italic font-light leading-relaxed md:drop-shadow-md tracking-wide">
                        {dict.subtitle}
                    </p>
                </div>
            </div>
        </section>
    );
}
