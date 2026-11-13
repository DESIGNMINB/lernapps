document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  
  if (modulesData.length > 0) {
    loadModule(modulesData[0].id);
  }
  
  // Theme Toggle
  document.getElementById('btnThemeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    // Refresh Canvas stroke color if simulator is open
    const canvas = document.getElementById('controlNetInput');
    if (canvas && ControlNetSimulator.ctx) {
      ControlNetSimulator.ctx.strokeStyle = html.getAttribute('data-theme') === 'light' ? '#0f172a' : '#e5e7eb';
    }
  });
  
  document.getElementById('btnResetProgress').addEventListener('click', () => {
    showToast('Labor-Fortschritt zurückgesetzt');
  });
});

function renderSidebar() {
  const sidebar = document.getElementById('sidebarNavList');
  sidebar.innerHTML = '';
  
  modulesData.forEach((mod, index) => {
    const li = document.createElement('li');
    li.textContent = mod.title;
    li.dataset.id = mod.id;
    if(index === 0) li.classList.add('active');
    
    li.addEventListener('click', () => {
      document.querySelectorAll('.nav-module-list li').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      loadModule(mod.id);
      
      // Close mobile menu after click
      const appSidebar = document.getElementById('appSidebar');
      if (window.innerWidth <= 850) {
        appSidebar.classList.remove('open');
      }
    });
    sidebar.appendChild(li);
  });
}

function loadModule(moduleId) {
  const module = modulesData.find(m => m.id === moduleId);
  if (!module) return;
  
  const mainContent = document.getElementById('appMainContent');
  const headerHtml = `
    <div class="module-header" style="margin-bottom: 2rem;">
      <h1 style="font-family: 'IBM Plex Sans', sans-serif; font-size: 1.8rem; margin-bottom: 0.5rem;">${module.title}</h1>
      <p style="color: var(--text-muted); max-width: 800px;">${module.description}</p>
    </div>
  `;
  
  if (module.hasSimulator && module.simulatorType === 'controlNet') {
    mainContent.innerHTML = headerHtml + `<div id="simulatorContainer"></div>`;
    ControlNetSimulator.init('simulatorContainer');
  } else {
    mainContent.innerHTML = headerHtml + `<div class="module-body">${module.contentHTML}</div>`;
  }
  
  showToast(module.title + ' geladen');
}

function showToast(message) {
  const toast = document.getElementById('appToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}