import { getAllVolcanoes } from '@/lib/data';
import VolcanoesListClient from '@/components/VolcanoesListClient';

export const metadata = {
  title: 'All Volcanoes — Complete List of 150+ Volcanoes | VolcanoAtlas',
  description: 'Browse our complete database of 150+ volcanoes worldwide. Filter by country, type, elevation, and eruption status. Find detailed information on every volcano.',
};

export default async function VolcanoesPage() {
  const volcanoes = await getAllVolcanoes();

  // Prepare volcano data for the client component
  const volcanoData = volcanoes.map(volcano => ({
    slug: volcano.slug,
    name: volcano.hero.name,
    country: volcano.hero.country,
    type: volcano.hero.type,
    elevation_m: volcano.hero.elevation_m,
    elevation_ft: volcano.hero.elevation_ft,
    status: volcano.hero.status,
    last_eruption: volcano.hero.last_eruption,
    coordinates: volcano.hero.coordinates,
  }));

  // Get unique values for filters
  const countries = [...new Set(volcanoData.map(v => v.country))].sort();
  const types = [...new Set(volcanoData.map(v => v.type))].sort();
  const statuses = [...new Set(volcanoData.map(v => v.status))].sort();

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All Volcanoes
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Explore our comprehensive database of {volcanoData.length} volcanoes from around the world
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-3xl font-bold text-amber-500">{volcanoData.length}</div>
              <div className="text-sm text-gray-400">Total Volcanoes</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-3xl font-bold text-amber-500">{countries.length}</div>
              <div className="text-sm text-gray-400">Countries</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-3xl font-bold text-amber-500">
                {volcanoData.filter(v => v.status.toLowerCase().includes('active')).length}
              </div>
              <div className="text-sm text-gray-400">Active</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-3xl font-bold text-amber-500">{types.length}</div>
              <div className="text-sm text-gray-400">Types</div>
            </div>
          </div>
        </div>
      </section>

      {/* List Section */}
      <section className="py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <VolcanoesListClient 
            volcanoes={volcanoData}
            countries={countries}
            types={types}
            statuses={statuses}
          />
        </div>
      </section>
    </div>
  );
}