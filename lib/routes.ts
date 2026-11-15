import fs from 'fs';
import path from 'path';
import { getGvpByLegacySlug, getGvpByNumber, getGvpBySlug, slugify, type GvpVolcano } from './gvp';

/**
 * Single source of truth for "does this internal URL exist?".
 * Every internal link built from data goes through here, so a link is only
 * rendered when its target page is real. Server-only: reads from disk.
 */

const contentDir = path.join(process.cwd(), 'data', 'content');

interface RouteIndex {
  /** slug -> has a full written profile */
  profileSlugs: Set<string>;
  /** GVP volcano number -> profile slug */
  profileByNumber: Map<number, string>;
  countrySlugs: Set<string>;
  topicSlugs: Set<string>;
}

let index: RouteIndex | null = null;

function load(): RouteIndex {
  if (index) return index;
  const profileSlugs = new Set<string>();
  const profileByNumber = new Map<number, string>();
  const countrySlugs = new Set<string>();
  const topicSlugs = new Set<string>();

  for (const file of fs.readdirSync(contentDir)) {
    if (!file.endsWith('.json')) continue;
    const name = file.slice(0, -5);
    if (name.startsWith('volcano-')) {
      const slug = name.slice('volcano-'.length);
      profileSlugs.add(slug);
      try {
        const data = JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf8'));
        if (typeof data.volcano_id === 'number') profileByNumber.set(data.volcano_id, slug);
      } catch {
        // unreadable file: the slug is still a page, it just has no number mapping
      }
    } else if (name.startsWith('country-')) {
      countrySlugs.add(name.slice('country-'.length));
    } else if (name.startsWith('special-')) {
      topicSlugs.add(name.slice('special-'.length));
    } else if (name.startsWith('ranking-')) {
      topicSlugs.add(name.slice('ranking-'.length));
    }
  }

  index = { profileSlugs, profileByNumber, countrySlugs, topicSlugs };
  return index;
}

export const STATIC_PATHS = ['/', '/map', '/volcanoes', '/countries', '/latest-eruptions', '/about', '/contact', '/privacy', '/terms'];

export function getProfileSlugs(): Set<string> {
  return load().profileSlugs;
}

export function getCountrySlugs(): Set<string> {
  return load().countrySlugs;
}

export function getTopicSlugs(): Set<string> {
  return load().topicSlugs;
}

export function hasProfile(slug: string): boolean {
  return load().profileSlugs.has(slug);
}

/** Profile slug for a GVP volcano number, when a written profile exists. */
export function profileSlugForNumber(volcanoNumber: number | string | null | undefined): string | null {
  if (volcanoNumber === null || volcanoNumber === undefined || volcanoNumber === '') return null;
  return load().profileByNumber.get(Number(volcanoNumber)) ?? null;
}

/**
 * Link for a volcano given a slug or a name. Prefers the written profile,
 * falls back to the basic-data page, returns null when neither exists.
 */
export function volcanoHref(slugOrName: string | null | undefined): string | null {
  if (!slugOrName) return null;
  const { profileSlugs, profileByNumber } = load();
  const raw = String(slugOrName).trim();
  if (profileSlugs.has(raw)) return `/volcano/${raw}`;
  const slug = slugify(raw);
  if (!slug) return null;
  if (profileSlugs.has(slug)) return `/volcano/${slug}`;

  const gvp = getGvpBySlug(slug) ?? getGvpByLegacySlug(raw.toLowerCase()) ?? getGvpByLegacySlug(slug);
  if (!gvp) return null;
  const profile = profileByNumber.get(gvp.Volcano_Number);
  return `/volcano/${profile ?? basicPageSlug(gvp)}`;
}

/**
 * URL slug of the basic-data page for a database volcano without a written profile.
 * If its plain slug is already used by another volcano's profile, the volcano
 * number is appended so the two never share a URL.
 */
export function basicPageSlug(gvp: GvpVolcano): string {
  const { profileSlugs, profileByNumber } = load();
  if (profileSlugs.has(gvp.slug) && profileByNumber.get(gvp.Volcano_Number) !== gvp.slug) {
    return `${slugify(gvp.Volcano_Name) || 'volcano'}-${gvp.Volcano_Number}`;
  }
  return gvp.slug;
}

/** Link for a volcano by its GVP number. */
export function volcanoHrefByNumber(volcanoNumber: number | string | null | undefined): string | null {
  const profile = profileSlugForNumber(volcanoNumber);
  if (profile) return `/volcano/${profile}`;
  const gvp = getGvpByNumber(volcanoNumber);
  return gvp ? `/volcano/${basicPageSlug(gvp)}` : null;
}

const COUNTRY_ALIASES: Record<string, string> = {
  turkey: 'turkiye',
  usa: 'united-states',
  'united-states-of-america': 'united-states',
  'the-united-states': 'united-states',
  'democratic-republic-of-the-congo': 'dr-congo',
  'democratic-republic-of-congo': 'dr-congo',
};

/** Link for a country page given a slug or a name, or null when we have no page for it. */
export function countryHref(slugOrName: string | null | undefined): string | null {
  if (!slugOrName) return null;
  const { countrySlugs } = load();
  // "France (Martinique)" -> "France"; "the United States" -> "United States"
  const cleaned = String(slugOrName).replace(/\s*\(.*?\)\s*/g, ' ').replace(/^the\s+/i, '').trim();
  let slug = slugify(cleaned);
  slug = COUNTRY_ALIASES[slug] ?? slug;
  return countrySlugs.has(slug) ? `/volcanoes-in-${slug}` : null;
}

/** Resolve any internal path to a real URL, or null when nothing lives there. */
export function resolveInternalPath(href: string): string | null {
  const clean = href.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/';
  if (STATIC_PATHS.includes(clean)) return clean;
  if (clean.startsWith('/volcano/')) return volcanoHref(decodeURIComponent(clean.slice('/volcano/'.length)));
  if (clean.startsWith('/volcanoes-in-')) return countryHref(decodeURIComponent(clean.slice('/volcanoes-in-'.length)));
  const single = clean.slice(1);
  if (!single.includes('/') && load().topicSlugs.has(single)) return clean;
  return null;
}

/**
 * Rewrites internal anchors in an HTML string: fixes the href when the target
 * moved, and turns the anchor into plain text when the target does not exist.
 */
export function fixInternalLinks(html: string): string {
  if (!html || !html.includes('<a')) return html;
  return html.replace(/<a\b([^>]*?)href="(\/[^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, (_match, before, href, after, text) => {
    const resolved = resolveInternalPath(href);
    if (!resolved) return text;
    return `<a${before}href="${resolved}"${after}>${text}</a>`;
  });
}

/** "[[volcano:erebus|Mount Erebus]]" -> { text: "Mount Erebus", target: "erebus" } */
export function parseWikiLink(value: string): { text: string; target: string | null } {
  const match = /^\s*\[\[(?:\w+:)?([^|\]]+)(?:\|([^\]]+))?\]\]\s*$/.exec(value);
  if (!match) return { text: value, target: null };
  return { text: (match[2] ?? match[1]).trim(), target: match[1].trim() };
}
