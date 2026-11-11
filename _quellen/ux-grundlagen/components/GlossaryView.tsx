import React, { useState, useMemo } from 'react';
import { Search, Filter, Book, Hash } from 'lucide-react';
import { GLOSSARY_TERMS } from '../constants';

export const GlossaryView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(GLOSSARY_TERMS.map(t => t.category));
    return Array.from(cats).sort();
  }, []);

  // Filter and Sort Terms
  const filteredTerms = useMemo(() => {
    let terms = GLOSSARY_TERMS;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      terms = terms.filter(t => 
        t.term.toLowerCase().includes(lowerQuery) || 
        t.definition.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategory) {
      terms = terms.filter(t => t.category === selectedCategory);
    }

    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory]);

  // Group by First Letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof GLOSSARY_TERMS> = {};
    filteredTerms.forEach(term => {
      const letter = term.term.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const sortedLetters = Object.keys(groupedTerms).sort();

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto pb-20">
      {/* Header */}
      <header className="border-b border-stone-200 pb-8">
        <span className="inline-block px-3 py-1 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">
          Wissen von A-Z
        </span>
        <h1 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600">
          UX Glossar
        </h1>
        <p className="text-stone-600 mt-4 text-lg font-light max-w-3xl">
          Die wichtigsten Begriffe, Methoden und Akronyme aus der Welt des User Experience Designs einfach erklärt.
        </p>
      </header>

      {/* Controls */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm py-4 border-b border-stone-100 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input
              type="text"
              placeholder="Begriff suchen …"
              aria-label="Glossar durchsuchen"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <Filter size={18} className="text-stone-400 shrink-0" />
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                selectedCategory === null 
                  ? 'bg-cta text-white' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Alle
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-cta text-white' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredTerms.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <Book size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Keine Begriffe gefunden.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            className="text-orange-600 font-bold mt-2 hover:underline"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {sortedLetters.map(letter => (
            <section key={letter} id={`letter-${letter}`} className="relative">
              <div className="absolute -left-4 md:-left-12 top-0 text-6xl md:text-8xl font-black text-stone-100 select-none -z-10 font-serif" aria-hidden="true">
                {letter}
              </div>
              <div className="border-t border-stone-200 pt-8 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {groupedTerms[letter].map((item) => (
                    <div key={item.term} className="group">
                      <div className="flex items-baseline gap-3 mb-2">
                        <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors">
                          {item.term}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed text-sm">
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Quick Jump (Desktop only) */}
      <div className="hidden xl:flex flex-col fixed right-8 top-1/2 -translate-y-1/2 gap-1 z-10 bg-white/50 backdrop-blur p-2 rounded-full border border-stone-200 shadow-sm">
        {sortedLetters.map(letter => (
          <a 
            key={letter} 
            href={`#letter-${letter}`}
            className="w-6 h-6 flex items-center justify-center text-[10px] font-bold text-stone-400 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-all"
          >
            {letter}
          </a>
        ))}
      </div>
    </div>
  );
};
