import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/worker.ts"],
  format: "esm",
  outDir: "dist",
  sourcemap: true,
  dts: true,
  clean: true,
});
