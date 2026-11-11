import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, Brain, Zap, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';

export const PerceptionView = () => {
  return (
    <div className="space-y-20 animate-fade-in max-w-6xl mx-auto pb-20">
      {/* Header */}
      <header className="border-b border-stone-200 pb-8">
        <span className="inline-block px-3 py-1 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">
          Theorie
        </span>
        <h1 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600">
          Wahrnehmung & UX
        </h1>
        <p className="text-stone-600 mt-4 text-lg font-light max-w-3xl">
          Design passiert nicht auf dem Bildschirm, sondern im Gehirn des Nutzers. 
          Wie wir Informationen aufnehmen, filtern und verarbeiten, bestimmt die Qualität der User Experience.
        </p>
      </header>

      {/* Section 1: Sensation vs Perception */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-3">
            <Eye className="text-stone-400" />
            Sehen ist Konstruktion
          </h2>
          <p className="text-stone-700 leading-relaxed mb-4">
            Unsere Augen sind keine Kameras, die ein objektives Abbild der Realität speichern. 
            Stattdessen filtert unser Gehirn massiv. Wir sehen das, was wir <strong>erwarten</strong> zu sehen (Mental Models) und das, was unsere Aufmerksamkeit auf sich zieht (Salienz).
          </p>
          <ul className="space-y-3 mt-6">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0 mt-0.5 text-stone-600 text-xs font-bold">1</div>
              <p className="text-sm text-stone-600"><strong>Bottom-Up Prozess:</strong> Reizgesteuert. Eine rote Warnfarbe zieht automatisch den Blick an.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0 mt-0.5 text-stone-600 text-xs font-bold">2</div>
              <p className="text-sm text-stone-600"><strong>Top-Down Prozess:</strong> Wissensgesteuert. Wir suchen den „Warenkorb“ oben rechts, weil wir es so gelernt haben.</p>
            </li>
          </ul>
        </div>
        <div className="bg-stone-100 rounded-xl p-8 flex items-center justify-center aspect-square md:aspect-auto h-full relative overflow-hidden">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           <div className="relative text-center">
             <div className="inline-flex gap-4 mb-4">
                <div className="w-16 h-16 bg-stone-900 rounded-full animate-pulse"></div>
                <div className="w-16 h-16 bg-stone-300 rounded-full"></div>
             </div>
             <p className="text-xs font-mono uppercase tracking-widest text-stone-500">Figur-Grund-Wahrnehmung</p>
           </div>
        </div>
      </section>

      {/* Section 2: Interactive Stroop Test */}
      <section className="bg-white border border-stone-200 rounded-2xl p-8 md:p-12 text-stone-800 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center mb-12">
          <h3 className="text-3xl font-serif font-bold mb-4">System 1 vs. System 2</h3>
          <p className="text-stone-500 mb-6">
            Daniel Kahneman unterscheidet zwei Arten des Denkens. <strong>System 1</strong> ist schnell, intuitiv und automatisch. <strong>System 2</strong> ist langsam, anstrengend und logisch. Gute UX sollte meistens System 1 ansprechen.
          </p>
          <div className="inline-block bg-stone-50 rounded-lg px-4 py-2 text-sm text-orange-600 border border-stone-200">
            Experiment: Der Stroop-Effekt
          </div>
        </div>

        <StroopTest />
      </section>

      {/* Section 3: Visual Hierarchy & Squint Test */}
      <section>
        <div className="max-w-3xl mb-10">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-3">
            <Layers className="text-stone-400" />
            Visuelle Hierarchie & Scanning
          </h2>
          <p className="text-stone-700 leading-relaxed">
            Nutzer lesen Webseiten nicht, sie scannen sie. Je nach Layout entstehen typische Muster wie das <strong>F-Pattern</strong> (bei viel Text) oder das <strong>Z-Pattern</strong> (bei strukturierten Landingpages).
            Um zu testen, ob die Hierarchie funktioniert, nutzen Designer oft den „Squint Test“ (Augen zusammenkneifen).
          </p>
        </div>

        <SquintTestSimulator />
      </section>
    </div>
  );
};

// --- Sub-Components ---

const StroopTest = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentWord, setCurrentWord] = useState({ text: '', color: '' });
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(10);
  
  const colors = [
    { name: 'ROT', value: 'text-red-400' },
    { name: 'BLAU', value: 'text-blue-400' },
    { name: 'GRÜN', value: 'text-green-400' },
    { name: 'GELB', value: 'text-yellow-400' },
  ];

  const generateRound = () => {
    const textIndex = Math.floor(Math.random() * colors.length);
    let colorIndex = Math.floor(Math.random() * colors.length);
    // Ensure cognitive dissonance mostly (80% chance), but sometimes match
    if (Math.random() > 0.3) {
        while (colorIndex === textIndex) {
            colorIndex = Math.floor(Math.random() * colors.length);
        }
    }
    setCurrentWord({
        text: colors[textIndex].name,
        color: colors[colorIndex].value
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing') {
        if (timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else {
            setGameState('result');
        }
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const startGame = () => {
    setScore({ correct: 0, total: 0 });
    setTimeLeft(10);
    generateRound();
    setGameState('playing');
  };

  const handleAnswer = (selectedColorClass: string) => {
    // Check if the selected color class matches the current word's COLOR (not text)
    const isCorrect = selectedColorClass === currentWord.color;
    setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1
    }));
    generateRound();
  };

  if (gameState === 'intro') {
      return (
          <div className="bg-stone-50 rounded-xl p-8 text-center max-w-lg mx-auto border border-stone-200 shadow-xl">
              <Brain className="w-12 h-12 text-stone-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-stone-800 mb-2">Wie gut arbeitet Ihr System 2?</h4>
              <p className="text-stone-500 mb-6 text-sm">
                  Klicken Sie auf die <strong>FARBE</strong> des Wortes, nicht auf das, was dort steht.<br/>
                  (Wenn dort <span className="text-blue-700 font-bold">ROT</span> steht, klicken Sie auf „Blau“).
              </p>
              <button 
                onClick={startGame}
                className="bg-cta hover:bg-cta-hover text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2 mx-auto"
              >
                  <Zap size={18} /> Test starten (10s)
              </button>
          </div>
      );
  }

  if (gameState === 'result') {
      return (
        <div className="bg-stone-50 rounded-xl p-8 text-center max-w-lg mx-auto border border-stone-200 shadow-xl animate-fade-in">
             <div className="mb-4">
                <div className="text-6xl font-black text-stone-800 mb-2">{score.correct}</div>
                <div className="text-stone-500 text-sm uppercase tracking-widest">Richtige Antworten</div>
             </div>
             <p className="text-stone-500 mb-6 text-sm px-4">
                {score.correct > 8 ? "Sehr gut! Ihr Gehirn kann Interferenzen gut ausblenden." : "Das ist der Stroop-Effekt: Ihr Gehirn liest das Wort automatisch schneller (System 1), als es die Farbe benennen kann (System 2)."}
             </p>
             <button 
                onClick={startGame}
                className="text-stone-800 hover:text-orange-600 font-bold underline underline-offset-4 transition-colors flex items-center gap-2 mx-auto"
              >
                  <RefreshCw size={16} /> Noch mal versuchen
              </button>
        </div>
      );
  }

  return (
    <div className="bg-stone-50 rounded-xl p-8 text-center max-w-2xl mx-auto border border-stone-200 shadow-xl">
        <div className="flex justify-between items-center mb-8 text-xs font-mono text-stone-500">
            <span>ZEIT: {timeLeft}s</span>
            <span>SCORE: {score.correct}</span>
        </div>

        <div className="h-32 flex items-center justify-center mb-8 bg-stone-900 rounded-lg border border-stone-800">
            <span className={`text-6xl font-black tracking-wider ${currentWord.color}`}>
                {currentWord.text}
            </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colors.map((c) => (
                <button
                    key={c.name}
                    onClick={() => handleAnswer(c.value)}
                    className="bg-cta hover:bg-cta-hover active:bg-cta-hover text-white py-4 rounded-lg font-bold transition-all border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
                >
                    {c.name}
                </button>
            ))}
        </div>
    </div>
  );
};

