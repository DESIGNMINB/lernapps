import { chapters, ebenen, mikro, meldungen, sensoren, chat, galerie } from './kapitel.js?v=1';
import { terms, quiz, literature } from './wissen.js?v=1';
import { momente, checkliste } from './uebungen.js?v=1';
import { zustaende, toene, texte, band, regeln } from './labor.js?v=1';
import { bilder } from './bilder.js?v=1';
import { diagramme } from './diagramme.js?v=1';
import { makeDocx } from './docx.js?v=1';

/* Modulnummer an einer Stelle (Übersicht, Titel, Exporte) */
const MODUL = '13';
const NAME = 'Emotional Design & Affective Computing';
const KURZ = 'ED';

const $ = (s) => document.querySelector(s);
const content = $('#fu-content');
const sidebar = $('#sidebar');
const menu = $('.menu-btn');
const storageKey = 'emotional-design:v1';
const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = (n) => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(1).replace('.', ',');

/* Timer und Animationen der aktuellen Seite, beim Seitenwechsel aufräumen */
let cleanups = [];
const later = (fn, ms) => { const id = setTimeout(fn, ms); cleanups.push(() => clearTimeout(id)); return id; };
function cleanup() { cleanups.forEach((f) => f()); cleanups = []; }

/* Seiten in der Reihenfolge der sieben Teile */
const ch = (id) => chapters.find((c) => c.id === id);
const pages = [
  { id: 'home', title: 'Übersicht', icon: 'grid' },
  { ...ch('emotionen'), teil: 1, art: 'kapitel' },
  { id: 'u-circumplex', teil: 1, art: 'uebung', period: 'Teil 1 · Übung', title: 'Momente im Circumplex', subtitle: 'Acht Interface-Momente nach Valenz und Arousal verorten, per Ziehen oder mit den Pfeiltasten', icon: 'target' },
  { ...ch('joy'), teil: 2, art: 'kapitel' },
  { ...ch('handwerk'), teil: 3, art: 'kapitel' },
  { ...ch('affective'), teil: 4, art: 'kapitel' },
  { id: 'u-labor', teil: 5, art: 'uebung', period: 'Teil 5 · Labor', title: 'Labor: das adaptive Mischpult', subtitle: 'Zustand der Nutzenden simulieren und Tonalität, Farbtemperatur und Kinetik eines Checkouts in Echtzeit anpassen', icon: 'lab' },
  { ...ch('ethik'), teil: 6, art: 'kapitel' },
  { id: 'u-check', teil: 7, art: 'uebung', period: 'Teil 7 · Reflexion', title: 'Ist dieses Feature manipulativ?', subtitle: 'Ein Feature mit zehn Fragen prüfen, Erkenntnisse festhalten und als Word-Dokument oder Markdown exportieren', icon: 'check' },
  { id: 'quiz', teil: 7, art: 'quiz', period: 'Teil 7 · Wissenstest', title: 'Quiz Emotional Design', subtitle: `${quiz.length} Fragen zu Modellen, Design-Ebenen, Emotionserkennung und Ethik`, icon: 'quiz' },
  { id: 'glossar', art: 'wissen', title: 'Glossar', subtitle: `${terms.length} Begriffe von Action Unit bis Valenz`, icon: 'book', chip: 'A–Z' },
  { id: 'literatur', art: 'wissen', title: 'Literatur und Bildnachweis', subtitle: 'Grundlagentexte, Studien, Rechtsquellen und Nachweise', icon: 'book', chip: 'L' }
];
const teilPages = pages.filter((p) => p.teil);
const wissenPages = pages.filter((p) => p.art === 'wissen');
const tiles = { emotionen: { fig: 'circ' }, joy: { tile: 'objekte' }, handwerk: { tile: 'mikro' }, affective: { tile: 'sensoren' }, 'u-labor': { tile: 'mischpult' }, ethik: { tile: 'hoersaal' }, literatur: { tile: 'hero' } };
const chipOf = (p) => p.chip || (p.art === 'uebung' ? `${p.teil}·Ü` : p.art === 'quiz' ? `${p.teil}·?` : `0${p.teil}`);

const icons = {
  grid: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  book: 'M12 6v14M12 6C9 4 6 4 3 5v13c3-1 6-1 9 2 3-3 6-3 9-2V5c-3-1-6-1-9 1Z',
  chapter: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7m-7 4h5',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6',
  tool: 'M14 6a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9a4 4 0 0 0-2-2Z',
  sensor: 'M3 12h4l2-6 4 12 2-6h6',
  target: 'M12 3v18M3 12h18M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4',
  lab: 'M4 21V14M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
  check: 'M4 12l5 5L20 6',
  quiz: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4h.01'
};
const icon = (n) => `<svg class="icon-svg" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${icons[n] || icons.chapter}"/></svg>`;

