"use client";

import { FaMapMarkerAlt, FaGolfBall, FaAnchor, FaPlane, FaUmbrellaBeach } from "react-icons/fa";

interface InteractiveMapProps {
    lat: number;
    lng: number;
    title: string;
    lang: string;
}

export default function InteractiveMap({ lat, lng, title, lang }: InteractiveMapProps) {
    // POIs for Punta Cana / Cap Cana area
    const pois = [
        { name: "Punta Espada Golf Club", icon: <FaGolfBall />, dist: "5 min" },
        { name: "Juanillo Beach", icon: <FaUmbrellaBeach />, dist: "8 min" },
        { name: "Cap Cana Marina", icon: <FaAnchor />, dist: "10 min" },
        { name: "Punta Cana Airport", icon: <FaPlane />, dist: "15 min" },
    ];

    const freeEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed&t=k`;

    return (
        <div className="bg-dark-gray border border-white/5 rounded-lg overflow-hidden">
            <div className="p-8 pb-0">
                <h3 className="text-2xl font-serif font-bold text-luxury-gold mb-2 uppercase tracking-wider flex items-center gap-3">
                    <FaMapMarkerAlt /> {lang === "en" ? "Lifestyle Map" : "Mapa de Estilo de Vida"}
                </h3>
                <p className="text-gray-400 text-sm mb-6 font-light">
                    {lang === "en"
                        ? `Explore the surroundings of ${title} and discover why it is the perfect place.`
                        : `Explora los alrededores de ${title} y descubre por qué es el lugar perfecto.`}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                {/* POI List */}
                <div className="lg:col-span-1 border-r border-white/5 p-6 space-y-4 bg-black/20">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                        {lang === "en" ? "Points of Interest" : "Puntos de Interés"}
                    </h4>
                    {pois.map((poi, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded hover:bg-luxury-gold/10 transition-colors cursor-default group">
                            <div className="text-luxury-gold group-hover:scale-110 transition-transform">
                                {poi.icon}
                            </div>
                            <div>
                                <div className="text-white text-sm font-medium">{poi.name}</div>
                                <div className="text-gray-500 text-[10px] uppercase font-bold">{poi.dist}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Map View */}
                <div className="lg:col-span-3 h-[400px] relative">
                    <iframe
                        src={freeEmbedUrl}
                        className="w-full h-full border-0 grayscale-[80%] brightness-[0.8] contrast-[1.2] invert-[0.9] hue-rotate-[180deg]"
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                    {/* Floating Overlay for luxury feel */}
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm p-3 border border-luxury-gold/30 rounded shadow-2xl">
                        <div className="flex items-center gap-2 text-luxury-gold font-bold text-xs uppercase tracking-tighter">
                            <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse"></div>
                            Live Location Insight
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
