(() => {
'use strict';

/* ================================================================
   Hilfsfunktionen
   ================================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fmt = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',');
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

// Eigener Präfix, damit sich die Lern-Apps auf derselben Domain nicht in die Quere kommen
const store = {
  get(k, d) { try { const v = localStorage.getItem('lr1:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('lr1:' + k, JSON.stringify(v)); } catch (e) { /* Speicher nicht verfügbar */ } }
};

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}
function copyText(text, msg) {
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast(msg), () => toast('Kopieren nicht möglich. Bitte markieren und kopieren.'));
  else toast('Kopieren nicht möglich. Bitte markieren und kopieren.');
}
/* Prüfliste: ✓/✕ mit Text, Information nie nur über Farbe */
const checkRow = (ok, text, detail = '') => `<li class="${ok ? 'ok' : 'bad'}"><span aria-hidden="true">${ok ? '✓' : '✕'}</span><span>${text}<small>${ok ? 'erfüllt' : 'noch nicht erfüllt'}${detail ? ' · ' + detail : ''}</small></span></li>`;
/* Textzeilen als graue Streifen in einem SVG */
function lines(x, y, w, h, step = 12, hh = 5) {
  let s = '';
  const n = Math.max(1, Math.floor((h + step - hh) / step));
  for (let k = 0; k < n; k++) s += `<rect class="txt" x="${x}" y="${y + k * step}" width="${k === n - 1 && n > 1 ? w * 0.6 : w}" height="${hh}" rx="${hh / 2}"/>`;
  return s;
}

/* ================================================================
   Navigation und Seitenstruktur
   ================================================================ */
const ICONS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  einleitung: 'M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z',
  satzspiegel: 'M5 3h14v18H5zM8.5 6.5h7v9h-7z',
  spalten: 'M3 4h18v16H3zM9 4v16M15 4v16',
  grundlinie: 'M3 5h18M3 9.5h18M3 14h18M3 18.5h12',
  modular: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z',
  komposition: 'M3 3h18v18H3zM3 9h18M9 9v12',
  responsive: 'M2 5h14v10H2zM6 19h6M9 15v4M18 8h4v12h-4z',
  bild: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 9h.01',
  'ki-generierung': 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
  'ki-bearbeitung': 'M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5M9 9h6v6H9z',
  'ue-satzspiegel': 'M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2',
  'ue-raster': 'M5 3h14v18H5zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2',
  'ue-platzieren': 'M3 3h18v18H3zM7 7h6v4H7zM7 15h10',
  'ue-responsive': 'M3 4h13v10H3zM7 18h5M9.5 14v4M18 9h3v11h-3z',
  'ue-ausschnitt': 'M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14',
  'ue-ki': 'M4 4h16v12H4zM8 20h8M8 8l2.5 2L8 12M13 12h3',
  quiz: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6',
  literatur: 'M4 4h4v16H4zM10 4h4v16h-4zM16 5l3.5-1 3 15.5-3.5 1z',
  glossar: 'M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12M9 8h6M9 11h4'
};

const PAGES = [
  { id: 'home', t: 'Übersicht' },
  { id: 'einleitung', t: 'Einleitung', sub: 'Warum Ordnung wirkt', group: 'Theorie & Grundlagen' },
  { id: 'satzspiegel', t: 'Format und Satzspiegel', sub: 'Stege und Teilungen' },
  { id: 'spalten', t: 'Spaltenraster', sub: 'Spalten und Zeilenlänge' },
  { id: 'grundlinie', t: 'Grundlinienraster', sub: 'Registerhaltiger Satz' },
  { id: 'modular', t: 'Modulares Raster', sub: 'Felder nach Müller-Brockmann' },
  { id: 'komposition', t: 'Komposition', sub: 'Weißraum und Blickführung', group: 'Gestalten & Anwenden' },
  { id: 'responsive', t: 'Responsives Raster', sub: '12 Spalten und Breakpoints' },
  { id: 'bild', t: 'Bild im Layout', sub: 'Format, Ausschnitt, object-fit' },
  { id: 'ki-generierung', t: 'Bilder mit KI erzeugen', sub: 'Prompts fürs Raster' },
  { id: 'ki-bearbeitung', t: 'Bilder mit KI bearbeiten', sub: 'Erweitern, Retusche, Recht' },
  { id: 'ue-satzspiegel', t: 'Satzspiegel konstruieren', sub: 'Neuner- und Zwölferteilung', group: 'Übungen', ex: 1 },
  { id: 'ue-raster', t: 'Raster berechnen', sub: 'Spaltenformel und CSS', ex: 2 },
  { id: 'ue-platzieren', t: 'Plakat aufs Raster', sub: 'Modulares Raster anwenden', ex: 3 },
  { id: 'ue-responsive', t: 'Breakpoints planen', sub: '4, 8 und 12 Spalten', ex: 4 },
  { id: 'ue-ausschnitt', t: 'Bildausschnitt wählen', sub: 'Drittelregel und Blickrichtung', ex: 5 },
  { id: 'ue-ki', t: 'KI-Bild fürs Layout', sub: 'Prompt und Bearbeitung', ex: 6 },
  { id: 'quiz', t: 'Wissenstest', sub: '15 Fragen', group: 'Wissen' },
  { id: 'literatur', t: 'Literatur', sub: 'Weiterführende Quellen' },
  { id: 'glossar', t: 'Stichwortverzeichnis', sub: 'Begriffe von A–Z' }
];
const EX_IDS = PAGES.filter((p) => p.ex).map((p) => p.id);
const pageById = (id) => PAGES.find((p) => p.id === id);

function icon(id) { return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[id]}"/></svg>`; }

function renderNav() {
  let html = '';
  for (const p of PAGES) {
    if (p.group) html += `<div class="nav-label">${esc(p.group)}</div>`;
    html += `<a href="#${p.id}" data-nav="${p.id}">${icon(p.id)}<span>${esc(p.t)}</span>${p.ex ? '<span class="done-dot" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg><span class="visually-hidden">erledigt</span></span>' : ''}</a>`;
  }
  $('#nav').innerHTML = html;
}

function renderTiles() {
  const mk = (p, num) => `<a class="ptile" href="#${p.id}" data-tile="${p.id}"><div class="art"><img class="bg" src="media/tile-${p.id}.webp" alt="" loading="lazy">${p.ex ? '<span class="tag-ex">Übung</span><span class="tag-done" hidden>Erledigt</span>' : ''}<span class="chip-num" aria-hidden="true">${num}</span></div><div class="tile-body"><h3>${esc(p.t)}</h3><p>${esc(p.sub)}</p><span class="go">${p.ex ? 'Übung starten' : 'Kapitel öffnen'}</span></div></a>`;
  $('#tiles-theory').innerHTML = PAGES.slice(1, 11).map((p, i) => mk(p, String(i + 1).padStart(2, '0'))).join('');
  $('#tiles-ex').innerHTML = PAGES.filter((p) => p.ex).map((p) => mk(p, 'Ü' + p.ex)).join('');
  $('#tiles-know').innerHTML = [['quiz', '?'], ['literatur', 'Lit'], ['glossar', 'A–Z']].map(([id, n]) => mk(pageById(id), n)).join('');
}

function renderPagers() {
  for (const el of $$('[data-pager]')) {
    const id = el.closest('.page').dataset.page;
    const i = PAGES.findIndex((p) => p.id === id);
    const prev = PAGES[i - 1], next = PAGES[i + 1];
    el.innerHTML = (prev ? `<a href="#${prev.id}"><span class="label">← Zurück</span><b>${esc(prev.t)}</b></a>` : '<span></span>') +
      (next ? `<a href="#${next.id}"><span class="label">Weiter →</span><b>${esc(next.t)}</b></a>` : '');
  }
}

const pageHooks = {};
function show(id, focus = false) {
  if (!pageById(id)) return false;
  for (const p of $$('.page')) p.classList.toggle('active', p.dataset.page === id);
  for (const a of $$('[data-nav]')) {
    if (a.dataset.nav === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
  $('#app').classList.remove('nav-open');
  $('#menu-btn').setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
  document.title = (id === 'home' ? '' : pageById(id).t + ' · ') + 'Layout und Raster Lernmodul';
  // Beim Seitenwechsel den Fokus auf die neue Überschrift setzen (WCAG 2.4.3)
  if (focus) { const h = $(`#p-${id} h1`); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  // Video anhalten, wenn die Seite verlassen wird
  const v = $('#komp-video'); if (v && id !== 'komposition' && !v.paused) v.pause();
  if (pageHooks[id]) pageHooks[id]();
  store.set('last', id);
  return true;
}
function route(e) {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) { show('home', !!e); return; }
  if (!show(id, !!e) && !$('.page.active')) show('home');
}

/* ================================================================
   Fortschritt
   ================================================================ */
const done = new Set(store.get('done', []));
function setDone(id, v) {
  if (v) done.add(id); else done.delete(id);
  store.set('done', [...done]);
  updateProgress();
}
function markDone(id) {
  if (!done.has(id)) { setDone(id, true); toast('Übung als erledigt gespeichert'); }
}
function updateProgress() {
  const n = EX_IDS.filter((id) => done.has(id)).length;
  const pct = (n / EX_IDS.length) * 100 + '%';
  $('#side-count').textContent = `${n}/${EX_IDS.length}`;
  $('#side-bar').style.width = pct;
  $('#home-bar').style.width = pct;
  $('#home-count').textContent = `${n} / ${EX_IDS.length} Übungen`;
  for (const id of EX_IDS) {
    const dot = $(`[data-nav="${id}"] .done-dot`); if (dot) dot.hidden = !done.has(id);
    const tag = $(`[data-tile="${id}"] .tag-done`); if (tag) tag.hidden = !done.has(id);
  }
  for (const el of $$('.ex-done')) {
    const id = el.dataset.ex, d = done.has(id);
    el.innerHTML = `<span class="state${d ? ' is-done' : ''}">${d ? '✓ Diese Übung ist erledigt.' : 'Fertig? Markieren Sie die Übung, um Ihren Fortschritt zu speichern.'}</span>
      <button class="btn ${d ? '' : 'btn-primary'}" type="button" data-toggle-done="${id}">${d ? 'Als offen markieren' : 'Als erledigt markieren'}</button>`;
  }
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-toggle-done]');
  if (!b) return;
  const id = b.dataset.toggleDone;
  setDone(id, !done.has(id));
  toast(done.has(id) ? 'Übung als erledigt gespeichert' : 'Übung wieder offen');
  const nb = $(`[data-toggle-done="${id}"]`); if (nb) nb.focus();
});

/* Umschalter mit aria-pressed (Gruppe aus Buttons) */
function pressGroup(root, btn) {
  for (const b of $$('button', root)) b.setAttribute('aria-pressed', String(b === btn));
}
/* Toggle-Gruppe verdrahten: ruft fn(button) beim Klick */
function onToggle(root, fn) {
  root.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b || !root.contains(b)) return; pressGroup(root, b); fn(b); });
}

/* ================================================================
   Kapitel 01 · Mit und ohne Raster
   ================================================================ */
