
import React, { useState, useEffect } from 'react';
import { NIELSEN_HEURISTICS } from '../constants';

// --- Visualisierungen für die Heuristiken ---

// 1. Sichtbarkeit des Systemstatus
const SystemStatusVisual = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'loading') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('success');
            return 100;
          }
          return prev + 2; // Speed of loading
        });
      }, 30);
      return () => clearInterval(interval);
    }
    if (status === 'idle') setProgress(0);
  }, [status]);

  return (
    <div className="h-40 bg-stone-50 border border-stone-200 rounded-lg flex flex-col items-center justify-center p-6 select-none">
      {status === 'idle' && (
        <button 
          onClick={() => setStatus('loading')}
          className="bg-cta text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-cta-hover transition-colors"
        >
          Datei hochladen
        </button>
      )}
      
      {status === 'loading' && (
        <div className="w-full max-w-[200px] space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase text-stone-500">
            <span>Wird hochgeladen …</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center animate-fade-in">
          <div className="text-emerald-500 text-4xl mb-2">✓</div>
          <p className="text-sm font-bold text-stone-900">Fertig!</p>
          <button 
            onClick={() => setStatus('idle')}
            className="text-xs text-stone-400 mt-2 hover:text-stone-900 underline"
          >
            Zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
};

// 2. Übereinstimmung System & Wirklichkeit
const MatchSystemWorldVisual = () => {
  const [mode, setMode] = useState<'system' | 'world'>('world');

  return (
    <div className="h-40 bg-stone-50 border border-stone-200 rounded-lg flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
       <div className="absolute top-2 right-2 flex bg-white rounded border border-stone-200 text-[10px] font-bold uppercase">
         <button 
           onClick={() => setMode('system')}
           className={`px-2 py-1 ${mode === 'system' ? 'bg-cta text-white' : 'text-stone-400'}`}
         >
           System
         </button>
         <button 
           onClick={() => setMode('world')}
           className={`px-2 py-1 ${mode === 'world' ? 'bg-cta text-white' : 'text-stone-400'}`}
         >
           Reale Welt
         </button>
       </div>

       <div className="text-center transition-all duration-500">
         <span className="text-4xl block mb-2">{mode === 'world' ? '🗑️' : '0x1F5D1'}</span>
         <p className="font-mono text-sm bg-white border border-stone-200 px-3 py-1 rounded">
           {mode === 'world' ? 'Papierkorb' : 'Trash_Bin_Obj_REF_NULL'}
         </p>
       </div>
    </div>
  );
};

// 3. Nutzerkontrolle & Freiheit
const UserControlVisual = () => {
  const [items, setItems] = useState(['Entwurf V1', 'Logo final', 'Notizen']);
  const [deletedItem, setDeletedItem] = useState<{item: string, index: number} | null>(null);

  const handleDelete = (index: number) => {
    const item = items[index];
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setDeletedItem({ item, index });
    
    // Auto clear undo after 3 seconds
    setTimeout(() => setDeletedItem(null), 3000);
  };

  const handleUndo = () => {
    if (deletedItem) {
      const newItems = [...items];
      newItems.splice(deletedItem.index, 0, deletedItem.item);
      setItems(newItems);
      setDeletedItem(null);
    }
  };

  return (
    <div className="h-40 bg-stone-50 border border-stone-200 rounded-lg flex flex-col p-4 relative overflow-hidden">
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={item} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-stone-100 text-xs">
            <span>{item}</span>
            <button 
              onClick={() => handleDelete(idx)}
              className="text-stone-400 hover:text-red-500 px-2"
              aria-label="Löschen"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="text-center text-xs text-stone-400 mt-4">Alles leer.</p>}

      {/* Undo Toast */}
      <div className={`absolute bottom-0 left-0 right-0 bg-stone-800 text-white p-3 flex justify-between items-center transition-transform duration-300 ${deletedItem ? 'translate-y-0' : 'translate-y-full'}`}>
        <span className="text-xs">Gelöscht.</span>
        <button 
          onClick={handleUndo}
          className="text-xs font-bold uppercase tracking-wider text-orange-200 hover:text-white"
        >
          Rückgängig
        </button>
      </div>
    </div>
  );
};

// 4. Konsistenz & Standards
const ConsistencyVisual = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Intentionally confusing order vs Standard
  const standard = ["🏠 Home", "🔍 Suche", "⚙️ Settings"];
  const chaotic = ["⚙️ Config", "Startseite", "🔍 Finden"];

  const [isChaotic, setIsChaotic] = useState(false);

  return (
     <div className="h-40 bg-stone-50 border border-stone-200 rounded-lg flex flex-col justify-between p-6">
        <div className="flex justify-center gap-2 mb-4">
           <span className={`text-[10px] uppercase font-bold ${!isChaotic ? 'text-stone-900' : 'text-stone-400'}`}>Standard</span>
           <button 
             type="button"
             role="switch"
             aria-checked={isChaotic}
             aria-label="Inkonsistente Navigation zeigen"
             onClick={() => setIsChaotic(!isChaotic)}
             className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isChaotic ? 'bg-orange-500' : 'bg-stone-300'}`}
           >
              <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isChaotic ? 'translate-x-4' : 'translate-x-0'}`}></div>
           </button>
           <span className={`text-[10px] uppercase font-bold ${isChaotic ? 'text-orange-600' : 'text-stone-400'}`}>Inkonsistent</span>
        </div>

        {/* Fake Navigation Bar */}
        <div className="bg-white p-2 rounded-full shadow-sm border border-stone-100 flex justify-around items-center">
           {(isChaotic ? chaotic : standard).map((label, idx) => (
             <button
               key={idx}
               onClick={() => setActiveTab(idx)}
               className={`text-xs px-2 py-1 rounded-full transition-all ${activeTab === idx ? 'bg-cta text-white' : 'text-stone-500 hover:bg-stone-100'} ${isChaotic && idx === 1 ? 'order-last' : ''}`}
             >
               {label}
             </button>
           ))}
        </div>
        <p className="text-[10px] text-center text-stone-400 mt-2">
          {isChaotic ? "Nutzende müssen suchen (hohe kognitive Last)." : "Nutzende finden sich sofort zurecht."}
        </p>
     </div>
  );
};

