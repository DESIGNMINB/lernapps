export const lessons = [
  {
    id: 'grundlagen', title: 'Handlung und Kausalität', subtitle: 'Von der Ereignisfolge zur Geschichte', icon: 'chain',
    lead: 'Eine Geschichte macht eine Veränderung nachvollziehbar. Dafür braucht es einen Zusammenhang zwischen dem, was geschieht, und dem, was eine Figur daraufhin tut.',
    goals: ['Ereignisfolge, Handlung und Erzählreihenfolge unterscheiden', 'Szenen mit Ursachen, Entscheidungen und Folgen verbinden'],
    theory: [
      ['Was passiert, und warum?', '„Das Modell zerbricht, und dann kommen zwei Personen herein“ nennt zwei Ereignisse. „Weil das Modell zerbricht, holt Mira ihr Team zurück“ verbindet Ursache, Entscheidung und Folge. Der Zusammenhang muss nicht ausdrücklich im Satz stehen. Das Publikum kann ihn aus dem Bild, dem Dialog oder der Reihenfolge erschließen.'],
      ['Handlung und Erzählreihenfolge', 'In der erzählten Welt zerbricht zuerst das Modell. Die Erzählung kann trotzdem mit der Präsentation beginnen und erst später zeigen, warum das Team mit Pappresten antritt. Die Handlung bleibt dieselbe. Der Einstieg verändert, welche Frage das Publikum zuerst stellt.'],
      ['Der Streich-Test', 'Streichen Sie probeweise einen Moment. Wenn die folgende Entscheidung genauso plausibel bleibt und sich für das Publikum nichts ändert, kann der Moment vermutlich kürzer werden. Auch eine ruhige Szene kann notwendig sein, wenn sie zum Beispiel ein Versprechen etabliert, das später gebrochen wird.']
    ],
    case: 'Mira will um zehn Uhr ein Brückenmodell präsentieren. Der Regen weicht die Pfeiler auf. Als der Kleber nicht hält, muss sie entscheiden, ob sie ihr Team um Hilfe bittet. Die Reparatur wird so zum Anlass für eine Veränderung in ihrer Zusammenarbeit.',
    check: ['Welche Fortsetzung macht aus dem Bruch eine Handlung?', ['Weil das Modell einbricht, bittet Mira das Team zurück in die Werkstatt.', 'Das Modell bricht ein. Danach zeigt die Uhr 9:45 Uhr.', 'Das Modell bricht ein. Die Kamera zeigt eine leere Tasse.'], 0, 'Miras Entscheidung folgt aus dem Problem und setzt etwas Neues in Gang.'],
    task: 'Schreiben Sie drei Ereignisse für eine eigene Geschichte auf. Verbinden Sie sie mit „weil“ und „deshalb“. Entfernen Sie testweise das mittlere Ereignis.',
    review: 'Beispiel: Weil die Pfeiler nass sind, versucht Mira sie zu kleben. Weil die Verbindung unter Last reißt, bittet sie das Team um Hilfe. Ohne den gescheiterten Versuch fehlt ein Grund für ihren Kurswechsel.'
  },
  {
    id: 'figur', title: 'Figur, Ziel und Konflikt', subtitle: 'Motivation, Widerstand und Einsatz', icon: 'person',
    lead: 'Das Publikum verfolgt eine Figur leichter, wenn es ihr Ziel versteht und erkennt, was bei einem Scheitern auf dem Spiel steht.',
    goals: ['Ein beobachtbares Ziel und ein inneres Bedürfnis formulieren', 'Ein Hindernis entwerfen, das eine schwierige Entscheidung auslöst'],
    theory: [
      ['Ziel und Bedürfnis', 'Ein äußeres Ziel lässt sich beobachten: Mira will, dass die Brücke bei der Präsentation ein Kilogramm trägt. Ihr inneres Bedürfnis könnte sein, Verantwortung mit anderen zu teilen. Diese beiden Ebenen können gegeneinander arbeiten. Je länger Mira allein repariert, desto unwahrscheinlicher wird der Erfolg.'],
      ['Widerstand und Einsatz', 'Ein Hindernis wird zum Konflikt, wenn es ein Ziel gefährdet. Der Regen ist Wetter. Der Regen auf den ungeeigneten Modellpfeilern gefährdet Miras Präsentation. Äußere Einsätze betreffen etwa einen Ausstellungsplatz. Ein persönlicher Einsatz wäre das Vertrauen ihres Teams.'],
      ['Figuren durch Entscheidungen zeigen', 'Eine Figurenbeschreibung hilft beim Entwurf. In der Szene zeigt sich der Charakter durch eine Wahl mit Folgen. Mira kann das beschädigte Modell als intakt ausgeben oder offen erklären, was schiefging, und eine improvisierte Variante vorstellen. Beide Wege haben einen Preis.'],
      ['Drei Ebenen von Konflikt', 'Robert McKee beschreibt Konflikt als Lücke zwischen dem, was eine Figur erwartet, und dem, was tatsächlich geschieht. Diese Lücke kann auf drei Ebenen entstehen. Ein innerer Konflikt spielt sich in der Figur ab, etwa als Angst, Fehler zu machen. Ein sozialer Konflikt entsteht mit anderen, zum Beispiel durch Widerstand im Team. Ein systemischer Konflikt kommt aus Strukturen wie starren Vorgaben, Altsystemen oder Fristen. Miras Konflikt verbindet alle drei: ihren Stolz, das ausgeschlossene Team und den festen Präsentationstermin.'],
      ['Welches Bedürfnis spricht die Geschichte an?', 'Das Modell der vier Grundbedürfnisse beschreibt vier Richtungen, in die Menschen streben: Sicherheit und Stabilität, Gemeinschaft, Freiheit und Unabhängigkeit sowie Entfaltung und Veränderung. Es geht auf Fritz Riemann zurück und wurde von Christoph Thomann als Riemann-Thomann-Modell für die Kommunikation weiterentwickelt. Man kann es sich wie die vier Ecken eines Raumes vorstellen: Jede Person hat Anteile an allen vier, steht aber an einer anderen Stelle im Raum. Für Ihre Geschichte heißt das: Dieselbe Funktion lässt sich als Sicherheit, als gemeinsames Erlebnis, als Selbstbestimmung oder als Chance auf Neues erzählen. Das Modell ist eine Faustregel aus der Kommunikationspsychologie, keine empirisch geprüfte Typologie. Welche Fassung passt, zeigt die Forschung mit Ihrer Zielgruppe.'],
      ['Wer ist in einer UX-Geschichte die Hauptfigur?', 'Als Faustregel gilt: Die Nutzerin oder der Nutzer ist die Hauptfigur, das Produkt hilft als Mentor. So bleibt der Blick auf Ziel und Hürde der Person. Die Regel ist kein Dogma. In einer Fallstudie kann auch das Designteam im Mittelpunkt stehen, etwa wenn es um eine schwierige Entscheidung im Projekt geht. Wichtig ist, dass klar bleibt, wessen Veränderung erzählt wird.']
    ],
    case: 'Mira hat das Team am Vortag weggeschickt, um die letzten Änderungen allein zu machen. Jetzt könnte ein Anruf das Modell retten. Gleichzeitig muss sie eingestehen, dass sie das Team zu früh ausgeschlossen hat.',
    check: ['Welche Änderung schafft einen persönlichen Einsatz?', ['Der Tisch bekommt eine andere Farbe.', 'Bei einem Scheitern verliert Mira womöglich das Vertrauen ihres Teams.', 'Die Uhr wird größer eingeblendet.'], 1, 'Das gefährdete Vertrauen erklärt, warum der Ausgang für Mira persönlich zählt.'],
    task: 'Entwickeln Sie eine Figur in vier Zeilen: Wer handelt? Was will die Figur bis wann? Was steht im Weg? Was verliert sie, wenn sie scheitert?',
    review: 'Prüfen Sie, ob jemand von außen erkennen könnte, wann das Ziel erreicht ist. Formulieren Sie dann zwei Handlungsoptionen, die jeweils etwas kosten.'
  },
  {
    id: 'struktur', title: 'Dramaturgie und Wendepunkte', subtitle: 'Anfang, Mitte und Ende', icon: 'arc',
    lead: 'Ein dramaturgisches Modell hilft beim Überarbeiten. Die Einteilung in drei Teile macht sichtbar, wo der Konflikt beginnt, sich verschärft und Folgen hat.',
    goals: ['Auslöser, Rückschlag, Höhepunkt und Auflösung in Szenen erkennen', 'Ein Ende aus den Entscheidungen der Figur entwickeln'],
    theory: [
      ['Anfang: Situation und Auslöser', 'Die Ausgangslage zeigt genug vom Alltag, damit die Störung eine Bedeutung bekommt. Zwei Einstellungen können genügen: das sorgfältig verpackte Modell und die durchnässte Verpackung. Der Auslöser schafft eine neue Lage, auf die die Figur reagieren muss.'],
      ['Mitte: Versuche verändern die Lage', 'In einer guten Mitte hinterlässt ein Versuch Spuren. Wenn drei Klebeversuche dieselbe Wirkung haben, entsteht Wiederholung. Scheitert der erste und kostet der zweite die letzte verfügbare Zeit, verschiebt sich die Entscheidungslage. Ein Wendepunkt kann aus einer neuen Information, einem Verlust oder einer Entscheidung entstehen.'],
      ['Ende: Höhepunkt und Konsequenz', 'Am Höhepunkt verdichtet sich der zentrale Konflikt. Miras Entscheidung, Hilfe zu holen, bekommt Gewicht, weil Alleinreparatur und Präsentation zugleich auf dem Spiel stehen. Die Auflösung zeigt, was sich daraus ergibt. Das Schlussbild kann den Anfang spiegeln: Erst hält Mira das Modell allein, am Ende tragen es drei Personen.']
    ],
    case: 'Ein Anruf wäre zu Beginn nur eine Möglichkeit. Nach dem gescheiterten Belastungstest ist er eine Entscheidung unter Zeitdruck. Die gleiche Handlung hat je nach Position im Verlauf eine andere Bedeutung.',
    check: ['Welche Auflösung greift Miras Entscheidung auf?', ['Die Ausstellung fällt unerwartet aus.', 'Ein zufällig gefundenes Ersatzmodell löst alles.', 'Das Team präsentiert die gemeinsam entwickelte Reparatur.'], 2, 'Die Konsequenz folgt aus Miras Entscheidung und schließt den Konflikt um die Zusammenarbeit.'],
    task: 'Ordnen Sie sechs Momente an: Ausgangslage, Auslöser, erster Versuch, Rückschlag, Entscheidung und Konsequenz. Markieren Sie den Moment, an dem sich der weitere Verlauf ändert.',
    review: 'Lesen Sie nur den Rückschlag, die Entscheidung und das Ende. Wenn der Zusammenhang erkennbar ist, trägt diese Kette das Finale. Die drei Akte sind eine Planungshilfe, die Szenenzahl bleibt frei.'
  },
  {
    id: 'spannung', title: 'Spannung und Rhythmus', subtitle: 'Erwartung, Tempo und Informationsvergabe', icon: 'pulse',
    lead: 'Spannung entsteht, wenn das Publikum den möglichen Ausgang einschätzen kann und ihm etwas daran liegt. Der Rhythmus gibt ihm Zeit, Folgen zu erwarten und zu verarbeiten.',
    goals: ['Suspense, Neugier und Überraschung anhand von Beispielen unterscheiden', 'Eine Spannungskurve mit konkreten Szenen begründen'],
    theory: [
      ['Drei Fragen an das Publikum', 'Suspense richtet sich auf ein kommendes Ereignis: Hält die Brücke? Neugier sucht eine Ursache oder Vorgeschichte: Warum ist der Pfeiler beschädigt? Eine Überraschung verändert plötzlich die Annahmen: Das scheinbar intakte Modell knickt ein. Dieselbe Szene kann diese Effekte kombinieren.'],
      ['Information gezielt dosieren', 'Sieht das Publikum den lockeren Pfeiler früher als Mira, kann es die Gefahr beim Tragen erwarten. Entdeckt es die Schwachstelle erst beim Bruch, erlebt es den Moment mit Mira. Ein früher Hinweis kann eine spätere Wendung vorbereiten, ohne ihren Ausgang zu verraten.'],
      ['Rhythmus und Kontrast', 'Eine Pause nach dem Belastungstest gibt der Entscheidung Raum. Bleibt jede Szene gleich angespannt, verlieren Höhepunkte ihr Gewicht. Eine Kurve zeigt, wie Sie den Verlauf beabsichtigen. Im Test mit Publikum finden Sie heraus, ob die Erwartungen tatsächlich entstehen.']
    ],
    case: 'Die Uhr zeigt 9:58 Uhr. In einer Einstellung sehen wir, wie sich ein Pfeiler biegt. Die nächste bleibt auf Miras Gesicht, während sie das Prüfgewicht anhebt. Die Spannung entsteht aus der erwarteten Folge.',
    check: ['Wie entsteht Suspense beim Belastungstest?', ['Das Publikum sieht das fertige Modell erst am Ende.', 'Das Publikum kennt die Schwachstelle, bevor Mira das Gewicht auflegt.', 'Der Bruch wird ohne vorherigen Hinweis gezeigt.'], 1, 'Das Vorwissen gibt dem Publikum Zeit, einen möglichen Bruch zu befürchten.'],
    task: 'Stellen Sie die Spannungskurve für Ihre eigene Geschichte ein und merken Sie sie sich als Kurve A. Verändern Sie dann mindestens zwei Stationen, zum Beispiel die steigende Handlung und den Höhepunkt. Vergleichen Sie beide Kurven und begründen Sie die Unterschiede mit einer offenen Frage und dem Wissen des Publikums.',
    review: 'Jeder hohe Wert braucht einen nachvollziehbaren Einsatz. Benennen Sie für den höchsten Punkt die Frage, die offen bleibt, und den Moment, in dem sie beantwortet wird. Prüfen Sie beim Vergleich, ob der höchste Punkt in beiden Kurven bei der wichtigsten Entscheidung liegt und ob die Auflösung dem Publikum Zeit lässt, die Folgen zu verarbeiten.'
  },
  {
    id: 'perspektive', title: 'Perspektive und Szene', subtitle: 'Wissensgrenzen und beobachtbare Details', icon: 'eye',
    lead: 'Perspektive regelt, was das Publikum mitbekommt. Ihre Wahl beeinflusst Nähe, Vertrauen und die Interpretation einer Szene.',
    goals: ['Eine Szene aus zwei Wissenspositionen entwickeln', 'Zeigen und Erzählen gezielt kombinieren'],
    theory: [
      ['Wer nimmt wahr?', 'Aus Miras Perspektive kann die Ankunft des Teams überraschend sein. Folgen wir Samir, sehen wir, wie er schon vorher in der Werkstatt Werkzeug sammelt. Der Perspektivwechsel liefert eine neue Information. Geben Sie beim Wechsel früh Orientierung, etwa durch Ort, Figur oder Zeit.'],
      ['Zeigen und erzählen', '„Mira war nervös“ verdichtet einen Zustand. „Mira glättet die Karten zum dritten Mal“ macht ihn in der Szene beobachtbar. Ein Detail wirkt, wenn es zum Moment passt und sich aus dem Kontext deuten lässt. Eine Zusammenfassung ist sinnvoll, wenn die nächste wichtige Entscheidung erst später fällt.'],
      ['Subtext', 'Wenn Mira sagt „Wir haben Zeit“, während sie die Uhr prüft, entsteht eine Spannung zwischen Worten und Verhalten. Subtext lässt das Publikum Schlüsse ziehen. Geben Sie genug Hinweise, damit verschiedene plausible Deutungen möglich bleiben und die zentrale Handlung verständlich ist.']
    ],
    case: 'Aus Miras Sicht ist Samirs Schweigen eine Zurückweisung. In seiner eigenen Szene sehen wir, dass er nach dem richtigen Werkzeug sucht. Die Szene kann denselben Moment zeigen und dabei eine andere Erwartung wecken.',
    check: ['Welches Detail macht Anspannung beobachtbar?', ['Mira war sehr nervös.', 'Die Situation war anstrengend.', 'Beim Aufruf faltet Mira ihre Karte so fest, dass sie einreißt.'], 2, 'Die sichtbare Handlung gibt dem Publikum einen Anhaltspunkt für Miras Zustand.'],
    task: 'Schreiben Sie denselben Moment in zwei kurzen Fassungen. Lassen Sie je eine Figur etwas wissen, das der anderen fehlt. Ersetzen Sie eine Gefühlsbeschreibung durch ein konkretes Detail.',
    review: 'Markieren Sie jede Information, die nur eine Figur wissen kann. Lesen Sie die Texte laut und prüfen Sie, ob die Details ohne Erklärung verständlich bleiben.'
  },
  {
    id: 'bild', title: 'Visuelles Erzählen', subtitle: 'Einstellungen, Montage und Storyboard', icon: 'film',
    lead: 'Eine Bildfolge gibt dem Publikum Hinweise, aus denen es Zeit, Raum und Handlung zusammensetzt. Ein Storyboard macht diese Entscheidungen vor der Produktion prüfbar.',
    goals: ['Bildausschnitte nach ihrer erzählerischen Aufgabe wählen', 'Eine Handlung in sechs Einstellungen mit Bild und Ton planen'],
    theory: [
      ['Bildausschnitt steuert Aufmerksamkeit', 'Eine Totale kann zeigen, wie weit der Tisch von der Bühne entfernt steht. Ein Detail zeigt den Riss, der aus der Entfernung unsichtbar bleibt. Eine Nahaufnahme von Mira lenkt auf ihre Reaktion. Fragen Sie vor jeder Einstellung, welche Information hinzukommt.'],
      ['Der Schnitt erzeugt einen Zusammenhang', 'Auf ein Bild des Risses folgt Miras Blick zum Team. Das Publikum kann beides als Problem und mögliche Lösung lesen. Drehen Sie die Reihenfolge um, sieht es zuerst, worauf sie reagiert, möglicherweise erst im nächsten Bild. Ein gleichbleibendes Merkmal wie die Brückenform erleichtert die Orientierung.'],
      ['Bild, Ton und Zugänglichkeit planen', 'Der Ton kann eine Information ergänzen: Eine Durchsage setzt eine Frist, während das Bild beim Modell bleibt. Notieren Sie im Storyboard auch relevante Geräusche und Dialoge. Planen Sie Untertitel für wichtige Toninformationen und eine zugängliche Beschreibung für visuelle Schlüsselmomente ein.']
    ],
    case: 'Zeigen Sie zuerst die leere Bühne in der Totalen. Schneiden Sie dann auf die gebrochene Strebe. Die Bildfolge verbindet den sichtbaren Defekt mit dem Ort, an dem das Modell gleich funktionieren soll.',
    check: ['Was sollte ein Schnitt vom Riss zu Miras Gesicht vermitteln?', ['Ihre Reaktion auf den gerade erkannten Schaden.', 'Ein anderes Projekt im Nebenzimmer.', 'Eine zweite Erklärung für einen bereits klaren Ort.'], 0, 'Detail und Reaktion verknüpfen die Information über den Schaden mit der Figur.'],
    task: 'Planen Sie sechs Einstellungen für Ihre Geschichte. Halten Sie Bildausschnitt, Handlung und Ton je Bild fest. Wählen Sie für die Entscheidung einen sichtbaren Moment.',
    review: 'Zeigen Sie die Bildfolge einer Person ohne Vorwissen. Kann sie Ziel, Hindernis und Entscheidung benennen? Prüfen Sie außerdem, welche Information bei stummem Ton oder ohne Bild verloren geht.'
  },
  {
    id: 'transmedia', title: 'Transmediales Storytelling', subtitle: 'Eine Storyworld, mehrere Einstiege', icon: 'network',
    lead: 'Eine Geschichte kann über Film, Audio, Web oder einen physischen Ort verteilt werden. Beim transmedialen Erzählen trägt jedes Medium etwas Eigenes zur gemeinsamen Erzählwelt bei.',
    goals: ['Adaption, Mehrfachverwertung und transmediale Erweiterung unterscheiden', 'Eigenständige Medienbeiträge, Einstiege und Übergänge entwerfen'],
    theory: [
      ['Was jedes Medium hinzufügt', 'Ein Film zeigt Miras Entscheidung während der Präsentation. Ein vertonter Tagebucheintrag von Samir kann erzählen, warum das Team am Vortag auseinandergegangen ist. Eine interaktive Webansicht kann Besucherinnen und Besucher verschiedene Lastverteilungen erproben lassen und enthüllen, wie ein verworfener Entwurf den späteren Erfolg vorbereitet. Das Medium bekommt seine Aufgabe aus dem erzählerischen Mehrwert.'],
      ['Adaption, Wiederverwendung und Erweiterung', 'Erzählt ein Comic dieselbe Handlung neu, ist er eine Adaption. Ein gekürzter Filmausschnitt auf einer zweiten Plattform ist Wiederverwendung. Folgt ein Comic dagegen einer Nebenfigur in einer bisher unbekannten Situation, kann er die Erzählwelt erweitern. Ein Projekt kann diese Formen miteinander verbinden.'],
      ['Einstiege und Übergänge', 'Ein Beitrag sollte genügend Kontext bieten, um für sich verständlich zu sein. Wer zuerst das Audio hört, erfährt dort, wer spricht und warum der Streit relevant ist. Ein sinnvoller Übergang weckt eine konkrete Frage. Eine verlinkte Skizze zum gescheiterten Prototyp beantwortet sie im Web. Planen Sie sichtbare Links und zugängliche Alternativen wie ein Transkript.'],
      ['Kontinuität und Beteiligung', 'Halten Sie in einer Story-Bibel gemeinsame Figuren, Orte, Zeitleiste und Regeln fest. Trennen Sie feststehende Fakten von offenen Bereichen für Beiträge des Publikums. Wenn Besucherinnen und Besucher eine Reparatur ausprobieren oder eigene Entwürfe beisteuern dürfen, machen Sie klar, ob ihre Entscheidung nur die eigene Erfahrung oder auch die weitere Handlung verändert.']
    ],
    case: 'Im fiktiven Projekt „Brücke um zehn“ erlebt das Publikum im Kurzfilm die Krise. Eine Audionotiz macht Samirs Sicht auf den Streit hörbar. Das Web-Labor zeigt die Entwurfsgeschichte und erlaubt eigene Versuche. Jedes Angebot erläutert den unmittelbaren Kontext und verweist optional auf die anderen Beiträge.',
    check: ['Welcher Beitrag erweitert die Erzählwelt?', ['Derselbe Filmausschnitt in einem anderen Seitenformat.', 'Eine Audioszene erzählt erstmals, weshalb Samir das Team verlassen hatte.', 'Ein Plakat zeigt das Filmcover und das Startdatum.'], 1, 'Samirs Audioszene ergänzt einen neuen Teil der gemeinsamen Erzählwelt.'],
    task: 'Entwerfen Sie drei Medienbeiträge. Beschreiben Sie für jeden Beitrag seinen eigenen erzählerischen Gewinn, den Kontext für neues Publikum und einen Übergang zu einem anderen Beitrag.',
    review: 'Entfernen Sie testweise ein Medium. Geht ein eigener erzählerischer Beitrag verloren? Bleiben die anderen Einstiege verständlich? Prüfen Sie die Fakten in allen drei Medien gegen dieselbe Zeitleiste.'
  },
  {
    id: 'transfer', title: 'Story entwickeln und testen', subtitle: 'Logline, Prototyp und Überarbeitung', icon: 'edit',
    lead: 'Ein kurzer Entwurf lässt sich schnell testen. So finden Sie heraus, an welchen Stellen Ihr Publikum mehr Orientierung braucht und wo es selbst Schlüsse ziehen kann.',
    goals: ['Eine Logline und eine überprüfbare Absicht formulieren', 'Rückmeldungen in konkrete Überarbeitungen übersetzen'],
    theory: [
      ['Mit der Logline fokussieren', 'Verdichten Sie Figur, Ziel und Konflikt auf einen Satz. Ein erster Entwurf kann nach diesem Muster entstehen: Als ein Ereignis die Lage verändert, muss eine Figur ein Ziel erreichen, obwohl ihr etwas Konkretes im Weg steht. Ersetzen Sie anschließend alle Platzhalter durch die eigenen Entscheidungen.'],
      ['Einen kleinen Prototyp wählen', 'Skizzieren Sie nur die Szenen, die Ihre offene Frage prüfen. Für Verständlichkeit genügen oft sechs Standbilder. Für einen Perspektivwechsel können zwei kurze Texte genügen. Ein transmedialer Test kann einen Einstieg im Audio und einen im Web simulieren, ohne das gesamte Projekt zu produzieren.'],
      ['Beobachten und überarbeiten', 'Fragen Sie nach dem Ziel der Figur, der entscheidenden Wahl und dem Moment, an dem eine Erwartung entstand. Lassen Sie zuerst frei erzählen. Wiederholt sich ein Missverständnis, überarbeiten Sie den passenden Hinweis und testen genau diese Stelle erneut. Bewahren Sie Varianten auf, damit sich Änderungen vergleichen lassen.']
    ],
    case: 'Zwei Personen denken, Samir habe das Modell kaputtgemacht. Im Entwurf fällt das Modell direkt nach seinem Auftreten. Ein früheres Detail des durchnässten Pfeilers kann die beabsichtigte Ursache erkennbar machen.',
    check: ['Welche Frage eignet sich für einen offenen Test?', ['Was wollte Mira erreichen, und woran haben Sie das erkannt?', 'Sie haben doch gesehen, dass Mira das Modell retten wollte?', 'Fanden Sie die Farben schön?'], 0, 'Die offene Frage prüft, ob Ziel und Hinweise ohne Vorgabe verstanden wurden.'],
    task: 'Schreiben Sie eine Logline, planen Sie einen kurzen Test und notieren Sie eine konkrete Änderung, die aus dem Test folgen könnte.',
    review: 'Vergleichen Sie erwartete und beobachtete Wirkung. Ändern Sie zuerst die Stelle, die das Verständnis von Ziel, Konflikt oder Entscheidung am stärksten beeinflusst.'
  }
];

