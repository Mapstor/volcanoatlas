'use client';

import dynamic from 'next/dynamic';
import { useMemo, useEffect, useState } from 'react';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });

interface VolcanoLocationMapProps {
  // New unified interface
  volcano?: {
    name: string;
    coordinates: { lat: number; lon: number };
    elevation_m: number;
    type: string;
    country: string;
    region: string;
    status: string;
  };
  // Legacy interface support
  lat?: number;
  lon?: number;
  volcanoName?: string;
  zoom?: number;
  height?: string;
}

export default function VolcanoLocationMap({ volcano, lat, lon, volcanoName, zoom = 8, height = "h-full" }: VolcanoLocationMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Handle both new and legacy interfaces
  const volcanoData = volcano || {
    name: volcanoName || 'Unknown Volcano',
    coordinates: { lat: lat || 0, lon: lon || 0 },
    elevation_m: 0,
    type: 'Unknown',
    country: 'Unknown',
    region: 'Unknown',
    status: 'Unknown'
  };

  const position: [number, number] = useMemo(
    () => [volcanoData.coordinates.lat, volcanoData.coordinates.lon],
    [volcanoData.coordinates]
  );

  useEffect(() => {
    // Simulate loading and check for map availability
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Return null if no valid volcano data
  if (!volcanoData.coordinates.lat || !volcanoData.coordinates.lon) {
    return (
      <div className={`relative ${height} w-full rounded-xl bg-gray-800 flex items-center justify-center`}>
        <p className="text-gray-400">Map unavailable</p>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`relative ${height} w-full rounded-xl bg-gray-800 flex items-center justify-center`}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-300">Loading map...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (mapError) {
    return (
      <div className={`relative ${height} w-full rounded-xl bg-gray-800 flex flex-col items-center justify-center gap-3`}>
        <p className="text-gray-400">Map temporarily unavailable</p>
        <button 
          onClick={() => { setMapError(false); setIsLoading(true); }}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  try {
    return (
      <div className={`relative ${height} w-full rounded-xl overflow-hidden`}>
        <MapContainer 
          center={position} 
          zoom={zoom} 
          className="h-full w-full"
          style={{ background: '#0a0a0a' }}
          scrollWheelZoom={false}
          zoomControl={true}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Main volcano marker with pulsing effect */}
        <CircleMarker
          center={position}
          radius={15}
          pathOptions={{
            fillColor: '#FF4500',
            color: '#FF6B35',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <div className="text-sm">
              <div className="font-bold text-base mb-2">{volcanoData.name}</div>
              <div className="space-y-1">
                <div><strong>Location:</strong> {volcanoData.region}, {volcanoData.country}</div>
                {volcanoData.elevation_m > 0 && (
                  <div><strong>Elevation:</strong> {volcanoData.elevation_m.toLocaleString()} m</div>
                )}
                <div><strong>Type:</strong> {volcanoData.type}</div>
                <div><strong>Status:</strong> <span className={volcanoData.status && volcanoData.status.toLowerCase().includes('active') ? 'text-red-600 font-bold' : ''}>{volcanoData.status}</span></div>
                <div><strong>Coordinates:</strong> {volcanoData.coordinates.lat}°, {volcanoData.coordinates.lon}°</div>
              </div>
            </div>
          </Popup>
        </CircleMarker>

        {/* Outer ring for visual emphasis */}
        <CircleMarker
          center={position}
          radius={25}
          pathOptions={{
            fillColor: '#FF6B35',
            color: '#FF6B35',
            weight: 2,
            opacity: 0.6,
            fillOpacity: 0.15,
          }}
        />
        
        {/* Inner pulsing ring */}
        <CircleMarker
          center={position}
          radius={8}
          pathOptions={{
            fillColor: '#FFFFFF',
            color: '#FFFFFF',
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.6,
          }}
        />
      </MapContainer>

      {/* Map overlay gradient for better integration with dark theme */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
      </div>

      <style jsx global>{`
        
        /* Pulsing animation for the volcano marker */
        .leaflet-pane .leaflet-overlay-pane svg path:first-child {
          animation: volcanoGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes volcanoGlow {
          0%, 100% {
            opacity: 0.9;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
        
        /* Enhanced pulsing for outer ring */
        .leaflet-pane .leaflet-overlay-pane svg path:nth-child(2) {
          animation: outerPulse 3s ease-in-out infinite;
        }
        
        @keyframes outerPulse {
          0%, 100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.3;
          }
        }

        /* Style the zoom controls */
        .leaflet-control-zoom {
          border: 1px solid rgba(255, 107, 53, 0.3) !important;
          background: rgba(10, 10, 10, 0.9) !important;
        }
        
        .leaflet-control-zoom a {
          color: #FF6B35 !important;
          background: transparent !important;
          border-bottom: 1px solid rgba(255, 107, 53, 0.2) !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: rgba(255, 107, 53, 0.1) !important;
        }

        /* Style the popup */
        .leaflet-popup-content-wrapper {
          background: rgba(10, 10, 10, 0.95) !important;
          color: white !important;
          border: 1px solid rgba(255, 107, 53, 0.3) !important;
          border-radius: 8px !important;
        }
        
        .leaflet-popup-tip {
          background: rgba(10, 10, 10, 0.95) !important;
          border: 1px solid rgba(255, 107, 53, 0.3) !important;
        }

        /* Attribution styling */
        .leaflet-control-attribution {
          background: rgba(10, 10, 10, 0.7) !important;
          color: rgba(255, 255, 255, 0.5) !important;
          font-size: 10px !important;
        }
        
        .leaflet-control-attribution a {
          color: #FF6B35 !important;
        }
      `}</style>
    </div>
  );
  } catch (error) {
    console.error('Map loading error:', error);
    return (
      <div className={`relative ${height} w-full rounded-xl bg-gray-800 flex flex-col items-center justify-center gap-3`}>
        <p className="text-gray-400">Map failed to load</p>
        <p className="text-xs text-gray-500">Location: {volcanoData.coordinates.lat}°, {volcanoData.coordinates.lon}°</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
        >
          Reload Page
        </button>
      </div>
    );
  }
}