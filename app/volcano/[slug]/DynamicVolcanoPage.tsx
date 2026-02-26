import Image from 'next/image';
import Link from 'next/link';
import { formatElevation } from '@/lib/volcanoDynamicData';
import VolcanoLocationMap from '@/components/VolcanoLocationMap';
import { fetchVolcanoPhotos } from '@/lib/unsplash';
import EruptionTimeline from '@/components/EruptionTimeline';
import { generateEstimatedEruptions } from '@/lib/eruption-data';

interface DynamicVolcanoProps {
  volcanoData: any;
  stats: any;
  photos: any[];
}

export default function DynamicVolcanoPage({ volcanoData, stats, photos }: DynamicVolcanoProps) {
  const { properties: props } = volcanoData;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Compact Header Section */}
      <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm mb-4">
              <ol className="flex items-center space-x-2 text-gray-400">
                <li><Link href="/" className="hover:text-amber-500">Home</Link></li>
                <li>/</li>
                <li><Link href="/countries" className="hover:text-amber-500">Countries</Link></li>
                <li>/</li>
                <li>
                  <Link 
                    href={`/volcanoes-in-${props.Country.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-amber-500"
                  >
                    {props.Country}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-white">{props.Volcano_Name}</li>
              </ol>
            </nav>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              {props.Volcano_Name}
            </h1>
            <p className="text-lg text-gray-300 mb-4">
              {props.Primary_Volcano_Type} in {props.Country}
            </p>
            
            {/* Status Badge */}
            {props.Last_Eruption_Year && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-lg mt-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-orange-400 text-sm font-semibold">
                  Last Eruption: {props.Last_Eruption_Year}
                </span>
              </div>
            )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Key Facts Box - FIRST */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">Key Facts</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Elevation</p>
                  <p className="text-white font-semibold">{formatElevation(props.Elevation)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Type</p>
                  <p className="text-white font-semibold">{props.Primary_Volcano_Type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white font-semibold">{props.Latitude.toFixed(3)}°, {props.Longitude.toFixed(3)}°</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Region</p>
                  <p className="text-white font-semibold">{props.Subregion || props.Region}</p>
                </div>
                {stats?.totalEruptions && (
                  <div>
                    <p className="text-gray-400 text-sm">Total Eruptions</p>
                    <p className="text-white font-semibold">{stats.totalEruptions}</p>
                  </div>
                )}
                {stats?.maxVEI && (
                  <div>
                    <p className="text-gray-400 text-sm">Max VEI</p>
                    <p className="text-white font-semibold">VEI {stats.maxVEI}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 text-sm">Rock Type</p>
                  <p className="text-white font-semibold">{props.Major_Rock_Type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tectonic Setting</p>
                  <p className="text-white font-semibold">{props.Tectonic_Setting.split('/')[0].trim()}</p>
                </div>
              </div>
            </div>

            {/* 2. Location Map - SECOND */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">Location</h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <VolcanoLocationMap 
                  volcano={{
                    name: props.Volcano_Name,
                    coordinates: {
                      lat: props.Latitude,
                      lon: props.Longitude
                    },
                    country: props.Country,
                    region: props.Region,
                    status: props.Last_Eruption_Year ? `Active (Last eruption: ${props.Last_Eruption_Year})` : 'Unknown',
                    elevation_m: props.Elevation,
                    type: props.Primary_Volcano_Type
                  }}
                />
              </div>
            </div>

            {/* 3. Eruption Timeline - THIRD */}
            {(props.Last_Eruption_Year || stats?.totalEruptions) && (
              <div>
                {(() => {
                  const eruptions = generateEstimatedEruptions(
                    props.Last_Eruption_Year,
                    stats?.totalEruptions || 0,
                    props.Volcano_Name
                  );
                  
                  // Convert to the format EruptionTimeline expects
                  const timelineEvents = eruptions.map(e => ({
                    year: e.year,
                    vei: e.vei || null,
                    label: e.description,
                    deaths: null,
                    notable: !e.estimated && e.year === props.Last_Eruption_Year
                  }));
                  
                  return <EruptionTimeline events={timelineEvents} />;
                })()}
              </div>
            )}

            {/* 4. Overview - FOURTH with formatted text */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              <div className="prose prose-lg prose-invert max-w-none">
                {(() => {
                  // Split the geological summary into sentences
                  const sentences = props.Geological_Summary.match(/[^.!?]+[.!?]+/g) || [];
                  const paragraphs = [];
                  
                  // Group sentences into paragraphs of max 3 sentences
                  for (let i = 0; i < sentences.length; i += 3) {
                    const paragraph = sentences.slice(i, i + 3).join(' ').trim();
                    paragraphs.push(paragraph);
                  }
                  
                  return (
                    <div className="space-y-4">
                      {paragraphs.map((paragraph, index) => (
                        <p key={index} className="text-gray-300 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Volcanic Hazards and Risk Assessment */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">Volcanic Hazards & Risk Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">Primary Hazards</h3>
                  <ul className="space-y-2 text-gray-300">
                    {props.Primary_Volcano_Type === 'Caldera' && (
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
                    {props.Primary_Volcano_Type === 'Stratovolcano' && (
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
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">Risk Level</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-gray-300">Population at Risk</span>
                      <span className="font-semibold text-white">
                        {props.Country === 'Japan' ? 'High' : 'Moderate'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <span className="text-gray-300">Infrastructure Risk</span>
                      <span className="font-semibold text-white">
                        {props.Last_Eruption_Year && props.Last_Eruption_Year > 1900 ? 'High' : 'Moderate'}
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
                      <div className="text-gray-300 text-sm">{props.Major_Rock_Type}</div>
                    </div>
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="font-semibold text-white">Silica Content</div>
                      <div className="text-gray-300 text-sm">
                        {props.Major_Rock_Type.includes('Andesite') ? 'Intermediate (57-63% SiO₂)' :
                         props.Major_Rock_Type.includes('Basalt') ? 'Low (45-52% SiO₂)' :
                         props.Major_Rock_Type.includes('Rhyolite') ? 'High (>68% SiO₂)' :
                         'Varied composition'}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">Tectonic Setting</h3>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="font-semibold text-white mb-2">{props.Tectonic_Setting.split('/')[0].trim()}</div>
                    <div className="text-gray-300 text-sm">
                      {props.Tectonic_Setting.includes('Subduction') ? 
                        'Formed by oceanic plate subduction, typically producing explosive eruptions due to water-rich magmas.' :
                        'Continental rift or intraplate setting with varied eruptive styles.'}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">Age & Formation</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="font-semibold text-white">Epoch</div>
                      <div className="text-gray-300 text-sm">{props.Geologic_Epoch}</div>
                    </div>
                    <div className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="font-semibold text-white">Evidence</div>
                      <div className="text-gray-300 text-sm">{props.Evidence_Category}</div>
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
                        {stats?.totalEruptions > 50 ? 'Very High' :
                         stats?.totalEruptions > 20 ? 'High' :
                         stats?.totalEruptions > 10 ? 'Moderate' : 'Low'}
                      </td>
                      <td className="py-3 text-gray-300">
                        {stats?.totalEruptions > 50 ? 'Extremely active volcano' :
                         stats?.totalEruptions > 20 ? 'Highly active volcano' :
                         'Moderately active volcano'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-300">Maximum VEI</td>
                      <td className="py-3 text-white font-semibold">VEI {stats?.maxVEI || 'Unknown'}</td>
                      <td className="py-3 text-gray-300">
                        {stats?.maxVEI >= 6 ? 'Catastrophic' :
                         stats?.maxVEI >= 4 ? 'Major' :
                         stats?.maxVEI >= 3 ? 'Moderate' : 'Minor'}
                      </td>
                      <td className="py-3 text-gray-300">
                        {stats?.maxVEI >= 6 ? 'Global climate impact potential' :
                         stats?.maxVEI >= 4 ? 'Regional impact potential' :
                         'Local impact potential'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 text-gray-300">Recent Activity</td>
                      <td className="py-3 text-white font-semibold">
                        {props.Last_Eruption_Year ? `${new Date().getFullYear() - props.Last_Eruption_Year} years ago` : 'Unknown'}
                      </td>
                      <td className="py-3 text-gray-300">
                        {props.Last_Eruption_Year && new Date().getFullYear() - props.Last_Eruption_Year < 10 ? 'Very Recent' :
                         props.Last_Eruption_Year && new Date().getFullYear() - props.Last_Eruption_Year < 50 ? 'Recent' :
                         'Historical'}
                      </td>
                      <td className="py-3 text-gray-300">
                        {props.Last_Eruption_Year && new Date().getFullYear() - props.Last_Eruption_Year < 10 ? 'Currently active' :
                         props.Last_Eruption_Year && new Date().getFullYear() - props.Last_Eruption_Year < 100 ? 'Recently active' :
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
                    {props.Country === 'Japan' && (
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
                          {props.Last_Eruption_Year && new Date().getFullYear() - props.Last_Eruption_Year < 10 ? 'Active' :
                           props.Last_Eruption_Year && new Date().getFullYear() - props.Last_Eruption_Year < 50 ? 'Watch' :
                           'Normal'}
                        </span>
                      </div>
                      <div className="text-gray-300 text-sm">
                        {props.Last_Eruption_Year && new Date().getFullYear() - props.Last_Eruption_Year < 10 ? 
                          'Recent volcanic activity detected. Continuous monitoring in place.' :
                         props.Last_Eruption_Year && new Date().getFullYear() - props.Last_Eruption_Year < 50 ?
                          'Dormant but monitored. Capable of renewed activity.' :
                          'No recent activity. Routine monitoring continues.'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Volcanoes in Region */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">Nearby Volcanoes in {props.Region}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {props.Country === 'Japan' && props.Region === 'Kuril Volcanic Arc' && (
                  <>
                    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <h3 className="font-semibold text-white mb-2">Kussharo</h3>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>Type: Caldera</div>
                        <div>Distance: ~15 km NE</div>
                        <div>Last Eruption: ~1000 years ago</div>
                        <div>Status: <span className="text-blue-400">Dormant</span></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <h3 className="font-semibold text-white mb-2">Mashu</h3>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>Type: Caldera</div>
                        <div>Distance: ~20 km E</div>
                        <div>Last Eruption: ~7000 years ago</div>
                        <div>Status: <span className="text-green-400">Quiet</span></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                      <h3 className="font-semibold text-white mb-2">Rausu</h3>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>Type: Stratovolcano</div>
                        <div>Distance: ~45 km NE</div>
                        <div>Last Eruption: Historical</div>
                        <div>Status: <span className="text-yellow-400">Monitored</span></div>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="col-span-full mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-amber-400">Regional Volcanic Activity</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    The {props.Region} contains multiple active volcanic systems. Cross-regional magma interactions 
                    and tectonic stresses can influence eruption patterns across the entire arc. Monitor regional 
                    seismic activity and volcanic alerts.
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            {photos && photos.length > 1 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.slice(0, 6).map((photo, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={photo.urls.regular}
                        alt={`${props.Volcano_Name} ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Photos from Unsplash contributors
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-3">Quick Info</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span className="text-gray-300">
                    Smithsonian ID: {props.Volcano_Number}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span className="text-gray-300">
                    Evidence: {props.Evidence_Category}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span className="text-gray-300">
                    Epoch: {props.Geologic_Epoch}
                  </span>
                </li>
              </ul>
            </div>

            {/* Photo Credit */}
            {props.Primary_Photo_Caption && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-3">About the Photo</h3>
                <p className="text-sm text-gray-300 mb-2">
                  {props.Primary_Photo_Caption}
                </p>
                <p className="text-xs text-gray-500">
                  {props.Primary_Photo_Credit}
                </p>
              </div>
            )}

            {/* External Authority Links */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">Authority Sources</h3>
              <div className="space-y-2">
                <a
                  href={`https://volcano.si.edu/volcano.cfm?vn=${props.Volcano_Number}`}
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
                
                {props.Country === 'Japan' && (
                  <>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <a
                      href="https://gbank.gsj.jp/volcano/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">GSJ Volcano Database</div>
                        <div className="text-xs text-gray-400">Geological Survey of Japan</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </>
                )}
                
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                <a
                  href="https://www.volcano.si.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">Global Volcanism Program</div>
                    <div className="text-xs text-gray-400">Smithsonian Institution</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Related Volcanoes & Internal Links */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">Related Volcanoes</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-400 mb-2">In {props.Country}:</div>
                <Link href="/volcanoes-in-japan" className="block p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-colors">
                  <div className="text-sm font-semibold text-amber-400">All Japan Volcanoes</div>
                  <div className="text-xs text-gray-400">105 active volcanoes</div>
                </Link>
                
                <div className="text-sm text-gray-400 mb-2 mt-4">By Type:</div>
                <Link href="/volcano-types/caldera" className="block p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors">
                  <div className="text-sm font-semibold text-blue-400">Caldera Volcanoes</div>
                  <div className="text-xs text-gray-400">Large collapse features</div>
                </Link>
                
                <div className="text-sm text-gray-400 mb-2 mt-4">By Region:</div>
                <Link href="/region/kuril-volcanic-arc" className="block p-3 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors">
                  <div className="text-sm font-semibold text-green-400">Kuril Volcanic Arc</div>
                  <div className="text-xs text-gray-400">Subduction zone volcanoes</div>
                </Link>
              </div>
            </div>

            {/* Data Notice */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-blue-300 font-semibold mb-1">
                    Basic Information
                  </p>
                  <p className="text-xs text-gray-400">
                    This page shows basic data from the Smithsonian Global Volcanism Program. 
                    For more detailed information, visit the official Smithsonian page.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}