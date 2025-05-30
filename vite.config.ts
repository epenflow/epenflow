import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    visualizer({ open: true }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["react-scan"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("gsap") || id.includes("@gsap/react")) {
            return "gsap-vendor";
          }

          if (id.includes("motion")) {
            return "motion-vendor";
          }

          if (
            id.includes("@tailwindcss/vite") ||
            id.includes("tailwindcss") ||
            id.includes("tailwindcss-animate")
          ) {
            return "tailwindcss-vendor";
          }

          if (id.includes("lucide-react")) {
            return "icon-vendor";
          }

          if (id.includes("@tanstack/react-router")) {
            return "router-vendor";
          }

          if (
            id.includes("clsx") ||
            id.includes("tailwind-merge") ||
            id.includes("class-variance-authority")
          ) {
            return "ui-vendor";
          }

          if (id.includes("lenis") || id.includes("hamo")) {
            return "lenis-vendor";
          }

          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
