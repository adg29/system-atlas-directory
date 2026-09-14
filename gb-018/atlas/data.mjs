// Single source of truth for the gb-018 atlas. Built by: node gb-018/atlas/build.mjs
// Primer: /workspace/gb-018-atlas/primer.md (public main of https://github.com/b-nnett/grok-bot-0.18-reconstructed)

const R = 'https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main';

export const META = {
  title: 'Grok Bot 0.18',
  artifactUrl: 'https://adg29.github.io/system-atlas-directory/gb-018/',
  sourcePath: 'gb-018/atlas/data.mjs',
  buildCmd: 'node gb-018/atlas/build.mjs',
  stats: [
    { k: 'System', v: 'gb-018 · reconstructed 0.18.0' },
    { k: 'Study copy', v: 'unofficial' },
    { k: 'License', v: 'none asserted' },
  ],
  intro: `_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._ This atlas is an unofficial reconstructed study copy of the publicly shipped Grok Bot 0.18.0 desktop app. It is not Anysphere's monorepo; names and module boundaries are inferred from a compiled application. Good homework: prompts, tool schemas, coordinator, MCP bridge. Bad homework: forking this tree as "open-source Grok Bot". Cite [NOTICE.md](${R}/NOTICE.md) and [PROVENANCE.md](${R}/PROVENANCE.md).`,
  onePara: `Grok Bot 0.18 is a desktop harness around a model, not a model list. Electron owns the window, a narrow preload, and the box connector. The coordinator owns transcripts, streaming, tool dispatch, and the two execution environments. The host inside the remote box runs the turn: Cursor inference, a forced SendMessage voice, Auto-review gates, and MCP. This map reads b-nnett's unofficial reconstruction of the shipped 0.18.0 app — a study copy, not Anysphere source.`,
  costModel: [
    '- No Cursor pricing is invented here. The product bills elsewhere; this atlas does not guess seats, tokens, or Grok Bot plans.',
    '- **Release-hygiene lesson.** 0.18.0 shipped a minified renderer, but prompts, tool schemas, IPC contracts, and path-bearing strings were still recoverable. Source maps, unminified bundles, and emitted source-path markers are a harness leak.',
    '- Reconstructed packages default the official updater, Sentry, and upstream telemetry off at the packaging boundary. That is a study-copy choice, not a product claim.',
    '',
  ],
  deepDive: `Study copy: [b-nnett/grok-bot-0.18-reconstructed](https://github.com/b-nnett/grok-bot-0.18-reconstructed). Provenance: [PROVENANCE.md](${R}/PROVENANCE.md), [NOTICE.md](${R}/NOTICE.md). Architecture: [docs/ARCHITECTURE.md](${R}/docs/ARCHITECTURE.md).`,
  platformGives: 'Electron 42.1 desktop shell, Cursor-backed inference, remote sand box, MCP connectors, Auto-review classifier',
  weOwn: 'nothing — this is a study map of a reconstructed public binary, not an operator deploy',
  filesystem: `source/
  electron-main/          desktop lifecycle, auth, box connector, coordinator launch, MCP, RPC
  electron-preload/       contextBridge: desktop + coordinatorPort
  node-agent-coordinator/ renderer port, gateway client, local-exec supervisor, sendPrompt
  host/                   sand-host, gateway, runner, extensions, MCP, Auto-review
    runner/tools/         SendMessage, turn-toolset, computer / browser / MCP
    extensions/inference/ Cursor session (product). provider-session is EXTRA
  box-exec-daemon/        in-box shell/file daemon
  local-exec-daemon/      daemon on the user's computer
  packages/               agent, chat-inference, prompt-jsx, mcp-*, shell-exec, local-exec, proto
  shared/                 contracts, settings, gateway wire, Auto-review helpers
frontend/                 EXTRA — partial authored renderer, not the shipped UI`,
};

