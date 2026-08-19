"use strict";

const {
  codeSafe, codeVulnerable, commandSafe, commandVulnerable,
  filesystemSafe, filesystemVulnerable, ldapSafe, ldapVulnerable,
  nosqlSafe, nosqlVulnerable, sqlSafe, sqlVulnerable,
  ssrfSafe, ssrfVulnerable, xpathSafe, xpathVulnerable,
} = require("./injection");
const {
  cookieSafe, cookieVulnerable, encodingSafe, encodingVulnerable,
  headerSafe, headerVulnerable, logExposureSafe, logExposureVulnerable,
  redirectSafe, redirectVulnerable, sensitiveOutboundSafe, sensitiveOutboundVulnerable,
  sensitiveResponseSafe, sensitiveResponseVulnerable, templateSafe, templateVulnerable,
  trustBoundarySafe, trustBoundaryVulnerable, xssSafe, xssVulnerable,
} = require("./output");
const {
  deserializeSafe, deserializeVulnerable, entityExpansionSafe, entityExpansionVulnerable,
  hashSafe, hashVulnerable, randomnessSafe, randomnessVulnerable,
  resourceExhaustionSafe, resourceExhaustionVulnerable, xxeSafe, xxeVulnerable,
} = require("./data");
const {
  dottedPrototypePollutionSafe, dottedPrototypePollutionVulnerable,
  eventLoopSafe, eventLoopVulnerable,
  prototypePollutionSafe, prototypePollutionVulnerable,
  regexEngineSafe, regexEngineVulnerable,
  vmEscapeSafe, vmEscapeVulnerable,
} = require("./node");

const handlers = new Map([
  ["CWE-22", [filesystemVulnerable, filesystemSafe]],
  ["CWE-78", [commandVulnerable, commandSafe]],
  ["CWE-89", [sqlVulnerable, sqlSafe]],
  ["CWE-90", [ldapVulnerable, ldapSafe]],
  ["CWE-94", [codeVulnerable, codeSafe]],
  ["CWE-918", [ssrfVulnerable, ssrfSafe]],
  ["CWE-943", [nosqlVulnerable, nosqlSafe]],
  ["CWE-643", [xpathVulnerable, xpathSafe]],
  ["CWE-79", [xssVulnerable, xssSafe]], ["CWE-116", [encodingVulnerable, encodingSafe]],
  ["CWE-113", [headerVulnerable, headerSafe]], ["CWE-1336", [templateVulnerable, templateSafe]],
  ["CWE-200", [sensitiveResponseVulnerable, sensitiveResponseSafe]],
  ["CWE-201", [sensitiveOutboundVulnerable, sensitiveOutboundSafe]],
  ["CWE-532", [logExposureVulnerable, logExposureSafe]],
  ["CWE-601", [redirectVulnerable, redirectSafe]],
  ["CWE-614", [cookieVulnerable, cookieSafe]],
  ["CWE-501", [trustBoundaryVulnerable, trustBoundarySafe]],
  ["CWE-328", [hashVulnerable, hashSafe]], ["CWE-330", [randomnessVulnerable, randomnessSafe]],
  ["CWE-502", [deserializeVulnerable, deserializeSafe]], ["CWE-611", [xxeVulnerable, xxeSafe]],
  ["CWE-776", [entityExpansionVulnerable, entityExpansionSafe]],
  ["CWE-400", [resourceExhaustionVulnerable, resourceExhaustionSafe]],
  ["CWE-1321", [prototypePollutionVulnerable, prototypePollutionSafe]],
  ["NODE-EVENT-LOOP-STARVATION", [eventLoopVulnerable, eventLoopSafe]],
  ["NODE-PROTOTYPE-POLLUTION", [dottedPrototypePollutionVulnerable, dottedPrototypePollutionSafe]],
  ["NODE-REGEX-ENGINE-DOS", [regexEngineVulnerable, regexEngineSafe]],
  ["NODE-VM-CONTEXT-ESCAPE", [vmEscapeVulnerable, vmEscapeSafe]],
]);

