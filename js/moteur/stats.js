'use strict';
/* ---------- Statistiques ---------- */
function newPlayer(){return{trophies:{},mats:{},cards:[],x:0,y:0,lvl:1,xp:0,hp:60,mp:30,gold:30,pot:4,scroll:2,bag:[],eq:{},sk:{fire:1,nova:1},pts:0,tv:2,bar:['fire','nova',null,null,null,null],
  path:null,target:null,targetObj:null,cd:0,swing:0,face:0,moving:false,hurt:0,tpCd:0,dead:false,cds:{},buff:0,spin:0};}
function starterGear(L){const eq={};
  eq.weapon=refreshName({id:itemId++,type:'sword',slot:'weapon',rar:0,ilvl:L,d:[Math.round(3*G(L)),Math.round(8*G(L))],spd:1,aff:{},val:6});
  eq.armor=refreshName({id:itemId++,type:'armor',slot:'armor',rar:0,ilvl:L,a:Math.round(12*G(L)),aff:{},val:6});return eq;}
/* v6.03 : courbe plus raide au début, et l’expérience suit l’écart de niveau avec le monstre. */
function xpNextOld(l){return Math.floor(50*Math.pow(l,1.6));}
function xpNext(l){return Math.floor(50*Math.pow(l,1.6)*XP_STEEP(l)*XPK.base);}
function xpNext603(l){return Math.floor(50*Math.pow(l,1.6)*(1+.45*clamp((25-l)/24,0,1)));}
const XPK={steep:.9,until:40,bonus:.1,base:1.4};
const XP_STEEP=l=>1+XPK.steep*clamp((XPK.until-l)/(XPK.until-1),0,1);
/* Monstre plus bas : moins d’expérience dès 2 niveaux d’écart. Monstre plus haut : un peu plus. */
function xpFactor(hl,ml){const d=hl-ml;if(d<=1)return 1+XPK.bonus*Math.min(5,Math.max(0,-d));return[.7,.45,.25,.12][d-2]??.05;}
/* v6.47 : quatre éléments. Les attaques de feu, de froid, de foudre et de poison passent par l’armure comme avant, puis par la résistance.
   Résistance : 75 % au plus ; chaque monde après le premier retire 8 % (40 % au plus). */
