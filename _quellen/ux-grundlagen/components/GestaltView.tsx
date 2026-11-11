import React, { useState, useEffect } from 'react';
import { GESTALT_PRINCIPLES } from '../constants';
import { GestaltPrinciple } from '../types';

// --- Interactive Sub-Components ---

const ProximityVisual = () => {
  const [gap, setGap] = useState(48); // Initial gap in px

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-stone-50 rounded-xl border border-stone-100 p-4 select-none">
      <div 
        className="flex transition-all duration-300 ease-out mb-8"
        style={{ gap: `${gap}px` }}
      >
        {/* Group 1 */}
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(i => <div key={`g1-${i}`} className="w-4 h-4 md:w-6 md:h-6 bg-stone-900 rounded-sm shadow-sm"></div>)}
        </div>
        {/* Group 2 */}
        <div className="grid grid-cols-2 gap-2">
           {[1, 2, 3, 4].map(i => <div key={`g2-${i}`} className="w-4 h-4 md:w-6 md:h-6 bg-stone-900 rounded-sm shadow-sm"></div>)}
        </div>
      </div>
      
      <div className="w-full max-w-xs flex items-center gap-4">
        <span className="text-xs font-bold uppercase text-stone-400">Nah</span>
        <input 
          type="range" 
          min="8" 
          max="120" 
          value={gap} 
          onChange={(e) => setGap(Number(e.target.value))}
          className="flex-1 accent-stone-900 cursor-pointer h-1 bg-stone-200 rounded-lg appearance-none"
          aria-label="Abstand zwischen Gruppen ändern"
        />
        <span className="text-xs font-bold uppercase text-stone-400">Fern</span>
      </div>
      <p className="text-xs text-stone-500 mt-3 font-mono">Abstand: {gap}px</p>
    </div>
  );
};

