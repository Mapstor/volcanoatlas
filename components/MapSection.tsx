'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MapMarker } from '@/lib/data';

// The map needs the browser, so it loads after the page.
const DynamicMap = dynamic(() => import('./EnhancedInteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
      <div className="text-amber-500">Loading map...</div>
    </div>
  ),
});

const GROUPS = [
  { label: 'Erupted since 2000', color: '#ef4444' },
  { label: 'Erupted 1900–1999', color: '#f59e0b' },
  { label: 'Before 1900 or undated', color: '#9ca3af' },
];

interface MapSectionProps {
  markers: MapMarker[];
  showControls?: boolean;
  defaultCountry?: string;
  /** Tailwind height class for the map area. */
  heightClass?: string;
}

export default function MapSection({ markers, showControls = true, defaultCountry = '', heightClass = 'h-[480px] md:h-[600px]' }: MapSectionProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const countries = useMemo(() => Array.from(new Set(markers.map((m) => m.country).filter(Boolean))).sort(), [markers]);
  const types = useMemo(() => Array.from(new Set(markers.map((m) => m.type).filter(Boolean))).sort(), [markers]);

  const filteredMarkers = useMemo(() => {
    return markers.filter((marker) => {
      const matchesCountry = !selectedCountry || marker.country === selectedCountry;
      const matchesType = !selectedType || marker.type === selectedType;
      const matchesStatus = !selectedStatus || marker.status === selectedStatus;
      const matchesSearch =
        !searchTerm ||
        marker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (marker.country || '').toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCountry && matchesType && matchesStatus && matchesSearch;
    });
  }, [markers, selectedCountry, selectedType, selectedStatus, searchTerm]);

  const hasFilters = Boolean(selectedCountry || selectedType || selectedStatus || searchTerm);

  const clearFilters = () => {
    setSelectedCountry('');
    setSelectedType('');
    setSelectedStatus('');
    setSearchTerm('');
  };

  const inputClass =
    'w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500';

  return (
    <div>
      {showControls && (
        <div className="bg-[#1a1a1a] border-b border-gray-800 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="search"
              aria-label="Search volcanoes on the map"
              placeholder="Search volcanoes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClass} lg:col-span-2`}
            />
            {countries.length > 1 && (
              <select aria-label="Country" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className={inputClass}>
                <option value="">All countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            )}
            <select aria-label="Volcano type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className={inputClass}>
              <option value="">All types</option>
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select aria-label="Last eruption" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={inputClass}>
              <option value="">Any last eruption</option>
              {GROUPS.map((group) => (
                <option key={group.label} value={group.label}>{group.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-sm text-gray-400">
            <span>
              Showing {filteredMarkers.length} of {markers.length} volcanoes
            </span>
            {hasFilters && (
              <button onClick={clearFilters} className="px-3 py-1 bg-amber-500 text-black rounded-md hover:bg-amber-600 transition-colors font-medium">
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      <div className={`${heightClass} bg-[#0f0f0f] relative z-0`}>
        <DynamicMap markers={filteredMarkers} />
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-1 px-4 py-3 bg-[#1a1a1a] text-xs text-gray-300" aria-label="Map legend">
        {GROUPS.map((group) => (
          <li key={group.label} className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} aria-hidden="true"></span>
            {group.label} ({filteredMarkers.filter((m) => m.status === group.label).length})
          </li>
        ))}
        <li className="text-gray-500">Marker colour shows the year of the last known eruption.</li>
      </ul>
    </div>
  );
}
