"""Download the primary datasets the site is built on, into data/sources/ (not committed until the build uses them).

Sources (see research/data-sources.csv):
  - Smithsonian Global Volcanism Program, Volcanoes of the World: Holocene volcanoes and eruptions (public WFS service)
  - NOAA NCEI/WDS Global Significant Volcanic Eruptions Database (public API)

Usage: python3 scripts/fetch-sources.py [out_dir]
"""
import json
import os
import sys
import datetime
import urllib.request

OUT = sys.argv[1] if len(sys.argv) > 1 else 'data/sources'
WFS = ('https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature'
       '&outputFormat=application%2Fjson&typeName=GVP-VOTW:')
NCEI = 'https://www.ngdc.noaa.gov/hazel/hazard-service/api/v1/volcanoes?itemsPerPage=200&page={}'


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'volcanosatlas-fetch-sources'})
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.read()


def main():
    os.makedirs(OUT, exist_ok=True)
    manifest = {'retrieved': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'), 'files': {}}
    for layer, name in (('Smithsonian_VOTW_Holocene_Volcanoes', 'gvp-volcanoes.json'), ('Smithsonian_VOTW_Holocene_Eruptions', 'gvp-eruptions.json')):
        raw = get(WFS + layer)
        data = json.loads(raw)
        open(os.path.join(OUT, name), 'wb').write(raw)
        manifest['files'][name] = {'records': len(data['features']), 'service_timestamp': data.get('timeStamp')}
    items, page, pages = [], 1, 1
    while page <= pages:
        d = json.loads(get(NCEI.format(page)))
        items += d['items']
        pages = d.get('totalPages', 1)
        page += 1
    json.dump(items, open(os.path.join(OUT, 'noaa-volcano-events.json'), 'w'))
    manifest['files']['noaa-volcano-events.json'] = {'records': len(items)}
    json.dump(manifest, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print(json.dumps(manifest, indent=1))


if __name__ == '__main__':
    main()
