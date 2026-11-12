/* Daten der Übungen */

export const musterOptionen = [
  ['sticky', 'Sticky-Grafik mit Textschritten'],
  ['reveal', 'Einblenden (Reveal)'],
  ['parallax', 'Parallax'],
  ['scrub', 'Scroll-gekoppelte Animation (Scrubbing)'],
  ['sprung', 'Kapitelsprung oder horizontaler Abschnitt']
];
/* [Beschreibung, richtiges Muster, Erklärung] */
export const musterFaelle = [
  ['Eine Karte Europas bleibt links stehen. Rechts scrollen vier Absätze vorbei, und mit jedem Absatz wird ein anderes Land hervorgehoben.', 'sticky', 'Die Grafik bleibt stehen, die Textschritte verändern sie.'],
  ['Beim Scrollen bewegen sich Wolken kaum, Berge etwas mehr und Bäume im Vordergrund fast normal mit.', 'parallax', 'Unterschiedliche Geschwindigkeiten der Ebenen erzeugen Tiefe.'],
  ['Eine Zeichnung eines Hauses entsteht Strich für Strich. Scrollt man zurück, verschwinden die Striche wieder.', 'scrub', 'Der Fortschritt der Animation hängt direkt an der Scrollposition.'],
  ['Zitate von Zeitzeuginnen und Zeitzeugen erscheinen mit einer kurzen Aufblende, sobald sie ins Bild kommen.', 'reveal', 'Ein einmaliger Effekt beim Erreichen des sichtbaren Bereichs.'],
  ['Ein Menü oben listet fünf Kapitel. Ein Klick führt mit einer kurzen Animation direkt zum gewählten Kapitel.', 'sprung', 'Ankerlinks oder „Scroll to“ springen zu Abschnitten.'],
  ['Ein Diagramm bleibt stehen, während darunter drei Erklärungen vorbeiziehen. Mit jeder Erklärung kommt eine Linie hinzu.', 'sticky', 'Auch hier steuern Textschritte die stehende Grafik.'],
  ['In einem Abschnitt zur Firmengeschichte wandert eine Zeitleiste beim Scrollen nach unten seitwärts durch das Bild.', 'sprung', 'Ein horizontaler Abschnitt übersetzt das vertikale Scrollen in eine Seitwärtsbewegung.'],
  ['Ein Smartphone-Modell dreht sich beim Scrollen langsam um die eigene Achse und zeigt nacheinander Vorder- und Rückseite.', 'scrub', 'Die Drehung folgt direkt dem Scrollen, typischer Fall für Scroll transform.']
];

/* Storyboard ordnen: Einträge in richtiger Reihenfolge, Start gemischt */
export const storyboard = {
  items: [
    ['Einstieg', 'Ein Bild weckt Neugier: Ein Glas Leitungswasser in Großaufnahme, darüber die Frage „Woher kommt es?“'],
    ['Ursprung', 'Regen fällt auf eine Landschaft aus drei Parallax-Ebenen.'],
    ['Weg', 'Sticky-Querschnitt: Das Wasser versickert durch Boden- und Gesteinsschichten.'],
    ['Wendepunkt', 'Ein Brunnen fördert das Grundwasser, das Wasserwerk reinigt es.'],
    ['Höhepunkt', 'Die Zahl 128 Liter pro Kopf und Tag zählt hoch.'],
    ['Ruhepunkt und Ausblick', 'Drei Karten ohne Animation: Was Sie selbst tun können.']
  ],
  start: [3, 0, 5, 1, 4, 2],
  success: 'Richtig. Einstieg, Ursprung, Weg, Wendepunkt, Höhepunkt und ein ruhiger Ausklang ergeben einen klaren Spannungsbogen.',
  hint: (n) => `Position ${n} passt noch nicht. Denken Sie an den Spannungsbogen: Wo beginnt der Weg des Wassers, wo liegt der Höhepunkt?`
};

