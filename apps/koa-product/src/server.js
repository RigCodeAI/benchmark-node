"use strict";

const Koa = require("koa");
const Router = require("@koa/router");
const { bodyMiddleware } = require("./body");
const { registerControllerRoutes } = require("./controller");
const { prepareSemanticRuntime, registerSemanticRoutes } = require("./semantics");

function createApp() {
  const app = new Koa();
  const router = new Router();
  app.keys = ["benchmark-node-development-key"];
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: error instanceof Error ? error.name : "Error" };
    }
  });
  app.use(bodyMiddleware);
  router.get("/benchmark/health", (ctx) => { ctx.body = { status: "ready" }; });
  registerSemanticRoutes(router);
  registerControllerRoutes(router);
  app.use(router.routes());
  app.use(router.allowedMethods());
  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT ?? "3000");
  prepareSemanticRuntime()
    .then(() => {
      createApp().listen(port, "127.0.0.1", () => {
        process.stdout.write(`BenchmarkNode Koa application listening on http://127.0.0.1:${port}\n`);
      });
    })
    .catch((error) => {
      process.stderr.write(`BenchmarkNode initialization failed: ${String(error?.message || error)}\n`);
      process.exitCode = 1;
    });
}

module.exports = { createApp };
