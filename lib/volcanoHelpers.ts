import fs from 'fs';
import path from 'path';

// Cache the list of existing volcano content files
let existingVolcanoSlugsCache: Set<string> | null = null;

export function getExistingVolcanoSlugs(): Set<string> {
  if (existingVolcanoSlugsCache) {
    return existingVolcanoSlugsCache;
  }

  const contentDir = path.join(process.cwd(), 'data', 'content');
  const files = fs.readdirSync(contentDir);
  const volcanoSlugs = files
    .filter(file => file.startsWith('volcano-') && file.endsWith('.json'))
    .map(file => file.replace('volcano-', '').replace('.json', ''));
  
  existingVolcanoSlugsCache = new Set(volcanoSlugs);
  return existingVolcanoSlugsCache;
}

export function hasVolcanoContent(slug: string): boolean {
  if (!slug || slug === '') return false;
  const existingSlugs = getExistingVolcanoSlugs();
  return existingSlugs.has(slug);
}