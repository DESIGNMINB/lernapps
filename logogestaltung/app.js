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
let uid = 0;
const nid = () => 'u' + (++uid);

const store = {
  get(k, d) { try { const v = localStorage.getItem('lg2:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('lg2:' + k, JSON.stringify(v)); } catch (e) { /* Speicher nicht verfügbar */ } }
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
   Navigation und Seitenstruktur
   ================================================================ */
const ICONS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  einleitung: 'M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z',
  grundlagen: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z',
  geschichte: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  logoarten: 'M4 4h7v7H4zM17.5 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM7.5 14 11 20H4zM14 14h7v7h-7z',
  piktogramme: 'M12 2.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4zM7 9.5h10M12 9.5v5M12 14.5l-3 6.5M12 14.5l3 6.5',
  gestaltung: 'M12 3l7 12-7 6-7-6zM12 3v8M12 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  prozess: 'M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 17h6a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h6',
  anwendung: 'M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5',
  'ue-abstraktion': 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4',
  'ue-deuten': 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  'ue-baukasten': 'M4 4h16v16H4zM4 12h16M12 4v16',
  'ue-logoarten': 'M4 5h6v6H4zM14 13h6v6h-6zM10 8h4a2 2 0 0 1 2 2v3M14 16h-4a2 2 0 0 1-2-2v-3',
  'ue-labor': 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9',
  'ue-check': 'M12 3l8.5 6.2-3.2 10H6.7L3.5 9.2zM12 8l4 3-1.5 4.5h-5L8 11z',
  quiz: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6',
  literatur: 'M4 4h4v16H4zM10 4h4v16h-4zM16 5l3.5-1 3 15.5-3.5 1z',
  animation: 'M5 12a7 7 0 0 1 12-5M19 12a7 7 0 0 1-12 5M17 3v4h-4M7 21v-4h4',
  ki: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z',
  glossar: 'M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12M9 8h6M9 11h4'
};

const PAGES = [
  { id: 'home', t: 'Home' },
  { id: 'einleitung', t: 'Einleitung', sub: 'Warum Zeichen gestalten', group: 'Theorie & Grundlagen' },
  { id: 'grundlagen', t: 'Grundlagen', sub: 'Zeichen, Logo, Marke' },
  { id: 'geschichte', t: 'Geschichte', sub: 'Vom Steinmetz zum Favicon' },
  { id: 'logoarten', t: 'Logoarten', sub: 'Sechs Typen' },
  { id: 'piktogramme', t: 'Piktogramme', sub: 'Raster und Systeme' },
  { id: 'gestaltung', t: 'Gestaltungsprinzipien', sub: 'Form, Farbe, Schrift' },
  { id: 'prozess', t: 'Designprozess', sub: 'Briefing bis Reinzeichnung', group: 'Praxis & Prozess' },
  { id: 'anwendung', t: 'Anwendung', sub: 'Responsive und Styleguide' },
  { id: 'animation', t: 'Animierte Logos', sub: 'Bewegung und Icons' },
  { id: 'ki', t: 'KI und Logos', sub: 'Chancen, Grenzen, Vorgehen' },
  { id: 'ue-abstraktion', t: 'Abstraktion', sub: 'Vom Abbild zum Zeichen', group: 'Übungen · Piktogramm', ex: 1 },
  { id: 'ue-deuten', t: 'Piktogramme deuten', sub: 'Ikon, Index, Symbol', ex: 2 },
  { id: 'ue-baukasten', t: 'Piktogramm-Baukasten', sub: 'Konstruieren im Raster', ex: 3 },
  { id: 'ue-logoarten', t: 'Logoarten zuordnen', sub: 'Typen erkennen', group: 'Übungen · Logo', ex: 4 },
  { id: 'ue-labor', t: 'Logo-Labor', sub: 'Entwerfen und testen', ex: 5 },
  { id: 'ue-check', t: 'Logo-Check', sub: 'Kriterien bewerten', ex: 6 },
  { id: 'quiz', t: 'Wissenstest', sub: '14 Fragen', group: 'Wissen' },
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
    html += `<a href="#${p.id}" data-nav="${p.id}">${icon(p.id)}<span>${esc(p.t)}</span>${p.ex ? '<span class="done-dot" hidden><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></span>' : ''}</a>`;
  }
  $('#nav').innerHTML = html;
}

/* Kachelgrafiken für die Startseite: jede Grafik greift das Kapitelthema auf */
// Eigene Kachelbilder, die nirgends sonst auf der Seite vorkommen
const TILE_PHOTOS = Object.fromEntries(PAGES.filter((p) => p.id !== 'home').map((p) => [p.id, `media/tile-${p.id}.jpg`]));
function tileArt(id) {
  if (TILE_PHOTOS[id]) return `<img class="bg" src="${TILE_PHOTOS[id]}" alt="" loading="lazy">`;
  let bg = '#d5cdc2', a = '#bdb3a6', b = '#ece6de', c = '#a59b8e';
  const ex = id.startsWith('ue-');
  if (ex) { bg = '#1d1b1a'; a = '#ff4f0f'; b = '#3a3532'; c = '#6b625b'; }
  if (['quiz', 'literatur', 'glossar'].includes(id)) { bg = '#e3ded8'; a = '#cbc3b9'; b = '#f4f1ed'; c = '#b2a99d'; }
  let s = '';
  switch (id) {
    case 'einleitung': s = `<circle cx="270" cy="120" r="112" fill="${a}"/><rect x="70" y="50" width="150" height="150" fill="${b}"/><path d="M70 200 220 50" stroke="${c}" stroke-width="3"/>`; break;
    case 'grundlagen': s = `<path d="M50 190 110 120 170 190V250H50z" fill="${b}"/><ellipse cx="225" cy="200" rx="18" ry="30" fill="${a}"/><ellipse cx="260" cy="150" rx="18" ry="30" fill="${a}"/><circle cx="340" cy="120" r="44" fill="none" stroke="${c}" stroke-width="12"/>`; break;
    case 'geschichte': s = `<g fill="none" stroke="${a}" stroke-width="10">${[30, 60, 90, 120, 150].map((r) => `<circle cx="300" cy="80" r="${r}"/>`).join('')}</g><path d="M40 220h120M100 160v120" stroke="${b}" stroke-width="16"/>`; break;
    case 'logoarten': s = [[60, 50], [170, 50], [280, 50], [60, 160], [170, 160], [280, 160]].map(([x, y], i) => i % 3 === 0 ? `<rect x="${x}" y="${y}" width="80" height="80" fill="${i ? a : b}"/>` : i % 3 === 1 ? `<circle cx="${x + 40}" cy="${y + 40}" r="40" fill="${i > 2 ? b : c}"/>` : `<path d="M${x} ${y + 80} ${x + 40} ${y} ${x + 80} ${y + 80}z" fill="${a}"/>`).join(''); break;
    case 'piktogramme': s = `<g stroke="${b}" stroke-width="1">${Array.from({ length: 21 }, (_, i) => `<path d="M${i * 20} 0v300M0 ${i * 20}h400"/>`).join('')}</g><circle cx="200" cy="80" r="30" fill="${c}"/><rect x="170" y="125" width="60" height="110" rx="30" fill="${c}"/>`; break;
    case 'gestaltung': s = `<g fill="none" stroke="${a}" stroke-width="8"><path d="M330 260A230 230 0 0 1 100 30"/><path d="M330 120A142 142 0 0 0 188 262"/><rect x="100" y="30" width="230" height="230"/></g><circle cx="250" cy="190" r="50" fill="${b}"/>`; break;
    case 'prozess': s = `<path d="M30 230c60-120 90 40 150-60s70-120 190-110" fill="none" stroke="${b}" stroke-width="10" stroke-linecap="round"/><path d="M60 80c40 20 80-30 120 0s60 30 90 0" fill="none" stroke="${a}" stroke-width="6" stroke-linecap="round"/><circle cx="370" cy="60" r="16" fill="${c}"/>`; break;
    case 'anwendung': s = `<rect x="40" y="40" width="200" height="200" rx="12" fill="${b}"/><rect x="260" y="100" width="100" height="100" rx="10" fill="${a}"/><rect x="300" y="226" width="44" height="44" rx="8" fill="${c}"/>`; break;
    case 'ki': s = `<path d="M260 40l22 58 58 22-58 22-22 58-22-58-58-22 58-22z" fill="${a}"/><path d="M110 170l10 26 26 10-26 10-10 26-10-26-26-10 26-10z" fill="${b}"/>`; break;
    case 'animation': s = [0, 1, 2, 3, 4].map((i) => `<circle cx="${90 + i * 55}" cy="${180 - i * 22}" r="${26 + i * 4}" fill="${i === 4 ? '#ff4f0f' : a}" opacity="${.35 + i * .15}"/>`).join(''); break;
    case 'ue-abstraktion': s = [0, 1, 2, 3].map((i) => `<circle cx="${80 + i * 80}" cy="120" r="${44 - i * 8}" fill="${i === 3 ? a : b}"/>`).join(''); break;
    case 'ue-deuten': s = `<circle cx="250" cy="110" r="70" fill="${b}"/><circle cx="250" cy="110" r="30" fill="${a}"/><path d="M60 200h80M60 230h50" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`; break;
    case 'ue-baukasten': s = `<g stroke="${b}" stroke-width="1">${Array.from({ length: 21 }, (_, i) => `<path d="M${i * 20} 0v300M0 ${i * 20}h400"/>`).join('')}</g><rect x="160" y="60" width="140" height="100" fill="${a}"/><circle cx="300" cy="110" r="40" fill="${c}"/>`; break;
    case 'ue-logoarten': s = `<rect x="200" y="40" width="80" height="80" fill="${b}"/><rect x="300" y="40" width="80" height="80" fill="${a}"/><rect x="200" y="140" width="80" height="80" fill="${b}"/><rect x="300" y="140" width="80" height="80" fill="${b}"/>`; break;
    case 'ue-labor': s = `<circle cx="300" cy="100" r="60" fill="none" stroke="${a}" stroke-width="16"/><path d="M300 40a60 60 0 0 1 0 120z" fill="${a}"/><rect x="190" y="200" width="190" height="16" fill="${b}"/>`; break;
    case 'ue-check': s = `<path d="M290 30l80 58-30 94H240l-30-94z" fill="none" stroke="${b}" stroke-width="3"/><path d="M290 60l60 40-40 70h-50l-20-60z" fill="${a}" opacity=".85"/>`; break;
    case 'quiz': s = `<circle cx="300" cy="110" r="80" fill="${b}"/><text x="300" y="150" text-anchor="middle" font-family="Source Serif 4, Georgia, serif" font-weight="700" font-size="120" fill="${c}">?</text>`; break;
    case 'literatur': s = [0, 1, 2, 3, 4].map((i) => `<rect x="${200 + i * 34}" y="${40 + (i % 2) * 20}" width="28" height="${200 - (i % 2) * 20}" fill="${i === 2 ? c : a}"/>`).join(''); break;
    case 'glossar': s = `<text x="380" y="190" text-anchor="end" font-family="Archivo, sans-serif" font-weight="900" font-size="150" fill="${a}" style="font-stretch:125%">Az</text>`; break;
  }
  return `<svg class="bg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="${bg}"/>${s}</svg>`;
}

function renderTiles() {
  const mk = (p, num) => `<a class="tile" href="#${p.id}" data-tile="${p.id}"><div class="art">${tileArt(p.id)}<span class="num">${num}</span>${p.ex ? '<span class="tag-ex">Übung</span><span class="tag-done" hidden>Erledigt</span>' : ''}</div><h3>${esc(p.t)}</h3><p>${esc(p.sub)}</p></a>`;
  const theory = PAGES.slice(1, 11);
  $('#tiles-theory').innerHTML = theory.map((p, i) => mk(p, String(i + 1).padStart(2, '0'))).join('');
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
function show(id, scroll = true) {
  if (!pageById(id)) return false;
  for (const p of $$('.page')) p.classList.toggle('active', p.dataset.page === id);
  for (const a of $$('[data-nav]')) {
    if (a.dataset.nav === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
  $('#app').classList.remove('nav-open');
  $('#menu-btn').setAttribute('aria-expanded', 'false');
  if (scroll) window.scrollTo(0, 0);
  if (pageHooks[id]) pageHooks[id]();
  store.set('last', id);
  return true;
}
function route() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) { show('home'); return; }
  if (!show(id) && !$('.page.active')) show('home');
}

/* ================================================================
   Fortschritt
   ================================================================ */
let done = new Set(store.get('done', []));
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
});

/* ================================================================
   Fiktive Beispiel-Logos
   ================================================================ */
const ACC = '#ff4f0f';
const PAPER = 'style="fill:var(--paper)"';
const LOGOS = {
  nordlicht: { cat: 'wort', label: 'nordlicht', svg: () => `<svg viewBox="0 0 270 70" role="img" aria-label="Wortmarke nordlicht"><text x="135" y="47" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="300" font-size="40" letter-spacing="5" fill="currentColor" style="font-stretch:125%">nordlicht</text></svg>` },
  kontor: { cat: 'wort', label: 'Kontor', svg: () => `<svg viewBox="0 0 200 70" role="img" aria-label="Wortmarke Kontor"><text x="100" y="50" text-anchor="middle" font-family="Source Serif 4, Georgia, serif" font-weight="700" font-size="46" fill="currentColor">Kontor<tspan fill="${ACC}">.</tspan></text></svg>` },
  km: { cat: 'buchstabe', label: 'km', svg: () => `<svg viewBox="0 0 130 80" role="img" aria-label="Buchstabenmarke km"><text x="65" y="63" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="900" font-size="68" letter-spacing="-5" fill="currentColor" style="font-stretch:125%">km</text><rect x="22" y="68" width="86" height="6" fill="${ACC}"/></svg>` },
  vogel: { cat: 'bild', label: 'Vogel', svg: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Bildmarke Vogel"><g fill="currentColor"><path d="M12 76A58 58 0 0 1 70 18V76z"/><circle cx="78" cy="30" r="12"/><path d="M88 25 100 31 88 37z" fill="${ACC}"/><path d="M70 76h24L70 56z"/></g><circle cx="81" cy="27" r="2.6" ${PAPER}/></svg>` },
  fuchs: { cat: 'bild', label: 'Fuchs', svg: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Bildmarke Fuchs"><path d="M12 12 38 40h24l26-28v42L50 92 12 54z" fill="currentColor"/><circle cx="35" cy="56" r="4" ${PAPER}/><circle cx="65" cy="56" r="4" ${PAPER}/><path d="M43 74h14l-7 9z" ${PAPER}/></svg>` },
  fahrwerk: { cat: 'wortbild', label: 'fahrwerk', svg: () => fahrwerk(1) },
  lumen: { cat: 'wortbild', label: 'lumen', svg: () => `<svg viewBox="0 0 250 90" role="img" aria-label="Wort-Bild-Marke lumen"><circle cx="45" cy="45" r="28" fill="none" stroke="currentColor" stroke-width="7"/><path d="M45 17a28 28 0 0 1 0 56z" fill="currentColor"/><text x="90" y="58" font-family="Archivo, sans-serif" font-weight="600" font-size="38" letter-spacing="1" fill="currentColor">lumen</text></svg>` },
  altstadt: { cat: 'emblem', label: 'Brauerei Altstadt', svg: () => { const id = nid(); return `<svg viewBox="0 0 120 120" role="img" aria-label="Emblem Brauerei Altstadt"><defs><path id="${id}" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0"/></defs><circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="60" cy="60" r="35" fill="currentColor"/><text font-family="Archivo, sans-serif" font-weight="700" font-size="10" letter-spacing="1.6" fill="currentColor"><textPath href="#${id}" textLength="276" lengthAdjust="spacing">BRAUEREI ALTSTADT · SEIT 1898 ·</textPath></text><path d="M45 78V60l15-13 15 13v18z" ${PAPER}/><rect x="56" y="66" width="8" height="12" fill="currentColor"/></svg>`; } },
  prisma: { cat: 'abstrakt', label: 'Prisma', svg: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Abstrakte Marke"><path d="M14 82 40 18h16L30 82z" fill="currentColor"/><path d="M44 82 70 18h16L60 82z" fill="${ACC}"/></svg>` },
  orbit: { cat: 'abstrakt', label: 'Orbit', svg: () => `<svg viewBox="0 0 100 100" role="img" aria-label="Abstrakte Marke Orbit"><circle cx="50" cy="50" r="38" fill="currentColor"/><circle cx="60" cy="42" r="22" ${PAPER}/><circle cx="66" cy="37" r="9" fill="${ACC}"/></svg>` }
};

/* Fahrwerk in vier responsiven Stufen: 0 = XL … 3 = S */
function fahrwerk(step) {
  const wheel = (cx, cy, r, spokes, sw) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ACC}" stroke-width="${sw}"/><circle cx="${cx}" cy="${cy}" r="${r * .2}" fill="${ACC}"/>` +
    Array.from({ length: spokes }, (_, i) => { const a = (i / spokes) * Math.PI * 2 - Math.PI / 2; return `<path d="M${cx} ${cy}L${(cx + Math.cos(a) * r * .8).toFixed(1)} ${(cy + Math.sin(a) * r * .8).toFixed(1)}" stroke="${ACC}" stroke-width="${sw * .45}"/>`; }).join('');
  const word = (x, y, s) => `<text x="${x}" y="${y}" font-family="Archivo, sans-serif" font-weight="800" font-size="${s}" letter-spacing="-.5" fill="currentColor">fahrwerk</text>`;
  if (step === 0) return `<svg viewBox="0 0 290 100" role="img" aria-label="Fahrwerk, volle Version mit Claim">${wheel(40, 44, 28, 6, 7)}${word(84, 54, 38)}<text x="86" y="78" font-family="Archivo, sans-serif" font-weight="500" font-size="10" letter-spacing="1.5" fill="currentColor" opacity=".7">FAHRRÄDER · WERKSTATT · SEIT 1987</text></svg>`;
  if (step === 1) return `<svg viewBox="0 0 280 80" role="img" aria-label="Wort-Bild-Marke fahrwerk">${wheel(40, 40, 28, 6, 7)}${word(84, 53, 38)}</svg>`;
  if (step === 2) return `<svg viewBox="0 0 160 80" role="img" aria-label="Fahrwerk, kompakte Version">${wheel(40, 40, 28, 5, 8)}<text x="82" y="54" font-family="Archivo, sans-serif" font-weight="800" font-size="40" fill="currentColor">fw</text></svg>`;
  return `<svg viewBox="0 0 80 80" role="img" aria-label="Fahrwerk, Bildzeichen">${wheel(40, 40, 30, 3, 11)}</svg>`;
}

function fillLogoSlots() {
  for (const el of $$('[data-logo]')) el.innerHTML = LOGOS[el.dataset.logo].svg();
}

/* ================================================================
   Kapitel-Demos
   ================================================================ */
function initDemos() {
  // Isotype
  const person = `<svg viewBox="0 0 12 24" width="12" height="24" aria-hidden="true"><circle cx="6" cy="3.2" r="3" fill="currentColor"/><rect x="2" y="7.5" width="8" height="9" rx="2" fill="currentColor"/><rect x="2.6" y="15" width="2.8" height="9" fill="currentColor"/><rect x="6.6" y="15" width="2.8" height="9" fill="currentColor"/></svg>`;
  const rows = [['ÖPNV', 14, 'var(--ink)'], ['Fahrrad', 9, 'var(--accent)'], ['zu Fuß', 4, 'var(--ink)'], ['Auto', 3, 'var(--muted)']];
  $('#isotype-demo').innerHTML = rows.map(([l, n, c]) => `<div style="display:grid;grid-template-columns:76px 1fr auto;gap:12px;align-items:center;padding:6px 0;border-bottom:1px solid var(--line)"><span class="small" style="font-weight:600">${l}</span><span style="display:flex;flex-wrap:wrap;gap:5px;color:${c}">${person.repeat(n)}</span><span class="mono small muted">${n * 10}</span></div>`).join('');

  // Keyline-Raster
  let g = '';
  for (let i = 0; i <= 48; i++) {
    const cls = i % 4 === 0 ? 'stroke="var(--faint)" stroke-width=".12"' : 'stroke="var(--line)" stroke-width=".06"';
    g += `<path d="M${i} 0V48M0 ${i}H48" ${cls}/>`;
  }
  $('#keyline-grid').innerHTML = g;

  // Optischer Ausgleich
  const oc = $('#oc-svg');
  const drawOc = (opt) => {
    const o = opt ? 2 : 0;
    oc.innerHTML = `<path class="base" d="M0 100H300M0 20H300"/>
      <rect class="f" x="15" y="20" width="80" height="80"/>
      <circle class="f" cx="150" cy="60" r="${40 + o}"/>
      <path class="f" d="M250 ${20 - o * 2.2}L${292 + o * .6} ${100 + o * .6}H${208 - o * .6}z"/>`;
    $('#oc-text').textContent = opt
      ? 'Kreis und Dreieck ragen nun über die Linien hinaus, das Dreieck wegen seiner Spitze stärker. Jetzt wirken die drei Formen gleich groß.'
      : 'Alle drei Formen sind exakt 80 Einheiten hoch. Kreis und Dreieck wirken trotzdem kleiner als das Quadrat.';
  };
  drawOc(false);
  for (const b of $$('[data-oc]')) b.addEventListener('click', () => {
    for (const x of $$('[data-oc]')) x.setAttribute('aria-pressed', String(x === b));
    drawOc(b.dataset.oc === 'opt');
  });

  // Responsive Logo
  const respTexts = [
    'XL · Vollständiges Logo mit Claim. Für Plakate, Fahrzeugbeschriftung und große Website-Header.',
    'L · Standardversion ohne Claim. Für Briefbogen, Website und Präsentationen.',
    'M · Kompakte Version mit Kürzel. Für mobile Header und Social-Media-Profile.',
    'S · Nur das Bildzeichen, mit weniger Speichen und dickerem Strich. Für Favicon und App-Icon ab 16 px.'
  ];
  const respHeights = ['120px', '84px', '72px', '64px'];
  const drawResp = (s) => {
    $('#resp-view').innerHTML = fahrwerk(s);
    const svg = $('#resp-view svg'); svg.style.height = respHeights[s]; svg.style.maxWidth = '90%';
    $('#resp-text').textContent = respTexts[s];
  };
  drawResp(0);
  for (const b of $$('#resp-toggle button')) b.addEventListener('click', () => {
    for (const x of $$('#resp-toggle button')) x.setAttribute('aria-pressed', String(x === b));
    drawResp(+b.dataset.step);
  });

  // Anwendungsfehler
  const lumen = LOGOS.lumen.svg();
  const donts = [
    ['ok', 'Original', '', ''],
    ['x', 'Verzerrt', 'transform:scaleX(1.5)', ''],
    ['x', 'Farbe verändert', 'color:#d0399a', ''],
    ['x', 'Effekte hinzugefügt', 'filter:drop-shadow(3px 4px 2px rgba(0,0,0,.45)) blur(.3px);color:#888', ''],
    ['x', 'Gedreht', 'transform:rotate(-14deg)', ''],
    ['x', 'Unruhiger Hintergrund', 'color:#161412', 'background:repeating-linear-gradient(45deg,#c9c2b8 0 8px,#ece7e0 8px 16px)'],
    ['x', 'Zu wenig Kontrast', 'color:#ddd8d2', 'background:#f4f1ed'],
    ['x', 'Schutzzone verletzt', '', '', true]
  ];
  $('#dont-grid').innerHTML = donts.map(([k, t, st, bg, crowd]) => `<div class="dont"><div class="pic" style="${bg}"><span style="display:contents;color:var(--ink)"><span style="display:block;${st}">${lumen.replace('<svg', '<svg style="height:44px;display:block"')}</span></span>${crowd ? '<span style="position:absolute;inset:auto 6px 10px auto;font:700 10px/1 var(--f-body);background:var(--accent);color:#fff;padding:5px 6px;border-radius:4px">JETZT -30 %</span><span style="position:absolute;left:8px;top:8px;width:30px;height:30px;border-radius:50%;background:var(--ink)"></span>' : ''}</div><div class="cap"><span class="x${k === 'ok' ? ' ok' : ''}">${k === 'ok' ? '✓' : '✕'}</span><span>${t}</span></div></div>`).join('');
}

/* ================================================================
   Übung 1 · Abstraktion
   ================================================================ */
const CUP = [
  { t: 'Abbild', d: 'Perspektive, Schatten, Material und viele Details. Eindeutig, aber in kleiner Größe unlesbar und an diese eine Tassenform gebunden.',
    svg: `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><ellipse cx="48" cy="80" rx="40" ry="9"/><ellipse cx="48" cy="79" rx="24" ry="5"/><path d="M24 42c0 28 8 36 24 36s24-8 24-36"/><ellipse cx="48" cy="42" rx="24" ry="6"/><ellipse cx="48" cy="43" rx="20" ry="4.2" fill="currentColor" fill-opacity=".35"/><path d="M71 50c13-2 15 12 3 16M71 55c8-1 9 5 2 7"/><path d="M30 52c1 12 6 20 14 23M34 50c1 10 4 17 8 21M38 49c0 9 2 14 5 18" stroke-width=".9"/><path d="M38 34c-4-6 4-10 0-18M48 32c-4-6 4-10 0-20M58 34c-4-6 4-10 0-17" stroke-width="1.2"/><path d="M12 82c8 5 18 7 30 7" stroke-width=".9"/><path d="M58 76l22-12 6 2-24 13z" stroke-width="1.1"/></g>` },
  { t: 'Illustration', d: 'Flächen statt Linien, die Perspektive bleibt. Schraffur, Löffel und Spiegelungen fallen weg.',
    svg: `<g fill="currentColor"><ellipse cx="48" cy="80" rx="38" ry="8" opacity=".35"/><path d="M24 42c0 28 8 36 24 36s24-8 24-36z"/><path d="M70 49c14-3 17 14 3 18v-5c7-2 6-9-2-8z"/></g><ellipse cx="48" cy="42" rx="24" ry="6" ${PAPER} stroke="currentColor" stroke-width="2.5"/><path d="M40 33c-4-5 4-9 0-15M54 33c-4-5 4-9 0-15" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>` },
  { t: 'Piktogramm', d: 'Frontalansicht aus Grundformen. Untertasse, Henkel und Dampf bleiben als typische Merkmale erhalten.',
    svg: `<g fill="currentColor"><rect x="14" y="78" width="66" height="7" rx="3.5"/><path d="M22 40h44v20a18 18 0 0 1-18 18h-8a18 18 0 0 1-18-18z"/><path d="M66 46h4a11 11 0 0 1 0 22h-5v-7h5a4 4 0 0 0 0-8h-4z"/><rect x="33" y="16" width="6" height="16" rx="3"/><rect x="49" y="16" width="6" height="16" rx="3"/></g>` },
  { t: 'Zeichen', d: 'Nur noch Körper und Henkel. Der Henkel ist das Merkmal, das eine Tasse von einem Glas unterscheidet.',
    svg: `<g fill="currentColor"><path d="M18 30h50v34a14 14 0 0 1-14 14H32a14 14 0 0 1-14-14z"/><path d="M68 38h4a13 13 0 0 1 0 26h-4v-9h4a4 4 0 0 0 0-8h-4z"/></g>` },
  { t: 'Abstraktes Zeichen', d: 'Nur noch Kreis und Fläche, die Tasse von oben. Ohne Kontext kaum noch als Tasse lesbar: Die Bedeutung muss zunehmend gelernt werden. Je weiter die Abstraktion geht, desto mehr nähert sich das Zeichen einem Symbol im Sinne von Peirce.',
    svg: `<circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" stroke-width="9"/><circle cx="50" cy="50" r="20" fill="currentColor"/>` }
];
const TREES = [
  { id: 'a', svg: `<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M46 92V60c0-6-8-10-14-14M54 92V58c0-6 8-8 12-14M50 64c0-8 2-14 0-22"/><circle cx="30" cy="38" r="12"/><circle cx="48" cy="26" r="15"/><circle cx="68" cy="36" r="13"/><circle cx="40" cy="48" r="9"/><circle cx="60" cy="50" r="10"/><path d="M26 34l4 3M44 22l5 3M64 32l4 4M38 46l3 2M58 48l3 2" stroke-width=".9"/><path d="M14 92h72M22 92l3-5M30 92l2-4M66 92l3-5M76 92l2-4" stroke-width="1"/></g>` },
  { id: 'b', svg: `<g fill="currentColor"><circle cx="34" cy="42" r="16"/><circle cx="52" cy="30" r="19"/><circle cx="66" cy="44" r="15"/><circle cx="50" cy="50" r="16"/><path d="M45 60h10l3 32H42z"/><ellipse cx="50" cy="92" rx="30" ry="3" opacity=".4"/></g>` },
  { id: 'c', svg: `<g fill="currentColor"><circle cx="50" cy="38" r="26"/><rect x="44" y="58" width="12" height="32"/></g>` },
  { id: 'd', svg: `<g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><circle cx="50" cy="38" r="22"/><path d="M50 60v30"/></g>` }
];

function initAbstraktion() {
  const range = $('#abs-range');
  const draw = () => {
    const i = +range.value - 1, s = CUP[i];
    $('#abs-pic').innerHTML = `<svg viewBox="0 0 100 100" aria-label="Tasse, Stufe ${i + 1}: ${s.t}">${s.svg}</svg>`;
    $('#abs-step').textContent = `Stufe ${i + 1} von 5`;
    $('#abs-title').textContent = s.t;
    $('#abs-desc').textContent = s.d;
  };
  range.addEventListener('input', draw);
  draw();

  let order = [], items = shuffle(TREES);
  const grid = $('#order-grid');
  const render = (result) => {
    grid.innerHTML = items.map((t) => {
      const pos = order.indexOf(t.id);
      const cls = result ? (result[t.id] ? ' ok' : ' bad') : '';
      return `<button type="button" class="order-item${cls}" data-id="${t.id}" aria-label="Baum ${items.indexOf(t) + 1}${pos >= 0 ? ', gewählt als Position ' + (pos + 1) : ''}"><svg viewBox="0 0 100 100" aria-hidden="true">${t.svg}</svg>${pos >= 0 ? `<span class="pos">${pos + 1}</span>` : ''}</button>`;
    }).join('');
  };
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.order-item'); if (!b) return;
    const id = b.dataset.id, i = order.indexOf(id);
    if (i >= 0) order.splice(i, 1); else order.push(id);
    $('#order-fb').innerHTML = '';
    render();
  });
  $('#order-check').addEventListener('click', () => {
    if (order.length < 4) { $('#order-fb').innerHTML = `<div class="feedback info"><p>Wählen Sie zuerst alle vier Bäume in einer Reihenfolge aus.</p></div>`; return; }
    const correct = ['a', 'b', 'c', 'd'];
    const res = {}; let ok = 0;
    order.forEach((id, i) => { res[id] = correct[i] === id; if (res[id]) ok++; });
    render(res);
    if (ok === 4) {
      $('#order-fb').innerHTML = `<div class="feedback ok"><p><strong>Richtig.</strong> Abbild → Illustration → Piktogramm → abstraktes Zeichen.</p><p>Beim letzten Baum sind Krone und Stamm nur noch Kreis und Linie, ohne Fläche und ohne Details. Das Kugel-Piktogramm davor zeigt dagegen noch die typische Silhouette eines Laubbaums.</p></div>`;
      markDone('ue-abstraktion');
    } else {
      $('#order-fb').innerHTML = `<div class="feedback bad"><p><strong>${ok} von 4 an der richtigen Position.</strong></p><p>Fragen Sie sich bei jedem Bild: Wie viele Merkmale des echten Baums sind noch vorhanden? Je weniger, desto abstrakter.</p></div>`;
    }
  });
  $('#order-reset').addEventListener('click', () => { order = []; items = shuffle(TREES); $('#order-fb').innerHTML = ''; render(); });
  render();
}

/* ================================================================
   Übung 2 · Piktogramme deuten
   ================================================================ */
const PQ = [
  { svg: `<circle cx="24" cy="24" r="21" fill="currentColor"/><circle cx="24" cy="13" r="3.4" ${PAPER}/><rect x="20.8" y="19" width="6.4" height="18" rx="1" ${PAPER}/>`,
    o: ['Information', 'Hilfe-Notruf', 'Internet', 'Achtung'], a: 0, type: 'Symbol',
    e: 'Das „i“ als Abkürzung für „Information“ ist eine Konvention. Es funktioniert nur, weil wir es gelernt haben, und ist in ISO 7001 genormt.' },
  { svg: `<path d="M5 42V35h9.5v-7.5H24V20h9.5v-7.5H43V42z" fill="currentColor"/>`,
    o: ['Diagramm / Statistik', 'Treppe', 'Rolltreppe', 'Stufenlos'], a: 1, type: 'Ikon',
    e: 'Die Stufen ähneln direkt einer Treppe im Profil. Rein ikonische Zeichen sind am leichtesten zu deuten.' },
  { svg: `<rect x="8" y="3" width="32" height="42" rx="3" fill="currentColor"/><path d="M24 9l9 10H15z" ${PAPER}/><path d="M24 39l-9-10h18z" ${PAPER}/>`,
    o: ['Lautstärke', 'Sortieren', 'Aufzug', 'Scrollen'], a: 2, type: 'Ikon + Symbol',
    e: 'Die Kabine ist ikonisch, die Pfeile nach oben und unten sind konventionell. In Gebäuden ist die Deutung durch den Kontext eindeutig.' },
  { svg: `<rect x="9" y="25" width="23" height="6" fill="currentColor"/><rect x="33" y="25" width="5" height="6" fill="currentColor"/><path d="M36 21c-3-3 3-5 0-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="24" r="20" fill="none" stroke="#c8102e" stroke-width="4"/><path d="M10 10 38 38" stroke="#c8102e" stroke-width="4"/>`,
    o: ['Raucherbereich', 'Rauchen verboten', 'Brandgefahr', 'Feuerlöscher'], a: 1, type: 'Ikon + Symbol',
    e: 'Die Zigarette ist ikonisch. Roter Kreis mit Schrägbalken bedeutet nach ISO 7010 „Verbot“. Diese Konvention muss man kennen.' },
  { svg: `<rect x="4" y="5" width="20" height="38" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M14 24h28M34 15l9 9-9 9" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    o: ['Ausgang', 'Eingang', 'Tür schließen', 'Weiter'], a: 0, type: 'Ikon + Symbol',
    e: 'Tür (Ikon) und Pfeil (Symbol). Der Pfeil zeigt aus der Tür heraus, deshalb „Ausgang“. Die Richtung entscheidet über die Bedeutung.' },
  { svg: `<circle cx="24" cy="39" r="3.8" fill="currentColor"/><path d="M15 31a13 13 0 0 1 18 0M9 24a21.5 21.5 0 0 1 30 0M3 17a30 30 0 0 1 42 0" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>`,
    o: ['Radio', 'Signalstärke Mobilfunk', 'WLAN', 'Lautsprecher'], a: 2, type: 'Symbol',
    e: 'Funkwellen sind unsichtbar. Die Bögen sind eine gelernte Konvention und werden erst durch den Alltag eindeutig.' },
  { svg: `<path d="M12 5v11a5 5 0 0 0 4 4.9V43h4V20.9a5 5 0 0 0 4-4.9V5h-2.6v10h-1.8V5h-2.6v10h-1.8V5z" fill="currentColor"/><path d="M31 5c6 3 7 13 5 19h-1v19h-4z" fill="currentColor"/>`,
    o: ['Restaurant', 'Küche', 'Werkzeug', 'Besteckkasten'], a: 0, type: 'Ikon (pars pro toto)',
    e: 'Gabel und Messer stehen als Teil für das Ganze: das Essen. Diese Stellvertretung (pars pro toto) ist typisch für Piktogramme.' },
  { svg: `<g fill="currentColor"><ellipse cx="16" cy="34" rx="4.5" ry="7" transform="rotate(-12 16 34)"/><circle cx="12.5" cy="24" r="1.7"/><circle cx="16" cy="23" r="1.7"/><circle cx="19.3" cy="24" r="1.6"/><ellipse cx="32" cy="18" rx="4.5" ry="7" transform="rotate(10 32 18)"/><circle cx="28.4" cy="8.5" r="1.7"/><circle cx="32" cy="7.6" r="1.7"/><circle cx="35.4" cy="8.8" r="1.6"/></g>`,
    o: ['Schuhgeschäft', 'Fußweg / hier entlang', 'Fußpflege', 'Tanzschule'], a: 1, type: 'Index',
    e: 'Fußspuren sind die Folge des Gehens. Sie verweisen indexikalisch auf eine Handlung, nicht auf einen Gegenstand.' }
];
function initDeuten() {
  const root = $('#pq');
  let i = 0, results = [];
  const render = () => {
    if (i >= PQ.length) {
      const ok = results.filter(Boolean).length;
      const pass = ok >= 6;
      root.innerHTML = `<div class="quiz-result"><div class="label">Ergebnis</div><div class="big">${ok}<small> / ${PQ.length}</small></div><p style="margin:12px auto;max-width:48ch">${pass ? 'Bestanden. Sie erkennen, wann ein Zeichen durch Ähnlichkeit wirkt und wann durch gelernte Konvention.' : 'Noch nicht bestanden. Lesen Sie im Kapitel „Grundlagen“ den Abschnitt zu Ikon, Index und Symbol und versuchen Sie es erneut.'}</p><div class="dots" style="justify-content:center">${results.map((r) => `<span class="${r ? 'ok' : 'bad'}"></span>`).join('')}</div><button class="btn btn-dark" type="button" id="pq-restart" style="margin-top:18px">Noch einmal</button></div>`;
      $('#pq-restart').addEventListener('click', () => { i = 0; results = []; render(); });
      if (pass) markDone('ue-deuten');
      return;
    }
    const q = PQ[i];
    const ord = shuffle(q.o.map((_, k) => k));
    root.innerHTML = `<div class="pq"><div class="pq-pic"><svg viewBox="0 0 48 48" aria-label="Piktogramm ${i + 1}">${q.svg}</svg></div><div><div class="pq-count">Zeichen ${i + 1} von ${PQ.length}</div><div class="quiz-q">Was bedeutet dieses Zeichen?</div><div class="options">${ord.map((k, n) => `<button type="button" class="opt" data-k="${k}"><span class="k">${'ABCD'[n]}</span>${esc(q.o[k])}</button>`).join('')}</div><div id="pq-fb"></div><div class="dots">${PQ.map((_, k) => `<span class="${k < results.length ? (results[k] ? 'ok' : 'bad') : k === i ? 'cur' : ''}"></span>`).join('')}</div></div></div>`;
    for (const b of $$('.opt', root)) b.addEventListener('click', () => {
      const k = +b.dataset.k, right = k === q.a;
      results.push(right);
      for (const x of $$('.opt', root)) { x.disabled = true; if (+x.dataset.k === q.a) x.classList.add('right'); }
      if (!right) b.classList.add('wrong');
      $('#pq-fb').innerHTML = `<div class="feedback ${right ? 'ok' : 'bad'}"><p><strong>${right ? 'Richtig.' : 'Nicht ganz.'}</strong> Zeichentyp: ${esc(q.type)}</p><p>${esc(q.e)}</p></div><button class="btn btn-dark" type="button" id="pq-next" style="margin-top:14px">${i + 1 < PQ.length ? 'Nächstes Zeichen' : 'Ergebnis anzeigen'}</button>`;
      $('#pq-next').addEventListener('click', () => { i++; render(); });
      $('#pq-next').focus();
    });
  };
  render();
}

/* ================================================================
   Übung 3 · Piktogramm-Baukasten
   ================================================================ */
const BRIEFS = [
  ['Café', 'Tasse, Dampf, Untertasse: Welches Merkmal ist unverzichtbar?'],
  ['Fahrradparkplatz', 'Zwei Räder und ein Rahmen reichen oft schon.'],
  ['Bibliothek', 'Buch, Regal oder lesende Person?'],
  ['WLAN-Zone', 'Die Wellen sind eine gelernte Konvention.'],
  ['Mensa', 'Besteck, Tablett oder Teller?'],
  ['Erste Hilfe', 'Das Kreuz ist eine gelernte Konvention. Die Normfarbe Grün aus ISO 7010 kommt erst später dazu, hier zählt die Form.'],
  ['Ruhebereich', 'Wie zeigt man Stille, ohne Text?'],
  ['Freies Thema', 'Wählen Sie selbst ein Motiv aus Ihrem Alltag.']
];
const SHAPES = {
  circle: ['Kreis', '<circle cx="8" cy="8" r="6.5"/>'],
  rect: ['Rechteck', '<rect x="2" y="2" width="12" height="12"/>'],
  capsule: ['Kapsel', '<rect x="1" y="5" width="14" height="6" rx="3"/>'],
  tri: ['Dreieck', '<path d="M8 2 15 14H1z"/>'],
  half: ['Halbkreis', '<path d="M1 12a7 7 0 0 1 14 0z"/>']
};
/* Beispiel-Piktogramme, je eines pro Aufgabe (gleiche Reihenfolge wie BRIEFS) */
const C = (type, x, y, w, h, r = 0, neg = false) => ({ type, x, y, w, h, r, neg });
const EXAMPLES = [
  // Café
  [C('capsule', 17, 12.5, 3, 8), C('capsule', 25, 12.5, 3, 8), C('circle', 31, 26, 12, 12), C('circle', 31, 26, 6, 6, 0, true),
    C('half', 21, 28, 22, 16, 180), C('capsule', 21, 38.5, 28, 3)],
  // Fahrradparkplatz
  [C('circle', 13, 32, 16, 16), C('circle', 13, 32, 10, 10, 0, true), C('circle', 35, 32, 16, 16), C('circle', 35, 32, 10, 10, 0, true),
    C('capsule', 24, 32, 22, 3), C('capsule', 27, 26, 15, 3, 300), C('capsule', 21, 26, 15, 3, 240), C('capsule', 24, 20, 14, 3),
    C('capsule', 17, 18, 8, 3), C('capsule', 33, 17, 7, 3)],
  // Bibliothek
  [C('rect', 12, 26, 6, 20), C('rect', 12, 20, 6, 1.5, 0, true), C('rect', 19.5, 24.5, 6, 23), C('rect', 19.5, 18, 6, 1.5, 0, true),
    C('rect', 31, 26.5, 6, 20, 15), C('capsule', 24, 39, 36, 3)],
  // WLAN-Zone
  [C('half', 24, 26, 40, 20), C('half', 24, 27.5, 34, 17, 0, true), C('half', 24, 29, 28, 14), C('half', 24, 30.5, 22, 11, 0, true),
    C('half', 24, 32, 16, 8), C('half', 24, 33.5, 10, 5, 0, true), C('circle', 24, 40.5, 6, 6)],
  // Mensa
  [C('circle', 25, 24, 26, 26), C('circle', 25, 24, 20, 20, 0, true), C('circle', 25, 24, 13, 13),
    C('capsule', 8, 29, 3, 22), C('rect', 8, 13, 7, 9), C('rect', 6.75, 11, 1, 6, 0, true), C('rect', 9.25, 11, 1, 6, 0, true),
    C('capsule', 41, 24, 4, 32)],
  // Erste Hilfe
  [C('rect', 24, 24, 36, 36), C('rect', 24, 24, 8, 24, 0, true), C('rect', 24, 24, 24, 8, 0, true)],
  // Ruhebereich
  [C('circle', 21, 27, 30, 30), C('circle', 29, 21, 25, 25, 0, true), C('circle', 37, 33, 3, 3), C('circle', 33, 40, 2, 2), C('tri', 38, 11, 5, 5)],
  // Freies Thema: Person
  [C('circle', 24, 9.5, 8, 8), C('capsule', 24, 23, 10, 16), C('capsule', 21.5, 35, 4.5, 15), C('capsule', 26.5, 35, 4.5, 15),
    C('capsule', 15.5, 22, 4, 13, 20), C('capsule', 32.5, 22, 4, 13, 340)]
];

function shapeInner(s) {
  const w = s.w, h = s.h;
  switch (s.type) {
    case 'circle': return `<ellipse cx="0" cy="0" rx="${w / 2}" ry="${h / 2}"/>`;
    case 'rect': return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}"/>`;
    case 'capsule': return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${Math.min(w, h) / 2}"/>`;
    case 'tri': return `<polygon points="0,${-h / 2} ${w / 2},${h / 2} ${-w / 2},${h / 2}"/>`;
    case 'half': return `<path d="M${-w / 2} ${h / 2}A${w / 2} ${h} 0 0 1 ${w / 2} ${h / 2}Z"/>`;
  }
  return '';
}
const shapeTf = (s) => `translate(${s.x} ${s.y}) rotate(${s.r})`;

/* Export: jede Form als einzelner Pfad mit absoluten Koordinaten.
   Rundungen als Bézierkurven, Drehung und Position eingerechnet – so bleiben
   sie in Figma, Illustrator, Affinity & Co. rund (kein rx, kein transform). */
const KAPPA = 0.5522847498;
function shapePath(s) {
  const a = (s.r * Math.PI) / 180, cos = Math.cos(a), sin = Math.sin(a);
  const P = (x, y) => { const X = s.x + x * cos - y * sin, Y = s.y + x * sin + y * cos; return `${+X.toFixed(3)} ${+Y.toFixed(3)}`; };
  const w = s.w / 2, h = s.h / 2;
  // Viertelellipse von (x0,y0) nach (x1,y1) um Mittelpunkt (cx,cy) mit Radien rx, ry
  const q = (cx, cy, rx, ry, from, to) => {
    const pt = (ang) => [cx + rx * Math.cos(ang), cy + ry * Math.sin(ang)];
    const d = (ang) => [-rx * Math.sin(ang), ry * Math.cos(ang)];
    const [x0, y0] = pt(from), [x1, y1] = pt(to), [dx0, dy0] = d(from), [dx1, dy1] = d(to);
    const k = KAPPA * Math.sign(to - from);
    return `C${P(x0 + dx0 * k, y0 + dy0 * k)} ${P(x1 - dx1 * k, y1 - dy1 * k)} ${P(x1, y1)}`;
  };
  const H = Math.PI / 2;
  switch (s.type) {
    case 'rect': return `M${P(-w, -h)}L${P(w, -h)}L${P(w, h)}L${P(-w, h)}Z`;
    case 'tri': return `M${P(0, -h)}L${P(w, h)}L${P(-w, h)}Z`;
    case 'circle': return `M${P(w, 0)}${q(0, 0, w, h, 0, H)}${q(0, 0, w, h, H, 2 * H)}${q(0, 0, w, h, 2 * H, 3 * H)}${q(0, 0, w, h, 3 * H, 4 * H)}Z`;
    case 'half': return `M${P(-w, h)}${q(0, h, w, 2 * h, 2 * H, 3 * H)}${q(0, h, w, 2 * h, 3 * H, 4 * H)}Z`;
    case 'capsule': {
      const r = Math.min(w, h);
      return `M${P(-w + r, -h)}L${P(w - r, -h)}${q(w - r, -h + r, r, r, 3 * H, 4 * H)}L${P(w, h - r)}${q(w - r, h - r, r, r, 0, H)}` +
        `L${P(-w + r, h)}${q(-w + r, h - r, r, r, H, 2 * H)}L${P(-w, -h + r)}${q(-w + r, -h + r, r, r, 2 * H, 3 * H)}Z`;
    }
  }
  return '';
}
function extent(s) {
  const a = (s.r * Math.PI) / 180, c = Math.abs(Math.cos(a)), n = Math.abs(Math.sin(a));
  return { ex: (s.w / 2) * c + (s.h / 2) * n, ey: (s.w / 2) * n + (s.h / 2) * c };
}

const PK_COLORS = [
  [null, 'Schwarz', '#161412'], ['#64378C', 'IWI-Lila', '#64378C'], ['#DE6A10', 'Orange', '#DE6A10'],
  ['#1E6FD9', 'Blau', '#1E6FD9'], ['#2E9E5B', 'Grün', '#2E9E5B'], ['#D7263D', 'Rot', '#D7263D'], ['#F2B705', 'Gelb', '#F2B705']
];
const shapeStyle = (s) => (s.c && !s.neg ? ` style="--c:${s.c}"` : '');

function initBaukasten() {
  const svg = $('#pk-svg');
  let shapes = store.get('pk-shapes', null);
  if (!Array.isArray(shapes)) shapes = EXAMPLES[0].map((s) => ({ ...s }));
  let counter = 0;
  shapes.forEach((s) => { s.id = 's' + (++counter); });
  let sel = null, drag = null;
  let brief = store.get('pk-brief', 0);

  // Raster
  let g = '';
  for (let i = 0; i <= 48; i++) g += `<line x1="${i}" y1="0" x2="${i}" y2="48"${i % 4 === 0 ? ' class="major"' : ''}/><line x1="0" y1="${i}" x2="48" y2="${i}"${i % 4 === 0 ? ' class="major"' : ''}/>`;
  $('#pk-grid').innerHTML = g;

  // Briefing
  $('#brief-select').innerHTML = BRIEFS.map(([n], i) => `<option value="${i}">${esc(n)}</option>`).join('');
  const setBrief = () => {
    $('#brief-select').value = brief;
    $('#brief-name').textContent = BRIEFS[brief][0];
    $('#brief-hint').textContent = BRIEFS[brief][1];
  };
  $('#brief-select').addEventListener('change', (e) => { brief = +e.target.value; store.set('pk-brief', brief); setBrief(); });
  setBrief();

  // Werkzeugleiste
  $('#pk-toolbar').innerHTML = Object.entries(SHAPES).map(([k, [label, ico]]) => `<button type="button" class="tool-btn" data-add="${k}"><svg viewBox="0 0 16 16" aria-hidden="true">${ico}</svg>${label}</button>`).join('');
  $('#pk-toolbar').addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    const t = b.dataset.add;
    const s = { id: 's' + (++counter), type: t, x: 24, y: 24, w: t === 'capsule' ? 16 : 12, h: t === 'capsule' ? 4 : 12, r: 0 };
    shapes.push(s); sel = s.id; commit();
  });

  const find = (id) => shapes.find((s) => s.id === id);
  const save = () => store.set('pk-shapes', shapes.map(({ id, ...rest }) => rest));

  const markup = () => shapes.map((s) => `<g class="pk-shape${s.neg ? ' neg' : ''}" data-id="${s.id}"${shapeStyle(s)} transform="${shapeTf(s)}">${shapeInner(s)}</g>`).join('');

  function render() {
    $('#pk-shapes').innerHTML = markup();
    const s = find(sel);
    $('#pk-selection').innerHTML = s ? `<g transform="${shapeTf(s)}"><rect class="pk-sel" x="${-s.w / 2 - .6}" y="${-s.h / 2 - .6}" width="${s.w + 1.2}" height="${s.h + 1.2}" rx=".6"/></g>` : '';
    $('#pk-props').hidden = !s;
    $('#pk-noprops').hidden = !!s;
    if (s) {
      $('#pk-w').value = s.w; $('#pk-w-o').textContent = s.w;
      $('#pk-h').value = s.h; $('#pk-h-o').textContent = s.h;
      $('#pk-r').value = s.r; $('#pk-r-o').textContent = s.r + '°';
      $('#pk-neg').checked = !!s.neg;
      const known = PK_COLORS.find(([v]) => v === (s.c || null));
      $('#pk-colors').querySelectorAll('[data-c]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.c === (s.c || ''))));
      const own = $('#pk-c-own'); own.value = s.c || '#161412';
      own.parentElement.setAttribute('aria-checked', String(!known));
      own.parentElement.style.setProperty('--own', known ? 'transparent' : s.c);
      $('#pk-colors').classList.toggle('disabled', !!s.neg);
      $('#pk-c-o').textContent = s.neg ? 'Aussparung' : known ? known[1] : s.c.toUpperCase();
    }
  }
  function renderPreviews() {
    const m = markup().replace(/ data-id="[^"]*"/g, '');
    const sizes = [[16, ''], [24, ''], [48, ''], [48, 'inv'], [96, '']];
    $('#pk-previews').innerHTML = sizes.map(([px, inv]) => `<div class="prev"><div class="box ${inv}"><svg viewBox="0 0 48 48" width="${px}" height="${px}" aria-hidden="true">${m}</svg></div><span>${px}${inv ? ' neg.' : ' px'}</span></div>`).join('');
  }
  function renderChecks() {
    const n = shapes.length;
    const out = shapes.filter((s) => { const { ex, ey } = extent(s); return s.x - ex < 3.95 || s.x + ex > 44.05 || s.y - ey < 3.95 || s.y + ey > 44.05; }).length;
    let minX = 48, minY = 48, maxX = 0, maxY = 0;
    shapes.forEach((s) => { const { ex, ey } = extent(s); minX = Math.min(minX, s.x - ex); maxX = Math.max(maxX, s.x + ex); minY = Math.min(minY, s.y - ey); maxY = Math.max(maxY, s.y + ey); });
    const span = n ? Math.max(maxX - minX, maxY - minY) : 0;
    const neg = shapes.some((s) => s.neg);
    const cols = new Set(shapes.filter((s) => !s.neg).map((s) => s.c || '#161412'));
    const items = [
      [n >= 2 && n <= 10 ? 'ok' : 'warn', n === 0 ? 'Noch keine Form auf der Fläche.' : n <= 10 ? `Aus ${n} Grundform${n === 1 ? '' : 'en'} gebaut. Gut reduziert.` : `${n} Formen. Lässt sich etwas weglassen?`],
      [n && !out ? 'ok' : 'warn', out ? `${out} Form${out === 1 ? ' ragt' : 'en ragen'} in den Schutzraum (gestrichelte Linie).` : 'Alles liegt innerhalb des Schutzraums.'],
      [span >= 26 ? 'ok' : 'warn', span >= 26 ? 'Das Zeichen nutzt die Fläche gut aus.' : 'Das Zeichen ist recht klein. Nutzen Sie die Fläche bis zur Keyline.'],
      [neg ? 'ok' : '', neg ? 'Aussparung genutzt: Figur und Grund arbeiten zusammen.' : 'Tipp: Eine Aussparung erzeugt Details ohne zusätzliche Form.'],
      ...(cols.size > 1 ? [[cols.size <= 3 ? 'ok' : 'warn', cols.size <= 3 ? `${cols.size} Farben: sparsam eingesetzt.` : `${cols.size} Farben. Piktogramme wirken mit ein bis zwei Farben meist klarer.`]] : []),
      ['', cols.size > 1 ? 'Selbstcheck: Funktioniert das Zeichen auch einfarbig? Die Negativ-Vorschau zeigt es ohne Farbe.' : 'Selbstcheck: Ist das Zeichen bei 16 px und negativ noch erkennbar?']
    ];
    $('#pk-checks').innerHTML = items.map(([st, t]) => `<li><span class="st ${st}">${st === 'ok' ? '✓' : st === 'warn' ? '!' : '·'}</span><span>${t}</span></li>`).join('');
  }
  function commit(full = true) { render(); if (full) { renderPreviews(); renderChecks(); } save(); }

  const pt = (e) => { const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM().inverse()); return p; };
  svg.addEventListener('pointerdown', (e) => {
    const g = e.target.closest('.pk-shape');
    if (!g) { sel = null; render(); return; }
    const s = find(g.dataset.id); sel = s.id;
    const p = pt(e);
    drag = { dx: p.x - s.x, dy: p.y - s.y, moved: false };
    svg.setPointerCapture(e.pointerId);
    svg.focus({ preventScroll: true });
    e.preventDefault();
    render();
  });
  svg.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const s = find(sel); if (!s) return;
    const p = pt(e);
    const nx = clamp(Math.round((p.x - drag.dx) * 2) / 2, 0, 48), ny = clamp(Math.round((p.y - drag.dy) * 2) / 2, 0, 48);
    if (nx !== s.x || ny !== s.y) { s.x = nx; s.y = ny; drag.moved = true; render(); }
  });
  const end = () => { if (drag && drag.moved) commit(); drag = null; };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);
  svg.addEventListener('keydown', (e) => {
    const s = find(sel); if (!s) return;
    const step = e.shiftKey ? 4 : 1;
    const mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (mv) { s.x = clamp(s.x + mv[0], 0, 48); s.y = clamp(s.y + mv[1], 0, 48); commit(); e.preventDefault(); }
    if (e.key === 'Delete' || e.key === 'Backspace') { shapes = shapes.filter((x) => x !== s); sel = null; commit(); e.preventDefault(); }
  });

  const bindRange = (id, key) => $(id).addEventListener('input', (e) => { const s = find(sel); if (!s) return; s[key] = +e.target.value; commit(); });
  bindRange('#pk-w', 'w'); bindRange('#pk-h', 'h'); bindRange('#pk-r', 'r');
  $('#pk-neg').addEventListener('change', (e) => { const s = find(sel); if (!s) return; s.neg = e.target.checked; commit(); });
  $('#pk-colors').innerHTML = PK_COLORS.map(([v, name, hex]) => `<button type="button" class="swatch" role="radio" data-c="${v || ''}" style="--sw:${hex}" title="${name}" aria-label="${name}"></button>`).join('')
    + '<label class="swatch swatch-own" role="radio" title="Eigene Farbe" aria-label="Eigene Farbe"><input type="color" id="pk-c-own" value="#161412"></label>';
  const setColor = (c) => { const s = find(sel); if (!s) return; s.c = c || undefined; if (!c) delete s.c; s.neg = false; commit(); };
  $('#pk-colors').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) setColor(b.dataset.c); });
  $('#pk-c-own').addEventListener('input', (e) => setColor(e.target.value));
  $('#pk-front').addEventListener('click', () => { const s = find(sel); if (!s) return; shapes = shapes.filter((x) => x !== s).concat(s); commit(); });
  $('#pk-back').addEventListener('click', () => { const s = find(sel); if (!s) return; shapes = [s].concat(shapes.filter((x) => x !== s)); commit(); });
  $('#pk-dup').addEventListener('click', () => { const s = find(sel); if (!s) return; const c = { ...s, id: 's' + (++counter), x: clamp(s.x + 2, 0, 48), y: clamp(s.y + 2, 0, 48) }; shapes.push(c); sel = c.id; commit(); });
  $('#pk-del').addEventListener('click', () => { shapes = shapes.filter((x) => x.id !== sel); sel = null; commit(); });
  $('#pk-guides').addEventListener('change', (e) => $('#pk-stage').classList.toggle('hide-guides', !e.target.checked));
  const loadExample = (i) => {
    shapes = EXAMPLES[i].map((s) => ({ ...s, id: 's' + (++counter) })); sel = null;
    brief = i; store.set('pk-brief', i); setBrief(); commit(); toast(`Beispiel „${BRIEFS[i][0]}“ geladen`);
  };
  $('#pk-example').addEventListener('click', () => loadExample(brief));
  $('#pk-gallery').innerHTML = EXAMPLES.map((ex, i) => `<button type="button" data-ex-i="${i}" aria-label="Beispiel ${esc(BRIEFS[i][0])} laden"><svg viewBox="0 0 48 48" aria-hidden="true">${ex.map((s) => `<g class="pk-shape${s.neg ? ' neg' : ''}" transform="${shapeTf(s)}">${shapeInner(s)}</g>`).join('')}</svg><span>${esc(BRIEFS[i][0])}</span></button>`).join('');
  $('#pk-gallery').addEventListener('click', (e) => { const b = e.target.closest('[data-ex-i]'); if (b) loadExample(+b.dataset.exI); });
  $('#pk-clear').addEventListener('click', () => { shapes = []; sel = null; commit(); });
  $('#pk-copy').addEventListener('click', async () => {
    const body = shapes.map((s) => `  <path d="${shapePath(s)}" fill="${s.neg ? '#ffffff' : (s.c || '#000000')}"/>`).join('\n');
    const code = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="480" height="480">\n  <title>${esc(BRIEFS[brief][0])}</title>\n${body}\n</svg>`;
    const fb = $('#pk-fallback');
    try { await navigator.clipboard.writeText(code); fb.hidden = true; toast('SVG-Code kopiert'); }
    catch (err) { fb.value = code; fb.hidden = false; fb.focus(); fb.select(); toast('Code markiert, bitte manuell kopieren'); }
  });
  commit();
}

/* ================================================================
   Übung 4 · Logoarten zuordnen
   ================================================================ */
const CATS = [
  ['wort', 'Wortmarke', 'nur Schrift'], ['buchstabe', 'Buchstabenmarke', 'Initialen'], ['bild', 'Bildmarke', 'gegenständliches Bild'],
  ['wortbild', 'Wort-Bild-Marke', 'Bild + Schrift'], ['emblem', 'Emblem', 'umschlossene Einheit'], ['abstrakt', 'Abstrakte Marke', 'freie Form']
];
function initSort() {
  const ids = Object.keys(LOGOS);
  let place = {}, picked = null, order = shuffle(ids), checked = false;
  const svgs = {}; ids.forEach((id) => { svgs[id] = LOGOS[id].svg(); });
  const chip = (id) => `<div class="logo-chip${picked === id ? ' picked' : ''}${checked ? (place[id] === LOGOS[id].cat ? ' ok' : ' bad') : ''}" draggable="true" data-logo-id="${id}" role="button" tabindex="0" aria-label="${esc(LOGOS[id].label)}">${svgs[id]}</div>`;
  const render = () => {
    $('#sort-pool').innerHTML = order.filter((id) => !place[id]).map(chip).join('') || '<p class="small muted" style="grid-column:1/-1;margin:0;align-self:center">Alle Logos sind zugeordnet. Prüfen Sie jetzt Ihr Ergebnis.</p>';
    $('#sort-buckets').innerHTML = CATS.map(([k, t, h]) => `<div class="bucket${picked ? ' armed' : ''}" data-cat="${k}" role="button" tabindex="0" aria-label="Kategorie ${t}"><h4>${t}</h4><span class="hint">${h}</span><div class="slots">${order.filter((id) => place[id] === k).map(chip).join('')}</div></div>`).join('');
  };
  const assign = (id, cat) => { checked = false; if (cat) place[id] = cat; else delete place[id]; picked = null; $('#sort-fb').innerHTML = ''; render(); };

  const area = $('#p-ue-logoarten');
  area.addEventListener('click', (e) => {
    const c = e.target.closest('.logo-chip');
    const b = e.target.closest('.bucket');
    if (c && c.closest('.bucket')) { assign(c.dataset.logoId, null); return; }
    if (c) { picked = picked === c.dataset.logoId ? null : c.dataset.logoId; render(); return; }
    if (b && picked) assign(picked, b.dataset.cat);
  });
  area.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target.matches('.logo-chip, .bucket')) { e.preventDefault(); e.target.click(); }
  });
  area.addEventListener('dragstart', (e) => { const c = e.target.closest('.logo-chip'); if (!c) return; e.dataTransfer.setData('text/plain', c.dataset.logoId); e.dataTransfer.effectAllowed = 'move'; });
  area.addEventListener('dragover', (e) => { const b = e.target.closest('.bucket, #sort-pool'); if (!b) return; e.preventDefault(); b.classList.add('over'); });
  area.addEventListener('dragleave', (e) => { const b = e.target.closest('.bucket, #sort-pool'); if (b) b.classList.remove('over'); });
  area.addEventListener('drop', (e) => {
    const b = e.target.closest('.bucket, #sort-pool'); if (!b) return;
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id && LOGOS[id]) assign(id, b.dataset.cat || null);
  });

  $('#sort-check').addEventListener('click', () => {
    const placed = ids.filter((id) => place[id]);
    if (placed.length < ids.length) { $('#sort-fb').innerHTML = `<div class="feedback info"><p>Noch ${ids.length - placed.length} Logo(s) ohne Kategorie.</p></div>`; return; }
    checked = true; render();
    const ok = ids.filter((id) => place[id] === LOGOS[id].cat).length;
    if (ok === ids.length) {
      $('#sort-fb').innerHTML = `<div class="feedback ok"><p><strong>Alle ${ok} richtig.</strong></p><p>Merken Sie sich: Das Emblem verbindet Schrift und Bild fest in einer Form. Bei der Wort-Bild-Marke stehen beide nebeneinander und sind trennbar.</p></div>`;
      markDone('ue-logoarten');
    } else {
      $('#sort-fb').innerHTML = `<div class="feedback bad"><p><strong>${ok} von ${ids.length} richtig.</strong> Rot markierte Logos können Sie anklicken und neu zuordnen.</p><p>Tipp: Prüfen Sie zuerst, ob Schrift vorkommt, dann, ob Bild und Schrift fest in einer Form verbunden sind.</p></div><button class="btn btn-sm" type="button" id="sort-solution" style="margin-top:10px">Lösung zeigen</button>`;
      $('#sort-solution').addEventListener('click', () => {
        ids.forEach((id) => { place[id] = LOGOS[id].cat; });
        checked = true; render();
        $('#sort-fb').innerHTML = `<div class="feedback info"><p><strong>Lösung angezeigt.</strong> Vergleichen Sie mit Ihrer Zuordnung und mischen Sie danach neu, um es selbst zu schaffen.</p></div>`;
      });
    }
  });
  $('#sort-reset').addEventListener('click', () => { place = {}; picked = null; checked = false; order = shuffle(ids); $('#sort-fb').innerHTML = ''; render(); });
  render();
}

/* ================================================================
   Übung 5 · Logo-Labor
   ================================================================ */
const FONTS = [
  ['Archivo', 'Archivo, sans-serif', '100%'], ['Archivo Expanded', 'Archivo, sans-serif', '125%'], ['Archivo Condensed', 'Archivo, sans-serif', '70%'],
  ['Source Serif', '"Source Serif 4", Georgia, serif', ''], ['DM Serif Display', '"DM Serif Display", Georgia, serif', ''],
  ['Bodoni Moda', '"Bodoni Moda", Didot, serif', ''], ['Syne', 'Syne, sans-serif', ''], ['Outfit', 'Outfit, sans-serif', ''], ['Space Mono', '"Space Mono", monospace', '']
];
const LAB_COLORS = ['#0d5c74', '#ff4f0f', '#161412', '#2c7a4b', '#6a3fb5', '#c8102e', '#d99a00'];
const LAB_SYMS = {
  halb: '<circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width="5"/><path d="M24 6a18 18 0 0 1 0 36z" fill="currentColor"/>',
  welle: '<path d="M4 17q5-7 10 0t10 0 10 0 10 0M4 31q5-7 10 0t10 0 10 0 10 0" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
  berg: '<path d="M2 41 18 13l9 15 5-8 14 21z" fill="currentColor"/>',
  hex: '<path fill="currentColor" fill-rule="evenodd" d="M24 3l18.2 10.5v21L24 45 5.8 34.5v-21zM24 14l9.5 5.5v11L24 36l-9.5-5.5v-11z"/>',
  funke: '<path d="M24 2l4.5 17.5L46 24l-17.5 4.5L24 46l-4.5-17.5L2 24l17.5-4.5z" fill="currentColor"/>',
  blatt: '<path d="M7 41C7 19 21 8 42 6c-1 21-13 35-35 35z" fill="currentColor"/>',
  mono: 'MONO',
  none: ''
};
const LAB_DEFAULT = { name: 'Hafenblick', sym: 'welle', font: 0, weight: 700, track: 0, cs: 'none', layout: 'h', color: '#0d5c74', zone: false };
const labSlots = store.get('lab-slots', null) || {
  A: Object.assign({}, LAB_DEFAULT, store.get('lab', {})),
  B: Object.assign({}, LAB_DEFAULT, { sym: 'mono', font: 4, weight: 400, track: 60, cs: 'upper', color: '#161412' })
};
let labCur = 'A';
let lab = labSlots.A;

function labSymbol(st, cls = 'sym') {
  if (st.sym === 'none') return '';
  if (st.sym === 'mono') {
    const id = nid(), f = FONTS[st.font] || FONTS[0];
    const letter = esc((st.name.trim()[0] || 'A').toUpperCase());
    return `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><defs><mask id="${id}"><rect width="48" height="48" fill="#fff"/><text x="24" y="33" text-anchor="middle" font-family='${f[1]}' font-weight="${st.weight}" font-size="26" fill="#000" style="font-stretch:${f[2] || '100%'}">${letter}</text></mask></defs><circle cx="24" cy="24" r="22" fill="currentColor" mask="url(#${id})"/></svg>`;
  }
  return `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true">${LAB_SYMS[st.sym]}</svg>`;
}
function labLogo(st, opt = {}) {
  const f = FONTS[st.font] || FONTS[0];
  const color = opt.color || st.color;
  const layout = opt.layout || st.layout;
  const wm = `<span class="wm" style="font-family:${f[1].replace(/"/g, "'")};font-weight:${st.weight};${f[2] ? `font-stretch:${f[2]};` : ''}letter-spacing:${st.track / 1000}em;text-transform:${st.cs === 'lower' ? 'lowercase' : st.cs === 'upper' ? 'uppercase' : 'none'}">${esc(st.name || 'Marke')}</span>`;
  return `<div class="lg ${layout === 'v' ? 'v' : ''}${opt.zone ? ' zone' : ''}" style="--c:${color};font-size:${opt.size || 40}px">${labSymbol(st)}${opt.symbolOnly ? '' : wm}</div>`;
}
function labIcon(st, color, size) {
  if (st.sym === 'none') {
    const f = FONTS[st.font] || FONTS[0];
    return `<span style="font-family:${f[1].replace(/"/g, "'")};font-weight:${st.weight};${f[2] ? `font-stretch:${f[2]};` : ''}color:${color};font-size:${size}px;line-height:1">${esc((st.name.trim()[0] || 'A').toUpperCase())}</span>`;
  }
  return `<span style="color:${color};display:block;width:${size}px;height:${size}px">${labSymbol(st, '').replace('<svg class=""', `<svg width="${size}" height="${size}"`)}</span>`;
}

function initLabor() {
  $('#lab-font').innerHTML = FONTS.map(([n], i) => `<option value="${i}">${n}</option>`).join('');
  $('#lab-sym').innerHTML = Object.keys(LAB_SYMS).map((k) => `<button type="button" data-sym="${k}" aria-label="${k === 'none' ? 'Kein Bildzeichen' : k === 'mono' ? 'Monogramm' : 'Symbol ' + k}">${k === 'none' ? '<span class="none">ohne</span>' : labSymbol({ ...lab, sym: k }, '')}</button>`).join('');
  $('#lab-colors').innerHTML = LAB_COLORS.map((c) => `<button type="button" class="sw" style="background:${c}" data-color="${c}" aria-label="Farbe ${c}"></button>`).join('') + `<input type="color" id="lab-custom" aria-label="Eigene Farbe">`;

  const sync = () => {
    $('#lab-name').value = lab.name;
    $('#lab-font').value = lab.font;
    $('#lab-weight').value = lab.weight; $('#lab-weight-o').textContent = lab.weight;
    $('#lab-track').value = lab.track; $('#lab-track-o').textContent = (lab.track / 1000).toFixed(2) + ' em';
    $('#lab-zone').checked = lab.zone;
    $('#lab-custom').value = lab.color;
    for (const b of $$('#lab-sym button')) b.setAttribute('aria-pressed', String(b.dataset.sym === lab.sym));
    for (const b of $$('#lab-colors .sw')) b.setAttribute('aria-pressed', String(b.dataset.color === lab.color));
    for (const b of $$('#lab-case button')) b.setAttribute('aria-pressed', String(b.dataset.v === lab.cs));
    for (const b of $$('#lab-layout button')) b.setAttribute('aria-pressed', String(b.dataset.v === lab.layout));
    for (const b of $$('#lab-slot button')) b.setAttribute('aria-pressed', String(b.dataset.v === labCur));
  };
  const draw = () => {
    // Monogramm-Vorschau im Auswahlfeld aktualisieren
    const mb = $('#lab-sym [data-sym="mono"]'); if (mb) mb.innerHTML = labSymbol({ ...lab, sym: 'mono' }, '');
    $('#lab-hero').innerHTML = labLogo(lab, { size: 52, zone: lab.zone });
    const n = esc(lab.name || 'Marke');
    const ctx = [
      ['Browser-Tab', '16 px', `<div class="tabbar"><div class="tab"><span class="fav">${labIcon(lab, lab.color, 16)}</span><span>${n}</span></div></div>`, '#f3f1ee'],
      ['Visitenkarte', '85 × 55 mm', `<div class="bcard">${labLogo(lab, { size: 13 })}<div class="who"><b>Kim Beispiel</b>Geschäftsführung · kim@beispiel.de</div></div>`, '#e2ddd7'],
      ['App-Icon', '64 px', `<div class="appicon" style="background:${lab.color}">${labIcon(lab, '#fff', 36)}</div>`, '#efece8'],
      ['Dunkler Grund', 'negativ', labLogo(lab, { size: 24, color: '#ffffff' }), '#161412'],
      ['Einfarbig', 'Stempel, Fax', labLogo(lab, { size: 24, color: '#000000' }), '#ffffff'],
      ['Mindestgröße', 'ca. 12 px Höhe', labLogo(lab, { size: 9 }), '#ffffff']
    ];
    $('#lab-ctx').innerHTML = ctx.map(([t, m, html, bg]) => `<div class="ctx"><div class="view" style="background:${bg}">${html}</div><div class="cap"><span>${t}</span><span>${m}</span></div></div>`).join('');
    $('#lab-compare').innerHTML = ['A', 'B'].map((k) => `<button type="button" class="cmp${k === labCur ? ' cur' : ''}" data-slot="${k}"><span class="label">Variante ${k}</span><span class="cmp-row"><span class="cmp-box" style="background:#fbfaf8">${labLogo(labSlots[k], { size: 18 })}</span><span class="cmp-box" style="background:#161412">${labLogo(labSlots[k], { size: 18, color: '#ffffff' })}</span></span></button>`).join('');
    fit();
    store.set('lab-slots', labSlots);
  };
  // Lange Namen verkleinern, damit sie in die Kontextvorschau passen
  const fit = () => {
    for (const v of $$('#lab-hero, #lab-ctx .view, #lab-compare .cmp-box')) {
      const lg = v.querySelector('.lg'); if (!lg || !v.clientWidth) continue;
      const box = lg.closest('.bcard') || v;
      const max = box.clientWidth - 40;
      if (lg.offsetWidth > max) lg.style.fontSize = (parseFloat(lg.style.fontSize) * max / lg.offsetWidth).toFixed(1) + 'px';
    }
  };
  pageHooks['ue-labor'] = draw;
  window.addEventListener('resize', () => { if ($('#p-ue-labor').classList.contains('active')) draw(); });
  if (document.fonts) document.fonts.ready.then(() => { if ($('#p-ue-labor').classList.contains('active')) draw(); });
  const upd = (patch) => { Object.assign(lab, patch); sync(); draw(); };
  const setSlot = (k) => { labCur = k; lab = labSlots[k]; sync(); draw(); };
  $('#lab-slot').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) setSlot(b.dataset.v); });
  $('#lab-compare').addEventListener('click', (e) => { const b = e.target.closest('[data-slot]'); if (b) setSlot(b.dataset.slot); });

  $('#lab-name').addEventListener('input', (e) => { lab.name = e.target.value; draw(); });
  $('#lab-font').addEventListener('change', (e) => upd({ font: +e.target.value }));
  $('#lab-weight').addEventListener('input', (e) => upd({ weight: +e.target.value }));
  $('#lab-track').addEventListener('input', (e) => upd({ track: +e.target.value }));
  $('#lab-zone').addEventListener('change', (e) => upd({ zone: e.target.checked }));
  $('#lab-custom').addEventListener('input', (e) => upd({ color: e.target.value }));
  $('#lab-sym').addEventListener('click', (e) => { const b = e.target.closest('[data-sym]'); if (b) upd({ sym: b.dataset.sym }); });
  $('#lab-colors').addEventListener('click', (e) => { const b = e.target.closest('[data-color]'); if (b) upd({ color: b.dataset.color }); });
  $('#lab-case').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) upd({ cs: b.dataset.v }); });
  $('#lab-layout').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) upd({ layout: b.dataset.v }); });
  sync(); draw();
}

