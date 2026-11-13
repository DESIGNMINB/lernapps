/* Übungsdaten */

/* Circumplex: Interface-Momente mit naheliegender Lage. v = Valenz, a = Arousal, jeweils -1 bis 1 */
export const momente = [
  { id: 'e500', kurz: 'Error 500', text: 'Error 500 beim Absenden eines langen Formulars', v: -0.75, a: 0.7, why: 'Unangenehm und aufwühlend: Arbeit scheint verloren, die Ursache ist unklar.' },
  { id: 'checkout', kurz: 'Checkout erfolgreich', text: 'Erfolgreicher Checkout mit Bestätigung', v: 0.7, a: 0.35, why: 'Angenehm und leicht aktivierend: Erleichterung und Vorfreude.' },
  { id: 'konfetti', kurz: 'Konfetti', text: 'Konfetti nach dem abgeschlossenen Kurs', v: 0.8, a: 0.75, why: 'Sehr angenehm und aktivierend: ein Moment zum Feiern.' },
  { id: 'inbox', kurz: 'Leerer Posteingang', text: 'Leerer Posteingang mit ruhiger Illustration', v: 0.6, a: -0.6, why: 'Angenehm und beruhigend: alles erledigt, nichts drängt.' },
  { id: 'hang', kurz: 'Ladebalken 99 %', text: 'Ladebalken bleibt bei 99 % stehen', v: -0.55, a: 0.45, why: 'Unangenehm und zunehmend angespannt: Unsicherheit, ob es weitergeht.' },
  { id: 'timeout', kurz: 'Sitzung abgelaufen', text: 'Sitzung abgelaufen, Eingaben verloren', v: -0.85, a: 0.6, why: 'Sehr unangenehm und aufwühlend: Ärger über verlorene Zeit.' },
  { id: 'agb', kurz: 'Nutzungsbedingungen', text: 'Seitenlange Nutzungsbedingungen lesen', v: -0.4, a: -0.6, why: 'Leicht unangenehm und ermüdend: Langeweile, kaum Aktivierung.' },
  { id: 'dark', kurz: 'Dunkelmodus', text: 'Abends wechselt die App automatisch in den Dunkelmodus', v: 0.35, a: -0.45, why: 'Leicht angenehm und beruhigend, kaum bemerkt.' }
];

/* Checkliste „Ist dieses Feature manipulativ?“. kritisch = Antwort, die einen Prüfhinweis auslöst */
export const checkliste = [
  { q: 'Nutzt das Feature Gefühle wie Angst, Scham oder Schuld, um eine Entscheidung zu beschleunigen?', kritisch: 'ja', hinweis: 'Gefühle als Druckmittel: prüfen auf Confirmshaming, künstliche Dringlichkeit, Schuldgefühle (DSA Art. 25).' },
  { q: 'Ist Ablehnen genauso einfach, sichtbar und neutral formuliert wie Zustimmen?', kritisch: 'nein', hinweis: 'Ungleiche Optionen: Ablehnen gleichwertig gestalten, ohne Beschämung.' },
  { q: 'Leitet das Feature Gefühle aus Gesicht, Stimme oder Körpersignalen ab?', kritisch: 'ja', hinweis: 'Emotionserkennungssystem im Sinne des AI Act: Hochrisiko, Informationspflicht nach Art. 50 Abs. 3.' },
  { q: 'Wird es am Arbeitsplatz oder in einer Bildungseinrichtung eingesetzt?', kritisch: 'ja', hinweis: 'In Verbindung mit Emotionserkennung verboten nach AI Act Art. 5 Abs. 1 Buchst. f, außer aus medizinischen oder Sicherheitsgründen.' },
  { q: 'Wurde geprüft, ob das System für alle Gruppen gleich gut funktioniert (Hautfarbe, Geschlecht, Alter, Kultur, Behinderung)?', kritisch: 'nein', hinweis: 'Bias nicht geprüft: Fehler treffen oft die ohnehin Benachteiligten (vgl. Gender Shades).' },
  { q: 'Nutzt das Feature Momente der Verletzlichkeit wie Trauer, Stress oder Einsamkeit für Verkauf oder Bindung?', kritisch: 'ja', hinweis: 'Ausnutzen von Verletzlichkeit: ethisch nicht vertretbar; bei KI und Schutzbedürftigkeit wegen Alter, Behinderung oder sozialer oder wirtschaftlicher Lage ggf. verboten nach AI Act Art. 5 Abs. 1 Buchst. b.' },
  { q: 'Können Menschen die emotionale Anpassung erkennen und abschalten?', kritisch: 'nein', hinweis: 'Keine Kontrolle: Personalisierung sichtbar und abschaltbar machen.' },
  { q: 'Könnten Sie den Betroffenen offen erklären, wie das Feature auf ihre Gefühle wirkt, ohne dass es seine Wirkung verliert?', kritisch: 'nein', hinweis: 'Transparenztest nicht bestanden: Was nur im Verborgenen wirkt, ist meist Manipulation.' },
  { q: 'Dient die emotionale Gestaltung vor allem den Zielen der Nutzenden statt allein Kennzahlen wie Verweildauer oder Umsatz?', kritisch: 'nein', hinweis: 'Zielkonflikt: Gestaltung dient Kennzahlen statt Menschen.' },
  { q: 'Gibt es eine sachliche Alternative ohne emotionale Zuspitzung, etwa eine schlichte Ansicht oder ruhige Benachrichtigungen?', kritisch: 'nein', hinweis: 'Keine Ausweichmöglichkeit: eine ruhige, sachliche Variante anbieten.' }
];
