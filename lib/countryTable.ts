import type { VolcanoTableRow } from '@/components/VolcanoTable';
import { parseWikiLink, volcanoHref, volcanoHrefByNumber } from './routes';

/**
 * The country files store their volcano tables in several shapes (arrays with
 * different column sets, or objects). This turns all of them into one row shape
 * and resolves every volcano link against the pages that exist.
 */

const COLUMN_KEYS: Record<string, string> = {
  rank: 'rank',
  name: 'name',
  slug: 'slug',
  'elevation (m)': 'elevation',
  type: 'type',
  'last eruption': 'lastEruption',
  status: 'status',
  'evidence category': 'status',
  'eruption count': 'eruptionCount',
  'vei max': 'veiMax',
  location: 'note',
  territory: 'note',
  'border note': 'note',
};

const OBJECT_KEYS: Record<string, string> = {
  rank: 'rank',
  name: 'name',
  slug: 'slug',
  id: 'id',
  elevation_m: 'elevation',
  type: 'type',
  last_eruption: 'lastEruption',
  status: 'status',
  eruption_count: 'eruptionCount',
  vei_max: 'veiMax',
  border_note: 'note',
  territory: 'note',
  location: 'note',
};

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.replace(/,/g, '')))) {
    return Number(value.replace(/,/g, ''));
  }
  return null;
}

function toText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (!text || text.toLowerCase() === 'n/a' || text.toLowerCase() === 'null') return null;
  return text;
}

export interface NormalizedCountryTable {
  rows: VolcanoTableRow[];
  statusLabel: string;
  noteLabel: string;
  description: string | null;
}

export function normalizeCountryTable(table: any): NormalizedCountryTable | null {
  if (!table || !Array.isArray(table.rows) || table.rows.length === 0) return null;
  const columns: string[] = Array.isArray(table.columns) ? table.columns : [];
  const lower = columns.map((c) => String(c).toLowerCase().trim());

  const rows: VolcanoTableRow[] = [];
  for (const raw of table.rows) {
    const record: Record<string, unknown> = {};
    if (Array.isArray(raw)) {
      raw.forEach((value, i) => {
        const key = COLUMN_KEYS[lower[i]];
        if (key) record[key] = value;
      });
    } else if (raw && typeof raw === 'object') {
      for (const [k, value] of Object.entries(raw)) {
        const key = OBJECT_KEYS[k];
        if (key) record[key] = value;
      }
    } else {
      continue;
    }

    const parsed = parseWikiLink(String(record.name ?? ''));
    const name = parsed.text.trim();
    if (!name) continue;

    const href =
      volcanoHrefByNumber(record.id as number | undefined) ??
      volcanoHref(toText(record.slug)) ??
      volcanoHref(parsed.target) ??
      volcanoHref(name);

    rows.push({
      rank: toNumber(record.rank),
      name,
      href,
      elevation: toNumber(record.elevation),
      type: toText(record.type),
      lastEruption: toText(record.lastEruption),
      status: toText(record.status),
      eruptionCount: toNumber(record.eruptionCount),
      veiMax: toText(record.veiMax),
      note: toText(record.note),
    });
  }

  if (rows.length === 0) return null;
  return {
    rows,
    statusLabel: lower.includes('evidence category') ? 'Evidence' : 'Status',
    noteLabel: lower.includes('territory') ? 'Territory' : lower.includes('location') ? 'Location' : 'Note',
    description: toText(table.description),
  };
}
