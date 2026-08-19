"use strict";

async function charge(ctx, kind) {
  const shouldCharge = kind !== "safe";
  const correlation = ctx.get("x-rig-protocol-correlation");
  if (shouldCharge && correlation && process.env.RIG_BILLING_ORIGIN) {
    await fetch(`${process.env.RIG_BILLING_ORIGIN}/charge`, {
      method: "POST",
      headers: {
        "x-rig-witness-capability": process.env.RIG_BILLING_CAPABILITY ?? "",
        "x-rig-protocol-correlation": correlation,
      },
      body: JSON.stringify({ accepted: kind === "control" }),
    }).catch(() => {});
  }
  ctx.body = { state: kind === "safe" ? "declined" : "charged" };
}

function registerServiceRoutes(router) {
  router.post("/controller/service/control", async (ctx) => { await charge(ctx, "control"); });
  router.post("/controller/service/vulnerable", async (ctx) => { await charge(ctx, "vulnerable"); });
  router.post("/controller/service/safe", async (ctx) => { await charge(ctx, "safe"); });
}

module.exports = { registerServiceRoutes };