const EL={fire:{n:'Feu',c:'#ff8a3a',k:'rF',d:'au feu'},cold:{n:'Froid',c:'#9fd4ff',k:'rC',d:'au froid'},light:{n:'Foudre',c:'#f0e070',k:'rL',d:'à la foudre'},pois:{n:'Poison',c:'#9ad04a',k:'rP',d:'au poison'}};
const LEASH=16,RES_CAP=75,RES_P=[0,.3,.45,.6];
function resMalus(){let w=1,b=0;try{w=(S&&S.world)||1;b=(S&&S.br)||0;}catch(e){}/* v6.58 : chaque Brasier retire 5 % de résistances, 30 au plus */return Math.min(40,(w-1)*8)+Math.min(BR_RES_MAX,b*BR_RES);}
function resOf(el){return(p&&p.st&&EL[el]&&p.st[EL[el].k])||0;}
const MEL={givreux:'cold',loup:'cold',araignee:'pois',scorpion:'pois',gelee:'fire',geleeP:'fire',diablotin:'fire',ange:'light',arpenteur:'light'};
const BEL={ossira:'pois',korr:'fire',meliane:'cold',cineraire:'fire',forgeron:'fire',valgris:'fire',varsha:'fire'};
const THEL={cendres:'fire',givre:'cold',marais:'pois',pre:'light',fonte:'fire',ossu:'cold',astre:'light',foret:'pois',desert:'light',volcan:'fire',abime:'light'};
function zoneEl(z){const th=(z&&z.palTheme)||curWorld().theme;return THEL[th]||'fire';}
function monEl(m){if(!m||!m.t)return null;if(m.cx){if(m.cx.includes('braise'))return'fire';if(m.cx.includes('glace'))return'cold';if(m.cx.includes('foudre'))return'light';if(m.cx.includes('venin'))return'pois';}return MEL[m.t]||null;}
const HZEL={fire:'fire',fwall:'fire',ember:'fire',bomb:'fire',acid:'pois',ash:'fire',ice:'cold',shard:'cold'};
function hzEl(h){if(!h)return null;if(h.el!==undefined)return h.el;if(h.kind==='slam')return h.ice?'cold':h.star?'light':null;return HZEL[h.kind]||null;}
function prEl(pr){if(!pr)return null;if(pr.el!==undefined)return pr.el;if(pr.kind==='mbolt'||pr.kind==='bolt')return(pr.src&&(monEl(pr.src)||BEL[pr.src.t]))||zoneEl(S.cur);if(pr.kind==='webshot')return'pois';return null;}
function resPrice(){return 100+p.lvl*10;}
function computeStats(eq,lvl,sk){
  const s={dmg:[0,0],dmgPct:0,atk:0,life:0,lifePct:0,armor:0,armorPct:0,aspd:0,crit:5,critDmg:50,leech:0,mana:0,manaReg:0,spell:0,move:0,mf:0,block:0,allSk:0,pot:0,legs:{},wspd:1};
  let wd=null;
  for(const sl of SLOTS){const it=eq[sl];if(!it)continue;
    if(it.d){wd=it.d;s.wspd=it.spd||1;}if(it.a)s.armor+=it.a;if(it.block)s.block+=it.block;if(it.pot)s.pot+=it.pot;if(it.leg)s.legs[it.leg]=1;if(it.rel&&RELICS[it.rel])s.legs[it.rel]=1;
    for(const k in it.aff){if(k==='dmg'){s.dmg[0]+=it.aff[k];s.dmg[1]+=it.aff[k];}else s[k]=(s[k]||0)+it.aff[k];}}
  {const C=setCount(eq);for(const k in C){if(C[k]>=2)s.legs['set_'+k+'2']=1;if(C[k]>=4)s.legs['set_'+k+'4']=1;if(C[k]>=6)s.legs['set_'+k+'6']=1;}}
  /* v6.20 : pouvoirs gardés à l’Autel des empreintes */
  if(typeof p!=='undefined'&&p&&p.cube&&Array.isArray(p.cube.on))for(const k of p.cube.on)if(k)s.legs[k]=1;
  if(s.legs.set_veilleur6)s.lifePct+=40;
  if(s.legs.set_veilleur2)s.lifePct+=15;if(s.legs.set_penitent2)s.spell+=20;if(s.legs.set_meute2){s.aspd+=10;s.move+=10;}if(s.legs.set_heraut2)s.block+=15;if(s.legs.set_guetteur2)s.crit+=6;
  if(s.legs.u_trial)s.allSk+=1;const sl=id=>{const b=sk[id]||0;return b?effL(b+s.allSk):0;};
  if(!wd)wd=[Math.round(1*G(lvl)),Math.round(3*G(lvl))];
  else if(eq.weapon&&!clsWeaponOk(eq.weapon.type))wd=[Math.max(1,Math.round(wd[0]*.7)),Math.max(1,Math.round(wd[1]*.7))];
  s.dmg[0]+=wd[0];s.dmg[1]+=wd[1];
  s.atk+=10*sl('mastery')+8*sl('fury');s.crit+=sl('mastery');s.armorPct+=12*sl('skin')+8*sl('bulwark')+5*sl('bastion');s.lifePct+=7*sl('vigor')+5*sl('bastion');s.leech+=sl('thirst');s.mana+=6*sl('mind');s.manaReg+=15*sl('mind');
  s.aspd+=4*sl('frenzy');s.spell+=8*sl('combust')+6*sl('lore');s.critDmg+=15*sl('combust');s.block+=2*sl('bulwark');s.regenHp=Math.min(6,.4*sl('regen')+(s.legs.set_veilleur4?1:0))+(s.legs.set_veilleur6?2:0);
  {const bow=eq.weapon&&eq.weapon.type==='bow';if(bow){s.crit+=Math.min(20,2*sl('faucon'));s.atk+=6*sl('faucon');s.aspd+=Math.min(40,4*sl('mainsure'));}s.atk+=6*sl('archinf');s.crit+=Math.min(15,sl('archinf')*.5);s.perfo=Math.min(60,6*sl('perfo'));}
  s.dodge=Math.min(30,sl('dodge'));s.crit+=2*sl('assassin');s.critDmg+=10*sl('assassin')+4*sl('shade');s.dmgPct+=2*sl('shade');s.venom=sl('venom')?20+4*(sl('venom')-1):0;
  /* v6.55 : nouveaux passifs */
  s.critDmg+=12*sl('brutal');s.carnage=Math.min(5,.5*sl('carnage'));s.resA=(s.resA||0)+3*sl('cuir');s.riposte=sl('riposte')?80+8*(sl('riposte')-1):0;s.spell+=4*sl('pyre');s.mana+=3*sl('pyre');s.kindle=Math.min(25,2*sl('kindle'));
  s.move+=Math.min(30,3*sl('fuyant'))+Math.min(25,2*sl('pistage'));s.atk+=3*sl('pistage');s.vital=10*sl('vital');if(eq.weapon&&eq.weapon.type==='bow')s.critDmg+=12*sl('concentr');
  s.exec=sl('execute')?40+10*(sl('execute')-1):0;s.thorns=sl('thorns')?60+12*(sl('thorns')-1):0;s.second=sl('second')?Math.max(25,150-6*(sl('second')-1)):0;
  if(s.legs.wander)s.move+=35;if(s.legs.pelerin)s.move+=20;if(s.legs.aegis)s.block+=20;if(s.legs.u_ember)s.move+=20;if(s.legs.u_banner)s.block+=15;if(s.legs.u_trial){s.dmgPct+=25;}
  s.dmgPct+=lvl-1;s.lifePct+=lvl-1;
  s.maxHp=Math.round((50*G(lvl)+s.life)*(1+s.lifePct/100));
  s.maxMp=Math.round(30+lvl*3+s.mana);
  s.armorT=Math.round((s.armor+lvl*2)*(1+s.armorPct/100));
  s.aps=Math.min(6,1.5*s.wspd*(1+s.aspd/100));
  s.crit=Math.min(75,s.crit);s.block=Math.min(60,s.block);s.leech=Math.min(20,s.leech);
  {const M_=resMalus(),a_=s.resA||0;for(const [k_,r_] of [['resF','rF'],['resC','rC'],['resL','rL'],['resP','rP']])s[r_]=Math.max(-100,Math.min(RES_CAP,(s[k_]||0)+a_-M_));}
  s.move=Math.min(80,s.move);s.regen=(1.6+lvl*.06)*(1+s.manaReg/100);
  if(mut('lourd')){s.dmgPct+=25;s.maxHp=Math.max(1,Math.round(s.maxHp*.75));}
  if(s.legs.set_ombre2)s.dodge=Math.min(40,(s.dodge||0)+10);if(s.legs.set_glas2){s.regen*=1.25;s.maxMp=Math.round(s.maxMp*1.25);}
  {const c=typeof p!=='undefined'&&p&&p.cls;if(c==='guerrier'){s.maxHp=Math.round(s.maxHp*1.3);s.armorT=Math.round(s.armorT*1.2);s.maxMp=Math.round(s.maxMp*.8);}
    else if(c==='mage'){s.maxMp=Math.round(s.maxMp*1.25);s.regen*=1.25;s.spell+=15;s.maxHp=Math.round(s.maxHp*.85);/* v6.37 : −15 % (au lieu de −25 %) */}
    else if(c==='archer'){s.move=Math.min(80,s.move+10);s.crit=Math.min(75,s.crit+5);s.maxHp=Math.round(s.maxHp*.9);}}
  return s;
}
// Puissance estimée : sert à comparer les objets
function powerOf(s,lvl){const avg=(s.dmg[0]+s.dmg[1])/2*(1+s.dmgPct/100)*(1+s.crit/100*s.critDmg/100);const dps=avg*s.aps*(1+s.spell/250);
  const red=s.armorT/(s.armorT+armorK(lvl));const rAvg=((s.rF||0)+(s.rC||0)+(s.rL||0)+(s.rP||0))/4;const ehp=s.maxHp/(1-red)/(1-s.block/100)*(1+s.leech/40)/(.65+.35*(1-rAvg/100));return Math.sqrt(dps*ehp)*(1+s.mf/800)*(1+s.move/300)*(1+s.maxMp/3000)*(1+s.manaReg/2000);}
function recalc(){p.st=computeStats(p.eq,p.lvl,p.sk);p.maxHp=p.st.maxHp;p.maxMp=p.st.maxMp;p.hp=Math.min(p.hp,p.maxHp);p.mp=Math.min(p.mp,p.maxMp);}
function eqSlotFor(it){if(it.slot!=='ring')return it.slot;if(!p.eq.ring1)return'ring1';if(!p.eq.ring2)return'ring2';
  const a=powerOf(computeStats({...p.eq,ring1:it},p.lvl,p.sk),p.lvl),b=powerOf(computeStats({...p.eq,ring2:it},p.lvl,p.sk),p.lvl);return a>=b?'ring1':'ring2';}
function compareItem(it){const sl=eqSlotFor(it);const now=powerOf(p.st,p.lvl);const alt=powerOf(computeStats({...p.eq,[sl]:it},p.lvl,p.sk),p.lvl);const v=(alt/now-1)*100;return p.eq[sl]?v:Math.max(1,v);}
