import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { categories } from "../corpus/language/src/corpus.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const controller = new Set(["CWE-284", "CWE-287", "CWE-306", "CWE-352", "CWE-362", "CWE-639", "CWE-840", "CWE-841", "CWE-862", "CWE-863"]);
const packageControl = new Set(["NODE-PACKAGE-LIFECYCLE-SCRIPT"]);

const properties = {
  "CWE-113": ["DIRECT", "RUNTIME_SEMANTIC", "http_response", "IAST.HTTP_HEADER.INJECTION"],
  "CWE-116": ["DIRECT", "RUNTIME_SEMANTIC", "output_encoding", "IAST.OUTPUT_ENCODING.INJECTION"],
  "CWE-1336": ["DIRECT", "RUNTIME_SEMANTIC", "template", "IAST.TEMPLATE.INJECTION"],
  "CWE-200": ["DIRECT", "RUNTIME_VALUE_FLOW", "sensitive_data", "IAST.SENSITIVE_DATA.RESPONSE_EXPOSURE"],
  "CWE-201": ["DIRECT", "RUNTIME_VALUE_FLOW", "sensitive_data", "IAST.SENSITIVE_DATA.OUTBOUND_EXPOSURE"],
  "CWE-22": ["DIRECT", "RUNTIME_EFFECT", "filesystem", "IAST.FILESYSTEM.INJECTION"],
  "CWE-284": ["CONTROLLER", "RUNTIME_DIFFERENTIAL", "access_control", "RIG.ACCESS_CONTROL.IMPROPER"],
  "CWE-287": ["CONTROLLER", "RUNTIME_DIFFERENTIAL", "authentication", "RIG.AUTHENTICATION.IMPROPER"],
  "CWE-306": ["CONTROLLER", "RUNTIME_DIFFERENTIAL", "authentication", "RIG.AUTHENTICATION.MISSING"],
  "CWE-328": ["ADAPTED", "RUNTIME_PROPERTY", "cryptography", "IAST.CRYPTO.WEAK_HASH"],
  "CWE-330": ["ADAPTED", "RUNTIME_PROPERTY", "randomness", "IAST.RANDOM.WEAK"],
  "CWE-352": ["CONTROLLER", "RUNTIME_DIFFERENTIAL", "csrf", "RIG.CSRF.MISSING_OR_INVALID"],
  "CWE-362": ["CONTROLLER", "RUNTIME_DIFFERENTIAL", "concurrency", "RIG.CONCURRENCY.RACE_CONDITION"],
  "CWE-400": ["ADAPTED", "RUNTIME_EFFECT", "resource_exhaustion", "IAST.REGEX.REDOS"],
  "CWE-501": ["DIRECT", "RUNTIME_VALUE_FLOW", "trust_boundary", "IAST.TRUST_BOUNDARY.VIOLATION"],
  "CWE-502": ["ADAPTED", "RUNTIME_SEMANTIC", "deserialization", "IAST.DESERIALIZATION.UNSAFE"],
  "CWE-532": ["DIRECT", "RUNTIME_VALUE_FLOW", "logging", "IAST.SENSITIVE_DATA.LOG_EXPOSURE"],
  "CWE-601": ["DIRECT", "RUNTIME_SEMANTIC", "redirect", "IAST.REDIRECT.UNVALIDATED"],
  "CWE-611": ["ADAPTED", "RUNTIME_EFFECT", "xml", "IAST.XML.EXTERNAL_ENTITY"],
  "CWE-614": ["DIRECT", "RUNTIME_PROPERTY", "cookie", "IAST.COOKIE.INSECURE"],
  "CWE-639": ["CONTROLLER", "RUNTIME_DIFFERENTIAL", "tenant_isolation", "RIG.AUTHORIZATION.CROSS_TENANT"],
  "CWE-643": ["ADAPTED", "RUNTIME_SEMANTIC", "xml_query", "IAST.XPATH.INJECTION"],
  "CWE-776": ["ADAPTED", "RUNTIME_EFFECT", "xml", "IAST.XML.ENTITY_EXPANSION"],
  "CWE-78": ["DIRECT", "RUNTIME_SEMANTIC", "process", "IAST.COMMAND.INJECTION"],
  "CWE-79": ["DIRECT", "RUNTIME_SEMANTIC", "html_output", "IAST.XSS.OUTPUT_CONTEXT"],
  "CWE-840": ["CONTROLLER", "RUNTIME_DIFFERENTIAL", "workflow", "RIG.BUSINESS_LOGIC.LIMIT_BYPASS"],
  "CWE-841": ["CONTROLLER", "RUNTIME_DIFFERENTIAL", "multi_service", "RIG.MULTI_SERVICE.FORBIDDEN_INTERACTION"],
  "CWE-862": ["CONTROLLER", "RUNTIME_DIFFERENTIAL", "access_control", "RIG.AUTHORIZATION.MISSING"],
  "CWE-863": ["CONTROLLER", "RUNTIME_DIFFERENTIAL", "access_control", "RIG.AUTHORIZATION.INCORRECT"],
  "CWE-89": ["DIRECT", "RUNTIME_SEMANTIC", "sql", "IAST.SQL.INJECTION"],
  "CWE-90": ["DIRECT", "RUNTIME_SEMANTIC", "directory_query", "IAST.LDAP.INJECTION"],
  "CWE-918": ["DIRECT", "RUNTIME_EFFECT", "outbound_http", "IAST.OUTBOUND_HTTP.INJECTION"],
  "CWE-94": ["DIRECT", "RUNTIME_EFFECT", "code_execution", "IAST.CODE.INJECTION"],
  "CWE-943": ["ADAPTED", "RUNTIME_SEMANTIC", "document_query", "IAST.NOSQL.INJECTION"],
  "CWE-1321": ["ADAPTED", "RUNTIME_SEMANTIC", "object_merge", "IAST.NODE.PROTOTYPE_POLLUTION"],
  "NODE-EVENT-LOOP-STARVATION": ["ADAPTED", "RUNTIME_EFFECT", "event_loop", "IAST.RESOURCE.EXHAUSTION"],
  "NODE-PACKAGE-LIFECYCLE-SCRIPT": ["ADAPTED", "BUILD_PROVENANCE", "package_lifecycle", "IAST.NODE.PACKAGE_LIFECYCLE_SCRIPT"],
  "NODE-PROTOTYPE-POLLUTION": ["ADAPTED", "RUNTIME_SEMANTIC", "object_path", "IAST.NODE.PROTOTYPE_POLLUTION_PATH"],
  "NODE-REGEX-ENGINE-DOS": ["ADAPTED", "RUNTIME_EFFECT", "regex", "IAST.NODE.REGEX_ENGINE_DOS"],
  "NODE-VM-CONTEXT-ESCAPE": ["ADAPTED", "RUNTIME_EFFECT", "vm", "IAST.NODE.VM_CONTEXT_ESCAPE"],
};

