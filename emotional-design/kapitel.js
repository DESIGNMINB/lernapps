/* Kapitel „Emotional Design & Affective Computing“.
   Abschnitte: { h, p: [Absätze], list, img: [Bildschlüssel], fig: Diagrammschlüssel, demo, table } */
export const chapters = [
  {
    id: 'emotionen', title: 'Wie Menschen fühlen', period: 'Teil 1 · Psychologische Grundlagen', icon: 'heart',
    lead: 'Wer Gefühle gestalten oder messen will, braucht ein Modell davon, was Emotionen sind. Die Psychologie bietet zwei große Familien: kategoriale Modelle mit wenigen Grundemotionen und dimensionale Modelle, die Gefühle in einem Raum verorten.',
    sections: [
      { h: 'Emotion, Stimmung, Affekt', p: [
        'Im Alltag werden die Begriffe oft gleich verwendet, in der Forschung nicht. Eine <b>Emotion</b> ist eine kurze, auf einen Anlass bezogene Reaktion: Ärger über eine abgelehnte Zahlung. Eine <b>Stimmung</b> hält länger an und hat oft keinen klaren Auslöser. <b>Affekt</b> ist der Oberbegriff für alle gefühlsmäßigen Zustände.',
        'Für die Gestaltung ist das wichtig: Ein Interface löst selten tiefe Gefühle aus, aber es färbt Momente. Eine einzige Fehlermeldung kann aus leichter Anspannung Ärger machen, ein gelungenes Feedback aus Unsicherheit Erleichterung.'
      ] },
      { h: 'Kategoriale Modelle: Grundemotionen nach Ekman', p: [
        'Paul Ekman und Wallace V. Friesen zeigten 1971 Menschen in Papua-Neuguinea Fotos von Gesichtsausdrücken und folgerten, dass einige Ausdrücke kulturübergreifend erkannt werden. Daraus entstand die Idee von <b>Grundemotionen</b> (Basisemotionen): Freude, Traurigkeit, Ärger, Angst, Überraschung und Ekel, später ergänzt um Verachtung. Ekman fasste die Argumente 1992 im Aufsatz „An argument for basic emotions“ zusammen.',
        'Kategoriale Modelle sind anschaulich und leicht zu codieren. Deshalb bauen viele Systeme zur Emotionserkennung bis heute auf ihnen auf: Sie ordnen ein Gesicht einer von sechs oder sieben Klassen zu.'
      ], table: {
        head: ['Grundemotion', 'Typischer Anlass im Interface', 'Mögliche Gestaltungsantwort'],
        rows: [
          ['Freude', 'Aufgabe erledigt, Ziel erreicht', 'Erfolg bestätigen, kurz feiern, nicht übertreiben'],
          ['Ärger', 'Daten verloren, Vorgang blockiert', 'Ursache nennen, Lösung anbieten, Eingaben retten'],
          ['Angst', 'Zahlung, Löschen, Datenschutz', 'Sicherheit zeigen, Rückgängig ermöglichen'],
          ['Überraschung', 'Unerwartetes Verhalten', 'Erklären, was passiert ist und warum'],
          ['Traurigkeit', 'Abschied, Verlust, Kündigung', 'Respektvoll und ohne Druck formulieren'],
          ['Ekel', 'Aufdringliche Werbung, Täuschung', 'Vermeiden: Vertrauen ist schwer zurückzugewinnen']
        ] } },
      { h: 'Dimensionale Modelle: das Circumplex-Modell nach Russell', p: [
        'James A. Russell schlug 1980 vor, Gefühle nicht in Kästchen zu sortieren, sondern in einem Kreis aus zwei Dimensionen anzuordnen. Die waagerechte Achse ist die <b>Valenz</b>: wie angenehm oder unangenehm sich etwas anfühlt. Die senkrechte Achse ist das <b>Arousal</b> (Erregung, Aktivierung): wie ruhig oder aufgewühlt man ist.',
        'Begeisterung liegt oben rechts (angenehm und aktiviert), Zufriedenheit unten rechts (angenehm und ruhig), Stress oben links, Niedergeschlagenheit unten links. Der Vorteil: Auch Zwischentöne und Mischungen lassen sich verorten. Für Interfaces ist das Modell besonders nützlich, weil viele Momente keine klare Grundemotion auslösen, aber sehr wohl angenehm oder unangenehm, beruhigend oder aufregend sind.'
      ], fig: 'circumplex' },
      { h: 'Probieren Sie es aus: Momente verorten', p: ['In der Übung <a href="#u-circumplex">Ü1 Circumplex</a> ziehen Sie Karten mit typischen Interface-Momenten wie „Error 500“ oder „Erfolgreicher Checkout“ auf das Koordinatensystem. Mit der Tastatur verschieben Sie die Karten mit den Pfeiltasten.'] },
      { h: 'Kritik: Gesichter sind keine Gefühlsanzeigen', p: [
        'Die Annahme, man könne Gefühle zuverlässig vom Gesicht ablesen, ist umstritten. Lisa Feldman Barrett und Kolleginnen und Kollegen werteten 2019 in „Emotional Expressions Reconsidered“ einen großen Teil der Forschung dazu aus. Ihr Ergebnis: Menschen lächeln nicht zuverlässig, wenn sie sich freuen, und ein Stirnrunzeln bedeutet nicht zuverlässig Ärger. Dieselbe Mimik kann je nach Situation, Person und Kultur Verschiedenes bedeuten.',
        'Barrett und Kolleginnen und Kollegen prüften vier Kriterien: Zuverlässigkeit (tritt der Ausdruck bei der Emotion regelmäßig auf?), Spezifität (tritt er nur bei dieser Emotion auf?), Verallgemeinerbarkeit (gilt das über Kulturen hinweg?) und Validität (zeigt er wirklich den inneren Zustand?). Keines der Kriterien sahen sie als ausreichend erfüllt.',
        'Für die Medieninformatik folgt daraus: Ein System kann Gesichtsbewegungen erkennen, aber nicht sicher, was eine Person fühlt. Teil 4 und Teil 6 greifen diesen Punkt wieder auf.'
      ] }
    ],
    task: { title: 'Ihre Beobachtung', text: 'Denken Sie an einen Moment, in dem Sie sich über eine App oder Website geärgert oder gefreut haben.', fields: ['Wo würden Sie den Moment im Circumplex verorten (Valenz, Arousal)?', 'Hätte eine Kamera Ihr Gefühl an Ihrem Gesicht erkennen können? Warum oder warum nicht?'] },
    merke: [
      'Kategoriale Modelle (Ekman) arbeiten mit wenigen Grundemotionen wie Freude, Ärger, Angst, Traurigkeit, Überraschung und Ekel.',
      'Das Circumplex-Modell (Russell 1980) ordnet Gefühle nach Valenz (angenehm bis unangenehm) und Arousal (ruhig bis aktiviert).',
      'Für Interfaces ist das dimensionale Modell oft nützlicher, weil es Zwischentöne erfasst.',
      'Barrett et al. (2019): Gesichtsbewegungen sind kein zuverlässiger Hinweis auf Gefühle.'
    ]
  },
  {
    id: 'joy', title: 'Vom Usability-Fokus zum Joy of Use', period: 'Teil 2 · Design-Ebenen', icon: 'spark',
    lead: 'Ein Produkt kann fehlerfrei bedienbar sein und trotzdem niemanden begeistern. Don Norman beschreibt in „Emotional Design“ (2004) drei Ebenen, auf denen Gestaltung wirkt: viszeral, verhaltensbezogen und reflexiv.',
    sections: [
      { h: 'Warum Gefühle für Usability zählen', p: [
        'Norman beginnt sein Buch mit drei Teekannen aus seiner Sammlung: einer absichtlich unbrauchbaren, einer schönen und einer klug konstruierten. Er besitzt sie, obwohl nur eine davon wirklich praktisch ist. Seine These: Wir bewerten Dinge nicht nur danach, wie gut sie funktionieren.',
        'Schon 1995 hatten Masaaki Kurosu und Kaori Kashimura beobachtet, dass Testpersonen schöner gestaltete Geldautomaten-Oberflächen auch für leichter bedienbar hielten. Dieser <b>Ästhetik-Usability-Effekt</b> erklärt Normans Satz „Attractive things work better“: Positive Gefühle machen Menschen geduldiger und kreativer, kleine Hürden fallen weniger ins Gewicht.'
      ], img: ['objekte'] },
      { h: 'Die drei Ebenen nach Norman', table: {
        head: ['Ebene', 'Worum es geht', 'Leitfrage', 'Beispiel im Interface'],
        rows: [
          ['Viszeral (visceral)', 'Erster Eindruck, unbewusst und schnell: Form, Farbe, Klang', 'Wie wirkt es auf den ersten Blick?', 'Farbwelt, Typografie, Illustration, Startbildschirm'],
          ['Verhaltensbezogen (behavioral)', 'Erleben beim Benutzen: Funktion, Verständlichkeit, Kontrolle', 'Wie fühlt es sich an, damit zu arbeiten?', 'Klare Rückmeldungen, schnelle Reaktion, Rückgängig'],
          ['Reflexiv (reflective)', 'Bewusstes Nachdenken: Bedeutung, Selbstbild, Erinnerung', 'Was sagt es über mich, woran erinnere ich mich?', 'Fortschritt sichtbar machen, Erfolge teilen, persönliche Geschichte']
        ] }, fig: 'ebenen' },
      { h: 'Probieren Sie es aus: drei Schalter, drei Ebenen', p: ['Das Lern-Dashboard unten ist absichtlich nackt. Schalten Sie die Ebenen einzeln zu und beobachten Sie, was sich ändert. Die Erklärung unter dem Dashboard benennt jeweils, was die Ebene beiträgt.'], demo: 'ebenen' },
      { h: 'Pragmatische und hedonische Qualität', p: [
        'Marc Hassenzahl unterscheidet zwei Arten von Qualität. <b>Pragmatische Qualität</b> beschreibt, wie gut ein Produkt hilft, Ziele zu erreichen: effizient, verständlich, kontrollierbar. <b>Hedonische Qualität</b> beschreibt, wie sehr es anregt und wie gut man sich damit identifizieren kann. Gemessen wird das zum Beispiel mit dem Fragebogen AttrakDiff (Hassenzahl, Burmester und Koller 2003).',
        'Der verbreitete <b>User Experience Questionnaire (UEQ)</b> von Laugwitz, Held und Schrepp (2008) greift beide Seiten auf: Durchschaubarkeit, Effizienz und Steuerbarkeit sind pragmatisch, Stimulation und Originalität hedonisch, dazu kommt die Attraktivität. Wie Sie den UEQ einsetzen, lernen Sie im Modul <a href="../ux-evaluation/#messen">UX &amp; Evaluation, Kapitel Messen und Fragebögen</a>.'
      ] },
      { h: 'Joy of Use ist kein Zuckerguss', p: [
        'Freude an der Nutzung entsteht nicht durch Konfetti allein. Wer eine schlechte Verhaltensebene mit hübschen Animationen überdeckt, enttäuscht spätestens beim zweiten Fehler. Die Reihenfolge ist daher meist: erst die verhaltensbezogene Ebene solide machen, dann die viszerale und reflexive Ebene gezielt gestalten.'
      ] }
    ],
    task: { title: 'Ihre Analyse', text: 'Wählen Sie eine App, die Sie gern benutzen.', fields: ['Was gefällt Ihnen viszeral, also auf den ersten Blick?', 'Was macht die Nutzung angenehm (verhaltensbezogen)?', 'Was bedeutet Ihnen die App, oder was sagt sie über Sie (reflexiv)?'] },
    merke: [
      'Norman (2004): viszerale Ebene (erster Eindruck), verhaltensbezogene Ebene (Nutzung), reflexive Ebene (Bedeutung und Selbstbild).',
      'Ästhetik-Usability-Effekt (Kurosu und Kashimura 1995): Schönes wird als besser bedienbar wahrgenommen.',
      'Hassenzahl: pragmatische Qualität (Ziele erreichen) und hedonische Qualität (Anregung, Identifikation).',
      'Der UEQ misst beide Seiten, siehe Modul UX & Evaluation.'
    ]
  },
  {
    id: 'handwerk', title: 'Handwerkszeug für Emotional Design', period: 'Teil 3 · Werkzeuge', icon: 'tool',
    lead: 'Gefühle entstehen im Detail: in einer kleinen Animation, in einer Farbe, in einem Satz. Drei Werkzeuge stehen im Mittelpunkt: Microinteractions, visuelle Semantik und Tone of Voice.',
    sections: [
      { h: 'Microinteractions nach Saffer', p: [
        'Dan Saffer beschreibt in „Microinteractions“ (2013) die kleinen, abgeschlossenen Momente eines Produkts, die genau eine Aufgabe erledigen: einen Schalter umlegen, ein Passwort prüfen, etwas als Favorit markieren. Jede Microinteraction besteht aus vier Teilen:'
      ], list: [
        '<b>Auslöser (Trigger):</b> Was startet sie? Ein Klick, eine Geste oder ein Systemereignis.',
        '<b>Regeln (Rules):</b> Was darf passieren, was nicht?',
        '<b>Feedback:</b> Wie erfahren Menschen, was passiert? Bild, Ton, Bewegung, Vibration.',
        '<b>Schleifen und Modi (Loops and Modes):</b> Was passiert bei Wiederholung, über die Zeit, in Sonderfällen?'
      ], img: ['mikro'] },
      { h: 'Probieren Sie es aus: drei Microinteractions', p: ['Jede Karte enthält eine funktionierende Microinteraction. Darunter steht, wie sich die vier Teile nach Saffer darin zeigen. Wenn Ihr System reduzierte Bewegung eingestellt hat, sehen Sie das Feedback ohne Animation.'], demo: 'mikro' },
      { h: 'Visuelle Semantik', p: [
        'Farben, Formen und Bewegungen tragen Bedeutung, bevor ein Wort gelesen wird. Runde Formen und warme Farben wirken eher freundlich und nahbar, eckige Formen und kühle Farben eher sachlich und präzise. Schnelle, federnde Bewegung wirkt verspielt, ruhige, gleichmäßige Bewegung seriös.',
        'Diese Zuordnungen sind Tendenzen, keine Naturgesetze. Sie hängen von Kultur und Kontext ab. Rot steht in vielen Interfaces für Fehler, in anderen Zusammenhängen für Glück oder Liebe. Prüfen Sie daher immer mit der Zielgruppe, und verlassen Sie sich nie allein auf Farbe: Ein Fehler braucht auch einen Text und ein Symbol.'
      ] },
      { h: 'Tone of Voice', p: [
        'Wie ein Produkt spricht, prägt, wie es empfunden wird. Die Nielsen Norman Group beschreibt den Ton mit vier Dimensionen, jeweils als Skala zwischen zwei Polen. Ein Produkt kann seine Grundstimme behalten und den Ton je nach Situation anpassen: In einer Fehlermeldung ist Humor riskant, in einer Erfolgsmeldung oft willkommen.'
      ], table: {
        head: ['Dimension', 'Pol A', 'Pol B'],
        rows: [
          ['Humor', 'witzig', 'ernst'],
          ['Förmlichkeit', 'förmlich', 'locker'],
          ['Respekt', 'respektvoll', 'respektlos, frech'],
          ['Begeisterung', 'begeistert', 'sachlich']
        ] } },
      { h: 'Probieren Sie es aus: Systemmeldungen vorher und nachher', p: ['Sechs typische Meldungen, jeweils in einer schlechten und einer überarbeiteten Fassung. Drehen Sie die Karten um und lesen Sie, warum die neue Fassung besser wirkt.'], demo: 'vorher' }
    ],
    task: { title: 'Ihre Überarbeitung', text: 'Suchen Sie eine Fehlermeldung aus einem Produkt, das Sie nutzen, oder erfinden Sie eine typische.', fields: ['Originaltext', 'Ihre überarbeitete Fassung: Was ist passiert, warum, und was kann die Person jetzt tun?'] },
    merke: [
      'Microinteractions (Saffer 2013) bestehen aus Auslöser, Regeln, Feedback sowie Schleifen und Modi.',
      'Visuelle Semantik: Form, Farbe und Bewegung tragen Bedeutung, abhängig von Kultur und Kontext.',
      'Tone of Voice nach NN/g: Humor, Förmlichkeit, Respekt und Begeisterung als Skalen.',
      'Gute Fehlermeldungen sagen, was passiert ist, warum, und was man jetzt tun kann, ohne Schuld zuzuweisen.'
    ]
  },
  {
    id: 'affective', title: 'Affective Computing: Maschinen, die Gefühle schätzen', period: 'Teil 4 · Emotionserkennung', icon: 'sensor',
    lead: 'Rosalind Picard prägte 1997 mit ihrem Buch „Affective Computing“ ein Forschungsfeld: Computer sollen Gefühle erkennen, ausdrücken und berücksichtigen können. Heute werten Systeme Gesichter, Texte, Stimmen und Körpersignale aus. Was sie liefern, sind Schätzungen, keine Gewissheiten.',
    sections: [
      { h: 'Die Idee', p: [
        'Picard, Professorin am MIT Media Lab, beschrieb Affective Computing zunächst 1995 in einem technischen Bericht und 1997 ausführlich im gleichnamigen Buch. Gemeint ist Computertechnik, die mit Gefühlen zu tun hat: sie erkennt, aus ihnen entsteht oder sie gezielt beeinflusst. Die Hoffnung: Lernsoftware, die merkt, wenn jemand frustriert ist, oder Hilfsmittel für Menschen, denen das Lesen von Gefühlen schwerfällt.'
      ], img: ['sensoren'] },
      { h: 'Vier Kanäle der Emotionserkennung', table: {
        head: ['Kanal', 'Verfahren', 'Was gemessen wird', 'Grenzen'],
        rows: [
          ['Gesicht', 'Facial Action Coding System (FACS), Ekman und Friesen 1978, überarbeitet 2002', 'Action Units: einzelne Muskelbewegungen, etwa AU 12 (Mundwinkel heben) oder AU 4 (Brauen senken)', 'Bewegung ist nicht gleich Gefühl; Licht, Kamera, Hautfarbe und Kultur beeinflussen die Erkennung'],
          ['Text', 'Sentiment-Analyse', 'Polarität (positiv, neutral, negativ), teils einzelne Emotionen', 'Ironie, Verneinung, Dialekt und Fachsprache führen zu Fehlern'],
          ['Haut', 'Elektrodermale Aktivität (EDA), früher galvanische Hautreaktion (GSR)', 'Leitfähigkeit der Haut durch Schweißdrüsen, gesteuert vom sympathischen Nervensystem', 'Zeigt Aktivierung, aber nicht, ob sie angenehm oder unangenehm ist; Wärme und Bewegung stören'],
          ['Herz', 'Herzfrequenz und Herzratenvariabilität (HRV)', 'Schläge pro Minute und Schwankung der Abstände zwischen Schlägen; geringe HRV kann auf Stress hindeuten', 'Sport, Koffein, Krankheit und Körperhaltung verändern die Werte ebenso']
        ] } },
      { h: 'Multimodale Fusion', p: [
        'Weil jeder Kanal für sich unzuverlässig ist, kombinieren Systeme mehrere Kanäle. Bei der <b>frühen Fusion</b> werden die Merkmale aller Sensoren zusammengeführt, bevor ein Modell entscheidet. Bei der <b>späten Fusion</b> schätzt jeder Kanal für sich, und die Schätzungen werden danach gewichtet zusammengefasst. Mehr Kanäle können die Schätzung stabiler machen, aber sie erheben auch mehr und sensiblere Daten.'
      ], fig: 'fusion' },
      { h: 'Probieren Sie es aus: das simulierte Sensor-Dashboard', p: [
        'Das Dashboard zeigt eine erfundene Person beim Bezahlen in einem Webshop. Nach etwa der Hälfte der Zeit schlägt die Zahlung fehl. Schalten Sie Sensoren zu und ab und beobachten Sie, wie sich der fiktive <b>Frustrations-Index</b> und seine Unsicherheit verändern. Mit dem Schalter „Störfaktor“ steigt der Puls aus einem anderen Grund.',
        '<b>Wichtig:</b> Alles ist simuliert. Die Seite nutzt weder Kamera noch Mikrofon, und es werden keine Daten erhoben oder gespeichert.'
      ], demo: 'sensoren' },
      { h: 'Grenzen der Messbarkeit', list: [
        '<b>Validität:</b> Messbar sind Signale wie Muskelbewegung, Hautleitfähigkeit oder Wortwahl. Das Gefühl selbst ist nicht direkt messbar (vgl. Barrett et al. 2019).',
        '<b>Kontext:</b> Ein hoher Puls kann Ärger, Vorfreude, Treppensteigen oder Kaffee bedeuten. Ohne Kontext ist der Wert mehrdeutig.',
        '<b>Bias:</b> Trainingsdaten bilden nicht alle Menschen gleich gut ab. Teil 6 zeigt, wie groß die Unterschiede sein können.',
        '<b>Rückwirkung:</b> Wer sich beobachtet weiß, verhält sich anders.',
        '<b>Recht:</b> Gesichts- und Körperdaten sind biometrische Daten. Die KI-Verordnung der EU verbietet Emotionserkennung am Arbeitsplatz und in Bildungseinrichtungen, siehe Teil 6.'
      ] }
    ],
    merke: [
      'Affective Computing geht auf Rosalind Picard zurück (MIT, Buch 1997).',
      'Kanäle: Gesicht (FACS, Action Units), Text (Sentiment-Analyse), Haut (EDA/GSR), Herz (Herzfrequenz, HRV).',
      'EDA zeigt Aktivierung, nicht Valenz. Ein einzelner Kanal ist mehrdeutig.',
      'Fusion macht Schätzungen stabiler, aber nicht zu Wissen über das innere Erleben.',
      'Jeder Index für Gefühle ist ein Modell mit Unsicherheit, kein Messwert der Wahrheit.'
    ]
  },
  {
    id: 'ethik', title: 'Die dunkle Seite: Ethik, Bias und Dark Patterns', period: 'Teil 6 · Ethik', icon: 'shield',
    lead: 'Wer Gefühle gestalten kann, kann sie auch ausnutzen. Und wer Gefühle automatisch erkennen will, irrt nicht für alle Menschen gleich oft. Dieses Kapitel zeigt die Risiken und die Regeln, die heute in der EU gelten.',
    sections: [
      { h: 'Emotionale Manipulation', p: [
        'Harry Brignull führte 2010 den Begriff <b>Dark Patterns</b> ein, heute spricht er von <b>Deceptive Patterns</b>. Viele dieser Muster arbeiten mit Gefühlen: mit Scham beim Ablehnen (<b>Confirmshaming</b>), mit Angst, etwas zu verpassen (künstliche Knappheit und Dringlichkeit), mit Schuldgefühlen beim Kündigen.',
        'Der Unterschied zwischen Emotional Design und Manipulation liegt nicht in der Technik, sondern im Zweck: Hilft die emotionale Gestaltung den Menschen, ihre eigenen Ziele zu erreichen, oder bringt sie sie dazu, gegen ihre Absicht zu handeln?'
      ] },
      { h: 'Bias in der Gesichtsanalyse', p: [
        'Joy Buolamwini und Timnit Gebru untersuchten 2018 in der Studie „Gender Shades“ drei kommerzielle Systeme, die aus Gesichtsfotos das Geschlecht bestimmen. Bei Männern mit heller Haut lag die Fehlerquote höchstens bei 0,8 Prozent, bei Frauen mit dunkler Haut bei bis zu 34,7 Prozent. Die Ursache lag vor allem in unausgewogenen Trainings- und Testdaten.',
        'Emotionserkennung baut auf denselben Verfahren der Gesichtsanalyse auf. Wenn schon das Erkennen von Gesichtsmerkmalen ungleich gut funktioniert, sind auch die daraus abgeleiteten Gefühlsschätzungen für manche Gruppen schlechter. Fehler treffen dann genau die Menschen, die ohnehin häufiger benachteiligt werden.'
      ], img: ['hoersaal'] },
      { h: 'Probieren Sie es aus: die Fallgalerie', p: ['Jede Karte beschreibt einen erfundenen, aber typischen Fall. Überlegen Sie zuerst selbst, was hier problematisch ist, und decken Sie dann die Auflösung auf.'], demo: 'galerie' },
      { h: 'Die KI-Verordnung der EU', p: [
        'Die KI-Verordnung (AI Act, Verordnung (EU) 2024/1689) definiert ein <b>Emotionserkennungssystem</b> in Art. 3 Nr. 39 als KI-System, das Emotionen oder Absichten von Menschen auf Grundlage ihrer <b>biometrischen Daten</b> erkennt oder ableitet. Sentiment-Analyse von Texten fällt daher in der Regel nicht unter diesen Begriff, Gesichts-, Stimm- und Körpersignale dagegen schon.',
        '<b>Art. 5 Abs. 1 Buchst. f</b> verbietet seit dem 2. Februar 2025, solche Systeme zu nutzen, um Emotionen von Menschen <b>am Arbeitsplatz und in Bildungseinrichtungen</b> abzuleiten. Ausgenommen sind nur Systeme, die aus medizinischen Gründen oder aus Sicherheitsgründen eingesetzt werden, etwa zur Erkennung von Müdigkeit bei Fahrerinnen und Fahrern. Außerhalb dieser Bereiche gelten Emotionserkennungssysteme als Hochrisiko-Systeme (Anhang III), und wer sie einsetzt, muss die betroffenen Personen nach Art. 50 Abs. 3 darüber informieren.',
        'Die Begründung der Verordnung (Erwägungsgrund 44) nennt dieselben Schwächen wie die Forschung: begrenzte Zuverlässigkeit, fehlende Spezifität und eingeschränkte Verallgemeinerbarkeit, dazu das Machtgefälle zwischen Arbeitgebenden und Beschäftigten, Lehrenden und Lernenden.'
      ] },
      { h: 'Was das für unsere Hochschule bedeutet', p: [
        'Die Hochschule Karlsruhe ist eine Bildungseinrichtung im Sinne der Verordnung. Ein System, das in Vorlesungen, bei Online-Prüfungen oder in der Lernplattform aus Gesicht, Stimme oder Puls ableitet, ob Studierende gelangweilt, nervös oder frustriert sind, ist hier verboten, auch als gut gemeinter Pilotversuch. Gleiches gilt für Software, die die Stimmung von Beschäftigten der Hochschule auswertet.',
        'Erlaubt bleibt, Studierende zu fragen, wie es ihnen geht, etwa mit einem freiwilligen und anonymen Fragebogen. Der Unterschied: Die Menschen geben selbst Auskunft, statt dass ein System ihre Gefühle aus Körperdaten erschließt. Die Hinweise sind eine Lernhilfe, keine Rechtsberatung.'
      ] },
      { h: 'Digital Services Act', p: [
        'Für Online-Plattformen verbietet <b>Art. 25 des Digital Services Act</b> (Verordnung (EU) 2022/2065), Oberflächen so zu gestalten, dass sie Menschen täuschen, manipulieren oder ihre freie Entscheidung erheblich beeinträchtigen. Confirmshaming und künstlicher Zeitdruck sind typische Beispiele, die darunter fallen können. Für Einwilligungen in die Datenverarbeitung gilt zusätzlich die DSGVO: Eine Einwilligung muss freiwillig und eindeutig sein.'
      ] }
    ],
    task: { title: 'Ihre Bewertung', text: 'Stellen Sie sich vor, die Hochschule möchte die Aufmerksamkeit in Online-Vorlesungen verbessern.', fields: ['Welche Lösung würde ohne Emotionserkennung auskommen?', 'Welche Gefühle von Studierenden dürfte eine Lern-App gestalterisch berücksichtigen, ohne sie zu messen?'] },
    merke: [
      'Emotional Design wird zur Manipulation, wenn es Menschen gegen ihre eigenen Ziele handeln lässt: Confirmshaming, künstliche Dringlichkeit, Schuldgefühle.',
      'Gender Shades (Buolamwini und Gebru 2018): bis zu 34,7 Prozent Fehler bei Frauen mit dunkler Haut, höchstens 0,8 Prozent bei Männern mit heller Haut.',
      'AI Act Art. 5 Abs. 1 Buchst. f: Emotionserkennung am Arbeitsplatz und in Bildungseinrichtungen ist seit 2. Februar 2025 verboten, außer aus medizinischen oder Sicherheitsgründen.',
      'Die HKA ist eine Bildungseinrichtung: Emotionserkennung bei Studierenden oder Beschäftigten ist hier unzulässig.',
      'DSA Art. 25 verbietet manipulative Gestaltung von Online-Plattformen.'
    ]
  }
];

