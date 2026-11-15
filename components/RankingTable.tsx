'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RankingTableProps {
  title: string;
  description?: string;
  headers: string[];
  rows: any[][];
  /** Volcano name -> internal link, checked on the server. Names without a page are not in the map. */
  volcanoLinks?: Record<string, string>;
  /** Country name -> internal link, checked on the server. */
  countryLinks?: Record<string, string>;
}

export default function RankingTable({ title, description, headers, rows, volcanoLinks = {}, countryLinks = {} }: RankingTableProps) {
  const [sortColumn, setSortColumn] = useState<number>(0);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');

  const lowerHeaders = headers.map((h) => h.toLowerCase());
  // Helper columns that exist only for linking or sorting are not shown.
  const hidden = new Set<number>();
  lowerHeaders.forEach((h, i) => {
    if (h === 'slug') hidden.add(i);
    if (h === 'elevation (m)' && lowerHeaders.includes('elevation')) hidden.add(i);
  });
  const visible = headers.map((_, i) => i).filter((i) => !hidden.has(i));

  const handleSort = (columnIndex: number) => {
    if (columnIndex === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnIndex);
      setSortDirection('asc');
    }
  };

  const needle = filterText.toLowerCase();
  const filteredRows = rows.filter((row) => visible.some((i) => String(row[i] ?? '').toLowerCase().includes(needle)));

  const sortedRows = [...filteredRows].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const header = lowerHeaders[sortColumn] || '';

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }

    // "1,117 m (3,665 ft)" sorts by its first number
    if (header.includes('elevation')) {
      const aElev = parseInt(String(aVal).split('m')[0].replace(/[^0-9-]/g, '') || '0');
      const bElev = parseInt(String(bVal).split('m')[0].replace(/[^0-9-]/g, '') || '0');
      return sortDirection === 'asc' ? aElev - bElev : bElev - aElev;
    }

    if (header.includes('eruption') || header.includes('year')) {
      const aYear = parseInt(String(aVal).replace(/[^0-9-]/g, '') || '0');
      const bYear = parseInt(String(bVal).replace(/[^0-9-]/g, '') || '0');
      return sortDirection === 'asc' ? aYear - bYear : bYear - aYear;
    }

    const aNum = parseFloat(String(aVal).replace(/,/g, ''));
    const bNum = parseFloat(String(bVal).replace(/,/g, ''));
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    }

    return sortDirection === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const formatCell = (cell: any, columnIndex: number) => {
    const header = lowerHeaders[columnIndex] || '';

    if (header === 'volcano' && typeof cell === 'string') {
      const href = volcanoLinks[cell];
      return href ? (
        <Link href={href} className="text-amber-500 hover:text-amber-400 font-medium">
          {cell}
        </Link>
      ) : (
        <span className="font-medium text-gray-200">{cell}</span>
      );
    }

    if (header === 'country' && typeof cell === 'string') {
      const href = countryLinks[cell];
      return href ? (
        <Link href={href} className="text-amber-500 hover:text-amber-400">
          {cell}
        </Link>
      ) : (
        cell
      );
    }

    if (header.includes('vei') && cell !== null && cell !== '' && !isNaN(Number(cell))) {
      return `VEI ${Number(cell)}`;
    }

    return cell;
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
      {description && <p className="text-gray-400 mb-6">{description}</p>}

      <div className="mb-4">
        <input
          type="search"
          aria-label="Filter the table"
          placeholder="Filter table..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-[#1a1a1a] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#252525]">
              {visible.map((index) => (
                <th
                  key={index}
                  aria-sort={sortColumn === index ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-amber-500"
                  onClick={() => handleSort(index)}
                >
                  {headers[index]}
                  {sortColumn === index && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-[#252525] transition-colors">
                {visible.map((cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3 text-sm text-gray-300">
                    {formatCell(row[cellIndex], cellIndex)}
                  </td>
                ))}
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