function initEinleitung() {
  const svg = $('#intro-svg');
  const M = 40, G = 16, CW = (520 - 5 * G) / 6, ST = CW + G;
  const cx = (i) => M + i * ST, sw = (n) => n * CW + (n - 1) * G;
  const EL = {
    H: { w: sw(4), h: 48, draw: (w, h) => `<rect class="blk" width="${w}" height="${h}" rx="2"/><text x="16" y="32" fill="#fff" style="font:700 24px var(--f-body)">Überschrift</text>` },
    I: { w: sw(3), h: 168, draw: (w, h) => `<rect class="img" width="${w}" height="${h}" rx="2"/><path d="M0 ${h} L${w * 0.35} ${h * 0.45} L${w * 0.6} ${h * 0.75} L${w * 0.75} ${h * 0.6} L${w} ${h}Z" fill="rgba(80,40,120,.35)"/><circle cx="${w * 0.78}" cy="${h * 0.28}" r="16" fill="rgba(255,255,255,.7)"/>` },
    T1: { w: sw(2), h: 96, draw: (w, h) => lines(0, 0, w, h) },
    T2: { w: sw(2), h: 96, draw: (w, h) => lines(0, 0, w, h) },
    N: { w: sw(3), h: 22, draw: (w, h) => `<rect class="acc" width="${w}" height="${h}" rx="2"/><text x="10" y="15.5" fill="#fff" style="font:600 12px var(--f-body)">Infozeile · 14. Mai · Hörsaal E 201</text>` }
  };
  const POS = {
    free: { H: [95, 28, -2], I: [300, 92, 3], T1: [42, 150, 0], T2: [392, 284, -4], N: [130, 336, 2] },
    grid: { H: [cx(0), 40, 0], I: [cx(0), 104, 0], T1: [cx(3), 104, 0], T2: [cx(3), 216, 0], N: [cx(0), 290, 0] }
  };
  let guides = '';
  for (let i = 0; i < 6; i++) guides += `<rect class="guide-f" x="${cx(i)}" y="${M}" width="${CW}" height="${400 - 2 * M}"/>`;
  svg.innerHTML = `<rect class="pg" x="0.5" y="0.5" width="599" height="399" rx="6"/><g id="intro-g" style="display:none">${guides}</g>` +
    Object.entries(EL).map(([k, e]) => `<g class="el" data-k="${k}">${e.draw(e.w, e.h)}</g>`).join('');
  const CAP = {
    free: 'Frei platziert: Die fünf Elemente haben keine gemeinsamen Kanten und sind leicht gedreht. Das Auge springt hin und her und findet keinen klaren Einstieg.',
    grid: 'Am Raster: Alle Elemente stehen auf sechs Spalten und teilen sich Kanten. Die Reihenfolge Überschrift, Bild, Text, Infozeile ist sofort klar, und die leere sechste Spalte gibt Luft.'
  };
  const draw = (m) => {
    for (const g of $$('.el', svg)) { const [x, y, r] = POS[m][g.dataset.k]; g.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`; }
    $('#intro-cap').textContent = CAP[m];
  };
  onToggle($('#intro-mode'), (b) => draw(b.dataset.m));
  $('#intro-guides').addEventListener('change', (e) => { $('#intro-g').style.display = e.target.checked ? '' : 'none'; });
  draw('free');
}

/* ================================================================
   Kapitel 02 · Satzspiegel auf der Doppelseite
   ================================================================ */
const PW = 210, PH = 297;
const SS = {
  9: { n: 'Neunerteilung', in: PW / 9, top: PH / 9, out: 2 * PW / 9, bot: 2 * PH / 9, d: 'Breite und Höhe in je 9 Teile. Bund und Kopf 1 Teil, Außen und Fuß 2 Teile. Die Ecken liegen auf den Diagonalen.' },
  12: { n: 'Zwölferteilung', in: PW / 12, top: PH / 12, out: 2 * PW / 12, bot: 2 * PH / 12, d: 'Wie die Neunerteilung, aber mit 12 Teilen: schmalere Stege, mehr Platz für Inhalt. Die Ecken liegen ebenfalls auf den Diagonalen.' },
  mod: { n: 'Modern gleichmäßig', in: 20, top: 20, out: 20, bot: 25, d: 'Ringsum 20 mm, unten 25 mm. Die Diagonalen spielen keine Rolle. Der Satzspiegel ist groß und sachlich.' }
};
function initSatzspiegel() {
  const svg = $('#ss-svg'), X0 = 20, Y0 = 16;
  const draw = (k) => {
    const s = SS[k], w = PW - s.in - s.out, h = PH - s.top - s.bot;
    const L = X0, R = X0 + PW;
    let g = `<rect class="shadow" x="${L + 3}" y="${Y0 + 3}" width="${2 * PW}" height="${PH}"/><rect class="pg" x="${L}" y="${Y0}" width="${PW}" height="${PH}"/><rect class="pg" x="${R}" y="${Y0}" width="${PW}" height="${PH}"/><line x1="${R}" y1="${Y0}" x2="${R}" y2="${Y0 + PH}" stroke="var(--line)" stroke-width="1.5"/>`;
    g += `<rect class="ss" x="${L + s.out}" y="${Y0 + s.top}" width="${w}" height="${h}"/><rect class="ss" x="${R + s.in}" y="${Y0 + s.top}" width="${w}" height="${h}"/>`;
    if (k !== 'mod') {
      // Seitendiagonalen vom Bund oben zur Außenecke unten und die beiden Diagonalen der Doppelseite
      g += `<line class="diag" x1="${R}" y1="${Y0}" x2="${R + PW}" y2="${Y0 + PH}"/><line class="diag" x1="${R}" y1="${Y0}" x2="${L}" y2="${Y0 + PH}"/>`;
      g += `<line class="diag" x1="${L}" y1="${Y0 + PH}" x2="${R + PW}" y2="${Y0}"/><line class="diag" x1="${L}" y1="${Y0}" x2="${R + PW}" y2="${Y0 + PH}"/>`;
    }
    g += `<text class="lbl-s" x="${R + 4}" y="${Y0 + PH - 6}">Bund</text><text class="lbl-s" x="${R + PW - 34}" y="${Y0 + PH - 6}">außen</text>`;
    svg.innerHTML = g;
    $('#ss-text').textContent = `${s.n}: ${s.d}`;
    const share = (w * h) / (PW * PH) * 100;
    $('#ss-vals').innerHTML = [['Bundsteg', s.in], ['Kopfsteg', s.top], ['Außensteg', s.out], ['Fußsteg', s.bot]].map(([t, v]) => `<div><dt>${t}</dt><dd>${fmt(v, 2)} mm</dd></div>`).join('') +
      `<div><dt>Satzspiegel</dt><dd>${fmt(w, 1)} × ${fmt(h, 1)} mm</dd></div><div><dt>Anteil an der Seite</dt><dd>${fmt(share, 0)} %</dd></div>`;
  };
  onToggle($('#ss-mode'), (b) => draw(b.dataset.k));
  draw('9');
}

/* ================================================================
   Kapitel 03 · Spalten und Zeilenlänge
   ================================================================ */
function initSpalten() {
  const svg = $('#sp-svg'), M = 20, W = PW - 2 * M;
  const draw = () => {
    const n = +$('#sp-n').value, g = +$('#sp-g').value, pt = +$('#sp-f').value;
    $('#sp-n-o').textContent = n; $('#sp-g-o').textContent = `${g} mm`; $('#sp-f-o').textContent = `${pt} pt`;
    const cw = (W - (n - 1) * g) / n, chars = Math.round(cw / (0.5 * pt * 0.353));
    const lh = pt * 1.25 * 0.353;
    let s = `<rect class="pg" x="0" y="0" width="${PW}" height="${PH}"/>`;
    for (let i = 0; i < n; i++) s += `<rect class="guide-f" x="${M + i * (cw + g)}" y="${M}" width="${cw}" height="${PH - 2 * M}"/>`;
    s += `<rect class="blk" x="${M}" y="${M}" width="${W}" height="14"/>`;
    for (let i = 0; i < n; i++) {
      const x = M + i * (cw + g);
      for (let y = M + 24; y < PH - M - 2; y += lh) s += `<rect class="txt" x="${x}" y="${y}" width="${cw}" height="${Math.max(0.6, lh * 0.35)}"/>`;
    }
    svg.innerHTML = s;
    $('#sp-vals').innerHTML = `<div><dt>Satzspiegelbreite</dt><dd>${W} mm</dd></div><div><dt>Spaltenbreite</dt><dd>${fmt(cw, 1)} mm</dd></div><div><dt>Zeichen pro Zeile (ca.)</dt><dd>${chars}</dd></div>`;
    let r;
    const pre = `Spaltenbreite ${fmt(cw, 1)} mm, etwa ${chars} Zeichen pro Zeile. `;
    if (chars < 35) r = '✕ Zu kurz: viele Trennungen, große Wortlücken, unruhiger Lesefluss.';
    else if (chars < 45) r = '○ Knapp: für Zeitungen und Marginalien üblich, für Fließtext eher zu kurz.';
    else if (chars <= 75) r = '✓ Gut lesbar: im Bereich von 45 bis 75 Zeichen.';
    else if (chars <= 90) r = '○ Lang: Das Auge findet den nächsten Zeilenanfang schwerer. Mehr Zeilenabstand hilft.';
    else r = '✕ Zu lang: Teilen Sie die Fläche in mehr Spalten oder vergrößern Sie die Schrift.';
    $('#sp-rate').textContent = pre + r;
  };
  for (const id of ['sp-n', 'sp-g', 'sp-f']) $('#' + id).addEventListener('input', draw);
  draw();
}

/* ================================================================
   Kapitel 04 · Grundlinienraster
   ================================================================ */
function initGrundlinie() {
  const st = $('#bl-stage');
  const cap = () => {
    $('#bl-cap').textContent = st.classList.contains('on')
      ? 'Abstände im Raster: Die Überschrift belegt genau zwei Grundlinien. Danach stehen die Zeilen links und rechts wieder auf gleicher Höhe.'
      : 'Abstände frei: Überschrift und Abstände sind nicht auf das Rastermaß abgestimmt. Ab der Überschrift laufen die Zeilen links neben den Linien.';
  };
  onToggle($('#bl-mode'), (b) => { st.classList.toggle('on', b.dataset.m === 'on'); cap(); });
  const lns = () => st.classList.toggle('lines', $('#bl-lines').checked);
  $('#bl-lines').addEventListener('change', lns);
  lns(); cap();
}

/* ================================================================
   Kapitel 05 · Modulare Kompositionen
   ================================================================ */
function modLayout(C, R) {
  const fits = (occ, c, r, w, h) => { for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) if (occ[y * C + x]) return false; return true; };
  const mark = (occ, c, r, w, h) => { for (let y = r; y < r + h; y++) for (let x = c; x < c + w; x++) occ[y * C + x] = true; };
  const specs = [
    ['h', () => [rand(Math.ceil(C / 2), C), 1]],
    ['i', () => [rand(Math.max(1, Math.floor(C / 2)), C), rand(1, Math.max(1, R - 2))]],
    ['t', () => [rand(1, Math.max(1, Math.ceil(C / 2))), rand(1, Math.max(1, Math.ceil(R / 2)))]],
    ['a', () => [1, 1]]
  ];
  for (let tries = 0; tries < 400; tries++) {
    const occ = new Array(C * R).fill(false), out = [];
    let ok = true;
    for (const [k, f] of specs) {
      let placed = false;
      for (let t = 0; t < 60 && !placed; t++) {
        const [w, h] = f(), c = rand(0, C - w), r = rand(0, R - h);
        if (fits(occ, c, r, w, h)) { mark(occ, c, r, w, h); out.push({ k, c, r, w, h }); placed = true; }
      }
      if (!placed) { ok = false; break; }
    }
    const used = occ.filter(Boolean).length;
    const ar = (k) => { const e = out.find((x) => x.k === k); return e ? e.w * e.h : 0; };
    // Bild ist das größte Element, und es bleibt Weißraum
    if (ok && used < C * R && (C * R < 12 || used <= C * R - 2) && ar('i') >= ar('t') && ar('i') >= (C * R >= 12 ? 2 : 1)) return out;
  }
  return [];
}
function initModular() {
  const row = $('#mod-row'), W = 210, H = 297, M = 14, G = 5;
  let grid = '3x4';
  const draw = () => {
    const [C, R] = grid.split('x').map(Number);
    const fw = (W - 2 * M - (C - 1) * G) / C, fh = (H - 2 * M - (R - 1) * G) / R;
    const rect = (c, r, w, h) => [M + c * (fw + G), M + r * (fh + G), w * fw + (w - 1) * G, h * fh + (h - 1) * G];
    const show = $('#mod-guides').checked;
    row.innerHTML = [1, 2, 3].map((n) => {
      let s = `<rect class="pg" x="0" y="0" width="${W}" height="${H}"/>`;
      if (show) for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) { const [x, y, w, h] = rect(c, r, 1, 1); s += `<rect class="guide-f" x="${x}" y="${y}" width="${w}" height="${h}"/>`; }
      for (const e of modLayout(C, R)) {
        const [x, y, w, h] = rect(e.c, e.r, e.w, e.h);
        if (e.k === 'h') s += `<rect class="blk" x="${x}" y="${y}" width="${w}" height="${Math.min(h, Math.max(18, h * 0.6))}"/>`;
        else if (e.k === 'i') s += `<rect class="img" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
        else if (e.k === 't') s += lines(x, y, w, h, 7, 3);
        else s += `<rect class="acc" x="${x}" y="${y}" width="${w}" height="${Math.min(h, fw)}"/>`;
      }
      return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Komposition ${n} auf einem Raster mit ${C} Spalten und ${R} Zeilen">${s}</svg>`;
    }).join('');
  };
  onToggle($('#mod-grid'), (b) => { grid = b.dataset.g; draw(); });
  $('#mod-new').addEventListener('click', draw);
  $('#mod-guides').addEventListener('change', draw);
  draw();
}

