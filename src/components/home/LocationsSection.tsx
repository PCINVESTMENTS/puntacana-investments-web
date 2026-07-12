import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "../ui/ScrollReveal";

interface LocationsSectionProps {
    dict: {
        title: string;
        subtitle: string;
        exploreMore: string;
        items?: readonly {
            title: string;
            slug: string;
            img: string;
        }[];
    };
    limit?: number;
    lang?: string;
    prioritizeImages?: boolean;
    apiLocations?: any[];
}

export function LocationsSection({ dict, limit, lang = 'es', prioritizeImages = false, apiLocations = [] }: LocationsSectionProps) {
    let locations = apiLocations.length > 0 ? apiLocations : (dict.items || []);

    if (limit) {
        locations = locations.slice(0, limit);
    }

    return (
        <section id="locations" className="pt-12 pb-8 bg-primary-black text-center text-white relative">
            {/* Background Decoration - Optional to match other dark sections */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <ScrollReveal width="100%">
                    <div className="mb-12">
                        <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">{dict.subtitle}</span>
                        <h2 className="text-4xl font-serif font-bold mt-2 text-white">{dict.title}</h2>
                    </div>
                </ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map((loc, idx) => {
                        const isPriority = prioritizeImages && idx < 4;
                        return (
                            <Link
                                key={idx}
                                href={`/${lang}/properties?location=${loc.slug}`}
                                className="group relative h-64 overflow-hidden cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 block"
                            >
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={loc.img}
                                        alt={loc.title}
                                        fill
                                        quality={60}
                                        priority={isPriority}
                                        {...(isPriority ? { fetchPriority: "high" } : {})}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors duration-300 z-20"></div>

                            <div className="absolute inset-0 flex items-center justify-center z-30">
                                <h3 className="text-3xl font-bold text-luxury-gold text-center px-4" style={{ textShadow: '0 4px 6px rgba(0,0,0,0.9)' }}>
                                    {loc.title}
                                </h3>
                            </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Explore More Button */}
                {limit && (
                    <div className="mt-12 text-center">
                        <Link
                            href={`/${lang}/locations`}
                            className="inline-block bg-luxury-gold text-black font-bold py-4 px-10 rounded-sm hover:bg-white transition-colors uppercase tracking-widest text-sm shadow-lg hover:shadow-xl"
                        >
                            {dict.exploreMore}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
