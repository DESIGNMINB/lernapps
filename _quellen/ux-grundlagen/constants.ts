import { GestaltPrinciple, IsoPrinciple, LiteratureItem, OnlineResource, NielsenHeuristic, GlossaryTerm, GuideSection, UxLaw } from './types';

export const UX_LAWS_DATA: UxLaw[] = [
  {
    id: "hicks-law",
    name: "Hick's Law",
    description: "Die Zeit, die für eine Entscheidung benötigt wird, steigt logarithmisch mit der Anzahl und Komplexität der Auswahlmöglichkeiten.",
    takeaway: "Reduzieren Sie die Auswahlmöglichkeiten, wenn schnelle Entscheidungen gefordert sind (z. B. Navigation, Checkout).",
    category: "Psychologie"
  },
  {
    id: "fitts-law",
    name: "Fitts's Law",
    description: "Die Zeit zum Erreichen eines Ziels hängt logarithmisch vom Verhältnis der Distanz zur Zielbreite ab (T = a + b · log₂(D/W + 1)).",
    takeaway: "Machen Sie wichtige Buttons groß und nah am Ausgangspunkt. Kleine Ziele in großer Entfernung sind schwer zu treffen.",
    category: "Heuristik"
  },
  {
    id: "jakobs-law",
    name: "Jakob's Law",
    description: "Nutzende verbringen die meiste Zeit auf anderen Websites. Sie erwarten, dass Ihre Seite so funktioniert wie alle anderen.",
    takeaway: "Nutzen Sie bekannte Design-Patterns. Erfinden Sie das Rad nicht neu (z. B. Warenkorb oben rechts).",
    category: "Prinzip"
  },
  {
    id: "millers-law",
    name: "Miller's Law",
    description: "Nach George Miller (1956) kann der Mensch etwa 7 (plus/minus 2) Einheiten im Arbeitsgedächtnis behalten. Neuere Forschung (Cowan, 2001) geht eher von rund vier Einheiten aus.",
    takeaway: "Organisieren Sie Inhalte in kleine Häppchen (Chunking), um die kognitive Belastung zu minimieren.",
    category: "Psychologie"
  },
  {
    id: "parkinsons-law",
    name: "Parkinson's Law",
    description: "Arbeit dehnt sich in genau dem Maß aus, wie Zeit für ihre Erledigung zur Verfügung steht.",
    takeaway: "Reduzieren Sie die Zeit, die für eine Aufgabe benötigt wird, durch Autofill und intelligente Standards.",
    category: "Prinzip"
  },
  {
    id: "peak-end-rule",
    name: "Peak-End Rule",
    description: "Menschen beurteilen eine Erfahrung anhand dessen, wie sie sich auf dem Höhepunkt und am Ende anfühlte, nicht anhand des Durchschnitts.",
    takeaway: "Achten Sie besonders auf die intensivsten Momente (positiv/negativ) und das Ende einer User Journey (z. B. Erfolgsmeldung).",
    category: "Psychologie"
  },
  {
    id: "serial-position-effect",
    name: "Serial Position Effect",
    description: "Nutzende erinnern sich am besten an das erste und das letzte Element einer Serie.",
    takeaway: "Platzieren Sie die wichtigsten Informationen am Anfang und am Ende von Listen oder Menüs.",
    category: "Psychologie"
  },
  {
    id: "teslers-law",
    name: "Tesler's Law",
    description: "Das Gesetz der Erhaltung der Komplexität besagt, dass es für jedes System eine gewisse Komplexität gibt, die nicht reduziert werden kann.",
    takeaway: "Entweder bewältigt das Entwicklungsteam die Komplexität oder die Person, die das Produkt nutzt. Nehmen Sie den Nutzenden die Last ab.",
    category: "Prinzip"
  },
  {
    id: "von-restorff-effect",
    name: "Von Restorff Effect",
    description: "Bei mehreren ähnlichen Objekten wird dasjenige, das sich unterscheidet, am ehesten erinnert (Isolationseffekt).",
    takeaway: "Machen Sie wichtige Handlungsaufforderungen (CTAs) visuell unterscheidbar von anderen Elementen.",
    category: "Psychologie"
  },
  {
    id: "zeigarnik-effect",
    name: "Zeigarnik Effect",
    description: "Menschen erinnern sich besser an unvollendete oder unterbrochene Aufgaben als an abgeschlossene.",
    takeaway: "Nutzen Sie Fortschrittsbalken, um Nutzende zu motivieren, unvollständige Profile oder Prozesse abzuschließen.",
    category: "Psychologie"
  },
  {
    id: "doherty-threshold",
    name: "Doherty Threshold",
    description: "Systemreaktionen unter 400 ms halten die Aufmerksamkeit. Moderne Standards (z. B. Core Web Vitals) streben oft unter 200 ms an, um als „instantan“ zu gelten.",
    takeaway: "Geben Sie Feedback idealerweise sofort. Nutzen Sie Skeleton Screens oder Optimistic UI, um Wartezeiten subjektiv zu verkürzen.",
    category: "Heuristik"
  }
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: 'A/B Testing', definition: 'Methode zum Vergleich zweier Versionen einer Webseite oder App, um festzustellen, welche besser performt.', category: 'Testing' },
  { term: 'Accessibility (Barrierefreiheit)', definition: 'Die Gestaltung von Produkten, Geräten, Diensten oder Umgebungen für Menschen mit Behinderungen.', category: 'Grundlagen' },
  { term: 'Affordance', definition: 'Der Angebotscharakter eines Objekts, der den Nutzenden signalisiert, wie es benutzt werden kann (z. B. sieht ein Button drückbar aus).', category: 'Psychologie' },
  { term: 'Agile', definition: 'Ein iterativer Ansatz für Projektmanagement und Softwareentwicklung, der Teams hilft, ihrer Kundschaft schneller Werte zu liefern.', category: 'Prozess' },
  { term: 'Breadcrumbs', definition: 'Sekundäre Navigation, die den Pfad der Nutzenden von der Startseite bis zur aktuellen Position anzeigt.', category: 'UI-Elemente' },
  { term: 'Card Sorting', definition: 'Methode, bei der Testpersonen Themen in Kategorien organisieren, um eine intuitive Informationsarchitektur zu entwickeln.', category: 'Testing' },
  { term: 'Cognitive Load', definition: 'Die mentale Anstrengung, die erforderlich ist, um eine Aufgabe zu erledigen oder Informationen zu verarbeiten.', category: 'Psychologie' },
  { term: 'Conversion Rate', definition: 'Der Prozentsatz der Nutzenden, die eine gewünschte Aktion ausführen (z. B. Kauf, Anmeldung).', category: 'Metriken' },
  { term: 'Dark Pattern', definition: 'Benutzeroberflächen, die so gestaltet sind, dass sie Nutzende zu Handlungen verleiten, die sie eigentlich nicht beabsichtigt haben.', category: 'Psychologie' },
  { term: 'Design System', definition: 'Eine Sammlung von wiederverwendbaren Komponenten, Richtlinien und Standards für das Design und die Entwicklung von Produkten.', category: 'Grundlagen' },
  { term: 'Design Thinking', definition: 'Ein iterativer Prozess, bei dem wir versuchen, die Nutzenden zu verstehen, Annahmen in Frage zu stellen und Probleme neu zu definieren.', category: 'Prozess' },
  { term: 'Eye Tracking', definition: 'Technologie zur Messung der Augenbewegungen, um zu sehen, wohin Nutzende schauen und wie lange sie fixieren.', category: 'Testing' },
  { term: 'Fitts\' Law', definition: 'Ein Modell der menschlichen Bewegung, das vorhersagt, dass die Zeit, die benötigt wird, um ein Ziel zu erreichen, eine Funktion der Entfernung zum Ziel und der Größe des Ziels ist.', category: 'Psychologie' },
  { term: 'Flat Design', definition: 'Ein minimalistischer Designstil, der auf dreidimensionale Effekte wie Schatten und Texturen verzichtet.', category: 'UI-Elemente' },
  { term: 'Gestaltgesetze', definition: 'Regeln der menschlichen Wahrnehmung, die beschreiben, wie Menschen visuelle Elemente in Gruppen oder Mustern organisieren.', category: 'Psychologie' },
  { term: 'Heatmap', definition: 'Grafische Darstellung von Daten, bei der Werte durch Farben repräsentiert werden (oft genutzt für Klick- oder Scroll-Verhalten).', category: 'Testing' },
  { term: 'Heuristik', definition: 'Eine Daumenregel oder Best Practice, die hilft, Probleme schnell (wenn auch nicht immer perfekt) zu lösen.', category: 'Grundlagen' },
  { term: 'Hick\'s Law', definition: 'Besagt, dass die Zeit, die für eine Entscheidung benötigt wird, logarithmisch mit der Anzahl der Auswahlmöglichkeiten steigt.', category: 'Psychologie' },
  { term: 'Information Architecture (IA)', definition: 'Die strukturelle Gestaltung von Informationsumgebungen; die Kunst und Wissenschaft des Organisierens und Etikettierens.', category: 'Grundlagen' },
  { term: 'Iterativ', definition: 'Ein Prozess, bei dem Lösungen durch wiederholte Zyklen von Entwurf, Prototyping und Testen schrittweise verbessert werden.', category: 'Prozess' },
  { term: 'KPI (Key Performance Indicator)', definition: 'Eine messbare Kennzahl, die zeigt, wie effektiv ein Unternehmen die wichtigsten Geschäftsziele erreicht.', category: 'Metriken' },
  { term: 'Mental Model', definition: 'Die Vorstellung, die Nutzende davon haben, wie ein System funktioniert, basierend auf ihren bisherigen Erfahrungen.', category: 'Psychologie' },
  { term: 'Microinteraction', definition: 'Kleine, funktionale Animationen, die Feedback geben, Aufgaben visualisieren oder das Gefühl der direkten Manipulation verstärken.', category: 'UI-Elemente' },
  { term: 'Mockup', definition: 'Ein statisches Design, das zeigt, wie das fertige Produkt aussehen wird (High-Fidelity), aber noch nicht interaktiv ist.', category: 'Prozess' },
  { term: 'MVP (Minimum Viable Product)', definition: 'Eine Version eines neuen Produkts, die es einem Team ermöglicht, mit geringstem Aufwand die meisten validierten Erkenntnisse über die Kundschaft zu sammeln.', category: 'Prozess' },
  { term: 'NPS (Net Promoter Score)', definition: 'Eine Metrik zur Messung der Kundenloyalität basierend auf der Frage: „Wie wahrscheinlich ist es, dass Sie uns weiterempfehlen?“.', category: 'Metriken' },
  { term: 'Persona', definition: 'Ein fiktiver Charakter, der einen bestimmten Nutzungstyp innerhalb der Zielgruppe repräsentiert.', category: 'Prozess' },
  { term: 'Prototype', definition: 'Ein vorläufiges Modell eines Produkts, mit dem Konzepte getestet werden können.', category: 'Prozess' },
  { term: 'Responsive Design', definition: 'Ein Ansatz, bei dem sich das Layout einer Website automatisch an die Bildschirmgröße des Geräts anpasst.', category: 'Grundlagen' },
  { term: 'Scrum', definition: 'Ein agiles Framework für das Management komplexer Projekte, oft genutzt in der Softwareentwicklung.', category: 'Prozess' },
  { term: 'Skeuomorphismus', definition: 'Ein Designstil, bei dem digitale Objekte ihre realen Gegenstücke imitieren (z. B. eine Notizen-App mit Ledertextur).', category: 'UI-Elemente' },
  { term: 'User Journey Map', definition: 'Eine Visualisierung des Prozesses, den eine Person durchläuft, um ein Ziel zu erreichen.', category: 'Prozess' },
  { term: 'Usability', definition: 'Das Ausmaß, in dem ein Produkt durch bestimmte Nutzende in einem bestimmten Nutzungskontext genutzt werden kann, um bestimmte Ziele effektiv, effizient und zufriedenstellend zu erreichen.', category: 'Grundlagen' },
  { term: 'User Centered Design (UCD)', definition: 'Ein Designprozess, bei dem die Bedürfnisse, Wünsche und Einschränkungen der Endnutzenden in jeder Phase im Mittelpunkt stehen.', category: 'Grundlagen' },
  { term: 'Wireframe', definition: 'Ein schematischer Bauplan einer Seite oder App, der Struktur und Inhalte ohne grafische Details zeigt (Low-Fidelity).', category: 'Prozess' },
  { term: 'White Space', definition: 'Der leere Raum zwischen Designelementen (auch „Negative Space“), der wichtig für Lesbarkeit und Struktur ist.', category: 'UI-Elemente' },
  { term: 'Design System', definition: 'Gemeinsame Sprache von Design und Entwicklung aus Prinzipien, Design Tokens, Komponenten, Mustern und Dokumentation, gepflegt und versioniert wie ein Produkt.', category: 'UI-Elemente' },
  { term: 'Design Token', definition: 'Benannter Gestaltungswert wie Farbe, Abstand oder Schriftgröße, z. B. color.action.primary. Üblich in drei Ebenen: primitiv, semantisch, komponentenbezogen.', category: 'UI-Elemente' },
  { term: 'Atomic Design', definition: 'Methode von Brad Frost (2016), Oberflächen aus Atomen, Molekülen, Organismen, Templates und Seiten aufzubauen.', category: 'UI-Elemente' }
];

