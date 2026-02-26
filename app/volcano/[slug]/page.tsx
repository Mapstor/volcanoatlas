import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVolcanoBySlug, getAllVolcanoes } from '@/lib/data';
import MapSection from '@/components/MapSection';
import { breakUpLongParagraphs } from '@/lib/textUtils';
import { fetchVolcanoPhotos } from '@/lib/unsplash';
import VolcanoPhotoGallery from '@/components/VolcanoPhotoGallery';
import VolcanoLocationMap from '@/components/VolcanoLocationMap';
import VolcanoDataSections from '@/components/VolcanoDataSections';
import { getVolcanoGeoDataByName, getVolcanoStats } from '@/lib/volcanoDynamicData';
import DynamicVolcanoPage from './DynamicVolcanoPage';
import VolcanoSchema from '@/components/VolcanoSchema';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const volcanoes = await getAllVolcanoes();
  return volcanoes.map((volcano) => ({
    slug: volcano.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const volcano = await getVolcanoBySlug(slug);
  
  if (!volcano) {
    // Try to get dynamic data
    const volcanoName = slug.replace(/-/g, ' ');
    const geoData = getVolcanoGeoDataByName(volcanoName);
    
    if (geoData) {
      return {
        title: `${geoData.properties.Volcano_Name} Volcano, ${geoData.properties.Country} | VolcanoAtlas`,
        description: `${geoData.properties.Primary_Volcano_Type} volcano in ${geoData.properties.Country}. Elevation: ${geoData.properties.Elevation}m. ${geoData.properties.Geological_Summary.substring(0, 150)}...`
      };
    }
    
    return {
      title: 'Volcano Not Found',
      description: 'The requested volcano page could not be found.'
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
  
  // If we don't have a full content file, try to create a dynamic page
  if (!volcano) {
    const volcanoName = slug.replace(/-/g, ' ');
    const geoData = getVolcanoGeoDataByName(volcanoName);
    
    if (!geoData) {
      notFound();
    }
    
    // Get additional data for dynamic page
    const [stats, photos] = await Promise.all([
      getVolcanoStats(volcanoName),
      fetchVolcanoPhotos(volcanoName, 6)
    ]);
    
    return <DynamicVolcanoPage volcanoData={geoData} stats={stats} photos={photos} />;
  }
  
  // We have a full content file, render the normal page
  const [allVolcanoes, photos] = await Promise.all([
    getAllVolcanoes(),
    fetchVolcanoPhotos(volcano.hero.name, 6)
  ]);

  // Get related volcanoes from same country
  const relatedVolcanoes = allVolcanoes
    .filter(v => v.hero.country === volcano.hero.country && v.slug !== volcano.slug)
    .slice(0, 4);

  return (
    <>
      <VolcanoSchema 
        volcano={{
          name: volcano.hero.name,
          country: volcano.hero.country,
          type: volcano.hero.type,
          elevation: volcano.hero?.elevation_m || 0,
          latitude: volcano.hero?.coordinates?.lat || 0,
          longitude: volcano.hero?.coordinates?.lon || 0,
          lastEruption: volcano.hero.last_eruption,
          description: volcano.hero.subtitle,
          slug: volcano.slug,
          status: volcano.hero.status,
          region: volcano.hero.region
        }}
      />
      <div className="min-h-screen bg-gray-900">
        {/* Compact Header Section */}
        <section className="bg-gradient-to-b from-gray-800 to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm mb-4">
              <ol className="flex items-center space-x-2 text-gray-400">
                <li><Link href="/" className="hover:text-orange-500">Home</Link></li>
                <li className="text-gray-600">/</li>
                <li><Link href="/countries" className="hover:text-orange-500">Countries</Link></li>
                <li className="text-gray-600">/</li>
                <li>
                  <Link 
                    href={`/volcanoes-in-${volcano.hero.country.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:text-orange-500"
                  >
                    {volcano.hero.country}
                  </Link>
                </li>
                <li className="text-gray-600">/</li>
                <li className="text-white">{volcano.hero.name}</li>
              </ol>
            </nav>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              {volcano.hero.name}
            </h1>
            <p className="text-lg text-gray-300 mb-4">
              {volcano.hero.subtitle}
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 text-white mt-4">
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <span className="text-gray-400 text-xs">Elevation</span>
                <p className="text-lg font-bold">
                  {volcano.hero?.elevation_m ? `${volcano.hero.elevation_m.toLocaleString()} m` : 
                    (volcano.key_facts_box as any)?.elevation || 'Unknown'}
                </p>
              </div>
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <span className="text-gray-400 text-xs">Last Eruption</span>
                <p className="text-lg font-bold">{volcano.hero.last_eruption}</p>
              </div>
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <span className="text-gray-400 text-xs">Type</span>
                <p className="text-lg font-bold">{volcano.hero.type}</p>
              </div>
              <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                <span className="text-gray-400 text-xs">Country</span>
                <p className="text-lg font-bold">{volcano.hero.country}</p>
              </div>
            </div>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Answer */}
              {(volcano.quick_answer as any)?.question && (volcano.quick_answer as any)?.answer && (
                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-white mb-4">{(volcano.quick_answer as any).question}</h2>
                  <div 
                    className="text-gray-300 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: (volcano.quick_answer as any).answer }}
                  />
                </div>
              )}

              {/* Location Map */}
              {volcano.hero?.coordinates?.lat && volcano.hero?.coordinates?.lon && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Location</h2>
                  <div className="h-[400px] rounded-lg overflow-hidden">
                    <VolcanoLocationMap 
                      volcano={{
                        name: volcano.hero?.name || 'Unknown Volcano',
                        coordinates: { 
                          lat: volcano.hero?.coordinates?.lat || 0, 
                          lon: volcano.hero?.coordinates?.lon || 0 
                        },
                        elevation_m: volcano.hero?.elevation_m || 0,
                        type: volcano.hero?.type || 'Unknown',
                        country: volcano.hero?.country || 'Unknown',
                        region: volcano.hero?.region || 'Unknown',
                        status: volcano.hero?.last_eruption ? `Last eruption: ${volcano.hero.last_eruption}` : 'Unknown'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Main Sections */}
              {volcano.sections && Array.isArray(volcano.sections) && volcano.sections.map((section: any, index: number) => (
                <div key={index}>
                  <h2 className="text-3xl font-bold text-white mb-6">{section.title}</h2>
                  <div 
                    className="text-gray-300 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: breakUpLongParagraphs(section?.content || '', 3) }}
                  />
                </div>
              ))}

              {/* Comprehensive Volcano Data Sections */}
              <VolcanoDataSections 
                volcanoData={{
                  name: volcano.hero?.name || 'Unknown Volcano',
                  country: volcano.hero?.country || 'Unknown',
                  region: volcano.hero?.region || 'Unknown',
                  type: volcano.hero?.type || 'Unknown',
                  rockType: (volcano.key_facts_box as any)?.facts?.find((f: any) => f.label?.toLowerCase().includes('rock'))?.value || 'Unknown',
                  tectonicSetting: (volcano.key_facts_box as any)?.facts?.find((f: any) => f.label?.toLowerCase().includes('tectonic'))?.value || 'Unknown',
                  epoch: (volcano.key_facts_box as any)?.facts?.find((f: any) => f.label?.toLowerCase().includes('epoch'))?.value || 'Unknown',
                  evidence: (volcano.key_facts_box as any)?.facts?.find((f: any) => f.label?.toLowerCase().includes('evidence'))?.value || 'Unknown',
                  elevation: volcano.hero?.elevation_m || 0,
                  lastEruption: volcano.hero?.last_eruption ? parseInt(volcano.hero.last_eruption.replace(/[^\d]/g, '')) : undefined,
                  volcanoNumber: (volcano.key_facts_box as any)?.facts?.find((f: any) => f.label?.toLowerCase().includes('number'))?.value
                }}
                stats={{
                  totalEruptions: (volcano.key_facts_box as any)?.facts?.find((f: any) => f.label?.toLowerCase().includes('eruption'))?.value ? parseInt((volcano.key_facts_box as any).facts.find((f: any) => f.label.toLowerCase().includes('eruption')).value) : undefined,
                  maxVEI: (volcano.key_facts_box as any)?.facts?.find((f: any) => f.label?.toLowerCase().includes('vei'))?.value ? parseInt((volcano.key_facts_box as any).facts.find((f: any) => f.label.toLowerCase().includes('vei')).value) : undefined
                }}
              />

              {/* Photo Gallery */}
              {photos && photos.length > 0 && (
                <VolcanoPhotoGallery photos={photos} volcanoName={volcano.hero?.name || 'Unknown'} />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Key Facts Box */}
              {(volcano.key_facts_box as any)?.facts && Array.isArray((volcano.key_facts_box as any).facts) && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Key Facts</h3>
                  <dl className="space-y-3">
                    {(volcano.key_facts_box as any).facts.map((fact: any, index: number) => (
                      <div key={index}>
                        <dt className="text-gray-400 text-sm">{fact.label}</dt>
                        <dd className="text-white font-semibold">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Related Volcanoes */}
              {relatedVolcanoes.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Other Volcanoes in {volcano.hero?.country || 'Unknown'}
                  </h3>
                  <ul className="space-y-3">
                    {relatedVolcanoes.map((related) => (
                      <li key={related.slug}>
                        <Link 
                          href={`/volcano/${related.slug}`}
                          className="text-orange-500 hover:text-orange-400 transition-colors"
                        >
                          {related.hero.name}
                        </Link>
                        <p className="text-gray-400 text-sm">{related.hero.type}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Facts Section */}
          {volcano.facts && Array.isArray(volcano.facts) && volcano.facts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white mb-6">Interesting Facts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {volcano.facts.map((fact: string, index: number) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-start">
                    <span className="text-orange-500 text-2xl mr-3">🌋</span>
                    <p className="text-gray-300">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {volcano.faqs && Array.isArray(volcano.faqs) && volcano.faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {volcano.faqs.map((faq: any, index: number) => (
                  <details key={index} className="bg-gray-800 rounded-lg overflow-hidden group">
                    <summary className="p-6 cursor-pointer flex justify-between items-center hover:bg-gray-700 transition-colors">
                      <span className="text-white font-semibold">{faq.question}</span>
                      <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <div 
                        className="text-gray-300"
                        dangerouslySetInnerHTML={{ __html: faq?.answer || '' }}
                      />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  );
}