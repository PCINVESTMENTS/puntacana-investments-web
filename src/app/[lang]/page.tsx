import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import { getDictionary } from "@/dictionaries/get-dictionary";
import PropertyFilterBar from "@/components/home/PropertyFilterBar";

// Lazy loading below-the-fold sections
import dynamic from 'next/dynamic';

const PropertyListings = dynamic(() => import("@/components/home/PropertyListings"), { ssr: true });

const ServicesSection = dynamic(() => import("@/components/home/ServicesSection"));
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection"));
const BlogSection = dynamic(() => import("@/components/home/BlogSection"));
const InvestmentsSection = dynamic(() => import("@/components/home/InvestmentsSection"));
const OffMarketClub = dynamic(() => import("@/components/home/OffMarketClub"));
const FlyAndBuySection = dynamic(() => import("@/components/home/FlyAndBuySection"));
const FutureProjectsSection = dynamic(() => import("@/components/home/FutureProjectsSection"));
// Refactored components
const LocationsSection = dynamic(() => import("@/components/home/LocationsSection").then(mod => mod.LocationsSection));
const AboutSection = dynamic(() => import("@/components/home/AboutSection").then(mod => mod.AboutSection));
const ContactSection = dynamic(() => import("@/components/home/ContactSection").then(mod => mod.ContactSection));
const Footer = dynamic(() => import("@/components/layout/Footer").then(mod => mod.Footer));

// Sanity
import { client } from "@/sanity/lib/client";
import { HOME_PAGE_PROPERTIES_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty, mapSanityPost } from "@/sanity/lib/mappers";
import { Property, properties as localProperties } from "@/data/properties";
import { BlogPost } from "@/data/blog";

import type { Metadata } from "next";

