import fs from "node:fs";

const [manifestPath, scenarioId, scorecardPath] = process.argv.slice(2);
if (!manifestPath || !scenarioId || !scorecardPath) {
  console.error(
    "usage: node scripts/assert-baseline-score.mjs MANIFEST SCENARIO SCORECARD",
  );
  process.exit(2);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const scorecard = JSON.parse(fs.readFileSync(scorecardPath, "utf8"));
const scenario = manifest.scenarios.find((candidate) => candidate.id === scenarioId);
if (!scenario) {
  throw new Error(`baseline scenario not found: ${scenarioId}`);
}

for (const [field, expected] of Object.entries(scenario.expected_summary)) {
  const actual = scorecard.summary[field];
  if (actual !== expected) {
    throw new Error(
      `${scenarioId}: summary.${field} expected ${expected}, received ${actual}`,
    );
  }
}

for (const [category, expectedFields] of Object.entries(
  scenario.expected_categories,
)) {
  const actualCategory = scorecard.categories.find(
    (candidate) => candidate.category === category,
  );
  if (!actualCategory) {
    throw new Error(`${scenarioId}: category not found: ${category}`);
  }
  for (const [field, expected] of Object.entries(expectedFields)) {
    const actual = actualCategory[field];
    if (actual !== expected) {
      throw new Error(
        `${scenarioId}: ${category}.${field} expected ${expected}, received ${actual}`,
      );
    }
  }
}

const { tp, fp, fn, tn } = scorecard.summary;
console.log(`${scenarioId}: TP=${tp} FP=${fp} FN=${fn} TN=${tn}`);
