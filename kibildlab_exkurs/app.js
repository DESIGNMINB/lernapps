import { chapters, szene, verfahren, faelle } from './kapitel.js?v=2';
import { terms, quiz, literature } from './wissen.js?v=1';
import { bilder, outpaint, motiv } from './bilder.js?v=1';

/* Exkurs zu Lernmodul 10 (UX & KI) */
const NAME = 'KIBildLab';
const UNTER = 'Bildkomposition mit KI steuern';
const KURZ = 'KB';

const $ = (s) => document.querySelector(s);
const content = $('#fu-content');
const sidebar = $('#sidebar');
const menu = $('.menu-btn');
const storageKey = 'kibildlab:v1';
const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const komma = (n, d = 1) => n.toFixed(d).replace('.', ',');

let cleanups = [];
function cleanup() { cleanups.forEach((f) => f()); cleanups = []; }

const ch = (id) => chapters.find((c) => c.id === id);
const pages = [
  { id: 'home', title: 'Übersicht', icon: 'home' },
  ...chapters.map((c, i) => ({ ...c, nr: i + 1, art: 'kapitel' })),
  { id: 'quiz', art: 'quiz', title: 'Quiz KIBildLab', subtitle: `${quiz.length} Fragen zu Copy Space, ControlNet, Tiefe und Outpainting`, icon: 'quiz', chip: '?' },
  { id: 'glossar', art: 'wissen', title: 'Glossar', subtitle: `${terms.length} Begriffe von C2PA bis Zero Convolution`, icon: 'book', chip: 'A–Z' },
  { id: 'literatur', art: 'wissen', title: 'Literatur und Bildnachweis', subtitle: 'Quellen, Dokumentation und Nachweise', icon: 'book', chip: 'L' }
];
const labs = pages.filter((p) => p.art === 'kapitel');
const tiles = { copyspace: 'fluss', controlnet: 'skizze', painting: 'fluss916', literatur: 'skizze' };

const icons = {
  home: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  book: 'M12 6v14M12 6C9 4 6 4 3 5v13c3-1 6-1 9 2 3-3 6-3 9-2V5c-3-1-6-1-9 1Z',
  layout: 'M3 4h18v16H3zM3 9h18M9 9v11',
  grid: 'M4 4h16v16H4zM4 12h16M12 4v16',
  layers: 'M12 3 2 8l10 5 10-5zM2 13l10 5 10-5M2 17l10 5 10-5',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  quiz: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4h.01'
};
const icon = (n) => `<svg class="icon-svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[n] || icons.book}"/></svg>`;

