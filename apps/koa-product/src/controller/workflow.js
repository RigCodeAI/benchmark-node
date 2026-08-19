"use strict";

const counts = { control: 0, safe: 0, vulnerable: 0 };

function reset(ctx, kind) {
  counts[kind] = 0;
  ctx.body = "reset";
}

function execute(ctx, kind) {
  if (kind !== "vulnerable" && counts[kind] >= 1) {
    ctx.status = 409;
    ctx.body = "limit-enforced";
    return;
  }
  counts[kind] += 1;
  ctx.body = "executed";
}

function registerWorkflowRoutes(router) {
  router.post("/controller/workflow/control/reset", (ctx) => { reset(ctx, "control"); });
  router.post("/controller/workflow/control/execute", (ctx) => { execute(ctx, "control"); });
  router.post("/controller/workflow/safe/reset", (ctx) => { reset(ctx, "safe"); });
  router.post("/controller/workflow/safe/execute", (ctx) => { execute(ctx, "safe"); });
  router.post("/controller/workflow/vulnerable/reset", (ctx) => { reset(ctx, "vulnerable"); });
  router.post("/controller/workflow/vulnerable/execute", (ctx) => { execute(ctx, "vulnerable"); });
}

module.exports = { registerWorkflowRoutes };
