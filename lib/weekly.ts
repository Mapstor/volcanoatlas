import { getSmithsonianWeeklyActivity } from './volcanoAPIs';
import { MONTHS } from './eruptions';

/**
 * One volcano's entry in the Smithsonian / USGS Weekly Volcanic Activity Report, read from the report's feed.
 * Only facts the feed states are passed on: the week, the report's heading for the entry, its link and the
 * date the feed was published. The report text itself stays on the Smithsonian's site.
 */

export interface WeeklyEntry {
  /** "October 8–14, 2026" */
  period: string;
  /** "October 8–14" */
  periodShort: string;
  /** The report's heading for the entry in lower case, e.g. "continuing eruptive activity". */
  section: string | null;
  link: string;
  /** "October 15, 2026" */
  published: string;
  /** The feed has not been updated for more than STALE_AFTER_DAYS. */
  stale: boolean;
}

export const STALE_AFTER_DAYS = 10;

/** "8 October-14 October 2026" -> "October 8–14, 2026" (the feed's day-first ranges, in US order). */
export function formatPeriod(range: string): { long: string; short: string } {
  const match = /^(\d{1,2}) ([A-Za-z]+)(?: (\d{4}))?\s*-\s*(\d{1,2}) ([A-Za-z]+) (\d{4})$/.exec(range.trim());
  if (!match || !MONTHS.includes(match[2]) || !MONTHS.includes(match[5])) {
    const plain = range.replace(/\s*-\s*/g, '–');
    return { long: plain, short: plain };
  }
  const [, d1, m1, y1, d2, m2, y2] = match;
  if (y1 && y1 !== y2) {
    const both = `${m1} ${d1}, ${y1} – ${m2} ${d2}, ${y2}`;
    return { long: both, short: both };
  }
  const short = m1 === m2 ? `${m1} ${d1}–${d2}` : `${m1} ${d1} – ${m2} ${d2}`;
  return { long: `${short}, ${y2}`, short };
}

export async function getWeeklyEntry(volcanoNumber: number): Promise<WeeklyEntry | null> {
  const reports = await getSmithsonianWeeklyActivity();
  const report = reports.find((r) => r.volcano_number === volcanoNumber);
  if (!report) return null;
  const times = reports.map((r) => Date.parse(r.pubDate)).filter((t) => !Number.isNaN(t));
  if (times.length === 0) return null;
  const last = new Date(Math.max(...times));
  const period = formatPeriod(report.date_range);
  return {
    period: period.long,
    periodShort: period.short,
    section: report.section ? report.section.toLowerCase() : null,
    link: report.permalink ?? report.link,
    published: `${MONTHS[last.getUTCMonth() + 1]} ${last.getUTCDate()}, ${last.getUTCFullYear()}`,
    stale: (Date.now() - last.getTime()) / 86_400_000 > STALE_AFTER_DAYS,
  };
}
