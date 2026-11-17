# PRODUCT.md — volcanosatlas.com

What the site is for and what every page has to do. Read with `DESIGN.md` (the look) and `DEVLOG.md` (the state of the work).

## What it is

A reference site about the world's volcanoes for readers in the United States and other English-speaking countries:
one page per volcano, per country and per topic. It is meant to earn from ads placed by Raptive (not applied for yet),
so it lives on search traffic and on being trusted enough to be cited.

When a choice comes up, it is decided in this order: best experience for the reader, most Google search traffic,
highest-authority primary source.

## Who reads it

Someone who typed a question about a volcano into a search box, most often on a phone: when it last erupted, what type
it is, how tall it is, whether it is active, whether it is dangerous. They want the answer in the first screen and the
proof under it. A smaller group wants the full record: every eruption, the deadly ones, the dates.

## What a page promises

1. **The answer first.** The question the page is found for is answered at the top, in a sentence and a number.
2. **Every number has a source the page links to.** Nothing is estimated, rounded up for effect or filled in.
   Missing data is left out or shown as unknown.
3. **Calculated numbers show their calculation** on the same page.
4. **One retrieval per number.** A figure that appears in the text, a table and a drawing comes from the same data file.
5. **Sections follow the questions people really ask,** in the order of demand. No section exists because a template has it.
6. **Something a plain article cannot give:** the volcano's own record drawn as a picture.

## Sources

- Smithsonian Institution, Global Volcanism Program: the volcano list and the eruption record.
- NOAA National Centers for Environmental Information: significant eruptions, deaths, tsunamis.
- The observatory that monitors the volcano (for Italy, INGV; for the United States, the USGS observatories), read on
  its own pages. Where the observatory prints its own summit height, the page uses it and names the Smithsonian's
  figure in the calculation notes.
- US government definitions (USGS, National Park Service) for terms.
- The registry of checked sources is `research/data-sources.csv`. A source that is not in it is not used.

## Voice

Plain and direct, like a knowledgeable person explaining to one reader. "You" and contractions are fine. No hype, no
praise of the site, no advice on safety or travel. US spelling. Feet first, meters in brackets. Dates as "February 2, 1934".

## A page is finished when all four pass

- **Sourcing:** every number and claim traces to a checked primary source, linked from the page.
- **Prose:** no machine-writing habits; reads as written for one reader.
- **Design:** the look in `DESIGN.md`, checked at phone and desktop width.
- **Raptive readiness:** true author line, real dates, honest policy pages, no thin or duplicate page, working on a phone.

The site is finished when every page is. Then it is frozen for three months and reviewed with search numbers.

## What the site is not

- A date is never printed more exactly than the Smithsonian gives it. Its record marks many days as uncertain (only
  the month, or only the year, is known): those print as "May 1910" or "1857", and any length of time worked out from
  them starts with "about".
- How high a volcano stands above the land around it is worked out, not looked up: the summit height minus the median
  height of the land 14 to 16 km away in NOAA's ETOPO 2022 grid. The page says so and shows the method.
- An eruption the Smithsonian lists as continuing is counted from its start to today, in months until two years have
  passed and in years after that, the same way the time since a last eruption is counted. The page names the
  Smithsonian's last update, and for a US volcano the USGS alert box says what the volcano is doing now.
- A figure that changes every few weeks (the number of lava-fountain episodes, a lava level) is printed with the date
  it was true and its source, never as a bare "now".
- Not a monitoring agency. Alert levels and safety decisions belong to the observatories, and pages link to them. A
  page may repeat an observatory's current alert level, word for word, with the notice's date and link; it never works
  one out.
- Not a place for copied text. A rebuilt page states its sources in the site's own words, with a link.
- Not a photo site: no picture goes up without a licence and a credit.

## The author line

A page names its author only after he has read it. The date next to "Reviewed" is the day he did. "Data retrieved" is
the day the data files were downloaded. Neither date changes by itself.
