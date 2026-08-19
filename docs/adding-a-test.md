# Adding or changing a test

1. State the security behavior and category in plain language.
2. Add vulnerable and safe controls using the same application shape.
3. Add an unknown control that exposes a real modeling or observation limit.
4. Ensure the unqualified-coordinate control remains unsupported.
5. Add or update the source, route, sink, rule, mapping, and required evidence
   grade in `scripts/generate-truth.mjs`.
6. Regenerate truth and catalogs:

   ```bash
   node scripts/generate-truth.mjs
   cargo run --locked -- catalog --output-dir cases
   ```

7. Run `./verifyBenchmark.sh`.
8. Obtain independent truth review. Scanner behavior is not evidence that truth
   should change.
