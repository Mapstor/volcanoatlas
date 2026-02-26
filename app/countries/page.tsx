import { getAllCountries, getAllVolcanoes } from '@/lib/data';
import Link from 'next/link';
import CountriesListClient from '@/components/CountriesListClient';

export const metadata = {
  title: 'Countries with Volcanoes — Browse by Country | VolcanoAtlas',
  description: 'Explore volcanoes by country. Browse 40+ countries with active and dormant volcanoes. Find detailed volcanic information for each nation.',
};

export default async function CountriesPage() {
  const countries = await getAllCountries();
  const volcanoes = await getAllVolcanoes();

  // Create country statistics
  const countryData = countries.map(country => {
    // Count volcanoes for this country
    const countryVolcanoes = volcanoes.filter(v => 
      v.hero.country === country.title.replace('Volcanoes in ', '')
    );

    return {
      slug: country.slug,
      name: country.title.replace('Volcanoes in ', ''),
      title: country.title,
      volcano_count: country.hero.volcano_count || countryVolcanoes.length,
      active_count: country.hero.active_count || 0,
      tallest: country.hero.tallest,
      most_recent: country.hero.most_recent_eruption,
      description: country.hero.subtitle,
    };
  }).sort((a, b) => b.volcano_count - a.volcano_count);

  // Calculate global statistics
  const totalVolcanoes = volcanoes.length;
  const activeVolcanoes = volcanoes.filter(v => 
    v.hero.status.toLowerCase().includes('active')
  ).length;

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Countries with Volcanoes
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Explore volcanic activity across {countryData.length} countries worldwide
          </p>

          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-3xl font-bold text-amber-500">{countryData.length}</div>
              <div className="text-sm text-gray-400">Countries</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-3xl font-bold text-amber-500">{totalVolcanoes}</div>
              <div className="text-sm text-gray-400">Total Volcanoes</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-3xl font-bold text-amber-500">{activeVolcanoes}</div>
              <div className="text-sm text-gray-400">Active Worldwide</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-3xl font-bold text-amber-500">
                {countryData[0]?.volcano_count || 0}
              </div>
              <div className="text-sm text-gray-400">
                Most ({countryData[0]?.name || 'N/A'})
              </div>
            </div>
          </div>

          {/* Top Countries Preview */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Top Countries by Volcano Count</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {countryData.slice(0, 6).map((country, index) => (
                <Link
                  key={country.slug}
                  href={`/volcanoes-in-${country.slug}`}
                  className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg hover:bg-[#252525] transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl font-bold text-amber-500">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-amber-500 transition-colors">
                        {country.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {country.volcano_count} volcanoes
                      </div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Countries List Section */}
      <section className="py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CountriesListClient countries={countryData} />
        </div>
      </section>
    </div>
  );
}