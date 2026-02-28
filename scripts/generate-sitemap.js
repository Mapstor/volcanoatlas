const fs = require('fs');
const path = require('path');

// Read the JSON sitemap data
const jsonData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'volcanoatlas-sitemap.json'), 'utf8')
);

// Base URL
const baseUrl = 'https://www.volcanosatlas.com';

// Generate XML sitemap
function generateSitemap(data) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  data.forEach(item => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${item.url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq || 'monthly'}</changefreq>\n`;
    xml += `    <priority>${item.priority || '0.5'}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate the sitemap
const sitemap = generateSitemap(jsonData);

// Write to public directory
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap);

console.log(`Sitemap generated successfully!`);
console.log(`Total URLs: ${jsonData.length}`);
console.log(`Output: public/sitemap.xml`);

// Also create a robots.txt if it doesn't exist
const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  const robotsContent = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
  
  fs.writeFileSync(robotsPath, robotsContent);
  console.log('Created robots.txt');
}