let stored = {};
try { stored = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
const done = stored.done || {};
const st = stored.st || {};
function save() { try { localStorage.setItem(storageKey, JSON.stringify({ done, st })); } catch {} }
function markDone(id) { if (!done[id]) { done[id] = true; save(); sidebar.querySelector(`[href="#${id}"]`)?.classList.add('story-done'); } }
let liveTimer;
const announce = (t) => { const r = $('#kb-live'); if (r) { r.textContent = ''; clearTimeout(liveTimer); liveTimer = setTimeout(() => { r.textContent = t; }, 30); } };

/* ---------- Navigation ---------- */
const navItem = (page, label) => `<a class="nav-item" href="#${page.id}"><span class="nav-icon">${icon(page.icon)}</span>${label || page.title}</a>`;
$('#fu-nav').innerHTML = [
  navItem(pages[0]),
  '<div class="nav-section-label">Labore</div>',
  ...labs.map((p) => navItem(p, `${p.nr}. ${p.title.split(':')[0]}`)),
  '<div class="nav-section-label">Wissen</div>',
  ...pages.filter((p) => p.art === 'quiz' || p.art === 'wissen').map((p) => navItem(p)),
  '<div class="nav-section-label">Lernmodul</div>',
  `<a class="nav-item" href="../ux-ki/"><span class="nav-icon">${icon('book')}</span>Zurück zu UX &amp; KI</a>`
].join('');

/* ---------- Bilder ---------- */
function figure(key) {
  const b = bilder[key];
  return `<figure class="dg-fig"><img src="img/${b.file}" alt="${esc(b.alt)}" width="${b.w}" height="${b.h}" loading="lazy">
    <span class="ki-badge" aria-hidden="true">KI-generiert</span>
    <figcaption>${esc(b.caption)} <span class="dg-credit">KI-generiert mit Magnific, Beispielbild ohne reale Vorlage</span></figcaption></figure>`;
}
function tileArt(page, chip) {
  const b = bilder[tiles[page.id]];
  const badge = done[page.id] ? '<span class="tag-done">Erledigt</span>' : '';
  const art = b ? `<img src="img/${b.file}" alt="" width="${b.w}" height="${b.h}" loading="lazy"${page.id === 'painting' ? ' style="object-position:50% 55%"' : ''}><span class="ki-badge" aria-hidden="true">KI-generiert</span>`
    : page.id === 'tiefe' ? `<span class="sc-tile-fig" aria-hidden="true">${szeneSvg('tile')}</span>`
    : `<span class="dg-tile-icon" aria-hidden="true">${icon(page.icon)}</span>`;
  return `<div class="art${b ? '' : ' art-plain'}">${art}${badge}<span class="chip-num" aria-hidden="true">${chip}</span></div>`;
}
const tile = (page, chip, go) => `<li><a class="ptile" href="#${page.id}">${tileArt(page, chip)}
  <div class="tile-body"><h3>${page.title}</h3><p>${page.period ? `${page.period} · ` : ''}${page.lead ? page.lead.split('. ')[0] + '.' : page.subtitle}</p><span class="go">${go}</span></div></a></li>`;

function overview() {
  const count = labs.filter(({ id }) => done[id]).length;
  return `<div class="home">
    <section class="home-hero">
      <div>
        <div class="mod-chip" aria-hidden="true">${KURZ}</div>
        <p class="hero-eyebrow">Exkurs zu Lernmodul 10 · UX &amp; KI</p>
        <h1>${NAME}: ${UNTER}</h1>
        <p class="hero-lead">Ein Text-Prompt sagt, was im Bild sein soll, aber kaum, wo. In vier Laboren lernen Sie, Bilder für Layouts zu planen und zu prüfen: Copy Space im Raster, Struktur mit ControlNet, Tiefenkarten für Parallax und In- und Outpainting für responsive Formate.</p>
        <div class="hero-actions"><div class="hero-cta">
          <a class="btn btn-primary" href="#copyspace">Exkurs starten <span aria-hidden="true">→</span></a>
          <a class="btn" href="../ux-ki/#bearbeitung">Zu UX &amp; KI, Kapitel 07</a>
        </div></div>
        <p class="hero-meta"><span><b>4</b> Labore</span><span><b>${quiz.length}</b> Quizfragen</span><span><b>${terms.length}</b> Begriffe</span><span>ca. <b>90 Min.</b></span></p>
      </div>
      <figure class="hero-media">
        <img src="img/skizze.webp" alt="${esc(bilder.skizze.alt)}" width="1000" height="746" fetchpriority="high">
        <figcaption class="ki-badge">KI-generiert</figcaption>
      </figure>
    </section>
    <div class="progress-band">
      <label class="label" for="home-progress">Ihr Fortschritt</label>
      <progress id="home-progress" max="${labs.length}" value="${count}"></progress>
      <b>${count} / ${labs.length} Labore</b>
    </div>
    <div class="home-section-label"><h2>Labore</h2><span>Lesen, ausprobieren, prüfen</span></div>
    <ul class="tiles">${labs.map((p) => tile(p, `0${p.nr}`, 'Labor öffnen')).join('')}</ul>
    <div class="home-section-label"><h2>Wissen</h2><span>Quiz und Nachschlagen</span></div>
    <ul class="tiles">${pages.filter((p) => p.art === 'quiz' || p.art === 'wissen').map((p) => tile(p, p.chip, p.art === 'quiz' ? 'Quiz starten' : 'Öffnen')).join('')}</ul>
    <p class="footer-note">Exkurs zu Lernmodul 10 · Lern-Apps Gestaltung &amp; UX · Hochschule Karlsruhe, Fakultät IWI · Beispielbilder KI-generiert (Magnific), Szene und Schemata eigene Darstellung · Der ControlNet-Simulator erzeugt keine KI-Bilder und sendet keine Daten</p>
  </div>`;
}

const section = (title, body, panel = false, cls = '') => `<section class="story-section${panel ? ' story-panel' : ''}${cls ? ' ' + cls : ''}"><h2>${title}</h2>${body}</section>`;
const table = (t) => `<div class="sc-table-wrap" tabindex="0" role="region" aria-label="Tabelle"><table class="sc-table"><thead><tr>${t.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
  <tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const opts = (list, sel) => list.map(([v, l]) => `<option value="${v}"${String(v) === String(sel) ? ' selected' : ''}>${l}</option>`).join('');

/* ---------- Labor 1: Copy Space ---------- */
const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const ZEILEN = 6, zeileY = (z) => 0.04 + (z - 1) * 0.112;
const RASTER = { m: 0.02, gap: 0.015 }; RASTER.cw = (1 - 2 * RASTER.m - 11 * RASTER.gap) / 12;
function csState() {
  const s = st.cs || { col: 7, span: 5, zeile: 3, farbe: 'hell', flaeche: 'nein' };
  if (!s.zeile) s.zeile = { oben: 1, mitte: 3, unten: 6 }[s.v] || 3;
  return s;
}
function demoCopyspace() {
  const s = csState();
  return `<div class="kb-cs kb-ex">
    <div class="kb-cs-stage" id="cs-stage">
      <img src="img/fluss.webp" alt="${esc(bilder.fluss.alt)}" width="1600" height="893" id="cs-img" draggable="false">
      <div class="kb-grid" aria-hidden="true">${Array.from({ length: 12 }, () => '<span></span>').join('')}</div>
      <div class="kb-motiv" aria-hidden="true" style="left:${motiv.x * 100}%;top:${motiv.y * 100}%;width:${motiv.w * 100}%;height:${motiv.h * 100}%"><span>Motiv</span></div>
      <div class="kb-block" id="cs-block" aria-hidden="true"><span class="kb-h kb-h-l" data-h="l"></span><b>Zur Arbeit am Fluss</b><span class="kb-sub">Neue Radwege entlang des Ufers</span><i>Route planen</i><span class="kb-h kb-h-r" data-h="r"></span></div>
    </div>
    <p class="story-note">Ziehen Sie den Textblock im Bild, an den Griffen links und rechts ändern Sie die Breite. Der Block rastet auf die zwölf Spalten ein. Mit der Tastatur nutzen Sie die Auswahlfelder darunter.</p>
    <div class="kb-cs-ctrl">
      <div><label for="cs-col">Beginnt in Spalte</label><select id="cs-col">${opts(Array.from({ length: 12 }, (_, i) => [i + 1, String(i + 1)]), s.col)}</select></div>
      <div><label for="cs-span">Breite in Spalten</label><select id="cs-span">${opts([3, 4, 5, 6, 7, 8].map((n) => [n, String(n)]), s.span)}</select></div>
      <div><label for="cs-zeile">Höhe im Bild</label><select id="cs-zeile">${opts(Array.from({ length: ZEILEN }, (_, i) => [i + 1, i === 0 ? '1 · ganz oben' : i === ZEILEN - 1 ? `${ZEILEN} · ganz unten` : String(i + 1)]), s.zeile)}</select></div>
      <div><label for="cs-farbe">Textfarbe</label><select id="cs-farbe">${opts([['dunkel', 'Dunkel'], ['hell', 'Weiß']], s.farbe)}</select></div>
      <div><label for="cs-flaeche">Hinterlegung</label><select id="cs-flaeche">${opts([['nein', 'Keine'], ['ja', 'Halbtransparente Fläche']], s.flaeche)}</select></div>
      <label class="kb-check"><input type="checkbox" id="cs-raster" checked> Raster zeigen</label>
    </div>
    <div class="btn-group"><button type="button" class="btn" id="cs-gut">Gute Lösung zeigen</button></div>
    <div id="cs-fb" class="kb-fb" aria-live="polite"></div>
  </div>`;
}
function wireCopyspace() {
  const img = $('#cs-img'); if (!img) return;
  const block = $('#cs-block'), stage = $('#cs-stage');
  let data = null; const W = 320, H = Math.round(320 * 893 / 1600);
  const read = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(img, 0, 0, W, H); data = x.getImageData(0, 0, W, H).data; update(); };
  const g = (id) => $(id).value;
  const { m, gap, cw } = RASTER, step = cw + gap;
  function update() {
    let col = Number(g('#cs-col')), span = Number(g('#cs-span'));
    if (col + span - 1 > 12) { col = 13 - span; $('#cs-col').value = String(col); }
    const s = { col, span, zeile: Number(g('#cs-zeile')), farbe: g('#cs-farbe'), flaeche: g('#cs-flaeche') };
    st.cs = s; save();
    const x0 = m + (col - 1) * step, w = span * cw + (span - 1) * gap;
    const h = 0.34, y0 = zeileY(s.zeile);
    Object.assign(block.style, { left: `${x0 * 100}%`, top: `${y0 * 100}%`, width: `${w * 100}%`, height: `${h * 100}%` });
    block.className = `kb-block is-${s.farbe}${s.flaeche === 'ja' ? ' has-plate' : ''}`;
    stage.classList.toggle('no-grid', !$('#cs-raster').checked);
    if (!data) return;
    const text = s.farbe === 'hell' ? [255, 255, 255] : [31, 41, 55];
    const plate = s.flaeche === 'ja' ? (s.farbe === 'hell' ? [17, 24, 39, 0.55] : [255, 255, 255, 0.7]) : null;
    const ls = [], rs = [];
    for (let y = Math.floor(y0 * H); y < Math.min(H, (y0 + h) * H); y++) for (let x = Math.floor(x0 * W); x < Math.min(W, (x0 + w) * W); x++) {
      const i = (y * W + x) * 4; let r = data[i], gg = data[i + 1], b = data[i + 2];
      if (plate) { r = r * (1 - plate[3]) + plate[0] * plate[3]; gg = gg * (1 - plate[3]) + plate[1] * plate[3]; b = b * (1 - plate[3]) + plate[2] * plate[3]; }
      const L = lum(r, gg, b); ls.push(L); rs.push(ratio(L, lum(...text)));
    }
    rs.sort((a, b) => a - b); const minR = rs[Math.floor(rs.length * 0.02)];
    const mean = ls.reduce((a, b) => a + b, 0) / ls.length, sd = Math.sqrt(ls.reduce((a, b) => a + (b - mean) ** 2, 0) / ls.length);
    const overlap = x0 < motiv.x + motiv.w && x0 + w > motiv.x && y0 < motiv.y + motiv.h && y0 + h > motiv.y;
    const msgs = [];
    msgs.push(minR >= 4.5 ? ['ok', `Kontrast an der ungünstigsten Stelle etwa ${komma(minR)} : 1. Das reicht auch für normalen Text (4,5 : 1).`]
      : minR >= 3 ? ['hint', `Kontrast an der ungünstigsten Stelle etwa ${komma(minR)} : 1. Genug für große Überschriften (3 : 1), zu wenig für den kleinen Text und die Schaltfläche (4,5 : 1).`]
      : ['warn', `Kontrast an der ungünstigsten Stelle nur etwa ${komma(minR)} : 1. Der Text ist dort schwer lesbar. Andere Textfarbe, andere Position oder eine Hinterlegung probieren.`]);
    msgs.push(sd > 0.08 ? ['hint', 'Der Hintergrund unter dem Block ist unruhig: helle und dunkle Stellen wechseln sich ab. Copy Space sollte gleichmäßig sein.'] : ['ok', 'Der Hintergrund unter dem Block ist ruhig und gleichmäßig.']);
    msgs.push(overlap ? ['warn', 'Der Block verdeckt das Motiv. Der Blick wird zwischen Text und Bild hin- und hergerissen.'] : ['ok', 'Das Motiv bleibt frei.']);
    if (plate) msgs.push(['hint', 'Eine Hinterlegung rettet den Kontrast, verdeckt aber Bild. Sie ist eine Notlösung, wenn der Copy Space fehlt.']);
    $('#cs-fb').innerHTML = `<ul>${msgs.map(([t, m]) => `<li class="is-${t}"><span class="dg-sr">${t === 'ok' ? 'In Ordnung: ' : t === 'warn' ? 'Problem: ' : 'Hinweis: '}</span>${m}</li>`).join('')}</ul>`;
    if (minR >= 4.5 && !overlap && !plate) markDone('copyspace');
  }
  const setSel = (col, span, zeile) => {
    span = Math.max(3, Math.min(8, span)); col = Math.max(1, Math.min(13 - span, col)); zeile = Math.max(1, Math.min(ZEILEN, zeile));
    $('#cs-col').value = String(col); $('#cs-span').value = String(span); $('#cs-zeile').value = String(zeile); update();
  };
  /* Ziehen und Skalieren mit Einrasten */
  block.onpointerdown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault(); block.setPointerCapture(e.pointerId);
    const r = stage.getBoundingClientRect(), fx = (ev) => (ev.clientX - r.left) / r.width, fy = (ev) => (ev.clientY - r.top) / r.height;
    const s0 = { col: Number(g('#cs-col')), span: Number(g('#cs-span')), zeile: Number(g('#cs-zeile')) };
    const mode = e.target.dataset.h || 'move', x0 = fx(e), y0 = fy(e);
    block.classList.add('is-drag');
    block.onpointermove = (ev) => {
      const dc = Math.round((fx(ev) - x0) / step), dz = Math.round((fy(ev) - y0) / 0.112);
      if (mode === 'move') setSel(s0.col + dc, s0.span, s0.zeile + dz);
      if (mode === 'r') setSel(s0.col, s0.span + dc, s0.zeile);
      if (mode === 'l') { const span = Math.max(3, Math.min(8, s0.span - dc)); setSel(s0.col + (s0.span - span), span, s0.zeile); }
    };
    block.onpointerup = block.onpointercancel = () => { block.onpointermove = null; block.classList.remove('is-drag'); announce(`Textblock: Spalte ${g('#cs-col')}, ${g('#cs-span')} Spalten breit, Höhe ${g('#cs-zeile')}.`); };
  };
  $('#cs-gut').onclick = () => {
    $('#cs-farbe').value = 'dunkel'; $('#cs-flaeche').value = 'nein'; setSel(1, 5, 1);
    announce('Gute Lösung: Spalten 1 bis 5 oben im ruhigen Himmel, dunkler Text, ohne Hinterlegung.');
  };
  ['#cs-col', '#cs-span', '#cs-zeile', '#cs-farbe', '#cs-flaeche', '#cs-raster'].forEach((id) => { $(id).onchange = update; });
  if (img.complete && img.naturalWidth) read(); else img.addEventListener('load', read, { once: true });
  update();
}

/* ---------- Labor 2: ControlNet-Simulator ---------- */
const VORLAGEN = {
  landschaft: { name: 'Haus und Baum', strokes: [[[20, 280], [380, 270]], [[90, 280], [90, 190], [150, 140], [210, 190], [210, 280]], [[90, 190], [210, 190]], [[135, 280], [135, 235], [165, 235], [165, 280]], [[290, 280], [290, 200]], [[290, 210], [250, 190], [240, 150], [265, 115], [300, 105], [335, 125], [345, 165], [325, 195], [290, 210]]] },
  wireframe: { name: 'Hero-Layout', strokes: [[[20, 20], [380, 20], [380, 380], [20, 380], [20, 20]], [[210, 60], [360, 60], [360, 300], [210, 300], [210, 60]], [[40, 90], [180, 90]], [[40, 115], [160, 115]], [[40, 150], [170, 150]], [[40, 170], [150, 170]], [[40, 220], [130, 220], [130, 250], [40, 250], [40, 220]]] },
  figur: { name: 'Figur in Bewegung', strokes: [[[200, 70], [220, 90], [200, 110], [180, 90], [200, 70]], [[200, 110], [195, 210]], [[200, 135], [150, 170]], [[200, 135], [255, 120]], [[195, 210], [150, 300]], [[195, 210], [245, 290], [270, 300]], [[20, 320], [380, 320]]] }
};
/* Beispielbilder je Vorlage und Stufe (img/cn-<vorlage>-<stufe>.webp), sobald erzeugt; Stufen 0 frei, 1 schwach, 2 eng, 3 übersteuert */
const CN_BILDER = {};
const STUFEN = ['Frei', 'Schwach', 'Eng', 'Übersteuert'];
const stufe = (s) => (s < 0.3 ? 0 : s < 0.9 ? 1 : s <= 1.2 ? 2 : 3);
const STUFE_TXT = [
  'Frei: Das Ergebnis folgt der Vorlage kaum. Komposition und Formen sind weitgehend offen.',
  'Schwach: Die grobe Anordnung bleibt erkennbar, Formen und Details haben Spielraum.',
  'Eng: Das Ergebnis folgt der Vorlage eng. Für exakte Layouts oft gewünscht.',
  'Übersteuert: Das Ergebnis klebt an der Vorlage. Bei groben Skizzen kann es steif oder überzeichnet wirken.'
];
const TYP_TXT = { skizze: 'Die Skizze wird als weiße Linie auf Schwarz übergeben.', kanten: 'Aus der Zeichnung werden Umrisskanten berechnet, ähnlich einem Canny-Kantenbild.', tiefe: 'Vereinfachte Annahme: Gezeichnete Formen liegen vorn (hell), leere Flächen hinten (dunkel).' };
function demoControlnet() {
  const s = st.cn || { typ: 'skizze', staerke: 1 };
  return `<div class="kb-ex">
    <p class="kb-sim-flag" role="note"><b>Simulation:</b> Hier wird nichts generiert und nichts gesendet. Die Steuerkarte entsteht im Browser.</p>
    <div class="kb-toolbar">
      <div class="kb-seg-group"><span class="kb-seg-label" id="cn-vl">Vorlage</span><div class="kb-seg" role="group" aria-labelledby="cn-vl">${Object.entries(VORLAGEN).map(([k, v]) => `<button type="button" class="kb-segbtn" data-vorlage="${k}" aria-pressed="false">${v.name}</button>`).join('')}</div></div>
      <div class="kb-seg-group"><span class="kb-seg-label" id="cn-wl">Skizze</span><div class="kb-seg" role="group" aria-labelledby="cn-wl"><button type="button" class="kb-segbtn" id="cn-undo">Rückgängig</button><button type="button" class="kb-segbtn" id="cn-clear">Leeren</button></div></div>
    </div>
    <div class="kb-cn2">
      <figure class="kb-pane"><figcaption>1 · Skizze</figcaption><canvas id="cn-canvas" width="400" height="400" class="kb-paper" role="img" aria-label="Zeichenfläche. Mit Maus, Stift oder Finger zeichnen, oder oben eine Vorlage wählen."></canvas></figure>
      <figure class="kb-pane"><figcaption>2 · Steuerkarte</figcaption><canvas id="cn-map" width="400" height="400" class="kb-map" role="img" aria-label="Steuerkarte"></canvas></figure>
    </div>
    <div class="kb-toolbar">
      <div class="kb-seg-group"><span class="kb-seg-label" id="cn-tl">Bedingung</span><div class="kb-seg" role="radiogroup" aria-labelledby="cn-tl">${[['skizze', 'Skizze'], ['kanten', 'Kanten'], ['tiefe', 'Tiefe']].map(([k, l]) => `<label class="kb-segbtn"><input type="radio" name="cn-typ" value="${k}" ${s.typ === k ? 'checked' : ''}> ${l}</label>`).join('')}</div></div>
      <div class="kb-seg-group kb-grow"><label class="kb-seg-label" for="cn-st">Stärke der Steuerung: <output id="cn-st-out">${komma(s.staerke)}</output></label>
        <input type="range" id="cn-st" min="0" max="1.5" step="0.1" value="${s.staerke}">
        <div class="kb-ticks" aria-hidden="true">${STUFEN.map((x) => `<span>${x}</span>`).join('')}</div></div>
    </div>
    <div class="kb-result" id="cn-result" aria-live="polite"></div>
  </div>`;
}
function wireControlnet() {
  const cv = $('#cn-canvas'); if (!cv) return;
  const ctx = cv.getContext('2d'), map = $('#cn-map').getContext('2d');
  let strokes = st.cn?.strokes || VORLAGEN.landschaft.strokes.map((s) => s.map((p) => [...p]));
  let vorlage = st.cn?.strokes ? st.cn.vorlage || '' : 'landschaft';
  let cur = null, timer = 0;
  const drawStrokes = (c, list, { w = 4, color = '#1F2937' } = {}) => {
    c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
    list.forEach((s) => { if (s.length < 2) return; c.beginPath(); s.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke(); });
  };
  const paper = () => { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 400, 400); drawStrokes(ctx, strokes); };
  const typOf = () => content.querySelector('[name="cn-typ"]:checked').value;
  function render() {
    const typ = typOf(), s = Number($('#cn-st').value), k = stufe(s);
    st.cn = { typ, staerke: s, strokes, vorlage }; st.cnTypen = { ...(st.cnTypen || {}), [typ]: 1 }; save();
    $('#cn-st-out').textContent = `${komma(s)} · ${STUFEN[k]}`;
    $('#cn-st').setAttribute('aria-valuetext', `${komma(s)}, ${STUFEN[k]}`);
    content.querySelectorAll('[data-vorlage]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vorlage === vorlage)));
    map.fillStyle = '#000'; map.fillRect(0, 0, 400, 400); map.filter = 'none';
    if (typ === 'skizze') drawStrokes(map, strokes, { w: 9, color: '#FFF' });
    if (typ === 'kanten') { drawStrokes(map, strokes, { w: 9, color: '#FFF' }); drawStrokes(map, strokes, { w: 5, color: '#000' }); }
    if (typ === 'tiefe') { map.filter = 'blur(14px)'; drawStrokes(map, strokes, { w: 46, color: '#CFCFCF' }); map.filter = 'blur(4px)'; drawStrokes(map, strokes, { w: 18, color: '#FFF' }); map.filter = 'none'; }
    $('#cn-map').setAttribute('aria-label', `Steuerkarte. ${TYP_TXT[typ]}`);
    const bild = vorlage && CN_BILDER[`${vorlage}-${k}`];
    $('#cn-result').innerHTML = `<div class="kb-result-text"><p class="kb-result-h">Stufe: ${STUFEN[k]}</p><p>${STUFE_TXT[k]}</p><p>${TYP_TXT[typ]} Welche Werte gut sind, hängt von Modell und Vorlage ab.</p>
      ${vorlage ? '' : '<p class="story-note">Eigene Skizzen werden hier nicht in Bilder umgesetzt. Sie sehen die Steuerkarte, die ein Werkzeug wie ControlNet erhalten würde.</p>'}</div>
      ${bild ? `<figure class="kb-result-img"><img src="img/${bild.file}" alt="${esc(bild.alt)}" width="600" height="600"><span class="ki-badge" aria-hidden="true">KI-generiert</span><figcaption>Beispielbild „${VORLAGEN[vorlage].name}“, Stufe ${STUFEN[k]}. KI-generiert mit Magnific, Skizze als Referenz; veranschaulicht die Stufe, nicht mit festen ControlNet-Gewichten erzeugt.</figcaption></figure>` : ''}`;
    if (strokes.length >= 3 && Object.keys(st.cnTypen).length >= 2) markDone('controlnet');
  }
  const refresh = () => { paper(); clearTimeout(timer); timer = setTimeout(render, 60); };
  const point = (e) => { const r = cv.getBoundingClientRect(); return [Math.round((e.clientX - r.left) * 400 / r.width), Math.round((e.clientY - r.top) * 400 / r.height)]; };
  cv.onpointerdown = (e) => { e.preventDefault(); cv.setPointerCapture(e.pointerId); cur = [point(e)]; strokes.push(cur); vorlage = ''; };
  cv.onpointermove = (e) => { if (!cur) return; cur.push(point(e)); paper(); };
  cv.onpointerup = cv.onpointercancel = () => { if (cur) { cur = null; refresh(); announce(`Strich gezeichnet, ${strokes.length} Striche.`); } };
  content.querySelectorAll('[data-vorlage]').forEach((b) => b.onclick = () => { vorlage = b.dataset.vorlage; strokes = VORLAGEN[vorlage].strokes.map((s) => s.map((p) => [...p])); refresh(); announce(`Vorlage ${VORLAGEN[vorlage].name} geladen.`); });
  $('#cn-undo').onclick = () => { strokes.pop(); vorlage = ''; refresh(); announce(strokes.length ? `Strich entfernt, ${strokes.length} übrig.` : 'Skizze ist leer.'); };
  $('#cn-clear').onclick = () => { strokes = []; vorlage = ''; refresh(); announce('Skizze geleert.'); };
  content.querySelectorAll('[name="cn-typ"]').forEach((r) => r.onchange = render);
  $('#cn-st').oninput = render;
  cleanups.push(() => clearTimeout(timer));
  paper(); render();
}

/* ---------- Labor 3: Tiefe und Parallax ---------- */
const grau = (t) => { const v = Math.round(30 + t * 215); return `rgb(${v},${v},${v})`; };
function szeneSvg(mode = 'bild', off = {}) {
  const f = (id, farbe) => mode === 'tiefe' ? grau(szene.find((x) => x.id === id).tiefe) : farbe;
  const tr = (id) => off[id] ? ` transform="translate(${off[id]} 0)"` : '';
  return `<svg viewBox="0 0 640 360"${mode === 'tile' ? '' : ' role="img" aria-labelledby="tf-desc"'}>
    <g data-el="himmel"${tr('himmel')}><rect x="-60" y="0" width="760" height="360" fill="${f('himmel', '#CFE3F5')}"/><circle cx="470" cy="80" r="34" fill="${f('himmel', '#F6C66B')}"/></g>
    <g data-el="berge"${tr('berge')}><path d="M-60 230 L80 110 L190 200 L300 90 L440 210 L560 120 L700 230 V360 H-60Z" fill="${f('berge', '#8A9BB8')}"/></g>
    <g data-el="huegel"${tr('huegel')}><path d="M-60 270 C80 210 220 240 330 250 S560 215 700 255 V360 H-60Z" fill="${f('huegel', '#8CB27A')}"/></g>
    <g data-el="haus"${tr('haus')}><rect x="360" y="215" width="70" height="48" fill="${f('haus', '#E9D8C3')}"/><path d="M352 218 L395 186 L438 218Z" fill="${f('haus', '#B5523B')}"/></g>
    <g data-el="wiese"${tr('wiese')}><path d="M-60 300 C120 280 300 300 700 290 V360 H-60Z" fill="${f('wiese', '#5E8F4A')}"/></g>
    <g data-el="baum"${tr('baum')}><rect x="118" y="200" width="16" height="110" fill="${f('baum', '#6B4A32')}"/><circle cx="126" cy="185" r="52" fill="${f('baum', '#3F7A3A')}"/></g>
  </svg>`;
}
const EBENEN = [['hinten', 'Hintergrund'], ['mitte', 'Mittelgrund'], ['vorn', 'Vordergrund']];
const SPEED = { hinten: 0.1, mitte: 0.35, vorn: 0.8 };
/* Quelle für Labor 3: Bild und Tiefenkarte gleicher Größe (hell = nah). Solange kein Foto vorliegt, die eigene Zeichnung. */
const TIEFE_QUELLE = null; /* z. B. { bild: 'img/tiefe-foto.webp', karte: 'img/tiefe-karte.webp', w: 1280, h: 720 } */
const svgUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" '))}`;
const ladeBild = (src) => new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = src; });
function demoTiefe() {
  const s = st.tf || { t1: 0.3, t2: 0.7 };
  return `<div class="kb-ex">
    <div class="kb-toolbar">
      <div class="kb-seg-group"><span class="kb-seg-label" id="tf-vl">Ansicht</span><div class="kb-seg" role="radiogroup" aria-labelledby="tf-vl">${[['bild', 'Bild'], ['karte', 'Tiefenkarte'], ['ebenen', 'Ebenen eingefärbt']].map(([k, l], i) => `<label class="kb-segbtn"><input type="radio" name="tf-v" value="${k}" ${i ? '' : 'checked'}> ${l}</label>`).join('')}</div></div>
    </div>
    <div class="kb-tf2">
      <figure class="kb-pane"><canvas id="tf-canvas" width="640" height="360" role="img" aria-describedby="tf-desc"></canvas>
        <figcaption class="dg-sr" id="tf-desc">Landschaft mit Himmel, Bergen, Hügeln, Haus, Wiese und einem Baum im Vordergrund, in drei Tiefenebenen geschnitten.</figcaption></figure>
      <div class="kb-tf-ctrl">
        <label for="tf-t1">Schwelle Hintergrund | Mittelgrund: <output id="tf-t1-out"></output></label><input type="range" id="tf-t1" min="0.05" max="0.95" step="0.05" value="${s.t1}">
        <label for="tf-t2">Schwelle Mittelgrund | Vordergrund: <output id="tf-t2-out"></output></label><input type="range" id="tf-t2" min="0.05" max="0.95" step="0.05" value="${s.t2}">
        <label for="tf-scroll">Scrollposition: <output id="tf-scroll-out">0</output> %</label><input type="range" id="tf-scroll" min="0" max="100" step="5" value="0">
        <p class="story-note" id="tf-rm"></p>
        <ul class="kb-legend" aria-hidden="true"><li class="l-hinten">Hintergrund</li><li class="l-mitte">Mittelgrund</li><li class="l-vorn">Vordergrund</li><li class="l-loch">Lücke</li></ul>
      </div>
    </div>
    <p class="kb-result-text" id="tf-info" aria-live="polite"></p>
  </div>`;
}
function wireTiefe() {
  const cv = $('#tf-canvas'); if (!cv) return;
  const ctx = cv.getContext('2d'), W = 640, H = 360;
  let pix = null, tiefe = null, alive = true; cleanups.push(() => { alive = false; });
  const quelle = TIEFE_QUELLE || { bild: svgUrl(szeneSvg('bild')), karte: svgUrl(szeneSvg('tiefe')) };
  Promise.all([ladeBild(quelle.bild), ladeBild(quelle.karte)]).then(([bi, ka]) => {
    if (!alive) return;
    const off = document.createElement('canvas'); off.width = W; off.height = H; const o = off.getContext('2d');
    o.drawImage(bi, 0, 0, W, H); pix = o.getImageData(0, 0, W, H);
    o.drawImage(ka, 0, 0, W, H); const k = o.getImageData(0, 0, W, H).data;
    tiefe = new Float32Array(W * H); for (let i = 0; i < W * H; i++) tiefe[i] = k[i * 4] / 255;
    update();
  });
  const sch = document.createElement('canvas'); sch.width = 16; sch.height = 16; const sc = sch.getContext('2d');
  sc.fillStyle = '#C9CDD3'; sc.fillRect(0, 0, 16, 16); sc.fillStyle = '#E9EBEE'; sc.fillRect(0, 0, 8, 8); sc.fillRect(8, 8, 8, 8);
  const TINT = { hinten: [70, 120, 220], mitte: [240, 170, 40], vorn: [220, 60, 90] };
  function update() {
    let t1 = Number($('#tf-t1').value), t2 = Number($('#tf-t2').value);
    if (t1 >= t2) { t2 = Math.min(0.95, t1 + 0.05); $('#tf-t2').value = String(t2); }
    st.tf = { t1, t2 }; save();
    $('#tf-t1-out').textContent = komma(t1, 2); $('#tf-t2-out').textContent = komma(t2, 2);
    const sc2 = Number($('#tf-scroll').value); $('#tf-scroll-out').textContent = String(sc2);
    const ansicht = content.querySelector('[name="tf-v"]:checked').value;
    $('#tf-rm').textContent = reduced() ? `Bewegung reduziert: Die Ebenen bleiben stehen. Bei ${sc2} % verschöbe sich der Hintergrund um ${Math.round(sc2 * SPEED.hinten)} px, der Mittelgrund um ${Math.round(sc2 * SPEED.mitte)} px, der Vordergrund um ${Math.round(sc2 * SPEED.vorn)} px.` : 'Hinten langsam, vorn schnell. Wo der Vordergrund wegrückt, wird eine Lücke sichtbar.';
    if (!pix) return;
    const layer = (t) => (t < t1 ? 'hinten' : t < t2 ? 'mitte' : 'vorn');
    const anteil = { hinten: 0, mitte: 0, vorn: 0 };
    const ebenen = ['hinten', 'mitte', 'vorn'].map((name) => {
      const img = ctx.createImageData(W, H), d = img.data, p = pix.data;
      for (let i = 0; i < W * H; i++) {
        if (layer(tiefe[i]) !== name) continue;
        anteil[name]++;
        let r = p[i * 4], g = p[i * 4 + 1], b = p[i * 4 + 2];
        if (ansicht === 'karte') { const v = Math.round(tiefe[i] * 255); r = g = b = v; }
        if (ansicht === 'ebenen') { const c = TINT[name]; r = r * 0.45 + c[0] * 0.55; g = g * 0.45 + c[1] * 0.55; b = b * 0.45 + c[2] * 0.55; }
        d[i * 4] = r; d[i * 4 + 1] = g; d[i * 4 + 2] = b; d[i * 4 + 3] = 255;
      }
      const c = document.createElement('canvas'); c.width = W; c.height = H; c.getContext('2d').putImageData(img, 0, 0);
      return [name, c];
    });
    ctx.fillStyle = ctx.createPattern(sch, 'repeat'); ctx.fillRect(0, 0, W, H);
    ebenen.forEach(([name, c]) => ctx.drawImage(c, reduced() ? 0 : -Math.round(sc2 * SPEED[name]), 0));
    const pct = (n) => Math.round((anteil[n] / (W * H)) * 100);
    $('#tf-info').textContent = `Hintergrund ${pct('hinten')} %, Mittelgrund ${pct('mitte')} %, Vordergrund ${pct('vorn')} % der Bildfläche.${pct('mitte') < 3 ? ' Der Mittelgrund ist fast leer: Die Schwellen liegen zu dicht beieinander.' : ''}`;
  }
  content.querySelectorAll('[name="tf-v"]').forEach((r) => r.onchange = update);
  ['#tf-t1', '#tf-t2', '#tf-scroll'].forEach((id) => { $(id).oninput = update; });
  update();
}
const SPUREN = [['', 'Noch nicht zugeordnet'], ...EBENEN];
function uebungTiefe() {
  const z = st.te || {};
  return section('Übung: Ebenen für eine Scrollytelling-Seite', `<p>Eine Seite soll die Landschaft mit drei Parallax-Ebenen zeigen. Ziehen Sie jedes Element auf die passende Spur. <b>Mit der Tastatur:</b> Element mit Tab wählen, Pfeil rechts oder links verschiebt es zur nächsten Spur.</p>
    <div class="kb-lanes" id="te-lanes">${SPUREN.map(([k, l]) => `<div class="kb-lane${k ? '' : ' kb-lane-pool'}" data-lane="${k}"><h4>${l}</h4><ul></ul></div>`).join('')}</div>
    <p class="dg-sr" id="kb-live2" aria-live="polite"></p>
    <fieldset class="story-question"><legend>Wo sollte die Überschrift der Seite liegen?</legend>
      ${[['a', 'Auf der Vordergrund-Ebene, damit sie sich mitbewegt'], ['b', 'Fest über dem ruhigen Himmel, unabhängig von den Ebenen'], ['c', 'Hinter den Bergen']].map(([v, l]) => `<label><input type="radio" name="te-text" value="${v}" ${z._text === v ? 'checked' : ''}> ${l}</label>`).join('')}</fieldset>
    <div class="btn-group"><button type="button" class="btn btn-primary" id="te-check">Prüfen</button><button type="button" class="btn" id="te-reset">Zurücksetzen</button></div>
    <p class="story-result" id="te-result" role="status"></p><ul class="kb-fb-list" id="te-fb"></ul>`, true);
}
const ERWARTET = { himmel: ['hinten'], berge: ['hinten'], huegel: ['mitte'], haus: ['mitte'], wiese: ['vorn', 'mitte'], baum: ['vorn'] };
function wireUebungTiefe() {
  const lanes = $('#te-lanes'); if (!lanes) return;
  st.te = st.te || {};
  const say = (t) => { const r = $('#kb-live2'); r.textContent = ''; setTimeout(() => { r.textContent = t; }, 30); };
  const laneName = (k) => SPUREN.find(([x]) => x === k)[1];
  const render = (focusId) => {
    lanes.querySelectorAll('.kb-lane ul').forEach((u) => { u.innerHTML = ''; });
    szene.forEach((x) => {
      const k = st.te[x.id] || '';
      lanes.querySelector(`[data-lane="${k}"] ul`).insertAdjacentHTML('beforeend', `<li><button type="button" class="kb-chip" data-el="${x.id}" aria-label="${x.name}, ${laneName(k)}">${x.name}</button></li>`);
    });
    lanes.querySelectorAll('.kb-chip').forEach(wire);
    if (focusId) lanes.querySelector(`[data-el="${focusId}"]`)?.focus();
  };
  const setLane = (id, k) => { st.te[id] = k; save(); render(id); say(`${szene.find((x) => x.id === id).name}: ${laneName(k)}.`); };
  function wire(chip) {
    const id = chip.dataset.el;
    chip.onkeydown = (e) => {
      const i = SPUREN.findIndex(([k]) => k === (st.te[id] || ''));
      if (e.key === 'ArrowRight' && i < SPUREN.length - 1) { e.preventDefault(); setLane(id, SPUREN[i + 1][0]); }
      if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); setLane(id, SPUREN[i - 1][0]); }
    };
    chip.onpointerdown = (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const sx = e.clientX, sy = e.clientY; let ghost = null;
      const over = (ev) => [...lanes.querySelectorAll('.kb-lane')].find((l) => { const r = l.getBoundingClientRect(); return ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom; });
      const move = (ev) => {
        if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
        if (!ghost) { ghost = chip.cloneNode(true); ghost.classList.add('kb-ghost'); document.body.appendChild(ghost); chip.classList.add('is-drag'); }
        ghost.style.left = `${ev.clientX}px`; ghost.style.top = `${ev.clientY}px`;
        lanes.querySelectorAll('.kb-lane').forEach((l) => l.classList.toggle('is-over', l === over(ev)));
      };
      const up = (ev) => {
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
        lanes.querySelectorAll('.kb-lane').forEach((l) => l.classList.remove('is-over'));
        if (!ghost) { chip.focus(); return; }
        ghost.remove(); chip.classList.remove('is-drag');
        const l = over(ev); if (l) setLane(id, l.dataset.lane);
      };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      cleanups.push(() => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); ghost?.remove(); });
    };
  }
  content.querySelectorAll('[name="te-text"]').forEach((r) => r.onchange = () => { st.te._text = r.value; save(); });
  $('#te-reset').onclick = () => { st.te = {}; save(); render(); $('#te-fb').innerHTML = ''; $('#te-result').textContent = ''; say('Alle Elemente zurückgesetzt.'); };
  $('#te-check').onclick = () => {
    let ok = 0;
    $('#te-fb').innerHTML = szene.map((x) => {
      const v = st.te[x.id];
      if (!v) return `<li><b>${x.name}:</b> noch nicht zugeordnet.</li>`;
      const r = ERWARTET[x.id].includes(v); ok += Number(r);
      return `<li class="${r ? 'is-ok' : 'is-off'}"><b>${x.name}:</b> ${r ? 'Passt.' : `Naheliegend: ${ERWARTET[x.id].map(laneName).join(' oder ')}.`} Geschätzte Tiefe ${komma(x.tiefe, 2)}.</li>`;
    }).join('');
    const t = st.te._text;
    const tt = !t ? 'Die Frage zur Überschrift ist noch offen.' : t === 'b' ? 'Überschrift: richtig. Text bleibt ruhig und lesbar, wenn er sich nicht mit den Ebenen bewegt, und der Himmel bietet Copy Space.' : 'Überschrift: Bewegter Text ist schwer zu lesen, und hinter den Bergen wäre er verdeckt. Besser fest über dem ruhigen Himmel.';
    $('#te-result').textContent = `${ok} von ${szene.length} Elementen passend zugeordnet. ${tt}`;
    if (ok >= szene.length - 1 && t === 'b') markDone('tiefe');
  };
  render();
}

