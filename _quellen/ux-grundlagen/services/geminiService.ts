import { QuizQuestion } from '../types';

/* Fragen des Prüfungstrainers. Früher wurden Fragen zusätzlich von einem KI-Server erzeugt;
   dieser Dienst existiert nicht mehr. Die Fragen sind deshalb fest hinterlegt und geprüft.
   Begriffe wie in den Kapiteln der App (Heuristiken nach Nielsen, Gestaltgesetze, WCAG 2.2). */
const QUESTIONS: Record<string, QuizQuestion[]> = {
  'Usability Heuristiken': [
    {
      question: 'Eine Person möchte einen Kaufvorgang abbrechen, findet aber keinen „Abbrechen“-Button. Gegen welche Heuristik wird verstoßen?',
      options: ['Konsistenz und Standards', 'Nutzerkontrolle und Freiheit', 'Erkennen statt Erinnern', 'Flexibilität und Effizienz der Nutzung'],
      correctIndex: 1,
      explanation: 'Nutzende brauchen einen klar erkennbaren „Notausgang“, um einen ungewollten Zustand ohne Umwege zu verlassen.',
    },
    {
      question: 'Das Symbol für „Speichern“ sieht in der App anders aus als auf der Website desselben Anbieters. Welche Heuristik ist verletzt?',
      options: ['Ästhetisches und minimalistisches Design', 'Fehlervermeidung', 'Konsistenz und Standards', 'Sichtbarkeit des Systemstatus'],
      correctIndex: 2,
      explanation: 'Nutzende sollten sich nicht fragen müssen, ob unterschiedliche Wörter, Symbole oder Aktionen dasselbe bedeuten.',
    },
    {
      question: 'Eine App zeigt beim Laden von Daten nur einen leeren Bildschirm statt einer Ladeanzeige. Welche Heuristik ist verletzt?',
      options: ['Sichtbarkeit des Systemstatus', 'Hilfe und Dokumentation', 'Hilfe beim Erkennen, Diagnostizieren und Beheben von Fehlern', 'Übereinstimmung zwischen System und Wirklichkeit'],
      correctIndex: 0,
      explanation: 'Das System sollte stets in angemessener Zeit zeigen, was gerade passiert, etwa mit einem Ladebalken.',
    },
    {
      question: 'Ein Formular lässt sich erst abschicken, wenn alle Pflichtfelder gültig ausgefüllt sind, und markiert fehlende Angaben schon beim Ausfüllen. Welche Heuristik wird damit umgesetzt?',
      options: ['Fehlervermeidung', 'Hilfe und Dokumentation', 'Ästhetisches und minimalistisches Design', 'Erkennen statt Erinnern'],
      correctIndex: 0,
      explanation: 'Gutes Design verhindert Fehler, bevor sie entstehen. Das ist besser als jede gute Fehlermeldung.',
    },
    {
      question: 'Erfahrene Nutzende müssen für eine häufige Aktion jedes Mal drei Menüebenen öffnen. Tastenkürzel gibt es nicht. Welche Heuristik ist betroffen?',
      options: ['Flexibilität und Effizienz der Nutzung', 'Sichtbarkeit des Systemstatus', 'Konsistenz und Standards', 'Hilfe und Dokumentation'],
      correctIndex: 0,
      explanation: 'Beschleuniger wie Tastenkürzel oder Favoriten machen die Arbeit für Geübte schneller, ohne Neulinge zu stören.',
    },
    {
      question: 'Eine Fehlermeldung lautet nur „Fehler 0x80070005“. Welche Heuristik ist verletzt?',
      options: ['Hilfe beim Erkennen, Diagnostizieren und Beheben von Fehlern', 'Fehlervermeidung', 'Nutzerkontrolle und Freiheit', 'Konsistenz und Standards'],
      correctIndex: 0,
      explanation: 'Fehlermeldungen sollten in verständlicher Sprache das Problem benennen und einen Lösungsweg vorschlagen.',
    },
  ],
  'Gestaltgesetze': [
    {
      question: 'Zwei Linien kreuzen sich. Warum folgt das Auge jeder Linie über den Kreuzungspunkt hinweg in ihrer ursprünglichen Richtung?',
      options: ['Gesetz der Nähe', 'Gesetz der Geschlossenheit', 'Gesetz der Kontinuität', 'Gesetz der Ähnlichkeit'],
      correctIndex: 2,
      explanation: 'Nach dem Gesetz der Kontinuität (guten Fortsetzung) werden Linien und Kurven in ihrer Richtung weitergelesen.',
    },
    {
      question: 'Drei Buttons stehen dicht beieinander, ein vierter steht deutlich abseits. Warum wirken die drei als Gruppe?',
      options: ['Gesetz der Nähe', 'Gesetz der Erfahrung', 'Gesetz der Prägnanz', 'Figur-Grund-Beziehung'],
      correctIndex: 0,
      explanation: 'Elemente, die nah beieinanderliegen, werden als zusammengehörig wahrgenommen.',
    },
    {
      question: 'Das IBM-Logo besteht aus Streifen, trotzdem lesen wir vollständige Buchstaben. Welches Gesetz wirkt hier?',
      options: ['Gesetz der Geschlossenheit', 'Gesetz der Nähe', 'Gesetz der Ähnlichkeit', 'Gesetz der Erfahrung'],
      correctIndex: 0,
      explanation: 'Das Gehirn ergänzt Lücken und nimmt geschlossene Formen wahr.',
    },
    {
      question: 'Alle Links einer Seite sind blau und unterstrichen. Warum erkennt man sie sofort als zusammengehörige Gruppe?',
      options: ['Gesetz der Ähnlichkeit', 'Gesetz der Kontinuität', 'Gesetz der Nähe', 'Figur-Grund-Beziehung'],
      correctIndex: 0,
      explanation: 'Elemente mit gleicher Farbe, Form oder Größe werden als zusammengehörig gelesen.',
    },
    {
      question: 'Ein Dialogfenster erscheint vor einer abgedunkelten Seite. Welches Gestaltgesetz sorgt dafür, dass der Dialog sofort im Vordergrund steht?',
      options: ['Figur-Grund-Beziehung', 'Gesetz der Erfahrung', 'Gesetz der Nähe', 'Gesetz der Kontinuität'],
      correctIndex: 0,
      explanation: 'Wir trennen eine Szene in Figur (Vordergrund) und Grund. Das Abdunkeln macht den Dialog eindeutig zur Figur.',
    },
  ],
  'Accessibility': [
    {
      question: 'Welches Kontrastverhältnis verlangt die WCAG 2.2 auf Stufe AA mindestens für normalen Text?',
      options: ['3 : 1', '4,5 : 1', '7 : 1', '2 : 1'],
      correctIndex: 1,
      explanation: 'Stufe AA verlangt 4,5 : 1 für normalen und 3 : 1 für großen Text. Stufe AAA verlangt 7 : 1.',
    },
    {
      question: 'Welches HTML-Attribut liefert Screenreadern die Beschreibung eines Bildes?',
      options: ['title', 'src', 'alt', 'class'],
      correctIndex: 2,
      explanation: 'Das alt-Attribut enthält den Alternativtext. Rein dekorative Bilder erhalten ein leeres alt="".',
    },
    {
      question: 'Wofür steht das „P“ in den vier Prinzipien der WCAG (POUR)?',
      options: ['Perceivable (wahrnehmbar)', 'Practical (praktisch)', 'Perfect (perfekt)', 'Protected (geschützt)'],
      correctIndex: 0,
      explanation: 'POUR steht für Perceivable, Operable, Understandable und Robust: wahrnehmbar, bedienbar, verständlich, robust.',
    },
    {
      question: 'Welche Mindestgröße empfehlen Apple und WCAG-Stufe AAA für Touch-Ziele?',
      options: ['20 × 20 px', '32 × 32 px', '44 × 44 px', '10 × 10 px'],
      correctIndex: 2,
      explanation: 'Empfohlen sind 44 × 44 Punkte bzw. Pixel. Stufe AA der WCAG 2.2 verlangt mindestens 24 × 24 px oder ausreichend Abstand.',
    },
    {
      question: 'Ein Formular markiert Fehler nur durch rote Umrandung. Welches Problem entsteht?',
      options: ['Information wird allein über Farbe vermittelt', 'Rot ist im Dunkelmodus nicht erlaubt', 'Der Kontrast ist zu hoch', 'Es entsteht kein Problem'],
      correctIndex: 0,
      explanation: 'Menschen mit Farbsehschwäche erkennen den Fehler nicht (WCAG 1.4.1). Symbol und Fehlertext müssen die Farbe ergänzen.',
    },
  ],
  "Fitts's Law": [
    {
      question: 'Was besagt Fitts’ Gesetz im Kern?',
      options: ['Große, nahe Ziele sind schneller zu treffen', 'Auffällige Ziele werden öfter geklickt', 'Rote Buttons werden schneller gefunden', 'Ziele am Bildschirmrand sind schwerer zu treffen'],
      correctIndex: 0,
      explanation: 'Die Zeit bis zum Ziel hängt von der Entfernung und der Größe des Ziels ab.',
    },
    {
      question: 'Warum sind die Ecken des Bildschirms bei Mausbedienung besonders schnell erreichbar?',
      options: ['Der Mauszeiger stoppt am Rand, das Ziel ist praktisch unendlich groß', 'Sie liegen näher am Auge', 'Sie sind heller beleuchtet', 'Sie werden zuerst gelesen'],
      correctIndex: 0,
      explanation: 'Man kann über den Rand nicht hinausschießen. Darum liegen wichtige Menüs oft am Bildschirmrand.',
    },
    {
      question: 'Wo sollten häufig genutzte Aktionen in einer Smartphone-App liegen, die meist einhändig bedient wird?',
      options: ['Im unteren Bildschirmbereich, gut mit dem Daumen erreichbar', 'Oben links', 'Möglichst klein am Rand', 'In einem versteckten Menü'],
      correctIndex: 0,
      explanation: 'Kurze Wege und große Ziele im Daumenbereich verringern Zeit und Fehlbedienungen.',
    },
  ],
  'User Centered Design': [
    {
      question: 'Was ist der erste Schritt im Design-Thinking-Prozess?',
      options: ['Ideate (Ideen finden)', 'Prototype (Prototypen bauen)', 'Empathize (Verstehen)', 'Test (Testen)'],
      correctIndex: 2,
      explanation: 'Bevor man Lösungen entwickelt, muss man die Nutzenden und ihre Probleme verstehen.',
    },
    {
      question: 'Was ist eine Persona?',
      options: ['Eine echte Person aus der Zielgruppe', 'Ein fiktiver, auf Forschung gestützter Archetyp einer Nutzungsgruppe', 'Die Projektleitung', 'Ein Designstil'],
      correctIndex: 1,
      explanation: 'Personas verdichten Muster aus Interviews und Daten. Sie bilden keine einzelne reale Person ab.',
    },
    {
      question: 'Welche Norm beschreibt den menschzentrierten Gestaltungsprozess interaktiver Systeme?',
      options: ['DIN EN ISO 9241-210', 'DIN EN ISO 9001', 'DIN 16518', 'ISO 7010'],
      correctIndex: 0,
      explanation: 'ISO 9241-210 beschreibt den iterativen Prozess: Nutzungskontext verstehen, Anforderungen festlegen, Lösungen gestalten, evaluieren.',
    },
    {
      question: 'Wie viele Testpersonen pro Runde decken nach Jakob Nielsen bereits den Großteil der Usability-Probleme auf?',
      options: ['Etwa 5', 'Mindestens 30', 'Etwa 100', 'Nur 1'],
      correctIndex: 0,
      explanation: 'Mehrere kleine Testrunden mit je etwa fünf Personen bringen mehr als ein großer Test.',
    },
  ],
};

let last = '';

// Liefert eine zufällige Frage zum Thema, nie zweimal dieselbe hintereinander
export const generateQuizQuestion = async (topic: string): Promise<QuizQuestion> => {
  const list = QUESTIONS[topic] || QUESTIONS['Usability Heuristiken'];
  let q = list[Math.floor(Math.random() * list.length)];
  if (list.length > 1) while (q.question === last) q = list[Math.floor(Math.random() * list.length)];
  last = q.question;
  // Antworten mischen, damit die richtige nicht immer an derselben Stelle steht
  const order = q.options.map((_, i) => i).sort(() => Math.random() - 0.5);
  return { ...q, options: order.map((i) => q.options[i]), correctIndex: order.indexOf(q.correctIndex) };
};
