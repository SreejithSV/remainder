import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";


export default defineConfig({
  base: "/remainder",
  plugins: [
    TanStackRouterVite(),  // ← fixed
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});