"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property } from "@/data/properties";

interface CompareContextType {
    selectedProperties: Property[];
    addToCompare: (property: Property) => void;
    removeFromCompare: (propertyId: number) => void;
    clearCompare: () => void;
    isComparing: (propertyId: number) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
    const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("property_compare");
        if (saved) {
            try {
                setSelectedProperties(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse compare data", e);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("property_compare", JSON.stringify(selectedProperties));
    }, [selectedProperties]);

    const addToCompare = (property: Property) => {
        if (selectedProperties.length >= 4) {
            // Limit to 4 for UX/Layout reasons
            return;
        }
        if (!selectedProperties.find(p => p.id === property.id)) {
            setSelectedProperties(prev => [...prev, property]);
        }
    };

    const removeFromCompare = (propertyId: number) => {
        setSelectedProperties(prev => prev.filter(p => p.id !== propertyId));
    };

    const clearCompare = () => {
        setSelectedProperties([]);
    };

    const isComparing = (propertyId: number) => {
        return !!selectedProperties.find(p => p.id === propertyId);
    };

    return (
        <CompareContext.Provider value={{ selectedProperties, addToCompare, removeFromCompare, clearCompare, isComparing }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
}
