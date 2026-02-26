'use client';

import { useState, useEffect } from 'react';
import GlobalSearch from './GlobalSearch';

export default function SearchTrigger() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-[#252525] hover:bg-[#2a2a2a] rounded-lg border border-gray-700 transition-colors group"
        aria-label="Search"
      >
        <svg className="w-4 h-4 text-gray-400 group-hover:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm text-gray-400 group-hover:text-white hidden md:inline">Search</span>
        <kbd className="hidden md:inline-flex items-center space-x-1 text-xs">
          <span className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-500">⌘K</span>
        </kbd>
      </button>

      {/* Search Modal */}
      <GlobalSearch 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}