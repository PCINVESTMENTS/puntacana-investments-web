export default function FlyAndBuyPage({ params: { lang } }: { params: { lang: string } }) {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 bg-primary-black">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-luxury-gold mb-6 font-serif">
                    Fly & Buy
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
                    {lang === 'es'
                        ? "Nuestro exclusivo programa de viajes para inversionistas estará disponible pronto. Planifique su visita y descubra su próxima propiedad en el paraíso."
                        : "Our exclusive investor travel program is coming soon. Plan your visit and discover your next property in paradise."}
                </p>
                <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <div className="absolute inset-0 bg-dark-gray flex items-center justify-center">
                        <span className="text-luxury-gold text-lg">Image Placeholder: Luxury Jet or Resort View</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
