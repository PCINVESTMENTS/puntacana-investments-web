import { BlogPost } from "@/data/blog";
import { Property } from "@/data/properties";

export function mapSanityPost(data: any): BlogPost {
    if (!data) return null as any;

    let safeImageUrl = data.mainImage ? urlFor(data.mainImage).url() : (data.imageUrl || "");
    const slug = data.slug?.current || data.slug || "";

    const exactTitlesFr: Record<string, string> = {
        "5-razones-invertir-punta-cana-2026": "5 Raisons Irréfutables d'Investir à Punta Cana en 2026",
        "guia-comprar-planos": "Guide pour Acheter des Propriétés sur Plan à Punta Cana",
        "tendencias-diseno-tropical": "Tendances de Design d'Intérieur Tropical",
        "guia-invertir-seguro-punta-cana-evitar-estafas": "Guide de Maître pour Investir à Punta Cana: Comment Protéger votre Capital et Éviter les Arnaques"
    };

    const exactTitlesEs: Record<string, string> = {
        "5-razones-invertir-punta-cana-2026": "5 Razones Irrefutables para Invertir en Punta Cana en 2026",
        "guia-comprar-planos": "Guía para Comprar Propiedades en Planos en Punta Cana",
        "tendencias-diseno-tropical": "Tendencias de Diseño de Interiores Tropicales",
        "guia-invertir-seguro-punta-cana-evitar-estafas": "Guía Maestra para Invertir en Punta Cana: Cómo Blindar tu Capital y Evitar las Estafas Inmobiliarias"
    };

    const exactExcerptsFr: Record<string, string> = {
        "5-razones-invertir-punta-cana-2026": "Découvrez pourquoi Punta Cana est devenue la destination numéro un pour les investisseurs intelligents. Des incitations fiscales uniques à une rentabilité supérieure à la moyenne mondiale.",
        "guia-comprar-planos": "Maximisez votre retour sur investissement en profitant des prix de pré-vente grâce à notre guide expert.",
        "tendencias-diseno-tropical": "Matériaux naturels, espaces ouverts et luxe durable : ce qui se fait dans les villas modernes."
    };

    const exactCategoriesFr: Record<string, string> = {
        "5-razones-invertir-punta-cana-2026": "Investissement Stratégique",
        "guia-comprar-planos": "Conseils",
        "tendencias-diseno-tropical": "Style de Vie"
    };

    const titleEn = data.titleEn || data.title || "";
    const titleEs = exactTitlesEs[slug] || data.titleEs || data.title || "";
    const titleFr = exactTitlesFr[slug] || titleEn;

    const excerptEn = data.excerptEn || "";
    const excerptEs = data.excerptEs || "";
    const excerptFr = exactExcerptsFr[slug] || excerptEn;

    const categoryEs = data.category?.es || "General";
    const categoryEn = data.category?.en || "General";
    const categoryFr = exactCategoriesFr[slug] || "Général";

    return {
        slug: slug,
        title: { en: titleEn, es: titleEs, fr: titleFr },
        date: {
            en: new Date(data.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            es: new Date(data.publishedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
            fr: new Date(data.publishedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
        },
        category: { es: categoryEs, en: categoryEn, fr: categoryFr },
        mainImage: safeImageUrl,
        excerpt: { en: excerptEn, es: excerptEs, fr: excerptFr },
        author: data.author || "Admin",
        authorRole: data.authorRole || { es: "Autor", en: "Author", fr: "Auteur" },
        authorBio: data.authorBio || { es: "", en: "", fr: "" },
        authorImage: data.authorImage ? urlFor(data.authorImage).url() : "/images/logo-footer-v2.png",
        content: {
            en: data.contentEn || [],
            es: data.contentEs || [],
            fr: data.contentEn || [] // Fallback to English content for French
        },
        relatedProperties: []
    };
}
import { urlFor } from "@/sanity/lib/image";

export function normalizeLocation(locationVal: any, locationLabel?: string, title?: string, slug?: string): string {
    // Prioritize Miches categorization if "miches" is present in any field
    const cleanLabel = (locationLabel || "").toLowerCase();
    const cleanTitle = (title || "").toLowerCase();
    const cleanSlug = (slug || "").toLowerCase();
    const cleanVal = (typeof locationVal === 'string' ? locationVal : (locationVal?.current || "")).toLowerCase();
    if (cleanLabel.includes("miches") || cleanTitle.includes("miches") || cleanSlug.includes("miches") || cleanVal.includes("miches")) {
        return "miches";
    }

    let rawStr = "";


    if (locationVal) {
        if (typeof locationVal === 'string') {
            rawStr = locationVal;
        } else if (typeof locationVal === 'object' && locationVal.current) {
            rawStr = locationVal.current;
        }
    }

    if (!rawStr && locationLabel) {
        rawStr = locationLabel;
    }
    if (!rawStr && title) {
        rawStr = title;
    }
    if (!rawStr && slug) {
        rawStr = slug;
    }

    const clean = rawStr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (clean.includes("cap cana") || clean.includes("capcana")) {
        return "capcana";
    }
    if (clean.includes("vista cana") || clean.includes("vistacana")) {
        return "vistacana";
    }
    if (clean.includes("white sands") || clean.includes("whitesands")) {
        return "whitesands";
    }
    if (clean.includes("punta cana") || clean.includes("puntacana")) {
        return "puntacana";
    }
    if (clean.includes("bavaro")) {
        return "bavaro";
    }
    if (clean.includes("miches")) {
        return "miches";
    }
    if (clean.includes("la romana") || clean.includes("laromana")) {
        return "laromana";
    }
    if (clean.includes("casa de campo") || clean.includes("casacampo")) {
        return "casacampo";
    }
    if (clean.includes("juan dolio") || clean.includes("juandolio")) {
        return "juandolio";
    }
    if (clean.includes("bayahibe")) {
        return "bayahibe";
    }
    if (clean.includes("santiago")) {
        return "santiago";
    }
    if (clean.includes("samana")) {
        return "samana";
    }
    if (clean.includes("las terrenas") || clean.includes("lasterrenas")) {
        return "lasterrenas";
    }
    if (clean.includes("puerto plata") || clean.includes("puertoplata")) {
        return "puertoplata";
    }

    return "puntacana"; // default fallback
}

export function mapSanityProperty(data: any): Property {
    if (!data) return null as any;

    let safeMainImage = data.mainImage ? (typeof data.mainImage === 'string' ? data.mainImage : (data.mainImage.asset?._ref ? urlFor(data.mainImage).url() : (data.imageUrl || data.image || ""))) : (data.imageUrl || data.image || "");
    
    // HOTFIX: Fix 404 typo in Sanity for Tropical Breeze image
    if (data.slug?.current === "apartamentos-tropical-breeze-brisas-punta-cana" || data.id === 6) {
        if (safeMainImage === "/images/tropical-breeze-brisas-punta-cana-pool-area.jpg" || !safeMainImage) {
            safeMainImage = "/images/tropical-breezes-main-facade-punta-cana.jpg";
        }
    }
    const safeGalleryUrls = data.gallery 
        ? data.gallery.map((img: any) => typeof img === 'string' ? img : (img.asset?._ref ? urlFor(img).url() : img)) 
        : (data.galleryUrls || []);

    const isEpic = data.title?.includes('Epic');


    let descriptionEs = data.descriptionEs || "";
    let descriptionEn = data.descriptionEn || "";
    let descriptionFr = data.descriptionFr || "";

    if (data.slug?.current === "alquiler-villa-lujo-amueblada-piscina-white-sands" || data.title?.includes("Sands")) {
        if (!descriptionFr) {
            descriptionFr = `Découvrez votre nouvelle oasis à Punta Cana. Cette spectaculaire villa entièrement meublée est située dans la communauté résidentielle exclusive de White Sands à Bávaro, alliant une architecture moderne à **double hauteur** au confort d'un complexe de classe mondiale. Conçue avec une attention aux moindres détails, cette propriété est prête à être habitée ou à générer un retour sur investissement immédiat.

## Caractéristiques de la Propriété

### Design et Espace
Structure moderne sur deux niveaux avec d'impressionnants plafonds à double hauteur dans le salon principal, maximisant la lumière naturelle et la ventilation. Elle dispose de **135 m²** d'aménagement intelligent et fonctionnel.

### Chambres et Salles de Bain
Elle dispose de **3 chambres spacieuses** (la principale avec balcon privé et dressing) et **3 salles de bain complètes**.

### Intérieur et Extérieur
Magnifiquement meublée avec des pièces haut de gamme. Elle comprend une grande cuisine moderne équipée d'un élégant îlot central. À l'extérieur, profitez de votre propre **piscine privée** et d'un parking pouvant accueillir deux véhicules, ainsi que d'une buanderie dédiée.

## L'expérience White Sands
Vivre à White Sands, c'est profiter d'un style de vie caribéen d'élite avec accès à des commodités de premier ordre :
- **Accès Privé à la Plage :** Entrée exclusive pour les résidents.
- **Golf :** Parcours de golf au sein de la communauté.
- **Sécurité :** Sécurité privée et contrôle d'accès 24/7.
- **Club-house :** Excellentes installations de loisirs.

## Conditions de Location
Avec un loyer mensuel de **1 800 $ USD**, cette villa représente une excellente opportunité pour les résidents à long terme. Profitez de la tranquillité et du luxe de White Sands avec toutes les commodités prêtes à l'emploi.`;
        }
    }



    let inferredType = data.type;
    if (!inferredType) {
        const titleLower = (data.title || "").toLowerCase();
        const slugLower = (data.slug?.current || data.slug || "").toLowerCase();
        if (/\b(villas?)\b/i.test(titleLower) || /\b(villas?)\b/i.test(slugLower)) {
            inferredType = "villa";
        } else if (/\b(apartamentos?|condos?|lofts?)\b/i.test(titleLower) || /\b(apartamentos?|condos?|lofts?)\b/i.test(slugLower)) {
            inferredType = "condo";
        } else if (/\b(terrenos?|solares?|lotes?)\b/i.test(titleLower) || /\b(terrenos?|solares?|lotes?)\b/i.test(slugLower)) {
            inferredType = "land";
        } else if (/\b(locales?|comerciales?)\b/i.test(titleLower) || /\b(locales?|comerciales?)\b/i.test(slugLower)) {
            inferredType = "commercial";
        } else if (/\b(resorts?|hoteles?)\b/i.test(titleLower) || /\b(resorts?|hoteles?)\b/i.test(slugLower)) {
            inferredType = "resorts";
        }
    }

    let resolvedId = data.id;
    if (data._id && data._id.startsWith('django_')) {
        resolvedId = (data.id || 0) + 10000;
    }

    const resolvedLocation = normalizeLocation(data.location, data.locationLabel, data.title, data.slug?.current || data.slug);

    return {
        ...data,
        id: resolvedId,
        type: inferredType,
        location: resolvedLocation,
        image: safeMainImage,
        mainImage: data.mainImage,

        gallery: safeGalleryUrls,
        rawGallery: data.gallery,
        features: {
            en: data.featuresEn || [],
            es: data.featuresEs || [],
            fr: data.featuresFr || []
        },
        description: {
            en: descriptionEn,
            es: descriptionEs,
            fr: descriptionFr
        },
        tagline: data.tagline?.includes('Error generating content') 
            ? "Exclusivo Apartamento de Lujo, Ideal para Inversión y Alta Rentabilidad (ROI)" 
            : data.tagline,
        locationLabel: data.locationLabel || (data.title?.includes('Epic') ? 'Epic Residences' : 'Punta Cana'),
        constructionStages: data.constructionStages?.map((stage: any) => ({
            date: stage.date,
            title: { en: stage.titleEn, es: stage.titleEs, fr: stage.titleFr || stage.titleEs },
            description: { en: stage.descriptionEn, es: stage.descriptionEs, fr: stage.descriptionFr || stage.descriptionEs },
            status: stage.status
        })),
        seo: {
            title: {
                en: data.seo?.title?.en || data.titleEn || data.title,
                es: data.seo?.title?.es || data.titleEs || data.title,
                fr: data.seo?.title?.fr || data.titleFr || data.title
            },
            description: {
                en: data.seo?.description?.en || data.descriptionEn || "",
                es: data.seo?.description?.es || data.descriptionEs || "",
                fr: data.seo?.description?.fr || data.descriptionFr || ""
            },
            keywords: {
                en: data.seo?.keywords?.en?.some((k: string) => k.includes('Error')) ? [
                    "Real estate investment Punta Cana", "High ROI properties Punta Cana", "Airbnb investment properties Dominican Republic", "Buy condo for vacation rental Punta Cana", "Punta Cana luxury real estate", "Invest in Epic Residences Punta Cana", "Tax-free real estate Punta Cana (CONFOTUR)", "1 bedroom condo for sale Punta Cana", "Condos for sale Downtown Punta Cana", "Epic Residences Punta Cana project", "Affordable condos in Punta Cana", "Pre-construction condos Punta Cana City Place", "Condos near the beach Punta Cana", "Condos in Punta Cana City Place", "Downtown Punta Cana real estate", "Buy property in Punta Cana", "New construction condos Punta Cana", "Punta Cana real estate agent", "Best places to buy property in Punta Cana"
                ] : (data.seo?.keywords?.en || []),
                es: data.seo?.keywords?.es?.some((k: string) => k.includes('Error')) ? [
                    "Inversión inmobiliaria en Punta Cana", "Apartamentos rentables en Punta Cana", "Alta rentabilidad ROI Punta Cana", "Apartamentos para Airbnb en Punta Cana", "Comprar apartamento para alquilar Punta Cana", "Bienes raíces de lujo República Dominicana", "Invertir en Epic Residences Punta Cana", "Apartamento de 1 habitación en Punta Cana", "Apartamentos en venta Downtown Punta Cana", "Proyecto Epic Residences Punta Cana", "Apartamentos económicos Punta Cana", "Apartamentos en planos Punta Cana City Place", "Inmuebles cerca de la playa Punta Cana", "Apartamentos en Punta Cana City Place", "Bienes raíces Downtown Punta Cana", "Comprar propiedad en Punta Cana", "Apartamentos nuevos Punta Cana", "Real Estate Punta Cana", "Mejores apartamentos para comprar en Punta Cana"
                ] : (data.seo?.keywords?.es || []),
                fr: data.seo?.keywords?.fr || []
            }
        }
    };
}
