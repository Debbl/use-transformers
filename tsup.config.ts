import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/worker.ts"],
  format: "esm",
  sourcemap: true,
  dts: true,
  clean: true,
});
