import { getAllCountries, getAllVolcanoes } from '@/lib/data';
import Link from 'next/link';
import CountriesListClient from '@/components/CountriesListClient';
import JsonLd, { breadcrumbLd } from '@/components/JsonLd';
import { GVP_HOME, pageMeta } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Countries with Volcanoes — Browse by Country',
  description:
    'Countries with volcanoes, ranked by the number of Holocene volcanoes in the Smithsonian database. Open a country for its full list, map and eruption history.',
  path: '/countries',
});

export default async function CountriesPage() {
  const countries = await getAllCountries();
  const volcanoes = await getAllVolcanoes();

  const countryData = countries
    .map((country) => ({
      slug: country.slug,
      name: country.title.replace('Volcanoes in ', '').replace(/^the\s+/i, ''),
      title: country.title,
      volcano_count: country.hero.volcano_count || 0,
      active_count: country.hero.active_count || 0,
      tallest: country.hero.tallest,
      most_recent: country.hero.most_recent_eruption,
      description: country.hero.subtitle,
    }))
    .sort((a, b) => b.volcano_count - a.volcano_count);

  const top = countryData[0];

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Countries', path: '/countries' }])} />

      <section className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Countries with Volcanoes</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl">
            {countryData.length} countries have a page here.
            {top ? ` ${top.name} has the most Holocene volcanoes of them, with ${top.volcano_count}.` : ''}
          </p>

          <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col-reverse bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <dt className="text-sm text-gray-400">Country pages</dt>
              <dd className="text-3xl font-bold text-amber-500">{countryData.length}</dd>
            </div>
            <div className="flex flex-col-reverse bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <dt className="text-sm text-gray-400">Volcano profiles</dt>
              <dd className="text-3xl font-bold text-amber-500">{volcanoes.length}</dd>
            </div>
            {top && (
              <div className="flex flex-col-reverse bg-[#1a1a1a] rounded-lg p-4 border border-gray-800 col-span-2 md:col-span-1">
                <dt className="text-sm text-gray-400">Most volcanoes: {top.name}</dt>
                <dd className="text-3xl font-bold text-amber-500">{top.volcano_count}</dd>
              </div>
            )}
          </dl>

          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">Countries with the most volcanoes</h2>
            <ol className="grid md:grid-cols-3 gap-4">
              {countryData.slice(0, 6).map((country, index) => (
                <li key={country.slug}>
                  <Link
                    href={`/volcanoes-in-${country.slug}`}
                    className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg hover:bg-[#252525] transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl font-bold text-amber-500">{index + 1}</div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-amber-500 transition-colors">{country.name}</div>
                        <div className="text-sm text-gray-400">{country.volcano_count} volcanoes</div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
            <p className="text-sm text-gray-400 mt-4">
              Counts are the Holocene volcanoes listed on each country page. Source:{' '}
              <a href={GVP_HOME} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                Global Volcanism Program, Smithsonian Institution
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CountriesListClient countries={countryData} />
        </div>
      </section>
    </div>
  );
}
