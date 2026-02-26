'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Country {
  slug: string;
  name: string;
  title: string;
  volcano_count: number;
  active_count: number;
  tallest?: {
    name: string;
    elevation_m?: number;
  };
  most_recent?: {
    year: number | string;
    volcano: string;
  };
  description: string;
}

interface CountriesListClientProps {
  countries: Country[];
}

export default function CountriesListClient({ countries }: CountriesListClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count' | 'active'>('count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterActive, setFilterActive] = useState(false);

  // Filter and sort countries
  const filteredAndSortedCountries = useMemo(() => {
    let filtered = countries.filter(country => {
      const matchesSearch = !searchTerm || 
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesActive = !filterActive || country.active_count > 0;

      return matchesSearch && matchesActive;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'count':
          comparison = a.volcano_count - b.volcano_count;
          break;
        case 'active':
          comparison = (a.active_count || 0) - (b.active_count || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [countries, searchTerm, sortBy, sortOrder, filterActive]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterActive(false);
    setSortBy('count');
    setSortOrder('desc');
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
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
              >
                <option value="count">Sort by Volcano Count</option>
                <option value="active">Sort by Active Count</option>
                <option value="name">Sort by Name</option>
              </select>

              {/* Sort Order Button */}
              <button
                onClick={toggleSortOrder}
                className="px-4 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white hover:bg-[#2a2a2a] transition-colors"
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>

              {/* Active Filter */}
              <button
                onClick={() => setFilterActive(!filterActive)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterActive 
                    ? 'bg-amber-500 text-black' 
                    : 'bg-[#252525] text-white hover:bg-[#2a2a2a] border border-gray-700'
                }`}
              >
                Active Volcanoes Only
              </button>

              {/* Clear Button */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600 transition-colors font-medium"
              >
                Clear
              </button>
            </div>

            {/* View Mode Toggle */}
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
            Showing {filteredAndSortedCountries.length} of {countries.length} countries
            {(searchTerm || filterActive) && (
              <span className="ml-2">(Filtered)</span>
            )}
          </div>
        </div>
      </div>

      {/* Countries Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCountries.map(country => (
            <Link
              key={country.slug}
              href={`/volcanoes-in-${country.slug}`}
              className="group bg-[#1a1a1a] rounded-lg overflow-hidden hover:ring-2 hover:ring-amber-500 transition-all border border-gray-800"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-500 mb-2 transition-colors">
                  {country.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {country.description}
                </p>
                
                <div className="space-y-3">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-700">
                    <div>
                      <div className="text-2xl font-bold text-amber-500">
                        {country.volcano_count}
                      </div>
                      <div className="text-xs text-gray-400">Total Volcanoes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-500">
                        {country.active_count || 0}
                      </div>
                      <div className="text-xs text-gray-400">Active</div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {country.tallest && (
                    <div className="text-sm">
                      <span className="text-gray-400">Tallest:</span>
                      <span className="text-gray-300 ml-2">
                        {country.tallest.name}
                        {country.tallest.elevation_m && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({country.tallest.elevation_m.toLocaleString()}m)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  
                  {country.most_recent && (
                    <div className="text-sm">
                      <span className="text-gray-400">Recent:</span>
                      <span className="text-gray-300 ml-2">
                        {country.most_recent.volcano} ({country.most_recent.year})
                      </span>
                    </div>
                  )}
                </div>

                {/* View Link */}
                <div className="mt-4 text-amber-500 group-hover:text-amber-400 text-sm font-medium flex items-center">
                  View all volcanoes
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
                  Country
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Volcanoes
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tallest Volcano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Most Recent Eruption
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAndSortedCountries.map(country => (
                <tr 
                  key={country.slug}
                  className="hover:bg-[#252525] transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link 
                      href={`/volcanoes-in-${country.slug}`}
                      className="text-amber-500 hover:text-amber-400 font-medium"
                    >
                      {country.name}
                    </Link>
                    <div className="text-xs text-gray-500 mt-1 max-w-xs">
                      {country.description.substring(0, 100)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-2xl font-bold text-white">
                      {country.volcano_count}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xl font-bold ${
                      country.active_count > 0 ? 'text-amber-500' : 'text-gray-500'
                    }`}>
                      {country.active_count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {country.tallest ? (
                      <>
                        {country.tallest.name}
                        {country.tallest.elevation_m && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({country.tallest.elevation_m.toLocaleString()}m)
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {country.most_recent ? (
                      <>
                        {country.most_recent.volcano}
                        <span className="text-xs text-gray-500 ml-1">
                          ({country.most_recent.year})
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
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