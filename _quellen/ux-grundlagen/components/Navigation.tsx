import React, { useState } from 'react';
import { ViewState } from '../types';
import { ContentDownload } from './ContentDownload';
import { ThemeToggle, FeedbackLink } from './ThemeToggle';
import { 
  Menu, 
  X, 
  Home, 
  Component,
  Lightbulb, 
  BookOpenText,
  Search, 
  BookOpen, 
  Eye, 
  Accessibility, 
  BarChart2, 
  FlaskConical, 
  GraduationCap, 
  Library,
  PenTool, 
  Bot,
  Brain,
  BookA,
  Scale,
  ChevronLeft
} from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navGroups = [
    {
      title: null, // Main group
      items: [
        { label: 'Übersicht', view: ViewState.HOME, icon: Home },
      ]
    },
    {
      title: 'Theorie & Standards',
      items: [
        { label: 'Einleitung', view: ViewState.INTRO, icon: BookOpenText },
        { label: 'Grundlagen', view: ViewState.FUNDAMENTALS, icon: Lightbulb },
        { label: 'Heuristiken', view: ViewState.THEORY, icon: Search },
        { label: 'Gestaltgesetze', view: ViewState.GESTALT, icon: Eye },
        { label: 'UX Grundsätze', view: ViewState.UX_LAWS, icon: Scale },
        { label: 'Wahrnehmung', view: ViewState.PERCEPTION, icon: Brain },
        { label: 'ISO Normen', view: ViewState.ISO, icon: BookOpen },
        { label: 'Barrierefreiheit', view: ViewState.ACCESSIBILITY, icon: Accessibility },
      ]
    },
    {
      title: 'Praxis & Methoden',
      items: [
        { label: 'Design Methoden', view: ViewState.METHODS, icon: PenTool },
        { label: 'Evaluation', view: ViewState.EVALUATION, icon: BarChart2 },
        { label: 'UX & KI', view: ViewState.AI_UX, icon: Bot },
        { label: 'Design Systems', view: ViewState.DESIGN_SYSTEM, icon: Component },
      ]
    },
    {
      title: 'Campus & Interaktiv',
      items: [
        { label: 'Bad UI Lab', view: ViewState.LAB, icon: FlaskConical },
        { label: 'Quiz', view: ViewState.QUIZ, icon: GraduationCap },
        { label: 'Literatur', view: ViewState.LITERATURE, icon: Library },
        { label: 'Glossar', view: ViewState.GLOSSARY, icon: BookA },
      ]
    }
  ];

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col flex-1 shrink-0">
      {/* Zurück zur Startseite aller Lern-Apps */}
      <a
        href="../"
        aria-label="Zurück zur Übersicht aller Lern-Apps"
        className="lern-back group/back mx-3 mt-4 flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-xl border border-orange-600 bg-orange-600 text-white hover:border-orange-700 hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200 transition-colors"
      >
        <ChevronLeft size={16} strokeWidth={2.2} aria-hidden="true" className="shrink-0 text-white/75 group-hover/back:text-white group-hover/back:-translate-x-0.5 transition" />
        <span className="shrink-0 w-[27px] h-[27px] mt-1.5 mr-1.5 rounded-[7px] bg-white text-orange-600 grid place-items-center font-bold text-sm shadow-[3px_-3px_0_rgba(255,255,255,.55),6px_-6px_0_rgba(255,255,255,.28)]">L</span>
        <span className="flex flex-col text-sm font-bold leading-tight">
          Lern-Apps
          <small className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-orange-100">Alle Module</small>
        </span>
      </a>

      {/* Logo Area – ausgeblendet: mobil zeigt die Kopfleiste Logo und Titel, auf dem Desktop steht der Kopf im Contentbereich (App.tsx) */}
      <div className="px-6 pt-3 pb-4 hidden items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] bg-orange-600 flex items-center justify-center text-white font-bold text-base">
          UX
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-stone-800 leading-tight">UX Lernmodul</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-stone-400 mt-0.5">07 · UX-Grundlagen</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 pb-4 space-y-1">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-2 last:mb-0">
            {group.title && (
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-stone-400 px-4 mb-1.5 mt-4 select-none">
                {group.title}
              </h3>
            )}
            
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = currentView === item.view;
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.view)}
                    className={`${item.view === ViewState.HOME ? (isActive ? 'nav-home is-active ' : 'nav-home ') : ''}w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                      isActive 
                        ? 'bg-orange-600 text-white' 
                        : 'text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <Icon 
                      size={18} 
                      strokeWidth={isActive ? 2 : 1.5} 
                      className={`${isActive ? 'text-white' : 'text-stone-500 group-hover:text-stone-800'} transition-colors`} 
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Info */}
      <div className="p-6 pt-3 border-t border-stone-200 text-xs text-stone-500 bg-white">
        <div className="-mx-3 mb-3"><ThemeToggle /><FeedbackLink /></div>
        <p>UX Lernplattform v1.1</p>
        <ContentDownload />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex md:flex-col fixed top-0 left-0 bottom-0 w-64 bg-white z-50 overflow-y-auto border-r border-stone-200">
        <div className="h-[3px] shrink-0 bg-gradient-to-r from-[#DE6A10] via-[#E99A5C] to-[#DE6A10]" />
        <SidebarContent />
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white z-50 flex items-center justify-between px-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
            UX
          </div>
          <span className="text-lg font-bold text-stone-800 tracking-tight">UX Lernmodul</span>
        </div>
        <button 
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
          className="text-stone-500 hover:text-stone-800 p-2 rounded-lg hover:bg-stone-100 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <nav id="mobile-nav" aria-label="Kapitelnavigation" className="md:hidden fixed inset-0 z-40 bg-white pt-16 animate-fade-in overflow-y-auto">
          <SidebarContent />
        </nav>
      )}
    </>
  );
};