export const LEARNING_GUIDE_2026: GuideSection[] = [
  {
    id: "foundations",
    title: "Phase 1: Fundament aufbauen",
    description: "Design-Prinzipien & Theorie sind essenziell. Ohne sie „prompten“ Sie nur blind.",
    resources: [
      {
        title: "Laws of UX",
        description: "Sammlung psychologisch fundierter Design-Prinzipien (Fitts's Law, Hick's Law, etc.).",
        isFree: true,
        url: "https://lawsofux.com/"
      },
      {
        title: "Nielsen Norman Group Articles",
        description: "Der Goldstandard für UX-Forschung. Usability-Heuristiken und Grundlagen.",
        isFree: true,
        url: "https://www.nngroup.com/articles/"
      },
      {
        title: "Google Material Design",
        description: "Umfassendes Design-System. Lehrt Komponenten-Denken und Accessibility.",
        isFree: true,
        url: "https://m3.material.io/"
      },
      {
        title: "Apple Human Interface Guidelines",
        description: "Design-Dokumentation für iOS/macOS. Wichtig für Cross-Platform-Verständnis.",
        isFree: true,
        url: "https://developer.apple.com/design/human-interface-guidelines/"
      },
      {
        title: "Google UX Design Certificate (Audit)",
        description: "Über 200 Stunden Content. Videos und Lesematerial sind im Audit-Modus kostenlos.",
        isFree: true,
        url: "https://www.coursera.org/professional-certificates/google-ux-design"
      }
    ]
  },
  {
    id: "figma",
    title: "Phase 2: Figma lernen",
    description: "Figma ist der Industriestandard. Glücklicherweise kostet das Lernen nichts.",
    resources: [
      {
        title: "Figma Official YouTube",
        description: "Offizielle Tutorials von Basics bis Auto-Layout.",
        isFree: true,
        url: "https://www.youtube.com/@Figma"
      },
      {
        title: "Figma 101 by Shift Nudge",
        description: "1-stündiger Gratiskurs zu den absoluten Basics.",
        isFree: true,
        url: "https://www.youtube.com/watch?v=jwO911qY_eE"
      },
      {
        title: "UXtoast Figma Certificate",
        description: "Kostenloser Kurs mit Zertifikat (< 90 Min).",
        isFree: true,
        url: "https://www.uxtoast.com/"
      }
    ]
  },
  {
    id: "ai-tools",
    title: "Phase 3: KI-Tools (Free Tiers)",
    description: "Das Toolkit 2026 beinhaltet KI. Diese Tools bieten kostenlose Zugänge.",
    resources: [
      {
        title: "Figma AI & Make",
        description: "In Figma integrierte KI für Layouts und Content.",
        isFree: true,
        url: "https://www.figma.com/ai/"
      },
      {
        title: "Leonardo.ai",
        description: "Beste kostenlose Alternative zu Midjourney für Bilderzeugung.",
        isFree: true,
        url: "https://leonardo.ai/"
      },
      {
        title: "Microsoft Designer",
        description: "KI-Grafiktool mit DALL-E Integration.",
        isFree: true,
        url: "https://designer.microsoft.com/"
      }
    ]
  },
  {
    id: "inspiration",
    title: "Phase 4: Inspiration & Patterns",
    description: "Bestehende Muster zu studieren beschleunigt das Lernen.",
    resources: [
      {
        title: "Mobbin (Free Tier)",
        description: "Echte App-Screenshots (iOS/Android). Ideal für Pattern-Recherche.",
        isFree: true,
        url: "https://mobbin.com/"
      },
      {
        title: "Collect UI",
        description: "Kuratierte Galerie nach UI-Typen (Login, Checkout, etc.).",
        isFree: true,
        url: "https://collectui.com/"
      },
      {
        title: "Page Flows",
        description: "Videos von User-Flows echter Produkte.",
        isFree: true,
        url: "https://pageflows.com/"
      }
    ]
  },
  {
    id: "accessibility",
    title: "Phase 5: Barrierefreiheit",
    description: "KI übersieht oft Accessibility. Menschliche Kontrolle ist kritisch.",
    resources: [
      {
        title: "WebAIM",
        description: "Artikel, Training und der essentielle Contrast Checker.",
        isFree: true,
        url: "https://webaim.org/"
      },
      {
        title: "W3C WAI",
        description: "Offizielle WCAG Richtlinien.",
        isFree: true,
        url: "https://www.w3.org/WAI/"
      },
      {
        title: "A11y Project",
        description: "Checklisten und Mythen-Debunking.",
        isFree: true,
        url: "https://www.a11yproject.com/"
      }
    ]
  }
];