const supportPolicy = {
  schema_version: "rig-language-support-policy/v1",
  language: "javascript-typescript",
  state: "QUALIFICATION",
  runtime_family: "node-v8-supported-22-26",
  runtime_coordinates: ["node-22.17.1", "node-22.23.2", "node-24.19.0", "node-26.7.0"],
  framework_coordinates: [
    "koa-2.16.4_router-14", "koa-3.2.1_router-15", "nestjs-10.4.22-express",
    "nestjs-10.4.22-fastify", "nestjs-11.2.1-express", "nestjs-11.2.1-fastify",
    "aurelia-1.4.1-koa-3.2.1", "aurelia-2.0.0-rc.2-koa-3.2.1",
  ],
  adapter_family: "node-v8-loader-v2",
  categories,
  qualification_rules: {
    fail_closed_on_unknown_coordinate: true,
    require_held_out_applications: true,
    require_zero_false_positives: true,
    require_zero_false_negatives: true,
    require_closed_evidence: true,
  },
};
writeJson("support-policy-v1.json", supportPolicy);

const repositories = [
  ["koa-product", "apps/koa-product", "ORDINARY_PRODUCT_APPLICATION"],
  ["koa-source-breadth", "apps/koa-source-breadth", "SOURCE_BREADTH_CONTROL"],
  ["koa2-coordinate", "apps/koa2-coordinate", "FRAMEWORK_COORDINATE"],
  ["koa3-esm-coordinate", "apps/koa3-esm-coordinate", "FRAMEWORK_COORDINATE"],
  ["nest10-express-coordinate", "apps/nest10-express-coordinate", "FRAMEWORK_COORDINATE"],
  ["nest10-fastify-coordinate", "apps/nest10-fastify-coordinate", "FRAMEWORK_COORDINATE"],
  ["nest-express-coordinate", "apps/nest-express-coordinate", "FRAMEWORK_COORDINATE"],
  ["nest-fastify-coordinate", "apps/nest-fastify-coordinate", "FRAMEWORK_COORDINATE"],
  ["aurelia1-coordinate", "apps/aurelia1-coordinate", "FRAMEWORK_COORDINATE"],
  ["aurelia2-coordinate", "apps/aurelia2-coordinate", "FRAMEWORK_COORDINATE"],
  ["dynamic-route", "controls/dynamic-route", "UNKNOWN_CONTROL"],
  ["provider-spoof", "controls/provider-spoof", "HOSTILE_CONTROL"],
  ["lifecycle-vulnerable", "controls/lifecycle-script/vulnerable", "HOSTILE_CONTROL"],
  ["lifecycle-safe", "controls/lifecycle-script/safe", "SAFE_CONTROL"],
  ["lifecycle-unknown", "controls/lifecycle-script/unknown", "UNKNOWN_CONTROL"],
  ["unqualified-coordinate", "controls/unqualified-coordinate", "UNSUPPORTED_CONTROL"],
].map(([repository_id, repositoryPath, role]) => ({ repository_id, path: repositoryPath, role }));

