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
  isoToYmd,
  longDate,
  MONTHS,
  roundTo,
  sourceDates,
  spanBetween,
  dateText,
  precisionOf,
  getGround,
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

/** A height the source gives: meters, the feet it prints, and the words drawn beside it. */
export interface Level {
  m: number;
  ft: number;
  label: string;
  /** shorter words for the phone drawing */
  short?: string;
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
    /**
     * Height of the land around the volcano in meters, for a volcano on land. "etopo" takes the median height of the
     * land 14 to 16 km from the summit from NOAA's grid (data/sources/etopo-ground.json); a number comes from the
     * source named in ground_source.
     */
    ground?: 'etopo' | number;
    ground_source?: string;
  };
  /** note_weekly replaces note while the volcano is in the newest weekly report and the feed is fresh; it may use {period}. */
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
  /** puts the name under, over or to the left of the map marker, for a map whose own labels sit beside the marker */
  map_label?: 'below' | 'above' | 'left';
  /**
   * kind: "cone" (island cone with its base on the sea floor), "shield" (broad shield with the part pressed into the
   * sea floor), "land" (a volcano standing on land or rising straight from the sea surface) or "caldera" (the summit
   * cut open: rim, caldera floor, a collapse pit and the lava that has refilled it).
   */
  section: {
    kind?: 'cone' | 'shield' | 'land' | 'caldera';
    /**
     * Caldera: heights above sea level in meters with the feet the source prints, each with the words drawn beside
     * it. `fills` are the tops of the lava layers that refilled the pit, oldest first; the last one is the surface.
     * `fountain` is the tallest lava fountain on record, drawn from its vent only while the eruption continues.
     */
    cut?: {
      rim: Level;
      floor: Level;
      pit: Level;
      before?: Level;
      fills: Level[];
      fountain?: Level & { vent_m: number; when?: string };
    };
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
    /** Land: an earlier, higher summit drawn as a dashed outline (meters and feet as the source prints them, and a label). */
    former?: { m: number; ft: number; label: string };
    /** Land: depth of the summit crater in meters, drawn to scale; the name written beside it. */
    crater_depth_m?: number;
    /** The same depth in feet when the source prints feet; otherwise it is converted. */
    crater_depth_ft?: number;
    /** Replaces the printed depth when the source gives it as a bound, e.g. "over 2,100 ft deep". */
    crater_depth_text?: string;
    crater?: string;
    /** Land: width of the crater as a share of the drawn base (schematic), and a lava dome on its floor, height in meters. */
    crater_share?: number;
    dome_m?: number;
    /** Land: ice or snow covers the volcano above this height in meters. */
    ice_from_m?: number;
    ice_label?: string;
    /** Land: what the bottom line is called when the volcano rises from water ("sea level" when left out). */
    baseline?: string;
    /** Land, rising from water: no waves are drawn (frozen sea). */
    still_water?: boolean;
  };
  /** The table of recent eruptions: how many rows (newest), and the heading of the gap column. */
  /** last_length replaces the calculated length of the newest eruption when a report gives it more exactly than the dates do. */
  table?: { rows?: number; gap_label?: string; calc_note?: string; last_length?: string };
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
  /**
   * For a volcano the Smithsonian does not list as erupting: one sentence, with its source, saying what the
   * observatory showed on the day it was read (`{read_date}`). The Smithsonian's eruption list can run months behind
   * a volcano (Krakatau, November 2026), so "last erupted" is never printed from the list alone. Required.
   */
  since_check?: string;
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
  // the local dev server reads the file again on every request, so an edit to a profile shows without a restart
  if (process.env.NODE_ENV !== 'production' || !cache.has(slug)) {
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
  if (e.y < 0) return `${-e.y} BCE`;
  if (e.m && e.d) return long ? longDate([e.y, e.m, e.d]) : `${MON[e.m]} ${e.d}, ${e.y}`;
  if (e.m) return `${long ? MONTHS[e.m] : MON[e.m]} ${e.y}`;
  return String(e.y);
}

