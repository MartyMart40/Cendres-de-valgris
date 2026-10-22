'use strict';
/* =====================================================================
   CATALOGUES
   Ajouter du contenu = ajouter une entrée dans le bon catalogue,
   sans toucher au reste du jeu.
   ===================================================================== */
/* Décors : couleurs du sol et des murs, obscurité (style visuel d’une zone) */
const DECORS={
  plain:{floor:[52,47,37],wall:[74,66,52],dark:.8},
  crypt:{floor:[42,42,50],wall:[70,68,82],dark:.9},
  lair:{floor:[54,30,25],wall:[88,42,33],dark:.86},
  town:{floor:[66,56,40],wall:[96,76,52],dark:.32}
};
const STYLES=DECORS;
