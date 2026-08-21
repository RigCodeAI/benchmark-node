# Benchmark implementation map

`src/model.rs` defines the private truth, evidence, and scorecard records. `src/main.rs` validates high-assurance evidence and calculates the locked accuracy and assurance result. `src/public/` implements the vendor-neutral scanner-results interface. Application and corpus code remain independent of the scorer.

The benchmark never imports Rig product code. Rig consumes a pinned benchmark revision, emits results without reading truth, and invokes this scorer as an independent process.

Focused checks:

```bash
./scripts/check-architecture.sh
cargo test --locked --all-targets
./verifyBenchmark.sh
```

Owner: BenchmarkNode maintainers.
