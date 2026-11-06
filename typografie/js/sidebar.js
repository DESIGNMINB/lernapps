// Dunkelmodus: gemeinsam für alle Lern-Apps in ../theme.js

// Shared sidebar component for all pages
function renderSidebar(activePage) {
  // Besuchte Lektionen für den Fortschritt auf der Startseite merken
  try {
    const v = new Set(JSON.parse(localStorage.getItem('typolab-visited') || '[]'));
    if (activePage && activePage !== 'intro') { v.add(activePage); localStorage.setItem('typolab-visited', JSON.stringify([...v])); }
  } catch (e) {}
  const nav = [
    { id: 'intro', label: 'Übersicht', href: 'index.html', icon: 'grid' },
    { id: 'einf', label: 'Einleitung', href: 'einfuehrung.html', icon: 'book-open' },
    { type: 'section', label: 'Laborübungen' },
    { id: 'ex1', label: '01. Zeilenabstand', href: 'exercise-01.html', icon: 'align-left' },
    { id: 'ex2', label: '02. Zeilenlänge', href: 'exercise-02.html', icon: 'columns' },
    { id: 'ex3', label: '03. Laufweite', href: 'exercise-03.html', icon: 'type' },
    { id: 'ex4', label: '04. Abstände', href: 'exercise-04.html', icon: 'maximize' },
    { id: 'ex6', label: '05. Visuelle Hierarchie', href: 'exercise-06.html', icon: 'text' },
    { id: 'ex7', label: '06. Schriftpaarungen', href: 'exercise-07.html', icon: 'type-pair' },
    { id: 'ex8', label: '07. Farbwirkung', href: 'exercise-08.html', icon: 'palette' },
    { id: 'ex9', label: '08. Barrierefreiheit', href: 'exercise-09.html', icon: 'accessibility' },
    { type: 'section', label: 'Referenz' },
    { id: 'glossar', label: 'Glossar', href: 'glossary.html', icon: 'list' },
    { id: 'din', label: 'DIN 16518', href: 'din16518.html', icon: 'table' },
    { id: 'rechtschreibung', label: 'Rechtschreibung', href: 'rechtschreibung.html', icon: 'spell' },
    { id: 'wiss', label: 'Wiss. Schreiben', href: 'wissenschaftliches-schreiben.html', icon: 'pen' },
    { id: 'design', label: 'Design System', href: 'design-system.html', icon: 'star' },
    { type: 'section', label: 'Wissenstest' },
    { id: 'quiz', label: 'Typografie-Quiz', href: 'quiz.html', icon: 'quiz' },
  ];

  const icons = {
    'book-open': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
    'align-left': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h7"/></svg>',
    'columns': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/></svg>',
    'type': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h16"/></svg>',
    'maximize': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 20l7-7m0 0l3-3m-3 3l-3-3m3 3l7-7"/></svg>',
    'grid': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    'text': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>',
    'type-pair': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M8 14v4m8-4v4M5 18h6m2 0h6"/></svg>',
    'palette': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>',
    'accessibility': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><path d="M12 6v6m-4 8l4-8 4 8M6 12h12"/></svg>',
    'list': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
    'table': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>',
    'spell': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 3l-2 8h4l-2 8"/><path d="M5 12h14"/></svg>',
    'pen': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 19l-7-7 1.4-1.4L12 16.2l5.6-5.6L19 12l-7 7z"/><path d="M12 13l-7-7 1.4-1.4L12 10.2l5.6-5.6L19 6l-7 7z"/></svg>',
    'star': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8L8 14l-6-4.8h7.6L12 2z"/></svg>',
    'quiz': '<svg class="icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 17h.01"/></svg>',
  };

  const sunIcon = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>`;

  const moonIcon = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>`;

  // Determine base path
  const base = window.sidebarBasePath || '';

  let html = `
    <div class="sidebar-top-gradient"></div>
    <a href="${base}../" class="home-back" aria-label="Zurück zur Übersicht aller Lern-Apps"><svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg><span class="home-back-logo">L</span><span class="home-back-text">Lern-Apps<small>Alle Module</small></span></a>
    <a href="${base}index.html" class="sidebar-header" style="text-decoration:none">
      <div class="sidebar-logo">T</div>
      <div class="sidebar-brand">
        <span class="sidebar-brand-name">TypoLab</span>
        <span class="sidebar-brand-subtitle">01 · Typografie</span>
      </div>
    </a>
    <div class="sidebar-nav">`;

  nav.forEach(item => {
    if (item.type === 'section') {
      html += `<div class="nav-section-label">${item.label}</div>`;
    } else {
      const isActive = item.id === activePage ? ' active' : '';
      const icon = icons[item.icon] || '';
      const current = isActive ? ' aria-current="page"' : '';
      html += `<a href="${base}${item.href}" class="nav-item${isActive}"${current}>
        <span class="nav-icon" aria-hidden="true">${icon}</span>${item.label}</a>`;
    }
  });

  html += `</div>
    <div class="sidebar-footer">
      <button type="button" class="dark-toggle" id="dark-toggle-btn" data-theme-toggle aria-pressed="false">
        ${sunIcon}
        <span class="dark-toggle-label">Dunkelmodus</span>
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        ${moonIcon}
      </button>
      <a class="feedback-link" href="#" data-feedback><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg><span>Feedback senden<small>Fehler oder Verbesserungsvorschläge</small></span></a>
    </div>`;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.innerHTML = html;
    sidebar.setAttribute('aria-label', 'Kapitelnavigation');
    initMobileNav(sidebar);
  }
  renderPager(nav, activePage, base);
}

