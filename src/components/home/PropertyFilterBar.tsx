"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";

interface PropertyFilterBarProps {
    dict: {
        filters: {
            allLocations: string;
            allTypes: string;
            maxPrice: string;
            search: string;
        };
        types: {
            all: string;
            condo: string;
            villa: string;
            penthouse: string;
            land: string;
            commercial: string;
        };
        priceRanges: {
            any: string;
            "200k": string;
            "500k": string;
            "1m": string;
            "1m_plus": string;
        };
    };
    locations: readonly { title: string; slug: string }[];
    lang: string;
}

function PropertyFilterBarContent({ dict, locations, lang }: PropertyFilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL or defaults
    const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "all");
    const [selectedType, setSelectedType] = useState(searchParams.get("type") || "all");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "any");

    // Sync state if URL changes externally (optional but good for consistency)
    useEffect(() => {
        setSelectedLocation(searchParams.get("location") || "all");
        setSelectedType(searchParams.get("type") || "all");
        setMaxPrice(searchParams.get("maxPrice") || "any");
    }, [searchParams]);

    const handleSearch = () => {
        const params = new URLSearchParams();

        // Preserve existing relevant params (like status)
        const currentStatus = searchParams.get("status");
        if (currentStatus) params.set("status", currentStatus);

        if (selectedLocation !== "all") params.set("location", selectedLocation);
        if (selectedType !== "all") params.set("type", selectedType);
        if (maxPrice !== "any") params.set("maxPrice", maxPrice);

        router.push(`/${lang}/properties?${params.toString()}`);
    };

    return (
        <div id="properties" className="relative z-30 -mt-6 md:-mt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
            <div className="bg-dark-gray p-4 md:p-8 shadow-2xl border-t-4 border-luxury-gold">
                {/* Mobile 'View All' Button */}
                <div className="md:hidden mb-4">
                    <Link
                        href={`/${lang}/properties`}
                        className="w-full bg-black/40 backdrop-blur-sm border border-luxury-gold/50 text-luxury-gold font-bold py-3 uppercase tracking-widest hover:bg-luxury-gold hover:text-black transition-all duration-300 flex justify-center items-center"
                    >
                        {lang === 'es' ? 'VER PROPIEDADES' : 'VIEW PROPERTIES'}
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 items-end">
                    {/* Location Filter */}
                    <div className="col-span-1">
                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2 font-bold truncate">
                            {dict.filters.allLocations}
                        </label>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full bg-black border border-white/10 text-white text-base px-3 py-3 md:px-4 md:py-3 focus:outline-none focus:border-luxury-gold transition-colors min-h-[48px]"
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
                    <div className="col-span-1">
                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2 font-bold truncate">
                            {dict.filters.allTypes}
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full bg-black border border-white/10 text-white text-base px-3 py-3 md:px-4 md:py-3 focus:outline-none focus:border-luxury-gold transition-colors min-h-[48px]"
                        >
                            <option value="all">{dict.types.all}</option>
                            <option value="condo">{dict.types.condo}</option>
                            <option value="villa">{dict.types.villa}</option>
                            <option value="penthouse">{dict.types.penthouse}</option>
                            <option value="land">{dict.types.land}</option>
                            <option value="commercial">{dict.types.commercial}</option>
                        </select>
                    </div>

                    {/* Price Filter */}
                    <div className="col-span-1">
                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2 font-bold truncate">
                            {dict.filters.maxPrice}
                        </label>
                        <select
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full bg-black border border-white/10 text-white text-base px-3 py-3 md:px-4 md:py-3 focus:outline-none focus:border-luxury-gold transition-colors min-h-[48px]"
                        >
                            <option value="any">{dict.priceRanges.any}</option>
                            <option value="200000">{dict.priceRanges["200k"]}</option>
                            <option value="500000">{dict.priceRanges["500k"]}</option>
                            <option value="1000000">{dict.priceRanges["1m"]}</option>
                            <option value="999999999">{dict.priceRanges["1m_plus"]}</option>
                        </select>
                    </div>

                    {/* Search Button */}
                    <div className="col-span-1 lg:col-span-1 md:col-span-2 md:mt-4 lg:mt-0">
                        <button
                            onClick={handleSearch}
                            className="w-full bg-luxury-gold text-black font-bold text-base py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex justify-center items-center gap-2 h-12 md:h-[50px]"
                        >
                            <FaSearch aria-hidden="true" /> {dict.filters.search}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Suspense } from "react";

export default function PropertyFilterBar(props: PropertyFilterBarProps) {
    return (
        <Suspense fallback={<div className="h-32 bg-dark-gray shadow-2xl border-t-4 border-luxury-gold max-w-7xl mx-auto -mt-32"></div>}>
            <PropertyFilterBarContent {...props} />
        </Suspense>
    );
}
