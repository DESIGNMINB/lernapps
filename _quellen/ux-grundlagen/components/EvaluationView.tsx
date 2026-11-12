
import React, { useState } from 'react';
import { KiBadge } from './KiBadge';

interface EvaluationMethod {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  output: string;
  pros: string[];
  cons: string[];
}

const EVALUATION_METHODS: EvaluationMethod[] = [
  {
    id: 'thinking-aloud',
    title: 'Thinking Aloud',
    icon: '🗣️',
    shortDesc: 'Der Klassiker im Usability Testing. Nutzende bearbeiten Aufgaben am System und sprechen dabei laut aus, was sie denken.',
    fullDesc: 'Die „Thinking Aloud“-Methode (Lautes Denken) ist die wertvollste qualitative Methode im Usability Engineering. Testpersonen werden gebeten, ihre Gedanken während der Nutzung kontinuierlich zu verbalisieren. Dies öffnet eine „Black Box“ – wir erfahren nicht nur, DASS ein Fehler passiert, sondern WARUM er passiert (Missverständnis, Übersehen, falsche Erwartung).',
    output: '„Ich suche den Warenkorb … ah, das Icon sah aus wie eine Tasche.“',
    pros: [
      'Günstig und einfach durchzuführen',
      'Liefert Einblicke in kognitive Prozesse und emotionale Zustände',
      'Wenige Testpersonen reichen oft aus (5-8), um 80% der Probleme zu finden'
    ],
    cons: [
      'Die Situation ist künstlich (man redet selten allein mit dem Computer)',
      'Kann die kognitive Belastung erhöhen und das Verhalten verlangsamen',
      'Schwer quantitativ auswertbar'
    ]
  },
  {
    id: 'heuristic',
    title: 'Heuristische Evaluation',
    icon: '🔍',
    shortDesc: 'Kein User-Test, sondern eine Inspektion durch Fachleute. UX-Profis prüfen das Interface anhand anerkannter Regeln.',
    fullDesc: 'Bei der heuristischen Evaluation prüfen 3–5 Fachleute für Usability das Interface unabhängig voneinander anhand eines Sets von anerkannten Gestaltungsregeln (Heuristiken, z. B. nach Nielsen). Sie durchlaufen typische Aufgabenpfade und notieren jeden Verstoß gegen diese Regeln samt Schweregrad.',
    output: 'Verstoß gegen Heuristik #4 (Konsistenz) auf Seite 3: Der „Speichern“-Button ist hier rot statt grün.',
    pros: [
      'Sehr schnell und vergleichsweise kostengünstig (keine Probandenrekrutierung)',
      'Identifiziert viele „kleine“ Probleme und Inkonsistenzen',
      'Gut in frühen Entwicklungsphasen einsetzbar'
    ],
    cons: [
      'Findet oft „False Positives“ (Probleme, die echte Nutzende gar nicht stören)',
      'Hängt stark von der Expertise der Evaluatoren ab',
      'Keine „echten“ Nutzerdaten oder Überraschungsmomente'
    ]
  },
  {
    id: 'focus-group',
    title: 'Fokusgruppen',
    icon: '👥',
    shortDesc: 'Moderierte Gruppendiskussion (5-10 Personen) über Einstellungen, Wünsche und Meinungen zu einem Konzept.',
    fullDesc: 'Fokusgruppen sind eine qualitative Methode, die primär in frühen Phasen (Requirements Engineering) genutzt wird. Eine Person moderiert eine Diskussion, um die Einstellungen, Bedürfnisse und das Vokabular der Zielgruppe zu verstehen. Wichtig: Fokusgruppen sind KEIN Usability-Test. Menschen sagen oft das eine, tun aber das andere.',
    output: '„Die Teilnehmenden waren sich einig, dass Datenschutz wichtiger ist als Komfortfunktionen.“',
    pros: [
      'Synergieeffekte: Aussagen einer Person regen andere an',
      'Schneller Überblick über Meinungen und Sprache der Nutzenden',
      'Hilft beim Verständnis von sozialen Normen und Akzeptanz'
    ],
    cons: [
      'Groupthink: Dominante Persönlichkeiten beeinflussen die Meinung der Gruppe',
      'Nicht geeignet für Usability-Tests (Verhalten wird nicht beobachtet)',
      'Ergebnisse schwer verallgemeinerbar (nicht repräsentativ)'
    ]
  },
  {
    id: 'diary-study',
    title: 'Tagebuchstudie',
    icon: '📓',
    shortDesc: 'Nutzende protokollieren ihre Interaktionen über einen längeren Zeitraum (Tage/Wochen) in ihrem natürlichen Umfeld.',
    fullDesc: 'Bei einer Diary Study dokumentieren Teilnehmende ihre Erlebnisse mit einem Produkt in ihrem Alltag, oft unterstützt durch Fotos oder Sprachnotizen. Diese Methode ist ideal, um Nutzungsgewohnheiten, Langzeiteffekte und den Einfluss des Kontexts (z. B. Nutzung im Bus vs. daheim) zu erforschen, was im Labor unmöglich wäre.',
    output: '„Tag 3: Ich wollte die App nutzen, aber in der prallen Sonne war das Display nicht lesbar.“',
    pros: [
      'Erfasst den realen Nutzungskontext und Langzeiteffekte',
      'Minimiert den Einfluss des Versuchsleiters (Beobachtereffekt)',
      'Zeigt, wie sich Gewohnheiten bilden (Onboarding vs. Expertennutzung)'
    ],
    cons: [
      'Hohe Abbruchquote bei Teilnehmenden (großer Aufwand)',
      'Datenanalyse ist sehr zeitaufwendig',
      'Erinnerungsverzerrung, wenn Einträge nicht sofort gemacht werden'
    ]
  },
  {
    id: 'survey',
    title: 'Quant. Umfragen (Survey)',
    icon: '📝',
    shortDesc: 'Standardisierte Fragebögen (z. B. SUS, UEQ) zur Messung der Zufriedenheit und subjektiven Wahrnehmung.',
    fullDesc: 'Quantitative Befragungen nutzen validierte Fragebögen wie den System Usability Scale (SUS) oder den User Experience Questionnaire (UEQ). Sie werden oft nach einem Usability-Test oder online eingesetzt, um eine messbare Größe (Score) zu erhalten. Diese Scores eignen sich hervorragend für Benchmarking (Vergleich Vorher/Nachher).',
    output: 'SUS Score: 78/100 (Note B). Der hedonische Wert ist im Vergleich zur Vorversion um 15% gestiegen.',
    pros: [
      'Kostengünstig große Stichproben erreichbar (statistische Signifikanz)',
      'Standardisierte Scores erlauben Vergleichbarkeit (Benchmarking)',
      'Schnelle Auswertung durch Tools möglich'
    ],
    cons: [
      'Liefert keine Erklärungen für schlechte Werte („Warum?“ fehlt)',
      'Selbstauskunft ist oft ungenau (subjektive Wahrnehmung ≠ objektive Leistung)',
      'Gefahr von missverständlichen Formulierungen bei eigenen Fragen'
    ]
  },
  {
    id: 'card-sorting',
    title: 'Card Sorting',
    icon: '🃏',
    shortDesc: 'Nutzende sortieren Begriffe in Kategorien. Essentiell für den Aufbau einer intuitiven Informationsarchitektur (Menüs).',
    fullDesc: 'Beim Card Sorting erhalten Nutzende Kärtchen mit Begriffen (z. B. Produktnamen) und sollen diese in Gruppen sortieren, die für sie Sinn ergeben. Beim „Open Card Sorting“ benennen sie die Kategorien selbst, beim „Closed Card Sorting“ sind Kategorien vorgegeben. Das Ergebnis hilft, Menüstrukturen zu entwickeln, die dem mentalen Modell der Nutzenden entsprechen.',
    output: '85% der Nutzenden suchen „Rücksendungen“ unter „Kundenservice“, nicht unter „Mein Konto“.',
    pros: [
      'Hilft, die Informationsarchitektur (IA) nutzerzentriert aufzubauen',
      'Deckt Missverständnisse bei Bezeichnungen (Wording) auf',
      'Einfach und kostengünstig durchzuführen'
    ],
    cons: [
      'Betrachtet nur die Struktur, nicht die Interaktion oder das Design',
      'Ergebnisse können sehr streuen und schwer zu vereinheitlichen sein',
      'Zeitaufwendige Analyse ohne digitale Tools'
    ]
  },
  {
    id: 'ab-testing',
    title: 'A/B Testing',
    icon: '⚖️',
    shortDesc: 'Zwei Varianten (A und B) werden live ausgespielt. Gemessen wird, welche Variante besser konvertiert.',
    fullDesc: 'A/B-Testing (Split Testing) ist eine quantitative Methode, bei der der Nutzerverkehr zufällig auf zwei (oder mehr) Versionen einer Seite aufgeteilt wird. Version A ist meist das Original (Kontrollgruppe), Version B enthält eine Änderung (z. B. anderer Button-Text). Durch statistische Analyse wird ermittelt, welche Version das Unternehmensziel (Conversion, Klickrate) besser erfüllt.',
    output: 'Variante B (Roter Button) erzielte eine 15% höhere Anmelderate als Variante A (Blauer Button).',
    pros: [
      'Misst tatsächliches Verhalten, keine Meinungen',
      'Liefert statistisch signifikante, „harte“ Zahlen für das Management',
      'Geringes Risiko, da Änderungen nur einem Teil der Nutzenden gezeigt werden'
    ],
    cons: [
      'Erklärt nicht das „Warum“ (nur das „Was“)',
      'Benötigt viel Traffic für signifikante Ergebnisse',
      'Testet immer nur isolierte Änderungen (lokales Maximum), keine kompletten Redesigns'
    ]
  },
  {
    id: 'eye-tracking',
    title: 'Eye Tracking',
    icon: '👀',
    shortDesc: 'Spezielle Kameras zeichnen auf, wohin Nutzende schauen (Fixationen) und wie sich der Blick bewegt (Sakkaden).',
    fullDesc: 'Eye Tracking misst physiologische Augenbewegungen. Es zeigt objektiv, welche Elemente Aufmerksamkeit erregen und welche übersehen werden. Ergebnisse werden oft als „Heatmaps“ (heiße Zonen = viel Aufmerksamkeit) oder „Gaze Plots“ (Reihenfolge der Blicke) visualisiert. Es unterscheidet zwischen Fixationen (Aufnahme von Information) und Sakkaden (schnelle Augenbewegung).',
    output: 'Heatmap zeigt: 90% der Nutzenden schauen auf das Gesicht des Models, aber niemand liest die Headline daneben.',
    pros: [
      'Objektive Daten über unbewusste Aufmerksamkeit',
      'Deckt auf, wenn Elemente ignoriert werden (Banner Blindness)',
      'Beeindruckende Visualisierungen (Heatmaps)'
    ],
    cons: [
      'Teures Equipment und aufwendige Auswertung',
      'Blickrichtung heißt nicht immer Verständnis (man kann auch „leer“ starren)',
      'Kalibrierung kann bei Brillenträgern schwierig sein'
    ]
  }
];

