# Cosmos Intelligence

**[View live site →](https://www.cosmosintelligence.org/)**

Website for Cosmos Intelligence, an initiative that uses AI to study patterns in public space data, and for Space Buddy, its planned AI research companion. The site is written for researchers and prospective contributors.

Designed and built during my UI/UX Design Internship at FloLabs Innovations Group (May–Sep 2026).

**My role:** Information architecture, UI design, front-end development and launch
**Built with:** HTML, CSS, JavaScript, plus a small Python script that generates pages from Markdown

## What I did

- **Information architecture.** Organized technical research documentation into a 21-page site with grouped navigation for Research, Space Buddy, Citizen Science and joining the project.
- **Contributor application flow.** Designed the path from learning about the project to browsing open roles and applying.
- **Responsive layouts** across all pages, with a shared navigation header and footer.
- **Content system.** Page copy lives in Markdown (`content/pages/`) and is turned into HTML pages by a build script, so content can be updated without editing layouts.

---

## Maintaining the site

Static interactive website package.

### Content updates

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

### Run locally

Open `index.html` directly, or serve the folder with any static server.

### Files

- `index.html`
- `styles.css`
- `script.js`
- `assets/` active image and MP4 background assets only
