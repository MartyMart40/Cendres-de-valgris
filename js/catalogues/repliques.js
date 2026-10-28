'use strict';
/* Répliques de Valgris (à remplir avec l’acte II) et mutations de la semaine (plus tard) */
const REPLIQUES={valgris:{
  1:{phase2:'« Mes serviteurs ne t’ont pas suffi ? Qu’ils reviennent. »',phase3:'« Les cendres se referment. Dépêche-toi. »',
    fall:'Valgris est tombé',hero:'« Enfin… j’ai réussi. »',rise:'La cendre se soulève. Quelque chose d’immense se relève.',
    ascend:['« C’est bien. Tu t’es bien débrouillé. »','« Tu viens de passer le test. Ce corps-là n’était qu’une épreuve, une des miennes. »','« Mais d’autres tests t’attendent, plus loin, là où les cendres changent de visage. Si tu les acceptes. »'],
    notyet:'« Pas encore ? Sage. Grandis un peu. Je serai là, comme toujours. »'},
  2:{arrive:'« Ici, le froid mord. Bonne chance. »',phase2:'« Encore toi. Mes serviteurs aussi ont la mémoire longue. »',phase3:'« Le froid se referme. Tu le sens ? »',
    fall:'Valgris est tombé',hero:'« Cette fois… c’est fini. »',rise:'Le givre éclate. Quelque chose d’immense se relève, encore plus grand.',
    ascend:['« Bien joué. Encore une fois. »','« Tu viens de passer un deuxième test. Je commence à t’apprécier. »','« Mais l’escalier continue. D’autres mondes, d’autres tests. Si tu les acceptes. »'],
    notyet:'« Pas encore ? Le froid conserve. Je t’attendrai. »'}}};
/* v5.29 : mutation de la semaine. La même pour tout le monde, tirée du numéro de la semaine (elle change le lundi). */
const MUTATIONS=[
  {id:'sang',n:'Lune de sang',d:'Les monstres frappent 20 % plus fort, mais donnent 25 % d’expérience en plus.'},
  {id:'avarice',n:'Avarice',d:'Deux fois plus d’or par terre, mais les fioles coûtent 50 % de plus.'},
  {id:'meute',n:'Meutes',d:'Deux fois plus de champions, et ils lâchent plus de butin.'},
  {id:'fragile',n:'Os fragiles',d:'Les monstres ont 20 % de vie en moins, mais ton armure compte 20 % de moins.'},
  {id:'ombres',n:'Ombres longues',d:'Toutes les zones sont plus sombres, mais le butin augmente de 20 %.'},
  {id:'hate',n:'Hâte',d:'Tout le monde va 15 % plus vite, toi compris.'},
  {id:'braises',n:'Braises vives',d:'Les monstres laissent parfois une flaque brûlante en mourant. Les coffres sont plus riches.'},
  {id:'calme',n:'Semaine calme',d:'Rien de spécial. Profites-en.'},
  {id:'brume',n:'Brume du dehors',d:'Une brume couvre toutes les zones, mais le butin augmente de 15 %.'},
  {id:'voile',n:'Voile mince',d:'Des Arpenteurs du Voile se promènent aussi dans les zones ordinaires.'},
  {id:'echos',n:'Échos',d:'Les champions se relèvent une fois, plus faibles. Ils lâchent deux fois.'},
  {id:'lourd',n:'Mains lourdes',d:'Tu frappes 25 % plus fort, mais ta vie maximale baisse de 25 %.'}];
function weekNo(t){return Math.floor(((t==null?Date.now():t)/86400000+3)/7);}
function mutation(t){const w=weekNo(t);let h=w*2654435761>>>0;h^=h>>>13;return MUTATIONS[(h>>>0)%MUTATIONS.length];}
function mut(id){return!!(S&&!S.noMut&&mutation(S.mutT).id===id);}
