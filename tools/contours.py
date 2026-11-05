#!/usr/bin/env python3
"""
Build assets/terrain.js for any race: contour lines, route, stations, elevation profile.

    python tools/contours.py route.gpx tools/stations.csv --km 60 [--climb 435] [-o assets/terrain.js]

Inputs
  route.gpx      the official course GPX (track or route points; <ele> optional)
  stations.csv   one row per station, in race order. Columns:
                   name            must match `name` in content/race.js
                   lat,lon         where it is (snapped to the nearest point on the route), or
                   km              official km (when you have no coordinates)
                 First row with no position = start, last row with no position = finish.

Options
  --km           official distance. The GPX length is scaled to this (GPS tracks are never exact).
  --climb        official climbing. Station up/down figures are scaled so the total matches.
  --interval     contour interval in metres (10 or 20, default 20)
  --pad          margin around the route as a share of its size (default 0.12)
  --zoom         terrain-tile zoom (default: picked from the area, 10–14)
  --cache        tile cache folder (default tools/.tiles)
  --dem N        embed an N-px heightmap for the 3D fly-down section (0 = off)
  -o             output file (default assets/terrain.js)

Elevation: AWS Terrain Tiles (terrarium), downloaded once and cached.
Needs numpy, pillow and scikit-image (pip install numpy pillow scikit-image).
"""
import argparse, csv, io, json, math, os, sys, urllib.request, datetime
import xml.etree.ElementTree as ET
import numpy as np
from PIL import Image
from skimage import measure, filters

R_EARTH = 6371000.0


def hav(a, b):
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * R_EARTH * math.asin(math.sqrt(h))


def read_gpx(path):
    root = ET.parse(path).getroot()
    pts = []
    for el in root.iter():
        tag = el.tag.split('}')[-1]
        if tag in ('trkpt', 'rtept'):
            ele = None
            for c in el:
                if c.tag.split('}')[-1] == 'ele' and c.text:
                    ele = float(c.text)
            pts.append((float(el.get('lat')), float(el.get('lon')), ele))
    if len(pts) < 2:
        sys.exit('No track points found in ' + path)
    # drop duplicates
    out = [pts[0]]
    for p in pts[1:]:
        if hav(out[-1], p) > 0.5:
            out.append(p)
    return out


