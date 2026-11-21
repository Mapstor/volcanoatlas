import fs from 'fs';
import path from 'path';

/**
 * The volcano list and eruption records (Smithsonian Global Volcanism Program) and significant-event records
 * (NOAA NCEI), read from data/sources/. Server-only. Everything a rebuilt page prints about a volcano is read or
 * calculated here, from one retrieval, so a number can never be typed twice or come from two versions of the data.
 * Refresh: scripts/fetch-sources.py, then scripts/build-data.py.
 */

export interface SourceVolcano {
  name: string;
  country: string;
  region: string | null;
  type: string | null;
  elevation: number | null;
  lat: number;
  lon: number;
  rock: string | null;
  setting: string | null;
  last: number | null;
}

export interface Eruption {
  n: number;
  confirmed: boolean;
  vei: number | null;
  veiq: string | null;
  sy: number;
  sm: number;
  sd: number;
  smod: string | null;
  sunc: number | null;
  /** How sure the start day is: a modifier (?, <, >) and an uncertainty in days. 182 means only the year is known. */
  sdmod: string | null;
  sdunc: number | null;
  ey: number | null;
  em: number;
  ed: number;
  emod: string | null;
  edmod: string | null;
  edunc: number | null;
  method: string | null;
  area: string | null;
}

export interface NoaaEvent {
  id: number;
  y: number;
  m: number;
  d: number;
  vei: number | null;
  deaths: number;
  injuries: number;
  tsunami: boolean;
  /** NOAA's description of the death toll where it gives no count: 1 few, 2 some, 3 many, 4 very many. */
  dd?: number;
  /** The same for injuries. */
  injd?: number;
}

/**
 * NOAA's classes for a toll it describes without counting, in the words of its own legend
 * ("Few Deaths (~1 to 50 people)", "Some Deaths (~51 to 100 people)", "Many Deaths (~101 to 1000 people)",
 * "Very Many Deaths (~1001 or more people)").
 */
export const NOAA_TOLL: Record<number, [string, string]> = {
  1: ['few', 'about 1 to 50'],
  2: ['some', 'about 51 to 100'],
  3: ['many', 'about 101 to 1,000'],
  4: ['very many', 'about 1,001 or more'],
};

interface VolcanoFile {
  volcanoes: Record<string, SourceVolcano>;
}
interface EruptionFile {
  version: string;
  version_date: string;
  retrieved: string;
  eruptions: Record<string, Eruption[]>;
}
interface NoaaFile {
  retrieved: string;
  events: Record<string, NoaaEvent[]>;
}

let volcanoFile: VolcanoFile | null = null;
let eruptionFile: EruptionFile | null = null;
let noaaFile: NoaaFile | null = null;

function readSource<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'sources', name), 'utf8')) as T;
}
function volcanoData(): VolcanoFile {
  if (!volcanoFile) volcanoFile = readSource<VolcanoFile>('gvp-volcanoes.json');
  return volcanoFile;
}
function eruptionData(): EruptionFile {
  if (!eruptionFile) eruptionFile = readSource<EruptionFile>('gvp-eruptions.json');
  return eruptionFile;
}
function noaaData(): NoaaFile {
  if (!noaaFile) noaaFile = readSource<NoaaFile>('noaa-volcano-events.json');
  return noaaFile;
}

/** Height of the land around a volcano, worked out from NOAA's ETOPO 2022 grid by scripts/fetch-ground.py. */
export interface GroundRow {
  name: string;
  cells: number;
  sea_share: number | null;
  land_m: number | null;
  sea_floor_m: number | null;
  peak_m: number | null;
  /** The day this row was read, when it was added after the file's own retrieval date (scripts/fetch-ground.py --only). */
  retrieved?: string;
}
interface GroundFile {
  _meta: { source: string; publisher: string; doi: string; url: string; retrieved: string; method: string };
  ground: Record<string, GroundRow>;
}
let groundFile: GroundFile | null = null;
export function getGround(volcanoNumber: number | string): GroundRow | null {
  if (!groundFile) groundFile = readSource<GroundFile>('etopo-ground.json');
  return groundFile.ground[String(volcanoNumber)] ?? null;
}

