import { lessons, quizQuestions, terms } from './content.js?v=4';
import { modelle, spineFields, uxTransfer } from './vertiefung.js?v=2';
import { spineSort, heroJourney, archetypes, conflictLevels, conflictSteps, showTell, shotSizes, storyboard, jenkins, keynote, lisa, spineExamples } from './uebungen.js?v=1';

const $ = (selector) => document.querySelector(selector);
const content = $('#story-content');
const sidebar = $('#sidebar');
const menu = $('.menu-btn');
const storageKey = 'storytelling:v1';
const number = (index) => String(index + 1).padStart(2, '0');
const questions = quizQuestions;
const sortedTerms = [...terms].sort(([a], [b]) => a.localeCompare(b, 'de'));
const termRange = `${sortedTerms[0][0]} bis ${sortedTerms.at(-1)[0]}`;
const referencePages = [
  { id: 'glossar', title: 'Glossar', subtitle: `${terms.length} Begriffe von ${termRange}`, icon: 'list', chip: 'A–Z' },
  { id: 'modelle', title: 'Erzählmodelle im Vergleich', subtitle: 'Freytag, Heldenreise, Story Spine, Transmedia sowie Golden Circle und StoryBrand im UX-Kontext', icon: 'arc', chip: 'M', photo: 'struktur' },
  { id: 'baukasten', title: 'Story-Baukasten', subtitle: 'Eine eigene UX-Fallstudie entwerfen und als Markdown exportieren', icon: 'edit', chip: 'B', photo: 'transfer' },
  { id: 'werkzeuge', title: 'Vorlagen und Literatur', subtitle: 'Arbeitsblätter und Quellen', icon: 'book', chip: 'V' }
];
const pages = [
  { id: 'home', title: 'Übersicht', icon: 'grid' },
  { id: 'einleitung', title: 'Einleitung', icon: 'book' },
  ...lessons,
  ...referencePages,
  { id: 'quiz', title: 'Storytelling-Quiz', subtitle: 'Wissen anwenden und überprüfen', icon: 'quiz' }
];
const icons = {
  grid: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  book: 'M12 6v14M12 6C9 4 6 4 3 5v13c3-1 6-1 9 2 3-3 6-3 9-2V5c-3-1-6-1-9 1Z',
  chain: 'M10 8l2-2a4 4 0 0 1 6 6l-2 2m-2 2-2 2a4 4 0 0 1-6-6l2-2m1 5 6-6',
  person: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2',
  arc: 'M3 20V4m0 16h18M5 17l5-4 5-8 5 10',
  pulse: 'M2 12h5l3-8 4 16 3-8h5',
  eye: 'M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  film: 'M3 5h18v14H3zm4 0v14m10-14v14M3 12h4m10 0h4',
  network: 'M12 8v5m-6 3v-3h12v3M9 3h6v5H9zM3 16h6v5H3zm12 0h6v5h-6z',
  edit: 'M4 20h4L20 8l-4-4L4 16zm9-13 4 4',
  list: 'M3 4h18v16H3zm5 4h8m-8 4h8m-8 4h5',
  quiz: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4h.01'
};

let stored = {};
try { stored = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
const drafts = stored.drafts || {};
const done = stored.done || {};
const answers = stored.answers || {};
const legacyIds = ['grundlagen', 'figur', 'struktur', 'spannung', 'perspektive', 'bild'];
legacyIds.forEach((id, index) => {
  const key = index + 1;
  if (drafts[key] && drafts[id] === undefined) drafts[id] = drafts[key];
  if (done[key] && done[id] === undefined) done[id] = true;
});

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({ drafts, done, answers })); }
  catch { $('#save-note').textContent = 'Der Browser konnte Ihre Eingaben nicht speichern. Laden Sie Ihren Entwurf herunter, bevor Sie die Seite verlassen.'; }
}

function icon(name) {
  return `<svg class="icon-svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[name]}"/></svg>`;
}

function navItem(page, index) {
  const label = index === undefined ? page.title : `${number(index)}. ${page.title}`;
  const id = page.id === 'home' ? 'intro' : page.id;
  return `<a class="nav-item" data-id="${id}" href="#${page.id}"><span class="nav-icon">${icon(page.icon)}</span>${label}</a>`;
}
$('#story-nav').innerHTML = [
  ...pages.slice(0, 2).map((page) => navItem(page)),
  '<div class="nav-section-label">Laborübungen</div>',
  ...lessons.map(navItem),
  '<div class="nav-section-label">Referenz</div>',
  ...referencePages.map((page) => navItem(page)),
  '<div class="nav-section-label">Wissenstest</div>',
  navItem(pages.at(-1))
].join('');

function tile(page, chip, label) {
  const badge = done[page.id] ? '<span class="tag-done">Erledigt</span>' : '';
  return `<li><a class="ptile" href="#${page.id}">
    <div class="art"><img src="img/fotos/${page.photo || page.id}.jpg" alt="" width="800" height="500" loading="lazy">${badge}<span class="chip-num" aria-hidden="true">${chip}</span></div>
    <div class="tile-body"><h3>${page.title}</h3><p>${page.subtitle}</p><span class="go">${label}</span></div>
  </a></li>`;
}

function overview() {
  const completed = lessons.filter(({ id }) => done[id]).length;
  return `<div class="home">
    <section class="home-hero">
      <div>
        <div class="mod-chip" aria-hidden="true">ST</div>
        <p class="hero-eyebrow">Lernmodul 09 · Dramaturgie, Bild &amp; Medien</p>
        <h1>Storytelling</h1>
        <p class="hero-lead">Wie wird aus einer Folge von Ereignissen eine Geschichte? Entwickeln Sie Figuren und Konflikte, steuern Sie Spannung und Perspektive und entwerfen Sie ein Storyboard. Im transmedialen Labor erzählen Sie dieselbe Welt aus mehreren Richtungen.</p>
        <div class="hero-actions"><div class="hero-cta">
          <a class="btn btn-primary" href="#grundlagen">Modul starten <span aria-hidden="true">→</span></a>
          <a class="btn" href="#einleitung">Zur Einleitung</a>
        </div>
          <a class="btn btn-download" href="downloads/storytelling-zusammenfassung.pdf" download>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>
            Zusammenfassung als PDF
          </a>
        </div>
        <p class="hero-meta"><span><b>8</b> Laborübungen</span><span><b>${referencePages.length}</b> Referenzen</span><span><b>${questions.length}</b> Quizfragen</span><span>ca. <b>3 Std.</b></span></p>
      </div>
      <figure class="hero-media">
        <img src="img/fotos/hero.jpg" alt="Studierende besprechen ein Storyboard und ein Brückenmodell in der Modellbauwerkstatt" width="1200" height="900" fetchpriority="high">
        <figcaption class="ki-badge">KI-generiert</figcaption>
      </figure>
    </section>
    <div class="progress-band">
      <label class="label" for="home-progress">Ihr Fortschritt</label>
      <progress id="home-progress" max="${lessons.length}" value="${completed}"></progress>
      <b>${completed} / ${lessons.length} Lektionen</b>
    </div>
    <div class="home-section-label"><h2>Laborübungen</h2><span>Lektion 01–08</span></div>
    <ul class="tiles">${lessons.map((lesson, index) => tile(lesson, number(index), 'Übung starten')).join('')}</ul>
    <div class="home-section-label"><h2>Referenz</h2><span>Nachschlagen</span></div>
    <ul class="tiles">${referencePages.map((page) => tile(page, page.chip, 'Öffnen')).join('')}</ul>
    <div class="home-section-label"><h2>Wissenstest</h2><span>Quiz</span></div>
    <ul class="tiles">${tile(pages.at(-1), '?', 'Quiz starten')}</ul>
    <p class="footer-note">Lernmodul 09 · Lern-Apps Gestaltung &amp; UX · Hochschule Karlsruhe, Fakultät IWI · Fotos KI-generiert</p>
  </div>`;
}

