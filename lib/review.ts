export type Progress = {cardId:string;level:number;due:number;attempts:number;wrong:number;updated:number};
export const intervals=[0,1,3,7,14,30];
export function schedule(old:Progress|undefined,cardId:string,grade:number,now=Date.now()):Progress {
  const level=grade===0?0:Math.min(5,(old?.level||0)+(grade===2?1:0));
  return {cardId,level,due:now+(grade===0?600000:grade===1?86400000:intervals[level]*86400000),attempts:(old?.attempts||0)+1,wrong:grade===0?1:grade===1?(old?.wrong||0):0,updated:now};
}
export function shuffle<T>(items:T[]):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
