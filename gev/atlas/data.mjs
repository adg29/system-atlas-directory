// Single source of truth for the GEV atlas. Built by: node gev/atlas/build.mjs
// Primer: /workspace/gev-atlas/primer.md (public main of https://github.com/bilawalsidhu/gods-eye-view)

export const META = {
  title: 'GEV',
  artifactUrl: 'https://adg29.github.io/system-atlas-directory/gev/',
  sourcePath: 'gev/atlas/data.mjs',
  buildCmd: 'node gev/atlas/build.mjs',
  stats: [
    { k: 'System', v: 'gev · public main' },
    { k: 'Layers', v: '16' },
    { k: 'Voice tools', v: '28' },
  ],
  intro: `_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._`,
  onePara: `God's Eye View is a browser geospatial console. Vite serves a vanilla Cesium globe of Google Photorealistic 3D Tiles; live public layers (aircraft, ships, satellites, quakes, traffic, cameras) paint on top; a Vite proxy keeps provider secrets server-side while the browser sees the Maps key, an optional Cesium ion token, and ephemeral voice tokens. You can talk to it.`,
  costModel: [
    '- **Google Map Tiles** (required, metered) — the photoreal planet. The key is injected into the browser; restrict it.',
    '- **OpenAI** (optional, metered) — voice + HUD summary. Server-side only; in-app warning at $2, session cap at $5.',
    '- **Optional free-tier keys** — AISStream (ships), NASA FIRMS (fires), TomTom (live traffic), Cesium ion (Bing stacks), OpenSky OAuth (more flight credits).',
    '- **Most layers** — $0, no signup: OpenSky anon, USGS, CelesTrak, city CCTV, Radio Browser, GBFS, Launch Library 2, bundled OSM / TeleGeography extracts. Keyless traffic is labeled SIMULATED.',
    '',
  ],
  deepDive: 'Runtime source of truth: [docs/CURRENT-STATE.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/docs/CURRENT-STATE.md). Keys and terms: [README](https://github.com/bilawalsidhu/gods-eye-view), [DATA_SOURCES.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/DATA_SOURCES.md), [SECURITY.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/SECURITY.md).',
  platformGives: 'CesiumJS viewer, Vite, Google Photorealistic 3D Tiles, public feeds, OpenAI Realtime session tokens',
  weOwn: 'operator .env keys, CCTV source pack, enabled layers, visual style, share-link hash, localStorage',
  filesystem: `src/
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
docs/CURRENT-STATE.md   runtime source of truth`,
};

export const DECISIONS = [
  { axis: 'Runtime', decision: 'Vanilla JS + CesiumJS + Vite. No framework. One browser tab is the process.', adr: '[CONTRIBUTING.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/CONTRIBUTING.md)' },
  { axis: 'Globe', decision: 'Google Photorealistic 3D Tiles are the planet; the default Cesium globe is hidden. Map Tiles API key is required.', adr: '[src/main.js](https://github.com/bilawalsidhu/gods-eye-view/blob/main/src/main.js)' },
  { axis: 'Layers', decision: 'One module per layer. DataLayerManager owns init → enable → update → disable → destroy and getStats. Sixteen production ids are sealed against LAYER_STATE_REGISTRY.', adr: '[src/data/manager.js](https://github.com/bilawalsidhu/gods-eye-view/blob/main/src/data/manager.js)' },
  { axis: 'Secrets', decision: 'Vite proxy holds private keys. The browser sees GOOGLE_MAPS_API_KEY, optional CESIUM_ION_TOKEN, and ephemeral OpenAI client secrets — nothing else.', adr: '[vite.config.js](https://github.com/bilawalsidhu/gods-eye-view/blob/main/vite.config.js)' },
  { axis: 'Voice', decision: 'Twenty-eight tools are declared server-side in GEV_REALTIME_TOOLS and executed client-side in gevActions.js. OPENAI_API_KEY never touches the browser.', adr: '[docs/CURRENT-STATE.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/docs/CURRENT-STATE.md)' },
  { axis: 'Honesty', decision: 'Flights interpolate one poll interval behind real time. Keyless traffic is SIMULATED. Launch ascent without telemetry is a RECONSTRUCTED ESTIMATE. Each layer keeps source and freshness visible.', adr: '[docs/CURRENT-STATE.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/docs/CURRENT-STATE.md)' },
  { axis: 'Scope', decision: 'The product models events, assets, infrastructure, and systems. Named-person search, face recognition, and tracking individuals are out of scope.', adr: '[README.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/README.md)' },
  { axis: 'Bind', decision: 'Dev server binds localhost by default. LAN is an explicit HOST=0.0.0.0 opt-in and brokers every configured key to anyone who can reach the process.', adr: '[SECURITY.md](https://github.com/bilawalsidhu/gods-eye-view/blob/main/SECURITY.md)' },
  { axis: 'License', decision: 'MIT covers source only. Bundled datasets and live feeds keep their own terms (notably TeleGeography CC BY-NC-SA).', adr: '[LICENSE](https://github.com/bilawalsidhu/gods-eye-view/blob/main/LICENSE)' },
];

