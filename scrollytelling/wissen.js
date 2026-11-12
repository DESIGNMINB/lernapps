/* Glossar, Quiz, Plugins, Quellen */

export const terms = [
  ['Scrollytelling', 'Erzählform im Web, bei der die Scrollbewegung steuert, wann Text, Bild, Grafik oder Animation erscheint. Kofferwort aus „Scrolling“ und „Storytelling“.'],
  ['Viewport', 'Der sichtbare Bereich einer Webseite im Browserfenster oder auf dem Bildschirm.'],
  ['Scrollposition', 'Wie weit eine Seite gerade gescrollt ist. Beim Scrollytelling die Zeitachse der Geschichte.'],
  ['Schritt (Step)', 'Ein Abschnitt einer Scrollytelling-Seite mit einem Gedanken: kurzer Text plus eine Veränderung im Bild.'],
  ['Scroll-Storyboard', 'Tabelle, die pro Schritt Text, Bild, Verhalten beim Scrollen und Muster festhält.'],
  ['Overflow', 'In Figma Design die Einstellung, ob und in welche Richtung ein Frame im Prototyp scrollt: No scrolling, Horizontal, Vertical oder Both directions.'],
  ['Fixed', 'Position einer Ebene, die beim Scrollen immer an derselben Stelle bleibt, etwa eine Navigationsleiste.'],
  ['Sticky', 'Position einer Ebene, die zunächst mitscrollt und stehen bleibt, sobald sie den oberen Rand erreicht. Grundlage der Sticky-Grafik.'],
  ['Sticky-Grafik', 'Grafik, die stehen bleibt, während Textschritte daneben oder darüber vorbeiziehen und sie verändern.'],
  ['Reveal', 'Einblende-Effekt, sobald ein Element in den sichtbaren Bereich kommt. In Figma Sites eine fertige Interaktion.'],
  ['Parallax', 'Ebenen bewegen sich beim Scrollen unterschiedlich schnell und erzeugen so räumliche Tiefe.'],
  ['Geschwindigkeitsfaktor', 'Gibt an, wie stark eine Parallax-Ebene dem Scrollen folgt. 1 bedeutet normal mitscrollen, kleinere Werte wirken weiter entfernt.'],
  ['Scroll parallax', 'Interaktion in Figma Sites, mit der Ebenen beim Scrollen unterschiedlich schnell laufen.'],
  ['Scroll transform', 'Interaktion in Figma Sites, die Größe, Position, Deckkraft oder Drehung abhängig vom Scrollen verändert.'],
  ['Mouse parallax', 'Ebenen verschieben sich mit der Mausbewegung. Auf Touchgeräten nicht verfügbar.'],
  ['Scrubbing', 'Animation, deren Fortschritt direkt an der Scrollposition hängt. Zurückscrollen spult sie zurück.'],
  ['Auslöser (Trigger)', 'Ereignis, das eine Interaktion startet, etwa ein Klick, „In view“ oder „Other layer in view“.'],
  ['Scroll-Hijacking', 'Eine Seite übernimmt das Scrollen, bremst es, ändert die Richtung oder springt ungefragt weiter. Gilt als schlechte Praxis.'],
  ['Scroll-Snap', 'Die Seite rastet nach dem Scrollen an festgelegten Punkten ein. Sanft eingesetzt hilfreich, zu streng ärgerlich.'],
  ['Ankerlink', 'Link, der zu einer Stelle derselben Seite springt. In Figma die Aktion „Scroll to“.'],
  ['Smart Animate', 'Figma-Animation, die gleichnamige Ebenen zwischen zwei Frames oder Varianten weich überblendet.'],
  ['Interaktive Komponente', 'Komponente mit Varianten, zwischen denen Interaktionen wie Hover oder Klick wechseln.'],
  ['Variable', 'Gespeicherter Wert in Figma, etwa eine Zahl oder ein Text, den Interaktionen lesen und ändern können.'],
  ['Breakpoint', 'Bildschirmbreite, ab der sich das Layout ändert, etwa von Smartphone zu Tablet.'],
  ['Auto Layout', 'Figma-Funktion, die Elemente in einem Frame automatisch anordnet und mitwachsen lässt.'],
  ['Clip content', 'Einstellung eines Frames, die Inhalte außerhalb seiner Ränder abschneidet. Begrenzt in Sites die Parallax-Bewegung.'],
  ['Easing', 'Verlauf der Geschwindigkeit einer Animation, etwa weich auslaufend (ease-out).'],
  ['prefers-reduced-motion', 'CSS-Abfrage, die erkennt, ob jemand im Betriebssystem „Bewegung reduzieren“ eingeschaltet hat.'],
  ['Intersection Observer', 'Browser-Schnittstelle, die meldet, wann ein Element in den sichtbaren Bereich kommt. Häufig für Textschritte genutzt.'],
  ['Scroll-driven Animations', 'CSS-Technik, mit der Animationen direkt an die Scrollposition gekoppelt werden.'],
  ['Lottie', 'Offenes Format für vektorbasierte Animationen, das im Web, in Apps und in Figma abgespielt werden kann.'],
  ['Figma Sites', 'Figma-Produkt zum Gestalten und Veröffentlichen responsiver Websites.'],
  ['Figma Make', 'KI-Werkzeug in Figma, das aus Prompts und Entwürfen lauffähige Anwendungen mit Code erzeugt.'],
  ['Code-Ebene', 'Ebene in Figma Sites mit eigenem Code für Effekte, die die fertigen Interaktionen nicht abdecken.'],
  ['Dev Mode', 'Ansicht in Figma für die Übergabe an die Entwicklung, mit Maßen, Code-Hinweisen und Anmerkungen.'],
  ['Plugin', 'Erweiterung, die Figma um Funktionen ergänzt und meist nicht von Figma selbst stammt. Wird über die Figma Community installiert.']
];

