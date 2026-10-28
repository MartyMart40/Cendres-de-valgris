'use strict';
/* ---------- Mondes, actes et zones ---------- */
function THM(){return THEMES[curWorld().theme]||THEMES.cendres;}
function palOf(st){const zt=S&&S.cur&&S.cur.palTheme,P=(zt&&THEMES[zt]?THEMES[zt]:THM()).pal;return(P&&P[st])||DECORS[st];}
function npcF(id){const n=(THM().npcs||{})[id];return n?n.full:{autel:'Orvan, gardien de l’autel',lapid:'Mirelle la lapidaire',corvel:'Ancien Corvel',bram:'Bram le colporteur',eline:'Sœur Éline',hilde:'Hilde la forgeronne',demol:'Ossan le démolisseur',joueuse:'Ysolde la joueuse',recruit:'Gerd le recruteur'}[id];}
function npcS(id){const n=(THM().npcs||{})[id];return n?(n.short||n.full):'Corvel';}
function npcA(id){const n=(THM().npcs||{})[id];return n?`${n.a||''}<b>${n.full}</b>`:'l’<b>Ancien Corvel</b>';}
function fixN(t){return typeof t==='string'&&S&&THM().npcs?t.replace(/Corvel/g,npcS('corvel')):t;}
function skinOf(t){return((THM().skins)||{})[t]||{};}
function monN(t){return skinOf(t).n||MT[t].n;}
function bt(B,k){return skinOf(B.mon)[k]||B[k];}
function qt(k,d){if((k==='q5c2'||k==='q5end')&&S&&curWorld().theme0&&curWorld().theme!==curWorld().theme0){const w=S.world||1;if(w===1)return d;const o=ORDW[w]||'nouvelle';return k==='q5c2'?`« ${o[0].toUpperCase()+o.slice(1)} fois. Il ne tombe jamais pour de bon, hein ? »`:`Valgris s’est relevé une ${o} fois, plus immense encore. D’autres mondes t’attendent.`;}
  const v=(THM().qtext||{})[k];return v==null?d:typeof v==='function'?v():v;}
function curWorld(){return WORLDS[S&&S.world]||WORLDS[1];}
function zid(a,i,w){return`m${w||S.world||1}a${a}z${i}`;}
function parseZ(id){const m=/^m(\d+)a(\d+)z(\d+)$/.exec(id||'');return m?{w:+m[1],a:+m[2],i:+m[3]}:null;}
/* Tirage de l’acte : formes, noms et décors, une seule fois par partie (gardé dans la sauvegarde) */
function rollAct(w,a,seed){const W_=WORLDS[w],act=W_&&W_.acts[a-1];if(!act||act.hidden)return[];
  const R=rng((seed^(a*7919+w*104729))>>>0),th=THEMES[W_.theme],pk=arr=>arr[Math.floor(R()*arr.length)];
  const formes=[act.first?act.first.forme:pk(act.formes)];
  for(let i=1;i<act.count;i++){const left=act.formes.filter(f=>!formes.includes(f));let pool=(left.length?left:act.formes.filter(f=>f!=='arene')).filter(f=>f!==formes[i-1]);
    if(!pool.length)pool=act.formes.filter(f=>f!==formes[i-1]);formes.push(pk(pool));}
  const used=new Set(),out=[];let prevD=null;
  formes.forEach((f,i)=>{const bank=(th[act.bank||'names']||th.names)[f]||(f==='ouverte'&&OPEN_N[W_.theme])||[['Terres sans nom','les ']];let ni=i===0&&act.first&&act.first.name!=null?act.first.name:-1;
    if(ni<0){const free=bank.map((_,j)=>j).filter(j=>!used.has(f+j));ni=free.length?pk(free):pk(bank.map((_,j)=>j));}used.add(f+ni);
    const ds=Array.isArray(th.decor[f])?th.decor[f]:[th.decor[f]];const dd=ds.filter(d=>d!==prevD);const d=pk(dd.length?dd:ds);prevD=d;
    out.push({f,n:ni,d});});
  return out;}
const OPEN_N={cendres:[['Grande Lande des Cendres','la '],['Étendue de suie','l’'],['Plateau gris','le ']],givre:[['Grande Toundra','la '],['Plaine blanche sans fin','la '],['Champs de glace','les ']],
  marais:[['Grand Marais','le '],['Étendue de roseaux','l’'],['Plaine noyée','la ']],pre:[['Grand Pré blême','le '],['Herbages sans fin','les '],['Lande de nacre','la ']],
  fonte:[['Grande Cour de fonte','la '],['Esplanade d’airain','l’'],['Champs de laitier','les ']],ossu:[['Grand Cimetière','le '],['Champ des mille croix','le '],['Lande des Glas','la ']],
  astre:[['Grande Esplanade d’or','la '],['Plaine du Zénith','la '],['Champ des comètes','le ']],foret:[['Grande Forêt d’Ambreval','la '],['Futaie profonde','la '],['Bois sans fin','le ']],
  desert:[['Grand Erg','le '],['Mer de sable','la '],['Plaine de sel','la ']],volcan:[['Grandes Coulées','les '],['Plateau de basalte','le '],['Champs de feu','les ']],abime:[['Grande Plaine hurlante','la '],['Étendue rouge','l’'],['Terres des damnés','les ']]};
