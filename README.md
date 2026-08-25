# system-atlas-directory

Curated isometric atlases of real systems. Live: https://adg29.github.io/system-atlas-directory/

Two atlases so far: QM at [`/qm/`](https://adg29.github.io/system-atlas-directory/qm/) and God's Eye View at [`/gev/`](https://adg29.github.io/system-atlas-directory/gev/).

## Layout

- `index.html` / `index.md` — directory
- `catalog.json` / `llms.txt` — agent-readable catalog
- `qm/` — QM atlas (`index.html` map, `SYSTEM.md` twin, `atlas/data.mjs` source)
- `gev/` — GEV atlas (`index.html` map, `SYSTEM.md` twin, `atlas/data.mjs` source)

## Rebuild one atlas

```bash
node qm/atlas/build.mjs
cp qm/atlas.html qm/index.html   # if build writes next to atlas/

node gev/atlas/build.mjs
cp gev/atlas.html gev/index.html
```

`build.mjs` writes `SYSTEM.md` and `atlas.html` in the parent of `atlas/` (so `qm/` or `gev/`).

## Next

More atlases in this directory. Agentic Stripe / paywall is planned, not built.
