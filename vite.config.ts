import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contentResources } from "./scripts/content-vite-plugin.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  plugins: [react(), contentResources()],
  resolve: { alias: { "@": root } },
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true }
});