/* [Frage, Antworten, Index richtig, Erklärung] */
export const quiz = [
  ['Was steuert beim Scrollytelling den Ablauf der Geschichte?', ['Eine feste Abspielzeit wie bei einem Video', 'Die Scrollposition der Lesenden', 'Ein Klick auf „Weiter“ nach jedem Abschnitt'], 1, 'Die Scrollposition ist die Zeitachse. Die Lesenden bestimmen das Tempo.'],
  ['Welches Muster beschreibt eine stehende Grafik, an der Textabschnitte vorbeiziehen?', ['Parallax', 'Sticky-Grafik mit Textschritten', 'Scroll-Snap'], 1, 'Die Grafik ist sticky, die Textschritte verändern sie.'],
  ['Eine Hintergrundebene hat den Parallax-Faktor 0,25. Wie weit bewegt sie sich bei 400 Pixeln Scrollweg?', ['25 Pixel', '100 Pixel', '400 Pixel'], 1, '400 × 0,25 = 100 Pixel. Sie wirkt dadurch weit entfernt.'],
  ['Was brauchen Sie in Figma Design, damit ein Frame im Prototyp scrollt?', ['Overflow „Vertical“ und Inhalt, der über den Frame hinausragt', 'Ein Plugin für Scrollen', 'Die Position „Fixed“ für alle Ebenen'], 0, 'Scrollen setzt Overflow und überstehenden Inhalt voraus.'],
  ['Welche Position bleibt erst stehen, wenn ihr oberer Rand den oberen Rand des Frames erreicht?', ['Fixed', 'Scroll with parent', 'Sticky'], 2, 'Sticky scrollt zuerst mit und bleibt dann stehen.'],
  ['Welcher Weg bietet fertige, wirklich an das Scrollen gekoppelte Effekte ohne Code?', ['Figma Design', 'Figma Sites', 'Keiner der drei'], 1, 'Figma Sites bietet Reveal, Scroll parallax und Scroll transform.'],
  ['Mit welchem Auslöser in Figma Sites steuert ein Textschritt eine andere Grafik?', ['Page load', 'Other layer in view', 'Hover'], 1, '„Other layer in view“ startet die Interaktion, wenn eine andere Ebene ins Bild kommt.'],
  ['Warum hängen Sie in Figma Make besser Frames als Bilder an?', ['Bilder sind dort verboten', 'Make kann aus Frames Ebenen, Texte und Abstände auslesen', 'Frames verbrauchen keine KI-Credits'], 1, 'Frames enthalten Struktur, Bilder nur Pixel.'],
  ['Welche Eigenschaften sollten Sie für flüssige Animationen bevorzugen?', ['Breite und Höhe', 'Abstände und Ränder', 'Verschiebung, Skalierung, Drehung und Deckkraft'], 2, 'transform und opacity muss der Browser nicht neu berechnen.'],
  ['Was ist Scroll-Hijacking?', ['Eine Seite übernimmt Geschwindigkeit oder Richtung des Scrollens', 'Ein Plugin, das Scrollen aufzeichnet', 'Ein Sticky-Element am oberen Rand'], 0, 'Es nimmt den Lesenden die Kontrolle und gilt als schlechte Praxis.'],
  ['Was verlangt WCAG 2.2.2 für ein endlos laufendes Laufband?', ['Nichts, solange es langsam läuft', 'Eine Möglichkeit, es anzuhalten', 'Dass es nur auf Desktop erscheint'], 1, 'Automatische Bewegung über fünf Sekunden muss sich anhalten lassen.'],
  ['Woran erkennt eine Webseite, dass jemand „Bewegung reduzieren“ eingeschaltet hat?', ['An der CSS-Abfrage prefers-reduced-motion', 'An der Bildschirmgröße', 'Gar nicht'], 0, 'prefers-reduced-motion liest die Systemeinstellung aus.'],
  ['Wofür eignet sich ein Prototyp in Figma Design beim Scrollytelling vor allem?', ['Für die fertige, veröffentlichte Seite', 'Um die Idee zu zeigen und mit Menschen zu testen', 'Für Datengrafiken aus echten Daten'], 1, 'Ohne Scroll-Auslöser bleibt es ein Prototyp zum Zeigen und Testen.'],
  ['Welche Angabe gehört nicht in eine vollständige Bewegungsbeschreibung für die Übergabe?', ['Auslöser und Dauer', 'Start- und Endwert', 'Die Lieblingsfarbe des Teams'], 2, 'Element, Auslöser, Eigenschaft, Werte, Dauer und Easing genügen.']
];

