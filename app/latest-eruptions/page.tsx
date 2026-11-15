import Link from 'next/link';
import { getAllRecentActivity, getAlertColorClass, getAlertLevelDescription } from '@/lib/volcanoAPIs';
import LatestEruptionsMap from '@/components/LatestEruptionsMap';
import JsonLd, { breadcrumbLd } from '@/components/JsonLd';
import { getGvpByName } from '@/lib/gvp';
import { volcanoHref } from '@/lib/routes';
import { pageMeta } from '@/lib/site';

// Rebuilt at most once an hour from the two feeds below.
export const revalidate = 3600;

export const metadata = pageMeta({
  title: 'Latest Volcanic Eruptions & Activity: Weekly Reports',
  description:
    'The latest Smithsonian / USGS Weekly Volcanic Activity Report, volcano by volcano, plus current USGS alert levels for US volcanoes.',
  path: '/latest-eruptions',
});

function utc(date: string | number | Date, withTime = true) {
  // USGS sends "YYYY-MM-DD HH:MM:SS" in UTC without a zone marker.
  const value = typeof date === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date) ? `${date.replace(' ', 'T')}Z` : date;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  if (!withTime) return day;
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
  return `${day}, ${time} UTC`;
}

// A weekly report older than this is called out on the page instead of being passed off as current.
const STALE_AFTER_DAYS = 10;

