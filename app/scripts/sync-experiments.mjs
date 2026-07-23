#!/usr/bin/env node
/**
 * Mirror the web experiments from the monorepo root into app/public/experiments/.
 *
 * The repo root stays the single source of truth; app/public/experiments/ is a
 * generated mirror that must never be edited by hand.
 *
 *   --mode=dev    symlink each category dir (edits at the root show up live)
 *   --mode=build  copy each category dir recursively (portable, self-contained)
 */
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, "..");
const repoRoot = resolve(appDir, "..");

const mode = (process.argv.find((a) => a.startsWith("--mode=")) || "--mode=build").split("=")[1];

const manifest = JSON.parse(readFileSync(join(appDir, "experiments.json"), "utf8"));

// Distinct top-level dirs referenced by manifest entries (e.g. "fractals", "quines").
const categories = [...new Set(manifest.experiments.map((e) => e.entry.split("/")[0]))];

const target = join(appDir, "public", "experiments");
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

for (const cat of categories) {
  const src = join(repoRoot, cat);
  const dest = join(target, cat);

  if (!existsSync(src)) {
    console.warn(`[sync] skip missing source dir: ${cat}/`);
    continue;
  }

  if (mode === "dev") {
    symlinkSync(src, dest, "dir");
    console.log(`[sync] link  ${cat}/ -> ${src}`);
  } else {
    cpSync(src, dest, {
      recursive: true,
      dereference: true,
      filter: (p) => !lstatSync(p).isSymbolicLink(),
    });
    console.log(`[sync] copy  ${cat}/`);
  }
}

console.log(`[sync] ${mode} done -> ${target}`);
