import Script from 'next/script';
import { getSafeImageUrl } from '@/lib/imageUtils';

interface ImageObjectSchemaProps {
  images?: Array<{
    url: string;
    caption?: string;
    photographer?: string;
    source?: string;
  }>;
  pageTitle: string;
  pageUrl: string;
  primaryImageUrl?: string;
}

export default function ImageObjectSchema({
  images = [],
  pageTitle,
  pageUrl,
  primaryImageUrl
}: ImageObjectSchemaProps) {
  const baseUrl = 'https://www.volcanosatlas.com';
  const fullPageUrl = pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`;
  
  // Use primary image or fallback
  const mainImageUrl = getSafeImageUrl(primaryImageUrl, 'volcano');
  
  // If we have specific images, create schema for each
  const imageObjects = images.length > 0 
    ? images.map((img, index) => ({
        '@type': 'ImageObject',
        '@id': `${fullPageUrl}#image-${index}`,
        url: img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`,
        caption: img.caption || `Image ${index + 1} of ${pageTitle}`,
        ...(img.photographer && {
          creator: {
            '@type': 'Person',
            name: img.photographer
          }
        }),
        ...(img.source && {
          creditText: `Photo: ${img.photographer || 'Unknown'} via ${img.source}`
        }),
        representativeOfPage: index === 0,
        contentUrl: img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`,
        license: 'https://creativecommons.org/licenses/by-sa/4.0/'
      }))
    : [
        // Fallback single image
        {
          '@type': 'ImageObject',
          '@id': `${fullPageUrl}#primary-image`,
          url: mainImageUrl,
          caption: `${pageTitle} - Representative image`,
          representativeOfPage: true,
          contentUrl: mainImageUrl,
          license: 'https://creativecommons.org/licenses/by-sa/4.0/'
        }
      ];
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': imageObjects
  };

  return (
    <Script
      id="image-object-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}