/** "Stromboli’s", "Mount St. Helens’". */
export function possessive(name: string): string {
  return /s$/i.test(name) ? `${name}’` : `${name}’s`;
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
  /** Height of the land around the volcano, rounded to 50 m, and where it comes from ("etopo" or a source id). */
  ground: { m: number; from: string } | null;
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

  set('read_date', longDate(isoToYmd(profile.observatory_read)));
  if (!stats.current && !profile.since_check) {
    throw new Error(
      `record profile ${profile.slug}: the Smithsonian does not list this volcano as erupting, so the profile needs "since_check": ` +
        'what its observatory showed on the day it was read, with the source. The eruption list can run months behind.',
    );
  }
  // current eruption and its place among continuing ones
  if (stats.currentStart && stats.currentLast) {
    // the start is written no more exactly than the record gives it: "at least" when the record only has an upper
    // limit, "(date uncertain)" when the record puts a question mark on the day
    const startPrecision = precisionOf(stats.current?.sdunc);
    set('cur_start', dateText(stats.currentStart, startPrecision, true));
    set(
      'cur_since',
      `${stats.current?.sdmod === '<' ? 'at least ' : ''}${dateText(stats.currentStart, startPrecision, true)}${stats.current?.sdmod === '?' ? ' (date uncertain)' : ''}`,
    );
    set('cur_start_year', stats.currentStart[0]);
    set('cur_last', longDate(stats.currentLast));
    set('cur_years', stats.currentYears);
    // time in eruption up to the day the page is rendered, while the Smithsonian lists the eruption as continuing:
    // months until two years have passed, years after that (the same rule as the time since a last eruption)
    {
      const now = new Date();
      const days = daysBetween(stats.currentStart, [now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate()]);
      const years = Math.floor(days / 365.2425);
      const months = Math.max(1, Math.floor(days / 30.44));
      set('cur_number', years >= 2 ? years : months);
      set('cur_unit', years >= 2 ? 'years' : months === 1 ? 'month' : 'months');
    }
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
  // the eruption before the current one, or before the last one when the volcano is not erupting
  {
    const ended = stats.periods.filter((row) => !row.continuing && row.eruption.ey);
    const prev = ended[ended.length - (stats.current ? 1 : 2)];
    if (prev) {
      const e = prev.eruption;
      // "September 15 to September 20, 2024": the year is said once when both dates are exact and in the same year
      const sameYear = e.sy === e.ey && prev.startPrecision === 'day' && prev.endPrecision === 'day';
      set('prev_start', sameYear ? `${MONTHS[e.sm]} ${e.sd}` : dateText([e.sy, e.sm, e.sd], prev.startPrecision, true));
      set('prev_end', dateText([e.ey as number, e.em, e.ed], prev.endPrecision, true));
    }
  }
  // the last eruption, when the volcano is not erupting, and the time since. "Today" is the day the page is rendered.
  if (!stats.current && stats.lastStart && stats.lastEnd) {
    const now = new Date();
    const today: Ymd = [now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate()];
    const sameYear = stats.lastStart[0] === stats.lastEnd[0];
    const exact = stats.lastStartPrecision === 'day' && stats.lastEndPrecision === 'day';
    // dates are written no more exactly than the Smithsonian gives them
    set('last_start', sameYear && exact ? `${MONTHS[stats.lastStart[1]]} ${stats.lastStart[2]}` : dateText(stats.lastStart, stats.lastStartPrecision, true));
    set('last_end', dateText(stats.lastEnd, stats.lastEndPrecision, true));
    set('last_end_short', dateText(stats.lastEnd, stats.lastEndPrecision));
    // an eruption that began and ended on one day is printed as that day, not as a range
    const oneDay = exact && stats.lastStart.every((part, i) => part === stats.lastEnd![i]);
    set('last_span', oneDay ? dateText(stats.lastEnd, stats.lastEndPrecision, true) : `${ctx.last_start} to ${ctx.last_end}`);
    set('last_year', stats.lastEnd[0]);
    set('last_end_unc_days', stats.lastEndUncertaintyDays);
    const length = spanBetween(stats.lastStart, stats.lastStartPrecision, stats.lastEnd, stats.lastEndPrecision);
    set('last_length', length.approx ? `about ${length.text}` : length.text);
    const days = daysBetween(stats.lastEnd, today);
    const quiet = spanBetween(stats.lastEnd, stats.lastEndPrecision, today, 'day', true);
    set('quiet_span', quiet.approx ? `about ${quiet.text}` : quiet.text);
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
    const first = stats.periods.find((row) => !row.openStart);
    const precision = first ? first.startPrecision : 'day';
    set('counted_from', dateText(stats.countedFrom, precision, true));
    set('counted_year', stats.countedFrom[0]);
    set('counted_month_year', precision === 'year' ? String(stats.countedFrom[0]) : `${MONTHS[stats.countedFrom[1]]} ${stats.countedFrom[0]}`);
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
  let ground: RecordData['ground'] = null;
  if (profile.facts.ground === 'etopo') {
    const row = getGround(profile.volcano_number);
    if (!row || row.land_m === null) throw new Error(`record profile ${profile.slug}: no land height in etopo-ground.json`);
    ground = { m: roundTo(row.land_m, 50), from: 'etopo' };
  } else if (typeof profile.facts.ground === 'number') {
    if (!profile.facts.ground_source) throw new Error(`record profile ${profile.slug}: a typed ground height needs ground_source`);
    ground = { m: profile.facts.ground, from: profile.facts.ground_source };
  }
  if (ground && summit) {
    const rise = roundTo(summit.m - ground.m, 50);
    set('ground_m', fmt(ground.m));
    set('ground_ft', fmt(roundTo(feet(ground.m), 100)));
    set('rise_m', fmt(rise));
    set('rise_ft', fmt(roundTo(feet(rise), 100)));
    set('ring_km', 15);
    set('ring_mi', 9);
  }
  // a caldera drawing's levels, so the text prints the same numbers as the drawing
  const cut = profile.section.cut;
  if (cut) {
    const level = (key: string, l: { m: number; ft: number }) => {
      set(`${key}_m`, fmt(l.m));
      set(`${key}_ft`, fmt(l.ft));
    };
    const surface = cut.fills[cut.fills.length - 1];
    level('rim', cut.rim);
    level('cfloor', cut.floor);
    level('pit', cut.pit);
    if (cut.before) level('before', cut.before);
    cut.fills.forEach((l, i) => level(`fill${i + 1}`, l));
    if (surface) {
      level('surface', surface);
      // differences are taken in each unit from the source's own figures
      set('refill_m', fmt(surface.m - cut.pit.m));
      set('refill_ft', fmt(surface.ft - cut.pit.ft));
      if (cut.before) {
        set('short_m', fmt(cut.before.m - surface.m));
        set('short_ft', fmt(cut.before.ft - surface.ft));
      }
    }
    if (cut.before) {
      set('drop_m', fmt(cut.before.m - cut.pit.m));
      set('drop_ft', fmt(cut.before.ft - cut.pit.ft));
    }
    if (cut.fountain) level('fountain', cut.fountain);
  }
  if (profile.section.former) {
    set('former_m', fmt(profile.section.former.m));
    set('former_ft', fmt(profile.section.former.ft));
    if (summit) {
      set('lost_m', fmt(profile.section.former.m - summit.m));
      set('lost_ft', fmt(profile.section.former.ft - summit.ft));
    }
  }
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
  // the two longest eruptions in the record that have both dates, as "1823 to 1894" and whole years
  const longOnes = stats.spans
    .filter((span) => !span.continuing && !span.openStart && span.eruption.ey)
    .map((span) => ({ span, days: daysBetween(span.start, span.end) }))
    .sort((a, b) => b.days - a.days)
    .slice(0, 2);
  longOnes.forEach(({ span, days }, i) => {
    set(`long${i + 1}_span`, `${span.start[0]} to ${span.end[0]}`);
    set(`long${i + 1}_years`, Math.floor(days / 365.2425));
  });
  if (stats.all.length) set('oldest', stats.all[0].sy < 0 ? `${-stats.all[0].sy} BCE` : `${stats.all[0].sy} CE`);
  set('n_mag', stats.methods['Correlation: Magnetism'] ?? 0);
  const radiocarbon = (stats.methods['Isotopic: 14C (uncalibrated)'] ?? 0) + (stats.methods['Isotopic: 14C (calibrated)'] ?? 0);
  set('n_rc', radiocarbon);
  set('n_rc_word', word(radiocarbon));
  set('n_vei0', stats.all.filter((e) => e.vei === 0).length);
  set('n_written', stats.methods['Observations: Reported'] ?? 0);
  // eruptions someone saw (reports, photos, instruments) against those dated from the rocks afterwards
  const observed = Object.entries(stats.methods).reduce((sum, [method, n]) => sum + (method.startsWith('Observations:') ? n : 0), 0);
  set('n_observed', observed);
  set('n_dated', stats.all.length - observed);
  set('max_vei', stats.maxVei);
  if (stats.maxVei !== null && stats.maxVei !== undefined) {
    // the largest eruptions in the list: how many reach the top size, and the year of the newest of them
    const top = stats.all.filter((e) => e.vei === stats.maxVei);
    if (top.length) {
      const newest = top[top.length - 1];
      set('n_max_vei', top.length);
      set('largest_year', newest.sy < 0 ? `${-newest.sy} BCE` : String(newest.sy));
    }
    for (const size of [1, 2, 3, 4, 5, 6, 7]) set(`n_vei${size}`, stats.all.filter((e) => e.vei === size).length);
  }
  set('n_vei_none', stats.all.filter((e) => e.vei === null).length);
  set('n_other', stats.all.length - (stats.methods['Observations: Reported'] ?? 0));
  if (volcano.rock) set('rock', volcano.rock.toLowerCase().replace(/\s*\/\s*/g, ' to '));
  if (volcano.type) {
    const type = volcano.type.replace(/\((es|s)\)/g, '').trim();
    set('type', TYPE_LABEL[type] ?? type);
  }

  // NOAA significant events
  set('noaa_n', 0);
  if (noaa.length) {
    const fatal = noaa.filter((e) => e.deaths > 0);
    const tsu = noaa.filter((e) => e.tsunami);
    set('noaa_n', noaa.length);
    set('noaa_n_word', word(noaa.length));
    set('noaa_first', noaa[0].y < 0 ? `${-noaa[0].y} BCE` : noaa[0].y);
    set('noaa_last', noaa[noaa.length - 1].y);
    set('noaa_fatal_count', fatal.length);
    set('noaa_fatal_word', cap(word(fatal.length)));
    set('noaa_deaths', fatal.reduce((sum, e) => sum + e.deaths, 0));
    set('noaa_tsu', tsu.length);
    if (tsu.length) set('last_tsu_date', noaaDate(tsu[tsu.length - 1], true));
    if (fatal.length) {
      const worst = fatal.reduce((a, b) => (b.deaths > a.deaths ? b : a));
      set('worst_date', noaaDate(worst, true));
      set('worst_deaths', fmt(worst.deaths));
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

  return { profile, volcano, stats, noaa, ctx, retrieved: dates.retrieved, summit, ground };
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
