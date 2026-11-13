/* Eigene Schemazeichnungen als SVG. Farben über CSS-Klassen, damit der Dunkelmodus greift. */
const defs = '<defs><marker id="fu-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="sc-d-ink"/></marker></defs>';
const t = (x, y, s, cls = 'sc-d-text', anchor = 'middle') => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;

const ring1 = ['weniger Schreibzeit', 'neue Datenmengen', 'Fehler der KI'];
const ring2 = [['mehr Zeit für Zuwendung', 'oder Personalabbau'], ['Datenschutz-Risiken', 'neue Geschäftsmodelle'], ['Haftungsfragen', 'Misstrauen der Pflegekräfte']];

export const diagramme = {
  wheel: {
    caption: 'Futures Wheel nach Jerome C. Glenn: In der Mitte die Veränderung, im ersten Ring direkte Folgen, im zweiten Ring deren Folgen.',
    alt: 'Kreisdiagramm mit der Veränderung „KI dokumentiert die Pflege“ in der Mitte, drei direkten Folgen im ersten Ring und je zwei Folgen davon im äußeren Ring.',
    svg: (() => {
      /* Breiten aus der Textlänge berechnet, damit kein Text übersteht */
      const cx = 390, cy = 200, w2 = (q) => q.length * 7.4 + 26, w1 = (q) => q.length * 8.2 + 30;
      let s = `<svg viewBox="0 0 780 400" role="img">${defs}`;
      ring1.forEach((r, i) => {
        const a = -Math.PI / 2 + i * 2 * Math.PI / 3, x1 = cx + Math.cos(a) * 120, y1 = cy + Math.sin(a) * 100;
        s += `<line class="sc-d-line" x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}"/>`;
        ring2[i].forEach((q, j) => {
          const b = a + (j ? 0.42 : -0.42), x2 = cx + Math.cos(b) * 255, y2 = cy + Math.sin(b) * 168;
          s += `<line class="sc-d-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><rect class="sc-d-soft" x="${x2 - w2(q) / 2}" y="${y2 - 15}" width="${w2(q)}" height="30" rx="15"/>${t(x2, y2 + 4, q, 'sc-d-small')}`;
        });
        s += `<rect class="sc-d-mid" x="${x1 - w1(r) / 2}" y="${y1 - 16}" width="${w1(r)}" height="32" rx="16"/>${t(x1, y1 + 5, r)}`;
      });
      const c = 'KI dokumentiert die Pflege';
      return s + `<ellipse class="sc-d-accent" cx="${cx}" cy="${cy}" rx="${c.length * 4.6 + 26}" ry="30"/>${t(cx, cy + 5, c, 'sc-d-text sc-d-on')}</svg>`;
    })()
  },
  achsen: {
    caption: 'Szenario-Achsen: Zwei unsichere Einflussgrößen ergeben vier Zukünfte. Beispiel: Wem gehören Gesundheitsdaten, und wie stark ist Pflege automatisiert?',
    alt: 'Kreuz aus zwei Achsen. Waagerecht „Daten bei Konzernen“ bis „Daten bei Menschen“, senkrecht „wenig Automatisierung“ bis „viel Automatisierung“. In den vier Feldern stehen die Szenarien Pflege-Plattform, Digitale Genossenschaft, Handarbeit unter Kontrolle und Nachbarschaftspflege.',
    svg: `<svg viewBox="0 0 640 380" role="img">${defs}
      <line class="sc-d-arrow" x1="70" y1="190" x2="570" y2="190" marker-end="url(#fu-ah)" marker-start="url(#fu-ah)"/>
      <line class="sc-d-arrow" x1="320" y1="350" x2="320" y2="30" marker-end="url(#fu-ah)" marker-start="url(#fu-ah)"/>
      ${t(70, 214, 'Daten bei Konzernen', 'sc-d-small', 'start')}${t(570, 214, 'Daten bei Menschen', 'sc-d-small', 'end')}
      ${t(332, 26, 'viel Automatisierung', 'sc-d-small', 'start')}${t(332, 370, 'wenig Automatisierung', 'sc-d-small', 'start')}
      <rect class="sc-d-soft" x="110" y="60" width="180" height="90" rx="10"/>${t(200, 100, 'Pflege-Plattform')}${t(200, 122, 'Roboter, Abo, Datenhandel', 'sc-d-small')}
      <rect class="sc-d-mid" x="350" y="60" width="180" height="90" rx="10"/>${t(440, 100, 'Digitale Genossenschaft')}${t(440, 122, 'Technik im Gemeinbesitz', 'sc-d-small')}
      <rect class="sc-d-soft" x="110" y="230" width="180" height="90" rx="10"/>${t(200, 270, 'Handarbeit unter Kontrolle')}${t(200, 292, 'wenig Technik, viel Messung', 'sc-d-small')}
      <rect class="sc-d-soft" x="350" y="230" width="180" height="90" rx="10"/>${t(440, 270, 'Nachbarschaftspflege')}${t(440, 292, 'Menschen helfen Menschen', 'sc-d-small')}
    </svg>`
  },
  horizonte: {
    caption: 'Three Horizons: H1 verliert an Bedeutung, H3 wächst aus heutigen Ansätzen, H2 ist der Übergang dazwischen.',
    alt: 'Diagramm mit Zeitachse nach rechts und Bedeutung nach oben. Kurve H1 fällt von links oben nach rechts unten, Kurve H3 steigt von links unten nach rechts oben, Kurve H2 wölbt sich in der Mitte nach oben.',
    svg: `<svg viewBox="0 0 640 320" role="img">${defs}
      <line class="sc-d-arrow" x1="60" y1="280" x2="600" y2="280" marker-end="url(#fu-ah)"/><line class="sc-d-arrow" x1="60" y1="280" x2="60" y2="30" marker-end="url(#fu-ah)"/>
      ${t(600, 304, 'Zeit', 'sc-d-small', 'end')}${t(70, 30, 'Bedeutung', 'sc-d-small', 'start')}
      <path class="fu-h1" d="M60 60 C 250 60, 380 240, 590 260"/>
      <path class="fu-h3" d="M60 262 C 270 250, 400 70, 590 55"/>
      <path class="fu-h2" d="M120 268 C 260 120, 400 120, 540 268"/>
      ${t(120, 52, 'H1: heute dominantes System', 'sc-d-text', 'start')}${t(585, 46, 'H3: gewünschte Zukunft', 'sc-d-text', 'end')}${t(330, 140, 'H2: Übergang', 'sc-d-text')}
    </svg>`
  }
};
