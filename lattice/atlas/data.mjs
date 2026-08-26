// Single source of truth for the Lattice atlas. Built by: node lattice/atlas/build.mjs
// Primer: /workspace/lattice-atlas/primer.md (public main of https://github.com/plausibleventures/lattice)

export const META = {
  "title": "Lattice",
  "artifactUrl": "https://adg29.github.io/system-atlas-directory/lattice/",
  "sourcePath": "lattice/atlas/data.mjs",
  "buildCmd": "node lattice/atlas/build.mjs",
  "stats": [
    {
      "k": "System",
      "v": "lattice · public main"
    },
    {
      "k": "Packages",
      "v": "9"
    },
    {
      "k": "Skills",
      "v": "12"
    }
  ],
  "intro": "_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._",
  "onePara": "Lattice is an agentic isometric game kit. Type one sentence; the /lattice plugin scaffolds a zero-asset Canvas2D game from nine TypeScript packages with no dependencies. Buildings are drawn from one color, sound from oscillators, and a seed plus an input log replays the same pixel.",
  "costModel": [
    "- MIT kit. Nine packages, zero deps, zero asset files.",
    "- No engine account and no runtime fee. A game is a page.",
    "- No metered APIs in the kit. Canvas2D and WebAudio are browser APIs.",
    ""
  ],
  "deepDive": "Kit constitution: [AGENTS.md](https://github.com/plausibleventures/lattice/blob/main/AGENTS.md). Packages: [.lattice/kit.json](https://github.com/plausibleventures/lattice/blob/main/.lattice/kit.json). Skills: [docs/SKILLS.md](https://github.com/plausibleventures/lattice/blob/main/docs/SKILLS.md). Seams: [docs/SEAMS.md](https://github.com/plausibleventures/lattice/blob/main/docs/SEAMS.md).",
  "platformGives": "nine @latticekit packages, Canvas2D, WebAudio, agent skills, looking harness",
  "weOwn": "the sentence, the seed, the game folder, optional save schema and palette hue",
  "filesystem": "packages/\n  core/     seeded rng, noise, math, easing, events, pools\n  iso/      projection, camera, depth sort, tilemaps, paths\n  draw/     Canvas2D surface, color, isometric solids\n  loop/     wall-clock loop, fixed-step, replay\n  input/    pointer and keyboard into tile intents\n  audio/    WebAudio synthesis from recipes\n  persist/  versioned saves, migration chain\n  sim/      idle-economy maths, closed form\n  ui/       DOM overlay primitives, not a framework\nexamples/\n  _shared/  bootstrap — repo only, not on the registry\n  city/     city-block exhibit, served at /x/city/\n  demo/     complete small game, workspace dev server\n  ...       sixteen more exhibits\nfrom-one-sentence/  three unedited agent games\nskills/    lattice parent plus eleven specialists\n.claude-plugin/  marketplace and plugin manifest\n.lattice/  kit.json, tasks.json, state.json\nsite/      landing page, not a workspace member\ndocs/      SEAMS, PERFORMANCE, GALLERY, SKILLS, LOOP, LAUNCH\ntools/     lint, size, gallery, looking"
};
export const DECISIONS = [
  {
    "axis": "Product",
    "decision": "The product is the /lattice plugin and twelve skills. The nine packages exist so an agent succeeds — no sprite sheets to invent.",
    "adr": "[docs/SKILLS.md](https://github.com/plausibleventures/lattice/blob/main/docs/SKILLS.md)"
  },
  {
    "axis": "Runtime",
    "decision": "Nine zero-dependency TypeScript packages in a one-way DAG. core imports nothing; nothing imports ui. Not a framework app.",
    "adr": "[AGENTS.md](https://github.com/plausibleventures/lattice/blob/main/AGENTS.md)"
  },
  {
    "axis": "Determinism",
    "decision": "Seed plus input log replays the same pixel. Two arithmetic tiers: A may reach saves; B is pixels only and must declare itself.",
    "adr": "[AGENTS.md](https://github.com/plausibleventures/lattice/blob/main/AGENTS.md)"
  },
  {
    "axis": "Assets",
    "decision": "Zero assets. Art is procedural from one color; sound is synthesised. A PNG in a package is a different project.",
    "adr": "[AGENTS.md](https://github.com/plausibleventures/lattice/blob/main/AGENTS.md)"
  },
  {
    "axis": "Renderer",
    "decision": "Canvas2D only. No WebGL, WebGPU, WASM, workers, or OffscreenCanvas. Tile size is 64x32; any other uniform size is a camera zoom.",
    "adr": "[README.md](https://github.com/plausibleventures/lattice/blob/main/README.md)"
  },
  {
    "axis": "Contrib",
    "decision": "AGENTS.md is source of truth. The gate is build, lint, docs, skills, tests, measured, gallery, looking. No new deps. Green is not evidence.",
    "adr": "[CONTRIBUTING.md](https://github.com/plausibleventures/lattice/blob/main/CONTRIBUTING.md)"
  },
  {
    "axis": "License",
    "decision": "MIT covers the kit. Nine packages publish in lockstep under @latticekit. A minor may break source before 1.0; a patch never does.",
    "adr": "[LICENSE](https://github.com/plausibleventures/lattice/blob/main/LICENSE)"
  },
  {
    "axis": "Site",
    "decision": "lattice.plausible.ventures is GitHub Pages from main via .github/workflows/pages.yml. CNAME is written from kit.json homepage. Not gated on the verify suite.",
    "adr": "[.github/workflows/pages.yml](https://github.com/plausibleventures/lattice/blob/main/.github/workflows/pages.yml)"
  }
];
export const GROUPS = [
  {
    "id": "product",
    "title": "The sentence"
  },
  {
    "id": "kit",
    "title": "Nine packages"
  },
  {
    "id": "world",
    "title": "What paints"
  },
  {
    "id": "keep",
    "title": "Time and memory"
  },
  {
    "id": "proof",
    "title": "The gate"
  },
  {
    "id": "off",
    "title": "Designed for, not on"
  }
];
export const NODES = [
  {
    "id": "PLG",
    "code": "PLG",
    "name": "Plugin /lattice",
    "short": "PLUGIN",
    "group": "product",
    "gx": 1,
    "gy": 8,
    "w": 2,
    "d": 2,
    "h": 44,
    "kind": "screen",
    "one": "Type one sentence. Get a playable game in a browser.",
    "what": "A marketplace plugin for Claude Code, Codex, and Grok. /lattice owns the command. It picks an archetype, scaffolds, writes the game, gets a screen up in the first minute, then opens a browser and looks. The only questions it may ask: what the game is about, and consent to build blind or write into a non-empty folder.",
    "how": "`.claude-plugin/plugin.json` plus `skills/lattice/SKILL.md`. Flow: preflight, choose shape, scaffold, build, look. Specialists are loaded by name; they do not fire on phrase match for a from-scratch build.",
    "steps": [
      [
        "Preflight",
        "Node 20.19+, writable folder, any way to look (browser tool, MCP, or Chrome)."
      ],
      [
        "Shape",
        "Match the sentence to a shape. Say it in one line. Do not ask."
      ],
      [
        "Scaffold",
        "Install @latticekit packages in DAG order. Load starting before main.ts."
      ],
      [
        "Look",
        "Open, screenshot, judge, fix, repeat. Never report success on a black screen."
      ]
    ],
    "cond": [
      {
        "q": "Is the plugin a dependency of the packages?",
        "r": "No. Skills are distributed separately; no @latticekit package may assume they exist (2026-08-25)."
      },
      {
        "q": "Has the stranger-directory validation session been run against published tarballs?"
      }
    ]
  },
  {
    "id": "SKL",
    "code": "SKL",
    "name": "Skills",
    "short": "SKILLS",
    "group": "product",
    "gx": 1,
    "gy": 4,
    "w": 2,
    "d": 2,
    "h": 40,
    "kind": "box",
    "one": "One parent skill plus eleven specialists. Organized by what a person is trying to do.",
    "what": "Twelve skills under skills/: lattice (parent) and starting, art, world, economy, input, sound, saving, hud, determinism, performance, traps. Self-contained — the user has node_modules, not this repository. Traps are failures that compile, run, and look right. README names 34 of them.",
    "how": "docs/SKILLS.md is the design. Each skill lives in skills/<name>/SKILL.md. Parent loads specialists by name at the step that needs them. CI compiles every code block against published packages, not the workspace.",
    "steps": [
      [
        "Trigger",
        "Parent owns /lattice. Specialists do not auto-fire on a from-scratch build."
      ],
      [
        "Load",
        "starting before boot; art when drawing; world for terrain; economy for numbers; and so on."
      ],
      [
        "Traps",
        "Read traps when it works but looks wrong."
      ]
    ],
    "cond": [
      {
        "q": "Do skills ship inside @latticekit packages?",
        "r": "No. Distributed as the plugin; packages must work for someone who never heard of it (2026-08-25)."
      }
    ]
  },
  {
    "id": "LOOK",
    "code": "LOOK",
    "name": "Looking harness",
    "short": "LOOK",
    "group": "product",
    "gx": 1,
    "gy": 0,
    "w": 2,
    "d": 2,
    "h": 40,
    "kind": "box",
    "one": "Open it, screenshot it, judge it. Green is not evidence.",
    "what": "The tenth non-negotiable made into a loop. The plugin copies look.mjs into the project — no deps; drives Chrome and prints five readings: blank screen, world lost in empty frame, still picture, unreadable HUD, exception. CI looking step is tools/looking/verify.mjs on the gallery.",
    "how": "skills/lattice/references/looking.md and look.mjs. Preflight asks whether any rung is reachable (browser tool, MCP, or Chrome), not whether one named extension is installed. Without a way to look, it builds anyway and says nobody has looked.",
    "steps": [
      [
        "Open",
        "Get a real page on a dev server."
      ],
      [
        "Read",
        "Five checks on the first frame."
      ],
      [
        "Fix",
        "Change one thing, look again. Three misses: cut the feature."
      ]
    ],
    "cond": [
      {
        "q": "May the plugin report success on a suite that passed over a black screen?",
        "r": "No. With a browser, it compiles is not done. Without one, it says nobody has looked (2026-08-25)."
      }
    ]
  },
  {
    "id": "CORE",
    "code": "CORE",
    "name": "core + sim",
    "short": "CORE",
    "group": "kit",
    "gx": 6,
    "gy": 5,
    "w": 2.6,
    "d": 2.4,
    "h": 50,
    "kind": "box",
    "one": "Seeded rng, hashing, maths — and closed-form idle economy.",
    "what": "@latticekit/core has no deps and no DOM: Rng, noise, vec2, easing, pools, events. @latticekit/sim sits on core: cost curves, flow, offline accrual, capacity. sim reads no clock; every move takes an epoch timestamp. Offline warps time, never yield.",
    "how": "packages/core and packages/sim. Layer 0 and layer 1. Cost uses exponentiation by squaring so the charged number is Tier A. No global Rng.",
    "steps": [
      [
        "Seed",
        "Caller owns createRng. Sub-streams fork from identity, not cursor."
      ],
      [
        "Integrate",
        "sim.advance(state, epoch) — closed form, not a tick loop."
      ],
      [
        "Offline",
        "Credit is W(span) minus W(from). Never restart the warp."
      ]
    ],
    "cond": [
      {
        "q": "Does core depend on anything outside the kit?",
        "r": "No. Zero dependencies; core dependsOn is empty in kit.json (2026-08-25)."
      }
    ]
  },
  {
    "id": "ISO",
    "code": "ISO",
    "name": "iso + draw",
    "short": "DRAW",
    "group": "world",
    "gx": 11,
    "gy": 1.4,
    "w": 3,
    "d": 3,
    "h": 64,
    "kind": "tall",
    "one": "Projection, depth sort, and painting from one color. No PNG.",
    "what": "@latticekit/iso owns grid/world/screen, camera, DepthSorter, picking, paths. @latticekit/draw paints Canvas2D solids whose faces are derived from one color: cool shadows, warm highlights. renderFrame sorts immediately before Solids. Reordering after sort — including a stable shadow-then-body partition — makes a tap open the building behind.",
    "how": "packages/iso, packages/draw. Tile size 64x32. Seven closed passes. Light field is not occluded (documented limitation). Sprite bitmap cache was measured and not built.",
    "steps": [
      [
        "Begin",
        "beginFrame({surface, camera, palette, t})."
      ],
      [
        "Sort",
        "DepthSorter.sort(camera) inside renderFrame."
      ],
      [
        "Paint",
        "Walk indexAt forwards. pickSorted walks the same instance backwards."
      ]
    ],
    "cond": [
      {
        "q": "Does elevation enter the depth sort?",
        "r": "No for grounded sprites — heightPx is culling only (iso README). Flying objects still sort as if on the ground — issue 66, open (2026-08-25)."
      },
      {
        "q": "Are lights occluded by buildings?",
        "r": "No. Draw README names this the largest honest limitation; a lamp behind a hill still spills over it (2026-08-25)."
      },
      "contactShadow multiplies strength by a private 0.34 and paints a private SHADE_TINT — issue 68, open."
    ]
  },
  {
    "id": "LOOP",
    "code": "LOOP",
    "name": "loop",
    "short": "LOOP",
    "group": "keep",
    "gx": 9.4,
    "gy": 6.6,
    "w": 2,
    "d": 2,
    "h": 42,
    "kind": "box",
    "one": "The only package that knows what time it is. Clock is injected.",
    "what": "Fixed-step simulation, interpolated render, two timelines (sim and real), tweens, replay. Catch-up clamps at 250ms and drops the excess — loop credits nothing; sim does. loop.time is simulated time and drifts below realTime while hidden on purpose.",
    "how": "packages/loop. createLoop({clock, frames, update, render}). replay() is the constitution made falsifiable. stepMs is a compatibility constant in recorded sessions.",
    "steps": [
      [
        "Pump",
        "Read injected clock; advance real; clamp; step update; maybe render."
      ],
      [
        "Replay",
        "Same update function, seed plus input log, hash is Tier A only."
      ]
    ],
    "cond": [
      "loop.time silently diverges from realTime under coarse stepping and nothing surfaces the clamp — issue 67, open.",
      {
        "q": "Does loop credit offline earnings?",
        "r": "No. The loop advances callbacks; sim advances value. Excess catch-up is dropped (2026-08-25)."
      }
    ]
  },
  {
    "id": "IN",
    "code": "IN",
    "name": "input",
    "short": "INPUT",
    "group": "kit",
    "gx": 5,
    "gy": 10.4,
    "w": 3,
    "d": 3,
    "h": 24,
    "kind": "box",
    "one": "A tap arrives as a tile, never as a pixel.",
    "what": "Pointer, touch, keyboard into one replayable stream of intents, in tile coordinates, through the camera as it stood when the tick opened. Input never learns what is in the world. Gestures deliver on simulation ticks. Zoom is pointer-anchored; zoomAt is the only mutator.",
    "how": "packages/input. createInput / createHeadlessInput / createLog. Terrain must be declared (flat or a height field) or a slope pick is silently wrong — that was a 281 px / 14-tile bug, fixed in 0.1.1.",
    "steps": [
      [
        "Bucket",
        "A tick sees a bucket closed before it started."
      ],
      [
        "Resolve",
        "Tile via frozen camera and declared ground. Off-map is NaN, not sea level."
      ],
      [
        "Record",
        "Log keyed by tick for replay."
      ]
    ],
    "cond": [
      {
        "q": "Does a pointer handler convert pixels to tiles?",
        "r": "No. The conversion happens through the camera as it stood when the tick opened, never in a handler against the live camera (2026-08-25)."
      }
    ]
  },
  {
    "id": "AUD",
    "code": "AUD",
    "name": "audio",
    "short": "AUDIO",
    "group": "kit",
    "gx": 14,
    "gy": 8.2,
    "w": 2.6,
    "d": 2,
    "h": 28,
    "kind": "box",
    "one": "Sound without files. Oscillators, buses, a music deck.",
    "what": "WebAudio synthesis from declarative recipes. Hard voice ceiling. No AudioContext until a user gesture unlocks it. Silent, not throwing, where there is no WebAudio. This package stores nothing — mixer snapshot is handed to persist.",
    "how": "packages/audio. createAudio, createBed, createDeck. Layer 1, depends only on core.",
    "steps": [
      [
        "Unlock",
        "User gesture."
      ],
      [
        "Play",
        "Declarative SoundDef through the engine."
      ],
      [
        "Limit",
        "Voice ceiling; summed gains above 1 clip."
      ]
    ],
    "cond": [
      {
        "q": "Does audio ship wav or mp3 files?",
        "r": "No. Zero assets; synthesis only (2026-08-25)."
      }
    ]
  },
  {
    "id": "SAVE",
    "code": "SAVE",
    "name": "persist",
    "short": "SAVE",
    "group": "keep",
    "gx": 14.2,
    "gy": 12.2,
    "w": 2.2,
    "d": 2.2,
    "h": 36,
    "kind": "store",
    "one": "The chain is the version. A future save makes the store read-only.",
    "what": "Versioned saves, explicit migration chain, injected storage, checksums, replay verifier. Corrupt save degrades to fresh with a closed reason — never a throw on boot. A replay log is evidence, not progress: it is never migrated. Writes flush on visibilitychange, not beforeunload.",
    "how": "packages/persist. createStore, migrations, createRecorder. Storage adapter is injected; browser localStorage is one adapter.",
    "steps": [
      [
        "Open",
        "Read envelope; run one-rung migrations."
      ],
      [
        "Write",
        "Debounced; flush on hide."
      ],
      [
        "Refuse",
        "Future version is read-only. Replay stepMs mismatch is refused by name."
      ]
    ],
    "cond": [
      {
        "q": "Is a replay log migrated like a save?",
        "r": "No. A version, stepMs, or profile mismatch is refused by name (2026-08-25)."
      }
    ]
  },
  {
    "id": "HUD",
    "code": "HUD",
    "name": "ui overlay",
    "short": "HUD",
    "group": "world",
    "gx": 16,
    "gy": 2.6,
    "w": 2.6,
    "d": 2.4,
    "h": 48,
    "kind": "screen",
    "one": "DOM overlay primitives. Deliberately not a framework.",
    "what": "Panels, toasts, number rolls, thumbnails from the draw kit. No virtual DOM, no stylesheet. Root is pointer-events none; interactivity is granted per node so taps on the world are not swallowed. State updates on the interval cadence, never inside render — if render never runs, every number is still right.",
    "how": "packages/ui. createOverlay, drive, el, panel, toasts, roll. Depends on core and draw. Nothing imports ui.",
    "steps": [
      [
        "Mount",
        "createOverlay on the page."
      ],
      [
        "Drive",
        "drive(ui, boot) from the loop interval, not the paint callback."
      ]
    ],
    "cond": [
      {
        "q": "Is ui a React or Vue layer?",
        "r": "No. A few dozen DOM nodes. The package ships no stylesheet (2026-08-25)."
      }
    ]
  },
  {
    "id": "CITY",
    "code": "CITY",
    "name": "City and gallery",
    "short": "CITY",
    "group": "world",
    "gx": 11.2,
    "gy": 13.4,
    "w": 2.2,
    "d": 2.2,
    "h": 32,
    "kind": "box",
    "one": "Nineteen worlds, running. City is the visual hook.",
    "what": "examples/city is CITY BLOCK: nine blocks at the blue hour, thirty-six buildings, tap a tower and windows come on. Seed plus pen.t, no Date.now. The landing page embeds eighteen exhibits plus the hero live — nothing on it is a screenshot. Three unedited from-one-sentence games live at /g/. examples/demo is the complete small game on the workspace dev server.",
    "how": "examples/city/src/main.ts bootstraps via examples/_shared (repo-only). Site serves exhibits at /x/<name>/ — city at https://lattice.plausible.ventures/x/city/. Gallery spec: docs/GALLERY.md. Eight of eighteen exhibits were built by outside agents from the spec alone.",
    "steps": [
      [
        "Seed",
        "createCity(boot.seed)."
      ],
      [
        "Frame",
        "Overflow the viewport on purpose; downtown under the bottom edge."
      ],
      [
        "Tap",
        "bucket.pick on silhouette; FLAG_POWERED wakes windows."
      ]
    ],
    "cond": [
      {
        "q": "Does examples/_shared ship on the registry?",
        "r": "No. It exists only in the repo; eight outside agents all hit that (issue 53, 2026-08-25)."
      }
    ]
  },
  {
    "id": "VFY",
    "code": "VFY",
    "name": "Verify gate",
    "short": "VERIFY",
    "group": "proof",
    "gx": 17.6,
    "gy": 7.6,
    "w": 3,
    "d": 2,
    "h": 22,
    "kind": "store",
    "one": "Nothing lands red. The same command locally and in CI.",
    "what": "Root script: build, lint, docs, skills, counted tests, measured figures, gallery, looking. CI runs it on Node 20.19, 22, and 24. A second job runs the suite twice and diffs streams. Size budget is a separate CI step. Coverage is not part of the gate. docs compiles TypeScript in README and GUIDE; skills compiles each skill block against registry packages in CI.",
    "how": "package.json scripts.verify plus .github/workflows/ci.yml. tools/lint.mjs enforces determinism, layering, and kit.json exports.",
    "steps": [
      [
        "Build",
        "tsc --build."
      ],
      [
        "Lint",
        "House rules, including the clock and random bans."
      ],
      [
        "Look",
        "Gallery line cap and looking harness."
      ]
    ],
    "cond": [
      {
        "q": "What is the contrib gate?",
        "r": "npm run verify — same command CI runs (2026-08-25)."
      }
    ]
  },
  {
    "id": "SITE",
    "code": "SITE",
    "name": "Landing page",
    "short": "SITE",
    "group": "proof",
    "gx": 9.2,
    "gy": 11.2,
    "w": 2.6,
    "d": 2.6,
    "h": 22,
    "kind": "store",
    "one": "The shop window. Everything on it is Lattice, running.",
    "what": "site/ is not a workspace member and nothing in it may be imported by a package. Hero is a split with examples/demo live. Gallery tiles are live iframes. /llms.txt and /api.json for agents. /reference/ is generated from package .d.ts files. At most two scene loops run at once.",
    "how": ".github/workflows/pages.yml: on push to main, build packages, node site/tools/build.mjs, deploy-pages. CNAME from kit.json homepage = lattice.plausible.ventures. Deliberately not gated on the verify suite.",
    "steps": [
      [
        "Build",
        "Packages first, then site/tools/build.mjs."
      ],
      [
        "CNAME",
        "Host of kit.json homepage written into the artifact."
      ],
      [
        "Deploy",
        "actions/deploy-pages."
      ]
    ],
    "cond": [
      {
        "q": "How does lattice.plausible.ventures get published?",
        "r": "GitHub Pages from main via .github/workflows/pages.yml; CNAME from kit.json homepage (2026-08-25)."
      },
      "DNS, TLS, and anything in front of GitHub Pages — not in the repo."
    ]
  },
  {
    "id": "LTR",
    "code": "LTR",
    "name": "Later",
    "short": "LATER",
    "group": "off",
    "gx": 5,
    "gy": -1.2,
    "w": 2,
    "d": 2,
    "h": 36,
    "kind": "box",
    "ghost": true,
    "one": "Designed for, not on: WebGL, elevation-aware sort, shipped bootstrap.",
    "what": "Draw README: WebGL backend not in 0.1 — the Surface seam exists so it can land later without touching sprite code. DepthSorter has no elevation, so flying things sort behind what they cross (issue 66). examples/_shared bootstrap is repo-only (issue 53). The SKILLS.md stranger-directory session has not been run against published tarballs (issue 54).",
    "how": "Ghost. Open issues 66, 53, 54. Light occlusion is a documented limitation, not a tracker item, and lives on ISO rather than here.",
    "steps": [
      [
        "WebGL",
        "Surface has thirteen methods a backend could implement. Not shipped."
      ],
      [
        "Elevation",
        "Issue 66: suggested addAt(footprint, elevationPx)."
      ],
      [
        "Bootstrap",
        "Issue 53: eight outside agents all hit the missing shared boot."
      ]
    ],
    "cond": [
      "WebGL backend — not in 0.1 (draw README, deliberately absent).",
      "DepthSorter elevation for flying objects — issue 66, open.",
      "Shipped bootstrap package replacing examples/_shared — issue 53, open.",
      "Validation session against published tarballs — issue 54, open."
    ]
  }
];
export const FLOWS = [
  {
    "id": "sentence",
    "name": "One sentence",
    "hops": [
      [
        "PLG",
        "SKL",
        "/lattice",
        {
          "sentence": "an orchard that grows while the tab is closed"
        }
      ],
      [
        "SKL",
        "CORE",
        "install DAG",
        {
          "packages": [
            "core",
            "iso",
            "draw",
            "loop",
            "input"
          ]
        }
      ],
      [
        "SKL",
        "LOOK",
        "look",
        {
          "url": "localhost:5173"
        }
      ]
    ]
  },
  {
    "id": "frame",
    "name": "One frame",
    "hops": [
      [
        "LOOP",
        "ISO",
        "render(alpha, t)",
        {
          "stepMs": 16.667
        }
      ],
      [
        "ISO",
        "ISO",
        "sort then paint",
        {
          "passes": 7
        }
      ],
      [
        "IN",
        "ISO",
        "pickSorted",
        {
          "tile": true
        }
      ]
    ]
  },
  {
    "id": "tap",
    "name": "Tap a tower",
    "hops": [
      [
        "IN",
        "CITY",
        "touch",
        {
          "kind": "tap"
        }
      ],
      [
        "CITY",
        "ISO",
        "pickSorted silhouette",
        {
          "flag": "POWERED"
        }
      ],
      [
        "CITY",
        "HUD",
        "toast",
        {
          "msg": "woke"
        }
      ]
    ]
  },
  {
    "id": "replay",
    "name": "Replay a session",
    "hops": [
      [
        "IN",
        "SAVE",
        "input log",
        {
          "keyed": "tick"
        }
      ],
      [
        "SAVE",
        "LOOP",
        "replay()",
        {
          "stepMs": "compat"
        }
      ],
      [
        "LOOP",
        "CORE",
        "hash Tier A",
        {
          "divergedAt": -1
        }
      ]
    ]
  },
  {
    "id": "gate",
    "name": "Land a change",
    "hops": [
      [
        "VFY",
        "CORE",
        "lint+test",
        {
          "layering": "DAG"
        }
      ],
      [
        "VFY",
        "LOOK",
        "looking harness",
        {
          "blackScreen": false
        }
      ],
      [
        "VFY",
        "SITE",
        "not required",
        {
          "pagesIgnoresRed": true
        }
      ]
    ]
  }
];
export const CH = [
  {
    "id": "you",
    "title": "You type a sentence",
    "reveal": [
      "PLG",
      "SKL"
    ],
    "lede": "One command. The plugin decides everything else.",
    "story": "<p>Install the plugin in the agent you already use. Type <code>/lattice</code> and a sentence. The parent skill <mark>picks the shape, scaffolds, and writes a game</mark> without asking which packages to install. Specialists are loaded by name. The only questions that survive are what the game is about, and consent to build blind.</p>",
    "flow": [
      [
        "PLG",
        "SKL",
        "/lattice",
        {
          "sentence": "rebuild a lighthouse"
        }
      ],
      [
        "SKL",
        "CORE",
        "install DAG",
        {}
      ]
    ]
  },
  {
    "id": "kit",
    "title": "The kit underneath",
    "reveal": [
      "CORE"
    ],
    "lede": "Nine packages, one way. core imports nothing.",
    "story": "<p>The runtime is not a framework app. <code>@latticekit/core</code> is seeded rng, hashing, maths. <code>@latticekit/sim</code> is idle-economy maths in closed form on the same layer. The DAG in AGENTS.md points one way. An upward import is a design error, not an edge to add.</p>",
    "flow": [
      [
        "SKL",
        "CORE",
        "install",
        {
          "layer": 0
        }
      ]
    ]
  },
  {
    "id": "paint",
    "title": "Paint from one color",
    "reveal": [
      "ISO"
    ],
    "lede": "No PNG. Faces derived. Sort then walk.",
    "story": "<p><code>iso</code> owns the three spaces and the depth sort. <code>draw</code> paints Canvas2D solids from <mark>one color</mark> — cool shadows, warm highlights. <code>renderFrame</code> sorts immediately before Solids so no caller holds a list and improves it. Partitioning shadows then bodies is a reorder: the tap opens the building behind.</p>",
    "flow": [
      [
        "LOOP",
        "ISO",
        "renderFrame",
        {
          "passes": 7
        }
      ],
      [
        "ISO",
        "ISO",
        "sort then paint",
        {}
      ]
    ]
  },
  {
    "id": "tap",
    "title": "A tap is a tile",
    "reveal": [
      "IN"
    ],
    "lede": "Never convert a pointer in a handler.",
    "story": "<p>A tap arrives as a tile, through the camera <mark>as it stood when the tick opened</mark>. Input never learns what is in the world. pickSorted walks the same DepthSorter backwards. Off the map the coordinates are NaN, not a sea-level fallback.</p>",
    "flow": [
      [
        "IN",
        "ISO",
        "pickSorted",
        {
          "onGround": true
        }
      ]
    ]
  },
  {
    "id": "time",
    "title": "Time is a parameter",
    "reveal": [
      "LOOP"
    ],
    "lede": "Clock injected. The loop credits nothing.",
    "story": "<p><code>Math.random</code> and <code>Date.now</code> are banned in package src. Time arrives as a parameter. Catch-up clamps at 250ms; excess is dropped. <mark>loop.time is simulated time</mark> and drifts below realTime while hidden on purpose. Offline earnings belong to sim, not the loop. Seed plus input log replays the same pixel.</p>",
    "flow": [
      [
        "LOOP",
        "CORE",
        "update(dt, tick)",
        {
          "stepMs": 16.667
        }
      ],
      [
        "IN",
        "LOOP",
        "replay log",
        {
          "keyed": "tick"
        }
      ]
    ]
  },
  {
    "id": "keep",
    "title": "Sound, HUD, saves",
    "reveal": [
      "AUD",
      "HUD",
      "SAVE"
    ],
    "lede": "Oscillators, a few dozen DOM nodes, a migration chain.",
    "story": "<p>Audio is synthesised; nothing unlocks until a gesture. The overlay is not a framework — state on the interval, never on render. Persist: the chain <mark>is</mark> the version. A replay log is never migrated. A save from the future makes the store read-only.</p>",
    "flow": [
      [
        "AUD",
        "SAVE",
        "mixer snapshot",
        {}
      ],
      [
        "HUD",
        "LOOP",
        "drive on interval",
        {}
      ],
      [
        "SAVE",
        "LOOP",
        "stepMs compat",
        {}
      ]
    ]
  },
  {
    "id": "look",
    "title": "Look at it",
    "reveal": [
      "LOOK"
    ],
    "lede": "A suite that passes over a black screen is a failure.",
    "story": "<p>The plugin opens the game, screenshots it, and judges five things about the first frame. Preflight asks whether <mark>any</mark> way to look is reachable. Without one it still builds, and says nobody has looked. Green is not evidence — that is non-negotiable 10.</p>",
    "flow": [
      [
        "PLG",
        "LOOK",
        "screenshot",
        {}
      ],
      [
        "LOOK",
        "PLG",
        "fix one thing",
        {}
      ]
    ]
  },
  {
    "id": "city",
    "title": "Nineteen worlds",
    "reveal": [
      "CITY",
      "SITE"
    ],
    "lede": "City at /x/city/. The page is Lattice, running.",
    "story": "<p>The city exhibit is setback massing and a window rhythm; tap a tower. The landing page embeds the gallery live — nothing on it is a picture of Lattice. GitHub Pages from main publishes <mark>lattice.plausible.ventures</mark>. The shared bootstrap every exhibit uses is not on the registry.</p>",
    "flow": [
      [
        "SITE",
        "CITY",
        "iframe /x/city/",
        {}
      ],
      [
        "CITY",
        "ISO",
        "drawSprite",
        {
          "seed": "city-block"
        }
      ]
    ]
  },
  {
    "id": "gate",
    "title": "The gate",
    "reveal": [
      "VFY"
    ],
    "lede": "The same command locally and in CI. Nothing lands red.",
    "story": "<p>Build, lint, docs, skills, tests, measured figures, gallery, looking. CI runs it on three Node versions and diffs two suite runs. Docs compile the TypeScript in README. Skills compile against <mark>registry packages</mark> in CI, because the user has node_modules, not this repository. The pages deploy is deliberately not gated on this suite.</p>",
    "flow": [
      [
        "VFY",
        "CORE",
        "lint+test",
        {}
      ],
      [
        "VFY",
        "LOOK",
        "looking",
        {}
      ]
    ]
  },
  {
    "id": "later",
    "title": "Later",
    "reveal": [
      "LTR"
    ],
    "lede": "WebGL, flying-object sort, shipped bootstrap — designed-for, not on.",
    "story": "<p>The Surface seam is ready for a WebGL backend that is not in 0.1. DepthSorter has no elevation, so anything that flies sorts behind what it crosses. The bootstrap eight outside agents all had to invent is still repo-only. The stranger-directory validation session has not been run against published tarballs.</p>",
    "flow": [
      [
        "LTR",
        "ISO",
        "not in 0.1",
        {
          "webgl": false,
          "elevationSort": false
        }
      ]
    ]
  },
  {
    "id": "all",
    "title": "The whole system",
    "reveal": [],
    "lede": "Everything at once, for free exploration.",
    "story": "<p>Choose which flow runs (bottom left). Hover anything; click to pin; → goes inside. Open questions include elevation sort, silent loop clamp, unparameterised contactShadow, and anything in front of GitHub Pages.</p>"
  }
];
export const HOW_HTML = "<div class=\"eyebrow\">Lattice · public main</div><h1 class=\"t\">How it is built</h1><div class=\"sub\">nine packages, twelve skills, one command</div><h3 class=\"sec\">Filesystem</h3><pre>packages/\n  core/     seeded rng, noise, math, easing, events, pools\n  iso/      projection, camera, depth sort, tilemaps, paths\n  draw/     Canvas2D surface, color, isometric solids\n  loop/     wall-clock loop, fixed-step, replay\n  input/    pointer and keyboard into tile intents\n  audio/    WebAudio synthesis from recipes\n  persist/  versioned saves, migration chain\n  sim/      idle-economy maths, closed form\n  ui/       DOM overlay primitives, not a framework\nexamples/\n  _shared/  bootstrap — repo only, not on the registry\n  city/     city-block exhibit, served at /x/city/\n  demo/     complete small game, workspace dev server\n  ...       sixteen more exhibits\nfrom-one-sentence/  three unedited agent games\nskills/    lattice parent plus eleven specialists\n.claude-plugin/  marketplace and plugin manifest\n.lattice/  kit.json, tasks.json, state.json\nsite/      landing page, not a workspace member\ndocs/      SEAMS, PERFORMANCE, GALLERY, SKILLS, LOOP, LAUNCH\ntools/     lint, size, gallery, looking</pre><p>Vanilla TypeScript packages, not a framework app. <code>AGENTS.md</code> is the constitution. <code>.lattice/kit.json</code> is the machine-readable index.</p><h3 class=\"sec\">Product vs kit</h3><p>The product is the <mark>/lattice plugin and twelve skills</mark>. The nine packages are why an agent succeeds: no sprite sheet to hallucinate, seed plus input log, a DAG that fails on an upward import.</p><h3 class=\"sec\">The gate</h3><p>CONTRIBUTING: nothing lands red. Build, lint, docs, skills, tests, measured, gallery, looking. The pages deploy is a separate workflow and is not gated on that suite.</p>";