function placeAcolytes(lay,act,seed,a){if(!act.acolytes||!lay.length||lay.some(l=>l.aco))return lay;const R=rng((seed^(a*31337+911))>>>0);
  const idx=lay.map((_,i)=>i).filter(i=>i>0);for(let i=idx.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
  act.acolytes.forEach((b,k)=>{if(idx[k]!=null)lay[idx[k]].aco=b;});return lay;}
function actLayout(a){const k=(S.world||1)+'-'+a;S.layout=S.layout||{};if(!S.layout[k])S.layout[k]=rollAct(S.world||1,a,S.seed||1);
  const act=curWorld().acts[a-1];if(act)placeAcolytes(S.layout[k],act,S.seed||1,a);placeEvents(S.layout[k],S.world||1,a,S.seed||1);placeZoneMods(S.layout[k],S.world||1,a,S.seed||1);return S.layout[k];}
function acoCount(a){const act=curWorld().acts[(a||1)-1];return((act&&act.acolytes)||[]).filter(b=>S.aco&&S.aco[b]).length;}
function actOfMini(b){const i=curWorld().acts.findIndex(a=>(a.acolytes||[]).includes(b));return i+1;}
function acoZone(b){const a=actOfMini(b);if(a<1)return null;for(const id of actZones(a)){const d=zoneDef(id);if(d&&d.aco===b)return id;}return null;}
function actOpen(a){return a<=1||actBossDone(a-1);}
function poolFor(th,L){const b=(th.pools.find(p_=>L<=p_.upTo)||th.pools[th.pools.length-1]).m;return th.extra&&L>=(th.extraL||1)?b.concat(th.extra):b;}
/* v6.12 : actes plus longs (8 zones avant l’antre ; les parties déjà commencées gardent leurs 5 zones) et chemins de traverse.
   Chaque acte a 4 zones de côté, branchées sur le chemin principal : facultatives, mais payantes. */
function wpOf(n){if(n<=5)return[0,2,4];const o=[];for(let i=0;i<n;i+=2)o.push(i);if(!o.includes(n-1))o.push(n-1);return o;}
const SIDES={
  1:[{key:'deserteurs',n:'Bivouac des déserteurs',art:'le ',forme:'plaine',type:'chef',mon:'rodeur',chef:'Hargne, capitaine des déserteurs',reward:'ally',f:.15,
      intro:'Des déserteurs retiennent une archère. Abats leur capitaine et elle te suivra.',rd:'Une archère te suit (ou ton compagnon gagne de l’expérience).'},
    {key:'pierres',n:'Cercle des pierres levées',art:'le ',forme:'archipel',type:'stones',stone:'pierre',reward:'talent',f:.4,
      intro:'Quatre pierres dorment dans les îlots. Touche-les toutes ; chacune réveille ses gardiens.',rd:'+1 point de talent, pour toujours.'},
    {key:'crypte',n:'Crypte scellée',art:'la ',forme:'labyrinthe',type:'clear',reward:'orbs',f:.65,
      intro:'Une crypte pleine à craquer. Vide-la.',rd:'Des orbes de forge, dont un rare.'},
    {key:'chariot',n:'Ravin du chariot renversé',art:'le ',forme:'couloir',type:'relic',reward:'bag',f:.85,
      intro:'Un chariot de colporteur a versé au fond du ravin. Trouve sa malle, bien gardée.',rd:'Un sac de voyage : une rangée de plus dans ton sac.'}],
  2:[{key:'duelliste',n:'Camp du duelliste',art:'le ',forme:'archipel',type:'chef',mon:'brute',chef:'Orlan, duelliste sans visage',reward:'set',f:.15,
      intro:'Un duelliste attend sur le dernier îlot. Il ne parle pas.',rd:'Une pièce d’ensemble et des orbes.'},
    {key:'cloches',n:'Clocher muet',art:'le ',forme:'descente',type:'stones',stone:'cloche',reward:'talent',f:.4,
      intro:'Quatre cloches fêlées. Fais-les sonner ; chacune appelle ses morts.',rd:'+1 point de talent, pour toujours.'},
    {key:'charnier',n:'Charnier des pèlerins',art:'le ',forme:'plaine',type:'clear',reward:'legend',f:.65,
      intro:'Les pèlerins ne reposent pas. Vide le charnier.',rd:'Un objet légendaire.'},
    {key:'forge',n:'Forge abandonnée',art:'la ',forme:'labyrinthe',type:'relic',reward:'orbsRare',f:.85,
      intro:'Au fond de la forge, un coffre de forgeron. Ce qu’il garde vaut cher.',rd:'Des orbes rares (aube, serment, tumulte).'}]};
/* v6.27 : chemins de traverse propres à chaque monde (noms, histoires, chefs, pierres). Les cendres gardent ceux d’origine. */
const SIDE_TH={
 givre:{c:['loup','brute'],s:[['Cairn','Cairns'],['Cloche gelée','Cloches gelées']],t:[['Tanière des trappeurs fous','la ','Des trappeurs devenus fous gardent une chasseuse ligotée. Abats leur meneur et elle te suivra.','Grimm, roi des trappeurs'],['Cairns du Nord','les ','Quatre cairns sous la neige. Touche-les ; chacun réveille les gelés qui dorment dessous.'],['Glacière des morts','la ','Le village y rangeait ses morts en attendant le dégel. Ils n’ont pas attendu. Vide-la.'],['Traîneau dans la crevasse','le ','Un traîneau de marchand est tombé au fond de la crevasse. Sa malle est bien gardée.'],
   ['Duel sur le lac gelé','le ','Un homme de glace t’attend au milieu du lac. La glace craque sous ses pas.','Hjalm, le duelliste gelé'],['Clocher englouti','le ','Quatre cloches prises dans la glace. Fais-les sonner.'],['Champ des statues','le ','Des pèlerins gelés en prière. Certains bougent encore. Vide le champ.'],['Forge du Grand Froid','la ','Un forgeron forgeait la glace comme du fer. Son coffre est resté là.']]},
 marais:{c:['rodeur','brute'],s:[['Pieu','Pieux'],['Cloche noyée','Cloches noyées']],t:[['Repaire des pilleurs d’épaves','le ','Des pilleurs retiennent une passeuse. Abats leur chef et elle te suivra.','Vase-Noire, chef des pilleurs'],['Pieux des sorcières','les ','Quatre pieux plantés dans la tourbe. Arrache-les ; chacun libère ce qu’il retenait.'],['Crypte inondée','la ','L’eau a envahi la crypte et les morts flottent. Vide-la.'],['Barque échouée','la ','Une barque de contrebandiers a coulé dans les roseaux. Son coffre est gardé.'],
   ['Duel des saules','le ','Un noyé en armure t’attend sous les saules pleureurs.','Orme, le chevalier noyé'],['Clocher noyé','le ','Quatre cloches sous l’eau. Fais-les sonner ; chacune fait remonter un noyé.'],['Fosse aux fièvres','la ','On y jetait les malades. Ils ont gardé la fièvre. Vide la fosse.'],['Moulin pourri','le ','Le meunier cachait son or sous la meule. Elle est bien gardée.']]},
 pre:{c:['charognard','brute'],s:[['Corne plantée','Cornes plantées'],['Cloche du troupeau','Cloches du troupeau']],t:[['Camp des écorcheurs','le ','Des écorcheurs de licornes gardent une palefrenière. Abats leur chef et elle te suivra.','Sabre-Blanc, l’écorcheur'],['Cornes du pré','les ','Quatre cornes brisées plantées dans l’herbe pâle. Touche-les ; le troupeau répond.'],['Écurie des juments mortes','l’','L’écurie est pleine. Les juments ne dorment pas. Vide-la.'],['Carrosse renversé','le ','Un carrosse de noble a versé dans le fossé. Son coffre est gardé.'],
   ['Duel au manège','le ','Un cavalier sans tête tourne dans le manège. Il t’attend.','Le Cavalier sans visage'],['Cloches du troupeau','les ','Quatre cloches de bergers. Fais-les sonner ; le troupeau mort arrive.'],['Ossuaire des licornes','l’','Des os de licornes empilés jusqu’au toit. Ils se relèvent. Vide l’ossuaire.'],['Sellerie oubliée','la ','La sellerie du haras. Le coffre du maître écuyer y est resté.']]},
 fonte:{c:['automate','brute'],s:[['Soupape','Soupapes'],['Cloche de fonte','Cloches de fonte']],t:[['Atelier des fondeurs renégats','l’','Des fondeurs renégats gardent une mécanicienne. Abats leur contremaître et elle te suivra.','Rouille, le contremaître'],['Quatre soupapes','les ','La machine siffle. Ouvre les quatre soupapes ; chacune lâche des automates.'],['Salle des moules','la ','Les moules sont pleins de saints mal fondus. Ils bougent. Vide la salle.'],['Wagonnet déraillé','le ','Un wagonnet de minerai a déraillé au fond de la galerie. Son coffre est gardé.'],
   ['Duel de l’enclume','le ','Un automate duelliste frappe l’enclume en t’attendant.','Le Marteau-Juge'],['Cloches de fonte','les ','Quatre cloches qu’on n’a jamais sorties du moule. Fais-les sonner.'],['Cimetière des machines','le ','Des automates rouillés empilés. Ils se remontent tout seuls. Vide le cimetière.'],['Coffre du Premier Fondeur','le ','Le coffre du Premier Fondeur, au fond de sa forge. Bien gardé.']]},
 ossu:{c:['rodeur','brute'],s:[['Stèle','Stèles'],['Cloche','Cloches']],t:[['Cachot des moines fous','le ','Des moines fous gardent une sœur sonneuse. Abats leur prieur et elle te suivra.','Le prieur Malachie'],['Stèles des oubliés','les ','Quatre stèles sans nom. Touche-les ; les oubliés se relèvent.'],['Fosse des pénitents','la ','La fosse déborde de pénitents. Vide-la.'],['Reliquaire tombé','le ','Un reliquaire est tombé au fond des catacombes. Il est bien gardé.'],
   ['Duel du chœur','le ','Un sonneur de glas t’attend au milieu du chœur.','Le Sonneur sans repos'],['Clocher fêlé','le ','Quatre cloches fêlées. Fais-les sonner ; chacune appelle ses morts.'],['Charnier des moines','le ','Les moines ne reposent pas. Vide le charnier.'],['Trésor de la sacristie','le ','La sacristie garde le trésor de l’Ossuaire. Ce qu’il cache vaut cher.']]},
 astre:{c:['rodeur','brute'],s:[['Prisme','Prismes'],['Cloche céleste','Cloches célestes']],t:[['Observatoire des apostats','l’','Des astrologues apostats gardent une veilleuse. Abats leur maître et elle te suivra.','Le maître des sphères'],['Quatre prismes','les ','Quatre prismes éteints. Rallume-les ; chacun attire des échos d’étoile.'],['Archives scellées','les ','Les archives sont pleines de copistes morts qui écrivent encore. Vide-les.'],['Chariot d’or blanc','le ','Un chariot d’or blanc a versé dans un ravin de lumière. Son coffre est gardé.'],
   ['Duel du zénith','le ','Un champion de lumière t’attend sur la dernière passerelle.','Le Champion du Zénith'],['Cloches célestes','les ','Quatre cloches d’or. Fais-les sonner ; la lumière répond.'],['Fonderie des étoiles ratées','la ','Les étoiles ratées s’entassent et se réveillent. Vide la fonderie.'],['Coffre de l’Archiviste','le ','Le coffre de l’Archiviste, au fond de la tour. Bien gardé.']]},
 foret:{c:['sanglier','brute'],s:[['Pierre de mousse','Pierres de mousse'],['Cloche de bois','Cloches de bois']],t:[['Camp des braconniers','le ','Des braconniers retiennent une archère des futaies. Abats leur chef et elle te suivra.','Croc-de-Fer, chef des braconniers'],['Cercle de mousse','le ','Quatre pierres moussues dans les îlots. Touche-les ; la forêt se défend.'],['Terrier des ronces','le ','Le terrier grouille de bêtes. Vide-le.'],['Charrette du bûcheron','la ','La charrette du bûcheron a versé dans le ravin. Sa malle est gardée.'],
   ['Duel du vieux chêne','le ','Un chevalier d’écorce t’attend sous le vieux chêne.','Le Chevalier d’écorce'],['Cloches de bois','les ','Quatre cloches de bois pendues aux branches. Fais-les sonner.'],['Clairière des pendus','la ','Les pendus de la clairière ne restent pas pendus. Vide-la.'],['Cabane du sorcier','la ','La cabane du sorcier des bois. Son coffre vaut cher.']]},
 desert:{c:['scorpion','brute'],s:[['Obélisque','Obélisques'],['Gong','Gongs']],t:[['Camp des pillards','le ','Des pillards retiennent une guide des dunes. Abats leur chef et elle te suivra.','Khalid, chef des pillards'],['Quatre obélisques','les ','Quatre obélisques à moitié ensablés. Touche-les ; le sable se lève.'],['Tombe des scribes','la ','Les scribes embaumés se lèvent encore pour écrire. Vide la tombe.'],['Caravane ensablée','la ','Une caravane entière sous le sable. Son coffre de marchand est gardé.'],
   ['Duel de midi','le ','Un guerrier de verre t’attend sous le soleil de midi.','Le Guerrier de verre'],['Gongs du temple','les ','Quatre gongs de bronze. Fais-les sonner ; les gardiens répondent.'],['Nécropole des rois','la ','Les rois ensablés n’aiment pas les visiteurs. Vide la nécropole.'],['Trésor de l’oasis','le ','Sous l’oasis, un trésor de vizir. Bien gardé.']]},
 volcan:{c:['gelee','brute'],s:[['Évent','Évents'],['Cloche de basalte','Cloches de basalte']],t:[['Repaire des cracheurs de feu','le ','Des pyromanes gardent une forgeronne. Abats leur meneur et elle te suivra.','Fumerolle, le meneur'],['Quatre évents','les ','Quatre évents bouchés. Débouche-les ; chacun crache ses gelées.'],['Galerie de soufre','la ','La galerie grouille de bêtes de feu. Vide-la.'],['Chariot de minerai','le ','Un chariot de minerai a versé dans une coulée refroidie. Son coffre est gardé.'],
   ['Duel du cratère','le ','Un champion de lave t’attend au bord du cratère.','Le Champion de lave'],['Cloches de basalte','les ','Quatre cloches de pierre noire. Fais-les sonner.'],['Nid de dragonnets','le ','Les dragonnets ont pondu. Vide le nid avant l’éclosion.'],['Forge du Mont Ardent','la ','La forge sacrée du volcan. Son coffre vaut cher.']]},
 abime:{c:['molosse','brute'],s:[['Sceau','Sceaux'],['Cloche de fer','Cloches de fer']],t:[['Geôle des tourmenteurs','la ','Des tourmenteurs gardent une prisonnière. Abats leur bourreau et elle te suivra.','Le Bourreau aux chaînes'],['Quatre sceaux','les ','Quatre sceaux de fer. Brise-les ; chacun libère ce qu’il tenait.'],['Fosse aux damnés','la ','La fosse déborde de damnés. Vide-la.'],['Cage tombée','la ','Une cage de geôlier est tombée au fond du gouffre. Elle est bien gardée.'],
   ['Duel du pont de fer','le ','Un démon cornu t’attend au milieu du pont de fer.','Le Cornu du pont'],['Cloches de fer','les ','Quatre cloches de fer rouillé. Fais-les sonner.'],['Chenil abandonné','le ','Les molosses abandonnés ont faim. Vide le chenil.'],['Coffre du geôlier','le ','Le coffre du geôlier en chef. Ce qu’il garde vaut cher.']]}};
function sideOf(a,k,w){const base=(SIDES[a]||[])[k];if(!base)return null;const W_=WORLDS[w||(S&&S.world)||1],th=W_&&W_.theme,T_=SIDE_TH[th];if(!T_)return base;const t=T_.t[(a-1)*4+k];if(!t)return base;
  const o=Object.assign({},base,{n:t[0],art:t[1],intro:t[2]});if(base.type==='chef'){if(t[3])o.chef=t[3];const mn=T_.c[a-1];if(mn&&MT[mn])o.mon=mn;}if(base.type==='stones'){const sn=T_.s[a-1];if(sn){o.sn=sn[0];o.sp=sn[1];}}return o;}
function parseX(id){const m=/^m(\d+)a(\d+)x(\d+)$/.exec(id||'');return m?{w:+m[1],a:+m[2],k:+m[3]}:null;}
function xid(a,k,w){return`m${w||S.world||1}a${a}x${k}`;}
function sideParent(a,k,n){const L=SIDES[a]||[],used=[];for(let j=0;j<=k&&j<L.length;j++){let i=clamp(Math.round(L[j].f*(n-1)),0,n-1);while(used.includes(i)&&i<n-1)i++;while(used.includes(i)&&i>0)i--;used.push(i);}return used[k];}
function sidesOf(a,i){const L=SIDES[a]||[],n=actLayout(a).length,o=[];for(let k=0;k<L.length;k++)if(sideParent(a,k,n)===i)o.push(k);return o;}
function sideState(sid){return((S.q&&S.q.side)||{})[sid]||0;}
function sideDef(id){const kx=parseX(id);if(!kx)return null;const wd=WORLDS[kx.w],act=wd&&wd.acts[kx.a-1],sd=sideOf(kx.a,kx.k,kx.w);if(!act||!sd)return null;
  const th=THEMES[wd.theme],n=actLayout(kx.a).length,par=zid(kx.a,sideParent(kx.a,kx.k,n),kx.w),pd=zoneDef(par),lvl=(pd?pd.lvl:1)+1,F=FORMES[sd.forme];
  return{world:kx.w,act:kx.a,side:kx.k,sid:`a${kx.a}x${kx.k}`,sideq:sd,parent:par,name:sd.n,art:sd.art,forme:sd.forme,style:themeDecor(th,sd.forme),lvl,mons:poolFor(th,lvl),packs:Math.round((F.packs||12)*.85),size:F.size,w:F.w,h:F.h,mods:[],wp:false,last:false};}
function zoneDef(id){
  if(parseX(id))return sideDef(id);
  if(id==='town')return{name:THEMES[curWorld().theme].camp,lvl:0,style:'town'};
  if(id==='rift')return S.zones.rift?S.zones.rift.def:{name:'Faille'};
  if(id==='trial')return S.zones.trial?S.zones.trial.def:{name:'Épreuve'};
  const k=parseZ(id),wd=k&&WORLDS[k.w],act=wd&&wd.acts[k.a-1];if(!act||act.hidden)return null;
  const th=THEMES[wd.theme],lay=actLayout(k.a),base={world:k.w,act:k.a,idx:k.i};
  if(k.i===lay.length){const an=th.antre&&th.antre[k.a];return{...act.antre,...base,style:themeDecor(th,'antre'),last:true,lvl:act.antre.lvl+(wd.lvlAdd||0),...(an?{name:an[0],art:an[1]}:{})};}
  const L_=lay[k.i];if(!L_)return null;const F=FORMES[L_.f],nm=(((th[act.bank||'names']||th.names)[L_.f])||(OPEN_N[wd.theme]&&L_.f==='ouverte'?OPEN_N[wd.theme]:null)||[['Terres sans nom','les ']])[L_.n]||['Terres sans nom','les '];
  const lvl=Math.round(act.lvl[0]+(act.lvl[1]-act.lvl[0])*k.i/Math.max(1,lay.length-1))+(wd.lvlAdd||0);
  const zm=(L_.zm||[]).concat(L_.evv==='nuit'&&!(L_.zm||[]).includes('nuit')?['nuit']:[]),big=zm.includes('vaste')?1.3:1;
  return{...base,name:nm[0],art:nm[1],forme:L_.f,style:L_.d,lvl,mons:poolFor(th,lvl),packs:Math.round(F.packs*(zm.includes('dense')?1.5:1)),size:F.size&&Math.round(F.size*big),w:F.w&&Math.round(F.w*big),h:F.h,waves:F.waves,mods:zm,
    wp:wpOf(lay.length).includes(k.i),relic:act.relic&&act.relic.zone===k.i?act.relic.q:false,aco:L_.aco||null,ev:L_.ev||null,evv:L_.evv||null,last:false};}
/* « la Crypte oubliée », « les Champs calcinés »… */
function zoneIn(id){const d=zoneDef(id);return d?(d.art||'')+d.name:'';}
function zoneDe(id){const d=zoneDef(id);if(!d)return'';const a=d.art||'';return(a==='le '?'du ':a==='les '?'des ':'de '+a)+d.name;}
/* Antre d’un acte : une fois le boss de l’acte vaincu, une sortie mène à l’acte suivant */
function nextActExit(z){const k=parseZ(z.id);if(!k||!z.def.last||!z.distE)return;const nx=curWorld().acts[k.a];if(!nx||nx.hidden||!actBossDone(k.a))return;
  const to=zid(k.a+1,0);if(z.objs.some(o=>o.type==='exit'&&o.to===to))return;let far=0;for(let i=0;i<z.distE.length;i++)if(z.distE[i]>z.distE[far])far=i;
  const o={type:'exit',x:far%z.w+.5,y:((far/z.w)|0)+.5,to,label:'Vers : '+zoneName(to)};o.arr=arrival(z,Math.floor(o.x),Math.floor(o.y));z.objs.push(o);}
function sealOf(id){const d=parseZ(id)&&zoneDef(id);if(!d||!d.seal)return null;return S.q[d.seal.q]&&S.q[d.seal.q].s>=d.seal.s?null:d.seal;}
function actZones(a){const act=curWorld().acts[a-1];if(!act||act.hidden)return[];const n=actLayout(a).length;return Array.from({length:n+1},(_,i)=>zid(a,i));}
function lastZone(a){a=a||1;return zid(a,actLayout(a).length-1);}
function acoNeed(a){return curWorld().acts[(a||1)-1].need||2;}
/* Liste des acolytes pour Corvel : vaincu ou non, et la zone où il rôde */
function acoList(a){return curWorld().acts[(a||1)-1].acolytes.map(b=>`${S.aco&&S.aco[b]?'✓':'·'} ${monN(BOSSES[b].mon)} : ${zoneIn(acoZone(b))}`).join('<br>');}

/* v5.14 : événements de zone. Environ une zone sur deux en a un, tiré avec la graine de la partie.
   w : poids (commun 1, peu commun .5, rare .2, très rare .05). Jamais le même deux zones de suite, jamais dans la première zone ni dans une arène. */
const EVENTS={
  ambush:{n:'Embuscade',w:1,d:'Un passage calme, puis les monstres surgissent du sol. Des ronces de cendre ferment le cercle jusqu’à la fin.'},
  relic:{n:'Reliquaire',w:.5,d:'Un reliquaire s’éveille au toucher. Défends-le 60 secondes : butin garanti et +30 % de butin dans la zone.'},
  nests:{n:'Nids de cendre',w:1,d:'Trois nids pondent des bêtes tant qu’ils tiennent debout. Fonce les détruire.'},
  cchest:{n:'Coffre maudit',w:.5,d:'L’ouvrir libère des champions, mais son butin est bien meilleur.'},
  rain:{n:'Pluie de braises',w:.5,d:'Pendant 30 secondes, des braises tombent sur tout le monde. Attire les monstres dessous.'},
  altar:{n:'Autel du pacte',w:.2,d:'Un marché : +50 % de vie aux monstres de la zone contre +50 % de butin.'},
  traveler:{n:'Voyageur assiégé',w:.5,d:'Un voyageur se fait attaquer. Sauvé, il te vend une fois un objet qu’on ne trouve nulle part ailleurs.'},
  invasion:{n:'Portail d’invasion',w:.15,d:'Une brèche s’ouvre vers un autre monde. Détruis-la en 40 s, sinon la zone se transforme : monstres plus durs, meilleur butin.'},
  well:{n:'Puits des murmures',w:.5,d:'Un vieux puits. On peut y boire. Parfois l’eau soigne, parfois quelque chose remonte.'},
  peddler:{n:'Colporteur égaré',w:.4,d:'Un marchand perdu au milieu des monstres. Trois objets, assez chers, dont un rare.'},
  gibbet:{n:'Gibet',w:.4,d:'Trois pendus. Quand tu t’approches, ils tombent de la corde et se relèvent. Leur butin est bon.'},
  shrine:{n:'Chapelle profanée',w:.4,d:'Trois cierges, trois prières. Une seule sera entendue, pour toute la zone.'},
  cage:{n:'Cage du geôlier',w:.4,d:'Un prisonnier dans une cage, gardé par des champions. Libéré, il t’offre ce qu’il a caché.'},
  grave:{n:'Tombe fraîche',w:.4,d:'La terre est encore molle. Creuser rapporte souvent quelque chose. Pas toujours de bon.'},
  shrooms:{n:'Clairière farfelue',w:.03,d:'Des champignons qui rigolent. Personne ne sait d’où ils viennent. Valgris jure que ce n’est pas lui.'}
};
function placeEvents(lay,w,a,seed){if(!lay.length||lay.every(l=>'ev' in l))return;let prev=null;
  lay.forEach((l,i)=>{if(!('ev' in l)){const R=rng((seed^(w*7919+a*131+i*977+4242))>>>0);let ev=null;
      if(!(a===1&&i===0)&&l.f!=='arene'&&R()<.5){const th_=WORLDS[w]&&WORLDS[w].theme,ks=Object.keys(EVENTS).filter(k=>k!==prev&&(!EVENTS[k].th||EVENTS[k].th===th_));const tot=ks.reduce((t,k)=>t+EVENTS[k].w,0);let r=R()*tot;for(const k of ks){r-=EVENTS[k].w;if(r<=0){ev=k;break;}}if(!ev)ev=ks[ks.length-1]||null;}
      l.ev=ev;if(ev&&ev!=='shrooms'&&R()<.3){const vs=EV_COMBAT.includes(ev)?['elite','nuit']:['nuit'];l.evv=vs[Math.floor(R()*vs.length)];}}prev=l.ev;});
  /* v6.22 : chaque acte nouvellement tiré a au moins une fois l’événement de son monde */
  {const th_=WORLDS[w]&&WORLDS[w].theme,be=Object.keys(EVENTS).find(k=>EVENTS[k].th&&EVENTS[k].th===th_);if(be&&!lay.some(l=>l.ev===be)){const R=rng((seed^(w*31+a*977+777))>>>0),c=lay.map((_,i)=>i).filter(i=>!(a===1&&i===0)&&lay[i].f!=='arene');if(c.length){const i=c[Math.floor(R()*c.length)];lay[i].ev=be;lay[i].evv=null;}}}}
/* v5.53 : variantes d’événements. Environ 3 sur 10 : « d’élites » (monstres de l’événement plus coriaces, un objet rare en plus) ou « de nuit » (zone plongée dans le noir, +10 % de butin). */
const EV_COMBAT=['ambush','nests','cchest','traveler','relic','gibbet','invasion','cage'];
const EVV={elite:{s:' d’élites'},nuit:{s:' de nuit'}};
function evName(z){const e=z&&z.ev;if(!e)return'';return EVENTS[e.id].n+(e.v&&EVV[e.v]?EVV[e.v].s:'');}
/* v5.17 : cartes d’épreuve. Une carte = un mode de combat + 1 à 3 modificateurs. Elles tombent en butin et s’ouvrent à la pierre de faille. */
const TRIALS={assault:{n:'Assaut',d:'Les monstres arrivent de tous les côtés, sans pause. Tiens 3 minutes pendant que le rythme accélère.',dur:180},
  duel:{n:'Duel',d:'Cinq champions d’élite, un à la fois, chacun plus fort que le précédent. Pas de fiole.',dur:999},
  braziers:{n:'Braseros',d:'Trois feux sacrés. Les monstres veulent les éteindre : cours de l’un à l’autre et rallume-les. Tiens 2 minutes avec au moins un feu.',dur:120},
  defense:{n:'Défense',d:'Une prêtresse scelle une brèche au centre de l’arène. Les monstres foncent sur elle : garde-la en vie 2 minutes.',dur:120},
  hunt:{n:'Traque',d:'Cinq cibles d’élite se cachent dans une grande plaine. Abats-les toutes avant la fin du chrono.',dur:150},
  prey:{n:'Proie',d:'Quelque chose te traque et rien ne le blesse. Trouve les trois clés de fer avant 2 minutes pour le bannir. Ne le laisse pas te toucher.',dur:120},
  convoy:{n:'Convoi',d:'Un chariot de reliques traverse la plaine. Il n’avance que si tu es près de lui et qu’aucun monstre ne le bloque. Mène-le au sanctuaire.',dur:999}};
const TMODS={
  fast:{n:'Monstres rapides',d:'+30 % de vitesse aux monstres'},
  tough:{n:'Monstres coriaces',d:'+40 % de vie aux monstres'},
  elite:{n:'Élites',d:'Beaucoup plus de champions'},
  noregen:{n:'Sans régénération',d:'Ta vie ne remonte pas toute seule'},
  explode:{n:'Explosions',d:'Les monstres explosent à leur mort'},
  double:{n:'Double butin',d:'Le coffre final est deux fois plus riche'},
  voile:{n:'Voile déchiré',d:'Des Arpenteurs du Voile rôdent ; ils lâchent parfois le Pas du Voile'}};
const CARD_MAX=20;
function genCard(L){const ks=Object.keys(TMODS),n=1+(Math.random()<.45?1:0)+(Math.random()<.15?1:0),mods=[];while(mods.length<n){const k=pick(ks);if(!mods.includes(k))mods.push(k);}
  return{id:itemId++,mode:pick(Object.keys(TRIALS)),lvl:Math.max(1,Math.round(L)),mods};}
function cardName(c){return`Carte d’épreuve : ${TRIALS[c.mode].n} (niv. ${c.lvl})`;}
function cardMods(c){return c.mods.map(k=>TMODS[k]?TMODS[k].n:k).join(', ');}
function trialDef(c){const H=c.mode==='hunt'||c.mode==='convoy'||c.mode==='prey';return{name:`Épreuve : ${TRIALS[c.mode].n} (niveau ${c.lvl})`,lvl:c.lvl,style:H?'plain':'lair',forme:H?'plaine':'arene',size:H?64:48,waves:0,packs:c.mode==='hunt'?12:c.mode==='convoy'?5:c.mode==='prey'?6:0,mons:poolFor(THM(),c.lvl),chests:'none',trial:{card:c,mods:c.mods,state:'wait',t:0,kills:0,sp:0}};}
function hasMod(z,k){return!!(z&&z.def&&((z.def.trial&&z.def.trial.mods.includes(k))||(z.def.rmods&&z.def.rmods.includes(k))));}
/* v5.62 : affixes de faille. Dès la faille 5, un modificateur tiré à l’ouverture ; dès la 15, deux. Chacun +15 % de butin. */
const RMODS=['fast','tough','elite','noregen','explode'];
function rollRmods(n){const k=n>=15?2:n>=5?1:0,out=[];while(out.length<k){const m=pick(RMODS);if(!out.includes(m))out.push(m);}return out;}
function openTrial(i){const c=(p.cards||[])[i];if(!c)return;p.cards.splice(i,1);if(S.portal&&S.portal.zone==='trial')S.portal=null;
  const z=makeZone('trial',trialDef(c));z.arena=null;const ex=z.objs.find(o=>o.type==='exit');if(ex){ex.lock=true;ex.lockMsg='La sortie s’ouvrira à la fin de l’épreuve.';}
  if(c.mode==='braziers'&&z.center){z.fires=[];for(let k=0;k<3;k++){const a=k/3*6.28+.5,f=nearFloor(z,z.center[0]+Math.cos(a)*6.5,z.center[1]+Math.sin(a)*6.5)||z.center;const F={x:f[0]+.5,y:f[1]+.5,hp:100,hpMax:100,state:'on',relit:0};z.fires.push(F);z.objs.push({type:'sfire',x:F.x,y:F.y,F});}}
  if(c.mode==='defense'&&z.center){const f=nearFloor(z,z.center[0],z.center[1])||z.center;z.ward={x:f[0]+.5,y:f[1]+.5,hp:100,hpMax:100,state:'on'};z.objs.push({type:'priest',x:z.ward.x,y:z.ward.y});}
  if(c.mode==='prey'){const cand=[];for(let i=0;i<z.distE.length;i++)if(z.distE[i]>10&&z.g[i]!==1&&!DIR8.some(([dx,dy])=>isWall(z,i%z.w+dx,((i/z.w)|0)+dy)))cand.push(i);cand.sort((a,b)=>z.distE[a]-z.distE[b]);
    z.keys=[];for(const q of[.3,.62,.97]){const i=cand[Math.max(0,Math.min(cand.length-1,Math.floor(cand.length*(q+rnd(-.04,.03)))))];if(i==null)continue;const K={type:'pkey',x:i%z.w+.5,y:((i/z.w)|0)+.5,got:false};z.keys.push(K);z.objs.push(K);}
    z.prey={x:0,y:0,on:false,cd:0,ph:0,flow:null,ft:0,beat:0,spd:3.3};}
  if(c.mode==='convoy'){let best=-1,bi=0;for(let i=0;i<z.distE.length;i++)if(z.g[i]!==1&&z.distE[i]>best&&!DIR8.some(([dx,dy])=>isWall(z,i%z.w+dx,((i/z.w)|0)+dy))){best=z.distE[i];bi=i;}
    const dx_=bi%z.w,dy_=(bi/z.w)|0;z.cvFlow=bfs(z,dx_,dy_,0);const sp=z.spawn||{x:p.x,y:p.y};let st=nearFloor(z,sp.x+1.5,sp.y+1.5)||[Math.floor(sp.x),Math.floor(sp.y)];
    const C={type:'cart',x:st[0]+.5,y:st[1]+.5,hp:220,hpMax:220,state:'on',d0:z.cvFlow[st[1]*z.w+st[0]]||1,still:0,ph:0};z.cart=C;z.objs.push(C);z.objs.push({type:'cvdest',x:dx_+.5,y:dy_+.5});
    for(const m of z.mons)if(Math.hypot(m.x-C.x,m.y-C.y)<10)m.dead=true;z.mons=z.mons.filter(m=>!m.dead);}
  if(c.mode==='hunt'){const cand=[];for(let i=0;i<z.distE.length;i++)if(z.distE[i]>14&&z.g[i]!==1&&!DIR8.some(([dx,dy])=>isWall(z,i%z.w+dx,((i/z.w)|0)+dy)))cand.push(i);cand.sort((a,b)=>z.distE[a]-z.distE[b]);
    for(const q of[.15,.35,.55,.75,.95]){const i=cand[Math.max(0,Math.min(cand.length-1,Math.floor(cand.length*(q+rnd(-.05,.05)))))];if(i==null)continue;
      const m=spawnMon(z,pick(z.def.mons),i%z.w+.5,((i/z.w)|0)+.5,true,c.lvl+1);m.hp=m.maxHp=Math.round(m.maxHp*2);m.hunt=true;m.name='Cible : '+m.name;}}
  S.zones.trial=z;closePanel();enterZone('trial','spawn');sfx('portal');save();}
function trialEnd(z,win){const T=z.def.trial;T.state=win?'won':'lost';for(const o of z.objs)if(o.lock)o.lock=false;
  if(!win)return;for(const m of z.mons)if(!m.dead){m.dead=true;m.dt=0;m.hp=0;}
  const L=z.def.lvl,nm=T.mods.length,n=Math.min(8,2+Math.floor(T.kills/40)+nm+(T.card.mode==='hunt'&&TRIALS.hunt.dur-T.t>40?1:0))*(T.mods.includes('double')?2:1),c=T.card.mode==='hunt'?[Math.floor(p.x),Math.floor(p.y)]:T.card.mode==='convoy'&&z.cart?[Math.floor(z.cart.x),Math.floor(z.cart.y)]:(z.center||[p.x,p.y]);
  const f=nearFloor(z,c[0],c[1])||[Math.floor(p.x),Math.floor(p.y)];
  for(let k=0;k<n;k++)dropAt(z,f[0]+.5,f[1]+.5,{kind:'item',it:genItem(L+1,k<1+nm?2:1,p.st.mf+100+50*nm)});
  dropAt(z,f[0]+.5,f[1]+.5,{kind:'gold',v:Math.round((80+T.kills*3)*(1+.3*(L-1)))});if(Math.random()<.2)dropAt(z,f[0]+.5,f[1]+.5,{kind:'card',card:genCard(L+1)});
  S.trialsWon=(S.trialsWon||0)+1;ctTrack('trial');S.tmodes=S.tmodes||{};S.tmodes[T.card.mode]=1;toast(`Épreuve réussie : ${T.kills} abattus`);sfx('lvl');burst(f[0]+.5,f[1]+.5,'#d8a8ff',60);save();}
function updTrial(z,dt){const T=z.def.trial;if(!T||T.state==='won'||T.state==='lost')return;
  if(T.state==='wait'){T.t+=dt;if(T.t>=3){T.state='on';T.t=0;if(T.card.mode==='duel'){toast('Duel !');say('Cinq champions, un à la fois. Pas de fiole.');}else if(T.card.mode==='braziers'){toast('Braseros !');say('Garde au moins un feu allumé. Reste près d’un feu éteint pour le rallumer.');}else if(T.card.mode==='defense'){toast('Défense !');say('Les monstres visent la prêtresse. Reste près d’elle.');}else if(T.card.mode==='prey'){toast('Proie…');say('Il arrive. Trouve les trois clés. Cours.');}else if(T.card.mode==='convoy'){toast('Convoi !');say('Reste près du chariot. Il s’arrête quand des monstres le bloquent.');}else if(T.card.mode==='hunt'){toast('Traque !');say('Cinq cibles se cachent. Elles apparaissent sur la mini-carte quand tu les vois.');}else{toast('Assaut !');say('Tiens 3 minutes.');}S.shake=.3;}return;}
  T.t+=dt;T.sp-=dt;const dur=TRIALS[T.card.mode].dur;
  if(hasMod(z,'voile')){T.vt=(T.vt==null?2:T.vt)-dt;if(T.vt<=0){T.vt=16;let f=null;for(let t=0;t<30&&!f;t++){const a=rnd(0,6.28),q=nearFloor(z,p.x+Math.cos(a)*rnd(6,9),p.y+Math.sin(a)*rnd(6,9));if(q&&z.distE[q[1]*z.w+q[0]]>=0)f=q;}
    if(f){const m=spawnMon(z,'arpenteur',f[0]+.5,f[1]+.5,true);m.cx=['blink'];m.cxT=2;m.aggro=true;m.noLoot=true;m.name='Arpenteur du Voile';burst(m.x,m.y,'#a890ff',16);}}}
  if(T.card.mode==='duel'){if(!T.cur||T.cur.dead){T.round=(T.round||0)+(T.cur?1:0);if(T.round>=5){trialEnd(z,true);return;}
      const c=z.center,f=nearFloor(z,c[0]+rnd(-3,3),c[1]+rnd(-3,3))||c;const m=spawnMon(z,pick(z.def.mons),f[0]+.5,f[1]+.5,true,z.def.lvl+1+T.round);m.hp=m.maxHp=Math.round(m.maxHp*(2+.6*T.round));m.dmg=m.dmg.map(v=>Math.round(v*(1+.15*T.round)));m.aggro=true;m.noLoot=true;m.duel=true;T.cur=m;
      burst(m.x,m.y,'#6f8cff',30);toast(`Champion ${T.round+1} / 5`);}return;}
  if(T.card.mode==='braziers'){const F=z.fires;for(const b of F){if(b.state==='on'&&b.hp<=0){b.state='out';toast('Un brasero s’éteint');for(const m of z.mons)if(m.relic===b)m.relic=null;}
      if(b.state==='out'&&Math.hypot(p.x-b.x,p.y-b.y)<1.3){b.relit+=dt;if(b.relit>=1.5){b.state='on';b.hp=60;b.relit=0;toast('Brasero rallumé');sfx('portal');}}else b.relit=0;}
    if(F.every(b=>b.state==='out')){T.state='lost';for(const o of z.objs)if(o.lock)o.lock=false;toast('Les trois feux sont morts');say('La sortie est ouverte.');return;}
    if(T.sp<=0&&T.t<dur-3){T.sp=Math.max(1.4,3-T.t/70);const lit=F.filter(b=>b.state==='on');if(lit.length&&z.mons.filter(m=>!m.dead).length<24)for(let k=0,n=ri(2,3);k<n;k++){const tgt=pick(lit);let f=null;for(let t=0;t<30&&!f;t++){const a=rnd(0,6.28),q=nearFloor(z,z.center[0]+Math.cos(a)*rnd(10,12.5),z.center[1]+Math.sin(a)*rnd(10,12.5));if(q)f=q;}
      if(!f)continue;const m=spawnMon(z,pick(z.def.mons),f[0]+.5,f[1]+.5,Math.random()<(hasMod(z,'elite')?.25:.06));m.aggro=true;m.noLoot=true;m.xp=Math.round(m.xp*.4);m.relic=tgt;z.relicFlow=null;}}
    for(const m of z.mons)if(m.relic&&m.relic.state!=='on'){const lit=F.filter(b=>b.state==='on');m.relic=lit.length?pick(lit):null;z.relicFlow=null;}
    if(T.t>=dur){for(const m of z.mons)m.relic=null;trialEnd(z,true);}return;}
  if(T.card.mode==='defense'){const P=z.ward;if(P.hp<=0){T.state='lost';P.state='fail';for(const o of z.objs)if(o.lock)o.lock=false;for(const m of z.mons)m.relic=null;toast('La prêtresse est tombée');say('La brèche s’ouvre. La sortie aussi.');burst(P.x,P.y,'#e8e0ff',40);return;}
    if(T.sp<=0&&T.t<dur-3){T.sp=Math.max(1.4,3.2-T.t/60);if(z.mons.filter(m=>!m.dead).length<26)for(let k=0,n=Math.min(ri(2,3),Math.ceil((28-z.mons.filter(m=>!m.dead).length)/2));k<n;k++){let f=null;for(let t=0;t<30&&!f;t++){const a=rnd(0,6.28),q=nearFloor(z,P.x+Math.cos(a)*rnd(9,12.5),P.y+Math.sin(a)*rnd(9,12.5));if(q&&Math.hypot(q[0]-p.x,q[1]-p.y)>3)f=q;}
      if(!f)continue;const m=spawnMon(z,pick(z.def.mons),f[0]+.5,f[1]+.5,Math.random()<(hasMod(z,'elite')?.25:.06));m.aggro=true;m.noLoot=true;m.xp=Math.round(m.xp*.4);m.relic=P;burst(m.x,m.y,'#c060ff',8);}}
    if(T.t>=dur){P.state='done';for(const m of z.mons)m.relic=null;trialEnd(z,true);}return;}
  if(T.card.mode==='prey'){const H=z.prey,K=z.keys||[];if(!H)return;H.ph+=dt;
    for(const k of K)if(!k.got&&Math.hypot(p.x-k.x,p.y-k.y)<1.1){k.got=true;sfx('portal');burst(k.x,k.y,'#c8c0a8',20);toast(`Clé de fer ${K.filter(q=>q.got).length} / ${K.length}`);}
    if(K.length&&K.every(k=>k.got)){if(H.on)burst(H.x,H.y,'#2a1a2a',50);H.on=false;S.shake=.4;say('La chose se défait en cendre froide.');trialEnd(z,true);return;}
    if(T.t>=TRIALS.prey.dur){H.on=false;T.state='lost';for(const o of z.objs)if(o.lock)o.lock=false;toast('Trop tard');say('Il s’éloigne, repu de ta peur. La sortie est ouverte.');return;}
    if(!H.on){if(T.t>=2.5){let f=null;for(let t=0;t<40&&!f;t++){const a=rnd(0,6.28),q=nearFloor(z,p.x+Math.cos(a)*15,p.y+Math.sin(a)*15);if(q&&z.distE[q[1]*z.w+q[0]]>=0&&Math.hypot(q[0]-p.x,q[1]-p.y)>11)f=q;}if(f){H.x=f[0]+.5;H.y=f[1]+.5;H.on=true;toast('Il est là');S.shake=.25;}}return;}
    H.spd=3.3+.6*Math.min(1,T.t/TRIALS.prey.dur);H.cd-=dt;H.ft-=dt;if(H.ft<=0||!H.flow){H.ft=.4;H.flow=bfs(z,Math.floor(p.x),Math.floor(p.y),0);}
    const d=Math.hypot(p.x-H.x,p.y-H.y);H.moving=false;
    if(p.stealth>0){H.x+=Math.cos(H.ph*.7)*dt*.6;H.y+=Math.sin(H.ph*.5)*dt*.6;if(isWall(z,Math.floor(H.x),Math.floor(H.y))){const q=nearFloor(z,H.x,H.y);if(q){H.x=q[0]+.5;H.y=q[1]+.5;}}}
    else if(d<.95){if(H.cd<=0&&!p.dead){H.cd=1.3;H.atk=.35;hurtPlayer(Math.round(p.maxHp*.35));S.shake=Math.max(S.shake,.35);}}
    else{const F=H.flow,cx=Math.floor(H.x),cy=Math.floor(H.y);let bd=F[cy*z.w+cx],tx=p.x,ty=p.y;if(bd>1)for(const[dx,dy]of DIR8){const nx=cx+dx,ny=cy+dy;if(isWall(z,nx,ny))continue;if(dx&&dy&&(isWall(z,cx+dx,cy)||isWall(z,cx,cy+dy)))continue;const v=F[ny*z.w+nx];if(v>=0&&v<bd){bd=v;tx=nx+.5;ty=ny+.5;}}
      const l=Math.hypot(tx-H.x,ty-H.y)||1;step(H,(tx-H.x)/l,(ty-H.y)/l,Math.min(l,H.spd*dt),z);H.face=Math.atan2(ty-H.y,tx-H.x);H.moving=true;}
    H.atk=Math.max(0,(H.atk||0)-dt);H.beat-=dt;if(d<10&&H.beat<=0){H.beat=.35+d*.09;try{if(AC&&!p.mute){tone(55,.12,'sine',.06);tone(48,.12,'sine',.05,null,.13);}}catch(e){}}
    return;}
  if(T.card.mode==='convoy'){const C=z.cart,F=z.cvFlow;if(!C||!F)return;C.ph+=dt;
    if(C.hp<=0){T.state='lost';C.state='fail';for(const o of z.objs)if(o.lock)o.lock=false;for(const m of z.mons)if(m.relic===C)m.relic=null;toast('Le chariot est détruit');say('Les reliques sont perdues. La sortie est ouverte.');burst(C.x,C.y,'#c8a060',40);sfx('die');return;}
    const cx=Math.floor(C.x),cy=Math.floor(C.y),here=F[cy*z.w+cx];
    if(here<=1){C.state='done';for(const m of z.mons)if(m.relic===C)m.relic=null;trialEnd(z,true);return;}
    const near=Math.hypot(p.x-C.x,p.y-C.y)<7&&!p.dead,block=z.mons.some(m=>!m.dead&&!m.beaten&&Math.hypot(m.x-C.x,m.y-C.y)<2.2);C.moving=false;C.block=block;C.wait=!near;
    if(near&&!block){if(!C.nx||Math.hypot(C.nx[0]-C.x,C.nx[1]-C.y)<.05){let bd=here,nx=null;for(const[dx,dy]of DIR8){const ax=cx+dx,ay=cy+dy;if(isWall(z,ax,ay))continue;if(dx&&dy&&(isWall(z,cx+dx,cy)||isWall(z,cx,cy+dy)))continue;const v=F[ay*z.w+ax];if(v>=0&&v<bd){bd=v;nx=[ax+.5,ay+.5];}}C.nx=nx;}
      if(C.nx){const dx=C.nx[0]-C.x,dy=C.nx[1]-C.y,l=Math.hypot(dx,dy),st=Math.min(l,1.15*dt);C.x+=dx/l*st;C.y+=dy/l*st;C.face=Math.atan2(dy,dx);C.moving=true;const nk=Math.floor(C.x)+Math.floor(C.y)*z.w;if(nk!==C.tk){C.tk=nk;C.flow=null;}}}
    if(T.sp<=0){T.sp=Math.max(5,9-T.t/40);if(z.mons.filter(m=>!m.dead).length<22){const n=ri(3,5)+(hasMod(z,'elite')?1:0),cand=[];
        for(let k=0;k<60&&cand.length<n;k++){const a=rnd(0,6.28),r=rnd(8,12),q=nearFloor(z,C.x+Math.cos(a)*r,C.y+Math.sin(a)*r);if(!q)continue;const v=F[q[1]*z.w+q[0]];if(v>=0&&v<here+3&&Math.hypot(q[0]-p.x,q[1]-p.y)>5)cand.push(q);}
        for(const q of cand){const m=spawnMon(z,pick(z.def.mons),q[0]+.5,q[1]+.5,Math.random()<(hasMod(z,'elite')?.25:.06));m.aggro=true;m.noLoot=true;m.xp=Math.round(m.xp*.4);m.relic=C;burst(m.x,m.y,'#c060ff',8);}}}
    return;}
  if(T.card.mode==='hunt'){if(!z.mons.some(m=>m.hunt&&!m.dead))trialEnd(z,true);else if(T.t>=dur){T.state='lost';for(const o of z.objs)if(o.lock)o.lock=false;toast('Temps écoulé');say('Les cibles se sont enfuies. La sortie est ouverte.');}return;}
  if(T.sp<=0&&T.t<dur-2){T.sp=Math.max(.8,2.8-T.t/75);const c=z.center,alive=z.mons.filter(m=>!m.dead).length;
    if(alive<30)for(let k=0,n=ri(2,3);k<n;k++){let f=null;for(let t=0;t<30&&!f;t++){const a=rnd(0,6.28),q=nearFloor(z,c[0]+Math.cos(a)*rnd(9,12.5),c[1]+Math.sin(a)*rnd(9,12.5));if(q&&Math.hypot(q[0]-p.x,q[1]-p.y)>4)f=q;}
      if(!f)continue;const m=spawnMon(z,pick(z.def.mons),f[0]+.5,f[1]+.5,Math.random()<(hasMod(z,'elite')?.25:.06));m.aggro=true;m.noLoot=true;m.xp=Math.round(m.xp*.4);burst(m.x,m.y,'#c060ff',8);}}
  if(T.t>=dur)trialEnd(z,true);}
/* v5.18 : modificateurs de zone. 0 à 2 par zone, tirés avec la graine. Chacun ajoute +10 % d’expérience et de butin dans la zone. */
const ZMODS={
  vaste:{n:'Vaste',d:'La zone est 30 % plus grande',noArena:true},
  dense:{n:'Grouillante',d:'50 % de groupes de monstres en plus'},
  brume:{n:'Brume',d:'Une brume épaisse réduit la vue'},
  nuit:{n:'Nuit noire',d:'Il fait très sombre'},
  elites:{n:'Élites',d:'Champions bien plus fréquents'},
  rapides:{n:'Frénésie',d:'Monstres 25 % plus rapides'},
  tresors:{n:'Trésors',d:'Deux coffres de plus',noArena:true}};
function placeZoneMods(lay,w,a,seed){if(!lay.length||lay.every(l=>'zm' in l))return;
  lay.forEach((l,i)=>{if('zm' in l)return;const R=rng((seed^(w*104729+a*7907+i*3571+99))>>>0);const zm=[];
    if(!(a===1&&i===0)){const n=R()<.5?0:R()<.7?1:2;const ks=Object.keys(ZMODS).filter(k=>!(l.f==='arene'&&ZMODS[k].noArena));
      while(zm.length<n){const k=ks[Math.floor(R()*ks.length)];if(!zm.includes(k)&&!(k==='nuit'&&zm.includes('brume'))&&!(k==='brume'&&zm.includes('nuit')))zm.push(k);}}
    l.zm=zm;});}
function zHas(z,k){if(k==='brume'&&z&&z.id!=='town'&&mut('brume'))return true;return!!(z&&z.def&&z.def.mods&&z.def.mods.includes(k));}
function modBonus(z){return(1+.1*((z&&z.def&&z.def.mods)||[]).length)*(mut('brume')?1.15:1);}
/* v5.21 : courbe des monstres hors failles. Le héros grandit plus vite que G(L) (talents, +1 % par niveau) :
   la vie des monstres prend 4,5 % de plus par niveau pour que chaque zone reste un défi. Les failles gardent leur propre courbe. */
const MON_CURVE=L=>Math.pow(1.045,Math.max(0,L-1));
/* v6.58 : les Brasiers, paliers de difficulté sans fin. Battre Valgris débloque le suivant ; on le choisit au camp, chez Corvel.
   Par Brasier (multiplicatif) : vie des monstres ×1,25, dégâts ×1,15 ; résistances du héros −5 % (30 au plus) ; expérience +20 %, découverte d’objets +30, reliques +25 %. Hors camp, failles et épreuves. */
const BR_HP=1.25,BR_DMG=1.15,BR_RES=5,BR_RES_MAX=30,BR_XP=.2,BR_MF=30,BR_REL=.25;
function brOn(z){return!!(S&&S.br>0&&z&&z.id!=='town'&&z.def&&!z.def.rift&&!z.def.trial);}
function brName(n){return n>0?'Brasier '+n:'Brasier de base';}
function brSet(n){n=n|0;if(n<0||n>(S.brMax||0)||n===(S.br||0))return false;S.br=n;for(const k of Object.keys(S.zones)){if(k==='town')continue;freeCv(S.zones[k]);delete S.zones[k];}if(S.portal&&S.portal.zone!=='town')S.portal=null;recalc();save();return true;}
function brWin(){const b=S.br||0;S.brBest=Math.max(S.brBest==null?-1:S.brBest,b);if((S.brMax||0)<b+1){S.brMax=b+1;S.pend.push({t:2,fn:()=>{toast(brName(b+1)+' débloqué');say(`Valgris a plié au ${brName(b).toLowerCase()}. Le ${brName(b+1)} t’attend : choisis-le au camp, chez Corvel.`,6200);}});}hfCheck&&hfCheck();save();}
function brHTML(){const b=S.br||0,mx=S.brMax||0,best=S.brBest==null?-1:S.brBest;return`<div class="matbox"><b>Brasier : ${b>0?b:'base'}</b><div class="st">${mx?`Plus haut débloqué : ${mx}. Plus haut battu : ${best>=0?(best>0?best:'base'):'aucun'}.`:'Bats Valgris pour ouvrir le Brasier 1.'} Par Brasier : monstres +25 % de vie et +15 % de dégâts, −5 % à tes résistances (30 au plus) ; +20 % d’expérience et plus de butin rare. Changer de Brasier remet les zones à neuf.</div>${mx?`<div><button class="min" data-a="brset" data-k="${b-1}" ${b>0?'':'disabled style="opacity:.4"'}>Descendre</button><button class="min" data-a="brset" data-k="${b+1}" ${b<mx?'':'disabled style="opacity:.4"'}>Monter</button></div>`:''}</div>`;}
/* v6.56 : réglage de la campagne (hors failles). gap : par niveau de retard du héros sur un monstre, il reçoit +gapIn et inflige −gapOut (5 niveaux au plus). */
const CAMP={mini:{hp:1.6,dmg:1.25},boss:{hp:1.5,dmg:1.3},champ:{hp:1.2,dmg:1.1},gapIn:.05,gapOut:.04,gapMax:5};
function gapOf(m){if(!m||!S||!S.cur||S.cur.def.rift||S.cur.def.trial)return 0;/* v6.57 : le retard se compte sur le niveau de la zone (un boss plus haut que sa zone ne compte pas double) */const ref=Math.min(m.lvl||0,(S.cur.def.lvl||m.lvl||0));if(!(ref>p.lvl))return 0;return Math.min(CAMP.gapMax,ref-p.lvl);}
/* v6.02 : le début de partie était trop facile. Les monstres frappent environ deux fois plus fort jusqu’au niveau 6, puis l’écart fond jusqu’au niveau 30 (les mondes avancés ne changent pas). */
const EARLY_DMG=L=>1+.6*clamp((30-L)/24,0,1)*clamp((L+3)/7,0,1);
/* v5.26 : compagnons. Un seul à la fois, engagé au camp. Ses dégâts restent sous 30 % de ceux du héros.
   Rangs : l’expérience vient des ennemis abattus près de lui. */
const ALLIES={
  archer:{n:'Archère',d:'Tire de loin, deux flèches au rang Vétéran.',price:L=>120+L*25,rate:1.1,range:7,hp:.5,dmg:1,col:['#5a6a3a','#22281a']},
  garde:{n:'Garde au bouclier',d:'Encaisse au corps à corps : les monstres proches s’en prennent à lui.',price:L=>120+L*25,rate:1,range:1.3,hp:1.3,dmg:.8,col:['#6a6a72','#2a2a30'],tank:true},
  pyro:{n:'Pyromancien',d:'Lance des braises qui brûlent tout autour de l’impact.',price:L=>150+L*30,rate:1.6,range:6,hp:.45,dmg:.7,aoe:1.6,col:['#7a3a24','#2a1008']},
  rejeton:{n:'Rejeton de Valgris',d:'Un petit dragon de cendre, éclos d’un œuf laissé par Valgris. Le plus fort de tous à la longue.',price:()=>0,rate:1.2,range:5,hp:.8,dmg:1.15,aoe:1.2,col:['#cfc8b8','#4a4440'],egg:true}};
const ARANKS=[['Commun',0],['Aguerri',60],['Vétéran',200],['Élite',500],['Légendaire',1200]];
/* v5.43 : évolution. L’expérience mène jusqu’à Vétéran ; Élite et Légendaire s’achètent chez le recruteur avec les matériaux du Démolisseur.
   Chaque rang débloque un talent. Le Rejeton coûte trois fois plus cher. */
const AEVO=[{shard:10,ember:6},{ember:10,heart:2}];
const ASK={
  archer:['Tir plus vif (cadence +10 %, même dégâts par seconde)','Deux flèches à la fois','Flèches qui ralentissent','Volée : toutes les 8 s, 5 flèches en éventail'],
  garde:['Provocation : attire les monstres de plus loin','Bouclier : encaisse 30 % de moins','Coup de bouclier : étourdit au 3e coup','Rempart : le héros près de lui subit 10 % de moins'],
  pyro:['Braises plus larges (+30 %)','Brûlure : l’impact laisse un feu','Gerbe : un tir sur trois deux fois plus large','Les braises ralentissent'],
  rejeton:['Souffle plus large (+30 %)','Cendre brûlante : laisse une brûlure','Écailles : vie +30 %, se soigne plus vite','Souffle de cendre : un tir sur quatre frappe tout devant lui']};
function xpRank(c){let r=0;for(let i=0;i<ARANKS.length;i++)if((c.xp||0)>=ARANKS[i][1])r=i;return r;}
function allyRank(c){return Math.min(xpRank(c),2+(c.ev||0));}
function evoCost(c){const b=AEVO[c.ev||0];if(!b)return null;const m=c.type==='rejeton'?3:1,o={};for(const k in b)o[k]=b[k]*m;return o;}
function aRate(c){return ALLIES[c.type].rate*(c.type==='archer'&&allyRank(c)>=1?.9:1);}
function aAoe(c){const A=ALLIES[c.type];return(A.aoe||0)*((c.type==='pyro'||c.type==='rejeton')&&allyRank(c)>=1?1.3:1);}
function allyF(c){return .6+.1*allyRank(c)+(c.type==='rejeton'?.15*Math.min(4,allyRank(c)):0);}
/* Coup moyen du héros, pour borner le compagnon */
function heroHit(){const s=p.st,fl=Math.max(1,skLvl('fire'));return(s.dmg[0]+s.dmg[1])/2*(1+s.dmgPct/100)*(1+Math.max(0,s.spell)/100)*(1.5+.15*(fl-1))*(1+s.crit/100*s.critDmg/100);}
function allyHit(){const c=p.comp,A=ALLIES[c.type];return Math.max(1,Math.round(.3*heroHit()*2.8*aRate(c)*Math.min(1,allyF(c)*A.dmg)*((c.type==='pyro'||c.type==='rejeton')&&allyRank(c)>=2?.85:1)));}
function spawnAlly(){const c=p.comp;if(!c||!ALLIES[c.type]){S.ally=null;return;}const A=ALLIES[c.type],mx=Math.round(p.maxHp*A.hp*allyF(c)*(c.type==='rejeton'&&allyRank(c)>=3?1.3:1));
  const f=nearFloor(S.cur,p.x-1,p.y+1)||[Math.floor(p.x),Math.floor(p.y)];S.ally={x:f[0]+.5,y:f[1]+.5,hp:Math.min(mx,S.ally&&S.ally.hp!=null&&S.ally.type===c.type?S.ally.hp:mx),maxHp:mx,cd:1,type:c.type,face:0,ph:0,down:S.ally&&S.ally.type===c.type?S.ally.down:0,swing:0};}
function updAlly(dt,z){const c=p.comp,a=S.ally;if(!c||!a)return;const A=ALLIES[c.type];a.ph+=dt;a.swing=Math.max(0,a.swing-dt);
  if(a.down>0){a.down-=dt;if(a.down<=0){a.hp=a.maxHp*.5;say(A.n+' se relève.');}return;}
  a.hp=Math.min(a.maxHp,a.hp+a.maxHp*(z.id==='town'?.2:.01*(c.type==='rejeton'&&allyRank(c)>=3?3:1))*dt);const rk=allyRank(c);const d=Math.hypot(a.x-p.x,a.y-p.y);
  if(d>12){const f=nearFloor(z,p.x-1,p.y+1);if(f){a.x=f[0]+.5;a.y=f[1]+.5;}return;}
  let tgt=null,bd=A.range+(A.tank?(rk>=1?6:4):0);if(z.id!=='town')for(const m of z.mons){if(m.dead||m.beaten)continue;const dm=Math.hypot(m.x-a.x,m.y-a.y);if(dm<bd&&Math.hypot(m.x-p.x,m.y-p.y)<9&&(A.range>=2?losClear(z,a.x,a.y,m.x,m.y):true)){bd=dm;tgt=m;}}
  const mv=(tx,ty,sp)=>{const dx=tx-a.x,dy=ty-a.y,l=Math.hypot(dx,dy)||1;step(a,dx/l,dy/l,Math.min(l,sp*dt),z);a.face=Math.atan2(dy,dx);a.moving=true;};a.moving=false;
  if(tgt){a.cd-=dt;const dm=Math.hypot(tgt.x-a.x,tgt.y-a.y);
    if(A.range<2&&(dm>A.range||!losClear(z,a.x,a.y,tgt.x,tgt.y))){let tx=tgt.x,ty=tgt.y;if(!losClear(z,a.x,a.y,tgt.x,tgt.y)){const P=pathTo(z,Math.floor(a.x),Math.floor(a.y),Math.floor(tgt.x),Math.floor(tgt.y));if(P&&P.length){tx=P[0][0]+.5;ty=P[0][1]+.5;}}mv(tx,ty,4.6);}
    else if(a.cd<=0){a.cd=aRate(c);a.swing=.25;a.face=Math.atan2(tgt.y-a.y,tgt.x-a.x);const h=allyHit();a.shots=(a.shots||0)+1;a.vt=(a.vt||0);
      if(A.range<2){hurtMon(tgt,h,'#d8e0f0');if(c.type==='garde'&&rk>=3&&a.shots%3===0&&!tgt.boss&&!tgt.dead){tgt.stun=Math.max(tgt.stun||0,.8);S.fx.push({x:tgt.x,y:tgt.y,t:'Étourdi',col:'#d8e0f0',life:.7});}}
      else if(c.type==='rejeton'&&rk>=4&&a.shots%4===0){burst(a.x+Math.cos(a.face)*1.5,a.y+Math.sin(a.face)*1.5,'#b8b0a0',14);for(const o of z.mons){if(o.dead||o.beaten)continue;const dx=o.x-a.x,dy=o.y-a.y,dd=Math.hypot(dx,dy);if(dd<3.2&&Math.cos(Math.atan2(dy,dx)-a.face)>.5)hurtMon(o,Math.round(h*.75),'#e0d8c8');}}
      else{const vol=c.type==='archer'&&rk>=4&&S.t-(a.vt||-99)>=8;if(vol)a.vt=S.t;const n=vol?5:c.type==='archer'&&rk>=2?2:1,sp=vol?.22:.18,big=c.type==='pyro'&&rk>=3&&a.shots%3===0?2:1;
        for(let k=0;k<n;k++){const an=a.face+(k-(n-1)/2)*sp;S.proj.push({x:a.x,y:a.y,vx:Math.cos(an)*10,vy:Math.sin(an)*10,from:'a',kind:A.aoe?'fire':'arrow',dmg:Math.max(1,Math.round(h/n)),aoe:aAoe(c)*big,life:1.2,slow:(c.type==='archer'&&rk>=3)||(c.type==='pyro'&&rk>=4),burn:(c.type==='pyro'||c.type==='rejeton')&&rk>=2});}}}}
  else if(d>2.4){let tx=p.x,ty=p.y;const F=z.flow,cx=Math.floor(a.x),cy=Math.floor(a.y);if(F){let bd=F[cy*z.w+cx];if(bd>1)for(const[dx,dy]of DIR8){const nx=cx+dx,ny=cy+dy;if(isWall(z,nx,ny))continue;if(dx&&dy&&(isWall(z,cx+dx,cy)||isWall(z,cx,cy+dy)))continue;const v=F[ny*z.w+nx];if(v>=0&&v<bd){bd=v;tx=nx+.5;ty=ny+.5;}}}
    const ox=a.x,oy=a.y;mv(tx,ty,4.6*(1+p.st.move/100));if(Math.hypot(a.x-ox,a.y-oy)<.01){const c=nearFloor(z,a.x,a.y);if(c){a.x+=(c[0]+.5-a.x)*.3;a.y+=(c[1]+.5-a.y)*.3;}}}}
function allyHurt(dm){const a=S.ally;if(!a||a.down>0)return;const k=p.comp&&p.comp.type==='garde'&&allyRank(p.comp)>=2?.5:.7;a.hp-=dm*k;S.fx.push({x:a.x,y:a.y,t:fmt(dm*k),col:'#ff9a8a',life:.8});if(a.hp<=0){a.hp=0;a.down=20;toast(ALLIES[a.type].n+' est à terre');}}
/* v5.27 : affixes de champions. Chaque champion en a 1 (2 à partir du monde 2 ou en faille 10 et plus). */
const CAFX={
  rapide:{n:'Rapide'},enrage:{n:'Enragé'},vampire:{n:'Vampirique'},garde:{n:'Blindé'},blink:{n:'Insaisissable'},
  glace:{n:'Glacial'},meute:{n:'Chef de meute'},braise:{n:'Incendiaire'},foudre:{n:'Électrique'},venin:{n:'Venimeux'}};
/* v6.34 : chaque affixe a sa couleur et son symbole, pour lire un champion d’un coup d’œil */
Object.assign(CAFX.rapide,{c:'#7ae0ff',i:'»'});Object.assign(CAFX.enrage,{c:'#ff5a3a',i:'!'});Object.assign(CAFX.vampire,{c:'#e0405a',i:'♥'});Object.assign(CAFX.garde,{c:'#c8d0d8',i:'■'});
Object.assign(CAFX.blink,{c:'#c090ff',i:'◆'});Object.assign(CAFX.glace,{c:'#9fd4ff',i:'*'});Object.assign(CAFX.meute,{c:'#e8c46a',i:'♛'});Object.assign(CAFX.braise,{c:'#ff9a3a',i:'▲'});Object.assign(CAFX.foudre,{c:'#f0e070',i:'≈'});Object.assign(CAFX.venin,{c:'#9ad04a',i:'●'});
function champCol(m){return m.cx&&m.cx.length&&CAFX[m.cx[0]]&&CAFX[m.cx[0]].c||'#6f8cff';}
function giveAffixes(m,z){const n=((S&&S.world>2)||(z.def.rift>=10))?2:1,ks=Object.keys(CAFX);m.cx=[];while(m.cx.length<n){const k=pick(ks);if(!m.cx.includes(k))m.cx.push(k);}
  if(m.cx.includes('rapide'))m.spd*=1.4;if(m.cx.includes('enrage'))m.dmg=m.dmg.map(v=>Math.round(v*1.25));m.name+=' · '+m.cx.map(k=>CAFX[k].n).join(', ');}
/* v5.41 : camp vivant (idée de Vincent), passe 1. Trois survivants, un chat et des oiseaux, chacun mené par un petit moteur d’envies.
   Ce n’est pas un vrai modèle de langue : des envies tirées au hasard, gratuites et hors ligne. Rien ne bloque le héros ; en économie de batterie, ils se reposent. */
const ENVIES={
  flaner:{w:3,t:[4,8]},feu:{w:2,t:[8,14]},caillou:{w:1,t:[2,3]},vide:{w:1.5,t:[5,9]},etirer:{w:1,t:[2,3]},parler:{w:1.2,t:[4,7]}};
function lifeFree(z,x,y){const f=nearFloor(z,x,y);if(!f)return null;for(const o of z.objs)if(Math.hypot(o.x-f[0]-.5,o.y-f[1]-.5)<1.2)return null;return f;}
function initLife(z){const L={surv:[],cat:null,birds:[],bt:rnd(3,8)},cols=[['#6a5a48','#2a2018'],['#5a6050','#22261c'],['#6a4a4a','#281818']];
  for(let k=0;k<3;k++){let f=null;for(let t=0;t<30&&!f;t++)f=lifeFree(z,rnd(6,22),rnd(6,22));if(!f)continue;L.surv.push({x:f[0]+.5,y:f[1]+.5,col:cols[k],env:null,t:0,face:rnd(0,6.28),ph:rnd(0,6),tx:null,ty:null,anim:'',chase:0});}
  {const f=lifeFree(z,12,16)||[12,16];L.cat={x:f[0]+.5,y:f[1]+.5,t:rnd(2,5),tx:null,ty:null,face:0,ph:0,jump:0,target:null,flee:0,sit:false};}
  z.life=L;}
function pickEnv(){const ks=Object.keys(ENVIES);let r=Math.random()*ks.reduce((a,k)=>a+ENVIES[k].w,0);for(const k of ks){r-=ENVIES[k].w;if(r<=0)return k;}return'flaner';}
function walkTo(e,z,sp,dt){if(e.tx==null)return true;const dx=e.tx-e.x,dy=e.ty-e.y,l=Math.hypot(dx,dy);if(l<.15){e.tx=null;return true;}const st=Math.min(l,sp*dt);const nx=e.x+dx/l*st,ny=e.y+dy/l*st;
  if(free(z,nx,ny,.18)){e.x=nx;e.y=ny;}else{e.tx=null;return true;}e.face=Math.atan2(dy,dx);e.moving=true;return false;}
function updLife(dt,z){if(!z.life)initLife(z);const L=z.life,fire=z.objs.find(o=>o.type==='fire');
  for(const s_ of L.surv){s_.ph+=dt;s_.moving=false;if(s_.chase>0){s_.chase-=dt;const c=L.cat;s_.tx=c.x;s_.ty=c.y;walkTo(s_,z,3.2,dt);s_.anim='court';continue;}
    s_.t-=dt;if(s_.t<=0||!s_.env){s_.env=pickEnv();const E_=ENVIES[s_.env];s_.t=rnd(E_.t[0],E_.t[1]);s_.anim='';
      if(s_.env==='flaner'){const f=lifeFree(z,s_.x+rnd(-5,5),s_.y+rnd(-5,5));if(f){s_.tx=f[0]+.5;s_.ty=f[1]+.5;}}
      else if(s_.env==='feu'&&fire){const a=rnd(0,6.28);s_.tx=fire.x+Math.cos(a)*1.4;s_.ty=fire.y+Math.sin(a)*1.4;}
      else if(s_.env==='caillou'){s_.tx=s_.x+rnd(-1,1);s_.ty=s_.y+rnd(-1,1);}
      else if(s_.env==='parler'){const o=pick(L.surv.filter(x=>x!==s_));if(o){s_.tx=o.x+.9;s_.ty=o.y+.3;s_.with=o;}}
      else{s_.tx=null;s_.face=rnd(0,6.28);}}
    const arrived=walkTo(s_,z,1.4,dt);
    if(arrived){if(s_.env==='feu'){s_.anim='assis';if(fire)s_.face=Math.atan2(fire.y-s_.y,fire.x-s_.x);}else if(s_.env==='caillou'){if(s_.anim!=='botte'){s_.anim='botte';s_.kt=.4;S.parts.push({x:s_.x+Math.cos(s_.face)*.4,y:s_.y+Math.sin(s_.face)*.4,z:.1,vx:Math.cos(s_.face)*3,vy:Math.sin(s_.face)*3,vz:2,life:.7,col:'#7a746a'});}}
      else if(s_.env==='etirer')s_.anim='etire';else if(s_.env==='parler'&&s_.with){s_.anim='parle';s_.face=Math.atan2(s_.with.y-s_.y,s_.with.x-s_.x);}else s_.anim='';}}
  const c=L.cat;if(c){c.ph+=dt;c.moving=false;c.jump=Math.max(0,c.jump-dt);
    if(c.target){c.tx=c.target.x;c.ty=c.target.y;walkTo(c,z,4.5,dt);if(Math.hypot(c.x-c.target.x,c.y-c.target.y)<.5){c.jump=.5;c.target.chase=rnd(3,5);c.flee=c.target.chase;const f=lifeFree(z,c.x+rnd(-7,7),c.y+rnd(-7,7));c.target=null;if(f){c.tx=f[0]+.5;c.ty=f[1]+.5;}}}
    else if(c.flee>0){c.flee-=dt;walkTo(c,z,4.8,dt);if(c.tx==null){const f=lifeFree(z,c.x+rnd(-5,5),c.y+rnd(-5,5));if(f){c.tx=f[0]+.5;c.ty=f[1]+.5;}}}
    else{c.t-=dt;if(c.t<=0){c.t=rnd(3,8);c.sit=false;const r=Math.random();if(r<.18&&L.surv.length){c.target=pick(L.surv);}else if(r<.55){const f=lifeFree(z,c.x+rnd(-4,4),c.y+rnd(-4,4));if(f){c.tx=f[0]+.5;c.ty=f[1]+.5;}}else c.sit=true;}
      if(!c.sit)walkTo(c,z,1.6,dt);}}
  L.bt-=dt;if(L.bt<=0){L.bt=rnd(8,16);const n=ri(3,6),y0=p.y+rnd(-8,8),dir=Math.random()<.5?1:-1;for(let k=0;k<n;k++)L.birds.push({x:p.x-dir*14+rnd(-1,1),y:y0+rnd(-1.5,1.5)+k*.3,vx:dir*rnd(3,4),vy:rnd(-.4,.4),h:rnd(3,4.5),ph:rnd(0,6),life:9});}
  for(const b of L.birds){b.x+=b.vx*dt;b.y+=b.vy*dt;b.ph+=dt*9;b.life-=dt;}L.birds=L.birds.filter(b=>b.life>0);}
function drawPrey(H){const[sx,sy]=scr(H.x,H.y),s=Z*1.35,sw=Math.sin(H.ph*7)*(H.moving?3:1)*s,lean=H.atk>0?6*s:0;
  ctx.fillStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.ellipse(sx,sy,12*s,5*s,0,0,7);ctx.fill();
  ctx.fillStyle='#0c080c';ctx.beginPath();ctx.moveTo(sx-9*s,sy);ctx.lineTo(sx-4*s+sw*.3,sy-46*s);ctx.lineTo(sx+4*s+sw*.3+lean,sy-46*s);ctx.lineTo(sx+9*s,sy);ctx.quadraticCurveTo(sx,sy-6*s,sx-9*s,sy);ctx.fill();
  ctx.strokeStyle='#0c080c';ctx.lineWidth=2.2*s;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(sx-4*s,sy-40*s);ctx.quadraticCurveTo(sx-14*s,sy-26*s+sw,sx-12*s-lean,sy-10*s+sw);ctx.moveTo(sx+4*s,sy-40*s);ctx.quadraticCurveTo(sx+14*s+lean,sy-26*s-sw,sx+13*s+lean*2,sy-12*s-sw);ctx.stroke();
  ctx.fillStyle='#d8d0c4';ctx.beginPath();ctx.ellipse(sx+sw*.3+lean*.5,sy-52*s,4.5*s,6.5*s,0,0,7);ctx.fill();
  ctx.fillStyle='#000';ctx.fillRect(sx-2.6*s+sw*.3+lean*.5,sy-54*s,1.8*s,2.4*s);ctx.fillRect(sx+.8*s+sw*.3+lean*.5,sy-54*s,1.8*s,2.4*s);ctx.fillRect(sx-1.2*s+sw*.3+lean*.5,sy-49*s,2.4*s,2.6*s);
  ctx.shadowColor='#ff2020';ctx.shadowBlur=8;ctx.fillStyle='#ff3a2a';ctx.fillRect(sx-2.2*s+sw*.3+lean*.5,sy-53.4*s,1*s,1*s);ctx.fillRect(sx+1.2*s+sw*.3+lean*.5,sy-53.4*s,1*s,1*s);ctx.shadowBlur=0;}
function drawSurv(e){const[sx,sy]=scr(e.x,e.y),s=Z,side=(Math.cos(e.face)-Math.sin(e.face))>=0?1:-1,sit=e.anim==='assis',bob=e.moving?Math.abs(Math.sin(e.ph*10))*1.4*s:0,dy=sit?9*s:0;
  shadow(sx,sy,9);ctx.fillStyle=vgrad(sy-30*s+dy,sy-3*s,e.col[0],e.col[1]);ctx.beginPath();ctx.moveTo(sx-6*s,sy-30*s+dy-bob);ctx.lineTo(sx+6*s,sy-30*s+dy-bob);ctx.lineTo(sx+(sit?10:8)*s,sy-3*s);ctx.lineTo(sx-(sit?10:8)*s,sy-3*s);ctx.closePath();ctx.fill();
  ctx.fillStyle='#c4a07c';ctx.beginPath();ctx.arc(sx,sy-34*s+dy-bob,4.2*s,0,7);ctx.fill();
  if(e.anim==='etire'){ctx.strokeStyle=e.col[0];ctx.lineWidth=2.4*s;ctx.beginPath();ctx.moveTo(sx-4*s,sy-28*s);ctx.lineTo(sx-6*s,sy-42*s-Math.sin(e.ph*2)*2*s);ctx.moveTo(sx+4*s,sy-28*s);ctx.lineTo(sx+6*s,sy-42*s-Math.sin(e.ph*2)*2*s);ctx.stroke();}
  if(e.anim==='botte'){ctx.strokeStyle='#2a2018';ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(sx,sy-8*s);ctx.lineTo(sx+side*9*s,sy-12*s);ctx.stroke();}
  if(e.anim==='parle'&&Math.sin(e.ph*3)>.6){ctx.fillStyle='rgba(230,220,200,.75)';ctx.beginPath();ctx.ellipse(sx+side*8*s,sy-46*s,5*s,3*s,0,0,7);ctx.fill();}}
function drawCat(c){const[sx,sy]=scr(c.x,c.y),s=Z,side=(Math.cos(c.face)-Math.sin(c.face))>=0?1:-1,j=c.jump>0?Math.sin(c.jump/.5*Math.PI)*12*s:0,st=c.moving?Math.sin(c.ph*16)*1.5*s:0;
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(sx,sy,6*s,2.5*s,0,0,7);ctx.fill();ctx.fillStyle='#2a2622';
  if(c.sit){ctx.beginPath();ctx.ellipse(sx,sy-5*s,4*s,5*s,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(sx+side*1*s,sy-11*s,3*s,0,7);ctx.fill();}
  else{ctx.fillRect(sx-5*s+st,sy-3*s-j,1.5*s,3*s);ctx.fillRect(sx+3*s-st,sy-3*s-j,1.5*s,3*s);ctx.beginPath();ctx.ellipse(sx,sy-5*s-j,6*s,2.8*s,0,0,7);ctx.fill();ctx.beginPath();ctx.arc(sx+side*6*s,sy-8*s-j,2.6*s,0,7);ctx.fill();
    ctx.strokeStyle='#2a2622';ctx.lineWidth=1.4*s;ctx.beginPath();ctx.moveTo(sx-side*5*s,sy-6*s-j);ctx.quadraticCurveTo(sx-side*9*s,sy-12*s-j,sx-side*8*s,sy-14*s-j);ctx.stroke();}
  ctx.fillStyle='#e8d060';ctx.fillRect(sx+side*(c.sit?2:7)*s-1,sy-(c.sit?12:9)*s-j,1.2*s,1*s);}
function drawBirds(L){ctx.strokeStyle='rgba(20,16,14,.85)';ctx.lineWidth=1.4*Z;for(const b of L.birds){const[sx,sy]=scr(b.x,b.y),y=sy-b.h*20*Z,w=Math.sin(b.ph)*2.5*Z;ctx.beginPath();ctx.moveTo(sx-5*Z,y-w);ctx.lineTo(sx,y);ctx.lineTo(sx+5*Z,y-w);ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.15)';ctx.fillRect(sx-2*Z,sy-1,4*Z,2);}}
let RIFT_HP=1.10,RIFT_DMG=1.055;
let S=null,p=null;
