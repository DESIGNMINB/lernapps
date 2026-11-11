/* Designgeschichte · sechs Übungen */

// 1 · Zeitstrahl ordnen (richtige Reihenfolge = Index)
export const zeitstrahl = {
  items: [
    ['1851', 'Weltausstellung in London im Kristallpalast'],
    ['um 1879', 'Christopher Dresser entwirft eine geometrische Teekanne für James Dixon & Sons'],
    ['1907', 'Gründung des Deutschen Werkbunds, Peter Behrens beginnt bei der AEG'],
    ['1919', 'Gründung des Bauhauses in Weimar'],
    ['1934', 'Raymond Loewys Coldspot-Kühlschrank in Stromlinienform'],
    ['1956', 'Braun SK 4 von Dieter Rams und Hans Gugelot'],
    ['1981', 'Erste Ausstellung der Gruppe Memphis in Mailand'],
    ['1984', 'Apple Macintosh mit Icons von Susan Kare']
  ],
  start: [3, 6, 1, 7, 0, 5, 2, 4],
  success: 'Richtig geordnet. Achten Sie auf Dressers Teekanne: Sie ist rund 40 Jahre älter als das Bauhaus und zeigt doch schon eine Form, die aus Material, Herstellung und Gebrauch entwickelt ist.',
  hint: (pos) => `Prüfen Sie ab Position ${pos}. Ein Tipp: Die ornamentlose Teekanne wirkt modern, ist aber älter als Werkbund und Bauhaus.`
};

// 2 · Stuhl-Detektiv: [Stuhl, Beschreibung, Epoche-Key, Merkmal-Key, Link]
export const stuhlEpochen = [
  ['industrialisierung', 'Industrialisierung'], ['jugendstil', 'Jugendstil / Glasgow'], ['destijl', 'De Stijl'], ['bauhaus', 'Bauhaus'],
  ['skandinavien', 'Skandinavisches Design'], ['pop', 'Pop Design'], ['memphis', 'Memphis / Postmoderne']
];
export const stuhlMerkmale = [
  ['dampf', 'Dampfgebogenes Holz, wenige Teile, zerlegt versandt'],
  ['lehne', 'Sehr hohe, gerade Lehne als Raumelement'],
  ['flaechen', 'Latten und Platten in Grundfarben, Konstruktion sichtbar'],
  ['stahlrohr', 'Gebogenes Stahlrohr mit gespannten Stoffbahnen'],
  ['schichtholz', 'Sitzschale aus formgepresstem Schichtholz, leicht und stapelbar'],
  ['kunststoff', 'Freischwinger aus einem Stück Kunststoff'],
  ['ironie', 'Bunte, schräge Formen, die Zeichen und Witz statt Funktion betonen']
];
export const stuehle = [
  ['Thonet Nr. 14', 'Michael Thonet, 1859', 'industrialisierung', 'dampf'],
  ['Stuhl für das Hill House', 'Charles Rennie Mackintosh, 1902–1904', 'jugendstil', 'lehne'],
  ['Rot-Blauer Stuhl', 'Gerrit Rietveld, 1918, Farbfassung um 1923', 'destijl', 'flaechen'],
  ['Clubsessel', 'Marcel Breuer, 1925', 'bauhaus', 'stahlrohr'],
  ['Ameise', 'Arne Jacobsen, 1952', 'skandinavien', 'schichtholz'],
  ['Kunststoff-Freischwinger', 'Verner Panton, Serie ab 1967', 'pop', 'kunststoff'],
  ['Stuhl „First“', 'Michele De Lucchi für Memphis, 1983', 'memphis', 'ironie']
];

