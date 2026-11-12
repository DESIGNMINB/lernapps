/* Eigene Schemazeichnungen als SVG. Farben über CSS-Klassen (sc-d-*), damit der Dunkelmodus greift. */
const phone = (x, y, w = 92, h = 168) => `<rect class="sc-d-line" x="${x}" y="${y}" width="${w}" height="${h}" rx="12"/>`;
const arrow = (x1, y1, x2, y2) => `<line class="sc-d-arrow" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#sc-ah)"/>`;
const defs = '<defs><marker id="sc-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="sc-d-ink"/></marker></defs>';
const label = (x, y, t, cls = 'sc-d-text') => `<text class="${cls}" x="${x}" y="${y}" text-anchor="middle">${t}</text>`;

export const diagramme = {
  muster: {
    caption: 'Die fünf Grundmuster des Scrollytellings, schematisch auf dem Smartphone. Die Pfeile zeigen die Bewegung beim Scrollen.',
    alt: 'Fünf Smartphone-Skizzen nebeneinander: stehende Grafik mit vorbeiziehenden Textkarten, eine einblendende Karte, drei unterschiedlich schnelle Ebenen, ein sich füllender Fortschrittsbalken und ein seitwärts laufender Streifen.',
    svg: `<svg viewBox="0 0 640 250" role="img">${defs}
      ${phone(14, 20)}<rect class="sc-d-accent" x="24" y="32" width="72" height="56" rx="6"/><rect class="sc-d-soft" x="30" y="100" width="60" height="26" rx="4"/><rect class="sc-d-soft" x="30" y="134" width="60" height="26" rx="4"/>${arrow(104, 150, 104, 104)}${label(60, 212, 'Sticky-Grafik')}
      ${phone(140, 20)}<rect class="sc-d-soft" x="152" y="40" width="68" height="34" rx="4"/><rect class="sc-d-accent sc-d-fade" x="152" y="96" width="68" height="40" rx="4"/>${arrow(186, 160, 186, 142)}${label(186, 212, 'Einblenden')}
      ${phone(266, 20)}<rect class="sc-d-soft" x="276" y="36" width="72" height="28" rx="4"/><rect class="sc-d-mid" x="276" y="80" width="72" height="32" rx="4"/><rect class="sc-d-accent" x="276" y="128" width="72" height="40" rx="4"/>${arrow(356, 56, 356, 46)}${arrow(356, 104, 356, 84)}${arrow(356, 166, 356, 132)}${label(312, 212, 'Parallax')}
      ${phone(392, 20)}<rect class="sc-d-soft" x="404" y="96" width="68" height="12" rx="6"/><rect class="sc-d-accent" x="404" y="96" width="40" height="12" rx="6"/><circle class="sc-d-accent" cx="438" cy="60" r="18"/>${arrow(444, 130, 466, 130)}${label(438, 212, 'Scrubbing')}
      ${phone(518, 20)}<rect class="sc-d-soft" x="508" y="86" width="40" height="40" rx="4"/><rect class="sc-d-accent" x="552" y="86" width="40" height="40" rx="4"/><rect class="sc-d-soft" x="596" y="86" width="40" height="40" rx="4"/>${arrow(600, 150, 560, 150)}${label(564, 212, 'Horizontal, Sprung')}
    </svg>`
  },
  storyboard: {
    caption: 'Ein Scroll-Storyboard als Streifen: Jeder Schritt hat Text, Bild und ein Verhalten beim Scrollen. Ruhepunkte gehören dazu.',
    alt: 'Fünf Kästen in einer Reihe, verbunden durch Pfeile, beschriftet mit Einstieg, Weg, Wendepunkt, Höhepunkt und Ruhepunkt; darunter je ein Kürzel für das Muster.',
    svg: `<svg viewBox="0 0 640 200" role="img">${defs}
      ${['Einstieg|Parallax', 'Weg|Sticky', 'Wendepunkt|Einblenden', 'Höhepunkt|Zähler', 'Ruhepunkt|keine Bewegung'].map((t, i) => {
        const [a, b] = t.split('|'); const x = 10 + i * 128;
        return `<rect class="${i === 3 ? 'sc-d-accent' : 'sc-d-soft'}" x="${x}" y="30" width="104" height="90" rx="8"/>${label(x + 52, 70, a, i === 3 ? 'sc-d-text sc-d-on' : 'sc-d-text')}${label(x + 52, 92, `Schritt ${i + 1}`, i === 3 ? 'sc-d-small sc-d-on' : 'sc-d-small')}${label(x + 52, 150, b, 'sc-d-small')}${i < 4 ? arrow(x + 106, 75, x + 126, 75) : ''}`;
      }).join('')}
    </svg>`
  },
  position: {
    caption: 'Scroll behavior in Figma Design: Der Geräte-Frame ist so hoch wie der Bildschirm, die Seite darin ist länger. Fixed bleibt immer stehen, Sticky erst ab dem oberen Rand.',
    alt: 'Links ein langer Seitenstreifen, davon ist ein Teil als Bildschirm markiert. Rechts drei Beschriftungen: Navigation mit Fixed am oberen Rand, eine Überschrift mit Sticky, die am Rand stehen bleibt, und normale Inhalte mit Scroll with parent.',
    svg: `<svg viewBox="0 0 640 300" role="img">${defs}
      <rect class="sc-d-soft" x="40" y="10" width="150" height="280" rx="8"/>
      <rect class="sc-d-frame" x="30" y="70" width="170" height="150" rx="14"/>
      <rect class="sc-d-accent" x="40" y="76" width="150" height="16" rx="3"/>
      <rect class="sc-d-mid" x="40" y="96" width="150" height="20" rx="3"/>
      <rect class="sc-d-line" x="52" y="130" width="126" height="18" rx="3"/><rect class="sc-d-line" x="52" y="156" width="100" height="18" rx="3"/><rect class="sc-d-line" x="52" y="236" width="126" height="18" rx="3"/>
      ${arrow(212, 145, 212, 105)}
      ${label(118, 64, 'sichtbarer Bildschirm', 'sc-d-small')}
      <text class="sc-d-text" x="250" y="88">Fixed: bleibt immer oben (Navigation)</text>
      <text class="sc-d-text" x="250" y="112">Sticky: scrollt mit, bleibt dann am oberen Rand</text>
      <text class="sc-d-text" x="250" y="150">Scroll with parent: scrollt normal mit</text>
      <text class="sc-d-small" x="250" y="200">Overflow: Vertical am Geräte-Frame,</text>
      <text class="sc-d-small" x="250" y="220">Inhalt muss über den Frame hinausragen.</text>
    </svg>`
  },
  parallax: {
    caption: 'Parallax: Bei gleichem Scrollweg legen die Ebenen unterschiedlich lange Wege zurück. Je kleiner der Faktor, desto weiter entfernt wirkt die Ebene.',
    alt: 'Drei Ebenen übereinander: Himmel mit Faktor 0,3 und kurzem Pfeil, Berge mit Faktor 0,6 und mittlerem Pfeil, Gras und Text mit Faktor 1,0 und langem Pfeil. Links ein Maßstab „400 px Scrollweg“.',
    svg: `<svg viewBox="0 0 640 260" role="img">${defs}
      <line class="sc-d-line" x1="40" y1="30" x2="40" y2="230"/>${arrow(40, 40, 40, 222)}<text class="sc-d-small" x="52" y="134">400 px Scrollweg</text>
      <rect class="sc-d-soft" x="190" y="30" width="250" height="56" rx="8"/><text class="sc-d-text" x="206" y="63">Hintergrund · Himmel</text>${arrow(470, 40, 470, 70)}<text class="sc-d-text" x="490" y="62">0,3 → 120 px</text>
      <rect class="sc-d-mid" x="190" y="100" width="250" height="56" rx="8"/><text class="sc-d-text" x="206" y="133">Mittelgrund · Berge</text>${arrow(470, 106, 470, 150)}<text class="sc-d-text" x="490" y="133">0,6 → 240 px</text>
      <rect class="sc-d-accent" x="190" y="170" width="250" height="56" rx="8"/><text class="sc-d-text sc-d-on" x="206" y="203">Vordergrund · Gras, Text</text>${arrow(470, 166, 470, 236)}<text class="sc-d-text" x="490" y="203">1,0 → 400 px</text>
    </svg>`
  },
  'sticky-mobil': {
    caption: 'Das Sticky-Muster auf Desktop und Smartphone: Auf breiten Bildschirmen stehen Grafik und Text nebeneinander, auf schmalen bleibt die Grafik oben kleiner stehen und der Text zieht darunter vorbei.',
    alt: 'Links ein breiter Bildschirm mit Grafik links und Textkarten rechts. Rechts ein Smartphone mit kleiner Grafik oben und Textkarten darunter, Pfeile zeigen die Scrollrichtung.',
    svg: `<svg viewBox="0 0 640 260" role="img">${defs}
      <rect class="sc-d-line" x="20" y="20" width="360" height="220" rx="12"/>
      <rect class="sc-d-accent" x="36" y="40" width="170" height="180" rx="8"/>
      <rect class="sc-d-soft" x="226" y="60" width="138" height="54" rx="6"/><rect class="sc-d-soft" x="226" y="140" width="138" height="54" rx="6"/>${arrow(372, 200, 372, 70)}
      ${label(200, 256, 'Desktop: nebeneinander', 'sc-d-small')}
      ${phone(470, 20, 120, 220)}<rect class="sc-d-accent" x="482" y="34" width="96" height="70" rx="6"/>
      <rect class="sc-d-soft" x="486" y="124" width="88" height="40" rx="5"/><rect class="sc-d-soft" x="486" y="176" width="88" height="40" rx="5"/>${arrow(604, 210, 604, 130)}
      ${label(530, 256, 'Smartphone: Grafik oben', 'sc-d-small')}
    </svg>`
  }
};
