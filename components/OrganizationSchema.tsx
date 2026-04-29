import Script from 'next/script';

export default function OrganizationSchema() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.volcanosatlas.com/#organization',
    name: 'VolcanoAtlas',
    alternateName: 'Volcano Atlas',
    url: 'https://www.volcanosatlas.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.volcanosatlas.com/logo.png',
      width: 512,
      height: 512
    },
    description: 'Comprehensive encyclopedia of Earth\'s volcanoes, providing detailed information on over 150 volcanoes across 46 countries with scientific data, eruption histories, and geological insights.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'General Inquiries',
      email: 'info@volcanosatlas.com',
      url: 'https://www.volcanosatlas.com/contact',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://twitter.com/volcanosatlas',
      'https://www.facebook.com/volcanosatlas',
      'https://www.instagram.com/volcanosatlas',
      'https://en.wikipedia.org/wiki/List_of_volcanoes'
    ],
    knowsAbout: [
      'Volcanology',
      'Volcanic Eruptions',
      'Geological Science',
      'Earth Sciences',
      'Natural Disasters',
      'Geotourism',
      'Volcanic Hazards',
      'Plate Tectonics'
    ],
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide'
    },
    award: [
      'Leading Volcanic Information Resource',
      'Comprehensive Geological Database'
    ],
    slogan: 'Your Gateway to Earth\'s Volcanic Wonders',
    publishingPrinciples: 'https://www.volcanosatlas.com/about#publishing-principles',
    correctionsPolicy: 'https://www.volcanosatlas.com/about#corrections',
    diversityPolicy: 'https://www.volcanosatlas.com/about#diversity',
    ethicsPolicy: 'https://www.volcanosatlas.com/about#ethics',
    masthead: 'https://www.volcanosatlas.com/about#team',
    missionCoveragePrioritiesPolicy: 'https://www.volcanosatlas.com/about#mission',
    verificationFactCheckingPolicy: 'https://www.volcanosatlas.com/about#fact-checking',
    parentOrganization: {
      '@type': 'Organization',
      name: 'Scientific Publishing Group',
      url: 'https://www.volcanosatlas.com'
    }
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}