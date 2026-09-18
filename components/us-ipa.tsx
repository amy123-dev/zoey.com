import {sentenceIPA} from '../lib/pronunciation';
export function USIPA({text}:{text:string}){return <p className="ipa" lang="en" title="美式词典读音；逐词标注，不代替连读、重音与语调。"><span>US</span> /{sentenceIPA(text)}/</p>;}