/* ================================================================
   Kapitel 06 · Lesemuster
   ================================================================ */
function initKomposition() {
  const svg = $('#eye-svg');
  const base = `<rect class="pg" x="0.5" y="0.5" width="599" height="339" rx="6"/>
    <rect class="blk" x="40" y="26" width="70" height="20" rx="2"/>${lines(360, 33, 200, 6, 12, 6)}
    <rect class="blk" x="40" y="72" width="290" height="28" rx="2"/>${lines(40, 116, 290, 80, 13, 6)}
    <rect class="img" x="360" y="72" width="200" height="150" rx="2"/>
    ${lines(40, 240, 270, 50, 13, 6)}<rect class="acc" x="440" y="272" width="120" height="36" rx="18"/>`;
  const dot = (x, y, n) => `<circle class="eye-dot" cx="${x}" cy="${y}" r="13"/><text class="eye-n" x="${x}" y="${y}">${n}</text>`;
  const P = {
    z: { g: `<path class="eye-path" d="M75 36 L520 36 L75 290 L500 290"/>` + dot(75, 36, 1) + dot(520, 36, 2) + dot(75, 290, 3) + dot(500, 290, 4),
      c: 'Z-Muster: typisch für Seiten mit wenig Text, etwa Plakate oder Landingpages. Logo oben links, Handlungsaufforderung unten rechts am Ende des Blickwegs.' },
    f: { g: `<path class="eye-path" d="M40 60 H560 M40 60 V320 M40 135 H380 M40 210 H220"/>` + dot(40, 60, 1) + dot(40, 135, 2) + dot(40, 210, 3),
      c: 'F-Muster: typisch für textreiche Seiten. Leserinnen und Leser überfliegen die ersten Zeilen und dann den linken Rand. Wichtiges gehört an den Anfang von Überschriften und Absätzen.' },
    third: { g: `<line class="third" x1="200" y1="0" x2="200" y2="340"/><line class="third" x1="400" y1="0" x2="400" y2="340"/><line class="third" x1="0" y1="113.3" x2="600" y2="113.3"/><line class="third" x1="0" y1="226.7" x2="600" y2="226.7"/>` +
      dot(200, 113.3, 1) + dot(400, 113.3, 2) + dot(200, 226.7, 3) + dot(400, 226.7, 4),
      c: 'Drittelregel: Je zwei Linien teilen die Fläche waagerecht und senkrecht. Die vier Schnittpunkte sind starke Positionen für Blickfänge, spannender als die exakte Mitte.' }
  };
  const draw = (m) => { svg.innerHTML = base + P[m].g; $('#eye-cap').textContent = P[m].c; };
  onToggle($('#eye-mode'), (b) => draw(b.dataset.m));
  draw('z');
}

/* ================================================================
   Kapitel 07 · Responsives Raster
   ================================================================ */
const BPS = [
  { id: 'mobil', n: 'Mobil', from: 0, cols: 4, g: 16, m: 16 },
  { id: 'tablet', n: 'Tablet', from: 600, cols: 8, g: 24, m: 32 },
  { id: 'desktop', n: 'Desktop', from: 1024, cols: 12, g: 24, m: 24, max: 1200 }
];
const bpFor = (w) => BPS.filter((b) => w >= b.from).pop();
const marginFor = (b, w) => (b.max ? Math.max(b.m, (w - b.max) / 2) : b.m);
function initResponsive() {
  const st = $('#rw-stage'), frame = st.parentElement;
  const draw = () => {
    const W = +$('#rw-w').value, b = bpFor(W), m = marginFor(b, W);
    const avail = Math.max(200, frame.clientWidth - 20), s = Math.min(1, avail / W);
    const inner = W - 2 * m, col = (inner - (b.cols - 1) * b.g) / b.cols;
    const span = b.cols === 12 ? 3 : 4, per = b.cols / span;
    $('#rw-w-o').textContent = `${W} px`;
    $('#rw-bp').textContent = `${b.n} · ${b.cols} Spalten à ${fmt(col, 1)} px`;
    st.style.width = W * s + 'px';
    const pad = `0 ${m * s}px`, gap = b.g * s + 'px', tpl = `repeat(${b.cols}, minmax(0, 1fr))`;
    st.innerHTML = `<div class="cols" style="grid-template-columns:${tpl};column-gap:${gap};padding:${pad}">${'<span></span>'.repeat(b.cols)}</div>
      <div class="content" style="grid-template-columns:${tpl};gap:${gap};padding:${12 * s}px ${m * s}px">
        <div class="navb" style="grid-column:1 / -1">Navigation</div>
        <div class="hero" style="grid-column:1 / -1">Hero · ${b.cols}/${b.cols}</div>
        ${[1, 2, 3, 4].map((k) => `<div class="card" style="grid-column:span ${span}">Karte ${k} · ${span}/${b.cols}</div>`).join('')}
      </div>`;
    $('#rw-vals').innerHTML = [['Breakpoint', `${b.n} (ab ${b.from} px)`], ['Spalten', b.cols], ['Gutter', `${b.g} px`], ['Rand', `${fmt(m, 0)} px`], ['Spaltenbreite', `${fmt(col, 1)} px`], ['Karten pro Zeile', `${per} (je ${span} Spalten)`]]
      .map(([t, v]) => `<div><dt>${t}</dt><dd>${v}</dd></div>`).join('');
  };
  $('#rw-w').addEventListener('input', draw);
  pageHooks.responsive = draw;
  window.addEventListener('resize', () => { if ($('#p-responsive').classList.contains('active')) draw(); });
  draw();
}

/* ================================================================
   Kapitel 08 · object-fit
   ================================================================ */
function initBild() {
  const row = $('#fit-row');
  const F = [['16 / 9', '16 : 9 · Hero'], ['1 / 1', '1 : 1 · Kachel'], ['9 / 16', '9 : 16 · Story']];
  row.innerHTML = F.map(([r, l], i) => `<figure><div class="box" style="aspect-ratio:${r}"><img src="media/ue-crop-motiv.webp" alt="${i === 0 ? 'Radfahrer auf einer langen Brücke bei Sonnenaufgang' : ''}" loading="lazy"></div><figcaption>${l}</figcaption></figure>`).join('');
  let mode = 'cover';
  const draw = () => {
    const x = +$('#fit-x').value;
    $('#fit-x-o').textContent = `${x} %`;
    for (const img of $$('img', row)) { img.style.objectFit = mode; img.style.objectPosition = `${x}% 50%`; }
    $('#fit-cap').textContent = mode === 'cover'
      ? `cover füllt jeden Rahmen und schneidet ab. Mit object-position: ${x}% 50% bestimmen Sie, welcher Teil sichtbar bleibt. Bei etwa 75 % bleibt der Radfahrer auch im schmalen Format im Bild.`
      : 'contain zeigt immer das ganze Bild. In abweichenden Formaten entstehen leere Flächen (hier kariert). object-position verschiebt das Bild nur innerhalb dieser Flächen.';
  };
  onToggle($('#fit-mode'), (b) => { mode = b.dataset.f; draw(); });
  $('#fit-x').addEventListener('input', draw);
  draw();
}

/* ================================================================
   Kapitel 10 · Vorher und nachher
   ================================================================ */
function initBearbeitung() {
  const ba = $('#ba');
  const draw = () => {
    const r = +$('#ba-r').value, grid = $('#ba-grid').checked;
    $('#ba-r-o').textContent = `${r} %`;
    $('#ba-before').style.opacity = r / 100;
    for (const el of $$('.ov, .zone', ba)) el.remove();
    if (grid) ba.insertAdjacentHTML('beforeend', `<div class="ov" aria-hidden="true">${'<span></span>'.repeat(12)}</div><div class="zone">Medieninformatik studieren<small>Textzone über Spalte 8–12, mit Abdunklung</small></div>`);
    let c = r >= 50 ? 'Das Original im Format 4 : 5. Es endet links und rechts knapp neben der Person.' : 'Das Ergebnis im Format 16 : 9. Links und rechts sind neue Pixel entstanden, die Person ist unverändert.';
    if (grid) c += ' Raster eingeblendet: Die Person steht etwa in den Spalten 4 bis 6. Rechts bleibt Platz für Text, der Hintergrund ist dort aber so unruhig, dass die Zeile eine Abdunklung braucht.';
    $('#ba-cap').textContent = c;
  };
  $('#ba-r').addEventListener('input', draw);
  $('#ba-grid').addEventListener('change', draw);
  draw();
}

/* ================================================================
   Übung 1 · Satzspiegel konstruieren
   ================================================================ */
