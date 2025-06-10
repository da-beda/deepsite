import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // Use the repository name as the base path so that assets load correctly on
  // GitHub Pages. In development we serve from the root path, but when the
  // site is deployed under `deepsite-locally` we need to prefix all asset URLs
  // with the repo name.
  base: process.env.NODE_ENV === "production" ? "/deepsite-locally/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