const SimilarityVisual = () => {
  // 0 = Circle Black, 1 = Square Border
  const [items, setItems] = useState([0, 0, 0, 1, 1, 1]); 

  const toggleItem = (index: number) => {
    const newItems = [...items];
    newItems[index] = newItems[index] === 0 ? 1 : 0;
    setItems(newItems);
  };

  const reset = () => setItems([0, 0, 0, 1, 1, 1]);

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-stone-50 rounded-xl border border-stone-100 p-4 select-none">
      <div className="flex gap-3 md:gap-4 mb-8">
        {items.map((type, i) => (
          <button 
            key={i} 
            onClick={() => toggleItem(i)}
            className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-stone-900 rounded-lg shadow-sm
              ${type === 0 ? 'bg-stone-900 rounded-full' : 'border-4 border-stone-900 bg-white rounded-md'}`}
            aria-label={type === 0 ? "Zu Quadrat ändern" : "Zu Kreis ändern"}
            title="Klicken zum Ändern"
          >
          </button>
        ))}
      </div>
      <p className="text-xs text-stone-500 mb-4 font-medium">Klicken Sie auf die Formen, um die Gruppierung zu brechen.</p>
      <button onClick={reset} className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 underline decoration-2 underline-offset-4">
        Zurücksetzen
      </button>
    </div>
  );
};

const ClosureVisual = () => {
  const [completeness, setCompleteness] = useState(50);

  // Dash pattern calculation
  // Base unit 30px works well for visual spacing
  const dashLength = (completeness / 100) * 30; 
  const gapLength = 30 - dashLength; 

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-stone-50 rounded-xl border border-stone-100 p-4 select-none">
      <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
         <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
            <circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke="#1c1917" 
              strokeWidth="6"
              strokeDasharray={`${dashLength} ${gapLength}`}
              strokeLinecap="round"
              className="transition-all duration-300 ease-linear"
            />
         </svg>
         <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none ${completeness < 30 ? 'opacity-20' : 'opacity-100'}`}>
            <span className="text-4xl font-serif font-bold text-stone-900">?</span>
         </div>
      </div>

      <div className="w-full max-w-xs flex items-center gap-4">
        <span className="text-xs font-bold uppercase text-stone-400">Offen</span>
        <input 
          type="range" 
          min="5" 
          max="100" 
          value={completeness} 
          onChange={(e) => setCompleteness(Number(e.target.value))}
          className="flex-1 accent-stone-900 cursor-pointer h-1 bg-stone-200 rounded-lg appearance-none"
          aria-label="Geschlossenheit ändern"
        />
        <span className="text-xs font-bold uppercase text-stone-400">Zu</span>
      </div>
    </div>
  );
};

const ContinuityVisual = () => {
  const [hoveredLine, setHoveredLine] = useState<1 | 2 | null>(null);

  const line1Dots = [1, 2, 3, 4, 5]; // Top-Left to Bottom-Right
  const line2Dots = [1, 2, 3, 4, 5]; // Top-Right to Bottom-Left

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-stone-50 rounded-xl border border-stone-100 relative overflow-hidden p-4 select-none">
       <div className="relative w-48 h-48">
          {/* Interaction Zones */}
          {/* Line 1 (Diagonal Down Right) */}
          <div 
             className="absolute inset-0 z-10"
             onMouseEnter={() => setHoveredLine(1)}
             onMouseLeave={() => setHoveredLine(null)}
          >
             {line1Dots.map((i) => (
                <div 
                  key={`l1-${i}`}
                  className={`absolute w-4 h-4 rounded-full transition-all duration-300 ease-out border-2 border-white
                    ${hoveredLine === 1 ? 'bg-blue-600 scale-125 z-20 shadow-lg' : 'bg-stone-400'}`}
                  style={{ 
                    top: `${(i-1)*20 + 10}%`, 
                    left: `${(i-1)*20 + 10}%`,
                    opacity: hoveredLine === 2 ? 0.2 : 1
                  }}
                />
             ))}
          </div>

          {/* Line 2 (Diagonal Down Left) */}
          <div 
             className="absolute inset-0 z-10"
             onMouseEnter={() => setHoveredLine(2)}
             onMouseLeave={() => setHoveredLine(null)}
          >
             {line2Dots.map((i) => (
                <div 
                  key={`l2-${i}`}
                  className={`absolute w-4 h-4 rounded-full transition-all duration-300 ease-out border-2 border-white
                    ${hoveredLine === 2 ? 'bg-orange-600 scale-125 z-20 shadow-lg' : 'bg-stone-400'}`}
                  style={{ 
                    top: `${(i-1)*20 + 10}%`, 
                    right: `${(i-1)*20 + 10}%`,
                    opacity: hoveredLine === 1 ? 0.2 : 1
                  }}
                />
             ))}
          </div>
          
          {/* Helper visual line when hovering */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
             <line 
               x1="10%" y1="10%" x2="90%" y2="90%" 
               stroke="#2563eb" strokeWidth="2" 
               className={`transition-opacity duration-300 ${hoveredLine === 1 ? 'opacity-40' : 'opacity-0'}`} 
             />
             <line 
               x1="90%" y1="10%" x2="10%" y2="90%" 
               stroke="#ea580c" strokeWidth="2" 
               className={`transition-opacity duration-300 ${hoveredLine === 2 ? 'opacity-40' : 'opacity-0'}`} 
             />
          </svg>
       </div>
       <p className="text-xs text-stone-500 mt-4 font-medium animate-pulse">
         {hoveredLine ? (hoveredLine === 1 ? "Linie A" : "Linie B") : "Bewegen Sie die Maus über die Punkte"}
       </p>
    </div>
  );
};

const FigureGroundVisual = () => {
  const [hasDepth, setHasDepth] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-stone-50 rounded-xl border border-stone-100 relative overflow-hidden p-4 select-none">
        {/* Background Pattern */}
        <div className="absolute inset-0 transition-all duration-700 ease-in-out" 
             style={{ 
               backgroundImage: 'radial-gradient(#44403c 1.5px, transparent 1.5px)', 
               backgroundSize: '20px 20px',
               opacity: hasDepth ? 0.15 : 0.8 // High contrast background when flat
             }}>
        </div>
        
        {/* The „Figure“ */}
        <button 
          onClick={() => setHasDepth(!hasDepth)}
          className={`relative w-32 h-32 md:w-40 md:h-40 rounded-xl flex items-center justify-center transition-all duration-500 z-10 cursor-pointer
            ${hasDepth 
              ? 'bg-stone-900 text-white shadow-2xl scale-100 rotate-0' 
              : 'bg-transparent border-4 border-stone-900 text-stone-900 shadow-none scale-90 rotate-12'}`}
        >
          <span className="font-serif italic text-2xl">
            Figur
          </span>
        </button>

        <div className="mt-8 z-20 flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-stone-200 shadow-sm">
           <span className={`text-[10px] font-bold uppercase transition-colors ${!hasDepth ? 'text-stone-900' : 'text-stone-400'}`}>Flach</span>
           <button 
             onClick={() => setHasDepth(!hasDepth)}
             className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-stone-900 ${hasDepth ? 'bg-cta' : 'bg-stone-300'}`}
             aria-label={hasDepth ? "Tiefe deaktivieren" : "Tiefe aktivieren"}
           >
             <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${hasDepth ? 'translate-x-5' : 'translate-x-0'}`}></div>
           </button>
           <span className={`text-[10px] font-bold uppercase transition-colors ${hasDepth ? 'text-stone-900' : 'text-stone-400'}`}>Tiefe</span>
        </div>
    </div>
  );
};

