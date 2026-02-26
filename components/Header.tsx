'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { NavData } from '@/lib/data';
import GlobalSearch from './GlobalSearch';

interface HeaderProps {
  navData: NavData;
}

export default function Header({ navData }: HeaderProps) {
  const [isVolcanoesOpen, setIsVolcanoesOpen] = useState(false);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const volcanoesRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volcanoesRef.current && !volcanoesRef.current.contains(event.target as Node)) {
        setIsVolcanoesOpen(false);
      }
      if (countriesRef.current && !countriesRef.current.contains(event.target as Node)) {
        setIsCountriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-volcanic-950/95 backdrop-blur-md border-b border-volcanic-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl">🌋</span>
              <span className="font-['Playfair_Display'] text-xl font-bold text-[var(--accent)] group-hover:text-[var(--accent-hover)] transition-colors">
                VolcanoAtlas
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {/* Volcanoes Dropdown */}
              <div ref={volcanoesRef} className="relative">
                <button
                  onClick={() => setIsVolcanoesOpen(!isVolcanoesOpen)}
                  className="font-['Playfair_Display'] text-sm tracking-wide uppercase text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-1"
                >
                  Volcanoes
                  <svg className={`w-4 h-4 transition-transform ${isVolcanoesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isVolcanoesOpen && (
                  <div className="absolute top-full mt-2 w-64 max-h-96 overflow-y-auto bg-volcanic-900 border border-volcanic-700 rounded-lg shadow-2xl shadow-black/50 p-2 z-50 scrollbar-thin">
                    <Link href="/volcanoes" className="block px-3 py-2 text-sm text-volcanic-400 hover:text-white hover:bg-volcanic-800 rounded transition-colors">
                      All Volcanoes
                    </Link>
                    <Link href="/map" className="block px-3 py-2 text-sm text-volcanic-400 hover:text-white hover:bg-volcanic-800 rounded transition-colors">
                      Interactive Map
                    </Link>
                    <div className="border-t border-volcanic-700 my-2"></div>
                    <div className="px-3 py-2 text-xs text-volcanic-500 uppercase tracking-wider">Featured</div>
                    {navData.featured_volcanoes.slice(0, 5).map((volcano, index) => (
                      <Link key={index} href={volcano.url} className="block px-3 py-2 text-sm text-volcanic-400 hover:text-white hover:bg-volcanic-800 rounded transition-colors">
                        {volcano.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Countries Dropdown */}
              <div ref={countriesRef} className="relative">
                <button
                  onClick={() => setIsCountriesOpen(!isCountriesOpen)}
                  className="font-['Playfair_Display'] text-sm tracking-wide uppercase text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-1"
                >
                  Countries
                  <svg className={`w-4 h-4 transition-transform ${isCountriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isCountriesOpen && (
                  <div className="absolute top-full mt-2 w-64 max-h-96 overflow-y-auto bg-volcanic-900 border border-volcanic-700 rounded-lg shadow-2xl shadow-black/50 p-2 z-50 scrollbar-thin">
                    <Link href="/countries" className="block px-3 py-2 text-sm text-volcanic-400 hover:text-white hover:bg-volcanic-800 rounded transition-colors">
                      All Countries
                    </Link>
                    <div className="border-t border-volcanic-700 my-2"></div>
                    <div className="px-3 py-2 text-xs text-volcanic-500 uppercase tracking-wider">Popular</div>
                    {navData.countries.slice(0, 8).map((country, index) => (
                      <Link key={index} href={country.url} className="block px-3 py-2 text-sm text-volcanic-400 hover:text-white hover:bg-volcanic-800 rounded transition-colors">
                        {country.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Links */}
              <Link href="/ring-of-fire" className="font-['Playfair_Display'] text-sm tracking-wide uppercase text-[var(--text-secondary)] hover:text-white transition-colors">
                Ring of Fire
              </Link>
              
              <Link href="/active-volcanoes" className="font-['Playfair_Display'] text-sm tracking-wide uppercase text-[var(--text-secondary)] hover:text-white transition-colors">
                Active
              </Link>
              
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:border-[var(--border-hover)] transition-colors"
              >
                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-[var(--text-muted)]">Search</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[var(--bg-primary)] rounded text-[10px] text-[var(--text-muted)] border border-[var(--border)]">
                  ⌘K
                </kbd>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-[var(--text-secondary)] hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {isSearchOpen && <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}