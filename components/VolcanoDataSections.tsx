import Link from 'next/link';

interface VolcanoDataSectionsProps {
  volcanoData: {
    name: string;
    country: string;
    region: string;
    type: string;
    rockType: string;
    tectonicSetting: string;
    epoch: string;
    evidence: string;
    elevation: number;
    lastEruption?: number;
    volcanoNumber?: number | string;
  };
  stats?: {
    totalEruptions?: number;
    maxVEI?: number;
  };
}

export default function VolcanoDataSections({ volcanoData, stats }: VolcanoDataSectionsProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      {/* Volcanic Hazards and Risk Assessment */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Volcanic Hazards & Risk Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Primary Hazards</h3>
            <ul className="space-y-2 text-gray-300">
              {volcanoData.type.toLowerCase().includes('caldera') && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Pyroclastic flows and surges
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Large explosive eruptions (VEI 4+)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Ash fall and tephra deposits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Lahars and debris flows
                  </li>
                </>
              )}
              {volcanoData.type.toLowerCase().includes('stratovolcano') && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Pyroclastic flows
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Lava flows
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Volcanic bombs and ballistics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Lahars and mudflows
                  </li>
                </>
              )}
              {!volcanoData.type.toLowerCase().includes('caldera') && 
               !volcanoData.type.toLowerCase().includes('stratovolcano') && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Lava flows and fountaining
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Volcanic gas emissions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Local explosive activity
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Risk Level</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Population at Risk</span>
                <span className="font-semibold text-white">
                  {['Japan', 'Indonesia', 'Philippines', 'Italy', 'Iceland'].includes(volcanoData.country) ? 'High' : 
                   ['United States', 'Chile', 'Mexico', 'New Zealand'].includes(volcanoData.country) ? 'Moderate' : 'Low'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Infrastructure Risk</span>
                <span className="font-semibold text-white">
                  {volcanoData.lastEruption && volcanoData.lastEruption > 1900 ? 'High' : 'Moderate'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-gray-300">Aviation Risk</span>
                <span className="font-semibold text-white">Significant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Geological Composition & Structure */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Geological Composition & Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Rock Types</h3>
            <div className="space-y-2">
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <div className="font-semibold text-white">Primary</div>
                <div className="text-gray-300 text-sm">{volcanoData.rockType}</div>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <div className="font-semibold text-white">Silica Content</div>
                <div className="text-gray-300 text-sm">
                  {volcanoData.rockType.includes('Andesite') ? 'Intermediate (57-63% SiO₂)' :
                   volcanoData.rockType.includes('Basalt') ? 'Low (45-52% SiO₂)' :
                   volcanoData.rockType.includes('Rhyolite') ? 'High (>68% SiO₂)' :
                   volcanoData.rockType.includes('Dacite') ? 'High (63-68% SiO₂)' :
                   'Varied composition'}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Tectonic Setting</h3>
            <div className="p-3 bg-gray-700/50 rounded-lg">
              <div className="font-semibold text-white mb-2">{volcanoData.tectonicSetting.split('/')[0].trim()}</div>
              <div className="text-gray-300 text-sm">
                {volcanoData.tectonicSetting.includes('Subduction') ? 
                  'Formed by oceanic plate subduction, typically producing explosive eruptions due to water-rich magmas.' :
                  volcanoData.tectonicSetting.includes('Rift') ?
                  'Continental rift setting with varied eruptive styles and extensional tectonics.' :
                  'Intraplate setting with hotspot or regional volcanic activity.'}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Age & Formation</h3>
            <div className="space-y-2">
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <div className="font-semibold text-white">Epoch</div>
                <div className="text-gray-300 text-sm">{volcanoData.epoch}</div>
              </div>
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <div className="font-semibold text-white">Evidence</div>
                <div className="text-gray-300 text-sm">{volcanoData.evidence}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Eruption Statistics Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Eruption Statistics & Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="pb-3 text-orange-400 font-semibold">Metric</th>
                <th className="pb-3 text-orange-400 font-semibold">Value</th>
                <th className="pb-3 text-orange-400 font-semibold">Global Ranking</th>
                <th className="pb-3 text-orange-400 font-semibold">Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              <tr>
                <td className="py-3 text-gray-300">Total Recorded Eruptions</td>
                <td className="py-3 text-white font-semibold">{stats?.totalEruptions || 'Unknown'}</td>
                <td className="py-3 text-gray-300">
                  {stats?.totalEruptions && stats.totalEruptions > 50 ? 'Very High' :
                   stats?.totalEruptions && stats.totalEruptions > 20 ? 'High' :
                   stats?.totalEruptions && stats.totalEruptions > 10 ? 'Moderate' : 'Low'}
                </td>
                <td className="py-3 text-gray-300">
                  {stats?.totalEruptions && stats.totalEruptions > 50 ? 'Extremely active volcano' :
                   stats?.totalEruptions && stats.totalEruptions > 20 ? 'Highly active volcano' :
                   'Moderately active volcano'}
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-300">Maximum VEI</td>
                <td className="py-3 text-white font-semibold">VEI {stats?.maxVEI || 'Unknown'}</td>
                <td className="py-3 text-gray-300">
                  {stats?.maxVEI && stats.maxVEI >= 6 ? 'Catastrophic' :
                   stats?.maxVEI && stats.maxVEI >= 4 ? 'Major' :
                   stats?.maxVEI && stats.maxVEI >= 3 ? 'Moderate' : 'Minor'}
                </td>
                <td className="py-3 text-gray-300">
                  {stats?.maxVEI && stats.maxVEI >= 6 ? 'Global climate impact potential' :
                   stats?.maxVEI && stats.maxVEI >= 4 ? 'Regional impact potential' :
                   'Local impact potential'}
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-300">Recent Activity</td>
                <td className="py-3 text-white font-semibold">
                  {volcanoData.lastEruption ? `${currentYear - volcanoData.lastEruption} years ago` : 'Unknown'}
                </td>
                <td className="py-3 text-gray-300">
                  {volcanoData.lastEruption && currentYear - volcanoData.lastEruption < 10 ? 'Very Recent' :
                   volcanoData.lastEruption && currentYear - volcanoData.lastEruption < 50 ? 'Recent' :
                   'Historical'}
                </td>
                <td className="py-3 text-gray-300">
                  {volcanoData.lastEruption && currentYear - volcanoData.lastEruption < 10 ? 'Currently active' :
                   volcanoData.lastEruption && currentYear - volcanoData.lastEruption < 100 ? 'Recently active' :
                   'Historically active'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Monitoring & Alert Status */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Monitoring & Alert Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Monitoring Networks</h3>
            <div className="space-y-3">
              {volcanoData.country === 'Japan' && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-white">Japan Meteorological Agency (JMA)</div>
                      <div className="text-gray-300 text-sm">Real-time seismic monitoring</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-white">Geological Survey of Japan</div>
                      <div className="text-gray-300 text-sm">Geochemical monitoring</div>
                    </div>
                  </div>
                </>
              )}
              {volcanoData.country === 'United States' && (
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-white">USGS Volcano Hazards Program</div>
                    <div className="text-gray-300 text-sm">Comprehensive monitoring network</div>
                  </div>
                </div>
              )}
              {volcanoData.country === 'Italy' && (
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-white">INGV Observatory</div>
                    <div className="text-gray-300 text-sm">National Institute of Geophysics</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="font-semibold text-white">Global Volcanism Program</div>
                  <div className="text-gray-300 text-sm">International eruption database</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-3">Current Status</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-orange-400">
                    {volcanoData.lastEruption && currentYear - volcanoData.lastEruption < 10 ? 'Active' :
                     volcanoData.lastEruption && currentYear - volcanoData.lastEruption < 50 ? 'Watch' :
                     'Normal'}
                  </span>
                </div>
                <div className="text-gray-300 text-sm">
                  {volcanoData.lastEruption && currentYear - volcanoData.lastEruption < 10 ? 
                    'Recent volcanic activity detected. Continuous monitoring in place.' :
                   volcanoData.lastEruption && currentYear - volcanoData.lastEruption < 50 ?
                    'Dormant but monitored. Capable of renewed activity.' :
                    'No recent activity. Routine monitoring continues.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authority Links */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-3">Authority Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href={volcanoData.volcanoNumber ? `https://volcano.si.edu/volcano.cfm?vn=${volcanoData.volcanoNumber}` : 'https://volcano.si.edu/'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div>
              <div className="text-sm font-semibold text-white">Smithsonian GVP</div>
              <div className="text-xs text-gray-400">Official volcano database</div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          
          {volcanoData.country === 'Japan' && (
            <a
              href="https://www.jma.go.jp/jma/en/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div>
                <div className="text-sm font-semibold text-white">JMA Volcano Info</div>
                <div className="text-xs text-gray-400">Japan Meteorological Agency</div>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {volcanoData.country === 'United States' && (
            <a
              href="https://www.usgs.gov/natural-hazards/volcano-hazards"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div>
                <div className="text-sm font-semibold text-white">USGS Volcano Hazards</div>
                <div className="text-xs text-gray-400">U.S. Geological Survey</div>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Internal Links */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-3">Related Volcanoes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link 
            href={`/volcanoes-in-${volcanoData.country.toLowerCase().replace(/\s+/g, '-')}`}
            className="block p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors"
          >
            <div className="text-sm font-semibold text-amber-400">All {volcanoData.country} Volcanoes</div>
            <div className="text-xs text-gray-400">Explore by country</div>
          </Link>
          
          <Link 
            href={`/volcano-types/${volcanoData.type.toLowerCase().replace(/\s+/g, '-')}`}
            className="block p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            <div className="text-sm font-semibold text-blue-400">{volcanoData.type} Volcanoes</div>
            <div className="text-xs text-gray-400">By volcano type</div>
          </Link>
          
          <Link 
            href={`/region/${volcanoData.region.toLowerCase().replace(/\s+/g, '-')}`}
            className="block p-3 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors"
          >
            <div className="text-sm font-semibold text-green-400">{volcanoData.region}</div>
            <div className="text-xs text-gray-400">Regional volcanoes</div>
          </Link>
        </div>
      </div>
    </>
  );
}