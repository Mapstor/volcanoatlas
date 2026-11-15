# DEVLOG — volcanosatlas.com
> Handoff file. Read §0–§5 and the last 10 entries of §6 before any work. Rules: devlog skill (owner's Claude account; no copy in this repo).

## §0 Resume here
_last update: 2026-11-15 · VOL-002_
- Phase: audit finished; fix waves running. Wave 1 of 7 done.
- Last confirmed: VOL-002 WAVE1 — plumbing fixed, made-up content removed — done (472c7f5); merge and production check are recorded in the next §6 entry
- In flight (handed, NOT confirmed): none
- Next action: Wave 2 — fact-check the profile for Stromboli against its Smithsonian record, run the prose pass, render its article sections; then the next profiles by search traffic (VOL-003)
- Waiting on owner:
  - Author identity for the site: name as it should appear, credentials, profile link (Wave 4)
  - Decision: ask the Smithsonian for written permission for commercial use (email draft available on request)
  - Confirm info@volcanosatlas.com reaches an inbox
  - Vercel dashboard: apex → www redirect is 307, should be 308; unused `UNSPLASH_ACCESS_KEY` variable can be deleted
  - Phone test of the live site; pick a design direction (Wave 6)
- Open questions:
  - Owner name and machine, author byline (`?` in §1)
  - Keep the "How the site is made" paragraph on /about as worded? (owner may veto)
  - Cookie consent: Google Analytics and Microsoft Clarity run without a consent mechanism
  - Shared-border volcanoes: one counting rule for all country pages (Wave 5)

## §1 Site card
- Domain: www.volcanosatlas.com · status: live · Raptive: not applied; no ad code on the site
- Owner (pushes, runs account steps): GitHub `Mapstor` · name: ? · machine: ?
- Author (byline · credentials · sameAs): ? — no byline on the site yet
- Repo origin: https://github.com/Mapstor/volcanoatlas (public) · branch: main
- Project folder: ? · box project: ? · preview port: none recorded (no .devcontainer)
- Stack: Next.js 16.1.6 App Router, React 19, Tailwind 3, TypeScript, Leaflet / react-leaflet, recharts · Node 22 in the audit session
- Commands: dev `npm run dev` · build `npm run build` · lint `npm run lint` (66 old findings, not a gate) · no test runner
- Deploy: Vercel project `volcanoatlas`, production branch main, builds on push; preview builds for branches
- Analytics: Google Analytics 4 and Microsoft Clarity tags in `app/layout.tsx` · Search Console and Bing Webmaster verified (files in `public/`)
- Data sources: `volcanoes.json` = Smithsonian Global Volcanism Program, Volcanoes of the World v. 5.3.4, exported 2026-02-11 (1,222 records) · /latest-eruptions reads the Smithsonian weekly RSS and the USGS elevated-volcanoes API (`lib/volcanoAPIs.ts`) · no registry file yet
- Key paths: pages `app/` · templates `app/volcano/[slug]/`, `app/[slug]/` · content `data/content/*.json` (150 volcano, 46 country, 4 special, 4 ranking) · link and route logic `lib/routes.ts` · Smithsonian access `lib/gvp.ts` · metadata `lib/site.ts` · checks `scripts/check-build.py`, `scripts/check-render.py`
- Skills in repo: none
- Design system: `DESIGN-SPEC.md` (early spec, not a current source of truth); no DESIGN.md / PRODUCT.md
- Other plans / ledgers: `docs/audit-2026-11-15.md` (current audit) · `SEO-AUDIT-REPORT.md` (2026-04-29, its "85/100" verdict does not hold) · `docs/roadmap-notes.md` · `data/CLAUDE-CODE-PROMPTS.md`
- Prompt code: VOL

## §2 Decisions in force
- D-01 · 2026-11-15 · Volcano pages without a written profile are `noindex, follow` and stay out of the sitemap — about 1,070 near-identical pages built on a quoted Smithsonian summary are thin-content risk for the whole domain; they carried a negligible share of search clicks (owner's exports, 2026-11-15). Reverse per page once it has content of its own.
- D-02 · 2026-11-15 · Maps use OpenStreetMap standard tiles — the CARTO basemap serves an "API key required" image to everyone. Stopgap: OSM's tile policy does not suit heavy traffic; final tile source is chosen in the design wave.
- D-03 · 2026-11-15 · No alert status, risk rating, ranking or timeline is computed in code — the old ones came from the last-eruption year, a hardcoded country list or `Math.random()`. Maps and lists group by year of last known eruption (since 2000 / 1900–1999 / before 1900 or undated).
- D-04 · 2026-11-15 · Structured data is limited to WebSite, Organization, BreadcrumbList, FAQPage and Place — the removed Article, HowTo, Dataset and ScholarlyArticle markup carried invented authors, dates, awards and licences. Article and Dataset return with a real author, real dates and a cleared data licence.
- D-05 · 2026-11-15 · Canonical and Open Graph are set per page by `pageMeta()`; never in root metadata — a root canonical is inherited by every page (that was the bug).
- D-06 · 2026-11-15 · Internal links go through `lib/routes.ts`; unresolvable links render as plain text — content files reference hundreds of pages that do not exist.
- D-07 · 2026-11-15 · The article `sections` in the profile files stay unrendered until a profile passes fact-check and prose pass — they are unreviewed AI drafts full of unverified numbers.
- D-08 · 2026-11-15 · Smithsonian summaries appear only as attributed quotations on noindex pages — the program's terms allow non-commercial use and require written permission for commercial use; settle before ads.
- D-09 · 2026-11-15 · No stock photos — the removed Unsplash galleries showed unrelated subjects. Photos need a licensed, credited source.
- D-10 · 2026-11-15 · Titles and H1 of the homepage, /map and /countries were left as they were — no ranking churn while plumbing changes land. Titles are a Wave 5 task.
- D-11 · 2026-11-15 · Dates on legal pages are fixed strings, changed only with the text — a date that refreshes itself is a false "updated" claim.
- D-12 · 2026-11-15 · /latest-eruptions prints the report period and publication date from the feed and shows a notice when the feed is older than 10 days — the Smithsonian feed stood at 2026-10-15 on 2026-11-15.
- D-13 · 2026-11-15 · Search and analytics figures stay out of this public repo.

## §3 Rejected — don't re-propose
- 2026-11-15 · Rendering the unreviewed article sections now for a quick content gain — publishes about 350,000 words of unverified text (D-07).
- 2026-11-15 · Keeping database-only pages indexable — see D-01.
- 2026-11-15 · Stating which weekday the Smithsonian weekly report appears — the report page and the RSS feed disagree; the page shows the feed's own dates.
- 2026-11-15 · A key-facts box or Smithsonian link on the Yellowstone profile — Yellowstone is not in the Holocene export, so those facts have no record to point to.

## §4 Gotchas & hard rules
- `npx tsc --noEmit` fails only in `lib/textUtils.test.ts` (no test runner installed) — ignore that file; `next build` passes.
- `next/script` with JSON-LD never reaches server HTML — use `components/JsonLd.tsx`.
- A page that returns `robots: undefined` wipes the root robots setting — spread it in only when needed (`pageMeta` does).
- Country tables in `data/content/country-*.json` come in nine shapes — always read them through `lib/countryTable.ts`.
- Smithsonian names repeat (Unnamed ×9, Sumbing, Flores, San Cristobal, Azul Cerro) — the second gets its record number in the slug. `/volcano/azul-cerro` is the Chile profile; the Ecuador record is `/volcano/azul-cerro-353060`.
- `volcano.si.edu` answers plain curl with 403 for HTML; the RSS feed works. Check pages in a browser.
- Leaflet sits on high z-index values: header is `z-[1100]`, search dialog `z-[1200]`, map wrappers `relative z-0`.
- Don't close menus with a state-setting effect (lint rule `react-hooks/set-state-in-effect`); close on click.
- Before a pull request: `rm -rf .next && npx next build`, `npx next start -p <free port>`, then `python3 scripts/check-build.py http://localhost:<port> /tmp/crawl.json` (every line must show zero problems) and `python3 scripts/check-render.py http://localhost:<port> . /tmp/shots`.
- Two country tables (Armenia, DR Congo) list shared-border volcanoes as extra unranked rows; row count there is higher than the headline count on purpose.

## §5 Backlog (priority order)
- [P0] Wave 2 — profiles: fact-check against the Smithsonian eruption record, prose pass, render `sections`, timelines, comparison tables. Order by search traffic. Fix known mismatches first: Jan Mayen elevation, Kavachi and Fuji last eruption, 19 profiles with last-eruption year forced to 2026, "2025 (ongoing…)" strings.
- [P0] Wave 2 — facts and FAQ answers already on profile and country pages carry unverified figures (death tolls, populations, visitor numbers): verify or remove.
- [P1] Wave 3 — database-only pages: rebuild as data pages with unique value or keep noindex; Smithsonian permission.
- [P1] Wave 4 — trust frame: named author, Person markup, methodology and sources page, final "how this site is made" text, consent mechanism decision.
- [P1] Wave 5 — `/countries` as a data page with one counting rule; fact-check topic and ranking pages (NOAA NCEI, USGS); 45 titles over 60 characters; `/map` with all 1,222 records; status column of country tables needs a sourced definition.
- [P2] Wave 6 — design: three looks on a real page, owner picks; licensed imagery; final map tiles; data-sources registry.
- [P2] Wave 7 — remaining prose pass (median 11.1 tells per 1,000 words), Raptive readiness pass, logged human review of the top 30 pages, freeze for three months.
- [P2] Clean-up: 66 lint findings; old helper scripts in `scripts/*.js`; `audit-pages.js`, `audit_results.json`, `audit_script.js`, `volcanoatlas-homepage-reference.html` at the repo root; unused `next-sitemap` dependency.

## §6 Log (append-only, newest at bottom)
### 2026-11-15 · VOL-001 AUDIT · chat · done
- What: full site audit (production = main at e8bca73) and devlog bootstrap from repo evidence.
- Files: `docs/audit-2026-11-15.md`, `DEVLOG.md`, `CLAUDE.md`
- Verified: 1,289 production addresses fetched (399 → 404, 22 → 500); 380 pages parsed, all with the homepage canonical; 150 profiles compared with `volcanoes.json` (148 of 149 match on elevation, type, coordinates); render checks in headless Chrome at 1440 and 390 px.
- Commit: 472c7f5 (audit doc, CLAUDE.md) + this commit (pushed: work branch only)
- Notes: scores before fixes — sourcing 3, prose 2, design 3, Raptive 1 (of 10). Pages finished on all four: 0 of 213.

### 2026-11-15 · VOL-002 WAVE1 · chat · done
- What: per-page canonicals and Open Graph; server-rendered structured data; link resolver; database-only pages (noindex); made-up boxes, schema and stock photos removed; working maps and phone menu; normalized country tables; real counts; sitemap from routes; 404 page; icons; honest About / Contact / Privacy / Terms; /latest-eruptions dated from its feed.
- Files: `app/**`, `components/**`, `lib/{site,gvp,routes,countryTable,data}.ts`, `public/` icons, `scripts/check-*.py`; 18 dead files deleted
- Verified: `npx next build` exit 0 (218 static pages); `scripts/check-build.py` on the local build: 1,212 pages all 200, 0 broken links, 0 redirecting links, canonical = own URL on all, 213 indexable = 213 in sitemap, 999 noindex none in sitemap, one h1 each, no duplicate titles, no invalid JSON-LD, no forbidden strings; every address that answered 200 in production still does (870 checked), 153 former 404/500 now work; `scripts/check-render.py`: map markers = published count on 46 of 46 country pages, no blank rows or raw markup, 18 page types at 390 px with zero sideways scroll, map tiles loaded, menu opens with 8 links.
- Unverified: hover and keyboard behaviour of the desktop dropdowns; real-phone test (owner).
- Commit: 472c7f5 (pushed: work branch only)
- Notes: scores after — sourcing 4.5, prose 2, design 4, Raptive 3.5. `tsc` clean outside the old test file.

## §7 History & archive
- 2026-02 · Create Next App scaffold (02-13); first site commit with 150 profiles and 46 country pages (02-26); Vercel config; domain changed from volcanoatlas.com to volcanosatlas.com (02-27); favicon and OG image; analytics, Clarity and Bing verification; sitemap and robots (02-28)
- 2026-03 · ads.txt added (03-16)
- 2026-04 · "A1–A5" rendering fixes: wiki links, bold markup, title suffixes, recent-activity dates, key-facts accessors (04-20 to 04-22); schema components and `SEO-AUDIT-REPORT.md` (04-29)
- 2026-06 · root canonical moved from the vercel.app address to the www homepage — still one canonical for every page; OG image replaced (06-08)
