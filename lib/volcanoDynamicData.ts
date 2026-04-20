import fs from 'fs';
import path from 'path';

interface VolcanoGeoData {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    Volcano_Number: number;
    Volcano_Name: string;
    Volcanic_Landform: string;
    Primary_Volcano_Type: string;
    Last_Eruption_Year: number | null;
    Country: string;
    Region: string;
    Subregion: string;
    Geological_Summary: string;
    Latitude: number;
    Longitude: number;
    Elevation: number;
    Tectonic_Setting: string;
    Geologic_Epoch: string;
    Evidence_Category: string;
    Primary_Photo_Link: string;
    Primary_Photo_Caption: string;
    Primary_Photo_Credit: string;
    Major_Rock_Type: string;
  };
}

// Cache the GeoJSON data
let geoDataCache: any = null;

function loadGeoData() {
  if (geoDataCache) {
    return geoDataCache;
  }
  
  const filePath = path.join(process.cwd(), 'volcanoes.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  geoDataCache = JSON.parse(fileContent);
  return geoDataCache;
}

export function getVolcanoesGeoData(): VolcanoGeoData[] {
  const data = loadGeoData();
  return data?.features || [];
}

export function getVolcanoGeoDataByName(volcanoName: string): VolcanoGeoData | null {
  const data = loadGeoData();
  
  // Clean up the volcano name for matching
  const cleanName = volcanoName.toLowerCase().trim();
  
  const volcano = data.features.find(
    (feature: VolcanoGeoData) => 
      feature.properties.Volcano_Name.toLowerCase() === cleanName
  );
  
  return volcano || null;
}

// Get eruption statistics from ranking data
export function getVolcanoStats(volcanoName: string): { totalEruptions?: number; maxVEI?: number } | null {
  try {
    const rankingPath = path.join(process.cwd(), 'data', 'content', 'ranking-active-volcanoes.json');
    const rankingContent = fs.readFileSync(rankingPath, 'utf8');
    const rankingData = JSON.parse(rankingContent);
    
    // Find the volcano in the table rows
    const volcanoRow = rankingData.ranked_table?.rows?.find(
      (row: any[]) => row[0].toLowerCase() === volcanoName.toLowerCase()
    );
    
    if (volcanoRow) {
      // Extract total eruptions (index 6) and max VEI (index 7)
      return {
        totalEruptions: volcanoRow[6] || null,
        maxVEI: volcanoRow[7] || null
      };
    }
  } catch (error) {
    console.error('Error loading volcano stats:', error);
  }
  
  return null;
}

export function formatElevation(meters: number): string {
  const feet = Math.round(meters * 3.28084);
  return `${meters.toLocaleString()} m (${feet.toLocaleString()} ft)`;
}

/**
 * Computes the raw number of years between the eruption year and current year
 * @param lastEruptionYear - The year of last eruption (positive=CE, negative=BCE, null=unknown)
 * @param currentYear - The current year (defaults to now, parameterized for testing)
 * @returns Number of years ago, or null if data is invalid/missing
 */
export function computeYearsAgo(
  lastEruptionYear: number | null,
  currentYear: number = new Date().getFullYear()
): number | null {
  // Return null for unknown/missing data
  if (lastEruptionYear === null) {
    return null;
  }
  
  // Check for invalid future years
  if (lastEruptionYear > currentYear) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Invalid future eruption year: ${lastEruptionYear} (current year: ${currentYear})`);
    }
    return null;
  }
  
  return currentYear - lastEruptionYear;
}

/**
 * Formats Last_Eruption_Year into user-friendly "X years ago" text
 * @param lastEruptionYear - The year of last eruption (positive=CE, negative=BCE, null=unknown)
 * @param currentYear - The current year (defaults to now, parameterized for testing)
 * @returns Formatted string or null if data is null/invalid
 */
export function formatYearsAgo(
  lastEruptionYear: number | null,
  currentYear: number = new Date().getFullYear()
): string | null {
  const yearsAgo = computeYearsAgo(lastEruptionYear, currentYear);
  
  if (yearsAgo === null) {
    return null;
  }
  
  // Handle current year
  if (yearsAgo === 0) {
    return 'This year';
  }
  
  // Handle singular year
  if (yearsAgo === 1) {
    return '1 year ago';
  }
  
  // Handle all other cases with thousands separator for readability
  if (yearsAgo >= 1000) {
    return `${yearsAgo.toLocaleString('en-US')} years ago`;
  }
  
  // Regular years (2-999)
  return `${yearsAgo} years ago`;
}