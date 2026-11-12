/* Kapitel des Exkurses „Scrollytelling mit Figma“.
   Abschnitte: { h, p: [Absätze], list, img: [Bildschlüssel], fig: Diagrammschlüssel, demo, table, code } */
export const chapters = [
  {
    id: 'einstieg', title: 'Was ist Scrollytelling?', period: 'Grundlagen', icon: 'scroll',
    lead: 'Beim Scrollytelling steuert die Scrollbewegung, wann Text, Bild, Grafik oder Animation erscheint. Die Lesenden bestimmen das Tempo selbst, können anhalten und zurückgehen. Dieses Kapitel ist selbst ein kleines Beispiel dafür.',
    sections: [
      { h: 'Scrollen als Zeitachse', p: [
        'Eine lange Webseite hat eine eingebaute Zeitachse: die Scrollposition. Scrollytelling nutzt sie zum Erzählen. Statt auf „Weiter“ zu klicken, scrollen die Lesenden, und die Seite reagiert: Ein Bild wird größer, eine Karte zoomt in eine Region, ein Diagramm zeichnet sich Schritt für Schritt auf.',
        'Anders als bei einem Video bestimmt nicht die Gestaltung das Tempo, sondern das Publikum. Wer schneller lesen will, scrollt schneller. Wer etwas genauer ansehen möchte, bleibt stehen oder scrollt zurück.',
        'Bekannt wurde die Form im Online-Journalismus. Als Meilenstein gilt die Reportage „Snow Fall“ der New York Times von 2012, die Text, Video, Karten und Animation zu einer einzigen langen Seite verband. Heute nutzen Redaktionen, Museen, Hochschulen und Marken Scrollytelling für Reportagen, Datengeschichten, Produktseiten und Jahresberichte.'
      ], img: ['handy-scroll'] },
      { h: 'Probieren Sie es aus', p: ['Scrollen Sie langsam durch die drei Schritte. Die Grafik links bleibt stehen („sticky“), während der Text an ihr vorbeizieht. Mit jedem Schritt ändert sich die Grafik. Das ist das häufigste Muster des Scrollytellings.'], demo: 'sticky' },
      { h: 'Fünf Grundmuster', p: ['Fast alle Scrollytelling-Seiten kombinieren eine Handvoll wiederkehrender Muster:'], list: [
        '<b>Sticky-Grafik mit Textschritten:</b> Eine Grafik bleibt im Bild stehen, Textabschnitte scrollen darüber oder daneben vorbei. Jeder Schritt verändert die Grafik.',
        '<b>Einblenden (Reveal):</b> Elemente erscheinen, sobald sie in den sichtbaren Bereich kommen, etwa durch Ein- und Hochblenden.',
        '<b>Parallax:</b> Ebenen bewegen sich unterschiedlich schnell und erzeugen so räumliche Tiefe.',
        '<b>Scroll-gekoppelte Animation (Scrubbing):</b> Der Fortschritt einer Animation hängt direkt an der Scrollposition. Wer zurückscrollt, spult die Animation zurück.',
        '<b>Kapitelsprünge und horizontale Abschnitte:</b> Ankerlinks springen zu Kapiteln, einzelne Abschnitte bewegen sich beim Scrollen seitwärts, etwa für eine Zeitleiste.'
      ], fig: 'muster' },
      { h: 'Wann lohnt sich Scrollytelling?', p: [
        'Scrollytelling lohnt sich, wenn sich etwas verändert: ein Ablauf, eine Entwicklung über die Zeit, ein Weg durch einen Raum oder ein Zusammenhang, der sich Schritt für Schritt aufbaut. Dann übersetzt die Scrollbewegung diese Veränderung in Erleben.',
        'Weniger geeignet ist es für Inhalte, die man schnell überfliegen oder gezielt nachschlagen will, etwa Preislisten, Formulare oder Hilfeseiten. Dort bremsen Effekte nur. Die Dramaturgie hinter guten Geschichten, also Spannungsbogen, Figur und Konflikt, behandelt das Modul <a href="../storytelling/">Storytelling</a>.'
      ] }
    ],
    task: { title: 'Ihre Beobachtung', text: 'Suchen Sie eine Scrollytelling-Seite, etwa bei einer Zeitung oder bei The Pudding, und halten Sie fest, welche Muster sie nutzt.', fields: ['Seite und Thema', 'Welche Muster erkennen Sie? Wo genau?', 'Was trägt der Effekt zur Geschichte bei, was lenkt eher ab?'] },
    merke: [
      'Beim Scrollytelling ist die Scrollposition die Zeitachse der Geschichte. Die Lesenden bestimmen das Tempo.',
      'Die fünf Grundmuster sind Sticky-Grafik mit Textschritten, Einblenden, Parallax, scroll-gekoppelte Animation sowie Kapitelsprünge und horizontale Abschnitte.',
      'Scrollytelling lohnt sich, wenn sich in der Geschichte etwas verändert, nicht für Inhalte zum Nachschlagen.'
    ]
  },
  {
    id: 'konzept', title: 'Konzept und Scroll-Storyboard', period: 'Planung', icon: 'board',
    lead: 'Gutes Scrollytelling beginnt nicht in Figma, sondern auf Papier. Erst kommt die Geschichte, dann die Aufteilung in Schritte, dann die Frage, was beim Scrollen passiert.',
    sections: [
      { h: 'Inhalt zuerst', p: [
        'Formulieren Sie die Kernaussage in einem Satz. Klären Sie, wer die Seite liest und auf welchem Gerät. Die meisten Menschen lesen lange Seiten auf dem Smartphone, planen Sie deshalb von Anfang an für das schmale Hochformat.',
        'Schreiben Sie den Text, bevor Sie Effekte planen. Wenn die Geschichte ohne Bewegung nicht funktioniert, wird sie auch mit Bewegung nicht besser.'
      ] },
      { h: 'Vom Spannungsbogen zu Scroll-Schritten', p: [
        'Teilen Sie die Geschichte in Schritte. Ein Schritt ist ein Gedanke, meist ein kurzer Textblock von 40 bis 80 Wörtern plus eine Veränderung im Bild. Eine Faustregel: ein Gedanke pro Bildschirmhöhe.',
        'Planen Sie Ruhepunkte ein. Nicht jeder Schritt braucht einen Effekt. Gerade nach einer starken Bewegung wirkt ein ruhiger Textabschnitt wie ein Atemzug.'
      ], img: ['storyboard-tisch'] },
      { h: 'Das Scroll-Storyboard', p: ['Ein Scroll-Storyboard ist eine Tabelle, in der jede Zeile einen Schritt beschreibt. Es ersetzt das klassische Bild-für-Bild-Storyboard aus dem Film, weil hier nicht die Zeit, sondern die Scrollposition den Ablauf bestimmt.'], table: {
        head: ['Schritt', 'Text (Kurzfassung)', 'Bild oder Grafik', 'Was passiert beim Scrollen?', 'Muster'],
        rows: [
          ['1', 'Regen fällt auf die Berge.', 'Landschaft in drei Ebenen', 'Wolken langsamer als Berge', 'Parallax'],
          ['2', 'Das Wasser versickert.', 'Querschnitt durch den Boden', 'Grafik bleibt stehen, Wasser sinkt ab', 'Sticky, Scrubbing'],
          ['3', 'Brunnen fördern Grundwasser.', 'Querschnitt mit Brunnen', 'Brunnen blendet ein', 'Sticky, Einblenden'],
          ['4', '128 Liter pro Kopf und Tag.', 'Großes Zahlenbild', 'Zahl zählt hoch', 'Einblenden'],
          ['5', 'Was Sie tun können.', 'Drei Tipps als Karten', 'Keine Bewegung', 'Ruhepunkt']
        ] }, fig: 'storyboard' },
      { h: 'Bilder in Ebenen denken', p: [
        'Für Parallax brauchen Sie Motive, die in Ebenen zerlegt sind: Vordergrund, Mittelgrund, Hintergrund. Planen Sie das schon beim Zeichnen oder bei der Bildauswahl. Freigestellte Ebenen speichern Sie als PNG mit Transparenz oder als SVG.',
        'Geben Sie jeder Ebene Überstand. Weil sich die Ebenen gegeneinander verschieben, müssen sie größer sein als der sichtbare Ausschnitt, sonst entstehen Lücken an den Rändern.',
        'Benennen Sie die Ebenen in Figma sprechend, etwa „hg-himmel“, „mg-berge“, „vg-gras“. Das hilft beim Einstellen der Effekte und beim Übergeben an andere.'
      ], img: ['ebenen-diorama'] }
    ],
    task: { title: 'Ihr erstes Storyboard', text: 'Wählen Sie ein Thema, das sich in fünf Schritten erzählen lässt, zum Beispiel den Weg Ihres Frühstücks vom Feld auf den Tisch.', fields: ['Kernaussage in einem Satz', 'Die fünf Schritte in Stichworten', 'Welcher Schritt wird zum Ruhepunkt, welcher zum Höhepunkt?'] },
    merke: [
      'Erst die Geschichte, dann die Schritte, dann die Effekte.',
      'Ein Schritt ist ein Gedanke: kurzer Text plus eine Veränderung im Bild.',
      'Das Scroll-Storyboard hält pro Schritt Text, Bild, Scroll-Verhalten und Muster fest.',
      'Bilder für Parallax in Ebenen mit Überstand anlegen und sprechend benennen.'
    ]
  },
  {
    id: 'werkzeuge', title: 'Werkzeugwahl: Design, Sites oder Make', period: 'Überblick', icon: 'tools',
    lead: 'Figma bietet drei Wege zu einer Scrollytelling-Seite. Sie unterscheiden sich darin, ob Effekte wirklich an das Scrollen gekoppelt sind, wie viel Kontrolle Sie haben und ob am Ende eine echte Webseite steht.',
    sections: [
      { h: 'Drei Wege im Vergleich', p: ['Die folgende Übersicht hilft bei der Entscheidung. Viele Projekte kombinieren die Wege: Entwurf in Figma Design, Umsetzung in Figma Sites oder Figma Make.'], table: {
        head: ['', 'Figma Design', 'Figma Sites', 'Figma Make'],
        rows: [
          ['Ergebnis', 'Klickbarer Prototyp', 'Veröffentlichte Website', 'Lauffähige Web-App aus generiertem Code'],
          ['An das Scrollen gekoppelte Effekte', 'Nein, nur Behelfe', 'Ja: Reveal, Scroll parallax, Scroll transform', 'Ja, alles, was sich programmieren lässt'],
          ['Arbeitsweise', 'Ebenen und Prototyp-Verbindungen', 'Ebenen und Interaktionspanel', 'Prompts, Vorschau und Code'],
          ['Kontrolle über die Gestaltung', 'Sehr hoch', 'Hoch, Effekte sind vorgegeben', 'Hoch, aber indirekt über Prompts'],
          ['Veröffentlichen', 'Prototyp-Link zum Ansehen', 'Eigene Domain oder Figma-Adresse', 'Als Web-App oder in der Community'],
          ['Gut geeignet für', 'Konzept zeigen und testen', 'Fertige Seite ohne Programmieren', 'Ungewöhnliche Interaktionen, Datengrafiken']
        ] } },
      { h: 'Was die Wege leisten', p: [
        '<b>Figma Design</b> ist das vertraute Werkzeug für Layout und Prototypen. Es kann scrollen, Elemente fixieren und Abschnitte per Klick ansteuern. Einen Auslöser „beim Scrollen“ kennt es aber nicht. Für Scrollytelling eignet es sich deshalb vor allem, um die Idee zu zeigen und zu testen.',
        '<b>Figma Sites</b> verwandelt Entwürfe in echte, responsive Webseiten. Im Interaktionspanel stehen fertige Effekte bereit, darunter Reveal, Scroll parallax und Scroll transform. Damit lassen sich die meisten Scrollytelling-Muster ohne Code umsetzen.',
        '<b>Figma Make</b> erzeugt aus Prompts und angehängten Entwürfen eine lauffähige Anwendung mit Code. Hier ist fast alles möglich, aber Sie steuern das Ergebnis über Sprache und müssen es sorgfältig prüfen.'
      ] },
      { h: 'Pläne und Kosten', p: [
        'Laut Figma-Hilfe stehen Sites und Make in mehreren Plänen zur Verfügung, darunter Starter und Education, teils mit Einschränkungen. Make verbraucht pro Prompt KI-Credits. Studierende und Lehrende können den kostenlosen Bildungsplan von Figma beantragen. Prüfen Sie die aktuellen Bedingungen vor Projektbeginn, denn Funktionen und Kontingente ändern sich häufig.'
      ] }
    ],
    merke: [
      'Figma Design: Prototyp zum Zeigen und Testen, keine echten Scroll-Auslöser.',
      'Figma Sites: veröffentlichte Website mit fertigen Scroll-Effekten, ohne Code.',
      'Figma Make: Web-App aus Prompts und Code, sehr flexibel, aber sorgfältig zu prüfen.',
      'Die Wege lassen sich kombinieren: entwerfen in Design, umsetzen in Sites oder Make.'
    ]
  },
  {
    id: 'design', title: 'Weg A: Prototyp in Figma Design', period: 'Weg A', icon: 'frame',
    lead: 'In Figma Design bauen Sie die Seite als langen Frame, stellen das Scrollverhalten ein und verbinden Abschnitte mit Interaktionen. So entsteht ein Prototyp, der die Idee zeigt und sich testen lässt.',
    sections: [
      { h: 'Die Seite aufbauen', list: [
        'Legen Sie zwei Frames an: einen für Desktop (etwa 1440 Pixel breit) und einen für Smartphone (etwa 390 Pixel breit). Beginnen Sie mit dem Smartphone.',
        'Bauen Sie jeden Schritt als eigenen Frame mit vertikalem Auto Layout. Stapeln Sie die Schritte in einem übergeordneten Frame, ebenfalls mit Auto Layout.',
        'Ordnen Sie Varianten und Entwürfe mit Sections, damit die Datei übersichtlich bleibt.'
      ] },
      { h: 'Scrollen einstellen', p: [
        'Damit ein Frame im Prototyp scrollt, muss sein Inhalt über ihn hinausragen. Geben Sie dem Geräte-Frame die Höhe des Bildschirms, lassen Sie die Seite darin länger sein und aktivieren Sie im Tab <b>Prototype</b> unter <b>Scroll behavior</b> bei <b>Overflow</b> die Option <b>Vertical</b>.',
        'Für jede Ebene legen Sie unter <b>Position</b> fest, wie sie sich beim Scrollen verhält:'
      ], list: [
        '<b>Scroll with parent:</b> Die Ebene scrollt normal mit.',
        '<b>Fixed:</b> Die Ebene bleibt immer an derselben Stelle, etwa eine Navigationsleiste. In Auto-Layout-Frames geht das nur mit absoluter Position.',
        '<b>Sticky:</b> Die Ebene scrollt zunächst mit und bleibt stehen, sobald ihr oberer Rand den oberen Rand des Frames erreicht. Das ist die Grundlage für Sticky-Grafiken und mitlaufende Kapitelüberschriften.'
      ], fig: 'position' },
      { h: 'Springen und navigieren', p: [
        'Mit der Aktion <b>Scroll to</b> springt ein Klick zu einem Abschnitt der Seite, wahlweise animiert. So bauen Sie ein Inhaltsverzeichnis oder einen „Weiter“-Pfeil. Beim Wechsel zwischen Frames können Sie die Scrollposition beibehalten oder zurücksetzen.'
      ] },
      { h: 'Bewegung ohne Scroll-Auslöser', p: [
        'Figma Design hat keinen Auslöser „beim Scrollen“. Für einen Prototyp genügen meist diese Behelfe:'
      ], list: [
        '<b>Smart Animate zwischen Zuständen:</b> Sie duplizieren einen Schritt, verändern Position, Größe oder Deckkraft und verbinden beide Frames mit Smart Animate. Ausgelöst wird per Klick, Tastendruck oder <b>After delay</b>.',
        '<b>Interaktive Komponenten:</b> Varianten mit Hover- oder Press-Zuständen zeigen Reaktionen, ohne dass Sie viele Frames brauchen.',
        '<b>On drag:</b> Ziehen mit Smart Animate kommt dem Scrubbing nahe, weil die Bewegung der Hand folgt.',
        '<b>Parallax andeuten:</b> Verschieben Sie im zweiten Zustand jede Ebene unterschiedlich weit. Smart Animate bewegt sie dann unterschiedlich schnell. Das zeigt die Idee, ist aber kein echtes Parallax.'
      ] },
      { h: 'Variablen für Fortschritt und Zustände', p: [
        'Mit Variablen merkt sich der Prototyp Werte, etwa die Nummer des aktuellen Kapitels. Die Aktion <b>Set variable</b> ändert den Wert bei einem Klick, eine Bedingung (<b>Conditional</b>) zeigt je nach Wert unterschiedliche Inhalte. So bauen Sie eine Fortschrittsanzeige oder ein Kapitelmenü, das den aktuellen Abschnitt hervorhebt.'
      ] },
      { h: 'Präsentieren und teilen', p: [
        'Legen Sie einen Startpunkt für den Ablauf fest (Flow starting point) und teilen Sie den Prototyp-Link. Andere können ihn im Browser oder in der Figma-App auf dem Smartphone öffnen und kommentieren. Testen Sie immer auf einem echten Gerät, denn Scrollgefühl und Lesbarkeit lassen sich am großen Bildschirm schlecht beurteilen.'
      ] }
    ],
    task: { title: 'Kleine Fingerübung', text: 'Bauen Sie in Figma Design einen Smartphone-Frame mit fixierter Navigation, einer Sticky-Überschrift und drei Textschritten. Verbinden Sie einen Menüpunkt per „Scroll to“ mit dem dritten Schritt.', fields: ['Was hat funktioniert?', 'Wo sind Sie an Grenzen gestoßen?'] },
    merke: [
      'Scrollen braucht Overflow „Vertical“ und Inhalt, der über den Frame hinausragt.',
      'Position: Scroll with parent, Fixed oder Sticky. Sticky ist die Grundlage für Sticky-Grafiken.',
      'Figma Design hat keinen Scroll-Auslöser. Smart Animate, interaktive Komponenten und On drag dienen als Behelfe.',
      'Variablen und Bedingungen machen Fortschritt und Zustände sichtbar.'
    ]
  },
  {
    id: 'sites', title: 'Weg B: Website mit Figma Sites', period: 'Weg B', icon: 'globe',
    lead: 'Mit Figma Sites gestalten Sie eine Website direkt in Figma und veröffentlichen sie. Fertige Interaktionen wie Reveal, Scroll parallax und Scroll transform reagieren wirklich auf das Scrollen.',
    sections: [
      { h: 'Vom Entwurf zur Website', p: [
        'Figma Sites wurde 2025 vorgestellt. Sie legen eine Site an, gestalten Seiten mit denselben Werkzeugen wie in Figma Design und passen sie für mehrere Breakpoints an, also für Desktop, Tablet und Smartphone. Vorhandene Entwürfe können Sie aus Figma Design hineinkopieren.',
        'Achten Sie von Anfang an auf Auto Layout. Es sorgt dafür, dass sich die Abschnitte bei anderen Bildschirmbreiten sinnvoll anordnen.'
      ] },
      { h: 'Die Interaktionen für Scrollytelling', p: ['Im Bereich <b>Interactions</b> fügen Sie einem Element mit <b>Add interaction</b> eine Wirkung hinzu. Für Scrollytelling sind diese besonders wichtig:'], list: [
        '<b>Reveal:</b> blendet ein Element ein. Auslöser sind „In view“ (das Element kommt ins Bild), „Page load“ oder „Other layer in view“ (eine andere Ebene kommt ins Bild).',
        '<b>Scroll parallax:</b> bewegt Ebenen beim Scrollen unterschiedlich schnell. „Clip content“ am übergeordneten Frame begrenzt die Bewegung auf dessen Ränder. Für fixierte und Sticky-Elemente ist der Effekt abgeschaltet.',
        '<b>Scroll transform:</b> verändert Größe, Position, Deckkraft und Drehung abhängig vom Scrollen. Auslöser sind „On scroll“, „Layer in view“ und „Other layer in view“. Damit bauen Sie scroll-gekoppelte Animationen.',
        '<b>Hover effect und Press effect:</b> reagieren auf Zeigen und Drücken. Hover gibt es auf Touchgeräten nicht, nutzen Sie dort Press.',
        '<b>Scroll to:</b> springt zu einem Abschnitt, sofort oder animiert.',
        '<b>Weitere:</b> Marquee (Laufband), Typewriter, Lightbox, Mouse parallax und Cursor effect. Setzen Sie sie sparsam ein.'
      ] },
      { h: 'Das Sticky-Muster in Sites', p: [
        'Für das Muster „Sticky-Grafik mit Textschritten“ setzen Sie die Grafik auf Sticky und stellen die Textschritte daneben oder darunter. Die Grafik ändert sich mit <b>Scroll transform</b> oder <b>Reveal</b> und dem Auslöser „Other layer in view“: Sobald ein Textschritt ins Bild kommt, wird die passende Ebene der Grafik eingeblendet oder verschoben.',
        'Auf dem Smartphone ist neben dem Text kein Platz. Stellen Sie die Grafik dort oben fixiert und kleiner dar, oder lassen Sie Grafik und Text abwechselnd aufeinander folgen.'
      ], fig: 'sticky-mobil' },
      { h: 'Barrierearm gestalten', p: [
        'Die Figma-Hilfe beschreibt keine eigene Einstellung für reduzierte Bewegung. Gestalten Sie deshalb so, dass jeder Zustand der Seite ohne Bewegung verständlich ist, halten Sie Bewegungen kurz und klein und testen Sie die veröffentlichte Seite mit eingeschalteter Systemeinstellung „Bewegung reduzieren“. Hinterlegen Sie Alternativtexte für Bilder und prüfen Sie die Reihenfolge der Überschriften.'
      ] },
      { h: 'Veröffentlichen', p: [
        'Über die Vorschau prüfen Sie jede Breakpoint-Ansicht. Danach veröffentlichen Sie die Site unter einer Figma-Adresse oder einer eigenen Domain. Für Sonderfälle, die die fertigen Interaktionen nicht abdecken, gibt es Code-Ebenen mit eigenem Code. Bei einer öffentlichen Seite in Deutschland denken Sie an Impressum und Datenschutzerklärung.'
      ] }
    ],
    task: { title: 'Effekte planen', text: 'Übertragen Sie Ihr Storyboard aus Kapitel 2 auf Figma Sites: Welche Interaktion mit welchem Auslöser setzen Sie pro Schritt ein?', fields: ['Schritt 1 bis 5: Interaktion und Auslöser', 'Wie sieht die Smartphone-Fassung aus?'] },
    merke: [
      'Figma Sites veröffentlicht responsive Webseiten direkt aus Figma.',
      'Reveal, Scroll parallax und Scroll transform reagieren wirklich auf das Scrollen.',
      'Mit dem Auslöser „Other layer in view“ steuert ein Textschritt die Sticky-Grafik.',
      'Hover funktioniert nicht auf Touchgeräten. Jeder Zustand muss auch ohne Bewegung verständlich sein.'
    ]
  },
  {
    id: 'make', title: 'Weg C: Prototyp per Prompt mit Figma Make', period: 'Weg C', icon: 'spark',
    lead: 'Figma Make erzeugt aus Prompts und angehängten Entwürfen eine lauffähige Anwendung. Damit lassen sich auch Effekte umsetzen, die Sites nicht anbietet, etwa an das Scrollen gekoppelte Datengrafiken.',
    sections: [
      { h: 'So arbeitet Make', p: [
        'Sie beschreiben im Chat, was entstehen soll. Make schreibt den Code, zeigt eine Vorschau und lässt Sie über weitere Prompts, über direktes Anklicken in der Vorschau oder im Code nachbessern. Jeder Prompt verbraucht KI-Credits.',
        'Eine neue Make-Datei starten Sie in der Dateiübersicht über <b>Make</b>. Hängen Sie Ihre Entwürfe an: Kopieren Sie Frames aus Figma Design in den Chat oder nutzen Sie <b>Attach design</b>. Frames sind besser als Bilder, weil Make dann Ebenen, Texte und Abstände auslesen kann.'
      ], img: ['make-arbeitsplatz'] },
      { h: 'Ein guter Prompt für Scrollytelling', p: ['Make setzt um, was Sie beschreiben, und erfindet, was Sie offenlassen. Beschreiben Sie deshalb Inhalt, Struktur und Bewegung genau. Ein bewährter Aufbau:'], list: [
        '<b>Ziel und Inhalt:</b> Worum geht es, für wen, auf welchem Gerät?',
        '<b>Struktur:</b> Welche Abschnitte in welcher Reihenfolge? Verweisen Sie auf die angehängten Frames.',
        '<b>Muster pro Abschnitt:</b> Sticky-Grafik, Einblenden, Parallax oder Scrubbing.',
        '<b>Bewegung präzise:</b> Auslöser, Richtung, Distanz, Dauer und Easing.',
        '<b>Barrierefreiheit:</b> reduzierte Bewegung beachten, Tastaturbedienung, Alternativtexte, Inhalte auch ohne Animation sichtbar.',
        '<b>Technik, wenn Sie sie kennen:</b> zum Beispiel CSS „position: sticky“, den Intersection Observer oder CSS Scroll-driven Animations.'
      ], code: 'Baue eine Scrollytelling-Seite „Der Weg des Wassers“ nach den angehängten Frames, zuerst für Smartphones (390 px), dann für Desktop.\n\nAbschnitt 1: Landschaft aus drei Ebenen (hg-himmel, mg-berge, vg-gras) mit Parallax. Hintergrund bewegt sich mit 30 %, Mittelgrund mit 60 %, Vordergrund mit 100 % der Scrollgeschwindigkeit.\n\nAbschnitt 2–3: Die Querschnitt-Grafik bleibt sticky stehen. Rechts (mobil: darunter) scrollen drei Textschritte vorbei. Erreicht ein Schritt die Bildschirmmitte, wechselt die Grafik in den passenden Zustand (Überblendung 300 ms, ease-out).\n\nAbschnitt 4: Die Zahl 128 zählt einmal hoch, wenn sie ins Bild kommt.\n\nAbschnitt 5: Drei Karten ohne Animation.\n\nWenn „prefers-reduced-motion: reduce“ aktiv ist: keine Parallax- und Zählanimation, Zustände wechseln ohne Übergang. Alle Texte bleiben ohne Animation lesbar. Nutze semantische Überschriften und Alternativtexte aus den Ebenennamen.' },
      { h: 'Schrittweise verbessern', list: [
        'Ändern Sie pro Prompt nur eine Sache. So erkennen Sie, was welche Wirkung hat.',
        'Prüfen Sie das Ergebnis auf dem Smartphone, mit Tastatur und mit eingeschalteter Einstellung „Bewegung reduzieren“.',
        'Werfen Sie einen Blick in den Code, auch wenn Sie nicht programmieren. Fragen Sie Make, was ein Abschnitt tut.',
        'Ein Zwischenstand lässt sich als Designebenen zurück nach Figma Design kopieren, etwa für eine Präsentation.'
      ] },
      { h: 'Veröffentlichen und Grenzen', p: [
        'Fertige Ergebnisse veröffentlichen Sie als Web-App, teilen die Vorschau oder stellen sie in die Figma Community. Bedenken Sie: Die KI kann Fehler machen, Inhalte erfinden oder Barrierefreiheit vergessen. Sie bleiben für das Ergebnis verantwortlich. Geben Sie keine personenbezogenen oder vertraulichen Daten in Prompts ein. Mehr zur Arbeit mit KI im Gestaltungsprozess finden Sie im Modul <a href="../ux-ki/">UX &amp; KI</a>.'
      ] }
    ],
    task: { title: 'Ihr Prompt', text: 'Schreiben Sie einen Prompt für den ersten Abschnitt Ihrer eigenen Seite. Nutzen Sie den Aufbau oben. In Übung 5 können Sie ihn prüfen lassen.', fields: ['Prompt für Abschnitt 1'] },
    merke: [
      'Make erzeugt aus Prompts und angehängten Frames lauffähigen Code.',
      'Frames anhängen statt Bilder: So kann Make Ebenen, Texte und Abstände lesen.',
      'Ein guter Prompt beschreibt Ziel, Struktur, Muster, Bewegung und Barrierefreiheit.',
      'Eine Änderung pro Prompt, Ergebnis immer prüfen: Sie bleiben verantwortlich.'
    ]
  },
  {
    id: 'parallax', title: 'Parallax und Bewegung gestalten', period: 'Gestaltung', icon: 'layers',
    lead: 'Parallax erzeugt Tiefe, Bewegung lenkt Aufmerksamkeit. Beides wirkt nur, wenn es dosiert eingesetzt wird und der Geschichte dient.',
    sections: [
      { h: 'Das Prinzip', p: [
        'Wer aus dem Zugfenster schaut, sieht nahe Bäume schnell vorbeiziehen und ferne Berge kaum. Diese Bewegungsparallaxe deutet unser Gehirn als Tiefe. Im Web ahmt man sie nach, indem sich Ebenen beim Scrollen unterschiedlich schnell bewegen.',
        'Ein Geschwindigkeitsfaktor beschreibt, wie stark eine Ebene dem Scrollen folgt. Faktor 1 bedeutet: Die Ebene scrollt normal mit. Faktor 0,3 bedeutet: Sie legt nur 30 Prozent des Wegs zurück und wirkt dadurch weit entfernt. Bei 400 Pixeln Scrollweg bewegt sich eine Ebene mit Faktor 0,3 also um 120 Pixel.'
      ], fig: 'parallax' },
      { h: 'Dosieren', list: [
        'Zwei bis vier Ebenen genügen. Mehr wirkt schnell unruhig.',
        'Kleine Unterschiede reichen. Ein Hintergrund mit 0,5 und ein Vordergrund mit 1,0 erzeugen bereits deutliche Tiefe.',
        'Bewegen Sie Fließtext nie mit Parallax. Text muss ruhig mitscrollen, sonst wird er schwer lesbar.',
        'Jede Bewegung braucht einen Grund: Tiefe zeigen, einen Übergang markieren, den Blick lenken.'
      ] },
      { h: 'Timing und Easing', p: [
        'Einblendungen dauern meist 200 bis 500 Millisekunden und enden weich (ease-out). Wenn mehrere Elemente nacheinander erscheinen, genügen kurze Abstände von 50 bis 100 Millisekunden. Scroll-gekoppelte Animationen brauchen dagegen kein Easing, sie folgen direkt dem Finger oder dem Mausrad. Grundlagen zu Dauer, Easing und Choreografie vertieft das Modul <a href="../ux-animation/">UX &amp; Animation</a>.'
      ] },
      { h: 'Kein Scroll-Hijacking', p: [
        'Scroll-Hijacking bedeutet, dass eine Seite das Scrollen übernimmt: Sie verlangsamt es, ändert die Richtung oder springt ungefragt weiter. Das nimmt den Lesenden die Kontrolle und gehört zu den häufigsten Ärgernissen auf Scrollytelling-Seiten. Lassen Sie Geschwindigkeit und Richtung unangetastet. Wenn ein Abschnitt lange stehen bleibt, zeigen Sie den Fortschritt an, damit niemand glaubt, die Seite hänge.'
      ] },
      { h: 'Leistung', p: [
        'Flüssig bleiben Animationen, wenn sie nur Verschiebung, Skalierung, Drehung (transform) und Deckkraft (opacity) verändern. Breite, Höhe oder Abstände zu animieren zwingt den Browser, das Layout neu zu berechnen, und das ruckelt. Komprimieren Sie Bilder (etwa als WebP), laden Sie Bilder weiter unten erst bei Bedarf und testen Sie auf einem älteren Smartphone.'
      ] }
    ],
    merke: [
      'Parallax: Ebenen bewegen sich mit unterschiedlichen Faktoren. Fern ist langsam, nah ist schnell.',
      'Zwei bis vier Ebenen, kleine Unterschiede, kein Parallax auf Fließtext.',
      'Einblenden in 200 bis 500 ms mit ease-out. Scroll-gekoppelte Bewegung ohne Easing.',
      'Kein Scroll-Hijacking. Nur transform und opacity animieren.'
    ]
  },
  {
    id: 'barrierefrei', title: 'Barrierefreiheit und Qualität', period: 'Qualität', icon: 'access',
    lead: 'Bewegung kann begeistern, aber auch ausschließen. Eine gute Scrollytelling-Seite funktioniert für alle, auch ohne Effekte.',
    sections: [
      { h: 'Bewegung kann krank machen', p: [
        'Menschen mit Störungen des Gleichgewichtssinns reagieren auf großflächige Bewegung, Parallax und Zoom mit Schwindel, Übelkeit oder Kopfschmerzen. Deshalb bieten Betriebssysteme die Einstellung „Bewegung reduzieren“ an. Webseiten können sie über die CSS-Abfrage <code>prefers-reduced-motion</code> auslesen und Effekte abschalten oder abschwächen.',
        'Die Richtlinien für barrierefreie Webinhalte (WCAG) verlangen, dass sich durch Interaktion ausgelöste Bewegung abschalten lässt (Erfolgskriterium 2.3.3, Stufe AAA), und dass sich automatisch laufende Bewegung, die länger als fünf Sekunden dauert, anhalten lässt (2.2.2, Stufe A). Ein endloses Laufband braucht also einen Pausenknopf.'
      ] },
      { h: 'Inhalt darf nicht von Effekten abhängen', list: [
        'Jeder Text und jede Grafik muss auch ohne Animation sichtbar und verständlich sein.',
        'Einblende-Effekte dürfen Inhalte nicht dauerhaft verstecken. Sonst finden Screenreader, Suchmaschinen oder der Druck sie nicht.',
        'Informationen in Grafiken brauchen eine Textalternative, bei Diagrammen etwa eine kurze Zusammenfassung der Aussage.'
      ] },
      { h: 'Tastatur, Screenreader, Lesbarkeit', list: [
        'Die Reihenfolge im Code entspricht der Lesereihenfolge. Was zuerst gelesen werden soll, steht zuerst.',
        'Alle Bedienelemente sind per Tastatur erreichbar und haben einen sichtbaren Fokus.',
        'Text über Bildern braucht ausreichenden Kontrast in jedem Zustand der Animation. Ein halbtransparenter Hintergrund hinter dem Text hilft.',
        'Auf dem Smartphone gibt es kein Hover, wenig Platz und manchmal ein langsames Netz.'
      ] },
      { h: 'Checkliste vor der Veröffentlichung', list: [
        'Mit „Bewegung reduzieren“ getestet?',
        'Alle Inhalte ohne Animation sichtbar?',
        'Alternativtexte für Bilder und Grafiken vorhanden?',
        'Kontrast in jedem Zustand mindestens 4,5 : 1 für Fließtext?',
        'Per Tastatur bedienbar, Fokus sichtbar?',
        'Auf einem echten Smartphone geprüft, auch mit langsamer Verbindung?'
      ] }
    ],
    merke: [
      '„Bewegung reduzieren“ respektieren: prefers-reduced-motion auswerten oder Bewegung so klein halten, dass sie nicht stört.',
      'Inhalte müssen ohne Effekte vollständig sichtbar und verständlich sein.',
      'Laufende Bewegung über fünf Sekunden braucht eine Pause-Möglichkeit.',
      'Lesereihenfolge, Tastatur, Kontrast und Alternativtexte prüfen. Mehr dazu im Modul <a href="../ux-grundlagen/#accessibility">UX Grundlagen</a>.'
    ]
  },
  {
    id: 'testen', title: 'Testen, übergeben, veröffentlichen', period: 'Abschluss', icon: 'check',
    lead: 'Erst der Test mit echten Menschen zeigt, ob die Geschichte beim Scrollen funktioniert. Danach geht es um eine saubere Übergabe und eine verantwortungsvolle Veröffentlichung.',
    sections: [
      { h: 'Kurzer Test mit drei bis fünf Personen', p: [
        'Bitten Sie drei bis fünf Personen, die Seite auf ihrem eigenen Smartphone zu lesen, und beobachten Sie, ohne zu helfen. Achten Sie darauf: Scrollen sie weiter, oder bleiben sie hängen? Übersehen sie Inhalte, weil diese zu spät einblenden? Können sie die Kernaussage danach in eigenen Worten wiedergeben?',
        'Methoden für Tests und Befragungen vertieft das Modul <a href="../ux-evaluation/">UX &amp; Evaluation</a>.'
      ], img: ['usability-test'] },
      { h: 'Bewegung übergeben', p: [
        'Wenn andere Ihren Entwurf umsetzen, beschreiben Sie jede Bewegung so genau, dass sie sich nachbauen lässt: Element, Auslöser, Eigenschaft, Start- und Endwert, Dauer und Easing. Im Dev Mode von Figma können Sie solche Angaben als Anmerkungen an den Ebenen festhalten.'
      ], table: {
        head: ['Element', 'Auslöser', 'Eigenschaft', 'Von → Bis', 'Dauer, Easing'],
        rows: [
          ['Zahl „128“', 'kommt ins Bild', 'Zahlenwert, Deckkraft', '0 → 128, 0 → 1', '800 ms, ease-out'],
          ['mg-berge', 'Scrollen in Abschnitt 1', 'Verschiebung y', 'Faktor 0,6', 'an Scroll gekoppelt'],
          ['Grafik Schritt 2', 'Textschritt 2 in Bildmitte', 'Deckkraft', '0 → 1', '300 ms, ease-out']
        ] } },
      { h: 'Verantwortungsvoll veröffentlichen', list: [
        'Klären Sie die Rechte an allen Bildern, Schriften und Daten.',
        'Kennzeichnen Sie KI-generierte Bilder.',
        'Öffentliche Seiten in Deutschland brauchen in der Regel ein Impressum und eine Datenschutzerklärung.',
        'Messen Sie Nutzung nur sparsam und datenschutzfreundlich.'
      ] }
    ],
    merke: [
      'Mit drei bis fünf Personen auf echten Smartphones testen und beobachten, ohne zu helfen.',
      'Bewegung für die Übergabe vollständig beschreiben: Element, Auslöser, Eigenschaft, Werte, Dauer, Easing.',
      'Vor dem Veröffentlichen Rechte, KI-Kennzeichnung, Impressum und Datenschutz klären.'
    ]
  }
];
