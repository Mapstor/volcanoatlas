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
  ey: number | null;
  em: number;
  ed: number;
  emod: string | null;
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
}

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

export const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MON = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export type Ymd = [number, number, number];
export const longDate = ([y, m, d]: Ymd) => `${MONTHS[m]} ${d}, ${y}`;
export const shortDate = ([y, m, d]: Ymd) => `${MON[m]} ${d}, ${y}`;
export const isoToYmd = (iso: string): Ymd => [Number(iso.slice(0, 4)), Number(iso.slice(5, 7)), Number(iso.slice(8, 10))];
const utc = ([y, m, d]: Ymd) => Date.UTC(y, m - 1, d);
const DAY = 86_400_000;
export const daysBetween = (a: Ymd, b: Ymd) => Math.round((utc(b) - utc(a)) / DAY);
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
export function spanText(from: Ymd, to: Ymd): string {
  const days = daysBetween(from, to);
  if (days <= 1) return '1 day';
  if (days < 60) return `${days} days`;
  let months = (to[0] - from[0]) * 12 + (to[1] - from[1]);
  let rest = to[2] - from[2];
  if (rest < 0) {
    months -= 1;
    rest += 30;
  }
  if (rest >= 16) months += 1;
  if (months === 12) return '1 year';
  if (months < 24) return `${months} months`;
  const years = Math.floor(months / 12);
  const left = months % 12;
  return left ? `${years} years ${left} month${left === 1 ? '' : 's'}` : `${years} years`;
}

export interface PeriodRow {
  eruption: Eruption;
  start: Ymd;
  end: Ymd;
  /** The record only says the eruption began before this year. */
  openStart: boolean;
  continuing: boolean;
  length: string;
  /** Pause between this eruption's end and the next one's start, if there was one. */
  pauseAfter: string | null;
}

/** One eruption placed on a time axis. An eruption without a full end date is a point at its start. */
export interface Span {
  eruption: Eruption;
  start: Ymd;
  end: Ymd;
  openStart: boolean;
  continuing: boolean;
}

export interface EruptionStats {
  all: Eruption[];
  /** Every confirmed eruption with a start year, oldest first, for drawing. */
  spans: Span[];
  /** Start and end of the newest eruption when it is over and both dates are known to the day. */
  lastStart: Ymd | null;
  lastEnd: Ymd | null;
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
  pauses: { from: Ymd; to: Ymd; days: number; text: string }[];
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
  const periods: PeriodRow[] = dated.map((e) => {
    const openStart = e.smod === '<';
    const start: Ymd = [e.sy, e.sm || 1, e.sd || 1];
    const end: Ymd = [e.ey as number, e.em, e.ed];
    const isCurrent = e.emod === '>';
    // a continuing eruption is counted in whole years, like the number at the top of the page
    const length = openStart
      ? `at least ${end[0] - start[0]} years`
      : isCurrent
        ? `${durationText(Math.max(1, daysBetween(start, end)))} so far`
        : daysBetween(start, end) < 1
          ? '1 day'
          : spanText(start, end);
    return { eruption: e, start, end, openStart, continuing: isCurrent, length, pauseAfter: null };
  });
  const pauses: EruptionStats['pauses'] = [];
  periods.forEach((row, i) => {
    const next = periods[i + 1];
    if (!next) return;
    const days = daysBetween(row.end, next.start);
    if (days > 0) {
      const text = spanText(row.end, next.start);
      row.pauseAfter = text;
      pauses.push({ from: row.end, to: next.start, days, text });
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
    return { eruption: e, start, end: complete ? [e.ey as number, e.em, e.ed] : start, openStart: e.smod === '<', continuing: e.emod === '>' };
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

/** How the Smithsonian's record gives an eruption's start. */
export function startLabel(e: Eruption): string {
  if (e.sm && e.sd) return shortDate([e.sy, e.sm, e.sd]);
  const era = e.sy < 0 ? `${-e.sy} BCE` : `${e.sy} CE`;
  if (e.smod === '<') return `before ${e.sy}`;
  if (e.smod === '?') return `about ${era}`;
  return e.sunc ? `${era} ± ${e.sunc} years` : era;
}

export function endLabel(e: Eruption): string {
  if (e.emod === '>') return 'continuing';
  if (e.ey && e.em && e.ed) return shortDate([e.ey, e.em, e.ed]);
  return 'not recorded';
}

export const METHOD_LABEL: Record<string, string> = {
  'Correlation: Magnetism': 'rock magnetism',
  'Isotopic: 14C (uncalibrated)': 'radiocarbon',
  'Isotopic: 14C (calibrated)': 'radiocarbon',
  'Observations: Reported': 'written reports',
};

export const feet = (meters: number) => meters * 3.28084;
export const fmt = (value: number) => value.toLocaleString('en-US');
export const roundTo = (value: number, step: number) => Math.round(value / step) * step;
