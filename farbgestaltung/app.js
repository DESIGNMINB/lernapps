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
const fmt = (n, d = 2) => n.toFixed(d).replace('.', ',');

// Eigener Präfix, damit sich die Lern-Apps auf derselben Domain nicht in die Quere kommen
const store = {
  get(k, d) { try { const v = localStorage.getItem('fg1:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('fg1:' + k, JSON.stringify(v)); } catch (e) { /* Speicher nicht verfügbar */ } }
};

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ================================================================
   Farbmathematik
   ================================================================ */
const C = {
  hex2rgb(h) {
    h = String(h).trim().replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) return null;
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  },
  rgb2hex(r, g, b) { return '#' + [r, g, b].map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('').toUpperCase(); },
  hsl2rgb(h, s, l) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [f(0) * 255, f(8) * 255, f(4) * 255];
  },
  hsl2hex(h, s, l) { return C.rgb2hex(...C.hsl2rgb(h, s, l)); },
  rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0, s = 0; const l = (mx + mn) / 2;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (mx === r) h = 60 * (((g - b) / d) % 6); else if (mx === g) h = 60 * ((b - r) / d + 2); else h = 60 * ((r - g) / d + 4);
    }
    return [(h + 360) % 360, s * 100, l * 100];
  },
  hex2hsl(h) { return C.rgb2hsl(...C.hex2rgb(h)); },
  lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; },
  // Relative Leuchtdichte nach WCAG 2.x
  lum(hex) { const [r, g, b] = C.hex2rgb(hex).map(C.lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; },
  contrast(a, b) { const la = C.lum(a), lb = C.lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); },
  rgb2lab(r, g, b) {
    const [R, G, B] = [r, g, b].map(C.lin);
    const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
    const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
    return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
  },
  deltaE(a, b) { const A = C.rgb2lab(...a), B = C.rgb2lab(...b); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); },
  // Naive Umrechnung ohne Farbprofil – für Lernzwecke
  rgb2cmyk(r, g, b) {
    const k = 1 - Math.max(r, g, b) / 255;
    if (k >= 1) return [0, 0, 0, 100];
    return [(1 - r / 255 - k) / (1 - k), (1 - g / 255 - k) / (1 - k), (1 - b / 255 - k) / (1 - k), k].map((v) => Math.round(v * 100));
  },
  // Text in Schwarz oder Weiß, je nachdem was stärker kontrastiert
  onColor(hex) { return C.contrast(hex, '#FFFFFF') >= C.contrast(hex, '#111111') ? '#FFFFFF' : '#111111'; },
  // Helligkeit im HSL-Raum so verschieben, dass ein Mindestkontrast erreicht wird
  fit(hex, bg, min) {
    const [h, s, l] = C.hex2hsl(hex);
    if (C.contrast(hex, bg) >= min) return hex;
    const darker = C.lum(bg) > 0.18;
    for (let i = 1; i <= 100; i++) {
      const L = clamp(darker ? l - i : l + i, 0, 100), c = C.hsl2hex(h, s, L);
      if (C.contrast(c, bg) >= min) return c;
    }
    return darker ? '#000000' : '#FFFFFF';
  }
};
const ratioText = (r) => fmt(Math.floor(r * 100) / 100) + ' : 1';

/* ================================================================
   Navigation und Seitenstruktur
   ================================================================ */
const ICONS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  einleitung: 'M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z',
  wahrnehmung: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  mischung: 'M9 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM15 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 10a5 5 0 1 0 0 10 5 5 0 0 0 0-10z',
  modelle: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 17.5h7M17.5 14v7',
  ordnungen: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4',
  kontraste: 'M12 3a9 9 0 1 0 0 18zM12 3a9 9 0 0 1 0 18',
  harmonien: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z',
  wirkung: 'M12 21s-7-4.4-9.3-9A5.2 5.2 0 0 1 12 6.5 5.2 5.2 0 0 1 21.3 12C19 16.6 12 21 12 21z',
  interface: 'M3 4h18v13H3zM8 21h8M12 17v4M7 8h6M7 11h10',
  barrierefreiheit: 'M12 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM5 9.5l7 1.5 7-1.5M12 11v4M12 15l-3 5M12 15l3 5',
  'ue-mischer': 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9',
  'ue-codes': 'M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16',
  'ue-kontraste': 'M3 3h18v18H3zM9 9h6v6H9z',
  'ue-harmonie': 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7l4.5 8h-9z',
  'ue-check': 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5M8 11l2 2 4-4',
  'ue-palette': 'M12 3a9 9 0 0 0 0 18c1.2 0 1.8-.8 1.8-1.8 0-1.4-1.3-1.9-1.3-3.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4-4-7.2-9-7.2zM7.5 11.5h.01M10 7.5h.01M15 7.5h.01',
  quiz: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6',
  literatur: 'M4 4h4v16H4zM10 4h4v16h-4zM16 5l3.5-1 3 15.5-3.5 1z',
  glossar: 'M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12M9 8h6M9 11h4'
};

const PAGES = [
  { id: 'home', t: 'Home' },
  { id: 'einleitung', t: 'Einleitung', sub: 'Warum Farbe gestalten', group: 'Theorie & Grundlagen' },
  { id: 'wahrnehmung', t: 'Licht und Wahrnehmung', sub: 'Spektrum, Auge, Metamerie' },
  { id: 'mischung', t: 'Farbmischung', sub: 'Additiv und subtraktiv' },
  { id: 'modelle', t: 'Farbmodelle', sub: 'RGB, HEX, HSL, CMYK, Lab' },
  { id: 'ordnungen', t: 'Farbordnungen', sub: 'Von Newton bis NCS' },
  { id: 'kontraste', t: 'Farbkontraste', sub: 'Die sieben nach Itten' },
  { id: 'harmonien', t: 'Farbharmonien', sub: 'Klänge am Farbkreis', group: 'Gestalten & Anwenden' },
  { id: 'wirkung', t: 'Farbwirkung', sub: 'Psychologie und Kultur' },
  { id: 'interface', t: 'Farbe im Interface', sub: 'Rollen, Tokens, Dark Mode' },
  { id: 'barrierefreiheit', t: 'Barrierefreiheit', sub: 'Kontrast und Farbsehen' },
  { id: 'ue-mischer', t: 'Farbmischer', sub: 'Zielfarben nachmischen', group: 'Übungen', ex: 1 },
  { id: 'ue-codes', t: 'Farbcodes lesen', sub: 'HEX und HSL deuten', ex: 2 },
  { id: 'ue-kontraste', t: 'Kontraste erkennen', sub: 'Simultankontrast und Itten', ex: 3 },
  { id: 'ue-harmonie', t: 'Harmonie-Farbkreis', sub: 'Farbklänge gestalten', ex: 4 },
  { id: 'ue-check', t: 'Kontrast-Check', sub: 'Messen und simulieren', ex: 5 },
  { id: 'ue-palette', t: 'Palette bauen', sub: 'Tokens für Hell und Dunkel', ex: 6 },
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
  const mk = (p, num) => `<a class="ptile" href="#${p.id}" data-tile="${p.id}"><div class="art"><img class="bg" src="media/tile-${p.id}.jpg" alt="" loading="lazy">${p.ex ? '<span class="tag-ex">Übung</span><span class="tag-done" hidden>Erledigt</span>' : ''}<span class="chip-num" aria-hidden="true">${num}</span></div><div class="tile-body"><h3>${esc(p.t)}</h3><p>${esc(p.sub)}</p><span class="go">${p.ex ? 'Übung starten' : 'Kapitel öffnen'}</span></div></a>`;
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
  document.title = (id === 'home' ? '' : pageById(id).t + ' · ') + 'Farbgestaltung Lernmodul';
  // Beim Seitenwechsel den Fokus auf die neue Überschrift setzen (WCAG 2.4.3)
  if (focus) { const h = $(`#p-${id} h1`); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
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
/* Farbfeld mit sichtbarer Beschriftung – Information nie nur über Farbe */
const swatch = (hex, label = '') => `<span class="fg-sw" style="--c:${hex};--on:${C.onColor(hex)}"><span>${esc(label)}${label ? '<br>' : ''}<span class="mono">${hex}</span></span></span>`;

/* ================================================================
   Kapitel 02 · Spektrum und Nachbild
   ================================================================ */
// Annäherung Wellenlänge → sRGB (nach Dan Bruton)
function wl2hex(w) {
  let r = 0, g = 0, b = 0;
  if (w < 440) { r = -(w - 440) / 60; b = 1; } else if (w < 490) { g = (w - 440) / 50; b = 1; } else if (w < 510) { g = 1; b = -(w - 510) / 20; } else if (w < 580) { r = (w - 510) / 70; g = 1; } else if (w < 645) { r = 1; g = -(w - 645) / 65; } else { r = 1; }
  const f = w < 420 ? 0.3 + 0.7 * (w - 380) / 40 : w > 700 ? 0.3 + 0.7 * (780 - w) / 80 : 1;
  return C.rgb2hex(...[r, g, b].map((v) => 255 * (v * f) ** 0.8));
}
function initWahrnehmung() {
  const stops = []; for (let w = 380; w <= 780; w += 10) stops.push(`${wl2hex(w)} ${((w - 380) / 4).toFixed(1)}%`);
  $('#spectrum').style.background = `linear-gradient(90deg, ${stops.join(',')})`;

  const AFTER = [['Rot', '#E0301E', 'Blaugrün'], ['Gelb', '#F5C800', 'Blauviolett'], ['Grün', '#1E9E4A', 'Rosa bis Magenta'], ['Blau', '#1F4FD8', 'Gelb bis Orange']];
  let cur = 0, white = false;
  const stage = $('#after-stage'), hint = $('#after-hint'), tgl = $('#after-toggle');
  $('#after-colors').innerHTML = AFTER.map(([n], i) => `<button type="button" class="chip" data-i="${i}" aria-pressed="${i === 0}">${n}</button>`).join('');
  const draw = () => {
    const [n, c, a] = AFTER[cur];
    stage.style.background = white ? '#FFFFFF' : c;
    tgl.textContent = white ? 'Farbe zeigen' : 'Weiß zeigen';
    tgl.setAttribute('aria-pressed', String(white));
    hint.textContent = white ? `Weiße Fläche. Sehen Sie ein ${a} getöntes Nachbild?` : `Fläche: ${n} (${c}). Erwartetes Nachbild: ${a}.`;
  };
  tgl.addEventListener('click', () => { white = !white; draw(); });
  $('#after-colors').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (!b) return; cur = +b.dataset.i; white = false; pressGroup($('#after-colors'), b); draw(); });
  draw();
}

/* ================================================================
   Kapitel 03 · Additive und subtraktive Mischung
   ================================================================ */
