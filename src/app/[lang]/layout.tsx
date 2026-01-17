import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { getDictionary } from "@/dictionaries/get-dictionary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: 'es' | 'en' }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  /* 
     NOTE: We keep metadataBase here for absolute URL resolution in child pages.
     We do NOT set specific canonicals here to avoid them being inherited by pages 
     that should have their own. Each page should define its own alternates.
  */
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puntacanainvesment.com';

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      images: ['/images/home-share.png'],
      title: dict.meta.title,
      description: dict.meta.description,
      type: 'website',
      locale: lang,
    },
  };
}

// Removed generateStaticParams to avoid Turbopack build panic (Conflict with dynamic children)

import { CompareProvider } from "@/components/property/CompareContext";
import PropertyComparator from "@/components/property/PropertyComparator";


import { GoogleAnalytics } from '@next/third-parties/google';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html lang={lang} className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-primary-black text-white`}
      >
        <CompareProvider>
          {children}
          <PropertyComparator lang={lang} />
          {/* ChatBot temporarily removed */}
        </CompareProvider>
        <Analytics />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