/* Plugins: [Name, Kategorie, Kosten, Nutzen, Hinweis] – Kosten: frei | freemium */
export const pluginKategorien = [
  ['planen', 'Planen und Storyboard'],
  ['bilder', 'Bilder, Icons und Ebenen'],
  ['bewegung', 'Bewegung und Animation'],
  ['a11y', 'Barrierefreiheit prüfen'],
  ['code', 'Vom Entwurf zur Webseite']
];
export const plugins = [
  ['Autoflow', 'planen', 'freemium', 'Zeichnet Pfeile zwischen Frames und macht so den Ablauf eines Scroll-Storyboards sichtbar.', 'Grundfunktion kostenlos, größere Diagramme kostenpflichtig.'],
  ['Content Reel', 'planen', 'frei', 'Füllt Entwürfe mit Platzhaltertexten, Namen und Bildern, damit Schritte realistisch wirken.', ''],
  ['Unsplash', 'bilder', 'frei', 'Fügt frei nutzbare Fotos direkt in Frames ein, gut für erste Entwürfe und Stimmungen.', 'Lizenz von Unsplash beachten und Fotografinnen und Fotografen nennen, wo möglich.'],
  ['Iconify', 'bilder', 'frei', 'Sehr große Sammlung freier Icon-Sets als Vektoren, etwa für Kapitelmenüs und Hinweise.', 'Lizenz des jeweiligen Icon-Sets prüfen.'],
  ['Blush', 'bilder', 'freemium', 'Anpassbare Illustrationen, die sich als Ebenen für Parallax verwenden lassen.', 'Einige Sammlungen kostenlos, weitere im Abo.'],
  ['Figmotion', 'bewegung', 'frei', 'Zeitleiste mit Keyframes direkt in Figma. Damit lassen sich Bewegungsideen präzise ausprobieren und unter anderem als Code exportieren.', ''],
  ['LottieFiles', 'bewegung', 'freemium', 'Fügt Lottie-Animationen ein und exportiert eigene Figma-Animationen als Lottie, etwa für Icons, die beim Scrollen starten.', 'Grundfunktionen kostenlos.'],
  ['Stark', 'a11y', 'freemium', 'Prüft Kontraste, simuliert Farbsehschwächen und hilft bei Fokusreihenfolge und Alternativtexten.', 'Kontrastprüfung kostenlos, weitere Prüfungen im Abo.'],
  ['Able', 'a11y', 'frei', 'Schlanker Kontrastprüfer: zwei Ebenen auswählen, Ergebnis nach WCAG sofort sehen.', ''],
  ['Color Blind', 'a11y', 'frei', 'Zeigt einen Frame so, wie Menschen mit verschiedenen Farbsehschwächen ihn wahrnehmen.', ''],
  ['html.to.design', 'code', 'freemium', 'Importiert bestehende Webseiten als bearbeitbare Figma-Ebenen, um Vorbilder zu analysieren.', 'Begrenzte Zahl kostenloser Importe. Nur zur Analyse, fremde Gestaltung nicht übernehmen.'],
  ['Anima', 'code', 'freemium', 'Wandelt Figma-Entwürfe in Code um, mit responsiven Breakpoints und einfachen Interaktionen.', 'Grundfunktionen kostenlos. Entwürfe werden an den Dienst übertragen.'],
  ['Builder.io (Visual Copilot)', 'code', 'freemium', 'Erzeugt aus Frames Code für verschiedene Frameworks als Ausgangspunkt für eine eigene Umsetzung.', 'Kostenloses Kontingent. Entwürfe werden an den Dienst übertragen.']
];

