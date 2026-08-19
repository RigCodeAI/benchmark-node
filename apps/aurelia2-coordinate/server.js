"use strict";

const Koa = require("koa");
const Router = require("@koa/router");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const app = new Koa();
const router = new Router();

function evaluate(context) {
  context.set("Access-Control-Allow-Origin", "*");
  const input = context.query.input;
  try {
    context.body = String(vm.runInNewContext(input, Object.create(null), { timeout: 100 }));
  } catch (error) {
    context.status = 400;
    context.body = error.name;
  }
}

router.get("/evaluate", evaluate);
router.get("/", (context) => {
  context.type = "html";
  context.body = fs.createReadStream(path.join(__dirname, "index.html"));
});
router.get("/app.bundle.js", (context) => {
  context.type = "application/javascript";
  context.body = fs.createReadStream(path.join(__dirname, "app.bundle.js"));
});
app.use(router.routes());
app.listen(Number(process.env.PORT || 3000), process.env.HOST || "127.0.0.1");
