'use strict';
/* ---------- Statistiques ---------- */
function newPlayer(){return{x:0,y:0,lvl:1,xp:0,hp:60,mp:30,gold:30,pot:4,scroll:2,bag:[],eq:{},sk:{fire:1,nova:1},pts:0,tv:2,bar:['fire','nova',null,null],
  path:null,target:null,targetObj:null,cd:0,swing:0,face:0,moving:false,hurt:0,tpCd:0,dead:false,cds:{},buff:0,spin:0};}
function starterGear(L){const eq={};
  eq.weapon=refreshName({id:itemId++,type:'sword',slot:'weapon',rar:0,ilvl:L,d:[Math.round(3*G(L)),Math.round(8*G(L))],spd:1,aff:{},val:6});
  eq.armor=refreshName({id:itemId++,type:'armor',slot:'armor',rar:0,ilvl:L,a:Math.round(12*G(L)),aff:{},val:6});return eq;}
function xpNext(l){return Math.floor(50*Math.pow(l,1.6));}
function computeStats(eq,lvl,sk){
  const s={dmg:[0,0],dmgPct:0,life:0,lifePct:0,armor:0,armorPct:0,aspd:0,crit:5,critDmg:50,leech:0,mana:0,manaReg:0,spell:0,move:0,mf:0,block:0,allSk:0,pot:0,legs:{},wspd:1};
  let wd=null;
  for(const sl of SLOTS){const it=eq[sl];if(!it)continue;
    if(it.d){wd=it.d;s.wspd=it.spd||1;}if(it.a)s.armor+=it.a;if(it.block)s.block+=it.block;if(it.pot)s.pot+=it.pot;if(it.leg)s.legs[it.leg]=1;
    for(const k in it.aff){if(k==='dmg'){s.dmg[0]+=it.aff[k];s.dmg[1]+=it.aff[k];}else s[k]=(s[k]||0)+it.aff[k];}}
  const sl=id=>{const b=sk[id]||0;return b?b+s.allSk:0;};
  if(!wd)wd=[Math.round(1*G(lvl)),Math.round(3*G(lvl))];
  s.dmg[0]+=wd[0];s.dmg[1]+=wd[1];
  s.dmgPct+=8*sl('mastery')+6*sl('fury');s.crit+=sl('mastery');s.armorPct+=12*sl('skin')+8*sl('bulwark')+5*sl('bastion');s.lifePct+=7*sl('vigor')+5*sl('bastion');s.leech+=sl('thirst');s.mana+=6*sl('mind');s.manaReg+=15*sl('mind');
  s.aspd+=4*sl('frenzy');s.spell+=8*sl('combust')+6*sl('lore');s.critDmg+=15*sl('combust');s.block+=2*sl('bulwark');s.regenHp=Math.min(6,.4*sl('regen'));
  s.exec=sl('execute')?40+10*(sl('execute')-1):0;s.thorns=sl('thorns')?60+12*(sl('thorns')-1):0;s.second=sl('second')?Math.max(25,150-6*(sl('second')-1)):0;
  if(s.legs.wander)s.move+=35;if(s.legs.aegis)s.block+=20;
  s.dmgPct+=lvl-1;s.lifePct+=lvl-1;
  s.maxHp=Math.round((50*G(lvl)+s.life)*(1+s.lifePct/100));
  s.maxMp=Math.round(30+lvl*3+s.mana);
  s.armorT=Math.round((s.armor+lvl*2)*(1+s.armorPct/100));
  s.aps=Math.min(6,1.5*s.wspd*(1+s.aspd/100));
  s.crit=Math.min(75,s.crit);s.block=Math.min(60,s.block);s.leech=Math.min(20,s.leech);
  s.move=Math.min(80,s.move);s.regen=(1.6+lvl*.06)*(1+s.manaReg/100);
  return s;
}
// Puissance estimée : sert à comparer les objets
function powerOf(s,lvl){const avg=(s.dmg[0]+s.dmg[1])/2*(1+s.dmgPct/100)*(1+s.crit/100*s.critDmg/100);const dps=avg*s.aps*(1+s.spell/250);
  const red=s.armorT/(s.armorT+30*G(lvl));const ehp=s.maxHp/(1-red)/(1-s.block/100)*(1+s.leech/40);return Math.sqrt(dps*ehp)*(1+s.mf/800)*(1+s.move/300)*(1+s.maxMp/3000)*(1+s.manaReg/2000);}
function recalc(){p.st=computeStats(p.eq,p.lvl,p.sk);p.maxHp=p.st.maxHp;p.maxMp=p.st.maxMp;p.hp=Math.min(p.hp,p.maxHp);p.mp=Math.min(p.mp,p.maxMp);}
function eqSlotFor(it){if(it.slot!=='ring')return it.slot;if(!p.eq.ring1)return'ring1';if(!p.eq.ring2)return'ring2';
  const a=powerOf(computeStats({...p.eq,ring1:it},p.lvl,p.sk),p.lvl),b=powerOf(computeStats({...p.eq,ring2:it},p.lvl,p.sk),p.lvl);return a>=b?'ring1':'ring2';}
function compareItem(it){const sl=eqSlotFor(it);const now=powerOf(p.st,p.lvl);const alt=powerOf(computeStats({...p.eq,[sl]:it},p.lvl,p.sk),p.lvl);const v=(alt/now-1)*100;return p.eq[sl]?v:Math.max(1,v);}
