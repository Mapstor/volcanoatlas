import fs from 'fs';
import path from 'path';

/**
 * Access to the bundled Smithsonian Global Volcanism Program export (volcanoes.json).
 * Server-only: reads from disk.
 */

export interface GvpProps {
  Volcano_Number: number;
  Volcano_Name: string;
  Volcanic_Landform: string | null;
  Primary_Volcano_Type: string | null;
  Last_Eruption_Year: number | null;
  Country: string;
  Region: string | null;
  Subregion: string | null;
  Geological_Summary: string | null;
  Latitude: number;
  Longitude: number;
  Elevation: number | null;
  Tectonic_Setting: string | null;
  Geologic_Epoch: string | null;
  Evidence_Category: string | null;
  Major_Rock_Type: string | null;
}

export interface GvpVolcano extends GvpProps {
  /** URL slug for this volcano's basic-data page. */
  slug: string;
}

/** Lowercase, strip accents, turn every run of other characters into one hyphen. */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

let cache: { list: GvpVolcano[]; bySlug: Map<string, GvpVolcano>; byNumber: Map<number, GvpVolcano>; byLegacyName: Map<string, GvpVolcano> } | null = null;

function load() {
  if (cache) return cache;
  const raw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'volcanoes.json'), 'utf8'));
  const list: GvpVolcano[] = [];
  const bySlug = new Map<string, GvpVolcano>();
  const byNumber = new Map<number, GvpVolcano>();
  const byLegacyName = new Map<string, GvpVolcano>();

  for (const feature of raw.features as Array<{ properties: GvpProps }>) {
    const props = feature.properties;
    const base = slugify(props.Volcano_Name);
    // A few names repeat (e.g. "Unnamed", "Sumbing"). The first keeps the plain slug,
    // later ones get the volcano number so every volcano has exactly one URL.
    const slug = base && !bySlug.has(base) ? base : `${base || 'volcano'}-${props.Volcano_Number}`;
    const volcano: GvpVolcano = { ...props, slug };
    list.push(volcano);
    bySlug.set(slug, volcano);
    byNumber.set(props.Volcano_Number, volcano);
    const legacy = props.Volcano_Name.toLowerCase();
    if (!byLegacyName.has(legacy)) byLegacyName.set(legacy, volcano);
  }

  cache = { list, bySlug, byNumber, byLegacyName };
  return cache;
}

export function getAllGvp(): GvpVolcano[] {
  return load().list;
}

export function getGvpBySlug(slug: string): GvpVolcano | null {
  const { bySlug, byNumber } = load();
  const direct = bySlug.get(slug);
  if (direct) return direct;
  // "<name>-<volcano number>" form, used when two volcanoes share a name.
  const match = /^(.*)-(\d{5,7})$/.exec(slug);
  if (match) {
    const byNum = byNumber.get(Number(match[2]));
    if (byNum && (slugify(byNum.Volcano_Name) || 'volcano') === match[1]) return byNum;
  }
  return null;
}

export function getGvpByNumber(volcanoNumber: number | string | null | undefined): GvpVolcano | null {
  if (volcanoNumber === null || volcanoNumber === undefined || volcanoNumber === '') return null;
  return load().byNumber.get(Number(volcanoNumber)) ?? null;
}

/** Old URL scheme: lowercase name with spaces turned into hyphens. Used only to redirect. */
export function getGvpByLegacySlug(slug: string): GvpVolcano | null {
  return load().byLegacyName.get(slug.replace(/-/g, ' ')) ?? null;
}

export function getGvpByName(name: string): GvpVolcano | null {
  const { byLegacyName, bySlug } = load();
  return byLegacyName.get(name.toLowerCase()) ?? bySlug.get(slugify(name)) ?? null;
}

/**
 * Volcanoes for a country page.
 * - "own": the database lists exactly this country.
 * - "shared": the volcano sits on a border ("Chile-Argentina" counts for both).
 * The country files do not all count the same way, so the caller picks the set
 * that matches the count published on that page.
 */
export function getGvpByCountry(countryName: string): { own: GvpVolcano[]; shared: GvpVolcano[] } {
  const wanted = slugify(countryName.replace(/^the\s+/i, ''));
  const own: GvpVolcano[] = [];
  const shared: GvpVolcano[] = [];
  for (const v of load().list) {
    if (slugify(v.Country) === wanted) {
      own.push(v);
    } else if (!v.Country.includes(' - ') && v.Country.split('-').some((part) => slugify(part) === wanted)) {
      shared.push(v); // disputed-territory labels (" - claimed by ...") stay with neither page
    }
  }
  return { own, shared };
}

/** Honest three-way grouping by the year of the last known eruption. */
export type EruptionGroup = 'Erupted since 2000' | 'Erupted 1900–1999' | 'Before 1900 or undated';

export function eruptionGroup(year: number | null | undefined): EruptionGroup {
  if (typeof year === 'number' && year >= 2000) return 'Erupted since 2000';
  if (typeof year === 'number' && year >= 1900) return 'Erupted 1900–1999';
  return 'Before 1900 or undated';
}

export function formatYear(year: number | null | undefined): string {
  if (year === null || year === undefined) return 'Unknown';
  return year < 0 ? `${Math.abs(year)} BCE` : String(year);
}

export function formatElevation(meters: number | null | undefined): string {
  if (meters === null || meters === undefined) return 'Unknown';
  const feet = Math.round(meters * 3.28084);
  return `${meters.toLocaleString('en-US')} m (${feet.toLocaleString('en-US')} ft)`;
}
