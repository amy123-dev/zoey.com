"use client";
import {useEffect,useRef,useState} from 'react';
import {BookOpen,Volume2,X} from 'lucide-react';
type Entry={text?:string;redirect?:string;audio?:string[]};
const cache=new Map<string,Record<string,Entry>>();
async function readCompressed<T>(url:string):Promise<T>{
 const response=await fetch(url);if(!response.ok)throw Error('词库暂时加载失败，请重试。');
 const bytes=await response.arrayBuffer(),header=new Uint8Array(bytes);
 if(header[0]===31&&header[1]===139){
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return await new Response(stream).json() as T;
 }
 return JSON.parse(new TextDecoder().decode(bytes)) as T;
}

async function lookup(word:string,depth=0):Promise<Entry>{
 if(depth>8)throw Error('这个词条的跳转未能解析，请换用单词原形。');
 const key=word.trim().toLowerCase();
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key));const shard=new Uint8Array(hash)[0].toString(16).padStart(2,'0');
 let data=cache.get(shard);if(!data){data=await readCompressed<Record<string,Entry>>(`/dictionary/${shard}.json.gz`);cache.set(shard,data);}
 const entry=data[key];if(!entry)throw Error('这本词典未收录这个拼写。请尝试单词原形，或重新选择。');
 return entry.redirect?lookup(entry.redirect,depth+1):entry;
}
export function SelectionDictionary(){
 const [selection,setSelection]=useState<{word:string;x:number;y:number}|null>(null),[word,setWord]=useState(''),[entry,setEntry]=useState<Entry|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState(''),[playing,setPlaying]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),audio=useRef<HTMLAudioElement|null>(null),objectUrl=useRef(''),request=useRef(0);
 function stop(){audio.current?.pause();audio.current=null;if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);objectUrl.current='';setPlaying(false);}
 useEffect(()=>{
  let timer:ReturnType<typeof setTimeout>;
  const update=()=>{clearTimeout(timer);timer=setTimeout(()=>{
   if(dialog.current?.open)return;
   const s=window.getSelection(),text=s?.toString().trim().replace(/[’]/g,"'");
   const parent=s?.anchorNode?.parentElement;
   if(!s||!s.rangeCount||!text||!parent?.closest('main')||parent.closest('input,textarea,[contenteditable=true],[data-dictionary]')||!(/^[A-Za-z]+(?:['-][A-Za-z]+)*$/.test(text))||text.length>60){setSelection(null);return;}
   const rect=s.getRangeAt(0).getBoundingClientRect();setSelection({word:text,x:Math.max(12,Math.min(rect.left,window.innerWidth-252)),y:Math.max(12,Math.min(rect.bottom+10,window.innerHeight-65))});
  },100);};
  const clear=()=>setSelection(null);
  document.addEventListener('selectionchange',update);document.addEventListener('pointerup',update);window.addEventListener('scroll',clear,true);window.addEventListener('resize',clear);
  return()=>{clearTimeout(timer);document.removeEventListener('selectionchange',update);document.removeEventListener('pointerup',update);window.removeEventListener('scroll',clear,true);window.removeEventListener('resize',clear);audio.current?.pause();if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);};
 },[]);
 async function play(found:Entry){
  const playRequest=request.current;
  const path=found.audio?.[0];if(!path)throw Error('此词条没有可用的美音录音。');
  const index=await readCompressed<Record<string,[number,number,number]>>('/dictionary/audio-index.json.gz');const location=index[path];if(!location)throw Error('此词条的美音资源未找到。');
  const [pack,start,length]=location;const response=await fetch(`/dictionary/us-${String(pack).padStart(3,'0')}.bin`,{headers:{Range:`bytes=${start}-${start+length-1}`}});if(!response.ok)throw Error('录音暂时加载失败，请重试。');
  const bytes=await response.arrayBuffer();const segment=response.status===206?bytes:bytes.slice(start,start+length);if(segment.byteLength!==length)throw Error('录音下载不完整，请重试。');
  if(playRequest!==request.current||!dialog.current?.open)return;
  stop();window.dispatchEvent(new Event('zoey-stop-course-audio'));window.dispatchEvent(new Event('zoey-stop-word-audio'));
  objectUrl.current=URL.createObjectURL(new Blob([segment],{type:'audio/mpeg'}));audio.current=new Audio(objectUrl.current);audio.current.onended=()=>setPlaying(false);audio.current.onerror=()=>{setPlaying(false);setError('录音播放失败，请重试。');};await audio.current.play();setPlaying(true);
 }
 async function open(selected:string,withAudio=false){
  const id=++request.current;stop();setWord(selected);setEntry(null);setError('');setLoading(true);setSelection(null);dialog.current?.showModal();
  try{const found=await lookup(selected);if(id!==request.current)return;setEntry(found);if(withAudio)await play(found);}catch(e){if(id===request.current)setError(e instanceof Error?e.message:'查词失败，请重试。');}finally{if(id===request.current)setLoading(false);}
 }
 function close(){request.current++;stop();dialog.current?.close();setSelection(null);}
 return <div data-dictionary="true">
 {selection&&<div className="selection-dictionary" role="toolbar" aria-label={`查询 ${selection.word}`} style={{left:selection.x,top:selection.y}} onPointerDown={e=>e.preventDefault()}><button onClick={()=>void open(selection.word)}><BookOpen size={16}/>查看释义</button><button onClick={()=>void open(selection.word,true)}><Volume2 size={16}/>美音播放</button></div>}
 <dialog ref={dialog} className="dictionary-dialog" onCancel={close} onClick={e=>{if(e.target===dialog.current)close();}}><div className="dictionary-panel"><header><div><small>朗文当代高阶 · 第 5 版</small><h2 lang="en">{word}</h2></div><button className="icon-button" onClick={close} aria-label="关闭词典"><X size={20}/></button></header>
 <div className="dictionary-controls"><button className="secondary" disabled={loading||!entry?.audio?.length} onClick={()=>{if(playing)stop();else if(entry)void play(entry).catch(e=>setError(e.message));}}><Volume2 size={16}/>{playing?'停止播放':'美音录音'}</button><span>完整文字释义与例句</span></div>
 {loading&&<p role="status">正在查询词典…</p>}{error&&<div role="alert" className="dictionary-error">{error}<button className="text-button" onClick={()=>void open(word)}>重试查询</button></div>}
 {entry?.text&&<div className="dictionary-definition">{entry.text.split('\n').map((line,i,lines)=>{const isExample=/^[A-Z][a-zA-Z’' -]+.*[.!?]$/.test(line)||i>0&&/^[\u4e00-\u9fff]/.test(line)&&/^[A-Z].*[.!?]$/.test(lines[i-1]);return <p className={isExample?'dictionary-example':undefined} key={i}>{line}</p>;})}</div>}
 </div></dialog></div>;
}
