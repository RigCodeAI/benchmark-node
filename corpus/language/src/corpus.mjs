import { categories as access } from "./categories/access.mjs";
import { categories as data } from "./categories/data.mjs";
import { categories as injection } from "./categories/injection.mjs";
import { categories as node } from "./categories/node.mjs";

export const controls = Object.freeze(["vulnerable", "safe", "unknown", "unsupported"]);
export const categories = Object.freeze([...access, ...data, ...injection, ...node].sort());
export const cases = Object.freeze(categories.flatMap((category) => controls.map((control) => Object.freeze({
  caseId: `${category.toLowerCase()}-${control}`,
  category,
  control,
}))));
