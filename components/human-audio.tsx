"use client";
import {useEffect,useState} from 'react';
import {ArrowUpRight,Play,RotateCcw} from 'lucide-react';
import {videosForLesson,videoWatchUrl} from '../lib/lesson-videos';
export function HumanAudio({lesson}:{lesson:number}){
 const items=videosForLesson(lesson);
 const [selected,setSelected]=useState(items[0]?.key||''),[inline,setInline]=useState(false),[retry,setRetry]=useState(0);
 useEffect(()=>{try{const saved=sessionStorage.getItem(`zoey-video-${lesson}`);if(items.some(v=>v.key===saved))setSelected(saved!);}catch{}},[lesson]);
 const video=items.find(v=>v.key===selected)||items[0];
 if(!video)return null;
 function choose(key:string){setSelected(key);setInline(false);try{sessionStorage.setItem(`zoey-video-${lesson}`,key);}catch{}}
 return <div className="human-player">
  <p>按本课发音选择真人示范，观察口型，再录下自己的发音。</p>
  <div className="video-options" aria-label="本课视频">{items.map(v=><button key={v.key} aria-pressed={video.key===v.key} className={video.key===v.key?'selected':''} onClick={()=>choose(v.key)}><Play size={15}/>{v.title}</button>)}</div>
  <div className="video-detail"><span className="eyebrow">{video.author} · 第 {lesson} 课</span><h4>{video.title}</h4>
  <div className="button-row"><a className="primary video-open" href={videoWatchUrl(video)} target="_blank" rel="noopener noreferrer">在 YouTube 打开此视频<ArrowUpRight size={16}/></a><button className="secondary" onClick={()=>setInline(!inline)}>{inline?'收起播放器':'在此页试看'}</button></div>
  <p className="video-help">需要登录时，请使用上方按钮在独立页面登录。此课程页会保留所选视频；若登录后没有回到视频，再点同一按钮即可。YouTube 的登录和播放限制由其平台决定。</p>
  {inline&&<><iframe key={`${video.key}-${retry}`} title={video.title} src={`https://www.youtube.com/embed/${video.youtubeId}?playsinline=1&rel=0`} allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/><div className="button-row"><button className="secondary" onClick={()=>setRetry(retry+1)}><RotateCcw size={14}/>重新加载</button><a className="source-link" href={video.sourceUrl} target="_blank" rel="noopener noreferrer">打开老师的讲解页面<ArrowUpRight size={15}/></a></div></>}
  </div>
 </div>;
}
