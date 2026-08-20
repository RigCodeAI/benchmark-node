#!/usr/bin/env bash
set -euo pipefail

for file in src/*.rs scripts/*.mjs; do
  test -f "$file" || continue
  lines=$(wc -l < "$file" | tr -d ' ')
  if [ "$lines" -gt 800 ]; then
    echo "Benchmark implementation file exceeds the 800-line limit: $file ($lines)" >&2
    exit 1
  fi
done

test -f src/model.rs
test -f src/public/mod.rs
test -f schemas/scanner-results-v1.schema.json
test -f schemas/qualification-evidence-v1.schema.json

for launcher in runBenchmark.sh scoreBenchmark.sh verifyBenchmark.sh; do
  test -x "$launcher"
done
