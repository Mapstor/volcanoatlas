#!/usr/bin/env python3
"""Read what a change did to the words of every record page: save the pages twice, then compare.

    python3 scripts/diff-pages.py save http://localhost:3413 /tmp/pages-before     # on the old data or code
    python3 scripts/diff-pages.py save http://localhost:3413 /tmp/pages-after      # on the new
    python3 scripts/diff-pages.py compare /tmp/pages-before /tmp/pages-after [all]

"save" fetches every page that has a profile in data/profiles/ (run it from the repo root; a page that does not
answer 200 is reported and the run ends with exit 1). "compare" prints, page by page, the lines of reader-visible
text that differ: body text, tables, and the labels inside the drawings. Lines that only carry the retrieval date
or the Smithsonian version are counted as "standard" and shown only with "all".

Why: a data refresh changes values the text was written around. The `expect` block of a profile stops the build
for the values someone thought of; this shows the rest. At the refresh of 2026-11-21 it found a dating method
printed raw, a strip label a year off its page's main number, and "almost 170" for a span of 169.3 years.
"""
import difflib
import html
import json
import os
import re
import sys
import urllib.request

STANDARD = re.compile(r'[Dd]ata retrieved [A-Z][a-z]+ \d{1,2}, \d{4}|Volcanoes of the World,? v\. \d|retrieved [A-Z][a-z]+ \d{4}')
BLOCKS = r'<(/?)(p|h1|h2|h3|li|tr|div|section|figcaption|dt|dd|table|summary|details|text|svg|span)[^>]*>'


def text_lines(path):
    with open(path, encoding='utf-8') as handle:
        page = handle.read()
    body = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>', '', page)
    found = re.search(r'<main[\s\S]*?</main>', body)
    main = found.group(0) if found else body
    plain = html.unescape(re.sub(r'<[^>]+>', '', re.sub(BLOCKS, '\n', main)))
    return [line.strip() for line in re.sub(r'[ \t]+', ' ', plain).split('\n') if line.strip()]


def save(base, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    failed = []
    for name in sorted(os.listdir('data/profiles')):
        with open(os.path.join('data/profiles', name), encoding='utf-8') as handle:
            slug = json.load(handle)['slug']
        url = '%s/volcano/%s' % (base.rstrip('/'), slug)
        try:
            with urllib.request.urlopen(url, timeout=120) as response:
                page = response.read().decode('utf-8')
        except Exception as error:  # an HTTP 500 lands here: the build guard that fired is in the server's log
            failed.append('%s (%s)' % (slug, error))
            continue
        with open(os.path.join(out_dir, slug + '.html'), 'w', encoding='utf-8') as handle:
            handle.write(page)
    print('saved %d pages to %s' % (len(os.listdir(out_dir)), out_dir))
    if failed:
        print('NOT SAVED:', failed)
        sys.exit(1)


def compare(dir_a, dir_b, show_standard):
    total = 0
    names = sorted(set(os.listdir(dir_a)) | set(os.listdir(dir_b)))
    for name in names:
        path_a, path_b = os.path.join(dir_a, name), os.path.join(dir_b, name)
        if not (os.path.exists(path_a) and os.path.exists(path_b)):
            print('== %-18s only in %s' % (name[:-5], dir_a if os.path.exists(path_a) else dir_b))
            total += 1
            continue
        diff = [line for line in difflib.unified_diff(text_lines(path_a), text_lines(path_b), lineterm='', n=0)
                if line[:1] in '+-' and not line.startswith(('+++', '---'))]
        standard = [line for line in diff if STANDARD.search(line) and len(line) < 400]
        rest = [line for line in diff if line not in standard]
        total += len(rest)
        if rest or show_standard:
            print('== %-18s changed lines: %d (standard: %d)' % (name[:-5], len(diff), len(standard)))
            for line in (diff if show_standard else rest):
                print('   ', line[:300])
    print('pages compared: %d | changed lines that are not standard: %d' % (len(names), total))


if len(sys.argv) >= 4 and sys.argv[1] == 'save':
    save(sys.argv[2], sys.argv[3])
elif len(sys.argv) >= 4 and sys.argv[1] == 'compare':
    compare(sys.argv[2], sys.argv[3], len(sys.argv) > 4)
else:
    sys.exit(__doc__)