/* Ebenen-Demo nach Norman: Erklärungen je Schalter */
export const ebenen = [
  { id: 'visceral', name: 'Viszeral', en: 'visceral', an: 'Farbe, Illustration, Typografie und Rundungen machen den ersten Eindruck freundlich und hochwertig. Nichts davon ändert die Funktion, aber das Dashboard wirkt einladender.', aus: 'Ohne viszerale Gestaltung bleibt nur Grau: korrekt, aber ohne Anziehung.' },
  { id: 'behavioral', name: 'Verhaltensbezogen', en: 'behavioral', an: 'Beschriftete Schaltflächen, eine klare nächste Aufgabe und sofortige Rückmeldung mit Rückgängig machen die Nutzung verlässlich.', aus: 'Ohne verhaltensbezogene Gestaltung sind die Schaltflächen nur Symbole, und ein Klick hat keine sichtbare Wirkung.' },
  { id: 'reflective', name: 'Reflexiv', en: 'reflective', an: 'Die Lernserie, ein persönlicher Satz und ein Meilenstein geben dem Lernen Bedeutung. Sie sprechen das Selbstbild an: Ich bleibe dran.', aus: 'Ohne reflexive Ebene gibt es keinen Rückblick und keine Geschichte, nur die nächste Aufgabe.' }
];

