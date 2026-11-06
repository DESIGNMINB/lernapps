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
  get(k, d) { try { const v = localStorage.getItem('ue1:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('ue1:' + k, JSON.stringify(v)); } catch (e) { /* Speicher nicht verfügbar */ } }
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
  prozess: 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4',
  nutzende: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1M17 11a3 3 0 1 0 0-6M22 21v-1a5 5 0 0 0-4-4.9',
  mobile: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2',
  zugang: 'M12 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM5 9.5l7 1.5 7-1.5M12 11v4M12 15l-3 5M12 15l3 5',
  methoden: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  experten: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5M8 11h6M11 8v6',
  testen: 'M3 5h18v11H3zM8 21h8M12 16v5M9 9l2 2 4-4',
  messen: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  auswerten: 'M5 3h10l4 4v14H5zM14 3v5h5M8 13h8M8 17h5',
  'ue-daumen': 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM9 15a3 3 0 0 0 6 0',
  'ue-heuristik': 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5M11 8v3M11 14h.01',
  'ue-aufgaben': 'M9 5h11M9 12h11M9 19h11M4 5l1 1 2-2M4 12l1 1 2-2M4 19h2',
  'ue-sus': 'M4 4h16v16H4zM8 15l3-3 2 2 4-5',
  'ue-schwere': 'M12 3l10 18H2zM12 10v4M12 17h.01',
  'ue-testplan': 'M9 3h6v3H9zM6 5H4v16h16V5h-2M8 11h8M8 15h8M8 19h5',
  quiz: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6',
  literatur: 'M4 4h4v16H4zM10 4h4v16h-4zM16 5l3.5-1 3 15.5-3.5 1z',
  glossar: 'M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12M9 8h6M9 11h4'
};

const PAGES = [
  { id: 'home', t: 'Home' },
  { id: 'einleitung', t: 'Einleitung', sub: 'UX im Medienprojekt', group: 'Gestalten' },
  { id: 'prozess', t: 'Nutzerzentrierter Prozess', sub: 'Iterieren statt raten' },
  { id: 'nutzende', t: 'Nutzende verstehen', sub: 'Interviews, Personas, Kontext' },
  { id: 'mobile', t: 'Mobile UX', sub: 'Daumen, Gesten, Plattformen' },
  { id: 'zugang', t: 'Barrierefreie Apps', sub: 'WCAG, Screenreader, BFSG' },
  { id: 'methoden', t: 'Evaluationsmethoden', sub: 'Welche Methode wann?', group: 'Evaluieren' },
  { id: 'experten', t: 'Heuristische Evaluation', sub: 'Expertinnen prüfen die App' },
  { id: 'testen', t: 'Usability-Tests', sub: 'Mit echten Nutzenden testen' },
  { id: 'messen', t: 'Messen und Fragebögen', sub: 'SUS, UEQ, Kennzahlen' },
  { id: 'auswerten', t: 'Auswerten und Berichten', sub: 'Befunde, Schweregrade, Bericht' },
  { id: 'ue-daumen', t: 'Daumenzonen-Check', sub: 'Bedienelemente richtig platzieren', group: 'Übungen', ex: 1 },
  { id: 'ue-heuristik', t: 'Heuristik-Detektiv', sub: 'Probleme in einem App-Screen finden', ex: 2 },
  { id: 'ue-aufgaben', t: 'Testaufgaben formulieren', sub: 'Neutral statt suggestiv', ex: 3 },
  { id: 'ue-sus', t: 'SUS auswerten', sub: 'Score berechnen und deuten', ex: 4 },
  { id: 'ue-schwere', t: 'Befunde priorisieren', sub: 'Schweregrade nach Nielsen', ex: 5 },
  { id: 'ue-testplan', t: 'Testplan erstellen', sub: 'Für Ihr eigenes Projekt', ex: 6 },
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
  document.title = (id === 'home' ? '' : pageById(id).t + ' · ') + 'UX & Evaluation Lernmodul';
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

/* ================================================================
   Kapitel-Demos
   ================================================================ */
/* Kapitel 09: SUS-Rechner als kleine Demo (dieselbe Formel wie in Übung 4) */
function susScore(a) {
  // a: 10 Antworten von 1 (stimme gar nicht zu) bis 5 (stimme voll zu)
  let s = 0;
  a.forEach((v, i) => { s += i % 2 === 0 ? v - 1 : 5 - v; });
  return s * 2.5;
}
function susGrade(score) {
  // Adjektivskala nach Bangor, Kortum & Miller (2009), gerundete Mittelwerte
  if (score >= 85) return ['ausgezeichnet', 'ok'];
  if (score >= 72) return ['gut', 'ok'];
  if (score >= 68) return ['durchschnittlich bis gut', 'info'];
  if (score >= 51) return ['ausreichend, unter dem Durchschnitt', 'bad'];
  return ['schlecht', 'bad'];
}
const SUS_ITEMS = [
  'Ich denke, dass ich die App gerne häufig benutzen würde.',
  'Ich fand die App unnötig komplex.',
  'Ich fand die App einfach zu benutzen.',
  'Ich glaube, ich würde die Hilfe einer technisch versierten Person brauchen, um die App benutzen zu können.',
  'Ich fand, die verschiedenen Funktionen der App waren gut integriert.',
  'Ich denke, die App enthielt zu viele Inkonsistenzen.',
  'Ich kann mir vorstellen, dass die meisten Menschen den Umgang mit der App sehr schnell lernen.',
  'Ich fand die App sehr umständlich zu nutzen.',
  'Ich fühlte mich bei der Benutzung der App sehr sicher.',
  'Ich musste viele Dinge lernen, bevor ich mit der App arbeiten konnte.'
];

/* ================================================================
   Übung 1: Daumenzonen-Check
   ================================================================ */
// Bildschirm 300 × 600 (entspricht einem 6,1-Zoll-Smartphone in pt, verkleinert). Rechtshändige Bedienung.
const DZ_ELEMENTS = [
  { id: 'cta', label: 'Hauptaktion „Jetzt buchen“', short: 'Jetzt buchen', color: '#CC4E00' },
  { id: 'nav', label: 'Navigation (Tab-Leiste)', short: 'Start · Suche · Buchungen · Profil', color: '#64378C' },
  { id: 'search', label: 'Suche', short: 'Suche', color: '#374151' },
  { id: 'delete', label: 'Konto löschen', short: 'Konto löschen', color: '#B91C1C', destructive: true }
];
const DZ_POS = [
  { id: 'top', label: 'oben', y: 60 },
  { id: 'mid', label: 'Mitte', y: 300 },
  { id: 'bottom', label: 'unten', y: 520 }
];
function dzZone(posId, side) {
  // vereinfachte Daumenzonen nach Hoober (2013): unten mitte = leicht, oben gegenüber = schwer
  if (posId === 'bottom') return side === 'left' ? 'mittel' : 'leicht';
  if (posId === 'mid') return 'mittel';
  return side === 'right' ? 'mittel' : 'schwer';
}
function initDaumen() {
  const state = store.get('dz', { cta: { pos: 'top', side: 'left', size: 32 }, nav: { pos: 'top', side: 'left', size: 40 }, search: { pos: 'top', side: 'right', size: 44 }, delete: { pos: 'bottom', side: 'right', size: 44 } });
  const ctl = $('#dz-controls');
  ctl.innerHTML = DZ_ELEMENTS.map((e) => `
    <fieldset class="ue-dz-el">
      <legend>${esc(e.label)}</legend>
      <label>Position <select data-el="${e.id}" data-k="pos">${DZ_POS.map((p) => `<option value="${p.id}">${p.label}</option>`).join('')}</select></label>
      ${e.id === 'nav' ? '<span class="small muted" style="align-self:end">volle Breite</span>' : `<label>Seite <select data-el="${e.id}" data-k="side"><option value="left">links</option><option value="center">Mitte</option><option value="right">rechts</option></select></label>`}
      <label>Höhe <input type="range" min="24" max="64" step="4" data-el="${e.id}" data-k="size"><output data-out="${e.id}"></output></label>
    </fieldset>`).join('');
  for (const el of $$('[data-el]', ctl)) el.value = state[el.dataset.el][el.dataset.k];
  const render = () => {
    store.set('dz', state);
    const xOf = (side, w) => side === 'left' ? 16 : side === 'right' ? 300 - 16 - w : 150 - w / 2;
    let svg = `<rect x="0" y="0" width="300" height="600" rx="28" fill="#fff" stroke="#1F2937" stroke-width="3"/>
      <path d="M300 600 L300 330 Q 150 300 40 600 Z" fill="#DCFCE7" opacity=".9"/>
      <path d="M300 330 Q 150 300 40 600 L0 600 L0 330 Q 120 120 300 120 Z" fill="#FEF3C7" opacity=".85"/>
      <path d="M0 0 H300 V120 Q 120 120 0 330 Z" fill="#FEE2E2" opacity=".85"/>
      <text x="292" y="590" text-anchor="end" font-size="11" fill="#166534">leicht</text><text x="10" y="320" font-size="11" fill="#92400E">mittel</text><text x="10" y="20" font-size="11" fill="#991B1B">schwer</text>`;
    for (const e of DZ_ELEMENTS) {
      const s = state[e.id], w = e.id === 'nav' ? 268 : Math.max(s.size * 2.4, e.short.length * 6.4 + 20), h = s.size, x = e.id === 'nav' ? 16 : xOf(s.side, w);
      const y = Math.min(Math.max(DZ_POS.find((p) => p.id === s.pos).y - h / 2, 30), 600 - h - 20);
      svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(h / 2, 12)}" fill="${e.color}" stroke="#fff" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="11" font-weight="600" fill="#fff">${esc(e.short)}</text>`;
    }
    $('#dz-phone').innerHTML = svg;
    for (const e of DZ_ELEMENTS) $(`[data-out="${e.id}"]`).textContent = state[e.id].size + ' pt';
  };
  ctl.addEventListener('input', (ev) => {
    const el = ev.target.closest('[data-el]'); if (!el) return;
    state[el.dataset.el][el.dataset.k] = el.dataset.k === 'size' ? +el.value : el.value;
    render();
  });
  $('#dz-check').addEventListener('click', () => {
    const msgs = []; let ok = 0;
    const cta = state.cta, nav = state.nav, del = state.delete, srch = state.search;
    const zone = (s) => dzZone(s.pos, s.side);
    if (zone(cta) === 'leicht' && cta.size >= 44) { ok++; msgs.push('✓ Die Hauptaktion liegt in der leicht erreichbaren Zone und ist groß genug.'); }
    else msgs.push(`✗ Hauptaktion: liegt in der Zone „${zone(cta)}“ mit ${cta.size} pt. Häufige Aktionen gehören unten in Daumennähe und brauchen mindestens 44 pt.`);
    if (nav.pos === 'bottom' && nav.size >= 44) { ok++; msgs.push('✓ Die Tab-Leiste sitzt unten, wie es iOS und Android für die Hauptnavigation vorsehen.'); }
    else msgs.push('✗ Navigation: Eine Tab-Leiste für die Hauptbereiche gehört nach unten und braucht mindestens 44 pt Höhe.');
    if (zone(del) !== 'leicht') { ok++; msgs.push('✓ „Konto löschen“ liegt außerhalb der Komfortzone. Destruktive Aktionen sollen nicht versehentlich ausgelöst werden.'); }
    else msgs.push('✗ „Konto löschen“ liegt direkt unter dem Daumen. Destruktive Aktionen gehören aus der Komfortzone heraus und brauchen eine Bestätigung.');
    if (srch.size >= 44) { ok++; msgs.push('✓ Die Suche ist groß genug, auch wenn sie oben liegt. Oben ist für seltenere Aktionen in Ordnung.'); }
    else msgs.push(`✗ Suche: ${srch.size} pt sind zu klein. Apple empfiehlt mindestens 44 × 44 pt, Google 48 × 48 dp.`);
    const pass = ok === 4;
    $('#dz-fb').innerHTML = `<div class="feedback ${pass ? 'ok' : 'bad'}" role="status"><p><strong>${ok} von 4 Kriterien erfüllt.</strong></p>${msgs.map((m) => `<p>${esc(m)}</p>`).join('')}${pass ? '<p>Bestanden. Markieren Sie die Übung unten als erledigt.</p>' : ''}</div>`;
    if (pass) markDone('ue-daumen');
  });
  $('#dz-reset').addEventListener('click', () => {
    Object.assign(state, { cta: { pos: 'top', side: 'left', size: 32 }, nav: { pos: 'top', side: 'left', size: 40 }, search: { pos: 'top', side: 'right', size: 44 }, delete: { pos: 'bottom', side: 'right', size: 44 } });
    for (const el of $$('[data-el]', ctl)) el.value = state[el.dataset.el][el.dataset.k];
    $('#dz-fb').innerHTML = '';
    render();
  });
  render();
}

/* ================================================================
   Übung 2: Heuristik-Detektiv
   ================================================================ */
const HEURISTICS = [
  'Sichtbarkeit des Systemstatus',
  'Übereinstimmung mit der realen Welt',
  'Nutzerkontrolle und Freiheit',
  'Konsistenz und Standards',
  'Fehlervermeidung',
  'Wiedererkennen statt Erinnern',
  'Flexibilität und Effizienz',
  'Ästhetisches, minimalistisches Design',
  'Fehler erkennen, verstehen, beheben',
  'Hilfe und Dokumentation'
];
const HD_SPOTS = [
  { id: 'h1', label: 'Fortschritt beim Bezahlen', x: 20, y: 74, w: 260, h: 40, h_: 0, text: 'Nach dem Tippen auf „Bezahlen“ passiert drei Sekunden lang nichts: kein Ladeindikator, keine Rückmeldung.', why: 'Die App muss zeigen, dass sie arbeitet. Ein Ladeindikator oder ein deaktivierter Button mit „Wird bezahlt …“ verhindert Doppelklicks.' },
  { id: 'h2', label: 'Fehlermeldung', x: 20, y: 130, w: 260, h: 54, h_: 8, text: 'Die Fehlermeldung lautet „Error 0x80070057“.', why: 'Fehlermeldungen sollen in verständlicher Sprache sagen, was passiert ist und wie man es behebt, z. B. „Die Kartennummer ist zu kurz. Bitte prüfen Sie die 16 Ziffern.“' },
  { id: 'h3', label: 'Kartennummer-Feld', x: 20, y: 200, w: 260, h: 48, h_: 4, text: 'Das Feld für die Kartennummer öffnet die Buchstaben-Tastatur und erlaubt beliebige Zeichen.', why: 'Fehlervermeidung: Ein Ziffernfeld mit passender Tastatur (inputmode="numeric") und automatischer Gruppierung verhindert Tippfehler.' },
  { id: 'h4', label: 'Schließen-Symbol', x: 252, y: 18, w: 34, h: 34, h_: 2, text: 'Es gibt kein „Zurück“ und das Schließen-Symbol bricht ohne Nachfrage ab. Die eingegebenen Daten sind weg.', why: 'Nutzende brauchen einen klar markierten Ausweg und dürfen keine Eingaben verlieren. Eine Rückfrage oder das Zwischenspeichern hilft.' },
  { id: 'h5', label: 'Button-Beschriftung', x: 20, y: 520, w: 260, h: 52, h_: 3, text: 'Der Hauptbutton heißt auf diesem Screen „Weiter“, auf dem nächsten „Submit“ und auf dem letzten „OK“.', why: 'Gleiche Aktionen sollten gleich heißen und sich an Plattformkonventionen halten. Besser durchgehend deutsch und konkret: „Jetzt bezahlen“.' },
  { id: 'h6', label: 'Gutscheincode', x: 20, y: 268, w: 260, h: 48, h_: 5, text: 'Der Gutscheincode aus der E-Mail muss auswendig eingetippt werden, weil die App ihn auf dem vorigen Screen nur kurz angezeigt hat.', why: 'Wiedererkennen statt Erinnern: Informationen, die man braucht, sollen sichtbar sein oder sich übernehmen lassen, z. B. per Einfügen-Vorschlag.' }
];
function initHeuristik() {
  const found = store.get('hd', {});
  const phone = $('#hd-phone');
  phone.innerHTML = `
    <div class="ue-hd-screen" aria-hidden="true">
      <div class="ue-hd-top"><span>Bezahlen</span><span class="ue-hd-x">✕</span></div>
      <div class="ue-hd-row ue-hd-load">Bezahlung wird verarbeitet …?</div>
      <div class="ue-hd-row ue-hd-err">Error 0x80070057</div>
      <div class="ue-hd-row ue-hd-field">Kartennummer <span>abc|</span></div>
      <div class="ue-hd-row ue-hd-field">Gutscheincode <span>?</span></div>
      <div class="ue-hd-row ue-hd-sum">Summe <b>24,90 €</b></div>
      <div class="ue-hd-cta">Submit</div>
    </div>
    ${HD_SPOTS.map((s) => `<button type="button" class="ue-hd-spot${found[s.id] != null ? ' is-found' : ''}" data-spot="${s.id}" style="left:${s.x / 3}%;top:${s.y / 6}%;width:${s.w / 3}%;height:${s.h / 6}%" aria-label="Bereich prüfen: ${esc(s.label)}"></button>`).join('')}`;
  const panel = $('#hd-panel');
  const renderCount = () => {
    const n = HD_SPOTS.filter((s) => found[s.id] === s.h_).length;
    $('#hd-count').textContent = `${n} von ${HD_SPOTS.length} Problemen richtig zugeordnet`;
    if (n >= 5) markDone('ue-heuristik');
  };
  const open = (s) => {
    panel.innerHTML = `<h3 tabindex="-1" id="hd-h">${esc(s.label)}</h3><p>${esc(s.text)}</p>
      <label class="label" for="hd-sel">Gegen welche Heuristik verstößt das am deutlichsten?</label>
      <select id="hd-sel"><option value="">Bitte wählen …</option>${HEURISTICS.map((h, i) => `<option value="${i}">${i + 1}. ${esc(h)}</option>`).join('')}</select>
      <button class="btn btn-primary" type="button" id="hd-ok" style="margin-top:12px">Zuordnen</button><div id="hd-fb" role="status"></div>`;
    if (found[s.id] != null) $('#hd-sel').value = found[s.id];
    $('#hd-h').focus();
    $('#hd-ok').addEventListener('click', () => {
      const v = $('#hd-sel').value; if (v === '') return;
      found[s.id] = +v; store.set('hd', found);
      const right = +v === s.h_;
      $(`[data-spot="${s.id}"]`).classList.add('is-found');
      $('#hd-fb').innerHTML = `<div class="feedback ${right ? 'ok' : 'bad'}"><p><strong>${right ? 'Richtig.' : `Naheliegend, gemeint ist aber Heuristik ${s.h_ + 1}: ${esc(HEURISTICS[s.h_])}.`}</strong></p><p>${esc(s.why)}</p></div>`;
      renderCount();
    });
  };
  phone.addEventListener('click', (e) => { const b = e.target.closest('[data-spot]'); if (b) open(HD_SPOTS.find((s) => s.id === b.dataset.spot)); });
  $('#hd-list').innerHTML = HD_SPOTS.map((s) => `<li><button type="button" class="btn btn-sm" data-spot-list="${s.id}">${esc(s.label)}</button></li>`).join('');
  $('#hd-list').addEventListener('click', (e) => { const b = e.target.closest('[data-spot-list]'); if (b) open(HD_SPOTS.find((s) => s.id === b.dataset.spotList)); });
  renderCount();
}

/* ================================================================
   Übung 3: Testaufgaben formulieren
   ================================================================ */
const TASKS = [
  ['Klicken Sie unten auf das Herz-Symbol, um das Rezept zu speichern.', false, 'Verrät den Lösungsweg und das Symbol. Besser: „Sie möchten das Rezept später wiederfinden. Was tun Sie?“'],
  ['Sie haben morgen Gäste und suchen ein vegetarisches Hauptgericht, das in unter 30 Minuten fertig ist. Finden Sie ein passendes Rezept.', true, 'Realistisches Szenario mit klarem Ziel und Abbruchkriterium, ohne Begriffe aus der Oberfläche vorwegzunehmen.'],
  ['Wie gefällt Ihnen die Startseite?', false, 'Fragt nach Meinung statt nach Verhalten. Geschmack lässt sich später im Interview oder Fragebogen erheben.'],
  ['Finden Sie heraus, wann Ihre nächste Bahn nach Ettlingen fährt, und kaufen Sie das passende Ticket.', true, 'Konkretes Ziel aus dem Alltag der Persona mit erkennbarem Ende.'],
  ['Nutzen Sie die Filterfunktion „Kategorien“, um Schuhe zu finden.', false, 'Benennt die Funktion und führt damit zur Lösung. Besser: „Sie suchen Laufschuhe in Größe 43 unter 100 €.“'],
  ['Das ist doch ganz einfach, oder? Ändern Sie Ihr Profilbild.', false, 'Suggestiv: Wer scheitert, fühlt sich schuldig. Aufgaben neutral formulieren und Schwierigkeit nicht bewerten.'],
  ['Ihr Kurs fällt aus und Sie möchten die Anmeldung zurückziehen. Zeigen Sie, wie Sie vorgehen würden.', true, 'Szenario mit Motivation, lässt den Weg offen und prüft eine kritische Funktion.'],
  ['Testen Sie alle Funktionen der App.', false, 'Zu offen: Es gibt kein Ziel und kein Ende. Ergebnisse sind nicht vergleichbar.']
];
function initAufgaben() {
  const ans = store.get('tq', {});
  const root = $('#tq-list');
  root.innerHTML = TASKS.map((t, i) => `
    <div class="ue-tq" data-i="${i}">
      <p class="ue-tq-text">„${esc(t[0])}“</p>
      <div class="toggle" role="group" aria-label="Bewertung für Aufgabe ${i + 1}">
        <button type="button" data-v="1" aria-pressed="${ans[i] === 1}">Gut formuliert</button>
        <button type="button" data-v="0" aria-pressed="${ans[i] === 0}">Problematisch</button>
      </div>
      <div class="ue-tq-fb" role="status"></div>
    </div>`).join('');
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    const box = b.closest('.ue-tq'); const i = +box.dataset.i;
    ans[i] = +b.dataset.v; store.set('tq', ans);
    pressGroup(b.parentElement, b);
    $('.ue-tq-fb', box).innerHTML = '';
  });
  $('#tq-check').addEventListener('click', () => {
    let n = 0, open = 0;
    TASKS.forEach((t, i) => {
      const box = $(`.ue-tq[data-i="${i}"]`);
      if (ans[i] == null) { open++; $('.ue-tq-fb', box).innerHTML = ''; return; }
      const right = (ans[i] === 1) === t[1]; if (right) n++;
      $('.ue-tq-fb', box).innerHTML = `<div class="feedback ${right ? 'ok' : 'bad'}"><p><strong>${right ? 'Richtig' : 'Nicht ganz'}:</strong> ${t[1] ? 'gut formuliert.' : 'problematisch.'} ${esc(t[2])}</p></div>`;
    });
    const pass = n >= 7;
    $('#tq-fb').innerHTML = `<div class="feedback ${pass ? 'ok' : 'bad'}" role="status"><p><strong>${n} von ${TASKS.length} richtig.</strong> ${open ? `Noch ${open} ohne Bewertung. ` : ''}${pass ? 'Bestanden.' : 'Für das Bestehen brauchen Sie 7 richtige Bewertungen.'}</p></div>`;
    if (pass) markDone('ue-aufgaben');
  });
}