export const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MON = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export type Ymd = [number, number, number];
/** The year inside a written date. A year before the common era is spelled out ("425 BCE"), never printed as a negative number. */
const yearIn = (y: number) => (y < 0 ? `${-y} BCE` : String(y));
export const longDate = ([y, m, d]: Ymd) => `${MONTHS[m]} ${d}, ${yearIn(y)}`;
export const shortDate = ([y, m, d]: Ymd) => `${MON[m]} ${d}, ${yearIn(y)}`;
export const isoToYmd = (iso: string): Ymd => [Number(iso.slice(0, 4)), Number(iso.slice(5, 7)), Number(iso.slice(8, 10))];
const utc = ([y, m, d]: Ymd) => Date.UTC(y, m - 1, d);
const DAY = 86_400_000;
export const daysBetween = (a: Ymd, b: Ymd) => Math.round((utc(b) - utc(a)) / DAY);
/** How exactly the Smithsonian gives a date: to the day, within a few days, to the month, or only to the year. */
export type Precision = 'day' | 'near' | 'month' | 'year';
export function precisionOf(uncertaintyDays: number | null | undefined): Precision {
  if (!uncertaintyDays) return 'day';
  if (uncertaintyDays <= 5) return 'near';
  if (uncertaintyDays < 100) return 'month';
  return 'year';
}
/** A date written no more exactly than the record gives it. */
export function dateText(date: Ymd, precision: Precision, long = false): string {
  if (precision === 'year') return yearIn(date[0]);
  if (precision === 'month') return `${(long ? MONTHS : MON)[date[1]]} ${yearIn(date[0])}`;
  const full = long ? longDate(date) : shortDate(date);
  return precision === 'near' ? `about ${full}` : full;
}
/** Decimal year, for placing a date on a time axis. */
export const decimalYear = ([y, m, d]: Ymd) => y + (utc([y, m, d]) - utc([y, 1, 1])) / DAY / 365.25;

export function sourceDates() {
  const e = eruptionData();
  return { gvpVersion: e.version, gvpVersionDate: isoToYmd(e.version_date), retrieved: isoToYmd(e.retrieved) };
}

export function getSourceVolcano(volcanoNumber: number | string): SourceVolcano | null {
  return volcanoData().volcanoes[String(volcanoNumber)] ?? null;
}

/** Volcanoes the Smithsonian lists under exactly this country (shared volcanoes carry both names and are not counted). */
export function countVolcanoesIn(country: string): number {
  return Object.values(volcanoData().volcanoes).filter((v) => v.country === country).length;
}

export function getEruptions(volcanoNumber: number | string): Eruption[] {
  return eruptionData().eruptions[String(volcanoNumber)] ?? [];
}

export function getNoaaEvents(volcanoNumber: number | string): NoaaEvent[] {
  return noaaData().events[String(volcanoNumber)] ?? [];
}

/** Eruptions the Smithsonian marks as continuing (a ">" on the end year), oldest start first. */
export function getContinuing(): { volcanoNumber: number; eruption: Eruption }[] {
  const out: { volcanoNumber: number; eruption: Eruption }[] = [];
  for (const [vn, rows] of Object.entries(eruptionData().eruptions)) {
    for (const eruption of rows) if (eruption.emod === '>') out.push({ volcanoNumber: Number(vn), eruption });
  }
  return out.sort((a, b) => a.eruption.sy - b.eruption.sy || a.eruption.sm - b.eruption.sm || a.eruption.sd - b.eruption.sd);
}

export function durationText(days: number): string {
  if (days <= 1) return '1 day';
  if (days < 60) return `${days} days`;
  const years = days / 365.25;
  if (years >= 2) return `${Math.round(years)} years`;
  const months = Math.round(days / 30.44);
  if (months >= 12 && Math.abs(years - Math.round(years)) < 0.12) return `${Math.round(years)} year${Math.round(years) === 1 ? '' : 's'}`;
  return `${months} months`;
}

/**
 * Time from one date to another, counted on the calendar to the nearest month: days under two months, months under two
 * years, then years and months. A gap of 38 years 7 months is never printed as "39 years".
 */
export function spanText(from: Ymd, to: Ymd, toToday = false): string {
  const days = daysBetween(from, to);
  if (days <= 1) return '1 day';
  if (days < 60) return `${days} days`;
  let months = (to[0] - from[0]) * 12 + (to[1] - from[1]);
  let rest = to[2] - from[2];
  if (rest < 0) {
    months -= 1;
    rest += 30;
  }
  // toToday: a span that runs to today counts whole months only and is never rounded up, so a table never says
  // "19 months so far" or "5 years so far" while the page's main number still says 18 months or 4 years
  if (rest >= 16 && !toToday) months += 1;
  if (months === 12) return '1 year';
  if (months < 24) return `${months} months`;
  const years = Math.floor(months / 12);
  const left = months % 12;
  return left ? `${years} years ${left} month${left === 1 ? '' : 's'}` : `${years} years`;
}

