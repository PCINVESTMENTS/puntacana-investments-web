"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function PropertyFilterBar({ dict, locations, lang }: PropertyFilterBarProps) {
    const router = useRouter();
    const [selectedLocation, setSelectedLocation] = useState("all");
    const [selectedType, setSelectedType] = useState("all");
    const [maxPrice, setMaxPrice] = useState("any");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedLocation !== "all") params.set("location", selectedLocation);
        if (selectedType !== "all") params.set("type", selectedType);
        if (maxPrice !== "any") params.set("maxPrice", maxPrice);

        router.push(`/${lang}/properties?${params.toString()}`);
    };

    return (
        <div className="relative z-30 -mt-6 md:-mt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
            <div className="bg-dark-gray p-4 md:p-8 shadow-2xl border-t-4 border-luxury-gold">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 items-end">
                    {/* Location Filter */}
                    <div className="col-span-1">
                        <label className="block text-luxury-gold text-[10px] md:text-xs uppercase tracking-wider mb-1 md:mb-2 font-bold truncate">
                            {dict.filters.allLocations}
                        </label>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full bg-black border border-white/10 text-white text-sm md:text-base px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-luxury-gold transition-colors"
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
                        <label className="block text-luxury-gold text-[10px] md:text-xs uppercase tracking-wider mb-1 md:mb-2 font-bold truncate">
                            {dict.filters.allTypes}
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full bg-black border border-white/10 text-white text-sm md:text-base px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-luxury-gold transition-colors"
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
                        <label className="block text-luxury-gold text-[10px] md:text-xs uppercase tracking-wider mb-1 md:mb-2 font-bold truncate">
                            {dict.filters.maxPrice}
                        </label>
                        <select
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full bg-black border border-white/10 text-white text-sm md:text-base px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:border-luxury-gold transition-colors"
                        >
                            <option value="any">{dict.priceRanges.any}</option>
                            <option value="200000">{dict.priceRanges["200k"]}</option>
                            <option value="500000">{dict.priceRanges["500k"]}</option>
                            <option value="1000000">{dict.priceRanges["1m"]}</option>
                            <option value="999999999">{dict.priceRanges["1m_plus"]}</option>
                        </select>
                    </div>

                    {/* Search Button */}
                    <div className="col-span-1">
                        <button
                            onClick={handleSearch}
                            className="w-full bg-luxury-gold text-black font-bold text-sm md:text-base py-2 md:py-3 uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex justify-center items-center gap-2 h-[38px] md:h-[50px]"
                        >
                            <FaSearch /> {dict.filters.search}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
