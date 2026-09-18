import assert from 'node:assert/strict';
import fs from 'node:fs';
import {organizeLesson} from '../lib/season2-structure.ts';
import {analyzeSpeech} from '../lib/real-speak.ts';
const lessons=JSON.parse(fs.readFileSync('lib/season2.json','utf8'));
let count=0;
for(const lesson of lessons){
 const layout=organizeLesson(lesson);
 const reachable=new Set([...layout.segments.flatMap(s=>s.blocks),...layout.groups.flatMap(g=>g.blocks)].map(b=>b.id));
 for(const b of lesson.blocks.filter(b=>/[\p{L}\p{N}]/u.test(b.text)))assert(reachable.has(b.id),`lost source ${b.id}`);
 assert(layout.groups.length>0);
 layout.groups.forEach((g,i)=>{assert.equal(g.number,i+1);assert(g.title.length>0);});
 count+=layout.groups.length;
 if(lesson.id>=13)assert(layout.segments[0].blocks.length<30,'dialogue separated from definitions');
}
assert(organizeLesson(lessons[13]).groups.some(g=>g.title==='slash prices'));
assert(organizeLesson(lessons[15]).groups.some(g=>g.title==='grab a cab'));
assert(organizeLesson(lessons[21]).groups.some(g=>g.title==='turn someone down'));
const speech=analyzeSpeech('Would you get a grip? This is going to be a blast!');
assert(speech.changes.some(c=>c.before==='get a'&&c.ipa.includes('ɾ')));
assert.deepEqual(speech.changes.map(c=>c.position),speech.changes.map(c=>c.position).sort((a,b)=>a-b));
assert(!analyzeSpeech('walked in').spoken.includes('ɾ'));
function luminance(hex){const v=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;}
for(const [fg,bg] of [['692443','fff0f6'],['76233a','ffe9ed'],['842049','fff0f6'],['ffbed9','47263a'],['f0eee8','202420'],['c4c7bf','202420']]){const a=luminance(fg),b=luminance(bg);assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,`${fg} on ${bg}`);}
console.log(`PASS: all meaningful source blocks reachable; ${count} consecutively numbered groups across 22 lessons; contextual speech order; four-theme highlight contrast`);
