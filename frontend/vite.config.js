import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Build output goes to /frontend/dist (served by Express).
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      "/upload-proxy": {
        target: "https://image.arnabdev.space/upload",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload-proxy/, '')
      },
      // Proxy API + /assets to the Express backend during dev.
      "/api": "http://localhost:3000",
      "/assets": "http://localhost:3000",
    },
  },
});