/* Quiz: 15 Fragen, die über die Kontrollfragen der Lektionen hinausgehen */
export const quizQuestions = [
  ['Warum verbindet der Story Spine Ereignisse mit „Und deswegen“ statt mit „Und dann“?', ['Weil der Satzanfang die Geschichte kürzer macht.', 'Weil jedes Ereignis aus dem vorherigen folgen soll statt nur danach zu kommen.', 'Weil „Und dann“ nur in Rückblenden erlaubt ist.'], 1, '„Und deswegen“ verlangt eine Ursache. So wird aus einer Aufzählung eine Kette von Folgen.'],
  ['Was ändert sich bei einer Rückblende?', ['Die Reihenfolge, in der das Publikum Ereignisse erfährt.', 'Zwangsläufig das Ziel der Figur.', 'Die Ursachen aller Ereignisse.'], 0, 'Die Rückblende verändert die Informationsreihenfolge, nicht die Handlung selbst.'],
  ['Eine Nutzerin hat Angst, bei der Online-Steuererklärung einen Fehler zu machen. Welche Konfliktebene ist das?', ['Ein sozialer Konflikt, weil das Finanzamt beteiligt ist.', 'Ein systemischer Konflikt, weil Formulare Vorgaben machen.', 'Ein innerer Konflikt, weil er sich in der Person abspielt.'], 2, 'Die Angst liegt in der Person selbst. Die Vorgaben des Formulars wären eine zusätzliche systemische Ebene.'],
  ['Was kennzeichnet einen Schwellenhüter in einer Produktgeschichte?', ['Eine Hürde vor dem Eintritt in die neue Welt, etwa Registrierung oder Zahlungsdaten.', 'Die Person, die das Produkt zuerst empfiehlt.', 'Das letzte Hindernis direkt vor dem Höhepunkt.'], 0, 'Der Schwellenhüter prüft, ob die Heldin den Schritt in die neue Welt wagt. Gute Gestaltung erklärt diese Hürde.'],
  ['Was leistet das auslösende Ereignis (Inciting Incident)?', ['Es stellt die Hauptfigur zum ersten Mal vor.', 'Es bringt die Ausgangslage aus dem Gleichgewicht und erzeugt Handlungsbedarf.', 'Es beantwortet die zentrale Frage der Geschichte.'], 1, 'Erst durch die Störung muss die Figur handeln. Die Vorstellung der Figur gehört zur Ausgangslage.'],
  ['Wann ist eine ruhige Szene dramaturgisch relevant?', ['Wenn sie sich leicht entfernen lässt.', 'Wenn sie eine spätere Entscheidung vorbereitet.', 'Wenn sie genauso lang ist wie der Höhepunkt.'], 1, 'Die Szene kann Bedeutung für einen späteren Moment aufbauen.'],
  ['Alfred Hitchcock unterschied Suspense und Überraschung am Beispiel einer Bombe unter dem Tisch. Wann entsteht Suspense?', ['Wenn die Bombe ohne Vorwarnung explodiert.', 'Wenn die Figuren am Tisch von der Bombe wissen.', 'Wenn das Publikum von der Bombe weiß, die Figuren aber nicht.'], 2, 'Das Vorwissen des Publikums erzeugt die Erwartung. Ohne Hinweis bleibt nur ein kurzer Schreck.'],
  ['Was beschreibt Robert McKee als Lücke zwischen Erwartung und Ergebnis (Gap)?', ['Den Moment, in dem eine Handlung nicht die erwartete Wirkung hat und die Figur neu entscheiden muss.', 'Die Pause zwischen zwei Akten.', 'Den Abstand zwischen Logline und Handlung.'], 0, 'Im Interface entsteht diese Lücke etwa, wenn jemand einen Ein-Klick-Kauf erwartet und vier Pflichtfelder vorfindet.'],
  ['Welche Einstellungsgröße eignet sich, um Anspannung im Gesicht zu zeigen?', ['Totale', 'Halbnah', 'Nah'], 2, 'Die Nahaufnahme lenkt die Aufmerksamkeit auf Mimik und Reaktion.'],
  ['Welche Aufgabe eignet sich für eine Totale?', ['Ein Zittern der Hand im Detail zeigen.', 'Jede Figur automatisch sympathisch machen.', 'Die Lage von Bühne, Tisch und Figur räumlich verständlich machen.'], 2, 'Die Totale bietet Raumorientierung.'],
  ['Was hilft, wenn jemand über einen Nebenbeitrag einsteigt?', ['Ein kurzer eigener Kontext und ein optionaler Link zur Hauptgeschichte.', 'Ein vollständiges Vorwissen als Voraussetzung.', 'Die Auflösung der Hauptgeschichte als Überschrift.'], 0, 'Ein eigenständiger Einstieg erleichtert den Zugang.'],
  ['Was gehört in eine Story-Bibel?', ['Vor allem die Gestaltungsregeln für Logo und Farben.', 'Figuren, Zeitlinie und gemeinsame Regeln der Erzählwelt.', 'Ein Veröffentlichungsplan für alle Kanäle.'], 1, 'Die Story-Bibel hilft, Beiträge in verschiedenen Medien konsistent zu halten.'],
  ['Wozu dient der Golden Circle von Simon Sinek in einem Pitch?', ['Er legt die Reihenfolge der Akte fest.', 'Er beginnt mit dem Warum, bevor Vorgehen und Ergebnis folgen.', 'Er misst, wie überzeugend eine Präsentation war.'], 1, 'Das Modell ordnet Argumente: Warum, wie, was. Es ist eine Faustregel für Pitches, keine Erzählstruktur mit Figur und Konflikt.'],
  ['Welche Gefahr hat eine Case Study, die nur die Arbeitsschritte chronologisch auflistet?', ['Sie wird zu kurz für ein Portfolio.', 'Sie zeigt nicht, welches Problem eine Entscheidung ausgelöst hat und was sich dadurch verändert hat.', 'Sie verstößt gegen die Reihenfolge des Designprozesses.'], 1, 'Eine Liste zeigt Fleiß, aber keine Begründung. Erst Problem, Entscheidung und Folge machen die Arbeit nachvollziehbar.'],
  ['Wie prüfen Sie, ob die Ursache verständlich war?', ['Sie erklären sie vor dem Test.', 'Sie vergleichen die Länge aller Szenen.', 'Sie lassen das Publikum die Ursache mit eigenen Worten schildern.'], 2, 'Eine freie Antwort zeigt, welche Hinweise tatsächlich angekommen sind.']
];

