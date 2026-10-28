'use strict';
const $=s=>document.querySelector(s);
const cv=$('#c'),ctx=cv.getContext('2d');
const lc=document.createElement('canvas'),lctx=lc.getContext('2d');
const mm=$('#mini'),mctx=mm.getContext('2d');mm.style.cursor='pointer';mm.addEventListener('click',e=>{e.stopPropagation();if(typeof S!=='undefined'&&S&&S.cur&&!p.dead)bigMap();});
let W=0,H=0,DPR=1,Z=1;
const TW=64,TH=32,SAVE='cendres-valgris-v3',SAVE_V2='cendres-valgris-v2',SAVE_OLD='cendres-valgris-v1',GAME_VER='6.58';
function resize(){DPR=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=lc.width=Math.round(W*DPR);cv.height=lc.height=Math.round(H*DPR);cv.style.width=W+'px';cv.style.height=H+'px';Z=W<640?0.85:1;}
addEventListener('resize',resize);resize();addEventListener('resize',()=>{try{const g=document.getElementById('ground');if(g&&!g.classList.contains('hidden'))groundPos(g);}catch(e){}});

const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const DIR8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
/* Courbe de puissance commune aux monstres, aux objets et au héros */
function G(L){L=Math.max(1,L);return(1+.15*(L-1))*Math.pow(1.05,L-1);}
function fmt(n){n=Math.round(n);if(Math.abs(n)<10000)return String(n);const u=[['G',1e9],['M',1e6],['k',1e3]];for(const[s,v]of u)if(Math.abs(n)>=v){const x=n/v;return(x<100?x.toFixed(1):Math.round(x)).toString().replace('.',',')+' '+s;}return String(n);}

