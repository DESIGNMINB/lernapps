/* Zusätzliche „Ausprobieren“-Übungen, angeregt durch die StoryLab-Sammlung, sachlich überarbeitet. */

// 01 Handlung und Kausalität · Story Spine sortieren (richtige Reihenfolge = Index 0 … 6)
export const spineSort = {
  items: [
    'Es war einmal … eine Studentin der HKA, die jeden Tag mit der Straßenbahn zur Hochschule fuhr.',
    'Jeden Tag … kaufte sie ihr Ticket an einem langsamen Automaten, der nur wenige Zahlungsarten annahm.',
    'Bis eines Tages … der Automat ihre Karte einbehielt, während die Bahn einfuhr.',
    'Und deswegen … kam sie zu spät zur Einführung in die Prüfungsanmeldung und musste ihre Zulassung nachträglich beantragen.',
    'Und deswegen … schilderte sie den Vorfall in einer Umfrage, mit der die Verkehrsbetriebe ihren Ticketkauf untersuchten.',
    'Bis schließlich … das Designteam den Kauf auf ein Antippen mit dem Smartphone verkürzte.',
    'Und seitdem … steigen viele Studierende ein, ohne vorher am Automaten anzustehen.'
  ],
  start: [4, 0, 6, 2, 5, 1, 3],
  success: 'Richtig. Jeder „Und deswegen“-Satz folgt aus dem Satz davor: Die einbehaltene Karte verursacht die Verspätung, die Verspätung ist der Anlass für ihre Rückmeldung, die Rückmeldung fließt in die Überarbeitung ein.',
  hint: (pos) => `Prüfen Sie ab Position ${pos}: Welcher Satz liefert den Grund für den nächsten? Ein „Und deswegen“ braucht eine Ursache unmittelbar davor.`
};

// 02 Figur · Heldenreise im UX
export const heroJourney = {
  stations: [
    ['Gewohnte Welt', 'Das Team plant Schichten mit Papierlisten und mehreren Tabellen.'],
    ['Ruf des Abenteuers', 'Nach einem Planungsfehler sucht die Teamleiterin nach einem digitalen Werkzeug.'],
    ['Begegnung mit dem Mentor', 'Ein kurzer Einstieg führt sie zu einem ersten Erfolg mit ihren eigenen Daten.'],
    ['Entscheidende Prüfung', 'Sie plant zum ersten Mal eine echte Woche und stellt den Plan dem Team vor.'],
    ['Rückkehr mit dem Elixier', 'Sie arbeitet sicher mit dem Werkzeug und zeigt es einer Kollegin aus einer anderen Abteilung.']
  ],
  feedback: 'Achten Sie darauf, wer sich verändert: Die Teamleiterin wird sicherer und gelassener. Das Produkt bleibt dasselbe und übernimmt die Rolle des Mentors.'
};

// 02 Figur · Archetypen im Fall „KlimaMobil“
export const archetypes = {
  intro: 'KlimaMobil ist eine fiktive App, die in Karlsruhe Bahn, Leihrad und Carsharing zu einer Route verbindet. Ordnen Sie jeder Rolle die passende Besetzung zu.',
  roles: [
    ['Heldin', 'Elena, 29, pendelt täglich zur Arbeit und will pünktlich ankommen.', 'Sie verfolgt das Ziel und verändert sich im Verlauf.'],
    ['Mentor', 'Die App KlimaMobil mit ihren Routenvorschlägen.', 'Der Mentor gibt Werkzeuge und Orientierung, handeln muss die Heldin selbst.'],
    ['Schatten', 'Stau im Berufsverkehr und Parkplatzsuche.', 'Der Gegenspieler muss keine Person sein. Hier sind es Zustände, die Elenas Ziel gefährden.'],
    ['Schwellenhüter', 'Führerscheinprüfung und Eingabe der Zahlungsdaten bei der Registrierung.', 'Die Hürde steht vor der neuen Welt. Eine gute Gestaltung macht sie verständlich, statt sie zu verstecken.']
  ]
};

// 02 Figur · Konfliktebenen (Wortstufen statt Punktwerte)
export const conflictLevels = [
  ['innen', 'Innerer Konflikt', 'Zweifel, Angst vor Fehlern, Überforderung'],
  ['sozial', 'Sozialer Konflikt', 'Widerstand im Team, widersprüchliche Wünsche von Beteiligten'],
  ['system', 'Systemischer Konflikt', 'Altsysteme, starre Vorgaben, Fristen']
];
export const conflictSteps = ['keiner', 'gering', 'deutlich', 'stark'];