/** Time between two dates, no more exact than the less exact of them. `approx` is set when either date is not known to the day. */
export function spanBetween(from: Ymd, fromPrecision: Precision, to: Ymd, toPrecision: Precision, toToday = false): { text: string; approx: boolean } {
  if (fromPrecision === 'year' || toPrecision === 'year') {
    const years = to[0] - from[0];
    return { text: years <= 0 ? 'less than a year' : years === 1 ? '1 year' : `${years} years`, approx: true };
  }
  const loose = fromPrecision === 'month' || toPrecision === 'month';
  const days = daysBetween(from, to);
  if (loose && days < 60) {
    const months = Math.max(1, Math.round(days / 30.44));
    return { text: `${months} month${months === 1 ? '' : 's'}`, approx: true };
  }
  return { text: spanText(from, to, toToday), approx: fromPrecision !== 'day' || toPrecision !== 'day' };
}

export interface PeriodRow {
  eruption: Eruption;
  start: Ymd;
  end: Ymd;
  /** The record only says the eruption began before this year. */
  openStart: boolean;
  continuing: boolean;
  /** Start and end as text, no more exact than the record ("1857", "May 1910", "Jun 3, 1932"). */
  startText: string;
  endText: string;
  startPrecision: Precision;
  endPrecision: Precision;
  /** Length as text; "about" when a date is not known to the day, "at least" or "at most" when a date is a limit. */
  length: string;
  /** Pause between this eruption's end and the next one's start, if there was one, worded like the length. */
  pauseAfter: string | null;
}

/** One eruption placed on a time axis. An eruption without a full end date is a point at its start. */
export interface Span {
  eruption: Eruption;
  start: Ymd;
  end: Ymd;
  startPrecision: Precision;
  endPrecision: Precision;
  openStart: boolean;
  continuing: boolean;
}

export interface EruptionStats {
  all: Eruption[];
  /** Every confirmed eruption with a start year, oldest first, for drawing. */
  spans: Span[];
  /** Start and end of the newest eruption when it is over and both dates have a month and day, with how exact they are. */
  lastStart: Ymd | null;
  lastEnd: Ymd | null;
  lastStartPrecision: Precision;
  lastEndPrecision: Precision;
  /** the Smithsonian's day uncertainty on the end of the last eruption, when it states one */
  lastEndUncertaintyDays: number | null;
  /** the record puts a question mark on the end day of the last eruption and gives no range for it, so the date is printed to the day */
  lastEndQuestioned: boolean;
  /**
   * The year of the newest eruption when it is over and the record does not date both its start and its end to the day
   * (Pico de Orizaba: 1846, the year alone; Cerro Azul: a start in 1967 and no end): its end year, or its start year when no end
   * is given. Null when lastEnd is set, and for a year the record questions, limits ("before"), gives with a margin or puts
   * before the common era, where a count of years since would claim more than the record does.
   */
  lastYearOnly: number | null;
  /**
   * The newest eruption when the record gives it as a year with a margin and nothing more (Chimborazo: 550 CE ± 150 years;
   * Bamus: 1886 ± 8 years, where the list also carries a placeholder month and day of year-only precision).
   * Null when the eruption is continuing, has an end, a month the record stands by, a question mark or a limit.
   */
  lastYearMargin: { year: number; margin: number } | null;
  /**
   * The newest eruption when the record gives only its year, marks that year with a question mark and gives no margin
   * (Pululahua: "0290 ?", from radiocarbon). Printed as "about 290 CE (date uncertain)" and counted to the nearest
   * 100 years, never to the year.
   */
  lastYearQuestioned: number | null;
  current: Eruption | null;
  currentStart: Ymd | null;
  /** Date of the Smithsonian's last update of the continuing eruption. */
  currentLast: Ymd | null;
  currentYears: number | null;
  continuingCount: number;
  /** 1 = the oldest continuing eruption in the database. */
  continuingRank: number | null;
  olderContinuing: { volcanoNumber: number; year: number; approximate: boolean }[];
  /** The run of eruptions at the end of the record whose end dates are known to the day. */
  periods: PeriodRow[];
  pauses: { from: Ymd; to: Ymd; days: number; text: string; approx: boolean }[];
  pauseYears: number;
  /** First exactly dated start in `periods`; shares are counted from here. */
  countedFrom: Ymd | null;
  spanYears: number;
  sharePercent: number;
  maxVei: number | null;
  methods: Record<string, number>;
}

