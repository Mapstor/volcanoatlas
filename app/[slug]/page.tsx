import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getSpecialPage, getAllSpecialPages, getCountryBySlug, getAllCountries } from '@/lib/data';
import RankingTable from '@/components/RankingTable';
import ContentSections from '@/components/ContentSections';
import QuickStats from '@/components/QuickStats';
import VolcanoTable from '@/components/VolcanoTable';
import MapSection from '@/components/MapSection';
import { breakUpLongParagraphs } from '@/lib/textUtils';
import { RichText } from '@/components/RichText';
import JsonLd, { breadcrumbLd, faqLd } from '@/components/JsonLd';
import { eruptionGroup, formatYear, getGvpByCountry, getGvpByName } from '@/lib/gvp';
import { countryHref, resolveInternalPath, volcanoHref, volcanoHrefByNumber } from '@/lib/routes';
import { normalizeCountryTable } from '@/lib/countryTable';
import { GVP_HOME, pageMeta } from '@/lib/site';

// Only the pages listed by generateStaticParams exist; anything else is a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const pages = await getAllSpecialPages();
  const countries = await getAllCountries();

  return [
    ...pages.map((page) => ({ slug: page.slug })),
    ...countries.map((country) => ({ slug: `volcanoes-in-${country.slug}` })),
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  if (slug.startsWith('volcanoes-in-')) {
    const country = await getCountryBySlug(slug.replace('volcanoes-in-', ''));
    if (country) {
      return pageMeta({ title: country.meta_title, description: country.meta_description, path: `/${slug}`, type: 'article' });
    }
  }

  const page = await getSpecialPage(slug);
  if (!page) {
    return { title: 'Page not found', robots: { index: false, follow: true } };
  }

  return pageMeta({ title: page.meta_title, description: page.meta_description, path: `/${slug}`, type: 'article' });
}

function SourceLine({ citation }: { citation?: string }) {
  return (
    <p className="mt-12 text-sm text-gray-400">
      Source:{' '}
      <a href={GVP_HOME} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
        Global Volcanism Program, Smithsonian Institution
      </a>
      {citation ? `. ${citation}` : ''}
    </p>
  );
}

