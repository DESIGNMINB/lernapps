/* Glossar, Quiz, Literatur */

export const terms = [
  ['Affirmatives Design', 'Gestaltung, die die bestehende Welt bestätigt und im Rahmen von Markt, Technik und Gewohnheiten optimiert.'],
  ['Critical Design', 'Gestaltung, die Annahmen, Werte und Folgen von Technik und Konsum hinterfragt. Begriff von Anthony Dunne, „Hertzian Tales“ (1999).'],
  ['Speculative Design', 'Entwürfe für mögliche Zukünfte, die Debatten anstoßen sollen, statt verkauft zu werden. Geprägt von Dunne und Raby.'],
  ['A/B-Liste', 'Gegenüberstellung von affirmativem (A) und kritischem (B) Design in „Speculative Everything“ (Dunne und Raby 2013).'],
  ['Futuring', 'Sammelbegriff für Methoden, mit denen Zukünfte systematisch erkundet und gestaltet werden.'],
  ['Foresight', 'Strategische Zukunftsforschung: systematisches Nachdenken über mögliche Zukünfte, um heute besser zu entscheiden.'],
  ['Futures Cone', 'Zukunftskegel: Modell, das Zukünfte nach projected, probable, plausible, possible, preposterous und preferable ordnet. Nach Hancock und Bezold (1994) und Voros (2003).'],
  ['Projected', 'Die fortgeschriebene Zukunft, wenn alles so weitergeht wie bisher.'],
  ['Probable', 'Wahrscheinliche Zukünfte nach heutigen Trends und Daten.'],
  ['Plausible', 'Zukünfte, die nach heutigem Wissen eintreten könnten. Bevorzugter Bereich spekulativer Entwürfe.'],
  ['Possible', 'Mögliche Zukünfte, für die uns heute noch Wissen fehlt.'],
  ['Preposterous', 'Zukünfte, die wir heute für unmöglich oder lächerlich halten.'],
  ['Preferable', 'Wünschenswerte Zukünfte. Liegen quer zu den anderen Bereichen und sind eine Frage der Werte.'],
  ['Schwaches Signal', 'Früher, unscharfer Hinweis auf eine mögliche Veränderung. Begriff von Igor Ansoff (1975).'],
  ['Trend', 'Entwicklung, die sich aus vielen Signalen verdichtet hat und messbar ist.'],
  ['Megatrend', 'Langfristige, globale Entwicklung über Jahrzehnte, etwa Alterung oder Klimawandel.'],
  ['Wild Card', 'Unwahrscheinliches Ereignis mit großer Wirkung, das Annahmen auf die Probe stellt.'],
  ['STEEPLE', 'Raster für das Umfeld: Social, Technological, Economic, Environmental, Political, Legal, Ethical. Kürzere Varianten heißen PEST oder STEEP.'],
  ['Futures Wheel', 'Methode nach Jerome C. Glenn (1971): Folgen und Folgen von Folgen einer Veränderung in Ringen notieren.'],
  ['Szenario-Achsen', 'Zwei wichtige, unsichere Einflussgrößen spannen vier Szenarien auf. Bekannt durch Shell und Peter Schwartz (1991).'],
  ['Three Horizons', 'Modell mit drei Horizonten: das heute dominante System (H1), der Übergang (H2) und die gewünschte Zukunft (H3).'],
  ['Szenario', 'In sich stimmige Beschreibung einer möglichen Zukunft mit Menschen, Orten und Folgen.'],
  ['Worldbuilding', 'Ausarbeiten einer erfundenen Welt mit Regeln, Alltag und Konflikten, in der ein Entwurf glaubwürdig wird.'],
  ['Design Fiction', 'Bewusster Einsatz diegetischer Prototypen, um eine erfundene Zukunft glaubwürdig zu machen. Begriff von Bruce Sterling, ausgearbeitet von Julian Bleecker (2009).'],
  ['Diegetischer Prototyp', 'Artefakt, das in einer erfundenen Welt selbstverständlich funktioniert. Begriff von David A. Kirby (2010).'],
  ['Dark Pattern', 'Gestaltungstrick, der Menschen zu Entscheidungen gegen ihre Absicht drängt. Begriff von Harry Brignull (2010), heute auch Deceptive Pattern.'],
  ['Confirmshaming', 'Dark Pattern, das Ablehnen mit beschämenden Formulierungen belegt.'],
  ['Nagging', 'Dark Pattern, bei dem ein System wiederholt zu einer Entscheidung drängt.'],
  ['Preselection', 'Dark Pattern, bei dem eine Option vorab ausgewählt ist, etwa die Datenweitergabe.'],
  ['Social Scoring', 'Bewertung von Menschen nach ihrem Verhalten, die über Zugang oder Behandlung entscheidet. In der EU durch den AI Act in vielen Fällen verboten.'],
  ['Digital Services Act', 'EU-Verordnung über digitale Dienste. Art. 25 verbietet manipulative Gestaltung von Online-Plattformen.'],
  ['AI Act', 'EU-Verordnung über künstliche Intelligenz. Art. 5 verbietet unter anderem manipulative KI-Praktiken und Social Scoring.'],
  ['Partizipatives Futuring', 'Ansatz, bei dem Betroffene selbst Zukünfte entwickeln, statt nur Publikum zu sein.']
];

