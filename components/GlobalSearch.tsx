'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  type: 'volcano' | 'country' | 'special' | 'ranking';
  title: string;
  subtitle: string;
  description: string;
  url: string;
  status?: string;
  volcanoCount?: number;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [category, setCategory] = useState<'all' | 'volcanoes' | 'countries' | 'pages'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${category}&limit=10`);
        const data = await response.json();
        setResults(data.results || []);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, category]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + Math.max(1, results.length)) % Math.max(1, results.length));
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [isOpen, results, selectedIndex, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const recent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(recent);
    localStorage.setItem('recentSearches', JSON.stringify(recent));
    
    router.push(result.url);
    onClose();
  };

  const handleRecentSearch = (search: string) => {
    setQuery(search);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'volcano':
        return '🌋';
      case 'country':
        return '🗺️';
      case 'special':
        return '⭐';
      case 'ranking':
        return '📊';
      default:
        return '📍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'volcano':
        return 'text-red-500';
      case 'country':
        return 'text-blue-500';
      case 'special':
        return 'text-amber-500';
      case 'ranking':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="relative min-h-full flex items-start justify-center p-4 pt-[10vh]">
        <div className="relative w-full max-w-2xl bg-[#1a1a1a] rounded-lg shadow-2xl border border-gray-800">
          {/* Search Input */}
          <div className="border-b border-gray-700">
            <div className="flex items-center px-4 py-3">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search volcanoes, countries, or topics..."
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-gray-400 hover:text-white ml-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Category Tabs */}
            <div className="flex px-4 pb-2 space-x-4">
              <button
                onClick={() => setCategory('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  category === 'all' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCategory('volcanoes')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  category === 'volcanoes' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Volcanoes
              </button>
              <button
                onClick={() => setCategory('countries')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  category === 'countries' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Countries
              </button>
              <button
                onClick={() => setCategory('pages')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  category === 'pages' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Pages
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="p-8 text-center text-gray-400">
                Searching...
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-2">No results found for "{query}"</div>
                <div className="text-sm text-gray-500">Try different keywords or check the spelling</div>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.url}`}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-4 py-3 text-left hover:bg-[#252525] transition-colors flex items-start space-x-3 ${
                      index === selectedIndex ? 'bg-[#252525]' : ''
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{getTypeIcon(result.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">{result.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full bg-gray-800 ${getTypeColor(result.type)}`}>
                          {result.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">{result.subtitle}</div>
                      {result.description && (
                        <div className="text-xs text-gray-500 mt-1">{result.description}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && query.length < 2 && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="text-sm font-medium text-gray-400 mb-3">Recent Searches</div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(search)}
                      className="w-full text-left px-3 py-2 text-gray-300 hover:bg-[#252525] rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700 px-4 py-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 mr-1">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 mr-2">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 mr-2">Enter</kbd>
                Select
              </span>
              <span className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 mr-2">Esc</kbd>
                Close
              </span>
            </div>
            {results.length > 0 && (
              <span>{results.length} results</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}