/* ================================================================
   Übung 4: SUS auswerten
   ================================================================ */
// Fünf fiktive Testpersonen einer Fahrrad-Sharing-App
const SUS_DATA = [
  ['P1', [4, 2, 4, 1, 4, 2, 5, 2, 4, 1]],
  ['P2', [3, 3, 4, 2, 3, 3, 4, 3, 3, 2]],
  ['P3', [5, 1, 5, 1, 4, 1, 5, 1, 5, 2]],
  ['P4', [2, 4, 2, 4, 3, 3, 3, 4, 2, 4]],
  ['P5', [4, 2, 4, 2, 4, 2, 4, 2, 4, 2]]
];
function initSus() {
  const own = store.get('sus-own', Array(10).fill(3));
  $('#sus-form').innerHTML = SUS_ITEMS.map((q, i) => `
    <fieldset class="ue-sus-item"><legend><span class="mono">${i + 1}.</span> ${esc(q)}</legend>
      <div class="ue-likert">${[1, 2, 3, 4, 5].map((v) => `<label><input type="radio" name="sus${i}" value="${v}"${own[i] === v ? ' checked' : ''}><span>${v}</span></label>`).join('')}</div>
    </fieldset>`).join('');
  const calcOwn = () => {
    const s = susScore(own), [g, cls] = susGrade(s);
    $('#sus-out').innerHTML = `<div class="feedback ${cls}" role="status"><p><strong>SUS-Score: ${fmt(s, 1)}</strong> · ${esc(g)}</p></div>`;
  };
  $('#sus-form').addEventListener('change', (e) => { const m = e.target.name.match(/sus(\d)/); if (!m) return; own[+m[1]] = +e.target.value; store.set('sus-own', own); calcOwn(); });
  calcOwn();
  // Rechenaufgabe mit den fünf Datensätzen
  $('#sus-data').innerHTML = `<table><thead><tr><th>Person</th>${SUS_ITEMS.map((_, i) => `<th>F${i + 1}</th>`).join('')}<th>Ihr Score</th></tr></thead><tbody>${SUS_DATA.map(([p, a], r) => `<tr><td><strong>${p}</strong></td>${a.map((v) => `<td class="mono">${v}</td>`).join('')}<td><input type="text" inputmode="decimal" autocomplete="off" data-r="${r}" aria-label="SUS-Score für ${p}" class="ue-num"></td></tr>`).join('')}</tbody></table>`;
  $('#sus-check').addEventListener('click', () => {
    let ok = 0; const lines = [];
    SUS_DATA.forEach(([p, a], r) => {
      const inp = $(`[data-r="${r}"]`), v = parseFloat(String(inp.value).replace(',', '.')), s = susScore(a);
      const right = Math.abs(v - s) < 0.01; if (right) ok++;
      inp.classList.toggle('is-ok', right); inp.classList.toggle('is-bad', !right && inp.value !== '');
      lines.push(`${p}: ${fmt(s, 1)}`);
    });
    const mean = SUS_DATA.reduce((t, [, a]) => t + susScore(a), 0) / SUS_DATA.length;
    const pass = ok === SUS_DATA.length;
    $('#sus-fb').innerHTML = `<div class="feedback ${pass ? 'ok' : 'bad'}" role="status"><p><strong>${ok} von ${SUS_DATA.length} Scores richtig.</strong></p>${pass ? `<p>Der Mittelwert liegt bei ${fmt(mean, 1)}, also ${esc(susGrade(mean)[0])}. Auffällig ist P4: Ein einzelner sehr niedriger Wert sollte im Interview nachgefragt werden.</p>` : '<p>Tipp: Ungerade Fragen: Antwort minus 1. Gerade Fragen: 5 minus Antwort. Summe mal 2,5.</p>'}</div>`;
    if (pass) markDone('ue-sus');
  });
  $('#sus-solve').addEventListener('click', () => {
    $('#sus-fb').innerHTML = `<div class="feedback info" role="status"><p>Lösung: ${SUS_DATA.map(([p, a]) => `${p} = ${fmt(susScore(a), 1)}`).join(' · ')}. Aufgedeckte Lösungen zählen nicht als erledigt.</p></div>`;
  });
}

