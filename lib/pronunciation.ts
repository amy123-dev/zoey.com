import raw from './us-pronunciations.json';
const phones:Record<string,string>={AA:'ɑ',AE:'æ',AH:'ʌ',AO:'ɔ',AW:'aʊ',AY:'aɪ',B:'b',CH:'tʃ',D:'d',DH:'ð',EH:'ɛ',ER:'ɝ',EY:'eɪ',F:'f',G:'ɡ',HH:'h',IH:'ɪ',IY:'i',JH:'dʒ',K:'k',L:'l',M:'m',N:'n',NG:'ŋ',OW:'oʊ',OY:'ɔɪ',P:'p',R:'r',S:'s',SH:'ʃ',T:'t',TH:'θ',UH:'ʊ',UW:'u',V:'v',W:'w',Y:'j',Z:'z',ZH:'ʒ'};
const manual:Record<string,string>={pics:'pɪks',changsha:'ˈtʃɑŋˌʃɑ',wakey:'ˈweɪki',podcasts:'ˈpɑdˌkæsts',audiobooks:'ˈɔdiˌoʊˌbʊks',"cooking's":'ˈkʊkɪŋz',homie:'ˈhoʊmi',dawg:'dɔɡ',moolah:'ˈmulɑ',germophobia:'ˌdʒɝməˈfoʊbiə',glycation:'ɡlaɪˈkeɪʃən',simp:'sɪmp',frenemy:'ˈfrɛnəmi',smombie:'ˈsmɑmbi',perfect:'ˈpɝfɪkt',nervous:'ˈnɝvəs',permanent:'ˈpɝmənənt',herbal:'ˈɝbəl',professor:'prəˈfɛsɚ',appetizer:'ˈæpətaɪzɚ',lighter:'ˈlaɪtɚ',heater:'ˈhitɚ',one:'wʌn',money:'ˈmʌni',country:'ˈkʌntri',subway:'ˈsʌbweɪ',above:'əˈbʌv',study:'ˈstʌdi',suffer:'ˈsʌfɚ',today:'təˈdeɪ',tonight:'təˈnaɪt',tomorrow:'təˈmɑroʊ',leisure:'ˈliʒɚ'};
const onsets=new Set('P B T D K G F V TH DH S Z SH ZH HH M N L R W Y CH JH P_R B_R T_R D_R K_R G_R F_R TH_R SH_R P_L B_L K_L G_L F_L S_L S_P S_T S_K S_M S_N S_W T_W D_W K_W G_W S_P_R S_T_R S_K_R S_P_L S_K_W'.split(' '));
export function wordIPA(word:string){
 const key=word.toLowerCase().replace(/[’ʼ]/g,"'");if(manual[key])return manual[key];
 const arp=(raw as Record<string,string>)[key];if(!arp)return null;
 const parts=arp.split(' '),vowels=parts.map((x,i)=>/\d$/.test(x)?i:-1).filter(i=>i>=0),marks:Record<number,string>={};
 if(vowels.length>1)for(let v=0;v<vowels.length;v++){
  const at=vowels[v],stress=parts[at].slice(-1);if(stress==='0')continue;
  let start=v===0?0:at;
  if(v>0)for(let j=vowels[v-1]+1;j<at;j++)if(onsets.has(parts.slice(j,at).join('_'))){start=j;break;}
  marks[start]=stress==='1'?'ˈ':'ˌ';
 }
 return parts.map((x,i)=>(marks[i]||'')+(x==='AH0'?'ə':x==='ER0'?'ɚ':phones[x.replace(/\d/g,'')]||'')).join('');
}
export function sentenceIPA(text:string){return text.replace(/[’ʼ]/g,"'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)?.map(w=>wordIPA(w)||`[${w}]`).join(' ')||'';}
