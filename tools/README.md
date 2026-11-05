# tools/contours.py
Builds `assets/terrain.js` from any GPX plus a stations CSV: contours, route, stations, elevation profile and an optional 3D heightmap.

    python tools/contours.py route.gpx stations.csv --km <official km> [--climb <official m>] [--dem 320] -o assets/terrain.js

Run `python tools/contours.py -h` for every option, and see the main README for the full workflow. Needs numpy, pillow and scikit-image. Tiles are cached in `tools/.tiles/`.
