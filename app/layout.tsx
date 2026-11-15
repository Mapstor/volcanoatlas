import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import { getNavData } from "@/lib/data";
import { defaultMetadata } from "./metadata";
import Script from 'next/script';
import JsonLd from '@/components/JsonLd';
import { SITE_NAME, SITE_URL } from '@/lib/site';

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

// Only facts that are true and visible on the site. No awards, parent company,
// social profiles or policies that do not exist.
const siteLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
  },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navData = await getNavData();

  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSans3.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M577GLBCD1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M577GLBCD1');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity-analytics" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "57c407e8336c4915e2d28eea649c8078");
          `}
        </Script>
      </head>
      <body className="bg-volcanic-950 text-white min-h-screen">
        <JsonLd data={siteLd} />
        <HeaderWrapper navData={navData} />
        <main>
          {children}
        </main>
        <Footer navData={navData} />
      </body>
    </html>
  );
}
