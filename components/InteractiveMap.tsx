'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

import { MapMarker } from '@/lib/data';

interface InteractiveMapProps {
  markers: MapMarker[];
}

// Create custom icon for volcanoes
const volcanoIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L7 12H17L12 2Z" fill="#f59e0b"/>
      <path d="M5 12L8 20H16L19 12H5Z" fill="#dc2626"/>
      <circle cx="12" cy="8" r="1" fill="#fbbf24"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

export default function InteractiveMap({ markers }: InteractiveMapProps) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="w-full h-full"
      style={{ background: '#0f0f0f' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lon]}
          icon={volcanoIcon}
        >
          <Popup className="volcano-popup">
            <div className="p-2">
              <h3 className="font-bold text-lg mb-1">{marker.title}</h3>
              <p className="text-sm text-gray-600">{marker.country}</p>
              <div className="mt-2 space-y-1 text-xs">
                <p><strong>Type:</strong> {marker.type}</p>
                <p><strong>Elevation:</strong> {marker.elevation}</p>
                <p><strong>Last Eruption:</strong> {marker.last_eruption}</p>
              </div>
              <a
                href={marker.slug}
                className="inline-block mt-3 px-3 py-1 bg-amber-500 text-white text-xs rounded hover:bg-amber-600 transition-colors"
              >
                View Profile →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}