/* Suche über alle Lern-Apps mit Vorschlägen während der Eingabe.
   Wird von theme.js auf jeder Seite nachgeladen. Der Index (search-index.json) wird erst beim
   ersten Öffnen geladen und mit summaries/searchindex.py neu erzeugt.
   Öffnen: Knopf „Suchen“, Strg/⌘ + K oder die Taste „/“. */
(function () {
  'use strict';
  if (window.LernSearch) return;
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/search\.js.*$/, '') || '/';
  var JUMP_KEY = 'lernapps-jump';
  var data = null, loading = null, scope = 'all', active = -1, results = [], opener = null;
  var POPULAR = ['Kontrast', 'Gestaltgesetze', 'Goldener Schnitt', 'Farbkreis', 'Zeilenabstand', 'Heuristik', 'Barrierefreiheit', 'Easing', 'SUS', 'Persona', 'Piktogramm', 'Schriftklassifikation'];

  var norm = function (s) { return String(s).toLowerCase().replace(/ß/g, 'ss').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').normalize('NFKD').replace(/[̀-ͯ]/g, ''); };
  // Längentreue Variante für Markierungen: jedes Zeichen bleibt ein Zeichen
  var ACC = { 'ä': 'a', 'à': 'a', 'á': 'a', 'â': 'a', 'ö': 'o', 'ó': 'o', 'ô': 'o', 'ü': 'u', 'ú': 'u', 'é': 'e', 'è': 'e', 'ê': 'e', 'í': 'i', 'ç': 'c', 'ñ': 'n' };
  var nc = function (s) { return String(s).toLowerCase().replace(/[äàáâöóôüúéèêíçñ]/g, function (c) { return ACC[c]; }); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var rel = location.href.indexOf(BASE) === 0 ? location.href.slice(BASE.length) : '';
  var currentApp = rel.split(/[\/#?]/)[0] || '';
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  /* ---------- Stil ---------- */
  var css = '' +
    '.ls-trigger{position:fixed;bottom:calc(18px + env(safe-area-inset-bottom,0px));right:18px;z-index:9000;display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px 0 12px;border:1px solid #D1D5DB;border-radius:999px;background:#fff;color:#1F2937;font:600 14px/1 "IBM Plex Sans",system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 10px rgba(17,24,39,.08)}' +
    '.ls-trigger:hover,.ls-trigger:focus-visible{border-color:#64378C;color:#64378C;outline:none;box-shadow:0 0 0 3px rgba(100,55,140,.25)}' +
    '.ls-trigger svg,.ls-bar svg{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round}' +
    '.ls-trigger kbd,.ls-kbd{font:600 11px/1 "IBM Plex Mono",ui-monospace,monospace;padding:4px 6px;border:1px solid #D1D5DB;border-radius:6px;color:#5B6270;background:#F9FAFB}' +
    '@media (max-width:860px){.ls-trigger{width:44px;height:44px;padding:0;justify-content:center;right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));box-shadow:0 2px 12px rgba(17,24,39,.16)}.ls-trigger span,.ls-trigger kbd{display:none}.ls-trigger svg{width:20px;height:20px}}' +
    '.ls-overlay{position:fixed;inset:0;z-index:9500;background:rgba(17,24,39,.45);display:flex;justify-content:center;align-items:flex-start;padding:8vh 16px 16px}' +
    '.ls-overlay[hidden]{display:none}' +
    '.ls-dialog{width:100%;max-width:680px;max-height:84vh;display:flex;flex-direction:column;background:#fff;color:#1F2937;border-radius:16px;box-shadow:0 20px 60px rgba(17,24,39,.3);overflow:hidden;font:400 15px/1.45 "IBM Plex Sans",system-ui,sans-serif}' +
    '.ls-bar{display:flex;align-items:center;gap:10px;padding:12px 14px 12px 18px;border-bottom:1px solid #E5E7EB;color:#5B6270}' +
    '.ls-bar input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#111827;font:500 18px/1.3 "IBM Plex Sans",system-ui,sans-serif;padding:8px 0}' +
    '.ls-bar input::placeholder{color:#6B7280}' +
    '.ls-close{border:1px solid #D1D5DB;background:#fff;color:#374151;border-radius:8px;padding:7px 10px;font:600 12px/1 "IBM Plex Sans",system-ui,sans-serif;cursor:pointer}' +
    '.ls-close:hover,.ls-close:focus-visible{background:#4B5563;border-color:#4B5563;color:#fff;outline:none}' +
    '.ls-scope{display:flex;gap:6px;flex-wrap:wrap;padding:10px 18px 0}' +
    '.ls-chip{border:1px solid #D1D5DB;background:#fff;color:#374151;border-radius:999px;padding:6px 12px;font:600 13px/1.1 "IBM Plex Sans",system-ui,sans-serif;cursor:pointer}' +
    '.ls-chip:hover,.ls-chip:focus-visible{border-color:#64378C;color:#64378C;outline:none;box-shadow:0 0 0 2px rgba(100,55,140,.25)}' +
    '.ls-chip[aria-pressed="true"]{background:#CC4E00;border-color:#CC4E00;color:#fff}' +
    '.ls-body{overflow-y:auto;padding:6px 10px 10px;overscroll-behavior:contain}' +
    '.ls-label{font:700 11px/1.2 "IBM Plex Sans",system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#5B6270;margin:12px 8px 8px}' +
    '.ls-sugg{display:flex;flex-wrap:wrap;gap:6px;padding:0 8px}' +
    '.ls-sugg mark,.ls-opt mark{background:#FDE7D6;color:inherit;border-radius:3px;padding:0 1px}' +
    '.ls-list{list-style:none;margin:0;padding:0}' +
    '.ls-opt{display:block;padding:10px 12px;border-radius:10px;cursor:pointer;border:2px solid transparent}' +
    '.ls-opt[aria-selected="true"]{background:#F1EEF4;border-color:#64378C}' +
    '.ls-opt .m{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;font-size:12px;color:#5B6270;margin-bottom:3px}' +
    '.ls-opt .app{display:inline-flex;align-items:center;gap:5px;font-weight:700;color:#64378C}' +
    '.ls-opt .app b{display:inline-grid;place-items:center;min-width:22px;height:18px;padding:0 4px;border-radius:5px;background:#64378C;color:#fff;font-size:10.5px}' +
    '.ls-opt .k{border:1px solid #D1D5DB;border-radius:999px;padding:1px 7px}' +
    '.ls-opt .t{font-weight:700;font-size:15.5px;color:#111827}' +
    '.ls-opt .x{font-size:13.5px;color:#4B5563;margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}' +
    '.ls-msg{padding:14px 10px;color:#4B5563}' +
    '.ls-msg button{border:0;background:none;color:#64378C;font:inherit;font-weight:700;text-decoration:underline;cursor:pointer;padding:0}' +
    '.ls-foot{display:flex;flex-wrap:wrap;gap:6px 16px;padding:10px 18px;border-top:1px solid #E5E7EB;font-size:12px;color:#5B6270}' +
    '.ls-foot span{display:inline-flex;align-items:center;gap:6px}' +
    '.ls-inline{display:flex;align-items:center;gap:10px;width:100%;max-width:560px;margin:22px 0 0;padding:0 8px 0 16px;height:52px;border:1.5px solid #858C98;border-radius:999px;background:#fff;color:#5B6270;cursor:text}' +
    '.ls-inline:focus-within,.ls-inline:hover{border-color:#64378C;box-shadow:0 0 0 3px rgba(100,55,140,.2)}' +
    '.ls-inline input{flex:1;min-width:0;border:0;outline:0;background:transparent;color:#111827;font:500 16px/1.3 "IBM Plex Sans",system-ui,sans-serif}' +
    '.ls-inline input::placeholder{color:#5B6270}' +
    '.ls-inline svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;flex:none}' +
    '.ls-flash{outline:3px solid #CC4E00 !important;outline-offset:6px;border-radius:4px;scroll-margin-top:90px}' +
    '.ls-sr{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    'html.ls-open{overflow:hidden}' +
    '[data-theme="dark"] .ls-trigger,[data-theme="dark"] .ls-inline{background:#1A1D27;border-color:#4B5068;color:#E5E7EB}' +
    '[data-theme="dark"] .ls-inline input,[data-theme="dark"] .ls-bar input{color:#F3F4F6}' +
    '[data-theme="dark"] .ls-inline input::placeholder,[data-theme="dark"] .ls-bar input::placeholder{color:#9CA3AF}' +
    '[data-theme="dark"] .ls-trigger kbd,[data-theme="dark"] .ls-kbd{background:#252836;border-color:#4B5068;color:#C5CAD3}' +
    '[data-theme="dark"] .ls-dialog{background:#1A1D27;color:#E5E7EB}' +
    '[data-theme="dark"] .ls-bar,[data-theme="dark"] .ls-foot{border-color:#2D3148;color:#9CA3AF}' +
    '[data-theme="dark"] .ls-close,[data-theme="dark"] .ls-chip{background:#252836;border-color:#4B5068;color:#E5E7EB}' +
    '[data-theme="dark"] .ls-chip[aria-pressed="true"]{background:#CC4E00;border-color:#CC4E00;color:#fff}' +
    '[data-theme="dark"] .ls-label,[data-theme="dark"] .ls-opt .m,[data-theme="dark"] .ls-msg,[data-theme="dark"] .ls-foot{color:#A7AEBB}' +
    '[data-theme="dark"] .ls-opt .t{color:#F3F4F6}[data-theme="dark"] .ls-opt .x{color:#C5CAD3}' +
    '[data-theme="dark"] .ls-opt .app{color:#C8A8DE}[data-theme="dark"] .ls-opt .k{border-color:#4B5068}' +
    '[data-theme="dark"] .ls-opt[aria-selected="true"]{background:#2A2140;border-color:#9254D1}' +
    '[data-theme="dark"] .ls-sugg mark,[data-theme="dark"] .ls-opt mark{background:#5A3416;color:#fff}' +
    '[data-theme="dark"] .ls-msg button{color:#C8A8DE}' +
    '@media print{.ls-trigger,.ls-overlay{display:none!important}}';

  /* ---------- Index ---------- */
  function load() {
    if (data) return Promise.resolve(data);
    if (loading) return loading;
    loading = fetch(BASE + 'search-index.json?v=' + (window.LernSearchVersion || '1')).then(function (r) { return r.json(); }).then(function (d) {
      d.e.forEach(function (e) {
        e.nt = norm(e.t); e.np = norm(e.p); e.nx = norm(e.x);
        e.w = e.nt.split(/[^a-z0-9]+/).filter(Boolean);
      });
      var seen = {}, vocab = [];
      d.e.forEach(function (e) {
        var key = e.nt;
        if (seen[key] || e.t.length > 48) return;
        seen[key] = 1; vocab.push(e);
      });
      d.vocab = vocab;
      data = d; return d;
    }).catch(function (err) { loading = null; throw err; });
    return loading;
  }

  function score(e, toks) {
    var s = 0;
    for (var i = 0; i < toks.length; i++) {
      var q = toks[i], hit = 0;
      if (e.nt === q) hit = 120;
      else if (e.nt.indexOf(q) === 0) hit = 70;
      else if (e.w.some(function (w) { return w.indexOf(q) === 0; })) hit = 50;
      else if (e.nt.indexOf(q) >= 0) hit = 35;
      else if (e.np.indexOf(q) >= 0) hit = 14;
      else if (e.nx.indexOf(q) >= 0) hit = 8;
      if (!hit) return 0;
      s += hit;
    }
    if (e.k === 'Begriff') s += 6;
    if (e.k === 'Kapitel' || e.k === 'Übung') s += 4;
    if (data.apps[e.a].s === currentApp) s += 5;
    return s - Math.min(10, e.t.length / 12);
  }

  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    var p = [], c, i, j;
    for (j = 0; j <= b.length; j++) p[j] = j;
    for (i = 1; i <= a.length; i++) {
      c = [i];
      for (j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      p = c;
    }
    return p[b.length];
  }

  function search(q) {
    var toks = norm(q).split(/\s+/).filter(Boolean);
    if (!toks.length) return [];
    var out = [];
    data.e.forEach(function (e) {
      if (scope !== 'all' && data.apps[e.a].s !== scope) return;
      var s = score(e, toks);
      if (s > 0) out.push([s, e]);
    });
    out.sort(function (a, b) { return b[0] - a[0]; });
    return out.slice(0, 40).map(function (x) { return x[1]; });
  }

  function suggestions(q) {
    var nq = norm(q).trim();
    if (nq.length < 2) return [];
    var out = [];
    for (var i = 0; i < data.vocab.length && out.length < 7; i++) {
      var e = data.vocab[i];
      if (e.nt !== nq && (e.nt.indexOf(nq) === 0 || e.w.some(function (w) { return w.indexOf(nq) === 0; }))) out.push(e.t);
    }
    return out.sort(function (a, b) { return a.length - b.length; });
  }

  function didYouMean(q) {
    var toks = norm(q).split(/\s+/).filter(function (t) { return t.length >= 4; });
    if (!toks.length) return null;
    var best = null, bd = 9;
    data.e.forEach(function (e) {
      e.w.forEach(function (w) {
        toks.forEach(function (t) {
          var d = lev(t, w.slice(0, Math.max(t.length, Math.min(w.length, t.length + 1))));
          var lim = t.length >= 8 ? 2 : 1;
          if (d <= lim && d < bd) { bd = d; best = e.t; }
        });
      });
    });
    return best;
  }

  function mark(text, q) {
    var t = esc(text), toks = nc(q).split(/\s+/).filter(function (x) { return x.length > 1; });
    if (!toks.length) return t;
    var n = nc(text), ranges = [];
    toks.forEach(function (tok) { var i = n.indexOf(tok); if (i >= 0) ranges.push([i, i + tok.length]); });
    if (!ranges.length) return t;
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var res = '', pos = 0;
    ranges.forEach(function (r) { if (r[0] < pos) return; res += esc(text.slice(pos, r[0])) + '<mark>' + esc(text.slice(r[0], r[1])) + '</mark>'; pos = r[1]; });
    return res + esc(text.slice(pos));
  }

  function snippet(e, q) {
    var x = e.x || '', toks = nc(q).split(/\s+/).filter(Boolean), n = nc(x), i = -1;
    for (var k = 0; k < toks.length && i < 0; k++) i = n.indexOf(toks[k]);
    if (i > 60) { var st = x.lastIndexOf(' ', i - 40); x = '… ' + x.slice(st > 0 ? st + 1 : i - 40); }
    return mark(x.slice(0, 190), q);
  }

  /* ---------- Oberfläche ---------- */
  var ov, input, list, sugg, msg, live, scopeBox;
  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var mag = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
    var inline = document.querySelector('[data-lernapps-search]');
    if (inline) {
      inline.innerHTML = '<label class="ls-inline">' + mag + '<span class="ls-sr">Alle Lern-Apps durchsuchen</span><input type="search" placeholder="Alle Lern-Apps durchsuchen, z. B. Kontrast" autocomplete="off"><kbd class="ls-kbd" aria-hidden="true">' + (isMac ? '⌘ K' : 'Strg K') + '</kbd></label>';
      var ii = inline.querySelector('input');
      ii.addEventListener('input', function () { var v = ii.value; ii.value = ''; open(ii, v); });
      ii.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); open(ii, ii.value); } });
      ii.addEventListener('click', function () { open(ii, ''); });
    } else {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'ls-trigger'; b.setAttribute('aria-haspopup', 'dialog');
      b.setAttribute('aria-label', 'Alle Lern-Apps durchsuchen');
      b.innerHTML = mag + '<span>Suchen</span><kbd aria-hidden="true">' + (isMac ? '⌘K' : 'Strg K') + '</kbd>';
      b.addEventListener('click', function () { open(b, ''); });
      document.body.appendChild(b);
    }
    ov = document.createElement('div');
    ov.className = 'ls-overlay'; ov.hidden = true;
    var appName = '';
    ov.innerHTML = '<div class="ls-dialog" role="dialog" aria-modal="true" aria-label="Alle Lern-Apps durchsuchen">' +
      '<div class="ls-bar">' + mag + '<input type="text" role="combobox" aria-expanded="false" aria-controls="ls-list" aria-autocomplete="list" aria-label="Suchbegriff" placeholder="Suchen, z. B. Kontrast oder Easing" autocomplete="off" spellcheck="false"><button type="button" class="ls-close">Esc<span class="ls-sr"> Suche schließen</span></button></div>' +
      '<div class="ls-scope" role="group" aria-label="Suchbereich" hidden></div>' +
      '<div class="ls-body"><div class="ls-sw"></div><ul class="ls-list" id="ls-list" role="listbox" aria-label="Treffer"></ul><div class="ls-msg" hidden></div></div>' +
      '<div class="ls-foot"><span><kbd class="ls-kbd">↑</kbd><kbd class="ls-kbd">↓</kbd> auswählen</span><span><kbd class="ls-kbd">Enter</kbd> öffnen</span><span><kbd class="ls-kbd">Esc</kbd> schließen</span></div>' +
      '<p class="ls-sr" aria-live="polite"></p></div>';
    document.body.appendChild(ov);
    input = ov.querySelector('.ls-bar input'); list = ov.querySelector('.ls-list'); sugg = ov.querySelector('.ls-sw');
    msg = ov.querySelector('.ls-msg'); live = ov.querySelector('[aria-live]'); scopeBox = ov.querySelector('.ls-scope');
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) close(); });
    ov.querySelector('.ls-close').addEventListener('click', close);
    input.addEventListener('input', render);
    input.addEventListener('keydown', onKey);
    ov.addEventListener('keydown', trap);
    list.addEventListener('click', function (e) { var li = e.target.closest('[data-i]'); if (li) go(results[+li.dataset.i]); });
    list.addEventListener('mousemove', function (e) { var li = e.target.closest('[data-i]'); if (li && +li.dataset.i !== active) setActive(+li.dataset.i, false); });
    ov.addEventListener('click', function (e) {
      var c = e.target.closest('[data-fill]'); if (c) { input.value = c.dataset.fill; render(); input.focus(); return; }
      var s = e.target.closest('[data-scope]'); if (s) { scope = s.dataset.scope; renderScope(); render(); input.focus(); }
    });
    document.addEventListener('keydown', function (e) {
      var k = e.key && e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); ov.hidden ? open(document.activeElement, '') : close(); return; }
      if (e.key === '/' && ov.hidden && !/^(input|textarea|select)$/i.test((e.target.tagName || '')) && !e.target.isContentEditable) { e.preventDefault(); open(document.activeElement, ''); }
    });
    void appName;
  }

  function renderScope() {
    if (!data) return;
    var me = data.apps.filter(function (a) { return a.s === currentApp; })[0];
    if (!me) { scopeBox.hidden = true; scope = 'all'; return; }
    scopeBox.hidden = false;
    scopeBox.innerHTML = '<button type="button" class="ls-chip" data-scope="all" aria-pressed="' + (scope === 'all') + '">Alle Lern-Apps</button><button type="button" class="ls-chip" data-scope="' + me.s + '" aria-pressed="' + (scope === me.s) + '">Nur ' + esc(me.m + ' · ' + me.n) + '</button>';
  }

  function open(from, value) {
    opener = from;
    ov.hidden = false; document.documentElement.classList.add('ls-open');
    input.value = value || ''; input.focus();
    list.innerHTML = ''; msg.hidden = false; msg.textContent = 'Suchindex wird geladen …';
    load().then(function () { renderScope(); render(); }).catch(function () { msg.hidden = false; msg.textContent = 'Die Suche konnte nicht geladen werden. Bitte prüfen Sie Ihre Internetverbindung.'; });
    if (window.LernTrack) window.LernTrack.event('suche/open', 'Suche geöffnet');
  }
  function close() {
    if (ov.hidden) return;
    ov.hidden = true; document.documentElement.classList.remove('ls-open');
    input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant');
    if (opener && opener.focus && document.contains(opener)) opener.focus();
  }

  function render() {
    if (!data) return;
    var q = input.value.trim();
    active = -1;
    if (!q) {
      results = [];
      var pop = POPULAR.filter(function (p) { return data.e.some(function (e) { return e.nt.indexOf(norm(p)) >= 0; }); });
      sugg.innerHTML = '<p class="ls-label">Häufig gesucht</p><div class="ls-sugg">' + pop.map(function (p) { return '<button type="button" class="ls-chip" data-fill="' + esc(p) + '">' + esc(p) + '</button>'; }).join('') + '</div>';
      list.innerHTML = ''; msg.hidden = false;
      msg.textContent = 'Durchsucht ' + data.e.length + ' Kapitel, Abschnitte, Übungen und Fachbegriffe aus ' + data.apps.length + ' Lern-Apps.';
      input.setAttribute('aria-expanded', 'false'); live.textContent = '';
      return;
    }
    var sg = suggestions(q);
    sugg.innerHTML = sg.length ? '<p class="ls-label">Vorschläge</p><div class="ls-sugg">' + sg.map(function (s) { return '<button type="button" class="ls-chip" data-fill="' + esc(s) + '">' + mark(s, q) + '</button>'; }).join('') + '</div>' : '';
    results = search(q);
    if (!results.length) {
      list.innerHTML = '';
      var dm = didYouMean(q);
      msg.hidden = false;
      msg.innerHTML = 'Keine Treffer für „' + esc(q) + '“.' + (dm ? ' Meinten Sie <button type="button" data-fill="' + esc(dm) + '">' + esc(dm) + '</button>?' : ' Versuchen Sie einen kürzeren oder allgemeineren Begriff.') + (scope !== 'all' ? ' <button type="button" data-scope="all">In allen Lern-Apps suchen</button>' : '');
      input.setAttribute('aria-expanded', 'false'); live.textContent = 'Keine Treffer';
      return;
    }
    msg.hidden = true;
    list.innerHTML = '<li class="ls-label" role="presentation">' + results.length + (results.length === 40 ? '+' : '') + ' Treffer</li>' + results.map(function (e, i) {
      var app = data.apps[e.a];
      return '<li class="ls-opt" role="option" id="ls-o' + i + '" data-i="' + i + '" aria-selected="false">' +
        '<div class="m"><span class="app"><b>' + app.m + '</b>' + esc(app.n) + '</span>' + (e.p !== e.t ? '<span>' + esc(e.p) + '</span>' : '') + '<span class="k">' + esc(e.k) + '</span></div>' +
        '<div class="t">' + mark(e.t, q) + '</div>' + (e.x ? '<div class="x">' + snippet(e, q) + '</div>' : '') + '</li>';
    }).join('');
    input.setAttribute('aria-expanded', 'true');
    live.textContent = results.length + ' Treffer';
    setActive(0, false);
  }

  function setActive(i, scroll) {
    var opts = list.querySelectorAll('.ls-opt');
    if (!opts.length) return;
    active = (i + opts.length) % opts.length;
    for (var k = 0; k < opts.length; k++) opts[k].setAttribute('aria-selected', String(k === active));
    input.setAttribute('aria-activedescendant', 'ls-o' + active);
    if (scroll !== false) opts[active].scrollIntoView({ block: 'nearest' });
  }

  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[active]) go(results[active]); else if (results[0]) go(results[0]); }
    else if (e.key === 'Escape') { e.preventDefault(); if (input.value) { input.value = ''; render(); } else close(); }
  }
  function trap(e) {
    if (e.key === 'Escape' && e.target !== input) { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = [].slice.call(ov.querySelectorAll('input,button:not([hidden])')).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }

  function go(e) {
    var url = BASE + e.u;
    try { sessionStorage.setItem(JUMP_KEY, JSON.stringify({ u: url, j: e.j || '', t: Date.now() })); } catch (err) { /* privat */ }
    if (window.LernTrack) window.LernTrack.event('suche/' + norm(input.value).slice(0, 40), 'Suche');
    close();
    var here = location.href.split('#')[0].split('?')[0], target = url.split('#')[0];
    if (here === target || here === target + 'index.html' || here + 'index.html' === target) {
      var h = url.indexOf('#') >= 0 ? url.slice(url.indexOf('#')) : '';
      if (h && location.hash !== h) location.hash = h; else jump();
    } else location.href = url;
  }

  /* ---------- Nach dem Sprung: Abschnitt anzeigen und markieren ---------- */
  function jump() {
    var raw; try { raw = sessionStorage.getItem(JUMP_KEY); } catch (err) { return; }
    if (!raw) return;
    var J = JSON.parse(raw);
    if (Date.now() - J.t > 20000) { sessionStorage.removeItem(JUMP_KEY); return; }
    var wPath = J.u.split('#')[0].split('?')[0].replace(/index\.html$/, ''), wHash = J.u.indexOf('#') >= 0 ? J.u.slice(J.u.indexOf('#')) : '';
    var nPath = (location.origin + location.pathname).replace(/index\.html$/, '');
    if (nPath !== wPath || (wHash && location.hash !== wHash)) return;
    sessionStorage.removeItem(JUMP_KEY);
    if (!J.j) return;
    var target = norm(J.j).replace(/\s+/g, ' ').trim(), tries = 0;
    (function look() {
      var hs = document.querySelectorAll('h1,h2,h3,h4');
      for (var i = 0; i < hs.length; i++) {
        var h = hs[i];
        if (h.offsetParent === null) continue;
        if (norm(h.textContent).replace(/\s+/g, ' ').trim().replace(/[ :]+$/, '') === target) {
          h.classList.add('ls-flash'); h.setAttribute('tabindex', '-1');
          h.scrollIntoView({ block: 'center' }); h.focus({ preventScroll: true });
          setTimeout(function () { h.classList.remove('ls-flash'); }, 2600);
          return;
        }
      }
      if (++tries < 25) setTimeout(look, 150);
    })();
  }

  function init() { build(); setTimeout(jump, 120); window.addEventListener('hashchange', function () { setTimeout(jump, 120); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.LernSearch = { open: function (q) { open(document.activeElement, q || ''); } };
})();
