/* Beispielbilder: KI-generiert mit Magnific (November 2026), ohne reale Vorlage. Schemazeichnungen und Szene in Labor 3: eigene Darstellung */
export const bilder = {
  skizze: { file: 'skizze.webp', w: 1000, h: 746,
    caption: 'Von der Skizze zum Bild: links ein Bleistiftentwurf, rechts ein Rendering mit derselben Anordnung',
    alt: 'Holztisch von oben: links eine Bleistiftskizze mit Haus, Baum und Horizontlinie auf Papier, rechts ein Tablet mit einem fotografischen Bild, das Haus und Baum in genau derselben Anordnung zeigt; ringsum Stifte, Radiergummi und Lineale' },
  fluss: { file: 'fluss.webp', w: 1600, h: 893,
    caption: 'Viel Copy Space: Das Motiv steht klein im rechten Drittel, links bleibt ruhiger Himmel und Wasser',
    alt: 'Flusspromenade im Morgenlicht im Querformat: rechts fährt eine Radfahrerin oder ein Radfahrer klein auf dem Uferweg mit Geländer, Laternen und Bäumen; die linke Hälfte zeigt ruhigen, rosa-orangen Himmel und spiegelglattes Wasser' },
  fluss916: { file: 'fluss916.webp', w: 720, h: 1279,
    caption: 'Dasselbe Bild per Outpainting auf 9:16 erweitert: Himmel oben und Wasser unten sind erzeugt',
    alt: 'Hochformatige Fassung der Flusspromenade: Das ursprüngliche Bild liegt als Band in der Mitte, darüber viel zusätzlicher Himmel mit Wolke und einem Zweig am oberen Rand, darunter zusätzliches Wasser und Uferweg' }
};
/* Lage des Originals im erweiterten Bild (gemessen): oberer Rand und Höhe als Anteil */
export const outpaint = { top: 0.454, height: 0.311 };
/* Motiv im Querformat (Radfahrerin oder Radfahrer), Anteile der Bildbreite und -höhe */
export const motiv = { x: 0.77, y: 0.57, w: 0.08, h: 0.22 };
