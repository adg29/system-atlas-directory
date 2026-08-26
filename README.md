# system-atlas-directory

Curated isometric atlases of real systems. Live: https://adg29.github.io/system-atlas-directory/

Three atlases so far: QM at [`/qm/`](https://adg29.github.io/system-atlas-directory/qm/), God's Eye View at [`/gev/`](https://adg29.github.io/system-atlas-directory/gev/), and Lattice at [`/lattice/`](https://adg29.github.io/system-atlas-directory/lattice/).

## Layout

- `index.html` / `index.md` — directory
- `catalog.json` / `llms.txt` — agent-readable catalog
- `qm/` — QM atlas (`index.html` map, `SYSTEM.md` twin, `atlas/data.mjs` source)
- `gev/` — GEV atlas (`index.html` map, `SYSTEM.md` twin, `atlas/data.mjs` source)
- `lattice/` — Lattice atlas (`index.html` map, `SYSTEM.md` twin, `atlas/data.mjs` source)

## Rebuild one atlas

```bash
node qm/atlas/build.mjs
cp qm/atlas.html qm/index.html   # if build writes next to atlas/

node gev/atlas/build.mjs
cp gev/atlas.html gev/index.html

node lattice/atlas/build.mjs
cp lattice/atlas.html lattice/index.html
```

`build.mjs` writes `SYSTEM.md` and `atlas.html` in the parent of `atlas/` (so `qm/`, `gev/`, or `lattice/`).

## Next

More atlases in this directory. Agentic Stripe / paywall is planned, not built.
