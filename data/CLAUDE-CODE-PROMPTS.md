# VolcanoAtlas — Claude Code Build Prompts

Run these prompts sequentially in Claude Code terminal. Each builds on the previous.

## Pre-requisite
Place the `volcanoatlas-package/` folder at `/Users/markovisic/Desktop/vulcanos/volcanoatlas-package/`

---

## PROMPT 1: Project Scaffold

```
Create a Next.js 14 app (App Router) for VolcanoAtlas.com — a comprehensive volcano encyclopedia with 204 pages of pre-written JSON content.

Project location: /Users/markovisic/Desktop/vulcanos/volcanoatlas
Data location: /Users/markovisic/Desktop/vulcanos/volcanoatlas-package/

Setup:
- Next.js 14 with App Router, TypeScript, Tailwind CSS
- Copy the entire volcanoatlas-package/ into the project as /data/
- Dark theme (volcano-inspired: dark grays #0f0f0f/#1a1a1a, amber/orange #f59e0b accents, white text)
- Font: Inter for body, optional serif for headings
- Mobile-first responsive design
- Static Site Generation (SSG) — all pages generated at build time from JSON

Create the folder structure:
/app
  /page.tsx (homepage)
  /map/page.tsx
  /volcano/[slug]/page.tsx
  /volcanoes-in-[slug]/page.tsx  
  /[slug]/page.tsx (special + ranking pages)
/components
/data (copy from volcanoatlas-package)
/lib (data loading utilities)
/public

Create /lib/data.ts with functions:
- getAllVolcanoes() — reads all volcano JSONs
- getVolcanoBySlug(slug) — single volcano
- getAllCountries() — all country JSONs
- getCountryBySlug(slug) — single country
- getSpecialPage(slug) — special/ranking pages
- getNavData() — reads volcanoatlas-nav.json
- getSeoData(url) — reads volcanoatlas-seo.json

Install dependencies: leaflet, react-leaflet, recharts, next-sitemap

Don't build any page templates yet — just the scaffold, data layer, and layout with header/footer.
```

---

## PROMPT 2: Layout, Header, Footer

```
Build the global layout, header, and footer for VolcanoAtlas.

Read /data/volcanoatlas-nav.json for navigation data.

Header:
- Logo: "VolcanoAtlas" in amber/orange with a simple volcano icon (SVG)
- Desktop: horizontal nav with dropdowns for "Volcanoes" (featured list), "Countries" (alphabetical), "Explore" (special pages + rankings)
- Mobile: hamburger menu with slide-out drawer
- Sticky on scroll with subtle backdrop blur

Footer:
- 4-column grid: Featured Volcanoes, Popular Countries, Explore, About
- "About" column: brief description + links to Smithsonian GVP
- Copyright line
- Dark background slightly lighter than body

Use Tailwind throughout. Dark theme colors:
- bg-[#0f0f0f] body
- bg-[#1a1a1a] cards/sections
- bg-[#252525] hover states
- text-white primary, text-gray-400 secondary
- amber-500 (#f59e0b) accent/links
- border-gray-800 borders
```

---

## PROMPT 3: Homepage

```
Build the homepage at /app/page.tsx.

Read /data/volcanoatlas-homepage.json for map markers and stats.
Read /data/volcanoatlas-nav.json for featured volcanoes and countries.

Sections:
1. Hero: Large heading "Every Volcano on Earth" with subtext showing total counts. Full-width interactive Leaflet map showing all 150 volcano markers (use dynamic import with ssr:false for Leaflet). Clicking a marker links to the volcano page. Use a dark map tile (CartoDB dark_all or similar).

2. Featured Volcanoes: Grid of 8-10 cards showing top volcanoes with name, country, type, elevation. Link to profile pages. Use amber accent on hover.

3. Browse by Country: Grid of country cards showing country name + volcano count. Link to country pages.

4. Latest special pages: Cards linking to Ring of Fire, Supervolcanoes, VEI, etc.

5. Brief "About VolcanoAtlas" section for SEO — 2-3 paragraphs about what the site covers.

Make the map the visual centerpiece. Use Leaflet with a dark tile layer.
```

---

## PROMPT 4: Volcano Profile Page Template

