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
  // Wechsel in einem anderen Tab übernehmen
  window.addEventListener('storage', function (e) {
    if (e.key === KEY && e.newValue) { root.setAttribute('data-theme', e.newValue); sync(); }
  });

  window.LernTheme = { set: set, sync: sync, isDark: function () { return root.getAttribute('data-theme') === 'dark'; } };
})();
