# DEVLOG — volcanosatlas.com
> Handoff file. Read §0–§5 and the last 10 entries of §6 before any work. Rules: devlog skill (owner's Claude account; no copy in this repo).

## §0 Resume here
_last update: 2026-11-17 · VOL-013_
- Step: all pages — the ten-page step is complete (10 live since 2026-11-17): Stromboli and Mauna Loa with the owner's review; Mount St. Helens, Mount Erebus, Kilauea, Eyjafjallajokull, Mount Pinatubo, Cotopaxi, Sakurajima (/volcano/aira) and Arenal without his name until he says which he has read. Owner's word of 2026-11-17 17:34: "looks nice, go" (carry on with the rest). Look picked 2026-11-16 (A "the record strip" with the animated cut-open volcano from B). Canvas: https://claude.ai/artifact/Ju8LCNp1RwWPEcb1nscaAf
- Phase: page-by-page rebuild until every page passes the four scores (sourcing, prose, design, Raptive). Owner's word of 2026-11-17: "do all pages like this", all four scores perfect on every page. Pages rebuilt and live: 10 of 213. Finished with the owner's review: 2 (Stromboli, Mauna Loa); waiting for his read: 8 (Mount St. Helens, Mount Erebus, Kilauea, Eyjafjallajokull, Mount Pinatubo, Cotopaxi, Sakurajima, Arenal).
- Last confirmed: VOL-013 PELEE — done: Mount Pelee as a record page (see §6). Before it: VOL-012 ARENAL live (c7e2de0).
- In flight (handed, NOT confirmed): none
- Next action: merge and check Mount Pelee live if its pull request is still open; then Rabaul (252140), Asamayama (283110), Villarrica (357120) and the rest by search demand. Pelee was taken first because its observatory's reports were readable; for the other three the current statement of the observatory still has to be found (Rabaul's observatory has no site of its own, Japan's warnings map needs JavaScript). Research notes of a volcano go into a notes file as each source is read, so a break in the session loses nothing. Novarupta and Krakatau wait for their own pieces (§5). Each page: data sheet from the site's own files (/home/claude/tools/sheet.py in a session), observatory pages read incl. its current statement on activity (`since_check`), profile written, checks, map with real tiles, preview looked at in the owner's Chrome, merged, production checked.
- Waiting on owner: he wrote "looks nice, go" on 2026-11-17 without naming pages; asked the same day which of Mount St. Helens, Mount Erebus, Kilauea and Eyjafjallajokull he read. His name and the date go only on the pages he names. Mount Pinatubo, Cotopaxi, Sakurajima and Arenal are new since then.
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
- Data sources: rebuilt pages read `data/sources/*.json` = Smithsonian Volcanoes of the World v. 5.4.0 (volcano list, eruptions) and NOAA significant events, retrieved 2026-11-16 (refresh: `scripts/fetch-sources.py`, then `scripts/build-data.py`) · old pages still read `volcanoes.json` = v. 5.3.4, exported 2026-02-11 (1,222 records) · /latest-eruptions reads the Smithsonian weekly RSS and the USGS elevated-volcanoes API (`lib/volcanoAPIs.ts`) · US volcano record pages read the USGS alert level live (`lib/usgs.ts`) · registry: `research/data-sources.csv` (11 verified sources; re-download with `scripts/fetch-sources.py`, the land heights with `scripts/fetch-ground.py`)
- Key paths: pages `app/` · templates `app/volcano/[slug]/`, `app/[slug]/` · rebuilt profiles: text `data/profiles/<slug>.json`, page `app/volcano/[slug]/RecordPage.tsx` + `record.css`, numbers `lib/eruptions.ts` + `lib/recordProfile.ts`, drawings `components/record/figures.tsx`, weekly report `lib/weekly.ts`, fonts `public/fonts/` · content `data/content/*.json` (150 volcano, 46 country, 4 special, 4 ranking) · link and route logic `lib/routes.ts` · Smithsonian access `lib/gvp.ts` · metadata `lib/site.ts` · checks `scripts/check-build.py`, `scripts/check-render.py`
- Skills in repo: none
- Design system: `DESIGN.md` (the look, from the owner's pick of 2026-11-16) and `PRODUCT.md` (what a page must do). `DESIGN-SPEC.md` is an early draft and not in force.
- Other plans / ledgers: `research/page-map.csv` (every page, its source and tier) · `docs/preflight-record-pages.md` (scaled-content check and the order of the next pages) · `research/pilots/stromboli.md` (verified copy of the pilot page) · `docs/audit-2026-11-15.md` (current audit) · `SEO-AUDIT-REPORT.md` (2026-04-29, its "85/100" verdict does not hold) · `docs/roadmap-notes.md` · `data/CLAUDE-CODE-PROMPTS.md`
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
- D-30 · 2026-11-17 · The record-page template passed the scaled-content check before its third page (`docs/preflight-record-pages.md`): prose is written per volcano, no sentence template is shared, and a volcano with too little sourced material stays a database page.
- D-31 · 2026-11-17 · The next ten are taken by the searches that already reach each page, starting with Mauna Loa because the template needed a volcano that is not erupting. The `volcanoes.json` refresh is its own later change: record pages don't read that file (D-21).
- D-32 · 2026-11-17 · A volcano that is not erupting: the main number is the time since its last eruption ended, the strip shows each eruption as a spike and ends flat, and nothing erupts in its section drawing. The page counts "today" on the server when it renders, so the number turns over by itself.
- D-33 · 2026-11-17 · A US volcano page repeats the USGS alert level and aviation color code from the Volcano Notification Service, with the notice's date and link, read live. It is quoted, never worked out (D-03 stands). D-22's "alert level is left out" was about the weekly feed.
- D-34 · 2026-11-17 · Where the country's observatory prints its own summit height, the page uses it (`facts.summit_*` with a source) and names the Smithsonian's figure in the calculation notes — USGS gives Mauna Loa 13,679 ft (4,169 m), the figure readers meet everywhere else; the Smithsonian's 4,170 m converts to 13,681 ft.
- D-35 · 2026-11-17 · Lengths of time are printed in calendar years and months to the nearest month, never rounded up to a whole year — the 38 years 7 months between Mauna Loa's last two eruptions printed as "39 years" beside USGS's "38 years". Two cells of the live Stromboli table changed with it (16 years 11 months, 21 years 2 months).
- D-36 · 2026-11-17 · An empty deaths field in NOAA's record prints as "none" under "Deaths recorded", not as 0 — NOAA records no zero.
- D-37 · 2026-11-17 · The owner approved Mauna Loa ("superb") and said to do all pages this way. A rebuilt page goes live after the checks and the look in his Chrome without waiting for him; his name and review date go on it only after he has read it (D-23, D-28 stand), so each batch ends with a list for him.
- D-38 · 2026-11-17 · Dates and lengths of time are printed no more exactly than the Smithsonian gives them (`dateText`, `spanBetween`). Its raw rows carry a day uncertainty the first data build dropped: 182 means only the year is known, 15 only the month. The live Stromboli table had printed "Jul 2, 1857" for a year-only date; it now prints "1857" and "about 32 years".
- D-39 · 2026-11-17 · A volcano on land is drawn with two heights to scale: the summit above sea level and the land around it. The land height is the median of NOAA's ETOPO 2022 cells 14 to 16 km from the summit (`scripts/fetch-ground.py`, `data/sources/etopo-ground.json`), a calculated value shown with its method — it answers "how tall from its base" for every land volcano without a figure typed per page. Summits never come from that grid: a cell is an average and reads low.
- D-40 · 2026-11-17 · Pages are built in batches of a few and each batch goes live when its checks and the look in the owner's Chrome pass. US volcanoes and volcanoes with an English-language observatory go first within the demand order, because their sources can be read directly.
- D-41 · 2026-11-17 · Under the strip the page is two columns that each pack upward, not two rows. Found on the Mount Erebus preview: a volcano with no USGS box and no weekly report left a 300 px hole beside the key facts, and most of the pages still to build are like that. The phone order is unchanged. This moves the report box on Stromboli and Mauna Loa up under the "Where is" text.
- D-42 · 2026-11-17 · An eruption the Smithsonian lists as continuing is counted to today, in months until two years have passed (`cur_number`, `cur_unit`), the same rule as the time since a last eruption. Counting only to the Smithsonian's last update made Kilauea read "15 months" in a month when anyone can count 22; the page names that update, and USGS's episode log backs the later date. Stromboli and Erebus keep `cur_years`: their numbers are the same either way.
- D-43 · 2026-11-17 · A caldera volcano gets a drawing of its summit only, cut across the collapse pit, with every level from the observatory (`section.cut`). The levels are typed in the profile with the feet the source prints, and the text reads them through tokens (`pit_ft`, `surface_ft`, `drop_ft` …), so drawing and text cannot disagree.
- D-44 · 2026-11-17 · Volcano names follow the Smithsonian's list in titles, headings and text ("Kilauea", "Eyjafjallajokull"), with the local spelling given once ("Kīlauea", "Eyjafjallajökull"); other place names keep their marks, as the observatories write them. The title has to match what people type.
- D-45 · 2026-11-17 · Every page of a volcano the Smithsonian does not list as erupting carries `since_check`: what its own observatory showed on the day it was read, with the source. The build stops without it. It shows in the status box at the top; a US volcano's box holds the live USGS level, so there it goes into the notes. Reason: the list ended Krakatau's last eruption in February 2024 while Indonesia's agency reported eruptions through 2026. An automatic check against the Smithsonian's weekly-report archive was not possible on 2026-11-17: its volcano pages answered "temporarily unavailable" to the workspace and the map service has no weekly-report layer.

- D-46 · 2026-11-17 · Lengths of time agree with each other on a page: a time that runs to today is never rounded up into a year that has not passed (the table's "so far" and the big number say the same), an eruption that began and ended on one day prints as one date, and a length a report gives more exactly than the dates do may replace the calculated one for the newest eruption (`table.last_length`, with the source named under the table) — a table said "5 years so far" beside a headline "4 years ago", and "1 day" beside a text that said four minutes.

- D-47 · 2026-11-17 · A volcano on a high plateau gets the band of land under it cut short with a break mark in the drawing (when the land is higher above the sea than 1.2 times the volcano's height above the land); everything above the land stays to scale and the caption says the band is cut — at one scale Cotopaxi's 3,750 m of land made a grey block twice as tall as the cone.

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
- 2026-11-17 · A third callout on the Mauna Loa page (its three heights) — `DESIGN.md` allows two; the first height is already in the answer, the key facts and the drawing.
- 2026-11-17 · Lava fountains and directions of the 2022 flows in the Mauna Loa text — on USGS's pages they appear only in a photo caption or not at all.
- 2026-11-17 · Drawing each volcano's real outline from an elevation grid — the grid's cells are about 460 m wide, too coarse for small cones, and the owner approved the schematic cut-open drawing.

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
- Record pages for US volcanoes read `getMonitoredVolcanoes` (69 rows, every alert level). `getElevatedVolcanoes`, used by /latest-eruptions, lists only volcanoes above normal.
- USGS's Mauna Loa pages disagree with each other in three places (summit 4,169 m or about 4,170 m; "seven" flows that threatened Hilo above a list of eight; three distances for the 1984 flow). What the page prints and why is in the registry row `observatory-usgs`.
- The sea floor in a shield drawing moves with scrolling (`animation-timeline: view()`). A full-page picture shows it at its start unless reduced motion is on, and a tool that steps through `document.getAnimations()` must leave animations that are not on the document timeline alone.
- A sentence in a profile that leans on a data value needs a line in its `expect` block; the build stops when the data no longer matches.
- A build can stop with "next/font/google queries have exactly one entry" when a Google font download drops (the old pages still load three Google fonts at build time). Nothing is wrong with the code: run the build again.
- The Smithsonian's eruption rows have a day modifier and a day uncertainty besides the year ones (`sdmod`, `sdunc`, `edmod`, `edunc` in `gvp-eruptions.json`). A day of 16 or a date of July 2 is usually a placeholder for "month only" or "year only". Never print a date or a gap from `sy/sm/sd` directly.
- NOAA's elevation grid is read in small windows from its THREDDS server as OPeNDAP ASCII (`…_surface.nc.ascii?z[i0:1:i1][j0:1:j1]`); tiles are 15° wide and named after their north-west corner. Asking for the same variable twice in one request fails.
- NASA Earth Observatory addresses moved: `earthobservatory.nasa.gov/images/<id>/…` now redirects to a general page. The live copies are under `science.nasa.gov/earth/earth-observatory/`.
- A long volcano name does not fit beside the map marker on a phone: `RecordMap` puts names over 12 letters under the marker below 520 px. The street map's own labels can sit under the handwritten name (Ross Island at Erebus): look at the map with real tiles for every new page (`/tmp/looks/mapshot.py` in a session, or the preview in Chrome) and set `map_label: "below"` or `"above"` where they clash (Erebus below, Stromboli above).
- The local checks ran at phone width only, so a table that hid its last column on a desktop got as far as the preview (found in the owner's Chrome, 2026-11-17). `scripts/check-render.py` now opens every rebuilt page at 1440 px and fails a table that scrolls sideways there.
- In the phone drawing of an erupting volcano the lava burst needs the room of the summit label's third line; `LandDrawing` drops "above sea level" there. Look at the phone drawing of every erupting volcano.
- The site scrolls smoothly (`scroll-behavior`), so in Chrome `scrollIntoView` followed by another scroll lands nowhere: scroll with `window.scrollTo({top, behavior: 'instant'})`.
- `research/*.csv` are edited as text or written back with their own line ending and quoting: a plain `csv.DictWriter` pass rewrote every line of the page map. In the page map `data_source` is one registry name; other sources go in `notes`.
- The development server (`next dev`) can start with the same dropped font download as the build and then answers 500 forever: stop it, `rm -rf .next`, start again.
- Kilauea carries dated statements that go stale: the episode count (56 on 5 Nov 2026), the lava level (30 Jun 2026) and the tallest fountain. They sit in `data/profiles/kilauea.json` (text and `section.cut`) and come from USGS's Eruption Information page.
- The Smithsonian's eruption list can lag the volcano by months. Krakatau, read 2026-11-17: the list's last eruption ends February 20, 2024, while Indonesia's volcano agency (PVMBG, through MAGMA Indonesia) reported eruptions through 2026 at alert level III; news reports of September 2026 quote its bulletins. A page must not print "last erupted" from the list alone when the observatory says otherwise: read the observatory's current bulletin before writing any page, and give such a page a sourced, dated activity line. The list also gives Krakatau's summit as 285 m while PVMBG's 2026 bulletins imply 157 m (ash 250 m above the peak = 407 m above sea level).

- USGS fact sheets of 1997: the web pages under `pubs.usgs.gov/fs/1997/…` did not answer on 2026-11-17, while the PDFs under `pubs.usgs.gov/fs/old.1997/…` did. Search for the PDF address and link that.
- A profile's JSON is kept in memory by the production server; the dev server reads it again on every request. A changed profile that does not show locally means the server was started in production mode.

- A web address that was only named in a fetched page's summary cannot be fetched without the owner's approval (Instituto Geofísico's home page, 2026-11-17). Search with the site's domain as the only allowed domain: its pages then come back as results and can be read.

- A pull request is merged only when its commit status reads success. On 2026-11-17 a notebook-only pull request (17) was merged although its preview build had failed, because the shell loop that waited for the status did not stop the chain; the production build of the same commit passed and the site was not affected. Check the status in the same command that merges, and stop on anything but success.
- Japan's weather agency shows the warnings in force on a map that needs JavaScript; it cannot be read by a plain fetch. A page links it for the level in force and states no current level.

- Two uncertain dates in one row ("Oct 5, 1922 (uncertain)") pushed the eruption table past the text column on a desktop (Arenal, caught by the 1440 px check). A date now keeps to one line and its "(uncertain)" marker may wrap under it (`dateCell`, `.va-when`).

- Mount Pelee carries dated statements from its observatory that go stale: the earthquake count (September 2026), the swelling of the summit and the alert level (yellow, weekly report of 13 Nov 2026). They sit in `data/profiles/pelee.json` and come from the OVSM-IPGP bulletins listed at ipgp.fr/en/observatory-releases-and-bulletins/. Read the newest bulletin at each data refresh.

## §5 Backlog (priority order)
- [P0] Next pages: Krakatau, Aira (Sakurajima), Cotopaxi, Eyjafjallajokull, then Rabaul, Pinatubo, Arenal, Michoacan-Guanajuato (Paricutin), Novarupta and on by search demand; first-tier pages Popocatepetl, Nevado del Ruiz, Taal, Whakaari among them. The caldera drawing exists (Kilauea); Rabaul and Taal need their own levels from their observatories.
- [P0] Krakatau: needs a way to show activity newer than the Smithsonian's list (hero line and strip) from PVMBG's own bulletins (MAGMA Indonesia; its aviation notices are in English), and a decision on the summit height (list 285 m, PVMBG 157 m). Sources found: doi.org/10.1038/s41467-019-12284-5 (2018 collapse: island from 320 m to 120 m, over 430 deaths per BNPB, landslide at 13:55:49 UTC on 22 Dec 2018).
- [P0] Novarupta: the land drawing would turn a 65 m lava dome into a mountain. It needs its own drawing: the dome in its 2 km vent and Mount Katmai, 10 km away, with the caldera that fell in when the magma left. Sources found: pubs.usgs.gov/fs/fs075-98/, pubs.usgs.gov/publication/pp1791 (about 13.5 km³ of magma in about 60 hours), nps.gov/katm/learn/nature/valley-of-ten-thousand-smokes.htm (dome 380 m wide, 65 m high), usgs.gov/faqs/what-was-largest-volcanic-eruption-20th-century. USGS lists it live (NORMAL, notice of 18 Mar 2022). NOAA dates its entry September 6, 1912; the eruption began June 6.
- [P1] Kilauea upkeep: at every data refresh re-read USGS's Eruption Information page and update the episode sentence, the lava level and the tallest fountain in `data/profiles/kilauea.json`.
- [P0] Sources already found for the next pages (read them before writing; none is used yet): Sakurajima — data.jma.go.jp/vois/data/filing/souran_eng/volcanoes/090_sakurajima.pdf (JMA catalogue, English). Eyjafjallajokull — en.vedur.is/volcanoes/about-volcanoes/eyjafjallajokull/ (1,666 m, ice-filled caldera 2.5 km wide; the 2010 details need a second Icelandic Met Office page). Cotopaxi — the IG-EPN teachers' guide of 2024 on igepn.edu.ec (Spanish). Krakatau — doi.org/10.1038/s41467-019-12284-5 (2018 collapse; the heights before and after still need the Indonesian agency's own statement).
- [P0] Refresh `volcanoes.json` and the old profile headers to v. 5.4.0 with redirects for renamed records (own change); known header mismatches: Jan Mayen elevation, Kavachi and Fuji last eruption, the forced 2026 years.
- [P0] Then the remaining 139 profiles.
- [P1] `/latest-eruptions` still prints the full text of the Smithsonian's weekly reports. Cut it to facts and links when that page is rebuilt (D-18, D-22).
- [P1] Country pages (46): counts and tables from the refreshed list with one rule for shared-border volcanoes; their own three looks.
- [P1] Hubs: `/countries` as a data page; `/active-volcanoes` from the Smithsonian's continuing-eruptions flag; `/deadliest-eruptions` from NOAA's records; `/map` with all records; titles over 60 characters.
- [P1] Trust frame: methodology and sources page from the registry, final "how this site is made" text, a contact route that works, consent mechanism decision.
- [P1] Rebuilt pages: own share image per page; Article and Dataset markup once the byline is on (D-04).
- [P1] Database-only pages (about 1,070): with eruption tables they gain real data; decide page by page which earn indexing.
- [P2] Licensed imagery; final map tiles.
- [P2] Raptive readiness pass, logged human review of the top 30 pages, freeze for three months.
- [P2] Clean-up: 66 lint findings; old helper scripts in `scripts/*.js`; stray audit files at the repo root; unused `next-sitemap` dependency; unused `UNSPLASH_ACCESS_KEY` variable in Vercel.

- [P2] The street map prints place names in the local script (Japanese around Sakurajima), which a US reader cannot read. Look for a map layer with English labels whose terms allow use on a site with ads; until then the text says where the nearest city is.

- [P1] The build downloads its fonts from Google every time, and the download drops now and then: two preview builds failed that way on 2026-11-17 (pull requests 17 and 20), each time with nothing wrong in the code. Ship the font files with the site (`next/font/local`) so a build never depends on that download. Until then: an empty commit on the work branch starts a fresh build.

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

### 2026-11-17 · VOL-005 MAUNALOA · chat · done
- What: scaled-content check written; template extended for a volcano that is not erupting (main number, strip of separate eruptions, shield drawing with three heights, USGS alert level, observatory summit height, exact lengths of time); Mauna Loa written from USGS, National Park Service, Smithsonian and NOAA sources. Stromboli's fixed texts moved into its profile file.
- Files: `app/volcano/[slug]/{RecordPage.tsx,record.css}`, `components/record/figures.tsx`, `lib/{eruptions,recordProfile,usgs}.ts`, `data/profiles/{mauna-loa,stromboli}.json`, `docs/preflight-record-pages.md`, `research/*.csv`, `scripts/check-render.py`, `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md`
- Verified: `npx tsc --noEmit` clean outside the old test file; eslint clean on the changed files; `rm -rf .next && npx next build` exit 0 (218 static pages; both record pages refresh hourly; both profiles and the three data files in the server function's file list); `scripts/check-build.py` on the local build: 1,212 pages all 200, 0 broken links, canonical = own URL on all, 213 indexable = 213 in sitemap, one h1 each, no invalid JSON-LD; `scripts/check-render.py`: Mauna Loa at 390 px without sideways scroll, map 298 px high with 6 of 6 tiles, menu opens; registry check RESULT OK (9 verified, 0 warnings); Stromboli against the live page: text differs only in two table cells and the NOAA deaths column (D-35, D-36), its four drawings are the same apart from their description text and a paper edge on year labels; every cited address answers 200 (volcano.si.edu answers 403 to curl, see §4); Mauna Loa prose: 1,449 words, 0 machine-writing tells, no paragraph over four sentences, 56 source marks all pointing at one of 11 entries; pictures at 390, 586 and 1456 px looked at, map with real tiles at both widths; frames show the line drawing, then the ring and note; the sea floor in the drawing is fully down when the whole drawing is on screen (measured at 1456×825 and 390×700).
- Unverified: the preview in the owner's Chrome (next entry); a real phone; a browser without scroll-linked animation; the page while the USGS service is down (the box is then left out by code).
- Commit: this commit (pushed: work branch)
- Notes: not counted as finished until the owner has seen it: pages finished 1 of 213. Sourcing, prose and design pass on the checks above; Raptive waits for his read.

### 2026-11-17 · VOL-005 MAUNALOA · chat · done (preview checked)
- What: the preview of pull request #6 looked at in the owner's Chrome; a 23-hour share link made for him.
- Files: this entry
- Verified: Vercel preview build of 78f2fe2 READY. In the owner's Chrome (window 1512 px wide) on the preview: Mauna Loa shows the main number, then the red ring and note a second later; the strip is drawn; the map loads 6 tiles with the island in frame; the sea floor in the drawing is part-way down at one scroll position and fully down at the next; the waves moved between two readings a second apart; the USGS alert box is filled on Vercel's servers (NORMAL, GREEN, notice of November 6, 2026); 57 source marks all point at one of 11 entries; both fonts load; no sideways scroll. Stromboli on the same preview looks as it does live, with the two exact table cells and "Deaths recorded".
- Unverified: phone width in his Chrome (checked in headless Chrome at 390 and 586 px); a real phone.
- Commit: this commit (pushed: work branch)
- Notes: the pull request stays open until the owner has seen the page. Pages finished 1 of 213.

### 2026-11-17 · VOL-005 MAUNALOA · chat · done (owner approved)
- What: the owner looked at the Mauna Loa preview and approved it ("superb", 2026-11-17 13:37 his time). His name and that day are on the page (`"reviewed": "2026-11-17"`), with Article markup pointing at /about#author.
- Files: `data/profiles/mauna-loa.json`, this file
- Verified: `npx tsc --noEmit` clean outside the old test file; `rm -rf .next && npx next build` exit 0 on the second run (the first stopped on a dropped font download, see §4); `scripts/check-build.py`: 1,212 pages all 200, 0 broken links, canonical = own URL on all, 213 indexable = 213 in sitemap, Article markup on 2 pages; byline row looked at in pictures at 390 and 1456 px.
- Unverified: the byline on the preview in the owner's Chrome and the live page (next entry).
- Commit: this commit (pushed: work branch)
- Notes: pages finished 2 of 213 once it is live.

### 2026-11-17 · VOL-005 MAUNALOA · chat · live
- What: pull request #6 merged (35246c8) after the byline was looked at on the preview in the owner's Chrome.
- Files: this entry
- Verified: Vercel production build of 35246c8 READY. https://www.volcanosatlas.com/volcano/mauna-loa answers 200 with its own canonical, index/follow, Article markup and the byline, and is in the sitemap. In the owner's Chrome on www: main number, ring and note; strip drawn; map with 6 tiles; sea floor in the drawing fully down after scrolling to it; USGS alert box filled; no source mark without an entry; no sideways scroll. Stromboli on www looks as before.
- Unverified: a real phone.
- Commit: this commit (pushed: work branch)
- Notes: pages finished 2 of 213.

### 2026-11-17 · VOL-006 BATCH2 · chat · done
- What: second batch after the owner's "do all pages like this". New drawing for a volcano on land (two heights to scale, crater, lava dome, earlier summit, lava only while erupting); land height around 148 volcanoes worked out from NOAA's ETOPO 2022 grid; dates and lengths of time printed no more exactly than the Smithsonian gives them (D-38, changes table cells on the two live pages); plain labels for every dating method; Mount St. Helens written from three USGS publications and Mount Erebus from NASA Earth Observatory, both with the Smithsonian's record and NOAA.
- Files: `components/record/{figures,RecordMap,LazyMap}.tsx`, `app/volcano/[slug]/RecordPage.tsx`, `lib/{eruptions,recordProfile}.ts`, `scripts/{build-data,fetch-ground,check-render}.py`, `data/sources/{gvp-eruptions,etopo-ground}.json`, `data/profiles/{st-helens,erebus,stromboli}.json`, `research/*.csv`, `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md`
- Verified: `npx tsc --noEmit` clean outside the old test file; eslint clean on the changed files; `rm -rf .next && npx next build` exit 0; `scripts/check-build.py`: 1,212 pages all 200, 0 broken links, canonical = own URL on all, 213 indexable = 213 in sitemap, one h1 each, no invalid JSON-LD; `scripts/check-render.py`: both new pages at 390 px without sideways scroll, map tiles load (St. Helens 9 of 9, Erebus 6 of 6), menu opens; registry check RESULT OK (11 verified); Stromboli and Mauna Loa compared with the live pages: only the date cells, the "about" wording and two captions differ, strip lines and drawings unchanged; every cited address answers 200; both new pages read top to bottom and looked at in pictures at 390 and 1456 px, maps with real tiles.
- Unverified: the preview in the owner's Chrome and the live pages (next entry); a real phone.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read, then his name goes on: /volcano/st-helens, /volcano/erebus. USGS counts 57 deaths for May 18, 1980, NOAA lists 61; the page prints both.

### 2026-11-17 · VOL-006 BATCH2 preview · chat · done
- What: looked at the preview of pull request 8 in the owner's Chrome before merging and fixed what it showed. The eruptions table hid its last column on a desktop (cells could not wrap); the area under the strip left a 300 px hole on Mount Erebus (D-41); the handwritten map name sat on the street map's "Ross Island" label (and Stromboli's on "Catanzaro": it now sits over the marker, in open sea); on a phone the lava burst ran into the summit label. Also: short tables now fit a phone without sideways scroll, and the "within ten days" sentence on Mount St. Helens is tied to the data by an `expect` line.
- Files: `app/volcano/[slug]/{RecordPage.tsx,record.css}`, `components/record/{figures,RecordMap}.tsx`, `lib/{eruptions,recordProfile}.ts`, `data/profiles/{erebus,st-helens}.json`, `scripts/check-render.py`, `DESIGN.md`
- Verified: tsc and eslint clean; `rm -rf .next && npx next build` exit 0; crawl and render check re-run on that build (results in the pull request); every table measured at 1456 and 390 px on the four rebuilt pages: none scrolls sideways on a desktop, the NOAA tables fit a phone; pictures of the four pages at both widths looked at, Erebus map with real tiles.
- Unverified: the second preview in the owner's Chrome and the live pages (next entry); a real phone.
- Commit: this commit (pushed: work branch)
- Notes: none

### 2026-11-17 · VOL-006 BATCH2 · chat · live
- What: pull request 8 merged (merge commit 9e8f4d3) after four previews; Mount St. Helens and Mount Erebus are live, and the date-precision, table and column changes are live on Stromboli and Mauna Loa.
- Files: none beyond the pull request
- Verified: every gate on the final commit (tsc, clean build, crawl 1,212 pages all 200 with 0 broken links and 213 indexable = sitemap, render check incl. the new desktop table check, registry OK); the four pages looked at on the previews in the owner's Chrome (maps with tiles, drawings, tables, columns); Vercel production build of 9e8f4d3 READY; on www.volcanosatlas.com in the owner's Chrome: all four pages 200, canonical on themselves, index/follow, map tiles load (9/9, 6/6, 6/6, 6/6), no table scrolls sideways at 1512 px, no raw markup, byline present on Stromboli and Mauna Loa and absent on the two new pages, USGS alert box shows on Mount St. Helens and Mauna Loa.
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 9e8f4d3 (merged)
- Notes: four previews were needed because the first local checks ran at phone width only; the render check now covers desktop tables. Owner to read /volcano/st-helens and /volcano/erebus.

### 2026-11-17 · VOL-007 KILAUEA · chat · done
- What: Kilauea as a record page. New caldera drawing (summit cut across Halemaʻumaʻu: rim, caldera floor, the 2018 collapse pit, the lava that has refilled it, the tallest fountain to scale and moving). Text from nine USGS pages, the National Park Service, the Smithsonian's record and NOAA; every figure that changes is dated. New tokens: time in eruption to today (D-42), the eruption before the current one, the two longest eruptions, eruptions seen against eruptions dated afterwards, the caldera levels. Timeline label of a current eruption flips left when it would run off the strip; the status box spaces its two paragraphs; large death counts print with a comma.
- Files: `data/profiles/kilauea.json`, `components/record/figures.tsx`, `lib/recordProfile.ts`, `app/volcano/[slug]/{RecordPage.tsx,record.css}`, `scripts/check-render.py`, `research/*.csv`, `DESIGN.md`, `PRODUCT.md`
- Verified: tsc and eslint clean; `rm -rf .next && npx next build` exit 0; crawl: 1,212 pages all 200, 0 broken links, canonical on themselves, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: five rebuilt pages at 1440 px with no table scrolling sideways, phone pages without sideways scroll, map tiles load; registry check OK; every cited address was fetched and read on 2026-11-17; drawing looked at in pictures at both widths, fountain seen at three heights a moment apart; map with real tiles at both widths (name over the marker, clear of the town label "Volcano"); the page read top to bottom at 1456 and 390 px.
- Unverified: the preview in the owner's Chrome and the live page (next entry); a real phone.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read, then his name goes on: /volcano/kilauea. USGS disagrees with itself in four places (summit against the rim overlook, crater fill, buildings lost in 2018, "most recent eruption" in its facts box); the registry notes say which figure the page prints.

### 2026-11-17 · VOL-007 KILAUEA · chat · live
- What: pull request 10 merged (merge commit 8fd3556) after two previews; Kilauea is live as a record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit (tsc, eslint, clean build, crawl 1,212 pages all 200 with 0 broken links and 213 indexable = sitemap, render check on five rebuilt pages, registry OK); previews looked at in the owner's Chrome (hero, strip, map, drawing with the fountain at two heights, eruptions table, 2018 section with its callouts; Erebus strip label back in its place after the first preview moved it); Vercel production build of 8fd3556 READY; on www.volcanosatlas.com/volcano/kilauea in the owner's Chrome: 200, canonical on itself, index/follow, map tiles 6/6, fountain animation running, no table scrolling sideways at 1512 px, no raw markup, USGS alert box showing, no byline (by design).
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 8fd3556 (merged)
- Notes: owner to read /volcano/kilauea, /volcano/st-helens and /volcano/erebus. Krakatau was started and stopped: see the new §4 line.

### 2026-11-17 · VOL-008 EYJA · chat · done
- What: Eyjafjallajokull as a record page, from the Icelandic Meteorological Office's page and the Icelandic authorities' 2012 report to ICAO, NASA JPL (pronunciation), Britannica (meaning of the name), the Smithsonian's record and NOAA. Template: `since_check` required for every volcano not listed as erupting and shown in the status box (D-45), added to Mauna Loa and Mount St. Helens; ice cap drawn as a pale wash with its name on the ice; caldera label's pointer follows the label's length; phone timeline thins its grid for records over 260 years and keeps year labels readable under a date tick; tokens for the eruption before the last one and NOAA's count in words.
- Files: `data/profiles/{eyjafjallajokull,mauna-loa,st-helens}.json`, `components/record/figures.tsx`, `lib/recordProfile.ts`, `app/volcano/[slug]/RecordPage.tsx`, `research/*.csv`, `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md`
- Verified: see the pull request for the gate results of the final commit; drawing looked at in pictures at both widths; Mount St. Helens' drawing compared and unchanged; phone timelines of three pages looked at; the page read top to bottom at 1456 px.
- Unverified: the preview in the owner's Chrome and the live page (next entry); a real phone.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/eyjafjallajokull. IMO's overview page gives 1,666 m, its report and the Smithsonian 1,651 m; the page prints 1,651 m and says so.

### 2026-11-17 · VOL-008 EYJA · chat · live
- What: pull request 12 merged (merge commit 490ec5a) after one preview; Eyjafjallajokull is live as a record page and the dated observatory check is live on Mauna Loa and Mount St. Helens.
- Files: none beyond the pull request
- Verified: every gate on the final commit (tsc, eslint, clean build, crawl 1,212 pages all 200 with 0 broken links and 213 indexable = sitemap, render check on six rebuilt pages, registry OK with 12 verified); preview looked at in the owner's Chrome (hero, strip, map with tiles, drawing with the ice cap, status box, 2010 section and callouts) and the other five rebuilt pages fetched on it (200, no raw markup, notes and boxes as intended); Vercel production build of 490ec5a READY; on www.volcanosatlas.com/volcano/eyjafjallajokull in the owner's Chrome: 200, canonical on itself, index/follow, map tiles 6/6, no table scrolling sideways at 1512 px, no raw markup, status box showing the observatory check, no byline (by design).
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 490ec5a (merged)
- Notes: pubs.usgs.gov did not answer two fetches of the Pinatubo fact sheet on 2026-11-17 (site error); try again before choosing another volcano.

### 2026-11-17 · VOL-009 PINATUBO · chat · done
- What: Mount Pinatubo as a record page, from USGS Fact Sheet 113-97, three chapters of Fire and Mud (1996), USGS's 2016 feature, the Smithsonian's record and reports, NOAA, and PHIVOLCS's monitoring page (Alert Level 0 on the day it was read). Template: D-46 (`last_span`, `table.last_length`, no rounding up of a time "so far"); `map_label: "left"`; `crater_depth_text` for a depth the source gives as a bound; the phone drawing drops the summit label's third line when it would touch the earlier-summit outline (this also changes Mount St. Helens' phone drawing); "In the Philippines" / "In the United States" in the related links.
- Files: `data/profiles/pinatubo.json`, `components/record/{figures,RecordMap}.tsx`, `lib/{recordProfile,eruptions}.ts`, `app/volcano/[slug]/RecordPage.tsx`, `scripts/check-render.py`, `research/*.csv`, `DESIGN.md`
- Verified: on the final code: tsc and eslint on the changed files clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 7 rebuilt pages ok at 1440 px, phone pages without sideways scroll, tiles load; registry check OK (12 verified). Pictures looked at: the page at 1440 and 390 px, the drawing at both widths (and Mount St. Helens' phone drawing), the map with real tiles at both widths.
- Unverified: the preview in the owner's Chrome and the live page (next entry); a real phone.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/pinatubo. Sources disagree and the page says so: deaths (USGS in 2016 more than 840, NOAA 800; the 1996 overview has 200 to 300 during the eruption itself), the height of the ash cloud and the SO2 mass (details in the registry notes). The summit loss of 259 m is calculated from USGS's old height and the Smithsonian's current one.

### 2026-11-17 · VOL-009 PINATUBO · chat · live
- What: pull request 14 merged (merge commit e82ed84) after one preview; Mount Pinatubo is live as a record page, with the template changes of D-46.
- Files: none beyond the pull request
- Verified: every gate on the final commit (see the entry above); preview looked at in the owner's Chrome: Pinatubo (hero, strip, map with tiles and the name over the sea, drawing, status box, eruption table) and Mount St. Helens (drawing, key facts, related links), and all seven rebuilt pages fetched on it (200, no raw markup, bylines as intended, "so far" figures unchanged on the older pages); Vercel build of e82ed84 succeeded; on www.volcanosatlas.com/volcano/pinatubo in the owner's Chrome: canonical on itself, index/follow, map tiles 6/6, no table scrolling sideways at 1512 px, no raw markup, status box showing the PHIVOLCS check, no byline (by design).
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: e82ed84 (merged)
- Notes: the owner wrote "looks nice, go" at 17:34 while this batch was being merged: carry on with all pages. Which pages he read is not known yet (asked).

### 2026-11-17 · VOL-010 COTOPAXI · chat · done
- What: Cotopaxi as a record page, from the Instituto Geofísico's profile, its reports list (newest report 21 Oct 2026: activity low and unchanged) and its 2023 article on the eruption of 1877, the Smithsonian's record and reports, NOAA, and one paper abstract for the glacier. Template: D-47 (band of land cut short with a break mark); the glacier's name sits low on a pointed cone, where the ice is widest.
- Files: `data/profiles/cotopaxi.json`, `components/record/figures.tsx`, `scripts/check-render.py`, `research/*.csv` (new row `paper-abstracts`, tier B), `DESIGN.md`
- Verified: on the final code: tsc and eslint on the changed files clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 8 rebuilt pages ok at 1440 px, phone pages without sideways scroll, tiles load; registry check OK (13 verified). Pictures looked at: the page at 1440 and 390 px, the drawing at both widths, the map with real tiles at both widths, Eyjafjallajokull's drawing (unchanged).
- Unverified: the preview in the owner's Chrome and the live page (next entry); a real phone.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/cotopaxi. The page prints the institute's 5,897 m and mentions the Smithsonian's 5,911 m. NOAA dates the 1877 eruption a day earlier than the institute and lists 340 deaths; the institute's account gives no count. The institute's home page could not be read without the owner's approval; its Cotopaxi pages were reached through search.

### 2026-11-17 · VOL-010 COTOPAXI · chat · live
- What: pull request 16 merged (merge commit 54df3cc) after one preview; Cotopaxi is live as a record page, with the cut band of land in its drawing (D-47).
- Files: none beyond the pull request
- Verified: every gate on the final commit (see the entry above); preview looked at in the owner's Chrome (hero, strip, map with tiles, drawing with glacier and break mark, status box, the 1877 section and callouts), the other seven rebuilt pages and the Ecuador page fetched on it (200, no raw markup, bylines as intended); Vercel build of 54df3cc succeeded; on www.volcanosatlas.com/volcano/cotopaxi in the owner's Chrome: canonical on itself, index/follow, map tiles 6/6, no table scrolling sideways at 1456 px, no raw markup, status box showing the institute's report, no byline (by design).
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 54df3cc (merged)
- Notes: research notes for the next volcanoes go to a notes file in the session as each source is read (started with Cotopaxi).

### 2026-11-17 · VOL-011 SAKURAJIMA · chat · done
- What: Sakurajima as a record page at /volcano/aira (the Smithsonian files it under Aira; the page says so once), from the Japan Meteorological Agency's catalogue chapter, the Smithsonian's record and NOAA. No template change. §4 gained the rule that a merge waits for a green status.
- Files: `data/profiles/aira.json`, `scripts/check-render.py`, `research/*.csv`
- Verified: on the final code: tsc clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 9 rebuilt pages ok at 1440 px, phone page without sideways scroll, tiles load; registry check OK (13 verified). Pictures looked at: the page at 1440 px, the drawing at phone width, the map with real tiles at both widths.
- Unverified: the preview in the owner's Chrome and the live page (next entry); a real phone. The Smithsonian's own page for Aira was not read in this session; the record comes from the site's copy of its list.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/aira. The agency's warnings map could not be read, so the page links it and states no current alert level. Deaths in 1914: the agency's 58 in the text, NOAA's higher count in its table. Map labels around the volcano are in Japanese (backlog).

### 2026-11-17 · VOL-011 SAKURAJIMA · chat · live
- What: pull request 18 merged (merge commit 529a34f) on a green status after one preview; Sakurajima is live as a record page at /volcano/aira.
- Files: none beyond the pull request
- Verified: every gate on the final commit (see the entry above); preview looked at in the owner's Chrome (hero, strip, map with tiles, drawing, weekly-report box, the 1914 section and callouts), the other eight rebuilt pages and the Japan page fetched on it (200, no raw markup, bylines as intended); Vercel build of 529a34f succeeded; on www.volcanosatlas.com/volcano/aira in the owner's Chrome: canonical on itself, index/follow, map tiles 9/9, no table scrolling sideways at 1512 px, no raw markup, no byline (by design).
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 529a34f (merged)
- Notes: none.

### 2026-11-17 · VOL-012 ARENAL · chat · done
- What: Arenal as a record page, from the Red Sismológica Nacional's profile and its paper on the 42 years of eruption, an OVSICORI weekly bulletin (height, activity level), a dissertation in OVSICORI's library (the villages of 1968), the Smithsonian's record and NOAA. Template: an "(uncertain)" marker may wrap under its date in the eruption table.
- Files: `data/profiles/arenal.json`, `app/volcano/[slug]/{RecordPage.tsx,record.css}`, `scripts/check-render.py`, `research/*.csv`
- Verified: on the final code: tsc and eslint on the changed file clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 10 rebuilt pages ok at 1440 px (the first run failed Arenal's table, fixed), phone page without sideways scroll, tiles load; registry check OK (13 verified). Pictures looked at: the top of the page at 1440 px, the drawing at phone width, the map with real tiles at both widths, the eruption table.
- Unverified: the preview in the owner's Chrome and the live page (next entry); a real phone.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/arenal. The page prints the observatory's 1,755 m and says why the Smithsonian's 1,670 m differs (the summit grew during the eruption). The newest OVSICORI bulletin that could be read is of 18 Oct 2024; the page gives it with its date and takes the observatory check from the seismological network's profile.

### 2026-11-17 · VOL-012 ARENAL · chat · live
- What: pull request 20 merged (merge commit c7e2de0) on a green status; Arenal is live as a record page. The first preview build failed on the Google font download (JetBrains Mono); an empty commit started a second build, which passed, and only then was the preview looked at and the pull request merged.
- Files: none beyond the pull request
- Verified: every gate on the final code (see the entry above); preview looked at in the owner's Chrome (hero, strip, map with tiles and the name above the marker, drawing, status box, the eruption table with "(uncertain)" wrapped), the other nine rebuilt pages and the Costa Rica page fetched on it (200, no raw markup, bylines as intended); Vercel build of c7e2de0 succeeded; on www.volcanosatlas.com/volcano/arenal in the owner's Chrome: canonical on itself, index/follow, map tiles 9/9, no table scrolling sideways at 1456 px, no raw markup, status box present, no byline (by design); four older rebuilt pages answer 200 with the new table markup.
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: c7e2de0 (merged)
- Notes: the ten-page step is complete. Fonts shipped with the site are now a P1 backlog item.

### 2026-11-17 · VOL-013 PELEE · chat · done
- What: Mount Pelee as a record page, from the Martinique observatory's bulletin for September 2026 and IPGP's list of releases (newest weekly report 13 Nov 2026, alert yellow), three USGS pages for 1902 and 1929–32, the Smithsonian's record and NOAA. The page leads with what the instruments show now (reactivation since April 2019). No template change.
- Files: `data/profiles/pelee.json`, `scripts/check-render.py`, `research/*.csv`
- Verified: on the final code: tsc clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 11 rebuilt pages ok at 1440 px, phone page without sideways scroll, tiles load; registry check OK (13 verified). Pictures looked at: the top of the page at 1440 px, the drawing at phone width, the map with real tiles at both widths.
- Unverified: the preview in the owner's Chrome and the live page (next entry); a real phone. The three USGS pages were read as search-result text, not opened whole.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/pelee. Deaths of 1902: USGS's 28,000 and "nearly 30,000" and NOAA's figures are all on the page. The page does not say when the yellow alert began (the observatory's 2020 notice no longer opens). The session's cloud environment restarted during this batch; files were intact.

## §7 History & archive
- 2026-02 · Create Next App scaffold (02-13); first site commit with 150 profiles and 46 country pages (02-26); Vercel config; domain changed from volcanoatlas.com to volcanosatlas.com (02-27); favicon and OG image; analytics, Clarity and Bing verification; sitemap and robots (02-28)
- 2026-03 · ads.txt added (03-16)
- 2026-04 · "A1–A5" rendering fixes: wiki links, bold markup, title suffixes, recent-activity dates, key-facts accessors (04-20 to 04-22); schema components and `SEO-AUDIT-REPORT.md` (04-29)
- 2026-06 · root canonical moved from the vercel.app address to the www homepage — still one canonical for every page; OG image replaced (06-08)