export const GESTALT_PRINCIPLES: GestaltPrinciple[] = [
  {
    id: 'proximity',
    name: 'Gesetz der Nähe',
    detailedDescription: 'Elemente, die nah beieinander liegen, werden als zusammengehörig wahrgenommen. Nähe schlägt oft andere Merkmale wie Farbe oder Form. Dies ist das mächtigste Werkzeug für Layouts.',
    visualType: 'proximity',
    examples: [
      { context: 'Formulare', title: 'Label-Feld Beziehung', description: 'Beschriftungen müssen näher am zugehörigen Feld stehen als am Feld darüber.' },
      { context: 'Cards', title: 'Inhaltliche Gruppen', description: 'Bild, Titel und Text bilden durch Nähe eine Einheit (Card).' },
      { context: 'Dashboard', title: 'Funktionsgruppen', description: 'Zusammengehörige Buttons oder Regler werden räumlich gruppiert.' }
    ]
  },
  {
    id: 'similarity',
    name: 'Gesetz der Ähnlichkeit',
    detailedDescription: 'Elemente mit gleichen visuellen Merkmalen (Farbe, Form, Größe, Orientierung) werden als Gruppe oder zusammengehörig empfunden.',
    visualType: 'similarity',
    examples: [
      { context: 'Navigation', title: 'Links & Menüs', description: 'Alle klickbaren Links haben die gleiche Farbe/Unterstreichung.' },
      { context: 'Filter', title: 'Kategorien', description: 'Tags oder Filter-Chips nutzen identische Styles für gleiche Hierarchie.' },
      { context: 'Smart Home', title: 'Status-Anzeigen', description: 'Aktive Geräte teilen den gleichen visuellen Zustand (z. B. Highlight).' }
    ]
  },
  {
    id: 'closure',
    name: 'Gesetz der Geschlossenheit',
    detailedDescription: 'Wir tendieren dazu, Formen als geschlossen wahrzunehmen, auch wenn sie Lücken enthalten. Unser Gehirn „füllt“ die fehlenden Informationen auf.',
    visualType: 'closure',
    examples: [
      { context: 'Icons', title: 'Vereinfachung', description: 'Hamburger-Menü (3 Striche) wird als „Liste“ oder ganzes Objekt erkannt.' },
      { context: 'Feedback', title: 'Loader', description: 'Ein Kreis aus Punkten oder Segmenten wird als rotierender Ring gesehen.' },
      { context: 'Content', title: 'Teaser / „Below Fold“', description: 'Angeschnittene Inhalte signalisieren: „Hier geht es weiter“.' }
    ]
  },
  {
    id: 'continuity',
    name: 'Gesetz der Kontinuität',
    detailedDescription: 'Das Auge folgt Linien, Pfaden oder Kurven. Elemente, die auf einer Linie angeordnet sind, werden als zusammengehörig wahrgenommen.',
    visualType: 'continuity',
    examples: [
      { context: 'Slider', title: 'Carousel / Slider', description: 'Die horizontale Anordnung suggeriert eine Fortsetzung außerhalb des Bildschirms.' },
      { context: 'Navigation', title: 'Breadcrumbs', description: 'Der Pfad zeigt eine lineare Hierarchie von links nach rechts.' },
      { context: 'Data Viz', title: 'Graphen', description: 'Wir verbinden einzelne Datenpunkte automatisch zu einer Trendlinie.' }
    ]
  },
  {
    id: 'figure-ground',
    name: 'Figur-Grund-Beziehung',
    detailedDescription: 'Wir unterscheiden automatisch zwischen einem Objekt (Figur) im Vordergrund und dem Hintergrund. Dies ist essentiell für Fokus und Hierarchie.',
    visualType: 'figure-ground',
    examples: [
      { context: 'Overlays', title: 'Modals / Dialoge', description: 'Ein abgedunkelter Hintergrund (Backdrop) hebt das Modal als Figur hervor.' },
      { context: 'Buttons', title: 'Floating Action Button', description: 'Schatten lösen den Button vom Hintergrund (Elevation).' },
      { context: 'Maps', title: 'Pins & Marker', description: 'Pins werden als Figur auf dem „Hintergrund“ der Karte wahrgenommen.' }
    ]
  },
  {
    id: 'experience',
    name: 'Gesetz der Erfahrung',
    detailedDescription: 'Wir greifen auf gelerntes Wissen zurück, um Neues zu interpretieren. Kulturelle Konventionen und bekannte Muster steuern die Wahrnehmung.',
    visualType: 'experience',
    examples: [
      { context: 'UI Pattern', title: 'Speichern Icon', description: 'Die Diskette ist veraltet, wird aber gelernt als „Speichern“ verstanden.' },
      { context: 'Status', title: 'Ampelfarben', description: 'Rot = Fehler/Stop, Grün = Erfolg/Go ist tief verwurzeltes Wissen.' },
      { context: 'Mobile', title: 'Hamburger Icon', description: 'Drei Striche haben keine inhärente Bedeutung, sind aber als „Menü“ gelernt.' }
    ]
  },
  {
    id: 'pragnanz',
    name: 'Gesetz der Prägnanz',
    detailedDescription: 'Auch „Gesetz der guten Gestalt“. Wir interpretieren komplexe oder mehrdeutige Bilder in der einfachsten möglichen Form.',
    visualType: 'pragnanz',
    examples: [
      { context: 'Logo Design', title: 'Olympische Ringe', description: 'Wir sehen 5 Ringe, nicht hunderte komplexer Schnittmengen-Formen.' },
      { context: 'Wireframing', title: 'Low-Fidelity', description: 'Boxen mit einem „X“ werden sofort als Platzhalter für Bilder erkannt.' },
      { context: 'Avatare', title: 'User Icons', description: 'Ein Kreis und ein Halbkreis reichen, um eine „Person“ zu erkennen.' }
    ]
  }
];

