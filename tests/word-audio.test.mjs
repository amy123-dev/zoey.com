import assert from 'node:assert/strict';
import fs from 'node:fs';
import {lessonEnrichment} from '../lib/lesson-enrichment.ts';
import {videos} from '../lib/lesson-videos.ts';
const catalog=JSON.parse(fs.readFileSync('lib/word-audio.json','utf8'));
const groups=JSON.parse(fs.readFileSync('lib/lesson-words.json','utf8'));
for(let lesson=1;lesson<=20;lesson++){
 assert(groups[lesson]?.length>=4,`lesson ${lesson} vocabulary`);
 for(const word of groups[lesson]){
  const entry=catalog[word];assert(entry,`missing US audio: ${lesson}/${word}`);
  const url=new URL(entry.audio);
  assert.equal(url.hostname,'dict.youdao.com');assert.equal(url.protocol,'https:');
  assert.equal(url.searchParams.get('type'),'2');assert.equal(url.searchParams.get('audio').toLowerCase(),word);assert(entry.ipa);assert(entry.source);
 }
 const extension=lessonEnrichment[lesson];assert(extension);
 for(const key of ['tip','trap','practice','check'])assert(extension[key].length>10);
 for(const key of extension.sourceKeys)assert(videos[key]?.sourceUrl);
}
for(const word of ['and','or','can','some','one','subway','goodbye','blackboard','to','today','tonight','tomorrow','watched','played','wanted','breath','breathe'])assert(catalog[word],word);
console.log(`PASS: 20 lessons, ${Object.keys(catalog).length} verified US audio entries, sourced enrichment and critical examples`);
