import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.volcanosatlas.com';
  
  // Read the sitemap data
  const sitemapData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'volcanoatlas-sitemap.json'), 'utf8')
  );
  
  // Convert to Next.js sitemap format
  return sitemapData.map((item: any) => ({
    url: `${baseUrl}${item.url}`,
    lastModified: new Date(),
    changeFrequency: item.changefreq || 'monthly',
    priority: parseFloat(item.priority || '0.5'),
  }));
}