export type SpeechRule={pattern:RegExp;spoken:string;ipa:string;kind:string;note:string;lesson:number};
export const speechRules:SpeechRule[]=[
 {pattern:/\bget a\b/gi,spoken:'get‿a',ipa:'ɡɛɾ‿ə',kind:'连读＋可选闪音',note:'get 的末尾 /t/ 衔接 a 的 /ə/；在不重读 a 的美式语流中，/t/ 常轻触为 [ɾ]。先连起来，再缩短 a。',lesson:9},
 {pattern:/\bwhat a\b/gi,spoken:'what‿a',ipa:'wʌɾ‿ə',kind:'连读＋可选闪音',note:'what 和 a 连成一个节奏组，a 不独立重读；[ɾ] 是舌尖快速轻触，不是刻意读成 /d/。',lesson:9},
 {pattern:/\bat us\b/gi,spoken:'at‿us',ipa:'əɾ‿əs',kind:'弱读＋闪音＋连读',note:'两个词都不强调时，可使用弱元音并让 /t/ 轻触；如果强调 US，则 us 的元音恢复为 /ʌ/。',lesson:9},
 {pattern:/\bcut in\b/gi,spoken:'cut‿in',ipa:'kʌɾ‿ɪn',kind:'辅音接元音',note:'cut 的词尾直接接 in 的元音，中间不插停顿；这里给出非重读 in 时的一种美式闪音读法。',lesson:9},
 {pattern:/\bwalked in\b/gi,spoken:'walked‿in',ipa:'wɔkt‿ɪn',kind:'连读',note:'walked 的 -ed 在 /k/ 后读 /t/，随后连接 in；不要把 -ed 单独读成一个音节。此处不把 /kt/ 简单改成闪音。',lesson:11},
 {pattern:/\bstand her\b/gi,spoken:"stand 'er",ipa:'stænd‿ɚ',kind:'弱读 h 省略＋连读',note:'her 非重读时 /h/ 可省略，留下卷舌弱元音 [ɚ]，与前面的 stand 相连；强调 HER 时恢复 /h/。',lesson:20},
 {pattern:/\bwith his\b/gi,spoken:"with 'is",ipa:'wɪð‿ɪz',kind:'弱读 h 省略＋连读',note:'非重读 his 的 /h/ 可省略，/ð/ 直接接 /ɪ/；不要因拼写出现 th 就把它误读为 /s/。',lesson:20},
 {pattern:/\blook at\b/gi,spoken:'look‿at',ipa:'lʊk‿ət',kind:'连读＋弱读',note:'look 的 /k/ 直接释放到 at 的弱元音 [ə]；重点通常放在后面的观察对象上。',lesson:11},
 {pattern:/\ban idea\b/gi,spoken:'an‿idea',ipa:'ən‿aɪˈdiə',kind:'连读＋重音',note:'an 的 /n/ 接 idea 的起始元音，idea 的重音在 /di/；冠词 an 轻短，重音不平均分给每个音节。',lesson:4},
 {pattern:/\bit'll\b/gi,spoken:"it'll",ipa:'ˈɪɾəl',kind:'缩约形式＋闪音',note:'it will 的缩约形式；自然美音中 /t/ 常闪化，末尾 /l/ 要保留，不是只读 it。',lesson:9},
 {pattern:/\blittle\b/gi,spoken:'liddle',ipa:'ˈlɪɾəl',kind:'闪音',note:'美式 /t/ 可轻触为 [ɾ]，末尾还保留 /l/；不能把 liddle 的 d 当作完整的 /d/ 来重读。',lesson:9},
 {pattern:/\byou're(?=\s+[A-Za-z])/gi,spoken:"yer",ipa:'jɚ',kind:'虚词弱读',note:'you’re 与 your 在非重读位置可能同音；语法仍然不同。',lesson:4},
 {pattern:/\bbecause\b/gi,spoken:"'cuz",ipa:'kəz',kind:'口语缩短',note:'随意口语中的缩短形式；也可以完整读出 because。',lesson:4},
 {pattern:/\bwas(?=\s+[A-Za-z])/gi,spoken:"w'z",ipa:'wəz',kind:'虚词弱读',note:'不强调的 was 常使用弱元音；并非把字母 a 一律删掉。',lesson:4},
 {pattern:/\bthem(?=\s+[A-Za-z])/gi,spoken:"'em",ipa:'əm',kind:'代词弱读',note:'them 的弱化涉及 /ð/，不是 h 脱落；只在合适的非重读语境使用。',lesson:17},
 {pattern:/\bdid you\b/gi,spoken:"didja",ipa:'dɪdʒə',kind:'同化＋弱读',note:'/d/ 与 /j/ 可合并为 [dʒ]；非重读 you 可弱化。',lesson:15},
 {pattern:/\bwould you\b/gi,spoken:'wouldja',ipa:'wʊdʒə',kind:'同化＋弱读',note:'[dʒ] 是破擦音，不是音标 /j/。',lesson:15},
 {pattern:/\bcould you\b/gi,spoken:'couldja',ipa:'kʊdʒə',kind:'同化＋弱读',note:'保留请求语气，不需要把每个词都重读。',lesson:15},
 {pattern:/\bwhat you\b/gi,spoken:'whatcha',ipa:'wʌtʃə',kind:'同化',note:'/t/ 与 /j/ 可合并为 [tʃ]。',lesson:15},
 {pattern:/\blet you\b/gi,spoken:'letcha',ipa:'lɛtʃə',kind:'同化',note:'词边界的 /t j/ 紧密结合。',lesson:15},
 {pattern:/\bdon't you\b/gi,spoken:"don'tcha",ipa:'doʊntʃə',kind:'同化',note:'自然对话中可出现 [tʃ]，清晰分开读也正确。',lesson:15},
 {pattern:/\babout you\b/gi,spoken:'aboutcha',ipa:'əˈbaʊtʃə',kind:'同化',note:'只改变边界发音，不改变 about you 的语法。',lesson:15},
 {pattern:/\babout your\b/gi,spoken:'aboutcher',ipa:'əˈbaʊtʃɚ',kind:'同化＋弱读',note:'your 不强调时可读 [jɚ]；与前面的 /t/ 结合。',lesson:15},
 {pattern:/\bgoing to(?=\s+(?:be|go|have|need|get|do|make|call|take|clean|paint|want|pass|pig|punch|total|start|tell|eat|play|stay|see|help|leave|meet|try|work)\b)/gi,spoken:'gonna',ipa:'ˈɡənə',kind:'固定组合弱化',note:'这里表示将要做某事；going to the beach 这种去往地点的结构不能直接换成 gonna。',lesson:4},
 {pattern:/\bwant to\b/gi,spoken:'wanna',ipa:'ˈwɑnə',kind:'省音＋弱读',note:'非强调的 want to 可这样读；正式拼写仍为 want to。',lesson:9},
 {pattern:/\bwants to\b/gi,spoken:'wansta',ipa:'ˈwɑnstə',kind:'辅音简化',note:'第三人称单数保留 /s/。',lesson:9},
 {pattern:/\bhave to\b/gi,spoken:'hafta',ipa:'ˈhæftə',kind:'清化＋弱读',note:'表示不得不时，/v/ 常清化为 [f]，to 弱读。',lesson:16},
 {pattern:/\bhas to\b/gi,spoken:'hasta',ipa:'ˈhæstə',kind:'清化＋弱读',note:'has to 中 /z/ 常清化为 [s]。',lesson:13},
 {pattern:/\bsupposed to\b/gi,spoken:'supposta',ipa:'səˈpoʊstə',kind:'辅音简化＋弱读',note:'非重读音节缩短，末尾组合紧密衔接。',lesson:11},
 {pattern:/\bused to\b/gi,spoken:'usta',ipa:'ˈjustə',kind:'固定组合',note:'指过去的习惯时常如此发音。',lesson:13},
 {pattern:/\bshould have\b/gi,spoken:"should'a",ipa:'ˈʃʊdə',kind:'have 弱读',note:'have 可读 [əv]，更快时 /v/ 也可不明显；不是 should of。',lesson:20},
 {pattern:/\bcould have\b/gi,spoken:"could'a",ipa:'ˈkʊdə',kind:'have 弱读',note:'书面仍写 could have。',lesson:20},
 {pattern:/\bwould have\b/gi,spoken:"would'a",ipa:'ˈwʊdə',kind:'have 弱读',note:'书面仍写 would have。',lesson:20},
 {pattern:/\bmust have\b/gi,spoken:"must'a",ipa:'ˈmʌstə',kind:'辅音简化＋弱读',note:'这里是对过去的推测，have 不是“拥有”的重读动词。',lesson:20},
 {pattern:/\bdon't know\b/gi,spoken:'dunno',ipa:'dəˈnoʊ',kind:'高频组合弱化',note:'是一种随意口语读法，不是必须采用的标准拼写。',lesson:9},
 {pattern:/\bkind of\b/gi,spoken:'kinda',ipa:'ˈkaɪndə',kind:'of 弱化',note:'of 的 /v/ 可在快速语流中不明显。',lesson:4},
 {pattern:/\ba lot of\b/gi,spoken:'a lotta',ipa:'ə ˈlɑɾə',kind:'闪音＋弱读',note:'lot 的 /t/ 可闪化，of 可简化为 [ə]。',lesson:9},
 {pattern:/\bout of\b/gi,spoken:'outta',ipa:'ˈaʊɾə',kind:'闪音＋弱读',note:'快速口语中可出现 [ɾ] 与弱元音。',lesson:9},
 {pattern:/\bget in\b/gi,spoken:'get‿in',ipa:'ɡɛɾ‿ɪn',kind:'连读＋可选闪音',note:'词尾辅音衔接后面的元音；闪化取决于重音与语速。',lesson:9},
 {pattern:/\bput us up\b/gi,spoken:'put‿us‿up',ipa:'pʊɾ‿əs‿ʌp',kind:'连读＋弱读',note:'us 不强调时弱读，词边界连续衔接。',lesson:9},
 {pattern:/\btell him\b/gi,spoken:"tell 'im",ipa:'tɛl‿ɪm',kind:'弱读 h 省略',note:'him 不强调时可省略 /h/；强调 HIM 时恢复。',lesson:20},
 {pattern:/\bwith him\b/gi,spoken:"with 'im",ipa:'wɪð‿ɪm',kind:'弱读 h 省略',note:'非重读代词 /h/ 可省略。',lesson:20},
 {pattern:/\bto him\b/gi,spoken:"to 'im",ipa:'tə‿ɪm',kind:'弱读＋连读',note:'to 弱读为 [tə]，him 的 /h/ 可省略。',lesson:20},
 {pattern:/\bmeet him\b/gi,spoken:"meet 'im",ipa:'miɾ‿ɪm',kind:'h 省略＋闪音',note:'省略非重读 /h/ 后，/t/ 可进入适合闪化的环境。',lesson:20},
 {pattern:/\bpretty\b/gi,spoken:'preddy',ipa:'ˈprɪɾi',kind:'闪音',note:'preddy 对应 pretty，不是 very 的弱读。',lesson:9},
 {pattern:/\bwater\b/gi,spoken:'wader',ipa:'ˈwɔɾɚ',kind:'闪音',note:'[ɾ] 不是完整的 /d/；元音存在地区差异。',lesson:9},
 {pattern:/\bparty\b/gi,spoken:'pardy',ipa:'ˈpɑrɾi',kind:'闪音',note:'重读音节后的 /t/ 可实现为闪音。',lesson:9},
 {pattern:/\bparties\b/gi,spoken:'pardies',ipa:'ˈpɑrɾiz',kind:'闪音',note:'自然美音中 /t/ 可闪化，复数词尾保留 /z/。',lesson:9},
 {pattern:/\bbetter\b/gi,spoken:'bedder',ipa:'ˈbɛɾɚ',kind:'闪音',note:'快速触碰舌尖，不要把中间音刻意拖长。',lesson:9},
 {pattern:/\btwenty\b/gi,spoken:"twen'y",ipa:'ˈtwɛni',kind:'/nt/ 简化',note:'一种常见口语读法，清晰读出 /t/ 也正确。',lesson:9},
 {pattern:/\band(?=\s+[A-Za-z])/gi,spoken:"'n",ipa:'ən',kind:'虚词弱读',note:'不强调时可从 /ænd/ 弱化为 [ənd]、[ən]；并非所有语境都省略 /d/。',lesson:4},
 {pattern:/\bfor(?=\s+[A-Za-z])/gi,spoken:'fer',ipa:'fɚ',kind:'虚词弱读',note:'美式非重读 for 常使用卷舌弱元音。',lesson:5},
 {pattern:/\bto(?=\s+[A-Za-z])/gi,spoken:'ta',ipa:'tə',kind:'虚词弱读',note:'非重读 to 的常见形式；被强调时可恢复 /tu/。',lesson:11},
 {pattern:/\bsome(?=\s+[A-Za-z])/gi,spoken:"s'm",ipa:'səm',kind:'虚词弱读',note:'表示不定数量而不受强调时，元音可弱化。',lesson:4},
 {pattern:/\byour(?=\s+[A-Za-z])/gi,spoken:'yer',ipa:'jɚ',kind:'虚词弱读',note:'your 的非重读形式，与强调的 YOUR 区分。',lesson:4},
 {pattern:/\bfrom(?=\s+[A-Za-z])/gi,spoken:"fr'm",ipa:'frəm',kind:'虚词弱读',note:'元音弱化为 [ə]，不必强调介词。',lesson:4},
];
export function analyzeSpeech(text:string){
 let spoken=text;
 const changes:{before:string;after:string;ipa:string;kind:string;note:string;lesson:number;position:number}[]=[];
 // Analyze matches against the standard sentence; longer matches reserve their spans.
 const taken:{start:number;end:number}[]=[];
 const edits:{start:number;end:number;value:string}[]=[];
 for(const rule of speechRules){
  for(const m of text.matchAll(new RegExp(rule.pattern.source,rule.pattern.flags))){
   const start=m.index!,end=start+m[0].length;if(taken.some(t=>start<t.end&&end>t.start))continue;
   taken.push({start,end});edits.push({start,end,value:rule.spoken});
   if(!changes.some(c=>c.before.toLowerCase()===m[0].toLowerCase()))changes.push({before:m[0],after:rule.spoken,ipa:rule.ipa,kind:rule.kind,note:rule.note,lesson:rule.lesson,position:start});
  }
 }
 for(const e of edits.sort((a,b)=>b.start-a.start))spoken=spoken.slice(0,e.start)+e.value+spoken.slice(e.end);
 return {spoken,changes:changes.sort((a,b)=>a.position-b.position)};
}
