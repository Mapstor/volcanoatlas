import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSpecialPage, getAllSpecialPages, getCountryBySlug, getAllCountries, getVolcanoBySlug } from '@/lib/data';
import RankingTable from '@/components/RankingTable';
import ContentSections from '@/components/ContentSections';
import QuickStats from '@/components/QuickStats';
import VolcanoTable from '@/components/VolcanoTable';
import MapSection from '@/components/MapSection';
import { breakUpLongParagraphs } from '@/lib/textUtils';
import { getCountryVolcanoesWithPages } from '@/lib/volcanoData';

export async function generateStaticParams() {
  const pages = await getAllSpecialPages();
  const countries = await getAllCountries();
  
  const specialPageParams = pages.map((page) => ({
    slug: page.slug,
  }));
  
  const countryPageParams = countries.map((country) => ({
    slug: `volcanoes-in-${country.slug}`,
  }));
  
  return [...specialPageParams, ...countryPageParams];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Check if it's a country page
  if (slug.startsWith('volcanoes-in-')) {
    const countrySlug = slug.replace('volcanoes-in-', '');
    const country = await getCountryBySlug(countrySlug);
    
    if (country) {
      return {
        title: country.meta_title,
        description: country.meta_description,
      };
    }
  }
  
  // Otherwise try special page
  const page = await getSpecialPage(slug);
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.meta_title,
    description: page.meta_description,
  };
}