const productCases = [];
const controllerCases = [];
for (const category of categories) {
  const [mapping, grade, sink, rule] = properties[category];
  for (const control of ["vulnerable", "safe", "unknown"]) {
    const detail = {
      case_id: `${category.toLowerCase()}-${control}`,
      repository_id: packageControl.has(category) ? `lifecycle-${control}` : "koa-product",
      control,
    };
    if (controller.has(category)) {
      detail.report = controllerReport(category);
      if (control !== "unknown") detail.route = controllerRoute(category, control);
      detail.source_location = control === "unknown"
        ? "qualification/runtime-capability-contract"
        : `apps/koa-product/.rig.json#${category.toLowerCase()}-${control}`;
      detail.sink_location = control === "unknown"
        ? `qualification/runtime-capability-contract#${category}`
        : controllerLocation(category);
      if (control !== "unknown") detail.test_id = `${category.toLowerCase()}-${control}`;
      if (control === "unknown") detail.reason_code = `declared_${category.toLowerCase()}_policy_required`;
      if (control === "vulnerable") detail.rule_id = rule;
      controllerCases.push(detail);
    } else {
      if (!packageControl.has(category) && control !== "unknown") {
        detail.route = `/benchmark/${category.toLowerCase()}/${control}`;
      }
      detail.sink_family = sink;
      detail.source_location = control === "unknown"
        ? "qualification/runtime-capability-contract"
        : packageControl.has(category)
        ? `controls/lifecycle-script/${control}/package.json`
        : detail.route;
      detail.sink_location = control === "unknown"
        ? `qualification/runtime-capability-contract#${category}`
        : packageControl.has(category)
        ? `controls/lifecycle-script/${control}/package.json#${control === "safe" ? "scripts" : "scripts.postinstall"}`
        : markedLocation(detail.case_id, `${semanticFile(category)}#${sink}`);
      if (control === "vulnerable") detail.rule_id = rule;
      if (control === "unknown") detail.reason_code = `node_${category.toLowerCase().replaceAll("-", "_")}_semantic_coordinate_unresolved`;
      productCases.push(detail);
    }
  }
}

const digestPaths = collectFiles(["apps", "controls", "corpus/language"])
  .concat(["product-evidence-v1.schema.json", "qualification-report-v2.schema.json", "support-policy-v1.json"])
  .filter((value) => !value.includes("/node_modules/") && !value.endsWith("LIFECYCLE_SCRIPT_EXECUTED"))
  .sort();
const sourceDigests = Object.fromEntries(digestPaths.map((relative) => [relative, `sha256:${sha256(fs.readFileSync(path.join(root, relative)))}`]));

