import Link from 'next/link';
import type { Metadata } from 'next';
import { getVolcanoList, getAllCountries, getMapMarkers } from '@/lib/data';
import MapSection from '@/components/MapSection';
import { getAllGvp } from '@/lib/gvp';
import { GVP_EXPORT_DATE, GVP_HOME, SITE_NAME, pageMeta } from '@/lib/site';

// Shown first on the homepage when a profile exists for them.
const POPULAR_SLUGS = ['stromboli', 'taal', 'pinatubo', 'fujisan', 'vesuvius', 'st-helens', 'krakatau', 'kilauea'];

export async function generateMetadata(): Promise<Metadata> {
  const [volcanoes, countries] = await Promise.all([getVolcanoList(), getAllCountries()]);
  return pageMeta({
    title: `${SITE_NAME} — Every Volcano on Earth`,
    description: `Encyclopedia of Earth's volcanoes: ${volcanoes.length} detailed profiles, ${countries.length} country pages, an interactive map and weekly eruption reports, built on Smithsonian data.`,
    path: '/',
  });
}

const RANKINGS = [
  { href: '/active-volcanoes', title: 'Active volcanoes', text: 'Volcanoes with a confirmed eruption since 2020' },
  { href: '/most-active-volcanoes', title: 'Most active volcanoes', text: 'Ranked by the number of recorded eruptions' },
  { href: '/tallest-volcanoes', title: 'Tallest volcanoes', text: 'Ranked by summit elevation' },
  { href: '/deadliest-eruptions', title: 'Deadliest eruptions', text: 'The eruptions with the highest recorded death tolls' },
  { href: '/supervolcanoes', title: 'Supervolcanoes', text: 'Yellowstone, Toba and other systems capable of VEI 8 eruptions' },
  { href: '/latest-eruptions', title: 'Latest eruptions', text: 'Weekly activity reports and current US alert levels' },
];

const GUIDES = [
  { href: '/ring-of-fire', title: 'Ring of Fire', text: 'The belt of volcanoes and earthquakes around the Pacific' },
  { href: '/types-of-volcanoes', title: 'Types of volcanoes', text: 'Stratovolcanoes, shields, calderas and cinder cones explained' },
  { href: '/volcanic-explosivity-index', title: 'Volcanic Explosivity Index', text: 'How the 0 to 8 VEI scale measures eruption size' },
  { href: '/map', title: 'Volcano map', text: 'Every profiled volcano on one map, with filters' },
  { href: '/countries', title: 'Volcanoes by country', text: 'Lists and maps for each country' },
  { href: '/about', title: 'About VolcanoAtlas', text: 'Who runs the site and where the data comes from' },
];

