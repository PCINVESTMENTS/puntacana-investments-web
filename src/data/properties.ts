export interface Property {
    id: number;
    slug: string;
    title: string;
    location: string;
    locationLabel: string;
    type: string;
    status: 'sale' | 'rent';
    price: number;
    image: string;
    mainImage?: any;
    beds: number;
    baths: number;
    area: number;
    features: {
        en: string[];
        es: string[];
    };
    specs?: {
        en: string[];
        es: string[];
    };
    detailedSections?: {
        title: { en: string; es: string };
        content: { en: string; es: string };
    }[];
    description: {
        en: string;
        es: string;
    };
    gallery?: string[];
    rawGallery?: any[];
    videoUrl?: string;
    virtualTourUrl?: string;
    featured?: boolean;
    preLaunch?: boolean;
    preConstruction?: boolean;
    coordinates?: {
        lat: number;
        lng: number;
    };
    constructionStages?: {
        date: string;
        title: { es: string; en: string };
        description: { es: string; en: string };
        status: "completed" | "in-progress" | "pending";
    }[];
    completionPercent?: number;
    seo?: {
        title: { en: string; es: string };
        description: { en: string; es: string };
        keywords: { en: string[]; es: string[] };
    };
    hideFromLabel?: boolean;
}

export const properties: Property[] = [];
