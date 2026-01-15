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

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL('https://puntacanainvestments.com'),
  };
}

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }]
}

import { CompareProvider } from "@/components/property/CompareContext";
import PropertyComparator from "@/components/property/PropertyComparator";
import AIAssistant from "@/components/ui/AIAssistant";

import { GoogleAnalytics } from '@next/third-parties/google';

import ChatBot from "@/components/chat/ChatBot";

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
          <AIAssistant lang={lang} />
        </CompareProvider>
        <Analytics />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
