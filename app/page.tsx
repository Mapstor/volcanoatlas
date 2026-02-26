import Link from 'next/link';
import { getHomepageData, getAllVolcanoes, getAllCountries } from '@/lib/data';
import MapSection from '@/components/MapSection';

export default async function HomePage() {
  const [homepageData, volcanoes, countries] = await Promise.all([
    getHomepageData(),
    getAllVolcanoes(),
    getAllCountries()
  ]);

  // Get featured volcanoes - use first 8 alphabetically
  const featuredVolcanoes = volcanoes.slice(0, 8);

  // Get popular countries with volcano counts
  const popularCountries = [
    { name: 'United States', slug: 'united-states', count: 165 },
    { name: 'Indonesia', slug: 'indonesia', count: 101 },
    { name: 'Japan', slug: 'japan', count: 105 },
    { name: 'Russia', slug: 'russia', count: 94 },
    { name: 'Chile', slug: 'chile', count: 66 },
    { name: 'Iceland', slug: 'iceland', count: 35 },
    { name: 'Mexico', slug: 'mexico', count: 47 },
    { name: 'Ecuador', slug: 'ecuador', count: 27 },
    { name: 'Philippines', slug: 'philippines', count: 23 },
    { name: 'New Zealand', slug: 'new-zealand', count: 25 },
    { name: 'Italy', slug: 'italy', count: 14 },
    { name: 'Guatemala', slug: 'guatemala', count: 22 }
  ];

  return (
    <div className="bg-volcanic-950">
      {/* Compact Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-3">
            Every Volcano <span className="text-gradient">on Earth</span>
          </h1>
          <p className="text-lg text-volcanic-400 mb-6">
            <span className="text-lava font-semibold">150 detailed profiles</span> • <span className="text-lava font-semibold">46 countries</span> • <span className="text-lava font-semibold">1,356 total volcanoes mapped</span>
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/map" className="btn-primary text-sm">
              🗺️ Interactive Map
            </Link>
            <Link href="/active-volcanoes" className="btn-secondary text-sm">
              🔴 Currently Active
            </Link>
            <Link href="/ring-of-fire" className="btn-secondary text-sm">
              🔥 Ring of Fire
            </Link>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="rounded-xl overflow-hidden border border-volcanic-700 h-[400px] glow-effect">
          <MapSection markers={homepageData.map_markers} />
        </div>
        <p className="text-center text-volcanic-500 text-xs mt-2">Click any marker to explore • Zoom and pan to navigate</p>
      </section>

      {/* Featured Volcanoes */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-lava mr-3"></div>
          <h2 className="font-display text-2xl font-bold">Featured Volcanoes</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredVolcanoes.map((volcano) => (
            <Link key={volcano.slug} href={`/volcano/${volcano.slug}`} className="volcano-card group p-4">
              <h3 className="font-display text-lg font-bold mb-2 group-hover:text-lava transition-colors">
                {volcano.hero.name}
              </h3>
              
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-volcanic-500">Country</span>
                  <span className="text-volcanic-300">{volcano.hero.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-volcanic-500">Height</span>
                  <span className="font-mono text-volcanic-300">{volcano.hero.elevation_m.toLocaleString()}m</span>
                </div>
                {volcano.hero.last_eruption && (
                  <div className="flex justify-between">
                    <span className="text-volcanic-500">Last</span>
                    <span className="font-mono text-lava">{volcano.hero.last_eruption}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-3 border-t border-volcanic-700 text-lava text-xs font-medium">
                View Details →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Country */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex items-center mb-6">
          <div className="w-1 h-6 bg-lava mr-3"></div>
          <h2 className="font-display text-2xl font-bold">Browse by Country</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularCountries.map((country) => (
            <Link key={country.slug} href={`/volcanoes-in-${country.slug}`} 
                  className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-4 hover:border-lava transition-all text-center group">
              <div className="font-mono text-2xl font-bold text-lava mb-1">{country.count}</div>
              <div className="text-sm text-volcanic-400 group-hover:text-white transition-colors">{country.name}</div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/countries" className="text-lava hover:text-lava-dark font-medium transition-colors">
            View All 46 Countries →
          </Link>
        </div>
      </section>

      {/* Comprehensive Resource Hub */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-lava mr-4"></div>
          <h2 className="font-display text-3xl font-bold">Explore All Resources</h2>
        </div>
        
        {/* Rankings & Records */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-lava mb-4">Rankings & Records</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/active-volcanoes" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔴</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Currently Active Volcanoes</h4>
                  <p className="text-xs text-volcanic-400">Real-time tracking of 50+ erupting volcanoes with hazard levels</p>
                </div>
              </div>
            </Link>

            <Link href="/most-active-volcanoes" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Most Active Volcanoes</h4>
                  <p className="text-xs text-volcanic-400">Ranked by eruption frequency - Kilauea, Etna, Stromboli & more</p>
                </div>
              </div>
            </Link>

            <Link href="/tallest-volcanoes" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⛰️</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Tallest Volcanoes</h4>
                  <p className="text-xs text-volcanic-400">From Ojos del Salado (6,893m) to massive shield volcanoes</p>
                </div>
              </div>
            </Link>

            <Link href="/deadliest-eruptions" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Deadliest Eruptions</h4>
                  <p className="text-xs text-volcanic-400">Historical catastrophes from Tambora to Krakatoa</p>
                </div>
              </div>
            </Link>

            <Link href="/supervolcanoes" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💥</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Supervolcanoes</h4>
                  <p className="text-xs text-volcanic-400">Yellowstone, Toba & other VEI-8 capable volcanic systems</p>
                </div>
              </div>
            </Link>

            <Link href="/most-dangerous-volcanoes" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Most Dangerous Volcanoes</h4>
                  <p className="text-xs text-volcanic-400">High-risk volcanoes near major population centers</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Educational Resources */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-lava mb-4">Educational Resources</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/ring-of-fire" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Ring of Fire</h4>
                  <p className="text-xs text-volcanic-400">Pacific's 40,000km horseshoe with 75% of Earth's volcanoes</p>
                </div>
              </div>
            </Link>

            <Link href="/types-of-volcanoes" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Types of Volcanoes</h4>
                  <p className="text-xs text-volcanic-400">Stratovolcanoes, shields, calderas, cinder cones explained</p>
                </div>
              </div>
            </Link>

            <Link href="/volcanic-explosivity-index" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Volcanic Explosivity Index</h4>
                  <p className="text-xs text-volcanic-400">VEI scale from 0-8 measuring eruption magnitude</p>
                </div>
              </div>
            </Link>

            <Link href="/map" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Interactive World Map</h4>
                  <p className="text-xs text-volcanic-400">Explore all 1,356 Holocene volcanoes with filters</p>
                </div>
              </div>
            </Link>

            <Link href="/latest-eruptions" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚨</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Latest Eruptions</h4>
                  <p className="text-xs text-volcanic-400">Real-time volcanic activity alerts from USGS & Smithsonian</p>
                </div>
              </div>
            </Link>

            <Link href="/countries" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌍</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">Browse by Country</h4>
                  <p className="text-xs text-volcanic-400">Complete volcanic profiles for 46 countries</p>
                </div>
              </div>
            </Link>

            <Link href="/about" className="volcano-card group p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h4 className="font-semibold mb-1 group-hover:text-lava transition-colors">About VolcanoAtlas</h4>
                  <p className="text-xs text-volcanic-400">Our mission, data sources & educational goals</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="volcano-card p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="font-mono text-3xl font-bold text-lava mb-1">150</div>
              <div className="text-xs text-volcanic-500 uppercase">Detailed Pages</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-3xl font-bold text-lava mb-1">46</div>
              <div className="text-xs text-volcanic-500 uppercase">Countries</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-3xl font-bold text-lava mb-1">1,356</div>
              <div className="text-xs text-volcanic-500 uppercase">Total Mapped</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-3xl font-bold text-lava mb-1">50+</div>
              <div className="text-xs text-volcanic-500 uppercase">Active Now</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-lava mr-3"></div>
          <h2 className="font-display text-2xl font-bold">About VolcanoAtlas</h2>
        </div>
        
        <div className="max-w-4xl text-sm text-volcanic-400 leading-relaxed">
          <p className="mb-3">
            VolcanoAtlas is the most comprehensive online encyclopedia dedicated to Earth's volcanoes. We make volcanic science accessible through detailed profiles, interactive maps, and data visualizations. Our data comes from the <a href="https://volcano.si.edu/" target="_blank" rel="noopener noreferrer" className="text-lava hover:text-lava-dark transition-colors">Smithsonian Global Volcanism Program</a>, ensuring scientific accuracy.
          </p>
          <p>
            Each profile includes eruption histories, geological data, hazard assessments, and visitor information for students, researchers, educators, and volcano enthusiasts worldwide.
          </p>
        </div>
      </section>
    </div>
  );
}