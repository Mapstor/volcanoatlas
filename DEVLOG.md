# DEVLOG — volcanosatlas.com
> Handoff file. Read §0–§5 and the last 10 entries of §6 before any work. Rules: devlog skill (owner's Claude account; no copy in this repo).

## §0 Resume here
_last update: 2026-11-17 · VOL-004_
- Step: one page — done and live. Look picked 2026-11-16 (A "the record strip" with the animated cut-open volcano from B); the owner saw the Stromboli page on 2026-11-17 ("look good", map moved up at his word). Next step: ten pages. Canvas: https://claude.ai/artifact/Ju8LCNp1RwWPEcb1nscaAf
- Phase: page-by-page rebuild until every page passes the four scores (sourcing, prose, design, Raptive). Pages finished: 1 of 213 (Stromboli).
- Last confirmed: VOL-004 RECORDPAGE — Stromboli rebuilt in the picked look, reviewed by the owner — live (merge 8c55406, see §6)
- In flight (handed, NOT confirmed): none
- Next action: VOL-005, the ten-page step: (1) write down the scaled-content pre-flight (six questions); (2) refresh `volcanoes.json` and the old profile headers to v. 5.4.0; (3) rebuild the next ten profiles in tier order as record pages, each with its observatory page read, and show them to the owner on a preview before they go live. A volcano that is not erupting needs its own main number and strip.
- Waiting on owner: none
- Open questions:
  - Contact address: /contact names info@volcanosatlas.com, and the owner runs no mailbox on his domains. Settle in the trust-frame step (forwarder or form).
  - Keep the "How the site is made" paragraph on /about as worded? (owner may veto)
  - Cookie consent: Google Analytics and Microsoft Clarity run without a consent mechanism
  - Shared-border volcanoes: one counting rule for all country pages
  - No keyword-planner export exists for this site; section order uses the site's own search queries

## §1 Site card
- Domain: www.volcanosatlas.com · status: live · Raptive: not applied; no ad code on the site
- Owner (pushes, runs account steps): Marko Visic · GitHub `Mapstor` · machine: ?
- Author (byline · credentials · sameAs): Marko Visic · BSc Physics (Faculty of Mathematics and Physics, University of Ljubljana), MPharm (Faculty of Pharmacy, University of Ljubljana) · https://www.linkedin.com/in/marko-visic/ — on volcano pages show the physics degree; all credentials on /about. No byline is live yet.
- Repo origin: https://github.com/Mapstor/volcanoatlas (public) · branch: main
- Project folder: ? · box project: ? · preview port: none recorded (no .devcontainer)
- Stack: Next.js 16.1.6 App Router, React 19, Tailwind 3, TypeScript, Leaflet / react-leaflet, recharts · Node 22 in the audit session
- Commands: dev `npm run dev` · build `npm run build` · lint `npm run lint` (66 old findings, not a gate) · no test runner
- Deploy: Vercel project `volcanoatlas`, production branch main, builds on push; preview builds for branches
- Analytics: Google Analytics 4 and Microsoft Clarity tags in `app/layout.tsx` · Search Console and Bing Webmaster verified (files in `public/`)
- Data sources: rebuilt pages read `data/sources/*.json` = Smithsonian Volcanoes of the World v. 5.4.0 (volcano list, eruptions) and NOAA significant events, retrieved 2026-11-16 (refresh: `scripts/fetch-sources.py`, then `scripts/build-data.py`) · old pages still read `volcanoes.json` = v. 5.3.4, exported 2026-02-11 (1,222 records) · /latest-eruptions reads the Smithsonian weekly RSS and the USGS elevated-volcanoes API (`lib/volcanoAPIs.ts`) · registry: `research/data-sources.csv` (7 verified sources; re-download with `scripts/fetch-sources.py`)
- Key paths: pages `app/` · templates `app/volcano/[slug]/`, `app/[slug]/` · rebuilt profiles: text `data/profiles/<slug>.json`, page `app/volcano/[slug]/RecordPage.tsx` + `record.css`, numbers `lib/eruptions.ts` + `lib/recordProfile.ts`, drawings `components/record/figures.tsx`, weekly report `lib/weekly.ts`, fonts `public/fonts/` · content `data/content/*.json` (150 volcano, 46 country, 4 special, 4 ranking) · link and route logic `lib/routes.ts` · Smithsonian access `lib/gvp.ts` · metadata `lib/site.ts` · checks `scripts/check-build.py`, `scripts/check-render.py`
- Skills in repo: none
- Design system: `DESIGN.md` (the look, from the owner's pick of 2026-11-16) and `PRODUCT.md` (what a page must do). `DESIGN-SPEC.md` is an early draft and not in force.
- Other plans / ledgers: `research/page-map.csv` (every page, its source and tier) · `research/pilots/stromboli.md` (verified copy of the pilot page) · `docs/audit-2026-11-15.md` (current audit) · `SEO-AUDIT-REPORT.md` (2026-04-29, its "85/100" verdict does not hold) · `docs/roadmap-notes.md` · `data/CLAUDE-CODE-PROMPTS.md`
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
- D-14 · 2026-11-15 · A profile is rebuilt from verified sources only: the Smithsonian's record and eruption list, NOAA's significant-event records, the national observatory's own page, and US-government definitions. The old AI text (sections, facts, FAQ answers) is replaced page by page, never patched — its numbers cannot be traced. Replaces the "fact-check, then render the sections" plan; D-07 still holds.
- D-15 · 2026-11-15 · Pages are rebuilt in the tier order of `research/page-map.csv` (tiers come from the owner's search exports). A page counts as finished only when all four scores pass; progress is reported as pages finished out of 213.
- D-16 · 2026-11-15 · A page's section order and its questions follow the searches that already reach it — the owner chooses by search traffic, and no keyword-planner export exists for this site.
- D-17 · 2026-11-15 · A calculated number is published only with its calculation printed on the same page.
- D-18 · 2026-11-16 (replaces the 2026-11-15 wording) · The Smithsonian's data stays the site's main source. Its terms ask for written permission before commercial use; the owner decided not to request it, so ads on these pages are his accepted risk. Use is kept narrow: facts and numbers in the site's own words with a link to the record, no copied report text on rebuilt pages, no Smithsonian photos.
- D-19 · 2026-11-16 · Volcano profiles use look A "the record strip" with the animated cut-open volcano from B — the owner's pick from three looks. Rules in `DESIGN.md`; it replaces every older design brief.
- D-20 · 2026-11-16 · A rebuilt profile is a text file with {tokens} (`data/profiles/<slug>.json`) filled from `data/sources/`; an unknown token stops the build — no figure can be typed by hand, typed twice or left blank.
- D-21 · 2026-11-16 · A rebuilt page takes every Smithsonian value from one retrieval (`data/sources/`), never from `volcanoes.json` — a page that cites v. 5.4.0 must not print a number from the February copy.
- D-22 · 2026-11-16 · From the weekly report a rebuilt page prints only the week, the entry's heading and its link — the feed carries a Smithsonian copyright line, and a hand-written summary would be stale within a week. The alert level is left out: the feed has no field for it.
- D-23 · 2026-11-16 · No byline until the author has read the page: `"reviewed"` in the profile file stays null and the page shows only "Data retrieved …".
- D-24 · 2026-11-16 · The look's fonts are hosted in `public/fonts/` and preloaded by rebuilt pages only — `next/font` would preload them on every volcano page, and about 1,200 of those don't use them yet. Move to `next/font` in the root layout when the last page has the look.
- D-25 · 2026-11-16 · The strip sits right under the main number: its line must be on screen at load on a phone and on common laptop heights — the drawing is the look's one moment and runs once.
- D-26 · 2026-11-16 · `volcanoatlas.vercel.app` is redirected to the www domain by a host rule in `next.config.ts` — it served a second public copy of the site.
- D-27 · 2026-11-17 · On a rebuilt profile the map is the first thing under the strip, with its "Where is …?" section, ahead of the demand-ordered sections — the owner: the reader should see the map quickly. This overrides D-16 for that one section.
- D-28 · 2026-11-17 · The owner's "look good" on the Stromboli preview counts as his review: his name and that day go on the page, as he was told beforehand. /about names him with both degrees and his public profile (Person markup); a reviewed page carries Article markup with him as author and the review day as its date. Dataset markup stays out (D-18).
- D-29 · 2026-11-17 · The map on a rebuilt page is its own component in the page's look (`components/record/RecordMap.tsx`): no scroll-wheel zoom, no one-finger dragging on touch screens (the page must scroll), map library loaded only when the reader is within 400 px of it. The old `VolcanoLocationMap` stays for pages that are not rebuilt.

## §3 Rejected — don't re-propose
- 2026-11-15 · Rendering the unreviewed article sections now for a quick content gain — publishes about 350,000 words of unverified text (D-07).
- 2026-11-15 · Keeping database-only pages indexable — see D-01.
- 2026-11-15 · Stating which weekday the Smithsonian weekly report appears — the report page and the RSS feed disagree; the page shows the feed's own dates.
- 2026-11-15 · Patching the old article text claim by claim — about 50,000 numbers with no trail; rebuilding from sources is faster and can be checked by script (D-14).
- 2026-11-16 · Asking the Smithsonian for written permission — the owner declined ("not doing that"). Don't put it back on his list (D-18).
- 2026-11-16 · Look B as a whole (atlas plates, serif type) and look C (dusk poster) — not picked. Only B's animated section drawing was taken.
- 2026-11-16 · The cut-open volcano beside the main number — it pushed the strip below the first screen, where its drawing would run unseen (D-25).
- 2026-11-16 · A hand-written summary of the weekly report on a profile — see D-22.
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
- Smithsonian data comes from its public WFS service (see `scripts/fetch-sources.py`), not from its web pages: a volcano page is about 500,000 characters and the eruption table is out of reach of a page fetch. In the eruption layer a ">" on the end year means the eruption is continuing; month or day 0 means unknown.
- `volcanoes.json` is the February 2026 copy (1,222 records) and still feeds every page that is not rebuilt: lists, maps, country pages, old profiles. The Smithsonian's list has 1,214 now; 51 last-eruption years and 25 elevations changed, and 27 profile headers disagree with it. Rebuilt pages don't read it (D-21). Refresh it with the ten-page step.
- The DOI printed for Volcanoes of the World v. 5.4 did not resolve on 2026-11-15: link the volcano's own Smithsonian page.
- The Smithsonian weekly feed can go stale (it stood at 2026-10-15 a month later): always print the report period.
- Design canvas boards: no two braces in a row in CSS; a title note above the boards covers their Play buttons at low zoom, so use none.
- The generator used to draw the looks lived in the session's scratch space; the built page (`RecordPage.tsx`, `figures.tsx`, `record.css`) is now the reference for the look.
- `scripts/fetch-sources.py` writes the raw downloads to `data/sources-raw/` (git-ignored); `scripts/build-data.py` slims them into `data/sources/` (committed). The Smithsonian version string is typed in `build-data.py`: check it on the Smithsonian's site at every refresh.
- A rebuilt page re-renders on the server once an hour (the weekly-feed fetch sets that). Its data files reach the server function through `outputFileTracingIncludes` in `next.config.ts`: a new data folder must be added there, or the hourly refresh fails silently and the page goes stale.
- `record.css` loads its fonts from `/fonts/…`; the two `preload()` calls in `RecordPage.tsx` must name the same files.
- Pictures of a built page with its animation: seek `document.getAnimations()` and capture the viewport with `captureBeyondViewport: false`. A full-page capture restarts CSS animations and shows the start state.
- The map library's default credit line carries a flag badge; `RecordMap.tsx` switches that prefix off and keeps the OpenStreetMap credit, which is required.
- On phones the author line sits under the strip (grid row in `record.css`), not under the title: three lines of byline above the strip pushed its drawing off the first screen.
- The header's desktop menu starts at 1024 px. At 768 px the logo and the menu ran into each other.
- The local production server runs as a process named `next-server`. If one is left running across a rebuild it serves the new pages with 404s for the new script files, and `scripts/check-render.py` then reports script errors on every page. Make sure the port is free before `npx next start`.
- Two country tables (Armenia, DR Congo) list shared-border volcanoes as extra unranked rows; row count there is higher than the headline count on purpose.

## §5 Backlog (priority order)
- [P0] VOL-005: scaled-content pre-flight (six questions, answered in writing) before the template is used for more than five pages; refresh `volcanoes.json` and the old profile headers to v. 5.4.0 with redirects for renamed records; the next ten profiles in tier order as rebuilt pages. Each needs its observatory page read; known header mismatches to clear on the way: Jan Mayen elevation, Kavachi and Fuji last eruption, the forced 2026 years.
- [P0] Then the remaining 139 profiles. A volcano that is not erupting needs its own main number and strip (last eruption, years since); the template takes both from the profile file.
- [P1] `/latest-eruptions` still prints the full text of the Smithsonian's weekly reports. Cut it to facts and links when that page is rebuilt (D-18, D-22).
- [P1] Country pages (46): counts and tables from the refreshed list with one rule for shared-border volcanoes; their own three looks.
- [P1] Hubs: `/countries` as a data page; `/active-volcanoes` from the Smithsonian's continuing-eruptions flag; `/deadliest-eruptions` from NOAA's records; `/map` with all records; titles over 60 characters.
- [P1] Trust frame: methodology and sources page from the registry, final "how this site is made" text, a contact route that works, consent mechanism decision.
- [P1] Rebuilt pages: own share image per page; Article and Dataset markup once the byline is on (D-04).
- [P1] Database-only pages (about 1,070): with eruption tables they gain real data; decide page by page which earn indexing.
- [P2] Licensed imagery; final map tiles.
- [P2] Raptive readiness pass, logged human review of the top 30 pages, freeze for three months.
- [P2] Clean-up: 66 lint findings; old helper scripts in `scripts/*.js`; stray audit files at the repo root; unused `next-sitemap` dependency; unused `UNSPLASH_ACCESS_KEY` variable in Vercel.

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

### 2026-11-15 · VOL-002 WAVE1 · chat · live
- What: pull request #1 merged with a merge commit; Vercel production build for that commit finished READY.
- Files: none beyond the merge; `scripts/check-build.py` now also crawls a remote site through the environment's proxy.
- Verified: preview looked at in the owner's Chrome before the merge (home, Stromboli, Italy, Agung, /countries, /latest-eruptions, /about, a 404, desktop dropdown; four pages in 386 px frames: menu opens with 8 links, no sideways scroll, map tiles load). After the deploy, `scripts/check-build.py https://www.volcanosatlas.com`: 1,212 pages all 200, 0 broken links, canonical = own URL on every page, 213 indexable = 213 sitemap URLs, no invalid JSON-LD. Live pages opened in the owner's Chrome: home (150 markers, tiles load), Stromboli, United States (165 markers, 165 linked rows), /latest-eruptions (stale-feed notice shown).
- Unverified: a real phone (the Chrome window could not be resized, so the phone check ran in narrow frames); desktop keyboard navigation.
- Commit: 35cc4b0 (merged to main)
- Notes: next is VOL-003, Wave 2, starting with the Stromboli profile.

### 2026-11-15 · VOL-003 PILOT · chat · done
- What: primary data pulled and checked (Smithsonian volcano and eruption layers, NOAA significant events), source registry and page map written, Stromboli copy written from verified sources only, three looks of that page drawn on the design canvas. No page of the site changed.
- Files: `research/data-sources.csv`, `research/page-map.csv`, `research/pilots/stromboli.md`, `scripts/fetch-sources.py`
- Verified: data-sourcing check on the registry and page map: RESULT OK, 7 verified, 0 warnings; fetch script ran (1,214 volcanoes, 11,089 eruptions, 903 NOAA events); six source links answered 200 and NOAA's page for the 1930 event shows the quoted figures; copy check: 0 machine-writing tells in 1,308 words, no paragraph over four sentences; looks rendered with their real fonts at 390, 1280 and 1700 px without sideways scroll; each look played full screen in the owner's Chrome and moved.
- Unverified: the search-results page for "stromboli volcano" was not checked; in the owner's Chrome the looks were seen only at his 614 px window width.
- Commit: this commit (pushed: work branch)
- Notes: for the pilot copy, sourcing and prose pass; design waits for the pick; Raptive waits for the author's read and the Smithsonian's permission.

### 2026-11-16 · VOL-004 RECORDPAGE · chat · done
- What: the owner's pick built as the real Stromboli page: slim data files from the Smithsonian and NOAA, a text file with tokens, the strip chart and the animated section drawing drawn from the data, weekly-report box, map that loads on scroll. `DESIGN.md` and `PRODUCT.md` written. Also: host redirect for volcanoatlas.vercel.app, header menu breakpoint moved to 1024 px, owner's decision on the Smithsonian permission recorded.
- Files: `app/volcano/[slug]/{RecordPage.tsx,record.css,page.tsx}`, `components/record/`, `lib/{eruptions,recordProfile,weekly,volcanoAPIs,site}.ts`, `data/sources/`, `data/profiles/stromboli.json`, `public/fonts/`, `scripts/{build-data,fetch-sources}.py`, `next.config.ts`, `components/Header.tsx`, `DESIGN.md`, `PRODUCT.md`, `research/*.csv`
- Verified: `npx tsc --noEmit` clean outside the old test file; `rm -rf .next && npx next build` exit 0 (218 static pages; /volcano/stromboli set to refresh hourly, other profiles static; data files present in the server function's file list); `scripts/check-build.py` on the local build: 1,212 pages all 200, 0 broken links, canonical = own URL on all, 213 indexable = 213 in sitemap, one h1 each, no invalid JSON-LD; `scripts/check-render.py`: Stromboli at 390 px without sideways scroll, map tiles load after scrolling, menu opens; page text carries the same figures as the checked pilot copy (92 years, 4th of 41 continuing eruptions, 6.5 of almost 169 years paused, 96%, 15 NOAA events, 13 deaths); NOAA's definition of a significant eruption re-read; pictures at 390, 768, 1024, 1280 and 1700 px looked at; animation frames at 1.5, 3.2 and 6.5 s show the line drawing, then the ring and the note, and the bubbles rising and bursting; registry check RESULT OK.
- Unverified: the vercel.app redirect (takes effect only after the merge); a real phone; the search-results page for "stromboli volcano".
- Commit: this commit (pushed: work branch)
- Notes: for this page sourcing, prose and design pass on the checks above; Raptive waits for the author's read and the trust frame. Pages finished: still 0 of 213 until it is live.

### 2026-11-16 · VOL-004 RECORDPAGE · chat · done (preview checked)
- What: the preview of pull request #4 looked at in the owner's Chrome; the phone-size section drawing capped at 420 px wide so it fits one screen on mid-width windows.
- Files: `app/volcano/[slug]/record.css`
- Verified: in the owner's Chrome (window 586 px wide) on the preview: two pictures one second apart show the line drawing, and the bubbles moving in the section drawing; the map loads its tiles when scrolled to; the report box is filled from the feed on Vercel's servers; all 31 source marks point at an entry in the source list; no sideways scroll; an old profile (Etna) and a country page (Italy) look as before and load none of the new fonts. Rebuilt locally after the CSS change (build passes).
- Unverified: desktop width in the owner's Chrome (his window could not be resized; desktop was checked in headless Chrome at 1024 to 1700 px); the full crawl was not repeated for the one-rule CSS change.
- Commit: this commit (pushed: work branch)
- Notes: the pull request stays open until the owner has seen the page.

### 2026-11-17 · VOL-004 RECORDPAGE · chat · done (owner's change)
- What: the owner looked at the preview ("look good but map should be higher up so user sees it quite quickly"). Map and its "Where is Stromboli?" section moved to the first place under the strip, beside the cut-open volcano; new map component in the page's look; report box and key facts form the next row. His name and the review day are on the page; /about names him (with Person markup); the page carries Article markup.
- Files: `app/volcano/[slug]/{RecordPage.tsx,record.css}`, `components/record/{RecordMap,LazyMap}.tsx`, `data/profiles/stromboli.json`, `lib/{site,recordProfile}.ts`, `app/about/page.tsx`, `DESIGN.md`
- Verified: `npx tsc --noEmit` clean outside the old test file; `rm -rf .next && npx next build` exit 0; `scripts/check-build.py` on the local build: 1,212 pages all 200, 0 broken links, canonical = own URL on all, 213 indexable = 213 in sitemap, one h1 each, no invalid JSON-LD (Person on 1 page, Article on 1); `scripts/check-render.py`: Stromboli at 390 px without sideways scroll, map 298 px high with 6 of 6 tiles, menu opens, /about clean; pictures with real map tiles at 1280 and 390 px: map top at 856 px on desktop and 1,219 px on the phone; dragging is off under a touch pointer and on with a mouse; the strip's line is on the first screen at 390×664 while it draws.
- Unverified: the preview and the live page in the owner's Chrome (logged in the next entry); the larger-map link target.
- Commit: this commit (pushed: work branch)
- Notes: section order on the page is now where, last, often, what, type, tall, old, danger, record.

### 2026-11-17 · VOL-004 RECORDPAGE · chat · live
- What: pull request #4 merged (merge commit 8c55406). The rebuilt Stromboli page is the live page; the Vercel project address now redirects to the www domain.
- Files: none beyond the merge; this entry and the page map note
- Verified: before the merge, the preview in the owner's Chrome at desktop width (1456 px): map with its tiles first under the strip beside the section drawing, author line, line drawing itself (two pictures a second apart), /about with the reviewer block; the larger-map link opens OpenStreetMap on the volcano. After the merge: Vercel production build of 8c55406 READY; https://www.volcanosatlas.com/volcano/stromboli answers 200 with its own canonical, index/follow and the author line; in the owner's Chrome on the live address the line draws, the map loads 6 tiles, both fonts load, no sideways scroll, all source marks resolve; volcanoatlas.vercel.app answers 308 to the same path on www (root and a deep page); the apex domain answers 308; /about, /, /volcano/etna and /sitemap.xml answer 200; the font file is served with a one-year immutable cache header.
- Unverified: a real phone; how the page shows in search results (Search Console work waits for the finish line).
- Commit: this commit (pushed: work branch)
- Notes: pages finished 1 of 213.

## §7 History & archive
- 2026-02 · Create Next App scaffold (02-13); first site commit with 150 profiles and 46 country pages (02-26); Vercel config; domain changed from volcanoatlas.com to volcanosatlas.com (02-27); favicon and OG image; analytics, Clarity and Bing verification; sitemap and robots (02-28)
- 2026-03 · ads.txt added (03-16)
- 2026-04 · "A1–A5" rendering fixes: wiki links, bold markup, title suffixes, recent-activity dates, key-facts accessors (04-20 to 04-22); schema components and `SEO-AUDIT-REPORT.md` (04-29)
- 2026-06 · root canonical moved from the vercel.app address to the www homepage — still one canonical for every page; OG image replaced (06-08)