function initUeSatzspiegel() {
  const KEYS = [['in', 'Bundsteg'], ['top', 'Kopfsteg'], ['out', 'Außensteg'], ['bot', 'Fußsteg']];
  const st = Object.assign({ in: 20, top: 20, out: 20, bot: 20 }, store.get('u1', {}));
  const solved = new Set(store.get('u1-solved', []));
  let target = '9';
  for (const [k] of KEYS) $('#u1-' + k).value = st[k];
  const score = () => { $('#u1-score').textContent = `Gelöst: ${solved.size} von 2${solved.size ? ' (' + [...solved].map((t) => SS[t].n).join(', ') + ')' : ''}`; };
  const draw = () => {
    for (const [k] of KEYS) { st[k] = +$('#u1-' + k).value; $(`#u1-${k}-o`).textContent = `${fmt(st[k], 1)} mm`; }
    store.set('u1', st);
    const w = PW - st.in - st.out, h = PH - st.top - st.bot;
    let s = `<rect class="pg" x="0" y="0" width="${PW}" height="${PH}"/><line x1="0.8" y1="0" x2="0.8" y2="${PH}" stroke="var(--ink-2)" stroke-width="1.6"/>`;
    if ($('#u1-diag').checked) s += `<line class="diag" x1="0" y1="0" x2="${PW}" y2="${PH}"/><line class="diag" x1="0" y1="${PH / 2}" x2="${PW}" y2="0"/>`;
    if (w > 0 && h > 0) s += `<rect class="ss" x="${st.in}" y="${st.top}" width="${w}" height="${h}" style="fill-opacity:.6"/>`;
    s += `<text class="lbl-s" x="4" y="${PH - 6}">Bund</text>`;
    $('#u1-svg').innerHTML = s;
    const r1 = st.out / st.in, r2 = st.bot / st.top, prop = h / w;
    $('#u1-checks').innerHTML =
      checkRow(r1 >= 1.9 && r1 <= 2.1, 'Außensteg ist doppelt so breit wie der Bundsteg', `jetzt 1 : ${fmt(r1, 2)}`) +
      checkRow(r2 >= 1.9 && r2 <= 2.1, 'Fußsteg ist doppelt so hoch wie der Kopfsteg', `jetzt 1 : ${fmt(r2, 2)}`) +
      checkRow(Math.abs(prop - PH / PW) <= 0.03, 'Satzspiegel hat die Proportion der Seite (1 : 1,414)', `jetzt 1 : ${fmt(prop, 3)}`);
  };
  onToggle($('#u1-target'), (b) => { target = b.dataset.t; $('#u1-fb').innerHTML = ''; });
  for (const [k] of KEYS) $('#u1-' + k).addEventListener('input', draw);
  $('#u1-diag').addEventListener('change', draw);
  $('#u1-check').addEventListener('click', () => {
    const T = SS[target], bad = [];
    for (const [k, n] of KEYS) { const d = st[k] - T[k]; if (Math.abs(d) > 1.5) bad.push(`${n} ist ${d > 0 ? 'zu groß' : 'zu klein'}`); }
    if (!bad.length) {
      solved.add(target); store.set('u1-solved', [...solved]); score();
      $('#u1-fb').innerHTML = `<div class="feedback ok"><p><strong>Richtig konstruiert.</strong> ${T.n}: Satzspiegel ${fmt(PW - T.in - T.out, 1)} × ${fmt(PH - T.top - T.bot, 1)} mm. ${solved.size < 2 ? 'Lösen Sie jetzt das zweite Ziel.' : 'Beide Konstruktionen gelöst.'}</p></div>`;
      if (solved.size === 2) markDone('ue-satzspiegel');
    } else {
      $('#u1-fb').innerHTML = `<div class="feedback bad"><p><strong>Noch nicht ganz.</strong> ${bad.join(', ')}. Toleranz: ± 1,5 mm.</p></div>`;
    }
  });
  $('#u1-hint').addEventListener('click', () => {
    const p = target === '9' ? 9 : 12;
    $('#u1-fb').innerHTML = `<div class="feedback ok"><p><strong>Rechenweg ${SS[target].n}:</strong> Ein Teil der Breite ist 210 ÷ ${p} mm, ein Teil der Höhe 297 ÷ ${p} mm. Bundsteg = 1 Teil der Breite, Außensteg = 2 Teile der Breite. Kopfsteg = 1 Teil der Höhe, Fußsteg = 2 Teile der Höhe.</p></div>`;
  });
  draw(); score();
}

/* ================================================================
   Übung 2 · Raster berechnen und Generator
   ================================================================ */
function initUeRaster() {
  const TASKS = [
    { t: 'Magazin', q: 'A4-Seite, 210 mm breit. Bundsteg 20 mm, Außensteg 15 mm. 4 Spalten mit 5 mm Spaltenabstand. Wie breit ist eine Spalte?', u: 'mm', a: 40, W: 175, n: 4, g: 5 },
    { t: 'Zeitung', q: 'Satzspiegel 289 mm breit, 6 Spalten mit 4 mm Spaltenabstand. Wie breit ist eine Spalte?', u: 'mm', a: 269 / 6, W: 289, n: 6, g: 4 },
    { t: 'Website', q: 'Container 1200 px breit, 12 Spalten, jede Spalte 78 px breit. Wie groß ist der Gutter?', u: 'px', a: 24, W: 1200, n: 12, g: 24 }
  ];
  const saved = store.get('u2', {});
  const prev = (T) => {
    const cw = (T.W - (T.n - 1) * T.g) / T.n, k = 300 / T.W;
    let s = `<rect class="pg" x="0" y="0" width="300" height="60"/>`;
    for (let i = 0; i < T.n; i++) s += `<rect class="guide-f" x="${i * (cw + T.g) * k}" y="0" width="${cw * k}" height="60"/>`;
    return s;
  };
  $('#u2-list').innerHTML = TASKS.map((T, i) => `<div class="item" data-i="${i}"><div><h3>${i + 1}. ${T.t}</h3><p>${esc(T.q)}</p>
    <div class="ans"><label class="visually-hidden" for="u2-in-${i}">Antwort Aufgabe ${i + 1} in ${T.u}</label><input id="u2-in-${i}" inputmode="decimal" autocomplete="off" placeholder="0,0"><span>${T.u}</span><span class="res" aria-live="polite"></span></div></div>
    <svg viewBox="0 0 300 60" aria-hidden="true"><rect class="pg" x="0" y="0" width="300" height="60"/><text class="lbl-s" x="150" y="34" text-anchor="middle">Vorschau nach richtiger Antwort</text></svg></div>`).join('');
  const evalAll = () => {
    let n = 0;
    TASKS.forEach((T, i) => {
      const it = $(`#u2-list .item[data-i="${i}"]`), raw = $('input', it).value.trim().replace(',', '.'), v = parseFloat(raw);
      const ok = raw !== '' && Math.abs(v - T.a) <= 0.1;
      it.classList.toggle('ok', ok);
      const res = $('.res', it);
      res.className = 'res' + (raw ? (ok ? ' ok' : ' bad') : '');
      res.textContent = raw ? (ok ? `✓ richtig (${fmt(T.a, T.a % 1 ? 2 : 0)} ${T.u})` : '✕ noch nicht richtig') : '';
      $('svg', it).innerHTML = ok ? prev(T) : `<rect class="pg" x="0" y="0" width="300" height="60"/><text class="lbl-s" x="150" y="34" text-anchor="middle">Vorschau nach richtiger Antwort</text>`;
      if (ok) n++;
      saved[i] = $('input', it).value;
    });
    store.set('u2', saved);
    $('#u2-status').textContent = `${n} von 3 richtig.${n === 3 ? ' Übung bestanden.' : ''}`;
    if (n === 3) markDone('ue-raster');
  };
  TASKS.forEach((T, i) => { if (saved[i]) $('#u2-in-' + i).value = saved[i]; $('#u2-in-' + i).addEventListener('input', evalAll); });
  evalAll();

  const gen = () => {
    const W = +$('#g-w').value, n = +$('#g-n').value, g = +$('#g-g').value, cw = (W - (n - 1) * g) / n;
    $('#g-w-o').textContent = `${W} px`; $('#g-n-o').textContent = n; $('#g-g-o').textContent = `${g} px`;
    $('#g-vals').innerHTML = `<div><dt>Spaltenbreite</dt><dd>${fmt(cw, 2)} px</dd></div><div><dt>Anteil einer Spalte</dt><dd>${fmt(cw / W * 100, 2)} %</dd></div><div><dt>Summe Gutter</dt><dd>${(n - 1) * g} px</dd></div>`;
    const p = $('#g-prev');
    p.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
    p.style.columnGap = (g / W * 100) + '%';
    p.innerHTML = '<span></span>'.repeat(n);
    const half = Math.round(n / 2);
    $('#g-css').value = `.container {\n  max-width: ${W}px;\n  margin-inline: auto;\n  padding-inline: 16px;\n  display: grid;\n  grid-template-columns: repeat(${n}, minmax(0, 1fr));\n  column-gap: ${g}px;\n}\n/* eine Spalte ist ${fmt(cw, 2).replace(',', '.')}px breit */\n.span-all  { grid-column: 1 / -1; }\n.span-half { grid-column: span ${half}; }`;
  };
  for (const id of ['g-w', 'g-n', 'g-g']) $('#' + id).addEventListener('input', gen);
  $('#g-copy').addEventListener('click', () => copyText($('#g-css').value, 'CSS kopiert'));
  gen();
}

/* ================================================================
   Übung 3 · Plakat aufs Raster setzen (6 × 8 Felder)
   ================================================================ */
function initUePlatzieren() {
  const C = 6, R = 8;
  const EL = [
    { k: 'h', n: 'Überschrift', label: 'Tag der offenen Tür' },
    { k: 'i', n: 'Bild', label: 'Bild' },
    { k: 't', n: 'Text', label: 'Text' },
    { k: 'a', n: 'Datum', label: '14. Mai' }
  ];
  const SAMPLE = { h: { c: 1, w: 6, r: 1, h: 2 }, i: { c: 1, w: 4, r: 3, h: 4 }, t: { c: 5, w: 2, r: 3, h: 4 }, a: { c: 5, w: 2, r: 8, h: 1 } };
  const randomLayout = () => {
    const o = {};
    for (const e of EL) { const w = rand(1, 4), h = rand(1, 3); o[e.k] = { c: rand(1, C - w + 1), w, r: rand(1, R - h + 1), h }; }
    return o;
  };
  let L = store.get('u3', null) || randomLayout(), sel = 'h';
  // Die unveränderte Beispiellösung zählt nicht als eigene Lösung
  let fromSample = store.get('u3-sample', false);
  const poster = $('#u3-poster');
  poster.innerHTML = `<div class="gridl">${'<span></span>'.repeat(C * R)}</div><div class="els">${EL.map((e) => `<div class="el ${e.k}" data-k="${e.k}">${esc(e.label)}</div>`).join('')}</div>`;
  $('#u3-pick').innerHTML = EL.map((e) => `<button type="button" class="chip" data-k="${e.k}" aria-pressed="${e.k === sel}">${e.n}</button>`).join('');
  const FIELDS = [['c', 'Startspalte', C], ['w', 'Breite (Spalten)', C], ['r', 'Startzeile', R], ['h', 'Höhe (Zeilen)', R]];
  const ctrl = () => {
    const p = L[sel];
    $('#u3-ctrl').innerHTML = FIELDS.map(([f, n, max]) => `<div class="field"><label for="u3-${f}">${n}</label><select id="u3-${f}" data-f="${f}">${Array.from({ length: max }, (_, i) => `<option value="${i + 1}"${p[f] === i + 1 ? ' selected' : ''}>${i + 1}</option>`).join('')}</select></div>`).join('');
  };
  const area = (p) => p.w * p.h;
  const overlap = (a, b) => a.c < b.c + b.w && b.c < a.c + a.w && a.r < b.r + b.h && b.r < a.r + a.h;
  const draw = () => {
    const bad = new Set();
    for (let i = 0; i < EL.length; i++) for (let j = i + 1; j < EL.length; j++) if (overlap(L[EL[i].k], L[EL[j].k])) { bad.add(EL[i].k); bad.add(EL[j].k); }
    for (const el of $$('.el', poster)) {
      const p = L[el.dataset.k];
      el.style.gridColumn = `${p.c} / span ${p.w}`; el.style.gridRow = `${p.r} / span ${p.h}`;
      el.classList.toggle('sel', el.dataset.k === sel);
      el.classList.toggle('bad', bad.has(el.dataset.k));
    }
    const used = EL.reduce((s, e) => s + area(L[e.k]), 0), empty = C * R - used;
    const { h, i, t } = L;
    const rules = [
      [!bad.size, 'Keine Elemente überschneiden sich', bad.size ? 'rot gestrichelt markiert' : ''],
      [h.w >= 4, 'Die Überschrift belegt mindestens 4 Spalten', `jetzt ${h.w}`],
      [t.w >= 2 && t.w <= 3, 'Der Text ist 2 oder 3 Spalten breit', `jetzt ${t.w}`],
      [EL.every((e) => e.k === 'i' || area(i) > area(L[e.k])), 'Das Bild ist das größte Element', `${area(i)} Felder`],
      [i.c === t.c || i.r === t.r, 'Bild und Text fluchten: gleiche linke Kante oder gleiche Oberkante', ''],
      [!bad.size && empty >= Math.ceil(C * R * 0.2), 'Mindestens 20 % der Felder bleiben leer', `${empty} von ${C * R} leer`]
    ];
    $('#u3-checks').innerHTML = rules.map(([ok, txt, d]) => checkRow(ok, txt, d)).join('');
    const n = rules.filter((r) => r[0]).length;
    $('#u3-status').textContent = n < rules.length ? `${n} von ${rules.length} Regeln erfüllt.` : fromSample ? 'Die Beispiellösung erfüllt alle 6 Regeln. Verändern Sie sie zu einem eigenen Entwurf, um die Übung abzuschließen.' : '✓ Alle 6 Regeln erfüllt. Ein klares, ruhiges Plakat.';
    store.set('u3', L); store.set('u3-sample', fromSample);
    if (n === rules.length && !fromSample) markDone('ue-platzieren');
  };
  const pick = (k) => { sel = k; pressGroup($('#u3-pick'), $(`#u3-pick [data-k="${k}"]`)); ctrl(); draw(); };
  $('#u3-pick').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) pick(b.dataset.k); });
  poster.addEventListener('click', (e) => { const el = e.target.closest('.el'); if (el) pick(el.dataset.k); });
  $('#u3-ctrl').addEventListener('change', (e) => {
    const f = e.target.dataset.f, p = L[sel]; p[f] = +e.target.value; fromSample = false;
    // Element bleibt immer im Format: Bei Überlauf wird der jeweils andere Wert angepasst
    if (p.c + p.w - 1 > C) { if (f === 'w') p.c = C - p.w + 1; else p.w = C - p.c + 1; }
    if (p.r + p.h - 1 > R) { if (f === 'h') p.r = R - p.h + 1; else p.h = R - p.r + 1; }
    ctrl(); draw(); const s = $('#u3-' + f); if (s) s.focus();
  });
  $('#u3-shuffle').addEventListener('click', () => { L = randomLayout(); fromSample = false; ctrl(); draw(); });
  $('#u3-sample').addEventListener('click', () => { L = JSON.parse(JSON.stringify(SAMPLE)); fromSample = true; ctrl(); draw(); toast('Beispiellösung geladen. Variieren Sie sie!'); });
  $('#u3-guides').addEventListener('change', (e) => poster.classList.toggle('noguides', !e.target.checked));
  ctrl(); draw();
}

