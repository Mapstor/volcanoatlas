import fs from 'fs';
import path from 'path';
import {
  countVolcanoesIn,
  eruptionStats,
  feet,
  fmt,
  getNoaaEvents,
  getSourceVolcano,
  longDate,
  MONTHS,
  roundTo,
  sourceDates,
  type EruptionStats,
  type NoaaEvent,
  type SourceVolcano,
  type Ymd,
} from './eruptions';
import { resolveInternalPath, volcanoHrefByNumber } from './routes';

/**
 * Rebuilt volcano profiles ("record pages"): text in data/profiles/<slug>.json, numbers from data/sources/.
 * The text carries {tokens}; every token is filled here from the source data. An unknown token stops the build,
 * so a page can never ship with a blank or hand-typed figure.
 */

export interface RecordSection {
  id: string;
  h: string;
  paras: string[];
  aside?: 'callouts' | 'keyfacts';
  table?: 'periods' | 'noaa' | 'record';
  note?: string;
  map?: boolean;
}

export interface RecordProfile {
  slug: string;
  volcano_number: number;
  name: string;
  country: string;
  title: string;
  description: string;
  h1: string;
  facts: { base_m: number; terrace_m: [number, number]; alt_top_m: number };
  big: { line: string; number: string; unit: string; note: string };
  lede: string;
  answer: string;
  timeline: { from: number; to: number; marks: { year: number; label: string }[]; caption: string };
  /** Zoom of the locator map; 7 (a region a few hundred miles across) when left out. */
  map_zoom?: number;
  section: { note: string; caption: string };
  sections: RecordSection[];
  callouts: { number: string; unit: string; text: string }[];
  faq_h: string;
  faq: [string, string][];
  sources: { id: string; publisher: string; title: string; url: string }[];
  calc: string[];
  /** Day the non-dataset sources (observatory and agency pages) were read, YYYY-MM-DD. */
  observatory_read: string;
  /** Day the author read and approved this page, YYYY-MM-DD. Null until he has: no byline is shown before that. */
  reviewed: string | null;
}

const DIR = path.join(process.cwd(), 'data', 'profiles');
const cache = new Map<string, RecordProfile | null>();

export function getRecordSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
}

