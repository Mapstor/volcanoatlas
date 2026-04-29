/**
 * Utility functions for handling images throughout the application
 */

const BASE_URL = 'https://www.volcanosatlas.com';

/**
 * Generate a safe image URL with fallbacks
 */
export function getSafeImageUrl(
  primaryPath?: string | null,
  type: 'volcano' | 'country' | 'general' = 'general'
): string {
  // If we have a valid primary path, use it
  if (primaryPath && (primaryPath.startsWith('http') || primaryPath.startsWith('/'))) {
    return primaryPath;
  }
  
  // Otherwise, return appropriate fallback based on type
  switch (type) {
    case 'volcano':
      return `${BASE_URL}/og-image.jpg`; // Volcano-themed OG image
    case 'country':
      return `${BASE_URL}/og-image.jpg`; // Can be customized later
    default:
      return `${BASE_URL}/og-image.jpg`;
  }
}

/**
 * Generate an array of image URLs for schema markup
 */
export function getSchemaImages(
  slug: string,
  type: 'volcano' | 'country' = 'volcano',
  customImages?: string[]
): string[] {
  if (customImages && customImages.length > 0) {
    return customImages.map(img => 
      img.startsWith('http') ? img : `${BASE_URL}${img}`
    );
  }
  
  // Return single fallback image
  return [getSafeImageUrl(null, type)];
}

/**
 * Generate descriptive alt text for images
 */
export function generateAltText(
  name: string,
  type: 'volcano' | 'country' | 'map' | 'gallery' = 'volcano',
  additional?: {
    country?: string;
    region?: string;
    volcanoType?: string;
    elevation?: number;
  }
): string {
  switch (type) {
    case 'volcano':
      if (additional?.country && additional?.volcanoType) {
        return `${name} ${additional.volcanoType} volcano in ${additional.country}${
          additional.elevation ? ` at ${additional.elevation}m elevation` : ''
        }`;
      }
      return `${name} volcano${additional?.country ? ` in ${additional.country}` : ''}`;
    
    case 'country':
      return `Volcanoes of ${name} - volcanic landscape and geological features`;
    
    case 'map':
      return `Map showing location of ${name}${
        additional?.region ? ` in ${additional.region}` : ''
      }`;
    
    case 'gallery':
      return `Photo of ${name} volcano${
        additional?.country ? ` in ${additional.country}` : ''
      }`;
    
    default:
      return `${name} volcanic feature`;
  }
}

/**
 * Check if an image URL is valid (not a placeholder)
 */
export function isValidImageUrl(url?: string | null): boolean {
  if (!url) return false;
  
  // Check if it's a proper URL
  if (!url.startsWith('http') && !url.startsWith('/')) return false;
  
  // Check if it's not a placeholder pattern
  const placeholderPatterns = [
    /\/images\/.*-\d+\.jpg$/, // /images/slug-1.jpg pattern
    /\/volcano-.*\.jpg$/,      // /volcano-slug.jpg pattern
    /\/countries\/.*\.jpg$/    // /countries/slug.jpg pattern
  ];
  
  return !placeholderPatterns.some(pattern => pattern.test(url));
}

/**
 * Get volcano image from Unsplash or fallback
 */
export function getVolcanoImageUrl(
  volcanoName: string,
  unsplashUrl?: string | null
): string {
  // If we have an Unsplash URL, use it
  if (unsplashUrl && unsplashUrl.startsWith('http')) {
    return unsplashUrl;
  }
  
  // Otherwise use our fallback
  return getSafeImageUrl(null, 'volcano');
}