# Scanner integration

## Accepted inputs

`scoreBenchmark.sh` accepts SARIF 2.1.0, JSON conforming to
`schemas/scanner-results-v1.schema.json`, or CSV with this header:

```text
category,case_id,route,path,line,rule_id
```

Standard categories use CWE IDs. Node-specific categories use their exact public
names, such as `NODE-EVENT-LOOP-STARVATION`. A stable `case_id` is the most precise
mapping. Routes and source locations are accepted for tools that cannot preserve
case IDs. Source matching uses the exact repository-relative path and line listed
in `cases/expected-results.csv`; it does not guess based only on a CWE.

```json
{
  "schema_version": "security-benchmark-scanner-results/v1",
  "benchmark_id": "sivere-benchmark-node-v1",
  "tool": { "name": "ExampleScanner", "version": "1.0", "kind": "SAST" },
  "findings": [
    { "category": "CWE-89", "case_id": "cwe-89-vulnerable" }
  ]
}
```

Run:

```bash
./scoreBenchmark.sh --results results.json --output-dir results/example
```

Keep the raw submission and generated scorecards together. Do not normalize a
result using private benchmark truth.
