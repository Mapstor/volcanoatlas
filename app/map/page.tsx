import { getMapMarkers } from '@/lib/data';
import MapSection from '@/components/MapSection';
import JsonLd, { breadcrumbLd } from '@/components/JsonLd';
import { GVP_HOME, pageMeta } from '@/lib/site';

export async function generateMetadata() {
  const markers = await getMapMarkers();
  return pageMeta({
    title: 'Interactive Volcano Map — Global Volcano Locations',
    description: `Volcano map of the world: ${markers.length} volcanoes you can filter by country, type and last eruption. Tap any marker for elevation, last eruption and a full profile.`,
    path: '/map',
  });
}

export default async function MapPage() {
  const markers = await getMapMarkers();
  const countries = new Set(markers.map((m) => m.country)).size;
  const since2000 = markers.filter((m) => m.status === 'Erupted since 2000').length;

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Volcano map', path: '/map' }])} />

      <section className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Interactive Volcano Map</h1>
          <p className="text-xl text-gray-300 mb-6 max-w-3xl">
            {markers.length} volcanoes in {countries} countries and territories. {since2000} of them have erupted since 2000.
          </p>
        </div>
      </section>

      <section>
        <MapSection markers={markers} />
      </section>

      <section className="bg-[#1a1a1a] py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">How to use the map</h2>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>Tap a marker to see the volcano&apos;s type, elevation and last known eruption.</li>
              <li>Use the filters above the map to narrow by country, type or last eruption.</li>
              <li>Zoom in to separate volcanoes that sit close together.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-4">What the map shows</h2>
            <p className="text-gray-300 leading-relaxed">
              The map shows the volcanoes that have a full profile on VolcanoAtlas. Marker colour is set by the year of
              the last known eruption. Locations and eruption years come from the{' '}
              <a href={GVP_HOME} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                Global Volcanism Program, Smithsonian Institution
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
