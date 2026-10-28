'use strict';
/* ---------- Sons ---------- */
let AC=null,sfxN=0,sfxT=0;
/* v5.39 : ambiance sonore par monde. Un bourdon grave, un vent filtré, et de temps en temps un bruit du monde. Tout est synthétisé. */
const AMBIENT={
  cendres:{tones:[[55,'sine',.5],[82.4,'sine',.25]],wind:{type:'lowpass',f:420,g:.35},tick:{f:[180,90],type:'triangle',every:[7,14],d:.6}},
  givre:{tones:[[110,'triangle',.18],[164.8,'sine',.14]],wind:{type:'highpass',f:1400,g:.45},tick:{f:[1760,1320],type:'sine',every:[6,12],d:.9}},
  marais:{tones:[[49,'sine',.5],[73.4,'sine',.2]],wind:{type:'lowpass',f:260,g:.3},tick:{f:[220,140],type:'sine',every:[3,7],d:.25}},
  pre:{tones:[[73.4,'sine',.35],[77.8,'sine',.3]],wind:{type:'bandpass',f:700,g:.3},tick:{f:[520,380],type:'sawtooth',every:[9,16],d:1.2}},
  fonte:{tones:[[65.4,'sawtooth',.12],[98,'sine',.25]],wind:{type:'lowpass',f:600,g:.3},tick:{f:[1200,600],type:'square',every:[5,10],d:.35}},
  ossu:{tones:[[41.2,'sine',.45],[61.7,'sine',.22]],wind:{type:'bandpass',f:520,g:.32},tick:{f:[660,330],type:'sine',every:[7,13],d:2.4}},
  astre:{tones:[[110,'sine',.22],[164.8,'sine',.16],[220,'triangle',.05]],wind:{type:'highpass',f:2200,g:.2},tick:{f:[1568,2093],type:'sine',every:[4,9],d:1.6}},
  foret:{tones:[[98,'sine',.2],[146.8,'sine',.12]],wind:{type:'bandpass',f:900,g:.25},tick:{f:[2637,3136],type:'sine',every:[2,5],d:.12}},
  desert:{tones:[[61.7,'sine',.3],[92.5,'triangle',.08]],wind:{type:'bandpass',f:500,g:.4},tick:{f:[880,660],type:'triangle',every:[8,15],d:.8}},
  volcan:{tones:[[36.7,'sawtooth',.1],[55,'sine',.45]],wind:{type:'lowpass',f:220,g:.4},tick:{f:[140,70],type:'square',every:[3,8],d:.3}},
  abime:{tones:[[43.7,'sine',.45],[46.2,'sine',.3]],wind:{type:'lowpass',f:340,g:.35},tick:{f:[300,150],type:'sawtooth',every:[5,11],d:1.4}},
  town:{tones:[[110,'sine',.08]],wind:{type:'lowpass',f:900,g:.15},tick:{f:[2400,1800],type:'triangle',every:[2,5],d:.08}}};
let AMB=null,ambT=0;
function ambKey(){return S&&S.cur&&S.cur.id==='town'?'town':(S&&S.cur&&S.cur.palTheme)||THM&&curWorld().theme||'cendres';}
function ambStop(fade){if(!AMB||!AC)return;const t=AC.currentTime;try{AMB.g.gain.cancelScheduledValues(t);AMB.g.gain.setValueAtTime(AMB.g.gain.value,t);AMB.g.gain.linearRampToValueAtTime(0,t+(fade||1));const old=AMB;setTimeout(()=>{try{old.nodes.forEach(n=>n.stop&&n.stop());old.g.disconnect();}catch(e){}},(fade||1)*1000+100);}catch(e){}AMB=null;}
function ambStart(){if(!AC||!p||p.mute||p.amb===false)return;const key=ambKey(),A=AMBIENT[key]||AMBIENT.cendres;if(AMB&&AMB.key===key)return;ambStop(1.2);
  try{const t=AC.currentTime,g=AC.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05,t+2);g.connect(AC.destination);const nodes=[];
    for(const[fq,ty,v]of A.tones){const o=AC.createOscillator(),og=AC.createGain();o.type=ty;o.frequency.value=fq;og.gain.value=v;o.connect(og);og.connect(g);o.start();nodes.push(o);}
    const len=AC.sampleRate*2,buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);let last=0;for(let i=0;i<len;i++){last=(last+.02*(Math.random()*2-1))/1.02;d[i]=last*3.5;}
    const src=AC.createBufferSource();src.buffer=buf;src.loop=true;const fl=AC.createBiquadFilter();fl.type=A.wind.type;fl.frequency.value=A.wind.f;const wg=AC.createGain();wg.gain.value=A.wind.g;src.connect(fl);fl.connect(wg);wg.connect(g);src.start();nodes.push(src);
    AMB={key,g,nodes,A};ambT=rnd(A.tick.every[0],A.tick.every[1]);}catch(e){AMB=null;}}