/* ================================================================
   Übung 6 · Logo-Check
   ================================================================ */
const CRIT = [
  ['Einfachheit', 'Wenige, klare Formen, nichts Überflüssiges.'],
  ['Einprägsamkeit', 'Bleibt nach kurzem Blick im Gedächtnis und lässt sich aus dem Kopf skizzieren.'],
  ['Skalierbarkeit', 'Funktioniert vom 16-px-Favicon bis zum Plakat.'],
  ['Einfarbigkeit', 'Funktioniert schwarz-weiß, ohne Verlauf und Schatten.'],
  ['Eigenständigkeit', 'Unterscheidet sich klar vom Wettbewerb, ist nicht austauschbar.'],
  ['Zeitlosigkeit', 'Folgt keinem kurzlebigen Trend und trägt zehn Jahre und länger.']
];
const CHECK_LOGOS = {
  bohnen: { label: 'Bohnenglück', ref: [1, 2, 1, 1, 3, 2],
    why: ['Kreis, Bohnen, Dampf, Schriftzug und Unterzeile konkurrieren um Aufmerksamkeit.', 'Die Schreibschrift hat Charakter, das Bildzeichen bleibt diffus.', 'Unterzeile und Bohnendetails verschwinden unter 120 px Breite.', 'Lebt von Verlauf und Schlagschatten. Einfarbig bleibt ein dunkler Fleck.', 'Die Kaffeebohne ist das erwartbare Branchenmotiv; nur die Schrift hebt es etwas ab.', 'Verlauf plus Schatten wirkt wie Webdesign der frühen 2000er.'],
    svg: () => { const g = nid(), s = nid(); return `<svg viewBox="0 0 330 140" role="img" aria-label="Fiktives Logo Bohnenglück"><defs><radialGradient id="${g}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#f6c36a"/><stop offset=".55" stop-color="#b5541c"/><stop offset="1" stop-color="#4a1d0a"/></radialGradient><filter id="${s}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="2" dy="3" stdDeviation="2" flood-opacity=".45"/></filter></defs><g filter="url(#${s})"><circle cx="64" cy="70" r="54" fill="url(#${g})"/><ellipse cx="50" cy="74" rx="13" ry="19" transform="rotate(-25 50 74)" fill="#3b1607"/><path d="M45 58c8 12 2 22 0 30" stroke="#f6c36a" stroke-width="2" fill="none"/><ellipse cx="78" cy="80" rx="11" ry="16" transform="rotate(20 78 80)" fill="#5a240c"/><path d="M75 66c6 9 3 19 2 27" stroke="#f6c36a" stroke-width="1.6" fill="none"/><path d="M56 40c-5-6 5-9 0-17M70 42c-5-6 5-9 0-17" stroke="#fff6e0" stroke-width="2.4" fill="none" stroke-linecap="round"/><text x="128" y="74" font-family="'Brush Script MT','Segoe Script','Snell Roundhand',cursive" font-style="italic" font-size="44" fill="#7a2e0e">Bohnenglück</text></g><text x="130" y="100" font-family="Georgia, serif" font-size="9.5" fill="#9a6a4a">Kaffeerösterei &amp; Konditorei · handgemacht · seit 2019</text><path d="M300 30l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#f0b43a"/></svg>`; } },
  lumen: { label: 'lumen', ref: [5, 4, 5, 5, 4, 4],
    why: ['Ein Kreis, eine Halbfläche, ein Schriftzug. Mehr braucht es nicht.', 'Das Hell-Dunkel-Motiv passt zum Namen und bleibt dadurch hängen.', 'Das Bildzeichen allein funktioniert auch als Favicon.', 'Ist bereits einfarbig angelegt.', 'Halbkreis-Motive sind verbreitet; die Verbindung zum Namen macht es eigenständig.', 'Geometrische Grundformen und eine sachliche Grotesk altern langsam.'],
    svg: () => LOGOS.lumen.svg() },
  tech: { label: 'TechSolutions', ref: [3, 1, 3, 3, 1, 2],
    why: ['Formal nicht überladen, aber Globus, Swoosh und Unterzeile sind drei Botschaften.', 'Globus mit Swoosh findet sich bei unzähligen Firmen; nichts bleibt hängen.', 'Die Meridianlinien laufen in kleinen Größen zu.', 'Funktioniert einfarbig, wirkt ohne Farbe aber noch beliebiger.', 'Name und Zeichen sind austauschbar und sagen nichts Eigenes.', 'Kursive Schrift plus Swoosh ist typisch für die Jahrtausendwende.'],
    svg: () => `<svg viewBox="0 0 330 110" role="img" aria-label="Fiktives Logo TechSolutions"><g fill="none" stroke="#1d57a8" stroke-width="3"><circle cx="52" cy="55" r="34"/><ellipse cx="52" cy="55" rx="14" ry="34"/><path d="M18 55h68M24 38h56M24 72h56"/></g><path d="M6 80c34 22 86 2 100-50-8 40-54 62-100 50z" fill="#3aa0e8"/><text x="114" y="62" font-family="Arial, Helvetica, sans-serif" font-style="italic" font-weight="700" font-size="30" fill="#1d57a8">TechSolutions</text><text x="116" y="82" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#5a6b80">Innovative Lösungen für morgen</text></svg>` },
  mein: { label: 'Mein Logo', ref: null }
};

