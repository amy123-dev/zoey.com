export type ReviewEvent = {id?:string; cardId?:string; at:number; grade:number};
export const localDay = (date:Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function reviewDays(events:ReviewEvent[], days:number, now=new Date()) {
 const rows=Array.from({length:days},(_,i)=>{const date=new Date(now.getFullYear(),now.getMonth(),now.getDate()-days+1+i);return {date:localDay(date),label:`${date.getMonth()+1}/${date.getDate()}`,total:0,correct:0};});
 const lookup=new Map(rows.map(row=>[row.date,row]));
 const seen=new Set<string>();
 for(const event of events){if(event.id&&seen.has(event.id))continue;if(event.id)seen.add(event.id);const row=lookup.get(localDay(new Date(event.at)));if(row){row.total++;if(event.grade>0)row.correct++;}}
 return rows;
}
