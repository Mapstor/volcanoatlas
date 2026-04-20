# VolcanoAtlas Development Roadmap Notes

## A3.1 — Page-specific social tags missing

Currently, all pages use the root metadata defaults for Open Graph and Twitter Card titles/descriptions instead of page-specific metadata. For example, visiting `/volcano/krakatau` shows `og:title: "VolcanoAtlas — Every Volcano on Earth"` instead of the volcano-specific title. This means social media shares will always show the generic site title rather than the specific volcano, country, or topic being shared. The fix requires updating the generateMetadata functions to explicitly set openGraph.title and twitter.title to match the page title, and similarly for descriptions. This affects all dynamic pages (volcanoes, countries, topics) but not static pages which already have inline metadata.

## A4.1 — Ongoing eruption detection

**Issue**: Continuous-eruption volcanoes like Sakurajima show "This year" or recent year count in the Recent Activity field, but the profile's secondary text field (hero.last_eruption) has the "ongoing" flag that provides more context.

**Example**: Sakurajima with Last_Eruption_Year: 2025 shows "This year" but hero.last_eruption might say "2025 (ongoing)" which is more informative.

**Enhancement**: A future ticket could surface the ongoing status from hero.last_eruption when available, showing "Ongoing (2025)" instead of just "This year".