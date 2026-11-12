import React, { useState } from 'react';
import { Users, Map, PenTool, Smartphone, MonitorPlay, ChevronDown, ChevronUp, CheckCircle, XCircle, X, Maximize2, BookOpen } from 'lucide-react';
import { KiBadge, isKiImage } from './KiBadge';
import {
  PersonaCard, JourneyMap, EmpathyMap, BehaviorVariables, PersonaSet, PersonaExercise,
  OpportunityMatrix, JourneySortExercise, WireframeFidelity,
} from './DesignMethodsVisuals';

type VisualKey = 'persona' | 'journey' | 'empathy' | 'variables' | 'personaSet' | 'personaExercise' | 'matrix' | 'journeyExercise' | 'wireframe';
const VISUALS: Record<VisualKey, React.ComponentType> = {
  persona: PersonaCard,
  journey: JourneyMap,
  empathy: EmpathyMap,
  variables: BehaviorVariables,
  personaSet: PersonaSet,
  personaExercise: PersonaExercise,
  matrix: OpportunityMatrix,
  journeyExercise: JourneySortExercise,
  wireframe: WireframeFidelity,
};

interface Method {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  imageUrl: string;
  key_benefits: string[];
  basics: {
    title: string;
    content: string[];
    more?: { label: string; text: string; href: string };
  };
  example: {
    title: string;
    scenario: string;
    details: string[];
  };
  visualExampleUrl?: string;
  dos?: string[];
  donts?: string[];
  visual?: VisualKey;
  visualTitle?: string;
  sections?: Section[];
  sources?: string[];
}

interface Section {
  title: string;
  intro?: string;
  items: { term?: string; text: string }[];
  steps?: boolean;
  visual?: VisualKey;
  wide?: boolean;
}

