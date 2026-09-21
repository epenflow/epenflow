import { configDefaults, defineConfig } from "vitest/config";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import babelPlugin from "@rolldown/plugin-babel";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [viteReact(), babelPlugin({ presets: [reactCompilerPreset()] })],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      exclude: [...(configDefaults.coverage.exclude ?? []), "**/*.utils.ts"],
    },
  },
});
