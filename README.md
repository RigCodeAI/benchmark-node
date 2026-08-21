# BenchmarkNode

BenchmarkNode is an open security benchmark for Node.js applications. It gives
security tools the same runnable Koa, NestJS, and Aurelia targets, then scores
their results against benchmark-owned expected outcomes.

The benchmark currently contains **40 categories and 160 controls**:

- 40 deliberately vulnerable controls;
- 40 safe controls that must not be reported;
- 40 unknown controls that test honest capability-gap reporting; and
- 40 unsupported controls that test exact runtime/framework support claims.

The public score uses only vulnerable and safe controls, so SAST, DAST, IAST,
and hybrid tools can all participate. The optional qualification score also
checks evidence quality, closed coverage, exact coordinates, and fail-closed
behavior. A scanner does not need to implement Sivere's evidence protocol to get
an accuracy score.

> **Safety warning:** these applications are intentionally vulnerable. Run them
> only on loopback or in an isolated container. Never expose them to a public
> network.

## Quick start

Requirements: Node.js 22, 24, or 26. Rust is needed only to build the independent
scorer.

```bash
git clone https://github.com/RigCodeAI/benchmark-node.git
cd benchmark-node

./runBenchmark.sh
```

The default Koa application starts at `http://127.0.0.1:3000`. Scan the source,
the running application, or both. Export SARIF 2.1.0, JSON, or CSV, then score it:

```bash
./scoreBenchmark.sh \
  --results /path/to/scanner-results.sarif \
  --output-dir results/my-scanner
```

The scorer writes `scorecard.json`, `scorecard.csv`, and `scorecard.html`.

## Applications

```bash
./runBenchmark.sh koa          # Koa 3, CommonJS; complete public denominator
./runBenchmark.sh koa-sources  # Query, path, body, header, cookie, stream, middleware, and principal sources
./runBenchmark.sh koa2         # Koa 2 coordinate
./runBenchmark.sh koa-esm      # Koa 3, native ESM
./runBenchmark.sh nest10-express # NestJS 10 with Express
./runBenchmark.sh nest10-fastify # NestJS 10 with Fastify
./runBenchmark.sh nest-express   # NestJS 11 with Express
./runBenchmark.sh nest-fastify   # NestJS 11 with Fastify
./runBenchmark.sh aurelia1     # Aurelia 1 browser-to-Koa journey
./runBenchmark.sh aurelia2     # Aurelia 2 browser-to-Koa journey
```

`docker compose up --build` starts the principal Koa, NestJS, and Aurelia targets.

## What is tested

The 34 shared categories cover injection, output contexts, sensitive data,
authentication, authorization, CSRF, tenant isolation, workflows, concurrency,
and multi-service behavior. Six Node-specific categories cover prototype
pollution, event-loop starvation, package lifecycle scripts, JavaScript regex
behavior, and VM context escape.

The locked coordinate family is Node 22.17.1, 22.23.2, 24.19.0, and 26.7.0; Koa 2.16.4
and 3.2.1; NestJS 10.4.22 and 11.2.1 with Express and Fastify; and Aurelia 1.4.1
and 2.0.0-rc.2. Unrecognized coordinates must be reported as unsupported, not
silently treated as safe.

Browse [the case catalog](cases/catalog.json) or the human-readable
[expected results](cases/expected-results.csv). See [QUICKSTART.md](QUICKSTART.md),
[scanner integration](docs/scanner-integration.md), [scoring](docs/scoring.md),
and [high-assurance qualification](docs/qualification.md) for details.

## Commands

```bash
make run
make score RESULTS=results/my-scanner.sarif
make verify
```

`./verifyBenchmark.sh` checks the scorer, generated catalogs, Node corpus,
applications, TypeScript builds, Aurelia builds, and hostile controls.

## Repository layout

```text
apps/           runnable Koa, NestJS, and Aurelia applications
cases/          generated public case catalog and expected results
controls/       unknown, unsupported, and hostile-repository controls
corpus/         language-level four-state denominator
schemas/        vendor-neutral and high-assurance input contracts
src/            independent Rust scorer
qualification/  evidence policy for stronger product claims
held-out/       governance contract for private generalization tests
```

BenchmarkNode is maintained by ZeroSurface and released under the MIT License.
Published results must identify the exact benchmark release or commit and include
the scanner configuration needed to reproduce the score.
