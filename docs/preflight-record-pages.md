# Record pages: check before the template is used for many pages

Written 2026-11-17, before the third rebuilt volcano page. Google does not object to pages built from a template; it
objects to many pages that add nothing of their own. These six questions were answered for the record-page template
(`app/volcano/[slug]/RecordPage.tsx`). They are asked again if the template changes shape.

1. **What does each page have that no other page has?** The volcano's own eruption record from the Smithsonian, its
   own NOAA events, its heights, and the numbers worked out from them (time since the last eruption, gaps between
   eruptions, counts by size). The strip chart and the section drawing are drawn from that record, so no two pages
   show the same picture.
2. **Could a generic text produce the page?** No, as long as the prose is written per volcano. The questions, their
   order and the facts from the observatory's own pages differ from page to page (Stromboli: a 92-year eruption;
   Mauna Loa: three ways to measure its height). No sentence template is shared between pages. Watch for prose that
   starts to repeat from page to page: that is the first sign of trouble.
3. **Does the page answer what its readers ask?** Sections follow the searches that already reach that page, answer
   first. A section is left out when the volcano has nothing to say under it.
4. **Is every claim checked or left out?** Numbers come from data files through tokens; an unknown token stops the
   build. A typed sentence that leans on a data value has a line in the profile's `expect` block. Facts from
   observatory pages carry a source mark and the day they were read.
5. **Is a page a variant of another page?** One address per volcano. No year, "best of" or place-name variants.
   Volcano pages without a written profile stay out of the index.
6. **What can it do that a plain article cannot?** The record drawn as a strip, a section drawing to scale, the
   current weekly-report entry and, for US volcanoes, the USGS alert level read live.

Result: no stop. A volcano with too little sourced material for its own questions does not get a record page; it stays
a database page.

## Order of the next pages

By the search demand the site already has (the owner's exports; the figures stay out of this repository): Mauna Loa
first, because it is not erupting and the template needed that case, then Krakatau, Aira, Kilauea, Cotopaxi,
Eyjafjallajokull, Erebus, Arenal, Pinatubo, followed by the remaining first-tier pages (Popocatepetl, Nevado del Ruiz,
Taal, Whakaari / White Island).
