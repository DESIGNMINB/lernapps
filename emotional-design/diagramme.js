/* Eigene Schemazeichnungen als SVG. Farben über CSS-Klassen, damit der Dunkelmodus greift. */
const defs = '<defs><marker id="ed-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="sc-d-ink"/></marker></defs>';
const t = (x, y, s, cls = 'sc-d-text', anchor = 'middle') => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;

/* Russell (1980): acht Kernbegriffe auf dem Kreis, 0° = angenehm */
const russell = [[0, 'Wohlbehagen'], [45, 'Begeisterung'], [90, 'Erregung'], [135, 'Stress'], [180, 'Elend'], [225, 'Niedergeschlagenheit'], [270, 'Müdigkeit'], [315, 'Zufriedenheit']];

export const diagramme = {
  circumplex: {
    caption: 'Circumplex-Modell nach Russell (1980), vereinfacht: Gefühle liegen auf einem Kreis aus Valenz (waagerecht) und Arousal (senkrecht). Deutsche Begriffe frei übersetzt.',
    alt: 'Kreis mit waagerechter Achse von unangenehm nach angenehm und senkrechter Achse von ruhig nach aktiviert. Auf dem Kreis liegen im Uhrzeigersinn ab rechts: Wohlbehagen, Zufriedenheit unten rechts, Müdigkeit unten, Niedergeschlagenheit unten links, Elend links, Stress oben links, Erregung oben, Begeisterung oben rechts.',
    svg: (() => {
      const cx = 320, cy = 230, r = 150;
      let s = `<svg viewBox="0 0 640 470" role="img">${defs}
        <circle class="sc-d-soft" cx="${cx}" cy="${cy}" r="${r}"/>
        <line class="sc-d-arrow" x1="${cx - r - 40}" y1="${cy}" x2="${cx + r + 40}" y2="${cy}" marker-end="url(#ed-ah)" marker-start="url(#ed-ah)"/>
        <line class="sc-d-arrow" x1="${cx}" y1="${cy + r + 40}" x2="${cx}" y2="${cy - r - 40}" marker-end="url(#ed-ah)" marker-start="url(#ed-ah)"/>
        ${t(cx + r + 44, cy + 24, 'angenehm', 'sc-d-small', 'end')}${t(cx - r - 44, cy + 24, 'unangenehm', 'sc-d-small', 'start')}
        ${t(cx + 10, 22, 'aktiviert', 'sc-d-small', 'start')}${t(cx + 10, 458, 'ruhig', 'sc-d-small', 'start')}
        ${t(cx + r + 50, cy - 8, 'Valenz', 'sc-d-small', 'start')}${t(cx - 10, 22, 'Arousal', 'sc-d-small', 'end')}`;
      russell.forEach(([deg, w]) => {
        const a = (deg * Math.PI) / 180, x = cx + Math.cos(a) * r, y = cy - Math.sin(a) * r;
        const vert = deg === 90 || deg === 270, hor = deg === 0 || deg === 180;
        if (hor) { s += `<circle class="sc-d-accent" cx="${x}" cy="${y}" r="6"/>${t(x, y - 16, w, 'sc-d-text', 'middle')}`; return; }
        const lx = vert ? x + 14 : cx + Math.cos(a) * (r + 14), ly = vert ? y + 5 : cy - Math.sin(a) * (r + 14) + (Math.sin(a) > 0.5 ? -6 : Math.sin(a) < -0.5 ? 18 : 5);
        s += `<circle class="sc-d-accent" cx="${x}" cy="${y}" r="6"/>${t(lx, ly, w, 'sc-d-text', vert || Math.cos(a) > 0 ? 'start' : 'end')}`;
      });
      return s + '</svg>';
    })()
  },
  ebenen: {
    caption: 'Drei Ebenen nach Norman (2004): von der schnellen, unbewussten viszeralen Ebene bis zur bewussten, reflexiven Ebene.',
    alt: 'Drei übereinanderliegende Bänder. Unten „Viszeral: erster Eindruck“, in der Mitte „Verhaltensbezogen: Nutzung“, oben „Reflexiv: Bedeutung“. Ein Pfeil links zeigt von unbewusst und schnell nach bewusst und langsam.',
    svg: `<svg viewBox="0 0 640 300" role="img">${defs}
      <line class="sc-d-arrow" x1="60" y1="270" x2="60" y2="30" marker-end="url(#ed-ah)"/>
      ${t(76, 284, 'schnell, unbewusst', 'sc-d-small', 'start')}${t(76, 24, 'langsam, bewusst', 'sc-d-small', 'start')}
      <rect class="sc-d-mid" x="100" y="196" width="500" height="66" rx="12"/>${t(350, 226, 'Viszeral: erster Eindruck', 'sc-d-text')}${t(350, 248, 'Form, Farbe, Klang, Material', 'sc-d-midtext')}
      <rect class="sc-d-soft" x="100" y="118" width="500" height="66" rx="12"/>${t(350, 148, 'Verhaltensbezogen: Nutzung', 'sc-d-text')}${t(350, 170, 'Funktion, Verständlichkeit, Kontrolle, Rückmeldung', 'sc-d-small')}
      <rect class="sc-d-accent" x="100" y="40" width="500" height="66" rx="12"/>${t(350, 70, 'Reflexiv: Bedeutung', 'sc-d-text sc-d-on')}${t(350, 92, 'Selbstbild, Erinnerung, Geschichte', 'sc-d-small sc-d-on')}
    </svg>`
  },
  fusion: {
    caption: 'Späte multimodale Fusion: Jeder Kanal schätzt für sich, die Schätzungen werden gewichtet zusammengeführt. Das Ergebnis ist eine Schätzung mit Unsicherheit.',
    alt: 'Flussdiagramm. Links drei Kästen: Gesicht mit Action Units, Text mit Sentiment, Herz mit Puls und HRV. Pfeile führen zu je einer Einzelschätzung, dann zu einem Kasten „Gewichtete Fusion“ und schließlich zu „Index mit Unsicherheit“. Darunter der Hinweis: gemessen werden Signale, nicht Gefühle.',
    svg: (() => {
      const rows = [['Gesicht', 'Action Units'], ['Text', 'Sentiment'], ['Herz', 'Puls, HRV']];
      let s = `<svg viewBox="0 0 760 330" role="img">${defs}`;
      rows.forEach(([a, b], i) => {
        const y = 40 + i * 90;
        s += `<rect class="sc-d-soft" x="20" y="${y}" width="150" height="58" rx="10"/>${t(95, y + 26, a)}${t(95, y + 46, b, 'sc-d-small')}
          <line class="sc-d-arrow" x1="172" y1="${y + 29}" x2="226" y2="${y + 29}" marker-end="url(#ed-ah)"/>
          <rect class="sc-d-mid" x="230" y="${y + 6}" width="150" height="46" rx="10"/>${t(305, y + 35, 'Einzelschätzung', 'sc-d-midtext')}
          <line class="sc-d-arrow" x1="382" y1="${y + 29}" x2="436" y2="${165 + (i - 1) * 14}" marker-end="url(#ed-ah)"/>`;
      });
      return s + `<rect class="sc-d-mid" x="440" y="132" width="140" height="66" rx="10"/>${t(510, 160, 'Gewichtete')}${t(510, 180, 'Fusion')}
        <line class="sc-d-arrow" x1="582" y1="165" x2="606" y2="165" marker-end="url(#ed-ah)"/>
        <rect class="sc-d-accent" x="610" y="128" width="136" height="74" rx="10"/>${t(678, 158, 'Index', 'sc-d-text sc-d-on')}${t(678, 180, '± Unsicherheit', 'sc-d-small sc-d-on')}
        ${t(380, 318, 'Gemessen werden Signale, nicht Gefühle.', 'sc-d-small')}</svg>`;
    })()
  }
};
