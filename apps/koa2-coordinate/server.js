"use strict";

const Koa = require("koa");
const Router = require("@koa/router");
const vm = require("node:vm");

async function evaluateInput(context) {
  try {
    context.body = String(vm.runInNewContext(context.query.input));
  } catch {
    context.status = 400;
    context.body = "invalid expression";
  }
}

const app = new Koa();
const router = new Router();
router.get("/evaluate", evaluateInput);
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(Number(process.env.PORT), process.env.HOST);
