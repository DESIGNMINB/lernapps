/* Glossar, Quiz, Literatur */

export const terms = [
  ['Emotion', 'Kurze, auf einen Anlass bezogene gefühlsmäßige Reaktion, etwa Ärger über eine abgelehnte Zahlung.'],
  ['Stimmung', 'Länger anhaltender gefühlsmäßiger Zustand, oft ohne klaren Auslöser.'],
  ['Affekt', 'Oberbegriff für alle gefühlsmäßigen Zustände.'],
  ['Grundemotionen', 'Wenige, nach Ekman kulturübergreifend erkennbare Emotionen: Freude, Traurigkeit, Ärger, Angst, Überraschung, Ekel, später ergänzt um Verachtung.'],
  ['Kategoriales Modell', 'Modell, das Gefühle in abgegrenzte Klassen einteilt, etwa die Grundemotionen nach Ekman.'],
  ['Dimensionales Modell', 'Modell, das Gefühle in einem Raum aus Dimensionen verortet, etwa Valenz und Arousal.'],
  ['Circumplex-Modell', 'Dimensionales Modell nach James A. Russell (1980): Gefühle liegen kreisförmig in einem Raum aus Valenz und Arousal.'],
  ['Valenz', 'Wie angenehm oder unangenehm sich etwas anfühlt. Waagerechte Achse im Circumplex-Modell.'],
  ['Arousal', 'Grad der Aktivierung oder Erregung, von ruhig bis aufgewühlt. Senkrechte Achse im Circumplex-Modell.'],
  ['Emotional Design', 'Gestaltung, die Gefühle beim Benutzen bewusst berücksichtigt. Bekannt durch Don Normans gleichnamiges Buch (2004).'],
  ['Viszerale Ebene', 'Ebene nach Norman: erster, unbewusster Eindruck durch Form, Farbe und Klang.'],
  ['Verhaltensbezogene Ebene', 'Ebene nach Norman: Erleben beim Benutzen, also Funktion, Verständlichkeit und Kontrolle.'],
  ['Reflexive Ebene', 'Ebene nach Norman: bewusstes Nachdenken über Bedeutung, Selbstbild und Erinnerung.'],
  ['Ästhetik-Usability-Effekt', 'Schön gestaltete Oberflächen werden als besser bedienbar wahrgenommen (Kurosu und Kashimura 1995).'],
  ['Joy of Use', 'Freude an der Nutzung, die über reine Bedienbarkeit hinausgeht.'],
  ['Pragmatische Qualität', 'Nach Hassenzahl: wie gut ein Produkt hilft, Ziele effizient und verständlich zu erreichen.'],
  ['Hedonische Qualität', 'Nach Hassenzahl: wie sehr ein Produkt anregt und wie gut man sich damit identifizieren kann.'],
  ['UEQ', 'User Experience Questionnaire (Laugwitz, Held und Schrepp 2008) mit pragmatischen und hedonischen Skalen.'],
  ['Microinteraction', 'Kleiner, abgeschlossener Moment eines Produkts mit genau einer Aufgabe. Nach Saffer (2013) aus Auslöser, Regeln, Feedback sowie Schleifen und Modi.'],
  ['Visuelle Semantik', 'Bedeutung, die Form, Farbe und Bewegung tragen, bevor ein Wort gelesen wird.'],
  ['Tone of Voice', 'Wie ein Produkt spricht. Nach NN/g mit den Dimensionen Humor, Förmlichkeit, Respekt und Begeisterung.'],
  ['Affective Computing', 'Forschungsfeld nach Rosalind Picard (1997): Computer, die Gefühle erkennen, ausdrücken oder berücksichtigen.'],
  ['FACS', 'Facial Action Coding System von Ekman und Friesen (1978, überarbeitet 2002) zur Beschreibung von Gesichtsbewegungen.'],
  ['Action Unit', 'Einzelne, im FACS beschriebene Muskelbewegung im Gesicht, etwa AU 12 (Mundwinkel heben).'],
  ['Sentiment-Analyse', 'Automatische Einordnung von Texten nach Polarität (positiv, neutral, negativ), teils nach einzelnen Emotionen.'],
  ['EDA', 'Elektrodermale Aktivität, früher galvanische Hautreaktion (GSR): Leitfähigkeit der Haut als Hinweis auf Aktivierung.'],
  ['HRV', 'Herzratenvariabilität: Schwankung der Abstände zwischen Herzschlägen. Geringe HRV kann auf Stress hindeuten.'],
  ['Multimodale Fusion', 'Zusammenführen mehrerer Kanäle wie Gesicht, Text und Puls, früh auf Ebene der Merkmale oder spät auf Ebene der Schätzungen.'],
  ['Emotionserkennungssystem', 'Nach AI Act Art. 3 Nr. 39: KI-System, das Emotionen oder Absichten auf Grundlage biometrischer Daten erkennt oder ableitet.'],
  ['Dark Pattern', 'Gestaltungstrick, der Menschen zu Entscheidungen gegen ihre Absicht drängt. Begriff von Harry Brignull (2010), heute auch Deceptive Pattern.'],
  ['Confirmshaming', 'Dark Pattern, das Ablehnen mit beschämenden Formulierungen belegt.'],
  ['Künstliche Dringlichkeit', 'Dark Pattern, das mit erfundenem Zeitdruck oder erfundener Knappheit Angst erzeugt, etwas zu verpassen.'],
  ['Algorithmischer Bias', 'Systematisch ungleiche Fehler eines Systems für verschiedene Gruppen, oft durch unausgewogene Trainingsdaten.'],
  ['Gender Shades', 'Studie von Buolamwini und Gebru (2018) zu ungleichen Fehlerquoten kommerzieller Gesichtsanalyse nach Geschlecht und Hautfarbe.'],
  ['AI Act', 'EU-Verordnung über künstliche Intelligenz (2024/1689). Art. 5 Abs. 1 Buchst. f verbietet Emotionserkennung am Arbeitsplatz und in Bildungseinrichtungen.'],
  ['Digital Services Act', 'EU-Verordnung über digitale Dienste (2022/2065). Art. 25 verbietet manipulative Gestaltung von Online-Plattformen.']
];

