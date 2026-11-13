import { chapters, abListe, kegelBereiche, kegelPreferable, steeple, faelle } from './kapitel.js?v=2';
import { terms, quiz, literature } from './wissen.js?v=2';
import { kegelZonen, kegelFaelle, signalArten, steepleOptionen, signalFaelle, prinzipien } from './uebungen.js?v=1';
import { slots, tokens, techArtikel, techArtikelM, techDativ, bloecke } from './labor.js?v=2';
import { bilder } from './bilder.js?v=1';
import { diagramme } from './diagramme.js?v=1';
import { makeDocx } from './docx.js?v=1';

/* Modulnummer an einer Stelle (Übersicht, Titel, Exporte) */
const MODUL = '13';
const NAME = 'Futuring & Critical Design';

const $ = (s) => document.querySelector(s);
const content = $('#fu-content');
const sidebar = $('#sidebar');
const menu = $('.menu-btn');
const storageKey = 'futuring:v1';
const nr = (i) => String(i + 1).padStart(2, '0');
const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tok = (id) => tokens.find((t) => t.id === id);

const exercises = [
  { id: 'u-labor', tile: 'labor', title: 'Labor: Von Variablen zum Prototyp', subtitle: 'Teil 4 · Variablen mischen, Szenario zusammensetzen, ein Interface aus 2040 entwerfen und an Ethik-Reglern drehen', icon: 'lab' },
  { id: 'u-signale', tile: 'signalwand', title: 'Signal, Trend oder Wild Card?', subtitle: 'Acht Beobachtungen einordnen und einem STEEPLE-Bereich zuweisen', icon: 'signal' },
  { id: 'u-kegel', tileFig: 'kegel', title: 'Szenarien im Kegel', subtitle: 'Teil 6 · Acht Szenarien per Drag & Drop oder Auswahl in den Futures Cone einordnen', icon: 'cone' },
  { id: 'u-manifest', tile: 'ausstellung', title: 'Ihr Manifest', subtitle: 'Teil 6 · Prinzipien wählen, eigene ergänzen und als Word-Dokument oder Markdown exportieren', icon: 'check' }
];
const wissenPages = [
  { id: 'glossar', tile: 'prototyp', title: 'Glossar', subtitle: `${terms.length} Begriffe von A/B-Liste bis Wild Card`, icon: 'book', chip: 'A–Z' },
  { id: 'literatur', tile: 'hero', title: 'Literatur und Bildnachweis', subtitle: 'Grundlagentexte, Rechtsquellen und Nachweise', icon: 'book', chip: 'L' }
];
const quizPage = { id: 'quiz', tile: 'benachrichtigungen', title: 'Quiz Futuring', subtitle: `${quiz.length} Fragen quer durch alle Teile`, icon: 'quiz' };
const pages = [{ id: 'home', title: 'Übersicht', icon: 'grid' }, ...chapters, ...exercises, ...wissenPages, quizPage];
const chapterTiles = { einfuehrung: { tile: 'ausstellung' }, kegel: { tileFig: 'kegel' }, signale: { tile: 'signalwand' }, fallstudien: { tile: 'prototyp' }, ethik: { tile: 'benachrichtigungen' } };

const icons = {
  grid: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  book: 'M12 6v14M12 6C9 4 6 4 3 5v13c3-1 6-1 9 2 3-3 6-3 9-2V5c-3-1-6-1-9 1Z',
  chapter: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7m-7 4h5',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm3.5 5.5-2 5-5 2 2-5z',
  cone: 'M3 12 21 4v16zM3 12h18',
  signal: 'M4 18a8 8 0 0 1 0-12m16 12a8 8 0 0 0 0-12M8 15a4 4 0 0 1 0-6m8 6a4 4 0 0 0 0-6M12 12h.01',
  gallery: 'M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4',
  lab: 'M9 3h6M10 3v6L4 19a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2L14 9V3M7 15h10',
  check: 'M4 12l5 5L20 6',
  quiz: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4h.01'
};
const icon = (n) => `<svg class="icon-svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[n] || icons.chapter}"/></svg>`;

