# Karoo Crawl

A run and a campout with a party on the end of it, somewhere in the Karoo.
Everyone starts together in the morning on a route you can repeat, then picks
their own distance and pace. Beating your longest run is a challenge you can
set yourself, not a condition of anything. Everyone is done by sunset.

Built from `race-crew-template`. Three pages: `index.html` (home, with the 3D
fly-down), `about.html` and `partners.html`.

## Run locally

    python3 -m http.server 4319

Open http://localhost:4319 (add `?loader` to replay the intro).

## Edit

**All copy, stations and photos live in `content/race.js`.** It is the only
file you should need.

### Do not edit the map config

The Home map and 3D fly-down are built around a set of values in that file.
They still name Place of Dreams, the Cannon and the Party Bus. That is
deliberate — the map is an **indicative visualisation**, and the surrounding
page copy is what carries the real, still-undecided story. Changing them will
break the terrain, route line, elevation profile or leg tooltips:

    race.distanceKm / climbM / goalHours / survivalHours / cutoffHours
    race.overviewStats / crewAt / penalty / stopsLabel
    stations[]   (mapLabel, flyLabel and the leg tooltips)
    fly{}  ·  pages.home.fly

`pages.home.route` is now unused — the lower route and elevation section was
removed from the home page, since the fly-down already covers it. The config is
kept in case it is ever restored.

Everything else in `race.js` is general page copy and is safe to change.

### Still open

The spot, the date, the route, lap length, elevation, aid setup, catering,
cabins and crew numbers. Keep general copy vague about all of them. 100 runners
is the current target; crew and hangers-on sit on top of that.

### Sign-ups

There is no tickets page. Every "Register interest" and "I can help" button
points at the Tally form:

    https://tally.so/r/o9RgbO

### Route

`data/route-valley.gpx` is an indicative loop. The aid stations are in
`data/stations.csv`. When a real route exists, swap the GPX, update the station
positions and rebuild:

    ../.venv/bin/python tools/contours.py data/route.gpx data/stations.csv --km <lap km> --pad 0.35 --dem 360 -o assets/terrain.js

Distances are never shown on this site (`race.showDistance: false`); `--km` is
only used internally.

### Photos

`assets/img/`, shot on 35 mm by Justin at a previous Crawl, resized to 1800 px.
They are **archive** — none of them is the confirmed spot for the next one, and
the captions say so.

Bump `?v=N` in the three HTML files after changes.
