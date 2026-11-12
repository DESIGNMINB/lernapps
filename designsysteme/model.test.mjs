import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,cleanDraft,contrast,palette,tokens,css,checks,guideHTML,markdown} from './model.js';

test('Kontrast ist symmetrisch; Schwarz/Weiß erreicht 21:1, gleiche Farben 1:1',()=>{
 assert.equal(contrast('#000000','#ffffff'),21);
 assert.equal(contrast('#64378c','#64378c'),1);
 assert.equal(contrast('#64378c','#ffffff'),contrast('#ffffff','#64378c'));
 assert.ok(contrast('#777777','#ffffff')<4.5);
 assert.ok(contrast('#767676','#ffffff')>=4.5);
});
test('Beide Standard-Themes bestehen die geprüften Text- und UI-Kontraste',()=>{
 assert.equal(checks(defaults).length,8);
 assert.ok(checks(defaults).every(c=>c.pass));
 const d=cleanDraft(defaults);d.colors.dark.onAction=d.colors.dark.brand;
 assert.equal(checks(d).find(c=>c.label==='Dark · Buttontext').pass,false);
});
test('Farbrollen folgen einer Referenz; primitive Werte und Themes bleiben unabhängig',()=>{
 const d=cleanDraft(defaults);d.actionRef='accent';d.colors.light.accent='#123456';
 assert.equal(palette(d,'light').action,'#123456');
 assert.equal(palette(d,'dark').action,defaults.colors.dark.accent);
 assert.equal(d.colors.light.brand,defaults.colors.light.brand);
 assert.equal(tokens(d,'light').color.action.$value,'{color.accent}');
});
test('DTCG-Referenzen sind vollständig, auflösbar, typgleich und kreisfrei',()=>{
 for(const mode of ['light','dark']){
  const data=tokens(defaults,mode),flat={};
  const visit=(v,path=[])=>{if(v.$value!==undefined){flat[path.join('.')]=v;return;}for(const [k,x] of Object.entries(v))if(!k.startsWith('$')&&typeof x==='object')visit(x,[...path,k]);};
  visit(data);
  const resolve=(name,seen=[])=>{assert.ok(flat[name],`Fehlende Referenz ${name}`);assert.ok(!seen.includes(name));const t=flat[name];if(typeof t.$value==='string'&&t.$value.startsWith('{')){const target=t.$value.slice(1,-1);assert.equal(flat[target].$type,t.$type);return resolve(target,[...seen,name]);}return t.$value;};
  for(const name of Object.keys(flat))resolve(name);
  for(const t of Object.values(flat))if(t.$type==='color'&&typeof t.$value==='object'){assert.equal(t.$value.colorSpace,'srgb');assert.equal(t.$value.components.length,3);assert.ok(t.$value.components.every(v=>v>=0&&v<=1));}
  assert.deepEqual(resolve('button.radius'),{value:10,unit:'px'});
 }
});
test('Import begrenzt fremde Daten auf gültige Felder, Farben, Grenzen und Auswahlwerte',()=>{
 const d=cleanDraft({name:'Projekt',base:999,spacing:-10,radius:NaN,font:'url(https://example.org)',mode:'evil',actionRef:'__proto__',colors:{light:{brand:'red;background:url(x)',text:'#123abc'}},checked:[0,5,6,-1,'x'],unknown:true});
 assert.equal(d.base,22);assert.equal(d.spacing,8);assert.equal(d.radius,10);assert.equal(d.font,'sans');assert.equal(d.mode,'light');assert.equal(d.actionRef,'brand');assert.equal(d.colors.light.brand,defaults.colors.light.brand);assert.equal(d.colors.light.text,'#123abc');assert.deepEqual(d.checked,[0,5]);assert.equal(d.unknown,undefined);
 assert.deepEqual(cleanDraft(null),defaults);
});
test('HTML-Export behandelt eingegebene HTML-/Skriptzeichen als Text',()=>{
 const d=cleanDraft({name:'<script>alert(1)</script>',principles:'</pre><img src=x onerror=alert(1)>'});
 const html=guideHTML(d);assert.ok(!html.includes('<script>'));assert.ok(!html.includes('<img src=x'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(html.includes('&lt;/pre&gt;'));
});
test('CSS enthält getrennte Themes, zugängliche Zustände und die gewählten Foundations',()=>{
 const d=cleanDraft({radius:18,spacing:24,base:20,actionRef:'accent'}),out=css(d);
 assert.match(out,/--radius-medium: 18px/);assert.match(out,/--space-base: 24px/);assert.match(out,/--font-size-body: 20px/);
 assert.match(out,/data-ds-theme="dark"/);assert.match(out,/--color-action: var\(--color-accent\)/);assert.match(out,/:focus-visible/);assert.match(out,/aria-invalid="true"/);assert.match(out,/forced-colors/);
 assert.match(markdown(d),/Automatischer Farbcheck/);assert.match(markdown(d),/Manuelle Prüfung/);
});
