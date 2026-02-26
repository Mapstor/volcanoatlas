'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface SortableTableProps {
  columns: Column[];
  data: any[];
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
}

export default function SortableTable({ 
  columns, 
  data, 
  defaultSortKey = '',
  defaultSortDirection = 'asc' 
}: SortableTableProps) {
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      // Handle special cases
      if (aVal === null || aVal === undefined) aVal = '';
      if (bVal === null || bVal === undefined) bVal = '';

      // Convert to numbers if possible
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // String comparison
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      }
    });
  }, [data, sortKey, sortDirection]);

  return (
    <div className="overflow-x-auto rounded-xl border border-volcanic-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-volcanic-900 border-b border-volcanic-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left p-4 text-lava font-semibold text-xs uppercase tracking-wider ${
                  column.sortable !== false ? 'cursor-pointer hover:bg-volcanic-800 transition-colors' : ''
                }`}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable !== false && (
                    <div className="flex flex-col">
                      <svg 
                        className={`w-3 h-3 ${
                          sortKey === column.key && sortDirection === 'asc' 
                            ? 'text-lava' 
                            : 'text-volcanic-600'
                        }`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 5l5 5H5l5-5z"/>
                      </svg>
                      <svg 
                        className={`w-3 h-3 -mt-1 ${
                          sortKey === column.key && sortDirection === 'desc' 
                            ? 'text-lava' 
                            : 'text-volcanic-600'
                        }`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5-5h10l-5 5z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`border-b border-volcanic-800 hover:bg-volcanic-900 transition-colors ${
                rowIndex % 2 === 0 ? 'bg-volcanic-950' : ''
              }`}
            >
              {columns.map((column) => (
                <td key={column.key} className="p-4 text-volcanic-300">
                  {column.render 
                    ? column.render(row[column.key], row) 
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}