import fs from 'fs';
import path from 'path';

interface VolcanoFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    Volcano_Number: number;
    Volcano_Name: string;
    Country: string;
    Latitude: number;
    Longitude: number;
    Elevation: number;
    Primary_Volcano_Type: string;
    Last_Eruption_Year: number | null;
    Region: string;
  };
}

interface VolcanoGeoJSON {
  type: string;
  features: VolcanoFeature[];
}

// Cache the volcano data
let volcanoDataCache: VolcanoGeoJSON | null = null;
let existingVolcanoSlugsCache: Set<string> | null = null;

function loadVolcanoData(): VolcanoGeoJSON {
  if (volcanoDataCache) {
    return volcanoDataCache;
  }

  const filePath = path.join(process.cwd(), 'volcanoes.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  volcanoDataCache = JSON.parse(fileContent) as VolcanoGeoJSON;
  return volcanoDataCache;
}

// Get list of volcano slugs we actually have content for
function getExistingVolcanoSlugs(): Set<string> {
  if (existingVolcanoSlugsCache) {
    return existingVolcanoSlugsCache;
  }

  const contentDir = path.join(process.cwd(), 'data', 'content');
  const files = fs.readdirSync(contentDir);
  const volcanoSlugs = files
    .filter(file => file.startsWith('volcano-') && file.endsWith('.json'))
    .map(file => file.replace('volcano-', '').replace('.json', ''));
  
  existingVolcanoSlugsCache = new Set(volcanoSlugs);
  return existingVolcanoSlugsCache;
}

export function getVolcanoesByCountry(countryName: string): Array<{
  name: string;
  lat: number;
  lon: number;
  elevation: number;
  type: string;
  lastEruption: number | null;
}> {
  const data = loadVolcanoData();
  
  // Normalize country name for comparison
  const normalizedCountry = countryName.toLowerCase();
  
  const countryVolcanoes = data.features
    .filter(feature => {
      const volcanoCountry = feature.properties.Country?.toLowerCase() || '';
      // Handle special cases
      if (normalizedCountry === 'united states') {
        return volcanoCountry === 'united states' || 
               volcanoCountry === 'usa' || 
               volcanoCountry === 'u.s.a.';
      }
      return volcanoCountry === normalizedCountry;
    })
    .map(feature => ({
      name: feature.properties.Volcano_Name,
      lat: feature.properties.Latitude,
      lon: feature.properties.Longitude,
      elevation: feature.properties.Elevation,
      type: feature.properties.Primary_Volcano_Type,
      lastEruption: feature.properties.Last_Eruption_Year
    }));

  return countryVolcanoes;
}

export function getAllVolcanoMarkers(): Array<{
  name: string;
  lat: number;
  lon: number;
  country: string;
  elevation: number;
  type: string;
  lastEruption: number | null;
}> {
  const data = loadVolcanoData();
  
  return data.features.map(feature => ({
    name: feature.properties.Volcano_Name,
    lat: feature.properties.Latitude,
    lon: feature.properties.Longitude,
    country: feature.properties.Country,
    elevation: feature.properties.Elevation,
    type: feature.properties.Primary_Volcano_Type,
    lastEruption: feature.properties.Last_Eruption_Year
  }));
}

// Get coordinates for specific volcanoes by name
export function getVolcanoCoordinatesByNames(names: string[]): Map<string, {lat: number, lon: number}> {
  const data = loadVolcanoData();
  const coordsMap = new Map<string, {lat: number, lon: number}>();
  
  const normalizedNames = new Set(names.map(n => n.toLowerCase()));
  
  data.features.forEach(feature => {
    const volcanoName = feature.properties.Volcano_Name;
    if (normalizedNames.has(volcanoName.toLowerCase())) {
      coordsMap.set(volcanoName, {
        lat: feature.properties.Latitude,
        lon: feature.properties.Longitude
      });
    }
  });
  
  return coordsMap;
}

// Get volcano data from content files for a country (only volcanoes we have pages for)
export function getCountryVolcanoesWithPages(countrySlug: string): Map<string, string> {
  // Returns a map of volcano name -> slug for volcanoes with pages
  const nameToSlugMap = new Map<string, string>();
  
  try {
    const contentDir = path.join(process.cwd(), 'data', 'content');
    const countryFile = path.join(contentDir, `country-${countrySlug}.json`);
    
    // Check if file exists first
    if (!fs.existsSync(countryFile)) {
      // No country file, return empty map
      return nameToSlugMap;
    }
    
    const countryData = JSON.parse(fs.readFileSync(countryFile, 'utf8'));
    
    // Get volcano data from the volcano table rows
    if (countryData.volcano_table?.rows) {
      for (const row of countryData.volcano_table.rows) {
        const [rank, name, volcanoSlug] = row;
        
        if (volcanoSlug) {
          // Check if volcano file exists
          const volcanoFile = path.join(contentDir, `volcano-${volcanoSlug}.json`);
          if (fs.existsSync(volcanoFile)) {
            nameToSlugMap.set(name, volcanoSlug);
          }
        }
      }
    }
  } catch (error) {
    // Silent fail, return empty map
  }
  
  return nameToSlugMap;
}