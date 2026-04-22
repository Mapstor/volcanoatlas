# VolcanoAtlas — Roadmap Notes

## A5.1 — Eruption Timeline Unknown Values

**Issue**: 7 content files contain literal 'Unknown' strings in eruption timeline data arrays:
- volcano-tungurahua.json: 'deaths': 'Unknown' 
- volcano-soufriere-st-vincent.json: 2x 'Unknown'
- volcano-agua-de-pau.json: 'deaths': 'Unknown'  
- volcano-tambora.json: 1x 'Unknown'
- volcano-tinakula.json: 3x 'Unknown'
- volcano-krakatau.json: 2x 'Unknown'
- volcano-santorini.json: 1x 'Unknown'

**Scope**: These appear in eruption timeline arrays, not key_facts_box data that feeds VolcanoDataSections.

**Fix Strategy**: Migration script to null out 'Unknown' strings in eruption data, update timeline rendering components to handle null gracefully.

**Priority**: Low (affects historical data display, not main volcano profile pages)

