#!/usr/bin/env python3
"""Height of the land (or depth of the sea floor) around each profiled volcano, from NOAA's ETOPO 2022 grid.

  python3 scripts/fetch-ground.py [raw_dir] [out_dir]
  python3 scripts/fetch-ground.py --only <number>[,<number>...] [raw_dir] [out_dir]

For every volcano that has a profile page (an old profile in data/content or a rebuilt one in data/profiles), a
small window of the 15 arc-second grid is read from NOAA NCEI's data server and kept in
<raw_dir>/etopo/<number>.json (not committed). With --only, just the named volcanoes are read and their rows are
added to the existing file; every other row and the file's own retrieval date stay as they are, and each added
row carries the day it was read. From the window the script works out, on a ring 14 to 16 km from the summit
coordinates:

  land_m      median height of the ring's cells above sea level
  sea_floor_m median height of the ring's cells below sea level (negative)
  sea_share   share of the ring that is below sea level
  peak_m      highest cell within 2 km of the coordinates (a check against the listed summit, never printed)

and writes data/sources/etopo-ground.json. The grid's cells are about 460 m wide, so a cell is an average: small
cones and sharp summits come out lower than surveyed. That is why pages print the summit from the Smithsonian or the
observatory and take only the surroundings from this file.
"""
import datetime
import json
import math
import os
import sys
import time
import urllib.request

BASE = 'https://www.ngdc.noaa.gov/thredds/dodsC/global/ETOPO2022/15s/15s_surface_elev_netcdf'
CELL = 1 / 240  # degrees
RING_KM = (14, 16)
HALF_KM = 17.5


def tile_of(lat, lon):
    north = math.floor(lat / 15) * 15 + 15
    west = math.floor(lon / 15) * 15
    name = f"{'N' if north >= 0 else 'S'}{abs(north):02d}{'E' if west >= 0 else 'W'}{abs(west):03d}"
    return name, north - 15, west


def read_window(lat0, lat1, lon0, lon1):
    """Cells whose centres fall in the box, as (lat, lon, z). Reads from as many tiles as the box touches."""
    cells = []
    lat = lat0
    while lat < lat1:
        name, south, _ = tile_of(lat, lon0)
        top = min(lat1, south + 15)
        lon = lon0
        while lon < lon1:
            name, south, west = tile_of(lat, lon)
            right = min(lon1, west + 15)
            i0 = max(0, int((lat - south) / CELL))
            i1 = min(3599, int((top - south) / CELL))
            j0 = max(0, int((lon - west) / CELL))
            j1 = min(3599, int((right - west) / CELL))
            url = f'{BASE}/ETOPO_2022_v1_15s_{name}_surface.nc.ascii?z%5B{i0}:1:{i1}%5D%5B{j0}:1:{j1}%5D'
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'volcanosatlas.com data build'}), timeout=120) as r:
                text = r.read().decode('ascii', 'replace')
            rows = [ln for ln in text.splitlines() if ln.startswith('[')]
            if len(rows) != i1 - i0 + 1:
                raise RuntimeError(f'{name}: expected {i1 - i0 + 1} rows, got {len(rows)}')
            for k, ln in enumerate(rows):
                vals = [float(v) for v in ln.split(',')[1:]]
                if len(vals) != j1 - j0 + 1:
                    raise RuntimeError(f'{name}: row {k} has {len(vals)} values, expected {j1 - j0 + 1}')
                la = south + (i0 + k + 0.5) * CELL
                for m, z in enumerate(vals):
                    cells.append((la, west + (j0 + m + 0.5) * CELL, z))
            time.sleep(0.6)
            lon = right if right > lon else lon1
        lat = top if top > lat else lat1
    return cells


