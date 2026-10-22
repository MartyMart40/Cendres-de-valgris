#!/usr/bin/env bash
# Découpe la v5.8 d'un seul fichier selon decoupage.txt. Sert une seule fois, au transfert.
# Usage : bash outils/transfert/decouper.sh   (depuis la racine du dépôt)
set -euo pipefail
REF=tests/reference/v5.8.html
MAN=outils/transfert/decoupage.txt
plages(){ grep -v '^#' "$MAN" | grep -v '^\s*$'; }

# Fichiers vidés une fois, puis remplis plage par plage
plages | awk '{print $1}' | sort -u | while read -r f; do mkdir -p "$(dirname "$f")"; : > "$f"; done
plages | while read -r f a b; do
  # Chaque fichier JS est un script à part : il reprend le mode strict de la v5.8 (la ligne 134 l'a déjà)
  if [[ $f == *.js && ! -s $f && $a != 134 ]]; then echo "'use strict';" >> "$f"; fi
  sed -n "${a},${b}p" "$REF" >> "$f"
done

# La page : en-tête, feuille de style, corps, puis les scripts dans l'ordre de decoupage.txt
{
  sed -n '1,9p' "$REF"
  echo '<link rel="stylesheet" href="css/style.css">'
  sed -n '100,132p' "$REF"
  plages | awk '$1 ~ /\.js$/ && !vu[$1]++ {print "<script src=\"" $1 "\"></script>"}'
  sed -n '1980,1981p' "$REF"
} > index.html
echo "Découpage fait."
