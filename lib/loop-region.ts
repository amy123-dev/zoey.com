export function validLoop(a:number|null,b:number|null){return a!==null&&b!==null&&Number.isFinite(a)&&Number.isFinite(b)&&b-a>=.5;}
export function clampTime(time:number,duration:number){return Math.max(0,Math.min(Number.isFinite(duration)?duration:0,time));}
export function formatTime(time:number){if(!Number.isFinite(time)||time<0)return '0:00';const seconds=Math.floor(time);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;}