export const ISO_PRINCIPLES: IsoPrinciple[] = [
  {
    id: 1,
    title: "Aufgabenangemessenheit",
    englishTitle: "Suitability for the user’s tasks",
    description: "Ein interaktives System ist aufgabenangemessen, wenn es die Nutzenden dabei unterstützt, ihre Aufgaben effektiv und effizient zu erledigen, ohne sie durch unnötige Interaktionsschritte zu belasten.",
    example: "Ein Online-Formular, das zur Postleitzahl den Ort automatisch ergänzt."
  },
  {
    id: 2,
    title: "Selbstbeschreibungsfähigkeit",
    englishTitle: "Self-descriptiveness",
    description: "Ein interaktives System ist selbstbeschreibungsfähig, wenn den Nutzenden jederzeit klar ist, wo sie sich befinden, welche Handlungen möglich sind und wie sie ausgeführt werden, direkt sichtbar oder bei Bedarf erklärt.",
    example: "Tooltips, die erklären, wofür ein komplexes Einstellungssymbol steht."
  },
  {
    id: 3,
    title: "Erwartungskonformität",
    englishTitle: "Conformity with user expectations",
    description: "Ein interaktives System ist erwartungskonform, wenn es den aus dem Nutzungskontext vorhersehbaren Bedürfnissen der Nutzenden sowie allgemein anerkannten Konventionen entspricht.",
    example: "Ein Link ist unterstrichen oder farblich abgehoben; der Warenkorb befindet sich oben rechts."
  },
  {
    id: 4,
    title: "Erlernbarkeit",
    englishTitle: "Learnability",
    description: "Ein interaktives System ist erlernbar, wenn es die Nutzenden dabei unterstützt, seine Funktionen zu entdecken und den Umgang damit zu lernen.",
    example: "Eine kurze, überspringbare Einführungstour bei der ersten Nutzung."
  },
  {
    id: 5,
    title: "Steuerbarkeit",
    englishTitle: "Controllability",
    description: "Ein interaktives System ist steuerbar, wenn die Nutzenden Ablauf, Richtung und Tempo der Interaktion selbst bestimmen und die Darstellung an ihre Bedürfnisse anpassen können.",
    example: "Ein „Zurück“-Button im Bestellprozess; ein Umschalter für den Dunkelmodus."
  },
  {
    id: 6,
    title: "Robustheit gegen Benutzungsfehler",
    englishTitle: "Use error robustness",
    description: "Ein interaktives System ist robust gegen Benutzungsfehler, wenn es hilft, Fehler zu vermeiden, und das beabsichtigte Ergebnis trotz fehlerhafter Eingaben mit keinem oder geringem Korrekturaufwand erreicht werden kann.",
    example: "Die „Rückgängig“-Funktion oder eine Suche, die Tippfehler verzeiht."
  },
  {
    id: 7,
    title: "Benutzerbindung",
    englishTitle: "User engagement",
    description: "Ein interaktives System fördert die Benutzerbindung, wenn es Funktionen und Informationen so einladend und motivierend darbietet, dass Nutzende es gern und dauerhaft verwenden.",
    example: "Eine Fortschrittsanzeige und eine freundliche Bestätigung nach dem Ausfüllen eines Profils."
  }
];

