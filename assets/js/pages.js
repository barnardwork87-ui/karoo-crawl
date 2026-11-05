/* Sub-pages: crew · schedule · aid stations · fuel  (content: content/race.js) */
(function () {
  const R = window.RACE, { buildTopo, RM } = window.SITE;
  const CT = window.CONTENT, H = window.C, t = H.t;
  const page = document.body.dataset.page;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const short = s => s.label.replace(/ ·.*/, '');
  const hhmm = m => R.clock(m).replace(/^\S+ /, '');   // drop the day name
  const dayOf = m => R.clock(m).split(' ')[0];

  // hero contour crops
  $$('svg[data-topo]').forEach(svg => buildTopo(svg, { crop: svg.dataset.topo.split(',').map(Number), step: 20, idx: 100, route: true }));
  $$('.phero svg.topo').forEach(s => s.classList.add('faint'));

  /* =====================================================================
     CREW
  ===================================================================== */
  if (page === 'crew') {
    const CREW = CT.crew;
    $('#crewGrid').innerHTML = CREW.map((c, i) => `
      <article class="crewcard" data-reveal data-delay="${(i % 4) * 0.08}">
        <div class="crewcard__art" style="background:${c.bg};color:${c.fg || 'var(--ink)'}">
          <span class="crewcard__no">${String(i + 1).padStart(2, '0')}</span>
          <svg class="topo ${c.fg ? 'on-dark' : ''}" data-crop="${H.crewCrop(i).join(',')}"></svg>
          <div class="ph"><span class="ini">${c.initials || c.name.split(' ').map(w => w[0]).join('')}</span><span class="note">Illustration incoming</span></div>
          <img class="illo" src="assets/crew/${c.slug}.png" alt="${c.name}" onerror="this.remove()" onload="this.previousElementSibling.style.display='none'">
        </div>
        <div><h3>${c.name}</h3><span class="role">${t(c.role)}</span></div>
        <p>${t(c.bio)}</p>
        <div class="meter" style="--w:${c.auth}%">Authority<span><i></i></span>${c.auth}</div>
        <ul>${c.jobs.map(j => `<li>${t(j)}</li>`).join('')}</ul>
      </article>`).join('');
    $$('.crewcard__art svg').forEach(s => buildTopo(s, { crop: s.dataset.crop.split(',').map(Number), step: 20, idx: 100, coast: true }));
    $$('.meter').forEach(m => ScrollTrigger.create({ trigger: m, start: 'top 90%', once: true, onEnter: () => m.classList.add('go') }));
    // tilt
    $$('.crewcard').forEach(card => {
      const art = $('.crewcard__art', card);
      card.addEventListener('pointermove', e => {
        const b = art.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
        art.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
      });
      card.addEventListener('pointerleave', () => { art.style.transform = ''; });
    });
  }

  /* =====================================================================
     SCHEDULE
  ===================================================================== */
  if (page === 'schedule') {
    let Hh = R.goal;
    const day0 = R.START_MIN, dayEnd = R.START_MIN + CT.race.cutoffHours * 60;
    const pct = m => Math.max(0, Math.min(100, ((m - day0) / (dayEnd - day0)) * 100));
    const sl = $('#planSlider'), rng = CT.race.slider || [R.goal - 2, CT.race.cutoffHours];
    sl.min = rng[0]; sl.max = rng[1]; sl.value = R.goal;
    $('#sliderMin').textContent = rng[0] + 'h'; $('#sliderMax').textContent = rng[1] + 'h'; $('#planVal').textContent = R.goal + 'h';
    // photos
    $('#stepPhotos').innerHTML = R.stations.map((s, i) => `<img src="${s.photo || ''}" data-i="${i}" alt="" class="${i ? '' : 'on'}">`).join('');
    // hours axis: every 4 h (2 h for short races), plus the end
    const stepH = CT.race.cutoffHours > 16 ? 4 : 2, ax = [];
    for (let m = day0; m < dayEnd - 30; m += stepH * 60) ax.push(hhmm(m));
    ax.push(hhmm(dayEnd));
    $('#dayhours').innerHTML = ax.map(x => `<span>${x}</span>`).join('');
    // night bands across the whole window
    function nightBands() {
      let d = '';
      for (let base = Math.floor(day0 / 1440) * 1440 - 1440; base < dayEnd; base += 1440) {
        const a = base + R.SUNSET, b = base + 1440 + R.SUNRISE;          // night: sunset → next sunrise
        if (b < day0 || a > dayEnd) continue;
        const L = pct(a), Rt = pct(b);
        if (Rt - L <= 0) continue;
        d += `<div class="daybar__night" style="left:${L}%;width:${Rt - L}%"></div>`;
        if (a > day0) d += `<div class="daybar__night twi2" style="left:${Math.max(0, L - 3)}%;width:${Math.min(3, L)}%"></div>`;
        if (b < dayEnd) d += `<div class="daybar__night twi" style="left:${Rt}%;width:${Math.min(3, 100 - Rt)}%"></div>`;
      }
      return d;
    }
    function render() {
      const sc = R.schedule(Hh);
      let d = nightBands();
      sc.forEach(r => {
        const s = r.s; const cls = s.kind === 'timing' ? 'no' : s.crew ? 'crew' : 'no';
        d += `<div class="daybar__tick ${cls}" style="left:${pct(r.arrive)}%"><span>${short(s).replace(' (timing)', '')} ${hhmm(r.arrive)}</span></div>`;
        const c = R.cutoffMin(s.cutoff); if (c) d += `<div class="daybar__cut" style="left:${pct(c)}%" title="Cut-off ${s.cutoff}"></div>`;
      });
      $('#daybar').innerHTML = d;
      // stagger crew labels vertically to avoid overlaps
      $$('#daybar .daybar__tick.crew span').forEach((sp, i) => { sp.style.top = (8 + (i % 3) * 22) + 'px'; });
      // steps
      $('#steps').innerHTML = sc.map((r, i) => {
        const s = r.s, c = R.cutoffMin(s.cutoff);
        const buf = c ? c - r.arrive : null;
        const badges = [];
        if (s.kind === 'timing') badges.push('<span class="badge">Timing point</span>');
        else if (s.crew) badges.push('<span class="badge o">Crew allowed</span>');
        else badges.push(`<span class="badge r">No crew · ${t(CT.race.penalty)}</span>`);
        if (s.badge) badges.push(`<span class="badge k">${t(s.badge)}</span>`);
        if (c) badges.push(`<span class="badge ${buf < 45 ? 'r' : 'l'}">Cut-off ${s.cutoff.replace(/^\S+ /, '')} · ${buf >= 0 ? R.dur(buf) + ' buffer' : 'MISSED'}</span>`);
        if (R.isNight(r.arrive)) badges.push('<span class="badge k">Dark</span>');
        const leg = i ? `${s.segkm.toFixed(1)} km · +${s.up} m · ${R.dur(r.legMin)} from last` : 'The start';
        return `<li class="step ${s.crew || s.kind === 'start' || s.kind === 'finish' ? 'crew' : 'nocrew'}" data-i="${i}">
          <div class="step__km">KM ${s.km.toFixed(1)}</div>
          <div><h3>${s.label}</h3><p>${t(s.where || s.sub)}</p><div class="step__badges">${badges.join('')}</div><p class="small mt-s">${leg}</p></div>
          <div class="step__eta"><b>${hhmm(r.arrive)}</b><span>${dayOf(r.arrive)}${s.stop ? ' · ' + s.stop + ' min stop' : ''}</span></div>
        </li>`;
      }).join('');
      $$('.step').forEach(st => ScrollTrigger.create({ trigger: st, start: 'top 55%', end: 'bottom 55%', onToggle: self => { if (self.isActive) activate(+st.dataset.i, sc); } }));
      activate(0, sc);
      // drive table
      const crew = sc.filter(r => r.s.crew);
      let tb = `<thead><tr><th>Station</th><th>He arrives</th><th>Drive from previous</th><th>Leave previous by</th><th>Get there by</th></tr></thead><tbody>`;
      crew.forEach((r, k) => {
        const dr = r.s.drive;
        const target = r.s.kind === 'start' && r.s.crewArrive ? H.hm(r.s.crewArrive) : r.arrive - 30;
        const leave = dr ? target - dr - 10 : null;
        const prevDepart = k ? crew[k - 1].depart : null;
        const tight = leave !== null && prevDepart !== null && leave < prevDepart;
        tb += `<tr><td><b>${short(r.s)}</b></td><td>${R.clock(r.arrive)}</td><td>${dr ? dr + ' min' : '—'}</td><td>${leave ? hhmm(leave) + (tight ? ' <span class="badge r">tight, leave as he leaves</span>' : '') : '—'}</td><td>${hhmm(target)}</td></tr>`;
      });
      $('#driveTable').innerHTML = tb + '</tbody>';
      ScrollTrigger.refresh();
    }
    function activate(i, sc) {
      $$('.step').forEach(s => s.classList.toggle('on', +s.dataset.i === i));
      $$('#stepPhotos img').forEach(im => im.classList.toggle('on', +im.dataset.i === i));
      const r = sc[i];
      $('#clockLbl').textContent = `KM ${r.s.km.toFixed(1)} · ${r.s.label}`;
      $('#clockVal').textContent = R.clock(r.arrive);
      $('#clockSub').textContent = t(r.s.sub || '');
    }
    function setH(h) {
      Hh = +h;
      $('#planVal').textContent = Hh + 'h'; sl.value = Hh;
      $$('#planToggle button').forEach(b => b.classList.toggle('on', +b.dataset.h === Hh));
      ScrollTrigger.getAll().forEach(st => { if (st.trigger && st.trigger.classList && st.trigger.classList.contains('step')) st.kill(); });
      render();
    }
    $$('#planToggle button').forEach(b => b.addEventListener('click', () => setH(b.dataset.h)));
    sl.addEventListener('input', e => setH(e.target.value));
    render();
  }

  /* =====================================================================
     AID STATIONS
  ===================================================================== */
  if (page === 'aid') {
    const PA = CT.pages.aid;
    const sc = R.schedule(R.goal), scS = R.schedule(R.survival);
    const fp = R.fuelPlan(sc);
    const P = R.FUEL.products;
    const order = sc.filter(r => r.s.crew && r.s.aid);
    const saved = JSON.parse(localStorage.getItem(H.key('ticks')) || '{}');
    $('#aidList').innerHTML = order.map((r, k) => {
      const s = r.s, A = s.aid;
      const f = fp.find(x => x.from.s.name === s.name);
      const rS = scS[r.s.idx];
      const pl = (n, p) => (n > 1 ? (p.plural || p.short + 's') : p.short);
      const pack = f ? `<div class="box box--wide"><h4><i></i>Fuel bag for the next ${R.dur((f.to.arrive - f.from.depart))} (to ${short(f.to.s)})</h4>
          <div class="fuelpack">
            <div class="fp"><b>${f.mix}</b><span>flask${f.mix > 1 ? 's' : ''} of drink mix (500 ml)</span></div>
            <div class="fp"><b>${f.gels}</b><span>${P[f.gelType].short}</span></div>
            ${f.solidA ? `<div class="fp"><b>${f.solidA}</b><span>${pl(f.solidA, P.solidA)}</span></div>` : ''}
            ${f.solidB ? `<div class="fp"><b>${f.solidB}</b><span>${P.solidB.short}</span></div>` : ''}
            <div class="fp"><b>${f.salt}</b><span>salt caps</span></div>
            <div class="fp"><b>${(f.fluid / 1000).toFixed(1)}L</b><span>total fluid to get through</span></div>
          </div><p class="small mt-s">≈ ${f.carbsPerHour} g carbs/hour before any real food at the table. ${t(PA.packNote)}</p></div>` : '';
      const li = (arr, key, check) => (arr || []).map((x, j) => {
        const id = `${s.name}-${key}-${j}`;
        return check ? `<li data-id="${id}" class="${saved[id] ? 'done' : ''}"><span class="chk"></span><span>${t(x)}</span></li>` : `<li><span>${t(x)}</span></li>`;
      }).join('');
      return `<section class="wrap"><div class="aid ${A.big ? 'aid--big' : ''}" id="st-${s.idx}">
        <div class="aid__side"><div class="sticky">
          <div class="aid__num">CREW STOP ${String(k + 1).padStart(2, '0')} / ${String(order.length).padStart(2, '0')} · KM ${s.km.toFixed(1)}</div>
          <h2 class="h-l">${short(s)}${A.big ? ` <span class="sticker sticker--sm" style="background:#fff;color:var(--orange);vertical-align:middle">${t(PA.bigSticker)}</span>` : ''}</h2>
          <p class="lede" style="font-size:16px">${t(s.where)}</p>
          <div class="aid__eta"><div><span>ETA · ${R.goal}h</span><b>${hhmm(r.arrive)}</b></div><div><span>ETA · ${R.survival}h</span><b>${hhmm(rS.arrive)}</b></div>${s.cutoff ? `<div><span>Cut-off</span><b>${s.cutoff.replace(/^\S+ /, '')}</b></div>` : ''}</div>
          <div class="mood"><b>Mood forecast</b>${t(A.mood)}</div>
          <div class="aid__photo"><img src="${s.photo}" alt="" loading="lazy"></div>
        </div></div>
        <div class="aid__main">
          <div class="box box--wide"><h4><i></i>Hand him</h4><ul>${li(A.hand, 'hand', true)}</ul></div>
          ${pack}
          <div class="box take"><h4><i></i>Take off him</h4><ul>${li(A.take, 'take', true)}</ul></div>
          <div class="box say"><h4><i></i>Say</h4><ul>${li(A.say, 'say')}</ul></div>
          <div class="box dont box--wide"><h4><i></i>Do not say</h4><ul>${li(A.dont, 'dont')}</ul></div>
        </div>
      </div></section>`;
    }).join('');
    $$('#aidList li[data-id]').forEach(li => li.addEventListener('click', () => {
      li.classList.toggle('done');
      saved[li.dataset.id] = li.classList.contains('done');
      localStorage.setItem(H.key('ticks'), JSON.stringify(saved));
    }));
    $$('.aid').forEach(a => gsap.from($$('.box', a), { opacity: 0, y: 30, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: a, start: 'top 75%', once: true } }));
    if (!RM) {
      gsap.from('#bigSticker', { scale: 0, rotate: -120, duration: 1, delay: 0.5, ease: 'back.out(1.8)' });
      gsap.to('#bigSticker', { rotate: -8, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.5 });
    }
  }

  /* =====================================================================
     FUEL
  ===================================================================== */
  if (page === 'fuel') {
    const F = R.FUEL, P = F.products;
    // count-ups
    $$('[data-count]').forEach(b => {
      const end = +b.dataset.count, unit = b.querySelector('small').outerHTML, o = { v: 0 };
      ScrollTrigger.create({ trigger: b, start: 'top 85%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => { b.innerHTML = Math.round(o.v).toLocaleString() + unit; } }) });
    });
    $('#products').innerHTML = F.cards.map((p, i) => `<div class="prod card ${p.cls}" style="position:relative;inset:auto" data-reveal data-delay="${(i % 3) * 0.08}">
      ${p.st ? `<span class="sticker sticker--sm">${t(p.st)}</span>` : ''}
      <div><span class="prod__tag">${t(p.tag)}</span><h4>${t(p.name)}</h4><p>${t(p.copy)}</p></div>
      <div class="prod__nums">${p.n.map(x => `<div><b>${t(x[0])}</b>${t(x[1])}</div>`).join('')}</div></div>`).join('');
    const TH = Object.assign({ solidA: 'Solids', solidB: 'Bars' }, F.tableHeads || {});
    function table(h) {
      const fp = R.fuelPlan(R.schedule(h));
      let tb = `<thead><tr><th>From → to</th><th class="num">Time</th><th class="num">Mix flasks</th><th class="num">Gels</th><th class="num">${TH.solidA}</th><th class="num">${TH.solidB}</th><th class="num">Salt caps</th><th class="num">Fluid</th><th class="num">Carbs/h</th><th class="num">Caffeine</th></tr></thead><tbody>`;
      fp.forEach(f => {
        tb += `<tr><td><b>${short(f.from.s)}</b> → ${short(f.to.s)}<div class="small">Hand over at ${hhmm(f.from.arrive)}</div></td>
          <td class="num">${R.dur(f.to.arrive - f.from.depart)}</td><td class="num"><b>${f.mix}</b></td><td class="num"><b>${f.gels}</b>${f.gelType === 'gelCaf' ? '<div class="small">caffeine</div>' : ''}</td>
          <td class="num"><b>${f.solidA}</b></td><td class="num"><b>${f.solidB}</b></td><td class="num"><b>${f.salt}</b></td><td class="num">${(f.fluid / 1000).toFixed(1)} L</td><td class="num">${f.carbsPerHour} g</td><td class="num">${f.caffeine ? f.caffeine + ' mg' : '—'}</td></tr>`;
      });
      $('#fuelTable').innerHTML = tb + '</tbody>';
    }
    table(R.goal);
    $$('#fuelToggle button').forEach(b => b.addEventListener('click', () => { $$('#fuelToggle button').forEach(x => x.classList.toggle('on', x === b)); table(+b.dataset.h); }));
    // caffeine chart (goal plan): cumulative mg over the day
    (function () {
      const sc = R.schedule(R.goal), fp = R.fuelPlan(sc);
      const t0 = R.START_MIN, t1 = R.START_MIN + R.goal * 60, X = m => ((m - t0) / (t1 - t0)) * 1000;
      const per = P.gelCaf.caffeine || 35, boost = (F.boost && F.boost.mg) || 0;
      let cum = 0; const pts = [[0, 0]];
      fp.forEach(f => {
        const n = per ? f.caffeine / per : 0; if (!n) return;
        const span = f.to.arrive - f.from.depart;
        if (R.caffeineStation && f.from.s.name !== R.caffeineStation.name && boost) { cum += boost; pts.push([X(f.from.arrive), cum]); }
        for (let k = 0; k < n; k++) { cum += per; pts.push([X(f.from.depart + span * (k + 0.5) / n), cum]); }
      });
      pts.push([1000, cum]);
      const [lo, hi] = F.caffeineMax || [220, 290];
      const top = Math.max(hi * 1.1, cum * 1.05, 100);
      const Y = v => 130 - (v / top) * 120;
      let d = `M0,${Y(0)}`; pts.forEach(p => { d += ` H${p[0].toFixed(1)} V${Y(p[1]).toFixed(1)}`; });
      const cs = R.caffeineStation && sc.find(r => r.s.name === R.caffeineStation.name);
      const sunX = X(R.SUNSET + Math.floor(t0 / 1440) * 1440);
      $('#caffChart').innerHTML = `${sunX > 0 && sunX < 1000 ? `<rect x="${sunX}" y="0" width="${1000 - sunX}" height="140" fill="#10213A" opacity=".08"/>` : ''}
        <rect x="0" y="${Y(hi)}" width="1000" height="${Y(lo) - Y(hi)}" fill="#D7F26B" opacity=".5"/>
        ${cs ? `<line x1="${X(cs.arrive)}" x2="${X(cs.arrive)}" y1="0" y2="140" stroke="#0E0E0C" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>` : ''}
        <path d="${d}" fill="none" stroke="#F0612E" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
        ${cs ? `<text x="${X(cs.arrive) + 6}" y="16" font-family="Geist Mono" font-size="11" fill="#0E0E0C">${short(cs.s).toUpperCase()}: CAFFEINE STARTS</text>` : ''}
        <text x="8" y="${Y(hi) + 13}" font-family="Geist Mono" font-size="11" fill="#10213A">TARGET ${lo}–${hi} mg</text>
        ${sunX > 0 && sunX < 1000 ? `<text x="${sunX + 6}" y="132" font-family="Geist Mono" font-size="11" fill="#10213A">SUNSET ${CT.race.sunset}</text>` : ''}`;
      // time axis under the chart
      const ax = $('#caffHours');
      if (ax) { const st = R.goal > 12 ? 4 : 2, out = []; for (let m = t0; m < t1 - 30; m += st * 60) out.push(hhmm(m)); out.push(hhmm(t1)); ax.innerHTML = out.map(x => `<span>${x}</span>`).join(''); }
    })();
    // shopping list (survival plan + 30%)
    (function () {
      const fp = R.fuelPlan(R.schedule(R.survival));
      const sum = k => fp.reduce((a, f) => a + f[k], 0);
      const gelsCaf = fp.filter(f => f.gelType === 'gelCaf').reduce((a, f) => a + f.gels, 0);
      const gelsNo = sum('gels') - gelsCaf;
      const up = n => Math.ceil(n * 1.3);
      const L = F.shoppingLabels || {};
      const items = [[up(gelsCaf), L.gelCaf], [up(gelsNo), L.gel], [up(sum('solidA')), L.solidA], [up(sum('solidB')), L.solidB],
        [up(sum('mix')), L.mix], [up(sum('salt')), L.salt]].filter(i => i[0] > 0 && i[1]).concat(F.shoppingExtras || []);
      $('#shopping').innerHTML = items.map(i => `<div class="fp" style="background:#fff;padding:18px" data-reveal><b>${t(i[0])}</b><span>${t(i[1])}</span></div>`).join('');
    })();
  }

  // late reveals for injected content
  requestAnimationFrame(() => {
    $$('#crewGrid [data-reveal], #products [data-reveal], #shopping [data-reveal]').forEach(el => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: +(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
  });
})();
