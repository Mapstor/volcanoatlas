interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

interface PhotoResult {
  url: string;
  alt: string;
  attribution: {
    photographer: string;
    photographerUrl: string;
    source: string;
  };
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const photoCache = new Map<string, { data: PhotoResult[]; timestamp: number }>();

export async function fetchVolcanoPhotos(
  volcanoName: string,
  limit: number = 5
): Promise<PhotoResult[]> {
  const cacheKey = `${volcanoName}-${limit}`;
  
  // Check cache
  const cached = photoCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Return demo data if no API key is configured
  if (!process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY === 'your_unsplash_access_key_here') {
    return getDemoPhotos(volcanoName);
  }

  try {
    const searchQuery = `${volcanoName} volcano`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${limit}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1',
        },
        next: { revalidate: 86400 } // Cache for 24 hours
      }
    );

    if (!response.ok) {
      console.error('Unsplash API error:', response.status);
      return getFallbackPhotos(volcanoName);
    }

    const data = await response.json();
    const photos: PhotoResult[] = data.results.map((photo: UnsplashPhoto) => ({
      url: photo.urls.regular,
      alt: photo.alt_description || photo.description || `${volcanoName} volcano`,
      attribution: {
        photographer: photo.user.name,
        photographerUrl: `https://unsplash.com/@${photo.user.username}?utm_source=volcano_atlas&utm_medium=referral`,
        source: 'Unsplash'
      }
    }));

    // Cache the results
    photoCache.set(cacheKey, { data: photos, timestamp: Date.now() });
    return photos;

  } catch (error) {
    console.error('Error fetching photos:', error);
    return getFallbackPhotos(volcanoName);
  }
}

export async function fetchNASAVolcanoImages(volcanoName: string, limit: number = 3): Promise<PhotoResult[]> {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  
  try {
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(volcanoName + ' volcano')}&media_type=image&page_size=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 86400 }
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const items = data.collection.items || [];
    
    return items.map((item: any) => ({
      url: item.links?.[0]?.href || '',
      alt: item.data?.[0]?.title || `${volcanoName} volcano from space`,
      attribution: {
        photographer: 'NASA',
        photographerUrl: 'https://www.nasa.gov',
        source: 'NASA Image Library'
      }
    })).filter((photo: PhotoResult) => photo.url);

  } catch (error) {
    console.error('NASA API error:', error);
    return [];
  }
}

// Fallback photos when API is unavailable
function getFallbackPhotos(volcanoName: string): PhotoResult[] {
  return [
    {
      url: `https://via.placeholder.com/800x600/FF6B35/FFFFFF?text=${encodeURIComponent(volcanoName)}+Volcano`,
      alt: `${volcanoName} volcano placeholder`,
      attribution: {
        photographer: 'Placeholder',
        photographerUrl: '#',
        source: 'Local'
      }
    }
  ];
}

// Demo photos for development without API key
function getDemoPhotos(volcanoName: string): PhotoResult[] {
  const demoPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&h=600&fit=crop',
      alt: 'Volcanic eruption with lava flow',
    },
    {
      url: 'https://images.unsplash.com/photo-1610878180933-123728745d22?w=800&h=600&fit=crop',
      alt: 'Volcano crater view from above',
    },
    {
      url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop',
      alt: 'Active volcano with smoke plume',
    },
    {
      url: 'https://images.unsplash.com/photo-1580250642511-1660fe42ad58?w=800&h=600&fit=crop',
      alt: 'Volcanic landscape at sunset',
    },
    {
      url: 'https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=800&h=600&fit=crop',
      alt: 'Volcano with surrounding landscape',
    }
  ];

  return demoPhotos.slice(0, 3).map(photo => ({
    ...photo,
    alt: `${volcanoName} - ${photo.alt}`,
    attribution: {
      photographer: 'Demo Data',
      photographerUrl: '#',
      source: 'Unsplash (Demo)'
    }
  }));
}