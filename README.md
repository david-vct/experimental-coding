# Experimental coding

```
          _,        +*           __        ._                           /\.__   *+
         /\ \               *   /^_\      /\ \                         /\  __\
   *+   _\_\ \     ___    __    \/%/_    _\_\ \      +*   __        ,---.\ \./
       /'__.  \   /'__`\ /\_\_   _+\ \  /'__.  \         /\_\_   _,/`,--_/\ \
      /\ \_L\  \_/\ \_\ \'_ˊ\_\_/ / \ \;\ \_L\  \.    __ \.ˊ\_\_/ /\ \__., \ \_
      \ \____/\_.\ \____/\_\.ˊ\__/ \ \_\ \____/\__\  /^_\  \.ˊ\__/\ \___,/\ \._\
       \/#%#/\/%%/\/_#%/\/%/ \/#/   \/%/\/%##/\/%#/  \/%/    \/#/  \/##%/  \/##/
```

This repository contains __small explorations__ of _programming concepts_.
I want to explore creative coding, quines, JS1K, code golf, esolangs and anything that looks fun.

Most experiments are self-contained and kept as small as possible: one file,
no build step, no dependencies. Open any of them directly in a browser and it
runs.

## Live gallery

**https://david-vct.github.io/experimental-coding/**

Every experiment worth showing is browsable there — running, in the page, no
install. It is built from the [app/](app/) folder.

## Repository layout

```
art/          Artistic experiments       (visuals, fonts)
fractals/     Fractals                   (mandelbrot)
quines/       Self-reproducing programs  (thomas-aquinas, q-counter)
shaders/      WebGL and GLSL sketches
simulations/  Simulations                (alt game of life)
app/          The web gallery
```

In the gallery those files are regrouped into reading categories :
*simulations*, *quines*, *visuals*, and *unremarkable* for the early drafts kept
around for the record.

## Run the gallery locally

```bash
cd app
npm install
npm run dev      # http://localhost:5173
```

In dev the root directories are **symlinked** into `app/public/experiments/`, so
editing `simulations/gol-conway.html` and reloading is enough — nothing to
re-sync. `npm run build` copies them instead, producing a self-contained
`app/dist/`.

See [app/README.md](app/README.md) for the details: routing, live thumbnails,
static screenshots, and how a card can boot an experiment in a chosen state.

## Add an experiment

1. Drop the file in the matching root directory (`fractals/`, `quines/`, …).
2. Add an entry to [app/experiments.json](app/experiments.json).

That's it — the mirror and the gallery pick it up on the next `dev` or `build`.

## License

[MIT](LICENSE)
