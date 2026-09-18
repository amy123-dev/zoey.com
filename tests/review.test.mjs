import assert from 'node:assert/strict';
import {schedule,shuffle} from '../lib/review.ts';
import fs from 'node:fs';
const c=JSON.parse(fs.readFileSync('lib/course.json','utf8'));
const items=[...c.cards,...c.questions];
assert.equal(new Set(items.map(x=>x.id)).size,items.length);
assert.equal(c.lessons.length,20);
for(const l of c.lessons)assert(c.cards.some(x=>x.lesson===l.id));
for(const q of c.questions){assert(q.choices.includes(q.en));assert.equal(q.choices.length,new Set(q.choices).size);}
let p;
const now=100000000;
for(const day of [1,3,7,14,30,30]){p=schedule(p,'test',2,now);assert.equal(p.due-now,day*86400000);}
p=schedule(p,'test',0,now);assert.equal(p.level,0);assert.equal(p.wrong,1);assert.equal(p.due-now,600000);
p=schedule(p,'test',1,now);assert.equal(p.wrong,1);assert.equal(p.due-now,86400000);
p=schedule(p,'test',2,now);assert.equal(p.wrong,0);assert.equal(p.attempts,9);
assert.deepEqual(shuffle([1,2,3,4]).sort(),[1,2,3,4]);
console.log('PASS: content IDs, all 20 lessons, rule choices, review ladder, retry interval, wrong-item lifecycle, shuffle integrity');
