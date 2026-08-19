import assert from "node:assert/strict";
import test from "node:test";
import { cases, categories, controls } from "../src/corpus.mjs";

test("the corpus has forty unique categories and four controls per category", () => {
  assert.equal(categories.length, 40);
  assert.equal(new Set(categories).size, 40);
  assert.equal(cases.length, 160);
  for (const category of categories) {
    assert.deepEqual(cases.filter((item) => item.category === category).map((item) => item.control), controls);
  }
  assert.equal(new Set(cases.map((item) => item.caseId)).size, 160);
});
