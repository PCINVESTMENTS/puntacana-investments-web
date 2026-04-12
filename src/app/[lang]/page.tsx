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

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';

  const title = lang === 'en'
    ? "Punta Cana Investments | Luxury Real Estate & Exclusive Properties"
    : "Punta Cana Investments | Inmobiliaria de Lujo y Bienes Raíces";

  const description = lang === 'en'
    ? "Discover exclusive luxury villas, condos for sale, and real estate investment opportunities in Punta Cana, Bavaro, and Cap Cana, Dominican Republic."
    : "Descubre exclusivas villas de lujo, apartamentos en venta, y oportunidades de inversión en bienes raíces en Punta Cana, Bávaro, y Cap Cana, República Dominicana.";

  return {
    title,
    description,
    keywords: lang === 'en'
      ? ['Punta Cana Investments', 'Punta Cana Real Estate', 'Luxury Villas for sale Dominican Republic', 'Condos for sale Punta Cana', 'Cap Cana Real Estate', 'Invest in Bavaro properties', 'Dominican Republic real estate', 'Fly and Buy', 'Punta Cana homes for sale', 'Dominican Republic investment properties', 'Construction Punta Cana', 'Real Estate Developer Dominican Republic', 'Building contractors Punta Cana', 'Custom luxury villas construction']
      : ['Punta Cana Investments', 'Real Estate Punta Cana', 'Apartamentos en venta Punta Cana', 'Villas de lujo Republica Dominicana', 'Bienes raices Cap Cana', 'Invertir en Bavaro', 'Casas en venta Punta Cana', 'Proyectos inmobiliarios Punta Cana', 'Fly and Buy RD', 'Inmobiliaria Punta Cana', 'Constructora en Punta Cana', 'Construcción de villas', 'Desarrolladores de proyectos inmobiliarios RD', 'Ingeniería civil y arquitectura Punta Cana'],
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}`,
      siteName: 'Punta Cana Investments',
      images: [
        {
          url: `${baseUrl}/images/og-home-luxury.jpg`,
          width: 1200,
          height: 630,
          alt: 'Luxury Real Estate in Punta Cana - Night View',
        },
      ],
      locale: lang === 'en' ? 'en_US' : 'es_DO',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/images/og-home-luxury.jpg`],
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

export default async function Home({ params }: { params: Promise<{ lang: 'es' | 'en' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // Fetch data from Sanity
  const rawProperties = await client.fetch(HOME_PAGE_PROPERTIES_QUERY);
  const fetchedProperties: Property[] = rawProperties.map(mapSanityProperty);

  // Merge with local overrides and include local-only properties
  const mergedProperties = fetchedProperties.map(p => {
    const local = localProperties.find(lp => lp.id === p.id);
    return local || p;
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

  const heroProperties = properties.filter(p =>
    // Hero Allowed: City Place (2), Diana (3), Kerry (7), Perla (8), Ocean Village (9), Soto Grande (12), Miches (13)
    [2, 3, 7, 8, 9, 12, 13].includes(p.id)
  ).map(p => ({
    id: p.id,
    mainImage: p.mainImage,
    backupImage: p.image // Still keep the string URL as backup
  }));

  // Perform server-side filtering to prevent sending the entire dataset to client components
  // Also strip heavy data arrays (like 50-image galleries) to drastically reduce Server-to-Client JSON payload (improves FCP & LCP)
  const stripPayload = (props: Property[]) => props.map(p => ({
    ...p,
    description: {
       es: p.description?.es?.substring(0, 200) || "",
       en: p.description?.en?.substring(0, 200) || ""
    },
    gallery: p.gallery?.slice(0, 4) || [],
    rawGallery: p.rawGallery?.slice(0, 4) || [],
    features: { es: [], en: [] },
    constructionStages: [],
    seo: null
  } as unknown as Property));

  const saleProperties = stripPayload(properties.filter(p => p.status === "sale").slice(0, 6));
  const rentProperties = stripPayload(properties.filter(p => p.status === "rent").slice(0, 3));
  const featuredOnlyProperties = stripPayload(properties.filter(p => p.featured === true).slice(0, 3));

  return (
    <main className="min-h-screen">
      <Navbar dict={dict.nav} lang={lang} servicesList={dict.sections.services.items} propertyTypes={dict.properties.types} />
      <Hero dict={dict.hero} featuredImages={heroProperties} />
      <PropertyFilterBar dict={dict.properties} locations={dict.sections.locations.items} lang={lang} />

      <PropertyListings
        dict={dict.properties}
        lang={lang}
        locations={dict.sections.locations.items}
        featured={true}
        featuredCategory="sale"
        featuredLimit={6}
        sectionId="properties-sale"
        sectionTitle={lang === 'en' ? 'Properties for Sale' : 'Propiedades en Venta'}
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
        sectionTitle={lang === 'en' ? 'Properties for Rent' : 'Propiedades en Renta'}
        lockedStatus="rent"
        exploreLink={`/${lang}/properties?status=rent`}
        initialData={rentProperties}
      />
      <LocationsSection dict={dict.sections.locations} limit={3} lang={lang} />
      <PropertyListings
        dict={dict.properties}
        lang={lang}
        locations={dict.sections.locations.items}
        featured={true}
        showFeaturedOnly={true}
        featuredCategory="sale"
        featuredLimit={3}
        sectionId="featured-properties"
        sectionTitle={lang === 'en' ? 'Featured Properties' : 'Propiedades Destacadas'}
        initialData={featuredOnlyProperties}
      />
      <InvestmentsSection dict={dict.sections.investments} lang={lang} />
      <FlyAndBuySection dict={dict.sections.flyAndBuy} lang={lang} />
      <OffMarketClub lang={lang} />
      <BlogSection dict={dict.sections.blog} lang={lang} initialPosts={posts} />
      <ServicesSection dict={dict.sections.services} lang={lang} limit={4} />
      <TestimonialsSection dict={dict.sections.testimonials} />
      <AboutSection dict={dict.sections.about} />


      <ContactSection dict={dict.contact} />
      <Footer dict={dict} lang={lang} />
    </main>
  );
}
