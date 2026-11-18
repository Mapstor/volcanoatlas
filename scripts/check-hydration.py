"""Hydration probe for the rebuilt volcano pages.

    python3 scripts/check-hydration.py <base-url> <repo> [passes] [--busy]

Loads every page that has a profile in data/profiles, `passes` times (default 3), and counts the
loads on which the page threw an error. Nothing is clicked.

With --busy the processor is kept busy meanwhile. That brings out a bug in the React build that
Next 16.1.6 ships: when React starts before all of the page's data has arrived, it pauses inside a
large element and, on resuming, fails to match the HTML (error 418) and rebuilds the page in the
browser. DEVLOG §5 has the diagnosis.

Expected: 0 loads with an error without --busy. With --busy, a few per hundred are that bug until
Next is upgraded; after the upgrade the count has to be 0 with --busy too.
"""
import collections
import glob
import multiprocessing
import os
import sys

from playwright.sync_api import sync_playwright


def spin(stop):
    while not stop.is_set():
        sum(i * i for i in range(20000))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    busy = '--busy' in sys.argv
    base, repo = args[0], args[1]
    passes = int(args[2]) if len(args) > 2 else 3
    slugs = sorted(os.path.basename(f)[:-5] for f in glob.glob(os.path.join(repo, 'data/profiles/*.json')))

    stop = multiprocessing.Event()
    workers = [multiprocessing.Process(target=spin, args=(stop,), daemon=True) for _ in range(2 * (os.cpu_count() or 2) if busy else 0)]
    for w in workers:
        w.start()

    bad = collections.Counter()
    first = {}
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(args=['--no-sandbox'])
            page = browser.new_context(viewport={'width': 1440, 'height': 900}).new_page()
            errs = []
            page.on('pageerror', lambda e: errs.append(str(e)[:110]))
            for _ in range(passes):
                for slug in slugs:
                    errs.clear()
                    page.goto(f'{base}/volcano/{slug}', wait_until='domcontentloaded', timeout=120000)
                    page.wait_for_timeout(1500)
                    if errs:
                        bad[slug] += 1
                        first.setdefault(slug, errs[0])
            browser.close()
    finally:
        stop.set()

    loads = len(slugs) * passes
    print(f"pages {len(slugs)} | passes {passes} | busy {busy} | loads {loads} | loads with an error: {sum(bad.values())}")
    for slug, n in sorted(bad.items()):
        print(f'  {slug:26s} {n}  {first[slug]}')
    sys.exit(1 if bad and not busy else 0)


if __name__ == '__main__':
    main()
