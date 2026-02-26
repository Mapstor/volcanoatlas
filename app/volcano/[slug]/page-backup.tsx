import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVolcanoBySlug, getAllVolcanoes } from '@/lib/data';
import MapSection from '@/components/MapSection';
import { breakUpLongParagraphs } from '@/lib/textUtils';
import { fetchVolcanoPhotos } from '@/lib/unsplash';
import VolcanoPhotoGallery from '@/components/VolcanoPhotoGallery';
import VolcanoLocationMap from '@/components/VolcanoLocationMap';

export async function generateStaticParams() {
  const volcanoes = await getAllVolcanoes();
  return volcanoes.map((volcano) => ({
    slug: volcano.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const volcano = await getVolcanoBySlug(slug);
  
  if (!volcano) {
    return {
      title: 'Volcano Not Found',
    };
  }

  return {
    title: volcano.meta_title,
    description: volcano.meta_description,
  };
}

export default async function VolcanoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [volcano, allVolcanoes, photos] = await Promise.all([
    getVolcanoBySlug(slug),
    getAllVolcanoes(),
    getVolcanoBySlug(slug).then(v => v ? fetchVolcanoPhotos(v.hero.name, 6) : [])
  ]);

  if (!volcano) {
    notFound();
  }

  // Get related volcanoes from same country
  const relatedVolcanoes = allVolcanoes
    .filter(v => v.hero.country === volcano.hero.country && v.slug !== volcano.slug)
    .slice(0, 4);

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/volcanoes-in-${volcano.hero.country.toLowerCase().replace(/ /g, '-')}`} className="hover:text-[var(--accent)]">
          {volcano.hero.country}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text-secondary)]">{volcano.hero.name}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-2">{volcano.hero.name}</h1>
        {volcano.hero.local_name && (
          <p className="text-[var(--text-muted)] text-lg mb-1 italic">{volcano.hero.local_name}</p>
        )}
        <p className="text-[var(--accent)] text-xl font-['Playfair_Display'] mb-6">{volcano.hero.subtitle}</p>
        
        {/* Hero stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Location</div>
            <div className="text-white font-medium">{volcano.hero.country}, {volcano.hero.region}</div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Elevation</div>
            <div className="text-white font-mono font-medium">{volcano.hero.elevation_m.toLocaleString()} m</div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Status</div>
            <div className={`font-medium ${volcano.hero.status.toLowerCase().includes('active') ? 'text-[var(--accent)]' : 'text-white'}`}>
              {volcano.hero.status}
            </div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Last Eruption</div>
            <div className="text-white font-mono font-medium">{volcano.hero.last_eruption}</div>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content (left) */}
        <div className="flex-1 min-w-0 lg:max-w-[65%]">
          
          {/* Photo Gallery */}
          {photos && photos.length > 0 && (
            <section className="mb-10">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                           pl-4 border-l-4 border-[var(--accent)]">
                Photo Gallery
              </h2>
              <VolcanoPhotoGallery photos={photos} volcanoName={volcano.hero.name} />
            </section>
          )}

          {/* Location Map */}
          <section className="mb-10">
            <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                         pl-4 border-l-4 border-[var(--accent)]">
              Location
            </h2>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="h-[400px]">
                <VolcanoLocationMap volcano={volcano.hero} zoom={4} height="h-[400px]" />
              </div>
              <div className="p-4 border-t border-[var(--border)] grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Coordinates</div>
                  <div className="font-mono text-[var(--text-secondary)]">
                    {volcano.hero.coordinates.lat}°, {volcano.hero.coordinates.lon}°
                  </div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Region</div>
                  <div className="text-[var(--text-secondary)]">{volcano.hero.region}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Country</div>
                  <div className="text-[var(--text-secondary)]">{volcano.hero.country}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Elevation</div>
                  <div className="font-mono text-[var(--text-secondary)]">{volcano.hero.elevation_m.toLocaleString()} m</div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Answer Box */}
          <div className="bg-[var(--accent-subtle)] border-l-4 border-[var(--accent)] rounded-r-xl p-6 mb-10">
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[var(--accent)] mb-4">Quick Answer</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">What is it?</div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{volcano.quick_answer.what}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Current Status</div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{volcano.quick_answer.status}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Famous For</div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{volcano.quick_answer.famous_for}</p>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Danger Level</div>
                <p className="text-[var(--text-secondary)] leading-relaxed">{volcano.quick_answer.danger_level}</p>
              </div>
            </div>
          </div>
          
          {/* Content Sections */}
          {Object.entries(volcano.sections).map(([key, section]: [string, any]) => {
            // Skip sections without content or special sections
            if (!section.content || key === 'notable_eruptions') return null;
            
            return (
              <section key={key} className="mb-10" id={key}>
                <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                             pl-4 border-l-4 border-[var(--accent)]">
                  {section.title || key.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h2>
                <div className="prose prose-invert prose-lg max-w-none text-[var(--text-secondary)] leading-relaxed
                              prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed
                              prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
                              prose-strong:text-white prose-h3:font-['Playfair_Display'] prose-h3:text-xl
                              prose-h3:font-semibold prose-h3:text-white prose-h3:mb-4"
                     dangerouslySetInnerHTML={{ __html: breakUpLongParagraphs(section.content, 3) }}
                />
              </section>
            );
          })}

          {/* Notable Eruptions */}
          {volcano.sections.notable_eruptions?.subsections && (
            <section className="mb-10" id="notable-eruptions">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                           pl-4 border-l-4 border-[var(--accent)]">
                Notable Eruptions
              </h2>
              <div className="space-y-6">
                {volcano.sections.notable_eruptions.subsections.map((eruption: any, index: number) => (
                  <div key={index} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
                    <h3 className="font-['Playfair_Display'] text-xl font-semibold text-white mb-2">
                      {eruption.title}
                    </h3>
                    {/* Extract VEI and deaths from content if present */}
                    <div className="flex gap-2 mb-4">
                      {eruption.content.includes('VEI') && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium 
                                       bg-[var(--accent-subtle)] text-[var(--accent)]">
                          VEI {eruption.content.match(/VEI\s*(\d)/)?.[1] || 'N/A'}
                        </span>
                      )}
                      {eruption.content.toLowerCase().includes('death') && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium 
                                       bg-red-500/15 text-red-400">
                          Casualties
                        </span>
                      )}
                    </div>
                    <div className="prose prose-invert max-w-none text-[var(--text-secondary)]
                                  prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed
                                  prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline"
                         dangerouslySetInnerHTML={{ __html: breakUpLongParagraphs(eruption.content, 3) }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Comparison Tables */}
          {volcano.comparison_tables && volcano.comparison_tables.length > 0 && (
            <section className="mb-10">
              {volcano.comparison_tables.map((table: any, index: number) => (
                <div key={index} className="mb-8">
                  <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                               pl-4 border-l-4 border-[var(--accent)]">
                    {table.title}
                  </h2>
                  {table.description && (
                    <p className="text-[var(--text-secondary)] mb-4">{table.description}</p>
                  )}
                  <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[var(--accent)]/10 border-b border-[var(--border)]">
                          {table.headers.map((header: string, i: number) => (
                            <th key={i} className="text-left p-4 text-[var(--accent)] font-semibold text-xs uppercase tracking-wider">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows && table.rows.map((row: string[], rowIndex: number) => (
                          <tr key={`row-${rowIndex}`} className={`border-b border-[var(--border)] hover:bg-[var(--bg-card-hover)] ${
                            rowIndex % 2 === 0 ? 'bg-[var(--bg-card)]' : ''
                          }`}>
                            {row && row.map((cell: string, cellIndex: number) => (
                              <td key={`cell-${rowIndex}-${cellIndex}`} className={`p-4 ${
                                cellIndex === 0 ? 'text-white font-medium' : 'text-[var(--text-secondary)]'
                              }`}>
                                {cell && typeof cell === 'string' ? (
                                  <span dangerouslySetInnerHTML={{ __html: cell }} />
                                ) : (
                                  cell || ''
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Eruption Timeline */}
          {volcano.eruption_timeline && volcano.eruption_timeline.length > 0 && (
            <section className="mb-10">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                           pl-4 border-l-4 border-[var(--accent)]">
                Eruption Timeline
              </h2>
              <div className="relative pl-8 border-l-2 border-[var(--border)] space-y-6">
                {volcano.eruption_timeline.slice(0, 20).map((event: any, index: number) => (
                  <div key={index} className="relative">
                    <div className={`absolute -left-[2.45rem] w-4 h-4 rounded-full border-2 border-[var(--bg-primary)] ${
                      event.notable ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                    }`}></div>
                    <div className="bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border)]">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-mono text-[var(--accent)] font-bold">
                          {event.year < 0 ? `${Math.abs(event.year)} BCE` : `${event.year} CE`}
                        </span>
                        {event.vei !== null && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium 
                                         bg-[var(--accent-subtle)] text-[var(--accent)]">
                            VEI {event.vei}
                          </span>
                        )}
                        {event.notable && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                         bg-amber-500/20 text-amber-400">
                            Notable
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{event.label}</p>
                      {event.deaths !== null && event.deaths > 0 && (
                        <p className="text-sm text-red-400 mt-1">
                          {event.deaths.toLocaleString()} deaths
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {volcano.eruption_timeline.length > 20 && (
                <p className="text-center text-[var(--text-muted)] text-sm mt-6">
                  Showing 20 most recent of {volcano.eruption_timeline.length} recorded eruptions
                </p>
              )}
            </section>
          )}

          {/* VEI Distribution Chart */}
          {volcano.vei_distribution && volcano.vei_distribution.length > 0 && (
            <section className="mb-10">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                           pl-4 border-l-4 border-[var(--accent)]">
                Eruption Intensity Distribution
              </h2>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {volcano.vei_distribution.map((item: any) => (
                    <div key={item.vei} className="text-center">
                      <div className="font-mono text-2xl font-bold text-[var(--accent)] mb-1">{item.count}</div>
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">VEI {item.vei}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Facts */}
          {volcano.facts && volcano.facts.length > 0 && (
            <section className="mb-10">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                           pl-4 border-l-4 border-[var(--accent)]">
                Key Facts
              </h2>
              <div className="grid gap-4">
                {volcano.facts.map((fact: string, index: number) => (
                  <div key={index} className="flex gap-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] 
                                   font-mono font-bold text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{fact}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {volcano.faqs && volcano.faqs.length > 0 && (
            <section className="mb-10">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                           pl-4 border-l-4 border-[var(--accent)]">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden">
                {volcano.faqs.map((faq: any, index: number) => (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between p-5 cursor-pointer 
                                     bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors">
                      <span className="font-medium text-white pr-4">{faq.question}</span>
                      <svg className="w-5 h-5 text-[var(--text-muted)] group-open:rotate-180 transition-transform flex-shrink-0" 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="p-5 bg-[var(--bg-primary)] text-[var(--text-secondary)] leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related Volcanoes */}
          {relatedVolcanoes.length > 0 && (
            <section className="mb-10">
              <h2 className="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                           pl-4 border-l-4 border-[var(--accent)]">
                More Volcanoes in {volcano.hero.country}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedVolcanoes.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/volcano/${related.slug}`}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-5 
                             hover:border-[var(--accent)] transition-all group"
                  >
                    <h3 className="font-semibold text-white group-hover:text-[var(--accent)] transition-colors mb-2">
                      {related.hero.name}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-[var(--text-muted)]">Type: <span className="text-[var(--text-secondary)]">{related.hero.type}</span></p>
                      <p className="text-[var(--text-muted)]">Elevation: <span className="font-mono text-[var(--text-secondary)]">{related.hero.elevation_m.toLocaleString()} m</span></p>
                      <p className="text-[var(--text-muted)]">Status: <span className={`${related.hero.status.toLowerCase().includes('active') ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{related.hero.status}</span></p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar (right) */}
        <aside className="lg:w-[33%] flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-6">
            
            {/* Key Facts Card */}
            {volcano.key_facts_box && (
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-[var(--accent)] mb-4">Key Facts</h3>
                <dl className="space-y-3">
                  {volcano.key_facts_box.elevation && (
                    <>
                      <div className="flex justify-between items-baseline">
                        <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Elevation</dt>
                        <dd className="font-mono text-white font-medium">{volcano.key_facts_box.elevation}</dd>
                      </div>
                      <div className="border-t border-[var(--border)]"></div>
                    </>
                  )}
                  {volcano.key_facts_box.type && (
                    <>
                      <div className="flex justify-between items-baseline">
                        <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Type</dt>
                        <dd className="text-white font-medium text-sm">{volcano.key_facts_box.type}</dd>
                      </div>
                      <div className="border-t border-[var(--border)]"></div>
                    </>
                  )}
                  {volcano.key_facts_box.total_recorded_eruptions && (
                    <>
                      <div className="flex justify-between items-baseline">
                        <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Total Eruptions</dt>
                        <dd className="font-mono text-white font-medium">{volcano.key_facts_box.total_recorded_eruptions}</dd>
                      </div>
                      <div className="border-t border-[var(--border)]"></div>
                    </>
                  )}
                  {volcano.key_facts_box.vei_max && (
                    <>
                      <div className="flex justify-between items-baseline">
                        <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Max VEI</dt>
                        <dd className="font-mono text-white font-medium">{volcano.key_facts_box.vei_max}</dd>
                      </div>
                      <div className="border-t border-[var(--border)]"></div>
                    </>
                  )}
                  {volcano.key_facts_box.tectonic_setting && (
                    <div className="pt-2">
                      <dt className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Tectonic Setting</dt>
                      <dd className="text-white text-sm">{volcano.key_facts_box.tectonic_setting}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Table of Contents */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[var(--accent)] mb-4">Contents</h3>
              <nav className="space-y-2">
                <a href="#quick-answer" className="block text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] 
                                                  transition-colors py-1 pl-3 border-l-2 border-transparent 
                                                  hover:border-[var(--accent)]">
                  Quick Answer
                </a>
                {Object.entries(volcano.sections).map(([key, section]: [string, any]) => {
                  if (!section.content) return null;
                  return (
                    <a key={key} href={`#${key}`} className="block text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] 
                                                            transition-colors py-1 pl-3 border-l-2 border-transparent 
                                                            hover:border-[var(--accent)]">
                      {section.title || key.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </a>
                  );
                })}
                {volcano.facts && volcano.facts.length > 0 && (
                  <a href="#facts" className="block text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] 
                                            transition-colors py-1 pl-3 border-l-2 border-transparent 
                                            hover:border-[var(--accent)]">
                    Key Facts
                  </a>
                )}
                {volcano.faqs && volcano.faqs.length > 0 && (
                  <a href="#faqs" className="block text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] 
                                           transition-colors py-1 pl-3 border-l-2 border-transparent 
                                           hover:border-[var(--accent)]">
                    FAQs
                  </a>
                )}
              </nav>
            </div>

            {/* External Links */}
            {volcano.key_facts_box?.gvp_url && (
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">External Links</h3>
                <div className="space-y-2">
                  <a href={volcano.key_facts_box.gvp_url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline">
                    <span>→</span> Smithsonian GVP
                  </a>
                </div>
              </div>
            )}

            {/* Location Map */}
            {volcano.hero.coordinates && (
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-[var(--accent)] mb-4">Location</h3>
                <div className="h-[200px] rounded-lg overflow-hidden border border-[var(--border)]">
                  <MapSection 
                    markers={[{
                      title: volcano.hero.name,
                      slug: `/volcano/${volcano.slug}`,
                      lat: volcano.hero.coordinates.lat,
                      lon: volcano.hero.coordinates.lon,
                      type: volcano.hero.type,
                      elevation: `${volcano.hero.elevation_m.toLocaleString()} m`,
                      country: volcano.hero.country,
                      last_eruption: volcano.hero.last_eruption,
                      status: volcano.hero.status
                    }]}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  {volcano.hero.coordinates.lat}°{volcano.hero.coordinates.lat > 0 ? 'N' : 'S'}, {' '}
                  {Math.abs(volcano.hero.coordinates.lon)}°{volcano.hero.coordinates.lon > 0 ? 'E' : 'W'}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}