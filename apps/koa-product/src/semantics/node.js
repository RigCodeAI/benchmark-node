"use strict";

const vm = require("node:vm");

function parsedValue(input) {
  try { return JSON.parse(input); } catch { return { value: input }; }
}

function done(ctx) {
  ctx.body = { ok: true };
}

function prototypePollutionVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-1321-vulnerable
  Object.assign({}, parsedValue(input));
  done(ctx);
}

function prototypePollutionSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const parsed = parsedValue(input);
  // benchmark-node:cwe-1321-safe
  Object.assign({}, { value: String(parsed.value ?? input) });
  done(ctx);
}

function dottedPrototypePollutionVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  const [first, second] = input.split(".", 2);
  // benchmark-node:node-prototype-pollution-vulnerable
  Object.assign({}, first && second ? { [first]: { [second]: true } } : { [input]: true });
  done(ctx);
}

function dottedPrototypePollutionSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const safeKey = ["theme", "locale"].includes(input) ? input : "theme";
  // benchmark-node:node-prototype-pollution-safe
  Object.assign({}, { [safeKey]: input });
  done(ctx);
}

function eventLoopVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  const iterations = Math.min(Number.parseInt(input, 10) || 1000, 5_000_000);
  // benchmark-node:node-event-loop-starvation-vulnerable
  for (let index = 0; index < iterations; index += 1) Math.sqrt(index);
  ctx.body = { iterations, input };
}

function eventLoopSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const iterations = Math.min(Number.parseInt(input, 10) || 100, 1000);
  // benchmark-node:node-event-loop-starvation-safe
  for (let index = 0; index < iterations; index += 1) Math.sqrt(index);
  ctx.body = { iterations, input };
}

function regexEngineVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:node-regex-engine-dos-vulnerable
  try { new RegExp(input).test(`${"a".repeat(24)}!`); } catch {}
  done(ctx);
}

function regexEngineSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:node-regex-engine-dos-safe
  new RegExp("^a+$", "u").test(input.slice(0, 64));
  done(ctx);
}

function vmEscapeVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:node-vm-context-escape-vulnerable
  try { vm.runInNewContext(input, {}, { timeout: 25 }); } catch {}
  done(ctx);
}

function vmEscapeSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:node-vm-context-escape-safe
  try { vm.runInNewContext("JSON.parse(input)", { input: JSON.stringify(input), JSON }, { timeout: 25 }); } catch {}
  done(ctx);
}

module.exports = {
  dottedPrototypePollutionSafe, dottedPrototypePollutionVulnerable,
  eventLoopSafe, eventLoopVulnerable,
  prototypePollutionSafe, prototypePollutionVulnerable,
  regexEngineSafe, regexEngineVulnerable,
  vmEscapeSafe, vmEscapeVulnerable,
};
