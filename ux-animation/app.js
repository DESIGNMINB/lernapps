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
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Eigener Präfix, damit sich die Lern-Apps auf derselben Domain nicht in die Quere kommen
const store = {
  get(k, d) { try { const v = localStorage.getItem('an1:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('an1:' + k, JSON.stringify(v)); } catch (e) { /* Speicher nicht verfügbar */ } }
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
   Bewegung: alle Demos laufen über die Web Animations API und
   starten nur durch eine Aktion der Nutzenden.
   ================================================================ */
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const EASE = {
  linear: 'linear',
  in: 'cubic-bezier(0.42, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.58, 1)',
  inout: 'cubic-bezier(0.42, 0, 0.58, 1)',
  std: 'cubic-bezier(0.2, 0, 0, 1)',
  dec: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  acc: 'cubic-bezier(0.3, 0, 0.8, 0.15)'
};
function play(el, frames, opts) {
  for (const a of el.getAnimations()) a.cancel();
  return el.animate(frames, Object.assign({ fill: 'forwards' }, opts));
}
// Feder simulieren: Position von 0 nach 1, ein Wert pro Bild (60 Bilder pro Sekunde)
function springSamples(k, d, m) {
  let x = 0, v = 0; const out = [0]; const dt = 1 / 600;
  for (let i = 1; i <= 2400; i++) {
    const a = (-k * (x - 1) - d * v) / m;
    v += a * dt; x += v * dt;
    if (i % 10 === 0) { out.push(x); if (Math.abs(x - 1) < 0.002 && Math.abs(v) < 0.02) break; }
  }
  out[out.length - 1] = 1;
  return out;
}
// Aus Federwerten Keyframes machen (mit linearem Verlauf zwischen den Stützpunkten)
function springFrames(samples, map) {
  const n = samples.length;
  return samples.map((v, i) => Object.assign(map(v), { offset: i / (n - 1) }));
}
const SPRING_POP = springSamples(320, 14, 1);


/* ================================================================
   Navigation und Seitenstruktur
   ================================================================ */
const ICONS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  einleitung: 'M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2zM22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z',
  zweck: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11.5v1',
  prinzipien: 'M5 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 13c3-8 9-8 11-3M19 10l1.5 4',
  timing: 'M12 7a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM12 11v3l2 2M10 3h4M12 3v4',
  easing: 'M3 20h18M3 20V4M4 19c6 0 6-14 16-14',
  mikro: 'M7 9a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10zM17 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  uebergaenge: 'M3 4h8v16H3zM13 4h8v16h-8zM8 12h8M13 9l3 3-3 3',
  laden: 'M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4',
  zugang: 'M12 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM5 9.5l7 1.5 7-1.5M12 11v4M12 15l-3 5M12 15l3 5',
  umsetzung: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  'ue-easing': 'M3 20h18M3 20V4M4 19c8 0 4-14 16-14M14 14l2 2 4-4',
  'ue-timing': 'M12 6a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM12 9v4h3M9 2h6',
  'ue-zweck': 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  'ue-mikro': 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  'ue-reduce': 'M4 12h16M4 6h16M4 18h10',
  'ue-spec': 'M9 3h6v3H9zM6 5H4v16h16V5h-2M8 11h8M8 15h8M8 19h5',
  quiz: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6',
  literatur: 'M4 4h4v16H4zM10 4h4v16h-4zM16 5l3.5-1 3 15.5-3.5 1z',
  glossar: 'M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12M9 8h6M9 11h4'
};

const PAGES = [
  { id: 'home', t: 'Übersicht' },
  { id: 'einleitung', t: 'Einleitung', sub: 'Warum sich Oberflächen bewegen', group: 'Grundlagen' },
  { id: 'zweck', t: 'Wozu Animation?', sub: 'Sechs Aufgaben von Bewegung' },
  { id: 'prinzipien', t: 'Animationsprinzipien', sub: 'Von Disney zum Interface' },
  { id: 'timing', t: 'Timing und Dauer', sub: 'Wie lange darf es dauern?' },
  { id: 'easing', t: 'Easing und Federn', sub: 'Beschleunigen und Abbremsen' },
  { id: 'mikro', t: 'Mikrointeraktionen', sub: 'Auslöser, Regeln, Rückmeldung', group: 'Gestalten' },
  { id: 'uebergaenge', t: 'Übergänge und Choreografie', sub: 'Räumliche Orientierung' },
  { id: 'laden', t: 'Laden und Wartezeiten', sub: 'Fortschritt und Skeletons' },
  { id: 'zugang', t: 'Barrierefreie Bewegung', sub: 'Reduced Motion und WCAG' },
  { id: 'umsetzung', t: 'Umsetzung und Übergabe', sub: 'Performance, Tools, Spezifikation' },
  { id: 'ue-easing', t: 'Easing zuordnen', sub: 'Die passende Kurve wählen', group: 'Übungen', ex: 1 },
  { id: 'ue-timing', t: 'Dauer einstellen', sub: 'Fünf Animationen richtig timen', ex: 2 },
  { id: 'ue-zweck', t: 'Sinnvoll oder Deko?', sub: 'Den Zweck einer Animation erkennen', ex: 3 },
  { id: 'ue-mikro', t: 'Mikrointeraktion zerlegen', sub: 'Pull to Refresh nach Saffer', ex: 4 },
  { id: 'ue-reduce', t: 'Reduced-Motion-Check', sub: 'Bewegung barrierefrei anpassen', ex: 5 },
  { id: 'ue-spec', t: 'Motion-Spezifikation', sub: 'Für Ihr eigenes Projekt', ex: 6 },
  { id: 'quiz', t: 'Wissenstest', sub: '15 Fragen', group: 'Wissen' },
  { id: 'literatur', t: 'Literatur', sub: 'Weiterführende Quellen' },
  { id: 'glossar', t: 'Stichwortverzeichnis', sub: 'Begriffe von A–Z' }
];
const EX_IDS = PAGES.filter((p) => p.ex).map((p) => p.id);
const pageById = (id) => PAGES.find((p) => p.id === id);
const CHAPTERS = PAGES.filter((p) => !p.ex && !['home', 'quiz', 'literatur', 'glossar'].includes(p.id));

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
  $('#tiles-theory').innerHTML = CHAPTERS.map((p, i) => mk(p, String(i + 1).padStart(2, '0'))).join('');
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
const leaveHooks = [];
function show(id, focus = false) {
  if (!pageById(id)) return false;
  for (const f of leaveHooks) f(id);
  for (const p of $$('.page')) p.classList.toggle('active', p.dataset.page === id);
  for (const a of $$('[data-nav]')) {
    if (a.dataset.nav === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
  $('#app').classList.remove('nav-open');
  $('#menu-btn').setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
  document.title = (id === 'home' ? '' : pageById(id).t + ' · ') + 'UX & Animation Lernmodul';
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
function onGroup(root, fn) {
  root.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b || !root.contains(b)) return; pressGroup(root, b); fn(b); });
}


/* ================================================================
   Startseite: Video mit Pause-Knopf (WCAG 2.2.2), Hinweise
   ================================================================ */
function initHero() {
  const v = $('#hero-video'), b = $('#hero-video-btn');
  const setBtn = (playing) => {
    b.setAttribute('aria-pressed', String(playing));
    b.innerHTML = playing
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg><span>Video anhalten</span>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span>Video abspielen</span>';
  };
  b.addEventListener('click', () => { if (v.paused) { v.play().catch(() => {}); setBtn(true); } else { v.pause(); setBtn(false); } });
  v.addEventListener('pause', () => setBtn(false));
  v.addEventListener('play', () => setBtn(true));
  // Automatisch nur ohne „reduzierte Bewegung“ und nur auf der Startseite
  pageHooks.home = () => { if (!RM.matches && store.get('video-off', false) !== true) v.play().catch(() => {}); };
  b.addEventListener('click', () => store.set('video-off', v.paused));
  leaveHooks.push(() => { if (!v.paused) v.pause(); });
  const notes = () => { for (const n of $$('[data-rm-note]')) n.hidden = !RM.matches; };
  notes(); RM.addEventListener('change', notes);
}


/* ================================================================
   Kapitel 01: Einkaufsliste mit und ohne Animation (FLIP)
   ================================================================ */
function initIntro() {
  const list = $('#intro-list');
  const extra = ['Kaffee', 'Nudeln', 'Bananen', 'Joghurt', 'Paprika', 'Käse', 'Reis', 'Zitronen', 'Haferflocken', 'Gurke'];
  let items = ['Hafermilch', 'Äpfel', 'Brot', 'Tomaten'], k = 0, animOn = true;
  const li = (t) => { const el = document.createElement('li'); el.innerHTML = `<span>${esc(t)}</span><button type="button" aria-label="${esc(t)} löschen">×</button>`; el.dataset.t = t; return el; };
  for (const t of items) list.append(li(t));
  const rects = () => new Map($$('li', list).map((el) => [el, el.getBoundingClientRect()]));
  const flip = (before) => {
    for (const el of $$('li', list)) {
      const a = before.get(el); if (!a) continue;
      const b = el.getBoundingClientRect(), dy = a.top - b.top;
      if (dy) play(el, [{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 260, easing: EASE.std });
    }
  };
  onGroup($('[data-intro-anim="1"]').parentElement, (b) => { animOn = b.dataset.introAnim === '1'; });
  $('#intro-add').addEventListener('click', () => {
    if ($$('li', list).length >= 7) { toast('Die Liste ist voll. Löschen Sie zuerst einen Eintrag.'); return; }
    const t = extra[k++ % extra.length];
    const before = rects(), el = li(t);
    list.prepend(el);
    if (!animOn) return;
    flip(before);
    play(el, [{ opacity: 0, transform: 'translateY(-14px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: EASE.dec });
  });
  list.addEventListener('click', async (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const el = b.closest('li'), next = el.nextElementSibling || el.previousElementSibling;
    if (animOn) {
      el.style.pointerEvents = 'none';
      await play(el, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.92)' }], { duration: 160, easing: EASE.acc }).finished.catch(() => {});
      const before = rects(); el.remove(); flip(before);
    } else el.remove();
    const f = next && next.isConnected ? $('button', next) : $('#intro-add'); f.focus();
  });
}


/* ================================================================
   Kapitel 02: sechs Aufgaben von Bewegung
   ================================================================ */
const PURPOSE = [
  ['Rückmeldung', 'Zeigt sofort, dass ein Tipp angekommen ist.', '<span class="m-btn">Senden</span>', (m) => play($('.m-btn', m), [{ transform: 'scale(1)' }, { transform: 'scale(.92)', offset: .35 }, { transform: 'scale(1)' }], { duration: 220, easing: EASE.std })],
  ['Zustandswechsel', 'Macht sichtbar, dass sich etwas von A nach B geändert hat.', '<span class="m-sw"><i></i></span>', (m, s) => { s.on = !s.on; const sw = $('.m-sw', m); play($('i', sw), [{ transform: `translateX(${s.on ? 0 : 24}px)` }, { transform: `translateX(${s.on ? 24 : 0}px)` }], { duration: 180, easing: EASE.std }); play(sw, [{ backgroundColor: s.on ? '#9CA3AF' : '#15803D' }, { backgroundColor: s.on ? '#15803D' : '#9CA3AF' }], { duration: 180 }); }],
  ['Orientierung', 'Zeigt, wohin man navigiert: Der neue Screen kommt von rechts, also geht es tiefer hinein.', '<span class="m-card" style="width:70px;height:96px;left:calc(50% - 35px);border-radius:8px;opacity:.35"></span><span class="m-card m-new" style="width:70px;height:96px;left:calc(50% - 35px);border-radius:8px;background:var(--an-cta)"></span>', (m) => { play($('.m-new', m), [{ transform: 'translateX(150px)' }, { transform: 'none' }], { duration: 320, easing: EASE.dec }); }],
  ['Aufmerksamkeit', 'Lenkt den Blick einmal auf etwas Neues, ohne Dauerschleife.', '<span class="m-badge"><b>3</b></span>', (m) => play($('b', m), [{ transform: 'scale(0)' }, { transform: 'scale(1.35)', offset: .45 }, { transform: 'scale(.9)', offset: .7 }, { transform: 'scale(1)' }], { duration: 520, easing: EASE.out })],
  ['Zusammenhang', 'Zeigt, woher etwas kommt: Das Menü wächst aus seinem Button heraus.', '<span class="m-btn" style="position:absolute;top:12px;right:12px;padding:6px 10px">⋯</span><span class="m-card m-menu" style="top:46px;right:12px;width:110px;height:64px;transform-origin:100% 0;transform:scale(0)"></span>', (m, s) => { s.on = !s.on; play($('.m-menu', m), s.on ? [{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }] : [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.3)', opacity: 0 }], { duration: s.on ? 220 : 150, easing: s.on ? EASE.dec : EASE.acc }); }],
  ['Persönlichkeit', 'Gibt der Marke Charakter. Sparsam, kurz und abschaltbar einsetzen.', '<span class="m-logo">AN</span>', (m) => play($('.m-logo', m), [{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-10deg) scale(.95)', offset: .25 }, { transform: 'rotate(8deg) scale(1.08)', offset: .6 }, { transform: 'rotate(0) scale(1)' }], { duration: 600, easing: EASE.inout })]
];
function initZweck() {
  const root = $('#d-zweck');
  root.innerHTML = PURPOSE.map(([t, d, html], i) => `<div class="an-pcard"><div class="an-mini" aria-hidden="true" data-pm="${i}">${html}</div><h3>${esc(t)}</h3><p>${esc(d)}</p><button type="button" class="btn btn-sm" data-pp="${i}">Abspielen<span class="visually-hidden">: ${esc(t)}</span></button></div>`).join('');
  const st = PURPOSE.map(() => ({}));
  root.addEventListener('click', (e) => { const b = e.target.closest('[data-pp]'); if (!b) return; const i = +b.dataset.pp; PURPOSE[i][3]($(`[data-pm="${i}"]`, root), st[i]); });
}


/* ================================================================
   Kapitel 03: die zwölf Prinzipien in Beispielen.
   Je ein Beispiel zur Funktionsweise und eines aus einer mobilen App.
   Ruhezustand ist immer das Endbild; jede Animation beschreibt ihren
   Anfang ausdrücklich und startet nur auf Klick.
   ================================================================ */
const pa = (el, kf, o) => el.animate(kf, Object.assign({ fill: 'forwards' }, o));
const cssv = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const PHN = (inner) => `<div class="an-mph"><div class="an-mph-scr">${inner}</div></div>`;
const PIC = {
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.8c0 5.5-7.5 10.1-7.5 10.1z"/></svg>',
  cart: '<svg viewBox="0 0 24 24"><path d="M3 4h2l2.2 10.5h10.6L20 7H6.3"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg>',
  send: '<svg viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-2.5-6.5z"/></svg>',
  check: '<svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="23"/><path d="M15 27l7 7 15-16" pathLength="30"/></svg>'
};
const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
const PRINC = [
  {
    t: 'Stauchen und Strecken', en: 'Squash and Stretch',
    f: {
      d: 'Im Fall streckt sich der Ball, beim Aufprall staucht er sich. Das Volumen bleibt gleich: Wird er flacher, wird er zugleich breiter.',
      html: '<div class="fl"></div><div class="pb" style="left:calc(50% - 16px);transform:translateY(160px)"></div>',
      run: (s) => [pa($('.pb', s), [
        { transform: 'translateY(24px) scale(1, 1)', easing: EASE.in },
        { transform: 'translateY(150px) scale(.84, 1.2)', offset: .3 },
        { transform: 'translateY(160px) scale(1.4, .62)', offset: .36, easing: EASE.out },
        { transform: 'translateY(140px) scale(.86, 1.16)', offset: .42, easing: EASE.out },
        { transform: 'translateY(70px) scale(1, 1)', offset: .6, easing: EASE.in },
        { transform: 'translateY(152px) scale(.92, 1.08)', offset: .76 },
        { transform: 'translateY(160px) scale(1.18, .82)', offset: .81, easing: EASE.out },
        { transform: 'translateY(160px) scale(1, 1)', offset: .9 },
        { transform: 'translateY(160px) scale(1, 1)' }
      ], { duration: 1400 })]
    },
    a: {
      d: 'Like-Button: Beim Tippen staucht sich das Herz kurz und streckt sich beim Füllen. Die Verformung macht den Tipp fühlbar.',
      html: PHN(`<div class="bar">Feed</div><div class="post"><div class="img"></div><div class="act"><span class="hrt">${PIC.heart}</span><b class="cnt">129</b></div></div><i class="row"></i><i class="row s"></i>`),
      run: (s) => {
        const c = $('.cnt', s); c.textContent = '128'; setTimeout(() => { c.textContent = '129'; }, 160);
        return [
          pa($('.hrt', s), [{ transform: 'scale(1)' }, { transform: 'scale(1.3, .7)', offset: .22 }, { transform: 'scale(.8, 1.3)', offset: .5 }, { transform: 'scale(1.08, .94)', offset: .74 }, { transform: 'scale(1)' }], { duration: 650, easing: EASE.out }),
          pa($('.hrt svg', s), [{ color: cssv('--muted') }, { color: '#E11D48' }], { duration: 160, delay: 140 }),
          pa($('.hrt path', s), [{ fillOpacity: 0 }, { fillOpacity: 1 }], { duration: 160, delay: 140 })
        ];
      }
    }
  },
  {
    t: 'Vorbereitung', en: 'Anticipation',
    f: {
      d: 'Bevor der Block losschießt, holt er aus: Er weicht kurz zurück und duckt sich. So sieht man die Bewegung kommen, bevor sie passiert.',
      html: '<div class="fl"></div><div class="pbx" style="right:24px"></div>',
      run: (s) => {
        const d = s.clientWidth - 88;
        return [pa($('.pbx', s), [
          { transform: `translateX(${-d}px) scale(1, 1)`, easing: EASE.inout },
          { transform: `translateX(${-d - 18}px) scale(1.16, .8)`, offset: .45, easing: 'cubic-bezier(.3, 0, .1, 1)' },
          { transform: 'translateX(0) scale(1, 1)', offset: .78 },
          { transform: 'translateX(0) scale(1, 1)' }
        ], { duration: 1300 })];
      }
    },
    a: {
      d: 'Pull-to-Refresh: Man zieht die Liste nach unten, der Pfeil dreht sich als Ankündigung. Erst nach dem Loslassen wird neu geladen.',
      html: PHN('<div class="bar">Neuigkeiten</div><span class="ptr">↓</span><div class="cw"><i class="row new"></i><i class="row"></i><i class="row s"></i><i class="row"></i><i class="row s"></i></div>'),
      run: (s) => {
        const p = $('.ptr', s); p.textContent = '↓'; setTimeout(() => { p.textContent = '↻'; }, 860);
        return [
          pa($('.cw', s), [{ transform: 'translateY(0)', easing: EASE.out }, { transform: 'translateY(44px)', offset: .3 }, { transform: 'translateY(44px)', offset: .72, easing: EASE.std }, { transform: 'translateY(0)', offset: .86 }, { transform: 'translateY(0)' }], { duration: 2400 }),
          pa(p, [{ transform: 'translateY(-30px) rotate(0)', opacity: 0 }, { transform: 'translateY(12px) rotate(0)', opacity: 1, offset: .26 }, { transform: 'translateY(12px) rotate(180deg)', opacity: 1, offset: .34 }, { transform: 'translateY(12px) rotate(900deg)', opacity: 1, offset: .72 }, { transform: 'translateY(-30px) rotate(900deg)', opacity: 0, offset: .86 }, { transform: 'translateY(-30px) rotate(900deg)', opacity: 0 }], { duration: 2400 }),
          pa($('.row.new', s), [{ opacity: 0 }, { opacity: 0, offset: .84 }, { opacity: 1 }], { duration: 2400 })
        ];
      }
    }
  },
  {
    t: 'Inszenierung', en: 'Staging',
    f: {
      d: 'Eine Handlung zur Zeit: Alles andere tritt zurück, nur das Wichtige wächst und bekommt Farbe. So weiß das Auge sofort, wohin es schauen soll.',
      html: '<div class="stg"><i></i><i></i><i class="on"></i><i></i><i></i></div>',
      run: (s) => [
        ...$$('.stg i:not(.on)', s).map((el) => pa(el, [{ opacity: 1, transform: 'scale(1)' }, { opacity: .2, transform: 'scale(.85)' }], { duration: 450, delay: 150, easing: EASE.std })),
        pa($('.stg .on', s), [{ transform: 'translateY(0) scale(1)', background: cssv('--an-purple') }, { transform: 'translateY(-10px) scale(1.6)', background: '#CC4E00' }], { duration: 550, delay: 300, easing: EASE.dec })
      ]
    },
    a: {
      d: 'Bottom Sheet: Der Hintergrund wird abgedunkelt, das Blatt fährt von unten herein. Die Aufmerksamkeit liegt allein auf der neuen Aufgabe.',
      html: PHN('<div class="bar">Fotos</div><div class="grid"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="scrim"></div><div class="sheet"><b class="hdl"></b><i class="row"></i><i class="row s"></i><span class="sbtn">Teilen</span></div>'),
      run: (s) => [
        pa($('.scrim', s), [{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: EASE.std }),
        pa($('.sheet', s), [{ transform: 'translateY(105%)' }, { transform: 'translateY(0)' }], { duration: 400, delay: 60, easing: EASE.dec })
      ]
    }
  },
  {
    t: 'Durchanimieren und Schlüsselposen', en: 'Straight Ahead and Pose to Pose',
    f: {
      d: 'Oben: erst die Schlüsselposen (gestrichelt), dann die Zwischenbilder, planbar und präzise. Unten: Bild für Bild weitergezeichnet, lebendiger, aber schwerer zu steuern.',
      html: '<div class="lane"><span class="lb">Schlüsselposen</span><i class="gh" style="left:8%;top:62%"></i><i class="gh" style="left:46%;top:26%"></i><i class="gh" style="left:84%;top:62%"></i><b class="dt" style="left:84%;top:62%"></b></div><div class="lane"><span class="lb">Durchanimiert</span><b class="dt" style="left:84%;top:62%"></b></div>',
      run: (s) => {
        const [a, b] = $$('.dt', s), N = 24;
        const fr = Array.from({ length: N + 1 }, (_, i) => {
          const p = i / N, j = i === N ? 0 : (rnd(i) - .5) * 14;
          return { left: (8 + 76 * p + (i === N ? 0 : (rnd(i + 7) - .5) * 5)).toFixed(1) + '%', top: (62 - 34 * Math.sin(Math.PI * p) + j).toFixed(1) + '%' };
        });
        return [
          pa(a, [{ left: '8%', top: '62%', easing: EASE.inout }, { left: '46%', top: '26%', offset: .5, easing: EASE.inout }, { left: '84%', top: '62%' }], { duration: 1600 }),
          pa(b, fr, { duration: 1600, easing: 'linear' })
        ];
      }
    },
    a: {
      d: 'Oben fest definierte Keyframes (wie in Lottie oder CSS): Start, Ziel, Dauer. Unten eine Feder, die die Bewegung Schritt für Schritt aus der Physik berechnet.',
      html: PHN('<div class="bar">Hinweise</div><div class="kv"><span class="cap">Keyframes, 400 ms</span><div class="nt"></div><span class="cap">Feder (Physik)</span><div class="nt sp"></div></div>'),
      run: (s) => {
        const sm = springSamples(170, 11, 1);
        return [
          pa($('.nt', s), [{ transform: 'translateX(130%)' }, { transform: 'translateX(0)' }], { duration: 400, easing: EASE.dec }),
          pa($('.nt.sp', s), springFrames(sm, (x) => ({ transform: `translateX(${((1 - x) * 130).toFixed(1)}%)` })), { duration: Math.round((sm.length - 1) * 1000 / 60), easing: 'linear' })
        ];
      }
    }
  },
  {
    t: 'Nachschwingen und Überlappen', en: 'Follow Through and Overlapping Action',
    f: {
      d: 'Der Körper hält an, die Antenne nicht: Sie hängt beim Start nach, schwingt über das Ziel hinaus und pendelt sich ein. Teile kommen nacheinander zur Ruhe.',
      html: '<div class="fl"></div><div class="fb" style="right:36px"><b class="ant"></b></div>',
      run: (s) => {
        const d = s.clientWidth - 110;
        return [
          pa($('.fb', s), [{ transform: `translateX(${-d}px)`, easing: EASE.dec }, { transform: 'translateX(0)', offset: .45 }, { transform: 'translateX(0)' }], { duration: 1700 }),
          pa($('.ant', s), [{ transform: 'rotate(0)' }, { transform: 'rotate(-32deg)', offset: .15 }, { transform: 'rotate(-24deg)', offset: .4 }, { transform: 'rotate(30deg)', offset: .55 }, { transform: 'rotate(-16deg)', offset: .68 }, { transform: 'rotate(9deg)', offset: .8 }, { transform: 'rotate(-4deg)', offset: .9 }, { transform: 'rotate(0)' }], { duration: 1700, easing: EASE.inout })
        ];
      }
    },
    a: {
      d: 'Overscroll-Bounce: Wird die Liste schwungvoll nach oben gescrollt, schießt sie am Listenanfang etwas über den Rand hinaus und federt zurück.',
      html: PHN('<div class="bar">Chats</div><div class="cw"><i class="row"></i><i class="row s"></i><i class="row"></i><i class="row s"></i><i class="row"></i><i class="row s"></i></div>'),
      run: (s) => [pa($('.cw', s), [
        { transform: 'translateY(-90px)', easing: EASE.out }, { transform: 'translateY(26px)', offset: .45, easing: EASE.inout }, { transform: 'translateY(-6px)', offset: .7, easing: EASE.inout }, { transform: 'translateY(0)', offset: .88 }, { transform: 'translateY(0)' }
      ], { duration: 1300 })]
    }
  },
  {
    t: 'Beschleunigen und Abbremsen', en: 'Slow In and Slow Out',
    f: {
      d: 'Die blassen Punkte zeigen, wo das Objekt nach gleichen Zeitabständen ist. Oben gleichmäßig (linear), unten dicht am Anfang und Ende: Es beschleunigt und bremst.',
      html: (() => {
        const io = (p) => (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
        const lane = (lb, f) => `<div class="lane"><span class="lb">${lb}</span>${Array.from({ length: 9 }, (_, i) => `<i class="tk" style="left:${(8 + 80 * f(i / 8)).toFixed(1)}%"></i>`).join('')}<b class="dt" style="left:88%;top:60%"></b></div>`;
        return lane('Linear', (p) => p) + lane('Ease-in-out', io);
      })(),
      run: (s) => {
        const [a, b] = $$('.dt', s);
        return [pa(a, [{ left: '8%' }, { left: '88%' }], { duration: 1400, easing: 'linear' }), pa(b, [{ left: '8%' }, { left: '88%' }], { duration: 1400, easing: EASE.inout })];
      }
    },
    a: {
      d: 'Seitenwechsel: Der neue Screen kommt schnell herein und bremst kurz vor dem Ziel ab (ease-out). Er wirkt flott und landet trotzdem weich.',
      html: PHN('<div class="bar">Rezepte</div><div class="cw"><i class="row"></i><i class="row s"></i><i class="row"></i></div><div class="det"><div class="hero"></div><i class="row"></i><i class="row s"></i></div>'),
      run: (s) => [pa($('.det', s), [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], { duration: 450, easing: EASE.dec })]
    }
  },
  {
    t: 'Bögen', en: 'Arcs',
    f: {
      d: 'Natürliche Bewegungen folgen Bögen, kaum je einer Geraden. Der Ball fliegt auf der gestrichelten Bahn; die blasse Gerade wirkt dagegen mechanisch.',
      html: '<svg class="arc" viewBox="0 0 100 100" preserveAspectRatio="none"><path class="ln" d="M10 82 L90 82"/><path d="M10 82 Q50 -10 90 82"/></svg><b class="dt big" style="left:90%;top:82%"></b>',
      run: (s) => {
        const N = 30, fr = Array.from({ length: N + 1 }, (_, i) => {
          const t = i / N, x = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 50 + t * t * 90, y = (1 - t) * (1 - t) * 82 + 2 * (1 - t) * t * -10 + t * t * 82;
          return { left: x.toFixed(2) + '%', top: y.toFixed(2) + '%' };
        });
        return [pa($('.dt', s), fr, { duration: 1300, easing: EASE.inout })];
      }
    },
    a: {
      d: 'In den Warenkorb: Das Produkt fliegt im Bogen zum Symbol oben rechts. Die Bahn verbindet Ursache und Ziel, der Zähler springt auf 1.',
      html: PHN(`<div class="bar">Shop <span class="crt">${PIC.cart}<b class="bdg">1</b></span></div><div class="prod"><div class="pimg"></div><i class="row s"></i><span class="sbtn">In den Warenkorb</span></div><b class="fly"></b>`),
      run: (s) => {
        const scr = $('.an-mph-scr', s).getBoundingClientRect(), a = $('.pimg', s).getBoundingClientRect(), b = $('.crt', s).getBoundingClientRect();
        const x0 = a.left + a.width / 2 - scr.left, y0 = a.top + a.height / 2 - scr.top, x1 = b.left + b.width / 2 - scr.left, y1 = b.top + b.height / 2 - scr.top;
        const cx = x0 - 6, cy = y1 + 4, N = 24;
        const fr = Array.from({ length: N + 1 }, (_, i) => {
          const t = i / N, x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
          return { transform: `translate(${(x - 8).toFixed(1)}px, ${(y - 8).toFixed(1)}px) scale(${(1 - .5 * t).toFixed(2)})`, opacity: i === N ? 0 : 1 };
        });
        return [
          pa($('.fly', s), fr, { duration: 700, easing: 'cubic-bezier(.4, 0, .6, 1)' }),
          pa($('.crt', s), [{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: .4 }, { transform: 'scale(1)' }], { duration: 320, delay: 660, easing: EASE.out }),
          pa($('.bdg', s), [{ transform: 'scale(0)' }, { transform: 'scale(0)', offset: .6 }, { transform: 'scale(1.35)', offset: .82 }, { transform: 'scale(1)' }], { duration: 1000 })
        ];
      }
    }
  },
  {
    t: 'Nebenbewegung', en: 'Secondary Action',
    f: {
      d: 'Die Hauptbewegung ist der Sprung. Die Arme reißen dabei jubelnd nach oben: Diese kleinere Bewegung unterstützt die Hauptbewegung und gibt ihr Ausdruck.',
      html: '<div class="fl"></div><div class="fig"><b class="hd"></b><b class="bd"></b><b class="arm l"></b><b class="arm r"></b></div>',
      run: (s) => [
        pa($('.fig', s), [{ transform: 'translateY(0)', easing: EASE.out }, { transform: 'translateY(-56px)', offset: .45, easing: EASE.in }, { transform: 'translateY(0)', offset: .85 }, { transform: 'translateY(0)' }], { duration: 1100 }),
        pa($('.arm.l', s), [{ transform: 'rotate(25deg)', easing: EASE.out }, { transform: 'rotate(155deg)', offset: .4, easing: EASE.inout }, { transform: 'rotate(25deg)', offset: .95 }, { transform: 'rotate(25deg)' }], { duration: 1100 }),
        pa($('.arm.r', s), [{ transform: 'rotate(-25deg)', easing: EASE.out }, { transform: 'rotate(-155deg)', offset: .4, easing: EASE.inout }, { transform: 'rotate(-25deg)', offset: .95 }, { transform: 'rotate(-25deg)' }], { duration: 1100 })
      ]
    },
    a: {
      d: 'Senden: Die Nachricht steigt in den Verlauf auf (Hauptbewegung). Gleichzeitig fliegt der Papierflieger im Button davon und kehrt zurück (Nebenbewegung).',
      html: PHN(`<div class="bar">Lena</div><div class="chat"><span class="bb in">Kommst du heute?</span><span class="bb out">Ja, um 18 Uhr</span><span class="bb out nw">Bis gleich!</span></div><div class="ib"><span class="inp">Nachricht</span><span class="snd">${PIC.send}</span></div>`),
      run: (s) => {
        const inp = $('.inp', s); inp.textContent = 'Bis gleich!'; inp.classList.add('typed');
        setTimeout(() => { inp.textContent = 'Nachricht'; inp.classList.remove('typed'); }, 140);
        return [
          pa($('.bb.nw', s), [{ transform: 'translateY(40px) scale(.9)', opacity: 0 }, { transform: 'translateY(0) scale(1)', opacity: 1 }], { duration: 380, delay: 100, easing: EASE.dec }),
          pa($('.snd svg', s), [{ transform: 'translate(0, 0)', opacity: 1 }, { transform: 'translate(16px, -16px) rotate(-12deg)', opacity: 0, offset: .45 }, { transform: 'translate(0, 0) scale(.3)', opacity: 0, offset: .55 }, { transform: 'translate(0, 0) scale(1)', opacity: 1 }], { duration: 760, easing: EASE.std })
        ];
      }
    }
  },
  {
    t: 'Timing', en: 'Timing',
    f: {
      d: 'Gleicher Weg, andere Dauer. Schnell wirkt leicht oder hektisch, langsam schwer oder träge. Im Trickfilm ist es die Zahl der Bilder, im Interface die Dauer in Millisekunden.',
      html: ['150 ms', '400 ms', '1000 ms'].map((l) => `<div class="lane sm"><span class="lb">${l}</span><b class="blk"></b></div>`).join(''),
      run: (s) => $$('.blk', s).map((el, i) => pa(el, [{ transform: `translateX(${-(el.parentElement.clientWidth - 58)}px)` }, { transform: 'translateX(0)' }], { duration: [150, 400, 1000][i], easing: EASE.inout }))
    },
    a: {
      d: 'Drei Schalter, drei Dauern. Um 150 bis 250 ms wirkt ein Schalter direkt. 80 ms springt fast, 600 ms zögert spürbar.',
      html: PHN('<div class="bar">Einstellungen</div>' + ['80 ms', '200 ms', '600 ms'].map((l) => `<div class="set"><span>${l}</span><span class="sw"><i></i></span></div>`).join('')),
      run: (s) => $$('.sw', s).flatMap((sw, i) => {
        const d = [80, 200, 600][i];
        return [pa($('i', sw), [{ transform: 'translateX(0)' }, { transform: 'translateX(14px)' }], { duration: d, easing: EASE.std }), pa(sw, [{ backgroundColor: '#9CA3AF' }, { backgroundColor: '#15803D' }], { duration: d })];
      })
    }
  },
  {
    t: 'Übertreibung', en: 'Exaggeration',
    f: {
      d: 'Derselbe Hüpfer, einmal realistisch, einmal überzeichnet: tiefer gestaucht, höher gesprungen, stärker gestreckt. Übertreibung macht eine Absicht unmissverständlich.',
      html: '<div class="lane"><span class="lb">Realistisch</span><b class="hb"></b></div><div class="lane"><span class="lb">Übertrieben</span><b class="hb"></b></div>',
      run: (s) => {
        const [a, b] = $$('.hb', s);
        return [
          pa(a, [{ transform: 'translateY(0) scale(1, 1)' }, { transform: 'translateY(0) scale(1.06, .94)', offset: .14, easing: EASE.out }, { transform: 'translateY(-24px) scale(.97, 1.03)', offset: .45, easing: EASE.in }, { transform: 'translateY(0) scale(1.06, .94)', offset: .8 }, { transform: 'translateY(0) scale(1, 1)' }], { duration: 1100 }),
          pa(b, [{ transform: 'translateY(0) scale(1, 1)' }, { transform: 'translateY(0) scale(1.4, .6)', offset: .16, easing: EASE.out }, { transform: 'translateY(-56px) scale(.75, 1.35)', offset: .38 }, { transform: 'translateY(-62px) scale(1, 1)', offset: .48, easing: EASE.in }, { transform: 'translateY(0) scale(.8, 1.25)', offset: .78 }, { transform: 'translateY(0) scale(1.4, .6)', offset: .85, easing: EASE.out }, { transform: 'translateY(0) scale(1, 1)' }], { duration: 1100 })
        ];
      }
    },
    a: {
      d: 'Falsches Passwort: Das Formular schüttelt sich kurz wie ein Kopfschütteln, das Feld färbt sich rot. Sparsam einsetzen und immer mit einer Fehlermeldung als Text.',
      html: PHN('<div class="bar">Anmelden</div><div class="lg"><span class="fld">anna@mail.de</span><span class="fld pw">••••••</span><span class="err">Passwort stimmt nicht.</span><span class="sbtn">Anmelden</span></div>'),
      run: (s) => [
        pa($('.sbtn', s), [{ transform: 'scale(1)' }, { transform: 'scale(.94)', offset: .4 }, { transform: 'scale(1)' }], { duration: 180 }),
        pa($('.lg', s), [{ transform: 'translateX(0)' }, { transform: 'translateX(-9px)', offset: .15 }, { transform: 'translateX(9px)', offset: .3 }, { transform: 'translateX(-7px)', offset: .45 }, { transform: 'translateX(7px)', offset: .6 }, { transform: 'translateX(-3px)', offset: .78 }, { transform: 'translateX(0)' }], { duration: 480, delay: 180, easing: 'linear' }),
        pa($('.pw', s), [{ borderColor: cssv('--line') }, { borderColor: '#C3301A' }], { duration: 200, delay: 180 }),
        pa($('.err', s), [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 220, delay: 380, easing: EASE.dec })
      ]
    }
  },
  {
    t: 'Räumliches Zeichnen', en: 'Solid Drawing',
    f: {
      d: 'Der Würfel dreht sich und bleibt dabei glaubwürdig ein Körper: Flächen, Licht und Schatten passen in jeder Ansicht zusammen. Das Prinzip verlangt Volumen, Gewicht und Perspektive.',
      html: '<div class="cube-w"><div class="cube"><b class="fr"></b><b class="bk"></b><b class="rt"></b><b class="lf"></b><b class="tp"></b></div><i class="shd"></i></div>',
      run: (s) => [pa($('.cube', s), [{ transform: 'rotateX(-24deg) rotateY(-35deg)' }, { transform: 'rotateX(-24deg) rotateY(325deg)' }], { duration: 2600, easing: EASE.inout })]
    },
    a: {
      d: 'Karte umdrehen: Sie dreht sich im Raum, hebt sich dabei leicht an und zeigt ihre Rückseite. Ein schlüssiges Ebenenmodell lässt die Oberfläche greifbar wirken.',
      html: PHN('<div class="bar">Lernkarten</div><div class="flip"><i class="fshd"></i><div class="fin"><div class="ff"><b>Was ist Timing?</b></div><div class="fbk"><i class="row"></i><i class="row s"></i><i class="row"></i></div></div></div>'),
      run: (s) => [
        pa($('.fin', s), [{ transform: 'rotateY(0) scale(1)' }, { transform: 'rotateY(90deg) scale(1.1)', offset: .5 }, { transform: 'rotateY(180deg) scale(1)' }], { duration: 800, easing: EASE.inout }),
        pa($('.fshd', s), [{ opacity: .35, transform: 'scale(1)' }, { opacity: .15, transform: 'scale(1.25)', offset: .5 }, { opacity: .35, transform: 'scale(1)' }], { duration: 800, easing: EASE.inout })
      ]
    }
  },
  {
    t: 'Ausstrahlung', en: 'Appeal',
    f: {
      d: 'Beide kommen an dieselbe Stelle. Oben neutral und linear, unten mit Hüpfer, Verformung und einem Blinzeln. Ausstrahlung heißt: Man schaut gern hin, die Figur hat Charakter.',
      html: '<div class="lane"><span class="lb">Neutral</span><b class="sq"></b></div><div class="lane"><span class="lb">Mit Ausstrahlung</span><b class="blob"><span class="eyes"><i></i><i></i></span></b></div>',
      run: (s) => {
        const d = Math.round(s.clientWidth * .38);
        return [
          pa($('.sq', s), [{ transform: `translateX(${-d}px)` }, { transform: 'translateX(0)' }], { duration: 700, easing: 'linear' }),
          pa($('.blob', s), [{ transform: `translateX(${-d}px) translateY(0) scale(1, 1)`, easing: EASE.out }, { transform: `translateX(${-d / 2}px) translateY(-28px) scale(.9, 1.12)`, offset: .4, easing: EASE.in }, { transform: 'translateX(0) translateY(0) scale(1.22, .8)', offset: .72, easing: EASE.out }, { transform: 'translateX(0) translateY(0) scale(1, 1)', offset: .86 }, { transform: 'translateX(0) translateY(0) scale(1, 1)' }], { duration: 1000 }),
          pa($('.eyes', s), [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1)', offset: .8 }, { transform: 'scaleY(.1)', offset: .87 }, { transform: 'scaleY(1)', offset: .94 }, { transform: 'scaleY(1)' }], { duration: 1500 })
        ];
      }
    },
    a: {
      d: 'Onboarding-Abschluss: Der Kreis federt auf, das Häkchen zeichnet sich, ein paar Punkte sprühen. Eine kurze Mikroanimation mit Charakter, die zur Marke passt.',
      html: PHN(`<div class="done"><span class="ok">${PIC.check}${Array.from({ length: 6 }, () => '<b class="cf"></b>').join('')}</span><b class="ttl">Alles bereit!</b><i class="row s"></i><span class="sbtn">Los geht’s</span></div>`),
      run: (s) => [
        pa($('.ok svg', s), [{ transform: 'scale(0)' }, { transform: 'scale(1.12)', offset: .6 }, { transform: 'scale(1)' }], { duration: 520, easing: EASE.dec }),
        pa($('.ok path', s), [{ strokeDashoffset: 30 }, { strokeDashoffset: 0 }], { duration: 380, delay: 360, easing: EASE.out }),
        pa($('.ttl', s), [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, delay: 520, easing: EASE.dec }),
        ...$$('.cf', s).map((el, i) => { const a = i / 6 * Math.PI * 2 - Math.PI / 2; return pa(el, [{ transform: 'translate(0, 0) scale(1)', opacity: 1 }, { transform: `translate(${(Math.cos(a) * 38).toFixed(1)}px, ${(Math.sin(a) * 38).toFixed(1)}px) scale(.4)`, opacity: 0 }], { duration: 650, delay: 420, easing: EASE.dec }); })
      ]
    }
  }
];
const PR_KIND = { f: 'So funktioniert’s', a: 'In der App' };
function initPrinzipienBeispiele() {
  const root = $('#pr-examples'), live = $('#pr-live');
  if (!root) return;
  root.innerHTML = PRINC.map((p, i) => `<article class="an-pr"><h3><span class="n">${String(i + 1).padStart(2, '0')}</span>${esc(p.t)}${p.en !== p.t ? `<span class="en" lang="en">${esc(p.en)}</span>` : ''}</h3><div class="an-pr-pair">${['f', 'a'].map((k) => `<div class="an-pr-ex"><p class="an-pr-k">${PR_KIND[k]}</p><div class="an-pr-stage${k === 'a' ? ' ph' : ''}" data-st="${i}${k}" aria-hidden="true">${p[k].html}</div><p class="an-pr-d">${esc(p[k].d)}</p><button type="button" class="btn btn-sm" data-prp="${i}${k}">Abspielen<span class="visually-hidden">: ${esc(p.t)}, ${PR_KIND[k]}</span></button></div>`).join('')}</div></article>`).join('');
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-prp]'); if (!b) return;
    const id = b.dataset.prp, p = PRINC[+id.slice(0, -1)], k = id.slice(-1), st = $(`[data-st="${id}"]`, root);
    for (const a of st.getAnimations({ subtree: true })) a.cancel();
    const anims = p[k].run(st);
    live.textContent = `Beispiel läuft: ${p.t}, ${PR_KIND[k]}.`;
    Promise.all(anims.map((a) => a.finished)).then(() => { live.textContent = `Beispiel beendet: ${p.t}. Zu sehen ist jetzt das Endbild.`; }).catch(() => {});
  });
}

/* ================================================================
   Kapitel 03: springender Ball mit Prinzipien
   ================================================================ */
function ballFrames(o, W) {
  const G = 140, x0 = 16, x1 = W - 52;
  const xa = o.follow ? x1 - 46 : x1;
  const segs = [];
  if (o.antic) segs.push({ k: 'antic', w: 0.2 });
  segs.push({ k: 'hop', w: 1, xs: x0 - (o.antic ? 10 : 0), xe: xa, h: 112 });
  if (o.follow) segs.push({ k: 'hop', w: 0.38, xs: xa, xe: x1, h: 26 });
  segs.push({ k: 'settle', w: 0.12 });
  const total = segs.reduce((s, g) => s + g.w, 0), N = 90, frames = [];
  const io = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
  for (let i = 0; i <= N; i++) {
    let s = (i / N) * total, g = segs[0];
    for (g of segs) { if (s <= g.w) break; s -= g.w; }
    const p = clamp(s / g.w, 0, 1);
    let x = x0, y = G, sx = 1, sy = 1;
    if (g.k === 'antic') {
      x = x0 - 10 * Math.sin(p * Math.PI / 2);
      if (o.squash) { sy = 1 - 0.28 * p; sx = 1 + 0.22 * p; } else { sy = 1 - 0.08 * p; }
    } else if (g.k === 'hop') {
      const px = o.slow ? io(p) : p;
      x = g.xs + (g.xe - g.xs) * px;
      y = o.arc ? G - 4 * g.h * p * (1 - p) : G - g.h * (1 - Math.abs(2 * p - 1));
      if (o.squash) {
        if (p < 0.04 || p > 0.96) { sx = 1.28; sy = 0.72; }
        else { const st = 1 + 0.2 * Math.abs(1 - 2 * p); sy = st; sx = 1 / st; }
      }
    } else {
      x = x1;
      if (o.squash) { sx = 1.28 - 0.28 * p; sy = 0.72 + 0.28 * p; }
    }
    frames.push({ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`, offset: i / N });
  }
  return { frames, dur: Math.round(1500 * total / 1.32) };
}
function initBall() {
  const ball = $('#ball'), stage = $('#ball-stage'), box = $('#ball-opts');
  const opts = () => Object.fromEntries($$('input', box).map((c) => [c.value, c.checked]));
  const reset = () => play(ball, [{ transform: 'translate(16px, 140px)' }], { duration: 1 });
  reset();
  $('#ball-play').addEventListener('click', () => { const { frames, dur } = ballFrames(opts(), stage.clientWidth); play(ball, frames, { duration: dur, easing: 'linear' }); });
  $('#ball-all').addEventListener('click', () => { for (const c of $$('input', box)) c.checked = true; });
  $('#ball-none').addEventListener('click', () => { for (const c of $$('input', box)) c.checked = false; });
  box.addEventListener('change', reset);
}


/* ================================================================
   Kapitel 04: Dauern im Vergleich
   ================================================================ */
function initRace() {
  const lanes = [[100, 'wirkt hektisch'], [300, 'angenehm'], [800, 'wirkt zäh'], [null, 'Ihre Dauer']];
  $('#race').innerHTML = lanes.map(([ms, l], i) => `<div class="an-lane${ms ? '' : ' is-own'}"><span class="lbl"><b data-rl="${i}">${ms ? ms + ' ms' : '450 ms'}</b>${esc(l)}</span><div class="rail" aria-hidden="true"><i data-rc="${i}"></i></div></div>`).join('');
  const r = $('#race-dur'), out = $('#race-out');
  const upd = () => { out.textContent = r.value + ' ms'; $('[data-rl="3"]').textContent = r.value + ' ms'; };
  r.addEventListener('input', upd); upd();
  $('#race-play').addEventListener('click', () => {
    const d = $('.rail', $('#race')).clientWidth - 62;
    lanes.forEach(([ms], i) => play($(`[data-rc="${i}"]`), [{ transform: 'translateX(0)' }, { transform: `translateX(${d}px)` }], { duration: Math.max(1, ms || +r.value), easing: EASE.std }));
  });
}


/* ================================================================
   Kapitel 05: Easing-Karten, Kurven-Editor, Feder
   ================================================================ */
const BEZ = { linear: [0, 0, 1, 1], in: [0.42, 0, 1, 1], out: [0, 0, 0.58, 1], inout: [0.42, 0, 0.58, 1] };
const curvePath = ([a, b, c, d], s = 80, o = 5) => `M${o} ${o + s} C${o + a * s} ${o + s - b * s} ${o + c * s} ${o + s - d * s} ${o + s} ${o}`;
function initEaseCards() {
  const cards = [
    ['linear', 'Linear', 'Gleichmäßig von Anfang bis Ende. Wirkt mechanisch, passt für Fortschritt und Drehung.'],
    ['in', 'Beschleunigen · ease-in', 'Startet langsam, endet schnell. Für Elemente, die den Screen verlassen.'],
    ['out', 'Abbremsen · ease-out', 'Startet schnell, kommt sanft an. Für Elemente, die hereinkommen.'],
    ['inout', 'Beides · ease-in-out', 'Langsam, schnell, langsam. Für Bewegungen innerhalb des Screens.']
  ];
  $('#ease-cards').innerHTML = cards.map(([k, t, d]) => `<div class="card"><svg viewBox="0 0 90 90" aria-hidden="true"><rect x="5" y="5" width="80" height="80" fill="none" stroke="var(--line)"/><path d="${curvePath(BEZ[k])}" fill="none" stroke="var(--an-cta)" stroke-width="3"/></svg><div><h3>${esc(t)}</h3><p class="muted">${esc(d)}</p><button type="button" class="btn btn-sm" data-ec="${k}">Abspielen<span class="visually-hidden">: ${esc(t)}</span></button></div><div class="an-track" aria-hidden="true"><div class="an-dot" data-ed="${k}"></div></div></div>`).join('');
  $('#ease-cards').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ec]'); if (!b) return;
    const dot = $(`[data-ed="${b.dataset.ec}"]`), d = dot.parentElement.clientWidth - 34;
    play(dot, [{ transform: 'translateX(0)' }, { transform: `translateX(${d}px)` }], { duration: 900, easing: EASE[b.dataset.ec] });
  });
}

function initBezier() {
  const svg = $('#bez-svg'), XS = 240, YS = 200, Y0 = 320;
  const P = (x, y) => [x * XS, Y0 - y * YS];
  const presets = [
    ['Linear', [0, 0, 1, 1]], ['ease', [0.25, 0.1, 0.25, 1]], ['ease-in', BEZ.in], ['ease-out', BEZ.out], ['ease-in-out', BEZ.inout],
    ['M3 Standard', [0.2, 0, 0, 1]], ['M3 Decelerate', [0.05, 0.7, 0.1, 1]], ['Überschwingen', [0.34, 1.56, 0.64, 1]]
  ];
  let v = store.get('bez', [0.2, 0, 0, 1]);
  $('#bez-presets').innerHTML = presets.map(([n], i) => `<button type="button" class="chip" data-bp="${i}" aria-pressed="false">${esc(n)}</button>`).join('');
  const ins = ['#bz-x1', '#bz-y1', '#bz-x2', '#bz-y2'].map((s) => $(s));
  const css = () => `cubic-bezier(${v.map((n) => +n.toFixed(2)).join(', ')})`;
  const draw = () => {
    const [a, b] = P(0, 0), [c, d] = P(1, 1), [h1x, h1y] = P(v[0], v[1]), [h2x, h2y] = P(v[2], v[3]);
    let grid = '';
    for (let i = 0; i <= 4; i++) { const x = i * XS / 4, y = Y0 - i * YS / 4; grid += `<line x1="${x}" y1="${Y0}" x2="${x}" y2="${Y0 - YS}" stroke="var(--line)"/><line x1="0" y1="${y}" x2="${XS}" y2="${y}" stroke="var(--line)"/>`; }
    svg.innerHTML = `${grid}<rect x="0" y="${Y0 - YS}" width="${XS}" height="${YS}" fill="none" stroke="var(--faint)"/>
      <text x="0" y="${Y0 + 22}" font-size="12" fill="var(--muted)">Zeit →</text><text x="${XS}" y="${Y0 - YS - 10}" font-size="12" text-anchor="end" fill="var(--muted)">↑ Fortschritt</text>
      <line x1="${a}" y1="${b}" x2="${h1x}" y2="${h1y}" stroke="var(--muted)" stroke-dasharray="4 3"/><line x1="${c}" y1="${d}" x2="${h2x}" y2="${h2y}" stroke="var(--muted)" stroke-dasharray="4 3"/>
      <path d="M${a} ${b} C${h1x} ${h1y} ${h2x} ${h2y} ${c} ${d}" fill="none" stroke="var(--an-cta)" stroke-width="4" stroke-linecap="round"/>
      <circle cx="${h1x}" cy="${h1y}" r="11" fill="var(--an-purple)" class="h" data-h="0" tabindex="0" role="img" aria-label="Anfasser 1: x ${fmt(v[0])}, y ${fmt(v[1])}. Mit den Pfeiltasten verschieben."/>
      <circle cx="${h2x}" cy="${h2y}" r="11" fill="var(--an-purple)" class="h" data-h="1" tabindex="0" role="img" aria-label="Anfasser 2: x ${fmt(v[2])}, y ${fmt(v[3])}. Mit den Pfeiltasten verschieben."/>`;
    ins.forEach((el, i) => { if (document.activeElement !== el) el.value = v[i].toFixed(2); });
    $('#bez-code').textContent = `transition: transform ${$('#bez-dur').value}ms ${css()};`;
    for (const b2 of $$('[data-bp]')) b2.setAttribute('aria-pressed', String(presets[+b2.dataset.bp][1].every((n, i) => Math.abs(n - v[i]) < 0.001)));
    store.set('bez', v);
  };
  const set = (h, x, y, refocus) => { v[h * 2] = +clamp(x, 0, 1).toFixed(2); v[h * 2 + 1] = +clamp(y, -0.6, 1.6).toFixed(2); draw(); if (refocus) $(`[data-h="${h}"]`, svg).focus(); };
  let drag = null;
  const toSvg = (e) => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()); return [p.x / XS, (Y0 - p.y) / YS]; };
  svg.addEventListener('pointerdown', (e) => { const h = e.target.closest('[data-h]'); if (!h) return; drag = +h.dataset.h; svg.setPointerCapture(e.pointerId); e.preventDefault(); });
  svg.addEventListener('pointermove', (e) => { if (drag === null) return; const [x, y] = toSvg(e); set(drag, x, y); });
  const end = () => { if (drag !== null) { const h = drag; drag = null; $(`[data-h="${h}"]`, svg).focus({ preventScroll: true }); } };
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
  svg.addEventListener('keydown', (e) => {
    const h = e.target.closest('[data-h]'); if (!h) return;
    const i = +h.dataset.h, st = e.shiftKey ? 0.1 : 0.02;
    const d = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, st], ArrowDown: [0, -st] }[e.key];
    if (!d) return; e.preventDefault(); set(i, v[i * 2] + d[0], v[i * 2 + 1] + d[1], true);
  });
  ins.forEach((el, i) => el.addEventListener('input', () => { const n = parseFloat(el.value.replace(',', '.')); if (isNaN(n)) return; v[i] = i % 2 ? clamp(n, -0.6, 1.6) : clamp(n, 0, 1); draw(); }));
  $('#bez-presets').addEventListener('click', (e) => { const b = e.target.closest('[data-bp]'); if (!b) return; v = presets[+b.dataset.bp][1].slice(); draw(); });
  $('#bez-dur').addEventListener('input', () => { $('#bez-dur-out').textContent = $('#bez-dur').value + ' ms'; draw(); });
  $('#bez-dur-out').textContent = $('#bez-dur').value + ' ms';
  $('#bez-play').addEventListener('click', () => {
    const d = $('#bez-dot').parentElement.clientWidth - 34, dur = +$('#bez-dur').value;
    play($('#bez-dot'), [{ transform: 'translateX(0)' }, { transform: `translateX(${d}px)` }], { duration: dur, easing: css() });
    play($('#bez-lin'), [{ transform: 'translateX(0)' }, { transform: `translateX(${d}px)` }], { duration: dur, easing: 'linear' });
  });
  $('#bez-copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('#bez-code').textContent); toast('CSS in die Zwischenablage kopiert'); } catch (e) { toast('Kopieren nicht möglich'); } });
  draw();
}

function initSpring() {
  const k = $('#sp-k'), d = $('#sp-d'), m = $('#sp-m');
  let samples = [];
  const linearCss = () => {
    const n = Math.min(40, samples.length), pts = [];
    for (let i = 0; i < n; i++) pts.push(+samples[Math.round(i * (samples.length - 1) / (n - 1))].toFixed(3));
    return `transition: transform ${Math.round((samples.length - 1) * 1000 / 60)}ms linear(${pts.join(', ')});`;
  };
  const upd = () => {
    $('#sp-k-out').textContent = k.value; $('#sp-d-out').textContent = d.value; $('#sp-m-out').textContent = fmt(+m.value, 1);
    samples = springSamples(+k.value, +d.value, +m.value);
    const dur = Math.round((samples.length - 1) * 1000 / 60), over = Math.max(0, Math.max(...samples) - 1) * 100;
    const zeta = +d.value / (2 * Math.sqrt(+k.value * +m.value));
    $('#sp-info').innerHTML = `Dauer bis zur Ruhe: <b>ca. ${dur} ms</b> · Überschwingen: <b>${fmt(over, 0)} %</b> · ${zeta < 1 ? 'unterdämpft, die Feder schwingt nach' : zeta < 1.05 ? 'kritisch gedämpft, schnell und ohne Nachschwingen' : 'überdämpft, die Feder kriecht ins Ziel'}`;
    const W = 300, H = 180, lo = Math.min(0, ...samples), hi = Math.max(1.05, ...samples);
    const py = (val) => H - 16 - (val - lo) / (hi - lo) * (H - 32);
    const pts = samples.map((val, i) => `${(i / (samples.length - 1) * (W - 20) + 10).toFixed(1)},${py(val).toFixed(1)}`).join(' ');
    $('#sp-svg').innerHTML = `<line x1="10" x2="${W - 10}" y1="${py(1)}" y2="${py(1)}" stroke="var(--muted)" stroke-dasharray="4 3"/><text x="${W - 12}" y="${py(1) - 6}" font-size="11" text-anchor="end" fill="var(--muted)">Ziel</text><polyline points="${pts}" fill="none" stroke="var(--an-cta)" stroke-width="3" stroke-linejoin="round"/>`;
  };
  for (const el of [k, d, m]) el.addEventListener('input', upd);
  $('#sp-play').addEventListener('click', () => {
    const dot = $('#sp-dot'), w = dot.parentElement.clientWidth - 34 - 40;
    play(dot, springFrames(samples, (val) => ({ transform: `translateX(${(val * w).toFixed(1)}px)` })), { duration: (samples.length - 1) * 1000 / 60, easing: 'linear' });
  });
  $('#sp-copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText(linearCss()); toast('CSS mit linear() kopiert'); } catch (e) { toast('Kopieren nicht möglich'); } });
  upd();
}


/* ================================================================
   Kapitel 06: Mikrointeraktionen zerlegt
   ================================================================ */
function initMikro() {
  const rows = [
    { id: 'heart', w: '<button type="button" class="an-heart" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg><span>Merken</span> <span class="mono" data-c>12</span></button>',
      p: ['Tipp auf das Herz', 'Merken oder wieder entfernen, Zähler +1 oder −1', 'Herz füllt sich rot und hüpft, Zähler ändert sich', 'Ab dem fünften Tipp hüpft das Herz nicht mehr, es füllt sich nur noch'] },
    { id: 'switch', w: '<button type="button" class="an-switch" role="switch" aria-checked="false"><span class="t" aria-hidden="true"><i></i></span><span>WLAN <span data-s>aus</span></span></button>',
      p: ['Tipp auf den Schalter oder Leertaste', 'An oder aus. Beim Ausschalten werden Verbindungen getrennt', 'Knopf gleitet zur Seite, Farbe wird grün, Text sagt „an“', 'Im Flugmodus ist der Schalter gesperrt und erklärt, warum'] },
    { id: 'pw', w: '<label class="an-pw"><span class="small">Neues Passwort</span><input type="password" autocomplete="new-password"><span class="bar" aria-hidden="true"><i></i></span><small data-pw aria-live="polite">Mindestens 10 Zeichen</small></label>',
      p: ['Jede Eingabe im Feld', 'Stärke aus Länge, Ziffern, Groß- und Sonderzeichen', 'Balken wächst und wechselt die Farbe, Text nennt die Stärke', 'Bei „stark“ wechselt die Anzeige in den Erfolgszustand'] }
  ];
  const names = ['Auslöser', 'Regeln', 'Rückmeldung', 'Schleifen und Modi'];
  $('#d-mikro').innerHTML = rows.map((r) => `<div class="an-mrow" data-mr="${r.id}"><div class="w">${r.w}</div><ul class="an-mparts">${r.p.map((t, i) => `<li data-mp="${i}"><b>${names[i]}</b>${esc(t)}</li>`).join('')}</ul></div>`).join('');
  const flash = (id, parts) => {
    const lis = $$(`[data-mr="${id}"] [data-mp]`);
    parts.forEach((i, n) => setTimeout(() => { lis[i].classList.add('on'); setTimeout(() => lis[i].classList.remove('on'), 1100); }, n * 140));
  };
  // Herz
  let taps = 0, count = 12;
  const heart = $('[data-mr="heart"] .an-heart');
  heart.addEventListener('click', () => {
    const on = heart.getAttribute('aria-pressed') !== 'true'; taps++;
    heart.setAttribute('aria-pressed', String(on)); count += on ? 1 : -1; $('[data-c]', heart).textContent = count;
    if (on && taps < 5) play($('svg', heart), springFrames(SPRING_POP, (v) => ({ transform: `scale(${(0.6 + 0.4 * v).toFixed(3)})` })), { duration: (SPRING_POP.length - 1) * 1000 / 60, easing: 'linear' });
    flash('heart', taps >= 5 ? [0, 1, 2, 3] : [0, 1, 2]);
  });
  // Schalter
  const sw = $('[data-mr="switch"] .an-switch');
  sw.addEventListener('click', () => {
    const on = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', String(on)); $('[data-s]', sw).textContent = on ? 'an' : 'aus';
    play($('i', sw), [{ transform: `translateX(${on ? -22 : 22}px)` }, { transform: 'translateX(0)' }], { duration: 180, easing: EASE.std });
    flash('switch', [0, 1, 2]);
  });
  // Passwort
  const pw = $('[data-mr="pw"] input'), bar = $('[data-mr="pw"] .bar i'), txt = $('[data-pw]');
  let last = -1;
  pw.addEventListener('input', () => {
    const s = pw.value; let sc = 0;
    if (s.length >= 10) sc++; if (s.length >= 14) sc++; if (/\d/.test(s)) sc++; if (/[A-ZÄÖÜ]/.test(s) && /[a-zäöüß]/.test(s)) sc++; if (/[^A-Za-z0-9ÄÖÜäöüß]/.test(s)) sc++;
    const lvl = !s ? 0 : sc <= 1 ? 1 : sc <= 3 ? 2 : 3;
    const col = ['#9CA3AF', '#C3301A', '#B45309', '#15803D'][lvl];
    txt.textContent = ['Mindestens 10 Zeichen', 'Schwach', 'Mittel', '✓ Stark'][lvl];
    bar.style.background = col;
    play(bar, [{ width: bar.style.width || '0%' }, { width: ['0%', '33%', '66%', '100%'][lvl] }], { duration: 200, easing: EASE.dec });
    bar.style.width = ['0%', '33%', '66%', '100%'][lvl];
    if (lvl !== last) flash('pw', lvl === 3 ? [0, 1, 2, 3] : [0, 1, 2]);
    last = lvl;
  });
}


/* ================================================================
   Kapitel 07: Übergänge zwischen Liste und Detail, Staffelung
   ================================================================ */
const TR_ITEMS = [
  ['timing', 'Timing und Dauer', 'Kapitel 04 · 8 Min.'],
  ['easing', 'Easing und Federn', 'Kapitel 05 · 12 Min.'],
  ['uebergaenge', 'Übergänge', 'Kapitel 07 · 10 Min.'],
  ['laden', 'Laden und Warten', 'Kapitel 08 · 7 Min.']
];
function initTransitions() {
  const scr = $('#tr-screen');
  let mode = 'container', busy = false;
  const listHtml = () => `<div class="an-appbar">Lernkapitel</div><div class="an-tr-list">${TR_ITEMS.map(([id, t, s], i) => `<button type="button" class="an-tr-card" data-tc="${i}"><span class="img" style="background-image:url(media/tile-${id}.jpg)"></span><span>${esc(t)}<small>${esc(s)}</small></span></button>`).join('')}</div>`;
  scr.innerHTML = listHtml();
  const list = () => $('.an-tr-list', scr);
  const rel = (el) => { const a = el.getBoundingClientRect(), b = scr.getBoundingClientRect(); return { left: a.left - b.left, top: a.top - b.top, width: a.width, height: a.height }; };
  const px = (r) => ({ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  // Auf das Ende einer Animation warten, aber nie länger als ihre Dauer plus Puffer.
  // So bleibt die Demo bedienbar, auch wenn der Browser eine Animation anhält oder abbricht.
  const done = (a, ms) => Promise.race([a.finished.catch(() => {}), new Promise((r) => setTimeout(r, ms + 250))]);
  // Bei „Bewegung reduzieren“ ersetzt eine kurze Überblendung jede Bewegung
  const reduced = () => RM.matches;
  // Detailansicht sofort schließen, etwa wenn das Muster gewechselt wird
  const reset = () => {
    for (const el of [scr, ...$$('*', scr)]) for (const a of el.getAnimations()) a.cancel();
    for (const n of $$('.an-tr-detail, .an-ghost', scr)) n.parentNode.removeChild(n);
    list().style.visibility = ''; busy = false;
  };
  onGroup($('#tr-mode'), (b) => { mode = b.dataset.mode; if ($('.an-tr-detail', scr)) reset(); });
  async function open(i) {
    if (busy) return; busy = true;
    try {
      const [id, t, s] = TR_ITEMS[i];
      const card = $(`[data-tc="${i}"]`, scr);
      const det = document.createElement('div');
      det.className = 'an-tr-detail'; det.dataset.i = i;
      det.innerHTML = `<button type="button" class="an-tr-back">← Zurück</button><div class="img" style="background-image:url(media/tile-${id}.jpg)"></div><div class="body"><h3>${esc(t)}</h3><p>${esc(s)}</p><p>Hier stünde der Inhalt des Kapitels. Achten Sie beim Zurückgehen darauf, ob Sie die Karte wiederfinden, von der Sie gekommen sind.</p></div>`;
      // Erst unsichtbar einfügen, damit nichts aufblitzt, bevor der Übergang startet
      det.style.opacity = '0';
      scr.append(det);
      const L = list(), img = $('.img', det), body = $('.body', det), back = $('.an-tr-back', det);
      if (mode === 'none') { det.style.opacity = '1'; L.style.visibility = 'hidden'; }
      else if (reduced()) {
        det.style.opacity = '';
        play(L, [{ opacity: 1 }, { opacity: 0 }], { duration: 150 });
        await done(play(det, [{ opacity: 0 }, { opacity: 1 }], { duration: 150 }), 150);
      } else if (mode === 'container') {
        const from = rel($('.img', card)), to = rel(img);
        const g = document.createElement('div'); g.className = 'an-ghost'; g.style.backgroundImage = `url(media/tile-${id}.jpg)`; scr.append(g);
        det.style.opacity = '1'; img.style.visibility = 'hidden'; body.style.opacity = '0'; back.style.opacity = '0';
        play(det, [{ backgroundColor: 'transparent' }, { backgroundColor: getComputedStyle(scr).backgroundColor }], { duration: 250, easing: EASE.std });
        play(L, [{ opacity: 1 }, { opacity: 0 }], { duration: 150 });
        await done(play(g, [Object.assign(px(from), { borderRadius: '8px' }), Object.assign(px(to), { borderRadius: '0px' })], { duration: 380, easing: EASE.dec }), 380);
        img.style.visibility = ''; g.parentNode.removeChild(g); body.style.opacity = ''; back.style.opacity = '';
        play(body, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: EASE.dec });
        play(back, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
      } else if (mode === 'axis') {
        det.style.opacity = '';
        play(L, [{ transform: 'none', opacity: 1 }, { transform: 'translateX(-30%)', opacity: 0 }], { duration: 300, easing: EASE.std });
        await done(play(det, [{ transform: 'translateX(30%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300, easing: EASE.std }), 300);
      } else {
        await done(play(L, [{ opacity: 1 }, { opacity: 0 }], { duration: 90, easing: EASE.acc }), 90);
        det.style.opacity = '';
        await done(play(det, [{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'none' }], { duration: 210, easing: EASE.dec }), 210);
      }
      back.focus({ preventScroll: true });
      $('#tr-status').textContent = `Detailansicht „${t}“ geöffnet, Übergang: ${$('#tr-mode [aria-pressed="true"]').textContent}.`;
    } finally { busy = false; }
  }
  async function close() {
    if (busy) return; busy = true;
    try {
      const det = $('.an-tr-detail', scr); if (!det) return;
      const i = +det.dataset.i, L = list(), card = $(`[data-tc="${i}"]`, scr);
      L.style.visibility = '';
      if (mode === 'none') play(L, [{ opacity: 1 }], { duration: 1 });
      else if (reduced()) {
        play(L, [{ opacity: 0 }, { opacity: 1 }], { duration: 150 });
        await done(play(det, [{ opacity: 1 }, { opacity: 0 }], { duration: 150 }), 150);
      } else if (mode === 'container') {
        const img = $('.img', det), from = rel(img), to = rel($('.img', card));
        const g = document.createElement('div'); g.className = 'an-ghost'; g.style.backgroundImage = img.style.backgroundImage; scr.append(g);
        play(det, [{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: EASE.acc });
        play(L, [{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: 80 });
        await done(play(g, [Object.assign(px(from), { borderRadius: '0px' }), Object.assign(px(to), { borderRadius: '8px' })], { duration: 300, easing: EASE.std }), 380);
        g.parentNode.removeChild(g);
      } else if (mode === 'axis') {
        play(det, [{ transform: 'none', opacity: 1 }, { transform: 'translateX(30%)', opacity: 0 }], { duration: 260, easing: EASE.std });
        await done(play(L, [{ transform: 'translateX(-30%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: EASE.std }), 260);
      } else {
        await done(play(det, [{ opacity: 1 }, { opacity: 0 }], { duration: 90, easing: EASE.acc }), 90);
        await done(play(L, [{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 210, easing: EASE.dec }), 210);
      }
      det.parentNode.removeChild(det); card.focus({ preventScroll: true });
      $('#tr-status').textContent = 'Zurück in der Liste der Lernkapitel.';
    } finally { busy = false; }
  }
  scr.addEventListener('click', (e) => {
    const c = e.target.closest('[data-tc]'); if (c) { open(+c.dataset.tc); return; }
    if (e.target.closest('.an-tr-back')) close();
  });
}

function initStagger() {
  const grid = $('#st-grid'), r = $('#st-delay');
  grid.innerHTML = '<i></i>'.repeat(12);
  let order = 'row';
  onGroup($('#st-order'), (b) => { order = b.dataset.order; upd(); });
  const upd = () => { $('#st-out').textContent = r.value + ' ms'; $('#st-total').textContent = `Gesamtdauer der Folge: ${11 * +r.value + 260} ms (12 Elemente, je 260 ms)`; };
  r.addEventListener('input', upd); upd();
  $('#st-play').addEventListener('click', () => {
    const els = $$('i', grid);
    let rank;
    if (order === 'row') rank = els.map((_, i) => i);
    else if (order === 'random') rank = shuffle(els.map((_, i) => i));
    else {
      const g = grid.getBoundingClientRect(), cx = g.width / 2, cy = g.height / 2;
      const dist = els.map((el) => { const b = el.getBoundingClientRect(); return Math.hypot(b.left - g.left + b.width / 2 - cx, b.top - g.top + b.height / 2 - cy); });
      const sorted = dist.map((d, i) => [d, i]).sort((a, b) => a[0] - b[0]);
      rank = []; sorted.forEach(([, i], n) => { rank[i] = n; });
    }
    els.forEach((el, i) => play(el, [{ opacity: 0, transform: 'translateY(18px) scale(.85)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: rank[i] * +r.value, easing: EASE.dec, fill: 'both' }));
  });
}


/* ================================================================
   Kapitel 08: Laden, optimistische Oberfläche
   ================================================================ */
function initLoading() {
  const real = '<div class="an-real"><div class="img"></div><h4>Übergänge im Storyboard</h4><p>Bevor Sie Übergänge programmieren, skizzieren Sie die Screens nebeneinander und zeichnen Pfeile ein.</p></div>';
  const kinds = [['leer', 'Ohne Anzeige'], ['spin', 'Spinner'], ['skel', 'Skeleton Screen']];
  $('#load-grid').innerHTML = kinds.map(([k, t]) => `<div class="an-lp"><span class="label">${esc(t)}</span><div class="area" data-la="${k}">${real}</div></div>`).join('');
  let running = false;
  $('#load-play').addEventListener('click', async () => {
    if (running) return; running = true; $('#load-play').disabled = true;
    const anims = [];
    for (const [k] of kinds) {
      const a = $(`[data-la="${k}"]`);
      if (k === 'leer') a.innerHTML = '';
      if (k === 'spin') { a.innerHTML = '<span class="an-spin" role="img" aria-label="Wird geladen"></span>'; anims.push($('.an-spin', a).animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 800, iterations: Infinity })); }
      if (k === 'skel') { a.innerHTML = '<div class="an-sk an-sk-img"></div><div class="an-sk an-sk-l" style="width:70%"></div><div class="an-sk an-sk-l"></div><div class="an-sk an-sk-l" style="width:85%"></div>'; for (const s of $$('.an-sk', a)) anims.push(s.animate([{ opacity: 1 }, { opacity: 0.55 }], { duration: 900, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' })); }
    }
    await wait(3000);
    for (const an of anims) an.cancel();
    for (const [k] of kinds) { const a = $(`[data-la="${k}"]`); a.innerHTML = real; play(a.firstElementChild, [{ opacity: 0 }, { opacity: 1 }], { duration: 200 }); }
    running = false; $('#load-play').disabled = false;
  });
  // Optimistisch
  const o = $('#opt-demo');
  o.innerHTML = '<button type="button" class="an-heart" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg><span>Gefällt mir</span> <span class="mono" data-c>41</span></button><span class="msg" role="status"></span>';
  const h = $('.an-heart', o), msg = $('.msg', o);
  let n = 41, pending = false;
  h.addEventListener('click', async () => {
    if (pending) return; pending = true;
    const on = h.getAttribute('aria-pressed') !== 'true';
    h.setAttribute('aria-pressed', String(on)); n += on ? 1 : -1; $('[data-c]', h).textContent = n;
    if (on) play($('svg', h), springFrames(SPRING_POP, (v) => ({ transform: `scale(${(0.6 + 0.4 * v).toFixed(3)})` })), { duration: (SPRING_POP.length - 1) * 1000 / 60, easing: 'linear' });
    msg.textContent = 'Wird im Hintergrund gespeichert …';
    await wait(1200);
    if ($('#opt-fail').checked) {
      h.setAttribute('aria-pressed', String(!on)); n += on ? -1 : 1; $('[data-c]', h).textContent = n;
      play(h, [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 300 });
      msg.textContent = 'Das hat nicht geklappt, keine Verbindung. Bitte versuchen Sie es erneut.';
    } else msg.textContent = 'Gespeichert. Die Anzeige war schon vorher richtig.';
    pending = false;
  });
}


/* ================================================================
   Kapitel 09: Standard und reduzierte Bewegung
   ================================================================ */
function initReduce() {
  const scr = $('#rm-screen');
  let red = RM.matches, page = 0, busy = false;
  const status = () => { $('#rm-status').innerHTML = `Ihr Gerät meldet gerade: reduzierte Bewegung ist <strong>${RM.matches ? 'eingeschaltet' : 'ausgeschaltet'}</strong>. Die Demo startet mit dieser Einstellung, Sie können aber umschalten.`; };
  const legend = () => { $('#rm-legend').innerHTML = red
    ? '<strong>Reduzierte Bewegung</strong><ul><li>Der neue Screen blendet in 150 ms über.</li><li>Nichts schiebt sich durch das Bild.</li><li>Der Wechsel bleibt trotzdem sichtbar.</li></ul>'
    : '<strong>Standard</strong><ul><li>Der neue Screen schiebt sich in 300 ms von rechts herein.</li><li>Der alte weicht ein Stück nach links aus.</li><li>Die Richtung zeigt: Es geht tiefer in die App.</li></ul>'; };
  const pg = (i) => `<div class="an-pg ${i ? 'b' : ''}"><div class="an-appbar">${i ? '← Details' : 'Start'}</div><div class="hero"></div><div class="l" style="width:70%"></div><div class="l"></div><div class="l" style="width:80%"></div><div class="l" style="width:55%"></div></div>`;
  scr.innerHTML = pg(0);
  const btn = [...$$('#rm-mode button')]; pressGroup($('#rm-mode'), btn[red ? 1 : 0]);
  onGroup($('#rm-mode'), (b) => { red = b.dataset.rm === '1'; legend(); });
  status(); legend(); RM.addEventListener('change', status);
  $('#rm-play').addEventListener('click', async () => {
    if (busy) return; busy = true;
    const old = $('.an-pg', scr); page = 1 - page;
    scr.insertAdjacentHTML('beforeend', pg(page));
    const nu = scr.lastElementChild, dir = page ? 1 : -1;
    if (red) {
      await play(nu, [{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' }).finished;
    } else {
      play(old, [{ transform: 'none' }, { transform: `translateX(${-30 * dir}%)` }], { duration: 300, easing: EASE.std });
      await play(nu, [{ transform: `translateX(${100 * dir}%)` }, { transform: 'none' }], { duration: 300, easing: EASE.std }).finished;
    }
    old.remove(); busy = false;
  });
}


/* ================================================================
   Kapitel 10: Layout gegen Transform
   ================================================================ */
function initPerf() {
  $('#perf').innerHTML = ['left (Layout)', 'transform (Compositor)'].map((t, i) => `<div class="an-lane"><span class="lbl"><b>${i ? 'transform' : 'left'}</b>${i ? 'Grafikkarte' : 'Layout je Bild'}</span><div class="rail" aria-hidden="true" style="position:relative"><i data-pf="${i}" style="width:30px;height:30px;border-radius:50%;left:6px"></i></div></div>`).join('');
  let runs = [], busyT = null;
  const pb = $('#perf-play'), bb = $('#perf-busy');
  const stop = () => { for (const a of runs) a.cancel(); runs = []; pb.textContent = 'Abspielen'; };
  const stopBusy = () => { clearInterval(busyT); busyT = null; bb.setAttribute('aria-pressed', 'false'); bb.textContent = 'Hauptthread belasten: aus'; };
  pb.addEventListener('click', () => {
    if (runs.length) { stop(); return; }
    const d = $('#perf .rail').clientWidth - 44;
    runs = [
      $('[data-pf="0"]').animate([{ left: '6px' }, { left: d + 6 + 'px' }], { duration: 1400, iterations: Infinity, direction: 'alternate', easing: EASE.inout }),
      $('[data-pf="1"]').animate([{ transform: 'translateX(0)' }, { transform: `translateX(${d}px)` }], { duration: 1400, iterations: Infinity, direction: 'alternate', easing: EASE.inout })
    ];
    pb.textContent = 'Anhalten';
  });
  bb.addEventListener('click', () => {
    if (busyT) { stopBusy(); return; }
    busyT = setInterval(() => { const t = performance.now(); while (performance.now() - t < 150) { /* Hauptthread absichtlich blockieren */ } }, 300);
    bb.setAttribute('aria-pressed', 'true'); bb.textContent = 'Hauptthread belasten: an';
  });
  leaveHooks.push(() => { stop(); stopBusy(); });
}


/* ================================================================
   Übungen: gemeinsame Bausteine
   ================================================================ */
function selectHtml(name, opts, val, label) {
  return `<select data-sel="${name}" aria-label="${esc(label)}"><option value="">Bitte wählen …</option>${opts.map(([v, t]) => `<option value="${v}"${v === val ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
}
function resultBox(el, right, total, pass, okText, badText) {
  const ok = right >= pass;
  el.innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}" role="status"><p><strong>${right} von ${total} richtig.</strong> ${esc(ok ? okText : badText)}</p></div>`;
  return ok;
}

/* ---------- Übung 1: Easing zuordnen ---------- */
const EE_OPTS = [['linear', 'Linear'], ['in', 'Beschleunigen (ease-in)'], ['out', 'Abbremsen (ease-out)'], ['inout', 'Beschleunigen und abbremsen (ease-in-out)'], ['spring', 'Feder mit Überschwingen']];
const EE_ITEMS = [
  ['Der Filter-Dialog fährt als Bottom Sheet von unten herein.', 'sheet', 'out', 'Was hereinkommt, bremst ab: Es ist sofort in Bewegung und kommt sanft zur Ruhe, wo der Blick schon wartet.'],
  ['Die Snackbar „In den Warenkorb gelegt“ verlässt den Screen nach unten.', 'leave', 'in', 'Was geht, beschleunigt: Es löst sich langsam und verschwindet zügig, ohne am Ende Aufmerksamkeit zu binden.'],
  ['Beim Sortieren wandert eine Produktkarte an eine neue Position in der Liste.', 'move', 'inout', 'Innerhalb des Screens startet und endet die Bewegung sichtbar, darum auf beiden Seiten weich.'],
  ['Der Fortschrittsbalken eines Datei-Uploads füllt sich gleichmäßig.', 'bar', 'linear', 'Fortschritt hat keine Masse. Ein linearer Verlauf zeigt die tatsächliche Rate ehrlich an.'],
  ['Das Herz „Auf die Wunschliste“ ploppt beim Antippen auf.', 'pop', 'spring', 'Ein kurzes Überschwingen macht die Rückmeldung lebendig. Für verspielte, kleine Momente passt eine Feder.']
];
function exPreview(stage, kind, ease, dur = 700) {
  stage.innerHTML = {
    sheet: '<span class="obj" style="left:12%;right:12%;bottom:0;height:60%;border-radius:12px 12px 0 0;background:var(--an-purple)"></span>',
    leave: '<span class="obj" style="left:15%;right:15%;bottom:10px;height:30px;border-radius:8px;background:#1F2937"></span>',
    move: '<span class="obj" style="left:10px;top:25px;width:60px;height:40px;border-radius:8px;background:var(--an-purple)"></span>',
    bar: '<span class="obj" style="left:10px;right:10px;top:40px;height:10px;border-radius:5px;background:var(--surface-2)"></span><span class="obj" data-o style="left:10px;right:10px;top:40px;height:10px;border-radius:5px;background:var(--an-cta);transform-origin:left;transform:scaleX(0)"></span>',
    pop: '<span class="obj" style="left:calc(50% - 22px);top:23px;width:44px;height:44px;display:grid;place-items:center"><svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" fill="#C3301A"/></svg></span>',
    toggle: '<span class="obj" style="left:calc(50% - 30px);top:30px;width:60px;height:32px;border-radius:999px;background:#15803D"></span><span class="obj" data-o style="left:calc(50% - 26px);top:34px;width:24px;height:24px;border-radius:50%;background:#fff"></span>',
    snack: '<span class="obj" style="left:15%;right:15%;bottom:10px;height:30px;border-radius:8px;background:#1F2937"></span>',
    page: '<span class="obj" style="inset:8px;border-radius:8px;background:var(--surface-2)"></span><span class="obj" data-o style="inset:8px;border-radius:8px;background:var(--an-purple)"></span>',
    dialog: '<span class="obj" data-o style="left:25%;right:25%;top:14px;bottom:14px;border-radius:10px;background:var(--an-purple)"></span>'
  }[kind];
  const o = $('[data-o]', stage) || $('.obj', stage), w = stage.clientWidth;
  const fr = {
    sheet: [{ transform: 'translateY(100%)' }, { transform: 'none' }],
    leave: [{ transform: 'none' }, { transform: 'translateY(60px)' }],
    move: [{ transform: 'none' }, { transform: `translateX(${w - 80}px)` }],
    bar: [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
    pop: [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
    toggle: [{ transform: 'none' }, { transform: 'translateX(28px)' }],
    snack: [{ transform: 'translateY(60px)' }, { transform: 'none' }],
    page: [{ transform: 'translateX(100%)' }, { transform: 'none' }],
    dialog: [{ transform: 'none', opacity: 1 }, { transform: 'scale(.85)', opacity: 0 }]
  }[kind];
  if (ease === 'spring') {
    const a = fr[0].transform, b = fr[1].transform;
    const num = (t) => { const m = /\(([-\d.]+)/.exec(t); return m ? parseFloat(m[1]) : 0; };
    const fn = /^(\w+)/.exec(a === 'none' ? b : a)[1];
    const unit = /%/.test(a + b) ? '%' : fn === 'scale' || fn === 'scaleX' ? '' : 'px';
    const A = a === 'none' ? (fn.startsWith('scale') ? 1 : 0) : num(a), B = b === 'none' ? (fn.startsWith('scale') ? 1 : 0) : num(b);
    play(o, springFrames(SPRING_POP, (v) => ({ transform: `${fn}(${(A + (B - A) * v).toFixed(3)}${unit})` })), { duration: Math.max(dur, (SPRING_POP.length - 1) * 1000 / 60), easing: 'linear' });
  } else play(o, fr, { duration: dur, easing: EASE[ease] || 'linear' });
}
function initExEasing() {
  const st = store.get('ee', {});
  const render = () => {
    $('#ee-list').innerHTML = EE_ITEMS.map(([t], i) => `<div class="an-ex-item" data-i="${i}"><h3>${i + 1}. ${esc(t)}</h3><div class="an-ex-stage" aria-hidden="true"></div><div class="an-ex-row">${selectHtml(i, EE_OPTS, st[i], 'Easing für Situation ' + (i + 1))}<button type="button" class="btn btn-sm" data-pv="${i}">Vorschau</button></div><div class="why" hidden></div></div>`).join('');
  };
  render();
  const list = $('#ee-list');
  list.addEventListener('change', (e) => { const s = e.target.closest('[data-sel]'); if (!s) return; st[s.dataset.sel] = s.value; store.set('ee', st); });
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pv]'); if (!b) return; const i = +b.dataset.pv;
    if (!st[i]) { toast('Wählen Sie zuerst eine Kurve aus.'); return; }
    exPreview($('.an-ex-stage', b.closest('.an-ex-item')), EE_ITEMS[i][1], st[i]);
  });
  $('#ee-check').addEventListener('click', () => {
    let right = 0;
    EE_ITEMS.forEach(([, , a, why], i) => {
      const it = $(`.an-ex-item[data-i="${i}"]`, list), ok = st[i] === a; if (ok) right++;
      it.classList.toggle('is-ok', ok); it.classList.toggle('is-bad', !ok);
      const w = $('.why', it); w.hidden = false;
      w.innerHTML = `<b class="${ok ? 'ok' : 'bad'}">${ok ? 'Richtig.' : 'Passender wäre: ' + esc(EE_OPTS.find((o) => o[0] === a)[1]) + '.'}</b> ${esc(why)}`;
    });
    if (resultBox($('#ee-fb'), right, 5, 4, 'Sie wählen Kurven nach Richtung und Bedeutung der Bewegung.', 'Denken Sie an die Faustregel: rein abbremsen, raus beschleunigen, innerhalb beides.')) markDone('ue-easing');
  });
  $('#ee-reset').addEventListener('click', () => { for (const k of Object.keys(st)) delete st[k]; store.set('ee', st); render(); $('#ee-fb').innerHTML = ''; });
}

/* ---------- Übung 2: Dauer einstellen ---------- */
const ET_ITEMS = [
  ['Schalter „Benachrichtigungen“ umlegen', 'toggle', 100, 200, 'std', 'Eine kleine Zustandsänderung braucht nur einen Augenblick. Länger wirkt der Schalter schwerfällig.'],
  ['Snackbar „Gespeichert“ einblenden', 'snack', 150, 250, 'dec', 'Kleine Elemente erscheinen schnell. Der Text muss danach ja noch gelesen werden.'],
  ['Bottom Sheet mit Filtern öffnen', 'sheet', 250, 400, 'dec', 'Eine mittlere Fläche legt einen längeren Weg zurück und braucht etwas mehr Zeit.'],
  ['Seitenwechsel über den ganzen Screen', 'page', 300, 500, 'std', 'Große Übergänge brauchen am meisten Zeit, sollten aber eine halbe Sekunde kaum überschreiten.'],
  ['Dialog nach „Abbrechen“ schließen', 'dialog', 100, 250, 'acc', 'Was verschwindet, hat seine Aufgabe erfüllt. Ausblenden ist kürzer als Einblenden.']
];
function initExTiming() {
  const st = store.get('et', {});
  const render = () => {
    $('#et-list').innerHTML = ET_ITEMS.map(([t], i) => { const v = st[i] ?? 1000; return `<div class="an-ex-item" data-i="${i}"><h3>${i + 1}. ${esc(t)}</h3><div class="an-ex-stage" aria-hidden="true"></div><div class="an-slider-row" style="margin:0"><label for="et-${i}">Dauer</label><input type="range" id="et-${i}" min="0" max="1200" step="25" value="${v}" data-et="${i}"><output class="mono" data-eo="${i}">${v} ms</output></div><div class="row-btns"><button type="button" class="btn btn-sm" data-pv="${i}">Vorschau</button></div><div class="why" hidden></div></div>`; }).join('');
  };
  render();
  const list = $('#et-list');
  list.addEventListener('input', (e) => { const r = e.target.closest('[data-et]'); if (!r) return; st[r.dataset.et] = +r.value; store.set('et', st); $(`[data-eo="${r.dataset.et}"]`).textContent = r.value + ' ms'; });
  list.addEventListener('click', (e) => { const b = e.target.closest('[data-pv]'); if (!b) return; const i = +b.dataset.pv; exPreview($('.an-ex-stage', b.closest('.an-ex-item')), ET_ITEMS[i][1], ET_ITEMS[i][4], Math.max(1, st[i] ?? 1000)); });
  $('#et-check').addEventListener('click', () => {
    let right = 0;
    ET_ITEMS.forEach(([, , lo, hi, , why], i) => {
      const v = st[i] ?? 1000, ok = v >= lo && v <= hi, it = $(`.an-ex-item[data-i="${i}"]`, list); if (ok) right++;
      it.classList.toggle('is-ok', ok); it.classList.toggle('is-bad', !ok);
      const w = $('.why', it); w.hidden = false;
      w.innerHTML = `<b class="${ok ? 'ok' : 'bad'}">${ok ? 'Passt.' : v < lo ? 'Zu kurz.' : 'Zu lang.'}</b> Empfohlen: ${lo}–${hi} ms. ${esc(why)}`;
    });
    if (resultBox($('#et-fb'), right, 5, 4, 'Ihre Dauern passen zu Größe, Weg und Richtung.', 'Vergleichen Sie mit den Richtwerten aus Kapitel 04.')) markDone('ue-timing');
  });
  $('#et-reset').addEventListener('click', () => { for (const k of Object.keys(st)) delete st[k]; store.set('et', st); render(); $('#et-fb').innerHTML = ''; });
}

/* ---------- Übung 3: Sinnvoll oder Deko? ---------- */
const EZ_OPTS = [['fb', 'Rückmeldung'], ['zu', 'Zustandswechsel'], ['or', 'Orientierung'], ['au', 'Aufmerksamkeit'], ['de', 'Nur Deko, stört eher']];
const EZ_ITEMS = [
  ['Ein Button wird beim Antippen kurz kleiner.', 'fb', '<span class="m-btn">Bestellen</span>', (m) => play($('.m-btn', m), [{ transform: 'scale(1)' }, { transform: 'scale(.92)', offset: .35 }, { transform: 'scale(1)' }], { duration: 200 }), 'Die Bewegung bestätigt den Tipp in unter 100 ms, bevor das Ergebnis da ist.'],
  ['Ein Produktbild fliegt im Bogen zum Warenkorb-Symbol.', 'or', '<span class="m-card" style="left:20px;top:80px;width:40px;height:40px"></span><span class="m-badge" style="position:absolute;right:16px;top:12px"></span>', (m) => { const c = $('.m-card', m), dx = m.clientWidth - 100; play(c, [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${dx * 0.5}px,-70px) scale(.7)`, offset: .5 }, { transform: `translate(${dx}px,-64px) scale(.3)`, opacity: .6 }], { duration: 650, easing: EASE.inout }); }, 'Die Bewegung zeigt, wo der Artikel jetzt liegt: im Warenkorb oben rechts.'],
  ['Ein Schalter gleitet nach rechts und wird grün.', 'zu', '<span class="m-sw"><i></i></span>', (m, s) => { s.on = !s.on; const sw = $('.m-sw', m); play($('i', sw), [{ transform: `translateX(${s.on ? 0 : 24}px)` }, { transform: `translateX(${s.on ? 24 : 0}px)` }], { duration: 180, easing: EASE.std }); play(sw, [{ backgroundColor: s.on ? '#9CA3AF' : '#15803D' }, { backgroundColor: s.on ? '#15803D' : '#9CA3AF' }], { duration: 180 }); }, 'Die Bewegung macht den Wechsel von „aus“ zu „an“ sichtbar.'],
  ['Das Logo dreht sich zwei Sekunden lang, erst danach erscheint der Inhalt.', 'de', '<span class="m-logo">AN</span>', (m) => play($('.m-logo', m), [{ transform: 'rotate(0)' }, { transform: 'rotate(720deg)' }], { duration: 2000, easing: EASE.inout }), 'Die Drehung erklärt nichts und hält den Inhalt zwei Sekunden zurück. Das ist reine Wartezeit.'],
  ['An der Glocke erscheint ein Badge und wächst einmal kurz auf.', 'au', '<span class="m-badge"><b>1</b></span>', (m) => play($('b', m), [{ transform: 'scale(0)' }, { transform: 'scale(1.35)', offset: .45 }, { transform: 'scale(1)' }], { duration: 480, easing: EASE.out }), 'Einmal und kurz lenkt den Blick auf die neue Nachricht, ohne danach weiter zu stören.'],
  ['Hinter einem Anmeldeformular ziehen Wolken in Dauerschleife vorbei.', 'de', '<span class="m-card" style="left:-60px;top:20px;width:60px;height:22px;border-radius:999px;opacity:.5"></span><span class="m-card" style="left:-60px;top:70px;width:80px;height:26px;border-radius:999px;opacity:.35"></span><span class="m-btn" style="position:relative">Anmelden</span>', (m) => { $$('.m-card', m).forEach((c, i) => c.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${m.clientWidth + 120}px)` }], { duration: 4000 + i * 1500, iterations: 2 })); }, 'Dauerbewegung hinter einem Formular lenkt beim Ausfüllen ab und kann bei Menschen mit Gleichgewichtsstörungen Schwindel auslösen. Die Demo läuft hier nur zweimal.']
];
function initExZweck() {
  const st = store.get('ez', {}), ms = EZ_ITEMS.map(() => ({}));
  const render = () => {
    $('#ez-list').innerHTML = EZ_ITEMS.map(([t, , html], i) => `<div class="an-ex-item" data-i="${i}"><div class="an-mini" aria-hidden="true" data-zm="${i}">${html}</div><p style="color:var(--ink)"><b>${i + 1}.</b> ${esc(t)}</p><button type="button" class="btn btn-sm" data-pv="${i}" style="justify-self:start">Abspielen</button>${selectHtml(i, EZ_OPTS, st[i], 'Zweck von Beispiel ' + (i + 1))}<div class="why" hidden></div></div>`).join('');
  };
  render();
  const list = $('#ez-list');
  list.addEventListener('change', (e) => { const s = e.target.closest('[data-sel]'); if (!s) return; st[s.dataset.sel] = s.value; store.set('ez', st); });
  list.addEventListener('click', (e) => { const b = e.target.closest('[data-pv]'); if (!b) return; const i = +b.dataset.pv; EZ_ITEMS[i][3]($(`[data-zm="${i}"]`, list), ms[i]); });
  $('#ez-check').addEventListener('click', () => {
    let right = 0;
    EZ_ITEMS.forEach(([, a, , , why], i) => {
      const it = $(`.an-ex-item[data-i="${i}"]`, list), ok = st[i] === a; if (ok) right++;
      it.classList.toggle('is-ok', ok); it.classList.toggle('is-bad', !ok);
      const w = $('.why', it); w.hidden = false;
      w.innerHTML = `<b class="${ok ? 'ok' : 'bad'}">${ok ? 'Richtig.' : 'Gemeint ist: ' + esc(EZ_OPTS.find((o) => o[0] === a)[1]) + '.'}</b> ${esc(why)}`;
    });
    if (resultBox($('#ez-fb'), right, 6, 5, 'Sie erkennen, wofür eine Animation da ist und wann sie nur stört.', 'Fragen Sie bei jedem Beispiel: Würde jemand etwas vermissen, wenn es fehlt?')) markDone('ue-zweck');
  });
  $('#ez-reset').addEventListener('click', () => { for (const k of Object.keys(st)) delete st[k]; store.set('ez', st); render(); $('#ez-fb').innerHTML = ''; });
}

/* ---------- Übung 4: Pull to Refresh zerlegen ---------- */
const EM_OPTS = [['t', 'Auslöser'], ['r', 'Regeln'], ['f', 'Rückmeldung'], ['l', 'Schleifen und Modi']];
const EM_ITEMS = [
  ['Die Person zieht die Liste am oberen Rand nach unten.', 't', 'Die Geste startet die Mikrointeraktion: ein Auslöser durch die Person.'],
  ['Erst ab 70 px Zugweite wird beim Loslassen neu geladen, darunter federt die Liste zurück.', 'r', 'Eine Schwelle legt fest, was passiert. Das ist eine Regel, auch wenn man sie nicht sieht.'],
  ['Ein Pfeil dreht sich, je weiter gezogen wird, und zeigt an der Schwelle nach oben.', 'f', 'Die Drehung zeigt den Fortschritt der Geste: Rückmeldung während der Bewegung.'],
  ['Während des Ladens dreht sich ein Indikator, danach rutschen neue Beiträge oben ein.', 'f', 'Die Person sieht, dass geladen wird und was neu ist: Rückmeldung zum Ergebnis.'],
  ['Ist die Liste nicht ganz oben, scrollt die Geste ganz normal und lädt nichts.', 'r', 'Die Regel bestimmt, wann die Geste überhaupt als „Aktualisieren“ gilt.'],
  ['Die App lädt von selbst neu, wenn sie nach mehr als 30 Minuten wieder geöffnet wird.', 't', 'Auch das System kann auslösen. Saffer nennt das einen systemgesteuerten Auslöser.'],
  ['Ohne Internetverbindung wechselt die Geste in einen Offline-Modus und zeigt die gespeicherten Beiträge.', 'l', 'Ein Sonderfall verändert das Verhalten: ein Modus.'],
  ['Gibt es mehrmals hintereinander nichts Neues, erscheint der Hinweis „Alles aktuell“ nur noch kurz.', 'l', 'Das Verhalten ändert sich bei Wiederholung: eine Schleife.']
];
function initExMikro() {
  const st = store.get('em', {});
  const render = () => { $('#em-list').innerHTML = EM_ITEMS.map(([t], i) => `<div class="an-ex-item" data-i="${i}"><p style="color:var(--ink)"><b>${i + 1}.</b> ${esc(t)}</p>${selectHtml(i, EM_OPTS, st[i], 'Teil des Modells für Aussage ' + (i + 1))}<div class="why" hidden></div></div>`).join(''); };
  render();
  const list = $('#em-list');
  list.addEventListener('change', (e) => { const s = e.target.closest('[data-sel]'); if (!s) return; st[s.dataset.sel] = s.value; store.set('em', st); });
  $('#em-check').addEventListener('click', () => {
    let right = 0;
    EM_ITEMS.forEach(([, a, why], i) => {
      const it = $(`.an-ex-item[data-i="${i}"]`, list), ok = st[i] === a; if (ok) right++;
      it.classList.toggle('is-ok', ok); it.classList.toggle('is-bad', !ok);
      const w = $('.why', it); w.hidden = false;
      w.innerHTML = `<b class="${ok ? 'ok' : 'bad'}">${ok ? 'Richtig.' : 'Gemeint ist: ' + esc(EM_OPTS.find((o) => o[0] === a)[1]) + '.'}</b> ${esc(why)}`;
    });
    if (resultBox($('#em-fb'), right, 8, 6, 'Sie können eine Mikrointeraktion vollständig beschreiben.', 'Lesen Sie die vier Teile in Kapitel 06 noch einmal nach.')) markDone('ue-mikro');
  });
  $('#em-reset').addEventListener('click', () => { for (const k of Object.keys(st)) delete st[k]; store.set('em', st); render(); $('#em-fb').innerHTML = ''; });
  initPtr();
}
function initPtr() {
  const root = $('#ptr'), status = $('#ptr-status');
  const fresh = ['Mensa: Heute vegane Lasagne', 'Bibliothek: Längere Öffnungszeiten in der Prüfungszeit', 'Hochschulsport: Bouldern am Donnerstag'];
  let feedItems = [['Semesterticket gilt ab Montag', 'vor 2 Std.'], ['Raumänderung: UX-Vorlesung in E 201', 'vor 5 Std.'], ['Bewerbung Auslandssemester bis 15.1.', 'gestern'], ['Neue Kurse im Makerspace', 'gestern']];
  let nf = 0, emptyRuns = 0;
  root.innerHTML = '<div class="an-appbar">Campus-News</div><div class="ind"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg></div><div class="feed"></div>';
  const feed = $('.feed', root), ind = $('.ind', root), arrow = $('svg', ind);
  const draw = () => { feed.innerHTML = feedItems.map(([t, s], i) => `<div${i < nf && i === 0 && feedItems.isNew ? ' class="new"' : ''}>${esc(t)}<small>${esc(s)}</small></div>`).join(''); };
  draw();
  const TH = 70; let pull = 0, dragging = false, startY = 0, loading = false;
  const setPull = (p) => {
    pull = clamp(p, 0, 120);
    feed.style.transform = `translateY(${pull}px)`;
    ind.style.opacity = String(Math.min(1, pull / 40));
    ind.style.transform = `translateY(${Math.min(pull, TH) * 0.5}px)`;
    arrow.style.transform = `rotate(${pull >= TH ? 0 : 180 - Math.min(1, pull / TH) * 180 + 0}deg)`;
  };
  const springBack = () => { play(feed, [{ transform: `translateY(${pull}px)` }, { transform: 'translateY(0)' }], { duration: 280, easing: EASE.std }).finished.then(() => { feed.getAnimations().forEach((a) => a.cancel()); feed.style.transform = ''; }); ind.style.opacity = '0'; pull = 0; };
  async function release() {
    if (pull < TH) { if (pull > 5) status.textContent = 'Zu kurz gezogen, nichts passiert.'; springBack(); return; }
    loading = true; status.textContent = 'Wird aktualisiert …';
    feed.style.transform = 'translateY(56px)';
    arrow.innerHTML = '<path d="M12 3a9 9 0 1 0 9 9"/>';
    const spin = arrow.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(360deg)' }], { duration: 700, iterations: Infinity });
    await wait(1300); spin.cancel();
    arrow.innerHTML = '<path d="M12 19V5M6 11l6-6 6 6"/>';
    if (nf < fresh.length) {
      feedItems = [[fresh[nf], 'gerade eben'], ...feedItems].slice(0, 6); nf++; feedItems.isNew = true; emptyRuns = 0;
      draw(); status.textContent = 'Ein neuer Beitrag ist da.';
      feed.style.transform = '';
      play(feed.firstElementChild, [{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: EASE.dec });
      play(feed, [{ transform: 'translateY(56px)' }, { transform: 'none' }], { duration: 260, easing: EASE.std }).finished.then(() => feed.getAnimations().forEach((a) => a.cancel()));
    } else {
      emptyRuns++;
      status.textContent = emptyRuns <= 2 ? 'Alles aktuell. Es gibt keine neuen Beiträge.' : 'Alles aktuell.';
      pull = 56; springBack();
    }
    ind.style.opacity = '0'; pull = 0; loading = false;
  }
  root.addEventListener('pointerdown', (e) => { if (loading) return; dragging = true; startY = e.clientY; root.setPointerCapture(e.pointerId); });
  root.addEventListener('pointermove', (e) => { if (!dragging) return; setPull((e.clientY - startY) * 0.5); });
  const up = () => { if (!dragging) return; dragging = false; release(); };
  root.addEventListener('pointerup', up); root.addEventListener('pointercancel', up);
  root.addEventListener('keydown', (e) => { if (e.key !== 'ArrowDown' || loading) return; e.preventDefault(); setPull(pull + 12); });
  root.addEventListener('keyup', (e) => { if (e.key === 'ArrowDown' && !loading) release(); });
}

/* ---------- Übung 5: Reduced-Motion-Check ---------- */
const ER_OPTS = [['keep', 'Behalten'], ['fade', 'Durch Überblendung ersetzen'], ['remove', 'Entfernen oder Standbild']];
const ER_ITEMS = [
  ['Parallax-Effekt: Das Titelbild der Startseite scrollt langsamer als der Text.', 'remove', 'Parallax ist reine Dekoration und einer der häufigsten Auslöser für Schwindel. Ohne ihn fehlt keine Information.'],
  ['Seitenwechsel: Der neue Screen schiebt sich von rechts herein.', 'fade', 'Der Wechsel muss sichtbar bleiben, aber ohne großen Weg. Eine kurze Überblendung erfüllt beides.'],
  ['Der Schalter „Nur Direktflüge“ wechselt beim Antippen die Farbe.', 'keep', 'Ein Farbwechsel ist kaum Bewegung und trägt die Information „an“ oder „aus“.'],
  ['Ein Hintergrundvideo mit Strandszenen läuft auf der Startseite in Dauerschleife.', 'remove', 'Automatische Dauerbewegung entfällt. Ein Standbild zeigt dasselbe Motiv. Pausierbar sein muss das Video ohnehin (WCAG 2.2.2).'],
  ['Ein Ladeindikator dreht sich, während Flüge gesucht werden.', 'keep', 'Er zeigt, dass die App arbeitet. Ohne ihn wüsste niemand, ob etwas passiert. Er darf aber klein und ruhig sein.'],
  ['Eine Hotelkarte vergrößert sich beim Antippen zur Detailansicht.', 'fade', 'Die Container-Transformation bewegt eine große Fläche. Eine Überblendung zeigt den Wechsel ohne Zoom.'],
  ['Nach der Buchung fliegt Konfetti über den ganzen Screen.', 'remove', 'Die Bestätigung steht im Text. Das Konfetti ist Dekoration mit viel Bewegung.']
];
function initExReduce() {
  const st = store.get('er', {});
  const render = () => { $('#er-list').innerHTML = ER_ITEMS.map(([t], i) => `<div class="an-ex-item" data-i="${i}"><p style="color:var(--ink)"><b>${i + 1}.</b> ${esc(t)}</p><div class="an-chips-sm" role="group" aria-label="Entscheidung für Animation ${i + 1}">${ER_OPTS.map(([v, l]) => `<button type="button" class="chip" aria-pressed="${st[i] === v}" data-er="${i}" data-v="${v}">${esc(l)}</button>`).join('')}</div><div class="why" hidden></div></div>`).join(''); };
  render();
  const list = $('#er-list');
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-er]'); if (!b) return;
    st[b.dataset.er] = b.dataset.v; store.set('er', st);
    for (const x of $$(`[data-er="${b.dataset.er}"]`, list)) x.setAttribute('aria-pressed', String(x === b));
  });
  $('#er-check').addEventListener('click', () => {
    let right = 0;
    ER_ITEMS.forEach(([, a, why], i) => {
      const it = $(`.an-ex-item[data-i="${i}"]`, list), ok = st[i] === a; if (ok) right++;
      it.classList.toggle('is-ok', ok); it.classList.toggle('is-bad', !ok);
      const w = $('.why', it); w.hidden = false;
      w.innerHTML = `<b class="${ok ? 'ok' : 'bad'}">${ok ? 'Richtig.' : 'Besser: ' + esc(ER_OPTS.find((o) => o[0] === a)[1]) + '.'}</b> ${esc(why)}`;
    });
    if (resultBox($('#er-fb'), right, 7, 6, 'Sie reduzieren Bewegung, ohne Information zu verlieren.', 'Merksatz: Information behalten, große Wege ersetzen, Dekoration entfernen.')) markDone('ue-reduce');
  });
  $('#er-reset').addEventListener('click', () => { for (const k of Object.keys(st)) delete st[k]; store.set('er', st); render(); $('#er-fb').innerHTML = ''; });
}


/* ================================================================
   Übung 6: Motion-Spezifikation (Markdown und PDF)
   ================================================================ */
/* ---------- Kleiner PDF-Schreiber (A4, Helvetica, WinAnsi) ohne externe Bibliothek ---------- */
const HELV_W = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const WIN_ANSI = { '€': 128, '‚': 130, '„': 132, '…': 133, '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149, '–': 150, '—': 151, '→': 0 };
function pdfChar(ch) {
  if (ch === '→') return '->';
  if (WIN_ANSI[ch]) return String.fromCharCode(WIN_ANSI[ch]);
  const c = ch.charCodeAt(0);
  if (c === 9) return ' ';
  return c < 256 ? ch : '?';
}
const pdfText = (t) => [...String(t)].map(pdfChar).join('');
function textWidth(t, size, bold) {
  let w = 0;
  for (const ch of t) { const c = ch.charCodeAt(0); w += (c >= 32 && c <= 126 ? HELV_W[c - 32] : 556); }
  return w * size / 1000 * (bold ? 1.08 : 1);
}
function wrap(t, size, max, bold) {
  const out = [];
  for (const para of String(t).split('\n')) {
    let line = '';
    for (const word of para.split(/ +/)) {
      const test = line ? line + ' ' + word : word;
      if (textWidth(test, size, bold) <= max || !line) line = test; else { out.push(line); line = word; }
    }
    out.push(line);
  }
  return out;
}
function makePdf(blocks, footer) {
  const W = 595.28, H = 841.89, M = 56, maxW = W - 2 * M;
  const pages = []; let ops = [], y = H - M;
  const esc = (t) => t.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const newPage = () => { pages.push(ops); ops = []; y = H - M; };
  const need = (h) => { if (y - h < M + 24) newPage(); };
  const text = (t, x, size, bold, rgb = '0.12 0.16 0.22') => ops.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${rgb} rg ${x.toFixed(2)} ${y.toFixed(2)} Td (${esc(t)}) Tj ET`);
  for (const b of blocks) {
    const size = b.size || 10.5, lh = size * 1.42, x = M + (b.indent || 0);
    if (b.space) y -= b.space;
    if (b.rule) { need(8); ops.push(`0.39 0.22 0.55 RG 1.6 w ${M} ${y.toFixed(2)} m ${W - M} ${y.toFixed(2)} l S`); y -= 14; continue; }
    const lines = wrap(pdfText(b.text), size, maxW - (b.indent || 0) - (b.box ? 18 : 0), b.bold);
    if (b.keep) need(lh * Math.min(lines.length, 2) + 30);
    lines.forEach((ln, i) => {
      need(lh);
      if (b.box && i === 0) {
        ops.push(`0.22 0.25 0.32 RG 0.9 w ${x} ${(y - 1.5).toFixed(2)} 9 9 re S`);
        if (b.checked) ops.push(`0.08 0.5 0.24 RG 1.4 w ${x + 2} ${(y + 3).toFixed(2)} m ${x + 4} ${(y + 0.5).toFixed(2)} l ${x + 7.5} ${(y + 6).toFixed(2)} l S`);
      }
      text(ln, x + (b.box ? 18 : 0), size, b.bold, b.rgb);
      y -= lh;
    });
    y -= b.after || 0;
  }
  pages.push(ops);
  const objs = [];
  const add = (o) => { objs.push(o); return objs.length; };
  add('<< /Type /Catalog /Pages 2 0 R >>');
  add(null);
  const f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const kids = [];
  pages.forEach((p, i) => {
    const foot = `BT /F1 8 Tf 0.29 0.33 0.39 rg ${M} 30 Td (${esc(pdfText(footer))}) Tj ET BT /F1 8 Tf ${W - M - 40} 30 Td (${esc(`Seite ${i + 1}/${pages.length}`)}) Tj ET`;
    const stream = p.concat(foot).join('\n');
    const c = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    kids.push(add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${c} 0 R >>`));
  });
  objs[1] = `<< /Type /Pages /Kids [${kids.map((k) => k + ' 0 R').join(' ')}] /Count ${kids.length} >>`;
  let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'; const offs = [];
  objs.forEach((o, i) => { offs.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('');
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const bytes = new Uint8Array(out.length);
  for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
  return new Blob([bytes], { type: 'application/pdf' });
}


const SPEC_PURPOSE = ['Rückmeldung', 'Zustandswechsel', 'Orientierung', 'Aufmerksamkeit', 'Zusammenhang', 'Persönlichkeit'];
function initSpec() {
  const st = Object.assign({ ds: 150, dm: 300, dl: 500, es: 'cubic-bezier(0.2, 0, 0, 1)', ee: 'cubic-bezier(0.05, 0.7, 0.1, 1)', ex: 'cubic-bezier(0.3, 0, 0.8, 0.15)', a: [{}, {}, {}] }, store.get('spec', {}));
  const inp = (k, label, ph, type = 'text') => `<label>${esc(label)}<input type="${type}" data-k="${k}" placeholder="${esc(ph)}"${type === 'number' ? ' min="0" max="2000" step="10"' : ''}></label>`;
  const sel = (k, label, opts) => `<label>${esc(label)}<select data-k="${k}"><option value="">Bitte wählen …</option>${opts.map((o) => `<option>${esc(o)}</option>`).join('')}</select></label>`;
  const ani = (i) => `<fieldset><legend>Animation ${i + 1}</legend>
    <div class="g2s">${inp(`a${i}.el`, 'Element und Auslöser', ['z. B. Bottom Sheet „Filter“, Tipp auf Filter-Button', 'z. B. Herz „Merken“, Tipp', 'z. B. Wechsel Liste → Detail, Tipp auf Karte'][i])}${sel(`a${i}.zw`, 'Zweck', SPEC_PURPOSE)}</div>
    <div class="g2s">${inp(`a${i}.mv`, 'Eigenschaft und Verlauf (von → nach)', ['z. B. translateY 100 % → 0', 'z. B. scale 0,6 → 1', 'z. B. Container-Transformation, Karte → Vollbild'][i])}${inp(`a${i}.rm`, 'Bei reduzierter Bewegung', ['z. B. Einblenden 150 ms', 'z. B. nur Farbwechsel', 'z. B. Überblendung 150 ms'][i])}</div>
    <div class="g2s">${sel(`a${i}.du`, 'Dauer-Token', ['short', 'medium', 'long'])}${sel(`a${i}.ea`, 'Easing-Token', ['standard', 'enter (abbremsen)', 'exit (beschleunigen)', 'Feder'])}</div></fieldset>`;
  $('#sp-form').innerHTML = `<fieldset><legend>Grundlagen</legend><div class="g">${inp('pr', 'Projekt oder App', 'z. B. CampusMensa')}${sel('pl', 'Plattform', ['iOS', 'Android', 'Web', 'Plattformübergreifend (z. B. Flutter)', 'Sonstige'])}${inp('ch', 'Bewegungscharakter in drei Wörtern', 'z. B. ruhig, präzise, freundlich')}</div></fieldset>
    <fieldset><legend>Tokens</legend><div class="g">${inp('ds', 'Dauer short (ms)', '150', 'number')}${inp('dm', 'Dauer medium (ms)', '300', 'number')}${inp('dl', 'Dauer long (ms)', '500', 'number')}</div><div class="g">${inp('es', 'Easing standard', 'cubic-bezier(…)')}${inp('ee', 'Easing enter', 'cubic-bezier(…)')}${inp('ex', 'Easing exit', 'cubic-bezier(…)')}</div></fieldset>
    ${[0, 1, 2].map(ani).join('')}`;
  const get = (k) => { const m = /^a(\d)\.(\w+)$/.exec(k); return m ? (st.a[+m[1]] || {})[m[2]] : st[k]; };
  const put = (k, v) => { const m = /^a(\d)\.(\w+)$/.exec(k); if (m) { st.a[+m[1]] = st.a[+m[1]] || {}; st.a[+m[1]][m[2]] = v; } else st[k] = v; };
  for (const el of $$('[data-k]')) el.value = get(el.dataset.k) ?? '';
  $('#sp-form').addEventListener('input', (e) => { const el = e.target.closest('[data-k]'); if (!el) return; put(el.dataset.k, el.type === 'number' ? (el.value === '' ? '' : +el.value) : el.value); store.set('spec', st); });
  const s = (v) => (v == null ? '' : String(v)).trim();
  const tok = (d) => ({ short: st.ds, medium: st.dm, long: st.dl }[d]);
  const md = () => `# Motion-Spezifikation: ${s(st.pr) || '…'}\n\nPlattform: ${s(st.pl) || '…'}  \nBewegungscharakter: ${s(st.ch) || '…'}\n\n## Tokens\n\n| Token | Wert |\n|---|---|\n| duration-short | ${s(st.ds)} ms |\n| duration-medium | ${s(st.dm)} ms |\n| duration-long | ${s(st.dl)} ms |\n| easing-standard | \`${s(st.es)}\` |\n| easing-enter | \`${s(st.ee)}\` |\n| easing-exit | \`${s(st.ex)}\` |\n\n## Animationen\n\n| Element und Auslöser | Zweck | Verlauf | Dauer | Easing | Reduzierte Bewegung |\n|---|---|---|---|---|---|\n${st.a.map((a) => `| ${s(a.el) || '…'} | ${s(a.zw) || '…'} | ${s(a.mv) || '…'} | ${a.du ? `${a.du} (${tok(a.du)} ms)` : '…'} | ${s(a.ea) || '…'} | ${s(a.rm) || '…'} |`).join('\n')}\n\nBei eingeschalteter Systemeinstellung „Bewegung reduzieren“ (prefers-reduced-motion) gilt die letzte Spalte.\n`;
  $('#spec-check').addEventListener('click', () => {
    const issues = [];
    if (s(st.pr).length < 2) issues.push('Geben Sie den Namen Ihres Projekts an.');
    if (!s(st.pl)) issues.push('Wählen Sie die Plattform.');
    if (s(st.ch).split(/[,\s]+/).filter(Boolean).length < 2) issues.push('Beschreiben Sie den Bewegungscharakter mit mindestens zwei Wörtern.');
    const d = [st.ds, st.dm, st.dl].map(Number);
    if (d.some((x) => !x || x < 50 || x > 1000)) issues.push('Alle Dauern sollten zwischen 50 und 1000 ms liegen.');
    else if (!(d[0] < d[1] && d[1] < d[2])) issues.push('Die Dauern sollten von short über medium zu long ansteigen.');
    else if (d[2] > 700) issues.push('„long“ über 700 ms wirkt im Interface meist zäh. Prüfen Sie, ob das nötig ist.');
    if (![st.es, st.ee, st.ex].every((e) => /^(cubic-bezier\(|linear|ease)/.test(s(e)))) issues.push('Die Easing-Tokens sollten gültige CSS-Werte sein, z. B. cubic-bezier(0.2, 0, 0, 1).');
    st.a.forEach((a, i) => {
      const miss = [['el', 'Element'], ['zw', 'Zweck'], ['mv', 'Verlauf'], ['du', 'Dauer'], ['ea', 'Easing'], ['rm', 'reduzierte Bewegung']].filter(([k]) => s(a[k]).length < 2).map(([, l]) => l);
      if (miss.length) issues.push(`Animation ${i + 1}: Es fehlt ${miss.join(', ')}.`);
      if (/\b(width|height|top|left|margin)\b/i.test(s(a.mv))) issues.push(`Animation ${i + 1} ändert eine Layout-Eigenschaft. Lässt sie sich mit transform umsetzen (Kapitel 10)?`);
      if (/exit/.test(s(a.ea)) && a.du === 'long') issues.push(`Animation ${i + 1}: Was verschwindet, braucht selten das lange Token.`);
    });
    $('#spec-fb').innerHTML = `<div class="feedback ${issues.length ? 'bad' : 'ok'}" role="status">${issues.length ? `<p><strong>Noch nicht ganz fertig.</strong></p>${issues.map((t) => `<p>• ${esc(t)}</p>`).join('')}` : '<p><strong>Ihre Spezifikation ist vollständig und stimmig.</strong> Laden Sie sie herunter und legen Sie sie ins Projekt-Repository.</p>'}</div>`;
    if (!issues.length) markDone('ue-spec');
  });
  $('#spec-md').addEventListener('click', () => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([md()], { type: 'text/markdown' })); a.download = 'motion-spezifikation.md'; a.click(); URL.revokeObjectURL(a.href);
    toast('Als motion-spezifikation.md gespeichert');
  });
  $('#spec-copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText(md()); toast('Spezifikation in die Zwischenablage kopiert'); } catch (e) { toast('Kopieren nicht möglich, bitte herunterladen'); } });
  $('#spec-pdf').addEventListener('click', () => {
    const P = '0.28 0.19 0.5';
    const sec = (t) => ({ text: t, bold: true, size: 11.5, rgb: P, space: 10, after: 3, keep: true });
    const row = (l, v) => ({ text: `${l}: ${s(v) || '–'}`, after: 2 });
    const blocks = [
      { text: 'LERNMODUL 08 · UX & ANIMATION · MOTION-SPEZIFIKATION', bold: true, size: 8, rgb: '0.8 0.31 0', after: 4 },
      { text: 'Motion-Spezifikation: ' + (s(st.pr) || '…'), bold: true, size: 18, rgb: P, space: 10, after: 6 },
      { rule: true },
      row('Plattform', st.pl), row('Bewegungscharakter', st.ch),
      sec('Dauer-Tokens'), row('duration-short', st.ds ? st.ds + ' ms' : ''), row('duration-medium', st.dm ? st.dm + ' ms' : ''), row('duration-long', st.dl ? st.dl + ' ms' : ''),
      sec('Easing-Tokens'), row('easing-standard', st.es), row('easing-enter', st.ee), row('easing-exit', st.ex),
      ...st.a.flatMap((a, i) => [sec(`Animation ${i + 1}: ${s(a.el) || '…'}`), row('Zweck', a.zw), row('Verlauf', a.mv), row('Dauer', a.du ? `${a.du} (${tok(a.du)} ms)` : ''), row('Easing', a.ea), row('Reduzierte Bewegung', a.rm)]),
      { text: 'Bei eingeschalteter Systemeinstellung „Bewegung reduzieren“ (prefers-reduced-motion) gilt jeweils die Angabe „Reduzierte Bewegung“.', size: 9, rgb: '0.36 0.38 0.44', space: 14 }
    ];
    const blob = makePdf(blocks, `Erstellt am ${new Date().toLocaleDateString('de-DE')} · Lernmodul 08 UX & Animation · designminb.github.io/lernapps`);
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'motion-spezifikation.pdf'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Als motion-spezifikation.pdf gespeichert');
  });
}


/* ================================================================
   Wissenstest
   ================================================================ */
const QUIZ = [
  ['Woran messen Sie, ob eine UI-Animation gut ist?', ['Sie fällt möglichst auf', 'Sie erfüllt eine Aufgabe für die Nutzenden, etwa Rückmeldung oder Orientierung', 'Sie dauert mindestens eine Sekunde', 'Sie nutzt alle zwölf Disney-Prinzipien'], 1, 'Animation ist ein Werkzeug. Wenn niemand etwas vermissen würde, ist sie Dekoration.'],
  ['Welches Easing passt für ein Element, das in den Screen hereinkommt?', ['ease-in (beschleunigen)', 'ease-out (abbremsen)', 'linear', 'steps()'], 1, 'Es ist sofort in Bewegung und kommt sanft dort an, wo der Blick hingeht.'],
  ['Welches Easing passt für ein Element, das den Screen verlässt?', ['ease-in (beschleunigen)', 'ease-out (abbremsen)', 'ease-in-out', 'Eine Feder mit viel Überschwingen'], 0, 'Es löst sich langsam und verschwindet zügig, ohne am Ende Aufmerksamkeit zu binden.'],
  ['Wie lange dauert typischerweise eine kleine Zustandsänderung wie ein Schalter?', ['10–50 ms', '100–200 ms', '500–800 ms', 'über 1 Sekunde'], 1, 'Kleine Rückmeldungen sind kurz. Große Übergänge über den ganzen Screen liegen bei etwa 300–500 ms.'],
  ['Bis zu welcher Antwortzeit wirkt eine Reaktion nach Nielsen unmittelbar?', ['0,1 Sekunden', '1 Sekunde', '3 Sekunden', '10 Sekunden'], 0, 'Bis 0,1 s fühlt es sich wie direkte Manipulation an. Bei 1 s bleibt der Gedankenfluss erhalten, ab 10 s schweift die Aufmerksamkeit ab.'],
  ['Warum darf das Ausblenden kürzer sein als das Einblenden?', ['Weil der Browser schneller rechnet', 'Weil das Element seine Aufgabe erfüllt hat und niemand darauf warten will', 'Weil die WCAG es vorschreiben', 'Das darf es nicht'], 1, 'Was erscheint, muss wahrgenommen werden. Was verschwindet, soll nicht aufhalten.'],
  ['Welche CSS-Eigenschaften lassen sich im Browser besonders flüssig animieren?', ['width und height', 'top und left', 'transform und opacity', 'margin und padding'], 2, 'Sie können vom Compositor auf der Grafikkarte berechnet werden, ohne Layout und Paint für jedes Bild.'],
  ['Was beschreibt cubic-bezier(x1, y1, x2, y2)?', ['Die Farbe einer Animation', 'Zwei Kontrollpunkte einer Kurve, die den Fortschritt über die Zeit festlegt', 'Die Dauer in Sekunden', 'Die Bildrate'], 1, 'Die Kurve verläuft von (0, 0) nach (1, 1). x ist die Zeit, y der Fortschritt.'],
  ['Was ist ein Vorteil von Federanimationen (Springs)?', ['Sie sind immer kürzer', 'Sie lassen sich mitten in der Bewegung umlenken und übernehmen die aktuelle Geschwindigkeit', 'Sie funktionieren ohne JavaScript in jedem Browser', 'Sie sind barrierefreier'], 1, 'Darum nutzen SwiftUI und Jetpack Compose standardmäßig Federn, gerade bei Gesten.'],
  ['Welche vier Teile hat eine Mikrointeraktion nach Dan Saffer?', ['Start, Mitte, Ende, Pause', 'Auslöser, Regeln, Rückmeldung, Schleifen und Modi', 'Farbe, Form, Bewegung, Ton', 'Planen, Bauen, Testen, Ausliefern'], 1, 'Saffer beschreibt das Modell in „Microinteractions“ (2013).'],
  ['Was bewirkt Staffelung (Staggering) in einer Liste?', ['Alle Elemente erscheinen gleichzeitig', 'Elemente erscheinen nacheinander mit kurzem Versatz und führen den Blick', 'Die Liste lädt schneller', 'Die Elemente werden größer'], 1, 'Üblich sind 20–50 ms Versatz. Die ganze Folge sollte nicht viel länger als eine halbe Sekunde dauern.'],
  ['Was ist ein Skeleton Screen?', ['Ein Fehlerbildschirm', 'Graue Platzhalter in der Form des kommenden Inhalts', 'Ein Startbildschirm mit Logo', 'Eine Animation in Dauerschleife'], 1, 'Er zeigt sofort die Struktur und lässt Wartezeit meist kürzer wirken als ein Spinner.'],
  ['Welches WCAG-Kriterium verlangt, dass sich automatisch startende Bewegung von mehr als fünf Sekunden anhalten lässt?', ['1.4.3', '2.2.2', '2.4.7', '3.3.1'], 1, '2.2.2 „Pausieren, beenden, ausblenden“, Stufe A. Es gilt zum Beispiel für Karussells und Hintergrundvideos.'],
  ['Was bedeutet die Media Query prefers-reduced-motion: reduce?', ['Das Gerät ist langsam', 'Die Person hat im System eingestellt, dass sie weniger Bewegung möchte', 'Der Akku ist fast leer', 'Der Bildschirm ist klein'], 1, 'Apps und Websites sollten dann große Bewegungen ersetzen und Dekoration weglassen.'],
  ['Wie gestalten Sie einen Seitenwechsel bei reduzierter Bewegung?', ['Gar nicht, der Inhalt springt einfach', 'Mit einer kurzen Überblendung statt einer Schiebebewegung', 'Mit einer langsameren Schiebebewegung', 'Mit einem Zoom'], 1, 'Reduzieren heißt nicht entfernen: Der Wechsel bleibt sichtbar, nur ohne großen Weg.']
];
function initQuiz() {
  const root = $('#quiz');
  let i = 0, score = 0, answers = [];
  const render = (focus) => {
    if (i >= QUIZ.length) {
      const pct = Math.round((score / QUIZ.length) * 100), best = store.get('quiz-best', 0);
      if (score > best) store.set('quiz-best', score);
      root.innerHTML = `<div class="quiz-result"><div class="label">Ihr Ergebnis</div><div class="big" tabindex="-1" id="quiz-res">${score}<small> / ${QUIZ.length}</small></div><p style="margin:12px auto;max-width:46ch">${pct >= 80 ? 'Sehr gut. Sie wissen, wie Bewegung im Interface wirkt und wie man sie gestaltet.' : pct >= 50 ? 'Solide Basis. Sehen Sie sich die Erklärungen zu den falschen Antworten noch einmal an.' : 'Lesen Sie die Kapitel 02 bis 10 noch einmal und versuchen Sie es dann erneut.'}</p><div class="dots" style="justify-content:center" aria-hidden="true">${answers.map((r) => `<span class="${r ? 'ok' : 'bad'}"></span>`).join('')}</div><p class="small muted">Bestes Ergebnis bisher: ${Math.max(best, score)} / ${QUIZ.length}</p><button class="btn btn-dark" type="button" id="quiz-restart">Test wiederholen</button></div>`;
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
  ['1981', 'The Illusion of Life: Disney Animation', 'Frank Thomas, Ollie Johnston', 'New York: Abbeville Press', 'Herkunft der zwölf Animationsprinzipien.'],
  ['1993', 'Animation: From Cartoons to the User Interface', 'Bay-Wei Chang, David Ungar', 'Proceedings UIST ’93, ACM', 'Überträgt die Prinzipien des Zeichentricks auf Benutzungsoberflächen.'],
  ['1993', 'Usability Engineering', 'Jakob Nielsen', 'San Diego: Academic Press', 'Enthält die drei Zeitgrenzen 0,1 s, 1 s und 10 s für Antwortzeiten.'],
  ['2010', 'Faster Progress Bars: Manipulating Perceived Duration with Visual Augmentations', 'Chris Harrison, Zhiquan Yeo, Scott E. Hudson', 'Proceedings CHI 2010, ACM', 'Studie dazu, wie die Gestaltung von Fortschrittsbalken die gefühlte Wartezeit verändert.'],
  ['2013', 'Microinteractions: Designing with Details', 'Dan Saffer', 'Sebastopol: O’Reilly', 'Das Modell aus Auslöser, Regeln, Rückmeldung sowie Schleifen und Modi.'],
  ['2015', 'Designing Safer Web Animation for Motion Sensitivity', 'Val Head', 'A List Apart', 'Welche Bewegungen Beschwerden auslösen können und wie man sie entschärft.'],
  ['2015', 'FLIP Your Animations', 'Paul Lewis', 'aerotwist.com', 'Die FLIP-Technik für performante Layout-Animationen.'],
  ['2016', 'Designing Interface Animation', 'Val Head', 'Brooklyn: Rosenfeld Media', 'Praxisbuch zu Zweck, Timing, Easing und Barrierefreiheit von UI-Animationen.'],
  ['2017', 'Animation at Work', 'Rachel Nabors', 'New York: A Book Apart', 'Kompakter Einstieg in Animation als Kommunikationsmittel im Web.'],
  ['Norm', 'Web Content Accessibility Guidelines (WCAG) 2.2', 'W3C', 'w3.org/TR/WCAG22 · 2023', 'Erfolgskriterien 2.2.2, 2.3.1 und 2.3.3 zu Bewegung und Blitzen.'],
  ['Online', 'Material Design 3: Motion', 'Google', 'm3.material.io/styles/motion', 'Übergangsmuster, Easing- und Dauer-Tokens, Federn.'],
  ['Online', 'Human Interface Guidelines: Motion', 'Apple', 'developer.apple.com/design', 'Plattformkonventionen für Bewegung auf iOS, iPadOS und macOS, inklusive „Bewegung reduzieren“.']
];

/* ================================================================
   Stichwortverzeichnis
   ================================================================ */
const GL = [
  ['Auslöser (Trigger)', 'Mikrointeraktion', 'Startet eine Mikrointeraktion, durch die Person (Tipp, Geste) oder durch das System.', 'mikro'],
  ['Bezier-Kurve', 'Easing', 'Kurve mit zwei Kontrollpunkten, in CSS als cubic-bezier(x1, y1, x2, y2).', 'easing'],
  ['Choreografie', 'Übergänge', 'Festgelegte Reihenfolge, in der sich mehrere Elemente bewegen.', 'uebergaenge'],
  ['Compositor', 'Umsetzung', 'Teil des Browsers, der Ebenen zusammensetzt. Animationen von transform und opacity laufen hier besonders flüssig.', 'umsetzung'],
  ['Container-Transformation', 'Übergänge', 'Übergang, bei dem ein Element zum neuen Screen wächst.', 'uebergaenge'],
  ['Dämpfung', 'Easing', 'Parameter einer Feder, der bestimmt, wie stark sie nachschwingt.', 'easing'],
  ['Design-Token', 'Umsetzung', 'Benannter Wert wie duration-medium oder easing-standard, den die ganze App verwendet.', 'umsetzung'],
  ['Durchblenden (Fade Through)', 'Übergänge', 'Alter Inhalt blendet aus, neuer blendet leicht vergrößert ein. Für Screens ohne direkten Zusammenhang.', 'uebergaenge'],
  ['Easing', 'Easing', 'Verlauf der Geschwindigkeit während einer Animation.', 'easing'],
  ['ease-in', 'Easing', 'Beschleunigender Verlauf, für Elemente, die den Screen verlassen.', 'easing'],
  ['ease-out', 'Easing', 'Abbremsender Verlauf, für Elemente, die hereinkommen.', 'easing'],
  ['Feder (Spring)', 'Easing', 'Physikalisch beschriebene Bewegung mit Steifigkeit, Dämpfung und Masse.', 'easing'],
  ['FLIP', 'Umsetzung', 'First, Last, Invert, Play: Layout sofort ändern und nur den Unterschied mit transform animieren.', 'umsetzung'],
  ['Frame (Bild)', 'Timing', 'Einzelbild einer Animation. Bei 60 Hz alle 16,7 ms.', 'timing'],
  ['Gemeinsame Achse (Shared Axis)', 'Übergänge', 'Beide Screens bewegen sich entlang derselben Achse, etwa bei Vor und Zurück.', 'uebergaenge'],
  ['Keyframe', 'Grundlagen', 'Festgelegter Zustand zu einem Zeitpunkt, zwischen dem die Animation vermittelt.', 'prinzipien'],
  ['Mikrointeraktion', 'Mikrointeraktion', 'Kleiner, abgeschlossener Moment mit einer Aufgabe, z. B. einen Schalter umlegen.', 'mikro'],
  ['Motion Design', 'Grundlagen', 'Gestaltung von Bewegung, im Interface: was sich wann, wie schnell und warum bewegt.', 'einleitung'],
  ['Optimistische Oberfläche', 'Laden', 'Zeigt das Ergebnis sofort und nimmt es nur bei einem Fehler zurück.', 'laden'],
  ['Parallax', 'Barrierefreiheit', 'Ebenen bewegen sich beim Scrollen unterschiedlich schnell. Häufiger Auslöser für Schwindel.', 'zugang'],
  ['prefers-reduced-motion', 'Barrierefreiheit', 'Media Query für die Systemeinstellung „Bewegung reduzieren“.', 'zugang'],
  ['Pull to Refresh', 'Mikrointeraktion', 'Liste nach unten ziehen, um sie zu aktualisieren.', 'ue-mikro'],
  ['Regeln', 'Mikrointeraktion', 'Unsichtbare Logik einer Mikrointeraktion: was passiert und was passieren darf.', 'mikro'],
  ['Rückmeldung (Feedback)', 'Mikrointeraktion', 'Zeigt, was passiert: durch Bewegung, Farbe, Text, Ton oder Vibration.', 'mikro'],
  ['Schleifen und Modi', 'Mikrointeraktion', 'Verhalten bei Wiederholung, nach längerer Zeit oder in Sonderfällen.', 'mikro'],
  ['Skeleton Screen', 'Laden', 'Graue Platzhalter in der Form des kommenden Inhalts.', 'laden'],
  ['Slow In and Slow Out', 'Grundlagen', 'Animationsprinzip: Bewegungen beginnen und enden langsamer. In UIs als Easing umgesetzt.', 'prinzipien'],
  ['Staffelung (Staggering)', 'Übergänge', 'Elemente starten nacheinander mit kurzem Versatz.', 'uebergaenge'],
  ['Timing', 'Timing', 'Dauer einer Animation. Bestimmt, wie schwer und schnell etwas wirkt.', 'timing'],
  ['View Transition API', 'Umsetzung', 'Browser-Schnittstelle, die Übergänge zwischen zwei Zuständen einer Seite erzeugt.', 'uebergaenge'],
  ['WCAG 2.2.2', 'Barrierefreiheit', 'Pausieren, beenden, ausblenden: automatische Bewegung über fünf Sekunden muss anhaltbar sein.', 'zugang'],
  ['WCAG 2.3.3', 'Barrierefreiheit', 'Animation durch Interaktionen lässt sich abschalten, außer sie ist notwendig (Stufe AAA).', 'zugang']
];

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
  $('#gl-az').addEventListener('click', (e) => { const a = e.target.closest('[data-jump]'); if (!a) return; e.preventDefault(); const t = $('#gl-' + a.dataset.jump); if (t) { t.setAttribute('tabindex', '-1'); t.scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'start' }); t.focus({ preventScroll: true }); } });
  render();
}


/* ================================================================
   Start
   ================================================================ */
function boot() {
  renderNav();
  renderTiles();
  renderPagers();
  initHero();
  const inits = [initIntro, initZweck, initBall, initPrinzipienBeispiele, initRace, initEaseCards, initBezier, initSpring, initMikro, initTransitions, initStagger, initLoading, initReduce, initPerf,
    initExEasing, initExTiming, initExZweck, initExMikro, initExReduce, initSpec, initQuiz, initLit, initGlossar];
  // Ein Fehler in einer Demo soll nicht das ganze Modul lahmlegen
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
