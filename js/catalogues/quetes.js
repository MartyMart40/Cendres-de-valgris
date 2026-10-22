'use strict';
/* Quêtes : textes de suivi, répliques de Corvel, récompenses. L’ordre du catalogue est l’ordre de l’histoire. */
const QUESTS={
  q1:{n:'Les plaines souillées',d:()=>`Abats 12 créatures dans ${zoneIn(zid(1,0))}.`,act:1,kill:{zone:0,n:12,done:'Quête accomplie : retourne voir Corvel'},
    track:{1:q=>`Créatures abattues : ${q.n} / 12`,2:()=>'Retourne voir Corvel.'},
    corvel:{0:()=>({say:'« Depuis que la montagne a craché ses cendres, les morts ne restent plus couchés. La plaine grouille de choses affamées. Éclaircis leurs rangs, et nous verrons si tu vaux qu’on t’en dise plus. »',btn:'Accepter la quête',act:'qacc'}),
      1:q=>({say:'« Il en reste. Retourne dans la plaine. »',st:`${q.n} sur 12 abattues.`}),
      2:()=>({say:'« Bien. Alors écoute : Varsha s’est terrée dans son Antre, au bout du chemin, derrière un sceau de cendre. Trois acolytes le nourrissent de leur vie : Ossira, Korr et Méliane. Abats-en au moins deux, et le sceau cédera. »',btn:'Recevoir la récompense',act:'qret'})},
    ret:()=>{S.q.q1.s=3;S.q.q2.s=Math.max(S.q.q2.s,acoCount()>=acoNeed()?2:1);gainXp(180);p.gold+=80;p.scroll+=2;save();npcDialog('corvel');toast('+80 or · 2 parchemins');}},
  q2:{n:'Les acolytes de Varsha',d:()=>`Abats au moins ${acoNeed()} des 3 acolytes de Varsha pour briser le sceau de l’Antre.`,act:1,
    track:{1:()=>`Acolytes vaincus : ${acoCount()} / 3 (${acoNeed()} suffisent)`,2:()=>'Le sceau est brisé. Retourne voir Corvel.'},
    corvel:{1:()=>({say:'« Le sceau tient encore. Les acolytes rôdent sur le chemin de l’Antre, chacun dans son repaire. »',st:acoList()}),
      2:()=>({say:'« Je l’ai senti d’ici : le sceau s’est brisé. Là-dessous, Varsha couve ses rejetons. Tue-la, et la plaine respirera. »',st:acoList(),btn:'Recevoir la récompense',act:'qret'})},
    ret:()=>{S.q.q2.s=3;S.q.q3.s=Math.max(S.q.q3.s,1);gainXp(500);p.gold+=150;p.pot+=3;save();npcDialog('corvel');toast('+150 or · 3 fioles');}},
  q3:{n:'La Mère des Cendres',d:'Descends dans l’Antre et abats Varsha.',act:1,
    track:{1:()=>`Descends dans l’Antre, au bout ${zoneDe(lastZone())}.`,2:()=>'Annonce la nouvelle à Corvel.'},
    corvel:{1:()=>({say:`« L’Antre s’ouvre au bout ${zoneDe(lastZone())}. Prends des fioles et un parchemin de portail. »`}),
      2:()=>({say:'« La Mère des Cendres est morte ? Alors c’est vrai, le vent tourne. Mais sa mort a fendu la pierre près du feu. Des failles s’y ouvrent, de plus en plus profondes. »',btn:'Terminer l’acte',act:'qret'})},
    ret:()=>{S.q.q3.s=3;S.done=true;gainXp(800);save();
      openPanel(`<h2>Acte I terminé</h2><p>${qt('q3end','Varsha n’est plus que cendre parmi les cendres. Mais une pierre s’est fendue près du feu du camp, et des failles s’y ouvrent. Au fond de l’Antre, un passage descend plus bas encore : l’acte II t’attend.')}</p><p class="st">Touche la pierre de faille pour descendre. Chaque gardien vaincu ouvre un niveau plus profond, sans limite.</p><button data-a="close">Continuer</button>`);}}
};
QUESTS.q4={n:'Les lieutenants de Valgris',d:()=>`Abats au moins ${acoNeed(2)} des 3 lieutenants de Valgris pour ouvrir son Sanctuaire.`,act:2,
  track:{1:()=>`Lieutenants vaincus : ${acoCount(2)} / 3 (${acoNeed(2)} suffisent)`,2:()=>'Le Sanctuaire est ouvert. Retourne voir Corvel.'},
  corvel:{0:()=>({say:'« Varsha est morte, et pourtant la cendre tombe encore. Quelqu’un tire les ficelles, plus bas : Valgris. Au fond de l’Antre, un passage descend vers son Sanctuaire. Trois lieutenants en gardent le sceau : le Héraut gris, Dame Cinéraire et le Forgeron sans visage. Abats-en au moins deux. »',btn:'Accepter la quête',act:'qacc'}),
    1:()=>({say:'« Les lieutenants tiennent encore le sceau du Sanctuaire. Le Héraut se cache derrière son étendard, la Dame sème la cendre, et le Forgeron ne saigne qu’une fois son armure brisée. »',st:acoList(2)}),
    2:()=>({say:'« Le sceau gris a cédé. Valgris t’attend. Il a l’air de trouver ça drôle, et ça ne me plaît pas. »',st:acoList(2),btn:'Recevoir la récompense',act:'qret'})},
  ret:()=>{S.q.q4.s=3;S.q.q5.s=Math.max(S.q.q5.s,1);gainXp(2500);p.gold+=600;p.pot=Math.min(POTIONS.fiole.max,p.pot+3);save();npcDialog('corvel');toast('+600 or · 3 fioles');}};
QUESTS.q5={n:'Valgris',d:'Descends dans le Sanctuaire et affronte Valgris.',act:2,
  track:{1:()=>`Affronte Valgris dans le Sanctuaire, au bout ${zoneDe(lastZone(2))}.`,2:()=>'Raconte à Corvel ce qui s’est passé.'},
  corvel:{1:()=>({say:`« Le Sanctuaire s’ouvre au bout ${zoneDe(lastZone(2))}. On dit que Valgris n’est jamais tombé. »`}),
    2:()=>({say:'« Tu l’as vu tomber, et il s’est relevé plus grand que le ciel ? … Alors personne ne l’a jamais vaincu. Il choisit qui passe. Et il t’a choisi. »',btn:'Terminer l’acte',act:'qret'})},
  ret:()=>{S.q.q5.s=3;gainXp(4000);save();
    openPanel(`<h2>Acte II terminé</h2><p>${qt('q5end','Tu as cru l’abattre. Valgris s’est relevé, immense, et t’a dit que ce n’était qu’un test. D’autres t’attendent, plus loin, là où les cendres changent de visage.')}</p><p class="st">Le passage vers le monde suivant arrive dans une prochaine version. En attendant, Valgris se refarme dans son Sanctuaire et les failles restent ouvertes.</p><button data-a="close">Continuer</button>`);}};
const QDEF=QUESTS;
const txt=v=>typeof v==='function'?v():v;
