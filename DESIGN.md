# DESIGN.md — volcanosatlas.com

The look of the site. The owner picks looks from pictures; this file records what he picked and the rules that follow
from it. A page that breaks a rule here is not finished. `DESIGN-SPEC.md` is an older draft and is not in force.

## The pick

- 16 Nov 2026, Stromboli volcano page: **look A, "the record strip", with the animated cut-open volcano from look B.**
- The three looks are on the design canvas "volcanosatlas.com: three looks":
  https://claude.ai/artifact/Ju8LCNp1RwWPEcb1nscaAf
- Not taken: B's atlas-plate page (serif type, plates with figure numbers) and C "the lighthouse" (dusk poster, condensed
  capitals). Don't bring them back as whole looks.

## The idea

A volcano observatory keeps its record on paper: a pen draws a line on a moving strip, and someone marks it up in red
pencil. The page is that strip. The volcano's own record is the picture, the answer to the reader's question is the
biggest thing on the screen, and the red pencil points at what matters.

## Where it applies

- Rebuilt volcano profiles ("record pages"): `app/volcano/[slug]/RecordPage.tsx`, `app/volcano/[slug]/record.css`,
  drawings in `components/record/figures.tsx`.
- Pages that are not rebuilt yet keep the old dark template until their turn. Other page types (country pages, hubs,
  the map) get their own three looks; they share this file's colours, type and never-list.
- On a record page the site header and footer turn to the page's ink colour (done in `record.css`). They get the full
  look when the last pages move over.

## Colours

| Name | Value | Used for |
| --- | --- | --- |
| Page | `#f3f6f1` | background |
| Paper | `#fbfcf9` | the strip, boxes, tables, figures |
| Ink | `#17212b` | text, rules, the drawn line, header and footer |
| Muted | `#4d5d58` | captions, source lines, table headings |
| Rule | `#b9cbbd` and `#dfe8df` | borders, table lines |
| Grid | `#c4d8c9` | grid of the strip chart |
| Eruption red | `#d9482b` | time in eruption, lava, the two callout numbers. Large shapes and large numbers only |
| Red pencil | `#c21f1f` | handwritten notes and the ring around the main number. Nothing else |
| Sea | `#cfe3e6`, label `#2d5560` | water in the section drawing |
| Rock | `#8a8f8c` | the volcano in the section drawing |
| Sea floor | `#c9cfca`, pressed part `#777d7a` | the ground under the sea in a shield drawing, and the part of the volcano pressed into it |

Text on its background is at least 4.5:1 (checked: muted on page 6.4, red pencil on page 5.5). Eruption red on paper is
4.1, so it is never used for small text. Links are ink with an underline.

## Type

- **Archivo** (variable, weights 400 to 800) for everything. Hosted in `public/fonts/`, with a size-matched Arial
  fallback so text does not jump while the font loads. Numbers in tables and callouts use tabular figures.
- **Caveat 700** for red pencil notes only: a few words each, never a sentence the reader needs.
- No third family. The site-wide Playfair and Source Sans stay on old pages only.
- Sizes on a record page: h1 76 px (46 on phones), main number 148 px (104), h2 34 px (27), text 18 px, answer
  paragraph 21 px (19), captions and source lines 14 to 15 px.

## Layout

- Text column 720 px, page width 1140 px. The strip runs edge to edge.
- Order on a wide screen: title and author line, main number beside the answer paragraph, strip, caption, then two
  columns that each pack upward (left: map, "Where is …?", report box, summary; right: cut-open volcano, key facts),
  then the sections. The two columns are not rows: a short part on one side must not leave a hole beside a tall one.
- Order on a phone: title, main number, strip, caption, author line, answer paragraph, map, cut-open volcano, report
  box, key facts, sections. The strip sits right under the number so its line is on screen while it draws.
- The map is the first thing under the strip (owner, 17 Nov 2026: the reader should see the map quickly). Its section
  ("Where is …?") sits with it, ahead of the other sections.
- Side notes (callouts, pencil note) float right of a section on wide screens and follow the section on small ones.
- The status box (left column, under "Where is …?") answers "what is it doing now" from a source with a date: the
  USGS alert level read live for a US volcano; otherwise what the volcano's own observatory showed on the day its page
  was read; plus the weekly report when the volcano is in it.
- On a phone a record of more than 260 years gets a grid line every 50 years and a year every 100. Year labels are
  drawn last, on a paper edge, so a red date tick passes behind them.
- No table scrolls sideways on a desktop: a hidden column reads as a broken page. Cells with a length of time or a
  phrase may break onto a second line (`va-dur`); dates and numbers stay on one line. On a phone a table that still
  does not fit scrolls inside its own box. The page never scrolls sideways.

## The parts of a record page

1. **Main number.** The page's answer in one line and one number. Erupting: "Erupting since February 2, 1934",
   "92 years". Not erupting: "Last eruption ended December 10, 2022", "3 years ago".
