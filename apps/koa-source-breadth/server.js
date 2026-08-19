"use strict";

const vm = require("node:vm");
const Koa = require("koa");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  ctx.state.middlewareInput = ctx.get("x-middleware-input");
  ctx.state.principal = ctx.get("authorization").replace(/^Bearer\s+/iu, "");
  await next();
});

function evaluate(ctx, value) {
  try { vm.runInNewContext(String(value || "0"), Object.create(null), { timeout: 25 }); } catch {}
  ctx.body = { observed: true };
}

async function body(ctx) {
  const chunks = [];
  for await (const chunk of ctx.req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

router.get("/sources/query", (ctx) => evaluate(ctx, ctx.query.input));
router.get("/sources/path/:input", (ctx) => evaluate(ctx, ctx.params.input));
router.get("/sources/header", (ctx) => evaluate(ctx, ctx.get("x-benchmark-input")));
router.get("/sources/cookie", (ctx) => evaluate(ctx, ctx.cookies.get("benchmark_input")));
router.get("/sources/middleware", (ctx) => evaluate(ctx, ctx.state.middlewareInput));
router.get("/sources/principal", (ctx) => evaluate(ctx, ctx.state.principal));
router.post("/sources/json", async (ctx) => {
  const parsed = JSON.parse(await body(ctx));
  evaluate(ctx, parsed.input);
});
router.post("/sources/form", async (ctx) => evaluate(ctx, new URLSearchParams(await body(ctx)).get("input")));
router.post("/sources/multipart", async (ctx) => evaluate(ctx, await body(ctx)));
router.post("/sources/stream", async (ctx) => evaluate(ctx, await body(ctx)));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(Number(process.env.PORT || 3000), process.env.HOST || "127.0.0.1");