// Restoring ISR
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';

  const title = lang === 'en'
    ? "Punta Cana Investments | Luxury Real Estate & Exclusive Properties"
    : lang === 'fr'
    ? "Punta Cana Investments | Immobilier de Luxe & Propriétés Exclusives"
    : "Punta Cana Investments | Inmobiliaria de Lujo y Bienes Raíces";

  const description = lang === 'en'
    ? "Discover exclusive luxury villas, condos for sale, and real estate investment opportunities in Punta Cana, Bavaro, and Cap Cana, Dominican Republic."
    : lang === 'fr'
    ? "Découvrez des villas de luxe exclusives, des appartements à vendre et des opportunités d'investissement immobilier à Punta Cana, Bavaro et Cap Cana, en République Dominicaine."
    : "Descubre exclusivas villas de lujo, apartamentos en venta, y oportunidades de inversión en bienes raíces en Punta Cana, Bávaro, y Cap Cana, República Dominicana.";

  return {
    title,
    description,
    keywords: lang === 'en'
      ? ['Punta Cana real estate', 'Punta Cana investments', 'Properties for sale Punta Cana', 'Luxury real estate Punta Cana', 'Punta Cana Investments', 'Punta Cana Real Estate', 'Luxury Villas for sale Dominican Republic', 'Condos for sale Punta Cana', 'Cap Cana Real Estate', 'Invest in Bavaro properties', 'Dominican Republic real estate', 'Fly and Buy', 'Punta Cana homes for sale', 'Dominican Republic investment properties', 'Construction Punta Cana', 'Real Estate Developer Dominican Republic', 'Building contractors Punta Cana', 'Custom luxury villas construction', 'Retire in Punta Cana', 'Expat communities Dominican Republic', 'Beachfront villas for sale Punta Cana', 'Ocean view condos Bavaro', 'Airbnb investment Punta Cana', 'CONFOTUR law properties Dominican Republic', 'Tax-free real estate Punta Cana', 'Pre-construction condos Punta Cana', 'Vista Cana real estate', 'Punta Cana Resort and Club properties', 'Hotels for sale Dominican Republic', 'Beachfront land for hotel development', 'Resorts for sale Punta Cana', 'Commercial real estate Dominican Republic', 'Land for sale Punta Cana', 'Long terms rentals Punta Cana', 'Monthly rentals', 'Condo hotels for sale', 'Investments in Punta Cana', 'Bavaro investments', 'Invest in Miches', 'Hotels for sale in Miches', 'Land for hotel development Miches', 'Land real estate specialist Dominican Republic']
      : lang === 'fr'
      ? ['Immobilier Punta Cana', 'Investir à Punta Cana', 'Immobilier de luxe République Dominicaine', 'Punta Cana Investments', 'Immobilier Punta Cana', 'Villas de luxe à vendre République Dominicaine', 'Appartements à vendre Punta Cana', 'Immobilier Cap Cana', 'Investir dans des propriétés à Bavaro', 'Immobilier République Dominicaine', 'Fly and Buy', 'Maisons à vendre Punta Cana', 'Propriétés d\'investissement République Dominicaine', 'Construction Punta Cana', 'Promoteur Immobilier République Dominicaine', 'Entreprises de construction Punta Cana', 'Construction de villas de luxe sur mesure', 'Retraite à Punta Cana', 'Villas de luxe en bord de mer à vendre Punta Cana', 'Appartements avec vue sur mer Bavaro', 'Investissement Airbnb Punta Cana', 'Loi CONFOTUR propriétés République Dominicaine', 'Immobilier sans taxes Punta Cana', 'Appartements en pré-construction Punta Cana', 'Immobilier Vista Cana', 'Propriétés Punta Cana Resort and Club', 'Hôtels à vendre République Dominicaine', 'Terrain en bord de mer pour développement hôtelier', 'Resorts à vendre Punta Cana', 'Immobilier commercial République Dominicaine', 'Terrain à vendre Punta Cana', 'Locations à long terme Punta Cana', 'Locations mensuelles', 'Condo-hôtels à vendre', 'Investissements à Punta Cana', 'Investissements à Bavaro', 'Investir à Miches', 'Hôtels à vendre à Miches', 'Terrain pour développement hôtelier Miches', 'Spécialiste de l\'immobilier de terrain République Dominicaine']
      : ['Bienes raíces Punta Cana', 'Inversiones inmobiliarias Punta Cana', 'Invertir en República Dominicana', 'Casas en Punta Cana', 'Apartamentos en Punta Cana', 'Punta Cana Investments', 'Real Estate Punta Cana', 'Apartamentos en venta Punta Cana', 'Villas de lujo Republica Dominicana', 'Bienes raices Cap Cana', 'Invertir en Bavaro', 'Casas en venta Punta Cana', 'Proyectos inmobiliarios Punta Cana', 'Fly and Buy RD', 'Inmobiliaria Punta Cana', 'Constructora en Punta Cana', 'Construcción de villas', 'Desarrolladores de proyectos inmobiliarios RD', 'Ingeniería civil y arquitectura Punta Cana', 'Jubilarse en Punta Cana', 'Comprar casa en República Dominicana siendo extranjero', 'Villas frente al mar en Punta Cana', 'Casas cerca de la playa Punta Cana', 'Propiedades de alta rentabilidad para Airbnb', 'Proyectos en Planos Punta Cana', 'Casas en Vista Cana', 'Apartamentos en Los Corales Bavaro', 'Hoteles en ventas', 'Terrenos para construir hoteles en las playas', 'Resort en venta en Punta Cana', 'Locales comerciales Punta Cana', 'Solares en venta', 'Rentas mensual Punta Cana', 'Condo hotel en venta', 'Inversiones en Punta Cana', 'Inversiones en Bavaro', 'Inversiones en Miches', 'Hoteles en Miches en ventas', 'Terreno para desarrollar hoteles en Miches', 'Especialista en terrenos República Dominicana'],
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}`,
      siteName: 'Punta Cana Investments',
      images: [
        {
          url: `${baseUrl}/images/og-home-luxury.webp`,
          width: 1200,
          height: 630,
          alt: 'Luxury Real Estate in Punta Cana - Night View',
        },
      ],
      locale: lang === 'fr' ? 'fr_FR' : lang === 'en' ? 'en_US' : 'es_DO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/og-home-luxury.webp`],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'es': `${baseUrl}/es`,
        'x-default': `${baseUrl}/en`,
      },
    }
  }
}

