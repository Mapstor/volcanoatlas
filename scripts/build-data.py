"""Slim the raw downloads from scripts/fetch-sources.py into the files the site reads at build time.

    python3 scripts/fetch-sources.py
    python3 scripts/build-data.py

Writes gvp-volcanoes.json (the Holocene volcano list), gvp-eruptions.json (every Holocene eruption, grouped by
Smithsonian volcano number) and noaa-volcano-events.json (NOAA significant eruptions, grouped the same way). Field names are shortened; nothing is
recalculated or filled in. The Smithsonian database version is typed here because the service does not report it:
check https://volcano.si.edu/gvp_votw.cfm when you refresh.
"""
import json
import os
import sys

RAW = sys.argv[1] if len(sys.argv) > 1 else 'data/sources-raw'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'data/sources'
GVP_VERSION = {'version': '5.4.0', 'version_date': '2026-08-07'}

manifest = json.load(open(os.path.join(RAW, 'manifest.json')))
retrieved = manifest['retrieved'][:10]
os.makedirs(OUT, exist_ok=True)

volcanoes = {}
for f in json.load(open(os.path.join(RAW, 'gvp-volcanoes.json'), encoding='utf-8'))['features']:
    p = f['properties']
    volcanoes[str(p['Volcano_Number'])] = {
        'name': p['Volcano_Name'], 'country': p['Country'], 'region': p.get('Region'), 'type': p.get('Primary_Volcano_Type'),
        'elevation': p.get('Elevation'), 'lat': p['Latitude'], 'lon': p['Longitude'], 'rock': p.get('Major_Rock_Type'),
        'setting': p.get('Tectonic_Setting'), 'last': p.get('Last_Eruption_Year'),
    }
json.dump({'source': 'Global Volcanism Program, Smithsonian Institution. Volcanoes of the World.', **GVP_VERSION, 'retrieved': retrieved,
           'count': len(volcanoes), 'volcanoes': volcanoes}, open(os.path.join(OUT, 'gvp-volcanoes.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

eruptions = {}
for f in json.load(open(os.path.join(RAW, 'gvp-eruptions.json'), encoding='utf-8'))['features']:
    p = f['properties']
    eruptions.setdefault(str(p['Volcano_Number']), []).append({
        'n': p['Eruption_Number'],
        'confirmed': p['Activity_Type'] == 'Confirmed Eruption',
        'vei': p['ExplosivityIndexMax'], 'veiq': p.get('ExplosivityIndexModifier'),
        'sy': p['StartDateYear'], 'sm': p.get('StartDateMonth') or 0, 'sd': p.get('StartDateDay') or 0,
        'smod': p.get('StartDateYearModifier'), 'sunc': p.get('StartDateYearUncertainty'),
        # how sure the day is: a modifier (?, <, >) and an uncertainty in days (182 = only the year is known, 15 = only the month)
        'sdmod': p.get('StartDateDayModifier'), 'sdunc': p.get('StartDateDayUncertainty'),
        'ey': p.get('EndDateYear'), 'em': p.get('EndDateMonth') or 0, 'ed': p.get('EndDateDay') or 0,
        'emod': p.get('EndDateYearModifier'),
        'edmod': p.get('EndDateDayModifier'), 'edunc': p.get('EndDateDayUncertainty'),
        'method': p.get('StartEvidenceMethod'), 'area': p.get('ActivityArea'),
    })
for rows in eruptions.values():
    rows.sort(key=lambda e: (e['sy'] if e['sy'] is not None else -99999, e['sm'], e['sd']))
n = sum(len(v) for v in eruptions.values())
json.dump({'source': 'Global Volcanism Program, Smithsonian Institution. Volcanoes of the World.', **GVP_VERSION, 'retrieved': retrieved,
           'count': n, 'eruptions': eruptions}, open(os.path.join(OUT, 'gvp-eruptions.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

events = {}
for i in json.load(open(os.path.join(RAW, 'noaa-volcano-events.json'))):
    num = i.get('volcanoLocationNewNum')
    if not num:
        continue
    events.setdefault(str(num), []).append({
        'id': i['id'], 'y': i['year'], 'm': i.get('month') or 0, 'd': i.get('day') or 0, 'vei': i.get('vei'),
        'deaths': i.get('deathsTotal') or 0, 'injuries': i.get('injuriesTotal') or 0, 'tsunami': bool(i.get('tsunamiEventId')),
    })
for rows in events.values():
    rows.sort(key=lambda e: (e['y'], e['m'], e['d']))
m = sum(len(v) for v in events.values())
json.dump({'source': 'NOAA NCEI/WDS Global Significant Volcanic Eruptions Database, doi:10.7289/V5JW8BSH', 'retrieved': retrieved, 'count': m,
           'events': events}, open(os.path.join(OUT, 'noaa-volcano-events.json'), 'w'), separators=(',', ':'))
print('volcanoes', len(volcanoes), '| eruptions', n, 'for', len(eruptions), 'volcanoes | NOAA events', m, 'for', len(events), 'volcanoes | retrieved', retrieved)
