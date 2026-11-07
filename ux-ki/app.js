(() => {
'use strict';

/* ================================================================
   Hilfsfunktionen
   ================================================================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const RM = matchMedia('(prefers-reduced-motion: reduce)');

// Eigener Präfix, damit sich die Lern-Apps auf derselben Domain nicht in die Quere kommen
const store = {
  get(k, d) { try { const v = localStorage.getItem('ki1:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('ki1:' + k, JSON.stringify(v)); } catch (e) { /* Speicher nicht verfügbar */ } }
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
  modelle: 'M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4zM10 10h4v4h-4z',
  prozess: 'M2 12l5-6 5 6-5 6zM12 12l5-6 5 6-5 6z',
  prompting: 'M4 5h16v10H9l-5 4zM8 9h8M8 12h5',
  regie: 'M3 7h4l2-3h6l2 3h4v12H3zM12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
  bewertung: 'M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM14.5 14.5L20 20M7.5 10l2 2 3-3.5',
  bearbeitung: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3M17 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z',
  workflows: 'M3 5h6v5H3zM15 5h6v5h-6zM9 15h6v5H9zM9 7.5h6M6 10v3h6v2M18 10v3h-6',
  appdesign: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2',
  recht: 'M12 3v18M5 21h14M4 7h16M7 7l-3 7h6zM17 7l-3 7h6z',
  'ue-frontier': 'M3 17l4-6 3 4 4-8 3 5 4-4M3 21h18',
  'ue-mare': 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  'ue-kamera': 'M3 7h4l2-3h6l2 3h4v12H3zM12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 3l3 3',
  'ue-fehler': 'M12 3l10 18H2zM12 10v5M12 18v.5',
  'ue-bearbeitung': 'M4 4h16v16H4zM4 15l5-5 4 4 3-3 4 4',
  'ue-doku': 'M9 3h6v3H9zM6 5H4v16h16V5h-2M8 11h8M8 15h8M8 19h5',
  quiz: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6',
  literatur: 'M4 4h4v16H4zM10 4h4v16h-4zM16 5l3.5-1 3 15.5-3.5 1z',
  glossar: 'M5 4h12a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM5 18a2 2 0 0 1 2-2h12M9 8h6M9 11h4'
};

