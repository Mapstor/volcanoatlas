# DEVLOG archive — volcanosatlas.com
> Entries moved verbatim from DEVLOG.md §6, oldest first. Append-only: nothing here is edited.

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

