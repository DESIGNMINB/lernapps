/* Kapitel „Futuring & Critical Design“.
   Abschnitte: { h, p: [Absätze], list, img: [Bildschlüssel], fig: Diagrammschlüssel, demo, table } */
export const chapters = [
  {
    id: 'einfuehrung', title: 'Vom Problemlösen zum Fragenstellen', period: 'Teil 1 · Einführung', icon: 'compass',
    lead: 'Design löst meist Probleme: Es macht Produkte nutzbar, schöner und erfolgreicher. Critical Design dreht die Richtung um. Es entwirft, um Fragen zu stellen, Annahmen sichtbar zu machen und über wünschenswerte Zukünfte zu streiten.',
    sections: [
      { h: 'Affirmatives und kritisches Design', p: [
        'Der größte Teil der Gestaltung ist <b>affirmativ</b>: Er bestätigt die Welt, wie sie ist, und optimiert sie im Rahmen bestehender Märkte, Technologien und Gewohnheiten. Gute UX-Arbeit gehört dazu. Sie fragt, wie ein Produkt nutzbar wird, selten aber, ob es dieses Produkt überhaupt geben sollte.',
        'Den Begriff <b>Critical Design</b> prägte Anthony Dunne Ende der 1990er-Jahre am Royal College of Art in London, bekannt geworden durch sein Buch „Hertzian Tales“ (1999). Gemeinsam mit Fiona Raby entwickelte er daraus das <b>Speculative Design</b>: Entwürfe, die nicht verkauft, sondern ausgestellt und diskutiert werden. In „Speculative Everything“ (2013) stellen Dunne und Raby beide Haltungen in einer Liste gegenüber, die sie „A/B“ nennen.'
      ] },
      { h: 'Probieren Sie es aus: die A/B-Liste', p: ['Jede Karte zeigt eine Eigenschaft affirmativen Designs (A). Drehen Sie sie um, um das Gegenstück im kritischen Design (B) zu sehen. Die Begriffe sind übersetzt, das englische Original steht klein darunter.'], demo: 'ab' },
      { h: 'Was kritisches Design leistet und was nicht', p: [
        'Kritisches Design ist kein besseres Design, sondern ein anderer Auftrag. Es ist nicht dazu da, Probleme zu lösen, sondern Debatten anzustoßen: über Technik, Macht, Werte und Alltag. Die Entwürfe wirken oft vertraut und zugleich irritierend. Diese Irritation ist gewollt, denn sie lässt das Selbstverständliche fragwürdig erscheinen.',
        'Für die Medieninformatik ist das besonders relevant. Digitale Produkte werden in kurzer Zeit von Millionen Menschen genutzt, und ihre Nebenwirkungen zeigen sich oft erst spät: Abhängigkeit von Benachrichtigungen, Diskriminierung durch Algorithmen, Überwachung im Alltag. Wer Zukünfte früh durchspielt, kann solche Folgen eher erkennen.'
      ], img: ['ausstellung'] },
      { h: 'Futuring', p: [
        '<b>Futuring</b> ist ein Sammelbegriff für Methoden, mit denen Zukünfte systematisch erkundet werden. Er verbindet die Zukunftsforschung (Foresight) mit Gestaltung. Die Zukunftsforschung fragt, welche Zukünfte möglich, wahrscheinlich und wünschenswert sind. Die Gestaltung macht diese Zukünfte als Objekte, Szenarien und Interfaces erfahrbar. Dieses Modul folgt beiden Seiten: Teil 2 und 3 führen in Werkzeuge der Zukunftsforschung ein, das Labor in Teil 4 übersetzt sie in Gestaltung.'
      ] }
    ],
    task: { title: 'Ihre Position', text: 'Denken Sie an ein digitales Produkt, das Sie täglich nutzen.', fields: ['Welche Probleme löst es (affirmative Sicht)?', 'Welche Fragen wirft es auf, die beim Entwurf vermutlich niemand gestellt hat (kritische Sicht)?'] },
    merke: [
      'Affirmatives Design bestätigt und optimiert die Welt, wie sie ist. Kritisches Design stellt sie zur Diskussion.',
      'Critical Design geht auf Anthony Dunne zurück („Hertzian Tales“, 1999), Speculative Design auf Dunne und Raby („Speculative Everything“, 2013).',
      'Die A/B-Liste stellt beide Haltungen gegenüber, etwa Problemlösen gegen Problemfinden, Antworten gegen Fragen.',
      'Futuring verbindet Zukunftsforschung mit Gestaltung.'
    ]
  },
  {
    id: 'kegel', title: 'Der Futures Cone', period: 'Teil 2 · Werkzeug', icon: 'cone',
    lead: 'Es gibt nicht die eine Zukunft, sondern viele. Der Futures Cone, der Zukunftskegel, ordnet sie danach, wie wahrscheinlich, plausibel, möglich und wünschenswert sie sind.',
    sections: [
      { h: 'Herkunft', p: [
        'Das Modell stammt aus der Zukunftsforschung. Charles Taylor sprach 1990 von einem „cone of plausibility“. Trevor Hancock und Clement Bezold unterschieden 1994 mögliche, plausible, wahrscheinliche und wünschenswerte Zukünfte. Joseph Voros arbeitet seit 2000 mit dem Kegel und erweiterte ihn nach und nach, unter anderem um „preposterous“. Seine heutige Fassung (2017) nennt außerdem „projected“ und fasst alles Denkbare als „potential“ zusammen. Dunne und Raby machten den Kegel in „Speculative Everything“ (2013) im Design bekannt.',
        'Der Kegel beginnt in der Gegenwart. Je weiter man in die Zukunft blickt, desto größer wird die Unsicherheit und desto breiter der Kegel. Die Bereiche liegen ineinander: Jede wahrscheinliche Zukunft ist auch plausibel, jede plausible auch möglich.'
      ] },
      { h: 'Probieren Sie es aus: der Kegel bis 2050', p: ['Bewegen Sie den Regler auf der Zeitachse und beobachten Sie, wie der Kegel breiter wird. Wählen Sie einen Bereich, um Definition und ein Beispiel aus der Medieninformatik zu sehen. Mit der Tastatur erreichen Sie die Bereiche über die Schaltflächen unter der Grafik.'], demo: 'kegel' },
      { h: 'Die Bereiche im Überblick', table: {
        head: ['Bereich', 'Leitfrage', 'Grundlage'],
        rows: [
          ['Projected (fortgeschrieben)', 'Was passiert, wenn alles so weitergeht?', 'Fortschreibung heutiger Trends'],
          ['Probable (wahrscheinlich)', 'Was wird wahrscheinlich passieren?', 'Aktuelle Trends und Daten'],
          ['Plausible (plausibel)', 'Was könnte passieren?', 'Heutiges Wissen über die Welt'],
          ['Possible (möglich)', 'Was wäre überhaupt möglich?', 'Zukünftiges Wissen, das wir noch nicht haben'],
          ['Preposterous (abwegig)', 'Was halten wir heute für unmöglich?', 'Grenze unserer Vorstellungskraft'],
          ['Preferable (wünschenswert)', 'Was soll passieren?', 'Werte und Urteile, quer zu allen Bereichen']
        ] } },
      { h: 'Warum Design in den plausiblen Bereich zielt', p: [
        'Dunne und Raby empfehlen, Entwürfe im plausiblen Bereich anzusiedeln. Was zu wahrscheinlich ist, regt kaum zum Nachdenken an. Was zu abwegig ist, wird nicht ernst genommen. Plausible Zukünfte sind fremd genug, um zu irritieren, und nah genug, um glaubwürdig zu sein.',
        'Der wünschenswerte Bereich liegt quer zu den anderen. Er ist keine Frage der Wahrscheinlichkeit, sondern der Werte. Genau darüber soll Critical Design eine Debatte anstoßen: Wessen Wünsche zählen, und für wen ist eine Zukunft wünschenswert?'
      ] }
    ],
    merke: [
      'Der Futures Cone öffnet sich von der Gegenwart in die Zukunft: Je weiter weg, desto größer die Unsicherheit.',
      'Bereiche von innen nach außen: projected, probable, plausible, possible, preposterous. Preferable liegt quer dazu.',
      'Herkunft: Taylor (1990), Hancock und Bezold (1994), ausgebaut von Voros (seit 2000), im Design bekannt durch Dunne und Raby (2013).',
      'Speculative Design zielt meist auf das Plausible: fremd genug zum Nachdenken, nah genug zum Ernstnehmen.'
    ]
  },
  {
    id: 'signale', title: 'Von Signalen zu Szenarien', period: 'Teil 3 · Methoden', icon: 'signal',
    lead: 'Zukünfte entstehen nicht aus dem Nichts. Sie lassen sich aus Signalen der Gegenwart ableiten, mit einfachen Werkzeugen ordnen und zu Szenarien verdichten. Design macht sie dann als Gegenstände und Interfaces greifbar.',
    sections: [
      { h: 'Schwache Signale, Trends, Megatrends', p: [
        'Igor Ansoff führte 1975 den Begriff der <b>schwachen Signale</b> (weak signals) ein: frühe, unscharfe Hinweise auf Veränderungen, die noch kaum jemand beachtet, etwa ein Nischenprodukt, ein Forschungsprojekt oder eine neue Gewohnheit in einer kleinen Gruppe. Verdichten sich solche Signale, entsteht ein <b>Trend</b>. <b>Megatrends</b> sind langfristige, globale Entwicklungen über Jahrzehnte, etwa die Alterung der Gesellschaft, der Klimawandel oder die Digitalisierung.',
        'Daneben gibt es <b>Wild Cards</b>: unwahrscheinliche Ereignisse mit großer Wirkung, etwa eine Pandemie. Sie gehören in Szenarien, weil sie Annahmen auf die Probe stellen.'
      ], img: ['signalwand'] },
      { h: 'STEEPLE: das Umfeld abtasten', p: ['Um Signale nicht nur in der Technik zu suchen, ordnet man sie nach Bereichen. Das Raster heißt je nach Umfang PEST, STEEP oder STEEPLE. Öffnen Sie die Bereiche für Leitfragen und Beispiele.'], demo: 'steeple' },
      { h: 'Futures Wheel: Folgen von Folgen', p: [
        'Das <b>Futures Wheel</b> geht auf Jerome C. Glenn (1971) zurück. In die Mitte schreibt man eine Veränderung, etwa „KI-Assistenzen übernehmen die Pflegedokumentation“. Im ersten Ring stehen direkte Folgen, im zweiten Ring die Folgen dieser Folgen. So werden Nebenwirkungen sichtbar, die beim ersten Nachdenken fehlen.'
      ], fig: 'wheel' },
      { h: 'Szenario-Achsen', p: [
        'Für Szenarien wählt man zwei wichtige, aber unsichere Einflussgrößen und spannt sie als Achsen auf. Die vier Felder ergeben vier unterschiedliche Zukünfte. Die Methode wurde unter anderem bei Shell entwickelt und von Peter Schwartz in „The Art of the Long View“ (1991) beschrieben. Wichtig ist, dass alle vier Szenarien plausibel und in sich stimmig sind, nicht nur eines „gut“ und eines „schlecht“.'
      ], fig: 'achsen' },
      { h: 'Drei Horizonte', p: [
        'Das Modell der <b>Three Horizons</b> (Curry und Hodgson 2008, ausgebaut von Bill Sharpe) zeigt drei Systeme nebeneinander: H1 ist das heute dominante System, das an Bedeutung verliert. H3 ist die gewünschte Zukunft, die heute nur in Ansätzen existiert. H2 ist der Übergang mit Innovationen, die H1 verlängern oder H3 vorbereiten. Das Modell hilft, Projekte einzuordnen: Verlängern sie das Bestehende oder bereiten sie etwas Neues vor?'
      ], fig: 'horizonte' },
      { h: 'Design Fiction und diegetische Prototypen', p: [
        'Szenarien bleiben abstrakt, solange sie nur als Text existieren. <b>Design Fiction</b> macht sie greifbar. Bruce Sterling prägte den Begriff 2005, Julian Bleecker beschrieb ihn 2009 in einem Essay als Verbindung von Design, Wissenschaft und Fiktion. Sterling definierte ihn später als bewussten Einsatz diegetischer Prototypen, um Zweifel am Wandel aufzuheben.',
        '<b>Diegetische Prototypen</b> beschreibt David A. Kirby (2010) am Beispiel des Kinos: Technik, die in der Welt eines Films selbstverständlich funktioniert, etwa die Gestensteuerung in „Minority Report“ (2002), wirkt auf das Publikum wie ein funktionierender Prototyp und beeinflusst die reale Entwicklung. Im Design sind diegetische Prototypen Gegenstände, Werbeanzeigen, Anleitungen oder Interfaces aus einer erfundenen Zukunft, die so tun, als gäbe es sie längst.'
      ], img: ['prototyp'] }
    ],
    task: { title: 'Ihr Signal', text: 'Notieren Sie ein schwaches Signal, das Ihnen in den letzten Wochen aufgefallen ist.', fields: ['Signal und Quelle', 'STEEPLE-Bereich', 'Zwei Folgen im ersten Ring, je eine Folge im zweiten Ring'] },
    merke: [
      'Schwache Signale (Ansoff 1975) sind frühe Hinweise, Trends verdichtete Signale, Megatrends langfristige globale Entwicklungen. Wild Cards sind unwahrscheinlich, aber folgenreich.',
      'STEEPLE: Social, Technological, Economic, Environmental, Political, Legal, Ethical.',
      'Futures Wheel, Szenario-Achsen und drei Horizonte ordnen Folgen, Unsicherheiten und Übergänge.',
      'Design Fiction setzt diegetische Prototypen ein: Artefakte aus einer erfundenen Zukunft, die so tun, als gäbe es sie längst.'
    ]
  },
  {
    id: 'fallstudien', title: 'Fallstudien und Kritik', period: 'Teil 5 · Praxis', icon: 'gallery',
    lead: 'Wie sieht kritisches und spekulatives Design in der Praxis aus? Die Fallstudien zeigen bekannte Projekte. Am Ende steht die Kritik an der Disziplin selbst: Wessen Zukünfte werden hier eigentlich entworfen?',
    sections: [
      { h: 'Fallstudien', p: ['Die Projekte sind urheberrechtlich geschützt. Wir zeigen sie deshalb nicht, sondern beschreiben sie und verlinken auf die Seiten der Studios und Sammlungen.'], demo: 'faelle' },
      { h: 'Was die Projekte gemeinsam haben', list: [
        'Sie wirken alltäglich: eine Wohnung, ein Katalog, ein Haushaltsgerät. Das macht die Zukunft glaubwürdig.',
        'Sie zeigen nicht nur Technik, sondern Folgen für Menschen, Beziehungen und Macht.',
        'Sie geben keine Antwort, sondern stellen eine Frage an das Publikum.',
        'Sie werden ausgestellt, gezeigt und diskutiert, nicht verkauft.'
      ] },
      { h: 'Kritik: Wessen Zukünfte?', p: [
        'Luiza Prado de O. Martins und Pedro Oliveira veröffentlichten 2014 den Essay „Questioning the ‚critical‘ in Speculative &amp; Critical Design“. Ihr Vorwurf: Viele Projekte entstehen in wohlhabenden europäischen Hochschulen und Museen. Sie stellen Dystopien vor, die für viele Menschen anderswo längst Alltag sind, und übersehen Fragen von Klasse, Geschlecht und Herkunft. Die Kritik am Bestehenden bleibe so selbst privilegiert.',
        'Daraus folgen Fragen an jedes eigene Projekt: Wer entwirft die Zukunft? Für wen ist sie wünschenswert, für wen bedrohlich? Wessen Stimmen fehlen? Und wo wird das Ergebnis gezeigt, im Museum oder dort, wo die Betroffenen leben? Ansätze wie partizipatives Futuring, bei dem Betroffene selbst Szenarien entwickeln, versuchen darauf zu antworten.'
      ] }
    ],
    merke: [
      'Dunne &amp; Raby, Superflux und das Near Future Laboratory zeigen, wie Zukünfte als alltägliche Artefakte erfahrbar werden.',
      'Spekulative Projekte stellen Fragen, statt Antworten zu verkaufen.',
      'Prado de O. Martins und Oliveira (2014) kritisieren die privilegierte Perspektive vieler Projekte.',
      'Fragen Sie bei jedem Szenario: Wessen Zukunft ist das, und wer fehlt?'
    ]
  },
  {
    id: 'ethik', title: 'Dark Patterns heute und morgen', period: 'Teil 5 · Ethik', icon: 'shield',
    lead: 'Dark Patterns sind Gestaltungstricks, die Menschen zu Entscheidungen drängen, die sie so nicht treffen wollten. In künftigen Interfaces mit KI, Sensoren und Emotionserkennung können sie subtiler und wirksamer werden. Spekulatives Design hilft, sie früh zu erkennen.',
    sections: [
      { h: 'Was Dark Patterns sind', p: [
        'Den Begriff prägte Harry Brignull 2010. Heute spricht er von <b>Deceptive Patterns</b> und sammelt Beispiele auf deceptive.design. Typische Muster sind vorausgewählte Kästchen, versteckte Kosten, schwer auffindbare Kündigungen, beschämende Ablehnungstexte („Nein, ich will nicht sparen“) und ständiges Nachfragen.'
      ], img: ['benachrichtigungen'] },
      { h: 'Typische Muster', table: {
        head: ['Muster', 'Beispiel heute', 'Mögliche Zukunft'],
        rows: [
          ['Nagging (Drängeln)', 'Wiederholte Aufforderungen, Benachrichtigungen zu erlauben', 'Ein Sprachassistent fragt so lange nach, bis man zustimmt'],
          ['Confirmshaming (Beschämen)', '„Nein danke, ich lerne lieber nichts dazu“', 'Ein Avatar wirkt enttäuscht, wenn man ablehnt'],
          ['Preselection (Vorauswahl)', 'Datenweitergabe ist vorab angekreuzt', 'Das Smart Home teilt Daten, bis man widerspricht'],
          ['Obstruction (Hindernisse)', 'Kündigung nur per Telefon', 'Abmeldung nur über ein Gespräch mit einem KI-Agenten'],
          ['False urgency (falsche Dringlichkeit)', 'Countdown, der nach Ablauf neu startet', 'Die Uhr meldet Stress und bietet sofort ein Abo an'],
          ['Emotionale Ausnutzung', 'Kaufaufforderung nach Mitternacht', 'Emotionserkennung zeigt Angebote, wenn man traurig ist']
        ] } },
      { h: 'Was heute schon gilt', list: [
        '<b>Digital Services Act (DSA), Art. 25:</b> Online-Plattformen dürfen ihre Oberflächen nicht so gestalten, dass sie Nutzende täuschen, manipulieren oder in ihrer freien Entscheidung erheblich beeinträchtigen. Für Bereiche, die das Verbraucherrecht oder die DSGVO regeln, gelten diese vorrangig.',
        '<b>DSGVO:</b> Eine Einwilligung muss freiwillig, informiert und eindeutig sein. Vorausgewählte Kästchen genügen nicht, und der Widerruf muss so einfach sein wie die Einwilligung (Art. 7).',
        '<b>KI-Verordnung (AI Act), Art. 5:</b> verbietet KI-Systeme, die unterschwellige, gezielt manipulative oder täuschende Techniken einsetzen oder Schwächen wegen Alter, Behinderung oder sozialer Lage ausnutzen, wenn dadurch erheblicher Schaden droht.',
        '<b>WCAG 2.2:</b> regelt Barrierefreiheit, etwa Zeitbegrenzungen (2.2.1), Pausieren von Bewegung (2.2.2) und Vermeiden von Fehlern bei wichtigen Vorgängen (3.3.4). Barrierefreiheit und faire Gestaltung hängen eng zusammen.'
      ], p: ['Diese Übersicht ist eine Lernhilfe, keine Rechtsberatung. Maßgeblich sind die Rechtstexte und ihre Auslegung.'] },
      { h: 'Spekulieren, um vorzubeugen', p: [
        'Im Labor (Teil 4) entwerfen Sie ein Interface aus der Zukunft und drehen bewusst an den Reglern, bis Elemente manipulativ werden. Das Labor nennt dazu <b>fiktive Leitlinien</b> aus dem Jahr 2040, die als solche gekennzeichnet sind, und verweist auf die realen Regeln von heute. So üben Sie, Grenzen zu erkennen, bevor ein Produkt sie überschreitet.'
      ] }
    ],
    merke: [
      'Dark Patterns (Brignull 2010, heute Deceptive Patterns) drängen Menschen zu Entscheidungen gegen ihre Absicht.',
      'Künftige Interfaces mit KI, Sensoren und Emotionserkennung können solche Muster verstärken.',
      'Heute gelten unter anderem DSA Art. 25, DSGVO Art. 7, AI Act Art. 5 und die WCAG.',
      'Spekulatives Design macht Grenzen sichtbar, bevor Produkte sie überschreiten.'
    ]
  }
];

