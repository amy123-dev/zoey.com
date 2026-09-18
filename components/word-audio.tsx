"use client";
import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {Volume2,Square,LoaderCircle,ArrowUpRight} from 'lucide-react';
import catalog from '../lib/word-audio.json';
import words from '../lib/lesson-words.json';
import {lessonEnrichment} from '../lib/lesson-enrichment';
import {videos} from '../lib/lesson-videos';
import {VoiceRecorder} from './voice-recorder';
type Entry={audio:string;ipa:string;source:string;provider:string;verified:string};
const audioWords=catalog as Record<string,Entry>;
type State={word:string;status:'idle'|'loading'|'playing'|'error';play:(word:string)=>void};
const AudioContext=createContext<State>({word:'',status:'idle',play:()=>{}});
export function WordAudioProvider({children}:{children:ReactNode}){
 const audio=useRef<HTMLAudioElement|null>(null),generation=useRef(0),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const [state,setState]=useState<{word:string;status:State['status']}>({word:'',status:'idle'});
 function stop(){generation.current++;if(timer.current)clearTimeout(timer.current);if(audio.current){audio.current.pause();audio.current.removeAttribute('src');audio.current.load();audio.current=null;}}
 useEffect(()=>{const pause=()=>{stop();setState({word:'',status:'idle'});};window.addEventListener('zoey-stop-word-audio',pause);return()=>{window.removeEventListener('zoey-stop-word-audio',pause);stop();};},[]);
 function play(word:string){
  const key=word.toLowerCase(),entry=audioWords[key];if(!entry)return;
  const same=state.word===key&&(state.status==='playing'||state.status==='loading');stop();
  if(same){setState({word:key,status:'idle'});return;}
  window.dispatchEvent(new Event('zoey-stop-course-audio'));
  const token=generation.current,player=new Audio(entry.audio);audio.current=player;
  setState({word:key,status:'loading'});
  const fail=()=>{if(generation.current!==token)return;stop();setState({word:key,status:'error'});};
  player.onplaying=()=>{if(generation.current!==token)return;if(timer.current)clearTimeout(timer.current);setState({word:key,status:'playing'});};
  player.onended=()=>{if(generation.current!==token)return;stop();setState({word:key,status:'idle'});};
  player.onerror=fail;
  timer.current=setTimeout(fail,15000);
  void player.play().catch(fail);
 }
 return <AudioContext.Provider value={{...state,play}}>{children}<div className="word-audio-status" role="status" aria-live="polite">{state.status==='error'?<><span>暂时无法播放 {state.word} 的录音。</span><button className="secondary" onClick={()=>play(state.word)}>重试</button><a href={audioWords[state.word]?.source} target="_blank" rel="noopener noreferrer">去词典听美音 ↗</a></>:state.status==='loading'?`正在加载 ${state.word} 的美音…`:state.status==='playing'?`正在播放：${state.word} · 美音`:''}</div></AudioContext.Provider>;
}
export function WordButton({word,card=false}:{word:string;card?:boolean}){
 const ctx=useContext(AudioContext),key=word.toLowerCase(),entry=audioWords[key];if(!entry)return <>{word}</>;
 const active=ctx.word===key&&(ctx.status==='loading'||ctx.status==='playing');
 const Icon=active?(ctx.status==='loading'?LoaderCircle:Square):Volume2;
 return <button type="button" className={card?'word-audio-card':'word-audio-inline'} aria-label={`${active?'停止':'播放'} ${word} 的美式发音`} aria-pressed={active} onClick={()=>ctx.play(key)}><span lang="en">{word}</span>{card&&<span className="word-ipa">/{entry.ipa}/</span>}<Icon size={card?18:13} aria-hidden="true" className={active&&ctx.status==='loading'?'audio-loading':''}/></button>;
}
export function PronunciationText({text}:{text:string}){
 return <>{text.split(/(\/[^/\n]+\/|\[[^\]\n]+\]|[A-Za-z]+(?:['’][A-Za-z]+)?)/g).map((part,i)=>audioWords[part.toLowerCase().replace('’',"'")]?<WordButton key={i} word={part.replace('’',"'")}/>:part)}</>;
}
export function LessonEnrichment({lesson}:{lesson:number}){
 const data=lessonEnrichment[lesson];if(!data)return null;
 const list=(words as Record<string,string[]>)[String(lesson)]||[];
 return <section className="lesson-enrichment" aria-label="美音跟读与拓展"><div className="enrichment-heading"><span className="eyebrow">LISTEN · NOTICE · PRACTISE</span><h3>本课美音词汇</h3><p>点单词听美式词典读音，再跟读一遍。单词独立读音与句中的弱读、连读可能不同。</p></div><div className="word-audio-grid">{list.map(w=><WordButton key={w} word={w} card/>)}</div><details className="audio-sources"><summary>读音来源与标音说明</summary><p>音频：有道词典美音；音标参考词典，个别复数词形按本课规则标注。点击时在线播放外部音频；不同词典可能用 /iː/ 或 /i/、/uː/ 或 /u/ 等不同宽式标法。真人语流示范见下方视频。</p><div>{list.map(w=><a key={w} href={audioWords[w]?.source||`https://dict.youdao.com/result?word=${encodeURIComponent(w)}&lang=en`} target="_blank" rel="noopener noreferrer">{w} ↗</a>)}</div></details><div className="extension-card"><span className="eyebrow">拓展练习</span><h3>{data.focus}</h3><dl><div><dt>口型与发声</dt><dd>{data.tip}</dd></div><div><dt>容易混淆</dt><dd>{data.trap}</dd></div><div><dt>练一练</dt><dd><PronunciationText text={data.practice}/></dd></div><div><dt>听回自己的录音</dt><dd>{data.check}</dd></div></dl><VoiceRecorder text={data.practice}/><p className="extension-reference">参考讲解 · Rachel’s English</p><div className="extension-links">{data.sourceKeys.map(key=><a key={key} href={videos[key].sourceUrl} target="_blank" rel="noopener noreferrer">{videos[key].title}<ArrowUpRight size={14}/></a>)}</div></div></section>;
}
