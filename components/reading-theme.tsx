"use client";
import {useEffect,useState} from 'react';
const themes=[['green','绿色'],['parchment','羊皮纸'],['dark','黑色'],['blue','蓝色']] as const;
export function ReadingTheme(){
 const [theme,setTheme]=useState('green');
 useEffect(()=>{let selected='green';try{const saved=localStorage.getItem('zoey-reading-theme');const migrated=saved==='white'?'blue':saved;if(themes.some(([id])=>id===migrated))selected=migrated!;}catch{}setTheme(selected);document.documentElement.dataset.readingTheme=selected;},[]);
 function change(value:string){setTheme(value);document.documentElement.dataset.readingTheme=value;try{localStorage.setItem('zoey-reading-theme',value);}catch{}}
 return <label className="reading-theme"><span>背景</span><select aria-label="阅读背景" value={theme} onChange={e=>change(e.target.value)}>{themes.map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></label>;
}
