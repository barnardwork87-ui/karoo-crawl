# Karoo Crawl

Event site for the Karoo Crawl, a 60 km run around Place of Dreams in the Tankwa Karoo. Built from `race-crew-template`. Three pages: `index.html` (home, with the 3D fly-down), `about.html` and `tickets.html`.

## Run locally

    python3 -m http.server 4319

Open http://localhost:4319 (add `?loader` to replay the intro).

## Edit

- **All copy, dates, stations, tickets and photos:** `content/race.js`. Search for `TODO` to find what's still TBC (date, cut-off, prices, ticket link).
- **Route:** `data/route-indicative.gpx` is last year's Strava track (22 Aug 2026), used as an indicative loop. When the new route exists, swap the GPX, update `data/stations.csv`, and rebuild:

      ../.venv/bin/python tools/contours.py data/route.gpx data/stations.csv --km 60 --climb 435 --dem 320 -o assets/terrain.js

- **Photos:** `assets/img/`, from the 35 mm Drive folder, resized to 1800 px.
- **Logo:** `assets/karoo-crawl-logo.svg`.

Bump `?v=N` in the three HTML files after changes. Not published yet: see the template README for the GitHub Pages steps.
