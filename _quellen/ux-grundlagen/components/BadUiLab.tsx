
import React, { useState } from 'react';

type Scenario = {
  id: number;
  title: string;
  description: string;
  context: string;
  learningGoal: string;
};

const SCENARIOS: Scenario[] = [
  { 
    id: 0, 
    title: "The Placeholder Trap", 
    description: "Formulare ohne Labels. Ein modernes, aber gefährliches Pattern.", 
    context: "Login Screen v2.0",
    learningGoal: "Erkennen, warum Placeholder kein Ersatz für permanente Labels sind."
  },
  { 
    id: 1, 
    title: "Icon Roulette", 
    description: "Wenn Symbole nicht der Erwartung entsprechen.", 
    context: "Mobile App Toolbar",
    learningGoal: "Verständnis für Semiotik und mentale Modelle bei Icons."
  },
  { 
    id: 2, 
    title: "Flat Design Fail", 
    description: "Was ist klickbar und was ist Deko?", 
    context: "Pricing Table",
    learningGoal: "Differenzierung zwischen Affordance (Angebotscharakter) und Signifier (Hinweis)."
  },
  { 
    id: 3, 
    title: "The Wall of Text", 
    description: "Mangelnde visuelle Hierarchie und Lesbarkeit.", 
    context: "Terms of Service",
    learningGoal: "Bedeutung von Weißraum, Zeilenlänge und Typografie."
  },
  { 
    id: 4, 
    title: "The Roach Motel", 
    description: "Ein Dark Pattern: Einfach rein, schwer raus.", 
    context: "Unsubscribe Flow",
    learningGoal: "Identifikation von manipulativer Gestaltung (Confirmshaming, Trick Questions)."
  },
];

