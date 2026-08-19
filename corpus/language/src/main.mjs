import { cases, categories } from "./corpus.mjs";

const count = (control) => cases.filter((item) => item.control === control).length;
process.stdout.write(
  `BenchmarkNode language corpus: categories=${categories.length} controls=${cases.length} `
  + `vulnerable=${count("vulnerable")} safe=${count("safe")} `
  + `unknown=${count("unknown")} unsupported=${count("unsupported")}\n`,
);