export default async function LatestEruptionsPage() {
  const { usVolcanoes, globalReports, lastUpdated } = await getAllRecentActivity();

  // The period and publication date come from the feed itself, never from today's date.
  const periodCounts = new Map<string, number>();
  for (const report of globalReports) {
    if (report.date_range) periodCounts.set(report.date_range, (periodCounts.get(report.date_range) ?? 0) + 1);
  }
  const reportPeriod = [...periodCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]?.replace(/\s*-\s*/g, '–') ?? '';
  const publishedTimes = globalReports.map((report) => new Date(report.pubDate).getTime()).filter((time) => Number.isFinite(time));
  const lastPublished = publishedTimes.length > 0 ? Math.max(...publishedTimes) : null;
  const reportAgeDays = lastPublished !== null ? (new Date(lastUpdated).getTime() - lastPublished) / 86_400_000 : null;
  const reportIsStale = reportAgeDays !== null && reportAgeDays > STALE_AFTER_DAYS;

  const mapMarkers = [
    ...usVolcanoes
      .map((volcano) => {
        const gvp = getGvpByName(volcano.volcano_name);
        if (!gvp) return null;
        return {
          title: volcano.volcano_name,
          slug: volcanoHref(volcano.volcano_name) || '',
          lat: gvp.Latitude,
          lon: gvp.Longitude,
          country: 'United States',
          elevation: '',
          type: `USGS alert level ${volcano.alert_level}`,
          last_eruption: '',
          color: '#f59e0b',
        };
      })
      .filter((marker): marker is NonNullable<typeof marker> => marker !== null),
    ...globalReports
      .filter((report) => typeof report.lat === 'number' && typeof report.lon === 'number')
      .map((report) => ({
        title: report.volcano_name,
        slug: volcanoHref(report.volcano_name) || '',
        lat: report.lat!,
        lon: report.lon!,
        country: report.country,
        elevation: '',
        type: `Weekly report, ${report.date_range}`,
        last_eruption: '',
        color: '#ef4444',
      })),
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Latest eruptions', path: '/latest-eruptions' }])} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Latest Volcanic Activity</h1>
          <p className="text-xl text-gray-300">
            {globalReports.length > 0
              ? `${globalReports.length} volcanoes are in the latest Smithsonian / USGS Weekly Volcanic Activity Report${reportPeriod ? `, which covers ${reportPeriod}` : ''}.`
              : 'The Smithsonian / USGS Weekly Volcanic Activity Report could not be loaded right now.'}{' '}
            {usVolcanoes.length > 0 ? `${usVolcanoes.length} US volcanoes are above the normal alert level.` : ''}
          </p>
          {reportIsStale && lastPublished !== null && (
            <p className="mt-4 border-l-4 border-amber-500 bg-amber-500/10 text-amber-100 px-4 py-3 rounded-r">
              The Smithsonian&apos;s weekly report feed was last updated on {utc(lastPublished, false)}. The reports below are the
              most recent ones in that feed, not this week&apos;s.
            </p>
          )}
          <p className="text-sm text-gray-400 mt-3">
            Page refreshed {utc(lastUpdated)}. It re-checks both sources at least once an hour.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Map of the latest reports</h2>
          <LatestEruptionsMap volcanoMarkers={mapMarkers} />
          <p className="text-sm text-gray-400 mt-2">
            Red markers: volcanoes in the weekly report. Amber markers: US volcanoes with a raised USGS alert level.
          </p>
        </div>

        {usVolcanoes.length > 0 && (
          <section className="mb-12 bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-2">US volcanoes above normal alert level</h2>
            <p className="text-gray-400 mb-6">
              Source:{' '}
              <a href="https://www.usgs.gov/programs/VHP/volcano-updates" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
                USGS Volcano Hazards Program
              </a>
              , volcano notification service.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {usVolcanoes.map((volcano, index) => {
                const href = volcanoHref(volcano.volcano_name);
                return (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {href ? (
                            <Link href={href} className="hover:text-orange-300 underline decoration-gray-600">{volcano.volcano_name}</Link>
                          ) : (
                            volcano.volcano_name
                          )}
                        </h3>
                        <p className="text-gray-400">{volcano.obs_fullname}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-sm font-bold border ${getAlertColorClass(volcano.color_code)}`}>
                        {volcano.color_code}
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-gray-300 mb-1">Alert level: {volcano.alert_level}</p>
                    <p className="text-sm text-gray-400 mb-4">{getAlertLevelDescription(volcano.alert_level, volcano.color_code)}</p>

                    <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-gray-400">
                      <span>Notice sent {utc(volcano.sent_utc)}</span>
                      {volcano.notice_url && (
                        <a href={volcano.notice_url} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
                          Read the USGS notice
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {globalReports.length > 0 && (
          <section className="bg-gray-800/50 rounded-xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-2">Weekly volcanic activity reports</h2>
            <p className="text-gray-400 mb-6">
              Source:{' '}
              <a href="https://volcano.si.edu/reports_weekly.cfm" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
                Smithsonian / USGS Weekly Volcanic Activity Report
              </a>
              , Global Volcanism Program. Each entry below opens with the first lines of that volcano&apos;s report.
            </p>

            <div className="space-y-6">
              {globalReports.map((report, index) => {
                const href = volcanoHref(report.volcano_name);
                return (
                  <article key={`report-${index}`} className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {href ? (
                          <Link href={href} className="hover:text-orange-300 underline decoration-gray-600">{report.volcano_name}</Link>
                        ) : (
                          report.volcano_name
                        )}
                        <span className="text-gray-400 font-normal ml-2">({report.country})</span>
                      </h3>
                      {typeof report.lat === 'number' && typeof report.lon === 'number' && (
                        <span className="text-xs text-gray-400">
                          {report.lat.toFixed(3)}°, {report.lon.toFixed(3)}°
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-orange-400 font-semibold mb-3">Report period: {report.date_range}</p>

                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {report.description.length > 300 ? report.description.substring(0, 300) + '…' : report.description}
                    </p>

                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="text-xs text-gray-400">Published {utc(report.pubDate, false)}</span>
                      {report.link && (
                        <a href={report.link} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline text-sm">
                          Read the full report at the Smithsonian
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {usVolcanoes.length === 0 && globalReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">The activity feeds could not be read just now.</p>
            <p className="text-gray-400 mt-2">
              The reports are published at{' '}
              <a href="https://volcano.si.edu/reports_weekly.cfm" className="text-orange-400 underline" target="_blank" rel="noopener noreferrer">
                volcano.si.edu
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