/* A/B-Liste nach Dunne & Raby (2013), Auswahl. [A deutsch, B deutsch, A original, B original] */
export const abListe = [
  ['Affirmativ', 'Kritisch', 'Affirmative', 'Critical'],
  ['Probleme lösen', 'Probleme finden', 'Problem solving', 'Problem finding'],
  ['Liefert Antworten', 'Stellt Fragen', 'Provides answers', 'Asks questions'],
  ['Design für die Produktion', 'Design für die Debatte', 'Design for production', 'Design for debate'],
  ['Im Dienst der Industrie', 'Im Dienst der Gesellschaft', 'In the service of industry', 'In the service of society'],
  ['Fiktive Funktionen', 'Funktionale Fiktionen', 'Fictional functions', 'Functional fictions'],
  ['Für die Welt, wie sie ist', 'Für die Welt, wie sie sein könnte', 'For how the world is', 'For how the world could be'],
  ['Science-Fiction', 'Social Fiction', 'Science fiction', 'Social fiction'],
  ['Anwendungen', 'Folgen', 'Applications', 'Implications'],
  ['Innovation', 'Provokation', 'Innovation', 'Provocation'],
  ['Konsumierende', 'Bürgerinnen und Bürger', 'Consumer', 'Citizen'],
  ['Bringt uns zum Kaufen', 'Bringt uns zum Nachdenken', 'Makes us buy', 'Makes us think'],
  ['Benutzerfreundlichkeit', 'Ethik', 'User-friendliness', 'Ethics']
];

