// Inclusive source-block ranges, reviewed against the lesson text. Every block
// remains reachable; layout metadata never removes or rewrites the source notes.
export type SourceBlock={id:string;text:string;lang:string;marked:boolean;heading:boolean;phrase:boolean;translation?:string;runs:{text:string;style:string}[]};
export type PhraseGroup={number:number;title:string;blocks:SourceBlock[]};
type Range=[number,number];
const supplements:Record<number,Range[]>={
 1:[[11,35],[44,61],[66,80]],2:[[10,19],[30,42],[51,59]],3:[[11,20],[35,44],[54,63]],
 4:[[17,30],[46,48],[59,60]],5:[[14,16],[19,19],[35,58]],6:[[12,20],[29,38],[47,50],[56,60]],
 7:[[7,8],[16,34],[47,51],[62,65]],8:[[9,19],[26,26],[29,37],[42,48],[53,58]],
 9:[[4,5],[14,14]],10:[[10,16],[23,30],[36,38],[41,42]],11:[[11,14],[18,29],[33,37]],12:[[24,25],[35,40]],
};
const phraseStarts:Record<number,number[]>={
 1:[11,18,22,27,32,44,48,52,58,66,71,76],2:[10,13,17,30,36,37,39,41,51,53,56],
 3:[11,17,35,39,54,59,62],4:[17,22,23,25,27,28,29,30,46,48,59],
 5:[14,16,19,35,37,39,43,45,47,49,51,53,54,55,57],6:[12,16,29,33,34,36,47,56],
 7:[7,8,16,25,26,32,33,47,49,50,62],8:[9,15,26,29,34,36,42,45,47,53,54],
 9:[4,5,14],10:[10,14,23,27,36,41],11:[11,18,22,27,33],12:[24,25,35],
 13:[24,31,38,46,52,54,60],14:[17,20,29,36,40,49,62,71,76,83],
 15:[17,24,29,35,43,54,63,72,82,90],16:[14,20,27,34,42,48,55,63,71,79,85,91],
 17:[15,29,36,42,49,56,62,68,71,75,82,88],18:[19,28,34,41,49],
 19:[16,30,42,58,75,85,94,103,116,124,136,145,158],
 20:[14,20,30,41,53,64,75,90,102,114,126,139,156,162,173,180,190],
 21:[13,31,44,61,78,95,114,130,147,165,182,199,216,233],
 22:[15,33,56,74,87,91,107,125,142,157,174,192,209,221,225,241,258],
};
const titles:Record<string,string>={
 '5:16':'fill me in','5:19':'DM · direct message','5:54':'have a whale of a time','6:33':'Mind if I…?','6:34':'make up your mind',
 '7:25':'lurk around the corner','7:32':'Get lost!','8:34':'work out','8:47':'throw in the towel','8:53':'at times · every now and then',
 '10:27':"put one's two cents in",'17:68':'tackle an intense workout','17:71':"take all one's energy",'17:82':'red-eye','20:156':'blow it',
 '1:22':'traffic jam · bumper-to-bumper','2:13':'Have a good day / night / one','2:36':'grab：更多用法',
 '3:39':'ghost · 玩消失','4:22':'thing：表达与用法','5:35':'时间表达概览','7:16':'ace sth · be an ace','7:47':'询问与提出建议','7:62':"Don't hesitate to…",
 '8:9':'out to get somebody','8:26':'表达观点：总述—展开—总结','8:36':'lift a finger to do something',
 '9:4':"What's up tonight? · 询问计划",'9:5':'Universal Studios · Disneyland','9:14':"I can't wait to…",
 '10:14':'Yikes!','10:41':'组织观点：连接表达','12:24':'Whole Foods · organic','12:25':'Indian food','12:35':'crave · craving',
 '15:54':'the bomb：太棒了','16:27':'grab a cab','16:79':'stay up till all hours of the night',
 '17:75':'be wired','19:58':'have a lead foot','20:173':'make-up / makeup：名词','20:180':'make up：动词短语',
};
export function phraseTitle(text:string){return text.replace(/^[^A-Za-z\u4e00-\u9fff]+/u,'').replace(/^\d+[.、]\s*/,'').replace(/^地道表达\s*[:：]?\s*/,'').split(/\s+(?:n\.|v\.|adj\.|exp\.|wxp\.|interj\.)|[:：]|\(/)[0].trim().slice(0,85)||'补充表达';}
export function organizeLesson(lesson:{id:number;blocks:SourceBlock[]}){
 const {id,blocks}=lesson;
 const ranges=id<=12?(supplements[id]||[]):[[phraseStarts[id][0]-1,blocks.length-1] as Range];
 const isSupplement=(i:number)=>ranges.some(([a,b])=>i>=a&&i<=b);
 const groups:PhraseGroup[]=[];
 for(const [a,b] of ranges){
  const starts=[a,...(phraseStarts[id]||[]).filter(i=>i>a&&i<=b)].filter((v,i,all)=>!i||all[i-1]!==v);
  for(let j=0;j<starts.length;j++){
   const start=starts[j],part=blocks.slice(start,Math.min(b+1,starts[j+1]??b+1));
   if(!part.some(x=>/[\p{L}\p{N}]/u.test(x.text)))continue;
   const first=part.find(x=>/[\p{L}\p{N}]/u.test(x.text))!;
   groups.push({number:groups.length+1,title:titles[`${id}:${start}`]||phraseTitle(first.text),blocks:part});
  }
 }
 const segments:{blocks:SourceBlock[];supplements:PhraseGroup[]}[]=[];
 let active:SourceBlock[]=[];
 for(let i=0;i<blocks.length;i++){
  if(!isSupplement(i)){active.push(blocks[i]);continue;}
  const range=ranges.find(([a])=>a===i);
  if(range){const attached=groups.filter(g=>g.blocks.some(b=>blocks.slice(range[0],range[1]+1).includes(b)));segments.push({blocks:active,supplements:attached});active=[];i=range[1];}
 }
 if(active.length)segments.push({blocks:active,supplements:[]});
 // Expressions introduced inside the dialogue also belong in the numbered index.
 const inline:Record<number,[number,string][]>= {
  13:[[1,'attend a party'],[6,"I don't get why…"],[8,'a blast'],[10,"can't stand"],[14,"what's up with…"]],
  14:[[5,'Talk about…!']],15:[[11,"I'll say!"]],
  17:[[9,'frequent flyer']],18:[[4,'go Dutch · lunch is on me'],[5,'split the bill'],[13,'eyes are bigger than your stomach']],
  19:[[6,'a step up from…']],
 };
 for(const [i,title] of inline[id]||[])groups.push({number:groups.length+1,title,blocks:[blocks[i]]});
 return {groups,segments,dialogueEnd:id>=13?phraseStarts[id][0]-1:0};
}
