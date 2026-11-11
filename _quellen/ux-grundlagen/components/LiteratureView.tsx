
import React from 'react';
import { LITERATURE_ITEMS, ONLINE_RESOURCES, LEARNING_GUIDE_2026 } from '../constants';
import { CheckCircle2, Target, Sparkles, ExternalLink } from 'lucide-react';

export const LiteratureView: React.FC = () => {
  return (
    <div className="space-y-16 animate-fade-in max-w-6xl mx-auto pb-12">
      <header className="border-b border-stone-200 pb-8">
        <span className="inline-block px-3 py-1 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">
          Must-Reads
        </span>
        <h2 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600">Bibliothek & Ressourcen</h2>
        <p className="text-stone-600 mt-4 text-lg font-light max-w-3xl">
          Essenzielles Wissen für angehende UX-Professionals. Diese kuratierte Liste enthält Standardwerke und digitale Lernressourcen.
        </p>
      </header>

      {/* Books Section */}
      <section>
        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-8 flex items-center gap-3">
          <span className="text-2xl">📚</span> Fachliteratur
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {LITERATURE_ITEMS.map((book) => (
            <div 
              key={book.id}
              className="flex flex-col h-full bg-white border border-stone-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              role="listitem"
            >
              {/* Abstract Book Cover / Spine Representation */}
              <div className={`h-3 p-0 w-full ${book.color.replace('text-', 'bg-').split(' ')[0].replace('100', '400')}`}></div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${book.color}`}>
                    {book.category}
                  </span>
                  <span className="text-stone-400 text-xs font-mono">{book.year}</span>
                </div>
                
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-1 group-hover:text-stone-700 transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-stone-500 italic mb-4 font-serif">by {book.author}</p>
                
                <p className="text-stone-600 text-sm leading-relaxed flex-1">
                  {book.description}
                </p>

                <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 group-hover:text-stone-900 transition-colors font-mono">
                  <span className="font-bold uppercase tracking-widest">ISBN</span>
                  <span>{book.isbn}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Guide 2026 Section */}
      <section className="bg-white border border-stone-200 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-16 text-stone-800 rounded-xl my-16 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <header className="mb-12 border-b border-stone-200 pb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} />
              New for 2026
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-6">
              UI/UX Design lernen 2026: <br/>
              <span className="text-stone-500">Ein kostenloser Guide für die KI-Ära</span>
            </h2>
            
            <div className="bg-stone-50 rounded-xl p-8 border border-stone-200 backdrop-blur-sm max-w-3xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="text-orange-600" />
                Der Kern-Wandel: Designende als Regie-Führende
              </h3>
              <p className="text-stone-600 leading-relaxed mb-6">
                Die Rolle hat sich von der reinen „Pixel-Produktion“ zur „Regie der Ergebnisse“ gewandelt. 
                KI beschleunigt die Ausführung; der Wert liegt heute in:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-green-700 shrink-0 mt-0.5" size={16} />
                  <span><strong>Problem Framing:</strong> Definieren, was gelöst werden muss</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-green-700 shrink-0 mt-0.5" size={16} />
                  <span><strong>User Understanding:</strong> Bedürfnisse erkennen, die KI nicht sehen kann</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-green-700 shrink-0 mt-0.5" size={16} />
                  <span><strong>Quality Judgment:</strong> Kuratieren und Verfeinern von KI-Ergebnissen</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="text-green-700 shrink-0 mt-0.5" size={16} />
                  <span><strong>Strategic Thinking:</strong> Design mit Geschäftszielen verknüpfen</span>
                </li>
              </ul>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-12">
            {LEARNING_GUIDE_2026.map((phase) => (
              <div key={phase.id} className="border-t border-stone-200 pt-8">
                <div className="md:flex gap-12">
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold text-stone-800 mb-2">{phase.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{phase.description}</p>
                  </div>
                  <div className="md:w-2/3 grid grid-cols-1 gap-4">
                    {phase.resources.map((resource, idx) => (
                      resource.url ? (
                        <a 
                          key={idx} 
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-stone-50 p-4 rounded-lg border border-stone-200 hover:border-orange-500/50 hover:bg-stone-100 transition-all group block"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-stone-800 group-hover:text-orange-600 transition-colors flex items-center gap-2">
                              {resource.title}
                              <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            {resource.isFree && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-400/10 px-2 py-0.5 rounded">
                                Free
                              </span>
                            )}
                          </div>
                          <p className="text-stone-500 text-sm">{resource.description}</p>
                        </a>
                      ) : (
                        <div key={idx} className="bg-stone-50 p-4 rounded-lg border border-stone-200 hover:border-stone-500 transition-colors group">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-stone-800 group-hover:text-orange-600 transition-colors">
                              {resource.title}
                            </h4>
                            {resource.isFree && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 bg-green-400/10 px-2 py-0.5 rounded">
                                Free
                              </span>
                            )}
                          </div>
                          <p className="text-stone-500 text-sm">{resource.description}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-stone-800 mb-4">Community & Weiterlernen</h3>
            <div className="flex flex-wrap justify-center gap-4">
               {['Figma Community', 'Designer Hangout Slack', 'ADPList Mentorship', 'UX Planet', 'Smashing Magazine'].map((com) => (
                 <span key={com} className="px-4 py-2 bg-stone-50 rounded-full text-stone-600 text-sm border border-stone-200">
                    {com}
                 </span>
               ))}
            </div>
          </div>

        </div>
      </section>

      {/* Online Resources Section */}
      <section className="pt-8 border-t border-stone-200">
         <h3 className="text-2xl font-serif font-bold text-stone-900 mb-8 flex items-center gap-3">
            <span className="text-2xl">💻</span> Online-Trainings & Zertifikate
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ONLINE_RESOURCES.map((resource) => (
              <div key={resource.id} className="bg-white p-6 rounded-lg border border-stone-200 flex flex-col md:flex-row gap-6 hover:border-stone-400 transition-all items-start">
                  <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                    {resource.icon}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-500">{resource.platform}</span>
                        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                          resource.cost === 'Free' ? 'bg-green-100 text-green-800' :
                          resource.cost === 'Subscription' ? 'bg-blue-100 text-blue-800' :
                          'bg-stone-100 text-stone-800'
                        }`}>
                          {resource.cost}
                        </span>
                     </div>
                     <h4 className="text-lg font-bold text-stone-900 mb-2">{resource.title}</h4>
                     <p className="text-stone-600 text-sm mb-4 leading-relaxed">{resource.description}</p>
                     
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-stone-300"></span>
                        <span className="text-xs font-medium text-stone-400">Level: {resource.level}</span>
                     </div>
                  </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};