export const DesignMethodsView = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const methods: Method[] = [
    {
      id: 1,
      title: 'User Personas',
      description: 'Personas sind fiktive Charaktere, die repräsentativ für die verschiedenen Nutzungsgruppen stehen, die Ihre Website oder Ihr Produkt nutzen könnten. Sie basieren auf realen Daten und helfen dabei, die Bedürfnisse, Erfahrungen, Verhaltensweisen und Ziele der Nutzenden zu verstehen.',
      icon: Users,
      imageUrl: 'img/method-personas.webp',
      key_benefits: ['Fördert Empathie', 'Fokussiert Designentscheidungen', 'Erleichtert Kommunikation im Team'],
      basics: {
        title: 'Grundlagen der Persona-Erstellung',
        content: [
          'Personas sind mehr als nur demografische Daten. Sie verleihen abstrakten Zielgruppen ein Gesicht und eine Geschichte. Eine gute Persona basiert immer auf User Research (Interviews, Umfragen, Beobachtungen) und nicht auf reinen Annahmen.',
          'Typischerweise enthält ein Persona-Profil einen Namen, ein Foto, demografische Details (Alter, Beruf), aber vor allem psychografische Informationen: Was sind ihre Ziele? Was frustriert sie (Pain Points)? Welche technischen Vorkenntnisse haben sie?',
          'Bekannt gemacht hat die Methode Alan Cooper Ende der 1990er-Jahre. Sein Grundgedanke: Wer für „alle“ gestaltet, gestaltet für niemanden. Eine konkrete Person mit klaren Zielen zwingt das Team, Entscheidungen zu treffen und Prioritäten zu setzen.'
        ]
      },
      visual: 'persona',
      visualTitle: 'Beispiel eines Persona-Steckbriefs',
      sections: [
        {
          title: 'Was eine Persona ist – und was nicht',
          items: [
            { term: 'Keine Zielgruppe', text: 'Eine Zielgruppe beschreibt Merkmale („Frauen, 25–40, urban“). Eine Persona beschreibt Ziele, Verhalten und Kontext. Zwei Menschen gleichen Alters können völlig unterschiedlich handeln.' },
            { term: 'Keine echte Person', text: 'Eine Persona verdichtet Muster aus vielen Interviews. Wer eine einzelne reale Person abbildet, gestaltet für deren Eigenheiten statt für die Gruppe.' },
            { term: 'Kein Klischee', text: 'Stereotype („die technikferne Oma“) sind Annahmen, keine Erkenntnisse. Sie verstellen den Blick auf das tatsächliche Verhalten.' },
          ],
        },
        {
          title: 'Arten von Personas',
          items: [
            { term: 'Datenbasierte Persona', text: 'Entsteht aus qualitativer Forschung (Interviews, Beobachtung) und wird mit quantitativen Daten (Umfragen, Analytics) abgesichert. Der Standard für Projekte, in denen Entscheidungen auf ihr aufbauen.' },
            { term: 'Proto-Persona', text: 'Schnell im Workshop aus dem Wissen des Teams erstellt. Gut als Startpunkt, aber eine Hypothese: Sie muss mit echten Nutzenden überprüft werden.' },
            { term: 'Primäre Persona', text: 'Die wichtigste Persona. Für sie wird das Produkt optimiert. Wenn ihre Bedürfnisse erfüllt sind, sind die anderen meist mitbedient.' },
            { term: 'Sekundäre Persona', text: 'Ist mit dem Design der primären Persona weitgehend zufrieden, hat aber einzelne zusätzliche Anforderungen.' },
            { term: 'Anti-Persona', text: 'Beschreibt bewusst, für wen das Produkt nicht gemacht ist. Das schützt vor Funktionen, die niemand aus der Kernzielgruppe braucht.' },
          ],
        },
        {
          title: 'Beispiel: Ein Persona-Set für die Mobilitäts-App',
          intro: 'Selten reicht eine einzige Persona. Ein typisches Set besteht aus einer primären, ein bis zwei sekundären und manchmal einer Anti-Persona. Die Rollen legen fest, wessen Bedürfnisse im Zweifel Vorrang haben.',
          items: [],
          visual: 'personaSet',
        },
        {
          title: 'Bausteine eines Persona-Profils',
          items: [
            { term: 'Name, Bild, Kurztitel', text: 'Machen die Persona merkfähig („Anna, die effiziente Pendlerin“). Das Bild sollte realistisch, aber nicht wertend sein.' },
            { term: 'Zitat', text: 'Ein typischer Satz aus den Interviews fasst die Haltung in einem Satz zusammen.' },
            { term: 'Ziele', text: 'Was will die Person erreichen, im Produkt und darüber hinaus? Ziele sind wichtiger als Funktionswünsche.' },
            { term: 'Frustrationen (Pain Points)', text: 'Was hindert sie heute daran, ihre Ziele zu erreichen? Hier liegen die größten Chancen für das Design.' },
            { term: 'Verhalten und Nutzungskontext', text: 'Wann, wo, wie oft und mit welchem Gerät? In Ruhe am Schreibtisch oder einhändig unterwegs?' },
            { term: 'Fähigkeiten und Haltung', text: 'Erfahrung mit Technik und mit dem Fachgebiet, Motivation, Vertrauen. Oft als Skalen dargestellt.' },
            { term: 'Szenario', text: 'Eine kurze Geschichte, in der die Persona eine konkrete Aufgabe mit dem Produkt löst. Daraus entstehen Anforderungen und Testaufgaben.' },
          ],
        },
        {
          title: 'In sechs Schritten zur Persona',
          steps: true,
          items: [
            { term: 'Forschungsfrage klären', text: 'Für welches Produkt und welche Entscheidung brauchen wir die Personas?' },
            { term: 'Daten erheben', text: 'Interviews und Beobachtungen, typischerweise 5–10 Gespräche je vermuteter Nutzungsgruppe, ergänzt um Umfragen oder Analytics.' },
            { term: 'Muster finden', text: 'Aussagen auf Haftnotizen clustern (Affinity Mapping) und Verhaltensvariablen bilden, z. B. „plant voraus ↔ spontan“.' },
            { term: 'Personas ableiten', text: 'Menschen mit ähnlichen Mustern zu 3–5 Personas bündeln und eine primäre Persona festlegen.' },
            { term: 'Ausformulieren', text: 'Steckbrief, Zitat und Szenarien schreiben. Jede Aussage sollte sich auf Forschungsdaten zurückführen lassen.' },
            { term: 'Nutzen und pflegen', text: 'Im Team sichtbar machen, in Reviews einsetzen und überprüfen, sobald neue Daten vorliegen.' },
          ],
        },
        {
          title: 'Interviewfragen für die Persona-Forschung',
          intro: 'Gute Fragen zielen auf vergangenes, konkretes Verhalten. Was Menschen in Zukunft tun würden, können sie schlecht vorhersagen.',
          items: [
            { term: 'Einstieg', text: '„Erzählen Sie mir, wie ein typischer Arbeitstag bei Ihnen beginnt.“' },
            { term: 'Konkretes Erlebnis', text: '„Wann sind Sie zuletzt mit Bus oder Bahn gefahren? Erzählen Sie mir Schritt für Schritt, wie das war.“' },
            { term: 'Ziele und Motive', text: '„Was ist Ihnen dabei am wichtigsten? Warum?“' },
            { term: 'Probleme', text: '„Was hat Sie dabei zuletzt geärgert? Was haben Sie dann gemacht?“' },
            { term: 'Werkzeuge und Umgehungen', text: '„Welche Apps, Zettel oder Tricks nutzen Sie, um das zu lösen?“' },
            { term: 'Vermeiden', text: 'Suggestivfragen („Wäre eine Push-Nachricht nicht praktisch?“) und hypothetische Fragen („Würden Sie … nutzen?“). Sie liefern Höflichkeit statt Erkenntnis.' },
          ],
        },
        {
          title: 'Vom Interview zum Muster: Verhaltensvariablen',
          intro: 'Nach Alan Cooper werden die Interviewten auf Skalen eingeordnet, die ihr Verhalten beschreiben. Wer auf mehreren Skalen wiederholt beieinanderliegt, bildet ein Muster. Jedes Muster wird zu einer Persona.',
          items: [],
          visual: 'variables',
        },
        {
          title: 'Zwischenschritt: Die Empathy Map',
          intro: 'Eine Empathy Map ordnet Beobachtungen zu einer Person in vier Felder: Was sagt, denkt, tut und fühlt sie? Darunter stehen Hürden (Pains) und Gewinne (Gains). Die Map macht Widersprüche sichtbar, etwa zwischen dem, was jemand sagt, und dem, was er tut.',
          items: [],
          visual: 'empathy',
        },
        {
          title: 'Personas im Projekt einsetzen',
          items: [
            { term: 'Design-Entscheidungen', text: 'Statt „Ich finde …“ fragt das Team: „Würde Anna das in 30 Sekunden an der Haltestelle schaffen?“' },
            { term: 'Priorisierung', text: 'Funktionen, die der primären Persona nicht helfen, wandern nach hinten.' },
            { term: 'User Stories', text: '„Als Pendlerin möchte ich bei Verspätung sofort eine Alternative sehen, damit ich pünktlich ankomme.“' },
            { term: 'Usability-Tests', text: 'Die Personas bestimmen, welche Menschen für Tests rekrutiert werden und welche Aufgaben sie lösen.' },
          ],
        },
        {
          title: 'Inklusive Personas',
          intro: 'Das Inclusive Design Toolkit von Microsoft unterscheidet drei Formen von Einschränkungen. Wer sie in Personas und Szenarien mitdenkt, gestaltet für mehr Menschen.',
          items: [
            { term: 'Dauerhaft', text: 'Eine Person hat nur einen Arm, ist blind oder gehörlos.' },
            { term: 'Vorübergehend', text: 'Ein gebrochener Arm, eine Augenentzündung, eine Ohrenentzündung.' },
            { term: 'Situativ', text: 'Ein Kind auf dem Arm, blendende Sonne, ein lauter Bahnsteig. Annas Kaffeebecher in der Hand ist genau so eine Situation.' },
            { term: 'Für das Design', text: 'Was für die dauerhafte Einschränkung gelöst wird, hilft allen: Große Bedienelemente im Daumenbereich nützen Anna ebenso wie Menschen mit Tremor.' },
          ],
        },
        {
          title: 'Personas und verwandte Methoden',
          items: [
            { term: 'Marketing-Persona', text: 'Beschreibt Kaufmotive und Kanäle für Kampagnen. UX-Personas beschreiben Nutzungsverhalten. Beide ergänzen sich, ersetzen sich aber nicht.' },
            { term: 'Empathy Map', text: 'Verdichtet die Beobachtungen zu einer Person oder Gruppe. Oft der Rohstoff für die Persona.' },
            { term: 'Jobs to be Done', text: 'Fragt nicht „Wer ist die Person?“, sondern „Welche Aufgabe soll das Produkt für sie erledigen?“, z. B. „Bring mich pünktlich zur Arbeit.“ Gut kombinierbar mit Personas.' },
            { term: 'Szenario und User Story', text: 'Machen aus der Persona konkrete Situationen und Anforderungen für Design und Entwicklung.' },
          ],
        },
        {
          title: 'Qualitätscheck: Ist die Persona brauchbar?',
          items: [
            { term: 'Belegt', text: 'Lässt sich jede Aussage auf Interviews oder Daten zurückführen?' },
            { term: 'Unterscheidbar', text: 'Unterscheiden sich die Personas im Verhalten, nicht nur in Alter oder Beruf?' },
            { term: 'Entscheidungsrelevant', text: 'Hilft die Persona, zwischen zwei Designvarianten zu wählen?' },
            { term: 'Respektvoll', text: 'Kommt sie ohne Klischees aus? Würde sich eine echte Person darin fair beschrieben fühlen?' },
            { term: 'Aktuell', text: 'Wann wurde sie zuletzt mit neuen Daten abgeglichen?' },
            { term: 'Bekannt', text: 'Kennen alle im Team die primäre Persona beim Namen?' },
          ],
        },
        {
          title: 'Grenzen der Methode',
          items: [
            { term: 'Scheinpräzision', text: 'Ein Foto und ein Name lassen eine Annahme wie eine Tatsache wirken. Proto-Personas deshalb klar als Hypothese kennzeichnen.' },
            { term: 'Veraltung', text: 'Verhalten ändert sich, etwa durch neue Tarife oder Technik. Personas brauchen ein Ablaufdatum oder regelmäßige Pflege.' },
            { term: 'Kein Ersatz für echte Menschen', text: 'Personas helfen beim Denken. Sie ersetzen nicht den Usability-Test mit echten Nutzenden.' },
          ],
        },
        {
          title: 'Übung: Gehört das in die Persona?',
          intro: 'Sie überarbeiten den Steckbrief von Anna. Entscheiden Sie für jede Aussage, ob sie hineingehört.',
          items: [],
          visual: 'personaExercise',
        },
      ],
      dos: [
        'Personas auf echte Forschungsdaten stützen',
        'Wenige Personas (3–5) mit klarer primärer Persona',
        'Ziele, Verhalten und Kontext in den Mittelpunkt stellen',
        'Personas im Team sichtbar machen und regelmäßig nutzen',
      ],
      donts: [
        'Personas am Schreibtisch erfinden und nie überprüfen',
        'Irrelevante Details (Lieblingsfarbe, Haustier) ohne Bezug zum Produkt',
        'Klischees und Stereotype übernehmen',
        'Eine Persona pro Kundengruppe des Marketings anlegen',
      ],
      sources: [
        'Cooper, A. (1999): The Inmates Are Running the Asylum. Sams.',
        'Pruitt, J.; Adlin, T. (2006): The Persona Lifecycle. Morgan Kaufmann.',
        'Cooper, A.; Reimann, R.; Cronin, D.; Noessel, C. (2014): About Face. The Essentials of Interaction Design. 4. Aufl., Wiley.',
        'Microsoft (2016): Inclusive Design Toolkit (inclusive.microsoft.design).',
        'Gray, D.; Brown, S.; Macanufo, J. (2010): Gamestorming. O’Reilly (Empathy Map).',
        'Nielsen Norman Group: Personas Make Users Memorable for Product Team Members (nngroup.com).',
      ],
      example: {
        title: 'Beispiel: „Anna, die effiziente Pendlerin“',
        scenario: 'Für eine neue Mobilitäts-App entwickeln wir die Persona Anna.',
        details: [
          'Hintergrund: 34 Jahre, Architektin, pendelt täglich 45 Min.',
          'Ziel: Möchte so schnell wie möglich von A nach B, ohne Wartezeiten.',
          'Frustration: Unklare Verspätungsmeldungen, komplizierter Ticketkauf.',
          'Design-Implikation: Die App muss „One-Click-Ticketing“ und Echtzeit-Push-Nachrichten bei Verspätungen bieten.'
        ]
      }
    },
    {
      id: 2,
      title: 'User Journey Mapping',
      description: 'Eine User Journey Map visualisiert die Geschichte der Nutzenden mit Ihrem Produkt über verschiedene Kanäle und Zeitpunkte hinweg. Sie hilft dabei, Schwachstellen (Pain Points) und Optimierungsmöglichkeiten im gesamten Nutzungsprozess zu identifizieren.',
      icon: Map,
      imageUrl: 'img/method-journey.webp',
      key_benefits: ['Ganzheitliche Sicht', 'Identifikation von Lücken', 'Verständnis des Nutzerkontexts'],
      basics: {
        title: 'Die Reise der Nutzenden verstehen',
        content: [
          'Die User Journey betrachtet das Erlebnis nicht als einzelnen Moment, sondern als Prozess mit mehreren Phasen. Welche Phasen sinnvoll sind, hängt vom Szenario ab. Beim Online-Kauf sind es etwa Auslöser, Recherche, Auswahl, Kauf, Lieferung und Nutzung.',
          'Wichtige Elemente einer Map sind Touchpoints (Berührungspunkte mit dem Produkt), Emotionen (Stimmungskurve) und die Gedanken der Nutzenden in jedem Schritt.',
          'Eine Journey Map erzählt immer die Geschichte einer bestimmten Persona in einem bestimmten Szenario. Sie zeigt nicht, wie das Produkt funktioniert, sondern wie es sich für diese Person anfühlt. So wird sichtbar, an welcher Stelle Menschen abspringen und warum.'
        ]
      },
      visual: 'journey',
      visualTitle: 'Beispiel einer User Journey Map – Ist- und Soll-Zustand zum Umschalten',
      sections: [
        {
          title: 'Bausteine einer Journey Map',
          items: [
            { term: 'Akteur', text: 'Wessen Reise wird gezeigt? In der Regel eine Persona. Für jede Persona entsteht eine eigene Map.' },
            { term: 'Szenario und Erwartung', text: 'Welche Aufgabe will die Person lösen, und was erwartet sie dabei?' },
            { term: 'Phasen', text: 'Die großen Abschnitte der Reise, z. B. Recherche, Auswahl, Kauf, Lieferung, Nutzung. Sie bilden die Spalten.' },
            { term: 'Aktionen, Gedanken, Emotionen', text: 'Was tut, denkt und fühlt die Person in jeder Phase? Originalzitate aus Interviews machen die Map glaubwürdig.' },
            { term: 'Touchpoints und Kanäle', text: 'Wo begegnet die Person dem Angebot: Website, App, Mail, Hotline, Filiale, Paket?' },
            { term: 'Pain Points', text: 'Hürden und negative Momente. Die Emotionskurve zeigt sie auf einen Blick.' },
            { term: 'Chancen (Opportunities)', text: 'Konkrete Ideen, wie sich jeder Tiefpunkt verbessern lässt, mit Zuständigkeit im Team.' },
          ],
        },
        {
          title: 'Arten und Abgrenzung',
          items: [
            { term: 'Ist-Zustand (Current State)', text: 'Zeigt die heutige Erfahrung auf Basis von Forschung. Ausgangspunkt, um Probleme zu finden.' },
            { term: 'Soll-Zustand (Future State)', text: 'Beschreibt, wie die Reise künftig aussehen soll. Dient als Vision und Planungsgrundlage.' },
            { term: 'Day in the Life', text: 'Betrachtet einen ganzen Tag der Person, auch jenseits des Produkts. Hilft, den Kontext zu verstehen.' },
            { term: 'Service Blueprint', text: 'Ergänzt die Journey um die Prozesse „hinter den Kulissen“: Mitarbeitende, Systeme, Abläufe.' },
            { term: 'User Flow', text: 'Nicht zu verwechseln: Ein User Flow zeigt den Klickpfad durch Screens. Die Journey Map zeigt das Erleben über alle Kanäle.' },
          ],
        },
        {
          title: 'In sieben Schritten zur Journey Map',
          steps: true,
          items: [
            { term: 'Ziel festlegen', text: 'Welche Frage soll die Map beantworten, z. B. „Warum brechen so viele den Kauf ab?“' },
            { term: 'Persona und Szenario wählen', text: 'Eine Persona, eine konkrete Aufgabe mit Anfang und Ende.' },
            { term: 'Daten sammeln', text: 'Interviews, Tagebuchstudien, Support-Anfragen, Analytics, Bewertungen.' },
            { term: 'Phasen und Touchpoints bestimmen', text: 'Die Reise grob gliedern und alle Kontaktpunkte eintragen.' },
            { term: 'Erleben ausfüllen', text: 'Aktionen, Gedanken und Emotionen je Phase aus den Daten übertragen.' },
            { term: 'Pain Points und Chancen markieren', text: 'Tiefpunkte der Emotionskurve analysieren und Verbesserungsideen sammeln.' },
            { term: 'Teilen und umsetzen', text: 'Map gemeinsam mit dem Team besprechen, Chancen priorisieren und Zuständigkeiten vergeben.' },
          ],
        },
        {
          title: 'Phasen passend zum Szenario wählen',
          intro: 'Es gibt kein festes Phasenschema. Die Phasen beschreiben die Reise so, wie die Person sie erlebt, nicht wie das Unternehmen organisiert ist.',
          items: [
            { term: 'Kauf im Online-Shop', text: 'Auslöser → Recherche → Auswahl → Kauf → Lieferung → Nutzung' },
            { term: 'Marketing-Funnel', text: 'Aufmerksamkeit (Awareness) → Erwägung (Consideration) → Entscheidung (Decision) → Bindung (Retention). Passt, wenn es um Gewinnung neuer Kundschaft geht.' },
            { term: 'Studienstart', text: 'Interesse → Bewerbung → Zusage → Einschreibung → erste Woche' },
            { term: 'Arztbesuch', text: 'Beschwerden → Termin finden → Anreise → Wartezimmer → Behandlung → Nachsorge' },
          ],
        },
        {
          title: 'Die Emotionskurve lesen',
          items: [
            { term: 'Tiefpunkte zuerst', text: 'Die tiefsten Stellen zeigen, wo Menschen abspringen oder Hilfe brauchen. Im Beispiel ist das die Größenwahl.' },
            { term: 'Peak-End-Regel', text: 'Nach Daniel Kahneman erinnern sich Menschen vor allem an den intensivsten Moment und an das Ende eines Erlebnisses. Ein starker Abschluss (einfache Rückgabe) prägt das Gesamturteil.' },
            { term: 'Moments of Truth', text: 'Momente, in denen sich entscheidet, ob jemand weitermacht oder abbricht, etwa die Registrierungspflicht im Checkout.' },
            { term: 'Häufigkeit mal Schwere', text: 'Ein kleiner Ärger, den alle erleben, kann wichtiger sein als ein großer, den nur wenige haben.' },
            { term: 'Höhepunkte schützen', text: 'Was heute begeistert (schnelle Lieferung), darf bei Änderungen nicht verloren gehen.' },
          ],
        },
        {
          title: 'Vom Pain Point zur Chance: How-Might-We-Fragen',
          intro: 'Eine „Wie könnten wir …?“-Frage macht aus einem Problem einen Auftrag, ohne die Lösung vorwegzunehmen. Danach werden Ideen gesammelt.',
          items: [
            { term: 'Pain Point', text: 'Größenangaben uneinheitlich, kein Vergleich zum alten Schuh.' },
            { term: 'Wie könnten wir …', text: '… Jonas sicher machen, dass der Schuh passt, bevor er ihn bestellt?' },
            { term: 'Mögliche Ideen', text: 'Größenfinder anhand des bisherigen Modells, Fußvermessung per Handykamera, Größenhinweis aus Bewertungen („fällt klein aus“).' },
            { term: 'Zu eng', text: '„Wie könnten wir einen Größenfinder bauen?“ – das ist schon eine Lösung.' },
            { term: 'Zu weit', text: '„Wie könnten wir den Schuhkauf verbessern?“ – das gibt keine Richtung vor.' },
          ],
        },
        {
          title: 'Woher kommen die Inhalte?',
          items: [
            { term: 'Aktionen', text: 'Beobachtung, Kontextinterviews, Analytics (Klickpfade, Abbruchstellen).' },
            { term: 'Gedanken', text: 'Wörtliche Zitate aus Interviews und Tagebuchstudien.' },
            { term: 'Emotionen', text: 'Interviews, Tagebücher, Bewertungen, Lautes-Denken-Protokolle aus Usability-Tests.' },
            { term: 'Touchpoints', text: 'Interviews und interne Übersichten aller Kanäle (Mail, Hotline, Filiale).' },
            { term: 'Pain Points', text: 'Support-Anfragen, Rücksendegründe, negative Bewertungen, Abbruchraten.' },
          ],
        },
        {
          title: 'Chancen priorisieren',
          intro: 'Nicht jede Chance lässt sich sofort umsetzen. Eine Nutzen-Aufwand-Matrix hilft dem Team, die Ideen aus der Map gemeinsam zu ordnen.',
          items: [],
          visual: 'matrix',
        },
        {
          title: 'Journey Mapping als Workshop (ca. 3 Stunden)',
          steps: true,
          items: [
            { term: 'Vorbereiten', text: 'Forschungsergebnisse aufbereiten, Persona und Szenario festlegen, Wand oder digitales Whiteboard mit Zeilen und Spalten vorbereiten.' },
            { term: 'Einstimmen (20 Min.)', text: 'Persona vorstellen, Ziel des Workshops klären, Originalzitate vorlesen.' },
            { term: 'Reise aufbauen (45 Min.)', text: 'Phasen und Aktionen gemeinsam auf Haftnotizen festhalten.' },
            { term: 'Erleben ergänzen (45 Min.)', text: 'Gedanken, Emotionen und Touchpoints aus den Daten eintragen, Emotionskurve zeichnen.' },
            { term: 'Chancen finden (45 Min.)', text: 'Tiefpunkte als How-Might-We-Fragen formulieren, Ideen sammeln, mit Punkten abstimmen.' },
            { term: 'Abschließen (25 Min.)', text: 'Chancen priorisieren, Zuständige und nächste Schritte festlegen, Map fotografieren und teilen.' },
          ],
        },
        {
          title: 'Qualitätscheck: Ist die Map brauchbar?',
          items: [
            { term: 'Eine Perspektive', text: 'Zeigt die Map genau eine Persona in genau einem Szenario?' },
            { term: 'Belegt', text: 'Stammen Gedanken und Emotionen aus Forschung statt aus Vermutungen?' },
            { term: 'Vollständig', text: 'Sind auch Phasen vor und nach der Nutzung des eigenen Produkts enthalten?' },
            { term: 'Handlungsleitend', text: 'Gibt es zu jedem großen Pain Point mindestens eine Chance mit zuständiger Person?' },
          ],
        },
        {
          title: 'Übung: Wohin gehört das?',
          items: [],
          visual: 'journeyExercise',
        },
      ],
      dos: [
        'Eine Map pro Persona und Szenario',
        'Emotionen und Zitate aus echter Forschung verwenden',
        'Kanäle außerhalb des eigenen Produkts mitdenken',
        'Jede Map mit konkreten Chancen und Zuständigkeiten abschließen',
      ],
      donts: [
        'Die Map aus Unternehmenssicht statt aus Sicht der Nutzenden zeichnen',
        'Alle Zielgruppen in einer einzigen Map vermischen',
        'Nur den eigenen Screen-Ablauf abbilden (das ist ein User Flow)',
        'Die Map als Poster aufhängen und nicht weiterverwenden',
      ],
      sources: [
        'Kalbach, J. (2020): Mapping Experiences. 2. Aufl., O’Reilly.',
        'Stickdorn, M. u. a. (2018): This Is Service Design Doing. O’Reilly.',
        'Kaplan, K. (2016): When and How to Create Customer Journey Maps. Nielsen Norman Group.',
        'Kahneman, D. (2011): Schnelles Denken, langsames Denken. Siedler (Peak-End-Regel).',
        'Knapp, J.; Zeratsky, J.; Kowitz, B. (2016): Sprint. Simon & Schuster (How-Might-We-Notizen).',
      ],
      example: {
        title: 'Beispiel: „Online-Schuhkauf“',
        scenario: 'Wir mappen, wie Jonas, ein Hobbyläufer, online neue Laufschuhe kauft.',
        details: [
          'Recherche: Sucht bei Google, liest Testberichte, versteht die Fachbegriffe nicht. (Emotion: unsicher)',
          'Auswahl: Findet ein Modell, aber die Größe ist unklar. (Emotion: genervt – Tiefpunkt)',
          'Kauf: Muss vor dem Bezahlen ein Konto anlegen. (Emotion: unsicher)',
          'Lieferung: Paket kommt früher als gedacht. (Emotion: begeistert)',
          'Erkenntnis: Die Größenberatung bei der Auswahl hat den größten Hebel, z. B. durch einen Größenfinder.'
        ]
      }
    },
    {
      id: 3,
      title: 'Wireframing',
      description: 'Wireframes sind schematische Darstellungen (Blaupausen) einer Benutzeroberfläche. Sie konzentrieren sich auf Struktur, Layout und Informationsarchitektur, ohne von visuellen Details wie Farben oder Bildern abzulenken („Low-Fidelity“).',
      icon: PenTool,
      imageUrl: 'img/method-wireframe.webp',
      key_benefits: ['Schnelle Iteration', 'Klarer Fokus auf Struktur', 'Kostengünstige Fehlerbehebung'],
      basics: {
        title: 'Struktur vor Design',
        content: [
          'Wireframes sind das Skelett des Designs. Sie legen fest, wo Inhalte platziert werden, wie viel Platz sie einnehmen und wie die Navigation funktioniert. Man unterscheidet zwischen Low-Fidelity (Skizzen, grobe Blöcke) und High-Fidelity (detailliertere Graustufen-Layouts).',
          'Das Ziel ist es, die Informationsarchitektur zu validieren, bevor Zeit in Pixel-Perfect-Design investiert wird. Änderungen sind hier noch „billig“.'
        ]
      },
      sections: [
        {
          title: 'Fidelity-Stufen',
          items: [
            { term: 'Skizze', text: 'Papier und Stift, wenige Minuten pro Screen. Ideal, um viele Varianten zu vergleichen (z. B. „Crazy 8s“).' },
            { term: 'Low-Fidelity', text: 'Graue Kästen, Platzhalter, grobe Texte. Zeigt Struktur und Reihenfolge.' },
            { term: 'Mid-Fidelity', text: 'Echte Inhalte und Beschriftungen, Raster, Abstände. Grundlage für Abstimmungen mit Entwicklung und Fachabteilung.' },
            { term: 'High-Fidelity', text: 'Nahe am finalen Layout, aber noch ohne Farben und Bilder. Übergang zum visuellen Design.' },
          ],
        },
        {
          title: 'Ein Screen, drei Stufen',
          items: [],
          visual: 'wireframe',
        },
        {
          title: 'Konventionen und Annotationen',
          items: [
            { term: 'Bildplatzhalter', text: 'Ein Rechteck mit diagonalem Kreuz steht für Bilder, deren Inhalt noch offen ist.' },
            { term: 'Text', text: 'Überschriften als echte Wörter, Fließtext als graue Linien oder – besser – als echter Entwurfstext.' },
            { term: 'Annotationen', text: 'Nummerierte Notizen am Rand erklären Verhalten, das man nicht sieht: „Liste lädt beim Scrollen nach“, „Button erst aktiv, wenn alle Felder ausgefüllt sind“.' },
            { term: 'Zustände', text: 'Leere Liste, Ladezustand und Fehlermeldung gehören ebenfalls ins Wireframe, nicht nur der Idealfall.' },
            { term: 'Raster', text: 'Ein einfaches Spaltenraster sorgt dafür, dass die Struktur später ins visuelle Design übernommen werden kann.' },
          ],
        },
      ],
      sources: [
        'Garrett, J. J. (2011): The Elements of User Experience. 2. Aufl., New Riders.',
        'Brown, D. M. (2010): Communicating Design. 2. Aufl., New Riders.',
      ],
      dos: [
        'Schwarz-Weiß bleiben (max. Graustufen)',
        'Platzhalter für Bilder nutzen (Box mit X)',
        'Echte Inhalte statt Lorem Ipsum (wenn möglich)',
        'Fokus auf Layout und Hierarchie'
      ],
      donts: [
        'Farben verwenden (lenkt ab)',
        'Detaillierte Icons oder Logos einfügen',
        'Pixel-Perfect Abstände messen',
        'Zu früh über Design-Details diskutieren'
      ],
      example: {
        title: 'Beispiel: „Dashboard für Finanz-App“',
        scenario: 'Planung der Übersichtseite (Dashboard) für Nutzende.',
        details: [
          'Element 1: Großer Kontostand oben links (Priorität 1).',
          'Element 2: Liste der letzten Transaktionen darunter.',
          'Element 3: „Geld senden“-Button prominent als schwebende Aktionsschaltfläche (Floating Action Button).',
          'Feedback im Review: „Der Kontostand ist zu dominant, Nutzende wollen erst die Ausgaben sehen.“ Das Wireframe wird in fünf Minuten angepasst.'
        ]
      }
    },
    {
      id: 4,
      title: 'Prototyping',
      description: 'Prototypen sind interaktive Simulationen des Endprodukts. Sie können von einfachen Klick-Dummies bis hin zu hochauflösenden („High-Fidelity“) Modellen reichen, die dem fertigen Produkt sehr ähnlich sehen und sich so anfühlen.',
      icon: Smartphone,
      imageUrl: 'https://images.unsplash.com/photo-1650636353551-1275516077b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBwcm90b3R5cGluZyUyMHNjcmVlbiUyMGludGVyYWN0aW9ufGVufDF8fHx8MTc3MDEyMjIwNnww&ixlib=rb-4.1.0&q=80&w=1080',
      key_benefits: ['Testbare Interaktionen', 'Realistisches Feedback', 'Validierung vor der Entwicklung'],
      basics: {
        title: 'Interaktion erlebbar machen',
        content: [
          'Ein Prototyp simuliert die Interaktion. Er beantwortet die Frage: „Wie fühlt es sich an, das Produkt zu benutzen?“. Tools wie Figma oder Protopie erlauben es, Screens zu verknüpfen, Übergänge zu animieren und Mikro-Interaktionen zu testen.',
          'Prototypen sind essenziell für Usability-Tests, da Nutzende Aufgaben realitätsnah durchspielen können, ohne dass eine Zeile Code geschrieben wurde.'
        ],
        more: { label: 'Weiter vertiefen · Lernmodul 09', text: 'Wie Sie Übergänge, Timing, Easing und Mikrointeraktionen gezielt gestalten und barrierefrei umsetzen, zeigt das Modul UX & Animation.', href: '../ux-animation/' }
      },
      sections: [
        {
          title: 'Arten von Prototypen',
          items: [
            { term: 'Papierprototyp', text: 'Ausgedruckte oder gezeichnete Screens, eine Person spielt „Computer“ und tauscht die Blätter. Schnell und günstig.' },
            { term: 'Klick-Dummy', text: 'Verlinkte Screens in Figma o. Ä. Reicht für die meisten Tests von Navigation und Abläufen.' },
            { term: 'High-Fidelity-Prototyp', text: 'Mit finalem Design, Animationen und Mikrointeraktionen. Für Detailfragen und Präsentationen.' },
            { term: 'Wizard of Oz', text: 'Ein Mensch simuliert im Hintergrund ein System, das es noch nicht gibt, z. B. einen Chatbot.' },
          ],
        },
        {
          title: 'Was soll der Prototyp beantworten?',
          intro: 'Houde und Hill (1997) unterscheiden drei Fragen, die ein Prototyp klären kann. Jeder Prototyp sollte sich auf eine davon konzentrieren.',
          items: [
            { term: 'Rolle', text: 'Welchen Nutzen hat das Produkt im Alltag? Beispiel: Ein Video oder Storyboard zeigt, wie Anna morgens die Verspätungsmeldung bekommt.' },
            { term: 'Look and Feel', text: 'Wie sieht es aus, wie fühlt sich die Bedienung an? Beispiel: Ein gestalteter Klick-Prototyp in Figma.' },
            { term: 'Umsetzung', text: 'Ist es technisch machbar und schnell genug? Beispiel: Ein Code-Prototyp, der echte Fahrplandaten lädt.' },
          ],
        },
      ],
      dos: [
        'Nur so viel bauen, wie die Testfrage erfordert',
        'Realistische Inhalte und Daten verwenden',
        'Den Prototyp vorab selbst durchklicken',
      ],
      donts: [
        'Wochen in einen Prototyp investieren, der noch nie getestet wurde',
        'Sackgassen ohne „Zurück“ einbauen',
        'Einen Prototyp mit dem fertigen Produkt verwechseln',
      ],
      sources: [
        'Houde, S.; Hill, C. (1997): What Do Prototypes Prototype? In: Helander, M. u. a. (Hrsg.): Handbook of Human-Computer Interaction. 2. Aufl., Elsevier.',
        'Snyder, C. (2003): Paper Prototyping. Morgan Kaufmann.',
      ],
      example: {
        title: 'Beispiel: „Checkout-Flow“',
        scenario: 'Test des neuen Bezahlprozesses.',
        details: [
          'Setup: Ein High-Fidelity Prototyp in Figma.',
          'Flow: Warenkorb → Adresseingabe → Zahlungsart → Bestätigung.',
          'Interaktion: Die Testperson tippt auf „Kaufen“, eine Ladeanimation erscheint, dann eine Erfolgsmeldung.',
          'Zweck: Testen, ob Nutzende verstehen, dass sie nach der Adresseingabe noch nicht bezahlt haben.'
        ]
      }
    },
    {
      id: 5,
      title: 'Usability Testing',
      description: 'Beim Usability Testing beobachten Sie echte Nutzende dabei, wie sie versuchen, Aufgaben mit Ihrem Produkt zu erledigen. Dies ist die effektivste Methode, um Usability-Probleme aufzudecken, da sie auf tatsächlichem Verhalten statt auf Vermutungen basiert.',
      icon: MonitorPlay,
      imageUrl: 'img/method-usability.webp',
      key_benefits: ['Objektive Daten', 'Aufdecken von Fehlbedienungen', 'Direktes Nutzerfeedback'],
      basics: {
        title: 'Nutzenden über die Schulter schauen',
        content: [
          'Man unterscheidet oft zwischen moderierten Tests (ein Versuchsleiter führt durch den Test) und unmoderierten Tests (Nutzende erledigen Aufgaben eigenständig remote).',
          'Die wichtigste Regel: „Wir testen das Produkt, nicht die Nutzenden.“ Eine gängige Methode ist die „Think Aloud“-Methode, bei der Nutzende ihre Gedanken während der Bedienung laut aussprechen.'
        ]
      },
      sections: [
        {
          title: 'Ablauf eines Usability-Tests',
          steps: true,
          items: [
            { term: 'Ziele festlegen', text: 'Was wollen wir herausfinden? Z. B. „Finden Nutzende die Rückgabe?“' },
            { term: 'Aufgaben formulieren', text: 'Realistische Aufgaben ohne Hinweise auf die Lösung: nicht „Klicken Sie auf Favoriten“, sondern „Merken Sie sich das Rezept für später“.' },
            { term: 'Teilnehmende rekrutieren', text: 'Passend zu den Personas. Nach Jakob Nielsen decken 5 Personen pro Runde den Großteil der Probleme auf.' },
            { term: 'Test durchführen', text: 'Lautes Denken anregen, nicht helfen, beobachten und protokollieren.' },
            { term: 'Auswerten', text: 'Probleme sammeln, nach Schweregrad gewichten und Verbesserungen ableiten. Danach erneut testen.' },
          ],
        },
        {
          title: 'Schweregrade nach Jakob Nielsen',
          items: [
            { term: '0 – kein Problem', text: 'Keine Usability-Schwäche.' },
            { term: '1 – kosmetisch', text: 'Beheben, wenn Zeit bleibt.' },
            { term: '2 – gering', text: 'Niedrige Priorität.' },
            { term: '3 – schwer', text: 'Wichtig, hohe Priorität.' },
            { term: '4 – katastrophal', text: 'Muss vor der Veröffentlichung behoben werden.' },
          ],
        },
        {
          title: 'Was wird gemessen?',
          intro: 'Die Kennzahlen folgen der Definition von Gebrauchstauglichkeit in ISO 9241-11.',
          items: [
            { term: 'Effektivität', text: 'Erfolgsquote: Wie viele lösen die Aufgabe vollständig?' },
            { term: 'Effizienz', text: 'Zeit pro Aufgabe, Anzahl der Fehler und Umwege.' },
            { term: 'Zufriedenheit', text: 'Fragebogen nach dem Test, z. B. die System Usability Scale (SUS) mit zehn Aussagen. Werte über etwa 68 gelten als überdurchschnittlich.' },
          ],
        },
        {
          title: 'Hilfreiche Sätze für die Moderation',
          items: [
            { term: 'Zu Beginn', text: '„Wir testen die App, nicht Sie. Sie können nichts falsch machen.“' },
            { term: 'Lautes Denken anregen', text: '„Was geht Ihnen gerade durch den Kopf?“' },
            { term: 'Bei Fragen zurückspielen', text: '„Was würden Sie erwarten?“ statt die Antwort zu verraten.' },
            { term: 'Bei Stillstand', text: '„Wenn Sie zu Hause wären, was würden Sie jetzt tun?“' },
          ],
        },
      ],
      dos: [
        'Mehrere kleine Testrunden statt einer großen',
        'Neutrale, offene Fragen stellen',
        'Beobachtungen und Meinungen getrennt notieren',
      ],
      donts: [
        'Teilnehmende bei Schwierigkeiten zur Lösung führen',
        'Nur Kolleginnen und Kollegen testen lassen',
        'Fragen wie „Gefällt Ihnen das?“ als Ergebnis werten',
      ],
      sources: [
        'Krug, S. (2010): Rocket Surgery Made Easy. New Riders.',
        'Nielsen, J. (2000): Why You Only Need to Test with 5 Users. Nielsen Norman Group.',
        'Brooke, J. (1996): SUS – A Quick and Dirty Usability Scale. In: Jordan, P. W. u. a. (Hrsg.): Usability Evaluation in Industry. Taylor & Francis.',
        'DIN EN ISO 9241-11:2018: Gebrauchstauglichkeit – Begriffe und Konzepte.',
      ],
      example: {
        title: 'Beispiel: „Rezept finden und speichern“',
        scenario: 'Usability Test für eine Koch-App.',
        details: [
          'Aufgabe: „Finden Sie ein vegetarisches Lasagne-Rezept und speichern Sie es in Ihren Favoriten.“',
          'Beobachtung: 3 von 5 Nutzenden suchen den „Speichern“-Button vergeblich oben rechts, er befindet sich aber unten am Bildrand.',
          'Erkenntnis: Der Button ist außerhalb des erwarteten Sichtfeldes (Mental Model).',
          'Maßnahme: Button-Position an gängige Standards anpassen.'
        ]
      }
    }
  ];

  return (
    <div className="space-y-16 animate-fade-in pb-20">
      {/* Header */}
      <div className="max-w-3xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-2">
          Methodik
        </h2>
        <h1 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600 mb-6">
          Design Methoden
        </h1>
        <p className="text-xl text-stone-600 leading-relaxed">
          Ein Überblick über die wichtigsten Werkzeuge und Techniken im User Experience Design Prozess.
          Diese Methoden helfen dabei, nutzerzentrierte Entscheidungen zu treffen und Risiken zu minimieren.
        </p>
      </div>

      {/* Methods List */}
      <div className="space-y-24">
        {methods.map((method, index) => {
          const isEven = index % 2 === 0;
          const isExpanded = expandedId === method.id;

          return (
            <div key={method.id} className="scroll-mt-24" id={`method-${method.id}`}>
              <div className={`flex flex-col md:flex-row gap-12 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>

                {/* Image Section */}
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-100 shadow-xl group">
                    <img
                      src={method.imageUrl}
                      alt={method.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%] hover:grayscale-0"
                    />
                    {isKiImage(method.imageUrl) && <KiBadge />}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                      <method.icon size={24} className="text-stone-900" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl font-black text-stone-400 select-none" aria-hidden="true">
                      0{method.id}
                    </span>
                    <h3 className="text-3xl font-bold text-stone-900 tracking-tight">
                      {method.title}
                    </h3>
                  </div>

                  <p className="text-lg text-stone-600 leading-relaxed border-l-4 border-stone-200 pl-6">
                    {method.description}
                  </p>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-3">
                      Key Benefits
                    </h4>
                    <ul className="grid grid-cols-1 gap-2">
                      {method.key_benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2 text-stone-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(method.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`method-details-${method.id}`}
                    className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider text-sm hover:text-orange-600 transition-colors mt-4"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={20} />
                        Weniger anzeigen
                      </>
                    ) : (
                      <>
                        <ChevronDown size={20} />
                        Details & Beispiele
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
              <div id={`method-details-${method.id}`} className="mt-12 bg-stone-50 rounded-2xl p-6 md:p-12 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                  {/* Basics Column */}
                  <div className="space-y-6">
                    <h4 className="flex items-center gap-3 text-xl font-bold text-stone-900">
                      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600">
                        <span className="text-sm">i</span>
                      </div>
                      {method.basics.title}
                    </h4>
                    <div className="space-y-3 text-stone-600 leading-relaxed">
                      {method.basics.content.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                    {method.basics.more && (
                      <aside className="rounded-xl border border-orange-200 bg-orange-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-orange-700">{method.basics.more.label}</p>
                        <p className="mt-2 text-stone-700 leading-relaxed">{method.basics.more.text}</p>
                        <a href={method.basics.more.href} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Zum Lernmodul 09 →</a>
                      </aside>
                    )}

                    {/* Conditional Visual Example for Wireframing etc */}
                    {method.visualExampleUrl && (
                      <div className="mt-8">
                        <h5 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-3">Visuelles Beispiel</h5>
                        <div
                          className="rounded-lg overflow-hidden border border-stone-200 shadow-sm cursor-zoom-in relative group"
                          onClick={() => setSelectedImage(method.visualExampleUrl!)}
                        >
                          <img
                            src={method.visualExampleUrl}
                            alt="Visual Example"
                            className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
                              <Maximize2 size={14} />
                              Vergrößern
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Example & Do's/Don'ts */}
                  <div className="space-y-8">
                    {/* Example Box */}
                    <div className="space-y-4">
                      <h4 className="flex items-center gap-3 text-xl font-bold text-stone-900">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                          <span className="text-sm">Ex</span>
                        </div>
                        {method.example.title}
                      </h4>
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <p className="font-medium text-stone-900 mb-3 italic">
                          „{method.example.scenario}“
                        </p>
                        <ul className="space-y-2">
                          {method.example.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Do's and Don'ts if available */}
                    {(method.dos || method.donts) && (
                      <div className="grid grid-cols-1 gap-6 pt-4">
                        {method.dos && (
                          <div>
                            <h5 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-green-700 mb-3">
                              <CheckCircle size={16} />
                              Do's
                            </h5>
                            <ul className="space-y-2">
                              {method.dos.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {method.donts && (
                          <div>
                            <h5 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-700 mb-3">
                              <XCircle size={16} />
                              Don'ts
                            </h5>
                            <ul className="space-y-2">
                              {method.donts.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Anschauliches Beispiel (Persona-Steckbrief, Journey Map) */}
                {method.visual && (
                  <div className="mt-12">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-4">{method.visualTitle}</h4>
                    {React.createElement(VISUALS[method.visual])}
                  </div>
                )}

                {/* Vertiefende Abschnitte */}
                {method.sections && (
                  <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {method.sections.map((section) => (
                      <section key={section.title} className={`rounded-xl border border-stone-200 p-6 ${section.visual ? 'bg-stone-100/60' : 'bg-white'} ${section.steps || section.wide || section.visual || section.items.length > 5 ? 'lg:col-span-2' : ''}`}>
                        <h4 className="text-lg font-bold text-stone-900 mb-4">{section.title}</h4>
                        {section.intro && <p className="text-stone-600 mb-4">{section.intro}</p>}
                        {section.items.length === 0 ? null : section.steps ? (
                          <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {section.items.map((item, i) => (
                              <li key={i} className="flex gap-3">
                                <span className="shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white grid place-items-center text-sm font-bold" aria-hidden="true">{i + 1}</span>
                                <div className="text-sm text-stone-600 leading-relaxed">
                                  <span className="block font-bold text-stone-900">{item.term}</span>
                                  {item.text}
                                </div>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <dl className={`grid grid-cols-1 ${section.items.length > 5 ? 'md:grid-cols-2' : ''} gap-x-8 gap-y-4`}>
                            {section.items.map((item, i) => (
                              <div key={i} className="border-l-2 border-orange-200 pl-4">
                                {item.term && <dt className="font-bold text-stone-900 text-sm">{item.term}</dt>}
                                <dd className="text-sm text-stone-600 leading-relaxed">{item.text}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {section.visual && (
                          <div className={section.items.length ? 'mt-6' : ''}>{React.createElement(VISUALS[section.visual])}</div>
                        )}
                      </section>
                    ))}
                  </div>
                )}

                {/* Quellen */}
                {method.sources && (
                  <div className="mt-10 pt-6 border-t border-stone-200">
                    <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-900 mb-3">
                      <BookOpen size={16} aria-hidden="true" /> Zum Weiterlesen
                    </h4>
                    <ul className="space-y-1 text-sm text-stone-600">
                      {method.sources.map((src, i) => <li key={i}>{src}</li>)}
                    </ul>
                  </div>
                )}
              </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Enlarged View"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
