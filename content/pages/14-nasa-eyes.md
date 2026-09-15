---
title: "NASA Eyes Integration"
slug: "/product/space-buddy/integrations/nasa-eyes/"
canonical: "https://www.cosmosintelligence.org/product/space-buddy/integrations/nasa-eyes/"
seo_title: "NASA Eyes Integration with Space Buddy | Embeds, Deep Links and AI Guidance"
meta_description: "Learn how Space Buddy can use documented NASA Eyes iframe embeds and deep links to create conversational exploration of missions, planets, asteroids and exoplanets."
last_reviewed: "2026-09-12"
author: "CosmosIntelligence Research and Product Team"
schema_types: "TechArticle,BreadcrumbList"
primary_entities: "NASA Eyes,Space Buddy,NASA Eyes embed,NASA Eyes iframe"
nav_parent: "Integrations"
---

# NASA Eyes integration

NASA Eyes can become a core visual exploration layer inside Space Buddy.

NASA explicitly documents website embedding for Eyes experiences and provides examples that use iframes and URLs containing object, mission, time and playback state.

[NASA Eyes for Museums and Website Embeds](https://science.nasa.gov/eyes/museums/)

## What NASA supplies

NASA supplies and operates the Eyes visualization experiences. Its documented embeds and deep links can select supported objects, missions, dates and playback settings. NASA does not supply Space Buddy’s conversational AI or memory.

[Open NASA Eyes](https://eyes.nasa.gov/)

## What Space Buddy is designed to add

NASA Eyes provides the interactive visualization. Space Buddy is being developed to add conversational navigation, context, explanation, memory, recommendations, source routing and connections to data or citizen science.

A user might say:

“Take me to Europa Clipper.”

Space Buddy resolves the intent to an approved Eyes target and loads the visual experience.

Then the user asks:

“Why is it taking this route?”

Space Buddy answers from mission sources.

“Show me Europa.”

The visual target changes.

“Can I participate in research related to exoplanets?”

Space Buddy routes into a citizen science workflow.

## Adapter model

The product should not generate arbitrary iframe URLs. An approved Eyes adapter should map supported natural language targets to known URL templates and maintain source provenance.

The adapter can store:

* target ID and aliases
* experience type
* supported URL template
* time and playback parameters where documented
* device requirements
* fallback link
* source and review date

## Fallback behavior

If an embedded experience fails or NASA changes an interface, Space Buddy should provide a direct launch option and preserve the user's conversational context.

## Independent project statement

NASA Eyes is a NASA product. Space Buddy is a CosmosIntelligence project. Embedding or linking to NASA resources does not mean that NASA sponsors or endorses CosmosIntelligence.

[Explore All Integrations](/product/space-buddy/integrations/)  
[Product Requirements and Build Map](/product/space-buddy/build-map/)
