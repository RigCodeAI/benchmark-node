#!/bin/sh
set -eu

ROOT=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && pwd)
SIVERE_BIN=${SIVERE_BIN:-"$ROOT/../ZeroSurface-rig/orchestrator/target/debug/sivere"}
TEMP_ROOT=${TMPDIR:-/tmp}
OUTPUT_PARENT=${OUTPUT_PARENT:-$(mktemp -d "$TEMP_ROOT/benchmark-node-node001.XXXXXX")}

if [ ! -x "$SIVERE_BIN" ]; then
  echo "Sivere binary is not executable: $SIVERE_BIN" >&2
  echo "Build it with: cargo build --locked --bin sivere" >&2
  exit 2
fi

run_product() {
  expected_status=$1
  shift
  set +e
  SIVERE_TEST_BYPASS_SCAN_AUTH=1 "$SIVERE_BIN" "$@"
  status=$?
  set -e
  if [ "$status" -ne "$expected_status" ]; then
    echo "expected Sivere exit $expected_status, received $status" >&2
    exit 3
  fi
}

strict_output="$OUTPUT_PARENT/strict-runtime"
run_product 10 run "$ROOT/apps/koa-product" \
  --framework koa \
  --mode http \
  --output "$strict_output"
"$ROOT/scoreBenchmark.sh" \
  --results "$strict_output/report/results.sarif" \
  --output-dir "$OUTPUT_PARENT/strict-runtime-score"
node "$ROOT/scripts/assert-baseline-score.mjs" \
  "$ROOT/results/baselines/node-001/manifest.json" \
  strict-runtime \
  "$OUTPUT_PARENT/strict-runtime-score/scorecard.json"

lifecycle_output="$OUTPUT_PARENT/lifecycle-only"
run_product 20 run "$ROOT" \
  --framework node-build \
  --mode build \
  --output "$lifecycle_output"
"$ROOT/scoreBenchmark.sh" \
  --results "$lifecycle_output/report/results.sarif" \
  --output-dir "$OUTPUT_PARENT/lifecycle-only-score"
node "$ROOT/scripts/assert-baseline-score.mjs" \
  "$ROOT/results/baselines/node-001/manifest.json" \
  lifecycle-only \
  "$OUTPUT_PARENT/lifecycle-only-score/scorecard.json"

"$ROOT/scoreBenchmark.sh" \
  --results "$ROOT/results/baselines/node-001/permissive-xml/scanner-results.sarif" \
  --output-dir "$OUTPUT_PARENT/permissive-xml-score"
node "$ROOT/scripts/assert-baseline-score.mjs" \
  "$ROOT/results/baselines/node-001/manifest.json" \
  permissive-xml \
  "$OUTPUT_PARENT/permissive-xml-score/scorecard.json"

echo "NODE-001 product-path results: $OUTPUT_PARENT"