function section(title, body, panel = false) {
  return `<section class="story-section${panel ? ' story-panel' : ''}"><h2>${title}</h2>${body}</section>`;
}

function question([prompt, options], name) {
  return `<fieldset class="story-question"><legend>${prompt}</legend>${options.map((option, index) =>
    `<label><input type="radio" required name="${name}" value="${index}"> ${option}</label>`).join('')}
    <p class="story-result" data-feedback-for="${name}"></p>
  </fieldset>`;
}

const beats = ['Mira bereitet das Modell für die Präsentation vor.', 'Regen weicht die Pfeiler auf.', 'Mira versucht, die Pfeiler zu kleben.', 'Beim Belastungstest reißt die Verbindung.', 'Mira bittet ihr Team um Hilfe.', 'Das Team präsentiert die gemeinsame Reparatur.'];
const frames = ['Ausgangslage', 'Auslöser', 'Versuch', 'Rückschlag', 'Entscheidung', 'Konsequenz'];
const mediaFields = ['Medium und Beitrag', 'Neuer Teil der Erzählwelt', 'Kontext für den Einstieg', 'Übergang zu einem anderen Beitrag'];

function practice(id) {
  if (id === 'struktur') return `<div class="story-panel">
    <h3>Szenen ordnen</h3><p>Bringen Sie die Momente aus Miras Geschichte in eine Abfolge, in der jede Entscheidung nachvollziehbar wird.</p>
    <ol class="story-order" id="beat-order"></ol><button type="button" class="btn" id="order-check">Reihenfolge prüfen</button>
    <p class="story-result" id="order-result" role="status"></p></div>`;
  if (id === 'spannung') return `<div class="story-panel story-curve">
    <h3>Spannungskurve</h3>
    <p>Stellen Sie für jede Station von Miras Geschichte ein, wie viel Spannung das Publikum dort erleben soll. Die Rückmeldung beschreibt, was der Verlauf erzählt. Eine einzige richtige Kurve gibt es nicht.</p>
    <div class="story-controls" id="curve-presets" role="group" aria-label="Muster laden">
      ${Object.entries(curvePresets).map(([key, [label]]) => `<button type="button" class="btn" data-preset="${key}">${label}</button>`).join('')}
    </div>
    <div class="story-curve-grid">
      <div class="story-curve-sliders">${curveStations.map(([name, scene], i) => `<div class="story-curve-row">
        <label for="curve-${i}"><span>${i + 1}. ${name}</span><span class="story-curve-val" id="curve-${i}-v" aria-hidden="true"></span></label>
        <input id="curve-${i}" type="range" min="0" max="10" step="1" value="${curvePresets.klassisch[1][i]}" aria-describedby="curve-${i}-s">
        <span class="story-note" id="curve-${i}-s">${scene}</span></div>`).join('')}</div>
      <div class="story-curve-chart">
        <svg viewBox="0 0 600 300" role="img" aria-labelledby="curve-desc"><title id="curve-desc">Spannungskurve über sechs Stationen</title>
          <g class="story-curve-grid-lines">${[0, 5, 10].map((v) => `<line x1="40" x2="580" y1="${curveY(v)}" y2="${curveY(v)}"/>`).join('')}</g>
          <path class="story-curve-ref" id="curve-ref" d="" hidden/>
          <path class="story-curve-line" id="curve-line" d=""/>
          <g id="curve-dots"></g>
          ${curveStations.map((_, i) => `<text class="story-curve-num" x="${curveX(i)}" y="294" text-anchor="middle">${i + 1}</text>`).join('')}
        </svg>
        <p class="story-curve-axis"><span>↑ Spannung</span><span>Erzählverlauf: Stationen 1–6 →</span></p>
        <div class="story-controls"><button type="button" class="btn" id="curve-keep">Kurve A merken</button><button type="button" class="btn" id="curve-clear" hidden>Vergleich entfernen</button></div>
        <p class="story-note" id="curve-legend" hidden>Blass gestrichelt: Kurve A. Kräftig: aktuelle Kurve B.</p>
        <div class="story-curve-feedback" id="curve-feedback" aria-live="polite"></div>
      </div>
    </div>
  </div>`;
  if (id === 'bild') return `<figure class="story-panel"><img src="img/hero.svg" width="640" height="400" alt="Sechs Bildfelder: Mira mit Modell, Regen, Bruchstelle, Blick zum Telefon, Teamarbeit und Präsentation">
    <figcaption>Beispielsequenz: Totale, Detail, Detail, Nahaufnahme, Zweierbild und Totale. Der Ausschnitt führt vom Ort zur Ursache, zur Entscheidung und schließlich zu ihrer Folge.</figcaption></figure>`;
  if (id === 'transmedia') return `<div class="story-panel">
    <h3>Drei Einstiege in dieselbe Erzählwelt</h3>
    <div class="story-controls" id="media-options">
      <button class="btn" type="button" data-medium="film">Kurzfilm</button>
      <button class="btn" type="button" data-medium="audio">Audionotiz</button>
      <button class="btn" type="button" data-medium="web">Web-Labor</button>
    </div><p id="media-preview" role="status"></p>
  </div>`;
  return '';
}

