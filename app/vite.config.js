import { defineConfig } from "vite";

// Relative base so the built gallery can be hosted from any sub-path
// (GitHub Pages, a static bucket, etc.).
export default defineConfig({
  base: "./",
  server: {
    // public/experiments/ is symlinked to the repo root in dev.
    fs: { allow: [".."] },
  },
});
