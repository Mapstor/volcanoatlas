import Link from 'next/link';
import { getAllCountries, getAllVolcanoes } from '@/lib/data';
import { getAllGvp } from '@/lib/gvp';
import JsonLd from '@/components/JsonLd';
import { AUTHOR, GVP_EXPORT_DATE, GVP_HOME, SITE_URL, pageMeta } from '@/lib/site';

export const metadata = pageMeta({
  title: 'About VolcanoAtlas',
  description: 'What VolcanoAtlas is, who reviews its pages, where its volcano data comes from and how to report a mistake.',
  path: '/about',
});

const linkClass = 'text-lava hover:text-lava-light underline';

export default async function AboutPage() {
  const [volcanoes, countries] = await Promise.all([getAllVolcanoes(), getAllCountries()]);
  const gvpCount = getAllGvp().length.toLocaleString('en-US');

  // Describes only what this page shows: the reviewer's name, degrees and public profile.
  const authorLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}${AUTHOR.page}#author`,
    name: AUTHOR.name,
    url: `${SITE_URL}${AUTHOR.page}`,
    alumniOf: { '@type': 'CollegeOrUniversity', name: AUTHOR.university },
    hasCredential: AUTHOR.degrees.map((degree) => ({ '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: degree })),
    sameAs: [AUTHOR.profile],
  };

  return (
    <div className="min-h-screen bg-volcanic-950">
      <JsonLd data={authorLd} />
      <section className="bg-gradient-to-b from-volcanic-900 to-volcanic-950 py-16 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-volcanic-400 mb-6">
            <Link href="/" className="hover:text-lava">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">About</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">About VolcanoAtlas</h1>
          <p className="text-xl text-volcanic-300">A free reference site about the world&apos;s volcanoes.</p>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10 text-lg text-volcanic-200 leading-relaxed">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">What is on the site</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link href="/volcanoes" className={linkClass}>{volcanoes.length} volcano profiles</Link> and{' '}
                <Link href="/countries" className={linkClass}>{countries.length} country pages</Link>.
              </li>
              <li>
                A <Link href="/map" className={linkClass}>world map</Link> of the profiled volcanoes.
              </li>
              <li>
                A <Link href="/latest-eruptions" className={linkClass}>latest eruptions page</Link> that follows the weekly
                reports from the Smithsonian Institution and the USGS.
              </li>
              <li>
                A short data page for each of the {gvpCount} volcanoes in the Smithsonian&apos;s Holocene volcano list.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">Where the data comes from</h2>
            <p className="mb-4">
              VolcanoAtlas is built on <cite>Volcanoes of the World</cite>, the database of the{' '}
              <a href={GVP_HOME} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Global Volcanism Program, Smithsonian Institution
              </a>{' '}
              (version 5.3.4, exported on {GVP_EXPORT_DATE}). Volcano pages link to the matching Smithsonian record where there is one.
            </p>
            <p className="mb-4">
              Pages that have been rebuilt use version 5.4.0 of that database together with NOAA&apos;s database of significant
              eruptions and the observatory that monitors the volcano. They list their sources, and how each calculated number
              was worked out, at the end of the page.
            </p>
            <p>
              The latest eruptions page reads two public feeds: the{' '}
              <a href="https://volcano.si.edu/reports_weekly.cfm" target="_blank" rel="noopener noreferrer" className={linkClass}>
                Smithsonian / USGS Weekly Volcanic Activity Report
              </a>{' '}
              and the{' '}
              <a href="https://www.usgs.gov/programs/VHP/volcano-updates" target="_blank" rel="noopener noreferrer" className={linkClass}>
                USGS volcano updates
              </a>
              .
            </p>
          </div>

          <div id="author">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">Who reviews the pages</h2>
            <p>
              VolcanoAtlas is run by {AUTHOR.name}. He holds a {AUTHOR.degrees[0]}, and a {AUTHOR.degrees[1]}, both at the{' '}
              {AUTHOR.university}, Slovenia. A page carries his name and a review date only after he has read it.{' '}
              <a href={AUTHOR.profile} target="_blank" rel="me noopener noreferrer" className={linkClass}>
                {AUTHOR.name} on LinkedIn
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">How the site is made</h2>
            <p>
              The texts on VolcanoAtlas were drafted with AI assistance. A page-by-page check of every figure against its
              source began in November 2026, and corrections are published as they are found.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">What VolcanoAtlas is not</h2>
            <p>
              VolcanoAtlas is not a monitoring agency. It does not issue warnings or forecasts. If you live near a volcano
              or plan to visit one, follow your local volcano observatory and civil protection authority.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">Report a mistake</h2>
            <p>
              Found a wrong number or a broken page? Write to{' '}
              <a href="mailto:info@volcanosatlas.com" className={linkClass}>info@volcanosatlas.com</a> or see the{' '}
              <Link href="/contact" className={linkClass}>contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
