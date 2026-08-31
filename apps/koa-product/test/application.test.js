"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { handlers } = require("../src/semantics");
const { createApp } = require("../src/server");

test("the product denominator contains 29 runtime categories", () => {
  assert.equal(handlers.size, 29);
});

test("the Mongo control can be rebound to a disposable database", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "src", "semantics", "injection.js"),
    "utf8",
  );
  assert.match(source, /process\.env\.MONGODB_URI/);
});

test("the Koa application starts and serves the health endpoint", async (context) => {
  const server = createApp().listen(0, "127.0.0.1");
  context.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/benchmark/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ready" });
});

test("every runtime control is reachable without an unhandled server error", async (context) => {
  const server = createApp().listen(0, "127.0.0.1");
  context.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  for (const category of handlers.keys()) {
    for (const control of ["vulnerable", "safe"]) {
      const route = `/benchmark/${category.toLowerCase()}/${control}?input=1`;
      const response = await fetch(`http://127.0.0.1:${address.port}${route}`, { redirect: "manual" });
      assert.ok(response.status < 500, `${route} returned ${response.status}`);
      await response.arrayBuffer();
    }
  }
});
