"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Property } from "@/data/properties";
import { FaBed, FaBath, FaRulerCombined, FaSearch, FaArrowRight, FaExchangeAlt } from "react-icons/fa";
import { ScrollReveal } from "../ui/ScrollReveal";
import { useCompare } from "@/components/property/CompareContext";
import PropertyCardCarousel from "@/components/property/PropertyCardCarousel";

interface PropertyListingsProps {
    dict: {
        title: string;
        subtitle: string;
        viewDetails: string;
        filters: {
            allLocations: string;
            allTypes: string;
            maxPrice: string;
            search: string;
        };
        exploreMore: string;
        featuredProperties?: string;
        types: {
            all: string;
            condo: string;
            condohotel?: string;
            villa: string;
            penthouse: string;
            land: string;
            commercial: string;
            resorts?: string;
        };
        priceRanges: {
            any: string;
            "200k": string;
            "500k": string;
            "1m": string;
            "1m_plus": string;
        };
    };
    lang: string;
    locations?: readonly { title: string; slug: string }[];
    featured?: boolean;
    showFeaturedOnly?: boolean;
    featuredLimit?: number;
    featuredCategory?: 'sale' | 'rent';
    sectionId?: string;
    sectionTitle?: string;
    initialFilters?: {
        location?: string;
        type?: string;
        status?: string;
        maxPrice?: string;
    };
    lockedStatus?: 'sale' | 'rent';
    exploreLink?: string;
    initialData: Property[];
}

function CompareToggle({ property }: { property: Property }) {
    const { addToCompare, removeFromCompare, isComparing } = useCompare();
    const active = isComparing(property.id);

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                active ? removeFromCompare(property.id) : addToCompare(property);
            }}
            className={`absolute bottom-4 left-4 z-20 p-4 rounded-full transition-all duration-300 shadow-lg ${active
                ? "bg-luxury-gold text-black scale-110"
                : "bg-black/60 text-white hover:bg-luxury-gold/80 hover:text-black"
                }`}
            title={active ? "Quitar de comparación" : "Añadir a comparación"}
            aria-label={active ? "Quitar de comparación" : "Añadir a comparación"}
        >
            <FaExchangeAlt aria-hidden="true" className={active ? "rotate-180 transition-transform" : ""} />
        </button>
    );
}

