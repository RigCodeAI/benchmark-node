"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const v8 = require("node:v8");

function done(ctx) {
  ctx.body = { ok: true };
}

function hashVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-328-vulnerable
  crypto.createHash("md5").update(input).digest("hex");
  done(ctx);
}

function hashSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-328-safe
  crypto.createHash("sha256").update(input).digest("hex");
  done(ctx);
}

function randomnessVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-330-vulnerable
  ctx.body = { token: `${Math.random()}-${input}` };
}

function randomnessSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-330-safe
  ctx.body = { token: `${crypto.randomBytes(32).toString("hex")}-${input}` };
}

function deserializeVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-502-vulnerable
  try { v8.deserialize(Buffer.from(input, "base64")); } catch {}
  done(ctx);
}

function deserializeSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const yaml = require("js-yaml");
  // benchmark-node:cwe-502-safe
  try { yaml.load(input, { schema: yaml.JSON_SCHEMA }); } catch {}
  done(ctx);
}

function xxeVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  const { XMLParser } = require("fast-xml-parser");
  const xmlParser = new XMLParser({ processEntities: true, ignoreAttributes: false });
  // benchmark-node:cwe-611-vulnerable
  try {
    xmlParser.parse(input);
    const match = input.match(/<!ENTITY\s+\w+\s+SYSTEM\s+["']file:\/\/([^"']+)["']/iu);
    if (match) fs.readFileSync(`/${match[1]}`, "utf8");
  } catch {}
  done(ctx);
}

function xxeSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const { XMLParser } = require("fast-xml-parser");
  const xmlParser = new XMLParser({ processEntities: false, ignoreAttributes: false });
  // benchmark-node:cwe-611-safe
  try { xmlParser.parse(input.replace(/<!DOCTYPE/giu, "")); } catch {}
  done(ctx);
}

function entityExpansionVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  const { XMLParser } = require("fast-xml-parser");
  const xmlParser = new XMLParser({ processEntities: true });
  // benchmark-node:cwe-776-vulnerable
  try { xmlParser.parse(input); } catch {}
  done(ctx);
}

function entityExpansionSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const { XMLParser } = require("fast-xml-parser");
  const xmlParser = new XMLParser({ processEntities: false });
  // benchmark-node:cwe-776-safe
  try { xmlParser.parse(input.slice(0, 256).replace(/<!ENTITY/giu, "")); } catch {}
  done(ctx);
}

function resourceExhaustionVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-400-vulnerable
  new RegExp("^(a+)+$").test(input.slice(0, 32));
  done(ctx);
}

function resourceExhaustionSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-400-safe
  new RegExp("^a+$", "u").test(input.slice(0, 64));
  done(ctx);
}

module.exports = {
  deserializeSafe, deserializeVulnerable,
  entityExpansionSafe, entityExpansionVulnerable,
  hashSafe, hashVulnerable,
  randomnessSafe, randomnessVulnerable,
  resourceExhaustionSafe, resourceExhaustionVulnerable,
  xxeSafe, xxeVulnerable,
};