export const EvaluationView: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<EvaluationMethod | null>(null);
  const [comparisonList, setComparisonList] = useState<string[]>([]);

  const toggleComparison = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComparisonList(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const comparedMethods = EVALUATION_METHODS.filter(m => comparisonList.includes(m.id));
  const remainingSlots = 3 - comparisonList.length;

  return (
    <div className="space-y-20 animate-fade-in max-w-6xl mx-auto pb-20">
      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scaleUp 0.3s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
      <header className="border-b border-stone-200 pb-8">
        <span className="inline-block px-3 py-1 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">
          Phase 4
        </span>
        <h2 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600">Evaluation & Methoden</h2>
        <p className="text-stone-600 mt-4 text-lg font-light max-w-3xl">
          „When you cannot measure, your knowledge is of a meager and unsatisfactory kind.“ — Lord Kelvin (1883)
        </p>
      </header>
      <aside aria-labelledby="ev-deeper-title" className="grid md:grid-cols-[1.1fr_1fr] overflow-hidden rounded-2xl border border-orange-200 bg-orange-50">
        <div className="p-7 md:p-9 flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-700">Weiter vertiefen · Lernmodul 07</p>
          <h3 id="ev-deeper-title" className="mt-2 text-2xl md:text-3xl font-bold text-stone-900 leading-tight">UX &amp; Evaluation mobiler Apps</h3>
          <p className="mt-3 text-stone-700 leading-relaxed">
            Diese Seite gibt den Überblick über die Methoden. Wie Sie eine eigene App Schritt für Schritt evaluieren, zeigt das Lernmodul 07: heuristische Evaluation im Team, Usability-Tests mit Smartphone, SUS und UEQ auswerten, Befunde priorisieren und einen Testplan erstellen. Mit Fragebogen-Vorlagen zum Herunterladen und einem Werkzeug für Ihre eigenen Testdaten.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="../ux-evaluation/" className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-bold text-white hover:bg-cta-hover transition-colors">
              Zum Lernmodul 07 <span aria-hidden="true">→</span>
            </a>
            <a href="../ux-evaluation/#messen" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-bold text-stone-800 hover:border-stone-500 transition-colors">
              Fragebögen und Vorlagen
            </a>
          </div>
        </div>
        <div className="relative hidden md:block h-full">
          <KiBadge />
          <img src="../ux-evaluation/media/tile-testen.jpg" alt="" width="800" height="600" loading="lazy" className="block h-full w-full object-cover" />
        </div>
      </aside>

      {/* Intro Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">Warum evaluieren wir?</h3>
          <p className="text-stone-600 leading-relaxed mb-6">
            Die Evaluation ist der kritische Moment der Wahrheit im User Centered Design Prozess. Hier wird der „Genaue Prototyp“ getestet, indem Testpersonen diesen verwenden.
          </p>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded border border-stone-200 shadow-sm">
              <span className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Validierung von</span>
              <ul className="list-disc list-inside text-stone-800 font-medium space-y-1">
                <li>Produkten</li>
                <li>Ideen & Visionen</li>
                <li>Hypothesen</li>
              </ul>
            </div>
            <div className="bg-stone-100 p-6 rounded border border-stone-200">
               <span className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Generierung von Wissen über</span>
               <ul className="list-disc list-inside text-stone-700 space-y-1">
                <li>Designprinzipien</li>
                <li>Theorien menschlichen Verhaltens</li>
               </ul>
            </div>
          </div>
        </div>
        
        {/* Quote Block or Key Visual */}
        <div className="flex flex-col justify-center h-full bg-stone-50 border-l-4 border-stone-900 p-8">
            <p className="text-xl font-serif italic text-stone-800 mb-4">
              „Du bist nicht der Nutzer.“
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              Dieses Mantra ist der wichtigste Grund für Evaluation. Als Gestaltende und Entwickelnde haben wir zu viel Vorwissen über unser eigenes System (Betriebsblindheit). Nur echte Nutzende offenbaren die wahren Probleme.
            </p>
        </div>
      </section>

      {/* NEW: Types of Evaluation */}
      <section>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-8 pb-4 border-b border-stone-200">
          Arten der Evaluation
        </h3>
        
        {/* Formative vs Summative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-stone-50 border border-stone-200 p-8 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🌱</div>
             <h4 className="text-xl font-bold text-stone-900 mb-2">Formative Evaluation</h4>
             <p className="text-stone-500 font-bold text-xs uppercase tracking-widest mb-4">„Während der Gestaltung“</p>
             <p className="text-stone-700 mb-4 leading-relaxed">
               Findet <strong>begleitend</strong> zum Designprozess statt. Ziel ist es, Probleme früh zu finden und das Design iterativ zu verbessern.
             </p>
             <div className="bg-white p-3 rounded text-sm text-stone-900 border border-stone-100">
               <span className="font-bold">Beispiel:</span> Testen von Papier-Skizzen (Low-Fidelity), um Navigationskonzepte zu prüfen.
             </div>
          </div>

          <div className="bg-stone-100 border border-stone-200 p-8 rounded-xl relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🏁</div>
             <h4 className="text-xl font-bold text-stone-900 mb-2">Summative Evaluation</h4>
             <p className="text-stone-500 font-bold text-xs uppercase tracking-widest mb-4">„Am Ende der Entwicklung“</p>
             <p className="text-stone-700 mb-4 leading-relaxed">
               Findet <strong>abschließend</strong> statt. Ziel ist die Bewertung der Gesamtqualität oder der Vergleich mit Konkurrenzprodukten (Benchmarking).
             </p>
             <div className="bg-white p-3 rounded text-sm text-stone-900 border border-stone-100">
               <span className="font-bold">Beispiel:</span> Finale Abnahmeprüfung vor dem Release der App im App Store.
             </div>
          </div>
        </div>

        {/* Qual vs Quant */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-stone-200 rounded-lg overflow-hidden">
           <div className="p-8 bg-white border-b md:border-b-0 md:border-r border-stone-200">
              <h4 className="font-serif font-bold text-2xl text-stone-900 mb-2">Qualitativ</h4>
              <p className="text-stone-500 italic mb-6">„Warum passiert das?“</p>
              <ul className="space-y-3 text-stone-700">
                <li className="flex items-start gap-3">
                  <span className="text-stone-400">➢</span>
                  <span>Fokus auf Einblicke, Motivationen und Hintergründe.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stone-400">➢</span>
                  <span>Kleine Stichprobe (z. B. 5–8 Testpersonen).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stone-400">➢</span>
                  <span>Ergebnis: Zitate, Problembeschreibungen.</span>
                </li>
              </ul>
           </div>
           <div className="p-8 bg-stone-50">
              <h4 className="font-serif font-bold text-2xl text-stone-900 mb-2">Quantitativ</h4>
              <p className="text-stone-500 italic mb-6">„Wie viele / Wie oft?“</p>
              <ul className="space-y-3 text-stone-700">
                <li className="flex items-start gap-3">
                  <span className="text-stone-400">➢</span>
                  <span>Fokus auf messbare Zahlen und Statistik.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stone-400">➢</span>
                  <span>Große Stichprobe (z. B. &gt;30 Testpersonen).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stone-400">➢</span>
                  <span>Ergebnis: Erfolgsraten, Zeitmessung (Time-on-Task).</span>
                </li>
              </ul>
           </div>
        </div>
      </section>

      {/* NEW: Methods Toolbox (Interactive) */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-4 border-b border-stone-200 gap-4">
            <div>
              <h3 className="text-3xl font-serif font-bold text-stone-900">
                Methoden-Koffer
              </h3>
              <p className="text-stone-600 mt-2">
                {comparisonList.length === 0 
                  ? "Wählen Sie bis zu 3 Methoden für einen direkten Vergleich aus." 
                  : comparisonList.length === 3 
                    ? "Maximum erreicht. Entfernen Sie eine Methode, um eine andere zu wählen."
                    : `Sie können noch ${remainingSlots} weitere Methode${remainingSlots !== 1 ? 'n' : ''} auswählen.`
                }
              </p>
            </div>
            
            {/* Visual Counter */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3].map(slot => (
                   <div 
                     key={slot} 
                     className={`w-3 h-3 rounded-full transition-all ${
                       slot <= comparisonList.length ? 'bg-stone-900 scale-110' : 'bg-stone-200'
                     }`}
                     aria-hidden="true"
                   />
                ))}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 ml-2">
                {comparisonList.length} / 3 Ausgewählt
              </span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EVALUATION_METHODS.map((method) => {
            const isSelected = comparisonList.includes(method.id);
            const isDisabled = !isSelected && comparisonList.length >= 3;

            return (
              <div
                key={method.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedMethod(method)}
                className={`
                  relative text-left border p-6 rounded-lg transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:outline-none cursor-pointer
                  ${isSelected 
                     ? 'border-stone-900 bg-stone-50 shadow-md ring-1 ring-stone-900' 
                     : 'border-stone-200 bg-white hover:border-stone-900 hover:shadow-lg'
                  }
                  ${isDisabled ? 'opacity-60 grayscale-[0.5]' : ''} 
                `}
                aria-label={`Details zu ${method.title} öffnen`}
              >
                {/* Comparison Toggle */}
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={(e) => toggleComparison(method.id, e)}
                    disabled={isDisabled}
                    className={`
                      px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border transition-all
                      ${isSelected 
                        ? 'bg-cta text-white border-cta hover:bg-cta-hover' 
                        : isDisabled
                          ? 'bg-stone-100 text-stone-500 border-stone-200 cursor-not-allowed'
                          : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-900'}
                    `}
                  >
                    {isSelected ? 'Vergleichen ✓' : 'Vergleichen +'}
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-4 pr-20">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors
                    ${isSelected ? 'bg-white border border-stone-200' : 'bg-stone-100 group-hover:bg-stone-900 group-hover:text-white'}
                  `}>
                    {method.icon}
                  </div>
                  <h4 className="font-bold text-lg text-stone-900 group-hover:underline decoration-2 underline-offset-4">{method.title}</h4>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  {method.shortDesc}
                </p>
                <div className={`text-xs border p-2 rounded font-mono flex justify-between items-center transition-colors
                   ${isSelected 
                     ? 'bg-white border-stone-200 text-stone-800'
                     : 'bg-stone-50 border-stone-100 text-stone-500 group-hover:bg-stone-100 group-hover:text-stone-800'
                   }
                `}>
                   <span>Details ansehen</span>
                   <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPARISON VIEW */}
      {comparisonList.length > 0 && (
        <section className="bg-stone-50 border border-stone-200 rounded-xl p-6 md:p-8 animate-slide-up scroll-mt-24" id="comparison-view">
           <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
             <h3 className="text-2xl font-serif font-bold text-stone-900">Methoden-Vergleich</h3>
             <button 
               onClick={() => setComparisonList([])}
               className="text-xs font-bold text-stone-400 hover:text-red-500 uppercase tracking-widest transition-colors"
             >
               Auswahl löschen
             </button>
           </div>
           
           <div className={`grid grid-cols-1 md:grid-cols-${Math.max(2, comparedMethods.length)} gap-8`}>
             {comparedMethods.map(method => (
               <div key={method.id} className="bg-white p-6 rounded-lg shadow-sm border border-stone-100 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="text-2xl">{method.icon}</span>
                     <h4 className="font-bold text-lg text-stone-900">{method.title}</h4>
                  </div>
                  <p className="text-sm text-stone-600 mb-6 italic border-b border-stone-100 pb-4">
                    {method.shortDesc}
                  </p>
                  
                  <div className="space-y-6 flex-1">
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Vorteile</h5>
                      <ul className="space-y-1">
                        {method.pros.slice(0, 2).map((p, i) => (
                          <li key={i} className="text-xs text-stone-700 flex items-start gap-1">
                            <span>•</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-2">Nachteile</h5>
                      <ul className="space-y-1">
                        {method.cons.slice(0, 2).map((p, i) => (
                          <li key={i} className="text-xs text-stone-700 flex items-start gap-1">
                            <span>•</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                       <h5 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Output Bsp.</h5>
                       <p className="text-xs font-serif italic text-stone-800 bg-stone-50 p-2 rounded">
                         {method.output}
                       </p>
                    </div>
                  </div>
               </div>
             ))}
           </div>
        </section>
      )}

      {/* Modal Overlay */}
      {selectedMethod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedMethod(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-scale-up border border-stone-200 flex flex-col">
            
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-stone-100 p-6 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center text-2xl">
                  {selectedMethod.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-stone-900">{selectedMethod.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMethod(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-900"
                aria-label="Schließen"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 space-y-8">
              
              <div>
                <p className="text-lg leading-relaxed text-stone-700">
                  {selectedMethod.fullDesc}
                </p>
              </div>

              {/* Example Box */}
              <div className="bg-stone-50 p-6 rounded-lg border-l-4 border-stone-900">
                <h5 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Typischer Output</h5>
                <p className="font-serif italic text-stone-800 text-lg">
                  {selectedMethod.output}
                </p>
              </div>

              {/* Pros & Cons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h5 className="flex items-center gap-2 font-bold text-emerald-700 mb-4 border-b border-emerald-100 pb-2">
                     <span className="text-emerald-500">✚</span> Vorteile
                   </h5>
                   <ul className="space-y-2">
                     {selectedMethod.pros.map((pro, i) => (
                       <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
                         <span className="text-emerald-500 mt-1">•</span>
                         {pro}
                       </li>
                     ))}
                   </ul>
                </div>
                <div>
                   <h5 className="flex items-center gap-2 font-bold text-rose-700 mb-4 border-b border-rose-100 pb-2">
                     <span className="text-rose-500">−</span> Nachteile
                   </h5>
                   <ul className="space-y-2">
                     {selectedMethod.cons.map((con, i) => (
                       <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
                         <span className="text-rose-500 mt-1">•</span>
                         {con}
                       </li>
                     ))}
                   </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Correlation vs Causality (Existing) */}
      <section className="pt-8 border-t border-stone-200">
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-8">Datenanalyse: Vorsicht vor Fehlschlüssen</h3>
        <div className="bg-white border border-stone-200 text-stone-800 p-8 md:p-10 rounded-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-xl font-bold uppercase tracking-wider">Korrelation ≠ Kausalität</h3>
            </div>
            
            <p className="text-stone-600 mb-6 leading-relaxed">
              Nur weil zwei Kurven ähnlich aussehen, hängen sie nicht zwangsläufig zusammen.
            </p>

            <div className="bg-stone-50 p-4 rounded mb-6 border border-stone-200">
              <p className="text-xs text-stone-600 uppercase tracking-widest mb-2">Spurious Correlation Beispiel</p>
              <div className="space-y-2 font-mono text-sm">
                 <div className="flex justify-between items-center text-blue-700">
                   <span>Internet Explorer Marktanteil</span>
                   <span className="h-[2px] w-12 bg-blue-500 inline-block"></span>
                   <span>📉 sinkend</span>
                 </div>
                 <div className="flex justify-between items-center text-red-700">
                   <span>Mordrate in den USA</span>
                   <span className="h-[2px] w-12 bg-red-500 inline-block"></span>
                   <span>📉 sinkend</span>
                 </div>
              </div>
              <p className="mt-3 text-xs text-stone-600 italic">
                Verursacht der IE Morde? Nein. (Quelle: chrisblattman.com)
              </p>
            </div>

            <p className="text-sm text-stone-500 border-l-2 border-yellow-500 pl-4">
              <strong className="text-stone-800">Kausalität</strong> bedeutet, dass ein Ereignis durch ein anderes Ereignis tatsächlich <span className="underline decoration-yellow-500 underline-offset-4">verursacht</span> wurde.
            </p>
          </div>
           {/* Decorative Chart Background */}
           <div className="absolute -bottom-10 -right-10 opacity-10 w-64 h-40">
              <svg viewBox="0 0 100 50" className="w-full h-full stroke-white fill-none stroke-2">
                <path d="M0,50 Q25,10 50,30 T100,0" />
                <path d="M0,45 Q25,5 50,25 T100,5" className="stroke-dashed opacity-50" />
              </svg>
           </div>
        </div>
      </section>

      {/* Bradford Hill Criteria */}
      <section>
        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-8 pb-4 border-b border-stone-200">
          Die Bradford-Hill-Kriterien
          <span className="block text-sm font-sans font-normal text-stone-500 mt-1">9 Grundsätze für den Nachweis von Kausalität</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[
             { title: "Stärke der Assoziation", desc: "Wie groß ist der Effekt? (z. B. Starkes relatives Risiko beim Rauchen)." },
             { title: "Konsistenz", desc: "Ist das Ergebnis reproduzierbar? Tritt es in verschiedenen Studien auf?" },
             { title: "Spezifität", desc: "Verursacht die Ursache *nur* dieses Ergebnis? (Oft schwer zu erfüllen)." },
             { title: "Zeitliche Sequenz", desc: "Kommt die Ursache (Exposition) zwingend *vor* der Wirkung?" },
             { title: "Dosis-Wirkungs-Beziehung", desc: "Führt mehr Exposition zu einem stärkeren Ergebnis?" },
             { title: "Plausibilität", desc: "Ergibt der Zusammenhang biologisch oder logisch Sinn?" },
             { title: "Kohärenz", desc: "Passt es zum allgemeinen Wissen der Wissenschaft?" },
             { title: "Experimentelle Evidenz", desc: "Kann es durch kontrollierte Experimente bestätigt werden?" },
             { title: "Analogie", desc: "Gibt es ähnliche Zusammenhänge in anderen Bereichen?" }
           ].map((item, idx) => (
             <div key={idx} className="p-6 border border-stone-200 hover:border-stone-400 transition-all bg-white group">
                <span className="text-xs font-bold text-stone-400 group-hover:text-stone-900 mb-2 block font-mono">0{idx + 1}</span>
                <h4 className="font-bold text-stone-900 mb-2">{item.title}</h4>
                <p className="text-sm text-stone-600">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Survivorship Bias */}
      <section className="bg-stone-100 rounded-2xl p-8 md:p-16 text-center relative overflow-hidden">
         <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl font-serif font-bold text-stone-900 mb-4">Survivorship Bias</h3>
            <p className="text-lg text-stone-700 mb-8 leading-relaxed">
              Ein logischer Fehler, bei dem man sich auf die Menschen oder Dinge konzentriert, die einen Prozess „überlebt“ haben, und dabei diejenigen übersehen, die dies nicht taten.
            </p>
            
            {/* Plane Visualization using CSS grid */}
            <div className="bg-white p-8 rounded-xl shadow-lg inline-block mb-8 relative">
                <div className="w-48 h-48 mx-auto relative opacity-80" aria-label="Grafik eines Flugzeugs mit roten Punkten an Flügeln und Rumpf, aber nicht an Triebwerken oder Cockpit.">
                  {/* Abstract Plane SVG */}
                  <svg viewBox="0 0 200 200" className="w-full h-full fill-stone-200 stroke-stone-400 stroke-2">
                     <path d="M100,20 L120,60 L190,80 L120,100 L120,160 L150,180 L50,180 L80,160 L80,100 L10,80 L80,60 Z" />
                  </svg>
                  {/* Red Dots (Hits on returning planes) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-full h-full relative">
                        {/* Wing hits */}
                        <span className="absolute top-[40%] left-[10%] w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="absolute top-[42%] left-[15%] w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="absolute top-[38%] left-[20%] w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="absolute top-[40%] right-[10%] w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="absolute top-[42%] right-[15%] w-2 h-2 bg-red-500 rounded-full"></span>
                        {/* Tail hits */}
                        <span className="absolute bottom-[10%] left-[45%] w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="absolute bottom-[12%] right-[45%] w-2 h-2 bg-red-500 rounded-full"></span>
                        {/* Center Body hits */}
                        <span className="absolute top-[50%] left-[48%] w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="absolute top-[60%] left-[52%] w-2 h-2 bg-red-500 rounded-full"></span>
                     </div>
                  </div>
                </div>
                <p className="text-xs text-stone-500 mt-4 font-mono uppercase tracking-widest">
                  Fehlschluss: "Wir müssen die Flügel verstärken!" <br/>
                  Realität: Die Treffer am Cockpit/Motor kamen nie zurück.
                </p>
            </div>
         </div>
      </section>

      <aside className="rounded-2xl border border-stone-200 bg-white p-7 flex flex-col md:flex-row md:items-center gap-5 justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-700">Nächster Schritt</p>
          <p className="mt-1 text-lg font-bold text-stone-900">Ihre eigene App evaluieren: Lernmodul 07 · UX &amp; Evaluation</p>
          <p className="mt-1 text-stone-600">Sechs Übungen vom Daumenzonen-Check bis zum fertigen Testplan.</p>
        </div>
        <a href="../ux-evaluation/" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-bold text-white hover:bg-cta-hover transition-colors">
          Modul öffnen <span aria-hidden="true">→</span>
        </a>
      </aside>
    </div>
  );
};
