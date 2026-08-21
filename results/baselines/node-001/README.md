# NODE-001 baseline

This directory preserves the three results that define the starting point for
closing BenchmarkNode's remaining public-accuracy gaps.

| Scenario | TP | FP | FN | TN | Purpose |
|---|---:|---:|---:|---:|---|
| Strict Koa runtime | 37 | 0 | 3 | 40 | Current fail-closed runtime behavior |
| Lifecycle-only | 1 | 0 | 39 | 40 | Proves the expected lifecycle finding is detected separately |
| Permissive XML diagnostic | 39 | 2 | 1 | 40 | Demonstrates the two XML cross-category false positives |

The lifecycle score is intentionally not a whole-benchmark product score. Its
single passing category is `NODE-PACKAGE-LIFECYCLE-SCRIPT`, at `1/0/0/1`. It
records the build-provenance slice that still needs to be aggregated with the
application scan.

The permissive XML result is a diagnostic negative control, not a supported Sivere
mode. It is replayable from the preserved real SARIF submission so the known-bad
behavior remains measurable without adding a product option that weakens XML
evidence requirements.

## Verify the preserved results

From the BenchmarkNode repository:

```bash
./scripts/verify-node001-baselines.sh
```

The command verifies every artifact checksum, re-scores every preserved scanner
submission with the current independent scorer, compares the generated JSON,
CSV, and HTML byte-for-byte, and checks the expected counts in `manifest.json`.

## Run the current product paths again

Build Sivere first, then run the capture helper:

```bash
cd ../ZeroSurface-rig/orchestrator
cargo build --locked --bin sivere

cd ../../benchmark-node
SIVERE_BIN="../ZeroSurface-rig/orchestrator/target/debug/sivere" \
  ./scripts/reproduce-node001-product-paths.sh
```

The helper sets the debug-only `SIVERE_TEST_BYPASS_SCAN_AUTH=1` qualification
contract. Release binaries deliberately ignore that variable and require a real
short-lived scan lease.

The helper runs the ordinary Koa application path and the separate Node
build-provenance path in fresh output directories. It also re-scores the
preserved permissive XML submission. It never overwrites this baseline.

Future fixes are expected to change fresh product results. The preserved inputs
remain immutable so changes to the scorer or benchmark truth cannot silently
rewrite the historical starting point.