function extraPractice(id) {
  if (id === 'grundlagen') return `<div class="story-panel story-extra">
    <h3>Story Spine sortieren</h3><p>Bringen Sie die sieben Sätze in die Reihenfolge des Story Spine. Achten Sie besonders auf die beiden „Und deswegen“-Sätze: Jeder muss aus dem Satz davor folgen.</p>
    <ol class="story-order" id="spine-order"></ol><button type="button" class="btn" id="spine-check">Reihenfolge prüfen</button>
    <p class="story-result" id="spine-result" role="status"></p></div>`;
  if (id === 'figur') return `${matchHtml('hero')}${matchHtml('arch')}
    <div class="story-panel story-extra"><h3>Konfliktebenen einstellen</h3>
    <p>Stellen Sie ein, wie stark die drei Ebenen in Ihrer Geschichte ausgeprägt sind. Die Rückmeldung beschreibt, was die Kombination für die Geschichte bedeutet. Es gibt keine richtige Einstellung.</p>
    <div class="story-conflict">${conflictLevels.map(([key, name, examples]) => `<div class="story-conflict-row">
      <label for="cf-${key}">${name} <output id="cf-${key}-o" for="cf-${key}"></output></label>
      <input id="cf-${key}" type="range" min="0" max="3" step="1" value="${key === 'innen' ? 2 : 1}">
      <span class="story-note">${examples}</span></div>`).join('')}</div>
    <p class="story-conflict-text" id="cf-text" aria-live="polite"></p></div>`;
  if (id === 'perspektive') return `<div class="story-panel story-extra"><h3>Show, don’t tell</h3>
    <p>Welche Fassung zeigt die Behauptung als beobachtbare Szene?</p>
    <form id="st-form">${showTell.map(([prompt, options], i) => question([prompt, options], `st${i}`)).join('')}
    <button class="btn" type="submit">Auswahl prüfen</button><p class="story-result" id="st-result" role="status"></p></form></div>`;
  if (id === 'bild') return `<div class="story-panel story-extra"><h3>Storyboard: Express-Abholung in der Mensa</h3>
    <p>Lukas hat in 15 Minuten eine Klausur und will vorher noch essen. Wählen Sie für jedes der vier Panels die Einstellungsgröße, die seine erzählerische Aufgabe am besten erfüllt.</p>
    <ul class="story-shot-legend">${shotSizes.map(([, name, desc]) => `<li><b>${name}</b> ${desc}</li>`).join('')}</ul>
    <ol class="story-sb">${storyboard.map(({ title, scene, img, alt }, i) => `<li class="story-sb-panel">
      <p class="story-sb-head"><span>Panel ${i + 1}</span> ${title}</p><p>${scene}</p>
      <fieldset><legend>Einstellungsgröße für Panel ${i + 1}</legend>${shotSizes.map(([key, name]) => `<label><input type="radio" name="sb${i}" value="${key}"> ${name}</label>`).join('')}</fieldset>
      <p class="story-sb-note" id="sb${i}-note"></p>
      <figure class="story-sb-img" id="sb${i}-img" hidden><img src="img/fotos/${img}.webp" alt="${alt}" width="800" height="598" loading="lazy"><span class="ki-badge" aria-hidden="true">KI-generiert</span></figure>
    </li>`).join('')}</ol>
    <button type="button" class="btn" id="sb-check">Storyboard prüfen</button>
    <p class="story-result" id="sb-result" role="status"></p></div>`;
  if (id === 'transmedia') return matchHtml('jenkins');
  return '';
}

function textField(key, label, rows = 3) {
  return `<label>${label}<textarea data-draft="${key}" rows="${rows}"></textarea></label>`;
}

function fields(lesson) {
  const { id } = lesson;
  let structured = '';
  if (id === 'bild') {
    structured = `<div class="two-col">${frames.map((frame, i) => textField(`${id}:${i}`, `${number(i)}. ${frame} · Bild, Handlung und Ton`)).join('')}</div>`;
  }
  if (id === 'transmedia') {
    structured = Array.from({ length: 3 }, (_, i) => `<fieldset class="story-question"><legend>Beitrag ${i + 1}</legend>
      <div class="two-col">${mediaFields.map((field, j) => textField(`${id}:${i}:${j}`, field, 2)).join('')}</div>
    </fieldset>`).join('');
  }
  const legacyDraft = drafts[id] && structured ? textField(id, 'Vorheriger Entwurf', 4) : '';
  return `<div class="story-fields">${structured || textField(id, 'Ihr Entwurf', 5)}${legacyDraft}
    <details><summary>Musterlösung und Hinweise zur Selbstprüfung</summary><p>${lesson.review}</p></details>
    <label><input type="checkbox" id="complete"> Ich habe die Übung bearbeitet und meinen Entwurf geprüft.</label>
    <p class="story-note" id="save-note" role="status">Entwürfe und Fortschritt werden in diesem Browser gespeichert.</p>
  </div>`;
}

function lessonContent(lesson, index) {
  return `<div class="lektion-badge"><span class="lektion-number">${number(index)}</span><span class="lektion-label">Laborübung</span></div>
    <h1 class="page-title purple">${lesson.title}</h1><p class="page-intro">${lesson.lead}</p>
    ${section('Lernziele', `<ul>${lesson.goals.map((goal) => `<li>${goal}</li>`).join('')}</ul>`, true)}
    ${section('Grundlagen', lesson.theory.map(([title, body]) => `<h3>${title}</h3><p>${body}</p>`).join(''))}
    ${section('Fallbeispiel · Brücke um zehn', `<p>${lesson.case}</p>`, true)}
    ${lesson.id === 'struktur' ? section('Beispiel aus einem Pitch', `<p>${keynote}</p>`, true) : ''}
    ${lesson.id === 'transmedia' ? section('Sieben Prinzipien nach Henry Jenkins', `<p>Henry Jenkins hat 2009 sieben Prinzipien des transmedialen Erzählens beschrieben. Die ersten drei sind Begriffspaare, die ein Spannungsfeld markieren.</p><dl>${jenkins.map(([name, desc]) => `<dt>${name}</dt><dd>${desc}</dd>`).join('')}</dl><p class="story-note">Quelle: <a href="https://henryjenkins.org/blog/2009/12/the_revenge_of_the_origami_uni.html">Henry Jenkins: The Revenge of the Origami Unicorn</a> (2009).</p>`) : ''}
    ${section('Ausprobieren', `${practice(lesson.id)}${extraPractice(lesson.id)}<form id="mini-check">${question(lesson.check, 'probe')}
      <button class="btn" type="submit">Antwort prüfen</button><p class="story-result" id="mini-result" role="status"></p></form>`)}
    ${section('Ihre Aufgabe', `<p>${lesson.task}</p>${fields(lesson)}`, true)}
    ${uxTransfer[lesson.id] ? section('Transfer ins UX-Design', `<p>${uxTransfer[lesson.id]}</p>
      <a class="btn" href="#${lesson.id === 'transfer' ? 'baukasten' : 'modelle'}">${lesson.id === 'transfer' ? 'Zum Story-Baukasten' : 'Erzählmodelle vergleichen'}</a>`) : ''}`;
}

const introExercises = {
  grundlagen: 'Verbinden Sie einzelne Ereignisse so, dass eine Entscheidung aus dem vorherigen Geschehen folgt.',
  figur: 'Entwerfen Sie eine Figur mit einem konkreten Ziel. Legen Sie fest, was ihr im Weg steht und was sie verlieren kann.',
  struktur: 'Ordnen Sie Szenen von der Ausgangslage bis zur Konsequenz und begründen Sie den Wendepunkt.',
  spannung: 'Verändern Sie die Spannungskurve und entscheiden Sie, wann das Publikum einen Hinweis bekommt.',
  perspektive: 'Erzählen Sie denselben Moment aus zwei Perspektiven und machen Sie Gefühle durch Handlungen sichtbar.',
  bild: 'Skizzieren Sie sechs Einstellungen und planen Sie, welche Information Bild und Ton jeweils vermitteln.',
  transmedia: 'Verteilen Sie drei eigenständige Beiträge auf mehrere Medien. Planen Sie verständliche Einstiege und Übergänge.',
  transfer: 'Verdichten Sie Ihre Geschichte in einer Logline und leiten Sie aus einem Publikumstest eine Überarbeitung ab.'
};