function registerSemanticRoutes(router) {
  router.post("/benchmark/cwe-22/vulnerable", filesystemVulnerable);
  router.post("/benchmark/cwe-22/safe", filesystemSafe);
  router.post("/benchmark/cwe-78/vulnerable", commandVulnerable);
  router.post("/benchmark/cwe-78/safe", commandSafe);
  router.post("/benchmark/cwe-89/vulnerable", sqlVulnerable);
  router.post("/benchmark/cwe-89/safe", sqlSafe);
  router.post("/benchmark/cwe-90/vulnerable", ldapVulnerable);
  router.post("/benchmark/cwe-90/safe", ldapSafe);
  router.post("/benchmark/cwe-94/vulnerable", codeVulnerable);
  router.post("/benchmark/cwe-94/safe", codeSafe);
  router.post("/benchmark/cwe-918/vulnerable", ssrfVulnerable);
  router.post("/benchmark/cwe-918/safe", ssrfSafe);
  router.post("/benchmark/cwe-943/vulnerable", nosqlVulnerable);
  router.post("/benchmark/cwe-943/safe", nosqlSafe);
  router.post("/benchmark/cwe-643/vulnerable", xpathVulnerable);
  router.post("/benchmark/cwe-643/safe", xpathSafe);

  router.post("/benchmark/cwe-79/vulnerable", xssVulnerable);
  router.post("/benchmark/cwe-79/safe", xssSafe);
  router.post("/benchmark/cwe-116/vulnerable", encodingVulnerable);
  router.post("/benchmark/cwe-116/safe", encodingSafe);
  router.post("/benchmark/cwe-113/vulnerable", headerVulnerable);
  router.post("/benchmark/cwe-113/safe", headerSafe);
  router.post("/benchmark/cwe-1336/vulnerable", templateVulnerable);
  router.post("/benchmark/cwe-1336/safe", templateSafe);
  router.post("/benchmark/cwe-200/vulnerable", sensitiveResponseVulnerable);
  router.post("/benchmark/cwe-200/safe", sensitiveResponseSafe);
  router.post("/benchmark/cwe-201/vulnerable", sensitiveOutboundVulnerable);
  router.post("/benchmark/cwe-201/safe", sensitiveOutboundSafe);
  router.post("/benchmark/cwe-532/vulnerable", logExposureVulnerable);
  router.post("/benchmark/cwe-532/safe", logExposureSafe);
  router.post("/benchmark/cwe-601/vulnerable", redirectVulnerable);
  router.post("/benchmark/cwe-601/safe", redirectSafe);
  router.post("/benchmark/cwe-614/vulnerable", cookieVulnerable);
  router.post("/benchmark/cwe-614/safe", cookieSafe);
  router.post("/benchmark/cwe-501/vulnerable", trustBoundaryVulnerable);
  router.post("/benchmark/cwe-501/safe", trustBoundarySafe);

  router.post("/benchmark/cwe-328/vulnerable", hashVulnerable);
  router.post("/benchmark/cwe-328/safe", hashSafe);
  router.post("/benchmark/cwe-330/vulnerable", randomnessVulnerable);
  router.post("/benchmark/cwe-330/safe", randomnessSafe);
  router.post("/benchmark/cwe-502/vulnerable", deserializeVulnerable);
  router.post("/benchmark/cwe-502/safe", deserializeSafe);
  router.post("/benchmark/cwe-611/vulnerable", xxeVulnerable);
  router.post("/benchmark/cwe-611/safe", xxeSafe);
  router.post("/benchmark/cwe-776/vulnerable", entityExpansionVulnerable);
  router.post("/benchmark/cwe-776/safe", entityExpansionSafe);
  router.post("/benchmark/cwe-400/vulnerable", resourceExhaustionVulnerable);
  router.post("/benchmark/cwe-400/safe", resourceExhaustionSafe);

  router.post("/benchmark/cwe-1321/vulnerable", prototypePollutionVulnerable);
  router.post("/benchmark/cwe-1321/safe", prototypePollutionSafe);
  router.post("/benchmark/node-event-loop-starvation/vulnerable", eventLoopVulnerable);
  router.post("/benchmark/node-event-loop-starvation/safe", eventLoopSafe);
  router.post("/benchmark/node-prototype-pollution/vulnerable", dottedPrototypePollutionVulnerable);
  router.post("/benchmark/node-prototype-pollution/safe", dottedPrototypePollutionSafe);
  router.post("/benchmark/node-regex-engine-dos/vulnerable", regexEngineVulnerable);
  router.post("/benchmark/node-regex-engine-dos/safe", regexEngineSafe);
  router.post("/benchmark/node-vm-context-escape/vulnerable", vmEscapeVulnerable);
  router.post("/benchmark/node-vm-context-escape/safe", vmEscapeSafe);
}

module.exports = { handlers, registerSemanticRoutes };