let stored = {};
try { stored = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
const done = stored.done || {};
const drafts = stored.drafts || {};
const pos = stored.pos || {};
const labor = stored.labor || { zustand: 80, ton: 85, temperatur: 70, kinetik: 85, beruehrt: [] };
const antworten = stored.antworten || {};
function save() { try { localStorage.setItem(storageKey, JSON.stringify({ done, drafts, pos, labor, antworten })); } catch {} }
function markDone(id) { if (!done[id]) { done[id] = true; save(); sidebar.querySelector(`[href="#${id}"]`)?.classList.add('story-done'); } }
function wireDrafts(root = content) { root.querySelectorAll('[data-draft]').forEach((f) => { f.value = drafts[f.dataset.draft] || ''; f.addEventListener('input', () => { drafts[f.dataset.draft] = f.value; save(); }); }); }
const download = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
const announce = (t) => { const r = $('#ed-live'); if (r) { r.textContent = ''; later(() => { r.textContent = t; }, 30); } };

/* ---------- Navigation ---------- */
const navItem = (page, label) => `<a class="nav-item" href="#${page.id}"><span class="nav-icon">${icon(page.icon || 'chapter')}</span>${label || page.title}</a>`;
const navLabel = (p) => p.art === 'uebung' ? `Ü · ${p.title}` : p.art === 'quiz' ? `Quiz` : p.title;
$('#fu-nav').innerHTML = [
  navItem(pages[0]),
  ...[1, 2, 3, 4, 5, 6, 7].flatMap((n) => [`<div class="nav-section-label">Teil ${n}</div>`, ...teilPages.filter((p) => p.teil === n).map((p) => navItem(p, navLabel(p)))]),
  '<div class="nav-section-label">Wissen</div>',
  ...wissenPages.map((p) => navItem(p))
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
const circTile = `<svg viewBox="0 0 320 200"><circle cx="160" cy="100" r="70" class="sc-d-soft"/><line x1="70" y1="100" x2="250" y2="100" class="sc-d-line"/><line x1="160" y1="15" x2="160" y2="185" class="sc-d-line"/>${[[0.8, 0.6], [-0.7, 0.7], [0.6, -0.6], [-0.5, -0.5], [0.2, 0.9]].map(([v, a]) => `<circle cx="${160 + v * 70}" cy="${100 - a * 70}" r="7" class="sc-d-accent"/>`).join('')}</svg>`;
function tileArt(page) {
  const t = tiles[page.id] || {};
  const b = t.tile && bilder[t.tile];
  const badge = done[page.id] ? '<span class="tag-done">Erledigt</span>' : '';
  const art = b ? `<img src="img/${b.file}" alt="" width="${b.w}" height="${b.h}" loading="lazy"><span class="ki-badge" aria-hidden="true">KI-generiert</span>`
    : t.fig === 'circ' ? `<span class="sc-tile-fig" aria-hidden="true">${circTile}</span>`
    : `<span class="dg-tile-icon" aria-hidden="true">${icon(page.icon || 'chapter')}</span>`;
  return `<div class="art${b ? '' : ' art-plain'}">${art}${badge}<span class="chip-num" aria-hidden="true">${chipOf(page)}</span></div>`;
}
const goLabel = (p) => ({ kapitel: 'Kapitel lesen', uebung: p.id === 'u-labor' ? 'Labor öffnen' : 'Übung starten', quiz: 'Quiz starten', wissen: 'Öffnen' })[p.art];
const tile = (page) => `<li><a class="ptile" href="#${page.id}">${tileArt(page)}
  <div class="tile-body"><h3>${page.title}</h3><p>${page.period ? `${page.period} · ` : ''}${page.lead ? page.lead.split('. ')[0] + '.' : page.subtitle}</p><span class="go">${goLabel(page)}</span></div></a></li>`;

/* ---------- Übersicht ---------- */
function overview() {
  const count = teilPages.filter(({ id }) => done[id]).length;
  return `<div class="home">
    <section class="home-hero">
      <div>
        <div class="mod-chip" aria-hidden="true">${KURZ}</div>
        <p class="hero-eyebrow">Lernmodul ${MODUL} · Master Vertiefungsrichtung Medieninformatik</p>
        <h1>${NAME}</h1>
        <p class="hero-lead">Wie Menschen fühlen, wie Interfaces Gefühle wecken und wie Maschinen versuchen, sie zu erkennen: von Ekman und Russell über Normans drei Ebenen und Microinteractions bis zu Emotionserkennung, Bias und den Grenzen, die der AI Act zieht. Im Labor passen Sie ein Interface an den Zustand der Nutzenden an.</p>
        <div class="hero-actions"><div class="hero-cta">
          <a class="btn btn-primary" href="#emotionen">Modul starten <span aria-hidden="true">→</span></a>
          <a class="btn" href="#u-labor">Direkt ins Labor</a>
        </div>
          <a class="btn btn-download" href="downloads/emotional-design-zusammenfassung.pdf" download>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>
            Zusammenfassung als PDF
          </a>
        </div>
        <p class="hero-meta"><span><b>7</b> Teile</span><span><b>${chapters.length}</b> Kapitel</span><span><b>1</b> Labor</span><span><b>2</b> Übungen</span><span><b>${quiz.length}</b> Quizfragen</span><span>ca. <b>4 Std.</b></span></p>
      </div>
      <figure class="hero-media">
        <img src="img/hero.webp" alt="${esc(bilder.hero.alt)}" width="1200" height="896" fetchpriority="high">
        <figcaption class="ki-badge">KI-generiert</figcaption>
      </figure>
    </section>
    <div class="progress-band">
      <label class="label" for="home-progress">Ihr Fortschritt</label>
      <progress id="home-progress" max="${teilPages.length}" value="${count}"></progress>
      <b>${count} / ${teilPages.length} Stationen</b>
    </div>
    <div class="home-section-label"><h2>Sieben Teile</h2><span>Kapitel, Übungen, Labor und Quiz</span></div>
    <ul class="tiles">${teilPages.map(tile).join('')}</ul>
    <div class="home-section-label"><h2>Wissen</h2><span>Nachschlagen</span></div>
    <ul class="tiles">${wissenPages.map(tile).join('')}</ul>
    <p class="footer-note">Lernmodul ${MODUL} · Lern-Apps Gestaltung &amp; UX · Hochschule Karlsruhe, Fakultät IWI · Fotos KI-generiert (Magnific), Schemazeichnungen eigene Darstellung · Sensor-Dashboard vollständig simuliert: keine Kamera, kein Mikrofon, keine Datenerhebung · Rechtliche Hinweise sind eine Lernhilfe, keine Rechtsberatung</p>
  </div>`;
}

const section = (title, body, panel = false, cls = '') => `<section class="story-section${panel ? ' story-panel' : ''}${cls ? ' ' + cls : ''}"><h2>${title}</h2>${body}</section>`;
function table(t) {
  return `<div class="sc-table-wrap" tabindex="0" role="region" aria-label="Tabelle"><table class="sc-table"><thead><tr>${t.head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>
    <tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

/* ---------- Demo: drei Ebenen nach Norman ---------- */
function demoEbenen() {
  return `<div class="ed-levels">
    <div class="ed-switches" role="group" aria-label="Design-Ebenen zuschalten">${ebenen.map((e) => `<button type="button" class="ed-switch" role="switch" aria-checked="false" data-level="${e.id}"><span class="ed-switch-track" aria-hidden="true"><span></span></span>${e.name} <small lang="en">${e.en}</small></button>`).join('')}</div>
    <div class="ed-dash" id="ed-dash" aria-label="Beispiel-Dashboard einer Lern-App" role="region">
      <div class="ed-dash-hero"><span class="ed-dash-illu" aria-hidden="true"></span><div><p class="ed-dash-hi">Lernen</p><p class="ed-dash-sub">3 Aufgaben offen</p></div></div>
      <div class="ed-dash-streak" hidden><span><b>12 Tage in Folge</b> gelernt. Sie sind auf Kurs für Ihr Ziel „Prüfung im Juli“.</span><span class="ed-badge" aria-hidden="true">★</span></div>
      <ul class="ed-dash-tasks">
        <li><span class="ed-task-name">Kapitel 3 lesen</span><button type="button" class="ed-task-btn" data-task="0"><span class="ed-ico" aria-hidden="true">○</span><span class="ed-lbl">Als erledigt markieren</span></button></li>
        <li><span class="ed-task-name">Quiz Typografie</span><button type="button" class="ed-task-btn" data-task="1"><span class="ed-ico" aria-hidden="true">○</span><span class="ed-lbl">Als erledigt markieren</span></button></li>
        <li><span class="ed-task-name">Übung Raster</span><button type="button" class="ed-task-btn" data-task="2"><span class="ed-ico" aria-hidden="true">○</span><span class="ed-lbl">Als erledigt markieren</span></button></li>
      </ul>
      <p class="ed-dash-toast" role="status"></p>
    </div>
    <ul class="ed-level-notes" aria-live="polite">${ebenen.map((e) => `<li data-note="${e.id}"><b>${e.name}:</b> <span>${e.aus}</span></li>`).join('')}</ul>
  </div>`;
}
function wireEbenen() {
  const dash = $('#ed-dash'); if (!dash) return;
  const st = { visceral: false, behavioral: false, reflective: false }, erledigt = [false, false, false];
  const render = () => {
    Object.entries(st).forEach(([k, v]) => dash.classList.toggle(`on-${k}`, v));
    dash.querySelector('.ed-dash-streak').hidden = !st.reflective;
    dash.querySelector('.ed-dash-hi').textContent = st.reflective ? 'Schön, dass Sie wieder da sind' : 'Lernen';
    dash.querySelector('.ed-dash-sub').textContent = `${erledigt.filter((x) => !x).length} Aufgaben offen`;
    dash.querySelectorAll('.ed-task-btn').forEach((b, i) => {
      b.querySelector('.ed-ico').textContent = erledigt[i] && st.behavioral ? '✓' : '○';
      b.classList.toggle('is-done', erledigt[i] && st.behavioral);
      b.querySelector('.ed-lbl').textContent = erledigt[i] && st.behavioral ? 'Erledigt' : 'Als erledigt markieren';
      b.setAttribute('aria-label', st.behavioral ? (erledigt[i] ? `${b.previousElementSibling.textContent}: erledigt, rückgängig machen` : `${b.previousElementSibling.textContent} als erledigt markieren`) : 'Aktion');
    });
    ebenen.forEach((e) => { content.querySelector(`[data-note="${e.id}"] span`).textContent = st[e.id] ? e.an : e.aus; });
  };
  content.querySelectorAll('.ed-switch').forEach((b) => b.onclick = () => { st[b.dataset.level] = !st[b.dataset.level]; b.setAttribute('aria-checked', String(st[b.dataset.level])); render(); });
  dash.querySelectorAll('.ed-task-btn').forEach((b) => b.onclick = () => {
    if (!st.behavioral) return; /* ohne Verhaltensebene: keine sichtbare Wirkung */
    const i = Number(b.dataset.task); erledigt[i] = !erledigt[i]; render();
    dash.querySelector('.ed-dash-toast').textContent = erledigt[i] ? `„${b.previousElementSibling.textContent}“ erledigt. Rückgängig: erneut klicken.` : 'Rückgängig gemacht.';
  });
  render();
}

/* ---------- Demo: Microinteractions ---------- */
const TEILE = ['Auslöser', 'Regeln', 'Feedback', 'Schleifen und Modi'];
function demoMikro() {
  const widget = {
    copy: '<button type="button" class="btn ed-copy" id="mi-copy"><span class="ed-copy-ico" aria-hidden="true">⧉</span><span class="ed-copy-txt">Link kopieren</span></button>',
    fav: '<button type="button" class="ed-fav" id="mi-fav" aria-pressed="false" aria-label="Als Favorit merken"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg></button><span class="ed-fav-n" id="mi-fav-n">41</span>',
    pw: '<label for="mi-pw" class="dg-sr">Beispielpasswort</label><input type="text" id="mi-pw" class="ed-pw" autocomplete="off" spellcheck="false" placeholder="Beispiel eintippen"><div class="ed-meter" aria-hidden="true"><span id="mi-bar"></span></div><p class="ed-pw-txt" id="mi-pw-txt" aria-live="polite">Noch leer. Tippen Sie ein Beispiel, kein echtes Passwort.</p>'
  };
  return `<ul class="ed-mikro">${mikro.map((m) => `<li class="ed-mi"><h3>${m.titel}</h3><div class="ed-mi-stage">${widget[m.id]}</div>
    <dl>${m.teile.map((x, i) => `<dt>${TEILE[i]}</dt><dd>${x}</dd>`).join('')}</dl></li>`).join('')}</ul>`;
}
function wireMikro() {
  const copy = $('#mi-copy'); if (!copy) return;
  copy.onclick = () => {
    copy.classList.add('is-ok'); copy.querySelector('.ed-copy-ico').textContent = '✓'; copy.querySelector('.ed-copy-txt').textContent = 'Kopiert';
    later(() => { copy.classList.remove('is-ok'); copy.querySelector('.ed-copy-ico').textContent = '⧉'; copy.querySelector('.ed-copy-txt').textContent = 'Link kopieren'; }, 2000);
  };
  const fav = $('#mi-fav'), n = $('#mi-fav-n');
  fav.onclick = () => {
    const on = fav.getAttribute('aria-pressed') !== 'true';
    fav.setAttribute('aria-pressed', String(on)); fav.setAttribute('aria-label', on ? 'Favorit entfernen' : 'Als Favorit merken');
    n.textContent = on ? '42' : '41';
    if (on && !reduced()) fav.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(.92)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  };
  const pw = $('#mi-pw'), bar = $('#mi-bar'), txt = $('#mi-pw-txt');
  pw.oninput = () => {
    const v = pw.value, kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(v)).length;
    const s = !v ? 0 : Math.min(4, Math.floor(v.length / 4) + (kinds >= 3 ? 1 : 0));
    const fehlt = [v.length < 12 ? 'mindestens 12 Zeichen' : '', kinds < 3 ? 'Ziffern oder Sonderzeichen' : ''].filter(Boolean);
    bar.style.width = `${s * 25}%`; bar.dataset.s = String(s);
    txt.textContent = !v ? 'Noch leer. Tippen Sie ein Beispiel, kein echtes Passwort.' : `${['Sehr schwach', 'Schwach', 'Mittel', 'Gut', 'Stark'][s]}.${fehlt.length ? ` Noch hilfreich: ${fehlt.join(' und ')}.` : ' Prima.'}`;
  };
}

/* ---------- Demo: Vorher und nachher ---------- */
function demoVorher() {
  return `<div class="fu-ab-actions"><button type="button" class="btn" id="vn-all">Alle umdrehen</button></div>
    <ul class="ed-vn">${meldungen.map(([s, a, b, w], i) => `<li><button type="button" class="ed-vn-card" aria-pressed="false" data-i="${i}">
      <span class="ed-vn-side ed-vn-a"><small>Vorher · ${s}</small><b>${a}</b><i>Umdrehen für die überarbeitete Fassung</i></span>
      <span class="ed-vn-side ed-vn-b"><small>Nachher · ${s}</small><b>${b}</b><i>${w}</i></span></button></li>`).join('')}</ul>`;
}
function wireVorher() {
  const list = content.querySelector('.ed-vn'); if (!list) return;
  list.onclick = (e) => { const b = e.target.closest('.ed-vn-card'); if (b) b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); };
  $('#vn-all').onclick = () => { const all = [...list.querySelectorAll('.ed-vn-card')]; const to = all.some((b) => b.getAttribute('aria-pressed') !== 'true'); all.forEach((b) => b.setAttribute('aria-pressed', String(to))); };
}

/* ---------- Demo: simuliertes Sensor-Dashboard ---------- */
const DAUER = 36, FEHLER = 20;
function signal(id, s, stoer) {
  /* deterministische Kurven 0–1, ohne Zufall */
  const nach = Math.max(0, s - FEHLER), vor = s >= FEHLER;
  const welle = (f, a) => a * Math.sin(s * f) + a * 0.5 * Math.sin(s * f * 2.3 + 1);
  if (id === 'cam') return clamp(0.18 + (s > 13 ? 0.12 : 0) + (vor ? 0.5 * Math.exp(-nach / 9) + 0.12 : 0) - (s > 31 ? 0.25 : 0) + welle(1.1, 0.04));
  if (id === 'text') { const msg = [...chat].reverse().find(([t]) => t <= s); const m = msg ? msg[0] : -1; return clamp(m === 16 ? 0.55 : m === 21 ? 0.35 : m === 26 ? 0.45 : m === 32 ? 0.1 : 0.15); }
  if (id === 'hr') return clamp(0.2 + (vor ? 0.45 * Math.exp(-nach / 12) : 0) + (stoer && s > 5 && s < 18 ? 0.45 * Math.sin(((s - 5) / 13) * Math.PI) : 0) + welle(0.9, 0.03));
  return 0;
}
const clamp = (v) => Math.max(0, Math.min(1, v));
function fusion(aktiv, s, stoer) {
  const act = sensoren.filter((x) => aktiv.includes(x.id));
  if (!act.length) return null;
  const g = act.reduce((a, x) => a + x.gewicht, 0);
  const wert = act.reduce((a, x) => a + x.gewicht * signal(x.id, s, stoer), 0) / g;
  const werte = act.map((x) => signal(x.id, s, stoer));
  const streuung = act.length > 1 ? Math.max(...werte) - Math.min(...werte) : 0.5;
  return { wert, unsicher: Math.min(0.5, 0.12 + streuung * 0.5 + (3 - act.length) * 0.08) };
}
function demoSensoren() {
  return `<div class="ed-sim">
    <p class="ed-sim-flag" role="note"><b>Simulation.</b> Keine Kamera, kein Mikrofon, keine Datenerhebung. Alle Werte sind vorab berechnete Kurven einer erfundenen Person.</p>
    <div class="ed-sim-grid">
      <fieldset class="ed-sim-sensors"><legend>Sensoren</legend>
        ${sensoren.map((x) => `<label class="ed-sens ed-c-${x.farbe}"><input type="checkbox" data-sensor="${x.id}" checked> <span><b>${x.name}</b><small>${x.info}</small></span></label>`).join('')}
        <label class="ed-sens ed-stoer"><input type="checkbox" id="sim-stoer"> <span><b>Störfaktor: Treppe gestiegen</b><small>Die Person kommt in Sekunde 5 bis 18 außer Atem an den Rechner. Der Puls steigt, ohne dass sie frustriert ist.</small></span></label>
      </fieldset>
      <div class="ed-sim-chart">
        <svg viewBox="0 0 560 260" id="sim-svg" role="img" aria-labelledby="sim-desc"></svg>
        <p class="dg-sr" id="sim-desc">Liniendiagramm der simulierten Signale über ${DAUER} Sekunden. Die Werte zum gewählten Zeitpunkt stehen in der Tabelle darunter.</p>
        <div class="ed-sim-time"><label for="sim-t">Zeitpunkt: <output id="sim-t-out">0</output> s</label><input type="range" id="sim-t" min="0" max="${DAUER}" step="1" value="0">
          <button type="button" class="btn" id="sim-play" aria-pressed="false">Abspielen</button></div>
      </div>
    </div>
    <div class="ed-sim-out">
      <div class="ed-sim-index"><p class="ed-sim-label">Frustrations-Index <span class="fu-badge-plain">fiktives Modell, keine Messung</span></p><p class="ed-sim-val" id="sim-val">–</p><div class="ed-sim-bar" aria-hidden="true"><span id="sim-band"></span><span id="sim-mark"></span></div></div>
      <div class="ed-sim-chat"><p class="ed-sim-label">Chat-Nachrichten (vorbereitet)</p><ul id="sim-chat"></ul></div>
    </div>
    <div class="sc-table-wrap" tabindex="0" role="region" aria-label="Werte zum gewählten Zeitpunkt"><table class="sc-table"><thead><tr><th scope="col">Kanal</th><th scope="col">Wert (0 bis 1)</th><th scope="col">Was der Wert nicht weiß</th></tr></thead><tbody id="sim-table"></tbody></table></div>
    <p class="story-result" id="sim-event" role="status"></p>
  </div>`;
}
const GRENZE = { cam: 'Ob gesenkte Brauen Ärger, Konzentration oder Kurzsichtigkeit bedeuten.', text: 'Ob „Super. Echt toll.“ ironisch gemeint ist. Einfache Modelle zählen „super“ und „toll“ als positiv, deshalb bleibt der Wert ab Sekunde 21 zu niedrig.', hr: 'Ob der Puls von Ärger, Treppe, Kaffee oder Vorfreude kommt.' };
function wireSensoren() {
  const svg = $('#sim-svg'); if (!svg) return;
  const slider = $('#sim-t'), play = $('#sim-play'), stoer = $('#sim-stoer');
  const aktiv = () => [...content.querySelectorAll('[data-sensor]')].filter((c) => c.checked).map((c) => c.dataset.sensor);
  const X = (s) => 50 + (s / DAUER) * 490, Y = (v) => 220 - v * 190;
  const line = (fn) => Array.from({ length: DAUER * 4 + 1 }, (_, i) => { const s = i / 4; return `${X(s).toFixed(1)},${Y(fn(s)).toFixed(1)}`; }).join(' ');
  let letztesEreignis = '';
  const draw = () => {
    const s = Number(slider.value), a = aktiv(), st = stoer.checked;
    $('#sim-t-out').textContent = String(s);
    const band = Array.from({ length: DAUER * 2 + 1 }, (_, i) => i / 2).map((t) => [t, fusion(a, t, st)]).filter(([, f]) => f);
    svg.innerHTML = `<line class="sc-d-line" x1="50" y1="220" x2="545" y2="220"/><line class="sc-d-line" x1="50" y1="25" x2="50" y2="220"/>
      <text class="sc-d-small" x="44" y="34" text-anchor="end">1</text><text class="sc-d-small" x="44" y="224" text-anchor="end">0</text>
      <text class="sc-d-small" x="50" y="246">0 s</text><text class="sc-d-small" x="545" y="246" text-anchor="end">${DAUER} s</text>
      <line class="ed-sim-err" x1="${X(FEHLER)}" y1="25" x2="${X(FEHLER)}" y2="220"/><text class="sc-d-small" x="${X(FEHLER) + 6}" y="16">Zahlung abgelehnt</text>
      ${band.length ? `<polygon class="ed-sim-unc" points="${band.map(([t, f]) => `${X(t)},${Y(Math.min(1, f.wert + f.unsicher))}`).join(' ')} ${[...band].reverse().map(([t, f]) => `${X(t)},${Y(Math.max(0, f.wert - f.unsicher))}`).join(' ')}"/>` : ''}
      ${sensoren.filter((x) => a.includes(x.id)).map((x) => `<polyline class="ed-sim-line ed-c-${x.farbe}" points="${line((t) => signal(x.id, t, st))}"/>`).join('')}
      ${band.length ? `<polyline class="ed-sim-fused" points="${line((t) => fusion(a, t, st).wert)}"/>` : ''}
      <line class="ed-sim-now" x1="${X(s)}" y1="25" x2="${X(s)}" y2="220"/>`;
    const f = fusion(a, s, st);
    $('#sim-val').textContent = f ? `${Math.round(f.wert * 100)} von 100, Unsicherheit ± ${Math.round(f.unsicher * 100)}` : 'kein Sensor aktiv';
    $('#sim-band').style.cssText = f ? `left:${Math.max(0, f.wert - f.unsicher) * 100}%;width:${(Math.min(1, f.wert + f.unsicher) - Math.max(0, f.wert - f.unsicher)) * 100}%` : 'width:0';
    $('#sim-mark').style.left = f ? `${f.wert * 100}%` : '-10px';
    $('#sim-chat').innerHTML = chat.filter(([t]) => t <= s).map(([t, m]) => `<li><small>${t} s</small> ${m}</li>`).join('') || '<li class="story-note">Noch keine Nachricht.</li>';
    $('#sim-table').innerHTML = sensoren.map((x) => `<tr><th scope="row">${x.kurz}</th><td>${a.includes(x.id) ? signal(x.id, s, st).toFixed(2).replace('.', ',') : 'aus'}</td><td>${GRENZE[x.id]}</td></tr>`).join('')
      + `<tr><th scope="row">Index</th><td>${f ? `${f.wert.toFixed(2).replace('.', ',')} ± ${f.unsicher.toFixed(2).replace('.', ',')}` : '–'}</td><td>Wie sich die Person wirklich fühlt. Der Index ist eine gewichtete Schätzung.</td></tr>`;
    const ev = s >= FEHLER && s < FEHLER + 3 ? 'Sekunde 20: Die Zahlung wird abgelehnt.' : st && s >= 6 && s <= 12 && a.includes('hr') ? 'Achtung: Der Puls steigt durch die Treppe, der Index zeigt Frust, den es nicht gibt.' : '';
    if (ev !== letztesEreignis) { $('#sim-event').textContent = ev; letztesEreignis = ev; }
  };
  let timer = null;
  const stop = () => { clearInterval(timer); timer = null; play.textContent = 'Abspielen'; play.setAttribute('aria-pressed', 'false'); };
  cleanups.push(() => clearInterval(timer));
  play.onclick = () => {
    if (timer) return stop();
    if (Number(slider.value) >= DAUER) slider.value = '0';
    play.textContent = 'Anhalten'; play.setAttribute('aria-pressed', 'true');
    timer = setInterval(() => { slider.value = String(Number(slider.value) + 1); draw(); if (Number(slider.value) >= DAUER) stop(); }, reduced() ? 1000 : 450);
  };
  slider.oninput = draw;
  content.querySelectorAll('[data-sensor]').forEach((c) => c.onchange = draw);
  stoer.onchange = draw;
  draw();
}

/* ---------- Demo: Fallgalerie ---------- */
function demoGalerie() {
  return `<ul class="ed-gal">${galerie.map((g, i) => `<li class="ed-gal-card"><h3>${g.titel}</h3><p>${g.szene}</p>
    <button type="button" class="btn" aria-expanded="false" aria-controls="gal-${i}" data-reveal="${i}">Auflösung zeigen</button>
    <div class="ed-gal-res" id="gal-${i}" hidden><p class="ed-gal-art">${g.art}</p><p>${g.aufloesung}</p><p class="ed-gal-regel"><b>Regel:</b> ${g.regel}</p></div></li>`).join('')}</ul>`;
}
function wireGalerie() {
  content.querySelectorAll('[data-reveal]').forEach((b) => b.onclick = () => {
    const box = $(`#gal-${b.dataset.reveal}`), open = box.hidden;
    box.hidden = !open; b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Auflösung verbergen' : 'Auflösung zeigen';
    if (open && !reduced()) box.animate([{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'ease-out' });
  });
}

function sectionHtml(s) {
  const imgs = (s.img || []).filter((k) => bilder[k]);
  const demo = { ebenen: demoEbenen, mikro: demoMikro, vorher: demoVorher, sensoren: demoSensoren, galerie: demoGalerie }[s.demo];
  return `<section class="story-section"><h2>${s.h}</h2>
    ${(s.p || []).map((t) => `<p>${t}</p>`).join('')}
    ${s.list ? `<ul>${s.list.map((l) => `<li>${l}</li>`).join('')}</ul>` : ''}
    ${s.table ? table(s.table) : ''}
    ${demo ? demo() : ''}
    ${s.fig ? `<div class="dg-figs">${diagram(s.fig)}</div>` : ''}
    ${imgs.length ? `<div class="dg-figs${imgs.length > 1 ? ' two' : ''}">${imgs.map((k) => figure(k)).join('')}</div>` : ''}
  </section>`;
}
const badge = (p) => `<div class="lektion-badge"><span class="lektion-number">${p.art === 'uebung' ? 'Ü' : p.art === 'quiz' ? '?' : '0' + p.teil}</span><span class="lektion-label">${p.period}</span></div>`;
function chapterPage(c) {
  return `${badge(c)}<h1 class="page-title purple">${c.title}</h1><p class="page-intro">${c.lead}</p>
    <p class="dg-sr" id="ed-live" aria-live="polite"></p>
    ${c.sections.map(sectionHtml).join('')}
    ${c.task ? section(c.task.title, `<p>${c.task.text}</p><div class="story-fields">${c.task.fields.map((f, j) => `<label>${f}<textarea data-draft="${c.id}:${j}" rows="3"></textarea></label>`).join('')}<p class="story-note">Ihre Notizen werden nur in diesem Browser gespeichert.</p></div>`, true) : ''}
    ${section('Zum Merken', `<ul>${c.merke.map((m) => `<li>${m}</li>`).join('')}</ul>
      <label class="dg-done"><input type="checkbox" id="chapter-done"> Kapitel gelesen</label>`, true, 'dg-merke')}`;
}
function wireChapter(c) {
  wireDrafts(); wireEbenen(); wireMikro(); wireVorher(); wireSensoren(); wireGalerie();
  const box = $('#chapter-done');
  box.checked = Boolean(done[c.id]);
  box.onchange = () => { done[c.id] = box.checked; save(); sidebar.querySelector(`[href="#${c.id}"]`)?.classList.toggle('story-done', box.checked); };
}

/* ---------- Übung: Circumplex ---------- */
const quadrant = (v, a) => `${Math.abs(v) < 0.15 ? 'neutral' : v > 0 ? 'angenehm' : 'unangenehm'}, ${Math.abs(a) < 0.15 ? 'mittlere Aktivierung' : a > 0 ? 'aktiviert' : 'ruhig'}`;
function circumplexPage() {
  return section('Verorten Sie die Momente', `<p>Ziehen Sie jede Karte aus dem Stapel auf das Feld. Waagerecht liegt die Valenz (links unangenehm, rechts angenehm), senkrecht das Arousal (unten ruhig, oben aktiviert). Grundlagen in <a href="#emotionen">Teil 1</a>.</p>
    <p class="story-note"><b>Mit der Tastatur:</b> Karte mit Tab wählen, Enter legt sie in die Mitte des Feldes, Pfeiltasten verschieben sie (mit Umschalttaste in größeren Schritten), Entf legt sie zurück in den Stapel.</p>
    <p class="dg-sr" id="ed-live" aria-live="polite"></p>
    <div class="ed-circ">
      <div class="ed-plane" id="circ-plane">
        <span class="ed-ax ed-ax-x" aria-hidden="true"></span><span class="ed-ax ed-ax-y" aria-hidden="true"></span>
        <span class="ed-q ed-q-tl" aria-hidden="true">Stress</span><span class="ed-q ed-q-tr" aria-hidden="true">Begeisterung</span><span class="ed-q ed-q-bl" aria-hidden="true">Niedergeschlagenheit</span><span class="ed-q ed-q-br" aria-hidden="true">Zufriedenheit</span>
        <span class="ed-axl ed-axl-r" aria-hidden="true">angenehm →</span><span class="ed-axl ed-axl-l" aria-hidden="true">← unangenehm</span><span class="ed-axl ed-axl-t" aria-hidden="true">aktiviert ↑</span><span class="ed-axl ed-axl-b" aria-hidden="true">ruhig ↓</span>
      </div>
      <div><h3 class="ed-tray-h">Stapel</h3><ul class="ed-tray" id="circ-tray"></ul></div>
    </div>
    <div class="btn-group"><button type="button" class="btn btn-primary" id="circ-check">Einordnung prüfen</button><button type="button" class="btn" id="circ-reset">Alle zurücklegen</button></div>
    <p class="story-result" id="circ-result" role="status"></p><ul class="ed-circ-fb" id="circ-fb"></ul>`, true)
    + section('Nachgedacht', '<p>Gefühle hängen von Person und Lage ab. Ein Error 500 bei einem Spiel ärgert weniger als bei der Abgabe einer Bewerbung. Wo lagen Sie anders als die Musterlösung, und warum?</p><div class="story-fields"><label>Ihre Begründung<textarea data-draft="u-circumplex:reflexion" rows="3"></textarea></label></div>');
}
function wireCircumplex() {
  const plane = $('#circ-plane'), tray = $('#circ-tray');
  const card = (m, placed) => `<button type="button" class="ed-mcard${placed ? ' is-placed' : ''}" data-m="${m.id}"${placed ? ` title="${esc(m.text)}"` : ''}>${placed ? m.kurz : m.text}</button>`;
  const place = (el, m) => {
    const p = pos[m.id];
    el.style.left = `${50 + p.v * 46}%`; el.style.top = `${50 - p.a * 46}%`;
    el.classList.toggle('is-right', p.v >= 0);
    el.setAttribute('aria-label', `${m.text}. Valenz ${fmt(p.v)}, Arousal ${fmt(p.a)}: ${quadrant(p.v, p.a)}`);
  };
  const render = (focusId) => {
    tray.innerHTML = momente.filter((m) => !pos[m.id]).map((m) => `<li>${card(m)}</li>`).join('') || '<li class="story-note">Alle Karten liegen auf dem Feld.</li>';
    plane.querySelectorAll('.ed-mcard').forEach((e) => e.remove());
    momente.filter((m) => pos[m.id]).forEach((m) => { plane.insertAdjacentHTML('beforeend', card(m, true)); place(plane.lastElementChild, m); });
    content.querySelectorAll('.ed-mcard').forEach(wire);
    if (focusId) content.querySelector(`.ed-mcard[data-m="${focusId}"]`)?.focus();
  };
  const clampP = (x) => Math.max(-1, Math.min(1, Math.round(x * 10) / 10));
  function wire(el) {
    const m = momente.find((x) => x.id === el.dataset.m);
    el.onkeydown = (e) => {
      const step = e.shiftKey ? 0.3 : 0.1, k = e.key;
      if ((k === 'Enter' || k === ' ') && !pos[m.id]) { e.preventDefault(); pos[m.id] = { v: 0, a: 0 }; save(); render(m.id); announce(`${m.text} liegt in der Mitte. Mit den Pfeiltasten verschieben.`); return; }
      if (pos[m.id] && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(k)) {
        e.preventDefault();
        const p = pos[m.id];
        if (k === 'ArrowLeft') p.v = clampP(p.v - step); if (k === 'ArrowRight') p.v = clampP(p.v + step);
        if (k === 'ArrowUp') p.a = clampP(p.a + step); if (k === 'ArrowDown') p.a = clampP(p.a - step);
        save(); place(el, m);
      }
      if ((k === 'Delete' || k === 'Backspace') && pos[m.id]) { e.preventDefault(); delete pos[m.id]; save(); render(); tray.querySelector(`[data-m="${m.id}"]`)?.focus(); announce(`${m.text} liegt wieder im Stapel.`); }
    };
    el.onkeyup = (e) => { if (pos[m.id] && e.key.startsWith('Arrow')) announce(`Valenz ${fmt(pos[m.id].v)}, Arousal ${fmt(pos[m.id].a)}: ${quadrant(pos[m.id].v, pos[m.id].a)}`); };
    el.onpointerdown = (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const start = { x: e.clientX, y: e.clientY }; let moved = false, ghost = null;
      const move = (ev) => {
        if (!moved && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 5) return;
        if (!moved) { moved = true; ghost = el.cloneNode(true); ghost.classList.add('ed-ghost'); ghost.removeAttribute('style'); document.body.appendChild(ghost); el.classList.add('is-drag'); }
        ghost.style.left = `${ev.clientX}px`; ghost.style.top = `${ev.clientY}px`;
        plane.classList.toggle('is-over', inPlane(ev));
      };
      const inPlane = (ev) => { const r = plane.getBoundingClientRect(); return ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom; };
      const up = (ev) => {
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
        plane.classList.remove('is-over'); el.classList.remove('is-drag'); ghost?.remove();
        if (!moved) { if (!pos[m.id]) { pos[m.id] = { v: 0, a: 0 }; save(); render(m.id); announce(`${m.text} liegt in der Mitte.`); } else el.focus(); return; }
        if (inPlane(ev)) {
          const r = plane.getBoundingClientRect();
          pos[m.id] = { v: clampP(((ev.clientX - r.left) / r.width - 0.5) / 0.46), a: clampP((0.5 - (ev.clientY - r.top) / r.height) / 0.46) };
          save(); render(m.id); announce(`${m.text}: ${quadrant(pos[m.id].v, pos[m.id].a)}.`);
        } else if (pos[m.id]) { delete pos[m.id]; save(); render(m.id); }
      };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      cleanups.push(() => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); ghost?.remove(); });
    };
  }
  $('#circ-check').onclick = () => {
    const placed = momente.filter((m) => pos[m.id]);
    let passt = 0;
    $('#circ-fb').innerHTML = momente.map((m) => {
      const p = pos[m.id];
      if (!p) return `<li><b>${m.text}:</b> noch im Stapel.</li>`;
      const d = Math.hypot(p.v - m.v, p.a - m.a), sameV = Math.sign(p.v) === Math.sign(m.v) || Math.abs(p.v) < 0.15, sameA = Math.sign(p.a) === Math.sign(m.a) || Math.abs(p.a) < 0.15;
      const ok = d <= 0.55, knapp = !ok && sameV && sameA; passt += Number(ok);
      return `<li class="${ok ? 'is-ok' : 'is-off'}"><b>${m.text}:</b> ${ok ? 'Passt.' : knapp ? 'Richtiger Bereich, aber etwas weiter weg.' : `Naheliegend wäre: ${quadrant(m.v, m.a)}.`} ${m.why}</li>`;
    }).join('');
    $('#circ-result').textContent = `${passt} von ${momente.length} Karten nah an der Musterlösung, ${placed.length} von ${momente.length} platziert. Die Musterlösung ist eine Einschätzung, keine Wahrheit.`;
    if (placed.length === momente.length && passt >= 5) markDone('u-circumplex');
  };
  $('#circ-reset').onclick = () => { momente.forEach((m) => delete pos[m.id]); save(); render(); $('#circ-fb').innerHTML = ''; $('#circ-result').textContent = ''; announce('Alle Karten liegen wieder im Stapel.'); };
  render();
}