const references = {
  einleitung: `
    <span class="intro-eyebrow">Einleitung</span>
    <h1 class="main-heading">Warum Geschichten gestalten?</h1>
    <p class="intro-lead">Um zehn Uhr soll Mira ihr Brückenmodell präsentieren. Kurz vorher bricht ein Pfeiler. Repariert sie die Brücke allein oder bittet sie ihr Team um Hilfe? Sobald das Publikum versteht, was für Mira auf dem Spiel steht, bekommt ihre Entscheidung Gewicht. In diesem Modul gestalten Sie solche Momente für Text, Bild und mehrere Medien.</p>
    <hr class="intro-rule">
    <figure class="intro-media">
      <img src="img/fotos/hero.jpg" alt="Studierende vergleichen ein gezeichnetes Storyboard mit ihrem beschädigten Brückenmodell in der Werkstatt" width="1200" height="900">
      <figcaption>„Brücke um zehn“ begleitet Sie durch das Modul. An demselben Fall erproben Sie, wie Reihenfolge, Perspektive und Medienwahl die Geschichte verändern. Bild KI-generiert.</figcaption>
    </figure>

    <section class="section-card story-lisa">
      <h2>Feature-Liste oder Geschichte?</h2>
      <p>Dieselbe Smartwatch-Funktion, zweimal beschrieben. Schalten Sie zwischen den Fassungen um.</p>
      <div class="story-controls" id="lisa-toggle" role="group" aria-label="Fassung wählen">
        <button type="button" class="btn" data-lisa="features" aria-pressed="true">Feature-Liste</button>
        <button type="button" class="btn" data-lisa="story" aria-pressed="false">Geschichte</button>
      </div>
      <div class="story-lisa-out" id="lisa-out" aria-live="polite"></div>
      <p class="story-note">${lisa.note}</p>
    </section>

    <h2 class="intro-h2">Was Sie in diesem Modul erwartet</h2>
    <div class="intro-grid g3">
      <div class="intro-card">
        <h3>Figur und Konflikt</h3>
        <p class="intro-sub">Wer handelt und warum?</p>
        <p>Ein konkretes Ziel gibt der Geschichte eine Richtung. Ein Hindernis zwingt die Figur zur Wahl. Die Folgen zeigen, warum diese Wahl zählt.</p>
        <p class="intro-q">Leitfrage: „Was steht für die Figur auf dem Spiel?“</p>
      </div>
      <div class="intro-card">
        <h3>Dramaturgie und Perspektive</h3>
        <p class="intro-sub">Was erfährt das Publikum wann?</p>
        <p>Wer den Riss im Pfeiler vor Mira sieht, erwartet den Bruch. Wer ihn erst mit ihr bemerkt, wird überrascht. Reihenfolge, Blickwinkel und Rhythmus verändern die Wirkung.</p>
        <p class="intro-q">Leitfrage: „Welche Frage hält das Publikum bei der Geschichte?“</p>
      </div>
      <div class="intro-card">
        <h3>Bild und Medien</h3>
        <p class="intro-sub">Wie wird die Erzählwelt erfahrbar?</p>
        <p>Im Storyboard planen Sie, was Bild und Ton erzählen. Transmedial kann ein Film Miras Entscheidung zeigen, während eine Audionotiz erstmals die Sicht ihres Teamkollegen hörbar macht.</p>
        <p class="intro-q">Leitfrage: „Was kann das Publikum in diesem Medium zusätzlich entdecken?“</p>
      </div>
    </div>

    <section class="section-card">
      <h2>Laborübungen</h2>
      <ol class="exercise-list" role="list">
        ${lessons.map((lesson, index) => `<li class="exercise-item">
          <span class="exercise-number" aria-hidden="true">${number(index)}</span>
          <div><a class="exercise-label" href="#${lesson.id}">${lesson.title}</a><span class="exercise-desc"> · ${introExercises[lesson.id]}</span></div>
        </li>`).join('')}
      </ol>
    </section>

    <section class="section-card">
      <h2>Referenzbereich</h2>
      <ul class="exercise-list" role="list">
        <li class="exercise-item"><span class="exercise-number" aria-hidden="true">REF</span><div><a class="exercise-label" href="#glossar">Glossar</a><span class="exercise-desc"> · ${terms.length} Fachbegriffe von ${termRange} nachschlagen, jeweils mit einem Beispiel aus dem UX-Design.</span></div></li>
        <li class="exercise-item"><span class="exercise-number" aria-hidden="true">REF</span><div><a class="exercise-label" href="#modelle">Erzählmodelle im Vergleich</a><span class="exercise-desc"> · ${modelle.length} Modelle an einem UX-Fall vergleichen, darunter zwei Pitch-Modelle aus dem Marketing.</span></div></li>
        <li class="exercise-item"><span class="exercise-number" aria-hidden="true">REF</span><div><a class="exercise-label" href="#baukasten">Story-Baukasten</a><span class="exercise-desc"> · Eine eigene UX-Fallstudie in sieben Schritten entwerfen oder von einem fiktiven Beispiel ausgehen.</span></div></li>
        <li class="exercise-item"><span class="exercise-number" aria-hidden="true">REF</span><div><a class="exercise-label" href="#werkzeuge">Vorlagen und Literatur</a><span class="exercise-desc"> · Das Arbeitsblatt für Storyboard und Medienplan nutzen und die Quellen vertiefen.</span></div></li>
      </ul>
    </section>

    <h2 class="intro-h2">Lernziele</h2>
    <p class="main-text">Nach Bearbeitung des Moduls können Sie …</p>
    <ul class="intro-list">
      <li>Figur, Ziel, Konflikt und Einsatz in einer Logline zusammenfassen,</li>
      <li>Szenen durch Ursache und Folge verbinden und einen Wendepunkt begründen,</li>
      <li>Spannung durch Rhythmus, Perspektive und die Reihenfolge von Informationen gestalten,</li>
      <li>ein Storyboard entwickeln, das Bild und Ton aufeinander abstimmt,</li>
      <li>einen transmedialen Medienplan mit eigenständigen Beiträgen, Einstiegen und Übergängen entwerfen,</li>
      <li>einen Entwurf mit Publikum testen und gezielt überarbeiten.</li>
    </ul>

    <h2 class="intro-h2">So arbeiten Sie mit dem Modul</h2>
    <div class="intro-grid g3">
      <div class="intro-card soft"><div class="intro-label">1 · Ausprobieren</div><p>Lesen Sie das Fallbeispiel, probieren Sie die Aufgabe aus und prüfen Sie Ihr Verständnis mit der Kontrollfrage. Entwickeln Sie dieselbe eigene Geschichte von Labor zu Labor weiter.</p></div>
      <div class="intro-card soft"><div class="intro-label">2 · Nachschlagen</div><p>Nutzen Sie Glossar und Vorlagen, wenn Sie einen Begriff klären oder eine Szene, ein Storyboard oder einen Medienplan ausarbeiten möchten.</p></div>
      <div class="intro-card soft"><div class="intro-label">3 · Prüfen</div><p>Vergleichen Sie Ihre Entwürfe mit den Hinweisen zur Selbstprüfung. Das <a href="#quiz">Storytelling-Quiz</a> prüft Ihr Wissen mit ${questions.length} Fragen. Ihr Fortschritt bleibt in diesem Browser gespeichert.</p></div>
    </div>
    <div class="intro-note"><span class="intro-badge" aria-hidden="true">i</span><p><strong>Zeitbedarf:</strong> Rechnen Sie mit etwa 3 Stunden für alle acht Labore. Sie können die Übungen auch einzeln bearbeiten.</p></div>

    <a href="#grundlagen" class="cta-button">Starten Sie mit Lektion 01
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>`,
  glossar: `<h1 class="page-title purple">Glossar</h1>${section('Begriffe zum Nachschlagen', `<dl>${sortedTerms.map(([term, definition, example]) => `<dt>${term}</dt><dd>${definition}${example ? `<span class="story-term-ex"><b>UX-Beispiel:</b> ${example}</span>` : ''}</dd>`).join('')}</dl>`, true)}`,
  modelle: `<h1 class="page-title purple">Erzählmodelle im Vergleich</h1>
    <p class="page-intro">Nora sucht nach einer kurzfristigen Raumänderung ihren Seminarraum. Vier Modelle zeigen am selben Fall, welche Fragen Sie beim Erzählen und beim UX-Entwurf jeweils stellen können.</p>
    <div class="story-model-grid">${modelle.map((model) => section(model.title, `
      ${model.tag ? `<p class="story-model-tag">${model.tag}</p>` : ''}
      <p><strong>${model.question}</strong></p>
      <p class="story-model-steps">${model.steps}</p>
      <p>${model.example}</p>
      <p>${model.limit}</p>
      <p class="story-note"><a href="${model.source[1]}">${model.source[0]}</a></p>`, true)).join('')}</div>
    ${section('Welches Modell passt zu Ihrem Entwurf?', '<p>Für eine Kette von Entscheidungen beginnen Sie mit dem Story Spine. Wenn mehrere Medien eigene Teile der Geschichte erzählen sollen, skizzieren Sie zuerst die gemeinsame Erzählwelt und die Beiträge. Golden Circle und StoryBrand helfen, einen Pitch oder eine Landingpage zu ordnen. Sie stammen aus dem Marketing und ersetzen keine Geschichte mit Figur und Konflikt.</p><a class="btn btn-primary" href="#baukasten">Zum Story-Baukasten</a>')}`,
  baukasten: `<h1 class="page-title purple">Story-Baukasten</h1>
    <p class="page-intro">Entwerfen Sie eine UX-Fallstudie mit dem Story Spine. Beschreiben Sie, wie aus einem konkreten Problem eine Entwurfsentscheidung folgt und woran sich das Ergebnis erkennen lässt.</p>
    <details class="story-panel"><summary>Fiktives Beispiel: Nora sucht den Seminarraum</summary>
      <dl class="story-section">${spineFields.map(({ label, example }) => `<dt><strong>${label}</strong></dt><dd>${example}</dd>`).join('')}</dl>
    </details>
    ${section('Von einem Beispiel ausgehen', `<p>Laden Sie eine fiktive Vorlage in die Felder und passen Sie sie an Ihr Projekt an. Die Beispiele enthalten bewusst keine Erfolgszahlen. Tragen Sie in Ihrer Fallstudie nur Ergebnisse ein, die Sie selbst beobachtet oder gemessen haben.</p>
      <div class="btn-group" id="spine-examples">${spineExamples.map(({ id, label }) => `<button type="button" class="btn" data-example="${id}">Beispiel laden: ${label}</button>`).join('')}</div>
      <p class="story-note" id="spine-example-status" role="status"></p>`, true)}
    ${section('Ihr Entwurf', `<div class="story-fields" id="spine-fields">
      <label>Projekttitel <input type="text" data-draft="baukasten:titel"></label>
      ${spineFields.map(({ id, label, prompt }, index) => `<label>${index + 1}. ${label}<span class="story-note story-field-prompt">${prompt}</span>
        <textarea data-draft="baukasten:${id}" rows="3"></textarea></label>`).join('')}
      <button type="button" class="btn btn-primary" id="spine-export" disabled>Markdown herunterladen</button>
      <p class="story-note" id="save-note" role="status">Ihr Entwurf wird in diesem Browser gespeichert.</p>
    </div>`, true)}
    ${section('Prüfen Sie die Kausalkette', '<p>Lesen Sie die beiden Folgen mit „deshalb“ vor. Prüfen Sie, ob die Entwurfsentscheidung auf das beobachtete Problem antwortet. Markieren Sie im Ergebnis, was der Test zeigt und was noch offen ist.</p>')}`,
  werkzeuge: `<h1 class="page-title purple">Vorlagen und Literatur</h1>
    ${section('Arbeitsmaterial', '<p>Das druckbare Arbeitsblatt führt von der Logline über sechs Einstellungen bis zum Medienplan. Gespeicherte Entwürfe können Sie zusätzlich als Text exportieren.</p><div class="btn-group"><a class="btn btn-download" href="storytelling-arbeitsblatt.html">Arbeitsblatt öffnen</a><button class="btn" type="button" id="export">Eigene Entwürfe herunterladen</button></div><p id="export-status" role="status"></p>', true)}
    ${section('Zum Weiterlesen', '<ul><li>Aristoteles, <cite>Poetik</cite>. Handlung, Zusammenhang und Wendung.</li><li>E. M. Forster, <cite>Aspects of the Novel</cite>. Ereignisfolge und Plot.</li><li>Scott McCloud, <cite>Understanding Comics</cite>. Bildfolge und Übergänge.</li><li>Henry Jenkins, <a href="https://henryjenkins.org/blog/2007/03/transmedia_storytelling_101.html"><cite>Transmedia Storytelling 101</cite></a>. Eigenständige Beiträge, Einstiege und Beteiligung.</li></ul>')}`,
  quiz: `<h1 class="page-title purple">Storytelling-Quiz</h1><p class="page-intro">Wählen Sie je Frage eine Antwort. Sie erhalten zu jeder Antwort eine Erklärung und können es erneut versuchen.</p>
    <form id="quiz-form">${questions.map(([prompt, options], i) => question([`${i + 1}. ${prompt}`, options], `q${i}`)).join('')}
      <button class="btn btn-primary">Quiz auswerten</button><p class="story-result" id="quiz-result" role="status" tabindex="-1"></p>
    </form>`
};

