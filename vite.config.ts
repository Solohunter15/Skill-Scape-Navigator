import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // Ensure correct base path for deployments
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "es2020",
    assetsDir: "assets",
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          recharts: ["recharts"],
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "three", "recharts"],
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
}));