/* [Frage, Antworten, Index richtig, Erklärung] */
export const quiz = [
  ['Welche zwei Dimensionen spannen das Circumplex-Modell nach Russell auf?', ['Freude und Trauer', 'Valenz und Arousal', 'Aufmerksamkeit und Gedächtnis'], 1, 'Valenz (angenehm bis unangenehm) und Arousal (ruhig bis aktiviert).'],
  ['Wo liegt „Zufriedenheit“ im Circumplex?', ['Angenehm und ruhig', 'Angenehm und aktiviert', 'Unangenehm und ruhig'], 0, 'Unten rechts. Begeisterung liegt oben rechts.'],
  ['Was zeigten Barrett et al. (2019)?', ['Gesichtsausdrücke sind weltweit eindeutig', 'Gesichtsbewegungen sind kein zuverlässiger Hinweis auf Gefühle', 'Emotionen lassen sich nur mit EEG messen'], 1, 'Dieselbe Mimik kann je nach Situation, Person und Kultur Verschiedenes bedeuten.'],
  ['Welche Ebene nach Norman betrifft den ersten Eindruck?', ['Viszeral', 'Verhaltensbezogen', 'Reflexiv'], 0, 'Die viszerale Ebene ist schnell und unbewusst: Form, Farbe, Klang.'],
  ['Eine App zeigt Ihre Lernserie und einen Meilenstein, den Sie teilen können. Welche Ebene spricht das vor allem an?', ['Viszeral', 'Verhaltensbezogen', 'Reflexiv'], 2, 'Selbstbild und Bedeutung gehören zur reflexiven Ebene.'],
  ['Was beschreibt hedonische Qualität nach Hassenzahl?', ['Wie effizient Ziele erreicht werden', 'Wie sehr ein Produkt anregt und Identifikation stiftet', 'Wie schnell eine Seite lädt'], 1, 'Pragmatisch ist das Zielerreichen, hedonisch Anregung und Identifikation.'],
  ['Welche vier Teile hat eine Microinteraction nach Saffer?', ['Auslöser, Regeln, Feedback, Schleifen und Modi', 'Farbe, Form, Bewegung, Ton', 'Analyse, Entwurf, Test, Launch'], 0, 'Saffer, „Microinteractions“ (2013).'],
  ['Welche Fehlermeldung ist am besten?', ['„Falsche Eingabe!“', '„Fehler 422“', '„Die Postleitzahl hat fünf Ziffern, zum Beispiel 76133.“'], 2, 'Sie sagt, wie es richtig geht, ohne Tadel.'],
  ['Was misst die elektrodermale Aktivität (EDA)?', ['Ob ein Gefühl angenehm ist', 'Die Aktivierung über die Leitfähigkeit der Haut', 'Die Muskelbewegung im Gesicht'], 1, 'EDA zeigt Aktivierung, aber nicht die Valenz.'],
  ['Warum kombinieren Systeme mehrere Sensoren?', ['Weil jeder Kanal allein mehrdeutig ist', 'Weil es gesetzlich vorgeschrieben ist', 'Weil ein Sensor allein keine Daten liefert'], 0, 'Fusion kann Schätzungen stabilisieren, erhebt aber auch mehr Daten.'],
  ['Was fanden Buolamwini und Gebru in „Gender Shades“ (2018)?', ['Alle Systeme waren gleich genau', 'Fehlerquoten bis 34,7 % bei Frauen mit dunkler Haut, höchstens 0,8 % bei Männern mit heller Haut', 'Gesichtsanalyse funktioniert nur bei Tageslicht'], 1, 'Die Fehler waren sehr ungleich verteilt.'],
  ['Eine Hochschule will in Online-Prüfungen per Kamera „Nervosität“ erkennen. Was gilt nach dem AI Act?', ['Erlaubt, wenn die Studierenden zustimmen', 'Verboten nach Art. 5 Abs. 1 Buchst. f', 'Nur in Deutschland verboten'], 1, 'Emotionserkennung in Bildungseinrichtungen ist seit 2. Februar 2025 verboten, außer aus medizinischen oder Sicherheitsgründen.'],
  ['Fällt reine Sentiment-Analyse von Texten unter „Emotionserkennungssystem“ im Sinne des AI Act?', ['Ja, immer', 'In der Regel nein, weil keine biometrischen Daten verarbeitet werden', 'Nur bei englischen Texten'], 1, 'Art. 3 Nr. 39 knüpft an biometrische Daten an. Andere Regeln wie DSGVO und DSA gelten trotzdem.'],
  ['„Nein danke, ich zahle lieber mehr.“ Welches Muster ist das?', ['Confirmshaming', 'Microinteraction', 'Progressive Disclosure'], 0, 'Ablehnen wird mit Scham belegt.']
];

