# XML parser qualification

BenchmarkNode qualifies XML security behavior against exact installed parser versions. It does not treat a parser option or an input-to-parser flow as proof that an external resource was read or that nested entities expanded.

The executable check is:

```bash
npm run verify:xml --prefix apps/koa-product
```

The command records its deterministic result in `qualification/xml-parser-semantics-v1.json`.

## Qualified behavior

`fast-xml-parser` 5.11.0 rejects external entities whether `processEntities` is `true` or `false`. It expands a simple internal entity when the option is enabled, but it does not expand the benchmark's nested entity chain. It therefore is not the parser used for the CWE-611 and CWE-776 qualification cases.

`libxml2-wasm` 0.7.1 provides the required exact-coordinate distinction without a Node-native addon:

- CWE-611 vulnerable: `XML_PARSE_NOENT` substitutes content from an external file entity.
- CWE-611 safe: `XML_PARSE_NOENT | XML_PARSE_NO_XXE` executes substitution while blocking external resources.
- CWE-776 vulnerable: `XML_PARSE_NOENT | XML_PARSE_NONET` expands the nested internal entity chain.
- CWE-776 safe: `XML_PARSE_NONET` preserves the nested entity reference because substitution is not enabled.

The benchmark registers the parser's documented Node filesystem input
provider. The vulnerable CWE-611 behavior is therefore a read performed by the
real parser, not a benchmark-side file read. This WASM coordinate runs
unchanged on every qualified Node runtime.

The benchmark application calls the real parser in all four cases. It contains no manual file read or benchmark-only simulation of an XML effect.

## Product evidence expected from a scanner

The vulnerable CWE-611 case is confirmed only when the scanner proves that the
real parser substituted content from its own per-request marker file. The
vulnerable CWE-776 case is confirmed only when the real parser returns more
copies of the request marker than were present in the input. The corresponding
safe cases must execute the same parser boundary with substitution disabled and
must be reported as authoritative true negatives, not as missing findings.

Each effect must be tied to the request and parser call that caused it. A parser
setting, route name, source-to-parser flow, or attempted external URI is not by
itself sufficient effect evidence.
