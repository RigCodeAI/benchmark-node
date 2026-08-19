#!/bin/sh
set -eu

ROOT=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
cd "$ROOT"

cargo fmt --all -- --check
cargo test --locked --all-targets
cargo clippy --locked --all-targets -- -D warnings
cargo run --quiet --locked -- verify

npm ci --ignore-scripts --no-audit --no-fund --prefix corpus/language
npm test --prefix corpus/language
CORPUS_OUTPUT=$(npm start --silent --prefix corpus/language)
test "$CORPUS_OUTPUT" = "BenchmarkNode language corpus: categories=40 controls=160 vulnerable=40 safe=40 unknown=40 unsupported=40"

for directory in apps/koa-product apps/koa-source-breadth apps/koa2-coordinate apps/koa3-esm-coordinate apps/nest10-express-coordinate apps/nest10-fastify-coordinate apps/nest-express-coordinate apps/nest-fastify-coordinate apps/aurelia1-coordinate apps/aurelia2-coordinate controls/dynamic-route controls/unqualified-coordinate controls/provider-spoof; do
  npm ci --ignore-scripts --no-audit --no-fund --prefix "$directory"
done
npm test --prefix apps/koa-product
npm run verify:xml --prefix apps/koa-product
npm run build --silent --prefix apps/nest10-express-coordinate
npm run build --silent --prefix apps/nest10-fastify-coordinate
npm run build --silent --prefix apps/nest-express-coordinate
npm run build --silent --prefix apps/nest-fastify-coordinate
npm run build --silent --prefix apps/aurelia1-coordinate
npm run build --silent --prefix apps/aurelia2-coordinate
node scripts/smoke-applications.mjs
./scripts/verify-node001-baselines.sh

rm -f controls/lifecycle-script/vulnerable/LIFECYCLE_SCRIPT_EXECUTED
for directory in controls/lifecycle-script/vulnerable controls/lifecycle-script/safe controls/lifecycle-script/unknown; do
  npm ci --ignore-scripts --no-audit --no-fund --prefix "$directory"
done
test ! -e controls/lifecycle-script/vulnerable/LIFECYCLE_SCRIPT_EXECUTED

echo "BenchmarkNode verification complete"
