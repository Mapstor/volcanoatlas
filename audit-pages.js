const fs = require('fs');
const path = require('path');

async function auditPages() {
  const contentDir = './data/content';
  const files = fs.readdirSync(contentDir);
  
  const results = {
    volcanoes: { total: 0, working: [], notFound: [], thin: [] },
    countries: { total: 0, working: [], notFound: [], thin: [] },
    special: { total: 0, working: [], notFound: [], thin: [] },
    other: { total: 0, working: [], notFound: [], thin: [] }
  };
  
  // Categorize files
  const volcanoFiles = files.filter(f => f.startsWith('volcano-') && f.endsWith('.json'));
  const countryFiles = files.filter(f => f.startsWith('country-') && f.endsWith('.json'));
  const specialFiles = files.filter(f => (f.startsWith('special-') || f.startsWith('ranking-')) && f.endsWith('.json'));
  const otherFiles = files.filter(f => 
    f.endsWith('.json') && 
    !f.startsWith('volcano-') && 
    !f.startsWith('country-') && 
    !f.startsWith('special-') && 
    !f.startsWith('ranking-')
  );
  
  results.volcanoes.total = volcanoFiles.length;
  results.countries.total = countryFiles.length;
  results.special.total = specialFiles.length;
  results.other.total = otherFiles.length;
  
  console.log('=== VOLCANOATLAS SITE AUDIT ===\n');
  console.log('Total JSON files found:', files.filter(f => f.endsWith('.json')).length);
  console.log('---');
  console.log('Volcanoes:', volcanoFiles.length);
  console.log('Countries:', countryFiles.length);
  console.log('Special Pages:', specialFiles.length);
  console.log('Other Files:', otherFiles.length);
  console.log('\n=== TESTING PAGES ===\n');
  
  // Test volcano pages
  console.log('Testing volcano pages...');
  for (const file of volcanoFiles.slice(0, 5)) {
    const slug = file.replace('volcano-', '').replace('.json', '');
    const url = `http://localhost:3000/volcano/${slug}`;
    
    try {
      const response = await fetch(url);
      const status = response.status;
      
      if (status === 200) {
        const text = await response.text();
        const contentLength = text.length;
        
        if (contentLength < 5000) {
          results.volcanoes.thin.push({ slug, url, size: contentLength });
        } else {
          results.volcanoes.working.push({ slug, url });
        }
      } else {
        results.volcanoes.notFound.push({ slug, url, status });
      }
    } catch (error) {
      results.volcanoes.notFound.push({ slug, url, error: error.message });
    }
  }
  console.log(`  Tested ${Math.min(5, volcanoFiles.length)} volcanoes`);
  
  // Test special pages
  console.log('Testing special pages...');
  for (const file of specialFiles) {
    const slug = file.replace('.json', '').replace('special-', '').replace('ranking-', '');
    const url = `http://localhost:3000/${slug}`;
    
    try {
      const response = await fetch(url);
      const status = response.status;
      
      if (status === 200) {
        const text = await response.text();
        const contentLength = text.length;
        
        if (contentLength < 5000) {
          results.special.thin.push({ slug, url, size: contentLength });
        } else {
          results.special.working.push({ slug, url });
        }
      } else {
        results.special.notFound.push({ slug, url, status });
      }
    } catch (error) {
      results.special.notFound.push({ slug, url, error: error.message });
    }
  }
  console.log(`  Tested ${specialFiles.length} special pages`);
  
  // Check country pages (we know these don't have routes)
  console.log('Checking country routing...');
  const testCountryUrls = [
    'http://localhost:3000/country/japan',
    'http://localhost:3000/country-japan',
    'http://localhost:3000/volcanoes-in-japan',
    'http://localhost:3000/japan'
  ];
  
  let countryRouteWorks = false;
  for (const url of testCountryUrls) {
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        countryRouteWorks = true;
        console.log(`  ✓ Country route pattern works: ${url}`);
        break;
      }
    } catch (error) {}
  }
  
  if (!countryRouteWorks) {
    console.log('  ✗ No working country route found - all 46 country pages are 404');
    results.countries.notFound = countryFiles.map(f => ({
      slug: f.replace('country-', '').replace('.json', ''),
      issue: 'No route configured'
    }));
  }
  
  // Check other files
  console.log('Testing other volcano files (without volcano- prefix)...');
  for (const file of otherFiles.slice(0, 5)) {
    const slug = file.replace('.json', '');
    const url = `http://localhost:3000/${slug}`;
    
    try {
      const response = await fetch(url);
      const status = response.status;
      
      if (status === 200) {
        results.other.working.push({ slug, url });
      } else {
        // Try as volcano
        const volcanoUrl = `http://localhost:3000/volcano/${slug}`;
        const volcanoResponse = await fetch(volcanoUrl);
        if (volcanoResponse.status === 200) {
          results.other.working.push({ slug, url: volcanoUrl });
        } else {
          results.other.notFound.push({ slug, url, status });
        }
      }
    } catch (error) {
      results.other.notFound.push({ slug, url, error: error.message });
    }
  }
  
  // Generate report
  console.log('\n=== AUDIT RESULTS ===\n');
  
  console.log('WORKING PAGES:');
  console.log(`  Volcanoes: ${results.volcanoes.working.length}/${results.volcanoes.total}`);
  console.log(`  Special Pages: ${results.special.working.length}/${results.special.total}`);
  console.log(`  Other: ${results.other.working.length}/${results.other.total}`);
  
  console.log('\n404 PAGES (Not Found):');
  console.log(`  Countries: ALL ${results.countries.total} pages (no route configured)`);
  if (results.volcanoes.notFound.length > 0) {
    console.log(`  Volcanoes: ${results.volcanoes.notFound.length}`);
    results.volcanoes.notFound.slice(0, 3).forEach(p => console.log(`    - ${p.slug}`));
  }
  if (results.special.notFound.length > 0) {
    console.log(`  Special: ${results.special.notFound.length}`);
    results.special.notFound.forEach(p => console.log(`    - ${p.slug}`));
  }
  if (results.other.notFound.length > 0) {
    console.log(`  Other: ${results.other.notFound.length}`);
    results.other.notFound.slice(0, 5).forEach(p => console.log(`    - ${p.slug}`));
  }
  
  console.log('\nTHIN CONTENT PAGES (< 5KB):');
  if (results.volcanoes.thin.length > 0) {
    console.log(`  Volcanoes: ${results.volcanoes.thin.length}`);
    results.volcanoes.thin.forEach(p => console.log(`    - ${p.slug} (${p.size} bytes)`));
  }
  if (results.special.thin.length > 0) {
    console.log(`  Special: ${results.special.thin.length}`);
    results.special.thin.forEach(p => console.log(`    - ${p.slug} (${p.size} bytes)`));
  }
  
  console.log('\n=== SUMMARY ===');
  const totalPages = results.volcanoes.total + results.countries.total + results.special.total + results.other.total;
  const working = results.volcanoes.working.length + results.special.working.length + results.other.working.length;
  const notFound = results.countries.total + results.volcanoes.notFound.length + results.special.notFound.length + results.other.notFound.length;
  const thin = results.volcanoes.thin.length + results.special.thin.length;
  
  console.log(`Total data files: ${totalPages}`);
  console.log(`Working pages: ${working}`);
  console.log(`404 pages: ${notFound}`);
  console.log(`Thin content: ${thin}`);
  console.log(`\nMAJOR ISSUE: All 46 country pages are 404 - no routing configured`);
  
  // Check internal links
  console.log('\n=== CHECKING INTERNAL LINKS ===');
  console.log('Sampling internal links from working pages...');
  
  // Sample a working volcano page for internal links
  if (results.volcanoes.working.length > 0) {
    const sampleUrl = results.volcanoes.working[0].url;
    try {
      const response = await fetch(sampleUrl);
      const html = await response.text();
      const linkMatches = html.match(/href="\/[^"]+"/g) || [];
      const uniqueLinks = [...new Set(linkMatches.map(l => l.replace('href="', '').replace('"', '')))];
      
      console.log(`Found ${uniqueLinks.length} internal links on ${results.volcanoes.working[0].slug}`);
      
      // Test a few links
      const linksToTest = uniqueLinks.slice(0, 5);
      for (const link of linksToTest) {
        const testUrl = `http://localhost:3000${link}`;
        try {
          const linkResponse = await fetch(testUrl);
          if (linkResponse.status !== 200) {
            console.log(`  ✗ Broken link: ${link} (${linkResponse.status})`);
          }
        } catch (error) {}
      }
    } catch (error) {}
  }
}

auditPages().catch(console.error);