export function getRecordProfile(slug: string): RecordProfile | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  if (!cache.has(slug)) {
    const file = path.join(DIR, `${slug}.json`);
    cache.set(slug, fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as RecordProfile) : null);
  }
  return cache.get(slug) ?? null;
}

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const word = (n: number) => WORDS[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const MON = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function noaaDate(e: NoaaEvent, long = false): string {
  if (e.m && e.d) return long ? longDate([e.y, e.m, e.d]) : `${MON[e.m]} ${e.d}, ${e.y}`;
  if (e.m) return `${long ? MONTHS[e.m] : MON[e.m]} ${e.y}`;
  return String(e.y);
}

function listText(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export interface RecordData {
  profile: RecordProfile;
  volcano: SourceVolcano;
  stats: EruptionStats;
  noaa: NoaaEvent[];
  ctx: Record<string, string>;
  retrieved: Ymd;
}

export function buildRecordData(profile: RecordProfile): RecordData {
  const volcano = getSourceVolcano(profile.volcano_number);
  if (!volcano) throw new Error(`record profile ${profile.slug}: volcano ${profile.volcano_number} is not in the Smithsonian list`);
  const stats = eruptionStats(profile.volcano_number);
  const noaa = getNoaaEvents(profile.volcano_number);
  const dates = sourceDates();
  const ctx: Record<string, string> = {};
  const set = (key: string, value: string | number | null | undefined) => {
    if (value !== null && value !== undefined && value !== '') ctx[key] = String(value);
  };

  // current eruption and its place among continuing ones
  if (stats.currentStart && stats.currentLast) {
    set('cur_start', longDate(stats.currentStart));
    set('cur_start_year', stats.currentStart[0]);
    set('cur_last', longDate(stats.currentLast));
    set('cur_years', stats.currentYears);
    set('n_cont', stats.continuingCount);
    set('older_count_word', word(stats.olderContinuing.length));
    set(
      'older',
      listText(
        stats.olderContinuing.map((o) => {
          const v = getSourceVolcano(o.volcanoNumber);
          if (!v) throw new Error(`continuing eruption at ${o.volcanoNumber}: volcano not in the list`);
          const href = volcanoHrefByNumber(o.volcanoNumber);
          return `${href ? `[${v.name}](${href})` : v.name} in ${v.country} (${o.approximate ? 'around ' : ''}${o.year})`;
        }),
      ),
    );
  }
  // pauses and share of time in eruption
  if (stats.countedFrom) {
    set('n_pauses_word', word(stats.pauses.length));
    set('pause_years', stats.pauseYears.toFixed(1));
    set('span_years', Math.ceil(stats.spanYears));
    set('share', stats.sharePercent.toFixed(0));
    set('counted_from', longDate(stats.countedFrom));
    set('counted_year', stats.countedFrom[0]);
    set('counted_month_year', `${MONTHS[stats.countedFrom[1]]} ${stats.countedFrom[0]}`);
  }
  if (stats.periods.length && stats.periods[0].openStart) set('open_before', stats.periods[0].start[0]);

  // heights
  if (volcano.elevation !== null) {
    const total = volcano.elevation + profile.facts.base_m;
    set('summit_m', fmt(volcano.elevation));
    set('summit_ft', fmt(Math.round(feet(volcano.elevation))));
    set('base_m', fmt(profile.facts.base_m));
    set('base_ft', fmt(roundTo(feet(profile.facts.base_m), 100)));
    set('total_exact_m', fmt(total));
    set('total_m', fmt(roundTo(total, 100)));
    set('total_ft', fmt(roundTo(feet(total), 100)));
    set('terr_m0', profile.facts.terrace_m[0]);
    set('terr_m1', profile.facts.terrace_m[1]);
    set('terr_ft0', fmt(roundTo(feet(profile.facts.terrace_m[0]), 100)));
    set('terr_ft1', fmt(roundTo(feet(profile.facts.terrace_m[1]), 10)));
    set('alt_top_m', profile.facts.alt_top_m);
    set('top_diff', profile.facts.alt_top_m - volcano.elevation);
  }

  // the eruption record
  set('n_all', stats.all.length);
  if (stats.all.length) set('oldest', stats.all[0].sy < 0 ? `${-stats.all[0].sy} BCE` : `${stats.all[0].sy} CE`);
  set('n_mag', stats.methods['Correlation: Magnetism'] ?? 0);
  set('n_rc_word', word((stats.methods['Isotopic: 14C (uncalibrated)'] ?? 0) + (stats.methods['Isotopic: 14C (calibrated)'] ?? 0)));
  set('n_written', stats.methods['Observations: Reported'] ?? 0);
  set('max_vei', stats.maxVei);
  if (volcano.rock) set('rock', volcano.rock.toLowerCase().replace(/\s*\/\s*/g, ' to '));
  if (volcano.type) set('type', volcano.type.replace(/\((es|s)\)/g, '').trim());

  // NOAA significant events
  if (noaa.length) {
    const fatal = noaa.filter((e) => e.deaths > 0);
    const tsu = noaa.filter((e) => e.tsunami);
    set('noaa_n', noaa.length);
    set('noaa_first', noaa[0].y);
    set('noaa_last', noaa[noaa.length - 1].y);
    set('noaa_fatal_count', fatal.length);
    set('noaa_fatal_word', cap(word(fatal.length)));
    set('noaa_deaths', fatal.reduce((sum, e) => sum + e.deaths, 0));
    set('noaa_tsu', tsu.length);
    if (tsu.length) set('last_tsu_date', noaaDate(tsu[tsu.length - 1], true));
    if (fatal.length) {
      const worst = fatal.reduce((a, b) => (b.deaths > a.deaths ? b : a));
      set('worst_date', noaaDate(worst, true));
      set('worst_deaths', worst.deaths);
      set('worst_injuries', worst.injuries);
      set('last_death_date', noaaDate(fatal[fatal.length - 1], true));
    }
  }

  set('coords', `${Math.abs(volcano.lat)}°${volcano.lat >= 0 ? 'N' : 'S'}, ${Math.abs(volcano.lon)}°${volcano.lon >= 0 ? 'E' : 'W'}`);
  set('n_country', countVolcanoesIn(volcano.country));
  set('gvp_version', dates.gvpVersion);
  set('gvp_version_date', `${dates.gvpVersionDate[2]} ${MON[dates.gvpVersionDate[1]]} ${dates.gvpVersionDate[0]}`);

  return { profile, volcano, stats, noaa, ctx, retrieved: dates.retrieved };
}

/** Replace {tokens}. An unknown token is a build error, never an empty string. */
export function fill(text: string, ctx: Record<string, string>): string {
  return text.replace(/\{([a-z0-9_]+)\}/g, (_, key: string) => {
    if (!(key in ctx)) throw new Error(`record page: no value for {${key}}`);
    return ctx[key];
  });
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Plain text of a content string: tokens filled, markup removed. For metadata and structured data. */
export function plain(text: string, ctx: Record<string, string>): string {
  return fill(text, ctx)
    .replace(/\[\[[a-z0-9]+\]\]/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}

/** HTML of a content string: tokens filled, **bold**, [links](url) and [[source]] references rendered. */
export function rich(text: string, ctx: Record<string, string>, sourceIds: string[]): string {
  let html = esc(fill(text, ctx));
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\[\[([a-z0-9]+)\]\]/g, (_, id: string) => {
    const n = sourceIds.indexOf(id) + 1;
    if (!n) throw new Error(`record page: unknown source [[${id}]]`);
    return `<sup class="va-ref"><a href="#va-src-${n}" aria-label="Source ${n}">${n}</a></sup>`;
  });
  // Internal links only when the target page exists (lib/routes.ts decides).
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text: string, href: string) => {
    if (!href.startsWith('/')) return `<a href="${href}" rel="noopener">${text}</a>`;
    const target = resolveInternalPath(href);
    return target ? `<a href="${target}">${text}</a>` : text;
  });
  return html;
}
