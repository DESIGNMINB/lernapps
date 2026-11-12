import { chapters } from './kapitel.js?v=3';
import { terms, quiz, plugins, pluginKategorien, quellen } from './wissen.js?v=2';
import { musterOptionen, musterFaelle, storyboard, werkzeugOptionen, werkzeugFaelle, promptKriterien, promptBausteine, a11yFaelle, projektFelder, projektSchritte } from './uebungen.js?v=2';
import { bilder } from './bilder.js?v=1';
import { diagramme } from './diagramme.js?v=1';
import { makeDocx } from './docx.js?v=1';

/* Modulnummer an einer Stelle (Übersicht, Titel, Exporte) */
const MODUL = '05';
const NAME = 'Scrollytelling mit Figma';

const $ = (s) => document.querySelector(s);
const content = $('#sc-content');
const sidebar = $('#sidebar');
const menu = $('.menu-btn');
const storageKey = 'scrollytelling:v1';
const nr = (i) => String(i + 1).padStart(2, '0');
const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const exercises = [
  { id: 'u-muster', tileFig: 'muster', title: 'Scroll-Muster erkennen', subtitle: 'Acht Beschreibungen dem passenden Muster zuordnen', icon: 'scroll' },
  { id: 'u-parallax', tile: 'ebenen-diorama', title: 'Parallax-Spielplatz', subtitle: 'Geschwindigkeiten von vier Ebenen einstellen und Tiefe erzeugen', icon: 'layers' },
  { id: 'u-storyboard', tile: 'storyboard-tisch', title: 'Storyboard ordnen', subtitle: 'Sechs Schritte einer Wassergeschichte in einen Spannungsbogen bringen', icon: 'board' },
  { id: 'u-werkzeug', tile: 'hero', title: 'Werkzeug wählen', subtitle: 'Sechs Projekte: Figma Design, Sites oder Make?', icon: 'tools' },
  { id: 'u-prompt', tile: 'make-arbeitsplatz', title: 'Prompt-Werkstatt', subtitle: 'Einen Prompt für Figma Make schreiben und gegen neun Kriterien prüfen', icon: 'spark' },
  { id: 'u-a11y', tile: 'usability-test', title: 'Barrierefrei oder nicht?', subtitle: 'Acht Umsetzungen beurteilen', icon: 'access' },
  { id: 'u-projekt', tileFig: 'storyboard', title: 'Mini-Projekt: Ihre Seite', subtitle: 'Eigenes Scroll-Storyboard planen und als Word-Dokument exportieren', icon: 'check' }
];
const wissenPages = [
  { id: 'plugins', tileFig: 'parallax', title: 'Hilfreiche Plugins', subtitle: `${plugins.length} kostenlose oder kostenlos nutzbare Erweiterungen`, icon: 'plug', chip: 'P' },
  { id: 'glossar', title: 'Glossar', subtitle: `${terms.length} Begriffe von Ankerlink bis Viewport`, icon: 'book', chip: 'A–Z' },
  { id: 'quellen', title: 'Quellen und Links', subtitle: 'Figma-Hilfe, Barrierefreiheit, Beispiele und Bildnachweis', icon: 'link', chip: 'Q' }
];
const quizPage = { id: 'quiz', tile: 'handy-scroll', title: 'Quiz Scrollytelling', subtitle: `${quiz.length} Fragen quer durch alle Kapitel`, icon: 'quiz' };
const pages = [{ id: 'home', title: 'Übersicht', icon: 'grid' }, ...chapters, ...exercises, ...wissenPages, quizPage];
/* Kachelbilder der Kapitel ohne eigenes Foto */
const chapterTiles = { werkzeuge: { tile: 'hero' }, design: { tileFig: 'position' }, sites: { tileFig: 'sticky-mobil' }, parallax: { tile: 'ebenen-diorama' }, barrierefrei: { tileFig: 'muster' }, testen: { tile: 'usability-test' } };

const icons = {
  grid: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  book: 'M12 6v14M12 6C9 4 6 4 3 5v13c3-1 6-1 9 2 3-3 6-3 9-2V5c-3-1-6-1-9 1Z',
  chapter: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7m-7 4h5',
  scroll: 'M7 3h10v18H7zM12 7v6m-2-2 2 2 2-2',
  board: 'M3 5h18v10H3zM7 15v4m10-4v4M8 9h3m2 0h3',
  tools: 'M4 20l7-7m2-2 7-7M14 4l6 6M4 14l6 6',
  frame: 'M7 3v18M17 3v18M3 7h18M3 17h18',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-9 9h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  spark: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
  layers: 'M12 3 2 8l10 5 10-5zM2 13l10 5 10-5',
  access: 'M12 4a2 2 0 1 0 0 .01M5 8h14m-7 0v6m-4 7 4-7 4 7',
  check: 'M4 12l5 5L20 6',
  plug: 'M9 3v5m6-5v5M6 8h12v3a6 6 0 0 1-12 0zm6 9v4',
  link: 'M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1m2 4a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1',
  quiz: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4h.01'
};
const icon = (n) => `<svg class="icon-svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[n] || icons.chapter}"/></svg>`;

