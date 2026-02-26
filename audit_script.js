const fs = require('fs');
const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3200';

// All static routes
const staticRoutes = [
  '/',
  '/contact',
  '/privacy', 
  '/terms',
  '/about',
  '/volcanoes',
  '/map',
  '/latest-eruptions',
  '/countries'
];

// Special page routes (from [slug] page)
const specialRoutes = [
  '/ring-of-fire',
  '/supervolcanoes',
  '/types-of-volcanoes',
  '/volcanic-explosivity-index',
  '/active-volcanoes',
  '/deadliest-eruptions',
  '/most-active-volcanoes',
  '/tallest-volcanoes'
];

// Volcano routes (volcano/[slug])
const volcanoSlugs = [
  "agua-de-pau", "aira", "akutan", "ambae", "ambrym", "arenal", "asamayama", "asosan",
  "avachinsky", "azul-cerro", "bagana", "bardarbunga", "barren-island", "bezymianny",
  "blanco-cerro", "bulusan", "calbuco", "campi-flegrei", "chaiten", "changbaishan",
  "chichon-el", "chikurachki", "chillan-nevados-de", "colima", "concepcion", "copahue",
  "cotopaxi", "crater-lake", "deception-island", "east-epi", "erebus", "erta-ale", "etna",
  "eyjafjallajokull", "fernandina", "fonualei", "fuego", "fujisan", "furnas", "galeras",
  "gamalama", "gaua", "gorely", "grimsvotn", "guagua-pichincha", "heard", "hekla",
  "home-reef", "hudson-cerro", "hunga-tonga-hunga-ha-apai", "irazu", "izalco", "izu-oshima",
  "jan-mayen", "kanlaon", "karangetang", "karthala", "karymsky", "katla", "kavachi",
  "kelud", "kikai", "kilauea", "kirishimayama", "klyuchevskoy", "krakatau", "krasheninnikov",
  "la-palma", "lascar", "lengai-ol-doinyo", "llaima", "lopevi", "manam", "marapi", "masaya",
  "mauna-loa", "mayon", "merapi", "michoacan-guanajuato", "misti-el", "miyakejima",
  "momotombo", "mount-cameroon", "mutnovsky", "niuafo-ou", "novarupta", "nyamulagira",
  "nyiragongo", "okataina", "orizaba-pico-de", "pacaya", "pavlof", "pelee", "pinatubo",
  "piton-de-la-fournaise", "planchon-peteroa", "poas", "popocatepetl", "purace",
  "puyehue-cordon-caulle", "rabaul", "rainier", "raung", "redoubt", "reventador",
  "reykjanes", "rincon-de-la-vieja", "ruapehu", "ruiz-nevado-del", "sabancaya",
  "san-cristobal", "san-miguel", "santa-ana", "santa-maria", "santorini", "semeru",
  "sete-cidades", "sheveluch", "shikotsu", "shishaldin", "soufriere-guadeloupe",
  "soufriere-hills", "soufriere-st-vincent", "st-helens", "stromboli", "taal", "tacana",
  "tambora", "taranaki", "taveuni", "telica", "tenerife", "tengger-caldera", "terceira",
  "tinakula", "tolbachik", "tolima-nevado-del", "tongariro", "tungurahua", "tupungatito",
  "turrialba", "ubinas", "ulawun", "vesuvius", "villarrica", "vulcano", "whakaari-white-island",
  "witori", "yellowstone", "zaozan-zaosan"
].map(slug => `/volcano/${slug}`);

// Country routes (volcanoes-in-[slug])
const countrySlugs = [
  "algeria", "antarctica", "argentina", "armenia", "australia", "cameroon", "canada", "chad",
  "chile", "china", "colombia", "costa-rica", "dominica", "dr-congo", "ecuador", "el-salvador",
  "eritrea", "ethiopia", "france", "greece", "guatemala", "honduras", "iceland", "indonesia",
  "italy", "japan", "kenya", "mexico", "new-zealand", "nicaragua", "papua-new-guinea", "peru",
  "philippines", "portugal", "russia", "saudi-arabia", "solomon-islands", "spain", "sudan",
  "tanzania", "tonga", "turkiye", "united-kingdom", "united-states", "vanuatu", "yemen"
].map(slug => `/volcanoes-in-${slug}`);