/* Literatur: [Autorschaft, Titel, Verlag/Ort, Jahr, Hinweis, URL] */
export const literature = [
  ['Ekman, P.; Friesen, W. V.', 'Constants across cultures in the face and emotion', 'Journal of Personality and Social Psychology 17(2)', '1971', 'Kulturvergleichende Studie zu Gesichtsausdrücken', ''],
  ['Ekman, P.', 'An argument for basic emotions', 'Cognition and Emotion 6(3–4)', '1992', 'Grundemotionen', ''],
  ['Ekman, P.; Friesen, W. V.', 'Facial Action Coding System', 'Consulting Psychologists Press; überarbeitet mit Hager 2002', '1978', 'FACS und Action Units', ''],
  ['Russell, J. A.', 'A circumplex model of affect', 'Journal of Personality and Social Psychology 39(6)', '1980', 'Valenz und Arousal', ''],
  ['Barrett, L. F.; Adolphs, R.; Marsella, S.; Martinez, A. M.; Pollak, S. D.', 'Emotional Expressions Reconsidered: Challenges to Inferring Emotion From Human Facial Movements', 'Psychological Science in the Public Interest 20(1), doi:10.1177/1529100619832930', '2019', 'Kritik an der Ableitung von Gefühlen aus Mimik', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6640856/'],
  ['Norman, D. A.', 'Emotional Design: Why We Love (or Hate) Everyday Things', 'Basic Books', '2004', 'Viszeral, verhaltensbezogen, reflexiv', ''],
  ['Kurosu, M.; Kashimura, K.', 'Apparent usability vs. inherent usability', 'CHI ’95 Conference Companion, ACM', '1995', 'Ästhetik-Usability-Effekt', ''],
  ['Hassenzahl, M.; Burmester, M.; Koller, F.', 'AttrakDiff: Ein Fragebogen zur Messung wahrgenommener hedonischer und pragmatischer Qualität', 'Mensch & Computer 2003, Teubner', '2003', 'Pragmatische und hedonische Qualität', ''],
  ['Laugwitz, B.; Held, T.; Schrepp, M.', 'Construction and Evaluation of a User Experience Questionnaire', 'USAB 2008, Springer', '2008', 'UEQ', ''],
  ['Saffer, D.', 'Microinteractions: Designing with Details', 'O’Reilly', '2013', 'Auslöser, Regeln, Feedback, Schleifen und Modi', ''],
  ['Moran, K.', 'The Four Dimensions of Tone of Voice', 'Nielsen Norman Group, online', 'abgerufen November 2026', 'Humor, Förmlichkeit, Respekt, Begeisterung', 'https://www.nngroup.com/articles/tone-of-voice-dimensions/'],
  ['Picard, R. W.', 'Affective Computing', 'MIT Press', '1997', 'Grundlagenwerk des Forschungsfelds', ''],
  ['Buolamwini, J.; Gebru, T.', 'Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification', 'Proceedings of Machine Learning Research 81', '2018', 'Bias in Gesichtsanalyse', 'https://proceedings.mlr.press/v81/buolamwini18a.html'],
  ['Brignull, H.', 'Deceptive Patterns: Exposing the Tricks Tech Companies Use to Control You', 'Testimonium', '2023', 'Dark Patterns, Confirmshaming', 'https://www.deceptive.design/'],
  ['Europäische Union', 'Verordnung (EU) 2024/1689 über künstliche Intelligenz (AI Act)', 'Amtsblatt der EU', '2024', 'Art. 3 Nr. 39, Art. 5 Abs. 1 Buchst. f, Art. 50 Abs. 3, Erwägungsgrund 44', 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj'],
  ['Europäische Union', 'Verordnung (EU) 2022/2065 über einen Binnenmarkt für digitale Dienste (Digital Services Act)', 'Amtsblatt der EU', '2022', 'Art. 25', 'https://eur-lex.europa.eu/eli/reg/2022/2065/oj']
];
