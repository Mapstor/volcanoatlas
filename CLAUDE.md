# VolcanoAtlas — instructions for Claude sessions

Site: https://www.volcanosatlas.com — Next.js App Router, static pages built from `data/content/*.json` and the
Smithsonian export in `volcanoes.json`.

## DEVLOG — mandatory
- Before any work: read DEVLOG.md §0–§5 + the last 10 §6 entries.
- After any task that changes files, data, config, deps or a decision: update DEVLOG.md per .claude/skills/devlog/SKILL.md and commit it with the work. Push only work branches; the owner merges.
- `done` only with verification that actually ran; skipped tests and UI behaviour = unverified. No secrets in DEVLOG.md.

Merging follows the devlog skill (section 2, step 4). The owner's standing rule since 2026-11: a session may merge its
own pull request once every check passed and it has looked at the changed pages in the owner's Chrome; it then confirms
the production build and checks the live page, and reverts if either is wrong. Without that browser check the pull
request waits for the owner. The devlog skill lives in the owner's Claude account, not in this repository.

## Rules that are specific to this site
- Every number on a page traces to a source the page links to. Nothing is estimated, derived from a hardcoded list or
  generated at random. Missing data is left out or shown as "Unknown".
- Canonical and Open Graph tags come from `pageMeta()` in `lib/site.ts`, per page. Never set a canonical in the root
  metadata (`app/metadata.ts`): every page inherits it.
- Internal links go through `lib/routes.ts`. A link is rendered only when its target exists.
- Structured data goes through `components/JsonLd.tsx` (plain server `<script>`), and only describes what the page
  visibly shows.
- A rebuilt volcano profile is `data/profiles/<slug>.json` (text with {tokens}) plus `data/sources/` (the numbers, through
  `lib/recordProfile.ts`). Never type a number into the text file that a token can supply. A sentence that leans on a
  data value ("each with a tsunami on record") gets a line in the file's `expect` block, so the build stops when the
  data moves. Dates and lengths of time go through `dateText` and `spanBetween` in `lib/eruptions.ts`, which print
  them no more exactly than the record gives them. The look is in DESIGN.md, what a page must do is in PRODUCT.md.
- This repository is public: no secrets, no analytics or search-traffic figures, no private contact details.
- Checks before a pull request: `npx tsc --noEmit` (ignore `lib/textUtils.test.ts`), `rm -rf .next && npx next build`,
  then a full link crawl of the local build. Details in DEVLOG.md §4.