export default async function SpecialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Check if it's a country page and render it
  if (slug.startsWith('volcanoes-in-')) {
    const countrySlug = slug.replace('volcanoes-in-', '');
    const country = await getCountryBySlug(countrySlug);
    
    if (!country) {
      notFound();
    }
    
    // Get ALL volcanoes for this country from volcanoes.json
    const countryName = country.hero.title.replace('Volcanoes in ', '').replace('the ', '');
    const { getVolcanoesByCountry, getCountryVolcanoesWithPages } = await import('@/lib/volcanoData');
    const allVolcanoes = getVolcanoesByCountry(countryName);
    const nameToSlugMap = getCountryVolcanoesWithPages(countrySlug);
    
    // Combine data: use all volcanoes and add slug if we have a page
    const volcanoes = allVolcanoes.map(v => ({
      ...v,
      slug: nameToSlugMap.get(v.name) || null,
      hasPage: nameToSlugMap.has(v.name)
    }));
    
    // Render country page with volcano data
    return <CountryPageContent country={country} volcanoes={volcanoes} />;
  }
  
  // Otherwise handle special pages
  const page = await getSpecialPage(slug);

  if (!page) {
    notFound();
  }

  const isRankingPage = page.page_type === 'ranking';
  
  // For active-volcanoes page, prepare map markers and check content availability
  let activeVolcanoMarkers: any[] = [];
  let existingVolcanoSlugs: Set<string> = new Set();
  
  if (slug === 'active-volcanoes' && page.ranked_table?.rows) {
    // Get existing volcano slugs
    const { getExistingVolcanoSlugs } = await import('@/lib/volcanoHelpers');
    existingVolcanoSlugs = getExistingVolcanoSlugs();
    
    // Get all volcano names from the table
    const volcanoNames = page.ranked_table.rows.map((row: any[]) => row[0]); // First column is name
    
    // Get coordinates from volcanoes.json
    const { getVolcanoCoordinatesByNames } = await import('@/lib/volcanoData');
    const coordsMap = getVolcanoCoordinatesByNames(volcanoNames);
    
    // Build markers from table data and coordinates
    activeVolcanoMarkers = page.ranked_table.rows
      .map((row: any[]) => {
        const [name, country, region, type, elevation, lastEruption, totalEruptions, maxVEI, volcanoSlug] = row;
        const coords = coordsMap.get(name);
        
        if (coords) {
          // Check if we have a page for this volcano
          const hasPage = volcanoSlug && volcanoSlug !== '';
          
          return {
            title: name,
            slug: hasPage ? `/volcano/${volcanoSlug}` : null,
            lat: coords.lat,
            lon: coords.lon,
            type,
            elevation,
            country,
            last_eruption: lastEruption,
            status: 'Active (erupting)'
          };
        }
        return null;
      })
      .filter(marker => marker !== null);
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          {page.breadcrumbs && page.breadcrumbs.length > 0 && (
            <nav className="text-sm mb-6">
              <ol className="flex items-center space-x-2 text-gray-400">
                {page.breadcrumbs.map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && <span className="text-gray-600 mx-2">/</span>}
                    {index === page.breadcrumbs!.length - 1 || !crumb.path ? (
                      <span className="text-white">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.path} className="hover:text-amber-500">
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Hero Content */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {page.hero.title}
            </h1>
            <p className="text-2xl text-amber-500 mb-6">{page.hero.subtitle}</p>
            
            {/* Key Numbers - for special pages */}
            {page.hero.stats && page.hero.stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                {page.hero.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold text-amber-500">{stat.value}</div>
                    <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Introduction */}
          {page.introduction && (
            <div className="prose prose-lg prose-invert max-w-none mb-12">
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: breakUpLongParagraphs(page.introduction, 3) }}
              />
            </div>
          )}

          {/* Active Volcanoes Map */}
          {slug === 'active-volcanoes' && activeVolcanoMarkers.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                Interactive Map of Active Volcanoes
              </h2>
              <div className="rounded-xl overflow-hidden border border-gray-800 h-[500px] bg-[#1a1a1a]">
                <MapSection markers={activeVolcanoMarkers} />
              </div>
              <p className="text-center text-gray-500 text-sm mt-3">
                Showing {activeVolcanoMarkers.length} currently active volcanoes • Click any marker for details
              </p>
            </section>
          )}

          {/* Ranking Table - for ranking pages */}
          {isRankingPage && page.ranked_table && (
            <RankingTable
              title={page.ranked_table.title}
              description={page.ranked_table.description}
              headers={page.ranked_table.headers}
              rows={page.ranked_table.rows}
              isActiveVolcanoesTable={slug === 'active-volcanoes'}
              existingVolcanoSlugs={existingVolcanoSlugs}
            />
          )}

          {/* Content Sections */}
          {page.sections && (
            <ContentSections sections={page.sections} />
          )}

          {/* Quick Stats - for special pages */}
          {page.quick_stats && page.quick_stats.length > 0 && (
            <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-lg p-6 mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                Quick Facts
              </h2>
              <ul className="space-y-3">
                {page.quick_stats.map((stat, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span className="text-gray-300">{stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Stats - for ranking pages */}
          {page.key_stats && page.key_stats.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-lg p-6 mb-12 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                Key Statistics
              </h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {page.key_stats.map((stat, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span className="text-gray-300">{stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Volcano List - for special pages */}
          {page.volcano_list && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                {page.volcano_list.title}
              </h2>
              <p className="text-gray-400 mb-6">{page.volcano_list.description}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {page.volcano_list.volcanoes.map((volcano, index) => (
                  <Link
                    key={index}
                    href={`/volcano/${volcano.slug}`}
                    className="block p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] hover:border-amber-500/50 border border-transparent transition-all"
                  >
                    <h3 className="font-semibold text-amber-500 mb-1">{volcano.name}</h3>
                    <p className="text-sm text-gray-400">{volcano.country}</p>
                    <p className="text-xs text-gray-500 mt-1">{volcano.last_eruption}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Country List - for special pages */}
          {page.countries && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                Countries in the Ring of Fire
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {page.countries.map((country, index) => (
                  <Link
                    key={index}
                    href={`/volcanoes-in-${country.slug}`}
                    className="block p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] hover:border-amber-500/50 border border-transparent transition-all"
                  >
                    <h3 className="font-semibold text-amber-500 mb-1">{country.name}</h3>
                    <p className="text-sm text-gray-400">{country.volcano_count} volcanoes</p>
                    {country.percentage && (
                      <p className="text-xs text-gray-500 mt-1">{country.percentage}% of Ring of Fire</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQs Section */}
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
                      <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-4">
                      <div 
                        className="text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Source Citation */}
          {page.source_citation && (
            <div className="mt-12 p-4 bg-[#1a1a1a]/50 rounded-lg border border-gray-800">
              <p className="text-xs text-gray-500">
                Source: {page.source_citation}
              </p>
            </div>
          )}

          {/* Related Links */}
          <div className="mt-12 p-6 bg-[#1a1a1a] rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">Explore More</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link 
                href="/map"
                className="block p-4 bg-[#252525] rounded-lg hover:bg-[#2a2a2a] hover:border-amber-500/50 border border-transparent transition-all"
              >
                <h4 className="font-semibold text-amber-500 mb-1">Interactive Map</h4>
                <p className="text-sm text-gray-400">View all volcanoes on the map</p>
              </Link>
              <Link 
                href="/active-volcanoes"
                className="block p-4 bg-[#252525] rounded-lg hover:bg-[#2a2a2a] hover:border-amber-500/50 border border-transparent transition-all"
              >
                <h4 className="font-semibold text-amber-500 mb-1">Active Volcanoes</h4>
                <p className="text-sm text-gray-400">Currently erupting worldwide</p>
              </Link>
              <Link 
                href="/countries"
                className="block p-4 bg-[#252525] rounded-lg hover:bg-[#2a2a2a] hover:border-amber-500/50 border border-transparent transition-all"
              >
                <h4 className="font-semibold text-amber-500 mb-1">Countries</h4>
                <p className="text-sm text-gray-400">Browse volcanoes by country</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Component to render country pages
function CountryPageContent({ country, volcanoes }: { country: any; volcanoes: any[] }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-6">
            <ol className="flex items-center space-x-2 text-gray-400">
              <li><Link href="/" className="hover:text-amber-500">Home</Link></li>
              <li><span className="text-gray-600">/</span></li>
              <li><Link href="/countries" className="hover:text-amber-500">Countries</Link></li>
              <li><span className="text-gray-600">/</span></li>
              <li className="text-white">{country.title}</li>
            </ol>
          </nav>

          {/* H1 Title */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {country.hero.title}
            </h1>
            <p className="text-2xl text-amber-500 mb-6">{country.hero.subtitle}</p>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500">{country.hero.volcano_count}</div>
                <div className="text-sm text-gray-400 mt-2">Total Volcanoes</div>
              </div>
              {country.hero.active_count && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-500">{country.hero.active_count}</div>
                  <div className="text-sm text-gray-400 mt-2">Historically Active</div>
                </div>
              )}
              {country.hero.tallest && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{country.hero.tallest.name}</div>
                  <div className="text-sm text-gray-400 mt-1">{country.hero.tallest.elevation_m ? `${country.hero.tallest.elevation_m.toLocaleString()} m` : 'N/A'}</div>
                  <div className="text-xs text-gray-500">Tallest Volcano</div>
                </div>
              )}
              {country.hero.most_recent_eruption && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{country.hero.most_recent_eruption.year}</div>
                  <div className="text-sm text-gray-400 mt-1">{country.hero.most_recent_eruption.volcano}</div>
                  <div className="text-xs text-gray-500">Most Recent</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Volcanoes Map */}
          {volcanoes && volcanoes.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                Volcano Locations in {country.hero.title.replace('Volcanoes in ', '')}
              </h2>
              <div className="rounded-xl overflow-hidden border border-gray-800 h-[500px] bg-[#1a1a1a]">
                <MapSection 
                  markers={volcanoes.map(v => ({
                    title: v.name,
                    slug: v.slug ? `/volcano/${v.slug}` : '',
                    lat: v.lat,
                    lon: v.lon,
                    type: v.type,
                    elevation: `${v.elevation} m`,
                    country: country.hero.title.replace('Volcanoes in ', ''),
                    last_eruption: v.lastEruption ? String(v.lastEruption) : 'Unknown',
                    status: v.lastEruption && v.lastEruption > 1900 ? 'Active' : 'Dormant'
                  }))}
                />
              </div>
              <p className="text-center text-gray-500 text-sm mt-3">
                Click any marker to view volcano details • {volcanoes.length} volcanoes total
              </p>
            </section>
          )}

          {/* Quick Answer Box */}
          {country.quick_answer && (
            <QuickStats
              howMany={country.quick_answer.how_many}
              howManyActive={country.quick_answer.how_many_active}
              why={country.quick_answer.why}
              tallest={country.quick_answer.tallest}
              mostRecent={country.quick_answer.most_recent}
            />
          )}

          {/* Content Sections */}
          {country.sections && Object.entries(country.sections).map(([key, section]: [string, any]) => {
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
                <div 
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: breakUpLongParagraphs(section.content, 3) }}
                />
              </div>
            );
          })}

          {/* Volcano Table */}
          {country.volcano_table && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                {country.volcano_table.description || 'Volcanoes'}
              </h2>
              <VolcanoTable 
                columns={country.volcano_table.columns}
                rows={country.volcano_table.rows}
              />
            </div>
          )}

          {/* Facts List */}
          {country.facts && country.facts.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                Interesting Facts
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

          {/* FAQs */}
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
                      <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-4 border-t border-gray-800 mt-2 pt-4">
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}