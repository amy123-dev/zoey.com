import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validLoop,clampTime,formatTime} from '../lib/loop-region.ts';
import {seasonTwoTitles} from '../lib/season2-titles.ts';
const tracks=JSON.parse(fs.readFileSync('lib/season2-audio.json','utf8'));
assert.equal(tracks.length,27);assert.equal(new Set(tracks.map(t=>t.id)).size,27);
for(let lesson=1;lesson<=22;lesson++){assert(tracks.some(t=>t.lesson===lesson));assert(seasonTwoTitles[lesson]);}
for(const [lesson,parts] of [[5,['A','B']],[9,['A','B','C','D']],[12,['A','B']]])assert.deepEqual(tracks.filter(t=>t.lesson===lesson).map(t=>t.part),parts);
for(const track of tracks){const file='public'+track.src;assert(fs.existsSync(file));assert.equal(fs.statSync(file).size,track.bytes);assert(track.duration>10);assert(track.bytes<25*1024*1024);const header=fs.readFileSync(file).subarray(0,100);assert(header.includes(Buffer.from('ftyp'))||header.includes(Buffer.from('ID3'))||header[0]===255);}
assert.equal(validLoop(null,10),false);assert.equal(validLoop(10,9),false);assert.equal(validLoop(10,10.2),false);assert.equal(validLoop(0,2),true);assert.equal(validLoop(1,Infinity),false);
assert.equal(clampTime(-5,50),0);assert.equal(clampTime(70,50),50);assert.equal(formatTime(97.43),'1:37');
for(const photo of ['parchment','blue','dark'])assert(fs.statSync('public/themes/'+photo+'.jpg').size>10000);
const css=fs.readFileSync('app/reading.css','utf8');
const lumi=hex=>{let x=hex.slice(1);if(x.length===3)x=x.split('').map(c=>c+c).join('');const v=x.match(/../g).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
const base={};
for(const [i,m] of [...css.matchAll(/:root(?:\[data-reading-theme=[a-z]+\])?\{([^}]+)\}/g)].entries()){
 const tokens=Object.fromEntries([...m[1].matchAll(/(--[a-z-]+):([^;}]+)/g)].map(v=>[v[1],v[2]]));if(i===0)Object.assign(base,tokens);const v={...base,...tokens};
 for(const [a,b] of [['--ink','--paper'],['--muted','--paper'],['--reading-mark','--reading-mark-bg'],['--on-accent','--accent']]){const x=lumi(v[a]),y=lumi(v[b]);assert((Math.max(x,y)+.05)/(Math.min(x,y)+.05)>=4.5,`${m[0].slice(0,45)} ${a} contrast`);}
}
console.log('PASS: 27 valid audio assets for all 22 lessons, multipart order, loop boundaries, bilingual titles, photo assets and theme text/button contrast');