function initCheck() {
  let cur = 'lumen';
  const ratings = store.get('chk', {});
  const revealed = new Set(store.get('chk-rev', []));
  const svgs = {}; Object.keys(CHECK_LOGOS).forEach((k) => { if (k !== 'mein') svgs[k] = CHECK_LOGOS[k].svg(); });

  const pick = () => {
    $('#chk-pick').innerHTML = Object.entries(CHECK_LOGOS).map(([k, L]) => `<button type="button" class="artboard" data-k="${k}" aria-pressed="${k === cur}" aria-label="${esc(L.label)}">${k === 'mein' ? '<span>Mein Logo<br><span class="muted" style="font-weight:500">aus Übung 5</span></span>' : svgs[k]}</button>`).join('');
  };
  const radar = () => {
    const cx = 235, cy = 160, R = 112, n = CRIT.length;
    const P = (i, v) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [cx + Math.cos(a) * R * v / 5, cy + Math.sin(a) * R * v / 5]; };
    const poly = (vals) => vals.map((v, i) => P(i, v).map((x) => x.toFixed(1)).join(',')).join(' ');
    const me = ratings[cur] || CRIT.map(() => 3);
    let s = '';
    for (let r = 1; r <= 5; r++) s += `<polygon class="ring" points="${poly(CRIT.map(() => r))}"/>`;
    CRIT.forEach((c, i) => {
      const [x, y] = P(i, 5); s += `<line class="axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`;
      const [lx, ly] = P(i, 6.1);
      s += `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="${Math.abs(lx - cx) < 4 ? 'middle' : lx > cx ? 'start' : 'end'}">${c[0]}</text>`;
    });
    const ref = CHECK_LOGOS[cur].ref;
    if (ref && revealed.has(cur)) s += `<polygon class="ref" points="${poly(ref)}"/>`;
    s += `<polygon class="me" points="${poly(me)}"/>`;
    $('#chk-radar').innerHTML = s;
    $('#chk-leg-ref').hidden = !(ref && revealed.has(cur));
  };
  const crit = () => {
    const me = ratings[cur] || CRIT.map(() => 3);
    const L = CHECK_LOGOS[cur], show = L.ref && revealed.has(cur);
    $('#chk-crit').innerHTML = CRIT.map(([t, d], i) => `<div class="crit"><div class="top"><label for="chk-${i}">${t}</label><span>${me[i]} / 5${show ? ` · Ref. ${L.ref[i]}` : ''}</span></div><input type="range" id="chk-${i}" min="1" max="5" step="1" value="${me[i]}" data-i="${i}"><p>${d}</p>${show ? `<p class="expert">${esc(L.why[i])}</p>` : ''}</div>`).join('');
    $('#chk-reveal').textContent = L.ref ? (show ? 'Referenz ausblenden' : 'Referenz aufdecken') : 'Hinweis anzeigen';
  };
  const view = () => {
    if (cur === 'mein') $('#chk-view').innerHTML = labLogo(lab, { size: 34 });
    else $('#chk-view').innerHTML = svgs[cur];
  };
  const fb = () => {
    const L = CHECK_LOGOS[cur];
    if (!L.ref || !revealed.has(cur)) { $('#chk-fb').innerHTML = ''; return; }
    const me = ratings[cur] || CRIT.map(() => 3);
    const diff = me.reduce((a, v, i) => a + Math.abs(v - L.ref[i]), 0);
    $('#chk-fb').innerHTML = `<div class="feedback ${diff <= 6 ? 'ok' : 'info'}"><p><strong>Abweichung insgesamt: ${diff} Punkte.</strong></p><p>${diff <= 6 ? 'Ihr Urteil liegt nah an der Referenz.' : 'Ihr Urteil weicht deutlich ab. Lesen Sie die Begründungen unter den Kriterien. Abweichungen sind erlaubt, wenn Sie sie begründen können.'}</p></div>`;
  };
  const all = () => { pick(); view(); crit(); radar(); fb(); };

  $('#chk-pick').addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (!b) return; cur = b.dataset.k; all(); });
  $('#chk-crit').addEventListener('input', (e) => {
    const i = e.target.dataset.i; if (i === undefined) return;
    const me = ratings[cur] || CRIT.map(() => 3);
    me[+i] = +e.target.value; ratings[cur] = me; store.set('chk', ratings);
    e.target.closest('.crit').querySelector('.top span').textContent = `${me[i]} / 5${CHECK_LOGOS[cur].ref && revealed.has(cur) ? ` · Ref. ${CHECK_LOGOS[cur].ref[i]}` : ''}`;
    radar(); fb();
  });
  $('#chk-reveal').addEventListener('click', () => {
    const L = CHECK_LOGOS[cur];
    if (!L.ref) { $('#chk-fb').innerHTML = `<div class="feedback info"><p><strong>Für Ihr eigenes Logo gibt es keine Referenz.</strong></p><p>Bitten Sie eine zweite Person, Ihr Logo unabhängig zu bewerten, und vergleichen Sie beide Netze. Wo liegen Sie am weitesten auseinander?</p></div>`; return; }
    if (revealed.has(cur)) revealed.delete(cur); else revealed.add(cur);
    store.set('chk-rev', [...revealed]);
    all();
    if (['bohnen', 'lumen', 'tech'].filter((k) => revealed.has(k)).length >= 2) markDone('ue-check');
  });
  pageHooks['ue-check'] = () => { if (cur === 'mein') view(); };
  all();
}

