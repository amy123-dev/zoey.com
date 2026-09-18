"use client";
import {useEffect,useRef,useState} from 'react';
import {Headphones,RotateCcw,SkipBack,SkipForward} from 'lucide-react';
import tracks from '../lib/season2-audio.json';
import {validLoop,clampTime,formatTime} from '../lib/loop-region';
export function CourseAudio({lesson}:{lesson:number}){
 const list=tracks.filter(t=>t.lesson===lesson);
 return list.length?<Player key={lesson} tracks={list}/>:null;
}
function Player({tracks:list}:{tracks:typeof tracks}){
 const [index,setIndex]=useState(0),[rate,setRate]=useState(1),[a,setA]=useState<number|null>(null),[b,setB]=useState<number|null>(null),[loop,setLoop]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const ref=useRef<HTMLAudioElement>(null),track=list[index];
 useEffect(()=>{const audio=ref.current;return()=>{audio?.pause();};},[track.id]);
 useEffect(()=>{const stop=()=>ref.current?.pause();window.addEventListener('zoey-stop-course-audio',stop);return()=>window.removeEventListener('zoey-stop-course-audio',stop);},[]);
 function selectTrack(value:number){ref.current?.pause();setIndex(value);setA(null);setB(null);setLoop(false);setError('');setNotice('');}
 function mark(which:'a'|'b'){
  const time=ref.current?.currentTime??0;
  if(which==='a'){setA(time);setB(null);setLoop(false);setNotice('已标记起点 A，播放到片段末尾再标记 B。');}
  else if(!validLoop(a,time)){setNotice('请先设定 A，并让 B 至少在 A 后 0.5 秒。');}
  else{setB(time);setLoop(true);setNotice('片段循环已开启。');if(ref.current){ref.current.currentTime=a!;void ref.current.play().catch(()=>setError('播放未开始，请点击播放器的播放按钮。'));}}
 }
 function seek(delta:number){const audio=ref.current;if(audio){setLoop(false);audio.currentTime=clampTime(audio.currentTime+delta,audio.duration||track.duration);}}
 return <section className="course-audio" aria-label="本课录音"><header><div><span className="audio-caption"><Headphones size={16}/> 本课录音</span><h3>{track.title}</h3></div><span className="audio-duration">{formatTime(track.duration)}</span></header>
 {list.length>1&&<label className="audio-track-select">选择对话<select aria-label="选择本课音频" value={index} onChange={e=>selectTrack(+e.target.value)}>{list.map((t,i)=><option key={t.id} value={i}>{t.part} · {t.title}</option>)}</select></label>}
 <audio key={track.id} ref={ref} src={track.src} controls preload="metadata" aria-label={`${track.title} 课程音频`} onLoadedMetadata={()=>{if(ref.current){ref.current.playbackRate=rate;ref.current.preservesPitch=true;}}} onPlay={()=>{setError('');window.dispatchEvent(new Event('zoey-stop-word-audio'));document.querySelectorAll('audio').forEach(audio=>{if(audio!==ref.current)audio.pause();});}} onError={()=>setError('音频加载失败，请重试。')} onTimeUpdate={()=>{const audio=ref.current;if(audio&&loop&&validLoop(a,b)&&(audio.currentTime>=b!||audio.currentTime<a!))audio.currentTime=a!;}} onEnded={()=>{if(loop&&validLoop(a,b)&&ref.current){ref.current.currentTime=a!;void ref.current.play().catch(()=>setError('请点击播放继续循环。'));}}}/>
 <div className="audio-tools"><button className="secondary" onClick={()=>seek(-5)}><SkipBack size={15}/>退 5 秒</button><button className="secondary" onClick={()=>seek(5)}>进 5 秒<SkipForward size={15}/></button><label>语速<select aria-label="音频播放速度" value={rate} onChange={e=>{const value=+e.target.value;setRate(value);if(ref.current)ref.current.playbackRate=value;}}>{[.5,.75,1,1.25,1.5].map(v=><option key={v} value={v}>{v}×</option>)}</select></label></div>
 <details className="audio-loop"><summary>片段循环 · 练习弱读与连读</summary><p>听到想练的片段时设置 A、B，只循环这一段。语流标注是读法参考，尚未逐句对齐录音。</p><div className="audio-tools"><button className="secondary" onClick={()=>mark('a')}>设 A <span>{a===null?'起点':formatTime(a)}</span></button><button className="secondary" disabled={a===null} onClick={()=>mark('b')}>设 B <span>{b===null?'终点':formatTime(b)}</span></button><button className="secondary" disabled={!validLoop(a,b)} aria-pressed={loop} onClick={()=>{setLoop(!loop);setNotice(loop?'已关闭片段循环。':'已开启片段循环。');}}><RotateCcw size={15}/>{loop?'关闭循环':'开启循环'}</button><button className="text-button" onClick={()=>{setA(null);setB(null);setLoop(false);setNotice('循环标记已清除。');}}>清除标记</button></div><p role="status">{notice}</p></details>
 {error&&<div role="alert" className="audio-error"><p>{error}</p><button className="secondary" onClick={()=>{setError('');ref.current?.load();}}>重新加载</button></div>}
 </section>;
}
