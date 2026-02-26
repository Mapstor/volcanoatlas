'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MapMarker } from '@/lib/data';

// Dynamically import the map to avoid SSR issues
const DynamicMap = dynamic(() => import('./EnhancedInteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-[#1a1a1a] rounded-lg flex items-center justify-center">
      <div className="text-amber-500">Loading map...</div>
    </div>
  ),
});

interface MapSectionProps {
  markers: MapMarker[];
  showControls?: boolean;
  defaultCountry?: string;
}

export default function MapSection({ markers, showControls = true, defaultCountry = '' }: MapSectionProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get unique values for filters
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(new Set(markers.map(m => m.country).filter(Boolean))).sort();
    return uniqueCountries;
  }, [markers]);

  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(markers.map(m => m.type).filter(Boolean))).sort();
    return uniqueTypes;
  }, [markers]);

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(markers.map(m => m.status).filter(Boolean))).sort();
    return uniqueStatuses;
  }, [markers]);

  // Filter markers based on current filters
  const filteredMarkers = useMemo(() => {
    return markers.filter(marker => {
      const matchesCountry = !selectedCountry || marker.country === selectedCountry;
      const matchesType = !selectedType || marker.type === selectedType;
      const matchesStatus = !selectedStatus || marker.status === selectedStatus;
      const matchesSearch = !searchTerm || 
        marker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marker.country.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCountry && matchesType && matchesStatus && matchesSearch;
    });
  }, [markers, selectedCountry, selectedType, selectedStatus, searchTerm]);

  const clearFilters = () => {
    setSelectedCountry('');
    setSelectedType('');
    setSelectedStatus('');
    setSearchTerm('');
  };

  return (
    <div className="relative">
      {/* Map Controls */}
      {showControls && (
      <div className="bg-[#1a1a1a] border-b border-gray-800 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col space-y-4">
            {/* Search and Filter Row */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Search volcanoes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Country Filter */}
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>
                Showing {filteredMarkers.length} of {markers.length} volcanoes
              </span>
              {(selectedCountry || selectedType || selectedStatus || searchTerm) && (
                <span>
                  Filters active: 
                  {selectedCountry && ` Country: ${selectedCountry}`}
                  {selectedType && ` Type: ${selectedType}`}
                  {selectedStatus && ` Status: ${selectedStatus}`}
                  {searchTerm && ` Search: "${searchTerm}"`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Map */}
      <div className={showControls ? "h-[600px] bg-[#0f0f0f]" : "h-full bg-[#0f0f0f]"}>
        <DynamicMap markers={filteredMarkers} />
      </div>

      {/* Mobile Filter Toggle (hidden for now, could be added later) */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        {/* Mobile filter button could go here */}
      </div>
    </div>
  );
}