import assert from 'node:assert/strict';
import fs from 'node:fs';
import {analyzeSpeech} from '../lib/real-speak.ts';
import {seasonTwoRules} from '../lib/season2-rules.ts';
const lessons=JSON.parse(fs.readFileSync('lib/season2.json','utf8'));
const learning=JSON.parse(fs.readFileSync('lib/season2-learning.json','utf8'));
assert.equal(lessons.length,22);
assert.equal(new Set(lessons.flatMap(l=>l.blocks.map(b=>b.id))).size,2147);
for(let n=1;n<=22;n++){
 const lesson=lessons.find(l=>l.id===n);assert(lesson.blocks.length>20);
 assert(lesson.blocks[0].text.startsWith(n+'.'),`lesson ${n} starts at its own heading`);
 assert(learning.real.filter(r=>r.lesson===n).length>=4);
 assert(learning.cards.some(c=>c.lesson===n));
 for(const b of lesson.blocks){assert.equal(b.runs.map(r=>r.text).join('').replace(/\s+/g,' ').trim(),b.text.replace(/\s+/g,' ').trim(),b.id);assert(!b.text.includes('\0'));}
 if(n>=13)assert(seasonTwoRules[n]?.points.length>=2);
}
assert(lessons[11].blocks.some(b=>b.text.includes('palak paneer')),'page-boundary content stays with lesson 12');
assert(!lessons[12].blocks.some(b=>b.text.includes('palak paneer')));
assert(lessons[21].blocks.some(b=>b.text.includes('turn someone down')),'last phrase retained');
assert.equal(learning.real.filter(r=>r.original).length,70,'all supplied Real Speak utterances/scenes');
assert.equal(new Set(learning.real.map(r=>r.id)).size,learning.real.length);
assert.equal(new Set(learning.cards.map(r=>r.id)).size,learning.cards.length);
for(const c of learning.cards){assert(c.id.startsWith('s2-'));assert(c.zh&&c.en);}
assert(analyzeSpeech('Did you get it?').changes.some(c=>c.ipa==='dɪdʒə'));
assert.equal(analyzeSpeech("I'm going to the store.").spoken.includes('gonna'),false);
assert(analyzeSpeech("I'm going to eat.").spoken.includes('gonna'));
assert(analyzeSpeech('What you want to do').spoken.includes('whatcha wanna'));
assert.equal(analyzeSpeech('very').changes.length,0);
assert(analyzeSpeech('pretty').changes.some(c=>c.ipa==='ˈprɪɾi'));
assert(analyzeSpeech('them all').changes.some(c=>c.lesson===17));
assert(lessons.flatMap(l=>l.blocks).filter(b=>b.marked).length>=700);
assert(!fs.existsSync('public/course-pages'));
assert(!JSON.stringify(lessons).includes('C:/Users'));
const api=fs.readFileSync('app/api/progress/route.ts','utf8');assert(api.includes('...seasonTwo.cards'));assert(api.includes('WHERE user_id=? AND card_id=?'));
console.log(`PASS: 22 complete lesson partitions, 2147 styled blocks, ${learning.real.length} speech entries, ${learning.cards.length} private-record exercises, pronunciation exceptions`);