/* Futures Cone: Bereiche von innen nach außen. Breite = Anteil an der Kegelöffnung */
export const kegelBereiche = [
  { id: 'projected', name: 'Projected', de: 'fortgeschrieben', w: 0.06, def: 'Die eine Zukunft, die sich ergibt, wenn heutige Trends einfach weiterlaufen. Oft unausgesprochen die Grundlage von Planungen.', bsp: 'Smartphones werden jedes Jahr etwas schneller, Apps bekommen schrittweise mehr KI-Funktionen.' },
  { id: 'probable', name: 'Probable', de: 'wahrscheinlich', w: 0.2, def: 'Zukünfte, die nach heutigen Trends und Daten wahrscheinlich eintreten.', bsp: 'KI-Assistenz übernimmt in vielen Pflegeheimen die Dokumentation, Pflegekräfte prüfen und ergänzen.' },
  { id: 'plausible', name: 'Plausible', de: 'plausibel', w: 0.42, def: 'Zukünfte, die nach heutigem Wissen eintreten könnten. Der bevorzugte Bereich vieler spekulativer Entwürfe.', bsp: 'Pflegeroboter begleiten ältere Menschen zu Hause, Angehörige sehen deren Stimmung als Ampel in einer App.' },
  { id: 'possible', name: 'Possible', de: 'möglich', w: 0.7, def: 'Zukünfte, die möglich sind, für die uns aber noch Wissen fehlt, etwa wissenschaftliche Durchbrüche.', bsp: 'Brain-Computer-Interfaces ersetzen Tastatur und Touchscreen im Alltag, Texte entstehen durch Denken.' },
  { id: 'preposterous', name: 'Preposterous', de: 'abwegig', w: 1, def: 'Zukünfte, die wir heute für unmöglich oder lächerlich halten. Voros nahm sie auf, weil manches Abwegige später doch eintritt.', bsp: 'Menschen laden ihr Bewusstsein in eine Cloud und arbeiten als digitale Kopien weiter.' }
];
export const kegelPreferable = { id: 'preferable', name: 'Preferable', de: 'wünschenswert', def: 'Zukünfte, die wir wollen. Dieser Bereich liegt quer zu den anderen und ist eine Frage der Werte: Wer darf entscheiden, was wünschenswert ist?', bsp: 'Pflege-KI entlastet Pflegekräfte von Dokumentation, Daten bleiben bei den Gepflegten, und die gewonnene Zeit fließt in Zuwendung.' };