function setMenu(open, returnFocus = false) {
  document.body.classList.toggle('nav-open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  if (open) sidebar.querySelector('[aria-current="page"]').focus();
  if (returnFocus) menu.focus();
}
menu.onclick = () => setMenu(menu.getAttribute('aria-expanded') === 'false');
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('nav-open')) setMenu(false, true);
});
document.addEventListener('click', (event) => {
  if (document.body.classList.contains('nav-open') && !sidebar.contains(event.target) && !menu.contains(event.target)) setMenu(false);
});
window.matchMedia('(min-width: 769px)').addEventListener('change', () => setMenu(false));

function wireLesson(lesson) {
  const { id } = lesson;
  content.querySelectorAll('[data-draft]').forEach((field) => {
    field.value = drafts[field.dataset.draft] || '';
    field.oninput = () => {
      drafts[field.dataset.draft] = field.value;
      save();
    };
  });
  $('#complete').checked = Boolean(done[id]);
  $('#complete').onchange = (event) => {
    const fields = [...content.querySelectorAll('[data-draft]')];
    if (event.target.checked && !fields.some((field) => field.value.trim())) {
      event.target.checked = false;
      $('#save-note').textContent = 'Tragen Sie zuerst Ihren Entwurf ein und prüfen Sie ihn anhand der Hinweise.';
      fields[0].focus();
      return;
    }
    done[id] = event.target.checked;
    $('#save-note').textContent = 'Entwürfe und Fortschritt werden in diesem Browser gespeichert.';
    save();
    sidebar.querySelector('[aria-current="page"]').classList.toggle('story-done', done[id]);
  };
  const form = $('#mini-check');
  if (answers[id] !== undefined) form.elements.probe.value = answers[id];
  form.onsubmit = (event) => {
    event.preventDefault();
    const value = Number(form.elements.probe.value);
    const correct = value === lesson.check[2];
    answers[id] = value;
    $('#mini-result').textContent = `${correct ? 'Richtig.' : 'Noch nicht richtig.'} ${lesson.check[3]}`;
    save();
  };
  if (id === 'struktur') wireOrder({ list: $('#beat-order'), check: $('#order-check'), result: $('#order-result'), items: beats, order: [3, 1, 5, 0, 4, 2],
    success: 'Richtig. Jeder Schritt bereitet die nächste Entscheidung vor.', hint: (pos) => `Prüfen Sie ab Position ${pos}: Was muss geschehen, bevor die nächste Szene plausibel wird?` });
  if (id === 'grundlagen') wireOrder({ list: $('#spine-order'), check: $('#spine-check'), result: $('#spine-result'), items: spineSort.items, order: [...spineSort.start], success: spineSort.success, hint: spineSort.hint, label: 'Satz' });
  if (id === 'figur') { wireMatch('hero'); wireMatch('arch'); wireConflict(); }
  if (id === 'transmedia') wireMatch('jenkins');
  if (id === 'perspektive') wireShowTell();
  if (id === 'bild') wireStoryboard();
  if (id === 'spannung') wireCurve();
  if (id === 'transmedia') wireMedia();
}

