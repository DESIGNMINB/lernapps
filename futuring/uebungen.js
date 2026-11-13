/* Übungsdaten */

export const kegelZonen = [
  ['projected', 'Projected · fortgeschrieben'],
  ['probable', 'Probable · wahrscheinlich'],
  ['plausible', 'Plausible · plausibel'],
  ['possible', 'Possible · möglich'],
  ['preposterous', 'Preposterous · abwegig']
];
/* [Szenario, Bereich, Erklärung] */
export const kegelFaelle = [
  ['2030: Die nächste Smartphone-Generation hat einen etwas besseren Akku und ein paar neue KI-Funktionen.', 'projected', 'Eine schlichte Fortschreibung dessen, was jedes Jahr passiert.'],
  ['2035: Die meisten Hochschulen nutzen KI-Tutorien, die Übungsaufgaben an den Lernstand anpassen.', 'probable', 'Heutige Pilotprojekte und Investitionen machen diese Entwicklung wahrscheinlich.'],
  ['2038: Die Wohnung meldet der Vermietung automatisch, wenn zu selten gelüftet wird, und die Nebenkosten steigen.', 'plausible', 'Technisch heute machbar und rechtlich denkbar, aber nicht der wahrscheinliche Weg.'],
  ['2040: Wer in der AR-Brille Werbung ansieht, fährt im Nahverkehr gratis.', 'plausible', 'Es passt zu heutigen Geschäftsmodellen der Aufmerksamkeit, ist aber nicht absehbar.'],
  ['2032: Ein Gesetz verbietet Apps, Minderjährigen nach 22 Uhr Push-Mitteilungen zu senden.', 'plausible', 'Mit heutigem Wissen gut vorstellbar, die politische Entscheidung ist offen.'],
  ['2045: Ein Stirnband übersetzt Gedanken zuverlässig in Text, ganz ohne Operation.', 'possible', 'Dafür wären wissenschaftliche Durchbrüche nötig, die heute noch fehlen.'],
  ['2048: Häuser reparieren ihre Risse selbst mit eingebauten lebenden Bakterien.', 'possible', 'Selbstheilender Beton wird erforscht, flächendeckend wäre es ein Durchbruch.'],
  ['2050: Studierende reisen per Teleportation in die Vorlesung.', 'preposterous', 'Nach heutigem Wissen unmöglich. Voros hält solche Ideen trotzdem fest, weil die Grenze des Denkbaren sich verschiebt.']
];

export const signalArten = [['signal', 'Schwaches Signal'], ['trend', 'Trend'], ['megatrend', 'Megatrend'], ['wildcard', 'Wild Card']];
export const steepleOptionen = [['S', 'Social · Gesellschaft'], ['T', 'Technological · Technik'], ['Ec', 'Economic · Wirtschaft'], ['En', 'Environmental · Umwelt'], ['P', 'Political · Politik'], ['L', 'Legal · Recht'], ['Et', 'Ethical · Ethik']];
/* [Beobachtung, Art, [zulässige STEEPLE-Bereiche], Erklärung] */
export const signalFaelle = [
  ['Eine kleine Gruppe Studierender verabredet sich zu handyfreien Abenden und teilt Tipps in einem Forum.', 'signal', ['S'], 'Ein früher, unscharfer Hinweis aus einer kleinen Gruppe: typisch für ein schwaches Signal.'],
  ['Der Anteil älterer Menschen an der Bevölkerung steigt seit Jahrzehnten.', 'megatrend', ['S', 'Ec'], 'Langfristig, global und gut belegt: ein Megatrend.'],
  ['Immer mehr Unternehmen setzen generative KI im Kundenservice ein.', 'trend', ['T', 'Ec'], 'Viele Signale haben sich verdichtet, die Entwicklung ist messbar: ein Trend.'],
  ['Ein Sonnensturm legt weltweit Satelliten und Navigation für Tage lahm.', 'wildcard', ['En', 'T'], 'Unwahrscheinlich, aber mit enormer Wirkung: eine Wild Card.'],
  ['Ein Start-up testet Kopfhörer, die die Konzentration messen und an den Arbeitgeber melden.', 'signal', ['Et', 'T', 'L'], 'Ein einzelnes Produkt in der Erprobung, ethisch und rechtlich heikel: ein schwaches Signal.'],
  ['Die EU verpflichtet große Plattformen, ihre Empfehlungssysteme zu erklären.', 'trend', ['L', 'P'], 'Regulierung digitaler Plattformen nimmt seit Jahren zu: ein Trend.'],
  ['Rechenzentren verbrauchen einen wachsenden Anteil des Stroms.', 'trend', ['En', 'Ec', 'T'], 'Messbar und anhaltend: ein Trend mit Umweltfolgen.'],
  ['Die Durchschnittstemperaturen steigen weltweit.', 'megatrend', ['En'], 'Der Klimawandel prägt Jahrzehnte und betrifft alle Bereiche: ein Megatrend.']
];

/* Manifest */
export const prinzipien = [
  'Ich frage zuerst, ob etwas gebaut werden sollte, und erst dann, wie.',
  'Ich denke in mehreren Zukünften, nicht nur in der wahrscheinlichen.',
  'Ich suche Signale in allen STEEPLE-Bereichen, nicht nur in der Technik.',
  'Ich frage, wessen Zukunft ich entwerfe und wessen Stimmen fehlen.',
  'Ich mache Folgen sichtbar, auch die Folgen von Folgen.',
  'Ich gestalte Wahlmöglichkeiten gleichwertig und ohne Beschämung.',
  'Ich frage Daten nur ab, wenn sie nötig sind, und für jeden Zweck einzeln.',
  'Ich unterbreche Menschen nur, wenn sie es wollen.',
  'Ich nutze Gefühle nicht aus, um zu verkaufen oder zu binden.',
  'Ich kennzeichne Fiktion als Fiktion und KI-Erzeugtes als KI-Erzeugtes.'
];
