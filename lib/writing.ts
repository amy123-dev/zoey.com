export function normalizeAnswer(value:string){return value.toLowerCase().replace(/[’ʼ]/g,"'").replace(/[—–-]/g,' ').replace(/[^a-z0-9'\s]/g,'').replace(/\s+/g,' ').trim();}
export function acceptedAnswers(value:string){return value.split(/\s\/\s/).map(normalizeAnswer);}
export function isCorrectAnswer(answer:string,reference:string){return !!normalizeAnswer(answer)&&acceptedAnswers(reference).includes(normalizeAnswer(answer));}