export const DECISIONS = [
  { axis: 'Provenance', decision: 'Unofficial reconstructed study copy of publicly shipped 0.18.0. Not Anysphere\'s monorepo; names/boundaries inferred. No upstream license is asserted. Do not claim MIT or Anysphere license.', adr: `[NOTICE.md](${R}/NOTICE.md) · [PROVENANCE.md](${R}/PROVENANCE.md)` },
  { axis: 'Hybrid', decision: 'Runtimes compile from readable source/. The polished shipped renderer stays checksum-pinned. frontend/ is a partial design workspace, not the packaged UI.', adr: `[README.md](${R}/README.md) · [docs/ARCHITECTURE.md](${R}/docs/ARCHITECTURE.md)` },
  { axis: 'Harness', decision: 'The product is a harness around a model — Electron, coordinator, host, tools, two exec envs — not a catalog of models. Default Cursor model id in this tree is grok-4.5; that is a pin, not the map.', adr: `[source/host/extensions/inference/cursor-session.ts](${R}/source/host/extensions/inference/cursor-session.ts)` },
  { axis: 'Send path', decision: 'User-visible replies are forced through SendMessage. Plain assistant text is a private scratchpad. Ack ≠ delivery. ReactToMessage is the lone tapback exception.', adr: `[send-message-tool.ts](${R}/source/host/runner/tools/send-message-tool.ts) · [system-prompt.ts](${R}/source/host/runner/system-prompt.ts)` },
  { axis: 'Two computers', decision: 'Shell/Read/AwaitShell are the box (the agent\'s Linux computer). ExternalShell/ExternalRead/AwaitExternalShell are the user\'s machine and need local-tool permission. Never clone a repo onto either by default.', adr: `[agent-tool-names.ts](${R}/source/shared/agents/agent-tool-names.ts) · [turn-toolset.ts](${R}/source/host/runner/tools/turn-toolset.ts)` },
  { axis: 'Release hygiene', decision: 'Shipping maps, unminified bundles, or path-bearing strings leaks the harness. 0.18.0 minified the renderer and still leaked prompts, schemas, and IPC. Treat that as a cautionary, not a how-to.', adr: `[PROVENANCE.md](${R}/PROVENANCE.md) · [SECURITY.md](${R}/SECURITY.md)` },
];

export const GROUPS = [
  { id: 'shell', title: 'Desktop shell' },
  { id: 'plane', title: 'Control plane' },
  { id: 'think', title: 'Think and act' },
  { id: 'exec', title: 'Two computers' },
  { id: 'surf', title: 'Voice' },
  { id: 'off', title: 'Researcher additions' },
];

