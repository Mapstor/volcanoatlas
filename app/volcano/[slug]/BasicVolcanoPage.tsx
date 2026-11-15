import Link from 'next/link';
import VolcanoLocationMap from '@/components/VolcanoLocationMap';
import JsonLd, { breadcrumbLd } from '@/components/JsonLd';
import { formatElevation, formatYear, type GvpVolcano } from '@/lib/gvp';
import { countryHref } from '@/lib/routes';
import { GVP_EXPORT_DATE, gvpVolcanoUrl } from '@/lib/site';

/**
 * Page for a volcano that has no written profile yet. It shows the Smithsonian
 * database record and nothing else: no derived risk levels, no alert status,
 * no estimated eruption dates. Fields the database leaves empty are left out.
 */
export default function BasicVolcanoPage({ volcano, slug }: { volcano: GvpVolcano; slug: string }) {
  const type = (volcano.Primary_Volcano_Type || 'Volcano').replace(/\((es|s)\)/g, '').trim();
  const countryLink = countryHref(volcano.Country);
  const gvpUrl = gvpVolcanoUrl(volcano.Volcano_Number);
  const hasCoords = typeof volcano.Latitude === 'number' && typeof volcano.Longitude === 'number';

  const facts: Array<{ label: string; value: string }> = [];
  const push = (label: string, value: string | null | undefined) => {
    if (value && value.trim()) facts.push({ label, value: value.trim() });
  };
  push('Type', type);
  push('Elevation', volcano.Elevation !== null && volcano.Elevation !== undefined ? formatElevation(volcano.Elevation) : null);
  push('Country', volcano.Country);
  push('Region', volcano.Subregion || volcano.Region);
  if (hasCoords) push('Coordinates', `${volcano.Latitude.toFixed(3)}°, ${volcano.Longitude.toFixed(3)}°`);
  push('Last known eruption', volcano.Last_Eruption_Year !== null && volcano.Last_Eruption_Year !== undefined ? formatYear(volcano.Last_Eruption_Year) : 'Unknown');
  push('Evidence of activity', volcano.Evidence_Category);
  push('Main rock type', volcano.Major_Rock_Type);
  push('Tectonic setting', volcano.Tectonic_Setting);
  push('Smithsonian volcano number', String(volcano.Volcano_Number));

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Countries', path: '/countries' },
    ...(countryLink ? [{ name: volcano.Country, path: countryLink }] : []),
    { name: volcano.Volcano_Name, path: `/volcano/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <div className="min-h-screen bg-gray-900">
        <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm mb-4" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-400">
                <li><Link href="/" className="hover:text-amber-500">Home</Link></li>
                <li className="text-gray-600" aria-hidden="true">/</li>
                <li><Link href="/countries" className="hover:text-amber-500">Countries</Link></li>
                <li className="text-gray-600" aria-hidden="true">/</li>
                <li>
                  {countryLink ? (
                    <Link href={countryLink} className="hover:text-amber-500">{volcano.Country}</Link>
                  ) : (
                    <span>{volcano.Country}</span>
                  )}
                </li>
                <li className="text-gray-600" aria-hidden="true">/</li>
                <li className="text-white" aria-current="page">{volcano.Volcano_Name}</li>
              </ol>
            </nav>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{volcano.Volcano_Name}</h1>
            <p className="text-lg text-gray-300">
              {type} in {volcano.Country}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">{volcano.Volcano_Name} key facts</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-gray-400 text-sm">{fact.label}</dt>
                      <dd className="text-white font-semibold">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {hasCoords && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Where {volcano.Volcano_Name} is</h2>
                  <div className="h-[400px] rounded-lg overflow-hidden relative z-0">
                    <VolcanoLocationMap
                      volcano={{
                        name: volcano.Volcano_Name,
                        coordinates: { lat: volcano.Latitude, lon: volcano.Longitude },
                        country: volcano.Country,
                        region: volcano.Subregion || volcano.Region || '',
                        status:
                          volcano.Last_Eruption_Year !== null && volcano.Last_Eruption_Year !== undefined
                            ? `Last known eruption: ${formatYear(volcano.Last_Eruption_Year)}`
                            : 'Last known eruption: unknown',
                        elevation_m: volcano.Elevation ?? 0,
                        type,
                      }}
                    />
                  </div>
                </div>
              )}

              {volcano.Geological_Summary && (
                <div className="bg-gray-800 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Smithsonian summary</h2>
                  <blockquote cite={gvpUrl} className="border-l-4 border-amber-500 pl-4 text-gray-300 leading-relaxed">
                    {volcano.Geological_Summary}
                  </blockquote>
                  <p className="text-sm text-gray-400 mt-3">
                    Quoted from the{' '}
                    <a href={gvpUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                      Global Volcanism Program record for {volcano.Volcano_Name}
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-3">About this page</h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  VolcanoAtlas has no written profile for {volcano.Volcano_Name} yet. Everything here comes from the
                  Smithsonian record, and empty fields in that record are left out.
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-3">Source</h2>
                <p className="text-sm text-gray-300 leading-relaxed">
                  <a href={gvpUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                    Global Volcanism Program, Smithsonian Institution
                  </a>
                  , Volcanoes of the World database. Data export of {GVP_EXPORT_DATE}.
                </p>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-3">Explore</h2>
                <ul className="space-y-3 text-sm">
                  {countryLink && (
                    <li><Link href={countryLink} className="text-amber-400 hover:text-amber-300 underline">Volcanoes in {volcano.Country}</Link></li>
                  )}
                  <li><Link href="/volcanoes" className="text-amber-400 hover:text-amber-300 underline">Volcano profiles</Link></li>
                  <li><Link href="/map" className="text-amber-400 hover:text-amber-300 underline">World volcano map</Link></li>
                  <li><Link href="/latest-eruptions" className="text-amber-400 hover:text-amber-300 underline">Latest eruption reports</Link></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