/* [Frage, Antworten, Index richtig, Erklärung] */
export const quiz = [
  ['Was unterscheidet kritisches von affirmativem Design?', ['Kritisches Design ist schöner', 'Kritisches Design stellt Fragen, statt Probleme zu lösen', 'Kritisches Design ist immer pessimistisch'], 1, 'Es will Debatten anstoßen. Pessimistisch muss es nicht sein.'],
  ['Wer prägte den Begriff Critical Design?', ['Anthony Dunne', 'Dieter Rams', 'Don Norman'], 0, 'Anthony Dunne, „Hertzian Tales“ (1999).'],
  ['In welchem Bereich des Futures Cone siedeln Dunne und Raby spekulative Entwürfe bevorzugt an?', ['Probable', 'Plausible', 'Preposterous'], 1, 'Plausibel: fremd genug zum Nachdenken, nah genug zum Ernstnehmen.'],
  ['Warum wird der Futures Cone mit der Zeit breiter?', ['Weil die Unsicherheit wächst, je weiter wir vorausblicken', 'Weil es in Zukunft mehr Technik gibt', 'Weil Prognosen genauer werden'], 0, 'Je weiter weg, desto mehr Zukünfte sind denkbar.'],
  ['Welcher Bereich liegt quer zu den anderen?', ['Projected', 'Possible', 'Preferable'], 2, 'Preferable ist eine Frage der Werte, nicht der Wahrscheinlichkeit.'],
  ['Was ist ein schwaches Signal?', ['Eine langfristige globale Entwicklung', 'Ein früher, unscharfer Hinweis auf eine mögliche Veränderung', 'Ein Funkloch'], 1, 'Begriff von Igor Ansoff (1975).'],
  ['Wofür steht das L in STEEPLE?', ['Local', 'Legal', 'Lifestyle'], 1, 'Legal, also Recht.'],
  ['Was zeigt ein Futures Wheel?', ['Folgen und Folgen von Folgen einer Veränderung', 'Den Ablauf eines Projekts', 'Die Farben eines Szenarios'], 0, 'Erster Ring direkte Folgen, zweiter Ring deren Folgen.'],
  ['Was ist ein diegetischer Prototyp?', ['Ein Prototyp aus Papier', 'Ein Artefakt, das in einer erfundenen Welt selbstverständlich funktioniert', 'Ein Prototyp für Filmkameras'], 1, 'Begriff von David A. Kirby (2010).'],
  ['Was kritisieren Prado de O. Martins und Oliveira (2014)?', ['Zu wenig Technik in spekulativen Projekten', 'Die privilegierte, oft eurozentrische Perspektive vieler Projekte', 'Zu viele Ausstellungen'], 1, 'Sie fragen, wessen Zukünfte entworfen werden.'],
  ['Eine Ablehnen-Schaltfläche heißt „Nein, mir ist meine Gesundheit egal“. Welches Muster ist das?', ['Nagging', 'Confirmshaming', 'Preselection'], 1, 'Ablehnen wird mit Scham belegt.'],
  ['Welche Regel verbietet in der EU vorausgewählte Kästchen als Einwilligung?', ['DSGVO (Art. 7, Erwägungsgrund 32)', 'WCAG 2.2', 'Urheberrecht'], 0, 'Eine Einwilligung braucht eine eindeutige aktive Handlung.'],
  ['Welches Gesetz verbietet Social Scoring durch KI, wenn es zu unverhältnismäßiger Benachteiligung führt?', ['Digital Services Act', 'AI Act', 'Barrierefreiheitsstärkungsgesetz'], 1, 'AI Act Art. 5 Abs. 1 Buchst. c.']
];

