import React from 'react';

/* Einleitung des Moduls – Aufbau wie in den Lern-Apps Logo- und Farbgestaltung */

const AREAS = [
  {
    title: 'Verstehen',
    sub: 'Wie Menschen wahrnehmen und denken',
    text: 'Gestaltgesetze, Wahrnehmungspsychologie und die Laws of UX erklären, warum manche Oberflächen mühelos wirken und andere scheitern.',
    q: 'Leitfrage: „Warum versteht man das sofort?“',
  },
  {
    title: 'Bewerten',
    sub: 'Maßstäbe für gute Oberflächen',
    text: 'Nielsens Heuristiken, die Interaktionsprinzipien der ISO 9241 und die WCAG geben überprüfbare Kriterien für Gebrauchstauglichkeit und Barrierefreiheit.',
    q: 'Leitfrage: „Woran erkenne ich, dass es gut ist?“',
  },
  {
    title: 'Gestalten',
    sub: 'Methoden für den Prozess',
    text: 'Personas, Journey Maps, Wireframes, Prototypen und Usability-Tests bringen Nutzende in jeden Schritt. Dazu kommt die Frage, was KI im Prozess verändert.',
    q: 'Leitfrage: „Wie finde ich heraus, was Menschen brauchen?“',
  },
];

const GOALS = [
  'Usability und User Experience voneinander abgrenzen,',
  'Oberflächen mit Nielsens zehn Heuristiken bewerten,',
  'Gestaltgesetze und Laws of UX gezielt in Layouts einsetzen,',
  'Wahrnehmung und Denkfehler bei Gestaltung und Auswertung berücksichtigen,',
  'die Interaktionsprinzipien der DIN EN ISO 9241-110 erläutern,',
  'Gestaltungen nach WCAG auf Barrierefreiheit prüfen,',
  'Personas, Journey Maps, Wireframes, Prototypen und Usability-Tests anwenden,',
  'KI-Werkzeuge im UX-Prozess verantwortungsvoll einsetzen.',
];

const STEPS = [
  { label: '1 · Lesen', text: 'Die Kapitel 01–10 bauen aufeinander auf. Fachbegriffe sind im Glossar erklärt.' },
  { label: '2 · Üben', text: 'Im Bad-UI-Labor analysieren Sie fehlerhafte Oberflächen. Dazu kommen Übungen in den Kapiteln, etwa zu Personas und Journey Maps.' },
  { label: '3 · Prüfen', text: 'Das Quiz fasst das Modul zusammen. Besuchte Kapitel werden in diesem Browser gespeichert.' },
];

export const IntroView: React.FC = () => (
  <div className="animate-fade-in max-w-[1024px] mx-auto pb-8">
    <p className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-2">Einleitung</p>
    <h1 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600">
      Warum User Experience gestalten?
    </h1>
    <p className="mt-6 max-w-[64ch] text-[19px] leading-relaxed text-stone-600">
      Jede Oberfläche ist ein Gespräch zwischen Mensch und System. Ob jemand eine Aufgabe schnell erledigt, unsicher abbricht oder sich
      gar nicht erst zurechtfindet, entscheidet sich an vielen kleinen Gestaltungsfragen. UX-Design macht diese Fragen sichtbar und
      beantwortet sie mit Wissen über Menschen statt mit Vermutungen.
    </p>
    <hr className="my-8 border-stone-200" />

    <figure className="mb-10">
      <img
        src="img/einleitung.webp"
        alt="Eine Frau probiert in einem Café eine App auf dem Smartphone aus, ein Designer daneben beobachtet und macht Notizen in einem Skizzenbuch mit Screen-Entwürfen"
        width={1600}
        height={893}
        className="block w-full h-auto aspect-video object-cover rounded-2xl bg-stone-100"
      />
      <figcaption className="mt-2.5 text-[13px] text-stone-500">
        Gute Gestaltung beginnt mit Beobachten: Wie gehen Menschen wirklich mit einem Produkt um? KI-generiert mit Magnific.
      </figcaption>
    </figure>

    <h2 className="text-2xl font-bold text-stone-900 mt-11 mb-4">Was Sie in diesem Modul erwartet</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {AREAS.map((a) => (
        <div key={a.title} className="rounded-2xl border border-stone-200 bg-white p-6 text-[15px] leading-relaxed text-stone-600">
          <h3 className="text-lg font-bold text-orange-600">{a.title}</h3>
          <p className="text-[13px] text-stone-500">{a.sub}</p>
          <p className="mt-3">{a.text}</p>
          <p className="mt-3 font-semibold text-stone-900">{a.q}</p>
        </div>
      ))}
    </div>

    <h2 className="text-2xl font-bold text-stone-900 mt-11 mb-4">Lernziele</h2>
    <p className="text-stone-600 mb-2">Nach Bearbeitung des Moduls können Sie …</p>
    <ul className="list-disc pl-5 space-y-1.5 text-stone-600 leading-relaxed marker:text-orange-500">
      {GOALS.map((g) => <li key={g}>{g}</li>)}
    </ul>

    <h2 className="text-2xl font-bold text-stone-900 mt-11 mb-4">So arbeiten Sie mit dem Modul</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {STEPS.map((s) => (
        <div key={s.label} className="rounded-2xl bg-stone-100 p-6 text-[15px] leading-relaxed text-stone-600">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-900">{s.label}</p>
          <p className="mt-2.5">{s.text}</p>
        </div>
      ))}
    </div>
    <div className="mt-6 flex items-start gap-3 rounded-xl bg-orange-50 px-5 py-4 text-[15px] leading-relaxed text-stone-800">
      <span className="flex-none w-[22px] h-[22px] rounded-full bg-orange-600 text-white grid place-items-center text-xs font-bold" aria-hidden="true">i</span>
      <p><strong>Zeitbedarf:</strong> etwa 5–6 Stunden für alle Kapitel und Übungen. Die Kapitel funktionieren auch einzeln, etwa als Vorbereitung auf eine Seminarsitzung.</p>
    </div>
  </div>
);
