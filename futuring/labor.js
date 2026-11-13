/* Daten des Labors. Szenarien werden aus vorbereiteten Textbausteinen zusammengesetzt, keine KI. */

export const slots = [
  ['tech', 'Technologie'],
  ['trend', 'Megatrend'],
  ['ort', 'Lebensbereich']
];

export const tokens = [
  /* Technologien: kegel = Einschätzung im Futures Cone für 2040 */
  { id: 'ki-begleiter', typ: 'tech', label: 'KI-Begleiter', kegel: 'plausible',
    alltag: 'Ein KI-Begleiter auf Smartphone und Lautsprecher kennt die Gewohnheiten der Menschen, führt Gespräche und erinnert an Termine und Medikamente.',
    frage: 'Wem ist der KI-Begleiter verpflichtet: der Person, die mit ihm spricht, oder dem Unternehmen, das ihn betreibt?' },
  { id: 'bci', typ: 'tech', label: 'Brain-Computer-Interface', kegel: 'possible',
    alltag: 'Ein leichtes Stirnband liest Gehirnsignale, steuert Geräte ohne Hände und erkennt Müdigkeit und Konzentration.',
    frage: 'Wem gehören Gehirndaten, und wer darf aus ihnen auf Gedanken und Gefühle schließen?' },
  { id: 'emotion', typ: 'tech', label: 'Emotionserkennung', kegel: 'plausible',
    alltag: 'Kameras und Wearables schätzen Gefühle aus Stimme, Mimik und Puls und passen Inhalte, Musik und Preise daran an.',
    frage: 'Wie zuverlässig ist die Erkennung, und was passiert, wenn sie sich irrt?' },
  { id: 'zwilling', typ: 'tech', label: 'Digitaler Zwilling', kegel: 'probable',
    alltag: 'Von jeder Person gibt es einen digitalen Zwilling aus Gesundheits-, Bewegungs- und Kaufdaten, der Entscheidungen vorab durchspielt.',
    frage: 'Wer darf den Zwilling befragen, und darf er Entscheidungen ohne die Person treffen?' },
  { id: 'ar', typ: 'tech', label: 'AR-Brillen', kegel: 'probable',
    alltag: 'Leichte AR-Brillen legen Informationen über die sichtbare Welt: Namen, Bewertungen, Wege und Werbung.',
    frage: 'Wer entscheidet, was über die Wirklichkeit gelegt wird, und was wird dabei verdeckt?' },
  /* Megatrends */
  { id: 'alterung', typ: 'trend', label: 'Alternde Gesellschaft',
    welt: 'Mehr als jede vierte Person ist älter als 65 Jahre, in der Pflege fehlen überall Fachkräfte.',
    spannung: 'Wer sich Technik und Betreuung leisten kann, lebt länger selbstständig. Andere bleiben auf überlastete Dienste angewiesen.',
    frage: 'Ersetzt Technik menschliche Zuwendung, oder schafft sie Zeit dafür?' },
  { id: 'klima', typ: 'trend', label: 'Klimaanpassung',
    welt: 'Hitzesommer und Starkregen gehören zum Alltag, Energie und Wasser sind knapp und teuer.',
    spannung: 'Die Technik selbst braucht Strom und Rohstoffe. Wer in schlecht gedämmten Wohnungen lebt, trägt die Folgen der Hitze zuerst.',
    frage: 'Hilft die Technik bei der Anpassung, oder verschärft ihr Energiebedarf das Problem?' },
  { id: 'daten', typ: 'trend', label: 'Datenökonomie',
    welt: 'Fast jede Handlung erzeugt Daten, die gehandelt, verknüpft und ausgewertet werden.',
    spannung: 'Wer viele Daten teilt, bekommt günstigere Tarife. Wer das nicht will oder kann, zahlt mehr.',
    frage: 'Ist Privatsphäre ein Recht für alle oder ein Luxus für wenige?' },
  { id: 'arbeit', typ: 'trend', label: 'Plattformarbeit',
    welt: 'Viele Menschen arbeiten projektweise über Plattformen. Algorithmen verteilen Aufträge und bewerten Leistung.',
    spannung: 'Flexibilität für die einen bedeutet Unsicherheit für die anderen. Bewertungen entscheiden über das nächste Einkommen.',
    frage: 'Wer kontrolliert die Algorithmen, die über Arbeit entscheiden?' },
  { id: 'einsamkeit', typ: 'trend', label: 'Vereinzelung',
    welt: 'Immer mehr Menschen leben allein, Einsamkeit gilt als ernstes Gesundheitsrisiko.',
    spannung: 'Technische Gesellschaft ist immer verfügbar. Menschliche Begegnungen werden seltener und wertvoller.',
    frage: 'Lindert die Technik Einsamkeit, oder macht sie es leichter, allein zu bleiben?' },
  /* Lebensbereiche */
  { id: 'wohnen', typ: 'ort', label: 'Wohnen',
    szene: (t) => `Für Mira (34) beginnt jeder Tag in ihrer Wohnung mit ${t}. Was als praktische Hilfe anfing, bestimmt heute mit, wann sie aufsteht, was sie isst und wen sie trifft.`,
    frage: 'Bleibt die eigene Wohnung ein Ort, an dem niemand zusieht?' },
  { id: 'lernen', typ: 'ort', label: 'Lernen',
    szene: (t) => `Jonas (21) studiert Medieninformatik. In der Vorlesung und zu Hause begleitet ihn ${t}. Lernpläne, Gruppenarbeit und Prüfungen sind darauf abgestimmt.`,
    frage: 'Wer sieht die Daten über das Lernen, und können sie später gegen die Studierenden verwendet werden?' },
  { id: 'gesundheit', typ: 'ort', label: 'Gesundheit und Pflege',
    szene: (t) => `Herr Okafor (81) wird zu Hause gepflegt. ${t[0].toUpperCase() + t.slice(1)} ergänzt die wenigen Besuche des Pflegedienstes, seine Tochter in Hamburg bekommt jeden Abend einen Bericht.`,
    frage: 'Wer entscheidet über die Pflege: die gepflegte Person, die Angehörigen oder das System?' },
  { id: 'mobilitaet', typ: 'ort', label: 'Mobilität',
    szene: (t) => `Lea (27) pendelt täglich mit Bus und Bahn. ${t[0].toUpperCase() + t.slice(1)} begleitet sie auf jedem Weg, vom Ticket bis zur Wahl des Sitzplatzes.`,
    frage: 'Wird der öffentliche Raum für alle gleich zugänglich bleiben?' }
];
/* Artikel für die Szene */
export const techArtikel = { 'ki-begleiter': 'ihr KI-Begleiter', bci: 'ein Brain-Computer-Interface', emotion: 'die Emotionserkennung', zwilling: 'ein digitaler Zwilling', ar: 'eine AR-Brille' };
export const techDativ = { 'ki-begleiter': 'ihrem KI-Begleiter', bci: 'einem Brain-Computer-Interface', emotion: 'der Emotionserkennung', zwilling: 'ihrem digitalen Zwilling', ar: 'ihrer AR-Brille' };
export const techArtikelM = { 'ki-begleiter': 'sein KI-Begleiter', bci: 'ein Brain-Computer-Interface', emotion: 'die Emotionserkennung', zwilling: 'sein digitaler Zwilling', ar: 'eine AR-Brille' };

