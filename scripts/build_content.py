"""Build crawlable pages using the existing site's panels, assets and typography.

No third-party dependencies. Supports the headings, paragraphs, lists, links and
bold text used in content/pages. Run from any directory with Python 3.
"""
from pathlib import Path
import html
import hashlib
import json
import re
import posixpath
from urllib.parse import urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.cosmosintelligence.org'
RESEARCH = [('/research/', 'Research Hub'), ('/research/mapping-the-cosmos/', 'Mapping the Cosmos'), ('/research/cosmic-graph/', 'Cosmic Graph'), ('/research/cosmic-intelligence-consciousness/', 'Cosmic Intelligence and Consciousness'), ('/research/search-for-life-intelligence/', 'Search for Life and Intelligence'), ('/research/evidence-standards/', 'Evidence Standards'), ('/research-notes/', 'Research Notes')]
BUDDY = [('/product/space-buddy/', 'Space Buddy Overview'), ('/product/space-buddy/explore-universe/', 'Explore the Universe'), ('/product/space-buddy/ai-companion/', 'AI Companion and Memory'), ('/product/space-buddy/community-news-events/', 'Community, News and Events'), ('/product/space-buddy/vr-xr/', 'VR, AR and XR'), ('/product/space-buddy/integrations/', 'Integrations'), ('/product/space-buddy/integrations/nasa-eyes/', 'NASA Eyes'), ('/product/space-buddy/build-map/', 'Product Requirements and Build Map'), ('/demos/', 'Demos')]
TOP = [('/', 'Home'), ('/why-cosmosintelligence/', 'Why CosmosIntelligence'), ('/research/', 'Research'), ('/product/space-buddy/', 'Space Buddy'), ('/citizen-science/', 'Citizen Science'), ('/join/', 'Build With Us'), ('/sources/', 'Sources')]
INDEPENDENCE = 'CosmosIntelligence and Space Buddy are independent projects, not sponsored, endorsed or operated by NASA. NASA Eyes and other linked NASA resources are provided by NASA; using them does not imply a partnership.'
esc = html.escape

def link(url, label, current=''):
    active = ' aria-current="page"' if url == current else ''
    return f'<a href="{esc(url, quote=True)}"{active}>{esc(label)}</a>'

def nav(current):
    items = []
    for url, label in TOP:
        children = RESEARCH if label == 'Research' else BUDDY if label == 'Space Buddy' else None
        if children:
            items.append(f'<details class="nav-dropdown"><summary>{label}</summary><div class="dropdown-links">' + ''.join(link(u, l, current) for u, l in children) + '</div></details>')
        else:
            items.append(link(url, label, current))
    return ''.join(items)

def header(current):
    return f'''<a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header" aria-label="Website navigation">
      <a class="brand" href="/" aria-label="CosmosIntelligence home">CosmosIntelligence</a>
      <nav class="desktop-nav" aria-label="Page navigation">{nav(current)}</nav>
      <button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-navigation"><span></span><span></span></button>
    </header>
    <nav id="mobile-navigation" class="mobile-nav" aria-label="Mobile navigation" hidden>{nav(current)}</nav>'''

def inline(text):
    text = esc(text)
    text = re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+|/[^\s)]*)\)', lambda m: f'<a href="{m[2]}">{m[1]}</a>', text)
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)

def markdown(text):
    result = []
    for block in re.split(r'\n\s*\n', text.strip()):
        lines = block.strip().splitlines()
        if not lines:
            continue
        if all(re.match(r'^(\* |\d+\. )', l) for l in lines):
            kind = 'ul' if lines[0].startswith('* ') else 'ol'
            result.append(f'<{kind}>' + ''.join('<li>' + inline(re.sub(r'^(\* |\d+\. )', '', l)) + '</li>' for l in lines) + f'</{kind}>')
        elif lines[0].startswith('### '):
            result.append('<h3>' + inline(lines[0][4:]) + '</h3>')
            if len(lines) > 1:
                raise ValueError('Headings must be followed by a blank line')
        else:
            result.append('<p>' + '<br>'.join(inline(l.rstrip()) for l in lines) + '</p>')
    return '\n'.join(result)

def read_page(path):
    _, front, body = path.read_text().split('---', 2)
    meta = dict((k, json.loads(v.strip())) for k, v in (line.split(':', 1) for line in front.strip().splitlines()))
    return meta, body.strip()

def metadata(meta):
    url = ORIGIN + meta['slug']
    graph = [{'@type': 'WebPage', '@id': url, 'url': url, 'name': meta['title'], 'description': meta['meta_description'], 'isPartOf': {'@id': ORIGIN + '/#website'}}]
    if meta['slug'] == '/':
        graph.extend([{'@type': 'Organization', '@id': ORIGIN + '/#organization', 'name': 'CosmosIntelligence', 'url': ORIGIN + '/'}, {'@type': 'WebSite', '@id': ORIGIN + '/#website', 'name': 'CosmosIntelligence', 'url': ORIGIN + '/', 'publisher': {'@id': ORIGIN + '/#organization'}}])
    else:
        graph.append({'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': ORIGIN + '/'}, {'@type': 'ListItem', 'position': 2, 'name': meta['title'], 'item': url}]})
    return f'''<title>{esc(meta['seo_title'])}</title>
    <meta name="description" content="{esc(meta['meta_description'], quote=True)}">
    <link rel="canonical" href="{url}">
    <meta property="og:type" content="website"><meta property="og:title" content="{esc(meta['seo_title'], quote=True)}">
    <meta property="og:description" content="{esc(meta['meta_description'], quote=True)}"><meta property="og:url" content="{url}">
    <script type="application/ld+json">{json.dumps({'@context': 'https://schema.org', '@graph': graph}).replace('<', '&lt;')}</script>'''

