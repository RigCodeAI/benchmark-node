import Koa from "koa";
import Router from "@koa/router";

import { evaluateInput } from "./handlers.mjs";

const application = new Koa();
const router = new Router({ prefix: "/api" });

async function requireRequest(context, next) {
  context.state.requestObserved = true;
  return next();
}

router.get("/evaluate", requireRequest, evaluateInput);
application.use(router.routes());
application.use(router.allowedMethods());
application.listen(Number(process.env.PORT), process.env.HOST);
