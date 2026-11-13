# Lern-Apps · Gestaltung & UX

Startseite und Lern-Apps, veröffentlicht über GitHub Pages.

| Ordner | Quelle | Aktualisieren |
|---|---|---|
| `typografie/` | Übernommen aus `~/Dev/Briefing/typolab 3` (statisches HTML); wird ab jetzt **hier** gepflegt | Direkt in diesem Ordner bearbeiten |
| `ux-grundlagen/` | `~/Dev/Grundlagen UX Modern Design` (Vite) | `npx vite build --base=./ --outDir <hier>/ux-grundlagen --emptyOutDir` |
| `logogestaltung/` | `~/Dev/lernapps/Logogestaltung/logo-lernmodul` (statisch) | Ordner hierher kopieren |
| `farbgestaltung/` | Wird **hier** gepflegt (statisch: `index.html`, `styles.css`, `app.js`, `media/`) | Direkt in diesem Ordner bearbeiten |
| `ux-evaluation/` | Wird **hier** gepflegt (statisch: `index.html`, `styles.css` aus der Farb-App, `ue.css`, `app.js`, `media/`) | Direkt in diesem Ordner bearbeiten |
| `ux-animation/` | Wird **hier** gepflegt (statisch: `index.html`, `styles.css` aus der Evaluations-App, `an.css`, `app.js`, `media/`); PDF-Zusammenfassung mit `python3 ../summaries/build.py anim` | Direkt in diesem Ordner bearbeiten |
| `ux-ki/` | Wird **hier** gepflegt (statisch: `index.html`, `styles.css` aus der Animations-App, `ki.css`, `app.js`, `media/` mit Prompt-Protokoll im Kapitel Literatur); PDF-Zusammenfassung mit `python3 ../summaries/build.py ki` | Direkt in diesem Ordner bearbeiten |
| `layout-raster/` | Wird **hier** gepflegt (statisch: `index.html`, `styles.css` aus der Farb-App, `lr.css`, `app.js`, `media/` mit Magnific-Bildern und -Video); PDF-Zusammenfassung mit `python3 ../summaries/build.py layout` | Direkt in diesem Ordner bearbeiten |
| `scrollytelling/` | Modul 05 (Exkurs), wird **hier** gepflegt (statische ES-Module wie `designgeschichte/`: `kapitel.js`, `uebungen.js`, `wissen.js` mit Plugins, `diagramme.js`, `bilder.js`, `img/`); PDF-Zusammenfassung mit `python3 ../summaries/build.py scrolly` | Direkt in diesem Ordner bearbeiten |
| `futuring/` | Modul 13 (Master, Futuring & Critical Design), wird **hier** gepflegt (statische ES-Module wie `scrollytelling/`: `kapitel.js`, `labor.js` mit Szenario-Bausteinen und Ethik-Reglern, `uebungen.js`, `wissen.js`, `diagramme.js`, `bilder.js`, `img/`); PDF-Zusammenfassung mit `python3 ../summaries/build.py futuring` | Direkt in diesem Ordner bearbeiten |
| `designsysteme/` | Modul 12, statisches HTML und JavaScript-Module; nutzt das bestehende IWI-Basislayout aus `ux-ki/styles.css` | Inhalte in `content.js`, Übungen in `app.js`, Token-/Exportlogik in `model.js`; siehe `designsysteme/README.md` |

## Suche über alle Lern-Apps

`search.js` wird von `theme.js` auf jeder Seite nachgeladen (Knopf „Suchen“ unten rechts, Strg/⌘ + K oder „/“; auf der Startseite als Suchfeld). Der Index `search-index.json` entsteht aus den gerenderten Apps:

```bash
python3 ../summaries/searchindex.py
```

Nach inhaltlichen Änderungen neu erzeugen und in `theme.js` die `LernSearchVersion` erhöhen.
