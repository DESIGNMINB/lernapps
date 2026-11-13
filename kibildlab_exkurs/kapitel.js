/* KI-Bild-App, Exkurs zu Lernmodul 10 (UX & KI).
   Abschnitte: { h, p: [Absätze], list, img: [Bildschlüssel], fig: Diagrammschlüssel, demo, table } */
export const chapters = [
  {
    id: 'copyspace', title: 'Copy Space: Platz für Text und Interface', period: 'Labor 1 · Layout und Raster', icon: 'layout',
    lead: 'Ein KI-Bild kann großartig aussehen und trotzdem im Layout scheitern, weil kein ruhiger Platz für Überschrift, Text und Schaltfläche bleibt. Copy Space ist dieser Freiraum. Er lässt sich im Prompt anlegen, nachträglich schaffen und am Raster prüfen.',
    sections: [
      { h: 'Negativer Raum als Gestaltungsmittel', p: [
        '<b>Copy Space</b> (auch Textfreiraum) ist ein ruhiger, gleichmäßiger Bildbereich, auf dem Text gut lesbar bleibt: Himmel, eine Wand, Wasser, eine unscharfe Fläche. In der Gestaltung spricht man von <b>negativem Raum</b>. Er ist kein Rest, sondern Teil der Komposition und lenkt den Blick auf das Motiv.',
        'Für Interfaces ist Copy Space doppelt wichtig. Text über Bildern muss die Kontrastanforderungen der WCAG 2.2 erfüllen (mindestens 4,5 : 1 für normalen Text, 3 : 1 für großen Text) – und zwar an jeder Stelle, auf der Buchstaben liegen. Ein unruhiger Hintergrund mit hellen und dunklen Stellen macht das fast unmöglich.'
      ], img: ['fluss'] },
      { h: 'Copy Space im Prompt anlegen', p: [
        'Bildmodelle reagieren auf Angaben zur Komposition, aber nicht zuverlässig. Bewährt haben sich Formulierungen, die Motiv und Freiraum zugleich beschreiben: wo das Motiv steht, wie groß es ist und was den Rest füllt. Prüfen Sie jedes Ergebnis, denn Positionsangaben wie „links“ und „rechts“ werden oft vertauscht oder ignoriert.'
      ], table: {
        head: ['Ziel', 'Mögliche Formulierung', 'Worauf achten'],
        rows: [
          ['Motiv aus der Mitte rücken', '„subject in the right third“, „off-center composition“', 'Drittelregel; das Motiv darf nicht unter dem Text liegen'],
          ['Ruhige Fläche', '„large calm empty sky“, „plain wall“, „soft blurred background“', 'Fläche ohne Muster und Kontrastsprünge'],
          ['Kleines Motiv', '„small figure in a wide landscape“, „wide shot“', 'Weite Einstellung statt Nahaufnahme'],
          ['Format passend wählen', 'Seitenverhältnis direkt einstellen, etwa 16:9 für ein Hero-Bild', 'Format im Werkzeug setzen statt nur im Text beschreiben'],
          ['Unerwünschtes vermeiden', '„no text, no logo“ oder ein eigenes Feld für Ausschlüsse', 'Nicht jedes Modell versteht Verneinungen']
        ] } },
      { h: 'Probieren Sie es aus: Text aufs Raster legen', p: ['Legen Sie einen Textblock auf das 12-Spalten-Raster über dem Beispielbild. Die Rückmeldung misst den Kontrast an jeder Stelle des Blocks, die Unruhe des Hintergrunds und ob der Block das Motiv verdeckt. Sie bedienen alles mit Auswahlfeldern, also auch per Tastatur.'], demo: 'copyspace' },
      { h: 'Wenn der Platz fehlt', list: [
        '<b>Outpainting:</b> Das Bild nach einer Seite erweitern, um Fläche zu gewinnen (Labor 4).',
        '<b>Struktur vorgeben:</b> Mit ControlNet oder einer Skizze die Lage des Motivs festlegen (Labor 2).',
        '<b>Gestalterisch lösen:</b> Verlauf oder halbtransparente Fläche hinter den Text legen, Text neben statt auf das Bild setzen.',
        '<b>Nicht erzwingen:</b> Wenn ein Bild keinen Platz hat, ist oft ein anderes Bild die bessere Lösung.'
      ] }
    ],
    merke: [
      'Copy Space ist ruhiger, gleichmäßiger Bildraum für Text und Bedienelemente.',
      'Text auf Bildern braucht überall mindestens 4,5 : 1 Kontrast (großer Text 3 : 1).',
      'Kompositionsangaben im Prompt helfen, werden aber nicht zuverlässig befolgt: immer prüfen.',
      'Fehlt Platz, helfen Outpainting, eine vorgegebene Struktur oder eine gestalterische Lösung.'
    ]
  },
  {
    id: 'controlnet', title: 'ControlNet: Struktur statt Zufall', period: 'Labor 2 · Räumliche Kontrolle', icon: 'grid',
    lead: 'Ein Text-Prompt beschreibt, was im Bild sein soll, aber kaum, wo. ControlNet ergänzt ein Bildmodell um eine zweite Eingabe: eine Kantenzeichnung, Skizze, Tiefenkarte oder Pose. So wird aus einem Wireframe ein Bild mit genau dieser Anordnung.',
    sections: [
      { h: 'Die Idee', p: [
        'Lvmin Zhang, Anyi Rao und Maneesh Agrawala stellten ControlNet 2023 vor (ICCV 2023). Ein bereits trainiertes Bildmodell wie Stable Diffusion bleibt dabei unverändert. Daneben wird eine trainierbare Kopie seines Encoders gesetzt, die die zusätzliche Bedingung verarbeitet. Beide sind über sogenannte <b>Zero Convolutions</b> verbunden: Schichten, die mit null beginnen, damit das Training das vorhandene Modell anfangs nicht stört.',
        'Für die Gestaltung heißt das: Sie können die Struktur eines Bildes vorgeben und den Rest dem Modell überlassen. Die Veröffentlichung zeigt unter anderem Bedingungen aus Kanten, Tiefe, Segmentierung und menschlicher Körperhaltung.'
      ], img: ['skizze'] },
      { h: 'Arten der Steuerung', table: {
        head: ['Bedingung', 'Was sie vorgibt', 'Typischer Einsatz'],
        rows: [
          ['Kanten (z. B. Canny-Verfahren)', 'Harte Umrisse aus einem Foto oder einer Zeichnung', 'Produkt oder Architektur exakt übernehmen'],
          ['Skizze (Scribble)', 'Grobe, freie Linien', 'Vom Wireframe oder Bleistiftentwurf zum Bild'],
          ['Tiefe', 'Was vorn und was hinten liegt', 'Räumliche Staffelung, Parallax-Ebenen (Labor 3)'],
          ['Pose', 'Haltung von Figuren als Skelett', 'Figuren in eine bestimmte Haltung bringen'],
          ['Segmentierung', 'Flächen mit Bedeutung (Himmel, Gebäude, Straße)', 'Bildaufbau nach Bereichen planen']
        ] } },
      { h: 'Wie stark soll die Steuerung sein?', p: [
        'Werkzeuge bieten einen Regler für die Stärke der Steuerung. Er heißt je nach Programm etwa „control weight“, „strength“ oder in der Bibliothek Diffusers „controlnet_conditioning_scale“ (Standardwert dort 1,0). Gemeint ist jeweils, wie stark das Ergebnis der Vorlage folgt.',
        'Allgemein gilt: Bei niedriger Stärke weicht das Bild deutlich von der Vorlage ab, bei hoher folgt es ihr eng. Sehr hohe Werte können ein Bild steif oder überzeichnet wirken lassen, vor allem bei groben Skizzen. Welche Werte gut sind, hängt von Modell, Bedingung und Vorlage ab. Feste Idealwerte gibt es nicht, deshalb arbeitet man mit Testreihen.'
      ] },
      { h: 'Probieren Sie es aus: von der Skizze zur Steuerkarte', p: [
        'Wählen Sie eine Vorlage oder zeichnen Sie mit Maus, Stift oder Finger eine eigene Skizze. Die Bedingung legt fest, welche Steuerkarte daraus entsteht, der Regler die Stärke der Steuerung.'
      ], demo: 'controlnet' },
      { h: 'Grenzen und Verantwortung', list: [
        'ControlNet steuert Struktur, nicht Qualität: Hände, Text und Details können trotzdem fehlerhaft sein.',
        'Wer Kanten aus einem fremden Foto nimmt, übernimmt dessen Komposition. Rechte und Quellen bleiben ein Thema (siehe <a href="../ux-ki/#recht">UX &amp; KI, Kapitel Recht, Ethik, Rolle</a>).',
        'Viele Online-Werkzeuge bieten ähnliche Funktionen unter anderen Namen, etwa „Strukturreferenz“ oder „Skizze zu Bild“.'
      ] }
    ],
    merke: [
      'ControlNet (Zhang, Rao und Agrawala 2023) ergänzt ein Bildmodell um eine räumliche Bedingung.',
      'Bedingungen: Kanten, Skizze, Tiefe, Pose, Segmentierung.',
      'Die Stärke regelt, wie eng das Bild der Vorlage folgt. Gute Werte findet man durch Testreihen, nicht durch feste Regeln.',
      'Struktur ist steuerbar, Fehler in Details bleiben möglich.'
    ]
  },
  {
    id: 'tiefe', title: 'Tiefenkarten für Parallax und Scrollytelling', period: 'Labor 3 · Ebenen', icon: 'layers',
    lead: 'Parallax lebt von Ebenen, die sich beim Scrollen unterschiedlich schnell bewegen. Eine Tiefenkarte zeigt, was im Bild vorn und was hinten liegt. Damit lässt sich ein einzelnes Bild in Vorder-, Mittel- und Hintergrund zerlegen.',
    sections: [
      { h: 'Was eine Tiefenkarte ist', p: [
        'Eine Tiefenkarte ist ein Graustufenbild gleicher Größe wie das Foto. Jeder Bildpunkt gibt an, wie weit die Stelle entfernt ist. Viele Werkzeuge zeigen Nahes hell und Fernes dunkel; prüfen Sie im jeweiligen Programm, wie herum die Skala läuft.',
        'Modelle wie MiDaS (Ranftl et al., IEEE TPAMI, online 2020) oder Depth Anything (Yang et al. 2024) schätzen die Tiefe aus einem einzigen Bild. Sie liefern meist <b>relative</b> Tiefe: Die Reihenfolge stimmt oft, echte Abstände in Metern dagegen nicht.'
      ] },
      { h: 'Vom Bild zu Ebenen', list: [
        '<b>1. Tiefe schätzen:</b> Tiefenkarte erzeugen, etwa mit einem Bildwerkzeug oder einem Depth-Modell.',
        '<b>2. Schwellen setzen:</b> Graustufen in zwei oder drei Bereiche teilen. Daraus entstehen Masken für Vorder-, Mittel- und Hintergrund.',
        '<b>3. Freistellen und auffüllen:</b> Jede Ebene ausschneiden. Wo eine vordere Ebene etwas verdeckte, entsteht hinten ein Loch. Das füllt Inpainting (Labor 4).',
        '<b>4. Bewegen:</b> Ebenen beim Scrollen unterschiedlich schnell verschieben: hinten langsam, vorn schnell.'
      ] },
      { h: 'Probieren Sie es aus: Schwellen und Parallax', p: ['Die Landschaft unten ist eine eigene Zeichnung mit passender Tiefenkarte. Setzen Sie die beiden Schwellen: Das Bild wird anhand der Tiefenkarte tatsächlich in drei Ebenen geschnitten. Mit dem Regler „Scrollposition“ verschieben Sie die Ebenen. Wo der Vordergrund wegrückt, erscheint eine Lücke, die in der Praxis per Inpainting gefüllt wird. Bevorzugt Ihr System reduzierte Bewegung, bleiben die Ebenen stehen und die Verschiebung wird als Zahl angezeigt.'], demo: 'tiefe' },
      { h: 'Parallax verantwortungsvoll einsetzen', p: [
        'Starke Bewegung kann Schwindel und Übelkeit auslösen. Respektieren Sie die Einstellung „Bewegung reduzieren“ (CSS-Medienabfrage prefers-reduced-motion), halten Sie die Verschiebung klein, und lassen Sie Text nie über bewegte Ebenen wandern, wenn er dadurch schlechter lesbar wird. Wie Parallax in Scrollytelling-Seiten gestaltet und barrierefrei umgesetzt wird, zeigt das Modul <a href="../scrollytelling/#parallax">Scrollytelling mit Figma, Kapitel Parallax und Bewegung</a>.'
      ] }
    ],
    merke: [
      'Eine Tiefenkarte ordnet jedem Bildpunkt eine geschätzte Entfernung zu.',
      'Depth-Modelle wie MiDaS oder Depth Anything schätzen meist relative Tiefe aus einem einzigen Bild.',
      'Schwellen teilen die Tiefe in Ebenen; verdeckte Bereiche müssen per Inpainting gefüllt werden.',
      'Parallax: hinten langsam, vorn schnell, und immer mit Rücksicht auf reduzierte Bewegung.'
    ]
  },
  {
    id: 'painting', title: 'In- und Outpainting für responsive Formate', period: 'Labor 4 · Korrektur und Erweiterung', icon: 'expand',
    lead: 'Ein Hero-Bild im Querformat passt nicht auf einen Smartphone-Bildschirm im Hochformat. Beschneiden verliert Inhalt, Verzerren ist tabu. Outpainting erweitert das Bild, Inpainting ersetzt einen markierten Bereich.',
    sections: [
      { h: 'Zwei Werkzeuge', table: {
        head: ['Verfahren', 'Was passiert', 'Typischer Einsatz', 'Risiko'],
        rows: [
          ['Inpainting', 'Ein markierter Bereich wird neu erzeugt, der Rest bleibt', 'Störendes entfernen, Fehler wie verformte Hände korrigieren, Lücken hinter freigestellten Ebenen füllen', 'Sichtbare Nahtstellen, Wiederholungen, falsche Details'],
          ['Outpainting', 'Das Bild wird über seinen Rand hinaus erweitert', 'Anderes Seitenverhältnis, Platz für Text gewinnen', 'Erfundener Inhalt am Rand: Perspektive, Licht und Logik prüfen'],
          ['Beschneiden (zum Vergleich)', 'Ein Ausschnitt wird gewählt, nichts Neues entsteht', 'Wenn das Motiv im Ausschnitt vollständig bleibt', 'Motiv oder Kontext geht verloren']
        ] } },
      { h: 'Probieren Sie es aus: ein Bild, drei Formate', p: ['Wählen Sie das Zielformat und vergleichen Sie Beschneiden mit Outpainting. Die gestrichelte Linie zeigt, wo das Originalbild endet und erzeugter Inhalt beginnt. Das erweiterte Bild ist ein echtes Beispiel, erzeugt mit dem Expand-Werkzeug von Magnific.'], demo: 'formate' },
      { h: 'Responsive Bilder im Code', p: [
        'Für unterschiedliche Formate liefert man im Web verschiedene Bildfassungen aus, etwa mit dem HTML-Element <code>picture</code> und Medienabfragen oder mit <code>object-fit</code> und <code>object-position</code> in CSS. Outpainting ergänzt dieses Vorgehen: Es liefert die Fassungen, die durch bloßes Beschneiden nicht entstehen könnten.'
      ] },
      { h: 'Ehrlich bleiben', list: [
        'Dokumentarische Bilder, etwa Pressefotos oder Bilder realer Ereignisse, dürfen nicht durch erfundenen Inhalt erweitert oder verändert werden.',
        'Kennzeichnen Sie KI-erzeugte und KI-bearbeitete Bilder. Die KI-Verordnung der EU verlangt Kennzeichnungen in bestimmten Fällen, und Standards wie C2PA können die Herkunft dokumentieren (siehe <a href="../ux-ki/#recht">UX &amp; KI, Kapitel Recht, Ethik, Rolle</a>).',
        'Prüfen Sie erzeugte Ränder genau: Perspektive, Schatten, Spiegelungen und Schrift sind typische Fehlerquellen.'
      ] }
    ],
    merke: [
      'Inpainting ersetzt einen markierten Bereich, Outpainting erweitert das Bild über den Rand.',
      'Outpainting schafft neue Formate und Copy Space, erfindet aber Inhalt: prüfen und kennzeichnen.',
      'Beschneiden ist die ehrlichere Lösung, wenn das Motiv vollständig bleibt.',
      'Dokumentarische Bilder werden nicht erweitert oder verändert.'
    ]
  }
];

