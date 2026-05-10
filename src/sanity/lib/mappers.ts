import { BlogPost } from "@/data/blog";
import { Property } from "@/data/properties";

export function mapSanityPost(data: any): BlogPost {
    if (!data) return null as any;

    let safeImageUrl = data.mainImage ? urlFor(data.mainImage).url() : (data.imageUrl || "");

    return {
        slug: data.slug?.current || data.slug || "",
        title: { en: data.title, es: data.title }, // Fallback mainly, or fetch both if defined
        date: {
            en: new Date(data.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            es: new Date(data.publishedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
        },
        category: data.category || { es: "General", en: "General" },
        mainImage: safeImageUrl,
        excerpt: {
            en: data.excerptEn || "",
            es: data.excerptEs || ""
        },
        author: data.author || "Admin",
        authorRole: data.authorRole || { es: "Autor", en: "Author" },
        authorBio: data.authorBio || { es: "", en: "" },
        authorImage: data.authorImage ? urlFor(data.authorImage).url() : "/images/logo-footer-v2.png",
        content: {
            en: data.contentEn || [],
            es: data.contentEs || []
        },
        relatedProperties: []
    };
}
import { urlFor } from "@/sanity/lib/image";

export function mapSanityProperty(data: any): Property {
    if (!data) return null as any;

    let safeMainImage = data.mainImage ? urlFor(data.mainImage).url() : (data.imageUrl || "");
    
    const safeGalleryUrls = data.gallery 
        ? data.gallery.map((img: any) => urlFor(img).url()) 
        : (data.galleryUrls || []);

    return {
        ...data,
        image: safeMainImage,
        mainImage: data.mainImage,
        gallery: safeGalleryUrls,
        rawGallery: data.gallery,
        features: {
            en: data.featuresEn || [],
            es: data.featuresEs || []
        },
        description: {
            en: data.descriptionEn || "",
            es: data.descriptionEs || ""
        },
        tagline: data.tagline?.includes('Error generating content') 
            ? "Exclusivo Apartamento de Lujo, Ideal para Inversión y Alta Rentabilidad (ROI)" 
            : data.tagline,
        locationLabel: data.locationLabel || (data.title?.includes('Epic') ? 'Epic Residences' : 'Punta Cana'),
        constructionStages: data.constructionStages?.map((stage: any) => ({
            date: stage.date,
            title: { en: stage.titleEn, es: stage.titleEs },
            description: { en: stage.descriptionEn, es: stage.descriptionEs },
            status: stage.status
        })),
        seo: {
            title: {
                en: data.seo?.title?.en || data.title,
                es: data.seo?.title?.es || data.title
            },
            description: {
                en: data.seo?.description?.en || data.descriptionEn || "",
                es: data.seo?.description?.es || data.descriptionEs || ""
            },
            keywords: {
                en: data.seo?.keywords?.en?.some((k: string) => k.includes('Error')) ? [
                    "Real estate investment Punta Cana", "High ROI properties Punta Cana", "Airbnb investment properties Dominican Republic", "Buy condo for vacation rental Punta Cana", "Punta Cana luxury real estate", "Invest in Epic Residences Punta Cana", "Tax-free real estate Punta Cana (CONFOTUR)", "1 bedroom condo for sale Punta Cana", "Condos for sale Downtown Punta Cana", "Epic Residences Punta Cana project", "Affordable condos in Punta Cana", "Pre-construction condos Punta Cana City Place", "Condos near the beach Punta Cana", "Condos in Punta Cana City Place", "Downtown Punta Cana real estate", "Buy property in Punta Cana", "New construction condos Punta Cana", "Punta Cana real estate agent", "Best places to buy property in Punta Cana"
                ] : (data.seo?.keywords?.en || []),
                es: data.seo?.keywords?.es?.some((k: string) => k.includes('Error')) ? [
                    "Inversión inmobiliaria en Punta Cana", "Apartamentos rentables en Punta Cana", "Alta rentabilidad ROI Punta Cana", "Apartamentos para Airbnb en Punta Cana", "Comprar apartamento para alquilar Punta Cana", "Bienes raíces de lujo República Dominicana", "Invertir en Epic Residences Punta Cana", "Apartamento de 1 habitación en Punta Cana", "Apartamentos en venta Downtown Punta Cana", "Proyecto Epic Residences Punta Cana", "Apartamentos económicos Punta Cana", "Apartamentos en planos Punta Cana City Place", "Inmuebles cerca de la playa Punta Cana", "Apartamentos en Punta Cana City Place", "Bienes raíces Downtown Punta Cana", "Comprar propiedad en Punta Cana", "Apartamentos nuevos Punta Cana", "Real Estate Punta Cana", "Mejores apartamentos para comprar en Punta Cana"
                ] : (data.seo?.keywords?.es || [])
            }
        }
    };
}