export const NODES = [
  { id: 'MAIN', code: 'MAIN', name: 'Electron main', short: 'MAIN', group: 'shell', gx: 1, gy: 8, w: 2.2, d: 2.2, h: 44, kind: 'screen',
    one: 'The desktop process: window, auth, settings, box connector, coordinator ownership.',
    what: 'Grok Bot 0.18 is an Electron 42.1 app (upstream bundle id com.anysphere.sand). Main owns lifecycle, Cursor login, secrets, MCP install IPC, VNC trust, and forks the coordinator. It does not think. It connects the polished renderer to a remote box gateway.',
    how: '<code>source/electron-main/main.ts</code> starts the window with contextIsolation, no nodeIntegration, preload, webviewTag. <code>coordinator/coordinator-launcher.ts</code> forks <mark>sand-node-agent-coordinator</mark> on three MessagePorts (control, renderer-data, main-data). <code>box/box-host-connector.ts</code> calls ensureSandBox for gateway URL and tokens.',
    steps: [
      ['Boot', 'Single-instance lock, user-data bootstrap, services, then the window.'],
      ['Preload', 'Load the shipped renderer HTML; preload exposes desktop + coordinatorPort.'],
      ['Connect', 'BrokeredHostConnector.ensureSandBox → gatewayUrl, tokens, VNC.'],
      ['Own', 'Launch coordinator; RPC handlers for settings, MCP, local-tool permission, Auto-review instructions.'],
    ],
    cond: [
      { q: 'Is this Anysphere\'s original main.ts?', r: 'No. Reconstructed from the shipped 0.18.0 binary; names are inferred (2026-09-13).' },
      'What were Anysphere\'s original package and folder names, versus this inferred source/ layout?',
    ] },

  { id: 'PRE', code: 'PRE', name: 'Preload bridge', short: 'PRELOAD', group: 'shell', gx: 1, gy: 4, w: 2.2, d: 2, h: 40, kind: 'box',
    one: 'The narrow trusted surface the UI is allowed to see.',
    what: 'The renderer never talks to Node. Preload exposes window.desktop (RPC to main) and window.coordinatorPort (a transferred MessagePort to the coordinator). MCP list/install/auth, theme, secrets, Auto-review instructions, and local-tool permission all cross here.',
    how: '<code>source/electron-preload/preload.ts</code> <mark>contextBridge.exposeInMainWorld</mark> for desktop and coordinatorPort. Coordinator port is delivered on sand:coordinator-port. Telemetry is send-only IPC (send-latency, send-ack, VNC, heap).',
    steps: [
      ['Expose', 'desktop + coordinatorPort in the isolated world.'],
      ['RPC', 'Main-edge methods: auth, settings, box recreate, Auto-review instructions.'],
      ['Port', 'Claim the coordinator MessagePort; renderer dispatches sendPrompt on it.'],
    ],
    cond: [] },

  { id: 'COORD', code: 'COORD', name: 'Coordinator', short: 'COORDINATOR', group: 'plane', gx: 5.6, gy: 5, w: 2.8, d: 2.4, h: 52, kind: 'box',
    one: 'Owns transcripts, streaming, tool dispatch, and the two exec environments from the desktop side.',
    what: 'A Node child the main process forks. It sits between the renderer and the in-box host: renderer-port RPC, gateway SSE (transcript, agents, MCP oauth, client-side-tool-v2), local-exec daemon supervisor, WebAuthn, MCP OAuth forwarder. sendPrompt is the turn door.',
    how: '<code>source/node-agent-coordinator/main.ts</code> <mark>composeCoordinator</mark>. Gateway client + SandHostSupervisor. sendPrompt begins a send-trace then dispatches; product path hits the host. Inference-router intercept is a Bennett extra (see XTRA).',
    steps: [
      ['Adopt', 'Carrier bootstrap from main: dataDir, ports, processConfig.'],
      ['Serve', 'Renderer port + main-data port; replay client-side-tool-v2 on serving.'],
      ['Dispatch', 'sendPrompt → host gateway (Cursor path) or EXTRA router.'],
      ['Relay', 'SSE channels become coordinator event families the UI already knows.'],
    ],
    cond: [
      { q: 'Does the coordinator run inside the remote box?', r: 'No. It is a desktop Node child. The host/gateway run in the box (2026-09-13).' },
    ] },

  { id: 'HOST', code: 'HOST', name: 'Sand host', short: 'HOST', group: 'plane', gx: 10.4, gy: 1.2, w: 3, d: 3, h: 64, kind: 'tall',
    one: 'The in-box control plane: extension graph, gateway, runner composition.',
    what: 'One process in the remote box. It starts host extensions in graph order, loads transcripts, binds SandAgentRunner, and serves a token-gated HTTP gateway. Health reports busy vs busy-only-awaiting-Auto-review. This is where a turn actually runs.',
    how: '<code>source/host/main.ts</code> takes a host lock, optionally spawns box-exec-daemon, <code>SandHost.start()</code>, then <mark>startGatewayServer</mark>. <code>sand-host.ts</code> wires transcript, MCP auth completion, forever-box, turn-execution, local-tool-permission.',
    steps: [
      ['Lock', 'Acquire sand-root lock; take over a stale host if needed.'],
      ['Graph', 'Start extensions; log order; bind runner + local-tool ask surfaces.'],
      ['Listen', 'Gateway on SAND_HOST_PORT; write discovery (port, pid, token).'],
      ['Ready', 'reportBoxReady; kickstart pending agents once inference is ready.'],
    ],
    cond: [
      'Is every host extension in this reconstruction live in 0.18.0, or do unused / later capsules remain in the graph?',
    ] },

  { id: 'INF', code: 'INF', name: 'Cursor inference', short: 'INFERENCE', group: 'think', gx: 16, gy: 1.6, w: 2.6, d: 2.4, h: 48, kind: 'box',
    one: 'The product brain: a Cursor-backed prompt session, not a model zoo.',
    what: 'Default model id in this tree is grok-4.5. A turn creates a Cursor prompt session (access token + machine id), streams tool calls, and labels follow-ups. This atlas maps the harness around that session. Claude Code / Codex / OpenRouter are researcher additions on XTRA.',
    how: '<code>source/host/extensions/inference/cursor-session.ts</code> <mark>createCursorInferencePromptSession</mark> when provider is cursor. <code>packages/chat-inference</code> + <code>packages/agent</code> own the tool loop. Host <code>SandAgentRunner</code> drives one turn to quiescence.',
    steps: [
      ['Session', 'Resolve model (default, computer-use, browser-use, experiment).'],
      ['Stream', 'Prompt executor streams text and tool calls into the runner.'],
      ['Tools', 'Turn toolset executes; results append; loop until SendMessage or wait.'],
    ],
    cond: [
      { q: 'Is grok-4.5 the only model?', r: 'No. It is SAND_DEFAULT_MODEL_ID. Settings and experiments can pin others. The map is the harness, not the list (2026-09-13).' },
    ] },

  { id: 'TOOLS', code: 'TOOLS', name: 'Turn toolset', short: 'TOOLS', group: 'think', gx: 15.4, gy: 7.4, w: 2.6, d: 2.2, h: 28, kind: 'cards',
    one: 'One per-turn surface. Packages collapse here — not one node per package.',
    what: 'SendMessage, Shell/Read vs ExternalShell/ExternalRead, Task, MCP discovery/call, CloudAgent, computer/browser, file transfer, reactions. Subagents get a fenced subset. Shared rooms can be text-only. Dynamic MCP tools are optional.',
    how: '<code>source/host/runner/tools/turn-toolset.ts</code> <mark>buildTurnTools</mark>. Factories from agent/tools/core (shell, read, await, web, task) plus host sand-* tools. Local-tool scope wraps external shell/read.',
    steps: [
      ['Build', 'Host factories + per-turn MCP descriptors + Auto-review shell options.'],
      ['Fence', 'Subagent / shared-room / box-scoped filters.'],
      ['Timeout', 'Every call wrapped; dynamic MCP invocation has its own cap.'],
    ],
    cond: [
      'Which tools are actually offered for a given 0.18.0 account (dynamic MCP, CloudAgent team disable, shared-room box tools, spotlight)?',
    ] },

  { id: 'PRM', code: 'PRM', name: 'Prompts + contracts', short: 'PROMPTS', group: 'think', gx: 11.6, gy: 11.2, w: 2.4, d: 2.2, h: 36, kind: 'box',
    one: 'The written constitution the model is required to obey.',
    what: 'System prompt, SendMessage schema, tool descriptions, multitask section, Auto-review safety copy, user-reply reminder. This is the best homework in the reconstruction: the shipped contracts, recovered as TypeScript.',
    how: '<code>source/host/runner/system-prompt.ts</code> <mark>buildSandBaseSystemPrompt</mark> plus USER_MESSAGE_REPLY_REMINDER. Schema in <code>send-message-schema.ts</code>. Agent prompts under <code>packages/agent/prompts</code>. JSX assembly via <code>packages/prompt-jsx</code>.',
    steps: [
      ['Assemble', 'Base prompt + multitask + MCP + cloud-agents enabled/disabled.'],
      ['Remind', 'Every user-visible turn appends the SendMessage tool-call reminder.'],
      ['Describe', 'Each tool\'s descriptionGenerator is part of the contract.'],
    ],
    cond: [] },

  { id: 'MCP', code: 'MCP', name: 'MCP + plugins', short: 'MCP', group: 'think', gx: 19.2, gy: 7.0, w: 2.4, d: 2.2, h: 32, kind: 'box',
    one: 'Connectors: Cursor-account plugins discovered, authed, and called live.',
    what: 'A plugin is the install bundle; a connector is the user-facing MCP server. Host talks to the Cursor dashboard backend for catalog, install, and tool exec. Box can run some MCP too. Auth completions round-trip through the coordinator and Electron.',
    how: '<code>source/host/extensions/mcp/mcp-service.ts</code> + <code>packages/mcp-core</code> / <code>mcp-agent-exec</code>. Tools: GetMcpTools, CallMcpTool, AuthenticateMcpServer. Desktop IPC in <code>electron-main/mcp</code> and preload <code>desktop.mcp</code>. Routed loopback MCP bridge is EXTRA.',
    steps: [
      ['Discover', 'Account servers + effective plugins + box MCP kick.'],
      ['Call', 'CallMcpTool with live schema; refetch if stale; Auto-review on mutations.'],
      ['Auth', 'mcp-oauth-pending → Electron loopback; host mcp-auth completion.'],
    ],
    cond: [] },

  { id: 'ARV', code: 'ARV', name: 'Auto-review + asks', short: 'AUTO-REVIEW', group: 'think', gx: 9.2, gy: 6.6, w: 2.2, d: 2.2, h: 44, kind: 'gate',
    one: 'The safety check before shell, MCP, computer, cloud-agent, and local tools.',
    what: 'Auto-review classifies actions off / shadow / enforce per surface (host shell, box shell, MCP, computer, automation write, cloud agent, subagent launch). A pending card blocks new side effects. Local-tool permission is a separate always/ask/never gate for the user\'s machine.',
    how: '<code>source/host/runner/auto-review-gate.ts</code> + <code>extensions/auto-review/auto-review-service.ts</code>. Escalation: retry the same action with <mark>request_smart_mode_approval</mark> (Shell) or requestSmartModeApproval (MCP). Local asks: <code>local-tool-permission-controller.ts</code>.',
    steps: [
      ['Classify', 'First attempt runs normally; most pass untouched.'],
      ['Block', 'Adapt to a safer same-goal path, or escalate the identical action.'],
      ['Ask', 'ExternalShell/Read raise a local-tool card (allow-once / always / deny / never).'],
    ],
    cond: [
      { q: 'Was Auto-review enforce on for every 0.18.0 user?', r: 'No. Modes resolve from settings.isEnabled plus Statsig sand_auto_review, with a local override in the reconstruction (2026-09-13).' },
    ] },

  { id: 'BOX', code: 'BOX', name: 'Remote box', short: 'BOX', group: 'exec', gx: 19.0, gy: 11.4, w: 3, d: 2.2, h: 24, kind: 'slab',
    one: 'The agent\'s own Linux computer — default Shell, Read, desktop, browser.',
    what: 'Main asks the Cursor backend to ensureSandBox. The host and box-exec-daemon run inside that machine. /workspace is scratch; /home/box is profile. VNC is the per-agent desktop. To the user this is "my computer", never a "box".',
    how: '<code>electron-main/box/box-host-connector.ts</code> <mark>ensureSandBox</mark>. Host <code>box-exec-daemon</code> unless SAND_USE_EXISTING_BOX_EXEC_DAEMON=1. File transfer, screenshot, computer-use subagent, request_box_help live here.',
    steps: [
      ['Ensure', 'Broker returns gatewayUrl, gatewayToken, networkToken, VNC URLs.'],
      ['Host', 'Coordinator connects; host gateway serves the turn API.'],
      ['Exec', 'Shell/Read hit box-exec-daemon on the box filesystem.'],
    ],
    cond: [
      { q: 'Is the local Docker VM the 0.18 box?', r: 'No. Remote brokered box is the product default. Local Docker is a Bennett extra (2026-09-13).' },
      'Is box-exec-daemon always spawned by the host, or sometimes already present in the remote image (SAND_USE_EXISTING_BOX_EXEC_DAEMON)?',
    ] },

  { id: 'LCL', code: 'LCL', name: 'Local exec', short: 'LOCAL EXEC', group: 'exec', gx: 15.6, gy: 12.0, w: 2.6, d: 2.2, h: 22, kind: 'slab',
    one: 'The user\'s computer — ExternalShell / ExternalRead, permission-gated.',
    what: 'A separate daemon on the machine the human is sitting at. Coordinator mints a credential and supervises the process. Every command can raise an ask card. This is not free; work that belongs on the box must not come here.',
    how: '<code>source/local-exec-daemon/main.ts</code> + <code>packages/local-exec</code> / <code>shell-exec</code>. Coordinator <code>local-exec/supervisor</code>. Host extension <code>extensions/local-exec</code> bridges the gateway. Permission controller binds canAsk + live-computer check.',
    steps: [
      ['Spawn', 'Coordinator supervisor starts the daemon with a generation token.'],
      ['Ask', 'always / ask / never; ask waits on an approval card with TTL.'],
      ['Run', 'ExternalShell / ExternalRead / AwaitExternalShell on the user filesystem.'],
    ],
    cond: [
      'Does the Windows reconstruction match this macOS-arm64 host/coordinator/local-exec split, or are there platform-only legs?',
    ] },

  { id: 'SEND', code: 'SEND', name: 'SendMessage path', short: 'SEND', group: 'surf', gx: 5.6, gy: 10.6, w: 2.4, d: 2.2, h: 40, kind: 'screen',
    one: 'The only voice. If it is not inside SendMessage, the user sees silence.',
    what: 'Plain assistant text is a scratchpad. A reply, ack, result, widget, attachment, cloud-agent card, or secret-request counts only as a SendMessage tool call. User turns append a system reminder that forces a real invocation. sendPrompt is traced from renderer to host.',
    how: '<code>send-message-tool.ts</code> + schema types text / attachment / widget / cursor-agent / secret-request. Coordinator records send echo on user transcript append. Host <code>send-trace-host.ts</code> spans sand.send and sand.turn.run.',
    steps: [
      ['Type', 'Renderer sendPrompt {agentId, prompt, clientNonce, traceparent}.'],
      ['Trace', 'Coordinator beginSend; host beginSendTrace / beginTurnTrace.'],
      ['Speak', 'Model must invoke SendMessage; onSendMessage appends kind send-message.'],
      ['See', 'UI renders that entry. Plain tokens never become bubbles.'],
    ],
    cond: [
      { q: 'Can a tapback skip SendMessage?', r: 'Yes. ReactToMessage is the documented exception for a lone emoji reaction (2026-09-13).' },
    ] },

  { id: 'TASK', code: 'TASK', name: 'Task + multitask', short: 'TASK', group: 'surf', gx: 12.6, gy: 7.6, w: 2.2, d: 2.2, h: 36, kind: 'job',
    one: 'Background subagents and a dispatcher that stays available to the user.',
    what: 'Task launches subagents (including builtin executor). CheckSubagent / MessageSubagent / StopSubagent steer them. When multitask is on, TodoWrite is the queue and the parent must not do heavy work inline. Executors cannot SendMessage — the parent delivers.',
    how: '<code>source/host/sand-multitask.ts</code> + <code>packages/agent/tools/task.ts</code> + host subagent-management tools. Gate: env override or Statsig. Group rooms do the work inline instead.',
    steps: [
      ['Record', 'TodoWrite the request before dispatching.'],
      ['Dispatch', 'Task subagent_type executor with a self-contained prompt.'],
      ['Revive', 'Parent is notified on finish; SendMessage the result to the user.'],
    ],
    cond: [
      { q: 'Is multitask on in every 0.18.0 session?', r: 'Unknown. resolveMultitaskEnabled is env or a Statsig gate (2026-09-13).' },
    ] },

  { id: 'UI', code: 'UI', name: 'Authored frontend', short: 'FRONTEND', group: 'off', ghost: true, gx: 1, gy: -0.6, w: 2.2, d: 2.2, h: 36, kind: 'screen',
    one: 'Researcher addition: a partial React reconstruction. Not the shipped UI.',
    what: 'The 0.18.0 app did not include original frontend source or source maps. Packaged builds keep the checksum-pinned minified renderer. frontend/ is a readable design workspace with @evidence comments. Do not treat it as Anysphere source or a pixel-perfect replacement.',
    how: '<code>frontend/</code> Vite app. <code>frontend/README.md</code>: bootstrap hydrates ignored src/app/dist; packaging applies a narrow Router-settings transform whose chunk hashes are recorded. Ghost on this map.',
    steps: [
      ['Pin', 'Bootstrap verifies DMG and app.asar SHA-256.'],
      ['Retain', 'Shipped renderer is the UI baseline.'],
      ['Patch', 'Narrow settings transform only; hashes verified.'],
    ],
    cond: [
      { q: 'Does frontend/ match the minified renderer 1:1?', r: 'No. It is partial and evidence-bounded. Gaps stay unmapped rather than invented (2026-09-13).' },
    ] },

  { id: 'XTRA', code: 'XTRA', name: 'Bennett extras', short: 'EXTRAS', group: 'off', ghost: true, gx: 19.6, gy: -0.6, w: 2.4, d: 2.2, h: 36, kind: 'box',
    one: 'Researcher additions: inference router and local Docker VM. Not the 0.18 product.',
    what: 'README lists experiments on top of the reconstruction: Cursor/Claude Code/Codex/OpenRouter router, routed MCP tools, local usage totals, optional local Docker sandbox, reconstructed Router settings UI. Cursor remains the default. Remote box remains the default. Post-0.18.0 Cursor builds are also out of scope.',
    how: '<code>node-agent-coordinator/inference-router.ts</code> intercepts sendPrompt when provider ≠ cursor. <code>routed-mcp-bridge.ts</code> is a loopback MCP server for Claude Code. <code>electron-main/box/local-docker-host-connector.ts</code> binds grok-bot-local-vm on 127.0.0.1. Ghost on this map.',
    steps: [
      ['Default', 'Provider cursor → product host loop. Box runtime remote → ensureSandBox.'],
      ['Router', 'Non-cursor sendPrompt handled locally with a side transcript JSON.'],
      ['Docker', 'If box runtime is local-docker, connect to loopback gateway :1340.'],
    ],
    cond: [
      { q: 'Did 0.18.0 ship an OpenRouter router or local Docker VM?', r: 'No. README presents both as reconstruction experiments. Cursor + remote box are the product defaults (2026-09-13).' },
    ] },
];