const allRoutes = [
  ...staticRoutes,
  ...specialRoutes,
  ...volcanoSlugs,
  ...countrySlugs
];

console.log(`Total routes to test: ${allRoutes.length}`);
console.log(`- Static routes: ${staticRoutes.length}`);
console.log(`- Special routes: ${specialRoutes.length}`);
console.log(`- Volcano routes: ${volcanoSlugs.length}`);
console.log(`- Country routes: ${countrySlugs.length}`);

async function testRoute(route) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${route}`;
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const contentLength = data.length;
        const textContent = data.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                                .replace(/<[^>]*>/g, ' ')
                                .replace(/\s+/g, ' ')
                                .trim();
        
        resolve({
          route,
          status: res.statusCode,
          contentLength,
          textContentLength: textContent.length,
          title: data.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || 'No title found'
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        route,
        status: 'ERROR',
        contentLength: 0,
        textContentLength: 0,
        error: err.message,
        title: 'ERROR'
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        route,
        status: 'TIMEOUT',
        contentLength: 0,
        textContentLength: 0,
        title: 'TIMEOUT'
      });
    });
  });
}

async function runAudit() {
  console.log('\nStarting comprehensive audit...\n');
  
  const results = [];
  const batchSize = 10; // Test in batches to avoid overwhelming the server
  
  for (let i = 0; i < allRoutes.length; i += batchSize) {
    const batch = allRoutes.slice(i, i + batchSize);
    console.log(`Testing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allRoutes.length/batchSize)} (routes ${i + 1}-${Math.min(i + batchSize, allRoutes.length)})`);
    
    const batchPromises = batch.map(route => testRoute(route));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Show progress for this batch
    batchResults.forEach(result => {
      const status = result.status === 200 ? '✓' : result.status === 404 ? '✗' : '!';
      const quality = result.textContentLength > 2000 ? 'LONG' : result.textContentLength > 500 ? 'MED' : 'THIN';
      console.log(`  ${status} ${result.route} (${result.status}) [${quality}: ${result.textContentLength} chars]`);
    });
    
    // Brief pause between batches
    if (i + batchSize < allRoutes.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Categorize results
  const successful = results.filter(r => r.status === 200);
  const notFound = results.filter(r => r.status === 404);
  const errors = results.filter(r => r.status === 'ERROR' || r.status === 'TIMEOUT' || (r.status !== 200 && r.status !== 404));
  
  const longContent = successful.filter(r => r.textContentLength > 2000);
  const mediumContent = successful.filter(r => r.textContentLength >= 500 && r.textContentLength <= 2000);
  const thinContent = successful.filter(r => r.textContentLength < 500);

  // Generate report
  console.log('\n=== COMPREHENSIVE SITE AUDIT REPORT ===\n');
  
  console.log('OVERVIEW:');
  console.log(`Total pages tested: ${allRoutes.length}`);
  console.log(`Successful (200): ${successful.length}`);
  console.log(`Not Found (404): ${notFound.length}`);
  console.log(`Errors/Timeouts: ${errors.length}`);
  
  console.log('\nCONTENT QUALITY BREAKDOWN:');
  console.log(`Long content (>2000 chars): ${longContent.length}`);
  console.log(`Medium content (500-2000 chars): ${mediumContent.length}`);
  console.log(`Thin content (<500 chars): ${thinContent.length}`);
  
  if (notFound.length > 0) {
    console.log('\n404 PAGES:');
    notFound.forEach(r => console.log(`  - ${r.route}`));
  }
  
  if (thinContent.length > 0) {
    console.log('\nTHIN CONTENT PAGES:');
    thinContent.forEach(r => console.log(`  - ${r.route} (${r.textContentLength} chars) - ${r.title}`));
  }
  
  if (errors.length > 0) {
    console.log('\nERRORS/TIMEOUTS:');
    errors.forEach(r => console.log(`  - ${r.route} (${r.status}) ${r.error || ''}`));
  }

  // Save detailed results to file
  fs.writeFileSync('audit_results.json', JSON.stringify(results, null, 2));
  console.log('\nDetailed results saved to audit_results.json');
}

runAudit().catch(console.error);