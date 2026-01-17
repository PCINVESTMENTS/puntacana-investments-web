import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PropertyListings from "@/components/home/PropertyListings";
import ServicesSection from "@/components/home/ServicesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogSection from "@/components/home/BlogSection";
import { AboutSection, LocationsSection, ContactSection, Footer } from "@/components/home/PageSections";
import InvestmentsSection from "@/components/home/InvestmentsSection";
import OffMarketClub from "@/components/home/OffMarketClub";
import { getDictionary } from "@/dictionaries/get-dictionary";
import PropertyFilterBar from "@/components/home/PropertyFilterBar";

// Sanity
import { client } from "@/sanity/lib/client";
import { PROPERTIES_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";
import { mapSanityProperty, mapSanityPost } from "@/sanity/lib/mappers";
import { Property, properties as localProperties } from "@/data/properties";
import { BlogPost } from "@/data/blog";

export const revalidate = 60;

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
    // Hero Allowed: Perla (8), Diana (3), Kerry (7), Ocean (9), Cap Cana Properties
    // Exclude Commercial and Unauthorized.
    [3, 7, 8, 9].includes(p.id) ||
    (p.location === 'capcana' && p.type !== 'commercial' && p.id !== 17)
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
