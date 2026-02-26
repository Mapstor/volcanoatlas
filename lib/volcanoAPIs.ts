// Real-time volcano data from USGS and Smithsonian APIs

export interface USGSVolcano {
  volcano_name: string;
  color_code: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
  alert_level: 'WARNING' | 'WATCH' | 'ADVISORY' | 'NORMAL';
  obs_fullname: string;
  sent_utc: string;
  notice_url: string;
  vnum?: string;
}

export interface SmithsonianReport {
  title: string;
  volcano_name: string;
  country: string;
  description: string;
  date_range: string;
  link: string;
  lat?: number;
  lon?: number;
  pubDate: string;
}

// Fetch currently elevated US volcanoes from USGS
export async function getUSGSElevatedVolcanoes(): Promise<USGSVolcano[]> {
  try {
    const response = await fetch('https://volcanoes.usgs.gov/hans-public/api/volcano/getElevatedVolcanoes', {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch USGS data');
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching USGS volcanoes:', error);
    return [];
  }
}

// Parse Smithsonian RSS feed for weekly volcanic activity
export async function getSmithsonianWeeklyActivity(): Promise<SmithsonianReport[]> {
  try {
    const response = await fetch('https://volcano.si.edu/news/WeeklyVolcanoRSS.xml', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Smithsonian data');
    }
    
    const xmlText = await response.text();
    
    // Parse XML manually (simple parser for RSS)
    const reports: SmithsonianReport[] = [];
    const items = xmlText.split('<item>').slice(1); // Skip first split (before first item)
    
    for (const item of items) {
      try {
        // Extract title
        const titleMatch = item.match(/<title>(.+?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : '';
        
        // Extract volcano name and country from title
        const titleParts = title.match(/^(.+?) \((.+?)\) - Report for (.+?) - /);
        const volcano_name = titleParts ? titleParts[1] : '';
        const country = titleParts ? titleParts[2] : '';
        const date_range = titleParts ? titleParts[3] : '';
        
        // Extract description (remove CDATA and HTML)
        const descMatch = item.match(/<description>\s*([\s\S]*?)\s*<\/description>/);
        let description = descMatch ? descMatch[1] : '';
        description = description
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Extract link
        const linkMatch = item.match(/<link>(.+?)<\/link>/);
        const link = linkMatch ? linkMatch[1] : '';
        
        // Extract coordinates if available
        const coordMatch = item.match(/<georss:point>(.+?) (.+?)<\/georss:point>/);
        const lat = coordMatch ? parseFloat(coordMatch[1]) : undefined;
        const lon = coordMatch ? parseFloat(coordMatch[2]) : undefined;
        
        // Extract publication date
        const pubDateMatch = item.match(/<pubDate>(.+?)<\/pubDate>/);
        const pubDate = pubDateMatch ? pubDateMatch[1] : '';
        
        if (volcano_name && description) {
          reports.push({
            title,
            volcano_name,
            country,
            description,
            date_range,
            link,
            lat,
            lon,
            pubDate
          });
        }
      } catch (err) {
        console.error('Error parsing item:', err);
      }
    }
    
    return reports;
  } catch (error) {
    console.error('Error fetching Smithsonian data:', error);
    return [];
  }
}

// Get all recent volcanic activity combined
export async function getAllRecentActivity() {
  const [usgsData, smithsonianData] = await Promise.all([
    getUSGSElevatedVolcanoes(),
    getSmithsonianWeeklyActivity()
  ]);
  
  return {
    usVolcanoes: usgsData,
    globalReports: smithsonianData,
    lastUpdated: new Date().toISOString()
  };
}

// Get alert level color class
export function getAlertColorClass(colorCode: string): string {
  switch (colorCode) {
    case 'RED':
      return 'bg-red-500/20 text-red-400 border-red-500';
    case 'ORANGE':
      return 'bg-orange-500/20 text-orange-400 border-orange-500';
    case 'YELLOW':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
    case 'GREEN':
      return 'bg-green-500/20 text-green-400 border-green-500';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500';
  }
}

// Get alert level description
export function getAlertLevelDescription(alertLevel: string, colorCode: string): string {
  if (colorCode === 'RED' || alertLevel === 'WARNING') {
    return 'Hazardous eruption imminent, underway, or suspected';
  } else if (colorCode === 'ORANGE' || alertLevel === 'WATCH') {
    return 'Heightened unrest with increased potential of eruption';
  } else if (colorCode === 'YELLOW' || alertLevel === 'ADVISORY') {
    return 'Elevated unrest above known background level';
  } else {
    return 'Normal activity or dormant state';
  }
}