let stored = {};
try { stored = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
const done = stored.done || {};
const drafts = stored.drafts || {};
const labor = stored.labor || { slot: {}, phase: 1, level: {}, active: ['notification', 'cta', 'consent'] };
const manifest = stored.manifest || { checked: [] };
function save() { try { localStorage.setItem(storageKey, JSON.stringify({ done, drafts, labor, manifest })); } catch {} }
function markDone(id) { if (!done[id]) { done[id] = true; save(); sidebar.querySelector(`[href="#${id}"]`)?.classList.add('story-done'); } }
function wireDrafts() { content.querySelectorAll('[data-draft]').forEach((f) => { f.value = drafts[f.dataset.draft] || ''; f.addEventListener('input', () => { drafts[f.dataset.draft] = f.value; save(); }); }); }
const download = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
const announce = (t) => { const r = $('#fu-live'); if (r) { r.textContent = ''; setTimeout(() => { r.textContent = t; }, 30); } };

/* ---------- Navigation ---------- */
const navItem = (page, label) => `<a class="nav-item" href="#${page.id}"><span class="nav-icon">${icon(page.icon || 'chapter')}</span>${label || page.title}</a>`;
$('#fu-nav').innerHTML = [
  navItem(pages[0]),
  '<div class="nav-section-label">Kapitel</div>',
  ...chapters.map((c, i) => navItem(c, `${nr(i)}. ${c.title}`)),
  '<div class="nav-section-label">Labor und Übungen</div>',
  ...exercises.map((e, i) => navItem(e, `Ü${i + 1}. ${e.title}`)),
  '<div class="nav-section-label">Wissen</div>',
  ...wissenPages.map((p) => navItem(p)),
  '<div class="nav-section-label">Wissenstest</div>',
  navItem(quizPage)
].join('');

/* ---------- Bilder ---------- */
function figure(key) {
  const b = bilder[key];
  if (!b) return '';
  return `<figure class="dg-fig"><img src="img/${b.file}" alt="${esc(b.alt)}" width="${b.w}" height="${b.h}" loading="lazy">
    <span class="ki-badge" aria-hidden="true">KI-generiert</span>
    <figcaption>${esc(b.caption)} <span class="dg-credit">KI-generiert mit Magnific, Stimmungsbild ohne reale Vorlage</span></figcaption></figure>`;
}
function diagram(key) {
  const d = diagramme[key];
  if (!d) return '';
  return `<figure class="dg-fig sc-diagram">${d.svg.replace('role="img">', `role="img" aria-label="${esc(d.alt)}">`)}<figcaption>${esc(d.caption)} <span class="dg-credit">Schemazeichnung</span></figcaption></figure>`;
}
const kegelTile = `<svg viewBox="0 0 320 200">${[...kegelBereiche].reverse().map((b) => `<path class="fu-k fu-k-${b.id}" d="M30 100 L300 ${100 - 90 * b.w} Q312 100 300 ${100 + 90 * b.w} Z"/>`).join('')}<circle cx="30" cy="100" r="5" class="sc-d-accent"/></svg>`;
function tileArt(page, chip) {
  const t = { ...page, ...(chapterTiles[page.id] || {}) };
  const b = t.tile && bilder[t.tile];
  const badge = done[page.id] ? '<span class="tag-done">Erledigt</span>' : '';
  const art = b ? `<img src="img/${b.file}" alt="" width="${b.w}" height="${b.h}" loading="lazy"><span class="ki-badge" aria-hidden="true">KI-generiert</span>`
    : t.tileFig === 'kegel' ? `<span class="sc-tile-fig" aria-hidden="true">${kegelTile}</span>`
    : `<span class="dg-tile-icon" aria-hidden="true">${icon(page.icon || 'chapter')}</span>`;
  return `<div class="art${b ? '' : ' art-plain'}">${art}${badge}<span class="chip-num" aria-hidden="true">${chip}</span></div>`;
}
const tile = (page, chip, label) => `<li><a class="ptile" href="#${page.id}">${tileArt(page, chip)}
  <div class="tile-body"><h3>${page.title}</h3><p>${page.period ? `${page.period} · ` : ''}${page.lead ? page.lead.split('. ')[0] + '.' : page.subtitle}</p><span class="go">${label}</span></div></a></li>`;

/* ---------- Übersicht ---------- */
function overview() {
  const count = chapters.filter(({ id }) => done[id]).length;
  return `<div class="home">
    <section class="home-hero">
      <div>
        <div class="mod-chip" aria-hidden="true">FC</div>
        <p class="hero-eyebrow">Lernmodul ${MODUL} · Master Medieninformatik</p>
        <h1>${NAME}</h1>
        <p class="hero-lead">Zukünfte systematisch erkunden und Technik kritisch befragen: vom Unterschied zwischen affirmativem und kritischem Design über den Futures Cone, Signale und Szenarien bis zum Labor, in dem Sie ein Interface aus dem Jahr 2040 entwerfen und an seinen ethischen Grenzen drehen.</p>
        <div class="hero-actions"><div class="hero-cta">
          <a class="btn btn-primary" href="#einfuehrung">Modul starten <span aria-hidden="true">→</span></a>
          <a class="btn" href="#u-labor">Direkt ins Labor</a>
        </div>
          <a class="btn btn-download" href="downloads/futuring-zusammenfassung.pdf" download>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>
            Zusammenfassung als PDF
          </a>
        </div>
        <p class="hero-meta"><span><b>${chapters.length}</b> Kapitel</span><span><b>1</b> Labor in 3 Phasen</span><span><b>${exercises.length - 1}</b> Übungen</span><span><b>${quiz.length}</b> Quizfragen</span><span>ca. <b>4 Std.</b></span></p>
      </div>
      <figure class="hero-media">
        <img src="img/hero.webp" alt="${esc(bilder.hero.alt)}" width="1200" height="896" fetchpriority="high">
        <figcaption class="ki-badge">KI-generiert</figcaption>
      </figure>
    </section>
    <div class="progress-band">
      <label class="label" for="home-progress">Ihr Fortschritt</label>
      <progress id="home-progress" max="${chapters.length}" value="${count}"></progress>
      <b>${count} / ${chapters.length} Kapitel</b>
    </div>
    <div class="home-section-label"><h2>Kapitel</h2><span>Teile 1, 2, 3 und 5</span></div>
    <ul class="tiles">${chapters.map((c, i) => tile(c, nr(i), 'Kapitel lesen')).join('')}</ul>
    <div class="home-section-label"><h2>Labor und Übungen</h2><span>Teile 4 und 6</span></div>
    <ul class="tiles">${exercises.map((e, i) => tile(e, `Ü${i + 1}`, i ? 'Übung starten' : 'Labor öffnen')).join('')}</ul>
    <div class="home-section-label"><h2>Wissen</h2><span>Nachschlagen</span></div>
    <ul class="tiles">${wissenPages.map((p) => tile(p, p.chip, 'Öffnen')).join('')}</ul>
    <div class="home-section-label"><h2>Wissenstest</h2><span>Quiz</span></div>
    <ul class="tiles">${tile(quizPage, '?', 'Quiz starten')}</ul>
    <p class="footer-note">Lernmodul ${MODUL} · Lern-Apps Gestaltung &amp; UX · Hochschule Karlsruhe, Fakultät IWI · Fotos KI-generiert (Magnific), Schemazeichnungen eigene Darstellung · Szenarien im Labor aus vorbereiteten Textbausteinen, keine KI · Rechtliche Hinweise sind eine Lernhilfe, keine Rechtsberatung</p>
  </div>`;
}

const section = (title, body, panel = false, cls = '') => `<section class="story-section${panel ? ' story-panel' : ''}${cls ? ' ' + cls : ''}"><h2>${title}</h2>${body}</section>`;
function table(t) {
  return `<div class="sc-table-wrap" tabindex="0" role="region" aria-label="Tabelle"><table class="sc-table"><thead><tr>${t.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
    <tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/* ---------- Demos in Kapiteln ---------- */
function demoAB() {
  return `<div class="fu-ab-actions"><button type="button" class="btn" id="ab-all">Alle umdrehen</button></div>
    <ul class="fu-ab">${abListe.map(([a, b, ae, be], i) => `<li><button type="button" class="fu-flip" aria-pressed="false" data-i="${i}">
      <span class="fu-side fu-a"><small>A · affirmativ</small><b>${a}</b><i lang="en">${ae}</i></span>
      <span class="fu-side fu-b"><small>B · kritisch</small><b>${b}</b><i lang="en">${be}</i></span></button></li>`).join('')}</ul>
    <p class="story-note">Auswahl aus der A/B-Liste in Dunne, A.; Raby, F.: Speculative Everything. MIT Press, 2013. Die Liste ist dort länger.</p>`;
}
function wireAB() {
  const list = content.querySelector('.fu-ab'); if (!list) return;
  list.onclick = (e) => { const b = e.target.closest('.fu-flip'); if (b) b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); };
  $('#ab-all').onclick = () => { const all = [...list.querySelectorAll('.fu-flip')]; const to = all.some((b) => b.getAttribute('aria-pressed') !== 'true'); all.forEach((b) => b.setAttribute('aria-pressed', String(to))); };
}
function demoKegel() {
  return `<div class="fu-cone">
    <svg viewBox="0 0 640 320" role="img" aria-label="Futures Cone: Von der Gegenwart links öffnet sich ein Kegel nach rechts. Innen liegt der fortgeschriebene Bereich, außen der abwegige. Ein gestrichelter Bereich zeigt die wünschenswerten Zukünfte." id="cone-svg"></svg>
    <div class="fu-cone-controls">
      <label for="cone-year">Blick in die Zukunft bis <output id="cone-year-out">2040</output></label>
      <input type="range" id="cone-year" min="2026" max="2050" step="1" value="2040">
    </div>
    <div class="fu-cone-buttons" role="group" aria-label="Bereich des Kegels wählen">${[...kegelBereiche, kegelPreferable].map((b) => `<button type="button" class="btn" data-k="${b.id}" aria-pressed="false">${b.name}</button>`).join('')}</div>
    <div class="fu-cone-info" id="cone-info" aria-live="polite"><p>Wählen Sie einen Bereich im Kegel oder über die Schaltflächen.</p></div>
  </div>`;
}
function drawKegel(sel) {
  const svg = $('#cone-svg'); if (!svg) return;
  const year = Number($('#cone-year').value);
  const p = (year - 2026) / 24, ox = 50, oy = 160, hx = 140 + p * 360, half = 18 + p * 120;
  const label = (b) => `<text class="sc-d-small fu-k-label" x="${hx + 14}" y="${oy - half * b.w + 4}">${b.name}</text>`;
  const shape = (b) => `<path class="fu-k fu-k-${b.id}${sel === b.id ? ' is-sel' : ''}" data-k="${b.id}" d="M${ox} ${oy} L${hx} ${oy - half * b.w} Q${hx + 12 * b.w + 4} ${oy} ${hx} ${oy + half * b.w} Z"/>`;
  const pref = `<ellipse class="fu-k fu-k-preferable${sel === 'preferable' ? ' is-sel' : ''}" data-k="preferable" cx="${ox + (hx - ox) * 0.78}" cy="${oy - half * 0.22}" rx="${(hx - ox) * 0.2}" ry="${half * 0.32}"/>`;
  svg.innerHTML = `<line class="sc-d-line" x1="20" y1="300" x2="620" y2="300"/>
    <text class="sc-d-small" x="${ox}" y="318" text-anchor="middle">Heute (2026)</text><text class="sc-d-small" x="${hx}" y="318" text-anchor="middle">${year}</text>
    ${[...kegelBereiche].reverse().map(shape).join('')}${pref}
    <circle cx="${ox}" cy="${oy}" r="6" class="sc-d-accent"/>
    ${p > 0.3 ? kegelBereiche.filter((b) => b.w >= 0.2).map(label).join('') + `<text class="sc-d-small fu-k-label" x="${ox + (hx - ox) * 0.78}" y="${oy - half * 0.22 - half * 0.32 - 6}" text-anchor="middle">Preferable</text>` : ''}`;
}
function wireKegel() {
  if (!$('#cone-svg')) return;
  let sel = '';
  const show = (id) => {
    sel = id;
    const b = [...kegelBereiche, kegelPreferable].find((x) => x.id === id);
    $('#cone-info').innerHTML = `<h3>${b.name} <span>· ${b.de}</span></h3><p>${b.def}</p><p><b>Beispiel aus der Medieninformatik:</b> ${b.bsp}</p>`;
    content.querySelectorAll('.fu-cone-buttons [data-k]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.k === id)));
    drawKegel(sel);
  };
  $('#cone-year').oninput = () => { $('#cone-year-out').textContent = $('#cone-year').value; drawKegel(sel); };
  content.querySelector('.fu-cone-buttons').onclick = (e) => { const b = e.target.closest('[data-k]'); if (b) show(b.dataset.k); };
  $('#cone-svg').onclick = (e) => { const p = e.target.closest('[data-k]'); if (p) show(p.dataset.k); };
  drawKegel();
}
const demoSteeple = () => `<div class="fu-steeple">${steeple.map(([k, en, de, q, bsp]) => `<details><summary><span class="fu-letter" aria-hidden="true">${k}</span> ${de} <small lang="en">${en}</small></summary><p><b>Leitfrage:</b> ${q}</p><p><b>Beispiele:</b> ${bsp}</p></details>`).join('')}</div>`;
const demoFaelle = () => `<ul class="fu-cases">${faelle.map(([t, y, s, d, f, lt, u]) => `<li class="dg-person"><p class="dg-life">${y} · ${s}</p><h3>${t}</h3><p>${d}</p><p class="fu-frage"><b>Frage an das Publikum:</b> ${f}</p><a href="${u}">${lt}</a></li>`).join('')}</ul>`;

function sectionHtml(s) {
  const imgs = (s.img || []).filter((k) => bilder[k]);
  const demo = { ab: demoAB, kegel: demoKegel, steeple: demoSteeple, faelle: demoFaelle }[s.demo];
  return `<section class="story-section"><h2>${s.h}</h2>
    ${(s.p || []).map((t) => `<p>${t}</p>`).join('')}
    ${s.list ? `<ul>${s.list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
    ${s.table ? table(s.table) : ''}
    ${demo ? demo() : ''}
    ${s.fig ? `<div class="dg-figs">${diagram(s.fig)}</div>` : ''}
    ${imgs.length ? `<div class="dg-figs${imgs.length > 1 ? ' two' : ''}">${imgs.map((k) => figure(k)).join('')}</div>` : ''}
  </section>`;
}
function chapterPage(c, i) {
  return `<div class="lektion-badge"><span class="lektion-number">${nr(i)}</span><span class="lektion-label">${c.period}</span></div>
    <h1 class="page-title purple">${c.title}</h1><p class="page-intro">${c.lead}</p>
    ${c.sections.map(sectionHtml).join('')}
    ${c.task ? section(c.task.title, `<p>${c.task.text}</p><div class="story-fields">${c.task.fields.map((f, j) => `<label>${f}<textarea data-draft="${c.id}:${j}" rows="3"></textarea></label>`).join('')}<p class="story-note">Ihre Notizen werden nur in diesem Browser gespeichert.</p></div>`, true) : ''}
    ${section('Zum Merken', `<ul>${c.merke.map((m) => `<li>${m}</li>`).join('')}</ul>
      <label class="dg-done"><input type="checkbox" id="chapter-done"> Kapitel gelesen</label>`, true, 'dg-merke')}`;
}
function wireChapter(c) {
  wireDrafts(); wireAB(); wireKegel();
  const box = $('#chapter-done');
  box.checked = Boolean(done[c.id]);
  box.onchange = () => { done[c.id] = box.checked; save(); sidebar.querySelector(`[href="#${c.id}"]`)?.classList.toggle('story-done', box.checked); };
}

/* ---------- Labor ---------- */
const PHASEN = ['Variablen mischen', 'Szenario', 'Diegetischer Prototyp'];
function laborHtml() {
  return `<ol class="fu-steps" aria-label="Phasen des Labors">${PHASEN.map((p, i) => `<li data-p="${i + 1}"><button type="button" class="fu-step-btn" data-goto="${i + 1}"><span>${i + 1}</span>${p}</button></li>`).join('')}</ol>
    <p class="dg-sr" id="fu-live" aria-live="polite"></p>
    <div id="lab-stage"></div>`;
}
function scenario() {
  const t = tok(labor.slot.tech), tr = tok(labor.slot.trend), o = tok(labor.slot.ort);
  const mark = (s, k) => `<mark class="fu-kw fu-kw-${k}">${s}</mark>`;
  const male = ['lernen', 'gesundheit'].includes(o.id);
  const artikel = (o.id === 'wohnen' ? techDativ : male ? techArtikelM : techArtikel)[t.id];
  const szene = o.szene(artikel).replace(artikel, mark(artikel, 'tech')).replace(artikel[0].toUpperCase() + artikel.slice(1), (x) => mark(x, 'tech'));
  const kegel = kegelBereiche.find((k) => k.id === t.kegel);
  return { t, tr, o, kegel, html: `<p>Karlsruhe, 2040. ${mark(tr.label, 'trend')}: ${tr.welt} ${mark(t.label, 'tech')}: ${t.alltag}</p>
    <p>${mark(o.label, 'ort')}: ${szene}</p><p>${tr.spannung}</p>`,
    text: `Karlsruhe, 2040. ${tr.label}: ${tr.welt} ${t.label}: ${t.alltag} ${o.label}: ${o.szene(artikel)} ${tr.spannung}`,
    fragen: [t.frage, tr.frage, o.frage] };
}
function phase1() {
  const filled = slots.every(([k]) => labor.slot[k]);
  return `<div class="fu-mixer">
    <div class="fu-pool"><h3>Token-Pool</h3><p class="story-note">Ziehen Sie eine Karte in den passenden Slot oder wählen Sie sie mit Klick, Enter oder Leertaste.</p>
      ${slots.map(([k, l]) => `<h4>${l}</h4><ul class="fu-tokens">${tokens.filter((x) => x.typ === k).map((x) => `<li><button type="button" class="fu-token fu-token-${k}${labor.slot[k] === x.id ? ' is-used' : ''}" draggable="true" data-id="${x.id}" aria-pressed="${labor.slot[k] === x.id}">${x.label}</button></li>`).join('')}</ul>`).join('')}
    </div>
    <div class="fu-drop"><h3>Ihre Mischung</h3>
      ${slots.map(([k, l]) => { const v = labor.slot[k] && tok(labor.slot[k]); return `<div class="fu-slot fu-slot-${k}${v ? ' is-filled' : ''}" data-slot="${k}"><span class="fu-slot-label">${l}</span>${v ? `<span class="fu-chip">${v.label}</span><button type="button" class="btn fu-remove" data-remove="${k}" aria-label="${l} ${v.label} entfernen">Entfernen</button>` : '<span class="fu-slot-empty">Karte hier ablegen</span>'}</div>`; }).join('')}
      <button type="button" class="btn btn-primary" id="lab-gen" ${filled ? '' : 'hidden'}>Szenario erzeugen</button>
      <button type="button" class="btn" id="lab-zufall">Zufällig mischen</button>
    </div></div>`;
}
function phase2(loading) {
  if (loading) return `<div class="fu-skeleton" aria-busy="true"><p class="story-note">Szenario wird aus vorbereiteten Bausteinen zusammengesetzt …</p><span></span><span></span><span></span><span class="short"></span></div>`;
  const s = scenario();
  return `<article class="fu-scenario"><p class="fu-badge-plain">Aus vorbereiteten Textbausteinen zusammengesetzt, keine KI</p>
    <h3>${s.t.label} · ${s.tr.label} · ${s.o.label}</h3>${s.html}
    <p class="fu-kegel-hint"><b>Einordnung im Futures Cone:</b> ${s.kegel.name} (${s.kegel.de}). ${s.kegel.def}</p>
    <h4>Fragen an dieses Szenario</h4><ul>${s.fragen.map((f) => `<li>${f}</li>`).join('')}</ul>
    <p class="story-note">Ist diese Zukunft wünschenswert? Für wen? Halten Sie Ihre Antwort in Phase 3 fest.</p></article>
    <div class="btn-group"><button type="button" class="btn" data-goto="1">Neu mischen</button><button type="button" class="btn btn-primary" data-goto="3">Weiter zum Prototyp</button></div>`;
}
function phase3() {
  const s = scenario();
  return `<p>Entwerfen Sie ein Interface, das in Ihrem Szenario selbstverständlich wäre: einen diegetischen Prototyp. Wählen Sie Bausteine und drehen Sie an den Ethik-Reglern. Bei extremen Werten erscheinen Warnungen mit <b>fiktiven Leitlinien aus dem Jahr 2040</b> und den <b>realen Regeln von heute</b>.</p>
    <p class="fu-scenario-mini"><b>Ihr Szenario:</b> ${s.t.label} · ${s.tr.label} · ${s.o.label}</p>
    <div class="fu-canvas">
      <div class="fu-controls">${bloecke.map((b) => { const lv = labor.level[b.id] ?? 1, on = labor.active.includes(b.id); return `<fieldset class="fu-ctrl${on ? '' : ' is-off'}"><legend><label><input type="checkbox" data-use="${b.id}" ${on ? 'checked' : ''}> ${b.name}</label></legend>
        <label for="lv-${b.id}" class="fu-scale"><span>${b.skala[0]}</span><span>${b.skala[1]}</span></label>
        <input type="range" id="lv-${b.id}" min="0" max="4" step="1" value="${lv}" data-level="${b.id}" ${on ? '' : 'disabled'} aria-valuetext="Stufe ${lv + 1} von 5: ${esc(b.stufen[lv])}">
        <p class="fu-lv-text" id="lvt-${b.id}">${b.stufen[lv]}</p></fieldset>`; }).join('')}</div>
      <div class="fu-phone-wrap"><div class="fu-phone" aria-label="Vorschau des Interfaces" role="region"><div class="fu-phone-head">2040 · ${s.t.label}</div><div id="fu-phone-body"></div></div>
        <p class="story-result" id="fu-bilanz" role="status"></p></div>
    </div>
    <div id="fu-warnings"></div>
    <div class="story-fields"><label>Reflexion: Wo kippt Ihr Interface von hilfreich zu manipulativ? Ist Ihr Szenario wünschenswert, und für wen?<textarea data-draft="u-labor:reflexion" rows="4"></textarea></label></div>
    <div class="btn-group"><button type="button" class="btn" data-goto="2">Zurück zum Szenario</button><a class="btn" href="#u-manifest">Weiter zum Manifest</a></div>`;
}
function renderPhone() {
  const body = $('#fu-phone-body'); if (!body) return;
  const act = bloecke.filter((b) => labor.active.includes(b.id));
  body.innerHTML = act.length ? act.map((b) => { const lv = labor.level[b.id] ?? 1; return `<div class="fu-ui fu-ui-${b.id} lv-${lv}${lv >= b.warnAb ? ' is-crit' : ''}"><small>${b.name}</small><span>${b.stufen[lv]}</span></div>`; }).join('') : '<p class="story-note">Wählen Sie links mindestens einen Baustein.</p>';
  const crit = act.filter((b) => (labor.level[b.id] ?? 1) >= b.warnAb);
  const low = act.filter((b) => b.zuDezent && (labor.level[b.id] ?? 1) === 0);
  $('#fu-warnings').innerHTML = [...crit.map((b) => `<div class="fu-warn" role="note"><h4>${b.name}: ${b.muster}</h4>
      <p><span class="fu-tag fu-tag-fiktiv">Fiktiv</span> ${b.fiktiv}</p><p><span class="fu-tag fu-tag-real">Heute</span> ${b.real.replace(/^Heute: /, '')}</p></div>`),
    ...low.map((b) => `<div class="fu-warn fu-warn-low" role="note"><h4>${b.name}: zu dezent?</h4><p>${b.zuDezent}</p></div>`)].join('');
  $('#fu-bilanz').textContent = act.length ? `Ethik-Bilanz: ${crit.length} von ${act.length} Elementen kritisch.` : '';
}
function wireLabor() {
  const stage = $('#lab-stage');
  const go = (p) => {
    labor.phase = p; save();
    content.querySelectorAll('.fu-steps li').forEach((li) => { const n = Number(li.dataset.p); li.classList.toggle('is-active', n === p); li.querySelector('button').setAttribute('aria-current', n === p ? 'step' : 'false'); li.querySelector('button').disabled = n > 1 && !slots.every(([k]) => labor.slot[k]); });
    if (p === 1) { stage.innerHTML = phase1(); wireMixer(); }
    if (p === 2) {
      stage.innerHTML = phase2(true);
      setTimeout(() => { stage.innerHTML = phase2(false); markExternal(stage); stage.querySelector('h3')?.setAttribute('tabindex', '-1'); stage.querySelector('h3')?.focus(); announce('Szenario erzeugt.'); }, reduced() ? 0 : 1100);
    }
    if (p === 3) { stage.innerHTML = phase3(); wireCanvas(); }
  };
  content.firstElementChild.addEventListener('click', (e) => { const g = e.target.closest('[data-goto]'); if (g && !g.disabled) go(Number(g.dataset.goto)); });
  function place(id) {
    const t = tok(id); if (!t) return;
    labor.slot[t.typ] = id; save();
    stage.innerHTML = phase1(); wireMixer();
    announce(`${t.label} liegt im Slot ${slots.find(([k]) => k === t.typ)[1]}.${slots.every(([k]) => labor.slot[k]) ? ' Alle drei Slots belegt, Szenario kann erzeugt werden.' : ''}`);
    stage.querySelector(`[data-id="${id}"]`)?.focus();
    go1Enable();
  }
  function go1Enable() { content.querySelectorAll('.fu-steps button').forEach((b) => { if (Number(b.dataset.goto) > 1) b.disabled = !slots.every(([k]) => labor.slot[k]); }); }
  function wireMixer() {
    stage.querySelectorAll('.fu-token').forEach((b) => {
      b.onclick = () => place(b.dataset.id);
      b.ondragstart = (e) => { e.dataTransfer.setData('text/plain', b.dataset.id); e.dataTransfer.effectAllowed = 'move'; };
    });
    stage.querySelectorAll('.fu-slot').forEach((s) => {
      s.ondragover = (e) => { e.preventDefault(); s.classList.add('is-over'); };
      s.ondragleave = () => s.classList.remove('is-over');
      s.ondrop = (e) => {
        e.preventDefault(); s.classList.remove('is-over');
        const t = tok(e.dataTransfer.getData('text/plain'));
        if (!t) return;
        if (t.typ !== s.dataset.slot) { announce(`${t.label} gehört in den Slot ${slots.find(([k]) => k === t.typ)[1]}. Die Karte wurde dort abgelegt.`); }
        place(t.id);
      };
    });
    stage.querySelectorAll('[data-remove]').forEach((b) => b.onclick = () => { delete labor.slot[b.dataset.remove]; save(); stage.innerHTML = phase1(); wireMixer(); go1Enable(); announce('Slot geleert.'); stage.querySelector('.fu-token')?.focus(); });
    $('#lab-gen').onclick = () => go(2);
    $('#lab-zufall').onclick = () => { slots.forEach(([k]) => { const l = tokens.filter((x) => x.typ === k); labor.slot[k] = l[Math.floor(Math.random() * l.length)].id; }); save(); stage.innerHTML = phase1(); wireMixer(); go1Enable(); announce('Zufällige Mischung gewählt.'); $('#lab-gen').focus(); };
  }
  function wireCanvas() {
    wireDrafts();
    const check = () => { if (labor.active.length >= 3 && (drafts['u-labor:reflexion'] || '').trim().length > 20) markDone('u-labor'); };
    stage.querySelectorAll('[data-level]').forEach((r) => r.oninput = () => {
      const b = bloecke.find((x) => x.id === r.dataset.level), lv = Number(r.value);
      labor.level[b.id] = lv; save();
      $(`#lvt-${b.id}`).textContent = b.stufen[lv];
      r.setAttribute('aria-valuetext', `Stufe ${lv + 1} von 5: ${b.stufen[lv]}`);
      renderPhone(); check();
    });
    stage.querySelectorAll('[data-use]').forEach((c) => c.onchange = () => {
      labor.active = bloecke.map((b) => b.id).filter((id) => id === c.dataset.use ? c.checked : labor.active.includes(id)); save();
      const fs = c.closest('fieldset'); fs.classList.toggle('is-off', !c.checked); fs.querySelector('[data-level]').disabled = !c.checked;
      renderPhone(); check();
    });
    stage.querySelector('[data-draft]').addEventListener('input', check);
    renderPhone();
  }
  go(labor.phase > 1 && slots.every(([k]) => labor.slot[k]) ? labor.phase : 1);
}

/* ---------- Übungen ---------- */
const opts = (list, first = 'Bitte wählen …') => `<option value="">${first}</option>${list.map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}`;
function feedbackRow(note, ok, text) { note.className = `story-match-note ${ok ? 'is-ok' : 'is-off'}`; note.textContent = text; }

function exercisePage(e, i) {
  const head = `<div class="lektion-badge"><span class="lektion-number">Ü${i + 1}</span><span class="lektion-label">${i === 0 ? 'Teil 4 · Labor' : 'Übung'}</span></div>
    <h1 class="page-title purple">${e.title}</h1><p class="page-intro">${e.subtitle}.</p>`;
  if (e.id === 'u-labor') return head + laborHtml();
  if (e.id === 'u-signale') return head + section('Acht Beobachtungen', `<p>Ordnen Sie jede Beobachtung einer Art zu und wählen Sie den STEEPLE-Bereich, der am besten passt. Bei manchen sind mehrere Bereiche richtig. Grundlagen in <a href="#signale">Kapitel 03</a>.</p>
    ${signalFaelle.map(([t], j) => `<div class="dg-quote"><p>${t}</p><div class="fu-two"><div><label for="sa-${j}">Art</label><select id="sa-${j}">${opts(signalArten)}</select></div><div><label for="sb-${j}">STEEPLE-Bereich</label><select id="sb-${j}">${opts(steepleOptionen)}</select></div></div><p class="story-match-note" id="sg-${j}-note"></p></div>`).join('')}
    <button type="button" class="btn btn-primary" id="sg-check">Einordnung prüfen</button><p class="story-result" id="sg-result" role="status"></p>`, true);
  if (e.id === 'u-kegel') return head + section('Ordnen Sie die Szenarien ein', `<p>Ziehen Sie jede Karte in einen Bereich des Futures Cone oder wählen Sie den Bereich im Auswahlfeld der Karte. Die Grenzen sind fließend. Liegen Sie einen Bereich daneben, gilt das als knapp. Grundlagen in <a href="#kegel">Kapitel 02</a>.</p>
    <div class="fu-sort">
      <ul class="fu-cards" id="ks-pool" data-zone="">${kegelFaelle.map(([t], j) => `<li class="fu-card" draggable="true" data-j="${j}"><p>${t}</p><label for="ks-${j}" class="dg-sr">Bereich für Karte ${j + 1}</label><select id="ks-${j}" data-sel="${j}">${opts(kegelZonen, 'Bereich wählen …')}</select><p class="story-match-note" id="ks-${j}-note"></p></li>`).join('')}</ul>
      <div class="fu-zones">${kegelZonen.map(([k, l]) => `<div class="fu-zone fu-k-${k}" data-zone="${k}"><h3>${l}</h3><ul class="fu-cards"></ul></div>`).join('')}</div>
    </div>
    <button type="button" class="btn btn-primary" id="ks-check">Einordnung prüfen</button><p class="story-result" id="ks-result" role="status"></p>`, true)
    + section('Und was ist wünschenswert?', `<p>Preferable liegt quer zu allen Bereichen. Welches der acht Szenarien halten Sie für wünschenswert, welches nicht, und für wen?</p><div class="story-fields"><label>Ihre Einschätzung<textarea data-draft="u-kegel:preferable" rows="3"></textarea></label></div>`);
  if (e.id === 'u-manifest') return head + section('Wählen Sie Ihre Prinzipien', `<p>Ein Manifest hält fest, wie Sie künftig gestalten wollen. Wählen Sie die Prinzipien, die Sie vertreten, und ergänzen Sie eigene. Ihr Szenario aus dem Labor wird mit exportiert, falls vorhanden.</p>
    <fieldset class="fu-principles"><legend class="dg-sr">Prinzipien</legend>${prinzipien.map((p, j) => `<label><input type="checkbox" data-pr="${j}" ${manifest.checked.includes(j) ? 'checked' : ''}> ${p}</label>`).join('')}</fieldset>
    <div class="story-fields"><label>Titel Ihres Manifests<input type="text" data-draft="u-manifest:titel" placeholder="z. B. Gestalten für faire Zukünfte"></label>
    ${[1, 2, 3].map((n) => `<label>Eigenes Prinzip ${n}<input type="text" data-draft="u-manifest:eigen${n}"></label>`).join('')}</div>
    <p class="story-result" id="mf-sum" role="status"></p>
    <div class="btn-group"><button type="button" class="btn btn-download" id="mf-docx">Word-Dokument</button><button type="button" class="btn" id="mf-md">Markdown</button></div>`, true);
  return head;
}

function wireSignale() {
  $('#sg-check').onclick = () => {
    let right = 0;
    signalFaelle.forEach(([, art, bereiche, why], j) => {
      const a = $(`#sa-${j}`).value, b = $(`#sb-${j}`).value, note = $(`#sg-${j}-note`);
      if (!a || !b) { note.className = 'story-match-note'; note.textContent = 'Wählen Sie Art und Bereich.'; return; }
      const okA = a === art, okB = bereiche.includes(b); right += Number(okA && okB);
      const names = bereiche.map((x) => steepleOptionen.find(([k]) => k === x)[1].split(' · ')[1]).join(' oder ');
      feedbackRow(note, okA && okB, `${okA ? 'Art stimmt.' : 'Art prüfen.'} ${okB ? 'Bereich passt.' : `Passender Bereich: ${names}.`} ${okA ? why : ''}`);
    });
    $('#sg-result').textContent = `${right} von ${signalFaelle.length} vollständig richtig.`;
    if (right >= signalFaelle.length - 1) markDone('u-signale');
  };
}
function wireKegelSort() {
  const order = kegelZonen.map(([k]) => k);
  const move = (j, zone) => {
    const card = content.querySelector(`.fu-card[data-j="${j}"]`);
    const target = zone ? content.querySelector(`.fu-zone[data-zone="${zone}"] .fu-cards`) : $('#ks-pool');
    target.appendChild(card); card.querySelector('select').value = zone;
    drafts[`u-kegel:k${j}`] = zone; save();
  };
  content.querySelectorAll('.fu-card').forEach((c) => {
    c.ondragstart = (e) => { e.dataTransfer.setData('text/plain', c.dataset.j); c.classList.add('is-drag'); };
    c.ondragend = () => c.classList.remove('is-drag');
    c.querySelector('select').onchange = (e) => { move(c.dataset.j, e.target.value); e.target.focus(); };
    const saved = drafts[`u-kegel:k${c.dataset.j}`]; if (saved) move(c.dataset.j, saved);
  });
  content.querySelectorAll('.fu-zone, #ks-pool').forEach((z) => {
    z.ondragover = (e) => { e.preventDefault(); z.classList.add('is-over'); };
    z.ondragleave = () => z.classList.remove('is-over');
    z.ondrop = (e) => { e.preventDefault(); z.classList.remove('is-over'); move(e.dataTransfer.getData('text/plain'), z.dataset.zone || ''); };
  });
  $('#ks-check').onclick = () => {
    let right = 0, near = 0;
    kegelFaelle.forEach(([, zone, why], j) => {
      const v = $(`#ks-${j}`).value, note = $(`#ks-${j}-note`);
      if (!v) { note.className = 'story-match-note'; note.textContent = 'Noch nicht eingeordnet.'; return; }
      const d = Math.abs(order.indexOf(v) - order.indexOf(zone));
      right += Number(d === 0); near += Number(d === 1);
      feedbackRow(note, d === 0, `${d === 0 ? 'Passt.' : d === 1 ? `Knapp, naheliegend ist ${zone}.` : `Naheliegend ist ${zone}.`} ${why}`);
    });
    $('#ks-result').textContent = `${right} von ${kegelFaelle.length} genau, ${near} knapp daneben.`;
    if (right + near === kegelFaelle.length && right >= 5) markDone('u-kegel');
  };
}
function manifestData() {
  const g = (k) => (drafts[`u-manifest:${k}`] || '').trim();
  const s = slots.every(([k]) => labor.slot[k]) ? scenario() : null;
  return { titel: g('titel') || 'Mein Manifest für Futuring und Critical Design', gewaehlt: manifest.checked.sort((a, b) => a - b).map((j) => prinzipien[j]), eigen: [1, 2, 3].map((n) => g(`eigen${n}`)).filter(Boolean), s, reflexion: (drafts['u-labor:reflexion'] || '').trim() };
}
function wireManifest() {
  const sum = () => {
    const d = manifestData(), n = d.gewaehlt.length + d.eigen.length;
    $('#mf-sum').textContent = `${n} Prinzipien im Manifest.${d.s ? ' Ihr Laborszenario wird mit exportiert.' : ''}`;
    if (n >= 5) markDone('u-manifest');
  };
  content.querySelectorAll('[data-pr]').forEach((c) => c.onchange = () => { const j = Number(c.dataset.pr); manifest.checked = c.checked ? [...new Set([...manifest.checked, j])] : manifest.checked.filter((x) => x !== j); save(); sum(); });
  content.firstElementChild.addEventListener('input', sum);
  $('#mf-docx').onclick = () => {
    const d = manifestData();
    const blocks = [
      { eyebrow: true, text: `LERNMODUL ${MODUL} · ${NAME.toUpperCase()} · MANIFEST` },
      { h: 1, text: d.titel },
      { meta: true, text: `Erstellt am ${new Date().toLocaleDateString('de-DE')}` },
      { h: 2, text: 'Prinzipien' },
      ...[...d.gewaehlt, ...d.eigen].map((p, j) => ({ text: `${j + 1}. ${p}` })),
      ...(d.s ? [{ h: 2, text: `Szenario aus dem Labor: ${d.s.t.label} · ${d.s.tr.label} · ${d.s.o.label}` }, { text: d.s.text }, { meta: true, text: 'Aus vorbereiteten Textbausteinen zusammengesetzt, keine KI.' }] : []),
      ...(d.reflexion ? [{ h: 2, text: 'Reflexion zum Prototyp' }, { text: d.reflexion }] : [])
    ];
    download(makeDocx(d.titel, blocks), 'futuring-manifest.docx');
  };
  $('#mf-md').onclick = () => {
    const d = manifestData();
    const md = `# ${d.titel}\n\nLernmodul ${MODUL} · ${NAME} · ${new Date().toLocaleDateString('de-DE')}\n\n## Prinzipien\n\n${[...d.gewaehlt, ...d.eigen].map((p, j) => `${j + 1}. ${p}`).join('\n')}\n`
      + (d.s ? `\n## Szenario aus dem Labor: ${d.s.t.label} · ${d.s.tr.label} · ${d.s.o.label}\n\n${d.s.text}\n\n_Aus vorbereiteten Textbausteinen zusammengesetzt, keine KI._\n` : '')
      + (d.reflexion ? `\n## Reflexion zum Prototyp\n\n${d.reflexion}\n` : '');
    download(new Blob([md], { type: 'text/markdown;charset=utf-8' }), 'futuring-manifest.md');
  };
  sum();
}
function wireExercise(e) {
  if (e.id !== 'u-labor') wireDrafts();
  if (e.id === 'u-labor') wireLabor();
  if (e.id === 'u-signale') wireSignale();
  if (e.id === 'u-kegel') wireKegelSort();
  if (e.id === 'u-manifest') wireManifest();
}

/* ---------- Wissen ---------- */
function wissenPage(p) {
  const head = `<h1 class="page-title purple">${p.title}</h1>`;
  if (p.id === 'glossar') return head + section('Begriffe zum Nachschlagen', `<dl>${[...terms].sort(([a], [b]) => a.localeCompare(b, 'de')).map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>`, true);
  if (p.id === 'literatur') return head + section('Literatur und Quellen', `<ul class="dg-lit">${literature.map(([a, t, v, y, n, u]) => `<li><b>${a}:</b> ${u ? `<a href="${u}"><cite>${t}</cite></a>` : `<cite>${t}</cite>`}. ${v}, ${y}. <span class="story-note">${n}</span></li>`).join('')}</ul>`, true)
    + section('Bildnachweis', `<p>Alle Fotos sind KI-generierte Stimmungsbilder (Magnific) ohne reale Vorlage und als solche gekennzeichnet. Sie zeigen keine realen Werke. Die Fallstudien sind urheberrechtlich geschützt und werden nur beschrieben und verlinkt. Schemazeichnungen und der interaktive Kegel sind eigene Darstellungen.</p>
      <ul class="dg-lit">${Object.values(bilder).map((b) => `<li>${esc(b.caption)}: KI-generiert</li>`).join('')}</ul>`)
    + section('Weitere Module', '<p>Dramaturgie und Worldbuilding vertiefen Sie im Modul <a href="../storytelling/">Storytelling</a>, KI im Gestaltungsprozess in <a href="../ux-ki/">UX &amp; KI</a>, Haltungen der Designgeschichte in <a href="../designgeschichte/">Designgeschichte</a>.</p>');
  return head;
}

/* ---------- Quiz ---------- */
function quizPageHtml() {
  return `<h1 class="page-title purple">${quizPage.title}</h1><p class="page-intro">Wählen Sie je Frage eine Antwort. Nach dem Auswerten sehen Sie zu jeder Frage eine Erklärung.</p>
    <form id="quiz-form">${quiz.map(([q, a], i) => `<fieldset class="story-question"><legend>${i + 1}. ${q}</legend>${a.map((t, k) => `<label><input type="radio" required name="q${i}" value="${k}"> ${t}</label>`).join('')}<p class="story-result" data-fb="q${i}"></p></fieldset>`).join('')}
      <button class="btn btn-primary">Quiz auswerten</button><p class="story-result" id="quiz-result" role="status" tabindex="-1"></p></form>`;
}
function wireQuiz() {
  $('#quiz-form').onsubmit = (ev) => {
    ev.preventDefault();
    const v = new FormData(ev.target);
    let score = 0;
    quiz.forEach(([, , c, fb], i) => {
      const ok = Number(v.get(`q${i}`)) === c; score += Number(ok);
      content.querySelector(`[data-fb="q${i}"]`).textContent = `${ok ? 'Richtig.' : 'Noch nicht richtig.'} ${fb}`;
    });
    const r = $('#quiz-result');
    r.textContent = `${score} von ${quiz.length} Antworten richtig.`;
    r.focus();
    if (score >= Math.ceil(quiz.length * 0.8)) markDone('quiz');
  };
}

/* Externe Links: neues Fenster, Hinweis für Screenreader */
const EXT_ICON = '<svg class="dg-ext-icon" aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
function markExternal(root) {
  root.querySelectorAll('a[href^="http"]').forEach((a) => {
    if (a.dataset.ext) return;
    a.dataset.ext = '1'; a.target = '_blank'; a.rel = 'noopener'; a.classList.add('dg-ext');
    a.insertAdjacentHTML('beforeend', `${EXT_ICON}<span class="dg-sr"> (öffnet in neuem Fenster)</span>`);
  });
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
  const page = pages.find((p) => p.id === hash) || pages[0];
  const ci = chapters.indexOf(page), ei = exercises.indexOf(page);
  const idx = pages.indexOf(page), prev = pages[idx - 1], next = pages[idx + 1];
  const pager = (item, dir) => item ? `<a class="pager-${dir}" href="#${item.id}"><small>${dir === 'prev' ? '← Zurück' : 'Weiter →'}</small><b>${item.title}</b></a>` : '<span></span>';
  let body;
  if (ci >= 0) body = chapterPage(page, ci);
  else if (ei >= 0) body = exercisePage(page, ei);
  else if (page === quizPage) body = quizPageHtml();
  else body = wissenPage(page);
  content.innerHTML = page.id === 'home' ? overview() : `<article class="content-card">
    <div class="content-head"><a class="sidebar-header" href="#home"><span class="sidebar-logo">FC</span><span class="sidebar-brand">
      <span class="sidebar-brand-name">${NAME}</span><span class="sidebar-brand-subtitle">${MODUL} · Lernmodul · Master</span></span></a></div>
    ${body}
    <nav class="pager" aria-label="Seiten blättern">${pager(prev, 'prev')}${pager(next, 'next')}</nav></article>`;
  markExternal(content);
  sidebar.querySelectorAll('.nav-item').forEach((link) => {
    const id = link.hash.slice(1), active = id === page.id;
    link.classList.toggle('active', active);
    link.classList.toggle('story-done', Boolean(done[id]));
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  document.title = page.id === 'home' ? `${NAME} · Lernmodul ${MODUL}` : `${page.title} · ${NAME}`;
  setMenu(false);
  if (ci >= 0) wireChapter(page);
  if (ei >= 0) wireExercise(page);
  if (page === quizPage) wireQuiz();
  if (focus) {
    const h = content.querySelector('h1');
    h.tabIndex = -1; h.focus({ preventScroll: true }); window.scrollTo(0, 0);
  }
}
window.addEventListener('hashchange', () => route(true));
route();