export const NIELSEN_HEURISTICS: NielsenHeuristic[] = [
  {
    id: 1,
    title: "Sichtbarkeit des Systemstatus",
    description: "Das System sollte die Nutzenden immer darüber informieren, was gerade passiert – durch angemessenes Feedback innerhalb einer angemessenen Zeit.",
    example: "Ein Ladebalken beim Datei-Upload."
  },
  {
    id: 2,
    title: "Übereinstimmung zwischen System und Wirklichkeit",
    description: "Das System sollte die Sprache der Nutzenden sprechen und Wörter, Phrasen und Konzepte nutzen, die den Nutzenden vertraut sind.",
    example: "Ein Papierkorb-Icon für gelöschte Dateien."
  },
  {
    id: 3,
    title: "Nutzerkontrolle und Freiheit",
    description: "Nutzende führen oft Aktionen versehentlich aus und benötigen einen deutlich sichtbaren „Notausgang“, um den unerwünschten Zustand zu verlassen.",
    example: "Die „Rückgängig“ (Undo) und „Wiederholen“ (Redo) Funktion."
  },
  {
    id: 4,
    title: "Konsistenz und Standards",
    description: "Nutzende sollten sich nicht fragen müssen, ob verschiedene Wörter, Situationen oder Aktionen dasselbe bedeuten. Plattformkonventionen sollten eingehalten werden.",
    example: "Das Logo führt immer zur Startseite; blaue unterstrichene Texte sind Links."
  },
  {
    id: 5,
    title: "Fehlervermeidung",
    description: "Noch besser als eine gute Fehlermeldung ist ein sorgfältiges Design, das verhindert, dass ein Problem überhaupt erst auftritt.",
    example: "Ein Kalender-Widget zur Datumsauswahl verhindert Formatierungsfehler."
  },
  {
    id: 6,
    title: "Erkennen statt Erinnern",
    description: "Die kognitive Belastung der Nutzenden sollte minimiert werden, indem Objekte, Aktionen und Optionen sichtbar gemacht werden.",
    example: "Eine Liste der zuletzt besuchten Seiten (History)."
  },
  {
    id: 7,
    title: "Flexibilität und Effizienz der Nutzung",
    description: "Beschleuniger (Shortcuts) – die für Neulinge oft unsichtbar sind – können die Interaktion für Fachleute beschleunigen.",
    example: "Tastaturkürzel wie Strg+C / Strg+V."
  },
  {
    id: 8,
    title: "Ästhetisches und minimalistisches Design",
    description: "Dialoge sollten keine Informationen enthalten, die irrelevant sind oder nur selten benötigt werden.",
    example: "Die Google-Startseite (nur Suchschlitz, keine überflüssige Ablenkung)."
  },
  {
    id: 9,
    title: "Hilfe beim Erkennen, Diagnostizieren und Beheben von Fehlern",
    description: "Fehlermeldungen sollten in einfacher Sprache verfasst sein (keine Codes), das Problem genau beschreiben und konstruktiv eine Lösung vorschlagen.",
    example: "„In der E-Mail-Adresse fehlt das @-Zeichen.“ statt „Fehler: ungültige Eingabe (Code 422)“."
  },
  {
    id: 10,
    title: "Hilfe und Dokumentation",
    description: "Auch wenn es besser ist, wenn das System ohne Dokumentation genutzt werden kann, kann es notwendig sein, Hilfe und Dokumentation bereitzustellen.",
    example: "Eine durchsuchbare FAQ-Seite oder ein kontextsensitiver Hilfe-Button."
  }
];