def panel(heading, text, image, section_id, hero=False, status=''):
    tag = 'h1' if hero else 'h2'
    mark = '<a href="/">Home</a> / CosmosIntelligence' if hero else 'CosmosIntelligence / Research + product'
    note = f'<p class="statement">{esc(status)}</p>' if status else ''
    return f'''<section class="panel content-panel" id="{section_id}" style="--bg: url('/assets/{image}');">
      <div class="scrim"></div><div class="panel-content in-view">
      <p class="page-mark">{mark}</p><{tag}>{inline(heading)}</{tag}>{note}
      <div class="glass-card article-copy">{markdown(text)}</div></div></section>'''

def main():
    template = (ROOT / 'templates/home.html').read_text()
    footer = re.search(r'    <footer.*?</footer>', template, re.S)[0]
    footer = re.sub(r'(<nav class="footer-column" aria-label="Footer navigation">).*?</nav>', lambda m: m[1] + '<h2>NAVIGATION</h2>' + ''.join(link(u, l) for u, l in TOP) + link('/faq/', 'FAQ') + link('/contributors/', 'Contributors') + '</nav>', footer, flags=re.S)
    footer = footer.replace('src="assets/', 'src="/assets/').replace('http://cosmosintelligence.org/', ORIGIN + '/')
    footer = footer.replace('<div class="footer-grid">', f'<p class="independence">{INDEPENDENCE}</p><div class="footer-grid">')
    pages = [read_page(p) for p in sorted((ROOT / 'content/pages').glob('*.md'))]
    for meta, body in pages:
        slug = meta['slug']
        if slug == '/':
            page = re.sub(r'    <title>.*?<link rel="canonical"[^>]+>', lambda _: metadata(meta), template, count=1, flags=re.S)
            page = re.sub(r'    <header.*?</header>', lambda _: header('/'), page, count=1, flags=re.S)
            page = re.sub(r'    <div class="mobile-nav" hidden>.*?</div>', '', page, flags=re.S)
            page = re.sub(r'    <footer.*?</footer>', lambda _: footer, page, count=1, flags=re.S)
            page = page.replace('<main id="top">', '<main id="main-content">')
            additions = ''
            for i, (title, text) in enumerate(re.findall(r'^## ([^\n]+)\n(.*?)(?=^## |\Z)', body, re.M | re.S)):
                if title == 'Independence statement':
                    continue
                additions += panel(title, text, 'webb-hubble-new.jpg' if i % 2 == 0 else 'earth-night.jpg', f'explore-{i}').replace('class="panel content-panel"', f'class="panel content-panel" data-page="overview" data-section="explore-{i}" data-label="{esc(["Questions", "Space Buddy", "Contribute", "Notes & demos"][i], quote=True)}"')
            page = page.replace('      <section class="panel has-video" id="open"', additions + '\n      <section class="panel has-video" id="open"', 1)
            page = page.replace('<script src="script.js"></script>', '<script src="script.js"></script><script src="navigation.js"></script>')
        else:
            heading, rest = body.split('\n', 1)
            chunks = re.split(r'^## (.+)\n', rest, flags=re.M)
            image = 'webb-hubble-new.jpg' if slug.startswith('/research') else 'earth-night.jpg'
            status = 'Product direction: the capabilities and example conversations below describe planned Space Buddy work, not a released application.' if slug.startswith('/product/') else ''
            content = panel(heading.removeprefix('# '), chunks[0], image, 'introduction', True, status)
            for i in range(1, len(chunks), 2):
                content += panel(chunks[i], chunks[i+1], image, f'section-{i}')
            page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
            {metadata(meta)}
            <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800;900&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="/styles.css"></head><body class="knowledge-page">{header(slug)}
            <main id="main-content">{content}</main>{footer}<script src="/navigation.js"></script></body></html>'''
        for asset in ('styles.css', 'script.js', 'navigation.js'):
            version = hashlib.sha256((ROOT / asset).read_bytes()).hexdigest()[:10]
            page = page.replace(f'"{asset}"', f'"{asset}?v={version}"').replace(f'"/{asset}"', f'"/{asset}?v={version}"')
        # A project Pages site lives below /cosmosintelligence/, while the custom
        # domain lives at /. Relative URLs support both without runtime redirects.
        def relative_url(match):
            prefix, url = match.groups()
            parsed = urlsplit(url)
            relative = posixpath.relpath(parsed.path, slug)
            if parsed.path.endswith('/'):
                relative += '/'
            return prefix + urlunsplit(('', '', relative, parsed.query, parsed.fragment))
        page = re.sub(r'((?:href|src|data-src)="|url\(\x27)(/(?!/)[^"\x27]*)(?=["\x27])', relative_url, page)
        destination = ROOT / slug.lstrip('/') / 'index.html'
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(page)
    (ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + '\n'.join(f'<url><loc>{ORIGIN}{m["slug"]}</loc></url>' for m, _ in pages) + '\n</urlset>\n')
    (ROOT / 'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: ' + ORIGIN + '/sitemap.xml\n')
    print(f'Built {len(pages)} static pages and sitemap.')

if __name__ == '__main__':
    main()
