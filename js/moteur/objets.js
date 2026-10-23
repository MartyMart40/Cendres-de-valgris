'use strict';
let itemId=1;
function refreshName(it){const t=TYPES[it.type];it.base=t.names[tierOf(it)];
  it.name=it.rar===3?it.name:it.rar===2?it.rname:it.rar===1?`${it.base} ${it.suf||''}`.trim():it.base;return it;}
// legd : légendaire imposé (butin de boss), qui fixe la rareté et le type
function genItem(L,minR,mf,forceType,legd){
  L=Math.max(1,Math.round(L));mf=mf||0;
  let rar;const r=Math.random()*100,k=1+mf/100;
  const leg=.5*k,rare=10*k,mag=38*k;
  rar=r<leg?3:r<leg+rare?2:r<leg+rare+mag?1:0;if(minR)rar=Math.max(rar,minR);
  let type;if(legd){rar=3;forceType=legd.type;}else legd=null;
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
  capItem(it);return refreshName(it);
}
/* Bornes : ramène chaque bonus à la borne de son type (AFX[k].max) et les valeurs de base à celles du type d’objet.
   Rend le nombre de valeurs corrigées (0 pour un objet normal). Un bonus inconnu ou illisible est retiré. */
function capItem(it){if(!it||!it.aff)return 0;let n=0;const L=Math.max(1,it.ilvl||1),t=TYPES[it.type],g=G(L);
  for(const k in it.aff){const A=AFX[k],v=it.aff[k];if(!A||typeof v!=='number'||!isFinite(v)){delete it.aff[k];n++;continue;}
    const m=A.max(L);if(v>m){it.aff[k]=m;n++;}}
  if(t&&it.d&&t.d)for(let i=0;i<2;i++){const m=Math.max(i+1,Math.ceil(t.d[i]*g*MARGE));if(!(it.d[i]<=m)){it.d[i]=m;n++;}}
  if(t&&it.a){const m=Math.max(1,Math.ceil((t.a||0)*g*MARGE));if(!(it.a<=m)){it.a=m;n++;}}
  if(it.block&&!(it.block<=(t&&t.block||0))){it.block=t&&t.block||0;n++;}
  return n;}
const OLDBASE={'Dague':'dagger','Épée':'sword','Masse':'mace','Hache':'axe','Bâton':'staff','Bouclier':'shield','Orbe':'orb'};
function normItem(it){if(!it)return it;if(!it.type){it.type=OLDBASE[it.base]||({weapon:'sword',offhand:'shield',ring:'ring'}[it.slot])||it.slot;
    if(!TYPES[it.type])it.type='ring';it.slot=TYPES[it.type].slot;
    if(it.rar===1&&!it.suf){const k=Object.keys(it.aff).find(a=>AFX[a]&&it.name&&it.name.includes(AFX[a].s));it.suf=k?AFX[k].s:'';}
    if(it.rar===2&&!it.rname)it.rname=it.name;refreshName(it);}return it;}
function itemLines(it){const l=[];if(it.rar>=2)l.push(it.base);if(it.boss)l.push(bossLine(it));if(it.d)l.push(`Dégâts : ${fmt(it.d[0])} à ${fmt(it.d[1])}`);if(it.a)l.push(`Armure : ${fmt(it.a)}`);if(it.block)l.push(`Blocage : ${it.block} %`);if(it.pot)l.push(`Fioles : +${it.pot} %`);
  for(const k in it.aff)l.push(AFX[k].t(it.aff[k]));if(it.power)l.push('★ '+it.power);return l;}

/* ---------- Butin propre à chaque boss (catalogue BOSSLOOT) ---------- */
function bossLootOf(id){return BOSSLOOT.find(b=>b.boss===id)||null;}
// Nom du boss dans le thème où l’objet est tombé (le monde 2 renomme les boss)
function bossNameIn(id,th){const mon=(BOSSES[id]&&BOSSES[id].mon)||id,sk=((THEMES[th]||{}).skins||{})[mon];return(sk&&sk.n)||(MT[mon]&&MT[mon].n)||id;}
function bossLine(it){const n=bossNameIn(it.boss,it.bth);return'Butin '+(/^Le /.test(n)?'du '+n.slice(3):/^La /.test(n)?'de la '+n.slice(3):/^L’/.test(n)?'de l’'+n.slice(2):'de '+n);}
function genBossItem(id,L,th){const B=bossLootOf(id);if(!B)return null;th=th||curWorld().theme;
  const it=genItem(L,3,0,null,{id:B.id,type:B.type,n:B.n[th]||B.n.cendres,p:B.p});
  const t=TYPES[B.type],base={move:t.move,critDmg:t.cd,crit:t.crit,spell:t.spell,mana:t.mana};
  for(const a of B.fix){const b0=base[a]||0;if((it.aff[a]||0)<=b0)it.aff[a]=b0+Math.round(AFX[a].f(it.ilvl)*LEGK);}
  it.boss=id;it.bth=th;capItem(it);return refreshName(it);}
// Une victoire sur un boss : son objet tombe-t-il ? La découverte d’objets aide un peu (au plus × 1,5) ; garanti au BOSS_PITY-ième essai.
function rollBossLoot(id){const B=bossLootOf(id);if(!B)return false;S.btry=S.btry||{};const n=(S.btry[id]||0)+1,k=Math.min(1.5,1+((p.st&&p.st.mf)||0)/400);
  if(n>=BOSS_PITY||Math.random()<B.ch*k){S.btry[id]=0;return true;}S.btry[id]=n;return false;}