const truth = {
  schema_version: "rig-benchmark-node-truth/v1",
  suite_id: "rig-benchmark-node-v1",
  suite_state: "QUALIFICATION",
  support_policy: "support-policy-v1.json",
  exact_family: {
    runtime_coordinates: supportPolicy.runtime_coordinates,
    framework_coordinates: supportPolicy.framework_coordinates,
    adapter_family: supportPolicy.adapter_family,
  },
  language_corpus: {
    path: "corpus/language",
    manifest: "corpus/language/package.json",
    command: "npm start --prefix corpus/language",
    required_categories: categories.length,
    controls_per_category: 4,
    expected_stdout: `BenchmarkNode language corpus: categories=${categories.length} controls=${categories.length * 4} vulnerable=${categories.length} safe=${categories.length} unknown=${categories.length} unsupported=${categories.length}`,
  },
  source_digests: sourceDigests,
  repositories,
  categories: categories.map((category) => ({
    category,
    mapping: properties[category][0],
    required_evidence_grade: properties[category][1],
  })),
  promotion_requirements: {
    exact_runtime_and_framework_coordinates: true,
    ordinary_product_path: true,
    final_publication: true,
    complete_coverage: true,
    sealed_transcripts_verified: true,
    authenticated_readback_verified: true,
    deterministic_replay_verified: true,
    hostile_repository_suite_passed: true,
    resource_budgets_verified: true,
    minimum_held_out_applications: 3,
    minimum_held_out_vulnerable_categories: categories.length,
    minimum_held_out_safe_categories: categories.length,
    required_held_out_framework_families: ["koa-", "nestjs-", "aurelia-"],
    maximum_corpus_execution_ms: 5000,
    maximum_source_files: 20000,
    maximum_source_file_bytes: 4194304,
    maximum_total_source_bytes: 268435456,
    required_publication_state: "FINAL",
    required_coverage_verdict: "COMPLETE",
    maximum_false_positives: 0,
    maximum_false_negatives: 0,
  },
  product_cases: productCases,
  controller_cases: controllerCases,
};
writeJson("truth-v1.json", truth);

function controllerReport(category) {
  if (["CWE-284", "CWE-287", "CWE-306", "CWE-352", "CWE-639", "CWE-862", "CWE-863"].includes(category)) return "ACCESS_CONTROL";
  if (category === "CWE-362") return "CONCURRENCY";
  if (category === "CWE-840") return "BUSINESS_LOGIC";
  return "MULTI_SERVICE";
}

function controllerLocation(category) {
  if (["CWE-284", "CWE-287", "CWE-306", "CWE-352", "CWE-639", "CWE-862", "CWE-863"].includes(category)) return "apps/koa-product/src/controller/access.js";
  if (category === "CWE-362") return "apps/koa-product/src/controller/concurrency.js";
  if (category === "CWE-840") return "apps/koa-product/src/controller/workflow.js";
  return "apps/koa-product/src/controller/service.js";
}

function controllerRoute(category, control) {
  if (["CWE-284", "CWE-287", "CWE-306", "CWE-352", "CWE-639", "CWE-862", "CWE-863"].includes(category)) {
    return `/controller/${category.toLowerCase()}/${control}`;
  }
  if (category === "CWE-362") return `/controller/race/${control}/claim`;
  if (category === "CWE-840") return `/controller/workflow/${control}/execute`;
  return `/controller/service/${control}`;
}

function semanticFile(category) {
  if (["CWE-22", "CWE-78", "CWE-89", "CWE-90", "CWE-94", "CWE-918", "CWE-943", "CWE-643"].includes(category)) return "apps/koa-product/src/semantics/injection.js";
  if (["CWE-79", "CWE-116", "CWE-113", "CWE-1336", "CWE-200", "CWE-201", "CWE-532", "CWE-601", "CWE-614", "CWE-501"].includes(category)) return "apps/koa-product/src/semantics/output.js";
  if (["CWE-328", "CWE-330", "CWE-502", "CWE-611", "CWE-776", "CWE-400"].includes(category)) return "apps/koa-product/src/semantics/data.js";
  return "apps/koa-product/src/semantics/node.js";
}

function markedLocation(caseId, fallback) {
  for (const relative of [
    "apps/koa-product/src/semantics/injection.js",
    "apps/koa-product/src/semantics/output.js",
    "apps/koa-product/src/semantics/data.js",
    "apps/koa-product/src/semantics/node.js",
  ]) {
    const lines = fs.readFileSync(path.join(root, relative), "utf8").split("\n");
    const marker = `benchmark-node:${caseId}`;
    const index = lines.findIndex((line) => line.includes(marker));
    if (index >= 0) return `${relative}:${index + 2}`;
  }
  return fallback;
}

function collectFiles(roots) {
  const output = [];
  for (const relativeRoot of roots) walk(relativeRoot, output);
  return output;
}

function walk(relative, output) {
  const absolute = path.join(root, relative);
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (["node_modules", "dist"].includes(entry.name)) continue;
    const child = path.posix.join(relative, entry.name);
    if (entry.name === "app.bundle.js" || entry.name === "app.bundle.js.map") continue;
    if (entry.isDirectory()) walk(child, output);
    else if (entry.isFile()) output.push(child);
  }
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function writeJson(relative, value) {
  fs.writeFileSync(path.join(root, relative), `${JSON.stringify(value, null, 2)}\n`);
}