export default async function HomePage() {
  const [volcanoes, countries, markers] = await Promise.all([getVolcanoList(), getAllCountries(), getMapMarkers()]);
  const databaseTotal = getAllGvp().length;

  const bySlug = new Map(volcanoes.map((v) => [v.slug, v]));
  const featuredVolcanoes = POPULAR_SLUGS.map((slug) => bySlug.get(slug)).filter((v): v is NonNullable<typeof v> => Boolean(v));

  // Counts come from each country page's own figure, so the site shows one number per country.
  const topCountries = countries
    .map((country) => ({
      slug: country.slug,
      name: country.hero.title.replace('Volcanoes in ', '').replace(/^the\s+/i, ''),
      count: country.hero.volcano_count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const fmt = (n: number) => n.toLocaleString('en-US');

  return (
    <div className="bg-volcanic-950">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-tighter mb-3">
            Every Volcano <span className="text-lava">on Earth</span>
          </h1>
          <p className="text-lg text-volcanic-300 mb-6">
            {fmt(volcanoes.length)} detailed profiles, {fmt(countries.length)} country pages and basic records for all{' '}
            {fmt(databaseTotal)} volcanoes in the Smithsonian&apos;s Holocene database.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/map" className="btn-primary text-sm">Interactive map</Link>
            <Link href="/active-volcanoes" className="btn-secondary text-sm">Active volcanoes</Link>
            <Link href="/latest-eruptions" className="btn-secondary text-sm">Latest eruptions</Link>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="rounded-xl overflow-hidden border border-volcanic-700">
          <MapSection markers={markers} heightClass="h-[420px] md:h-[520px]" />
        </div>
        <p className="text-center text-volcanic-400 text-sm mt-2">
          The map shows the {fmt(markers.length)} volcanoes with a full profile. Tap a marker to open it.
        </p>
      </section>

      {/* Popular volcanoes */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Popular volcanoes</h2>
          <Link href="/volcanoes" className="text-lava hover:text-lava-light text-sm font-medium underline">
            All {fmt(volcanoes.length)} profiles
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredVolcanoes.map((volcano) => (
            <Link key={volcano.slug} href={`/volcano/${volcano.slug}`} className="volcano-card group p-4">
              <h3 className="font-display text-lg font-bold mb-2 group-hover:text-lava transition-colors">{volcano.hero.name}</h3>
              <dl className="space-y-1 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-volcanic-400">Country</dt>
                  <dd className="text-volcanic-300 text-right">{volcano.hero.country}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-volcanic-400">Elevation</dt>
                  <dd className="font-mono text-volcanic-300">{fmt(volcano.hero.elevation_m)} m</dd>
                </div>
                {volcano.hero.last_eruption && (
                  <div className="flex justify-between gap-2">
                    <dt className="text-volcanic-400">Last eruption</dt>
                    <dd className="font-mono text-lava text-right">{volcano.hero.last_eruption}</dd>
                  </div>
                )}
              </dl>
            </Link>
          ))}
        </div>
      </section>

      {/* Countries */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Volcanoes by country</h2>
          <Link href="/countries" className="text-lava hover:text-lava-light text-sm font-medium underline">
            All {fmt(countries.length)} countries
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {topCountries.map((country) => (
            <Link
              key={country.slug}
              href={`/volcanoes-in-${country.slug}`}
              className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-4 hover:border-lava transition-colors text-center group"
            >
              <div className="font-mono text-2xl font-bold text-lava mb-1">{fmt(country.count)}</div>
              <div className="text-sm text-volcanic-300 group-hover:text-white transition-colors">{country.name}</div>
            </Link>
          ))}
        </div>
        <p className="text-volcanic-400 text-sm mt-3">Number of Holocene volcanoes listed on each country page.</p>
      </section>

      {/* Rankings and guides */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <h2 className="font-display text-2xl font-bold mb-6">Rankings and current activity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {RANKINGS.map((item) => (
            <Link key={item.href} href={item.href} className="volcano-card group p-4">
              <h3 className="font-semibold mb-1 group-hover:text-lava transition-colors">{item.title}</h3>
              <p className="text-sm text-volcanic-400">{item.text}</p>
            </Link>
          ))}
        </div>

        <h2 className="font-display text-2xl font-bold mb-6">Guides and tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUIDES.map((item) => (
            <Link key={item.href} href={item.href} className="volcano-card group p-4">
              <h3 className="font-semibold mb-1 group-hover:text-lava transition-colors">{item.title}</h3>
              <p className="text-sm text-volcanic-400">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* What is here, and where it comes from */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <h2 className="font-display text-2xl font-bold mb-4">Where the data comes from</h2>
        <div className="max-w-3xl text-volcanic-300 leading-relaxed space-y-3">
          <p>
            Location, elevation, volcano type and eruption records on VolcanoAtlas come from the{' '}
            <a href={GVP_HOME} target="_blank" rel="noopener noreferrer" className="text-lava hover:text-lava-light underline">
              Smithsonian Institution&apos;s Global Volcanism Program
            </a>
            , Volcanoes of the World database (export of {GVP_EXPORT_DATE}).
          </p>
          <p>
            That export lists {fmt(databaseTotal)} volcanoes with activity in the Holocene, the current geological epoch.{' '}
            {fmt(volcanoes.length)} volcanoes have a full profile here; the others have a basic record page.
          </p>
        </div>
      </section>
    </div>
  );
}
