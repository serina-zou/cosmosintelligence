---
title: "Scientific Data Connectors"
slug: "/product/space-buddy/integrations/scientific-data/"
canonical: "https://www.cosmosintelligence.org/product/space-buddy/integrations/scientific-data/"
seo_title: "Space Buddy Scientific Data | JPL Horizons, Exoplanets and Astronomy Archives"
meta_description: "Learn how Space Buddy can connect to JPL Horizons, the NASA Exoplanet Archive and public astronomy archives for grounded scientific answers."
last_reviewed: "2026-09-12"
author: "CosmosIntelligence Research and Product Team"
schema_types: "TechArticle,BreadcrumbList"
primary_entities: "JPL Horizons,NASA Exoplanet Archive,TAP,ephemerides,astronomy data"
nav_parent: "Integrations"
---

# Scientific data connectors

Visualizations make space understandable. Data connectors make Space Buddy precise.

## JPL Horizons

JPL Horizons can provide ephemerides and geometric information for Solar System objects and spacecraft. This can answer questions such as where an object is, how it moves and what an observer can see from a selected location.

[JPL Horizons](https://ssd.jpl.nasa.gov/horizons/)

## NASA Exoplanet Archive

The NASA Exoplanet Archive provides confirmed planet data, candidates and supporting tables. Its Table Access Protocol service allows programmatic queries.

[NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/)  
[TAP documentation](https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html)

A user could ask:

“Show me confirmed planets around TRAPPIST 1.”

“Which of these have measured radii and masses?”

“Which transit is observable from my location?”

The assistant can answer from structured data instead of relying on model memory.

## Open astronomy archives

The broader research engine can also use archives such as NASA MAST, HEASARC, ESA Gaia, Euclid, SDSS, DESI, ALMA and open SETI datasets.

These sources feed the Cosmic Graph and research workflows rather than being treated as interchangeable search results.

## Provenance

Every connector should return source metadata. Calculations should retain their inputs. Space Buddy should distinguish retrieved values from calculations and generated explanation.

[Explore the Cosmic Graph](/research/cosmic-graph/)  
[Evidence Standards](/research/evidence-standards/)