/* Quellen und Links: [Titel, URL, Hinweis] */
export const quellen = [
  ['Figma-Hilfe: Prototype scroll and overflow behavior', 'https://help.figma.com/hc/en-us/articles/360039818734-Prototype-scroll-and-overflow-behavior', 'Overflow, Fixed und Sticky in Figma Design'],
  ['Figma-Hilfe: Add interactions to an element (Figma Sites)', 'https://help.figma.com/hc/en-us/articles/31242843431575-Add-interactions-to-an-element', 'Reveal, Scroll parallax, Scroll transform und weitere Interaktionen'],
  ['Figma-Hilfe: Figma Sites – Add interactions to a website', 'https://help.figma.com/hc/en-us/articles/35895820755095-Figma-Sites-collection-Add-interactions-to-a-website', 'Sammlung von Hilfeartikeln zu Interaktionen in Sites'],
  ['Figma-Hilfe: Create a Figma Make file', 'https://help.figma.com/hc/en-us/articles/31304485164695-Create-a-Figma-Make-file', 'Make starten, Entwürfe anhängen, Pläne'],
  ['Figma-Blog: Introducing Figma Sites', 'https://www.figma.com/blog/introducing-figma-sites/', 'Vorstellung von Sites, 2025'],
  ['Figma-Blog: Introducing Figma Make', 'https://www.figma.com/blog/introducing-figma-make/', 'Vorstellung von Make, 2025'],
  ['Figma for Education', 'https://www.figma.com/education/', 'Kostenloser Bildungsplan für Studierende und Lehrende'],
  ['Figma Community: Plugins', 'https://www.figma.com/community/plugins', 'Alle Plugins mit Beschreibung, Preis und Datenschutzangaben'],
  ['MDN: prefers-reduced-motion', 'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion', 'Technische Grundlage für reduzierte Bewegung'],
  ['MDN: CSS scroll-driven animations', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations', 'Animationen an die Scrollposition koppeln'],
  ['MDN: Intersection Observer API', 'https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API', 'Erkennen, wann ein Element ins Bild kommt'],
  ['W3C: Understanding WCAG 2.3.3 Animation from Interactions', 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html', 'Bewegung durch Interaktion abschaltbar machen'],
  ['W3C: Understanding WCAG 2.2.2 Pause, Stop, Hide', 'https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html', 'Automatische Bewegung anhalten können'],
  ['The Pudding: How to implement scrollytelling', 'https://pudding.cool/process/how-to-implement-scrollytelling/', 'Muster und Techniken aus der Praxis'],
  ['The Pudding', 'https://pudding.cool/', 'Visuelle Essays mit vielen Scrollytelling-Beispielen'],
  ['The New York Times: Snow Fall (2012)', 'https://www.nytimes.com/projects/2012/snow-fall/', 'Meilenstein des multimedialen Scrollytellings']
];