/* ================================================================
   Übung 5: Befunde priorisieren
   ================================================================ */
const SEV_LABELS = ['0 · kein Problem', '1 · kosmetisch', '2 · gering', '3 · schwerwiegend', '4 · katastrophal'];
const FINDINGS = [
  ['Beim Registrieren verlangt die App das Passwort zweimal. 2 von 6 Personen ärgern sich, alle schaffen es.', 1, 'Nervt, verhindert aber nichts und kommt nur einmal vor. Kosmetisch bis gering.'],
  ['Der „Weiter“-Button im Checkout liegt unter der Tastatur. 5 von 6 Personen finden ihn nicht und brechen ab.', 4, 'Verhindert die Kernaufgabe bei fast allen: katastrophal, vor dem Release beheben.'],
  ['Die Schrift im Impressum ist grau auf hellgrau, Kontrast 2,8 : 1.', 2, 'Betrifft eine selten besuchte Seite, verstößt aber gegen WCAG 1.4.3. Gering, aber verbindlich zu beheben.'],
  ['Das Icon für „Favoriten“ ist ein Stern, im Rest der App steht der Stern für Bewertungen. 4 von 6 Personen tippen zuerst falsch, finden aber den richtigen Weg.', 3, 'Häufig, wiederkehrend und kostet Zeit: schwerwiegend.'],
  ['Eine Person wünscht sich einen Dunkelmodus.', 0, 'Ein Wunsch, kein Usability-Problem. Gehört in die Ideenliste, nicht in die Fehlerliste.'],
  ['Nach dem Speichern erscheint keine Bestätigung. 3 von 6 Personen speichern mehrfach, um sicherzugehen.', 3, 'Fehlende Rückmeldung (Heuristik 1), häufig, führt zu Doppelaktionen: schwerwiegend.']
];
function initSchwere() {
  const ans = store.get('sev', {});
  $('#sev-list').innerHTML = FINDINGS.map((f, i) => `
    <div class="ue-sev" data-i="${i}">
      <p><span class="label">Befund ${i + 1}</span><br>${esc(f[0])}</p>
      <label class="small">Schweregrad <select data-sev="${i}"><option value="">wählen …</option>${SEV_LABELS.map((l, k) => `<option value="${k}"${ans[i] === k ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
      <div class="ue-sev-fb" role="status"></div>
    </div>`).join('');
  $('#sev-list').addEventListener('change', (e) => { const s = e.target.closest('[data-sev]'); if (!s) return; ans[+s.dataset.sev] = s.value === '' ? undefined : +s.value; store.set('sev', ans); });
  $('#sev-check').addEventListener('click', () => {
    let n = 0;
    FINDINGS.forEach((f, i) => {
      const box = $(`.ue-sev[data-i="${i}"] .ue-sev-fb`);
      if (ans[i] == null) { box.innerHTML = ''; return; }
      const d = Math.abs(ans[i] - f[1]); if (d <= 1) n++;
      box.innerHTML = `<div class="feedback ${d === 0 ? 'ok' : d === 1 ? 'info' : 'bad'}"><p><strong>${d === 0 ? 'Genau.' : d === 1 ? 'Vertretbar, eine Stufe Abweichung.' : 'Deutlich daneben.'}</strong> Einschätzung der Lehrenden: ${SEV_LABELS[f[1]]}. ${esc(f[2])}</p></div>`;
    });
    const pass = n === FINDINGS.length;
    $('#sev-fb').innerHTML = `<div class="feedback ${pass ? 'ok' : 'bad'}" role="status"><p><strong>${n} von ${FINDINGS.length} im Rahmen.</strong> ${pass ? 'Bestanden. Schweregrade sind Einschätzungen: Eine Stufe Abweichung ist normal, darum bewerten mehrere Personen unabhängig.' : 'Achten Sie auf Häufigkeit, Auswirkung und ob das Problem immer wieder auftritt.'}</p></div>`;
    if (pass) markDone('ue-schwere');
    // sortierte Liste
    const sorted = FINDINGS.map((f, i) => [i, ans[i] ?? -1]).sort((a, b) => b[1] - a[1]);
    $('#sev-sorted').innerHTML = `<h3>Ihre Prioritätenliste</h3><ol>${sorted.map(([i, v]) => `<li><strong>${v < 0 ? 'ohne Wertung' : SEV_LABELS[v]}</strong>: ${esc(FINDINGS[i][0].split('.')[0])}.</li>`).join('')}</ol>`;
  });
}

/* ================================================================
   Übung 6: Testplan erstellen
   ================================================================ */
const TP_FIELDS = [
  ['app', 'Name und Zweck Ihrer App', 'z. B. „CampusMensa: zeigt das Tagesangebot und ermöglicht Vorbestellung“'],
  ['ziel', 'Was wollen Sie herausfinden? (Testziel)', 'z. B. „Finden Erstsemester die Vorbestellung, und verstehen sie die Allergenkennzeichnung?“'],
  ['persona', 'Wer testet? (Persona, Anzahl, Rekrutierung)', 'z. B. „5 Studierende aus dem 1. Semester, die die Mensa mindestens 2× pro Woche nutzen“'],
  ['prototyp', 'Was wird getestet? (Prototyp, Gerät)', 'z. B. „Figma-Prototyp auf eigenem iPhone, Version vom 12.11.“'],
  ['aufgaben', 'Testaufgaben (eine pro Zeile)', 'z. B. „Sie haben eine Nussallergie und wollen heute in der Mensa essen …“'],
  ['metriken', 'Was messen Sie?', 'z. B. „Erfolgsquote je Aufgabe, Zeit, SUS-Fragebogen, Beobachtungen beim lauten Denken“'],
  ['ablauf', 'Ort, Ablauf und Rollen', 'z. B. „Seminarraum, 30 Min.: Begrüßung, Einwilligung, 4 Aufgaben, SUS, Abschlussfragen. Moderation: A, Protokoll: B“']
];
function initTestplan() {
  const st = store.get('tp', {});
  $('#tp-form').innerHTML = TP_FIELDS.map(([k, l, ph]) => `<label class="ue-tp-field"><span class="label">${esc(l)}</span>${k === 'aufgaben' || k === 'ablauf' ? `<textarea rows="4" data-tp="${k}" placeholder="${esc(ph)}"></textarea>` : `<input type="text" data-tp="${k}" placeholder="${esc(ph)}">`}</label>`).join('') +
    `<fieldset class="ue-tp-check"><legend class="label">Vor dem Test erledigt</legend>${['Einwilligungserklärung vorbereitet (Aufzeichnung, Datenschutz)', 'Pilottest mit einer Person aus dem Team', 'Prototyp auf dem Testgerät geprüft', 'Protokollvorlage für die Beobachtung'].map((c, i) => `<label><input type="checkbox" data-tpc="${i}"> ${esc(c)}</label>`).join('')}</fieldset>`;
  for (const el of $$('[data-tp]')) el.value = st[el.dataset.tp] || '';
  for (const el of $$('[data-tpc]')) el.checked = !!(st.c || [])[+el.dataset.tpc];
  const md = () => {
    const tasks = (st.aufgaben || '').split('\n').map((s) => s.trim()).filter(Boolean);
    return `# Usability-Testplan: ${st.app || '…'}\n\n## Testziel\n${st.ziel || '…'}\n\n## Teilnehmende\n${st.persona || '…'}\n\n## Prototyp und Gerät\n${st.prototyp || '…'}\n\n## Aufgaben\n${tasks.length ? tasks.map((t, i) => `${i + 1}. ${t}`).join('\n') : '…'}\n\n## Messgrößen\n${st.metriken || '…'}\n\n## Ablauf und Rollen\n${st.ablauf || '…'}\n\n## Checkliste\n${['Einwilligungserklärung', 'Pilottest', 'Prototyp geprüft', 'Protokollvorlage'].map((c, i) => `- [${(st.c || [])[i] ? 'x' : ' '}] ${c}`).join('\n')}\n`;
  };
  const check = () => {
    const filled = TP_FIELDS.filter(([k]) => (st[k] || '').trim().length >= 10).length;
    const tasks = (st.aufgaben || '').split('\n').filter((s) => s.trim()).length;
    const issues = [];
    if (filled < TP_FIELDS.length) issues.push(`${TP_FIELDS.length - filled} Felder sind noch leer oder sehr kurz.`);
    if (tasks < 3) issues.push('Planen Sie mindestens 3 Aufgaben.');
    if (/klicken|tippen sie auf|button|menü/i.test(st.aufgaben || '')) issues.push('Eine Aufgabe nennt Bedienelemente („klicken“, „Button“, „Menü“). Formulieren Sie Ziele statt Wege.');
    if (!(st.c || [])[0]) issues.push('Ohne Einwilligung dürfen Sie keine Bild- oder Tonaufnahmen machen.');
    $('#tp-fb').innerHTML = `<div class="feedback ${issues.length ? 'bad' : 'ok'}" role="status">${issues.length ? `<p><strong>Noch nicht ganz vollständig.</strong></p>${issues.map((i) => `<p>• ${esc(i)}</p>`).join('')}` : '<p><strong>Ihr Testplan ist vollständig.</strong> Laden Sie ihn herunter und besprechen Sie ihn im Team.</p>'}</div>`;
    if (!issues.length) markDone('ue-testplan');
  };
  $('#tp-form').addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.tp) st[t.dataset.tp] = t.value;
    if (t.dataset.tpc) { st.c = st.c || []; st.c[+t.dataset.tpc] = t.checked; }
    store.set('tp', st);
  });
  $('#tp-check').addEventListener('click', check);
  $('#tp-dl').addEventListener('click', () => {
    const blob = new Blob([md()], { type: 'text/markdown' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'testplan.md'; a.click(); URL.revokeObjectURL(a.href);
    toast('Testplan als testplan.md gespeichert');
  });
  $('#tp-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(md()); toast('Testplan in die Zwischenablage kopiert'); } catch (e) { toast('Kopieren nicht möglich, bitte „Herunterladen“ nutzen'); }
  });
}

