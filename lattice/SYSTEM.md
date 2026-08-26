# Lattice — System Definition

_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._

_Question status: **8 open · 14 resolved**._

## One paragraph

Lattice is an agentic isometric game kit. Type one sentence; the /lattice plugin scaffolds a zero-asset Canvas2D game from nine TypeScript packages with no dependencies. Buildings are drawn from one color, sound from oscillators, and a seed plus an input log replays the same pixel.

## Decisions locked

| Axis | Decision | ADR |
|---|---|---|
| Product | The product is the /lattice plugin and twelve skills. The nine packages exist so an agent succeeds — no sprite sheets to invent. | [docs/SKILLS.md](https://github.com/plausibleventures/lattice/blob/main/docs/SKILLS.md) |
| Runtime | Nine zero-dependency TypeScript packages in a one-way DAG. core imports nothing; nothing imports ui. Not a framework app. | [AGENTS.md](https://github.com/plausibleventures/lattice/blob/main/AGENTS.md) |
| Determinism | Seed plus input log replays the same pixel. Two arithmetic tiers: A may reach saves; B is pixels only and must declare itself. | [AGENTS.md](https://github.com/plausibleventures/lattice/blob/main/AGENTS.md) |
| Assets | Zero assets. Art is procedural from one color; sound is synthesised. A PNG in a package is a different project. | [AGENTS.md](https://github.com/plausibleventures/lattice/blob/main/AGENTS.md) |
| Renderer | Canvas2D only. No WebGL, WebGPU, WASM, workers, or OffscreenCanvas. Tile size is 64x32; any other uniform size is a camera zoom. | [README.md](https://github.com/plausibleventures/lattice/blob/main/README.md) |
| Contrib | AGENTS.md is source of truth. The gate is build, lint, docs, skills, tests, measured, gallery, looking. No new deps. Green is not evidence. | [CONTRIBUTING.md](https://github.com/plausibleventures/lattice/blob/main/CONTRIBUTING.md) |
| License | MIT covers the kit. Nine packages publish in lockstep under @latticekit. A minor may break source before 1.0; a patch never does. | [LICENSE](https://github.com/plausibleventures/lattice/blob/main/LICENSE) |
| Site | lattice.plausible.ventures is GitHub Pages from main via .github/workflows/pages.yml. CNAME is written from kit.json homepage. Not gated on the verify suite. | [.github/workflows/pages.yml](https://github.com/plausibleventures/lattice/blob/main/.github/workflows/pages.yml) |

## Cost model

- MIT kit. Nine packages, zero deps, zero asset files.
- No engine account and no runtime fee. A game is a page.
- No metered APIs in the kit. Canvas2D and WebAudio are browser APIs.

## Deep dives

Kit constitution: [AGENTS.md](https://github.com/plausibleventures/lattice/blob/main/AGENTS.md). Packages: [.lattice/kit.json](https://github.com/plausibleventures/lattice/blob/main/.lattice/kit.json). Skills: [docs/SKILLS.md](https://github.com/plausibleventures/lattice/blob/main/docs/SKILLS.md). Seams: [docs/SEAMS.md](https://github.com/plausibleventures/lattice/blob/main/docs/SEAMS.md).

## Reading order (the atlas chapters)

1. **You type a sentence** — One command. The plugin decides everything else. _(adds PLG, SKL)_
2. **The kit underneath** — Nine packages, one way. core imports nothing. _(adds CORE)_
3. **Paint from one color** — No PNG. Faces derived. Sort then walk. _(adds ISO)_
4. **A tap is a tile** — Never convert a pointer in a handler. _(adds IN)_
5. **Time is a parameter** — Clock injected. The loop credits nothing. _(adds LOOP)_
6. **Sound, HUD, saves** — Oscillators, a few dozen DOM nodes, a migration chain. _(adds AUD, HUD, SAVE)_
7. **Look at it** — A suite that passes over a black screen is a failure. _(adds LOOK)_
8. **Nineteen worlds** — City at /x/city/. The page is Lattice, running. _(adds CITY, SITE)_
9. **The gate** — The same command locally and in CI. Nothing lands red. _(adds VFY)_
10. **Later** — WebGL, flying-object sort, shipped bootstrap — designed-for, not on. _(adds LTR)_
11. **The whole system** — Everything at once, for free exploration.

## Structures

### The sentence

#### PLG · Plugin /lattice

**In one line.** Type one sentence. Get a playable game in a browser.

**What it does.** A marketplace plugin for Claude Code, Codex, and Grok. /lattice owns the command. It picks an archetype, scaffolds, writes the game, gets a screen up in the first minute, then opens a browser and looks. The only questions it may ask: what the game is about, and consent to build blind or write into a non-empty folder.

**How it's built.** `.claude-plugin/plugin.json` plus `skills/lattice/SKILL.md`. Flow: preflight, choose shape, scaffold, build, look. Specialists are loaded by name; they do not fire on phrase match for a from-scratch build.

**Steps in execution.**

1. **Preflight** — Node 20.19+, writable folder, any way to look (browser tool, MCP, or Chrome).
2. **Shape** — Match the sentence to a shape. Say it in one line. Do not ask.
3. **Scaffold** — Install @latticekit packages in DAG order. Load starting before main.ts.
4. **Look** — Open, screenshot, judge, fix, repeat. Never report success on a black screen.

**Questions.**

- ~~**Q-PLG1** Is the plugin a dependency of the packages?~~ ✓ No. Skills are distributed separately; no @latticekit package may assume they exist (2026-08-25).
- **Q-PLG2** Has the stranger-directory validation session been run against published tarballs?

#### SKL · Skills

**In one line.** One parent skill plus eleven specialists. Organized by what a person is trying to do.

**What it does.** Twelve skills under skills/: lattice (parent) and starting, art, world, economy, input, sound, saving, hud, determinism, performance, traps. Self-contained — the user has node_modules, not this repository. Traps are failures that compile, run, and look right. README names 34 of them.

**How it's built.** docs/SKILLS.md is the design. Each skill lives in skills//SKILL.md. Parent loads specialists by name at the step that needs them. CI compiles every code block against published packages, not the workspace.

**Steps in execution.**

1. **Trigger** — Parent owns /lattice. Specialists do not auto-fire on a from-scratch build.
2. **Load** — starting before boot; art when drawing; world for terrain; economy for numbers; and so on.
3. **Traps** — Read traps when it works but looks wrong.

**Questions.**

- ~~**Q-SKL1** Do skills ship inside @latticekit packages?~~ ✓ No. Distributed as the plugin; packages must work for someone who never heard of it (2026-08-25).

#### LOOK · Looking harness

**In one line.** Open it, screenshot it, judge it. Green is not evidence.

**What it does.** The tenth non-negotiable made into a loop. The plugin copies look.mjs into the project — no deps; drives Chrome and prints five readings: blank screen, world lost in empty frame, still picture, unreadable HUD, exception. CI looking step is tools/looking/verify.mjs on the gallery.

**How it's built.** skills/lattice/references/looking.md and look.mjs. Preflight asks whether any rung is reachable (browser tool, MCP, or Chrome), not whether one named extension is installed. Without a way to look, it builds anyway and says nobody has looked.

**Steps in execution.**

1. **Open** — Get a real page on a dev server.
2. **Read** — Five checks on the first frame.
3. **Fix** — Change one thing, look again. Three misses: cut the feature.

**Questions.**

- ~~**Q-LOOK1** May the plugin report success on a suite that passed over a black screen?~~ ✓ No. With a browser, it compiles is not done. Without one, it says nobody has looked (2026-08-25).

### Nine packages

#### CORE · core + sim

**In one line.** Seeded rng, hashing, maths — and closed-form idle economy.

**What it does.** @latticekit/core has no deps and no DOM: Rng, noise, vec2, easing, pools, events. @latticekit/sim sits on core: cost curves, flow, offline accrual, capacity. sim reads no clock; every move takes an epoch timestamp. Offline warps time, never yield.

**How it's built.** packages/core and packages/sim. Layer 0 and layer 1. Cost uses exponentiation by squaring so the charged number is Tier A. No global Rng.

**Steps in execution.**

1. **Seed** — Caller owns createRng. Sub-streams fork from identity, not cursor.
2. **Integrate** — sim.advance(state, epoch) — closed form, not a tick loop.
3. **Offline** — Credit is W(span) minus W(from). Never restart the warp.

**Questions.**

- ~~**Q-CORE1** Does core depend on anything outside the kit?~~ ✓ No. Zero dependencies; core dependsOn is empty in kit.json (2026-08-25).

#### IN · input

**In one line.** A tap arrives as a tile, never as a pixel.

**What it does.** Pointer, touch, keyboard into one replayable stream of intents, in tile coordinates, through the camera as it stood when the tick opened. Input never learns what is in the world. Gestures deliver on simulation ticks. Zoom is pointer-anchored; zoomAt is the only mutator.

**How it's built.** packages/input. createInput / createHeadlessInput / createLog. Terrain must be declared (flat or a height field) or a slope pick is silently wrong — that was a 281 px / 14-tile bug, fixed in 0.1.1.

**Steps in execution.**

1. **Bucket** — A tick sees a bucket closed before it started.
2. **Resolve** — Tile via frozen camera and declared ground. Off-map is NaN, not sea level.
3. **Record** — Log keyed by tick for replay.

**Questions.**

- ~~**Q-IN1** Does a pointer handler convert pixels to tiles?~~ ✓ No. The conversion happens through the camera as it stood when the tick opened, never in a handler against the live camera (2026-08-25).

#### AUD · audio

**In one line.** Sound without files. Oscillators, buses, a music deck.

**What it does.** WebAudio synthesis from declarative recipes. Hard voice ceiling. No AudioContext until a user gesture unlocks it. Silent, not throwing, where there is no WebAudio. This package stores nothing — mixer snapshot is handed to persist.

**How it's built.** packages/audio. createAudio, createBed, createDeck. Layer 1, depends only on core.

**Steps in execution.**

1. **Unlock** — User gesture.
2. **Play** — Declarative SoundDef through the engine.
3. **Limit** — Voice ceiling; summed gains above 1 clip.

**Questions.**

- ~~**Q-AUD1** Does audio ship wav or mp3 files?~~ ✓ No. Zero assets; synthesis only (2026-08-25).

### What paints

#### ISO · iso + draw

**In one line.** Projection, depth sort, and painting from one color. No PNG.

**What it does.** @latticekit/iso owns grid/world/screen, camera, DepthSorter, picking, paths. @latticekit/draw paints Canvas2D solids whose faces are derived from one color: cool shadows, warm highlights. renderFrame sorts immediately before Solids. Reordering after sort — including a stable shadow-then-body partition — makes a tap open the building behind.

**How it's built.** packages/iso, packages/draw. Tile size 64x32. Seven closed passes. Light field is not occluded (documented limitation). Sprite bitmap cache was measured and not built.

**Steps in execution.**

1. **Begin** — beginFrame({surface, camera, palette, t}).
2. **Sort** — DepthSorter.sort(camera) inside renderFrame.
3. **Paint** — Walk indexAt forwards. pickSorted walks the same instance backwards.

**Questions.**

- ~~**Q-ISO1** Does elevation enter the depth sort?~~ ✓ No for grounded sprites — heightPx is culling only (iso README). Flying objects still sort as if on the ground — issue 66, open (2026-08-25).
- ~~**Q-ISO2** Are lights occluded by buildings?~~ ✓ No. Draw README names this the largest honest limitation; a lamp behind a hill still spills over it (2026-08-25).
- **Q-ISO3** contactShadow multiplies strength by a private 0.34 and paints a private SHADE_TINT — issue 68, open.

#### HUD · ui overlay

**In one line.** DOM overlay primitives. Deliberately not a framework.

**What it does.** Panels, toasts, number rolls, thumbnails from the draw kit. No virtual DOM, no stylesheet. Root is pointer-events none; interactivity is granted per node so taps on the world are not swallowed. State updates on the interval cadence, never inside render — if render never runs, every number is still right.

**How it's built.** packages/ui. createOverlay, drive, el, panel, toasts, roll. Depends on core and draw. Nothing imports ui.

**Steps in execution.**

1. **Mount** — createOverlay on the page.
2. **Drive** — drive(ui, boot) from the loop interval, not the paint callback.

**Questions.**

- ~~**Q-HUD1** Is ui a React or Vue layer?~~ ✓ No. A few dozen DOM nodes. The package ships no stylesheet (2026-08-25).

#### CITY · City and gallery

**In one line.** Nineteen worlds, running. City is the visual hook.

**What it does.** examples/city is CITY BLOCK: nine blocks at the blue hour, thirty-six buildings, tap a tower and windows come on. Seed plus pen.t, no Date.now. The landing page embeds eighteen exhibits plus the hero live — nothing on it is a screenshot. Three unedited from-one-sentence games live at /g/. examples/demo is the complete small game on the workspace dev server.

**How it's built.** examples/city/src/main.ts bootstraps via examples/_shared (repo-only). Site serves exhibits at /x// — city at https://lattice.plausible.ventures/x/city/. Gallery spec: docs/GALLERY.md. Eight of eighteen exhibits were built by outside agents from the spec alone.

**Steps in execution.**

1. **Seed** — createCity(boot.seed).
2. **Frame** — Overflow the viewport on purpose; downtown under the bottom edge.
3. **Tap** — bucket.pick on silhouette; FLAG_POWERED wakes windows.

**Questions.**

- ~~**Q-CITY1** Does examples/_shared ship on the registry?~~ ✓ No. It exists only in the repo; eight outside agents all hit that (issue 53, 2026-08-25).

### Time and memory

#### LOOP · loop

**In one line.** The only package that knows what time it is. Clock is injected.

**What it does.** Fixed-step simulation, interpolated render, two timelines (sim and real), tweens, replay. Catch-up clamps at 250ms and drops the excess — loop credits nothing; sim does. loop.time is simulated time and drifts below realTime while hidden on purpose.

**How it's built.** packages/loop. createLoop({clock, frames, update, render}). replay() is the constitution made falsifiable. stepMs is a compatibility constant in recorded sessions.

**Steps in execution.**

1. **Pump** — Read injected clock; advance real; clamp; step update; maybe render.
2. **Replay** — Same update function, seed plus input log, hash is Tier A only.

**Questions.**

- **Q-LOOP1** loop.time silently diverges from realTime under coarse stepping and nothing surfaces the clamp — issue 67, open.
- ~~**Q-LOOP2** Does loop credit offline earnings?~~ ✓ No. The loop advances callbacks; sim advances value. Excess catch-up is dropped (2026-08-25).

#### SAVE · persist

**In one line.** The chain is the version. A future save makes the store read-only.

**What it does.** Versioned saves, explicit migration chain, injected storage, checksums, replay verifier. Corrupt save degrades to fresh with a closed reason — never a throw on boot. A replay log is evidence, not progress: it is never migrated. Writes flush on visibilitychange, not beforeunload.

**How it's built.** packages/persist. createStore, migrations, createRecorder. Storage adapter is injected; browser localStorage is one adapter.

**Steps in execution.**

1. **Open** — Read envelope; run one-rung migrations.
2. **Write** — Debounced; flush on hide.
3. **Refuse** — Future version is read-only. Replay stepMs mismatch is refused by name.

**Questions.**

- ~~**Q-SAVE1** Is a replay log migrated like a save?~~ ✓ No. A version, stepMs, or profile mismatch is refused by name (2026-08-25).

### The gate

#### VFY · Verify gate

**In one line.** Nothing lands red. The same command locally and in CI.

**What it does.** Root script: build, lint, docs, skills, counted tests, measured figures, gallery, looking. CI runs it on Node 20.19, 22, and 24. A second job runs the suite twice and diffs streams. Size budget is a separate CI step. Coverage is not part of the gate. docs compiles TypeScript in README and GUIDE; skills compiles each skill block against registry packages in CI.

**How it's built.** package.json scripts.verify plus .github/workflows/ci.yml. tools/lint.mjs enforces determinism, layering, and kit.json exports.

**Steps in execution.**

1. **Build** — tsc --build.
2. **Lint** — House rules, including the clock and random bans.
3. **Look** — Gallery line cap and looking harness.

**Questions.**

- ~~**Q-VFY1** What is the contrib gate?~~ ✓ npm run verify — same command CI runs (2026-08-25).

#### SITE · Landing page

**In one line.** The shop window. Everything on it is Lattice, running.

**What it does.** site/ is not a workspace member and nothing in it may be imported by a package. Hero is a split with examples/demo live. Gallery tiles are live iframes. /llms.txt and /api.json for agents. /reference/ is generated from package .d.ts files. At most two scene loops run at once.

**How it's built.** .github/workflows/pages.yml: on push to main, build packages, node site/tools/build.mjs, deploy-pages. CNAME from kit.json homepage = lattice.plausible.ventures. Deliberately not gated on the verify suite.

**Steps in execution.**

1. **Build** — Packages first, then site/tools/build.mjs.
2. **CNAME** — Host of kit.json homepage written into the artifact.
3. **Deploy** — actions/deploy-pages.

**Questions.**

- ~~**Q-SITE1** How does lattice.plausible.ventures get published?~~ ✓ GitHub Pages from main via .github/workflows/pages.yml; CNAME from kit.json homepage (2026-08-25).
- **Q-SITE2** DNS, TLS, and anything in front of GitHub Pages — not in the repo.

### Designed for, not on (designed for, not built)

#### LTR · Later _(not switched on)_

**In one line.** Designed for, not on: WebGL, elevation-aware sort, shipped bootstrap.

**What it does.** Draw README: WebGL backend not in 0.1 — the Surface seam exists so it can land later without touching sprite code. DepthSorter has no elevation, so flying things sort behind what they cross (issue 66). examples/_shared bootstrap is repo-only (issue 53). The SKILLS.md stranger-directory session has not been run against published tarballs (issue 54).

**How it's built.** Ghost. Open issues 66, 53, 54. Light occlusion is a documented limitation, not a tracker item, and lives on ISO rather than here.

**Steps in execution.**

1. **WebGL** — Surface has thirteen methods a backend could implement. Not shipped.
2. **Elevation** — Issue 66: suggested addAt(footprint, elevationPx).
3. **Bootstrap** — Issue 53: eight outside agents all hit the missing shared boot.

**Questions.**

- **Q-LTR1** WebGL backend — not in 0.1 (draw README, deliberately absent).
- **Q-LTR2** DepthSorter elevation for flying objects — issue 66, open.
- **Q-LTR3** Shipped bootstrap package replacing examples/_shared — issue 53, open.
- **Q-LTR4** Validation session against published tarballs — issue 54, open.

## Flows (representative packets)

Payload shapes are what the design implies, not measured traffic.

### One sentence

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | PLG → SKL | /lattice | `{"sentence":"an orchard that grows while the tab is closed"}` |
| 2 | SKL → CORE | install DAG | `{"packages":["core","iso","draw","loop","input"]}` |
| 3 | SKL → LOOK | look | `{"url":"localhost:5173"}` |

### One frame

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | LOOP → ISO | render(alpha, t) | `{"stepMs":16.667}` |
| 2 | ISO → ISO | sort then paint | `{"passes":7}` |
| 3 | IN → ISO | pickSorted | `{"tile":true}` |

### Tap a tower

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | IN → CITY | touch | `{"kind":"tap"}` |
| 2 | CITY → ISO | pickSorted silhouette | `{"flag":"POWERED"}` |
| 3 | CITY → HUD | toast | `{"msg":"woke"}` |

### Replay a session

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | IN → SAVE | input log | `{"keyed":"tick"}` |
| 2 | SAVE → LOOP | replay() | `{"stepMs":"compat"}` |
| 3 | LOOP → CORE | hash Tier A | `{"divergedAt":-1}` |

### Land a change

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | VFY → CORE | lint+test | `{"layering":"DAG"}` |
| 2 | VFY → LOOK | looking harness | `{"blackScreen":false}` |
| 3 | VFY → SITE | not required | `{"pagesIgnoresRed":true}` |

## Questions — index

Reference by ID. ✓ resolved (with date) · otherwise open.

- ~~**Q-PLG1**~~ (PLG) ✓ No. Skills are distributed separately; no @latticekit package may assume they exist (2026-08-25).
- **Q-PLG2** (PLG) Has the stranger-directory validation session been run against published tarballs?
- ~~**Q-SKL1**~~ (SKL) ✓ No. Distributed as the plugin; packages must work for someone who never heard of it (2026-08-25).
- ~~**Q-LOOK1**~~ (LOOK) ✓ No. With a browser, it compiles is not done. Without one, it says nobody has looked (2026-08-25).
- ~~**Q-CORE1**~~ (CORE) ✓ No. Zero dependencies; core dependsOn is empty in kit.json (2026-08-25).
- ~~**Q-IN1**~~ (IN) ✓ No. The conversion happens through the camera as it stood when the tick opened, never in a handler against the live camera (2026-08-25).
- ~~**Q-AUD1**~~ (AUD) ✓ No. Zero assets; synthesis only (2026-08-25).
- ~~**Q-ISO1**~~ (ISO) ✓ No for grounded sprites — heightPx is culling only (iso README). Flying objects still sort as if on the ground — issue 66, open (2026-08-25).
- ~~**Q-ISO2**~~ (ISO) ✓ No. Draw README names this the largest honest limitation; a lamp behind a hill still spills over it (2026-08-25).
- **Q-ISO3** (ISO) contactShadow multiplies strength by a private 0.34 and paints a private SHADE_TINT — issue 68, open.
- ~~**Q-HUD1**~~ (HUD) ✓ No. A few dozen DOM nodes. The package ships no stylesheet (2026-08-25).
- ~~**Q-CITY1**~~ (CITY) ✓ No. It exists only in the repo; eight outside agents all hit that (issue 53, 2026-08-25).
- **Q-LOOP1** (LOOP) loop.time silently diverges from realTime under coarse stepping and nothing surfaces the clamp — issue 67, open.
- ~~**Q-LOOP2**~~ (LOOP) ✓ No. The loop advances callbacks; sim advances value. Excess catch-up is dropped (2026-08-25).
- ~~**Q-SAVE1**~~ (SAVE) ✓ No. A version, stepMs, or profile mismatch is refused by name (2026-08-25).
- ~~**Q-VFY1**~~ (VFY) ✓ npm run verify — same command CI runs (2026-08-25).
- ~~**Q-SITE1**~~ (SITE) ✓ GitHub Pages from main via .github/workflows/pages.yml; CNAME from kit.json homepage (2026-08-25).
- **Q-SITE2** (SITE) DNS, TLS, and anything in front of GitHub Pages — not in the repo.
- **Q-LTR1** (LTR) WebGL backend — not in 0.1 (draw README, deliberately absent).
- **Q-LTR2** (LTR) DepthSorter elevation for flying objects — issue 66, open.
- **Q-LTR3** (LTR) Shipped bootstrap package replacing examples/_shared — issue 53, open.
- **Q-LTR4** (LTR) Validation session against published tarballs — issue 54, open.

## What the platform gives vs what we own

**Platform gives:** nine @latticekit packages, Canvas2D, WebAudio, agent skills, looking harness

**We own:** the sentence, the seed, the game folder, optional save schema and palette hue

## Planned filesystem

```
packages/
  core/     seeded rng, noise, math, easing, events, pools
  iso/      projection, camera, depth sort, tilemaps, paths
  draw/     Canvas2D surface, color, isometric solids
  loop/     wall-clock loop, fixed-step, replay
  input/    pointer and keyboard into tile intents
  audio/    WebAudio synthesis from recipes
  persist/  versioned saves, migration chain
  sim/      idle-economy maths, closed form
  ui/       DOM overlay primitives, not a framework
examples/
  _shared/  bootstrap — repo only, not on the registry
  city/     city-block exhibit, served at /x/city/
  demo/     complete small game, workspace dev server
  ...       sixteen more exhibits
from-one-sentence/  three unedited agent games
skills/    lattice parent plus eleven specialists
.claude-plugin/  marketplace and plugin manifest
.lattice/  kit.json, tasks.json, state.json
site/      landing page, not a workspace member
docs/      SEAMS, PERFORMANCE, GALLERY, SKILLS, LOOP, LAUNCH
tools/     lint, size, gallery, looking
```

## How this file is maintained

Generated from `lattice/atlas/data.mjs` by `node lattice/atlas/build.mjs`, which also builds the interactive atlas (`atlas.html`, published at https://adg29.github.io/system-atlas-directory/lattice/). Edit the data file, rebuild, republish — never edit this file by hand.
