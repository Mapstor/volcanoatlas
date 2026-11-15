import type { Metadata } from 'next';

export const SITE_URL = 'https://www.volcanosatlas.com';
export const SITE_NAME = 'VolcanoAtlas';
export const OG_IMAGE = '/og-image.jpg';

/** Version of the Smithsonian export bundled in volcanoes.json (see its timeStamp field). */
export const GVP_EXPORT_DATE = '11 Feb 2026';
export const GVP_HOME = 'https://volcano.si.edu/';

export function gvpVolcanoUrl(volcanoNumber: number | string) {
  return `https://volcano.si.edu/volcano.cfm?vn=${volcanoNumber}`;
}

interface PageMetaOptions {
  title: string;
  description: string;
  /** Path starting with "/". Becomes the canonical URL and og:url. */
  path: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

/**
 * One place that builds per-page metadata, so every page gets its own canonical,
 * Open Graph and Twitter tags. Next.js replaces (does not deep-merge) nested
 * metadata objects, so everything a page needs is set here.
 */
export function pageMeta({ title, description, path, type = 'website', noindex = false }: PageMetaOptions): Metadata {
  const withBrand = `${title} | ${SITE_NAME}`;
  // Keep the brand suffix only while the whole title stays short enough to show in results.
  const finalTitle = title.includes(SITE_NAME) || withBrand.length > 60 ? title : withBrand;

  return {
    title: { absolute: finalTitle },
    description,
    alternates: { canonical: path },
    // Only set robots when overriding: an explicit undefined would wipe the site default.
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      locale: 'en_US',
      siteName: SITE_NAME,
      url: path,
      title,
      description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
