import Script from 'next/script';

interface VolcanoSchemaProps {
  volcano: {
    name: string;
    country: string;
    type: string;
    elevation: number;
    latitude: number;
    longitude: number;
    lastEruption: string;
    description: string;
    slug: string;
    status?: string;
    region?: string;
  };
}

export default function VolcanoSchema({ volcano }: VolcanoSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `https://volcanosatlas.com/volcano/${volcano.slug}`,
    name: `${volcano.name} Volcano`,
    description: volcano.description,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: volcano.latitude,
      longitude: volcano.longitude,
      elevation: `${volcano.elevation} meters`
    },
    additionalType: 'Volcano',
    containedInPlace: {
      '@type': 'Country',
      name: volcano.country
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Volcano Type',
        value: volcano.type
      },
      {
        '@type': 'PropertyValue',
        name: 'Last Eruption',
        value: volcano.lastEruption
      },
      {
        '@type': 'PropertyValue',
        name: 'Status',
        value: volcano.status || 'Unknown'
      }
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://volcanosatlas.com/volcano/${volcano.slug}`
    },
    image: [
      `https://volcanosatlas.com/images/${volcano.slug}-1.jpg`,
      `https://volcanosatlas.com/images/${volcano.slug}-2.jpg`,
      `https://volcanosatlas.com/images/${volcano.slug}-3.jpg`
    ],
    isPartOf: {
      '@type': 'WebSite',
      name: 'VolcanoAtlas',
      url: 'https://volcanosatlas.com'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://volcanosatlas.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Countries',
        item: 'https://volcanosatlas.com/countries'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: volcano.country,
        item: `https://volcanosatlas.com/volcanoes-in-${volcano.country.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: volcano.name,
        item: `https://volcanosatlas.com/volcano/${volcano.slug}`
      }
    ]
  };

  return (
    <>
      <Script
        id={`volcano-schema-${volcano.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id={`breadcrumb-schema-${volcano.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}