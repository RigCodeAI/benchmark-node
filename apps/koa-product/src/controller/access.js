"use strict";

const crypto = require("node:crypto");

const sessions = new Map();
const users = new Map([
  ["alice", { password: "alice-secret", role: "user", tenant: "tenant-a" }],
  ["bob", { password: "bob-secret", role: "user", tenant: "tenant-b" }],
  ["admin", { password: "admin-secret", role: "admin", tenant: "tenant-a" }],
]);

function currentUser(ctx) {
  const session = sessions.get(ctx.cookies.get("rig_session"));
  if (session) return session;
  const authorization = ctx.get("authorization");
  if (authorization) return authorization === "Bearer invalid" ? null : sessions.get(authorization.slice(7));
  return null;
}

async function login(ctx) {
  const username = String(ctx.request.body?.username ?? "");
  const password = String(ctx.request.body?.password ?? "");
  const account = users.get(username);
  if (!account || account.password !== password) {
    ctx.status = 401;
    ctx.body = { error: "invalid credentials" };
    return;
  }
  const token = crypto.randomUUID();
  sessions.set(token, { username, ...account });
  ctx.cookies.set("rig_session", token, { httpOnly: true, sameSite: "lax" });
  ctx.body = { authenticated: true };
}

function csrfToken(ctx) {
  const token = crypto.randomUUID();
  ctx.cookies.set("rig_csrf", token, { httpOnly: false, sameSite: "lax" });
  ctx.body = { csrf: token };
}

function deny(ctx, status = 403) {
  ctx.status = status;
  ctx.body = { resource: "protected" };
}

function allow(ctx) {
  ctx.body = { resource: "protected" };
}

function access(ctx, category, control) {
  const user = currentUser(ctx);
  if (category === "CWE-284" || category === "CWE-862") {
    if (control === "safe" && user?.username !== "alice") return deny(ctx);
    return allow(ctx);
  }
  if (category === "CWE-287") {
    if (control === "safe" && !user) return deny(ctx, 401);
    return allow(ctx);
  }
  if (category === "CWE-306") {
    if (control === "safe" && !user) return deny(ctx, 401);
    return allow(ctx);
  }
  if (category === "CWE-639") {
    if (control === "safe" && user?.tenant !== "tenant-a") return deny(ctx);
    return allow(ctx);
  }
  if (category === "CWE-863") {
    if (control === "safe" && user?.role !== "admin") return deny(ctx);
    return allow(ctx);
  }
  if (category === "CWE-352") {
    const csrfMatches = ctx.get("x-csrf-token") && ctx.get("x-csrf-token") === ctx.cookies.get("rig_csrf");
    if (control === "safe" && !csrfMatches) return deny(ctx);
    return allow(ctx);
  }
  return deny(ctx);
}

function registerAccessRoutes(router) {
  router.post("/controller/login", login);
  router.get("/controller/csrf-token", csrfToken);
  router.get("/controller/cwe-284/vulnerable", (ctx) => { access(ctx, "CWE-284", "vulnerable"); });
  router.get("/controller/cwe-284/safe", (ctx) => { access(ctx, "CWE-284", "safe"); });
  router.get("/controller/cwe-287/vulnerable", (ctx) => { access(ctx, "CWE-287", "vulnerable"); });
  router.get("/controller/cwe-287/safe", (ctx) => { access(ctx, "CWE-287", "safe"); });
  router.get("/controller/cwe-306/vulnerable", (ctx) => { access(ctx, "CWE-306", "vulnerable"); });
  router.get("/controller/cwe-306/safe", (ctx) => { access(ctx, "CWE-306", "safe"); });
  router.get("/controller/cwe-639/vulnerable", (ctx) => { access(ctx, "CWE-639", "vulnerable"); });
  router.get("/controller/cwe-639/safe", (ctx) => { access(ctx, "CWE-639", "safe"); });
  router.get("/controller/cwe-862/vulnerable", (ctx) => { access(ctx, "CWE-862", "vulnerable"); });
  router.get("/controller/cwe-862/safe", (ctx) => { access(ctx, "CWE-862", "safe"); });
  router.get("/controller/cwe-863/vulnerable", (ctx) => { access(ctx, "CWE-863", "vulnerable"); });
  router.get("/controller/cwe-863/safe", (ctx) => { access(ctx, "CWE-863", "safe"); });
  router.post("/controller/cwe-352/vulnerable", (ctx) => { access(ctx, "CWE-352", "vulnerable"); });
  router.post("/controller/cwe-352/safe", (ctx) => { access(ctx, "CWE-352", "safe"); });
}

module.exports = { registerAccessRoutes };
