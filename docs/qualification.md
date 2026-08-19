# High-assurance qualification

The public score measures vulnerable and safe accuracy. The qualification score
also verifies whether a product reports limitations honestly and has enough
evidence to support its result.

## Locked evidence

A complete locked submission contains one observation for each of the 160
controls: 40 findings, 40 authoritative clean results, 40 capability gaps, and
40 unsupported-coordinate results. It must use the exact evidence grade and
reason code declared by `truth-v1.json`, and its publication must be `FINAL` and
`COMPLETE` with no failed requests, unexpected facts, or unresolved checks.

Run the independent scorer:

```bash
cargo run --release --locked -- \
  score \
  --evidence /path/to/product-evidence.json \
  --output /path/to/qualification-score.json
```

An exact locked result passes the qualification score, but is not yet eligible
for promotion.

## Held-out evidence

Promotion requires repeated `--held-out` arguments for three separately
governed applications:

- one Koa repository;
- one NestJS repository; and
- one Aurelia browser/backend repository.

Their repository IDs and independent-truth digests must all differ. Every app
must contribute at least one finding and one clean control. Together, they must
cover all 40 vulnerable and all 40 safe categories. Each result must use the
ordinary product path and have a closed evidence envelope.

```bash
cargo run --release --locked -- \
  score \
  --evidence /path/to/locked-evidence.json \
  --held-out /private/koa/evidence.json \
  --held-out /private/nest/evidence.json \
  --held-out /private/aurelia/evidence.json \
  --require-promotion \
  --output /path/to/promotion-score.json
```

Checked-in fixtures, copies of this repository, and relabeled locked evidence
cannot satisfy the held-out gate. This is deliberate: the gate measures whether
the implementation generalizes beyond the applications used to build it.

## Unknown is not clean

The expected `UNKNOWN` cases test the signed runtime capability declaration.
They do not represent requests sent to fictional `/unknown` routes. A clean
control requires a real request, a discovered sensitive operation, and a closed
coverage denominator. See [the evidence policy](../qualification/evidence-policy.md).