/* Literatur: [Autorschaft, Titel, Verlag/Ort, Jahr, Hinweis, URL] */
export const literature = [
  ['Dunne, A.', 'Hertzian Tales: Electronic Products, Aesthetic Experience, and Critical Design', 'RCA CRD Research Publications; Neuauflage MIT Press 2005', '1999', 'Grundlegender Text zum Critical Design', ''],
  ['Dunne, A.; Raby, F.', 'Speculative Everything: Design, Fiction, and Social Dreaming', 'MIT Press', '2013', 'A/B-Liste, Futures Cone im Design, viele Projekte', ''],
  ['Hancock, T.; Bezold, C.', 'Possible futures, preferable futures', 'Healthcare Forum Journal 37(2)', '1994', 'Frühe Unterscheidung möglicher, plausibler, wahrscheinlicher und wünschenswerter Zukünfte', ''],
  ['Voros, J.', 'A generic foresight process framework', 'foresight 5(3)', '2003', 'Futures Cone im Foresight-Prozess', ''],
  ['Voros, J.', 'The Futures Cone, use and history', 'The Voroscope (Blog)', '2017', 'Geschichte und Kategorien des Kegels', 'https://thevoroscope.com/2017/02/24/the-futures-cone-use-and-history/'],
  ['Ansoff, H. I.', 'Managing Strategic Surprise by Response to Weak Signals', 'California Management Review 18(2)', '1975', 'Ursprung des Begriffs schwache Signale', ''],
  ['Glenn, J. C.', 'Futurizing Teaching vs Futures Course', 'Social Science Record 9(3)', '1972', 'Frühe Beschreibung des Futures Wheel', ''],
  ['Schwartz, P.', 'The Art of the Long View', 'Doubleday', '1991', 'Szenarioplanung', ''],
  ['Sharpe, B.', 'Three Horizons: The Patterning of Hope', 'Triarchy Press', '2013', 'Drei Horizonte', ''],
  ['Bleecker, J.', 'Design Fiction: A Short Essay on Design, Science, Fact and Fiction', 'Near Future Laboratory', '2009', 'Grundlagentext zu Design Fiction', ''],
  ['Kirby, D. A.', 'The Future is Now: Diegetic Prototypes and the Role of Popular Films in Generating Real-world Technological Development', 'Social Studies of Science 40(1)', '2010', 'Diegetische Prototypen', ''],
  ['Prado de O. Martins, L.; Oliveira, P.', 'Questioning the „critical“ in Speculative & Critical Design', 'Medium', '2014', 'Kritik an privilegierten Perspektiven', 'https://medium.com/designing-the-future/5a355cac2ca4'],
  ['Brignull, H.', 'Deceptive Patterns: Exposing the Tricks Tech Companies Use to Control You', 'Testimonium', '2023', 'Dark Patterns, Beispiele und Rechtslage', 'https://www.deceptive.design/'],
  ['Europäische Union', 'Verordnung (EU) 2022/2065 über einen Binnenmarkt für digitale Dienste (Digital Services Act)', 'Amtsblatt der EU', '2022', 'Art. 25 und 27', 'https://eur-lex.europa.eu/eli/reg/2022/2065/oj'],
  ['Europäische Union', 'Verordnung (EU) 2024/1689 über künstliche Intelligenz (AI Act)', 'Amtsblatt der EU', '2024', 'Art. 5 verbotene Praktiken', 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj']
];