// 05 Perspektive · Show, don’t tell
export const showTell = [
  ['Behauptung: „Unsere Banking-App ist schnell und einfach.“', [
    'Die App basiert auf einem modernen Framework und lädt Inhalte im Hintergrund.',
    'Nutzerinnen tippen auf „Senden“, um eine Überweisung auszuführen.',
    'An der Supermarktkasse bestätigt Jana die Zahlung mit einem Blick aufs Telefon, noch bevor die Kassiererin den Bon abgerissen hat.'
  ], 2, 'Die dritte Fassung zeigt eine Situation, in der die Geschwindigkeit spürbar wird. Die anderen beschreiben Technik oder eine Funktion.'],
  ['Behauptung: „Die neue Stationssoftware entlastet das Pflegepersonal.“', [
    'Die Oberfläche wurde nach DIN EN ISO 9241 überarbeitet.',
    'Früher holte Miriam nachts mehrmals Akten aus dem Stationszimmer. Jetzt liest sie die Werte am Bett ab und hat Zeit, einer Patientin zu antworten.',
    'Die neue Version hat weniger Menüpunkte und wirkt aufgeräumter.'
  ], 1, 'Die zweite Fassung zeigt eine Pflegekraft in einer konkreten Situation vorher und nachher. Die Norm und die Menüzahl sind Belege für Fachleute, keine Szene.'],
  ['Behauptung: „Unser Lernportal motiviert Studierende.“', [
    'Das Portal bietet über 100 Module und ein Punktesystem.',
    'Mit dem Portal macht Lernen Spaß, und die Noten werden besser.',
    'Felix löst in der Bahn noch eine Übung und schickt die nächste an eine Kommilitonin.'
  ], 2, 'Die dritte Fassung zeigt Motivation als Handlung. Die zweite behauptet nur eine Wirkung, die erste zählt Funktionen auf.']
];

// 06 Visuelles Erzählen · Storyboard Mensa
export const shotSizes = [
  ['totale', 'Totale', 'zeigt den Raum und ordnet ein'],
  ['halbnah', 'Halbnah', 'zeigt Handlung und Körpersprache'],
  ['nah', 'Nah', 'zeigt Mimik und Gefühl'],
  ['detail', 'Detail', 'zeigt ein Objekt oder das Interface']
];
export const storyboard = [
  { title: 'Ort und Lage', scene: 'Mittags in der Mensa: Die Eingangshalle ist voll, vor den Ausgaben stehen lange Schlangen.', answer: 'totale', img: 'mensa-1-totale', alt: 'Totale: volle Mensa-Eingangshalle mit langen Schlangen vor den Ausgaben',
    why: 'Die Totale ordnet den Ort ein. Das Publikum sieht, wie voll es ist, bevor es eine einzelne Figur kennenlernt.' },
  { title: 'Konflikt', scene: 'Lukas schaut gehetzt auf die Uhr. In 15 Minuten beginnt seine Klausur.', answer: 'nah', img: 'mensa-2-nah', alt: 'Nahaufnahme: Student blickt besorgt auf seine Armbanduhr, die Schlange hinter ihm ist unscharf',
    why: 'Die Nahaufnahme macht den Zeitdruck in seinem Gesicht sichtbar. Hier entsteht die Frage, ob er es schafft.' },
  { title: 'Interaktion', scene: 'Sein Daumen tippt auf „Express-Abholung“, ein QR-Code erscheint.', answer: 'detail', img: 'mensa-3-detail', alt: 'Detail: Daumen tippt auf ein Smartphone, das einen QR-Code anzeigt',
    why: 'Das Detail zeigt genau den Moment, in dem das Interface hilft. In einer UX-Geschichte ist das der Wendepunkt.' },
  { title: 'Ergebnis', scene: 'Lukas nimmt sein Essen entgegen, lächelt und geht in Richtung Hörsaal.', answer: 'halbnah', img: 'mensa-4-halbnah', alt: 'Halbnah: Student nimmt erleichtert ein Tablett an der Ausgabe entgegen',
    why: 'Halbnah zeigt Handlung und Körpersprache zugleich: Er bekommt sein Essen und ist schon auf dem Weg.' }
];

// 07 Transmedia · Jenkins’ sieben Prinzipien
export const jenkins = [
  ['Spreadability und Drillability', 'Inhalte lassen sich leicht teilen. Wer mehr wissen will, kann in die Tiefe gehen.', 'Ein kurzer Teaser in sozialen Medien führt zu einer ausführlichen Projektdokumentation.'],
  ['Continuity und Multiplicity', 'Die Erzählwelt bleibt in sich stimmig. Zugleich sind bewusst andere Versionen möglich.', 'Ein Designsystem hält Begriffe und Komponenten auf Web, App und Uhr einheitlich.'],
  ['Immersion und Extractability', 'Das Publikum taucht in die Welt ein und nimmt Teile davon in den Alltag mit.', 'Eine Uhr-Komplikation erinnert an eine kleine Gewohnheit aus der App.'],
  ['Worldbuilding', 'Die Welt ist reicher, als eine einzelne Geschichte zeigen kann.', 'Eine Customer Journey Map zeigt alle Orte und Kanäle, an denen jemand mit dem Dienst in Kontakt kommt.'],
  ['Seriality', 'Die Geschichte wird in Teilen erzählt, die neugierig auf den nächsten machen.', 'Ein Onboarding schaltet neue Funktionen nach ersten Erfolgen frei.'],
  ['Subjectivity', 'Dieselben Ereignisse werden aus verschiedenen Blickwinkeln erzählt.', 'Eine Anwendung zeigt Verwaltung, Team und Kundschaft jeweils eine eigene Sicht auf denselben Vorgang.'],
  ['Performance', 'Das Publikum trägt eigene Beiträge zur Welt bei.', 'Nutzerinnen teilen eigene Vorlagen, die andere übernehmen können.']
];

