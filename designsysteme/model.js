export const fonts = { sans: '"IBM Plex Sans", sans-serif', serif: '"Source Serif 4", Georgia, serif', mono: '"IBM Plex Mono", monospace' };
export const defaults = {
  name: 'CampusPlan', principles: 'Klar: Jede Aktion ist eindeutig beschriftet.\nVerlässlich: Zeiten vor der Buchung wiederholen.\nZugänglich: Alle Aufgaben funktionieren per Tastatur.',
  font: 'sans', base: 16, spacing: 16, radius: 10, mode: 'light', actionRef: 'brand',
  colors: {
    light: { brand: '#64378c', accent: '#006d77', surface: '#ffffff', text: '#1f2937', onAction: '#ffffff' },
    dark: { brand: '#c8a8de', accent: '#70d6d0', surface: '#1a1d27', text: '#f3f4f6', onAction: '#1a1d27' }
  },
  variant: 'primary', size: 'medium', state: 'default', width: 'wide',
  use: 'Primary für die wichtigste Aktion in einem Bereich. Secondary für ergänzende Aktionen. Navigation als Link umsetzen.',
  avoid: 'Keine neuen Hexwerte in einzelnen Komponenten. Fehler nicht ausschließlich durch Farbe darstellen.',
  voice: 'Direkt, freundlich und konkret. Fehler nennen zuerst das Problem und danach einen nächsten Schritt.',
  owner: 'Projektteam CampusPlan', change: '0.1 – Erster Entwurf; Farben, Komponenten und Zustände im Beispielscreen prüfen.',
  checked: []
};
export const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const hexOK = value => /^#[0-9a-f]{6}$/i.test(value);
// Only explicitly supported fields enter CSS/HTML exports or the persistent draft.
export function cleanDraft(value = {}) {
  const d = structuredClone(defaults);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return d;
  for (const key of ['name','principles','use','avoid','voice','owner','change']) if (typeof value[key] === 'string') d[key] = value[key].slice(0, key === 'name' ? 60 : 4000);
  for (const [key,min,max] of [['base',14,22],['spacing',8,32],['radius',0,24]]) if (Number.isFinite(value[key])) d[key] = Math.max(min, Math.min(max, Math.round(value[key])));
  for (const [key,values] of Object.entries({font:Object.keys(fonts),mode:['light','dark'],actionRef:['brand','accent'],variant:['primary','secondary'],size:['small','medium','large'],state:['default','hover','focus','active','disabled','error'],width:['wide','narrow']})) if (values.includes(value[key])) d[key]=value[key];
  for (const mode of ['light','dark']) for (const key of Object.keys(d.colors[mode])) if (hexOK(value.colors?.[mode]?.[key])) d.colors[mode][key]=value.colors[mode][key].toLowerCase();
  d.checked = Array.isArray(value.checked) ? value.checked.filter(x => Number.isInteger(x) && x>=0 && x<6) : [];
  return d;
}
export function luminance(hex) {
  const v = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255).map(n => n<=.04045 ? n/12.92 : ((n+.055)/1.055)**2.4);
  return .2126*v[0]+.7152*v[1]+.0722*v[2];
}
export function contrast(a,b) { const x=luminance(a),y=luminance(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); }
export function palette(d,mode=d.mode) { const c=d.colors[mode]; return {...c,action:c[d.actionRef],error:mode==='light'?'#b42318':'#ffb4ab'}; }
export function checks(d) {
  return ['light','dark'].flatMap(mode=>{
    const c=palette(d,mode);
    return [[`${mode==='light'?'Light':'Dark'} · Fließtext`,c.text,c.surface,4.5], [`${mode==='light'?'Light':'Dark'} · Buttontext`,c.onAction,c.action,4.5], [`${mode==='light'?'Light':'Dark'} · Aktionsfarbe auf Fläche`,c.action,c.surface,3], [`${mode==='light'?'Light':'Dark'} · Secondary-Buttontext`,c.action,c.surface,4.5]].map(([label,a,b,min])=>({label,ratio:contrast(a,b),min,pass:contrast(a,b)>=min}));
  });
}
export function tokens(d,mode) {
  const c=d.colors[mode];
  const color = hex => ({$type:'color',$value:{colorSpace:'srgb',components:[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255),alpha:1}});
  const dim = n => ({$type:'dimension',$value:{value:n,unit:'px'}});
  return {$description:`${d.name} · ${mode} · Lernentwurf`,color:{brand:color(c.brand),accent:color(c.accent),surface:color(c.surface),text:color(c.text),onAction:color(c.onAction),action:{$type:'color',$value:`{color.${d.actionRef}}`}},space:{base:dim(d.spacing)},radius:{medium:dim(d.radius)},font:{body:{$type:'fontFamily',$value: d.font==='sans'?['IBM Plex Sans','sans-serif']:d.font==='serif'?['Source Serif 4','Georgia','serif']:['IBM Plex Mono','monospace']},size:dim(d.base)},button:{background:{$type:'color',$value:'{color.action}'},foreground:{$type:'color',$value:'{color.onAction}'},radius:{$type:'dimension',$value:'{radius.medium}'}}};
}
export function css(d) {
  const modeBlock = mode => {const c=d.colors[mode];return `  --color-brand: ${c.brand};\n  --color-accent: ${c.accent};\n  --color-surface: ${c.surface};\n  --color-text: ${c.text};\n  --color-on-action: ${c.onAction};\n  --color-action: var(--color-${d.actionRef});\n  --color-error: ${mode==='light'?'#b42318':'#ffb4ab'};`;};
  // Re-declare aliases for each theme so inherited computed values cannot retain the light theme.
  const aliases = `  --button-background: var(--color-action);\n  --button-foreground: var(--color-on-action);`;
  return `/* Mini-Designsystem – Lernentwurf. Schriftdateien im Projekt selbst einbinden. */\n:root, [data-ds-theme="light"] {\n${modeBlock('light')}\n${aliases}\n  --space-base: ${d.spacing}px;\n  --radius-medium: ${d.radius}px;\n  --font-body: ${fonts[d.font]};\n  --font-size-body: ${d.base}px;\n}\n[data-ds-theme="dark"] {\n${modeBlock('dark')}\n${aliases}\n}\n.ds-app { background: var(--color-surface); color: var(--color-text); font: var(--font-size-body)/1.5 var(--font-body); padding: var(--space-base); }\n.ds-button { font: inherit; min-height: 44px; padding: 10px var(--space-base); border: 2px solid var(--color-action); border-radius: var(--radius-medium); background: var(--button-background); color: var(--button-foreground); cursor: pointer; }\n.ds-button--secondary { background: var(--color-surface); color: var(--color-action); }\n.ds-button--small { min-height: 36px; padding-block: 6px; }\n.ds-button--large { min-height: 52px; padding-block: 14px; }\n.ds-button:hover:not(:disabled) { text-decoration: underline; text-underline-offset: 3px; }\n.ds-button:active:not(:disabled) { transform: translateY(1px); }\n.ds-button:focus-visible, .ds-input:focus-visible { outline: 3px solid var(--color-action); outline-offset: 3px; }\n.ds-button:disabled { opacity: .5; cursor: not-allowed; }\n.ds-card { padding: var(--space-base); border: 1px solid var(--color-text); border-radius: var(--radius-medium); }\n.ds-input { box-sizing: border-box; width: 100%; min-height: 44px; padding: 10px; border: 1px solid var(--color-text); border-radius: var(--radius-medium); font: inherit; color: var(--color-text); background: var(--color-surface); }\n.ds-input[aria-invalid="true"] { border: 2px solid var(--color-error); }\n.ds-error { color: var(--color-error); }\n.ds-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: var(--space-base); }\n@media (prefers-reduced-motion: reduce) { .ds-button { transition: none; } }\n@media (forced-colors: active) { .ds-button { border-color: ButtonText; } .ds-button:focus-visible, .ds-input:focus-visible { outline-color: Highlight; } }\n`;
}
export function markdown(d) {
  return `# ${d.name || 'Mein Designsystem'}\n\nMini-Designsystem · Lernmodul 12\n\n## Prinzipien\n${d.principles}\n\n## Foundations\n- Schrift: ${fonts[d.font]}\n- Basisgröße: ${d.base}px; Zeilenhöhe: 1,5\n- Basisabstand: ${d.spacing}px\n- Radius: ${d.radius}px\n- Aktionsfarbe referenziert: color.${d.actionRef}\n\n${['light','dark'].map(mode=>`### ${mode}\n${Object.entries(d.colors[mode]).map(([k,v])=>`- color.${k}: ${v}`).join('\n')}`).join('\n\n')}\n\n## Komponenten\nButton: Primary und Secondary; Größen Small (36px), Medium (44px), Large (52px). Zustände Default, Hover, Focus, Active, Disabled. Input: Label, Hilfe und Fehlertext. Card: Titel, Inhalt und Aktion.\n\n## Verwendung (Do)\n${d.use}\n\n## Vermeiden (Don't)\n${d.avoid}\n\n## Sprache\n${d.voice}\n\n## Automatischer Farbcheck\n${checks(d).map(c=>`- ${c.label}: ${c.ratio.toFixed(2)}:1; Ziel ${c.min}:1 – ${c.pass?'erreicht':'nicht erreicht'}`).join('\n')}\n\nDer Farbcheck bewertet ausgewählte deckende sRGB-Farbpaare, keine vollständige WCAG-Konformität. Zustände, Fokus, Zoom, Inhalte und Tastaturbedienung separat testen.\n\n## Manuelle Prüfung\n${manualChecks.map((s,i)=>`- [${d.checked.includes(i)?'x':' '}] ${s}`).join('\n')}\n\n## Verantwortung\n${d.owner}\n\n## Änderungen\n${d.change}\n\n## Anwendung\nCSS einbinden und den Beispielscreen mit class="ds-app" und data-ds-theme="light" bzw. "dark" auszeichnen. Schriftdateien selbst einbinden. Die beiden DTCG-JSON-Dateien sind getrennte Theme-Sätze. Die Projektdatei sichert den vollständigen Builder-Entwurf.\n`;
}
export const manualChecks = ['Tastatur: Reihenfolge, Bedienung und Fokus geprüft','Schmale Ansicht, lange Inhalte und Zoom geprüft','Fehler, leere Inhalte und deaktivierte Aktionen erklärt','Beide Themes und alle relevanten Zustände geprüft','Regeln mit Do/Don’t-Beispielen dokumentiert','Verantwortliche und Änderungen festgehalten'];
export function guideHTML(d) {
 const c=palette(d,'light');
 return `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(d.name)} · Styleguide</title><style>body{max-width:900px;margin:40px auto;padding:0 24px;font:16px/1.6 system-ui;color:#1f2937}h1,h2{color:#64378c}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}button{cursor:pointer}@media print{.print-button{display:none}h2{break-after:avoid}}${css(d)}</style><button class="print-button" onclick="window.print()">Drucken / als PDF speichern</button><h1>${esc(d.name)} · Styleguide</h1><h2>Beispiel-Komponenten</h2><section class="ds-app" data-ds-theme="light"><article class="ds-card"><h3>Lernraum 204</h3><p>4 Plätze · heute 14–16 Uhr</p><button class="ds-button" type="button">Buchen (Beispiel)</button> <button class="ds-button ds-button--secondary" type="button">Details (Beispiel)</button><p><label for="purpose">Zweck der Buchung</label><input class="ds-input" id="purpose" value="Lerngruppe"></p></article></section><h2>Dokumentation</h2><pre>${esc(markdown(d))}</pre><p>Gestaltungsbeispiel ohne Buchungsfunktion. Primärfarbe: ${esc(c.action)}.</p></html>`;
}