/* Kapitel 09: kleiner SUS-Rechner */
function initMessen() {
  const vals = Array(10).fill(3);
  $('#m-sus').innerHTML = vals.map((v, i) => `<label class="ue-mini"><span class="mono">F${i + 1}</span><input type="range" min="1" max="5" value="3" data-m="${i}" aria-label="Antwort auf Frage ${i + 1}: ${esc(SUS_ITEMS[i])}"><output>3</output></label>`).join('');
  const out = () => { const s = susScore(vals); $('#m-sus-out').textContent = `SUS = ${fmt(s, 1)} · ${susGrade(s)[0]}`; };
  $('#m-sus').addEventListener('input', (e) => { const r = e.target.closest('[data-m]'); if (!r) return; vals[+r.dataset.m] = +r.value; r.nextElementSibling.textContent = r.value; out(); });
  out();
}

/* Kapitel 06: Methodenfinder */
const MF = [
  { q: 'Gibt es schon etwas zum Ausprobieren?', a: [['Nein, nur eine Idee', 'idee'], ['Skizzen oder Wireframes', 'lowfi'], ['Klickbarer Prototyp', 'proto'], ['Fertige App', 'app']] }
];
const MF_RESULT = {
  idee: ['Interviews und Beobachtung', 'Verstehen Sie zuerst die Nutzenden und ihren Kontext (Kapitel 03). Evaluieren lässt sich noch nichts, aber Annahmen lassen sich prüfen.'],
  lowfi: ['Papierprototyp-Test und Cognitive Walkthrough', 'Schnell, günstig, früh. Sie finden Strukturfehler, bevor Zeit ins Design fließt.'],
  proto: ['Heuristische Evaluation und moderierter Usability-Test', 'Erst im Team mit den Heuristiken die offensichtlichen Fehler finden, dann mit 5 Personen testen.'],
  app: ['Usability-Test mit SUS oder UEQ, ergänzt um Analytics', 'Jetzt lässt sich auch messen: Erfolgsquoten, Zeiten, Fragebögen. Analytics zeigt, wo viele abspringen, der Test zeigt warum.']
};
function initMethoden() {
  const root = $('#mf');
  root.innerHTML = `<p class="label">${esc(MF[0].q)}</p><div class="chips" role="group" aria-label="${esc(MF[0].q)}">${MF[0].a.map(([l, k]) => `<button type="button" class="chip" data-mf="${k}" aria-pressed="false">${esc(l)}</button>`).join('')}</div><div id="mf-out" role="status" style="margin-top:14px"></div>`;
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-mf]'); if (!b) return;
    pressGroup(b.parentElement, b);
    const [t, d] = MF_RESULT[b.dataset.mf];
    $('#mf-out').innerHTML = `<div class="feedback info"><p><strong>Empfehlung: ${esc(t)}</strong></p><p>${esc(d)}</p></div>`;
  });
}

