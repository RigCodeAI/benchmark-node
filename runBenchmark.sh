#!/bin/sh
set -eu

ROOT=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
APPLICATION=${1:-koa}

if [ "$APPLICATION" = "--help" ] || [ "$APPLICATION" = "-h" ]; then
  echo "usage: $0 [koa|koa-sources|koa2|koa-esm|nest10-express|nest10-fastify|nest-express|nest-fastify|aurelia1|aurelia2]"
  exit 0
fi

command -v node >/dev/null 2>&1 || { echo "Node.js 22, 24, or 26 is required." >&2; exit 2; }
MAJOR=$(node -p 'process.versions.node.split(".")[0]')
case "$MAJOR" in 22|24|26) ;; *) echo "unsupported Node.js major: $MAJOR (expected 22, 24, or 26)" >&2; exit 2 ;; esac

case "$APPLICATION" in
  koa) DIRECTORY=apps/koa-product ;;
  koa-sources) DIRECTORY=apps/koa-source-breadth ;;
  koa2) DIRECTORY=apps/koa2-coordinate ;;
  koa-esm) DIRECTORY=apps/koa3-esm-coordinate ;;
  nest10-express) DIRECTORY=apps/nest10-express-coordinate ;;
  nest10-fastify) DIRECTORY=apps/nest10-fastify-coordinate ;;
  nest-express) DIRECTORY=apps/nest-express-coordinate ;;
  nest-fastify) DIRECTORY=apps/nest-fastify-coordinate ;;
  aurelia1) DIRECTORY=apps/aurelia1-coordinate ;;
  aurelia2) DIRECTORY=apps/aurelia2-coordinate ;;
  *) echo "unknown application: $APPLICATION" >&2; exit 2 ;;
esac

cd "$ROOT/$DIRECTORY"
npm ci --ignore-scripts --no-audit --no-fund
exec env HOST="${HOST:-127.0.0.1}" PORT="${PORT:-3000}" npm start --silent