/* STEEPLE */
export const steeple = [
  ['S', 'Social', 'Gesellschaft', 'Wie verändern sich Werte, Demografie, Lebensstile und Beziehungen?', 'Alternde Gesellschaft, Einsamkeit, neue Familienformen'],
  ['T', 'Technological', 'Technik', 'Welche Technologien entstehen oder verbreiten sich?', 'Generative KI, Brain-Computer-Interfaces, Quantencomputing'],
  ['E', 'Economic', 'Wirtschaft', 'Wie verändern sich Märkte, Arbeit und Verteilung?', 'Plattformarbeit, Abo-Modelle, Fachkräftemangel'],
  ['E', 'Environmental', 'Umwelt', 'Welche ökologischen Grenzen und Veränderungen wirken?', 'Hitzesommer, Rohstoffknappheit, Energieverbrauch von Rechenzentren'],
  ['P', 'Political', 'Politik', 'Welche Machtverhältnisse und politischen Entscheidungen prägen das Feld?', 'Digitale Souveränität, Regulierung von Plattformen'],
  ['L', 'Legal', 'Recht', 'Welche Gesetze und Normen gelten oder entstehen?', 'KI-Verordnung, Digital Services Act, Barrierefreiheitsstärkungsgesetz'],
  ['E', 'Ethical', 'Ethik', 'Welche Werte stehen auf dem Spiel, wer profitiert, wer trägt die Risiken?', 'Fairness von Algorithmen, Überwachung, Autonomie']
];

