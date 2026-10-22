'use strict';
/* ---------- Sons ---------- */
let AC=null,sfxN=0,sfxT=0;
function audioInit(){try{if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C();}if(AC.state==='suspended')AC.resume();}catch(e){}}
function tone(f,d,type,vol,f2,delay){const t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(vol||.15,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02);}
function sfx(k){if(!AC||!p||p.mute)return;try{const now=AC.currentTime;if(now-sfxT>.1){sfxT=now;sfxN=0;}if(++sfxN>4&&(k==='hit'||k==='crit'))return;
  if(k==='hit')tone(140,.07,'square',.05,70);else if(k==='crit')tone(420,.12,'square',.07,140);else if(k==='hurt')tone(110,.15,'sawtooth',.08,55);
  else if(k==='cast')tone(300,.18,'sine',.06,900);else if(k==='boom')tone(90,.45,'sine',.25,30);else if(k==='gold')tone(1300,.06,'sine',.05,1700);
  else if(k==='lvl'){[523,659,784,1046].forEach((f,i)=>tone(f,.25,'triangle',.1,0,i*.09));}
  else if(k==='leg'){[392,494,587,784].forEach((f,i)=>tone(f,.9,'sine',.08,0,i*.04));}
  else if(k==='die')tone(220,1.1,'sawtooth',.1,40);else if(k==='portal')tone(200,.5,'sine',.08,600);}catch(e){}}