export const LITERATURE_ITEMS: LiteratureItem[] = [
  {
    id: "don-norman",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    year: "1988/2013",
    isbn: "978-0465050659",
    description: "Die Bibel des User Centered Design. Norman erklärt Affordances, Signifiers und Mappings anhand von Türen, Teekannen und Lichtschaltern.",
    category: "Must Read",
    color: "text-orange-100 bg-orange-600"
  },
  {
    id: "steve-krug",
    title: "Don't Make Me Think",
    author: "Steve Krug",
    year: "2000",
    isbn: "978-0321965516",
    description: "Der Klassiker zur Web-Usability. Schnell zu lesen, pragmatisch und voller Humor. Das erste Gesetz: Wenn die Nutzenden nachdenken müssen, ist das Design gescheitert.",
    category: "Web Usability",
    color: "text-blue-100 bg-blue-700"
  },
  {
    id: "nielsen",
    title: "Usability Engineering",
    author: "Jakob Nielsen",
    year: "1993",
    isbn: "978-0125184069",
    description: "Das Standardwerk zu Usability-Methoden. Obwohl älter, sind die Konzepte (Heuristiken, Discount Usability Engineering) heute noch gültig.",
    category: "Engineering",
    color: "text-emerald-100 bg-emerald-700"
  },
  {
    id: "kahneman",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    year: "2011",
    isbn: "978-0374275631",
    description: "Nobelpreisträger Kahneman erklärt System 1 (schnell, intuitiv) und System 2 (langsam, logisch). Essenziell für das Verständnis kognitiver Verzerrungen.",
    category: "Psychologie",
    color: "text-stone-100 bg-stone-700"
  },
  {
    id: "sprint",
    title: "Sprint",
    author: "Jake Knapp",
    year: "2016",
    isbn: "978-1501121746",
    description: "Wie man Probleme in nur fünf Tagen löst und neue Ideen testet. Der Design Sprint Prozess von Google Ventures.",
    category: "Prozess",
    color: "text-yellow-100 bg-yellow-700"
  },
  {
    id: "lean-ux",
    title: "Lean UX",
    author: "Jeff Gothelf",
    year: "2013",
    isbn: "978-1449311650",
    description: "Anwendung von Lean-Prinzipien auf UX Design. Weniger Dokumentation, mehr Kollaboration und schnelleres Feedback.",
    category: "Agile",
    color: "text-red-100 bg-red-700"
  },
  {
    id: "weinschenk",
    title: "100 Things Every Designer Needs to Know About People",
    author: "Susan Weinschenk",
    year: "2011",
    isbn: "978-0321767534",
    description: "Kompakte Fakten über menschliche Wahrnehmung und Psychologie. Erklärt wissenschaftlich fundiert, warum Menschen wie reagieren.",
    category: "Psychologie",
    color: "text-purple-100 bg-purple-700"
  },
  {
    id: "shneiderman",
    title: "Human-Centered AI",
    author: "Ben Shneiderman",
    year: "2022",
    isbn: "978-0192845290",
    description: "Wie man KI-Systeme gestaltet, die den Menschen unterstützen statt ihn zu ersetzen. Ein optimistischer Blick auf die Zukunft der HC-AI.",
    category: "AI & UX",
    color: "text-cyan-100 bg-cyan-700"
  }
];

