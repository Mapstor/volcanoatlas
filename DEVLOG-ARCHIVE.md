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

### 2026-11-17 · VOL-020 COLIMA · chat · done
- What: Colima as a record page (last eruption May 11 to July 12, 2019; not erupting), from Mexico's weather service notice of November 17, 2026, two notes of Colima state's civil protection unit, two pages of the University of Colima's volcano center, a Smithsonian bulletin, a weekly issue and its page for the volcano, two papers (the 1913 eruption; frequency and population) and NOAA. No template change.
- Files: `data/profiles/colima.json`, `scripts/check-render.py`, `research/*.csv`
- Verified: on the final code: tsc clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 17 rebuilt pages ok at 1440 px, phone pages without sideways scroll, map tiles 6/6 on Colima; registry check OK. Pictures looked at: the whole page at 1440 px (top, middle, lower part), the drawing at both widths, the map with real tiles and the name on four sides (right chosen), the map on a phone. Every one of the eleven report, note and paper links on the page was fetched and read on 2026-11-17 before the text was written; the build's data checks (`expect`) hold.
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone; the phone page below the map was checked by the render check, not looked at. The civil protection unit's newest note that could be found is of January 2, 2026 (the page says so); CENAPRED could not be read (§4). Years of some 2016–2017 weekly reports were inferred by the reading tool and cross-checked against the list's dates and the center's page.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/colima. Four figures differ between sources and are printed with each source (1913 crater depth, 2015 pyroclastic flow, 2019 explosion counts, summit height).

### 2026-11-17 · VOL-020 COLIMA · chat · live
- What: pull request 35 merged (merge commit 8ed3fb3) on a green status after one preview; Colima is live as a record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit 8b71aa8 (see the entry above); preview looked at in the owner's Chrome (hero, strip, map with tiles 6/6 and the name to the right of the mark, drawing, status box, the 1913 section with its callouts, the height section), the other sixteen rebuilt pages fetched on it (200, no raw markup, bylines on Stromboli and Mauna Loa only), /volcano/fuego and /volcanoes-in-mexico 200 and the country page links Colima; production build of 8ed3fb3 READY; on www.volcanosatlas.com/volcano/colima in the owner's Chrome: canonical on itself, index/follow, map tiles 6/6, no table wider than its box at 1512 px, no raw markup, "7 years ago" in the headline and "7 years 4 months so far" in the table, status box, links to Mexico and to Fuego, no byline (by design), page in the sitemap.
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 8ed3fb3 (merged)
- Notes: none.

### 2026-11-18 · VOL-021 SHISHALDIN · chat · done
- What: Shishaldin as a record page (last eruption July to November 2023; USGS level NORMAL, lowered on November 2, 2026 after more than a year of unrest), from the Alaska Volcano Observatory's page on the volcano, its pages on the eruptions of 2023, 2019–2020 and 1999 and on the unrest of 2025, a notice of August 2024, a paper's abstract and NOAA. No template change. Galeras and Momotombo were tried first and put on hold (§5). Notebook repair: an insertion in VOL-019 had split the last backlog line in two; it is whole again, the blank lines inside §4 and §5 are gone, one consumed backlog line is dropped and the queue line is current.
- Files: `data/profiles/shishaldin.json`, `scripts/check-render.py`, `research/*.csv`, `DEVLOG.md`
- Verified: on the final code: tsc clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 18 rebuilt pages ok at 1440 px, phone pages without sideways scroll, map tiles 6/6 on Shishaldin; registry check OK. Pictures looked at: the page's top and middle at 1440 px, the phone page down to the height section, the drawing at both widths, the map with real tiles and the name on four sides (right chosen). The eight observatory and paper links on the page were fetched and read on 2026-11-17 before the text was written; the build's data checks (`expect`) hold; the live USGS box showed NORMAL / GREEN, notice of November 6, 2026.
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone; the lower third of the desktop page was read as text only. The observatory's own list of past activity needs JavaScript and was not read.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/shishaldin. The observatory's counts of eruptions differ from notice to notice (24, 26 or 28 confirmed): the page prints the one from the notice it cites.