function initMischung() {
  const svg = $('#venn'), desc = $('#venn-desc'), leg = $('#venn-legend');
  const P = [[150, 100], [105, 178], [195, 178]];
  const draw = (mode) => {
    const add = mode === 'add';
    const cols = add ? ['#FF0000', '#00FF00', '#0000FF'] : ['#00FFFF', '#FF00FF', '#FFFF00'];
    svg.innerHTML = `<rect x="0" y="0" width="300" height="280" rx="14" fill="${add ? '#000' : '#fff'}" stroke="var(--line)"/>
      <g style="isolation:isolate">${P.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="74" fill="${cols[i]}" style="mix-blend-mode:${add ? 'screen' : 'multiply'}"/>`).join('')}</g>`;
    desc.innerHTML = add
      ? '<strong>Additiv:</strong> Drei Lichtkegel auf schwarzem Grund. Wo zwei sich überlagern, entstehen die helleren Mischfarben Gelb, Cyan und Magenta. In der Mitte addieren sich alle drei zu Weiß.'
      : '<strong>Subtraktiv:</strong> Drei transparente Druckfarben auf weißem Papier. Wo zwei übereinanderliegen, entstehen die dunkleren Mischfarben Rot, Grün und Blau. In der Mitte bleibt (fast) Schwarz.';
    const rows = add
      ? [['Rot + Grün', '#FFFF00', 'Gelb'], ['Grün + Blau', '#00FFFF', 'Cyan'], ['Blau + Rot', '#FF00FF', 'Magenta'], ['alle drei', '#FFFFFF', 'Weiß']]
      : [['Cyan + Magenta', '#0000FF', 'Blau'], ['Magenta + Gelb', '#FF0000', 'Rot'], ['Gelb + Cyan', '#00FF00', 'Grün'], ['alle drei', '#000000', 'Schwarz']];
    leg.innerHTML = rows.map(([a, c, n]) => `<div><i style="background:${c}"></i><span>${a} = <strong>${n}</strong></span></div>`).join('');
  };
  $('#mix-mode').addEventListener('click', (e) => { const b = e.target.closest('[data-mode]'); if (!b) return; pressGroup($('#mix-mode'), b); draw(b.dataset.mode); });
  draw('add');
}

/* ================================================================
   Kapitel 04 · Farbwähler
   ================================================================ */
function initModelle() {
  const h = $('#pk-h'), s = $('#pk-s'), l = $('#pk-l');
  const draw = () => {
    const H = +h.value, S = +s.value, L = +l.value;
    const rgb = C.hsl2rgb(H, S, L).map(Math.round), hex = C.rgb2hex(...rgb), cmyk = C.rgb2cmyk(...rgb), lab = C.rgb2lab(...rgb).map(Math.round);
    $('#pk-h-o').textContent = H + '°'; $('#pk-s-o').textContent = S + ' %'; $('#pk-l-o').textContent = L + ' %';
    $('#pk-swatch').style.background = hex;
    $('#pk-swatch-label').textContent = hex;
    $('#pk-swatch-label').style.color = C.onColor(hex);
    s.style.setProperty('--track', `linear-gradient(90deg, ${C.hsl2hex(H, 0, L)}, ${C.hsl2hex(H, 100, L)})`);
    l.style.setProperty('--track', `linear-gradient(90deg, #000, ${C.hsl2hex(H, S, 50)}, #fff)`);
    $('#pk-codes').innerHTML = [
      ['HEX', hex], ['RGB', `rgb(${rgb.join(' ')})`], ['HSL', `hsl(${H} ${S}% ${L}%)`],
      ['CMYK', `C ${cmyk[0]} · M ${cmyk[1]} · Y ${cmyk[2]} · K ${cmyk[3]}`], ['Lab', `L ${lab[0]} · a ${lab[1]} · b ${lab[2]}`],
      ['Wahrgenommene Helligkeit', `L* ${lab[0]} (HSL sagt ${L} %)`]
    ].map(([k, v]) => `<div><dt>${k}</dt><dd class="mono">${v}</dd></div>`).join('');
  };
  for (const el of [h, s, l]) el.addEventListener('input', draw);
  draw();
}

/* ================================================================
   Kapitel 05 · Ittens Farbkreis
   ================================================================ */
