import Script from 'next/script';
import { getSafeImageUrl } from '@/lib/imageUtils';

interface HowToStep {
  name: string;
  text: string;
  image?: string;
  tip?: string;
}

interface HowToSchemaProps {
  title: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration format, e.g., "PT30M"
  estimatedCost?: {
    value: string;
    currency?: string;
  };
  supply?: string[];
  tool?: string[];
  image?: string;
  pageUrl: string;
}

export default function HowToSchema({
  title,
  description,
  steps,
  totalTime,
  estimatedCost,
  supply = [],
  tool = [],
  image,
  pageUrl
}: HowToSchemaProps) {
  const baseUrl = 'https://www.volcanosatlas.com';
  const fullUrl = pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${fullUrl}#howto`,
    name: title,
    description: description,
    image: getSafeImageUrl(image, 'general'),
    
    // Time and cost
    ...(totalTime && { totalTime }),
    ...(estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        value: estimatedCost.value,
        currency: estimatedCost.currency || 'USD'
      }
    }),
    
    // Supplies and tools
    ...(supply.length > 0 && {
      supply: supply.map(item => ({
        '@type': 'HowToSupply',
        name: item
      }))
    }),
    
    ...(tool.length > 0 && {
      tool: tool.map(item => ({
        '@type': 'HowToTool',
        name: item
      }))
    }),
    
    // Steps
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      '@id': `${fullUrl}#step-${index + 1}`,
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: getSafeImageUrl(step.image, 'general')
      }),
      ...(step.tip && {
        tip: {
          '@type': 'HowToTip',
          text: step.tip
        }
      })
    })),
    
    // Author
    author: {
      '@type': 'Organization',
      name: 'VolcanoAtlas',
      url: baseUrl
    },
    
    // Additional metadata
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0]
  };

  return (
    <Script
      id="howto-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Helper function to generate volcano visit HowTo data
export function generateVolcanoVisitHowTo(volcanoName: string, country: string, elevation?: number) {
  return {
    title: `How to Visit ${volcanoName} Volcano`,
    description: `Complete guide for visiting and exploring ${volcanoName} volcano in ${country} safely and responsibly.`,
    steps: [
      {
        name: 'Research and Planning',
        text: `Research ${volcanoName}'s current activity status, weather conditions, and access requirements. Check with local volcanic monitoring agencies for the latest updates.`,
        tip: 'Visit the official monitoring agency website for real-time volcano status updates.'
      },
      {
        name: 'Check Permits and Regulations',
        text: `Verify if you need permits to visit ${volcanoName}. Some volcanoes require advance permits or guided tours, especially in protected areas.`,
        tip: 'Contact local tourism offices or park services for permit information.'
      },
      {
        name: 'Prepare Safety Equipment',
        text: 'Pack essential safety gear including sturdy hiking boots, protective clothing, dust masks, safety goggles, first aid kit, and emergency supplies.',
        tip: 'Volcanic terrain can be sharp and unstable - proper footwear is essential.'
      },
      {
        name: 'Plan Your Route',
        text: `Study the approach routes to ${volcanoName}. ${elevation ? `At ${elevation}m elevation, ` : ''}consider altitude acclimatization and physical fitness requirements.`,
        tip: 'Download offline maps and GPS coordinates before your visit.'
      },
      {
        name: 'Monitor Weather Conditions',
        text: 'Check weather forecasts for the volcano area. Volcanic regions often have rapidly changing weather conditions.',
        tip: 'Early morning typically offers the best visibility and weather conditions.'
      },
      {
        name: 'Hire Local Guides',
        text: 'Consider hiring experienced local guides familiar with the volcano\'s terrain, hazards, and safe viewing areas.',
        tip: 'Local guides provide valuable insights into volcanic features and safety protocols.'
      },
      {
        name: 'Follow Safety Guidelines',
        text: 'Stay on marked trails, respect closure zones, maintain safe distances from active vents, and follow all posted safety instructions.',
        tip: 'Never approach active volcanic vents or enter restricted areas.'
      },
      {
        name: 'Document Responsibly',
        text: 'Take photos and videos while maintaining safety. Never compromise safety for a photograph.',
        tip: 'Use zoom lenses to capture volcanic features from safe distances.'
      }
    ],
    totalTime: 'P1D', // One day typical visit
    supply: [
      'Hiking boots',
      'Protective clothing',
      'Dust mask or respirator',
      'Safety goggles',
      'First aid kit',
      'Emergency supplies',
      'Water (3+ liters)',
      'High-energy snacks',
      'Sun protection',
      'Rain gear'
    ],
    tool: [
      'GPS device or smartphone',
      'Offline maps',
      'Camera with zoom lens',
      'Binoculars',
      'Headlamp or flashlight',
      'Emergency whistle',
      'Portable charger'
    ]
  };
}