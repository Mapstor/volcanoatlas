/**
 * Current alert level of a volcano in the United States, from the U.S. Geological Survey's Volcano Notification
 * Service. Only what the service states is passed on: the two levels, the day of the notice and its link.
 */

export interface UsgsStatus {
  /** NORMAL, ADVISORY, WATCH or WARNING, as the service writes it. */
  alertLevel: string;
  /** GREEN, YELLOW, ORANGE or RED. */
  colorCode: string;
  observatory: string;
  /** "November 6, 2026" (UTC day the notice was sent) */
  noticeDate: string;
  noticeUrl: string;
}

const MONITORED = 'https://volcanoes.usgs.gov/hans-public/api/volcano/getMonitoredVolcanoes';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface HansRow {
  vnum?: string;
  alert_level?: string;
  color_code?: string;
  obs_fullname?: string;
  sent_utc?: string;
  notice_url?: string;
}

export async function getUsgsStatus(volcanoNumber: number): Promise<UsgsStatus | null> {
  try {
    const response = await fetch(MONITORED, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const rows = (await response.json()) as HansRow[];
    const row = rows.find((r) => r.vnum === String(volcanoNumber));
    if (!row || !row.alert_level || !row.color_code || !row.sent_utc || !row.notice_url) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(row.sent_utc);
    if (!match || !/^https:\/\/volcanoes\.usgs\.gov\//.test(row.notice_url)) return null;
    return {
      alertLevel: row.alert_level,
      colorCode: row.color_code,
      observatory: row.obs_fullname ?? 'U.S. Geological Survey',
      noticeDate: `${MONTHS[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}`,
      noticeUrl: row.notice_url,
    };
  } catch {
    return null;
  }
}
