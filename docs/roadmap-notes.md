# VolcanoAtlas Development Roadmap Notes

## A3.1 — Page-specific social tags missing

Currently, all pages use the root metadata defaults for Open Graph and Twitter Card titles/descriptions instead of page-specific metadata. For example, visiting `/volcano/krakatau` shows `og:title: "VolcanoAtlas — Every Volcano on Earth"` instead of the volcano-specific title. This means social media shares will always show the generic site title rather than the specific volcano, country, or topic being shared. The fix requires updating the generateMetadata functions to explicitly set openGraph.title and twitter.title to match the page title, and similarly for descriptions. This affects all dynamic pages (volcanoes, countries, topics) but not static pages which already have inline metadata.