/* Labor 3: Szene mit Tiefe 0 (fern) bis 1 (nah) */
export const szene = [
  { id: 'himmel', name: 'Himmel mit Sonne', tiefe: 0.05 },
  { id: 'berge', name: 'Berge', tiefe: 0.2 },
  { id: 'huegel', name: 'Hügel', tiefe: 0.45 },
  { id: 'haus', name: 'Haus', tiefe: 0.55 },
  { id: 'baum', name: 'Baum im Vordergrund', tiefe: 0.9 },
  { id: 'wiese', name: 'Wiese vorn', tiefe: 0.8 }
];

/* Labor 4: Szenarien [Situation, richtige Wahl, Erklärung]; Optionen: crop, out, in, keine */
export const verfahren = [['crop', 'Beschneiden'], ['out', 'Outpainting'], ['in', 'Inpainting'], ['keine', 'Nicht bearbeiten']];
export const faelle = [
  ['Ein Hero-Bild im Querformat soll auf dem Smartphone im Hochformat erscheinen. Oben fehlt Platz für die Überschrift.', ['out'], 'Outpainting erweitert den Himmel nach oben und schafft Copy Space, ohne das Motiv zu beschneiden.'],
  ['In einem KI-Bild hat eine Person sechs Finger an einer Hand.', ['in'], 'Inpainting erzeugt nur den markierten Bereich neu. Prüfen Sie danach erneut.'],
  ['Ein Pressefoto einer Demonstration ist zu schmal für den Teaser-Platz.', ['crop', 'keine'], 'Dokumentarische Bilder werden nicht um erfundenen Inhalt erweitert. Beschneiden oder ein anderes Layout wählen.'],
  ['Ein Produktfoto im Quadrat soll als 4:5-Bild in einen Feed. Das Produkt füllt nur die Mitte.', ['crop'], 'Das Motiv bleibt im Ausschnitt vollständig. Beschneiden genügt, nichts muss erfunden werden.'],
  ['Für Parallax wurde der Baum im Vordergrund freigestellt. Dahinter klafft ein Loch im Hintergrund.', ['in'], 'Inpainting füllt die verdeckte Fläche, damit beim Verschieben kein Loch sichtbar wird.'],
  ['Ein Porträt einer realen Kollegin soll für die Website einen „freundlicheren“ Gesichtsausdruck bekommen.', ['keine'], 'Das Aussehen realer Personen ohne deren Zustimmung zu verändern, ist ethisch und rechtlich heikel. Lieber ein neues Foto machen.']
];
