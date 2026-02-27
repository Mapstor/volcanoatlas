import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { getNavData } from "@/lib/data";
import { defaultMetadata } from "./metadata";
import Script from 'next/script';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = defaultMetadata;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navData = await getNavData();
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VolcanoAtlas',
    description: "Comprehensive encyclopedia of Earth's volcanoes",
    url: 'https://volcanosatlas.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://volcanosatlas.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'VolcanoAtlas',
      logo: {
        '@type': 'ImageObject',
        url: 'https://volcanosatlas.com/logo.png'
      }
    }
  };

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSans3.variable} ${jetbrainsMono.variable}`}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-volcanic-950 text-white min-h-screen">
        <HeaderWrapper navData={navData} />
        <main>
          {children}
        </main>
        <Footer navData={navData} />
      </body>
    </html>
  );
}