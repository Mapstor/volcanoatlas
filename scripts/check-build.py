"""Full crawl of a volcanosatlas build (local or remote).

Follows every internal link from the sitemap and the homepage and reports: status codes, broken links, redirects,
canonical / og:url per page, noindex vs sitemap, h1 count, duplicate titles, structured-data types and a list of
strings that must never come back (made-up boxes, stock-photo hosts, raw wiki markup).

Usage:
    rm -rf .next && npx next build && npx next start -p 3100 &
    python3 scripts/check-build.py http://localhost:3100 /tmp/crawl.json [file-with-extra-urls]

Every line of the report should show zero problems before a pull request is opened.
"""
import sys
import re
import json
import collections
import concurrent.futures as cf
import urllib.request
import urllib.error
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

base = sys.argv[1].rstrip("/")  # e.g. http://localhost:3100
out_path = sys.argv[2]
extra_file = sys.argv[3] if len(sys.argv) > 3 else None
PROD = "https://www.volcanosatlas.com"
BAD_STRINGS = [
    "Demo Data", "Scientific Publishing Group", "How to Visit", "Leading Volcanic Information Resource",
    "Population at Risk", "Infrastructure Risk", "Aviation Risk", "Global Ranking", "Monitoring & Alert Status",
    "Recent volcanic activity detected", "Historical eruption (estimated)", "API KEY", "images.unsplash.com",
    "via.placeholder.com", "cartocdn", "Kuril Volcanic Arc</div>", "All Japan Volcanoes", "ScholarlyArticle",
    "LearningResource", "2024-01-01", "/volcano-types/", "/region/", "[[", "undefined", "Real-time", "Real-Time",
]


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


# A local build is fetched directly; a remote one goes through whatever proxy the environment sets.
_local = urlparse(base).hostname in ("localhost", "127.0.0.1", "::1")
opener = urllib.request.build_opener(NoRedirect, urllib.request.ProxyHandler({})) if _local else urllib.request.build_opener(NoRedirect)


class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.canonical = None
        self.robots = None
        self.title = None
        self._t = None
        self.h1 = 0
        self.ld = []
        self._ld = None
        self.skip = 0
        self.in_main = 0
        self.text = []
        self.og_url = None
        self.og_title = None
        self.imgs = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style", "noscript", "svg"):
            if tag == "script" and (a.get("type") or "") == "application/ld+json":
                self._ld = []
            self.skip += 1
            return
        if self.skip:
            return
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        if tag == "link" and (a.get("rel") or "") == "canonical":
            self.canonical = a.get("href")
        if tag == "meta":
            k = a.get("name") or a.get("property")
            if k == "robots":
                self.robots = a.get("content")
            if k == "og:url":
                self.og_url = a.get("content")
            if k == "og:title":
                self.og_title = a.get("content")
        if tag == "title" and self.title is None:
            self._t = []
        if tag == "h1":
            self.h1 += 1
        if tag == "main":
            self.in_main += 1
        if tag == "img":
            self.imgs += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript", "svg"):
            if self.skip:
                self.skip -= 1
            if tag == "script" and self._ld is not None:
                self.ld.append("".join(self._ld))
                self._ld = None
            return
        if tag == "title" and self._t is not None:
            self.title = "".join(self._t).strip()
            self._t = None
        if tag == "main" and self.in_main:
            self.in_main -= 1

    def handle_data(self, data):
        if self._ld is not None:
            self._ld.append(data)
            return
        if self.skip:
            return
        if self._t is not None:
            self._t.append(data)
        if self.in_main:
            self.text.append(data)


def ld_types(o, acc):
    if isinstance(o, list):
        for x in o:
            ld_types(x, acc)
    elif isinstance(o, dict):
        t = o.get("@type")
        if t:
            acc.append(t if isinstance(t, str) else "+".join(t))
        if "@graph" in o:
            ld_types(o["@graph"], acc)