export const FLOWS = [
  { id: 'turn', name: 'User turn', hops: [
    ['PRE', 'COORD', 'sendPrompt', { agentId: 'agt_1', prompt: 'ship the weekly note', clientNonce: 'n1' }, 'yx'],
    ['COORD', 'HOST', 'gateway sendPrompt', { trace: 'sand.send' }, 'xy'],
    ['HOST', 'INF', 'createSession', { provider: 'cursor', modelId: 'grok-4.5' }, 'xy'],
    ['INF', 'TOOLS', 'tool loop', { first: 'SendMessage' }, 'xy'],
    ['TOOLS', 'SEND', 'SendMessage', { type: 'text', content: 'On it' }, 'yx'],
  ] },
  { id: 'box', name: 'Box shell', hops: [
    ['INF', 'TOOLS', 'Shell', { command: 'ls /workspace', surface: 'isolated_box' }, 'xy'],
    ['TOOLS', 'ARV', 'auto-review', { surface: 'box_shell', mode: 'enforce' }, 'yx'],
    ['TOOLS', 'BOX', 'box-exec-daemon', { workspaceRoot: '/home/box/…' }, 'xy'],
    ['TOOLS', 'SEND', 'SendMessage', { type: 'text', content: 'Listed the workspace.' }, 'yx'],
  ] },
  { id: 'local', name: 'User-computer shell', hops: [
    ['INF', 'TOOLS', 'ExternalShell', { command: 'ls', surface: 'host_machine' }, 'xy'],
    ['TOOLS', 'ARV', 'local-tool ask', { permission: 'ask', action: 'run-command' }, 'yx'],
    ['ARV', 'LCL', 'local-exec-daemon', { allowed: true }, 'xy'],
    ['TOOLS', 'SEND', 'SendMessage', { type: 'text', content: 'Ran it on your computer.' }, 'yx'],
  ] },
  { id: 'mcp', name: 'Connector call', hops: [
    ['INF', 'MCP', 'GetMcpTools', { server: 'linear' }, 'xy'],
    ['MCP', 'TOOLS', 'CallMcpTool', { name: 'list_issues' }, 'yx'],
    ['TOOLS', 'ARV', 'auto-review', { surface: 'mcp' }, 'xy'],
    ['TOOLS', 'SEND', 'SendMessage', { type: 'text', content: 'Three open issues.' }, 'yx'],
  ] },
];