const ExperienceVisual = () => {
  const [learned, setLearned] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-stone-50 rounded-xl border border-stone-100 p-4 select-none">
      <div className="flex gap-8 items-center mb-8">
         <div className="flex flex-col items-center gap-2">
           <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl shadow-sm transition-colors duration-500 ${learned ? 'bg-green-600' : 'bg-red-600'}`}>
             <span role="img" aria-label="Play">▶</span>
           </div>
           <span className="text-[10px] font-bold uppercase text-stone-400">{learned ? 'Start' : 'Stop?!'}</span>
         </div>

         <div className="flex flex-col items-center gap-2">
           <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl shadow-sm transition-colors duration-500 ${learned ? 'bg-red-600' : 'bg-green-600'}`}>
             <span className="font-bold text-lg">■</span>
           </div>
           <span className="text-[10px] font-bold uppercase text-stone-400">{learned ? 'Stop' : 'Start?!'}</span>
         </div>
      </div>

      <div className="w-full max-w-xs bg-white p-4 rounded-lg border border-stone-200 text-center relative overflow-hidden">
         <p className="text-sm text-stone-600 mb-3">
           {learned 
             ? "Das gelernte Pattern: Grün = Positiv, Rot = Negativ/Stop." 
             : "Konflikt! Unsere Erfahrung sagt uns etwas anderes als die Farbe."}
         </p>
         <button 
           onClick={() => setLearned(!learned)}
           className="text-xs font-bold uppercase tracking-widest text-stone-900 underline decoration-2 underline-offset-4 hover:text-orange-600"
         >
           {learned ? "Erfahrung brechen" : "Erfahrung nutzen"}
         </button>
      </div>
    </div>
  );
};

const PragnanzVisual = () => {
  const [simplified, setSimplified] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-stone-50 rounded-xl border border-stone-100 p-4 select-none relative overflow-hidden">
       {/* Shapes Container */}
       <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
          {/* Shape 1: Square */}
          <div className={`absolute w-24 h-24 border-4 border-stone-900 transition-all duration-700 ease-in-out
             ${simplified 
               ? 'translate-x-4 translate-y-4 bg-stone-900/10' 
               : 'translate-x-0 translate-y-0 rotate-12'}`}
          ></div>
          
          {/* Shape 2: Circle */}
          <div className={`absolute w-24 h-24 border-4 border-orange-600 rounded-full transition-all duration-700 ease-in-out mix-blend-multiply
             ${simplified 
               ? '-translate-x-4 -translate-y-4 bg-orange-600/10' 
               : 'translate-x-2 translate-y-0'}`}
          ></div>
       </div>

       <div className="text-center z-10">
          <p className="text-xs text-stone-500 mb-2 font-mono h-8 flex items-center justify-center">
            {simplified 
              ? "Gehirn sieht: 1 Quadrat + 1 Kreis" 
              : "Auge sieht: Komplexe Schnittmengen"}
          </p>
          <button 
             onClick={() => setSimplified(!simplified)}
             className="bg-white border border-stone-200 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest hover:border-stone-900 transition-colors"
          >
            {simplified ? "Komplexität zeigen" : "Vereinfachen"}
          </button>
       </div>
    </div>
  );
};