export const ONLINE_RESOURCES: OnlineResource[] = [
  {
    id: "nng",
    platform: "Nielsen Norman Group",
    title: "UX Articles & Videos",
    description: "Die wohl renommierteste Quelle für UX-Forschung. Tausende kostenlose Artikel, basierend auf empirischen Studien.",
    level: "Alle Level",
    cost: "Free",
    icon: "🔬"
  },
  {
    id: "lawsofux",
    platform: "Laws of UX",
    title: "Psychologie für Designende",
    description: "Wunderschön gestaltete Übersicht der wichtigsten psychologischen Prinzipien (Hick's Law, Fitts's Law, etc.).",
    level: "Beginner",
    cost: "Free",
    icon: "⚖️"
  },
  {
    id: "google-ux",
    platform: "Coursera / Google",
    title: "Google UX Design Certificate",
    description: "Umfassender Einstiegskurs für absolute Neulinge. Deckt den gesamten Design Thinking Prozess ab.",
    level: "Beginner",
    cost: "Subscription",
    icon: "🎓"
  },
  {
    id: "idf",
    platform: "Interaction Design Foundation",
    title: "UX Kurse",
    description: "Breites Angebot an spezialisierten Kursen (Psychologie, Gamification, Mobile UX) zu einem fairen Jahrespreis.",
    level: "Intermediate",
    cost: "Subscription",
    icon: "🏛️"
  },
  {
    id: "pair",
    platform: "Google PAIR",
    title: "People + AI Research",
    description: "Googles Guidelines für KI-Design. Enthält das berühmte „PAIR Guidebook“ mit Best Practices für AI-User-Interfaces.",
    level: "Advanced",
    cost: "Free",
    icon: "🤖"
  },
  {
    id: "growth-design",
    platform: "Growth.design",
    title: "Psychology Case Studies",
    description: "Interaktive Comic-Strip Case Studies, die bekannte Apps auf psychologische Prinzipien analysieren. Extrem unterhaltsam.",
    level: "All Levels",
    cost: "Free",
    icon: "🍬"
  }
];