function PropertyListingsContent({
    dict,
    lang,
    locations = [],
    featured = false,
    showFeaturedOnly = false,
    featuredLimit = 6,
    featuredCategory = 'sale',
    sectionId = 'properties',
    sectionTitle,
    initialFilters = {},
    lockedStatus,
    exploreLink,
    initialData
}: PropertyListingsProps) {
    const searchParams = useSearchParams();
    const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialData);

    // Initialize state from URL params if available, else default (or featured defaults)
    const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || initialFilters.location || "all");
    const [selectedType, setSelectedType] = useState(searchParams.get("type") || initialFilters.type || "all");
    const [selectedStatus, setSelectedStatus] = useState(lockedStatus || searchParams.get("status") || initialFilters.status || (featured ? featuredCategory : "all"));
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || initialFilters.maxPrice || "any");
    const [isProject, setIsProject] = useState<string | null>(searchParams.get("project") || null);

    // Sync with URL changes
    useEffect(() => {
        if (!featured) {
            const loc = searchParams.get("location");
            const type = searchParams.get("type");
            const status = searchParams.get("status");
            const price = searchParams.get("maxPrice");
            const project = searchParams.get("project");

            if (loc) setSelectedLocation(loc);
            if (type) setSelectedType(type);
            if (!lockedStatus && status) setSelectedStatus(status);
            if (price) setMaxPrice(price);
            setIsProject(project);
        }
    }, [searchParams, featured, lockedStatus]);

    // Filter Logic
    useEffect(() => {
        let filtered = initialData.filter((p) => {
            const matchLoc = selectedLocation === "all" ||
                p.location === selectedLocation ||
                (selectedLocation === 'bavaro' && ['vistacana', 'whitesands'].includes(p.location));
            const matchType = selectedType === "all" || p.type === selectedType;
            const matchStatus = selectedStatus === "all" || p.status === selectedStatus;
            const matchPrice = maxPrice === "any" || p.price <= parseInt(maxPrice);

            // Project logic: preConstruction/preLaunch define a "project"
            const isP = p.preConstruction || p.preLaunch;
            // If isProject is null or 'all', show everything.
            // If isProject is 'true', show only projects.
            // If isProject is 'false', show only non-projects.
            const matchProject = (isProject === null || isProject === "all") ? true : (isProject === "true" ? isP : !isP);

            return matchLoc && matchType && matchStatus && matchPrice && matchProject;
        });

        if (showFeaturedOnly) {
            filtered = initialData.filter(p => p.featured === true).slice(0, featuredLimit);
        } else if (featured) {
            filtered = initialData.filter(p => p.status === featuredCategory).slice(0, featuredLimit);
        }

        setFilteredProperties(filtered);
    }, [selectedLocation, selectedType, selectedStatus, maxPrice, isProject, featured, featuredCategory, featuredLimit, initialData]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            {/* FILTERS SECTION - Hide if featured */}
            {!featured && (
                <div className="relative z-20 mt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="bg-dark-gray p-8 shadow-2xl border-t-4 border-luxury-gold">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            {/* Location Filter */}
                            <div>
                                <label htmlFor="properties-location" className="block text-luxury-gold text-xs uppercase tracking-wider mb-2 font-bold">
                                    {dict.filters.allLocations}
                                </label>
                                <select
                                    id="properties-location"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    aria-label="Filtrar por ubicación"
                                    className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors"
                                >
                                    <option value="all">{dict.filters.allLocations}</option>
                                    {locations.map((loc) => (
                                        <option key={loc.slug} value={loc.slug}>
                                            {loc.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Type Filter */}
                            <div>
                                <label htmlFor="properties-type" className="block text-luxury-gold text-xs uppercase tracking-wider mb-2 font-bold">
                                    {dict.filters.allTypes}
                                </label>
                                <select
                                    id="properties-type"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    aria-label="Filtrar por tipo de propiedad"
                                    className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors"
                                >
                                    <option value="all">{dict.types.all}</option>
                                    <option value="condo">{dict.types.condo}</option>
                                    <option value="condohotel">{dict.types.condohotel}</option>
                                    <option value="villa">{dict.types.villa}</option>
                                    <option value="resorts">{dict.types.resorts}</option>
                                    <option value="penthouse">{dict.types.penthouse}</option>
                                    <option value="land">{dict.types.land}</option>
                                    <option value="commercial">{dict.types.commercial}</option>
                                </select>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <label htmlFor="properties-price" className="block text-luxury-gold text-xs uppercase tracking-wider mb-2 font-bold">
                                    {dict.filters.maxPrice}
                                </label>
                                <select
                                    id="properties-price"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    aria-label="Filtrar por precio máximo"
                                    className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors"
                                >
                                    <option value="any">{dict.priceRanges.any}</option>
                                    <option value="200000">{dict.priceRanges["200k"]}</option>
                                    <option value="500000">{dict.priceRanges["500k"]}</option>
                                    <option value="1000000">{dict.priceRanges["1m"]}</option>
                                    <option value="999999999">{dict.priceRanges["1m_plus"]}</option>
                                </select>
                            </div>

                            {/* Search Button */}
                            <div>
                                <button
                                    className="w-full bg-luxury-gold text-black font-bold py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex justify-center items-center gap-2"
                                    onClick={() => {
                                        document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    <FaSearch aria-hidden="true" /> {dict.filters.search}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PROPERTIES GRID */}
            <section id={sectionId} className={`bg-primary-black ${featured ? 'py-12' : 'py-16'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal width="100%">
                        <div className="text-center mb-16">
                            <span className="text-luxury-gold uppercase tracking-[0.2em] text-sm font-semibold">
                                {dict.subtitle}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6 font-serif">
                                {sectionTitle || (featured && dict.featuredProperties ? dict.featuredProperties : dict.title)}
                            </h2>
                            <div className="h-1 w-24 bg-luxury-gold mx-auto"></div>
                            {!featured && (
                                <p className="text-neutral-gray mt-6 max-w-2xl mx-auto">
                                    Mostrando {filteredProperties.length} propiedades
                                </p>
                            )}
                        </div>
                    </ScrollReveal>

                    {/* Quick Category Tabs - Hide if featured */}
                    {!featured && (
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {[
                                { id: "all", label: "Todos" },
                                { id: "puntacana", label: "Punta Cana" },
                                { id: "capcana", label: "Cap Cana" },
                                { id: "bavaro", label: "Bávaro" },
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedLocation(cat.id)}
                                    className={`px-6 py-2 border text-sm uppercase tracking-wider font-bold transition-all ${selectedLocation === cat.id
                                        ? "border-luxury-gold bg-luxury-gold text-black"
                                        : "border-white/20 text-gray-400 hover:border-luxury-gold hover:text-luxury-gold"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties.length === 0 ? (
                            <div className="col-span-full text-center py-20">
                                <h3 className="text-2xl text-white font-serif">No se encontraron propiedades</h3>
                                {!featured && (
                                    <button
                                        onClick={() => { setSelectedLocation("all"); setSelectedType("all"); setMaxPrice("any"); }}
                                        className="mt-4 text-luxury-gold hover:underline"
                                    >
                                        Resetear filtros
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredProperties.map((prop, index) => (
                                <ScrollReveal key={prop.id} delay={index * 0.1}>
                                    <div className="group bg-dark-gray border border-white/5 hover:border-luxury-gold/50 transition-all duration-500 overflow-hidden relative flex flex-col h-full shadow-xl">
                                        <div className="relative overflow-hidden h-72">
                                            <PropertyCardCarousel
                                                images={prop.gallery && prop.gallery.length > 0 ? prop.gallery : [prop.image]}
                                                rawImages={prop.rawGallery && prop.rawGallery.length > 0 ? prop.rawGallery : (prop.mainImage ? [prop.mainImage] : [])}
                                                title={prop.title}
                                            />
                                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                                                <div className="bg-black/80 text-white px-4 py-1 text-xs uppercase tracking-wider border-l-2 border-luxury-gold">
                                                    {prop.locationLabel}
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-lg z-10 ${prop.status === 'sale'
                                                ? 'bg-luxury-gold text-black'
                                                : 'bg-white text-black'
                                                }`}>
                                                {prop.status === 'sale'
                                                    ? (lang === 'en' ? 'For Sale' : 'Venta')
                                                    : (lang === 'en' ? 'Monthly Rent' : 'Renta Mensual')
                                                }
                                            </div>

                                            <CompareToggle property={prop} />
                                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent h-24 opacity-80 pointer-events-none"></div>
                                        </div>

                                        <Link
                                            href={`/${lang}/properties/${typeof prop.slug === 'object' && prop.slug !== null ? (prop.slug as any).current : prop.slug}`}
                                            className="flex-grow flex flex-col"
                                        >
                                            <div className="p-8 relative flex-grow flex flex-col">
                                                {/* Pre-Construction / Pre-Sales / Resale Badge */}
                                                {(prop.preLaunch || prop.preConstruction || prop.isResale) && (
                                                    <div className={`absolute -top-6 left-2 md:left-4 text-white font-bold px-2 md:px-3 py-2 shadow-lg text-[10px] md:text-xs z-30 uppercase tracking-tight md:tracking-wider ${prop.isResale ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                                                        {prop.isResale
                                                            ? (lang === 'en' ? 'Resale' : 'Reventa')
                                                            : (prop.preConstruction
                                                                ? (lang === 'en' ? 'Pre-Construction' : 'Pre-Construcción')
                                                                : (lang === 'en' ? 'Pre-Sales' : 'Pre-Ventas')
                                                            )
                                                        }
                                                    </div>
                                                )}

                                                <div className="absolute -top-6 right-2 md:right-4 bg-luxury-gold text-black font-bold px-3 md:px-4 py-2 shadow-lg text-[10px] md:text-xs z-30">
                                                    {(prop.is_rental_active && prop.rental_price ? prop.rental_price : prop.price) > 0 ? (
                                                        <>
                                                            {(!prop.hideFromLabel && prop.status !== 'rent' && prop.type !== 'land' && prop.type !== 'commercial') && (lang === 'en' ? 'From ' : 'Desde ')} {formatPrice(prop.is_rental_active && prop.rental_price ? prop.rental_price : prop.price)}
                                                            {prop.status === 'rent' && (lang === 'en' ? ' /mo' : ' /mes')}
                                                        </>
                                                    ) : (
                                                        lang === 'en' ? 'Price on Request' : 'Precio a Consultar'
                                                    )}
                                                </div>

                                                <h3 className="text-2xl text-white font-serif mb-2 group-hover:text-luxury-gold transition-colors">
                                                    {prop.title}
                                                </h3>
                                                <p className="text-neutral-gray text-sm mb-6 line-clamp-2">
                                                    {prop.description[lang as 'en' | 'es']}
                                                </p>

                                                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-auto">
                                                    <div className="flex space-x-4 text-gray-400 text-xs">
                                                        {prop.beds > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <FaBed aria-hidden="true" /> {prop.beds}
                                                            </span>
                                                        )}
                                                        {prop.baths > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <FaBath aria-hidden="true" /> {prop.baths}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <FaRulerCombined aria-hidden="true" /> {prop.area} m² <span className="text-gray-500">/</span> {Math.round(prop.area * 10.764)} ft²
                                                        </span>
                                                    </div>
                                                    <span
                                                        className="text-luxury-gold uppercase text-xs font-bold tracking-widest group-hover:text-white transition-colors flex items-center p-2 -mr-2"
                                                    >
                                                        {dict.viewDetails} <FaArrowRight aria-hidden="true" className="ml-2 text-[10px]" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </ScrollReveal>
                            ))
                        )}
                    </div>

                    {/* Explore More Button for Featured View */}
                    {featured && (
                        <div className="mt-12 text-center">
                            <Link
                                href={exploreLink || `/${lang}/properties`}
                                className="inline-block bg-luxury-gold text-black font-bold py-4 px-10 rounded-sm hover:bg-white transition-colors uppercase tracking-widest text-sm shadow-lg hover:shadow-xl"
                            >
                                {dict.exploreMore}
                            </Link>
                        </div>
                    )}
                </div >
            </section >
        </>
    );
}

export default function PropertyListings(props: PropertyListingsProps) {
    return (
        <Suspense fallback={<div className="text-white text-center py-20">Loading...</div>}>
            <PropertyListingsContent {...props} />
        </Suspense>
    );
}
