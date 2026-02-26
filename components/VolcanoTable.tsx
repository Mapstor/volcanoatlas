'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TableRow {
  rank: number;
  name: string;
  slug: string;
  elevation: number;
  type: string;
  lastEruption: string;
  evidenceCategory: string;
  eruptionCount: number;
  veiMax: string;
}

interface VolcanoTableProps {
  description?: string;
  columns: string[];
  rows: any[][];
}

export default function VolcanoTable({ description, columns, rows }: VolcanoTableProps) {
  // Convert raw rows to typed objects
  const tableData: TableRow[] = rows.map(row => ({
    rank: row[0],
    name: row[1],
    slug: row[2],
    elevation: row[3],
    type: row[4],
    lastEruption: row[5],
    evidenceCategory: row[6],
    eruptionCount: row[7],
    veiMax: row[8]
  }));

  const [sortField, setSortField] = useState<keyof TableRow>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');

  // Handle sorting
  const handleSort = (field: keyof TableRow) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort data - with null checks
  const filteredData = tableData.filter(row => 
    (row.name?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
    (row.type?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
    (row.lastEruption?.toLowerCase() || '').includes(filterText.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal);
    const bStr = String(bVal);
    return sortDirection === 'asc' 
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-4">Volcano Table</h2>
      {description && (
        <p className="text-gray-400 mb-6">{description}</p>
      )}
      
      {/* Filter Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name, type, or eruption..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-[#1a1a1a] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#252525]">
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-amber-500"
                onClick={() => handleSort('rank')}
              >
                Rank {sortField === 'rank' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-amber-500"
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-amber-500"
                onClick={() => handleSort('elevation')}
              >
                Elevation (m) {sortField === 'elevation' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-amber-500"
                onClick={() => handleSort('type')}
              >
                Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-amber-500"
                onClick={() => handleSort('lastEruption')}
              >
                Last Eruption {sortField === 'lastEruption' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Evidence
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-amber-500"
                onClick={() => handleSort('eruptionCount')}
              >
                Eruptions {sortField === 'eruptionCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-amber-500"
                onClick={() => handleSort('veiMax')}
              >
                VEI Max {sortField === 'veiMax' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedData.map((row) => (
              <tr key={row.slug} className="hover:bg-[#252525] transition-colors">
                <td className="px-4 py-3 text-sm text-gray-300">
                  {row.rank}
                </td>
                <td className="px-4 py-3 text-sm">
                  <Link 
                    href={`/volcano/${row.slug}`}
                    className="text-amber-500 hover:text-amber-400 font-medium"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {row.elevation ? row.elevation.toLocaleString() : 'Unknown'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {row.type}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {row.lastEruption}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 text-xs">
                  {row.evidenceCategory}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {row.eruptionCount}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    row.veiMax === 'N/A' ? 'bg-gray-700 text-gray-400' :
                    parseInt(row.veiMax) >= 5 ? 'bg-red-500/20 text-red-400' :
                    parseInt(row.veiMax) >= 3 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {row.veiMax === 'N/A' ? 'Unknown' : `VEI ${row.veiMax}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {sortedData.length} of {tableData.length} volcanoes
      </div>
    </div>
  );
}