/* Bausteine des diegetischen Prototyps. Stufen 0–4, je [Vorschautext, Hinweis]. warnAb: ab welcher Stufe gewarnt wird */
export const bloecke = [
  { id: 'notification', name: 'Benachrichtigung', skala: ['Dezent', 'Aufdringlich'], warnAb: 3,
    stufen: [
      'Keine Hinweise, Informationen nur auf Nachfrage',
      'Leiser Hinweis in der Übersicht',
      'Eine Mitteilung pro Tag',
      'Mitteilung mit Ton jede Stunde: „Du hast heute noch nichts erledigt.“',
      'Vollbild-Hinweis mit Vibration und Countdown, schließt erst nach 10 Sekunden'
    ],
    muster: 'Nagging (Drängeln) und falsche Dringlichkeit',
    fiktiv: 'Leitlinie 2040, § 4 Aufmerksamkeitsschutz: Ein System darf eine Person nur so oft unterbrechen, wie diese vorab festgelegt hat.',
    real: 'Heute: Muster „Nagging“ nach Brignull (deceptive.design). DSA Art. 25 Abs. 3 nennt wiederholte Aufforderungen zu einer bereits getroffenen Entscheidung als Beispiel. WCAG 2.2.4 Unterbrechungen (AAA): Unterbrechungen müssen sich aufschieben oder unterdrücken lassen.',
    zuDezent: 'Auch zu dezent kann schaden: Wenn das System Gesundheit oder Sicherheit betrifft, dürfen wichtige Warnungen nicht untergehen.' },
  { id: 'cta', name: 'Entscheidung', skala: ['Neutral', 'Beschämend'], warnAb: 3,
    stufen: [
      'Zwei gleich gestaltete Schaltflächen: „Annehmen“ und „Ablehnen“',
      '„Annehmen“ hervorgehoben, „Ablehnen“ gut sichtbar',
      '„Annehmen“ groß, „Ablehnen“ als kleiner grauer Textlink',
      'Ablehnen heißt jetzt: „Nein, meine Gesundheit ist mir egal“',
      'Es gibt kein Ablehnen, nur „Später erinnern“. Der Avatar schaut traurig.'
    ],
    muster: 'Confirmshaming (Beschämen) und ungleich gewichtete Wahl',
    fiktiv: 'Leitlinie 2040, § 7 Gleichwertige Wahl: Zustimmung und Ablehnung müssen gleich sichtbar, gleich leicht erreichbar und ohne Wertung formuliert sein.',
    real: 'Heute: Muster „Confirmshaming“ nach Brignull. DSA Art. 25 Abs. 3 nennt das Hervorheben bestimmter Wahlmöglichkeiten als Beispiel. Für Einwilligungen gilt DSGVO Art. 7.' },
  { id: 'consent', name: 'Datenfreigabe', skala: ['Einzeln abgefragt', 'Vorausgewählt'], warnAb: 3,
    stufen: [
      'Jede Datenart wird erklärt und einzeln abgefragt',
      'Freigabe in Gruppen, alle Kästchen leer',
      'Kurzer Text, Details erst hinter „Mehr erfahren“',
      'Alle Kästchen sind vorausgewählt',
      'Freigabe gilt automatisch, Widerspruch nur per Formular tief in den Einstellungen'
    ],
    muster: 'Preselection (Vorauswahl) und Obstruction (Hindernisse)',
    fiktiv: 'Leitlinie 2040, § 2 Datenruhe: Daten aus Körper, Gehirn und Gefühlen werden nur erhoben, wenn die Person dies für jeden Zweck einzeln eingeschaltet hat.',
    real: 'Heute: DSGVO Art. 7 und Erwägungsgrund 32: Vorausgewählte Kästchen sind keine Einwilligung, der Widerruf muss so einfach sein wie die Erteilung. Gesundheitsdaten schützt Art. 9 besonders.' },
  { id: 'feed', name: 'Empfehlungen', skala: ['Chronologisch', 'Endlos personalisiert'], warnAb: 3,
    stufen: [
      'Chronologische Liste, die nach den neuen Einträgen endet',
      'Personalisiert, mit Erklärung „Warum sehe ich das?“',
      'Personalisiert, ohne Erklärung',
      'Endloser Feed, das nächste Video startet automatisch',
      'Endloser Feed, der auf erkannte Traurigkeit mit Kaufangeboten reagiert'
    ],
    muster: 'Aufmerksamkeitsfalle (Infinite Scroll, Autoplay) und Ausnutzen von Gefühlen',
    fiktiv: 'Leitlinie 2040, § 9 Stimmungsneutralität: Erkannte Gefühle dürfen nicht für Werbung, Preise oder Verweildauer genutzt werden.',
    real: 'Heute: DSA Art. 27 verlangt, dass Plattformen die wichtigsten Kriterien ihrer Empfehlungssysteme erklären. AI Act Art. 5 verbietet KI, die gezielt manipuliert oder Schwächen ausnutzt und dadurch erheblichen Schaden verursacht. Emotionserkennung am Arbeitsplatz und in Bildungseinrichtungen ist nach Art. 5 Abs. 1 Buchst. f mit wenigen Ausnahmen verboten.' },
  { id: 'score', name: 'Bewertung', skala: ['Privat', 'Öffentlich vergleichend'], warnAb: 3,
    stufen: [
      'Keine Bewertung',
      'Eigener Fortschritt, nur für die Person sichtbar',
      'Vergleich mit dem eigenen Vormonat',
      'Rangliste im Freundeskreis',
      'Öffentlicher Punktestand, der über Preise und Zugang zu Angeboten entscheidet'
    ],
    muster: 'Sozialer Druck und Social Scoring',
    fiktiv: 'Leitlinie 2040, § 11 Kein Punktestand für Menschen: Bewertungen des Verhaltens dürfen nicht über Zugang zu Wohnung, Bildung, Gesundheit oder Mobilität entscheiden.',
    real: 'Heute: AI Act Art. 5 Abs. 1 Buchst. c verbietet Social Scoring, das zu ungerechtfertigter oder unverhältnismäßiger Benachteiligung führt. DSGVO Art. 22 begrenzt ausschließlich automatisierte Entscheidungen.' }
];
