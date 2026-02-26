'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Volcano {
  slug: string;
  name: string;
  country: string;
  type: string;
  elevation_m: number;
  elevation_ft: number;
  status: string;
  last_eruption: string;
  coordinates: { lat: number; lon: number };
}

interface VolcanoesListClientProps {
  volcanoes: Volcano[];
  countries: string[];
  types: string[];
  statuses: string[];
}

export default function VolcanoesListClient({ 
  volcanoes, 
  countries, 
  types, 
  statuses 
}: VolcanoesListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'elevation' | 'country' | 'recent'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort volcanoes
  const filteredAndSortedVolcanoes = useMemo(() => {
    let filtered = volcanoes.filter(volcano => {
      const matchesSearch = !searchTerm || 
        volcano.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volcano.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = !selectedCountry || volcano.country === selectedCountry;
      const matchesType = !selectedType || volcano.type === selectedType;
      const matchesStatus = !selectedStatus || volcano.status === selectedStatus;

      return matchesSearch && matchesCountry && matchesType && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'elevation':
          comparison = a.elevation_m - b.elevation_m;
          break;
        case 'country':
          comparison = a.country.localeCompare(b.country);
          break;
        case 'recent':
          // Sort by last eruption (this is a simplified version)
          comparison = b.last_eruption.localeCompare(a.last_eruption);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [volcanoes, searchTerm, selectedCountry, selectedType, selectedStatus, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedType('');
    setSelectedStatus('');
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      {/* Filters and Controls */}
      <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8 border border-gray-800">
        <div className="space-y-4">
          {/* Search Bar */}
          <div>
            <input
              type="text"
              placeholder="Search volcanoes by name or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>

          {/* Sort and View Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="name">Sort by Name</option>
                <option value="elevation">Sort by Elevation</option>
                <option value="country">Sort by Country</option>
                <option value="recent">Sort by Recent Activity</option>
              </select>

              <button
                onClick={toggleSortOrder}
                className="px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white hover:bg-[#2a2a2a] transition-colors"
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-amber-500 text-black' 
                    : 'bg-[#252525] text-white hover:bg-[#2a2a2a]'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-amber-500 text-black' 
                    : 'bg-[#252525] text-white hover:bg-[#2a2a2a]'
                }`}
              >
                List View
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-400">
            Showing {filteredAndSortedVolcanoes.length} of {volcanoes.length} volcanoes
            {(searchTerm || selectedCountry || selectedType || selectedStatus) && (
              <span className="ml-2">
                (Filtered)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Volcanoes Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedVolcanoes.map(volcano => (
            <Link
              key={volcano.slug}
              href={`/volcano/${volcano.slug}`}
              className="group bg-[#1a1a1a] rounded-lg overflow-hidden hover:ring-2 hover:ring-amber-500 transition-all border border-gray-800"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-500 mb-3 transition-colors">
                  {volcano.name}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Country:</span>
                    <span className="text-gray-300">{volcano.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-gray-300 text-right">{volcano.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Elevation:</span>
                    <span className="text-gray-300">
                      {volcano.elevation_m?.toLocaleString()} m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      volcano.status.toLowerCase().includes('active') 
                        ? 'bg-red-500/20 text-red-400' 
                        : volcano.status.toLowerCase().includes('dormant')
                        ? 'bg-gray-500/20 text-gray-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {volcano.status}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-700">
                    <div className="text-gray-400">Last Eruption:</div>
                    <div className="text-gray-300">{volcano.last_eruption}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
          <table className="w-full">
            <thead className="bg-[#252525] border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Elevation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Eruption
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAndSortedVolcanoes.map(volcano => (
                <tr 
                  key={volcano.slug}
                  className="hover:bg-[#252525] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      href={`/volcano/${volcano.slug}`}
                      className="text-amber-500 hover:text-amber-400 font-medium"
                    >
                      {volcano.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {volcano.country}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {volcano.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {volcano.elevation_m?.toLocaleString()} m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      volcano.status.toLowerCase().includes('active') 
                        ? 'bg-red-500/20 text-red-400' 
                        : volcano.status.toLowerCase().includes('dormant')
                        ? 'bg-gray-500/20 text-gray-400'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {volcano.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {volcano.last_eruption}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}