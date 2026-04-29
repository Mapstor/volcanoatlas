import Script from 'next/script';
import { getSafeImageUrl } from '@/lib/imageUtils';

interface CountrySchemaProps {
  country: {
    name: string;
    slug: string;
    volcanoCount: number;
    activeCount?: number;
    tallestVolcano?: {
      name: string;
      elevation?: number;
    };
    mostRecentEruption?: {
      year: number | string;
      volcano: string;
    };
    description?: string;
    imageUrl?: string;
  };
}

export default function CountrySchema({ country }: CountrySchemaProps) {
  const baseUrl = 'https://www.volcanosatlas.com';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // Country/Place Schema
      {
        '@type': 'Country',
        '@id': `${baseUrl}/volcanoes-in-${country.slug}#country`,
        name: country.name,
        description: country.description || `Comprehensive guide to all ${country.volcanoCount} volcanoes in ${country.name}, including active and dormant volcanic systems, eruption history, and geological information.`,
        url: `${baseUrl}/volcanoes-in-${country.slug}`,
        image: getSafeImageUrl(country.imageUrl, 'country'),
        containsPlace: {
          '@type': 'Place',
          name: `Volcanic regions of ${country.name}`,
          description: `${country.volcanoCount} volcanic features including ${country.activeCount || 'several'} active volcanoes`
        }
      },
      
      // TouristDestination Schema for volcanic tourism
      {
        '@type': 'TouristDestination',
        '@id': `${baseUrl}/volcanoes-in-${country.slug}#tourist-destination`,
        name: `Volcanoes of ${country.name}`,
        description: `Explore ${country.volcanoCount} volcanoes in ${country.name}${country.tallestVolcano ? `, including the ${country.tallestVolcano.elevation ? country.tallestVolcano.elevation + 'm tall ' : ''}${country.tallestVolcano.name}` : ''}.`,
        touristType: ['Geotourism', 'Adventure Tourism', 'Educational Tourism'],
        url: `${baseUrl}/volcanoes-in-${country.slug}`,
        isPartOf: {
          '@id': `${baseUrl}/volcanoes-in-${country.slug}#country`
        },
        includesAttraction: country.tallestVolcano ? {
          '@type': 'LandmarksOrHistoricalBuildings',
          name: country.tallestVolcano.name,
          description: `Tallest volcano in ${country.name}${country.tallestVolcano.elevation ? ` at ${country.tallestVolcano.elevation}m elevation` : ''}`
        } : undefined
      },
      
      // CollectionPage Schema
      {
        '@type': 'CollectionPage',
        '@id': `${baseUrl}/volcanoes-in-${country.slug}#collection`,
        name: `All Volcanoes in ${country.name}`,
        description: `Complete list and detailed information about all ${country.volcanoCount} volcanoes in ${country.name}`,
        url: `${baseUrl}/volcanoes-in-${country.slug}`,
        numberOfItems: country.volcanoCount,
        about: {
          '@type': 'Thing',
          name: 'Volcanoes',
          description: 'Geological features formed by volcanic activity'
        },
        spatialCoverage: {
          '@type': 'Country',
          name: country.name
        }
      },
      
      // ItemList Schema for volcanoes
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/volcanoes-in-${country.slug}#volcano-list`,
        name: `Volcanoes in ${country.name}`,
        description: `Ranked list of ${country.volcanoCount} volcanoes in ${country.name} by elevation and activity`,
        numberOfItems: country.volcanoCount,
        itemListOrder: 'https://schema.org/ItemListOrderDescending'
      },
      
      // Breadcrumb Schema
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/volcanoes-in-${country.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Countries',
            item: `${baseUrl}/countries`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: country.name,
            item: `${baseUrl}/volcanoes-in-${country.slug}`
          }
        ]
      },
      
      // WebPage Schema
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/volcanoes-in-${country.slug}#webpage`,
        url: `${baseUrl}/volcanoes-in-${country.slug}`,
        name: `Volcanoes in ${country.name} - Complete Guide to ${country.volcanoCount} Volcanic Features`,
        isPartOf: {
          '@id': `${baseUrl}/#website`
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          '@id': `${baseUrl}/volcanoes-in-${country.slug}#primaryimage`,
          url: getSafeImageUrl(country.imageUrl, 'country'),
          caption: `Volcanoes of ${country.name}`
        },
        breadcrumb: {
          '@id': `${baseUrl}/volcanoes-in-${country.slug}#breadcrumb`
        },
        potentialAction: {
          '@type': 'ReadAction',
          target: `${baseUrl}/volcanoes-in-${country.slug}`
        }
      },
      
      // Add AggregateRating if we have eruption data
      ...(country.mostRecentEruption ? [{
        '@type': 'Event',
        '@id': `${baseUrl}/volcanoes-in-${country.slug}#recent-eruption`,
        name: `Most Recent Eruption in ${country.name}`,
        description: `${country.mostRecentEruption.volcano} erupted in ${country.mostRecentEruption.year}`,
        startDate: country.mostRecentEruption.year.toString(),
        location: {
          '@type': 'Place',
          name: country.mostRecentEruption.volcano,
          containedInPlace: {
            '@type': 'Country',
            name: country.name
          }
        }
      }] : [])
    ]
  };

  return (
    <Script
      id="country-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}