/* ================================================================
   Kapitel 09 · Animierte Logos und Icons
   ================================================================ */
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ANIM_LOGOS = {
  lumen: `<svg viewBox="0 0 250 90" role="img" aria-label="lumen"><circle class="a-ring" cx="45" cy="45" r="28" fill="none" stroke="currentColor" stroke-width="7" stroke-dasharray="176" transform="rotate(-90 45 45)"/><path class="a-half" d="M45 17a28 28 0 0 1 0 56z" fill="currentColor"/><text class="a-text" x="90" y="58" font-family="Archivo, sans-serif" font-weight="600" font-size="38" letter-spacing="1" fill="currentColor">lumen</text></svg>`,
  fahrwerk: () => fahrwerk(1).replace('<svg', '<svg class="a-fw"'),
  prisma: `<svg viewBox="0 0 100 100" role="img" aria-label="Prisma"><path class="a-p1" d="M14 82 40 18h16L30 82z" fill="currentColor"/><path class="a-p2" d="M44 82 70 18h16L60 82z" fill="${ACC}"/></svg>`
};
function initAnimation() {
  let logo = 'lumen';
  const stage = $('#anim-stage');
  const durIn = $('#anim-dur');
  const v = $('#anim-video');
  pageHooks['animation'] = () => { if (v && !reduceMotion) v.play().catch(() => {}); };
  window.addEventListener('hashchange', () => { if (v && location.hash !== '#animation') v.pause(); });
  if (reduceMotion) $('#anim-note').textContent = 'Ihr System wünscht reduzierte Bewegung. Animationen laufen nur, wenn Sie sie selbst starten.';

  const draw = () => {
    const m = ANIM_LOGOS[logo];
    stage.innerHTML = typeof m === 'function' ? m() : m;
  };
  const play = () => {
    draw();
    const d = +durIn.value, easing = $('#anim-ease').value;
    const go = (el, kf, from, to) => el && el.animate(kf, { duration: d * (to - from), delay: d * from, easing, fill: 'both' });
    const svg = stage.querySelector('svg');
    if (logo === 'lumen') {
      go($('.a-ring', svg), [{ strokeDashoffset: 176 }, { strokeDashoffset: 0 }], 0, .5);
      const half = $('.a-half', svg); half.style.transformBox = 'fill-box'; half.style.transformOrigin = 'left center';
      go(half, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], .35, .7);
      go($('.a-text', svg), [{ opacity: 0, transform: 'translateX(-14px)' }, { opacity: 1, transform: 'none' }], .55, 1);
    } else if (logo === 'fahrwerk') {
      const parts = [...svg.children];
      const wheel = parts.filter((el) => el.tagName !== 'text');
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      wheel.forEach((el) => g.appendChild(el));
      svg.insertBefore(g, svg.firstChild);
      g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
      go(g, [{ transform: 'translateX(180px) rotate(360deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], 0, .65);
      go($('text', svg), [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], .5, 1);
    } else {
      go($('.a-p1', svg), [{ opacity: 0, transform: 'translateY(-50px)' }, { opacity: 1, transform: 'none' }], 0, .6);
      go($('.a-p2', svg), [{ opacity: 0, transform: 'translateY(50px)' }, { opacity: 1, transform: 'none' }], .2, .8);
    }
  };
  for (const b of $$('#anim-logo button')) b.addEventListener('click', () => {
    logo = b.dataset.v;
    for (const x of $$('#anim-logo button')) x.setAttribute('aria-pressed', String(x === b));
    play();
  });
  durIn.addEventListener('input', () => { $('#anim-dur-o').textContent = durIn.value + ' ms'; });
  $('#anim-ease').addEventListener('change', play);
  $('#anim-play').addEventListener('click', play);
  draw();

  // Icon-Mikrointeraktionen
  const ICON_DEMOS = [
    { id: 'menu', t: 'Menü ↔ Schließen', d: '300 ms · Morphing', svg: '<path class="l1" d="M4 7h16"/><path class="l2" d="M4 12h16"/><path class="l3" d="M4 17h16"/>' },
    { id: 'heart', t: 'Gefällt mir', d: '250 ms · Federnd', svg: '<path class="hrt" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>' },
    { id: 'check', t: 'Gespeichert', d: '400 ms · Linie zeichnen', svg: '<circle cx="12" cy="12" r="9"/><path class="chk" d="M7.5 12.5l3 3 6-6.5" stroke-dasharray="14" stroke-dashoffset="14"/>' },
    { id: 'bell', t: 'Benachrichtigung', d: '600 ms · Schwingen', svg: '<g class="bel"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></g>' },
    { id: 'load', t: 'Laden', d: '900 ms · Schleife', svg: '<circle cx="12" cy="12" r="8" opacity=".2"/><path class="spn" d="M12 4a8 8 0 0 1 8 8"/>' },
    { id: 'down', t: 'Herunterladen', d: '500 ms · Folge', svg: '<path class="arw" d="M12 4v10M8 10l4 4 4-4"/><path d="M5 19h14"/>' }
  ];
  $('#icon-grid').innerHTML = ICON_DEMOS.map((i) => `<button type="button" class="icon-demo" data-icon="${i.id}" aria-label="${i.t} animieren"><svg viewBox="0 0 24 24" aria-hidden="true">${i.svg}</svg><b>${i.t}</b><span>${i.d}</span></button>`).join('');
  const spinners = new WeakMap();
  $('#icon-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.icon-demo'); if (!b) return;
    const s = b.querySelector('svg');
    const fb = (el, kf, o) => { el.style.transformBox = 'fill-box'; el.style.transformOrigin = o.origin || 'center'; return el.animate(kf, o); };
    switch (b.dataset.icon) {
      case 'menu': b.classList.toggle('open'); break;
      case 'heart': {
        const on = b.classList.toggle('on');
        if (on) fb($('.hrt', s), [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 250, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        break;
      }
      case 'check': $('.chk', s).animate([{ strokeDashoffset: 14 }, { strokeDashoffset: 0 }], { duration: 400, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }); break;
      case 'bell': fb($('.bel', s), [0, 14, -12, 8, -5, 2, 0].map((r) => ({ transform: `rotate(${r}deg)` })), { duration: 600, easing: 'ease-out', origin: 'top center' }); break;
      case 'load': {
        const running = spinners.get(b);
        if (running) { running.cancel(); spinners.delete(b); }
        else spinners.set(b, fb($('.spn', s), [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 900, iterations: Infinity, origin: '0px 8px' }));
        break;
      }
      case 'down': fb($('.arw', s), [{ transform: 'translateY(-6px)', opacity: 0 }, { transform: 'none', opacity: 1, offset: .6 }, { transform: 'translateY(1px)' }, { transform: 'none' }], { duration: 500, easing: 'ease-out' }); break;
    }
  });
}


function initKI() {
  const out = $('#pr-out');
  const build = () => {
    const rules = $$('#pr-rules input:checked').map((i) => i.value);
    out.value = `Logo-Entwurf als ${$('#pr-type').value} für ${$('#pr-brand').value.trim()}. Motiv: ${$('#pr-motif').value.trim()}. Stil: ${$('#pr-style').value}.` + (rules.length ? ` ${rules.join(', ')}.` : '') + ' Zentriert, viel Weißraum.';
  };
  $('#p-ki').addEventListener('input', build);
  $('#p-ki').addEventListener('change', build);
  $('#pr-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(out.value); toast('Prompt kopiert'); }
    catch (e) { out.focus(); out.select(); toast('Prompt markiert, bitte manuell kopieren'); }
  });
  build();
}

/* ================================================================
   Wissenstest
   ================================================================ */
const QUIZ = [
  ['Welche Logoart besteht ausschließlich aus Schrift?', ['Bildmarke', 'Wortmarke', 'Emblem', 'Abstrakte Marke'], 1, 'Die Wortmarke wirkt allein über Schrift, Laufweite und typografische Details.'],
  ['Was bezeichnet Peirce als „Symbol“?', ['Ein Zeichen, das dem Gemeinten ähnelt', 'Ein Zeichen, das eine Spur hinterlässt', 'Ein Zeichen, dessen Bedeutung auf Konvention beruht', 'Jedes Logo'], 2, 'Symbole muss man lernen, etwa das €-Zeichen oder das „i“ für Information.'],
  ['Wer gestaltete die Piktogramme der Olympischen Spiele 1972 in München?', ['Otl Aicher', 'Paul Rand', 'Adrian Frutiger', 'Peter Behrens'], 0, 'Aichers Team entwickelte die Piktogramme auf einem Raster aus Orthogonalen und Diagonalen.'],
  ['Welches Prinzip gilt bei Isotype?', ['Größere Mengen durch größere Zeichen', 'Größere Mengen durch mehr gleiche Zeichen', 'Mengen durch Farbintensität', 'Mengen nur als Zahl'], 1, 'Otto Neurath: Gleich große Zeichen werden wiederholt. So bleibt der Vergleich ehrlich.'],
  ['Warum zeichnet man einen Kreis etwas größer als ein gleich hohes Quadrat?', ['Damit er sich besser druckt', 'Weil er sonst optisch kleiner wirkt', 'Wegen der Norm ISO 7010', 'Um Platz zu sparen'], 1, 'Der Kreis hat weniger Fläche und wirkt daher kleiner. Der Overshoot gleicht das aus.'],
  ['Was ist die Schutzzone eines Logos?', ['Der rechtlich geschützte Teil des Logos', 'Ein Freiraum um das Logo, der frei von anderen Elementen bleibt', 'Die Fläche hinter dem Logo', 'Der Bereich für den Claim'], 1, 'Die Schutzzone wird meist relativ zu einem Logoelement definiert, z. B. der Höhe des Bildzeichens.'],
  ['Was beschreibt ein „Responsive Logo“?', ['Ein animiertes Logo', 'Ein Logo mit mehreren Komplexitätsstufen für verschiedene Größen', 'Ein Logo, das per Klick reagiert', 'Ein Logo in Pixelgrafik'], 1, 'Von der Vollversion mit Claim bis zum reinen Bildzeichen für das Favicon.'],
  ['Welche Farbe haben Gebotszeichen nach ISO 7010?', ['Rot', 'Gelb', 'Grün', 'Blau'], 3, 'Blau = Gebot, Rot = Verbot, Gelb = Warnung, Grün = Rettung.'],
  ['Welches Format eignet sich am besten für ein Logo im Web?', ['JPG', 'GIF', 'SVG', 'TIFF'], 2, 'SVG ist ein Vektorformat: verlustfrei skalierbar, klein und per CSS anpassbar.'],
  ['Ein Logo zeigt im Zwischenraum zweier Buchstaben einen Pfeil. Welches Gestaltgesetz wirkt hier?', ['Nähe', 'Figur und Grund', 'Kontinuität', 'Ähnlichkeit'], 1, 'Der Negativraum wird zur eigenen Figur, bekanntes Beispiel ist das FedEx-Logo.'],
  ['Womit beginnt ein professioneller Logo-Gestaltungsprozess?', ['Mit der Schriftwahl', 'Mit dem Briefing', 'Mit der Reinzeichnung', 'Mit dem Styleguide'], 1, 'Ohne Verständnis von Absender, Zielgruppe und Wettbewerb fehlen Kriterien für jeden Entwurf.'],
  ['Wie sollte ein animiertes Logo auf die Systemeinstellung „Bewegung reduzieren“ reagieren?', ['Gar nicht, die Animation gehört zur Marke', 'Langsamer abspielen', 'Das statische Logo zeigen', 'Nur den Ton abspielen'], 2, 'Per prefers-reduced-motion erkennt die Seite den Wunsch und zeigt das ruhende Endbild. Darum muss das statische Logo allein funktionieren.'],
  ['Wie setzt man KI in der Logogestaltung am sinnvollsten ein?', ['Das erste Ergebnis direkt als Logo verwenden', 'Als Ideen- und Moodboard-Werkzeug, die Reinzeichnung erfolgt von Hand', 'Nur für die Schrift im Logo', 'Gar nicht, KI ist verboten'], 1, 'KI liefert schnell Anregungen. Konstruktion, Vektor, Markenrecherche und Begründung bleiben Aufgabe der Gestaltenden.'],
  ['Was unterscheidet ein Emblem von einer Wort-Bild-Marke?', ['Das Emblem ist immer rund', 'Beim Emblem sind Schrift und Bild fest in einer umschließenden Form verbunden', 'Das Emblem hat keine Schrift', 'Es gibt keinen Unterschied'], 1, 'Bei der Wort-Bild-Marke lassen sich Bildzeichen und Schriftzug trennen, beim Emblem nicht.']
];
function initQuiz() {
  const root = $('#quiz');
  let i = 0, score = 0, answers = [];
  const render = () => {
    if (i >= QUIZ.length) {
      const pct = Math.round((score / QUIZ.length) * 100);
      const best = store.get('quiz-best', 0);
      if (score > best) store.set('quiz-best', score);
      root.innerHTML = `<div class="quiz-result"><div class="label">Ihr Ergebnis</div><div class="big">${score}<small> / ${QUIZ.length}</small></div><p style="margin:12px auto;max-width:46ch">${pct >= 80 ? 'Sehr gut. Sie beherrschen die Grundlagen der Logo- und Piktogrammgestaltung.' : pct >= 50 ? 'Solide Basis. Sehen Sie sich die Erklärungen zu den falschen Antworten noch einmal an.' : 'Lesen Sie die Kapitel 02 bis 10 noch einmal und versuchen Sie es dann erneut.'}</p><div class="dots" style="justify-content:center">${answers.map((r) => `<span class="${r ? 'ok' : 'bad'}"></span>`).join('')}</div><p class="small muted">Bestes Ergebnis bisher: ${Math.max(best, score)} / ${QUIZ.length}</p><button class="btn btn-dark" type="button" id="quiz-restart">Test wiederholen</button></div>`;
      $('#quiz-restart').addEventListener('click', () => { i = 0; score = 0; answers = []; render(); });
      return;
    }
    const [q, opts, a, ex] = QUIZ[i];
    root.innerHTML = `<div class="pq-count">Frage ${i + 1} von ${QUIZ.length}</div><div class="quiz-q">${esc(q)}</div><div class="options">${shuffle(opts.map((_, k) => k)).map((k, n) => `<button type="button" class="opt" data-k="${k}"><span class="k">${'ABCD'[n]}</span>${esc(opts[k])}</button>`).join('')}</div><div id="quiz-fb"></div><div class="dots">${QUIZ.map((_, k) => `<span class="${k < answers.length ? (answers[k] ? 'ok' : 'bad') : k === i ? 'cur' : ''}"></span>`).join('')}</div>`;
    for (const b of $$('.opt', root)) b.addEventListener('click', () => {
      const k = +b.dataset.k, right = k === a;
      if (right) score++;
      answers.push(right);
      for (const x of $$('.opt', root)) { x.disabled = true; if (+x.dataset.k === a) x.classList.add('right'); }
      if (!right) b.classList.add('wrong');
      $('#quiz-fb').innerHTML = `<div class="feedback ${right ? 'ok' : 'bad'}"><p><strong>${right ? 'Richtig.' : 'Leider falsch.'}</strong></p><p>${esc(ex)}</p></div><button class="btn btn-dark" type="button" id="quiz-next" style="margin-top:14px">${i + 1 < QUIZ.length ? 'Nächste Frage' : 'Ergebnis anzeigen'}</button>`;
      $('#quiz-next').addEventListener('click', () => { i++; render(); });
      $('#quiz-next').focus();
    });
  };
  render();
}

/* ================================================================
   Literatur
   ================================================================ */
const LIT = [
  ['1936', 'International Picture Language', 'Otto Neurath', 'London: Kegan Paul', 'Grundlegende Darstellung der Bildstatistik Isotype und ihrer Regeln.'],
  ['1954', 'Art and Visual Perception', 'Rudolf Arnheim', 'University of California Press · dt. „Kunst und Sehen“, 1965', 'Wahrnehmungspsychologie für Gestaltende, Grundlage für das Verständnis der Gestaltgesetze.'],
  ['1972', 'Symbol Sourcebook', 'Henry Dreyfuss', 'New York: McGraw-Hill', 'Umfangreiches Nachschlagewerk internationaler grafischer Symbole.'],
  ['1977', 'Zeichensysteme der visuellen Kommunikation', 'Otl Aicher, Martin Krampen', 'Stuttgart: Koch', 'Standardwerk zu Piktogrammen und Leitsystemen, mit Hintergründen zu München 1972.'],
  ['1978', 'Der Mensch und seine Zeichen', 'Adrian Frutiger', 'Echzell: Horst Heiderhoff · Neuausgabe Wiesbaden: Marix, 2004', 'Vom Punkt zur Schrift: wie Zeichen entstehen und wirken.'],
  ['1983', 'Phänomen und Logik der Zeichen', 'Charles S. Peirce', 'hg. v. Helmut Pape · Frankfurt a. M.: Suhrkamp', 'Peirce’ Zeichentheorie mit der Unterscheidung von Ikon, Index und Symbol.'],
  ['1985', 'A Designer’s Art', 'Paul Rand', 'New Haven: Yale University Press', 'Essays und Arbeiten eines der einflussreichsten Logogestalter.'],
  ['2007', 'Logo', 'Michael Evamy', 'London: Laurence King', 'Über 1.300 Logos, geordnet nach Formen und Motiven. Ideal für die Recherche.'],
  ['2008', 'Graphic Design: The New Basics', 'Ellen Lupton, Jennifer Cole Phillips', 'New York: Princeton Architectural Press', 'Gestalterische Grundbegriffe wie Punkt, Linie, Fläche, Figur und Grund.'],
  ['2009', 'Logo Design Love', 'David Airey', 'Berkeley: New Riders', 'Praxisnaher Leitfaden durch den Gestaltungsprozess mit vielen Fallbeispielen.'],
  ['2017', 'Designing Brand Identity', 'Alina Wheeler', '5. Aufl. · Hoboken: Wiley', 'Umfassendes Handbuch zu Markenidentität, Prozess und Styleguides.'],
  ['Norm', 'DIN EN ISO 7010 · ISO 7001 · ISO 9186', 'ISO / DIN', 'jeweils aktuelle Fassung', 'Sicherheitszeichen, öffentliche Informationszeichen und Testverfahren zur Verständlichkeit grafischer Symbole.']
];
function initLit() {
  $('#lit').innerHTML = LIT.map(([y, t, by, pub, d]) => `<div class="lit-item"><span class="yr">${y}</span><div><h3>${esc(t)}</h3><div class="by">${esc(by)} · ${esc(pub)}</div><p>${esc(d)}</p></div></div>`).join('');
}

/* ================================================================
   Stichwortverzeichnis
   ================================================================ */
const GL = [
  ['Abstrakte Marke', 'Logoarten', 'Logo aus einer geometrischen oder freien Form ohne gegenständliches Vorbild. Die Bedeutung wird vollständig zugeschrieben.', 'logoarten'],
  ['Abstraktion', 'Grundlagen', 'Vereinfachung eines Motivs auf wenige Merkmale. Je höher der Abstraktionsgrad, desto geringer die Ähnlichkeit mit dem Vorbild.', 'ue-abstraktion'],
  ['Aussparung', 'Form', 'Bewusst freigelassene Fläche in einer Form, die als eigene Figur gelesen wird (Negativform).', 'gestaltung'],
  ['Bildmarke', 'Logoarten', 'Logo aus einem gegenständlichen Bildzeichen ohne Schrift.', 'logoarten'],
  ['Briefing', 'Prozess', 'Schriftliche Aufgabenbeschreibung mit Zielen, Zielgruppe, Werten und Rahmenbedingungen. Erster Schritt im Gestaltungsprozess.', 'prozess'],
  ['Buchstabenmarke', 'Logoarten', 'Logo aus Initialen oder einem einzelnen Buchstaben.', 'logoarten'],
  ['Claim', 'Anwendung', 'Kurzer Slogan, der dem Logo beigestellt wird. Er ist austauschbar, das Logo bleibt.', 'logoarten'],
  ['CMYK', 'Farbe', 'Farbmodell des Vierfarbdrucks aus Cyan, Magenta, Gelb (Yellow) und Schwarz (Key).', 'anwendung'],
  ['Corporate Design', 'Grundlagen', 'Visuelles Erscheinungsbild einer Organisation: Logo, Farben, Schriften, Bildsprache und Raster.', 'grundlagen'],
  ['Corporate Identity', 'Grundlagen', 'Selbstverständnis einer Organisation, das sich in Verhalten, Kommunikation und Erscheinungsbild zeigt.', 'grundlagen'],
  ['Easing', 'Animation', 'Verlauf der Geschwindigkeit einer Bewegung, z. B. sanftes Abbremsen (ease-out) statt gleichförmiger Bewegung.', 'animation'],
  ['Emblem', 'Logoarten', 'Logo, in dem Schrift und Bild fest in einer umschließenden Form verbunden sind, etwa als Siegel oder Wappen.', 'logoarten'],
  ['Favicon', 'Anwendung', 'Kleines Symbol im Browser-Tab, meist 16 × 16 oder 32 × 32 Pixel.', 'ue-labor'],
  ['Figur und Grund', 'Form', 'Gestaltgesetz: Die Wahrnehmung trennt eine Figur vom Hintergrund. Mehrdeutige Beziehungen erzeugen Doppelbilder.', 'gestaltung'],
  ['Gestaltgesetze', 'Form', 'Regeln der Wahrnehmungspsychologie, nach denen wir Elemente zu Gruppen und Formen ordnen, z. B. Prägnanz, Nähe, Ähnlichkeit.', 'gestaltung'],
  ['Goldener Schnitt', 'Form', 'Teilungsverhältnis von etwa 1 : 1,618. Ein mögliches, aber kein zwingendes Proportionssystem.', 'gestaltung'],
  ['Icon', 'Zeichen', 'Piktogramm in digitalen Oberflächen, das für eine Funktion oder einen Inhalt steht.', 'grundlagen'],
  ['Ikon', 'Zeichen', 'Zeichentyp nach Peirce, der auf Ähnlichkeit mit dem Gemeinten beruht.', 'grundlagen'],
  ['Index', 'Zeichen', 'Zeichentyp nach Peirce, der in einem Folge- oder Ursachenzusammenhang zum Gemeinten steht, etwa Rauch für Feuer.', 'grundlagen'],
  ['Isotype', 'Zeichen', 'International System of Typographic Picture Education. Bildstatistik von Otto Neurath, Marie Reidemeister und Gerd Arntz.', 'piktogramme'],
  ['KI-Bildgenerator', 'KI', 'Software, die aus einer Textbeschreibung (Prompt) Bilder erzeugt. Liefert Pixelbilder, keine konstruierten Vektoren.', 'ki'],
  ['Kerning', 'Typografie', 'Ausgleich des Abstands zwischen zwei bestimmten Buchstaben, z. B. bei „AV“ oder „To“.', 'gestaltung'],
  ['Keyline', 'Form', 'Hilfsform im Konstruktionsraster, die Größe und Lage der Grundformen vorgibt.', 'piktogramme'],
  ['Konstruktionsraster', 'Form', 'Gitter, auf dem Piktogramme oder Bildmarken aufgebaut werden, damit Maße und Winkel systematisch bleiben.', 'piktogramme'],
  ['Laufweite', 'Typografie', 'Gleichmäßiger Abstand aller Buchstaben eines Wortes (engl. tracking).', 'ue-labor'],
  ['Lottie', 'Animation', 'Vektorbasiertes Animationsformat (JSON), meist aus After Effects exportiert, für Web und Apps.', 'animation'],
  ['Logo', 'Grundlagen', 'Grafisches Kennzeichen eines Absenders. Kurzform von Logotype.', 'grundlagen'],
  ['Logotype', 'Typografie', 'Schriftzug als Kennzeichen. Ursprung des Begriffs „Logo“.', 'logoarten'],
  ['Marke', 'Grundlagen', 'Rechtlich geschütztes Kennzeichen zur Unterscheidung von Waren und Dienstleistungen (MarkenG).', 'grundlagen'],
  ['Mindestgröße', 'Anwendung', 'Kleinste zulässige Darstellungsgröße eines Logos, damit es erkennbar bleibt.', 'anwendung'],
  ['Monogramm', 'Logoarten', 'Verbindung von zwei oder mehr Buchstaben, meist Initialen, zu einem Zeichen.', 'logoarten'],
  ['Mikrointeraktion', 'Animation', 'Kurze Animation als Rückmeldung auf eine Aktion, etwa ein Herz, das sich beim Antippen füllt.', 'animation'],
  ['Moodboard', 'Prozess', 'Collage aus Bildern, Farben und Schriften zur Abstimmung einer visuellen Richtung.', 'prozess'],
  ['Morphing', 'Animation', 'Fließende Verwandlung einer Form in eine andere, z. B. Menü-Icon in Schließen-Kreuz.', 'animation'],
  ['Optischer Ausgleich', 'Form', 'Korrektur geometrischer Maße, damit Formen optisch gleich groß oder ausgerichtet wirken.', 'gestaltung'],
  ['Overshoot', 'Form', 'Runde und spitze Formen ragen leicht über Grund- und Oberlinie, damit sie nicht kleiner wirken.', 'gestaltung'],
  ['Pantone', 'Farbe', 'Farbsystem für Sonderfarben (Volltonfarben) mit festen Rezepturen.', 'anwendung'],
  ['Piktogramm', 'Zeichen', 'Vereinfachte bildliche Darstellung, die eine Information sprachunabhängig vermittelt.', 'piktogramme'],
  ['Prägnanz', 'Form', 'Gestaltgesetz: Einfache, regelmäßige und geschlossene Formen werden bevorzugt wahrgenommen.', 'gestaltung'],
  ['Prompt', 'KI', 'Textanweisung an ein KI-Werkzeug. Gute Prompts nennen Inhalt, Stil und Einschränkungen.', 'ki'],
  ['Reduced Motion', 'Animation', 'Systemeinstellung „Bewegung reduzieren“. Webseiten erkennen sie per CSS (prefers-reduced-motion) und verzichten auf Animation.', 'animation'],
  ['Reduktion', 'Form', 'Weglassen aller Elemente, die für Erkennen und Wirkung nicht nötig sind.', 'gestaltung'],
  ['Reinzeichnung', 'Prozess', 'Präzise, finale Ausarbeitung eines Entwurfs als produktionsfähige Vektordatei.', 'prozess'],
  ['Responsive Logo', 'Anwendung', 'Logo mit mehreren Varianten abnehmender Komplexität für unterschiedliche Größen.', 'anwendung'],
  ['RGB / HEX', 'Farbe', 'Farbmodell für Bildschirme aus Rot, Grün und Blau. HEX ist die hexadezimale Schreibweise, z. B. #FF4F0F.', 'anwendung'],
  ['Schutzzone', 'Anwendung', 'Freiraum rund um das Logo, in den keine anderen Elemente ragen dürfen.', 'anwendung'],
  ['Scribble', 'Prozess', 'Schnelle, grobe Handskizze zur Ideenfindung.', 'prozess'],
  ['Semiotik', 'Zeichen', 'Lehre von den Zeichen, ihrer Bedeutung und ihrem Gebrauch.', 'grundlagen'],
  ['Signet', 'Grundlagen', 'Grafisches Zeichen eines Absenders, vor allem das Bildzeichen. Historisch das Druckerzeichen.', 'grundlagen'],
  ['Styleguide', 'Anwendung', 'Regelwerk für den Einsatz von Logo, Farben und Schriften. Auch Logo-Manual oder Brand Guidelines.', 'prozess'],
  ['SVG', 'Anwendung', 'Scalable Vector Graphics: offenes Vektorformat für Web und Apps.', 'anwendung'],
  ['Symbol', 'Zeichen', 'Zeichentyp nach Peirce, dessen Bedeutung auf Konvention beruht und gelernt werden muss.', 'grundlagen'],
  ['Vektorgrafik', 'Anwendung', 'Grafik aus mathematisch beschriebenen Pfaden, verlustfrei skalierbar.', 'anwendung'],
  ['Wort-Bild-Marke', 'Logoarten', 'Kombination aus Bildzeichen und Schriftzug, die auch getrennt einsetzbar sind.', 'logoarten'],
  ['Wortmarke', 'Logoarten', 'Logo, das ausschließlich aus Schrift besteht.', 'logoarten'],
  ['Zeichensystem', 'Zeichen', 'Familie aufeinander abgestimmter Zeichen mit gemeinsamen Gestaltungsregeln, z. B. ein Leitsystem.', 'piktogramme']
];
function initGlossar() {
  const cats = ['Alle', ...[...new Set(GL.map((g) => g[1]))].sort((a, b) => a.localeCompare(b, 'de'))];
  let cat = 'Alle', q = '';
  $('#gl-cats').innerHTML = cats.map((c) => `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === cat}">${c}</button>`).join('');
  const norm = (s) => s.toLowerCase();
  const render = () => {
    const list = GL.filter((g) => (cat === 'Alle' || g[1] === cat) && (!q || norm(g[0] + ' ' + g[2]).includes(norm(q)))).sort((a, b) => a[0].localeCompare(b[0], 'de'));
    const letters = [...new Set(list.map((g) => g[0][0].toUpperCase()))];
    $('#gl-az').innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((L) => letters.includes(L) ? `<a href="#" data-jump="${L}">${L}</a>` : `<span>${L}</span>`).join('');
    if (!list.length) { $('#gl-list').innerHTML = `<p class="gl-empty">Kein Begriff gefunden. Prüfen Sie die Schreibweise oder wählen Sie „Alle“.</p>`; return; }
    let html = '', last = '';
    for (const [t, c, d, p] of list) {
      const L = t[0].toUpperCase();
      if (L !== last) { html += `<div class="gl-letter" id="gl-${L}">${L}</div>`; last = L; }
      html += `<div class="gl-item"><div><h3>${esc(t)}</h3><span class="cat">${esc(c)}</span></div><div><p>${esc(d)}</p><p class="see">→ <a href="#${p}">${esc(pageById(p).t)}</a></p></div></div>`;
    }
    $('#gl-list').innerHTML = html;
  };
  $('#gl-cats').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; cat = b.dataset.cat; for (const x of $$('#gl-cats .chip')) x.setAttribute('aria-pressed', String(x === b)); render(); });
  $('#gl-search').addEventListener('input', (e) => { q = e.target.value.trim(); render(); });
  $('#gl-az').addEventListener('click', (e) => { const a = e.target.closest('[data-jump]'); if (!a) return; e.preventDefault(); const t = $('#gl-' + a.dataset.jump); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  render();
}

/* ================================================================
   Start
   ================================================================ */
function boot() {
  renderNav();
  renderTiles();
  renderPagers();
  fillLogoSlots();
  initDemos();
  initAbstraktion();
  initDeuten();
  initBaukasten();
  initSort();
  initLabor();
  initCheck();
  initAnimation();
  initKI();
  initQuiz();
  initLit();
  initGlossar();
  updateProgress();
  // Spaltenköpfe als Label an jede Zelle hängen, damit Tabellen auf dem Handy als Karten lesbar bleiben
  for (const t of $$('.table-wrap table')) {
    const heads = $$('thead th', t).map((th) => th.textContent.trim());
    for (const tr of $$('tbody tr', t)) [...tr.children].forEach((td, i) => { if (heads[i]) td.dataset.label = heads[i]; });
  }

  $('#menu-btn').addEventListener('click', () => {
    const open = $('#app').classList.toggle('nav-open');
    $('#menu-btn').setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if ($('#app').classList.contains('nav-open') && !e.target.closest('#sidebar') && !e.target.closest('#menu-btn')) $('#app').classList.remove('nav-open');
  });
  window.addEventListener('hashchange', route);
  route();
}
boot();
})();
