import Script from 'next/script';

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  articleType?: 'Article' | 'NewsArticle' | 'BlogPosting' | 'ScholarlyArticle' | 'TechArticle';
  keywords?: string[];
  wordCount?: number;
  citations?: string[];
  isEducational?: boolean;
}

export default function ArticleSchema({
  title,
  description,
  url,
  imageUrl,
  datePublished = '2024-01-01',
  dateModified,
  author = 'VolcanoAtlas Editorial Team',
  articleType = 'Article',
  keywords = [],
  wordCount,
  citations = [],
  isEducational = true
}: ArticleSchemaProps) {
  const baseUrl = 'https://www.volcanosatlas.com';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // Main Article Schema
      {
        '@type': articleType,
        '@id': `${fullUrl}#article`,
        headline: title,
        description: description,
        url: fullUrl,
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
        author: {
          '@type': 'Organization',
          name: author,
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        },
        publisher: {
          '@type': 'Organization',
          name: 'VolcanoAtlas',
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512
          }
        },
        image: imageUrl || `${baseUrl}/images/volcano-default.jpg`,
        keywords: keywords.join(', '),
        ...(wordCount && { wordCount }),
        inLanguage: 'en-US',
        isPartOf: {
          '@id': `${baseUrl}/#website`
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${fullUrl}#webpage`
        },
        ...(citations.length > 0 && {
          citation: citations.map(citation => ({
            '@type': 'CreativeWork',
            name: citation
          }))
        })
      },
      
      // Add LearningResource schema for educational content
      ...(isEducational ? [{
        '@type': 'LearningResource',
        '@id': `${fullUrl}#learning-resource`,
        name: title,
        description: description,
        url: fullUrl,
        educationalLevel: 'All Levels',
        learningResourceType: 'Educational Article',
        teaches: {
          '@type': 'DefinedTerm',
          name: 'Volcanology',
          description: 'The study of volcanoes, lava, magma, and related geological phenomena'
        },
        author: {
          '@type': 'Organization',
          name: author
        },
        provider: {
          '@type': 'Organization',
          name: 'VolcanoAtlas',
          url: baseUrl
        },
        inLanguage: 'en-US',
        audience: {
          '@type': 'EducationalAudience',
          educationalRole: 'student',
          audienceType: ['public', 'researchers', 'educators']
        },
        isAccessibleForFree: true,
        conditionsOfAccess: 'Free',
        license: 'https://creativecommons.org/licenses/by-sa/4.0/'
      }] : []),
      
      // WebPage Schema
      {
        '@type': 'WebPage',
        '@id': `${fullUrl}#webpage`,
        url: fullUrl,
        name: title,
        isPartOf: {
          '@id': `${baseUrl}/#website`
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl || `${baseUrl}/images/volcano-default.jpg`
        },
        datePublished: datePublished,
        dateModified: dateModified || datePublished,
        breadcrumb: {
          '@type': 'BreadcrumbList',
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
              name: 'Articles',
              item: `${baseUrl}/articles`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: title,
              item: fullUrl
            }
          ]
        }
      },
      
      // Add Dataset schema if the article contains data
      ...(keywords.includes('data') || keywords.includes('statistics') ? [{
        '@type': 'Dataset',
        '@id': `${fullUrl}#dataset`,
        name: `${title} - Data`,
        description: `Volcanic data and statistics presented in ${title}`,
        url: fullUrl,
        license: 'https://creativecommons.org/licenses/by-sa/4.0/',
        creator: {
          '@type': 'Organization',
          name: 'VolcanoAtlas'
        },
        distribution: {
          '@type': 'DataDownload',
          encodingFormat: 'text/html',
          contentUrl: fullUrl
        },
        includedInDataCatalog: {
          '@type': 'DataCatalog',
          name: 'VolcanoAtlas Data Repository',
          url: baseUrl
        }
      }] : [])
    ]
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}