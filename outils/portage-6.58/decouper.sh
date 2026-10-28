#!/usr/bin/env bash
# Découpe la v6.58 d'un seul fichier (l'artefact) selon decoupage.txt. Sert une seule fois, au portage.
# Usage : bash outils/portage-6.58/decouper.sh   (depuis la racine du dépôt)
set -euo pipefail
REF=tests/reference/v6.58.html
MAN=outils/portage-6.58/decoupage.txt
plages(){ grep -v '^#' "$MAN" | grep -v '^\s*$'; }

rm -f js/*.js js/*/*.js
plages | awk '{print $1}' | sort -u | while read -r f; do mkdir -p "$(dirname "$f")"; : > "$f"; done
plages | while read -r f a b; do
  # Chaque fichier JS est un script à part : il reprend le mode strict (la ligne 197 l'a déjà)
  if [[ $f == *.js && ! -s $f && $a != 197 ]]; then echo "'use strict';" >> "$f"; fi
  sed -n "${a},${b}p" "$REF" >> "$f"
done

# La page : en-tête, feuille de style, corps, puis les scripts dans l'ordre de decoupage.txt
{
  sed -n '1,9p' "$REF"
  echo '<link rel="stylesheet" href="css/style.css">'
  sed -n '153,195p' "$REF"
  plages | awk '$1 ~ /\.js$/ && !vu[$1]++ {print "<script src=\"" $1 "\"></script>"}'
  sed -n '5668,5669p' "$REF"
} > index.html
echo "Découpage fait."
