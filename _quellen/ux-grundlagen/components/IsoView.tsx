
import React from 'react';
import { ISO_PRINCIPLES } from '../constants';

export const IsoView: React.FC = () => {
  return (
    <div className="space-y-16 animate-fade-in max-w-6xl mx-auto">
      <header className="border-b border-stone-200 pb-8">
        <span className="inline-block px-3 py-1 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">
          Software-Ergonomie
        </span>
        <h2 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600">ISO 9241 Normenreihe</h2>
        <p className="text-stone-600 mt-4 text-lg font-light max-w-3xl">
          Der internationale Standard für Mensch-Computer-Interaktion. Hier definieren wir, was Gebrauchstauglichkeit (Usability) eigentlich bedeutet und welche Interaktionsprinzipien gelten.
        </p>
      </header>

      {/* ISO 9241-11 Section */}
      <section aria-labelledby="iso-11-title">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
           <h3 id="iso-11-title" className="text-2xl font-serif font-bold text-stone-900">
            Teil 11: Definition der Gebrauchstauglichkeit
          </h3>
          <span className="text-sm font-mono text-stone-400">ISO 9241-11</span>
        </div>
        
        <div className="bg-white border border-stone-200 text-stone-800 p-8 md:p-12 rounded-lg shadow-xl">
           <p className="text-xl md:text-2xl font-serif italic leading-relaxed opacity-90 mb-8 text-center">
             „Das Ausmaß, in dem ein Produkt, System oder Dienst durch <span className="text-orange-600 font-semibold">bestimmte Nutzende</span> in einem <span className="text-orange-600 font-semibold">bestimmten Nutzungskontext</span> genutzt werden kann, um <span className="text-orange-600 font-semibold">bestimmte Ziele</span> effektiv, effizient und zufriedenstellend zu erreichen.“
           </p>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 border-t border-stone-200 pt-8">
              <div className="text-center">
                <img src="iso/effektivitaet.jpg" alt="" width="96" height="96" loading="lazy" className="w-24 h-24 mx-auto mb-4 object-contain" />
                <h4 className="font-bold text-lg uppercase tracking-wider mb-2">Effektivität</h4>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Die Genauigkeit und Vollständigkeit, mit der Nutzende ein bestimmtes Ziel erreichen. <br/>
                  <span className="italic text-stone-500">(Kann ich die Aufgabe erledigen?)</span>
                </p>
              </div>
              <div className="text-center">
                 <img src="iso/effizienz.jpg" alt="" width="96" height="96" loading="lazy" className="w-24 h-24 mx-auto mb-4 object-contain" />
                 <h4 className="font-bold text-lg uppercase tracking-wider mb-2">Effizienz</h4>
                 <p className="text-stone-500 text-sm leading-relaxed">
                   Der im Verhältnis zur Genauigkeit und Vollständigkeit eingesetzte Aufwand. <br/>
                   <span className="italic text-stone-500">(Wie schnell/leicht geht es?)</span>
                 </p>
              </div>
              <div className="text-center">
                 <img src="iso/zufriedenheit.webp" alt="" width="96" height="96" loading="lazy" className="w-24 h-24 mx-auto mb-4 object-contain" />
                 <h4 className="font-bold text-lg uppercase tracking-wider mb-2">Zufriedenheit</h4>
                 <p className="text-stone-500 text-sm leading-relaxed">
                   Ausmaß, in dem die körperlichen, kognitiven und emotionalen Reaktionen der Nutzenden ihren Bedürfnissen und Erwartungen entsprechen. <br/>
                   <span className="italic text-stone-500">(Macht es Spaß/fühle ich mich wohl?)</span>
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* ISO 9241-110 Section */}
      <section aria-labelledby="iso-110-title">
         <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 pt-8 border-t border-stone-200">
           <h3 id="iso-110-title" className="text-2xl font-serif font-bold text-stone-900">
            Teil 110: Interaktionsprinzipien
          </h3>
          <span className="text-sm font-mono text-stone-400">DIN EN ISO 9241-110:2020</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {ISO_PRINCIPLES.map((principle) => (
            <div 
              key={principle.id}
              className="bg-white border border-stone-200 p-6 hover:border-stone-400 transition-colors duration-300 flex flex-col h-full group focus-within:ring-2 focus-within:ring-stone-900"
              role="listitem"
              tabIndex={0}
            >
               <div className="flex justify-between items-start mb-4">
                 <span className="text-4xl font-serif font-bold text-stone-400 group-hover:text-orange-600 transition-colors" aria-hidden="true">
                   {String(principle.id).padStart(2, '0')}
                 </span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 border border-stone-100 px-2 py-1 rounded">
                   Standard
                 </span>
               </div>
               
               <h4 className="text-lg font-bold text-stone-900 mb-1">{principle.title}</h4>
               <p className="text-xs text-stone-400 font-mono mb-4">{principle.englishTitle}</p>
               
               <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-1">
                 {principle.description}
               </p>

               <div className="mt-auto bg-stone-50 p-3 rounded border border-stone-100">
                 <span className="text-xs font-bold text-stone-400 uppercase mr-2">Bsp:</span>
                 <span className="text-xs text-stone-700 italic font-serif">„{principle.example}“</span>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