/* Fallstudien: [Titel, Jahr, Studio, Beschreibung, Frage, Link-Text, URL] */
export const faelle = [
  ['Technological Dreams Series: No. 1, Robots', '2007', 'Dunne & Raby', 'Vier abstrakte Objekte statt menschenähnlicher Roboter. Einer will vor allem unabhängig sein, einer wird nervös, wenn man ihm zu nahe kommt, einer bewacht den Raum, einer ist bedürftig und will gehalten werden. Die Objekte fragen, welche Beziehung wir zu Maschinen haben wollen.', 'Müssen Roboter nützlich sein, oder dürfen sie abhängig und eigensinnig sein?', 'Werk in der Sammlung des MoMA', 'https://www.moma.org/collection/works/110124'],
  ['United Micro Kingdoms', '2013', 'Dunne & Raby', 'Ausstellung im Design Museum London: England zerfällt in vier Kleinstaaten mit eigenen Regeln, Technologien und Fahrzeugen, darunter die „Digitarians“, die alles über Daten und Märkte steuern.', 'Wie würden Technik und Alltag aussehen, wenn sie von ganz anderen politischen Ideen geprägt wären?', 'Website von Dunne & Raby', 'https://dunneandraby.co.uk/'],
  ['Uninvited Guests', '2015', 'Superflux', 'Ein Kurzfilm über Thomas, 70, der nach dem Tod seiner Frau allein lebt. Seine Kinder schicken ihm vernetzte Geräte, die ihn überwachen und ermahnen. Thomas findet Wege, sie zu überlisten.', 'Wer bestimmt, was gut für ältere Menschen ist, wenn Pflege aus der Ferne über smarte Dinge geschieht?', 'Projektseite von Superflux', 'https://superflux.in/index.php/work/uninvited-guests/'],
  ['Mitigation of Shock', '2017', 'Superflux', 'Eine begehbare Wohnung im London um 2050, eingerichtet für ein Leben mit klimabedingter Lebensmittelknappheit: selbstgebaute „Food Computer“ zur Pflanzenzucht, Anleitungen und improvisierte Geräte. Gezeigt zuerst im Centre de Cultura Contemporània de Barcelona (CCCB).', 'Wie fühlt sich Klimaanpassung im Alltag an, und wie bereitet man sich darauf vor?', 'Projektseite von Superflux', 'https://superflux.in/index.php/work/mitigation-of-shock/'],
  ['TBD Catalog', '2014', 'Near Future Laboratory', 'Ein Versandhauskatalog aus einer nahen Zukunft mit 166 Produkten und Kleinanzeigen. Entstanden aus einem Workshop 2012 in Detroit. Die Produkte sind banal, gerade das macht sie aufschlussreich.', 'Was wird in Zukunft so normal sein, dass es niemand mehr bemerkt?', 'Projektseite TBD Catalog', 'https://tbdcatalog.com']
];
