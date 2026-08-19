"use strict";

const Koa = require("koa");
const Router = require("@koa/router");
const app = new Koa();
const router = new Router();
router.get("/unsupported", (ctx) => { ctx.body = String(ctx.query.input || "unknown"); });
app.use(router.routes());
app.listen(Number(process.env.PORT || 3000), "127.0.0.1");
