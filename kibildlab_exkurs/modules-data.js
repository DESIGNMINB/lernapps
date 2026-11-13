const modulesData = [
  {
    id: 'lab-1-copyspace',
    title: '1. Copy Space & Framing',
    category: 'Layout & Bildkomposition',
    description: 'Bilder gezielt für UI-Layouts generieren. Lerne, wie man der KI den nötigen Freiraum für Typografie und Interaktionselemente aufzwingt.',
    hasSimulator: false,
    contentHTML: `
      <h2 style="margin-bottom: 1rem;">Copy Space (Freiraum) für Layouts</h2>
      <p style="margin-bottom: 1rem;">Ein häufiges Problem in der UI-Gestaltung: Das generierte Bild sieht toll aus, bietet aber keinen ruhigen Hintergrund für Text. Hier lernst du Strategien, wie du durch spezifische Prompt-Techniken ("negative space", "off-center composition", "solid background on the left") gezielt Platz für dein 12-Spalten-Raster schaffst.</p>
    `
  },
  {
    id: 'lab-2-controlnet',
    title: '2. ControlNet Simulator',
    category: 'Räumliche Kontrolle',
    description: 'Vom Wireframe zum Rendering: Nutze Scribbles und Canny-Edges, um Layout-Raster präzise in generative Bildmodelle zu übertragen.',
    hasSimulator: true,
    simulatorType: 'controlNet',
    contentHTML: ''
  },
  {
    id: 'lab-3-depth-parallax',
    title: '3. Tiefenkarte (Depth) für Scrollytelling',
    category: 'Räumliche Kontrolle',
    description: 'Erstelle Assets für Parallax-Effekte. Extrahiere Tiefenkarten, um Vordergrund und Hintergrund für Web-Animationen sauber zu trennen.',
    hasSimulator: false,
    contentHTML: `
      <h2 style="margin-bottom: 1rem;">Tiefenstaffelung im Webdesign</h2>
      <p style="margin-bottom: 1rem;">Besonders bei Scrollytelling-Websites benötigen wir eine klare Trennung von Ebenen (z.B. ein Charakter im Vordergrund, der über dem Text schwebt, während der Hintergrund zurücktritt). Depth-Modelle helfen dabei, diese Ebenen für CSS-Parallax-Effekte vorzubereiten.</p>
    `
  },
  {
    id: 'lab-4-inpainting',
    title: '4. In- & Outpainting',
    category: 'Bildkorrektur & Erweiterung',
    description: 'Repariere generative Fehler (Artefakte, falsche Hände) oder erweitere den Bildrand (Outpainting), wenn das Format nicht zum Viewport passt.',
    hasSimulator: false,
    contentHTML: `
      <h2 style="margin-bottom: 1rem;">Responsive Bildformate durch Outpainting</h2>
      <p style="margin-bottom: 1rem;">Das generierte Hero-Bild ist im 16:9-Format, aber du brauchst es für Mobile in 9:16? Anstatt zu beschneiden, nutzen wir Outpainting, um den Hintergrund nahtlos weiterzurechnen, ohne das Hauptmotiv zu verzerren.</p>
    `
  }
];