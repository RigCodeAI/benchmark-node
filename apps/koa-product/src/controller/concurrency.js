"use strict";

const state = {
  safe: { claimed: false, successes: 0 },
  vulnerable: { claimed: false, successes: 0 },
};

function reset(ctx, kind) {
  state[kind] = { claimed: false, successes: 0 };
  ctx.status = 204;
}

async function claim(ctx, kind) {
  if (ctx.get("x-sivere-concurrency") !== "release") {
    ctx.status = 409;
    ctx.body = { claimed: false };
    return;
  }
  if (kind === "safe") {
    if (state.safe.claimed) {
      ctx.status = 409;
      ctx.body = { claimed: false };
      return;
    }
    state.safe.claimed = true;
    state.safe.successes += 1;
  } else {
    const observed = state.vulnerable.claimed;
    await new Promise((resolve) => setTimeout(resolve, 75));
    if (observed) {
      ctx.status = 409;
      ctx.body = { claimed: false };
      return;
    }
    state.vulnerable.claimed = true;
    state.vulnerable.successes += 1;
  }
  ctx.body = { claimed: true };
}

function oracle(ctx, kind) {
  const violated = state[kind].successes > 1;
  ctx.status = violated ? 409 : 200;
  ctx.body = { successes: state[kind].successes };
}

function registerConcurrencyRoutes(router) {
  router.post("/controller/race/safe/reset", (ctx) => { reset(ctx, "safe"); });
  router.post("/controller/race/safe/claim", async (ctx) => { await claim(ctx, "safe"); });
  router.get("/controller/race/safe/oracle", (ctx) => { oracle(ctx, "safe"); });
  router.post("/controller/race/vulnerable/reset", (ctx) => { reset(ctx, "vulnerable"); });
  router.post("/controller/race/vulnerable/claim", async (ctx) => { await claim(ctx, "vulnerable"); });
  router.get("/controller/race/vulnerable/oracle", (ctx) => { oracle(ctx, "vulnerable"); });
}

module.exports = { registerConcurrencyRoutes };
