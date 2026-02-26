import { getAllRecentActivity, getAlertColorClass, getAlertLevelDescription } from '@/lib/volcanoAPIs';
import { getVolcanoCoordinatesByNames } from '@/lib/volcanoData';
import LatestEruptionsMap from '@/components/LatestEruptionsMap';

export const metadata = {
  title: 'Latest Volcanic Eruptions & Activity | Real-Time Updates',
  description: 'Live updates on volcanic eruptions and activity worldwide from USGS and Smithsonian Institution. Current alerts, warnings, and weekly reports.',
};

export default async function LatestEruptionsPage() {
  const { usVolcanoes, globalReports, lastUpdated } = await getAllRecentActivity();
  
  // Get coordinates for USGS volcanoes
  const usVolcanoNames = usVolcanoes.map(v => v.volcano_name);
  const usCoords = getVolcanoCoordinatesByNames(usVolcanoNames);
  
  // Combine all volcano locations for the map
  const mapMarkers = [
    // USGS elevated volcanoes with alert status
    ...usVolcanoes
      .map(volcano => {
        const coords = usCoords.get(volcano.volcano_name);
        if (!coords) return null;
        return {
          title: volcano.volcano_name,
          slug: `/volcano/${volcano.volcano_name.toLowerCase().replace(/\s+/g, '-')}`,
          lat: coords.lat,
          lon: coords.lon,
          country: 'United States',
          elevation: '0m',
          type: `Alert: ${volcano.color_code}`,
          last_eruption: 'Unknown',
          status: volcano.color_code
        };
      })
      .filter((marker): marker is NonNullable<typeof marker> => marker !== null),
    // Smithsonian weekly reports
    ...globalReports.filter(report => report.lat && report.lon).map(report => ({
      title: report.volcano_name,
      slug: `/volcano/${report.volcano_name.toLowerCase().replace(/\s+/g, '-')}`,
      lat: report.lat!,
      lon: report.lon!,
      country: report.country,
      elevation: '0m',
      type: 'Recent Activity',
      last_eruption: 'Recent',
      status: 'Recent Activity'
    }))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent mb-4">
            Latest Volcanic Activity
          </h1>
          <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
            Real-time updates on volcanic eruptions and activity worldwide from USGS and Smithsonian Institution
          </p>
          <p className="text-sm text-gray-500 text-center mt-2">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        </div>

        {/* Global Activity Map */}
        {mapMarkers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Current Activity Map</h2>
            <LatestEruptionsMap volcanoMarkers={mapMarkers} />
          </div>
        )}

        {/* USGS Elevated Volcanoes */}
        {usVolcanoes.length > 0 && (
          <div className="mb-12 bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></span>
              US Volcanoes - Current Alerts
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {usVolcanoes.map((volcano, index) => (
                <div key={index} className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{volcano.volcano_name}</h3>
                      <p className="text-gray-400">{volcano.obs_fullname}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-bold border ${getAlertColorClass(volcano.color_code)}`}>
                      {volcano.color_code}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-300 mb-1">Alert Level: {volcano.alert_level}</p>
                    <p className="text-sm text-gray-400">
                      {getAlertLevelDescription(volcano.alert_level, volcano.color_code)}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Updated: {new Date(volcano.sent_utc).toLocaleString()}</span>
                    {volcano.notice_url && (
                      <a 
                        href={volcano.notice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        Full Report →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Smithsonian Weekly Reports */}
        {globalReports.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6">
              Weekly Volcanic Activity Reports
            </h2>
            <p className="text-gray-400 mb-6">
              From Smithsonian Institution / USGS Weekly Volcanic Activity Report
            </p>
            
            <div className="space-y-6">
              {globalReports.map((report, index) => (
                <div key={`report-${index}`} className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">
                        <span>{report.volcano_name}</span>
                        <span className="text-gray-400 font-normal ml-2">({report.country})</span>
                      </h3>
                      {report.lat && report.lon && (
                        <span className="text-xs text-gray-500">
                          {report.lat.toFixed(3)}°, {report.lon.toFixed(3)}°
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-orange-400 font-semibold mb-3">
                      Activity Period: {report.date_range}
                    </p>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {report.description.length > 300 
                      ? report.description.substring(0, 300) + '...' 
                      : report.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Published: {new Date(report.pubDate).toLocaleDateString()}
                    </span>
                    {report.link && (
                      <a 
                        href={report.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 transition-colors text-sm"
                      >
                        Read Full Report →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Data Message */}
        {usVolcanoes.length === 0 && globalReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No current volcanic activity alerts or reports available.
            </p>
            <p className="text-gray-500 mt-2">
              Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}