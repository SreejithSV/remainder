import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { basename } from "path";

export default defineConfig({
  base: "/remainder/", 
  plugins: [
    react(),
    tailwindcss(),
    tanstackRouter(),
    tsconfigPaths(),
  ],
});