/* Gemeinsamer Dunkelmodus für die Startseite und alle Lern-Apps.
   Die Wahl gilt überall (gleicher Speicher), Standard ist hell.
   Schalter: jedes Element mit [data-theme-toggle] (auch später eingefügte, z. B. aus React). */
(function () {
  var KEY = 'lernapps-theme';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY) || localStorage.getItem('typolab-theme'); } catch (e) { return null; }
  }
  function sync() {
    var dark = root.getAttribute('data-theme') === 'dark';
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', String(dark));
  }
  function set(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); localStorage.setItem('typolab-theme', theme); } catch (e) { /* privat */ }
    sync();
    window.dispatchEvent(new CustomEvent('lernapps-theme', { detail: theme }));
  }

  // Sofort anwenden, bevor die Seite gezeichnet wird (kein Aufblitzen)
  root.setAttribute('data-theme', stored() === 'dark' ? 'dark' : 'light');

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    set(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  document.addEventListener('DOMContentLoaded', sync);
  // Gespeicherte Wahl erneut übernehmen, falls sie inzwischen auf einer anderen Seite geändert wurde
  function refresh() {
    var t = stored() === 'dark' ? 'dark' : 'light';
    if (root.getAttribute('data-theme') !== t) {
      root.setAttribute('data-theme', t);
      sync();
      window.dispatchEvent(new CustomEvent('lernapps-theme', { detail: t }));
    }
  }
  // Wechsel in einem anderen Tab
  window.addEventListener('storage', function (e) { if (e.key === KEY) refresh(); });
  // Zurück-Taste: Seite kommt aus dem Browser-Cache und hätte sonst den alten Modus
  window.addEventListener('pageshow', refresh);
  // Rückkehr in einen Tab, der im Hintergrund lag
  document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); });

  /* Feedback per E-Mail: Die Adresse steht nicht im HTML, sondern wird erst beim Klick
     aus Zeichencodes zusammengesetzt (für Adress-Sammler nicht lesbar). */
  var FB = [116,104,111,109,97,115,46,104,105,110,122,64,104,45,107,97,46,100,101];
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-feedback]');
    if (!el) return;
    e.preventDefault();
    var to = String.fromCharCode.apply(null, FB);
    var title = document.title.replace(/\s+/g, ' ').trim();
    var subject = 'Feedback Lern-Apps: ' + title;
    var body = 'Seite: ' + title + '\n' + location.href + '\n\n'
      + 'Art: [ ] Fehler   [ ] Verbesserungsvorschlag\n\n'
      + 'Beschreibung:\n\n';
    location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  window.LernTheme = { set: set, sync: sync, isDark: function () { return root.getAttribute('data-theme') === 'dark'; } };

  /* Nutzungsstatistik mit GoatCounter: ohne Cookies, ohne Speicherung persönlicher Daten.
     Gezählt werden Seitenaufrufe, Kapitelwechsel in den Apps (#kapitel bzw. Ansicht im UX-Lab),
     PDF-Downloads und Feedback-Klicks. Auf localhost wird nichts gezählt.
     Eigene Aufrufe ausschließen: einmal eine Seite mit #toggle-goatcounter am Ende öffnen. */
  var GC_CODE = 'dualtom'; // GoatCounter-Code, z. B. 'lernapps' → https://lernapps.goatcounter.com
  var queue = [], ready = false, last = '';
  function send(o) {
    if (ready && window.goatcounter && window.goatcounter.count) window.goatcounter.count(o);
    else queue.push(o);
  }
  function view(path) {
    path = path || (location.pathname + (location.hash && location.hash !== '#toggle-goatcounter' ? location.hash : ''));
    if (path === last) return; // keine Doppelzählung (z. B. pageshow nach load)
    last = path;
    send({ path: path, title: document.title.replace(/\s+/g, ' ').trim() });
  }
  function event(name, title) { send({ path: name, title: title || name, event: true }); }
  window.LernTrack = { view: view, event: event };

  if (GC_CODE) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://' + GC_CODE + '.goatcounter.com/count');
    s.setAttribute('data-goatcounter-settings', '{"no_onload": true}');
    s.onload = function () { ready = true; var q = queue; queue = []; for (var i = 0; i < q.length; i++) send(q[i]); };
    document.head.appendChild(s);
  }
  // Startseite, Typo-Seiten, Logo-/Farb-Lab: Aufruf zählen. Das UX-Lab meldet seine Ansichten selbst.
  if (!/\/ux-grundlagen\//.test(location.pathname)) {
    // erst nach dem Laden zählen, damit der Seitentitel feststeht
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { view(); });
    else view();
    window.addEventListener('hashchange', function () { view(); });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href], [data-feedback]');
    if (!a) return;
    if (a.hasAttribute('data-feedback')) { event('feedback', 'Feedback: ' + location.pathname); return; }
    var href = a.getAttribute('href') || '';
    if (/\.pdf($|\?)/i.test(href)) event('download/' + href.split('/').pop().split('?')[0], 'PDF-Download');
  });
  /* Suche über alle Lern-Apps: search.js liegt neben theme.js und wird nachgeladen */
  var me = document.currentScript;
  if (me && me.src && !window.LernSearch) {
    window.LernSearchVersion = '20261106h';
    var ss = document.createElement('script');
    ss.src = me.src.replace(/theme\.js.*$/, 'search.js?v=' + window.LernSearchVersion);
    ss.async = true;
    document.head.appendChild(ss);
  }
})();
