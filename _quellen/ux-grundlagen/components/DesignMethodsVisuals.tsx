import React, { useState } from 'react';
import { Quote, Target, Frown, Smartphone, MapPin, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

/* ============================================================
   Beispiel-Persona als Steckbrief (fiktiv, für Lernzwecke)
   ============================================================ */
const Meter = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex justify-between text-xs text-stone-600 mb-1">
      <span>{label}</span>
      <span className="font-mono text-stone-500">{value} %</span>
    </div>
    <div
      className="h-2 rounded-full bg-stone-200 overflow-hidden"
      role="meter"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full bg-orange-600 rounded-full" style={{ width: `${value}%` }} />
    </div>
  </div>
);

export const PersonaCard = () => (
  <figure className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
      {/* Linke Spalte: Identität */}
      <div className="bg-orange-50 p-6 md:p-8 flex flex-col gap-5 border-b lg:border-b-0 lg:border-r border-stone-200">
        <div className="flex items-center gap-4">
          <img
            src="img/persona-anna.webp"
            alt="Porträt von Anna Becker: Frau Mitte dreißig mit Brille und Schal am Bahnsteig"
            width={96}
            height={96}
            className="w-20 h-20 shrink-0 rounded-full object-cover object-[50%_35%] ring-4 ring-white shadow-md"
          />
          <div>
            <p className="text-xl font-bold text-stone-900 leading-tight">Anna Becker</p>
            <p className="text-sm text-stone-600">Die effiziente Pendlerin</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-stone-700">
          <li className="flex gap-2"><Clock size={16} className="mt-0.5 shrink-0 text-orange-600" aria-hidden="true" />34 Jahre, Architektin in Vollzeit</li>
          <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-orange-600" aria-hidden="true" />Wohnt in Ettlingen, arbeitet in Karlsruhe</li>
          <li className="flex gap-2"><Smartphone size={16} className="mt-0.5 shrink-0 text-orange-600" aria-hidden="true" />iPhone, nutzt Apps vor allem unterwegs und einhändig</li>
        </ul>
        <blockquote className="relative bg-white rounded-xl p-4 text-sm italic text-stone-700 border border-stone-200">
          <Quote size={16} className="absolute -top-2 -left-2 text-orange-600 bg-white rounded-full" aria-hidden="true" />
          „Ich will morgens nicht nachdenken müssen. Die App soll mir sagen, wann ich los muss.“
        </blockquote>
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-stone-600">Fähigkeiten & Haltung</p>
          <Meter label="Umgang mit Smartphone-Apps" value={90} />
          <Meter label="Kenntnis des Tarifsystems" value={35} />
          <Meter label="Geduld bei Störungen" value={20} />
        </div>
      </div>

      {/* Rechte Spalte: Ziele, Frustrationen, Verhalten, Szenario */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-900 mb-3">
            <Target size={16} className="text-orange-600" aria-hidden="true" />Ziele
          </p>
          <ul className="space-y-2 text-sm text-stone-600 list-disc pl-5 marker:text-orange-600">
            <li>Pünktlich um 8:30 Uhr im Büro sein, ohne Puffer von 20 Minuten einplanen zu müssen</li>
            <li>Die Fahrzeit sinnvoll nutzen (Mails, Podcasts)</li>
            <li>Kosten im Blick behalten: lohnt sich das Deutschlandticket?</li>
          </ul>
        </div>
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-900 mb-3">
            <Frown size={16} className="text-orange-600" aria-hidden="true" />Frustrationen
          </p>
          <ul className="space-y-2 text-sm text-stone-600 list-disc pl-5 marker:text-orange-600">
            <li>Verspätungen erfährt sie erst am Bahnsteig</li>
            <li>Ticketkauf mit vielen Schritten, während der Zug schon einfährt</li>
            <li>Widersprüchliche Angaben in App und Anzeigetafel</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-3">Verhalten & Kontext</p>
          <ul className="space-y-2 text-sm text-stone-600 list-disc pl-5 marker:text-orange-600">
            <li>Prüft die Verbindung zweimal: beim Frühstück und auf dem Weg zur Haltestelle</li>
            <li>Bedient das Handy oft einhändig, mit Kaffee oder Tasche in der anderen Hand</li>
            <li>Liest kaum Text, reagiert auf Push-Nachrichten</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-3">Szenario</p>
          <p className="text-sm text-stone-600 leading-relaxed">
            Dienstag, 7:40 Uhr: Anna steht in der Küche. Ihre S-Bahn hat 12 Minuten Verspätung. Sie möchte rechtzeitig wissen, ob
            sie lieber den Bus nimmt, und das Ticket mit einem Tipp kaufen, bevor sie aus dem Haus geht.
          </p>
        </div>
        <div className="md:col-span-2 bg-stone-50 border border-stone-200 rounded-xl p-4">
          <p className="text-sm font-bold text-stone-900 mb-1">Was folgt daraus für das Design?</p>
          <p className="text-sm text-stone-600 leading-relaxed">
            Proaktive Push-Nachricht bei Verspätung mit Alternative, Ticketkauf in einem Schritt, wichtige Aktionen im
            Daumenbereich unten, große Schrift für Abfahrtszeiten.
          </p>
        </div>
      </div>
    </div>
    <figcaption className="px-6 py-3 text-xs text-stone-500 border-t border-stone-200 bg-stone-50">
      Fiktive Beispiel-Persona für eine Mobilitäts-App, Porträt KI-generiert. Eine echte Persona beruht auf Interviews und Daten, nicht auf Annahmen.
    </figcaption>
  </figure>
);

/* ============================================================
   Empathy Map zu Anna
   ============================================================ */
const EMPATHY: { title: string; hint: string; items: string[] }[] = [
  { title: 'Sagt', hint: 'Zitate aus Interviews', items: ['„Ich will morgens nicht nachdenken müssen.“', '„Der Anzeigetafel glaube ich mehr als der App.“'] },
  { title: 'Denkt', hint: 'Was sie beschäftigt, aber nicht unbedingt ausspricht', items: ['Schaffe ich es noch zum 8:30-Termin?', 'Lohnt sich das Deutschlandticket für mich?'] },
  { title: 'Tut', hint: 'Beobachtetes Verhalten', items: ['Prüft die Verbindung beim Frühstück und an der Haustür', 'Kauft das Ticket oft erst am Bahnsteig'] },
  { title: 'Fühlt', hint: 'Emotionen und Stimmungen', items: ['Gestresst, wenn Infos fehlen', 'Erleichtert, wenn sie Zeit im Zug sinnvoll nutzen kann'] },
];

export const EmpathyMap = () => (
  <figure className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
    <div className="relative grid grid-cols-1 sm:grid-cols-2">
      {EMPATHY.map((q, i) => (
        <div key={q.title} className={`p-5 border-stone-200 ${i % 2 === 0 ? 'sm:border-r' : ''} ${i < 2 ? 'border-b' : i === 2 ? 'border-b sm:border-b-0' : ''}`}>
          <p className="text-sm font-bold uppercase tracking-widest text-orange-600">{q.title}</p>
          <p className="text-xs text-stone-500 mb-3">{q.hint}</p>
          <ul className="space-y-1.5 text-sm text-stone-700">
            {q.items.map((it) => <li key={it} className="bg-orange-50 rounded-md px-3 py-1.5">{it}</li>)}
          </ul>
        </div>
      ))}
      <div className="hidden sm:grid absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-orange-600 text-white place-items-center text-center text-sm font-bold shadow-md" aria-hidden="true">
        Anna
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-stone-200 text-sm">
      <div className="p-5 sm:border-r border-stone-200">
        <p className="font-bold text-stone-900 mb-1">Pains (Hürden)</p>
        <p className="text-stone-600">Späte Infos bei Verspätung, umständlicher Ticketkauf, widersprüchliche Angaben</p>
      </div>
      <div className="p-5 border-t sm:border-t-0 border-stone-200">
        <p className="font-bold text-stone-900 mb-1">Gains (Gewinne)</p>
        <p className="text-stone-600">Planbarkeit, gewonnene Zeit, Kostenkontrolle</p>
      </div>
    </div>
    <figcaption className="px-5 py-3 text-xs text-stone-500 border-t border-stone-200 bg-stone-50">
      Die Empathy Map hält fest, was die Forschung über eine Person zeigt. Sie ist ein Zwischenschritt: Aus mehreren Empathy Maps entsteht die Persona.
    </figcaption>
  </figure>
);

/* ============================================================
   Verhaltensvariablen: Interviewte auf Skalen, Cluster werden Personas
   ============================================================ */
type Cluster = 'A' | 'B' | null;
const PARTICIPANTS: { id: number; cluster: Cluster }[] = [
  { id: 1, cluster: 'A' }, { id: 2, cluster: 'B' }, { id: 3, cluster: 'A' }, { id: 4, cluster: null },
  { id: 5, cluster: 'B' }, { id: 6, cluster: 'A' }, { id: 7, cluster: null }, { id: 8, cluster: 'B' },
];
const VARIABLES: { left: string; right: string; pos: number[] }[] = [
  { left: 'fährt täglich', right: 'fährt selten', pos: [8, 82, 14, 45, 76, 20, 60, 88] },
  { left: 'plant voraus', right: 'spontan', pos: [70, 12, 78, 40, 20, 84, 55, 8] },
  { left: 'Zeit ist wichtiger', right: 'Preis ist wichtiger', pos: [12, 70, 20, 50, 80, 8, 35, 74] },
  { left: 'App-erfahren', right: 'App-zurückhaltend', pos: [10, 60, 16, 30, 72, 22, 48, 66] },
];
const clusterClass = (c: Cluster) =>
  c === 'A' ? 'bg-orange-600 text-white' : c === 'B' ? 'bg-cta text-white' : 'bg-white text-stone-700 border-2 border-stone-400';

export const BehaviorVariables = () => (
  <figure className="bg-white rounded-2xl border border-stone-200 p-5 md:p-6">
    <div className="space-y-7">
      {VARIABLES.map((v) => {
        const label = `${v.left} bis ${v.right}: ` + PARTICIPANTS.map((p, i) => `P${p.id} bei ${v.pos[i]} %`).join(', ');
        // Nahe beieinanderliegende Punkte in Reihen stapeln, damit sie auch auf schmalen Bildschirmen lesbar bleiben
        const order = PARTICIPANTS.map((p, i) => ({ p, pos: Math.min(96, Math.max(4, v.pos[i])) })).sort((a, b) => a.pos - b.pos);
        const lastInRow: number[] = [];
        const placed = order.map((o) => {
          let row = lastInRow.findIndex((last) => o.pos - last >= 11);
          if (row === -1) { row = lastInRow.length; lastInRow.push(o.pos); } else lastInRow[row] = o.pos;
          return { ...o, row };
        });
        const rows = Math.max(1, lastInRow.length);
        return (
          <div key={v.left}>
            <div className="flex justify-between text-xs font-semibold text-stone-700 mb-2">
              <span>{v.left}</span><span>{v.right}</span>
            </div>
            <div className="relative" style={{ height: rows * 32 }} role="img" aria-label={label}>
              <div className="absolute left-0 right-0 h-0.5 bg-stone-300" style={{ top: 15 }} />
              {placed.map(({ p, pos, row }) => (
                <span
                  key={p.id}
                  className={`absolute -translate-x-1/2 w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold shadow-sm ${clusterClass(p.cluster)}`}
                  style={{ left: `${pos}%`, top: row * 32 + 2 }}
                  aria-hidden="true"
                >
                  {p.id}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone-700">
      <li className="flex items-center gap-2"><span className="shrink-0 w-4 h-4 rounded-full bg-orange-600" aria-hidden="true" />P1, P3, P6 → Persona „Anna, die effiziente Pendlerin“</li>
      <li className="flex items-center gap-2"><span className="shrink-0 w-4 h-4 rounded-full bg-cta" aria-hidden="true" />P2, P5, P8 → Persona „Günter, der Gelegenheitsfahrer“</li>
      <li className="flex items-center gap-2"><span className="shrink-0 w-4 h-4 rounded-full border-2 border-stone-400" aria-hidden="true" />P4, P7 → kein klares Muster, weiter beobachten</li>
    </ul>
    <figcaption className="mt-4 text-xs text-stone-500">
      Fiktive Daten aus acht Interviews (P1–P8). Wer auf mehreren Skalen immer wieder nah beieinanderliegt, bildet ein Verhaltensmuster.
      Nicht Alter oder Beruf entscheiden über die Gruppe, sondern das Verhalten.
    </figcaption>
  </figure>
);

/* ============================================================
   Persona-Set: primär, sekundär, Anti-Persona
   ============================================================ */
const PERSONA_SET = [
  {
    role: 'Primäre Persona', name: 'Anna Becker, 34', tag: 'Die effiziente Pendlerin', tone: 'bg-orange-600 text-white',
    text: 'Fährt täglich, will schnell entscheiden und einhändig bedienen. Für sie wird die App optimiert.',
    need: 'Push bei Verspätung, Ticket mit einem Tipp',
  },
  {
    role: 'Sekundäre Persona', name: 'Günter Yilmaz, 67', tag: 'Der Gelegenheitsfahrer', tone: 'bg-cta text-white',
    text: 'Fährt zweimal pro Woche zu Terminen, plant am Vorabend, nutzt einen Rollator.',
    need: 'Zusätzlich: Infos zu Aufzügen und stufenlosen Einstiegen',
  },
  {
    role: 'Anti-Persona', name: 'Kai Brandt, 41', tag: 'Der Verkehrsplaner', tone: 'bg-stone-700 text-white',
    text: 'Möchte Rohdaten, Auslastungsstatistiken und Fahrplanexporte.',
    need: 'Nicht in der App: Dafür gibt es die Open-Data-Schnittstelle',
  },
];

export const PersonaSet = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {PERSONA_SET.map((p) => (
      <article key={p.name} className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col">
        <p className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest ${p.tone}`}>{p.role}</p>
        <div className="p-4 flex-1 flex flex-col gap-2">
          <p className="font-bold text-stone-900 leading-tight">{p.name}<span className="block text-sm font-normal text-stone-600">{p.tag}</span></p>
          <p className="text-sm text-stone-600">{p.text}</p>
          <p className="mt-auto text-sm text-stone-900 bg-stone-50 rounded-md px-3 py-2"><span className="font-semibold">Bedarf: </span>{p.need}</p>
        </div>
      </article>
    ))}
  </div>
);

/* ============================================================
   Übung: Gehört das in die Persona?
   ============================================================ */
const PERSONA_STATEMENTS: { text: string; keep: boolean; why: string }[] = [
  { text: 'Prüft die Abfahrt zweimal: beim Frühstück und an der Haustür.', keep: true, why: 'Beobachtetes Verhalten mit direktem Bezug zur App (Zeitpunkt, Kontext).' },
  { text: 'Lieblingsfarbe: Grün.', keep: false, why: 'Kein Bezug zum Produkt. Solche Details lenken ab und wirken nur scheinbar lebendig.' },
  { text: 'Sagt: „Der Anzeigetafel glaube ich mehr als der App.“', keep: true, why: 'Ein echtes Zitat zeigt eine Haltung (fehlendes Vertrauen), auf die das Design reagieren muss.' },
  { text: 'Frauen zwischen 30 und 40 pendeln gern mit der Bahn.', keep: false, why: 'Eine Verallgemeinerung über eine Zielgruppe, kein beobachtetes Verhalten. Gefahr von Stereotypen.' },
  { text: 'Kauft Tickets meist im letzten Moment, oft schon am Bahnsteig.', keep: true, why: 'Erklärt einen Pain Point (Zeitdruck) und begründet den Ticketkauf in einem Schritt.' },
  { text: 'Hat einen Hund namens Bruno.', keep: false, why: 'Irrelevant – es sei denn, die Forschung zeigt, dass sie regelmäßig mit Hund fährt und ein Hundeticket braucht.' },
];

export const PersonaExercise = () => {
  const [answers, setAnswers] = useState<(boolean | null)[]>(PERSONA_STATEMENTS.map(() => null));
  const correct = answers.filter((a, i) => a !== null && a === PERSONA_STATEMENTS[i].keep).length;
  const done = answers.filter((a) => a !== null).length;
  const choose = (i: number, v: boolean) => setAnswers((prev) => prev.map((a, j) => (j === i ? v : a)));
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 md:p-6">
      <ol className="space-y-4">
        {PERSONA_STATEMENTS.map((s, i) => {
          const a = answers[i];
          const ok = a !== null && a === s.keep;
          return (
            <li key={i} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0">
              <p className="text-stone-900 font-medium mb-2">{s.text}</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={`Aussage ${i + 1} bewerten`}>
                {[{ v: true, l: 'Gehört rein' }, { v: false, l: 'Weglassen' }].map((b) => (
                  <button
                    key={b.l}
                    type="button"
                    aria-pressed={a === b.v}
                    onClick={() => choose(i, b.v)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${a === b.v ? 'bg-cta border-cta text-white hover:bg-cta-hover' : 'bg-white border-stone-300 text-stone-700 hover:border-stone-500'}`}
                  >
                    {b.l}
                  </button>
                ))}
              </div>
              <div aria-live="polite">
                {a !== null && (
                  <p className={`mt-2 flex gap-2 text-sm ${ok ? 'text-green-800' : 'text-red-800'}`}>
                    {ok ? <CheckCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : <XCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />}
                    <span><strong>{ok ? 'Richtig.' : 'Nicht ganz.'}</strong> {s.why}</span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <p className="text-stone-700" aria-live="polite">{done} von {PERSONA_STATEMENTS.length} bewertet, {correct} richtig</p>
        {done > 0 && (
          <button type="button" onClick={() => setAnswers(PERSONA_STATEMENTS.map(() => null))} className="flex items-center gap-1.5 font-semibold text-stone-700 hover:text-orange-600">
            <RotateCcw size={14} aria-hidden="true" /> Zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   Beispiel-Journey-Map mit Emotionskurve, Ist- und Soll-Zustand
   ============================================================ */
const PHASES = ['Auslöser', 'Recherche', 'Auswahl', 'Kauf', 'Lieferung', 'Nutzung'];
type Row = { label: string; cells: string[]; kind?: 'thought' | 'pain' | 'chance' };
const ROWS_CURRENT: Row[] = [
  {
    label: 'Aktionen',
    cells: [
      'Merkt nach einem Lauf Knieschmerzen, alte Schuhe sind durch',
      'Googelt „Laufschuh Pronation“, liest Tests, fragt im Laufverein',
      'Vergleicht drei Modelle im Shop, sucht die passende Größe',
      'Legt Schuh in den Warenkorb, bezahlt',
      'Verfolgt die Sendung',
      'Probiert die Schuhe, geht die erste Runde laufen',
    ],
  },
  { label: 'Touchpoints', cells: ['Eigener Körper, Lauf-App', 'Google, Testberichte, Vereinskollegen', 'Online-Shop, Größentabelle, Bewertungen', 'Warenkorb, Checkout', 'Versand-Mail, Tracking-Seite', 'Paket, Rücksendeschein'] },
  {
    label: 'Gedanken', kind: 'thought',
    cells: [
      '„So kann ich nicht weiterlaufen.“',
      '„Neutral oder Stabilschuh? Ich blicke nicht durch.“',
      '„Fällt der klein aus? Jede Bewertung sagt etwas anderes.“',
      '„Wieso muss ich jetzt ein Konto anlegen?“',
      '„Schon morgen da, super!“',
      '„Passt. Aber nach zwei Läufen merke ich erst, ob er wirklich passt.“',
    ],
  },
  { label: 'Pain Points', kind: 'pain', cells: ['Unsicherheit, ob es am Schuh liegt', 'Fachbegriffe ohne Erklärung', 'Größenangaben uneinheitlich, kein Vergleich zum alten Schuh', 'Zwangs-Registrierung vor dem Bezahlen', '–', 'Rückgabe nur ungetragen und innerhalb von 14 Tagen'] },
  { label: 'Chancen', kind: 'chance', cells: ['Ratgeber „Wann brauche ich neue Laufschuhe?“', 'Laufschuh-Finder mit wenigen Fragen', 'Größenfinder: „Ich trage Modell X in 43“', 'Gastbestellung anbieten', 'Proaktive Lieferinfo beibehalten', '30 Tage Testlaufen ermöglichen'] },
];
const ROWS_FUTURE: Row[] = [
  {
    label: 'Aktionen',
    cells: [
      'Lauf-App meldet: „Deine Schuhe haben 700 km. Zeit für neue?“',
      'Beantwortet im Laufschuh-Finder fünf Fragen zu Laufstil und Strecke',
      'Gibt im Größenfinder sein altes Modell an, bekommt eine klare Empfehlung',
      'Bestellt als Gast mit Apple Pay',
      'Verfolgt die Sendung',
      'Läuft zwei Wochen Probe, behält die Schuhe',
    ],
  },
  { label: 'Touchpoints', cells: ['Lauf-App (Partnerschaft)', 'Laufschuh-Finder im Shop', 'Größenfinder auf der Produktseite', 'Checkout ohne Konto', 'Versand-Mail, Tracking-Seite', 'Paket, Erinnerung zum Testende'] },
  {
    label: 'Gedanken', kind: 'thought',
    cells: [
      '„Gut, dass mich jemand daran erinnert.“',
      '„Endlich verstehe ich, was ich brauche.“',
      '„43 wie bisher – das passt.“',
      '„Zwei Klicks, fertig.“',
      '„Schon morgen da, super!“',
      '„Ich konnte sie wirklich testen. Nächstes Mal wieder hier.“',
    ],
  },
  { label: 'Pain Points', kind: 'pain', cells: ['Hinweis könnte als Werbung wirken', '–', 'Nur für Modelle mit genug Daten', '–', '–', '–'] },
  { label: 'Messgröße', kind: 'chance', cells: ['Klicks auf den Hinweis', 'Abschlussrate des Finders', 'Retouren wegen falscher Größe', 'Abbruchrate im Checkout', 'Anfragen zum Lieferstatus', 'Wiederkaufrate nach 12 Monaten'] },
];
// Emotion je Phase von -2 (sehr negativ) bis +2 (sehr positiv)
const EMOTIONS_CURRENT = [-1, -1, -2, -1, 2, 0];
const EMOTIONS_FUTURE = [0, 1, 1, 2, 2, 2];
const EMOTION_WORDS: Record<number, string> = { [-2]: 'genervt', [-1]: 'unsicher', 0: 'neutral', 1: 'zufrieden', 2: 'begeistert' };

const EmotionCurve = ({ data, compare }: { data: number[]; compare?: number[] }) => {
  const w = 600, h = 140, pad = 30;
  // Punkte mittig unter den Phasen-Spalten (Tabelle hat gleich breite Spalten)
  const x = (i: number) => ((i + 0.5) * w) / data.length;
  const y = (v: number) => h / 2 - (v * (h / 2 - pad)) / 2;
  const path = (arr: number[]) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ');
  const summary = data.map((v, i) => `${PHASES[i]}: ${EMOTION_WORDS[v]}`).join(', ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto block" preserveAspectRatio="none" role="img" aria-label={`Emotionskurve: ${summary}`}>
      <line x1={0} x2={w} y1={h / 2} y2={h / 2} stroke="#D1D5DB" strokeDasharray="4 4" />
      {compare && <path d={path(compare)} fill="none" stroke="#9CA3AF" strokeWidth="2" strokeDasharray="6 5" strokeLinejoin="round" />}
      <path d={path(data)} fill="none" stroke="#64378C" strokeWidth="3" strokeLinejoin="round" />
      {data.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r="7" fill={v < 0 ? '#CC4E00' : '#64378C'} stroke="#fff" strokeWidth="2" />
          <text x={x(i)} y={v < 0 ? y(v) + 22 : y(v) - 12} textAnchor="middle" fontSize="11" fill="currentColor" className="text-stone-700">{EMOTION_WORDS[v]}</text>
        </g>
      ))}
    </svg>
  );
};

export const JourneyMap = () => {
  const [future, setFuture] = useState(false);
  const rows = future ? ROWS_FUTURE : ROWS_CURRENT;
  const cellClass = (kind?: Row['kind']) =>
    kind === 'pain' ? 'text-[#A33E00]' : kind === 'chance' ? 'text-orange-700 font-medium' : kind === 'thought' ? 'text-stone-600 italic' : 'text-stone-600';
  const renderRow = (row: Row) => (
    <tr key={row.label} className="border-t border-stone-200 align-top">
      <th scope="row" className="p-3 text-left text-[11px] font-bold uppercase tracking-widest text-stone-600 bg-stone-50">{row.label}</th>
      {row.cells.map((c, i) => (
        <td key={i} className={`p-3 border-l border-stone-100 ${cellClass(row.kind)}`}>{c}</td>
      ))}
    </tr>
  );
  return (
    <figure className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
          <p><span className="font-bold text-stone-900">Persona:</span> <span className="text-stone-600">Jonas, 27, Hobbyläufer</span></p>
          <p><span className="font-bold text-stone-900">Szenario:</span> <span className="text-stone-600">kauft online neue Laufschuhe</span></p>
          <p><span className="font-bold text-stone-900">Erwartung:</span> <span className="text-stone-600">passender Schuh ohne Fehlkauf</span></p>
        </div>
        <div className="inline-flex rounded-full border border-stone-300 p-1" role="group" aria-label="Zustand der Journey Map">
          {[{ v: false, l: 'Ist-Zustand' }, { v: true, l: 'Soll-Zustand' }].map((b) => (
            <button
              key={b.l}
              type="button"
              aria-pressed={future === b.v}
              onClick={() => setFuture(b.v)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${future === b.v ? 'bg-cta text-white hover:bg-cta-hover' : 'text-stone-700 hover:text-stone-900'}`}
            >
              {b.l}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto" aria-live="polite">
        <table className="w-full min-w-[860px] table-fixed text-sm border-collapse">
          <caption className="sr-only">{future ? 'Soll-Zustand' : 'Ist-Zustand'} einer User Journey Map für einen Laufschuh-Kauf</caption>
          <thead>
            <tr>
              <th scope="col" className="w-32 p-3 text-left text-[11px] font-bold uppercase tracking-widest text-stone-500 bg-stone-50">Phase</th>
              {PHASES.map((p, i) => (
                <th key={p} scope="col" className="p-3 text-left bg-orange-600 text-white font-bold border-l border-white/20">
                  <span className="block text-[10px] font-semibold uppercase tracking-widest text-orange-100">{String(i + 1).padStart(2, '0')}</span>
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 3).map(renderRow)}
            <tr className="border-t border-stone-200">
              <th scope="row" className="p-3 text-left text-[11px] font-bold uppercase tracking-widest text-stone-600 bg-stone-50">
                Emotion
                {future && <span className="block mt-1 normal-case tracking-normal font-normal text-stone-600">gestrichelt: Ist</span>}
              </th>
              <td colSpan={PHASES.length} className="px-0 py-2">
                <EmotionCurve data={future ? EMOTIONS_FUTURE : EMOTIONS_CURRENT} compare={future ? EMOTIONS_CURRENT : undefined} />
              </td>
            </tr>
            {rows.slice(3).map(renderRow)}
          </tbody>
        </table>
      </div>
      <figcaption className="px-6 py-3 text-xs text-stone-500 border-t border-stone-200 bg-stone-50">
        {future
          ? 'Der Soll-Zustand setzt die Chancen aus der Ist-Map um. Statt Chancen stehen hier Messgrößen: Woran erkennen wir, ob die Änderung wirkt?'
          : 'Fiktives Beispiel. Der Tiefpunkt der Kurve (Auswahl) zeigt, wo sich eine Investition am meisten lohnt: hier ein Größenfinder.'}
        {' '}Auf kleinen Bildschirmen lässt sich die Tabelle seitlich scrollen.
      </figcaption>
    </figure>
  );
};

/* ============================================================
   Chancen priorisieren: Nutzen-Aufwand-Matrix
   ============================================================ */
const QUADRANTS: { title: string; hint: string; items: string[]; strong?: boolean }[] = [
  { title: 'Schnelle Erfolge', hint: 'hoher Nutzen, geringer Aufwand – zuerst umsetzen', items: ['Gastbestellung anbieten', 'Ratgeber „Wann brauche ich neue Laufschuhe?“'], strong: true },
  { title: 'Große Vorhaben', hint: 'hoher Nutzen, hoher Aufwand – planen', items: ['Größenfinder', 'Laufschuh-Finder'] },
  { title: 'Kleinigkeiten', hint: 'geringer Nutzen, geringer Aufwand – nebenbei', items: ['Proaktive Lieferinfo beibehalten'] },
  { title: 'Kritisch prüfen', hint: 'geringer Nutzen, hoher Aufwand – erst Daten sammeln', items: ['30 Tage Testlaufen (Kosten für Retouren klären)'] },
];

export const OpportunityMatrix = () => (
  <figure className="bg-white rounded-2xl border border-stone-200 p-5 md:p-6">
    <div className="grid grid-cols-[auto_1fr] gap-3">
      <div className="flex items-center justify-center">
        <span className="text-[11px] font-bold uppercase tracking-widest text-stone-600 [writing-mode:vertical-rl] rotate-180">Nutzen für Jonas ↑</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUADRANTS.map((q) => (
          <section key={q.title} className={`rounded-xl p-4 border ${q.strong ? 'bg-orange-50 border-orange-200' : 'bg-stone-50 border-stone-200'}`}>
            <h5 className="font-bold text-stone-900">{q.title}</h5>
            <p className="text-xs text-stone-600 mb-3">{q.hint}</p>
            <ul className="flex flex-wrap gap-2">
              {q.items.map((it) => <li key={it} className="bg-white border border-stone-300 rounded-md px-2.5 py-1 text-sm text-stone-800 shadow-sm">{it}</li>)}
            </ul>
          </section>
        ))}
      </div>
      <span />
      <p className="text-center text-[11px] font-bold uppercase tracking-widest text-stone-600">Aufwand für das Team →</p>
    </div>
    <figcaption className="mt-4 text-xs text-stone-500">
      Die Chancen aus der Journey Map werden gemeinsam mit Entwicklung und Fachabteilung eingeordnet. Obere Reihe: hoher Nutzen. Linke Spalte: geringer Aufwand.
    </figcaption>
  </figure>
);

/* ============================================================
   Übung: Aussagen den Zeilen einer Journey Map zuordnen
   ============================================================ */
const MAP_ROWS = ['Aktion', 'Touchpoint', 'Gedanke', 'Pain Point', 'Chance'] as const;
type MapRow = typeof MAP_ROWS[number];
const SORT_ITEMS: { text: string; row: MapRow; why: string }[] = [
  { text: 'Vergleicht drei Hotels auf einem Buchungsportal.', row: 'Aktion', why: 'Beschreibt, was die Person tut.' },
  { text: 'Bestätigungsmail nach der Buchung', row: 'Touchpoint', why: 'Ein Kontaktpunkt zwischen Person und Angebot.' },
  { text: '„Ist das Frühstück im Preis inklusive?“', row: 'Gedanke', why: 'Eine Frage, die sich die Person stellt – am besten als wörtliches Zitat.' },
  { text: 'Stornobedingungen erst nach drei Klicks auffindbar', row: 'Pain Point', why: 'Eine Hürde, die Unsicherheit oder Ärger auslöst.' },
  { text: 'Stornobedingungen direkt neben dem Preis anzeigen', row: 'Chance', why: 'Eine konkrete Verbesserungsidee für einen Pain Point.' },
  { text: 'Rezeption beim Check-in', row: 'Touchpoint', why: 'Auch analoge Kontakte gehören in die Map, nicht nur Screens.' },
];

export const JourneySortExercise = () => {
  const [answers, setAnswers] = useState<(MapRow | null)[]>(SORT_ITEMS.map(() => null));
  const done = answers.filter(Boolean).length;
  const correct = answers.filter((a, i) => a === SORT_ITEMS[i].row).length;
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 md:p-6">
      <p className="text-sm text-stone-600 mb-4">Szenario: Eine Person bucht ein Hotel für ein Wochenende. In welche Zeile der Journey Map gehört die Aussage?</p>
      <ol className="space-y-4">
        {SORT_ITEMS.map((it, i) => {
          const a = answers[i];
          const ok = a === it.row;
          return (
            <li key={i} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0">
              <p className="text-stone-900 font-medium mb-2">{it.text}</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={`Zeile für Aussage ${i + 1} wählen`}>
                {MAP_ROWS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={a === r}
                    onClick={() => setAnswers((prev) => prev.map((x, j) => (j === i ? r : x)))}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors ${a === r ? 'bg-cta border-cta text-white hover:bg-cta-hover' : 'bg-white border-stone-300 text-stone-700 hover:border-stone-500'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div aria-live="polite">
                {a && (
                  <p className={`mt-2 flex gap-2 text-sm ${ok ? 'text-green-800' : 'text-red-800'}`}>
                    {ok ? <CheckCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> : <XCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />}
                    <span><strong>{ok ? 'Richtig.' : `Nicht ganz – gesucht ist „${it.row}“.`}</strong> {it.why}</span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <p className="text-stone-700" aria-live="polite">{done} von {SORT_ITEMS.length} zugeordnet, {correct} richtig</p>
        {done > 0 && (
          <button type="button" onClick={() => setAnswers(SORT_ITEMS.map(() => null))} className="flex items-center gap-1.5 font-semibold text-stone-700 hover:text-orange-600">
            <RotateCcw size={14} aria-hidden="true" /> Zurücksetzen
          </button>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   Wireframing: drei Fidelity-Stufen desselben Screens
   ============================================================ */
const Bar = ({ w, h = 'h-2', c = 'bg-stone-300' }: { w: string; h?: string; c?: string }) => <div className={`${h} ${w} ${c} rounded`} />;

export const WireframeFidelity = () => (
  <figure className="bg-white rounded-2xl border border-stone-200 p-5 md:p-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Skizze */}
      <div>
        <p className="text-sm font-bold text-stone-900 mb-2">1 · Skizze</p>
        <div className="aspect-[9/16] max-w-[200px] mx-auto rounded-2xl border-2 border-dashed border-stone-500 p-3 flex flex-col gap-3 font-[cursive] text-stone-700 text-xs" aria-hidden="true">
          <div className="border-2 border-stone-500 rounded-lg p-2 text-center">Kontostand<br />€ €€€</div>
          <div className="space-y-2 flex-1">
            <div className="border-b-2 border-stone-400">~~~~ €</div>
            <div className="border-b-2 border-stone-400">~~~ €</div>
            <div className="border-b-2 border-stone-400">~~~~~ €</div>
          </div>
          <div className="self-end w-9 h-9 rounded-full border-2 border-stone-500 grid place-items-center">+</div>
        </div>
      </div>
      {/* Low-Fi */}
      <div>
        <p className="text-sm font-bold text-stone-900 mb-2">2 · Low-Fidelity</p>
        <div className="aspect-[9/16] max-w-[200px] mx-auto rounded-2xl border border-stone-300 bg-stone-50 p-3 flex flex-col gap-3" aria-hidden="true">
          <div className="h-16 rounded-lg bg-stone-300" />
          <div className="space-y-2 flex-1">
            {[0, 1, 2, 3].map((i) => <div key={i} className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-stone-300" /><Bar w="flex-1" /></div>)}
          </div>
          <div className="self-end w-9 h-9 rounded-full bg-stone-400" />
        </div>
      </div>
      {/* Mid-Fi */}
      <div>
        <p className="text-sm font-bold text-stone-900 mb-2">3 · Mid-Fidelity</p>
        <div className="aspect-[9/16] max-w-[200px] mx-auto rounded-2xl border border-stone-300 bg-white p-3 flex flex-col gap-3 text-[11px] text-stone-800" aria-hidden="true">
          <div className="rounded-lg border border-stone-300 p-2">
            <p className="text-stone-600">Ausgaben im Mai</p>
            <p className="text-lg font-bold">1.284 €</p>
            <p className="text-stone-600">Kontostand 3.912 €</p>
          </div>
          <div className="flex-1 divide-y divide-stone-200">
            {[['Supermarkt', '−42,10'], ['Miete', '−780,00'], ['Gehalt', '+2.450,00'], ['Bäckerei', '−4,80']].map(([a, b]) => (
              <div key={a} className="flex justify-between py-1.5"><span>{a}</span><span className="font-mono">{b}</span></div>
            ))}
          </div>
          <div className="self-end rounded-full border border-stone-500 px-3 py-1.5 font-semibold">Geld senden</div>
        </div>
      </div>
    </div>
    <figcaption className="mt-5 text-xs text-stone-500">
      Derselbe Dashboard-Screen in drei Stufen. Im Mid-Fidelity-Wireframe ist das Feedback aus dem Review schon umgesetzt: Die Ausgaben stehen vor dem Kontostand.
    </figcaption>
  </figure>
);