let stored = {};
try { stored = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
const done = stored.done || {};
const drafts = stored.drafts || {};
function save() { try { localStorage.setItem(storageKey, JSON.stringify({ done, drafts })); } catch {} }
function markDone(id) { if (!done[id]) { done[id] = true; save(); sidebar.querySelector(`[href="#${id}"]`)?.classList.add('story-done'); } }
function wireDrafts() {
  content.querySelectorAll('[data-draft]').forEach((f) => { f.value = drafts[f.dataset.draft] || ''; f.addEventListener('input', () => { drafts[f.dataset.draft] = f.value; save(); }); });
}
const download = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };

/* ---------- Navigation ---------- */
const navItem = (page, label) => `<a class="nav-item" href="#${page.id}"><span class="nav-icon">${icon(page.icon || 'chapter')}</span>${label || page.title}</a>`;
$('#sc-nav').innerHTML = [
  navItem(pages[0]),
  '<div class="nav-section-label">Kapitel</div>',
  ...chapters.map((c, i) => navItem(c, `${nr(i)}. ${c.title}`)),
  '<div class="nav-section-label">Übungen</div>',
  ...exercises.map((e, i) => navItem(e, `Ü${i + 1}. ${e.title}`)),
  '<div class="nav-section-label">Wissen</div>',
  ...wissenPages.map((p) => navItem(p)),
  '<div class="nav-section-label">Wissenstest</div>',
  navItem(quizPage)
].join('');