/* ================================================================
   Übung 4 · Breakpoints planen
   ================================================================ */
function initUeResponsive() {
  const B = [
    { id: 'mobil', n: 'Mobil', W: 360, cols: 4, g: 16, m: 16 },
    { id: 'tablet', n: 'Tablet', W: 768, cols: 8, g: 24, m: 32 },
    { id: 'desktop', n: 'Desktop', W: 1280, cols: 12, g: 24, m: 40 }
  ];
  const ITEMS = [['hero', 'Hero'], ['c1', 'Karte 1'], ['c2', 'Karte 2'], ['c3', 'Karte 3'], ['c4', 'Karte 4']];
  const S = store.get('u4', {});
  for (const b of B) S[b.id] = Object.assign({ hero: 2, c1: 2, c2: 2, c3: 2, c4: 2 }, S[b.id]);
  let cur = 'mobil';
  const colW = (b) => (b.W - 2 * b.m - (b.cols - 1) * b.g) / b.cols;
  const wOf = (b, span) => span * colW(b) + (span - 1) * b.g;
  const evalBp = (b) => {
    const s = S[b.id], cards = ['c1', 'c2', 'c3', 'c4'].map((k) => s[k]);
    const widths = cards.map((sp) => wOf(b, sp));
    const eq = cards.every((x) => x === cards[0]);
    const fill = eq && b.cols % cards[0] === 0 && cards.length % (b.cols / cards[0]) === 0;
    return { hero: s.hero === b.cols, size: widths.map((w) => w >= 260 && w <= 480), eq, fill, widths };
  };
  const solved = (b) => { const r = evalBp(b); return r.hero && r.size.every(Boolean) && r.eq && r.fill; };
  const bpBtns = () => {
    $('#u4-bp').innerHTML = B.map((b) => `<button type="button" data-b="${b.id}" aria-pressed="${b.id === cur}">${solved(b) ? '✓ ' : ''}${b.n} · ${b.W} px</button>`).join('');
  };
  const ctrl = () => {
    const b = B.find((x) => x.id === cur), s = S[cur];
    $('#u4-ctrl').innerHTML = ITEMS.map(([k, n]) => `<div class="field"><label for="u4-${k}">${n} belegt Spalten</label><select id="u4-${k}" data-k="${k}">${Array.from({ length: b.cols }, (_, i) => `<option value="${i + 1}"${s[k] === i + 1 ? ' selected' : ''}>${i + 1} von ${b.cols}</option>`).join('')}</select></div>`).join('');
  };
  const draw = () => {
    const b = B.find((x) => x.id === cur), s = S[cur], r = evalBp(b);
    const frame = $('#u4-frame'), avail = Math.max(200, frame.clientWidth - 20), k = Math.min(1, avail / b.W);
    const st = $('#u4-stage');
    st.style.width = b.W * k + 'px';
    const tpl = `repeat(${b.cols}, minmax(0, 1fr))`, gap = b.g * k + 'px';
    st.innerHTML = `<div class="cols" style="grid-template-columns:${tpl};column-gap:${gap};padding:0 ${b.m * k}px">${'<span></span>'.repeat(b.cols)}</div>
      <div class="content" style="grid-template-columns:${tpl};gap:${gap};padding:${12 * k}px ${b.m * k}px">
      <div class="hero${r.hero ? '' : ' bad'}" style="grid-column:span ${s.hero}">Hero · ${s.hero}/${b.cols}</div>
      ${['c1', 'c2', 'c3', 'c4'].map((c, i) => `<div class="card${r.size[i] ? '' : ' bad'}" style="grid-column:span ${s[c]}">Karte ${i + 1}<br>${Math.round(r.widths[i])} px</div>`).join('')}</div>`;
    $('#u4-meta').textContent = `Viewport ${b.W} px · ${b.cols} Spalten à ${fmt(colW(b), 1)} px · Gutter ${b.g} px · Rand ${b.m} px. Rot markiert: Regel verletzt.`;
    const minW = Math.min(...r.widths), maxW = Math.max(...r.widths);
    $('#u4-checks').innerHTML =
      checkRow(r.hero, 'Der Hero belegt die volle Breite', `${s.hero} von ${b.cols} Spalten`) +
      checkRow(r.size.every(Boolean), 'Jede Karte ist 260 bis 480 px breit', minW === maxW ? `${Math.round(minW)} px` : `${Math.round(minW)} bis ${Math.round(maxW)} px`) +
      checkRow(r.eq, 'Alle Karten sind gleich breit', '') +
      checkRow(r.fill, 'Die Karten füllen ihre Zeilen ohne Lücke', r.eq && b.cols % s.c1 === 0 ? `${b.cols / s.c1} pro Zeile` : '');
    const n = B.filter(solved).length;
    $('#u4-score').textContent = `Gelöst: ${n} von 3 Breakpoints`;
    bpBtns();
    store.set('u4', S);
    if (n === 3) markDone('ue-responsive');
  };
  $('#u4-bp').addEventListener('click', (e) => { const btn = e.target.closest('[data-b]'); if (!btn) return; cur = btn.dataset.b; ctrl(); draw(); const nb = $(`#u4-bp [data-b="${cur}"]`); if (nb) nb.focus(); });
  $('#u4-ctrl').addEventListener('change', (e) => { const k = e.target.dataset.k; if (!k) return; S[cur][k] = +e.target.value; draw(); });
  pageHooks['ue-responsive'] = draw;
  window.addEventListener('resize', () => { if ($('#p-ue-responsive').classList.contains('active')) draw(); });
  ctrl(); draw();
}

/* ================================================================
   Übung 5 · Bildausschnitt wählen
   ================================================================ */
const IMG_R = 1920 / 1080, SUBJ = { x: 0.770, y: 0.628, hw: 0.035, hh: 0.06 };
function cropGeo(a, st) {
  const z = st.z / 100, ch = 1 / z, cw = (a / IMG_R) / z;
  const left = (st.x / 100) * (1 - cw), top = (st.y / 100) * (1 - ch);
  return { cw, ch, left, top, fx: (SUBJ.x - left) / cw, fy: (SUBJ.y - top) / ch };
}
function cropImgStyle(g) { return `width:${100 / g.cw}%;height:${100 / g.ch}%;left:${-g.left / g.cw * 100}%;top:${-g.top / g.ch * 100}%`; }
function initUeAusschnitt() {
  const F = [{ id: '1x1', n: '1 : 1', a: 1 }, { id: '4x5', n: '4 : 5', a: 0.8 }, { id: '9x16', n: '9 : 16', a: 0.5625 }];
  const S = store.get('u5', {}), saved = store.get('u5-saved', {});
  for (const f of F) S[f.id] = Object.assign({ z: 100, x: 50, y: 50 }, S[f.id]);
  let cur = '1x1';
  const rules = (f, st) => {
    const g = cropGeo(f.a, st);
    const vis = SUBJ.x - SUBJ.hw >= g.left && SUBJ.x + SUBJ.hw <= g.left + g.cw && SUBJ.y - SUBJ.hh >= g.top && SUBJ.y + SUBJ.hh <= g.top + g.ch;
    const dx = Math.min(Math.abs(g.fx - 1 / 3), Math.abs(g.fx - 2 / 3)), dy = Math.min(Math.abs(g.fy - 1 / 3), Math.abs(g.fy - 2 / 3));
    return { g, vis, third: vis && dx <= 0.08 && dy <= 0.1, room: vis && g.fx >= 0.5 };
  };
  const fmtBtns = () => { $('#u5-fmt').innerHTML = F.map((f) => `<button type="button" data-f="${f.id}" aria-pressed="${f.id === cur}">${saved[f.id] ? '✓ ' : ''}${f.n}</button>`).join(''); };
  const savedView = () => {
    $('#u5-saved').innerHTML = F.filter((f) => saved[f.id]).map((f) => { const g = cropGeo(f.a, saved[f.id]); return `<figure><div class="lr-crop" style="width:${120 * f.a}px"><img src="media/ue-crop-motiv.webp" alt="" style="${cropImgStyle(g)}"></div><figcaption>✓ ${f.n}</figcaption></figure>`; }).join('');
    $('#u5-score').textContent = `Gespeichert: ${Object.keys(saved).length} von 3 Formaten`;
  };
  const load = () => { const st = S[cur]; $('#u5-z').value = st.z; $('#u5-x').value = st.x; $('#u5-y').value = st.y; };
  const draw = () => {
    const f = F.find((x) => x.id === cur), st = S[cur];
    st.z = +$('#u5-z').value; st.x = +$('#u5-x').value; st.y = +$('#u5-y').value;
    $('#u5-z-o').textContent = `${st.z} %`; $('#u5-x-o').textContent = `${st.x} %`; $('#u5-y-o').textContent = `${st.y} %`;
    const crop = $('#u5-crop'), h = crop.clientHeight || 360;
    crop.style.width = h * f.a + 'px';
    const r = rules(f, st);
    $('#u5-img').setAttribute('style', cropImgStyle(r.g));
    $('#u5-th').classList.toggle('off', !$('#u5-thirds').checked);
    $('#u5-checks').innerHTML = checkRow(r.vis, 'Der Radfahrer ist vollständig im Bild', '') +
      checkRow(r.third, 'Er steht nahe einem Drittelpunkt', r.vis ? `Position ${fmt(r.g.fx * 100, 0)} % / ${fmt(r.g.fy * 100, 0)} %` : '') +
      checkRow(r.room, 'Vor ihm (links) ist mehr Raum als hinter ihm', '');
    store.set('u5', S);
  };
  $('#u5-fmt').addEventListener('click', (e) => { const b = e.target.closest('[data-f]'); if (!b) return; cur = b.dataset.f; fmtBtns(); load(); draw(); $('#u5-fb').innerHTML = ''; const nb = $(`#u5-fmt [data-f="${cur}"]`); if (nb) nb.focus(); });
  for (const id of ['u5-z', 'u5-x', 'u5-y']) $('#' + id).addEventListener('input', draw);
  $('#u5-thirds').addEventListener('change', draw);
  $('#u5-save').addEventListener('click', () => {
    const f = F.find((x) => x.id === cur), r = rules(f, S[cur]);
    if (r.vis && r.third && r.room) {
      saved[cur] = Object.assign({}, S[cur]); store.set('u5-saved', saved); fmtBtns(); savedView();
      const left = F.filter((x) => !saved[x.id]).map((x) => x.n);
      $('#u5-fb').innerHTML = `<div class="feedback ok"><p><strong>Gespeichert.</strong> ${left.length ? 'Noch offen: ' + left.join(', ') + '.' : 'Alle drei Formate sind fertig.'}</p></div>`;
      if (!left.length) markDone('ue-ausschnitt');
    } else {
      $('#u5-fb').innerHTML = `<div class="feedback bad"><p><strong>Noch nicht gespeichert.</strong> Erfüllen Sie zuerst alle drei Regeln. Tipp: Er fährt nach links, also gehört er ins rechte Drittel.</p></div>`;
    }
  });
  pageHooks['ue-ausschnitt'] = draw;
  fmtBtns(); load(); draw(); savedView();
}

