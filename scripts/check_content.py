"""Validate generated pages, local links, metadata and preserved home sections."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links, self.ids, self.h1, self.canonical = [], [], 0, []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag == 'h1': self.h1 += 1
        if tag in ('a', 'link') and a.get('href'): self.links.append(a['href'])
        if a.get('src'): self.links.append(a['src'])
        if a.get('data-src'): self.links.append(a['data-src'])
        if a.get('rel') == 'canonical': self.canonical.append(a['href'])

paths = [p for p in ROOT.rglob('index.html') if 'templates' not in p.parts]
pages = {p: Page(p.read_text()) for p in paths}
errors = []
for path, page in pages.items():
    text = path.read_text()
    if page.h1 != 1: errors.append(f'{path}: expected one h1')
    if len(page.ids) != len(set(page.ids)): errors.append(f'{path}: duplicate IDs')
    if len(page.canonical) != 1: errors.append(f'{path}: expected one canonical')
    for payload in re.findall(r'<script type="application/ld\+json">(.*?)</script>', text, re.S): json.loads(payload)
    if re.search(r'<h[123]>[^<]*\n|### |\]\(/', text): errors.append(f'{path}: unrendered Markdown')
    for url in page.links:
        parsed = urlsplit(url)
        if parsed.scheme or parsed.netloc: continue
        target = (ROOT / unquote(parsed.path).lstrip('/')) if parsed.path.startswith('/') else (path.parent / unquote(parsed.path)) if parsed.path else path
        if target.is_dir(): target /= 'index.html'
        target = target.resolve()
        if not target.exists(): errors.append(f'{path.relative_to(ROOT)}: missing {url}')
        elif parsed.fragment and target in pages and parsed.fragment not in pages[target].ids:
            # The original homepage's #top is a data-section alias for #home.
            if not (target == ROOT/'index.html' and parsed.fragment == 'top'):
                errors.append(f'{path.relative_to(ROOT)}: missing fragment {url}')
    for asset in re.findall(r"url\('([^']+)'\)", text):
        target = ROOT/asset.lstrip('/') if asset.startswith('/') else path.parent/asset
        if not target.exists(): errors.append(f'{path}: missing image {asset}')
    if re.search(r'(?:href|src|data-src)="/(?!/)|url\(\x27/(?!/)', text):
        errors.append(f'{path}: root-relative URL breaks project-path hosting')

home = (ROOT/'index.html').read_text()
original = (ROOT/'templates/home.html').read_text()
assert set(re.findall(r'data-section="([^"]+)"', original)) <= set(re.findall(r'data-section="([^"]+)"', home))
assert len(paths) == 26
assert len(ET.parse(ROOT/'sitemap.xml').getroot()) == 26
assert 'every patch of sky contains part of a galaxy' in (ROOT/'research/mapping-the-cosmos/index.html').read_text()
assert 'What NASA supplies' in (ROOT/'product/space-buddy/integrations/nasa-eyes/index.html').read_text()
if errors: raise SystemExit('\n'.join(errors))
print('PASS: 26 pages, local links and assets, fragments, metadata, sitemap and original homepage sections.')