const ITTEN = [
  ['Gelb', '#F4E300', 1], ['Gelborange', '#F7B500', 3], ['Orange', '#F18A00', 2], ['Rotorange', '#E65A1E', 3],
  ['Rot', '#D7262B', 1], ['Rotviolett', '#A9246E', 3], ['Violett', '#6E2B87', 2], ['Blauviolett', '#44358F', 3],
  ['Blau', '#1F5EA8', 1], ['Blaugrün', '#00909A', 3], ['Grün', '#3BA935', 2], ['Gelbgrün', '#A9C92A', 3]
];
function arcPath(r1, r2, a0, a1) {
  const p = (r, a) => [(r * Math.sin(a)).toFixed(2), (-r * Math.cos(a)).toFixed(2)];
  const [x1, y1] = p(r2, a0), [x2, y2] = p(r2, a1), [x3, y3] = p(r1, a1), [x4, y4] = p(r1, a0);
  const big = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x1} ${y1}A${r2} ${r2} 0 ${big} 1 ${x2} ${y2}L${x3} ${y3}A${r1} ${r1} 0 ${big} 0 ${x4} ${y4}z`;
}
function initOrdnungen() {
  const svg = $('#itten-wheel'), txt = $('#itten-text');
  const step = (Math.PI * 2) / 12;
  const draw = (lvl) => {
    svg.innerHTML = ITTEN.map(([n, c, k], i) => {
      const a0 = i * step - step / 2, a1 = a0 + step, am = i * step;
      const on = lvl === 'all' || +lvl === k;
      const tx = (128 * Math.sin(am)).toFixed(1), ty = (-128 * Math.cos(am) + 4).toFixed(1);
      return `<g opacity="${on ? 1 : 0.15}"><path d="${arcPath(70, 115, a0 + 0.01, a1 - 0.01)}" fill="${c}"/><text x="${tx}" y="${ty}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">${k}</text><title>${n} (${['', 'Grundfarbe', 'Sekundärfarbe', 'Tertiärfarbe'][k]})</title></g>`;
    }).join('') +
      `<path d="M0 -62 53.7 31 -53.7 31z" fill="none" stroke="var(--line)" stroke-width="1.5"/>` +
      ['#F4E300', '#D7262B', '#1F5EA8'].map((c, i) => { const a = i * Math.PI * 2 / 3; return `<circle cx="${(40 * Math.sin(a)).toFixed(1)}" cy="${(-40 * Math.cos(a)).toFixed(1)}" r="13" fill="${c}" opacity="${lvl === 'all' || lvl === '1' ? 1 : 0.15}"/>`; }).join('');
    const names = (k) => ITTEN.filter((x) => x[2] === k).map((x) => x[0]).join(', ');
    txt.textContent = lvl === 'all' ? 'Alle zwölf Farben des Kreises. Die Ziffern 1, 2 und 3 kennzeichnen Grund-, Sekundär- und Tertiärfarben.'
      : lvl === '1' ? `Grundfarben (1): ${names(1)}. Sie lassen sich nach Itten nicht aus anderen Farben mischen.`
        : lvl === '2' ? `Sekundärfarben (2): ${names(2)}. Je aus zwei Grundfarben gemischt, z. B. Gelb + Rot = Orange.`
          : `Tertiärfarben (3): ${names(3)}. Aus einer Grund- und einer benachbarten Sekundärfarbe gemischt.`;
  };
  $('#itten-filter').addEventListener('click', (e) => { const b = e.target.closest('[data-lvl]'); if (!b) return; pressGroup($('#itten-filter'), b); draw(b.dataset.lvl); });
  draw('all');
}

/* ================================================================
   Kapitel 06 · Die sieben Kontraste (Beispielgrafiken werden in Übung 3 wiederverwendet)
   ================================================================ */
const KT = [
  { id: 'farbe', t: 'Farbe-an-sich-Kontrast', short: 'Farbe an sich', d: 'Entsteht durch reine, ungetrübte Farben nebeneinander. Am stärksten wirkt er mit den Grundfarben Gelb, Rot und Blau. Laut, bunt und kraftvoll, typisch für Kinderprodukte, Volkskunst und Pop-Art.', tip: 'Schwarze oder weiße Trennlinien steigern die Leuchtkraft der Farben.',
    svg: () => `<rect width="400" height="240" fill="#fff"/><rect x="20" y="20" width="160" height="200" fill="#D7262B"/><rect x="180" y="20" width="200" height="110" fill="#F4E300"/><rect x="180" y="130" width="120" height="90" fill="#1F5EA8"/><rect x="300" y="130" width="80" height="90" fill="#F4E300"/><path d="M180 20v200M180 130h200M300 130v90" stroke="#111" stroke-width="6"/>` },
  { id: 'helldunkel', t: 'Hell-Dunkel-Kontrast', short: 'Hell-Dunkel', d: 'Der Gegensatz von hellen und dunklen Farben, am stärksten zwischen Weiß und Schwarz. Er ist der wichtigste Kontrast für Lesbarkeit und Hierarchie und funktioniert auch ohne Farbsehen.', tip: 'Prüfen Sie Entwürfe in Graustufen: Was dann verschwindet, hatte zu wenig Hell-Dunkel-Kontrast.',
    svg: () => `<rect width="400" height="240" fill="#14213D"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${30 + i * 58}" y="${150 - i * 18}" width="46" height="${60 + i * 18}" fill="${C.hsl2hex(45, 90, 15 + i * 15)}"/>`).join('')}<circle cx="330" cy="62" r="34" fill="#FFF6D6"/>` },
  { id: 'kaltwarm', t: 'Kalt-Warm-Kontrast', short: 'Kalt-Warm', d: 'Warme Farben wie Rotorange treten scheinbar nach vorn, kalte wie Blaugrün weichen zurück. So entsteht Raumtiefe ohne Perspektive. Stärkstes Paar: Rotorange und Blaugrün.', tip: 'Ein warmer Akzent vor kühlem Hintergrund lenkt den Blick.',
    svg: () => `<rect width="400" height="240" fill="#0E6E78"/><rect y="150" width="400" height="90" fill="#0A5560"/><circle cx="250" cy="120" r="70" fill="#E65A1E"/><circle cx="110" cy="80" r="26" fill="#3E9AA3"/>` },
  { id: 'komplementaer', t: 'Komplementärkontrast', short: 'Komplementär', d: 'Gegenüberliegende Farben im Farbkreis steigern sich gegenseitig zur höchsten Leuchtkraft: Rot und Grün, Blau und Orange, Gelb und Violett. Gemischt ergeben sie ein neutrales Grau.', tip: 'Für Text ungeeignet: Komplementäre Paare gleicher Helligkeit flimmern an der Kante.',
    svg: () => `<rect width="400" height="240" fill="#6E2B87"/><rect x="0" y="0" width="200" height="240" fill="#F4E300"/><circle cx="200" cy="120" r="70" fill="#6E2B87"/><path d="M200 50a70 70 0 0 1 0 140z" fill="#F4E300"/>` },
  { id: 'simultan', t: 'Simultankontrast', short: 'Simultan', d: 'Das Auge erzeugt zu jeder Farbe gleichzeitig ihre Gegenfarbe und färbt damit benachbarte, neutrale Flächen ein. Ein Grau auf Rot wirkt grünlich, auf Grün rötlich, obwohl beide gleich sind.', tip: 'Farben immer in ihrer echten Umgebung beurteilen, nie isoliert.',
    svg: () => `<rect width="200" height="240" fill="#D7262B"/><rect x="200" width="200" height="240" fill="#2E9E4F"/><rect x="70" y="90" width="60" height="60" fill="#8C8C8C"/><rect x="270" y="90" width="60" height="60" fill="#8C8C8C"/>` },
  { id: 'qualitaet', t: 'Qualitätskontrast', short: 'Qualität', d: 'Der Gegensatz zwischen gesättigten, leuchtenden und getrübten, stumpfen Farben. Eine reine Farbe wirkt zwischen gedämpften Tönen besonders intensiv.', tip: 'Ideal, um einen einzelnen Akzent hervorzuheben, ohne die Farbfamilie zu wechseln.',
    svg: () => `<rect width="400" height="240" fill="#B9A9A4"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${20 + (i % 4) * 92}" y="${20 + Math.floor(i / 4) * 110}" width="80" height="90" fill="${i === 5 ? '#E3262D' : C.hsl2hex(356, 12 + (i % 3) * 8, 45 + (i % 4) * 7)}"/>`).join('')}` },
  { id: 'quantitaet', t: 'Quantitätskontrast', short: 'Quantität', d: 'Der Gegensatz zwischen großen und kleinen Farbflächen. Weil helle Farben stärker wirken, braucht ein harmonisches Gleichgewicht weniger Gelb als Violett. Goethe gab die Lichtwerte Gelb 9 und Violett 3 an, also ein Flächenverhältnis von etwa 1 : 3.', tip: 'Eine kleine, kräftige Fläche kann eine große ausbalancieren.',
    svg: () => `<rect width="400" height="240" fill="#6E2B87"/><rect x="300" y="0" width="100" height="240" fill="#F4E300"/>` }
];
function ktSvg(k, label) { return `<svg viewBox="0 0 400 240" role="img" aria-label="${esc(label)}">${k.svg()}</svg>`; }
function initKontraste() {
  const pick = $('#kt-pick'), view = $('#kt-view');
  pick.innerHTML = KT.map((k, i) => `<button type="button" class="chip" data-i="${i}" aria-pressed="${i === 0}">${i + 1} · ${esc(k.short)}</button>`).join('');
  const draw = (i) => {
    const k = KT[i];
    view.innerHTML = `<div class="fg-kt-pic">${ktSvg(k, 'Beispiel ' + k.t)}</div><div><span class="label">Kontrast ${i + 1} von 7</span><h3>${esc(k.t)}</h3><p>${esc(k.d)}</p><p class="small"><strong>Praxis:</strong> ${esc(k.tip)}</p></div>`;
  };
  pick.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (!b) return; pressGroup(pick, b); draw(+b.dataset.i); });
  draw(0);
}

/* ================================================================
   Kapitel 07 · Harmonien
   ================================================================ */
const RULES = [
  { id: 'mono', t: 'Monochrom', d: 'Ein Farbton in verschiedenen Helligkeiten und Sättigungen. Ruhig, elegant, sicher.', h: [0, 0, 0] , l: [25, 50, 80] },
  { id: 'analog', t: 'Analog', d: 'Benachbarte Farbtöne, etwa 30° auseinander. Natürlich und harmonisch, aber kontrastarm.', h: [-30, 0, 30] },
  { id: 'komp', t: 'Komplementär', d: 'Zwei gegenüberliegende Farbtöne (180°). Maximale Spannung, eine Farbe sollte dominieren.', h: [0, 180] },
  { id: 'split', t: 'Split-komplementär', d: 'Grundton plus die beiden Nachbarn seiner Komplementärfarbe (150° und 210°). Spannend, aber weniger hart.', h: [0, 150, 210] },
  { id: 'triade', t: 'Triade', d: 'Drei Farbtöne im gleichseitigen Dreieck (je 120°). Lebendig und ausgewogen.', h: [0, 120, 240] },
  { id: 'tetrade', t: 'Tetrade (Quadrat)', d: 'Vier Farbtöne im Quadrat (je 90°). Sehr vielfältig, braucht eine klare Hauptfarbe.', h: [0, 90, 180, 270] }
];
function ruleColors(r, H, S = 70, L = 50) {
  if (r.id === 'mono') return r.l.map((l) => C.hsl2hex(H, S, l));
  return r.h.map((d) => C.hsl2hex(H + d, S, L));
}
function miniWheel(r, H) {
  let s = ''; for (let i = 0; i < 36; i++) s += `<path d="${arcPath(30, 46, i * Math.PI / 18, (i + 1) * Math.PI / 18 + 0.01)}" fill="${C.hsl2hex(i * 10, 70, 55)}"/>`;
  const pts = (r.id === 'mono' ? [0] : r.h).map((d) => { const a = (H + d) * Math.PI / 180; return [38 * Math.sin(a), -38 * Math.cos(a)]; });
  if (pts.length > 1) s += `<path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}${pts.length > 2 ? 'z' : ''}" fill="none" stroke="var(--ink)" stroke-width="2"/>`;
  s += pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="#fff" stroke="var(--ink)" stroke-width="2"/>`).join('');
  return `<svg viewBox="-50 -50 100 100" aria-hidden="true">${s}</svg>`;
}
function initHarmonien() {
  $('#harm-grid').innerHTML = RULES.map((r) => `<div class="card fg-harm"><div class="fg-harm-top">${miniWheel(r, 210)}<div><h3>${r.t}</h3><p class="small muted">${r.d}</p></div></div><div class="fg-strip">${ruleColors(r, 210).map((c) => swatch(c)).join('')}</div></div>`).join('');
}

/* ================================================================
   Kapitel 08 · Farbbedeutungen
   ================================================================ */
const MEANING = [
  ['Rot', '#D7262B', 'Liebe, Leidenschaft, Energie, Gefahr, Verbot', 'China: Glück und Feier, traditionelle Hochzeitsfarbe'],
  ['Orange', '#F18A00', 'Lebensfreude, Wärme, Geselligkeit, preiswert', 'Niederlande: Nationalfarbe; Hinduismus und Buddhismus: Safran als heilige Farbe'],
  ['Gelb', '#F4E300', 'Sonne, Optimismus, Aufmerksamkeit, aber auch Neid und Warnung', 'China: historisch Farbe des Kaisers'],
  ['Grün', '#3BA935', 'Natur, Gesundheit, Hoffnung, Erlaubnis, Nachhaltigkeit', 'Islam: Farbe des Propheten und des Paradieses'],
  ['Blau', '#1F5EA8', 'Vertrauen, Ruhe, Kompetenz, Kühle, Ferne. In Hellers Befragung die beliebteste Farbe', 'Weltweit häufig als Lieblingsfarbe genannt, oft für Banken und Technik'],
  ['Violett', '#6E2B87', 'Magie, Spiritualität, Extravaganz, Feminismus', 'Thailand und Brasilien: auch Trauerfarbe'],
  ['Weiß', '#FFFFFF', 'Reinheit, Unschuld, Sauberkeit, Leere', 'Teile Ostasiens und Indiens: traditionelle Trauerfarbe'],
  ['Schwarz', '#111111', 'Eleganz, Macht, Ernst, Trauer', 'In der Mode für Luxus und Zeitlosigkeit']
];
function initWirkung() {
  $('#meaning').innerHTML = MEANING.map(([n, c, eu, ot]) => `<div class="fg-mean"><div class="fg-mean-sw" style="background:${c}"></div><div><h3>${n} <span class="mono small muted">${c}</span></h3><p class="small"><strong>Europa:</strong> ${eu}.</p><p class="small muted"><strong>Andere Kontexte:</strong> ${ot}.</p></div></div>`).join('');
}

/* ================================================================
   Kapitel 09 · Interface-Vorschau (auch in Übung 6)
   ================================================================ */
function uiMock(t, r = 12) {
  // t: { bg, surface, text, muted, line, primary, onPrimary, accent, onAccent, success, error }
  return `<div class="fg-mock" style="--bg:${t.bg};--sf:${t.surface};--tx:${t.text};--mu:${t.muted};--ln:${t.line};--pr:${t.primary};--op:${t.onPrimary};--ac:${t.accent};--oa:${t.onAccent};--ok:${t.success};--er:${t.error};--r:${r}px">
    <div class="fg-mock-bar"><b>${esc(t.name || 'Campus App')}</b><span class="fg-mock-nav"><span class="on">Heute</span><span>Woche</span><span>Profil</span></span></div>
    <div class="fg-mock-body">
      <div class="fg-mock-card"><span class="fg-mock-tag">Neu</span><h4>${esc(t.title || 'Tagesgericht')}</h4><p>${esc(t.copy || 'Linsencurry mit Basmatireis und Koriander-Joghurt.')}</p><a href="#" tabindex="-1" onclick="return false">Mehr erfahren</a><div class="fg-mock-btns"><span class="fg-mock-btn">Reservieren</span><span class="fg-mock-btn ghost">Merken</span></div></div>
      <div class="fg-mock-msg ok">✓ Gespeichert</div><div class="fg-mock-msg er">✕ Verbindung fehlgeschlagen</div>
    </div></div>`;
}
const DM = {
  light: { bg: '#F4F1EC', surface: '#FFFFFF', text: '#1E2A3A', muted: '#5B6270', line: '#E2DDD5', primary: '#1E3A5F', onPrimary: '#FFFFFF', accent: '#C2410C', onAccent: '#FFFFFF', success: '#15803D', error: '#B91C1C' },
  dark: { bg: '#111827', surface: '#1F2937', text: '#F3F4F6', muted: '#9CA3AF', line: '#374151', primary: '#93C5FD', onPrimary: '#0B1B33', accent: '#FB923C', onAccent: '#1A0D05', success: '#4ADE80', error: '#F87171' }
};
function initInterface() {
  $('#r6030').innerHTML = `<div class="fg-6030-ui"><div class="n"></div><div class="c"><i></i><i></i><i></i></div><div class="c"><i></i><i></i><b>Jetzt buchen</b></div></div>`;
  const ui = $('#dm-ui');
  const draw = (m) => { ui.innerHTML = uiMock({ ...DM[m], name: 'Mensa heute' }); };
  $('#dm-toggle').addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (!b) return; pressGroup($('#dm-toggle'), b); draw(b.dataset.m); });
  draw('light');
}

/* ================================================================
   Kapitel 10 · Grauverlauf mit Kontrastwerten
   ================================================================ */
function initBarrierefreiheit() {
  const grays = ['#DDDDDD', '#BBBBBB', '#AAAAAA', '#949494', '#858585', '#767676', '#595959', '#333333', '#000000'];
  $('#ramp').innerHTML = grays.map((g) => {
    const r = C.contrast(g, '#FFFFFF'), lvl = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'nur groß' : 'zu schwach';
    return `<div class="fg-ramp-i"><span class="fg-ramp-t" style="color:${g}">Aa</span><span class="mono small">${g}</span><b class="small">${ratioText(r)}</b><span class="fg-badge ${r >= 4.5 ? 'ok' : r >= 3 ? 'mid' : 'bad'}">${lvl}</span></div>`;
  }).join('');

  // Kontrast-Labor: Farben selbst einstellen und nach WCAG prüfen
  const LAB_DEF = { fg: '#8A94A6', bg: '#FFFFFF', ac: '#93C5FD' };
  const LAB_NAME = { fg: 'Textfarbe', bg: 'Hintergrund', ac: 'Akzentfarbe' };
  const LAB_TASKS = [
    { t: 'Kräftiger Farbhintergrund: Hintergrund mit mindestens 50 % Sättigung, Fließtext erreicht AA.', ok: (c) => c.hsl.bg[1] >= 50 && c.r >= 4.5 },
    { t: 'Fließtext nach AAA ohne Schwarz, Weiß oder Grau: beide Farben mit mindestens 15 % Sättigung und einer Helligkeit zwischen 5 und 95 %.', ok: (c) => c.r >= 7 && ['fg', 'bg'].every((k) => c.hsl[k][1] >= 15 && c.hsl[k][2] >= 5 && c.hsl[k][2] <= 95) },
    { t: 'Dunkelmodus: Hintergrund mit höchstens 20 % Helligkeit, Fließtext erreicht AA und Akzent mindestens 3 : 1.', ok: (c) => c.hsl.bg[2] <= 20 && c.r >= 4.5 && c.ra >= 3 }
  ];
  const lab = store.get('lab', { ...LAB_DEF });
  const labDone = store.get('lab-done', []);
  let labKey = 'fg';
  const hs = { h: $('#lab-h'), s: $('#lab-s'), l: $('#lab-l') };
  const labCtrl = () => {
    const [h, s, l] = C.hex2hsl(lab[labKey]).map(Math.round);
    hs.h.value = h; hs.s.value = s; hs.l.value = l;
    $('#lab-name').textContent = LAB_NAME[labKey];
    $('#lab-pick').setAttribute('aria-label', LAB_NAME[labKey] + ' im Farbwähler einstellen');
    for (const k of ['h', 's', 'l']) hs[k].setAttribute('aria-label', `${{ h: 'Farbton', s: 'Sättigung', l: 'Helligkeit' }[k]} der ${LAB_NAME[labKey]}`);
    $('#lab-hex').value = lab[labKey]; $('#lab-hex').removeAttribute('aria-invalid');
  };
  const labDraw = (announce) => {
    const { fg, bg, ac } = lab, h = +hs.h.value, s = +hs.s.value, l = +hs.l.value;
    $('#lab-pick').value = lab[labKey].toLowerCase();
    $('#lab-h-o').textContent = h + '°'; $('#lab-s-o').textContent = s + ' %'; $('#lab-l-o').textContent = l + ' %';
    hs.h.style.setProperty('--track', `linear-gradient(90deg, ${[0, 60, 120, 180, 240, 300, 360].map((x) => C.hsl2hex(x, Math.max(s, 35), clamp(l, 25, 75))).join(', ')})`);
    hs.s.style.setProperty('--track', `linear-gradient(90deg, ${C.hsl2hex(h, 0, l)}, ${C.hsl2hex(h, 100, l)})`);
    hs.l.style.setProperty('--track', `linear-gradient(90deg, #000, ${C.hsl2hex(h, s, 50)}, #fff)`);
    const smp = $('#lab-sample'); smp.style.color = fg; smp.style.background = bg; smp.style.setProperty('--ac', ac);
    const r = C.contrast(fg, bg), ra = C.contrast(ac, bg);
    $('#lab-ratio').textContent = ratioText(r);
    const row = (t, v, min, lvl) => `<li class="${v >= min ? 'ok' : 'bad'}"><span>${v >= min ? '✓ erfüllt' : '✕ nicht erfüllt'}</span>${t} <small>${ratioText(v)} · ${lvl} mind. ${fmt(min, 1)} : 1</small></li>`;
    $('#lab-res').innerHTML = row('Fließtext', r, 4.5, 'AA') + row('Fließtext', r, 7, 'AAA') + row('Große Schrift', r, 3, 'AA') + row('Große Schrift', r, 4.5, 'AAA') + row('Button-Rahmen und Icon (Akzent : Grund)', ra, 3, 'AA');
    const ctx = { r, ra, hsl: { fg: C.hex2hsl(fg), bg: C.hex2hsl(bg), ac: C.hex2hsl(ac) } };
    const fresh = [];
    LAB_TASKS.forEach((task, i) => { if (!labDone.includes(i) && task.ok(ctx)) { labDone.push(i); fresh.push(i); } });
    $('#lab-tasks').innerHTML = LAB_TASKS.map((task, i) => { const d = labDone.includes(i); return `<li class="${d ? 'ok' : ''}"><span>${d ? '✓ gelöst' : '○ offen'}</span>${i + 1}. ${task.t}</li>`; }).join('');
    if (fresh.length) {
      store.set('lab-done', labDone);
      $('#lab-status').textContent = `Aufgabe ${fresh.map((i) => i + 1).join(' und ')} gelöst. ${labDone.length} von ${LAB_TASKS.length} Aufgaben erledigt.`;
    } else if (announce) $('#lab-status').textContent = `${labDone.length} von ${LAB_TASKS.length} Aufgaben erledigt.`;
    store.set('lab', lab);
  };
  for (const k of ['h', 's', 'l']) hs[k].addEventListener('input', () => {
    lab[labKey] = C.hsl2hex(+hs.h.value, +hs.s.value, +hs.l.value);
    $('#lab-hex').value = lab[labKey]; $('#lab-hex').removeAttribute('aria-invalid'); labDraw();
  });
  $('#lab-pick').addEventListener('input', (e) => { lab[labKey] = e.target.value.toUpperCase(); labCtrl(); labDraw(); });
  $('#lab-hex').addEventListener('input', (e) => {
    const v = e.target.value.trim(), rgb = C.hex2rgb(v);
    if (rgb && v.replace('#', '').length === 6) { lab[labKey] = C.rgb2hex(...rgb); const [h, s, l] = C.hex2hsl(lab[labKey]).map(Math.round); hs.h.value = h; hs.s.value = s; hs.l.value = l; e.target.removeAttribute('aria-invalid'); labDraw(); } else e.target.setAttribute('aria-invalid', 'true');
  });
  $('#lab-target').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (!b) return; pressGroup($('#lab-target'), b); labKey = b.dataset.k; labCtrl(); labDraw(); });
  $('#lab-reset').addEventListener('click', () => { Object.assign(lab, LAB_DEF); labCtrl(); labDraw(true); });
  labCtrl(); labDraw(true);
}

