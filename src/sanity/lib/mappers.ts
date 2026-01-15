import { BlogPost } from "@/data/blog";
import { Property } from "@/data/properties";

export function mapSanityPost(data: any): BlogPost {
    if (!data) return null as any;

    return {
        slug: data.slug.current,
        title: { en: data.title, es: data.title }, // Fallback mainly, or fetch both if defined
        date: {
            en: new Date(data.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            es: new Date(data.publishedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
        },
        category: data.category || { es: "General", en: "General" },
        mainImage: data.mainImage ? urlFor(data.mainImage).url() : (data.imageUrl || ""),
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

    return {
        ...data,
        image: data.mainImage ? urlFor(data.mainImage).url() : (data.imageUrl || ""),
        gallery: data.gallery
            ? data.gallery.map((img: any) => urlFor(img).url())
            : (data.galleryUrls || []),
        features: {
            en: data.featuresEn || [],
            es: data.featuresEs || []
        },
        description: {
            en: data.descriptionEn || "",
            es: data.descriptionEs || ""
        },
        constructionStages: data.constructionStages?.map((stage: any) => ({
            date: stage.date,
            title: { en: stage.titleEn, es: stage.titleEs },
            description: { en: stage.descriptionEn, es: stage.descriptionEs },
            status: stage.status
        }))
    };
}
