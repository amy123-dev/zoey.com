import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import course from '../../../lib/course.json';
import seasonTwo from '../../../lib/season2-learning.json';
import { schedule, type Progress } from '../../../lib/review';
const ids=new Set([...course.cards,...course.questions,...seasonTwo.cards].map(c=>c.id));
async function identity(){const u=await getChatGPTUser();return u?.userId ?? (process.env.NODE_ENV==='development'?'local-preview':null);}
export async function GET(){
 const user=await identity(); if(!user)return Response.json({error:'请登录后同步学习记录。'},{status:401});
 try{const db=env.DB;if(!db)throw Error('DB unavailable');const p=await db.prepare('SELECT card_id AS cardId,level,due,attempts,wrong,updated FROM progress WHERE user_id=?').bind(user).all();
 const history=await db.prepare('SELECT id,card_id AS cardId,at,grade FROM review_events WHERE user_id=? AND at>=? ORDER BY at DESC').bind(user,Date.now()-32*86400000).all();
 return Response.json({progress:p.results,history:history.results},{headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('progress load failed',e);return Response.json({error:'暂时无法读取学习记录，请重试。'},{status:503});}
}
export async function POST(req:Request){
 const user=await identity();if(!user)return Response.json({error:'请登录后保存学习记录。'},{status:401});
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return Response.json({error:'请求来源不匹配。'},{status:403});
 let body:Record<string,unknown>;try{body=await req.json() as Record<string,unknown>;}catch{return Response.json({error:'请求格式不正确。'},{status:400});}
 if(!body||typeof body.cardId!=='string'||!ids.has(body.cardId)||typeof body.grade!=='number'||![0,1,2].includes(body.grade)||typeof body.eventId!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(body.eventId))return Response.json({error:'无效的练习记录。'},{status:400});
 try{const db=env.DB;if(!db)throw Error('DB unavailable');const previous=await db.prepare('SELECT card_id AS cardId,level,due,attempts,wrong,updated FROM progress WHERE user_id=? AND card_id=?').bind(user,body.cardId).first<Progress>();
 const exists=await db.prepare('SELECT id FROM review_events WHERE id=? AND user_id=?').bind(body.eventId,user).first();
 if(exists)return Response.json({progress:previous});
 const p=schedule(previous||undefined,body.cardId,body.grade);
 await db.batch([
 db.prepare('INSERT INTO review_events(id,user_id,card_id,grade,at) VALUES(?,?,?,?,?)').bind(body.eventId,user,body.cardId,body.grade,p.updated),
 db.prepare('INSERT INTO progress(user_id,card_id,level,due,attempts,wrong,updated) VALUES(?,?,?,?,?,?,?) ON CONFLICT(user_id,card_id) DO UPDATE SET level=excluded.level,due=excluded.due,attempts=progress.attempts+1,wrong=excluded.wrong,updated=excluded.updated').bind(user,p.cardId,p.level,p.due,p.attempts,p.wrong,p.updated)
 ]);return Response.json({progress:p});
 }catch(e){console.error('review save failed',e);return Response.json({error:'本题还未保存，请点击重试。'},{status:503});}
}