### 2026-11-18 · VOL-021 SHISHALDIN · chat · live
- What: pull request 37 merged (merge commit 41e3931) on a green status after one preview; Shishaldin is live as a record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit fa1a627 (see the entry above); preview looked at in the owner's Chrome (hero, strip, map with tiles 6/6 and the name to the right of the mark, drawing, the live USGS box, the section on the 2023 eruption with its callouts and table), the other seventeen rebuilt pages fetched on it (200, no raw markup, bylines on Stromboli and Mauna Loa only); production build of 41e3931 READY; on www.volcanosatlas.com/volcano/shishaldin in the owner's Chrome: canonical on itself, index/follow, map tiles 6/6, no table wider than its box at 1512 px, no raw markup, "3 years ago" in the headline and "3 years so far" in the table, USGS box NORMAL / GREEN with the notice of November 6, 2026, link to the United States page, no byline (by design), page in the sitemap.
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 41e3931 (merged)
- Notes: none.

### 2026-11-18 · VOL-022 MANAM · chat · done
- What: Manam as a record page (erupting by the list since June 10, 2018; the newest weekly reports of October 2026; the blasts of 2018 and 2019; the evacuation of 2004 and 2005; the 13 deaths of December 3, 1996; a gas study of 2020). New registry row `un-agency-reports` (the migration agency's report page). No template change. Map at zoom 10 so the island shows around the mark.
- Files: `data/profiles/manam.json`, `scripts/check-render.py`, `research/*.csv`, `DEVLOG.md`
- Verified: on the final code: tsc clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 19 rebuilt pages ok at 1440 px, phone pages without sideways scroll, Manam's map tiles 6/6; registry check OK; pictures looked at: page at 1440 and 390 px, map with real tiles at both widths.
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone. The lower half of the desktop page was read as text only.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/manam. How each source was read is in the registry (rows `observatory-pages`, `nasa-earth-observatory`, `paper-abstracts`, `usgov-definitions`, `un-agency-reports`): first-hand for the feed's report of 8–14 Oct 2026, one weekly issue, one bulletin and the bulletins inside the Smithsonian's page; on a site that reprints the Smithsonian's weekly text, checked against the search index's copy of the Smithsonian's page, for 22–28 Aug 2018 and 22–28 Oct 2026. The page cites the Smithsonian for both. Left out because they could not be read: the blasts of 8 Dec 2018 and 8 Mar 2022, and any current alert stage.

### 2026-11-18 · VOL-022 MANAM · chat · live
- What: pull request 39 merged (merge commit 4e34437) on a green status after one preview; Manam is live as a record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit 0e5e78b (see the entry above); preview looked at in the owner's Chrome (hero, strip, map with tiles 9/9 and the island showing around the mark, drawing, weekly box, eruption table, the sections on 2018 and on the deaths, no raw markup, canonical, index and follow, no byline; the 18 other record pages answer 200 with bylines only on Stromboli and Mauna Loa; in the sitemap); merged only inside a check that the status read success for that commit; production build READY for 4e34437; live page checked in Chrome on www.volcanosatlas.com (title, canonical, headline 8 years and the table's "8 years so far", weekly box, map tiles 9/9, country link, sitemap 213 addresses).
- Unverified: a real phone (phone width checked in headless Chrome only).
- Commit: 4e34437 (merged)
- Notes: none.

