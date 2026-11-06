# Monumental Marathon · Cheer Plan

A phone-friendly page for the friends and family cheering on Jill, Anne and Belle at the Indy Monumental Marathon (Saturday, Nov 7, 2026).

This is a plain static site with no build step, published with GitHub Pages from the `main` branch root.

- `data.js` holds all the content: the race-day plan, cheer spots, links and official maps. Three tabs: Plan, Map, Links.
- `app.js` renders it, works out the estimated pass times in the browser, and draws the interactive map (Leaflet + OpenStreetMap).
- `course.js` is the marathon route for the map. It's hand-traced from the official course map and approximate.
- `maps/` holds images of the official race PDFs.

**This repo is public.** Don't add phone numbers, hotels, addresses or last names.

Preview locally:

```
python3 -m http.server 4000
```
