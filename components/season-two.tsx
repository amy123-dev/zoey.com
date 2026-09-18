"use client";
import {useEffect,useState} from 'react';
import {BookOpen,ArrowRight,Headphones,PenLine,Search,Check,ChevronLeft,ChevronRight} from 'lucide-react';
import lessons from '../lib/season2.json';
import learning from '../lib/season2-learning.json';
import {analyzeSpeech} from '../lib/real-speak';
import {seasonTwoRules} from '../lib/season2-rules';
import {isCorrectAnswer} from '../lib/writing';
import {shuffle,type Progress} from '../lib/review';
import {VoiceRecorder} from './voice-recorder';
import {HumanAudio} from './human-audio';
import {ImportPanel} from './import-panel';
import {CourseReader,StudyBlock,type Language} from './season2-reader';
import {CourseAudio} from './course-audio';
import {ThemeCredits} from './theme-credits';
import {ReviewChart} from './review-chart';
import {type ReviewEvent} from '../lib/review-chart';
import {seasonTwoTitles} from '../lib/season2-titles';
type Real=typeof learning.real[number];
type Card=typeof learning.cards[number];
type Props={view:string;lesson:number;choose:(id:number)=>void;navigate:(view:string)=>void;progress:Record<string,Progress>;history?:ReviewEvent[];auth:string;save:(card:{id:string},grade:number,event:string)=>Promise<boolean>};
function RealCard({item,language,onPractice}:{item:Real;language:Language;onPractice:(item:Real)=>void}){
 const [show,setShow]=useState(false);useEffect(()=>setShow(false),[language,item.id]);
 const analysis=analyzeSpeech(item.en),visible=language!=='zh'||show;
 return <article className="s2-real-card"><div className="s2-card-meta"><strong>{item.speaker}</strong><span>{item.origin}</span></div>
 {language!=='en'&&<p className="s2-chinese">{item.zh}</p>}
 {!visible?<button className="secondary" onClick={()=>setShow(true)}>想好了，查看英文与语流<ArrowRight size={16}/></button>:<>
 <span className="s2-label">标准英文</span><h3 lang="en">{item.en}</h3>
 <div className="s2-spoken"><span className="s2-label">自然口语 · 一种可选读法</span><p lang="en">{analysis.spoken}</p></div>
 {analysis.changes.length?<div className="s2-changes">{analysis.changes.map((c,i)=><div key={i}><span className="s2-step-number">语流点 {i+1}</span><strong lang="en">{c.before} → {c.after}</strong><span className="s2-ipa">[{c.ipa}]</span><span className="s2-rule-kind">{c.kind}</span><p>{c.note}</p><a href={`#lessons?lesson=${c.lesson}`}>复习第一季第 {c.lesson} 课 ↗</a></div>)}</div>:<p className="s2-explanation">这句不必刻意缩写。保持意群连贯，突出承载意思的词，句尾不要额外添加元音。</p>}
 {item.original&&<details className="s2-original"><summary>对照教材的口语拼写</summary><p lang="en">{item.original}</p><p>这是辅助听辨的拼写方式。上方用音标解释关键变化；不是要求照字母逐个念，也不替代正式拼写。</p></details>}
 <details className="s2-record"><summary>录音跟读与回听</summary><VoiceRecorder text={item.en}/></details>
 {language==='zh'&&<button className="text-button" onClick={()=>setShow(false)}>收起答案</button>}</>}
 {learning.cards.some(c=>c.id===item.id)&&<button className="s2-practice-link" onClick={()=>onPractice(item)}><PenLine size={15}/>只看中文，默写这一句</button>}
 </article>;
}
export function SeasonTwo({view,lesson,choose,navigate,progress,history=[],auth,save}:Props){
 const current=lessons.find(l=>l.id===lesson)||lessons[0];
 const [language,setLanguage]=useState<Language>('zh'),[query,setQuery]=useState(''),[filter,setFilter]=useState('all'),[page,setPage]=useState(1);
 const [practiceLesson,setPracticeLesson]=useState(0),[scope,setScope]=useState('all'),[count,setCount]=useState(10);
 const [run,setRun]=useState<Card[]>([]),[index,setIndex]=useState(0),[draft,setDraft]=useState(''),[answered,setAnswered]=useState(false),[ok,setOk]=useState(false),[busy,setBusy]=useState(false),[saved,setSaved]=useState(false),[eventId,setEventId]=useState(''),[complete,setComplete]=useState(false),[correct,setCorrect]=useState(0);
 useEffect(()=>{try{const v=localStorage.getItem('zoey-course-language');if(v==='zh'||v==='en'||v==='both')setLanguage(v);}catch{}},[]);
 useEffect(()=>{setPage(1);setQuery('');setFilter('all');},[lesson,view]);
 function languageChange(value:Language){setLanguage(value);try{localStorage.setItem('zoey-course-language',value);}catch{}}
 const cards=learning.cards,wrong=cards.filter(c=>progress[c.id]?.wrong),due=cards.filter(c=>progress[c.id]&&progress[c.id].due<=Date.now());
 const pool=cards.filter(c=>(!practiceLesson||c.lesson===practiceLesson)&&(scope==='wrong'?!!progress[c.id]?.wrong:scope==='due'?!!progress[c.id]&&progress[c.id].due<=Date.now():true));
 function start(items:Card[]){if(!items.length)return;setRun(shuffle(items).slice(0,count));setIndex(0);setDraft('');setAnswered(false);setSaved(false);setComplete(false);setCorrect(0);setEventId(crypto.randomUUID());navigate('writing');}
 async function answer(reveal=false){if(busy||answered||(!reveal&&!draft.trim()))return;const result=!reveal&&isCorrectAnswer(draft,run[index].en);setOk(result);setAnswered(true);setCorrect(n=>n+(result?1:0));await storeGrade(result);}
 async function storeGrade(result:boolean){setBusy(true);try{setSaved(await save(run[index],result?2:0,eventId));}finally{setBusy(false);}}
 function next(){if(!saved)return;if(index+1===run.length){setComplete(true);return;}setIndex(i=>i+1);setDraft('');setAnswered(false);setSaved(false);setEventId(crypto.randomUUID());}
 const label=view==='expressions'?'Real Speak':view==='writing'?'独立默写':view==='progress'?'我的复习':'课程内容';
 const toolbar=<div className="s2-language" role="group" aria-label="课程显示语言">{([['zh','中文先想'],['en','英文'],['both','中英对照']] as const).map(([value,name])=><button key={value} aria-pressed={language===value} onClick={()=>languageChange(value)}>{name}</button>)}</div>;
 const real=learning.real.filter(r=>r.lesson===current.id&&`${r.zh} ${r.en} ${r.original}`.toLowerCase().includes(query.toLowerCase()));
 const menu=<aside className="lesson-menu"><div className="menu-caption">SEASON 02 <span>22 节</span></div>{lessons.map(l=><button key={l.id} className={current.id===l.id?'selected':''} onClick={()=>choose(l.id)}><span className="lesson-no">{String(l.id).padStart(2,'0')}</span><span className="s2-menu-title">{l.title}<small lang="en">{seasonTwoTitles[l.id]}</small></span></button>)}</aside>;
 return <div className="season-two"><div className="page-heading"><div><span className="eyebrow">SEASON TWO · IN CONVERSATION</span><h1>{view==='expressions'?'听懂语流，说得自然。':view==='writing'?'先想到，再说出来。':view==='progress'?'让表达，留在记忆里。':'从理解，到自然表达。'}</h1><p>第二季 · {label}</p></div><span className="s2-season-count">22 课</span></div>
 {(view==='lessons'||view==='expressions')&&<div className="course-layout">{menu}<section className="course-content"><div className="lesson-cover"><div><span className="eyebrow">LESSON {String(current.id).padStart(2,'0')}</span><h2>{current.title}</h2><p className="s2-english-title" lang="en">{seasonTwoTitles[current.id]}</p><p>{current.textbook}</p></div><button className="secondary" onClick={()=>navigate(view==='lessons'?'expressions':'lessons')}>{view==='lessons'?<Headphones size={17}/>:<BookOpen size={17}/>} {view==='lessons'?'本课 Real Speak':'本课完整内容'}</button></div>
 <CourseAudio key={current.id} lesson={current.id}/><div className="s2-study-toolbar">{toolbar}<label className="search"><Search size={17}/><input aria-label="搜索本课内容" placeholder="搜索本课关键词" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}}/></label></div>
 {view==='lessons'?<><div className="s2-filters" role="group" aria-label="内容筛选">{[['all','正常阅读'],['marked','查看划线与重点']].map(([v,t])=><button key={v} aria-pressed={filter===v} onClick={()=>setFilter(v)}>{t}</button>)}</div><p className="s2-mode-note">{language==='zh'?'中文先想：对话先显示中文，点击揭晓英文。':language==='en'?'英文阅读：对话完整显示英文，中文解释可单独展开。':'中英对照：逐段显示中文与英文。'} 重点以高对比文字及下划线标记。</p><CourseReader key={current.id} current={current} language={language} query={query} filter={filter}/></>:<>
 <div className="s2-real-intro"><h3>先想英文，再观察它怎样连起来</h3><p>方括号 [ ] 标注关键片段的语流音，不是整句音标。‿ 表示连接，[ɾ] 表示闪音。读法会随重音、语速和说话人变化，不必每处都弱化。</p><p>从左到右逐处练习：先读标准短语，再连接边界，最后缩短非重读音。每条分析说明变化的位置、音标和适用条件；可用上方本课录音对照听辨；片段尚未逐句对齐，补充例句不一定出现在录音中。</p></div>
 {seasonTwoRules[current.id]&&<section className="s2-rule-summary"><h3>{seasonTwoRules[current.id].title}</h3>{seasonTwoRules[current.id].points.map((p,i)=><p key={i}>{p}</p>)}<div>{seasonTwoRules[current.id].seasonOne.map(n=><a key={n} href={`#lessons?lesson=${n}`}>第一季第 {n} 课 ↗</a>)}</div></section>}
 {real.map(item=><RealCard key={item.id} item={item} language={language} onPractice={r=>start([{id:r.id,lesson:r.lesson,en:r.en,zh:r.zh,category:'expression'}])}/>)}{!real.length&&<p className="empty">没有匹配内容。</p>}
 {current.realBlocks.length>0&&<details className="s2-source-practice"><summary>本课更多语流例句与补充说明</summary>{current.blocks.filter(b=>current.realBlocks.includes(b.id)).map(b=><StudyBlock key={b.id} block={b} language={language}/>)}</details>}
 <details className="s2-reference"><summary>真人语流参考 · 弱读与连读示范</summary><p>下面是发音规律的真人讲解，并非本课逐句录音。</p><HumanAudio lesson={current.id===13?15:current.id===14?9:current.id===20?20:4}/><a href="https://rachelsenglish.com/fast-english-reductions/" target="_blank" rel="noopener noreferrer">Rachel’s English · 自然语流讲解 ↗</a>{current.id>=13&&<p><a href="https://slangman.com/products/street-speak-1-course-the-complete-course-on-american-slang-idioms" target="_blank" rel="noopener noreferrer">Slangman 官方教材与配套音频入口 ↗</a>（请核对教材版本，官方资源可能需要购买或登录。）</p>}</details>
 </>}
 <div className="lesson-bottom"><button className="secondary" disabled={current.id===1} onClick={()=>choose(current.id-1)}><ChevronLeft size={17}/>上一课</button><button className="primary" disabled={current.id===22} onClick={()=>choose(current.id+1)}>下一课<ChevronRight size={17}/></button></div></section></div>}
 {view==='writing'&&<>{!run.length?<section className="writing-setup"><h2>第二季 · 中译英默写</h2><p>提交前隐藏英文、口语拼写和音标。按标准英文核对，不要求写口语改写。</p><div className="setup-fields"><label>课程<select value={practiceLesson} onChange={e=>setPracticeLesson(+e.target.value)}><option value={0}>第二季全部课程</option>{lessons.map(l=><option key={l.id} value={l.id}>{l.id}. {l.title}</option>)}</select></label><label>范围<select value={scope} onChange={e=>setScope(e.target.value)}><option value="all">全部练习</option><option value="wrong">我的错题</option><option value="due">到期复习</option></select></label><label>本轮数量<select value={count} onChange={e=>setCount(+e.target.value)}>{[5,10,20].map(n=><option key={n}>{n}</option>)}</select></label></div><p>可练 {pool.length} 条</p><button className="primary" disabled={!pool.length||auth==='loading'} onClick={()=>start(pool)}>开始默写<ArrowRight size={16}/></button></section>:complete?<section className="writing-result"><Check size={36}/><h2>这一轮完成了</h2><p>完成 {run.length} 条，答对 {correct} 条。</p><button className="primary" onClick={()=>setRun([])}>重新选题</button></section>:<section className="writing-run"><header><button className="secondary" disabled={busy} onClick={()=>setRun([])}>结束本轮</button><span>第 {run[index].lesson} 课 · {index+1}/{run.length}</span></header><progress value={index+(answered?1:0)} max={run.length}/><h2 className="s2-prompt">{run[index].zh}</h2><form onSubmit={e=>{e.preventDefault();void answer();}}><label htmlFor="s2-answer">你的英文</label><textarea key={index} autoFocus id="s2-answer" value={draft} onChange={e=>setDraft(e.target.value)} readOnly={answered} spellCheck={false} autoComplete="off" placeholder="先回忆，再写下来…"/>{!answered&&<div className="button-row"><button className="primary" disabled={busy||!draft.trim()}>提交核对</button><button type="button" className="text-button" onClick={()=>void answer(true)}>想不起来，揭晓答案</button></div>}</form>{answered&&<div className="writing-feedback" role="status"><strong>{ok?'与参考表达一致':'本句待巩固'}</strong><h3>{run[index].en}</h3><p>其他正确译法可能不同于参考答案；这里按课程表达核对。</p>{!saved&&!busy&&<button className="secondary" onClick={()=>void storeGrade(ok)}>重试保存</button>}<button className="primary" disabled={!saved||busy} onClick={next}>{busy?'正在保存…':index+1===run.length?'完成本轮':'下一句'}</button></div>}</section>}{auth==='guest'&&<p className="guest-note">访客记录只留在当前页面。登录后，练习记录独立保存到自己的账号。</p>}</>}
 {view==='progress'&&<><ReviewChart history={history} season={2}/><div className="stats-grid"><section><span>第二季已练</span><strong>{cards.filter(c=>progress[c.id]).length}</strong></section><section><span>待巩固</span><strong>{wrong.length}</strong></section><section><span>到期复习</span><strong>{due.length}</strong></section></div><section className="review-panel"><h2>第二季 · 我的复习</h2><p>{auth==='signed'?'只有你的账号能读取这些记录。':'当前是访客练习；刷新后记录会清空。'}</p><div className="button-row"><button className="primary" disabled={!wrong.length} onClick={()=>start(wrong)}>复习错题</button><button className="secondary" disabled={!due.length} onClick={()=>start(due)}>到期复习</button></div>{wrong.map(c=><div className="wrong-row" key={c.id}><span>第 {c.lesson} 课</span><p>{c.zh}</p><button onClick={()=>start([c])}>再练一次</button></div>)}</section></>}
 {view==='import'&&<><ImportPanel/><p className="guest-note">导入入口用于私人文件存放；不会自动生成已发布课程。</p></>}
 <footer><span>Zoey · 第二季学习笔记</span><span>先理解 · 再回忆 · 最后开口</span><ThemeCredits/></footer></div>;
}