export const werkzeugOptionen = [['design', 'Figma Design'], ['sites', 'Figma Sites'], ['make', 'Figma Make']];
/* [Szenario, beste Wahl, Erklärung] */
export const werkzeugFaelle = [
  ['Sie wollen morgen in der Teambesprechung zeigen, wie sich die Geschichte anfühlen soll. Veröffentlicht wird später.', 'design', 'Für ein schnelles Konzept genügt ein Prototyp. Smart Animate und Sticky reichen, um die Idee zu zeigen.'],
  ['Ein Museum möchte eine öffentliche Seite mit Parallax-Bildern und Einblendungen, ohne dass jemand programmiert.', 'sites', 'Sites bietet Scroll parallax und Reveal fertig an und veröffentlicht die Seite direkt.'],
  ['Eine Datengeschichte soll ein Liniendiagramm zeigen, das sich passend zur Scrollposition Punkt für Punkt aufbaut und auf echte Daten zugreift.', 'make', 'Diagramme aus Daten, die dem Scrollen folgen, erfordern Code. Make kann ihn erzeugen.'],
  ['Sie möchten im Usability-Test prüfen, ob Menschen das Kapitelmenü verstehen.', 'design', 'Für einen Test der Navigation reicht ein Prototyp mit „Scroll to“ und Variablen.'],
  ['Eine Hochschule will eine responsive Projektseite mit Sticky-Grafik und eigener Domain veröffentlichen.', 'sites', 'Sticky, Scroll transform mit „Other layer in view“, Breakpoints und Veröffentlichen unter eigener Domain sind in Sites vorgesehen.'],
  ['Ein Spiel-Element soll mitzählen, wie weit jemand gescrollt hat, und am Ende eine persönliche Auswertung zeigen.', 'make', 'Eigene Logik und Zustände gehen über die fertigen Interaktionen hinaus. Hier hilft generierter Code.']
];

/* Prompt-Werkstatt: Kriterien mit Suchbegriffen (alle klein geschrieben) */
export const promptKriterien = [
  ['Ziel und Thema genannt', ['thema', 'geschichte', 'seite über', 'zeige', 'erkläre', 'scrollytelling'], 'Worum geht es? Nennen Sie Thema und Ziel der Seite.'],
  ['Gerät oder Breite genannt', ['smartphone', 'mobil', 'desktop', ' px', 'breakpoint', 'tablet'], 'Für welches Gerät gestalten Sie zuerst?'],
  ['Abschnitte beschrieben', ['abschnitt', 'schritt', 'kapitel', 'section'], 'Gliedern Sie die Seite in Abschnitte oder Schritte.'],
  ['Muster benannt', ['sticky', 'parallax', 'einblend', 'reveal', 'scrub', 'scroll transform', 'bleibt stehen'], 'Welches Scrollytelling-Muster gilt für welchen Abschnitt?'],
  ['Bewegung präzise (Dauer, Distanz, Faktor oder Easing)', [' ms', 'sekunde', '%', 'faktor', 'ease', 'pixel'], 'Beschreiben Sie Bewegung mit Zahlen: Dauer, Distanz, Faktor, Easing.'],
  ['Auslöser genannt', ['wenn', 'sobald', 'erreicht', 'ins bild', 'beim scrollen', 'in view'], 'Wann startet die Bewegung? Nennen Sie den Auslöser.'],
  ['Reduzierte Bewegung berücksichtigt', ['reduced-motion', 'reduzierte bewegung', 'bewegung reduzieren', 'ohne animation'], 'Was passiert, wenn jemand „Bewegung reduzieren“ eingeschaltet hat?'],
  ['Weitere Barrierefreiheit (Tastatur, Alternativtexte, Überschriften)', ['tastatur', 'alternativtext', 'alt-text', 'überschrift', 'kontrast', 'screenreader'], 'Nennen Sie Tastaturbedienung, Alternativtexte oder Kontrast.'],
  ['Bezug auf angehängte Entwürfe', ['angehängt', 'frame', 'entwurf', 'figma design'], 'Verweisen Sie auf die angehängten Frames, damit Make Ihr Design übernimmt.']
];
export const promptBausteine = [
  ['Ziel', 'Baue eine Scrollytelling-Seite zum Thema „…“ für Studierende, zuerst für Smartphones (390 px).'],
  ['Entwurf', 'Übernimm Layout, Farben und Schriften aus den angehängten Frames.'],
  ['Abschnitte', 'Abschnitt 1: … Abschnitt 2: … Abschnitt 3: …'],
  ['Parallax', 'Abschnitt 1 zeigt drei Ebenen mit Parallax: Hintergrund 30 %, Mittelgrund 60 %, Vordergrund 100 % der Scrollgeschwindigkeit.'],
  ['Sticky', 'Die Grafik in Abschnitt 2 bleibt sticky stehen. Sobald ein Textschritt die Bildschirmmitte erreicht, wechselt sie in den passenden Zustand (Überblendung 300 ms, ease-out).'],
  ['Barrierefreiheit', 'Wenn „prefers-reduced-motion: reduce“ aktiv ist, entfallen Parallax und Übergänge. Alle Inhalte bleiben ohne Animation sichtbar. Nutze semantische Überschriften, Alternativtexte und sichtbaren Tastaturfokus.']
];