/* ================================================================
   Übung 6 · KI-Bild fürs Layout
   ================================================================ */
function initUeKi() {
  const PB = [
    { n: 'Motiv', o: [
      ['Studierende arbeiten gemeinsam an Laptops in einem hellen Lernraum', 1, 'Konkret und passend zum Studiengang. Die KI weiß, was zu sehen sein soll.'],
      ['ein Laptop', 0, 'Zu vage. Die KI füllt die Lücken mit Klischees, das Ergebnis ist beliebig.'],
      ['Studierende vor dem Hochschullogo mit dem Schriftzug „Medieninformatik“', 0, 'Text und Logos erzeugt die KI unzuverlässig. Schrift gehört ins Layout, nicht ins Bild.']] },
    { n: 'Seitenverhältnis', o: [
      ['quadratisch, 1 : 1', 0, 'Ein Quadrat müsste für den Hero stark beschnitten oder erweitert werden.'],
      ['breites Querformat, 21 : 9', 1, 'Passt zu einem Hero über 12 Spalten. Das Format von Anfang an festzulegen spart Beschnitt.'],
      ['Hochformat, 9 : 16', 0, 'Das ist ein Story-Format, für ein breites Banner ungeeignet.']] },
    { n: 'Freiraum und Komposition', o: [
      ['Personen formatfüllend in der Bildmitte', 0, 'Dann liegt die Überschrift über Gesichtern. Text braucht eine ruhige Zone.'],
      ['Personen links, rechts viele Details', 0, 'Links stehen Überschrift und Button. Hier wären Text und Personen im Konflikt.'],
      ['Personen in der rechten Bildhälfte, links ruhige, unscharfe Fläche', 1, 'Die Spalten 1–5 bleiben frei für Überschrift und Button. Das Bild arbeitet mit dem Raster.']] },
    { n: 'Licht und Stil', o: [
      ['natürliches Tageslicht, dokumentarischer Fotostil, geringe Schärfentiefe', 1, 'Glaubwürdig für eine Hochschule. Geringe Schärfentiefe beruhigt den Hintergrund hinter dem Text.'],
      ['dramatisches Neonlicht, hoher Kontrast, viele Details', 0, 'Unruhig und laut. Text darauf ist schwer lesbar.'],
      ['Comic-Stil, knallige Farben', 0, 'Passt nicht zu den übrigen Fotos der Website und wirkt unseriös.']] },
    { n: 'Ausschlüsse', o: [
      ['keine Angabe', 0, 'Ohne Ausschluss erfindet die KI gern Schriftzüge, Logos oder Wasserzeichen.'],
      ['mit der Überschrift „Jetzt bewerben“ oben links', 0, 'Text im Bild ist weder barrierefrei noch übersetzbar und oft fehlerhaft.'],
      ['ohne Text, ohne Logos, ohne Wasserzeichen', 1, 'Sauberes Bild, die Schrift setzt das Layout als echten Text darüber.']] }
  ];
  const choice = store.get('u6-pb', {});
  let st = store.get('u6', { a: false, b: false });
  $('#u6-pb').innerHTML = PB.map((r, i) => `<div class="row" data-r="${i}"><h3 id="u6-h-${i}">${i + 1}. ${r.n}</h3><div class="chips" role="group" aria-labelledby="u6-h-${i}">${r.o.map((o, k) => `<button type="button" class="chip" data-k="${k}" aria-pressed="${choice[i] === k}">${esc(o[0])}</button>`).join('')}</div><p class="why" hidden></p></div>`).join('');
  const prompt = () => {
    const parts = PB.map((r, i) => (choice[i] != null ? r.o[choice[i]][0] : null)).filter((x) => x && x !== 'keine Angabe');
    $('#u6-prompt').value = parts.length ? 'Fotografie: ' + parts.join(', ') + '.' : '';
  };
  const check = () => {
    const done = st.a && st.b;
    if (done) markDone('ue-ki');
  };
  $('#u6-pb').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]'); if (!b) return;
    const row = b.closest('.row'), i = +row.dataset.r;
    choice[i] = +b.dataset.k; store.set('u6-pb', choice);
    pressGroup(row, b); row.classList.remove('ok', 'bad'); $('.why', row).hidden = true; prompt();
  });
  $('#u6-check').addEventListener('click', () => {
    let right = 0, open = 0;
    PB.forEach((r, i) => {
      const row = $(`#u6-pb .row[data-r="${i}"]`), c = choice[i], why = $('.why', row);
      if (c == null) { open++; row.classList.remove('ok', 'bad'); why.hidden = true; return; }
      const ok = r.o[c][1] === 1; if (ok) right++;
      row.classList.toggle('ok', ok); row.classList.toggle('bad', !ok);
      why.hidden = false; why.textContent = (ok ? '✓ ' : '✕ ') + r.o[c][2];
    });
    if (open) { $('#u6-fb').innerHTML = `<div class="feedback bad"><p>Bitte wählen Sie in allen ${PB.length} Zeilen einen Baustein. Noch offen: ${open}.</p></div>`; return; }
    const ok = right === PB.length;
    if (ok) { st.a = true; store.set('u6', st); }
    $('#u6-fb').innerHTML = ok
      ? `<div class="feedback ok"><p><strong>Teil A bestanden.</strong> Der Prompt legt Format, Freiraum und Stil passend zum Raster fest. Sie können ihn kopieren und in einem Bildgenerator ausprobieren.${st.b ? '' : ' Weiter mit Teil B.'}</p></div>`
      : `<div class="feedback bad"><p><strong>${right} von ${PB.length} Bausteinen passen.</strong> Lesen Sie die Begründungen in den rot markierten Zeilen und wählen Sie neu.</p></div>`;
    check();
  });
  $('#u6-copy').addEventListener('click', () => { if ($('#u6-prompt').value) copyText($('#u6-prompt').value, 'Prompt kopiert'); else toast('Wählen Sie zuerst Bausteine.'); });

  const TECH = [['out', 'Outpainting (Erweitern)'], ['in', 'Inpainting (Retusche)'], ['frei', 'Freistellen'], ['up', 'Upscaling'], ['light', 'Relighting']];
  const CASES = [
    ['out', 'Das hochformatige Foto soll als 16 : 9-Banner über die volle Breite laufen, ohne dass der Kopf der Person abgeschnitten wird.'],
    ['in', 'Neben dem Gesicht der Person steht ein Mülleimer, der vom Motiv ablenkt.'],
    ['frei', 'Das Produktfoto soll ohne seinen Hintergrund auf eine farbige Fläche im Raster gesetzt werden.'],
    ['up', 'Das Bild ist nur 800 px breit, der Hero braucht mindestens 2400 px für scharfe Darstellung.'],
    ['light', 'Ein Teamfoto ist von hinten beleuchtet, das Gesicht ist zu dunkel. Es soll zu den anderen Porträts passen.']
  ];
  const bsel = store.get('u6-b', {});
  const order = shuffle(CASES.map((_, i) => i));
  const opts = `<option value="">– bitte wählen –</option>` + TECH.map(([v, n]) => `<option value="${v}">${n}</option>`).join('');
  $('#u6-cases').innerHTML = order.map((ix, n) => `<div class="fg-kq-item" data-k="${CASES[ix][0]}"><label for="u6-c-${n}" class="label">Fall ${n + 1}</label><p class="small">${esc(CASES[ix][1])}</p><select id="u6-c-${n}">${opts}</select><span class="fg-kq-res" aria-live="polite"></span></div>`).join('');
  for (const it of $$('#u6-cases .fg-kq-item')) { const v = bsel[it.dataset.k]; if (v) $('select', it).value = v; }
  $('#u6-cases').addEventListener('change', () => { const o = {}; for (const it of $$('#u6-cases .fg-kq-item')) o[it.dataset.k] = $('select', it).value; store.set('u6-b', o); });
  $('#u6-bcheck').addEventListener('click', () => {
    let right = 0;
    for (const it of $$('#u6-cases .fg-kq-item')) {
      const v = $('select', it).value, ok = v === it.dataset.k; if (ok) right++;
      it.classList.toggle('ok', ok); it.classList.toggle('bad', !ok);
      $('.fg-kq-res', it).textContent = ok ? '✓ richtig' : v ? `✕ besser: ${TECH.find((t) => t[0] === it.dataset.k)[1]}` : '✕ noch keine Auswahl';
    }
    const pass = right >= 4;
    if (pass) { st.b = true; store.set('u6', st); }
    $('#u6-bfb').innerHTML = `<div class="feedback ${pass ? 'ok' : 'bad'}"><p><strong>${right} von 5 richtig.</strong> ${pass ? (st.a ? 'Teil B bestanden. Damit ist die Übung erledigt.' : 'Teil B bestanden. Lösen Sie noch Teil A.') : 'Ab 4 richtigen Zuordnungen ist Teil B bestanden.'}</p></div>`;
    check();
  });
  $('#u6-breset').addEventListener('click', () => { for (const it of $$('#u6-cases .fg-kq-item')) { $('select', it).value = ''; it.classList.remove('ok', 'bad'); $('.fg-kq-res', it).textContent = ''; } store.set('u6-b', {}); $('#u6-bfb').innerHTML = ''; });
  prompt();
}

/* ================================================================
   Wissenstest
   ================================================================ */
