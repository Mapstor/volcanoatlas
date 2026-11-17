import fs from 'fs';
import path from 'path';
import {
  countVolcanoesIn,
  daysBetween,
  eruptionStats,
  feet,
  fmt,
  getNoaaEvents,
  getSourceVolcano,
  longDate,
  MONTHS,
  roundTo,
  sourceDates,
  spanText,
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
  facts: {
    /**
     * Summit height from the country's own observatory, in the meters and feet it prints, with its source id and short
     * name. Used in place of the Smithsonian's figure when the two differ; the Smithsonian's stays in {gvp_summit_m}.
     */
    summit_m?: number;
    summit_ft?: number;
    summit_source?: string;
    summit_source_name?: string;
    /** Depth of the volcano's base below sea level in meters, from the source named in base_source. Left out for a volcano on land. */
    base_m?: number;
    /** Source id and short name for the base depth, shown under the key facts. */
    base_source?: string;
    base_source_name?: string;
    terrace_m?: [number, number];
    alt_top_m?: number;
    /** Eruptions are counted from this year for {n_since}. */
    count_from?: number;
  };
  /** note_weekly replaces note while the volcano is in the newest weekly report; it may use {period}. */
  big: { line: string; number: string; unit: string; note: string; note_weekly?: string };
  lede: string;
  answer: string;
  timeline: {
    from: number;
    to: number;
    marks: { year: number; label: string }[];
    caption: string;
    /** Word for the lower level of the line: "paused" (default) or "quiet". */
    low_label?: string;
    /** How many of the longest gaps get a red pencil label; all of them when left out. */
    label_gaps?: number;
    /** Red pencil note. note_at is its place along the strip (0 to 1) or "bottom" for the lower left corner. */
    note?: string;
    note_at?: number | 'bottom';
  };
  /** Zoom of the locator map; 7 (a region a few hundred miles across) when left out. */
  map_zoom?: number;
  /** kind: "cone" (island cone with its base on the sea floor) or "shield" (broad shield with the part pressed into the sea floor). */
  section: {
    kind?: 'cone' | 'shield';
    /** Red pencil note in the drawing. */
    note: string;
    caption: string;
    /** Name of the sea, written in the water. */
    sea?: string;
    /** Cone: name of a flank feature. */
    flank_label?: string;
    /** Shield: how far the volcano has pressed the sea floor down, in meters, and the summit caldera's name and depth. */
    root_m?: number;
    caldera?: string;
    caldera_depth_m?: number;
  };
  /** The table of recent eruptions: how many rows (newest), and the heading of the gap column. */
  table?: { rows?: number; gap_label?: string; calc_note?: string };
  /** Values the text relies on. The build stops when the data no longer gives them, so the sentence gets re-read. */
  expect?: Record<string, string>;
  sections: RecordSection[];
  callouts: { number: string; unit: string; text: string; source: string }[];
  /** Red pencil note above the callouts. */
  callout_note?: string;
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

/** The Smithsonian's short type names, as a reader would say them. */
const TYPE_LABEL: Record<string, string> = { Shield: 'Shield volcano', Complex: 'Complex volcano', Compound: 'Compound volcano', Submarine: 'Submarine volcano' };

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
  /** Summit height the page prints: the observatory's when the profile gives one, otherwise the Smithsonian's. */
  summit: { m: number; ft: number } | null;
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
  // the last eruption, when the volcano is not erupting, and the time since. "Today" is the day the page is rendered.
  if (!stats.current && stats.lastStart && stats.lastEnd) {
    const now = new Date();
    const today: Ymd = [now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate()];
    const sameYear = stats.lastStart[0] === stats.lastEnd[0];
    set('last_start', sameYear ? `${MONTHS[stats.lastStart[1]]} ${stats.lastStart[2]}` : longDate(stats.lastStart));
    set('last_end', longDate(stats.lastEnd));
    set('last_end_short', `${MON[stats.lastEnd[1]]} ${stats.lastEnd[2]}, ${stats.lastEnd[0]}`);
    set('last_year', stats.lastEnd[0]);
    set('last_length', spanText(stats.lastStart, stats.lastEnd));
    const days = daysBetween(stats.lastEnd, today);
    set('quiet_span', spanText(stats.lastEnd, today));
    const years = Math.floor(days / 365.2425);
    if (years >= 2) {
      set('quiet_number', years);
      set('quiet_unit', 'years');
    } else {
      const months = Math.max(1, Math.floor(days / 30.44));
      set('quiet_number', months);
      set('quiet_unit', months === 1 ? 'month' : 'months');
    }
  }
  if (profile.facts.count_from) {
    set('since_year', profile.facts.count_from);
    set('n_since', stats.all.filter((e) => e.sy >= (profile.facts.count_from as number)).length);
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
  if (stats.pauses.length) {
    const longest = stats.pauses.reduce((x, y) => (y.days > x.days ? y : x));
    set('longest_gap_years', Math.floor(longest.days / 365.2425));
    set('longest_gap_from_year', longest.from[0]);
    set('longest_gap_to_year', longest.to[0]);
  }

  // heights
  const own = profile.facts.summit_m !== undefined && profile.facts.summit_ft !== undefined;
  if (own !== (profile.facts.summit_source !== undefined)) throw new Error(`record profile ${profile.slug}: summit_m, summit_ft and summit_source go together`);
  const summit: RecordData['summit'] = own
    ? { m: profile.facts.summit_m as number, ft: profile.facts.summit_ft as number }
    : volcano.elevation !== null
      ? { m: volcano.elevation, ft: Math.round(feet(volcano.elevation)) }
      : null;
  if (volcano.elevation !== null) set('gvp_summit_m', fmt(volcano.elevation));
  if (profile.section.root_m !== undefined) {
    set('root_m', fmt(profile.section.root_m));
    set('root_ft', fmt(roundTo(feet(profile.section.root_m), 50)));
  }
  if (summit) {
    set('summit_m', fmt(summit.m));
    set('summit_ft', fmt(summit.ft));
    if (profile.facts.base_m !== undefined) {
      const total = summit.m + profile.facts.base_m;
      set('base_m', fmt(profile.facts.base_m));
      set('base_ft', fmt(roundTo(feet(profile.facts.base_m), 100)));
      set('total_exact_m', fmt(total));
      set('total_m', fmt(roundTo(total, 100)));
      set('total_ft', fmt(roundTo(feet(total), 100)));
    }
    if (profile.facts.terrace_m) {
      set('terr_m0', profile.facts.terrace_m[0]);
      set('terr_m1', profile.facts.terrace_m[1]);
      set('terr_ft0', fmt(roundTo(feet(profile.facts.terrace_m[0]), 100)));
      set('terr_ft1', fmt(roundTo(feet(profile.facts.terrace_m[1]), 10)));
    }
    if (profile.facts.alt_top_m !== undefined) {
      set('alt_top_m', profile.facts.alt_top_m);
      set('top_diff', profile.facts.alt_top_m - summit.m);
    }
  }

  // the eruption record
  set('n_all', stats.all.length);
  if (stats.all.length) set('oldest', stats.all[0].sy < 0 ? `${-stats.all[0].sy} BCE` : `${stats.all[0].sy} CE`);
  set('n_mag', stats.methods['Correlation: Magnetism'] ?? 0);
  const radiocarbon = (stats.methods['Isotopic: 14C (uncalibrated)'] ?? 0) + (stats.methods['Isotopic: 14C (calibrated)'] ?? 0);
  set('n_rc', radiocarbon);
  set('n_rc_word', word(radiocarbon));
  set('n_vei0', stats.all.filter((e) => e.vei === 0).length);
  set('n_written', stats.methods['Observations: Reported'] ?? 0);
  set('max_vei', stats.maxVei);
  if (volcano.rock) set('rock', volcano.rock.toLowerCase().replace(/\s*\/\s*/g, ' to '));
  if (volcano.type) {
    const type = volcano.type.replace(/\((es|s)\)/g, '').trim();
    set('type', TYPE_LABEL[type] ?? type);
  }

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

  // typed sentences that lean on a value: stop the build when the data moves away from it
  for (const [key, value] of Object.entries(profile.expect ?? {})) {
    if (ctx[key] !== value) throw new Error(`record profile ${profile.slug}: the text expects {${key}} = "${value}", the data gives "${ctx[key]}". Re-read the sentences that use it.`);
  }

  return { profile, volcano, stats, noaa, ctx, retrieved: dates.retrieved, summit };
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
