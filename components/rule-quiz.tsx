"use client";
import {useState} from 'react';
import course from '../lib/course.json';
export function RuleQuiz({lesson,onSave}:{lesson:number;onSave:(id:string,grade:number,eventId:string)=>Promise<boolean>}){
 const question=course.questions.find(q=>q.lesson===lesson);
 const [answer,setAnswer]=useState(''),[status,setStatus]=useState(''),[eventId]=useState(()=>crypto.randomUUID());
 if(!question)return null;
 async function save(value:string){setAnswer(value);setStatus('正在保存…');const ok=await onSave(question!.id,value===question!.en?2:0,eventId);setStatus(ok?'本次自测已记录':'保存失败');}
 return <section className="resource-section"><h3>发音规则自测</h3><p>{question.zh}</p><div className="button-row">{question.choices.map(choice=><button key={choice} className={answer===choice?'primary':'secondary'} disabled={!!answer} onClick={()=>save(choice)}>{choice}</button>)}</div>{answer&&<div className="clarification"><strong>{answer===question.en?'回答正确':'再巩固一下'}</strong><p>答案：{question.en}。{question.tip}<br/>{status}</p>{status==='保存失败'&&<button className="secondary" onClick={()=>save(answer)}>重新保存</button>}</div>}</section>;
}