// Zurück/Weiter am Ende jeder Seite, in der Reihenfolge der Navigation
function renderPager(nav, activePage, base) {
  const card = document.querySelector('.main .content-card');
  if (!card || card.querySelector('.pager')) return;
  const pages = nav.filter((n) => n.href);
  const i = pages.findIndex((n) => n.id === activePage);
  if (i < 0) return;
  const prev = pages[i - 1], next = pages[i + 1];
  const name = (n) => n.label.replace(/^\d+\.\s*/, '');
  const nav_ = document.createElement('nav');
  nav_.className = 'pager';
  nav_.setAttribute('aria-label', 'Lektionen blättern');
  nav_.innerHTML =
    (prev ? `<a class="pager-prev" href="${base}${prev.href}" rel="prev"><small><span aria-hidden="true">←</span> Zurück</small><b>${name(prev)}</b></a>` : '<span></span>') +
    (next ? `<a class="pager-next" href="${base}${next.href}" rel="next"><small>${/^ex/.test(next.id) ? 'Nächste Lektion' : 'Weiter'} <span aria-hidden="true">→</span></small><b>${name(next)}</b></a>` : '');
  card.appendChild(nav_);
}

// Mobile Navigation: Menü-Button statt ausgeblendeter Sidebar (WCAG 1.4.10, 2.4.5)
function initMobileNav(sidebar) {
  if (document.querySelector('.mobile-topbar')) return;
  const bar = document.createElement('header');
  bar.className = 'mobile-topbar';
  bar.innerHTML = `
    <button type="button" class="menu-btn" aria-expanded="false" aria-controls="sidebar">
      <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      <span class="sr-only">Menü öffnen</span>
    </button>
    <span class="topbar-title">TypoLab</span>`;
  document.body.insertBefore(bar, document.body.firstChild);
  const btn = bar.querySelector('.menu-btn');
  const label = btn.querySelector('.sr-only');
  const setOpen = (open, returnFocus) => {
    document.body.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Menü schließen' : 'Menü öffnen';
    if (open) {
      const first = sidebar.querySelector('[aria-current="page"]') || sidebar.querySelector('a');
      if (first) first.focus();
    } else if (returnFocus) {
      btn.focus();
    }
  };
  btn.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open'), false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) setOpen(false, true);
  });
  document.addEventListener('click', (e) => {
    if (document.body.classList.contains('nav-open') && !sidebar.contains(e.target) && !bar.contains(e.target)) setOpen(false, false);
  });
  window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => { if (e.matches) setOpen(false, false); });
}

// Dark mode toggle logic
function initDarkMode() {
  const btn = document.getElementById('dark-toggle-btn');
  if (!btn) return;
  if (window.LernTheme) window.LernTheme.sync();
}

// Tab functionality
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tabs-container') || document;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      group.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

// Filter tags
function initFilters() {
  document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.filter-tag').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
      tag.classList.add('active');
      tag.setAttribute('aria-pressed', 'true');
      const filter = tag.dataset.filter;
      document.querySelectorAll('.filterable').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
      // Update count
      const countEl = document.getElementById('filter-count');
      if (countEl) {
        const visible = document.querySelectorAll('.filterable:not([style*="display: none"])').length;
        countEl.textContent = visible;
      }
    });
  });
}

// Dynamische Rückmeldungen für Screenreader ansagen (WCAG 4.1.3)
function initLiveRegions() {
  document.querySelectorAll('.feedback-box, #ch-badge, #feedback-text, #contrastRatio, [id^="ratio-"]').forEach(el => {
    if (!el.hasAttribute('role')) el.setAttribute('role', 'status');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLiveRegions();
  initDarkMode();
  initTabs();
  initFilters();
});
