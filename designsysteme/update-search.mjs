import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {chapters,exercises,glossary} from './content.js';
const file=fileURLToPath(new URL('../search-index.json',import.meta.url));
const data=JSON.parse(readFileSync(file,'utf8'));
let index=data.apps.findIndex(a=>a.s==='designsysteme');
if(index<0){index=data.apps.length;data.apps.push({s:'designsysteme',n:'Designsysteme & Styleguides',m:'11'});}
data.e=data.e.filter(e=>e.a!==index);
const text=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
for(const p of [...chapters,...exercises]){
 data.e.push({a:index,p:p.title,t:p.title,u:`designsysteme/#${p.id}`,k:p.id.startsWith('ue-')?'Übung':'Kapitel',x:text(p.lead||p.sub)});
 for(const [title,body] of p.sections||[])data.e.push({a:index,p:p.title,t:title,u:`designsysteme/#${p.id}`,k:'Abschnitt',x:text(body)});
}
for(const [term,description,id] of glossary)data.e.push({a:index,p:'Stichwortverzeichnis',t:term,u:`designsysteme/#${id}`,k:'Begriff',x:description});
data.v='20261112d';
writeFileSync(file,JSON.stringify(data));
console.log(`${data.e.filter(e=>e.a===index).length} Such-Einträge für Modul 11 aktualisiert.`);