def fetch(path):
    url = base + path
    rec = {"path": path}
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "volcanoatlas-check-build"})
        with opener.open(req, timeout=60) as r:
            rec["status"] = r.status
            body = r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        rec["status"] = e.code
        rec["location"] = e.headers.get("Location")
        try:
            body = e.read().decode("utf-8", "replace")
        except Exception:
            body = ""
    except Exception as e:  # noqa
        rec["status"] = 0
        rec["error"] = str(e)[:120]
        return rec
    if rec["status"] in (301, 302, 307, 308):
        return rec
    p = P()
    try:
        p.feed(body)
    except Exception as e:  # noqa
        rec["parse_error"] = str(e)[:80]
    types = []
    bad_ld = 0
    for block in p.ld:
        try:
            ld_types(json.loads(block), types)
        except Exception:
            bad_ld += 1
    text = " ".join(" ".join(p.text).split())
    visible = text
    rec.update(title=p.title, canonical=p.canonical, robots=p.robots, h1=p.h1, ld=types, bad_ld=bad_ld, words=len(text.split()),
               og_url=p.og_url, og_title=p.og_title, imgs=p.imgs,
               bad=[s for s in BAD_STRINGS if s in (visible if s in ("undefined", "[[", "Real-time", "Real-Time") else body)])
    links = set()
    for h in p.links:
        if h.startswith(("mailto:", "tel:", "#", "javascript:")):
            continue
        full = urljoin(PROD + path, h)
        u = urlparse(full)
        if u.netloc in ("www.volcanosatlas.com", "volcanosatlas.com"):
            links.add((u.path or "/") + (("?" + u.query) if u.query else ""))
    rec["links"] = sorted(links)
    return rec


# seeds: sitemap + home + extra list (old known URLs)
seeds = {"/"}
try:
    with opener.open(base + "/sitemap.xml", timeout=30) as r:
        sm = r.read().decode()
    sitemap_paths = [urlparse(u).path or "/" for u in re.findall(r"<loc>([^<]+)</loc>", sm)]
except Exception as e:  # noqa
    sitemap_paths = []
    print("sitemap error", e)
seeds.update(sitemap_paths)
extra = []
if extra_file:
    extra = [urlparse(l.strip()).path or "/" for l in open(extra_file) if l.strip().startswith("http")]

results = {}
queue = collections.deque(sorted(seeds))
seen = set(seeds)
with cf.ThreadPoolExecutor(max_workers=8) as ex:
    while queue:
        batch = [queue.popleft() for _ in range(min(len(queue), 64))]
        for rec in ex.map(fetch, batch):
            results[rec["path"]] = rec
            for l in rec.get("links", []):
                if l not in seen:
                    seen.add(l)
                    queue.append(l)
            loc = rec.get("location")
            if loc:
                lp = urlparse(urljoin(PROD + rec["path"], loc))
                lpath = (lp.path or "/")
                if lp.netloc in ("", "www.volcanosatlas.com", "volcanosatlas.com", urlparse(base).netloc):
                    if lpath not in seen:
                        seen.add(lpath)
                        queue.append(lpath)
    crawled = set(results)
    extra_only = [p for p in extra if p not in results]
    for rec in ex.map(fetch, extra_only):
        rec["extra"] = True
        results[rec["path"]] = rec
        loc = rec.get("location")
        if loc:
            lpath = urlparse(urljoin(PROD + rec["path"], loc)).path or "/"
            if lpath not in results:
                r2 = fetch(lpath)
                r2["extra"] = True
                results[lpath] = r2

json.dump({"sitemap": sitemap_paths, "results": results}, open(out_path, "w"))

# ---------- report ----------
st = collections.Counter(r["status"] for p, r in results.items() if not r.get("extra"))
print("pages reached by crawling links:", sum(st.values()), "| status:", dict(st))
print("sitemap urls:", len(sitemap_paths), "| not 200:", [p for p in sitemap_paths if results.get(p, {}).get("status") != 200][:10])

# broken internal links
src = collections.defaultdict(list)
for p, r in results.items():
    for l in r.get("links", []):
        t = results.get(l)
        if t is None or t["status"] not in (200, 301, 302, 307, 308):
            src[l].append(p)
