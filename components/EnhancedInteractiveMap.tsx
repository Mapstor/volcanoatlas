'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapMarker } from '@/lib/data';

interface EnhancedInteractiveMapProps {
  markers: MapMarker[];
}

// Marker groups are based only on the year of the last known eruption.
export const ERUPTION_GROUPS = [
  { label: 'Erupted since 2000', color: '#ef4444' },
  { label: 'Erupted 1900–1999', color: '#f59e0b' },
  { label: 'Before 1900 or undated', color: '#9ca3af' },
] as const;

function colorFor(status?: string) {
  return ERUPTION_GROUPS.find((g) => g.label === status)?.color ?? '#f59e0b';
}

const iconCache = new Map<string, L.Icon>();

function volcanoIcon(color: string) {
  const cached = iconCache.get(color);
  if (cached) return cached;
  const svg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="${color}" stroke="#0a0a0a" stroke-width="1.5"/><path d="M6 17l4.5-8 1.5 1.6L13.5 9 18 17z" fill="#0a0a0a"/></svg>`;
  const icon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svg),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
  iconCache.set(color, icon);
  return icon;
}

// Fit the view to the markers whenever they change
function MapBoundsController({ markers }: { markers: MapMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((marker) => [marker.lat, marker.lon]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }
  }, [markers, map]);

  return null;
}

export default function EnhancedInteractiveMap({ markers }: EnhancedInteractiveMapProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={1}
      className="w-full h-full"
      style={{ background: '#aad3df' }}
      scrollWheelZoom={false}
      zoomControl={true}
      worldCopyJump={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={18}
      />

      <MapBoundsController markers={markers} />

      {markers.map((marker, index) => (
        <Marker key={`${marker.title}-${index}`} position={[marker.lat, marker.lon]} icon={volcanoIcon(marker.color ?? colorFor(marker.status))}>
          <Popup className="volcano-popup" maxWidth={280}>
            <div className="p-1">
              <h3 className="font-bold text-base mb-2 text-gray-900">{marker.title}</h3>
              <dl className="space-y-1 text-sm text-gray-700">
                {marker.country && (
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium">Country</dt>
                    <dd>{marker.country}</dd>
                  </div>
                )}
                {marker.type && (
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium">Type</dt>
                    <dd className="text-right">{marker.type}</dd>
                  </div>
                )}
                {marker.elevation && (
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium">Elevation</dt>
                    <dd>{marker.elevation}</dd>
                  </div>
                )}
                {marker.last_eruption && (
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium">Last known eruption</dt>
                    <dd className="text-right">{marker.last_eruption}</dd>
                  </div>
                )}
              </dl>
              {marker.slug && (
                <a
                  href={marker.slug}
                  className="inline-block mt-3 px-4 py-2 bg-amber-500 !text-black text-sm rounded-md hover:bg-amber-600 transition-colors font-semibold w-full text-center"
                >
                  Open {marker.title}
                </a>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