/* ---------- Labor: adaptives Mischpult ---------- */
const REGLER = [
  { id: 'ton', name: 'Tonalität', pole: ['Formell', 'Empathisch', 'Verspielt'] },
  { id: 'temperatur', name: 'Visuelle Temperatur', pole: ['Kühl', 'Warm'] },
  { id: 'kinetik', name: 'Kinetik', pole: ['Statisch', 'Federnd'] }
];
const stufe = (r, v) => r.pole.length === 3 ? r.pole[band(v)] : v <= 33 ? r.pole[0] : v <= 66 ? 'Mittel' : r.pole[1];
function laborPage() {
  return `<div class="dg-figs">${figure('mischpult')}</div>
    <p>Links sehen Sie einen Checkout, rechts das Mischpult. Der erste Regler simuliert, wie es der Person gerade geht. Die drei Regler darunter steuern, wie das Interface antwortet. Passt die Antwort nicht zur Lage, erscheint eine Rückmeldung. Es gibt keine Punkte, nur Begründungen.</p>
    <p class="dg-sr" id="ed-live" aria-live="polite"></p>
    <div class="ed-lab">
      <div class="ed-canvas-wrap"><div class="ed-canvas" id="lab-canvas" role="region" aria-label="Vorschau: Checkout">
        <p class="ed-cv-step">Schritt 3 von 3 · Zahlung</p>
        <h3 id="lab-h"></h3><p id="lab-m"></p>
        <div class="ed-cv-field"><span>Karteninhaberin oder Karteninhaber</span><b>Alex Muster</b></div>
        <div class="ed-cv-field"><span>Kartennummer</span><b>•••• •••• •••• 4242</b></div>
        <button type="button" class="ed-cv-btn" id="lab-btn"></button>
      </div>
      <div class="ed-lab-motion"><button type="button" class="btn" id="lab-replay">Bewegung abspielen</button><p class="story-note" id="lab-motion-note"></p></div></div>
      <div class="ed-panel">
        <fieldset class="fu-ctrl ed-ctrl-in"><legend>Simulierter Zustand der Nutzenden</legend>
          <label for="lab-zustand" class="fu-scale"><span>Entspannt</span><span>Frustriert</span></label>
          <input type="range" id="lab-zustand" min="0" max="100" value="${labor.zustand}" data-reg="zustand">
          <p class="fu-lv-text" id="lab-zustand-txt"></p></fieldset>
        <p class="ed-panel-h">Design-Parameter</p>
        ${REGLER.map((r) => `<fieldset class="fu-ctrl"><legend>${r.name}: <output id="lab-${r.id}-out"></output></legend>
          <label for="lab-${r.id}" class="fu-scale">${r.pole.map((p) => `<span>${p}</span>`).join('')}</label>
          <input type="range" id="lab-${r.id}" min="0" max="100" value="${labor[r.id]}" data-reg="${r.id}"></fieldset>`).join('')}
        <button type="button" class="btn" id="lab-preset">Stimmige Antwort vorschlagen</button>
      </div>
    </div>
    <div id="lab-feedback" aria-live="polite"></div>
    ${section('Wichtiger Hinweis', '<p>Im Labor ist der Zustand der Person bekannt, weil Sie ihn einstellen. In der Wirklichkeit müsste ein System ihn schätzen, etwa mit Emotionserkennung. <a href="#affective">Teil 4</a> zeigt, wie unsicher solche Schätzungen sind, <a href="#ethik">Teil 6</a>, wo sie verboten sind. Ein adaptives Interface kann auch ohne Messung auskommen: Es reagiert auf das, was passiert, etwa auf einen Zahlungsfehler, statt auf das Gesicht der Person.</p>', true)}
    ${section('Reflexion', '<div class="story-fields"><label>Welche Einstellung halten Sie für eine frustrierte Person für richtig, und warum? Woher wüsste Ihr System, dass die Person frustriert ist?<textarea data-draft="u-labor:reflexion" rows="4"></textarea></label></div>')}`;
}
function wireLabor() {
  const cv = $('#lab-canvas'), btn = $('#lab-btn');
  const apply = (animate) => {
    const z = band(labor.zustand), t = band(labor.ton), txt = texte[z][t];
    $('#lab-zustand-txt').textContent = `${zustaende[z].name}: ${zustaende[z].lage}`;
    REGLER.forEach((r) => { $(`#lab-${r.id}-out`).textContent = stufe(r, labor[r.id]); $(`#lab-${r.id}`).setAttribute('aria-valuetext', `${labor[r.id]}: ${stufe(r, labor[r.id])}`); });
    $('#lab-zustand').setAttribute('aria-valuetext', `${labor.zustand}: ${zustaende[z].name}`);
    $('#lab-h').textContent = txt.h; $('#lab-m').textContent = txt.m; btn.textContent = txt.b;
    const w = labor.temperatur / 100;
    cv.style.setProperty('--cv-hue', w < 0.5 ? '215' : '25');
    cv.style.setProperty('--cv-sat', `${Math.round(8 + Math.abs(w - 0.5) * 2 * 52)}%`);
    cv.style.setProperty('--cv-radius', `${Math.round(2 + w * 18)}px`);
    cv.classList.toggle('is-error', z === 2);
    const k = labor.kinetik;
    $('#lab-motion-note').textContent = reduced()
      ? `Ihr System bevorzugt reduzierte Bewegung, daher wird nichts animiert. Eingestellt: ${k <= 33 ? 'keine Bewegung, Inhalte erscheinen sofort' : k <= 66 ? 'kurzes, gleichmäßiges Einblenden (Tween, etwa 200 ms)' : 'federndes Einblenden mit Überschwingen (Spring, etwa 600 ms)'}.`
      : `Kinetik: ${k <= 33 ? 'statisch, keine Bewegung' : k <= 66 ? 'Tween, gleichmäßig und kurz' : 'Spring, federnd mit Überschwingen'}.`;
    const s = { ...labor };
    const fb = regeln.filter((r) => r.wenn(s));
    $('#lab-feedback').innerHTML = fb.map((r) => `<div class="${r.typ === 'warn' ? 'fu-warn' : r.typ === 'ok' ? 'ed-ok' : 'ed-hint'}" role="note"><h4>${r.typ === 'warn' ? 'Unpassend: ' : r.typ === 'ok' ? '' : 'Hinweis: '}${r.titel}</h4><p>${r.text}</p></div>`).join('');
    if (animate) play();
  };
  const play = () => {
    if (reduced()) return;
    const k = labor.kinetik;
    if (k <= 33) return;
    const opts = k <= 66 ? { duration: 200, easing: 'ease-out' } : { duration: 620, easing: 'cubic-bezier(.34,1.8,.64,1)' };
    const from = k <= 66 ? { opacity: 0, transform: 'translateY(8px)' } : { opacity: 0, transform: 'translateY(18px) scale(.94)' };
    [$('#lab-h'), $('#lab-m'), btn].forEach((el, i) => el.animate([from, { opacity: 1, transform: 'none' }], { ...opts, delay: i * (k > 66 ? 70 : 30), fill: 'backwards' }));
  };
  let lastAnnounced = '';
  content.querySelectorAll('[data-reg]').forEach((r) => {
    r.oninput = () => {
      labor[r.dataset.reg] = Number(r.value);
      labor.beruehrt = [...new Set([...(labor.beruehrt || []), r.dataset.reg])]; save(); apply(false); check();
    };
    r.onchange = () => {
      apply(true);
      const titel = regeln.filter((x) => x.wenn(labor)).map((x) => x.titel).join(', ');
      if (titel !== lastAnnounced) { announce(titel ? `Rückmeldung: ${titel}.` : 'Keine Rückmeldung.'); lastAnnounced = titel; }
    };
  });
  btn.onclick = () => { if (!reduced() && labor.kinetik > 66) btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)' }); };
  $('#lab-replay').onclick = () => play();
  $('#lab-preset').onclick = () => {
    const z = band(labor.zustand);
    Object.assign(labor, [{ ton: 70, temperatur: 60, kinetik: 55 }, { ton: 50, temperatur: 50, kinetik: 30 }, { ton: 50, temperatur: 55, kinetik: 20 }][z]);
    REGLER.forEach((r) => { $(`#lab-${r.id}`).value = String(labor[r.id]); });
    save(); apply(true); announce('Vorschlag übernommen.');
  };
  const check = () => { if ((labor.beruehrt || []).length >= 4 && (drafts['u-labor:reflexion'] || '').trim().length > 20) markDone('u-labor'); };
  wireDrafts();
  content.querySelector('[data-draft="u-labor:reflexion"]').addEventListener('input', check);
  apply(false);
}