/* ---------- Bilder und Diagramme ---------- */
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
function tileArt(page, chip) {
  const t = { ...page, ...(chapterTiles[page.id] || {}) };
  const key = t.tile || t.img?.[0] || t.sections?.find((s) => s.img)?.img[0];
  const b = key && bilder[key];
  const fig = !b && t.tileFig && diagramme[t.tileFig];
  const badge = done[page.id] ? '<span class="tag-done">Erledigt</span>' : '';
  const art = b ? `<img src="img/${b.file}" alt="" width="${b.w}" height="${b.h}" loading="lazy"><span class="ki-badge" aria-hidden="true">KI-generiert</span>`
    : fig ? `<span class="sc-tile-fig" aria-hidden="true">${fig.svg.replace(' role="img"', '')}</span>`
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
        <div class="mod-chip" aria-hidden="true">SC</div>
        <p class="hero-eyebrow">Lernmodul ${MODUL} · Grundlagen der Mediengestaltung · Exkurs</p>
        <h1>${NAME}</h1>
        <p class="hero-lead">Wie gestalten Sie eine Webseite, die beim Scrollen eine Geschichte erzählt? Dieser Exkurs führt vom Scroll-Storyboard über drei Wege in Figma, nämlich Prototyp in Figma Design, Website mit Figma Sites und Prototyp per Prompt mit Figma Make, bis zu Parallax, Barrierefreiheit und Test.</p>
        <div class="hero-actions"><div class="hero-cta">
          <a class="btn btn-primary" href="#einstieg">Exkurs starten <span aria-hidden="true">→</span></a>
          <a class="btn" href="#plugins">Hilfreiche Plugins</a>
        </div>
          <a class="btn btn-download" href="downloads/scrollytelling-zusammenfassung.pdf" download>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>
            Zusammenfassung als PDF
          </a>
        </div>
        <p class="hero-meta"><span><b>${chapters.length}</b> Kapitel</span><span><b>${exercises.length}</b> Übungen</span><span><b>${plugins.length}</b> Plugins</span><span><b>${quiz.length}</b> Quizfragen</span><span>ca. <b>3 Std.</b></span></p>
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
    <div class="home-section-label"><h2>Kapitel</h2><span>01–${nr(chapters.length - 1)}</span></div>
    <ul class="tiles">${chapters.map((c, i) => tile(c, nr(i), 'Kapitel lesen')).join('')}</ul>
    <div class="home-section-label"><h2>Übungen</h2><span>mit Rückmeldung</span></div>
    <ul class="tiles">${exercises.map((e, i) => tile(e, `Ü${i + 1}`, 'Übung starten')).join('')}</ul>
    <div class="home-section-label"><h2>Wissen</h2><span>Nachschlagen</span></div>
    <ul class="tiles">${wissenPages.map((p) => tile(p, p.chip, 'Öffnen')).join('')}</ul>
    <div class="home-section-label"><h2>Wissenstest</h2><span>Quiz</span></div>
    <ul class="tiles">${tile(quizPage, '?', 'Quiz starten')}</ul>
    <p class="footer-note">Lernmodul ${MODUL} · Lern-Apps Gestaltung &amp; UX · Hochschule Karlsruhe, Fakultät IWI · Fotos KI-generiert (Magnific), Schemazeichnungen eigene Darstellung · Angaben zu Figma: Stand November 2026, Funktionen ändern sich häufig</p>
  </div>`;
}

const section = (title, body, panel = false, cls = '') => `<section class="story-section${panel ? ' story-panel' : ''}${cls ? ' ' + cls : ''}"><h2>${title}</h2>${body}</section>`;

/* ---------- Kapitel ---------- */
function table(t) {
  return `<div class="sc-table-wrap" tabindex="0" role="region" aria-label="Tabelle"><table class="sc-table"><thead><tr>${t.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
    <tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const DEMO_STEPS = [
  ['Schritt 1', 'Diese Grafik bleibt stehen, während der Text an ihr vorbeizieht. Noch zeigt sie nur einen Balken.'],
  ['Schritt 2', 'Mit dem zweiten Schritt kommen zwei Balken dazu. Die Grafik reagiert auf Ihre Scrollposition, nicht auf einen Klick.'],
  ['Schritt 3', 'Der dritte Schritt hebt einen Balken farbig hervor. So lenkt Scrollytelling den Blick auf das, worum es gerade geht.']
];
function demoSticky() {
  const bars = [[40, 70], [100, 120], [160, 95]];
  return `<div class="sc-demo" data-step="1">
    <div class="sc-demo-graphic"><svg viewBox="0 0 220 170" role="img" aria-labelledby="sc-demo-cap">
      <line class="sc-d-line" x1="20" y1="150" x2="210" y2="150"/>
      ${bars.map(([x, h], i) => `<rect class="sc-demo-bar b${i + 1}" x="${x}" y="${150 - h}" width="40" height="${h}" rx="4"/>`).join('')}
    </svg><p class="sc-demo-cap" id="sc-demo-cap" aria-live="polite">Schritt 1 von 3: ein Balken</p></div>
    <div class="sc-demo-steps">${DEMO_STEPS.map(([h, t], i) => `<div class="sc-step" data-i="${i + 1}"><b>${h}</b><p>${t}</p></div>`).join('')}</div>
  </div>`;
}
function wireDemo() {
  const demo = content.querySelector('.sc-demo');
  if (!demo || !('IntersectionObserver' in window)) return;
  const caps = ['', 'Schritt 1 von 3: ein Balken', 'Schritt 2 von 3: drei Balken', 'Schritt 3 von 3: mittlerer Balken hervorgehoben'];
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const i = en.target.dataset.i;
    demo.dataset.step = i;
    demo.querySelectorAll('.sc-step').forEach((s) => s.classList.toggle('is-active', s.dataset.i === i));
    $('#sc-demo-cap').textContent = caps[i];
  }), { rootMargin: '-45% 0px -45% 0px' });
  demo.querySelectorAll('.sc-step').forEach((s) => io.observe(s));
}
function sectionHtml(s) {
  const imgs = (s.img || []).filter((k) => bilder[k]);
  return `<section class="story-section"><h2>${s.h}</h2>
    ${(s.p || []).map((t) => `<p>${t}</p>`).join('')}
    ${s.list ? `<ul>${s.list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
    ${s.table ? table(s.table) : ''}
    ${s.code ? `<div class="sc-code"><div class="sc-code-head"><span>Beispiel-Prompt</span><button type="button" class="btn" data-copy>Kopieren</button></div><pre tabindex="0"><code>${esc(s.code)}</code></pre></div>${s.note ? `<p class="story-note dg-note">${s.note}</p>` : ''}` : ''}
    ${s.demo === 'sticky' ? demoSticky() : ''}
    ${s.fig ? `<div class="dg-figs">${diagram(s.fig)}</div>` : ''}
    ${imgs.length ? `<div class="dg-figs${imgs.length > 1 ? ' two' : ''}">${imgs.map((k) => figure(k)).join('')}</div>` : ''}
  </section>`;
}
function chapterPage(c, i) {
  return `<div class="lektion-badge"><span class="lektion-number">${nr(i)}</span><span class="lektion-label">Kapitel · ${c.period}</span></div>
    <h1 class="page-title purple">${c.title}</h1><p class="page-intro">${c.lead}</p>
    ${c.sections.map(sectionHtml).join('')}
    ${c.task ? section(c.task.title, `<p>${c.task.text}</p><div class="story-fields">${c.task.fields.map((f, j) => `<label>${f}<textarea data-draft="${c.id}:${j}" rows="3"></textarea></label>`).join('')}<p class="story-note">Ihre Notizen werden nur in diesem Browser gespeichert.</p></div>`, true) : ''}
    ${section('Zum Merken', `<ul>${c.merke.map((m) => `<li>${m}</li>`).join('')}</ul>
      <label class="dg-done"><input type="checkbox" id="chapter-done"> Kapitel gelesen</label>`, true, 'dg-merke')}`;
}
function wireChapter(c) {
  wireDrafts();
  wireDemo();
  const box = $('#chapter-done');
  box.checked = Boolean(done[c.id]);
  box.onchange = () => { done[c.id] = box.checked; save(); sidebar.querySelector(`[href="#${c.id}"]`)?.classList.toggle('story-done', box.checked); };
}
function wireCopy() {
  content.querySelectorAll('[data-copy]').forEach((b) => b.onclick = async () => {
    const text = b.closest('.sc-code').querySelector('code').textContent;
    try { await navigator.clipboard.writeText(text); b.textContent = 'Kopiert'; } catch { b.textContent = 'Bitte manuell kopieren'; }
    setTimeout(() => { b.textContent = 'Kopieren'; }, 2000);
  });
}

/* ---------- Übungen ---------- */
const opts = (list, first = 'Bitte wählen …') => `<option value="">${first}</option>${list.map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}`;
function feedbackRow(note, ok, text) { note.className = `story-match-note ${ok ? 'is-ok' : 'is-off'}`; note.textContent = text; }

const LAYERS = [['himmel', 'Hintergrund: Himmel'], ['berge', 'Mittelgrund: Berge'], ['baeume', 'Vordergrund: Bäume'], ['text', 'Textkarte']];
function parallaxHtml() {
  return `<div class="sc-pp-wrap">
    <div class="sc-pp" id="pp" tabindex="0" role="region" aria-label="Vorschau zum Scrollen. Mit Pfeiltasten oder Mausrad scrollen.">
      <div class="sc-pp-stage" aria-hidden="true">
        <div class="sc-pp-layer l-himmel"><svg viewBox="0 0 400 900" preserveAspectRatio="xMidYMin slice"><rect width="400" height="900" class="pp-sky"/><circle cx="300" cy="80" r="34" class="pp-sun"/></svg></div>
        <div class="sc-pp-layer l-berge"><svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMin slice"><path d="M0 220 90 90 160 170 240 60 330 160 400 110V700H0z" class="pp-mount"/></svg></div>
        <div class="sc-pp-layer l-baeume"><svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMin slice"><path d="M0 120c40-20 60 10 100-5s70-25 110 0 60 15 100-5 60-10 90 5V600H0z" class="pp-hill"/>${[30, 80, 150, 230, 300, 360].map((x, i) => `<path d="M${x} ${110 - (i % 2) * 14}l18 52h-36z" class="pp-tree"/>`).join('')}</svg></div>
        <div class="sc-pp-layer l-text"><div class="pp-card"><b>Der Weg des Wassers</b><span>Scrollen Sie in diesem Fenster.</span></div></div>
      </div>
      <div class="sc-pp-track"></div>
    </div>
    <div class="sc-pp-controls">
      ${LAYERS.map(([k, l]) => `<label for="pp-${k}">${l} <output id="pp-${k}-out">1,0</output><input type="range" id="pp-${k}" min="0" max="1.5" step="0.1" value="1"></label>`).join('')}
      <label class="sc-pp-motion"><input type="checkbox" id="pp-motion"> Bewegung in der Vorschau zeigen</label>
      <p class="story-note" id="pp-motion-note"></p>
    </div>
  </div>`;
}
function wireParallax() {
  const pp = $('#pp'), stage = pp.querySelector('.sc-pp-stage');
  const motion = $('#pp-motion');
  motion.checked = !reduced();
  $('#pp-motion-note').textContent = reduced() ? 'Ihr System ist auf „Bewegung reduzieren“ eingestellt. Die Vorschau bewegt sich deshalb erst, wenn Sie das Kästchen aktivieren.' : '';
  const val = (k) => Number($(`#pp-${k}`).value);
  const draw = () => {
    const s = motion.checked ? pp.scrollTop : 0;
    LAYERS.forEach(([k]) => { stage.querySelector(`.l-${k}`).style.transform = `translateY(${(-s * val(k)).toFixed(1)}px)`; });
  };
  LAYERS.forEach(([k]) => $(`#pp-${k}`).addEventListener('input', () => { $(`#pp-${k}-out`).textContent = val(k).toFixed(1).replace('.', ','); draw(); }));
  pp.addEventListener('scroll', () => requestAnimationFrame(draw), { passive: true });
  motion.onchange = draw;
  $('#pp-check').onclick = () => {
    const [h, b, t, x] = LAYERS.map(([k]) => val(k));
    const r = $('#pp-result');
    if (x !== 1) r.textContent = 'Die Textkarte sollte normal mitscrollen (Faktor 1,0). Bewegter Text ist schwer zu lesen.';
    else if (!(h < b && b < t)) r.textContent = 'Noch keine Tiefe: Je weiter hinten eine Ebene liegt, desto kleiner muss ihr Faktor sein. Himmel < Berge < Bäume.';
    else if (t - h > 1.1) r.textContent = 'Tiefe ist da, aber die Unterschiede sind sehr groß. Das wirkt schnell unruhig. Versuchen Sie kleinere Abstände.';
    else { r.textContent = `Gelungen: Himmel ${h.toFixed(1).replace('.', ',')}, Berge ${b.toFixed(1).replace('.', ',')}, Bäume ${t.toFixed(1).replace('.', ',')}. Die Ebenen trennen sich deutlich, der Text bleibt ruhig.`; markDone('u-parallax'); }
  };
  draw();
}

function promptCheck(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  return promptKriterien.map(([name, keys, tip]) => [name, keys.some((k) => t.includes(k)), tip]);
}

function exercisePage(e, i) {
  const head = `<div class="lektion-badge"><span class="lektion-number">Ü${i + 1}</span><span class="lektion-label">Übung</span></div>
    <h1 class="page-title purple">${e.title}</h1><p class="page-intro">${e.subtitle}.</p>`;
  if (e.id === 'u-muster') return head + section('Welches Muster ist das?', `<p>Lesen Sie die Beschreibung und wählen Sie das Muster, das am deutlichsten passt. Die Grundmuster finden Sie in <a href="#einstieg">Kapitel 01</a>.</p>
    ${musterFaelle.map(([t], j) => `<div class="dg-quote"><p>${t}</p><label for="mu-${j}">Muster</label><select id="mu-${j}">${opts(musterOptionen)}</select><p class="story-match-note" id="mu-${j}-note"></p></div>`).join('')}
    <button type="button" class="btn btn-primary" id="mu-check">Zuordnung prüfen</button><p class="story-result" id="mu-result" role="status"></p>`, true);
  if (e.id === 'u-parallax') return head + section('Erzeugen Sie Tiefe', `<p>Alle vier Ebenen stehen auf Faktor 1,0: Sie scrollen gleich schnell, das Bild wirkt flach. Verändern Sie die Faktoren und scrollen Sie in der Vorschau. Ziel: Der Himmel wirkt am weitesten entfernt, die Bäume am nächsten, die Textkarte bleibt gut lesbar.</p>
    ${parallaxHtml()}
    <button type="button" class="btn btn-primary" id="pp-check">Einstellung prüfen</button><p class="story-result" id="pp-result" role="status"></p>
    <p class="story-note">In Figma Sites stellen Sie genau diese Geschwindigkeit pro Ebene in der Interaktion „Scroll parallax“ ein.</p>`, true);
  if (e.id === 'u-storyboard') return head + section('Ordnen Sie die Schritte', `<p>Bringen Sie die sechs Schritte der Geschichte „Der Weg des Wassers“ in eine Reihenfolge mit klarem Spannungsbogen. Nutzen Sie die Pfeiltasten neben jedem Eintrag.</p>
    <ol class="story-order" id="sb-list"></ol><button type="button" class="btn btn-primary" id="sb-check">Reihenfolge prüfen</button><p class="story-result" id="sb-result" role="status"></p>`, true);
  if (e.id === 'u-werkzeug') return head + section('Sechs Projekte', `<p>Welcher Weg passt am besten? Oft sind mehrere denkbar, die Rückmeldung erklärt die naheliegende Wahl. Den Vergleich finden Sie in <a href="#werkzeuge">Kapitel 03</a>.</p>
    ${werkzeugFaelle.map(([t], j) => `<div class="dg-quote"><p>${t}</p><label for="wz-${j}">Werkzeug</label><select id="wz-${j}">${opts(werkzeugOptionen)}</select><p class="story-match-note" id="wz-${j}-note"></p></div>`).join('')}
    <button type="button" class="btn btn-primary" id="wz-check">Einschätzung prüfen</button><p class="story-result" id="wz-result" role="status"></p>`, true);
  if (e.id === 'u-prompt') return head + section('Ihr Prompt für Figma Make', `<p>Schreiben Sie einen Prompt für eine Scrollytelling-Seite oder fügen Sie Bausteine ein und passen Sie sie an. Die Prüfung sucht nach typischen Begriffen. Sie ersetzt kein eigenes Urteil, zeigt aber, woran Sie gedacht haben.</p>
    <div class="sc-bausteine" role="group" aria-label="Bausteine einfügen">${promptBausteine.map(([n], j) => `<button type="button" class="btn" data-baustein="${j}">+ ${n}</button>`).join('')}</div>
    <div class="story-fields"><label for="pr-text">Prompt</label><textarea id="pr-text" data-draft="u-prompt:text" rows="10"></textarea></div>
    <div class="btn-group"><button type="button" class="btn btn-primary" id="pr-check">Prompt prüfen</button><button type="button" class="btn" id="pr-copy">Kopieren</button></div>
    <p class="story-result" id="pr-result" role="status"></p><ul class="sc-checklist" id="pr-list"></ul>`, true);
  if (e.id === 'u-a11y') return head + section('Acht Umsetzungen', `<p>Ist die beschriebene Umsetzung unproblematisch oder ein Problem für die Barrierefreiheit? Hintergründe finden Sie in <a href="#barrierefrei">Kapitel 08</a>.</p>
    <form id="ay-form">${a11yFaelle.map(([t], j) => `<fieldset class="story-question"><legend>${t}</legend><label><input type="radio" name="ay${j}" value="1"> unproblematisch</label><label><input type="radio" name="ay${j}" value="0"> problematisch</label><p class="story-result" id="ay${j}-fb"></p></fieldset>`).join('')}
    <button class="btn btn-primary">Antworten prüfen</button><p class="story-result" id="ay-result" role="status"></p></form>`, true);
  if (e.id === 'u-projekt') return head + section('Planen Sie Ihre eigene Seite', `<p>Halten Sie Ihr Konzept fest. Für jeden Schritt notieren Sie Text, Bild und Muster. Am Ende exportieren Sie alles als Word-Dokument oder Markdown, etwa für die Abgabe oder als Grundlage für einen Prompt in Figma Make.</p>
    <div class="story-fields">${projektFelder.map(([k, l]) => `<label>${l}<textarea data-draft="u-projekt:${k}" rows="2"></textarea></label>`).join('')}</div>
    <h3>Scroll-Storyboard</h3>
    ${Array.from({ length: projektSchritte }, (_, j) => `<fieldset class="sc-step-field"><legend>Schritt ${j + 1}</legend>
      <div class="story-fields"><label>Text (Kurzfassung)<textarea data-draft="u-projekt:s${j}:text" rows="2"></textarea></label>
      <label>Bild oder Grafik<input type="text" data-draft="u-projekt:s${j}:bild"></label>
      <label for="pj-m-${j}">Muster</label><select id="pj-m-${j}" data-draft="u-projekt:s${j}:muster">${opts([...musterOptionen, ['ruhe', 'Ruhepunkt ohne Bewegung']])}</select></div></fieldset>`).join('')}
    <p class="story-result" id="pj-sum" role="status"></p>
    <div class="btn-group"><button type="button" class="btn btn-download" id="pj-docx">Word-Dokument</button><button type="button" class="btn" id="pj-md">Markdown</button></div>`, true);
  return head;
}

function wireOrder() {
  const list = $('#sb-list'), order = [...storyboard.start], items = storyboard.items;
  const render = (focusIndex, delta) => {
    list.innerHTML = order.map((item, i) => `<li><span><b>${items[item][0]}</b> · ${items[item][1]}</span>
      <span class="story-order-btns"><button type="button" class="btn" data-index="${i}" data-step="-1" aria-label="Eintrag ${i + 1} nach oben" ${i === 0 ? 'disabled' : ''}>↑</button>
      <button type="button" class="btn" data-index="${i}" data-step="1" aria-label="Eintrag ${i + 1} nach unten" ${i === order.length - 1 ? 'disabled' : ''}>↓</button></span></li>`).join('');
    if (focusIndex !== undefined) (list.querySelector(`[data-index="${focusIndex}"][data-step="${delta}"]:enabled`) || list.querySelector(`[data-index="${focusIndex}"]:enabled`))?.focus();
  };
  list.onclick = (ev) => {
    const b = ev.target.closest('[data-step]'); if (!b) return;
    const i = Number(b.dataset.index), d = Number(b.dataset.step);
    [order[i], order[i + d]] = [order[i + d], order[i]];
    $('#sb-result').textContent = `Eintrag auf Position ${i + d + 1} verschoben.`;
    render(i + d, d);
  };
  $('#sb-check').onclick = () => {
    const miss = order.findIndex((it, i) => it !== i);
    $('#sb-result').textContent = miss < 0 ? storyboard.success : storyboard.hint(miss + 1);
    if (miss < 0) markDone('u-storyboard');
  };
  render();
}
function wireSelectCheck(prefix, cases, okText, doneId) {
  $(`#${prefix}-check`).onclick = () => {
    let right = 0;
    cases.forEach(([, best, why], j) => {
      const v = $(`#${prefix}-${j}`).value, note = $(`#${prefix}-${j}-note`);
      if (!v) { note.className = 'story-match-note'; note.textContent = 'Bitte wählen Sie eine Antwort.'; return; }
      const ok = v === best; right += Number(ok);
      feedbackRow(note, ok, `${ok ? 'Passt.' : 'Noch nicht.'} ${why}`);
    });
    $(`#${prefix}-result`).textContent = `${right} von ${cases.length} richtig.${right === cases.length ? ' ' + okText : ''}`;
    if (right === cases.length) markDone(doneId);
  };
}
function projektData() {
  const g = (k) => (drafts[`u-projekt:${k}`] || '').trim();
  const musterName = (k) => [...musterOptionen, ['ruhe', 'Ruhepunkt ohne Bewegung']].find(([x]) => x === k)?.[1] || '–';
  return { felder: projektFelder.map(([k, l]) => [l, g(k)]), schritte: Array.from({ length: projektSchritte }, (_, j) => ({ text: g(`s${j}:text`), bild: g(`s${j}:bild`), muster: musterName(g(`s${j}:muster`)) })), titel: g('thema') || 'Meine Scrollytelling-Seite' };
}
function wireProjekt() {
  const sum = () => {
    const d = projektData();
    const n = d.felder.filter(([, v]) => v).length + d.schritte.filter((s) => s.text).length;
    const max = projektFelder.length + projektSchritte;
    $('#pj-sum').textContent = `${n} von ${max} Angaben ausgefüllt.`;
    if (n === max) markDone('u-projekt');
  };
  const art = content.firstElementChild; art.addEventListener('input', sum); art.addEventListener('change', sum);
  $('#pj-docx').onclick = () => {
    const d = projektData();
    const blocks = [
      { eyebrow: true, text: `LERNMODUL ${MODUL} · ${NAME.toUpperCase()} · MINI-PROJEKT` },
      { h: 1, text: d.titel },
      { meta: true, text: `Erstellt am ${new Date().toLocaleDateString('de-DE')}` },
      ...d.felder.flatMap(([l, v]) => [{ h: 2, text: l }, { text: v || '–' }]),
      { h: 2, text: 'Scroll-Storyboard' },
      ...d.schritte.flatMap((s, j) => [{ h: 2, text: `Schritt ${j + 1}` }, { text: `Text: ${s.text || '–'}` }, { text: `Bild oder Grafik: ${s.bild || '–'}` }, { text: `Muster: ${s.muster}` }])
    ];
    download(makeDocx(d.titel, blocks), 'scrollytelling-konzept.docx');
  };
  $('#pj-md').onclick = () => {
    const d = projektData();
    const md = `# ${d.titel}\n\nLernmodul ${MODUL} · ${NAME} · ${new Date().toLocaleDateString('de-DE')}\n\n` + d.felder.map(([l, v]) => `## ${l}\n\n${v || '–'}\n`).join('\n')
      + '\n## Scroll-Storyboard\n\n| Schritt | Text | Bild oder Grafik | Muster |\n|---|---|---|---|\n' + d.schritte.map((s, j) => `| ${j + 1} | ${s.text.replace(/\|/g, '/') || '–'} | ${s.bild.replace(/\|/g, '/') || '–'} | ${s.muster} |`).join('\n') + '\n';
    download(new Blob([md], { type: 'text/markdown;charset=utf-8' }), 'scrollytelling-konzept.md');
  };
  sum();
}
function wireExercise(e) {
  wireDrafts();
  if (e.id === 'u-muster') wireSelectCheck('mu', musterFaelle, 'Sie erkennen alle Grundmuster.', e.id);
  if (e.id === 'u-werkzeug') wireSelectCheck('wz', werkzeugFaelle, 'Sie wählen das passende Werkzeug für den Zweck.', e.id);
  if (e.id === 'u-parallax') wireParallax();
  if (e.id === 'u-storyboard') wireOrder();
  if (e.id === 'u-prompt') {
    const ta = $('#pr-text');
    content.querySelectorAll('[data-baustein]').forEach((b) => b.onclick = () => {
      ta.value = (ta.value.trim() ? ta.value.trim() + '\n\n' : '') + promptBausteine[b.dataset.baustein][1];
      drafts['u-prompt:text'] = ta.value; save(); ta.focus();
    });
    $('#pr-check').onclick = () => {
      if (!ta.value.trim()) { $('#pr-result').textContent = 'Schreiben Sie zuerst einen Prompt.'; $('#pr-list').innerHTML = ''; return; }
      const res = promptCheck(ta.value), n = res.filter(([, ok]) => ok).length;
      $('#pr-list').innerHTML = res.map(([name, ok, tip]) => `<li class="${ok ? 'is-ok' : 'is-off'}"><span aria-hidden="true">${ok ? '✓' : '○'}</span> <b>${name}</b>${ok ? '' : `<br><span class="story-note">${tip}</span>`}<span class="dg-sr">${ok ? ' (erfüllt)' : ' (fehlt)'}</span></li>`).join('');
      $('#pr-result').textContent = `${n} von ${res.length} Kriterien erkannt.${n === res.length ? ' Sehr vollständig. Prüfen Sie das Ergebnis in Make trotzdem selbst.' : ''}`;
      if (n >= res.length - 1) markDone(e.id);
    };
    $('#pr-copy').onclick = async () => { try { await navigator.clipboard.writeText(ta.value); $('#pr-result').textContent = 'Prompt kopiert.'; } catch { $('#pr-result').textContent = 'Kopieren nicht möglich. Markieren Sie den Text und kopieren Sie ihn manuell.'; } };
  }
  if (e.id === 'u-a11y') $('#ay-form').onsubmit = (ev) => {
    ev.preventDefault();
    let right = 0;
    a11yFaelle.forEach(([, good, why], j) => {
      const v = ev.target.elements[`ay${j}`].value, fb = $(`#ay${j}-fb`);
      if (v === '') { fb.textContent = 'Bitte wählen Sie eine Antwort.'; return; }
      const ok = (v === '1') === good; right += Number(ok);
      fb.textContent = `${ok ? 'Richtig.' : 'Noch nicht richtig.'} ${why}`;
    });
    $('#ay-result').textContent = `${right} von ${a11yFaelle.length} richtig beurteilt.`;
    if (right === a11yFaelle.length) markDone(e.id);
  };
  if (e.id === 'u-projekt') wireProjekt();
}

/* ---------- Wissen ---------- */
const kosten = { frei: 'kostenlos', freemium: 'kostenlos nutzbar, mit Bezahloption' };
function wissenPage(p) {
  const head = `<h1 class="page-title purple">${p.title}</h1>`;
  if (p.id === 'plugins') return head + `<p class="page-intro">Plugins erweitern Figma um Funktionen, die andere Firmen und Einzelpersonen entwickelt haben. Für Scrollytelling brauchen Sie keines davon zwingend, aber diese ${plugins.length} Plugins sparen Zeit beim Planen, beim Bildmaterial, bei Bewegung, bei der Barrierefreiheit und auf dem Weg zur Webseite. Alle sind kostenlos oder in einer Grundfassung kostenlos nutzbar.</p>
    <div class="story-controls dg-filter" id="pf" role="group" aria-label="Plugins filtern">
      <button type="button" class="btn" data-f="" aria-pressed="true">Alle</button>
      ${pluginKategorien.map(([k, l]) => `<button type="button" class="btn" data-f="${k}" aria-pressed="false">${l}</button>`).join('')}
      <button type="button" class="btn" data-f="frei" aria-pressed="false">Nur ganz kostenlos</button>
    </div>
    <p class="story-note" id="pf-count" role="status"></p>
    <ul class="dg-people" id="pf-list"></ul>`
    + section('So installieren Sie ein Plugin', `<ol>
      <li>Öffnen Sie eine Figma-Datei und wählen Sie im Werkzeugmenü <b>Actions</b> und dort den Reiter <b>Plugins &amp; widgets</b>, oder suchen Sie direkt in der <a href="https://www.figma.com/community/plugins">Figma Community</a>.</li>
      <li>Suchen Sie den Namen, öffnen Sie die Detailseite und prüfen Sie, wer das Plugin anbietet, und achten Sie auf Preis, letzte Aktualisierung und Datenschutzangaben.</li>
      <li>Starten Sie das Plugin mit <b>Run</b>. Häufig genutzte Plugins können Sie anheften.</li>
    </ol>`, true)
    + section('Vorsicht bei Plugins', `<ul>
      <li>Plugins stammen nicht von Figma, sondern von anderen Firmen und Einzelpersonen. Preise und Funktionen ändern sich, manche Plugins werden eingestellt.</li>
      <li>Einige Plugins übertragen Ihre Entwürfe an eigene Server, etwa zur Code-Erzeugung. Nutzen Sie sie nicht für vertrauliche Projekte, ohne das vorher zu klären.</li>
      <li>Bilder und Icons aus Plugins haben eigene Lizenzen. Prüfen Sie, ob und wie Sie Urheberinnen und Urheber nennen müssen.</li>
      <li>Vieles kann Figma inzwischen selbst, etwa Bildhintergründe entfernen oder Bilder erzeugen. Prüfen Sie zuerst die eingebauten Funktionen.</li>
    </ul>`);
  if (p.id === 'glossar') return head + section('Begriffe zum Nachschlagen', `<dl>${[...terms].sort(([a], [b]) => a.localeCompare(b, 'de')).map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>`, true);
  if (p.id === 'quellen') return head + `<p class="page-intro">Angaben zu Figma geprüft im November 2026 anhand der Figma-Hilfe. Figma ändert Funktionen und Bezeichnungen häufig. Im Zweifel gilt die aktuelle Hilfe.</p>`
    + section('Quellen und Weiterlesen', `<ul class="dg-lit">${quellen.map(([t, u, n]) => `<li><a href="${u}">${t}</a> <span class="story-note">${n}</span></li>`).join('')}</ul>`, true)
    + section('Bildnachweis', `<p>Alle Fotos in diesem Modul sind KI-generierte Stimmungsbilder (Magnific) ohne reale Vorlage und als solche gekennzeichnet. Die Schemazeichnungen sind eigene Darstellungen.</p>
      <ul class="dg-lit">${Object.values(bilder).map((b) => `<li>${esc(b.caption)}: KI-generiert</li>`).join('')}</ul>`)
    + section('Weitere Module', '<p>Die Dramaturgie von Geschichten vertiefen Sie im Modul <a href="../storytelling/">Storytelling</a>, Bewegung und Easing in <a href="../ux-animation/">UX &amp; Animation</a>, Raster für lange Seiten in <a href="../layout-raster/">Layout und Raster</a>.</p>');
  return head;
}
function wirePlugins() {
  let f = '';
  const draw = () => {
    const list = plugins.filter((x) => !f || x[1] === f || (f === 'frei' && x[2] === 'frei'));
    $('#pf-list').innerHTML = list.map(([n, k, c, t, h]) => `<li class="dg-person"><h3>${n}</h3>
      <p class="dg-life">${pluginKategorien.find(([x]) => x === k)[1]} · <span class="dg-tag">${kosten[c]}</span></p><p>${t}</p>${h ? `<p class="story-note">${h}</p>` : ''}
      <a href="https://www.figma.com/community/search?resource_type=plugins&amp;query=${encodeURIComponent(n.split(' (')[0])}">In der Figma Community suchen</a></li>`).join('');
    markExternal($('#pf-list'));
    $('#pf-count').textContent = `${list.length} ${list.length === 1 ? 'Plugin' : 'Plugins'} angezeigt.`;
    $('#pf').querySelectorAll('[data-f]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
  };
  $('#pf').onclick = (ev) => { const b = ev.target.closest('[data-f]'); if (b) { f = b.dataset.f; draw(); } };
  draw();
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
    <div class="content-head"><a class="sidebar-header" href="#home"><span class="sidebar-logo">SC</span><span class="sidebar-brand">
      <span class="sidebar-brand-name">${NAME}</span><span class="sidebar-brand-subtitle">${MODUL} · Lernmodul · Exkurs</span></span></a></div>
    ${body}
    <nav class="pager" aria-label="Seiten blättern">${pager(prev, 'prev')}${pager(next, 'next')}</nav></article>`;
  markExternal(content);
  wireCopy();
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
  if (page.id === 'plugins') wirePlugins();
  if (page === quizPage) wireQuiz();
  if (focus) {
    const h = content.querySelector('h1');
    h.tabIndex = -1; h.focus({ preventScroll: true }); window.scrollTo(0, 0);
  }
}
window.addEventListener('hashchange', () => route(true));
route();