def resample(pts, spacing):
    """Even spacing along the track, interpolating lat/lon/ele."""
    cum = [0.0]
    for a, b in zip(pts, pts[1:]):
        cum.append(cum[-1] + hav(a, b))
    total = cum[-1]
    n = max(2, int(total // spacing) + 1)
    targets = np.linspace(0, total, n)
    lat = np.interp(targets, cum, [p[0] for p in pts])
    lon = np.interp(targets, cum, [p[1] for p in pts])
    has_ele = all(p[2] is not None for p in pts)
    ele = np.interp(targets, cum, [p[2] for p in pts]) if has_ele else None
    return lat, lon, ele, targets, total


def read_stations(path):
    rows = []
    with open(path, newline='', encoding='utf-8') as f:
        for r in csv.DictReader(f):
            r = {k.strip().lower(): (v or '').strip() for k, v in r.items() if k}
            if not r.get('name'):
                continue
            rows.append({
                'name': r['name'],
                'lat': float(r['lat']) if r.get('lat') else None,
                'lon': float(r['lon']) if r.get('lon') else None,
                'km': float(r['km']) if r.get('km') else None,
            })
    if len(rows) < 2:
        sys.exit('Need at least a start and a finish in ' + path)
    return rows


def tile_xy(lon, lat, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('gpx')
    ap.add_argument('stations')
    ap.add_argument('--km', type=float, required=True, help='official distance in km')
    ap.add_argument('--climb', type=float, help='official climbing in m (scales station up/down)')
    ap.add_argument('--interval', type=int, default=20)
    ap.add_argument('--pad', type=float, default=0.12)
    ap.add_argument('--zoom', type=int)
    ap.add_argument('--cache', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), '.tiles'))
    ap.add_argument('--dem', type=int, default=0, help='also embed a heightmap this many px on its long side (for the 3D fly-down, e.g. 320)')
    ap.add_argument('-o', '--out', default='assets/terrain.js')
    a = ap.parse_args()
    if 20 % a.interval:
        sys.exit('--interval must divide 20 (use 5, 10 or 20)')

    # ---------------- route ----------------
    raw = read_gpx(a.gpx)
    rough = sum(hav(p, q) for p, q in zip(raw, raw[1:]))
    spacing = max(15.0, rough / 2500)                       # ≤ ~2500 points on the map
    lat, lon, gele, cum, total = resample(raw, spacing)
    kscale = a.km / (total / 1000)
    km = cum / 1000 * kscale
    print(f'GPX {len(raw)} pts, {total/1000:.2f} km → scaled ×{kscale:.4f} to {a.km} km; {len(lat)} resampled pts @ {spacing:.0f} m')

    # ---------------- bbox ----------------
    la0, la1, lo0, lo1 = lat.min(), lat.max(), lon.min(), lon.max()
    midlat = math.radians((la0 + la1) / 2)
    wm = (lo1 - lo0) * math.cos(midlat) * 111320          # metres
    hm = (la1 - la0) * 110540
    size = max(wm, hm)
    padm = size * a.pad
    # keep the map between 4:3 and 3:4 so the page crops have room
    W_m = max(wm + 2 * padm, (hm + 2 * padm) * 0.75)
    H_m = max(hm + 2 * padm, (wm + 2 * padm) * 0.75)
    clat, clon = (la0 + la1) / 2, (lo0 + lo1) / 2
    dlon = W_m / 2 / (111320 * math.cos(midlat)); dlat = H_m / 2 / 110540
    LON0, LON1, LAT0, LAT1 = clon - dlon, clon + dlon, clat + dlat, clat - dlat   # west, east, north, south
    print(f'bbox W {LON0:.4f} E {LON1:.4f} N {LAT0:.4f} S {LAT1:.4f} ({W_m/1000:.1f} × {H_m/1000:.1f} km)')

    # ---------------- terrain ----------------
    Z = a.zoom
    if not Z:
        Z = 14
        while Z > 10 and (tile_xy(LON1, 0, Z)[0] - tile_xy(LON0, 0, Z)[0]) * 256 > 2600:
            Z -= 1
    x0, y0 = tile_xy(LON0, LAT0, Z); x1, y1 = tile_xy(LON1, LAT1, Z)
    tx = range(int(x0), int(x1) + 1); ty = range(int(y0), int(y1) + 1)
    os.makedirs(a.cache, exist_ok=True)
    print(f'zoom {Z}: {len(tx)}×{len(ty)} tiles')
    rows = []
    for y in ty:
        row = []
        for x in tx:
            p = os.path.join(a.cache, f'{Z}_{x}_{y}.png')
            if not os.path.exists(p):
                urllib.request.urlretrieve(f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{x}/{y}.png', p)
            im = np.asarray(Image.open(p).convert('RGB')).astype(float)
            row.append(im[..., 0] * 256 + im[..., 1] + im[..., 2] / 256 - 32768)
        rows.append(np.hstack(row))
    Hraw = np.vstack(rows)
    px0 = (x0 - tx[0]) * 256; px1 = (x1 - tx[0]) * 256; py0 = (y0 - ty[0]) * 256; py1 = (y1 - ty[0]) * 256
    Hraw = Hraw[int(py0):int(py1), int(px0):int(px1)]
    Hs = filters.gaussian(Hraw, sigma=1.2, preserve_range=True)
    h, w = Hs.shape
    W = 1000; sc = W / w; VH = round(h * sc)
    print(f'grid {w}×{h}, elevation {Hs.min():.0f}–{Hs.max():.0f} m')

    def to_xy(lo, la):
        x, y = tile_xy(lo, la, Z)
        return ((x - tx[0]) * 256 - px0) * sc, ((y - ty[0]) * 256 - py0) * sc

    def dem_at(lo, la):
        x, y = tile_xy(lo, la, Z)
        c = min(w - 1, max(0, int((x - tx[0]) * 256 - px0))); r = min(h - 1, max(0, int((y - ty[0]) * 256 - py0)))
        return float(Hraw[r, c])

    out = {'w': W, 'h': VH, 'levels': []}
    I = a.interval
    lo_e = int(math.floor(Hs.min() / I) * I) + I
    for lev in range(max(I, lo_e), int(Hs.max()) + 1, I):
        paths = []
        for c in measure.find_contours(Hs, lev):
            if len(c) < 12:
                continue
            c = measure.approximate_polygon(c, tolerance=0.7)
            paths.append('M' + 'L'.join(f'{p[1]*sc:.1f},{p[0]*sc:.1f}' for p in c))
        out['levels'].append({'e': lev, 'd': ' '.join(paths)})
    coast = []
    if Hs.min() < 1.5:
        for c in measure.find_contours(Hs, 1.5):
            if len(c) < 20:
                continue
            c = measure.approximate_polygon(c, tolerance=0.7)
            coast.append('M' + 'L'.join(f'{p[1]*sc:.1f},{p[0]*sc:.1f}' for p in c))
    out['coast'] = ' '.join(coast)

    # ---------------- route on the map ----------------
    xy = [to_xy(lo, la) for la, lo in zip(lat, lon)]
    out['route'] = 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in xy)
    out['routeKm'] = [round(float(k), 2) for k in km]
    out['routeXY'] = [[round(x, 1), round(y, 1)] for x, y in xy]

    # elevation along the route: GPX <ele> if present, else the DEM
    ele = gele if gele is not None else np.array([dem_at(lo, la) for la, lo in zip(lat, lon)])
    k = max(1, int(round(100 / spacing)))                  # ~100 m smoothing window
    ele_s = np.convolve(np.pad(ele, k, mode='edge'), np.ones(2 * k + 1) / (2 * k + 1), mode='same')[k:-k]

    def climb(i0, i1):
        d = np.diff(ele_s[i0:i1 + 1])
        return float(d[d > 0].sum()), float(-d[d < 0].sum())

    # ---------------- stations ----------------
    st = read_stations(a.stations)
    n = len(lat); idx = []; prev = 0
    for j, s in enumerate(st):
        if s['lat'] is not None and s['lon'] is not None:
            # nearest route point at or after the previous station (handles loops/out-and-backs)
            # take the FIRST pass within 150 m of the best match, so out-and-backs snap to the right visit
            # (on lapped courses add a km column too: it picks the pass nearest that km)
            d = np.array([hav((lat[i], lon[i]), (s['lat'], s['lon'])) for i in range(prev, n)])
            best = d.min()
            near = np.where(d <= best + 150)[0]
            if s['km'] is not None:
                first = int(near[np.argmin(np.abs(km[prev + near] - s['km']))])
                while first > 0 and d[first - 1] <= best + 150:
                    first -= 1
            else:
                first = int(near[0])
            end = first
            while end + 1 < len(d) and d[end + 1] <= best + 150:
                end += 1
            bi = prev + first + int(np.argmin(d[first:end + 1]))
            off = round(float(d[bi - prev]))
        elif s['km'] is not None:
            bi = int(np.argmin(np.abs(km - s['km']))); off = 0
        else:
            bi = 0 if j == 0 else n - 1; off = 0
        if j == len(st) - 1 and s['lat'] is not None and abs(km[bi] - a.km) < 1.0:
            bi = n - 1                                     # finish snaps to the end of the track
        if j == 0 and s['lat'] is not None and km[bi] < 1.0:
            bi = 0
        idx.append(bi); prev = bi
    ups, downs = [], []
    for j in range(len(st)):
        if j == 0:
            ups.append(0); downs.append(0); continue
        u, d = climb(idx[j - 1], idx[j]); ups.append(u); downs.append(d)
    tot_up = sum(ups)
    f = (a.climb / tot_up) if (a.climb and tot_up) else 1.0
    if a.climb:
        print(f'climbing from elevation {tot_up:.0f} m → scaled ×{f:.3f} to {a.climb:.0f} m')
    stations = []
    for j, s in enumerate(st):
        i = idx[j]; x, y = xy[i]
        o = {'name': s['name'], 'i': i, 'ri': i, 'km': round(float(km[i]), 1), 'ele': round(float(ele_s[i])),
             'x': round(x, 1), 'y': round(y, 1)}
        if j:
            o.update(segkm=round(float(km[i] - km[idx[j - 1]]), 1), up=round(ups[j] * f), down=round(downs[j] * f))
        stations.append(o)
    out['stations'] = stations

    # ---------------- profile (every 250 m of official distance) ----------------
    samples = np.arange(0, a.km + 1e-9, 0.25)
    prof = np.interp(samples, km, ele_s)
    out['profile'] = [round(float(e)) for e in prof]
    out['profileMin'] = int(math.floor((prof.min() - 0.08 * (prof.max() - prof.min())) / 10) * 10)
    out['profileMax'] = int(math.ceil((prof.max() + 0.06 * (prof.max() - prof.min())) / 10) * 10)
    # ---------------- heightmap for the 3D view (uint16 decimetres above min, base64) ----------------
    if a.dem:
        import base64
        f = a.dem / max(h, w)
        dh, dw = max(2, round(h * f)), max(2, round(w * f))
        small = np.asarray(Image.fromarray(Hs.astype(np.float32)).resize((dw, dh), Image.BILINEAR))
        mn = float(small.min())
        q = np.clip(np.round((small - mn) * 10), 0, 65535).astype('<u2')
        out['dem'] = {'w': dw, 'h': dh, 'min': round(mn, 1), 'max': round(float(small.max()), 1),
                      'mPerUnit': round(W_m / W, 3), 'data': base64.b64encode(q.tobytes()).decode()}
        print(f'heightmap {dw}×{dh} for the 3D view')
    out['km'] = a.km
    out['meta'] = {'gpx': os.path.basename(a.gpx), 'built': datetime.date.today().isoformat(), 'zoom': Z,
                   'bbox': [round(LON0, 5), round(LAT0, 5), round(LON1, 5), round(LAT1, 5)], 'interval': I}

    js = 'window.TERRAIN=' + json.dumps(out, separators=(',', ':')) + ';'
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    open(a.out, 'w').write(js)

    print(f'\n{"station":28s} {"km":>6s} {"seg":>6s} {"up":>6s} {"down":>6s} {"off(m)":>7s}')
    for s, (j, raw_s) in zip(stations, enumerate(st)):
        print(f'{s["name"][:28]:28s} {s["km"]:6.1f} {s.get("segkm", 0):6.1f} {s.get("up", 0):6d} {s.get("down", 0):6d} '
              f'{(hav((lat[s["i"]], lon[s["i"]]), (raw_s["lat"], raw_s["lon"])) if raw_s["lat"] is not None else 0):7.0f}')
    print(f'\nwrote {a.out}: {len(js)/1024:.0f} KB, viewBox 0 0 {W} {VH}')


if __name__ == '__main__':
    main()
