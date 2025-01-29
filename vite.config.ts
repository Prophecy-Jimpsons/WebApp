import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { env } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  define: {
    "process.env.VITE_FIREBASE_PROJECT_ID": JSON.stringify(
      env.VITE_FIREBASE_PROJECT_ID,
    ),
    "process.env.VITE_FIREBASE_API_KEY": JSON.stringify(
      env.VITE_FIREBASE_API_KEY,
    ),
    "process.env.VITE_HELIUS_API": JSON.stringify(env.VITE_HELIUS_API),
    "process.browser": true,
  },
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@config": path.resolve(__dirname, "./src/config"),
    },
  },
});
