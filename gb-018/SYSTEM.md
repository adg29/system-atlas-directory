# Grok Bot 0.18 — System Definition

_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._ This atlas is an unofficial reconstructed study copy of the publicly shipped Grok Bot 0.18.0 desktop app. It is not Anysphere's monorepo; names and module boundaries are inferred from a compiled application. Good homework: prompts, tool schemas, coordinator, MCP bridge. Bad homework: forking this tree as "open-source Grok Bot". Cite [NOTICE.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/NOTICE.md) and [PROVENANCE.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/PROVENANCE.md).

_Question status: **5 open · 9 resolved**._

## One paragraph

Grok Bot 0.18 is a desktop harness around a model, not a model list. Electron owns the window, a narrow preload, and the box connector. The coordinator owns transcripts, streaming, tool dispatch, and the two execution environments. The host inside the remote box runs the turn: Cursor inference, a forced SendMessage voice, Auto-review gates, and MCP. This map reads b-nnett's unofficial reconstruction of the shipped 0.18.0 app — a study copy, not Anysphere source.

## Decisions locked

| Axis | Decision | ADR |
|---|---|---|
| Provenance | Unofficial reconstructed study copy of publicly shipped 0.18.0. Not Anysphere's monorepo; names/boundaries inferred. No upstream license is asserted. Do not claim MIT or Anysphere license. | [NOTICE.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/NOTICE.md) · [PROVENANCE.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/PROVENANCE.md) |
| Hybrid | Runtimes compile from readable source/. The polished shipped renderer stays checksum-pinned. frontend/ is a partial design workspace, not the packaged UI. | [README.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/README.md) · [docs/ARCHITECTURE.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/docs/ARCHITECTURE.md) |
| Harness | The product is a harness around a model — Electron, coordinator, host, tools, two exec envs — not a catalog of models. Default Cursor model id in this tree is grok-4.5; that is a pin, not the map. | [source/host/extensions/inference/cursor-session.ts](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/source/host/extensions/inference/cursor-session.ts) |
| Send path | User-visible replies are forced through SendMessage. Plain assistant text is a private scratchpad. Ack ≠ delivery. ReactToMessage is the lone tapback exception. | [send-message-tool.ts](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/source/host/runner/tools/send-message-tool.ts) · [system-prompt.ts](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/source/host/runner/system-prompt.ts) |
| Two computers | Shell/Read/AwaitShell are the box (the agent's Linux computer). ExternalShell/ExternalRead/AwaitExternalShell are the user's machine and need local-tool permission. Never clone a repo onto either by default. | [agent-tool-names.ts](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/source/shared/agents/agent-tool-names.ts) · [turn-toolset.ts](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/source/host/runner/tools/turn-toolset.ts) |
| Release hygiene | Shipping maps, unminified bundles, or path-bearing strings leaks the harness. 0.18.0 minified the renderer and still leaked prompts, schemas, and IPC. Treat that as a cautionary, not a how-to. | [PROVENANCE.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/PROVENANCE.md) · [SECURITY.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/SECURITY.md) |

## Cost model

- No Cursor pricing is invented here. The product bills elsewhere; this atlas does not guess seats, tokens, or Grok Bot plans.
- **Release-hygiene lesson.** 0.18.0 shipped a minified renderer, but prompts, tool schemas, IPC contracts, and path-bearing strings were still recoverable. Source maps, unminified bundles, and emitted source-path markers are a harness leak.
- Reconstructed packages default the official updater, Sentry, and upstream telemetry off at the packaging boundary. That is a study-copy choice, not a product claim.

## Deep dives

Study copy: [b-nnett/grok-bot-0.18-reconstructed](https://github.com/b-nnett/grok-bot-0.18-reconstructed). Provenance: [PROVENANCE.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/PROVENANCE.md), [NOTICE.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/NOTICE.md). Architecture: [docs/ARCHITECTURE.md](https://github.com/b-nnett/grok-bot-0.18-reconstructed/blob/main/docs/ARCHITECTURE.md).

## Reading order (the atlas chapters)

1. **You type** — A desktop window and a narrow bridge. Nothing thinks yet. _(adds MAIN, PRE)_
2. **Control plane** — Coordinator on the desktop. Host in the box. Transcripts in the middle. _(adds COORD, HOST)_
3. **Think and act** — A Cursor session, a prompt constitution, one per-turn tool surface. _(adds INF, TOOLS, PRM)_
4. **Only voice** — If it is not inside SendMessage, the user sees silence. _(adds SEND)_
5. **Two computers** — Shell is the box. ExternalShell is the user's machine. _(adds BOX, LCL)_
6. **The gate** — Auto-review on the box. Ask cards on the user's computer. _(adds ARV)_
7. **Connectors** — Plugins on the Cursor account. Live MCP calls, not screenshots. _(adds MCP)_
8. **Many streams** — Stay available. Dispatch heavy work. Deliver it yourself. _(adds TASK)_
9. **Release hygiene** — Minifying the renderer was not enough. The harness still leaked. _(adds UI)_
10. **Good homework** — Study the contracts. Do not fork this as open-source Grok Bot. _(adds XTRA)_
11. **The whole system** — Everything at once, for free exploration.

## Structures

### Desktop shell

#### MAIN · Electron main

**In one line.** The desktop process: window, auth, settings, box connector, coordinator ownership.

**What it does.** Grok Bot 0.18 is an Electron 42.1 app (upstream bundle id com.anysphere.sand). Main owns lifecycle, Cursor login, secrets, MCP install IPC, VNC trust, and forks the coordinator. It does not think. It connects the polished renderer to a remote box gateway.

**How it's built.** `source/electron-main/main.ts` starts the window with contextIsolation, no nodeIntegration, preload, webviewTag. `coordinator/coordinator-launcher.ts` forks **sand-node-agent-coordinator** on three MessagePorts (control, renderer-data, main-data). `box/box-host-connector.ts` calls ensureSandBox for gateway URL and tokens.

**Steps in execution.**

1. **Boot** — Single-instance lock, user-data bootstrap, services, then the window.
2. **Preload** — Load the shipped renderer HTML; preload exposes desktop + coordinatorPort.
3. **Connect** — BrokeredHostConnector.ensureSandBox → gatewayUrl, tokens, VNC.
4. **Own** — Launch coordinator; RPC handlers for settings, MCP, local-tool permission, Auto-review instructions.

**Questions.**

- ~~**Q-MAIN1** Is this Anysphere's original main.ts?~~ ✓ No. Reconstructed from the shipped 0.18.0 binary; names are inferred (2026-09-13).
- **Q-MAIN2** What were Anysphere's original package and folder names, versus this inferred source/ layout?

#### PRE · Preload bridge

**In one line.** The narrow trusted surface the UI is allowed to see.

**What it does.** The renderer never talks to Node. Preload exposes window.desktop (RPC to main) and window.coordinatorPort (a transferred MessagePort to the coordinator). MCP list/install/auth, theme, secrets, Auto-review instructions, and local-tool permission all cross here.

**How it's built.** `source/electron-preload/preload.ts` **contextBridge.exposeInMainWorld** for desktop and coordinatorPort. Coordinator port is delivered on sand:coordinator-port. Telemetry is send-only IPC (send-latency, send-ack, VNC, heap).

**Steps in execution.**

1. **Expose** — desktop + coordinatorPort in the isolated world.
2. **RPC** — Main-edge methods: auth, settings, box recreate, Auto-review instructions.
3. **Port** — Claim the coordinator MessagePort; renderer dispatches sendPrompt on it.

### Control plane

#### COORD · Coordinator

**In one line.** Owns transcripts, streaming, tool dispatch, and the two exec environments from the desktop side.

**What it does.** A Node child the main process forks. It sits between the renderer and the in-box host: renderer-port RPC, gateway SSE (transcript, agents, MCP oauth, client-side-tool-v2), local-exec daemon supervisor, WebAuthn, MCP OAuth forwarder. sendPrompt is the turn door.

**How it's built.** `source/node-agent-coordinator/main.ts` **composeCoordinator**. Gateway client + SandHostSupervisor. sendPrompt begins a send-trace then dispatches; product path hits the host. Inference-router intercept is a Bennett extra (see XTRA).

**Steps in execution.**

1. **Adopt** — Carrier bootstrap from main: dataDir, ports, processConfig.
2. **Serve** — Renderer port + main-data port; replay client-side-tool-v2 on serving.
3. **Dispatch** — sendPrompt → host gateway (Cursor path) or EXTRA router.
4. **Relay** — SSE channels become coordinator event families the UI already knows.

**Questions.**

- ~~**Q-COORD1** Does the coordinator run inside the remote box?~~ ✓ No. It is a desktop Node child. The host/gateway run in the box (2026-09-13).

#### HOST · Sand host

**In one line.** The in-box control plane: extension graph, gateway, runner composition.

**What it does.** One process in the remote box. It starts host extensions in graph order, loads transcripts, binds SandAgentRunner, and serves a token-gated HTTP gateway. Health reports busy vs busy-only-awaiting-Auto-review. This is where a turn actually runs.

**How it's built.** `source/host/main.ts` takes a host lock, optionally spawns box-exec-daemon, `SandHost.start()`, then **startGatewayServer**. `sand-host.ts` wires transcript, MCP auth completion, forever-box, turn-execution, local-tool-permission.

**Steps in execution.**

1. **Lock** — Acquire sand-root lock; take over a stale host if needed.
2. **Graph** — Start extensions; log order; bind runner + local-tool ask surfaces.
3. **Listen** — Gateway on SAND_HOST_PORT; write discovery (port, pid, token).
4. **Ready** — reportBoxReady; kickstart pending agents once inference is ready.

**Questions.**

- **Q-HOST1** Is every host extension in this reconstruction live in 0.18.0, or do unused / later capsules remain in the graph?

### Think and act

#### INF · Cursor inference

**In one line.** The product brain: a Cursor-backed prompt session, not a model zoo.

**What it does.** Default model id in this tree is grok-4.5. A turn creates a Cursor prompt session (access token + machine id), streams tool calls, and labels follow-ups. This atlas maps the harness around that session. Claude Code / Codex / OpenRouter are researcher additions on XTRA.

**How it's built.** `source/host/extensions/inference/cursor-session.ts` **createCursorInferencePromptSession** when provider is cursor. `packages/chat-inference` + `packages/agent` own the tool loop. Host `SandAgentRunner` drives one turn to quiescence.

**Steps in execution.**

1. **Session** — Resolve model (default, computer-use, browser-use, experiment).
2. **Stream** — Prompt executor streams text and tool calls into the runner.
3. **Tools** — Turn toolset executes; results append; loop until SendMessage or wait.

**Questions.**

- ~~**Q-INF1** Is grok-4.5 the only model?~~ ✓ No. It is SAND_DEFAULT_MODEL_ID. Settings and experiments can pin others. The map is the harness, not the list (2026-09-13).

#### TOOLS · Turn toolset

**In one line.** One per-turn surface. Packages collapse here — not one node per package.

**What it does.** SendMessage, Shell/Read vs ExternalShell/ExternalRead, Task, MCP discovery/call, CloudAgent, computer/browser, file transfer, reactions. Subagents get a fenced subset. Shared rooms can be text-only. Dynamic MCP tools are optional.

**How it's built.** `source/host/runner/tools/turn-toolset.ts` **buildTurnTools**. Factories from agent/tools/core (shell, read, await, web, task) plus host sand-* tools. Local-tool scope wraps external shell/read.

**Steps in execution.**

1. **Build** — Host factories + per-turn MCP descriptors + Auto-review shell options.
2. **Fence** — Subagent / shared-room / box-scoped filters.
3. **Timeout** — Every call wrapped; dynamic MCP invocation has its own cap.

**Questions.**

- **Q-TOOLS1** Which tools are actually offered for a given 0.18.0 account (dynamic MCP, CloudAgent team disable, shared-room box tools, spotlight)?

#### PRM · Prompts + contracts

**In one line.** The written constitution the model is required to obey.

**What it does.** System prompt, SendMessage schema, tool descriptions, multitask section, Auto-review safety copy, user-reply reminder. This is the best homework in the reconstruction: the shipped contracts, recovered as TypeScript.

**How it's built.** `source/host/runner/system-prompt.ts` **buildSandBaseSystemPrompt** plus USER_MESSAGE_REPLY_REMINDER. Schema in `send-message-schema.ts`. Agent prompts under `packages/agent/prompts`. JSX assembly via `packages/prompt-jsx`.

**Steps in execution.**

1. **Assemble** — Base prompt + multitask + MCP + cloud-agents enabled/disabled.
2. **Remind** — Every user-visible turn appends the SendMessage tool-call reminder.
3. **Describe** — Each tool's descriptionGenerator is part of the contract.

#### MCP · MCP + plugins

**In one line.** Connectors: Cursor-account plugins discovered, authed, and called live.

**What it does.** A plugin is the install bundle; a connector is the user-facing MCP server. Host talks to the Cursor dashboard backend for catalog, install, and tool exec. Box can run some MCP too. Auth completions round-trip through the coordinator and Electron.

**How it's built.** `source/host/extensions/mcp/mcp-service.ts` + `packages/mcp-core` / `mcp-agent-exec`. Tools: GetMcpTools, CallMcpTool, AuthenticateMcpServer. Desktop IPC in `electron-main/mcp` and preload `desktop.mcp`. Routed loopback MCP bridge is EXTRA.

**Steps in execution.**

1. **Discover** — Account servers + effective plugins + box MCP kick.
2. **Call** — CallMcpTool with live schema; refetch if stale; Auto-review on mutations.
3. **Auth** — mcp-oauth-pending → Electron loopback; host mcp-auth completion.

#### ARV · Auto-review + asks

**In one line.** The safety check before shell, MCP, computer, cloud-agent, and local tools.

**What it does.** Auto-review classifies actions off / shadow / enforce per surface (host shell, box shell, MCP, computer, automation write, cloud agent, subagent launch). A pending card blocks new side effects. Local-tool permission is a separate always/ask/never gate for the user's machine.

**How it's built.** `source/host/runner/auto-review-gate.ts` + `extensions/auto-review/auto-review-service.ts`. Escalation: retry the same action with **request_smart_mode_approval** (Shell) or requestSmartModeApproval (MCP). Local asks: `local-tool-permission-controller.ts`.

**Steps in execution.**

1. **Classify** — First attempt runs normally; most pass untouched.
2. **Block** — Adapt to a safer same-goal path, or escalate the identical action.
3. **Ask** — ExternalShell/Read raise a local-tool card (allow-once / always / deny / never).

**Questions.**

- ~~**Q-ARV1** Was Auto-review enforce on for every 0.18.0 user?~~ ✓ No. Modes resolve from settings.isEnabled plus Statsig sand_auto_review, with a local override in the reconstruction (2026-09-13).

### Two computers

#### BOX · Remote box

**In one line.** The agent's own Linux computer — default Shell, Read, desktop, browser.

**What it does.** Main asks the Cursor backend to ensureSandBox. The host and box-exec-daemon run inside that machine. /workspace is scratch; /home/box is profile. VNC is the per-agent desktop. To the user this is "my computer", never a "box".

**How it's built.** `electron-main/box/box-host-connector.ts` **ensureSandBox**. Host `box-exec-daemon` unless SAND_USE_EXISTING_BOX_EXEC_DAEMON=1. File transfer, screenshot, computer-use subagent, request_box_help live here.

**Steps in execution.**

1. **Ensure** — Broker returns gatewayUrl, gatewayToken, networkToken, VNC URLs.
2. **Host** — Coordinator connects; host gateway serves the turn API.
3. **Exec** — Shell/Read hit box-exec-daemon on the box filesystem.

**Questions.**

- ~~**Q-BOX1** Is the local Docker VM the 0.18 box?~~ ✓ No. Remote brokered box is the product default. Local Docker is a Bennett extra (2026-09-13).
- **Q-BOX2** Is box-exec-daemon always spawned by the host, or sometimes already present in the remote image (SAND_USE_EXISTING_BOX_EXEC_DAEMON)?

#### LCL · Local exec

**In one line.** The user's computer — ExternalShell / ExternalRead, permission-gated.

**What it does.** A separate daemon on the machine the human is sitting at. Coordinator mints a credential and supervises the process. Every command can raise an ask card. This is not free; work that belongs on the box must not come here.

**How it's built.** `source/local-exec-daemon/main.ts` + `packages/local-exec` / `shell-exec`. Coordinator `local-exec/supervisor`. Host extension `extensions/local-exec` bridges the gateway. Permission controller binds canAsk + live-computer check.

**Steps in execution.**

1. **Spawn** — Coordinator supervisor starts the daemon with a generation token.
2. **Ask** — always / ask / never; ask waits on an approval card with TTL.
3. **Run** — ExternalShell / ExternalRead / AwaitExternalShell on the user filesystem.

**Questions.**

- **Q-LCL1** Does the Windows reconstruction match this macOS-arm64 host/coordinator/local-exec split, or are there platform-only legs?

### Voice

#### SEND · SendMessage path

**In one line.** The only voice. If it is not inside SendMessage, the user sees silence.

**What it does.** Plain assistant text is a scratchpad. A reply, ack, result, widget, attachment, cloud-agent card, or secret-request counts only as a SendMessage tool call. User turns append a system reminder that forces a real invocation. sendPrompt is traced from renderer to host.

**How it's built.** `send-message-tool.ts` + schema types text / attachment / widget / cursor-agent / secret-request. Coordinator records send echo on user transcript append. Host `send-trace-host.ts` spans sand.send and sand.turn.run.

**Steps in execution.**

1. **Type** — Renderer sendPrompt {agentId, prompt, clientNonce, traceparent}.
2. **Trace** — Coordinator beginSend; host beginSendTrace / beginTurnTrace.
3. **Speak** — Model must invoke SendMessage; onSendMessage appends kind send-message.
4. **See** — UI renders that entry. Plain tokens never become bubbles.

**Questions.**

- ~~**Q-SEND1** Can a tapback skip SendMessage?~~ ✓ Yes. ReactToMessage is the documented exception for a lone emoji reaction (2026-09-13).

#### TASK · Task + multitask

**In one line.** Background subagents and a dispatcher that stays available to the user.

**What it does.** Task launches subagents (including builtin executor). CheckSubagent / MessageSubagent / StopSubagent steer them. When multitask is on, TodoWrite is the queue and the parent must not do heavy work inline. Executors cannot SendMessage — the parent delivers.

**How it's built.** `source/host/sand-multitask.ts` + `packages/agent/tools/task.ts` + host subagent-management tools. Gate: env override or Statsig. Group rooms do the work inline instead.

**Steps in execution.**

1. **Record** — TodoWrite the request before dispatching.
2. **Dispatch** — Task subagent_type executor with a self-contained prompt.
3. **Revive** — Parent is notified on finish; SendMessage the result to the user.

**Questions.**

- ~~**Q-TASK1** Is multitask on in every 0.18.0 session?~~ ✓ Unknown. resolveMultitaskEnabled is env or a Statsig gate (2026-09-13).

### Researcher additions (designed for, not built)

#### UI · Authored frontend _(not switched on)_

**In one line.** Researcher addition: a partial React reconstruction. Not the shipped UI.

**What it does.** The 0.18.0 app did not include original frontend source or source maps. Packaged builds keep the checksum-pinned minified renderer. frontend/ is a readable design workspace with @evidence comments. Do not treat it as Anysphere source or a pixel-perfect replacement.

**How it's built.** `frontend/` Vite app. `frontend/README.md`: bootstrap hydrates ignored src/app/dist; packaging applies a narrow Router-settings transform whose chunk hashes are recorded. Ghost on this map.

**Steps in execution.**

1. **Pin** — Bootstrap verifies DMG and app.asar SHA-256.
2. **Retain** — Shipped renderer is the UI baseline.
3. **Patch** — Narrow settings transform only; hashes verified.

**Questions.**

- ~~**Q-UI1** Does frontend/ match the minified renderer 1:1?~~ ✓ No. It is partial and evidence-bounded. Gaps stay unmapped rather than invented (2026-09-13).

#### XTRA · Bennett extras _(not switched on)_

**In one line.** Researcher additions: inference router and local Docker VM. Not the 0.18 product.

**What it does.** README lists experiments on top of the reconstruction: Cursor/Claude Code/Codex/OpenRouter router, routed MCP tools, local usage totals, optional local Docker sandbox, reconstructed Router settings UI. Cursor remains the default. Remote box remains the default. Post-0.18.0 Cursor builds are also out of scope.

**How it's built.** `node-agent-coordinator/inference-router.ts` intercepts sendPrompt when provider ≠ cursor. `routed-mcp-bridge.ts` is a loopback MCP server for Claude Code. `electron-main/box/local-docker-host-connector.ts` binds grok-bot-local-vm on 127.0.0.1. Ghost on this map.

**Steps in execution.**

1. **Default** — Provider cursor → product host loop. Box runtime remote → ensureSandBox.
2. **Router** — Non-cursor sendPrompt handled locally with a side transcript JSON.
3. **Docker** — If box runtime is local-docker, connect to loopback gateway :1340.

**Questions.**

- ~~**Q-XTRA1** Did 0.18.0 ship an OpenRouter router or local Docker VM?~~ ✓ No. README presents both as reconstruction experiments. Cursor + remote box are the product defaults (2026-09-13).

## Flows (representative packets)

Payload shapes are what the design implies, not measured traffic.

### User turn

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | PRE → COORD | sendPrompt | `{"agentId":"agt_1","prompt":"ship the weekly note","clientNonce":"n1"}` |
| 2 | COORD → HOST | gateway sendPrompt | `{"trace":"sand.send"}` |
| 3 | HOST → INF | createSession | `{"provider":"cursor","modelId":"grok-4.5"}` |
| 4 | INF → TOOLS | tool loop | `{"first":"SendMessage"}` |
| 5 | TOOLS → SEND | SendMessage | `{"type":"text","content":"On it"}` |

### Box shell

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | INF → TOOLS | Shell | `{"command":"ls /workspace","surface":"isolated_box"}` |
| 2 | TOOLS → ARV | auto-review | `{"surface":"box_shell","mode":"enforce"}` |
| 3 | TOOLS → BOX | box-exec-daemon | `{"workspaceRoot":"/home/box/…"}` |
| 4 | TOOLS → SEND | SendMessage | `{"type":"text","content":"Listed the workspace."}` |

### User-computer shell

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | INF → TOOLS | ExternalShell | `{"command":"ls","surface":"host_machine"}` |
| 2 | TOOLS → ARV | local-tool ask | `{"permission":"ask","action":"run-command"}` |
| 3 | ARV → LCL | local-exec-daemon | `{"allowed":true}` |
| 4 | TOOLS → SEND | SendMessage | `{"type":"text","content":"Ran it on your computer."}` |

### Connector call

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | INF → MCP | GetMcpTools | `{"server":"linear"}` |
| 2 | MCP → TOOLS | CallMcpTool | `{"name":"list_issues"}` |
| 3 | TOOLS → ARV | auto-review | `{"surface":"mcp"}` |
| 4 | TOOLS → SEND | SendMessage | `{"type":"text","content":"Three open issues."}` |

## Questions — index

Reference by ID. ✓ resolved (with date) · otherwise open.

- ~~**Q-MAIN1**~~ (MAIN) ✓ No. Reconstructed from the shipped 0.18.0 binary; names are inferred (2026-09-13).
- **Q-MAIN2** (MAIN) What were Anysphere's original package and folder names, versus this inferred source/ layout?
- ~~**Q-COORD1**~~ (COORD) ✓ No. It is a desktop Node child. The host/gateway run in the box (2026-09-13).
- **Q-HOST1** (HOST) Is every host extension in this reconstruction live in 0.18.0, or do unused / later capsules remain in the graph?
- ~~**Q-INF1**~~ (INF) ✓ No. It is SAND_DEFAULT_MODEL_ID. Settings and experiments can pin others. The map is the harness, not the list (2026-09-13).
- **Q-TOOLS1** (TOOLS) Which tools are actually offered for a given 0.18.0 account (dynamic MCP, CloudAgent team disable, shared-room box tools, spotlight)?
- ~~**Q-ARV1**~~ (ARV) ✓ No. Modes resolve from settings.isEnabled plus Statsig sand_auto_review, with a local override in the reconstruction (2026-09-13).
- ~~**Q-BOX1**~~ (BOX) ✓ No. Remote brokered box is the product default. Local Docker is a Bennett extra (2026-09-13).
- **Q-BOX2** (BOX) Is box-exec-daemon always spawned by the host, or sometimes already present in the remote image (SAND_USE_EXISTING_BOX_EXEC_DAEMON)?
- **Q-LCL1** (LCL) Does the Windows reconstruction match this macOS-arm64 host/coordinator/local-exec split, or are there platform-only legs?
- ~~**Q-SEND1**~~ (SEND) ✓ Yes. ReactToMessage is the documented exception for a lone emoji reaction (2026-09-13).
- ~~**Q-TASK1**~~ (TASK) ✓ Unknown. resolveMultitaskEnabled is env or a Statsig gate (2026-09-13).
- ~~**Q-UI1**~~ (UI) ✓ No. It is partial and evidence-bounded. Gaps stay unmapped rather than invented (2026-09-13).
- ~~**Q-XTRA1**~~ (XTRA) ✓ No. README presents both as reconstruction experiments. Cursor + remote box are the product defaults (2026-09-13).

## What the platform gives vs what we own

**Platform gives:** Electron 42.1 desktop shell, Cursor-backed inference, remote sand box, MCP connectors, Auto-review classifier

**We own:** nothing — this is a study map of a reconstructed public binary, not an operator deploy

## Planned filesystem

```
source/
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
frontend/                 EXTRA — partial authored renderer, not the shipped UI
```

## How this file is maintained

Generated from `gb-018/atlas/data.mjs` by `node gb-018/atlas/build.mjs`, which also builds the interactive atlas (`atlas.html`, published at https://adg29.github.io/system-atlas-directory/gb-018/). Edit the data file, rebuild, republish — never edit this file by hand.