export const GROUPS = [
  { id: 'globe', title: 'The globe' },
  { id: 'hud', title: 'The console' },
  { id: 'data', title: 'Live signals' },
  { id: 'voice', title: 'Talk to it' },
  { id: 'keys', title: 'Keys and proxy' },
  { id: 'off', title: 'Designed for, not on' },
];

export const NODES = [
  { id: 'HUD', code: 'HUD', name: 'Operator HUD', short: 'HUD', group: 'hud', gx: 1, gy: 8, w: 2, d: 2, h: 44, kind: 'screen',
    one: 'The glass cockpit around the globe — panels, keys, share links.',
    what: 'Left rail is Data Layers and Scenes. Right rail is DISPLAY, CCTV, and CONTEXT. Bottom is visual presets, the mic, and status chips. Share links serialize camera, style, layers, and one tracked target into the URL hash.',
    how: '<code>src/ui.js</code> <mark>StyleManager</mark> plus <code>src/hud.js</code>. Keyboard <code>1</code>–<code>7</code> styles, <code>H</code> HUD, <code>D</code> detection, <code>C</code> cockpit. First-run missions live in <code>src/firstRunExperience.js</code>. Share codec is <code>src/sharelink.js</code> / <code>src/data/layerState.js</code>.',
    steps: [
      ['Boot', 'StyleManager attaches to the Cesium viewer and the map-stack controller.'],
      ['Chrome', 'Build left accordion, right DISPLAY/CCTV/CONTEXT rail, and the HUD overlay.'],
      ['Restore', 'If a share hash or gev:layer-state:v2 snapshot exists, restore it; else first-run defaults.'],
      ['Facade', 'setHud / setDetection / setMapStack / setVisualStyle return {ok, ...state} so voice only confirms what happened.'],
    ],
    cond: [
      { q: 'Where does the operator chrome live?', r: 'StyleManager in src/ui.js, with the intelligence readout in src/hud.js (2026-08-25).' },
      'HUD layout and panel collapse state in this browser (v6 collapse keys, v8 positions).',
    ] },

  { id: 'CK', code: 'CK', name: 'Cockpit', short: 'COCKPIT', group: 'hud', gx: 1, gy: 4, w: 2, d: 2, h: 40, kind: 'screen',
    one: 'Ride inside a tracked flight. The terrain holds underneath you.',
    what: 'First-person camera from the delayed, interpolated track. Visor HUD, contacts window, briefing carousel. Not WebXR. Entry is gated: Contacts mode on, both flight layers on, a civilian or military aircraft tracked.',
    how: 'Cockpit modules under <code>src/cockpit*.js</code> plus camera handoff in the flight layers. Vision cycle is inherited map preset, CRT, NVG, FLIR, NOIR. Opt-in WX clouds are a capped WebGL pass (<code>src/cockpitCloudEffects.js</code>), default off.',
    steps: [
      ['Gate', 'Contacts active, flights + military enabled, an aircraft tracked.'],
      ['Enter', 'Release Cesium orbit-follow; drive a first-person camera from the displayed track.'],
      ['Ride', 'Instruments at 10 Hz, camera at 20 Hz; detection stays owned by Contacts.'],
      ['Exit', 'C, Escape, or EXIT COCKPIT restores the follow camera on the same contact.'],
    ],
    cond: [
      { q: 'Is Cockpit a WebXR session?', r: 'No. Desktop first-person presentation, not WebXR (2026-08-25).' },
    ] },

  { id: 'DT', code: 'DT', name: 'Detection', short: 'DETECT', group: 'hud', gx: 1, gy: 0, w: 2, d: 2, h: 40, kind: 'screen',
    one: 'Screen-space boxes and IDs on everything in view.',
    what: 'Samples enabled layers through getDetectableObjects and paints brackets from the shared world-overlay post-render callback so boxes match the final camera frame. First-run default is Dense at 75%. CRT/NVG/FLIR auto-apply that preset until you override.',
    how: '<code>src/data/detection.js</code> + <code>detectionDraw.js</code> + <code>labelArbiter.js</code>. Takes <mark>no continuous-render hold</mark> — it asks for one more frame while fade/solve work is outstanding (<code>detectionRenderDemand.js</code>).',
    steps: [
      ['Sample', 'Each enabled layer that implements getDetectableObjects reports objects in view.'],
      ['Solve', 'Label arbiter allocates quotas (ELASTIC default, or WEIGHTED).'],
      ['Paint', 'One post-render callback draws brackets and labels.'],
      ['Idle', 'No hold: a parked scene with detection on costs zero extra frames.'],
    ],
    cond: [
      { q: 'Does detection pin the render loop at 60 fps?', r: 'No. It takes no continuous-render hold; measured 0 renders / 5 s with detection on a parked empty scene (2026-08-22).' },
    ] },

  { id: 'GL', code: 'GL', name: 'Cesium globe', short: 'GLOBE', group: 'globe', gx: 6, gy: 5, w: 2.6, d: 2.4, h: 50, kind: 'box',
    one: 'The Cesium viewer. One tab, no framework, 60 fps cap.',
    what: 'CesiumJS Viewer with all default chrome stripped. The engine globe is hidden so Google tiles can be the planet. A render governor idles the scene unless something is animating. Hidden tabs stop the loop.',
    how: '<code>src/main.js</code> <mark>new Cesium.Viewer</mark>. <code>src/renderGovernor.js</code> flips requestRenderMode. <code>src/scopeMask.js</code> is the circular keyhole (DISPLAY SCOPE + FEATHER). Attribution stays visible — Google ToS.',
    steps: [
      ['Create', 'Viewer in #cesiumContainer; targetFrameRate 60.'],
      ['Hide globe', 'scene.globe.show = false so 2D imagery does not clip 3D buildings.'],
      ['Wire', 'Map stack, StyleManager, DataLayerManager, scenes, annotations, voice.'],
      ['Idle', 'Install the render governor after every module has registered holds.'],
    ],
    cond: [
      { q: 'Is there a React/Vue/Svelte app around this?', r: 'No. Vanilla JS + CesiumJS + Vite (2026-08-25).' },
    ] },

  { id: 'TL', code: 'TL', name: 'Photoreal tiles', short: '3D TILES', group: 'globe', gx: 11, gy: 1.4, w: 3, d: 3, h: 64, kind: 'tall',
    one: 'Google Photorealistic 3D Tiles — the actual planet.',
    what: 'This is the required key. Map Tiles API draws street-to-orbit photogrammetry. If tiles fail to load, the app continues on the Cesium globe / OSM rather than dying. Cesium World Terrain is intentionally off — it fights the Google mesh.',
    how: '<code>Cesium.createGooglePhotorealistic3DTileset</code> in <code>src/main.js</code>. Key via <code>import.meta.env.GOOGLE_MAPS_API_KEY</code> (Vite <code>define</code>). Also copied to <code>window.__GOOGLE_MAPS_API_KEY__</code> for geocoding.',
    steps: [
      ['Key', 'GOOGLE_MAPS_API_KEY must be set or init throws.'],
      ['Load', 'createGooglePhotorealistic3DTileset; add to scene.primitives.'],
      ['Fallback', 'On failure, show the Cesium globe and start the map stack on OSM.'],
    ],
    cond: [
      { q: 'Does the app run without a Google Maps key?', r: 'No. src/main.js throws if GOOGLE_MAPS_API_KEY is missing (2026-08-25).' },
      'Production Map Tiles billing, quotas, and referrer restrictions for a given deploy.',
    ] },

  { id: 'ST', code: 'ST', name: 'Sensor looks', short: 'STYLES', group: 'globe', gx: 16, gy: 2.6, w: 2.6, d: 2.4, h: 48, kind: 'box',
    one: 'GLSL post-process looks: CRT, NVG, FLIR, anime, noir, snow.',
    what: 'The whole live planet re-renders through a different sensor. Keys 1–7. Military looks (CRT/NVG/FLIR) auto-enable Dense detection until you override. FLIR can switch to an Ironbow palette.',
    how: '<code>src/styles/</code> fragment shaders imported by <code>src/ui.js</code> STYLES: retro, surveillance (NVG), thermal (FLIR), anime, noir, snow. Cesium post-process stages; intensity crossfades in StyleManager.',
    steps: [
      ['Pick', 'Key 1–7 or set_visual_style / the presets tray.'],
      ['Stage', 'Activate the matching Cesium post-process; uniforms from STYLE_PRESET_DEFAULTS.'],
      ['Detect', 'CRT/NVG/FLIR apply MILITARY_DETECTION_PRESET unless _detectionUserOverridden.'],
    ],
    cond: [] },

  { id: 'MS', code: 'MS', name: 'Map stacks', short: 'MAP SOURCE', group: 'globe', gx: 18, gy: -0.4, w: 2.2, d: 2.2, h: 40, kind: 'box',
    one: 'The basemap under the layers: Google 3D, Bing, or OSM.',
    what: 'Four tiles in Visual Presets. Photoreal is default. Bing Aerial / Labels need a public Cesium ion token. OSM is keyless. Bing Road is retired — old map=bing-road links fall back to photoreal.',
    how: '<code>src/mapStackController.js</code> + <code>src/mapStackChips.js</code>. Share-link, voice set_map_stack, and the chip row all call the same _setMapStack(). Ion chips stay visible but aria-disabled without a token.',
    steps: [
      ['Default', 'photoreal if Google tiles loaded; else osm.'],
      ['Switch', 'Chip / voice / share hash → setStack.'],
      ['Fail', 'Rejected ion switch leaves the genuinely active source lit.'],
    ],
    cond: [
      { q: 'Is Bing Road still a stack?', r: 'No. Retired from MAP_STACKS and from the set_map_stack enum; road phrasings resolve to OSM (2026-08-25).' },
      'Whether this install has CESIUM_ION_TOKEN (Bing stacks).',
    ] },

  { id: 'LM', code: 'LM', name: 'Layer manager', short: 'MANAGER', group: 'data', gx: 9.4, gy: 6.6, w: 2, d: 2, h: 42, kind: 'gate',
    one: 'The gate that turns a layer on and off without double-polling.',
    what: 'Registers every production layer, seals the 16-id registry, and serializes visibility so two rapid toggles cannot arm two OpenSky intervals. Feed chips read getStats through one honest state machine: ON / LOADING / DEGRADED / STALE / FALLBACK / UNAVAILABLE.',
    how: '<code>src/data/manager.js</code> DataLayerManager. Enable path: <mark>init → enable → first update → interval</mark>. destroy() on teardown. Share restoration waits until finalizeRegistrations(LAYER_STATE_REGISTRY).',
    steps: [
      ['Register', 'main.js registers 16 modules then finalizeRegistrations.'],
      ['Intent', 'User / voice / tool setEnabled with a monotonic epoch; newer aborts older.'],
      ['Lifecycle', 'init (once), enable, update, arm interval; disable clears the timer.'],
      ['Stats', 'layerFeedState(getStats()) drives the row chip.'],
    ],
    cond: [
      { q: 'How many production layers are sealed?', r: '16 ids in LAYER_STATE_REGISTRY, including military-awareness which is not a user-visible Data Layers row (2026-08-25).' },
    ] },

  { id: 'LY', code: 'LY', name: 'Live layers', short: 'LAYERS', group: 'data', gx: 5, gy: 10.4, w: 3, d: 3, h: 24, kind: 'store',
    one: 'The public signals: flights, ships, sats, quakes, traffic, fires, radio, more.',
    what: 'Fifteen user-visible overlays besides CCTV, each a src/data module with its own source and cadence. Flights interpolates one poll behind real time. AIS is a server websocket the browser polls. FIRMS and TomTom are key-gated; without a key the row says so (KEY REQUIRED / SIMULATED). Bundled datacenters, dams, and cables are static extracts.',
    how: 'flights (OpenSky 30s + adsb.lol fallback), military (adsb.lol 15s), ais-live-vessels (AISStream via /api/ais-live), satellites (CelesTrak), rocket-launches (Launch Library 2), earthquakes (USGS 60s, no proxy), traffic (Overpass ± TomTom), radio, bikeshare, installations, local-datacenters, local-dams, telegeography-submarine-cables, local-firms (NASA FIRMS live). Contacts mode owns the awareness coordinator.',
    steps: [
      ['Enable', 'Manager init/enable/update; first fetch through the matching /api/* proxy or USGS.'],
      ['Reconcile', 'Keyed records (ICAO, MMSI, NORAD) survive refreshes; stale contacts fade then evict.'],
      ['Draw', 'Billboards / models / ellipses / heat on the Cesium scene; detection samples getDetectableObjects.'],
      ['Context', 'CONTACTS or SPACE MISSIONS can own a subset and restore the prior snapshot on exit.'],
    ],
    cond: [
      { q: 'Are FIRMS fires still a bundled snapshot?', r: 'No. local-firms is live NASA FIRMS via /api/firms; the id keeps a local- prefix for persistence (2026-08-25).' },
      'Which optional keys this install has (AISStream, FIRMS, TomTom, OpenSky OAuth) and which layers the operator has enabled.',
    ] },

  { id: 'CV', code: 'CV', name: 'CCTV', short: 'CCTV', group: 'data', gx: 9.2, gy: 11.2, w: 2.6, d: 2.6, h: 22, kind: 'box',
    one: 'Public cameras projected into the 3D city — not webcam embeds.',
    what: 'Austin, Caltrans (CA), and TfL London stills, with Street View as a fallback frame. VIEWSHED draws each camera\'s estimated coverage volume. The proxy will not fetch a URL the client invented.',
    how: '<code>src/data/cctv.js</code> + viewshed/gizmo/LOD helpers. Frames via <mark>/api/cctv</mark> (server allowlist, 8s abort). Source packs in <code>config/cctv_sources.*.json</code>. Calibration persists at godsEyeView.cctv.calibration.v2.',
    steps: [
      ['Enable', 'Manager lifecycle; registry from the server-side source pack.'],
      ['Fetch', 'Same-origin /api/cctv stills on an 8s timeout.'],
      ['Project', 'Drape the frame onto the photoreal mesh at the camera pose.'],
      ['Viewshed', 'Optional coverage volume; click-to-track can hand off from a fire or vessel.'],
    ],
    cond: [
      { q: 'Can the browser point the CCTV proxy at an arbitrary URL?', r: 'No. Client-specified upstream URLs are rejected; only the server allowlist is fetched (2026-08-25).' },
      'Which CCTV_SOURCES_FILE / city pack this deploy uses (Austin is the reference; Shinjuku exists in tree).',
    ] },

  { id: 'VC', code: 'VC', name: 'Voice', short: 'GEV MIC', group: 'voice', gx: 14, gy: 8.2, w: 2.6, d: 2, h: 28, kind: 'box',
    one: 'Twenty-eight tools. It knows what it is looking at.',
    what: 'OpenAI Realtime over WebRTC. The agent pulls live scene context before answering. Without an OpenAI key the mic reports unavailable and the globe still runs. In-app session cap $5; in-flight tools complete rather than roll back.',
    how: 'Schemas in <code>vite.config.js</code> <mark>GEV_REALTIME_TOOLS</mark>. Execution in <code>src/voice/gevActions.js</code>. Session in <code>src/voice/gevRealtime.js</code>. Token: GET /api/realtime/token → ephemeral client secret. Cost in <code>src/voice/voiceCost.js</code>.',
    steps: [
      ['Mint', 'Browser asks /api/realtime/token; middleware holds OPENAI_API_KEY.'],
      ['Connect', 'WebRTC SDP to api.openai.com with the ephemeral token.'],
      ['Tool', 'Model emits a function call; gevActions runs it on StyleManager / layers / camera.'],
      ['Confirm', 'Spoken confirmation only on ok:true. Cap trips stop(); in-flight mutations finish.'],
    ],
    cond: [
      { q: 'Does the browser see OPENAI_API_KEY?', r: 'No. Vite middleware mints ephemeral Realtime client secrets at /api/realtime/token (2026-08-25).' },
      { q: 'How many voice tools?', r: '28, listed in CURRENT-STATE and GEV_REALTIME_TOOLS (2026-08-25).' },
      'Whether this install has OPENAI_API_KEY, and which realtime model id OpenAI currently serves.',
    ] },

  { id: 'AN', code: 'AN', name: 'Annotations', short: 'WHITEBOARD', group: 'voice', gx: 14.2, gy: 12.2, w: 2.2, d: 2.2, h: 36, kind: 'box',
    one: 'Speak a mark, a polygon, or a walking route onto the world.',
    what: 'Voice whiteboard. Marks accumulate until you clear them. Cap 120 live marks. Routes can be flown with fly_route. Known gap: mall/lifestyle districts can prefer a named building over the broader envelope.',
    how: '<code>src/annotations/annotationEngine.js</code> + resolver + hybrid renderer (world-space areas/routes, screen-space pins). Tools: annotate_map, clear_annotations. Routes via /api/route (OSRM proxy).',
    steps: [
      ['Resolve', 'Name / coords / pixels → world anchor (Geocode, Places, Overpass, OSRM).'],
      ['Draw', 'Draped geometry in Cesium; reticles and callouts in SVG.'],
      ['Cap', 'Hard cap 120; clear is explicit only.'],
    ],
    cond: [
      'Mall/lifestyle district scoring still prefers some named buildings over the retail envelope (CURRENT-STATE known resolver gap).',
    ] },

  { id: 'PX', code: 'PX', name: 'Vite proxy', short: 'PROXY', group: 'keys', gx: 17.6, gy: 7.6, w: 3, d: 2, h: 22, kind: 'store',
    one: 'Where the secrets live. The browser never holds the private keys.',
    what: 'vite.config.js is both the bundler and the API. Same-origin /api/* routes cache, rate-limit, and sanitize upstream calls. AISStream websocket, OpenSky OAuth, FIRMS, TomTom, CCTV allowlist, Realtime token mint — all here. Default bind is localhost.',
    how: '<code>vite.config.js</code> plugins: openSky, celestrak, tomtom, firms, launches, terrain, adsbdb, overpass, installations, regionalBrief, weather, cctv, radio, gbfs, adsbLol, aisLive, tracks, openAiRealtime, googlePlaces. <code>define</code> injects only GOOGLE_MAPS_API_KEY and CESIUM_ION_TOKEN.',
    steps: [
      ['Env', '.env / Keychain / shell. Empty string is not unset — the launcher env -u\'s it.'],
      ['Broker', 'Browser calls /api/*; middleware adds auth and cache.'],
      ['Mint', '/api/realtime/token returns an ephemeral client secret, not OPENAI_API_KEY.'],
      ['Bind', 'localhost unless HOST=0.0.0.0 (LAN warning: keys are reachable).'],
    ],
    cond: [
      { q: 'Which keys reach the browser bundle?', r: 'GOOGLE_MAPS_API_KEY and CESIUM_ION_TOKEN via Vite define; OpenAI/AIS/FIRMS/TomTom stay server-side; voice uses ephemeral tokens (2026-08-25).' },
      'How maptheworld.ai is hosted — this repo has no production deploy workflow, Dockerfile, or replica topology.',
      'Concurrent replicas behind one origin (Radio catalogInstance assumes a single-process dev server; out of scope in CURRENT-STATE).',
    ] },

  { id: 'SC', code: 'SC', name: 'Scene director', short: 'SCENES', group: 'hud', gx: 11.2, gy: 13.4, w: 2.2, d: 2.2, h: 32, kind: 'box',
    one: 'Cinematic camera tours for clips and demos.',
    what: 'Deterministic scene playback. While a scene runs, Clear Selected Layers and Reset Globe stay hidden because the transport owns camera and layers. Voice control_scene lists, plays, and stops.',
    how: '<code>src/scenes/director.js</code> + <code>src/scenes/recipes.js</code> + <code>scenePolicy.js</code>. Constructed in main.js as SceneDirector(viewer, styleManager, dataManager).',
    steps: [
      ['Pick', 'A recipe from the Scenes panel or control_scene.'],
      ['Play', 'Director sequences camera and declared layers; undeclared layers are left alone.'],
      ['Stop', 'Transport releases; Clear / Reset Globe return.'],
    ],
    cond: [] },

  { id: 'WX', code: 'WX', name: 'Later', short: 'LATER', group: 'off', ghost: true, gx: 5, gy: -1.2, w: 2, d: 2, h: 36, kind: 'gate',
    one: 'Designed-for, not on: weather radar, general replay, LiDAR.',
    what: 'Weather radar was removed before OSS v1. There is no general timeline outside Space Missions ascent/orbit replay. LiDAR explorer and paired-point CCTV calibration are experiments, not runtime. Historical "what happened" tiling is called out as future work on halfpixel.ai — not this repo.',
    how: '<mark>Ghost</mark>. CURRENT-STATE § Not Currently in Runtime. Cockpit WX clouds are a separate opt-in pass and are not this node.',
    steps: [
      ['Radar', 'Removed; no reliable visible payoff.'],
      ['Replay', 'Only Space Missions ascent/orbit exists; no general scrubber.'],
      ['LiDAR', 'Calibration experiments, not shipped.'],
    ],
    cond: [
      'Whether historical replay (halfpixel.ai) will land in this repo or a separate product.',
    ] },
];