// 5. Fehlervermeidung
const ErrorPreventionVisual = () => {
  const [email, setEmail] = useState("");
  const isValid = email.includes("@") && email.includes(".");

  return (
    <div className="h-40 bg-stone-50 border border-stone-200 rounded-lg flex flex-col items-center justify-center p-6 gap-3">
      <div className="w-full relative">
        <input 
          type="text" 
          aria-label="E-Mail Adresse eingeben"
          placeholder="E-Mail eingeben …"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-2 pl-3 text-sm border rounded outline-none transition-colors ${
             email.length > 0 && !isValid ? 'border-red-300 bg-red-50 text-red-900' : 'border-stone-300 focus:border-stone-900'
          }`}
        />
        {/* Helper Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
           {email.length === 0 ? '' : isValid ? '✅' : '⚠️'}
        </div>
      </div>

      <button 
        disabled={!isValid}
        className={`w-full py-2 rounded font-bold text-xs uppercase tracking-widest transition-all ${
          isValid 
            ? 'bg-cta text-white hover:bg-cta-hover shadow-md' 
            : 'bg-stone-200 text-stone-500 cursor-not-allowed'
        }`}
      >
        {isValid ? "Absenden" : "Bitte prüfen"}
      </button>
      
      <p className="text-[10px] text-stone-400 text-center">
        Der Button bleibt deaktiviert (Constraint), um Fehler zu verhindern.
      </p>
    </div>
  );
};

// 6. Erkennen statt Erinnern
const RecognitionVisual = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="h-40 bg-stone-50 border border-stone-200 rounded-lg flex flex-col p-6 gap-3 select-none relative" onClick={() => setShowHistory(false)}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <input 
          type="text"
          aria-label="Suchbegriff eingeben"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder="Suche …"
          className="w-full p-2 text-sm border border-stone-300 rounded focus:border-stone-900 outline-none"
        />
        {showHistory && (
           <div className="absolute top-full left-0 right-0 bg-white border border-stone-200 rounded mt-1 shadow-lg z-10 animate-fade-in">
             <p className="text-[10px] uppercase font-bold text-stone-400 p-2 pb-0">Zuletzt gesucht</p>
             <ul>
               {['Usability', 'Gestaltgesetze', 'ISO 9241'].map(term => (
                 <li 
                   key={term}
                   className="px-2 py-2 text-sm hover:bg-stone-100 cursor-pointer"
                   onClick={() => {
                     setSearch(term);
                     setShowHistory(false);
                   }}
                 >
                   🕒 {term}
                 </li>
               ))}
             </ul>
           </div>
        )}
      </div>
      <p className="text-[10px] text-stone-400 text-center mt-auto">
        Verlauf zeigt Optionen an, statt dass man sie tippen muss.
      </p>
    </div>
  );
};

// 7. Flexibilität und Effizienz
const FlexibilityVisual = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCount(c => c + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
     <div className="h-40 bg-stone-50 border border-stone-200 rounded-lg flex flex-col items-center justify-center p-6 gap-4">
        <div className="text-4xl font-bold text-stone-900">{count}</div>
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => setCount(c => c + 1)}
            className="bg-white border border-stone-200 px-4 py-2 rounded shadow-sm text-sm hover:bg-stone-50 active:scale-95 transition-transform"
          >
            Klick mich (+1)
          </button>
          <div className="text-xs text-stone-400 font-mono border border-stone-200 rounded px-2 py-1 bg-stone-100" title="Shortcut für Erfahrene">
            ⌘K
          </div>
        </div>
        <p className="text-[10px] text-stone-400 text-center">
          Shortcuts sind unsichtbare Beschleuniger für Erfahrene.
        </p>
     </div>
  );
};

// 8. Ästhetik und Minimalismus
const MinimalistVisual = () => {
  const [isClean, setIsClean] = useState(true);

  return (
    <div className="h-40 bg-stone-50 border border-stone-200 rounded-lg flex flex-col p-4 relative overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <button 
          onClick={() => setIsClean(!isClean)}
          className="text-[10px] font-bold uppercase bg-cta text-white px-2 py-1 rounded hover:bg-cta-hover"
        >
          {isClean ? 'Überladen zeigen' : 'Aufgeräumt zeigen'}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2 mt-4">
        <div className={`transition-all duration-500 bg-white p-4 shadow-sm border border-stone-100 rounded w-full max-w-[200px] text-center ${!isClean ? 'border-4 border-red-200 bg-yellow-50' : ''}`}>
           <h4 className={`font-bold ${!isClean ? 'text-red-600 underline decoration-wavy' : 'text-stone-900'}`}>
             {isClean ? 'Information' : '!!! WICHTIGE INFO !!!'}
           </h4>
           <p className="text-xs mt-1 text-stone-600">Das Wesentliche.</p>
           {!isClean && (
             <div className="mt-2 text-[10px] text-blue-600 space-y-1 animate-pulse">
               <p>✨ Neu!</p>
               <p>🔥 Top-Angebot!</p>
               <p>📢 Jetzt abonnieren!</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// 9. Fehlerbehebung
const ErrorHelpVisual = () => {
  const [showError, setShowError] = useState(false);
  const [goodError, setGoodError] = useState(false);

  return (
    <div className="h-40 bg-stone-50 border border-stone-200 rounded-lg flex flex-col items-center justify-center p-6 gap-3">
       <div className="flex gap-2 text-[10px] font-bold uppercase mb-2">
         <button onClick={() => { setShowError(true); setGoodError(false); }} className="bg-stone-200 px-2 py-1 rounded hover:bg-stone-300">Schlechte Meldung</button>
         <button onClick={() => { setShowError(true); setGoodError(true); }} className="bg-cta text-white px-2 py-1 rounded hover:bg-cta-hover">Gute Meldung</button>
       </div>

       {showError ? (
         <div className={`w-full p-3 rounded text-xs border ${goodError ? 'bg-red-50 border-red-200 text-red-900' : 'bg-stone-800 text-white font-mono'}`}>
           {goodError ? (
             <div>
               <p className="font-bold">Keine Verbindung</p>
               <p className="mt-1">Bitte prüfen Sie Ihr WLAN.</p>
               <button onClick={() => setShowError(false)} className="mt-2 underline">Erneut versuchen</button>
             </div>
           ) : (
             <div>
               <p>ERR_CONNECTION_REFUSED</p>
               <p>Code: 0x80048820</p>
             </div>
           )}
         </div>
       ) : (
         <div className="text-stone-400 text-4xl" aria-hidden="true">?</div>
       )}
    </div>
  );
};

// 10. Hilfe und Dokumentation
const HelpVisual = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="h-40 bg-stone-50 border border-stone-200 rounded-lg flex flex-col items-center justify-center p-6 relative">
       <div className="text-center">
         <h4 className="font-bold text-stone-900">Komplexe Funktion</h4>
         <p className="text-xs text-stone-500 mt-1">Einstellung X45-Y</p>
       </div>

       <button 
         onClick={() => setShowHelp(!showHelp)}
         className="absolute top-2 right-2 w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 text-xs font-serif font-bold"
         aria-label="Hilfe anzeigen"
       >
         i
       </button>

       {showHelp && (
         <div className="absolute inset-x-2 inset-y-2 bg-stone-900/95 text-white p-4 rounded text-xs flex flex-col justify-center animate-fade-in">
           <p className="leading-relaxed">
             Diese Einstellung reguliert die X-Achsen-Sensitivität. Standard ist 50%.
           </p>
           <button onClick={() => setShowHelp(false)} className="mt-2 self-end text-stone-400 hover:text-white uppercase font-bold text-[10px]">Schließen</button>
         </div>
       )}
    </div>
  );
};

// --- Main Component ---

export const TheoryView: React.FC = () => {
  
  const renderVisual = (id: number) => {
    switch(id) {
      case 1: return <SystemStatusVisual />;
      case 2: return <MatchSystemWorldVisual />;
      case 3: return <UserControlVisual />;
      case 4: return <ConsistencyVisual />;
      case 5: return <ErrorPreventionVisual />;
      case 6: return <RecognitionVisual />;
      case 7: return <FlexibilityVisual />;
      case 8: return <MinimalistVisual />;
      case 9: return <ErrorHelpVisual />;
      case 10: return <HelpVisual />;
      default: return null;
    }
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
      <header className="border-b border-stone-200 pb-8">
        <h2 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600">Jakob Nielsen's Heuristiken</h2>
        <p className="text-stone-600 mt-4 text-lg font-light max-w-3xl">
          Die fundamentalen Prinzipien der Usability Evaluation. Diese 10 Heuristiken dienen als Richtschnur für intuitive Interaktionsgestaltung.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12" role="list">
        {NIELSEN_HEURISTICS.map((heuristic) => (
          <div 
            key={heuristic.id} 
            className="group flex flex-col h-full border-t border-stone-200 pt-6 hover:border-stone-900 transition-colors duration-500"
            role="listitem"
          >
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-sm font-bold text-stone-400 font-mono group-hover:text-stone-900 transition-colors" aria-hidden="true">
                {String(heuristic.id).padStart(2, '0')}
              </span>
              <h3 className="text-2xl font-serif font-bold text-stone-900">{heuristic.title}</h3>
            </div>
            
            <div className="flex-1 mb-8">
              <p className="text-stone-600 leading-relaxed">
                {heuristic.description}
              </p>
            </div>

            <div className="mt-auto space-y-3">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Interaktives Beispiel</p>
              {renderVisual(heuristic.id)}
              <p className="text-xs text-stone-400 italic mt-2">
                „{heuristic.example}“
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