// --- Perception Intro Visuals ---

const ScrambledTextVisual = () => {
  const [isScrambled, setIsScrambled] = useState(true);

  const scrambled = "Es ist estruanlich, dsas wir Wöretr acuh dnan lseen kneönn, wnen die Bshcuatben in der Mttie vrtasuchet snid.";
  const normal = "Es ist erstaunlich, dass wir Wörter auch dann lesen können, wenn die Buchstaben in der Mitte vertauscht sind.";

  return (
    <div className="bg-stone-100 p-6 rounded-lg border border-stone-200 h-full flex flex-col justify-between">
       <div>
         <h5 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Top-Down Processing</h5>
         <p className={`font-serif text-lg leading-relaxed transition-opacity duration-300 ${isScrambled ? 'text-stone-900' : 'text-stone-600'}`}>
           „{isScrambled ? scrambled : normal}“
         </p>
       </div>
       <div className="mt-4 pt-4 border-t border-stone-200 flex justify-between items-center">
          <p className="text-xs text-stone-500">
            {isScrambled ? "Wir lesen Wörter als Ganzes." : "Das Gehirn nutzt Vorwissen."}
          </p>
          <button 
            onClick={() => setIsScrambled(!isScrambled)}
            className="text-xs font-bold uppercase text-stone-900 hover:text-blue-600 underline"
          >
            {isScrambled ? "Auflösen" : "Mischen"}
          </button>
       </div>
    </div>
  );
};

const ColorContextVisual = () => {
  const [showProof, setShowProof] = useState(false);

  return (
    <div className="bg-stone-100 p-6 rounded-lg border border-stone-200 h-full flex flex-col justify-between">
      <h5 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Kontext-Abhängigkeit</h5>
      
      <div className="flex gap-4 items-center justify-center mb-4 relative">
         {/* Dark Background */}
         <div className="w-20 h-20 bg-stone-800 flex items-center justify-center rounded">
            <div className="w-8 h-8 bg-stone-500 rounded-full"></div>
         </div>
         {/* Light Background */}
         <div className="w-20 h-20 bg-white flex items-center justify-center rounded border border-stone-200">
            <div className="w-8 h-8 bg-stone-500 rounded-full"></div>
         </div>

         {/* Connection Bar (Proof) */}
         {showProof && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-2 bg-stone-500 rounded animate-fade-in z-10"></div>
         )}
      </div>

      <div className="mt-auto pt-4 border-t border-stone-200 flex justify-between items-center">
         <p className="text-xs text-stone-500">
           {showProof ? "Identischer Farbwert: #78716c" : "Welcher Kreis wirkt dunkler?"}
         </p>
         <button 
            onClick={() => setShowProof(!showProof)}
            className="text-xs font-bold uppercase text-stone-900 hover:text-blue-600 underline"
          >
            {showProof ? "Verstecken" : "Auflösen"}
          </button>
      </div>
    </div>
  );
};

// --- Practical Application Mini-Animations ---

