import React, { useState } from 'react';
import { Eye, MousePointer, Ear, ShieldCheck, CheckCircle2, AlertCircle, ExternalLink, BookOpen, Scale, Globe, FileText, Flag, Landmark } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const AccessibilityView: React.FC = () => {
  // --- State for Interactive Challenges ---
  
  // 1. Contrast Challenge
  const [textLightness, setTextLightness] = useState(90); // 90% lightness (very light grey)
  const getContrastColor = (l: number) => `hsl(0, 0%, ${l}%)`;
  const isContrastPass = textLightness <= 40; // Roughly passes visual check for dark on light
  
  // Helper to calculate estimated contrast ratio (White background vs Grey text)
  // Formula for relative luminance of grey: L = (lightness / 100)^2.2 (approx)
  // Contrast = (L1 + 0.05) / (L2 + 0.05)
  // White L1 = 1.0. Text L2 varies.
  const getContrastRatio = (l: number) => {
    // Simplified luminance approximation for greyscale
    // sRGB component = l / 100
    // Linearizing (approximate for demo)
    const val = l / 100;
    // Relative luminance of the text (on black-white scale)
    const L_text = val > 0.03928 ? Math.pow((val + 0.055) / 1.055, 2.4) : val / 12.92;
    
    // Background is White (L=1)
    const ratio = 1.05 / (L_text + 0.05);
    return ratio.toFixed(2);
  };
  
  const getHexCode = (l: number) => {
    const v = Math.round((l / 100) * 255).toString(16).padStart(2, '0');
    return `#${v}${v}${v}`;
  };

  // 2. Touch Target Challenge
  const [buttonSize, setButtonSize] = useState(24); // 24px (too small)
  const isTouchTargetPass = buttonSize >= 44; // 44px is standard min size

  // 3. Alt Text Challenge
  const defaultAltText = "Beschreiben Sie das Bild hier …";
  const [altText, setAltText] = useState(defaultAltText);
  const isAltTextPass = altText.length > 15 && altText !== defaultAltText; // Simple heuristic for descriptive text

  return (
    <div className="max-w-5xl mx-auto pb-24 animate-fade-in pr-2">
      
      {/* Header */}
      <div className="mb-10 border-b border-stone-200 pb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-2">
          Design für Alle
        </h2>
        <h1 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600 mb-4">
          Barrierefreiheit
        </h1>
        <div className="space-y-4 text-lg text-stone-600 max-w-4xl leading-relaxed">
          <p>
            Barrierefreiheit (Accessibility, kurz „a11y“) bedeutet, Produkte, Dienstleistungen und Umgebungen so zu gestalten, dass sie von Menschen mit unterschiedlichen Fähigkeiten uneingeschränkt genutzt werden können. Dies schließt Menschen mit visuellen, auditiven, motorischen und kognitiven Beeinträchtigungen ein.
          </p>
          <p>
            Barrierefreies Design ist kein optionales Feature, sondern eine grundlegende Anforderung an modernes Webdesign. Es verbessert die User Experience (UX) für alle Nutzenden – auch für diejenigen ohne dauerhafte Einschränkungen (z. B. bei grellem Sonnenlicht oder in lauten Umgebungen). Zudem ist es in vielen Ländern gesetzlich vorgeschrieben (z. B. durch das Barrierefreiheitsstärkungsgesetz in Deutschland).
          </p>
        </div>
      </div>

      {/* Legal Framework Visual */}
      <section className="mb-20 relative bg-stone-50 rounded-2xl border border-stone-200 p-8 overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
         <h3 className="text-xl font-bold text-stone-900 mb-8 relative z-10 text-center">Gesetzliche Grundlagen & Standards</h3>
         
         <div className="relative h-[700px] w-full max-w-4xl mx-auto hidden lg:block">
            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
               <defs>
                 <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                   <polygon points="0 0, 10 3.5, 0 7" fill="#a8a29e" />
                 </marker>
               </defs>
               
               {/* Center to Top (BFSG) */}
               <path d="M448 300 Q 448 200 448 160" fill="none" stroke="#d6d3d1" strokeWidth="2" markerEnd="url(#arrowhead)" />
               
               {/* Center to Top-Right (BITV) */}
               <path d="M500 320 Q 600 300 700 80" fill="none" stroke="#d6d3d1" strokeWidth="2" markerEnd="url(#arrowhead)" />
               
               {/* Center to Bottom-Right (BGG) */}
               <path d="M500 380 Q 600 400 700 500" fill="none" stroke="#d6d3d1" strokeWidth="2" markerEnd="url(#arrowhead)" />
               
               {/* Center to Bottom-Left (WCAG/EU) */}
               <path d="M350 380 Q 250 450 200 520" fill="none" stroke="#d6d3d1" strokeWidth="2" markerEnd="url(#arrowhead)" />
               
               {/* Circular Dependencies */}
               {/* EU to DIN */}
               <path d="M150 500 Q 100 400 150 250" fill="none" stroke="#a8a29e" strokeWidth="1" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
               
               {/* DIN to BFSG */}
               <path d="M250 180 Q 300 100 400 100" fill="none" stroke="#a8a29e" strokeWidth="1" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />

               {/* W3C/WCAG to Norms */}
               <path d="M650 550 Q 500 650 350 500" fill="none" stroke="#a8a29e" strokeWidth="1" strokeDasharray="5,5" />
            </svg>

            {/* CENTER: Digitale Barrierefreiheit */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-white border-4 border-stone-900 shadow-xl flex items-center justify-center z-20">
               <div className="text-center p-4">
                 <h4 className="text-lg font-serif font-bold text-stone-900 leading-tight">Digitale<br/>Barriere-<br/>freiheit</h4>
               </div>
            </div>

            {/* TOP CENTER: BFSG */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-64 bg-white p-4 rounded-xl border border-stone-300 shadow-md z-10">
               <div className="flex items-start gap-3">
                 <div className="bg-stone-100 p-2 rounded text-stone-600 font-serif font-bold text-xl">§</div>
                 <div>
                   <h5 className="font-bold text-stone-900 text-sm">BFSG</h5>
                   <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 leading-tight break-words hyphens-auto">Barrierefreiheits-<br/>stärkungsgesetz</p>
                   <p className="text-[10px] text-stone-600 leading-tight">
                     Gültig ab 28.6.2025.<br/>Für Produkte & Dienstleistungen (Privatsektor).
                   </p>
                 </div>
               </div>
            </div>

            {/* TOP RIGHT: BITV 2.0 */}
            <div className="absolute top-10 right-0 w-64 bg-white p-4 rounded-xl border border-stone-300 shadow-md z-10">
               <div className="flex items-start gap-3">
                 <div className="bg-stone-100 p-2 rounded text-stone-600 font-serif font-bold text-xl">§</div>
                 <div>
                   <h5 className="font-bold text-stone-900 text-sm">BITV 2.0</h5>
                   <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 leading-tight">Barrierefreie IT Verordnung</p>
                   <p className="text-[10px] text-stone-600 leading-tight">
                     Verordnung für öffentliche Stellen des Bundes.
                   </p>
                 </div>
               </div>
            </div>



            {/* BOTTOM RIGHT: BGG */}
            <div className="absolute bottom-1/4 right-0 w-64 bg-white p-4 rounded-xl border border-stone-300 shadow-md z-10">
               <div className="flex items-start gap-3">
                 <div className="bg-stone-100 p-2 rounded text-stone-600 font-serif font-bold text-xl">§</div>
                 <div>
                   <h5 className="font-bold text-stone-900 text-sm">BGG</h5>
                   <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 leading-tight break-words hyphens-auto">Behinderten-<br/>gleichstellungsgesetz</p>
                   <p className="text-[10px] text-stone-600 leading-tight">
                     Ziel: Benachteiligung beseitigen.
                   </p>
                 </div>
               </div>
            </div>

            {/* BOTTOM CENTER/RIGHT: WCAG & W3C */}
            <div className="absolute bottom-5 right-1/4 w-80 bg-white p-5 rounded-xl border-l-4 border-stone-900 shadow-lg z-10 flex gap-4">
               <div>
                 <Globe className="text-stone-800 mb-2" />
                 <h5 className="font-bold text-stone-900 text-lg">W3C</h5>
                 <p className="text-[10px] text-stone-500">World Wide Web Consortium</p>
               </div>
               <div className="border-l border-stone-100 pl-4">
                 <h5 className="font-bold text-stone-900">WCAG</h5>
                 <p className="text-xs text-stone-600 leading-tight mb-2">Web Content Accessibility Guidelines</p>
                 <div className="bg-stone-100 rounded px-2 py-1 inline-block text-[10px] font-mono">ARIA Standards</div>
               </div>
            </div>

            {/* BOTTOM LEFT: EU */}
            <div className="absolute bottom-10 left-10 w-64 bg-white p-4 rounded-xl border border-blue-100 shadow-md z-10">
               <div className="flex items-center gap-3 mb-2">
                 <div className="relative w-12 h-12 flex items-center justify-center">
                    {/* Simplified EU Stars */}
                    <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-dashed animate-spin-slow opacity-20"></div>
                    <span className="font-bold text-blue-800">EU</span>
                 </div>
                 <h5 className="font-bold text-stone-900">European Accessibility Act</h5>
               </div>
               <p className="text-xs text-stone-600">EU-Richtlinie zur Angleichung der Rechtsvorschriften.</p>
            </div>

            {/* TOP LEFT: DIN Norms */}
            <div className="absolute top-20 left-10 w-64 bg-stone-100 p-4 rounded-md border border-stone-300 shadow-inner z-10 font-mono">
               <div className="flex justify-between items-start mb-2 border-b border-stone-300 pb-2">
                 <span className="font-bold text-stone-900">DIN EN 301549</span>
                 <FileText size={16} className="text-stone-500"/>
               </div>
               <p className="text-xs text-stone-700">
                 Europäische Norm für digitale Barrierefreiheit.
               </p>
               <div className="mt-2 text-[10px] text-stone-500">
                 Referenziert WCAG 2.1 AA
               </div>
            </div>

            {/* DIN Logo/Institute */}
            <div className="absolute top-5 left-5">
               <div className="border-2 border-stone-900 p-1 inline-block">
                 <span className="font-bold text-xl block leading-none">DIN</span>
               </div>
            </div>

         </div>

         {/* Mobile Fallback (List View) */}
         <div className="lg:hidden space-y-6">
            <div className="bg-white p-4 rounded-xl border-l-4 border-stone-900 shadow-sm">
               <h4 className="font-bold text-stone-900">BFSG (Privatwirtschaft)</h4>
               <p className="text-sm text-stone-600 mt-1">Barrierefreiheitsstärkungsgesetz. Pflicht ab Juni 2025 für E-Commerce und Dienstleistungen.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border-l-4 border-stone-400 shadow-sm">
               <h4 className="font-bold text-stone-900">BITV 2.0 (Behörden)</h4>
               <p className="text-sm text-stone-600 mt-1">Verordnung für öffentliche Stellen, basiert auf WCAG.</p>
            </div>
             <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
               <h4 className="font-bold text-stone-900">DIN EN 301549 & WCAG</h4>
               <p className="text-sm text-stone-600 mt-1">Die technischen Standards, die definieren, WIE Barrierefreiheit umgesetzt wird.</p>
            </div>
         </div>

      </section>

      {/* The 4 Principles (POUR) */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-3">
            <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Die 4 Prinzipien der WCAG (POUR)
        </h2>
        <p className="text-stone-600 mb-6 max-w-3xl">
            Die Web Content Accessibility Guidelines (WCAG) basieren auf vier Grundprinzipien, die sicherstellen, dass Inhalte für alle zugänglich sind.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-stone-900"><Eye size={20} /></div>
                    <h3 className="font-bold text-lg text-stone-900">1. Wahrnehmbar (Perceivable)</h3>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                    Informationen und Bestandteile der Benutzeroberfläche müssen den Nutzenden so präsentiert werden, dass diese sie wahrnehmen können. Nichts darf „unsichtbar“ für ihre Sinne sein.
                    <br/><br/>
                    <strong>Beispiele:</strong> Alternativtexte für Bilder, Untertitel für Videos, ausreichende Kontraste, anpassbare Textgrößen.
                </p>
            </div>
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-stone-900"><MousePointer size={20} /></div>
                    <h3 className="font-bold text-lg text-stone-900">2. Bedienbar (Operable)</h3>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                   Bestandteile der Benutzeroberfläche und Navigation müssen bedienbar sein. Die Interaktion darf nicht Fähigkeiten voraussetzen, die Nutzende nicht besitzen.
                    <br/><br/>
                    <strong>Beispiele:</strong> Komplette Tastaturbedienbarkeit, genügend Zeit für Eingaben, keine Inhalte, die zu Anfällen führen können (Blitzen).
                </p>
            </div>
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-stone-900"><Ear size={20} /></div>
                    <h3 className="font-bold text-lg text-stone-900">3. Verständlich (Understandable)</h3>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                    Informationen und Bedienung der Benutzeroberfläche müssen verständlich sein. Nutzende müssen verstehen können, wie die Oberfläche funktioniert.
                    <br/><br/>
                    <strong>Beispiele:</strong> Lesbare Sprache, Vorhersagbarkeit (Konsistenz), Hilfestellungen bei der Eingabe, Fehlervermeidung.
                </p>
            </div>
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-stone-900"><ShieldCheck size={20} /></div>
                    <h3 className="font-bold text-lg text-stone-900">4. Robust (Robust)</h3>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed">
                    Inhalte müssen robust genug sein, um von einer großen Auswahl an User Agents (Browser, Screenreader, Braillezeilen) zuverlässig interpretiert werden zu können.
                    <br/><br/>
                    <strong>Beispiele:</strong> Valider HTML-Code, korrekte Verwendung von ARIA-Attributen, Kompatibilität mit zukünftigen Technologien.
                </p>
            </div>
        </div>
      </section>

      {/* Interactive Lab Section */}
      <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-3">
        <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
        Accessibility Lab: Fix the UX
      </h2>
      
      <div className="space-y-12 mb-16">
        
        {/* Challenge 1: Contrast */}
        <div className="border border-stone-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="p-4 bg-stone-100 border-b border-stone-200 flex justify-between items-center">
            <h3 className="font-bold text-stone-800">Challenge 1: Lesbarkeit & Kontrast</h3>
            {isContrastPass ? 
              <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full"><CheckCircle2 size={16}/> WCAG AA Erreicht</span> :
              <span className="flex items-center gap-1 text-rose-700 text-sm font-bold bg-rose-50 px-3 py-1 rounded-full"><AlertCircle size={16}/> Kontrast zu niedrig</span>
            }
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-sm text-stone-500">
                Text mit geringem Kontrast ist für Menschen mit Sehschwäche oder bei Sonnenlicht auf dem Display unlesbar. Erhöhe den Kontrast, bis der Text gut lesbar ist.
              </p>
              <div>
                <label htmlFor="a11y-text-lightness" className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-2">Text-Helligkeit anpassen</label>
                <input 
                  id="a11y-text-lightness"
                  type="range" 
                  min="0" 
                  max="95" 
                  value={textLightness} 
                  aria-valuetext={`${textLightness} % Helligkeit, Kontrast ${getContrastRatio(textLightness)} : 1`}
                  onChange={(e) => setTextLightness(parseInt(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
                />
              </div>
            </div>
            
            <div className="h-40 flex flex-col items-center justify-center rounded-lg border border-stone-200 bg-white shadow-inner text-center p-6">
              <p 
                className="text-2xl font-serif font-bold transition-colors duration-300"
                style={{ color: getContrastColor(textLightness) }}
              >
                „Make it legible.“
              </p>
              <p className="mt-2 text-xs text-stone-400 font-mono" aria-live="polite">
                Hex: {getHexCode(textLightness)} | Ratio: {getContrastRatio(textLightness)}:1
              </p>
            </div>
          </div>
        </div>

        {/* Challenge 2: Touch Targets */}
        <div className="border border-stone-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="p-4 bg-stone-100 border-b border-stone-200 flex justify-between items-center">
            <h3 className="font-bold text-stone-800">Challenge 2: Touch Targets (Fitts's Law)</h3>
            {isTouchTargetPass ? 
              <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full"><CheckCircle2 size={16}/> Touch-Friendly ({buttonSize}px)</span> :
              <span className="flex items-center gap-1 text-rose-700 text-sm font-bold bg-rose-50 px-3 py-1 rounded-full"><AlertCircle size={16}/> Zu klein ({buttonSize}px)</span>
            }
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-sm text-stone-500">
                Kleine Buttons frustrieren Nutzende auf Mobilgeräten („Fat Finger Problem“). Apple und Google empfehlen eine Mindestgröße von 44x44px bzw. 48x48px.
              </p>
              <div>
                <label htmlFor="a11y-button-size" className="text-xs font-bold uppercase tracking-widest text-stone-500 block mb-2">Button-Größe skalieren</label>
                <input 
                  id="a11y-button-size"
                  type="range" 
                  min="20" 
                  max="64" 
                  value={buttonSize} 
                  aria-valuetext={`${buttonSize} px, ${isTouchTargetPass ? 'touch-freundlich' : 'zu klein'}`}
                  onChange={(e) => setButtonSize(parseInt(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer h-2 bg-stone-200 rounded-lg appearance-none"
                />
              </div>
            </div>
            
            <div className="h-40 flex items-center justify-center rounded-lg border border-stone-200 bg-stone-50 shadow-inner p-6 relative">
               {/* Reference Grid */}
               <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,10px)] grid-rows-[repeat(auto-fill,10px)] opacity-10 pointer-events-none">
                  {Array.from({ length: 100 }).map((_, i) => <div key={i} className="border-r border-b border-stone-900"></div>)}
               </div>

               <div className="flex gap-4 items-center">
                  <button 
                    className="bg-cta text-white rounded shadow-lg transition-all flex items-center justify-center hover:bg-cta-hover"
                    style={{ width: `${buttonSize}px`, height: `${buttonSize}px` }}
                    aria-label="Demo Button"
                  >
                    Tap
                  </button>
                  <button 
                    className="border border-stone-300 bg-white text-stone-900 rounded shadow-sm transition-all flex items-center justify-center hover:bg-stone-50"
                    style={{ width: `${buttonSize}px`, height: `${buttonSize}px` }}
                    aria-label="Demo Button Secondary"
                  >
                    Tap
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Challenge 3: Alt Text */}
        <div className="border border-stone-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="p-4 bg-stone-100 border-b border-stone-200 flex justify-between items-center">
            <h3 className="font-bold text-stone-800">Challenge 3: Screenreader Kontext</h3>
            {isAltTextPass ? 
              <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full"><CheckCircle2 size={16}/> Hilfreich</span> :
              <span className="flex items-center gap-1 text-rose-700 text-sm font-bold bg-rose-50 px-3 py-1 rounded-full"><AlertCircle size={16}/> Nicht aussagekräftig</span>
            }
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
               <div className="rounded-lg overflow-hidden border border-stone-200 shadow-md relative group h-64 w-full bg-stone-100">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1656332694386-3dd2734e63c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1vZGVybiUyMGFydCUyMHNjdWxwdHVyZXxlbnwxfHx8fDE3NzAwMjU4NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt={altText}
                    className="w-full h-full object-cover"
                  />
                  {/* Screenreader Simulation Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform">
                     <p className="text-xs font-mono text-emerald-400 mb-1">Screenreader Output:</p>
                     <p className="font-mono text-sm">
                       „Bild: {altText || 'Dateiname_IMG_2094.jpg'}“
                     </p>
                  </div>
               </div>
               <p className="text-xs text-stone-400 text-center mt-2">Hover über das Bild für Screenreader-Vorschau</p>
            </div>
            
            <div className="space-y-4 flex flex-col justify-center">
              <p className="text-sm text-stone-500">
                Blinde Personen verlassen sich auf den „Alt-Text“. Ein leerer oder schlechter Text („Bild“) hilft nicht. Beschreiben Sie, was auf dem Bild zu sehen ist und welche Stimmung es vermittelt.
              </p>
              
              <div className="space-y-2">
                <label htmlFor="a11y-alt-text" className="text-xs font-bold uppercase tracking-widest text-stone-500">Alt-Text eingeben</label>
                <textarea
                  id="a11y-alt-text"
                  value={altText}
                  onFocus={() => {
                    if (altText === defaultAltText) setAltText("");
                  }}
                  onBlur={() => {
                    if (altText === "") setAltText(defaultAltText);
                  }}
                  onChange={(e) => setAltText(e.target.value)}
                  className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:outline-none transition-all ${isAltTextPass ? 'border-emerald-500 focus:ring-emerald-200' : 'border-rose-300 focus:ring-rose-200'}`}
                  rows={3}
                />
                <div className="flex justify-between text-xs">
                   <span className={altText.length === 0 || altText === defaultAltText ? "text-stone-400" : isAltTextPass ? "text-emerald-600 font-bold" : "text-rose-500"}>
                     {altText.length === 0 || altText === defaultAltText ? "Noch kein Text" : isAltTextPass ? "Gute Beschreibung!" : "Zu kurz / unspezifisch"}
                   </span>
                </div>
              </div>
              
              <div className="bg-stone-50 p-3 rounded text-xs text-stone-500 italic">
                Tipp: "Eine abstrakte, organische Skulptur aus hellem Stein vor einem weichen, beigen Hintergrund. Die Form erinnert an fließendes Wasser."
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Further Links Section */}
      <section className="bg-stone-100 rounded-xl p-8 border border-stone-200">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-2">
            <BookOpen className="text-stone-700" />
            Weiterführende Ressourcen
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="https://www.w3.org/WAI/WCAG21/quickref/" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 p-4 bg-white rounded-lg border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all">
                <div className="mt-1 bg-stone-100 p-2 rounded text-stone-600 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                    <ExternalLink size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-stone-900 group-hover:underline">WCAG Quick Reference</h3>
                    <p className="text-sm text-stone-600 mt-1">Die offizielle Schnellreferenz des W3C für Web Content Accessibility Guidelines. Ein unverzichtbares Tool.</p>
                </div>
            </a>
            <a href="https://www.a11yproject.com/" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 p-4 bg-white rounded-lg border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all">
                <div className="mt-1 bg-stone-100 p-2 rounded text-stone-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                    <ExternalLink size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-stone-900 group-hover:underline">The A11Y Project</h3>
                    <p className="text-sm text-stone-600 mt-1">Eine Community-getriebene Initiative, um Web-Accessibility einfacher und verständlicher zu machen.</p>
                </div>
            </a>
            <a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 p-4 bg-white rounded-lg border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all">
                <div className="mt-1 bg-stone-100 p-2 rounded text-stone-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ExternalLink size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-stone-900 group-hover:underline">WebAIM Contrast Checker</h3>
                    <p className="text-sm text-stone-600 mt-1">Das Standard-Tool zum Überprüfen von Farbkontrasten gemäß WCAG AA und AAA Standards.</p>
                </div>
            </a>
             <a href="https://bitvtest.de/" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 p-4 bg-white rounded-lg border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all">
                <div className="mt-1 bg-stone-100 p-2 rounded text-stone-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ExternalLink size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-stone-900 group-hover:underline">BITV-Test</h3>
                    <p className="text-sm text-stone-600 mt-1">Verfahren zur Prüfung der Barrierefreiheit von Webangeboten auf Basis der Barrierefreie-Informationstechnik-Verordnung.</p>
                </div>
            </a>
        </div>
      </section>

    </div>
  );
};
