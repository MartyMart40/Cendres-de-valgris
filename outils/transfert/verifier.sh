#!/usr/bin/env bash
# Vérifie que le découpage n'a rien changé : chaque ligne de la v5.8 se retrouve une seule fois, intacte.
# Usage : bash outils/transfert/verifier.sh   (depuis la racine du dépôt)
set -uo pipefail
REF=tests/reference/v5.8.html
MAN=outils/transfert/decoupage.txt
N=$(wc -l < "$REF")
err=0
plages(){ grep -v '^#' "$MAN" | grep -v '^\s*$'; }

# 1. Chaque ligne de la v5.8 est couverte une seule fois (la page couvre 1-9, 100-132 et 1980-1981 ;
#    les balises <style>, </style>, <script> et </script> des lignes 10, 99, 133 et 1979 sont remplacées)
cov=$( { plages | awk '{print $2, $3}'; echo "1 10"; echo "99 133"; echo "1979 $N"; } |
  awk '{for(i=$1;i<=$2;i++)c[i]++} END{for(i=1;i<='"$N"';i++) if(c[i]!=1) print i": "c[i]+0}')
if [[ -n $cov ]]; then echo "ÉCHEC couverture :"; echo "$cov" | head; err=1; else echo "OK : les $N lignes sont couvertes une seule fois."; fi

# 2. Chaque fichier est identique aux plages de la v5.8 (hors ligne 'use strict' ajoutée)
for f in $(plages | awk '!vu[$1]++{print $1}'); do
  attendu=$(plages | awk -v f="$f" '$1==f{print $2, $3}' | while read -r a b; do sed -n "${a},${b}p" "$REF"; done)
  recu=$(cat "$f")
  if [[ $f == *.js && $(head -1 "$f") == "'use strict';" && $(plages | awk -v f="$f" '$1==f{print $2; exit}') != 134 ]]; then recu=$(tail -n +2 "$f"); fi
  if [[ "$recu" != "$attendu" ]]; then echo "ÉCHEC contenu : $f"; err=1; fi
done
[[ $err == 0 ]] && echo "OK : les $(plages | awk '!vu[$1]++' | wc -l) fichiers sont identiques à la v5.8."

# 3. La page garde son en-tête et son corps intacts
page=$( { sed -n '1,9p' "$REF"; sed -n '100,132p' "$REF"; sed -n "1980,${N}p" "$REF"; } )
recu=$(grep -v -e '^<link rel="stylesheet" href="css/style.css">$' -e '^<script src="js/.*"></script>$' index.html)
if [[ "$recu" != "$page" ]]; then echo "ÉCHEC : index.html"; err=1; else echo "OK : index.html garde l'en-tête et le corps de la v5.8."; fi
exit $err