/* ================================================================
   Wissenstest
   ================================================================ */
const QUIZ = [
  ['Was beschreibt die Gebrauchstauglichkeit (Usability) nach DIN EN ISO 9241-11?', ['Wie schön eine App aussieht', 'Wie effektiv, effizient und zufriedenstellend bestimmte Nutzende bestimmte Ziele in einem bestimmten Kontext erreichen', 'Wie schnell eine App lädt', 'Wie viele Funktionen eine App hat'], 1, 'Effektivität, Effizienz und Zufriedenheit, immer bezogen auf Nutzende, Ziele und Nutzungskontext.'],
  ['Welche Norm beschreibt den menschzentrierten Gestaltungsprozess?', ['ISO 9241-210', 'ISO 9001', 'DIN 16518', 'ISO 27001'], 0, 'Die ISO 9241-210 beschreibt vier Aktivitäten, die iterativ durchlaufen werden: Kontext verstehen, Anforderungen festlegen, Lösungen gestalten, evaluieren.'],
  ['Was unterscheidet formative von summativer Evaluation?', ['Formativ findet während der Entwicklung statt und soll verbessern, summativ bewertet ein Ergebnis', 'Formativ ist quantitativ, summativ qualitativ', 'Formativ braucht keine Nutzenden', 'Es gibt keinen Unterschied'], 0, 'Im Medienprojekt evaluieren Sie vor allem formativ: früh, oft und mit dem Ziel, die App zu verbessern.'],
  ['Wie groß sollte ein Touch-Ziel in iOS mindestens sein?', ['24 × 24 pt', '32 × 32 pt', '44 × 44 pt', '64 × 64 pt'], 2, 'Apple empfiehlt 44 × 44 pt, Google 48 × 48 dp. WCAG 2.2 verlangt auf Stufe AA mindestens 24 × 24 CSS-Pixel.'],
  ['Wo liegen häufig genutzte Aktionen bei einhändiger Bedienung am besten?', ['Oben links', 'Oben rechts', 'Im unteren Bildschirmbereich', 'Egal, Hauptsache groß'], 2, 'Der Daumen erreicht den unteren Bereich am leichtesten. Darum sitzen Tab-Leisten und Hauptaktionen unten.'],
  ['Was prüft eine heuristische Evaluation?', ['Wie viele Personen die App herunterladen', 'Ob die Oberfläche anerkannte Gestaltungsregeln verletzt, beurteilt von Fachleuten', 'Die Ladezeit der App', 'Die Kosten der Entwicklung'], 1, 'Drei bis fünf Fachleute prüfen unabhängig voneinander anhand der zehn Heuristiken nach Nielsen.'],
  ['Wie viele Testpersonen empfiehlt Jakob Nielsen pro Testrunde für qualitative Usability-Tests?', ['1', 'etwa 5', 'mindestens 30', '100'], 1, 'Mit etwa fünf Personen findet man nach Nielsen und Landauer rund 85 % der Probleme, vorausgesetzt die Personen gehören zu einer Zielgruppe. Besser mehrere kleine Runden als eine große.'],
  ['Was ist bei der Methode „Lautes Denken“ wichtig?', ['Die Moderation hilft, sobald jemand zögert', 'Testpersonen sprechen ihre Gedanken aus, die Moderation hält sich zurück', 'Es wird nur die Zeit gemessen', 'Die Testperson liest die Aufgabe nicht'], 1, 'Wer hilft, verfälscht das Ergebnis. Neutrale Nachfragen wie „Was erwarten Sie jetzt?“ sind erlaubt.'],
  ['Welche Testaufgabe ist am besten formuliert?', ['Klicken Sie auf „Warenkorb“.', 'Wie finden Sie das Design?', 'Sie möchten für Samstag zwei Kinokarten für einen Film ab 20 Uhr kaufen.', 'Testen Sie die App.'], 2, 'Ein realistisches Szenario mit Ziel und Ende, ohne die Begriffe der Oberfläche vorwegzunehmen.'],
  ['Wie wird der SUS-Score berechnet?', ['Summe aller Antworten', 'Ungerade Fragen: Antwort − 1, gerade Fragen: 5 − Antwort, Summe × 2,5', 'Mittelwert × 10', 'Anzahl der Zustimmungen × 10'], 1, 'So entsteht ein Wert von 0 bis 100. Er ist kein Prozentwert.'],
  ['Welcher SUS-Score gilt etwa als Durchschnitt?', ['50', '68', '80', '100'], 1, 'Nach Auswertungen von Jeff Sauro liegt der Durchschnitt bei rund 68.'],
  ['Was misst der User Experience Questionnaire (UEQ)?', ['Nur die Ladezeit', 'Pragmatische und hedonische Qualität, z. B. Effizienz, Durchschaubarkeit, Stimulation, Originalität', 'Nur die Fehleranzahl', 'Den Umsatz'], 1, 'Der UEQ hat 26 Gegensatzpaare in sechs Skalen und erfasst auch, wie anregend und originell ein Produkt wirkt.'],
  ['Welcher Schweregrad nach Nielsen gilt für ein Problem, das die Kernaufgabe für die meisten verhindert?', ['1 – kosmetisch', '2 – gering', '3 – schwerwiegend', '4 – katastrophal'], 3, 'Katastrophale Probleme müssen vor einer Veröffentlichung behoben werden.'],
  ['Was müssen Sie tun, bevor Sie einen Test mit Bildschirm- und Tonaufnahme durchführen?', ['Nichts, es sind ja nur Kommilitoninnen', 'Eine informierte, freiwillige Einwilligung einholen und über Zweck, Speicherung und Löschung aufklären', 'Die Aufnahme heimlich starten, damit sich niemand verstellt', 'Die Aufnahmen öffentlich teilen'], 1, 'Aufnahmen sind personenbezogene Daten im Sinne der DSGVO. Ohne Einwilligung keine Aufnahme.'],
  ['Seit wann gilt das Barrierefreiheitsstärkungsgesetz (BFSG) in Deutschland?', ['Seit 2002', 'Seit 28. Juni 2025', 'Ab 2030', 'Es gilt nur für Behörden'], 1, 'Es setzt den European Accessibility Act um und gilt u. a. für E-Commerce und viele Apps privater Anbieter.']
];