/* Microinteractions: [Titel, Auslöser, Regeln, Feedback, Schleifen und Modi] */
export const mikro = [
  { id: 'copy', titel: 'Link kopieren', teile: ['Klick auf „Link kopieren“', 'Der Link wird in die Zwischenablage gelegt (hier nur simuliert)', 'Das Symbol wird zum Haken, der Text wechselt zu „Kopiert“', 'Nach zwei Sekunden kehrt der Ausgangszustand zurück, erneutes Kopieren ist jederzeit möglich'] },
  { id: 'fav', titel: 'Als Favorit merken', teile: ['Klick auf das Herz', 'Ein Klick merkt, ein zweiter entfernt wieder', 'Das Herz füllt sich und pulsiert kurz, die Zahl ändert sich', 'Der Zustand bleibt erhalten; beim Entfernen gibt es keine Feier, nur eine ruhige Rückkehr'] },
  { id: 'pw', titel: 'Passwort prüfen', teile: ['Tippen im Passwortfeld', 'Länge und Zeichenarten bestimmen die Stärke', 'Ein Balken wächst und wechselt die Farbe, ein Text benennt die Stärke', 'Die Prüfung läuft bei jeder Eingabe; Hinweise nennen, was noch fehlt, statt zu tadeln'] }
];

/* Vorher/Nachher: [Situation, vorher, nachher, warum] */
export const meldungen = [
  ['Seite nicht gefunden', 'Error 404. Not Found.', 'Diese Seite gibt es nicht mehr. Vielleicht wurde sie verschoben. Suchen Sie hier weiter oder gehen Sie zur Startseite.', 'Fachjargon wird ersetzt durch eine Erklärung und zwei Wege, wie es weitergeht.'],
  ['Zahlung abgelehnt', 'Transaktion fehlgeschlagen (Code 402). Ungültige Eingabe.', 'Die Zahlung hat nicht geklappt. Ihre Bank hat sie abgelehnt, Ihr Warenkorb ist gespeichert. Versuchen Sie eine andere Zahlungsart oder wenden Sie sich an Ihre Bank.', 'Ursache, Entlastung („Warenkorb gespeichert“) und konkrete Optionen. Kein Vorwurf an die Person.'],
  ['Formularfehler', 'Falsche Eingabe!', 'Die Postleitzahl hat fünf Ziffern, zum Beispiel 76133.', 'Statt Tadel mit Ausrufezeichen ein Hinweis, wie es richtig geht, direkt am Feld.'],
  ['Leerer Zustand', 'Keine Daten vorhanden.', 'Noch keine Projekte. Legen Sie Ihr erstes an, es dauert etwa eine Minute.', 'Ein leerer Bildschirm wird zum Einstieg mit klarer nächster Handlung und realistischer Erwartung.'],
  ['Löschen', 'Sind Sie sicher? OK / Abbrechen', '„Semesterprojekt“ löschen? Es landet 30 Tage im Papierkorb. Löschen / Behalten', 'Konkreter Gegenstand, beruhigende Information und eindeutig beschriftete Schaltflächen.'],
  ['Wartezeit', 'Bitte warten …', 'Wir erstellen Ihre Rechnung. Das dauert etwa zehn Sekunden.', 'Was passiert und wie lange: Das nimmt Unsicherheit und macht Warten erträglicher.']
];