/* ---------- Teil 7: Checkliste und Export ---------- */
function checkPage() {
  return section('Ihr Feature', `<p>Wählen Sie ein Feature, das Sie entwerfen oder aus einer App kennen, etwa eine Streak-Erinnerung, ein Kündigungsdialog oder eine Stimmungsanalyse. Beantworten Sie die zehn Fragen. Die Zusammenfassung unten listet, was Sie prüfen sollten.</p>
    <div class="story-fields"><label>Name des Features<input type="text" data-draft="u-check:feature" placeholder="z. B. Erinnerung an die Lernserie"></label>
    <label>Kurzbeschreibung<textarea data-draft="u-check:beschreibung" rows="2"></textarea></label></div>`, true)
    + section('Ist dieses Feature manipulativ?', `<ol class="ed-check">${checkliste.map((c, i) => `<li><fieldset><legend>${c.q}</legend><div class="ed-check-opts">${['ja', 'nein', 'unklar'].map((o) => `<label><input type="radio" name="ck${i}" value="${o}" ${antworten[i] === o ? 'checked' : ''}> ${o[0].toUpperCase() + o.slice(1)}</label>`).join('')}</div></fieldset></li>`).join('')}</ol>`, true)
    + section('Ihre Erkenntnisse', `<div class="story-fields">${['Was haben Sie über Gefühle im Interface gelernt?', 'Wo ziehen Sie für sich die Grenze zwischen Emotional Design und Manipulation?', 'Was ändern Sie an Ihrem Feature?'].map((f, j) => `<label>${f}<textarea data-draft="u-check:e${j}" rows="3"></textarea></label>`).join('')}</div>`, true)
    + section('Zusammenfassung', `<p class="story-result" id="ck-sum" role="status"></p>
      <div class="btn-group"><button type="button" class="btn btn-download" id="ck-docx">Word-Dokument</button><button type="button" class="btn" id="ck-md">Markdown herunterladen</button></div>
      <p class="ed-md-label">Vorschau in Markdown</p><pre class="ed-md" id="ck-preview" tabindex="0" aria-label="Markdown-Vorschau der Zusammenfassung"></pre>`, true);
}
function checkData() {
  const g = (k) => (drafts[`u-check:${k}`] || '').trim();
  const flags = checkliste.map((c, i) => ({ ...c, a: antworten[i] })).filter((c) => c.a === c.kritisch || c.a === 'unklar');
  return { feature: g('feature') || 'Unbenanntes Feature', beschreibung: g('beschreibung'), flags, beantwortet: Object.keys(antworten).length,
    erkenntnisse: [0, 1, 2].map((j) => g(`e${j}`)) };
}
const E_TITEL = ['Was ich über Gefühle im Interface gelernt habe', 'Meine Grenze zwischen Emotional Design und Manipulation', 'Was ich an meinem Feature ändere'];
function markdown(d) {
  return `# Ist dieses Feature manipulativ? ${d.feature}\n\nLernmodul ${MODUL} · ${NAME} · ${new Date().toLocaleDateString('de-DE')}\n\n${d.beschreibung ? d.beschreibung + '\n\n' : ''}## Checkliste\n\n${checkliste.map((c, i) => `${i + 1}. ${c.q} **${antworten[i] ? antworten[i][0].toUpperCase() + antworten[i].slice(1) : 'Offen'}**`).join('\n')}\n\n## Zu prüfen\n\n${d.flags.length ? d.flags.map((f) => `- ${f.a === 'unklar' ? '(unklar) ' : ''}${f.hinweis}`).join('\n') : '- Keine Auffälligkeiten nach Ihren Antworten.'}\n\n## Erkenntnisse\n\n${E_TITEL.map((t, j) => `### ${t}\n\n${d.erkenntnisse[j] || '–'}`).join('\n\n')}\n\n_Lernhilfe, keine Rechtsberatung._\n`;
}
function wireCheck() {
  wireDrafts();
  const sum = () => {
    const d = checkData();
    $('#ck-sum').textContent = `${d.beantwortet} von ${checkliste.length} Fragen beantwortet. ${d.flags.length ? `${d.flags.length} ${d.flags.length === 1 ? 'Punkt' : 'Punkte'} zu prüfen.` : 'Bisher keine Auffälligkeiten.'}`;
    $('#ck-preview').textContent = markdown(d);
    if (d.beantwortet === checkliste.length && d.erkenntnisse.filter(Boolean).length >= 2) markDone('u-check');
  };
  content.querySelectorAll('.ed-check input').forEach((r) => r.onchange = () => { antworten[Number(r.name.slice(2))] = r.value; save(); sum(); });
  content.firstElementChild.addEventListener('input', sum);
  $('#ck-md').onclick = () => download(new Blob([markdown(checkData())], { type: 'text/markdown;charset=utf-8' }), 'emotional-design-checkliste.md');
  $('#ck-docx').onclick = () => {
    const d = checkData();
    const blocks = [
      { eyebrow: true, text: `LERNMODUL ${MODUL} · ${NAME.toUpperCase()} · CHECKLISTE` },
      { h: 1, text: `Ist dieses Feature manipulativ? ${d.feature}` },
      { meta: true, text: `Erstellt am ${new Date().toLocaleDateString('de-DE')}` },
      ...(d.beschreibung ? [{ text: d.beschreibung }] : []),
      { h: 2, text: 'Checkliste' },
      ...checkliste.map((c, i) => ({ n: i + 1, text: `${c.q} Antwort: ${antworten[i] || 'offen'}` })),
      { h: 2, text: 'Zu prüfen' },
      ...(d.flags.length ? d.flags.map((f) => ({ text: `${f.a === 'unklar' ? '(unklar) ' : ''}${f.hinweis}` })) : [{ text: 'Keine Auffälligkeiten nach Ihren Antworten.' }]),
      { h: 2, text: 'Erkenntnisse' },
      ...E_TITEL.flatMap((t, j) => [{ h: 2, text: t }, { text: d.erkenntnisse[j] }]),
      { meta: true, text: 'Lernhilfe, keine Rechtsberatung.' }
    ];
    download(makeDocx(`Checkliste ${d.feature}`, blocks), 'emotional-design-checkliste.docx');
  };
  sum();
}

