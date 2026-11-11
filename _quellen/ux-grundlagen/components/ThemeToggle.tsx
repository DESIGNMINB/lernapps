import React, { useEffect, useState } from 'react';
import { Sun, Moon, Mail } from 'lucide-react';

/* Dunkelmodus-Schalter wie im TypoLab. Die Logik liegt in ../theme.js (gemeinsam für alle Lern-Apps). */
export const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');
  useEffect(() => {
    const on = () => setDark(document.documentElement.getAttribute('data-theme') === 'dark');
    window.addEventListener('lernapps-theme', on);
    window.addEventListener('storage', on);
    return () => { window.removeEventListener('lernapps-theme', on); window.removeEventListener('storage', on); };
  }, []);
  return (
    <button
      type="button"
      data-theme-toggle
      aria-pressed={dark}
      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-stone-600 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200"
    >
      <Sun size={16} aria-hidden="true" />
      <span className="flex-1 text-left">Dunkelmodus</span>
      <span className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${dark ? 'bg-[#9254D1]' : 'bg-stone-200'}`} aria-hidden="true">
        <span className={`absolute left-[3px] top-[3px] h-4 w-4 rounded-full bg-white shadow transition-transform ${dark ? 'translate-x-[18px]' : ''}`} style={{ backgroundColor: '#fff' }} />
      </span>
      <Moon size={16} aria-hidden="true" />
    </button>
  );
};

/* Feedback per E-Mail. Die Adresse steht nicht im Code der Seite, sondern wird erst beim Klick
   in ../theme.js zusammengesetzt (spamsicher). */
export const FeedbackLink: React.FC = () => (
  <a
    href="#"
    data-feedback
    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium leading-snug text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200"
  >
    <Mail size={16} aria-hidden="true" className="shrink-0" />
    <span>
      Feedback senden
      <small className="block text-[11.5px] font-normal text-stone-500">Fehler oder Verbesserungsvorschläge</small>
    </span>
  </a>
);
