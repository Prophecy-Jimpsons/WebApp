import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { runtimeEnv } from "vite-plugin-runtime";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "vite-plugin-commonjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to make paths absolute
const makeAbsolute = (relativePath: string) =>
  path.resolve(__dirname, relativePath);

export default defineConfig({
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    commonjs({
      filter(id) {
        return (
          id.includes("@anyalt/widget") ||
          id.includes("rpc-websockets") ||
          id.includes("@solana/web3.js")
        );
      },
    }),
    react(),
    runtimeEnv({ name: "env", injectHtml: true, generateTypes: true }),
    nodePolyfills({
      include: [
        "buffer",
        "crypto",
        "stream",
        "util",
        "events",
        "process",
        "url",
        "https",
        "http",
      ],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
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

      // Add specific resolution for the AnyAlt widget
      "@anyalt/widget": path.resolve(__dirname, "node_modules/@anyalt/widget"),

      // RPC Websockets resolution
      "rpc-websockets": makeAbsolute("node_modules/rpc-websockets"),
      "rpc-websockets/dist/lib/client/websocket.browser": makeAbsolute(
        "node_modules/rpc-websockets/dist/lib/client/websocket.browser.js",
      ),
      "rpc-websockets/dist/lib/client": makeAbsolute(
        "node_modules/rpc-websockets/dist/lib/client.js",
      ),
      // "rpc-websockets/dist/lib/client": path.resolve(
      //   __dirname,
      //   "node_modules/rpc-websockets/dist/lib/client.js",
      // ),
      // "rpc-websockets/dist/lib/client/websocket.browser": path.resolve(
      //   __dirname,
      //   "node_modules/rpc-websockets/dist/lib/client/websocket.browser.js",
      // ),
      "@solana/web3.js": path.resolve(
        __dirname,
        "node_modules/@solana/web3.js/lib/index.browser.esm.js",
      ),
    },
    mainFields: ["browser", "module", "main"],
  },

  optimizeDeps: {
    include: [
      "rpc-websockets",
      "@anyalt/widget",
      "@solana/web3.js",
      "@solana/spl-token",
    ],
    esbuildOptions: {
      target: "es2020",
      platform: "browser",
      define: {
        global: "globalThis",
        "process.env.NODE_DEBUG": JSON.stringify(""),
        "process.env": JSON.stringify({}),
        Buffer: JSON.stringify("buffer").Buffer,
      },
      format: "esm",
    },
  },

  build: {
    rollupOptions: {
      external: ["fs", "path", "net", "tls"],
      // Added CommonJS handling for the AnyAlt widget
      output: {
        format: "es",
        // Ensure globals are properly defined
        globals: {
          process: "process",
          buffer: "buffer",
          stream: "stream-browserify",
          crypto: "crypto-browserify",
          util: "util/util",
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