const PracticalAnimation: React.FC<{ type: string; index: number }> = ({ type, index }) => {
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTick(prev => !prev), 2000);
    return () => clearInterval(interval);
  }, []);

  // --- PROXIMITY ---
  if (type === 'proximity') {
    if (index === 0) { // Formulare
      return (
        <div className="w-full h-full flex flex-col justify-center px-4 relative">
          <div className={`text-[10px] font-bold text-stone-400 transition-all duration-700 ease-in-out absolute left-4 ${tick ? 'top-[22%]' : 'top-[10%]'}`}>Label</div>
          <div className="w-full h-6 border border-stone-200 rounded mt-1 bg-white"></div>
          <div className="w-full h-6 border border-stone-200 rounded mt-4 bg-white"></div>
        </div>
      );
    }
    if (index === 1) { // Card Layout
      return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
          <div className="flex gap-2 items-end">
            <div className="w-8 h-8 bg-stone-200 rounded"></div>
            <div className="space-y-1">
               <div className="w-12 h-1 bg-stone-300 rounded"></div>
               <div className="w-8 h-1 bg-stone-200 rounded"></div>
            </div>
          </div>
          <div className={`h-1 bg-red-400 rounded transition-all duration-700 ${tick ? 'w-2 opacity-0' : 'w-full opacity-50'}`}></div>
           <div className="flex gap-2 items-end mt-1 opacity-50">
            <div className="w-8 h-8 bg-stone-200 rounded"></div>
             <div className="space-y-1">
               <div className="w-12 h-1 bg-stone-300 rounded"></div>
               <div className="w-8 h-1 bg-stone-200 rounded"></div>
            </div>
          </div>
        </div>
      );
    }
    if (index === 2) { // Cockpit
      return (
        <div className="flex justify-center items-center gap-1 h-full">
           <div className={`flex gap-1 transition-all duration-700 ${tick ? 'translate-x-2' : '-translate-x-1'}`}>
              <div className="w-3 h-3 bg-stone-800 rounded-full"></div>
              <div className="w-3 h-3 bg-stone-800 rounded-full"></div>
           </div>
           <div className={`w-[2px] h-6 bg-stone-200 transition-opacity duration-700 ${tick ? 'opacity-100' : 'opacity-0'}`}></div>
           <div className={`flex gap-1 transition-all duration-700 ${tick ? '-translate-x-2' : 'translate-x-1'}`}>
             <div className="w-3 h-3 bg-stone-400 rounded-sm"></div>
             <div className="w-3 h-3 bg-stone-400 rounded-sm"></div>
           </div>
        </div>
      );
    }
  }

  // --- SIMILARITY ---
  if (type === 'similarity') {
    if (index === 0) { // Navigation
      return (
        <div className="flex justify-center items-center gap-2 h-full px-4">
           <div className="w-full text-[8px] text-stone-300 leading-tight">
             Lorem ipsum <span className={`font-bold transition-colors duration-500 ${tick ? 'text-blue-600 underline' : 'text-stone-300'}`}>Link</span> dolor sit amet.
           </div>
        </div>
      );
    }
    if (index === 1) { // Kategorisierung
      return (
        <div className="flex justify-center items-center gap-2">
           <div className="w-6 h-8 bg-stone-200 rounded relative"></div>
           <div className="w-6 h-8 bg-stone-200 rounded relative">
              <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full transition-colors duration-500 ${tick ? 'bg-red-500' : 'bg-stone-300'}`}></div>
           </div>
           <div className="w-6 h-8 bg-stone-200 rounded relative"></div>
        </div>
      );
    }
    if (index === 2) { // Smart Home
       return (
         <div className="flex justify-center items-center gap-2">
            <div className={`w-6 h-6 border-2 transition-all duration-500 ${tick ? 'border-stone-900 rounded-full' : 'border-stone-400 rounded-md'}`}></div>
            <div className="w-6 h-6 border-2 border-stone-400 rounded-md"></div>
         </div>
       );
    }
  }

  // --- CLOSURE ---
  if (type === 'closure') {
    if (index === 0) { // Icons
      return (
        <div className="flex justify-center items-center h-full">
           <div className="flex flex-col gap-1 w-6">
              <div className="h-1 bg-stone-800 w-full rounded-full"></div>
              <div className="h-1 bg-stone-800 w-full rounded-full"></div>
              <div className="h-1 bg-stone-800 w-full rounded-full"></div>
           </div>
           <div className={`ml-2 text-[8px] font-mono transition-opacity duration-500 ${tick ? 'opacity-100' : 'opacity-0'}`}>
             = LISTE
           </div>
        </div>
      );
    }
    if (index === 1) { // Loading
      return (
        <div className="flex justify-center items-center h-full">
          <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
        </div>
      );
    }
    if (index === 2) { // Teaser
      return (
        <div className="px-4 py-2 h-full flex flex-col justify-center relative overflow-hidden">
           <div className="h-1 bg-stone-300 w-full mb-1"></div>
           <div className="h-1 bg-stone-300 w-3/4 mb-1"></div>
           <div className="h-1 bg-stone-300 w-full mb-1"></div>
           <div className={`absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-white to-transparent transition-opacity duration-700 ${tick ? 'opacity-90' : 'opacity-0'}`}></div>
        </div>
      );
    }
  }

  // --- CONTINUITY ---
  if (type === 'continuity') {
    if (index === 0) { // Carousel
      return (
        <div className="flex items-center gap-2 overflow-hidden px-2 h-full">
           <div className={`w-12 h-16 flex-shrink-0 bg-stone-200 rounded transition-transform duration-1000 ${tick ? '-translate-x-14' : 'translate-x-0'}`}></div>
           <div className={`w-12 h-16 flex-shrink-0 bg-stone-800 rounded transition-transform duration-1000 ${tick ? '-translate-x-14' : 'translate-x-0'}`}></div>
           <div className={`w-12 h-16 flex-shrink-0 bg-stone-200 rounded transition-transform duration-1000 ${tick ? '-translate-x-14' : 'translate-x-0'}`}></div>
        </div>
      );
    }
    if (index === 1) { // Breadcrumbs
      return (
        <div className="flex justify-center items-center gap-1 h-full">
           <div className="w-2 h-2 rounded-full bg-stone-900"></div>
           <div className="w-4 h-[1px] bg-stone-300"></div>
           <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${tick ? 'bg-stone-900' : 'bg-stone-300'}`}></div>
           <div className="w-4 h-[1px] bg-stone-300"></div>
           <div className="w-2 h-2 rounded-full bg-stone-300"></div>
        </div>
      );
    }
    if (index === 2) { // Tacho
      return (
        <div className="relative w-full h-full flex justify-center items-end pb-2">
           <div className="w-16 h-8 border-t-2 border-l-2 border-r-2 border-stone-300 rounded-t-full relative overflow-hidden">
              <div className={`absolute bottom-0 left-1/2 w-1 h-8 bg-stone-900 origin-bottom transition-transform duration-1000 ease-in-out ${tick ? 'rotate-45' : '-rotate-45'}`} style={{ marginLeft: '-2px' }}></div>
           </div>
        </div>
      );
    }
  }

  // --- FIGURE GROUND ---
  if (type === 'figure-ground') {
    if (index === 0) { // Modal
      return (
        <div className="relative w-full h-full bg-stone-100 flex items-center justify-center">
           <div className="space-y-1 w-1/2 opacity-30">
              <div className="h-1 bg-stone-400 w-full"></div>
              <div className="h-1 bg-stone-400 w-2/3"></div>
           </div>
           <div className={`absolute w-16 h-10 bg-white shadow-lg border border-stone-200 rounded flex items-center justify-center transition-all duration-500 ${tick ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
              <span className="text-[6px]">MODAL</span>
           </div>
        </div>
      );
    }
    if (index === 1) { // FAB
       return (
         <div className="relative w-full h-full flex items-end justify-end p-4">
            <div className={`w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs shadow-lg transition-all duration-500 ${tick ? 'translate-y-0 shadow-xl' : 'translate-y-1 shadow-sm'}`}>
              +
            </div>
         </div>
       );
    }
    if (index === 2) { // Map Pins
      return (
        <div className="w-full h-full relative bg-stone-100 overflow-hidden">
           {/* Fake Map Lines */}
           <div className="absolute top-4 left-0 w-full h-[1px] bg-stone-300"></div>
           <div className="absolute top-0 left-8 h-full w-[1px] bg-stone-300"></div>
           
           <div className={`absolute top-2 left-6 text-xl transition-all duration-500 ${tick ? '-translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
             📍
           </div>
        </div>
      );
    }
  }

  // --- EXPERIENCE ---
  if (type === 'experience') {
    if (index === 0) { // Floppy Disk
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
           <div className={`text-4xl transition-all duration-500 ${tick ? 'scale-110 rotate-12 text-blue-600' : 'scale-100 text-stone-800'}`}>
             💾
           </div>
        </div>
      );
    }
    if (index === 1) { // Colors
      return (
        <div className="w-full h-full flex items-center justify-center gap-2">
           <div className={`w-8 h-8 rounded-full transition-colors duration-1000 ${tick ? 'bg-red-200' : 'bg-red-600'}`}></div>
           <div className={`w-8 h-8 rounded-full transition-colors duration-1000 ${tick ? 'bg-green-600' : 'bg-green-200'}`}></div>
        </div>
      );
    }
    if (index === 2) { // Burger
      return (
         <div className="w-full h-full flex items-center justify-center">
            <div className={`flex flex-col gap-1 w-6 transition-all duration-500 ${tick ? 'rotate-90' : 'rotate-0'}`}>
               <div className="h-1 bg-stone-800 w-full rounded"></div>
               <div className="h-1 bg-stone-800 w-full rounded"></div>
               <div className="h-1 bg-stone-800 w-full rounded"></div>
            </div>
         </div>
      );
    }
  }

   // --- PRAGNANZ ---
   if (type === 'pragnanz') {
    if (index === 0) { // Logo Rings
      return (
        <div className="w-full h-full flex items-center justify-center relative">
           <div className={`w-8 h-8 border-2 border-stone-800 rounded-full absolute transition-all duration-700 ${tick ? '-translate-x-2' : 'translate-x-0'}`}></div>
           <div className={`w-8 h-8 border-2 border-stone-800 rounded-full absolute transition-all duration-700 ${tick ? 'translate-x-2' : 'translate-x-0'}`}></div>
        </div>
      );
    }
    if (index === 1) { // Wireframe
      return (
        <div className="w-full h-full p-4 flex flex-col gap-2">
           <div className="w-full h-12 border border-stone-300 flex items-center justify-center bg-stone-50">
             <div className="w-full h-[1px] bg-stone-300 rotate-12 absolute"></div>
             <div className="w-full h-[1px] bg-stone-300 -rotate-12 absolute"></div>
           </div>
           <div className="space-y-1">
             <div className="h-1 bg-stone-200 w-full"></div>
             <div className="h-1 bg-stone-200 w-2/3"></div>
           </div>
        </div>
      );
    }
    if (index === 2) { // Abstract Avatar
      return (
         <div className="w-full h-full flex items-center justify-center flex-col gap-1">
            <div className={`w-6 h-6 bg-stone-800 rounded-full transition-all duration-500 ${tick ? 'translate-y-1' : 'translate-y-0'}`}></div>
            <div className={`w-10 h-5 bg-stone-800 rounded-t-full transition-all duration-500 ${tick ? '-translate-y-1' : 'translate-y-0'}`}></div>
         </div>
      );
    }
  }

  return <div className="text-stone-300 text-xs">Demo</div>;
};

