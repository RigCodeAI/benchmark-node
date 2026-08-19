import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const application = path.join(root, "apps", "koa-product");
const requireFromApplication = createRequire(path.join(application, "package.json"));
const { XMLParser } = requireFromApplication("fast-xml-parser");
const libxml = await import(pathToFileURL(requireFromApplication.resolve("libxml2-wasm")).href);
const nodeIntegration = await import(
  pathToFileURL(requireFromApplication.resolve("libxml2-wasm/lib/nodejs.mjs")).href
);
const fastXmlPackage = readJson(path.join(application, "node_modules", "fast-xml-parser", "package.json"));
const libxmlPackage = readJson(path.join(application, "node_modules", "libxml2-wasm", "package.json"));

assert.equal(fastXmlPackage.version, "5.11.0");
assert.equal(libxmlPackage.version, "0.7.1");
nodeIntegration.xmlRegisterFsInputProviders();

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "benchmark-node-xml-"));
const canaryPath = path.join(temporaryRoot, "external-entity-canary.txt");
const canary = "BENCHMARK_NODE_EXTERNAL_ENTITY_EFFECT";
fs.writeFileSync(canaryPath, canary, { encoding: "utf8", mode: 0o600 });

try {
  const externalXml = `<!DOCTYPE root [<!ENTITY xxe SYSTEM "file://${canaryPath}">]><root>&xxe;</root>`;
  const nestedXml = '<!DOCTYPE root [<!ENTITY a "A"><!ENTITY b "&a;&a;"><!ENTITY c "&b;&b;">]><root>&c;</root>';
  const simpleXml = '<!DOCTYPE root [<!ENTITY value "EXPANDED">]><root>&value;</root>';

  const fastExternalEnabled = capture(() => new XMLParser({ processEntities: true }).parse(externalXml));
  const fastExternalDisabled = capture(() => new XMLParser({ processEntities: false }).parse(externalXml));
  assert.match(fastExternalEnabled.error, /External entities are not supported/u);
  assert.match(fastExternalDisabled.error, /External entities are not supported/u);

  const fastSimpleEnabled = new XMLParser({ processEntities: true }).parse(simpleXml).root;
  const fastSimpleDisabled = new XMLParser({ processEntities: false }).parse(simpleXml).root;
  assert.equal(fastSimpleEnabled, "EXPANDED");
  assert.equal(fastSimpleDisabled, "&value;");

  const fastNestedEnabled = new XMLParser({ processEntities: true }).parse(nestedXml).root;
  const fastNestedDisabled = new XMLParser({ processEntities: false }).parse(nestedXml).root;
  assert.equal(fastNestedEnabled, "&c;");
  assert.equal(fastNestedDisabled, "&c;");

  const externalEnabled = parseLibxml(externalXml, libxml.ParseOption.XML_PARSE_NOENT);
  const externalDisabled = parseLibxml(
    externalXml,
    libxml.ParseOption.XML_PARSE_NOENT | libxml.ParseOption.XML_PARSE_NO_XXE,
  );
  assert.match(externalEnabled, new RegExp(canary, "u"));
  assert.doesNotMatch(externalDisabled, new RegExp(canary, "u"));

  const expansionEnabled = parseLibxml(
    nestedXml,
    libxml.ParseOption.XML_PARSE_NOENT | libxml.ParseOption.XML_PARSE_NONET,
  );
  const expansionDisabled = parseLibxml(nestedXml, libxml.ParseOption.XML_PARSE_NONET);
  assert.match(expansionEnabled, /<root>AAAA<\/root>/u);
  assert.match(expansionDisabled, /<root>&c;<\/root>/u);

  const report = {
    schema_version: "benchmark-node-xml-parser-semantics/v1",
    coordinates: {
      fast_xml_parser: fastXmlPackage.version,
      libxml2_wasm: libxmlPackage.version,
    },
    fast_xml_parser: {
      external_entities: {
        process_entities_true: "REJECTED",
        process_entities_false: "REJECTED",
      },
      simple_internal_entity: {
        process_entities_true: "EXPANDED",
        process_entities_false: "PRESERVED",
      },
      nested_entity_expansion: {
        process_entities_true: "NOT_EXPANDED",
        process_entities_false: "NOT_EXPANDED",
      },
      qualification_use: "NOT_USED_FOR_CWE_611_OR_CWE_776",
    },
    libxml2_wasm: {
      external_entity: {
        vulnerable_options: ["XML_PARSE_NOENT"],
        vulnerable_result: "FILE_CONTENT_SUBSTITUTED",
        safe_options: ["XML_PARSE_NOENT", "XML_PARSE_NO_XXE"],
        safe_result: "EXTERNAL_RESOURCE_BLOCKED",
      },
      nested_entity_expansion: {
        vulnerable_options: ["XML_PARSE_NOENT", "XML_PARSE_NONET"],
        vulnerable_result: "NESTED_ENTITIES_EXPANDED",
        safe_options: ["XML_PARSE_NONET"],
        safe_result: "ENTITY_REFERENCE_PRESERVED",
      },
      qualification_use: "EXACT_COORDINATE",
    },
  };

  const output = outputPath(process.argv.slice(2));
  fs.mkdirSync(path.dirname(output), { recursive: true, mode: 0o755 });
  fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`verified XML parser semantics: ${path.relative(root, output)}`);
} finally {
  const resolved = path.resolve(temporaryRoot);
  const expectedPrefix = `${path.resolve(os.tmpdir())}${path.sep}benchmark-node-xml-`;
  if (!resolved.startsWith(expectedPrefix)) throw new Error("refusing to remove unexpected temporary directory");
  fs.rmSync(resolved, { recursive: true, force: false });
}

function parseLibxml(input, option) {
  const document = libxml.XmlDocument.fromString(input, { option });
  try {
    return document.toString();
  } finally {
    document.dispose();
  }
}

function capture(operation) {
  try {
    return { value: operation(), error: "" };
  } catch (error) {
    return { value: undefined, error: String(error?.message ?? error) };
  }
}

function outputPath(arguments_) {
  if (arguments_.length === 0) return path.join(root, "qualification", "xml-parser-semantics-v1.json");
  if (arguments_.length === 2 && arguments_[0] === "--output") return path.resolve(arguments_[1]);
  throw new Error("usage: node scripts/verify-xml-parser-semantics.mjs [--output PATH]");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