// 3 · Drei Haltungen, ein Radio
export const radios = [
  { id: 'us', name: 'US-Stromlinienradio', example: 'zum Beispiel Emerson Patriot von Norman Bel Geddes (1940)', desc: 'Gehäuse aus farbigem Gussharz (Catalin) in Rot, Weiß und Blau, gerundete Kanten und Stromlinien-Rippen.', haltung: 'verkaufen', material: 'catalin', form: 'stromlinie', zitat: 'Loewy nannte sein Prinzip MAYA: so modern wie möglich, aber noch vertraut genug, um gekauft zu werden.' },
  { id: 'braun', name: 'Braun SK 4', example: 'Dieter Rams und Hans Gugelot (1956)', desc: 'Weißes Blechgehäuse mit Holzwangen, Bedienelemente geordnet auf der Oberseite, Haube aus Plexiglas.', haltung: 'ordnen', material: 'blech', form: 'raster', zitat: 'Rams fasst seine Haltung später als „Weniger, aber besser“ zusammen.' },
  { id: 'brionvega', name: 'Brionvega TS 502', example: 'Marco Zanuso und Richard Sapper (1964)', desc: 'Zwei Kunststoffhälften, die sich wie ein Koffer aufklappen. Geschlossen ein glatter Würfel, geöffnet Lautsprecher und Bedienteil.', haltung: 'begeistern', material: 'abs', form: 'klappwuerfel', zitat: 'Das Radio überrascht beim Öffnen: Bedienung wird zum Erlebnis.' }
];
export const radioOptionen = {
  haltung: [['verkaufen', 'Verkaufen: Modernität zeigen, Kauf anregen'], ['ordnen', 'Ordnen: Klarheit, Zurückhaltung, Langlebigkeit'], ['begeistern', 'Begeistern: Überraschung, Spiel, Gefühl']],
  material: [['catalin', 'Farbiges Gussharz (Catalin)'], ['blech', 'Lackiertes Blech, Holz und Plexiglas'], ['abs', 'Glänzender Kunststoff (ABS)']],
  form: [['stromlinie', 'Gerundete Stromlinie als Fortschrittssymbol'], ['raster', 'Geordnete Flächen und Raster'], ['klappwuerfel', 'Aufklappbarer Würfel mit Überraschungseffekt']]
};
export const radioTransfer = [
  ['Eine Banking-App soll Vertrauen schaffen und jahrelang gleich bedienbar bleiben.', 'ordnen', 'Ordnen passt: Klarheit und Beständigkeit stützen Vertrauen. Ein Hauch „Begeistern“ kann in Mikroanimationen liegen.'],
  ['Eine Streaming-App will jede Saison mit neuem Look Aufmerksamkeit erzeugen.', 'verkaufen', 'Das ähnelt dem Styling der 1930er-Jahre. Prüfen Sie, ob häufige Änderungen die Bedienung stören.'],
  ['Eine Lern-App für Kinder soll beim Öffnen neugierig machen.', 'begeistern', 'Begeistern passt: Überraschung und Spiel laden ein. Ordnung braucht es trotzdem, damit Kinder sich zurechtfinden.']
];

// 4 · Form und Zweck im NS-Staat: Volksempfänger als Quelle
export const quelle = {
  intro: 'Der Volksempfänger VE 301 wurde im August 1933 vorgestellt. Untersuchen Sie das Gerät wie eine historische Quelle. Beantworten Sie die vier Fragen und lesen Sie danach die Einordnung.',
  facts: ['Gehäuse aus Bakelit, Entwurf Walter Maria Kersting', 'Typenbezeichnung 301 nach dem 30. Januar 1933', 'Preis 76 Reichsmark (Netzgerät)', 'Einfache Empfangstechnik, gut vor allem für nahe deutsche Sender', 'Hergestellt von vielen Firmen nach einheitlichen Vorgaben'],
  questions: [
    ['Gestaltung: Wie lässt sich das Gehäuse beschreiben?', ['Sachlich und schlicht, geprägt von Material und Serienfertigung.', 'Reich verziert mit Schnitzereien.', 'Futuristisch mit Stromlinie.'], 0, 'Das Gehäuse ist sachlich. Moderne Formensprache und Diktatur schließen sich nicht aus: Gestaltung allein sagt nichts über die politische Absicht.'],
    ['Preis: Was bewirkt der festgelegte Preis?', ['Das Gerät bleibt ein Luxusartikel.', 'Viele Haushalte können sich ein Radio leisten, die Reichweite des Rundfunks wächst.', 'Der Preis spielt für die Verbreitung keine Rolle.'], 1, 'Ein niedriger Preis war politisch gewollt. Prüfen Sie bei Quellenangaben zu Löhnen und Kaufkraft immer, woher die Vergleichszahlen stammen.'],
    ['Technik und Reichweite: Welche Folge hat die einfache Empfangstechnik?', ['Ausländische Sender sind besonders gut zu hören.', 'Vor allem nahe deutsche Sender sind gut zu empfangen.', 'Das Gerät empfängt nur Musik.'], 1, 'Die Technik begünstigt die staatlich kontrollierten Sender. Ab 1939 ist das Hören ausländischer Sender zusätzlich strafbar.'],
    ['Politischer Zweck: Welche Aussage trifft zu?', ['Das Gerät war ein neutrales Konsumprodukt ohne politische Funktion.', 'Das Gerät diente dazu, Propaganda in möglichst viele Haushalte zu bringen.', 'Das Gerät wurde nur an Behörden ausgeliefert.'], 1, 'Gestaltung, Preis und Technik wirken zusammen für einen politischen Zweck. Die Typenbezeichnung 301 macht diesen Bezug sichtbar.']
  ],
  reflexion: 'Welche Fragen würden Sie an ein heutiges digitales Produkt stellen, das Information für sehr viele Menschen verbreitet?'
};