/* Sensor-Dashboard (simuliert) */
export const sensoren = [
  { id: 'cam', name: 'Gesicht (FACS-Simulation)', kurz: 'Gesicht', farbe: 'a', info: 'Simuliert: Anteil von AU 4 (Brauen senken) und AU 24 (Lippen pressen). Keine Kamera aktiv.', gewicht: 0.35 },
  { id: 'text', name: 'Text (Sentiment-Simulation)', kurz: 'Text', farbe: 'b', info: 'Simuliert: negative Polarität vorbereiteter Chat-Nachrichten. Keine eigene Eingabe, nichts wird gespeichert.', gewicht: 0.25 },
  { id: 'hr', name: 'Herzfrequenz (simuliert)', kurz: 'Puls', farbe: 'c', info: 'Simuliert: Herzfrequenz relativ zum Ruhewert. Kein Sensor verbunden.', gewicht: 0.4 }
];
/* Vorbereitete Chat-Nachrichten der fiktiven Person, [Sekunde, Text] */
export const chat = [
  [3, 'Ok, Warenkorb passt.'],
  [9, 'Adresse eingeben …'],
  [16, 'Wieso lädt das so lange?'],
  [21, 'Zahlung abgelehnt?! Super. Echt toll.'],
  [26, 'Nochmal versuchen …'],
  [32, 'Hat geklappt, endlich.']
];

