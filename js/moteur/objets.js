'use strict';
let itemId=1;
function refreshName(it){const t=TYPES[it.type];it.base=t.names[tierOf(it)];
  it.name=it.rar===3?it.name:it.rar===2?it.rname:it.rar===1?`${it.base} ${it.suf||''}`.trim():it.base;return it;}
function genItem(L,minR,mf,forceType){
  L=Math.max(1,Math.round(L));mf=mf||0;
  let rar;const r=Math.random()*100,k=1+mf/100;
  const leg=.5*k,rare=10*k,mag=38*k;
  rar=r<leg?3:r<leg+rare?2:r<leg+rare+mag?1:0;if(minR)rar=Math.max(rar,minR);
  let legd=null,type;
  if(rar===3&&!forceType){legd=pick(LEGS);type=legd.type;}
  else if(forceType)type=forceType;
  else{const ws=Object.entries(SLOTW);let t=Math.random()*ws.reduce((a,b)=>a+b[1],0);type=pick(SLOTTYPES[ws.find(([,w])=>(t-=w)<0)[0]]);}
  const b=TYPES[type],slot=b.slot;
  if(rar===3&&!legd){legd=LEGS.find(l=>l.type===type);if(!legd)rar=2;}
  if((slot==='ring'||slot==='amulet')&&rar===0)rar=1;
  const g=G(L);const it={id:itemId++,type,slot,rar,ilvl:L,aff:{}};
  if(b.d){it.d=[Math.max(1,Math.round(b.d[0]*g)),Math.max(2,Math.round(b.d[1]*g))];it.spd=b.spd;if(b.crit)it.aff.crit=b.crit;if(b.cd)it.aff.critDmg=b.cd;}
  if(b.spell)it.aff.spell=b.spell;if(b.mana)it.aff.mana=b.mana;
  if(b.a)it.a=Math.max(1,Math.round(b.a*g));if(b.block)it.block=b.block;if(b.move)it.aff.move=b.move;
  const n=rar===0?0:rar===1?ri(1,2):rar===2?ri(3,5):ri(4,6);
  const pool=Object.keys(AFX).filter(a=>AFX[a].sl.includes(slot)&&(!AFX[a].rare||rar>=2));
  pool.sort(()=>Math.random()-.5);const keys=pool.slice(0,n);
  for(const a of keys){let v=AFX[a].f(L);if(rar===3&&a!=='allSk')v=Math.round(v*1.3);it.aff[a]=(it.aff[a]||0)+v;}
  if(rar===3){it.leg=legd.id;it.name=legd.n;it.power=legd.p;}
  if(rar===1)it.suf=AFX[keys[0]].s;if(rar===2)it.rname=`${pick(RARE_A)} ${pick(RARE_B)}`;
  it.val=Math.round((6+L*3)*(1+rar*1.6));
  return refreshName(it);
}
const OLDBASE={'Dague':'dagger','Épée':'sword','Masse':'mace','Hache':'axe','Bâton':'staff','Bouclier':'shield','Orbe':'orb'};
function normItem(it){if(!it)return it;if(!it.type){it.type=OLDBASE[it.base]||({weapon:'sword',offhand:'shield',ring:'ring'}[it.slot])||it.slot;
    if(!TYPES[it.type])it.type='ring';it.slot=TYPES[it.type].slot;
    if(it.rar===1&&!it.suf){const k=Object.keys(it.aff).find(a=>AFX[a]&&it.name&&it.name.includes(AFX[a].s));it.suf=k?AFX[k].s:'';}
    if(it.rar===2&&!it.rname)it.rname=it.name;refreshName(it);}return it;}
function itemLines(it){const l=[];if(it.rar>=2)l.push(it.base);if(it.d)l.push(`Dégâts : ${fmt(it.d[0])} à ${fmt(it.d[1])}`);if(it.a)l.push(`Armure : ${fmt(it.a)}`);if(it.block)l.push(`Blocage : ${it.block} %`);if(it.pot)l.push(`Fioles : +${it.pot} %`);
  for(const k in it.aff)l.push(AFX[k].t(it.aff[k]));if(it.power)l.push('★ '+it.power);return l;}

