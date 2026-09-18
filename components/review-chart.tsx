"use client";
import {useState} from 'react';
import {reviewDays,type ReviewEvent} from '../lib/review-chart';
export function ReviewChart({history,season}:{history:ReviewEvent[];season:number}){
 const [days,setDays]=useState(7),[selected,setSelected]=useState('');
 const events=history.filter(e=>e.cardId&&(season===2?e.cardId.startsWith('s2-'):!e.cardId.startsWith('s2-')));
 const rows=reviewDays(events,days),total=rows.reduce((n,r)=>n+r.total,0),correct=rows.reduce((n,r)=>n+r.correct,0);
 const peak=Math.max(0,...rows.map(r=>r.total)),step=Math.max(1,Math.ceil(peak/4)),max=step*4;
 const active=rows.find(r=>r.date===selected)??rows[rows.length-1];
 return <section className="review-chart" aria-label={`第${season}季每日练习统计`}>
  <header><div><span className="eyebrow">A LITTLE, EVERY DAY</span><h2>把坚持，看得见。</h2><p>第 {season} 季 · 每日练习次数</p></div><div className="chart-range" aria-label="统计范围">{[7,30].map(n=><button key={n} aria-pressed={days===n} onClick={()=>{setDays(n);setSelected('');}}>近 {n} 天</button>)}</div></header>
  <div className="chart-summary"><strong>{total}<small> 次练习</small></strong><span>{rows.filter(r=>r.total).length} 天有练习 · 答对 {correct} 次</span><span>{rows[0].date} — {rows[days-1].date}</span></div>
  <div className="chart-detail" aria-live="polite"><span>{active.date}</span><strong>完成 {active.total} 次</strong><span>答对 {active.correct} 次</span></div>
  <div className="chart-scroll"><div className={`chart-canvas ${days===30?'chart-month':''}`}>
   <div className="chart-axis" aria-hidden="true">{[4,3,2,1,0].map(n=><span key={n}>{n*step}</span>)}</div>
   <div className="chart-plot"><div className="chart-grid" aria-hidden="true">{[0,1,2,3,4].map(n=><i key={n}/>)}</div><div className="chart-columns">{rows.map(row=><button key={row.date} className="chart-column" aria-label={`${row.date}，完成 ${row.total} 次，答对 ${row.correct} 次`} aria-pressed={active.date===row.date} onClick={()=>setSelected(row.date)} onFocus={()=>setSelected(row.date)} onMouseEnter={()=>setSelected(row.date)}><span className="chart-bar-space"><span className="chart-bar" style={{height:`${row.total/max*100}%`}}>{row.total>0&&<span className="chart-value">{row.total}</span>}</span></span><span className="chart-date">{row.label}</span></button>)}</div></div>
  </div></div>
  {!total&&<p className="chart-empty">这段时间还没有练习记录。完成一次默写或自测，就会留下今天的第一根柱子。</p>}
  <p className="chart-note">按本地日期统计已提交的默写与自测；同一道题重复练习也会计入。</p>
 </section>;
}