const QUIZ = [
  ['Was ist der Satzspiegel?', ['Die nutzbare Fläche einer Seite innerhalb der Stege', 'Das Inhaltsverzeichnis eines Buches', 'Der Abstand zwischen zwei Spalten', 'Das Papierformat'], 0, 'Der Satzspiegel ist die Fläche für Text und Bild. Die Ränder drumherum heißen Stege.'],
  ['Wie breit ist der Bundsteg einer A4-Seite (210 mm) bei der Neunerteilung?', ['21 mm', '23,3 mm', '33 mm', '46,7 mm'], 1, '210 ÷ 9 = 23,3 mm. Der Bundsteg bekommt einen Teil, der Außensteg zwei.'],
  ['Welcher Steg ist bei klassischen Satzspiegeln am breitesten?', ['Bundsteg', 'Kopfsteg', 'Fußsteg', 'Alle sind gleich breit'], 2, 'Der breite Fußsteg gibt dem Satzspiegel optischen Halt, damit er nicht nach unten zu rutschen scheint.'],
  ['Ein Satzspiegel ist 170 mm breit und hat 3 Spalten mit 5 mm Abstand. Wie breit ist eine Spalte?', ['51,7 mm', '53,3 mm', '55 mm', '56,7 mm'], 1, '(170 − 2 × 5) ÷ 3 = 160 ÷ 3 = 53,3 mm.'],
  ['Wie viele Zeichen pro Zeile gelten für Fließtext als gut lesbar?', ['10 bis 20', '45 bis 75', '90 bis 120', 'Die Zeichenzahl spielt keine Rolle'], 1, 'Kürzere Zeilen zerreißen den Text, längere machen es schwer, den nächsten Zeilenanfang zu finden.'],
  ['Was bedeutet „registerhaltig“?', ['Alle Zeilen stehen auf einem gemeinsamen Grundlinienraster', 'Der Text ist im Blocksatz gesetzt', 'Das Dokument hat ein Register am Ende', 'Alle Bilder haben dieselbe Größe'], 0, 'Dann fluchten die Zeilen benachbarter Spalten und scheinen bei dünnem Papier nicht zwischen den Zeilen der Rückseite durch.'],
  ['Warum nutzen viele Websites ein Raster mit 12 Spalten?', ['Weil Browser nur 12 Spalten darstellen können', 'Weil 12 durch 1, 2, 3, 4, 6 und 12 teilbar ist', 'Weil es eine Vorgabe der WCAG ist', 'Weil Bildschirme 12 Zoll breit sind'], 1, 'Mit 12 Spalten lassen sich Halbe, Drittel, Viertel und Sechstel ohne Rest bilden.'],
  ['Was ist ein Gutter?', ['Der Außenrand der Seite', 'Der Abstand zwischen zwei Spalten', 'Ein Breakpoint für Tablets', 'Der Zeilenabstand'], 1, 'Im Deutschen auch Spaltenabstand oder Zwischenschlag. Im Web meist 16 bis 32 px.'],
  ['Woraus entsteht ein modulares Raster?', ['Nur aus Spalten', 'Aus Spalten und waagerechten Teilungen, die Felder bilden', 'Aus zufällig verteilten Kästen', 'Aus dem Goldenen Schnitt allein'], 1, 'Die Felder (Module) sind die Bausteine. Elemente belegen eines oder mehrere davon.'],
  ['Für welche Seite passt das Z-Muster der Blickführung am besten?', ['Einen langen Fachartikel', 'Eine Tabelle mit Messwerten', 'Ein Plakat oder eine Landingpage mit wenig Text', 'Ein Formular mit vielen Feldern'], 2, 'Bei wenig Text wandert der Blick von links oben nach rechts oben, dann schräg nach links unten und nach rechts unten.'],
  ['Was macht object-fit: cover?', ['Es zeigt das ganze Bild und lässt Ränder frei', 'Es füllt den Rahmen und schneidet überstehende Teile ab', 'Es verzerrt das Bild auf die Rahmengröße', 'Es halbiert die Bildgröße'], 1, 'contain zeigt das ganze Bild, fill verzerrt. Mit object-position steuern Sie, welcher Teil bei cover sichtbar bleibt.'],
  ['Ein Radfahrer fährt im Bild nach links. Wo platzieren Sie ihn im Ausschnitt?', ['Im linken Drittel, nah am Bildrand', 'Genau in der Mitte', 'Im rechten Drittel, mit Raum nach links', 'Ganz am rechten Rand, angeschnitten'], 2, 'Bewegung braucht Raum in Bewegungsrichtung. Sonst wirkt es, als fahre er aus dem Bild.'],
  ['Ein KI-Bild soll links Platz für eine Überschrift lassen. Welcher Prompt-Baustein hilft?', ['„mit der Überschrift oben links“', '„Motiv formatfüllend in der Mitte“', '„Motiv rechts, links ruhige, unscharfe Fläche“', '„viele Details, hoher Kontrast“'], 2, 'Komposition und Freiraum gehören in den Prompt. Text selbst setzt das Layout, nicht die KI.'],
  ['Ein Hochformat soll ohne Beschnitt des Motivs ein 16 : 9-Banner werden. Welche Technik passt?', ['Upscaling', 'Freistellen', 'Outpainting', 'Inpainting'], 2, 'Outpainting (generatives Erweitern) ergänzt die fehlenden Flächen links und rechts. Prüfen Sie das Ergebnis genau.'],
  ['Was gilt für täuschend echte KI-Bilder nach der KI-Verordnung der EU (Art. 50)?', ['Sie dürfen nicht veröffentlicht werden', 'Sie müssen als KI-generiert erkennbar sein', 'Eine Kennzeichnung ist nur bei Werbung nötig', 'Es gibt keine Regeln'], 1, 'Kennzeichnen Sie generierte und stark bearbeitete Bilder, zum Beispiel in Bildunterschrift oder Bildnachweis.']
];
function initQuiz() {
  const root = $('#quiz');
  let i = 0, score = 0, answers = [];
  const render = (focus) => {
    if (i >= QUIZ.length) {
      const pct = Math.round((score / QUIZ.length) * 100), best = store.get('quiz-best', 0);
      if (score > best) store.set('quiz-best', score);
      root.innerHTML = `<div class="quiz-result"><div class="label">Ihr Ergebnis</div><div class="big" tabindex="-1" id="quiz-res">${score}<small> / ${QUIZ.length}</small></div><p style="margin:12px auto;max-width:46ch">${pct >= 80 ? 'Sehr gut. Sie beherrschen die Grundlagen von Layout und Raster.' : pct >= 50 ? 'Solide Basis. Sehen Sie sich die Erklärungen zu den falschen Antworten noch einmal an.' : 'Lesen Sie die Kapitel 01 bis 10 noch einmal und versuchen Sie es dann erneut.'}</p><div class="dots" style="justify-content:center" aria-hidden="true">${answers.map((r) => `<span class="${r ? 'ok' : 'bad'}"></span>`).join('')}</div><p class="small muted">Bestes Ergebnis bisher: ${Math.max(best, score)} / ${QUIZ.length}</p><button class="btn btn-dark" type="button" id="quiz-restart">Test wiederholen</button></div>`;
      $('#quiz-res').focus();
      $('#quiz-restart').addEventListener('click', () => { i = 0; score = 0; answers = []; render(true); });
      return;
    }
    const [q, opts, a, ex] = QUIZ[i];
    root.innerHTML = `<div class="pq-count">Frage ${i + 1} von ${QUIZ.length}</div><h2 class="quiz-q" tabindex="-1" id="quiz-q">${esc(q)}</h2><div class="options">${shuffle(opts.map((_, k) => k)).map((k, n) => `<button type="button" class="opt" data-k="${k}"><span class="k">${'ABCD'[n]}</span>${esc(opts[k])}</button>`).join('')}</div><div id="quiz-fb"></div><div class="dots" aria-hidden="true">${QUIZ.map((_, k) => `<span class="${k < answers.length ? (answers[k] ? 'ok' : 'bad') : k === i ? 'cur' : ''}"></span>`).join('')}</div>`;
    if (focus) $('#quiz-q').focus();
    for (const b of $$('.opt', root)) b.addEventListener('click', () => {
      const k = +b.dataset.k, right = k === a;
      if (right) score++;
      answers.push(right);
      for (const x of $$('.opt', root)) { x.disabled = true; if (+x.dataset.k === a) x.classList.add('right'); }
      if (!right) b.classList.add('wrong');
      $('#quiz-fb').innerHTML = `<div class="feedback ${right ? 'ok' : 'bad'}" role="status"><p><strong>${right ? 'Richtig.' : 'Leider falsch.'}</strong></p><p>${esc(ex)}</p></div><button class="btn btn-dark" type="button" id="quiz-next" style="margin-top:14px">${i + 1 < QUIZ.length ? 'Nächste Frage' : 'Ergebnis anzeigen'}</button>`;
      $('#quiz-next').addEventListener('click', () => { i++; render(true); });
      $('#quiz-next').focus();
    });
  };
  render();
}

/* ================================================================
   Literatur
   ================================================================ */
const LIT = [
  ['1964', 'Programme entwerfen', 'Karl Gerstner', 'Teufen: Arthur Niggli', 'Raster als Programm: Gerstners „beweglicher“ Raster für die Zeitschrift Capital ist ein frühes Beispiel für systematisches Gestalten.'],
  ['1975', 'Ausgewählte Aufsätze über Fragen der Gestalt des Buches und der Typographie', 'Jan Tschichold', 'Basel: Birkhäuser', 'Enthält „Willkürfreie Maßverhältnisse der Buchseite und des Satzspiegels“ mit der Diagonalkonstruktion.'],
  ['1981', 'Rastersysteme für die visuelle Gestaltung', 'Josef Müller-Brockmann', 'Teufen: Arthur Niggli', 'Das Standardwerk zum modularen Raster, zweisprachig Deutsch und Englisch. Bis heute neu aufgelegt.'],
  ['1992', 'The Elements of Typographic Style', 'Robert Bringhurst', 'Vancouver: Hartley & Marks', 'Kapitel zu Seitenproportionen, Satzspiegel und Zeilenlänge, mit vielen historischen Beispielen.'],
  ['1997', 'Lesetypografie', 'Hans Peter Willberg, Friedrich Forssman', 'Mainz: Verlag Hermann Schmidt', 'Das deutschsprachige Standardwerk zu Satzspiegel, Spalten und Lesearten.'],
  ['2002', 'Making and Breaking the Grid', 'Timothy Samara', 'Gloucester: Rockport', 'Viele Fallbeispiele mit Rasteranalyse, auch zum bewussten Bruch des Rasters.'],
  ['2004', 'Grid Systems: Principles of Organizing Type', 'Kimberly Elam', 'New York: Princeton Architectural Press', 'Kompakte Einführung mit Übungen zur Anordnung von Text auf Rastern.'],
  ['2006', 'F-Shaped Pattern For Reading Web Content', 'Jakob Nielsen', 'Nielsen Norman Group · nngroup.com', 'Eye-Tracking-Studie, die das F-Muster beim Lesen von Webseiten beschreibt.'],
  ['2010', 'Thinking with Type', 'Ellen Lupton', 'New York: Princeton Architectural Press, 2. Auflage', 'Gut lesbare Einführung in Buchstabe, Text und Raster, mit Kapitel zu Rastern im Web.'],
  ['Web', 'Layout: Understanding layout', 'Google', 'Material Design 3 · m3.material.io', 'Spalten, Ränder und Breakpoints eines verbreiteten Design-Systems.'],
  ['Web', 'CSS Grid Layout', 'MDN Web Docs', 'developer.mozilla.org', 'Referenz und Tutorials zu grid-template-columns, gap und Zeilen- und Spaltenbelegung.'],
  ['Norm', 'Verordnung (EU) 2024/1689 (KI-Verordnung)', 'Europäische Union', 'Amtsblatt der EU, 2024', 'Artikel 50 regelt Transparenzpflichten für KI-generierte und manipulierte Inhalte.']
];
function initLit() {
  $('#lit').innerHTML = LIT.map(([y, t, by, pub, d]) => `<div class="lit-item"><span class="yr">${y}</span><div><h3>${esc(t)}</h3><div class="by">${esc(by)} · ${esc(pub)}</div><p>${esc(d)}</p></div></div>`).join('');
}

/* ================================================================
   Stichwortverzeichnis
   ================================================================ */