### 2026-11-18 · VOL-023 FUJI · chat · done
- What: Mount Fuji (/volcano/fujisan) as a record page: quiet since the eruption of 1707 (318 years by the Smithsonian's end date, which it marks as uncertain; Japan's records end it 54 days earlier), the alert level as read on the day, the 1707 eruption day by day and the floods after it, the lava eruption of 864, the hazard map of 2021 and the ashfall guideline of 2025, climbing. Template: D-52; a three-digit headline number set smaller with a unit that stays in one piece; a strip rule for records over 700 years; "before" and "after" with BCE years in the record table. New registry row `gov-japan-fuji`.
- Files: `data/profiles/fujisan.json`, `lib/eruptions.ts`, `lib/recordProfile.ts`, `components/record/figures.tsx`, `app/volcano/[slug]/RecordPage.tsx`, `app/volcano/[slug]/record.css`, `scripts/check-render.py`, `research/*.csv`, `DEVLOG.md`
- Verified: on the final code: tsc clean; eslint clean on the changed files; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 20 rebuilt pages ok at 1440 px, phone pages without sideways scroll, Fuji's map tiles 6/6 (the first run was stopped by its ten-minute limit and was run again in full); registry check OK; the headline measured at 1440, 390, 375, 360 and 320 px on Fuji (one line down to 360) and at three widths on six other pages (unchanged there); pictures looked at: the page's top and middle at 1440 and 390 px, the map with real tiles and the name on each side.
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone. The lower third of the page was read as text and seen at desktop width only.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/fujisan. Every source was fetched and read (the Cabinet Office chapter and the weather agency's catalogue twice; two re-read after the second reading of the text, which changed seven sentences). Sources disagree and the page prints each with its source: the end of the 1707 eruption, its size (VEI 5 and VEI 4), the magma of 864, the count of eruptions in written records. Not read: the Smithsonian's Geological Summary (§5).

### 2026-11-18 · VOL-023 FUJI · chat · done (second commit)
- What: after the preview look in the owner's Chrome, the caption under Fuji's strip was reworded: it repeated the handwritten note above it ("15 eruptions since 781") on a desktop screen. It now reads as one statement that also stands alone on a phone, where the note is not shown.
- Files: `data/profiles/fujisan.json`, `DEVLOG.md`
- Verified: every gate run again on this code: tsc clean; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap; render check: 20 rebuilt pages ok at 1440 px, phone pages without sideways scroll, Fuji's map tiles 6/6; registry check OK. The first commit's preview was looked at in the owner's Chrome before this change (hero, strip, map tiles 6/6, drawing, tables, the 19 other record pages, sitemap).
- Unverified: this commit's preview and the live page (next entry); a real phone.
- Commit: this commit (pushed: work branch)
- Notes: the approval wall is back: a fetch of the Colombian survey's Galeras bulletin was tried after the owner's "Continue from where you left off" and nobody answered the permission request. Galeras, Nevado del Ruiz and Purace keep waiting (§5).

### 2026-11-18 · VOL-023 FUJI · chat · live
- What: pull request 41 merged (merge commit 4ef1152) on a green status after two previews; Mount Fuji is live as a record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit 626c85d (see the two entries above); both previews looked at in the owner's Chrome (hero with "318 years ago" on one line, strip, map tiles 6/6 with the name left of the mark, drawing, status box, tables, the record table's "after 8540 BCE" and "before 6580 BCE", no raw markup, canonical, index and follow, no byline; the 19 other record pages answer 200 with bylines only on Stromboli and Mauna Loa and none takes the smaller headline; in the sitemap); merged only inside a check that the status read success for that commit; production build READY for 4ef1152; live page checked in Chrome on www.volcanosatlas.com (title, canonical, headline, the new caption, status box, map tiles 6/6, both tables, country link both ways, sitemap 213 addresses, five other record pages unchanged).
- Unverified: a real phone (phone widths checked in headless Chrome only).
- Commit: 4ef1152 (merged)
- Notes: none.

