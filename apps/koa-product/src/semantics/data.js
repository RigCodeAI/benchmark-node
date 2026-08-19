"use strict";

const crypto = require("node:crypto");
const v8 = require("node:v8");

let xmlRuntimePromise;

function loadXmlRuntime() {
  if (xmlRuntimePromise === undefined) {
    xmlRuntimePromise = Promise.all([
      import("libxml2-wasm"),
      import("libxml2-wasm/lib/nodejs.mjs"),
    ]).then(([runtime, nodeIntegration]) => {
      nodeIntegration.xmlRegisterFsInputProviders();
      return runtime;
    });
  }
  return xmlRuntimePromise;
}

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

async function xxeVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  const { ParseOption, XmlDocument } = await loadXmlRuntime();
  // Entity substitution is enabled and external resources are not blocked.
  // benchmark-node:cwe-611-vulnerable
  let document;
  try {
    document = XmlDocument.fromString(input, { option: ParseOption.XML_PARSE_NOENT });
  } catch {}
  finally { document?.dispose(); }
  done(ctx);
}

async function xxeSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const { ParseOption, XmlDocument } = await loadXmlRuntime();
  // Entity substitution runs, but external resources are explicitly blocked.
  // benchmark-node:cwe-611-safe
  let document;
  try {
    document = XmlDocument.fromString(input, {
      option: ParseOption.XML_PARSE_NOENT | ParseOption.XML_PARSE_NO_XXE,
    });
  } catch {}
  finally { document?.dispose(); }
  done(ctx);
}

async function entityExpansionVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  const { ParseOption, XmlDocument } = await loadXmlRuntime();
  // Internal entity substitution is enabled while network access is disabled.
  // benchmark-node:cwe-776-vulnerable
  let document;
  try {
    document = XmlDocument.fromString(input, {
      option: ParseOption.XML_PARSE_NOENT | ParseOption.XML_PARSE_NONET,
    });
  } catch {}
  finally { document?.dispose(); }
  done(ctx);
}

async function entityExpansionSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const { ParseOption, XmlDocument } = await loadXmlRuntime();
  // Network access is disabled and entity substitution is not enabled.
  // benchmark-node:cwe-776-safe
  let document;
  try {
    document = XmlDocument.fromString(input, { option: ParseOption.XML_PARSE_NONET });
  } catch {}
  finally { document?.dispose(); }
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
  prepareDataRuntime: loadXmlRuntime,
  xxeSafe, xxeVulnerable,
};
