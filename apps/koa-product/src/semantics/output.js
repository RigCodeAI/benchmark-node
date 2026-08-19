"use strict";

const http = require("node:http");
const pino = require("pino");
const { escapeHtml } = require("./helpers");

const logger = pino(
  { level: "info" },
  pino.destination({ dest: "/dev/null", sync: true }),
);

function done(ctx) {
  ctx.body = { ok: true };
}

function xssVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-79-vulnerable
  ctx.type = "html";
  ctx.body = `<main>${input}</main>`;
}

function xssSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-79-safe
  ctx.type = "html";
  ctx.body = `<main>${escapeHtml(input)}</main>`;
}

function encodingVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-116-vulnerable
  ctx.type = "html";
  ctx.body = `<div data-name="${input}">record</div>`;
}

function encodingSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-116-safe
  ctx.type = "html";
  ctx.body = `<div data-name="${escapeHtml(input)}">record</div>`;
}

function headerVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-113-vulnerable
  try { ctx.set("X-Benchmark-Name", input); } catch {}
  done(ctx);
}

function headerSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-113-safe
  ctx.set("X-Benchmark-Name", encodeURIComponent(input));
  done(ctx);
}

function templateVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  const ejs = require("ejs");
  // benchmark-node:cwe-1336-vulnerable
  try { ctx.body = ejs.render(input, { user: "benchmark" }); } catch { ctx.body = "invalid template"; }
}

function templateSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const ejs = require("ejs");
  // benchmark-node:cwe-1336-safe
  ctx.body = ejs.render("<%= user %>", { user: input });
}

function sensitiveResponseVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-200-vulnerable
  ctx.body = { password: input };
}

function sensitiveResponseSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-200-safe
  ctx.body = { recordId: input };
}

async function sensitiveOutboundVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-201-vulnerable
  await new Promise((resolve) => {
    const request = http.request({ host: "127.0.0.1", port: 9, method: "POST", timeout: 50 }, resolve);
    request.on("timeout", () => request.destroy());
    request.on("error", resolve);
    request.end(JSON.stringify({ password: input }));
  });
  done(ctx);
}

async function sensitiveOutboundSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-201-safe
  await new Promise((resolve) => {
    const request = http.request({ host: "127.0.0.1", port: 9, method: "POST", timeout: 50 }, resolve);
    request.on("timeout", () => request.destroy());
    request.on("error", resolve);
    request.end(JSON.stringify({ recordId: input }));
  });
  done(ctx);
}

function logExposureVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-532-vulnerable
  logger.info({ password: input }, "login");
  done(ctx);
}

function logExposureSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-532-safe
  logger.info({ accountId: input }, "login");
  done(ctx);
}

function redirectVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-601-vulnerable
  ctx.redirect(input);
}

function redirectSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-601-safe
  ctx.redirect(`/benchmark/health?next=${encodeURIComponent(input)}`);
}

function cookieVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-614-vulnerable
  ctx.append("Set-Cookie", `benchmark_session=${encodeURIComponent(input)}; Path=/`);
  done(ctx);
}

function cookieSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-614-safe
  ctx.append("Set-Cookie", `benchmark_session=${encodeURIComponent(input)}; Path=/; HttpOnly; Secure; SameSite=Strict`);
  done(ctx);
}

function trustBoundaryVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-501-vulnerable
  ctx.body = { role: input, subject: input };
}

function trustBoundarySafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-501-safe
  const role = input === "admin" ? "admin" : "user";
  ctx.body = { role, subject: input };
}

module.exports = {
  cookieSafe, cookieVulnerable,
  encodingSafe, encodingVulnerable,
  headerSafe, headerVulnerable,
  logExposureSafe, logExposureVulnerable,
  redirectSafe, redirectVulnerable,
  sensitiveOutboundSafe, sensitiveOutboundVulnerable,
  sensitiveResponseSafe, sensitiveResponseVulnerable,
  templateSafe, templateVulnerable,
  trustBoundarySafe, trustBoundaryVulnerable,
  xssSafe, xssVulnerable,
};
