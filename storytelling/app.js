import { lessons, extraQuestions, terms } from './content.js?v=2';

const $ = (selector) => document.querySelector(selector);
const content = $('#story-content');
const sidebar = $('#sidebar');
const menu = $('.menu-btn');
const storageKey = 'storytelling:v1';
const number = (index) => String(index + 1).padStart(2, '0');
const questions = [...lessons.map((lesson) => lesson.check), ...extraQuestions];
const pages = [
  { id: 'home', title: 'Übersicht', icon: 'grid' },
  { id: 'einleitung', title: 'Einleitung', icon: 'book' },
  ...lessons,
  { id: 'glossar', title: 'Glossar', subtitle: 'Begriffe von Adaption bis Wendepunkt', icon: 'list' },
  { id: 'werkzeuge', title: 'Vorlagen und Literatur', subtitle: 'Arbeitsblätter und Quellen', icon: 'book' },
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
  catch { $('#save-note').textContent = 'Der Browser konnte Ihre Eingaben nicht speichern. Sie können sie über die Vorlagen herunterladen.'; }
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
  ...pages.slice(-3, -1).map((page) => navItem(page)),
  '<div class="nav-section-label">Wissenstest</div>',
  navItem(pages.at(-1))
].join('');

function tile(page, chip, label) {
  const badge = done[page.id] ? '<span class="tag-done">Erledigt</span>' : '';
  return `<li><a class="ptile" href="#${page.id}">
    <div class="art"><img src="img/fotos/${page.id}.jpg" alt="" width="800" height="500" loading="lazy">${badge}<span class="chip-num" aria-hidden="true">${chip}</span></div>
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
          <a class="btn btn-download" href="downloads/storytelling-arbeitsblatt.pdf" download>
            <span aria-hidden="true">↓</span> Arbeitsblatt als PDF herunterladen
          </a>
        </div>
        <p class="hero-meta"><span><b>8</b> Laborübungen</span><span><b>2</b> Referenzen</span><span><b>${questions.length}</b> Quizfragen</span><span>ca. <b>3 Std.</b></span></p>
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
    <ul class="tiles">${tile(pages.at(-3), 'A–Z', 'Öffnen')}${tile(pages.at(-2), 'V', 'Öffnen')}</ul>
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
  if (id === 'spannung') return `<figure class="story-panel">
    <h3>Spannungskurve</h3>
    <svg viewBox="0 0 620 220" role="img" aria-label="Beabsichtigte Spannung im Erzählverlauf"><path d="M35 20v165h555" fill="none" stroke="currentColor"/><polyline id="curve" fill="none" stroke="#9254D1" stroke-width="5"/><text x="45" y="30" fill="currentColor">Spannung</text><text x="220" y="215" fill="currentColor">Erzählverlauf →</text></svg>
    <div class="story-controls"><label>Rückschlag <output id="setback-value"></output><input id="setback" type="range" min="1" max="10" value="6"></label>
    <label>Entscheidung <output id="peak-value"></output><input id="peak" type="range" min="1" max="10" value="9"></label></div>
    <figcaption>Skala von 1 bis 10. Die beiden Regler verändern die Höhe der mittleren Punkte.</figcaption>
  </figure>`;
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
    ${section('Ausprobieren', `${practice(lesson.id)}<form id="mini-check">${question(lesson.check, 'probe')}
      <button class="btn" type="submit">Antwort prüfen</button><p class="story-result" id="mini-result" role="status"></p></form>`)}
    ${section('Ihre Aufgabe', `<p>${lesson.task}</p>${fields(lesson)}`, true)}`;
}

const references = {
  einleitung: `<h1 class="page-title purple">Einleitung</h1><p class="page-intro">Storytelling organisiert Informationen so, dass ein Publikum einer Veränderung folgen kann. Die acht Labore bauen von der ersten Idee bis zur Umsetzung in mehreren Medien aufeinander auf.</p>
    ${section('So arbeiten Sie mit dem Modul', '<ol><li>Lesen Sie Lernziele, Grundlagen und das Fallbeispiel.</li><li>Probieren Sie das Beispiel aus und prüfen Sie Ihr Verständnis mit der Kontrollfrage.</li><li>Wenden Sie das Gelernte auf eine eigene Geschichte an. Nutzen Sie die Hinweise für Ihre Selbstprüfung.</li><li>Überprüfen Sie Ihr Wissen im Quiz und verwenden Sie die Vorlagen für ein eigenes Projekt.</li></ol>', true)}
    ${section('Das Fallbeispiel', '<p>Mira und ihr Team möchten an der Hochschule ein Brückenmodell präsentieren. Auf dem Weg in die Werkstatt wird das Modell beschädigt. An diesem Beispiel sehen Sie, wie Ursache, Konflikt, Perspektive und Medienwahl die Wirkung derselben Ausgangslage verändern.</p>')}
    ${section('Ihr eigener Entwurf', '<p>Wählen Sie eine kleine Situation mit einer klaren Entscheidung. Eine Präsentation, ein verpasster Anschluss oder eine unerwartete Nachricht genügen. Entwickeln Sie denselben Entwurf von Labor zu Labor weiter.</p>')}`,
  glossar: `<h1 class="page-title purple">Glossar</h1>${section('Begriffe zum Nachschlagen', `<dl>${terms.map(([term, definition]) => `<dt>${term}</dt><dd>${definition}</dd>`).join('')}</dl>`, true)}`,
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
  if (id === 'struktur') wireOrder();
  if (id === 'spannung') wireCurve();
  if (id === 'transmedia') wireMedia();
}

function wireOrder() {
  const order = [3, 1, 5, 0, 4, 2];
  const list = $('#beat-order');
  function render(focusIndex, delta) {
    list.innerHTML = order.map((beat, i) => `<li>${beats[beat]}
      <button type="button" class="btn" data-index="${i}" data-step="-1" aria-label="Szene ${i + 1} nach oben" ${i === 0 ? 'disabled' : ''}>↑</button>
      <button type="button" class="btn" data-index="${i}" data-step="1" aria-label="Szene ${i + 1} nach unten" ${i === order.length - 1 ? 'disabled' : ''}>↓</button></li>`).join('');
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
    $('#order-result').textContent = `Szene auf Position ${next + 1} verschoben.`;
    render(next, delta);
  };
  $('#order-check').onclick = () => {
    const mismatch = order.findIndex((beat, i) => beat !== i);
    $('#order-result').textContent = mismatch < 0
      ? 'Richtig. Jeder Schritt bereitet die nächste Entscheidung vor.'
      : `Prüfen Sie ab Position ${mismatch + 1}: Was muss geschehen, bevor die nächste Szene plausibel wird?`;
  };
  render();
}

function wireCurve() {
  const setback = $('#setback');
  const peak = $('#peak');
  function draw() {
    $('#setback-value').textContent = `${setback.value}/10`;
    $('#peak-value').textContent = `${peak.value}/10`;
    $('#curve').setAttribute('points', `35,170 145,145 285,${180 - setback.value * 14} 435,${180 - peak.value * 14} 580,150`);
  }
  setback.oninput = draw;
  peak.oninput = draw;
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
  const url = URL.createObjectURL(new Blob([sections.join('\n\n')], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mein-storytelling-entwurf.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