export const BadUiLab: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  const handleBadAction = (action: string) => {
    const messages: Record<string, string> = {
      'placeholder': "Memory Load: Sobald man tippt, verschwindet der Hinweis, was in das Feld gehört. Nutzer müssen sich erinnern.",
      'contrast': "Barrierefreiheit (WCAG): Der Kontrast zwischen Text und Hintergrund ist zu gering (< 4.5:1).",
      'ghost-button': "Hierarchie: Der primäre Button (Login) sieht aus wie ein sekundärer oder deaktivierter Button.",
      'destructive-pos': "Erwartungskonformität: 'Löschen' steht dort, wo man 'Weiter' erwartet (rechts unten).",
      'icon-semantic': "Mentales Modell: Ein 'X' wird fast immer als 'Schließen' oder 'Abbrechen' interpretiert, nicht als 'Löschen'.",
      'icon-ambiguity': "Semiotik: Das Diskettensymbol ist für Gen Z oft bedeutungslos oder wird nur abstrakt verstanden.",
      'false-affordance': "False Affordance: Das Element sieht aus wie ein Button (Schatten, Rahmen), ist aber nicht interaktiv.",
      'hidden-affordance': "Hidden Affordance: Ein Link, der wie Fließtext aussieht (keine Unterstreichung, keine Farbe), wird übersehen.",
      'center-align': "Lesbarkeit: Zentrierter Text bei mehr als 3 Zeilen erschwert den Lesefluss, da das Auge den Zeilenanfang suchen muss.",
      'line-length': "Lesbarkeit: Zu lange Zeilen (> 80 Zeichen) ermüden das Auge beim Zeilensprung.",
      'confirmshaming': "Dark Pattern (Confirmshaming): Der Text manipuliert emotional ('Nein, ich mag schlechtes Design'), um die Kündigung zu verhindern.",
      'trick-question': "Dark Pattern: Die Frage ist doppelt verneint oder verwirrend formuliert, um versehentliche Klicks zu provozieren.",
      'visual-interference': "Visuelle Interferenz: Die gewünschte Option (Kündigen) ist visuell versteckt (klein, grau), die ungewünschte (Behalten) ist prominent.",
    };

    setFeedback(messages[action] || "UX Problem erkannt.");
  };

  // Verbesserter Tooltip mit Animation
  const Tooltip = ({ text }: { text: string }) => (
    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-xl z-50 whitespace-nowrap pointer-events-none animate-in fade-in slide-in-from-bottom-2 border border-stone-700">
      {text}
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 transform rotate-45"></span>
    </span>
  );

  const highlightClass = showHints 
    ? "ring-2 ring-rose-500 ring-offset-1 bg-rose-50/50 rounded cursor-help z-10 transition-all duration-300 relative" 
    : "transition-all duration-300 relative cursor-pointer";

  const renderScenarioContent = () => {
    switch (activeScenario) {
      case 0: // The Placeholder Trap
        return (
           <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl border border-stone-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">👤</div>
                <h3 className="text-xl font-bold text-stone-800">Welcome Back</h3>
              </div>
              
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div 
                  className={highlightClass}
                  onClick={() => handleBadAction('placeholder')}
                >
                  <input 
                    type="text" 
                    placeholder="E-Mail or Username" 
                    className="w-full p-4 bg-stone-50 border-b-2 border-stone-200 focus:border-blue-500 outline-none transition-colors placeholder:text-stone-400" 
                  />
                  {showHints && <Tooltip text="Verschwindendes Label" />}
                </div>

                <div 
                  className={highlightClass}
                   onClick={() => handleBadAction('placeholder')}
                >
                  <input 
                    type="password" 
                    placeholder="Password (min. 8 chars)" 
                    className="w-full p-4 bg-stone-50 border-b-2 border-stone-200 focus:border-blue-500 outline-none transition-colors placeholder:text-stone-400" 
                  />
                  {showHints && <Tooltip text="Constraints verschwinden" />}
                </div>

                <div 
                  className={`${highlightClass} flex justify-end`}
                  onClick={() => handleBadAction('contrast')}
                >
                  <a href="#" className="text-xs text-stone-300 hover:text-stone-400">Forgot credentials?</a>
                  {showHints && <Tooltip text="Kontrast 2.1:1 (Fail)" />}
                </div>

                <div className="flex gap-4 pt-4">
                  <div className={`flex-1 ${highlightClass}`} onClick={() => handleBadAction('destructive-pos')}>
                     <button className="w-full py-3 rounded-lg bg-stone-200 text-stone-600 font-bold hover:bg-stone-300">
                       Reset
                     </button>
                     {showHints && <Tooltip text="Sekundär-Aktion prominent" />}
                  </div>
                  <div className={`flex-1 ${highlightClass}`} onClick={() => handleBadAction('ghost-button')}>
                     <button className="w-full py-3 rounded-lg border-2 border-blue-500 text-blue-500 font-bold hover:bg-blue-50">
                       Login
                     </button>
                     {showHints && <Tooltip text="Primär-Button wirkt passiv" />}
                  </div>
                </div>
              </form>
            </div>
        );
      
      case 1: // Icon Roulette
        return (
          <div className="w-full max-w-[300px] bg-white border-4 border-stone-800 rounded-[30px] overflow-hidden shadow-xl mx-auto flex flex-col h-[500px]">
             {/* Header */}
             <div className="bg-stone-800 p-4 flex justify-between items-center text-white">
                <span className="font-bold tracking-wider">APP</span>
                <div className={highlightClass} onClick={() => handleBadAction('icon-semantic')}>
                  <span className="text-xl">⚙️</span>
                  {showHints && <Tooltip text="Navigiert zu Home?" />}
                </div>
             </div>

             {/* Content */}
             <div className="flex-1 p-6 bg-stone-50 flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-24 h-24 bg-stone-200 rounded-full animate-pulse"></div>
                <div className="w-32 h-4 bg-stone-200 rounded"></div>
                <div className="w-20 h-4 bg-stone-200 rounded"></div>
             </div>
             
             {/* The Bad Toolbar */}
             <div className="bg-white border-t border-stone-200 p-2 flex justify-around items-center pb-6">
                
                {/* 1. Floppy for Delete? */}
                <div className={`flex flex-col items-center gap-1 p-2 ${highlightClass}`} onClick={() => handleBadAction('icon-ambiguity')}>
                   <div className="text-2xl text-stone-600">💾</div>
                   <span className="text-[9px] uppercase font-bold text-stone-400">Clear</span>
                   {showHints && <Tooltip text="Falsche Metapher" />}
                </div>

                {/* 2. Trash for Menu? */}
                <div className={`flex flex-col items-center gap-1 p-2 ${highlightClass}`} onClick={() => handleBadAction('icon-semantic')}>
                   <div className="text-2xl text-blue-600">🗑️</div>
                   <span className="text-[9px] uppercase font-bold text-stone-400">Menu</span>
                   {showHints && <Tooltip text="Gefährliche Assoziation" />}
                </div>

                {/* 3. X for Add? */}
                <div className={`flex flex-col items-center gap-1 p-2 ${highlightClass}`} onClick={() => handleBadAction('icon-semantic')}>
                   <div className="text-2xl text-stone-600 rotate-45">❌</div>
                   <span className="text-[9px] uppercase font-bold text-stone-400">Add</span>
                   {showHints && <Tooltip text="Inkohärente Rotation" />}
                </div>

             </div>
          </div>
        );

      case 2: // Flat Design Fail
        return (
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-stone-200 font-sans">
            <h3 className="text-center font-bold text-2xl mb-2 text-stone-800">Wählen Sie Ihren Plan</h3>
            <p className="text-center text-stone-500 mb-8 text-sm">Transparente Preise für alle.</p>
            
            <div className="flex gap-4">
               {/* Card 1: The False Affordance */}
               <div 
                 className={`flex-1 p-4 rounded-xl border border-stone-200 shadow-lg bg-gradient-to-br from-white to-stone-50 transform hover:-translate-y-1 transition-transform ${highlightClass}`}
                 onClick={() => handleBadAction('false-affordance')}
               >
                  <span className="text-xs font-bold text-blue-500 uppercase">Starter</span>
                  <div className="text-3xl font-bold text-stone-900 mt-2">Free</div>
                  <ul className="mt-4 space-y-2 text-xs text-stone-600">
                    <li>• 1 User</li>
                    <li>• 5 Projects</li>
                  </ul>
                  {/* Looks like button, is not */}
                  <div className="mt-6 py-2 w-full bg-blue-500 text-white text-center rounded text-xs font-bold shadow-md">
                    Popular Choice
                  </div>
                  {showHints && <Tooltip text="Kein Button (Label)" />}
               </div>

               {/* Card 2: The Hidden Action */}
               <div className="flex-1 p-4 rounded-xl border border-stone-200 bg-white flex flex-col">
                  <span className="text-xs font-bold text-stone-400 uppercase">Pro</span>
                  <div className="text-3xl font-bold text-stone-900 mt-2">$29</div>
                  <ul className="mt-4 space-y-2 text-xs text-stone-600 mb-6">
                    <li>• Unlimited</li>
                    <li>• Priority Support</li>
                  </ul>
                  
                  {/* The actual link looks like text */}
                  <div 
                    className={`mt-auto text-center ${highlightClass}`}
                    onClick={() => handleBadAction('hidden-affordance')}
                  >
                    <span className="text-xs font-bold text-stone-800">
                      Upgrade to Pro Plan
                    </span>
                     {showHints && <Tooltip text="Button sieht aus wie Text" />}
                  </div>
               </div>
            </div>
          </div>
        );

      case 3: // The Wall of Text
        return (
          <div className="w-full max-w-lg bg-stone-50 p-8 border border-stone-200 text-center shadow-inner">
            <h3 className="font-serif text-3xl mb-6 text-stone-900">Allgemeine Geschäftsbedingungen</h3>
            
            <div className={`bg-white p-6 border border-stone-200 text-justify ${highlightClass}`} onClick={() => handleBadAction('line-length')}>
              <p className="text-[10px] text-stone-500 leading-tight font-serif tracking-tight">
                §1 Geltungsbereich. Für die Geschäftsbeziehung zwischen dem Anbieter und dem Kunden gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung. Abweichende Bedingungen des Bestellers werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu. §2 Vertragsschluss. Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Bestellung dar. Irrtümer vorbehalten. Durch Anklicken des Buttons [Kaufen/kostenpflichtig bestellen] geben Sie eine verbindliche Bestellung der auf der Bestellseite aufgelisteten Waren ab. Der Kaufvertrag kommt zustande, wenn wir Ihre Bestellung durch eine Auftragsbestätigung per E-Mail unmittelbar nach dem Erhalt Ihrer Bestellung annehmen. §3 Widerrufsrecht. Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat. Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
              </p>
               {showHints && <Tooltip text="Zeilen > 100 Zeichen" />}
            </div>

            <div className={`mt-6 ${highlightClass}`} onClick={() => handleBadAction('center-align')}>
              <p className="text-stone-400 text-xs font-bold uppercase w-full max-w-xs mx-auto leading-relaxed">
                Durch die weitere Nutzung dieser Webseite stimmen Sie zu dass wir Ihre Daten an Drittanbieter weitergeben und Sie keine Rechte an Ihren erstellten Inhalten mehr besitzen.
              </p>
              {showHints && <Tooltip text="Zentrierter Fließtext" />}
            </div>
          </div>
        );

      case 4: // The Roach Motel
        return (
          <div className="w-full max-w-md bg-white p-6 shadow-xl border-t-4 border-stone-900 rounded-b-lg">
             <div className="text-center mb-6">
                <div className="text-4xl mb-2">😢</div>
                <h3 className="text-lg font-bold text-stone-900">Schade, dass Sie gehen!</h3>
                <p className="text-sm text-stone-500 mt-2">Sind Sie sicher, dass Sie auf Ihre Vorteile verzichten wollen?</p>
             </div>

             <div className="bg-orange-50 p-4 rounded mb-6 border border-orange-100">
               <ul className="text-xs text-orange-800 space-y-2 list-disc list-inside">
                 <li>Sie verlieren Zugriff auf 12 Projekte.</li>
                 <li>Ihre Daten werden nach 30 Tagen gelöscht.</li>
                 <li>Der Premium-Badge wird entfernt.</li>
               </ul>
             </div>

             <div className="space-y-3">
               {/* Confusing Buttons */}
               <div className={highlightClass} onClick={() => handleBadAction('visual-interference')}>
                  <button className="w-full bg-stone-900 text-white py-3 rounded font-bold shadow-lg transform hover:scale-[1.02] transition-transform">
                    Mitgliedschaft behalten
                  </button>
                  {showHints && <Tooltip text="Gewünschte Aktion visuell blockiert" />}
               </div>

               <div className={highlightClass} onClick={() => handleBadAction('trick-question')}>
                 <div className="flex items-start gap-2 p-2">
                   <input type="checkbox" id="confusing-check" className="mt-1 accent-stone-900" />
                   <label htmlFor="confusing-check" className="text-xs text-stone-500 leading-tight">
                     Ich möchte nicht, dass mein Abo nicht gekündigt wird, und verzichte auf keine Vorteile.
                   </label>
                 </div>
                 {showHints && <Tooltip text="Doppelte Verneinung" />}
               </div>

               <div className={`text-center pt-2 ${highlightClass}`} onClick={() => handleBadAction('confirmshaming')}>
                  <button className="text-xs text-stone-400 hover:text-stone-900 underline decoration-stone-300">
                    Nein, ich mag schlechtes Design und möchte kündigen.
                  </button>
                  {showHints && <Tooltip text="Confirmshaming" />}
               </div>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col pb-20">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-200 pb-8 flex-shrink-0 gap-6">
        <div className="max-w-3xl">
           <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-widest mb-4">
              Do not try this at home
           </span>
           <h2 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600 mb-4">Bad UI Laboratory</h2>
           <p className="text-stone-600 text-lg font-light leading-relaxed mb-6">
             In diesem Labor simulieren wir „Hostile Patterns“ und UX-Fehler. 
             Finden Sie heraus, warum sich diese Interfaces „falsch“ anfühlen.
           </p>
        </div>
        
        <button
            onClick={() => {
              setShowHints(!showHints);
              setFeedback("");
            }}
            className={`px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:outline-none flex items-center gap-2 ${showHints ? 'bg-cta text-white shadow-lg scale-105' : 'bg-white border-2 border-stone-200 text-stone-900 hover:border-stone-900'}`}
          >
            <span>{showHints ? "Analyse aktiv" : "Analyse starten"}</span>
            <span className="text-lg">{showHints ? "🔍" : "👁️"}</span>
          </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 flex-1 min-h-0">
        
        {/* Navigation & Controls */}
        <div className="lg:col-span-3 space-y-4">
           <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Test Szenarien</h3>
           <div className="flex flex-col gap-2">
             {SCENARIOS.map((scenario, idx) => (
               <button
                 key={scenario.id}
                 onClick={() => { setActiveScenario(idx); setFeedback(""); }}
                 className={`text-left p-4 rounded-lg transition-all border ${
                   activeScenario === idx 
                     ? 'bg-cta text-white border-cta shadow-md' 
                     : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                 }`}
               >
                 <span className="block text-[10px] uppercase font-bold opacity-70 mb-1">Szenario {idx + 1}</span>
                 <span className="font-serif font-bold text-lg">{scenario.title}</span>
               </button>
             ))}
           </div>
        </div>

        {/* The Bad Interface Container */}
        <div className="lg:col-span-6 flex flex-col" aria-label={`Szenario: ${SCENARIOS[activeScenario].title}`}>
          <div className="bg-stone-200/50 p-4 md:p-8 rounded-xl flex justify-center items-center flex-1 min-h-[500px] relative overflow-hidden transition-all duration-500 border border-stone-200">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className={`transition-all duration-500 transform ${showHints ? 'scale-95 grayscale-[0.1]' : 'scale-100'}`}>
               {renderScenarioContent()}
            </div>
            
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded border border-stone-200 text-[10px] font-mono text-stone-500">
               Context: {SCENARIOS[activeScenario].context}
            </div>
          </div>
        </div>

        {/* Feedback Panel */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <div className="bg-white p-6 border border-stone-200 h-full flex flex-col rounded-lg shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-300 ${showHints ? 'bg-rose-500' : 'bg-stone-900'}`}></div>
            
            <div className="mb-6">
              <h3 className="font-bold text-stone-900">Lernziel</h3>
              <p className="text-sm text-stone-600 mt-2 italic leading-relaxed">
                „{SCENARIOS[activeScenario].learningGoal}“
              </p>
            </div>
            
            <div className="flex-1 flex flex-col">
              {!feedback ? (
                  <div className={`flex-1 flex flex-col justify-center items-center text-center p-4 border-2 border-dashed rounded-lg transition-colors ${showHints ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-stone-100 bg-stone-50/50 text-stone-400'}`}>
                      <span className="text-3xl mb-3 opacity-50" aria-hidden="true">{showHints ? '👆' : '🔍'}</span>
                      <p className="text-xs font-medium uppercase tracking-widest">
                        {showHints ? 'Elemente anklicken für Analyse' : 'Starten Sie die Analyse'}
                      </p>
                  </div>
              ) : (
                <div className="bg-stone-50 p-4 border-l-2 border-rose-500 animate-slide-up shadow-sm rounded-r">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-2 block">
                    Fehleranalyse
                  </span>
                  <p className="text-stone-800 text-sm leading-relaxed font-medium">{feedback}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-stone-100 text-xs text-stone-400">
               <p>Klicken Sie auf rot markierte Bereiche im Modus „Analyse aktiv“, um die Erklärung zu sehen.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
