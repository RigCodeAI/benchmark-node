.PHONY: run run-koa2 run-koa-esm run-nest10 run-nest10-fastify run-nest run-nest-fastify run-aurelia1 run-aurelia2 score verify catalog

run:
	./runBenchmark.sh koa

run-koa2:
	./runBenchmark.sh koa2

run-koa-esm:
	./runBenchmark.sh koa-esm

run-nest10:
	./runBenchmark.sh nest10-express

run-nest10-fastify:
	./runBenchmark.sh nest10-fastify

run-nest:
	./runBenchmark.sh nest-express

run-nest-fastify:
	./runBenchmark.sh nest-fastify

run-aurelia1:
	./runBenchmark.sh aurelia1

run-aurelia2:
	./runBenchmark.sh aurelia2

score:
	@test -n "$(RESULTS)" || (echo "usage: make score RESULTS=path/to/results.sarif" >&2; exit 2)
	./scoreBenchmark.sh --results "$(RESULTS)" --output-dir results/local

verify:
	./verifyBenchmark.sh

catalog:
	cargo run --quiet --locked -- catalog --output-dir cases
