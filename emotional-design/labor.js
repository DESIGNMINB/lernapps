/* Labor „Adaptive Personality-Mischpult“: Texte und Regeln.
   Zustand: 0 entspannt, 1 angespannt, 2 frustriert. Ton: 0 formell, 1 empathisch, 2 verspielt. */
export const zustaende = [
  { name: 'Entspannt', lage: 'Die Person stöbert ohne Zeitdruck und geht in Ruhe zur Kasse.' },
  { name: 'Angespannt', lage: 'Die Seite lädt langsam, die Person ist in Eile und will den Kauf abschließen.' },
  { name: 'Frustriert', lage: 'Die Zahlung wurde zum zweiten Mal abgelehnt. Die Person ist verärgert und überlegt abzubrechen.' }
];
export const toene = ['Formell', 'Empathisch', 'Verspielt'];

/* texte[zustand][ton] = { h: Überschrift, m: Meldung, b: Schaltfläche } */
export const texte = [
  [
    { h: 'Zahlungsangaben', m: 'Bitte geben Sie Ihre Zahlungsdaten ein und bestätigen Sie die Bestellung.', b: 'Bestellung absenden' },
    { h: 'Fast geschafft', m: 'Nur noch die Zahlung, dann ist Ihre Bestellung unterwegs.', b: 'Jetzt bestellen' },
    { h: 'Ab in den Einkaufswagen-Endspurt!', m: 'Noch ein Klick, und Ihr Paket macht sich auf die Reise. Wir packen schon mal Konfetti ein.', b: 'Los geht’s!' }
  ],
  [
    { h: 'Zahlungsangaben', m: 'Die Verarbeitung kann einige Sekunden dauern. Bitte laden Sie die Seite nicht neu.', b: 'Bestellung absenden' },
    { h: 'Einen Moment noch', m: 'Wir verbinden uns mit Ihrer Bank. Das dauert etwa zehn Sekunden, Ihre Eingaben bleiben gespeichert.', b: 'Bestellung absenden' },
    { h: 'Die Hamster rennen schon!', m: 'Unser Server dreht noch ein paar Runden im Rad. Gleich geht es weiter, versprochen!', b: 'Weiter, weiter!' }
  ],
  [
    { h: 'Zahlung abgelehnt', m: 'Die Transaktion konnte nicht durchgeführt werden. Bitte überprüfen Sie Ihre Angaben.', b: 'Erneut versuchen' },
    { h: 'Die Zahlung hat leider nicht geklappt', m: 'Ihre Bank hat die Zahlung abgelehnt. Das liegt nicht an Ihnen. Ihr Warenkorb ist gespeichert. Sie können eine andere Zahlungsart wählen oder später weitermachen.', b: 'Andere Zahlungsart wählen' },
    { h: 'Ups, da hat die Bank gestreikt!', m: 'Zweiter Versuch, zweiter Korb. Die Bank ist heute offenbar schlecht gelaunt. Einfach nochmal probieren?', b: 'Nochmal würfeln!' }
  ]
];

/* Bänder: 0–33, 34–66, 67–100 */
export const band = (v) => (v <= 33 ? 0 : v <= 66 ? 1 : 2);

/* Regeln: Rückmeldung als Text, ohne Punktwerte. typ: warn | hinweis | ok */
export const regeln = [
  { wenn: (s) => s.zustand > 66 && s.ton > 66, typ: 'warn', titel: 'Verspielter Ton trifft Frust',
    text: 'Witze bei einem Fehler, den die Person nicht verursacht hat, wirken schnell zynisch. Wer verärgert ist, will verstanden werden und eine Lösung sehen, keine Pointe.' },
  { wenn: (s) => s.zustand > 66 && s.kinetik > 66, typ: 'warn', titel: 'Federnde Bewegung trifft Stress',
    text: 'Hüpfende Animationen binden Aufmerksamkeit und verlängern gefühlt die Wartezeit. Unter Stress wirken sie wie ein Spott über die Lage. Ruhige, kurze Übergänge genügen.' },
  { wenn: (s) => s.zustand > 33 && s.zustand <= 66 && s.kinetik > 80, typ: 'warn', titel: 'Viel Bewegung bei Eile',
    text: 'Wer es eilig hat, empfindet lange, federnde Animationen als Verzögerung. Bewegung sollte hier Orientierung geben, nicht unterhalten.' },
  { wenn: (s) => s.zustand > 66 && s.ton <= 33, typ: 'hinweis', titel: 'Korrekt, aber kühl',
    text: 'Die formelle Meldung ist nicht falsch, schiebt aber die Verantwortung zurück („Überprüfen Sie Ihre Angaben“) und bietet keinen Ausweg. Ein empathischer Ton nennt die Ursache und eine Alternative.' },
  { wenn: (s) => s.zustand > 66 && s.temperatur < 25, typ: 'hinweis', titel: 'Sehr kühle Farbwelt bei Frust',
    text: 'Kühle, kantige Gestaltung wirkt sachlich und kann bei Ärger abweisend erscheinen. Eine etwas wärmere, rundere Gestaltung signalisiert Zuwendung, ohne den Fehler zu verharmlosen.' },
  { wenn: (s) => s.zustand > 66 && s.temperatur > 85 && s.ton > 66, typ: 'warn', titel: 'Alles auf Party',
    text: 'Warm, rund und verspielt zugleich: Das Interface feiert, während die Person sich ärgert. Die emotionale Botschaft widerspricht der Lage.' },
  { wenn: (s) => s.zustand <= 33 && s.ton <= 33 && s.temperatur <= 33 && s.kinetik <= 20, typ: 'hinweis', titel: 'Funktioniert, verschenkt aber Joy of Use',
    text: 'Bei entspannten Nutzenden ist Raum für Freundlichkeit. Ein etwas wärmerer Ton und eine kleine Bestätigungsanimation könnten die viszerale und reflexive Ebene stärken.' },
  { wenn: (s) => s.zustand > 66 && s.ton > 33 && s.ton <= 66 && s.kinetik <= 50 && s.temperatur >= 25 && s.temperatur <= 85, typ: 'ok', titel: 'Stimmig',
    text: 'Empathischer Ton, ruhige Bewegung, freundliche, aber nicht feiernde Farbwelt: Die Gestaltung nimmt den Ärger ernst und zeigt einen Weg nach vorn.' }
];
