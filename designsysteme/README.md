# Modul 11 · Designsysteme & Styleguides

Statische Lerneinheit für GitHub Pages. Keine Installation und kein Build nötig. Die Dateien werden im Repository gepflegt. 

## Lokal ansehen

Im Repository-Stamm `python3 -m http.server 8765` starten, dann `http://localhost:8765/designsysteme/` öffnen. Wegen der JavaScript-Module über HTTP öffnen, nicht über `file://`.

## Inhalt und Gestaltung

- Elf Kapitel mit interaktiven Demonstrationen, sechs Übungen, 15 Quizfragen und 31 Glossarbegriffe.
- Das Basisstylesheet `../ux-ki/styles.css` wird unverändert eingebunden. IBM Plex Sans, Navigation, Hero, Karten, Buttons, Abstände und Theme kommen aus dem vorhandenen IWI-Layout. `styles.css` ergänzt die neuen Labore.
- `content.js`: Kapitel, Aufgabenmetadaten, Quiz, Glossar und Quellen.
- `app.js`: Hash-Navigation, Übungen, Entwurf, Fortschritt, Quiz und Downloads.
- `model.js`: Validierung, WCAG-sRGB-Kontrast, DTCG-Tokens und CSS-/Styleguide-Export.
- `media/`: lokales Titelbild und elf fotorealistische, KI-generierte Kachelmotive in `media/fotos/`; Zuordnung in `photos.js`. Interaktive Fachgrafiken bleiben erhalten. Herkunft und Prompts in `media/bildnachweis.md`.
- `downloads/`: vierseitige PDF-Zusammenfassung.

## Entwurf und Export

Der gemeinsame Entwurf verwendet den Local-Storage-Schlüssel `designsysteme:v1`. Er beeinflusst nur die Beispiel-App, nicht die Oberfläche des Lernmoduls. Der globale Theme-Schalter bleibt separat. Im Builder können vollständige Projektdateien gesichert und wieder importiert werden; Imports werden auf unterstützte Felder und Werte begrenzt.

Die DTCG-Ausgabe liefert je einen vollständigen Token-Satz für Light und Dark im Format 2025.10. Referenzen bleiben erhalten. Der CSS-Export definiert beide Themes sowie Button-, Card-, Input- und Grid-Klassen. Schriftdateien sind im Zielprojekt separat einzubinden. Das HTML-Dokument lässt sich über den Browser drucken bzw. als PDF speichern.

Die Kontrastprüfung bewertet ausgewählte deckende sRGB-Farbpaare, nicht die vollständige WCAG-Konformität. Die Komponenten sind ein didaktisches Modell, keine vollständige Produktionsbibliothek.

## Suche

`node designsysteme/update-search.mjs` aktualisiert nur die Einträge dieses Moduls im bestehenden `search-index.json`. Die Indexversion wird dabei gesetzt; bei späteren Änderungen auch `LernSearchVersion` in `theme.js` erhöhen. Andere Moduleinträge bleiben erhalten.

## Prüfung

`node --test designsysteme/model.test.mjs` prüft Kontraste, Tokenreferenzen, Importgrenzen und Exporte. Die Browserprüfung umfasst Navigation, mobile Bedienung, Light/Dark, Übungen, vollständigen Quizdurchlauf, Downloads und Speicherverhalten.
