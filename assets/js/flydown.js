/* =========================================================
   Fly-down: top view of the contour map → down to standing on
   the route, looking along it. Scroll-driven (GSAP ScrollTrigger).
   Needs a heightmap in assets/terrain.js (tools/contours.py --dem 320)
   and <section class="fly" id="fly"> on the page.
   Copy: content.pages.home.fly · camera: content.fly
========================================================= */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const sec = document.getElementById('fly');
const T = window.TERRAIN, CT = window.CONTENT, H = window.C;
if (sec && T && T.dem) start();
else if (sec) sec.style.display = 'none';

function start() {
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cfg = Object.assign({ exaggeration: 1.8, startKm: 1.2, lookKm: 4, runLookKm: 1, eye: 6, runKm: 2.5, back: 70, lookHeight: null, endFov: 58, fog: [0.25, 0.95] }, CT.fly || {});
  const D = T.dem;
  const stage = sec.querySelector('.fly__stage');
  const canvas = sec.querySelector('canvas');

  /* ---------- heights ---------- */
  const raw = Uint8Array.from(atob(D.data), c => c.charCodeAt(0));
  const hv = new Uint16Array(raw.buffer);
  const EX = cfg.exaggeration / D.mPerUnit;            // metres → world units, exaggerated
  const sx = T.w / (D.w - 1), sz = T.h / (D.h - 1);    // world units per heightmap px
  function elevAt(x, z) {                               // world x,z (0..T.w, 0..T.h) → metres above D.min
    const gx = Math.max(0, Math.min(D.w - 1.001, x / sx)), gz = Math.max(0, Math.min(D.h - 1.001, z / sz));
    const x0 = Math.floor(gx), z0 = Math.floor(gz), fx = gx - x0, fz = gz - z0;
    const v = (i, j) => hv[j * D.w + i] / 10;
    return (v(x0, z0) * (1 - fx) + v(x0 + 1, z0) * fx) * (1 - fz) + (v(x0, z0 + 1) * (1 - fx) + v(x0 + 1, z0 + 1) * fx) * fz;
  }
  const yAt = (x, z) => elevAt(x, z) * EX;

  /* ---------- scene ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  const paper = new THREE.Color('#F4F4EF');
  renderer.setClearColor(paper);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, 0.5, 6000);

  // terrain mesh, world origin at map top-left (svg coords: x east, z south)
  const geo = new THREE.PlaneGeometry(T.w, T.h, D.w - 1, D.h - 1);
  geo.rotateX(-Math.PI / 2);
  geo.translate(T.w / 2, 0, T.h / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, hv[i] / 10 * EX);
  geo.computeVertexNormals();
  const terrainMat = new THREE.ShaderMaterial({
    uniforms: {
      uEx: { value: EX }, uMin: { value: D.min }, uInt: { value: (T.meta && T.meta.interval) || 20 },
      uPaper: { value: paper }, uLine: { value: new THREE.Color('#8B8E73') }, uIdx: { value: new THREE.Color('#4C5034') },
      uFog: { value: new THREE.Vector2(400, 1800) }, uCam: { value: new THREE.Vector3() }, uWire: { value: 0 },
      uSize: { value: new THREE.Vector2(T.w, T.h) }
    },
    vertexShader: `
      varying float vElev; varying vec3 vN; varying vec3 vW;
      uniform float uEx; uniform float uMin;
      void main(){ vElev = position.y / uEx + uMin; vN = normal; vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `
      varying float vElev; varying vec3 vN; varying vec3 vW;
      uniform float uInt; uniform vec3 uPaper; uniform vec3 uLine; uniform vec3 uIdx; uniform vec2 uFog; uniform vec3 uCam; uniform float uWire; uniform vec2 uSize;
      float iso(float v, float w){ float f = abs(fract(v - .5) - .5); float d = fwidth(v); return 1. - smoothstep(d * (w - .5), d * (w + .5), f); }
      void main(){
        float dist = distance(vW, uCam);
        float near = 1. - smoothstep(30., 260., dist);
        float fine = iso(vElev / (uInt * .25), .8) * .35 * uWire * near;
        float minor = iso(vElev / uInt, 1.0) * .55;
        float major = iso(vElev / (uInt * 5.), 1.9);
        float shade = clamp(dot(normalize(vN), normalize(vec3(-.5, .75, -.35))), 0., 1.);
        vec3 col = uPaper * (1. - (1. - shade) * .32 * uWire);
        col = mix(col, uLine, fine);
        col = mix(col, uLine, minor * .7);
        col = mix(col, uIdx, major * .9);
        float edge = min(min(vW.x, uSize.x - vW.x), min(vW.z, uSize.y - vW.z));
        float fog = max(smoothstep(uFog.x, uFog.y, dist), 1. - smoothstep(0., 90., edge));
        gl_FragColor = vec4(mix(col, uPaper, fog), 1.);
      }`
  });
  scene.add(new THREE.Mesh(geo, terrainMat));

  /* ---------- route (dashed orange tube draped on the ground) ---------- */
  const RK = T.routeKm;
  // GPS tracks wobble at walking scale: smooth for the 3D path (±6 points ≈ ±150 m)
  const RXY = T.routeXY.map((_, i, a) => { let sx = 0, sz = 0, n = 0; for (let j = Math.max(0, i - 6); j <= Math.min(a.length - 1, i + 6); j++) { sx += a[j][0]; sz += a[j][1]; n++; } return [sx / n, sz / n]; });
  const step = Math.max(1, Math.floor(RXY.length / 1200));
  const pts = [];
  for (let i = 0; i < RXY.length; i += step) { const [x, z] = RXY[i]; pts.push(new THREE.Vector3(x, yAt(x, z) + 0.6, z)); }
  const curve = new THREE.CatmullRomCurve3(pts);
  const tubeLen = curve.getLength();
  const mkRouteMat = dash => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uDash: { value: dash }, uC: { value: new THREE.Color('#F0612E') }, uDraw: { value: 0 }, uA: { value: 1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
    fragmentShader: `varying vec2 vUv; uniform float uDash; uniform vec3 uC; uniform float uDraw; uniform float uA;
      void main(){ if (vUv.x > uDraw || uA < .01) discard; if (fract(vUv.x * uDash) > .58) discard; gl_FragColor = vec4(uC, uA); }`
  });
  const routeMat = mkRouteMat(tubeLen / 9);                    // aerial: chunky dashes
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, Math.min(4000, pts.length * 3), 1.1, 6, false), routeMat));
  // ground: thin line hugging the terrain, full resolution
  const gpts = RXY.map(([x, z]) => new THREE.Vector3(x, yAt(x, z) + 0.12, z));
  const gcurve = new THREE.CatmullRomCurve3(gpts);
  const groundMat = mkRouteMat(gcurve.getLength() / 1.6);
  groundMat.uniforms.uDraw.value = 1;
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(gcurve, Math.min(12000, gpts.length * 4), 0.16, 5, false), groundMat));

  // station dots + an HTML label for the start/finish
  const crewMat = new THREE.MeshBasicMaterial({ color: '#F0612E' }), noMat = new THREE.MeshBasicMaterial({ color: '#7C7C74' });
  const dotGeo = new THREE.SphereGeometry(3.2, 16, 12);
  const labels = [];
  const meta = Object.fromEntries((CT.stations || []).map(s => [s.name, s]));
  T.stations.forEach((s, i) => {
    const m = meta[s.name] || {};
    if (m.kind === 'finish' && Math.hypot(s.x - T.stations[0].x, s.y - T.stations[0].y) < 15) return;
    const d = new THREE.Mesh(dotGeo, m.crew === false ? noMat : crewMat);
    d.position.set(s.x, yAt(s.x, s.y) + 3, s.y); scene.add(d);
    const el = document.createElement('div'); el.className = 'fly__lbl'; el.textContent = (m.flyLabel || m.label || s.name).replace(/ ·.*/, '');
    stage.appendChild(el); labels.push({ el, p: d.position });
  });

  /* ---------- camera path ---------- */
  const kmIdx = km => { let k = RK.findIndex(v => v >= km); return k < 0 ? RK.length - 1 : k; };
  const routeAt = km => { const [x, z] = RXY[kmIdx(km)]; return new THREE.Vector3(x, yAt(x, z), z); };
  const [bx0, bz0, bx1, bz1] = RXY.reduce((b, [x, z]) => [Math.min(b[0], x), Math.min(b[1], z), Math.max(b[2], x), Math.max(b[3], z)], [1e9, 1e9, -1e9, -1e9]);
  const centre = new THREE.Vector3((bx0 + bx1) / 2, 0, (bz0 + bz1) / 2);
  const span = Math.max(bx1 - bx0, bz1 - bz0);
  const eye = cfg.eye * EX;                              // standing height (metres, exaggerated like the terrain)
  const A = routeAt(cfg.startKm), B = routeAt(cfg.startKm + cfg.lookKm);
  const dir = new THREE.Vector3().subVectors(B, A).setY(0).normalize();
  const backU = cfg.back / D.mPerUnit;                  // how far behind the start you stand (m → units)
  const gx = A.x - dir.x * backU, gz = A.z - dir.z * backU;
  const ground = new THREE.Vector3(gx, yAt(gx, gz) + eye, gz);
  const lookY = cfg.lookHeight == null ? eye * 0.6 : cfg.lookHeight * EX;
  // waypoints: top-down → high oblique → low over the start → standing
  const P = [
    new THREE.Vector3(centre.x, span * 1.9, centre.z + 0.01),
    new THREE.Vector3(centre.x - dir.x * span * 0.35, span * 1.05, centre.z - dir.z * span * 0.35 + span * 0.15),
    A.clone().addScaledVector(dir, -span * 0.18).setY(A.y + span * 0.22),
    ground
  ];
  const L = [centre.clone(), centre.clone().lerp(A, 0.5), A.clone().addScaledVector(dir, span * 0.05), B.clone().setY(B.y + lookY)];
  const pathP = new THREE.CatmullRomCurve3(P, false, 'centripetal'), pathL = new THREE.CatmullRomCurve3(L, false, 'centripetal');
  const upTop = new THREE.Vector3(0, 0, -1), upY = new THREE.Vector3(0, 1, 0), up = new THREE.Vector3();
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const state = { p: 0, draw: 0 };
  function place() {
    const RUN = cfg.runKm > 0 ? 0.2 : 0;                   // share of the scroll spent jogging along the route
    const p = state.p, fly = Math.min(1, p / (1 - RUN)), run = RUN ? Math.max(0, (p - 1 + RUN) / RUN) : 0;
    const t = ease(fly);
    const cp = pathP.getPoint(t), cl = pathL.getPoint(t);
    if (run > 0) {                                       // last stretch: jog along the route
      const k = cfg.startKm + run * cfg.runKm;
      const a = routeAt(k), b = routeAt(k + cfg.runLookKm);
      const d = new THREE.Vector3().subVectors(b, a).setY(0).normalize();
      const g = a.clone().addScaledVector(d, -6); g.y = yAt(g.x, g.z) + eye;
      cp.lerp(g, Math.min(1, run * 1.6)); cl.lerp(b.setY(b.y + eye * 0.6), Math.min(1, run * 1.6));
    }
    cam.position.copy(cp);
    up.copy(upTop).lerp(upY, Math.min(1, t * 1.6)).normalize();
    cam.up.copy(up); cam.lookAt(cl);
    cam.fov = 32 + (cfg.endFov - 32) * t; cam.updateProjectionMatrix();
    terrainMat.uniforms.uCam.value.copy(cam.position);
    terrainMat.uniforms.uFog.value.set(THREE.MathUtils.lerp(span * 3, span * cfg.fog[0], t), THREE.MathUtils.lerp(span * 6, span * cfg.fog[1], t));
    terrainMat.uniforms.uWire.value = t;
    routeMat.uniforms.uDraw.value = state.draw;
    const g = cfg.groundLine === false ? 0 : THREE.MathUtils.smoothstep(t, 0.55, 0.85);
    routeMat.uniforms.uA.value = 1 - g; groundMat.uniforms.uA.value = g;
  }

  /* ---------- sizing, labels, render ---------- */
  function size() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
  }
  const v = new THREE.Vector3();
  function render() {
    place(); renderer.render(scene, cam);
    const w = stage.clientWidth, h = stage.clientHeight;
    labels.forEach(({ el, p }) => {
      v.copy(p).project(cam);
      const vis = v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
      el.style.opacity = vis ? 1 : 0;
      el.style.transform = `translate(${(v.x * .5 + .5) * w}px, ${(-v.y * .5 + .5) * h}px)`;
    });
  }
  size(); render();
  window.addEventListener('resize', () => { size(); render(); });

  /* ---------- captions + scroll ---------- */
  const caps = [...sec.querySelectorAll('.fly__cap')];
  const kmEl = sec.querySelector('[data-fly-km]'), altLbl = sec.querySelector('[data-fly-lbl]');
  function captions() {
    const n = caps.length;
    caps.forEach((c, i) => {
      const a = i / n, b = (i + 1) / n;
      c.classList.toggle('on', state.p >= a - 0.001 && (state.p < b || i === n - 1));
    });
    const showD = CT.race.showDistance !== false && cfg.runKm > 0;
    if (altLbl) altLbl.textContent = state.p < 0.8 || !showD ? 'Altitude' : 'On the route';
    if (kmEl) kmEl.textContent = state.p < 0.8 || !showD ? `${Math.round(cam.position.y * D.mPerUnit / cfg.exaggeration + D.min).toLocaleString('en')} m` : `km ${(cfg.startKm + Math.max(0, (state.p - 0.8) / 0.2) * cfg.runKm).toFixed(1)}`;
  }
  if (RM || !window.ScrollTrigger) { state.p = 0; state.draw = 1; render(); captions(); return; }
  gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.8 } })
    .to(state, { draw: 1, duration: 0.25, ease: 'none' }, 0)
    .to(state, { p: 1, duration: 1, ease: 'none', onUpdate: () => { render(); captions(); } }, 0);
  ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onUpdate: () => render() });
  captions();
}
