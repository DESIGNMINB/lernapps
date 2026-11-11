import React, { useEffect, useState } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { ViewState } from './types';
import { Navigation } from './components/Navigation';
import { FundamentalsView } from './components/FundamentalsView';
import { TheoryView } from './components/TheoryView';
import { GestaltView } from './components/GestaltView';
import { PerceptionView } from './components/PerceptionView';
import { BadUiLab } from './components/BadUiLab';
import { QuizLab } from './components/QuizLab';
import { IsoView } from './components/IsoView';
import { DesignSystemView } from './components/DesignSystemView';
import { LiteratureView } from './components/LiteratureView';
import { GlossaryView } from './components/GlossaryView';
import { EvaluationView } from './components/EvaluationView';
import { AccessibilityView } from './components/AccessibilityView';
import { DesignMethodsView } from './components/DesignMethodsView';
import { IntroView } from './components/IntroView';
import { AiUxView } from './components/AiUxView';
import { UxLawsView } from './components/UxLawsView';
import { KiBadge, isKiImage } from './components/KiBadge';

export default function App() {
  // Kapitel stehen in der Adresse (#intro, #gestalt …), damit Links und die Suche direkt dorthin führen
  const fromHash = (): ViewState => {
    const h = decodeURIComponent(location.hash.slice(1)).toUpperCase();
    return (Object.values(ViewState) as string[]).includes(h) ? (h as ViewState) : ViewState.HOME;
  };
  const [currentView, setCurrentView] = useState<ViewState>(fromHash);
  useEffect(() => {
    const onHash = () => { setCurrentView(fromHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const [visited, setVisited] = useState<ViewState[]>(() => {
    try { return JSON.parse(localStorage.getItem('uxlab-visited') || '[]'); } catch { return []; }
  });
  // Nutzungsstatistik (GoatCounter über ../theme.js): jede Ansicht als eigene Seite zählen
  useEffect(() => {
    const t = (window as unknown as { LernTrack?: { view: (p: string) => void } }).LernTrack;
    t?.view(location.pathname + (currentView === ViewState.HOME ? '' : '#' + currentView.toLowerCase()));
  }, [currentView]);
  // Besuchte Kapitel für den Fortschritt auf der Startseite merken
  const setView = (view: ViewState) => {
    setCurrentView(view);
    const h = view === ViewState.HOME ? '' : '#' + view.toLowerCase();
    if (location.hash !== h) history.pushState(null, '', h || location.pathname + location.search);
    window.scrollTo(0, 0);
    if (view !== ViewState.HOME && !visited.includes(view)) {
      const next = [...visited, view];
      setVisited(next);
      try { localStorage.setItem('uxlab-visited', JSON.stringify(next)); } catch { /* privat */ }
    }
  };
  const visitedCount = HOME_SECTIONS.flatMap((s) => s.items).filter((i) => visited.includes(i.view)).length;

  const renderContent = () => {
    switch (currentView) {
      case ViewState.INTRO:
        return <IntroView />;
      case ViewState.FUNDAMENTALS:
        return <FundamentalsView />;
      case ViewState.THEORY:
        return <TheoryView />;
      case ViewState.ISO:
        return <IsoView />;
      case ViewState.GESTALT:
        return <GestaltView />;
      case ViewState.UX_LAWS:
        return <UxLawsView />;
      case ViewState.PERCEPTION:
        return <PerceptionView />;
      case ViewState.METHODS:
        return <DesignMethodsView />;
      case ViewState.AI_UX:
        return <AiUxView />;
      case ViewState.DESIGN_SYSTEM:
        return <DesignSystemView />;
      case ViewState.ACCESSIBILITY:
        return <AccessibilityView />;
      case ViewState.EVALUATION:
        return <EvaluationView />;
      case ViewState.LAB:
        return <BadUiLab />;
      case ViewState.QUIZ:
        return <QuizLab />;
      case ViewState.LITERATURE:
        return <LiteratureView />;
      case ViewState.GLOSSARY:
        return <GlossaryView />;
      case ViewState.HOME:
      default:
        return (
          <div className="max-w-[1024px] mx-auto pb-12 animate-fade-in">
            {/* Startseite im Stil der Portal-Startseite: Hero-Karte mit Bild, darunter Fotokarten */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-center gap-6 lg:gap-12 rounded-2xl border border-stone-200 bg-white p-6 md:p-10 lg:p-12 mb-6">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#7440A2] text-white grid place-items-center text-[17px] font-bold" aria-hidden="true">UX</div>
                <p className="mt-[22px] text-[11.5px] font-semibold uppercase tracking-[0.1em] text-stone-500">Lernmodul 06 · Nutzererfahrung &amp; Interface</p>
                <h1 className="mt-2.5 mb-3.5 text-[clamp(34px,4.6vw,48px)] leading-[1.12] font-bold tracking-[-0.02em] text-orange-600">UX-Grundlagen</h1>
                <p className="max-w-[54ch] text-[16.5px] leading-relaxed text-stone-600">
                  Wie entstehen Oberflächen, die Menschen verstehen und gerne benutzen? Von Heuristiken, Gestaltgesetzen und ISO 9241 über Wahrnehmung und Barrierefreiheit bis zu Evaluation, Designmethoden und KI. Mit Bad-UI-Labor, Quiz und Glossar.
                </p>
                <div className="mt-6 flex flex-col items-start gap-3">
                  <div className="flex flex-wrap gap-2.5">
                    <button type="button" onClick={() => setView(ViewState.INTRO)} className="inline-flex items-center gap-2 rounded-full border border-cta bg-cta px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-hover hover:border-cta-hover transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200">
                      Modul starten <ArrowRight size={16} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => setView(ViewState.LAB)} className="inline-flex items-center rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-stone-500 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200">
                      Zum Bad UI Labor
                    </button>
                  </div>
                  <a
                    href="downloads/ux-grundlagen-zusammenfassung.pdf"
                    download
                    aria-label="Zusammenfassung als PDF, 2 Seiten, 237 KB"
                    className="inline-flex items-center gap-2 rounded-full border border-[#15803D] bg-[#15803D] px-4 py-2.5 text-sm font-semibold text-white hover:bg-cta-hover hover:border-cta-hover transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200"
                  >
                    <Download size={16} aria-hidden="true" />
                    Zusammenfassung als PDF
                  </a>
                </div>
                <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-stone-500">
                  <span><b className="font-semibold text-stone-800">11</b> Kapitel</span>
                  <span><b className="font-semibold text-stone-800">Bad-UI</b>-Labor</span>
                  <span><b className="font-semibold text-stone-800">Quiz</b> &amp; Glossar</span>
                  <span>ca. <b className="font-semibold text-stone-800">5–6 Std.</b></span>
                </p>
              </div>
              <figure className="relative order-first lg:order-none m-0 overflow-hidden rounded-xl bg-stone-100 aspect-video lg:aspect-[4/3]">
                <KiBadge />
                <img src="img/einleitung.webp" alt="" width={1600} height={893} className="block w-full h-full object-cover" />
              </figure>
            </div>

            <div className="mb-10 grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] items-center gap-x-[18px] gap-y-3 rounded-xl border border-stone-200 bg-white px-5 py-4" aria-live="polite">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">Ihr Fortschritt</span>
              <div className="order-3 md:order-none col-span-2 md:col-span-1 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                <span className="block h-full bg-[#7440A2] transition-[width] duration-500" style={{ width: `${(visitedCount / HOME_COUNT) * 100}%` }} />
              </div>
              <b className="font-mono text-sm font-bold tabular-nums text-stone-800">{visitedCount} / {HOME_COUNT} Kapitel</b>
            </div>

            {HOME_SECTIONS.map((section) => (
              <section key={section.title} aria-labelledby={`sec-${section.key}`}>
                <div className="mt-10 mb-3.5 mx-1 flex items-baseline justify-between gap-3">
                  <h2 id={`sec-${section.key}`} className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-stone-500">{section.title}</h2>
                  <span className="text-[13px] text-stone-500">{section.note}</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
                  {section.items.map((item) => (
                    <li key={item.view} className="h-full">
                      <ProductCard {...item} visited={visited.includes(item.view)} onClick={() => setView(item.view)} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <footer className="mt-[72px] border-t border-stone-200 pt-[18px] text-[13px] text-stone-500">
              <p>© 2026 UX-Lernplattform · Lernmodul 06 · Prof. Dipl. Des. T. Hinz · Hochschule Karlsruhe, Fakultät IWI</p>
            </footer>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-orange-200 selection:text-stone-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[2000] bg-stone-900 text-white px-6 py-3 rounded-none font-bold uppercase tracking-widest">
        Zum Hauptinhalt
      </a>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      
      <Navigation currentView={currentView} setView={setView} />
      
      <main className="md:ml-64 pt-20 md:pt-12 px-4 md:px-12 lg:px-16 min-h-screen transition-all duration-300" id="main-content">
        {currentView !== ViewState.HOME && (
          <button type="button" onClick={() => setView(ViewState.HOME)} className="ux-content-head">
            <span className="mark" aria-hidden="true">UX</span>
            <span className="name">UX Lernmodul<small>06 · UX-Grundlagen</small></span>
          </button>
        )}
        {renderContent()}
        {currentView !== ViewState.HOME && <Pager current={currentView} setView={setView} />}
      </main>
    </div>
  );
}

const HOME_SECTIONS: { key: string; title: string; note: string; items: { number: string; title: string; subtitle: string; view: ViewState; imageUrl: string }[] }[] = [
  { key: 'theory', title: 'Theorie & Standards', note: 'Kapitel 01–07', items: [
    { number: '01', title: 'Grundlagen', subtitle: 'Einführung UX vs UI', view: ViewState.FUNDAMENTALS, imageUrl: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=1080' },
    { number: '02', title: 'Heuristiken', subtitle: 'Nielsens 10 Prinzipien', view: ViewState.THEORY, imageUrl: 'img/kapitel-heuristiken.webp' },
    { number: '03', title: 'Gestaltgesetze', subtitle: 'Wahrnehmung & Gruppierung', view: ViewState.GESTALT, imageUrl: 'https://images.pexels.com/photos/1092052/pexels-photo-1092052.jpeg?auto=compress&cs=tinysrgb&w=1080' },
    { number: '04', title: 'UX Grundsätze', subtitle: 'Laws of UX', view: ViewState.UX_LAWS, imageUrl: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg?auto=compress&cs=tinysrgb&w=1080' },
    { number: '05', title: 'Wahrnehmung', subtitle: 'Psychologie & Bias', view: ViewState.PERCEPTION, imageUrl: 'https://images.pexels.com/photos/2869318/pexels-photo-2869318.jpeg?auto=compress&cs=tinysrgb&w=1080' },
    { number: '06', title: 'ISO Normen', subtitle: 'DIN EN ISO 9241', view: ViewState.ISO, imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1080' },
    { number: '07', title: 'Barrierefreiheit', subtitle: 'Accessibility & WCAG', view: ViewState.ACCESSIBILITY, imageUrl: 'https://images.pexels.com/photos/3768145/pexels-photo-3768145.jpeg?auto=compress&cs=tinysrgb&w=1080' },
  ] },
  { key: 'practice', title: 'Praxis & Methoden', note: 'Kapitel 08–11', items: [
    { number: '08', title: 'Design Methoden', subtitle: 'Personas, Mapping & Co.', view: ViewState.METHODS, imageUrl: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1080' },
    { number: '09', title: 'Evaluation', subtitle: 'Methoden & Testing', view: ViewState.EVALUATION, imageUrl: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1080' },
    { number: '10', title: 'UX & KI', subtitle: 'Future of Design', view: ViewState.AI_UX, imageUrl: 'https://images.pexels.com/photos/6605568/pexels-photo-6605568.jpeg?auto=compress&cs=tinysrgb&w=1080' },
    { number: '11', title: 'Design Systems', subtitle: 'Tokens, Komponenten & Governance', view: ViewState.DESIGN_SYSTEM, imageUrl: 'img/kapitel-design-systems.webp' },
  ] },
  { key: 'campus', title: 'Campus & Interaktiv', note: 'Labor · Test · Nachschlagen', items: [
    { number: 'Lab', title: 'Bad UI Labor', subtitle: 'Interaktive Analyse', view: ViewState.LAB, imageUrl: 'https://images.pexels.com/photos/14600286/pexels-photo-14600286.jpeg?auto=compress&cs=tinysrgb&w=1080' },
    { number: '?', title: 'Quiz & Test', subtitle: 'Wissensüberprüfung', view: ViewState.QUIZ, imageUrl: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1080' },
    { number: 'Lit', title: 'Bibliothek', subtitle: 'Weiterführende Literatur', view: ViewState.LITERATURE, imageUrl: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1080' },
    { number: 'A–Z', title: 'Glossar', subtitle: 'Wissen A–Z', view: ViewState.GLOSSARY, imageUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=1080' },
  ] },
];
const HOME_COUNT = HOME_SECTIONS.reduce((n, s) => n + s.items.length, 0);

interface ProductCardProps {
  number: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  imageUrl: string;
  visited?: boolean;
}

const ProductCard = ({ number, title, subtitle, onClick, imageUrl, visited }: ProductCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#7440A2] hover:shadow-[0_8px_24px_rgba(100,55,140,.12)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-400 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
  >
    <div className="relative isolate aspect-[16/10] bg-stone-100">
      {/* Farbig im Ruhezustand, beim Überfahren Schwarz-Weiß (in allen Lern-Apps gleich) */}
      <img src={imageUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-300 motion-reduce:transition-none group-hover:grayscale group-hover:contrast-110 group-focus-visible:grayscale group-focus-visible:contrast-110" />
      {isKiImage(imageUrl) && <KiBadge />}
      {visited && <span className="absolute z-[2] top-3 left-3 rounded-full bg-green-700 px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-white">Besucht</span>}
      <span className="absolute z-[2] left-4 -bottom-5 min-w-[42px] h-[42px] px-2 rounded-[10px] bg-[#7440A2] text-white grid place-items-center text-sm font-bold tabular-nums shadow-[0_0_0_3px_#fff]" aria-hidden="true">
        {number}
      </span>
    </div>
    <div className="flex flex-1 flex-col px-5 pt-8 pb-5">
      <h3 className="mb-1 text-lg font-bold leading-snug text-stone-800">{title}</h3>
      <p className="flex-1 text-sm leading-normal text-stone-600">{subtitle}</p>
      <span className="mt-4 self-start inline-flex items-center gap-2 rounded-lg bg-orange-50 px-3.5 py-2 text-[13.5px] font-semibold text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
        Kapitel öffnen <span aria-hidden="true" className="transition-transform group-hover:translate-x-[3px]">→</span>
      </span>
    </div>
  </button>
);

// Zurück / Weiter am Seitenende, wie in den anderen Lern-Apps
const Pager = ({ current, setView }: { current: ViewState; setView: (v: ViewState) => void }) => {
  const pages = [{ title: 'Übersicht', view: ViewState.HOME }, { title: 'Einleitung', view: ViewState.INTRO }, ...HOME_SECTIONS.flatMap((s) => s.items)];
  const i = pages.findIndex((p) => p.view === current);
  if (i < 0) return null;
  const prev = pages[i - 1];
  const next = pages[i + 1];
  const link = 'grid gap-1.5 max-w-[48%] min-w-0 text-stone-800 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200 rounded transition-colors';
  const small = 'text-[13px] font-semibold uppercase tracking-[0.14em] text-stone-500';
  return (
    <nav aria-label="Kapitel blättern" className="max-w-[1024px] mx-auto mt-16 mb-12 pt-9 border-t border-stone-200 flex justify-between items-start gap-6">
      {prev ? (
        <button type="button" onClick={() => setView(prev.view)} className={`${link} text-left`}>
          <small className={small}><span aria-hidden="true">←</span> Zurück</small>
          <b className="text-xl font-bold leading-snug">{prev.title}</b>
        </button>
      ) : <span />}
      {next ? (
        <button type="button" onClick={() => setView(next.view)} className={`${link} text-right justify-items-end`}>
          <small className={small}>Weiter <span aria-hidden="true">→</span></small>
          <b className="text-xl font-bold leading-snug">{next.title}</b>
        </button>
      ) : <span />}
    </nav>
  );
};
