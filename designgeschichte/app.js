import { chapters } from './kapitel.js?v=9';
import { people, timeline, terms, quiz, literature } from './wissen.js?v=7';
import { zeitstrahl, stuhlEpochen, stuhlMerkmale, stuehle, radios, radioOptionen, radioTransfer, quelle, zitatPersonen, zitate, thesen, thesenStufen, inklusion } from './uebungen.js?v=4';
import { bilder } from './bilder.js?v=9';
import { makeDocx } from './docx.js?v=1';

/* Modulnummer an einer Stelle (Übersicht, Hero, Titel, Exporte) */
const MODUL = '06';

const $ = (s) => document.querySelector(s);
const content = $('#dg-content');
const sidebar = $('#sidebar');
const menu = $('.menu-btn');
const storageKey = 'designgeschichte:v1';
const nr = (i) => String(i + 1).padStart(2, '0');
const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const exercises = [
  { id: 'u-zeitstrahl', tile: 'kristallpalast', title: 'Zeitstrahl ordnen', subtitle: 'Acht Stationen von 1851 bis 1984 in die richtige Reihenfolge bringen', icon: 'list' },
  { id: 'u-stuehle', tile: 'thonet14', title: 'Stuhl-Detektiv', subtitle: 'Sieben Stühle Epoche und Merkmal zuordnen', icon: 'chair' },
  { id: 'u-radio', tile: 'prr-s1', title: 'Haltungen an Geräten', subtitle: 'Drei Radios und ein Moped: verkaufen, ordnen, begeistern, erhalten – und welche Perspektive zu welcher App passt', icon: 'radio' },
  { id: 'u-quelle', tile: 'archiv-lesesaal', title: 'Form und Zweck im NS-Staat', subtitle: 'Den Volksempfänger als historische Quelle untersuchen', icon: 'search' },
  { id: 'u-zitate', tile: 'looshaus', title: 'Wer hat’s gesagt?', subtitle: 'Acht Positionen von Morris bis Sottsass zuordnen', icon: 'quote' },
  { id: 'u-rams', tile: 'interface-review', title: 'Rams’ Thesen am Interface', subtitle: 'Eine heutige App bewerten und als Word-Dokument exportieren', icon: 'check' }
];
const wissenPages = [
  { id: 'zeitleiste', tile: 'centennial', title: 'Zeitleiste', subtitle: `${timeline.length} Stationen von 1707 bis heute`, icon: 'clock', chip: 'Z' },
  { id: 'koepfe', tile: 'simson-werk', title: 'Köpfe', subtitle: `${people.length} Kurzporträts, filterbar nach Epoche`, icon: 'people', chip: 'K' },
  { id: 'glossar', tile: 'underground', title: 'Glossar', subtitle: `${terms.length} Begriffe von ${[...terms].sort(([a], [b]) => a.localeCompare(b, 'de'))[0][0]} bis ${[...terms].sort(([a], [b]) => a.localeCompare(b, 'de')).at(-1)[0]}`, icon: 'book', chip: 'A–Z' },
  { id: 'literatur', tile: 'kelmscott-chaucer', title: 'Literatur und Bildnachweis', subtitle: 'Bücher zum Weiterlesen und Quellen der Abbildungen', icon: 'book', chip: 'L' }
];
const quizPage = { id: 'quiz', tile: 'mondrian-komposition', title: 'Quiz Designgeschichte', subtitle: `${quiz.length} Fragen quer durch alle Kapitel`, icon: 'quiz' };
const pages = [{ id: 'home', title: 'Übersicht', icon: 'grid' }, ...chapters, ...exercises, ...wissenPages, quizPage];

const icons = {
  grid: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  book: 'M12 6v14M12 6C9 4 6 4 3 5v13c3-1 6-1 9 2 3-3 6-3 9-2V5c-3-1-6-1-9 1Z',
  chapter: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7m-7 4h5',
  list: 'M3 4h18v16H3zm5 4h8m-8 4h8m-8 4h5',
  chair: 'M7 3v10h10V3M5 13h14M7 13v8m10-8v8',
  radio: 'M4 9h16v11H4zM8 9l8-5m-2 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0M7 13h3m-3 3h3',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 5 5',
  quote: 'M7 7h4v5c0 3-2 5-4 5m6-10h4v5c0 3-2 5-4 5',
  check: 'M4 12l5 5L20 6',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 3',
  people: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 10v-1a6 6 0 0 1 12 0v1m2-10a3 3 0 1 0 0-6m2 16v-1a5 5 0 0 0-3-4.6',
  quiz: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4h.01'
};
const icon = (n) => `<svg class="icon-svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[n]}"/></svg>`;