/* ---------- Labor 4: Formate ---------- */
const FORMATE = [['16-9', '16:9 Desktop', 16 / 9], ['4-5', '4:5 Feed', 4 / 5], ['9-16', '9:16 Smartphone', 9 / 16]];
function demoFormate() {
  return `<div class="kb-fm">
    <div class="kb-fm-ctrl">
      <div class="kb-seg-group"><span class="kb-seg-label" id="fm-fl">Zielformat</span><div role="radiogroup" aria-labelledby="fm-fl" class="kb-seg">${FORMATE.map(([k, l], i) => `<label class="kb-segbtn"><input type="radio" name="fm-f" value="${k}" ${i === 2 ? 'checked' : ''}> ${l}</label>`).join('')}</div></div>
      <label class="kb-check"><input type="checkbox" id="fm-rand" checked> Grenze des Originals und Fehlerquelle zeigen</label>
    </div>
    <div class="kb-fm-pair">
      <figure><figcaption><b>Beschneiden</b></figcaption><div class="kb-frame" id="fm-crop"><img src="img/fluss.webp" alt="" width="1600" height="893"></div><p class="story-note" id="fm-crop-txt"></p></figure>
      <figure><figcaption><b>Outpainting</b> <span class="ki-badge kb-inline-badge">KI-erweitert</span></figcaption><div class="kb-frame" id="fm-out"><img src="img/fluss916.webp" alt="" width="720" height="1279"><span class="kb-orig" id="fm-orig" aria-hidden="true"></span><span class="kb-fehler" id="fm-zweig" aria-hidden="true"><span>erfunden</span></span></div><p class="story-note" id="fm-out-txt"></p></figure>
    </div>
  </div>`;
}
function wireFormate() {
  const crop = $('#fm-crop'); if (!crop) return;
  const outF = $('#fm-out'), orig = $('#fm-orig');
  function update() {
    const k = content.querySelector('[name="fm-f"]:checked').value, [, l, r] = FORMATE.find(([x]) => x === k);
    [crop, outF].forEach((f) => { f.style.aspectRatio = String(r); f.style.width = `min(100%, ${Math.round(480 * r)}px)`; });
    const ci = crop.querySelector('img'), oi = outF.querySelector('img');
    if (k === '16-9') {
      ci.style.objectPosition = '50% 50%'; oi.src = 'img/fluss.webp'; oi.style.objectPosition = '50% 50%'; orig.hidden = true; $('#fm-zweig').hidden = true;
      $('#fm-crop-txt').textContent = 'Originalformat: nichts zu tun.'; $('#fm-out-txt').textContent = 'Im Originalformat ist kein Outpainting nötig.';
    } else {
      ci.style.objectPosition = '82% 50%'; oi.src = 'img/fluss916.webp'; oi.style.objectPosition = '50% 62%';
      /* Lage des Originals im sichtbaren Ausschnitt berechnen */
      const fw = outF.clientWidth, fh = outF.clientHeight, dh = fw * 1279 / 720, oy = (fh - dh) * 0.62;
      orig.hidden = !$('#fm-rand').checked;
      Object.assign(orig.style, { top: `${oy + outpaint.top * dh}px`, height: `${outpaint.height * dh}px` });
      const zw = $('#fm-zweig'); zw.hidden = !$('#fm-rand').checked || oy + 0.07 * dh < 0;
      Object.assign(zw.style, { top: `${Math.max(0, oy)}px`, left: `${fw * 0.36}px`, width: `${fw * 0.2}px`, height: `${Math.max(24, 0.07 * dh)}px` });
      const anteil = Math.round(100 - Math.min(100, (outpaint.height * dh) / fh * 100));
      $('#fm-crop-txt').textContent = k === '9-16' ? 'Vom Querformat bleibt ein schmaler Streifen um das Motiv: Fluss und Weite gehen verloren, die Stimmung des Bildes ändert sich.' : 'Ein Teil des Wassers und Himmels fällt weg, das Motiv bleibt. Hier kann Beschneiden genügen.';
      $('#fm-out-txt').textContent = `Etwa ${anteil} % der Fläche sind erzeugt. Oben entsteht Copy Space. ${$('#fm-zweig').hidden ? 'Im vollen Hochformat zeigt sich oben ein frei erfundener Zweig.' : 'Markiert: Der Zweig am oberen Rand ist frei erfunden, ein typischer Fehler beim Outpainting. Er müsste per Inpainting entfernt werden.'}`;
    }
    crop.setAttribute('aria-label', `Beschnitten auf ${l}`); outF.setAttribute('aria-label', `Per Outpainting erweitert, Format ${l}`);
    crop.setAttribute('role', 'img'); outF.setAttribute('role', 'img');
  }
  content.querySelectorAll('[name="fm-f"]').forEach((r) => r.onchange = update);
  $('#fm-rand').onchange = update;
  const oi = outF.querySelector('img'); oi.addEventListener('load', update);
  const ro = new ResizeObserver(update); ro.observe(outF); cleanups.push(() => ro.disconnect());
  update();
}
function uebungFormate() {
  return section('Übung: Welches Verfahren passt?', `<p>Wählen Sie für jede Situation ein Verfahren. Bei manchen sind zwei Antworten vertretbar.</p>
    ${faelle.map(([t], i) => `<div class="dg-quote"><p>${t}</p><label for="pf-${i}" class="dg-sr">Verfahren für Fall ${i + 1}</label><select id="pf-${i}"><option value="">Bitte wählen …</option>${opts(verfahren, (st.pf || {})[i])}</select><p class="story-match-note" id="pf-${i}-note"></p></div>`).join('')}
    <button type="button" class="btn btn-primary" id="pf-check">Prüfen</button><p class="story-result" id="pf-result" role="status"></p>`, true);
}
function wireUebungFormate() {
  const b = $('#pf-check'); if (!b) return;
  b.onclick = () => {
    let ok = 0; st.pf = {};
    faelle.forEach(([, richtig, why], i) => {
      const v = $(`#pf-${i}`).value, note = $(`#pf-${i}-note`); st.pf[i] = v;
      if (!v) { note.className = 'story-match-note'; note.textContent = 'Noch nicht gewählt.'; return; }
      const r = richtig.includes(v); ok += Number(r);
      note.className = `story-match-note ${r ? 'is-ok' : 'is-off'}`;
      note.textContent = `${r ? 'Passt.' : `Naheliegend: ${richtig.map((k) => verfahren.find(([x]) => x === k)[1]).join(' oder ')}.`} ${why}`;
    });
    save();
    $('#pf-result').textContent = `${ok} von ${faelle.length} passend gewählt.`;
    if (ok >= faelle.length - 1) markDone('painting');
  };
}

