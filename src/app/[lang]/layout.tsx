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

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const hubspotId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

  return (
    <html lang={lang} className="scroll-smooth">
      <head>
        {/* Google Tag Manager - Head */}
        {gtmId && (
          <Script id="google-tag-manager" strategy="lazyOnload">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}
        
        {/* Meta Pixel Code - Head */}
        {metaPixelId && (
          <Script id="meta-pixel" strategy="lazyOnload">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-primary-black text-white`}
      >
        {/* Google Tag Manager - Body (noscript) */}
        {gtmId && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
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
          <PropertyComparator lang={lang} />
          {/* ChatBot temporarily removed */}
        </CompareProvider>
        <Analytics />
        {gaId && (
          <>
            <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <Script strategy="lazyOnload" id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* HubSpot Tracking Code */}
        {hubspotId && (
          <Script
            id="hs-script-loader"
            strategy="lazyOnload"
            src={`//js.hs-scripts.com/${hubspotId}.js`}
          />
        )}
      </body>
    </html>
  );
}
