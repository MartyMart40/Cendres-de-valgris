'use strict';
/* ---------- Forge ---------- */
function forgeCost(it){return Math.round(25+it.val*Math.sqrt(p.lvl-it.ilvl)*1.2*(it.rar===3?1.6:1));}
function forge(it){if(!it||it.ilvl>=p.lvl)return false;const c=forgeCost(it);if(p.gold<c){say('Pas assez d’or.');return false;}p.gold-=c;
  const k=G(p.lvl)/G(it.ilvl),up=v=>Math.max(1,Math.round(v*k));
  if(it.d)it.d=it.d.map(up);if(it.a)it.a=up(it.a);for(const a of['dmg','life','armor'])if(it.aff[a])it.aff[a]=up(it.aff[a]);if(it.aff.mana)it.aff.mana+=Math.floor((p.lvl-it.ilvl)/4);
  const t0=tierOf(it);it.ilvl=p.lvl;capItem(it);it.val=Math.round((6+it.ilvl*3)*(1+it.rar*1.6));refreshName(it);if(tierOf(it)>t0)toast('Nouvelle allure : '+TIERN[tierOf(it)]);recalc();sfx('lvl');burst(p.x,p.y,'#ffb050',24);return true;}