const GL = [
  ['Anschnitt', 'Format', 'Bild oder Fläche läuft über den Satzspiegel hinaus bis zur Blattkante. Im Druck mit 3 mm Beschnittzugabe angelegt.', 'satzspiegel'],
  ['Außensteg', 'Format', 'Rand zwischen Satzspiegel und äußerer Blattkante. Bei klassischen Teilungen doppelt so breit wie der Bundsteg.', 'satzspiegel'],
  ['Bento Grid', 'Web', 'Layout aus unterschiedlich großen Kacheln in einem Raster, benannt nach der japanischen Bento-Box.', 'responsive'],
  ['Blickführung', 'Komposition', 'Lenkung des Blicks durch Position, Größe, Kontrast und Richtung von Elementen.', 'komposition'],
  ['Breakpoint', 'Web', 'Viewport-Breite, ab der sich ein Layout ändert, z. B. von 4 auf 8 Spalten.', 'responsive'],
  ['Bundsteg', 'Format', 'Innenrand einer Seite zur Bindung hin.', 'satzspiegel'],
  ['Container', 'Web', 'Element, das den Inhalt einer Website auf eine Maximalbreite begrenzt und zentriert.', 'responsive'],
  ['Content Credentials', 'KI', 'Herkunftsdaten nach dem Standard C2PA, die Erstellung und Bearbeitung einer Datei dokumentieren.', 'ki-bearbeitung'],
  ['CSS Grid', 'Web', 'CSS-Layoutmodul für zweidimensionale Raster mit Spalten, Zeilen und Abständen.', 'responsive'],
  ['Diagonalkonstruktion', 'Format', 'Klassische Konstruktion des Satzspiegels mit Seiten- und Doppelseitendiagonalen (Villard, van de Graaf, Tschichold).', 'satzspiegel'],
  ['Drittelregel', 'Komposition', 'Teilung der Fläche durch je zwei waagerechte und senkrechte Linien. Die Schnittpunkte sind starke Bildpositionen.', 'komposition'],
  ['F-Muster', 'Komposition', 'Typisches Lesemuster auf textreichen Webseiten: erste Zeilen quer, dann den linken Rand hinunter.', 'komposition'],
  ['Fokuspunkt', 'Bild', 'Bildstelle, die bei jedem Zuschnitt sichtbar bleiben soll. Im Web über object-position gesteuert.', 'bild'],
  ['Freistellen', 'KI', 'Motiv vom Hintergrund lösen, um es auf eine andere Fläche zu setzen.', 'ki-bearbeitung'],
  ['Fußsteg', 'Format', 'Unterer Rand einer Seite, klassisch der breiteste Steg.', 'satzspiegel'],
  ['Goldener Schnitt', 'Komposition', 'Teilungsverhältnis von etwa 1 : 1,618, oft als besonders harmonisch empfunden.', 'komposition'],
  ['Grundlinienraster', 'Raster', 'Waagerechte Hilfslinien im Abstand des Zeilenabstands, auf denen alle Textzeilen stehen.', 'grundlinie'],
  ['Gutter', 'Raster', 'Abstand zwischen zwei Spalten, auch Spaltenabstand oder Zwischenschlag.', 'spalten'],
  ['Hierarchie', 'Komposition', 'Rangfolge der Inhalte, sichtbar durch Größe, Position, Gewicht und Farbe.', 'komposition'],
  ['Inpainting', 'KI', 'Generatives Füllen einer markierten Bildstelle, z. B. um störende Gegenstände zu entfernen.', 'ki-bearbeitung'],
  ['Kolumnentitel', 'Format', 'Wiederkehrende Zeile im Kopf oder Fuß einer Seite, etwa mit Kapitelname und Seitenzahl.', 'satzspiegel'],
  ['Kopfsteg', 'Format', 'Oberer Rand einer Seite.', 'satzspiegel'],
  ['Marginalspalte', 'Raster', 'Schmale Randspalte für Bildunterschriften, Anmerkungen und Zitate.', 'spalten'],
  ['Modulares Raster', 'Raster', 'Raster aus Spalten und Zeilen, das die Fläche in gleich große Felder teilt.', 'modular'],
  ['Neunerteilung', 'Format', 'Satzspiegelkonstruktion: Breite und Höhe in 9 Teile, Bund und Kopf 1 Teil, Außen und Fuß 2 Teile.', 'satzspiegel'],
  ['object-fit', 'Web', 'CSS-Eigenschaft, die festlegt, wie ein Bild seinen Rahmen füllt: cover, contain, fill.', 'bild'],
  ['Outpainting', 'KI', 'Generatives Erweitern eines Bildes über seine Ränder hinaus, z. B. für ein anderes Seitenverhältnis.', 'ki-bearbeitung'],
  ['Prompt', 'KI', 'Textanweisung an ein generatives Modell. Für Layouts gehören Format, Freiraum und Stil hinein.', 'ki-generierung'],
  ['Rasterbruch', 'Komposition', 'Bewusstes Abweichen vom Raster, um ein Element zu betonen.', 'komposition'],
  ['Rasterfeld', 'Raster', 'Kleinste Einheit eines modularen Rasters, auch Modul genannt.', 'modular'],
  ['Registerhaltigkeit', 'Typografie', 'Alle Zeilen stehen auf einem gemeinsamen Grundlinienraster, auch über Spalten und Seiten hinweg.', 'grundlinie'],
  ['Relighting', 'KI', 'Generatives Ändern von Lichtrichtung und Lichtstimmung eines Bildes.', 'ki-bearbeitung'],
  ['Satzspiegel', 'Format', 'Nutzfläche einer Seite für Text und Bild innerhalb der Stege.', 'satzspiegel'],
  ['Seitenverhältnis', 'Bild', 'Verhältnis von Breite zu Höhe, z. B. 16 : 9, 4 : 5 oder 1 : 1.', 'bild'],
  ['Spaltenraster', 'Raster', 'Senkrechte Teilung des Satzspiegels in Spalten mit festen Abständen.', 'spalten'],
  ['Upscaling', 'KI', 'Vergrößern eines Bildes mit KI, die fehlende Details ergänzt.', 'ki-bearbeitung'],
  ['Vertikaler Rhythmus', 'Web', 'Zeilenhöhen und Abstände als Vielfache eines Basismaßes, z. B. 8 px.', 'grundlinie'],
  ['Viewport', 'Web', 'Sichtbarer Bereich des Browserfensters. Seine Breite bestimmt den Breakpoint.', 'responsive'],
  ['Weißraum', 'Komposition', 'Ungefüllte Fläche im Layout. Sie trennt, gliedert und betont.', 'komposition'],
  ['Z-Muster', 'Komposition', 'Blickverlauf bei wenig Text: oben quer, schräg zurück, unten quer.', 'komposition'],
  ['Zeilenlänge', 'Typografie', 'Anzahl der Zeichen pro Zeile. Gut lesbar sind 45 bis 75 Zeichen.', 'spalten'],
  ['Zwölferteilung', 'Format', 'Satzspiegelkonstruktion wie die Neunerteilung, aber mit 12 Teilen und größerem Satzspiegel.', 'satzspiegel'],
  ['8-px-Raster', 'Web', 'Basismaß für Abstände und Größen in Design-Systemen: 8, 16, 24, 32 … px.', 'responsive'],
  ['12-Spalten-Raster', 'Web', 'Verbreitetes Web-Raster, weil 12 durch 1, 2, 3, 4, 6 und 12 teilbar ist.', 'responsive']
];
function initGlossar() {
  const cats = ['Alle', ...[...new Set(GL.map((g) => g[1]))].sort((a, b) => a.localeCompare(b, 'de'))];
  let cat = 'Alle', q = '';
  $('#gl-cats').innerHTML = cats.map((c) => `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === cat}">${c}</button>`).join('');
  const norm = (s) => s.toLowerCase();
  const letterOf = (t) => (/^[0-9]/.test(t) ? '#' : t[0].toUpperCase());
  const render = () => {
    const list = GL.filter((g) => (cat === 'Alle' || g[1] === cat) && (!q || norm(g[0] + ' ' + g[2]).includes(norm(q)))).sort((a, b) => a[0].localeCompare(b[0], 'de'));
    const letters = [...new Set(list.map((g) => letterOf(g[0])))];
    $('#gl-count').textContent = `${list.length} ${list.length === 1 ? 'Begriff' : 'Begriffe'}`;
    $('#gl-az').innerHTML = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((L) => letters.includes(L) ? `<a href="#" data-jump="${L === '#' ? 'num' : L}">${L}</a>` : `<span aria-hidden="true">${L}</span>`).join('');
    if (!list.length) { $('#gl-list').innerHTML = `<p class="gl-empty">Kein Begriff gefunden. Prüfen Sie die Schreibweise oder wählen Sie „Alle“.</p>`; return; }
    let html = '', last = '';
    for (const [t, c, d, p] of list) {
      const L = letterOf(t);
      if (L !== last) { html += `<div class="gl-letter" id="gl-${L === '#' ? 'num' : L}">${L}</div>`; last = L; }
      html += `<div class="gl-item"><div><h3>${esc(t)}</h3><span class="cat">${esc(c)}</span></div><div><p>${esc(d)}</p><p class="see">→ <a href="#${p}">${esc(pageById(p).t)}</a></p></div></div>`;
    }
    $('#gl-list').innerHTML = html;
  };
  $('#gl-cats').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; cat = b.dataset.cat; pressGroup($('#gl-cats'), b); render(); });
  $('#gl-search').addEventListener('input', (e) => { q = e.target.value.trim(); render(); });
  $('#gl-az').addEventListener('click', (e) => { const a = e.target.closest('[data-jump]'); if (!a) return; e.preventDefault(); const t = $('#gl-' + a.dataset.jump); if (t) { t.setAttribute('tabindex', '-1'); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); t.focus({ preventScroll: true }); } });
  render();
}

/* ================================================================
   Start
   ================================================================ */
function boot() {
  renderNav();
  renderTiles();
  renderPagers();
  const inits = [initEinleitung, initSatzspiegel, initSpalten, initGrundlinie, initModular, initKomposition, initResponsive, initBild, initBearbeitung,
    initUeSatzspiegel, initUeRaster, initUePlatzieren, initUeResponsive, initUeAusschnitt, initUeKi, initQuiz, initLit, initGlossar];
  // Ein Fehler in einer Demo soll nicht die ganze App lahmlegen
  for (const f of inits) { try { f(); } catch (err) { console.error(f.name, err); } }
  updateProgress();
  // Spaltenköpfe als Label an jede Zelle hängen, damit Tabellen auf dem Handy als Karten lesbar bleiben
  for (const t of $$('.table-wrap table')) {
    const heads = $$('thead th', t).map((th) => th.textContent.trim());
    for (const tr of $$('tbody tr', t)) [...tr.children].forEach((td, i) => { if (heads[i]) td.dataset.label = heads[i]; });
  }
  const closeNav = () => { $('#app').classList.remove('nav-open'); $('#menu-btn').setAttribute('aria-expanded', 'false'); $('#menu-btn').setAttribute('aria-label', 'Navigation öffnen'); };
  $('#menu-btn').addEventListener('click', () => {
    const open = $('#app').classList.toggle('nav-open');
    $('#menu-btn').setAttribute('aria-expanded', String(open));
    $('#menu-btn').setAttribute('aria-label', open ? 'Navigation schließen' : 'Navigation öffnen');
  });
  document.addEventListener('click', (e) => {
    if ($('#app').classList.contains('nav-open') && !e.target.closest('#sidebar') && !e.target.closest('#menu-btn')) closeNav();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#app').classList.contains('nav-open')) { closeNav(); $('#menu-btn').focus(); } });
  window.addEventListener('hashchange', route);
  route();
}
boot();
})();
