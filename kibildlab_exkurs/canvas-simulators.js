const ControlNetSimulator = {
  isDrawing: false,
  ctx: null,

  init: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="simulator-wrapper" style="display: flex; gap: 2rem; flex-wrap: wrap;">
        <!-- Input Canvas -->
        <div class="panel input-panel" style="flex: 1; min-width: 300px;">
          <h3 style="font-family: 'IBM Plex Sans', sans-serif; margin-bottom: 1rem;">1. Input (Scribble/Wireframe)</h3>
          <canvas id="controlNetInput" width="400" height="400" 
                  style="border: 2px dashed var(--border-color); background: var(--bg-panel); border-radius: 8px; cursor: crosshair; width: 100%;">
          </canvas>
          <button id="btnClearCanvas" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-main); border-radius: 4px; cursor: pointer; font-family: var(--font-main);">
            Skizze löschen
          </button>
        </div>

        <!-- Controls -->
        <div class="panel control-panel" style="flex: 1; min-width: 250px; background: var(--bg-panel); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border-color);">
          <h3 style="font-family: 'IBM Plex Sans', sans-serif; margin-bottom: 1rem;">2. Parameter (Mischpult)</h3>
          
          <div style="margin-bottom: 1.5rem;">
            <label for="controlType" style="display: block; margin-bottom: 0.5rem; font-family: var(--font-mono); font-size: 0.9rem;">ControlNet Typ</label>
            <select id="controlType" style="width: 100%; padding: 0.5rem; background: var(--bg-surface); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 4px; font-family: var(--font-main);">
              <option value="scribble">Scribble (Handskizze)</option>
              <option value="canny">Canny (Harte Kanten)</option>
              <option value="depth">Depth (Tiefenkarte)</option>
            </select>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label for="controlWeight" style="display: block; margin-bottom: 0.5rem; font-family: var(--font-mono); font-size: 0.9rem;">
              Control Weight: <span id="weightVal">0.7</span>
            </label>
            <input type="range" id="controlWeight" min="0" max="1" step="0.1" value="0.7" style="width: 100%;">
            <small style="display: block; margin-top: 0.5rem; color: var(--text-muted);">0.0 = Kreative Freiheit | 1.0 = Strikte Raster-Kontrolle</small>
          </div>

          <button id="btnSimulate" style="width: 100%; padding: 0.75rem; background: var(--accent-color); color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; font-family: var(--font-main);">
            Generieren (Simulation)
          </button>
        </div>

        <!-- Output -->
        <div class="panel output-panel" style="flex: 1; min-width: 300px;">
          <h3 style="font-family: 'IBM Plex Sans', sans-serif; margin-bottom: 1rem;">3. KI Output</h3>
          <div id="simulationOutput" style="width: 100%; aspect-ratio: 1/1; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
            <span style="color: var(--text-muted); font-family: var(--font-mono);">Warte auf Input...</span>
          </div>
        </div>
      </div>
    `;

    this.setupCanvasInteractions();
    this.setupControls();
  },

  setupCanvasInteractions: function() {
    const canvas = document.getElementById('controlNetInput');
    this.ctx = canvas.getContext('2d');
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = 'round';
    
    // Check theme for stroke color
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    this.ctx.strokeStyle = isLight ? '#0f172a' : '#e5e7eb'; 

    canvas.addEventListener('mousedown', (e) => {
      this.isDrawing = true;
      this.ctx.beginPath();
      this.ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!this.isDrawing) return;
      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => { this.isDrawing = false; });
    canvas.addEventListener('mouseout', () => { this.isDrawing = false; });

    document.getElementById('btnClearCanvas').addEventListener('click', () => {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      document.getElementById('simulationOutput').innerHTML = `<span style="color: var(--text-muted); font-family: var(--font-mono);">Warte auf Input...</span>`;
    });
  },

  setupControls: function() {
    const weightSlider = document.getElementById('controlWeight');
    const weightLabel = document.getElementById('weightVal');
    const btnSimulate = document.getElementById('btnSimulate');
    const outputArea = document.getElementById('simulationOutput');

    weightSlider.addEventListener('input', (e) => { weightLabel.textContent = e.target.value; });

    btnSimulate.addEventListener('click', () => {
      const weight = parseFloat(weightSlider.value);
      const type = document.getElementById('controlType').value;
      
      outputArea.innerHTML = `<span style="color: var(--accent-color); font-family: var(--font-mono);">Generiere...</span>`;
      
      setTimeout(() => {
        let feedbackText = "";
        let bgColor = "";

        if (weight < 0.3) {
          feedbackText = "Zufällige Komposition<br>(Skizze fast ignoriert)";
          bgColor = "#7f1d1d";
        } else if (weight >= 0.3 && weight <= 0.7) {
          feedbackText = "Ideale Balance<br>(Struktur erkannt, Details kreativ)";
          bgColor = "#14532d";
        } else {
          feedbackText = "Übersteuert (Burn-in)<br>(Bild wirkt unnatürlich steif)";
          bgColor = "#78350f";
        }

        outputArea.innerHTML = `
          <div style="width: 100%; height: 100%; background: ${bgColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 1rem; color: #fff;">
            <div style="font-family: var(--font-mono); margin-bottom: 1rem;">
              Model: ${type.toUpperCase()}<br>Weight: ${weight}
            </div>
            <div style="font-family: var(--font-main);">
              ${feedbackText}
            </div>
          </div>
        `;
      }, 800);
    });
  }
};