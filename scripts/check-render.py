"""Render checks on a local build, in headless Chrome (needs Python playwright and a Chrome binary).

Desktop: every country page - map markers and table rows against the published volcano count, blank rows, raw markup.
Desktop: every rebuilt volcano page (data/profiles) - no table that scrolls sideways inside its box, no raw markup.
Phone (390 px): sideways scroll, map height and tiles, menu opens with links, on one page of every type.

Usage:
    python3 scripts/check-render.py http://localhost:3100 . /tmp/shots
"""
import os, sys, json, glob, re
from playwright.sync_api import sync_playwright
base, repo, out = sys.argv[1].rstrip('/'), sys.argv[2], sys.argv[3]
proxy = os.environ.get('HTTPS_PROXY')
countries = {}
for p in sorted(glob.glob(os.path.join(repo, 'data/content/country-*.json'))):
    d = json.load(open(p, encoding='utf-8-sig'))
    countries[d['slug']] = d['hero'].get('volcano_count')
report = {'countries': {}, 'mobile': {}, 'errors': []}
def tiles_ok(page):
    return page.evaluate("""() => { const t=[...document.querySelectorAll('img.leaflet-tile')]; return {n:t.length, ok:t.filter(i=>i.complete&&i.naturalWidth>0).length, src:(t[0]||{}).src||null}; }""")
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME_BIN', '/usr/bin/google-chrome'), headless=True, args=['--no-sandbox'], proxy={'server': proxy, 'bypass': 'localhost,127.0.0.1'} if proxy else None)
    ctx = b.new_context(viewport={'width': 1440, 'height': 1000})
    page = ctx.new_page()
    errs = []
    page.on('pageerror', lambda e: errs.append(str(e)[:160]))
    for slug, count in countries.items():
        errs.clear()
        page.goto(f'{base}/volcanoes-in-{slug}', wait_until='domcontentloaded', timeout=60000)
        try:
            page.wait_for_selector('.leaflet-container', timeout=15000)
            page.wait_for_timeout(900)
        except Exception:
            pass
        info = page.evaluate("""() => ({
            markers: document.querySelectorAll('.leaflet-container path.leaflet-interactive, .leaflet-container .leaflet-marker-icon').length,
            legend: [...document.querySelectorAll('main *')].filter(e=>e.children.length===0 && /^\\d+$/.test((e.textContent||'').trim())).length,
            rows: document.querySelectorAll('main table tbody tr').length,
            tables: document.querySelectorAll('main table').length,
            emptyCells: [...document.querySelectorAll('main table tbody tr')].filter(r => [...r.children].slice(0,3).every(c => !(c.textContent||'').trim())).length,
            rawMarkup: (document.querySelector('main')||document.body).innerText.includes('[['),
            undef: /\\bundefined\\b|\\bNaN\\b/.test((document.querySelector('main')||document.body).innerText),
            h1: (document.querySelector('h1')||{}).innerText,
            linkedRows: document.querySelectorAll('main table tbody tr a[href^="/volcano/"]').length,
            overflow: document.documentElement.scrollWidth - window.innerWidth,
        })""")
        info['hero_count'] = count
        info['errors'] = list(errs)
        report['countries'][slug] = info
    # every rebuilt volcano page at desktop width: a table that scrolls sideways there hides a column
    report['record'] = {}
    for p_ in sorted(glob.glob(os.path.join(repo, 'data/profiles/*.json'))):
        slug = os.path.basename(p_)[:-5]
        errs.clear()
        resp = page.goto(f'{base}/volcano/{slug}', wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(700)
        page.evaluate("document.querySelectorAll('details').forEach(d => d.open = true)")
        page.wait_for_timeout(150)
        info = page.evaluate("""() => { const main = document.querySelector('main') || document.body; return {
            scrolling: [...document.querySelectorAll('.va-scroll')].filter(w => w.scrollWidth - w.clientWidth > 1).map(w => (w.getAttribute('aria-labelledby') || '') + ':' + w.scrollWidth + '>' + w.clientWidth),
            overflow: document.documentElement.scrollWidth - window.innerWidth,
            rawMarkup: /\[\[|\]\]|\{[a-z_0-9]+\}/.test(main.innerText),
            undef: /\bundefined\b|\bNaN\b/.test(main.innerText),
            h1: (document.querySelector('h1')||{}).innerText,
            byline: /Reviewed [A-Z][a-z]+ \d/.test(main.innerText),
        }; }""")
        info['status'] = resp.status if resp else None
        info['errors'] = list(errs)
        report['record'][slug] = info
    ctx.close()
    # phone checks
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True,
                        user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')
    page = ctx.new_page()
    page.on('pageerror', lambda e: errs.append(str(e)[:160]))
    for path in ['/', '/countries', '/volcanoes', '/map', '/latest-eruptions', '/volcano/stromboli', '/volcano/mauna-loa', '/volcano/st-helens', '/volcano/erebus', '/volcano/kilauea', '/volcano/eyjafjallajokull', '/volcano/pinatubo', '/volcano/cotopaxi', '/volcano/aira', '/volcano/arenal', '/volcano/pelee', '/volcano/asamayama', '/volcano/kanlaon', '/volcano/bulusan', '/volcano/ambae', '/volcano/yellowstone', '/volcano/agung', '/volcanoes-in-italy', '/volcanoes-in-united-states', '/ring-of-fire', '/tallest-volcanoes', '/active-volcanoes', '/volcanic-explosivity-index', '/about', '/contact', '/privacy', '/this-page-does-not-exist']:
        errs.clear()
        resp = page.goto(base + path, wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(1500)
        # scroll through the page so lazy parts render
        h = page.evaluate('document.documentElement.scrollHeight')
        for y in range(0, min(h, 30000), 700):
            page.evaluate(f'window.scrollTo(0,{y})'); page.wait_for_timeout(60)
        page.wait_for_timeout(1200)
        t = tiles_ok(page)
        info = page.evaluate("""() => { const de=document.documentElement; const wide=[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && r.right>window.innerWidth+2 && !e.closest('.overflow-x-auto') && !e.closest('.leaflet-container');}).slice(0,4).map(e=>e.tagName+'.'+String(e.className).slice(0,50));
            return {overflow: de.scrollWidth - window.innerWidth, wide, h1: (document.querySelector('h1')||{}).innerText, maps: document.querySelectorAll('.leaflet-container').length, mapHeights: [...document.querySelectorAll('.leaflet-container')].map(m=>Math.round(m.getBoundingClientRect().height)), smallText: [...document.querySelectorAll('main p, main li, main td')].filter(e=>parseFloat(getComputedStyle(e).fontSize)<12).length}; }""")
        info['status'] = resp.status if resp else None
        info['tiles'] = t
        page.evaluate('window.scrollTo(0,0)'); page.wait_for_timeout(200)
        # menu
        btn = page.locator('header button[aria-controls]')
        menu = {'button': btn.count()}
        if btn.count():
            btn.first.click(); page.wait_for_timeout(250)
            menu['expanded'] = btn.first.get_attribute('aria-expanded')
            menu['links'] = page.evaluate("""() => { const id=document.querySelector('header button[aria-controls]').getAttribute('aria-controls'); const m=document.getElementById(id); return m ? [...m.querySelectorAll('a')].filter(a=>a.getBoundingClientRect().height>0).length : -1; }""")
            if path == '/':
                page.screenshot(path=os.path.join(out, 'm_menu_open.png'))
            btn.first.click(); page.wait_for_timeout(150)
        info['menu'] = menu
        info['errors'] = list(errs)
        name = 'm_' + (path.strip('/').replace('/', '_') or 'home')
        page.screenshot(path=os.path.join(out, name + '_top.png'))
        report['mobile'][path] = info
    ctx.close(); b.close()
json.dump(report, open(os.path.join(out, 'render_report.json'), 'w'), indent=1)
c = report['countries']
bad_markers = {s: (v['markers'], v['hero_count']) for s, v in c.items() if v['markers'] != v['hero_count']}
bad_rows = {s: (v['rows'], v['hero_count'], v['tables']) for s, v in c.items() if v['rows'] != v['hero_count']}
print('country pages:', len(c))
print('map markers != published count:', len(bad_markers), bad_markers)
print('table rows != published count:', len(bad_rows), bad_rows)
print('pages with blank rows:', {s: v['emptyCells'] for s, v in c.items() if v['emptyCells']}, '| raw [[ markup:', [s for s, v in c.items() if v['rawMarkup']], '| undefined/NaN:', [s for s, v in c.items() if v['undef']])
print('rows without a volcano link:', {s: v['rows'] - v['linkedRows'] for s, v in c.items() if v['rows'] != v['linkedRows']})
print('js errors on country pages:', {s: v['errors'][:1] for s, v in c.items() if v['errors']})
print('--- rebuilt volcano pages at 1440 px:', len(report['record']))
for slug, v in report['record'].items():
    bad = v['status'] != 200 or v['scrolling'] or v['overflow'] > 0 or v['rawMarkup'] or v['undef'] or v['errors']
    print(f"{slug:28s} {'PROBLEM' if bad else 'ok':8s} status={v['status']} tables scrolling={v['scrolling']} overflow={v['overflow']} raw={v['rawMarkup']} undef={v['undef']} reviewed={v['byline']} err={v['errors'][:1]}")
print('--- phone (390 px)')
for path, v in report['mobile'].items():
    print(f"{path:32s} status={v['status']} overflow={v['overflow']:>3} maps={v['maps']} heights={v['mapHeights']} tiles={v['tiles']['ok']}/{v['tiles']['n']} menu={v['menu']} small={v['smallText']} wide={v['wide']} err={v['errors'][:1]}")
