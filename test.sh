#!/bin/bash
set -e

if [ "$1" = "install" ]; then
  echo "No dependencies needed."
  exit 0
fi

echo "Running sample example..."

if diff -u expected.txt <(node example.mjs); then
  echo "Example output matches expected output."
else
  echo "Example output does not match expected output!"
  exit 1
fi

echo "Running my tests..."
node tests.mjs

echo "All tests passed!"