/* ================================================================
   Übung 1 · Farbmischer
   ================================================================ */
const MX_TARGETS = ['#E07A1F', '#2A9D8F', '#7B2CBF', '#F2C14E', '#3A5A40', '#D62839', '#4361EE', '#B5838D', '#6C584C', '#90BE6D', '#277DA1', '#F94144'];
function initMischer() {
  let mode = 'rgb', target = null, hits = store.get('mx-hits', []), solved = false, counted = false, revealed = false;
  const vals = { rgb: [128, 128, 128], cmy: [50, 50, 50] };
  const LBL = { rgb: [['R', 'Rot', '#FF0000'], ['G', 'Grün', '#00FF00'], ['B', 'Blau', '#0000FF']], cmy: [['C', 'Cyan', '#00FFFF'], ['M', 'Magenta', '#FF00FF'], ['Y', 'Gelb', '#FFFF00']] };
  const mine = () => mode === 'rgb' ? vals.rgb.slice() : vals.cmy.map((v) => 255 * (1 - v / 100));
  const newTarget = () => { let t; do { t = MX_TARGETS[Math.floor(Math.random() * MX_TARGETS.length)]; } while (t === target); target = t; solved = false; counted = false; revealed = false; $('#mx-check').disabled = false; $('#mx-fb').innerHTML = ''; draw(); };
  const sliders = () => {
    const max = mode === 'rgb' ? 255 : 100, unit = mode === 'rgb' ? '' : ' %';
    $('#mx-sliders').innerHTML = LBL[mode].map(([k, n, c], i) => `<div class="field"><label for="mx-${k}">${n} (${k}) <output id="mx-${k}-o">${vals[mode][i]}${unit}</output></label><input type="range" id="mx-${k}" data-i="${i}" min="0" max="${max}" value="${vals[mode][i]}" style="--track:linear-gradient(90deg, ${mode === 'rgb' ? '#000' : '#fff'}, ${c})"></div>`).join('');
    for (const el of $$('#mx-sliders input')) el.addEventListener('input', () => { vals[mode][+el.dataset.i] = +el.value; $(`#${el.id}-o`).textContent = el.value + unit; draw(); });
  };
  const draw = () => {
    const m = mine(), hex = C.rgb2hex(...m), de = C.deltaE(m, C.hex2rgb(target));
    $('#mx-target').style.background = target;
    $('#mx-mine').style.background = hex;
    $('#mx-target').innerHTML = solved ? `<span style="color:${C.onColor(target)}" class="mono">${target}</span>` : '';
    $('#mx-mine').innerHTML = `<span style="color:${C.onColor(hex)}" class="mono">${hex}</span>`;
    $('#mx-de').textContent = 'ΔE ' + fmt(de, 1);
    $('#mx-hint').textContent = de < 3 ? 'kaum zu unterscheiden' : de < 10 ? 'sehr nah' : de < 25 ? 'auf dem Weg' : 'noch weit entfernt';
    const n = hits.length, cmy = hits.includes('cmy');
    $('#mx-score').textContent = `Getroffen: ${Math.min(n, 3)} von 3${n >= 2 && !cmy ? ' · davon noch keine im CMY-Modus' : ''}`;
  };
  $('#mx-mode').addEventListener('click', (e) => { const b = e.target.closest('[data-mode]'); if (!b) return; mode = b.dataset.mode; pressGroup($('#mx-mode'), b); sliders(); draw(); });
  $('#mx-check').addEventListener('click', () => {
    const de = C.deltaE(mine(), C.hex2rgb(target));
    if (revealed) {
      $('#mx-fb').innerHTML = `<div class="feedback info"><p>Die Lösung wurde aufgedeckt, darum zählt diese Farbe nicht. Weiter mit „Neue Zielfarbe“.</p></div>`;
    } else if (de < 10) {
      // Jede Zielfarbe zählt nur einmal
      hits.push(mode); store.set('mx-hits', hits); solved = true; counted = true; $('#mx-check').disabled = true;
      const ok = hits.length >= 3 && hits.includes('cmy');
      $('#mx-fb').innerHTML = `<div class="feedback ok"><p><strong>Getroffen, ΔE ${fmt(de, 1)}.</strong> Die Zielfarbe war ${target}.</p>${ok ? '<p>Sie haben die Übung bestanden.</p>' : '<p>Weiter mit „Neue Zielfarbe“.</p>'}</div>`;
      if (ok) markDone('ue-mischer');
    } else {
      const t = C.hex2rgb(target), m = mine(), names = ['Rot', 'Grün', 'Blau'];
      const d = t.map((v, i) => v - m[i]), i = d.reduce((a, v, k) => (Math.abs(v) > Math.abs(d[a]) ? k : a), 0);
      const tip = mode === 'rgb' ? `Am weitesten liegt der Kanal ${names[i]} daneben: ${d[i] > 0 ? 'mehr' : 'weniger'} ${names[i]}.` : `Ihrer Mischung fehlt ${d[i] > 0 ? 'zu wenig' : 'zu viel'} ${names[i]}. Im CMY-Modus steuert ${['Cyan', 'Magenta', 'Gelb'][i]} diesen Anteil: ${d[i] > 0 ? 'weniger' : 'mehr'} ${['Cyan', 'Magenta', 'Gelb'][i]}.`;
      $('#mx-fb').innerHTML = `<div class="feedback bad"><p><strong>Noch nicht, ΔE ${fmt(de, 1)}.</strong> ${tip}</p></div>`;
    }
    draw();
  });
  $('#mx-next').addEventListener('click', newTarget);
  $('#mx-reveal').addEventListener('click', () => {
    const t = C.hex2rgb(target);
    if (mode === 'rgb') vals.rgb = t.slice(); else vals.cmy = t.map((v) => Math.round(100 * (1 - v / 255)));
    solved = true; revealed = true; sliders(); draw();
    $('#mx-fb').innerHTML = `<div class="feedback info"><p>Lösung: ${mode === 'rgb' ? `R ${t[0]} · G ${t[1]} · B ${t[2]}` : `C ${vals.cmy[0]} % · M ${vals.cmy[1]} % · Y ${vals.cmy[2]} %`} ergibt ${target}. Aufgedeckte Lösungen zählen nicht als Treffer.</p></div>`;
  });
  sliders(); newTarget();
}

/* ================================================================
   Übung 2 · Farbcodes lesen
   ================================================================ */