/* ---------- Kapitel ---------- */
function sectionHtml(s) {
  const demo = { copyspace: demoCopyspace, controlnet: demoControlnet, tiefe: demoTiefe, formate: demoFormate }[s.demo];
  return `<section class="story-section"><h2>${s.h}</h2>
    ${(s.p || []).map((t) => `<p>${t}</p>`).join('')}
    ${s.list ? `<ul>${s.list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
    ${s.table ? table(s.table) : ''}
    ${demo ? demo() : ''}
    ${(s.img || []).length ? `<div class="dg-figs">${s.img.map(figure).join('')}</div>` : ''}
  </section>`;
}
function chapterPage(c) {
  return `<div class="lektion-badge"><span class="lektion-number">0${c.nr}</span><span class="lektion-label">${c.period}</span></div>
    <h1 class="page-title purple">${c.title}</h1><p class="page-intro">${c.lead}</p>
    <p class="dg-sr" id="kb-live" aria-live="polite"></p>
    ${c.sections.map(sectionHtml).join('')}
    ${c.id === 'tiefe' ? uebungTiefe() : ''}${c.id === 'painting' ? uebungFormate() : ''}
    ${section('Zum Merken', `<ul>${c.merke.map((m) => `<li>${m}</li>`).join('')}</ul>
      <label class="dg-done"><input type="checkbox" id="chapter-done"> Labor abgeschlossen</label>
      <p class="story-note">${{ copyspace: 'Automatisch abgehakt, sobald Ihr Textblock mindestens 4,5 : 1 Kontrast hat, das Motiv frei lässt und ohne Hinterlegung auskommt.', controlnet: 'Automatisch abgehakt, sobald Sie eine Skizze mit mindestens drei Strichen mit zwei Bedingungen ausprobiert haben.', tiefe: 'Automatisch abgehakt, wenn die Übung höchstens einen Fehler hat und die Überschrift richtig liegt.', painting: 'Automatisch abgehakt, wenn in der Übung höchstens ein Fall daneben liegt.' }[c.id]}</p>`, true, 'dg-merke')}`;
}
function wireChapter(c) {
  wireCopyspace(); wireControlnet(); wireTiefe(); wireUebungTiefe(); wireFormate(); wireUebungFormate();
  const box = $('#chapter-done');
  const sync = () => { box.checked = Boolean(done[c.id]); };
  sync();
  box.onchange = () => { done[c.id] = box.checked; save(); sidebar.querySelector(`[href="#${c.id}"]`)?.classList.toggle('story-done', box.checked); };
  const art = content.firstElementChild; art.addEventListener('change', sync); art.addEventListener('click', () => setTimeout(sync, 0));
}

/* ---------- Wissen und Quiz ---------- */
function wissenPage(p) {
  const head = `<h1 class="page-title purple">${p.title}</h1>`;
  if (p.id === 'glossar') return head + section('Begriffe zum Nachschlagen', `<dl>${[...terms].sort(([a], [b]) => a.localeCompare(b, 'de')).map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>`, true);
  return head + section('Literatur und Quellen', `<ul class="dg-lit">${literature.map(([a, t, v, y, n, u]) => `<li><b>${a}:</b> ${u ? `<a href="${u}"><cite>${t}</cite></a>` : `<cite>${t}</cite>`}. ${v}, ${y}. <span class="story-note">${n}</span></li>`).join('')}</ul>`, true)
    + section('Bildnachweis', `<p>Die Beispielbilder sind mit Magnific erzeugt und als KI-generiert gekennzeichnet; sie haben keine reale Vorlage. Die 9:16-Fassung der Flusspromenade ist mit dem Expand-Werkzeug von Magnific aus dem Querformat erweitert. Die Landschaft in Labor 3, ihre Tiefenkarte und die schematische Vorschau des Simulators sind eigene Darstellungen.</p>
      <ul class="dg-lit">${Object.values(bilder).map((b) => `<li>${esc(b.caption)}: KI-generiert</li>`).join('')}</ul>`)
    + section('Weiter im System', '<p>Dieser Exkurs gehört zu <a href="../ux-ki/">Lernmodul 10, UX &amp; KI</a>, besonders zu den Kapiteln <a href="../ux-ki/#bearbeitung">Generative Bildbearbeitung</a> und <a href="../ux-ki/#recht">Recht, Ethik, Rolle</a>. Raster vertiefen Sie in <a href="../layout-raster/">Layout und Raster</a>, Parallax in <a href="../scrollytelling/#parallax">Scrollytelling mit Figma</a>.</p>');
}
function quizPageHtml(p) {
  return `<h1 class="page-title purple">${p.title}</h1><p class="page-intro">Wählen Sie je Frage eine Antwort. Nach dem Auswerten sehen Sie zu jeder Frage eine Erklärung.</p>
    <form id="quiz-form">${quiz.map(([q, a], i) => `<fieldset class="story-question"><legend>${i + 1}. ${q}</legend>${a.map((t, k) => `<label><input type="radio" required name="q${i}" value="${k}"> ${t}</label>`).join('')}<p class="story-result" data-fb="q${i}"></p></fieldset>`).join('')}
      <button class="btn btn-primary">Quiz auswerten</button><p class="story-result" id="quiz-result" role="status" tabindex="-1"></p></form>`;
}
function wireQuiz() {
  $('#quiz-form').onsubmit = (ev) => {
    ev.preventDefault();
    const v = new FormData(ev.target); let score = 0;
    quiz.forEach(([, , c, fb], i) => { const ok = Number(v.get(`q${i}`)) === c; score += Number(ok); content.querySelector(`[data-fb="q${i}"]`).textContent = `${ok ? 'Richtig.' : 'Noch nicht richtig.'} ${fb}`; });
    const r = $('#quiz-result'); r.textContent = `${score} von ${quiz.length} Antworten richtig.`; r.focus();
    if (score >= Math.ceil(quiz.length * 0.8)) markDone('quiz');
  };
}

const EXT_ICON = '<svg class="dg-ext-icon" aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
function markExternal(root) {
  root.querySelectorAll('a[href^="http"]').forEach((a) => { if (a.dataset.ext) return; a.dataset.ext = '1'; a.target = '_blank'; a.rel = 'noopener'; a.classList.add('dg-ext'); a.insertAdjacentHTML('beforeend', `${EXT_ICON}<span class="dg-sr"> (öffnet in neuem Fenster)</span>`); });
}

/* ---------- Menü und Routing ---------- */
function setMenu(open, returnFocus = false) {
  document.body.classList.toggle('nav-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  if (open) sidebar.querySelector('[aria-current="page"]')?.focus();
  if (returnFocus) menu.focus();
}
menu.onclick = () => setMenu(menu.getAttribute('aria-expanded') === 'false');
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && document.body.classList.contains('nav-open')) setMenu(false, true); });
document.addEventListener('click', (ev) => { if (document.body.classList.contains('nav-open') && !sidebar.contains(ev.target) && !menu.contains(ev.target)) setMenu(false); });
window.matchMedia('(min-width: 769px)').addEventListener('change', () => setMenu(false));

function route(focus = false) {
  const hash = location.hash.slice(1);
  if (hash === 'main' && content.firstElementChild) return;
  cleanup();
  const page = pages.find((p) => p.id === hash) || pages[0];
  const idx = pages.indexOf(page), prev = pages[idx - 1], next = pages[idx + 1];
  const pager = (item, dir) => item ? `<a class="pager-${dir}" href="#${item.id}"><small>${dir === 'prev' ? '← Zurück' : 'Weiter →'}</small><b>${item.title}</b></a>` : '<span></span>';
  const body = page.art === 'kapitel' ? chapterPage(page) : page.art === 'quiz' ? quizPageHtml(page) : page.art === 'wissen' ? wissenPage(page) : '';
  content.innerHTML = page.id === 'home' ? overview() : `<article class="content-card">
    <div class="content-head"><a class="sidebar-header" href="#home"><span class="sidebar-logo">${KURZ}</span><span class="sidebar-brand">
      <span class="sidebar-brand-name">${NAME}</span><span class="sidebar-brand-subtitle">Exkurs · Lernmodul 10 · UX &amp; KI</span></span></a></div>
    ${body}
    <nav class="pager" aria-label="Seiten blättern">${pager(prev, 'prev')}${pager(next, 'next')}</nav></article>`;
  markExternal(content);
  sidebar.querySelectorAll('.nav-item').forEach((link) => {
    const id = link.hash.slice(1), active = link.getAttribute('href') === `#${page.id}`;
    link.classList.toggle('active', active);
    link.classList.toggle('story-done', Boolean(done[id]) && link.getAttribute('href').startsWith('#'));
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  document.title = page.id === 'home' ? `${NAME}: ${UNTER} · Exkurs zu Lernmodul 10` : `${page.title} · ${NAME}`;
  setMenu(false);
  if (page.art === 'kapitel') wireChapter(page);
  if (page.art === 'quiz') wireQuiz();
  if (focus) { const h = content.querySelector('h1'); h.tabIndex = -1; h.focus({ preventScroll: true }); window.scrollTo(0, 0); }
}
window.addEventListener('hashchange', () => route(true));
route();
