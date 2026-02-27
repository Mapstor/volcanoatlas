import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volcanoatlas.vercel.app';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'VolcanoAtlas — Every Volcano on Earth',
    template: '%s | VolcanoAtlas'
  },
  description: "Comprehensive encyclopedia of Earth's volcanoes. Explore detailed profiles of 150+ volcanoes across 46 countries with eruption histories, maps, and facts.",
  keywords: ['volcanoes', 'volcanic eruptions', 'geology', 'earth science', 'lava', 'magma', 'tectonic plates', 'ring of fire', 'stratovolcano', 'shield volcano'],
  authors: [{ name: 'VolcanoAtlas' }],
  creator: 'VolcanoAtlas',
  publisher: 'VolcanoAtlas',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'VolcanoAtlas',
    title: 'VolcanoAtlas — Every Volcano on Earth',
    description: "Comprehensive encyclopedia of Earth's volcanoes. Explore detailed profiles of 150+ volcanoes across 46 countries.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'VolcanoAtlas - Explore Earth\'s Volcanoes',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VolcanoAtlas — Every Volcano on Earth',
    description: "Comprehensive encyclopedia of Earth's volcanoes. Explore detailed profiles of 150+ volcanoes.",
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@volcanoatlas',
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#FF6B35',
      },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: siteUrl,
  },
};

export function generateVolcanoMetadata(volcano: any): Metadata {
  const title = `${volcano.hero.name} Volcano — Eruptions, Lava & Facts`;
  const description = volcano.meta_description || 
    `${volcano.hero.name} is a ${volcano.hero.type} in ${volcano.hero.country}. ${volcano.hero.subtitle}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [
        {
          url: `/og-volcano-${volcano.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${volcano.hero.name} Volcano`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/og-volcano-${volcano.slug}.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/volcano/${volcano.slug}`,
    },
  };
}

export function generateCountryMetadata(country: any): Metadata {
  const countryName = country.title.replace('Volcanoes in ', '');
  const title = `Volcanoes in ${countryName} — ${country.hero.volcano_count} Volcanic Peaks`;
  const description = country.meta_description || country.hero.subtitle;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [
        {
          url: `/og-country-${country.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `Volcanoes in ${countryName}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/og-country-${country.slug}.jpg`],
    },
    alternates: {
      canonical: `${siteUrl}/volcanoes-in-${country.slug}`,
    },
  };
}