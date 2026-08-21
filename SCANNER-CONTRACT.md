# Scanner contracts

BenchmarkNode exposes two separate contracts.

## Public accuracy

Any scanner may submit SARIF 2.1.0, JSON, or CSV. A finding must identify a
category and at least one stable case identity: case ID, route, or case-bearing
source location. No Sivere-specific data is required.

```bash
./scoreBenchmark.sh --results results/my-tool.sarif --output-dir results/my-tool
```

The scorer counts a report on a vulnerable control as a true positive, a missing
report as a false negative, a report on a safe control as a false positive, and
an unreported safe control as a true negative. Unmapped findings are false
positives. Duplicate findings do not improve the score.

## High-assurance qualification

Tools claiming complete runtime coverage may additionally emit
`schemas/qualification-evidence-v1.schema.json`. That envelope binds every
observation to the exact runtime, framework, repository, publication state,
coverage result, and evidence grade.

```bash
cargo run --release --locked -- score \
  --truth truth-v1.json \
  --evidence /immutable/scanner-evidence.json \
  --output /immutable/qualification.json
```

Repeat `--held-out PATH` for independent held-out applications. Add
`--require-promotion` to exit 30 until accuracy, evidence, coordinate, and
held-out gates all pass.

The product under test must not read `truth-v1.json` or expected results while it
analyzes the applications. This repository alone owns truth and scoring.
