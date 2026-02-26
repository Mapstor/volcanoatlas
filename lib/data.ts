import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');
const contentDirectory = path.join(dataDirectory, 'content');

// Type definitions
export interface VolcanoData {
  slug: string;
  volcano_id: number;
  title: string;
  meta_title: string;
  meta_description: string;
  quick_answer: {
    what: string;
    status: string;
    famous_for: string;
    danger_level: string;
  };
  hero: {
    name: string;
    local_name?: string;
    subtitle: string;
    country: string;
    region: string;
    type: string;
    elevation_m: number;
    elevation_ft: number;
    status: string;
    last_eruption: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  key_facts_box?: {
    elevation?: string;
    type?: string;
    status?: string;
    last_eruption?: string;
    first_known_eruption?: string;
    total_recorded_eruptions?: number | string;
    confirmed_eruptions?: number | string;
    vei_max?: string;
    country?: string;
    region?: string;
    tectonic_setting?: string;
    nearest_city?: string;
    population_at_risk?: string;
    rock_types?: string[];
    monitoring_agency?: string;
    monitoring_agency_url?: string;
    gvp_url?: string;
  };
  sections: Record<string, any>;
  comparison_tables?: any[];
  eruption_timeline?: any[];
  vei_distribution?: any;
  related_volcanoes?: Array<{
    name: string;
    slug: string;
    country: string;
    type: string;
  }>;
  facts?: string[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  schema_data?: any;
  page_type: string;
  url: string;
}

export interface CountryData {
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  quick_answer: {
    how_many: string;
    how_many_active: string;
    why: string;
    tallest: string;
    most_recent: string;
  };
  hero: {
    title: string;
    subtitle: string;
    volcano_count: number;
    active_count?: number;
    tallest?: {
      name: string;
      elevation_m?: number;
    };
    most_recent_eruption?: {
      year: number | string;
      volcano: string;
    };
  };
  sections: Record<string, any>;
  volcano_table?: any;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  facts?: string[];
  schema_data?: any;
}

export interface SpecialPageData {
  slug: string;
  page_type: 'special' | 'ranking';
  title: string;
  meta_title: string;
  meta_description: string;
  breadcrumbs?: Array<{
    label: string;
    path: string;
  }>;
  hero: {
    title: string;
    subtitle: string;
    stats?: Array<{
      value: string;
      label: string;
    }>;
  };
  introduction?: string;
  sections?: Record<string, {
    title: string;
    content: string;
  }>;
  quick_stats?: string[];
  key_stats?: string[];
  volcano_list?: {
    title: string;
    description: string;
    volcanoes: Array<{
      name: string;
      slug: string;
      country: string;
      last_eruption: string;
    }>;
  };
  countries?: Array<{
    name: string;
    slug: string;
    volcano_count: number;
    percentage?: string;
  }>;
  ranked_table?: {
    title: string;
    description?: string;
    headers: string[];
    rows: any[][];
  };
  charts?: Record<string, any>;
  internal_links?: string[];
  external_links?: string[];
  source_citation?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  schema_data?: any;
  url?: string;
}

export interface NavData {
  featured_volcanoes: Array<{
    title: string;
    url: string;
  }>;
  countries: Array<{
    title: string;
    url: string;
  }>;
  special_pages: Array<{
    title: string;
    url: string;
  }>;
  rankings: Array<{
    title: string;
    url: string;
  }>;
}

export interface SeoData {
  url: string;
  title: string;
  description: string;
  og_type?: string;
}

export interface HomepageData {
  total_volcanoes_covered: number;
  total_countries: number;
  map_markers: Array<{
    title: string;
    slug: string;
    lat: number;
    lon: number;
    type: string;
    elevation: string;
    country: string;
    last_eruption: string;
    status?: string;
  }>;
}

// Get all volcano data files
export async function getAllVolcanoes(): Promise<VolcanoData[]> {
  const files = fs.readdirSync(contentDirectory);
  const volcanoFiles = files.filter(file => file.startsWith('volcano-') && file.endsWith('.json'));
  
  const volcanoes = volcanoFiles.map(file => {
    const filePath = path.join(contentDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as VolcanoData;
  });
  
  return volcanoes;
}

// Get single volcano by slug
export async function getVolcanoBySlug(slug: string): Promise<VolcanoData | null> {
  try {
    const filePath = path.join(contentDirectory, `volcano-${slug}.json`);
    // Check if file exists first to avoid error logging for expected missing files
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as VolcanoData;
  } catch (error) {
    console.error(`Error loading volcano ${slug}:`, error);
    return null;
  }
}

// Get all country data files
export async function getAllCountries(): Promise<CountryData[]> {
  const files = fs.readdirSync(contentDirectory);
  const countryFiles = files.filter(file => file.startsWith('country-') && file.endsWith('.json'));
  
  const countries = countryFiles.map(file => {
    const filePath = path.join(contentDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as CountryData;
  });
  
  return countries;
}

// Get single country by slug
export async function getCountryBySlug(slug: string): Promise<CountryData | null> {
  try {
    const filePath = path.join(contentDirectory, `country-${slug}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as CountryData;
  } catch (error) {
    console.error(`Error loading country ${slug}:`, error);
    return null;
  }
}

// Get special or ranking page by slug
export async function getSpecialPage(slug: string): Promise<SpecialPageData | null> {
  try {
    // Try special page first
    let filePath = path.join(contentDirectory, `special-${slug}.json`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent) as SpecialPageData;
    }
    
    // Try ranking page
    filePath = path.join(contentDirectory, `ranking-${slug}.json`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent) as SpecialPageData;
    }
    
    return null;
  } catch (error) {
    console.error(`Error loading special page ${slug}:`, error);
    return null;
  }
}

// Get navigation data
export async function getNavData(): Promise<NavData> {
  const filePath = path.join(dataDirectory, 'volcanoatlas-nav.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as NavData;
}

// Get SEO data for a specific URL
export async function getSeoData(url: string): Promise<SeoData | null> {
  const filePath = path.join(dataDirectory, 'volcanoatlas-seo.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const seoData = JSON.parse(fileContent) as SeoData[];
  
  return seoData.find(item => item.url === url) || null;
}

// Get homepage data
export async function getHomepageData(): Promise<HomepageData> {
  const filePath = path.join(dataDirectory, 'volcanoatlas-homepage.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as HomepageData;
}

// Get all special pages slugs (for static params)
export async function getAllSpecialPageSlugs(): Promise<string[]> {
  const files = fs.readdirSync(contentDirectory);
  const specialFiles = files.filter(file => 
    (file.startsWith('special-') || file.startsWith('ranking-')) && file.endsWith('.json')
  );
  
  return specialFiles.map(file => {
    const prefix = file.startsWith('special-') ? 'special-' : 'ranking-';
    return file.replace(prefix, '').replace('.json', '');
  });
}

// Get all special pages (special and ranking pages)
export async function getAllSpecialPages(): Promise<{ slug: string }[]> {
  const slugs = await getAllSpecialPageSlugs();
  return slugs.map(slug => ({ slug }));
}

// Get map markers for all volcanoes
export async function getMapMarkers(): Promise<MapMarker[]> {
  const volcanoes = await getAllVolcanoes();
  return volcanoes
    .filter(volcano => volcano.hero?.coordinates?.lat && volcano.hero?.coordinates?.lon)
    .map(volcano => ({
      title: volcano.hero.name,
      slug: `/volcano/${volcano.slug}`,
      lat: volcano.hero.coordinates.lat,
      lon: volcano.hero.coordinates.lon,
      type: volcano.hero.type,
      elevation: `${volcano.hero.elevation_m?.toLocaleString()} m`,
      country: volcano.hero.country,
      last_eruption: volcano.hero.last_eruption,
      status: volcano.hero.status,
    }));
}

export interface MapMarker {
  title: string;
  slug: string;
  lat: number;
  lon: number;
  type: string;
  elevation: string;
  country: string;
  last_eruption: string;
  status?: string;
}