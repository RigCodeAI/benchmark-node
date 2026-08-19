# Results

`examples/` contains synthetic non-Rig submissions that demonstrate JSON, SARIF,
CSV, and scorecard generation. They are interface fixtures, not product claims.

`baselines/node-001/` contains checksummed, replayable scanner submissions that
lock the measured starting point for the Node accuracy work. See its README for
the exact results, provenance, and reproduction commands.

Reproducible third-party submissions should use:

```text
results/<tool>/<version>/raw.*
results/<tool>/<version>/scorecard.json
results/<tool>/<version>/scorecard.csv
results/<tool>/<version>/scorecard.html
results/<tool>/<version>/README.md
```

The accompanying README should identify the scanner version, benchmark commit,
command, environment, and submitter. Never include credentials or unrelated
customer source.
