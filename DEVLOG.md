# DEVLOG — volcanosatlas.com
> Handoff file. Read §0–§5 and the last 10 entries of §6 before any work. Rules: devlog skill (owner's Claude account; no copy in this repo).

## §0 Resume here
_last update: 2026-11-17 · VOL-019_
- Step: all pages — the ten-page step is complete; 16 live since 2026-11-17: Stromboli and Mauna Loa with the owner's review; Mount St. Helens, Mount Erebus, Kilauea, Eyjafjallajokull, Mount Pinatubo, Cotopaxi, Sakurajima (/volcano/aira), Arenal, Mount Pelee, Mount Asama (/volcano/asamayama), Kanlaon, Bulusan, Ambae and Nyiragongo without his name until he says which he has read. Owner's word of 2026-11-17 17:34: "looks nice, go" (carry on with the rest). Look picked 2026-11-16 (A "the record strip" with the animated cut-open volcano from B). Canvas: https://claude.ai/artifact/Ju8LCNp1RwWPEcb1nscaAf
- Phase: page-by-page rebuild until every page passes the four scores (sourcing, prose, design, Raptive). Owner's word of 2026-11-17: "do all pages like this", all four scores perfect on every page. Pages rebuilt and live: 16 of 213. Finished with the owner's review: 2 (Stromboli, Mauna Loa); waiting for his read: 14 (Mount St. Helens, Mount Erebus, Kilauea, Eyjafjallajokull, Mount Pinatubo, Cotopaxi, Sakurajima, Arenal, Mount Pelee, Mount Asama, Kanlaon, Bulusan, Ambae, Nyiragongo).
- Last confirmed: VOL-019 NYIRAGONGO — live (e056c53): Nyiragongo as a record page; the honest wording for a stale weekly feed (D-50) and the uncertain-date marker (D-51) are live on every record page (see §6).
- In flight (handed, NOT confirmed): none
- Next action: the next volcano pages by search demand among those whose observatory can be read and whose shape an existing drawing fits: Colima, Galeras and Nevado del Ruiz (Colombia's survey), Momotombo, then on down the list. Deferred, each with its reason in §5: Krakatau, Novarupta, Rabaul, Villarrica, Ambrym and Masaya (the last two wait for a caldera drawing); Grimsvotn, Kikai and Campi Flegrei need a drawing of their own too. Research notes of a volcano go into a notes file as each source is read, and every source link is fetched and read with pointed questions before the page is written (§4). Each page: data sheet from the site's own files, observatory read incl. its current statement, profile written, checks, map with real tiles, preview looked at in the owner's Chrome, merged only on a green status, production checked.
- Waiting on owner: he wrote "looks nice, go" on 2026-11-17 without naming pages; asked the same day which of Mount St. Helens, Mount Erebus, Kilauea and Eyjafjallajokull he read. His name and the date go only on the pages he names. Mount Pinatubo, Cotopaxi, Sakurajima, Arenal, Mount Pelee, Mount Asama, Kanlaon, Bulusan, Ambae and Nyiragongo are new since then. On 2026-11-17 20:18 he wrote "font ok, lets just continue": fonts answered (VOL-015), no pages named, so still no new bylines.
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

- D-49 · 2026-11-17 · A length of time that runs to today ("so far", "ago") counts whole months only and is never rounded up — on Bulusan the table said "19 months so far" beside a headline of 18 months; D-46 had only stopped the rounding at a year's end.
- D-47 · 2026-11-17 · A volcano on a high plateau gets the band of land under it cut short with a break mark in the drawing (when the land is higher above the sea than 1.2 times the volcano's height above the land); everything above the land stays to scale and the caption says the band is cut — at one scale Cotopaxi's 3,750 m of land made a grey block twice as tall as the cone.

- D-48 · 2026-11-17 · The typefaces of the site's frame (Playfair Display, Source Sans 3, JetBrains Mono) ship with the site: `next/font/local`, files in `app/fonts`, licences in `public/fonts`; Tailwind's font families point at the CSS variables — preview builds failed at random on the download from Google (pull requests 17 and 20), and `next/font/local` gives the families names of its own, so the literal Google names in Tailwind would have fallen back to Georgia without any error. Owner's yes: "font ok" (2026-11-17).

- D-50 · 2026-11-17 · A weekly-report entry from a feed that has stopped is not called the latest: the status box says "Weekly report of <week>", names the day the feed was last updated and says the Smithsonian's site may have later ones; the headline note falls back to the plain note — the Smithsonian's feed stopped on 15 Oct 2026 while its site carried reports to 5–11 Nov 2026, and live pages called a five-week-old entry the latest.
- D-51 · 2026-11-17 · A current eruption whose start day the Smithsonian marks with a question mark prints "(date uncertain)" after the date wherever `cur_since` is used (headline, key facts, text) — Nyiragongo's "2002 May 17 (?)" would otherwise read as an exact date in the largest type on the page.

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
- Since VOL-015 no build downloads fonts. A preview build that fails now has a real cause: read its build log on Vercel first. Never merge on a failed status.
- The Smithsonian's eruption rows have a day modifier and a day uncertainty besides the year ones (`sdmod`, `sdunc`, `edmod`, `edunc` in `gvp-eruptions.json`). A day of 16 or a date of July 2 is usually a placeholder for "month only" or "year only". Never print a date or a gap from `sy/sm/sd` directly.
- NOAA's elevation grid is read in small windows from its THREDDS server as OPeNDAP ASCII (`…_surface.nc.ascii?z[i0:1:i1][j0:1:j1]`); tiles are 15° wide and named after their north-west corner. Asking for the same variable twice in one request fails.
- NASA Earth Observatory addresses moved: `earthobservatory.nasa.gov/images/<id>/…` now redirects to a general page. The live copies are under `science.nasa.gov/earth/earth-observatory/`.
- A long volcano name does not fit beside the map marker on a phone: `RecordMap` puts names over 12 letters under the marker below 520 px. The street map's own labels can sit under the handwritten name (Ross Island at Erebus): look at the map with real tiles for every new page (`/tmp/looks/mapshot.py` in a session, or the preview in Chrome) and set `map_label: "below"` or `"above"` where they clash (Erebus below, Stromboli above).
- The local checks ran at phone width only, so a table that hid its last column on a desktop got as far as the preview (found in the owner's Chrome, 2026-11-17). `scripts/check-render.py` now opens every rebuilt page at 1440 px and fails a table that scrolls sideways there.
- In the phone drawing of an erupting volcano the lava burst needs the room of the summit label's third line; `LandDrawing` drops "above sea level" there. Look at the phone drawing of every erupting volcano.
- The site scrolls smoothly (`scroll-behavior`), so in Chrome `scrollIntoView` followed by another scroll lands nowhere: scroll with `window.scrollTo({top, behavior: 'instant'})`.
- `research/*.csv` are edited as text or written back with their own line ending and quoting: a plain `csv.DictWriter` pass rewrote every line of the page map. In the page map `data_source` is one registry name; other sources go in `notes`.
- A development server (`next dev`) that answers 500 on every page after a bad start: stop it, `rm -rf .next`, start again.
- Kilauea carries dated statements that go stale: the episode count (56 on 5 Nov 2026), the lava level (30 Jun 2026) and the tallest fountain. They sit in `data/profiles/kilauea.json` (text and `section.cut`) and come from USGS's Eruption Information page.
- The Smithsonian's eruption list can lag the volcano by months. Krakatau, read 2026-11-17: the list's last eruption ends February 20, 2024, while Indonesia's volcano agency (PVMBG, through MAGMA Indonesia) reported eruptions through 2026 at alert level III; news reports of September 2026 quote its bulletins. A page must not print "last erupted" from the list alone when the observatory says otherwise: read the observatory's current bulletin before writing any page, and give such a page a sourced, dated activity line. The list also gives Krakatau's summit as 285 m while PVMBG's 2026 bulletins imply 157 m (ash 250 m above the peak = 407 m above sea level).

- USGS fact sheets of 1997: the web pages under `pubs.usgs.gov/fs/1997/…` did not answer on 2026-11-17, while the PDFs under `pubs.usgs.gov/fs/old.1997/…` did. Search for the PDF address and link that.
- A profile's JSON is kept in memory by the production server; the dev server reads it again on every request. A changed profile that does not show locally means the server was started in production mode.

- A web address that was only named in a fetched page's summary cannot be fetched without the owner's approval (Instituto Geofísico's home page, 2026-11-17). Search with the site's domain as the only allowed domain: its pages then come back as results and can be read.

- A pull request is merged only when its commit status reads success. On 2026-11-17 a notebook-only pull request (17) was merged although its preview build had failed, because the shell loop that waited for the status did not stop the chain; the production build of the same commit passed and the site was not affected. Check the status in the same command that merges, and stop on anything but success.
- Japan's weather agency shows the warnings in force on a map that needs JavaScript; a plain fetch cannot read it. Each volcano also has a plain status page, data.jma.go.jp/vois/data/report/activity_info/<the agency's number>.html (in Japanese: level in force, date of the last change, newest commentary); find it with a Japanese-language search restricted to jma.go.jp. Mount Asama's page uses it. Sakurajima's page still links the map and states no level (§5).

- Two uncertain dates in one row ("Oct 5, 1922 (uncertain)") pushed the eruption table past the text column on a desktop (Arenal, caught by the 1440 px check). A date now keeps to one line and its "(uncertain)" marker may wrap under it (`dateCell`, `.va-when`).

- Mount Pelee carries dated statements from its observatory that go stale: the earthquake count (September 2026), the swelling of the summit and the alert level (yellow, weekly report of 13 Nov 2026). They sit in `data/profiles/pelee.json` and come from the OVSM-IPGP bulletins listed at ipgp.fr/en/observatory-releases-and-bulletins/. Read the newest bulletin at each data refresh.
- Mount Asama carries dated statements from the agency's status page that go stale: Level 1 (lowered from 2 on 22 May 2026) and the commentary of 13 Nov 2026 (36 volcanic earthquakes a day). They sit in `data/profiles/asamayama.json`. Read the status page at each data refresh.
- Sakurajima and Kanlaon carry dated statements too: Sakurajima's alert level (3; warning of 27 Jul 2022; commentary of 16 Nov 2026) in `data/profiles/aira.json`, Kanlaon's alert level (2, read 17 Nov 2026), its explosions of 2025–2026 and its gas average in `data/profiles/kanlaon.json`. Read the agencies' pages at each data refresh.
- Vanuatu: the geohazards department's pages can be fetched (www.vmgd.gov.vu: a page per volcano with the alert level, and /warnings/volcano with the dated warnings). Its older address vmgd.gov.vu/vmgd/index.php/... still shows the bulletins of 31 Oct 2024: good as a dated source, not as the current state. Bulusan and Ambae carry dated statements as well (`data/profiles/bulusan.json`, `ambae.json`).
- PHIVOLCS: the alert levels are on hazardhunter.georisk.gov.ph/monitoring/volcano (a plain fetch reads it). When several volcanoes show the same "since" date there, it is a system date, not the start of the level: print none. The bulletins at wovodat.phivolcs.dost.gov.ph load their text with JavaScript: a fetch returns header and footer only, so read them as search-result text (search restricted to phivolcs.dost.gov.ph).
- Chile's SERNAGEOMIN (both of its sites) refuses the fetch tool. Do not go around a refusal with another tool. A Chilean volcano needs another readable source with a current date (the Smithsonian's weekly reports relay the agency), or it waits.
- The fetch tool's copy of a Smithsonian volcano page can be older than the site's data file and carries no Geological Summary. The data file is the record; take a summary sentence only from text that was actually read (a report page or search-result text), and say in the log how it was read.

- Search-result text is a lead, not a reading. Fetch every source link with pointed questions before the page is written: on Nyiragongo the second reading changed four facts (the 1977 lava did not reach Goma; the Smithsonian's own bulletin counts about 100 dead for 2002; the homeless figures differ between sources; two Smithsonian reports put the airport on different sides of the city, so the page prints no side). A link the reader cannot open is not cited when a page that was read carries the fact.
- Smithsonian addresses the fetch tool can read: `showreport.cfm?doi=10.5479%2Fsi.GVP.BGVN…` (a bulletin; it also carries the Geological Summary: ask for it by name), `reports_weekly.cfm?weekstart=YYYYMMDD` (one week's report), `volcano.cfm?vn=<number>` (weekly and bulletin reports; the tool reads the first 100,000 characters and its copy can end months before today) and `gvp_currenteruptions.cfm`. These returned an error on 2026-11-17: `ShowReport.cfm?doi=10.5479/si.GVP.WVAR…`, `showreport.cfm?wvar=…` and `volcanolist_countries.cfm`.
- The Smithsonian's RSS feed of the weekly report (what the site reads) has not changed since 15 Oct 2026; its site has later reports (checked 2026-11-17). Pages say so (D-50). Nothing on a page may lean on the feed being current.
- Nyiragongo carries dated statements that go stale (`data/profiles/nyiragongo.json`): the Goma observatory's, as relayed by the Smithsonian (February 2023, March 2024), a satellite image of 5 Jul 2024, and the sentence "This page has no later report from the crater". At each data refresh read the Smithsonian's page for newer weekly reports. The observatory has no site the tool can read.
- Land drawing: on a volcano that is erupting and stands on a cut band of land (D-47), the red conduit ends at the ground line; it used to run 18 px into the band and through the land label (Nyiragongo, both widths).

## §5 Backlog (priority order)
- [P0] Next pages: Krakatau, Aira (Sakurajima), Cotopaxi, Eyjafjallajokull, then Rabaul, Pinatubo, Arenal, Michoacan-Guanajuato (Paricutin), Novarupta and on by search demand; first-tier pages Popocatepetl, Nevado del Ruiz, Taal, Whakaari among them. The caldera drawing exists (Kilauea); Rabaul and Taal need their own levels from their observatories.
- [P0] Krakatau: needs a way to show activity newer than the Smithsonian's list (hero line and strip) from PVMBG's own bulletins (MAGMA Indonesia; its aviation notices are in English), and a decision on the summit height (list 285 m, PVMBG 157 m). Sources found: doi.org/10.1038/s41467-019-12284-5 (2018 collapse: island from 320 m to 120 m, over 430 deaths per BNPB, landslide at 13:55:49 UTC on 22 Dec 2018).
- [P0] Novarupta: the land drawing would turn a 65 m lava dome into a mountain. It needs its own drawing: the dome in its 2 km vent and Mount Katmai, 10 km away, with the caldera that fell in when the magma left. Sources found: pubs.usgs.gov/fs/fs075-98/, pubs.usgs.gov/publication/pp1791 (about 13.5 km³ of magma in about 60 hours), nps.gov/katm/learn/nature/valley-of-ten-thousand-smokes.htm (dome 380 m wide, 65 m high), usgs.gov/faqs/what-was-largest-volcanic-eruption-20th-century. USGS lists it live (NORMAL, notice of 18 Mar 2022). NOAA dates its entry September 6, 1912; the eruption began June 6.
- [P1] Kilauea upkeep: at every data refresh re-read USGS's Eruption Information page and update the episode sentence, the lava level and the tallest fountain in `data/profiles/kilauea.json`.
- [P0] Sources already found for the next pages (read them before writing; none is used yet): Sakurajima — data.jma.go.jp/vois/data/filing/souran_eng/volcanoes/090_sakurajima.pdf (JMA catalogue, English). Eyjafjallajokull — en.vedur.is/volcanoes/about-volcanoes/eyjafjallajokull/ (1,666 m, ice-filled caldera 2.5 km wide; the 2010 details need a second Icelandic Met Office page). Cotopaxi — the IG-EPN teachers' guide of 2024 on igepn.edu.ec (Spanish). Krakatau — doi.org/10.1038/s41467-019-12284-5 (2018 collapse; the heights before and after still need the Indonesian agency's own statement).
- [P0] Refresh `volcanoes.json` and the old profile headers to v. 5.4.0 with redirects for renamed records (own change); known header mismatches: Jan Mayen elevation, Kavachi and Fuji last eruption, the forced 2026 years.
- [P0] Then the remaining 134 profiles (150 less the 16 rebuilt, Nyiragongo included).
- [P1] `/latest-eruptions` still prints the full text of the Smithsonian's weekly reports. Cut it to facts and links when that page is rebuilt (D-18, D-22).
- [P1] Country pages (46): counts and tables from the refreshed list with one rule for shared-border volcanoes; their own three looks.
- [P1] Hubs: `/countries` as a data page; `/active-volcanoes` from the Smithsonian's continuing-eruptions flag; `/deadliest-eruptions` from NOAA's records; `/map` with all records; titles over 60 characters.
- [P1] Trust frame: methodology and sources page from the registry, final "how this site is made" text, a contact route that works, consent mechanism decision.
- [P1] Rebuilt pages: own share image per page; Article and Dataset markup once the byline is on (D-04).
- [P1] Database-only pages (about 1,070): with eruption tables they gain real data; decide page by page which earn indexing. Nine of them showed search demand in the owner's export and are the first candidates if he wants pages beyond the 213: Langila, Chimborazo, Lautaro, Bamus, Pagan, Blup Blup, Pululahua, Nabro, Suwanosejima (his decision; not started).
- [P2] Licensed imagery; final map tiles.
- [P2] Raptive readiness pass, logged human review of the top 30 pages, freeze for three months.
- [P2] Clean-up: 66 lint findings; old helper scripts in `scripts/*.js`; stray audit files at the repo root; unused `next-sitemap` dependency; unused `UNSPLASH_ACCESS_KEY` variable in Vercel.

- [P0] Rabaul: a sea-flooded caldera whose listed summit (688 m) is a point on the rim while the active cones, Tavurvur and Vulcan, are low: the land drawing would lie. It needs its own drawing (rim, bay, the two cones), and its observatory has no site of its own (use the Smithsonian's newest report, found by search, and say so).
- [P0] Villarrica: SERNAGEOMIN cannot be read (§4), the newest readable relay is the Smithsonian's report for 3–9 Sep 2026 (alert raised from Green to Yellow on 4 Sep 2026: more earthquakes, small explosions, a rising lava lake), and the Smithsonian's list (7 Aug 2026) predates that unrest. A page built now would print a ten-week-old status for a volcano on Yellow alert. Rebuild when the list is refreshed or a current relay can be read (try SENAPRED).
- [P2] The street map prints place names in the local script (Japanese around Sakurajima), which a US reader cannot read. Look for a map layer with English labels whose terms allow use on a site with ads; until then the text says where the nearest city is.

- [P2] All three frame typefaces are preloaded on every page, as before VOL-015. The mono face is used in a handful of places (the 404 page among them): check whether it earns its preload, and move Archivo and Caveat into `next/font/l- [P0] A general caldera drawing (rim, floor, the cones inside, sea where there is one) unlocks Ambrym (a 12-km caldera with two active cones, Benbow and Marum; same Vanuatu sources as Ambae), Rabaul, Masaya, Campi Flegrei and Kikai. The Kilauea drawing is specific to Kilauea.
- [P1] Read the weekly report from the Smithsonian's site (`reports_weekly.cfm`) if its feed stays dead: `lib/weekly.ts` and `/latest-eruptions` read only the feed (§4).
- [P2] Say on every page of an erupting volcano how the Smithsonian decides that an eruption is continuing (no break of three months or more, from its Current Eruptions page); only Nyiragongo's page says it so far.
- [P2] Ambae: a shield drawing once a sourced height above the sea floor exists (the page says the outline is simplified).

ocal` when the last page has the look (D-24).

## §6 Log (append-only, newest at bottom)
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

### 2026-11-17 · VOL-013 PELEE · chat · live
- What: pull request 22 merged (merge commit d16dea0) on a green status after one preview; Mount Pelee is live as a record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit (see the entry above); preview looked at in the owner's Chrome (hero, strip, map with tiles and the name over the sea, drawing, status box, the 1902 section and callouts), the other ten rebuilt pages and the France page fetched on it (200, no raw markup, bylines as intended); Vercel build of d16dea0 succeeded; on www.volcanosatlas.com/volcano/pelee in the owner's Chrome: canonical on itself, index/follow, map tiles 6/6, no table scrolling sideways at 1456 px, no raw markup, status box present, no byline (by design).
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: d16dea0 (merged)
- Notes: none.

### 2026-11-17 · VOL-014 ASAMA · chat · done
- What: Mount Asama as a record page at /volcano/asamayama (Asamayama is the Smithsonian's and the agency's name; the title carries both), from the Japan Meteorological Agency's catalogue chapter, its English summary page and its status page for the volcano (Level 1, lowered from 2 on 22 May 2026; commentary of 13 Nov 2026), the Smithsonian's record and NOAA. No template change.
- Files: `data/profiles/asamayama.json`, `scripts/check-render.py`, `research/*.csv`
- Verified: on the final code: tsc clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 12 rebuilt pages ok at 1440 px, phone page without sideways scroll, tiles load; registry check OK (13 verified). Pictures looked at: the whole page at 1440 px and at phone width, the drawing at both widths, the map with real tiles at both widths with the name tried on all four sides (below the marker collides least).
- Unverified: the preview in the owner's Chrome and the live page (next entry); a real phone. The agency's pages were read through a fetch that summarises (the Japanese status page in translation); the catalogue chapter was read twice and the page follows the second, more exact reading.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/asamayama. Deaths of 1783: the agency's 1,151 and NOAA's 1,491 are both on the page. The dammed river is given in the catalogue's own spelling ("Azuma"). The agency's status pages can be read (§4), so Sakurajima can get its alert level too (§5).

### 2026-11-17 · VOL-014 ASAMA · chat · live
- What: pull request 24 merged (merge commit b522b62) on a green status after one preview; Mount Asama is live as a record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit (see the entry above); preview looked at in the owner's Chrome (hero, strip, map with tiles and the name under the marker, drawing, status box, the 1783 section and callouts), the other eleven rebuilt pages and the Japan page fetched on it (200, no raw markup, bylines as intended); Vercel production build of b522b62 READY; on www.volcanosatlas.com/volcano/asamayama in the owner's Chrome: canonical on itself, index/follow, map tiles 6/6, no table scrolling sideways at 1512 px, no raw markup, status box present, no byline (by design), page in the sitemap.
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: b522b62 (merged)
- Notes: the Japan country page still lists the volcano as Asamayama (country pages are not rebuilt yet).

### 2026-11-17 · VOL-015 FONTS · chat · done
- What: the three typefaces of the site's frame (Playfair Display, Source Sans 3, JetBrains Mono) ship with the site instead of being downloaded from Google at every build (owner: "font ok", 2026-11-17 20:18). Variable fonts, Latin subset, from the @fontsource-variable packages (OFL 1.1). `app/layout.tsx` loads them with `next/font/local` under the same three CSS variables; `tailwind.config.ts` names the families through those variables (D-48).
- Files: `app/layout.tsx`, `tailwind.config.ts`, `app/fonts/*`, `public/fonts/OFL-{PlayfairDisplay,SourceSans3,JetBrainsMono}.txt`
- Verified: tsc clean; clean build with no request to Google (build log, built CSS, and a headless run of 5 pages at 1440 and 390 px: the fonts loaded are the three shipped ones, plus Archivo and Caveat on record pages; logo, headings and footer render in them); crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap; render check identical line by line to the run before the change; the Mount Asama page is as tall as before at both widths (8,469 and 14,611 px); home page looked at at both widths.
- Unverified: the preview and the live site in the owner's Chrome (next entry); a real phone.
- Commit: this commit (pushed: work branch)
- Notes: while fonts load, the frame's headings now fall back to a size-matched Times New Roman instead of Georgia (less jump). Preload unchanged: three files on every page (§5).

### 2026-11-17 · VOL-015 FONTS · chat · live
- What: pull request 26 merged (merge commit c911be5) on a green status; the site's frame loads its three typefaces from the site itself.
- Files: none beyond the pull request
- Verified: in the owner's Chrome at 1512 px, the preview against the live site before the merge: page height and the boxes of logo, headline, footer and navigation identical on the home page, the Japan page, an old profile, a hub and Stromboli (3,257 / 13,848 / 3,803 / 6,320 / 8,201 px tall). After the merge: production build of c911be5 green; the live home page gives the same numbers, loads three font files from the site and makes no request to Google; the 404 page shows the mono face.
- Unverified: a real phone.
- Commit: c911be5 (merged)
- Notes: recorded with batch 11 instead of a notebook-only pull request.

### 2026-11-17 · VOL-016 KANLAON · chat · done
- What: Kanlaon as a record page (erupting since October 19, 2024 by the Smithsonian's list), from the Philippine agency's alert-status page (Level 2, read 2026-11-17), four of its bulletins of 2025–2026, the Smithsonian's weekly reports of 2024 and its bulletin on the 1996 deaths, and NOAA. Sakurajima's page gains the alert level in force (Level 3; warning of 27 Jul 2022; commentary of 16 Nov 2026) from the weather agency's status page. No template change. Rabaul and Villarrica deferred with reasons (§5).
- Files: `data/profiles/{kanlaon,aira}.json`, `scripts/check-render.py`, `research/*.csv`
- Verified: on the final code: tsc clean; clean build at the first try; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 13 rebuilt pages ok at 1440 px, phone pages without sideways scroll, tiles load; registry check OK (13 verified). Pictures looked at: Kanlaon's page top and middle at 1440 px, the phone page, the drawing at both widths, the map with real tiles at two zooms and four name positions.
- Unverified: the preview and the live pages in the owner's Chrome (next entry); a real phone. The PHIVOLCS bulletins and the Smithsonian's 1996 bulletin were read as search-result text (their pages could not be fetched); the Japanese status page through a summarising translation.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/kanlaon; /volcano/aira changed (status box, answer, "erupting now"). Kanlaon's page gives no date for the return from Level 3 to Level 2 (not found).

### 2026-11-17 · VOL-016 KANLAON · chat · live
- What: pull request 27 merged (merge commit 8f54de0) on a green status after one preview; Kanlaon is live as a record page and Sakurajima's page shows its alert level.
- Files: none beyond the pull request
- Verified: every gate on the final commit (see the entry above); preview looked at in the owner's Chrome (Kanlaon: hero, strip, map with tiles and the name over the strait, drawing, status box, the 2024 section and callouts; Sakurajima: status box and the new paragraph), the other eleven rebuilt pages and the Philippines and Japan pages fetched on it (200, no raw markup, bylines as intended); production build of 8f54de0 green; on www.volcanosatlas.com in the owner's Chrome: /volcano/kanlaon with canonical on itself, index/follow, map tiles 6/6, no table scrolling sideways at 1512 px, no raw markup, status box, no byline (by design), page in the sitemap, no request to Google for fonts; /volcano/aira with the Level 3 box, the warning date and the commentary date.
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 8f54de0 (merged)
- Notes: the Smithsonian's weekly feed has not been updated since October 15, 2026; the pages say so in the status box.

### 2026-11-17 · VOL-017 BULUSAN · chat · done
- What: Bulusan as a record page (last eruption April 28–29, 2025; Alert Level 1 read 2026-11-17, raised on March 22, 2026), from the Philippine agency's alert-status page, five of its bulletins and its eruption-history table, the Smithsonian's weekly reports and 2006 bulletin, and NOAA. Template: a time that runs to today counts whole months only (D-49), which changes the last table row on the quiet volcanoes' pages by at most one month.
- Files: `data/profiles/bulusan.json`, `lib/eruptions.ts`, `scripts/check-render.py`, `research/*.csv`
- Verified: on the final code: tsc clean, eslint clean on the changed file; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 14 rebuilt pages ok at 1440 px, phone pages without sideways scroll, tiles load; registry check OK (13 verified). Table and headline compared on eight quiet-volcano pages after the change (they agree). Pictures looked at: page top and middle at 1440 px, the phone page, the drawing at both widths, the map with real tiles and the name on four sides.
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone. The PHIVOLCS bulletins and the Smithsonian's report of May 2026 were read as search-result text; the fetched copy of the Smithsonian's page ends in January 2024.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/bulusan. The page gives no date for the return from Level 1 to Level 0 between April 2025 and March 2026 (not found).

### 2026-11-17 · VOL-017 BULUSAN · chat · live
- What: pull request 29 merged (merge commit 224b0b9) on a green status after one preview; Bulusan is live as a record page, and the whole-months rule (D-49) is live on every record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit (see the entry above); preview looked at in the owner's Chrome (hero, strip, map with tiles and the name over the strait, drawing, status box, the "active now" section and callouts), the other thirteen rebuilt pages and the Philippines page fetched on it (200, no raw markup, bylines as intended); production build of 224b0b9 green; on www.volcanosatlas.com/volcano/bulusan in the owner's Chrome: canonical on itself, index/follow, map tiles 9/9, no table scrolling sideways at 1512 px, no raw markup, status box, headline "18 months ago" beside "18 months so far" in the table, no byline (by design), page in the sitemap; on /volcano/asamayama the last table row now reads "7 years 2 months so far".
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 224b0b9 (merged)
- Notes: none.

### 2026-11-17 · VOL-018 AMBAE · chat · done
- What: Ambae as a record page (erupting since November 24, 2025 by the Smithsonian's list; Alert Level 3 raised on February 23, 2026 and still shown on 2026-11-17), from three pages of Vanuatu's geohazards department, three Smithsonian bulletins and its weekly reports on the eruption of 2017–2018, and NOAA. No template change. The drawing is the simple outline rising from the sea: no sourced height above the sea floor was found for a shield drawing, and the caption says the real volcano is a broad shield.
- Files: `data/profiles/ambae.json`, `scripts/check-render.py`, `research/*.csv`
- Verified: on the final code: tsc clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 15 rebuilt pages ok at 1440 px, phone pages without sideways scroll, tiles load; registry check OK (13 verified). Pictures looked at: page top at 1440 px, the drawing at both widths, the map with real tiles and the name on four sides.
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone; the middle and lower parts of the page were checked as text and by the render check, not looked at as pictures. The Smithsonian's bulletins were read as search-result text.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/ambae. There is no country page for Vanuatu among the 46, so the country name is plain text. Ambrym, the next page, shares these sources.

### 2026-11-17 · VOL-018 AMBAE · chat · live
- What: pull request 31 merged (merge commit 40061be) on a green status after one preview; Ambae is live as a record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit (see the entry above); preview looked at in the owner's Chrome (hero, strip, map with tiles and the name over the sea, drawing, status box, the 2017–2018 section and callouts, the NOAA table), the other fourteen rebuilt pages fetched on it (200, no raw markup, bylines as intended); production build of 40061be green; on www.volcanosatlas.com/volcano/ambae in the owner's Chrome: canonical on itself, index/follow, map tiles 6/6, no table scrolling sideways at 1512 px, no raw markup, status box, "11 months" in the headline and "11 months so far" in the table, no byline (by design), page in the sitemap.
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 40061be (merged)
- Notes: correction to the entry above: Vanuatu does have a country page (/volcanoes-in-vanuatu) and the Ambae page links it; the note saying otherwise came from a faulty local check. §6 now has 39 entries: the next entry triggers the move of the oldest 20 to DEVLOG-ARCHIVE.md.

### 2026-11-17 · VOL-019 NYIRAGONGO · chat · done
- What: Nyiragongo as a record page (erupting since May 17, 2002, date uncertain, by the Smithsonian's list), from two Smithsonian bulletins, its page for the volcano with the weekly reports, its Current Eruptions page, three USGS Volcano Watch articles, a study in the USGS catalog and NOAA. Template: a stale weekly feed is no longer called the latest (D-50); an uncertain start date says so in the headline (D-51); the conduit in the land drawing stops at the ground line on a cut band (§4). The 20 oldest entries of this log moved to DEVLOG-ARCHIVE.md.
- Files: `data/profiles/nyiragongo.json`, `app/volcano/[slug]/RecordPage.tsx`, `lib/recordProfile.ts`, `components/record/figures.tsx`, `scripts/check-render.py`, `research/*.csv`, `DEVLOG-ARCHIVE.md`
- Verified: on the final code: tsc clean; eslint clean on the three changed code files; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 16 rebuilt pages ok at 1440 px, phone pages without sideways scroll, map tiles 6/6 on Nyiragongo; registry check OK. Pictures looked at: the page's top and middle at 1440 px, the phone page down to the 2002 section, the drawing at both widths (and Kanlaon's, unchanged), the map with real tiles and the name on four sides. The nine report and article links on the page were fetched and read on 2026-11-17; Kanlaon's status box read on the build ("Weekly report of October 8–14, 2026 … not been updated since October 15, 2026").
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone; the lower third of the page (type, frequency, danger, record) checked as text only. The Goma observatory's own pages were not read: its statements come through the Smithsonian's reports, and the newest report read is for July 3–9, 2024 (the reader's copy of the Smithsonian's page may end before its newest report; the page says it has no later report from the crater).
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/nyiragongo. Ambrym was looked at first and deferred: it needs a caldera drawing (§5).

### 2026-11-17 · VOL-019 NYIRAGONGO · chat · live
- What: pull request 33 merged (merge commit e056c53) on a green status after two previews; Nyiragongo is live as a record page, and the wording for a stale weekly feed is live on every record page. Before the merge every source link was fetched and read again with pointed questions, and the text was rewritten on those readings (second commit c061a30 fixed one answer's wording).
- Files: none beyond the pull request
- Verified: every gate on the final commit c061a30 (tsc, clean build, crawl 1,212 pages all 200 with 0 broken links and 213 indexable = sitemap, render check 16 pages ok, registry check OK); both previews looked at in the owner's Chrome (hero, strip, map with tiles 6/6 and the name above the mark, drawing, the 2021 section with its callouts, type, frequency, danger with the NOAA table, questions; Kanlaon's status box with the new wording); the other fifteen rebuilt pages fetched on the preview (200, no raw markup, bylines on Stromboli and Mauna Loa only); production build of e056c53 READY; on www.volcanosatlas.com/volcano/nyiragongo in the owner's Chrome: canonical on itself, index/follow, map tiles 6/6, no table wider than its box at 1512 px, no raw markup, "24 years" in the headline and "24 years so far" in the table, "(date uncertain)" in headline and key facts, link to /volcanoes-in-dr-congo, no byline (by design), page in the sitemap; live on Stromboli, Kilauea, Sakurajima and Kanlaon: "Weekly report of …", and "Latest weekly report" on none of the sixteen.
- Unverified: a real phone (phone width checked in headless Chrome only); the two dataset DOIs and NOAA's four event links were not opened again this time.
- Commit: e056c53 (merged)
- Notes: corrections made by the second reading are listed in §4 (search-result text is a lead, not a reading). The newest report from the crater that could be read is for July 3–9, 2024; the page says it has no later one.

## §7 History & archive
- 2026-02 · Create Next App scaffold (02-13); first site commit with 150 profiles and 46 country pages (02-26); Vercel config; domain changed from volcanoatlas.com to volcanosatlas.com (02-27); favicon and OG image; analytics, Clarity and Bing verification; sitemap and robots (02-28)
- 2026-03 · ads.txt added (03-16)
- 2026-04 · "A1–A5" rendering fixes: wiki links, bold markup, title suffixes, recent-activity dates, key-facts accessors (04-20 to 04-22); schema components and `SEO-AUDIT-REPORT.md` (04-29)
- 2026-06 · root canonical moved from the vercel.app address to the www homepage — still one canonical for every page; OG image replaced (06-08)
- 2026-11-17 · VOL-001…VOL-009 (20 entries, 2026-11-15 to 2026-11-17) → DEVLOG-ARCHIVE.md · the audit, the first fix wave, the pilot, the record page and its look (Stromboli), Mauna Loa, batch 2 (Mount St. Helens, Mount Erebus), Kilauea, Eyjafjallajokull and the build of Mount Pinatubo