let stored = {};
try { stored = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
const done = stored.done || {};
const drafts = stored.drafts || {};
const rams = stored.rams || { app: '', rating: {}, notes: {} };
function save() { try { localStorage.setItem(storageKey, JSON.stringify({ done, drafts, rams })); } catch {} }
function markDone(id) { if (!done[id]) { done[id] = true; save(); sidebar.querySelector(`[href="#${id}"]`)?.classList.add('story-done'); } }

/* ---------- Navigation ---------- */
function navItem(page, label) {
  return `<a class="nav-item" href="#${page.id}"><span class="nav-icon">${icon(page.icon || 'chapter')}</span>${label || page.title}</a>`;
}
$('#dg-nav').innerHTML = [
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

/* ---------- Bilder ---------- */
function figure(key, cls = '') {
  const b = bilder[key];
  if (!b) return '';
  return `<figure class="dg-fig ${cls}"><img src="img/${b.file}" alt="${esc(b.alt)}" width="${b.w}" height="${b.h}" loading="lazy">
    ${b.ki ? '<span class="ki-badge" aria-hidden="true">KI-generiert</span>' : ''}
    <figcaption>${esc(b.caption)} <span class="dg-credit">${b.ki ? 'KI-generiert mit Magnific, Stimmungsbild ohne reale Vorlage' : `Nachweis: ${esc(b.artist)}, <a href="${b.page}">Wikimedia Commons</a>, ${b.licenseUrl ? `<a href="${b.licenseUrl}">${esc(b.license)}</a>` : esc(b.license)}`}</span></figcaption></figure>`;
}
function tileArt(page, chip) {
  const key = page.tile || (page.img && !page.noTileImg ? Object.values(page.img)[0][0] : null);
  const b = key && bilder[key];
  const badge = done[page.id] ? '<span class="tag-done">Erledigt</span>' : '';
  const art = b ? `<img src="img/${b.file}" alt="" width="${b.w}" height="${b.h}" loading="lazy">${b.ki ? '<span class="ki-badge" aria-hidden="true">KI-generiert</span>' : ''}` : (page.period ? `<span class="dg-tile-plain" aria-hidden="true">${esc(page.period)}</span>` : `<span class="dg-tile-icon" aria-hidden="true">${icon(page.icon || 'chapter')}</span>`);
  return `<div class="art${b ? '' : ' art-plain'}">${art}${badge}<span class="chip-num" aria-hidden="true">${chip}</span></div>`;
}
function tile(page, chip, label) {
  return `<li><a class="ptile" href="#${page.id}">${tileArt(page, chip)}
    <div class="tile-body"><h3>${page.title}</h3><p>${page.period ? `${page.period} · ` : ''}${page.subtitle}</p><span class="go">${label}</span></div></a></li>`;
}

/* ---------- Übersicht ---------- */
function overview() {
  const count = chapters.filter(({ id }) => done[id]).length;
  return `<div class="home">
    <section class="home-hero">
      <div>
        <div class="mod-chip" aria-hidden="true">DG</div>
        <p class="hero-eyebrow">Lernmodul ${MODUL} · Grundlagen der Mediengestaltung</p>
        <h1>Designgeschichte</h1>
        <p class="hero-lead">Von der Industrialisierung bis heute, mit Schwerpunkt Europa. Verfolgen Sie, wie aus Handwerk Serie wird, warum um das Ornament gestritten wurde, wie Design Politik und Verkauf dient und welche Gestalterinnen und Gestalter den Alltag geprägt haben, bis zum Interface auf Ihrem Smartphone.</p>
        <div class="hero-actions"><div class="hero-cta">
          <a class="btn btn-primary" href="#einleitung">Modul starten <span aria-hidden="true">→</span></a>
          <a class="btn" href="#zeitleiste">Zur Zeitleiste</a>
        </div>
          <a class="btn btn-download" href="downloads/designgeschichte-zusammenfassung.pdf" download>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>
            Zusammenfassung als PDF
          </a>
        </div>
        <p class="hero-meta"><span><b>${chapters.length}</b> Kapitel</span><span><b>${exercises.length}</b> Übungen</span><span><b>${people.length}</b> Köpfe</span><span><b>${quiz.length}</b> Quizfragen</span><span>ca. <b>4 Std.</b></span></p>
      </div>
      <figure class="hero-media">
        <img src="img/hero.webp" alt="Arbeitstisch mit Skizzen, Stoffmustern, Schriftproben und Zeichenwerkzeug in einem Archiv" width="1200" height="896" fetchpriority="high">
        <figcaption class="ki-badge">KI-generiert</figcaption>
      </figure>
    </section>
    <div class="progress-band">
      <label class="label" for="home-progress">Ihr Fortschritt</label>
      <progress id="home-progress" max="${chapters.length}" value="${count}"></progress>
      <b>${count} / ${chapters.length} Kapitel</b>
    </div>
    <div class="home-section-label"><h2>Kapitel</h2><span>01–${chapters.length}</span></div>
    <ul class="tiles">${chapters.map((c, i) => tile(c, nr(i), 'Kapitel lesen')).join('')}</ul>
    <div class="home-section-label"><h2>Übungen</h2><span>mit Rückmeldung</span></div>
    <ul class="tiles">${exercises.map((e, i) => tile(e, `Ü${i + 1}`, 'Übung starten')).join('')}</ul>
    <div class="home-section-label"><h2>Wissen</h2><span>Nachschlagen</span></div>
    <ul class="tiles">${wissenPages.map((p) => tile(p, p.chip, 'Öffnen')).join('')}</ul>
    <div class="home-section-label"><h2>Wissenstest</h2><span>Quiz</span></div>
    <ul class="tiles">${tile(quizPage, '?', 'Quiz starten')}</ul>
    <p class="footer-note">Lernmodul ${MODUL} · Lern-Apps Gestaltung &amp; UX · Hochschule Karlsruhe, Fakultät IWI · Startbild und Stimmungsbilder zu Kapitel 01, 13 und 15 KI-generiert, Werkabbildungen gemeinfrei oder frei lizenziert (Nachweis unter jedem Bild und in der Literaturliste)</p>
  </div>`;
}

const section = (title, body, panel = false, cls = '') => `<section class="story-section${panel ? ' story-panel' : ''}${cls ? ' ' + cls : ''}"><h2>${title}</h2>${body}</section>`;

/* ---------- Kapitel ---------- */
function chapterPage(c, i) {
  const people = peopleFor(c.id);
  return `<div class="lektion-badge"><span class="lektion-number">${nr(i)}</span><span class="lektion-label">Kapitel · ${c.period}</span></div>
    <h1 class="page-title purple">${c.title}</h1><p class="page-intro">${c.lead}</p>
    ${c.leitfragen ? section('Leitfragen durch alle Kapitel', `<ul class="dg-leitfragen">${c.leitfragen.map((q) => `<li>${q}</li>`).join('')}</ul>`, true) : ''}
    ${c.sections.map(([h, t], j) => `<section class="story-section"><h2>${h}</h2><p>${t}</p>${c.img?.[j] ? `<div class="dg-figs${c.img[j].length > 1 ? ' two' : ''}">${c.img[j].map((k) => figure(k)).join('')}</div>` : ''}</section>`).join('')}
    ${c.noImages ? '<p class="story-note dg-note">Dieses Kapitel zeigt bewusst keine Propagandabilder und keine Symbole des Nationalsozialismus. Die einzige Abbildung, auch auf der Kachel der Übersicht, zeigt einen Ort des Exils in London. Über die Links unten gelangen Sie zu kommentierten Quellen.</p>' : ''}
    ${c.links?.length ? section('Werke und Quellen ansehen', `<p class="story-note">Geschützte Werke zeigen wir nicht, sondern verlinken auf Sammlungen und Archive.</p><ul class="dg-links">${c.links.map(([t, u]) => `<li><a href="${u}">${t}</a></li>`).join('')}</ul>`) : ''}
    ${people.length ? section('Köpfe in diesem Kapitel', `<ul class="dg-people-mini">${people.map(([n, d, , w]) => `<li>${n} <span>(${d})</span>${w ? ' <span class="dg-tag">Gestalterin</span>' : ''}</li>`).join('')}</ul><a class="btn" href="#koepfe">Alle Köpfe</a>`) : ''}
    ${[].concat(c.task || []).map((task, ti) => section(task.title, `<p>${task.text}</p><div class="story-fields">${task.fields.map((f, j) => `<label>${f}<textarea data-draft="${c.id}:${ti ? ti + ':' : ''}${j}" rows="3"></textarea></label>`).join('')}<p class="story-note" role="status">Ihre Notizen werden in diesem Browser gespeichert.</p></div>`, true)).join('')}
    ${section('Zum Merken', `<ul>${c.merke.map((m) => `<li>${m}</li>`).join('')}</ul>
      <label class="dg-done"><input type="checkbox" id="chapter-done"> Kapitel gelesen</label>`, true, 'dg-merke')}`;
}
const peopleFor = (id) => people.filter((p) => p[2] === id);

function wireChapter(c) {
  content.querySelectorAll('[data-draft]').forEach((f) => {
    f.value = drafts[f.dataset.draft] || '';
    f.oninput = () => { drafts[f.dataset.draft] = f.value; save(); };
  });
  const box = $('#chapter-done');
  box.checked = Boolean(done[c.id]);
  box.onchange = () => {
    done[c.id] = box.checked; save();
    sidebar.querySelector(`[href="#${c.id}"]`)?.classList.toggle('story-done', box.checked);
  };
}

/* ---------- Übungen ---------- */
function orderHtml(prefix, intro) {
  return `<p>${intro}</p><ol class="story-order" id="${prefix}-list"></ol>
    <button type="button" class="btn btn-primary" id="${prefix}-check">Reihenfolge prüfen</button>
    <p class="story-result" id="${prefix}-result" role="status"></p>`;
}
function wireOrder({ list, check, result, items, order, success, hint, onSuccess }) {
  function render(focusIndex, delta) {
    list.innerHTML = order.map((item, i) => `<li><span><b>${items[item][0]}</b> · ${items[item][1]}</span>
      <span class="story-order-btns"><button type="button" class="btn" data-index="${i}" data-step="-1" aria-label="Eintrag ${i + 1} nach oben" ${i === 0 ? 'disabled' : ''}>↑</button>
      <button type="button" class="btn" data-index="${i}" data-step="1" aria-label="Eintrag ${i + 1} nach unten" ${i === order.length - 1 ? 'disabled' : ''}>↓</button></span></li>`).join('');
    if (focusIndex !== undefined) {
      const target = list.querySelector(`[data-index="${focusIndex}"][data-step="${delta}"]:enabled`);
      (target || list.querySelector(`[data-index="${focusIndex}"]:enabled`))?.focus();
    }
  }
  list.onclick = (event) => {
    const button = event.target.closest('[data-step]');
    if (!button) return;
    const index = Number(button.dataset.index), delta = Number(button.dataset.step), next = index + delta;
    [order[index], order[next]] = [order[next], order[index]];
    result.textContent = `Eintrag auf Position ${next + 1} verschoben.`;
    render(next, delta);
  };
  check.onclick = () => {
    const mismatch = order.findIndex((item, i) => item !== i);
    result.textContent = mismatch < 0 ? success : hint(mismatch + 1);
    if (mismatch < 0) onSuccess?.();
  };
  render();
}

const opts = (list, first = 'Bitte wählen …') => `<option value="">${first}</option>${list.map(([k, l]) => `<option value="${k}">${l}</option>`).join('')}`;
const shuffleFixed = (list) => list.map((_, i) => list[(i * 3 + 2) % list.length]);

function exercisePage(e, i) {
  const head = `<div class="lektion-badge"><span class="lektion-number">Ü${i + 1}</span><span class="lektion-label">Übung</span></div>
    <h1 class="page-title purple">${e.title}</h1><p class="page-intro">${e.subtitle}.</p>`;
  if (e.id === 'u-zeitstrahl') return head + section('Ordnen Sie die Stationen', orderHtml('zs', 'Bringen Sie die acht Ereignisse in die zeitliche Reihenfolge. Nutzen Sie die Pfeiltasten neben jedem Eintrag.'), true);
  if (e.id === 'u-stuehle') return head + section('Sieben Stühle', `<p>Ordnen Sie jedem Stuhl die Epoche und das typische Merkmal zu. Die Abbildungen der meisten Stühle sind urheberrechtlich geschützt. Suchen Sie sie bei Bedarf in Museumssammlungen, etwa im <a href="https://www.design-museum.de/">Vitra Design Museum</a> oder in der <a href="https://www.pinakothek-der-moderne.de/">Neuen Sammlung in der Pinakothek der Moderne</a>.</p>
    <div class="dg-cards">${stuehle.map(([name, by], j) => `<div class="dg-card"><h3>${name}</h3><p class="story-note">${by}</p>
      <label for="st-e-${j}">Epoche</label><select id="st-e-${j}">${opts(shuffleFixed(stuhlEpochen))}</select>
      <label for="st-m-${j}">Merkmal</label><select id="st-m-${j}">${opts(shuffleFixed(stuhlMerkmale))}</select>
      <p class="story-match-note" id="st-${j}-note"></p></div>`).join('')}</div>
    <button type="button" class="btn btn-primary" id="st-check">Zuordnung prüfen</button><p class="story-result" id="st-result" role="status"></p>`, true);
  if (e.id === 'u-radio') return head + section('Drei Radios und ein Moped', `<p>Drei Radios aus drei Jahrzehnten lassen sich aus drei Perspektiven lesen: verkaufen, ordnen, begeistern. Das Moped Simson S50 aus der DDR ergänzt eine vierte: erhalten. Diese Perspektiven sind eine Lernhilfe. In jedem Gerät überlagern sie sich, und sie sind keine nationalen Eigenschaften: Henry Dreyfuss stellte in den USA die Ergonomie in den Mittelpunkt, Olivettis Lettera 22 ist vor allem eine präzise technische Lösung. Ordnen Sie zu, welche Perspektive, welches Material und welche Formensprache jeweils am deutlichsten hervortreten.</p>
    <div class="dg-cards">${radios.map((r) => `<div class="dg-card"><h3>${r.name}</h3><p class="story-note">${r.example}</p><p>${r.desc}</p>
      ${Object.entries(radioOptionen).map(([k, list]) => `<label for="ra-${r.id}-${k}">${{ haltung: 'Haltung', material: 'Material', form: 'Formensprache' }[k]}</label><select id="ra-${r.id}-${k}">${opts(list)}</select>`).join('')}
      <p class="story-match-note" id="ra-${r.id}-note"></p></div>`).join('')}</div>
    <button type="button" class="btn btn-primary" id="ra-check">Zuordnung prüfen</button><p class="story-result" id="ra-result" role="status"></p>`, true)
    + section('Transfer: Welche Haltung passt zu welcher App?', `<p>Es gibt keine einzige richtige Antwort. Die Rückmeldung erklärt, was für die naheliegende Haltung spricht.</p>
    ${radioTransfer.map(([s], j) => `<div class="dg-transfer"><label for="rt-${j}">${s}</label><select id="rt-${j}">${opts(radioOptionen.haltung)}</select><p class="story-match-note" id="rt-${j}-note"></p></div>`).join('')}
    <button type="button" class="btn" id="rt-check">Einschätzung vergleichen</button>`, true);
  if (e.id === 'u-quelle') return head + section('Die Quelle', `<p>${quelle.intro}</p><ul>${quelle.facts.map((f) => `<li>${f}</li>`).join('')}</ul>
    <p class="story-note">Wir zeigen bewusst kein Foto. Ein kommentiertes Objekt finden Sie im <a href="https://www.dhm.de/lemo/kapitel/ns-regime/alltagsleben/volksempfaenger">LeMO des Deutschen Historischen Museums</a>.</p>`, true)
    + section('Vier Fragen an die Quelle', `<form id="q-form">${quelle.questions.map(([q, a], j) => `<fieldset class="story-question"><legend>${q}</legend>${a.map((t, k) => `<label><input type="radio" name="q${j}" value="${k}"> ${t}</label>`).join('')}<p class="story-result" id="q${j}-fb"></p></fieldset>`).join('')}
      <button class="btn btn-primary">Antworten prüfen</button><p class="story-result" id="q-result" role="status"></p></form>
      <div class="story-fields"><label>${quelle.reflexion}<textarea data-draft="u-quelle:reflexion" rows="3"></textarea></label></div>`);
  if (e.id === 'u-zitate') return head + section('Acht Positionen', `<p>Ordnen Sie jede Aussage einer Person zu. Wörtliche Zitate stehen in Anführungszeichen, sinngemäße Zusammenfassungen ohne. Nach dem Prüfen sehen Sie die Quelle.</p>
    ${zitate.map(([t], j) => `<div class="dg-quote"><blockquote>${t}</blockquote><label for="zi-${j}">Wer vertritt diese Position?</label><select id="zi-${j}">${opts(shuffleFixed(zitatPersonen))}</select><p class="story-match-note" id="zi-${j}-note"></p></div>`).join('')}
    <button type="button" class="btn btn-primary" id="zi-check">Zuordnung prüfen</button><p class="story-result" id="zi-result" role="status"></p>`, true);
  if (e.id === 'u-rams') return head + section('Eine App bewerten', `<p>Dieter Rams hat zehn Thesen für gutes Design formuliert (<a href="https://www.vitsoe.com/de/about/good-design">Wortlaut der Thesen bei Vitsœ</a>). Wenden Sie sie auf eine App an, die Sie täglich nutzen. Bewerten Sie jede These und notieren Sie eine Beobachtung.</p>
    <div class="story-fields"><label>Bewertete App<input type="text" id="rams-app" placeholder="z. B. eine Nahverkehrs-App"></label></div>
    <div class="dg-rams-wrap"><ol class="dg-rams">${thesen.map(([t, q], j) => ramsItem(j, t, q)).join('')}</ol>
    <h3>Ergänzung: Inklusion</h3>
    <p>Rams’ Thesen sagen wenig darüber, ob alle Menschen ein Produkt nutzen können. Prüfen Sie deshalb zusätzlich vier Grundkriterien der Barrierefreiheit. Mehr dazu im Kapitel <a href="../ux-grundlagen/#accessibility">Barrierefreiheit der UX Grundlagen</a>.</p>
    <ol class="dg-rams dg-rams-inkl">${inklusion.map(([t, q], j) => ramsItem('i' + j, t, q)).join('')}</ol></div>
    <p class="story-result" id="rams-sum" role="status"></p>
    <div class="btn-group"><button type="button" class="btn btn-download" id="rams-docx" aria-label="Bewertung als Word-Dokument herunterladen">Word-Dokument</button><button type="button" class="btn" id="rams-md" aria-label="Bewertung als Markdown herunterladen">Markdown</button></div>`, true);
  return head;
}

function ramsItem(key, t, q) {
  return `<li><fieldset><legend><b>${t}</b> <span class="story-note">${q}</span></legend>
      <div class="dg-rams-scale">${thesenStufen.map(([k, l]) => `<label><input type="radio" name="rams${key}" value="${k}"> ${l}</label>`).join('')}</div>
      <label class="dg-rams-note">Beobachtung<input type="text" data-rams-note="${key}"></label></fieldset></li>`;
}

function feedbackRow(note, ok, text) { note.className = `story-match-note ${ok ? 'is-ok' : 'is-off'}`; note.textContent = text; }

function wireExercise(e) {
  content.querySelectorAll('[data-draft]').forEach((f) => { f.value = drafts[f.dataset.draft] || ''; f.oninput = () => { drafts[f.dataset.draft] = f.value; save(); }; });
  if (e.id === 'u-zeitstrahl') wireOrder({ list: $('#zs-list'), check: $('#zs-check'), result: $('#zs-result'), items: zeitstrahl.items, order: [...zeitstrahl.start], success: zeitstrahl.success, hint: zeitstrahl.hint, onSuccess: () => markDone(e.id) });
  if (e.id === 'u-stuehle') $('#st-check').onclick = () => {
    let right = 0;
    stuehle.forEach(([, , ep, mm], j) => {
      const a = $(`#st-e-${j}`).value, b = $(`#st-m-${j}`).value, note = $(`#st-${j}-note`);
      if (!a || !b) { note.className = 'story-match-note'; note.textContent = 'Wählen Sie Epoche und Merkmal.'; return; }
      const ok = a === ep && b === mm; right += Number(ok);
      feedbackRow(note, ok, ok ? 'Passt.' : `${a === ep ? 'Epoche stimmt' : 'Epoche prüfen'}, ${b === mm ? 'Merkmal stimmt' : 'Merkmal prüfen'}.`);
    });
    $('#st-result').textContent = `${right} von ${stuehle.length} Stühlen vollständig richtig zugeordnet.${right === stuehle.length ? ' Vom gebogenen Holz bis zum ironischen Zeichen: Material und Technik prägen die Form, aber auch die Haltung.' : ''}`;
    if (right === stuehle.length) markDone(e.id);
  };
  if (e.id === 'u-radio') {
    $('#ra-check').onclick = () => {
      let right = 0;
      radios.forEach((r) => {
        const keys = ['haltung', 'material', 'form'];
        const vals = keys.map((k) => $(`#ra-${r.id}-${k}`).value);
        const note = $(`#ra-${r.id}-note`);
        if (vals.some((v) => !v)) { note.className = 'story-match-note'; note.textContent = 'Wählen Sie alle drei Angaben.'; return; }
        const wrong = keys.filter((k, i) => vals[i] !== r[k]).map((k) => ({ haltung: 'Haltung', material: 'Material', form: 'Formensprache' }[k]));
        right += Number(!wrong.length);
        feedbackRow(note, !wrong.length, wrong.length ? `Prüfen Sie: ${wrong.join(', ')}.` : `Passt. ${r.zitat}`);
      });
      $('#ra-result').textContent = `${right} von ${radios.length} Geräten vollständig richtig.`;
      if (right === radios.length) markDone(e.id);
    };
    $('#rt-check').onclick = () => radioTransfer.forEach(([, best, why], j) => {
      const v = $(`#rt-${j}`).value, note = $(`#rt-${j}-note`);
      if (!v) { note.className = 'story-match-note'; note.textContent = 'Wählen Sie eine Haltung.'; return; }
      feedbackRow(note, v === best, `${v === best ? 'Naheliegend.' : 'Auch denkbar, aber prüfen Sie die Folgen.'} ${why}`);
    });
  }
  if (e.id === 'u-quelle') $('#q-form').onsubmit = (ev) => {
    ev.preventDefault();
    let right = 0;
    quelle.questions.forEach(([, , c, fb], j) => {
      const v = ev.target.elements[`q${j}`].value;
      const ok = v !== '' && Number(v) === c; right += Number(ok);
      $(`#q${j}-fb`).textContent = v === '' ? 'Bitte wählen Sie eine Antwort.' : `${ok ? 'Richtig.' : 'Noch nicht richtig.'} ${fb}`;
    });
    $('#q-result').textContent = `${right} von ${quelle.questions.length} Fragen richtig beantwortet.`;
    if (right === quelle.questions.length) markDone(e.id);
  };
  if (e.id === 'u-zitate') $('#zi-check').onclick = () => {
    let right = 0;
    zitate.forEach(([, who, art, beleg], j) => {
      const v = $(`#zi-${j}`).value, note = $(`#zi-${j}-note`);
      if (!v) { note.className = 'story-match-note'; note.textContent = 'Wählen Sie eine Person.'; return; }
      const ok = v === who; right += Number(ok);
      const name = zitatPersonen.find(([k]) => k === who)[1];
      feedbackRow(note, ok, ok ? `Richtig: ${name}. ${art}. Quelle: ${beleg}` : 'Noch nicht. Denken Sie an Epoche und Haltung der Person.');
    });
    $('#zi-result').textContent = `${right} von ${zitate.length} Positionen richtig zugeordnet.`;
    if (right === zitate.length) markDone(e.id);
  };
  if (e.id === 'u-rams') wireRams();
}

function wireRams() {
  const app = $('#rams-app');
  app.value = rams.app || '';
  app.oninput = () => { rams.app = app.value; save(); };
  const keys = [...thesen.map((_, j) => String(j)), ...inklusion.map((_, j) => 'i' + j)];
  keys.forEach((j) => {
    const v = rams.rating[j];
    if (v) content.querySelector(`input[name="rams${j}"][value="${v}"]`).checked = true;
    content.querySelector(`[data-rams-note="${j}"]`).value = rams.notes[j] || '';
  });
  const summary = () => {
    const c = { ja: 0, teils: 0, nein: 0 };
    thesen.forEach((_, j) => { const v = rams.rating[j]; if (v) c[v]++; });
    const n = c.ja + c.teils + c.nein;
    $('#rams-sum').textContent = n ? `${n} von ${thesen.length} Thesen bewertet: ${c.ja} trifft zu, ${c.teils} teilweise, ${c.nein} trifft nicht zu.` : '';
    if (n === thesen.length) markDone('u-rams');
  };
  content.querySelector('.dg-rams-wrap').addEventListener('input', (ev) => {
    const t = ev.target;
    if (t.name?.startsWith('rams')) rams.rating[t.name.slice(4)] = t.value;
    if (t.dataset.ramsNote) rams.notes[t.dataset.ramsNote] = t.value;
    save(); summary();
  });
  const label = (j) => thesenStufen.find(([k]) => k === rams.rating[j])?.[1] || 'nicht bewertet';
  const title = () => `Rams’ Thesen am Interface: ${(rams.app || '').trim() || 'App'}`;
  const download = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
  $('#rams-docx').onclick = () => {
    const blocks = [
      { eyebrow: true, text: `LERNMODUL ${MODUL} · DESIGNGESCHICHTE · ÜBUNG 6` },
      { h: 1, text: title() },
      { meta: true, text: `Erstellt am ${new Date().toLocaleDateString('de-DE')} · Thesen nach Dieter Rams` },
      ...thesen.flatMap(([t], j) => [{ h: 2, text: `${j + 1}. ${t}` }, { text: `Bewertung: ${label(j)}` }, { text: rams.notes[j] ? `Beobachtung: ${rams.notes[j]}` : 'Beobachtung: –' }]),
      { h: 2, text: 'Ergänzung: Inklusion' },
      ...inklusion.flatMap(([t], j) => [{ text: `${t}: ${label('i' + j)}${rams.notes['i' + j] ? ` · ${rams.notes['i' + j]}` : ''}` }])
    ];
    download(makeDocx(title(), blocks), 'rams-thesen-bewertung.docx');
  };
  $('#rams-md').onclick = () => {
    const md = `# ${title()}\n\nThesen nach Dieter Rams · ${new Date().toLocaleDateString('de-DE')}\n\n` + thesen.map(([t], j) => `## ${j + 1}. ${t}\n\n- Bewertung: ${label(j)}\n- Beobachtung: ${rams.notes[j] || '–'}\n`).join('\n') + `\n## Ergänzung: Inklusion\n\n` + inklusion.map(([t], j) => `- ${t}: ${label('i' + j)}${rams.notes['i' + j] ? ` · ${rams.notes['i' + j]}` : ''}`).join('\n') + '\n';
    download(new Blob([md], { type: 'text/markdown;charset=utf-8' }), 'rams-thesen-bewertung.md');
  };
  summary();
}

/* ---------- Wissen ---------- */
function wissenPage(p) {
  const head = `<h1 class="page-title purple">${p.title}</h1>`;
  if (p.id === 'zeitleiste') return head + `<p class="page-intro">Vom Sandguss-Patent 1707 bis heute. Jeder Eintrag führt zum passenden Kapitel.</p>
    <ol class="dg-timeline">${[...timeline].sort((x, y) => x[0] - y[0]).map(([, y, t, ch]) => `<li><span class="dg-year">${y}</span><a href="#${ch}">${t}</a></li>`).join('')}</ol>`;
  if (p.id === 'koepfe') {
    const eras = chapters.filter((c) => people.some((x) => x[2] === c.id));
    return head + `<p class="page-intro">${people.length} Gestalterinnen und Gestalter, Kritikerinnen und Kritiker sowie Lehrende, nach Kapiteln geordnet. Die Lebensdaten sind mit Wikidata abgeglichen.</p>
      <div class="story-controls dg-filter" id="kf" role="group" aria-label="Köpfe filtern">
        <button type="button" class="btn" data-f="alle" aria-pressed="true">Alle</button>
        <button type="button" class="btn" data-f="frauen" aria-pressed="false">Gestalterinnen</button>
        <label class="dg-era">Epoche <select id="kf-era"><option value="">alle Kapitel</option>${eras.map((c) => `<option value="${c.id}">${c.period} · ${c.title}</option>`).join('')}</select></label>
      </div>
      <p class="story-note" id="kf-count" role="status"></p>
      <ul class="dg-people" id="kf-list"></ul>`;
  }
  if (p.id === 'glossar') return head + section('Begriffe zum Nachschlagen', `<dl>${[...terms].sort(([a], [b]) => a.localeCompare(b, 'de')).map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>`, true);
  if (p.id === 'literatur') return head + section('Zum Weiterlesen', `<ul class="dg-lit">${literature.map(([a, t, v, y, n]) => `<li><b>${a}:</b> <cite>${t}</cite>. ${v}, ${y}. <span class="story-note">${n}</span></li>`).join('')}</ul>`, true)
    + section('Bildnachweis', `<p>Werkabbildungen stammen von Wikimedia Commons. Gezeigt werden nur Werke, die gemeinfrei sind, mit Fotos unter freier Lizenz. Das Startbild, die Stimmungsbilder zu den Kapiteln 01, 13 und 15 und das Kachelbild zu Übung 6 sind KI-generiert (Magnific) und zeigen keine realen Designobjekte.</p>
      <ul class="dg-lit">${Object.values(bilder).filter((b) => !b.ki).map((b) => `<li>${esc(b.caption)}: ${esc(b.artist)}, <a href="${b.page}">Wikimedia Commons</a>, ${b.licenseUrl ? `<a href="${b.licenseUrl}">${esc(b.license)}</a>` : esc(b.license)}</li>`).join('')}</ul>`)
    + section('Weitere Module', '<p>Raster und Satzspiegel vertiefen Sie in <a href="../layout-raster/">Layout und Raster</a>, Schriftgeschichte und Klassifikation in <a href="../typografie/">Typografie</a>.</p>');
  return head;
}
function wireKoepfe() {
  let f = 'alle';
  const draw = () => {
    const era = $('#kf-era').value;
    const list = people.filter((x) => (f === 'alle' || x[3]) && (!era || x[2] === era));
    $('#kf-list').innerHTML = list.map(([n, d, ch, w, t]) => `<li class="dg-person"><h3>${n}</h3><p class="dg-life">${d}${w ? ' · <span class="dg-tag">Gestalterin</span>' : ''}</p><p>${t}</p><a href="#${ch}">${chapters.find((c) => c.id === ch).title}</a></li>`).join('');
    $('#kf-count').textContent = `${list.length} ${list.length === 1 ? 'Eintrag' : 'Einträge'} angezeigt.`;
    $('#kf').querySelectorAll('[data-f]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
  };
  $('#kf').onclick = (ev) => { const b = ev.target.closest('[data-f]'); if (b) { f = b.dataset.f; draw(); } };
  $('#kf-era').onchange = draw;
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

/* Externe Links: sichtbar als Link, neues Fenster, Hinweis für Screenreader */
const EXT_ICON = '<svg class="dg-ext-icon" aria-hidden="true" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
function markExternal(root) {
  root.querySelectorAll('a[href^="http"]').forEach((a) => {
    if (a.dataset.ext) return;
    a.dataset.ext = '1';
    a.target = '_blank';
    a.rel = 'noopener';
    a.classList.add('dg-ext');
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
    <div class="content-head"><a class="sidebar-header" href="#home"><span class="sidebar-logo">DG</span><span class="sidebar-brand">
      <span class="sidebar-brand-name">Designgeschichte</span><span class="sidebar-brand-subtitle">${MODUL} · Lernmodul</span></span></a></div>
    ${body}
    <nav class="pager" aria-label="Seiten blättern">${pager(prev, 'prev')}${pager(next, 'next')}</nav></article>`;
  markExternal(content);
  sidebar.querySelectorAll('.nav-item').forEach((link) => {
    const id = link.hash.slice(1), active = id === page.id;
    link.classList.toggle('active', active);
    link.classList.toggle('story-done', Boolean(done[id]));
    if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  document.title = page.id === 'home' ? `Designgeschichte · Lernmodul ${MODUL}` : `${page.title} · Designgeschichte`;
  setMenu(false);
  if (ci >= 0) wireChapter(page);
  if (ei >= 0) wireExercise(page);
  if (page.id === 'koepfe') wireKoepfe();
  if (page === quizPage) wireQuiz();
  if (focus) {
    const h = content.querySelector('h1');
    h.tabIndex = -1; h.focus({ preventScroll: true }); window.scrollTo(0, 0);
  }
}
window.addEventListener('hashchange', () => route(true));
route();