print("broken internal link targets:", len(src), [(k, v[:2]) for k, v in list(src.items())[:15]])
redir_links = collections.Counter()
for p, r in results.items():
    for l in r.get("links", []):
        t = results.get(l)
        if t and t["status"] in (301, 302, 307, 308):
            redir_links[l] += 1
print("internal links that hit a redirect:", len(redir_links), redir_links.most_common(8))
# redirect chains
chains = []
for p, r in results.items():
    if r["status"] in (301, 302, 307, 308):
        lpath = urlparse(urljoin(PROD + p, r.get("location") or "")).path or "/"
        t = results.get(lpath)
        if not t or t["status"] != 200:
            chains.append((p, r["status"], lpath, t and t["status"]))
print("redirects not ending on a 200 in one hop:", chains[:10])

ok = {p: r for p, r in results.items() if r["status"] == 200 and "title" in r}
def canon_path(c):
    if not c:
        return None
    u = urlparse(c)
    return (u.path or "/") if u.netloc == "www.volcanosatlas.com" and u.scheme == "https" else "BADHOST:" + c
bad_canon = [(p, r.get("canonical")) for p, r in ok.items() if canon_path(r.get("canonical")) != p and p != "/api/search"]
print("200 pages:", len(ok), "| canonical not self:", len(bad_canon), bad_canon[:8])
bad_og = [(p, r.get("og_url")) for p, r in ok.items() if canon_path(r.get("og_url")) != p]
print("og:url not self:", len(bad_og), bad_og[:5], "| distinct og:title:", len(set(r.get("og_title") for r in ok.values())))
noindex = [p for p, r in ok.items() if r.get("robots") and "noindex" in r["robots"]]
print("noindex pages:", len(noindex), "| noindex in sitemap:", [p for p in noindex if p in sitemap_paths][:5], "| e.g.", noindex[:4])
idx = [p for p in ok if p not in noindex]
print("indexable pages:", len(idx), "| indexable but not in sitemap:", sorted(set(idx) - set(sitemap_paths))[:15])
print("h1 != 1:", [(p, r["h1"]) for p, r in ok.items() if r["h1"] != 1][:10])
titles = collections.Counter(r["title"] for r in ok.values())
print("duplicate titles:", [(t, c) for t, c in titles.items() if c > 1][:6])
print("titles > 60 chars:", sum(1 for r in ok.values() if r["title"] and len(r["title"]) > 60), "of", len(ok))
ldc = collections.Counter()
for r in ok.values():
    ldc.update(set(r["ld"]))
print("JSON-LD types in server HTML (pages):", dict(ldc), "| pages with invalid JSON-LD:", sum(1 for r in ok.values() if r["bad_ld"]))
badc = collections.Counter()
badex = {}
for p, r in ok.items():
    for b in r.get("bad", []):
        badc[b] += 1
        badex.setdefault(b, p)
print("forbidden strings still present:", dict(badc), badex)
print("pages with <img>:", sum(1 for r in ok.values() if r["imgs"] > 1))
by = collections.defaultdict(list)
for p, r in ok.items():
    t = "home" if p == "/" else ("fallback" if p in noindex else "profile") if p.startswith("/volcano/") else "country" if p.startswith("/volcanoes-in-") else "hub"
    by[t].append(r["words"])
import statistics
print("words by type:", {t: (len(v), int(statistics.median(v)), min(v)) for t, v in by.items()})
if extra:
    ec = collections.Counter()
    bad_extra = []
    for p in extra:
        r = results.get(p)
        s = r["status"] if r else None
        if s in (301, 302, 307, 308):
            lpath = urlparse(urljoin(PROD + p, r.get("location") or "")).path or "/"
            t = results.get(lpath)
            s = f"{s}->{t['status'] if t else '?'}"
        ec[s] += 1
        if s not in (200, "308->200"):
            bad_extra.append((p, s))
    print("old known URLs (Bing+GSC):", dict(ec), "| not ok:", bad_extra[:12])