export const CH = [
  { id: 'you', title: 'You type', reveal: ['MAIN', 'PRE'],
    lede: `A desktop window and a narrow bridge. Nothing thinks yet.`,
    story: `<p>Grok Bot 0.18 is an Electron app. Main owns the window, Cursor login, and the box connector. Preload is the <mark>only surface the UI may call</mark> — desktop RPC plus a coordinator MessagePort. This atlas studies an unofficial reconstruction of that shipped 0.18.0 binary, not Anysphere's monorepo.</p>`,
    flow: [
      ['PRE', 'COORD', 'coordinatorPort', { method: 'sendPrompt' }],
    ] },
  { id: 'plane', title: 'Control plane', reveal: ['COORD', 'HOST'],
    lede: `Coordinator on the desktop. Host in the box. Transcripts in the middle.`,
    story: `<p>Main forks <mark>sand-node-agent-coordinator</mark>. That child owns streaming, sendPrompt, local-exec supervision, and the gateway client. The host process inside the remote box starts the extension graph and serves the turn API. Coordinator does not run in the box.</p>`,
    flow: [
      ['PRE', 'COORD', 'sendPrompt', { agentId: 'agt_1', prompt: 'ship the weekly note' }],
      ['COORD', 'HOST', 'gateway', { channel: 'transcript' }],
    ] },
  { id: 'think', title: 'Think and act', reveal: ['INF', 'TOOLS', 'PRM'],
    lede: `A Cursor session, a prompt constitution, one per-turn tool surface.`,
    story: `<p>The harness wraps a model; it is not a model list. Default id in this tree is grok-4.5. The system prompt and SendMessage schema are the constitution. Packages collapse into <mark>buildTurnTools</mark> — Shell vs ExternalShell, Task, MCP, CloudAgent — not one node per package.</p>`,
    flow: [
      ['HOST', 'INF', 'createSession', { provider: 'cursor', modelId: 'grok-4.5' }],
      ['INF', 'TOOLS', 'tool loop', {}],
      ['PRM', 'INF', 'system prompt + reminder', { sendMessage: 'required' }],
    ] },
  { id: 'voice', title: 'Only voice', reveal: ['SEND'],
    lede: `If it is not inside SendMessage, the user sees silence.`,
    story: `<p>Plain assistant text is a private scratchpad. A reply counts only as a <mark>SendMessage</mark> tool call — including "Hey". Ack ≠ delivery. User turns append a reminder that a real tool invocation is required. ReactToMessage is the lone tapback exception.</p>`,
    flow: [
      ['PRE', 'COORD', 'sendPrompt', { prompt: 'you there?' }],
      ['COORD', 'HOST', 'gateway sendPrompt', {}],
      ['TOOLS', 'SEND', 'SendMessage', { type: 'text', content: 'Here.' }],
    ] },
  { id: 'two', title: 'Two computers', reveal: ['BOX', 'LCL'],
    lede: `Shell is the box. ExternalShell is the user's machine.`,
    story: `<p>The agent has a remote Linux computer (the box) where host and box-exec-daemon live. That is the default. ExternalShell / ExternalRead talk to a local-exec daemon on the human's computer and need permission. <mark>Never send box work out to the user machine.</mark></p>`,
    flow: [
      ['TOOLS', 'BOX', 'Shell', { command: 'ls /workspace' }],
      ['TOOLS', 'LCL', 'ExternalShell', { command: 'ls', permission: 'ask' }],
    ] },
  { id: 'gate', title: 'The gate', reveal: ['ARV'],
    lede: `Auto-review on the box. Ask cards on the user's computer.`,
    story: `<p>Shell, MCP, computer, cloud-agent, and subagent launches can be off, shadow, or enforce. A pending approval blocks new side effects. Escalation is the <mark>same action unchanged</mark> with request_smart_mode_approval — not a quieter rewrite. Local-tool permission is a separate always/ask/never ceiling.</p>`,
    flow: [
      ['TOOLS', 'ARV', 'auto-review', { surface: 'box_shell', mode: 'enforce' }],
      ['ARV', 'SEND', 'approval card', { status: 'pending' }],
    ] },
  { id: 'mcp', title: 'Connectors', reveal: ['MCP'],
    lede: `Plugins on the Cursor account. Live MCP calls, not screenshots.`,
    story: `<p>A connector is the user-facing MCP server. Host discovers account plugins, auths them through Electron, and offers GetMcpTools / CallMcpTool. Prefer a service's MCP over driving its UI. The loopback MCP bridge for Claude Code is a Bennett extra, not this node.</p>`,
    flow: [
      ['INF', 'MCP', 'GetMcpTools', { server: 'linear' }],
      ['MCP', 'TOOLS', 'CallMcpTool', { name: 'list_issues' }],
    ] },
  { id: 'many', title: 'Many streams', reveal: ['TASK'],
    lede: `Stay available. Dispatch heavy work. Deliver it yourself.`,
    story: `<p>When multitask is on, the parent is a dispatcher: TodoWrite the queue, Task an executor, never do heavy work inline. Executors have no SendMessage. Group rooms skip this and work in-turn. The Statsig/env gate is an open operator fact.</p>`,
    flow: [
      ['INF', 'TASK', 'Task', { subagent_type: 'executor' }],
      ['TASK', 'SEND', 'SendMessage', { content: 'Flights are booked.' }],
    ] },
  { id: 'hygiene', title: 'Release hygiene', reveal: ['UI'],
    lede: `Minifying the renderer was not enough. The harness still leaked.`,
    story: `<p>0.18.0 shipped optimized production chunks, not authored React. The reconstruction still recovered prompts, tool schemas, IPC, and path-bearing strings. <mark>Source maps and unminified bundles are a leak of the harness</mark> — a cautionary, not a recipe. frontend/ on this map is a ghost: a partial study workspace, not the packaged UI.</p>`,
    flow: [
      ['UI', 'PRE', 'shipped renderer (pinned)', { sourceMaps: false }],
    ] },
  { id: 'homework', title: 'Good homework', reveal: ['XTRA'],
    lede: `Study the contracts. Do not fork this as open-source Grok Bot.`,
    story: `<p>Good homework: SendMessage, two computers, Auto-review, coordinator, MCP. Bad homework: claiming a license, treating inferred names as Anysphere's, or shipping a fork as the product. The inference router and local Docker VM are <mark>researcher additions</mark> — ghosts, not 0.18. Cite NOTICE.md and PROVENANCE.md. No upstream license is asserted.</p>`,
    flow: [
      ['XTRA', 'COORD', 'router intercept (EXTRA)', { provider: 'openrouter' }],
      ['XTRA', 'BOX', 'local Docker (EXTRA)', { runtime: 'local-docker' }],
    ] },
  { id: 'all', title: 'The whole system', reveal: [],
    lede: `Everything at once, for free exploration.`,
    story: `<p>Choose which flow runs (bottom left). Hover anything; click to pin; → goes inside. Ghosts are researcher additions, not the 0.18 product. Open questions include original Anysphere names, live Statsig gates, and anything after 0.18.0.</p>`,
    flow: null },
];