2. **Pencil ring and note.** A red ring is drawn around the number, then a handwritten note appears.
3. **The record strip.** Paper strip with sprocket holes. The line is high while the Smithsonian lists an eruption in
   progress and flat in between; a red band under it marks time in eruption. A long eruption is a high stretch with its
   pauses labelled in red pencil. Short eruptions are spikes, the longest quiet gaps carry the label, and the line ends
   flat on the day the data was retrieved.
4. **The map.** A street map toned down to grey, so the red pencil leads: a red ring around the volcano and its name in
   handwriting. No scroll-wheel zoom. On a touch screen one finger scrolls the page, not the map; the map zooms by its
   buttons or a pinch. A link under it opens a larger map. Where the street map prints a label of its own beside the
   marker (Ross Island at Mount Erebus, Catanzaro at Stromboli, Angeles at Mount Pinatubo), the name goes under, over
   or to the left of the marker (`map_label: "below"`, `"above"` or `"left"` in the profile). Left suits a volcano
   with open sea to its west.
5. **The cut-open volcano.** Section drawing with heights to scale, in the shape that fits the volcano. Island cone
   (Stromboli): gas bubbles rise in the conduit and burst at the vent, only while the Smithsonian lists the eruption as
   continuing. Shield (Mauna Loa): three heights in one picture, above the sea, under water and pressed into the sea
   floor. Volcano on land or rising straight from the water (Mount St. Helens, Mount Erebus): sea level at the bottom,
   the land around the volcano as a band, the cone above it, so two heights are to scale; an earlier, higher summit is
   a dashed red outline, a crater is cut to its real depth, and the drawing is made shorter instead of letting the
   cone grow taller than half its base. Summit caldera (Kilauea): the top of the volcano only, cut across the
   collapse pit: rim, caldera floor, the pit's bottom, the lava layers that have refilled it and the tallest lava
   fountain, all to one scale, with the pit's levels written on the rock beside it; the fountain climbs and sinks
   from its vent. Flooded caldera (Santorini, `kind: "lagoon"`): cut across from wall to wall, with the volcano's
   highest point on the rim, the cliffs, the young island in the middle and the deepest water to one scale; the old
   volcano is the pale rock, the young lava shield the dark one, and only the water moves. With `lagoon.edge`
   (Krakatoa) the young cone stands on the far edge of the hollow instead: the remnant of the old island, the hollow
   and the cone are to one scale, lava bursts from the cone's vent while the eruption continues, and the cone's
   earlier, higher top is a dashed red outline. An ice cap is a pale wash of the water colour over the cone, from the height the source gives, and
   carries its name on the ice when it is big enough. A volcano on a high plateau (Cotopaxi, on land 12,300 ft up)
   has the band of land under it cut short with a zigzag break mark, because at one scale the band would be taller
   than the volcano; everything above the land stays to scale, and the caption says the band is cut. Nothing erupts
   in the drawing of a volcano that is not erupting.
6. **Report box.** Left border in ink. Says which weekly report the volcano is in, with the week and the link. For a
   volcano in the United States it also gives the USGS alert level and aviation color code with the notice's date and
   link, read from the USGS service when the page is rendered.
7. **Key facts.** Plain two-column list on paper.
8. **Sections.** One question per h2, answer first, table where there is a record to show.
9. **Callouts.** At most two, ink border, the number in eruption red, source line under it.
10. **Questions and answers, sources, more volcanoes.** Two columns on wide screens.

Every label and position in a drawing comes from the source data (`lib/recordProfile.ts`). A caption says what the
drawing is made from and what is schematic ("heights are to scale; the shape is not surveyed").

## Movement

- One moment: the pen draws the record across the strip (4.2 s, starts 0.3 s after load). Then the red ring is drawn
  around the number (1.1 s, from 4.4 s) and the note appears (5.3 s).
- Quiet background: the pen keeps trembling; bubbles rise and burst in the section drawing (6 s and 1.5 s loops).
- Shield drawing: small waves slide under the sea surface (5 s and 9 s loops), and the sea floor gives way under the
  volcano as the drawing scrolls into view (in browsers without scroll-linked animation it happens once, 0.9 s after
  load).
- CSS and SVG only. No animation library, no script, nothing that moves the layout or delays the main number.
- With "reduce motion" set, everything is shown finished and still.
- Nothing else moves. No fade-in on sections, no hover effects on boxes.

## Never

- Cream page with a serif headline and terracotta accent; near-black with one neon colour; rows of identical rounded
  cards with soft shadows; colour-gradient backgrounds; small capital-letter labels above headings; one coloured word
  in a headline; emoji; arrows after link text.
- Drawn ad spaces or a reserved ad column. Raptive places every ad itself. The text column must stay able to take
  in-text ads.
- Stock photos, or photos without a licence and a credit.
- A drawing, number or label that is not from the page's sources.
- Text under 4.5:1, links without underlines, a main drawing that falls apart at phone width.

## The owner's taste

- Wants: beautiful, memorable, moving pages. Not plain "data utility" pages, and nothing that looks generated.
- Picks by pointing: a letter plus parts of the others.