const PAGES = [
  { id: 'home', t: 'Übersicht' },
  { id: 'einleitung', t: 'Einleitung', sub: 'KI als Partnerin in der Gestaltung', group: 'Grundlagen' },
  { id: 'modelle', t: 'Wie Bildmodelle arbeiten', sub: 'Diffusion, latenter Raum, Jagged Frontier' },
  { id: 'prozess', t: 'KI im UX-Prozess', sub: 'Double Diamond und Mobile-Workflow' },
  { id: 'prompting', t: 'Prompting als Briefing', sub: 'Das (R)MARE(Z)-Prinzip' },
  { id: 'regie', t: 'Visuelle Regie', sub: 'Fotografie und Film im Prompt', group: 'Bilder' },
  { id: 'bewertung', t: 'KI-Bilder beurteilen', sub: 'Kriterien und typische Fehler' },
  { id: 'bearbeitung', t: 'Generative Bildbearbeitung', sub: 'Inpainting, Outpainting, Relighting' },
  { id: 'workflows', t: 'Werkzeuge und Workflows', sub: 'Vom Briefing zum Asset', group: 'Praxis' },
  { id: 'appdesign', t: 'KI-Screens und Barrierefreiheit', sub: 'Prüfen statt behaupten' },
  { id: 'recht', t: 'Recht, Ethik, Rolle', sub: 'Urheberrecht, AI Act, C2PA' },
  { id: 'ue-frontier', t: 'Stark oder schwach?', sub: 'Die Jagged Frontier einschätzen', group: 'Übungen', ex: 1 },
  { id: 'ue-mare', t: 'Prompt zerlegen', sub: 'Sätze den MARE-Bausteinen zuordnen', ex: 2 },
  { id: 'ue-kamera', t: 'Kamerasprache erkennen', sub: 'Sechs Bilder, sechs Anweisungen', ex: 3 },
  { id: 'ue-fehler', t: 'Bildfehler finden', sub: 'Ein echtes KI-Bild prüfen', ex: 4 },
  { id: 'ue-bearbeitung', t: 'Welche Bearbeitung passt?', sub: 'Technik wählen oder ablehnen', ex: 5 },
  { id: 'ue-doku', t: 'KI-Bild-Dokumentation', sub: 'Für Ihr eigenes Projekt', ex: 6 },
  { id: 'quiz', t: 'Wissenstest', sub: '15 Fragen', group: 'Wissen' },
  { id: 'literatur', t: 'Literatur', sub: 'Quellen und Bildnachweis' },
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
  const mk = (p, num) => `<a class="ptile" href="#${p.id}" data-tile="${p.id}"><div class="art"><img class="bg" src="media/tile-${p.id}.webp?v=2" alt="" loading="lazy">${p.ex ? '<span class="tag-ex">Übung</span><span class="tag-done" hidden>Erledigt</span>' : ''}<span class="chip-num" aria-hidden="true">${num}</span></div><div class="tile-body"><h3>${esc(p.t)}</h3><p>${esc(p.sub)}</p><span class="go">${p.ex ? 'Übung starten' : 'Kapitel öffnen'}</span></div></a>`;
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
  document.title = (id === 'home' ? '' : pageById(id).t + ' · ') + 'UX & KI Lernmodul';
  // Beim Seitenwechsel den Fokus auf die neue Überschrift setzen (WCAG 2.4.3)
  if (focus) { const h = $(`#p-${id} h1`); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  if (pageHooks[id]) pageHooks[id]();
  store.set('last', id);
  return true;
}
function route(e) {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) { show('home', !!e); return; }
  if (show(id, !!e)) return;
  // Sprungziel innerhalb eines Kapitels, z. B. #bildnachweis
  const t = document.getElementById(id), pg = t && t.closest('.page');
  if (pg) { show(pg.dataset.page); t.setAttribute('tabindex', '-1'); requestAnimationFrame(() => { t.scrollIntoView({ block: 'start' }); t.focus({ preventScroll: true }); }); return; }
  if (!$('.page.active')) show('home');
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
  if (!done.has(id)) { setDone(id, true); toast('Übung als erledigt gespeichert'); if (window.LernTrack) window.LernTrack.event('ki-' + id); }
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
/* Tab-Leiste aus Daten aufbauen: items = [{id, label}] */
function tabs(root, items, fn, start = 0) {
  root.innerHTML = items.map((it, i) => `<button type="button" data-id="${it.id}" aria-pressed="${i === start}">${esc(it.label)}</button>`).join('');
  onGroup(root, (b) => fn(items.find((it) => it.id === b.dataset.id)));
  fn(items[start]);
}

/* ================================================================
   Startseite: Video mit Pause-Knopf (WCAG 2.2.2)
   ================================================================ */
function initHero() {
  const v = $('#hero-video'), b = $('#hero-video-btn');
  const setBtn = (playing) => {
    b.setAttribute('aria-pressed', String(playing));
    b.innerHTML = playing
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg><span>Video anhalten</span>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span>Video abspielen</span>';
  };
  b.addEventListener('click', () => { if (v.paused) { v.play().catch(() => {}); setBtn(true); } else { v.pause(); setBtn(false); } store.set('video-off', v.paused); });
  v.addEventListener('pause', () => setBtn(false));
  v.addEventListener('play', () => setBtn(true));
  // Automatisch nur ohne „reduzierte Bewegung“ und nur auf der Startseite
  pageHooks.home = () => { if (!RM.matches && store.get('video-off', false) !== true) v.play().catch(() => {}); };
  leaveHooks.push(() => { if (!v.paused) v.pause(); });
}

/* ================================================================
   Kapitel 02: Diffusion und Token
   ================================================================ */
function initDiffusion() {
  const cv = $('#diff-canvas'), ctx = cv.getContext('2d', { willReadFrequently: true });
  const W = cv.width, H = cv.height;
  const img = new Image();
  let base = null, noise = null, timer = null;
  const tmp = document.createElement('canvas'); tmp.width = W; tmp.height = H;
  const tctx = tmp.getContext('2d', { willReadFrequently: true });
  // Rauschen einmal erzeugen, damit es beim Ziehen nicht flackert
  noise = new Uint8ClampedArray(W * H * 4);
  for (let i = 0; i < noise.length; i += 4) { noise[i] = Math.random() * 255; noise[i + 1] = Math.random() * 255; noise[i + 2] = Math.random() * 255; noise[i + 3] = 255; }
  const texts = [
    [0, 'Reines Rauschen. Hier beginnt jedes Bild. Ein anderer Zufallswert (Seed) ergibt ein anderes Bild.'],
    [8, 'Grobe Strukturen: Helle und dunkle Flächen, die Lage der großen Formen.'],
    [18, 'Formen und Farben werden erkennbar: Straße, Person, Gegenlicht.'],
    [29, 'Details entstehen: Kanten, Texturen, Lichtsäume.'],
    [30, 'Fertiges Bild. Bei echten Modellen sind es je nach Verfahren 20 bis 50 Schritte, bei schnellen Varianten nur 4.']
  ];
  const draw = (s) => {
    $('#diff-step').textContent = s;
    $('#diff-text').textContent = texts.filter(([k]) => s >= k).pop()[1];
    if (!base) return;
    const t = 1 - s / 30;
    tctx.filter = t > 0 ? `blur(${(t * 16).toFixed(1)}px)` : 'none';
    tctx.drawImage(img, ...base);
    tctx.filter = 'none';
    const d = tctx.getImageData(0, 0, W, H), p = d.data, a = Math.pow(t, 0.85);
    for (let i = 0; i < p.length; i += 4) {
      p[i] = p[i] * (1 - a) + noise[i] * a; p[i + 1] = p[i + 1] * (1 - a) + noise[i + 1] * a; p[i + 2] = p[i + 2] * (1 - a) + noise[i + 2] * a;
    }
    ctx.putImageData(d, 0, 0);
  };
  img.onload = () => {
    const r = Math.max(W / img.width, H / img.height), w = img.width * r, h = img.height * r;
    base = [(W - w) / 2, (H - h) / 2, w, h];
    draw(+$('#diff-range').value);
  };
  img.src = 'media/k-golden.webp';
  draw(0);
  const range = $('#diff-range');
  range.addEventListener('input', () => { clearTimeout(timer); draw(+range.value); });
  const stop = () => { clearTimeout(timer); timer = null; };
  $('#diff-play').addEventListener('click', () => {
    stop();
    let s = +range.value >= 30 ? 0 : +range.value;
    const tick = () => { range.value = s; draw(s); if (s < 30) { s++; timer = setTimeout(tick, 110); } };
    tick();
  });
  $('#diff-reset').addEventListener('click', () => { stop(); range.value = 0; draw(0); });
  leaveHooks.push(stop);
}

const TOK = {
  a: { add: 'Die beste Farbe für einen Call-to-Action-Button ist', c: [['Orange', .38, 'b'], ['Grün', .24, 'b'], ['Rot', .17, 'b'], ['Gelb', .12, 'b'], ['Blau', .07, 'b']] },
  b: { add: ', weil sie', c: [['Aufmerksamkeit erzeugt', .46], ['Energie vermittelt', .21], ['Vertrauen schafft', .18], ['zur Marke passt', .09]] }
};
function initToken() {
  let words = [], node = 'a';
  const render = () => {
    const n = TOK[node];
    $('#tok-sent').innerHTML = words.map((w, i) => i === words.length - 1 && words.length > 1 ? `<mark>${esc(w)}</mark>` : esc(w)).join(' ').replace(/ ,/g, ',') + (n ? ' …' : '.');
    if (!n) {
      $('#tok-cands').innerHTML = '<div class="feedback ok" role="status"><p><strong>Plausibel, aber stimmt es?</strong> Keine Farbe ist an sich „die beste“. Ob ein Button auffällt, hängt vom Kontrast zur Umgebung, von der Marke und von Konventionen ab. Das Modell wählt, was in seinen Daten oft so stand, nicht was in Ihrem Kontext richtig ist.</p></div>';
      return;
    }
    $('#tok-cands').innerHTML = n.c.map(([w, p], i) => `<button type="button" class="cand" data-i="${i}"><span>${esc(w)}</span><span class="bar" aria-hidden="true"><i style="width:${Math.round(p * 100 / n.c[0][1])}%"></i></span><span class="p">${Math.round(p * 100)}\u202F%</span></button>`).join('');
  };
  const start = () => { words = [TOK.a.add]; node = 'a'; render(); };
  $('#tok-cands').addEventListener('click', (e) => {
    const b = e.target.closest('.cand'); if (!b) return;
    const [w, , next] = TOK[node].c[+b.dataset.i];
    words.push(w);
    if (next) { words.push(TOK[next].add.trim()); node = next; } else node = null;
    render();
    const f = $('#tok-cands .cand') || $('#tok-reset'); f.focus();
  });
  $('#tok-reset').addEventListener('click', start);
  start();
}

/* ================================================================
   Kapitel 03: Double Diamond und Mobile-Workflow
   ================================================================ */
const DD = [
  { id: 'discover', label: 'Discover', sub: 'Entdecken', path: 'M0 30 L100 0 L100 60 Z', m: 'Empathie, User Research, Contextual Inquiry', ki: ['Interviews transkribieren und erste Muster finden', 'Fragebögen und Leitfäden entwerfen', 'Persona-Entwürfe aus echten Daten verdichten'], you: 'Gespräche selbst führen. KI-generierte Personas ersetzen nie echte Menschen, sie fassen höchstens zusammen, was Sie erhoben haben.' },
  { id: 'define', label: 'Define', sub: 'Definieren', path: 'M0 0 L100 30 L0 60 Z', m: 'Synthese, Point of View, „How might we …?“', ki: ['Erkenntnisse clustern', 'SWOT-Analysen vorbereiten', 'Problem Statements formulieren lassen und vergleichen'], you: 'Entscheiden, welches Problem gelöst wird. Das ist die wichtigste Entscheidung im ganzen Prozess, und sie bleibt bei Ihnen.' },
  { id: 'develop', label: 'Develop', sub: 'Entwickeln', path: 'M0 30 L100 0 L100 60 Z', m: 'Ideenfindung, Prototyping, Moodboards', ki: ['viele Varianten in kurzer Zeit', 'Wireframes und Screen-Varianten', 'Bildmaterial und Moodboards: Hier setzt Bildgenerierung an'], you: 'Varianten nach Kriterien bewerten, auswählen und weiterentwickeln. Erst wenn das Problem klar ist, lohnt sich das Generieren.' },
  { id: 'deliver', label: 'Deliver', sub: 'Umsetzen', path: 'M0 0 L100 30 L0 60 Z', m: 'Testing, Iteration, Implementierung', ki: ['Usability-Auffälligkeiten vorab analysieren', 'A/B-Varianten erzeugen', 'Texte und Microcopy überarbeiten', 'Code nach Spezifikation'], you: 'Mit echten Menschen testen und Ergebnisse verantworten. Wie das geht, zeigt das Lernmodul 06.' }
];
const MF = [
  { id: 'kontext', label: 'Kontext', ki: 'Zielgruppe, Jobs-to-be-done und Nutzungsszenarien ausarbeiten: Wo wird die App genutzt? Wie viel Zeit hat die Person? Welche Eingabe ist realistisch? Welche Emotion dominiert?', check: 'Stimmen die Annahmen mit Ihrer Recherche überein, oder hat die KI Klischees ergänzt?', p: 'Analysiere diese App-Idee entlang des Mobile-Design-Workflows: Kontext, Hauptaufgabe, User Flow, Screen-Typen, Accessibility-Risiken und Testfragen.' },
  { id: 'flow', label: 'Flow', ki: 'Flow-Varianten für die Hauptaufgabe erzeugen, inklusive Alternativen und Störungen.', check: 'Screens benannt? Nutzeraktionen klar? Systemfeedback definiert? Fehlerzustände vorhanden? Abbruch und Rücksprung möglich?', p: 'Erstelle einen User Flow für eine Mobilitäts-App. Ziel: In unter 30 Sekunden eine nachhaltige Route wählen. Nenne Screens, Nutzeraktionen, Systemfeedback und Fehlerzustände.' },
  { id: 'wireframe', label: 'Wireframe', ki: 'Grobe Layoutvarianten und Informationsarchitektur vorschlagen.', check: 'Mobile First: Ist die Hauptaufgabe zuerst gelöst? Liegt das Wichtigste in der Daumenzone?', p: 'Schlage drei Wireframe-Varianten für den Startscreen vor. Priorität: Was braucht die Person in den ersten fünf Sekunden?' },
  { id: 'screen', label: 'Screen', ki: 'Screens für typische Screen-Typen und passende Microcopy entwerfen.', check: 'Plattformkonventionen von iOS und Android? Touch-Ziele groß genug? Leere Zustände und Fehlerzustände gestaltet?', p: 'Entwickle für eine App zum nachhaltigen Pendeln je einen Screen für Onboarding, Home, Routenliste, Detailansicht, Empty State und Fehlerfall.' },
  { id: 'system', label: 'System', ki: 'Abweichungen vom Designsystem finden, Komponenten und Tokens vorschlagen.', check: 'KI-Screens wirken hochwertig, sind aber selten konsistent. Stimmen Farben, Abstände und Komponenten mit Ihren Tokens überein?', p: 'Vergleiche diese Screens mit unseren Design-Tokens (angehängt) und liste alle Abweichungen bei Farbe, Abstand, Schrift und Komponenten.' },
  { id: 'test', label: 'Test', ki: 'Testszenarien und Aufgaben für einen Usability-Test vorbereiten, Accessibility vorab prüfen.', check: 'Die KI ersetzt keinen Test mit Menschen. Sie hilft beim Vorbereiten und Auswerten.', p: 'Formuliere fünf realistische Testaufgaben für einen Usability-Test dieser App, ohne die Lösung im Aufgabentext zu verraten.' }
];
function initProzess() {
  const dd = $('#dd');
  dd.innerHTML = DD.map((p, i) => `<button type="button" data-id="${p.id}" aria-pressed="${i === 2}"><svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><path d="${p.path}"/></svg><span>${p.label}</span><small>${p.sub}</small></button>`).join('');
  const showDD = (p) => {
    $('#dd-panel').innerHTML = `<h3>${esc(p.label)} · ${esc(p.sub)}</h3><p class="small muted">${esc(p.m)}</p><div class="grid g2" style="margin:0"><div><div class="label">Wobei KI hilft</div><ul class="list small">${p.ki.map((k) => `<li>${esc(k)}</li>`).join('')}</ul></div><div><div class="label">Was Sie verantworten</div><p class="small" style="margin-top:8px">${esc(p.you)}</p></div></div>`;
  };
  onGroup(dd, (b) => showDD(DD.find((p) => p.id === b.dataset.id)));
  showDD(DD[2]);
  tabs($('#mf'), MF, (s) => {
    $('#mf-panel').innerHTML = `<h3>${esc(s.label)}</h3><p><strong>KI hilft:</strong> ${esc(s.ki)}</p><p><strong>Sie prüfen:</strong> ${esc(s.check)}</p><div class="label">Beispiel-Prompt</div><p class="ki-pre" style="margin:8px 0 0">${esc(s.p)}</p>`;
  });
}

/* ================================================================
   Kapitel 04: Prompt-Baukasten
   ================================================================ */
const PB = [
  { k: 'r', c: 'c-r', l: 'Rolle (optional)', ph: 'z. B. Du bist ein erfahrener Senior UX Designer …', ex: 'Du bist ein erfahrener Senior UX Designer und Experte für Mobile User Experience und Conversion-Optimierung.' },
  { k: 'm', c: 'c-m', l: 'Motivation: Warum?', ph: 'Kontext und Ziel des Projekts', ex: 'Wir entwickeln eine urbane E-Bike-Sharing-App für Pendler. 45 % der Nutzer verlassen die App während der Registrierung. Wir wollen Hürden abbauen und Vertrauen stärken, um die Absprungrate zu senken.', core: 1 },
  { k: 'a', c: 'c-a', l: 'Aufgabe: Was genau?', ph: 'klare, konkrete Handlungsanweisung', ex: 'Konzipiere einen nutzerfreundlichen, vierteiligen Onboarding-Flow. Beschreibe für jeden Screen das UX-Ziel, den psychologischen Auslöser und die wichtigsten UI-Elemente.', core: 1 },
  { k: 'res', c: 'c-res', l: 'Resultat: Welches Format?', ph: 'Format, Länge, Tonalität', ex: 'Erstelle eine Markdown-Tabelle mit den Spalten Screen, UX-Ziel, Psychologischer Auslöser und UI-Elemente. Tonfall: professionell, analytisch, praxisnah.', core: 1 },
  { k: 'e', c: 'c-e', l: 'Exempel: Woran orientieren?', ph: 'Beispiel oder Referenz', ex: 'Beispielzeile: Screen 1 „Willkommen“ | Mehrwert sofort zeigen | Benefit Framing | großes Bild, ein prägnanter Satz, Button „Loslegen“.', core: 1 },
  { k: 'z', c: 'c-z', l: 'Zusatzinfo (optional)', ph: 'Leitlinien, Hintergrund, Material', ex: 'Registrierung über Apple oder Google zusätzlich zur E-Mail. Den Ausweis fragen wir erst beim ersten Ausleihen ab, nicht im Onboarding.' }
];
const PB_COL = { r: '#4B5563', m: '#7A2862', a: '#A63F00', res: '#1D6B52', e: '#3E4C9A', z: '#6B5B2E' };
function initBuilder() {
  const st = Object.assign({}, store.get('pb', {}));
  $('#pb-form').innerHTML = PB.map((f) => `<label><span class="k"><i class="${f.c}" aria-hidden="true"></i>${esc(f.l)}</span><textarea rows="${f.core ? 3 : 2}" data-k="${f.k}" placeholder="${esc(f.ph)}"></textarea></label>`).join('');
  $('#pb-meter').innerHTML = PB.map(() => '<i></i>').join('');
  const fill = () => { for (const t of $$('#pb-form textarea')) t.value = st[t.dataset.k] || ''; };
  const render = () => {
    const parts = PB.filter((f) => (st[f.k] || '').trim());
    $('#pb-out').innerHTML = parts.length ? parts.map((f) => `<span style="border-color:${PB_COL[f.k]}">${esc(st[f.k].trim())}</span>`).join('\n\n') : '<span class="muted" style="border:0">Noch leer. Füllen Sie links mindestens Motivation und Aufgabe aus.</span>';
    PB.forEach((f, i) => $$('#pb-meter i')[i].classList.toggle('on', !!(st[f.k] || '').trim()));
    const core = PB.filter((f) => f.core && (st[f.k] || '').trim()).length;
    const miss = PB.filter((f) => f.core && !(st[f.k] || '').trim()).map((f) => f.l.split(':')[0]);
    $('#pb-status').textContent = core === 4 ? 'Alle vier Kernbausteine sind da. Testen Sie den Prompt und schärfen Sie gezielt nach.' : `Kernbausteine: ${core} von 4. Es fehlt: ${miss.join(', ')}.`;
  };
  $('#pb-form').addEventListener('input', (e) => { const t = e.target.closest('[data-k]'); if (!t) return; st[t.dataset.k] = t.value; store.set('pb', st); render(); });
  $('#pb-example').addEventListener('click', () => { for (const f of PB) st[f.k] = f.ex; store.set('pb', st); fill(); render(); toast('Beispiel aus dem Skript geladen'); });
  $('#pb-clear').addEventListener('click', () => { for (const f of PB) st[f.k] = ''; store.set('pb', st); fill(); render(); });
  $('#pb-copy').addEventListener('click', async () => {
    const txt = PB.filter((f) => (st[f.k] || '').trim()).map((f) => st[f.k].trim()).join('\n\n');
    if (!txt) { toast('Der Prompt ist noch leer'); return; }
    try { await navigator.clipboard.writeText(txt); toast('Prompt in die Zwischenablage kopiert'); } catch (e) { toast('Kopieren nicht möglich'); }
  });
  fill(); render();
}

/* ================================================================
   Kapitel 05: Regiepult und Prompt-Stile
   ================================================================ */
const KAM = [
  { id: 'k-24', label: '24 mm, Untersicht', p: 'Shot with a 24mm wide-angle lens from a low angle close to the ground, deep focus, overcast daylight', w: 'Die Straße zieht in die Tiefe, die Häuser kippen leicht nach innen, die Person wirkt groß und selbstbewusst. Der Raum erzählt mit.', use: 'Architektur, Orte, Dynamik', alt: 'Weitwinkelaufnahme aus der Untersicht: Die Frau mit Fahrrad steht auf einer langen Kopfsteinpflasterstraße zwischen alten Häusern' },
  { id: 'k-85', label: '85 mm, f/1.8', p: 'Portrait shot with an 85mm lens at f/1.8 at eye level, head and shoulders, very shallow depth of field', w: 'Der Hintergrund löst sich in Unschärfe auf, der Blick geht direkt zur Person. Die lange Brennweite verdichtet und schmeichelt.', use: 'Porträt, Testimonial, Team', alt: 'Porträt der Frau in gelber Regenjacke, der Hintergrund ist stark unscharf' },
  { id: 'k-top', label: 'Top Shot', p: 'Top shot, camera directly overhead looking straight down, graphic pattern of the cobblestones', w: 'Aus der Vogelperspektive wird die Szene zum Muster. Das wirkt grafisch und analytisch, aber distanziert.', use: 'Flatlay, Infografik, Übersicht', alt: 'Aufsicht von oben: Frau und Fahrrad auf einem Muster aus Pflastersteinen' },
  { id: 'k-golden', label: 'Golden Hour', p: '50mm lens at eye level, golden hour, low warm sun behind her creating a glowing backlight and long shadows', w: 'Warmes Gegenlicht legt einen Lichtsaum um Haare und Jacke. Die Stimmung wird emotional und einladend.', use: 'Kampagne, Lifestyle, Emotion', alt: 'Die Frau mit Fahrrad im warmen Gegenlicht der tief stehenden Sonne' },
  { id: 'k-lowkey', label: 'Low-Key, Rim Light', p: 'at night, low-key lighting, mostly deep black shadows, a single hard rim light from behind outlines her silhouette', w: 'Viel Schwarz, ein harter Lichtsaum von hinten. Das wirkt dramatisch, spannend und hochwertig, zeigt aber wenig Details.', use: 'Spannung, Premium, Nacht', alt: 'Nachtszene: Die Frau und das Fahrrad sind fast nur als beleuchtete Kontur vor dunkler Straße zu sehen' },
  { id: 'k-highkey', label: 'High-Key, Softbox', p: 'in a photo studio, high-key lighting with large studio softboxes, seamless pure white background, almost no shadows', w: 'Hell, sauber, fast schattenlos. Das Motiv lässt sich leicht freistellen. Die Szene wirkt sachlich, aber auch austauschbar.', use: 'Shop, Produkt, Katalog', alt: 'Die Frau mit Fahrrad vor reinweißem Studiohintergrund, gleichmäßig hell ausgeleuchtet' }
];
const PSTYLE = [
  { id: 'p-a', label: 'A: Bausteine-Liste', m: 'Seedream 5 Pro', p: 'Hero-Bild für eine mobile Banking-App, Zielgruppe 20–30, Person im rechten Drittel, Smartphone sichtbar, links Negativraum für Headline, 35mm, f/2.8, natürliches Fensterlicht, ruhig, vertrauenswürdig, keine Logos, kein lesbarer Displaytext.', o: 'Vorgaben weitgehend erfüllt, die Person steht aber eher mittig. Sauber, doch mit kühlem Stock-Look.', alt: 'Eine junge Person mit Smartphone sitzt etwa in der Bildmitte vor hellem Hintergrund' },
  { id: 'p-b', label: 'B: Erzählendes Briefing', m: 'Seedream 5 Pro', p: 'Eine junge Frau, Mitte zwanzig, sitzt entspannt in einem hellen Wohnzimmer am Fenster und schaut lächelnd auf ihr Smartphone. Sie befindet sich im rechten Bilddrittel, die linke Bildhälfte bleibt ruhig und hell, damit dort später eine Headline Platz hat. Weiches Tageslicht, warme, vertrauensvolle Stimmung. Auf dem Display ist kein lesbarer Text, im Bild gibt es keine Logos.', o: 'Warm und natürlich, Person rechts, ruhige Freifläche links. Passt am besten zu „vertrauenswürdig“.', alt: 'Eine junge Frau sitzt rechts im Bild am Fenster und schaut lächelnd auf ihr Smartphone, links ist eine ruhige helle Fläche' },
  { id: 'p-c', label: 'C: Minimal-Briefing', m: 'Magnific One', p: 'Hero-Bild für eine Banking-App: eine junge Person schaut entspannt auf ihr Smartphone, links Platz für eine Headline.', o: 'Stärkste Bildwirkung und größte Freifläche, aber ein trendiger Look und ein ungefragter Neon-Schriftzug. Die Vorgaben „ruhig“ und „keine Schrift“ fehlten im Prompt.', alt: 'Eine junge Frau in lila Jacke sitzt rechts im Sessel mit Smartphone, oben rechts leuchtet ein Neon-Schriftzug in Pink' }
];
function initRegie() {
  tabs($('#rg-tabs'), KAM, (k) => {
    const img = $('#rg-img'); img.src = `media/${k.id}.webp`; img.alt = k.alt;
    $('#rg-panel').innerHTML = `<div class="label">Geänderter Teil des Prompts</div><span class="mono">${esc(k.p)}</span><p style="margin-top:12px"><strong>Wirkung:</strong> ${esc(k.w)}</p><p><strong>Typischer Einsatz:</strong> ${esc(k.use)}</p><p class="small muted" style="margin:0">Achten Sie auch darauf, was sich ungewollt ändert: Gesicht, Fahrrad und Straße sind trotz gleichem Seed nicht identisch. Für echte Serien brauchen Sie Referenzbilder.</p>`;
  });
  tabs($('#ps-tabs'), PSTYLE, (s) => {
    const img = $('#ps-img'); img.src = `media/${s.id}.webp`; img.alt = s.alt;
    $('#ps-panel').innerHTML = `<div class="label">Modell: ${esc(s.m)}</div><p class="ki-pre" style="margin:8px 0 12px">${esc(s.p)}</p><p style="margin:0"><strong>Beobachtung:</strong> ${esc(s.o)}</p>`;
  });
}

/* ================================================================
   Kapitel 06: 3-Sekunden-Test
   ================================================================ */
function initThree() {
  const stage = $('#t3-stage'), q = $('#t3-q');
  let timer;
  $('#t3-start').addEventListener('click', () => {
    clearInterval(timer); q.innerHTML = '';
    stage.innerHTML = '<img src="media/p-b.webp" alt="Testbild, wird nach drei Sekunden ausgeblendet"><span class="count" aria-hidden="true">3</span>';
    let n = 3;
    timer = setInterval(() => {
      n--;
      if (n > 0) { $('.count', stage).textContent = n; return; }
      clearInterval(timer);
      stage.innerHTML = '<p class="ph">Bild ausgeblendet. Was ist hängen geblieben?</p>';
      q.innerHTML = `<p style="margin:0 0 10px"><strong>Welche Stimmung ist hängen geblieben?</strong></p><div class="options">${[['l', 'Ruhig und vertrauenswürdig'], ['r', 'Hektisch und laut'], ['o', 'Kühl und technisch'], ['n', 'Dramatisch und düster']].map(([k, t], i) => `<button type="button" class="opt" data-k="${k}"><span class="k">${'ABCD'[i]}</span>${t}</button>`).join('')}</div><div id="t3-fb"></div>`;
      $('.opt', q).focus();
    }, 1000);
  });
  q.addEventListener('click', (e) => {
    const b = e.target.closest('.opt'); if (!b) return;
    const ok = b.dataset.k === 'l';
    for (const x of $$('.opt', q)) { x.disabled = true; if (x.dataset.k === 'l') x.classList.add('right'); }
    if (!ok) b.classList.add('wrong');
    $('#t3-fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}" role="status" style="margin-top:12px"><p><strong>${ok ? 'So war es gedacht.' : 'Gedacht war: ruhig und vertrauenswürdig.'}</strong> Weiches Tageslicht, warme Töne und eine entspannte Haltung tragen die Wirkung. Kommt die beabsichtigte Stimmung nach drei Sekunden an, funktioniert das Bild. Vergleichen Sie Ihre Antwort im Team: Gehen die Eindrücke auseinander, ist das ein Hinweis auf eine unklare Bildaussage.</p></div>`;
    stage.innerHTML = '<img src="media/p-b.webp" alt="Eine junge Frau sitzt rechts im Bild am Fenster und schaut lächelnd auf ihr Smartphone, links ist eine ruhige helle Fläche">';
  });
  leaveHooks.push(() => clearInterval(timer));
}

/* ================================================================
   Kapitel 07: Vorher/Nachher
   ================================================================ */
const BA = [
  { id: 'entfernen', label: 'Objekt entfernen', a: 'b-base', b: 'b-entfernt', tool: 'Magnific, Ideogram 4.5 „Precise Edit“: „Entferne die Plastikflasche und die zerknüllte Serviette. Alles andere bleibt gleich.“', o: 'Flasche und Serviette sind verschwunden, Tisch und Kanne unverändert. Am Fensterrahmen rechts bleibt aber ein schwacher Umriss der Flasche stehen. Genau so etwas finden Sie nur, wenn Sie hineinzoomen.', warn: 1, altA: 'Graue Teekanne auf Holztisch, rechts daneben eine Plastikflasche und eine zerknüllte Serviette', altB: 'Dieselbe Szene ohne Flasche und Serviette, am Fensterrahmen ist ein schwacher Umriss der Flasche zu erkennen' },
  { id: 'frei', label: 'Freistellen', a: 'b-base', b: 'b-freigestellt', tool: 'Magnific „Hintergrund entfernen“ mit hellem Grund #F3EEF2', o: 'Saubere Kanten an Henkel und Deckelknauf. Flasche und Serviette wurden als Hintergrund erkannt und sind weg. Der Schatten fehlt. Im Shop ist das oft gewollt, sonst legen Sie einen weichen Schatten neu an.', altA: 'Graue Teekanne auf Holztisch mit Flasche und Serviette', altB: 'Die Teekanne allein vor hellem, einfarbigem Hintergrund' },
  { id: 'licht', label: 'Relighting', a: 'b-base', b: 'b-relight', tool: 'Magnific Relight: ein warmes Licht von links, flach einfallend', o: 'Die Stimmung wird warm wie am späten Nachmittag. Aber die graue Kanne wirkt jetzt beige. Für ein Stimmungsbild ist das in Ordnung. Für ein Produktfoto im Shop nicht, denn die Produktfarbe wäre verfälscht.', warn: 1, altA: 'Graue Teekanne in neutralem Tageslicht', altB: 'Dieselbe Szene in warmem, orangem Licht, die Kanne wirkt beige' },
  { id: 'out', label: 'Outpainting', a: 'b-base', b: 'b-expand', side: 1, tool: 'Magnific Expand von 4:3 auf 16:9 mit dem Hinweis „mehr Tisch und Wand, links eine Fensterkante“', o: 'Rechts und links sind Tisch, Wand und ein Fenster mit Garten dazugekommen. Das wirkt stimmig, ist aber erfunden: Den Garten gab es nie. Zudem ist das erweiterte Bild nur 1312 Pixel breit, für große Formate müsste es danach hochskaliert werden.', altA: 'Ausgangsbild im Format 4:3', altB: 'Erweitertes Bild im Format 16:9 mit zusätzlichem Fenster und Blick in einen Garten' },
  { id: 'up', label: 'Upscaling', a: 'b-up-vorher', b: 'b-up-nachher', tool: 'Magnific Upscaler, Modus „creative“, 2-fach, Voreinstellung „subtle“. Ausschnitt um den Deckel, stark vergrößert.', o: 'Kanten werden klarer, die Glasur wirkt glatter. Gleichzeitig bekommt die Wand eine feine Struktur, die es vorher nicht gab. Upscaling erfindet Details. Bei Dokumentationsbildern ist das heikel.', warn: 1, altA: 'Vergrößerter Ausschnitt des Deckels, etwas weich und unscharf', altB: 'Derselbe Ausschnitt nach dem Hochskalieren, schärfer, die Wand zeigt eine neue feine Struktur' }
];
function initBA() {
  tabs($('#ba-tabs'), BA, (s) => {
    const stage = $('#ba-stage');
    if (s.side) {
      stage.innerHTML = `<div class="ki-side"><figure><img src="media/${s.a}.webp" alt="${esc(s.altA)}" width="1200" height="900"><figcaption>Vorher · 4:3</figcaption></figure><figure><img src="media/${s.b}.webp" alt="${esc(s.altB)}" width="1200" height="675"><figcaption>Nachher · 16:9</figcaption></figure></div>`;
    } else {
      stage.innerHTML = `<div class="ki-ba"><img src="media/${s.a}.webp" alt="Vorher: ${esc(s.altA)}"><div class="after-wrap"><img src="media/${s.b}.webp" alt="Nachher: ${esc(s.altB)}"></div><span class="line" aria-hidden="true"></span><span class="lb l" aria-hidden="true">Vorher</span><span class="lb r" aria-hidden="true">Nachher</span></div><label class="ki-ba-range">Vergleich: links vorher, rechts nachher<input type="range" min="0" max="100" value="50" aria-valuetext="50 % nachher"></label>`;
      const r = $('input', stage), wrap = $('.after-wrap', stage), line = $('.line', stage);
      const set = () => { wrap.style.clipPath = `inset(0 0 0 ${r.value}%)`; line.style.left = r.value + '%'; r.setAttribute('aria-valuetext', `${100 - r.value} % nachher sichtbar`); };
      r.addEventListener('input', set); set();
    }
    $('#ba-info').innerHTML = `<p class="small muted" style="margin:12px 0 0"><strong>Werkzeug:</strong> ${esc(s.tool)}</p><div class="ki-obs${s.warn ? ' warn' : ''}"><strong>${s.warn ? 'Achtung: ' : 'Beobachtung: '}</strong>${esc(s.o)}</div>`;
  });
}

/* ================================================================
   Kapitel 09: Alt-Texte
   ================================================================ */
const ALT = [
  { id: 'icon', label: 'Lupen-Icon im Header', type: 'Funktional', t: 'Das Icon ist ein Button. Beschreiben Sie, was er tut, nicht wie er aussieht.', code: '<button aria-label="Suche öffnen">\n  <svg aria-hidden="true">…</svg>\n</button>', bad: '„Lupe“ oder „Icon“' },
  { id: 'chart', label: 'Diagramm Mensabesuche', type: 'Komplex', t: 'Die Kernaussage gehört in den Alt-Text, die Details in eine Tabelle oder einen Text daneben.', code: '<img src="besuche.png"\n  alt="Balkendiagramm: Die Mensabesuche stiegen 2026 um 18 Prozent, am stärksten dienstags.">\n<table>… Werte pro Wochentag …</table>', bad: '„Diagramm“' },
  { id: 'deko', label: 'Dekorative Welle', type: 'Dekorativ', t: 'Das Bild trägt keine Information. Ein leeres alt-Attribut sorgt dafür, dass Screenreader es überspringen.', code: '<img src="welle.svg" alt="">', bad: 'alt-Attribut weglassen (dann wird oft der Dateiname vorgelesen)' },
  { id: 'produkt', label: 'Produktfoto im Shop', type: 'Informativ', t: 'Beschreiben Sie knapp, was für die Kaufentscheidung zählt.', code: '<img src="teekanne.jpg"\n  alt="Graue Teekanne aus mattem Steinzeug, 1 Liter">', bad: '„Produktbild“ oder eine Bildbeschreibung mit Stimmung statt Fakten' }
];
function initAlt() {
  tabs($('#alt-tabs'), ALT, (a) => {
    $('#alt-panel').innerHTML = `<span class="ki-tag">${esc(a.type)}</span><p style="margin-top:10px">${esc(a.t)}</p><pre class="ki-pre" style="margin:10px 0"><code>${esc(a.code)}</code></pre><p class="small muted" style="margin:0"><strong>Nicht so:</strong> ${esc(a.bad)}</p>`;
  });
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
/* Zuordnungsübung: Liste aus Aussagen mit Auswahlfeld */
function selectExercise({ key, list, check, reset, fb, items, opts, pass, okText, badText, ex, render: custom }) {
  const st = store.get(key, {});
  const L = $(list);
  const render = () => {
    L.innerHTML = items.map((it, i) => custom ? custom(it, i, st) : `<div class="ki-ex-item" data-i="${i}"><h3>${i + 1}. ${esc(it[0])}</h3>${selectHtml(i, opts, st[i], 'Antwort zu ' + (i + 1))}<div class="why" hidden></div></div>`).join('');
  };
  render();
  L.addEventListener('change', (e) => { const s = e.target.closest('[data-sel]'); if (!s) return; st[s.dataset.sel] = s.value; store.set(key, st); });
  $(check).addEventListener('click', () => {
    let right = 0;
    items.forEach((it, i) => {
      const a = it[1], why = it[2], el = $(`.ki-ex-item[data-i="${i}"]`, L), ok = st[i] === a; if (ok) right++;
      el.classList.toggle('is-ok', ok); el.classList.toggle('is-bad', !ok);
      const w = $('.why', el); w.hidden = false;
      w.innerHTML = `<b class="${ok ? 'ok' : 'bad'}">${ok ? 'Richtig.' : 'Passender: ' + esc(opts.find((o) => o[0] === a)[1]) + '.'}</b> ${esc(why)}`;
    });
    if (resultBox($(fb), right, items.length, pass, okText, badText)) markDone(ex);
  });
  $(reset).addEventListener('click', () => { for (const k of Object.keys(st)) delete st[k]; store.set(key, st); render(); $(fb).innerHTML = ''; });
}

/* ---------- Übung 1: Jagged Frontier ---------- */
const FR_OPTS = [['s', 'KI ist hier meist stark'], ['w', 'KI ist hier überraschend schwach']];
const FR_ITEMS = [
  ['Zehn Varianten für eine Onboarding-Illustration erzeugen', 's', 'Variantenbildung in kurzer Zeit ist eine klassische Stärke.'],
  ['Prüfen, ob ein Bildmotiv zur Marke und zur Zielgruppe passt', 'w', 'Markenpassung und Zielgruppenfit verlangen Kontext und Urteil, die dem Modell fehlen.'],
  ['Die Fehlermeldungen einer App in einfache Sprache umformulieren', 's', 'Vereinfachen und Umformulieren gelingt meist sehr gut. Prüfen Sie trotzdem die fachliche Richtigkeit.'],
  ['Die Anzahl der Stühle auf einem generierten Café-Foto korrekt angeben', 'w', 'Zuverlässiges Zählen von Objekten oder Buchstaben ist eine bekannte Schwäche.'],
  ['Aus 30 Interview-Transkripten erste Themencluster bilden', 's', 'Große Textmengen strukturieren und zusammenfassen kann KI gut. Die Deutung bleibt Ihre Aufgabe.'],
  ['Eine Hand, die eine Tasse am Henkel greift, physikalisch korrekt darstellen', 'w', 'Kontaktpunkte und Greifen gehören weiter zu den kritischen Bildfehlern.'],
  ['Ein Wireframe für einen Standard-Login-Screen entwerfen', 's', 'Standardisierte Designaufgaben mit vielen Vorbildern liegen KI.'],
  ['Entscheiden, ob ein Bild mit erkennbaren Personen veröffentlicht werden darf', 'w', 'Ethische und rechtliche Abwägung und die Verantwortung dafür bleiben beim Menschen.'],
  ['Eine React-Komponente nach genauer Spezifikation schreiben', 's', 'Code nach klarer Spezifikation ist eine Stärke. Testen müssen Sie ihn trotzdem.'],
  ['Eine Bildidee entwickeln, die es so noch nie gab', 'w', 'Modelle erzeugen den wahrscheinlichsten Durchschnitt ihrer Daten. Echte Neuheit ohne Vorbild fällt ihnen schwer.']
];

/* ---------- Übung 2: MARE ---------- */
const MR_OPTS = [['r', 'Rolle'], ['m', 'Motivation'], ['a', 'Aufgabe'], ['res', 'Resultat'], ['e', 'Exempel'], ['z', 'Zusatzinfo']];
const MR_ITEMS = [
  ['„Du bist eine erfahrene Foodfotografin mit Gespür für junge Zielgruppen.“', 'r', 'Die Rolle lenkt Tonalität und Fachsprache. Sie ist optional.'],
  ['„Wir gestalten die Mensa-App unserer Hochschule neu. Viele Studierende halten das Essen für langweilig.“', 'm', 'Kontext und Problem: Warum entsteht das Bild?'],
  ['„Erzeuge ein Hero-Bild für die Startseite: eine frische Bowl auf einem Mensatablett, Studierende unscharf im Hintergrund.“', 'a', 'Die konkrete Handlungsanweisung: Was soll entstehen?'],
  ['„Format 16:9, links ein ruhiger Bereich für die Headline, kein Text und keine Logos im Bild.“', 'res', 'Format, Komposition und Ausschlüsse beschreiben das erwartete Ergebnis.'],
  ['„Orientiere dich an den zwei angehängten Fotos unserer letzten Kampagne: Tageslicht, warme Holztöne.“', 'e', 'Referenzbilder sind das stärkste Exempel für den Stil.'],
  ['„Die Mensa bietet täglich ein veganes Gericht an. Die App erscheint im Corporate Design der Hochschule.“', 'z', 'Hintergrundwissen, das die Gestaltung beeinflusst, aber keine Anweisung ist.'],
  ['„Ziel ist, dass mehr Studierende den Speiseplan in der App öffnen statt am Aushang.“', 'm', 'Das Ziel des Projekts gehört zur Motivation.'],
  ['„Liefere vier Varianten zur Auswahl.“', 'res', 'Anzahl und Form der Lieferung sind Teil des Resultats.']
];

/* ---------- Übung 3: Kamerasprache ---------- */
const KM_ORDER = ['k-golden', 'k-top', 'k-85', 'k-highkey', 'k-24', 'k-lowkey'];
const KM_OPTS = KAM.map((k) => [k.id, k.label]);
const KM_ITEMS = KM_ORDER.map((id) => { const k = KAM.find((x) => x.id === id); return [id, id, k.w]; });

/* ---------- Übung 5: Bearbeitung ---------- */
const BB_OPTS = [['inp', 'Objekt entfernen (Inpainting)'], ['out', 'Bild erweitern (Outpainting)'], ['frei', 'Freistellen'], ['relight', 'Relighting'], ['up', 'Upscaling'], ['no', 'Ablehnen: verfälscht die Aussage']];
const BB_ITEMS = [
  ['Ein Foto im Format 4:3 soll als 16:9-Banner mit Platz für die Headline erscheinen.', 'out', 'Outpainting erweitert die Fläche. Prüfen Sie, was dabei neu erfunden wird.'],
  ['Auf einem Stimmungsbild für die Startseite stört ein Stromkasten im Hintergrund.', 'inp', 'Ein Stimmungsbild dokumentiert nichts. Ein störendes Detail darf weg.'],
  ['Für den Online-Shop sollen alle Produkte vor einheitlich hellem Grund stehen.', 'frei', 'Freistellen trennt das Produkt vom Hintergrund, ohne es zu verändern.'],
  ['Ein altes Teamfoto mit 800 Pixeln Breite soll auf eine Messewand.', 'up', 'Upscaling erhöht die Auflösung. Prüfen Sie Gesichter genau, denn Details werden ergänzt.'],
  ['Fünf Kampagnenbilder aus verschiedenen Shootings sollen dieselbe warme Abendstimmung bekommen.', 'relight', 'Relighting vereinheitlicht die Lichtstimmung einer Serie.'],
  ['Im Shop soll ein Pullover zusätzlich in Dunkelgrün gezeigt werden. Diese Farbe gibt es nicht.', 'no', 'Das täuscht über das Produkt. KI darf die Produktidentität nicht verfälschen.'],
  ['Auf einem Pressefoto einer Demonstration sollen störende Plakate entfernt werden.', 'no', 'Ein dokumentarisches Bild würde verfälscht. Hier gilt die dokumentarische Wahrheit.']
];

/* ---------- Übung 4: Bildfehler ---------- */
const ER_ITEMS = [
  ['Die kleine Kreideschrift unten links auf der Tafel ergibt keinen Sinn.', true, 'Richtig: Kleinschrift besteht oft aus wortähnlichen, sinnlosen Zeichen.', 33.6, 32.5],
  ['Der Haupttext auf der Tafel enthält Rechtschreibfehler.', false, 'Er ist korrekt, sogar mit Umlauten. Kurze, große Texte gelingen heute meist.'],
  ['Hinter dem Milchkännchen leuchtet ein rotes Schild, das niemand verlangt hat und dessen Zeichen keinen Sinn ergeben.', true, 'Richtig: Ungefragte Schilder und Schriftzüge mit Fantasiezeichen sind typisch.', 66.8, 46.7],
  ['Die Hand, die das Kännchen hält, hat sechs Finger.', false, 'Die Hand ist anatomisch in Ordnung. Fehler an Händen sind seltener geworden.'],
  ['Der Kellner im Hintergrund trägt nur ein Glas, verlangt waren drei.', true, 'Richtig: Das Bild sieht stimmig aus, setzt den Prompt aber nicht vollständig um. Zählen ist eine Schwäche.', 23.5, 52],
  ['Der Milchstrahl fließt nach oben aus dem Kännchen.', false, 'Der Strahl fällt korrekt in die Tasse.'],
  ['Rechts auf der Tafel steht ein schräger Schriftzug aus sinnlosen Zeichen.', true, 'Richtig: Auch dieser kleine Text ist nicht lesbar.', 71.8, 27],
  ['Die Tasse hat keinen Henkel.', false, 'Die Tasse hat einen Henkel, links im Bild.']
];
function initFehler() {
  const st = store.get('er', {});
  const L = $('#er-list');
  const render = () => {
    L.innerHTML = ER_ITEMS.map(([t], i) => `<label data-i="${i}"><input type="checkbox" data-k="${i}"${st[i] ? ' checked' : ''}><span>${esc(t)}</span><span class="why" hidden></span></label>`).join('');
    for (const m of $$('.mk', $('#er-img'))) m.remove();
  };
  render();
  L.addEventListener('change', (e) => { const c = e.target.closest('[data-k]'); if (!c) return; st[c.dataset.k] = c.checked; store.set('er', st); });
  $('#er-check').addEventListener('click', () => {
    let right = 0, n = 0;
    for (const m of $$('.mk', $('#er-img'))) m.remove();
    ER_ITEMS.forEach(([, real, why, x, y], i) => {
      const el = $(`label[data-i="${i}"]`, L), ok = !!st[i] === real; if (ok) right++;
      el.classList.toggle('is-ok', ok); el.classList.toggle('is-bad', !ok);
      const w = $('.why', el); w.hidden = false;
      w.innerHTML = `<b style="color:var(${ok ? '--ok' : '--bad'})">${real ? `Echter Fehler (Markierung ${++n}).` : 'Kein Fehler.'}</b> ${esc(why)}`;
      if (real) $('#er-img').insertAdjacentHTML('beforeend', `<span class="mk" style="left:${x}%;top:${y}%" aria-hidden="true"><b>${n}</b></span>`);
    });
    if (resultBox($('#er-fb'), right, ER_ITEMS.length, 7, 'Sie prüfen gründlich. Die Fehler sitzen in Details, nicht im Hauptmotiv.', 'Zoomen Sie hinein und lesen Sie jeden Text Buchstabe für Buchstabe. Die Markierungen im Bild zeigen, wo die Fehler sitzen.')) markDone('ue-fehler');
  });
  $('#er-reset').addEventListener('click', () => { for (const k of Object.keys(st)) delete st[k]; store.set('er', st); render(); $('#er-fb').innerHTML = ''; });
}

/* ---------- Übung 6: Dokumentation ---------- */
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

const DK_CHECKS = [['tech', 'Anatomie, Text, Physik und Artefakte geprüft (200 % Zoom)'], ['brand', 'Bildsprache, Marke und Zielgruppe geprüft'], ['rights', 'keine realen Personen, Logos oder geschützten Stile nachgebildet'], ['bias', 'Stereotype und Einseitigkeit geprüft'], ['c2pa', 'Content Credentials (C2PA) erhalten, falls das Werkzeug sie setzt'], ['second', 'eine zweite Person hat das Bild geprüft']];
const DK_SHARE = ['Vollständig KI-generiert', 'KI-generiert und nachbearbeitet', 'Eigene Gestaltung mit KI-Elementen'];
const DK_LABEL = ['Ja, sichtbar gekennzeichnet', 'Nicht nötig: kein Deepfake, KI-Einsatz im Projekt dokumentiert', 'Noch offen'];
function initDoku() {
  const st = Object.assign({ c: {} }, store.get('dk', {}));
  const inp = (k, label, ph, type = 'text') => `<label>${esc(label)}<input type="${type}" data-k="${k}" placeholder="${esc(ph)}"></label>`;
  const ta = (k, label, ph, rows = 3) => `<label>${esc(label)}<textarea data-k="${k}" rows="${rows}" placeholder="${esc(ph)}"></textarea></label>`;
  const sel = (k, label, opts) => `<label>${esc(label)}<select data-k="${k}"><option value="">Bitte wählen …</option>${opts.map((o) => `<option>${esc(o)}</option>`).join('')}</select></label>`;
  $('#dk-form').innerHTML = `<fieldset><legend>Bild und Einsatz</legend><div class="g">${inp('pr', 'Projekt', 'z. B. CampusMensa-App')}${inp('use', 'Verwendung', 'z. B. Hero-Bild Startseite, 16:9')}${inp('date', 'Datum', '', 'date')}</div></fieldset>
    <fieldset><legend>Entstehung</legend><div class="g2s">${inp('tool', 'Werkzeug oder Plattform', 'z. B. Magnific, Midjourney, ComfyUI')}${inp('model', 'Modell und Version', 'z. B. FLUX 2, Seed 4242')}</div>
    ${ta('prompts', 'Prompt-Versionen (eine pro Zeile, die gewählte zuletzt)', 'V1: …\nV2: …', 4)}
    ${ta('refs', 'Referenzbilder und Quellen', 'z. B. zwei Kampagnenfotos 2025 (eigene Rechte), Moodboard', 2)}</fieldset>
    <fieldset><legend>Eigenleistung</legend>${ta('edit', 'Manuelle Bearbeitungsschritte', 'z. B. Ausschnitt, Farbkorrektur in Photoshop, Logo und Headline im Layout gesetzt', 3)}
    <div class="g2s">${sel('share', 'KI-Anteil', DK_SHARE)}${inp('lic', 'Nutzungsrechte und Lizenz', 'z. B. kommerzielle Nutzung laut AGB erlaubt')}</div></fieldset>
    <fieldset><legend>Prüfung und Kennzeichnung</legend><div class="cb">${DK_CHECKS.map(([k, t]) => `<label><input type="checkbox" data-c="${k}">${esc(t)}</label>`).join('')}</div>${sel('label', 'Kennzeichnung', DK_LABEL)}</fieldset>`;
  for (const el of $$('#dk-form [data-k]')) el.value = st[el.dataset.k] ?? '';
  for (const el of $$('#dk-form [data-c]')) el.checked = !!st.c[el.dataset.c];
  $('#dk-form').addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.k) st[el.dataset.k] = el.value; else if (el.dataset.c) st.c[el.dataset.c] = el.checked; else return;
    store.set('dk', st);
  });
  $('#dk-form').addEventListener('change', (e) => { const el = e.target; if (el.dataset.c) { st.c[el.dataset.c] = el.checked; store.set('dk', st); } });
  const s = (v) => (v == null ? '' : String(v)).trim();
  const dateDe = () => s(st.date) ? new Date(st.date + 'T12:00').toLocaleDateString('de-DE') : '';
  const checked = () => DK_CHECKS.filter(([k]) => st.c[k]).map(([, t]) => t);
  const md = () => `# KI-Bild-Dokumentation: ${s(st.pr) || '…'}\n\n| Feld | Angabe |\n|---|---|\n| Verwendung | ${s(st.use) || '…'} |\n| Datum | ${dateDe() || '…'} |\n| Werkzeug | ${s(st.tool) || '…'} |\n| Modell | ${s(st.model) || '…'} |\n| KI-Anteil | ${s(st.share) || '…'} |\n| Nutzungsrechte | ${s(st.lic) || '…'} |\n| Kennzeichnung | ${s(st.label) || '…'} |\n\n## Prompt-Versionen\n\n${s(st.prompts).split('\n').filter(Boolean).map((l) => '- ' + l).join('\n') || '…'}\n\n## Referenzen und Quellen\n\n${s(st.refs) || '…'}\n\n## Manuelle Bearbeitung\n\n${s(st.edit) || '…'}\n\n## Prüfung\n\n${DK_CHECKS.map(([k, t]) => `- [${st.c[k] ? 'x' : ' '}] ${t}`).join('\n')}\n`;
  $('#dk-check').addEventListener('click', () => {
    const issues = [];
    const need = [['pr', 'den Projektnamen'], ['use', 'die Verwendung'], ['date', 'das Datum'], ['tool', 'das Werkzeug'], ['model', 'Modell und Version']];
    const miss = need.filter(([k]) => s(st[k]).length < 2).map(([, t]) => t);
    if (miss.length) issues.push('Es fehlt: ' + miss.join(', ') + '.');
    if (s(st.prompts).length < 15) issues.push('Notieren Sie die Prompts, mindestens die gewählte Version.');
    if (s(st.edit).length < 10) issues.push('Beschreiben Sie Ihre manuellen Schritte. Sie belegen Ihre Eigenleistung (Kapitel 10).');
    if (!s(st.share)) issues.push('Wählen Sie den KI-Anteil.');
    if (s(st.lic).length < 3) issues.push('Halten Sie fest, ob die Nutzungsrechte geprüft sind.');
    if (checked().length < 4) issues.push(`Sie haben ${checked().length} von ${DK_CHECKS.length} Prüfungen bestätigt. Mindestens die ersten vier sollten erledigt sein.`);
    else if (!st.c.tech || !st.c.rights) issues.push('Die technische Prüfung und die Prüfung auf Rechte Dritter sind Pflicht.');
    if (!s(st.label)) issues.push('Entscheiden Sie über die Kennzeichnung.');
    else if (st.label === DK_LABEL[2]) issues.push('Die Kennzeichnung ist noch offen. Klären Sie, ob das Bild als Deepfake gelten könnte (Art. 50 Abs. 4 AI Act).');
    $('#dk-fb').innerHTML = `<div class="feedback ${issues.length ? 'bad' : 'ok'}" role="status">${issues.length ? `<p><strong>Noch nicht ganz fertig.</strong></p>${issues.map((t) => `<p>• ${esc(t)}</p>`).join('')}` : '<p><strong>Ihre Dokumentation ist vollständig.</strong> Laden Sie sie herunter und legen Sie sie zu den Projektdaten.</p>'}</div>`;
    if (!issues.length) markDone('ue-doku');
  });
  const dl = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
  $('#dk-md').addEventListener('click', () => { dl(new Blob([md()], { type: 'text/markdown' }), 'ki-bild-dokumentation.md'); toast('Als ki-bild-dokumentation.md gespeichert'); });
  $('#dk-copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText(md()); toast('Dokumentation in die Zwischenablage kopiert'); } catch (e) { toast('Kopieren nicht möglich, bitte herunterladen'); } });
  $('#dk-pdf').addEventListener('click', () => {
    const P = '0.48 0.16 0.38';
    const sec = (t) => ({ text: t, bold: true, size: 11.5, rgb: P, space: 10, after: 3, keep: true });
    const row = (l, v) => ({ text: `${l}: ${s(v) || '–'}`, after: 2 });
    const blocks = [
      { text: 'LERNMODUL 08 · UX & KI · KI-BILD-DOKUMENTATION', bold: true, size: 8, rgb: '0.8 0.31 0', after: 4 },
      { text: 'KI-Bild-Dokumentation: ' + (s(st.pr) || '…'), bold: true, size: 18, rgb: P, space: 10, after: 6 },
      { rule: true },
      row('Verwendung', st.use), row('Datum', dateDe()), row('Werkzeug', st.tool), row('Modell', st.model), row('KI-Anteil', st.share), row('Nutzungsrechte', st.lic), row('Kennzeichnung', st.label),
      sec('Prompt-Versionen'), ...(s(st.prompts).split('\n').filter(Boolean).map((l) => ({ text: '• ' + l, after: 2 })).concat(s(st.prompts) ? [] : [{ text: '–' }])),
      sec('Referenzen und Quellen'), { text: s(st.refs) || '–' },
      sec('Manuelle Bearbeitung'), { text: s(st.edit) || '–' },
      sec('Prüfung'), ...DK_CHECKS.map(([k, t]) => ({ text: t, box: true, checked: !!st.c[k], after: 3 }))
    ];
    dl(makePdf(blocks, `Erstellt am ${new Date().toLocaleDateString('de-DE')} · Lernmodul 08 UX & KI · designminb.github.io/lernapps`), 'ki-bild-dokumentation.pdf');
    toast('Als ki-bild-dokumentation.pdf gespeichert');
  });
}

/* ================================================================
   Wissenstest
   ================================================================ */
const QUIZ = [
  ['Wie erzeugt ein Diffusionsmodell ein Bild?', ['Es setzt passende Fotos aus einer Datenbank zusammen', 'Es entfernt schrittweise Rauschen, gelenkt vom Prompt', 'Es zeichnet zuerst Umrisse und füllt sie dann', 'Es sucht das ähnlichste Bild im Internet'], 1, 'Aus zufälligem Rauschen entsteht in 20 bis 50 Schritten ein Bild. Zuerst grobe Formen, dann Details.'],
  ['Was ist der latente Raum?', ['Der Speicherplatz für generierte Bilder', 'Ein komprimierter Bedeutungsraum, in dem ähnliche Konzepte nah beieinander liegen', 'Der unsichtbare Rand eines Bildes', 'Die Warteschlange auf dem Server'], 1, 'Wie eine Bibliothek, die nach Inhalt statt nach Titel sortiert ist. Kleine Prompt-Änderungen verschieben das Ergebnis nur wenig.'],
  ['Warum sind Halluzinationen und Bildfehler bei generativer KI normal?', ['Weil die Server überlastet sind', 'Weil Modelle Wahrscheinlichkeiten berechnen und nicht verstehen, was sie zeigen', 'Weil Prompts immer zu kurz sind', 'Weil nur alte Modelle Fehler machen'], 1, 'Plausibel heißt nicht richtig. Darum lautet die dritte Grundregel: Ergebnisse immer prüfen.'],
  ['Was beschreibt die „Jagged Frontier“?', ['Die Grenze zwischen Foto und Illustration', 'KI ist bei manchen schwer wirkenden Aufgaben stark und bei manchen einfach wirkenden schwach', 'Die maximale Auflösung eines Bildmodells', 'Den Rand beim Outpainting'], 1, 'Der Begriff stammt aus einer Studie von Dell’Acqua, Mollick u. a. (2023).'],
  ['In welcher Phase des Double Diamond setzt Bildgenerierung sinnvoll an?', ['Discover', 'Define', 'Develop', 'Bevor das Projekt beginnt'], 2, 'Erst wenn das Problem in „Define“ klar ist, lohnt sich das Generieren von Varianten.'],
  ['Wofür steht das M im (R)MARE(Z)-Prinzip?', ['Modell', 'Motivation', 'Medium', 'Maske'], 1, 'Motivation: Warum mache ich das? Kontext und Ziel des Projekts.'],
  ['Welches „Exempel“ wirkt bei Bildmodellen meist am stärksten?', ['Ein langer Text über den Stil', 'Referenzbilder', 'Möglichst viele Adjektive', 'Ein Hinweis auf die Bildauflösung'], 1, 'Referenzbilder zeigen den gewünschten Stil direkter als jede Beschreibung.'],
  ['Sie wollen ein Porträt mit unscharfem Hintergrund. Welche Angabe passt?', ['24mm, f/11', '85mm, f/1.8', 'Top Shot', 'deep focus'], 1, 'Lange Brennweite und offene Blende ergeben eine geringe Schärfentiefe.'],
  ['Wie wirkt „low-key lighting“?', ['Hell und schattenlos', 'Dramatisch, mit viel Schatten', 'Warm wie bei Sonnenuntergang', 'Neutral wie im Studio'], 1, 'Low-Key heißt: überwiegend dunkel, wenige Lichter. Das Gegenteil ist High-Key.'],
  ['Wie prüfen Sie Text in KI-Bildern?', ['Gar nicht, Text gelingt heute immer', 'Buchstabe für Buchstabe, besonders Kleinschrift und Umlaute', 'Nur die Überschrift', 'Mit der Rechtschreibprüfung des Browsers'], 1, 'Kurze Headlines gelingen meist, kleine und lange Texte oft nicht.'],
  ['Was ist Outpainting?', ['Ein Objekt aus dem Bild entfernen', 'Das Bild über seinen Rand hinaus erweitern', 'Das Bild in eine Illustration umwandeln', 'Die Auflösung erhöhen'], 1, 'Dabei entsteht neuer Inhalt, der im Original nie existierte.'],
  ['Welche Bearbeitung ist bei einem Produktfoto im Onlineshop nicht vertretbar?', ['Hintergrund freistellen', 'Einen Fussel vom Hintergrund entfernen', 'Die Produktfarbe durch Relighting verändern', 'Das Bild für den Druck hochskalieren'], 2, 'KI darf ein Bild verbessern, aber nicht die Produktidentität verfälschen.'],
  ['Ist ein reiner KI-Output nach deutschem Urheberrecht geschützt?', ['Ja, immer', 'In der Regel nein, weil nur Menschen Urheber sein können', 'Ja, wenn der Prompt lang genug ist', 'Nur bei kostenpflichtigen Werkzeugen'], 1, 'Nach § 2 UrhG sind nur persönliche geistige Schöpfungen geschützt. Eigene gestalterische Arbeit kann Schutz begründen.'],
  ['Was ist C2PA?', ['Ein Bildformat wie JPEG', 'Ein offener Standard für signierte Herkunftsangaben in Mediendateien', 'Ein KI-Modell von Adobe', 'Eine Prüfstelle der EU'], 1, 'Content Credentials halten fest, wer ein Bild wie erstellt und bearbeitet hat und ob KI beteiligt war.'],
  ['Ein Lupen-Icon öffnet die Suche. Welcher Alt-Text passt?', ['„Lupe“', '„Icon“', '„Suche öffnen“', 'kein Alt-Text'], 2, 'Bei funktionalen Bildern beschreiben Sie die Funktion, nicht das Aussehen.']
];
function initQuiz() {
  const root = $('#quiz');
  let i = 0, score = 0, answers = [];
  const render = (focus) => {
    if (i >= QUIZ.length) {
      const pct = Math.round((score / QUIZ.length) * 100), best = store.get('quiz-best', 0);
      if (score > best) store.set('quiz-best', score);
      root.innerHTML = `<div class="quiz-result"><div class="label">Ihr Ergebnis</div><div class="big" tabindex="-1" id="quiz-res">${score}<small> / ${QUIZ.length}</small></div><p style="margin:12px auto;max-width:46ch">${pct >= 80 ? 'Sehr gut. Sie wissen, wie generative KI arbeitet und wie Sie sie in der Gestaltung verantwortungsvoll einsetzen.' : pct >= 50 ? 'Solide Basis. Sehen Sie sich die Erklärungen zu den falschen Antworten noch einmal an.' : 'Lesen Sie die Kapitel 02 bis 10 noch einmal und versuchen Sie es dann erneut.'}</p><div class="dots" style="justify-content:center" aria-hidden="true">${answers.map((r) => `<span class="${r ? 'ok' : 'bad'}"></span>`).join('')}</div><p class="small muted">Bestes Ergebnis bisher: ${Math.max(best, score)} / ${QUIZ.length}</p><button class="btn btn-dark" type="button" id="quiz-restart">Test wiederholen</button></div>`;
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
   Literatur und Bildnachweis
   ================================================================ */
const LIT = [
  ['2020', 'Denoising Diffusion Probabilistic Models', 'Jonathan Ho, Ajay Jain, Pieter Abbeel', 'Advances in Neural Information Processing Systems (NeurIPS) 33', 'Grundlagenarbeit zum Entrauschen als Bildgenerierung.'],
  ['2022', 'High-Resolution Image Synthesis with Latent Diffusion Models', 'Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, Björn Ommer', 'Proceedings CVPR 2022', 'Diffusion im latenten Raum, Grundlage von Stable Diffusion.'],
  ['2023', 'Navigating the Jagged Technological Frontier', 'Fabrizio Dell’Acqua, Ethan Mollick u. a.', 'Harvard Business School Working Paper 24-013', 'Feldstudie mit Beratenden, Ursprung des Begriffs „Jagged Frontier“.'],
  ['2023', 'Web Content Accessibility Guidelines (WCAG) 2.2', 'W3C', 'w3.org/TR/WCAG22', 'Rahmen für die Prüfung KI-generierter Screens, Stufe AA als Ziel.'],
  ['2024', 'Verordnung (EU) 2024/1689 (KI-Verordnung, „AI Act“)', 'Europäisches Parlament und Rat', 'eur-lex.europa.eu', 'Art. 50 regelt die Transparenz- und Kennzeichnungspflichten.'],
  ['2025', 'Effective context engineering for AI agents', 'Anthropic', 'anthropic.com/engineering, 29.09.2025', 'Warum relevanter Kontext mehr bringt als immer längere Anweisungen.'],
  ['2026', 'Image generation models prompting guide', 'OpenAI', 'platform.openai.com, 21.04.2026', 'Hinweise zum Prompting von GPT Image, u. a. zu Text im Bild und Edits.'],
  ['2026', 'Vibe Coding hat sich verändert', 'Niklas Steenfatt', 'YouTube, 16.10.2026', 'Einschätzung zum Wandel des Promptings, im Skript auf die Gestaltung übertragen.'],
  ['2026', 'Design und künstliche Intelligenz', 'Thomas Hinz', 'Vorlesungsskript, Hochschule Karlsruhe, Stand 10/2026', 'Grundlage dieses Lernmoduls.'],
  ['Norm', 'C2PA Technical Specification', 'Coalition for Content Provenance and Authenticity', 'c2pa.org', 'Standard für signierte Herkunftsangaben (Content Credentials).'],
  ['Online', 'Images Tutorial und Alt Decision Tree', 'W3C Web Accessibility Initiative', 'w3.org/WAI/tutorials/images', 'Entscheidungshilfe für Alt-Texte nach Funktion des Bildes.'],
  ['Online', 'A Design Turn', 'Jon Kolko', 'jonkolko.com', 'Essay zur Verschiebung der Design-Rolle vom Handwerk zur Kulturtechnik.'],
  ['Online', 'One Useful Thing', 'Ethan Mollick', 'oneusefulthing.org', 'Newsletter mit Praxisbeiträgen zur Arbeit mit KI.']
];
const BIKE = 'Photo of a young woman with short red hair in a mustard yellow raincoat standing next to her dark green city bicycle on a cobblestone street. … No logos, no readable text.';
const CREDITS = [
  ['Hero-Video (Startseite)', 'Magnific, Kling 2.5, 5 s, 720p', 'Startbild: Kapitelbild „Einleitung“. „The two students calmly look at the image variants on the monitor, the young woman points at one picture and smiles … slow gentle camera push-in“. Komprimiert mit ffmpeg.'],
  ['Regiepult und Übung 3 (sechs Bilder)', 'Magnific, Modus Auto, 3:2, Seed 4242', BIKE + ' Je Bild ergänzt um den im Regiepult gezeigten Teil.'],
  ['Teekanne, Ausgangsbild', 'Magnific, Modus Auto, 4:3', '„Photo: a light grey ceramic teapot on a wooden kitchen table, next to it a crumpled paper napkin and a clear plastic water bottle, soft neutral daylight …“'],
  ['Teekanne, fünf Bearbeitungen', 'Magnific: Ideogram 4.5 Precise Edit, Hintergrund entfernen, Relight, Expand, Upscaler', 'Einstellungen siehe Kapitel 07. Keine manuelle Nachbearbeitung, damit die Fehler sichtbar bleiben.'],
  ['Café-Szene (Übung 4)', 'Magnific, Modus Auto, 3:2', '„Photo in a cozy café: close-up of a barista’s two hands, one holding a metal milk jug and pouring milk into a cappuccino cup … a waiter in the background carries three glasses, behind them a chalkboard with the handwritten German text …“'],
  ['Praxistest A, B, C (Kapitel 05)', 'Magnific, Seedream 5 Pro und Magnific One, 21.10.2026', 'Aus dem Skript „Design und künstliche Intelligenz“, Prompts im Kapitel.'],
  ['Kapitel-, Übungs- und Kachelbilder', 'Magnific, Modus Auto, 16:9', 'Je ein Prompt pro Bild in englischer Sprache, immer mit „no logos, no readable text“. Ein Durchlauf, Auswahl nach Sichtprüfung, verkleinert mit sips.'],
  ['Kapitelbild „Prompting als Briefing“', 'Magnific, Modus Auto, 16:9, zweiter Durchlauf', 'Im ersten Bild fehlte der Gestalterin der Hals, ein typischer Anatomiefehler, der bei der Sichtprüfung übersehen wurde. Neu erzeugt aus seitlicher Perspektive mit dem Zusatz „head, neck and shoulders clearly visible and anatomically correct“.']
];
function initLit() {
  $('#lit').innerHTML = LIT.map(([y, t, by, pub, d]) => `<div class="lit-item"><span class="yr">${y}</span><div><h3>${esc(t)}</h3><div class="by">${esc(by)} · ${esc(pub)}</div><p>${esc(d)}</p></div></div>`).join('');
  $('#credits').innerHTML = CREDITS.map(([a, b, c]) => `<tr><td><strong>${esc(a)}</strong></td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('');
}

/* ================================================================
   Stichwortverzeichnis
   ================================================================ */
const GL = [
  ['Alt-Text', 'Barrierefreiheit', 'Textalternative für ein Bild. Je nach Funktion informativ, funktional, dekorativ (leer) oder komplex.', 'appdesign'],
  ['Autoregressive Bildgenerierung', 'Modelle', 'Das Bild entsteht Stück für Stück wie Text, statt durch Entrauschen. Genutzt von multimodalen Modellen wie GPT Image.', 'modelle'],
  ['Bias', 'Ethik', 'Verzerrung durch die Trainingsdaten, etwa stereotype Darstellungen von Berufen oder Herkunft.', 'recht'],
  ['Brennweite', 'Bildsprache', 'Bestimmt Bildwinkel und Wirkung: 24 mm weit und räumlich, 85 mm eng und verdichtend.', 'regie'],
  ['C2PA', 'Recht', 'Offener Standard für kryptografisch signierte Herkunftsangaben in Mediendateien.', 'recht'],
  ['ComfyUI', 'Werkzeuge', 'Knotenbasierter Editor für lokale Bildgenerierung mit Stable Diffusion oder FLUX.', 'workflows'],
  ['Confident Wrong Output', 'Bewertung', 'Ein Ergebnis, das überzeugend aussieht und trotzdem falsch ist.', 'bewertung'],
  ['Content Credentials', 'Recht', 'Herkunftsnachweis nach C2PA, den manche Werkzeuge automatisch an Bilder anhängen.', 'recht'],
  ['Creative Direction', 'Rolle', 'Die neue Rolle der Gestaltenden: beauftragen, auswählen, prüfen und verantworten.', 'einleitung'],
  ['Deepfake', 'Recht', 'Täuschend echte, KI-erzeugte Darstellung realer Personen, Orte oder Ereignisse. Muss offengelegt werden.', 'recht'],
  ['Diffusion', 'Modelle', 'Verfahren, das aus Rauschen in vielen Schritten ein Bild erzeugt.', 'modelle'],
  ['Double Diamond', 'Prozess', 'Prozessmodell mit den Phasen Discover, Define, Develop und Deliver.', 'prozess'],
  ['Exempel', 'Prompting', 'Baustein des MARE-Prinzips: Beispiele oder Referenzbilder für Stil und Form.', 'prompting'],
  ['Freistellen', 'Bearbeitung', 'Motiv vom Hintergrund trennen, etwa für Produktfotos.', 'bearbeitung'],
  ['Golden Hour', 'Bildsprache', 'Warmes, flaches Licht kurz nach Sonnenaufgang oder vor Sonnenuntergang.', 'regie'],
  ['Halluzination', 'Modelle', 'Plausible, aber falsche Ausgabe eines KI-Modells.', 'modelle'],
  ['High-Key', 'Bildsprache', 'Helle, fast schattenlose Lichtführung.', 'regie'],
  ['Human in the Loop', 'Prozess', 'Ein Mensch prüft und entscheidet an festgelegten Stellen eines KI-Workflows.', 'appdesign'],
  ['Inpainting', 'Bearbeitung', 'Einen maskierten Bildbereich nach Prompt neu erzeugen.', 'bearbeitung'],
  ['Jagged Frontier', 'Modelle', 'Gezackte Leistungsgrenze der KI: stark bei manchen schweren, schwach bei manchen leichten Aufgaben.', 'modelle'],
  ['KI-Verordnung (AI Act)', 'Recht', 'EU-Verordnung 2024/1689. Art. 50 regelt die Kennzeichnungspflichten.', 'recht'],
  ['Latenter Raum', 'Modelle', 'Komprimierter Bedeutungsraum, in dem ähnliche Konzepte nah beieinander liegen.', 'modelle'],
  ['LoRA', 'Werkzeuge', 'Low-Rank Adaptation: kleines Zusatzmodell, das einem Bildmodell einen Stil, ein Produkt oder eine Figur beibringt.', 'workflows'],
  ['Low-Key', 'Bildsprache', 'Dunkle Lichtführung mit viel Schatten und wenigen Lichtern.', 'regie'],
  ['MARE-Prinzip', 'Prompting', 'Motivation, Aufgabe, Resultat, Exempel, optional ergänzt um Rolle und Zusatzinfo.', 'prompting'],
  ['Model Context Protocol (MCP)', 'Werkzeuge', 'Offener Standard, über den Sprachmodelle externe Werkzeuge ansteuern.', 'workflows'],
  ['Outpainting', 'Bearbeitung', 'Ein Bild über seinen Rand hinaus erweitern.', 'bearbeitung'],
  ['Prompt', 'Prompting', 'Anweisung an ein KI-Modell. Im besten Fall ein präzises Briefing.', 'prompting'],
  ['Relighting', 'Bearbeitung', 'Lichtrichtung und Lichtstimmung eines Bildes nachträglich ändern.', 'bearbeitung'],
  ['Rim Light', 'Bildsprache', 'Licht von hinten, das einen leuchtenden Saum um das Motiv legt.', 'regie'],
  ['Schärfentiefe', 'Bildsprache', 'Bereich, der scharf erscheint. Offene Blende und lange Brennweite verringern ihn.', 'regie'],
  ['Seed', 'Werkzeuge', 'Startwert des Zufallsrauschens. Gleicher Seed und gleiche Einstellungen ergeben ein ähnliches Bild.', 'workflows'],
  ['Style Reference', 'Werkzeuge', 'Referenzbild, das den Stil einer Generierung vorgibt.', 'workflows'],
  ['Token', 'Modelle', 'Kleinste Einheit, die ein Sprachmodell verarbeitet, etwa ein Wort oder Wortteil.', 'modelle'],
  ['Top Shot', 'Bildsprache', 'Aufnahme senkrecht von oben. Wirkt grafisch und analytisch.', 'regie'],
  ['Upscaling', 'Bearbeitung', 'Auflösung erhöhen. KI-Upscaler ergänzen dabei auch Details.', 'bearbeitung'],
  ['Urheberrecht (§ 2 UrhG)', 'Recht', 'Schützt nur persönliche geistige Schöpfungen. Reine KI-Ausgaben sind in der Regel nicht geschützt.', 'recht'],
  ['3-Sekunden-Test', 'Bewertung', 'Was bleibt nach drei Sekunden Betrachtung hängen? Prüft Hierarchie und Wirkung.', 'bewertung']
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
    if (!list.length) { $('#gl-list').innerHTML = '<p class="gl-empty">Kein Begriff gefunden. Prüfen Sie die Schreibweise oder wählen Sie „Alle“.</p>'; return; }
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
function initExercises() {
  selectExercise({ key: 'fr', list: '#fr-list', check: '#fr-check', reset: '#fr-reset', fb: '#fr-fb', items: FR_ITEMS, opts: FR_OPTS, pass: 8, ex: 'ue-frontier',
    okText: 'Sie schätzen gut ein, wo KI hilft und wo Sie genau hinsehen müssen.', badText: 'Lesen Sie die Jagged Frontier in Kapitel 02 noch einmal: Was schwer wirkt, gelingt oft, was leicht wirkt, nicht immer.' });
  selectExercise({ key: 'mr', list: '#mr-list', check: '#mr-check', reset: '#mr-reset', fb: '#mr-fb', items: MR_ITEMS, opts: MR_OPTS, pass: 6, ex: 'ue-mare',
    okText: 'Sie erkennen die Bausteine eines guten Briefings.', badText: 'Fragen Sie bei jedem Satz: Warum (Motivation), was (Aufgabe), in welcher Form (Resultat), woran orientiert (Exempel)?' });
  selectExercise({ key: 'km', list: '#km-list', check: '#km-check', reset: '#km-reset', fb: '#km-fb', items: KM_ITEMS, opts: KM_OPTS, pass: 5, ex: 'ue-kamera',
    okText: 'Sie lesen Kamera- und Lichtsprache sicher.', badText: 'Achten Sie auf Raumtiefe (Brennweite), Unschärfe (Blende), Blickwinkel und die Verteilung von Hell und Dunkel.',
    render: (it, i, st) => { const k = KAM.find((x) => x.id === it[0]); return `<div class="ki-ex-item" data-i="${i}"><img src="media/${k.id}.webp" alt="Bild ${i + 1}: Frau mit gelber Regenjacke und grünem Fahrrad" loading="lazy" width="1200" height="805"><h3>Bild ${i + 1}</h3>${selectHtml(i, KM_OPTS, st[i], 'Anweisung für Bild ' + (i + 1))}<div class="why" hidden></div></div>`; } });
  selectExercise({ key: 'bb', list: '#bb-list', check: '#bb-check', reset: '#bb-reset', fb: '#bb-fb', items: BB_ITEMS, opts: BB_OPTS, pass: 6, ex: 'ue-bearbeitung',
    okText: 'Sie wählen passende Techniken und erkennen, wann eine Bearbeitung die Aussage verfälscht.', badText: 'Denken Sie an den Leitsatz: verbessern ja, Produktidentität und dokumentarische Wahrheit verfälschen nein.' });
}
function boot() {
  renderNav();
  renderTiles();
  renderPagers();
  const inits = [initHero, initDiffusion, initToken, initProzess, initBuilder, initRegie, initThree, initBA, initAlt, initExercises, initFehler, initDoku, initQuiz, initLit, initGlossar];
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
