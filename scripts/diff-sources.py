#!/usr/bin/env python3
"""What changed in data/sources/ between two retrievals, volcano by volcano.

Run it at a data refresh, before building anything:

    cp -r data/sources /tmp/sources-before          # before scripts/build-data.py overwrites the files
    python3 -I scripts/fetch-sources.py && python3 -I scripts/build-data.py
    python3 -I scripts/diff-sources.py /tmp/sources-before data/sources data/profiles [all]

It prints the eruption rows that were added, removed or changed, the volcano records that changed and the NOAA
events that changed, for the volcanoes that have a record page (data/profiles/) or, with "all", for every volcano.
It ends with the list of record pages the refresh touches: read those pages again (scripts/diff-pages.py).
"""
import json
import os
import sys
from collections import Counter

if len(sys.argv) < 4:
    sys.exit(__doc__)
before_dir, after_dir, profiles_dir = sys.argv[1], sys.argv[2], sys.argv[3]
show_all = len(sys.argv) > 4


def load(folder, name):
    with open(os.path.join(folder, name), encoding='utf-8') as handle:
        return json.load(handle)


eb, ea = load(before_dir, 'gvp-eruptions.json'), load(after_dir, 'gvp-eruptions.json')
vb, va = load(before_dir, 'gvp-volcanoes.json'), load(after_dir, 'gvp-volcanoes.json')
nb, na = load(before_dir, 'noaa-volcano-events.json'), load(after_dir, 'noaa-volcano-events.json')

print('Smithsonian version: %s (%s) -> %s (%s)' % (vb.get('version'), vb.get('version_date'), va.get('version'), va.get('version_date')))
print('retrieved: %s -> %s' % (vb.get('retrieved'), va.get('retrieved')))
print('volcanoes %s -> %s | eruptions %s -> %s | NOAA events %s -> %s' % (vb['count'], va['count'], eb['count'], ea['count'], nb['count'], na['count']))

name_of = lambda num: (va['volcanoes'].get(num) or vb['volcanoes'].get(num) or {}).get('name', '?')
print('volcanoes dropped from the list:', sorted(name_of(n) for n in set(vb['volcanoes']) - set(va['volcanoes'])) or 'none')
print('volcanoes added to the list:', sorted(name_of(n) for n in set(va['volcanoes']) - set(vb['volcanoes'])) or 'none')

# country counts: record pages print "one of N volcanoes in <country>"
cb = Counter(v.get('country') for v in vb['volcanoes'].values())
ca = Counter(v.get('country') for v in va['volcanoes'].values())
moved = {c: (cb.get(c, 0), ca.get(c, 0)) for c in set(cb) | set(ca) if cb.get(c, 0) != ca.get(c, 0)}
print('country counts that changed:', moved or 'none')

# the continuing list: Stromboli's page counts it
cont = lambda data: {(num, row['sy'], row['sm']) for num, rows in data['eruptions'].items() for row in rows if row.get('emod') == '>'}
kb, ka = cont(eb), cont(ea)
print('continuing eruptions: %d -> %d | joined: %s | left: %s' % (len(kb), len(ka), sorted(name_of(n) for n, _, _ in ka - kb), sorted(name_of(n) for n, _, _ in kb - ka)))

# dating methods: a new name needs reader words in METHOD_LABEL (lib/eruptions.ts), or the build stops
methods = lambda data: {row.get('method') for rows in data['eruptions'].values() for row in rows if row.get('method')}
print('dating methods new in this retrieval:', sorted(methods(ea) - methods(eb)) or 'none', '| gone:', sorted(methods(eb) - methods(ea)) or 'none')

live = {}
for name in sorted(os.listdir(profiles_dir)):
    with open(os.path.join(profiles_dir, name), encoding='utf-8') as handle:
        profile = json.load(handle)
    live[str(profile['volcano_number'])] = profile['slug']


def show(row):
    start = '%s-%02d-%02d' % (row['sy'], row['sm'], row['sd'])
    end = '%s-%02d-%02d' % (row['ey'], row['em'], row['ed']) if row.get('ey') else '-'
    return '#%s %s%s -> %s%s vei=%s%s confirmed=%s method=%s' % (
        row['n'], start, row.get('smod') or '', end, row.get('emod') or '', row['vei'], row.get('veiq') or '', row['confirmed'], row.get('method'))


VOLCANO_FIELDS = ('name', 'country', 'type', 'elevation', 'lat', 'lon', 'rock', 'last', 'region')
touched, changed = [], 0
for num in sorted(set(eb['eruptions']) | set(ea['eruptions']) | set(vb['volcanoes']) | set(va['volcanoes'])):
    rows_b = {row['n']: row for row in eb['eruptions'].get(num, [])}
    rows_a = {row['n']: row for row in ea['eruptions'].get(num, [])}
    added = [rows_a[k] for k in rows_a if k not in rows_b]
    removed = [rows_b[k] for k in rows_b if k not in rows_a]
    modified = [(rows_b[k], rows_a[k]) for k in rows_a if k in rows_b and rows_b[k] != rows_a[k]]
    rec_b, rec_a = vb['volcanoes'].get(num, {}), va['volcanoes'].get(num, {})
    record = {f: (rec_b.get(f), rec_a.get(f)) for f in VOLCANO_FIELDS if rec_b.get(f) != rec_a.get(f)}
    ev_b = nb['events'].get(num, []) if isinstance(nb['events'], dict) else []
    ev_a = na['events'].get(num, []) if isinstance(na['events'], dict) else []
    if not (added or removed or modified or record or ev_b != ev_a):
        continue
    changed += 1
    if num not in live and not show_all:
        continue
    print('\n== %s %s%s' % (num, name_of(num), ' (record page: %s)' % live[num] if num in live else ''))
    for row in added:
        print('  + ', show(row))
    for row in removed:
        print('  - ', show(row))
    for old, new in modified:
        print('  ~ ', show(old), '=>', {f: (old.get(f), new.get(f)) for f in new if old.get(f) != new.get(f)})
    if record:
        print('  volcano record:', record)
    if ev_b != ev_a:
        print('  NOAA events: added', [e for e in ev_a if e not in ev_b], 'removed', [e for e in ev_b if e not in ev_a])
    if num in live:
        touched.append(live[num])

print('\nvolcanoes with any change: %d | record pages touched: %d %s' % (changed, len(touched), touched))
print('record pages untouched:', sorted(set(live.values()) - set(touched)))
