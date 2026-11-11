import React, { useMemo, useState } from 'react';

/* ------------------------------------------------------------------
   Kapitel 11 · Design Systems
   Inhalte aus dem früheren „Design System“ der Typografie-App (TypoLab)
   als Fallbeispiel übernommen und vertieft. Stand November 2026.
   ------------------------------------------------------------------ */

// Kontrast nach WCAG 2.x
const hexToRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h: string) => {
  const [r, g, b] = hexToRgb(h).map((v) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const fmt = (n: number) => n.toFixed(2).replace('.', ',');

/* Primitive Paletten: jeweils Stufe 600 (hell) und 300 (für den Dunkelmodus) */
const PALETTES = [
  { id: 'purple', name: 'Lila', p600: '#64378C', p100: '#F1EEF4', p300: '#C8A8DE', p900: '#2A2140' },
  { id: 'blue', name: 'Blau', p600: '#1D4ED8', p100: '#DBEAFE', p300: '#93C5FD', p900: '#172554' },
  { id: 'green', name: 'Grün', p600: '#15803D', p100: '#DCFCE7', p300: '#86EFAC', p900: '#14532D' },
  { id: 'orange', name: 'Orange', p600: '#F97316', p100: '#FFEDD5', p300: '#FDBA74', p900: '#431407' },
];

const LEVELS = ['Primitiv', 'Semantisch', 'Komponente'] as const;
type Level = typeof LEVELS[number];
const MATCH: { token: string; level: Level; why: string }[] = [
  { token: 'color.purple.600', level: 'Primitiv', why: 'Ein Rohwert aus der Palette, ohne Aussage über seinen Zweck.' },
  { token: 'color.action.primary', level: 'Semantisch', why: 'Beschreibt eine Rolle: die Farbe der wichtigsten Aktion.' },
  { token: 'button.primary.background', level: 'Komponente', why: 'Gilt nur für eine Komponente und verweist auf einen semantischen Token.' },
  { token: 'space.4', level: 'Primitiv', why: 'Ein Wert aus der Abstandsskala (hier 16 px), ohne Verwendungszweck.' },
  { token: 'color.text.default', level: 'Semantisch', why: 'Die Rolle „normaler Text“. Im Dunkelmodus zeigt sie auf einen anderen Rohwert.' },
  { token: 'card.padding', level: 'Komponente', why: 'Der Innenabstand genau einer Komponente, der Karte.' },
  { token: 'color.feedback.error', level: 'Semantisch', why: 'Die Rolle „Fehler“, unabhängig davon, welches Rot dahintersteht.' },
  { token: 'font.size.300', level: 'Primitiv', why: 'Eine Stufe der Schriftgrößenskala, noch ohne Zuordnung zu Überschrift oder Fließtext.' },
];

const STATES = [
  { id: 'default', label: 'Standard', note: 'Ruhezustand. Hintergrund color.action.primary, Text color.text.on-action.' },
  { id: 'hover', label: 'Hover', note: 'Zeiger über dem Button: etwas dunklerer Ton (color.action.primary-hover). Auf Touch-Geräten gibt es diesen Zustand nicht, er darf also nie Information allein tragen.' },
  { id: 'focus', label: 'Fokus', note: 'Per Tastatur erreicht: sichtbarer Fokusring mit mindestens 3 : 1 Kontrast zur Umgebung (WCAG 2.4.7 und 1.4.11).' },
  { id: 'active', label: 'Gedrückt', note: 'Kurzer Zustand beim Klicken oder Tippen. Leicht verkleinert oder abgedunkelt, damit die Aktion spürbar wird.' },
  { id: 'disabled', label: 'Deaktiviert', note: 'Nicht bedienbar. Besser erklären, warum, oder den Button aktiv lassen und beim Absenden einen Hinweis zeigen. Deaktivierte Elemente sind von den WCAG-Kontrastanforderungen ausgenommen.' },
  { id: 'loading', label: 'Lädt', note: 'Aktion läuft: Spinner und gleichbleibende Breite, damit nichts springt. Für Screenreader aria-busy="true" und eine Statusmeldung.' },
] as const;
type StateId = typeof STATES[number]['id'];

const SYSTEMS = [
  { name: 'Material Design 3', by: 'Google', focus: 'Android, Web, Flutter', note: 'Dynamische Farbe aus einem Ausgangston, umfangreiches Token-System. Mit Material 3 Expressive (2025) mehr Form, Farbe und Bewegung.', url: 'https://m3.material.io' },
  { name: 'Human Interface Guidelines', by: 'Apple', focus: 'iOS, iPadOS, macOS, watchOS, visionOS', note: 'Vor allem Richtlinien zu Plattform-Konventionen. Die Komponenten liefert das Betriebssystem über SwiftUI und UIKit. Seit 2025 mit der Gestaltungssprache Liquid Glass.', url: 'https://developer.apple.com/design/human-interface-guidelines' },
  { name: 'Carbon', by: 'IBM', focus: 'Web (React, Web Components)', note: 'Open Source, für komplexe Geschäftsanwendungen. Themes und Ebenen-Tokens für Flächen, Schrift IBM Plex.', url: 'https://carbondesignsystem.com' },
  { name: 'GOV.UK Design System', by: 'UK Government Digital Service', focus: 'Öffentliche Dienste im Web', note: 'Barrierefreiheit und Einfachheit stehen über allem. Muster sind mit echten Nutzenden getestet, Beiträge laufen über ein offenes Contribution-Modell mit Kriterien.', url: 'https://design-system.service.gov.uk' },
];

const SOURCES = [
  ['Design Tokens Community Group (W3C): Design Tokens Format Module 2025.10', 'https://www.designtokens.org'],
  ['Brad Frost: Atomic Design (2016)', 'https://atomicdesign.bradfrost.com'],
  ['Semantic Versioning 2.0.0', 'https://semver.org/lang/de/'],
  ['Figma: Variables (Design Tokens in Figma)', 'https://help.figma.com/hc/en-us/articles/15339657135383'],
  ['GOV.UK Design System: Contribution criteria', 'https://design-system.service.gov.uk/community/contribution-criteria/'],
  ['W3C: Web Content Accessibility Guidelines (WCAG) 2.2', 'https://www.w3.org/TR/WCAG22/'],
];

const card = 'bg-white border border-stone-200 rounded-lg p-6';
const h3 = 'text-2xl font-serif font-bold text-stone-900';
const label = 'text-[11px] font-semibold uppercase tracking-[0.1em] text-stone-500';

export const DesignSystemView: React.FC = () => {
  /* ---------- Token-Editor ---------- */
  const [pal, setPal] = useState('purple');
  const [radius, setRadius] = useState(8);
  const [base, setBase] = useState<4 | 8>(8);
  const [ratio, setRatio] = useState(1.25);
  const [dark, setDark] = useState(false);
  const P = PALETTES.find((p) => p.id === pal)!;
  const sem = useMemo(() => ({
    'color.background.surface': dark ? '#1A1D27' : '#FFFFFF',
    'color.text.default': dark ? '#F3F4F6' : '#1F2937',
    'color.text.muted': dark ? '#9CA3AF' : '#5B6270',
    'color.action.primary': dark ? P.p300 : P.p600,
    'color.text.on-action': dark ? '#111827' : '#FFFFFF',
    'color.action.subtle': dark ? P.p900 : P.p100,
    'color.border.default': dark ? '#2D3148' : '#E5E7EB',
  }), [dark, P]);
  const onAction = contrast(sem['color.action.primary'], sem['color.text.on-action']);
  const actionOnSurface = contrast(sem['color.action.primary'], sem['color.background.surface']);
  const sz = (step: number) => Math.round(16 * ratio ** step);
  const sp = (n: number) => n * base;
  const vars = {
    '--ds-surface': sem['color.background.surface'], '--ds-text': sem['color.text.default'], '--ds-muted': sem['color.text.muted'],
    '--ds-action': sem['color.action.primary'], '--ds-on-action': sem['color.text.on-action'], '--ds-subtle': sem['color.action.subtle'],
    '--ds-border': sem['color.border.default'], '--ds-radius': `${radius}px`,
  } as React.CSSProperties;

  /* ---------- Zuordnung ---------- */
  const [answers, setAnswers] = useState<Record<string, Level | ''>>({});
  const [checked, setChecked] = useState(false);
  const right = MATCH.filter((m) => answers[m.token] === m.level).length;

  /* ---------- Zustände ---------- */
  const [state, setState] = useState<StateId>('default');
  const [variant, setVariant] = useState<'primary' | 'secondary'>('primary');
  const st = STATES.find((s) => s.id === state)!;
  const btnStyle: React.CSSProperties = (() => {
    const primary = variant === 'primary';
    const s: React.CSSProperties = {
      background: primary ? '#64378C' : '#FFFFFF', color: primary ? '#FFFFFF' : '#64378C', border: '2px solid #64378C',
      borderRadius: 8, padding: '10px 20px', minHeight: 44, minWidth: 168, font: '600 15px/1.2 "IBM Plex Sans", system-ui, sans-serif',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'none',
    };
    if (state === 'hover') { s.background = primary ? '#4E2A6E' : '#F1EEF4'; s.borderColor = primary ? '#4E2A6E' : '#64378C'; }
    if (state === 'focus') { s.boxShadow = '0 0 0 3px #FFFFFF, 0 0 0 6px #1F2937'; }
    if (state === 'active') { s.background = primary ? '#3D2157' : '#E6DCEF'; s.transform = 'scale(.97)'; }
    if (state === 'disabled') { s.background = '#E5E7EB'; s.color = '#6B7280'; s.borderColor = '#E5E7EB'; }
    return s;
  })();

  return (
    <div className="space-y-16 animate-fade-in max-w-6xl mx-auto">
      <header className="border-b border-stone-200 pb-8">
        <span className="inline-block px-3 py-1 rounded-full border border-stone-300 text-xs font-bold uppercase tracking-widest text-stone-600 mb-4">
          Systematisch gestalten
        </span>
        <h2 className="text-[clamp(34px,5vw,52px)] leading-[1.08] font-bold tracking-[-0.01em] text-orange-600">Design Systems</h2>
        <p className="text-stone-600 mt-4 text-lg font-light max-w-3xl">
          Ein Design System ist die gemeinsame Sprache von Design und Entwicklung: Prinzipien, Design Tokens, Komponenten, Muster und ihre Dokumentation, gepflegt wie ein Produkt. Es sorgt dafür, dass viele Menschen über lange Zeit konsistente, barrierefreie Oberflächen bauen, ohne jede Entscheidung neu zu treffen.
        </p>
      </header>

      {/* 1 · Begriffe */}
      <section aria-labelledby="ds-what">
        <h3 id="ds-what" className={`${h3} mb-6`}>Was ist ein Design System und was nicht?</h3>
        <p className="text-stone-600 max-w-3xl mb-8">Im Alltag werden die Begriffe oft vermischt. Sinnvoll ist diese Abgrenzung: Jede Stufe enthält die vorherige und geht darüber hinaus.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ['Styleguide', 'Regeln für das Erscheinungsbild: Farben, Schriften, Logo, Bildsprache, Tonalität. Oft ein PDF oder eine Webseite, ohne Code.'],
            ['UI-Kit', 'Fertige Bausteine in einem Design-Werkzeug, etwa eine Figma-Bibliothek mit Buttons, Formularfeldern und Karten. Schnell im Entwurf, aber ohne Verbindung zum Produktcode.'],
            ['Pattern Library', 'Dokumentierte Muster und Komponenten mit Code-Beispielen, etwa „Formular mit Fehlermeldung“. Zeigt, wie etwas gebaut wird.'],
            ['Design System', 'Alles zusammen plus Prinzipien, Design Tokens, Barrierefreiheit, Versionierung und Governance: wer entscheidet, wer beiträgt, wie Änderungen ausgeliefert werden.'],
          ].map(([t, d], i) => (
            <div key={t} className={card}>
              <div className="flex items-baseline gap-3 mb-2"><span className="text-3xl font-serif font-bold text-stone-400" aria-hidden="true">{i + 1}</span><h4 className="text-lg font-bold text-stone-900">{t}</h4></div>
              <p className="text-stone-600 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2 · Design Tokens */}
      <section aria-labelledby="ds-tokens">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 pt-8 border-t border-stone-200">
          <h3 id="ds-tokens" className={h3}>Design Tokens: Entscheidungen mit Namen</h3>
          <span className="text-sm font-mono text-stone-400">DTCG Format 2025.10</span>
        </div>
        <p className="text-stone-600 max-w-3xl mb-6">Ein Design Token ist ein benannter Gestaltungswert, etwa eine Farbe, ein Abstand oder eine Schriftgröße. Statt <span className="font-mono text-sm">#64378C</span> an hundert Stellen steht im Code <span className="font-mono text-sm">color.action.primary</span>. Wird der Wert geändert, ändert sich jede Stelle mit. Bewährt haben sich drei Ebenen:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            ['1 · Primitiv', 'color.purple.600 = #64378C', 'Rohwerte der Palette und der Skalen. Beschreiben, was ein Wert ist, nicht wofür.'],
            ['2 · Semantisch', 'color.action.primary → color.purple.600', 'Rollen mit Bedeutung. Hier wird umgeschaltet, etwa für den Dunkelmodus oder eine zweite Marke.'],
            ['3 · Komponente', 'button.primary.background → color.action.primary', 'Werte einer einzelnen Komponente. Optional, sinnvoll bei großen Systemen.'],
          ].map(([t, code, d]) => (
            <div key={t} className={card}>
              <div className={label}>{t}</div>
              <p className="font-mono text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded px-2 py-1.5 my-3 break-words">{code}</p>
              <p className="text-stone-600 text-sm leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={card}>
            <div className={label}>Im Code: CSS Custom Properties</div>
            <pre className="mt-3 text-xs leading-relaxed font-mono text-stone-800 bg-stone-50 border border-stone-200 rounded p-4 overflow-x-auto">{`:root {
  --color-purple-600: #64378C;      /* primitiv   */
  --color-action-primary: var(--color-purple-600);
  --button-primary-bg: var(--color-action-primary);
}
[data-theme="dark"] {
  --color-action-primary: var(--color-purple-300);
}
.button--primary { background: var(--button-primary-bg); }`}</pre>
          </div>
          <div className={card}>
            <div className={label}>Standard und Werkzeuge</div>
            <ul className="mt-3 space-y-2 text-sm text-stone-700 leading-relaxed list-disc pl-5">
              <li>Die Design Tokens Community Group des W3C hat ihr Austauschformat am 28. 10. 2025 erstmals als stabile Version 2025.10 veröffentlicht. Tokens werden darin als JSON mit <span className="font-mono">$value</span> und <span className="font-mono">$type</span> beschrieben.</li>
              <li>Werkzeuge wie Style Dictionary, Tokens Studio oder Terrazzo erzeugen daraus CSS-Variablen, iOS- und Android-Ressourcen.</li>
              <li>Figma bildet Tokens seit 2023 als Variables ab. Mit Modes wechselt ein Entwurf zwischen hell und dunkel oder zwischen Marken.</li>
              <li>Namen beschreiben Absicht statt Aussehen: <span className="font-mono">color.feedback.error</span> statt <span className="font-mono">red</span>.</li>
            </ul>
          </div>
        </div>

        {/* Token-Editor */}
        <div className="mt-10 bg-stone-50 border border-stone-200 rounded-lg p-6 md:p-8">
          <div className={label}>Ausprobieren · Token-Editor</div>
          <h4 className="text-xl font-bold text-stone-900 mt-2 mb-1">Ein Token ändern, alle Komponenten folgen</h4>
          <p className="text-stone-600 text-sm mb-6 max-w-3xl">Die Vorschau rechts verwendet ausschließlich Tokens. Ändern Sie die primitiven Werte und schalten Sie den Modus um. Beobachten Sie, wie die semantischen Tokens neu auflösen und ob der Kontrast hält.</p>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8">
            <div className="space-y-5">
              <fieldset>
                <legend className="text-sm font-semibold text-stone-800 mb-2">Markenpalette (primitiv)</legend>
                <div className="flex flex-wrap gap-2">
                  {PALETTES.map((p) => (
                    <button key={p.id} type="button" aria-pressed={pal === p.id} onClick={() => setPal(p.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200 ${pal === p.id ? 'border-stone-900 text-stone-900' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}>
                      <span className="w-4 h-4 rounded-full" style={{ background: p.p600 }} aria-hidden="true" />{p.name}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="ds-radius" className="text-sm font-semibold text-stone-800 flex justify-between"><span>Eckenradius <span className="font-mono font-normal">radius.md</span></span><span className="font-mono">{radius} px</span></label>
                <input id="ds-radius" type="range" min={0} max={20} value={radius} aria-valuetext={`${radius} px`} onChange={(e) => setRadius(+e.target.value)} className="w-full mt-2 accent-[#64378C]" />
              </div>
              <fieldset>
                <legend className="text-sm font-semibold text-stone-800 mb-2">Abstands-Basis <span className="font-mono font-normal">space.1</span></legend>
                <div className="flex gap-2">
                  {[4, 8].map((b) => (
                    <button key={b} type="button" aria-pressed={base === b} onClick={() => setBase(b as 4 | 8)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200 ${base === b ? 'border-stone-900 text-stone-900' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}>{b} px</button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="ds-ratio" className="text-sm font-semibold text-stone-800">Typo-Skala (Verhältnis)</label>
                <select id="ds-ratio" value={ratio} onChange={(e) => setRatio(+e.target.value)} className="mt-2 w-full rounded border border-stone-300 bg-white text-stone-800 px-3 py-2 text-sm">
                  <option value={1.125}>1,125 · große Sekunde (ruhig)</option>
                  <option value={1.25}>1,25 · große Terz (ausgewogen)</option>
                  <option value={1.333}>1,333 · Quarte (kontrastreich)</option>
                </select>
              </div>
              <fieldset>
                <legend className="text-sm font-semibold text-stone-800 mb-2">Modus</legend>
                <div className="flex gap-2">
                  {[['Hell', false], ['Dunkel', true]].map(([n, d]) => (
                    <button key={String(n)} type="button" aria-pressed={dark === d} onClick={() => setDark(d as boolean)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200 ${dark === d ? 'border-stone-900 text-stone-900' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}>{n as string}</button>
                  ))}
                </div>
              </fieldset>
              <div className="border-t border-stone-200 pt-4">
                <div className={label}>Semantische Tokens, aufgelöst</div>
                <dl className="mt-2 space-y-1 text-xs font-mono">
                  {Object.entries(sem).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-3"><dt className="text-stone-600 truncate">{k}</dt><dd className="flex items-center gap-2 text-stone-800"><span className="w-3.5 h-3.5 rounded-sm border border-stone-300" style={{ background: v }} aria-hidden="true" />{v}</dd></div>
                  ))}
                </dl>
              </div>
            </div>

            <div>
              <div style={{ ...vars, background: 'var(--ds-surface)', color: 'var(--ds-text)', borderRadius: 'calc(var(--ds-radius) + 4px)', border: '1px solid var(--ds-border)', padding: sp(3), fontFamily: '"IBM Plex Sans", system-ui, sans-serif' }} aria-label="Vorschau aus Tokens" role="group">
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ds-muted)' }}>Mensa-App · Heute</div>
                <div style={{ fontSize: sz(3), fontWeight: 700, lineHeight: 1.15, margin: `${sp(1)}px 0 ${sp(1)}px` }}>Tagesgericht</div>
                <p style={{ fontSize: sz(0), lineHeight: 1.5, color: 'var(--ds-muted)', margin: `0 0 ${sp(2)}px` }}>Linsen-Curry mit Reis. Vegan, 4,20 €.</p>
                <div style={{ background: 'var(--ds-subtle)', borderRadius: 'var(--ds-radius)', padding: sp(2), marginBottom: sp(2), fontSize: sz(-1) }}>Hinweis: Heute bis 14 Uhr geöffnet.</div>
                <label style={{ display: 'block', fontSize: sz(-1), fontWeight: 600, marginBottom: sp(1) / 2 }} htmlFor="ds-prev-in">Anmerkung</label>
                <input id="ds-prev-in" placeholder="z. B. ohne Koriander" style={{ width: '100%', boxSizing: 'border-box', padding: `${sp(1)}px ${sp(1.5)}px`, border: '1px solid var(--ds-border)', borderRadius: 'var(--ds-radius)', background: 'var(--ds-surface)', color: 'var(--ds-text)', fontSize: sz(0), marginBottom: sp(2) }} />
                <div style={{ display: 'flex', gap: sp(1), flexWrap: 'wrap' }}>
                  <button type="button" style={{ background: 'var(--ds-action)', color: 'var(--ds-on-action)', border: 0, borderRadius: 'var(--ds-radius)', padding: `${sp(1.25)}px ${sp(2.5)}px`, minHeight: 44, fontWeight: 600, fontSize: sz(0) }}>Bestellen</button>
                  <button type="button" style={{ background: 'transparent', color: 'var(--ds-action)', border: '2px solid var(--ds-action)', borderRadius: 'var(--ds-radius)', padding: `${sp(1.25)}px ${sp(2.5)}px`, minHeight: 44, fontWeight: 600, fontSize: sz(0) }}>Merken</button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" role="status">
                <div className={`rounded border p-3 ${onAction >= 4.5 ? 'border-stone-200 bg-white' : 'border-red-300 bg-red-50'}`}>
                  <div className="font-semibold text-stone-800">Text auf Button</div>
                  <div className="font-mono text-stone-700">{fmt(onAction)} : 1 · {onAction >= 4.5 ? '✓ AA erfüllt' : '✕ unter 4,5 : 1'}</div>
                </div>
                <div className={`rounded border p-3 ${actionOnSurface >= 3 ? 'border-stone-200 bg-white' : 'border-red-300 bg-red-50'}`}>
                  <div className="font-semibold text-stone-800">Rahmen „Merken“ auf Fläche</div>
                  <div className="font-mono text-stone-700">{fmt(actionOnSurface)} : 1 · {actionOnSurface >= 3 ? '✓ 3 : 1 erfüllt' : '✕ unter 3 : 1'}</div>
                </div>
              </div>
              <p className="text-xs text-stone-500 mt-3">Tipp: Wählen Sie Orange im hellen Modus. Die Palette ist hübsch, aber weißer Text erreicht darauf keine 4,5 : 1. Ein Design System prüft so etwas einmal zentral, statt in jedem Projekt neu.</p>
            </div>
          </div>
        </div>

        {/* Zuordnungsübung */}
        <div className="mt-10 bg-white border border-stone-200 rounded-lg p-6 md:p-8">
          <div className={label}>Übung · Token-Ebenen zuordnen</div>
          <h4 className="text-xl font-bold text-stone-900 mt-2 mb-4">Primitiv, semantisch oder komponentenbezogen?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MATCH.map((m) => {
              const a = answers[m.token] || '';
              const ok = checked && a === m.level, bad = checked && a !== m.level;
              return (
                <div key={m.token} className={`rounded border p-3 ${ok ? 'border-emerald-100 bg-emerald-50' : bad ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-white'}`}>
                  <label htmlFor={`ds-m-${m.token}`} className="font-mono text-sm text-stone-900 block mb-2">{m.token}</label>
                  <select id={`ds-m-${m.token}`} value={a} onChange={(e) => { setAnswers({ ...answers, [m.token]: e.target.value as Level }); setChecked(false); }} className="w-full rounded border border-stone-300 bg-white text-stone-800 px-2 py-1.5 text-sm">
                    <option value="">– bitte wählen –</option>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  {checked && <p className={`text-xs mt-2 ${ok ? 'text-emerald-700' : 'text-red-700'}`}>{ok ? '✓ ' : `✕ richtig: ${m.level}. `}{m.why}</p>}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-5">
            <button type="button" onClick={() => setChecked(true)} className="rounded-full bg-orange-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200">Zuordnung prüfen</button>
            <button type="button" onClick={() => { setAnswers({}); setChecked(false); }} className="rounded-full border border-stone-300 text-stone-700 px-5 py-2.5 text-sm font-semibold hover:border-stone-500">Zurücksetzen</button>
            {checked && <p role="status" className="text-sm font-semibold text-stone-800">{right} von {MATCH.length} richtig{right === MATCH.length ? '. Sie denken in Ebenen.' : '.'}</p>}
          </div>
        </div>
      </section>

      {/* 3 · Komponenten */}
      <section aria-labelledby="ds-comp">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 pt-8 border-t border-stone-200">
          <h3 id="ds-comp" className={h3}>Komponenten: Varianten, Zustände, API</h3>
          <span className="text-sm font-mono text-stone-400">Atomic Design</span>
        </div>
        <p className="text-stone-600 max-w-3xl mb-6">Brad Frost beschreibt in <em>Atomic Design</em> (2016), wie Oberflächen aus kleinen Teilen wachsen: <strong className="text-stone-800">Atome</strong> (Label, Button), <strong className="text-stone-800">Moleküle</strong> (Suchfeld aus Label, Eingabe und Button), <strong className="text-stone-800">Organismen</strong> (Kopfzeile), <strong className="text-stone-800">Templates</strong> (Seitenaufbau) und <strong className="text-stone-800">Seiten</strong> (mit echtem Inhalt). Jede Komponente ist ein Vertrag aus drei Teilen:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            ['Varianten', 'Gleiche Funktion, andere Gewichtung: primary, secondary, ghost, destructive. Und Größen: sm, md, lg.'],
            ['Zustände', 'Wie reagiert die Komponente? Standard, Hover, Fokus, gedrückt, deaktiviert, lädt, Fehler. Alle Zustände gehören in die Dokumentation.'],
            ['API (Props)', 'Die Schnittstelle für Entwicklerinnen und Entwickler, etwa variant, size, disabled, loading, icon. Gute APIs sind klein und schwer falsch zu benutzen.'],
          ].map(([t, d]) => <div key={t} className={card}><h4 className="text-lg font-bold text-stone-900 mb-2">{t}</h4><p className="text-stone-600 text-sm leading-relaxed">{d}</p></div>)}
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 md:p-8">
          <div className={label}>Ausprobieren · Zustands-Explorer</div>
          <h4 className="text-xl font-bold text-stone-900 mt-2 mb-4">Ein Button, sechs Zustände</h4>
          <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Zustand wählen">
            {STATES.map((s) => (
              <button key={s.id} type="button" aria-pressed={state === s.id} onClick={() => setState(s.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200 ${state === s.id ? 'border-stone-900 text-stone-900 bg-white' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}>{s.label}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Variante wählen">
            {(['primary', 'secondary'] as const).map((v) => (
              <button key={v} type="button" aria-pressed={variant === v} onClick={() => setVariant(v)}
                className={`rounded-full border px-3 py-1.5 text-xs font-mono focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200 ${variant === v ? 'border-stone-900 text-stone-900 bg-white' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}>variant="{v}"</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-lg border border-stone-200 p-10 flex items-center justify-center" style={{ background: '#FFFFFF' }}>
              <span style={btnStyle} aria-hidden="true">
                {state === 'loading' && <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${variant === 'primary' ? 'rgba(255,255,255,.4)' : 'rgba(100,55,140,.3)'}`, borderTopColor: variant === 'primary' ? '#FFFFFF' : '#64378C', display: 'inline-block' }} />}
                {state === 'loading' ? 'Wird gesendet …' : 'Bestellung senden'}
              </span>
            </div>
            <div>
              <p className="text-sm text-stone-700 leading-relaxed" role="status">{st.note}</p>
              <pre className="mt-3 text-xs font-mono text-stone-800 bg-white border border-stone-200 rounded p-3 overflow-x-auto">{`<Button variant="${variant}"${state === 'disabled' ? ' disabled' : ''}${state === 'loading' ? ' loading' : ''}>
  ${state === 'loading' ? 'Wird gesendet …' : 'Bestellung senden'}
</Button>`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Governance */}
      <section aria-labelledby="ds-gov">
        <h3 id="ds-gov" className={`${h3} mb-6 pt-8 border-t border-stone-200`}>Governance, Versionierung, Barrierefreiheit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={card}>
            <h4 className="text-lg font-bold text-stone-900 mb-2">Wer entscheidet?</h4>
            <p className="text-stone-600 text-sm leading-relaxed">Ein Kernteam pflegt das System, die Produktteams nutzen es und tragen bei. Ein Beitrag läuft typischerweise so: Bedarf melden, Lösung vorschlagen, im Team prüfen, bauen und testen, dokumentieren, veröffentlichen. Das GOV.UK Design System macht seine Kriterien seit 2018 öffentlich: Ein neues Muster muss nachweislich gebraucht werden, mit Nutzenden getestet und barrierefrei sein.</p>
          </div>
          <div className={card}>
            <h4 className="text-lg font-bold text-stone-900 mb-2">Versionierung nach SemVer</h4>
            <ul className="text-stone-600 text-sm leading-relaxed space-y-1.5">
              <li><span className="font-mono text-stone-800">3.0.0</span> Major: bricht bestehende Nutzung, etwa ein umbenannter Token. Mit Migrationsleitfaden.</li>
              <li><span className="font-mono text-stone-800">2.4.0</span> Minor: neue Komponente oder Variante, rückwärtskompatibel.</li>
              <li><span className="font-mono text-stone-800">2.3.1</span> Patch: Fehlerbehebung, etwa ein zu schwacher Fokusring.</li>
              <li>Veraltetes wird erst als <em>deprecated</em> markiert und eine Version später entfernt.</li>
            </ul>
          </div>
          <div className={card}>
            <h4 className="text-lg font-bold text-stone-900 mb-2">Barrierefreiheit eingebaut</h4>
            <p className="text-stone-600 text-sm leading-relaxed">Kontraste, Fokusreihenfolge, Tastaturbedienung, Zielgrößen und ARIA-Muster werden einmal in der Komponente gelöst und gelten dann überall. Das ersetzt keine Tests im Produkt, verhindert aber die häufigsten Fehler. Maßstab sind WCAG 2.2 AA und für den EU-Markt die EN 301 549.</p>
          </div>
          <div className={card}>
            <h4 className="text-lg font-bold text-stone-900 mb-2">Erfolg messen</h4>
            <p className="text-stone-600 text-sm leading-relaxed">Wie viele Produkte nutzen welche Version? Wie oft werden Komponenten lokal überschrieben? Wie lange dauert es, bis eine Änderung überall ankommt? Häufige lokale Abweichungen sind ein Signal, dass dem System etwas fehlt.</p>
          </div>
        </div>
      </section>

      {/* 5 · Beispiele */}
      <section aria-labelledby="ds-examples">
        <h3 id="ds-examples" className={`${h3} mb-2 pt-8 border-t border-stone-200`}>Vier Systeme im Vergleich</h3>
        <p className="text-stone-600 max-w-3xl mb-6">Alle vier sind öffentlich dokumentiert. Vergleichen Sie, wofür sie gebaut sind: Ein Betriebssystem braucht andere Regeln als ein Behördenformular.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SYSTEMS.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-stone-200 rounded-lg p-6 hover:border-stone-400 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-orange-200 block">
              <div className="flex items-baseline justify-between gap-3"><h4 className="text-lg font-bold text-stone-900">{s.name}</h4><span className="text-xs text-stone-500">{s.by}</span></div>
              <p className={`${label} mt-1 mb-3`}>{s.focus}</p>
              <p className="text-stone-600 text-sm leading-relaxed">{s.note}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-orange-600">Zur Dokumentation <span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </div>
      </section>

      {/* 6 · Fallbeispiel */}
      <section aria-labelledby="ds-case">
        <h3 id="ds-case" className={`${h3} mb-2 pt-8 border-t border-stone-200`}>Fallbeispiel: das Design System dieser Lern-Apps</h3>
        <p className="text-stone-600 max-w-3xl mb-6">Alle Lern-Apps teilen sich ein kleines System, das ursprünglich für das TypoLab entstand. Es ist bewusst schlank: wenige Farben mit festen Rollen, eine Schrift, eine Abstandsskala, wiederkehrende Komponenten.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={card}>
            <div className={label}>Farben</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {[['#64378C', 'Marke'], ['#9254D1', 'Marke, Dunkelmodus'], ['#16A34A', 'Erfolg'], ['#DC2626', 'Fehler'], ['#D97706', 'Warnung'], ['#2563EB', 'Info']].map(([c, n]) => (
                <div key={c}><div className="h-12 rounded border border-stone-200" style={{ background: c }} /><div className="text-xs mt-1 text-stone-800 font-semibold">{n}</div><div className="text-xs font-mono text-stone-500">{c}</div></div>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-3">Neutrale Töne von #FAFAFA bis #171717 in zehn Stufen ergänzen die Palette. Status wird nie nur über Farbe gezeigt, sondern immer mit Symbol und Text.</p>
          </div>
          <div className={card}>
            <div className={label}>Schrift und Abstände</div>
            <p className="text-sm text-stone-700 mt-3">IBM Plex Sans (SIL Open Font License) in allen Apps: Regular 400 für Fließtext, Medium 500 und Bold 700 für Überschriften und Betonung.</p>
            <ul className="mt-3 text-sm text-stone-700 space-y-1">
              <li className="flex justify-between"><span>Überschrift 1</span><span className="font-mono text-stone-500">36 px</span></li>
              <li className="flex justify-between"><span>Überschrift 2</span><span className="font-mono text-stone-500">28 px</span></li>
              <li className="flex justify-between"><span>Überschrift 3</span><span className="font-mono text-stone-500">22 px</span></li>
              <li className="flex justify-between"><span>Fließtext</span><span className="font-mono text-stone-500">16 px</span></li>
            </ul>
            <p className="text-sm text-stone-700 mt-3">Abstände in Vielfachen von 4 px: 4, 8, 12, 16, 24, 32, 48, 64.</p>
            <div className="flex items-end gap-1.5 mt-3" aria-hidden="true">{[4, 8, 12, 16, 24, 32, 48, 64].map((n) => <span key={n} className="bg-orange-200 rounded-sm" style={{ width: 14, height: n }} />)}</div>
          </div>
          <div className={card}>
            <div className={label}>Buttons</div>
            <p className="text-sm text-stone-700 mt-3">Varianten Primär, Sekundär, Kontur, Ghost und Destruktiv in drei Größen (36, 40, 44 px). Zielgröße mindestens 24 × 24 px (WCAG 2.2, Stufe AA), besser 44 × 44 px.</p>
          </div>
          <div className={card}>
            <div className={label}>Statusmeldungen</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="rounded border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-900">✓ Erfolg: Die Aufgabe wurde korrekt gelöst.</li>
              <li className="rounded border border-blue-100 bg-blue-100 px-3 py-2 text-blue-800">i Hinweis: Mehr dazu im Glossar.</li>
              <li className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-stone-800">! Achtung: Wert außerhalb des empfohlenen Bereichs.</li>
              <li className="rounded border border-red-300 bg-red-50 px-3 py-2 text-red-900">✕ Fehler: Die Eingabe konnte nicht verarbeitet werden.</li>
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="ds-merke" className="bg-orange-50 border border-orange-200 rounded-lg p-6 md:p-8">
        <h3 id="ds-merke" className="text-lg font-bold text-stone-900 mb-3">Zum Merken</h3>
        <ul className="text-stone-700 text-sm leading-relaxed list-disc pl-5 space-y-1.5">
          <li>Ein Design System ist ein Produkt mit Nutzenden, Roadmap und Versionen, kein einmaliges Dokument.</li>
          <li>Tokens in drei Ebenen: primitiv, semantisch, komponentenbezogen. Umschalten (Dunkelmodus, Marke) passiert auf der semantischen Ebene.</li>
          <li>Jede Komponente dokumentiert Varianten, alle Zustände und ihre API.</li>
          <li>Barrierefreiheit gehört in das System, nicht erst in das einzelne Projekt.</li>
        </ul>
      </section>

      <section aria-labelledby="ds-src">
        <h3 id="ds-src" className={`${label} mb-3`}>Quellen und Weiterlesen</h3>
        <ul className="text-sm space-y-1.5">
          {SOURCES.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noopener noreferrer" className="text-stone-700 underline underline-offset-2 hover:text-orange-600">{t}</a></li>)}
        </ul>
      </section>
    </div>
  );
};