// 03 Dramaturgie · Pitch-Beispiel
export const keynote = 'Bei der Macworld im Januar 2007 kündigte Steve Jobs drei neue Produkte an: einen iPod mit Breitbildschirm, ein Mobiltelefon und ein Gerät für das Internet. Er wiederholte die Aufzählung mehrmals, bis er auflöste, dass es sich nicht um drei Geräte handelte, sondern um ein einziges: das iPhone. Die Aufzählung baut eine Erwartung auf, die Auflösung ist der Wendepunkt der Präsentation. Für einen eigenen Pitch heißt das: Führen Sie das Publikum zu einer Frage, bevor Sie die Antwort zeigen. Die Wendung trägt nur, wenn das Produkt sie einlöst.';

// Einleitung · Feature-Liste oder Geschichte
export const lisa = {
  features: ['Kalender wird in Echtzeit synchronisiert', 'Besprechungsräume lassen sich per Uhr umbuchen', 'Das Team wird automatisch benachrichtigt', 'Verfügbar für iOS und Android'],
  story: 'Montag, 7:45 Uhr. Lisa steht mit ihrem Sohn an der Haltestelle, als ihr Meeting um eine Stunde vorverlegt wird. Früher hätte sie jetzt vier Apps geöffnet und zwei Anrufe geführt. Heute genügt ein Blick auf die Uhr: Sie sieht die Änderung, bucht den Raum um, und ihr Team erfährt es automatisch. Der Bus kommt, und Lisa hat beide Hände frei.',
  note: 'Beide Fassungen beschreiben dieselben Funktionen. Die Geschichte zeigt eine Person mit einem Ziel, ein Hindernis und eine Veränderung. So wird erkennbar, in welcher Lage eine Funktion hilft. Eine Produktgeschichte sollte auf beobachteten Situationen beruhen, sonst verspricht sie mehr, als das Produkt hält.'
};

// Story-Baukasten · ladbare Beispiele (fiktiv, ohne Erfolgszahlen)
export const spineExamples = [
  { id: 'case', label: 'UX-Fallstudie „Ticketkauf im Gehen“', values: {
    titel: 'Ticketkauf im Gehen (fiktives Beispiel)',
    ausgangslage: 'Elena pendelt täglich mit der Bahn nach Karlsruhe und kauft ihr Ticket kurz vor der Abfahrt in der App des Verkehrsverbunds.',
    gewohnheit: 'Sie sucht sich durch eine Tarifübersicht mit Zonen und Ermäßigungen, oft im Gehen und mit einer Hand.',
    ausloeser: 'An einem Morgen bricht der Bezahlvorgang ab, während der Zug einfährt.',
    folge: 'Elena steigt ohne gültiges Ticket ein und versucht den Kauf im Zug zu wiederholen.',
    zuspitzung: 'Interviews und Beobachtungen am Bahnhof zeigen: Viele Pendelnde kaufen unter Zeitdruck und einhändig. Die Tarifauswahl ist dabei die größte Hürde.',
    entscheidung: 'Das Team ersetzt die Tarifübersicht durch eine Auswahl gespeicherter Strecken und testet einen Prototyp, der sich mit dem Daumen bedienen lässt.',
    ergebnis: 'Im fiktiven Folgetest kaufen alle Teilnehmenden ihr Ticket im Gehen, ohne abzubrechen. Offen bleibt, ob der Ablauf auch bei schwachem Netz funktioniert.'
  } },
  { id: 'pitch', label: 'Pitch „Mensa-App gegen Lebensmittelabfälle“', values: {
    titel: 'Mensa-App gegen Lebensmittelabfälle (fiktiver Pitch)',
    ausgangslage: 'Die Mensaleitung möchte weniger Essen wegwerfen, ohne dass Studierende auf spontane Entscheidungen verzichten müssen.',
    gewohnheit: 'Die Küche plant die Mengen nach Erfahrung. Studierende entscheiden erst an der Ausgabe, was sie essen.',
    ausloeser: 'Eine Petition der Studierendenvertretung kritisiert die Menge der Lebensmittelabfälle.',
    folge: 'Die Mensa sucht nach einem Weg, die Nachfrage früher zu kennen.',
    zuspitzung: 'Gespräche zeigen: Studierende wollen nicht Tage im Voraus planen. Lange Schlangen ärgern sie mehr als ein begrenztes Angebot.',
    entscheidung: 'Das Team entwirft eine Vorbestellung am selben Vormittag mit Anzeige der freien Abholzeiten. Wer rechtzeitig bestellt, sammelt Treuepunkte.',
    ergebnis: 'Ein Pilotsemester soll zeigen, ob die Abfallmenge sinkt und die Wartezeit kürzer wird. Die Messgrößen werden vor dem Start festgelegt.'
  } }
];
