import assert from 'node:assert/strict';
import {reviewDays} from '../lib/review-chart.ts';
const now=new Date(2026,8,16,12),at=(day,h=12)=>new Date(2026,8,day,h).getTime();
const rows=reviewDays([{id:'a',at:at(16),grade:2},{id:'a',at:at(16),grade:2},{id:'b',at:at(16,0),grade:0},{id:'c',at:at(10),grade:2},{id:'old',at:at(9),grade:2},{id:'future',at:at(17),grade:2}],7,now);
assert.equal(rows.length,7);assert.equal(rows[0].date,'2026-09-10');assert.equal(rows[6].date,'2026-09-16');assert.equal(rows[6].total,2);assert.equal(rows[6].correct,1);assert.equal(rows[0].total,1);assert.equal(rows[1].total,0);
assert.equal(reviewDays([],30,now).length,30);assert.equal(reviewDays([],7,new Date(2026,0,2))[0].date,'2025-12-27');
console.log('PASS: local dates, zero-filled days, duplicate submissions, range boundaries and month rollover');