export default async function Home({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // Fetch data from Sanity
  const rawProperties = await client.fetch(HOME_PAGE_PROPERTIES_QUERY);
  const fetchedProperties: Property[] = rawProperties
    .map(mapSanityProperty)
    .filter((p: any): p is Property => p && typeof p.id === 'number' && !isNaN(p.id));

  // =====================================================================================
  // 🤖 [AI_CRITICAL_INSTRUCTION]: DO NOT MODIFY THIS MERGE LOGIC UNLESS EXPLICITLY ASKED.
  // The system relies on Sanity as the Source of Truth. This logic ensures that LIVE Sanity
  // data (p) overrides any hardcoded local data (local), but PRESERVES the local images 
  // if Sanity doesn't have them yet. Altering this logic will break the Sanity->Vercel 
  // automated sync pipeline. 
  // =====================================================================================
  // Merge with local fallbacks, but Sanity data (p) takes precedence
  const mergedProperties = fetchedProperties.map(p => {
    const local = localProperties.find(lp => lp.id === p.id);
    return local ? { 
      ...local, 
      ...p,
      image: p.image || local.image,
      gallery: (p.gallery && p.gallery.length > 0) ? p.gallery : local.gallery,
      price: (p.id === 999 || p.id === 998) ? local.price : (p.price || local.price)
    } : p;
  });

  // Add properties that exist locally but not in Sanity
  const sanityIds = new Set(fetchedProperties.map(p => p.id));
  const localOnlyProperties = localProperties.filter(p => !sanityIds.has(p.id));

  const properties = [...mergedProperties, ...localOnlyProperties].sort((a, b) => {
    // Optional: Sort by ID descending to show newest first, or keep default
    return b.id - a.id;
  });

  const rawPosts = await client.fetch(POSTS_QUERY);
  const posts: BlogPost[] = rawPosts.map(mapSanityPost);

  // Strip massive blog post content payload for the home page to drastically reduce HTML size (improves LCP)
  const strippedPosts = posts.slice(0, 3).map(post => ({
    ...post,
    content: { es: "", en: "", fr: "" },
    rawContent: null
  } as unknown as BlogPost));

  // Fetch locations from Railway API securely on the server-side to prevent Layout Shifts and Client Fetching overhead
  let apiLocations: any[] = [];
  try {
      const API_BASE = 'https://puntacana-fortress-production.up.railway.app';
      const endpoint = `${API_BASE}/api/cms/locations/`;
      const res = await fetch(endpoint, { next: { revalidate: 60 } });
      if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
              apiLocations = data
                  .filter((item: any) => item.is_active)
                  .map((item: any) => ({
                      title: item.title,
                      slug: item.slug,
                      img: item.image_url || '/images/locations/bavaro.jpg'
                  }));
          }
      }
  } catch (err) {
      console.error("FAILED to load locations from Backend in page.tsx:", err);
  }

  const heroProperties = properties.filter(p =>
    // Hero Allowed: City Place (2), Diana (3), Kerry (7), Ocean Village (9), Soto Grande (12), Miches (13)
    [2, 3, 7, 9, 12, 13].includes(p.id)
  ).map(p => {
    // If the image is a string from an external CDN (Unsplash or Sanity), 
    // we want to ensure it gets passed as mainImage so Hero.tsx uses the sanityLoader
    // which generates the responsive srcset.
    const isExternalCDN = typeof p.image === 'string' && (p.image.includes('cdn.sanity.io') || p.image.includes('images.unsplash.com'));

    return {
      id: p.id,
      mainImage: isExternalCDN ? p.image : null,
      backupImage: typeof p.image === 'string' && !isExternalCDN ? p.image : (p.gallery && p.gallery.length > 0 ? p.gallery[0] : '/images/luxury-villa-frame-hero.webp')
    };
  });

  // PERFORMANCE OPTIMIZATION: Inject a highly-optimized, local WebP image as the VERY FIRST image in the array.
  // This forces the Hero LCP (Largest Contentful Paint) to load instantly from Vercel's Edge Network, 
  // bypassing the DNS lookup, TCP handshake, and latency of external CDNs (Sanity/Unsplash).
  const featuredImages = [
    {
        id: 99999, // Fake ID
        mainImage: null,
        backupImage: '/images/luxury-villa-frame-hero.webp'
    },
    ...heroProperties
  ];

  // Perform server-side filtering to prevent sending the entire dataset to client components
  // Also strip heavy data arrays (like 50-image galleries) to drastically reduce Server-to-Client JSON payload (improves FCP & LCP)
  const stripPayload = (props: Property[]) => props.map(p => ({
    ...p,
    description: {
       es: p.description?.es?.substring(0, 200) || "",
       en: p.description?.en?.substring(0, 200) || "",
       fr: p.description?.fr?.substring(0, 200) || ""
    },
    gallery: p.gallery?.slice(0, 4) || [],
    rawGallery: p.rawGallery?.slice(0, 4) || [],
    features: { es: [], en: [], fr: [] },
    constructionStages: [],
    detailedSections: [],
    seo: null
  } as unknown as Property));

  const nonLandProperties = properties.filter(p => p.type !== "land");

  const saleProperties = stripPayload(nonLandProperties.filter(p => p.status === "sale").slice(0, 6));
  const rentProperties = stripPayload(nonLandProperties.filter(p => p.status === "rent").slice(0, 3));
  const featuredOnlyProperties = stripPayload(nonLandProperties.filter(p => p.featured === true).slice(0, 3));

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": lang === 'en' ? "Can a foreigner buy property in Punta Cana, Dominican Republic?" : "¿Puede un extranjero comprar propiedad en Punta Cana?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'en' 
            ? "Yes, foreigners can buy property in the Dominican Republic with the same rights as citizens. It is a very friendly environment for expats looking to retire in Punta Cana or invest."
            : "Sí, los extranjeros pueden comprar propiedades en República Dominicana con los mismos derechos que un ciudadano. Es un destino ideal para expatriados e inversores."
        }
      },
      {
        "@type": "Question",
        "name": lang === 'en' ? "What is the CONFOTUR Law for DR Real Estate?" : "¿Qué es la Ley de CONFOTUR en Bienes Raíces?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'en'
            ? "The CONFOTUR law offers a 15-year tax exemption for approved real estate projects, completely waiving the 3% property transfer tax and the annual 1% property tax (IPI)."
            : "La ley de CONFOTUR ofrece una exención de impuestos de hasta 15 años para proyectos turísticos aprobados, exonerando el 3% de transferencia y el 1% de IPI anual."
        }
      },
      {
        "@type": "Question",
        "name": lang === 'en' ? "Are beachfront villas in Punta Cana good for Airbnb investment?" : "¿Son las villas frente al mar buenas para inversión Airbnb?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": lang === 'en'
            ? "Absolutely. Oceanfront condos and beachfront villas yield some of the highest ROI in the Caribbean due to year-round high occupancy from vacation rentals."
            : "Totalmente. Los condominios frente al mar y las villas de lujo tienen algunos de los mayores retornos de inversión (ROI) del Caribe gracias a la altísima ocupación de rentas vacacionales todo el año."
        }
      }
    ]
  };

  return (
    <main className="min-h-screen">
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar dict={dict.nav} lang={lang} servicesList={dict.sections.services.items} propertyTypes={dict.properties.types} />
      <Hero dict={dict.hero} featuredImages={featuredImages} />
      <PropertyFilterBar dict={dict.properties} locations={dict.sections.locations.items} lang={lang} />

      <PropertyListings
        dict={dict.properties}
        lang={lang}
        locations={dict.sections.locations.items}
        featured={true}
        featuredCategory="sale"
        featuredLimit={6}
        sectionId="properties-sale"
        sectionTitle={lang === 'en' ? 'Properties for Sale' : lang === 'fr' ? 'Propriétés à Vendre' : 'Propiedades en Venta'}
        lockedStatus="sale"
        exploreLink={`/${lang}/properties?status=sale`}
        initialData={saleProperties}
      />
      <PropertyListings
        dict={dict.properties}
        lang={lang}
        locations={dict.sections.locations.items}
        featured={true}
        featuredCategory="rent"
        featuredLimit={3}
        sectionId="properties-rent"
        sectionTitle={lang === 'en' ? 'Properties for Rent' : lang === 'fr' ? 'Propriétés à Louer' : 'Propiedades en Renta'}
        lockedStatus="rent"
        exploreLink={`/${lang}/properties?status=rent`}
        initialData={rentProperties}
      />
      <LocationsSection dict={dict.sections.locations} limit={3} lang={lang} apiLocations={apiLocations} />
      <PropertyListings
        dict={dict.properties}
        lang={lang}
        locations={dict.sections.locations.items}
        featured={true}
        showFeaturedOnly={true}
        featuredCategory="sale"
        featuredLimit={3}
        sectionId="featured-properties"
        sectionTitle={lang === 'en' ? 'Featured Properties' : lang === 'fr' ? 'Propriétés en Vedette' : 'Propiedades Destacadas'}
        initialData={featuredOnlyProperties}
      />
      <FutureProjectsSection lang={lang} />
      <InvestmentsSection dict={dict.sections.investments} lang={lang} />
      <FlyAndBuySection dict={dict.sections.flyAndBuy} lang={lang} />
      <OffMarketClub lang={lang} />
      <BlogSection dict={dict.sections.blog} lang={lang} initialPosts={strippedPosts} />
      <ServicesSection dict={dict.sections.services} lang={lang} limit={4} />
      <TestimonialsSection dict={dict.sections.testimonials} />
      <AboutSection dict={dict.sections.about} />


      <ContactSection dict={dict.contact} />
      <Footer dict={dict} lang={lang} />
    </main>
  );
}
