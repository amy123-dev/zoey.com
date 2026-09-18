const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,file);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {CourseReader,StudyBlock}=require('../components/season2-reader.tsx');
const {ReadingTheme}=require('../components/reading-theme.tsx');
const lessons=require('../lib/season2.json');
function render(component,props){return renderToStaticMarkup(React.createElement(component,props));}
for(let n=13;n<=22;n++){
 const en=render(CourseReader,{current:lessons[n-1],language:'en',query:'',filter:'all'});
 assert(en.includes('s2-speaker'));assert(en.includes('课文对话'));assert(en.includes('词组与俚语'));
 assert(!en.includes('()/'),'no destructive character stripping');
}
const en=render(CourseReader,{current:lessons[15],language:'en',query:'',filter:'all'});
assert(en.includes('<strong class="s2-speaker">Chris</strong>'));
assert(en.includes('All the hotels in town were booked solid.'));
const zh=render(CourseReader,{current:lessons[0],language:'zh',query:'',filter:'all'});
assert(zh.includes('展开本段补充词组'));assert(zh.includes('揭晓英文'));assert(!zh.includes('Correct! I just got in last night.'));
const mixed=lessons[13].blocks[21];const raw=render(StudyBlock,{block:mixed,language:'en'});
assert(raw.includes('中文释义与补充'));assert(raw.includes('大幅'));assert(raw.includes('slash prices'));
const theme=render(ReadingTheme,{});for(const text of ['绿色','羊皮纸','黑色','蓝色'])assert(theme.includes(text));
console.log('PASS: clean dialogues, bold speaker names, collapsed supplemental notes, intact mixed paragraphs, language modes and theme control');
const standalone=render(StudyBlock,{block:{id:'example',text:'We got in late last night.',lang:'en',marked:false,heading:false,phrase:false,runs:[{text:'We got in late last night.',style:''}]},language:'zh'});
assert(standalone.includes('We got in late last night.'));assert(!standalone.includes('揭晓英文'));
assert(zh.includes('s2-phrase-example'));
console.log('PASS: unpaired examples stay visible and phrase examples are indented');
