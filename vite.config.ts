import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

const readLocalEnv = (key: string) => {
  try {
    const match = fs.readFileSync(path.resolve(__dirname, ".env"), "utf8")
      .match(new RegExp(`^${key}=\\"?([^\\"\\n]+)\\"?`, "m"));
    return match?.[1];
  } catch {
    return undefined;
  }
};

const supabaseUrl = readLocalEnv("VITE_SUPABASE_URL") ?? process.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = readLocalEnv("VITE_SUPABASE_ANON_KEY") ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";

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
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(supabaseAnonKey),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(supabaseAnonKey),
  },
}));