function wireOrder({ list, check, result, items, order, success, hint, label = 'Szene' }) {
  function render(focusIndex, delta) {
    list.innerHTML = order.map((item, i) => `<li><span>${items[item]}</span>
      <span class="story-order-btns"><button type="button" class="btn" data-index="${i}" data-step="-1" aria-label="${label} ${i + 1} nach oben" ${i === 0 ? 'disabled' : ''}>↑</button>
      <button type="button" class="btn" data-index="${i}" data-step="1" aria-label="${label} ${i + 1} nach unten" ${i === order.length - 1 ? 'disabled' : ''}>↓</button></span></li>`).join('');
    if (focusIndex !== undefined) {
      const target = list.querySelector(`[data-index="${focusIndex}"][data-step="${delta}"]:enabled`);
      (target || list.querySelector(`[data-index="${focusIndex}"]:enabled`))?.focus();
    }
  }
  list.onclick = (event) => {
    const button = event.target.closest('[data-step]');
    if (!button) return;
    const index = Number(button.dataset.index);
    const delta = Number(button.dataset.step);
    const next = index + delta;
    [order[index], order[next]] = [order[next], order[index]];
    result.textContent = `${label} auf Position ${next + 1} verschoben.`;
    render(next, delta);
  };
  check.onclick = () => {
    const mismatch = order.findIndex((item, i) => item !== i);
    result.textContent = mismatch < 0 ? success : hint(mismatch + 1);
  };
  render();
}

/* Zuordnungsübungen: jede Zeile wählt aus derselben Liste (richtig = gleicher Index) */
const matchSets = {
  hero: { title: 'Heldenreise im UX', intro: 'Ordnen Sie jeder Station der Heldenreise die passende Situation aus der Einführung eines Planungswerkzeugs zu.',
    rows: heroJourney.stations.map(([station]) => ({ label: station })), options: heroJourney.stations.map(([, ux]) => ux), done: heroJourney.feedback },
  arch: { title: 'Archetypen im Fall „KlimaMobil“', intro: archetypes.intro,
    rows: archetypes.roles.map(([role, , why]) => ({ label: role, hint: why })), options: archetypes.roles.map(([, cast]) => cast),
    done: 'Richtig zugeordnet. Die Nutzerin ist die Heldin, das Produkt der Mentor. Gegenspieler und Hürden sind hier Umstände, keine Personen.' },
  jenkins: { title: 'Prinzipien im UX erkennen', intro: 'Welches Prinzip zeigt sich in welchem Beispiel? Ordnen Sie jedem Prinzip ein Beispiel aus dem UX-Design zu.',
    rows: jenkins.map(([name, desc]) => ({ label: name, hint: desc })), options: jenkins.map(([, , ux]) => ux),
    done: 'Richtig zugeordnet. Die Prinzipien beschreiben Spannungsfelder. Ein Projekt muss nicht alle sieben bedienen.' }
};
function matchHtml(key) {
  const { title, intro, rows, options } = matchSets[key];
  const n = options.length;
  const perm = options.map((_, i) => (i * 3 + 2) % n);
  return `<div class="story-panel story-extra"><h3>${title}</h3><p>${intro}</p>
    <div class="story-match">${rows.map(({ label }, i) => `<div class="story-match-row">
      <label for="${key}-${i}">${label}</label>
      <select id="${key}-${i}"><option value="">Bitte wählen …</option>${perm.map((j) => `<option value="${j}">${options[j]}</option>`).join('')}</select>
      <p class="story-match-note" id="${key}-${i}-note"></p></div>`).join('')}</div>
    <button type="button" class="btn" id="${key}-check">Zuordnung prüfen</button>
    <p class="story-result" id="${key}-sum" role="status"></p></div>`;
}
function wireMatch(key) {
  const { rows, done: doneText } = matchSets[key];
  $(`#${key}-check`).onclick = () => {
    let right = 0, open = 0;
    rows.forEach(({ hint }, i) => {
      const value = $(`#${key}-${i}`).value;
      const note = $(`#${key}-${i}-note`);
      note.className = 'story-match-note';
      if (value === '') { open++; note.textContent = ''; return; }
      const ok = Number(value) === i;
      right += Number(ok);
      note.classList.add(ok ? 'is-ok' : 'is-off');
      note.textContent = ok ? 'Passt.' : `Noch nicht.${hint ? ' Hinweis: ' + hint : ''}`;
    });
    $(`#${key}-sum`).textContent = right === rows.length ? doneText
      : `${right} von ${rows.length} richtig zugeordnet.${open ? ` ${open} noch offen.` : ''} Prüfen Sie die markierten Zeilen.`;
  };
}

function conflictText(levels) {
  const active = levels.filter((v) => v > 0).length;
  const strong = levels.filter((v) => v === 3).length;
  const parts = [];
  if (levels[0]) parts.push('Die Figur ringt mit sich selbst, etwa mit Zweifeln oder Angst vor Fehlern.');
  if (levels[1]) parts.push('Andere Menschen stellen sich in den Weg oder widersprechen einander.');
  if (levels[2]) parts.push('Strukturen begrenzen die Möglichkeiten, etwa Vorgaben, Altsysteme oder Fristen.');
  let summary;
  if (!active) summary = 'Ohne Widerstand muss die Figur nichts entscheiden. Es entsteht ein Bericht, keine Geschichte.';
  else if (active === 1) summary = 'Eine Ebene trägt den Konflikt. Für eine kurze Szene kann das genügen. Eine längere Geschichte gewinnt oft durch eine zweite Ebene, die zur Entscheidung zwingt.';
  else if (strong >= 2) summary = 'Mehrere Ebenen sind stark ausgeprägt. Das erzeugt Druck, kann aber überladen wirken. Prüfen Sie, ob das Publikum noch erkennt, worum es im Kern geht.';
  else summary = 'Mehrere Ebenen greifen ineinander. Prüfen Sie, ob sie sich verstärken: Erhöht zum Beispiel die Frist den Druck im Team?';
  return `${parts.join(' ')} ${summary}`.trim();
}
function wireConflict() {
  const inputs = conflictLevels.map(([key]) => $(`#cf-${key}`));
  const draw = () => {
    inputs.forEach((input) => { $(`#${input.id}-o`).textContent = conflictSteps[input.value]; });
    $('#cf-text').textContent = conflictText(inputs.map((input) => Number(input.value)));
  };
  inputs.forEach((input) => { input.oninput = draw; });
  draw();
}

