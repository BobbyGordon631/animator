#!/usr/bin/env bash
# Rebuild the app into docs/ (which GitHub Pages serves from main /docs, at
# https://kksolve.com/animator/), then commit and push it.
#
#   ./deploy.sh             rebuild, commit, and push
#   ./deploy.sh --no-push   just rebuild docs/, to test it locally first:
#                           cd docs && python3 -m http.server
set -euo pipefail
cd "$(dirname "$0")"

gleam build --target javascript

# Copy the compiled JavaScript, leaving out the course's tests, the dev server,
# the test framework, and the compiler's cache, none of which the site needs.
excludes=(--exclude '_gleam_artefacts' --exclude 'gleeunit' --exclude 'gleam@@private_main_*')
for f in test/* dev/*; do
  name="$(basename "$f")"
  name="${name%.*}"
  excludes+=(--exclude "animator/$name.*" --exclude "animator/${name}_ffi.mjs")
done
rm -rf docs/javascript
mkdir -p docs/javascript
rsync -a "${excludes[@]}" build/dev/javascript/ docs/javascript/

# The page and its stylesheet, with the script path pointing into docs/. Every
# path is relative, since the site is served under /animator/.
sed 's#\./build/dev/javascript/#./javascript/#' index.html > docs/index.html
cp animator.css docs/animator.css
# Serve files as they are, without GitHub Pages' Jekyll processing.
touch docs/.nojekyll

echo "Rebuilt docs/."
if [[ "${1:-}" == "--no-push" ]]; then
  exit 0
fi

git add -A
if git diff --cached --quiet; then
  echo "Nothing changed, so nothing to deploy."
else
  git commit -m "Deploy $(date '+%Y-%m-%d %H:%M')"
  git push origin main
  echo "Pushed. GitHub Pages updates https://kksolve.com/animator/ in a minute or two."
fi
