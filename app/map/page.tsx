import { getMapMarkers } from '@/lib/data';
import MapSection from '@/components/MapSection';

export const metadata = {
  title: 'Interactive Volcano Map — Global Volcano Locations | VolcanoAtlas',
  description: 'Explore 150+ volcanoes on our interactive map. Filter by country, type, eruption status, and more. Click any volcano for detailed information.',
};

export default async function MapPage() {
  const markers = await getMapMarkers();

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interactive Volcano Map
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Explore {markers.length} volcanoes worldwide. Click any marker for detailed information.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-2xl font-bold text-amber-500">{markers.length}</div>
              <div className="text-sm text-gray-400">Total Volcanoes</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-2xl font-bold text-amber-500">
                {markers.filter(m => m.status?.toLowerCase().includes('active')).length}
              </div>
              <div className="text-sm text-gray-400">Active</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-2xl font-bold text-amber-500">
                {new Set(markers.map(m => m.country)).size}
              </div>
              <div className="text-sm text-gray-400">Countries</div>
            </div>
            <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
              <div className="text-2xl font-bold text-amber-500">
                {new Set(markers.map(m => m.type)).size}
              </div>
              <div className="text-sm text-gray-400">Types</div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="flex-1">
        <MapSection markers={markers} />
      </section>

      {/* Legend and Info */}
      <section className="bg-[#1a1a1a] py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Map Legend */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Map Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-amber-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Active Volcano</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Recently Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Dormant</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Highly Active</span>
                </div>
              </div>
            </div>

            {/* Map Instructions */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">How to Use</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Click any volcano marker to view basic information
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Use filters to narrow down volcanoes by country, type, or status
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Zoom in to see individual volcanoes in dense regions
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  Click "View Profile" in popup to get complete volcano details
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}