export const FLOWS = [
  { id: 'boot', name: 'Cold start', hops: [
    ['HUD', 'GL', 'init()', { container: 'cesiumContainer', targetFrameRate: 60 }, 'yx'],
    ['GL', 'TL', 'createGooglePhotorealistic3DTileset', { api: 'Map Tiles', globeShow: false }, 'xy'],
    ['TL', 'GL', 'primitives.add', { tileset: 'photoreal' }, 'xy'],
    ['GL', 'LM', 'new DataLayerManager', { seal: 16 }, 'xy'],
    ['GL', 'HUD', 'StyleManager', { style: 'normal', hud: 'tactical' }, 'xy'],
  ] },
  { id: 'flights', name: 'Enable flights', hops: [
    ['HUD', 'LM', 'setEnabled', { layerId: 'flights', origin: 'user', enabled: true }, 'yx'],
    ['LM', 'LY', 'init → enable → update', { layerId: 'flights' }, 'xy'],
    ['LY', 'PX', 'GET /api/opensky', { mode: 'oauth|anon', intervalS: 30 }, 'xy'],
    ['PX', 'LY', 'state vectors', { source: 'OpenSky', delayed: true }, 'yx'],
    ['LY', 'GL', 'billboards + models', { interpolate: 'one poll behind' }, 'xy'],
    ['LY', 'DT', 'getDetectableObjects', { type: 'AIR' }, 'xy'],
  ] },
  { id: 'voice', name: 'Voice turn', hops: [
    ['HUD', 'PX', 'GET /api/realtime/token', { tier: 'standard' }, 'yx'],
    ['PX', 'VC', 'ephemeral client_secret', { model: 'gpt-realtime-2' }, 'xy'],
    ['VC', 'HUD', 'get_current_view_state', { style: 'thermal', layers: ['flights'] }, 'yx'],
    ['VC', 'LM', 'set_layer_visibility', { layerId: 'flights', enabled: true }, 'xy'],
    ['VC', 'GL', 'fly_to_location', { query: 'LAX', waitForArrival: true }, 'xy'],
    ['VC', 'HUD', 'spoken confirm', { ok: true, text: 'Flights on. At LAX.' }, 'xy'],
  ] },
  { id: 'cctv', name: 'Project a camera', hops: [
    ['HUD', 'LM', 'setEnabled', { layerId: 'cctv', origin: 'user', enabled: true }, 'yx'],
    ['LM', 'CV', 'init → enable → update', { pack: 'austin' }, 'xy'],
    ['CV', 'PX', 'GET /api/cctv', { allowlist: true, timeoutMs: 8000 }, 'xy'],
    ['PX', 'CV', 'still frame', { source: 'Austin Open Data' }, 'yx'],
    ['CV', 'GL', 'project into mesh', { viewshed: 'optional' }, 'xy'],
  ] },
  { id: 'cockpit', name: 'Ride a contact', hops: [
    ['LY', 'CK', 'track + COCKPIT', { icao24: 'a1b2c3', gate: 'contacts' }, 'yx'],
    ['CK', 'GL', 'first-person camera', { from: 'interpolated track', hz: 20 }, 'xy'],
    ['CK', 'ST', 'vision cycle', { cycle: ['inherited', 'CRT', 'NVG', 'FLIR', 'NOIR'] }, 'xy'],
    ['CK', 'HUD', 'EXIT COCKPIT', { restore: 'follow camera' }, 'xy'],
  ] },
];