function ambUpdate(dt){if(!AC)return;if(!p||p.mute||p.amb===false){if(AMB)ambStop(.5);return;}if(!AMB||AMB.key!==ambKey())ambStart();if(!AMB)return;
  ambT-=dt;if(ambT<=0){const T_=AMB.A.tick;ambT=rnd(T_.every[0],T_.every[1]);try{tone(T_.f[0],T_.d,T_.type,.025,T_.f[1]);}catch(e){}}}
function audioInit(){try{if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;AC=new C();}if(AC.state==='suspended')AC.resume();}catch(e){}}
function tone(f,d,type,vol,f2,delay){const t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(vol||.15,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02);}
/* v5.79 : bruits plus riches. Un bruit blanc filtré pour les chocs, les souffles et les explosions, avec une légère variation de hauteur. */
let NOISE=null;
function noise(d,type,f,v,f2,delay){if(!AC)return;if(!NOISE){NOISE=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const a=NOISE.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;}
  const t=AC.currentTime+(delay||0),src=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();src.buffer=NOISE;fl.type=type;fl.frequency.setValueAtTime(f,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+d);fl.Q.value=type==='bandpass'?1.2:.7;
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);src.connect(fl);fl.connect(g);g.connect(AC.destination);src.start(t,Math.random()*.5);src.stop(t+d+.05);}
function sfx(k){if(!AC||!p||p.mute)return;try{const now=AC.currentTime;if(now-sfxT>.1){sfxT=now;sfxN=0;}if(++sfxN>4&&(k==='hit'||k==='crit'||k==='mdie'))return;const vr=.9+Math.random()*.2;
  if(k==='hit'){noise(.08,'lowpass',900*vr,.09,200);tone(120*vr,.08,'triangle',.05,60);}
  else if(k==='crit'){noise(.12,'bandpass',2400*vr,.07,900);tone(880*vr,.25,'sine',.03,860);tone(1320*vr,.2,'sine',.02,1300);tone(150,.1,'square',.05,70);}
  else if(k==='hurt'){noise(.18,'lowpass',500,.12,120);tone(95*vr,.16,'sawtooth',.06,50);}
  else if(k==='mdie'){noise(.25,'bandpass',600*vr,.07,150);}
  else if(k==='cast'){noise(.22,'bandpass',500,.05,2600);tone(300*vr,.18,'sine',.04,900);}
  else if(k==='boom'){noise(.6,'lowpass',1200,.22,60);tone(70,.5,'sine',.25,28);}else if(k==='gold')tone(1300,.06,'sine',.05,1700);
  else if(k==='lvl'){[523,659,784,1046].forEach((f,i)=>tone(f,.25,'triangle',.1,0,i*.09));}
  else if(k==='leg'){[392,494,587,784].forEach((f,i)=>tone(f,.9,'sine',.08,0,i*.04));}
  else if(k==='die')tone(220,1.1,'sawtooth',.1,40);else if(k==='portal')tone(200,.5,'sine',.08,600);}catch(e){}}

