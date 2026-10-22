'use strict';
/* Boss : salves, invocations, répliques, quête liée */
const BOSS_BASE={volley:{n:10,nEnr:14,cd:4.5,cdEnr:3,dmg:4},summon:{type:'charognard',n:3,every:11,max:7}};
const BOSSES={
  /* Acolytes de Varsha : mini:true. Chacun a son comportement (voir BEHAV) et ses répliques. */
  ossira:{mon:'ossira',mini:true,col:'#c8b8ff',wake:'Ossira tisse sa toile',death:'Ossira la Tisseuse est vaincue',web:{every:3.2,r:1.7,t:6,arm:.6}},
  korr:{mon:'korr',mini:true,col:'#ff8a3a',wake:'Korr gratte le sol',death:'Korr le Brûle-Tombes est vaincu',charge:{every:5.5,tel:.8,dur:.7,speed:12,trail:3,hit:1.4,burn:.4}},
  meliane:{mon:'meliane',mini:true,col:'#c8d8ff',wake:'Méliane se met à pleurer',death:'Méliane la Pleureuse est vaincue',call:'Méliane gémit : ses pleureuses accourent.',blink:{every:5.5},summon:{type:'pleureuse',n:3,every:8,max:6}},
  /* Lieutenants de Valgris (acte II) */
  heraut:{mon:'heraut',mini:true,col:'#e0dccc',wake:'Le Héraut gris lève son étendard',death:'Le Héraut gris est vaincu',banner:{every:22,r:7,buff:1.4,shield:.15}},
  cineraire:{mon:'cineraire',mini:true,col:'#c8c4bc',wake:'Dame Cinéraire étend ses cendres',death:'Dame Cinéraire est vaincue',ash:{every:2.4,r:1.4,t:8,arm:.9,burn:.5,max:8}},
  forgeron:{mon:'forgeron',mini:true,col:'#d0d4da',wake:'Le Forgeron sans visage frappe son enclume',death:'Le Forgeron sans visage est vaincu',shell:{part:.45,vuln:6,mult:1.6,stun:2}},
  /* Valgris ne meurt jamais : à zéro de vie, il plie et laisse le choix */
  valgris:{mon:'valgris',quest:'q5',own:true,undying:true,col:'#e8e0cc',wake:'« Enfin un visiteur. »',death:'Valgris s’est élevé',
    volley:{n:12,nEnr:16,cd:5,cdEnr:3.5,dmg:5},slam:{every:6,r:2.6,arm:1,hit:1.8},phase2:.66,phase3:.33,echo:.4,shrink:{from:13,to:3.5,speed:.35,dps:.9}},
  varsha:{mon:'varsha',quest:'q3',col:'#ff7a2a',volley:{n:10,nEnr:14,cd:4.5,cdEnr:3,dmg:4},summon:{type:'charognard',n:3,every:11,max:7},
    wake:'Varsha s’éveille',call:'Varsha appelle ses rejetons.',death:'Varsha est tombée'}
};