const CQ = [
  ['#1E3A8A', 'dunkles, kräftiges Blau', 'Blau (8A) ist das größte Paar, alle Werte sind eher niedrig: dunkel und klar bunt.'],
  ['#FDE68A', 'helles, sanftes Gelb', 'Rot und Grün sind hoch, Blau niedriger. Rot + Grün ergibt Gelb, alle Werte hoch heißt hell.'],
  ['#808080', 'mittleres Grau', 'Drei gleiche Paare ergeben immer Grau. 80 ist die Hälfte von FF, also mittel.'],
  ['hsl(0 85% 45%)', 'kräftiges Rot', 'H 0° ist Rot, S 85 % sehr bunt, L 45 % fast die reine Farbe.'],
  ['hsl(120 25% 30%)', 'gedämpftes, dunkles Grün', 'H 120° ist Grün, S 25 % stark vergraut, L 30 % dunkel. Etwa ein Olivgrün.'],
  ['#F97316', 'kräftiges Orange', 'Rot F9 sehr hoch, Grün 73 mittel, Blau 16 fast null: zwischen Rot und Gelb, also Orange.'],
  ['rgb(240 240 255)', 'sehr helles, bläuliches Weiß', 'Alle Kanäle sehr hoch, Blau etwas höher: fast Weiß mit einem Hauch Blau.'],
  ['hsl(300 70% 80%)', 'helles Pastell-Pink', 'H 300° ist Magenta, L 80 % sehr hell: ein pastelliges Rosaviolett.'],
  ['#0F172A', 'fast schwarzes Nachtblau', 'Alle Werte sehr niedrig, Blau (2A) ist am höchsten: sehr dunkles Blau.'],
  ['hsl(180 60% 35%)', 'dunkles Türkis (Petrol)', 'H 180° ist Cyan. Mit L 35 % wird daraus ein dunkles Petrol.'],
  ['#8B4513', 'mittleres Braun', 'Rot dominiert, Grün halb so stark, Blau gering, alles eher dunkel: ein dunkles Orange, also Braun.'],
  ['hsl(45 10% 92%)', 'warmes, helles Grau (Beige)', 'S 10 % ist fast unbunt, L 92 % sehr hell, H 45° gibt einen warmen Gelbstich.']
];
function cqColor(code) {
  if (code.startsWith('#')) return code;
  const n = code.match(/[\d.]+/g).map(Number);
  return code.startsWith('hsl') ? C.hsl2hex(n[0], n[1], n[2]) : C.rgb2hex(n[0], n[1], n[2]);
}
function initCodes() {
  const root = $('#cq');
  let qs, i, score;
  const start = () => { qs = shuffle(CQ).slice(0, 10); i = 0; score = 0; render(); };
  const render = (focus) => {
    if (i >= qs.length) {
      const ok = score >= 7;
      if (ok) markDone('ue-codes');
      root.innerHTML = `<div class="quiz-result"><div class="label">Ihr Ergebnis</div><div class="big">${score}<small> / ${qs.length}</small></div><p style="margin:12px auto;max-width:46ch">${ok ? 'Bestanden. Sie lesen Farbcodes sicher.' : 'Noch nicht bestanden. Öffnen Sie den Spickzettel und versuchen Sie es erneut.'}</p><button class="btn btn-dark" type="button" id="cq-restart">Neue Runde</button></div>`;
      $('#cq-restart').addEventListener('click', start);
      $('#cq-restart').focus();
      return;
    }
    const [code, right] = qs[i];
    const opts = shuffle([right, ...shuffle(CQ.filter((q) => q[1] !== right)).slice(0, 3).map((q) => q[1])]);
    root.innerHTML = `<div class="pq-count">Code ${i + 1} von ${qs.length} · ${score} richtig</div><div class="quiz-q mono" tabindex="-1" id="cq-q">${esc(code)}</div><div class="options">${opts.map((o, n) => `<button type="button" class="opt" data-o="${esc(o)}"><span class="k">${'ABCD'[n]}</span>${esc(o)}</button>`).join('')}</div><div id="cq-fb"></div>`;
    if (focus) $('#cq-q').focus();
    for (const b of $$('.opt', root)) b.addEventListener('click', () => {
      const ok = b.dataset.o === right; if (ok) score++;
      for (const x of $$('.opt', root)) { x.disabled = true; if (x.dataset.o === right) x.classList.add('right'); }
      if (!ok) b.classList.add('wrong');
      const hex = cqColor(code);
      $('#cq-fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}" role="status"><div class="fg-cq-reveal"><span class="fg-cq-sw" style="background:${hex}"></span><div><p><strong>${ok ? 'Richtig.' : 'Leider falsch.'}</strong> ${esc(code)} ist ein ${esc(right)}.</p><p>${esc(qs[i][2])}</p></div></div></div><button class="btn btn-dark" type="button" id="cq-next" style="margin-top:14px">${i + 1 < qs.length ? 'Nächster Code' : 'Ergebnis anzeigen'}</button>`;
      $('#cq-next').addEventListener('click', () => { i++; render(true); });
      $('#cq-next').focus();
    });
  };
  start();
}

/* ================================================================
   Übung 3 · Simultankontrast und Zuordnung
   ================================================================ */
const SIM = [
  { t: 'Hell-Dunkel', a: '#000000', b: '#FFFFFF', c: '#808080', cap: 'Grau #808080 auf Schwarz und auf Weiß. Auf Schwarz wirkt es heller, auf Weiß dunkler.' },
  { t: 'Rot – Grün', a: '#D7262B', b: '#2E9E4F', c: '#8C8C8C', cap: 'Grau #8C8C8C auf Rot und auf Grün. Auf Rot wirkt es grünlich, auf Grün rötlich: Das Auge ergänzt die Gegenfarbe.' },
  { t: 'Blau – Gelb', a: '#1F4FA8', b: '#F6D23B', c: '#E8892B', cap: 'Orange #E8892B auf Blau und auf Gelb. Auf Blau leuchtet es kräftig, auf Gelb wirkt es dunkler und rötlicher.' }
];
function initUeKontraste() {
  let cur = 0, bridge = false, nobg = false;
  const svg = $('#sim-svg');
  $('#sim-pick').innerHTML = SIM.map((s, i) => `<button type="button" class="chip" data-i="${i}" aria-pressed="${i === 0}">${s.t}</button>`).join('');
  const draw = () => {
    const s = SIM[cur], bgA = nobg ? 'var(--surface)' : s.a, bgB = nobg ? 'var(--surface)' : s.b;
    svg.innerHTML = `<rect width="300" height="260" fill="${bgA}"/><rect x="300" width="300" height="260" fill="${bgB}"/>` +
      (bridge ? `<rect x="150" y="115" width="300" height="30" fill="${s.c}"/>` : '') +
      `<rect x="110" y="90" width="80" height="80" fill="${s.c}"/><rect x="410" y="90" width="80" height="80" fill="${s.c}"/>`;
    $('#sim-cap').textContent = s.cap + (bridge ? ' Der Steg zeigt: Beide Quadrate sind dieselbe Farbe.' : '') + (nobg ? ' Ohne Umfeld sehen beide gleich aus.' : '');
    $('#sim-bridge').setAttribute('aria-pressed', String(bridge)); $('#sim-bridge').textContent = bridge ? 'Steg ausblenden' : 'Steg zeigen';
    $('#sim-bg').setAttribute('aria-pressed', String(nobg)); $('#sim-bg').textContent = nobg ? 'Umfeld zeigen' : 'Umfeld entfernen';
  };
  $('#sim-pick').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (!b) return; cur = +b.dataset.i; pressGroup($('#sim-pick'), b); draw(); });
  $('#sim-bridge').addEventListener('click', () => { bridge = !bridge; draw(); });
  $('#sim-bg').addEventListener('click', () => { nobg = !nobg; draw(); });
  draw();

  // Teil B: eigene Beispielgrafiken, nicht dieselben wie in Kapitel 06
  const EX = [
    { k: 'farbe', svg: `<rect width="400" height="240" fill="#F4E300"/><circle cx="130" cy="120" r="80" fill="#D7262B"/><rect x="230" y="40" width="130" height="160" fill="#1F5EA8"/>`, hint: 'Rote Kreisfläche und blaues Rechteck auf gelbem Grund.' },
    { k: 'helldunkel', svg: `<rect width="400" height="240" fill="#F5F0E6"/><rect x="40" y="40" width="320" height="160" fill="#1B1B1B"/><text x="200" y="140" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-weight="800" font-size="56" fill="#F5F0E6">NACHT</text>`, hint: 'Schriftzug „NACHT“ in Cremeweiß auf einer schwarzen Fläche mit cremeweißem Rand.' },
    { k: 'kaltwarm', svg: `<rect width="400" height="240" fill="#2C6E7F"/><path d="M0 170 120 90l90 60 80-50 110 70v70H0z" fill="#1E5260"/><circle cx="300" cy="70" r="38" fill="#F26A21"/>`, hint: 'Petrolfarbene Berglandschaft mit einer orangeroten Sonne.' },
    { k: 'komplementaer', svg: `<rect width="400" height="240" fill="#1F5EA8"/><rect x="120" y="50" width="160" height="140" rx="70" fill="#F18A00"/>`, hint: 'Orangefarbene, abgerundete Form mittig auf blauem Grund.' },
    { k: 'simultan', svg: `<rect width="400" height="240" fill="#F4E300"/><rect x="200" width="200" height="240" fill="#44358F"/><circle cx="100" cy="120" r="44" fill="#9A9A9A"/><circle cx="300" cy="120" r="44" fill="#9A9A9A"/>`, hint: 'Zwei graue Kreise, einer auf gelbem, einer auf violettem Grund.' },
    { k: 'qualitaet', svg: `<rect width="400" height="240" fill="#8E9A93"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${24 + i * 74}" y="60" width="60" height="120" fill="${i === 2 ? '#00B39B' : C.hsl2hex(170, 10 + i * 4, 40 + i * 6)}"/>`).join('')}`, hint: 'Fünf blaugrüne Streifen auf Graugrün, vier davon gedämpft, der mittlere leuchtend.' },
    { k: 'quantitaet', svg: `<rect width="400" height="240" fill="#1F5EA8"/><rect x="310" y="160" width="60" height="50" fill="#F18A00"/>`, hint: 'Große blaue Fläche mit einem kleinen orangefarbenen Rechteck unten rechts.' }
  ];
  const order = shuffle(EX.map((_, i) => i));
  const opts = `<option value="">Kontrast wählen …</option>` + KT.map((k) => `<option value="${k.id}">${k.t}</option>`).join('');
  $('#kq').innerHTML = order.map((ix, n) => `<div class="fg-kq-item" data-k="${EX[ix].k}"><svg viewBox="0 0 400 240" role="img" aria-label="Beispiel ${n + 1}: ${esc(EX[ix].hint)}">${EX[ix].svg}</svg><label for="kq-${n}" class="label">Beispiel ${n + 1}</label><p class="small muted">${esc(EX[ix].hint)}</p><select id="kq-${n}">${opts}</select><span class="fg-kq-res" aria-live="polite"></span></div>`).join('');
  const saved = store.get('kq', {});
  for (const it of $$('#kq .fg-kq-item')) { const v = saved[it.dataset.k]; if (v) $('select', it).value = v; }
  $('#kq').addEventListener('change', () => { const o = {}; for (const it of $$('#kq .fg-kq-item')) o[it.dataset.k] = $('select', it).value; store.set('kq', o); });
  $('#kq-check').addEventListener('click', () => {
    let n = 0, empty = 0;
    for (const it of $$('#kq .fg-kq-item')) {
      const v = $('select', it).value, ok = v === it.dataset.k; if (ok) n++; if (!v) empty++;
      it.classList.toggle('ok', ok); it.classList.toggle('bad', !ok);
      $('.fg-kq-res', it).textContent = ok ? '✓ richtig' : v ? `✕ richtig wäre: ${KT.find((k) => k.id === it.dataset.k).t}` : '✕ noch keine Auswahl';
    }
    const pass = n >= 5; if (pass) markDone('ue-kontraste');
    $('#kq-fb').innerHTML = `<div class="feedback ${pass ? 'ok' : 'bad'}"><p><strong>${n} von 7 richtig.</strong> ${pass ? 'Bestanden. Viele Beispiele enthalten mehrere Kontraste, gefragt war jeweils der prägende.' : empty ? `Noch ${empty} ohne Auswahl. ` : 'Lesen Sie die Beschreibungen in Kapitel 06 noch einmal.'}</p></div>`;
  });
  $('#kq-reset').addEventListener('click', () => { for (const it of $$('#kq .fg-kq-item')) { $('select', it).value = ''; it.classList.remove('ok', 'bad'); $('.fg-kq-res', it).textContent = ''; } store.set('kq', {}); $('#kq-fb').innerHTML = ''; });
}

/* ================================================================
   Übung 4 · Harmonie-Farbkreis
   ================================================================ */
const HB = [
  ['Sommerfest der Hochschule', 'Sommerfest', 'Fr 3. Juli · Campus'],
  ['Jazzkonzert im Studio', 'Late Night Jazz', 'Do 12. März · 21 Uhr'],
  ['Hofladen mit Bioprodukten', 'Frisch vom Feld', 'Sa 8–13 Uhr · Hofladen am Wald'],
  ['Tech-Meetup Medieninformatik', 'Code & Coffee', 'Mi 18 Uhr · Raum E 101']
];
function harmonyPalette(rule, H, S, L) {
  const r = RULES.find((x) => x.id === rule);
  if (rule === 'mono') {
    const a = L + 30 > 92 ? L - 30 : L + 30, b = L + 52 > 95 ? L - 52 : L + 52;
    return [L, a, b].map((l) => C.hsl2hex(H, S, clamp(l, 6, 96)));
  }
  const L2 = L > 50 ? L - 32 : L + 38;
  return r.h.map((d, i) => C.hsl2hex(H + d, S, i === 0 ? L : clamp(L2 + (i % 2 ? 0 : -8), 8, 92)));
}
function initHarmonie() {
  const st = Object.assign({ h: 200, s: 70, l: 30, rule: 'komp', rot: 0, brief: 0 }, store.get('hw', {}));
  const H = $('#hw-h'), S = $('#hw-s'), L = $('#hw-l');
  H.value = st.h; S.value = st.s; L.value = st.l;
  $('#hb-select').innerHTML = HB.map((b, i) => `<option value="${i}">${b[0]}</option>`).join('');
  $('#hb-select').value = st.brief;
  $('#hw-rule').innerHTML = RULES.map((r) => `<button type="button" class="chip" data-r="${r.id}" aria-pressed="${r.id === st.rule}">${r.t}</button>`).join('');
  const tried = new Set(store.get('hw-tried', [st.rule]));
  const draw = () => {
    Object.assign(st, { h: +H.value, s: +S.value, l: +L.value });
    store.set('hw', st);
    $('#hw-h-o').textContent = st.h + '°'; $('#hw-s-o').textContent = st.s + ' %'; $('#hw-l-o').textContent = st.l + ' %';
    S.style.setProperty('--track', `linear-gradient(90deg, ${C.hsl2hex(st.h, 0, 50)}, ${C.hsl2hex(st.h, 100, 50)})`);
    L.style.setProperty('--track', `linear-gradient(90deg, #000, ${C.hsl2hex(st.h, st.s, 50)}, #fff)`);
    const base = harmonyPalette(st.rule, st.h, st.s, st.l), n = base.length;
    const pal = base.map((_, i) => base[(i + st.rot) % n]);
    // Rad
    const r = RULES.find((x) => x.id === st.rule);
    let w = ''; for (let i = 0; i < 72; i++) w += `<path d="${arcPath(78, 132, i * Math.PI / 36, (i + 1) * Math.PI / 36 + 0.01)}" fill="${C.hsl2hex(i * 5, st.s, 50)}"/>`;
    const pts = (st.rule === 'mono' ? [0] : r.h).map((d) => { const a = (st.h + d) * Math.PI / 180; return [105 * Math.sin(a), -105 * Math.cos(a)]; });
    if (pts.length > 1) w += `<path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}${pts.length > 2 ? 'z' : ''}" fill="none" stroke="var(--ink)" stroke-width="3"/>`;
    w += pts.map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="${base[i]}" stroke="#fff" stroke-width="4"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`).join('');
    w += `<circle r="60" fill="${pal[0]}"/>`;
    $('#hw-wheel').innerHTML = w;
    // Plakat
    const [, title, sub] = HB[st.brief];
    const bg = pal[0], tc = pal[1] || C.onColor(bg), acc = pal.slice(1);
    const subc = C.onColor(bg);
    // Lange Titel auf zwei Zeilen verteilen, am Wortzwischenraum nahe der Mitte
    const words = title.split(' ');
    let lines = [title];
    if (title.length > 11 && words.length > 1) {
      let best = 1, diff = Infinity;
      for (let k = 1; k < words.length; k++) { const d = Math.abs(words.slice(0, k).join(' ').length - words.slice(k).join(' ').length); if (d < diff) { diff = d; best = k; } }
      lines = [words.slice(0, best).join(' '), words.slice(best).join(' ')];
    }
    const shapes = acc.map((c, i) => [`<circle cx="${300 - i * 40}" cy="${90 + i * 30}" r="${70 - i * 12}" fill="${c}"/>`, `<rect x="${20 + i * 30}" y="${300 + i * 12}" width="${120 - i * 20}" height="${120 - i * 20}" fill="${c}" transform="rotate(${-8 + i * 10} 80 360)"/>`][i % 2]).join('');
    $('#hw-poster').innerHTML = `<svg viewBox="0 0 400 520" role="img" aria-label="Plakatentwurf ${esc(title)} mit der gewählten Palette"><rect width="400" height="520" fill="${bg}"/>${shapes}<text class="fg-poster-title" x="28" y="${lines.length > 1 ? 215 : 250}" font-family="IBM Plex Sans, sans-serif" font-weight="800" font-size="52" fill="${tc}" letter-spacing="-1">${lines.map((t, k) => `<tspan x="28" dy="${k ? 56 : 0}">${esc(t)}</tspan>`).join('')}</text><text x="30" y="${lines.length > 1 ? 306 : 290}" font-family="IBM Plex Sans, sans-serif" font-weight="600" font-size="18" fill="${subc}">${esc(sub)}</text></svg>`;
    // Titel darf nicht aus dem Plakat laufen: notfalls Schrift verkleinern
    const tEl = $('#hw-poster .fg-poster-title');
    try { const w = tEl.getBBox().width; if (w > 344) tEl.setAttribute('font-size', String(Math.floor(52 * 344 / w))); } catch (e) { /* nicht gerendert */ }
    const cr = C.contrast(tc, bg);
    $('#hw-contrast').innerHTML = `Titel auf Hintergrund: <strong>${ratioText(cr)}</strong> · ${cr >= 4.5 ? '✓ gut lesbar' : cr >= 3 ? '✓ ausreichend für große Schrift (mind. 3 : 1)' : '✕ zu schwach: Helligkeit ändern oder Rollen tauschen'}`;
    $('#hw-pal').innerHTML = pal.map((c, i) => swatch(c, ['Hintergrund', 'Titel', 'Akzent', 'Akzent 2'][i])).join('');
    $('#hw-rule-text').textContent = r.t + ': ' + r.d;
    tried.add(st.rule); store.set('hw-tried', [...tried]);
  };
  for (const el of [H, S, L]) el.addEventListener('input', draw);
  $('#hw-rule').addEventListener('click', (e) => { const b = e.target.closest('[data-r]'); if (!b) return; st.rule = b.dataset.r; st.rot = 0; pressGroup($('#hw-rule'), b); draw(); });
  $('#hb-select').addEventListener('change', (e) => { st.brief = +e.target.value; $('#hb-brief').textContent = HB[st.brief][0]; draw(); });
  $('#hw-swap').addEventListener('click', () => { st.rot++; draw(); });
  $('#hw-copy').addEventListener('click', async () => {
    const txt = $$('#hw-pal .mono').map((e) => e.textContent).join(', ');
    try { await navigator.clipboard.writeText(txt); toast('HEX-Werte kopiert'); } catch (e) { toast(txt); }
  });
  $('#hb-brief').textContent = HB[st.brief][0];
  draw();
}

/* ================================================================
   Übung 5 · Kontrast-Check, Reparieren, Simulation
   ================================================================ */
function initCheck() {
  const fg = $('#cc-fg'), bg = $('#cc-bg'), fgT = $('#cc-fg-t'), bgT = $('#cc-bg-t');
  const draw = () => {
    const f = fg.value.toUpperCase(), b = bg.value.toUpperCase(), r = C.contrast(f, b);
    const s = $('#cc-sample'); s.style.color = f; s.style.background = b; s.style.setProperty('--btn', f);
    $('#cc-ratio').textContent = ratioText(r);
    const row = (t, min, lvl) => `<li class="${r >= min ? 'ok' : 'bad'}"><span>${r >= min ? '✓ bestanden' : '✕ nicht bestanden'}</span>${t} <small>${lvl} · mind. ${fmt(min, 1)} : 1</small></li>`;
    $('#cc-res').innerHTML = row('Fließtext', 4.5, 'AA') + row('Große Schrift', 3, 'AA') + row('Bedienelemente, Icons', 3, 'AA') + row('Fließtext', 7, 'AAA');
  };
  const link = (picker, text) => {
    picker.addEventListener('input', () => { text.value = picker.value.toUpperCase(); text.removeAttribute('aria-invalid'); draw(); });
    text.addEventListener('input', () => {
      const v = text.value.trim(), rgb = C.hex2rgb(v);
      if (rgb && v.replace('#', '').length === 6) { picker.value = C.rgb2hex(...rgb).toLowerCase(); text.removeAttribute('aria-invalid'); draw(); } else text.setAttribute('aria-invalid', 'true');
    });
  };
  link(fg, fgT); link(bg, bgT);
  $('#cc-swap').addEventListener('click', () => { const a = fg.value; fg.value = bg.value; bg.value = a; fgT.value = fg.value.toUpperCase(); bgT.value = bg.value.toUpperCase(); draw(); });
  draw();

  // Teil B · Reparieren
  const FIX = [['#9CA3AF', '#FFFFFF', 'Grauer Hinweistext'], ['#F59E0B', '#FFFFFF', 'Orangefarbener Link'], ['#60A5FA', '#F1F5F9', 'Blaue Beschriftung'], ['#7C3AED', '#1F2937', 'Violetter Text im Dunkelmodus']];
  const fx = store.get('fix', FIX.map((f) => Math.round(C.hex2hsl(f[0])[2])));
  $('#fix').innerHTML = FIX.map(([c, b, n], i) => { const [h, s] = C.hex2hsl(c); return `<div class="fg-fix-i" data-i="${i}"><div class="fg-fix-prev" style="background:${b}"><span>${n}</span></div><div class="field"><label for="fix-${i}">Helligkeit Text <output id="fix-${i}-o"></output></label><input type="range" id="fix-${i}" min="0" max="100" value="${fx[i]}" data-h="${h}" data-s="${s}"></div><span class="fg-fix-r"></span></div>`; }).join('');
  const drawFix = () => {
    let ok = 0;
    for (const it of $$('#fix .fg-fix-i')) {
      const i = +it.dataset.i, inp = $('input', it), c = C.hsl2hex(+inp.dataset.h, +inp.dataset.s, +inp.value), b = FIX[i][1], r = C.contrast(c, b);
      fx[i] = +inp.value;
      $('span', $('.fg-fix-prev', it)).style.color = c;
      $(`#fix-${i}-o`).textContent = `${inp.value} % · ${c}`;
      $('.fg-fix-r', it).innerHTML = `<b>${ratioText(r)}</b> ${r >= 4.5 ? '✓ AA' : '✕ zu schwach'}`;
      it.classList.toggle('ok', r >= 4.5);
      if (r >= 4.5) ok++;
    }
    store.set('fix', fx);
    $('#fix-status').textContent = `${ok} von ${FIX.length} Kombinationen erreichen AA.` + (ok === FIX.length ? ' Alle repariert. Auf hellem Grund wird der Text dunkler, auf dunklem heller.' : '');
    return ok === FIX.length;
  };
  $('#fix').addEventListener('input', () => { if (drawFix()) markDone('ue-check'); });
  drawFix();

  // Teil C · Simulation
  const stage = $('#cvd-stage');
  const drawCvd = () => {
    const sim = $('#cvd-sel').value, fix = $('#cvd-fix').checked;
    const pts1 = '20,130 70,100 120,110 170,60 220,70 270,40', pts2 = '20,150 70,140 120,90 170,120 220,100 270,110';
    stage.innerHTML = `<div class="fg-cvd-in" style="${sim === 'none' ? '' : `filter:url(#f-${sim})`}">
      <div class="fg-cvd-card"><h4>Besucherzahlen</h4>
        <svg viewBox="0 0 340 170" role="img" aria-label="Liniendiagramm mit zwei Linien: Website steigt, App schwankt">
          <polyline points="${pts1}" fill="none" stroke="#2E9E4F" stroke-width="4"/>
          <polyline points="${pts2}" fill="none" stroke="#D9372B" stroke-width="4" ${fix ? 'stroke-dasharray="10 7"' : ''}/>
          ${fix ? '<text x="278" y="44" font-size="14" font-family="IBM Plex Sans, sans-serif" fill="#1F2937">Website</text><text x="278" y="114" font-size="14" font-family="IBM Plex Sans, sans-serif" fill="#1F2937">App</text>' : ''}
        </svg>
        <div class="fg-cvd-leg"><span><i style="background:#2E9E4F"></i>${fix ? '— durchgezogen: ' : ''}Website</span><span><i style="background:#D9372B"></i>${fix ? '- - gestrichelt: ' : ''}App</span></div>
      </div>
      <div class="fg-cvd-card"><h4>Server</h4>
        <ul class="fg-cvd-list">
          <li><i style="background:#2E9E4F"></i>Webserver ${fix ? '<b>✓ online</b>' : ''}</li>
          <li><i style="background:#D9372B"></i>Datenbank ${fix ? '<b>✕ offline</b>' : ''}</li>
          <li><i style="background:#2E9E4F"></i>Mailserver ${fix ? '<b>✓ online</b>' : ''}</li>
          <li><i style="background:#E0A800"></i>Backup ${fix ? '<b>! verzögert</b>' : ''}</li>
        </ul>
      </div>
    </div>`;
  };
  $('#cvd-sel').addEventListener('change', drawCvd);
  $('#cvd-fix').addEventListener('change', drawCvd);
  drawCvd();
}

/* ================================================================
   Übung 6 · Palette bauen
   ================================================================ */
const PL_BRIEFS = [
  ['Mensa heute', '#2F6B3A', '#E8A33D', 'Wirkung: frisch, appetitlich, freundlich.', 'Tagesgericht', 'Linsencurry mit Basmatireis und Koriander-Joghurt.'],
  ['Raumbuchung Bibliothek', '#1E3A5F', '#F59E0B', 'Wirkung: ruhig, sachlich, konzentriert.', 'Gruppenraum 3', 'Frei von 14 bis 16 Uhr, 6 Plätze, Bildschirm vorhanden.'],
  ['Campus-Radio', '#C2185B', '#FFC94D', 'Wirkung: laut, jung, energiegeladen.', 'Jetzt live', 'Die Morgenshow mit Musik und Campus-News.'],
  ['Sprechstunde Gesundheitsdienst', '#0E7490', '#A78BFA', 'Wirkung: vertrauenswürdig, klar, beruhigend.', 'Nächster Termin', 'Dienstag, 10:30 Uhr, Raum A 204.']
];
function plTokens(st) {
  const [hP] = C.hex2hsl(st.primary), t = st.tint;
  const light = { bg: C.hsl2hex(hP, t, 97), surface: '#FFFFFF', text: C.hsl2hex(hP, Math.min(40, t * 2), 13), muted: C.hsl2hex(hP, t, 38), line: C.hsl2hex(hP, t, 87), primary: st.primary, accent: st.accent, success: '#15803D', error: '#B91C1C' };
  const dbg = C.hsl2hex(hP, t, 8), dsf = C.hsl2hex(hP, t, 13);
  const dark = { bg: dbg, surface: dsf, text: C.hsl2hex(hP, t, 94), muted: C.hsl2hex(hP, t, 70), line: C.hsl2hex(hP, t, 24), primary: C.fit(st.primary, dsf, 4.5), accent: C.fit(st.accent, dbg, 3), success: '#4ADE80', error: '#F87171' };
  for (const m of [light, dark]) { m.onPrimary = C.onColor(m.primary); m.onAccent = C.onColor(m.accent); }
  return { light, dark };
}
function plChecks(t) {
  return [
    ['Text auf Hintergrund', t.text, t.bg, 4.5], ['Text auf Karte', t.text, t.surface, 4.5], ['Nebentext auf Karte', t.muted, t.surface, 4.5],
    ['Link (Primär) auf Karte', t.primary, t.surface, 4.5], ['Button-Beschriftung auf Primär', t.onPrimary, t.primary, 4.5],
    ['Akzent als Bedienelement auf Hintergrund', t.accent, t.bg, 3], ['Fehlermeldung auf Karte', t.error, t.surface, 4.5]
  ].map(([n, a, b, min]) => ({ n, r: C.contrast(a, b), min }));
}
function initPalette() {
  const def = (i) => ({ brief: i, primary: PL_BRIEFS[i][1], accent: PL_BRIEFS[i][2], tint: 8, radius: 12, mode: 'light' });
  const st = Object.assign(def(0), store.get('pl', {}));
  // Erst nach eigener Änderung kann die Übung als erledigt gelten, nicht schon mit den Startfarben
  let touched = !!st.touched;
  const P = $('#pl-primary'), Pt = $('#pl-primary-t'), A = $('#pl-accent'), At = $('#pl-accent-t'), T = $('#pl-tint'), R = $('#pl-radius');
  $('#pl-brief').innerHTML = PL_BRIEFS.map((b, i) => `<option value="${i}">${b[0]}</option>`).join('');
  const sync = () => { P.value = st.primary.toLowerCase(); Pt.value = st.primary; A.value = st.accent.toLowerCase(); At.value = st.accent; T.value = st.tint; R.value = st.radius; $('#pl-brief').value = st.brief; pressGroup($('#pl-mode'), $(`#pl-mode [data-m="${st.mode}"]`)); };
  const draw = () => {
    st.touched = touched; store.set('pl', st);
    const b = PL_BRIEFS[st.brief], tk = plTokens(st);
    $('#pl-brief-name').textContent = '„' + b[0] + '“'; $('#pl-brief-hint').textContent = b[3];
    $('#pl-tint-o').textContent = st.tint + ' %'; $('#pl-radius-o').textContent = st.radius + ' px';
    const t = tk[st.mode];
    $('#pl-ui').innerHTML = uiMock({ ...t, name: b[0], title: b[4], copy: b[5] }, st.radius);
    $('#pl-roles').innerHTML = [['Hintergrund', t.bg], ['Karte', t.surface], ['Text', t.text], ['Nebentext', t.muted], ['Primär', t.primary], ['Akzent', t.accent]].map(([n, c]) => swatch(c, n)).join('');
    let allOk = true;
    $('#pl-checks').innerHTML = ['light', 'dark'].map((m) => {
      const cs = plChecks(tk[m]);
      return `<li class="fg-checks-h">${m === 'light' ? 'Hell' : 'Dunkel'}</li>` + cs.map((c) => { const ok = c.r >= c.min; if (!ok) allOk = false; return `<li class="${ok ? 'ok' : 'bad'}"><span aria-hidden="true">${ok ? '✓' : '✕'}</span><span>${c.n}<small>mind. ${fmt(c.min, 1)} : 1 · ${ok ? 'bestanden' : 'nicht bestanden'}</small></span><b>${ratioText(c.r)}</b></li>`; }).join('');
    }).join('') + `<li class="fg-checks-note small muted">Im Dunkelmodus werden Primär- und Akzentfarbe automatisch aufgehellt, bis sie genug Kontrast haben.</li>`;
    if (allOk && touched) markDone('ue-palette');
    const v = (o) => `  --color-bg: ${o.bg};\n  --color-surface: ${o.surface};\n  --color-text: ${o.text};\n  --color-text-muted: ${o.muted};\n  --color-line: ${o.line};\n  --color-primary: ${o.primary};\n  --color-on-primary: ${o.onPrimary};\n  --color-accent: ${o.accent};\n  --color-on-accent: ${o.onAccent};\n  --color-success: ${o.success};\n  --color-error: ${o.error};\n  --radius: ${st.radius}px;`;
    $('#pl-css').value = `/* Palette „${b[0]}“ */\n:root {\n${v(tk.light)}\n}\n[data-theme="dark"] {\n${v(tk.dark)}\n}`;
  };
  const link = (picker, text, key) => {
    picker.addEventListener('input', () => { st[key] = picker.value.toUpperCase(); text.value = st[key]; touched = true; draw(); });
    text.addEventListener('input', () => { const rgb = C.hex2rgb(text.value); if (rgb && text.value.replace('#', '').length === 6) { st[key] = C.rgb2hex(...rgb); picker.value = st[key].toLowerCase(); text.removeAttribute('aria-invalid'); touched = true; draw(); } else text.setAttribute('aria-invalid', 'true'); });
  };
  link(P, Pt, 'primary'); link(A, At, 'accent');
  T.addEventListener('input', () => { st.tint = +T.value; touched = true; draw(); });
  R.addEventListener('input', () => { st.radius = +R.value; touched = true; draw(); });
  $('#pl-mode').addEventListener('click', (e) => { const b = e.target.closest('[data-m]'); if (!b) return; st.mode = b.dataset.m; pressGroup($('#pl-mode'), b); draw(); });
  $('#pl-brief').addEventListener('change', (e) => { Object.assign(st, def(+e.target.value), { mode: st.mode }); touched = false; sync(); draw(); });
  $('#pl-reset').addEventListener('click', () => { Object.assign(st, def(st.brief)); touched = false; sync(); draw(); });
  $('#pl-harm').addEventListener('click', () => { const [h, s, l] = C.hex2hsl(st.primary); st.accent = C.hsl2hex(h + 180, s, l); touched = true; sync(); draw(); });
  $('#pl-copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#pl-css').value); toast('CSS kopiert'); } catch (e) { $('#pl-css').select(); toast('Bitte mit Strg/Cmd + C kopieren'); } });
  sync(); draw();
}

