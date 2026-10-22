'use strict';
function skLvl(id){const b=p.sk[id]||0;if(!b)return 0;return b+(p.st?p.st.allSk:0);}
function branchPts(b){let n=0;for(const k in p.sk)if(SK[k]&&SK[k].br===b)n+=p.sk[k];return n;}
function unlocked(id){const s=SK[id];return p.lvl>=TL[s.ti]&&branchPts(s.br)>=TP[s.ti];}
function canRank(id){return p.pts>0&&SK[id]&&unlocked(id)&&(p.sk[id]||0)<RMAX;}
function rankUp(id,n){let k=0;while(k<n&&canRank(id)){p.pts--;p.sk[id]=(p.sk[id]||0)+1;k++;}
  if(k&&!SK[id].pas&&p.sk[id]===k&&!p.bar.includes(id)){const e=p.bar.indexOf(null);if(e>=0)p.bar[e]=id;}if(k)recalc();return k;}
function ptsEarned(){return(p.lvl-1)+Math.floor(p.lvl/5)+Math.max(0,(S?S.riftMax:1)-1);}
function resetTree(){p.sk={fire:1,nova:1};p.pts=ptsEarned();p.bar=['fire','nova',null,null];p.tv=2;recalc();}