### 2026-11-18 · VOL-024 HEKLA · chat · done
- What: Hekla as a record page: quiet since March 8, 2000 (26 years, longer than any gap between its eruptions since 1947), what Iceland's agencies have said about the swelling since then, each with its date, the 2000 eruption and its warning minute by minute, the 23 to 79 minutes of warning in the recorded eruptions, 1947–48, 1104, the hazards and the police warning against hiking. Template: D-53 (month-only and year-only dates in the record table). New registry row `gov-iceland-civil-protection`.
- Files: `data/profiles/hekla.json`, `lib/eruptions.ts`, `scripts/check-render.py`, `research/*.csv`, `DEVLOG.md`
- Verified: on the final code: tsc clean; eslint clean on the changed file; clean build; crawl 1,212 pages all 200, 0 broken links, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 21 rebuilt pages ok at 1440 px, phone pages without sideways scroll, Hekla's map tiles 4/4; registry check OK; the headline measured at three widths; pictures looked at: the page's top and middle at 1440 and 390 px, the strip at both widths, the map with real tiles at three zooms and the name on each side; the record-table change read on seven other rebuilt pages.
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone. The lower third of the page was read as text only.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/hekla. Every source was fetched and read with pointed questions (the Smithsonian's page and the Civil Protection notice twice); a second reading of the text changed eight sentences. The page states no current colour code: the Met Office's map is an image; it gives the date range of the list of changes and says Hekla is not in it. Sources disagree and the page prints each with its source: the lava of 2000, the warning before it, the 1947 plume, Hekla's rank. Needed the owner's approval and was not read: the Catalogue of Icelandic Volcanoes (§5).

### 2026-11-18 · VOL-024 HEKLA · chat · live
- What: pull request 43 merged (merge commit 1021797) on a green status after one preview; Hekla is live as a record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit e1ee73f (see the entry above); preview looked at in the owner's Chrome (hero, strip with its five year marks and four gap labels, map tiles 6/6 with Reykjavik in view and the name right of the mark, drawing, status box, the three tables, callouts, no raw markup, canonical, index and follow, no byline; the 20 other record pages answer 200 with bylines only on Stromboli and Mauna Loa; the record tables of the changed pages read; country link both ways; in the sitemap); merged only inside a check that the status read success for that commit; production build READY for 1021797; live page checked in Chrome on www.volcanosatlas.com (title, canonical, headline, status box, map tiles 6/6, tables, country link both ways, sitemap 213 addresses, six other record pages incl. three with changed table rows).
- Unverified: a real phone (phone widths checked in headless Chrome only).
- Commit: 1021797 (merged)
- Notes: none.

### 2026-11-18 · VOL-025 REVENTADOR · chat · done
- What: Reventador as a record page: erupting since July 27, 2008 on the Smithsonian's list and since 2002 by Ecuador's institute, with the four eruptions the list splits it into; the institute's newest readable statement (2 Sep 2026) and the declared alert level (Orange, declared 27 Mar 2014, still shown on 16 Apr 2026); what the volcano has done since 2002; the 2002 eruption by the clock and its seven hours of warning; the summit's changing height; hazards. No template change. New registry row `gov-ecuador-sngr`. Etna looked at and put on hold (§5).
- Files: `data/profiles/reventador.json`, `scripts/check-render.py`, `research/*.csv`, `DEVLOG.md`
- Verified: tsc clean; clean build; crawl 1,212 pages all 200, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 22 rebuilt pages ok at 1440 px, 0 problems; phone pages without sideways scroll; Reventador's map tiles 6/6; registry check OK (17 rows); the headline measured at three widths; pictures looked at: the page's top and middle at 1440 and 390 px, the strip and the drawing at both widths, the map with real tiles at two zooms and the name on three sides (zoom 7, name below).
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone. The lower half of the page was read as text only.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/reventador. Every source was fetched and read with pointed questions (Hall 2004, Naranjo 2016 and the institute's field note twice, the Eos article three times); the second reading of the text changed seven sentences, one of them a general remark the draft had pinned on Reventador. Dated honestly, not current: the newest institute statement read is of 2 Sep 2026 and the newest alert report of 16 Apr 2026 (§5). Sources disagree and the page prints each with its source: when the eruption began, the number of pyroclastic flows in 2002, the ash depth in Quito, the summit heights, the count of eruptions. Not read: NASA's page on the 2002 ash (needed the owner's approval), the Smithsonian's bulletin of November 2002 (address failed).

### 2026-11-18 · VOL-025 REVENTADOR · chat · live
- What: pull request 45 merged (merge commit 9bccc6f) on a green status after one preview; Reventador is live as a record page.
- Files: none beyond the pull request
- Verified: every gate on the final commit 77079a8 (see the entry above); preview looked at in the owner's Chrome (hero, strip, map tiles 6/6 with Quito in view and the name below the mark, drawing, status box, the three tables with 7, 1 and 26 rows, callouts, no raw markup, canonical, index and follow, no byline; the 21 other record pages answer 200 with bylines only on Stromboli and Mauna Loa; country link both ways; in the sitemap); merged only inside a check that the status read success for that commit; production build READY for 9bccc6f; live page checked in Chrome on www.volcanosatlas.com (title, canonical, headline, status box, map tiles 6/6, tables, country link both ways, sitemap 213 addresses, six other record pages).
- Unverified: a real phone (phone widths checked in headless Chrome only).
- Commit: 9bccc6f (merged)
- Notes: none.

### 2026-11-18 · VOL-026 FERNANDINA · chat · done
- What: Fernandina (Galápagos) as a record page: last eruption March 2 to May 8, 2024 in the institute's own numbers; what the institute has reported since (the swarm and uplift of November 2025, nothing newer on its list); the 1968 caldera collapse by the day, with the caldera drawn to scale; what eruptions have done to the island's animals; height, type, frequency. Template: D-54 (crater depth to scale down to 60% of the height) and D-55 (a "before <year>" eruption without an end is a spike). Both correct drawings on live pages: Pinatubo's caldera and Nyiragongo's strip. New registry row `gov-ecuador-galapagos-park`.
- Files: `data/profiles/fernandina.json`, `components/record/figures.tsx`, `scripts/check-render.py`, `research/*.csv`, `DEVLOG.md`
- Verified: tsc clean; eslint clean on the changed file; clean build; crawl 1,212 pages all 200, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 23 rebuilt pages ok at 1440 px, 0 problems; phone pages without sideways scroll; Fernandina's map tiles loaded; registry check OK (18 rows); the headline measured at three widths; pictures looked at: the page's top and middle at 1440 and 390 px, the strip and the drawing at both widths, the map with real tiles at four zooms and two name positions (zoom 8, name left), Nyiragongo's strip before and after, Pinatubo's drawing at both widths.
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone. The lower third of the page was read as text only.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/fernandina. Every source was fetched and read with pointed questions (the institute's final report on 2024 twice, the Smithsonian's page in both halves). The newest institute report is a year old (26 Nov 2025) and the page says so. Not on the page because the Smithsonian's bulletins would not open: the island's width, the 1988 avalanche, the note on the name La Cumbre (§5). The caldera depth drawn (850 m) is NASA's figure of 2002.

### 2026-11-18 · VOL-026 FERNANDINA · chat · live
- What: pull request 47 merged (merge commit 77ecf93) on a green status after one preview; Fernandina is live as a record page, and the corrected drawings are live on Nyiragongo and Pinatubo.
- Files: none beyond the pull request
- Verified: every gate on the final commit b8984b8 (see the entry above); preview looked at in the owner's Chrome (Fernandina: hero, map tiles 6/6 with the island and Isabela in view and the name left of the mark, drawing with the caldera, status box, the two tables with 8 and 33 rows, callouts, no raw markup, canonical, index and follow, no byline; the 22 other record pages answer 200 with bylines only on Stromboli and Mauna Loa; country link both ways; in the sitemap; Nyiragongo's strip with spikes at its left end and two long stretches; Pinatubo's drawing); merged only inside a check that the status read success for that commit; production build READY for 77ecf93; live checked in Chrome on www.volcanosatlas.com (Fernandina: title, canonical, headline, status box, map tiles 6/6, tables, country link both ways, sitemap 213 addresses; Nyiragongo's strip has two wide bars, 1928–1977 and 2002 on; six other record pages).
- Unverified: a real phone (phone widths checked in headless Chrome only).
- Commit: 77ecf93 (merged)
- Notes: Nyiragongo's strip showed the invented 1880–1891 stretch on the live site from 2026-11-17 until this merge.

### 2026-11-18 · VOL-027 EL CHICHON · chat · done
- What: El Chichón (Mexico) as a record page: the week of March 28 to April 4, 1982 by the day; every death count with its source; why nobody was warned; the sulfur cloud and the climate in measured numbers; the unrest since June 2025 and the alert level, each with the date of its statement; the crater lake; height, type, frequency. Template: D-56 (a questioned year stays questioned in the record table; "archaeology or oral accounts"; NOAA's death total with a thousands separator): it changes cells in the record tables of Kilauea, Ambae, Arenal and Mount Asama. No periods table on this page (it would have one row). New registry row `gov-mexico-civil-protection`. §0–§5 tidied: the upkeep notes for Kilauea, Pelee, Asama, Sakurajima and Kanlaon are folded into the one "Dated statements" line in §5.
- Files: `data/profiles/chichon-el.json`, `lib/eruptions.ts`, `lib/recordProfile.ts`, `scripts/check-render.py`, `research/*.csv`, `DEVLOG.md`
- Verified: tsc clean; eslint clean on the two changed files; clean build; crawl 1,212 pages all 200, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD; render check: 24 rebuilt pages ok at 1440 px, 0 problems; phone pages without sideways scroll; El Chichón's map tiles loaded; registry check OK (19 rows); pictures looked at: the page's top at 1440 and 390 px, the strip and the drawing at both widths, the map with real tiles at zooms 7 and 8 (zoom 7, name right of the mark); the whole rendered text read against the notes; the record tables of Kilauea, Ambae and Arenal read after the label change.
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone. Below the first screens the page was read as text only.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/chichon-el. Every source was fetched and read with pointed questions, the long ones twice. The newest statement of the alert level that could be read is eleven months old (18 Dec 2025) and the page says so; CENAPRED and www.gob.mx cannot be read, and two Chiapas communiqués of 2026 need the owner's approval (§5). Where sources disagree the page prints each with its source: the death toll, the soldiers killed at Francisco León (3 or 32), the crater's depth (300, 230 or 200 m), the height lost in 1982, the cooling, and the alert phase in a UNAM article (Phase 2). Dropped from the old page for want of a source: "more sulfur dioxide than any eruption since Krakatau", "virtually all 1,000 residents" of Francisco León killed (the Smithsonian's bulletin of June 1982 says otherwise), 40,000–50,000 people within 15 km, a 1,260 m summit before 1982, the Maya link, the meaning of the name. The seismological service's count of the 2025 swarm (613 events) was seen only as search-result text and is not printed.

### 2026-11-18 · VOL-027 EL CHICHON · chat · live
- What: pull request 49 merged (merge commit ee92f25) on a green status after one preview; El Chichón is live as a record page, and the record tables of Kilauea, Ambae, Arenal and Mount Asama carry the corrected labels (D-56).
- Files: none beyond the pull request
- Verified: every gate on the final commit a8ad5fd (see the entry above); preview looked at in the owner's Chrome (El Chichón: hero, strip, map tiles 6/6 with the name right of the mark, drawing with the 1982 crater, status box, the NOAA table with 4 rows and the record table with 13, "1850 (uncertain)", no raw markup, canonical, index and follow, no byline; the 23 other record pages answer 200 with bylines only on Stromboli and Mauna Loa; country link both ways; in the sitemap; Kilauea's 1820 and Ambae's 1870 marked uncertain); merged only inside a check that the status read success for that commit; production build READY for ee92f25; live checked in Chrome on www.volcanosatlas.com (El Chichón: title, canonical, headline, status box, map tiles 6/6, both tables, NOAA's total printed as 1,913, country link both ways, sitemap 213 addresses; Kilauea, Ambae, Arenal and Mount Asama with the new labels; Stromboli, Reventador and Fernandina answer 200).
- Unverified: a real phone (phone widths checked in headless Chrome only).
- Commit: ee92f25 (merged)
- Notes: §6 now holds 38 entries: the next batch moves the oldest 20 to DEVLOG-ARCHIVE.md before it adds its own (the limit is 40).

### 2026-11-18 · VOL-028 PICO DE ORIZABA · chat · done
- What: Pico de Orizaba (Mexico) as a record page: when it last erupted, with every answer and its source (1846, 1687, between 1600 and 1700, 1545); the four published heights; what scientists said in 2025 and 2026, the "waking up" remark and the statements after it, each dated; the glacier in measured numbers; hazards; type and frequency. Template: D-57 (a last eruption the list gives by year only; loosely dated ends drawn as blocks on the strip; "(uncertain)" on a questioned largest eruption) and D-58 (era only before the year 1000 in the record table: 89 cells on 17 pages lose "CE", Kilauea's "before 450" gains it). Found on the way: a React hydration bug that touches every record page under load (§5, P1; `scripts/check-hydration.py` measures it). Housekeeping: the oldest 20 §6 entries moved to DEVLOG-ARCHIVE.md (§7).
- Files: `data/profiles/orizaba-pico-de.json`, `lib/eruptions.ts`, `lib/recordProfile.ts`, `components/record/figures.tsx`, `app/volcano/[slug]/RecordPage.tsx`, `scripts/check-render.py`, `scripts/check-hydration.py` (new), `research/*.csv`, `DEVLOG.md`, `DEVLOG-ARCHIVE.md`
- Verified: tsc clean; eslint clean on the four changed files; clean build; crawl 1,212 pages all 200, 213 indexable = sitemap, no duplicate titles, no invalid JSON-LD, on a fresh server that carried the new build id; render check: 25 rebuilt pages ok at 1440 px, 0 PROBLEM; phone width: overflow 0 on every page in the list, map tiles loaded (Pico de Orizaba 6 of 6) (a first run, made while a type check was running, showed React error 418 once, on Mount Pelee: the hydration bug now in §5, brought out on purpose on four pages, two of them untouched by this batch); registry check OK (19 rows); pictures looked at: the page's top at 1440 and 390 px, the strip and the drawing at both widths, the map with real tiles (zoom 7); the strips of Sakurajima, Cotopaxi, Mount Pelee and Mount Fuji before and after the block rule (Sakurajima's 1779 eruption is now a block, the others look the same); every record table compared row by row before and after D-58 (90 changed rows, all of the two intended kinds); the whole rendered text read against the notes twice.
- Unverified: the preview and the live page in the owner's Chrome (next entry); a real phone. Below the first screens the page was read as text only.
- Commit: this commit (pushed: work branch)
- Notes: for the owner to read: /volcano/orizaba-pico-de. No page states an alert level for this volcano and the page says so; its newest dated statement is Gaceta UNAM's of 8 Jan 2026. Where sources disagree the page prints each with its source: the last eruption, the height, how many glaciers Mexico has left, fumaroles at the summit. Corrected on re-reading the sources: the rockfall report of 2020 rules out an earthquake, not volcanic activity in so many words; "active volcano in a state of rest" is a headline, not a scientist's sentence; the count of three glaciers is the gazette's wording. Dropped from the old page for want of a source: climbing details, "third-highest peak in North America", the legends, city populations. Not cited because unreadable: CENAPRED's statement of April 2025 (www.gob.mx) and De la Cruz-Reyna and Carrasco-Núñez 2002 (sciencedirect). The 2026 paper was read only to its first 100,000 characters.

### 2026-11-18 · VOL-028 PICO DE ORIZABA · chat · live
- What: pull request 51 merged (merge commit da69f69) on a green status after one preview; Pico de Orizaba is live as a record page; the record tables of 17 live pages print their years by the new rule (D-58) and Sakurajima's strip shows the eruption of 1779 to 1781 as a block (D-57).
- Files: none beyond the pull request
- Verified: every gate on the final commit 51700e7 (see the entry above); preview looked at in the owner's Chrome (Pico de Orizaba: hero "Last eruption on record: 1846" with 180 years, strip with its mark, map tiles 6/6, drawing, status box, key fact "VEI 5 (uncertain)", record table 23 rows, no raw markup, canonical, index and follow, no byline; all 25 record pages answer 200 with bylines only on Stromboli and Mauna Loa, no year from 1000 on carries "CE", Kilauea reads "before 450 CE", no hidden block in any page's HTML; country link both ways; sitemap 213); merged only inside a check that the status read success for that commit; production build READY for da69f69; live checked in Chrome on www.volcanosatlas.com (the same list: title, canonical, hero, status box, tiles 6/6, 23 rows, all 25 pages 200, bylines on two, sitemap 213 addresses).
- Unverified: a real phone (phone widths checked in headless Chrome only). The hydration bug (§5) was not measured on the live site.
- Commit: da69f69 (merged)
- Notes: §6 holds 20 entries after this one.
