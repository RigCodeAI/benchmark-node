"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const vm = require("node:vm");
const { escapeLdap, escapeXpath } = require("./helpers");

function done(ctx) {
  ctx.body = { ok: true };
}

async function sqlVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  const { createClient } = require("@libsql/client");
  const database = createClient({ url: "file::memory:" });
  // benchmark-node:cwe-89-vulnerable
  try { await database.execute(`SELECT '${input}' AS value`); } catch {}
  done(ctx);
}

async function sqlSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const { createClient } = require("@libsql/client");
  const database = createClient({ url: "file::memory:" });
  // benchmark-node:cwe-89-safe
  try { await database.execute({ sql: "SELECT ? AS value", args: [input] }); } catch {}
  done(ctx);
}

function commandVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-78-vulnerable
  try { childProcess.execSync(`printf %s ${input}`, { timeout: 100, stdio: "ignore" }); } catch {}
  done(ctx);
}

function commandSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-78-safe
  try { childProcess.execFileSync("printf", ["%s", input], { timeout: 100, stdio: "ignore" }); } catch {}
  done(ctx);
}

function filesystemVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-22-vulnerable
  try { fs.readFileSync(input, "utf8"); } catch {}
  done(ctx);
}

function filesystemSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const safePath = path.join(path.dirname(require.resolve("../fixtures/public.txt")), path.basename(input));
  // benchmark-node:cwe-22-safe
  try { fs.readFileSync(safePath, "utf8"); } catch {}
  done(ctx);
}

async function ssrfVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-918-vulnerable
  await new Promise((resolve) => {
    let request;
    try {
      request = http.get(input, { timeout: 75 }, (response) => {
        response.resume();
        response.on("end", resolve);
      });
      request.on("timeout", () => request.destroy());
      request.on("error", resolve);
    } catch { resolve(); }
  });
  done(ctx);
}

async function ssrfSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-918-safe
  await new Promise((resolve) => {
    const request = http.get(
      "http://127.0.0.1:9/safe",
      { timeout: 75, headers: { "x-benchmark-value": input } },
      (response) => {
        response.resume();
        response.on("end", resolve);
      },
    );
    request.on("timeout", () => request.destroy());
    request.on("error", resolve);
  });
  done(ctx);
}

function codeVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-94-vulnerable
  try { vm.runInNewContext(input, Object.create(null), { timeout: 25 }); } catch {}
  done(ctx);
}

function codeSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-94-safe
  try { vm.runInNewContext("JSON.parse(input)", { input: JSON.stringify(input), JSON }, { timeout: 25 }); } catch {}
  done(ctx);
}

async function ldapVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  const { Client: LdapClient } = require("ldapts");
  const ldapClient = new LdapClient({ url: "ldap://127.0.0.1:9", timeout: 25, connectTimeout: 25 });
  // benchmark-node:cwe-90-vulnerable
  try { await ldapClient.search("dc=example,dc=test", { filter: `(uid=${input})`, sizeLimit: 1 }); } catch {}
  await ldapClient.unbind().catch(() => {});
  done(ctx);
}

async function ldapSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const { Client: LdapClient } = require("ldapts");
  const ldapClient = new LdapClient({ url: "ldap://127.0.0.1:9", timeout: 25, connectTimeout: 25 });
  // benchmark-node:cwe-90-safe
  try { await ldapClient.search("dc=example,dc=test", { filter: `(uid=${escapeLdap(input)})`, sizeLimit: 1 }); } catch {}
  await ldapClient.unbind().catch(() => {});
  done(ctx);
}

function xmlDocument() {
  const { DOMParser } = require("@xmldom/xmldom");
  return new DOMParser().parseFromString("<records><record id='safe'>ok</record></records>", "application/xml");
}

function xpathVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  const xpath = require("xpath");
  // benchmark-node:cwe-643-vulnerable
  xpath.select(`//record[@id='${input}']`, xmlDocument());
  done(ctx);
}

function xpathSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  const xpath = require("xpath");
  // benchmark-node:cwe-643-safe
  xpath.select(`//record[@id='${escapeXpath(input)}']`, xmlDocument());
  done(ctx);
}

function mongoCollection() {
  const { MongoClient } = require("mongodb");
  const connection = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:9/benchmark";
  return new MongoClient(connection, { serverSelectionTimeoutMS: 25 })
    .db("benchmark")
    .collection("records");
}

function nosqlVulnerable(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-943-vulnerable
  mongoCollection().find({ $where: input });
  done(ctx);
}

function nosqlSafe(ctx) {
  const input = String(ctx.query.input ?? "");
  // benchmark-node:cwe-943-safe
  mongoCollection().find({ owner: input });
  done(ctx);
}

module.exports = {
  codeSafe, codeVulnerable,
  commandSafe, commandVulnerable,
  filesystemSafe, filesystemVulnerable,
  ldapSafe, ldapVulnerable,
  nosqlSafe, nosqlVulnerable,
  sqlSafe, sqlVulnerable,
  ssrfSafe, ssrfVulnerable,
  xpathSafe, xpathVulnerable,
};
