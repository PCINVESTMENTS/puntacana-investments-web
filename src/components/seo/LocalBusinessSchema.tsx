export function LocalBusinessSchema({ lang }: { lang?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.puntacanainvestmentsrd.com/#website",
        "url": "https://www.puntacanainvestmentsrd.com/",
        "name": "Punta Cana Investments",
        "description": lang === 'en' 
          ? "Luxury Real Estate & Exclusive Properties in Punta Cana, Dominican Republic" 
          : lang === 'fr'
          ? "Immobilier de luxe et propriétés exclusives à Punta Cana, République Dominicaine"
          : "Inmobiliaria de Lujo y Propiedades Exclusivas en Punta Cana, República Dominicana",
        "inLanguage": lang === 'en' ? "en-US" : lang === 'fr' ? "fr-FR" : "es-DO"
      },
      {
        "@type": "RealEstateAgent",
        "@id": "https://www.puntacanainvestmentsrd.com/#organization",
        "name": "Punta Cana Investments",
        "url": "https://www.puntacanainvestmentsrd.com",
        "logo": "https://www.puntacanainvestmentsrd.com/images/og-home-luxury.webp",
        "image": "https://www.puntacanainvestmentsrd.com/images/og-home-luxury.webp",
        "description": lang === 'en' 
          ? "Premium Real Estate Agency offering luxury villas, condos for sale, and off-market investment properties in Punta Cana, Cap Cana, and Bavaro, Dominican Republic." 
          : lang === 'fr'
          ? "Agence immobilière de premier plan proposant des villas de luxe, des appartements à vendre et des investissements hors marché à Punta Cana, Cap Cana et Bavaro, République Dominicaine."
          : "Agencia de Bienes Raíces premium ofreciendo villas de lujo, apartamentos en venta, y propiedades de inversión off-market en Punta Cana, Cap Cana y Bávaro, República Dominicana.",
        "telephone": "+1-809-555-5555", // Consider updating with real telephone
        "email": "info@puntacanainvestmentsrd.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Punta Cana",
          "addressRegion": "La Altagracia",
          "addressCountry": "DO"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 18.5820,   // Punta Cana approx
          "longitude": -68.4054
        },
        "areaServed": [
          "Punta Cana",
          "Cap Cana",
          "Bávaro",
          "República Dominicana"
        ],
        "priceRange": "$$$"
      },
      {
        "@type": "GeneralContractor",
        "@id": "https://www.puntacanainvestmentsrd.com/#contractor",
        "name": "Punta Cana Investments - Constructora",
        "url": "https://www.puntacanainvestmentsrd.com/services",
        "logo": "https://www.puntacanainvestmentsrd.com/images/og-home-luxury.webp",
        "image": "https://www.puntacanainvestmentsrd.com/images/og-home-luxury.webp",
        "description": lang === 'en' 
          ? "Premier Construction and Development Company in Punta Cana. We build luxury villas, manage residential developments, and offer civil engineering and architectural services." 
          : lang === 'fr'
          ? "Entreprise de construction et de développement de premier plan à Punta Cana. Nous construisons des villas de luxe, gérons des projets résidentiels et offrons des services d'architecture et de génie civil."
          : "Constructora y desarrolladora líder en Punta Cana. Especialistas en construcción de villas de lujo, desarrollo de proyectos, arquitectura e ingeniería civil.",
        "telephone": "+1-829-408-4322",
        "email": "info@puntacanainvestmentsrd.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Punta Cana",
          "addressRegion": "La Altagracia",
          "addressCountry": "DO"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 18.5820,
          "longitude": -68.4054
        },
        "areaServed": [
          "Punta Cana",
          "Cap Cana",
          "Bávaro",
          "República Dominicana"
        ],
        "priceRange": "$$$"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