function wireShowTell() {
  const form = $('#st-form');
  form.onsubmit = (event) => {
    event.preventDefault();
    let right = 0;
    showTell.forEach(([, , correct, feedback], i) => {
      const value = form.elements[`st${i}`].value;
      const ok = Number(value) === correct;
      right += Number(ok);
      form.querySelector(`[data-feedback-for="st${i}"]`).textContent = `${ok ? 'Richtig.' : 'Noch nicht richtig.'} ${feedback}`;
    });
    $('#st-result').textContent = `${right} von ${showTell.length} Behauptungen in eine Szene übersetzt.`;
  };
}

function wireStoryboard() {
  $('#sb-check').onclick = () => {
    let right = 0;
    storyboard.forEach(({ answer, why }, i) => {
      const chosen = content.querySelector(`input[name="sb${i}"]:checked`)?.value;
      const note = $(`#sb${i}-note`);
      const figure = $(`#sb${i}-img`);
      if (!chosen) { note.textContent = 'Wählen Sie eine Einstellungsgröße.'; return; }
      const ok = chosen === answer;
      right += Number(ok);
      const [, name] = shotSizes.find(([key]) => key === chosen);
      const [, correctName] = shotSizes.find(([key]) => key === answer);
      note.textContent = ok ? `Passend. ${why}` : `${name} ${shotSizes.find(([key]) => key === chosen)[2]}. Für diese Aufgabe passt ${correctName} besser. ${why}`;
      figure.hidden = false;
    });
    $('#sb-result').textContent = `${right} von ${storyboard.length} Einstellungen passen zur erzählerischen Aufgabe. Unter jedem Panel sehen Sie jetzt ein Beispielbild.`;
  };
}

const curveStations = [
  ['Ausgangslage', 'Mira bereitet das Modell für die Präsentation vor.'],
  ['Auslöser', 'Der Regen weicht die Pfeiler auf.'],
  ['Steigende Handlung', 'Der Klebeversuch scheitert, beim Belastungstest reißt die Verbindung.'],
  ['Höhepunkt', 'Mira entscheidet sich, ihr Team um Hilfe zu bitten.'],
  ['Fallende Handlung', 'Das Team repariert das Modell gemeinsam unter Zeitdruck.'],
  ['Auflösung', 'Das Team präsentiert die gemeinsame Reparatur.']
];
const curvePresets = {
  flach: ['Flache Kurve', [4, 4, 5, 5, 5, 4]],
  frueh: ['Zu früher Höhepunkt', [2, 9, 7, 6, 4, 3]],
  klassisch: ['Klassischer Bogen', [2, 4, 6, 9, 5, 3]]
};
const curveX = (i) => 60 + i * 100;
const curveY = (v) => 260 - v * 23;
function curvePath(values) {
  const pts = values.map((v, i) => [curveX(i), curveY(v)]);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1.map(Math.round)},${c2.map(Math.round)},${p2}`;
  }
  return d;
}
function curveFeedback(v) {
  const [start, trigger, rising, climax, falling, end] = v;
  const max = Math.max(...v);
  const first = v.indexOf(max);
  const notes = [];
  if (max - Math.min(...v) <= 2) notes.push('Die Kurve bleibt fast flach. Wo steht für Mira etwas auf dem Spiel? Ein Rückschlag oder eine knappe Frist kann zeigen, dass der Ausgang offen ist.');
  else {
    if (start >= trigger) notes.push('Die Ausgangslage ist schon so angespannt wie der Auslöser. Ein ruhigerer Alltag am Anfang macht die Störung erst sichtbar.');
    if (first < 3 && max > climax) notes.push(`Der höchste Punkt liegt bei „${curveStations[first][0]}“, noch vor Miras Entscheidung. Was soll danach noch wichtiger werden? Hat die Entscheidung weniger Gewicht als das, was davor geschah, wirkt das Ende schwächer.`);
    if (rising < trigger) notes.push('Nach dem Auslöser sinkt die Spannung. Ein gescheiterter Versuch sollte die Lage verschärfen, sonst wirkt die Mitte wie eine Pause.');
    if (falling > climax) notes.push('Nach der Entscheidung steigt die Spannung weiter. Dann ist die fallende Handlung eigentlich ein neuer Höhepunkt. Prüfen Sie, welche Szene die zentrale Entscheidung enthält.');
    if (end > climax) notes.push('Das Ende liegt höher als der Höhepunkt. So entsteht ein offenes Ende oder ein Cliffhanger. Ist das gewollt?');
    else if (end >= falling && falling < climax) notes.push('Die Auflösung ist angespannter als die fallende Handlung. Das Publikum bekommt kaum Zeit, die Folgen der Entscheidung zu verarbeiten.');
  }
  if (!notes.length) notes.push('Die Spannung steigt bis zu Miras Entscheidung und fällt danach ab. Das Publikum erlebt den Höhepunkt dort, wo die wichtigste Wahl fällt. Prüfen Sie im Test mit Publikum, ob die Erwartung tatsächlich entsteht.');
  return notes;
}
function wireCurve() {
  const inputs = curveStations.map((_, i) => $(`#curve-${i}`));
  let reference = null;
  const values = () => inputs.map((input) => Number(input.value));
  const dots = (v) => v.map((value, i) => `<circle cx="${curveX(i)}" cy="${curveY(value)}" r="7"${i === 3 ? ' class="is-climax"' : ''}/>`).join('');
  function draw() {
    const v = values();
    inputs.forEach((input, i) => {
      $(`#curve-${i}-v`).textContent = `${v[i]}/10`;
      input.setAttribute('aria-valuetext', `${curveStations[i][0]}: ${v[i]} von 10`);
    });
    $('#curve-line').setAttribute('d', curvePath(v));
    $('#curve-dots').innerHTML = dots(v);
    $('#curve-feedback').innerHTML = curveFeedback(v).map((note) => `<p>${note}</p>`).join('');
    const preset = Object.entries(curvePresets).find(([, [, p]]) => p.every((x, i) => x === v[i]))?.[0];
    $('#curve-presets').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.preset === preset)));
  }
  inputs.forEach((input) => { input.addEventListener('input', () => { draw(); setTimeout(draw, 0); }); });
  $('#curve-presets').onclick = (event) => {
    const button = event.target.closest('[data-preset]');
    if (!button) return;
    curvePresets[button.dataset.preset][1].forEach((value, i) => { inputs[i].value = value; });
    draw();
  };
  $('#curve-keep').onclick = () => {
    reference = values();
    const ref = $('#curve-ref');
    ref.setAttribute('d', curvePath(reference));
    ref.removeAttribute('hidden');
    $('#curve-keep').textContent = 'Kurve A ersetzen';
    $('#curve-clear').hidden = false;
    $('#curve-legend').hidden = false;
  };
  $('#curve-clear').onclick = () => {
    reference = null;
    $('#curve-ref').setAttribute('hidden', '');
    $('#curve-keep').textContent = 'Kurve A merken';
    $('#curve-clear').hidden = true;
    $('#curve-legend').hidden = true;
    $('#curve-keep').focus();
  };
  draw();
}

