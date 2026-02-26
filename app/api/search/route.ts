import { NextRequest, NextResponse } from 'next/server';
import { getAllVolcanoes, getAllCountries, getAllSpecialPages } from '@/lib/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';
  const limit = parseInt(searchParams.get('limit') || '20');
  const category = searchParams.get('category') || 'all';

  if (!query || query.length < 2) {
    return NextResponse.json({ 
      results: [], 
      total: 0,
      query 
    });
  }

  try {
    const results: any[] = [];

    // Search volcanoes
    if (category === 'all' || category === 'volcanoes') {
      const volcanoes = await getAllVolcanoes();
      const volcanoResults = volcanoes
        .filter(volcano => 
          volcano.hero.name.toLowerCase().includes(query) ||
          volcano.hero.country.toLowerCase().includes(query) ||
          volcano.hero.type.toLowerCase().includes(query) ||
          volcano.hero.status.toLowerCase().includes(query)
        )
        .slice(0, limit)
        .map(volcano => ({
          type: 'volcano',
          title: volcano.hero.name,
          subtitle: `${volcano.hero.country} • ${volcano.hero.type}`,
          description: `${volcano.hero.elevation_m.toLocaleString()}m • ${volcano.hero.status}`,
          url: `/volcano/${volcano.slug}`,
          status: volcano.hero.status,
          lastEruption: volcano.hero.last_eruption,
        }));
      
      results.push(...volcanoResults);
    }

    // Search countries
    if (category === 'all' || category === 'countries') {
      const countries = await getAllCountries();
      const countryResults = countries
        .filter(country => 
          country.title.toLowerCase().includes(query) ||
          country.hero.subtitle.toLowerCase().includes(query)
        )
        .slice(0, limit)
        .map(country => ({
          type: 'country',
          title: country.title,
          subtitle: country.hero.subtitle,
          description: `${country.hero.volcano_count} volcanoes${country.hero.active_count ? ` • ${country.hero.active_count} active` : ''}`,
          url: `/volcanoes-in-${country.slug}`,
          volcanoCount: country.hero.volcano_count,
        }));
      
      results.push(...countryResults);
    }

    // Search special pages
    if (category === 'all' || category === 'pages') {
      const specialPages = await getAllSpecialPages();
      const specialResults = await Promise.all(
        specialPages.map(async (page) => {
          const { getSpecialPage } = await import('@/lib/data');
          const pageData = await getSpecialPage(page.slug);
          if (!pageData) return null;
          
          if (
            pageData.title.toLowerCase().includes(query) ||
            pageData.hero.subtitle.toLowerCase().includes(query)
          ) {
            return {
              type: pageData.page_type === 'ranking' ? 'ranking' : 'special',
              title: pageData.title,
              subtitle: pageData.hero.subtitle,
              description: pageData.page_type === 'ranking' ? 'Ranking' : 'Special Page',
              url: `/${page.slug}`,
            };
          }
          return null;
        })
      );
      
      results.push(...specialResults.filter(Boolean));
    }

    // Sort results by relevance (exact matches first)
    results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === query;
      const bExact = b.title.toLowerCase() === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      const aStarts = a.title.toLowerCase().startsWith(query);
      const bStarts = b.title.toLowerCase().startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      return 0;
    });

    return NextResponse.json({
      results: results.slice(0, limit),
      total: results.length,
      query,
      category,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}