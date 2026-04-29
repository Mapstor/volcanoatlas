import Script from 'next/script';

interface DatasetSchemaProps {
  title: string;
  description: string;
  url: string;
  dataType?: 'volcano' | 'country' | 'statistics' | 'timeline';
  keywords?: string[];
  coverage?: {
    spatial?: string;
    temporal?: string;
  };
  variableMeasured?: Array<{
    name: string;
    description?: string;
    unitText?: string;
  }>;
  dataDownloadUrl?: string;
}

export default function DatasetSchema({
  title,
  description,
  url,
  dataType = 'volcano',
  keywords = [],
  coverage,
  variableMeasured = [],
  dataDownloadUrl
}: DatasetSchemaProps) {
  const baseUrl = 'https://www.volcanosatlas.com';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  // Add default variables measured based on data type
  const defaultVariables = {
    volcano: [
      { name: 'Elevation', unitText: 'meters', description: 'Height above sea level' },
      { name: 'Last Eruption Year', unitText: 'CE/BCE', description: 'Year of most recent eruption' },
      { name: 'VEI Max', unitText: 'VEI scale', description: 'Maximum Volcanic Explosivity Index' },
      { name: 'Eruption Count', unitText: 'count', description: 'Total recorded eruptions' }
    ],
    country: [
      { name: 'Volcano Count', unitText: 'count', description: 'Number of volcanoes' },
      { name: 'Active Count', unitText: 'count', description: 'Number of active volcanoes' },
      { name: 'Elevation Range', unitText: 'meters', description: 'Range of volcano elevations' }
    ],
    statistics: [
      { name: 'Statistical Measure', unitText: 'various', description: 'Various statistical measurements' }
    ],
    timeline: [
      { name: 'Event Date', unitText: 'date', description: 'Date of volcanic event' },
      { name: 'Event Type', unitText: 'category', description: 'Type of volcanic event' },
      { name: 'Impact', unitText: 'scale', description: 'Impact measurement' }
    ]
  };
  
  const measuredVariables = variableMeasured.length > 0 
    ? variableMeasured 
    : defaultVariables[dataType] || [];
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${fullUrl}#dataset`,
    name: title,
    description: description,
    url: fullUrl,
    keywords: keywords.join(', '),
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    isAccessibleForFree: true,
    
    // Creator and provider
    creator: {
      '@type': 'Organization',
      name: 'VolcanoAtlas',
      url: baseUrl,
      sameAs: 'https://www.volcanosatlas.com'
    },
    
    provider: {
      '@type': 'Organization',
      name: 'VolcanoAtlas',
      url: baseUrl
    },
    
    // Catalog inclusion
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: 'VolcanoAtlas Global Volcano Database',
      url: baseUrl,
      description: 'Comprehensive database of Earth\'s volcanoes with geological and eruption data'
    },
    
    // Distribution information
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/html',
        contentUrl: fullUrl,
        description: 'Web-based interactive data view'
      },
      ...(dataDownloadUrl ? [{
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: dataDownloadUrl,
        description: 'Machine-readable JSON data export'
      }] : [])
    ],
    
    // Spatial and temporal coverage
    ...(coverage?.spatial && {
      spatialCoverage: {
        '@type': 'Place',
        name: coverage.spatial
      }
    }),
    
    ...(coverage?.temporal && {
      temporalCoverage: coverage.temporal
    }),
    
    // Variables measured
    ...(measuredVariables.length > 0 && {
      variableMeasured: measuredVariables.map(variable => ({
        '@type': 'PropertyValue',
        name: variable.name,
        ...(variable.description && { description: variable.description }),
        ...(variable.unitText && { unitText: variable.unitText })
      }))
    }),
    
    // Date information
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    
    // Additional metadata
    measurementTechnique: 'Compilation from multiple authoritative sources including Smithsonian Global Volcanism Program',
    
    // Related datasets
    isBasedOn: [
      {
        '@type': 'Dataset',
        name: 'Smithsonian Global Volcanism Program',
        url: 'https://volcano.si.edu/',
        publisher: {
          '@type': 'Organization',
          name: 'Smithsonian Institution'
        }
      }
    ]
  };

  return (
    <Script
      id="dataset-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}