export function eruptionStats(volcanoNumber: number | string): EruptionStats {
  const all = getEruptions(volcanoNumber).filter((e) => e.confirmed);
  const continuing = getContinuing();
  const current = all.find((e) => e.emod === '>') ?? null;
  const currentStart: Ymd | null = current && current.sm && current.sd ? [current.sy, current.sm, current.sd] : null;
  const currentLast: Ymd | null = current && current.ey && current.em && current.ed ? [current.ey, current.em, current.ed] : null;
  const rank = current ? continuing.findIndex((c) => c.eruption.n === current.n) + 1 : null;

  // periods: walk back from the newest eruption while end dates are complete
  const dated: Eruption[] = [];
  for (let i = all.length - 1; i >= 0; i--) {
    const e = all[i];
    const complete = e.ey && e.em && e.ed && ((e.sm && e.sd) || e.smod === '<');
    if (!complete) break;
    dated.unshift(e);
  }
  const about = (span: { text: string; approx: boolean }) => (span.approx ? `about ${span.text}` : span.text);
  // A date the Smithsonian gives as a limit ("on or before", "on or after") makes a length worked out from it a limit
  // too: an eruption that ended on a day "or later" lasted at least the time to that day. Limits pulling both ways say nothing.
  const limited = (text: string, least: boolean, most: boolean) => (least === most ? text : `${least ? 'at least' : 'at most'} ${text}`);
  const periods: PeriodRow[] = dated.map((e) => {
    const openStart = e.smod === '<';
    const start: Ymd = [e.sy, e.sm || 1, e.sd || 1];
    const end: Ymd = [e.ey as number, e.em, e.ed];
    const isCurrent = e.emod === '>';
    const startPrecision = precisionOf(e.sdunc);
    const endPrecision = precisionOf(e.edunc);
    // a continuing eruption is counted in whole years, like the number at the top of the page
    const length = openStart
      ? `at least ${end[0] - start[0]} years`
      : isCurrent
        ? `${durationText(Math.max(1, daysBetween(start, end)))} so far`
        : limited(
            daysBetween(start, end) < 1 ? '1 day' : about(spanBetween(start, startPrecision, end, endPrecision)),
            e.sdmod === '<' || e.edmod === '>',
            e.sdmod === '>' || e.smod === '>' || e.edmod === '<',
          );
    return {
      eruption: e,
      start,
      end,
      openStart,
      continuing: isCurrent,
      startText: openStart ? `${start[0]} (or earlier)` : marked(dateText(start, startPrecision), e.sdmod),
      endText: isCurrent ? 'continuing' : marked(dateText(end, endPrecision), e.edmod),
      startPrecision,
      endPrecision,
      length,
      pauseAfter: null,
    };
  });
  const pauses: EruptionStats['pauses'] = [];
  periods.forEach((row, i) => {
    const next = periods[i + 1];
    if (!next) return;
    const days = daysBetween(row.end, next.start);
    if (days > 0) {
      const span = spanBetween(row.end, row.endPrecision, next.start, next.startPrecision);
      row.pauseAfter = limited(
        about(span),
        row.eruption.edmod === '<' || next.eruption.sdmod === '>' || next.eruption.smod === '>',
        row.eruption.edmod === '>' || next.eruption.sdmod === '<',
      );
      pauses.push({ from: row.end, to: next.start, days, text: span.text, approx: span.approx });
    }
  });
  const counted = periods.filter((row) => !row.openStart);
  const countedFrom = counted.length ? counted[0].start : null;
  const last = periods.length ? periods[periods.length - 1].end : null;
  let spanYears = 0;
  let sharePercent = 0;
  if (countedFrom && last) {
    const total = daysBetween(countedFrom, last) + 1;
    const active = counted.reduce((sum, row) => sum + daysBetween(row.start, row.end) + 1, 0);
    spanYears = total / 365.25;
    sharePercent = (100 * active) / total;
  }
  const spans: Span[] = all.map((e) => {
    const start: Ymd = [e.sy, e.sm || (e.smod === '<' ? 1 : 7), e.sd || 1];
    const complete = Boolean(e.ey && e.em && e.ed);
    const startPrecision: Precision = e.sm && e.sd ? precisionOf(e.sdunc) : 'year';
    return {
      eruption: e,
      start,
      end: complete ? [e.ey as number, e.em, e.ed] : start,
      startPrecision,
      endPrecision: complete ? precisionOf(e.edunc) : startPrecision,
      openStart: e.smod === '<',
      continuing: e.emod === '>',
    };
  });
  const newest = all.length ? all[all.length - 1] : null;
  const over = newest && newest.emod !== '>' && newest.sm && newest.sd && newest.ey && newest.em && newest.ed ? newest : null;

  const veis = all.map((e) => e.vei).filter((v): v is number => v !== null);
  const methods: Record<string, number> = {};
  for (const e of all) if (e.method) methods[e.method] = (methods[e.method] ?? 0) + 1;

  return {
    all,
    spans,
    lastStart: over ? [over.sy, over.sm, over.sd] : null,
    lastEnd: over ? [over.ey as number, over.em, over.ed] : null,
    lastStartPrecision: over ? precisionOf(over.sdunc) : 'day',
    lastEndPrecision: over ? precisionOf(over.edunc) : 'day',
    lastEndUncertaintyDays: over?.edunc ?? null,
    lastEndQuestioned: Boolean(over && over.edmod === '?' && precisionOf(over.edunc) === 'day'),
    lastYearOnly: newest && !over && !newest.emod && !newest.smod && newest.sy > 0 && !newest.sunc ? (newest.ey || newest.sy) : null,
    lastYearMargin: newest && !over && !newest.emod && !newest.smod && (!newest.sm || precisionOf(newest.sdunc) === 'year') && !newest.ey && newest.sunc ? { year: newest.sy, margin: newest.sunc } : null,
    lastYearQuestioned: newest && !over && !newest.emod && newest.smod === '?' && !newest.sm && !newest.ey && !newest.sunc ? newest.sy : null,
    current,
    currentStart,
    currentLast,
    currentYears: currentStart && currentLast ? Math.floor(daysBetween(currentStart, currentLast) / 365.2425) : null,
    continuingCount: continuing.length,
    continuingRank: rank || null,
    olderContinuing: rank ? continuing.slice(0, rank - 1).map((c) => ({ volcanoNumber: c.volcanoNumber, year: c.eruption.sy, approximate: Boolean(c.eruption.sunc) })) : [],
    periods,
    pauses,
    pauseYears: pauses.reduce((sum, p) => sum + p.days, 0) / 365.25,
    countedFrom,
    spanYears,
    sharePercent,
    maxVei: veis.length ? Math.max(...veis) : null,
    methods,
  };
}

