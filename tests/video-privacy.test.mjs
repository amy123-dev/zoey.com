import assert from 'node:assert/strict';
import fs from 'node:fs';
import {videosForLesson,videoWatchUrl} from '../lib/lesson-videos.ts';
const course=JSON.parse(fs.readFileSync('lib/course.json','utf8'));
for(let lesson=1;lesson<=20;lesson++){
 const list=videosForLesson(lesson);assert(list.length,`lesson ${lesson}`);
 for(const v of list){assert.match(v.youtubeId,/^[a-zA-Z0-9_-]{11}$/);assert.equal(new URL(videoWatchUrl(v)).searchParams.get('v'),v.youtubeId);}
}
assert.notEqual(videosForLesson(1)[0].youtubeId,videosForLesson(9)[0].youtubeId);
assert(videosForLesson(4).some(v=>v.key==='schwa'));
assert(videosForLesson(17).some(v=>v.key==='th'));
assert(videosForLesson(20).some(v=>v.key==='w'));
assert.equal(course.pages,undefined);
assert(!fs.existsSync('public/course-pages'));
for(const name of ['components/zoey-app.tsx','lib/lesson-notes.ts','lib/course.json']){
 const text=fs.readFileSync(name,'utf8');assert(!/原笔记|原图|原稿|图片中的|course-pages|course\.pages/.test(text),name);
}
assert.equal(course.cards.length,350,'retain all practice content');
console.log('PASS: all lesson video mappings, exact watch URLs, no public source pages/text, retained practice content');
