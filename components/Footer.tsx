import Link from 'next/link';
import { NavData, getAllCountries, getAllVolcanoes } from '@/lib/data';
import { GVP_HOME } from '@/lib/site';

interface FooterProps {
  navData: NavData;
}

export default async function Footer({ navData }: FooterProps) {
  const [countries, volcanoes] = await Promise.all([getAllCountries(), getAllVolcanoes()]);

  // Same figure as the country page itself, so a country never shows two different counts.
  const topCountries = countries
    .map((country) => ({
      slug: country.slug,
      name: country.hero.title.replace('Volcanoes in ', '').replace(/^the\s+/i, ''),
      count: country.hero.volcano_count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const linkClass = 'text-sm text-volcanic-300 hover:text-white transition-colors';

  return (
    <footer className="bg-volcanic-850 border-t border-volcanic-700 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <nav aria-label="Volcanoes">
            <h2 className="font-display text-lava font-bold mb-4">Volcanoes</h2>
            <ul className="space-y-2.5 list-none">
              {navData.featured_volcanoes.slice(0, 6).map((volcano, index) => (
                <li key={index}>
                  <Link href={volcano.url} className={linkClass}>
                    {volcano.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/volcanoes" className="text-sm text-lava hover:text-lava-light transition-colors font-medium">
                  All {volcanoes.length} volcano profiles
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Countries">
            <h2 className="font-display text-lava font-bold mb-4">Countries</h2>
            <ul className="space-y-2.5 list-none">
              {topCountries.map((country) => (
                <li key={country.slug}>
                  <Link href={`/volcanoes-in-${country.slug}`} className={linkClass}>
                    {country.name} ({country.count} volcanoes)
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/countries" className="text-sm text-lava hover:text-lava-light transition-colors font-medium">
                  All {countries.length} countries
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Explore">
            <h2 className="font-display text-lava font-bold mb-4">Explore</h2>
            <ul className="space-y-2.5 list-none">
              <li><Link href="/map" className={linkClass}>Interactive Volcano Map</Link></li>
              <li><Link href="/latest-eruptions" className={linkClass}>Latest Eruptions</Link></li>
              {navData.special_pages.map((page, index) => (
                <li key={`s-${index}`}>
                  <Link href={page.url} className={linkClass}>
                    {page.title}
                  </Link>
                </li>
              ))}
              {navData.rankings.map((ranking, index) => (
                <li key={`r-${index}`}>
                  <Link href={ranking.url} className={linkClass}>
                    {ranking.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="About">
            <h2 className="font-display text-lava font-bold mb-4">VolcanoAtlas</h2>
            <ul className="space-y-2.5 list-none">
              <li><Link href="/about" className={linkClass}>About</Link></li>
              <li><Link href="/contact" className={linkClass}>Contact</Link></li>
              <li><Link href="/privacy" className={linkClass}>Privacy Policy</Link></li>
              <li><Link href="/terms" className={linkClass}>Terms of Use</Link></li>
            </ul>
            <p className="text-sm text-volcanic-300 mt-4 leading-relaxed">
              Volcano data from the{' '}
              <a href={GVP_HOME} target="_blank" rel="noopener noreferrer" className="text-lava hover:text-lava-light underline">
                Global Volcanism Program, Smithsonian Institution
              </a>
              .
            </p>
          </nav>
        </div>

        <div className="border-t border-volcanic-700 mt-8 pt-8 text-center text-xs text-volcanic-400">
          © {new Date().getFullYear()} VolcanoAtlas
        </div>
      </div>
    </footer>
  );
}
