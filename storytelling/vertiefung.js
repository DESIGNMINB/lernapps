export const modelle = [
  {
    title: 'Freytags Pyramide',
    question: 'Wie verändert sich die Spannung über den Verlauf?',
    steps: 'Einleitung → Steigerung → Höhepunkt → fallende Handlung → Ausgang',
    example: 'Nora kennt den Campus kaum. Eine kurzfristige Raumänderung setzt sie unter Zeitdruck. An der falschen Tür entdeckt sie im Kursplan den Ersatzraum. Sie prüft den Weg und erreicht die Veranstaltung.',
    limit: 'Für eine Fallstudie hilft die Kurve, einen entscheidenden Moment zu zeigen. Ein Interface sollte vermeidbare Hürden abbauen.',
    source: ['Gustav Freytag: Die Technik des Dramas', 'https://www.gutenberg.org/ebooks/50616']
  },
  {
    title: 'Heldenreise',
    question: 'Wer verändert sich, und wer hilft dabei?',
    steps: 'Aufbruch → Prüfung und Erkenntnis → Rückkehr',
    example: 'Nora betritt ein unbekanntes Gebäude, findet mit einer Wegbeschreibung zum neuen Raum und weiß anschließend, wie sie beim nächsten Raumwechsel vorgehen kann. Die Orientierungshilfe unterstützt sie dabei.',
    limit: 'Für ein Onboarding genügen oft wenige Stationen. Prüfen Sie, ob jede Station bei einer echten Aufgabe hilft und übersprungen werden kann.',
    source: ['Joseph Campbell Foundation: The Hero’s Journey', 'https://www.jcf.org/learn/joseph-campbell-heros-journey']
  },
  {
    title: 'Story Spine',
    question: 'Folgt ein Ereignis aus dem vorherigen?',
    steps: 'Ausgangslage → Gewohnheit → Auslöser → Folgen → Entscheidung → neuer Zustand',
    example: 'Nora nutzt einen statischen Lageplan. Nach der Raumänderung stimmt ihr gespeicherter Weg nicht mehr. Deshalb prüft sie den Kursplan und wählt anhand der aktuellen Raumnummer einen neuen Weg.',
    limit: 'Die Satzanfänge helfen beim Entwerfen. In einer UX-Fallstudie kennzeichnen Sie, welche Ursache beobachtet wurde und welche Sie noch vermuten.',
    source: ['Pixar in a Box: Story Spine', 'https://www.khanacademy.org/computing/pixar/storytelling/story-structure/v/video1a-fine']
  },
  {
    title: 'Transmediale Erzählarchitektur',
    question: 'Welchen neuen Teil der Geschichte erzählt jedes Medium?',
    steps: 'Gemeinsame Erzählwelt → eigenständige Beiträge → verständliche Übergänge',
    example: 'Ein kurzer Film zeigt Noras Raumwechsel. Ein Audiointerview ergänzt die Sicht einer Person, die den Weg ohne visuelle Hinweise zurücklegt. Eine interaktive Karte macht verschiedene Wege und ihre Hindernisse erkundbar.',
    limit: 'Eine Raumänderung auf Website und Smartphone zu wiederholen ist für die Orientierung sinnvoll. Eine Erzählung wird transmedial, wenn die Medien verschiedene Teile derselben Erzählwelt beitragen.',
    source: ['Henry Jenkins: Transmedia Storytelling 101', 'https://henryjenkins.org/blog/2007/03/transmedia_storytelling_101.html']
  }
];

export const uxTransfer = {
  figur: 'Skizzieren Sie ein Onboarding für eine Person, die kurzfristig einen neuen Seminarraum finden muss. Was möchte sie erreichen? Wo liegt die Hürde? Welche Orientierungshilfe kann sie selbst wählen? Prüfen Sie, ob die Hilfe auch beim direkten Einstieg verfügbar ist.',
  struktur: 'Zeichnen Sie für eine UX-Fallstudie den Verlauf von Ausgangslage bis Ergebnis. Markieren Sie den Moment, in dem ein beobachtetes Problem Ihre Entwurfsentscheidung verändert hat.',
  bild: 'Skizzieren Sie einen Raumwechsel in vier Bildern: Kontext, Hindernis, Handlung und Ergebnis. Zeigen Sie im ersten Bild die Person im Gebäude, im zweiten die widersprüchliche Raumnummer und erst danach das Interface.',
  transmedia: 'Vergleichen Sie zwei Varianten: Eine Raumänderung erscheint auf drei Geräten, oder Film, Audio und Karte erzählen je einen anderen Teil eines Campusprojekts. Welche Information muss überall verfügbar sein? Was darf das Publikum optional vertiefen?',
  transfer: 'Nutzen Sie den Story-Baukasten für Ihre Fallstudie. Trennen Sie das beobachtete Problem, Ihre Entwurfsentscheidung und den Beleg für das Ergebnis.'
};

export const spineFields = [
  { id: 'ausgangslage', label: 'Ausgangslage', prompt: 'Wer versucht in welcher Situation, was zu erreichen?', example: 'Nora besucht in ihrer ersten Woche eine Lehrveranstaltung auf einem unbekannten Campus.' },
  { id: 'gewohnheit', label: 'Gewohnheit', prompt: 'Wie löst die Person diese Aufgabe bisher?', example: 'Sie speichert den Raum und orientiert sich mit einem Lageplan.' },
  { id: 'ausloeser', label: 'Auslöser', prompt: 'Was durchbricht den bisherigen Ablauf?', example: 'Kurz vor Beginn wird die Veranstaltung in ein anderes Gebäude verlegt.' },
  { id: 'folge', label: 'Erste Folge', prompt: 'Was passiert deshalb? Beschreiben Sie eine beobachtbare Handlung.', example: 'Nora folgt dem gespeicherten Weg und steht vor dem leeren Raum.' },
  { id: 'zuspitzung', label: 'Weitere Folge', prompt: 'Welche Erkenntnis oder Hürde ergibt sich daraus?', example: 'Sie muss die aktuelle Raumnummer und den Weg unter Zeitdruck an verschiedenen Stellen suchen.' },
  { id: 'entscheidung', label: 'Entscheidung', prompt: 'Welche Entscheidung verändert die Lage? Welche Hilfe wirkt dabei?', example: 'Nora öffnet im getesteten Prototyp die aktualisierte Kursansicht und wählt von dort direkt den Weg.' },
  { id: 'ergebnis', label: 'Ergebnis und Beleg', prompt: 'Was hat sich verändert? Welche Beobachtung stützt Ihre Aussage?', example: 'Im fiktiven Testlauf findet Nora den Eingang. Ein weiterer Test soll zeigen, ob der Ablauf auch ohne visuelle Orientierung verständlich ist.' }
];