export const HOW_HTML = `<div class="eyebrow">gb-018 · unofficial 0.18.0 study copy</div><h1 class="t">How it's built</h1><div class="sub">a harness around a model, reconstructed from a public binary</div>
<h3 class="sec">Framing</h3>
<p>Unofficial reconstructed study copy of publicly shipped Grok Bot 0.18.0. Not Anysphere's monorepo; names and boundaries are inferred. Good homework: prompts, tool schemas, coordinator, MCP bridge. Bad homework: forking as "open-source Grok Bot". Cite NOTICE.md and PROVENANCE.md. No upstream license is asserted.</p>
<h3 class="sec">Filesystem</h3>
<pre>source/
  electron-main/          desktop lifecycle, auth, box connector, coordinator launch
  electron-preload/       contextBridge: desktop + coordinatorPort
  node-agent-coordinator/ renderer port, gateway client, local-exec supervisor
  host/                   sand-host, gateway, runner, extensions, MCP, Auto-review
  box-exec-daemon/        in-box shell/file daemon
  local-exec-daemon/      daemon on the user's computer
  packages/               agent, chat-inference, prompt-jsx, mcp-*, shell-exec, local-exec
  shared/                 contracts, settings, gateway wire
frontend/                 EXTRA — partial authored renderer, not the shipped UI</pre>
<p>Runtimes compile from <code>source/</code>. The packaged UI is the checksum-pinned shipped renderer. <code>frontend/</code>, the Codex/OpenRouter/Claude Code router, and the local Docker VM are researcher additions — ghosts on the map.</p>
<h3 class="sec">Two computers, one voice</h3>
<p><mark>Shell / Read</mark> are the box. <mark>ExternalShell / ExternalRead</mark> are the user's machine. <mark>SendMessage</mark> is the only voice; plain model text never reaches the user.</p>
<h3 class="sec">Release hygiene</h3>
<p>Minifying the renderer did not hide prompts, tool schemas, or IPC contracts. Shipping source maps or path-bearing strings leaks the harness. This atlas invents no Cursor pricing.</p>`;
