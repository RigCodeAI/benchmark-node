# Quick start

## 1. Check prerequisites

```bash
node --version   # supported majors: 22, 24, 26
cargo --version  # needed for the scorer
```

## 2. Start the default application

```bash
./runBenchmark.sh koa
```

Leave it running at `http://127.0.0.1:3000`. Use one of the other application
names shown by `./runBenchmark.sh --help` to test framework coordinates.

## 3. Run your scanner

- SAST tools scan `apps/koa-product`.
- DAST and IAST tools scan the running loopback application.
- Hybrid tools may use both.

Export SARIF 2.1.0, JSON, or CSV as described in
[scanner integration](docs/scanner-integration.md).

## 4. Score the result

```bash
./scoreBenchmark.sh \
  --results /path/to/results.sarif \
  --output-dir results/my-tool-1.2.3
```

Open `results/my-tool-1.2.3/scorecard.html`. The adjacent JSON and CSV files are
for automation.

## 5. Verify the benchmark

```bash
./verifyBenchmark.sh
```

This checks the benchmark without running the intentionally unsafe package
lifecycle script.
