"use strict";

async function charge(ctx, kind) {
  const shouldCharge = kind !== "safe";
  const correlation = ctx.get("x-sivere-protocol-correlation");
  if (shouldCharge && correlation && process.env.SIVERE_BILLING_ORIGIN) {
    await fetch(`${process.env.SIVERE_BILLING_ORIGIN}/charge`, {
      method: "POST",
      headers: {
        "x-sivere-witness-capability": process.env.SIVERE_BILLING_CAPABILITY ?? "",
        "x-sivere-protocol-correlation": correlation,
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