/* Glossar: Begriff, Erklärung, Beispiel aus dem UX-Kontext */
export const terms = [
  ['Adaption', 'Übertragung einer bestehenden Handlung in ein anderes Medium.', 'Eine Fallstudie wird als kurzes Video neu erzählt.'],
  ['Archetyp', 'Wiederkehrende Rolle in Geschichten, etwa Heldin, Mentor, Schatten oder Schwellenhüter (nach C. G. Jung und Christopher Vogler).', 'Im Onboarding übernimmt das Produkt die Rolle des Mentors.'],
  ['Auslösendes Ereignis (Inciting Incident)', 'Ein Ereignis, das die Ausgangslage verändert und die Handlung in Gang bringt.', 'Eine Nutzerin stößt auf ein dringendes Problem und sucht nach einer Lösung.'],
  ['Diegese', 'Die erzählte Welt mit ihren eigenen Regeln.', 'Ein Designsystem sorgt dafür, dass sich ein Produkt auf allen Geräten wie eine stimmige Welt anfühlt.'],
  ['Einsatz', 'Was eine Figur durch den Ausgang der Handlung gewinnen oder verlieren kann.', 'Bei einem fehlgeschlagenen Ticketkauf verpasst jemand den Zug.'],
  ['Einstellung', 'Kontinuierlicher Bildausschnitt zwischen zwei Schnitten.', 'Ein Storyboard-Panel entspricht meist einer Einstellung.'],
  ['Einstellungsgröße', 'Wie viel von Figur und Raum ein Bild zeigt, etwa Totale, Halbnah, Nah oder Detail.', 'Ein Detail zeigt in einem Erklärvideo den Finger auf dem Button.'],
  ['Erwartungslücke (Gap)', 'Nach Robert McKee die Lücke zwischen dem, was eine Figur erwartet, und dem, was geschieht.', 'Jemand erwartet einen Ein-Klick-Kauf und findet vier Pflichtfelder vor.'],
  ['Erzählperspektive', 'Organisation von Wahrnehmung und Wissen in der Erzählung.', 'Eine Journey Map zeigt denselben Vorgang aus Sicht der Kundin und des Supports.'],
  ['Golden Circle', 'Kommunikationsmodell von Simon Sinek: zuerst das Warum, dann das Wie, zuletzt das Was. Ein Pitch-Modell, keine Erzählstruktur.', 'Ein Projektpitch beginnt mit dem Anliegen, nicht mit der Feature-Liste.'],
  ['Heldenreise (Monomythos)', 'Von Joseph Campbell beschriebenes Grundmuster: Aufbruch, Prüfung und Rückkehr einer verwandelten Figur. Christopher Vogler hat es für Drehbücher in zwölf Stationen gefasst.', 'Ein Onboarding führt von der ersten Hürde zum ersten eigenen Erfolg.'],
  ['Hook', 'Einstieg, der in den ersten Sekunden Neugier weckt.', 'Ein Pitch beginnt mit einer Frage aus dem Alltag des Publikums.'],
  ['Höhepunkt (Klimax)', 'Moment der größten Anspannung, in dem die zentrale Entscheidung fällt.', 'Der entscheidende Schritt im Bezahlvorgang.'],
  ['Katharsis', 'Nach Aristoteles die Entlastung des Publikums am Ende einer Tragödie. Heute oft allgemein für die Erleichterung nach der Auflösung.', 'Die Bestätigung nach einer erledigten Aufgabe schließt den Vorgang spürbar ab.'],
  ['Kausalität', 'Zusammenhang von Ursache und Folge.', 'Eine Case Study zeigt, welche Beobachtung zu welcher Entwurfsentscheidung geführt hat.'],
  ['Konflikt', 'Widerstand, der ein Ziel gefährdet oder zwei Ziele unvereinbar macht. Er kann innerlich, sozial oder systemisch sein.', 'Ein Formular verlangt Daten, die die Nutzerin gerade nicht zur Hand hat.'],
  ['Logline', 'Verdichtung einer Geschichte auf einen Satz mit Figur, Ziel und Konflikt.', 'Der erste Satz einer Portfolio-Fallstudie.'],
  ['Medienadäquanz', 'Jedes Medium erzählt das, was es am besten kann.', 'Die Uhr zeigt nur die nächste Abfahrt, die Detailplanung bleibt auf dem Smartphone.'],
  ['Mentor', 'Figur, die die Heldin mit Wissen oder Werkzeugen ausstattet, ohne an ihrer Stelle zu handeln.', 'Ein Einführungsdialog zeigt, wie die erste Aufgabe gelingt.'],
  ['Migratory Cues', 'Hinweise, die zum Wechsel in ein anderes Medium einladen (Begriff aus der Transmedia-Forschung).', 'Die Uhr meldet: „Ausführliche Auswertung auf dem Smartphone“.'],
  ['Montage', 'Auswahl und Anordnung von Einstellungen, durch die ein Zusammenhang entsteht.', 'In einem Produktvideo folgt auf den Fehler direkt die Lösung im Interface.'],
  ['Negative Capability', 'Bewusst gelassene Lücken, die das Publikum neugierig machen und selbst füllen kann.', 'Gesperrte Bereiche deuten an, was nach den ersten Schritten möglich wird.'],
  ['Rabbit Hole', 'Einstiegspunkt, der in eine größere Erzählwelt hineinführt.', 'Ein QR-Code auf einem Plakat führt zu einer interaktiven Projektseite.'],
  ['Retardierendes Moment', 'Verzögerung kurz vor dem Ende, die den Ausgang noch einmal offen erscheinen lässt.', 'Im Pitch taucht kurz vor dem Ergebnis ein letztes Hindernis auf.'],
  ['Schatten', 'Gegenspieler der Heldin. Muss keine Person sein, auch Umstände können diese Rolle einnehmen.', 'Medienbrüche, Zeitdruck oder die Angst vor Fehlern.'],
  ['Schwellenhüter', 'Hürde vor dem Eintritt in die neue Welt, die prüft, ob die Heldin den Schritt wagt.', 'Registrierung, Zwei-Faktor-Anmeldung oder eine Bezahlschranke.'],
  ['Show, don’t tell', 'Einen Zustand durch beobachtbare Handlung zeigen, statt ihn zu behaupten.', 'Statt „schnell und einfach“ eine Situation, in der die Zahlung vor dem Kassenbon fertig ist.'],
  ['Story-Bibel', 'Referenz für Figuren, Weltregeln, Orte und Zeitlinie eines Projekts.', 'Ein Projektwiki hält Tonalität und Personas für alle Kanäle fest.'],
  ['Story Spine', 'Satzgerüst von Kenn Adams, bekannt geworden über Pixar: Es war einmal … Jeden Tag … Bis eines Tages … Und deswegen … Bis schließlich … Und seitdem …', 'Gerüst für die Erzählung einer UX-Fallstudie.'],
  ['StoryBrand (SB7)', 'Marketing-Modell von Donald Miller in sieben Schritten: Figur, Problem, Guide, Plan, Handlungsaufforderung, drohendes Scheitern, Erfolg.', 'Eine Landingpage stellt die Kundin als Heldin und das Produkt als Guide dar.'],
  ['Storyboard', 'Gezeichnete oder beschriebene Abfolge geplanter Einstellungen.', 'Ein UX-Storyboard zeigt Kontext, Problem, Interaktion und Ergebnis in vier Bildern.'],
  ['Storyworld', 'Gemeinsame Erzählwelt mit Figuren, Orten, Vorgeschichte und Regeln.', 'Ein Dienst mit App, Website und Ladengeschäft, die sich aufeinander beziehen.'],
  ['Subtext', 'Bedeutung, die aus Kontext und Verhalten erschlossen wird.', 'In einem Usability-Test sagt jemand „passt schon“ und bricht den Vorgang ab.'],
  ['Suspense', 'Spannung in der Erwartung eines möglichen Ereignisses. Im Unterschied zur Überraschung weiß das Publikum, was droht.', 'Eine Fortschrittsanzeige macht sichtbar, was noch kommt, statt Kosten am Ende zu überraschen.'],
  ['Transmediales Storytelling', 'Koordiniertes Erzählen über mehrere Medien, die jeweils eigenständige Beiträge zur gemeinsamen Erzählwelt liefern.', 'Film, Audio und interaktive Karte erzählen je einen Teil eines Campusprojekts.'],
  ['Vier Grundbedürfnisse (Riemann-Thomann-Modell)', 'Faustregel aus der Kommunikationspsychologie: Menschen streben in unterschiedlichem Maß nach Sicherheit (Dauer), Gemeinschaft (Nähe), Freiheit (Distanz) und Entfaltung (Wechsel). Bildlich als vier Ecken eines Raumes beschrieben.', 'Dieselbe Funktion wird für eine sicherheitsorientierte Zielgruppe als verlässlich, für eine freiheitsorientierte als selbstbestimmt erzählt.'],
  ['Wendepunkt', 'Ein Ereignis oder eine Entscheidung, die den weiteren Verlauf wesentlich verändert.', 'In einer Case Study der Testbefund, der den Entwurf umgeworfen hat.'],
  ['Worldbuilding', 'Entwurf einer Erzählwelt, die reicher ist als eine einzelne Geschichte.', 'Eine Service Blueprint zeigt alle Orte, an denen der Dienst erlebt wird.']
];
