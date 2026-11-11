import React, { useState } from 'react';
import { UX_LAWS_DATA } from '../constants';
import { Scale, Zap, Brain, LayoutTemplate, MousePointerClick, ArrowRight, BookOpen } from 'lucide-react';

export const UxLawsView: React.FC = () => {
  const [filter, setFilter] = useState<'Alle' | 'Psychologie' | 'Heuristik' | 'Prinzip'>('Alle');

  const filteredLaws = filter === 'Alle' 
    ? UX_LAWS_DATA 
    : UX_LAWS_DATA.filter(law => law.category === filter);

  const getIcon = (id: string) => {
    switch (id) {
      case 'hicks-law': return <MousePointerClick />;
      case 'fitts-law': return <LayoutTemplate />;
      case 'jakobs-law': return <Scale />;
      case 'millers-law': return <Brain />;
      case 'doherty-threshold': return <Zap />;
      default: return <BookOpen />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      <header className="border-b border-stone-200 pb-12 mb-12">
        <span className="inline-block px-3 py-1 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">
          Gesetze & Prinzipien
        </span>
        <h1 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600 mb-6">
          UX Grundsätze
        </h1>
        <p className="text-xl text-stone-600 font-light max-w-3xl leading-relaxed">
          Eine Sammlung von Best Practices, die Designer nutzen, um intuitive Benutzeroberflächen zu gestalten. 
          Diese Gesetze stammen aus der Psychologie und der Human-Computer-Interaction (HCI).
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-12">
        {['Alle', 'Psychologie', 'Heuristik', 'Prinzip'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as 'Alle' | 'Psychologie' | 'Heuristik' | 'Prinzip')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              filter === cat 
                ? 'bg-cta text-white shadow-lg scale-105' 
                : 'bg-white border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLaws.map((law) => (
          <div 
            key={law.id}
            className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-stone-50 rounded-lg text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  {getIcon(law.id)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-50 px-2 py-1 rounded">
                  {law.category}
                </span>
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-3 group-hover:text-orange-600 transition-colors">
                {law.name}
              </h3>
              
              <p className="text-stone-600 leading-relaxed mb-6 flex-1">
                {law.description}
              </p>

              <div className="bg-stone-50 rounded-lg p-4 border border-stone-100 group-hover:border-stone-200 transition-colors">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 mb-2">
                  <ArrowRight size={12} className="text-orange-500" />
                  Takeaway
                </h4>
                <p className="text-sm text-stone-500 italic">
                  „{law.takeaway}“
                </p>
              </div>
            </div>
            
            {/* Decorative bottom bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-stone-200 to-stone-100 group-hover:from-orange-500 group-hover:to-orange-400 transition-all" />
          </div>
        ))}
      </div>

      {/* Footer / Attribution */}
      <div className="mt-16 text-center text-stone-400 text-sm">
        <p>Inhalte basierend auf <a href="https://lawsofux.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-stone-900">Laws of UX</a> von Jon Yablonski.</p>
      </div>
    </div>
  );
};
