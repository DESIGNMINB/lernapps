import React from 'react';
import { Bot, Sparkles, BrainCircuit, MessageSquareText, Code2, Paintbrush, Search, Zap, ExternalLink } from 'lucide-react';

export const AiUxView = () => {
  const workflowPhases = [
    {
      id: 1,
      title: 'Research & Discover',
      description: 'KI kann riesige Mengen an Nutzerdaten analysieren, Muster erkennen und Research-Synthesen beschleunigen.',
      icon: Search,
      tools: [
        { name: 'ChatGPT', url: 'https://chat.openai.com' },
        { name: 'Claude', url: 'https://claude.ai' },
        { name: 'Synthetic Users', url: 'https://www.syntheticusers.com/' },
        { name: 'Otter.ai', url: 'https://otter.ai' }
      ],
      benefits: ['Zeitersparnis bei der Auswertung', 'Erkennen versteckter Muster', 'Schnelle Marktanalysen']
    },
    {
      id: 2,
      title: 'Ideation & Brainstorming',
      description: 'KI dient als kreativer Sparringspartner, um „How might we“-Fragen zu generieren oder Ideen zu diversifizieren.',
      icon: Sparkles,
      tools: [
        { name: 'Miro Assist', url: 'https://miro.com/ai/' },
        { name: 'FigJam AI', url: 'https://www.figma.com/figjam/ai/' },
        { name: 'ChatGPT', url: 'https://chat.openai.com' },
        { name: 'Google Gemini', url: 'https://gemini.google.com' }
      ],
      benefits: ['Überwindung von Schreibblockaden', 'Breitere Ideenvielfalt', 'Schnelles Clustern von Ideen']
    },
    {
      id: 3,
      title: 'UX Writing & Content',
      description: 'Statt „Lorem Ipsum“ liefert KI kontextbezogene Texte, die das Design realistischer machen und die Tonalität testen helfen.',
      icon: MessageSquareText,
      tools: [
        { name: 'Jasper', url: 'https://www.jasper.ai' },
        { name: 'Notion AI', url: 'https://www.notion.so/product/ai' },
        { name: 'Writer', url: 'https://writer.com' }
      ],
      benefits: ['Realistische Inhalte früh im Prozess', 'Konsistente Tonalität („Tone of Voice“)', 'Mehrsprachigkeit']
    },
    {
      id: 4,
      title: 'Visual Design & Assets',
      description: 'Generative KI erstellt Moodboards, Farbpaletten, Icons oder komplette Bildwelten in Sekunden.',
      icon: Paintbrush,
      tools: [
        { name: 'Midjourney', url: 'https://www.midjourney.com' },
        { name: 'Adobe Firefly', url: 'https://firefly.adobe.com' },
        { name: 'Dall-E', url: 'https://openai.com/dall-e-3' },
        { name: 'Freepik', url: 'https://www.freepik.com' },
        { name: 'ComfyUI', url: 'https://github.com/comfyanonymous/ComfyUI' }
      ],
      benefits: ['Schnelle Moodboard-Erstellung', 'Einzigartige Bildassets', 'Automatisierte Varianten']
    },
    {
      id: 5,
      title: 'Prototyping & Code',
      description: 'Vom Sketch zum Code: KI-Tools können Handzeichnungen in Wireframes verwandeln oder direkt React-Komponenten schreiben.',
      icon: Code2,
      tools: [
        { name: 'Vercel v0', url: 'https://v0.dev' },
        { name: 'GitHub Copilot', url: 'https://github.com/features/copilot' },
        { name: 'Figma AI', url: 'https://www.figma.com/ai/' },
        { name: 'Claude Code', url: 'https://claude.ai' }
      ],
      benefits: ['Schnellerer Übergang Design -> Dev', 'Rapid Prototyping', 'Automatisierte Responsiveness']
    }
  ];

  return (
    <div className="space-y-16 animate-fade-in pb-20">
      {/* Header */}
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 text-stone-500 mb-2">
           <Bot size={20} />
           <h2 className="text-sm font-bold uppercase tracking-widest">
            Future of Design
          </h2>
        </div>
       
        <h1 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600 mb-6">
          UX & Künstliche Intelligenz
        </h1>
        <p className="text-xl text-stone-600 leading-relaxed mb-8">
          KI verändert nicht nur, <em>was</em> wir bauen, sondern <em>wie</em> wir es bauen. 
          Vom Research bis zum Code – hier ist ein Überblick, wie KI-Tools den modernen UX-Workflow augmentieren.
        </p>
        
        <div className="p-6 bg-stone-100 rounded-xl border border-stone-200">
          <h3 className="flex items-center gap-2 font-bold text-stone-900 mb-2">
            <Zap size={20} className="text-orange-500" fill="currentColor" />
            Core Mindset
          </h3>
          <p className="text-stone-700">
            „KI wird UX-Designerinnen und -Designer nicht ersetzen. Aber wer im UX-Design KI nutzt, wird diejenigen ersetzen, die es nicht tun.“
          </p>
        </div>
      </div>

      {/* Hero Image */}
      <div className="rounded-2xl overflow-hidden aspect-[21/9] relative group">
        <img 
          src="https://images.unsplash.com/photo-1767966787868-2db51cb84de5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMGh1bWFuJTIwY29sbGFib3JhdGlvbiUyMGRlc2lnbiUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NzAxMjI3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="AI UX Collaboration" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-stone-900/20 mix-blend-multiply" />
      </div>

      {/* Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflowPhases.map((phase) => (
          <div key={phase.id} className="bg-white border border-stone-200 p-6 rounded-xl hover:shadow-lg transition-all hover:border-orange-200 group">
            <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-stone-900 mb-6 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
              <phase.icon size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-stone-900 mb-3">{phase.title}</h3>
            <p className="text-stone-600 mb-6 min-h-[80px]">{phase.description}</p>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Tools</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {phase.tools.map((tool) => (
                    <a 
                      key={tool.name} 
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-stone-100 text-stone-700 rounded-md font-medium hover:bg-cta hover:text-white transition-all"
                    >
                      {tool.name}
                      <ExternalLink size={10} className="opacity-50 group-hover/link:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ethics Section */}
      <div className="bg-white border border-stone-200 text-stone-600 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/3">
           <div className="aspect-square bg-stone-50 rounded-xl flex items-center justify-center">
              <BrainCircuit size={80} className="text-stone-600" />
           </div>
        </div>
        <div className="w-full md:w-2/3 space-y-6">
          <h2 className="text-3xl font-black text-stone-800 tracking-tight">Ethische Verantwortung</h2>
          <p className="text-lg leading-relaxed">
            Mit großer Macht kommt große Verantwortung. Beim Einsatz von KI im UX-Design müssen wir uns bewusst sein über:
          </p>
          <ul className="space-y-4">
            {[
              { title: 'Bias & Vorurteile', desc: 'KI-Modelle reproduzieren gesellschaftliche Vorurteile aus ihren Trainingsdaten.' },
              { title: 'Halluzinationen', desc: 'KI kann Fakten erfinden. Research-Ergebnisse müssen immer verifiziert werden.' },
              { title: 'Datenschutz', desc: 'Keine sensiblen Nutzerdaten in öffentliche KI-Modelle eingeben.' }
            ].map((item, i) => (
              <li key={i} className="flex gap-4">
                <span className="text-orange-600 font-bold">0{i+1}.</span>
                <div>
                  <strong className="text-stone-800 block">{item.title}</strong>
                  <span className="text-stone-500 text-sm">{item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Verweis auf das vertiefende Lernmodul */}
      <aside className="mt-10 rounded-xl border border-orange-200 bg-orange-50 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-700">Weiter vertiefen · Lernmodul 09</p>
        <p className="mt-2 text-stone-700 leading-relaxed">Wie Bildmodelle arbeiten, wie Sie Bilder nach dem MARE-Prinzip und mit Fachbegriffen aus Fotografie und Film beauftragen, KI-Bilder prüfen und bearbeiten und was Urheberrecht und AI Act verlangen, zeigt das Modul UX &amp; KI.</p>
        <a href="../ux-ki/" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Zum Lernmodul 09 →</a>
      </aside>
    </div>
  );
};
