import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCountryBySlug, getAllCountries, getAllVolcanoes } from '@/lib/data';
import QuickStats from '@/components/QuickStats';
import VolcanoTable from '@/components/VolcanoTable';
import { breakUpLongParagraphs } from '@/lib/textUtils';
import MapSection from '@/components/MapSection';
import { getVolcanoesGeoData } from '@/lib/volcanoDynamicData';

export async function generateStaticParams() {
  const countries = await getAllCountries();
  return countries.map((country) => ({
    slug: country.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  
  if (!country) {
    return {
      title: 'Country Not Found',
    };
  }

  return {
    title: country.meta_title,
    description: country.meta_description,
  };
}

export default async function CountryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log('Country page requested for slug:', slug);
  const country = await getCountryBySlug(slug);

  if (!country) {
    console.log('Country not found for slug:', slug);
    notFound();
  }

  // Get country name from title
  const countryName = country.title.replace('Volcanoes in ', '');
  
  // Get all volcanoes for this country from both sources
  const allVolcanoes = await getAllVolcanoes();
  const countryVolcanoes = allVolcanoes.filter(v => v.hero.country === countryName);
  
  // Get geo data for additional volcanoes
  const geoData = getVolcanoesGeoData();
  const geoVolcanoes = geoData.filter(v => v.properties.Country === countryName);
  
  // Create map markers combining both sources
  const mapMarkers = [
    ...countryVolcanoes.map(v => ({
      slug: `/volcano/${v.slug}`,
      title: v.hero.name,
      lat: v.hero.coordinates?.lat || 0,
      lon: v.hero.coordinates?.lon || 0,
      country: v.hero.country,
      type: v.hero.type,
      status: v.hero.status,
      elevation: v.hero.elevation_m ? `${v.hero.elevation_m}m` : 'Unknown',
      last_eruption: v.hero.last_eruption
    })),
    ...geoVolcanoes
      .filter(g => !countryVolcanoes.some(v => v.hero.name === g.properties.Volcano_Name))
      .map(g => ({
        slug: `/volcano/${g.properties.Volcano_Name.toLowerCase().replace(/\s+/g, '-')}`,
        title: g.properties.Volcano_Name,
        lat: g.properties.Latitude,
        lon: g.properties.Longitude,
        country: g.properties.Country,
        type: g.properties.Primary_Volcano_Type,
        status: g.properties.Last_Eruption_Year ? 
          (g.properties.Last_Eruption_Year > 1900 ? 'Recently Active' : 'Historical') : 
          'Unknown',
        elevation: `${g.properties.Elevation}m`,
        last_eruption: g.properties.Last_Eruption_Year ? 
          String(g.properties.Last_Eruption_Year) : 'Unknown'
      }))
  ].filter(m => m.lat && m.lon);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Ultra Compact Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-3">
          {/* Everything in one row on desktop */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex-1">
              <nav className="text-xs text-gray-400 mb-1">
                <Link href="/" className="hover:text-amber-500">Home</Link>
                <span className="mx-1">/</span>
                <Link href="/countries" className="hover:text-amber-500">Countries</Link>
                <span className="mx-1">/</span>
                <span className="text-white">{country.title}</span>
              </nav>
              <h1 className="text-xl font-bold text-white">{country.hero.title}</h1>
              <p className="text-sm text-amber-500">{country.hero.subtitle}</p>
            </div>
            
            {/* Stats on the right */}
            <div className="flex gap-2 text-sm flex-wrap md:flex-nowrap">
              <div className="bg-[#0f0f0f] px-2 py-1 rounded">
                <span className="text-amber-500 font-bold">{country.hero.volcano_count}</span>
                <span className="text-gray-500 ml-1 text-xs">Total</span>
              </div>
              {country.hero.active_count && (
                <div className="bg-[#0f0f0f] px-2 py-1 rounded">
                  <span className="text-amber-500 font-bold">{country.hero.active_count}</span>
                  <span className="text-gray-500 ml-1 text-xs">Active</span>
                </div>
              )}
              {country.hero.tallest && (
                <div className="bg-[#0f0f0f] px-2 py-1 rounded">
                  <span className="text-white text-sm">{country.hero.tallest.name}</span>
                  <span className="text-gray-500 ml-1 text-xs">({country.hero.tallest.elevation_m?.toLocaleString() || 'N/A'}m)</span>
                </div>
              )}
              {country.hero.most_recent_eruption && (
                <div className="bg-[#0f0f0f] px-2 py-1 rounded">
                  <span className="text-white text-sm">{country.hero.most_recent_eruption.year}</span>
                  <span className="text-gray-500 ml-1 text-xs">{country.hero.most_recent_eruption.volcano}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Map immediately after */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Country Volcano Map - No spacing */}
        {mapMarkers.length > 0 && (
          <div className="mt-4 mb-4">
            <h2 className="text-lg font-bold text-white mb-2">
              Volcano Locations in {countryName}
            </h2>
            <div className="h-[450px] rounded-lg overflow-hidden border border-gray-800">
              <MapSection markers={mapMarkers} showControls={false} />
            </div>
          </div>
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

          {/* Content Sections - iterate over all sections */}
          {country.sections && Object.entries(country.sections).map(([key, section]: [string, any]) => {
            // Format section title from key
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

          {/* Volcano Table using VolcanoTable component */}
          {country.volcano_table && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="w-1 h-8 bg-amber-500 mr-3"></span>
                {country.volcano_table.description || 'Volcanoes'}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full bg-[#1a1a1a] rounded-lg">
                  <thead>
                    <tr className="border-b border-gray-800">
                      {country.volcano_table.columns.map((col: string, i: number) => (
                        <th key={i} className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {country.volcano_table.rows.map((row: any, i: number) => (
                      <tr key={i} className="border-b border-gray-800 hover:bg-[#252525]">
                        <td className="px-4 py-3">
                          {row.slug ? (
                            <Link href={`/volcano/${row.slug}`} className="text-amber-500 hover:text-amber-400">
                              {row.name}
                            </Link>
                          ) : (
                            <span className="text-gray-300">{row.name}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-300">{row.elevation_m ? `${row.elevation_m.toLocaleString()} m` : 'Unknown'}</td>
                        <td className="px-4 py-3 text-gray-300">{row.type}</td>
                        <td className="px-4 py-3 text-gray-300">{row.last_eruption}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            row.status === 'Active' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Facts List */}
          {country.facts && country.facts.length > 0 && (
            <div id="facts" className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 mb-12">
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

          {/* FAQs Accordion */}
          {country.faqs && country.faqs.length > 0 && (
            <div id="faqs" className="mb-12">
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
                href="/ring-of-fire"
                className="block p-4 bg-[#252525] rounded-lg hover:bg-[#2a2a2a] hover:border-amber-500/50 border border-transparent transition-all"
              >
                <h4 className="font-semibold text-amber-500 mb-1">Ring of Fire</h4>
                <p className="text-sm text-gray-400">Learn about the Pacific volcanic belt</p>
              </Link>
              <Link 
                href="/active-volcanoes"
                className="block p-4 bg-[#252525] rounded-lg hover:bg-[#2a2a2a] hover:border-amber-500/50 border border-transparent transition-all"
              >
                <h4 className="font-semibold text-amber-500 mb-1">Active Volcanoes</h4>
                <p className="text-sm text-gray-400">Currently erupting worldwide</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}