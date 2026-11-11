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
  /* Abschalten: Schalter auf der Seite datenschutz.html (Speicher 'lernapps-stats-off')
     sowie automatisch bei Global Privacy Control oder „Do Not Track“ im Browser. */
  var STATS_KEY = 'lernapps-stats-off';
  function statsOffReason() {
    try { if (localStorage.getItem(STATS_KEY) === '1') return 'user'; } catch (e) { /* privat */ }
    if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1') return 'browser';
    return null;
  }
  var statsOff = statsOffReason();
  window.LernStats = {
    off: function () { return statsOffReason(); },
    set: function (off) { try { if (off) localStorage.setItem(STATS_KEY, '1'); else localStorage.removeItem(STATS_KEY); } catch (e) { /* privat */ } }
  };
  var queue = [], ready = false, last = '';
  function send(o) {
    if (statsOff) return;
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

  if (GC_CODE && !statsOff) {
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
  /* Screenreader-Hilfen für alle Lern-Apps (ergänzen, ersetzen keine saubere Auszeichnung):
     1. Schieberegler nennen ihren Wert mit Einheit (aria-valuetext aus der sichtbaren Anzeige).
     2. Rückmeldefelder sind schon vor der Rückmeldung Live-Regionen, sonst überhören Screenreader
        nachträglich eingefügte Meldungen.
     3. Scrollbare Codeblöcke erhalten einen Namen. */
  function valueEl(r) {
    if (r.id) {
      var o = document.getElementById(r.id + '-o') || document.getElementById(r.id + '-out') || document.getElementById(r.id + '-val') || document.querySelector('output[for="' + r.id + '"]');
      if (o) return o;
    }
    for (var p = r.parentElement, i = 0; p && i < 3; p = p.parentElement, i++) {
      var c = p.querySelector('output, .slider-value');
      if (c) return c;
    }
    return null;
  }
  function syncRange(r) {
    var o = valueEl(r), t = o && o.textContent.replace(/\s+/g, ' ').trim();
    if (t) r.setAttribute('aria-valuetext', t);
  }
  function a11yScan(root) {
    var rs = root.querySelectorAll ? root.querySelectorAll('input[type="range"]') : [];
    for (var i = 0; i < rs.length; i++) syncRange(rs[i]);
    var fb = root.querySelectorAll ? root.querySelectorAll('[id$="-fb"], [id$="-res"], [id$="-result"], #quiz-fb') : [];
    for (var j = 0; j < fb.length; j++) {
      var f = fb[j];
      if (!f.closest('[aria-live], [role="status"], [role="alert"], [role="log"]')) f.setAttribute('aria-live', 'polite');
    }
    var pres = root.querySelectorAll ? root.querySelectorAll('pre[tabindex]:not([aria-label]):not([aria-labelledby])') : [];
    for (var k = 0; k < pres.length; k++) { pres[k].setAttribute('role', 'region'); pres[k].setAttribute('aria-label', 'Codebeispiel'); }
  }
  /* Datenschutz und Impressum: Links unter jedem Feedback-Link (Seitenleisten aller Apps, auch React) */
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/theme\.js.*$/, '');
  function legalLinks() {
    if (!BASE) return;
    var fbs = document.querySelectorAll('[data-feedback]');
    for (var i = 0; i < fbs.length; i++) {
      var f = fbs[i], n = f.nextElementSibling;
      if (f.hasAttribute('data-no-legal')) continue;
      if (n && n.classList.contains('legal-links')) continue;
      var p = document.createElement('p');
      p.className = 'legal-links';
      p.style.cssText = 'margin:2px 0 6px;padding:0 12px;font-size:12px;line-height:1.5;opacity:.85';
      p.innerHTML = '<a href="' + BASE + 'datenschutz.html" style="color:inherit">Datenschutz</a> · <a href="' + BASE + 'impressum.html" style="color:inherit">Impressum</a>';
      f.parentNode.insertBefore(p, f.nextSibling);
    }
  }
  function a11yInit() {
    a11yScan(document); legalLinks();
    // Anzeige wird im selben Ereignis aktualisiert: Wert erst danach übernehmen
    document.addEventListener('input', function (e) { if (e.target && e.target.type === 'range') setTimeout(function () { syncRange(e.target); }, 0); });
    document.addEventListener('change', function (e) { if (e.target && e.target.type === 'range') setTimeout(function () { syncRange(e.target); }, 0); });
    if (window.MutationObserver) {
      var pending = false;
      new MutationObserver(function () {
        if (pending) return; pending = true;
        setTimeout(function () { pending = false; a11yScan(document); legalLinks(); }, 50);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', a11yInit);
  else a11yInit();

  /* Suche über alle Lern-Apps: search.js liegt neben theme.js und wird nachgeladen */
  var me = document.currentScript;
  if (me && me.src && !window.LernSearch) {
    window.LernSearchVersion = '20261112b';
    var ss = document.createElement('script');
    ss.src = me.src.replace(/theme\.js.*$/, 'search.js?v=' + window.LernSearchVersion);
    ss.async = true;
    document.head.appendChild(ss);
  }
})();
