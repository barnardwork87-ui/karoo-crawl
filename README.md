# Karoo Crawl

Event site for the Karoo Crawl at Place of Dreams, Tankwa Karoo: no set distance, run further than you ever have, 100 places. Built from `race-crew-template`. Three pages: `index.html` (home, with the 3D fly-down), `about.html` and `tickets.html`.

## Run locally

    python3 -m http.server 4319

Open http://localhost:4319 (add `?loader` to replay the intro).

## Edit

- **All copy, dates, stations, tickets and photos:** `content/race.js`. Search for `TODO` to find what's still TBC (date, cut-off, prices, ticket link).
- **Route:** `data/route-valley.gpx` is an indicative loop up the valley behind Place of Dreams (computed from elevation data: valley floors, gentle slopes). The aid stations are in `data/stations.csv`. When the real route exists, swap the GPX, update the station positions and rebuild:

      ../.venv/bin/python tools/contours.py data/route.gpx data/stations.csv --km <lap km> --pad 0.35 --dem 360 -o assets/terrain.js

  Distances are never shown on this site (`race.showDistance: false`); `--km` is only used internally.

- **Photos:** `assets/img/`, from the 35 mm Drive folder, resized to 1800 px.
- **Logo:** `assets/karoo-crawl-logo.svg`.

Bump `?v=N` in the three HTML files after changes. Not published yet: see the template README for the GitHub Pages steps.
