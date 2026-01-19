import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PropertyListings from "@/components/home/PropertyListings";
import { getDictionary } from "@/dictionaries/get-dictionary";
import PropertyFilterBar from "@/components/home/PropertyFilterBar";

// Lazy loading below-the-fold sections
import dynamic from 'next/dynamic';

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
import { PROPERTIES_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty, mapSanityPost } from "@/sanity/lib/mappers";
import { Property, properties as localProperties } from "@/data/properties";
import { BlogPost } from "@/data/blog";

import type { Metadata } from "next";

// Restoring ISR
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' }> }): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puntacanainvesment.com';

  const title = lang === 'en'
    ? "Punta Cana Investments | Luxury Real Estate & Exclusive Properties"
    : "Punta Cana Investments | Inmobiliaria de Lujo y Propiedades Exclusivas";

  const description = lang === 'en'
    ? "Discover exclusive luxury villas, condos, and investment opportunities in Punta Cana. Access off-market listings and our signature Fly & Buy program."
    : "Descubre villas de lujo exclusivas, condominios y oportunidades de inversión en Punta Cana. Accede a listados off-market y nuestro programa Fly & Buy.";

  return {
    title,
    description,
    keywords: lang === 'en'
      ? ['Punta Cana Real Estate', 'Luxury Villas', 'Investment Dominican Republic', 'Fly and Buy', 'Condos for Sale']
      : ['Bienes Raíces Punta Cana', 'Villas de Lujo', 'Inversión República Dominicana', 'Fly and Buy', 'Apartamentos en Venta'],
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${lang}`,
      siteName: 'Punta Cana Investments',
      images: [
        {
          url: '/images/og-home-luxury.jpg',
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
      images: ['/images/og-home-luxury.jpg'],
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

  // Fetch data from Sanity (no-store for fresh data during verification)
  const rawProperties = await client.fetch(PROPERTIES_QUERY);
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
  );

  const heroImages = heroProperties.map(p => p.image);

  return (
    <main className="min-h-screen">
      <Navbar dict={dict.nav} lang={lang} servicesList={dict.sections.services.items} propertyTypes={dict.properties.types} />
      <Hero dict={dict.hero} featuredImages={heroImages} />
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
        initialData={properties}
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
        initialData={properties}
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
        initialData={properties}
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