/* Barrierefrei oder nicht? [Aussage, true = unproblematisch, Erklärung] */
export const a11yFaelle = [
  ['Ein Laufband mit Partnerlogos läuft endlos und lässt sich nicht anhalten.', false, 'Automatische Bewegung über fünf Sekunden braucht eine Pause-Möglichkeit (WCAG 2.2.2).'],
  ['Bei eingeschalteter Einstellung „Bewegung reduzieren“ wechseln die Zustände der Sticky-Grafik ohne Übergang.', true, 'Der Inhalt bleibt vollständig, nur die Bewegung entfällt. So soll es sein.'],
  ['Absätze bleiben unsichtbar, bis eine Einblende-Animation sie zeigt. Wenn JavaScript nicht lädt, bleiben sie leer.', false, 'Inhalte dürfen nicht von Effekten abhängen. Ohne Skript oder Animation müssen sie sichtbar sein.'],
  ['Der Fließtext scrollt normal, nur die Hintergrundebenen bewegen sich mit Parallax.', true, 'Text ruhig, Tiefe nur im Hintergrund: gut lesbar.'],
  ['Weiße Schrift steht über einem Foto, das beim Scrollen von dunkel zu hell wechselt.', false, 'Der Kontrast muss in jedem Zustand reichen. Ein halbtransparenter Hintergrund hinter dem Text hilft.'],
  ['Ein Diagramm baut sich beim Scrollen auf. Darunter steht ein Satz, der die Kernaussage zusammenfasst.', true, 'Die Textalternative macht die Aussage auch für Screenreader zugänglich.'],
  ['Die Seite bremst das Scrollen ab und springt nach jeder Bewegung automatisch zum nächsten Abschnitt.', false, 'Das ist Scroll-Hijacking. Es nimmt die Kontrolle und kann Übelkeit auslösen.'],
  ['Ein Hover-Effekt zeigt Zusatzinformationen. Auf Smartphones erscheinen sie stattdessen beim Antippen.', true, 'Hover gibt es auf Touchgeräten nicht. Eine Alternative per Antippen ist richtig.']
];

/* Mini-Projekt: Felder */
export const projektFelder = [
  ['thema', 'Thema und Titel der Seite'],
  ['kern', 'Kernaussage in einem Satz'],
  ['publikum', 'Zielgruppe und wichtigstes Gerät'],
  ['werkzeug', 'Gewähltes Werkzeug (Design, Sites, Make) und Begründung'],
  ['a11y', 'Maßnahmen für Barrierefreiheit']
];
export const projektSchritte = 5;
