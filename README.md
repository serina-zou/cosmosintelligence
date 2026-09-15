# CosmosIntelligence Website

Static interactive website package.

## Content updates

The original homepage design is retained in `templates/home.html`. Public page
copy lives in `content/pages/`. The supplied product roadmap is reference material;
planned capabilities are explicitly labeled and no unpublished demos or contributor
profiles are represented as live.

Run `python3 scripts/build_content.py` after editing copy or the shared page generator,
then `python3 scripts/check_content.py`. Commit the generated HTML with the sources.
No build dependencies or server runtime are needed for hosting. Publish the repository
root on the existing static host, retaining directory URLs (for example `/research/`).
`styles.css`, `script.js`, and `navigation.js` are shared assets.

The sitemap uses `https://www.cosmosintelligence.org`, matching the supplied package.
Existing homepage hash links remain available. Research and Space Buddy now have
dedicated pages and dropdown navigation. Newsletter behavior is unchanged.

## Run locally

Open `index.html` directly, or serve the folder with any static server.

## Files

- `index.html`
- `styles.css`
- `script.js`
- `assets/` active image and MP4 background assets only
