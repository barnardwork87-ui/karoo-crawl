/* ------------------------------------------------------------------
   Race model · pacing + fuel. All numbers come from content/race.js;
   station km / climbing come from assets/terrain.js (tools/contours.py).
------------------------------------------------------------------- */
(function () {
  const T = window.TERRAIN, CT = window.CONTENT, R = CT.race, H = window.C;
  const M = Object.assign({ upPer: 100, downPer: 250, fatiguePerKm: 0.0075, nightFactor: 1.12 }, R.model || {});
  const META = Object.fromEntries(CT.stations.map(s => [s.name, s]));

  const stations = T.stations.map((s, i) => {
    const m = META[s.name];
    if (!m) console.warn('[content] no station in content/race.js named', s.name);
    return Object.assign({ label: s.name, crew: false, stop: 0, cutoff: null }, s, m || {}, { idx: i, leg: (m && m.leg) || null });
  });

  // Effort model: flat km + climbing + technical descent, with fatigue + night slow-down.
  const START_MIN = H.startMin;
  const SUNSET = H.hm(R.sunset);
  const SUNRISE = H.hm(R.sunrise);
  const isNight = t => { const d = ((t % 1440) + 1440) % 1440; return d > SUNSET || d < SUNRISE; };
  function legEffort(s, prev) {
    const mid = (s.km + prev.km) / 2;
    const fatigue = 1 + M.fatiguePerKm * mid;
    return (s.segkm + s.up / M.upPer + s.down / M.downPer) * fatigue;
  }
  function schedule(targetHours) {
    const stops = stations.reduce((a, s) => a + s.stop, 0);
    const efforts = stations.map((s, i) => (i ? legEffort(s, stations[i - 1]) : 0));
    let k = (targetHours * 60 - stops) / efforts.reduce((a, b) => a + b, 0);
    for (let it = 0; it < 30; it++) {
      let t = START_MIN;
      stations.forEach((s, i) => {
        if (!i) return;
        t += efforts[i] * k * (isNight(t) ? M.nightFactor : 1) + s.stop;
      });
      const err = (targetHours * 60) - (t - START_MIN);
      k *= 1 + err / (targetHours * 60);
    }
    let t = START_MIN;
    return stations.map((s, i) => {
      if (i) {
        const legMin = efforts[i] * k * (isNight(t) ? M.nightFactor : 1);
        t += legMin;
        const arrive = t; t += s.stop;
        return { s, legMin, arrive, depart: t };
      }
      return { s, legMin: 0, arrive: t, depart: t };
    });
  }
  function dur(min) {
    const h = Math.floor(min / 60), m = Math.round(min % 60);
    return h ? `${h}h${String(m).padStart(2, '0')}` : `${m} min`;
  }
  const days = R.days || [];
  function cutoffMin(c) {
    if (!c) return null;
    const [day, hm] = c.split(' ');
    const d = Math.max(0, days.indexOf(day));
    return d * 1440 + H.hm(hm);
  }

  window.RACE = { stations, schedule, clock: H.clock, dur, cutoffMin, isNight, SUNSET, SUNRISE, START_MIN,
    distance: R.distanceKm, goal: R.goalHours, survival: R.survivalHours,
    date: new Date(`${R.date}T${R.start}:00${R.tz || 'Z'}`) };

  /* ---------------- fuel model ----------------
     Per crew-to-crew stretch: 1 flask mix/h + gels + solids + salt. */
  const F = CT.fuel;
  if (!F) { window.RACE.fuelPlan = () => []; return; }   // sites without a fuel page
  const PH = Object.assign({ gels: 0.6, solids: 0.45, salt: 1.5 }, F.perHour || {});
  const P = F.products;
  const cafSt = stations.find(s => s.name === F.caffeineFrom);
  const cafKm = cafSt ? cafSt.km : Infinity;
  function fuelPlan(sched) {
    const crewIdx = sched.map((r, i) => (r.s.crew ? i : -1)).filter(i => i >= 0);
    const out = [];
    for (let k = 0; k < crewIdx.length - 1; k++) {
      const a = sched[crewIdx[k]], b = sched[crewIdx[k + 1]];
      const h = (b.arrive - a.depart) / 60;
      const lateRace = a.s.km >= cafKm;
      const mix = Math.max(1, Math.round(h));
      const solids = Math.max(1, Math.round(h * PH.solids));
      const gels = Math.max(1, Math.round(h * PH.gels));
      const salt = Math.ceil(h * PH.salt);
      const sA = Math.ceil(solids / 2), sB = Math.floor(solids / 2);
      const gel = lateRace ? P.gelCaf : P.gel;
      const carbs = Math.round(mix * P.mix.carbs + gels * gel.carbs + sA * P.solidA.carbs + sB * P.solidB.carbs);
      out.push({ from: a, to: b, hours: h, mix, gels, gelType: lateRace ? 'gelCaf' : 'gel',
        solidA: sA, solidB: sB, salt,
        fluid: Math.round(h * F.fluidPerHour / 50) * 50, carbs, carbsPerHour: Math.round(carbs / h),
        caffeine: lateRace ? gels * (P.gelCaf.caffeine || 0) : 0 });
    }
    return out;
  }
  window.RACE.FUEL = F;
  window.RACE.fuelPlan = fuelPlan;
  window.RACE.caffeineStation = cafSt || null;
})();
