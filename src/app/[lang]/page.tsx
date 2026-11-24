import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import { getDictionary } from "@/dictionaries/get-dictionary";
import PropertyFilterBar from "@/components/home/PropertyFilterBar";

// Lazy loading below-the-fold sections
import nextDynamic from 'next/dynamic';

const PropertyListings = nextDynamic(() => import("@/components/home/PropertyListings"), { ssr: true });

const ServicesSection = nextDynamic(() => import("@/components/home/ServicesSection"));
const TestimonialsSection = nextDynamic(() => import("@/components/home/TestimonialsSection"));
const BlogSection = nextDynamic(() => import("@/components/home/BlogSection"));
const InvestmentsSection = nextDynamic(() => import("@/components/home/InvestmentsSection"));
const OffMarketClub = nextDynamic(() => import("@/components/home/OffMarketClub"));
const FlyAndBuySection = nextDynamic(() => import("@/components/home/FlyAndBuySection"));
const FutureProjectsSection = nextDynamic(() => import("@/components/home/FutureProjectsSection"));
const LocationsSection = nextDynamic(() => import("@/components/home/LocationsSection").then(mod => mod.LocationsSection));
const AboutSection = nextDynamic(() => import("@/components/home/AboutSection").then(mod => mod.AboutSection));
const ContactSection = nextDynamic(() => import("@/components/home/ContactSection").then(mod => mod.ContactSection));
const Footer = nextDynamic(() => import("@/components/layout/Footer").then(mod => mod.Footer));

// Sanity
import { client } from "@/sanity/lib/client";
import { HOME_PAGE_PROPERTIES_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty, mapSanityPost } from "@/sanity/lib/mappers";
import { Property, properties as localProperties } from "@/data/properties";
import { BlogPost } from "@/data/blog";
import {
  fetchLocalSandboxCatalog,
  fetchLocalSandboxWebManager,
  mapSandboxBlogPosts,
  mapWebManagerLocations,
} from "@/lib/localSandbox";

import type { Metadata } from "next";

