# Inner-page layouts

The 25 inner pages use varied layouts inspired by the supplied SpaceX human-spaceflight reference, using CosmosIntelligence's existing imagery and typography. Home, shared navigation, and the standardized footer are unchanged.

- Panoramic opening sections establish each page's topic.
- Related top-level sections are grouped into tabs using `content/page-layouts.json`.
- Sections with three or more subtopics use topic tabs instead of repeating images or a long stack of descriptions.
- Shorter passages use text-only editorial sections, occasional image-backed features, and closing participation links.
- FAQ answers use native expandable details.
- Longer passages retain the text carousels selected by the earlier audit. Research pillars, integration resources, and demo topics now use named tabs instead.

Tabs work by click, keyboard arrows/Home/End, and delayed mouse hover. Touch devices use tap. Direct links activate the relevant tab or FAQ answer. All tab content stays visible without JavaScript, and native FAQ controls continue to work. Reduced-motion preferences remain supported.

Validation covered all 25 pages at 1440, 1024, and 390 pixels: tab selection, carousels inside tabs, FAQ expansion, overflow, direct links, keyboard and hover navigation, and the no-JavaScript fallback. A content comparison confirmed that all original body text and links remain in reading order. The homepage output, original template, and shared stylesheet are unchanged.
