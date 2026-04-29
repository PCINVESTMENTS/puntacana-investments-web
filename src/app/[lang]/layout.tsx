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

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' }> }): Promise<Metadata> {
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
      ? ["Punta Cana Real Estate", "Luxury Villas Punta Cana", "Property Investment Dominican Republic", "Cap Cana Properties", "Off-market real estate", "Condos for sale Dominican Republic", "Bavaro Real Estate", "Retire in Punta Cana", "Expat living Dominican Republic", "Tax-free real estate Punta Cana", "Beachfront villas for sale", "Pre-construction condos Punta Cana"] 
      : ["Bienes Raíces Punta Cana", "Villas de Lujo Punta Cana", "Inversión Inmobiliaria República Dominicana", "Propiedades Cap Cana", "Bienes Raíces Off-market", "Apartamentos en venta Punta Cana", "Bávaro Inmobiliaria", "Jubilarse en Punta Cana", "Comunidades de expatriados", "Bienes raíces libres de impuestos CONFOTUR", "Villas frente al mar en venta", "Proyectos en planos Punta Cana"],
    metadataBase: new URL(baseUrl),
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
      locale: lang === 'es' ? 'es_DO' : 'en_US',
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
  return [{ lang: 'es' }, { lang: 'en' }]
}

import { CompareProvider } from "@/components/property/CompareContext";
import dynamic from "next/dynamic";

const PropertyComparator = dynamic(() => import("@/components/property/PropertyComparator"));

import Script from "next/script";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import DelayedTracking from "@/components/seo/DelayedTracking";
import { GoogleTagManager } from '@next/third-parties/google';

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
        {/* Scripts are now loaded dynamically via DelayedTracking to prevent TBT */}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-primary-black text-white`}
      >
        <GoogleTagManager gtmId={gtmId} />

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
          <PropertyComparator lang={lang} />
          {/* ChatBot temporarily removed */}
        </CompareProvider>
        <Analytics />

        {/* Dynamic tracking scripts deferred until interaction for PageSpeed */}
        <DelayedTracking gaId={gaId} metaPixelId={metaPixelId} hubspotId={hubspotId} />
      </body>
    </html>
  );
}