function exercisePage(p) {
  const head = `${badge(p)}<h1 class="page-title purple">${p.title}</h1><p class="page-intro">${p.subtitle}.</p>`;
  if (p.id === 'u-circumplex') return head + circumplexPage();
  if (p.id === 'u-labor') return head + laborPage();
  if (p.id === 'u-check') return head + checkPage();
  return head;
}
function wireExercise(p) {
  if (p.id === 'u-circumplex') { wireDrafts(); wireCircumplex(); }
  if (p.id === 'u-labor') wireLabor();
  if (p.id === 'u-check') wireCheck();
}

/* ---------- Wissen ---------- */
function wissenPage(p) {
  const head = `<h1 class="page-title purple">${p.title}</h1>`;
  if (p.id === 'glossar') return head + section('Begriffe zum Nachschlagen', `<dl>${[...terms].sort(([a], [b]) => a.localeCompare(b, 'de')).map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>`, true);
  if (p.id === 'literatur') return head + section('Literatur und Quellen', `<ul class="dg-lit">${literature.map(([a, t, v, y, n, u]) => `<li><b>${a}:</b> ${u ? `<a href="${u}"><cite>${t}</cite></a>` : `<cite>${t}</cite>`}. ${v}, ${y}. <span class="story-note">${n}</span></li>`).join('')}</ul>`, true)
    + section('Bildnachweis', `<p>Alle Fotos sind KI-generierte Stimmungsbilder (Magnific) ohne reale Vorlage und als solche gekennzeichnet. Bewusst gibt es keine Bilder realer Personen mit „erkannten“ Gefühlen. Schemazeichnungen, Dashboard und Diagramme sind eigene Darstellungen.</p>
      <ul class="dg-lit">${Object.values(bilder).map((b) => `<li>${esc(b.caption)}: KI-generiert</li>`).join('')}</ul>`)
    + section('Weitere Module', '<p>Fragebögen wie den UEQ vertiefen Sie in <a href="../ux-evaluation/#messen">UX &amp; Evaluation</a>, Bewegung und Übergänge in <a href="../ux-animation/">UX &amp; Animation</a>, Dark Patterns und spekulative Zukünfte in <a href="../futuring/">Futuring &amp; Critical Design</a>.</p>');
  return head;
}

