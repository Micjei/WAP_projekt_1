#!/bin/bash
set -e

if [ "$1" = "install" ]; then
  echo "No dependencies needed."
fi

echo "Running tests..."
node tests.mjs