// 5 · Wer hat's gesagt? [Aussage, Person-Key, Art, Beleg]
export const zitatPersonen = [
  ['morris', 'William Morris'], ['dresser', 'Christopher Dresser'], ['loos', 'Adolf Loos'], ['rodtschenko', 'Alexander Rodtschenko'],
  ['gropius', 'Walter Gropius'], ['loewy', 'Raymond Loewy'], ['rams', 'Dieter Rams'], ['sottsass', 'Ettore Sottsass']
];
export const zitate = [
  ['„Have nothing in your houses that you do not know to be useful, or believe to be beautiful.“ (Haben Sie nichts in Ihren Häusern, von dem Sie nicht wissen, dass es nützlich ist, oder glauben, dass es schön ist.)', 'morris', 'wörtlich, deutsche Fassung eigene Übersetzung', 'Vortrag „The Beauty of Life“, Birmingham 1880, gedruckt in „Hopes and Fears for Art“ (1882).'],
  ['Ornament soll aus der Natur abgeleitet, aber streng nach Material, Herstellung und Zweck geordnet werden. Ein Gefäß muss vor allem seinem Gebrauch dienen.', 'dresser', 'sinngemäß', 'Nach „Principles of Decorative Design“ (1873).'],
  ['„evolution der kultur ist gleichbedeutend mit dem entfernen des ornamentes aus dem gebrauchsgegenstande.“', 'loos', 'wörtlich, in Loos’ Kleinschreibung', 'Vortrag „Ornament und Verbrechen“ (1910), gedruckt in „Trotzdem“ (1931). Text bei Wikisource: https://de.wikisource.org/wiki/Ornament_und_Verbrechen'],
  ['Der Künstler soll kein Bild mehr malen, sondern als Konstrukteur für Produktion und Agitation arbeiten: Plakate, Werbung, Bücher, Kleidung.', 'rodtschenko', 'sinngemäß', 'Nach der Haltung der Konstruktivisten um 1921–1923, zusammengefasst.'],
  ['„Architekten, Bildhauer, Maler, wir alle müssen zum Handwerk zurück!“', 'gropius', 'wörtlich', 'Manifest und Programm des Staatlichen Bauhauses in Weimar, April 1919.'],
  ['Ein Produkt soll so fortschrittlich wie möglich sein, aber noch so vertraut, dass die Kundschaft es annimmt.', 'loewy', 'sinngemäß (Prinzip MAYA)', 'Nach Loewys Prinzip „Most Advanced Yet Acceptable“, beschrieben in seiner Autobiografie (1951).'],
  ['„Weniger, aber besser.“', 'rams', 'wörtlich, Titel seines Buches', 'Dieter Rams: Weniger, aber besser (1995).'],
  ['Design soll nicht nur funktionieren, sondern Sinnlichkeit, Ironie und Zeichen in den Alltag bringen.', 'sottsass', 'sinngemäß', 'Nach Sottsass’ Haltung bei Olivetti und in der Gruppe Memphis, zusammengefasst.']
];

// 6 · Rams' Thesen am Interface (nach Dieter Rams, Wortlaut nach Vitsœ)
export const thesen = [
  ['Gutes Design ist innovativ.', 'Nutzt die App neue technische Möglichkeiten sinnvoll, statt nur Bekanntes zu wiederholen?'],
  ['Gutes Design macht ein Produkt brauchbar.', 'Lassen sich die wichtigsten Aufgaben schnell und sicher erledigen?'],
  ['Gutes Design ist ästhetisch.', 'Wirkt die Oberfläche stimmig, ruhig und sorgfältig gestaltet?'],
  ['Gutes Design macht ein Produkt verständlich.', 'Erklärt sich die App selbst, ohne Anleitung?'],
  ['Gutes Design ist unaufdringlich.', 'Tritt die Gestaltung hinter die Inhalte und Aufgaben zurück?'],
  ['Gutes Design ist ehrlich.', 'Verspricht die App nicht mehr, als sie hält? Gibt es keine Dark Patterns?'],
  ['Gutes Design ist langlebig.', 'Wirkt die Gestaltung auch in einigen Jahren noch, oder folgt sie einem kurzen Trend?'],
  ['Gutes Design ist konsequent bis ins letzte Detail.', 'Sind Abstände, Zustände, Texte und Fehlermeldungen durchgängig gestaltet?'],
  ['Gutes Design ist umweltfreundlich.', 'Geht die App sparsam mit Daten, Energie und Aufmerksamkeit um?'],
  ['Gutes Design ist so wenig Design wie möglich.', 'Ist alles Überflüssige weggelassen?']
];
export const thesenStufen = [['ja', 'trifft zu'], ['teils', 'teilweise'], ['nein', 'trifft nicht zu']];

// Ergänzung zu Übung 6: Inklusion (nicht Teil von Rams’ Thesen)
export const inklusion = [
  ['Bedienbar mit der Tastatur', 'Lassen sich alle Funktionen ohne Maus oder Touch erreichen, in sinnvoller Reihenfolge?'],
  ['Sichtbarer Fokus', 'Ist jederzeit erkennbar, welches Element gerade ausgewählt ist?'],
  ['Verständliche Beschriftungen', 'Haben Schaltflächen, Felder und Symbole eindeutige Namen, auch für Screenreader?'],
  ['Information nicht nur über Farbe', 'Werden Zustände wie Fehler oder Auswahl auch durch Text, Form oder Symbol vermittelt?']
];
