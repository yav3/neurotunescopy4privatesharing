import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  server: {
    // Bind to localhost only in local dev; Lovable cloud preview overrides via its own runner
    host: mode === 'development' ? "localhost" : "::",
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "*.lovable.dev"
    ],
    port: 8080,
    strictPort: true,
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        // Only skip TLS verification in explicit dev mode, never in production builds
        secure: mode !== 'development',
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'framer-motion', 'three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    outDir: "dist",
  },
}));