export const CH = [
  { id: 'you', title: 'You open the globe', reveal: ['HUD', 'GL', 'TL'],
    lede: `A page, a Cesium viewer, and Google 3D tiles.`,
    story: `<p>Strip everything away and this is GEV: a browser tab and a planet. <code>src/main.js</code> builds a chrome-less Cesium viewer, hides the default globe, and loads <mark>Google Photorealistic 3D Tiles</mark>. The Maps key is required. The operator HUD is StyleManager in <code>src/ui.js</code>.</p>`,
    flow: [
      ['HUD', 'GL', 'init()', { container: 'cesiumContainer', targetFrameRate: 60 }],
      ['GL', 'TL', 'createGooglePhotorealistic3DTileset', { api: 'Map Tiles' }],
      ['TL', 'GL', 'primitives.add', { tileset: 'photoreal' }],
    ] },
  { id: 'looks', title: 'Reskin reality', reveal: ['ST', 'MS', 'SC'],
    lede: `GLSL sensor looks over a chosen basemap.`,
    story: `<p>Keys <code>1</code>–<code>7</code> restyle the live planet: CRT, NVG, FLIR, anime, noir, snow. The Visual Presets tray also picks the <mark>map source</mark> — Google 3D, Bing (ion token), or OSM. Bing Road is retired. The scene director is a cinematic tour for clips; while one runs, Reset Globe stays hidden.</p>`,
    flow: [
      ['HUD', 'ST', 'set_visual_style', { style: 'thermal' }],
      ['HUD', 'MS', 'set_map_stack', { stack: 'photoreal' }],
    ] },
  { id: 'sky', title: 'Light up the sky', reveal: ['LM', 'LY'],
    lede: `The manager turns a public feed into moving marks.`,
    story: `<p>Sixteen production layers are sealed at boot. Enable is <mark>init → enable → first update</mark>, then a poll interval. Flights interpolate one interval behind real time on purpose. AIS is a server websocket the browser polls. Keyless traffic is labeled SIMULATED.</p>`,
    flow: [
      ['HUD', 'LM', 'setEnabled', { layerId: 'flights', origin: 'user', enabled: true }],
      ['LM', 'LY', 'init → enable → update', { layerId: 'flights' }],
      ['LY', 'PX', 'GET /api/opensky', { intervalS: 30 }],
      ['LY', 'GL', 'billboards', { interpolate: 'one poll behind' }],
    ] },
  { id: 'cam', title: 'Look through a camera', reveal: ['CV'],
    lede: `Public stills project into the 3D city.`,
    story: `<p>CCTV is not a webcam embed. Austin, Caltrans, and TfL frames drape onto the photoreal mesh. The proxy <mark>refuses client-supplied URLs</mark> — only the server allowlist is fetched. VIEWSHED draws where each camera reaches, and where it goes blind.</p>`,
    flow: [
      ['HUD', 'LM', 'setEnabled', { layerId: 'cctv', enabled: true }],
      ['LM', 'CV', 'init → enable → update', { pack: 'austin' }],
      ['CV', 'PX', 'GET /api/cctv', { allowlist: true }],
      ['CV', 'GL', 'project into mesh', { viewshed: true }],
    ] },
  { id: 'detect', title: 'Detection', reveal: ['DT'],
    lede: `Boxes on everything in view, without pinning the GPU.`,
    story: `<p>Detection samples <code>getDetectableObjects</code> and paints from the shared post-render callback. First-run default is Dense at 75%. It takes <mark>no continuous-render hold</mark> — a parked empty scene with detection on costs zero extra frames.</p>`,
    flow: [
      ['LY', 'DT', 'getDetectableObjects', { type: 'AIR' }],
      ['DT', 'GL', 'postRender brackets', { hold: false }],
    ] },
  { id: 'pit', title: 'Ride a plane', reveal: ['CK'],
    lede: `Contacts-gated first-person. Not WebXR.`,
    story: `<p>Cockpit is gated: CONTEXT ▸ CONTACTS, both flight layers on, an aircraft tracked. The camera rides the delayed track with the terrain held underneath. Vision cycles CRT / NVG / FLIR without leaving the seat. <mark>Detection stays owned by Contacts</mark>, not by Cockpit.</p>`,
    flow: [
      ['LY', 'CK', 'COCKPIT', { icao24: 'a1b2c3', gate: 'contacts' }],
      ['CK', 'GL', 'first-person camera', { hz: 20 }],
      ['CK', 'ST', 'vision cycle', { style: 'NVG' }],
    ] },
  { id: 'talk', title: 'Talk to it', reveal: ['VC', 'AN'],
    lede: `Twenty-eight tools. The key never enters the tab.`,
    story: `<p>GEV MIC mints an ephemeral Realtime token from <code>/api/realtime/token</code>. Tools are declared in <code>vite.config.js</code> and executed in <code>gevActions.js</code>. The agent confirms only <mark>ok:true</mark>. Speak a polygon onto the world — annotations cap at 120. Without an OpenAI key the globe still runs.</p>`,
    flow: [
      ['HUD', 'PX', 'GET /api/realtime/token', { tier: 'standard' }],
      ['PX', 'VC', 'ephemeral client_secret', { model: 'gpt-realtime-2' }],
      ['VC', 'GL', 'fly_to_location', { query: 'LAX' }],
      ['VC', 'AN', 'annotate_map', { type: 'area' }],
    ] },
  { id: 'keys', title: 'Keys stay on the server', reveal: ['PX'],
    lede: `The Vite proxy is the API. Localhost by default.`,
    story: `<p>Private keys never ship in the bundle. The browser sees the Maps key, an optional Cesium ion token, and short-lived OpenAI secrets. Everything else — AISStream, FIRMS, TomTom, OpenSky OAuth — is brokered at <code>/api/*</code>. Binding to <mark>0.0.0.0 brokers those keys to the LAN</mark>.</p>`,
    flow: [
      ['LY', 'PX', 'GET /api/opensky', { intervalS: 30 }],
      ['CV', 'PX', 'GET /api/cctv', { allowlist: true }],
      ['HUD', 'PX', 'GET /api/realtime/token', {}],
    ] },
  { id: 'later', title: 'Later', reveal: ['WX'],
    lede: `Weather radar, general replay, and LiDAR are designed-for, not on.`,
    story: `<p>Weather radar was removed before OSS v1. There is no general timeline outside Space Missions ascent/orbit. LiDAR explorer and paired-point CCTV calibration are experiments. Historical replay of what happened is <mark>not this repo</mark>.</p>`,
    flow: [
      ['WX', 'GL', 'not in runtime', { weatherRadar: false, generalReplay: false, lidar: false }],
    ] },
  { id: 'all', title: 'The whole system', reveal: [],
    lede: `Everything at once, for free exploration.`,
    story: `<p>Choose which flow runs (bottom left). Hover anything; click to pin; → goes inside. The <mark>Open questions</mark> tab lists every operator fact this repo cannot answer — including how maptheworld.ai is hosted.</p>`,
    flow: null },
];

export const HOW_HTML = `<div class="eyebrow">GEV · public main</div><h1 class="t">How it's built</h1><div class="sub">the shape and what sits around it</div>
<h3 class="sec">Filesystem</h3>
<pre>src/
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
docs/CURRENT-STATE.md   runtime source of truth</pre>
<p>No framework. Vanilla JS + CesiumJS + Vite. <code>docs/CURRENT-STATE.md</code> wins when docs conflict.</p>
<h3 class="sec">Secrets</h3>
<p>The browser bundle sees <mark>GOOGLE_MAPS_API_KEY</mark> and optional <mark>CESIUM_ION_TOKEN</mark>. <code>OPENAI_API_KEY</code>, AISStream, FIRMS, TomTom, and OpenSky OAuth stay in the Vite middleware. Voice gets an ephemeral client secret from <code>/api/realtime/token</code>.</p>
<h3 class="sec">Two kinds of layer</h3>
<p>Most overlays are poll-or-static modules behind <code>DataLayerManager</code>. <mark>CCTV is different</mark>: public stills are projected into the photoreal mesh, and the proxy refuses client-supplied URLs. <code>military-awareness</code> is registered but is not a Data Layers row — Contacts mode is its entry.</p>`;
