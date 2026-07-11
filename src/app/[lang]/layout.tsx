import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { getDictionary } from "@/dictionaries/get-dictionary";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' | 'fr' }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  /* 
     NOTE: We keep metadataBase here for absolute URL resolution in child pages.
     We do NOT set specific canonicals here to avoid them being inherited by pages 
     that should have their own. Each page should define its own alternates.
  */
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';

  return {
    title: {
      template: `%s | Punta Cana Investments`,
      default: dict.meta.title,
    },
    description: dict.meta.description,
    keywords: lang === 'en' 
      ? ["Punta Cana real estate", "Punta Cana investments", "Properties for sale Punta Cana", "High ROI properties Punta Cana", "Pre-construction condos Punta Cana", "Punta Cana property management", "Punta Cana luxury real estate brokers", "best real estate agents in Dominican Republic", "Punta Cana Investments real estate", "exclusive real estate agencies Caribbean", "buying property in Dominican Republic as a US citizen", "English speaking real estate agent Punta Cana", "Dominican Republic real estate experts", "relocate to Punta Cana Dominican Republic", "retiring in the Caribbean pros and cons", "Dominican Republic residency by investment", "best gated communities in Punta Cana for expats", "cost of luxury living in Punta Cana", "moving to Punta Cana from USA", "Caribbean tax friendly real estate", "Caribbean homes with private pools and golf views", "modern tropical architecture homes for sale", "luxury mansions with guest houses Caribbean", "Puntacana Resort homes with indoor outdoor living", "sprawling estates for sale in the Dominican Republic", "resort style living real estate Caribbean", "cash flow properties Punta Cana", "Caribbean real estate capital gains", "property flipping opportunities Dominican Republic", "turnkey rental properties Caribbean", "Punta Cana real estate market trends 2026", "high net worth real estate investments Caribbean", "real estate", "Punta Cana Real Estate", "Punta Cana Investments", "Real Estate en Punta Cana", "Luxury Villas Punta Cana", "Property Investment Dominican Republic", "Cap Cana Properties", "Off-market real estate", "Condos for sale Dominican Republic", "Bavaro Real Estate", "Retire in Punta Cana", "Expat living Dominican Republic", "Tax-free real estate Punta Cana", "Beachfront villas for sale", "Pre-construction condos Punta Cana"]
      : lang === 'fr'
      ? ["Investir à Punta Cana", "Acheter une villa à Punta Cana", "Projets immobiliers Cap Cana", "Immobilier Punta Cana", "agence immobilière francophone Punta Cana", "courtier immobilier de luxe République Dominicaine", "experts en investissement Caraïbes", "acheter une propriété en RD avec un agent francophone", "meilleure agence immobilière Punta Cana", "acheter une résidence secondaire au soleil", "passer l'hiver en République Dominicaine immobilier", "maisons d'exception sous les tropiques", "villa avec piscine privée et vue golf Caraïbes", "vivre à l'année à Punta Cana", "paradis tropical immobilier à vendre", "rentabilité locative Punta Cana", "avantages fiscaux immobilier République Dominicaine", "investir dans l'immobilier locatif aux Caraïbes", "acheter pour louer Punta Cana", "plus-value immobilière République Dominicaine", "investissement sécurisé Caraïbes", "real estate", "Punta Cana Real Estate", "Punta Cana Investments", "Real Estate en Punta Cana", "Immobilier Punta Cana", "Villas de luxe Punta Cana", "Investissement immobilier République Dominicaine", "Propriétés Cap Cana", "Immobilier hors marché", "Appartements à vendre République Dominicaine", "Immobilier Bavaro", "Retraite à Punta Cana", "Vie expatriée République Dominicaine", "Loi CONFOTUR immobilier Punta Cana", "Villas front de mer à vendre", "Appartements sur plan Punta Cana"]
      : ["Inversiones inmobiliarias Punta Cana", "Bienes raíces Punta Cana", "Casas en Punta Cana", "Proyectos en plano Punta Cana", "Punta Cana property management", "Administración de propiedades Punta Cana", "mansiones exclusivas en venta República Dominicana", "casas de alto perfil en el Caribe", "bienes raíces para millonarios Punta Cana", "propiedades de prestigio Puntacana Resort", "casas de diseño arquitectónico Punta Cana", "residencias de lujo con seguridad privada 24/7", "mejores zonas para invertir en bienes raíces Punta Cana", "plusvalía inmobiliaria República Dominicana", "oportunidades de inversión en bienes raíces Caribe", "casas rentables para alquiler a largo plazo Punta Cana", "asesores de inversión inmobiliaria Punta Cana", "comprar propiedades para remodelar y vender Punta Cana", "mercado inmobiliario de lujo Punta Cana 2026", "vivir en Puntacana Resort & Club", "comunidades cerradas exclusivas Punta Cana", "casas con patio interior y piscina Punta Cana", "villas con amenidades de resort República Dominicana", "casas de verano exclusivas en el Caribe", "real estate", "Punta Cana Real Estate", "Punta Cana Investments", "Real Estate en Punta Cana", "Bienes Raíces Punta Cana", "Villas de Lujo Punta Cana", "Inversión Inmobiliaria República Dominicana", "Propiedades Cap Cana", "Bienes Raíces Off-market", "Apartamentos en venta Punta Cana", "Bávaro Inmobiliaria", "Jubilarse en Punta Cana", "Comunidades de expatriados", "Bienes raíces libres de impuestos CONFOTUR", "Villas frente al mar en venta", "Proyectos en planos Punta Cana"],
    metadataBase: new URL(baseUrl),
    verification: {
      google: 'KHgQqFznNs3are8uaBvKLSxkYcqx5cdaGj6Qcbyr-wg',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      images: [
        {
          url: `${baseUrl}/images/og-home-luxury.webp`,
          width: 1200,
          height: 630,
          alt: 'Punta Cana Investments Luxury Real Estate',
        }
      ],
      title: dict.meta.title,
      description: dict.meta.description,
      type: 'website',
      locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_DO' : 'en_US',
      siteName: 'Punta Cana Investments',
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: [`${baseUrl}/images/og-home-luxury.webp`],
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }, { lang: 'fr' }]
}

import { CompareProvider } from "@/components/property/CompareContext";
import PropertyComparatorWrapper from "@/components/property/PropertyComparatorWrapper";

import Script from "next/script";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import DelayedTracking from "@/components/seo/DelayedTracking";


export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-5TMHHFXV";
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const hubspotId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

  return (
    <html lang={lang} className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://puntacana-fortress-production.up.railway.app" crossOrigin="anonymous" />
        {/* Scripts are now loaded dynamically via DelayedTracking to prevent TBT */}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-primary-black text-white`}
      >
                {/* Google Tag Manager (noscript) */}
        {gtmId && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
          </noscript>
        )}

        {/* Meta Pixel - Body (noscript) */}
        {metaPixelId && (
          <noscript>
            <img height="1" width="1" style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}

        <CompareProvider>
          <LocalBusinessSchema lang={lang} />
          {children}
          <PropertyComparatorWrapper lang={lang} />
          {/* ChatBot temporarily removed */}
        </CompareProvider>
        <Analytics />

        {/* Dynamic tracking scripts deferred until interaction for PageSpeed */}
        <DelayedTracking gaId={gaId} metaPixelId={metaPixelId} hubspotId={hubspotId} gtmId={gtmId} />
      </body>
    </html>
  );
}
