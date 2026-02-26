import Link from 'next/link';
import { NavData } from '@/lib/data';

interface FooterProps {
  navData: NavData;
}

export default function Footer({ navData }: FooterProps) {
  return (
    <footer className="bg-volcanic-850 border-t border-volcanic-700 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Featured Volcanoes */}
          <div>
            <h4 className="font-display text-lava font-bold mb-4">Featured Volcanoes</h4>
            <ul className="space-y-2.5 list-none">
              {navData.featured_volcanoes.slice(0, 6).map((volcano, index) => (
                <li key={index}>
                  <Link 
                    href={volcano.url} 
                    className="text-sm text-volcanic-400 hover:text-white transition-colors"
                  >
                    {volcano.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link 
                  href="/volcanoes" 
                  className="text-sm text-lava hover:text-lava-dark transition-colors font-medium"
                >
                  View All Volcanoes →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Popular Countries */}
          <div>
            <h4 className="font-display text-lava font-bold mb-4">Countries</h4>
            <ul className="space-y-2.5 list-none">
              <li>
                <Link href="/volcanoes-in-indonesia" className="text-sm text-volcanic-400 hover:text-white transition-colors">
                  Indonesia (101 volcanoes)
                </Link>
              </li>
              <li>
                <Link href="/volcanoes-in-united-states" className="text-sm text-volcanic-400 hover:text-white transition-colors">
                  United States (165 volcanoes)
                </Link>
              </li>
              <li>
                <Link href="/volcanoes-in-japan" className="text-sm text-volcanic-400 hover:text-white transition-colors">
                  Japan (105 volcanoes)
                </Link>
              </li>
              <li>
                <Link href="/volcanoes-in-russia" className="text-sm text-volcanic-400 hover:text-white transition-colors">
                  Russia (94 volcanoes)
                </Link>
              </li>
              <li>
                <Link href="/volcanoes-in-iceland" className="text-sm text-volcanic-400 hover:text-white transition-colors">
                  Iceland (35 volcanoes)
                </Link>
              </li>
              <li>
                <Link href="/volcanoes-in-chile" className="text-sm text-volcanic-400 hover:text-white transition-colors">
                  Chile (66 volcanoes)
                </Link>
              </li>
              <li>
                <Link 
                  href="/countries" 
                  className="text-sm text-lava hover:text-lava-dark transition-colors font-medium"
                >
                  All 46 Countries →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h4 className="font-display text-lava font-bold mb-4">Explore</h4>
            <ul className="space-y-2.5 list-none">
              {navData.special_pages.map((page, index) => (
                <li key={index}>
                  <Link 
                    href={page.url} 
                    className="text-sm text-volcanic-400 hover:text-white transition-colors"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
              {navData.rankings.map((ranking, index) => (
                <li key={index}>
                  <Link 
                    href={ranking.url} 
                    className="text-sm text-volcanic-400 hover:text-white transition-colors"
                  >
                    {ranking.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: About */}
          <div>
            <h4 className="font-display text-lava font-bold mb-4">About VolcanoAtlas</h4>
            <p className="text-sm text-volcanic-400 mb-4 leading-relaxed">
              VolcanoAtlas is a comprehensive encyclopedia of Earth&apos;s volcanoes, featuring detailed profiles of 150 volcanoes across 46 countries. Explore eruption histories, interactive maps, and in-depth geological data.
            </p>
            <ul className="space-y-2.5 list-none">
              <li>
                <Link href="/about" className="text-sm text-volcanic-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-volcanic-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-volcanic-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-volcanic-400 hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
            <p className="text-sm text-volcanic-400 mt-4">
              Data sourced from the{' '}
              <a 
                href="https://volcano.si.edu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-lava hover:text-lava-dark hover:underline transition-colors"
              >
                Smithsonian GVP
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-volcanic-700 mt-8 pt-8 text-center text-xs text-volcanic-500">
          © {new Date().getFullYear()} VolcanoAtlas. Data sourced from the Smithsonian Global Volcanism Program.
        </div>
      </div>
    </footer>
  );
}