export default async function SpecialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug.startsWith('volcanoes-in-')) {
    const country = await getCountryBySlug(slug.replace('volcanoes-in-', ''));
    if (!country) {
      notFound();
    }
    return <CountryPageContent country={country} slug={slug} />;
  }

  const page = await getSpecialPage(slug);
  if (!page) {
    notFound();
  }

  const isRankingPage = page.page_type === 'ranking';

  // Breadcrumbs: the content files use "path" or "url"; drop crumbs that lead nowhere.
  const crumbs = (page.breadcrumbs || [])
    .map((crumb) => ({ label: crumb.label, href: crumb.path || crumb.url || '' }))
    .filter((crumb) => crumb.href && resolveInternalPath(crumb.href));

  // Link maps for the ranking table, checked against existing pages.
  const volcanoLinks: Record<string, string> = {};
  const countryLinks: Record<string, string> = {};
  const mapMarkers: any[] = [];

  if (page.ranked_table?.rows && page.ranked_table?.headers) {
    const headers = page.ranked_table.headers.map((h: string) => h.toLowerCase());
    const nameIndex = headers.indexOf('volcano');
    const slugIndex = headers.indexOf('slug');
    const countryIndex = headers.indexOf('country');
    const typeIndex = headers.indexOf('type');
    const elevationIndex = headers.indexOf('elevation');
    const lastIndex = headers.indexOf('last eruption');

    for (const row of page.ranked_table.rows) {
      const name = nameIndex >= 0 ? String(row[nameIndex] ?? '') : '';
      const rowSlug = slugIndex >= 0 ? String(row[slugIndex] ?? '') : '';
      const href = volcanoHref(rowSlug) ?? volcanoHref(name);
      if (name && href) volcanoLinks[name] = href;

      const countryName = countryIndex >= 0 ? String(row[countryIndex] ?? '') : '';
      const cHref = countryHref(countryName);
      if (countryName && cHref) countryLinks[countryName] = cHref;

      if (slug === 'active-volcanoes' && name) {
        const gvp = getGvpByName(name);
        if (gvp) {
          const year = lastIndex >= 0 ? Number.parseInt(String(row[lastIndex]), 10) : NaN;
          mapMarkers.push({
            title: name,
            slug: href || '',
            lat: gvp.Latitude,
            lon: gvp.Longitude,
            type: typeIndex >= 0 ? row[typeIndex] : '',
            elevation: elevationIndex >= 0 ? row[elevationIndex] : '',
            country: countryName,
            last_eruption: lastIndex >= 0 ? String(row[lastIndex]) : '',
            status: eruptionGroup(Number.isFinite(year) ? year : gvp.Last_Eruption_Year),
          });
        }
      }
    }
  }

  const jsonLdCrumbs = [{ name: 'Home', path: '/' }, { name: page.hero.title, path: `/${slug}` }];

  return (
    <>
      <JsonLd data={breadcrumbLd(jsonLdCrumbs)} />
      {page.faqs && page.faqs.length > 0 && <JsonLd data={faqLd(page.faqs)} />}

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-14 md:py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {crumbs.length > 0 && (
              <nav className="text-sm mb-6" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-400">
                  {crumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {index > 0 && <span className="text-gray-600" aria-hidden="true">/</span>}
                      {index === crumbs.length - 1 ? (
                        <span className="text-white" aria-current="page">{crumb.label}</span>
                      ) : (
                        <Link href={crumb.href} className="hover:text-amber-500">
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{page.hero.title}</h1>
              <p className="text-2xl text-amber-500 mb-6">{page.hero.subtitle}</p>

              {page.hero.stats && page.hero.stats.length > 0 && (
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                  {page.hero.stats.map((stat, index) => (
                    <div key={index} className="flex flex-col-reverse text-center">
                      <dt className="text-sm text-gray-400 mt-2">{stat.label}</dt>
                      <dd className="text-4xl font-bold text-amber-500">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {page.introduction && (
              <div className="prose prose-lg prose-invert max-w-none mb-12">
                <RichText html={breakUpLongParagraphs(page.introduction, 3)} className="text-gray-300 leading-relaxed space-y-4" />
              </div>
            )}

            {slug === 'active-volcanoes' && mapMarkers.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                  Map of volcanoes that have erupted since 2020
                </h2>
                <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#1a1a1a]">
                  <MapSection markers={mapMarkers} heightClass="h-[420px] md:h-[500px]" />
                </div>
              </section>
            )}

            {isRankingPage && page.ranked_table && (
              <RankingTable
                title={page.ranked_table.title}
                description={page.ranked_table.description}
                headers={page.ranked_table.headers}
                rows={page.ranked_table.rows}
                volcanoLinks={volcanoLinks}
                countryLinks={countryLinks}
              />
            )}

            {page.sections && <ContentSections sections={page.sections} />}

            {page.quick_stats && page.quick_stats.length > 0 && (
              <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-lg p-6 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                  Quick Facts
                </h2>
                <ul className="space-y-3">
                  {page.quick_stats.map((stat, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-500 mr-2" aria-hidden="true">•</span>
                      <span className="text-gray-300">{stat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {page.key_stats && page.key_stats.length > 0 && (
              <div className="bg-[#1a1a1a] rounded-lg p-6 mb-12 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                  Key Statistics
                </h2>
                <ul className="grid md:grid-cols-2 gap-4">
                  {page.key_stats.map((stat, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-500 mr-2" aria-hidden="true">•</span>
                      <span className="text-gray-300">{stat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {page.volcano_list && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                  {page.volcano_list.title}
                </h2>
                <p className="text-gray-400 mb-6">{page.volcano_list.description}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {page.volcano_list.volcanoes.map((volcano, index) => {
                    const href = volcanoHref(volcano.slug) ?? volcanoHref(volcano.name);
                    const body = (
                      <>
                        <h3 className="font-semibold text-amber-500 mb-1">{volcano.name}</h3>
                        <p className="text-sm text-gray-400">{volcano.country}</p>
                        <p className="text-xs text-gray-500 mt-1">{volcano.last_eruption}</p>
                      </>
                    );
                    return href ? (
                      <Link key={index} href={href} className="block p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] hover:border-amber-500/50 border border-transparent transition-all">
                        {body}
                      </Link>
                    ) : (
                      <div key={index} className="block p-4 bg-[#1a1a1a] rounded-lg border border-transparent">{body}</div>
                    );
                  })}
                </div>
              </div>
            )}

            {page.countries && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                  Countries in the Ring of Fire
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {page.countries.map((country, index) => {
                    const href = countryHref(country.slug) ?? countryHref(country.name);
                    const body = (
                      <>
                        <h3 className="font-semibold text-amber-500 mb-1">{country.name}</h3>
                        <p className="text-sm text-gray-400">{country.volcano_count} volcanoes</p>
                        {country.percentage && <p className="text-xs text-gray-500 mt-1">{country.percentage}% of Ring of Fire</p>}
                      </>
                    );
                    return href ? (
                      <Link key={index} href={href} className="block p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] hover:border-amber-500/50 border border-transparent transition-all">
                        {body}
                      </Link>
                    ) : (
                      <div key={index} className="block p-4 bg-[#1a1a1a] rounded-lg border border-transparent">{body}</div>
                    );
                  })}
                </div>
              </div>
            )}

            {page.faqs && page.faqs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {page.faqs.map((faq, index) => (
                    <details key={index} className="group bg-[#1a1a1a] rounded-lg border border-gray-800">
                      <summary className="cursor-pointer px-6 py-4 font-semibold text-white hover:text-amber-500 transition-colors flex items-center justify-between">
                        <span>{faq.question}</span>
                        <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-6 pb-4">
                        <RichText html={faq.answer} className="text-gray-300" />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            <SourceLine citation={page.source_citation} />

            <div className="mt-12 p-6 bg-[#1a1a1a] rounded-lg border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Explore more</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/map" className="block p-4 bg-[#252525] rounded-lg hover:bg-[#2a2a2a] hover:border-amber-500/50 border border-transparent transition-all">
                  <h3 className="font-semibold text-amber-500 mb-1">Volcano map</h3>
                  <p className="text-sm text-gray-400">Every profiled volcano on one map</p>
                </Link>
                <Link href="/latest-eruptions" className="block p-4 bg-[#252525] rounded-lg hover:bg-[#2a2a2a] hover:border-amber-500/50 border border-transparent transition-all">
                  <h3 className="font-semibold text-amber-500 mb-1">Latest eruptions</h3>
                  <p className="text-sm text-gray-400">This week&apos;s activity reports</p>
                </Link>
                <Link href="/countries" className="block p-4 bg-[#252525] rounded-lg hover:bg-[#2a2a2a] hover:border-amber-500/50 border border-transparent transition-all">
                  <h3 className="font-semibold text-amber-500 mb-1">Countries</h3>
                  <p className="text-sm text-gray-400">Volcanoes listed by country</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function CountryPageContent({ country, slug }: { country: any; slug: string }) {
  const countryName: string = country.hero.title.replace('Volcanoes in ', '');
  const plainName = countryName.replace(/^the\s+/i, '');

  // Map markers come straight from the Smithsonian export. Border volcanoes are added
  // only on pages whose published count includes them, so map and text agree.
  const { own, shared } = getGvpByCountry(plainName);
  const mapVolcanoes = country.hero.volcano_count === own.length ? own : [...own, ...shared];
  const markers = mapVolcanoes.map((v) => ({
    title: v.Volcano_Name,
    slug: volcanoHrefByNumber(v.Volcano_Number) || '',
    lat: v.Latitude,
    lon: v.Longitude,
    type: (v.Primary_Volcano_Type || '').replace(/\((es|s)\)/g, ''),
    elevation: v.Elevation !== null && v.Elevation !== undefined ? `${v.Elevation.toLocaleString('en-US')} m` : '',
    country: v.Country,
    last_eruption: formatYear(v.Last_Eruption_Year),
    status: eruptionGroup(v.Last_Eruption_Year),
  }));

  const table = normalizeCountryTable(country.volcano_table);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Countries', path: '/countries' },
    { name: country.title, path: `/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      {country.faqs && country.faqs.length > 0 && <JsonLd data={faqLd(country.faqs)} />}

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-14 md:py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm mb-6" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-400">
                <li><Link href="/" className="hover:text-amber-500">Home</Link></li>
                <li><span className="text-gray-600" aria-hidden="true">/</span></li>
                <li><Link href="/countries" className="hover:text-amber-500">Countries</Link></li>
                <li><span className="text-gray-600" aria-hidden="true">/</span></li>
                <li className="text-white" aria-current="page">{country.title}</li>
              </ol>
            </nav>

            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{country.hero.title}</h1>
              <p className="text-2xl text-amber-500 mb-6">{country.hero.subtitle}</p>

              <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                <div className="flex flex-col-reverse text-center">
                  <dt className="text-sm text-gray-400 mt-2">Holocene volcanoes</dt>
                  <dd className="text-4xl font-bold text-amber-500">{country.hero.volcano_count}</dd>
                </div>
                {country.hero.active_count ? (
                  <div className="flex flex-col-reverse text-center">
                    <dt className="text-sm text-gray-400 mt-2">Historically active</dt>
                    <dd className="text-4xl font-bold text-amber-500">{country.hero.active_count}</dd>
                  </div>
                ) : null}
                {country.hero.tallest && (
                  <div className="flex flex-col-reverse text-center">
                    <dt className="text-xs text-gray-500">Tallest volcano</dt>
                    <dd className="text-sm text-gray-400 mt-1">
                      {country.hero.tallest.elevation_m ? `${country.hero.tallest.elevation_m.toLocaleString('en-US')} m` : ''}
                    </dd>
                    <dd className="text-2xl font-bold text-white">{country.hero.tallest.name}</dd>
                  </div>
                )}
                {country.hero.most_recent_eruption && (
                  <div className="flex flex-col-reverse text-center">
                    <dt className="text-xs text-gray-500">Most recent eruption</dt>
                    <dd className="text-sm text-gray-400 mt-1">{country.hero.most_recent_eruption.volcano}</dd>
                    <dd className="text-2xl font-bold text-white">{country.hero.most_recent_eruption.year}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {markers.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                  Map of volcanoes in {countryName}
                </h2>
                <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#1a1a1a]">
                  <MapSection markers={markers} heightClass="h-[420px] md:h-[500px]" />
                </div>
              </section>
            )}

            {country.quick_answer && (
              <QuickStats
                howMany={country.quick_answer.how_many}
                howManyActive={country.quick_answer.how_many_active}
                why={country.quick_answer.why}
                tallest={country.quick_answer.tallest}
                mostRecent={country.quick_answer.most_recent}
              />
            )}

            {country.sections &&
              Object.entries(country.sections).map(([key, section]: [string, any]) => {
                if (!section || typeof section.content !== 'string') return null;
                const title = key
                  .split('_')
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');

                return (
                  <div key={key} className="prose prose-lg prose-invert max-w-none mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                      {section.title || title}
                    </h2>
                    <RichText html={breakUpLongParagraphs(section.content, 3)} className="text-gray-300 leading-relaxed space-y-4" />
                  </div>
                );
              })}

            {table && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                  List of volcanoes in {countryName}
                </h2>
                {table.description && <p className="text-gray-400 mb-6">{table.description}</p>}
                <VolcanoTable rows={table.rows} statusLabel={table.statusLabel} noteLabel={table.noteLabel} />
              </div>
            )}

            {country.facts && country.facts.length > 0 && (
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 mb-12">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                  Facts about volcanoes in {countryName}
                </h2>
                <ol className="space-y-3">
                  {country.facts.map((fact: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-8 h-8 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center font-bold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-300">{fact}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {country.faqs && country.faqs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {country.faqs.map((faq: any, index: number) => (
                    <details key={index} className="group bg-[#1a1a1a] rounded-lg border border-gray-800">
                      <summary className="cursor-pointer px-6 py-4 font-semibold text-white hover:text-amber-500 transition-colors flex items-center justify-between">
                        <span>{faq.question}</span>
                        <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-6 pb-4 border-t border-gray-800 mt-2 pt-4">
                        <RichText html={faq.answer || ''} className="text-gray-300" />
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            <SourceLine citation={country.source_citation} />
          </div>
        </section>
      </div>
    </>
  );
}
