(function () {
  const f = document.getElementById('foot');
  if (!f) return;
  const F = window.CONTENT.footer, t = window.C.t;
  const groups = F.groups || [
    ['The plan', [['index.html', 'Home'], ['crew.html', 'The Crew'], ['schedule.html', 'Timing & Schedule']]],
    ['On the day', [['aid-stations.html', 'Aid Stations'], ['fuel.html', 'Fuelling']]],
    ['Official', F.official || []]
  ];
  f.innerHTML = `
  <div class="wrap">
    <div class="foot__grid">
      <div>
        <h5>${t(F.title || 'Crew HQ')}</h5>
        <p style="font-size:14px;opacity:.75;max-width:34ch">${t(F.blurb)}</p>
      </div>
      ${groups.map(([title, links]) => `<div><h5>${t(title)}</h5>${links.map(([h, l]) => `<a href="${h}"${/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : ''}>${t(l)}</a>`).join('')}</div>`).join('\n      ')}
    </div>
    <div class="foot__big">${t(F.big)}</div>
    <div class="foot__legal">
      <span>${t(F.legal)}</span>
      <span>${t(F.legalRight)}</span>
    </div>
  </div>`;
})();
