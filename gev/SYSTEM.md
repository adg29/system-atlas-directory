# GEV — System Definition

_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._

_Question status: **10 open · 12 resolved**._

## One paragraph

God's Eye View is a browser geospatial console. Vite serves a vanilla Cesium globe of Google Photorealistic 3D Tiles; live public layers (aircraft, ships, satellites, quakes, traffic, cameras) paint on top; a Vite proxy keeps provider secrets server-side while the browser sees the Maps key, an optional Cesium ion token, and ephemeral voice tokens. You can talk to it.

## Decisions locked

| Axis | Decision | ADR |
|---|---|---|
| Runtime | Vanilla JS + CesiumJS + Vite. No framework. One browser tab is the process. | [CONTRIBUTING.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/CONTRIBUTING.md) |
| Globe | Google Photorealistic 3D Tiles are the planet; the default Cesium globe is hidden. Map Tiles API key is required. | [src/main.js](https://github.com/bilawalsidhu/gods-eye-view/blob/main/src/main.js) |
| Layers | One module per layer. DataLayerManager owns init → enable → update → disable → destroy and getStats. Sixteen production ids are sealed against LAYER_STATE_REGISTRY. | [src/data/manager.js](https://github.com/bilawalsidhu/gods-eye-view/blob/main/src/data/manager.js) |
| Secrets | Vite proxy holds private keys. The browser sees GOOGLE_MAPS_API_KEY, optional CESIUM_ION_TOKEN, and ephemeral OpenAI client secrets — nothing else. | [vite.config.js](https://github.com/bilawalsidhu/gods-eye-view/blob/main/vite.config.js) |
| Voice | Twenty-eight tools are declared server-side in GEV_REALTIME_TOOLS and executed client-side in gevActions.js. OPENAI_API_KEY never touches the browser. | [docs/CURRENT-STATE.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/docs/CURRENT-STATE.md) |
| Honesty | Flights interpolate one poll interval behind real time. Keyless traffic is SIMULATED. Launch ascent without telemetry is a RECONSTRUCTED ESTIMATE. Each layer keeps source and freshness visible. | [docs/CURRENT-STATE.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/docs/CURRENT-STATE.md) |
| Scope | The product models events, assets, infrastructure, and systems. Named-person search, face recognition, and tracking individuals are out of scope. | [README.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/README.md) |
| Bind | Dev server binds localhost by default. LAN is an explicit HOST=0.0.0.0 opt-in and brokers every configured key to anyone who can reach the process. | [SECURITY.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/SECURITY.md) |
| License | MIT covers source only. Bundled datasets and live feeds keep their own terms (notably TeleGeography CC BY-NC-SA). | [LICENSE](https://github.com/bilawalsidhu/gods-eye-view/blob/main/LICENSE) |

## Cost model

- **Google Map Tiles** (required, metered) — the photoreal planet. The key is injected into the browser; restrict it.
- **OpenAI** (optional, metered) — voice + HUD summary. Server-side only; in-app warning at $2, session cap at $5.
- **Optional free-tier keys** — AISStream (ships), NASA FIRMS (fires), TomTom (live traffic), Cesium ion (Bing stacks), OpenSky OAuth (more flight credits).
- **Most layers** — $0, no signup: OpenSky anon, USGS, CelesTrak, city CCTV, Radio Browser, GBFS, Launch Library 2, bundled OSM / TeleGeography extracts. Keyless traffic is labeled SIMULATED.

## Deep dives

Runtime source of truth: [docs/CURRENT-STATE.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/docs/CURRENT-STATE.md). Keys and terms: [README](https://github.com/bilawalsidhu/gods-eye-view), [DATA_SOURCES.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/DATA_SOURCES.md), [SECURITY.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/SECURITY.md).

## Reading order (the atlas chapters)

1. **You open the globe** — A page, a Cesium viewer, and Google 3D tiles. _(adds HUD, GL, TL)_
2. **Reskin reality** — GLSL sensor looks over a chosen basemap. _(adds ST, MS, SC)_
3. **Light up the sky** — The manager turns a public feed into moving marks. _(adds LM, LY)_
4. **Look through a camera** — Public stills project into the 3D city. _(adds CV)_
5. **Detection** — Boxes on everything in view, without pinning the GPU. _(adds DT)_
6. **Ride a plane** — Contacts-gated first-person. Not WebXR. _(adds CK)_
7. **Talk to it** — Twenty-eight tools. The key never enters the tab. _(adds VC, AN)_
8. **Keys stay on the server** — The Vite proxy is the API. Localhost by default. _(adds PX)_
9. **Later** — Weather radar, general replay, and LiDAR are designed-for, not on. _(adds WX)_
10. **The whole system** — Everything at once, for free exploration.

## Structures

### The globe

#### GL · Cesium globe

**In one line.** The Cesium viewer. One tab, no framework, 60 fps cap.

**What it does.** CesiumJS Viewer with all default chrome stripped. The engine globe is hidden so Google tiles can be the planet. A render governor idles the scene unless something is animating. Hidden tabs stop the loop.

**How it's built.** `src/main.js` **new Cesium.Viewer**. `src/renderGovernor.js` flips requestRenderMode. `src/scopeMask.js` is the circular keyhole (DISPLAY SCOPE + FEATHER). Attribution stays visible — Google ToS.

**Steps in execution.**

1. **Create** — Viewer in #cesiumContainer; targetFrameRate 60.
2. **Hide globe** — scene.globe.show = false so 2D imagery does not clip 3D buildings.
3. **Wire** — Map stack, StyleManager, DataLayerManager, scenes, annotations, voice.
4. **Idle** — Install the render governor after every module has registered holds.

**Questions.**

- ~~**Q-GL1** Is there a React/Vue/Svelte app around this?~~ ✓ No. Vanilla JS + CesiumJS + Vite (2026-08-25).

#### TL · Photoreal tiles

**In one line.** Google Photorealistic 3D Tiles — the actual planet.

**What it does.** This is the required key. Map Tiles API draws street-to-orbit photogrammetry. If tiles fail to load, the app continues on the Cesium globe / OSM rather than dying. Cesium World Terrain is intentionally off — it fights the Google mesh.

**How it's built.** `Cesium.createGooglePhotorealistic3DTileset` in `src/main.js`. Key via `import.meta.env.GOOGLE_MAPS_API_KEY` (Vite `define`). Also copied to `window.__GOOGLE_MAPS_API_KEY__` for geocoding.

**Steps in execution.**

1. **Key** — GOOGLE_MAPS_API_KEY must be set or init throws.
2. **Load** — createGooglePhotorealistic3DTileset; add to scene.primitives.
3. **Fallback** — On failure, show the Cesium globe and start the map stack on OSM.

**Questions.**

- ~~**Q-TL1** Does the app run without a Google Maps key?~~ ✓ No. src/main.js throws if GOOGLE_MAPS_API_KEY is missing (2026-08-25).
- **Q-TL2** Production Map Tiles billing, quotas, and referrer restrictions for a given deploy.

#### ST · Sensor looks

**In one line.** GLSL post-process looks: CRT, NVG, FLIR, anime, noir, snow.

**What it does.** The whole live planet re-renders through a different sensor. Keys 1–7. Military looks (CRT/NVG/FLIR) auto-enable Dense detection until you override. FLIR can switch to an Ironbow palette.

**How it's built.** `src/styles/` fragment shaders imported by `src/ui.js` STYLES: retro, surveillance (NVG), thermal (FLIR), anime, noir, snow. Cesium post-process stages; intensity crossfades in StyleManager.

**Steps in execution.**

1. **Pick** — Key 1–7 or set_visual_style / the presets tray.
2. **Stage** — Activate the matching Cesium post-process; uniforms from STYLE_PRESET_DEFAULTS.
3. **Detect** — CRT/NVG/FLIR apply MILITARY_DETECTION_PRESET unless _detectionUserOverridden.

#### MS · Map stacks

**In one line.** The basemap under the layers: Google 3D, Bing, or OSM.

**What it does.** Four tiles in Visual Presets. Photoreal is default. Bing Aerial / Labels need a public Cesium ion token. OSM is keyless. Bing Road is retired — old map=bing-road links fall back to photoreal.

**How it's built.** `src/mapStackController.js` + `src/mapStackChips.js`. Share-link, voice set_map_stack, and the chip row all call the same _setMapStack(). Ion chips stay visible but aria-disabled without a token.

**Steps in execution.**

1. **Default** — photoreal if Google tiles loaded; else osm.
2. **Switch** — Chip / voice / share hash → setStack.
3. **Fail** — Rejected ion switch leaves the genuinely active source lit.

**Questions.**

- ~~**Q-MS1** Is Bing Road still a stack?~~ ✓ No. Retired from MAP_STACKS and from the set_map_stack enum; road phrasings resolve to OSM (2026-08-25).
- **Q-MS2** Whether this install has CESIUM_ION_TOKEN (Bing stacks).

### The console

#### HUD · Operator HUD

**In one line.** The glass cockpit around the globe — panels, keys, share links.

**What it does.** Left rail is Data Layers and Scenes. Right rail is DISPLAY, CCTV, and CONTEXT. Bottom is visual presets, the mic, and status chips. Share links serialize camera, style, layers, and one tracked target into the URL hash.

**How it's built.** `src/ui.js` **StyleManager** plus `src/hud.js`. Keyboard `1`–`7` styles, `H` HUD, `D` detection, `C` cockpit. First-run missions live in `src/firstRunExperience.js`. Share codec is `src/sharelink.js` / `src/data/layerState.js`.

**Steps in execution.**

1. **Boot** — StyleManager attaches to the Cesium viewer and the map-stack controller.
2. **Chrome** — Build left accordion, right DISPLAY/CCTV/CONTEXT rail, and the HUD overlay.
3. **Restore** — If a share hash or gev:layer-state:v2 snapshot exists, restore it; else first-run defaults.
4. **Facade** — setHud / setDetection / setMapStack / setVisualStyle return {ok, ...state} so voice only confirms what happened.

**Questions.**

- ~~**Q-HUD1** Where does the operator chrome live?~~ ✓ StyleManager in src/ui.js, with the intelligence readout in src/hud.js (2026-08-25).
- **Q-HUD2** HUD layout and panel collapse state in this browser (v6 collapse keys, v8 positions).

#### CK · Cockpit

**In one line.** Ride inside a tracked flight. The terrain holds underneath you.

**What it does.** First-person camera from the delayed, interpolated track. Visor HUD, contacts window, briefing carousel. Not WebXR. Entry is gated: Contacts mode on, both flight layers on, a civilian or military aircraft tracked.

**How it's built.** Cockpit modules under `src/cockpit*.js` plus camera handoff in the flight layers. Vision cycle is inherited map preset, CRT, NVG, FLIR, NOIR. Opt-in WX clouds are a capped WebGL pass (`src/cockpitCloudEffects.js`), default off.

**Steps in execution.**

1. **Gate** — Contacts active, flights + military enabled, an aircraft tracked.
2. **Enter** — Release Cesium orbit-follow; drive a first-person camera from the displayed track.
3. **Ride** — Instruments at 10 Hz, camera at 20 Hz; detection stays owned by Contacts.
4. **Exit** — C, Escape, or EXIT COCKPIT restores the follow camera on the same contact.

**Questions.**

- ~~**Q-CK1** Is Cockpit a WebXR session?~~ ✓ No. Desktop first-person presentation, not WebXR (2026-08-25).

#### DT · Detection

**In one line.** Screen-space boxes and IDs on everything in view.

**What it does.** Samples enabled layers through getDetectableObjects and paints brackets from the shared world-overlay post-render callback so boxes match the final camera frame. First-run default is Dense at 75%. CRT/NVG/FLIR auto-apply that preset until you override.

**How it's built.** `src/data/detection.js` + `detectionDraw.js` + `labelArbiter.js`. Takes **no continuous-render hold** — it asks for one more frame while fade/solve work is outstanding (`detectionRenderDemand.js`).

**Steps in execution.**

1. **Sample** — Each enabled layer that implements getDetectableObjects reports objects in view.
2. **Solve** — Label arbiter allocates quotas (ELASTIC default, or WEIGHTED).
3. **Paint** — One post-render callback draws brackets and labels.
4. **Idle** — No hold: a parked scene with detection on costs zero extra frames.

**Questions.**

- ~~**Q-DT1** Does detection pin the render loop at 60 fps?~~ ✓ No. It takes no continuous-render hold; measured 0 renders / 5 s with detection on a parked empty scene (2026-08-22).

#### SC · Scene director

**In one line.** Cinematic camera tours for clips and demos.

**What it does.** Deterministic scene playback. While a scene runs, Clear Selected Layers and Reset Globe stay hidden because the transport owns camera and layers. Voice control_scene lists, plays, and stops.

**How it's built.** `src/scenes/director.js` + `src/scenes/recipes.js` + `scenePolicy.js`. Constructed in main.js as SceneDirector(viewer, styleManager, dataManager).

**Steps in execution.**

1. **Pick** — A recipe from the Scenes panel or control_scene.
2. **Play** — Director sequences camera and declared layers; undeclared layers are left alone.
3. **Stop** — Transport releases; Clear / Reset Globe return.

### Live signals

#### LM · Layer manager

**In one line.** The gate that turns a layer on and off without double-polling.

**What it does.** Registers every production layer, seals the 16-id registry, and serializes visibility so two rapid toggles cannot arm two OpenSky intervals. Feed chips read getStats through one honest state machine: ON / LOADING / DEGRADED / STALE / FALLBACK / UNAVAILABLE.

**How it's built.** `src/data/manager.js` DataLayerManager. Enable path: **init → enable → first update → interval**. destroy() on teardown. Share restoration waits until finalizeRegistrations(LAYER_STATE_REGISTRY).

**Steps in execution.**

1. **Register** — main.js registers 16 modules then finalizeRegistrations.
2. **Intent** — User / voice / tool setEnabled with a monotonic epoch; newer aborts older.
3. **Lifecycle** — init (once), enable, update, arm interval; disable clears the timer.
4. **Stats** — layerFeedState(getStats()) drives the row chip.

**Questions.**

- ~~**Q-LM1** How many production layers are sealed?~~ ✓ 16 ids in LAYER_STATE_REGISTRY, including military-awareness which is not a user-visible Data Layers row (2026-08-25).

#### LY · Live layers

**In one line.** The public signals: flights, ships, sats, quakes, traffic, fires, radio, more.

**What it does.** Fifteen user-visible overlays besides CCTV, each a src/data module with its own source and cadence. Flights interpolates one poll behind real time. AIS is a server websocket the browser polls. FIRMS and TomTom are key-gated; without a key the row says so (KEY REQUIRED / SIMULATED). Bundled datacenters, dams, and cables are static extracts.

**How it's built.** flights (OpenSky 30s + adsb.lol fallback), military (adsb.lol 15s), ais-live-vessels (AISStream via /api/ais-live), satellites (CelesTrak), rocket-launches (Launch Library 2), earthquakes (USGS 60s, no proxy), traffic (Overpass ± TomTom), radio, bikeshare, installations, local-datacenters, local-dams, telegeography-submarine-cables, local-firms (NASA FIRMS live). Contacts mode owns the awareness coordinator.

**Steps in execution.**

1. **Enable** — Manager init/enable/update; first fetch through the matching /api/* proxy or USGS.
2. **Reconcile** — Keyed records (ICAO, MMSI, NORAD) survive refreshes; stale contacts fade then evict.
3. **Draw** — Billboards / models / ellipses / heat on the Cesium scene; detection samples getDetectableObjects.
4. **Context** — CONTACTS or SPACE MISSIONS can own a subset and restore the prior snapshot on exit.

**Questions.**

- ~~**Q-LY1** Are FIRMS fires still a bundled snapshot?~~ ✓ No. local-firms is live NASA FIRMS via /api/firms; the id keeps a local- prefix for persistence (2026-08-25).
- **Q-LY2** Which optional keys this install has (AISStream, FIRMS, TomTom, OpenSky OAuth) and which layers the operator has enabled.

#### CV · CCTV

**In one line.** Public cameras projected into the 3D city — not webcam embeds.

**What it does.** Austin, Caltrans (CA), and TfL London stills, with Street View as a fallback frame. VIEWSHED draws each camera's estimated coverage volume. The proxy will not fetch a URL the client invented.

**How it's built.** `src/data/cctv.js` + viewshed/gizmo/LOD helpers. Frames via **/api/cctv** (server allowlist, 8s abort). Source packs in `config/cctv_sources.*.json`. Calibration persists at godsEyeView.cctv.calibration.v2.

**Steps in execution.**

1. **Enable** — Manager lifecycle; registry from the server-side source pack.
2. **Fetch** — Same-origin /api/cctv stills on an 8s timeout.
3. **Project** — Drape the frame onto the photoreal mesh at the camera pose.
4. **Viewshed** — Optional coverage volume; click-to-track can hand off from a fire or vessel.

**Questions.**

- ~~**Q-CV1** Can the browser point the CCTV proxy at an arbitrary URL?~~ ✓ No. Client-specified upstream URLs are rejected; only the server allowlist is fetched (2026-08-25).
- **Q-CV2** Which CCTV_SOURCES_FILE / city pack this deploy uses (Austin is the reference; Shinjuku exists in tree).

### Talk to it

#### VC · Voice

**In one line.** Twenty-eight tools. It knows what it is looking at.

**What it does.** OpenAI Realtime over WebRTC. The agent pulls live scene context before answering. Without an OpenAI key the mic reports unavailable and the globe still runs. In-app session cap $5; in-flight tools complete rather than roll back.

**How it's built.** Schemas in `vite.config.js` **GEV_REALTIME_TOOLS**. Execution in `src/voice/gevActions.js`. Session in `src/voice/gevRealtime.js`. Token: GET /api/realtime/token → ephemeral client secret. Cost in `src/voice/voiceCost.js`.

**Steps in execution.**

1. **Mint** — Browser asks /api/realtime/token; middleware holds OPENAI_API_KEY.
2. **Connect** — WebRTC SDP to api.openai.com with the ephemeral token.
3. **Tool** — Model emits a function call; gevActions runs it on StyleManager / layers / camera.
4. **Confirm** — Spoken confirmation only on ok:true. Cap trips stop(); in-flight mutations finish.

**Questions.**

- ~~**Q-VC1** Does the browser see OPENAI_API_KEY?~~ ✓ No. Vite middleware mints ephemeral Realtime client secrets at /api/realtime/token (2026-08-25).
- ~~**Q-VC2** How many voice tools?~~ ✓ 28, listed in CURRENT-STATE and GEV_REALTIME_TOOLS (2026-08-25).
- **Q-VC3** Whether this install has OPENAI_API_KEY, and which realtime model id OpenAI currently serves.

#### AN · Annotations

**In one line.** Speak a mark, a polygon, or a walking route onto the world.

**What it does.** Voice whiteboard. Marks accumulate until you clear them. Cap 120 live marks. Routes can be flown with fly_route. Known gap: mall/lifestyle districts can prefer a named building over the broader envelope.

**How it's built.** `src/annotations/annotationEngine.js` + resolver + hybrid renderer (world-space areas/routes, screen-space pins). Tools: annotate_map, clear_annotations. Routes via /api/route (OSRM proxy).

**Steps in execution.**

1. **Resolve** — Name / coords / pixels → world anchor (Geocode, Places, Overpass, OSRM).
2. **Draw** — Draped geometry in Cesium; reticles and callouts in SVG.
3. **Cap** — Hard cap 120; clear is explicit only.

**Questions.**

- **Q-AN1** Mall/lifestyle district scoring still prefers some named buildings over the retail envelope (CURRENT-STATE known resolver gap).

### Keys and proxy

#### PX · Vite proxy

**In one line.** Where the secrets live. The browser never holds the private keys.

**What it does.** vite.config.js is both the bundler and the API. Same-origin /api/* routes cache, rate-limit, and sanitize upstream calls. AISStream websocket, OpenSky OAuth, FIRMS, TomTom, CCTV allowlist, Realtime token mint — all here. Default bind is localhost.

**How it's built.** `vite.config.js` plugins: openSky, celestrak, tomtom, firms, launches, terrain, adsbdb, overpass, installations, regionalBrief, weather, cctv, radio, gbfs, adsbLol, aisLive, tracks, openAiRealtime, googlePlaces. `define` injects only GOOGLE_MAPS_API_KEY and CESIUM_ION_TOKEN.

**Steps in execution.**

1. **Env** — .env / Keychain / shell. Empty string is not unset — the launcher env -u's it.
2. **Broker** — Browser calls /api/*; middleware adds auth and cache.
3. **Mint** — /api/realtime/token returns an ephemeral client secret, not OPENAI_API_KEY.
4. **Bind** — localhost unless HOST=0.0.0.0 (LAN warning: keys are reachable).

**Questions.**

- ~~**Q-PX1** Which keys reach the browser bundle?~~ ✓ GOOGLE_MAPS_API_KEY and CESIUM_ION_TOKEN via Vite define; OpenAI/AIS/FIRMS/TomTom stay server-side; voice uses ephemeral tokens (2026-08-25).
- **Q-PX2** How maptheworld.ai is hosted — this repo has no production deploy workflow, Dockerfile, or replica topology.
- **Q-PX3** Concurrent replicas behind one origin (Radio catalogInstance assumes a single-process dev server; out of scope in CURRENT-STATE).

### Designed for, not on (designed for, not built)

#### WX · Later _(not switched on)_

**In one line.** Designed-for, not on: weather radar, general replay, LiDAR.

**What it does.** Weather radar was removed before OSS v1. There is no general timeline outside Space Missions ascent/orbit replay. LiDAR explorer and paired-point CCTV calibration are experiments, not runtime. Historical "what happened" tiling is called out as future work on halfpixel.ai — not this repo.

**How it's built.** **Ghost**. CURRENT-STATE § Not Currently in Runtime. Cockpit WX clouds are a separate opt-in pass and are not this node.

**Steps in execution.**

1. **Radar** — Removed; no reliable visible payoff.
2. **Replay** — Only Space Missions ascent/orbit exists; no general scrubber.
3. **LiDAR** — Calibration experiments, not shipped.

**Questions.**

- **Q-WX1** Whether historical replay (halfpixel.ai) will land in this repo or a separate product.

## Flows (representative packets)

Payload shapes are what the design implies, not measured traffic.

### Cold start

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | HUD → GL | init() | `{"container":"cesiumContainer","targetFrameRate":60}` |
| 2 | GL → TL | createGooglePhotorealistic3DTileset | `{"api":"Map Tiles","globeShow":false}` |
| 3 | TL → GL | primitives.add | `{"tileset":"photoreal"}` |
| 4 | GL → LM | new DataLayerManager | `{"seal":16}` |
| 5 | GL → HUD | StyleManager | `{"style":"normal","hud":"tactical"}` |

### Enable flights

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | HUD → LM | setEnabled | `{"layerId":"flights","origin":"user","enabled":true}` |
| 2 | LM → LY | init → enable → update | `{"layerId":"flights"}` |
| 3 | LY → PX | GET /api/opensky | `{"mode":"oauth\|anon","intervalS":30}` |
| 4 | PX → LY | state vectors | `{"source":"OpenSky","delayed":true}` |
| 5 | LY → GL | billboards + models | `{"interpolate":"one poll behind"}` |
| 6 | LY → DT | getDetectableObjects | `{"type":"AIR"}` |

### Voice turn

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | HUD → PX | GET /api/realtime/token | `{"tier":"standard"}` |
| 2 | PX → VC | ephemeral client_secret | `{"model":"gpt-realtime-2"}` |
| 3 | VC → HUD | get_current_view_state | `{"style":"thermal","layers":["flights"]}` |
| 4 | VC → LM | set_layer_visibility | `{"layerId":"flights","enabled":true}` |
| 5 | VC → GL | fly_to_location | `{"query":"LAX","waitForArrival":true}` |
| 6 | VC → HUD | spoken confirm | `{"ok":true,"text":"Flights on. At LAX."}` |

### Project a camera

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | HUD → LM | setEnabled | `{"layerId":"cctv","origin":"user","enabled":true}` |
| 2 | LM → CV | init → enable → update | `{"pack":"austin"}` |
| 3 | CV → PX | GET /api/cctv | `{"allowlist":true,"timeoutMs":8000}` |
| 4 | PX → CV | still frame | `{"source":"Austin Open Data"}` |
| 5 | CV → GL | project into mesh | `{"viewshed":"optional"}` |

### Ride a contact

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | LY → CK | track + COCKPIT | `{"icao24":"a1b2c3","gate":"contacts"}` |
| 2 | CK → GL | first-person camera | `{"from":"interpolated track","hz":20}` |
| 3 | CK → ST | vision cycle | `{"cycle":["inherited","CRT","NVG","FLIR","NOIR"]}` |
| 4 | CK → HUD | EXIT COCKPIT | `{"restore":"follow camera"}` |

## Questions — index

Reference by ID. ✓ resolved (with date) · otherwise open.

- ~~**Q-GL1**~~ (GL) ✓ No. Vanilla JS + CesiumJS + Vite (2026-08-25).
- ~~**Q-TL1**~~ (TL) ✓ No. src/main.js throws if GOOGLE_MAPS_API_KEY is missing (2026-08-25).
- **Q-TL2** (TL) Production Map Tiles billing, quotas, and referrer restrictions for a given deploy.
- ~~**Q-MS1**~~ (MS) ✓ No. Retired from MAP_STACKS and from the set_map_stack enum; road phrasings resolve to OSM (2026-08-25).
- **Q-MS2** (MS) Whether this install has CESIUM_ION_TOKEN (Bing stacks).
- ~~**Q-HUD1**~~ (HUD) ✓ StyleManager in src/ui.js, with the intelligence readout in src/hud.js (2026-08-25).
- **Q-HUD2** (HUD) HUD layout and panel collapse state in this browser (v6 collapse keys, v8 positions).
- ~~**Q-CK1**~~ (CK) ✓ No. Desktop first-person presentation, not WebXR (2026-08-25).
- ~~**Q-DT1**~~ (DT) ✓ No. It takes no continuous-render hold; measured 0 renders / 5 s with detection on a parked empty scene (2026-08-22).
- ~~**Q-LM1**~~ (LM) ✓ 16 ids in LAYER_STATE_REGISTRY, including military-awareness which is not a user-visible Data Layers row (2026-08-25).
- ~~**Q-LY1**~~ (LY) ✓ No. local-firms is live NASA FIRMS via /api/firms; the id keeps a local- prefix for persistence (2026-08-25).
- **Q-LY2** (LY) Which optional keys this install has (AISStream, FIRMS, TomTom, OpenSky OAuth) and which layers the operator has enabled.
- ~~**Q-CV1**~~ (CV) ✓ No. Client-specified upstream URLs are rejected; only the server allowlist is fetched (2026-08-25).
- **Q-CV2** (CV) Which CCTV_SOURCES_FILE / city pack this deploy uses (Austin is the reference; Shinjuku exists in tree).
- ~~**Q-VC1**~~ (VC) ✓ No. Vite middleware mints ephemeral Realtime client secrets at /api/realtime/token (2026-08-25).
- ~~**Q-VC2**~~ (VC) ✓ 28, listed in CURRENT-STATE and GEV_REALTIME_TOOLS (2026-08-25).
- **Q-VC3** (VC) Whether this install has OPENAI_API_KEY, and which realtime model id OpenAI currently serves.
- **Q-AN1** (AN) Mall/lifestyle district scoring still prefers some named buildings over the retail envelope (CURRENT-STATE known resolver gap).
- ~~**Q-PX1**~~ (PX) ✓ GOOGLE_MAPS_API_KEY and CESIUM_ION_TOKEN via Vite define; OpenAI/AIS/FIRMS/TomTom stay server-side; voice uses ephemeral tokens (2026-08-25).
- **Q-PX2** (PX) How maptheworld.ai is hosted — this repo has no production deploy workflow, Dockerfile, or replica topology.
- **Q-PX3** (PX) Concurrent replicas behind one origin (Radio catalogInstance assumes a single-process dev server; out of scope in CURRENT-STATE).
- **Q-WX1** (WX) Whether historical replay (halfpixel.ai) will land in this repo or a separate product.

## What the platform gives vs what we own

**Platform gives:** CesiumJS viewer, Vite, Google Photorealistic 3D Tiles, public feeds, OpenAI Realtime session tokens

**We own:** operator .env keys, CCTV source pack, enabled layers, visual style, share-link hash, localStorage

## Planned filesystem

```
src/
  main.js               Cesium viewer + Google tiles + wiring
  ui.js                 StyleManager: HUD, styles, panels, share links
  hud.js                intelligence HUD
  camera.js · cameraVerbs.js
  mapStackController.js photoreal / Bing / OSM
  sharelink.js
  renderGovernor.js · scopeMask.js
  styles/               GLSL: CRT, NVG, FLIR, anime, noir, snow
  data/
    manager.js          layer lifecycle
    flights.js · militaryFlights.js · aisLiveVessels.js
    satellites.js · earthquakes.js · traffic.js · cctv.js
    radio.js · bikeshare.js · rocketLaunches.js
    militaryInstallations.js · militaryAwareness.js
    localLayers.js      datacenters, dams, cables, FIRMS
    detection.js · trackedReadout.js · layerState.js
    local_data/         bundled datasets (own licenses)
  voice/                OpenAI Realtime + gevActions.js
  annotations/          voice whiteboard
  scenes/               cinematic director
  cockpit*.js
vite.config.js          proxies + GEV_REALTIME_TOOLS + client-exposed keys
index.html · style.css
docs/CURRENT-STATE.md   runtime source of truth
```

## How this file is maintained

Generated from `gev/atlas/data.mjs` by `node gev/atlas/build.mjs`, which also builds the interactive atlas (`atlas.html`, published at https://adg29.github.io/system-atlas-directory/gev/). Edit the data file, rebuild, republish — never edit this file by hand.
