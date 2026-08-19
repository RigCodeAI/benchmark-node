import { build } from "esbuild";

await build({
  bundle: true,
  entryPoints: ["src/frontend.js"],
  format: "iife",
  outfile: "app.bundle.js",
  platform: "browser",
  sourcemap: true,
  target: ["es2022"],
});
