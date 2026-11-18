"""Hydration probe for the rebuilt volcano pages.

    python3 scripts/check-hydration.py <base-url> <repo> [passes] [--busy]

Loads every page that has a profile in data/profiles, `passes` times (default 3), and counts the
loads on which the page threw an error. Nothing is clicked.

With --busy the machine is kept busy meanwhile: a type check (`npx tsc --noEmit`) runs in a loop
beside a few spinning processes, which starves the local server and the browser alike. That is the
load under which a bug in the React build inside Next 16.1.6 showed (2026-11-18: 5 of 275 loads):
when React starts before all of the page's data has arrived, it pauses inside a large element and,
on resuming, fails to match the HTML (error 418) and rebuilds the page in the browser. Spinning
processes alone, a slow line and a throttled browser did not bring it out. DEVLOG §5 has the diagnosis.

Expected: 0 loads with an error without --busy. With --busy on a Next that carries React's fix
(16.2.0 or later) the count has to be 0 as well; use 12 passes (300 loads) or more to tell 0 from 2%.
"""
import collections
import glob
import multiprocessing
import os
import signal
import subprocess
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
    workers = [multiprocessing.Process(target=spin, args=(stop,), daemon=True) for _ in range(1 if busy else 0)]
    for w in workers:
        w.start()
    # the type check in a loop, in its own process group so that it can be stopped as a whole
    tsc = subprocess.Popen(['sh', '-c', 'while :; do npx tsc --noEmit > /dev/null 2>&1; done'], cwd=repo, preexec_fn=os.setsid) if busy else None

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
                    page.wait_for_timeout(900)
                    if errs:
                        bad[slug] += 1
                        first.setdefault(slug, errs[0])
            browser.close()
    finally:
        stop.set()
        if tsc:
            os.killpg(os.getpgid(tsc.pid), signal.SIGKILL)

    loads = len(slugs) * passes
    print(f"pages {len(slugs)} | passes {passes} | busy {busy} | loads {loads} | loads with an error: {sum(bad.values())}")
    for slug, n in sorted(bad.items()):
        print(f'  {slug:26s} {n}  {first[slug]}')
    sys.exit(1 if bad and not busy else 0)


if __name__ == '__main__':
    main()
