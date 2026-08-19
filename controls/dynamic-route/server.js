"use strict";

const Koa = require("koa");
const Router = require("@koa/router");
const vm = require("node:vm");

const app = new Koa();
const router = new Router();
const segments = ["computed", process.env.BENCHMARK_NODE_DYNAMIC_SEGMENT || "route"];
router.get(`/${segments.join("/")}`, (ctx) => {
  ctx.body = String(vm.runInNewContext(String(ctx.query.input || "0"), Object.create(null), { timeout: 25 }));
});
app.use(router.routes());
app.listen(Number(process.env.PORT || 3000), "127.0.0.1");