function wireMedia() {
  const previews = {
    film: 'Kurzfilm · Mira zeigt den reparierten Entwurf. Ein Foto der ersten Skizze am Abspann führt optional ins Web-Labor.',
    audio: 'Audionotiz · Samir erzählt, warum er die Werkstatt verlassen hat. Eine kurze Einleitung nennt Team, Modell und Termin. Ein Link führt zur späteren Entscheidung im Film.',
    web: 'Web-Labor · Das Publikum erprobt drei Lastverteilungen und entdeckt, welche Skizze die Reparatur inspiriert hat. Der Kontext steht am Einstieg. Eine Verknüpfung führt zu Samirs Notiz.'
  };
  const options = $('#media-options');
  function select(medium) {
    $('#media-preview').textContent = previews[medium];
    options.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.medium === medium));
    });
  }
  options.onclick = (event) => {
    const button = event.target.closest('[data-medium]');
    if (button) select(button.dataset.medium);
  };
  select('film');
}

function wireQuiz() {
  $('#quiz-form').onsubmit = (event) => {
    event.preventDefault();
    const values = new FormData(event.target);
    let score = 0;
    questions.forEach(([, , correct, feedback], index) => {
      const key = `q${index}`;
      const right = Number(values.get(key)) === correct;
      score += Number(right);
      $(`[data-feedback-for="${key}"]`).textContent = `${right ? 'Richtig.' : 'Noch nicht richtig.'} ${feedback}`;
    });
    const result = $('#quiz-result');
    result.textContent = `${score} von ${questions.length} Antworten richtig.`;
    result.focus();
  };
}

function exportDrafts() {
  const sections = lessons.flatMap(({ id, title }) => {
    const entries = Object.entries(drafts).filter(([key, value]) => (key === id || key.startsWith(id + ':')) && value.trim());
    if (!entries.length) return [];
    return [title + '\n' + entries.sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => {
      const [, first, second] = key.split(':');
      if (id === 'bild' && first !== undefined) return `${frames[first]}\n${value}`;
      if (id === 'transmedia') return `Beitrag ${Number(first) + 1} · ${mediaFields[second]}\n${value}`;
      return value;
    }).join('\n\n')];
  });
  if (!sections.length) {
    $('#export-status').textContent = 'Es sind noch keine Entwürfe vorhanden.';
    return;
  }
  downloadText(sections.join('\n\n'), 'mein-storytelling-entwurf.txt');
}

function downloadText(text, filename) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function wireSpine() {
  const fields = [...document.querySelectorAll('#spine-fields [data-draft]')];
  const button = $('#spine-export');
  const refresh = () => {
    button.disabled = !fields.some((field) => field.value.trim());
  };
  for (const field of fields) {
    field.value = drafts[field.dataset.draft] || '';
    field.addEventListener('input', () => {
      drafts[field.dataset.draft] = field.value;
      save();
      refresh();
    });
  }
  refresh();
  $('#spine-examples').onclick = (event) => {
    const trigger = event.target.closest('[data-example]');
    if (!trigger) return;
    const example = spineExamples.find(({ id }) => id === trigger.dataset.example);
    if (fields.some((field) => field.value.trim()) && !window.confirm('Ihr bisheriger Entwurf wird durch das Beispiel ersetzt. Fortfahren?')) return;
    for (const field of fields) {
      const key = field.dataset.draft.split(':')[1];
      field.value = example.values[key] || '';
      drafts[field.dataset.draft] = field.value;
    }
    save();
    refresh();
    $('#spine-example-status').textContent = `Beispiel geladen: ${example.label}. Ersetzen Sie die fiktiven Angaben durch Ihr eigenes Projekt.`;
  };
  button.onclick = () => {
    const title = drafts['baukasten:titel']?.trim().replace(/\s+/g, ' ') || 'Meine UX-Fallstudie';
    const sections = spineFields.map(({ id, label }) => {
      const value = drafts[`baukasten:${id}`]?.trim();
      return value ? `## ${label}\n\n${value}` : '';
    }).filter(Boolean);
    downloadText([`# ${title}`, ...sections].join('\n\n') + '\n', 'meine-ux-fallstudie.md');
  };
}

function wireLisa() {
  const out = $('#lisa-out');
  const show = (mode) => {
    out.innerHTML = mode === 'story' ? `<p class="story-lisa-story">${lisa.story}</p>` : `<ul>${lisa.features.map((f) => `<li>${f}</li>`).join('')}</ul>`;
    $('#lisa-toggle').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lisa === mode)));
  };
  $('#lisa-toggle').onclick = (event) => { const b = event.target.closest('[data-lisa]'); if (b) show(b.dataset.lisa); };
  show('features');
}

function route(focus = false) {
  const hash = location.hash.slice(1);
  if (hash === 'main' && content.firstElementChild) return;
  const legacy = /^ue-([1-6])$/.exec(hash);
  const id = legacy ? legacyIds[Number(legacy[1]) - 1] : hash;
  const page = pages.find((entry) => entry.id === id) || pages[0];
  const index = lessons.indexOf(page);
  const prev = pages[pages.indexOf(page) - 1];
  const next = pages[pages.indexOf(page) + 1];
  const pager = (item, direction) => item
    ? `<a class="pager-${direction}" href="#${item.id}"><small>${direction === 'prev' ? '← Zurück' : 'Weiter →'}</small><b>${item.title}</b></a>`
    : '<span></span>';

  content.innerHTML = page.id === 'home' ? overview() : `<article class="content-card">
    <div class="content-head"><a class="sidebar-header" href="#home"><span class="sidebar-logo">ST</span><span class="sidebar-brand">
      <span class="sidebar-brand-name">Storytelling</span><span class="sidebar-brand-subtitle">09 · Lernmodul</span>
    </span></a></div>
    ${index < 0 ? references[page.id] : lessonContent(page, index)}
    <nav class="pager" aria-label="Lektionen blättern">${pager(prev, 'prev')}${pager(next, 'next')}</nav></article>`;

  sidebar.querySelectorAll('.nav-item').forEach((link) => {
    const linkId = link.hash.slice(1);
    const active = linkId === page.id;
    link.classList.toggle('active', active);
    link.classList.toggle('story-done', Boolean(done[linkId]));
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = page.id === 'home' ? 'Storytelling · Lernmodul 09' : `${page.title} · Storytelling`;
  setMenu(false);
  if (index >= 0) wireLesson(page);
  if (page.id === 'quiz') wireQuiz();
  if (page.id === 'werkzeuge') $('#export').onclick = exportDrafts;
  if (page.id === 'baukasten') wireSpine();
  if (page.id === 'einleitung') wireLisa();
  if (focus) {
    const heading = content.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}
window.addEventListener('hashchange', () => route(true));
sidebar.addEventListener('click', (event) => {
  if (event.target.closest('[aria-current="page"]') && document.body.classList.contains('nav-open')) {
    event.preventDefault();
    setMenu(false);
    content.querySelector('h1').setAttribute('tabindex', '-1');
    content.querySelector('h1').focus();
  }
});
route();