/* Fallgalerie Ethik: { titel, szene, art, aufloesung, regel } */
export const galerie = [
  { titel: 'Newsletter-Abmeldung', szene: 'Ein Pop-up bietet zehn Prozent Rabatt. Die Ablehnen-Schaltfläche lautet: „Nein danke, ich zahle lieber mehr.“', art: 'Dark Pattern: Confirmshaming', aufloesung: 'Das Ablehnen wird mit Scham belegt. Die Entscheidung soll über ein schlechtes Gefühl gelenkt werden, nicht über Argumente.', regel: 'Kann gegen DSA Art. 25 verstoßen. Besser: „Nein danke“ als gleichwertige Option.' },
  { titel: 'Hotelbuchung', szene: 'Neben dem Zimmer blinkt: „Nur noch 1 Zimmer frei! 14 Personen sehen sich das gerade an.“ Die Zahlen sind nicht belegt.', art: 'Dark Pattern: künstliche Knappheit und Dringlichkeit', aufloesung: 'Angst, etwas zu verpassen, soll die Abwägung abkürzen. Erfundene Knappheit ist Täuschung.', regel: 'Irreführende Angaben sind nach Lauterkeitsrecht (UWG, EU-Richtlinie über unlautere Geschäftspraktiken) unzulässig; für Plattformen zusätzlich DSA Art. 25.' },
  { titel: 'Benachrichtigungen ausschalten', szene: 'Wer in einer Lern-App die Erinnerungen abstellt, sieht das Maskottchen weinen: „Du lässt mich allein?“', art: 'Emotionale Manipulation: Schuldgefühl', aufloesung: 'Eine Einstellung, die Menschen schützt, wird mit Schuld belegt. Das Maskottchen soll eine Beziehung vortäuschen, die bindet.', regel: 'Grenzfall nach DSA Art. 25. Gestaltungsfrage: Darf eine App traurig sein, wenn Menschen Grenzen setzen?' },
  { titel: 'Werbung nach Stimmung', szene: 'Eine Musik-App schließt aus Playlists und Chat-Texten, dass jemand traurig ist, und zeigt dann Werbung für Sofortkredite.', art: 'Ausnutzen von Verletzlichkeit', aufloesung: 'Ein Moment der Schwäche wird gezielt für Verkauf genutzt, und Sofortkredite treffen besonders Menschen in einer schwierigen wirtschaftlichen Lage. Das Beispiel ist erfunden, aber technisch machbar.', regel: 'Textbasiert ist es kein Emotionserkennungssystem im Sinne des AI Act (keine biometrischen Daten). Art. 5 Abs. 1 Buchst. b verbietet aber KI, die eine Schutzbedürftigkeit wegen Alter, Behinderung oder einer besonderen sozialen oder wirtschaftlichen Lage ausnutzt und dadurch erheblichen Schaden verursachen kann, Buchst. a manipulative Techniken. Dazu kommen DSGVO und DSA.' },
  { titel: 'Gesichtsanalyse im Bewerbungsvideo', szene: 'Eine Software bewertet Videos von Bewerbenden nach „Begeisterung“ und „Selbstsicherheit“ aus Mimik und Stimme.', art: 'Bias und fehlende Validität', aufloesung: 'Mimik ist kein zuverlässiger Hinweis auf Gefühle (Barrett et al. 2019), und Gesichtsanalyse irrt bei manchen Gruppen deutlich häufiger (Gender Shades 2018). Benachteiligt werden etwa Menschen mit dunkler Haut, Neurodivergenz oder anderer Kultur der Mimik.', regel: 'KI in der Personalauswahl ist nach AI Act Anhang III ein Hochrisiko-System. Emotionserkennung bei Beschäftigten am Arbeitsplatz ist nach Art. 5 Abs. 1 Buchst. f verboten.' },
  { titel: 'Online-Prüfung mit Stimmungsanalyse', szene: 'Eine Proctoring-Software filmt Studierende während einer Klausur und markiert „Nervosität“ als möglichen Täuschungsversuch.', art: 'Verbotene Emotionserkennung in der Bildung', aufloesung: 'Nervosität ist in Prüfungen normal und sagt nichts über Täuschung. Die Software schließt aus Körperdaten auf Gefühle und daraus auf Absichten.', regel: 'An einer Bildungseinrichtung wie der HKA nach AI Act Art. 5 Abs. 1 Buchst. f verboten.' },
  { titel: 'Callcenter-Coaching', szene: 'Eine Software analysiert die Stimmen der Beschäftigten im Kundenservice und meldet der Teamleitung, wer „gereizt“ klingt.', art: 'Verbotene Emotionserkennung am Arbeitsplatz', aufloesung: 'Die Beschäftigten können sich der Messung kaum entziehen, und die Ergebnisse können über Bewertung und Arbeitsplatz entscheiden.', regel: 'Nach AI Act Art. 5 Abs. 1 Buchst. f verboten. Eine Ausnahme gäbe es nur aus medizinischen oder Sicherheitsgründen.' }
];