/* ================================================================
   Literatur
   ================================================================ */
const LIT = [
  ['1993', 'Usability Engineering', 'Jakob Nielsen', 'San Diego: Academic Press', 'Grundlagenwerk mit Discount-Usability, heuristischer Evaluation und Schweregraden.'],
  ['1993', 'A Mathematical Model of the Finding of Usability Problems', 'Jakob Nielsen, Thomas K. Landauer', 'Proceedings INTERCHI ’93, ACM', 'Herkunft der Faustregel, dass etwa fünf Personen pro Testrunde genügen.'],
  ['1996', 'SUS – A Quick and Dirty Usability Scale', 'John Brooke', 'In: Usability Evaluation in Industry, Taylor & Francis', 'Originalveröffentlichung der System Usability Scale.'],
  ['2008', 'Construction and Evaluation of a User Experience Questionnaire', 'Bettina Laugwitz, Theo Held, Martin Schrepp', 'USAB 2008, Springer LNCS 5298', 'Entwicklung des UEQ, frei verfügbar unter ueq-online.org.'],
  ['2009', 'Determining What Individual SUS Scores Mean: Adding an Adjective Rating Scale', 'Aaron Bangor, Philip Kortum, James Miller', 'Journal of Usability Studies 4 (3)', 'Ordnet SUS-Werte Begriffen wie „gut“ oder „ausgezeichnet“ zu.'],
  ['2013', 'How Do Users Really Hold Mobile Devices?', 'Steven Hoober', 'UXmatters', 'Beobachtungsstudie zu Handhaltungen und Daumenreichweite.'],
  ['2010', 'Rocket Surgery Made Easy', 'Steve Krug', 'Berkeley: New Riders', 'Praktische Anleitung für einfache Usability-Tests im Team, mit Testskript und Einwilligungsvorlage.'],
  ['2016', 'Quantifying the User Experience', 'Jeff Sauro, James R. Lewis', '2. Aufl., Cambridge: Morgan Kaufmann', 'Statistik für UX: Erfolgsquoten, Zeiten, SUS-Benchmarks.'],
  ['2016', 'Usability und UX kompakt', 'Michael Richter, Markus Flückiger', '4. Aufl., Berlin: Springer Vieweg', 'Kompakter deutschsprachiger Überblick über Methoden im Projektalltag.'],
  ['Norm', 'DIN EN ISO 9241-210: Menschzentrierte Gestaltung interaktiver Systeme', 'ISO', 'Ausgabe 2019/2020', 'Prozess mit den vier Aktivitäten Kontext, Anforderungen, Gestaltung, Evaluation.'],
  ['Norm', 'Web Content Accessibility Guidelines (WCAG) 2.2', 'W3C', 'w3.org/TR/WCAG22 · 2023', 'Erfolgskriterien zu Kontrast, Zielgrößen (2.5.8) und Bedienbarkeit, auch für Apps anwendbar.'],
  ['Online', 'Human Interface Guidelines / Material Design 3', 'Apple / Google', 'developer.apple.com/design · m3.material.io', 'Plattformkonventionen für iOS und Android: Navigation, Zielgrößen, Gesten, Barrierefreiheit.']
];