// --- Main Component ---

export const GestaltView: React.FC = () => {
  const [activePrinciple, setActivePrinciple] = useState<GestaltPrinciple>(GESTALT_PRINCIPLES[0]);

  const renderVisual = (type: string) => {
    switch (type) {
      case 'proximity': return <ProximityVisual />;
      case 'similarity': return <SimilarityVisual />;
      case 'closure': return <ClosureVisual />;
      case 'continuity': return <ContinuityVisual />;
      case 'figure-ground': return <FigureGroundVisual />;
      case 'experience': return <ExperienceVisual />;
      case 'pragnanz': return <PragnanzVisual />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6 md:mb-10 border-b border-stone-200 pb-6">
        <h2 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600">Gestaltgesetze</h2>
        <p className="text-stone-600 mt-2 text-lg">Wahrnehmungsgesetze im Interface Design</p>
      </div>

      {/* Intro Section: Perception Basics */}
      <section className="mb-12 md:mb-16">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
               <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">
                 Das Ganze ist etwas anderes als die Summe seiner Teile.
               </h3>
               <p className="text-stone-600 mb-6 leading-relaxed">
                 Der Satz stammt von Kurt Koffka und variiert das bekannte „Das Ganze ist mehr als die Summe seiner Teile“, das auf Aristoteles zurückgeführt wird. Koffka begründete mit Max Wertheimer und Wolfgang Köhler die Gestaltpsychologie der „Berliner Schule“. Unser Gehirn ist keine Kamera, die ein 1:1 Abbild der Realität speichert. Es ist ein aktiver Konstrukteur, der Chaos in Ordnung verwandelt.
               </p>
               
               <div className="space-y-6">
                 <div>
                   <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                     <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                     Bottom-Up (Reizgesteuert)
                   </h4>
                   <p className="text-sm text-stone-600 ml-4">
                     Wir nehmen rohe Daten auf (Licht, Farbe, Kanten) und setzen sie zusammen.
                   </p>
                 </div>
                 <div>
                   <h4 className="font-bold text-stone-800 mb-2 flex items-center gap-2">
                     <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                     Top-Down (Erfahrungsgesteuert)
                   </h4>
                   <p className="text-sm text-stone-600 ml-4">
                     Wir nutzen Vorwissen, Erwartungen und Kontext, um das Gesehene zu interpretieren.
                   </p>
                 </div>
               </div>
            </div>

            {/* Interactive Basics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
               <ScrambledTextVisual />
               <ColorContextVisual />
            </div>
         </div>
      </section>
      
      <div className="flex flex-col lg:flex-row gap-8 md:gap-12 flex-1 min-h-0 pt-8 border-t border-stone-200">
        {/* Navigation List - Horizontal scroll on mobile, Vertical list on desktop */}
        <div 
          className="w-full lg:w-1/4 flex lg:flex-col overflow-x-auto lg:overflow-y-auto lg:border-r border-stone-200 lg:pr-6 gap-2 lg:gap-0 pb-2 lg:pb-0 scrollbar-hide" 
          role="tablist" 
          aria-orientation="vertical"
        >
          {GESTALT_PRINCIPLES.map((principle) => (
            <button
              key={principle.id}
              role="tab"
              aria-selected={activePrinciple.id === principle.id}
              onClick={() => setActivePrinciple(principle)}
              className={`flex-shrink-0 lg:w-full text-left px-4 py-2 lg:py-4 border rounded-full lg:rounded-none lg:border-0 lg:border-b border-stone-200 transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:outline-none ${
                activePrinciple.id === principle.id
                  ? 'bg-cta text-white lg:bg-transparent lg:text-stone-900 lg:pl-4 lg:border-cta'
                  : 'bg-white text-stone-500 hover:bg-stone-50 lg:hover:pl-2'
              }`}
            >
              <h3 className={`font-serif text-sm md:text-lg ${activePrinciple.id === principle.id ? 'font-bold' : 'group-hover:text-stone-700'}`}>
                {principle.name}
              </h3>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-full lg:w-3/4 flex flex-col gap-8 md:gap-10 overflow-y-auto pb-12" role="tabpanel">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
             <div className="space-y-4 md:space-y-6 order-2 md:order-1">
                <span className="text-xs font-bold tracking-widest uppercase text-stone-500">Prinzip</span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 leading-tight">{activePrinciple.name}</h3>
                <p className="text-base md:text-lg text-stone-600 leading-relaxed font-light">
                  {activePrinciple.detailedDescription}
                </p>
             </div>
             <div className="w-full order-1 md:order-2">
                {renderVisual(activePrinciple.visualType)}
                <p className="text-center mt-4 text-xs font-mono text-stone-400 uppercase tracking-widest">
                  Interaktive Demo
                </p>
             </div>
          </div>

          <div className="border-t border-stone-200 pt-10">
            <h4 className="text-xl font-serif font-bold text-stone-900 mb-8">Praktische Anwendung</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activePrinciple.examples.map((example, idx) => (
                <div key={idx} className="bg-white p-6 rounded-sm border border-stone-100 hover:border-stone-300 transition-all group hover:shadow-lg">
                  <div className="h-24 mb-4 bg-stone-50/50 rounded border border-stone-100 overflow-hidden relative">
                    {/* Replaced Icon with Animation */}
                    <PracticalAnimation type={activePrinciple.visualType} index={idx} />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 border border-stone-200 px-2 py-1 rounded-full bg-stone-50">
                      {example.context}
                    </span>
                  </div>
                  <h5 className="font-bold text-stone-900 mb-2">{example.title}</h5>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {example.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