const SquintTestSimulator = () => {
    const [blurLevel, setBlurLevel] = useState(0);

    return (
        <div className="bg-stone-100 p-1 rounded-xl border border-stone-200">
            {/* Controls */}
            <div className="bg-white p-4 rounded-t-lg border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h4 className="font-bold text-stone-900 text-sm">Der „Squint Test“ (Zusammenkneifen)</h4>
                    <p className="text-xs text-stone-500">Erhöhen Sie die Unschärfe, um zu sehen, welche Elemente dominant bleiben.</p>
                </div>
                <div className="flex items-center gap-4 bg-stone-50 px-4 py-2 rounded-full border border-stone-200">
                    <span className="text-xs font-bold text-stone-400">KLAR</span>
                    <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        step="0.5"
                        value={blurLevel}
                        onChange={(e) => setBlurLevel(parseFloat(e.target.value))}
                        className="w-32 accent-orange-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-stone-400">UNSCHARF</span>
                </div>
            </div>

            {/* Mock Interface */}
            <div className="p-8 overflow-hidden bg-stone-50 min-h-[400px] relative rounded-b-lg">
                <motion.div 
                    className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-stone-200"
                    animate={{ filter: `blur(${blurLevel}px)` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {/* Mock Nav */}
                    <div className="h-16 border-b border-stone-100 flex items-center justify-between px-8">
                        <div className="w-8 h-8 bg-black rounded-full"></div>
                        <div className="hidden md:flex gap-6">
                            <div className="w-16 h-2 bg-stone-200 rounded"></div>
                            <div className="w-16 h-2 bg-stone-200 rounded"></div>
                            <div className="w-16 h-2 bg-stone-200 rounded"></div>
                        </div>
                        <div className="w-24 h-8 bg-stone-100 rounded-full"></div>
                    </div>

                    {/* Mock Hero */}
                    <div className="p-12 md:p-20 text-center">
                         {/* Primary Heading - Should stay visible longest */}
                        <div className="h-12 w-3/4 mx-auto bg-stone-900 mb-6 rounded-lg"></div>
                        
                        {/* Subline */}
                        <div className="h-4 w-1/2 mx-auto bg-stone-300 mb-12 rounded"></div>

                        {/* CTA - Should pop */}
                        <div className="inline-block h-14 w-48 bg-cta rounded-full shadow-lg shadow-[#CC4E00]/30 mb-16"></div>

                        {/* Secondary Elements */}
                        <div className="grid grid-cols-3 gap-8 text-left">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-3">
                                    <div className="w-10 h-10 bg-stone-100 rounded-lg mb-2"></div>
                                    <div className="w-2/3 h-4 bg-stone-800 rounded"></div>
                                    <div className="w-full h-2 bg-stone-200 rounded"></div>
                                    <div className="w-full h-2 bg-stone-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
                
                {/* Analysis Overlay (appears when blurry) */}
                <div 
                    className={`absolute inset-0 pointer-events-none flex flex-col items-center justify-center transition-opacity duration-500 ${blurLevel > 5 ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="bg-stone-900/90 text-white px-6 py-4 rounded-xl backdrop-blur-md max-w-md text-center shadow-2xl transform translate-y-[-50px]">
                        <div className="flex justify-center mb-2 text-green-400"><CheckCircle2 /></div>
                        <p className="font-bold mb-1">Hierarchie-Check</p>
                        <p className="text-sm text-stone-300">
                            Sehen Sie noch den <span className="text-[#FFB27A] font-bold">orangen Button</span> und die <span className="text-white font-bold">dunkle Überschrift</span>? 
                            Das sind die Elemente mit der höchsten visuellen Gewichtung (Visual Weight).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
