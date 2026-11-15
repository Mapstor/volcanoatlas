import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getVolcanoBySlug, getAllVolcanoes } from '@/lib/data';
import { RichText } from '@/components/RichText';
import VolcanoLocationMap from '@/components/VolcanoLocationMap';
import JsonLd, { breadcrumbLd, faqLd } from '@/components/JsonLd';
import BasicVolcanoPage from './BasicVolcanoPage';
import { getGvpByLegacySlug, getGvpBySlug } from '@/lib/gvp';
import { basicPageSlug, countryHref, profileSlugForNumber, volcanoHrefByNumber } from '@/lib/routes';
import { SITE_URL, gvpVolcanoUrl, pageMeta } from '@/lib/site';
import { parseMaxVEI } from '@/lib/textUtils';

export async function generateStaticParams() {
  const volcanoes = await getAllVolcanoes();
  return volcanoes.map((volcano) => ({
    slug: volcano.slug,
  }));
}

function cleanType(type: string | null | undefined) {
  return (type || 'Volcano').replace(/\((es|s)\)/g, '').trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const volcano = await getVolcanoBySlug(slug);

  if (volcano) {
    return pageMeta({
      title: volcano.meta_title,
      description: volcano.meta_description,
      path: `/volcano/${volcano.slug}`,
      type: 'article',
    });
  }

  const gvp = getGvpBySlug(slug);
  if (gvp && !profileSlugForNumber(gvp.Volcano_Number) && basicPageSlug(gvp) === slug) {
    const elevation = gvp.Elevation !== null && gvp.Elevation !== undefined ? ` Elevation ${gvp.Elevation.toLocaleString('en-US')} m.` : '';
    return pageMeta({
      // Nine records are simply called "Unnamed"; the record number tells them apart.
      title: `${gvp.Volcano_Name === 'Unnamed' ? `Unnamed volcano ${gvp.Volcano_Number}` : gvp.Volcano_Name}: ${cleanType(gvp.Primary_Volcano_Type).toLowerCase()} in ${gvp.Country}`,
      description: `Basic data for ${gvp.Volcano_Name}, a ${cleanType(gvp.Primary_Volcano_Type).toLowerCase()} in ${gvp.Country}.${elevation} Location map and the Smithsonian Global Volcanism Program record.`,
      path: `/volcano/${slug}`,
      // Database-only pages stay out of the index until they carry content of their own.
      noindex: true,
    });
  }

  return { title: 'Volcano not found', robots: { index: false, follow: true } };
}

