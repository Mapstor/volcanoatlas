import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVolcanoBySlug, getAllVolcanoes } from '@/lib/data';
import QuickAnswer from '@/components/QuickAnswer';
import EruptionTimeline from '@/components/EruptionTimeline';
import VEIChart from '@/components/VEIChart';
import ComparisonTable from '@/components/ComparisonTable';

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
  const volcano = await getVolcanoBySlug(slug);

  if (!volcano) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-20 px-4">
        <div className="container mx-auto">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-6">
            <ol className="flex items-center space-x-2 text-gray-400">
              <li><Link href="/" className="hover:text-amber-500">Home</Link></li>
              <li><span className="text-gray-600">/</span></li>
              <li><Link href="/volcanoes" className="hover:text-amber-500">Volcanoes</Link></li>
              <li><span className="text-gray-600">/</span></li>
              <li className="text-white">{volcano.title}</li>
            </ol>
          </nav>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                {volcano.hero.name}
              </h1>
              {volcano.hero.local_name && (
                <p className="text-xl text-gray-400 mb-4">{volcano.hero.local_name}</p>
              )}
              <p className="text-2xl text-amber-500 mb-6">{volcano.hero.subtitle}</p>
              
              {/* Key Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white font-semibold">{volcano.hero.country}, {volcano.hero.region}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Type</p>
                  <p className="text-white font-semibold">{volcano.hero.type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Elevation</p>
                  <p className="text-white font-semibold">{volcano.hero.elevation_m.toLocaleString()} m ({volcano.hero.elevation_ft.toLocaleString()} ft)</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-white font-semibold">{volcano.hero.status}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Eruption</p>
                  <p className="text-white font-semibold">{volcano.hero.last_eruption}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Coordinates</p>
                  <p className="text-white font-semibold">{volcano.hero.coordinates.lat}°N, {volcano.hero.coordinates.lon}°E</p>
                </div>
              </div>
            </div>

            {/* Key Facts Box */}
            {volcano.key_facts_box && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-amber-500 mb-4">Key Facts</h2>
                <dl className="space-y-3">
                  {volcano.key_facts_box.total_recorded_eruptions && (
                  <div>
                    <dt className="text-gray-400 text-sm">Total Recorded Eruptions</dt>
                    <dd className="text-white font-semibold">{volcano.key_facts_box.total_recorded_eruptions}</dd>
                  </div>
                )}
                {volcano.key_facts_box.confirmed_eruptions && (
                  <div>
                    <dt className="text-gray-400 text-sm">Confirmed Eruptions</dt>
                    <dd className="text-white font-semibold">{volcano.key_facts_box.confirmed_eruptions}</dd>
                  </div>
                )}
                {volcano.key_facts_box.vei_max && (
                  <div>
                    <dt className="text-gray-400 text-sm">Maximum VEI</dt>
                    <dd className="text-white font-semibold">{volcano.key_facts_box.vei_max}</dd>
                  </div>
                )}
                {volcano.key_facts_box.first_known_eruption && (
                  <div>
                    <dt className="text-gray-400 text-sm">First Known Eruption</dt>
                    <dd className="text-white font-semibold">{volcano.key_facts_box.first_known_eruption}</dd>
                  </div>
                )}
                {volcano.key_facts_box.tectonic_setting && (
                  <div>
                    <dt className="text-gray-400 text-sm">Tectonic Setting</dt>
                    <dd className="text-white">{volcano.key_facts_box.tectonic_setting}</dd>
                  </div>
                )}
                {volcano.key_facts_box.nearest_city && (
                  <div>
                    <dt className="text-gray-400 text-sm">Nearest City</dt>
                    <dd className="text-white">{volcano.key_facts_box.nearest_city}</dd>
                  </div>
                )}
                {volcano.key_facts_box.population_at_risk && (
                  <div>
                    <dt className="text-gray-400 text-sm">Population at Risk</dt>
                    <dd className="text-white">{volcano.key_facts_box.population_at_risk}</dd>
                  </div>
                )}
                {volcano.key_facts_box.rock_types && (
                  <div>
                    <dt className="text-gray-400 text-sm">Rock Types</dt>
                    <dd className="text-white">{volcano.key_facts_box.rock_types.join(', ')}</dd>
                  </div>
                )}
                {volcano.key_facts_box.monitoring_agency && (
                  <div>
                    <dt className="text-gray-400 text-sm">Monitoring Agency</dt>
                    <dd className="text-white">{volcano.key_facts_box.monitoring_agency}</dd>
                  </div>
                )}
                {volcano.key_facts_box.gvp_url && (
                  <div>
                    <dt className="text-gray-400 text-sm">External Links</dt>
                    <dd>
                      <a 
                        href={volcano.key_facts_box.gvp_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber-500 hover:text-amber-400 text-sm"
                      >
                        Smithsonian GVP →
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Quick Answer Box */}
          <QuickAnswer
            what={volcano.quick_answer.what}
            status={volcano.quick_answer.status}
            famousFor={volcano.quick_answer.famous_for}
            dangerLevel={volcano.quick_answer.danger_level}
          />

          {/* Content Sections */}
          {volcano.sections.overview && (
            <div className="prose prose-lg prose-invert max-w-none mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: volcano.sections.overview.content }}
              />
            </div>
          )}

          {volcano.sections.geology_and_formation && (
            <div className="prose prose-lg prose-invert max-w-none mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Geology & Formation</h2>
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: volcano.sections.geology_and_formation.content }}
              />
            </div>
          )}

          {volcano.sections.eruption_history_overview && (
            <div className="prose prose-lg prose-invert max-w-none mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Eruption History</h2>
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: volcano.sections.eruption_history_overview.content }}
              />
            </div>
          )}

          {/* Notable Eruptions */}
          {volcano.sections.notable_eruptions?.subsections && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Notable Eruptions</h2>
              <div className="space-y-8">
                {volcano.sections.notable_eruptions.subsections.map((eruption: any, index: number) => (
                  <div key={index} className="bg-[#1a1a1a] rounded-lg p-6">
                    <h3 className="text-xl font-bold text-amber-500 mb-3">{eruption.title}</h3>
                    <div 
                      className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: eruption.content }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eruption Timeline */}
          {volcano.eruption_timeline && volcano.eruption_timeline.length > 0 && (
            <EruptionTimeline events={volcano.eruption_timeline} />
          )}

          {/* VEI Distribution */}
          {volcano.vei_distribution && (
            <VEIChart distribution={volcano.vei_distribution} />
          )}

          {/* Current Status & Monitoring */}
          {volcano.sections.current_status_and_monitoring && (
            <div className="prose prose-lg prose-invert max-w-none mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Current Status & Monitoring</h2>
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: volcano.sections.current_status_and_monitoring.content }}
              />
            </div>
          )}

          {/* Hazards & Risk Assessment */}
          {volcano.sections.hazards_and_risk_assessment && (
            <div className="prose prose-lg prose-invert max-w-none mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Hazards & Risk Assessment</h2>
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: volcano.sections.hazards_and_risk_assessment.content }}
              />
            </div>
          )}

          {/* Visitor Information */}
          {volcano.sections.visitor_information && (
            <div className="prose prose-lg prose-invert max-w-none mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Visitor Information</h2>
              <div 
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: volcano.sections.visitor_information.content }}
              />
            </div>
          )}

          {/* Comparison Tables */}
          {volcano.comparison_tables && volcano.comparison_tables.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Comparisons</h2>
              {volcano.comparison_tables.map((table: any, index: number) => (
                <ComparisonTable
                  key={index}
                  title={table.title}
                  description={table.description}
                  headers={table.headers}
                  rows={table.rows}
                />
              ))}
            </div>
          )}

          {/* Facts Section */}
          {volcano.facts && volcano.facts.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-lg p-6 mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Quick Facts</h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {volcano.facts.map((fact: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    <span className="text-gray-300">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs Section */}
          {volcano.faqs && volcano.faqs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {volcano.faqs.map((faq: any, index: number) => (
                  <details key={index} className="group bg-[#1a1a1a] rounded-lg">
                    <summary className="cursor-pointer px-6 py-4 font-semibold text-white hover:text-amber-500 transition-colors">
                      {faq.question}
                    </summary>
                    <div className="px-6 pb-4">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Related Volcanoes */}
          {volcano.related_volcanoes && volcano.related_volcanoes.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">Related Volcanoes</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {volcano.related_volcanoes.map((related: any, index: number) => (
                  <Link
                    key={index}
                    href={`/volcano/${related.slug || ''}`}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-amber-500/50 hover:bg-[#252525] transition-all"
                  >
                    <h3 className="font-semibold text-white hover:text-amber-500">{related.name || related.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{related.country || ''}</p>
                    {related.type && (
                      <p className="text-xs text-gray-500 mt-1">{related.type}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}