/* ---------- Quiz ---------- */
function quizPageHtml(p) {
  return `${badge(p)}<h1 class="page-title purple">${p.title}</h1><p class="page-intro">Wählen Sie je Frage eine Antwort. Nach dem Auswerten sehen Sie zu jeder Frage eine Erklärung.</p>
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
  cleanup();
  const page = pages.find((p) => p.id === hash) || pages[0];
  const idx = pages.indexOf(page), prev = pages[idx - 1], next = pages[idx + 1];
  const pager = (item, dir) => item ? `<a class="pager-${dir}" href="#${item.id}"><small>${dir === 'prev' ? '← Zurück' : 'Weiter →'}</small><b>${item.title}</b></a>` : '<span></span>';
  let body;
  if (page.art === 'kapitel') body = chapterPage(page);
  else if (page.art === 'uebung') body = exercisePage(page);
  else if (page.art === 'quiz') body = quizPageHtml(page);
  else body = wissenPage(page);
  content.innerHTML = page.id === 'home' ? overview() : `<article class="content-card">
    <div class="content-head"><a class="sidebar-header" href="#home"><span class="sidebar-logo">${KURZ}</span><span class="sidebar-brand">
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
  if (page.art === 'kapitel') wireChapter(page);
  if (page.art === 'uebung') wireExercise(page);
  if (page.art === 'quiz') wireQuiz();
  if (focus) {
    const h = content.querySelector('h1');
    h.tabIndex = -1; h.focus({ preventScroll: true }); window.scrollTo(0, 0);
  }
}
window.addEventListener('hashchange', () => route(true));
route();