// Instant real-time reflection in local sandbox mode
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';

  const title = lang === 'en'
    ? "Punta Cana Investments | Punta Cana Real Estate & Luxury Investments"
    : lang === 'fr'
    ? "Punta Cana Investments | Immobilier de Luxe et Investissement à Punta Cana"
    : "Punta Cana Investments | Inversiones Inmobiliarias Punta Cana y Bienes Raíces";

  const description = lang === 'en'
    ? "Discover exclusive luxury villas, condos for sale, and high ROI real estate investment opportunities in Punta Cana, Bavaro, and Cap Cana, Dominican Republic."
    : lang === 'fr'
    ? "Découvrez des villas de luxe exclusives, des appartements à vendre et des opportunités d'investissement immobilier à fort retour sur investissement à Punta Cana, Bavaro et Cap Cana."
    : "Descubre exclusivas villas de lujo, apartamentos en venta, y oportunidades de inversión en bienes raíces con alto ROI en Punta Cana, Bávaro, y Cap Cana, República Dominicana.";

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

  const sandboxData = await fetchLocalSandboxCatalog();

  let properties: Property[];
  let strippedPosts: BlogPost[];
  let apiLocations: any[] = [];
  let explicitHomeSale: Property[] | null = null;
  let explicitHomeRent: Property[] | null = null;
  let explicitHomeFeatured: Property[] | null = null;

  if (sandboxData) {
    properties = ([...sandboxData.properties] as unknown as Property[]).sort((a, b) => b.id - a.id);
    // Preserve exact baseline homepage sections independently of new properties (#40+)
    const bySalePos = sandboxData.properties
      .filter((p) => p.home_positions?.sale_position != null)
      .sort((a, b) => (a.home_positions!.sale_position!) - (b.home_positions!.sale_position!));
    const byRentPos = sandboxData.properties
      .filter((p) => p.home_positions?.rent_position != null)
      .sort((a, b) => (a.home_positions!.rent_position!) - (b.home_positions!.rent_position!));
    const byFeatPos = sandboxData.properties
      .filter((p) => p.home_positions?.featured_position != null)
      .sort((a, b) => (a.home_positions!.featured_position!) - (b.home_positions!.featured_position!));
    if (bySalePos.length > 0) explicitHomeSale = bySalePos as unknown as Property[];
    if (byRentPos.length > 0) explicitHomeRent = byRentPos as unknown as Property[];
    if (byFeatPos.length > 0) explicitHomeFeatured = byFeatPos as unknown as Property[];
    strippedPosts = mapSandboxBlogPosts(sandboxData.blog_posts || []).slice(0, 3);
  } else {
    // Fetch data from Sanity
    const rawProperties = await client.fetch(HOME_PAGE_PROPERTIES_QUERY);
    const fetchedProperties: Property[] = rawProperties
      .map(mapSanityProperty)
      .filter((p: any): p is Property => p && typeof p.id === 'number' && !isNaN(p.id));

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

    properties = [...mergedProperties, ...localOnlyProperties].sort((a, b) => {
      return b.id - a.id;
    });

    const rawPosts = await client.fetch(POSTS_QUERY);
    const posts: BlogPost[] = rawPosts.map(mapSanityPost);

    // Strip massive blog post content payload for the home page to drastically reduce HTML size (improves LCP)
    strippedPosts = posts.slice(0, 3).map(post => ({
      ...post,
      content: { es: "", en: "", fr: "" },
      rawContent: null
    } as unknown as BlogPost));

    // Fetch locations from Railway API securely on the server-side
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

  // Fase 5 Local Web Manager overrides (instant 0ms reflection in sandbox mode; defaults match production 100%)
  const webManager = fetchLocalSandboxWebManager();
  const wmHero = webManager?.homepage?.hero;
  const wmLocSec = webManager?.homepage?.locations_section;
  const secVis = webManager?.homepage?.sections_visibility || {};

  const effectiveHeroDict = wmHero
    ? {
        ...dict.hero,
        title: wmHero.title?.[lang] || dict.hero.title,
        subtitle: wmHero.subtitle?.[lang] || dict.hero.subtitle,
        cta: wmHero.cta?.[lang] || dict.hero.cta,
        scroll: wmHero.scroll?.[lang] || dict.hero.scroll,
      }
    : dict.hero;

  const effectiveLocationsDict = wmLocSec
    ? {
        ...dict.sections.locations,
        title: wmLocSec.title?.[lang] || dict.sections.locations.title,
        subtitle: wmLocSec.subtitle?.[lang] || dict.sections.locations.subtitle,
        exploreMore: wmLocSec.exploreMore?.[lang] || dict.sections.locations.exploreMore,
      }
    : dict.sections.locations;

  const dynamicHomeLocations = webManager
    ? mapWebManagerLocations(webManager.locations, lang, "show_in_homepage")
    : apiLocations;
  const dynamicFilterLocations = webManager
    ? mapWebManagerLocations(webManager.locations, lang, "show_in_property_filters")
    : dict.sections.locations.items;
  const locationsHomepageLimit =
    wmLocSec && typeof wmLocSec.homepage_limit === "number"
      ? wmLocSec.homepage_limit
      : 3;

  const primaryHeroImage = wmHero?.hero_image
    ? (wmHero.hero_image.startsWith("/media/") ? `http://127.0.0.1:8110${wmHero.hero_image}` : wmHero.hero_image)
    : '/images/luxury-villa-frame-hero.webp';

  const propBySlug = new Map<string, Property>();
  for (const p of properties) {
    const s = typeof p.slug === "object" && p.slug !== null ? (p.slug as any).current : p.slug;
    if (s) propBySlug.set(s, p);
  }
  const resolvePlacementList = (slugs?: string[]): Property[] | null => {
    if (!Array.isArray(slugs) || slugs.length === 0) return null;
    const resolved = slugs.map((s) => propBySlug.get(s)).filter((p): p is Property => Boolean(p));
    return resolved.length > 0 ? resolved : null;
  };
  const getLocalizedSlideTitle = (p: Property) =>
    lang === "en" ? p.titleEn || p.title : lang === "fr" ? p.titleFr || p.title : p.titleEs || p.title;

  const wmPlacements = webManager?.placements;
  const customHeroProps = resolvePlacementList(wmPlacements?.hero_slider);
  const toHeroSlide = (p: Property) => {
    const isExternalCDN = typeof p.image === "string" && (p.image.includes("cdn.sanity.io") || p.image.includes("images.unsplash.com"));
    const slugStr = typeof p.slug === "object" && p.slug !== null ? (p.slug as any).current : p.slug;
    return {
      id: p.id,
      mainImage: isExternalCDN ? p.image : null,
      backupImage: typeof p.image === "string" && !isExternalCDN ? p.image : (p.gallery && p.gallery.length > 0 ? p.gallery[0] : "/images/luxury-villa-frame-hero.webp"),
      slug: slugStr,
      internalCode: (p as any).internal_code || "",
      title: getLocalizedSlideTitle(p),
      lang,
    };
  };

  const heroSliderCustom = Boolean(wmHero?.hero_slider_custom && customHeroProps && customHeroProps.length > 0);
  const curatedHeroSlides = customHeroProps ? customHeroProps.map(toHeroSlide) : heroProperties;
  const featuredImages = heroSliderCustom
    ? curatedHeroSlides
    : [
        {
          id: 99999,
          mainImage: null,
          backupImage: primaryHeroImage,
        },
        ...curatedHeroSlides,
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

  const wmSale = resolvePlacementList(wmPlacements?.sale);
  const wmRent = resolvePlacementList(wmPlacements?.rent);
  const wmFeatured = resolvePlacementList(wmPlacements?.featured);
  const wmSuggested = resolvePlacementList(wmPlacements?.suggested);

  const saleProperties = stripPayload(wmSale || explicitHomeSale || nonLandProperties.filter(p => p.status === "sale").slice(0, 6));
  const rentProperties = stripPayload(wmRent || explicitHomeRent || nonLandProperties.filter(p => p.status === "rent").slice(0, 3));
  const featuredOnlyProperties = stripPayload(wmFeatured || explicitHomeFeatured || nonLandProperties.filter(p => p.featured === true).slice(0, 3));
  const suggestedProperties = stripPayload(wmSuggested || []);

  const defaultSectionsOrder = [
    "hero_filter_bar",
    "sale_properties",
    "rent_properties",
    "locations",
    "featured_properties",
    "suggested_properties",
    "future_projects",
    "investments",
    "fly_and_buy",
    "off_market",
    "blog",
    "services",
    "testimonials",
    "about",
    "contact",
  ];
  const sectionsOrder =
    Array.isArray(webManager?.homepage?.sections_order) && webManager!.homepage.sections_order!.length > 0
      ? webManager!.homepage.sections_order!
      : defaultSectionsOrder;

  const renderHomeSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "hero_filter_bar":
        return secVis.show_hero_filter_bar !== false ? (
          <div key="hero_filter_bar" data-home-section="hero_filter_bar">
            <PropertyFilterBar dict={dict.properties} locations={dynamicFilterLocations} lang={lang} />
          </div>
        ) : null;
      case "sale_properties":
        return secVis.show_sale_properties !== false ? (
          <div key="sale_properties" data-home-section="sale_properties">
            <PropertyListings
              dict={dict.properties}
              lang={lang}
              locations={dynamicFilterLocations}
              featured={true}
              preserveInitialOrder={Boolean(wmSale)}
              featuredCategory="sale"
              featuredLimit={Math.max(6, saleProperties.length)}
              sectionId="properties-sale"
              sectionTitle={lang === 'en' ? 'Properties for Sale' : lang === 'fr' ? 'Propriétés à Vendre' : 'Propiedades en Venta'}
              lockedStatus="sale"
              exploreLink={`/${lang}/properties?status=sale`}
              initialData={saleProperties}
            />
          </div>
        ) : null;
      case "rent_properties":
        return secVis.show_rent_properties !== false ? (
          <div key="rent_properties" data-home-section="rent_properties">
            <PropertyListings
              dict={dict.properties}
              lang={lang}
              locations={dynamicFilterLocations}
              featured={true}
              preserveInitialOrder={Boolean(wmRent)}
              featuredCategory="rent"
              featuredLimit={Math.max(3, rentProperties.length)}
              sectionId="properties-rent"
              sectionTitle={lang === 'en' ? 'Properties for Rent' : lang === 'fr' ? 'Propriétés à Louer' : 'Propiedades en Renta'}
              lockedStatus="rent"
              exploreLink={`/${lang}/properties?status=rent`}
              initialData={rentProperties}
            />
          </div>
        ) : null;
      case "locations":
        return secVis.show_locations !== false ? (
          <div key="locations" data-home-section="locations">
            <LocationsSection
              dict={effectiveLocationsDict}
              limit={locationsHomepageLimit > 0 ? locationsHomepageLimit : undefined}
              lang={lang}
              apiLocations={dynamicHomeLocations}
            />
          </div>
        ) : null;
      case "featured_properties":
        return secVis.show_featured_properties !== false ? (
          <div key="featured_properties" data-home-section="featured_properties">
            <PropertyListings
              dict={dict.properties}
              lang={lang}
              locations={dynamicFilterLocations}
              featured={true}
              showFeaturedOnly={!wmFeatured}
              preserveInitialOrder={Boolean(wmFeatured)}
              featuredCategory="sale"
              featuredLimit={Math.max(3, featuredOnlyProperties.length)}
              sectionId="featured-properties"
              sectionTitle={lang === 'en' ? 'Featured Properties' : lang === 'fr' ? 'Propriétés en Vedette' : 'Propiedades Destacadas'}
              initialData={featuredOnlyProperties}
            />
          </div>
        ) : null;
      case "suggested_properties":
        return secVis.show_suggested_properties === true && suggestedProperties.length > 0 ? (
          <div key="suggested_properties" data-home-section="suggested_properties">
            <PropertyListings
              dict={dict.properties}
              lang={lang}
              locations={dynamicFilterLocations}
              featured={true}
              preserveInitialOrder={true}
              featuredCategory="sale"
              featuredLimit={Math.max(3, suggestedProperties.length)}
              sectionId="suggested-properties"
              sectionTitle={lang === 'en' ? 'Suggested Properties' : lang === 'fr' ? 'Propriétés Suggérées' : 'Propiedades Sugeridas'}
              initialData={suggestedProperties}
            />
          </div>
        ) : null;
      case "future_projects":
        return secVis.show_future_projects !== false ? (
          <div key="future_projects" data-home-section="future_projects">
            <FutureProjectsSection lang={lang} />
          </div>
        ) : null;
      case "investments":
        return secVis.show_investments !== false ? (
          <div key="investments" data-home-section="investments">
            <InvestmentsSection dict={dict.sections.investments} lang={lang} />
          </div>
        ) : null;
      case "fly_and_buy":
        return secVis.show_fly_and_buy !== false ? (
          <div key="fly_and_buy" data-home-section="fly_and_buy">
            <FlyAndBuySection dict={dict.sections.flyAndBuy} lang={lang} />
          </div>
        ) : null;
      case "off_market":
        return secVis.show_off_market !== false ? (
          <div key="off_market" data-home-section="off_market">
            <OffMarketClub lang={lang} />
          </div>
        ) : null;
      case "blog":
        return secVis.show_blog !== false ? (
          <div key="blog" data-home-section="blog">
            <BlogSection dict={dict.sections.blog} lang={lang} initialPosts={strippedPosts} />
          </div>
        ) : null;
      case "services":
        return secVis.show_services !== false ? (
          <div key="services" data-home-section="services">
            <ServicesSection dict={dict.sections.services} lang={lang} limit={4} />
          </div>
        ) : null;
      case "testimonials":
        return secVis.show_testimonials !== false ? (
          <div key="testimonials" data-home-section="testimonials">
            <TestimonialsSection dict={dict.sections.testimonials} />
          </div>
        ) : null;
      case "about":
        return secVis.show_about !== false ? (
          <div key="about" data-home-section="about">
            <AboutSection dict={dict.sections.about} />
          </div>
        ) : null;
      case "contact":
        return secVis.show_contact !== false ? (
          <div key="contact" data-home-section="contact">
            <ContactSection dict={dict.contact} />
          </div>
        ) : null;
      default:
        return null;
    }
  };

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
      <Hero dict={effectiveHeroDict} featuredImages={featuredImages} showSlideBadge={heroSliderCustom} />
      {sectionsOrder.map((secKey) => renderHomeSection(secKey))}
      <Footer dict={dict} lang={lang} />
    </main>
  );
}
