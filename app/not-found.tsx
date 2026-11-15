import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] bg-volcanic-950 px-6 lg:px-8 py-20">
      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-lava mb-3">404</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">This page does not exist</h1>
        <p className="text-lg text-volcanic-300 mb-8">
          The address may be mistyped, or the page may have moved. These pages will get you back on track:
        </p>
        <ul className="space-y-3 text-lg">
          <li><Link href="/volcanoes" className="text-lava hover:text-lava-light underline">All volcano profiles</Link></li>
          <li><Link href="/countries" className="text-lava hover:text-lava-light underline">Volcanoes by country</Link></li>
          <li><Link href="/map" className="text-lava hover:text-lava-light underline">Interactive volcano map</Link></li>
          <li><Link href="/latest-eruptions" className="text-lava hover:text-lava-light underline">Latest eruptions</Link></li>
          <li><Link href="/" className="text-lava hover:text-lava-light underline">Homepage</Link></li>
        </ul>
      </div>
    </div>
  );
}
