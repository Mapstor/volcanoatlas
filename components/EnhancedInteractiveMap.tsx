'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarker } from '@/lib/data';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface EnhancedInteractiveMapProps {
  markers: MapMarker[];
}

// Create different icons based on volcano status
const createVolcanoIcon = (status: string) => {
  let color = '#f59e0b'; // Default amber

  if (status && status.toLowerCase().includes('active')) {
    color = '#ef4444'; // Red for active
  } else if (status && status.toLowerCase().includes('dormant')) {
    color = '#6b7280'; // Gray for dormant
  } else if (status && status.toLowerCase().includes('recent')) {
    color = '#f97316'; // Orange for recently active
  }

  return new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="13" fill="${color}" stroke="#000" stroke-width="1"/>
        <path d="M14 4L9 14H19L14 4Z" fill="#fff"/>
        <path d="M7 14L10 22H18L21 14H7Z" fill="#000" fill-opacity="0.3"/>
        <circle cx="14" cy="10" r="1.5" fill="#fbbf24"/>
      </svg>
    `),
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

// Component to handle map bounds when markers change
function MapBoundsController({ markers }: { markers: MapMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(marker => [marker.lat, marker.lon]));
      
      // Always fit bounds for country-specific views or small sets
      // Add more padding for better visibility
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 10, // Don't zoom in too much
        animate: true,
        duration: 0.5
      });
    }
  }, [markers, map]);

  return null;
}

export default function EnhancedInteractiveMap({ markers }: EnhancedInteractiveMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Calculate initial center based on markers
  const initialCenter = markers.length > 0 
    ? [
        markers.reduce((sum, m) => sum + m.lat, 0) / markers.length,
        markers.reduce((sum, m) => sum + m.lon, 0) / markers.length
      ] as [number, number]
    : [20, 0] as [number, number];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={initialCenter}
        zoom={markers.length > 0 ? 5 : 2}
        className="w-full h-full"
        style={{ background: '#0f0f0f' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapBoundsController markers={markers} />
        
        {markers && markers.length > 0 && markers.map((marker, index) => (
          <Marker
            key={`${marker.slug}-${index}`}
            position={[marker.lat, marker.lon]}
            icon={createVolcanoIcon(marker.status || 'Unknown')}
            eventHandlers={{
              click: () => setSelectedMarker(marker),
            }}
          >
            <Popup
              className="volcano-popup"
              closeButton={true}
              closeOnClick={false}
              autoClose={false}
              maxWidth={300}
            >
              <div className="p-3">
                <h3 className="font-bold text-lg mb-2 text-gray-900">{marker.title}</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Country:</span>
                    <span>{marker.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Type:</span>
                    <span>{marker.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      marker.status && marker.status.toLowerCase().includes('active') 
                        ? 'bg-red-100 text-red-800' 
                        : marker.status && marker.status.toLowerCase().includes('dormant')
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {marker.status || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Elevation:</span>
                    <span>{marker.elevation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Eruption:</span>
                    <span className="text-right">{marker.last_eruption}</span>
                  </div>
                </div>
                {marker.slug ? (
                  <a
                    href={marker.slug}
                    className="inline-block mt-3 px-4 py-2 bg-amber-500 text-white text-sm rounded-md hover:bg-amber-600 transition-colors font-medium w-full text-center"
                  >
                    View Full Profile →
                  </a>
                ) : (
                  <div className="mt-3 px-4 py-2 bg-gray-600 text-gray-300 text-sm rounded-md text-center italic">
                    Basic data only - No detailed page available
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Stats Overlay */}
      {markers && markers.length > 0 && (
        <div className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-sm z-50">
          <div className="space-y-1">
            <div>Volcanoes: {markers.length}</div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Active ({markers.filter(m => m.status && m.status.toLowerCase().includes('active')).length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Recent ({markers.filter(m => m.status && m.status.toLowerCase().includes('recent')).length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Dormant ({markers.filter(m => m.status && m.status.toLowerCase().includes('dormant')).length})</span>
            </div>
          </div>
        </div>
      )}

      {/* Instructions overlay for first-time users */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-sm z-50 max-w-xs">
        <div className="text-xs text-gray-300">
          💡 Click any volcano marker for details, or use filters above to narrow your search.
        </div>
      </div>

      {/* Custom CSS for darker popups */}
      <style jsx global>{`
        .volcano-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .volcano-popup .leaflet-popup-tip {
          background: white;
        }
        
        .volcano-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1.4;
        }
        
        .volcano-popup .leaflet-popup-close-button {
          color: #374151;
          font-size: 18px;
          font-weight: bold;
        }
        
        .volcano-popup .leaflet-popup-close-button:hover {
          color: #111827;
        }
      `}</style>
    </div>
  );
}