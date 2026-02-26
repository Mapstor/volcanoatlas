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