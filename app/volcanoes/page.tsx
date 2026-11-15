import { getAllVolcanoes } from '@/lib/data';
import VolcanoesListClient from '@/components/VolcanoesListClient';
import JsonLd, { breadcrumbLd } from '@/components/JsonLd';
import { eruptionGroup } from '@/lib/gvp';
import { pageMeta } from '@/lib/site';

export async function generateMetadata() {
  const volcanoes = await getAllVolcanoes();
  return pageMeta({
    title: `All Volcanoes: List of ${volcanoes.length} Volcano Profiles`,
    description: `Browse ${volcanoes.length} volcano profiles. Filter by country, type and last eruption, then open any volcano for its location, elevation and eruption record.`,
    path: '/volcanoes',
  });
}

export default async function VolcanoesPage() {
  const volcanoes = await getAllVolcanoes();

  const volcanoData = volcanoes
    .map((volcano) => ({
      slug: volcano.slug,
      name: volcano.hero.name,
      country: volcano.hero.country,
      type: volcano.hero.type,
      elevation_m: volcano.hero.elevation_m,
      elevation_ft: volcano.hero.elevation_ft,
      // Grouped by the year of the last known eruption, not by an "active/dormant" label.
      status: eruptionGroup(volcano.hero.last_eruption_year) as string,
      last_eruption: volcano.hero.last_eruption,
      coordinates: volcano.hero.coordinates,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const countries = [...new Set(volcanoData.map((v) => v.country))].sort();
  const types = [...new Set(volcanoData.map((v) => v.type))].sort();
  const statuses = ['Erupted since 2000', 'Erupted 1900–1999', 'Before 1900 or undated'].filter((group) =>
    volcanoData.some((v) => v.status === group)
  );
  const since2000 = volcanoData.filter((v) => v.status === 'Erupted since 2000').length;

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'All volcanoes', path: '/volcanoes' }])} />

      <section className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">All Volcanoes</h1>
          <p className="text-xl text-gray-300 mb-8">
            {volcanoData.length} volcano profiles from {countries.length} countries and territories
          </p>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col-reverse bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <dt className="text-sm text-gray-400">Volcano profiles</dt>
              <dd className="text-3xl font-bold text-amber-500">{volcanoData.length}</dd>
            </div>
            <div className="flex flex-col-reverse bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <dt className="text-sm text-gray-400">Countries and territories</dt>
              <dd className="text-3xl font-bold text-amber-500">{countries.length}</dd>
            </div>
            <div className="flex flex-col-reverse bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <dt className="text-sm text-gray-400">Erupted since 2000</dt>
              <dd className="text-3xl font-bold text-amber-500">{since2000}</dd>
            </div>
            <div className="flex flex-col-reverse bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <dt className="text-sm text-gray-400">Volcano types</dt>
              <dd className="text-3xl font-bold text-amber-500">{types.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <VolcanoesListClient volcanoes={volcanoData} countries={countries} types={types} statuses={statuses} />
        </div>
      </section>
    </div>
  );
}
