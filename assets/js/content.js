/* =========================================================
   Content binder: fills the HTML skeletons from content/race.js
   Runs before model.js / site.js / page scripts.
   data-c="path"            → innerHTML (tokens filled)
   data-c-lines="path"      → line-mask headline from an array
   data-c-attr="a:path;b:p" → attributes
   data-c-tpl="name" data-c-src="path" → list templates below
   data-c-cta="path"        → whole CTA block
   data-c-crop="path"       → data-topo crop from content.crops
========================================================= */
(function () {
  const C = window.CONTENT;
  const R = C.race;
  const get = (path, root = C) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), root);

  /* ---- time helpers (minutes since 00:00 on race day) ---- */
  const hm = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const pad = n => String(n).padStart(2, '0');
  const days = R.days || ['Day 1', 'Day 2', 'Day 3'];
  const clock = min => {
    const d = Math.floor(min / 1440), m = ((Math.round(min) % 1440) + 1440) % 1440;
    return (days[d] || 'Day ' + (d + 1)) + ' ' + pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  };
  const startMin = hm(R.start);
  const fmtNum = n => (typeof n === 'number' && Math.abs(n) >= 1000 ? n.toLocaleString('en') : String(n));

  /* ---- derived stats tokens ---- */
  const S = C.stats || { weeks: [] };
  const peak = (S.weeks || []).reduce((a, w) => (!a || w.km > a.km ? w : a), null);
  const statsTok = Object.assign({}, S, { peakKm: peak ? Math.round(peak.km) : 0 });

  const TOK = {
    runner: C.runner.name, race: R.name, raceShort: R.short || R.name,
    start: clock(startMin), startTime: R.start, startDay: days[0],
    end: clock(startMin + R.cutoffHours * 60),
    sunrise: R.sunrise, sunset: R.sunset,
    goal: R.goalHours, survival: R.survivalHours, cutoff: R.cutoffHours,
    distance: R.distanceKm, climb: fmtNum(R.climbM)
  };
  function t(str) {
    if (str == null) return '';
    return String(str).replace(/\{([\w.]+)(\|(\w+))?\}/g, (m, key, _, f) => {
      let v = key.startsWith('stats.') ? statsTok[key.slice(6)] : TOK[key];
      if (v == null) return m;
      if (f === 'round') v = Math.round(v);
      return fmtNum(v);
    });
  }
  const lines = arr => (arr == null ? [] : [].concat(arr)).map(l => {
    const o = l[0] === '*';
    return `<span class="line-mask"><span${o ? ' style="color:var(--orange)"' : ''}>${t(o ? l.slice(1) : l)}</span></span>`;
  }).join('');

  /* ---- crops: content.crops or derived from the route bounds ---- */
  function routeBox() {
    const T = window.TERRAIN; if (!T || !T.routeXY) return [0, 0, 1000, 1000];
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    T.routeXY.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); });
    return [x0, y0, x1 - x0, y1 - y0];
  }
  // aspect = w/h of the slot; frac = share of the route box to fill; fx, fy = focus (0–1) inside route box
  function autoCrop(aspect, frac, fx = 0.5, fy = 0.5) {
    const T = window.TERRAIN, [bx, by, bw, bh] = routeBox();
    let w = Math.max(bw, bh * aspect) * frac, h = w / aspect;
    let x = bx + bw * fx - w / 2, y = by + bh * fy - h / 2;
    x = Math.max(0, Math.min(T.w - w, x)); y = Math.max(0, Math.min(T.h - h, y));
    return [x, y, w, h].map(v => Math.round(v));
  }
  const AUTO = {
    hero: () => autoCrop(1.25, 1.25), loader: () => autoCrop(0.875, 1.15), transition: () => autoCrop(1, 0.6),
    report: () => autoCrop(1.17, 0.55, 0.5, 0.65), map: () => autoCrop(0.82, 1.08),
    'pages.crew': () => autoCrop(1.46, 0.5, 0.55, 0.75), 'pages.schedule': () => autoCrop(1.15, 0.45, 0.5, 0.3),
    'pages.aid': () => autoCrop(1.6, 0.55, 0.35, 0.7), 'pages.fuel': () => autoCrop(1.15, 0.45, 0.65, 0.55)
  };
  function crop(name) {
    const v = get(name, C.crops || {});
    if (v) return v;
    return AUTO[name] ? AUTO[name]() : autoCrop(1, 0.6);
  }
  function crewCrop(i) {
    const cc = (C.crops || {}).crewCards;
    if (cc) return [cc.x + i * cc.dx, cc.y + (i % 3) * cc.dy, cc.w, cc.h];
    const [bx, by, bw, bh] = routeBox(), w = Math.max(bw, bh) * 0.28, h = w * 1.25;
    const cols = 4, gx = (bw - w) / (cols - 1 || 1), gy = (bh - h) / 2;
    return [bx + (i % cols) * gx, by + (Math.floor(i / cols) % 3) * gy, w, h].map(Math.round);
  }

  /* ---- list templates ---- */
  const TPL = {
    photos: a => a.map(([src, alt]) => `<img src="${src}" alt="${t(alt)}">`).join(''),
    cards: a => a.map(c => `<div class="card card--${c.colour}"><div class="card__icon">${c.icon}</div><div><div class="card__grade">${c.grade}</div><h4>${t(c.title)}</h4><p>${t(c.text)}</p></div></div>`).join(''),
    marquee: a => { const s = a.map(x => `<span>${t(x)}</span>`).join(''); return s + s; },
    rules: a => a.map(([h, p], i) => `<div data-reveal${i ? ` data-delay=".${i}"` : ''}><b>${pad(i + 1)}</b><h3 class="h-s">${t(h)}</h3><p class="lede mt-s" style="font-size:16px">${t(p)}</p></div>`).join(''),
    golden: a => a.map(([h, p], i) => `<div data-reveal${i ? ` data-delay=".${pad(i * 8)}"` : ''}><b>${pad(i + 1)}</b><h4>${t(h)}</h4><p>${t(p)}</p></div>`).join(''),
    targets: a => a.map(([n, u, h, p], i) => `<div data-reveal${i ? ` data-delay=".${pad(i * 8)}"` : ''}><b data-count="${n}">0<small>${u}</small></b><h4>${t(h)}</h4><p>${t(p)}</p></div>`).join(''),
    warn: a => a.map(([h, p], i) => `<div data-reveal${i % 3 ? ` data-delay=".${pad((i % 3) * 8)}"` : ''}><em>Signs</em><b>${t(h)}</b><p>${t(p)}</p></div>`).join(''),
    toggle: (a, el) => { const hs = (el.dataset.hours || 'goal,survival').split(',').map(k => R[k + 'Hours']); return a.map((l, i) => `<button data-h="${hs[i]}"${i ? '' : ' class="on"'}>${t(l)}</button>`).join(''); },
    // film gallery: [[src, caption, size]] size = w3 | w4 | w6 | w8
    gallery: a => a.map(([src, cap, w], i) => `<figure class="${w || 'w4'}" data-reveal data-delay="${(i % 3) * 0.08}"><img src="${src}" alt="${t(cap || '')}" loading="lazy">${cap ? `<figcaption>${t(cap)}</figcaption>` : ''}</figure>`).join(''),
    // ticket tiers: {cls, tag, name, price, unit, copy, items[], cta:[href,label], sticker}
    tiers: a => a.map((x, i) => `<div class="prod card ${x.cls || 'card--paper'}" style="position:relative;inset:auto" data-reveal data-delay="${(i % 3) * 0.08}">
      ${x.sticker ? `<span class="sticker sticker--sm">${t(x.sticker)}</span>` : ''}
      <div><span class="prod__tag">${t(x.tag)}</span><h4>${t(x.name)}</h4><div class="tier__price">${t(x.price)}<small>${t(x.unit || '')}</small></div><p class="mt-s">${t(x.copy)}</p>
      <ul>${(x.items || []).map(li => `<li>${t(li)}</li>`).join('')}</ul></div>
      ${x.cta ? `<a class="btn btn--ghost" href="${x.cta[0]}"${/^https?:/.test(x.cta[0]) ? ' target="_blank" rel="noopener"' : ''}>${t(x.cta[1])} <span class="arr">→</span></a>` : ''}</div>`).join(''),
    // definition list: [[term, text]]
    facts: a => a.map(([k, v]) => `<dt>${t(k)}</dt><dd>${t(v)}</dd>`).join(''),
    // fly-down captions: [[headline, text]]
    flycaps: a => a.map(([h, p]) => `<div class="fly__cap"><h2 class="h-l">${t(h)}</h2>${p ? `<p class="lede">${t(p)}</p>` : ''}</div>`).join(''),
    heroMeta: () => (get('pages.home.hero.meta') || [['Start', clock(startMin)], ['Distance', R.distanceKm + ' km'], ['Climbing', fmtNum(R.climbM) + ' m'], ['Goal', R.goalHours + ' hrs']]).map(([l, v]) => `<div>${t(l)}<b>${t(v)}</b></div>`).join(''),
    nogo: () => C.stations.filter(s => !s.crew && s.kind !== 'timing' && s.nogo).map((s, i) => {
      const T = window.TERRAIN, ts = T && T.stations.find(x => x.name === s.name);
      return `<div data-reveal${i ? ` data-delay=".${pad(i * 8)}"` : ''}><b>${t(s.label)}${ts ? ' · km ' + ts.km.toFixed(1) : ''}</b>${t(s.nogo)}</div>`;
    }).join('')
  };
  function cta(c) {
    return `<div class="cta__bg" data-parallax style="background-image:url(${c.photo})"></div>
  <div class="wrap">
    <p class="eyebrow" style="color:rgba(255,255,255,.7)">${t(c.eyebrow)}</p>
    <h2 class="h-xl" data-lines>${lines(c.title)}</h2>
    <div class="cta__links">${c.links.map(([h, l], i) => `<a class="btn ${i ? 'btn--ghost' : 'btn--o'}" href="${h}">${t(l)} <span class="arr">→</span></a>`).join('')}</div>
  </div>`;
  }

  /* ---- bind ---- */
  document.title = t(C.site.title);
  const md = document.querySelector('meta[name="description"]'); if (md) md.content = t(C.site.description);
  const ic = document.querySelector('link[rel="icon"]'); if (ic) ic.href = C.runner.image;
  document.querySelectorAll('[data-c]').forEach(el => { el.innerHTML = t(get(el.dataset.c)); });
  document.querySelectorAll('[data-c-lines]').forEach(el => { el.innerHTML = lines(get(el.dataset.cLines)); });
  document.querySelectorAll('[data-c-attr]').forEach(el => el.dataset.cAttr.split(';').forEach(p => { const [a, k] = p.split(':'); el.setAttribute(a, t(get(k))); }));
  document.querySelectorAll('[data-c-tpl]').forEach(el => { el.innerHTML = TPL[el.dataset.cTpl](el.dataset.cSrc ? get(el.dataset.cSrc) : null, el); });
  document.querySelectorAll('[data-c-cta]').forEach(el => { el.innerHTML = cta(get(el.dataset.cCta)); });
  document.querySelectorAll('[data-c-crop]').forEach(el => { el.dataset.topo = crop(el.dataset.cCrop).join(','); });

  window.C = { data: C, get, t, lines, clock, hm, crop, crewCrop, startMin, key: k => (C.site.slug || 'crew') + '-' + k };
})();
