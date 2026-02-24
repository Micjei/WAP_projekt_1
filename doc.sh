#!/bin/bash
set -e

if [ "$1" = "install" ]; then
  echo "Installing JSDoc..."
  npm install jsdoc --save-dev
  exit 0
fi

echo "Generating documentation..."

npx jsdoc students.mjs -d docs

echo "Documentation generated in ./docs"