"use client";
import {Fragment,useEffect,useState} from 'react';
import {ArrowRight} from 'lucide-react';
import lessons from '../lib/season2.json';
import learning from '../lib/season2-learning.json';
import {organizeLesson,type SourceBlock,type PhraseGroup} from '../lib/season2-structure';
export type Language='zh'|'en'|'both';
export function RichText({block}:{block:SourceBlock}){
 return <>{block.runs.map((r,i)=><span key={i} className={[r.style.includes('color')?'s2-mark':'',r.style.includes('underline')?'s2-underline':'',r.style.includes('bold')?'s2-bold':''].join(' ')}>{r.text}</span>)}</>;
}
export function StudyBlock({block,language}:{block:SourceBlock;language:Language}){
 if(!/[\p{L}\p{N}]/u.test(block.text))return null;
 const chinese=/[\u2e80-\u9fff]/.test(block.text);
 // Never delete characters from mixed-language paragraphs: that breaks examples,
 // IPA and definitions. English mode folds the whole explanation instead.
 if(language==='en'&&chinese)return <details className="s2-translation"><summary>中文释义与补充 · 展开查看</summary><p><RichText block={block}/></p></details>;
 return <div className={`s2-block ${block.heading?'s2-heading':''}`}>
 <p lang={chinese?undefined:'en'}><RichText block={block}/></p>
 </div>;
}
function Phrase({group,language,expanded=false}:{group:PhraseGroup;language:Language;expanded?:boolean}){
 let previousExample=false;
 return <details className="s2-phrase" open={expanded||undefined}><summary><span className="s2-number">{String(group.number).padStart(2,'0')}</span><strong>{group.title}</strong><span className="s2-expand-label">释义 · 例句 · 补充</span></summary><div className="s2-phrase-body">{group.blocks.map((b,i)=>{
  const text=b.text.trim();
  const example=i>0&&(/^(?:[“"‘']?[A-Z][A-Za-z’']*\s).*[.!?。！？]/.test(text)||/^例句\s*[:：]\s*[A-Z]/.test(text));
  const translation=previousExample&&/^[\u4e00-\u9fff]/.test(text)&&! /^(?:补充|常见|搭配|注意|含义|释义|反义|同义|例句|区别|用法|也可|这里|口语)/.test(text);
  previousExample=example;
  return <div key={b.id} className={example||translation?'s2-phrase-example':undefined}><StudyBlock block={b} language={language}/></div>;
 })}</div></details>;
}
type Turn={speaker:string;zh:SourceBlock[];en:SourceBlock[]};
export function pairDialogue(blocks:SourceBlock[]):Turn[]{
 const turns:Turn[]=[];
 for(const block of blocks){
  if(!/[\p{L}\p{N}]/u.test(block.text))continue;
  const zh=block.lang==='zh';
  const last=turns[turns.length-1];
  if(zh&&last&&!last.en.length){last.zh.push(block);continue;}
  if(!zh&&last){last.en.push(block);continue;}
  turns.push({speaker:'',zh:zh?[block]:[],en:zh?[]:[block]});
 }
 return turns;
}
function TurnCard({speaker,zh,en,language}:{speaker:string;zh:SourceBlock[];en:SourceBlock[];language:Language}){
 const [revealed,setRevealed]=useState(false);
 useEffect(()=>setRevealed(false),[language]);
 return <article className="s2-dialogue-turn"><strong className="s2-speaker">{speaker}</strong><div>
 {language!=='en'&&zh.map(b=><p key={b.id} className="s2-turn-zh"><RichText block={b}/></p>)}
 {(language!=='zh'||revealed||!zh.length)?en.map(b=><p key={b.id} className="s2-turn-en" lang="en"><RichText block={b}/></p>):en.length>0&&<button className="s2-reveal" onClick={()=>setRevealed(true)}>揭晓英文<ArrowRight size={14}/></button>}
 {language==='en'&&!en.length&&zh.length>0&&<details className="s2-translation"><summary>本段中文补充</summary>{zh.map(b=><p key={b.id}><RichText block={b}/></p>)}</details>}
 </div></article>;
}
function textBlock(text:string,id:string):SourceBlock{return {id,text,lang:/[\u2e80-\u9fff]/.test(text)?'zh':'en',marked:false,heading:false,phrase:false,runs:[{text,style:''}]};}
const people:Record<number,string[]>={1:['Todd','Matt'],2:['Lauren','Sarah'],3:['Eric','Michael'],4:['Nicole','Jen'],8:['Pat','Katie'],12:['店员 / Staff','顾客 / Customer']};
const titleCount:Record<number,number>={1:1,2:2,3:2,4:1,5:2,6:2,7:1,8:2,9:2,10:4,11:1,12:1};
export function CourseReader({current,language,query,filter}:{current:typeof lessons[number];language:Language;query:string;filter:string}){
 const structure=organizeLesson(current),[section,setSection]=useState<'dialogue'|'phrases'>('dialogue');
 useEffect(()=>setSection('dialogue'),[current.id]);
 const match=(b:SourceBlock)=>b.text.toLowerCase().includes(query.toLowerCase())&&(filter!=='marked'||b.marked);
 const searching=!!query||filter==='marked';
 const groups=structure.groups.filter(g=>!searching||g.blocks.some(match));
 let turnNumber=0;
 return <>
 <div className="s2-content-tabs" role="group" aria-label="课文与词组"><button aria-pressed={section==='dialogue'} onClick={()=>setSection('dialogue')}>课文对话</button><button aria-pressed={section==='phrases'} onClick={()=>setSection('phrases')}>词组与俚语 <span>{structure.groups.length}</span></button></div>
 {searching?<section className="s2-reading-panel"><h3>搜索与重点</h3><p className="s2-mode-note">完整保留匹配段落的中英文和标记，避免断句。</p>{current.blocks.filter(match).map(b=><StudyBlock key={b.id} block={b} language="both"/>)}</section>:section==='phrases'?<section className="s2-reading-panel"><header className="s2-section-heading"><h3>词组与俚语</h3><p>本课按顺序编号，点开查看完整释义、例句与延伸。</p></header>{groups.map(g=><Phrase key={g.number} group={g} language={language}/>)}</section>:<section className="s2-reading-panel"><header className="s2-section-heading"><h3>课文对话</h3><p>按人物顺序阅读。补充说明折叠保存，点击即可展开。</p></header>
 {current.id>=13?<>
 {learning.real.filter(r=>r.lesson===current.id&&r.original).map(r=><TurnCard key={r.id} speaker={r.speaker} zh={[textBlock(r.zh,r.id+'-zh')]} en={[textBlock(r.en,r.id+'-en')]} language={language}/>)}
 <details className="s2-annotation"><summary>展开课文批注与同义表达</summary>{current.blocks.slice(1,structure.dialogueEnd).map(b=><StudyBlock key={b.id} block={b} language={language}/>)}</details>
 <button className="secondary" onClick={()=>setSection('phrases')}>进入本课 {groups.length} 组词组与俚语<ArrowRight size={16}/></button>
 </>:structure.segments.map((segment,i)=>{
  const body=i===0?segment.blocks.slice(titleCount[current.id]||1):segment.blocks;
  return <Fragment key={i}>{pairDialogue(body).map((turn,j)=>{
   const explicit=turn.zh[0]?.text.match(/^([A-Z]|[A-Z][a-z]+)[:：]/)?.[1];
   const speaker=explicit==='T'?'Todd':explicit==='M'?'Matt':explicit||(current.id===12&&Number((turn.zh[0]?.id||'').split('-b')[1])>25?undefined:people[current.id]?.[turnNumber%2])||`发言 ${turnNumber+1}`;turnNumber++;
   return <TurnCard key={turn.zh[0]?.id||turn.en[0]?.id||j} speaker={speaker} zh={turn.zh} en={turn.en} language={language}/>;
  })}{segment.supplements.length>0&&<details className="s2-annotation"><summary>展开本段补充词组 <span>{segment.supplements.length} 组 · {String(segment.supplements[0].number).padStart(2,'0')}–{String(segment.supplements.at(-1)!.number).padStart(2,'0')}</span></summary>{segment.supplements.map(g=><Phrase key={g.number} group={g} language={language}/>)}</details>}</Fragment>;
 })}
 </section>}
 </>;
}
