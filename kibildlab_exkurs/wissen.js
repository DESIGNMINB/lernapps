/* Glossar, Quiz, Literatur */
export const terms = [
  ['Copy Space', 'Ruhiger, gleichmäßiger Bildbereich, auf dem Text und Bedienelemente lesbar bleiben.'],
  ['Negativer Raum', 'Leerer Raum um ein Motiv. Teil der Komposition, nicht bloßer Rest.'],
  ['12-Spalten-Raster', 'Verbreitetes Layoutraster im Webdesign; lässt sich in 2, 3, 4 und 6 Spalten teilen.'],
  ['Kontrastverhältnis', 'Verhältnis der relativen Leuchtdichte zweier Farben nach WCAG. Für normalen Text mindestens 4,5 : 1, für großen Text 3 : 1.'],
  ['ControlNet', 'Verfahren von Zhang, Rao und Agrawala (2023), das ein vortrainiertes Bildmodell um eine räumliche Bedingung wie Kanten, Tiefe oder Pose ergänzt.'],
  ['Zero Convolution', 'Mit null initialisierte Faltungsschicht in ControlNet, die das vorhandene Modell zu Trainingsbeginn nicht stört.'],
  ['Bedingung (Conditioning)', 'Zusätzliche Eingabe, die eine Bildgenerierung steuert, etwa Text, Kantenbild oder Tiefenkarte.'],
  ['Canny-Kanten', 'Kantenbild nach dem Verfahren von John Canny (1986), häufig als Steuerkarte genutzt.'],
  ['Scribble', 'Grobe, freie Skizze als Steuerkarte.'],
  ['Steuerstärke', 'Regler, wie eng ein Bild der Steuerkarte folgt; je nach Werkzeug control weight, strength oder conditioning scale.'],
  ['Tiefenkarte', 'Graustufenbild, das für jeden Bildpunkt eine geschätzte Entfernung angibt.'],
  ['Relative Tiefe', 'Tiefe als Reihenfolge von nah nach fern, ohne verlässliche Abstände in Metern.'],
  ['MiDaS', 'Depth-Modell von Ranftl et al. (IEEE TPAMI, online 2020) zur Schätzung relativer Tiefe aus einem Bild.'],
  ['Depth Anything', 'Depth-Modell von Yang et al. (2024), trainiert mit großen Mengen unbeschrifteter Bilder.'],
  ['Parallax', 'Ebenen bewegen sich beim Scrollen unterschiedlich schnell; hinten langsam, vorn schnell.'],
  ['prefers-reduced-motion', 'CSS-Medienabfrage, mit der eine Website die Systemeinstellung „Bewegung reduzieren“ berücksichtigt.'],
  ['Inpainting', 'Ein markierter Bildbereich wird neu erzeugt, der Rest bleibt erhalten.'],
  ['Outpainting', 'Ein Bild wird über seinen Rand hinaus erweitert, etwa für ein anderes Seitenverhältnis.'],
  ['Maske', 'Schwarz-weißes Bild, das festlegt, welcher Bereich bearbeitet wird.'],
  ['C2PA', 'Offener Standard, der Herkunft und Bearbeitung von Medien in Metadaten dokumentiert.']
];

/* [Frage, Antworten, Index richtig, Erklärung] */
export const quiz = [
  ['Was ist Copy Space?', ['Ein Speicherplatz für Bilder', 'Ein ruhiger Bildbereich für Text und Bedienelemente', 'Eine Kopie des Bildes'], 1, 'Copy Space hält Text auf Bildern lesbar.'],
  ['Welches Kontrastverhältnis braucht normaler Text auf einem Bild mindestens?', ['3 : 1', '4,5 : 1', '7 : 1 immer'], 1, 'WCAG 2.2, Erfolgskriterium 1.4.3. Für großen Text genügen 3 : 1.'],
  ['Was ergänzt ControlNet an einem Bildmodell?', ['Eine räumliche Bedingung wie Kanten oder Tiefe', 'Eine höhere Auflösung', 'Einen Wasserzeichen-Filter'], 0, 'Zhang, Rao und Agrawala 2023.'],
  ['Was passiert typischerweise bei sehr niedriger Steuerstärke?', ['Das Bild folgt der Vorlage exakt', 'Das Bild weicht deutlich von der Vorlage ab', 'Es entsteht kein Bild'], 1, 'Je niedriger, desto freier. Gute Werte findet man durch Testreihen.'],
  ['Was liefern Depth-Modelle wie MiDaS meist?', ['Exakte Abstände in Metern', 'Relative Tiefe: die Reihenfolge von nah nach fern', 'Farbkorrekturen'], 1, 'Die Reihenfolge stimmt oft, echte Abstände nicht.'],
  ['Wie bewegen sich Parallax-Ebenen beim Scrollen?', ['Hinten schnell, vorn langsam', 'Hinten langsam, vorn schnell', 'Alle gleich schnell'], 1, 'Wie beim Blick aus dem Zugfenster.'],
  ['Ein Pressefoto ist zu schmal für das Layout. Was ist angemessen?', ['Outpainting', 'Beschneiden oder anderes Layout', 'Inpainting'], 1, 'Dokumentarische Bilder werden nicht um erfundenen Inhalt erweitert.'],
  ['Nach dem Freistellen einer Vordergrundebene klafft dahinter ein Loch. Was hilft?', ['Inpainting', 'Outpainting', 'Höherer Kontrast'], 0, 'Inpainting füllt den verdeckten Bereich.']
];

/* Literatur: [Autorschaft, Titel, Ort, Jahr, Hinweis, URL] */
export const literature = [
  ['Zhang, L.; Rao, A.; Agrawala, M.', 'Adding Conditional Control to Text-to-Image Diffusion Models', 'Proceedings of the IEEE/CVF International Conference on Computer Vision (ICCV), S. 3836–3847', '2023', 'ControlNet', 'https://openaccess.thecvf.com/content/ICCV2023/html/Zhang_Adding_Conditional_Control_to_Text-to-Image_Diffusion_Models_ICCV_2023_paper.html'],
  ['Canny, J.', 'A Computational Approach to Edge Detection', 'IEEE Transactions on Pattern Analysis and Machine Intelligence 8(6)', '1986', 'Canny-Kanten', ''],
  ['Ranftl, R.; Lasinger, K.; Hafner, D.; Schindler, K.; Koltun, V.', 'Towards Robust Monocular Depth Estimation: Mixing Datasets for Zero-shot Cross-dataset Transfer', 'IEEE TPAMI 44(3), online 2020', '2022', 'MiDaS', ''],
  ['Yang, L.; Kang, B.; Huang, Z.; Xu, X.; Feng, J.; Zhao, H.', 'Depth Anything: Unleashing the Power of Large-Scale Unlabeled Data', 'arXiv:2401.10891', '2024', 'Depth Anything', 'https://arxiv.org/abs/2401.10891'],
  ['Hugging Face', 'Diffusers: ControlNet', 'Dokumentation, online', 'abgerufen November 2026', 'Parameter controlnet_conditioning_scale', 'https://huggingface.co/docs/diffusers/using-diffusers/controlnet'],
  ['W3C', 'Web Content Accessibility Guidelines (WCAG) 2.2', 'W3C Recommendation', '2023', 'Kontrast 1.4.3, Bewegung 2.3.3', 'https://www.w3.org/TR/WCAG22/'],
  ['MDN Web Docs', 'prefers-reduced-motion', 'Mozilla, online', 'abgerufen November 2026', 'Bewegung reduzieren', 'https://developer.mozilla.org/de/docs/Web/CSS/@media/prefers-reduced-motion']
];