```
Build the volcano profile page at /app/volcano/[slug]/page.tsx.

This is the most important template — 150 pages use it. Read the JSON structure from any file in /data/content/volcano-*.json to understand the schema.

Generate static params from all volcano JSONs. Each page needs:

1. Hero section: Volcano name, subtitle (country + type), key facts sidebar (elevation, type, VEI max, last eruption, status, coordinates)

2. Quick Answer Box: Styled card at top with the quick_answer data — "What is [volcano]?", current status, famous for, danger level. Light amber border for visual distinction.

3. Table of Contents: Fixed sidebar on desktop (scrollspy), collapsible on mobile. Links to each section.

4. Sections: Render each section from the JSON sections object. Each section gets:
   - H2 heading with anchor ID
   - Prose content (HTML already resolved in the processed JSON)
   - Notable eruptions section renders subsections as H3s
   
5. Comparison Tables: Render comparison_tables array as styled responsive tables with dark rows, amber header.

6. Eruption Timeline: Render eruption_timeline as a visual vertical timeline component (year, VEI badge, description). Use Recharts for a small VEI-over-time chart.

7. Facts sidebar: Numbered list of facts from the facts array. Styled as a card.

8. FAQs: Accordion component with schema.org FAQ structured data. Each Q&A expandable.

9. Schema.org: Inject JSON-LD from schema_data field into the page head.

10. SEO: Read meta title/description from /data/volcanoatlas-seo.json. Generate proper meta tags and Open Graph.

Use a 2-column layout on desktop: main content (left, ~70%) + sidebar (right, ~30% — key facts, facts, TOC). Single column on mobile with TOC at top.
```

---

## PROMPT 5: Country Page Template

```
Build the country page at /app/volcanoes-in-[slug]/page.tsx.

Read schema from /data/content/country-*.json files.

Generate static params from all country JSONs (extract slug after "country-" prefix).

Page structure:
1. Hero: "Volcanoes in [Country]" with volcano count badge
2. Quick stats bar: total volcanoes, most active, highest, most recent eruption
3. Sections: Render all sections from JSON (overview, why_volcanoes/tectonic, major_volcanoes, eruption_history, hazards, volcanic_zones, culture_economy, visiting)
4. Volcano Table: Full sortable/filterable table from volcano_table data. Columns: Name (linked to profile if page exists), Elevation, Type, Last Eruption, VEI Max. Use client-side sorting.
5. FAQs: Same accordion component as volcano pages
6. Facts: Numbered list
7. SEO + Schema.org

Use the same dark theme and layout patterns. Link volcano names in the table to their profile pages where they exist.
```

---

## PROMPT 6: Special & Ranking Pages

```
Build the catch-all page at /app/[slug]/page.tsx for special and ranking pages.

This handles: ring-of-fire, supervolcanoes, types-of-volcanoes, volcanic-explosivity-index, deadliest-eruptions, tallest-volcanoes, most-active-volcanoes, active-volcanoes.

Read from /data/content/special-*.json and /data/content/ranking-*.json.

Generate static params for these 8 slugs.

Ranking pages should display their ranked tables prominently with position numbers.
Special pages render their sections as prose with comparison tables and FAQs.
Same dark theme, same FAQ accordion, same schema.org injection.
```

---

## PROMPT 7: Interactive Map Page

```
Build the full-screen map page at /app/map/page.tsx.

Use Leaflet with dark tiles (CartoDB dark_all). Load all volcano markers from /data/volcanoatlas-homepage.json.

Features:
- Full viewport height map
- Clustered markers (use react-leaflet-cluster or markercluster)
- Popup on click: volcano name, country, type, elevation, last eruption, link to profile
- Filter panel (slide-out on mobile, sidebar on desktop):
  - Filter by country (dropdown)
  - Filter by type (checkboxes: stratovolcano, shield, caldera, etc.)
  - Filter by last eruption (slider: year range)
- Color-coded markers by type or recency
- Search box to find specific volcano
```

---

## PROMPT 8: SEO, Sitemap, Performance

```
Finalize SEO and performance for VolcanoAtlas:

1. next-sitemap config: Generate sitemap.xml from /data/volcanoatlas-sitemap.json. Base URL: https://volcanoatlas.com

2. robots.txt: Allow all, reference sitemap

3. Canonical tags on all pages

4. Open Graph meta tags using SEO data

5. FAQ schema.org structured data on all pages with FAQs

6. Image optimization: Use next/image where applicable

7. Performance:
   - Ensure all pages are statically generated (check with `next build`)
   - Lazy load the map components
   - Code split the Leaflet bundle
   - Add proper loading states

8. Analytics: Add placeholder for Google Analytics / Raptive ads script tags in layout

9. Run `next build` and report any errors. Fix all build errors until clean.
```

---

## PROMPT 9: Final Polish

```
Polish and finalize VolcanoAtlas:

1. 404 page: Custom dark-themed 404 with search suggestion and popular links
2. Loading states: Skeleton loaders for dynamic content
3. Breadcrumbs: Home > Country > Volcano (on volcano pages)
4. "Related Volcanoes" section at bottom of volcano pages — show 4 cards of volcanoes from same country
5. Back to top button
6. Print styles: Clean print layout for volcano profiles
7. Accessibility: Proper ARIA labels, keyboard navigation, focus states
8. Test all routes work — spot check 10 volcano pages, 5 country pages, all special pages
9. Run lighthouse audit and fix any issues below 90

Deploy prep: Output the Vercel deployment command.
```
