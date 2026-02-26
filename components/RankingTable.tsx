'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RankingTableProps {
  title: string;
  description?: string;
  headers: string[];
  rows: any[][];
  isActiveVolcanoesTable?: boolean;
  existingVolcanoSlugs?: Set<string>;
}

export default function RankingTable({ title, description, headers, rows, isActiveVolcanoesTable = false, existingVolcanoSlugs = new Set() }: RankingTableProps) {
  const [sortColumn, setSortColumn] = useState<number>(0);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');

  // Handle sorting
  const handleSort = (columnIndex: number) => {
    if (columnIndex === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  // Filter data
  const filteredRows = rows.filter(row =>
    row.some(cell => 
      String(cell).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  // Sort data
  const sortedRows = [...filteredRows].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const header = headers[sortColumn].toLowerCase();
    
    // Handle numeric sorting
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    // Handle elevation strings (e.g., "1,117 m (3,665 ft)")
    if (header.includes('elevation')) {
      const aElev = parseInt(String(aVal).replace(/[^0-9-]/g, '') || '0');
      const bElev = parseInt(String(bVal).replace(/[^0-9-]/g, '') || '0');
      return sortDirection === 'asc' ? aElev - bElev : bElev - aElev;
    }
    
    // Handle year/eruption sorting
    if (header.includes('eruption') || header.includes('year')) {
      const aYear = parseInt(String(aVal).replace(/[^0-9-]/g, '') || '0');
      const bYear = parseInt(String(bVal).replace(/[^0-9-]/g, '') || '0');
      return sortDirection === 'asc' ? aYear - bYear : bYear - aYear;
    }
    
    // Handle string sorting (including numbers as strings)
    const aStr = String(aVal).replace(/[,]/g, ''); // Remove commas for numeric strings
    const bStr = String(bVal).replace(/[,]/g, '');
    
    // Check if both are numeric strings
    const aNum = parseFloat(aStr);
    const bNum = parseFloat(bStr);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    }
    
    // Fall back to string comparison
    return sortDirection === 'asc' 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // Determine if column is sortable - make all columns sortable
  const isSortable = (index: number) => {
    const header = headers[index].toLowerCase();
    // Skip only the slug column which is typically the last one
    if (header === 'slug') return false;
    // All other columns are sortable
    return true;
  };

  // Format cell content with special handling for volcanoes and countries
  const formatCell = (cell: any, columnIndex: number, row: any[]) => {
    const header = headers[columnIndex].toLowerCase();
    
    // Handle volcano names (usually column 0)
    if (header.includes('volcano') && typeof cell === 'string' && isActiveVolcanoesTable) {
      // Get the slug from the last column (which won't be displayed)
      const slugIndex = headers.findIndex(h => h.toLowerCase() === 'slug');
      const volcanoSlug = slugIndex >= 0 ? row[slugIndex] : null;
      
      // Check if we have content for this volcano
      const hasContent = volcanoSlug && volcanoSlug !== '' && existingVolcanoSlugs.has(volcanoSlug);
      
      if (hasContent) {
        return (
          <Link 
            href={`/volcano/${volcanoSlug}`}
            className="inline-block px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 hover:text-orange-300 rounded-lg font-semibold transition-all duration-200 hover:scale-105 border border-orange-500/30 hover:border-orange-500/50"
          >
            {cell}
          </Link>
        );
      }
      // If no content, show as plain text with a subtle indicator
      return (
        <span className="font-medium text-gray-400" title="Detailed page not available">
          {cell}
        </span>
      );
    }
    
    // Handle volcano names for other tables (non-active volcanoes)
    if (header.includes('volcano') && typeof cell === 'string' && !isActiveVolcanoesTable) {
      return <span className="font-medium text-gray-300">{cell}</span>;
    }
    
    // Handle country names
    if (header.includes('country') && typeof cell === 'string') {
      const countrySlug = cell.toLowerCase().replace(/\s+/g, '-');
      return (
        <Link 
          href={`/volcanoes-in-${countrySlug}`}
          className="text-amber-500 hover:text-amber-400"
        >
          {cell}
        </Link>
      );
    }
    
    // Handle VEI values
    if (header.includes('vei') && (typeof cell === 'number' || !isNaN(Number(cell)))) {
      const vei = Number(cell);
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          vei >= 6 ? 'bg-red-500/20 text-red-400' :
          vei >= 4 ? 'bg-orange-500/20 text-orange-400' :
          vei >= 2 ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          VEI {vei}
        </span>
      );
    }
    
    // Handle death counts with formatting
    if (header.includes('death') && typeof cell === 'string') {
      return <span className="font-medium">{cell}</span>;
    }
    
    // Default formatting
    return cell;
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      {description && (
        <p className="text-gray-400 mb-6">{description}</p>
      )}
      
      {/* Filter Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter table..."
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
              {headers.map((header, index) => {
                // Skip Slug column for active volcanoes table
                if (isActiveVolcanoesTable && header.toLowerCase() === 'slug') {
                  return null;
                }
                return (
                  <th
                    key={index}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                      isSortable(index) ? 'cursor-pointer hover:text-amber-500' : ''
                    }`}
                    onClick={() => isSortable(index) && handleSort(index)}
                  >
                    {header}
                    {isSortable(index) && sortColumn === index && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#252525] transition-colors">
                {row.map((cell, cellIndex) => {
                  // Skip Slug column for active volcanoes table
                  if (isActiveVolcanoesTable && headers[cellIndex]?.toLowerCase() === 'slug') {
                    return null;
                  }
                  return (
                    <td key={cellIndex} className="px-4 py-3 text-sm text-gray-300">
                      {formatCell(cell, cellIndex, row)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {sortedRows.length} of {rows.length} entries
      </div>
    </div>
  );
}