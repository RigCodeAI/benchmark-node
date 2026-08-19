"use strict";

const Koa = require("koa");
const Router = require("@koa/router");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const app = new Koa();
const router = new Router();

function evaluate(ctx) {
  ctx.set("Access-Control-Allow-Origin", "*");
  const input = ctx.query.input;
  try {
    ctx.body = String(vm.runInNewContext(input, Object.create(null), { timeout: 100 }));
  } catch (error) {
    ctx.status = 400;
    ctx.body = error.name;
  }
}

router.get("/evaluate", evaluate);
router.get("/", (ctx) => {
  ctx.type = "html";
  ctx.body = fs.createReadStream(path.join(__dirname, "index.html"));
});
router.get("/app.bundle.js", (ctx) => {
  ctx.type = "application/javascript";
  ctx.body = fs.createReadStream(path.join(__dirname, "app.bundle.js"));
});
app.use(router.routes());
app.listen(Number(process.env.PORT || 3000), process.env.HOST || "127.0.0.1");
