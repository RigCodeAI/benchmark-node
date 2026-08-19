# Scoring

For the public accuracy denominator:

| Expected control | Scanner reports it | Result |
|---|---:|---|
| Vulnerable | Yes | True positive |
| Vulnerable | No | False negative |
| Safe | Yes | False positive |
| Safe | No | True negative |

The scorecard reports per-category and aggregate TP, FP, FN, TN, true-positive
rate, false-positive rate, and balanced accuracy. An unmapped finding is a false
positive. Duplicate findings for the same case count once.

Unknown and unsupported controls do not affect the public accuracy score. They
are mandatory in qualification, where every category must also have the expected
evidence grade and the evidence envelope must be closed.

Use the exact release or commit, publish raw scanner output, and disclose scanner
version and configuration when sharing results.
