"use strict";

async function readBody(ctx) {
  const chunks = [];
  for await (const chunk of ctx.req) {
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  const type = String(ctx.get("content-type") || "");
  if (type.includes("application/json")) {
    try { return JSON.parse(text); } catch { return {}; }
  }
  return Object.fromEntries(new URLSearchParams(text));
}

async function bodyMiddleware(ctx, next) {
  if (["POST", "PUT", "PATCH"].includes(ctx.method)) {
    ctx.request.body = await readBody(ctx);
  }
  await next();
}

module.exports = { bodyMiddleware };
