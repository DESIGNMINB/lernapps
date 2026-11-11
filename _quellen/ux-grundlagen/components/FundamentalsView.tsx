import { MousePointerClick, Lightbulb, Heart, ShieldCheck, Smile, MapPin, FileText } from 'lucide-react';

export const FundamentalsView: React.FC = () => {
  return (
    <div className="space-y-20 animate-fade-in max-w-6xl mx-auto pb-20">
      <header className="border-b border-stone-200 pb-8">
         <span className="inline-block px-3 py-1 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">
          Einführung
        </span>
        <h2 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600">Grundlagen Usability & UX</h2>
        <p className="text-stone-600 mt-4 text-lg font-light max-w-3xl">
          Bevor wir in die Tiefe gehen, müssen wir die Begriffe klären. Was macht ein Produkt benutzbar? Und was macht es zu einem Erlebnis?
        </p>
      </header>

      {/* Section 1: Definitions & The Big Picture */}
      <section className="space-y-12">
        <div>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6">Usability vs. User Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border-l-4 border-stone-900 shadow-sm">
              <h4 className="font-bold text-lg mb-2">Usability (Gebrauchstauglichkeit)</h4>
              <p className="text-sm text-stone-600 italic mb-3">Der objektive, funktionale Teil.</p>
              <p className="text-stone-700 leading-relaxed">
                Bezieht sich darauf, wie effektiv, effizient und zufriedenstellend bestimmte Nutzende bestimmte Ziele in einem bestimmten Nutzungskontext erreichen können (ISO 9241-11).
                <br/><br/>
                <strong>Frage:</strong> „Funktioniert es? Kann ich es bedienen?“
              </p>
            </div>
            
            <div className="bg-white border border-stone-200 text-stone-800 p-6 rounded-lg border-l-4 border-orange-500 shadow-lg">
              <h4 className="font-bold text-lg mb-2">User Experience (UX)</h4>
              <p className="text-sm text-stone-500 italic mb-3">Der subjektive, emotionale Teil.</p>
              <p className="text-stone-600 leading-relaxed">
                Umfasst alle Aspekte der Erfahrungen der Nutzenden bei der Interaktion mit einem Produkt, Dienst oder System. Dazu gehören Emotionen, Vorstellungen, Vorlieben und körperliche Reaktionen – vor, während und nach der Nutzung.
                <br/><br/>
                <span className="text-stone-500 text-xs">(ISO 9241-210)</span>
                <br/>
                <strong>Frage:</strong> „Wie fühlt es sich an? Macht es Spaß?“
              </p>
            </div>
          </div>
        </div>

        {/* Visual: New Mind Map based on user request */}
        <div className="relative h-[600px] w-full bg-stone-50 rounded-xl border border-stone-200 p-4 md:p-8 overflow-hidden flex items-center justify-center">
           <div className="absolute inset-0 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
           
           {/* Connecting Lines (SVG) - Enhanced Network */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Outer Nodes to Center */}
              <line x1="50%" y1="50%" x2="20%" y2="20%" className="stroke-stone-300 stroke-2" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="80%" y2="20%" className="stroke-stone-300 stroke-2" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="80%" y2="80%" className="stroke-stone-300 stroke-2" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="20%" y2="80%" className="stroke-stone-300 stroke-2" strokeDasharray="4 4" />
              
              {/* Inner Factors to Center (Solid, thinner lines) */}
              <line x1="50%" y1="50%" x2="50%" y2="15%" className="stroke-orange-200 stroke-1" />
              <line x1="50%" y1="50%" x2="10%" y2="50%" className="stroke-orange-200 stroke-1" />
              <line x1="50%" y1="50%" x2="90%" y2="50%" className="stroke-orange-200 stroke-1" />
           </svg>

           {/* CENTER NODE: UX */}
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-center w-40 h-40 flex flex-col items-center justify-center rounded-full bg-orange-500 text-white shadow-xl ring-4 ring-orange-100 animate-fade-in">
             <span className="font-serif font-bold text-xl leading-none">User<br/>Experience</span>
             <span className="text-[10px] uppercase tracking-widest mt-1 opacity-90">(UX)</span>
             <span className="text-[10px] mt-2 font-medium bg-orange-600 px-2 py-0.5 rounded-full">Die Nutzererfahrung</span>
           </div>

           {/* --- OUTER NODES (The 4 Pillars) --- */}

           {/* NODE 1: Utility (Nützlichkeit) - Top Left */}
           <div className="absolute top-[10%] left-[5%] md:left-[15%] z-20 w-40 bg-white p-4 rounded-xl border border-stone-200 shadow-md text-center group hover:scale-105 transition-transform">
              <div className="w-8 h-8 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-2 text-stone-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <Lightbulb size={16} />
              </div>
              <h5 className="font-bold text-stone-900 text-sm">Nützlichkeit</h5>
              <p className="text-[10px] text-stone-500 leading-tight mt-1">Erfüllt Bedürfnisse & löst Probleme</p>
           </div>

           {/* NODE 2: Aesthetics (Ästhetik) - Top Right */}
           <div className="absolute top-[10%] right-[5%] md:right-[15%] z-20 w-40 bg-white p-4 rounded-xl border border-stone-200 shadow-md text-center group hover:scale-105 transition-transform">
              <div className="w-8 h-8 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-2 text-stone-600 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                <Heart size={16} />
              </div>
              <h5 className="font-bold text-stone-900 text-sm">Ästhetik</h5>
              <p className="text-[10px] text-stone-500 leading-tight mt-1">Visuelles Design & Anmutung</p>
           </div>

            {/* NODE 3: Trust (Vertrauen) - Bottom Right */}
           <div className="absolute bottom-[10%] right-[5%] md:right-[15%] z-20 w-40 bg-white p-4 rounded-xl border border-stone-200 shadow-md text-center group hover:scale-105 transition-transform">
              <div className="w-8 h-8 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-2 text-stone-600 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                <ShieldCheck size={16} />
              </div>
              <h5 className="font-bold text-stone-900 text-sm">Vertrauen</h5>
              <p className="text-[10px] text-stone-500 leading-tight mt-1">Glaubwürdigkeit & Sicherheit</p>
           </div>

           {/* NODE 4: Usability (Detailed) - Bottom Left */}
           <div className="absolute bottom-[5%] left-[5%] md:left-[10%] z-20 w-48 bg-white p-4 rounded-xl border-l-4 border-stone-900 shadow-lg group hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-2 border-b border-stone-100 pb-2">
                <div className="w-6 h-6 bg-stone-900 rounded flex items-center justify-center text-white">
                  <MousePointerClick size={14} />
                </div>
                <div>
                  <h5 className="font-bold text-stone-900 text-sm">Usability</h5>
                  <p className="text-[9px] text-stone-400 uppercase tracking-wider">Gebrauchstauglichkeit</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {[
                  { label: 'Bedienbarkeit', icon: '✓' },
                  { label: 'Zugänglichkeit', icon: '✓' },
                  { label: 'Übersichtlichkeit', icon: '✓' },
                  { label: 'Fehlertoleranz', icon: '✓' }
                ].map((item, i) => (
                   <li key={i} className="text-xs text-stone-600 flex items-center gap-2">
                     <span className="text-green-700 font-bold text-[10px]">{item.icon}</span>
                     {item.label}
                   </li>
                ))}
              </ul>
           </div>
           
           {/* --- INNER FACTORS (Detailed) --- */}

           {/* FACTOR 1: Context (Top Center) */}
           <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-10 w-36 bg-orange-50/80 backdrop-blur-sm p-3 rounded-lg border border-orange-100 text-center animate-slide-up hover:bg-white hover:shadow-sm transition-all">
             <div className="flex justify-center mb-1 text-orange-500"><MapPin size={14} /></div>
             <h6 className="font-bold text-xs text-stone-800 uppercase tracking-wide mb-1">Kontext</h6>
             <p className="text-[9px] text-stone-500 leading-tight">Zeit, Ort, Gerät,<br/>Umgebung</p>
           </div>

           {/* FACTOR 2: Content (Left Center) */}
           <div className="absolute top-1/2 left-[5%] -translate-y-1/2 z-10 w-32 bg-orange-50/80 backdrop-blur-sm p-3 rounded-lg border border-orange-100 text-center animate-slide-up hover:bg-white hover:shadow-sm transition-all">
             <div className="flex justify-center mb-1 text-orange-500"><FileText size={14} /></div>
             <h6 className="font-bold text-xs text-stone-800 uppercase tracking-wide mb-1">Inhalt</h6>
             <p className="text-[9px] text-stone-500 leading-tight">Relevanz, Qualität,<br/>Verständlichkeit</p>
           </div>

           {/* FACTOR 3: Emotions (Right Center) */}
           <div className="absolute top-1/2 right-[5%] -translate-y-1/2 z-10 w-32 bg-orange-50/80 backdrop-blur-sm p-3 rounded-lg border border-orange-100 text-center animate-slide-up hover:bg-white hover:shadow-sm transition-all">
             <div className="flex justify-center mb-1 text-orange-500"><Smile size={14} /></div>
             <h6 className="font-bold text-xs text-stone-800 uppercase tracking-wide mb-1">Emotionen</h6>
             <p className="text-[9px] text-stone-500 leading-tight">Freude, Neugier,<br/>Erwartung</p>
           </div>

        </div>
      </section>

      {/* Section 2: Subfields of Usability (Nielsen) */}
      <section>
        <h3 className="text-3xl font-serif font-bold text-stone-900 mb-10 text-center">Die 5 Komponenten der Usability</h3>
        <p className="text-center text-stone-600 max-w-2xl mx-auto mb-12">
          Nach Jakob Nielsen lässt sich Usability in fünf zentrale Qualitätskomponenten unterteilen. Ein System ist „usable“, wenn es diese Kriterien erfüllt.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
           {/* Component 1 */}
           <div className="bg-white border border-stone-200 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 group">
             <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-stone-900 group-hover:text-white transition-colors">
               🚀
             </div>
             <h4 className="font-bold text-stone-900 mb-2">Learnability</h4>
             <p className="text-xs text-stone-600 leading-relaxed">
               Wie einfach können Nutzende grundlegende Aufgaben erledigen, wenn sie das Design zum ersten Mal sehen?
             </p>
           </div>

           {/* Component 2 */}
           <div className="bg-white border border-stone-200 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 group">
             <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-stone-900 group-hover:text-white transition-colors">
               ⚡
             </div>
             <h4 className="font-bold text-stone-900 mb-2">Efficiency</h4>
             <p className="text-xs text-stone-600 leading-relaxed">
               Wenn Nutzende das Design gelernt haben, wie schnell können sie Aufgaben erledigen?
             </p>
           </div>

           {/* Component 3 */}
           <div className="bg-white border border-stone-200 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 group">
             <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-stone-900 group-hover:text-white transition-colors">
               🧠
             </div>
             <h4 className="font-bold text-stone-900 mb-2">Memorability</h4>
             <p className="text-xs text-stone-600 leading-relaxed">
               Wenn Nutzende nach einer Pause zurückkehren, wie leicht finden sie sich wieder zurecht?
             </p>
           </div>

           {/* Component 4 */}
           <div className="bg-white border border-stone-200 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 group">
             <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-stone-900 group-hover:text-white transition-colors">
               🛡️
             </div>
             <h4 className="font-bold text-stone-900 mb-2">Errors</h4>
             <p className="text-xs text-stone-600 leading-relaxed">
               Wie viele Fehler machen Nutzende, wie schwerwiegend sind sie und wie leicht können sie behoben werden?
             </p>
           </div>

           {/* Component 5 */}
           <div className="bg-white border border-stone-200 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 group">
             <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-stone-900 group-hover:text-white transition-colors">
               ❤️
             </div>
             <h4 className="font-bold text-stone-900 mb-2">Satisfaction</h4>
             <p className="text-xs text-stone-600 leading-relaxed">
               Wie angenehm ist die Nutzung des Designs? (Der subjektivste Teil der Usability).
             </p>
           </div>
        </div>
      </section>

      {/* Interactive Time-Context Visual */}
      <section className="bg-white border border-stone-200 rounded-2xl p-8 text-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-orange-600/10 rounded-full blur-3xl"></div>
        
        <h3 className="text-2xl font-serif font-bold mb-8 relative z-10">Der Zeit-Faktor</h3>
        
        <div className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="flex-1 p-6 border border-stone-200 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Vor der Nutzung</span>
            <h4 className="text-xl font-bold text-stone-800 mb-2">Antizipierte UX</h4>
            <p className="text-sm text-stone-500">
              Erwartungen, Markenimage, Vorfreude oder Skepsis.
              <br/><em className="text-stone-500">„Das sieht aber kompliziert aus …“</em>
            </p>
          </div>

          <div className="flex items-center justify-center text-stone-500 transform rotate-90 md:rotate-0">
             ➜
          </div>

          <div className="flex-1 p-6 border-2 border-orange-500/50 rounded-lg bg-stone-50 shadow-sm transform md:scale-105">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-2">Während der Nutzung</span>
            <h4 className="text-xl font-bold text-stone-800 mb-2">Momentane UX</h4>
            <p className="text-sm text-stone-600">
              Hier passiert <strong>Usability</strong>. Effektive Bedienung, Flow-Erleben oder Frustration.
              <br/><em className="text-stone-500">„Wow, das ging schnell!“</em>
            </p>
          </div>

          <div className="flex items-center justify-center text-stone-500 transform rotate-90 md:rotate-0">
             ➜
          </div>

          <div className="flex-1 p-6 border border-stone-200 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-2">Nach der Nutzung</span>
            <h4 className="text-xl font-bold text-stone-800 mb-2">Episodische UX</h4>
            <p className="text-sm text-stone-500">
              Reflexion, Erinnerung, Weiterempfehlung.
              <br/><em className="text-stone-500">„Das würde ich wieder benutzen.“</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
