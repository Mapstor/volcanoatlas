'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { NavData } from '@/lib/data';
import GlobalSearch from './GlobalSearch';

interface HeaderProps {
  navData: NavData;
}

const MOBILE_LINKS = [
  { href: '/volcanoes', label: 'All volcanoes' },
  { href: '/map', label: 'Volcano map' },
  { href: '/countries', label: 'Countries' },
  { href: '/latest-eruptions', label: 'Latest eruptions' },
  { href: '/active-volcanoes', label: 'Active volcanoes' },
  { href: '/ring-of-fire', label: 'Ring of Fire' },
  { href: '/types-of-volcanoes', label: 'Types of volcanoes' },
  { href: '/volcanic-explosivity-index', label: 'Volcanic Explosivity Index' },
];

export default function Header({ navData }: HeaderProps) {
  const [isVolcanoesOpen, setIsVolcanoesOpen] = useState(false);
  const [isCountriesOpen, setIsCountriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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

  // Keyboard shortcuts: Cmd/Ctrl + K opens search, Escape closes the mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-[1100] bg-volcanic-950/95 backdrop-blur-md border-b border-volcanic-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon.svg" alt="" width={28} height={28} className="w-7 h-7" />
              <span className="font-display text-xl font-bold text-white group-hover:text-lava-light transition-colors">
                VolcanoAtlas
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
              {/* Volcanoes Dropdown */}
              <div ref={volcanoesRef} className="relative">
                <button
                  onClick={() => setIsVolcanoesOpen(!isVolcanoesOpen)}
                  aria-expanded={isVolcanoesOpen}
                  className="font-display text-sm tracking-wide uppercase text-volcanic-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  Volcanoes
                  <svg className={`w-4 h-4 transition-transform ${isVolcanoesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isVolcanoesOpen && (
                  <div onClick={() => setIsVolcanoesOpen(false)} className="absolute top-full mt-2 w-64 max-h-96 overflow-y-auto bg-volcanic-900 border border-volcanic-700 rounded-lg shadow-2xl shadow-black/50 p-2 z-50 scrollbar-thin">
                    <Link href="/volcanoes" className="block px-3 py-2 text-sm text-volcanic-400 hover:text-white hover:bg-volcanic-800 rounded transition-colors">
                      All Volcanoes
                    </Link>
                    <Link href="/map" className="block px-3 py-2 text-sm text-volcanic-400 hover:text-white hover:bg-volcanic-800 rounded transition-colors">
                      Interactive Map
                    </Link>
                    <Link href="/latest-eruptions" className="block px-3 py-2 text-sm text-volcanic-400 hover:text-white hover:bg-volcanic-800 rounded transition-colors">
                      Latest Eruptions
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
                  aria-expanded={isCountriesOpen}
                  className="font-display text-sm tracking-wide uppercase text-volcanic-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  Countries
                  <svg className={`w-4 h-4 transition-transform ${isCountriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCountriesOpen && (
                  <div onClick={() => setIsCountriesOpen(false)} className="absolute top-full mt-2 w-64 max-h-96 overflow-y-auto bg-volcanic-900 border border-volcanic-700 rounded-lg shadow-2xl shadow-black/50 p-2 z-50 scrollbar-thin">
                    <Link href="/countries" className="block px-3 py-2 text-sm text-volcanic-400 hover:text-white hover:bg-volcanic-800 rounded transition-colors">
                      All Countries
                    </Link>
                    <div className="border-t border-volcanic-700 my-2"></div>
                    {navData.countries.slice(0, 8).map((country, index) => (
                      <Link key={index} href={country.url} className="block px-3 py-2 text-sm text-volcanic-400 hover:text-white hover:bg-volcanic-800 rounded transition-colors">
                        {country.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Links */}
              <Link href="/ring-of-fire" className="font-display text-sm tracking-wide uppercase text-volcanic-300 hover:text-white transition-colors">
                Ring of Fire
              </Link>

              <Link href="/active-volcanoes" className="font-display text-sm tracking-wide uppercase text-volcanic-300 hover:text-white transition-colors">
                Active
              </Link>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-volcanic-900 border border-volcanic-700 rounded-lg hover:border-volcanic-600 transition-colors"
              >
                <svg className="w-4 h-4 text-volcanic-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-volcanic-400">Search</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-volcanic-950 rounded text-[10px] text-volcanic-400 border border-volcanic-700">
                  ⌘K
                </kbd>
              </button>
            </nav>

            {/* Mobile controls */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="p-3 text-volcanic-300 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileOpen}
                aria-controls="mobile-menu"
                className="p-3 text-volcanic-300 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {isMobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="lg:hidden border-t border-volcanic-700 bg-volcanic-950">
            <ul className="max-w-7xl mx-auto px-4 py-2">
              {MOBILE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block py-3 text-base text-volcanic-300 hover:text-white border-b border-volcanic-800 last:border-b-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Global Search Modal */}
      {isSearchOpen && <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