/**
 * A year standing alone in the record table. The era is written where a bare number could be misread: before the common era
 * and in its first thousand years ("780 BCE", "40 CE"). From 1000 on the year is enough ("1687"), as it is in a full date.
 */
export const yearText = (year: number) => (year < 0 ? `${-year} BCE` : year < 1000 ? `${year} CE` : String(year));

/**
 * A date with the record's own doubt added in brackets after it: "(uncertain)" for a question mark, "(or earlier)" where
 * the Smithsonian writes "in or before" or "on or before" (its "<"), "(or later)" where it writes "on or after" (its ">").
 * Its own pages show the marks that way: Stromboli "1558 (in or before)", Langila "2009 Sep 16 (on or before)" and
 * "2000 Oct 16 (on or after)". "Before 1558" would leave out 1558 itself.
 */
function marked(text: string, modifier: string | null): string {
  return modifier === '?' ? `${text} (uncertain)` : modifier === '<' ? `${text} (or earlier)` : modifier === '>' ? `${text} (or later)` : text;
}

/** How the Smithsonian's record gives an eruption's start. */
export function startLabel(e: Eruption): string {
  if (e.sm && e.sd) {
    const precision = precisionOf(e.sdunc);
    // a start known only to the year is written like every other year in the table, with the margin the record gives that year
    // ("1886 ± 8 years" for the Smithsonian's "1886 Jul 2 ± 8 years ± 182 days")
    const margin = e.sunc ? ` ± ${fmt(e.sunc)} year${e.sunc === 1 ? '' : 's'}` : '';
    const text = precision === 'year' ? `${yearText(e.sy)}${margin}` : dateText([e.sy, e.sm, e.sd], precision);
    // when only the year is known, a question mark on the year is kept (El Chichón’s 1850, Kilauea’s 1820, Ambae’s 1870)
    return marked(text, e.sdmod ?? (precision === 'year' ? e.smod : null));
  }
  // a start the record gives to the month but not the day ("May 1554", and Etna's "Aug 479 BCE")
  if (e.sm) return marked(dateText([e.sy, e.sm, 1], 'month'), e.smod);
  const era = yearText(e.sy);
  // the Smithsonian's "in or before" reads "(or earlier)" ("6580 BCE (or earlier)", "1558 (or earlier)"); its "in or after", "(or later)"
  if (e.smod === '<') return `${era} (or earlier)`;
  if (e.smod === '>') return `${era} (or later)`;
  if (e.smod === '?') return `about ${era}`;
  // the margin is a number of years, so it takes a thousands separator ("± 2,500 years"); the year itself never does
  return e.sunc ? `${era} ± ${fmt(e.sunc)} year${e.sunc === 1 ? '' : 's'}` : era;
}