/* ================================================================
   Wissenstest
   ================================================================ */
const QUIZ = [
  ['Welcher Wellenlängenbereich ist für Menschen sichtbar?', ['ca. 100–300 nm', 'ca. 380–780 nm', 'ca. 800–1.200 nm', 'ca. 1–10 mm'], 1, 'Darunter liegt Ultraviolett, darüber Infrarot.'],
  ['Welche Zellen der Netzhaut ermöglichen das Farbsehen bei Tageslicht?', ['Stäbchen', 'Zapfen', 'Ganglienzellen', 'Hornhautzellen'], 1, 'Es gibt drei Zapfentypen (S, M, L). Stäbchen sind für das Sehen in der Dämmerung zuständig.'],
  ['Was ergibt additive Mischung von Rot und Grün?', ['Braun', 'Gelb', 'Cyan', 'Grau'], 1, 'Licht plus Licht wird heller. Rot und Grün ergeben additiv Gelb.'],
  ['Warum gibt es im Vierfarbdruck zusätzlich Schwarz (K)?', ['Weil Cyan, Magenta und Gelb zusammen nur ein schmutziges Dunkelbraun ergeben', 'Weil Schwarz billiger ist als Weiß', 'Weil Bildschirme Schwarz nicht darstellen können', 'Damit das Papier nicht durchscheint'], 0, 'Echte Druckfarben sind nicht ideal. Schwarz sorgt für Tiefe, scharfen Text und spart Farbe.'],
  ['Was bedeutet der HEX-Wert #00FF00?', ['Reines Blau', 'Reines Grün', 'Mittleres Grau', 'Schwarz'], 1, 'Rot 00, Grün FF, Blau 00: nur der Grünkanal leuchtet voll.'],
  ['Was beschreibt H in HSL?', ['Helligkeit', 'Farbton als Winkel auf dem Farbkreis', 'Härte', 'Höhe im Farbraum'], 1, 'Hue: 0° Rot, 120° Grün, 240° Blau.'],
  ['Was ist ein Gamut?', ['Ein Pantone-Farbfächer', 'Der Umfang an Farben, den ein Gerät oder Verfahren darstellen kann', 'Eine Farbsehschwäche', 'Ein Kontrastverhältnis'], 1, 'Monitore haben meist einen größeren Gamut als der Offsetdruck.'],
  ['Was bedeutet Metamerie?', ['Zwei Muster sehen unter einer Lichtart gleich aus, unter einer anderen verschieden', 'Farben werden im Druck heller', 'Komplementärfarben flimmern', 'Eine Farbe wirkt auf großer Fläche anders'], 0, 'Darum beurteilt man Drucke unter Normlicht.'],
  ['Wie heißen die Grundfarben in Ittens Farbkreis?', ['Rot, Grün, Blau', 'Cyan, Magenta, Gelb', 'Gelb, Rot, Blau', 'Orange, Violett, Grün'], 2, 'Aus Gelb, Rot und Blau mischt Itten die Sekundär- und Tertiärfarben.'],
  ['Ein Grau wirkt auf rotem Grund grünlich. Welcher Kontrast ist das?', ['Quantitätskontrast', 'Simultankontrast', 'Qualitätskontrast', 'Kalt-Warm-Kontrast'], 1, 'Das Auge erzeugt die Gegenfarbe zur Umgebung und färbt das Grau damit ein.'],
  ['Warum braucht ein Gleichgewicht von Gelb und Violett mehr Violett als Gelb?', ['Violett ist teurer', 'Gelb hat eine viel höhere Leuchtkraft', 'Violett ist komplementär zu Grün', 'Wegen des Hell-Dunkel-Kontrasts im Druck'], 1, 'Quantitätskontrast: Goethes Lichtwerte Gelb 9 und Violett 3 ergeben ein Flächenverhältnis von etwa 1 : 3.'],
  ['Welche Harmonie nutzt drei Farbtöne im Abstand von je 120°?', ['Analog', 'Komplementär', 'Triade', 'Monochrom'], 2, 'Die Triade bildet ein gleichseitiges Dreieck im Farbkreis.'],
  ['Wie verteilt die 60-30-10-Regel die Farben?', ['60 % Akzent, 30 % Text, 10 % Fläche', '60 % Grundfarbe, 30 % Sekundärfarbe, 10 % Akzent', '60 % Rot, 30 % Grün, 10 % Blau', 'Je 33 % für drei Farben'], 1, 'Eine ruhige Grundfarbe dominiert, der Akzent bleibt sparsam und dadurch wirksam.'],
  ['Welches Kontrastverhältnis verlangt WCAG AA mindestens für normalen Fließtext?', ['2 : 1', '3 : 1', '4,5 : 1', '7 : 1'], 2, '3 : 1 gilt für große Schrift und Bedienelemente, 7 : 1 ist Stufe AAA.'],
  ['Ein Formular markiert Fehler nur mit roter Umrandung. Was ist das Problem?', ['Rot ist zu aggressiv', 'Information wird allein über Farbe vermittelt (WCAG 1.4.1)', 'Rot ist im Dunkelmodus nicht erlaubt', 'Es gibt kein Problem'], 1, 'Menschen mit Rot-Grün-Schwäche erkennen den Fehler nicht. Symbol und Text ergänzen die Farbe.']
];
function initQuiz() {
  const root = $('#quiz');
  let i = 0, score = 0, answers = [];
  const render = (focus) => {
    if (i >= QUIZ.length) {
      const pct = Math.round((score / QUIZ.length) * 100), best = store.get('quiz-best', 0);
      if (score > best) store.set('quiz-best', score);
      root.innerHTML = `<div class="quiz-result"><div class="label">Ihr Ergebnis</div><div class="big" tabindex="-1" id="quiz-res">${score}<small> / ${QUIZ.length}</small></div><p style="margin:12px auto;max-width:46ch">${pct >= 80 ? 'Sehr gut. Sie beherrschen die Grundlagen der Farbgestaltung.' : pct >= 50 ? 'Solide Basis. Sehen Sie sich die Erklärungen zu den falschen Antworten noch einmal an.' : 'Lesen Sie die Kapitel 02 bis 10 noch einmal und versuchen Sie es dann erneut.'}</p><div class="dots" style="justify-content:center" aria-hidden="true">${answers.map((r) => `<span class="${r ? 'ok' : 'bad'}"></span>`).join('')}</div><p class="small muted">Bestes Ergebnis bisher: ${Math.max(best, score)} / ${QUIZ.length}</p><button class="btn btn-dark" type="button" id="quiz-restart">Test wiederholen</button></div>`;
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
  ['1704', 'Opticks', 'Isaac Newton', 'London: Smith and Walford', 'Newtons Versuche mit dem Prisma und die Anordnung der Spektralfarben im Kreis.'],
  ['1810', 'Zur Farbenlehre', 'Johann Wolfgang von Goethe', 'Tübingen: Cotta', 'Farbe als Wahrnehmungserlebnis, mit dem Kapitel zur „sinnlich-sittlichen Wirkung“ der Farben.'],
  ['1810', 'Die Farben-Kugel', 'Philipp Otto Runge', 'Hamburg: Perthes', 'Das erste dreidimensionale Farbordnungssystem.'],
  ['1905', 'A Color Notation', 'Albert H. Munsell', 'Boston: Ellis', 'Grundlage des Munsell-Systems mit Hue, Value und Chroma.'],
  ['1961', 'Kunst der Farbe', 'Johannes Itten', 'Ravensburg: Otto Maier', 'Der zwölfteilige Farbkreis und die sieben Farbkontraste. Auch als gekürzte Studienausgabe erhältlich.'],
  ['1963', 'Interaction of Color', 'Josef Albers', 'New Haven: Yale University Press', 'Übungen, die zeigen, wie stark Farben voneinander abhängen. Bis heute ein Standard der Gestaltungslehre.'],
  ['1978', 'Das Grundgesetz der Farbenlehre', 'Harald Küppers', 'Köln: DuMont', 'Farbenlehre, die additive und subtraktive Mischung in einem System verbindet.'],
  ['1989', 'Wie Farben wirken', 'Eva Heller', 'Reinbek: Rowohlt', 'Farbpsychologie, Farbsymbolik und kreative Farbgestaltung auf Basis einer Befragung.'],
  ['2009', 'A Physiologically-based Model for Simulation of Color Vision Deficiency', 'Gustavo M. Machado, Manuel M. Oliveira, Leandro A. F. Fernandes', 'IEEE Transactions on Visualization and Computer Graphics 15 (6)', 'Grundlage der Simulation in Übung 5.'],
  ['2016', 'The Secret Lives of Colour', 'Kassia St Clair', 'London: John Murray', 'Kulturgeschichte von 75 Farben und Pigmenten, unterhaltsam und gut recherchiert.'],
  ['Norm', 'Web Content Accessibility Guidelines (WCAG) 2.2', 'W3C', 'w3.org/TR/WCAG22 · 2023', 'Kontrastanforderungen 1.4.3, 1.4.11 und Kriterium 1.4.1 „Benutzung von Farbe“.'],
  ['Norm', 'CIE 015 Colorimetry', 'Commission Internationale de l’Éclairage', 'jeweils aktuelle Fassung', 'Normvalenzsystem CIE 1931, Farbraum CIELAB und Farbabstandsformeln.']
];
function initLit() {
  $('#lit').innerHTML = LIT.map(([y, t, by, pub, d]) => `<div class="lit-item"><span class="yr">${y}</span><div><h3>${esc(t)}</h3><div class="by">${esc(by)} · ${esc(pub)}</div><p>${esc(d)}</p></div></div>`).join('');
}

/* ================================================================
   Stichwortverzeichnis
   ================================================================ */
const GL = [
  ['Absorption', 'Licht', 'Verschlucken von Licht durch eine Oberfläche. Was absorbiert wird, sehen wir nicht.', 'wahrnehmung'],
  ['Achromatopsie', 'Barrierefreiheit', 'Vollständige Farbenblindheit, nur Helligkeitsunterschiede werden wahrgenommen. Sehr selten.', 'barrierefreiheit'],
  ['Additive Farbmischung', 'Mischung', 'Mischung von Lichtfarben. Jede weitere Farbe macht heller, Rot, Grün und Blau ergeben Weiß.', 'mischung'],
  ['Analoge Harmonie', 'Harmonie', 'Farbklang aus im Farbkreis benachbarten Farbtönen.', 'harmonien'],
  ['Buntheit / Chroma', 'Modelle', 'Stärke der Farbigkeit im Vergleich zu einem Grau gleicher Helligkeit.', 'modelle'],
  ['CIELAB', 'Modelle', 'Wahrnehmungsnaher Farbraum der CIE (1976) mit L* (Helligkeit), a* (Grün–Rot) und b* (Blau–Gelb).', 'modelle'],
  ['CMYK', 'Modelle', 'Farbmodell des Vierfarbdrucks aus Cyan, Magenta, Gelb (Yellow) und Schwarz (Key).', 'modelle'],
  ['Dark Mode', 'Interface', 'Dunkle Darstellungsvariante einer Oberfläche mit eigenen, abgestimmten Farbwerten.', 'interface'],
  ['Delta E (ΔE)', 'Modelle', 'Maß für den empfundenen Abstand zweier Farben im Lab-Raum. Ab etwa 2 für geübte Augen sichtbar.', 'ue-mischer'],
  ['Design Token', 'Interface', 'Benannte Variable für eine Gestaltungsentscheidung, z. B. --color-primary.', 'interface'],
  ['Deuteranopie', 'Barrierefreiheit', 'Ausfall der grünempfindlichen M-Zapfen. Zusammen mit der schwächeren Form, der Deuteranomalie, die häufigste Rot-Grün-Schwäche.', 'barrierefreiheit'],
  ['Display P3', 'Modelle', 'Farbraum mit größerem Gamut als sRGB, verbreitet bei modernen Displays.', 'modelle'],
  ['Farbe-an-sich-Kontrast', 'Kontraste', 'Kontrast reiner, ungetrübter Farben, am stärksten bei Gelb, Rot und Blau.', 'kontraste'],
  ['Farbkonstanz', 'Licht', 'Fähigkeit des Sehsystems, Objektfarben trotz wechselnder Beleuchtung gleich wahrzunehmen.', 'wahrnehmung'],
  ['Farbkreis', 'Ordnungen', 'Kreisförmige Anordnung der Farbtöne. Bei Itten zwölfteilig aus Grund-, Sekundär- und Tertiärfarben.', 'ordnungen'],
  ['Farbmanagement', 'Modelle', 'Umrechnung von Farben zwischen Geräten und Verfahren mithilfe von ICC-Profilen.', 'modelle'],
  ['Farbton / Hue', 'Modelle', 'Die Qualität, die eine Farbe als Rot, Gelb, Blau usw. erscheinen lässt. In HSL als Winkel angegeben.', 'modelle'],
  ['Gamut', 'Modelle', 'Umfang der Farben, die ein Gerät oder Verfahren darstellen kann.', 'modelle'],
  ['Gegenfarbentheorie', 'Licht', 'Theorie von Ewald Hering: Das Sehsystem verrechnet Signale in Gegensatzpaaren Rot–Grün, Gelb–Blau, Hell–Dunkel.', 'wahrnehmung'],
  ['Grundfarbe / Primärfarbe', 'Ordnungen', 'Farbe, aus der andere gemischt werden. Additiv Rot, Grün, Blau; subtraktiv Cyan, Magenta, Gelb; bei Itten Gelb, Rot, Blau.', 'ordnungen'],
  ['Hell-Dunkel-Kontrast', 'Kontraste', 'Kontrast zwischen hellen und dunklen Farben. Wichtigster Kontrast für Lesbarkeit.', 'kontraste'],
  ['HEX', 'Modelle', 'Hexadezimale Schreibweise von RGB-Werten, z. B. #FF8000.', 'modelle'],
  ['HSL', 'Modelle', 'Farbmodell aus Farbton (Hue), Sättigung (Saturation) und Helligkeit (Lightness).', 'modelle'],
  ['HKS', 'Ordnungen', 'Deutsches Sonderfarbensystem für den Druck.', 'ordnungen'],
  ['ICC-Profil', 'Modelle', 'Datei, die den Farbraum eines Geräts oder Druckverfahrens beschreibt.', 'modelle'],
  ['Kalt-Warm-Kontrast', 'Kontraste', 'Kontrast zwischen warmen (Rotorange) und kalten (Blaugrün) Farben, erzeugt Raumtiefe.', 'kontraste'],
  ['Komplementärfarbe', 'Harmonie', 'Farbe, die im Farbkreis gegenüberliegt. Komplementärfarben steigern sich gegenseitig.', 'harmonien'],
  ['Komplementärkontrast', 'Kontraste', 'Kontrast zwischen zwei Komplementärfarben, z. B. Blau und Orange.', 'kontraste'],
  ['Kontrastverhältnis', 'Barrierefreiheit', 'Verhältnis der relativen Leuchtdichten zweier Farben nach WCAG, von 1 : 1 bis 21 : 1.', 'barrierefreiheit'],
  ['Metamerie', 'Licht', 'Zwei Farben sehen unter einer Lichtart gleich, unter einer anderen verschieden aus.', 'wahrnehmung'],
  ['Monochrom', 'Harmonie', 'Farbklang aus einem einzigen Farbton in verschiedenen Helligkeiten und Sättigungen.', 'harmonien'],
  ['NCS', 'Ordnungen', 'Natural Color System: beschreibt Farben über Schwarzanteil, Buntheit und Farbton.', 'ordnungen'],
  ['Nachbild', 'Licht', 'Nach längerem Betrachten einer Farbe erscheint kurz ihre Gegenfarbe.', 'wahrnehmung'],
  ['OKLCH', 'Modelle', 'Wahrnehmungsnaher Farbraum in CSS mit Helligkeit, Chroma und Farbton.', 'modelle'],
  ['Pantone', 'Ordnungen', 'Weltweit verbreitetes System nummerierter Sonderfarben.', 'ordnungen'],
  ['Protanopie', 'Barrierefreiheit', 'Ausfall der rotempfindlichen L-Zapfen. Rot wirkt dunkler, Rot und Grün werden verwechselt.', 'barrierefreiheit'],
  ['Qualitätskontrast', 'Kontraste', 'Kontrast zwischen gesättigten und getrübten Farben.', 'kontraste'],
  ['Quantitätskontrast', 'Kontraste', 'Kontrast durch unterschiedlich große Farbflächen.', 'kontraste'],
  ['RAL', 'Ordnungen', 'Deutsches Register normierter Farbtöne für Industrie und Architektur.', 'ordnungen'],
  ['Remission', 'Licht', 'Zurückwerfen von Licht durch eine Oberfläche. Das remittierte Licht bestimmt die Körperfarbe.', 'wahrnehmung'],
  ['RGB', 'Modelle', 'Farbmodell für Bildschirme aus Rot, Grün und Blau mit Werten von 0 bis 255.', 'modelle'],
  ['Sättigung', 'Modelle', 'Reinheit einer Farbe zwischen Grau (0 %) und voller Buntheit (100 %).', 'modelle'],
  ['Sekundärfarbe', 'Ordnungen', 'Mischung aus zwei Grundfarben, bei Itten Orange, Violett und Grün.', 'ordnungen'],
  ['Simultankontrast', 'Kontraste', 'Das Auge erzeugt zu einer Farbe gleichzeitig die Gegenfarbe und färbt benachbarte Flächen damit ein.', 'kontraste'],
  ['Spektrum', 'Licht', 'Gesamtheit der Wellenlängen. Sichtbar sind etwa 380 bis 780 nm.', 'wahrnehmung'],
  ['sRGB', 'Modelle', 'Standardfarbraum des Webs (1996).', 'modelle'],
  ['Stäbchen', 'Licht', 'Lichtsinneszellen für das Sehen bei wenig Licht, ohne Farbunterscheidung.', 'wahrnehmung'],
  ['Subtraktive Farbmischung', 'Mischung', 'Mischung von Körperfarben. Jede weitere Farbe nimmt Licht weg und macht dunkler.', 'mischung'],
  ['Tertiärfarbe', 'Ordnungen', 'Mischung aus einer Grund- und einer benachbarten Sekundärfarbe, z. B. Gelborange.', 'ordnungen'],
  ['Triade', 'Harmonie', 'Farbklang aus drei Farbtönen im Abstand von je 120°.', 'harmonien'],
  ['Tritanopie', 'Barrierefreiheit', 'Ausfall der blauempfindlichen S-Zapfen, Blau und Gelb werden verwechselt.', 'barrierefreiheit'],
  ['WCAG', 'Barrierefreiheit', 'Web Content Accessibility Guidelines des W3C, aktuell Version 2.2.', 'barrierefreiheit'],
  ['Zapfen', 'Licht', 'Lichtsinneszellen für das Farbsehen bei Tageslicht, in drei Typen (S, M, L).', 'wahrnehmung'],
  ['60-30-10-Regel', 'Interface', 'Faustregel zur Farbverteilung: 60 % Grundfarbe, 30 % Sekundärfarbe, 10 % Akzent.', 'interface']
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
  initWahrnehmung();
  initMischung();
  initModelle();
  initOrdnungen();
  initKontraste();
  initHarmonien();
  initWirkung();
  initInterface();
  initBarrierefreiheit();
  initMischer();
  initCodes();
  initUeKontraste();
  initHarmonie();
  initCheck();
  initPalette();
  initQuiz();
  initLit();
  initGlossar();
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
