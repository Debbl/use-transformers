import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/worker.ts"],
  format: "esm",
  outDir: "dist",
  sourcemap: true,
  esbuildOptions: (options) => {
    options.alias = {
      "~": "./src",
    };
  },
  dts: true,
  clean: true,
});
