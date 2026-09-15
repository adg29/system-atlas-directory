# system-atlas-directory

Curated isometric atlases of real systems. Live: https://adg29.github.io/system-atlas-directory/

Five atlases so far: QM at [`/qm/`](https://adg29.github.io/system-atlas-directory/qm/), God's Eye View at [`/gev/`](https://adg29.github.io/system-atlas-directory/gev/), Lattice at [`/lattice/`](https://adg29.github.io/system-atlas-directory/lattice/), Grok Bot 0.18 at [`/gb-018/`](https://adg29.github.io/system-atlas-directory/gb-018/), and pstack at [`/pstack/`](https://adg29.github.io/system-atlas-directory/pstack/).

## Layout

- `index.html` / `index.md` — directory
- `catalog.json` / `llms.txt` — agent-readable catalog
- `qm/` — QM atlas (`index.html` map, `SYSTEM.md` twin, `atlas/data.mjs` source)
- `gev/` — GEV atlas (`index.html` map, `SYSTEM.md` twin, `atlas/data.mjs` source)
- `lattice/` — Lattice atlas (`index.html` map, `SYSTEM.md` twin, `atlas/data.mjs` source)
- `gb-018/` — Grok Bot 0.18 harness atlas (`index.html` map, `SYSTEM.md` twin, `atlas/data.mjs` source)
- `pstack/` — pstack skills atlas (`index.html` map, `SYSTEM.md` twin, `atlas/data.mjs` source)

## Rebuild one atlas

```bash
node qm/atlas/build.mjs
cp qm/atlas.html qm/index.html   # if build writes next to atlas/

node gev/atlas/build.mjs
cp gev/atlas.html gev/index.html

node lattice/atlas/build.mjs
cp lattice/atlas.html lattice/index.html

node gb-018/atlas/build.mjs
cp gb-018/atlas.html gb-018/index.html

node pstack/atlas/build.mjs
cp pstack/atlas.html pstack/index.html
```

`build.mjs` writes `SYSTEM.md` and `atlas.html` in the parent of `atlas/` (so `qm/`, `gev/`, `lattice/`, `gb-018/`, or `pstack/`).

## Next

More atlases in this directory. Agentic Stripe / paywall is planned, not built.