def median(vals):
    s = sorted(vals)
    n = len(s)
    return None if n == 0 else (s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2)


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    args = sys.argv[1:]
    # an unknown option would otherwise be taken as the raw directory and start a full download into a folder of that name
    unknown = [a for a in args if a.startswith('-') and a != '--only']
    if unknown:
        print(__doc__)
        sys.exit(0 if unknown[0] in ('-h', '--help') else 2)
    only = None
    if '--only' in args:
        i = args.index('--only')
        only = sorted(n.strip() for n in args[i + 1].split(',') if n.strip())
        del args[i:i + 2]
    raw_dir = os.path.join(args[0] if len(args) > 0 else os.path.join(root, 'data', 'sources-raw'), 'etopo')
    out_dir = args[1] if len(args) > 1 else os.path.join(root, 'data', 'sources')
    os.makedirs(raw_dir, exist_ok=True)
    gvp = json.load(open(os.path.join(out_dir, 'gvp-volcanoes.json'), encoding='utf-8'))
    volcanoes = gvp.get('volcanoes', gvp)
    # every volcano with a page of its own: the old profiles and the rebuilt ones (a rebuilt page can exist without an old profile)
    numbers = {str(json.load(open(os.path.join(root, 'data', 'content', f), encoding='utf-8'))['volcano_id'])
               for f in os.listdir(os.path.join(root, 'data', 'content')) if f.startswith('volcano-')}
    profiles = os.path.join(root, 'data', 'profiles')
    if os.path.isdir(profiles):
        numbers |= {str(json.load(open(os.path.join(profiles, f), encoding='utf-8'))['volcano_number'])
                    for f in os.listdir(profiles) if f.endswith('.json')}
    out_path = os.path.join(out_dir, 'etopo-ground.json')
    today = datetime.date.today().isoformat()
    existing = None
    if only is not None:
        # add rows to the file as it stands: nothing else is read again, nothing else changes
        existing = json.load(open(out_path, encoding='utf-8'))
        numbers = set(only)
    numbers = sorted(numbers)
    out = {}
    for number in numbers:
        v = volcanoes.get(number)
        if not v or v.get('lat') is None:
            print('skipped (not in the Smithsonian file):', number)
            continue
        lat, lon = v['lat'], v['lon']
        raw_path = os.path.join(raw_dir, f'{number}.json')
        if os.path.exists(raw_path):
            cells = json.load(open(raw_path))['cells']
        else:
            dlat = HALF_KM / 110.57
            dlon = HALF_KM / (111.32 * max(0.05, math.cos(math.radians(lat))))
            if lon - dlon < -180 or lon + dlon > 180:
                print('skipped (window crosses the date line):', number, v['name'])
                continue
            cells = read_window(lat - dlat, lat + dlat, lon - dlon, lon + dlon)
            json.dump({'number': number, 'lat': lat, 'lon': lon, 'cells': cells}, open(raw_path, 'w'))
        ring, near = [], []
        for la, lo, z in cells:
            if z < -90000:
                continue
            km = math.hypot((lo - lon) * 111.32 * math.cos(math.radians(lat)), (la - lat) * 110.57)
            if RING_KM[0] <= km <= RING_KM[1]:
                ring.append(z)
            if km <= 2:
                near.append(z)
        land = [z for z in ring if z > 0]
        sea = [z for z in ring if z <= 0]
        out[number] = {
            'name': v['name'],
            'cells': len(ring),
            'sea_share': round(len(sea) / len(ring), 2) if ring else None,
            'land_m': round(median(land)) if land else None,
            'sea_floor_m': round(median(sea)) if sea else None,
            'peak_m': round(max(near)) if near else None,
        }
        if existing is not None:
            out[number]['retrieved'] = today
        print(number, v['name'], out[number])
    if existing is not None:
        ground = dict(existing['ground'])
        ground.update(out)
        ordered = {k: ground[k] for k in sorted(ground)}
        json.dump({'_meta': existing['_meta'], 'ground': ordered}, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
        print('added or replaced', len(out), 'rows; the file now has', len(ordered), 'volcanoes')
        return
    meta = {
        'source': 'ETOPO 2022 15 Arc-Second Global Relief Model, surface elevation',
        'publisher': 'NOAA National Centers for Environmental Information',
        'doi': '10.25921/fd45-gt74',
        'url': 'https://www.ncei.noaa.gov/products/etopo-global-relief-model',
        'retrieved': today,
        'method': 'Median height of the grid cells 14 to 16 km from the summit coordinates in the Smithsonian list; land and sea cells are taken separately.',
    }
    json.dump({'_meta': meta, 'ground': out}, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print('written', len(out), 'volcanoes')


if __name__ == '__main__':
    main()