export function endLabel(e: Eruption): string {
  if (e.emod === '>') return 'continuing';
  if (e.ey && e.em && e.ed) {
    const precision = precisionOf(e.edunc);
    const text = precision === 'year' ? yearText(e.ey) : dateText([e.ey, e.em, e.ed], precision);
    // an end the Smithsonian gives as "on or after" a day keeps that mark ("Oct 2000 (or later)"); a continuing eruption was returned above
    return marked(text, e.edmod);
  }
  // an end the record gives only to the month or to the year is printed that far ("May 1768", "1390"), not as missing
  if (e.ey && e.em) return marked(dateText([e.ey, e.em, 1], 'month'), e.edmod ?? e.emod);
  if (e.ey) {
    // the year alone, worded like a start year: "about" for a question mark, "(or earlier)" for an upper limit
    const era = yearText(e.ey);
    return e.emod === '?' ? `about ${era}` : e.emod === '<' ? `${era} (or earlier)` : era;
  }
  return 'not recorded';
}

/** The Smithsonian's dating methods in plain words. */
export const METHOD_LABEL: Record<string, string> = {
  'Correlation: Magnetism': 'rock magnetism',
  'Correlation: Tephrochronology': 'ash layers',
  // the Smithsonian files both dug-up remains (Arenal) and what residents remembered (El Chichón) under this heading
  'Correlation: Anthropology': 'archaeology or oral accounts',
  'Isotopic: 14C (uncalibrated)': 'radiocarbon',
  'Isotopic: 14C (calibrated)': 'radiocarbon',
  'Isotopic: Ar/Ar': 'argon dating',
  'Isotopic: K/Ar': 'potassium-argon dating',
  'Isotopic: Uranium-series': 'uranium-series dating',
  'Isotopic: Cosmic Ray Exposure': 'cosmic-ray exposure dating',
  'Isotopic: Po-Pb': 'polonium-lead dating',
  'Radiogenic: Thermoluminescence': 'thermoluminescence',
  'Radiogenic: Fission track': 'fission-track dating',
  'Sidereal: Varve Count': 'lake-sediment layers',
  'Sidereal: Ice Core': 'ice cores',
  'Sidereal: Dendrochronology': 'tree rings',
  'Chem/Bio: Hydration Rind': 'hydration rinds',
  'Chem/Bio: Lichenometry': 'lichen growth',
  'Observations: Reported': 'written reports',
  'Observations: Hydrophonic': 'underwater sound recordings',
  'Observations: Seismicity': 'earthquake records',
  // "(visual)" was the list's name for it until v. 5.4.0; v. 5.4.1 writes "(visible)"
  'Observations: Satellite (visual)': 'satellite images',
  'Observations: Satellite (visible)': 'satellite images',
  'Observations: Satellite (infrared)': 'satellite heat readings',
  'Observations: Photo / Video': 'photos or video',
  'Observations: Aviation': 'pilot reports',
  Uncertain: 'uncertain',
};

export const feet = (meters: number) => meters * 3.28084;
export const fmt = (value: number) => value.toLocaleString('en-US');
export const roundTo = (value: number, step: number) => Math.round(value / step) * step;
