import { MetadataRoute } from 'next';
import { getCountrySlugs, getProfileSlugs, getTopicSlugs } from '@/lib/routes';
import { SITE_URL } from '@/lib/site';

/**
 * Built from the pages that actually exist, so it cannot drift from the site.
 * Database-only volcano pages are noindex and are left out on purpose.
 * No lastModified: we have no real per-page change dates yet, and a fake
 * "changed today" on every URL is worse than none.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number, changeFrequency: 'hourly' | 'weekly' | 'monthly' | 'yearly') =>
    entries.push({ url: `${SITE_URL}${path}`, changeFrequency, priority });

  add('/', 1, 'weekly');
  add('/latest-eruptions', 0.9, 'hourly');
  add('/map', 0.9, 'monthly');
  add('/volcanoes', 0.9, 'monthly');
  add('/countries', 0.9, 'monthly');

  for (const slug of [...getTopicSlugs()].sort()) add(`/${slug}`, 0.9, 'monthly');
  for (const slug of [...getCountrySlugs()].sort()) add(`/volcanoes-in-${slug}`, 0.8, 'monthly');
  for (const slug of [...getProfileSlugs()].sort()) add(`/volcano/${slug}`, 0.8, 'monthly');

  add('/about', 0.3, 'yearly');
  add('/contact', 0.3, 'yearly');
  add('/privacy', 0.2, 'yearly');
  add('/terms', 0.2, 'yearly');

  return entries;
}
