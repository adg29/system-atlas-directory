# QM — System Definition

_**This file is the living source of truth for the design.** The interactive atlas is built from the same data._

_Question status: **11 open · 3 resolved**._

## One paragraph

QM is a single-org multiplayer agent runtime. A turn arrives from the web, Slack, or a cron; the core queues it and a hired harness works in that scope's isolated sandbox. Sessions and memory persist. The org owns the deploy directory — not a hosted cloud.

## Decisions locked

| Axis | Decision | ADR |
|---|---|---|
| Runtime | One Node/TypeScript core process; every substrate sits behind an interface in src/wiring.ts. | [README](https://github.com/yc-software/qm) |
| Surfaces | Slack is in-process Bolt; web UI, admin, and portal are separate processes over the core HTTP API. | (repo) |
| Isolation | Each person and each room has its own sandbox, memory, files, and keychain. | [README](https://github.com/yc-software/qm) |
| Security | Org posture is Strict, Auto, or Dangerous; command policy applies even in Dangerous. | [SECURITY.md](https://github.com/yc-software/qm/blob/main/SECURITY.md) |
| Deploy | Operator-owned cloud via the qm CLI; this repo has no production deploy workflow. | [docs/deploy-directory.md](https://github.com/yc-software/qm/blob/main/docs/deploy-directory.md) |

## Cost model

## Reading order (the atlas chapters)

1. **You type** — You type in the web UI; the core queues a turn. _(adds UI, C)_
2. **The turn** — The orchestrator drives a hired harness through one turn. _(adds O, H)_
3. **What persists** — Sessions and scoped memory outlive the turn. _(adds PG, MF)_
4. **The computer** — Execute runs in that person or room's own sandbox. _(adds TL, SB)_
5. **The gate** — Identity, policy, and the org's security posture sit on every turn. _(adds G)_
6. **Slack** — Slack is not a sibling process — it lives inside the core. _(adds SL)_
7. **Background** — Cron, watch, and webhook share one trigger spine. _(adds CR)_
8. **Operate and ship** — Admin governs the org; the CLI ships QM into your cloud. _(adds AD, CL)_
9. **Later** — Designed for a public SSO proxy; typical install can skip it. _(adds PT)_
10. **The whole system** — Everything at once, for free exploration.

## Structures

### The turn

#### UI · Web UI

**In one line.** The page where you talk to the agent in the browser.

**What it does.** A chat you open on the web. You type; answers stream back on that run. Slack threads can be read here but this page will not post into them.

**How it's built.** `plugins/web-ui` is a Vite + Lit SPA plus `server/index.ts`. It signs with source-auth and **POST /v1/turns?async=1**, then follows SSE `GET /api/runs/:id/events` and `GET /v1/runs/:id`.

**Steps in execution.**

1. **Type** — Send a TurnRequest {surface:web, actor, conversation, text}.
2. **Queue** — Core answers 202 {status:queued, runId}.
3. **Stream** — Relay of core partials over SSE, then GET /v1/runs/:id.

#### C · Core API

**In one line.** The front door that takes your message and queues a turn.

**What it does.** One process answers HTTP, checks who you are, and puts the work on a durable queue. The web talks over HTTP; Slack talks to it in the same process.

**How it's built.** `src/index.ts` loads config, `src/wiring.ts` builds the graph, `src/api` (Fastify) serves `/v1/*`. `app.turn` in `src/api/app-turn.ts` identity-checks, authorizes scope, and **enqueues a run**.

**Steps in execution.**

1. **Accept** — Verify source-auth, a capability token, or signed portal identity.
2. **Authorize** — Resolve the principal and the scope (personal / channel / group / project / org).
3. **Enqueue** — deps.runs.enqueue; return {status:queued} when async=1.
4. **Drive** — Else processRun inline via drive() in src/api/app-helpers.ts.

**Questions.**

- **Q-C1** Which services[] are enabled in the org qm.config.jsonc (Slack? portal? auth vs Google/Slack OIDC? extra plugins?)
- **Q-C2** Scale and topology — workers, instance count, whether a standalone worker process is used, Fly HA (templates default --ha=false).
- **Q-C3** Operational exceptions — playground mode, ALLOW_UNAUTHENTICATED_CORE, shared Slack Connect rooms, published-app link holders.

#### O · Orchestrator

**In one line.** The loop that runs one turn from start to finish.

**What it does.** Once a run is claimed, this is what screens you, hires a harness, calls tools, and writes the result down. It is not a separate Loop service.

**How it's built.** `src/core/orchestrator.ts` **handleTurn** plus harness `runTurn`. README's "API · identity · policy · scheduler" are four concerns inside one process.

**Steps in execution.**

1. **Claim** — A worker or inline drive hands the Run to handleTurn.
2. **Screen** — Resolve principal, scope, policy, and the security screen.
3. **Drive** — Call the hired harness; tools hit execute, files, memory.
4. **Persist** — Session entries and run complete go to the store.

#### H · Harness

**In one line.** The hired coding agent that actually thinks on this turn.

**What it does.** QM does not ship one model brain. It hires Pi, OpenCode, Codex, or Claude Code — same tools, same core — so a deployment is not tied to one vendor.

**How it's built.** `src/harness/harness-router.ts` plus adapters for Pi, OpenCode, Codex, Claude, and mock. Interface: **runTurn, shouldRespond, judge, compact**. Mock is refused in production (`src/config.ts`).

**Steps in execution.**

1. **Choose** — Router picks an approved harness and model.
2. **Run** — runTurn walks the fixed tool surface.
3. **Unprompted** — shouldRespond decides silent / react / reply.
4. **Compact** — judge and compact when the thread is long.

**Questions.**

- ~~**Q-H1** Which harnesses exist?~~ ✓ Pi, OpenCode, Codex, Claude, and mock; mock is refused in production (2026-08-23).
- **Q-H2** Harness + models in force (HARNESS, approved harnesses, webui-models).

### What persists

#### PG · Postgres

**In one line.** Where sessions, runs, memory, and the cron queue live when this is real.

**What it does.** Production keeps the conversation, the job queue, grants, and the org layer in Postgres. On a laptop it can all be maps in RAM — those vanish on deploy.

**How it's built.** `src/persistence` plus Postgres stores for sessions, runs, memory, grants, and **deployment_layer**. Cron uses pg-boss when `DATABASE_URL` is set; else an interval sweeper. Dev can be in-memory `DurableMap`.

**Steps in execution.**

1. **Enqueue** — runs.enqueue writes a Run.
2. **Claim** — A worker leases the run (heartbeats, reaper, drain).
3. **Persist** — Session entries and run complete.
4. **Layer** — PUT /v1/deployment-layer hydrates org tools and skills.

#### MF · Memory & files

**In one line.** What this person or room already knows, plus the files it made.

**What it does.** Each person and each room has its own notebook and artifact pile. The agent can search, remember, and rewrite — scoped so one room does not leak into another.

**How it's built.** `src/memory` (notebook + strategy + optional model capture) and `src/files` (artifact registry + `durable-byte-store`). Bytes go to local disk or S3. Tools expose **memory search/read/remember/rewrite**.

**Steps in execution.**

1. **Search** — Notebook lookup in this scope.
2. **Remember** — Write a note the next turn can find.
3. **Files** — Artifacts and blobs stay with the scope.
4. **Capture** — Optional model-request capture (on by default).

### The computer

#### TL · Tools

**In one line.** The small set of things the agent is allowed to do.

**What it does.** Not an open plugin marketplace. A fixed surface: run a command, read or write a file, publish an app, remember something, start background work, talk on Slack.

**How it's built.** `src/tools/primitives.ts` `createToolContext` exposes **execute, read, write, publish, memory**, history, MCP, background, cron/webhook control, soul, artifacts, and Slack surface tools. Command policy runs inside execute and backgroundStart.

**Steps in execution.**

1. **Execute** — Shell in the scope sandbox; command policy classifies the text.
2. **Files** — read / write / publish artifacts.
3. **Memory** — search, read, remember, rewrite.
4. **Control** — background, cron, webhook, Slack post/react/edit.

#### SB · Sandbox

**In one line.** This person or room's own computer, where installed tools stay installed.

**What it does.** Every scope gets an isolated machine. Commands run there, not on the core. The image and org tools come from the deploy layer, not from QM itself.

**How it's built.** `src/sandbox/sandbox.ts` plus router `sandbox-routing.ts`. Backends: **local, sprites, smolmachines, aws** Lambda MicroVM. Optional secondary backend and migration runner. `SANDBOX_BACKEND` in `src/config.ts`.

**Steps in execution.**

1. **Route** — Pick the backend for this scope.
2. **Run** — sandbox.run for execute.
3. **Watch** — Process sessions if the backend supports them.
4. **Migrate** — Optional secondary backend + sandbox-migration-runner.

**Questions.**

- **Q-SB1** Sandbox backend + image digest actually pinned (sprites vs aws MicroVM vs local; secondary backend?).

#### G · Policy

**In one line.** Who you are, what this room allows, and whether the agent must pause.

**What it does.** The org picks one posture — Strict, Auto, or Dangerous — and narrower rooms can only tighten it. Even Dangerous still runs the command policy. That policy is a speed bump, not a sandbox.

**How it's built.** `src/identity`, `src/acl`, `src/policy/command-policy.ts`, `src/security/security-posture.ts` + screener, `src/resolution`. **Strict / Auto / Dangerous**; command policy applies in every posture.

**Steps in execution.**

1. **Identity** — Map the actor to a principal.
2. **Scope** — Membership, audience floor, egress policy.
3. **Posture** — Strict pauses every tool; Auto screens; Dangerous does not.
4. **Command policy** — Always-on rules inside execute, even in Dangerous.

**Questions.**

- **Q-G1** Posture in force (Strict/Auto/Dangerous) and whether a securityScreen proxy is wired.
- **Q-G2** Who the org admins are (runtime admin_grants, not the seed ADMIN_GRANTS env) and the identity keying (email vs Slack U ids; whether migrate-principals-to-email was run).

### Other surfaces

#### SL · Slack

**In one line.** The same agent, in Slack — started inside the core, not as a plugin.

**What it does.** Mention it, DM it, or follow a thread. Replies land in-thread. The web can read Slack sessions but will not write back into them.

**How it's built.** `src/slack` is an in-process Bolt client (Socket Mode by default), started from `src/surfaces/slack-runtime.ts`. `SlackCoreClient` calls **app.turn** in-process — not HTTP. There is no `plugins/slack`.

**Steps in execution.**

1. **Event** — Socket Mode app_mention / message.im / thread / reaction.
2. **Map** — Slack user → principal (email by default); conversation dm: or ch:.
3. **Turn** — SlackCoreClient → app.turn({surface:slack}).
4. **Reply** — Edit the Working message, or poll/ack deliveries.

**Questions.**

- ~~**Q-SL1** Is Slack a plugin under plugins/slack?~~ ✓ No. Slack is in-process src/slack, started by the core when tokens are present (2026-08-23).
- **Q-SL2** Real secrets and connected systems (model keys, Slack workspace, Resend/SMTP, GitHub OIDC trust, RDS snapshot policy).

#### CR · Scheduler

**In one line.** Work that fires when nobody is watching — a cron, a watch, or a webhook.

**What it does.** A scheduled job, a sandbox process you are watching, or a signed inbound POST all become the same kind of turn. If that turn needs a human and no one is there, it fails closed and leaves a note.

**How it's built.** `src/cron`, `src/monitors`, and `src/webhooks` share **src/triggers/run-trigger.ts**. Packet: {owner, ownerScopeId, input, fireKey, surface, destination?, message?}.

**Steps in execution.**

1. **Tick** — Leader lease or pg-boss job claims a due cron (or watch / webhook).
2. **Trigger** — runTrigger → app.turn with surface cron / monitor / webhook.
3. **Deliver** — Optional destination post to Slack or web.
4. **Fail closed** — Unattended require_approval records a note and does not wait.

#### AD · Admin

**In one line.** The org desk: posture, who is an admin, which harnesses and models are allowed.

**What it does.** A separate page for governance and looking around. Admins can read everything in a scope they administer — transcripts, memory, keychain metadata. Audited, not consent-gated.

**How it's built.** `plugins/admin` is a separate process that proxies **/v1/admin/**. Admin grant changes and impersonation are portal-only walls — the agent cannot do these itself.

**Steps in execution.**

1. **Open** — Separate process; source-auth to core.
2. **Govern** — Posture, approved harnesses, models, grants.
3. **Observe** — Transcripts, captured requests, memory, keychain metadata.
4. **Wall** — Grant changes and impersonation stay off the agent API.

### Operate and deploy

#### CL · qm CLI

**In one line.** The operator tool that reads your deploy directory and ships QM.

**What it does.** You point this at a folder of config, a sandbox image, tools, and secrets. It checks the contract, plans, and brings QM up in your cloud. That is not the same as the agent publishing a user app.

**How it's built.** `cli/`, package `@yc-software/qm`. Commands: init, check, doctor, plan, **qm up**, sandbox publish, secrets push, rollback. `qm up` PUTs the layer to `PUT /v1/deployment-layer`. Agent publish (`src/deploy`) is a different ship.

**Steps in execution.**

1. **Check** — qm check (static contract) then qm doctor (read-only cloud).
2. **Build** — qm sandbox publish or qm infra build-image.
3. **Up** — qm plan, then qm up --yes (docker | fly | aws).
4. **Layer** — source-auth PUT /v1/deployment-layer {contract:1, tools[], skills[]}.

**Questions.**

- ~~**Q-CL1** Does qm up ship a user app?~~ ✓ qm up ships QM; agent publish (src/deploy) ships a user app (2026-08-23).
- **Q-CL2** Which target and account this deployment actually uses (docker vs Fly org vs AWS account/region/cluster), and the live publicUrl.
- **Q-CL3** What lives in the org layer — custom tools, skills, brokered AWS roles, sandbox Dockerfile, connector OAuth clients.
- **Q-CL4** Whether this is a private fork (deploy/layers//) or a standalone deploy repo from qm init.

### Optional front door (designed for, not built)

#### PT · Portal _(not switched on)_

**In one line.** Later: a public front door that signs people in and proxies to the private apps.

**What it does.** Designed for, optional. When on, the browser hits the portal; the portal reverse-proxies the web UI and admin and hangs a signed identity on the request. Without it, you talk to core (and maybe the UI) directly.

**How it's built.** `plugins/portal` is a public SSO reverse proxy. It synthesizes a surface cookie and `x-portal-identity`. Auth can be `plugins/auth` or an external OIDC IdP. **Ghost**: typical install may skip it.

**Steps in execution.**

1. **Sign in** — SSO / IdP (built-in email or external).
2. **Proxy** — Reverse-proxy HTML/API under / to web-ui and admin.
3. **Identity** — Synthesize surface cookie + x-portal-identity.
4. **Passthrough** — Webhook incoming can go through the portal in prod.

## Flows (representative packets)

Payload shapes are what the design implies, not measured traffic.

### Web turn

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | UI → C | POST /v1/turns?async=1 | `{"surface":"web","actor":"you@org","conversation":"dm:you","text":"ship the weekly note","async":1}` |
| 2 | C → PG | runs.enqueue | `{"run":{"id":"run_1","surface":"web","status":"queued"}}` |
| 3 | C → O | handleTurn | `{"runId":"run_1"}` |
| 4 | O → G | resolve | `{"principal":"you@org","scope":"personal","posture":"auto"}` |
| 5 | O → H | runTurn | `{"harness":"pi"}` |
| 6 | H → TL | tool context | `{"tools":["execute","read","write","publish","memory"]}` |
| 7 | TL → SB | sandbox.run | `{"backend":"sprites","cmd":"ls"}` |
| 8 | O → PG | session + run complete | `{"session":"web:you","run":"complete"}` |
| 9 | C → UI | events | `{"status":"queued","runId":"run_1","then":"GET /v1/runs/run_1"}` |

### Slack turn

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | SL → C | app.turn | `{"surface":"slack","actor":"you@org","conversation":"ch:C123:1234.567","text":"@qm weekly note"}` |
| 2 | C → PG | runs.enqueue | `{"run":{"id":"run_2","surface":"slack","status":"queued"}}` |
| 3 | C → O | handleTurn | `{"runId":"run_2"}` |
| 4 | O → G | resolve | `{"principal":"you@org","scope":"channel","posture":"auto"}` |
| 5 | O → H | runTurn | `{"harness":"pi","shouldRespond":"reply"}` |
| 6 | H → TL | tool context | `{"tools":["execute","read","write"]}` |
| 7 | TL → SB | sandbox.run | `{"backend":"sprites","cmd":"ls"}` |
| 8 | O → SL | reply | `{"delivery":"in-thread","edit":"Working → done"}` |

### Cron fire

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | CR → C | runTrigger | `{"owner":"you@org","ownerScopeId":"personal","input":"weekly note","fireKey":"cron:weekly","surface":"cron","destination":"slack"}` |
| 2 | C → O | handleTurn | `{"runId":"run_3","origin":"automation"}` |
| 3 | O → G | resolve | `{"principal":"you@org","scope":"personal","posture":"auto"}` |
| 4 | O → H | runTurn | `{"harness":"pi"}` |
| 5 | H → TL | tool context | `{"tool":"execute"}` |
| 6 | TL → SB | sandbox.run | `{"backend":"sprites","cmd":"ls"}` |
| 7 | O → SL | destination post | `{"surface":"cron","destination":"slack"}` |

### qm up

| # | From → To | Packet | Representative payload |
|---|---|---|---|
| 1 | CL → C | PUT /v1/deployment-layer | `{"contract":1,"tools":[],"skills":[]}` |
| 2 | C → PG | layer store | `{"table":"deployment_layer","version":"sha256:…"}` |

## Questions — index

Reference by ID. ✓ resolved (with date) · otherwise open.

- **Q-C1** (C) Which services[] are enabled in the org qm.config.jsonc (Slack? portal? auth vs Google/Slack OIDC? extra plugins?)
- **Q-C2** (C) Scale and topology — workers, instance count, whether a standalone worker process is used, Fly HA (templates default --ha=false).
- **Q-C3** (C) Operational exceptions — playground mode, ALLOW_UNAUTHENTICATED_CORE, shared Slack Connect rooms, published-app link holders.
- ~~**Q-H1**~~ (H) ✓ Pi, OpenCode, Codex, Claude, and mock; mock is refused in production (2026-08-23).
- **Q-H2** (H) Harness + models in force (HARNESS, approved harnesses, webui-models).
- **Q-SB1** (SB) Sandbox backend + image digest actually pinned (sprites vs aws MicroVM vs local; secondary backend?).
- **Q-G1** (G) Posture in force (Strict/Auto/Dangerous) and whether a securityScreen proxy is wired.
- **Q-G2** (G) Who the org admins are (runtime admin_grants, not the seed ADMIN_GRANTS env) and the identity keying (email vs Slack U ids; whether migrate-principals-to-email was run).
- ~~**Q-SL1**~~ (SL) ✓ No. Slack is in-process src/slack, started by the core when tokens are present (2026-08-23).
- **Q-SL2** (SL) Real secrets and connected systems (model keys, Slack workspace, Resend/SMTP, GitHub OIDC trust, RDS snapshot policy).
- ~~**Q-CL1**~~ (CL) ✓ qm up ships QM; agent publish (src/deploy) ships a user app (2026-08-23).
- **Q-CL2** (CL) Which target and account this deployment actually uses (docker vs Fly org vs AWS account/region/cluster), and the live publicUrl.
- **Q-CL3** (CL) What lives in the org layer — custom tools, skills, brokered AWS roles, sandbox Dockerfile, connector OAuth clients.
- **Q-CL4** (CL) Whether this is a private fork (deploy/layers//) or a standalone deploy repo from qm init.

## What the platform gives vs what we own

**Platform gives:** generic core, harness interfaces, Fastify API, Slack-in-process, optional web/admin/portal

**We own:** org deploy directory (config, sandbox image, tools/skills, infra, secrets)

## Planned filesystem

```
src/                 Node/TS headless core
  index.ts           entry; optional Slack start
  wiring.ts          substrate interfaces
  api/               Fastify /v1/*
  core/              orchestrator handleTurn
  harness/           Pi, OpenCode, Codex, Claude, mock
  tools/             primitives.ts
  sandbox/           local / sprites / smolmachines / aws
  persistence/       Postgres pool · DurableMap · S3
  slack/             in-process Bolt (not a plugin)
  cron/ monitors/ webhooks/ triggers/
  memory/ files/ sessions/ runs/
  identity/ acl/ policy/ security/ resolution/
  deploy/            agent publish (user apps)
  deployment/        org layer store
plugins/
  web-ui/            Vite + Lit
  admin/
  portal/            optional public SSO
  auth/              email magic-link OIDC
  onboarding/        skill, not a process
  chassis/           shared library
cli/                 @yc-software/qm
deploy/              layers/<org>/ (private fork)
docs/                getting-started · deploy-directory · screenshots
```

## How this file is maintained

Generated from `atlas/data.mjs` by `node atlas/build.mjs`, which also builds the interactive atlas (`atlas.html`). Edit the data file, rebuild, republish — never edit this file by hand.
