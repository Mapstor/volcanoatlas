'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface VolcanoTableRow {
  rank: number | null;
  name: string;
  /** Internal link, already checked on the server. Null when no page exists. */
  href: string | null;
  elevation: number | null;
  type: string | null;
  lastEruption: string | null;
  /** Status or evidence label exactly as stored with the data. */
  status: string | null;
  eruptionCount: number | null;
  veiMax: string | null;
  note: string | null;
}

interface VolcanoTableProps {
  rows: VolcanoTableRow[];
  /** Header for the status column: the data uses either "Status" or "Evidence". */
  statusLabel?: string;
  noteLabel?: string;
}

type SortField = 'rank' | 'name' | 'elevation' | 'type' | 'lastEruption' | 'eruptionCount' | 'veiMax';

export default function VolcanoTable({ rows, statusLabel = 'Status', noteLabel = 'Note' }: VolcanoTableProps) {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');

  const hasRank = rows.some((r) => r.rank !== null);
  const hasStatus = rows.some((r) => r.status);
  const hasNote = rows.some((r) => r.note);
  const hasCount = rows.some((r) => r.eruptionCount !== null);
  const hasVei = rows.some((r) => r.veiMax !== null);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const needle = filterText.toLowerCase();
  const filtered = rows.filter(
    (row) =>
      row.name.toLowerCase().includes(needle) ||
      (row.type || '').toLowerCase().includes(needle) ||
      (row.lastEruption || '').toLowerCase().includes(needle)
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    return sortDirection === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });

  const th = 'px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider';
  const sortableTh = `${th} cursor-pointer hover:text-amber-500`;
  const arrow = (field: SortField) => (sortField === field ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '');
  const ariaSort = (field: SortField) => (sortField === field ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none');

  return (
    <div className="mb-12">
      <div className="mb-4">
        <input
          type="search"
          aria-label="Filter the table"
          placeholder="Filter by name, type, or eruption..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-[#1a1a1a] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#252525]">
              {hasRank && <th className={sortableTh} aria-sort={ariaSort('rank')} onClick={() => handleSort('rank')}>Rank{arrow('rank')}</th>}
              <th className={sortableTh} aria-sort={ariaSort('name')} onClick={() => handleSort('name')}>Name{arrow('name')}</th>
              <th className={sortableTh} aria-sort={ariaSort('elevation')} onClick={() => handleSort('elevation')}>Elevation (m){arrow('elevation')}</th>
              <th className={sortableTh} aria-sort={ariaSort('type')} onClick={() => handleSort('type')}>Type{arrow('type')}</th>
              <th className={sortableTh} aria-sort={ariaSort('lastEruption')} onClick={() => handleSort('lastEruption')}>Last eruption{arrow('lastEruption')}</th>
              {hasStatus && <th className={th}>{statusLabel}</th>}
              {hasCount && <th className={sortableTh} aria-sort={ariaSort('eruptionCount')} onClick={() => handleSort('eruptionCount')}>Eruptions{arrow('eruptionCount')}</th>}
              {hasVei && <th className={sortableTh} aria-sort={ariaSort('veiMax')} onClick={() => handleSort('veiMax')}>Max VEI{arrow('veiMax')}</th>}
              {hasNote && <th className={th}>{noteLabel}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sorted.map((row, index) => (
              <tr key={`${row.name}-${index}`} className="hover:bg-[#252525] transition-colors">
                {hasRank && <td className="px-4 py-3 text-sm text-gray-300">{row.rank ?? ''}</td>}
                <td className="px-4 py-3 text-sm">
                  {row.href ? (
                    <Link href={row.href} className="text-amber-500 hover:text-amber-400 font-medium">
                      {row.name}
                    </Link>
                  ) : (
                    <span className="text-gray-200 font-medium">{row.name}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">{row.elevation !== null ? row.elevation.toLocaleString('en-US') : 'Unknown'}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{row.type ?? ''}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{row.lastEruption ?? 'Unknown'}</td>
                {hasStatus && <td className="px-4 py-3 text-xs text-gray-400">{row.status ?? ''}</td>}
                {hasCount && <td className="px-4 py-3 text-sm text-gray-300">{row.eruptionCount ?? ''}</td>}
                {hasVei && <td className="px-4 py-3 text-sm text-gray-300">{row.veiMax !== null ? `VEI ${row.veiMax}` : 'Unknown'}</td>}
                {hasNote && <td className="px-4 py-3 text-xs text-gray-400">{row.note ?? ''}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {sorted.length} of {rows.length} volcanoes
      </div>
    </div>
  );
}