export default async function VolcanoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const volcano = await getVolcanoBySlug(slug);

  // No written profile: show the database record, or send old URLs to the right place.
  if (!volcano) {
    const gvp = getGvpBySlug(slug);
    if (gvp) {
      const profile = profileSlugForNumber(gvp.Volcano_Number);
      if (profile) permanentRedirect(`/volcano/${profile}`);
      const canonicalSlug = basicPageSlug(gvp);
      if (canonicalSlug !== slug) permanentRedirect(`/volcano/${canonicalSlug}`);
      return <BasicVolcanoPage volcano={gvp} slug={slug} />;
    }

    const legacy = getGvpByLegacySlug(slug);
    const legacyHref = legacy ? volcanoHrefByNumber(legacy.Volcano_Number) : null;
    if (legacyHref && legacyHref !== `/volcano/${slug}`) permanentRedirect(legacyHref);

    notFound();
  }

  const allVolcanoes = await getAllVolcanoes();
  const relatedVolcanoes = allVolcanoes
    .filter((v) => v.hero.country === volcano.hero.country && v.slug !== volcano.slug)
    .sort((a, b) => a.hero.name.localeCompare(b.hero.name))
    .slice(0, 8);

  const facts = volcano.key_facts_box || {};
  const countryLink = countryHref(volcano.hero.country);
  // One profile (Yellowstone) is not in the Smithsonian Holocene export and has no record number.
  const rawNumber = String(facts.smithsonian_id ?? volcano.volcano_id ?? '').trim();
  const volcanoNumber = /^\d{5,7}$/.test(rawNumber) ? rawNumber : null;
  const gvpUrl = volcanoNumber ? gvpVolcanoUrl(volcanoNumber) : null;
  const coords = volcano.hero?.coordinates;
  const hasCoords = typeof coords?.lat === 'number' && typeof coords?.lon === 'number';

  const keyFacts: Array<{ label: string; value: string }> = [];
  const push = (label: string, value: unknown) => {
    if (value === null || value === undefined) return;
    const text = Array.isArray(value) ? value.join(', ') : String(value).trim();
    if (text && !/^unknown/i.test(text)) keyFacts.push({ label, value: text });
  };
  // Only values that were already published and trace to the Smithsonian record.
  const eruptionCount =
    typeof facts.total_recorded_eruptions === 'number'
      ? facts.total_recorded_eruptions
      : Number.parseInt(String(facts.total_recorded_eruptions ?? ''), 10);
  push('Type', volcano.hero.type);
  push(
    'Elevation',
    volcano.hero.elevation_m
      ? `${volcano.hero.elevation_m.toLocaleString('en-US')} m${volcano.hero.elevation_ft ? ` (${volcano.hero.elevation_ft.toLocaleString('en-US')} ft)` : ''}`
      : null
  );
  push('Last known eruption', volcano.hero.last_eruption);
  push('Recorded eruptions', Number.isFinite(eruptionCount) ? eruptionCount : null);
  push('Largest known eruption (VEI)', parseMaxVEI(facts.vei_max).display);
  push('Tectonic setting', facts.tectonic_setting?.split('/')[0].trim());
  push('Rock types', facts.rock_types);
  if (hasCoords) push('Coordinates', `${coords.lat.toFixed(3)}°, ${coords.lon.toFixed(3)}°`);
  push('Smithsonian volcano number', volcanoNumber);

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Countries', path: '/countries' },
    ...(countryLink ? [{ name: volcano.hero.country, path: countryLink }] : []),
    { name: volcano.hero.name, path: `/volcano/${volcano.slug}` },
  ];

  const placeLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${SITE_URL}/volcano/${volcano.slug}#place`,
    name: volcano.hero.name,
    description: volcano.meta_description,
    url: `${SITE_URL}/volcano/${volcano.slug}`,
    additionalType: 'https://schema.org/Volcano',
    ...(hasCoords
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: coords.lat,
            longitude: coords.lon,
            ...(volcano.hero.elevation_m ? { elevation: volcano.hero.elevation_m } : {}),
          },
        }
      : {}),
    containedInPlace: { '@type': 'Country', name: volcano.hero.country },
    ...(gvpUrl ? { sameAs: [gvpUrl] } : {}),
  };

  return (
    <>
      <JsonLd data={placeLd} />
      <JsonLd data={breadcrumbLd(crumbs)} />
      {volcano.faqs && volcano.faqs.length > 0 && <JsonLd data={faqLd(volcano.faqs)} />}

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm mb-4" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-400">
                <li><Link href="/" className="hover:text-orange-500">Home</Link></li>
                <li className="text-gray-600" aria-hidden="true">/</li>
                <li><Link href="/countries" className="hover:text-orange-500">Countries</Link></li>
                <li className="text-gray-600" aria-hidden="true">/</li>
                <li>
                  {countryLink ? (
                    <Link href={countryLink} className="hover:text-orange-500">{volcano.hero.country}</Link>
                  ) : (
                    <span>{volcano.hero.country}</span>
                  )}
                </li>
                <li className="text-gray-600" aria-hidden="true">/</li>
                <li className="text-white" aria-current="page">{volcano.hero.name}</li>
              </ol>
            </nav>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{volcano.hero.name}</h1>
            <p className="text-lg text-gray-300 mb-4">{volcano.hero.subtitle}</p>

            <dl className="flex flex-wrap gap-4 text-white mt-4">
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <dt className="text-gray-400 text-xs">Elevation</dt>
                <dd className="text-lg font-bold">
                  {volcano.hero?.elevation_m ? `${volcano.hero.elevation_m.toLocaleString('en-US')} m` : facts.elevation}
                </dd>
              </div>
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <dt className="text-gray-400 text-xs">Last eruption</dt>
                <dd className="text-lg font-bold">{volcano.hero.last_eruption}</dd>
              </div>
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <dt className="text-gray-400 text-xs">Type</dt>
                <dd className="text-lg font-bold">{volcano.hero.type}</dd>
              </div>
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <dt className="text-gray-400 text-xs">Country</dt>
                <dd className="text-lg font-bold">{volcano.hero.country}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main column */}
              <div className="lg:col-span-2 space-y-10">
                {hasCoords && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-6">Where {volcano.hero.name} is</h2>
                    <div className="h-[400px] rounded-lg overflow-hidden relative z-0">
                      <VolcanoLocationMap
                        volcano={{
                          name: volcano.hero.name,
                          coordinates: { lat: coords.lat, lon: coords.lon },
                          elevation_m: volcano.hero?.elevation_m || 0,
                          type: volcano.hero?.type,
                          country: volcano.hero?.country,
                          region: volcano.hero?.region,
                          status: volcano.hero?.last_eruption ? `Last eruption: ${volcano.hero.last_eruption}` : 'Unknown',
                        }}
                      />
                    </div>
                  </div>
                )}

                {gvpUrl && keyFacts.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-6">{volcano.hero.name} key facts</h2>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 bg-gray-800 rounded-lg p-6">
                      {keyFacts.map((fact) => (
                        <div key={fact.label}>
                          <dt className="text-gray-400 text-sm">{fact.label}</dt>
                          <dd className="text-white font-semibold">{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="text-sm text-gray-400 mt-3">
                      Source:{' '}
                      <a href={gvpUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
                        Global Volcanism Program, Smithsonian Institution
                      </a>
                      {volcano.source_citation ? `. ${volcano.source_citation}` : ''}
                    </p>
                  </div>
                )}

                {volcano.facts && Array.isArray(volcano.facts) && volcano.facts.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-6">Facts about {volcano.hero.name}</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {volcano.facts.map((fact: string, index: number) => (
                        <li key={index} className="bg-gray-800 rounded-lg p-4 text-gray-300">
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {volcano.faqs && Array.isArray(volcano.faqs) && volcano.faqs.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-6">{volcano.hero.name} questions and answers</h2>
                    <div className="space-y-4">
                      {volcano.faqs.map((faq: any, index: number) => (
                        <details key={index} className="bg-gray-800 rounded-lg overflow-hidden group">
                          <summary className="p-6 cursor-pointer flex justify-between items-center hover:bg-gray-700 transition-colors">
                            <span className="text-white font-semibold">{faq.question}</span>
                            <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="px-6 pb-6 pt-0">
                            <RichText html={faq?.answer || ''} className="text-gray-300" />
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                {relatedVolcanoes.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Other volcanoes in {volcano.hero?.country}</h2>
                    <ul className="space-y-3">
                      {relatedVolcanoes.map((related) => (
                        <li key={related.slug}>
                          <Link href={`/volcano/${related.slug}`} className="text-orange-400 hover:text-orange-300 transition-colors">
                            {related.hero.name}
                          </Link>
                          <p className="text-gray-400 text-sm">{related.hero.type}</p>
                        </li>
                      ))}
                    </ul>
                    {countryLink && (
                      <Link href={countryLink} className="inline-block mt-4 text-sm text-orange-400 hover:text-orange-300 underline">
                        All volcanoes in {volcano.hero.country}
                      </Link>
                    )}
                  </div>
                )}

                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Explore</h2>
                  <ul className="space-y-3 text-sm">
                    {countryLink && relatedVolcanoes.length === 0 && (
                      <li><Link href={countryLink} className="text-orange-400 hover:text-orange-300 underline">Volcanoes in {volcano.hero.country}</Link></li>
                    )}
                    <li><Link href="/map" className="text-orange-400 hover:text-orange-300 underline">World volcano map</Link></li>
                    <li><Link href="/latest-eruptions" className="text-orange-400 hover:text-orange-300 underline">Latest eruption reports</Link></li>
                    <li><Link href="/volcanic-explosivity-index" className="text-orange-400 hover:text-orange-300 underline">What VEI numbers mean</Link></li>
                    {gvpUrl && (
                      <li>
                        <a href={gvpUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline">
                          {volcano.hero.name} at the Global Volcanism Program
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
