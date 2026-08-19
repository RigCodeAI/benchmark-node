#!/bin/sh
set -eu

ROOT=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
BASELINE="$ROOT/results/baselines/node-001"
TEMP_ROOT=${TMPDIR:-/tmp}
OUTPUT=$(mktemp -d "$TEMP_ROOT/benchmark-node-baseline.XXXXXX")

cleanup() {
  case "$OUTPUT" in
    "$TEMP_ROOT"/benchmark-node-baseline.*) rm -rf -- "$OUTPUT" ;;
    *) echo "refusing to remove unexpected temporary path: $OUTPUT" >&2 ;;
  esac
}
trap cleanup EXIT HUP INT TERM

(cd "$BASELINE" && shasum -a 256 -c SHA256SUMS)

verify_scenario() {
  scenario=$1
  input="$BASELINE/$scenario/scanner-results.sarif"
  expected="$BASELINE/$scenario"
  actual="$OUTPUT/$scenario"

  "$ROOT/scoreBenchmark.sh" --results "$input" --output-dir "$actual"
  cmp "$expected/scorecard.json" "$actual/scorecard.json"
  cmp "$expected/scorecard.csv" "$actual/scorecard.csv"
  cmp "$expected/scorecard.html" "$actual/scorecard.html"
  node "$ROOT/scripts/assert-baseline-score.mjs" \
    "$BASELINE/manifest.json" "$scenario" "$actual/scorecard.json"
}

verify_scenario strict-runtime
verify_scenario lifecycle-only
verify_scenario permissive-xml

echo "NODE-001 baseline verification complete"