/* ================================================================
   Stichwortverzeichnis
   ================================================================ */
const GL = [
  ['A/B-Test', 'Messen', 'Zwei Varianten werden zufällig verschiedenen Nutzenden gezeigt und anhand einer Kennzahl verglichen.', 'methoden'],
  ['Affinity Mapping', 'Auswerten', 'Beobachtungen auf Karten notieren und nach Ähnlichkeit gruppieren, um Muster zu finden.', 'auswerten'],
  ['Barrierefreiheitsstärkungsgesetz (BFSG)', 'Barrierefreiheit', 'Deutsches Gesetz zur Umsetzung des European Accessibility Act, gilt seit 28. Juni 2025.', 'zugang'],
  ['Cognitive Walkthrough', 'Methoden', 'Fachleute gehen eine Aufgabe Schritt für Schritt aus Sicht einer neuen Person durch und prüfen, ob jeder Schritt verständlich ist.', 'experten'],
  ['Daumenzone', 'Mobile', 'Bereich des Bildschirms, den der Daumen bei einhändiger Bedienung bequem erreicht.', 'mobile'],
  ['Effektivität', 'Grundlagen', 'Genauigkeit und Vollständigkeit, mit der Nutzende ein Ziel erreichen.', 'messen'],
  ['Effizienz', 'Grundlagen', 'Aufwand im Verhältnis zum Ergebnis, z. B. Zeit oder Anzahl der Schritte.', 'messen'],
  ['Einwilligung', 'Testen', 'Freiwillige, informierte Zustimmung zur Teilnahme und Aufzeichnung, Voraussetzung nach DSGVO.', 'testen'],
  ['Erfolgsquote', 'Messen', 'Anteil der Personen, die eine Aufgabe ohne Hilfe lösen.', 'messen'],
  ['Formative Evaluation', 'Methoden', 'Evaluation während der Entwicklung mit dem Ziel, das Produkt zu verbessern.', 'methoden'],
  ['Heuristik', 'Methoden', 'Bewährte Faustregel für gute Gestaltung, z. B. die zehn Heuristiken nach Nielsen.', 'experten'],
  ['Heuristische Evaluation', 'Methoden', 'Fachleute prüfen eine Oberfläche unabhängig voneinander anhand von Heuristiken.', 'experten'],
  ['Iteration', 'Prozess', 'Wiederholter Durchlauf von Gestalten und Evaluieren, bis die Lösung trägt.', 'prozess'],
  ['Lautes Denken (Thinking Aloud)', 'Testen', 'Testpersonen sprechen während der Nutzung aus, was sie denken, suchen und erwarten.', 'testen'],
  ['Moderierter Test', 'Testen', 'Eine Person leitet den Test an, beobachtet und fragt nach.', 'testen'],
  ['Nutzungskontext', 'Grundlagen', 'Nutzende, Ziele, Aufgaben, Umgebung und Geräte, in denen eine App verwendet wird.', 'nutzende'],
  ['Persona', 'Nutzende', 'Auf Forschung beruhendes Modell einer typischen Nutzungsgruppe mit Zielen und Verhalten.', 'nutzende'],
  ['Pilottest', 'Testen', 'Probedurchlauf des Tests, um Aufgaben, Technik und Zeitplan zu prüfen.', 'testen'],
  ['Prototyp', 'Prozess', 'Vorläufige, testbare Version einer App, vom Papierentwurf bis zum klickbaren Figma-Modell.', 'prozess'],
  ['Remote-Test', 'Testen', 'Test, bei dem Testperson und Moderation an unterschiedlichen Orten sind, z. B. per Videocall.', 'testen'],
  ['Schweregrad', 'Auswerten', 'Einstufung eines Problems nach Häufigkeit, Auswirkung und Wiederkehr, bei Nielsen von 0 bis 4.', 'auswerten'],
  ['Screenreader', 'Barrierefreiheit', 'Software, die Inhalte vorliest, auf Smartphones VoiceOver (iOS) und TalkBack (Android).', 'zugang'],
  ['Summative Evaluation', 'Methoden', 'Abschließende Bewertung eines fertigen Produkts, oft mit Kennzahlen.', 'methoden'],
  ['System Usability Scale (SUS)', 'Messen', 'Fragebogen mit zehn Aussagen, ergibt einen Wert von 0 bis 100.', 'messen'],
  ['Task-Zeit (Time on Task)', 'Messen', 'Zeit, die eine Person für eine Aufgabe braucht.', 'messen'],
  ['Touch-Ziel', 'Mobile', 'Antippbare Fläche eines Bedienelements. iOS: mind. 44 × 44 pt, Android: 48 × 48 dp.', 'mobile'],
  ['UEQ', 'Messen', 'User Experience Questionnaire mit 26 Gegensatzpaaren in sechs Skalen.', 'messen'],
  ['Usability', 'Grundlagen', 'Gebrauchstauglichkeit nach ISO 9241-11: effektiv, effizient und zufriedenstellend.', 'einleitung'],
  ['User Experience (UX)', 'Grundlagen', 'Wahrnehmungen und Reaktionen vor, während und nach der Nutzung (ISO 9241-210).', 'einleitung'],
  ['WCAG', 'Barrierefreiheit', 'Web Content Accessibility Guidelines des W3C, aktuell 2.2, auch für Apps anwendbar.', 'zugang'],
  ['Zufriedenheit', 'Grundlagen', 'Ausmaß, in dem die Nutzung als angenehm erlebt wird und Erwartungen erfüllt.', 'messen']
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


function initLit() {
  $('#lit').innerHTML = LIT.map(([y, t, by, pub, d]) => `<div class="lit-item"><span class="yr">${y}</span><div><h3>${esc(t)}</h3><div class="by">${esc(by)} · ${esc(pub)}</div><p>${esc(d)}</p></div></div>`).join('');
}


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
  initMethoden();
  initMessen();
  initDaumen();
  initHeuristik();
  initAufgaben();
  initSus();
  initSchwere();
  initTestplan();
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
