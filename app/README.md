# app - experimental-coding gallery

A web gallery to browse, preview and open the experiments in this monorepo
(quines, fractals, creative coding, code golf…).

Vanilla JS + Vite. Code styled, monospace, syntax-style
palette.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve dist/
```

## How it works

- **`experiments.json`** - curated manifest: title, description, tags, path,
  language and `type: "live" | "code-only"` for each experiment.
- **`scripts/sync-experiments.mjs`** - mirrors the experiments from the monorepo
  root into `public/experiments/`. Runs automatically before `dev`
  (`predev`, symlink) and `build` (`prebuild`, copy).
  - **The root stays the single source of truth.** `public/experiments/` is
    generated, never hand-edited, and gitignored.
- **Isolation** - each experiment loads in its own `<iframe>`: no CSS/JS
  collision with the gallery.
- **`type: "live"`** - a scaled, non-interactive iframe thumbnail, then opens
  full-size in an in-page overlay.
- **`type: "code-only"`** - a highlighted source excerpt (home-grown
  highlighter, `src/highlight.js`) plus file/repo links, no execution.
- **Routing** - state lives in the URL (`#/quines/thomas-aquinas`): shareable,
  with back-button, `Esc` and click-outside to close.
- The ASCII name banner at the top is read from `src/ascii-name.txt` (extracted
  from the root `README.md`) and imported raw.

## Card thumbnails: live preview vs. screenshot

By default a `live` card shows a miniature of the running program. To use a
**static image** instead, add an `image` field to the manifest entry:

```json
{ "slug": "thomas-aquinas", "type": "live", "image": "screens/thomas-aquinas.svg" }
```

When `image` is set it takes precedence over the live iframe / code snippet in
the card thumbnail. Clicking the card still opens the real running program in
the overlay. Screenshots live in `public/screens/` (committed, unlike the
generated mirror).

## Add an experiment

1. Add the file at the monorepo root (`fractals/`, `quines/`, …).
2. Add an entry to `experiments.json`.

`entry` is the path relative to the monorepo root; its first segment
(e.g. `quines`) becomes a category and is mirrored automatically.
